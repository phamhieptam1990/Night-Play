/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 5 · Nói và nghe.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G5-04",
  "grade": 5,
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
      "t": "Thuyết trình ngắn: chào, nói ý chính, cảm ơn.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Nghe để nắm ý chính rồi nhận xét lịch sự.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Bắt đầu thuyết trình, em làm gì?",
      "opts": [
        "Chào, giới thiệu đề tài",
        "Đọc lướt rồi thôi",
        "Cười thật to"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Chào, giới thiệu đề tài.",
      "no": "Mở đầu cho người nghe biết."
    },
    {
      "k": "choose",
      "t": "Kết thúc bài nói nên làm gì?",
      "opts": [
        "Bỏ đi ngay",
        "Cảm ơn người nghe",
        "Im lặng"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là Cảm ơn người nghe.",
      "no": "Lịch sự khi kết thúc."
    },
    {
      "k": "choose",
      "t": "Ý chính là gì?",
      "opts": [
        "Điều quan trọng nhất",
        "Tên người nói",
        "Chi tiết nhỏ nhất"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Điều quan trọng nhất.",
      "no": "Ý chính là điều cốt lõi."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Chào, nói ý chính, cảm ơn",
        "Nhận xét lịch sự"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Nhận xét bạn thế nào cho lịch sự?",
      "opts": [
        "Khen trước, góp ý nhẹ",
        "Chê thẳng",
        "Cười bạn"
      ],
      "ok": 0,
      "hint": "Góp ý để bạn tiến bộ.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Khi nói trước lớp em cần?",
      "opts": [
        "Nói thầm",
        "Nhìn xuống đất",
        "Nhìn người nghe, nói rõ"
      ],
      "ok": 2,
      "hint": "Giao tiếp bằng mắt.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Nên chuẩn bị gì trước khi nói?",
      "opts": [
        "Dàn ý các ý chính",
        "Không cần gì",
        "Chỉ nhớ tên"
      ],
      "ok": 0,
      "hint": "Chuẩn bị giúp nói trôi chảy.",
      "yes": "Đúng rồi!"
    }
  ]
});
