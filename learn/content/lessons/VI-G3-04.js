/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 3 · Nói và nghe.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G3-04",
  "grade": 3,
  "subj": "tviet",
  "title": "Nói và nghe",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Nói và nghe.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Khi nói, em nói rõ ràng và nhìn người nghe.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Khi nghe, em nghe hết rồi mới nói.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Khi bạn đang nói, em nên làm gì?",
      "opts": [
        "Nghe bạn nói hết",
        "Nói chen vào",
        "Quay đi chỗ khác"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Nghe bạn nói hết.",
      "no": "Tôn trọng người đang nói."
    },
    {
      "k": "choose",
      "t": "Em muốn hỏi cô giáo. Em nói thế nào?",
      "opts": [
        "Cô nói đi!",
        "Thưa cô, cho em hỏi ạ.",
        "Này cô!"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là Thưa cô, cho em hỏi ạ..",
      "no": "Nói lễ phép, có chào hỏi."
    },
    {
      "k": "choose",
      "t": "Khi nói trước lớp, em cần?",
      "opts": [
        "Nói thật nhanh",
        "Nói rõ, đủ to",
        "Nói thật nhỏ"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là Nói rõ, đủ to.",
      "no": "Để cả lớp nghe được."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Nói rõ, đủ to",
        "Nghe hết rồi mới nói"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Người nghe cần nhìn vào đâu?",
      "opts": [
        "Người đang nói",
        "Ra cửa sổ",
        "Xuống bàn"
      ],
      "ok": 0,
      "hint": "Nhìn để thể hiện sự chú ý.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Em chưa hiểu bài. Em nên?",
      "opts": [
        "Im lặng",
        "Hỏi lại thầy cô",
        "Làm ồn"
      ],
      "ok": 1,
      "hint": "Không hiểu thì hỏi.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Được bạn giúp, em nói gì?",
      "opts": [
        "Kệ.",
        "Em cảm ơn bạn.",
        "Thôi."
      ],
      "ok": 1,
      "hint": "Nói lời cảm ơn.",
      "yes": "Đúng rồi!"
    }
  ]
});
