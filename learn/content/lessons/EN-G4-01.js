/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 4 · Nghe (Listening).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G4-01",
  "grade": 4,
  "subj": "tanh",
  "title": "Nghe (Listening)",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Nghe (Listening).",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Nghe lời nói ngắn rồi tìm thông tin chính.",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Chú ý giờ giấc, nơi chốn và việc làm.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "I get up at six. Mấy giờ bạn dậy?",
      "opts": [
        "6 giờ",
        "7 giờ",
        "5 giờ"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 6 giờ.",
      "no": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó."
    },
    {
      "k": "choose",
      "t": "He goes to school by bike. Bạn ấy đi bằng gì?",
      "opts": [
        "Xe buýt",
        "Đi bộ",
        "Xe đạp"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Xe đạp.",
      "no": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó."
    },
    {
      "k": "choose",
      "t": "She can swim. Bạn ấy biết làm gì?",
      "opts": [
        "Hát",
        "Vẽ",
        "Bơi"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Bơi.",
      "no": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó."
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Nghe giờ, nơi chốn, việc làm",
        "Chọn thông tin đúng"
      ]
    }
  ],
  "tryit": [
    {
      "q": "There are three books. Có mấy quyển sách?",
      "opts": [
        "3",
        "4",
        "2"
      ],
      "ok": 0,
      "hint": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "I live in Hanoi. Bạn sống ở đâu?",
      "opts": [
        "Hà Nội",
        "Huế",
        "Đà Nẵng"
      ],
      "ok": 0,
      "hint": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "It is sunny today. Thời tiết thế nào?",
      "opts": [
        "Gió",
        "Nắng",
        "Mưa"
      ],
      "ok": 1,
      "hint": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó.",
      "yes": "Đúng rồi!"
    }
  ]
});
