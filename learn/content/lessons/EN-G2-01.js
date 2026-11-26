/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 2 · Nghe hiểu chỉ dẫn.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
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
      "t": "Em nghe chỉ dẫn rồi làm theo: Stand up! Sit down!",
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
      "no": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó."
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
      "no": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó."
    },
    {
      "k": "choose",
      "t": "Open your book. Em làm gì?",
      "opts": [
        "Mở sách",
        "Vẽ tranh",
        "Đóng sách"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Mở sách.",
      "no": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó."
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Stand up = đứng lên",
        "Sit down = ngồi xuống"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Close the door. Em làm gì?",
      "opts": [
        "Đóng cửa",
        "Mở cửa",
        "Bật đèn"
      ],
      "ok": 0,
      "hint": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó.",
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
      "hint": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Look at the board. Em nhìn gì?",
      "opts": [
        "Cái bàn",
        "Cái bảng",
        "Cái cặp"
      ],
      "ok": 1,
      "hint": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó.",
      "yes": "Đúng rồi!"
    }
  ]
});
