/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Làm quen với phân số.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g3_fraction_intro",
  "grade": 3,
  "subj": "toan",
  "title": "Làm quen với phân số",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Làm quen với phân số.",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Nhận biết phân số qua phần bằng nhau của đơn vị",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Đọc, viết phân số đơn giản",
      "art": "🔢"
    },
    {
      "k": "choose",
      "t": "1/3 của 15 là bao nhiêu?",
      "opts": [
        "5",
        "10",
        "45"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 5.",
      "no": "“a/b của một số”: chia số đó cho b rồi nhân với a."
    },
    {
      "k": "choose",
      "t": "1/5 của 45 là bao nhiêu?",
      "opts": [
        "10",
        "225",
        "9"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 9.",
      "no": "“a/b của một số”: chia số đó cho b rồi nhân với a."
    },
    {
      "k": "choose",
      "t": "1/2 của 12 là bao nhiêu?",
      "opts": [
        "24",
        "6",
        "5"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 6.",
      "no": "“a/b của một số”: chia số đó cho b rồi nhân với a."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Nhận biết phân số qua phần bằng nhau của đơn vị",
        "Đọc, viết phân số đơn giản",
        "Nhận biết ý nghĩa tử số và mẫu số ở mức độ ban đầu"
      ]
    }
  ],
  "tryit": [
    {
      "q": "1/3 của 21 là bao nhiêu?",
      "opts": [
        "7",
        "63",
        "14"
      ],
      "ok": 0,
      "hint": "“a/b của một số”: chia số đó cho b rồi nhân với a.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "1/3 của 24 là bao nhiêu?",
      "opts": [
        "72",
        "8",
        "9"
      ],
      "ok": 1,
      "hint": "“a/b của một số”: chia số đó cho b rồi nhân với a.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "1/5 của 15 là bao nhiêu?",
      "opts": [
        "75",
        "3",
        "12"
      ],
      "ok": 1,
      "hint": "“a/b của một số”: chia số đó cho b rồi nhân với a.",
      "yes": "Đúng rồi!"
    }
  ]
});
