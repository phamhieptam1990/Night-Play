/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Ôn tập và tính toán với phân số.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g5_fractions",
  "grade": 5,
  "subj": "toan",
  "title": "Ôn tập và tính toán với phân số",
  "screens": [
    {
      "k": "say",
      "t": "Cộng phân số khác mẫu: quy đồng mẫu số trước, rồi cộng tử số.",
      "art": "1/5 + 1/15\n= 3/15 + 1/15 = 4/15"
    },
    {
      "k": "say",
      "t": "Phân số bằng nhau: nhân hoặc chia cả tử và mẫu với cùng một số khác 0.",
      "art": "2/3 = 4/6 = 6/9"
    },
    {
      "k": "say",
      "t": "Phân số của một số: chia cho mẫu, nhân với tử.",
      "art": "2/5 của 30\n30 ÷ 5 × 2 = 12"
    },
    {
      "k": "choose",
      "t": "1/5 + 1/15 = ?",
      "opts": [
        "4/15",
        "2/15",
        "2/20"
      ],
      "ok": 0,
      "yes": "Đúng! 3/15 + 1/15 = 4/15.",
      "no": "Quy đồng: đưa 1/5 về mẫu 15 rồi cộng tử.",
      "art": "1/5 + 1/15"
    },
    {
      "k": "choose",
      "t": "1/2 + 1/3 = ?",
      "opts": [
        "1/6",
        "2/5",
        "5/6"
      ],
      "ok": 2,
      "yes": "Đúng! 3/6 + 2/6 = 5/6.",
      "no": "Mẫu chung của 2 và 3 là 6.",
      "art": "1/2 + 1/3"
    },
    {
      "k": "choose",
      "t": "Phân số nào bằng 2/3?",
      "opts": [
        "4/6",
        "3/4",
        "2/6"
      ],
      "ok": 0,
      "yes": "Đúng! Nhân cả hai với 2.",
      "no": "Nhân cả tử và mẫu với cùng một số.",
      "art": "2/3 = ?"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Khác mẫu: quy đồng rồi mới cộng trừ",
        "Phân số bằng nhau: nhân hoặc chia cả tử và mẫu",
        "a/b của một số: chia cho b rồi nhân a"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Rút gọn 12/18 được?",
      "opts": [
        "2/3",
        "6/9",
        "3/2"
      ],
      "ok": 0,
      "hint": "Chia cả tử và mẫu cho số lớn nhất có thể (6).",
      "yes": "Đúng! 12 ÷ 6 = 2 và 18 ÷ 6 = 3.",
      "art": "12/18"
    },
    {
      "q": "2/5 của 30 là?",
      "opts": [
        "12",
        "6",
        "75"
      ],
      "ok": 0,
      "hint": "Chia 30 cho 5 rồi nhân với 2.",
      "yes": "Đúng! 30 ÷ 5 × 2 = 12.",
      "art": "2/5 của 30"
    },
    {
      "q": "3/4 − 1/2 = ?",
      "opts": [
        "1/4",
        "2/2",
        "2/4"
      ],
      "ok": 0,
      "hint": "Đổi 1/2 thành phân số mẫu 4 rồi trừ.",
      "yes": "Đúng! 3/4 − 2/4 = 1/4.",
      "art": "3/4 − 1/2"
    }
  ]
});
