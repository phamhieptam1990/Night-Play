/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 3 · Nghe (Listening).
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G3-01",
  "grade": 3,
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
      "t": "Nghe từ và cụm từ, rồi chọn thông tin đúng.",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Nghe kỹ con số, màu sắc và tên.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "I like apples. Bé thích gì?",
      "opts": [
        "Táo",
        "Chuối",
        "Cam"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Táo.",
      "no": "Apple là quả táo."
    },
    {
      "k": "choose",
      "t": "It is Monday. Hôm nay là thứ mấy?",
      "opts": [
        "Thứ Ba",
        "Chủ nhật",
        "Thứ Hai"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Thứ Hai.",
      "no": "Monday là thứ Hai."
    },
    {
      "k": "choose",
      "t": "She is eight. Cô bé mấy tuổi?",
      "opts": [
        "6 tuổi",
        "8 tuổi",
        "9 tuổi"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 8 tuổi.",
      "no": "Eight là số tám."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Nghe kỹ từ khoá",
        "Chọn đáp án hợp với điều đã nghe"
      ]
    }
  ],
  "tryit": [
    {
      "q": "My name is Nam. Tên bạn là gì?",
      "opts": [
        "Nam",
        "Lan",
        "Tom"
      ],
      "ok": 0,
      "hint": "Nghe tên sau chữ name.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "I have two cats. Bạn có mấy con mèo?",
      "opts": [
        "3",
        "1",
        "2"
      ],
      "ok": 2,
      "hint": "Two là số hai.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "It is red. Đây là màu gì?",
      "opts": [
        "Màu vàng",
        "Màu đỏ",
        "Màu xanh"
      ],
      "ok": 1,
      "hint": "Red là màu đỏ.",
      "yes": "Đúng rồi!"
    }
  ]
});
