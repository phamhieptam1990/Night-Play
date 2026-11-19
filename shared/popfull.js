/* POPUP PHỦ TOÀN MÀN HÌNH ở màn ngang. Khung chơi (#play / body#play) có container-type:size → popup bên trong có thể chỉ phủ vừa CỘT GAME hẹp (gốc toạ độ = khung chơi) hoặc phủ cả cửa sổ (position:fixed, gốc = cửa sổ) tuỳ game.
   Mỗi popup đang hiện được ĐO gốc toạ độ của nó (đặt tạm left/top = 0 rồi đọc vị trí) và ghi --npx/--npy lên CHÍNH popup; shared/nppopup.css dùng chúng để kéo lớp phủ ra trọn cửa sổ và nới thẻ. Chỉ chạy khi popup đổi trạng thái / xoay / đổi cỡ (không hẹn giờ). */
(function () {
  "use strict";
  var SEL = "#hlpOv,.ov:not(#ovStart),.overlay,.sheet", raf = 0;
  function fix(e) {
    if (e.hidden || !e.getClientRects().length || innerWidth <= innerHeight) return;
    var st = e.style, ol = st.getPropertyValue("left"), olp = st.getPropertyPriority("left"), ot = st.getPropertyValue("top"), otp = st.getPropertyPriority("top");
    st.setProperty("left", "0px", "important"); st.setProperty("top", "0px", "important");
    var r = e.getBoundingClientRect(), x = -Math.round(r.left) + "px", y = -Math.round(r.top) + "px";
    if (ol) st.setProperty("left", ol, olp); else st.removeProperty("left");
    if (ot) st.setProperty("top", ot, otp); else st.removeProperty("top");
    if (st.getPropertyValue("--npx") !== x) st.setProperty("--npx", x); if (st.getPropertyValue("--npy") !== y) st.setProperty("--npy", y);
  }
  /* HÌNH MINH HOẠ trong thẻ "Cách chơi" (#hwArt: tháp vòng, cột, ván mẫu…) vẽ theo cqw của #play → khi #play rộng (màn ngang) hình to hơn khung chứa và tràn ra ngoài thẻ: thu hình vừa khung (zoom, không đổi hình dạng) */
  function fitArt() {
    [].forEach.call(document.querySelectorAll(".hwArt"), function (a) {
      if (!a.getClientRects().length) return;
      [].forEach.call(a.children, function (c) { c.style.zoom = ""; });
      var cs = getComputedStyle(a), avail = a.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0), need = 0, gap = parseFloat(cs.columnGap) || 0;
      [].forEach.call(a.children, function (c, i) { need += c.getBoundingClientRect().width + (i ? gap : 0); });
      if (need > avail + 1 && avail > 40) { var z = Math.max(.3, Math.floor(avail / need * 100) / 100); [].forEach.call(a.children, function (c) { c.style.zoom = z; }); }
    });
  }
  function all() { raf = 0; [].forEach.call(document.querySelectorAll(SEL), fix); fitArt(); }
  function sch() { if (!raf) raf = requestAnimationFrame(all); }
  function init() {
    sch(); addEventListener("resize", sch); addEventListener("orientationchange", sch);
    try {   /* chỉ khi popup / hình minh hoạ đổi trạng thái hidden (game có thể bật/tắt hidden của phần tử khác mỗi khung hình) */
      new MutationObserver(function (recs) {
        for (var i = 0; i < recs.length; i++) { var t = recs[i].target; if (t && t.matches && (t.matches(SEL + ",.hwArt") || t.closest(SEL + ",.hwArt") || t.querySelector(".hwArt"))) { sch(); return; } }
      }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
    } catch (e) {}
    try {   /* nội dung hình minh hoạ được dựng sau khi thẻ hiện.
         HIỆU NĂNG: trước đây MỌI thay đổi DOM (đếm giờ, điểm, hạt…) đều gọi all() = đo bố cục ép layout, 15–30 lần/giây; nay chỉ khi có popup/hình minh hoạ được thêm vào (hoặc thay đổi nằm trong .hwArt), tối đa ~5 lần/giây. */
      var WANT = SEL + ",.hwArt", lastS = 0, tmS = 0;
      var relevant = function (r) {
        for (var i = 0; i < r.addedNodes.length; i++) { var n = r.addedNodes[i]; if (n.nodeType === 1 && (n.matches(WANT) || n.querySelector(WANT))) return true; }
        var t = r.target; return !!(t && t.closest && t.closest(".hwArt"));
      };
      new MutationObserver(function (recs) {
        var go = false; for (var i = 0; i < recs.length && !go; i++) go = relevant(recs[i]); if (!go) return;
        var now = Date.now(); if (now - lastS < 200) { if (!tmS) tmS = setTimeout(function () { tmS = 0; lastS = Date.now(); sch(); }, 200); return; } lastS = now; sch();
      }).observe(document.body, { subtree: true, childList: true });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
