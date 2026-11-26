/* BẢN NHÁP TỰ SINH · Toán lớp 2 · Hình học.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g2_geometry",
  "grade": 2,
  "subj": "toan",
  "title": "Hình học",
  "screens": [
    {
      "k": "say",
      "t": "Hình tròn không có góc. Hình vuông có 4 cạnh bằng nhau.",
      "art": "⚪  ⬜"
    },
    {
      "k": "say",
      "t": "Hình tam giác có 3 cạnh, 3 góc. Hình chữ nhật có 4 cạnh, 4 góc vuông.",
      "art": "🔺  ▭"
    },
    {
      "k": "say",
      "t": "Nhìn đồ vật quanh em: quả bóng là hình cầu, hộp quà là hình khối hộp.",
      "art": "⚽  🎁"
    },
    {
      "k": "choose",
      "t": "Hình nào có đúng 3 cạnh?",
      "opts": [
        "Hình tam giác",
        "Hình tròn",
        "Hình vuông"
      ],
      "ok": 0,
      "yes": "Đúng! Tam giác có 3 cạnh.",
      "no": "Đếm số cạnh của từng hình.",
      "art": "🔺"
    },
    {
      "k": "choose",
      "t": "Hình nào có 4 cạnh bằng nhau?",
      "opts": [
        "Hình vuông",
        "Hình tròn",
        "Hình tam giác"
      ],
      "ok": 0,
      "yes": "Đúng! Đó là hình vuông.",
      "no": "Hình này có 4 góc vuông và các cạnh bằng nhau.",
      "art": "⬜"
    },
    {
      "k": "choose",
      "t": "Hình nào không có cạnh và không có góc?",
      "opts": [
        "Hình tròn",
        "Hình vuông",
        "Hình chữ nhật"
      ],
      "ok": 0,
      "yes": "Đúng! Hình tròn không có góc.",
      "no": "Hình này cong tròn đều.",
      "art": "⚪"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Tam giác 3 cạnh, vuông và chữ nhật 4 cạnh",
        "Hình tròn không có góc",
        "Đồ vật quanh ta có dạng các hình quen thuộc"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Mặt bàn học thường có dạng hình gì?",
      "opts": [
        "Hình chữ nhật",
        "Hình tam giác",
        "Hình tròn"
      ],
      "ok": 0,
      "hint": "Mặt bàn có 2 cạnh dài, 2 cạnh ngắn.",
      "yes": "Đúng! Hình chữ nhật.",
      "art": "📚"
    },
    {
      "q": "Quả bóng giống khối nào?",
      "opts": [
        "Khối trụ",
        "Khối hộp",
        "Khối cầu"
      ],
      "ok": 2,
      "hint": "Quả bóng lăn tròn mọi phía.",
      "yes": "Đúng! Khối cầu.",
      "art": "⚽"
    },
    {
      "q": "Hình chữ nhật có mấy góc vuông?",
      "opts": [
        "2",
        "3",
        "4"
      ],
      "ok": 2,
      "hint": "Chữ nhật có 4 góc.",
      "yes": "Đúng! Có 4 góc vuông.",
      "art": "▭"
    }
  ]
});
