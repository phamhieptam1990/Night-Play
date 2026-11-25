/* SỐNG ĐỘNG: thú chớp mắt, thú ngồi nhai, bướm bay trong vườn. Các hiệu ứng thở / đi qua lại / z-z-z là CSS (css/20-pen.css). Tôn trọng prefers-reduced-motion. */
(function (V) {
  "use strict";
  var timers = [];
  function pets(st) { return [].slice.call(st.querySelectorAll(".pen:not(.lock) .pet")); }
  function swap(p, suf, ms) { var base = V.NB + p.dataset.art; p.src = base + suf + ".svg"; setTimeout(function () { p.src = base + (p.dataset.mode === "sleep" ? "-sleep" : "") + ".svg"; }, ms); }
  V.life = function (st) {
    timers.forEach(clearInterval); timers = []; if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    pets(st).forEach(function (p, i) {
      if (p.dataset.mode === "sleep") return;
      timers.push(setInterval(function () { swap(p, "-blink", 150); }, 3200 + i * 700));
      if (p.dataset.mode === "chew") timers.push(setInterval(function () { swap(p, "-chew", 700); }, 2600));
    });
    for (var k = 0; k < 3; k++) { var b = document.createElement("i"); b.className = "bfly b" + k; b.innerHTML = '<svg viewBox="0 0 24 20"><path d="M12 10C6 0 0 3 2 9s8 4 10 1z" fill="#FF8FB1"/><path d="M12 10c6-10 12-7 10-1s-8 4-10 1z" fill="#FFB86B"/><path d="M12 10C5 12 4 20 9 19s3-6 3-9zM12 10c7 2 8 10 3 9s-3-6-3-9z" fill="#FFD0A0"/><rect x="11" y="5" width="2" height="12" rx="1" fill="#5A3A2A"/></svg>'; st.appendChild(b); }
  };
})(window.VT);
