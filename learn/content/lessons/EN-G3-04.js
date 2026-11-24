/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 3 · Viết (Writing).
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G3-04",
  "grade": 3,
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
      "t": "Chép/viết từ, cụm từ và câu đơn giản theo mẫu phù hợp với nội dung đã học.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "Điền a hay an: This is __ pencil.",
      "opts": [
        "a",
        "an",
        "many"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là a.",
      "no": "Nghe âm đầu của từ: nguyên âm (a, e, i, o, u) thì dùng an; còn lại dùng a.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "one bird → two __ (số nhiều)",
      "opts": [
        "birds",
        "birdies",
        "birden"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là birds.",
      "no": "Thường thêm -s. Từ kết thúc bằng s, x, ch, sh thì thêm -es.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Chọn cách viết đúng: 🧣",
      "opts": [
        "scaf",
        "scarf",
        "scarff"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là scarf.",
      "no": "Nhìn hình và đọc từng chữ cái của từ.",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Chép/viết từ, cụm từ và câu đơn giản theo mẫu phù hợp với nội dung đã học.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Điền a hay an: This is __ bag.",
      "opts": [
        "many",
        "two",
        "a"
      ],
      "ok": 2,
      "hint": "Nghe âm đầu của từ: nguyên âm (a, e, i, o, u) thì dùng an; còn lại dùng a.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "one foot → two __ (số nhiều)",
      "opts": [
        "footren",
        "foots",
        "feet"
      ],
      "ok": 2,
      "hint": "Thường thêm -s. Từ kết thúc bằng s, x, ch, sh thì thêm -es.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "Chọn cách viết đúng: ❄️",
      "opts": [
        "sowy",
        "snowy",
        "ssnowy"
      ],
      "ok": 1,
      "hint": "Nhìn hình và đọc từng chữ cái của từ.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    }
  ]
});
