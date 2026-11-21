/* Bài học · Toán lớp 1 · Đo lường và thời gian. Bản NHÁP tự soạn theo yêu cầu cần đạt GDPT 2018 (không chép SGK), chờ chủ site duyệt. */
window.LearnLessons.reg({
 "id": "g1_measurement",
 "grade": 1,
 "subj": "toan",
 "title": "Đo lường và thời gian",
 "screens": [
  {
   "k": "say",
   "t": "Dài hơn hay ngắn hơn? Nặng hơn hay nhẹ hơn? Mình cùng so sánh nhé!",
   "art": "📏"
  },
  {
   "k": "choose",
   "t": "Con voi và con kiến, con nào nặng hơn?",
   "opts": [
    "Con voi",
    "Con kiến"
   ],
   "ok": 0,
   "yes": "Đúng rồi! Con voi nặng hơn nhiều.",
   "no": "Con nào to hơn thì thường nặng hơn đó.",
   "art": "🐘  🐜"
  },
  {
   "k": "say",
   "t": "Xem giờ đúng: kim ngắn chỉ giờ, kim dài chỉ số 12.",
   "art": "🕒"
  },
  {
   "k": "choose",
   "t": "Kim dài chỉ số 12, kim ngắn chỉ số 5. Là mấy giờ?",
   "opts": [
    "5 giờ",
    "12 giờ",
    "1 giờ"
   ],
   "ok": 0,
   "yes": "Giỏi quá! Đó là 5 giờ.",
   "no": "Kim ngắn chỉ giờ. Nó đang chỉ số mấy?"
  },
  {
   "k": "say",
   "t": "Tiền Việt Nam có tờ 1 000 đồng, 2 000 đồng, 5 000 đồng và 10 000 đồng.",
   "art": "💵"
  },
  {
   "k": "choose",
   "t": "Bé có tờ 2 000 đồng và tờ 5 000 đồng. Cả hai là bao nhiêu?",
   "opts": [
    "7 000 đồng",
    "3 000 đồng",
    "10 000 đồng"
   ],
   "ok": 0,
   "yes": "Đúng rồi! 2 000 cộng 5 000 là 7 000.",
   "no": "Gộp lại thì cộng: 2 cộng 5 là mấy nghìn?"
  },
  {
   "k": "say",
   "t": "Một tuần có 7 ngày. Thứ hai, ba, tư, năm, sáu, bảy và Chủ nhật.",
   "art": "📅"
  },
  {
   "k": "sum",
   "t": "Bé nhớ nhé!",
   "pts": [
    "Dài hơn, ngắn hơn, nặng hơn, nhẹ hơn",
    "Kim ngắn chỉ giờ, kim dài chỉ số 12 là giờ đúng",
    "Một tuần có 7 ngày"
   ]
  }
 ],
 "tryit": [
  {
   "q": "Sợi dây dài 5 cm và sợi dây dài 12 cm. Sợi nào ngắn hơn?",
   "opts": [
    "Sợi dài 5 cm",
    "Sợi dài 12 cm"
   ],
   "ok": 0,
   "hint": "Số nhỏ hơn thì ngắn hơn.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Kim dài chỉ số 12, kim ngắn chỉ số 8. Là mấy giờ?",
   "opts": [
    "8 giờ",
    "12 giờ",
    "4 giờ"
   ],
   "ok": 0,
   "hint": "Kim ngắn chỉ số 8 nên là 8 giờ.",
   "yes": "Đúng rồi!"
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
   "yes": "Đúng rồi!"
  }
 ]
});
