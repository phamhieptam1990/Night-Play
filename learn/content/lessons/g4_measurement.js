/* BẢN NHÁP TỰ SINH · Toán lớp 4 · Đại lượng và đo lường.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g4_measurement",
  "grade": 4,
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
      "t": "Đơn vị đo độ dài, khối lượng, thời gian",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Đơn vị đo diện tích",
      "art": "📐"
    },
    {
      "k": "choose",
      "t": "Hình vuông có chu vi 28 cm. Cạnh hình vuông dài?",
      "opts": [
        "49 cm",
        "24 cm",
        "7 cm"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là 7 cm.",
      "no": "Chu vi là độ dài đi MỘT VÒNG quanh hình."
    },
    {
      "k": "choose",
      "t": "Hình thoi có hai đường chéo 30 cm và 17 cm. Diện tích là?",
      "opts": [
        "255 cm²",
        "94 cm²",
        "47 cm²"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 255 cm².",
      "no": "Diện tích là phần mặt phẳng nằm BÊN TRONG hình (như số ô vuông phủ kín)."
    },
    {
      "k": "choose",
      "t": "7 phút = ? giây",
      "opts": [
        "0,117 giây",
        "420 giây",
        "42 giây"
      ],
      "ok": 1,
      "yes": "Đúng rồi! Đáp án là 420 giây.",
      "no": "Đổi từ đơn vị LỚN sang đơn vị BÉ thì NHÂN; từ BÉ sang LỚN thì CHIA."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Đơn vị đo độ dài, khối lượng, thời gian",
        "Đơn vị đo diện tích",
        "Tiền Việt Nam và bài toán thực tế"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Bắt đầu lúc 12 giờ 5 phút, làm trong 2 giờ 5 phút. Kết thúc lúc mấy giờ?",
      "opts": [
        "13 giờ 10 phút",
        "14 giờ 20 phút",
        "14 giờ 10 phút"
      ],
      "ok": 2,
      "hint": "Vẽ trục thời gian và đếm từ mốc đầu tới mốc cuối.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Hình vuông có cạnh 29 m. Chu vi hình vuông là?",
      "opts": [
        "58 m",
        "841 m",
        "116 m"
      ],
      "ok": 2,
      "hint": "Chu vi là độ dài đi MỘT VÒNG quanh hình.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Hình bình hành có đáy 12 cm, chiều cao 13 cm. Diện tích là?",
      "opts": [
        "156 cm²",
        "50 cm²",
        "78 cm²"
      ],
      "ok": 0,
      "hint": "Diện tích là phần mặt phẳng nằm BÊN TRONG hình (như số ô vuông phủ kín).",
      "yes": "Đúng rồi!"
    }
  ]
});
