/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 3 · Kiến thức tiếng Việt.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G3-02",
  "grade": 3,
  "subj": "tviet",
  "title": "Kiến thức tiếng Việt",
  "screens": [
    {
      "k": "say",
      "t": "Dấu phẩy ngăn các ý liệt kê. Dấu chấm cuối câu kể, dấu hỏi cuối câu hỏi.",
      "art": "hoa hồng, hoa cúc\nem ơi? tuyệt quá!"
    },
    {
      "k": "say",
      "t": "Từ đồng nghĩa: nghĩa giống nhau. Từ trái nghĩa: nghĩa ngược nhau.",
      "art": "chăm = siêng\nnóng ↔ lạnh"
    },
    {
      "k": "say",
      "t": "Câu kể, câu hỏi, câu cảm, câu khiến: mỗi loại có mục đích riêng.",
      "art": "Ai đó? Đẹp quá!"
    },
    {
      "k": "choose",
      "t": "Điền dấu: Trong vườn có hoa hồng __ hoa cúc và hoa lan.",
      "opts": [
        ".",
        "?",
        ","
      ],
      "ok": 2,
      "yes": "Đúng! Dấu phẩy ngăn các ý liệt kê.",
      "no": "Đây là các hoa được kể liệt kê nối tiếp nhau.",
      "art": "hồng __ cúc"
    },
    {
      "k": "choose",
      "t": "Câu \"Bạn tên là gì?\" là câu gì?",
      "opts": [
        "Câu hỏi",
        "Câu kể",
        "Câu cảm"
      ],
      "ok": 0,
      "yes": "Đúng! Câu hỏi.",
      "no": "Câu này dùng để hỏi.",
      "art": "Bạn tên là gì?"
    },
    {
      "k": "choose",
      "t": "Từ đồng nghĩa với \"chăm chỉ\" là?",
      "opts": [
        "mệt mỏi",
        "lười biếng",
        "siêng năng"
      ],
      "ok": 2,
      "yes": "Đúng! siêng năng.",
      "no": "Tìm từ có nghĩa gần giống.",
      "art": "chăm chỉ = ?"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Dấu phẩy liệt kê, dấu chấm cuối câu kể",
        "Đồng nghĩa giống nhau, trái nghĩa ngược nhau",
        "Mỗi kiểu câu có dấu câu riêng"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Từ trái nghĩa với \"nóng\" là?",
      "opts": [
        "bỏng",
        "ấm",
        "lạnh"
      ],
      "ok": 2,
      "hint": "Nghĩ xem điều ngược lại.",
      "yes": "Đúng! nóng ↔ lạnh.",
      "art": "nóng ↔ ?"
    },
    {
      "q": "Điền ch hay tr: __ăm chỉ.",
      "opts": [
        "tr",
        "ch",
        "kh"
      ],
      "ok": 1,
      "hint": "Nghĩ đến người siêng năng.",
      "yes": "Đúng! chăm chỉ.",
      "art": "__ăm chỉ"
    },
    {
      "q": "Từ \"học sinh\" thuộc loại từ nào?",
      "opts": [
        "Chỉ hoạt động",
        "Chỉ sự vật",
        "Chỉ đặc điểm"
      ],
      "ok": 1,
      "hint": "Từ này chỉ người.",
      "yes": "Đúng! Chỉ sự vật.",
      "art": "học sinh"
    }
  ]
});
