/* Link tới BÀI KẾ TIẾP của một môn/lớp (Học Vui). Cần: content/curriculum.js, path.js, content/lessons/index.js nạp trước.
   LessonLink.url("tviet", 2) -> ../lop/bai.html?grade=2&subj=tviet&topic=<id> (có bài), ../index.html?... (chỉ kiểm tra), hoặc ../lop/index.html?... (xong lớp / thiếu path.js).
   Đường dẫn tương đối từ thư mục con của learn/ (vuon-thu, nha-bi, khu-cho, quan-kem). */
(function (root) {
  "use strict";
  root.LessonLink = {
    url: function (subj, grade) {
      var prm = "grade=" + grade + "&subj=" + subj, P = root.LearnPath, nx = null;
      try { nx = P && P.next(subj, grade); } catch (e) {}
      if (!nx) return "../lop/index.html?subj=" + subj + "&grade=" + grade;
      return (nx.hasLesson ? "../lop/bai.html?" : "../index.html?") + prm + "&topic=" + encodeURIComponent(nx.id);
    }
  };
})(window);
