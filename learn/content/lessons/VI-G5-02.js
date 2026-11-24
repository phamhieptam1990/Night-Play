/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 5 · Tiếng Việt và ngữ pháp.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G5-02",
  "grade": 5,
  "subj": "tviet",
  "title": "Tiếng Việt và ngữ pháp",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Tiếng Việt và ngữ pháp.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Vận dụng kiến thức từ, câu, liên kết câu và quy tắc chính tả để hiểu và tạo lập văn bản.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Điền chữ còn thiếu: 🐷 __ợn",
      "opts": [
        "l",
        "ng",
        "nh"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là l.",
      "no": "Nhìn hình và đọc to cả từ."
    },
    {
      "k": "choose",
      "t": "Từ nào là danh từ?",
      "opts": [
        "ăn",
        "bàn",
        "xanh"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là bàn.",
      "no": "Sự vật: nhìn thấy, sờ được. Hoạt động: làm được. Đặc điểm: dùng để tả."
    },
    {
      "k": "choose",
      "t": "Điền dấu cuối câu: Em có thích môn Toán không __",
      "opts": [
        "?",
        "!",
        "."
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là ?.",
      "no": "Câu hỏi dùng dấu hỏi (?). Câu cảm, ngạc nhiên dùng dấu chấm than (!). Câu kể dùng…"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Vận dụng kiến thức từ, câu, liên kết câu và quy tắc chính tả để hiểu và tạo lập văn bản.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Câu “Bạn có thích đá bóng không?” thuộc kiểu câu nào?",
      "opts": [
        "câu hỏi",
        "câu cảm",
        "câu khiến"
      ],
      "ok": 0,
      "hint": "Kể: nói điều đã xảy ra. Hỏi: để hỏi. Cảm: bày tỏ cảm xúc. Khiến: nhờ, bảo làm.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Từ nào đồng nghĩa với bố?",
      "opts": [
        "ba",
        "mẹ",
        "chị"
      ],
      "ok": 0,
      "hint": "Đồng nghĩa là gần nghĩa nhau, dùng thay nhau được.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Từ nào trái nghĩa với nóng?",
      "opts": [
        "lạnh",
        "rỗng",
        "hiền"
      ],
      "ok": 0,
      "hint": "Trái nghĩa là nghĩa ngược nhau.",
      "yes": "Đúng rồi!"
    }
  ]
});
