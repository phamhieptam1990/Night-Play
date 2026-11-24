/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 2 · Đọc thành tiếng và đọc hiểu.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G2-01",
  "grade": 2,
  "subj": "tviet",
  "title": "Đọc thành tiếng và đọc hiểu",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Đọc thành tiếng và đọc hiểu.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Đọc văn bản ngắn trôi chảy hơn; xác định nội dung chính và chi tiết hiển nhiên.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "no thêm dấu sắc thành tiếng nào?",
      "opts": [
        "nó",
        "nò",
        "nọ"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là nó.",
      "no": "Đọc liền hai âm với nhau: phụ âm rồi vần."
    },
    {
      "k": "choose",
      "t": "Sáng thứ Bảy, Lan cùng bố ra chợ mua cá. Bố chọn một con cá chép to.Bố chọn mua con gì?",
      "opts": [
        "cá chép",
        "cá thu",
        "con tôm"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là cá chép.",
      "no": "Đọc lại cả đoạn thật chậm."
    },
    {
      "k": "choose",
      "t": "li thêm dấu huyền thành tiếng nào?",
      "opts": [
        "lì",
        "lị",
        "lĩ"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là lì.",
      "no": "Đọc liền hai âm với nhau: phụ âm rồi vần."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đọc văn bản ngắn trôi chảy hơn; xác định nội dung chính và chi tiết hiển nhiên.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "vơ thêm dấu hỏi thành tiếng nào?",
      "opts": [
        "vở",
        "vớ",
        "vỡ"
      ],
      "ok": 0,
      "hint": "Đọc liền hai âm với nhau: phụ âm rồi vần.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Con chó nhà Nam tên là Vàng. Vàng rất thích chơi bóng.Con chó thích gì?",
      "opts": [
        "bơi lội",
        "ngủ",
        "chơi bóng"
      ],
      "ok": 2,
      "hint": "Đọc lại cả đoạn thật chậm.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "da thêm dấu ngã thành tiếng nào?",
      "opts": [
        "dạ",
        "dã",
        "dà"
      ],
      "ok": 1,
      "hint": "Đọc liền hai âm với nhau: phụ âm rồi vần.",
      "yes": "Đúng rồi!"
    }
  ]
});
