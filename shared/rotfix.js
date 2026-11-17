/* TỰ CHỮA KHI XOAY / ĐỔI CỠ (iPad Safari: xoay ngang↔dọc nhiều lần, kể cả đang toàn màn hình): trang game/cổng bị cuộn lệch (scrollTop ≠ 0 trên html/body/khung overflow:hidden) → xuất hiện thanh cuộn, nội dung lệch, vuốt không về được, chỉ còn refresh.
   Nạp từ shared/resume.js (mọi game) và hai trang cổng. Không đụng danh sách cuộn thật (overflow:auto/scroll). Chỉ chạy khi trang là màn game (#play/.app) hoặc cổng đang chơi (html.playing / np-fs). */
(function () {
  if (window.__npRotFix) return; window.__npRotFix = 1;
  var de = document.documentElement, timers = [];
  function isGame() { return !!(document.getElementById("play") || document.querySelector(".app") || de.classList.contains("playing") || de.classList.contains("np-fs")); }
  function fix() {
    try {
      if (!isGame()) return;
      if (window.scrollY || window.scrollX) window.scrollTo(0, 0);
      var se = document.scrollingElement || de; if (se.scrollTop) se.scrollTop = 0; if (se.scrollLeft) se.scrollLeft = 0;
      if (document.body && (document.body.scrollTop || document.body.scrollLeft)) { document.body.scrollTop = 0; document.body.scrollLeft = 0; }
      var all = document.body ? document.body.getElementsByTagName("*") : [], i, e, cs;
      for (i = 0; i < all.length; i++) {
        e = all[i]; if (!e.scrollTop && !e.scrollLeft) continue;
        cs = getComputedStyle(e);
        /* KHÔNG đụng khung cuộn THẬT (overflow auto/scroll ở một trục: dải thẻ trượt ngang, danh sách cuộn, popup…) — lỗi trước: dải slide cứ bị kéo về thẻ đầu. Chỉ chữa khung bị khoá cứng cả hai trục (hidden/clip/visible). */
        if (/^(auto|scroll|overlay)$/.test(cs.overflowX) || /^(auto|scroll|overlay)$/.test(cs.overflowY)) continue;
        if (cs.overflowY === "hidden" || cs.overflowY === "clip" || cs.overflowX === "hidden" || cs.overflowX === "clip") { e.scrollTop = 0; e.scrollLeft = 0; }
      }
    } catch (x) {}
  }
  function later() { timers.forEach(clearTimeout); timers = [0, 120, 450, 1100].map(function (ms) { return setTimeout(fix, ms); }); }
  addEventListener("resize", later); addEventListener("orientationchange", later); addEventListener("pageshow", later);
  document.addEventListener("fullscreenchange", later); document.addEventListener("webkitfullscreenchange", later);
  try { if (window.visualViewport) visualViewport.addEventListener("resize", later); } catch (e) {}
  new MutationObserver(function () { later(); }).observe(de, { attributes: true, attributeFilter: ["class"] });   /* bật/tắt np-fs, playing */
})();
