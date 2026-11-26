/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 2 · Nói và nghe.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G2-04",
  "grade": 2,
  "subj": "tviet",
  "title": "Nói và nghe",
  "screens": [
    {
      "k": "say",
      "t": "Khi chào hỏi: nhìn người nghe, nói rõ ràng, lễ phép.",
      "art": "Em chào cô ạ!"
    },
    {
      "k": "say",
      "t": "Nghe xong, nhắc lại ý chính: ai, làm gì.",
      "art": "👂 Nghe → nhớ → nói"
    },
    {
      "k": "say",
      "t": "Khi muốn nói, giơ tay xin phép; khi bạn nói, lắng nghe.",
      "art": "🙋 Giơ tay"
    },
    {
      "k": "choose",
      "t": "Gặp cô giáo buổi sáng, em nói gì?",
      "opts": [
        "Cô đi đi!",
        "Em chào cô ạ!",
        "Này cô!"
      ],
      "ok": 1,
      "yes": "Đúng! Chào cô lễ phép.",
      "no": "Chọn lời lễ phép.",
      "art": "👩‍🏫"
    },
    {
      "k": "choose",
      "t": "Khi bạn đang nói, em nên làm gì?",
      "opts": [
        "Quay đi chỗ khác",
        "Lắng nghe",
        "Nói chen vào"
      ],
      "ok": 1,
      "yes": "Đúng! Lắng nghe bạn.",
      "no": "Nghĩ xem bạn muốn được đối xử thế nào.",
      "art": "👂"
    },
    {
      "k": "choose",
      "t": "Muốn xin phép cô ra ngoài, em nói thế nào?",
      "opts": [
        "Thưa cô, em xin ra ạ.",
        "Em đi đây.",
        "Cho ra!"
      ],
      "ok": 0,
      "yes": "Đúng! Nói lễ phép.",
      "no": "Bắt đầu bằng lời thưa.",
      "art": "🚪"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Chào hỏi lễ phép",
        "Lắng nghe khi bạn nói",
        "Nói rõ ràng, nhìn người nghe"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Nhận quà từ bạn, em nói gì?",
      "opts": [
        "Xin lỗi bạn!",
        "Cảm ơn bạn!",
        "Chào bạn!"
      ],
      "ok": 1,
      "hint": "Bạn vừa làm điều tốt cho em.",
      "yes": "Đúng! Cảm ơn.",
      "art": "🎁"
    },
    {
      "q": "Em lỡ làm rơi bút của bạn. Em nói gì?",
      "opts": [
        "Không sao.",
        "Xin lỗi bạn.",
        "Cảm ơn bạn."
      ],
      "ok": 1,
      "hint": "Em đã làm điều không tốt.",
      "yes": "Đúng! Xin lỗi.",
      "art": "✏️"
    },
    {
      "q": "Khi nói chuyện, em nên nói thế nào?",
      "opts": [
        "Rõ ràng, nhìn người nghe",
        "Thật nhỏ, cúi mặt",
        "Thật to, hét lên"
      ],
      "ok": 0,
      "hint": "Người nghe cần nghe và thấy em.",
      "yes": "Đúng! Nói rõ, nhìn người nghe.",
      "art": "🗣️"
    }
  ]
});
