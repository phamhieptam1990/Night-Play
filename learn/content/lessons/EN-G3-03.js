/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 3 · Đọc (Reading).
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "EN-G3-03",
  "grade": 3,
  "subj": "tanh",
  "title": "Đọc (Reading)",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Đọc (Reading).",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Nhận diện chữ, từ và hiểu thông tin rất đơn giản trong văn bản ngắn có hỗ trợ hình ảnh.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "Số 13 đọc là gì?",
      "opts": [
        "thirteen",
        "twenty-three",
        "sixteen"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là thirteen.",
      "no": "Đếm lần lượt từ một bằng tiếng Anh và dừng ở số cần tìm.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Đây là gì? 🦵",
      "opts": [
        "eye",
        "mouth",
        "leg"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là leg.",
      "no": "Nhìn hình và nói tên bằng tiếng Việt trước, rồi nhớ từ tiếng Anh.",
      "optlang": "en"
    },
    {
      "k": "choose",
      "t": "Từ read nghĩa là gì?",
      "opts": [
        "bơi",
        "đọc",
        "giáo viên"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là đọc.",
      "no": "Nhớ lại từ này trong bài học hoặc bài hát."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Nhận diện chữ, từ và hiểu thông tin rất đơn giản trong văn bản ngắn có hỗ trợ hình ảnh.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Monday, Tuesday, __",
      "opts": [
        "Sunday",
        "Wednesday",
        "Friday"
      ],
      "ok": 1,
      "hint": "Đọc nhẩm thứ tự các ngày trong tuần (hoặc các tháng trong năm) từ đầu.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "Ben has two pencils and one ruler in his bag.How many pencils does Ben have?",
      "opts": [
        "two",
        "three",
        "one"
      ],
      "ok": 0,
      "hint": "Đọc lại đoạn, tìm câu có từ giống trong câu hỏi.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    },
    {
      "q": "Số 99 đọc là gì?",
      "opts": [
        "ninety-nine",
        "ninety-seven",
        "one hundred"
      ],
      "ok": 0,
      "hint": "Đếm lần lượt từ một bằng tiếng Anh và dừng ở số cần tìm.",
      "yes": "Đúng rồi!",
      "optlang": "en"
    }
  ]
});
