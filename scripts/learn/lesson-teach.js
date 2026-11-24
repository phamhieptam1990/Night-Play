/* Lời giảng SOẠN TAY cho bài học lớp 2–5 (Toán trước). Bộ sinh gen-lessons-draft.js dùng nếu chủ đề có mục ở đây.
   Mỗi mục: say = 3 màn giảng [chữ <=90, hình to (nhiều dòng được)], qs = 6 câu [đề, ĐÚNG, sai1, sai2, gợi ý (không lộ đáp án), lời khen (tuỳ chọn), hình (tuỳ chọn)],
   sum = 2–3 ý nhớ. 3 câu đầu thành màn "choose", 3 câu sau thành "Thử cùng".
   Dữ liệu tách theo môn/lớp: lesson-teach-toan-g23.js, lesson-teach-toan-g45.js, lesson-teach-tviet.js, lesson-teach-tanh.js; tệp này gộp lại theo đúng thứ tự cũ. */
module.exports = Object.assign({}, require("./lesson-teach-toan-g23.js"), require("./lesson-teach-toan-g45.js"),
  require("./lesson-teach-tviet.js"), require("./lesson-teach-tanh.js"));
