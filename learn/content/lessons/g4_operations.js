/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Các phép tính với số tự nhiên.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g4_operations",
  "grade": 4,
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
      "t": "Cộng, trừ số tự nhiên",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Nhân với số có nhiều chữ số",
      "art": "🔢"
    },
    {
      "k": "choose",
      "t": "(3 − 2) × 2 = ?",
      "opts": [
        "2",
        "3",
        "4"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 2.",
      "no": "Làm trong ngoặc trước, rồi nhân, chia, cuối cùng cộng, trừ (từ trái sang phải)."
    },
    {
      "k": "choose",
      "t": "? + 4306 = 5438",
      "opts": [
        "1133",
        "9744",
        "1132"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 1132.",
      "no": "Dùng phép tính NGƯỢC: cộng thì dùng trừ, nhân thì dùng chia."
    },
    {
      "k": "choose",
      "t": "17 × 7 = ?",
      "opts": [
        "109",
        "129",
        "119"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 119.",
      "no": "Đọc kỹ đề, làm từng bước rồi thử lại nhé."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Cộng, trừ số tự nhiên",
        "Nhân với số có nhiều chữ số",
        "Chia cho số có nhiều chữ số theo nội dung lớp"
      ]
    }
  ],
  "tryit": [
    {
      "q": "(19 + 17) × 2 = ?",
      "opts": [
        "72",
        "73",
        "53"
      ],
      "ok": 0,
      "hint": "Làm trong ngoặc trước, rồi nhân, chia, cuối cùng cộng, trừ (từ trái sang phải).",
      "yes": "Đúng rồi!"
    },
    {
      "q": "? ÷ 5 = 19",
      "opts": [
        "96",
        "95",
        "14"
      ],
      "ok": 1,
      "hint": "Dùng phép tính NGƯỢC: cộng thì dùng trừ, nhân thì dùng chia.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "17 × 3 = ?",
      "opts": [
        "61",
        "41",
        "51"
      ],
      "ok": 2,
      "hint": "Đọc kỹ đề, làm từng bước rồi thử lại nhé.",
      "yes": "Đúng rồi!"
    }
  ]
});
