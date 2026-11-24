/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 4 · Nói (Speaking).
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G4-02",
  "grade": 4,
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
      "t": "Trao đổi thông tin cá nhân và chủ đề quen thuộc bằng câu đơn giản; phát âm đủ rõ để…",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "___ is your teacher?Trả lời: “Ms Lan.”",
      "opts": [
        "What time",
        "Who",
        "How many"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là Who.",
      "no": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "___ are you from?Trả lời: “I'm from Hue.”",
      "opts": [
        "Where",
        "Who",
        "How many"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Where.",
      "no": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "___ is your favourite colour?Trả lời: “It's blue.”",
      "opts": [
        "Who",
        "How many",
        "What"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là What.",
      "no": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Trao đổi thông tin cá nhân và chủ đề quen thuộc bằng câu đơn giản; phát âm đủ rõ để…",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "___ is your name?Trả lời: “My name is Mai.”",
      "opts": [
        "When",
        "What",
        "Where"
      ],
      "ok": 1,
      "hint": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "___ do you get up?Trả lời: “At six o'clock.”",
      "opts": [
        "Where",
        "How many",
        "What time"
      ],
      "ok": 2,
      "hint": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "___ is that man?Trả lời: “He is my uncle.”",
      "opts": [
        "How many",
        "Who",
        "When"
      ],
      "ok": 1,
      "hint": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "yes": "Đúng rồi!",
      "optlang": "en"
    }
  ]
});
