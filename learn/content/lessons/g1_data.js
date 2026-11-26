/* Bài học · Toán lớp 1 · Làm quen với dữ liệu. Bản NHÁP tự soạn theo yêu cầu cần đạt GDPT 2018 (không chép SGK), chờ chủ site duyệt. */
window.LearnLessons.reg({
 "id": "g1_data",
 "grade": 1,
 "subj": "toan",
 "title": "Làm quen với dữ liệu",
 "screens": [
  {
   "k": "say",
   "t": "Mình cùng xếp các thứ giống nhau vào một nhóm nhé!",
   "art": "🍎🍌🍎🍌🍎"
  },
  {
   "k": "tapcount",
   "t": "Chạm vào từng quả táo để đếm nào!",
   "n": 3,
   "e": "🍎",
   "done": "Có 3 quả táo!"
  },
  {
   "k": "tapcount",
   "t": "Chạm đếm các quả chuối!",
   "n": 2,
   "e": "🍌",
   "done": "Có 2 quả chuối!"
  },
  {
   "k": "say",
   "t": "Có thể xếp theo màu, theo hình hoặc theo loại.",
   "art": "🔴🔴  🔵🔵"
  },
  {
   "k": "choose",
   "t": "Có mấy quả táo?",
   "opts": [
    "3",
    "2",
    "5"
   ],
   "ok": 0,
   "yes": "Đúng rồi! Có 3 quả táo.",
   "no": "Chỉ đếm quả táo, không đếm chuối nhé.",
   "art": "🍎🍌🍎🍎🍌"
  },
  {
   "k": "choose",
   "t": "Nhóm nào nhiều hơn?",
   "opts": [
    "🍎",
    "🍌"
   ],
   "ok": 0,
   "yes": "Giỏi quá! 3 nhiều hơn 2.",
   "no": "So sánh 2 và 3: số nào lớn hơn?",
   "art": "🍌🍌  🍎🍎🍎"
  },
  {
   "k": "choose",
   "t": "Nhóm nào ít hơn?",
   "opts": [
    "🌙",
    "⭐"
   ],
   "ok": 0,
   "yes": "Đúng rồi! 2 ít hơn 4.",
   "no": "Đếm từng nhóm rồi so sánh.",
   "art": "⭐⭐⭐⭐\n🌙🌙"
  },
  {
   "k": "sum",
   "t": "Em nhớ nhé!",
   "pts": [
    "Xếp các thứ giống nhau vào một nhóm",
    "Đếm từng nhóm",
    "So sánh nhóm nào nhiều, ít hơn"
   ]
  }
 ],
 "tryit": [
  {
   "q": "Có mấy con mèo?",
   "opts": [
    "3",
    "2",
    "5"
   ],
   "ok": 0,
   "hint": "Chỉ đếm con mèo.",
   "yes": "Đúng rồi!",
   "art": "🐶🐱🐶🐱\n🐱"
  },
  {
   "q": "Nhóm nào nhiều hơn?",
   "opts": [
    "🐟",
    "🐢"
   ],
   "ok": 0,
   "hint": "Đếm từng nhóm.",
   "yes": "Đúng rồi!",
   "art": "🐟🐟🐟🐟\n🐢🐢"
  },
  {
   "q": "Có mấy chiếc xe đạp?",
   "opts": [
    "1",
    "2",
    "3"
   ],
   "ok": 0,
   "hint": "Chỉ đếm xe đạp, không đếm xe hơi.",
   "yes": "Đúng rồi!",
   "art": "🚗 🚲 🚗"
  }
 ]
});
