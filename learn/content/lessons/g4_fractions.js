/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Phân số.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g4_fractions",
  "grade": 4,
  "subj": "toan",
  "title": "Phân số",
  "screens": [
    {
      "k": "say",
      "t": "Phân số bằng nhau: nhân hoặc chia cả tử và mẫu với CÙNG một số.",
      "art": "1/2 = 2/4 = 4/8"
    },
    {
      "k": "say",
      "t": "Rút gọn: chia cả tử và mẫu cho cùng một số. Cộng phân số cùng mẫu: cộng tử, giữ mẫu.",
      "art": "2/6 = 1/3\n1/5 + 2/5 = 3/5"
    },
    {
      "k": "say",
      "t": "a/b của một số: chia số đó cho b rồi nhân với a.",
      "art": "3/4 của 20\n20 ÷ 4 × 3 = 15"
    },
    {
      "k": "choose",
      "t": "Phân số nào bằng 4/5?",
      "opts": [
        "6/7",
        "8/5",
        "8/10"
      ],
      "ok": 2,
      "yes": "Đúng! Nhân đôi cả tử và mẫu.",
      "no": "Nhân cả tử và mẫu với cùng một số.",
      "art": "4/5 = ?"
    },
    {
      "k": "choose",
      "t": "1/4 = ?/12",
      "opts": [
        "3",
        "4",
        "1"
      ],
      "ok": 0,
      "yes": "Đúng! Nhân cả hai với 3.",
      "no": "Mẫu nhân với mấy để được 12?",
      "art": "1/4 = ?/12"
    },
    {
      "k": "choose",
      "t": "5/12 + 6/12 = ?",
      "opts": [
        "11/12",
        "11/24",
        "12/12"
      ],
      "ok": 0,
      "yes": "Đúng! 5 + 6 = 11, mẫu giữ 12.",
      "no": "Cùng mẫu: cộng tử số, giữ nguyên mẫu.",
      "art": "5/12 + 6/12"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Phân số bằng nhau: nhân hoặc chia cả tử và mẫu cho cùng số",
        "Cùng mẫu: cộng hoặc trừ tử, giữ mẫu",
        "a/b của một số: chia cho b rồi nhân a"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Rút gọn 6/8 được?",
      "opts": [
        "6/4",
        "3/4",
        "2/3"
      ],
      "ok": 1,
      "hint": "Chia cả tử và mẫu cho cùng một số.",
      "yes": "Đúng! Chia cả hai cho 2.",
      "art": "6/8"
    },
    {
      "q": "3/4 của 20 là?",
      "opts": [
        "80",
        "5",
        "15"
      ],
      "ok": 2,
      "hint": "Chia 20 cho 4, rồi nhân với 3.",
      "yes": "Đúng! 20 ÷ 4 × 3 = 15.",
      "art": "3/4 của 20"
    },
    {
      "q": "9/10 − 4/10 = ?",
      "opts": [
        "5/0",
        "5/10",
        "13/10"
      ],
      "ok": 1,
      "hint": "Cùng mẫu: trừ tử số, giữ mẫu.",
      "yes": "Đúng! 9 − 4 = 5.",
      "art": "9/10 − 4/10"
    }
  ]
});
