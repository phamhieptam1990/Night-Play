/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 4 · Nói và nghe.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G4-04",
  "grade": 4,
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
      "t": "Khi kể chuyện, em kể đúng thứ tự: mở đầu, diễn biến, kết thúc.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Khi nêu ý kiến, em nói rõ vì sao.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Kể chuyện nên bắt đầu từ đâu?",
      "opts": [
        "Phần kết",
        "Giữa chuyện",
        "Phần mở đầu"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Phần mở đầu.",
      "no": "Kể theo thứ tự."
    },
    {
      "k": "choose",
      "t": "Câu nào nêu ý kiến có lý do?",
      "opts": [
        "Em thích vì truyện vui.",
        "Em thích.",
        "Không biết."
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Em thích vì truyện vui..",
      "no": "Có chữ vì là có lý do."
    },
    {
      "k": "choose",
      "t": "Muốn bạn hiểu, ta nên nói thế nào?",
      "opts": [
        "Rất nhỏ",
        "Lộn xộn",
        "Rõ ràng, có thứ tự"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Rõ ràng, có thứ tự.",
      "no": "Nói có trình tự."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Kể đúng thứ tự",
        "Nêu ý kiến có lý do"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Khi bạn đang kể, em có thể?",
      "opts": [
        "Cắt lời liên tục",
        "Hỏi lại điều chưa rõ",
        "Đòi đổi chuyện"
      ],
      "ok": 1,
      "hint": "Hỏi sau khi bạn kể xong.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Phần nào kể điều xảy ra chính?",
      "opts": [
        "Mở đầu",
        "Tên truyện",
        "Diễn biến"
      ],
      "ok": 2,
      "hint": "Chuyện chính nằm ở giữa.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Khi trao đổi ý kiến, em cần?",
      "opts": [
        "Quát bạn",
        "Bỏ đi",
        "Tôn trọng ý bạn"
      ],
      "ok": 2,
      "hint": "Lắng nghe và lịch sự.",
      "yes": "Đúng rồi!"
    }
  ]
});
