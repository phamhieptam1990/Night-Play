/* Đặt nút ← ở GÓC TRÊN-TRÁI cửa sổ game, cùng toạ độ ở mọi game (nhóm Cozy sinh tự động / viết tay, Pop Play, cả khi chạy trong trang cổng có cột bên lề: cửa sổ game = iframe).
   Nút giữ nguyên vị trí trong luồng bố cục (chỗ trống không đổi); chỉ dời bằng thuộc tính `translate` tới (--back-x, --back-y) + safe-area. Chạy lại khi đổi cỡ/xoay/đổi màn (kiểm tra nhẹ mỗi 400ms).
   CSS: shared/backpos.css (nạp cùng, bởi bridge.js). Bài đo: scripts/cozygame/check-backpos.js. */
(function () {
  "use strict";
  if (window.NPBack) return;
  var IDS = ["bBk", "bBack", "npPmBk", "homeBtn"], probe = null, last = "";
  function px(v, d) { var n = parseFloat(v); return isFinite(n) ? n : d; }
  function safe() {
    if (!probe) { probe = document.createElement("div"); probe.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) 0 0 env(safe-area-inset-left,0px)"; document.documentElement.appendChild(probe); }
    var cs = getComputedStyle(probe); return { t: px(cs.paddingTop, 0), l: px(cs.paddingLeft, 0) };
  }
  function place() {
    var de = document.documentElement, cs = getComputedStyle(de), bx = px(cs.getPropertyValue("--back-x"), 16), by = px(cs.getPropertyValue("--back-y"), 16), s = safe();
    var sig = innerWidth + "x" + innerHeight, els = [];
    IDS.forEach(function (id) { var e = document.getElementById(id); if (e && getComputedStyle(e).display !== "none") els.push(e); });
    els.forEach(function (e) {
      var tr = e.style.translate; if (tr) e.style.translate = "0px 0px";
      var r = e.getBoundingClientRect();
      if (r.width < 10) { e.style.translate = tr; return; }
      var dx = Math.round(bx + s.l - r.left), dy = Math.round(by + s.t - r.top), v = dx + "px " + dy + "px";
      e.style.translate = (dx || dy) ? v : "";
    });
  }
  var raf = 0; function queue() { cancelAnimationFrame(raf); raf = requestAnimationFrame(place); }
  window.NPBack = { place: place };
  addEventListener("resize", queue); addEventListener("orientationchange", function () { setTimeout(queue, 250); });
  document.addEventListener("click", function () { setTimeout(queue, 60); setTimeout(queue, 400); }, true);
  setInterval(function () { if (!document.hidden) place(); }, 400);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", queue); else queue();
})();
