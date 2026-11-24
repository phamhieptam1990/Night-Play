/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 2 · Từ và câu.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G2-02",
  "grade": 2,
  "subj": "tviet",
  "title": "Từ và câu",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Từ và câu.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Mở rộng vốn từ theo chủ điểm; nhận biết và sử dụng một số kiểu câu, dấu câu đã học.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Điền chữ còn thiếu: Mèo là một __on vật.",
      "opts": [
        "k",
        "ch",
        "c"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là c.",
      "no": "Nhìn chữ đứng ngay sau chỗ trống."
    },
    {
      "k": "choose",
      "t": "Điền chữ còn thiếu: 🥭 __oài",
      "opts": [
        "s",
        "x",
        "tr"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là x.",
      "no": "Nhìn hình và đọc to cả từ."
    },
    {
      "k": "choose",
      "t": "Từ nào là từ chỉ sự vật?",
      "opts": [
        "dài",
        "khóc",
        "bút"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là bút.",
      "no": "Sự vật: nhìn thấy, sờ được. Hoạt động: làm được. Đặc điểm: dùng để tả."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Mở rộng vốn từ theo chủ điểm; nhận biết và sử dụng một số kiểu câu, dấu câu đã học.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Điền dấu cuối câu: Trời hôm nay nắng đẹp __",
      "opts": [
        ",",
        "?",
        "."
      ],
      "ok": 2,
      "hint": "Câu hỏi dùng dấu hỏi (?). Câu cảm, ngạc nhiên dùng dấu chấm than (!). Câu kể dùng…",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Từ nào trái nghĩa với sạch?",
      "opts": [
        "bẩn",
        "sai",
        "mỏng"
      ],
      "ok": 0,
      "hint": "Trái nghĩa là nghĩa ngược nhau.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Điền chữ còn thiếu: Bố em làm __ề nông.",
      "opts": [
        "ngh",
        "g",
        "ng"
      ],
      "ok": 0,
      "hint": "Nhìn chữ đứng ngay sau chỗ trống.",
      "yes": "Đúng rồi!"
    }
  ]
});
