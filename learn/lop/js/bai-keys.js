/* Phím tắt cho bài học trên iPad có bàn phím / web (khung rộng >= 700px): → hoặc Space = Tiếp, ← = Lùi.
   Không bắt phím khi đang gõ trong ô nhập, khi cổng bật loa / màn chúc mừng mở, hoặc khi Space đang rơi vào một nút (nút tự xử lý). Chỉ .click() nút có sẵn. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function shown(el) { return !!el && !el.hidden && !el.closest("[hidden]") && el.getClientRects().length > 0; }
  function usable(el) { return shown(el) && !el.disabled && el.getAttribute("aria-disabled") !== "true"; }
  addEventListener("keydown", function (e) {
    if (innerWidth < 700 || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    if (shown($("spkGate")) || shown($("cel"))) return;
    var k = e.key;
    if (k === "ArrowRight" || (k === " " && tag !== "BUTTON" && tag !== "A")) { if (usable($("nx"))) { e.preventDefault(); $("nx").click(); } }
    else if (k === "ArrowLeft") { if (usable($("bk"))) { e.preventDefault(); $("bk").click(); } }
  }, true);
})();
