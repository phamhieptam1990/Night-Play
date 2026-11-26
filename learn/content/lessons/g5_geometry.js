/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Hình học phẳng và hình khối.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g5_geometry",
  "grade": 5,
  "subj": "toan",
  "title": "Hình học phẳng và hình khối",
  "screens": [
    {
      "k": "say",
      "t": "Diện tích hình thang = (đáy lớn + đáy nhỏ) × chiều cao ÷ 2.",
      "art": "(6 + 4) × 3 ÷ 2 = 15"
    },
    {
      "k": "say",
      "t": "Chu vi hình tròn = đường kính × 3,14. Diện tích = bán kính × bán kính × 3,14.",
      "art": "d = 10\nC = 10 × 3,14 = 31,4"
    },
    {
      "k": "say",
      "t": "Thể tích hình hộp chữ nhật = dài × rộng × cao.",
      "art": "4 × 3 × 2 = 24 cm³"
    },
    {
      "k": "choose",
      "t": "Hình thang đáy 6 cm và 4 cm, cao 3 cm. Diện tích là?",
      "opts": [
        "13 cm²",
        "30 cm²",
        "15 cm²"
      ],
      "ok": 2,
      "yes": "Đúng! 10 × 3 ÷ 2 = 15.",
      "no": "Cộng hai đáy, nhân chiều cao rồi chia 2.",
      "art": "6, 4, cao 3"
    },
    {
      "k": "choose",
      "t": "Hình tròn đường kính 10 cm. Chu vi là? (π = 3,14)",
      "opts": [
        "31,4 cm",
        "62,8 cm",
        "314 cm"
      ],
      "ok": 0,
      "yes": "Đúng! 10 × 3,14 = 31,4.",
      "no": "Chu vi = đường kính × 3,14.",
      "art": "d = 10 cm"
    },
    {
      "k": "choose",
      "t": "Hình hộp dài 4, rộng 3, cao 2 cm. Thể tích là?",
      "opts": [
        "24 cm³",
        "9 cm³",
        "26 cm³"
      ],
      "ok": 0,
      "yes": "Đúng! 4 × 3 × 2 = 24.",
      "no": "Nhân ba kích thước.",
      "art": "4 × 3 × 2"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Hình thang: (đáy lớn + đáy nhỏ) × cao ÷ 2",
        "Hình tròn: chu vi d × 3,14, diện tích r × r × 3,14",
        "Thể tích hộp = dài × rộng × cao"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Hình tròn bán kính 2 cm. Diện tích là? (π = 3,14)",
      "opts": [
        "6,28 cm²",
        "12,56 cm²",
        "25,12 cm²"
      ],
      "ok": 1,
      "hint": "Bán kính nhân bán kính rồi nhân 3,14.",
      "yes": "Đúng! 2 × 2 × 3,14 = 12,56.",
      "art": "r = 2 cm"
    },
    {
      "q": "Góc 135° là góc gì?",
      "opts": [
        "Góc vuông",
        "Góc tù",
        "Góc nhọn"
      ],
      "ok": 1,
      "hint": "So với 90°.",
      "yes": "Đúng! Lớn hơn 90°.",
      "art": "135°"
    },
    {
      "q": "Hình vuông cạnh 5 cm. Diện tích là?",
      "opts": [
        "10 cm²",
        "25 cm²",
        "20 cm²"
      ],
      "ok": 1,
      "hint": "Cạnh nhân cạnh.",
      "yes": "Đúng! 5 × 5 = 25.",
      "art": "5 × 5"
    }
  ]
});
