/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Thống kê và khả năng xảy ra.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g3_statistics",
  "grade": 3,
  "subj": "toan",
  "title": "Thống kê và khả năng xảy ra",
  "screens": [
    {
      "k": "say",
      "t": "Bảng số liệu ghi số lượng của mỗi loại.",
      "art": "Mèo 5 · Chó 8"
    },
    {
      "k": "say",
      "t": "Nhiều nhất là số lớn nhất, ít nhất là số bé nhất. Hơn bao nhiêu thì trừ.",
      "art": "8 − 5 = 3"
    },
    {
      "k": "say",
      "t": "Có thể xảy ra, chắc chắn hay không thể: ví dụ ngày mai mặt trời mọc là chắc chắn.",
      "art": "🌅 chắc chắn"
    },
    {
      "k": "choose",
      "t": "Lớp có 5 bạn thích mèo, 8 bạn thích chó. Bên nào nhiều hơn?",
      "opts": [
        "Thích mèo",
        "Thích chó",
        "Bằng nhau"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là Thích chó.",
      "no": "So sánh 5 và 8: số nào lớn hơn?"
    },
    {
      "k": "choose",
      "t": "Tổ 1 hái 12 quả, tổ 2 hái 9 quả. Cả hai tổ hái mấy quả?",
      "opts": [
        "3",
        "21",
        "20"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 21.",
      "no": "Gộp lại thì dùng phép cộng."
    },
    {
      "k": "choose",
      "t": "Bảng có: Cam 7, Táo 4, Lê 6. Loại nào ít nhất?",
      "opts": [
        "Táo",
        "Lê",
        "Cam"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Táo.",
      "no": "Tìm số nhỏ nhất trong 7, 4, 6."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Bảng số liệu giúp ta so sánh các số",
        "Gộp lại thì cộng, hơn kém thì trừ"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Cam 7 quả, Táo 4 quả. Cam hơn Táo mấy quả?",
      "opts": [
        "4",
        "11",
        "3"
      ],
      "ok": 2,
      "hint": "Hơn bao nhiêu thì dùng phép trừ.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "T2 làm 10 bài, T3 làm 6 bài, T4 làm 8 bài. Ngày nào nhiều nhất?",
      "opts": [
        "Thứ Tư",
        "Thứ Ba",
        "Thứ Hai"
      ],
      "ok": 2,
      "hint": "Tìm số lớn nhất trong 10, 6, 8.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Ba tổ có 5, 6 và 4 bạn. Cả lớp có mấy bạn?",
      "opts": [
        "14",
        "15",
        "16"
      ],
      "ok": 1,
      "hint": "Cộng cả ba số lại.",
      "yes": "Đúng rồi!"
    }
  ]
});
