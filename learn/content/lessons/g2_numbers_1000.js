/* BẢN NHÁP TỰ SINH · Toán lớp 2 · Số tự nhiên trong phạm vi 1000.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g2_numbers_1000",
  "grade": 2,
  "subj": "toan",
  "title": "Số tự nhiên trong phạm vi 1000",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Số tự nhiên trong phạm vi 1000.",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Đọc, viết, cấu tạo số có ba chữ số",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Hàng trăm, hàng chục, hàng đơn vị",
      "art": "🔢"
    },
    {
      "k": "choose",
      "t": "Chữ số hàng chục của số 732 là?",
      "opts": [
        "2",
        "3",
        "7"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 3.",
      "no": "Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…"
    },
    {
      "k": "choose",
      "t": "Làm tròn số 78 đến hàng chục",
      "opts": [
        "80",
        "81",
        "70"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 80.",
      "no": "Nhìn chữ số ở hàng ngay bên phải hàng cần làm tròn."
    },
    {
      "k": "choose",
      "t": "Số tiếp theo là số nào?36, 32, 28, 24, 20, ?",
      "opts": [
        "12",
        "16",
        "17"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 16.",
      "no": "Tìm xem mỗi số hơn số trước bao nhiêu, hoặc gấp mấy lần."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đọc, viết, cấu tạo số có ba chữ số",
        "Hàng trăm, hàng chục, hàng đơn vị",
        "So sánh và sắp xếp số"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Chữ số hàng trăm của số 248 là?",
      "opts": [
        "3",
        "2",
        "8"
      ],
      "ok": 1,
      "hint": "Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Làm tròn số 81 đến hàng chục",
      "opts": [
        "90",
        "81",
        "80"
      ],
      "ok": 2,
      "hint": "Nhìn chữ số ở hàng ngay bên phải hàng cần làm tròn.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Số tiếp theo là số nào?20, 30, 40, 50, 60, ?",
      "opts": [
        "69",
        "70",
        "80"
      ],
      "ok": 1,
      "hint": "Tìm xem mỗi số hơn số trước bao nhiêu, hoặc gấp mấy lần.",
      "yes": "Đúng rồi!"
    }
  ]
});
