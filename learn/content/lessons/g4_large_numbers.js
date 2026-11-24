/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Số tự nhiên và cấu tạo thập phân.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g4_large_numbers",
  "grade": 4,
  "subj": "toan",
  "title": "Số tự nhiên và cấu tạo thập phân",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Số tự nhiên và cấu tạo thập phân.",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Số có nhiều chữ số theo giới hạn chương trình",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Hàng và lớp",
      "art": "🔢"
    },
    {
      "k": "choose",
      "t": "Trong số 516723, chữ số 3 có giá trị là?",
      "opts": [
        "30",
        "3",
        "300"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 3.",
      "no": "Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…"
    },
    {
      "k": "choose",
      "t": "Làm tròn số 95773 đến hàng chục nghìn",
      "opts": [
        "100000",
        "100001",
        "90000"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 100000.",
      "no": "Nhìn chữ số ở hàng ngay bên phải hàng cần làm tròn."
    },
    {
      "k": "choose",
      "t": "Số tiếp theo là số nào?3, 9, 27, 81, 243, ?",
      "opts": [
        "730",
        "729",
        "567"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 729.",
      "no": "Tìm xem mỗi số hơn số trước bao nhiêu, hoặc gấp mấy lần."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Số có nhiều chữ số theo giới hạn chương trình",
        "Hàng và lớp",
        "Đọc, viết, so sánh, sắp xếp số"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Trong số 546189, chữ số 4 có giá trị là?",
      "opts": [
        "40000",
        "4",
        "400"
      ],
      "ok": 0,
      "hint": "Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Làm tròn số 10041 đến hàng nghìn",
      "opts": [
        "10000",
        "9000",
        "10001"
      ],
      "ok": 0,
      "hint": "Nhìn chữ số ở hàng ngay bên phải hàng cần làm tròn.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Số tiếp theo là số nào?1, 4, 9, 16, 25, ?",
      "opts": [
        "37",
        "36",
        "43"
      ],
      "ok": 1,
      "hint": "Tìm xem mỗi số hơn số trước bao nhiêu, hoặc gấp mấy lần.",
      "yes": "Đúng rồi!"
    }
  ]
});
