/* Bài LÀM QUEN lớp 1 · Làm quen các bạn Số 0–5: gặp bạn, tô theo, cho ăn, bắn bóng, nghe và chạm. Không cần đọc chữ. Bản NHÁP tự soạn, chờ chủ site duyệt. */
window.LearnLessons.reg({
 "id": "g1_ready_n05",
 "grade": 1,
 "subj": "toan",
 "title": "Làm quen các bạn Số 0–5",
 "screens": [
  {
   "k": "say",
   "t": "Xin chào! Cùng gặp các bạn Số nhé! Chạm vào số để nghe.",
   "chips": [
    [
     "0",
     "Số không"
    ],
    [
     "1",
     "Số một"
    ],
    [
     "2",
     "Số hai"
    ],
    [
     "3",
     "Số ba"
    ],
    [
     "4",
     "Số bốn"
    ],
    [
     "5",
     "Số năm"
    ]
   ]
  },
  {
   "k": "meet",
   "sym": "0",
   "t": "Gặp bạn trứng nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "0",
   "t": "Tô theo bạn trứng nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "1",
   "t": "Gặp bạn bút chì nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "1",
   "t": "Tô theo bạn bút chì nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "feed",
   "sym": "1",
   "e": "🍎",
   "name": "quả táo",
   "t": "Bạn một đói rồi! Chạm vào một quả táo cho bạn ăn nhé!"
  },
  {
   "k": "meet",
   "sym": "2",
   "t": "Gặp bạn thiên nga nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "2",
   "t": "Tô theo bạn thiên nga nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "feed",
   "sym": "2",
   "e": "🍪",
   "name": "cái bánh",
   "t": "Bạn hai đói rồi! Chạm vào hai cái bánh cho bạn ăn nhé!"
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Bé nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn số không đâu nào?",
     "opts": [
      "0",
      "4",
      "1"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số một đâu nào?",
     "opts": [
      "1",
      "0",
      "2"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số hai đâu nào?",
     "opts": [
      "2",
      "3",
      "0"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "meet",
   "sym": "3",
   "t": "Gặp bạn bướm nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "3",
   "t": "Tô theo bạn bướm nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "feed",
   "sym": "3",
   "e": "🍓",
   "name": "quả dâu",
   "t": "Bạn ba đói rồi! Chạm vào ba quả dâu cho bạn ăn nhé!"
  },
  {
   "k": "meet",
   "sym": "4",
   "t": "Gặp bạn thuyền nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "4",
   "t": "Tô theo bạn thuyền nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "feed",
   "sym": "4",
   "e": "🍌",
   "name": "quả chuối",
   "t": "Bạn bốn đói rồi! Chạm vào bốn quả chuối cho bạn ăn nhé!"
  },
  {
   "k": "meet",
   "sym": "5",
   "t": "Gặp bạn đội mũ nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "5",
   "t": "Tô theo bạn đội mũ nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "feed",
   "sym": "5",
   "e": "🥕",
   "name": "củ cà rốt",
   "t": "Bạn năm đói rồi! Chạm vào năm củ cà rốt cho bạn ăn nhé!"
  },
  {
   "k": "pop",
   "target": "3",
   "pool": [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5"
   ],
   "need": 3,
   "t": "Bắn bóng bay! Chạm vào các bóng có số ba nhé!"
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Bé nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn số một đâu nào?",
     "opts": [
      "1",
      "0",
      "5"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số không đâu nào?",
     "opts": [
      "0",
      "4",
      "1"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số hai đâu nào?",
     "opts": [
      "2",
      "0",
      "4"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số ba đâu nào?",
     "opts": [
      "3",
      "1",
      "2"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số bốn đâu nào?",
     "opts": [
      "4",
      "0",
      "5"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "game",
   "t": "Đếm hình rồi chạm vào đúng bạn Số nhé!",
   "done": "Đếm giỏi quá!",
   "rounds": [
    {
     "say": "Có mấy quả táo?",
     "art": "🍎🍎",
     "opts": [
      "2",
      "1",
      "3"
     ],
     "ok": 0
    },
    {
     "say": "Có mấy chú cá?",
     "art": "🐟🐟🐟🐟",
     "opts": [
      "4",
      "3",
      "5"
     ],
     "ok": 0
    },
    {
     "say": "Có mấy bông hoa?",
     "art": "🌸",
     "opts": [
      "1",
      "0",
      "2"
     ],
     "ok": 0
    },
    {
     "say": "Có mấy ngôi sao?",
     "art": "⭐⭐⭐⭐⭐",
     "opts": [
      "5",
      "4",
      "6"
     ],
     "ok": 0
    },
    {
     "say": "Có mấy quả bóng?",
     "art": "🎈🎈🎈",
     "opts": [
      "3",
      "2",
      "4"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "sum",
   "t": "Bé nhớ nhé!",
   "pts": [
    "Mỗi số là một bạn có tên riêng",
    "Đếm đồ vật để biết là số mấy",
    "Tô số bằng ngón tay giúp mình nhớ lâu"
   ]
  }
 ],
 "tryit": [
  {
   "q": "Có mấy chú cá?",
   "art": "🐟🐟🐟",
   "opts": [
    "3",
    "2",
    "4"
   ],
   "ok": 0,
   "hint": "Chạm từng chú cá và đếm: một, hai, ba.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Bạn Thiên Nga là số mấy?",
   "art": "🦢",
   "opts": [
    "2",
    "3",
    "5"
   ],
   "ok": 0,
   "hint": "Thiên nga cong cổ giống số hai.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Có mấy ngôi sao?",
   "art": "⭐⭐⭐⭐⭐",
   "opts": [
    "5",
    "4",
    "3"
   ],
   "ok": 0,
   "hint": "Đếm từng ngôi sao nhé.",
   "yes": "Đúng rồi!"
  }
 ]
});
