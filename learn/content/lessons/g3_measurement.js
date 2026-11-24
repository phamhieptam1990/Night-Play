/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Đại lượng và đo lường.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g3_measurement",
  "grade": 3,
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
      "t": "Đơn vị đo độ dài, khối lượng, dung tích",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Thời gian và tiền Việt Nam",
      "art": "📐"
    },
    {
      "k": "choose",
      "t": "Hình chữ nhật dài 15 m, rộng 7 m. Diện tích là?",
      "opts": [
        "44 m²",
        "105 m²",
        "112 m²"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 105 m².",
      "no": "Diện tích là phần mặt phẳng nằm BÊN TRONG hình (như số ô vuông phủ kín)."
    },
    {
      "k": "choose",
      "t": "9 km = ? m",
      "opts": [
        "900 m",
        "9000 m",
        "90000 m"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 9000 m.",
      "no": "Đổi từ đơn vị LỚN sang đơn vị BÉ thì NHÂN; từ BÉ sang LỚN thì CHIA."
    },
    {
      "k": "choose",
      "t": "Từ 11 giờ 28 phút đến 11 giờ 35 phút là bao nhiêu phút?",
      "opts": [
        "12 phút",
        "7 phút",
        "53 phút"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 7 phút.",
      "no": "Vẽ trục thời gian và đếm từ mốc đầu tới mốc cuối."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đơn vị đo độ dài, khối lượng, dung tích",
        "Thời gian và tiền Việt Nam",
        "Diện tích ở mức độ làm quen hoặc theo nội dung lớp"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Một quyển vở giá 6000 đồng. Mua 5 quyển hết bao nhiêu tiền?",
      "opts": [
        "31000 đồng",
        "30000 đồng",
        "29000 đồng"
      ],
      "ok": 1,
      "hint": "Mua nhiều món thì CỘNG tiền từng món. Tiền trả lại = tiền đưa − tiền phải trả.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Hình vuông có cạnh 10 m. Diện tích là?",
      "opts": [
        "100 m²",
        "40 m²",
        "110 m²"
      ],
      "ok": 0,
      "hint": "Diện tích là phần mặt phẳng nằm BÊN TRONG hình (như số ô vuông phủ kín).",
      "yes": "Đúng rồi!"
    },
    {
      "q": "240 phút = ? giờ",
      "opts": [
        "40 giờ",
        "4 giờ",
        "0,4 giờ"
      ],
      "ok": 1,
      "hint": "Đổi từ đơn vị LỚN sang đơn vị BÉ thì NHÂN; từ BÉ sang LỚN thì CHIA.",
      "yes": "Đúng rồi!"
    }
  ]
});
