/* CHỐNG TỰ PHÓNG TO trang game (iOS Safari bỏ qua maximum-scale): chặn pinch/gesture/double-tap zoom, và nếu trang vẫn bị phóng (visualViewport.scale>1) thì tự đặt lại về 1.
   Không chặn chạm 1 ngón (nút vẫn bấm bình thường). Nạp sớm trong <head> hoặc cuối body. */
(function () {
  "use strict";
  var st = document.createElement("style");
  st.textContent = "html,body{touch-action:pan-x pan-y;-webkit-text-size-adjust:100%;text-size-adjust:100%}input,textarea,select{font-size:16px}html[data-wk-fit] .wk-hud{zoom:var(--wk-s,1)}";
  document.head.appendChild(st);
  var opt = { passive: false };
  ["gesturestart", "gesturechange", "gestureend"].forEach(function (n) { document.addEventListener(n, function (e) { e.preventDefault(); }, opt); });
  document.addEventListener("touchmove", function (e) { if (e.touches && e.touches.length > 1) e.preventDefault(); }, opt);
  var last = 0;
  document.addEventListener("touchend", function (e) { var t = Date.now(); if (t - last < 320 && e.touches.length === 0 && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) && !e.target.closest("a,button")) e.preventDefault(); last = t; }, opt);
  function reset() {
    var vv = window.visualViewport; if (!vv || vv.scale <= 1.01) return;
    var m = document.querySelector('meta[name="viewport"]'); if (!m) return;
    var old = m.getAttribute("content"); m.setAttribute("content", "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover");
    window.scrollTo(0, 0); setTimeout(function () { m.setAttribute("content", old); }, 120);
  }
  /* HUD co theo khung hẹp/thấp (trình duyệt zoom to → khung CSS nhỏ): --wk-s = 0.45..1, game dùng cho vị trí cảnh dưới HUD */
  function fit() { var s = Math.max(0.45, Math.min(1, innerWidth / 400, innerHeight / 380)); document.documentElement.style.setProperty("--wk-s", s.toFixed(3)); if (window.WKFit) WKFit(s); }
  fit(); addEventListener("resize", fit); addEventListener("orientationchange", function () { setTimeout(fit, 120); });
  if (window.visualViewport) { visualViewport.addEventListener("resize", fit); }
  if (window.visualViewport) { visualViewport.addEventListener("resize", function () { clearTimeout(reset.t); reset.t = setTimeout(reset, 250); }); }
})();
