/* BẢN NHÁP TỰ SINH · Toán lớp 5 · Hình học phẳng và hình khối.
   Lắp tự động từ chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js); chờ chủ site/giáo viên viết lại lời giảng. */
window.LearnLessons.reg({
  "id": "g5_geometry",
  "grade": 5,
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
      "t": "Tam giác, hình thang và các hình đã học",
      "art": "📐"
    },
    {
      "k": "say",
      "t": "Đường tròn, hình tròn và các yếu tố liên quan",
      "art": "📐"
    },
    {
      "k": "choose",
      "t": "Góc 30° là góc gì?",
      "opts": [
        "góc bẹt",
        "góc tù",
        "góc nhọn"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là góc nhọn.",
      "no": "Góc vuông 90°, góc bẹt 180°. Hai góc kề bù cộng lại 180°."
    },
    {
      "k": "choose",
      "t": "Hình vuông có chu vi 128 m. Cạnh hình vuông dài?",
      "opts": [
        "32 m",
        "1024 m",
        "64 m"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 32 m.",
      "no": "Chu vi là độ dài đi MỘT VÒNG quanh hình."
    },
    {
      "k": "choose",
      "t": "Hình bình hành có đáy 28 m, chiều cao 17 m. Diện tích là?",
      "opts": [
        "476 m²",
        "90 m²",
        "45 m²"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là 476 m².",
      "no": "Diện tích là phần mặt phẳng nằm BÊN TRONG hình (như số ô vuông phủ kín)."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Tam giác, hình thang và các hình đã học",
        "Đường tròn, hình tròn và các yếu tố liên quan",
        "Hình hộp chữ nhật, hình lập phương và hình khối liên quan theo chương trình"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Hình hộp chữ nhật dài 9 cm, rộng 5 cm, cao 8 cm. Thể tích là?",
      "opts": [
        "22 cm³",
        "360 cm³",
        "45 cm³"
      ],
      "ok": 1,
      "hint": "Thể tích là phần không gian bên trong khối.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Hai góc kề bù có tổng bằng 180°. Một góc là 50°, góc còn lại là?",
      "opts": [
        "40 °",
        "130 °",
        "310 °"
      ],
      "ok": 1,
      "hint": "Góc vuông 90°, góc bẹt 180°. Hai góc kề bù cộng lại 180°.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "Hình chữ nhật dài 37 m, rộng 17 m. Chu vi là?",
      "opts": [
        "54 m",
        "108 m",
        "71 m"
      ],
      "ok": 1,
      "hint": "Chu vi là độ dài đi MỘT VÒNG quanh hình.",
      "yes": "Đúng rồi!"
    }
  ]
});
