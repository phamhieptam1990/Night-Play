/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Đại lượng và đo lường.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g4_measurement",
  "grade": 4,
  "subj": "toan",
  "title": "Đại lượng và đo lường",
  "screens": [
    {
      "k": "say",
      "t": "Chu vi: cộng độ dài các cạnh. Diện tích chữ nhật = dài × rộng.",
      "art": "Dài 8, rộng 5\nChu vi 26 · Diện tích 40"
    },
    {
      "k": "say",
      "t": "Đổi đơn vị: 1 tấn = 1000 kg, 1 giờ = 60 phút, 1 m² = 10 000 cm².",
      "art": "1 tấn = 1000 kg"
    },
    {
      "k": "say",
      "t": "Thời gian và tiền: tính từng bước, ghi rõ đơn vị.",
      "art": "2 giờ 30 phút = 150 phút"
    },
    {
      "k": "choose",
      "t": "Chữ nhật dài 8 cm, rộng 5 cm. Chu vi là?",
      "opts": [
        "13 cm",
        "40 cm",
        "26 cm"
      ],
      "ok": 2,
      "yes": "Đúng! (8 + 5) × 2 = 26.",
      "no": "Cộng dài và rộng rồi nhân 2.",
      "art": "8 × 5"
    },
    {
      "k": "choose",
      "t": "Chữ nhật dài 8 cm, rộng 5 cm. Diện tích là?",
      "opts": [
        "40 cm²",
        "26 cm²",
        "13 cm²"
      ],
      "ok": 0,
      "yes": "Đúng! 8 × 5 = 40.",
      "no": "Nhân dài với rộng.",
      "art": "8 × 5"
    },
    {
      "k": "choose",
      "t": "3 tấn bằng bao nhiêu ki-lô-gam?",
      "opts": [
        "300 kg",
        "3 000 kg",
        "30 kg"
      ],
      "ok": 1,
      "yes": "Đúng! 3 000 kg.",
      "no": "1 tấn là 1000 kg.",
      "art": "3 tấn = ? kg"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Chu vi cộng các cạnh, diện tích nhân dài với rộng",
        "1 tấn = 1000 kg, 1 giờ = 60 phút",
        "Tính từng bước và ghi đúng đơn vị"
      ]
    }
  ],
  "tryit": [
    {
      "q": "2 giờ 30 phút bằng bao nhiêu phút?",
      "opts": [
        "230 phút",
        "90 phút",
        "150 phút"
      ],
      "ok": 2,
      "hint": "Đổi 2 giờ ra phút rồi cộng 30.",
      "yes": "Đúng! 120 + 30 = 150.",
      "art": "2 giờ 30 phút"
    },
    {
      "q": "Mua 3 quyển vở, mỗi quyển 7 500 đồng. Hết bao nhiêu?",
      "opts": [
        "10 500 đồng",
        "21 500 đồng",
        "22 500 đồng"
      ],
      "ok": 2,
      "hint": "3 quyển giá bằng nhau: nhân.",
      "yes": "Đúng! 7 500 × 3 = 22 500.",
      "art": "7 500 × 3"
    },
    {
      "q": "Đi từ 7 giờ 15 phút đến 8 giờ. Đi mấy phút?",
      "opts": [
        "45 phút",
        "15 phút",
        "55 phút"
      ],
      "ok": 0,
      "hint": "Từ 7 giờ 15 phút đến 8 giờ còn thiếu bao nhiêu?",
      "yes": "Đúng! 45 phút.",
      "art": "7:15 → 8:00"
    }
  ]
});
