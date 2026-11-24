/* BẢN NHÁP TỰ SINH · Toán lớp 2 · Hình học.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g2_geometry",
  "grade": 2,
  "subj": "toan",
  "title": "Hình học",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Hình học.",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Nhận dạng và mô tả hình phẳng quen thuộc",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Đường thẳng, đường cong và đoạn thẳng ở mức độ phù hợp",
      "art": "📐"
    },
    {
      "k": "choose",
      "t": "Hình tứ giác có mấy cạnh?",
      "opts": [
        "4",
        "6",
        "3"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 4.",
      "no": "Đếm số cạnh và số góc của hình."
    },
    {
      "k": "choose",
      "t": "Hình vuông có mấy cạnh?",
      "opts": [
        "4",
        "5",
        "3"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 4.",
      "no": "Đếm số cạnh và số góc của hình."
    },
    {
      "k": "choose",
      "t": "⚽ có dạng khối gì?",
      "opts": [
        "khối cầu",
        "khối hộp chữ nhật",
        "khối lập phương"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là khối cầu.",
      "no": "Đếm số cạnh và số góc của hình."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Nhận dạng và mô tả hình phẳng quen thuộc",
        "Đường thẳng, đường cong và đoạn thẳng ở mức độ phù hợp",
        "Hình khối trong môi trường xung quanh"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Hình chữ nhật có mấy cạnh?",
      "opts": [
        "4",
        "5",
        "3"
      ],
      "ok": 0,
      "hint": "Đếm số cạnh và số góc của hình.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Hình tam giác có mấy cạnh?",
      "opts": [
        "5",
        "4",
        "3"
      ],
      "ok": 2,
      "hint": "Đếm số cạnh và số góc của hình.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "📦 có dạng khối gì?",
      "opts": [
        "khối lập phương",
        "khối cầu",
        "khối hộp chữ nhật"
      ],
      "ok": 2,
      "hint": "Đếm số cạnh và số góc của hình.",
      "yes": "Đúng rồi!"
    }
  ]
});
