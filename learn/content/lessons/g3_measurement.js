/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Đại lượng và đo lường.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g3_measurement",
  "grade": 3,
  "subj": "toan",
  "title": "Đại lượng và đo lường",
  "screens": [
    {
      "k": "say",
      "t": "Diện tích là phần mặt phẳng hình chiếm. Diện tích hình chữ nhật = dài × rộng.",
      "art": "6 × 4 = 24 cm²"
    },
    {
      "k": "say",
      "t": "Đổi đơn vị: 1 km = 1000 m, 1 kg = 1000 g, 1 giờ = 60 phút.",
      "art": "1 km = 1000 m"
    },
    {
      "k": "say",
      "t": "Thời gian: từ 7 giờ đến 9 giờ là 2 giờ. Tiền: cộng các số lại.",
      "art": "9 − 7 = 2 giờ"
    },
    {
      "k": "choose",
      "t": "Hình chữ nhật dài 6 cm, rộng 4 cm. Diện tích là?",
      "opts": [
        "10 cm²",
        "24 cm²",
        "20 cm²"
      ],
      "ok": 1,
      "yes": "Đúng! 6 × 4 = 24.",
      "no": "Diện tích: nhân dài với rộng.",
      "art": "6 × 4"
    },
    {
      "k": "choose",
      "t": "Hình vuông cạnh 5 cm. Diện tích là?",
      "opts": [
        "10 cm²",
        "25 cm²",
        "20 cm²"
      ],
      "ok": 1,
      "yes": "Đúng! 5 × 5 = 25.",
      "no": "Cạnh nhân cạnh.",
      "art": "5 × 5"
    },
    {
      "k": "choose",
      "t": "3 km bằng bao nhiêu mét?",
      "opts": [
        "30 m",
        "3 000 m",
        "300 m"
      ],
      "ok": 1,
      "yes": "Đúng! 3 × 1000 = 3 000.",
      "no": "1 km là 1000 m.",
      "art": "3 km = ? m"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Diện tích chữ nhật = dài × rộng",
        "1 km = 1000 m, 1 giờ = 60 phút",
        "Hơn kém thì trừ, tổng thì cộng"
      ]
    }
  ],
  "tryit": [
    {
      "q": "2 giờ bằng bao nhiêu phút?",
      "opts": [
        "200 phút",
        "120 phút",
        "60 phút"
      ],
      "ok": 1,
      "hint": "Một giờ có 60 phút.",
      "yes": "Đúng! 2 × 60 = 120.",
      "art": "2 giờ = ? phút"
    },
    {
      "q": "Mua hộp bút 12 000 đồng và vở 8 000 đồng. Hết bao nhiêu?",
      "opts": [
        "20 000 đồng",
        "4 000 đồng",
        "96 000 đồng"
      ],
      "ok": 0,
      "hint": "Mua cả hai thì cộng.",
      "yes": "Đúng! 12 000 + 8 000 = 20 000.",
      "art": "12 000 + 8 000"
    },
    {
      "q": "Học từ 7 giờ đến 11 giờ. Học mấy giờ?",
      "opts": [
        "3 giờ",
        "4 giờ",
        "18 giờ"
      ],
      "ok": 1,
      "hint": "Lấy giờ sau trừ giờ trước.",
      "yes": "Đúng! 11 − 7 = 4.",
      "art": "7 giờ → 11 giờ"
    }
  ]
});
