/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 5 · Nói (Speaking).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G5-02",
  "grade": 5,
  "subj": "tanh",
  "title": "Nói (Speaking)",
  "screens": [
    {
      "k": "say",
      "t": "Câu hỏi Wh: What, Where, When, Who, Why, How.",
      "art": "What? Where? Why?"
    },
    {
      "k": "say",
      "t": "Be: I am, he/she/it is, you/we/they are. Hôm qua dùng was/were.",
      "art": "I was · They were"
    },
    {
      "k": "say",
      "t": "Trả lời đủ ý: Why? — Because ...",
      "art": "Because it is raining."
    },
    {
      "k": "choose",
      "t": "Hỏi lý do dùng từ nào?",
      "opts": [
        "Why",
        "Where",
        "Who"
      ],
      "ok": 0,
      "yes": "Đúng! Why.",
      "no": "Câu trả lời thường bắt đầu bằng because.",
      "art": "?",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Điền: My parents __ at home.",
      "opts": [
        "are",
        "am",
        "is"
      ],
      "ok": 0,
      "yes": "Đúng! are.",
      "no": "Parents là nhiều người.",
      "art": "They __ at home.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "\"When is your birthday?\" Trả lời?",
      "opts": [
        "It is a cake.",
        "I am ten.",
        "It is in May."
      ],
      "ok": 2,
      "yes": "Đúng! In May.",
      "no": "Nói thời gian.",
      "art": "🎂",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Wh: What, Where, When, Who, Why, How",
        "am/is/are và was/were",
        "Why — Because"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Điền: She __ my teacher.",
      "opts": [
        "is",
        "am",
        "are"
      ],
      "ok": 0,
      "hint": "Chủ ngữ là một người.",
      "yes": "Đúng! is.",
      "art": "She __ my teacher.",
      "optlang": "en"
    },
    {
      "q": "\"How old are you?\" Trả lời?",
      "opts": [
        "I am fine.",
        "It is red.",
        "I am ten."
      ],
      "ok": 2,
      "hint": "Nói tuổi.",
      "yes": "Đúng! I am ten.",
      "art": "How old?",
      "optlang": "en"
    },
    {
      "q": "Điền: Yesterday I __ at school.",
      "opts": [
        "was",
        "am",
        "is"
      ],
      "ok": 0,
      "hint": "Hôm qua là quá khứ.",
      "yes": "Đúng! was.",
      "art": "Yesterday I __ ...",
      "optlang": "en"
    }
  ]
});
