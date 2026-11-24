/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Số tự nhiên đến 100000.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g3_numbers_100000",
  "grade": 3,
  "subj": "toan",
  "title": "Số tự nhiên đến 100000",
  "screens": [
    {
      "k": "say",
      "t": "Số đến 100 000: 45 213 gồm 4 chục nghìn, 5 nghìn, 2 trăm, 1 chục, 3 đơn vị.",
      "art": "45 213\n4 chục nghìn · 5 nghìn"
    },
    {
      "k": "say",
      "t": "Làm tròn đến hàng trăm: nhìn chữ số hàng chục. Từ 5 trở lên thì lên một trăm.",
      "art": "1 270 → 1 300\n1 240 → 1 200"
    },
    {
      "k": "say",
      "t": "I = 1, V = 5, X = 10. Số bé đứng SAU thì cộng (XI = 11), đứng TRƯỚC thì trừ.",
      "art": "XI = 10 + 1 = 11\nIX = 10 − 1 = 9"
    },
    {
      "k": "choose",
      "t": "Trong số 45 213, chữ số 5 ở hàng nào?",
      "opts": [
        "Hàng nghìn",
        "Hàng chục nghìn",
        "Hàng trăm"
      ],
      "ok": 0,
      "yes": "Đúng! 5 nghìn.",
      "no": "Đếm từ phải sang: đơn vị, chục, trăm, nghìn...",
      "art": "45 213"
    },
    {
      "k": "choose",
      "t": "Giá trị của chữ số 2 trong 45 213 là?",
      "opts": [
        "2 000",
        "200",
        "20"
      ],
      "ok": 1,
      "yes": "Đúng! 200.",
      "no": "Chữ số 2 đứng ở hàng trăm.",
      "art": "45 213"
    },
    {
      "k": "choose",
      "t": "Làm tròn 1 270 đến hàng trăm được?",
      "opts": [
        "1 300",
        "1 200",
        "1 000"
      ],
      "ok": 0,
      "yes": "Đúng! Hàng chục là 7 nên lên.",
      "no": "Nhìn hàng chục: từ 5 trở lên thì lên.",
      "art": "1 270 ≈ ?"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đọc số theo hàng: chục nghìn, nghìn, trăm...",
        "Làm tròn: nhìn chữ số ở hàng kề bên phải",
        "La Mã: I = 1, V = 5, X = 10"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Số La Mã VII bằng bao nhiêu?",
      "opts": [
        "4",
        "6",
        "7"
      ],
      "ok": 2,
      "hint": "V là 5, mỗi I là 1.",
      "yes": "Đúng! 5 + 1 + 1 = 7.",
      "art": "VII"
    },
    {
      "q": "Dãy 1000, 2000, 3000, ... số tiếp theo là?",
      "opts": [
        "4 000",
        "5 000",
        "3 100"
      ],
      "ok": 0,
      "hint": "Mỗi số hơn số trước bao nhiêu?",
      "yes": "Đúng! Thêm 1 000.",
      "art": "1000, 2000, 3000, ?"
    },
    {
      "q": "Số nào lớn nhất?",
      "opts": [
        "48 020",
        "42 800",
        "48 200"
      ],
      "ok": 2,
      "hint": "So sánh từ hàng cao nhất, rồi đến hàng tiếp theo.",
      "yes": "Đúng! 48 200 lớn nhất.",
      "art": "? lớn nhất"
    }
  ]
});
