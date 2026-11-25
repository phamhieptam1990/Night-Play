/* TRÒ "SAO RƠI" (sân sau): sao từ trời rơi xuống, kéo/chạm trên sân để Bi chạy đón; sao vàng ×3; hụt sao chỉ làm đứt combo (không phạt). */
(function (N) {
  "use strict";
  var move = null, Q = N.mgKinds;
  Q.stars = {
    init: function (G) {
      G.ents = []; G.sp = .3; var rm = N.$("rm");
      move = function (e) { var r = rm.getBoundingClientRect(); N.petX(Math.max(10, Math.min(90, (e.clientX - r.left) / r.width * 100)), true); };
      rm.addEventListener("pointerdown", move); rm.addEventListener("pointermove", move);
    },
    step: function (G, dt) {
      var rm = N.$("rm"), rr = rm.getBoundingClientRect(), pr = N.petRect(), i, e;
      G.sp -= dt;
      if (G.sp <= 0) {
        var gold = G.rnd() < .13, x = 10 + G.rnd() * 80, el = document.createElement("img"); el.className = "mgs" + (gold ? " gold" : ""); el.src = N.art("sao"); el.alt = ""; rm.appendChild(el);
        G.ents.push({ el: el, x: x, y: 0, gold: gold, vy: (34 + G.clock * .9) * (gold ? 1.25 : 1) }); G.sp = Math.max(.32, .62 - G.clock * .008) + G.rnd() * .2;
      }
      for (i = G.ents.length - 1; i >= 0; i--) {
        e = G.ents[i]; e.y += e.vy * dt; e.el.style.left = e.x + "%"; e.el.style.top = e.y + "%";
        var cx = rr.left + e.x / 100 * rr.width, cy = rr.top + e.y / 100 * rr.height;
        if (cx > pr.left + pr.width * .12 && cx < pr.right - pr.width * .12 && cy > pr.top + pr.height * .1 && cy < pr.top + pr.height * .65) {
          G.gain(e.gold ? 3 : 1, cx, cy); e.el.remove(); G.ents.splice(i, 1);
        } else if (e.y > 104) { e.el.remove(); G.ents.splice(i, 1); G.miss(); }
      }
    },
    stop: function (G) {
      (G.ents || []).forEach(function (e) { e.el.remove(); }); G.ents = []; var rm = N.$("rm");
      if (move) { rm.removeEventListener("pointerdown", move); rm.removeEventListener("pointermove", move); move = null; }
    }
  };
})(window.NTV);
