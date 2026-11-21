/* Bài học mẫu · Toán lớp 1 · Phép cộng và phép trừ (tự soạn theo yêu cầu cần đạt GDPT 2018, chờ chủ site duyệt). */
window.LearnLessons.reg({
  id: "g1_add_sub", grade: 1, subj: "toan", title: "Phép cộng và phép trừ",
  screens: [
    { k: "say", t: "Cộng là gộp lại. Trừ là bớt đi. Cùng xem nhé!", art: "➕  ➖" },
    { k: "merge", t: "Bé có 3 quả táo, mẹ cho thêm 2 quả. Chạm Gộp lại nhé!", a: 3, b: 2, e: "🍎", done: "3 + 2 = 5. Có tất cả 5 quả táo!" },
    { k: "take", t: "Có 5 cái bánh, bé ăn 2 cái. Chạm vào 2 cái bánh nhé!", n: 5, m: 2, e: "🍪", done: "5 − 2 = 3. Còn lại 3 cái bánh!" },
    { k: "choose", t: "4 + 3 bằng mấy?", opts: ["6", "7", "8"], ok: 1, yes: "Đúng rồi! 4 + 3 = 7.", no: "Đếm tiếp từ 4 thêm 3 lần: 5, 6, ..." },
    { k: "choose", t: "Có 6 quả bóng, bay mất 1 quả. Còn mấy quả?", opts: ["7", "5", "6"], ok: 1, yes: "Giỏi quá! 6 − 1 = 5.", no: "Bớt đi thì còn ít hơn lúc đầu đó." },
    { k: "sum", t: "Bé nhớ nhé!", pts: ["Cộng là gộp lại, được nhiều hơn", "Trừ là bớt đi, còn ít hơn", "Đếm tiếp để cộng, đếm lùi để trừ"] }
  ],
  tryit: [
    { q: "8 + 1 = ?", opts: ["9", "7", "10"], ok: 0, hint: "Gộp thêm 1: sau số 8 là số nào?", yes: "Đúng rồi!" },
    { q: "9 − 4 = ?", opts: ["5", "6", "4"], ok: 0, hint: "Từ 9 đếm lùi 4 lần: 8, 7, 6, ...", yes: "Đúng rồi!" },
    { q: "2 + 6 = ?", opts: ["7", "8", "9"], ok: 1, hint: "Từ 6 đếm tiếp thêm 2 lần: 7, ...", yes: "Đúng rồi!" }
  ]
});
