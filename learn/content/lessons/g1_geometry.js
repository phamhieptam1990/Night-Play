/* Bài học mẫu · Toán lớp 1 · Hình học trực quan (tự soạn theo yêu cầu cần đạt GDPT 2018, chờ chủ site duyệt). */
window.LearnLessons.reg({
 "id": "g1_geometry",
 "grade": 1,
 "subj": "toan",
 "title": "Hình học trực quan",
 "screens": [
  {
   "k": "say",
   "t": "Xung quanh bé có rất nhiều hình đấy!",
   "shapes": [
    "circle",
    "square",
    "triangle",
    "rect"
   ]
  },
  {
   "k": "meet",
   "t": "Hình tròn tròn trịa, không có góc. Giống bánh xe!",
   "shape": "circle"
  },
  {
   "k": "meet",
   "t": "Hình vuông có 4 cạnh bằng nhau.",
   "shape": "square"
  },
  {
   "k": "meet",
   "t": "Hình tam giác có 3 cạnh và 3 góc.",
   "shape": "triangle"
  },
  {
   "k": "meet",
   "t": "Hình chữ nhật có 4 cạnh: 2 cạnh dài và 2 cạnh ngắn.",
   "shape": "rect"
  },
  {
   "k": "tapcount",
   "t": "Chạm đếm các hình tròn!",
   "n": 4,
   "e": "🔵",
   "done": "Có 4 hình tròn!"
  },
  {
   "k": "choose",
   "t": "Bánh xe hình nào?",
   "opts": [
    "shape:circle",
    "shape:square",
    "shape:triangle"
   ],
   "ok": 0,
   "yes": "Đúng rồi! Bánh xe hình tròn.",
   "no": "Hình nào tròn trịa, lăn được?",
   "art": "🛞"
  },
  {
   "k": "choose",
   "t": "Hình nào có 3 cạnh?",
   "opts": [
    "shape:triangle",
    "shape:circle",
    "shape:square"
   ],
   "ok": 0,
   "yes": "Giỏi quá! Tam giác có 3 cạnh.",
   "no": "Tam giác: tam là ba đó.",
   "art": "3️⃣ cạnh"
  },
  {
   "k": "choose",
   "t": "Hình nào có 4 cạnh bằng nhau?",
   "opts": [
    "shape:square",
    "shape:triangle",
    "shape:circle"
   ],
   "ok": 0,
   "yes": "Đúng rồi! Hình vuông.",
   "no": "Nghĩ tới viên gạch men vuông.",
   "art": "4️⃣ cạnh bằng nhau"
  },
  {
   "k": "say",
   "t": "Còn các bạn hình khối nữa nè! Chạm vào từng bạn nhé.",
   "shapes": [
    "cube",
    "cuboid",
    "sphere",
    "cylinder"
   ]
  },
  {
   "k": "choose",
   "t": "Quả bóng giống khối nào?",
   "opts": [
    "shape:sphere",
    "shape:cube",
    "shape:cylinder"
   ],
   "ok": 0,
   "yes": "Đúng rồi! Quả bóng là khối cầu.",
   "no": "Khối nào lăn tròn được?",
   "art": "⚽"
  },
  {
   "k": "choose",
   "t": "Lon nước giống khối nào?",
   "opts": [
    "shape:cylinder",
    "shape:cuboid",
    "shape:sphere"
   ],
   "ok": 0,
   "yes": "Giỏi quá! Lon nước là khối trụ.",
   "no": "Lon nước tròn và cao, đứng được.",
   "art": "🥫"
  },
  {
   "k": "sum",
   "t": "Bé nhớ nhé!",
   "pts": [
    "Hình tròn: không có góc",
    "Hình vuông: 4 cạnh bằng nhau",
    "Hình tam giác: 3 cạnh",
    "Khối cầu, khối trụ, khối hộp là các hình khối"
   ]
  }
 ],
 "tryit": [
  {
   "q": "Cửa ra vào hình gì?",
   "opts": [
    "Hình chữ nhật",
    "Hình tròn",
    "Hình tam giác"
   ],
   "ok": 0,
   "hint": "Cửa có 2 cạnh dài và 2 cạnh ngắn.",
   "yes": "Đúng rồi!",
   "art": "🚪"
  },
  {
   "q": "Hình nào có 3 cạnh?",
   "opts": [
    "shape:triangle",
    "shape:square",
    "shape:circle"
   ],
   "ok": 0,
   "hint": "Tam là ba. Đếm 3 cạnh nào!",
   "yes": "Đúng rồi!",
   "art": "3️⃣ cạnh"
  },
  {
   "q": "Quyển vở hình gì?",
   "opts": [
    "Hình chữ nhật",
    "Hình tròn",
    "Hình tam giác"
   ],
   "ok": 0,
   "hint": "Quyển vở có 2 cạnh dài, 2 cạnh ngắn.",
   "yes": "Đúng rồi!",
   "art": "📒"
  },
  {
   "q": "Hộp bánh giống khối nào?",
   "opts": [
    "shape:cuboid",
    "shape:sphere",
    "shape:cylinder"
   ],
   "ok": 0,
   "hint": "Hộp bánh có các mặt chữ nhật.",
   "yes": "Đúng rồi!",
   "art": "🎁"
  }
 ]
});
