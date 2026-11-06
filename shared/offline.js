/* Đăng ký "service worker": cho phép mở game ngay cả khi mất mạng (xem /sw.js). Im lặng, không báo gì cho người chơi. */
(function () {
  if (!("serviceWorker" in navigator)) return;
  var host = location.hostname;
  if (location.protocol !== "https:" && host !== "localhost" && host !== "127.0.0.1") return;   // service worker chỉ chạy trên https (hoặc localhost)
  var go = function () { navigator.serviceWorker.register("/sw.js").catch(function () {}); };
  if (document.readyState === "complete") go(); else addEventListener("load", go);
})();
