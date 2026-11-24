/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 5 · Đọc (Reading).
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G5-03",
  "grade": 5,
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
      "t": "Đọc hiểu văn bản ngắn quen thuộc, xác định ý chính và thông tin cụ thể.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "Đây là gì? 🍎",
      "opts": [
        "rice",
        "orange",
        "apple"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là apple.",
      "no": "Nhìn hình và nói tên bằng tiếng Việt trước, rồi nhớ từ tiếng Anh.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Từ cook nghĩa là gì?",
      "opts": [
        "bà",
        "nông dân",
        "đầu bếp"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là đầu bếp.",
      "no": "Nhớ lại từ này trong bài học hoặc bài hát."
    },
    {
      "k": "choose",
      "t": "Đây là gì? 🕒",
      "opts": [
        "bed",
        "key",
        "clock"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là clock.",
      "no": "Nhìn hình và nói tên bằng tiếng Việt trước, rồi nhớ từ tiếng Anh.",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đọc hiểu văn bản ngắn quen thuộc, xác định ý chính và thông tin cụ thể.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Từ run nghĩa là gì?",
      "opts": [
        "nhảy",
        "chạy",
        "bà"
      ],
      "ok": 1,
      "hint": "Nhớ lại từ này trong bài học hoặc bài hát.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Đây là gì? 🪑",
      "opts": [
        "chair",
        "bed",
        "key"
      ],
      "ok": 0,
      "hint": "Nhìn hình và nói tên bằng tiếng Việt trước, rồi nhớ từ tiếng Anh.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "Từ hospital nghĩa là gì?",
      "opts": [
        "thư viện",
        "bệnh viện",
        "bơi"
      ],
      "ok": 1,
      "hint": "Nhớ lại từ này trong bài học hoặc bài hát.",
      "yes": "Đúng rồi!"
    }
  ]
});
