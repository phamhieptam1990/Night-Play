/* BẢN NHÁP TỰ SINH · Toán lớp 2 · Đại lượng và đo lường.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g2_measurement",
  "grade": 2,
  "subj": "toan",
  "title": "Đại lượng và đo lường",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Đại lượng và đo lường.",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Độ dài và đơn vị đo độ dài",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Khối lượng và dung tích theo nội dung lớp",
      "art": "📐"
    },
    {
      "k": "choose",
      "t": "70 dm = ? m",
      "opts": [
        "70 m",
        "700 m",
        "7 m"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 7 m.",
      "no": "Đổi từ đơn vị LỚN sang đơn vị BÉ thì NHÂN; từ BÉ sang LỚN thì CHIA."
    },
    {
      "k": "choose",
      "t": "Nối sợi dây dài 26 cm với đoạn băng dài 93 cm. Cả hai dài bao nhiêu cm?",
      "opts": [
        "119 cm",
        "67 cm",
        "120 cm"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 119 cm.",
      "no": "“Dài hơn bao nhiêu” là lấy số lớn TRỪ số bé."
    },
    {
      "k": "choose",
      "t": "Hôm nay là Thứ Bảy. 2 ngày sau là thứ mấy?",
      "opts": [
        "Thứ Hai",
        "Thứ Năm",
        "Thứ Ba"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Thứ Hai.",
      "no": "Vẽ trục thời gian và đếm từ mốc đầu tới mốc cuối."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Độ dài và đơn vị đo độ dài",
        "Khối lượng và dung tích theo nội dung lớp",
        "Tiền Việt Nam và bài toán mua bán"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Bút giá 1000 đồng, tẩy giá 7000 đồng. Mua cả hai hết bao nhiêu?",
      "opts": [
        "6000 đồng",
        "7000 đồng",
        "8000 đồng"
      ],
      "ok": 2,
      "hint": "Mua nhiều món thì CỘNG tiền từng món. Tiền trả lại = tiền đưa − tiền phải trả.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "5 m = ? cm",
      "opts": [
        "5000 cm",
        "500 cm",
        "50 cm"
      ],
      "ok": 1,
      "hint": "Đổi từ đơn vị LỚN sang đơn vị BÉ thì NHÂN; từ BÉ sang LỚN thì CHIA.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Bút chì dài 28 cm, đoạn băng dài 39 cm. Đoạn băng dài hơn bút chì mấy cm?",
      "opts": [
        "10 cm",
        "11 cm",
        "67 cm"
      ],
      "ok": 1,
      "hint": "“Dài hơn bao nhiêu” là lấy số lớn TRỪ số bé.",
      "yes": "Đúng rồi!"
    }
  ]
});
