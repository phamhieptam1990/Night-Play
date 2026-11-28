/* TẮT PHÓNG TO của trình duyệt (nạp từ guard.js ở mọi trang; trang con vườn nạp trực tiếp): khoá viewport, chặn chụm 2 ngón / chạm đúp (touch-action),
   gesture của Safari iOS, Ctrl/⌘ + lăn chuột và Ctrl/⌘ + (+ − 0) trên máy tính. Ô nhập chữ vẫn gõ bình thường. */
(function () {
  "use strict";
  var FIX = "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover";
  function meta() {
    var m = document.querySelector('meta[name="viewport"]');
    if (!m && document.head) { m = document.createElement("meta"); m.name = "viewport"; document.head.appendChild(m); }
    if (m && !/user-scalable=no/.test(m.content)) m.content = FIX;
  }
  meta(); document.addEventListener("DOMContentLoaded", meta);
  var st = document.createElement("style"); st.textContent = "html{touch-action:pan-x pan-y;-webkit-text-size-adjust:100%;text-size-adjust:100%}";
  (document.head || document.documentElement).appendChild(st);
  ["gesturestart", "gesturechange", "gestureend"].forEach(function (n) { document.addEventListener(n, function (e) { e.preventDefault(); }, { passive: false }); });
  addEventListener("wheel", function (e) { if (e.ctrlKey || e.metaKey) e.preventDefault(); }, { passive: false });
  addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && /^(=|\+|-|_|0|Add|Subtract)$/.test(e.key)) e.preventDefault();
  }, true);
})();
