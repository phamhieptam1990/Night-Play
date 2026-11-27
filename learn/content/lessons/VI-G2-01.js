/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 2 · Đọc thành tiếng và đọc hiểu.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G2-01",
  "grade": 2,
  "subj": "tviet",
  "title": "Đọc thành tiếng và đọc hiểu",
  "screens": [
    {
      "k": "say",
      "t": "Đọc to, rõ, ngắt nghỉ ở dấu phẩy và dấu chấm. Nghe kỹ để hiểu câu chuyện.",
      "art": "📖 Đọc chậm rãi"
    },
    {
      "k": "say",
      "t": "Đọc xong, hỏi: Ai? Làm gì? Ở đâu? Khi nào? Câu trả lời nằm ngay trong bài.",
      "art": "Ai? Làm gì? Ở đâu?"
    },
    {
      "k": "say",
      "t": "Ghép vần: phụ âm + vần + thanh thành tiếng. Ví dụ m + ưa + huyền = mưa.",
      "art": "m + ưa = mưa"
    },
    {
      "k": "choose",
      "t": "Em Na có một con mèo trắng. Mèo của Na màu gì?",
      "opts": [
        "Màu trắng",
        "Màu vàng",
        "Màu đen"
      ],
      "ok": 0,
      "yes": "Đúng! Mèo màu trắng.",
      "no": "Tìm từ chỉ màu trong câu.",
      "art": "🐱"
    },
    {
      "k": "choose",
      "t": "Mẹ đi chợ mua cá. Mẹ mua gì?",
      "opts": [
        "Cá",
        "Thịt",
        "Rau"
      ],
      "ok": 0,
      "yes": "Đúng! Mẹ mua cá.",
      "no": "Tìm từ đứng sau chữ mua.",
      "art": "🛒"
    },
    {
      "k": "choose",
      "t": "Ghép m + ưa + dấu huyền được tiếng nào?",
      "opts": [
        "mưa",
        "mua",
        "mứa"
      ],
      "ok": 0,
      "yes": "Đúng! mưa.",
      "no": "Nhớ vần ưa và dấu huyền.",
      "art": "m + ưa"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Đọc rõ, ngắt nghỉ ở dấu câu",
        "Trả lời câu hỏi bằng thông tin trong bài",
        "Ghép phụ âm + vần + thanh thành tiếng"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Sáng nay trời mưa, em mang áo mưa đi học. Vì sao em mang áo mưa?",
      "opts": [
        "Vì trời mưa",
        "Vì trời lạnh",
        "Vì trời nắng"
      ],
      "ok": 0,
      "hint": "Đọc câu đầu của bài.",
      "yes": "Đúng! Trời mưa.",
      "art": "🌧️"
    },
    {
      "q": "Tiếng nào ghép được từ ch + ợ + dấu nặng?",
      "opts": [
        "chở",
        "chỡ",
        "chợ"
      ],
      "ok": 2,
      "hint": "Ghép đúng dấu nặng dưới chữ ơ.",
      "yes": "Đúng! chợ.",
      "art": "ch + ợ"
    },
    {
      "q": "Ngắt nghỉ khi đọc ở chỗ nào?",
      "opts": [
        "Không cần ngắt",
        "Ở dấu phẩy, dấu chấm",
        "Giữa một tiếng"
      ],
      "ok": 1,
      "hint": "Nhìn các dấu trong câu.",
      "yes": "Đúng! Dấu câu báo chỗ nghỉ.",
      "art": "，。"
    }
  ]
});
