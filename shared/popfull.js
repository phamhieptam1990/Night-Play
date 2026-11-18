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
  function all() { raf = 0; [].forEach.call(document.querySelectorAll(SEL), fix); }
  function sch() { if (!raf) raf = requestAnimationFrame(all); }
  function init() {
    sch(); addEventListener("resize", sch); addEventListener("orientationchange", sch);
    try { new MutationObserver(sch).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["hidden"] }); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
