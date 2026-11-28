/* MÀU THEO LỚP cho Trong nhà / Kho / Ao cá: popup, nút, thẻ tự đổi bảng màu theo LỚP của bé (lớp 1 xanh lá · 2 xanh trời · 3 tím · 4 cam · 5 hồng). Bỏ thanh "Cấp 1-4" chọn tay.
   Nạp CUỐI trang (sau script của trang, dùng LVS/applyLv có sẵn). Lớp lấy từ LearnSlot (vườn đang mở) rồi learn:grade; không có thì lớp 3 (tím). */
(function () {
  "use strict";
  var P5 = { a: "#F472B6", b: "#DB2777", bg: "#FDF2F8", d1: "#5B0F3A", d2: "#A21F63" };
  function grade() {
    try { var S = window.LearnSlot, p = S && S.parts && S.parts(); if (p && p.grade >= 1 && p.grade <= 5) return p.grade; var g = +localStorage.getItem("learn:grade"); if (g >= 1 && g <= 5) return g; } catch (e) {}
    return 3;
  }
  var st = document.createElement("style"); st.textContent = ".lvbar{display:none!important}"; document.head.appendChild(st);
  if (window.LVS && window.applyLv) { window.LVS[5] = P5; window.applyLv(grade()); }
  window.GardenTheme = { grade: grade };
})();
