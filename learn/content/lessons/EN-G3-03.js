/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 3 · Đọc (Reading).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G3-03",
  "grade": 3,
  "subj": "tanh",
  "title": "Đọc (Reading)",
  "screens": [
    {
      "k": "say",
      "t": "Đọc câu ngắn, tìm từ chính để hiểu nghĩa.",
      "art": "🍎 I like apples."
    },
    {
      "k": "say",
      "t": "Ngày trong tuần: Monday thứ Hai, Tuesday thứ Ba, Sunday Chủ nhật.",
      "art": "Mon Tue Wed Thu Fri Sat Sun"
    },
    {
      "k": "say",
      "t": "Số: ten là mười, twenty là hai mươi.",
      "art": "10 ten · 20 twenty"
    },
    {
      "k": "choose",
      "t": "\"I like apples.\" nghĩa là?",
      "opts": [
        "Tôi thích táo.",
        "Tôi mua táo.",
        "Tôi ghét táo."
      ],
      "ok": 0,
      "yes": "Đúng! Tôi thích táo.",
      "no": "Tìm từ like.",
      "art": "🍎"
    },
    {
      "k": "choose",
      "t": "Sunday là ngày nào?",
      "opts": [
        "Thứ Hai",
        "Thứ Sáu",
        "Chủ nhật"
      ],
      "ok": 2,
      "yes": "Đúng! Chủ nhật.",
      "no": "Đây là ngày cuối tuần.",
      "art": "Sunday"
    },
    {
      "k": "choose",
      "t": "Monday là ngày nào?",
      "opts": [
        "Thứ Ba",
        "Thứ Hai",
        "Chủ nhật"
      ],
      "ok": 1,
      "yes": "Đúng! Thứ Hai.",
      "no": "Ngày đầu tuần.",
      "art": "Monday"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Đọc câu ngắn, tìm từ chính",
        "Ngày trong tuần: Monday ... Sunday",
        "Số: ten 10, twenty 20"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Số \"ten\" là số mấy?",
      "opts": [
        "1",
        "10",
        "20"
      ],
      "ok": 1,
      "hint": "Sau nine là gì?",
      "yes": "Đúng! 10.",
      "art": "ten"
    },
    {
      "q": "\"cat\" nghĩa là?",
      "opts": [
        "mèo",
        "chó",
        "chim"
      ],
      "ok": 0,
      "hint": "Con vật kêu meo meo.",
      "yes": "Đúng! mèo.",
      "art": "cat"
    },
    {
      "q": "\"It is red.\" nghĩa là?",
      "opts": [
        "Nó màu đỏ.",
        "Nó to.",
        "Nó màu xanh."
      ],
      "ok": 0,
      "hint": "Tìm từ chỉ màu.",
      "yes": "Đúng! Nó màu đỏ.",
      "art": "It is red."
    }
  ]
});
