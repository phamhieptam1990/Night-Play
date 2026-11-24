/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 3 · Viết.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G3-03",
  "grade": 3,
  "subj": "tviet",
  "title": "Viết",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Viết.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Viết đoạn văn: mở đầu, nói ý chính, kết thúc.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Viết xong, em đọc lại để sửa lỗi.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Đoạn văn kể về con mèo, câu nào mở đầu hợp?",
      "opts": [
        "Hôm qua mưa to.",
        "Em thích ăn kem.",
        "Nhà em có một con mèo."
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Nhà em có một con mèo..",
      "no": "Câu mở đầu giới thiệu đề tài."
    },
    {
      "k": "choose",
      "t": "Viết xong, em cần làm gì?",
      "opts": [
        "Vứt đi",
        "Không cần làm gì",
        "Đọc lại và sửa lỗi"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Đọc lại và sửa lỗi.",
      "no": "Rà soát cho đúng."
    },
    {
      "k": "choose",
      "t": "Câu nào viết đúng chính tả?",
      "opts": [
        "Con nghe ăn cỏ.",
        "Con ngé ăn cỏ.",
        "Con nghé ăn cỏ."
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Con nghé ăn cỏ..",
      "no": "Nghé là con của trâu."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đoạn văn có mở đầu và ý chính",
        "Đọc lại để sửa lỗi"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Cuối câu hỏi ta dùng dấu gì?",
      "opts": [
        "Dấu chấm hỏi",
        "Dấu phẩy",
        "Dấu chấm"
      ],
      "ok": 0,
      "hint": "Câu hỏi có dấu riêng.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Tả bầu trời ban ngày, từ nào hợp?",
      "opts": [
        "Xanh thẳm",
        "Đen kịt",
        "Đỏ rực"
      ],
      "ok": 0,
      "hint": "Nghĩ về màu trời.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Câu nào là câu kể?",
      "opts": [
        "Em đi học.",
        "Em đi học không?",
        "Đi học đi!"
      ],
      "ok": 0,
      "hint": "Câu kể kể lại một việc.",
      "yes": "Đúng rồi!"
    }
  ]
});
