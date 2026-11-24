/* Phím tắt cho bàn phím vật lý (iPad có bàn phím, web). Chỉ làm việc khi khung rộng >= 700px.
   1-4 chọn đáp án; Enter bấm nút Xong/✓; chữ/số trên bàn phím số/chữ trong màn; Esc mở menu ⋯ khi chưa có hộp thoại nào (đóng thì logic cũ lo).
   KHÔNG bắt phím khi đang gõ trong ô nhập, khi cổng bật loa / hộp thoại mở, hoặc khi nhấn kèm Ctrl/Alt/Cmd. Không đổi logic chấm bài: chỉ .click() vào nút có sẵn. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function shown(el) { return !!el && !el.hidden && !el.closest("[hidden]") && el.getClientRects().length > 0; }
  function typing(t) { return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable); }
  function dialogOpen() { return ["spkGate", "info", "sheet", "res", "hintBox", "cel"].some(function (id) { return shown($(id)); }); }
  function pick(el) { if (el && !el.disabled && shown(el)) { el.click(); return true; } return false; }
  addEventListener("keydown", function (e) {
    if (innerWidth < 700 || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
    if (typing(e.target)) return;
    var k = e.key, ans = $("ans");
    if (k === "Escape") {
      if (!dialogOpen() && shown($("mnu")) === false && $("mn")) { e.stopImmediatePropagation(); e.preventDefault(); $("mn").click(); var f = $("mnu").querySelector(".mt"); if (f) f.focus(); }
      return;
    }
    if (dialogOpen() || shown($("mnu"))) return;
    if (!ans || ans.classList.contains("ld")) return;
    if (k === "Enter") {
      var go = ans.querySelector(".kb.go:not([disabled])") || ans.querySelector(".qdone:not([disabled])");
      if (go && document.activeElement !== go && pick(go)) e.preventDefault();
      return;
    }
    if (k.length !== 1) return;
    if (!ans.classList.contains("kz")) {   /* câu chọn đáp án: 1-4 (đến 9 nếu có) */
      var n = +k; if (n >= 1 && n <= 9) { var bs = ans.querySelectorAll(":scope > .ab"); if (bs[n - 1] && pick(bs[n - 1])) e.preventDefault(); }
      return;
    }
    var kb = ans.querySelectorAll(".kb");   /* bàn phím số/chữ trong màn: bấm đúng phím có chữ trùng */
    for (var i = 0; i < kb.length; i++) if (kb[i].textContent.trim().toLowerCase() === k.toLowerCase() && pick(kb[i])) { e.preventDefault(); return; }
  }, true);
})();
