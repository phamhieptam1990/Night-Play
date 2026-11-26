/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 3 · Viết (Writing).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G3-04",
  "grade": 3,
  "subj": "tanh",
  "title": "Viết (Writing)",
  "screens": [
    {
      "k": "say",
      "t": "Dùng a trước phụ âm, an trước nguyên âm (a, e, i, o, u).",
      "art": "a dog · an apple"
    },
    {
      "k": "say",
      "t": "Số nhiều thường thêm s: cat → cats. Từ tận cùng s, x, ch, sh thì thêm es.",
      "art": "cat → cats\nbox → boxes"
    },
    {
      "k": "say",
      "t": "Viết đúng chính tả: đọc to từng chữ cái.",
      "art": "c - a - t"
    },
    {
      "k": "choose",
      "t": "Điền a hay an: This is __ apple.",
      "opts": [
        "an",
        "the",
        "a"
      ],
      "ok": 0,
      "yes": "Đúng! an apple.",
      "no": "Chữ cái đầu của apple là gì?",
      "art": "__ apple",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Điền a hay an: This is __ dog.",
      "opts": [
        "a",
        "the",
        "an"
      ],
      "ok": 0,
      "yes": "Đúng! a dog.",
      "no": "Chữ cái đầu của dog là phụ âm.",
      "art": "__ dog",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Số nhiều của cat là?",
      "opts": [
        "cat",
        "cats",
        "cates"
      ],
      "ok": 1,
      "yes": "Đúng! cats.",
      "no": "Thêm s.",
      "art": "one cat → two ?",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "a trước phụ âm, an trước nguyên âm",
        "Số nhiều thường thêm s",
        "Tận cùng x, s, ch, sh thêm es"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Số nhiều của box là?",
      "opts": [
        "boxies",
        "boxs",
        "boxes"
      ],
      "ok": 2,
      "hint": "Từ tận cùng x thì thêm es.",
      "yes": "Đúng! boxes.",
      "art": "one box → two ?",
      "optlang": "en"
    },
    {
      "q": "Chọn chữ viết đúng:",
      "opts": [
        "aple",
        "appel",
        "apple"
      ],
      "ok": 2,
      "hint": "Đọc từng chữ cái.",
      "yes": "Đúng! apple.",
      "art": "🍎",
      "optlang": "en"
    },
    {
      "q": "Điền a hay an: This is __ egg.",
      "opts": [
        "the",
        "an",
        "a"
      ],
      "ok": 1,
      "hint": "Chữ cái đầu của egg là gì?",
      "yes": "Đúng! an egg.",
      "art": "__ egg",
      "optlang": "en"
    }
  ]
});
