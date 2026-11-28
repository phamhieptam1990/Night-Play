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

/* Nhắc tải lại khi có bản mới: build ghi mã bản (NP_BUILD) vào đầu tệp này và /version.json; so hai mã khi quay lại tab, có mạng lại, mỗi 10 phút, và khi service worker mới nhận quyền.
   Cổng (/play/, /cozyplay/, /popplay/): tự tải lại lúc người chơi quay lại tab (không có ván nào để mất). Trang khác (game): hiện viên thuốc nhỏ "Có bản mới · Cập nhật" ở đáy, tự ẩn sau 5 giây, không chặn thao tác. */
(function () {
  if (typeof NP_BUILD === "undefined" || !NP_BUILD || !window.fetch) return;
  var host = location.hostname;
  if (location.protocol !== "https:" && host !== "localhost" && host !== "127.0.0.1") return;
  var busy = false, shown = false, KEY = "np-newver-tried";
  var get = function () { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } };
  var set = function (v) { try { sessionStorage.setItem(KEY, v); } catch (e) {} };
  var DONE = "np-upd-done";
  /* tải lại ĐÚNG bản mới: nhờ service worker làm tươi mọi tệp đã lưu (css/js/html trước) rồi mới tải lại; tối đa chờ 6 giây (mạng chậm vẫn tải lại, lần sau tự đồng bộ nền) */
  var reload = function (id, ver) {
    set(id); try { sessionStorage.setItem(DONE, ver || "1"); } catch (e) {}
    var fired = false, go = function () { if (fired) return; fired = true; location.reload(); };
    try { var w = navigator.serviceWorker && navigator.serviceWorker.controller;
      if (w) { navigator.serviceWorker.addEventListener("message", function (e) { if (e.data && e.data.np === "fresh") go(); }); w.postMessage({ np: "refresh" }); setTimeout(go, 6000); return; } } catch (e) {}
    setTimeout(go, 250);
  };
  /* thanh thông báo ở đáy màn hình, tự đóng sau 5 giây; act (tuỳ chọn) = bấm vào để cập nhật */
  var toast = function (text, act) {
    if (shown || !document.body) return; shown = true;
    var b = document.createElement(act ? "button" : "div");
    if (act) b.type = "button"; b.setAttribute("role", "status"); b.setAttribute("aria-live", "polite");
    b.textContent = text;
    b.style.cssText = "position:fixed;left:50%;bottom:calc(10px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483000;max-width:calc(100vw - 32px);padding:9px 16px;border:0;border-radius:999px;font:600 13px/1.2 system-ui,sans-serif;color:#fff;background:linear-gradient(90deg,#7c5cff,#ff8a3d);box-shadow:0 4px 16px rgba(0,0,0,.35);white-space:nowrap;transition:opacity .4s" + (act ? ";cursor:pointer" : ";pointer-events:none");
    if (act) b.onclick = act;
    document.body.appendChild(b);
    if (act) return;   /* viên thuốc "Có bản mới · Cập nhật" nằm lại tới khi bấm (trước đây tự ẩn sau 5 giây nên dễ bỏ lỡ khi đang chơi) */
    setTimeout(function () { b.style.opacity = "0"; setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); shown = false; }, 450); }, 5000);
  };
  var isEn = function () { return document.documentElement.lang === "en"; };
  /* vừa tải lại để lên bản mới: báo "Đã cập nhật" 5 giây (kể cả trang cổng tự tải lại, không có thao tác của người chơi) */
  try {
    var done = sessionStorage.getItem(DONE);
    if (done) { sessionStorage.removeItem(DONE); var say = function () { toast((isEn() ? "Updated to the new version" : "Đã cập nhật bản mới") + (done !== "1" ? " · v" + done : "")); }; if (document.body) say(); else document.addEventListener("DOMContentLoaded", say); }
  } catch (e) {}
  /* CHỈ CẬP NHẬT KHI Ở MÀN CHÍNH (chủ site: "đang chơi thì không được update, ra màn hình chính mới update"): trang cổng = không có game mở trong khung (#stage.on);
     game = đang ở màn chọn (#home / #ovStart hiện), không ở màn chơi / kết thúc / đếm 3-2-1 / hiệu ứng vào game. Có bản mới mà đang chơi thì chỉ GHI NHỚ (không hiện gì, không tải lại), ra màn chính mới tự cập nhật. */
  var pend = null, wait = false;
  var atMain = function () {
    try {
      var st = document.getElementById("stage"); if (st && /^\/(play|cozyplay|popplay)\/(index\.html)?$/.test(location.pathname)) return !st.classList.contains("on");   /* #stage chỉ là khung game của TRANG CỔNG; game có #stage riêng thì không tính */
      if (document.querySelector("[data-npa-veil],[data-npa-ghost]") || document.documentElement.classList.contains("np-playing")) return false;
      var h = document.getElementById("home"), o = document.getElementById("ovStart");
      if (h || o) return !!((h && !h.hidden) || (o && !o.hidden));
      return true;   // game một màn không có màn chọn: không đang chơi thì cho cập nhật
    } catch (e) { return false; }
  };
  var apply = function () {
    if (!pend || wait || !atMain()) return;
    var j = pend; wait = true;
    toast((isEn() ? "New version" : "Có bản mới") + (j.ver ? " v" + j.ver : "") + (isEn() ? " · updating…" : " · đang cập nhật…"));
    setTimeout(function () { wait = false; if (atMain()) { pend = null; reload(j.id, j.ver); } }, 1500);   // vào ván trong 1,5 giây này thì thôi, chờ lần ra màn chính sau
  };
  setInterval(apply, 2000);
  var check = function () {
    if (busy || document.visibilityState === "hidden") return; busy = true;
    fetch("/version.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      busy = false; if (!j || !j.id || j.id === NP_BUILD) return;
      if (get() === j.id) return;                        // đã thử tải lại cho mã này mà vẫn khác: không lặp vô hạn
      pend = j; apply();
    }).catch(function () { busy = false; });
  };
  document.addEventListener("visibilitychange", check);
  addEventListener("online", check);
  try { navigator.serviceWorker.addEventListener("controllerchange", check); } catch (e) {}
  setInterval(check, 600000);
  setTimeout(check, 4000);
})();
