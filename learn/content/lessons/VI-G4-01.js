/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 4 · Đọc hiểu văn học.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G4-01",
  "grade": 4,
  "subj": "tviet",
  "title": "Đọc hiểu văn học",
  "screens": [
    {
      "k": "say",
      "t": "Đọc văn học: tìm nhân vật, việc xảy ra và bài học rút ra.",
      "art": "👤 Ai? 📖 Việc gì? 💡 Bài học"
    },
    {
      "k": "say",
      "t": "Thành ngữ là câu nói quen thuộc có nghĩa bóng.",
      "art": "Ăn quả nhớ kẻ trồng cây"
    },
    {
      "k": "say",
      "t": "Từ trái nghĩa giúp ta thấy rõ sự đối lập.",
      "art": "hiền ↔ dữ"
    },
    {
      "k": "choose",
      "t": "Thành ngữ \"Ăn quả nhớ kẻ trồng cây\" khuyên ta điều gì?",
      "opts": [
        "Trồng nhiều cây",
        "Ăn nhiều quả",
        "Biết ơn người giúp mình"
      ],
      "ok": 2,
      "yes": "Đúng! Nhớ ơn người giúp mình.",
      "no": "Đây là nghĩa bóng, nói về lòng biết ơn.",
      "art": "🌳"
    },
    {
      "k": "choose",
      "t": "Từ trái nghĩa với \"hiền\" là?",
      "opts": [
        "lành",
        "ngoan",
        "dữ"
      ],
      "ok": 2,
      "yes": "Đúng! hiền ↔ dữ.",
      "no": "Nghĩ xem tính cách ngược lại.",
      "art": "hiền ↔ ?"
    },
    {
      "k": "choose",
      "t": "Trong truyện, nhân vật là ai?",
      "opts": [
        "Tên cuốn sách",
        "Người, vật trong truyện",
        "Tên tác giả"
      ],
      "ok": 1,
      "yes": "Đúng! Nhân vật.",
      "no": "Nhân vật là đối tượng làm nên câu chuyện.",
      "art": "👤"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Tìm nhân vật, sự việc và bài học",
        "Thành ngữ thường có nghĩa bóng",
        "Từ trái nghĩa có nghĩa ngược nhau"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Thành ngữ \"Có công mài sắt có ngày nên kim\" nói về?",
      "opts": [
        "Làm đồ sắt",
        "Mua kim",
        "Kiên trì"
      ],
      "ok": 2,
      "hint": "Hiểu theo nghĩa bóng.",
      "yes": "Đúng! Kiên trì thì thành công.",
      "art": "🪡"
    },
    {
      "q": "Từ trái nghĩa với \"siêng năng\" là?",
      "opts": [
        "lười biếng",
        "cần cù",
        "chăm chỉ"
      ],
      "ok": 0,
      "hint": "Tìm từ ngược nghĩa.",
      "yes": "Đúng! lười biếng.",
      "art": "siêng năng ↔ ?"
    },
    {
      "q": "Bài học của câu chuyện thường nằm ở đâu?",
      "opts": [
        "Phần kết",
        "Tên truyện",
        "Tên tác giả"
      ],
      "ok": 0,
      "hint": "Câu chuyện thường kết thúc bằng điều rút ra.",
      "yes": "Đúng! Phần kết.",
      "art": "💡"
    }
  ]
});
