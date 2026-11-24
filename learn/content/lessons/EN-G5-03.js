/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 5 · Đọc (Reading).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G5-03",
  "grade": 5,
  "subj": "tanh",
  "title": "Đọc (Reading)",
  "screens": [
    {
      "k": "say",
      "t": "Đọc đoạn ngắn, tìm ý chính và chi tiết.",
      "art": "📖 Đọc → hiểu"
    },
    {
      "k": "say",
      "t": "Từ chủ đề: hobby (sở thích), job (nghề), place (nơi chốn).",
      "art": "🎨 hobby"
    },
    {
      "k": "say",
      "t": "Câu phủ định: He does not like fish.",
      "art": "does not = không"
    },
    {
      "k": "choose",
      "t": "\"He is a doctor.\" nghĩa là?",
      "opts": [
        "Ông ấy là giáo viên.",
        "Ông ấy là học sinh.",
        "Ông ấy là bác sĩ."
      ],
      "ok": 2,
      "yes": "Đúng! doctor = bác sĩ.",
      "no": "Tìm từ doctor.",
      "art": "🩺"
    },
    {
      "k": "choose",
      "t": "hobby nghĩa là?",
      "opts": [
        "nghề nghiệp",
        "ngôi nhà",
        "sở thích"
      ],
      "ok": 2,
      "yes": "Đúng! sở thích.",
      "no": "Việc em thích làm lúc rảnh.",
      "art": "🎨"
    },
    {
      "k": "choose",
      "t": "\"She does not like fish.\" nghĩa là?",
      "opts": [
        "Cô ấy thích cá.",
        "Cô ấy ăn cá.",
        "Cô ấy không thích cá."
      ],
      "ok": 2,
      "yes": "Đúng! Không thích.",
      "no": "Chú ý does not.",
      "art": "🐟"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đọc tìm ý chính và chi tiết",
        "Từ: hobby, job, place",
        "does not = không"
      ]
    }
  ],
  "tryit": [
    {
      "q": "library nghĩa là?",
      "opts": [
        "chợ",
        "thư viện",
        "bệnh viện"
      ],
      "ok": 1,
      "hint": "Nơi có nhiều sách.",
      "yes": "Đúng! thư viện.",
      "art": "📚"
    },
    {
      "q": "\"We play football on Sunday.\" Chơi vào?",
      "opts": [
        "Chủ nhật",
        "Thứ Hai",
        "Thứ Bảy"
      ],
      "ok": 0,
      "hint": "Tìm từ chỉ ngày.",
      "yes": "Đúng! Chủ nhật.",
      "art": "⚽"
    },
    {
      "q": "job nghĩa là?",
      "opts": [
        "sở thích",
        "nghề nghiệp",
        "trường học"
      ],
      "ok": 1,
      "hint": "Công việc của người lớn.",
      "yes": "Đúng! nghề nghiệp.",
      "art": "👷"
    }
  ]
});
