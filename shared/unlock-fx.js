/* NHẬN QUÀ / TỰ MỞ có hiệu ứng (khu chợ, vườn thú, vườn): món đủ điều kiện mở thì hiện "chờ mở", bé CHẠM 3 lần vào hộp quà (rung mạnh dần) → bung pháo giấy + lộ món mới.
   Đã mở thì nhớ ở localStorage "unlock:<phạm vi>" (không hỏi lại). Có âm "ting" khi loa bật (PlaySound).
   UnlockFx.seen(scope, id) · UnlockFx.mark(scope, id) · UnlockFx.celebrate({title, img, emoji, taps, done}) */
(function (root) {
  "use strict";
  function rd(s) { try { return JSON.parse(localStorage.getItem("unlock:" + s) || "{}") || {}; } catch (e) { return {}; } }
  function seen(s, id) { return !!rd(s)[id]; }
  function mark(s, id) { var o = rd(s); o[id] = 1; try { localStorage.setItem("unlock:" + s, JSON.stringify(o)); } catch (e) {} }
  function el(c, h) { var e = document.createElement("div"); e.className = c; if (h != null) e.innerHTML = h; return e; }
  var AC = null;
  function ting(i) {   /* âm "ting" đi lên theo lần chạm; lần cuối là hợp âm vui */
    if (root.PlaySound ? !PlaySound.on() : (function () { try { return localStorage.getItem("play:snd") === "0" || localStorage.getItem("learn:auto") === "0"; } catch (e) { return false; } })()) return;
    try { AC = AC || new (root.AudioContext || root.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); } catch (e) { return; }
    var notes = i < 0 ? [72, 76, 79, 84] : [60 + i * 4], t = AC.currentTime;
    notes.forEach(function (m, k) { var o = AC.createOscillator(), g = AC.createGain(); o.type = "triangle"; o.frequency.value = 440 * Math.pow(2, (m - 69) / 12);
      g.gain.setValueAtTime(0, t + k * .07); g.gain.linearRampToValueAtTime(.12, t + k * .07 + .02); g.gain.exponentialRampToValueAtTime(.001, t + k * .07 + .6); o.connect(g); g.connect(AC.destination); o.start(t + k * .07); o.stop(t + k * .07 + .7); });
  }
  function confetti(box) {
    var cols = ["#FFD24D", "#FF8FA3", "#7CE0B4", "#8FB6FF", "#FFB347", "#C79BFF"];
    for (var k = 0; k < 34; k++) {
      var p = el("ufx-c"); p.style.background = cols[k % 6]; var a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 170; box.appendChild(p);
      p.animate([{ transform: "translate(-50%,-50%) scale(1) rotate(0)", opacity: 1 }, { transform: "translate(" + (Math.cos(a) * d) + "px," + (Math.sin(a) * d - 60) + "px) scale(.6) rotate(" + (Math.random() * 720 - 360) + "deg)", opacity: 0 }],
        { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = (function (e) { return function () { e.remove(); }; })(p);
    }
  }
  function celebrate(o) {
    var need = o.taps || 3, n = 0, fin = false, ov = el("ufx"); ov.setAttribute("role", "dialog"); ov.setAttribute("aria-label", "Quà mới");
    var tt = el("ufx-t", "Có quà mới cho em!"), gift = document.createElement("button"); gift.type = "button"; gift.className = "ufx-g"; gift.setAttribute("aria-label", "Chạm để mở quà");
    gift.innerHTML = "<span class='ufx-lid'>🎀</span><span class='ufx-bx'>🎁</span>";
    var hint = el("ufx-h", "Chạm vào hộp quà " + need + " lần để mở!"), dots = el("ufx-d");
    for (var i = 0; i < need; i++) dots.appendChild(el("ufx-o"));
    [tt, gift, dots, hint].forEach(function (e) { ov.appendChild(e); }); document.body.appendChild(ov);
    function close() { if (!ov.parentNode) return; ov.classList.add("out"); setTimeout(function () { ov.remove(); }, 260); if (o.done) o.done(); }
    function open() {
      fin = true; ting(-1); gift.remove(); hint.remove(); dots.remove(); tt.textContent = "Mở rồi! 🎉"; ov.classList.add("pop");
      var r = el("ufx-r", (o.img ? "<img alt='' src='" + o.img + "'>" : "<span>" + (o.emoji || "✨") + "</span>") + "<b>" + (o.title || "") + "</b>"); ov.insertBefore(r, tt.nextSibling); confetti(r);
      var ok = document.createElement("button"); ok.type = "button"; ok.className = "ufx-ok"; ok.textContent = "Tuyệt vời!"; ok.onclick = close; ov.appendChild(ok); try { ok.focus({ preventScroll: true }); } catch (e) {}
      setTimeout(close, 4500);
    }
    gift.onclick = function () {
      if (fin) return; dots.children[n] && dots.children[n].classList.add("on"); ting(n); n++;
      gift.classList.remove("shk"); void gift.offsetWidth; gift.classList.add("shk"); gift.style.setProperty("--k", 1 + n * .12);
      if (n >= need) setTimeout(open, 260); else hint.textContent = "Thêm " + (need - n) + " lần nữa!";
    };
    try { gift.focus({ preventScroll: true }); } catch (e) {}
  }
  root.UnlockFx = { seen: seen, mark: mark, celebrate: celebrate, ting: ting };
})(window);
