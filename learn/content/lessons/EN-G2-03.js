/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 2 · Từ vựng theo chủ đề.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G2-03",
  "grade": 2,
  "subj": "tanh",
  "title": "Từ vựng theo chủ đề",
  "screens": [
    {
      "k": "say",
      "t": "Con vật: cat là mèo, dog là chó, bird là chim.",
      "art": "🐱 cat · 🐶 dog · 🐦 bird"
    },
    {
      "k": "say",
      "t": "Màu sắc: red là đỏ, blue là xanh dương, yellow là vàng.",
      "art": "🔴 red · 🔵 blue"
    },
    {
      "k": "say",
      "t": "Số: one, two, three. Và ngày trong tuần: Monday là thứ Hai.",
      "art": "1 one · 2 two · 3 three"
    },
    {
      "k": "choose",
      "t": "Đây là con gì?",
      "opts": [
        "bird",
        "dog",
        "cat"
      ],
      "ok": 2,
      "yes": "Đúng! cat.",
      "no": "Nghe tiếng kêu meo meo.",
      "art": "🐱",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Đây là con gì?",
      "opts": [
        "cat",
        "fish",
        "dog"
      ],
      "ok": 2,
      "yes": "Đúng! dog.",
      "no": "Nghe tiếng kêu gâu gâu.",
      "art": "🐶",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Màu này tiếng Anh là gì?",
      "opts": [
        "red",
        "green",
        "blue"
      ],
      "ok": 0,
      "yes": "Đúng! red.",
      "no": "Nhìn màu của quả táo.",
      "art": "🔴",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "cat mèo, dog chó, bird chim",
        "red đỏ, blue xanh dương, yellow vàng",
        "one, two, three là một, hai, ba"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Số 3 tiếng Anh là?",
      "opts": [
        "one",
        "two",
        "three"
      ],
      "ok": 2,
      "hint": "Đếm 1, 2, 3.",
      "yes": "Đúng! three.",
      "art": "3",
      "optlang": "en"
    },
    {
      "q": "Đây là gì?",
      "opts": [
        "cat",
        "dog",
        "bird"
      ],
      "ok": 2,
      "hint": "Con vật này biết bay.",
      "yes": "Đúng! bird.",
      "art": "🐦",
      "optlang": "en"
    },
    {
      "q": "Màu này tiếng Anh là gì?",
      "opts": [
        "yellow",
        "red",
        "blue"
      ],
      "ok": 2,
      "hint": "Nhìn màu của bầu trời.",
      "yes": "Đúng! blue.",
      "art": "🔵",
      "optlang": "en"
    }
  ]
});
