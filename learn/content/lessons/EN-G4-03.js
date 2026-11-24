/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 4 · Đọc (Reading).
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G4-03",
  "grade": 4,
  "subj": "tanh",
  "title": "Đọc (Reading)",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Đọc (Reading).",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Đọc hiểu văn bản ngắn, tìm thông tin trực tiếp và đoán nghĩa từ ngữ quen thuộc nhờ ngữ…",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "Đây là gì? 🍎",
      "opts": [
        "pizza",
        "apple",
        "bread"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là apple.",
      "no": "Nhìn hình và nói tên bằng tiếng Việt trước, rồi nhớ từ tiếng Anh.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Từ cook nghĩa là gì?",
      "opts": [
        "đọc",
        "bà",
        "đầu bếp"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là đầu bếp.",
      "no": "Nhớ lại từ này trong bài học hoặc bài hát."
    },
    {
      "k": "choose",
      "t": "Sau February là gì?",
      "opts": [
        "November",
        "June",
        "March"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là March.",
      "no": "Đọc nhẩm thứ tự các ngày trong tuần (hoặc các tháng trong năm) từ đầu.",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đọc hiểu văn bản ngắn, tìm thông tin trực tiếp và đoán nghĩa từ ngữ quen thuộc nhờ ngữ…",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Đây là gì? 🔑",
      "opts": [
        "door",
        "key",
        "clock"
      ],
      "ok": 1,
      "hint": "Nhìn hình và nói tên bằng tiếng Việt trước, rồi nhớ từ tiếng Anh.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "Từ student nghĩa là gì?",
      "opts": [
        "học sinh",
        "nông dân",
        "chạy"
      ],
      "ok": 0,
      "hint": "Nhớ lại từ này trong bài học hoặc bài hát.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "February, March, __",
      "opts": [
        "April",
        "July",
        "May"
      ],
      "ok": 0,
      "hint": "Đọc nhẩm thứ tự các ngày trong tuần (hoặc các tháng trong năm) từ đầu.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    }
  ]
});
