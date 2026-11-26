/* Bài học · Toán lớp 1 · Đo lường và thời gian. Bản NHÁP tự soạn theo yêu cầu cần đạt GDPT 2018 (không chép SGK), chờ chủ site duyệt. */
window.LearnLessons.reg({
 "id": "g1_measurement",
 "grade": 1,
 "subj": "toan",
 "title": "Đo lường và thời gian",
 "screens": [
  {
   "k": "say",
   "t": "Dài hơn, ngắn hơn, nặng hơn, nhẹ hơn!",
   "art": "📏"
  },
  {
   "k": "choose",
   "t": "Con nào nặng hơn?",
   "opts": [
    "🐘",
    "🐜"
   ],
   "ok": 0,
   "yes": "Đúng rồi! Con voi nặng hơn nhiều.",
   "no": "Con nào to hơn thì thường nặng hơn.",
   "art": "🐘  🐜"
  },
  {
   "k": "choose",
   "t": "Cái nào nhẹ hơn?",
   "opts": [
    "🎈",
    "🧱"
   ],
   "ok": 0,
   "yes": "Giỏi quá! Bóng bay rất nhẹ.",
   "no": "Cái nào bay lên được?",
   "art": "🎈  🧱"
  },
  {
   "k": "say",
   "t": "Kim ngắn chỉ giờ, kim dài chỉ số 12.",
   "art": "🕒"
  },
  {
   "k": "choose",
   "t": "Đồng hồ chỉ mấy giờ?",
   "opts": [
    "5 giờ",
    "12 giờ",
    "1 giờ"
   ],
   "ok": 0,
   "yes": "Giỏi quá! Đó là 5 giờ.",
   "no": "Kim ngắn chỉ giờ. Nó chỉ số mấy?",
   "art": "🕔"
  },
  {
   "k": "say",
   "t": "Tiền Việt Nam có tờ 1 000, 2 000, 5 000 đồng.",
   "art": "💵"
  },
  {
   "k": "choose",
   "t": "Tờ 2 000 và tờ 5 000. Tất cả?",
   "opts": [
    "7 000",
    "3 000",
    "10 000"
   ],
   "ok": 0,
   "yes": "Đúng rồi! 2 000 cộng 5 000 là 7 000.",
   "no": "Gộp lại thì cộng: 2 cộng 5 là mấy?",
   "art": "💵💵"
  },
  {
   "k": "tapcount",
   "t": "Chạm đếm 7 ngày trong tuần!",
   "n": 7,
   "e": "📅",
   "done": "Một tuần có 7 ngày!"
  },
  {
   "k": "sum",
   "t": "Em nhớ nhé!",
   "pts": [
    "Dài hơn, ngắn hơn, nặng hơn, nhẹ hơn",
    "Kim ngắn chỉ giờ",
    "Một tuần có 7 ngày"
   ]
  }
 ],
 "tryit": [
  {
   "q": "Sợi nào ngắn hơn?",
   "opts": [
    "5 cm",
    "12 cm"
   ],
   "ok": 0,
   "hint": "Số nhỏ hơn thì ngắn hơn.",
   "yes": "Đúng rồi!",
   "art": "5  ⚖️  12"
  },
  {
   "q": "Đồng hồ chỉ mấy giờ?",
   "opts": [
    "8 giờ",
    "12 giờ",
    "4 giờ"
   ],
   "ok": 0,
   "hint": "Kim ngắn chỉ số 8 nên là 8 giờ.",
   "yes": "Đúng rồi!",
   "art": "🕗"
  },
  {
   "q": "Sau Thứ ba là thứ mấy?",
   "opts": [
    "Thứ tư",
    "Thứ hai",
    "Thứ năm"
   ],
   "ok": 0,
   "hint": "Đếm tiếp: Thứ hai, Thứ ba, ...",
   "yes": "Đúng rồi!",
   "art": "📅"
  }
 ]
});
