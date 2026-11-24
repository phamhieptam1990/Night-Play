/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 2 · Nói và nghe.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G2-04",
  "grade": 2,
  "subj": "tviet",
  "title": "Nói và nghe",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Nói và nghe.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Kể lại sự việc, trao đổi về chủ đề quen thuộc; biết chờ lượt và lắng nghe.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Đến giờ đi ngủ, em chúc bố mẹ:",
      "opts": [
        "Em xin lỗi ạ!",
        "Chúc bố mẹ ngủ ngon!",
        "Chúc mừng sinh nhật!"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là Chúc bố mẹ ngủ ngon!.",
      "no": "Nghĩ xem lúc đó cần nói gì: chào, cảm ơn, xin lỗi hay chúc mừng?"
    },
    {
      "k": "choose",
      "t": "🔊Nghe rồi chọn hình đúng",
      "opts": [
        "🚲",
        "🐍",
        "🩴"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 🐍.",
      "no": "Bấm 🔊 để nghe lại."
    },
    {
      "k": "choose",
      "t": "Mẹ nấu cơm xong, mời cả nhà. Em nói:",
      "opts": [
        "Mời cả nhà ăn cơm ạ!",
        "Chúc ngủ ngon!",
        "Tạm biệt cả nhà!"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Mời cả nhà ăn cơm ạ!.",
      "no": "Nghĩ xem lúc đó cần nói gì: chào, cảm ơn, xin lỗi hay chúc mừng?"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Kể lại sự việc, trao đổi về chủ đề quen thuộc; biết chờ lượt và lắng nghe.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Em lỡ làm đổ nước của bạn. Em nói:",
      "opts": [
        "Chào bạn nhé!",
        "Mình xin lỗi bạn!",
        "Hoan hô bạn!"
      ],
      "ok": 1,
      "hint": "Nghĩ xem lúc đó cần nói gì: chào, cảm ơn, xin lỗi hay chúc mừng?",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Bạn bị ngã. Em hỏi:",
      "opts": [
        "Tạm biệt bạn nhé!",
        "Bạn có đau không?",
        "Chúc mừng sinh nhật!"
      ],
      "ok": 1,
      "hint": "Nghĩ xem lúc đó cần nói gì: chào, cảm ơn, xin lỗi hay chúc mừng?",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Em được bố mẹ cho quà. Em nói:",
      "opts": [
        "Con cảm ơn bố mẹ ạ!",
        "Con tạm biệt bố mẹ!",
        "Con chào bố mẹ ạ!"
      ],
      "ok": 0,
      "hint": "Nghĩ xem lúc đó cần nói gì: chào, cảm ơn, xin lỗi hay chúc mừng?",
      "yes": "Đúng rồi!"
    }
  ]
});
