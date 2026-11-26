/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 4 · Viết bài.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G4-03",
  "grade": 4,
  "subj": "tviet",
  "title": "Viết bài",
  "screens": [
    {
      "k": "say",
      "t": "Bài văn có ba phần: mở bài, thân bài, kết bài.",
      "art": "Mở → Thân → Kết"
    },
    {
      "k": "say",
      "t": "Danh từ chỉ người, vật; động từ chỉ hoạt động; tính từ chỉ đặc điểm.",
      "art": "bạn · chạy · đẹp"
    },
    {
      "k": "say",
      "t": "Dấu phẩy và dấu chấm giúp câu rõ nghĩa. Câu kể, câu hỏi, câu cảm có dấu riêng.",
      "art": ", . ? !"
    },
    {
      "k": "choose",
      "t": "Phần giới thiệu đề tài của bài văn là?",
      "opts": [
        "Mở bài",
        "Kết bài",
        "Thân bài"
      ],
      "ok": 0,
      "yes": "Đúng! Mở bài.",
      "no": "Phần đầu tiên của bài.",
      "art": "①"
    },
    {
      "k": "choose",
      "t": "Từ nào là động từ?",
      "opts": [
        "bàn",
        "chạy",
        "đẹp"
      ],
      "ok": 1,
      "yes": "Đúng! Chạy.",
      "no": "Động từ chỉ việc làm.",
      "art": "chạy · đẹp · bàn"
    },
    {
      "k": "choose",
      "t": "Từ nào là tính từ?",
      "opts": [
        "bút",
        "đẹp",
        "chạy"
      ],
      "ok": 1,
      "yes": "Đúng! Đẹp.",
      "no": "Tính từ chỉ đặc điểm, màu sắc, hình dáng.",
      "art": "đẹp · chạy · bút"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Bài văn: mở bài, thân bài, kết bài",
        "Danh từ, động từ, tính từ",
        "Dùng dấu câu đúng"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Điền ch hay tr: bầu __ời.",
      "opts": [
        "th",
        "tr",
        "ch"
      ],
      "ok": 1,
      "hint": "Nghĩ đến nơi có mây và mặt trời.",
      "yes": "Đúng! bầu trời.",
      "art": "bầu __ời"
    },
    {
      "q": "Từ đồng nghĩa với \"to lớn\" là?",
      "opts": [
        "nhỏ bé",
        "thấp",
        "khổng lồ"
      ],
      "ok": 2,
      "hint": "Tìm từ cùng nghĩa.",
      "yes": "Đúng! khổng lồ.",
      "art": "to lớn = ?"
    },
    {
      "q": "Phần nêu chi tiết, cảm xúc của bài văn là?",
      "opts": [
        "Mở bài",
        "Thân bài",
        "Tên bài"
      ],
      "ok": 1,
      "hint": "Phần ở giữa, dài nhất.",
      "yes": "Đúng! Thân bài.",
      "art": "②"
    }
  ]
});
