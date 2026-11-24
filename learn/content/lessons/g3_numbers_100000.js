/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Số tự nhiên đến 100000.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g3_numbers_100000",
  "grade": 3,
  "subj": "toan",
  "title": "Số tự nhiên đến 100000",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Số tự nhiên đến 100000.",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Đọc, viết số có nhiều chữ số trong phạm vi chương trình",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Cấu tạo thập phân của số",
      "art": "🔢"
    },
    {
      "k": "choose",
      "t": "Số La Mã XI là số nào?",
      "opts": [
        "11",
        "12",
        "16"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 11.",
      "no": "I = 1, V = 5, X = 10. Số bé đứng TRƯỚC số lớn thì trừ (IV = 4, IX = 9)."
    },
    {
      "k": "choose",
      "t": "Chữ số hàng trăm của số 95368 là?",
      "opts": [
        "5",
        "3",
        "6"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 3.",
      "no": "Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…"
    },
    {
      "k": "choose",
      "t": "Làm tròn số 2488 đến hàng trăm",
      "opts": [
        "2500",
        "2400",
        "2600"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 2500.",
      "no": "Nhìn chữ số ở hàng ngay bên phải hàng cần làm tròn."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đọc, viết số có nhiều chữ số trong phạm vi chương trình",
        "Cấu tạo thập phân của số",
        "So sánh và sắp xếp số"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Số tiếp theo là số nào?3, 6, 12, 24, 48, ?",
      "opts": [
        "95",
        "97",
        "96"
      ],
      "ok": 2,
      "hint": "Tìm xem mỗi số hơn số trước bao nhiêu, hoặc gấp mấy lần.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Số 12 viết bằng số La Mã là?",
      "opts": [
        "XII",
        "XIII",
        "XI"
      ],
      "ok": 0,
      "hint": "I = 1, V = 5, X = 10. Số bé đứng TRƯỚC số lớn thì trừ (IV = 4, IX = 9).",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Chữ số hàng chục của số 89247 là?",
      "opts": [
        "2",
        "7",
        "4"
      ],
      "ok": 2,
      "hint": "Đọc số từ PHẢI sang TRÁI: đơn vị, chục, trăm, nghìn…",
      "yes": "Đúng rồi!"
    }
  ]
});
