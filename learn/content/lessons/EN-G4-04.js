/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 4 · Viết (Writing).
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G4-04",
  "grade": 4,
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
      "t": "Viết câu và đoạn rất ngắn theo mẫu/gợi ý về chủ đề đã học.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "Điền a hay an: This is __ ice cream.",
      "opts": [
        "an",
        "many",
        "two"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là an.",
      "no": "Nghe âm đầu của từ: nguyên âm (a, e, i, o, u) thì dùng an; còn lại dùng a.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "one boy → two __ (số nhiều)",
      "opts": [
        "boys",
        "boyes",
        "boies"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là boys.",
      "no": "Thường thêm -s. Từ kết thúc bằng s, x, ch, sh thì thêm -es.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "My mother __ (watch) every day.",
      "opts": [
        "watches",
        "watching",
        "watch"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là watches.",
      "no": "He / She / It (và một người) + động từ thêm -s hoặc -es.",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Viết câu và đoạn rất ngắn theo mẫu/gợi ý về chủ đề đã học.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Chọn cách viết đúng: 🦵",
      "opts": [
        "leeg",
        "lge",
        "leg"
      ],
      "ok": 2,
      "hint": "Nhìn hình và đọc từng chữ cái của từ.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "Điền a hay an: This is __ eye.",
      "opts": [
        "two",
        "a",
        "an"
      ],
      "ok": 2,
      "hint": "Nghe âm đầu của từ: nguyên âm (a, e, i, o, u) thì dùng an; còn lại dùng a.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "one watch → two __ (số nhiều)",
      "opts": [
        "watchs",
        "watches",
        "watchen"
      ],
      "ok": 1,
      "hint": "Thường thêm -s. Từ kết thúc bằng s, x, ch, sh thì thêm -es.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    }
  ]
});
