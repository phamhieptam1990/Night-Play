/* Popup chuồng khoá: ÍT CHỮ nhiều hình. Tên chủ đề, ổ khoá, hàng sao = số chủ đề của lớp đã xong; nút sách → bài Tiếng Việt cần học tiếp, nút × đóng. */
(function (V) {
  "use strict";
  V.lockPopup = function (it) {
    var g = V.petOf(it.i), P = V.pet(g), all = V.items(), n = all.filter(function (x) { return x.done; }).length, dots = "", i;
    for (i = 0; i < all.length; i++) dots += '<i class="' + (i < n ? "on" : "") + '">' + WorldKit.svg("star") + "</i>";
    WorldKit.popup({ title: it.name, big: [{ img: V.NB + P.house + ".svg" }, { img: V.ART + "khoa.svg" }],
      html: '<div class="vt-sil"><img src="' + V.NB + P.pet.art + '.svg" alt=""></div><div class="vt-dots">' + dots + "</div>",
      acts: [{ ic: "book", go: 1, href: V.lessonUrl(V.curGrade()), label: "Học bài" }, { ic: "close", label: "Đóng" }] });
  };
})(window.VT);
