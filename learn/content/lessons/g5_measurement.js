/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Đại lượng và đo lường.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g5_measurement",
  "grade": 5,
  "subj": "toan",
  "title": "Đại lượng và đo lường",
  "screens": [
    {
      "k": "say",
      "t": "Đổi đơn vị: 1 m² = 100 dm². Đi lên đơn vị lớn thì chia, xuống đơn vị bé thì nhân.",
      "art": "2,9 m² = 290 dm²"
    },
    {
      "k": "say",
      "t": "Vận tốc là quãng đường đi được trong một giờ: v = s ÷ t.",
      "art": "60 km trong 2 giờ\nv = 30 km/giờ"
    },
    {
      "k": "say",
      "t": "Quãng đường = vận tốc × thời gian. Thời gian = quãng đường ÷ vận tốc.",
      "art": "s = 40 × 3 = 120 km"
    },
    {
      "k": "choose",
      "t": "2,9 m² bằng bao nhiêu dm²?",
      "opts": [
        "290 dm²",
        "2 900 dm²",
        "29 dm²"
      ],
      "ok": 0,
      "yes": "Đúng! 2,9 × 100 = 290.",
      "no": "1 m² = 100 dm².",
      "art": "2,9 m² = ? dm²"
    },
    {
      "k": "choose",
      "t": "9,2 giờ bằng bao nhiêu phút?",
      "opts": [
        "920 phút",
        "552 phút",
        "92 phút"
      ],
      "ok": 1,
      "yes": "Đúng! 540 + 12 = 552.",
      "no": "0,2 giờ = 12 phút; 9 giờ = 540 phút.",
      "art": "9,2 giờ"
    },
    {
      "k": "choose",
      "t": "Ô tô đi 60 km trong 2 giờ. Vận tốc là?",
      "opts": [
        "62 km/giờ",
        "120 km/giờ",
        "30 km/giờ"
      ],
      "ok": 2,
      "yes": "Đúng! 60 ÷ 2 = 30.",
      "no": "Vận tốc = quãng đường chia thời gian.",
      "art": "60 km : 2 giờ"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Vận tốc v = s ÷ t",
        "Quãng đường s = v × t, thời gian t = s ÷ v",
        "Đổi đơn vị: lên thì chia, xuống thì nhân"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Xe đi 40 km/giờ trong 3 giờ. Quãng đường là?",
      "opts": [
        "43 km",
        "120 km",
        "13 km"
      ],
      "ok": 1,
      "hint": "Quãng đường = vận tốc nhân thời gian.",
      "yes": "Đúng! 40 × 3 = 120.",
      "art": "40 km/giờ × 3 giờ"
    },
    {
      "q": "Đi 90 km với vận tốc 45 km/giờ. Mất bao lâu?",
      "opts": [
        "2 giờ",
        "45 giờ",
        "135 giờ"
      ],
      "ok": 0,
      "hint": "Thời gian = quãng đường chia vận tốc.",
      "yes": "Đúng! 90 ÷ 45 = 2.",
      "art": "90 km : 45 km/giờ"
    },
    {
      "q": "3 giờ 15 phút bằng bao nhiêu phút?",
      "opts": [
        "315 phút",
        "75 phút",
        "195 phút"
      ],
      "ok": 2,
      "hint": "Đổi 3 giờ ra phút rồi cộng 15.",
      "yes": "Đúng! 180 + 15 = 195.",
      "art": "3 giờ 15 phút"
    }
  ]
});
