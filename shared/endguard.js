/* Bảo vệ MÀN KẾT THÚC: người chơi đang chạm/vuốt liên tục thì cú chạm ngay sau khi hết ván KHÔNG được tự "chơi lại" (làm màn kết thúc biến mất,
   mất cơ hội xem điểm, khoe, chụp hình). Nhiều game có thói quen "chạm vào chỗ trống của màn kết thúc = chơi lại"; thay vì sửa từng game, mô-đun này
   chặn các cú chạm/phím vào VÙNG TRỐNG của màn kết thúc trong:
     - 1,8 giây đầu sau khi màn kết thúc hiện ra, và
     - 6 giây đầu nếu cú chạm đó nối tiếp một chuỗi chạm nhanh (cách cú chạm trước < 0,5 giây — người chơi vẫn đang chơi).
   Nút bấm (button/a/input/[role=button]) KHÔNG bị chặn. Nạp tự động từ shared/resume.js. */
(function () {
  "use strict";
  if (window.__npEndGuard) return; window.__npEndGuard = true;
  var IDS = ["end", "ovEnd", "res", "overlay"], SEL = IDS.map(function (i) { return "#" + i; }).join(","), shown = {}, lastPtr = 0;
  var now = function () { return performance.now(); };
  function vis(el) { return !!el && !el.hidden && el.offsetParent !== null; }
  function watch(el) {
    var id = el.id; shown[id] = vis(el) ? now() : 0;
    try {
      new MutationObserver(function () { var v = vis(el); if (v && !shown[id]) shown[id] = now(); else if (!v) shown[id] = 0; })
        .observe(el, { attributes: true, attributeFilter: ["hidden", "class", "style"] });
      /* màn kết thúc dùng lại một khung (vd Đập Deadline): nội dung đổi = màn mới */
      if (id === "overlay") new MutationObserver(function () { if (vis(el)) shown[id] = now(); }).observe(el, { childList: true });
    } catch (e) {}
  }
  function init() { IDS.forEach(function (i) { var el = document.getElementById(i); if (el) watch(el); }); }
  function inEnd(t) { var el = t && t.closest ? t.closest(SEL) : null; return el && vis(el) && !t.closest("button,a,input,select,textarea,[role=button],label") ? el : null; }
  var dec = { t: 0, b: false };   /* quyết định của cú chạm hiện tại (pointerdown) dùng lại cho click/touchstart/mousedown đi kèm */
  function block(e) {
    var el = inEnd(e.target); if (!el) return false;
    var t0 = shown[el.id] || 0; if (!t0) return false;
    var age = now() - t0, rapid = now() - lastPtr < 500;
    return age < 1800 || (age < 6000 && rapid);
  }
  function onPtr(e) { var b = block(e); lastPtr = now(); dec = { t: now(), b: b }; if (b) e.stopImmediatePropagation(); }
  function onOther(e) {
    var b = now() - dec.t < 800 ? dec.b && !!inEnd(e.target) : (function () { var el = inEnd(e.target); var t0 = el && shown[el.id]; return !!t0 && now() - t0 < 1800; })();
    if (b) e.stopImmediatePropagation();
  }
  document.addEventListener("pointerdown", onPtr, true);
  ["click", "touchstart", "mousedown"].forEach(function (n) { document.addEventListener(n, onOther, true); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") return;
    for (var i = 0; i < IDS.length; i++) { var el = document.getElementById(IDS[i]); if (el && vis(el) && shown[IDS[i]] && now() - shown[IDS[i]] < 1800 && !(e.target && e.target.closest && e.target.closest("button,a,input,select,textarea"))) { e.stopImmediatePropagation(); return; } }
  }, true);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.NPEndGuard = { shownAt: function (id) { return shown[id] || 0; } };
})();
