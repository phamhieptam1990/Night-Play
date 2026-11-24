/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 4 · Đọc hiểu văn học.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G4-01",
  "grade": 4,
  "subj": "tviet",
  "title": "Đọc hiểu văn học",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Đọc hiểu văn học.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Nhận biết chủ đề, nhân vật, chi tiết tiêu biểu và tác dụng của một số yếu tố nghệ…",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Điền từ còn thiếu: Gần mực thì đen, gần đèn thì __",
      "opts": [
        "nấy",
        "kim",
        "rạng"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là rạng.",
      "no": "Đọc cả câu lên cho có vần, có nhịp."
    },
    {
      "k": "choose",
      "t": "Điền từ còn thiếu: Gieo gió gặt __",
      "opts": [
        "rạng",
        "cao",
        "bão"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là bão.",
      "no": "Đọc cả câu lên cho có vần, có nhịp."
    },
    {
      "k": "choose",
      "t": "Điền từ còn thiếu: Cây ngay không sợ chết __",
      "opts": [
        "nâng",
        "đứng",
        "bão"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là đứng.",
      "no": "Đọc cả câu lên cho có vần, có nhịp."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Nhận biết chủ đề, nhân vật, chi tiết tiêu biểu và tác dụng của một số yếu tố nghệ…",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Điền từ còn thiếu: Tốt gỗ hơn tốt __",
      "opts": [
        "mòn",
        "tông",
        "nước sơn"
      ],
      "ok": 2,
      "hint": "Đọc cả câu lên cho có vần, có nhịp.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Điền từ còn thiếu: Uống nước nhớ __",
      "opts": [
        "nguồn",
        "kim",
        "cây"
      ],
      "ok": 0,
      "hint": "Đọc cả câu lên cho có vần, có nhịp.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Điền từ còn thiếu: Ăn cây nào rào cây __",
      "opts": [
        "nấy",
        "cây",
        "cỏ"
      ],
      "ok": 0,
      "hint": "Đọc cả câu lên cho có vần, có nhịp.",
      "yes": "Đúng rồi!"
    }
  ]
});
