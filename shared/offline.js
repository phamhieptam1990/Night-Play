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
  var portal = /^\/(play|cozyplay|popplay)\/(index\.html)?$/.test(location.pathname);
  var busy = false, shown = false, KEY = "np-newver-tried";
  var get = function () { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } };
  var set = function (v) { try { sessionStorage.setItem(KEY, v); } catch (e) {} };
  var reload = function (id) { set(id); try { var w = navigator.serviceWorker && navigator.serviceWorker.controller; if (w) w.postMessage({ np: "precache" }); } catch (e) {} setTimeout(function () { location.reload(); }, 250); };
  var pill = function (id) {
    if (shown || !document.body) return; shown = true;
    var en = document.documentElement.lang === "en", b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-live", "polite");
    b.textContent = (en ? "New version · Update" : "Có bản mới · Cập nhật");
    b.style.cssText = "position:fixed;left:50%;bottom:calc(10px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483000;max-width:calc(100vw - 32px);padding:9px 16px;border:0;border-radius:999px;font:600 13px/1.2 system-ui,sans-serif;color:#fff;background:linear-gradient(90deg,#7c5cff,#ff8a3d);box-shadow:0 4px 16px rgba(0,0,0,.35);cursor:pointer;white-space:nowrap;transition:opacity .4s";
    b.onclick = function () { reload(id); };
    document.body.appendChild(b);
    setTimeout(function () { b.style.opacity = "0"; setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); shown = false; }, 450); }, 5000);
  };
  var check = function () {
    if (busy || document.visibilityState === "hidden") return; busy = true;
    fetch("/version.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      busy = false; if (!j || !j.id || j.id === NP_BUILD) return;
      if (get() === j.id) return;                        // đã thử tải lại cho mã này mà vẫn khác: không lặp vô hạn
      if (portal) reload(j.id); else pill(j.id);
    }).catch(function () { busy = false; });
  };
  document.addEventListener("visibilitychange", check);
  addEventListener("online", check);
  try { navigator.serviceWorker.addEventListener("controllerchange", check); } catch (e) {}
  setInterval(check, 600000);
  setTimeout(check, 4000);
})();
