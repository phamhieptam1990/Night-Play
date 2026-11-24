/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Tỉ số và tỉ số phần trăm.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g5_ratio_percent",
  "grade": 5,
  "subj": "toan",
  "title": "Tỉ số và tỉ số phần trăm",
  "screens": [
    {
      "k": "say",
      "t": "Tỉ số của a và b là a : b. Ví dụ 3 bút đỏ và 5 bút xanh có tỉ số 3 : 5.",
      "art": "3 : 5"
    },
    {
      "k": "say",
      "t": "Tỉ số phần trăm: bao nhiêu phần trong 100 phần. Lấy a chia b rồi nhân 100.",
      "art": "5 bạn trong 20 bạn\n5 ÷ 20 = 25%"
    },
    {
      "k": "say",
      "t": "Tìm phần trăm của một số: chia cho 100 rồi nhân.",
      "art": "10% của 40\n= 4"
    },
    {
      "k": "choose",
      "t": "Có 3 bút đỏ và 5 bút xanh. Tỉ số bút đỏ và bút xanh là?",
      "opts": [
        "5 : 3",
        "3 : 8",
        "3 : 5"
      ],
      "ok": 2,
      "yes": "Đúng! 3 : 5.",
      "no": "Viết số bút đỏ trước, bút xanh sau.",
      "art": "🔴3  🔵5"
    },
    {
      "k": "choose",
      "t": "Lớp có 20 bạn, 5 bạn đi xe buýt. Tỉ số phần trăm là?",
      "opts": [
        "25%",
        "20%",
        "5%"
      ],
      "ok": 0,
      "yes": "Đúng! 5 ÷ 20 = 0,25 = 25%.",
      "no": "Lấy 5 chia 20 rồi nhân 100.",
      "art": "5 : 20"
    },
    {
      "k": "choose",
      "t": "10% của 40 là?",
      "opts": [
        "10",
        "40",
        "4"
      ],
      "ok": 2,
      "yes": "Đúng! 40 ÷ 10 = 4.",
      "no": "10% nghĩa là chia cho 10.",
      "art": "10% của 40"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Tỉ số a : b",
        "Tỉ số phần trăm = a ÷ b × 100",
        "a% của một số: chia 100 rồi nhân a"
      ]
    }
  ],
  "tryit": [
    {
      "q": "50% của 80 là?",
      "opts": [
        "30",
        "40",
        "50"
      ],
      "ok": 1,
      "hint": "50% là một nửa.",
      "yes": "Đúng! 80 ÷ 2 = 40.",
      "art": "50% của 80"
    },
    {
      "q": "Một cái áo 200 000 đồng giảm 20%. Giảm bao nhiêu tiền?",
      "opts": [
        "160 000 đồng",
        "20 000 đồng",
        "40 000 đồng"
      ],
      "ok": 2,
      "hint": "Tính 20% của 200 000.",
      "yes": "Đúng! 200 000 ÷ 100 × 20 = 40 000.",
      "art": "20% của 200 000"
    },
    {
      "q": "25% bằng phân số nào?",
      "opts": [
        "1/5",
        "1/4",
        "1/2"
      ],
      "ok": 1,
      "hint": "25 phần trăm = 25/100, rút gọn.",
      "yes": "Đúng! Rút gọn 25/100 = 1/4.",
      "art": "25% = ?"
    }
  ]
});
