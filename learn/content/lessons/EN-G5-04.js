/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 5 · Viết (Writing).
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G5-04",
  "grade": 5,
  "subj": "tanh",
  "title": "Viết (Writing)",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Viết (Writing).",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Viết câu và đoạn ngắn có liên kết đơn giản theo chủ đề và yêu cầu đã học.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "one day → two __ (số nhiều)",
      "opts": [
        "days",
        "dayen",
        "daies"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là days.",
      "no": "Thường thêm -s. Từ kết thúc bằng s, x, ch, sh thì thêm -es.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "They __ (watch) every day.",
      "opts": [
        "watch",
        "watched",
        "watches"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là watch.",
      "no": "He / She / It (và một người) + động từ thêm -s hoặc -es.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Chọn cách viết đúng: 🐘",
      "opts": [
        "elephant",
        "elephaant",
        "elephan"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là elephant.",
      "no": "Nhìn hình và đọc từng chữ cái của từ.",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Viết câu và đoạn ngắn có liên kết đơn giản theo chủ đề và yêu cầu đã học.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "one star → two __ (số nhiều)",
      "opts": [
        "stars",
        "staren",
        "starren"
      ],
      "ok": 0,
      "hint": "Thường thêm -s. Từ kết thúc bằng s, x, ch, sh thì thêm -es.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "I __ (like) every day.",
      "opts": [
        "liked",
        "likes",
        "like"
      ],
      "ok": 2,
      "hint": "He / She / It (và một người) + động từ thêm -s hoặc -es.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "Chọn cách viết đúng: 🌙",
      "opts": [
        "moon",
        "omon",
        "mon"
      ],
      "ok": 0,
      "hint": "Nhìn hình và đọc từng chữ cái của từ.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    }
  ]
});
