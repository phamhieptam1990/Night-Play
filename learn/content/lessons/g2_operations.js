/* BẢN NHÁP TỰ SINH · Toán lớp 2 · Các phép tính với số tự nhiên.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g2_operations",
  "grade": 2,
  "subj": "toan",
  "title": "Các phép tính với số tự nhiên",
  "screens": [
    {
      "k": "say",
      "t": "Cộng có nhớ: cộng hàng đơn vị, đủ 10 thì viết số lẻ và nhớ 1 sang hàng chục.",
      "art": "38 + 27\n8 + 7 = 15, viết 5 nhớ 1"
    },
    {
      "k": "say",
      "t": "Biểu thức có cả cộng và nhân: làm phép NHÂN trước, rồi mới cộng.",
      "art": "2 + 3 × 4\n= 2 + 12 = 14"
    },
    {
      "k": "say",
      "t": "Tìm số chưa biết: dùng phép tính ngược lại.",
      "art": "? + 5 = 12\n? = 12 − 5"
    },
    {
      "k": "choose",
      "t": "38 + 27 = ?",
      "opts": [
        "55",
        "64",
        "65"
      ],
      "ok": 2,
      "yes": "Đúng! 38 + 27 = 65.",
      "no": "Hàng đơn vị 8 + 7 được 15: viết 5, nhớ 1.",
      "art": "38 + 27"
    },
    {
      "k": "choose",
      "t": "2 + 3 × 4 = ?",
      "opts": [
        "14",
        "24",
        "20"
      ],
      "ok": 0,
      "yes": "Đúng! 3 × 4 = 12, rồi 2 + 12 = 14.",
      "no": "Phép nhân làm trước phép cộng.",
      "art": "2 + 3 × 4"
    },
    {
      "k": "choose",
      "t": "? + 5 = 12. Số cần tìm là?",
      "opts": [
        "7",
        "5",
        "17"
      ],
      "ok": 0,
      "yes": "Đúng! 12 − 5 = 7.",
      "no": "Muốn tìm số hạng chưa biết, lấy tổng trừ số hạng đã biết.",
      "art": "? + 5 = 12"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Cộng có nhớ: đủ 10 thì nhớ 1 sang hàng chục",
        "Nhân trước, cộng trừ sau",
        "Số chưa biết: dùng phép tính ngược"
      ]
    }
  ],
  "tryit": [
    {
      "q": "5 × 4 = ?",
      "opts": [
        "25",
        "9",
        "20"
      ],
      "ok": 2,
      "hint": "5 × 4 là 4 lần số 5 cộng lại.",
      "yes": "Đúng! 5 + 5 + 5 + 5 = 20.",
      "art": "5 × 4"
    },
    {
      "q": "Lan có 45 viên bi, cho bạn 18 viên. Còn lại mấy viên?",
      "opts": [
        "37",
        "63",
        "27"
      ],
      "ok": 2,
      "hint": "Cho đi là bớt đi: dùng phép trừ.",
      "yes": "Đúng! 45 − 18 = 27.",
      "art": "45 − 18"
    },
    {
      "q": "Bạn An tính 7 × 3 = 20. Phép tính đúng là?",
      "opts": [
        "7 × 3 = 10",
        "7 × 3 = 21",
        "7 × 3 = 24"
      ],
      "ok": 1,
      "hint": "Đếm cách 3 từ 7: 7, 14, ...",
      "yes": "Đúng! 7 × 3 = 21.",
      "art": "7 × 3 = ?"
    }
  ]
});
