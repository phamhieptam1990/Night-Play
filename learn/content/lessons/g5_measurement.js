/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Đại lượng và đo lường.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g5_measurement",
  "grade": 5,
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
      "t": "Đơn vị đo độ dài, khối lượng, diện tích, thể tích và thời gian",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Chuyển đổi đơn vị đo",
      "art": "📐"
    },
    {
      "k": "choose",
      "t": "1,3 kg = ? g",
      "opts": [
        "1300 g",
        "130 g",
        "0,001 g"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 1300 g.",
      "no": "Đổi từ đơn vị LỚN sang đơn vị BÉ thì NHÂN; từ BÉ sang LỚN thì CHIA."
    },
    {
      "k": "choose",
      "t": "Từ 11 giờ 10 phút đến 14 giờ là bao lâu?",
      "opts": [
        "3 giờ 10 phút",
        "2 giờ 50 phút",
        "3 giờ 50 phút"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 2 giờ 50 phút.",
      "no": "Vẽ trục thời gian và đếm từ mốc đầu tới mốc cuối."
    },
    {
      "k": "choose",
      "t": "Xe máy đi với vận tốc 25 km/giờ trong 4 giờ. Quãng đường đi được là?",
      "opts": [
        "29 km",
        "6 km",
        "100 km"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 100 km.",
      "no": "Vận tốc = quãng đường ÷ thời gian."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đơn vị đo độ dài, khối lượng, diện tích, thể tích và thời gian",
        "Chuyển đổi đơn vị đo",
        "Vận dụng số thập phân trong đo lường"
      ]
    }
  ],
  "tryit": [
    {
      "q": "2,7 m = ? cm",
      "opts": [
        "27 cm",
        "270 cm",
        "2700 cm"
      ],
      "ok": 1,
      "hint": "Đổi từ đơn vị LỚN sang đơn vị BÉ thì NHÂN; từ BÉ sang LỚN thì CHIA.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Từ 13 giờ 55 phút đến 15 giờ 40 phút là bao lâu?",
      "opts": [
        "1 giờ 45 phút",
        "45 phút",
        "2 giờ 15 phút"
      ],
      "ok": 0,
      "hint": "Vẽ trục thời gian và đếm từ mốc đầu tới mốc cuối.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Xe máy đi với vận tốc 50 km/giờ trong 6 giờ. Quãng đường đi được là?",
      "opts": [
        "8 km",
        "56 km",
        "300 km"
      ],
      "ok": 2,
      "hint": "Vận tốc = quãng đường ÷ thời gian.",
      "yes": "Đúng rồi!"
    }
  ]
});
