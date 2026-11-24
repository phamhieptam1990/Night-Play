/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 5 · Nói (Speaking).
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G5-02",
  "grade": 5,
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
      "t": "Hỏi, trả lời, mô tả và trình bày ngắn về bản thân, gia đình, trường học và môi trường…",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "___ pencils do you have?Trả lời: “Five.”",
      "opts": [
        "How many",
        "Who",
        "Where"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là How many.",
      "no": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "___ do you live?Trả lời: “In Hanoi.”",
      "opts": [
        "Where",
        "Who",
        "What"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Where.",
      "no": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "___ is your name?Trả lời: “My name is Mai.”",
      "opts": [
        "Where",
        "When",
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
        "Hỏi, trả lời, mô tả và trình bày ngắn về bản thân, gia đình, trường học và môi trường…",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "___ is your teacher?Trả lời: “Ms Lan.”",
      "opts": [
        "Who",
        "What time",
        "How many"
      ],
      "ok": 0,
      "hint": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "___ is your birthday?Trả lời: “It's in May.”",
      "opts": [
        "Where",
        "How many",
        "When"
      ],
      "ok": 2,
      "hint": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "___ do you get up?Trả lời: “At six o'clock.”",
      "opts": [
        "What time",
        "Who",
        "How many"
      ],
      "ok": 0,
      "hint": "Đọc câu trả lời để biết câu hỏi nói về điều gì: tên, nơi chốn, người, tuổi, số…",
      "yes": "Đúng rồi!",
      "optlang": "en"
    }
  ]
});
