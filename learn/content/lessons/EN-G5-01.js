/* BẢN NHÁP TỰ SINH · Tiếng Anh lớp 5 · Nghe (Listening).
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "EN-G5-01",
  "grade": 5,
  "subj": "tanh",
  "title": "Nghe (Listening)",
  "screens": [
    {
      "k": "say",
      "t": "Hôm nay mình học: Nghe (Listening).",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Nghe đoạn nói ngắn và chọn ý đúng.",
      "art": "🔤"
    },
    {
      "k": "say",
      "t": "Chú ý nghề nghiệp, nơi chốn và thời gian.",
      "art": "🔤"
    },
    {
      "k": "choose",
      "t": "We play football on Sunday. Chơi vào ngày nào?",
      "opts": [
        "Chủ nhật",
        "Thứ Hai",
        "Thứ Sáu"
      ],
      "ok": 0,
      "yes": "Đúng rồi! Đáp án là Chủ nhật.",
      "no": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó."
    },
    {
      "k": "choose",
      "t": "My mother is a doctor. Mẹ làm nghề gì?",
      "opts": [
        "Giáo viên",
        "Đầu bếp",
        "Bác sĩ"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Bác sĩ.",
      "no": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó."
    },
    {
      "k": "choose",
      "t": "I am going to the library. Bạn đi đâu?",
      "opts": [
        "Chợ",
        "Công viên",
        "Thư viện"
      ],
      "ok": 2,
      "yes": "Đúng rồi! Đáp án là Thư viện.",
      "no": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó."
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "Nghe kỹ nghề, nơi chốn, thời gian",
        "Loại bỏ đáp án sai"
      ]
    }
  ],
  "tryit": [
    {
      "q": "He does not like fish. Anh ấy không thích gì?",
      "opts": [
        "Gà",
        "Cá",
        "Thịt"
      ],
      "ok": 1,
      "hint": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "The bag is under the table. Cái cặp ở đâu?",
      "opts": [
        "Dưới bàn",
        "Cạnh bàn",
        "Trên bàn"
      ],
      "ok": 0,
      "hint": "Nghe lại từ khoá trong câu tiếng Anh, rồi nghĩ nghĩa của nó.",
      "yes": "Đúng rồi!"
    },
    {
      "q": "It is half past seven. Mấy giờ?",
      "opts": [
        "7 giờ 30",
        "7 giờ",
        "8 giờ"
      ],
      "ok": 0,
      "hint": "Half past là rưỡi.",
      "yes": "Đúng rồi!"
    }
  ]
});
