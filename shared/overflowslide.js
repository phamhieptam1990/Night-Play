/* DANH SÁCH TRÀN → SLIDE (mọi game Pop): nếu màn chọn (#home / #ovStart / #village) cao hơn khung nhìn (màn web/iPad thấp, có thẻ "Tiếp tục ván dở"...), danh sách thẻ game (.cards / .tiles) tự đổi thành DẢI TRƯỢT NGANG (scroll-snap) + chấm trang, thay vì bị cắt ở đáy. Hết tràn thì trả về như cũ.
   Chỉ đo khi màn chọn hiện, debounce, không rAF lúc nghỉ. Lớp: html.np-ovs (đang trượt). Nạp từ shared/resume.js (trừ ?multi=1; khung Chơi cùng lúc đã có luật riêng ở multi.css). */
(function () {
  "use strict";
  if (window.__npOvs) return; window.__npOvs = true;
  var SCR = ["#ovStart", "#home", "#village"], LIST = ".cards,.tiles", on = false, busy = false, t = 0;
  var css = document.createElement("style"); css.id = "npOvsCss";
  css.textContent =
    "html.np-ovs :is(#ovStart,#home) :is(.cards,.tiles).npo-s{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;gap:10px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;width:100%!important;max-width:none!important;grid-template-columns:none!important;grid-auto-flow:column;min-height:0!important;max-height:none!important;touch-action:pan-x;overscroll-behavior-x:contain}" +
    "html.np-ovs .npo-s::-webkit-scrollbar{display:none}" +
    "html.np-ovs .npo-s>*{flex:0 0 min(64%,260px)!important;width:auto!important;min-width:0!important;height:auto!important;min-height:92px!important;scroll-snap-align:start;box-sizing:border-box}" +
    ".npo-dots{display:none;justify-content:center;gap:6px;margin:6px 0 0;pointer-events:none}html.np-ovs .npo-dots{display:flex}.npo-dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3)}.npo-dots i.on{background:#fff}";
  (document.head || document.documentElement).appendChild(css);
  function scr() { for (var i = 0; i < SCR.length; i++) { var e = document.querySelector(SCR[i]); if (e && !e.hidden && e.getClientRects().length) return e; } return null; }
  function over(s) { var mb = 0, k = s.querySelectorAll("*"), i, e, q; for (i = 0; i < k.length; i++) { e = k[i]; if (!e.getClientRects().length) continue; q = e.getBoundingClientRect(); if (q.height > 8 && q.bottom > mb && getComputedStyle(e).position !== "fixed") mb = q.bottom; } return mb > innerHeight + 2 || s.scrollHeight > s.clientHeight + 3; }
  function dots(l) { var d = l.nextElementSibling; if (!d || !d.classList.contains("npo-dots")) { d = document.createElement("div"); d.className = "npo-dots"; d.setAttribute("aria-hidden", "true"); l.parentNode.insertBefore(d, l.nextSibling); l.addEventListener("scroll", function () { mark(l); }, { passive: true }); } var n = Math.max(1, Math.ceil(l.scrollWidth / Math.max(1, l.clientWidth))); if (d.children.length !== n) d.innerHTML = new Array(n + 1).join("<i></i>"); mark(l); }
  function mark(l) { var d = l.nextElementSibling; if (!d || !d.classList.contains("npo-dots")) return; var k = Math.round(l.scrollLeft / Math.max(1, l.clientWidth)); [].forEach.call(d.children, function (x, i) { x.classList.toggle("on", i === k); }); }
  function check() {
    if (busy) return; busy = true;
    try {
      var s = scr(), de = document.documentElement; if (!s) { if (on) { de.classList.remove("np-ovs"); on = false; } return; }
      var l = s.querySelector(LIST); if (!l) return;
      if (on) { de.classList.remove("np-ovs"); l.classList.remove("npo-s"); void s.offsetHeight; }   /* đo ở bố cục gốc để biết còn tràn không */
      var ov = over(s);
      if (ov) { de.classList.add("np-ovs"); l.classList.add("npo-s"); on = true; dots(l); } else { de.classList.remove("np-ovs"); l.classList.remove("npo-s"); on = false; }
    } finally { busy = false; }
  }
  function soon() { clearTimeout(t); t = (window.__npRST || setTimeout)(check, 160); }
  addEventListener("resize", soon); addEventListener("load", soon); addEventListener("orientationchange", soon);
  try { new MutationObserver(soon).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden"] }); } catch (e) {}
  setTimeout(soon, 800);
})();
