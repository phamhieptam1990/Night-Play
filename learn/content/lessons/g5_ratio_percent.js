/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Tỉ số và tỉ số phần trăm.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g5_ratio_percent",
  "grade": 5,
  "subj": "toan",
  "title": "Tỉ số và tỉ số phần trăm",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Tỉ số và tỉ số phần trăm.",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Tỉ số của hai đại lượng",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Tỉ số phần trăm",
      "art": "🔢"
    },
    {
      "k": "choose",
      "t": "25% × 100 = ?",
      "opts": [
        "4",
        "75",
        "25"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 25.",
      "no": "Phần trăm là số phần trên 100: 10% = chia 10, 50% = chia 2."
    },
    {
      "k": "choose",
      "t": "10% × 80 = ?",
      "opts": [
        "8",
        "10",
        "72"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 8.",
      "no": "Phần trăm là số phần trên 100: 10% = chia 10, 50% = chia 2."
    },
    {
      "k": "choose",
      "t": "50% × 100 = ?",
      "opts": [
        "55",
        "51",
        "50"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 50.",
      "no": "Phần trăm là số phần trên 100: 10% = chia 10, 50% = chia 2."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Tỉ số của hai đại lượng",
        "Tỉ số phần trăm",
        "Tìm giá trị phần trăm của một số"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Lớp có 60 học sinh, trong đó 20% là học sinh nữ. Lớp có bao nhiêu học sinh nam?",
      "opts": [
        "12",
        "48",
        "20"
      ],
      "ok": 1,
      "hint": "Gạch dưới số liệu và câu hỏi. Bài này có NHIỀU BƯỚC.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "50% × 60 = ?",
      "opts": [
        "1.2",
        "50",
        "30"
      ],
      "ok": 2,
      "hint": "Phần trăm là số phần trên 100: 10% = chia 10, 50% = chia 2.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "10% × 40 = ?",
      "opts": [
        "36",
        "4",
        "9"
      ],
      "ok": 1,
      "hint": "Phần trăm là số phần trên 100: 10% = chia 10, 50% = chia 2.",
      "yes": "Đúng rồi!"
    }
  ]
});
