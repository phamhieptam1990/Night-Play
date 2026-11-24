/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 2 · Nói theo mẫu.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G2-02",
  "grade": 2,
  "subj": "tanh",
  "title": "Nói theo mẫu",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Nói theo mẫu.",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Sử dụng lời chào, giới thiệu và mẫu câu rất ngắn trong hoạt động có hỗ trợ.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "“Thank you.”",
      "opts": [
        "You're welcome.",
        "I'm sorry.",
        "Goodbye."
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là You're welcome..",
      "no": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "“See you tomorrow!”",
      "opts": [
        "See you!",
        "Sorry.",
        "I'm fine."
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là See you!.",
      "no": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "“Happy birthday!”",
      "opts": [
        "Thank you!",
        "See you.",
        "I'm sorry."
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Thank you!.",
      "no": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Sử dụng lời chào, giới thiệu và mẫu câu rất ngắn trong hoạt động có hỗ trợ.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "“I'm sorry.”",
      "opts": [
        "Good night.",
        "You're welcome.",
        "That's OK."
      ],
      "ok": 2,
      "hint": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "“Nice to meet you.”",
      "opts": [
        "Goodbye!",
        "Nice to meet you, too.",
        "I'm eight."
      ],
      "ok": 1,
      "hint": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "“How are you?”",
      "opts": [
        "See you.",
        "I'm nine.",
        "I'm fine, thanks."
      ],
      "ok": 2,
      "hint": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    }
  ]
});
