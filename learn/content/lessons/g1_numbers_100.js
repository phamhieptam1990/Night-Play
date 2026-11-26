/* Bài học mẫu · Toán lớp 1 · Số tự nhiên trong phạm vi 100 (tự soạn theo yêu cầu cần đạt GDPT 2018, chờ chủ site duyệt). */
window.LearnLessons.reg({
 "id": "g1_numbers_100",
 "grade": 1,
 "subj": "toan",
 "title": "Số tự nhiên trong phạm vi 100",
 "screens": [
  {
   "k": "say",
   "t": "Cùng đếm và đọc số nhé!",
   "art": "🔢"
  },
  {
   "k": "tapcount",
   "t": "Chạm vào từng quả táo để đếm!",
   "n": 6,
   "e": "🍎",
   "done": "Có 6 quả táo. Đó là số 6!"
  },
  {
   "k": "tapcount",
   "t": "Chạm đếm các ngôi sao!",
   "n": 8,
   "e": "⭐",
   "done": "Có 8 ngôi sao. Đó là số 8!"
  },
  {
   "k": "say",
   "t": "10 que tính buộc thành 1 bó: 1 chục.",
   "art": "🪵🪵🪵🪵🪵\n🪵🪵🪵🪵🪵"
  },
  {
   "k": "say",
   "t": "Số 23 có 2 chục và 3 đơn vị.",
   "art": "23\n🟦🟦 🔹🔹🔹"
  },
  {
   "k": "choose",
   "t": "Số này có mấy chục?",
   "opts": [
    "4",
    "5",
    "9"
   ],
   "ok": 0,
   "yes": "Đúng rồi! Số 45 có 4 chục.",
   "no": "Mỗi 🟦 là 1 chục. Đếm 🟦 nhé.",
   "art": "🟦🟦🟦🟦\n🔹🔹🔹🔹🔹"
  },
  {
   "k": "choose",
   "t": "Số nào lớn hơn?",
   "opts": [
    "83",
    "38"
   ],
   "ok": 0,
   "yes": "Giỏi quá! 8 chục nhiều hơn 3 chục.",
   "no": "So sánh số chục trước.",
   "art": "38  ⚖️  83"
  },
  {
   "k": "choose",
   "t": "Đếm tiếp: 48, 49, ?",
   "opts": [
    "50",
    "40",
    "59"
   ],
   "ok": 0,
   "yes": "Đúng rồi! Sau 49 là 50.",
   "no": "Sau 49 là số tròn chục nào?",
   "art": "48  49  ❓"
  },
  {
   "k": "sum",
   "t": "Em nhớ nhé!",
   "pts": [
    "Đếm từng vật một",
    "10 đơn vị là 1 chục",
    "So sánh số chục trước"
   ]
  }
 ],
 "tryit": [
  {
   "q": "Số 30 có mấy chục?",
   "opts": [
    "3",
    "30",
    "1"
   ],
   "ok": 0,
   "hint": "Mỗi chục là 10. Số 30 có mấy lần 10?",
   "yes": "Đúng rồi!",
   "art": "🟦🟦🟦"
  },
  {
   "q": "Số nào nhỏ nhất?",
   "opts": [
    "15",
    "29",
    "41"
   ],
   "ok": 0,
   "hint": "Nhìn số chục: 1, 2 hay 4 chục?",
   "yes": "Đúng rồi!",
   "art": "29  15  41"
  },
  {
   "q": "Đếm tiếp: 48, 49, ?",
   "opts": [
    "50",
    "40",
    "59"
   ],
   "ok": 0,
   "hint": "Sau 49 là số tròn chục nào?",
   "yes": "Đúng rồi!",
   "art": "49  ❓"
  }
 ]
});
