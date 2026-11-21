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
   "art": "🍎 🍌 🍎 🍎 🍌"
  },
  {
   "k": "choose",
   "t": "Có 2 quả chuối và 3 quả táo. Nhóm nào nhiều hơn?",
   "opts": [
    "Táo",
    "Chuối",
    "Bằng nhau"
   ],
   "ok": 0,
   "yes": "Giỏi quá! 3 nhiều hơn 2.",
   "no": "So sánh 2 và 3: số nào lớn hơn?",
   "art": "🍌🍌   🍎🍎🍎"
  },
  {
   "k": "sum",
   "t": "Bé nhớ nhé!",
   "pts": [
    "Xếp các thứ giống nhau vào một nhóm",
    "Đếm từng nhóm",
    "So sánh nhóm nào nhiều hơn, ít hơn"
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
   "art": "🐶 🐱 🐶 🐱 🐱"
  },
  {
   "q": "Nhóm 4 ngôi sao và nhóm 2 mặt trăng. Nhóm nào ít hơn?",
   "opts": [
    "Mặt trăng",
    "Ngôi sao"
   ],
   "ok": 0,
   "hint": "2 ít hơn 4.",
   "yes": "Đúng rồi!"
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
