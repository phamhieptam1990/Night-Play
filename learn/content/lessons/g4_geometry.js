/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Hình học.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g4_geometry",
  "grade": 4,
  "subj": "toan",
  "title": "Hình học",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Hình học.",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Góc và đơn vị đo góc",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Hai đường thẳng vuông góc và song song",
      "art": "📐"
    },
    {
      "k": "choose",
      "t": "Góc bẹt bằng bao nhiêu độ?",
      "opts": [
        "90 °",
        "180 °",
        "120 °"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 180 °.",
      "no": "Góc vuông 90°, góc bẹt 180°. Hai góc kề bù cộng lại 180°."
    },
    {
      "k": "choose",
      "t": "Đây là góc gì?",
      "opts": [
        "góc nhọn",
        "góc bẹt",
        "góc vuông"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là góc bẹt.",
      "no": "Góc vuông giống góc của tờ giấy. So sánh góc với góc vuông."
    },
    {
      "k": "choose",
      "t": "Hai góc kề bù có tổng bằng 180°. Một góc là 70°, góc còn lại là?",
      "opts": [
        "20 °",
        "110 °",
        "70 °"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 110 °.",
      "no": "Góc vuông 90°, góc bẹt 180°. Hai góc kề bù cộng lại 180°."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Góc và đơn vị đo góc",
        "Hai đường thẳng vuông góc và song song",
        "Hình bình hành, hình thoi và các hình đã học"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Hai góc kề bù có tổng bằng 180°. Một góc là 40°, góc còn lại là?",
      "opts": [
        "50 °",
        "40 °",
        "140 °"
      ],
      "ok": 2,
      "hint": "Góc vuông 90°, góc bẹt 180°. Hai góc kề bù cộng lại 180°.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Góc vuông bằng bao nhiêu độ?",
      "opts": [
        "90 °",
        "45 °",
        "60 °"
      ],
      "ok": 0,
      "hint": "Góc vuông 90°, góc bẹt 180°. Hai góc kề bù cộng lại 180°.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Hai góc kề bù có tổng bằng 180°. Một góc là 20°, góc còn lại là?",
      "opts": [
        "160 °",
        "340 °",
        "20 °"
      ],
      "ok": 0,
      "hint": "Góc vuông 90°, góc bẹt 180°. Hai góc kề bù cộng lại 180°.",
      "yes": "Đúng rồi!"
    }
  ]
});
