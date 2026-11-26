/* Link tới BÀI KẾ TIẾP của một môn/lớp (Học Vui). Cần: content/curriculum.js, path.js, content/lessons/index.js nạp trước.
   LessonLink.url("tviet", 2) -> ../lop/bai.html?grade=2&subj=tviet&topic=<id> (có bài), ../index.html?... (chỉ kiểm tra), hoặc ../lop/index.html?... (xong lớp / thiếu path.js).
   Đường dẫn tương đối từ thư mục con của learn/ (vuon-thu, nha-bi, khu-cho, quan-kem). */
(function (root) {
  "use strict";
  root.LessonLink = {
    /* link vào ĐÚNG một chủ đề */
    topicUrl: function (subj, grade, id) {
      var P = root.LearnPath, has = false; try { has = !!(P && P.hasLesson(id)); } catch (e) {}
      return (has ? "../lop/bai.html?" : "../index.html?") + "grade=" + grade + "&subj=" + subj + "&topic=" + encodeURIComponent(id);
    },
    /* các chủ đề của lớp: [{id, name, icon, done, open, status, url}]; open = chủ đề đầu hoặc chủ đề liền trước đã xong (không nhảy bài) */
    items: function (subj, grade) {
      var P = root.LearnPath, ts = []; try { ts = P ? P.topics(subj, grade) : []; } catch (e) {}
      return ts.map(function (t, i) {
        var done = false, open = i === 0, st = "new";
        try { done = P.completed(grade, subj, t.id); open = P.unlocked(subj, grade, t.id); st = P.status(subj, grade, t.id); } catch (e) {}
        return { id: t.id, name: t.name, icon: t.icon, i: i, done: done, open: open, status: st, url: root.LessonLink.topicUrl(subj, grade, t.id) };
      });
    },
    url: function (subj, grade) {
      var prm = "grade=" + grade + "&subj=" + subj, P = root.LearnPath, nx = null;
      try { nx = P && P.next(subj, grade); } catch (e) {}
      if (!nx) return "../lop/index.html?subj=" + subj + "&grade=" + grade;
      return (nx.hasLesson ? "../lop/bai.html?" : "../index.html?") + prm + "&topic=" + encodeURIComponent(nx.id);
    }
  };
})(window);
