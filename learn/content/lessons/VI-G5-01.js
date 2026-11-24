/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 5 · Đọc hiểu tổng hợp.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G5-01",
  "grade": 5,
  "subj": "tviet",
  "title": "Đọc hiểu tổng hợp",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Đọc hiểu tổng hợp.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Xác định chủ đề, ý chính, thông điệp; kết nối thông tin và suy luận ở mức phù hợp lứa…",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Điền từ còn thiếu: Tốt gỗ hơn tốt __",
      "opts": [
        "nhai",
        "kim",
        "nước sơn"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là nước sơn.",
      "no": "Đọc cả câu lên cho có vần, có nhịp."
    },
    {
      "k": "choose",
      "t": "Điền từ còn thiếu: Có công mài sắt, có ngày nên __",
      "opts": [
        "tông",
        "đẹp",
        "kim"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là kim.",
      "no": "Đọc cả câu lên cho có vần, có nhịp."
    },
    {
      "k": "choose",
      "t": "Điền từ còn thiếu: Gieo gió gặt __",
      "opts": [
        "bão",
        "cao",
        "thân"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là bão.",
      "no": "Đọc cả câu lên cho có vần, có nhịp."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Xác định chủ đề, ý chính, thông điệp; kết nối thông tin và suy luận ở mức phù hợp lứa…",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Điền từ còn thiếu: Kiến tha lâu cũng __",
      "opts": [
        "đầy",
        "rách",
        "mòn"
      ],
      "ok": 0,
      "hint": "Đọc cả câu lên cho có vần, có nhịp.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Điền từ còn thiếu: Ăn quả nhớ kẻ trồng __",
      "opts": [
        "cây",
        "nâng",
        "kim"
      ],
      "ok": 0,
      "hint": "Đọc cả câu lên cho có vần, có nhịp.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Điền từ còn thiếu: Thương người như thể thương __",
      "opts": [
        "thân",
        "rạng",
        "đứng"
      ],
      "ok": 0,
      "hint": "Đọc cả câu lên cho có vần, có nhịp.",
      "yes": "Đúng rồi!"
    }
  ]
});
