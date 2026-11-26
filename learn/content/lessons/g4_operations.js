/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Các phép tính với số tự nhiên.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g4_operations",
  "grade": 4,
  "subj": "toan",
  "title": "Các phép tính với số tự nhiên",
  "screens": [
    {
      "k": "say",
      "t": "Nhân số lớn: nhân từng hàng, nhớ sang hàng bên trái.",
      "art": "97 × 5\n7×5=35 viết 5 nhớ 3"
    },
    {
      "k": "say",
      "t": "Biểu thức: ngoặc trước, rồi nhân chia, cuối cùng cộng trừ.",
      "art": "291 + 11 × 6\n= 291 + 66"
    },
    {
      "k": "say",
      "t": "Tìm lỗi: thử tính lại từng bước, so với kết quả.",
      "art": "285 ÷ 3 = 95"
    },
    {
      "k": "choose",
      "t": "97 × 5 = ?",
      "opts": [
        "485",
        "475",
        "585"
      ],
      "ok": 0,
      "yes": "Đúng! 485.",
      "no": "7 × 5 = 35 viết 5 nhớ 3; 9 × 5 = 45 cộng 3.",
      "art": "97 × 5"
    },
    {
      "k": "choose",
      "t": "285 ÷ 3 = ?",
      "opts": [
        "85",
        "105",
        "95"
      ],
      "ok": 2,
      "yes": "Đúng! 95.",
      "no": "Chia từng hàng: 28 chia 3 được 9.",
      "art": "285 ÷ 3"
    },
    {
      "k": "choose",
      "t": "24 + 6 × 5 = ?",
      "opts": [
        "150",
        "35",
        "54"
      ],
      "ok": 2,
      "yes": "Đúng! 6 × 5 = 30, rồi 24 + 30.",
      "no": "Làm phép nhân trước.",
      "art": "24 + 6 × 5"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Nhân: nhân từng hàng rồi cộng phần nhớ",
        "Ngoặc trước, nhân chia rồi mới cộng trừ",
        "Tìm lỗi bằng cách tính lại từng bước"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Mỗi thùng 48 chai. 6 thùng có bao nhiêu chai?",
      "opts": [
        "288",
        "54",
        "238"
      ],
      "ok": 0,
      "hint": "Các thùng như nhau: dùng phép nhân.",
      "yes": "Đúng! 48 × 6 = 288.",
      "art": "48 × 6"
    },
    {
      "q": "x − 15 = 40. Tìm x.",
      "opts": [
        "600",
        "55",
        "25"
      ],
      "ok": 1,
      "hint": "Số bị trừ = hiệu + số trừ.",
      "yes": "Đúng! 40 + 15 = 55.",
      "art": "x − 15 = 40"
    },
    {
      "q": "Bạn Nam tính 12 × 5 = 50. Kết quả đúng là?",
      "opts": [
        "17",
        "70",
        "60"
      ],
      "ok": 2,
      "hint": "Tính lại: 12 × 5 là 10 × 5 cộng 2 × 5.",
      "yes": "Đúng! 50 + 10 = 60.",
      "art": "12 × 5"
    }
  ]
});
