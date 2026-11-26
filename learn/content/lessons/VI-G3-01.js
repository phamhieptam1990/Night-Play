/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 3 · Đọc văn bản.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G3-01",
  "grade": 3,
  "subj": "tviet",
  "title": "Đọc văn bản",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Đọc văn bản.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Khi đọc văn bản, em tìm: ai, làm gì, ở đâu, khi nào.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Ý chính là điều văn bản nói đến nhiều nhất.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "\"Em nhặt rác bỏ vào thùng.\" Em làm gì?",
      "opts": [
        "Nhặt rác",
        "Đá bóng",
        "Vẽ tranh"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Nhặt rác.",
      "no": "Tìm từ chỉ việc làm."
    },
    {
      "k": "choose",
      "t": "\"Sáng nay, Nam đến trường.\" Nam đến trường lúc nào?",
      "opts": [
        "Tối qua",
        "Chiều mai",
        "Sáng nay"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Sáng nay.",
      "no": "Hỏi khi nào thì tìm từ chỉ thời gian."
    },
    {
      "k": "choose",
      "t": "\"Mèo ngủ trên ghế.\" Mèo ở đâu?",
      "opts": [
        "Dưới bàn",
        "Ngoài sân",
        "Trên ghế"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Trên ghế.",
      "no": "Hỏi ở đâu thì tìm nơi chốn."
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Tìm ai, làm gì, ở đâu, khi nào",
        "Ý chính là điều nói nhiều nhất"
      ]
    }
  ],
  "tryit": [
    {
      "q": "\"Lan giúp mẹ rửa bát. Mẹ khen Lan.\" Lan là người thế nào?",
      "opts": [
        "Lười biếng",
        "Hay khóc",
        "Chăm chỉ"
      ],
      "ok": 2,
      "hint": "Nghĩ về việc Lan làm.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Muốn tìm nhân vật trong truyện, ta hỏi gì?",
      "opts": [
        "Bao nhiêu?",
        "Mấy giờ?",
        "Ai?"
      ],
      "ok": 2,
      "hint": "Nhân vật là người hay con vật.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "\"Trời mưa to. Em mang ô.\" Vì sao em mang ô?",
      "opts": [
        "Vì trời mưa",
        "Vì trời nắng",
        "Vì đi chợ"
      ],
      "ok": 0,
      "hint": "Nối hai câu với nhau.",
      "yes": "Đúng rồi!"
    }
  ]
});
