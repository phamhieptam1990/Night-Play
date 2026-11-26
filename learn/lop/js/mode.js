/* Bản đồ lớp: vào lại lớp học thì xoá cờ "đi từ lớp truyện" (trang bài học / kiểm tra đọc cờ này để ← về bản đồ truyện).
   Chọn Truyện hay Lớp học nay nằm ở hộp "Bé muốn chơi kiểu nào?" khi bấm nút Chơi (js/play-choice.js). */
(function () {
  "use strict";
  try { sessionStorage.removeItem("learn:from"); sessionStorage.removeItem("learn:from:url"); } catch (e) {}
})();
