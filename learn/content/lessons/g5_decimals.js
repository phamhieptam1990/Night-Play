/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Số thập phân và các phép tính.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g5_decimals",
  "grade": 5,
  "subj": "toan",
  "title": "Số thập phân và các phép tính",
  "screens": [
    {
      "k": "say",
      "t": "Số thập phân có phần nguyên và phần thập phân, ngăn cách bằng dấu phẩy.",
      "art": "12,35\n12 nguyên · 35 phần trăm"
    },
    {
      "k": "say",
      "t": "Cộng số thập phân: viết thẳng hàng dấu phẩy rồi cộng như số tự nhiên.",
      "art": "1,5 + 2,25\n= 3,75"
    },
    {
      "k": "say",
      "t": "Làm tròn đến hàng phần mười: nhìn chữ số hàng phần trăm.",
      "art": "3,47 → 3,5"
    },
    {
      "k": "choose",
      "t": "Trong 12,35 chữ số 3 ở hàng nào?",
      "opts": [
        "Phần mười",
        "Hàng chục",
        "Phần trăm"
      ],
      "ok": 0,
      "yes": "Đúng! 3 phần mười.",
      "no": "Hàng đứng ngay sau dấu phẩy có tên gọi riêng.",
      "art": "12,35"
    },
    {
      "k": "choose",
      "t": "1,5 + 2,25 = ?",
      "opts": [
        "3,75",
        "4,0",
        "3,3"
      ],
      "ok": 0,
      "yes": "Đúng! 3,75.",
      "no": "Viết thẳng hàng dấu phẩy: 1,50 + 2,25.",
      "art": "1,5 + 2,25"
    },
    {
      "k": "choose",
      "t": "Làm tròn 3,47 đến hàng phần mười được?",
      "opts": [
        "3,0",
        "3,5",
        "3,4"
      ],
      "ok": 1,
      "yes": "Đúng! 7 nên lên 3,5.",
      "no": "Nhìn chữ số hàng phần trăm: 7 thì lên.",
      "art": "3,47 ≈ ?"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Dấu phẩy ngăn phần nguyên và phần thập phân",
        "Cộng trừ: thẳng hàng dấu phẩy",
        "Làm tròn: nhìn hàng kề bên phải"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Số nào lớn nhất?",
      "opts": [
        "2,05",
        "2,15",
        "2,5"
      ],
      "ok": 2,
      "hint": "So phần nguyên, rồi so phần mười.",
      "yes": "Đúng! 2,5 lớn nhất.",
      "art": "? lớn nhất"
    },
    {
      "q": "x + 1,2 = 5. Tìm x.",
      "opts": [
        "6,2",
        "4,2",
        "3,8"
      ],
      "ok": 2,
      "hint": "Số hạng = tổng trừ số hạng kia.",
      "yes": "Đúng! 5 − 1,2 = 3,8.",
      "art": "x + 1,2 = 5"
    },
    {
      "q": "0,1 bằng phân số nào?",
      "opts": [
        "10/1",
        "1/100",
        "1/10"
      ],
      "ok": 2,
      "hint": "Phần mười là mẫu số 10.",
      "yes": "Đúng! 0,1 = 1/10.",
      "art": "0,1 = ?"
    }
  ]
});
