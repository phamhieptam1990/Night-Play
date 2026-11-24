/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Hình học phẳng và hình khối.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g3_geometry",
  "grade": 3,
  "subj": "toan",
  "title": "Hình học phẳng và hình khối",
  "screens": [
    {
      "k": "say",
      "t": "Góc vuông là góc ở góc cuốn vở. Góc nhỏ hơn gọi là góc nhọn, lớn hơn là góc tù.",
      "art": "⊾ vuông\n< nhọn · > tù"
    },
    {
      "k": "say",
      "t": "Chu vi là độ dài đường bao quanh hình.",
      "art": "Chữ nhật 5 và 3\n(5 + 3) × 2 = 16"
    },
    {
      "k": "say",
      "t": "Hình vuông cạnh a có chu vi a × 4.",
      "art": "Cạnh 6\n6 × 4 = 24"
    },
    {
      "k": "choose",
      "t": "Góc nhỏ hơn góc vuông gọi là gì?",
      "opts": [
        "Góc bẹt",
        "Góc tù",
        "Góc nhọn"
      ],
      "ok": 2,
      "yes": "Đúng! Nhỏ hơn góc vuông là góc nhọn.",
      "no": "So với góc cuốn vở: nhỏ hơn hay lớn hơn?",
      "art": "∠"
    },
    {
      "k": "choose",
      "t": "Góc lớn hơn góc vuông gọi là gì?",
      "opts": [
        "Góc tù",
        "Góc nhọn",
        "Góc vuông"
      ],
      "ok": 0,
      "yes": "Đúng! Góc tù.",
      "no": "Góc này mở rộng hơn góc cuốn vở.",
      "art": "∠"
    },
    {
      "k": "choose",
      "t": "Hình chữ nhật dài 5 cm, rộng 3 cm. Chu vi là?",
      "opts": [
        "16 cm",
        "15 cm",
        "8 cm"
      ],
      "ok": 0,
      "yes": "Đúng! (5 + 3) × 2 = 16.",
      "no": "Cộng chiều dài và rộng rồi nhân 2.",
      "art": "5 × 3"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Nhọn nhỏ hơn vuông, tù lớn hơn vuông",
        "Chu vi là tổng độ dài các cạnh",
        "Chu vi hình vuông = cạnh × 4"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Hình vuông cạnh 6 cm. Chu vi là?",
      "opts": [
        "36 cm",
        "12 cm",
        "24 cm"
      ],
      "ok": 2,
      "hint": "Hình vuông có 4 cạnh bằng nhau.",
      "yes": "Đúng! 6 × 4 = 24.",
      "art": "6 cm"
    },
    {
      "q": "Góc ở góc cuốn vở là góc gì?",
      "opts": [
        "Góc nhọn",
        "Góc vuông",
        "Góc tù"
      ],
      "ok": 1,
      "hint": "Góc này đúng 90 độ.",
      "yes": "Đúng! Góc vuông.",
      "art": "📖"
    },
    {
      "q": "Hình tam giác có ba cạnh 3, 4, 5 cm. Chu vi là?",
      "opts": [
        "12 cm",
        "9 cm",
        "60 cm"
      ],
      "ok": 0,
      "hint": "Cộng độ dài ba cạnh.",
      "yes": "Đúng! 3 + 4 + 5 = 12.",
      "art": "3 + 4 + 5"
    }
  ]
});
