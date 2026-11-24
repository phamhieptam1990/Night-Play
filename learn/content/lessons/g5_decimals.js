/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Số thập phân và các phép tính.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g5_decimals",
  "grade": 5,
  "subj": "toan",
  "title": "Số thập phân và các phép tính",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Số thập phân và các phép tính.",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Khái niệm, đọc, viết và cấu tạo số thập phân",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "So sánh và làm tròn số thập phân",
      "art": "🔢"
    },
    {
      "k": "choose",
      "t": "Chữ số hàng phần trăm của số 78,26 là?",
      "opts": [
        "6",
        "7",
        "2"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 6.",
      "no": "Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…"
    },
    {
      "k": "choose",
      "t": "Làm tròn số 59,39 đến hàng phần mười",
      "opts": [
        "59,4",
        "59,6",
        "59,5"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 59,4.",
      "no": "Nhìn chữ số ở hàng ngay bên phải hàng cần làm tròn."
    },
    {
      "k": "choose",
      "t": "? − 5,4 = 7,6",
      "opts": [
        "2,2",
        "13",
        "13,1"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 13.",
      "no": "Dùng phép tính NGƯỢC: cộng thì dùng trừ, nhân thì dùng chia."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Khái niệm, đọc, viết và cấu tạo số thập phân",
        "So sánh và làm tròn số thập phân",
        "Cộng, trừ, nhân, chia số thập phân theo chương trình"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Số tiếp theo là số nào?3, 4,5, 6, 7,5, 9, ?",
      "opts": [
        "9,5",
        "11,5",
        "10,5"
      ],
      "ok": 2,
      "hint": "Tìm xem mỗi số hơn số trước bao nhiêu, hoặc gấp mấy lần.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "1,8 + 2,9 = ?",
      "opts": [
        "4,8",
        "0,47",
        "4,7"
      ],
      "ok": 2,
      "hint": "Viết các số sao cho dấu phẩy thẳng hàng với nhau.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Chữ số hàng chục của số 75,64 là?",
      "opts": [
        "5",
        "4",
        "7"
      ],
      "ok": 2,
      "hint": "Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…",
      "yes": "Đúng rồi!"
    }
  ]
});
