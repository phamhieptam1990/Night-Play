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
  /* chuồng đã mở nhưng chưa làm bài kiểm tra: báo bé làm bài trước rồi mới vào chơi, không nhảy thẳng vào bài */
  V.testPopup = function (it) {
    var g = V.petOf(it.i), P = V.pet(g);
    WorldKit.popup({ title: it.name, big: [{ img: V.NB + P.house + ".svg" }, { ic: "book" }],
      html: '<p class="vt-gate">Em làm bài kiểm tra trước, rồi mới vào chuồng chơi nhé!</p>',
      acts: [{ ic: "book", go: 1, href: it.url, label: "Làm bài kiểm tra" }, { ic: "close", label: "Đóng" }] });
  };
  /* chuồng đã học xong: bé chọn CHƠI với thú hay HỌC LẠI bài, không bị đẩy thẳng vào bài */
  V.playPopup = function (it) {
    var g = V.petOf(it.i), P = V.pet(g);
    WorldKit.popup({ title: it.name, big: [{ img: V.NB + P.house + ".svg" }, { ic: "play" }],
      acts: [{ ic: "play", go: 1, href: V.petUrl(V.curGrade()), label: "Chơi" }, { ic: "book", href: it.url, label: "Học lại" }, { ic: "close", label: "Đóng" }] });
  };
})(window.VT);
