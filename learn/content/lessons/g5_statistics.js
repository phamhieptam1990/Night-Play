/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Thống kê và xác suất.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g5_statistics",
  "grade": 5,
  "subj": "toan",
  "title": "Thống kê và xác suất",
  "screens": [
    {
      "k": "say",
      "t": "Tỉ số phần trăm cho biết bao nhiêu phần trong 100 phần.",
      "art": "50% = một nửa\n25% = một phần tư"
    },
    {
      "k": "say",
      "t": "Biểu đồ hình quạt chia hình tròn thành các phần. Cả hình tròn là 100%.",
      "art": "🥧 100%"
    },
    {
      "k": "say",
      "t": "Đọc biểu đồ: tìm phần lớn nhất, so sánh các phần.",
      "art": "40% + 35% + 25% = 100%"
    },
    {
      "k": "choose",
      "t": "50% của 80 là?",
      "opts": [
        "40",
        "30",
        "50"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 40.",
      "no": "50% là một nửa."
    },
    {
      "k": "choose",
      "t": "Lớp có 20 bạn, 5 bạn đi xe buýt. Tỉ số phần trăm là?",
      "opts": [
        "5%",
        "25%",
        "20%"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 25%.",
      "no": "Lấy 5 chia 20 rồi nhân 100."
    },
    {
      "k": "choose",
      "t": "Cả hình tròn ứng với bao nhiêu phần trăm?",
      "opts": [
        "50%",
        "100%",
        "10%"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 100%.",
      "no": "Cả hình là toàn bộ."
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "50% là một nửa, 25% là một phần tư",
        "Cả hình tròn là 100%"
      ]
    }
  ],
  "tryit": [
    {
      "q": "10% của 200 là?",
      "opts": [
        "10",
        "20",
        "100"
      ],
      "ok": 1,
      "hint": "10% là chia cho 10.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Hai phần là 30% và 20%. Cộng lại là?",
      "opts": [
        "60%",
        "50%",
        "10%"
      ],
      "ok": 1,
      "hint": "Cộng hai số phần trăm.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "25% bằng phân số nào?",
      "opts": [
        "1/2",
        "1/5",
        "1/4"
      ],
      "ok": 2,
      "hint": "25 phần trăm là một phần tư.",
      "yes": "Đúng rồi!"
    }
  ]
});
