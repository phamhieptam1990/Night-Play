/* BẢN NHÁP TỰ SINH · Toán lớp 3 · Bốn phép tính với số tự nhiên.
   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */
window.LearnLessons.reg({
  "id": "g3_four_operations",
  "grade": 3,
  "subj": "toan",
  "title": "Bốn phép tính với số tự nhiên",
  "screens": [
    {
      "k": "say",
      "t": "Bảng nhân chia: nhân và chia là hai phép tính ngược nhau.",
      "art": "6 × 7 = 42\n42 ÷ 7 = 6"
    },
    {
      "k": "say",
      "t": "Biểu thức có ngoặc: tính trong ngoặc trước. Không ngoặc: nhân chia trước, cộng trừ sau.",
      "art": "(4 + 2) × 5\n= 6 × 5 = 30"
    },
    {
      "k": "say",
      "t": "Bài toán nhiều gấp mấy lần: dùng phép nhân. Chia đều: dùng phép chia.",
      "art": "Mỗi hộp 8 cái\n4 hộp → 8 × 4"
    },
    {
      "k": "choose",
      "t": "6 × 7 = ?",
      "opts": [
        "48",
        "42",
        "36"
      ],
      "ok": 1,
      "yes": "Đúng! 6 × 7 = 42.",
      "no": "Nhớ bảng nhân 6: 6 × 6 = 36, rồi cộng thêm 6.",
      "art": "6 × 7"
    },
    {
      "k": "choose",
      "t": "56 ÷ 8 = ?",
      "opts": [
        "8",
        "7",
        "6"
      ],
      "ok": 1,
      "yes": "Đúng! 7 × 8 = 56.",
      "no": "Tìm số nhân với 8 được 56.",
      "art": "56 ÷ 8"
    },
    {
      "k": "choose",
      "t": "(4 + 2) × 5 = ?",
      "opts": [
        "30",
        "22",
        "14"
      ],
      "ok": 0,
      "yes": "Đúng! 6 × 5 = 30.",
      "no": "Tính trong ngoặc trước.",
      "art": "(4 + 2) × 5"
    },
    {
      "k": "sum",
      "t": "Em nhớ nhé!",
      "pts": [
        "Nhân và chia là hai phép ngược nhau",
        "Trong ngoặc làm trước; nhân chia trước, cộng trừ sau",
        "Tìm thừa số: lấy tích chia thừa số kia"
      ]
    }
  ],
  "tryit": [
    {
      "q": "Mỗi hộp có 8 cái bánh. 4 hộp có bao nhiêu cái?",
      "opts": [
        "24",
        "32",
        "12"
      ],
      "ok": 1,
      "hint": "Mỗi hộp như nhau: dùng phép nhân.",
      "yes": "Đúng! 8 × 4 = 32.",
      "art": "8 × 4"
    },
    {
      "q": "Chia đều 36 kẹo cho 4 bạn. Mỗi bạn được mấy cái?",
      "opts": [
        "9",
        "32",
        "8"
      ],
      "ok": 0,
      "hint": "Chia đều thì dùng phép chia.",
      "yes": "Đúng! 36 ÷ 4 = 9.",
      "art": "36 ÷ 4"
    },
    {
      "q": "x × 5 = 35. Tìm x.",
      "opts": [
        "30",
        "7",
        "175"
      ],
      "ok": 1,
      "hint": "Tìm thừa số: lấy tích chia cho thừa số kia.",
      "yes": "Đúng! 35 ÷ 5 = 7.",
      "art": "x × 5 = 35"
    }
  ]
});
