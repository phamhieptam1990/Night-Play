/* Bài học mẫu · Toán lớp 1 · Phép cộng và phép trừ (tự soạn theo yêu cầu cần đạt GDPT 2018, chờ chủ site duyệt). */
window.LearnLessons.reg({
 "id": "g1_add_sub",
 "grade": 1,
 "subj": "toan",
 "title": "Phép cộng và phép trừ",
 "screens": [
  {
   "k": "say",
   "t": "Cộng là gộp. Trừ là bớt!",
   "art": "🍎🍎 ➕ 🍎\n= 🍎🍎🍎"
  },
  {
   "k": "merge",
   "t": "Chạm Gộp lại nhé!",
   "a": 3,
   "b": 2,
   "e": "🍎",
   "done": "3 + 2 = 5. Có 5 quả táo!"
  },
  {
   "k": "take",
   "t": "Em ăn 2 cái bánh. Chạm vào 2 cái!",
   "n": 5,
   "m": 2,
   "e": "🍪",
   "done": "5 − 2 = 3. Còn 3 cái bánh!"
  },
  {
   "k": "merge",
   "t": "Gộp các chú cá lại nào!",
   "a": 2,
   "b": 4,
   "e": "🐟",
   "done": "2 + 4 = 6. Có 6 chú cá!"
  },
  {
   "k": "choose",
   "t": "Tất cả có mấy quả?",
   "opts": [
    "7",
    "6",
    "8"
   ],
   "ok": 0,
   "yes": "Đúng rồi! 4 + 3 = 7.",
   "no": "Đếm hết các quả dâu nhé.",
   "art": "🍓🍓🍓🍓\n➕ 🍓🍓🍓"
  },
  {
   "k": "take",
   "t": "Bóng bay mất 1 quả. Chạm 1 quả!",
   "n": 6,
   "m": 1,
   "e": "🎈",
   "done": "6 − 1 = 5. Còn 5 quả bóng!"
  },
  {
   "k": "choose",
   "t": "Còn lại mấy quả bóng?",
   "opts": [
    "4",
    "3",
    "6"
   ],
   "ok": 0,
   "yes": "Giỏi quá! 6 − 2 = 4.",
   "no": "Bớt đi thì còn ít hơn lúc đầu.",
   "art": "🎈🎈🎈\n🎈🎈🎈 ➖ 2"
  },
  {
   "k": "sum",
   "t": "Em nhớ nhé!",
   "pts": [
    "Cộng là gộp lại",
    "Trừ là bớt đi",
    "Đếm tiếp để cộng, đếm lùi để trừ"
   ]
  }
 ],
 "tryit": [
  {
   "q": "8 + 1 = ?",
   "opts": [
    "9",
    "7",
    "10"
   ],
   "ok": 0,
   "hint": "Gộp thêm 1: sau số 8 là số nào?",
   "yes": "Đúng rồi!",
   "art": "⭐⭐⭐⭐\n⭐⭐⭐⭐ ➕ ⭐"
  },
  {
   "q": "9 − 4 = ?",
   "opts": [
    "5",
    "6",
    "4"
   ],
   "ok": 0,
   "hint": "Từ 9 đếm lùi 4 lần.",
   "yes": "Đúng rồi!",
   "art": "🐥🐥🐥🐥🐥\n🐥🐥🐥🐥"
  },
  {
   "q": "2 + 6 = ?",
   "opts": [
    "8",
    "7",
    "9"
   ],
   "ok": 0,
   "hint": "Từ 6 đếm tiếp thêm 2 lần.",
   "yes": "Đúng rồi!",
   "art": "🍎🍎 ➕ 🍎🍎🍎\n🍎🍎🍎"
  }
 ]
});
