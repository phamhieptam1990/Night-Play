/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Thống kê và xác suất.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g4_statistics",
  "grade": 4,
  "subj": "toan",
  "title": "Thống kê và xác suất",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Thống kê và xác suất.",
      "art": "📊"
    },
    {
      "k": "say",
      "t": "Trung bình cộng: cộng các số rồi chia cho số các số.",
      "art": "📊"
    },
    {
      "k": "say",
      "t": "Biểu đồ cột: cột càng cao thì số càng lớn.",
      "art": "📊"
    },
    {
      "k": "choose",
      "t": "Trung bình cộng của 4 và 8 là?",
      "opts": [
        "4",
        "12",
        "6"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 6.",
      "no": "Cộng 4 + 8 rồi chia cho 2."
    },
    {
      "k": "choose",
      "t": "Trung bình cộng của 6, 7 và 8 là?",
      "opts": [
        "6",
        "7",
        "21"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 7.",
      "no": "Cộng ba số rồi chia cho 3."
    },
    {
      "k": "choose",
      "t": "Cột cao nhất của biểu đồ cho biết điều gì?",
      "opts": [
        "Số lớn nhất",
        "Số bằng 0",
        "Số bé nhất"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Số lớn nhất.",
      "no": "Cột càng cao thì số càng lớn."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Trung bình cộng = tổng chia số số hạng",
        "Cột cao nhất là số lớn nhất"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Ba ngày bán 10, 20, 30 quyển. Mỗi ngày trung bình bán mấy quyển?",
      "opts": [
        "30",
        "20",
        "60"
      ],
      "ok": 1,
      "hint": "Tổng là 60, chia cho 3 ngày.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Tổ 1 hái 15 quả, tổ 2 hái 25 quả. Trung bình mỗi tổ hái?",
      "opts": [
        "20",
        "40",
        "10"
      ],
      "ok": 0,
      "hint": "Cộng hai số rồi chia cho 2.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Trong 10, 12, 14, số nào chính là trung bình cộng?",
      "opts": [
        "14",
        "12",
        "10"
      ],
      "ok": 1,
      "hint": "Trung bình cộng nằm ở giữa.",
      "yes": "Đúng rồi!"
    }
  ]
});
