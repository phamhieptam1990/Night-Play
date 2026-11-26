/* BẢN NHÁP TỰ SINH · Toán lớp 2 · Dữ liệu và phân loại.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g2_data",
  "grade": 2,
  "subj": "toan",
  "title": "Dữ liệu và phân loại",
  "screens": [
    {
      "k": "say",
      "t": "Phân loại: xếp các vật giống nhau vào cùng một nhóm.",
      "art": "🍎🍎 🍌🍌🍌 🍇"
    },
    {
      "k": "say",
      "t": "Đếm số lượng mỗi nhóm rồi ghi vào bảng.",
      "art": "Táo: 2\nChuối: 3\nNho: 1"
    },
    {
      "k": "say",
      "t": "Nhìn bảng: số lớn nhất là nhiều nhất, số bé nhất là ít nhất.",
      "art": "Nhiều nhất: Chuối"
    },
    {
      "k": "choose",
      "t": "Bảng: Táo 2, Chuối 3, Nho 1. Quả nào nhiều nhất?",
      "opts": [
        "Nho",
        "Chuối",
        "Táo"
      ],
      "ok": 1,
      "yes": "Đúng! 3 là lớn nhất.",
      "no": "Tìm số lớn nhất.",
      "art": "Táo 2 · Chuối 3 · Nho 1"
    },
    {
      "k": "choose",
      "t": "Bảng: Táo 2, Chuối 3, Nho 1. Quả nào ít nhất?",
      "opts": [
        "Táo",
        "Nho",
        "Chuối"
      ],
      "ok": 1,
      "yes": "Đúng! 1 là bé nhất.",
      "no": "Tìm số bé nhất.",
      "art": "Táo 2 · Chuối 3 · Nho 1"
    },
    {
      "k": "choose",
      "t": "Có 🐶🐶🐱🐱🐱. Có mấy con mèo?",
      "opts": [
        "2",
        "5",
        "3"
      ],
      "ok": 2,
      "yes": "Đúng! Có 3 con mèo.",
      "no": "Chỉ đếm 🐱.",
      "art": "🐶🐶🐱🐱🐱"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Phân loại: xếp vật giống nhau vào một nhóm",
        "Đếm từng nhóm rồi ghi vào bảng",
        "Số lớn nhất là nhiều nhất"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Chó 4 con, mèo 6 con. Mèo nhiều hơn chó mấy con?",
      "opts": [
        "4",
        "10",
        "2"
      ],
      "ok": 2,
      "hint": "Hơn bao nhiêu thì lấy số lớn trừ số bé.",
      "yes": "Đúng! 6 − 4 = 2.",
      "art": "4 🐶  6 🐱"
    },
    {
      "q": "Xe đạp và ô tô, vật nào đi trên đường nhiều bánh hơn?",
      "opts": [
        "Ô tô",
        "Bằng nhau",
        "Xe đạp"
      ],
      "ok": 0,
      "hint": "Đếm số bánh của từng xe.",
      "yes": "Đúng! Ô tô có 4 bánh.",
      "art": "🚲 ? 🚗"
    },
    {
      "q": "Cam 5, quýt 3. Cả hai có bao nhiêu quả?",
      "opts": [
        "15",
        "2",
        "8"
      ],
      "ok": 2,
      "hint": "Gộp lại là cộng.",
      "yes": "Đúng! 5 + 3 = 8.",
      "art": "5 + 3"
    }
  ]
});
