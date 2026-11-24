/* BẢN NHÁP TỰ SINH · Toán lớp 2 · Dữ liệu và phân loại.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g2_data",
  "grade": 2,
  "subj": "toan",
  "title": "Dữ liệu và phân loại",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Dữ liệu và phân loại.",
      "art": "📊"
    },
    {
      "k": "say",
      "t": "Thu thập và phân loại dữ liệu",
      "art": "📊"
    },
    {
      "k": "say",
      "t": "Đọc bảng thống kê tranh hoặc bảng đơn giản",
      "art": "📊"
    },
    {
      "k": "choose",
      "t": "Có mấy 🍎?🍇 : 🍇🍇🍇🍇🍇🍇🍌 : 🍌🍌🍌🍌🍌🍌🍌🍌🍎 : 🍎🍎",
      "opts": [
        "1",
        "2",
        "3"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 2.",
      "no": "Đọc kỹ bảng và chỉ đúng hàng hoặc cột đề hỏi."
    },
    {
      "k": "choose",
      "t": "Có mấy 🍎?🍓 : 🍓🍓🍓🍓🍓🥕 : 🥕🥕🥕🍎 : 🍎🍎🍎🍎🍎🍎",
      "opts": [
        "7",
        "6",
        "5"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 6.",
      "no": "Đọc kỹ bảng và chỉ đúng hàng hoặc cột đề hỏi."
    },
    {
      "k": "choose",
      "t": "Có mấy 🍇?🍌 : 🍌🍌🍇 : 🍇🍇🍇🍇🍇🍇🥕 : 🥕🥕🥕🥕🥕🥕🥕🥕",
      "opts": [
        "7",
        "8",
        "6"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 6.",
      "no": "Đọc kỹ bảng và chỉ đúng hàng hoặc cột đề hỏi."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Thu thập và phân loại dữ liệu",
        "Đọc bảng thống kê tranh hoặc bảng đơn giản",
        "Trả lời câu hỏi từ dữ liệu"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Loại nhiều nhất hơn loại ít nhất mấy cái?🥕 : 🥕🥕🍇 : 🍇🍇🍇🍇🍌 : 🍌🍌🍌🍌🍌🍌🍌🍌🍌",
      "opts": [
        "9",
        "11",
        "7"
      ],
      "ok": 2,
      "hint": "Đọc kỹ bảng và chỉ đúng hàng hoặc cột đề hỏi.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Loại nhiều nhất hơn loại ít nhất mấy cái?🥕 : 🥕🥕🍎 : 🍎🍎🍎🍎🍌 : 🍌🍌🍌🍌🍌🍌🍌🍌",
      "opts": [
        "6",
        "10",
        "8"
      ],
      "ok": 0,
      "hint": "Đọc kỹ bảng và chỉ đúng hàng hoặc cột đề hỏi.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Có mấy 🍇?🍎 : 🍎🍎🥕 : 🥕🥕🥕🥕🥕🥕🍇 : 🍇🍇🍇🍇🍇🍇🍇",
      "opts": [
        "6",
        "8",
        "7"
      ],
      "ok": 2,
      "hint": "Đọc kỹ bảng và chỉ đúng hàng hoặc cột đề hỏi.",
      "yes": "Đúng rồi!"
    }
  ]
});
