/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 2 · Viết đoạn ngắn.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G2-03",
  "grade": 2,
  "subj": "tviet",
  "title": "Viết đoạn ngắn",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Viết đoạn ngắn.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Đoạn văn ngắn gồm vài câu nói về một việc hay một người.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Đầu câu viết hoa, cuối câu có dấu chấm.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Câu nào viết đúng?",
      "opts": [
        "Em đi học.",
        "em đi học",
        "Em đi học"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Em đi học..",
      "no": "Chữ đầu câu viết hoa, cuối câu có dấu chấm."
    },
    {
      "k": "choose",
      "t": "Cuối câu kể ta dùng dấu gì?",
      "opts": [
        "Dấu chấm",
        "Dấu hỏi",
        "Dấu phẩy"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Dấu chấm.",
      "no": "Câu kể dùng để kể hoặc tả: nó kết thúc thế nào?"
    },
    {
      "k": "choose",
      "t": "Câu nào nói về con mèo?",
      "opts": [
        "Bé đi học.",
        "Mẹ nấu cơm.",
        "Con mèo ngủ trên ghế."
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Con mèo ngủ trên ghế..",
      "no": "Tìm câu có từ mèo."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đầu câu viết hoa",
        "Cuối câu kể có dấu chấm"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Sắp xếp các từ: mẹ, chợ, đi. Câu đúng là?",
      "opts": [
        "Đi mẹ chợ.",
        "Chợ đi mẹ.",
        "Mẹ đi chợ."
      ],
      "ok": 2,
      "hint": "Câu cần nói ai làm gì: ai đứng trước, việc làm đứng sau.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Đoạn văn \"Trời mưa. Em ở nhà.\" có mấy câu?",
      "opts": [
        "2",
        "1",
        "3"
      ],
      "ok": 0,
      "hint": "Đếm số dấu chấm.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Đầu đoạn văn ta viết thế nào?",
      "opts": [
        "Giữa dòng",
        "Lùi vào một chút",
        "Sát lề trái"
      ],
      "ok": 1,
      "hint": "Chữ đầu đoạn thường lùi vào.",
      "yes": "Đúng rồi!"
    }
  ]
});
