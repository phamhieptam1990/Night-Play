/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Ôn tập và tính toán với phân số.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g5_fractions",
  "grade": 5,
  "subj": "toan",
  "title": "Ôn tập và tính toán với phân số",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Ôn tập và tính toán với phân số.",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Ôn tập phân số và các phép tính",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Vận dụng phân số trong bài toán",
      "art": "🔢"
    },
    {
      "k": "choose",
      "t": "Phân số nào bằng 1/3?",
      "opts": [
        "3/9",
        "4/6",
        "3/3"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 3/9.",
      "no": "Muốn có phân số bằng nhau: nhân (hoặc chia) cả tử và mẫu với CÙNG một số."
    },
    {
      "k": "choose",
      "t": "1/5 + 1/15 = ?",
      "opts": [
        "2/5",
        "2/15",
        "4/15"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 4/15.",
      "no": "“a/b của một số”: chia số đó cho b rồi nhân với a."
    },
    {
      "k": "choose",
      "t": "1/3 = ?/12",
      "opts": [
        "4",
        "1",
        "12"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 4.",
      "no": "Muốn có phân số bằng nhau: nhân (hoặc chia) cả tử và mẫu với CÙNG một số."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Ôn tập phân số và các phép tính",
        "Vận dụng phân số trong bài toán",
        "Tìm phân số của một số hoặc dạng toán liên quan theo nội dung lớp"
      ]
    }
  ],
  "tryit": [
    {
      "q": "2/5 của 25 là bao nhiêu?",
      "opts": [
        "10",
        "50",
        "5"
      ],
      "ok": 0,
      "hint": "“a/b của một số”: chia số đó cho b rồi nhân với a.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Phân số nào lớn nhất?",
      "opts": [
        "2/6",
        "1/5",
        "1/4"
      ],
      "ok": 0,
      "hint": "Muốn có phân số bằng nhau: nhân (hoặc chia) cả tử và mẫu với CÙNG một số.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "9/10 của 60 là bao nhiêu?",
      "opts": [
        "54",
        "55",
        "540"
      ],
      "ok": 0,
      "hint": "“a/b của một số”: chia số đó cho b rồi nhân với a.",
      "yes": "Đúng rồi!"
    }
  ]
});
