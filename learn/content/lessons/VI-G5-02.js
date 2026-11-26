/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 5 · Tiếng Việt và ngữ pháp.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G5-02",
  "grade": 5,
  "subj": "tviet",
  "title": "Tiếng Việt và ngữ pháp",
  "screens": [
    {
      "k": "say",
      "t": "Từ đồng nghĩa, trái nghĩa, từ nhiều nghĩa: chọn từ hợp ngữ cảnh.",
      "art": "đẹp = xinh\nđẹp ↔ xấu"
    },
    {
      "k": "say",
      "t": "Dấu phẩy liệt kê, dấu hai chấm báo lời giải thích, dấu ngoặc kép trích lời.",
      "art": ", : \" \""
    },
    {
      "k": "say",
      "t": "Câu ghép có hai vế. Nối bằng quan hệ từ: vì...nên, nếu...thì.",
      "art": "Vì mưa nên đường trơn."
    },
    {
      "k": "choose",
      "t": "Điền dấu: Trong vườn có hoa hồng __ hoa cúc và hoa lan.",
      "opts": [
        ",",
        "?",
        "."
      ],
      "ok": 0,
      "yes": "Đúng! Dấu phẩy ngăn các ý liệt kê.",
      "no": "Các hoa được kể liệt kê nối tiếp nhau.",
      "art": "hồng __ cúc"
    },
    {
      "k": "choose",
      "t": "Từ đồng nghĩa với \"xinh\" là?",
      "opts": [
        "xấu",
        "đẹp",
        "nhỏ"
      ],
      "ok": 1,
      "yes": "Đúng! đẹp.",
      "no": "Tìm từ cùng nghĩa.",
      "art": "xinh = ?"
    },
    {
      "k": "choose",
      "t": "Điền quan hệ từ: Vì mưa __ đường trơn.",
      "opts": [
        "nên",
        "mà",
        "để"
      ],
      "ok": 0,
      "yes": "Đúng! Vì...nên.",
      "no": "Chỉ kết quả của nguyên nhân.",
      "art": "Vì mưa __ đường trơn"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Chọn từ đồng nghĩa, trái nghĩa hợp ngữ cảnh",
        "Dùng đúng dấu câu",
        "Câu ghép nối bằng quan hệ từ"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Điền ch hay tr: __ân thành.",
      "opts": [
        "ch",
        "x",
        "tr"
      ],
      "ok": 0,
      "hint": "Nghĩ đến người thật thà.",
      "yes": "Đúng! chân thành.",
      "art": "__ân thành"
    },
    {
      "q": "Từ trái nghĩa với \"rộng\" là?",
      "opts": [
        "hẹp",
        "to",
        "dài"
      ],
      "ok": 0,
      "hint": "Tìm từ ngược nghĩa.",
      "yes": "Đúng! hẹp.",
      "art": "rộng ↔ ?"
    },
    {
      "q": "\"Em ơi, đi học nào!\" là câu gì?",
      "opts": [
        "Câu khiến",
        "Câu kể",
        "Câu hỏi"
      ],
      "ok": 0,
      "hint": "Câu này dùng để yêu cầu.",
      "yes": "Đúng! Câu khiến.",
      "art": "Em ơi, đi học nào!"
    }
  ]
});
