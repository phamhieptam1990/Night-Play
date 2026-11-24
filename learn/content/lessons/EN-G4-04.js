/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 4 · Viết (Writing).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G4-04",
  "grade": 4,
  "subj": "tanh",
  "title": "Viết (Writing)",
  "screens": [
    {
      "k": "say",
      "t": "Dùng a trước phụ âm, an trước nguyên âm.",
      "art": "a book · an egg"
    },
    {
      "k": "say",
      "t": "Với he, she, it, động từ thêm s: He plays.",
      "art": "He plays · She eats"
    },
    {
      "k": "say",
      "t": "Số nhiều: cat → cats, box → boxes, child → children.",
      "art": "child → children"
    },
    {
      "k": "choose",
      "t": "Điền: She __ football.",
      "opts": [
        "plays",
        "play",
        "playing"
      ],
      "ok": 0,
      "yes": "Đúng! She plays.",
      "no": "Chủ ngữ she là một người.",
      "art": "She __ football.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Điền: I __ milk.",
      "opts": [
        "like",
        "likes",
        "liking"
      ],
      "ok": 0,
      "yes": "Đúng! I like.",
      "no": "Chủ ngữ là I.",
      "art": "I __ milk.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Điền a hay an: This is __ orange.",
      "opts": [
        "an",
        "a",
        "the"
      ],
      "ok": 0,
      "yes": "Đúng! an orange.",
      "no": "Chữ cái đầu của orange là gì?",
      "art": "__ orange",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "a trước phụ âm, an trước nguyên âm",
        "He/She/It: động từ thêm s hoặc es",
        "Số nhiều thường thêm s"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Số nhiều của box là?",
      "opts": [
        "boxen",
        "boxs",
        "boxes"
      ],
      "ok": 2,
      "hint": "Tận cùng x thì thêm es.",
      "yes": "Đúng! boxes.",
      "art": "box → ?",
      "optlang": "en"
    },
    {
      "q": "Điền: He __ to school.",
      "opts": [
        "go",
        "going",
        "goes"
      ],
      "ok": 2,
      "hint": "Chủ ngữ he, động từ go thêm es.",
      "yes": "Đúng! He goes.",
      "art": "He __ to school.",
      "optlang": "en"
    },
    {
      "q": "Chọn chữ viết đúng:",
      "opts": [
        "scool",
        "school",
        "shool"
      ],
      "ok": 1,
      "hint": "Đọc từng chữ cái.",
      "yes": "Đúng! school.",
      "art": "🏫",
      "optlang": "en"
    }
  ]
});
