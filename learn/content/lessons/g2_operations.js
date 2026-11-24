/* BẢN NHÁP TỰ SINH · Toán lớp 2 · Các phép tính với số tự nhiên.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g2_operations",
  "grade": 2,
  "subj": "toan",
  "title": "Các phép tính với số tự nhiên",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Các phép tính với số tự nhiên.",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Cộng, trừ trong phạm vi 1000",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Bảng nhân và bảng chia được học ở lớp 2",
      "art": "🔢"
    },
    {
      "k": "choose",
      "t": "60 + 36 − 16 = ?",
      "opts": [
        "8",
        "112",
        "80"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 80.",
      "no": "Làm trong ngoặc trước, rồi nhân, chia, cuối cùng cộng, trừ (từ trái sang phải)."
    },
    {
      "k": "choose",
      "t": "2 × ? = 16",
      "opts": [
        "8",
        "14",
        "9"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 8.",
      "no": "Dùng phép tính NGƯỢC: cộng thì dùng trừ, nhân thì dùng chia."
    },
    {
      "k": "choose",
      "t": "69 + 11 = ?",
      "opts": [
        "80",
        "90",
        "81"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 80.",
      "no": "Đọc kỹ đề, làm từng bước rồi thử lại nhé."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Cộng, trừ trong phạm vi 1000",
        "Bảng nhân và bảng chia được học ở lớp 2",
        "Ý nghĩa phép nhân và phép chia"
      ]
    }
  ],
  "tryit": [
    {
      "q": "2 × 2 = ?",
      "opts": [
        "6",
        "5",
        "4"
      ],
      "ok": 2,
      "hint": "Đọc kỹ đề, làm từng bước rồi thử lại nhé.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "44 − 38 + 9 = ?",
      "opts": [
        "14",
        "91",
        "15"
      ],
      "ok": 2,
      "hint": "Làm trong ngoặc trước, rồi nhân, chia, cuối cùng cộng, trừ (từ trái sang phải).",
      "yes": "Đúng rồi!"
    },
    {
      "q": "? + 26 = 55",
      "opts": [
        "81",
        "29",
        "30"
      ],
      "ok": 1,
      "hint": "Dùng phép tính NGƯỢC: cộng thì dùng trừ, nhân thì dùng chia.",
      "yes": "Đúng rồi!"
    }
  ]
});
