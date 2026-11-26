/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Hình học.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g4_geometry",
  "grade": 4,
  "subj": "toan",
  "title": "Hình học",
  "screens": [
    {
      "k": "say",
      "t": "Dùng thước đo góc để đo: đặt tâm vào đỉnh góc, một cạnh ở số 0.",
      "art": "∠ 60°"
    },
    {
      "k": "say",
      "t": "Góc nhọn nhỏ hơn 90°. Góc vuông bằng 90°. Góc tù lớn hơn 90°.",
      "art": "nhọn: nhỏ hơn 90°\nvuông: 90°\ntù: lớn hơn 90°"
    },
    {
      "k": "say",
      "t": "Góc bẹt bằng 180°, đó là một đường thẳng.",
      "art": "180° ―――"
    },
    {
      "k": "choose",
      "t": "Góc 60° là góc gì?",
      "opts": [
        "Góc vuông",
        "Góc nhọn",
        "Góc tù"
      ],
      "ok": 1,
      "yes": "Đúng! 60° nhỏ hơn 90°.",
      "no": "So 60° với 90°.",
      "art": "60°"
    },
    {
      "k": "choose",
      "t": "Góc 120° là góc gì?",
      "opts": [
        "Góc nhọn",
        "Góc tù",
        "Góc bẹt"
      ],
      "ok": 1,
      "yes": "Đúng! Giữa 90° và 180°.",
      "no": "So 120° với 90° và 180°.",
      "art": "120°"
    },
    {
      "k": "choose",
      "t": "Góc vuông bằng bao nhiêu độ?",
      "opts": [
        "180°",
        "90°",
        "60°"
      ],
      "ok": 1,
      "yes": "Đúng! 90°.",
      "no": "Góc ở góc cuốn vở.",
      "art": "⊾"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Nhọn nhỏ hơn 90°, vuông bằng 90°, tù lớn hơn 90°",
        "Góc bẹt = 180°",
        "Đo góc: tâm thước ở đỉnh góc, một cạnh ở số 0"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Góc bẹt bằng bao nhiêu độ?",
      "opts": [
        "90°",
        "360°",
        "180°"
      ],
      "ok": 2,
      "hint": "Góc bẹt là một đường thẳng.",
      "yes": "Đúng! 180°.",
      "art": "―――"
    },
    {
      "q": "Góc 90° và góc 30° cộng lại thành?",
      "opts": [
        "120°",
        "60°",
        "90°"
      ],
      "ok": 0,
      "hint": "Cộng số đo hai góc.",
      "yes": "Đúng! 90 + 30 = 120.",
      "art": "90° + 30°"
    },
    {
      "q": "Góc 45° là góc gì?",
      "opts": [
        "Góc nhọn",
        "Góc tù",
        "Góc vuông"
      ],
      "ok": 0,
      "hint": "So 45° với 90°.",
      "yes": "Đúng! Nhỏ hơn 90°.",
      "art": "45°"
    }
  ]
});
