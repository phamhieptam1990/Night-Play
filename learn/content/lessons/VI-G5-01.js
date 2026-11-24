/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 5 · Đọc hiểu tổng hợp.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G5-01",
  "grade": 5,
  "subj": "tviet",
  "title": "Đọc hiểu tổng hợp",
  "screens": [
    {
      "k": "say",
      "t": "Đọc hiểu: xác định chủ đề, ý chính của từng đoạn, rồi nêu ý chung.",
      "art": "Đoạn 1 → ý 1 → chủ đề"
    },
    {
      "k": "say",
      "t": "Thành ngữ, tục ngữ có nghĩa bóng, nghĩa sâu hơn nghĩa chữ.",
      "art": "Uống nước nhớ nguồn"
    },
    {
      "k": "say",
      "t": "Nhân vật có tính cách qua lời nói và hành động.",
      "art": "👤 lời nói · hành động"
    },
    {
      "k": "choose",
      "t": "\"Uống nước nhớ nguồn\" khuyên ta điều gì?",
      "opts": [
        "Uống nhiều nước",
        "Đi tìm suối",
        "Biết ơn cội nguồn"
      ],
      "ok": 2,
      "yes": "Đúng! Biết ơn người đi trước.",
      "no": "Hiểu nghĩa bóng.",
      "art": "💧"
    },
    {
      "k": "choose",
      "t": "Ý chính của đoạn văn là?",
      "opts": [
        "Từ đầu tiên",
        "Câu dài nhất",
        "Ý bao quát cả đoạn"
      ],
      "ok": 2,
      "yes": "Đúng! Ý bao quát.",
      "no": "Nó thâu tóm nội dung của cả đoạn.",
      "art": "📄"
    },
    {
      "k": "choose",
      "t": "\"Chị ngã em nâng\" nói về?",
      "opts": [
        "Giúp đỡ nhau",
        "Học đi xe",
        "Chị em đi chơi"
      ],
      "ok": 0,
      "yes": "Đúng! Giúp nhau lúc khó.",
      "no": "Hiểu nghĩa bóng.",
      "art": "🤝"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Tìm ý chính từng đoạn rồi nêu chủ đề",
        "Thành ngữ có nghĩa bóng",
        "Tính cách nhân vật hiện qua lời nói, hành động"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Muốn biết tính cách nhân vật, ta xem?",
      "opts": [
        "Lời nói và hành động",
        "Tên bài",
        "Số trang"
      ],
      "ok": 0,
      "hint": "Người ta thể hiện mình bằng cách nào?",
      "yes": "Đúng! Lời nói, hành động.",
      "art": "👤"
    },
    {
      "q": "Từ trái nghĩa với \"dũng cảm\" là?",
      "opts": [
        "hèn nhát",
        "mạnh mẽ",
        "gan dạ"
      ],
      "ok": 0,
      "hint": "Tìm từ ngược nghĩa.",
      "yes": "Đúng! hèn nhát.",
      "art": "dũng cảm ↔ ?"
    },
    {
      "q": "Chủ đề bài đọc là gì?",
      "opts": [
        "Điều bài muốn nói đến",
        "Tên nhà in",
        "Số dòng của bài"
      ],
      "ok": 0,
      "hint": "Chủ đề là nội dung chính nhất.",
      "yes": "Đúng! Điều bài muốn nói.",
      "art": "💡"
    }
  ]
});
