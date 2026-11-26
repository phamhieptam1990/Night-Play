/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Thống kê và xác suất.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g4_statistics",
  "grade": 4,
  "subj": "toan",
  "title": "Thống kê và xác suất",
  "screens": [
    {
      "k": "say",
      "t": "Trung bình cộng: cộng các số rồi chia cho số các số.",
      "art": "(4 + 8) ÷ 2 = 6"
    },
    {
      "k": "say",
      "t": "Biểu đồ cột: cột càng cao thì số càng lớn.",
      "art": "▂ ▅ █"
    },
    {
      "k": "say",
      "t": "Khả năng: chắc chắn, có thể, không thể xảy ra.",
      "art": "🎲 ra 1 đến 6"
    },
    {
      "k": "choose",
      "t": "Trung bình cộng của 4 và 8 là?",
      "opts": [
        "4",
        "12",
        "6"
      ],
      "ok": 2,
      "yes": "Đúng! 12 ÷ 2 = 6.",
      "no": "Cộng hai số rồi chia cho 2.",
      "art": "4 và 8"
    },
    {
      "k": "choose",
      "t": "Trung bình cộng của 6, 7 và 8 là?",
      "opts": [
        "6",
        "7",
        "21"
      ],
      "ok": 1,
      "yes": "Đúng! 21 ÷ 3 = 7.",
      "no": "Cộng ba số rồi chia cho 3.",
      "art": "6, 7, 8"
    },
    {
      "k": "choose",
      "t": "Ba ngày bán 10, 20, 30 quyển. Trung bình mỗi ngày bán?",
      "opts": [
        "20",
        "30",
        "60"
      ],
      "ok": 0,
      "yes": "Đúng! 60 ÷ 3 = 20.",
      "no": "Tổng ba ngày chia cho 3.",
      "art": "10, 20, 30"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Trung bình cộng = tổng chia số số hạng",
        "Cột cao nhất là số lớn nhất",
        "Biết khi nào chắc chắn, có thể, không thể"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Cột cao nhất của biểu đồ cho biết điều gì?",
      "opts": [
        "Số bằng 0",
        "Số lớn nhất",
        "Số bé nhất"
      ],
      "ok": 1,
      "hint": "Cột càng cao thì số càng lớn.",
      "yes": "Đúng! Cột cao nhất là lớn nhất.",
      "art": "█"
    },
    {
      "q": "Tung xúc xắc 6 mặt. Ra mặt 7 chấm là?",
      "opts": [
        "Không thể",
        "Chắc chắn",
        "Có thể"
      ],
      "ok": 0,
      "hint": "Xúc xắc chỉ có từ 1 đến 6 chấm.",
      "yes": "Đúng! Không thể xảy ra.",
      "art": "🎲"
    },
    {
      "q": "Tổ 1 hái 15 quả, tổ 2 hái 25 quả. Trung bình mỗi tổ?",
      "opts": [
        "10",
        "20",
        "40"
      ],
      "ok": 1,
      "hint": "Cộng rồi chia cho số tổ.",
      "yes": "Đúng! 40 ÷ 2 = 20.",
      "art": "15 và 25"
    }
  ]
});
