/* KÉO THẢ bằng Pointer Events (chuột + cảm ứng). Chạm nhanh (không kéo) = tap(); kéo > 8px = hiện bóng món đồ bám theo ngón; thả = up(x,y). */
(function (N) {
  "use strict";
  N.attach = function (el, h) {
    var sx = 0, sy = 0, drag = null, id = null;
    function pos(e) { var r = N.$("play").getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    /* nghe ở window: khay có thể bị vẽ lại giữa lúc kéo (đổi bước tắm) mà vẫn nhận được pointerup */
    function onMove(e) {
      if (id !== e.pointerId) return;
      if (!drag && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) {
        drag = document.createElement("div"); drag.className = "drag"; drag.innerHTML = '<img src="' + el.dataset.img + '" alt="">';
        N.$("play").appendChild(drag); if (h.start) h.start();
      }
      if (drag) { var p = pos(e); drag.style.left = p[0] + "px"; drag.style.top = p[1] + "px"; if (h.move) h.move(e.clientX, e.clientY); }
    }
    function end(e, cancel) {
      if (id !== e.pointerId) return; id = null;
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onCancel);
      if (drag) { drag.remove(); drag = null; if (!cancel && h.up) h.up(e.clientX, e.clientY); } else if (!cancel && h.tap) h.tap(e.clientX, e.clientY);
    }
    function onUp(e) { end(e, false); } function onCancel(e) { end(e, true); }
    el.addEventListener("pointerdown", function (e) {
      if (el.classList.contains("off") && !h.allowOff) { if (h.off) h.off(); return; }
      id = e.pointerId; sx = e.clientX; sy = e.clientY; drag = null; e.preventDefault();
      window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp); window.addEventListener("pointercancel", onCancel);
    });
    el.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && h.tap) { e.preventDefault(); h.tap(); } });
  };
})(window.NB);
