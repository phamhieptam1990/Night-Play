/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Số tự nhiên và cấu tạo thập phân.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g4_large_numbers",
  "grade": 4,
  "subj": "toan",
  "title": "Số tự nhiên và cấu tạo thập phân",
  "screens": [
    {
      "k": "say",
      "t": "Số lớn chia thành lớp: lớp đơn vị, lớp nghìn, lớp triệu. Mỗi lớp có 3 hàng.",
      "art": "123 456 789\ntriệu · nghìn · đơn vị"
    },
    {
      "k": "say",
      "t": "Mỗi chữ số có giá trị theo hàng của nó. Trong 673 849, chữ số 7 chỉ 70 nghìn.",
      "art": "673 849\n7 → 70 000"
    },
    {
      "k": "say",
      "t": "Làm tròn đến hàng nghìn: nhìn chữ số hàng trăm. Từ 5 trở lên thì lên.",
      "art": "12 121 → 12 000"
    },
    {
      "k": "choose",
      "t": "Trong số 673 849, chữ số 9 có giá trị là?",
      "opts": [
        "90",
        "9",
        "900"
      ],
      "ok": 1,
      "yes": "Đúng! Giá trị là 9.",
      "no": "9 đứng ở hàng cuối cùng, hàng đơn vị.",
      "art": "673 849"
    },
    {
      "k": "choose",
      "t": "Trong số 248 596, chữ số 4 có giá trị là?",
      "opts": [
        "40 000",
        "4 000",
        "400"
      ],
      "ok": 0,
      "yes": "Đúng! 40 000.",
      "no": "4 đứng ở hàng chục nghìn.",
      "art": "248 596"
    },
    {
      "k": "choose",
      "t": "Làm tròn 12 121 đến hàng nghìn được?",
      "opts": [
        "13 000",
        "12 000",
        "12 100"
      ],
      "ok": 1,
      "yes": "Đúng! Hàng trăm là 1 nên giữ.",
      "no": "Hàng trăm là 1, bé hơn 5.",
      "art": "12 121 ≈ ?"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Số lớn chia lớp, mỗi lớp 3 hàng",
        "Giá trị chữ số phụ thuộc hàng",
        "Làm tròn: nhìn hàng kề bên phải"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Số nào lớn nhất?",
      "opts": [
        "5 090 000",
        "905 000",
        "590 000"
      ],
      "ok": 0,
      "hint": "Số nào có nhiều chữ số hơn thì lớn hơn.",
      "yes": "Đúng! Có 7 chữ số.",
      "art": "? lớn nhất"
    },
    {
      "q": "Mỗi lớp có mấy hàng?",
      "opts": [
        "3 hàng",
        "4 hàng",
        "2 hàng"
      ],
      "ok": 0,
      "hint": "Lớp đơn vị gồm đơn vị, chục, trăm.",
      "yes": "Đúng! Mỗi lớp 3 hàng.",
      "art": "lớp = ? hàng"
    },
    {
      "q": "Số 3 triệu 5 trăm nghìn viết là?",
      "opts": [
        "35 000 000",
        "3 500 000",
        "3 050 000"
      ],
      "ok": 1,
      "hint": "3 triệu = 3 000 000; thêm 500 000.",
      "yes": "Đúng! 3 500 000.",
      "art": "3 triệu 5 trăm nghìn"
    }
  ]
});
