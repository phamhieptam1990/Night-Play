/* TRÒ "BI ĐỚP BÓNG" (phòng khách): chạm một chỗ trong phòng để ném bóng tới đó, Bi chạy đón và đớp. Ném xa +1, bóng vào vành hiện lên trên tường +3, đớp liền nhau thì combo. */
(function (N) {
  "use strict";
  var tapH = null, Q = N.mgKinds, tm = [];
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  function later(fn, ms) { tm.push(setTimeout(fn, ms)); }
  Q.ball = {
    init: function (G) {
      var rm = N.$("rm"), b = document.createElement("img"); b.className = "toyf mgb"; b.src = N.art("bong"); b.alt = ""; b.style.left = "50%"; b.style.top = "90%"; rm.appendChild(b);
      G.ball = b; G.st = "idle"; G.hoop = null; G.hT = 2; G.px = 50;
      tapH = function (e) {
        if (G.st !== "idle" || !G.run) return; var r = rm.getBoundingClientRect(), tx = clamp((e.clientX - r.left) / r.width * 100, 8, 92), ty = clamp((e.clientY - r.top) / r.height * 100, 36, 92);
        G.st = "fly"; var from = G.px; b.style.transition = "left .5s linear,top .25s ease-out"; b.style.left = tx + "%"; b.style.top = Math.max(18, Math.min(ty, 60) - 20) + "%";
        N.petX(clamp(tx, 14, 86), true); G.px = tx;
        later(function () { b.style.transition = "left .5s linear,top .25s ease-in"; b.style.top = ty + "%"; }, 250);
        later(function () {
          if (!G.run) return; var pts = 1 + (Math.abs(tx - from) > 35 ? 1 : 0), h = G.hoop;
          if (h && Math.hypot(tx - h.x, (ty - h.y) * 1.3) < 15) { pts += 3; h.el.remove(); G.hoop = null; G.hT = 2.5; }
          if (G.clock - (G.lastC || -9) > 3.2) G.combo = 0; G.lastC = G.clock;
          var pr = N.petRect(); b.style.opacity = 0; N.setExp("cun-chew", 280); G.gain(pts, pr.left + pr.width / 2, pr.top);
        }, 540);
        later(function () { if (!G.run) return; N.petX(50, true); G.px = 50; b.style.transition = "none"; b.style.left = "50%"; b.style.top = "90%"; b.style.opacity = 1; G.st = "idle"; }, 960);
      };
      rm.addEventListener("pointerup", tapH);
    },
    step: function (G, dt) {
      if (G.hoop) { G.hoop.life -= dt; if (G.hoop.life <= 0) { G.hoop.el.remove(); G.hoop = null; G.hT = 2.2; } return; }
      G.hT -= dt; if (G.hT > 0) return; var x = 22 + G.rnd() * 56, y = 38 + G.rnd() * 22, el = document.createElement("div"); G.hn = (G.hn | 0) + 1; el.className = "hoop" + (G.hn <= 2 ? " cue" : ""); el.style.left = x + "%"; el.style.top = y + "%";
      N.$("rm").appendChild(el); G.hoop = { el: el, x: x, y: y, life: 4.5 };
    },
    stop: function (G) {
      tm.forEach(clearTimeout); tm = []; if (G.ball) G.ball.remove(); if (G.hoop) G.hoop.el.remove(); G.hoop = null;
      if (tapH) { N.$("rm").removeEventListener("pointerup", tapH); tapH = null; }
    }
  };
})(window.NB);
