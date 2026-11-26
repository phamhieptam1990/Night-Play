/* Nút chọn kiểu học "Lớp học | Lớp truyện" ở bản đồ lớp. Lớp truyện (learn/story/) chạy song song, dùng chung tiến độ.
   Link lấy lớp/môn đang chọn từ địa chỉ trang (map.js luôn cập nhật ?grade&subj). Vào lại lớp học thì xoá cờ "đi từ lớp truyện". */
(function () {
  "use strict";
  try { sessionStorage.removeItem("learn:from"); sessionStorage.removeItem("learn:from:url"); } catch (e) {}
  var a = document.getElementById("toStory"); if (!a) return;
  a.addEventListener("click", function () {
    var q = new URLSearchParams(location.search), p = new URLSearchParams();
    if (q.get("grade")) p.set("grade", q.get("grade")); if (q.get("subj")) p.set("subj", q.get("subj")); if (q.get("lang")) p.set("lang", q.get("lang"));
    a.href = "../story/index.html" + (p.toString() ? "?" + p : "");
  });
})();
