/* HUD vườn (WorldKit): ← về Học Vui · sao · thức ăn · xà phòng (tổng của các thú) · nút sách học bài (lớp hiện tại). Cấp độ chung của WorldKit ẩn đi (mỗi thú có huy hiệu riêng). */
(function (V) {
  "use strict";
  V.hudInit = function () {
    var t = V.totals();
    WorldKit.mount({ back: V.back(), pills: [{ id: "stars", ic: "star", val: t.stars }, { id: "food", ic: "food", val: t.food }, { id: "soap", ic: "soap", val: t.soap }] });
    var a = document.createElement("a"); a.className = "wk-btn"; a.id = "bookBtn"; a.href = V.lessonUrl(V.curGrade()); a.setAttribute("aria-label", "Học bài");
    a.innerHTML = WorldKit.svg("book"); var h = document.querySelector(".wk-hud"); if (h) h.appendChild(a);
  };
  V.hudSync = function () { var t = V.totals(); WorldKit.setPill("stars", t.stars); WorldKit.setPill("food", t.food); WorldKit.setPill("soap", t.soap); };
})(window.VT);
