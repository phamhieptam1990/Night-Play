/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 4 · Nói (Speaking).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G4-02",
  "grade": 4,
  "subj": "tanh",
  "title": "Nói (Speaking)",
  "screens": [
    {
      "k": "say",
      "t": "Câu hỏi Wh: What là gì, Where là ở đâu, Who là ai, When là khi nào.",
      "art": "What? Where? Who? When?"
    },
    {
      "k": "say",
      "t": "Với I thì am, he/she/it thì is, you/we/they thì are.",
      "art": "She is · They are"
    },
    {
      "k": "say",
      "t": "Trả lời đủ câu: Where is the cat? — It is on the bed.",
      "art": "🐱 on the bed"
    },
    {
      "k": "choose",
      "t": "Hỏi về nơi chốn dùng từ nào?",
      "opts": [
        "Who",
        "Where",
        "What"
      ],
      "ok": 1,
      "yes": "Đúng! Where.",
      "no": "Câu hỏi này muốn biết ở đâu.",
      "art": "📍",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Hỏi về người dùng từ nào?",
      "opts": [
        "Who",
        "Where",
        "When"
      ],
      "ok": 0,
      "yes": "Đúng! Who.",
      "no": "Câu hỏi này muốn biết ai.",
      "art": "👤",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Điền: My brother __ ten years old.",
      "opts": [
        "am",
        "are",
        "is"
      ],
      "ok": 2,
      "yes": "Đúng! is.",
      "no": "Chủ ngữ là một người (số ít).",
      "art": "My brother __ ten.",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "What là gì, Where là ở đâu, Who là ai",
        "am, is, are theo chủ ngữ",
        "Trả lời bằng câu đầy đủ"
      ]
    }
  ],
  "tryit": [
    {
      "q": "\"Where is the cat?\" Trả lời?",
      "opts": [
        "Yes, it is.",
        "It is on the bed.",
        "It is red."
      ],
      "ok": 1,
      "hint": "Nói chỗ ở của con mèo.",
      "yes": "Đúng! It is on the bed.",
      "art": "🐱 ?",
      "optlang": "en"
    },
    {
      "q": "Điền: We __ in the classroom.",
      "opts": [
        "am",
        "is",
        "are"
      ],
      "ok": 2,
      "hint": "We là nhiều người.",
      "yes": "Đúng! We are.",
      "art": "We __ here.",
      "optlang": "en"
    },
    {
      "q": "\"What is this?\" Trả lời?",
      "opts": [
        "I am ten.",
        "It is a book.",
        "She is a girl."
      ],
      "ok": 1,
      "hint": "Nói đồ vật.",
      "yes": "Đúng! It is a book.",
      "art": "📘",
      "optlang": "en"
    }
  ]
});
