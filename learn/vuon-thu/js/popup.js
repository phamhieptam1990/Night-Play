/* Popup chuồng khoá: ÍT CHỮ nhiều hình. Bóng thú mờ + ổ khoá, hàng sao = số chủ đề đã học / cần, nút sách → học bài Tiếng Việt lớp đó, nút × đóng. */
(function (V) {
  "use strict";
  V.lockPopup = function (g) {
    var P = V.pet(g), n = V.learned(g), t = V.TOTAL[g - 1], dots = "", i;
    for (i = 0; i < t; i++) dots += '<i class="' + (i < n ? "on" : "") + '">' + WorldKit.svg("star") + "</i>";
    WorldKit.popup({ title: "Lớp " + g, big: [{ img: V.NB + P.house + ".svg" }, { img: V.ART + "khoa.svg" }],
      html: '<div class="vt-sil"><img src="' + V.NB + P.pet.art + '.svg" alt=""></div><div class="vt-dots">' + dots + "</div>",
      acts: [{ ic: "book", go: 1, href: V.lessonUrl(g), label: "Học bài" }, { ic: "close", label: "Đóng" }] });
  };
})(window.VT);
