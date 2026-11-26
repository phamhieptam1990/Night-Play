/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Làm quen với phân số.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g3_fraction_intro",
  "grade": 3,
  "subj": "toan",
  "title": "Làm quen với phân số",
  "screens": [
    {
      "k": "say",
      "t": "Chia hình thành các phần bằng nhau. Lấy 1 trong 4 phần là một phần tư: 1/4.",
      "art": "🍕\n1/4"
    },
    {
      "k": "say",
      "t": "Phân số có tử số và mẫu số. Mẫu cho biết chia mấy phần, tử cho biết lấy mấy phần.",
      "art": "3/4\ntử = 3 · mẫu = 4"
    },
    {
      "k": "say",
      "t": "1/3 của 12 là: chia 12 cho 3.",
      "art": "12 ÷ 3 = 4\n1/3 của 12 = 4"
    },
    {
      "k": "choose",
      "t": "Chia chiếc bánh thành 4 phần bằng nhau, lấy 1 phần. Là phân số nào?",
      "opts": [
        "1/4",
        "1/2",
        "4/1"
      ],
      "ok": 0,
      "yes": "Đúng! 1/4.",
      "no": "Mẫu là số phần bằng nhau cả bánh được chia.",
      "art": "🍕"
    },
    {
      "k": "choose",
      "t": "Trong phân số 3/4, mẫu số là?",
      "opts": [
        "3",
        "7",
        "4"
      ],
      "ok": 2,
      "yes": "Đúng! Mẫu số là 4.",
      "no": "Mẫu số nằm dưới gạch ngang.",
      "art": "3/4"
    },
    {
      "k": "choose",
      "t": "1/3 của 12 là?",
      "opts": [
        "9",
        "4",
        "3"
      ],
      "ok": 1,
      "yes": "Đúng! 12 ÷ 3 = 4.",
      "no": "Chia 12 làm 3 phần bằng nhau.",
      "art": "1/3 của 12"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Mẫu: chia mấy phần. Tử: lấy mấy phần",
        "1/b của một số: chia số đó cho b",
        "Cùng tử số, mẫu càng nhỏ thì phân số càng lớn"
      ]
    }
  ],
  "tryit": [
    {
      "q": "1/2 của 10 là?",
      "opts": [
        "5",
        "2",
        "20"
      ],
      "ok": 0,
      "hint": "Một nửa là chia đôi.",
      "yes": "Đúng! 10 ÷ 2 = 5.",
      "art": "1/2 của 10"
    },
    {
      "q": "Phân số nào lớn nhất?",
      "opts": [
        "1/4",
        "1/2",
        "1/3"
      ],
      "ok": 1,
      "hint": "Cùng tử 1: mẫu càng nhỏ, mỗi phần càng to.",
      "yes": "Đúng! Chia ít phần thì mỗi phần to hơn.",
      "art": "1/2  1/3  1/4"
    },
    {
      "q": "1/5 của 20 là?",
      "opts": [
        "5",
        "4",
        "15"
      ],
      "ok": 1,
      "hint": "Chia 20 làm 5 phần bằng nhau.",
      "yes": "Đúng! 20 ÷ 5 = 4.",
      "art": "1/5 của 20"
    }
  ]
});
