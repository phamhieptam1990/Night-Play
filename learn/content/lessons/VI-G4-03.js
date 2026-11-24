/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 4 · Viết bài.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "VI-G4-03",
  "grade": 4,
  "subj": "tviet",
  "title": "Viết bài",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Viết bài.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Lập ý và viết bài kể chuyện, miêu tả, thư hoặc văn bản thông dụng theo yêu cầu học tập.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "Điền chữ còn thiếu: 🦇 __ơi",
      "opts": [
        "d",
        "gh",
        "gi"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là d.",
      "no": "Nhìn hình và đọc to cả từ."
    },
    {
      "k": "choose",
      "t": "Từ nào là danh từ?",
      "opts": [
        "học",
        "trăng",
        "viết"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là trăng.",
      "no": "Sự vật: nhìn thấy, sờ được. Hoạt động: làm được. Đặc điểm: dùng để tả."
    },
    {
      "k": "choose",
      "t": "Điền dấu câu: Mẹ mua cam __ táo và chuối.",
      "opts": [
        "?",
        ",",
        "."
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là ,.",
      "no": "Câu hỏi dùng dấu hỏi (?). Câu cảm, ngạc nhiên dùng dấu chấm than (!). Câu kể dùng…"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Lập ý và viết bài kể chuyện, miêu tả, thư hoặc văn bản thông dụng theo yêu cầu học tập.",
        "Sai thì thử lại, bé sẽ giỏi hơn!"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Câu “Trời hôm nay nắng đẹp.” thuộc kiểu câu nào?",
      "opts": [
        "câu hỏi",
        "câu kể",
        "câu khiến"
      ],
      "ok": 1,
      "hint": "Kể: nói điều đã xảy ra. Hỏi: để hỏi. Cảm: bày tỏ cảm xúc. Khiến: nhờ, bảo làm.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Từ nào đồng nghĩa với mẹ?",
      "opts": [
        "cô",
        "bố",
        "má"
      ],
      "ok": 2,
      "hint": "Đồng nghĩa là gần nghĩa nhau, dùng thay nhau được.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Từ nào trái nghĩa với khen?",
      "opts": [
        "khô",
        "chê",
        "hiền"
      ],
      "ok": 1,
      "hint": "Trái nghĩa là nghĩa ngược nhau.",
      "yes": "Đúng rồi!"
    }
  ]
});
