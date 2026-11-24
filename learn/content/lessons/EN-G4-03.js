/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 4 · Đọc (Reading).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G4-03",
  "grade": 4,
  "subj": "tanh",
  "title": "Đọc (Reading)",
  "screens": [
    {
      "k": "say",
      "t": "Đọc kỹ cả đoạn rồi tìm câu có đáp án.",
      "art": "📖 Đọc → tìm → chọn"
    },
    {
      "k": "say",
      "t": "Từ chủ đề: school (trường), family (gia đình), food (đồ ăn).",
      "art": "🏫 school"
    },
    {
      "k": "say",
      "t": "Ngày trong tuần: Friday là thứ Sáu, Saturday là thứ Bảy.",
      "art": "Fri · Sat"
    },
    {
      "k": "choose",
      "t": "\"I have a brother.\" nghĩa là?",
      "opts": [
        "Tôi có một con chó.",
        "Tôi có một anh/em trai.",
        "Tôi có một chị."
      ],
      "ok": 1,
      "yes": "Đúng! brother.",
      "no": "Tìm từ brother.",
      "art": "👦"
    },
    {
      "k": "choose",
      "t": "school nghĩa là?",
      "opts": [
        "bệnh viện",
        "chợ",
        "trường học"
      ],
      "ok": 2,
      "yes": "Đúng! trường học.",
      "no": "Nơi em đi học.",
      "art": "🏫"
    },
    {
      "k": "choose",
      "t": "Friday là thứ mấy?",
      "opts": [
        "thứ Tư",
        "thứ Bảy",
        "thứ Sáu"
      ],
      "ok": 2,
      "yes": "Đúng! thứ Sáu.",
      "no": "Sau Thursday.",
      "art": "Friday"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đọc kỹ rồi tìm đáp án trong bài",
        "Từ vựng: school, family, food",
        "Ngày trong tuần"
      ]
    }
  ],
  "tryit": [
    {
      "q": "\"She likes milk.\" nghĩa là?",
      "opts": [
        "Cô ấy bán sữa.",
        "Cô ấy thích sữa.",
        "Cô ấy ghét sữa."
      ],
      "ok": 1,
      "hint": "Tìm động từ likes.",
      "yes": "Đúng! Cô ấy thích sữa.",
      "art": "🥛"
    },
    {
      "q": "family nghĩa là?",
      "opts": [
        "gia đình",
        "thầy cô",
        "bạn bè"
      ],
      "ok": 0,
      "hint": "Gồm ba mẹ, anh chị em.",
      "yes": "Đúng! gia đình.",
      "art": "👨‍👩‍👧"
    },
    {
      "q": "Saturday là thứ mấy?",
      "opts": [
        "thứ Bảy",
        "Chủ nhật",
        "thứ Sáu"
      ],
      "ok": 0,
      "hint": "Sau Friday.",
      "yes": "Đúng! thứ Bảy.",
      "art": "Saturday"
    }
  ]
});
