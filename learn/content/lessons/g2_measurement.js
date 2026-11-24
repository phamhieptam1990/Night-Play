/* BẢN NHÁP TỰ SINH · Toán lớp 2 · Đại lượng và đo lường.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g2_measurement",
  "grade": 2,
  "subj": "toan",
  "title": "Đại lượng và đo lường",
  "screens": [
    {
      "k": "say",
      "t": "1 mét bằng 100 xăng-ti-mét. 1 ki-lô-gam bằng 1000 gam.",
      "art": "1 m = 100 cm\n1 kg = 1000 g"
    },
    {
      "k": "say",
      "t": "Đọc giờ: kim ngắn chỉ giờ, kim dài chỉ phút. Kim dài ở số 12 là giờ đúng.",
      "art": "🕒 3 giờ"
    },
    {
      "k": "say",
      "t": "Tiền Việt Nam: cộng các tờ lại để biết tổng.",
      "art": "5 000 + 2 000\n= 7 000 đồng"
    },
    {
      "k": "choose",
      "t": "1 m bằng bao nhiêu cm?",
      "opts": [
        "10 cm",
        "1000 cm",
        "100 cm"
      ],
      "ok": 2,
      "yes": "Đúng! 1 m = 100 cm.",
      "no": "Nhớ: 1 mét có 100 xăng-ti-mét.",
      "art": "1 m = ? cm"
    },
    {
      "k": "choose",
      "t": "2 m bằng bao nhiêu cm?",
      "opts": [
        "200 cm",
        "20 cm",
        "2 cm"
      ],
      "ok": 0,
      "yes": "Đúng! 2 × 100 = 200.",
      "no": "Mỗi mét là 100 cm, có 2 mét.",
      "art": "2 m = ? cm"
    },
    {
      "k": "choose",
      "t": "Kim ngắn chỉ số 3, kim dài chỉ số 12. Là mấy giờ?",
      "opts": [
        "3 giờ",
        "3 giờ 12 phút",
        "12 giờ"
      ],
      "ok": 0,
      "yes": "Đúng! Đó là 3 giờ.",
      "no": "Kim ngắn chỉ giờ.",
      "art": "🕒"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "1 m = 100 cm, 1 kg = 1000 g",
        "Kim ngắn chỉ giờ, kim dài chỉ phút",
        "Cộng các tờ tiền để biết tổng"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Mua bút 5 000 đồng và vở 2 000 đồng. Hết bao nhiêu?",
      "opts": [
        "3 000 đồng",
        "10 000 đồng",
        "7 000 đồng"
      ],
      "ok": 2,
      "hint": "Mua cả hai thì cộng lại.",
      "yes": "Đúng! 5 000 + 2 000 = 7 000.",
      "art": "5 000 + 2 000"
    },
    {
      "q": "Con voi và con mèo, con nào nặng hơn?",
      "opts": [
        "Con mèo",
        "Con voi",
        "Bằng nhau"
      ],
      "ok": 1,
      "hint": "Nghĩ xem con nào to lớn hơn.",
      "yes": "Đúng! Voi nặng hơn rất nhiều.",
      "art": "🐘 ? 🐱"
    },
    {
      "q": "Từ 2 giờ đến 5 giờ là mấy giờ?",
      "opts": [
        "7 giờ",
        "3 giờ",
        "2 giờ"
      ],
      "ok": 1,
      "hint": "Lấy giờ sau trừ giờ trước.",
      "yes": "Đúng! 5 − 2 = 3 giờ.",
      "art": "2 giờ → 5 giờ"
    }
  ]
});
