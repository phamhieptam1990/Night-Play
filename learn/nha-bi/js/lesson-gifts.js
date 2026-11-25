/* QUÀ TỪ BÀI HỌC: khi vào nhà / quay lại tab, đổi bài đã học + sao kiểm tra + câu đúng Tiếng Việt (learn/gifts.js) thành thức ăn, xà phòng, đồ chơi, sao.
   Popup toàn hình: ít chữ. Nút sách ở HUD đưa bé tới bài học Tiếng Việt. */
(function (N) {
  "use strict";
  var busy = false;
  N.grade = function () { return N.store.D().grade; };   /* lớp của thế giới này (?grade=), không phải lớp hiện tại của bé */
  N.lessonUrl = function () { return "../lop/index.html?subj=tviet&grade=" + N.grade(); };
  N.gardenUrl = function () { return "../index.html?grade=" + N.grade() + "&subj=tviet"; };   /* ← về trang Học Vui (vườn môn này CHÍNH LÀ game, không còn cảnh vườn riêng) */
  N.collectLesson = function (quiet) {
    if (busy || !window.LearnGifts || N.busy) return false;
    var p = LearnGifts.pending(N.grade()); if (!p.any) return false;
    busy = true; var g = LearnGifts.claim(N.grade()), big = N.give({ food: g.food, soap: g.soap, toy: g.toy, stars: g.stars });
    big.unshift({ ic: "book" });
    N.popupGive(big, function () { busy = false; N.gainLove((g.stars | 0) + 3 * (g.toy | 0)); N.checkin(); }); return true;
  };
  document.addEventListener("visibilitychange", function () { if (!document.hidden && N.screen === "room") N.collectLesson(); });
  addEventListener("pageshow", function (e) { if (e.persisted) N.collectLesson(); });
})(window.NB);
