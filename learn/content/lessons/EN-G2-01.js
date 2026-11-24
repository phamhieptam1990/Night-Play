/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 2 · Nghe hiểu chỉ dẫn.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G2-01",
  "grade": 2,
  "subj": "tanh",
  "title": "Nghe hiểu chỉ dẫn",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Nghe hiểu chỉ dẫn.",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Bé nghe chỉ dẫn rồi làm theo: Stand up! Sit down!",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Nghe kỹ từng từ nhé.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "Stand up! nghĩa là gì?",
      "opts": [
        "Ngồi xuống",
        "Đứng lên",
        "Mở sách"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là Đứng lên.",
      "no": "Stand là đứng."
    },
    {
      "k": "choose",
      "t": "Sit down! nghĩa là gì?",
      "opts": [
        "Đứng lên",
        "Đi ra",
        "Ngồi xuống"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Ngồi xuống.",
      "no": "Sit là ngồi."
    },
    {
      "k": "choose",
      "t": "Open your book. Bé làm gì?",
      "opts": [
        "Mở sách",
        "Vẽ tranh",
        "Đóng sách"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Mở sách.",
      "no": "Open là mở."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Stand up = đứng lên",
        "Sit down = ngồi xuống"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Close the door. Bé làm gì?",
      "opts": [
        "Đóng cửa",
        "Mở cửa",
        "Bật đèn"
      ],
      "ok": 0,
      "hint": "Close là đóng.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Listen! nghĩa là gì?",
      "opts": [
        "Nhìn!",
        "Nghe!",
        "Nói!"
      ],
      "ok": 1,
      "hint": "Listen là nghe.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Look at the board. Bé nhìn gì?",
      "opts": [
        "Cái bàn",
        "Cái bảng",
        "Cái cặp"
      ],
      "ok": 1,
      "hint": "Board là cái bảng.",
      "yes": "Đúng rồi!"
    }
  ]
});
