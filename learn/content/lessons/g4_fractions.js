/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Phân số.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g4_fractions",
  "grade": 4,
  "subj": "toan",
  "title": "Phân số",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Phân số.",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Nhận biết, đọc, viết và biểu diễn phân số",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Phân số bằng nhau và rút gọn hoặc quy đồng theo nội dung lớp",
      "art": "🔢"
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
      "yes": "Đúng rồi! Đáp án là 8/10.",
      "no": "Muốn có phân số bằng nhau: nhân (hoặc chia) cả tử và mẫu với CÙNG một số."
    },
    {
      "k": "choose",
      "t": "5/12 + 6/12 = ?",
      "opts": [
        "11/12",
        "12/12",
        "11/24"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 11/12.",
      "no": "“a/b của một số”: chia số đó cho b rồi nhân với a."
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
      "yes": "Đúng rồi! Đáp án là 3.",
      "no": "Muốn có phân số bằng nhau: nhân (hoặc chia) cả tử và mẫu với CÙNG một số."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Nhận biết, đọc, viết và biểu diễn phân số",
        "Phân số bằng nhau và rút gọn hoặc quy đồng theo nội dung lớp",
        "So sánh phân số"
      ]
    }
  ],
  "tryit": [
    {
      "q": "4/11 + 4/11 = ?",
      "opts": [
        "8/22",
        "8/11",
        "9/11"
      ],
      "ok": 1,
      "hint": "“a/b của một số”: chia số đó cho b rồi nhân với a.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Phân số nào bằng 1/4?",
      "opts": [
        "4/7",
        "3/4",
        "3/12"
      ],
      "ok": 2,
      "hint": "Muốn có phân số bằng nhau: nhân (hoặc chia) cả tử và mẫu với CÙNG một số.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "5/8 + 2/8 = ?",
      "opts": [
        "5/8",
        "7/8",
        "7/16"
      ],
      "ok": 1,
      "hint": "“a/b của một số”: chia số đó cho b rồi nhân với a.",
      "yes": "Đúng rồi!"
    }
  ]
});
