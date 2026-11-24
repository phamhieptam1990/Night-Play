/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 2 · Từ vựng theo chủ đề.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G2-03",
  "grade": 2,
  "subj": "tanh",
  "title": "Từ vựng theo chủ đề",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Từ vựng theo chủ đề.",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Mở rộng vốn từ quen thuộc thông qua tranh ảnh, trò chơi, bài hát và tình huống.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "Đây là màu gì? 🟤",
      "opts": [
        "yellow",
        "green",
        "brown"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là brown.",
      "no": "Nhìn màu của hình tròn rồi nhớ lại tên màu đó trong bài học hoặc bài hát.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Số 12 đọc là gì?",
      "opts": [
        "eleven",
        "fifteen",
        "twelve"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là twelve.",
      "no": "Đếm lần lượt từ một bằng tiếng Anh và dừng ở số cần tìm.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Đây là gì? ✋",
      "opts": [
        "hand",
        "tooth",
        "nose"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là hand.",
      "no": "Nhìn hình và nói tên bằng tiếng Việt trước, rồi nhớ từ tiếng Anh.",
      "optlang": "en"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Mở rộng vốn từ quen thuộc thông qua tranh ảnh, trò chơi, bài hát và tình huống.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Tuesday, Wednesday, __",
      "opts": [
        "Monday",
        "Friday",
        "Thursday"
      ],
      "ok": 2,
      "hint": "Đọc nhẩm thứ tự các ngày trong tuần (hoặc các tháng trong năm) từ đầu.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "Chọn cách viết đúng: ❄️",
      "opts": [
        "snoowy",
        "snowwy",
        "snowy"
      ],
      "ok": 2,
      "hint": "Nhìn hình và đọc từng chữ cái của từ.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "Đây là màu gì? ⚪",
      "opts": [
        "orange",
        "purple",
        "white"
      ],
      "ok": 2,
      "hint": "Nhìn màu của hình tròn rồi nhớ lại tên màu đó trong bài học hoặc bài hát.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    }
  ]
});
