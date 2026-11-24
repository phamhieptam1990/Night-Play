/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 5 · Viết văn bản.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G5-03",
  "grade": 5,
  "subj": "tviet",
  "title": "Viết văn bản",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Viết văn bản.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Bài văn có ba phần: mở bài, thân bài, kết bài.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Viết xong, em rà soát ý và chính tả.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Phần nào giới thiệu đề tài?",
      "opts": [
        "Mở bài",
        "Kết bài",
        "Thân bài"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Mở bài.",
      "no": "Phần đầu của bài."
    },
    {
      "k": "choose",
      "t": "Phần nào kể, tả chi tiết?",
      "opts": [
        "Kết bài",
        "Mở bài",
        "Thân bài"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Thân bài.",
      "no": "Phần giữa, dài nhất."
    },
    {
      "k": "choose",
      "t": "Phần nào nêu cảm nghĩ và kết thúc?",
      "opts": [
        "Kết bài",
        "Mở bài",
        "Thân bài"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Kết bài.",
      "no": "Phần cuối của bài."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Mở bài, thân bài, kết bài",
        "Rà soát ý và chính tả"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Bài tả cây phượng, ý nào đúng đề?",
      "opts": [
        "Hoa phượng đỏ rực",
        "Con mèo ngủ",
        "Em đi chợ"
      ],
      "ok": 0,
      "hint": "Đúng đề là nói về cây phượng.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Rà soát bài viết là gì?",
      "opts": [
        "Đọc lại, sửa ý và lỗi",
        "Xoá hết",
        "Nộp luôn"
      ],
      "ok": 0,
      "hint": "Kiểm tra lại cho tốt.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Câu nào là câu mở bài hay?",
      "opts": [
        "Ăn cơm chưa?",
        "Em yêu cây phượng.",
        "Hết rồi."
      ],
      "ok": 1,
      "hint": "Giới thiệu đề tài.",
      "yes": "Đúng rồi!"
    }
  ]
});
