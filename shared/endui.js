/* Gắn giao diện màn kết thúc mới (shared/endui.css) cho các màn #end / #res / #result của game viết tay mà KHÔNG đổi id nút cũ.
   Nhãn chữ vi/en được đặt lại mỗi khi màn kết thúc hiện ra. Nút chỉ có emoji (≤3 ký tự) mới bị thay chữ; nút đã có chữ giữ nguyên. */
(function () {
  "use strict";
  var IDS = ["end", "res", "result"], SHARE = { bShare: 1, bShareR: 1 };
  var L = { bClip: ["Quay lại", "Replay"], bRem: ["Đấu lại", "Rematch"], bAgain: ["Ván mới", "New game"], bHome: ["Trang chủ", "Home"], bHomeR: ["Trang chủ", "Home"] };
  function vi() { return (document.documentElement.lang || "vi").slice(0, 2) !== "en"; }
  /* màn #result của Hiểu Tôi có nút đã mang chữ riêng: giữ hàng cũ, chỉ làm nổi nút chia sẻ */
  function dress(el) {
    el.classList.add("endui");
    var card = el.querySelector(":scope>.card"); if (card && el.id !== "res") card.classList.add("endui-card");
    Array.prototype.forEach.call(el.querySelectorAll(":scope>.row"), function (r) { if (el.id !== "result" && r.querySelector("#bShare,#bAgain,#bHome")) r.classList.add("endui-row"); });
  }
  function label(el) {
    var v = vi();
    Array.prototype.forEach.call(el.querySelectorAll(".endui-row button,#bShareR"), function (b) {
      if (SHARE[b.id]) { b.classList.add("endui-share"); if ((b.textContent || "").trim().length <= 3) b.textContent = "📤 " + (v ? "Khoe điểm" : "Share score"); return; }
      var t = L[b.id]; if (t && (b.textContent || "").trim().length <= 3) b.dataset.l = t[v ? 0 : 1];
    });
  }
  IDS.forEach(function (id) {
    var el = document.getElementById(id); if (!el) return;
    dress(el); label(el);
    try { new MutationObserver(function () { if (!el.hidden) label(el); }).observe(el, { attributes: true, attributeFilter: ["hidden"] }); } catch (e) {}
  });
})();
