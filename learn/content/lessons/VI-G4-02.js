/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 4 · Đọc hiểu thông tin.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G4-02",
  "grade": 4,
  "subj": "tviet",
  "title": "Đọc hiểu thông tin",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Đọc hiểu thông tin.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Văn bản thông tin cho em biết điều mới.",
      "art": "📖"
    },
    {
      "k": "say",
      "t": "Tìm thông tin: đọc câu hỏi trước, rồi tìm trong bài.",
      "art": "📖"
    },
    {
      "k": "choose",
      "t": "\"Trái Đất quay quanh Mặt Trời.\" Vật nào quay?",
      "opts": [
        "Mặt Trăng",
        "Trái Đất",
        "Mặt Trời"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là Trái Đất.",
      "no": "Tìm từ đứng trước chữ quay."
    },
    {
      "k": "choose",
      "t": "\"Voi là loài vật to nhất trên cạn.\" Voi nổi bật vì?",
      "opts": [
        "To nhất trên cạn",
        "Nhỏ nhất",
        "Biết bay"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là To nhất trên cạn.",
      "no": "Đọc lại câu."
    },
    {
      "k": "choose",
      "t": "Thông báo thường cho biết điều gì?",
      "opts": [
        "Một câu đố",
        "Một bài thơ",
        "Việc, giờ giấc, nơi chốn"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Việc, giờ giấc, nơi chốn.",
      "no": "Thông báo để mọi người biết."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đọc câu hỏi, tìm từ khoá",
        "Tên bài cho biết nội dung chính"
      ]
    }
  ],
  "tryit": [
    {
      "q": "\"Cây xanh giúp không khí trong lành.\" Cây xanh giúp gì?",
      "opts": [
        "Trời mưa",
        "Không khí trong lành",
        "Nước đục"
      ],
      "ok": 1,
      "hint": "Tìm trong câu.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Muốn tìm nhanh thông tin, ta nên?",
      "opts": [
        "Đọc lung tung",
        "Đọc câu hỏi, tìm từ khoá",
        "Đoán bừa"
      ],
      "ok": 1,
      "hint": "Có mục tiêu thì tìm nhanh.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Tên bài thường cho biết điều gì?",
      "opts": [
        "Nội dung chính",
        "Số trang",
        "Màu giấy"
      ],
      "ok": 0,
      "hint": "Tên bài tóm ý chính.",
      "yes": "Đúng rồi!"
    }
  ]
});
