/* BẢN NHÁP TỰ SINH · Toán lớp 2 · Số tự nhiên trong phạm vi 1000.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g2_numbers_1000",
  "grade": 2,
  "subj": "toan",
  "title": "Số tự nhiên trong phạm vi 1000",
  "screens": [
    {
      "k": "say",
      "t": "Số 732 có 7 trăm, 3 chục và 2 đơn vị. Mỗi chữ số đứng ở một hàng.",
      "art": "7 trăm\n3 chục\n2 đơn vị"
    },
    {
      "k": "say",
      "t": "Làm tròn đến hàng chục: nhìn hàng đơn vị. Từ 0 đến 4 giữ chục, từ 5 đến 9 thì lên.",
      "art": "78 → 80\n63 → 60"
    },
    {
      "k": "say",
      "t": "Dãy số có quy luật: xem mỗi số hơn số đứng trước bao nhiêu.",
      "art": "5, 10, 15, 20, ?"
    },
    {
      "k": "choose",
      "t": "Chữ số hàng chục của số 732 là?",
      "opts": [
        "7",
        "3",
        "2"
      ],
      "ok": 1,
      "yes": "Đúng! 732 có 3 chục.",
      "no": "Đọc từ trái sang phải: hàng trăm, hàng chục, hàng đơn vị.",
      "art": "732"
    },
    {
      "k": "choose",
      "t": "Chữ số hàng trăm của số 485 là?",
      "opts": [
        "4",
        "8",
        "5"
      ],
      "ok": 0,
      "yes": "Đúng! 485 có 4 trăm.",
      "no": "Chữ số đứng đầu của số có ba chữ số thuộc hàng nào?",
      "art": "485"
    },
    {
      "k": "choose",
      "t": "Làm tròn 78 đến hàng chục được số nào?",
      "opts": [
        "90",
        "80",
        "70"
      ],
      "ok": 1,
      "yes": "Đúng! Hàng đơn vị là 8 nên lên chục.",
      "no": "Nhìn hàng đơn vị: nó là 5 trở lên hay bé hơn 5?",
      "art": "78 ≈ ?"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Số có ba chữ số có hàng trăm, chục, đơn vị",
        "Đơn vị từ 5 trở lên thì làm tròn lên chục",
        "Dãy số: tìm số hơn kém giữa hai số liền nhau"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Làm tròn 63 đến hàng chục được số nào?",
      "opts": [
        "50",
        "60",
        "70"
      ],
      "ok": 1,
      "hint": "Nhìn hàng đơn vị: nó là 5 trở lên hay bé hơn 5?",
      "yes": "Đúng! Hàng đơn vị là 3 nên giữ chục.",
      "art": "63 ≈ ?"
    },
    {
      "q": "3 trăm 4 chục 1 đơn vị viết thành số nào?",
      "opts": [
        "431",
        "314",
        "341"
      ],
      "ok": 2,
      "hint": "Viết lần lượt hàng trăm, hàng chục, hàng đơn vị.",
      "yes": "Đúng! Viết 3, 4, 1 thành 341.",
      "art": "3 trăm 4 chục 1 đv"
    },
    {
      "q": "Số tiếp theo của dãy 5, 10, 15, 20 là?",
      "opts": [
        "30",
        "25",
        "24"
      ],
      "ok": 1,
      "hint": "Tìm xem mỗi số hơn số trước bao nhiêu.",
      "yes": "Đúng! Mỗi số hơn số trước 5.",
      "art": "5, 10, 15, 20, ?"
    }
  ]
});
