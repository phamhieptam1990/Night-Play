/* Lối vào trang Học Vui Plus (learn/plus/) luôn hiện trong trang phụ huynh, kể cả khi cờ Plus tắt (trang đó tự hiện "Sắp mở bán").
   Chỉ nằm ở khu phụ huynh, không có trong luồng của bé. Nạp SAU plus-card.js; vẽ lại mỗi lần trang vẽ lại (đổi ngôn ngữ). */
(function () {
  "use strict";
  var a = document.getElementById("plusLink"); if (!a) return;
  function paint() {
    var en = typeof lang !== "undefined" && lang === "en";
    a.textContent = en ? "Hoc Vui Plus: AI tutor and mock exams" : "Học Vui Plus: gia sư AI và đề thi thử";
    a.href = "../plus/index.html" + (en ? "?lang=en" : "");
  }
  var r0 = window.render; if (typeof r0 === "function") window.render = function () { r0.apply(this, arguments); paint(); };
  paint();
})();
