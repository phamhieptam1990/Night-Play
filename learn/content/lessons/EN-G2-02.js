/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 2 · Nói theo mẫu.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G2-02",
  "grade": 2,
  "subj": "tanh",
  "title": "Nói theo mẫu",
  "screens": [
    {
      "k": "say",
      "t": "Nói theo mẫu: Hello! I am Nam. How are you?",
      "art": "👋 Hello!"
    },
    {
      "k": "say",
      "t": "Trả lời: I am fine, thank you.",
      "art": "😊 I am fine."
    },
    {
      "k": "say",
      "t": "Chào tạm biệt: Goodbye! See you.",
      "art": "👋 Goodbye!"
    },
    {
      "k": "choose",
      "t": "Ai đó nói \"Hello!\". Bé đáp lại?",
      "opts": [
        "Hello!",
        "Thank you",
        "Goodbye!"
      ],
      "ok": 0,
      "yes": "Đúng! Hello.",
      "no": "Người ta chào, mình cũng chào.",
      "art": "Hello!",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "\"How are you?\" là hỏi gì?",
      "opts": [
        "Bạn khoẻ không?",
        "Bạn tên gì?",
        "Bạn mấy tuổi?"
      ],
      "ok": 0,
      "yes": "Đúng! Bạn khoẻ không?",
      "no": "Hỏi sức khoẻ.",
      "art": "How are you?"
    },
    {
      "k": "choose",
      "t": "Trả lời \"How are you?\"",
      "opts": [
        "I am fine, thank you.",
        "Goodbye!",
        "My name is Nam."
      ],
      "ok": 0,
      "yes": "Đúng! I am fine.",
      "no": "Nói mình khoẻ.",
      "art": "I am ...?",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Hello là xin chào, Goodbye là tạm biệt",
        "How are you? — I am fine, thank you",
        "My name is ... là tên của em"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Tạm biệt trong tiếng Anh là?",
      "opts": [
        "Thanks",
        "Hello",
        "Goodbye"
      ],
      "ok": 2,
      "hint": "Nói khi chia tay.",
      "yes": "Đúng! Goodbye.",
      "art": "👋",
      "optlang": "en"
    },
    {
      "q": "Cảm ơn trong tiếng Anh là?",
      "opts": [
        "Sorry",
        "Thank you",
        "Hello"
      ],
      "ok": 1,
      "hint": "Nói khi nhận quà.",
      "yes": "Đúng! Thank you.",
      "art": "🎁",
      "optlang": "en"
    },
    {
      "q": "\"What is your name?\" Bé trả lời?",
      "opts": [
        "I am fine.",
        "Goodbye.",
        "My name is Nam."
      ],
      "ok": 2,
      "hint": "Nói tên của mình.",
      "yes": "Đúng! My name is...",
      "art": "My name is ...?",
      "optlang": "en"
    }
  ]
});
