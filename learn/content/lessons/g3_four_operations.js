/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Bốn phép tính với số tự nhiên.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g3_four_operations",
  "grade": 3,
  "subj": "toan",
  "title": "Bốn phép tính với số tự nhiên",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Bốn phép tính với số tự nhiên.",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Cộng, trừ các số trong phạm vi học tập",
      "art": "🔢"
    },
    {
      "k": "say",
      "t": "Nhân số có nhiều chữ số với số có một chữ số",
      "art": "🔢"
    },
    {
      "k": "choose",
      "t": "17 + 2 × 9 = ?",
      "opts": [
        "171",
        "35",
        "36"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 35.",
      "no": "Làm trong ngoặc trước, rồi nhân, chia, cuối cùng cộng, trừ (từ trái sang phải)."
    },
    {
      "k": "choose",
      "t": "? ÷ 6 = 6",
      "opts": [
        "12",
        "36",
        "0"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 36.",
      "no": "Dùng phép tính NGƯỢC: cộng thì dùng trừ, nhân thì dùng chia."
    },
    {
      "k": "choose",
      "t": "7 × 8 = ?",
      "opts": [
        "56",
        "49",
        "63"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 56.",
      "no": "Đọc kỹ đề, làm từng bước rồi thử lại nhé."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Cộng, trừ các số trong phạm vi học tập",
        "Nhân số có nhiều chữ số với số có một chữ số",
        "Chia số có nhiều chữ số cho số có một chữ số"
      ]
    }
  ],
  "tryit": [
    {
      "q": "42 ÷ 7 = ?",
      "opts": [
        "7",
        "6",
        "35"
      ],
      "ok": 1,
      "hint": "Đọc kỹ đề, làm từng bước rồi thử lại nhé.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "44 + 3 × 5 = ?",
      "opts": [
        "59",
        "235",
        "58"
      ],
      "ok": 0,
      "hint": "Làm trong ngoặc trước, rồi nhân, chia, cuối cùng cộng, trừ (từ trái sang phải).",
      "yes": "Đúng rồi!"
    },
    {
      "q": "? ÷ 5 = 18",
      "opts": [
        "13",
        "90",
        "91"
      ],
      "ok": 1,
      "hint": "Dùng phép tính NGƯỢC: cộng thì dùng trừ, nhân thì dùng chia.",
      "yes": "Đúng rồi!"
    }
  ]
});
