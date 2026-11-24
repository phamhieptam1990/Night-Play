/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 3 · Kiến thức tiếng Việt.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G3-02",
  "grade": 3,
  "subj": "tviet",
  "title": "Kiến thức tiếng Việt",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Kiến thức tiếng Việt.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Nhận biết, vận dụng từ ngữ, câu, dấu câu và một số quy tắc chính tả trong ngữ cảnh.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Điền chữ còn thiếu: 🌊 __óng",
      "opts": [
        "ch",
        "tr",
        "s"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là s.",
      "no": "Nhìn hình và đọc to cả từ."
    },
    {
      "k": "choose",
      "t": "Từ nào là từ chỉ đặc điểm?",
      "opts": [
        "ngọt",
        "mèo",
        "chạy"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là ngọt.",
      "no": "Sự vật: nhìn thấy, sờ được. Hoạt động: làm được. Đặc điểm: dùng để tả."
    },
    {
      "k": "choose",
      "t": "Điền dấu câu: Trong vườn có hoa hồng __ hoa cúc và hoa lan.",
      "opts": [
        ".",
        "?",
        ","
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là ,.",
      "no": "Câu hỏi dùng dấu hỏi (?). Câu cảm, ngạc nhiên dùng dấu chấm than (!). Câu kể dùng…"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Nhận biết, vận dụng từ ngữ, câu, dấu câu và một số quy tắc chính tả trong ngữ cảnh.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Câu “Bạn có thích đá bóng không?” thuộc kiểu câu nào?",
      "opts": [
        "câu kể",
        "câu khiến",
        "câu hỏi"
      ],
      "ok": 2,
      "hint": "Kể: nói điều đã xảy ra. Hỏi: để hỏi. Cảm: bày tỏ cảm xúc. Khiến: nhờ, bảo làm.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Từ nào đồng nghĩa với trung thực?",
      "opts": [
        "nhút nhát",
        "thật thà",
        "lười biếng"
      ],
      "ok": 1,
      "hint": "Đồng nghĩa là gần nghĩa nhau, dùng thay nhau được.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Từ nào trái nghĩa với chậm?",
      "opts": [
        "nghèo",
        "nhanh",
        "nóng"
      ],
      "ok": 1,
      "hint": "Trái nghĩa là nghĩa ngược nhau.",
      "yes": "Đúng rồi!"
    }
  ]
});
