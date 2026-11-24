/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 3 · Nói (Speaking).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G3-02",
  "grade": 3,
  "subj": "tanh",
  "title": "Nói (Speaking)",
  "screens": [
    {
      "k": "say",
      "t": "I am, you are, he is, she is. Dùng am, is, are đúng với chủ ngữ.",
      "art": "I am · He is · They are"
    },
    {
      "k": "say",
      "t": "Hỏi thăm: How are you? — I am fine. What is your name? — My name is Lan.",
      "art": "💬 How are you?"
    },
    {
      "k": "say",
      "t": "Hỏi đáp ngắn: Is this a cat? — Yes, it is.",
      "art": "Yes, it is. / No, it isn't."
    },
    {
      "k": "choose",
      "t": "Điền am, is hay are: I __ a student.",
      "opts": [
        "is",
        "are",
        "am"
      ],
      "ok": 2,
      "yes": "Đúng! I am.",
      "no": "Chủ ngữ là I.",
      "art": "I __ a student.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Điền am, is hay are: She __ my friend.",
      "opts": [
        "is",
        "are",
        "am"
      ],
      "ok": 0,
      "yes": "Đúng! She is.",
      "no": "Chủ ngữ là một người (số ít).",
      "art": "She __ my friend.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Điền am, is hay are: They __ happy.",
      "opts": [
        "is",
        "are",
        "am"
      ],
      "ok": 1,
      "yes": "Đúng! They are.",
      "no": "They chỉ nhiều người.",
      "art": "They __ happy.",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "I am, he/she/it is, you/we/they are",
        "Hỏi tên: What is your name?",
        "Hỏi thăm: How are you?"
      ]
    }
  ],
  "tryit": [
    {
      "q": "\"What is your name?\" Trả lời?",
      "opts": [
        "My name is Lan.",
        "Yes, it is.",
        "I am fine."
      ],
      "ok": 0,
      "hint": "Nói tên mình.",
      "yes": "Đúng! My name is...",
      "art": "What is your name?",
      "optlang": "en"
    },
    {
      "q": "\"How are you?\" Trả lời?",
      "opts": [
        "Goodbye.",
        "My name is Lan.",
        "I am fine, thank you."
      ],
      "ok": 2,
      "hint": "Nói về sức khoẻ.",
      "yes": "Đúng! I am fine.",
      "art": "How are you?",
      "optlang": "en"
    },
    {
      "q": "Điền am, is hay are: We __ at school.",
      "opts": [
        "am",
        "is",
        "are"
      ],
      "ok": 2,
      "hint": "We là chúng tôi (nhiều người).",
      "yes": "Đúng! We are.",
      "art": "We __ at school.",
      "optlang": "en"
    }
  ]
});
