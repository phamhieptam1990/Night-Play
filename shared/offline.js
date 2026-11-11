/* Đăng ký "service worker": cho phép mở game ngay cả khi mất mạng (xem /sw.js). Im lặng, không báo gì cho người chơi. */
(function () {
  if (!("serviceWorker" in navigator)) return;
  var host = location.hostname;
  if (location.protocol !== "https:" && host !== "localhost" && host !== "127.0.0.1") return;   // service worker chỉ chạy trên https (hoặc localhost)
  /* Cài SW nhẹ; phần còn lại của SHELL (offline đầy đủ) tải NỀN khi trang đã tải xong + trình duyệt rảnh, mạng không yếu/tiết kiệm dữ liệu (sw.js "precache") */
  var bg = function (reg) {
    var c = navigator.connection || {}; if (c.saveData || /(^|-)2g$/.test(c.effectiveType || "")) return;
    var run = function () { try { var w = reg.active || navigator.serviceWorker.controller; if (w) w.postMessage({ np: "precache" }); } catch (e) {} };
    var idle = function () { (window.requestIdleCallback || function (f) { setTimeout(f, 1); })(run, { timeout: 8000 }); };
    setTimeout(idle, 3000);
  };
  var go = function () { navigator.serviceWorker.register("/sw.js").then(function (r) { navigator.serviceWorker.ready.then(bg); }).catch(function () {}); };
  if (document.readyState === "complete") go(); else addEventListener("load", go);
})();
