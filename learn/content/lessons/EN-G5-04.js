/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 5 · Viết (Writing).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G5-04",
  "grade": 5,
  "subj": "tanh",
  "title": "Viết (Writing)",
  "screens": [
    {
      "k": "say",
      "t": "Số nhiều: thêm s, hoặc es sau s, x, ch, sh. Bất quy tắc: child → children.",
      "art": "box → boxes"
    },
    {
      "k": "say",
      "t": "He, she, it: động từ thêm s hoặc es.",
      "art": "She eats · He goes"
    },
    {
      "k": "say",
      "t": "Viết đúng chính tả: đọc to rồi viết.",
      "art": "w - r - i - t - e"
    },
    {
      "k": "choose",
      "t": "Số nhiều của child là?",
      "opts": [
        "children",
        "childes",
        "childs"
      ],
      "ok": 0,
      "yes": "Đúng! children.",
      "no": "Đây là từ bất quy tắc.",
      "art": "child → ?",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Số nhiều của box là?",
      "opts": [
        "boxes",
        "boxen",
        "boxs"
      ],
      "ok": 0,
      "yes": "Đúng! boxes.",
      "no": "Tận cùng x thì thêm es.",
      "art": "box → ?",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Điền: She __ breakfast every day.",
      "opts": [
        "eats",
        "eating",
        "eat"
      ],
      "ok": 0,
      "yes": "Đúng! eats.",
      "no": "Chủ ngữ she là một người.",
      "art": "She __ ...",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Số nhiều: s, es, bất quy tắc",
        "He/She/It: động từ thêm s, es",
        "Đọc to rồi viết đúng chính tả"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Điền: He __ to school by bike.",
      "opts": [
        "goes",
        "go",
        "going"
      ],
      "ok": 0,
      "hint": "Go thêm es với he.",
      "yes": "Đúng! goes.",
      "art": "He __ ...",
      "optlang": "en"
    },
    {
      "q": "Chọn chữ viết đúng:",
      "opts": [
        "beatiful",
        "beutiful",
        "beautiful"
      ],
      "ok": 2,
      "hint": "Đọc từng chữ cái.",
      "yes": "Đúng! beautiful.",
      "art": "✨",
      "optlang": "en"
    },
    {
      "q": "Số nhiều của watch là?",
      "opts": [
        "watches",
        "watchies",
        "watchs"
      ],
      "ok": 0,
      "hint": "Tận cùng ch thì thêm es.",
      "yes": "Đúng! watches.",
      "art": "watch → ?",
      "optlang": "en"
    }
  ]
});
