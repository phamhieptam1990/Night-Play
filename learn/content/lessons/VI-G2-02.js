/* BẢN NHÁP TỰ SINH · Tiếng Việt lớp 2 · Từ và câu.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "VI-G2-02",
  "grade": 2,
  "subj": "tviet",
  "title": "Từ và câu",
  "screens": [
    {
      "k": "say",
      "t": "Viết đúng chính tả: ch hay tr, ng hay ngh. Ngh chỉ đứng trước e, ê, i.",
      "art": "nghe · nghĩ\nngày · người"
    },
    {
      "k": "say",
      "t": "Từ chỉ sự vật, hoạt động, đặc điểm. Dấu chấm kết thúc câu kể; dấu phẩy ngăn các ý liệt kê.",
      "art": "hoa hồng, hoa cúc,\nhoa lan."
    },
    {
      "k": "say",
      "t": "Từ trái nghĩa là hai từ có nghĩa ngược nhau.",
      "art": "cao ↔ thấp\nsáng ↔ tối"
    },
    {
      "k": "choose",
      "t": "Điền ng hay ngh: __ỉ ngơi.",
      "opts": [
        "gh",
        "ng",
        "ngh"
      ],
      "ok": 2,
      "yes": "Đúng! ngh đứng trước i.",
      "no": "Chữ đứng sau là i.",
      "art": "__ỉ ngơi"
    },
    {
      "k": "choose",
      "t": "Điền ch hay tr: con __âu.",
      "opts": [
        "th",
        "tr",
        "ch"
      ],
      "ok": 1,
      "yes": "Đúng! con trâu.",
      "no": "Nghĩ đến con vật hay kéo cày.",
      "art": "con __âu"
    },
    {
      "k": "choose",
      "t": "Điền dấu: Trong vườn có hoa hồng __ hoa cúc và hoa lan.",
      "opts": [
        "?",
        ".",
        ","
      ],
      "ok": 2,
      "yes": "Đúng! Dấu phẩy ngăn các ý liệt kê.",
      "no": "Đây là các hoa được kể liệt kê nối tiếp nhau.",
      "art": "hồng __ cúc"
    },
    {
      "k": "sum",
      "t": "Bé nhớ nhé!",
      "pts": [
        "ngh chỉ đứng trước e, ê, i",
        "Dấu phẩy ngăn các ý liệt kê, dấu chấm kết thúc câu kể",
        "Từ trái nghĩa có nghĩa ngược nhau"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Từ nào chỉ hoạt động?",
      "opts": [
        "bàn",
        "đẹp",
        "chạy"
      ],
      "ok": 2,
      "hint": "Hoạt động là việc làm của người hay vật.",
      "yes": "Đúng! Chạy là hoạt động.",
      "art": "chạy · bàn · đẹp"
    },
    {
      "q": "Từ trái nghĩa với \"cao\" là?",
      "opts": [
        "thấp",
        "xa",
        "to"
      ],
      "ok": 0,
      "hint": "Nghĩ xem cái gì ngược lại với cao.",
      "yes": "Đúng! cao ↔ thấp.",
      "art": "cao ↔ ?"
    },
    {
      "q": "Cuối câu kể ta đặt dấu gì?",
      "opts": [
        "Dấu chấm",
        "Dấu phẩy",
        "Dấu hỏi"
      ],
      "ok": 0,
      "hint": "Câu kể dùng để kể hoặc tả, nó kết thúc thế nào?",
      "yes": "Đúng! Dấu chấm.",
      "art": "Em đi học__"
    }
  ]
});
