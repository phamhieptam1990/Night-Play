/* Màn chờ tải trang cho khu Học Vui (mọi trang learn/*). Nạp ĐỒNG BỘ ở <head>:
   dựng lớp phủ ngay khi trang bắt đầu tải, gỡ khi trang + phông đã sẵn sàng (tối thiểu 350ms, tối đa 8s). */
(function () {
  if (window.__plDone) return;
  var de = document.documentElement, s = document.currentScript, t0 = Date.now(), el, gone = false;
  var en = false;
  try { en = localStorage.getItem("lang") === "en"; } catch (e) {}
  if (s && s.src) {
    var l = document.createElement("link");
    l.rel = "stylesheet"; l.href = s.src.replace(/js\/page-loading\.js.*$/, "css/page-loading.css");
    document.head.appendChild(l);
  }
  var th = "";
  try { th = localStorage.getItem("theme"); } catch (e) {}
  var dark = th === "dark" || (th !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  de.classList.toggle("pl-dark", dark);
  el = document.createElement("div");
  el.id = "plLoad"; el.className = "pl-load"; el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite");
  el.style.cssText = "position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:" + (dark ? "#12141F" : "#F6F4F1");
  el.innerHTML = '<div class="pl-box"><div class="pl-mas" aria-hidden="true"><span>🐾</span></div>' +
    '<div class="pl-dots" aria-hidden="true"><i></i><i></i><i></i></div>' +
    '<p class="pl-txt">' + (en ? "Loading…" : "Đang tải…") + "</p></div>";
  de.appendChild(el);
  function hide() {
    if (gone) return; gone = true; window.__plDone = 1;
    el.classList.add("out");
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
  }
  function ready() {
    var wait = Math.max(0, 350 - (Date.now() - t0));
    var f = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    f.then(function () { setTimeout(hide, wait); }, function () { setTimeout(hide, wait); });
  }
  if (document.readyState === "complete") ready(); else window.addEventListener("load", ready);
  window.addEventListener("pageshow", function (e) { if (e.persisted) hide(); });
  setTimeout(hide, 8000);
})();
