/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 3 · Nói (Speaking).
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G3-02",
  "grade": 3,
  "subj": "tanh",
  "title": "Nói (Speaking)",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Nói (Speaking).",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Hỏi–đáp và nói câu/cụm câu đơn giản về chủ đề quen thuộc với hỗ trợ phù hợp.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "“Goodbye!”",
      "opts": [
        "I'm fine.",
        "Hello!",
        "Bye! See you."
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Bye! See you..",
      "no": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "“Nice to meet you.”",
      "opts": [
        "Nice to meet you, too.",
        "Goodbye!",
        "You're welcome."
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Nice to meet you, too..",
      "no": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "“Good night!”",
      "opts": [
        "Thank you.",
        "Good night!",
        "I'm eight."
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là Good night!.",
      "no": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Hỏi–đáp và nói câu/cụm câu đơn giản về chủ đề quen thuộc với hỗ trợ phù hợp.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "“Good morning!”",
      "opts": [
        "Good morning!",
        "Goodbye!",
        "Thank you."
      ],
      "ok": 0,
      "hint": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "“How old are you?”",
      "opts": [
        "My name is Nam.",
        "I'm fine, thanks.",
        "I'm eight."
      ],
      "ok": 2,
      "hint": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "“I'm sorry.”",
      "opts": [
        "Hello!",
        "Good night.",
        "That's OK."
      ],
      "ok": 2,
      "hint": "Hello! → Hi! How are you? → I’m fine, thanks.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    }
  ]
});
