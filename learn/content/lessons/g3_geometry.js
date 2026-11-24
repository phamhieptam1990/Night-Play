/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Hình học phẳng và hình khối.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g3_geometry",
  "grade": 3,
  "subj": "toan",
  "title": "Hình học phẳng và hình khối",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Hình học phẳng và hình khối.",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Góc vuông và góc không vuông",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Các yếu tố của hình tam giác, tứ giác và hình đã học",
      "art": "📐"
    },
    {
      "k": "choose",
      "t": "Hình tam giác có mấy góc?",
      "opts": [
        "2",
        "4",
        "3"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 3.",
      "no": "Góc vuông giống góc của tờ giấy. So sánh góc với góc vuông."
    },
    {
      "k": "choose",
      "t": "Hình vuông có cạnh 7 cm. Chu vi hình vuông là?",
      "opts": [
        "28 cm",
        "11 cm",
        "49 cm"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 28 cm.",
      "no": "Chu vi là độ dài đi MỘT VÒNG quanh hình."
    },
    {
      "k": "choose",
      "t": "Hình vuông có mấy góc vuông?",
      "opts": [
        "4",
        "5",
        "3"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 4.",
      "no": "Góc vuông giống góc của tờ giấy. So sánh góc với góc vuông."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Góc vuông và góc không vuông",
        "Các yếu tố của hình tam giác, tứ giác và hình đã học",
        "Chu vi một số hình"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Hình vuông có cạnh 3 cm. Chu vi hình vuông là?",
      "opts": [
        "6 cm",
        "7 cm",
        "12 cm"
      ],
      "ok": 2,
      "hint": "Chu vi là độ dài đi MỘT VÒNG quanh hình.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Hình chữ nhật có mấy góc vuông?",
      "opts": [
        "5",
        "4",
        "2"
      ],
      "ok": 1,
      "hint": "Góc vuông giống góc của tờ giấy. So sánh góc với góc vuông.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Hình chữ nhật dài 14 cm, rộng 4 cm. Chu vi là?",
      "opts": [
        "36 cm",
        "18 cm",
        "22 cm"
      ],
      "ok": 0,
      "hint": "Chu vi là độ dài đi MỘT VÒNG quanh hình.",
      "yes": "Đúng rồi!"
    }
  ]
});
