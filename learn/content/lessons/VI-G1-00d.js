/* Bài LÀM QUEN lớp 1 · Làm quen chữ hoa: A, Ă, Â, B, C, D: gặp bạn, tô theo, nghe tên chạm đúng bạn, bắn bóng bay, so chữ hoa với chữ thường.
   Không cần đọc chữ. Bản NHÁP tự soạn, chờ chủ site duyệt. */
window.LearnLessons.reg({
 "id": "VI-G1-00d",
 "grade": 1,
 "subj": "tviet",
 "title": "Làm quen chữ hoa: A, Ă, Â, B, C, D",
 "screens": [
  {
   "k": "say",
   "t": "Xin chào! Hôm nay mình gặp các bạn chữ hoa nhé! Chạm vào chữ để nghe.",
   "chips": [
    [
     "A",
     "a hoa"
    ],
    [
     "Ă",
     "ă hoa"
    ],
    [
     "Â",
     "ớ hoa"
    ],
    [
     "B",
     "bờ hoa"
    ],
    [
     "C",
     "cờ hoa"
    ],
    [
     "D",
     "dờ hoa"
    ]
   ]
  },
  {
   "k": "meet",
   "sym": "A",
   "t": "Gặp bạn a hoa nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "A",
   "t": "Tô theo bạn a hoa nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "Ă",
   "t": "Gặp bạn ă hoa nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "Ă",
   "t": "Tô theo bạn ă hoa nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "Â",
   "t": "Gặp bạn ớ hoa nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "Â",
   "t": "Tô theo bạn ớ hoa nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "B",
   "t": "Gặp bạn bờ hoa nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "B",
   "t": "Tô theo bạn bờ hoa nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "C",
   "t": "Gặp bạn cờ hoa nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "C",
   "t": "Tô theo bạn cờ hoa nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "D",
   "t": "Gặp bạn dờ hoa nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "D",
   "t": "Tô theo bạn dờ hoa nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Bé nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn a hoa đâu nào?",
     "opts": [
      "A",
      "Ă",
      "Â"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ă hoa đâu nào?",
     "opts": [
      "Ă",
      "Â",
      "B"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ớ hoa đâu nào?",
     "opts": [
      "Â",
      "A",
      "Ă"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Bé nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn bờ hoa đâu nào?",
     "opts": [
      "B",
      "C",
      "D"
     ],
     "ok": 0
    },
    {
     "say": "Bạn cờ hoa đâu nào?",
     "opts": [
      "C",
      "D",
      "A"
     ],
     "ok": 0
    },
    {
     "say": "Bạn dờ hoa đâu nào?",
     "opts": [
      "D",
      "B",
      "C"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "game",
   "t": "Bạn nào cầm đồ vật này? Chạm vào nhé!",
   "done": "Giỏi quá! Bé nhớ mặt các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn nào cầm cái lều?",
     "art": "⛺",
     "opts": [
      "A",
      "Ă",
      "Â"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm cái mũ nhọn?",
     "art": "🎩",
     "opts": [
      "Â",
      "Ă",
      "B"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm chú ong?",
     "art": "🐝",
     "opts": [
      "B",
      "Â",
      "C"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm mặt trăng?",
     "art": "🌙",
     "opts": [
      "C",
      "B",
      "D"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "pop",
   "target": "A",
   "pool": [
    "A",
    "Ă",
    "Â",
    "B",
    "C",
    "D",
    "a",
    "b"
   ],
   "need": 3,
   "t": "Bắn bóng bay! Chạm vào các bóng có A hoa nhé!"
  },
  {
   "k": "game",
   "t": "Chữ hoa to hơn chữ thường. Chạm vào chữ hoa nhé!",
   "done": "Giỏi quá! Bé biết chữ hoa rồi!",
   "rounds": [
    {
     "say": "Chữ nào là chữ hoa?",
     "opts": [
      "A",
      "a"
     ],
     "ok": 0
    },
    {
     "say": "Chữ nào là chữ hoa?",
     "opts": [
      "B",
      "b"
     ],
     "ok": 0
    },
    {
     "say": "Chữ nào là chữ hoa?",
     "opts": [
      "C",
      "c"
     ],
     "ok": 0
    },
    {
     "say": "Chữ nào là chữ hoa?",
     "opts": [
      "D",
      "d"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "sum",
   "t": "Bé nhớ nhé!",
   "pts": [
    "Chữ hoa to hơn chữ thường",
    "Tên người và đầu câu viết bằng chữ hoa",
    "Tô chữ hoa bằng ngón tay giúp mình nhớ lâu"
   ]
  }
 ],
 "tryit": [
  {
   "q": "Bạn nào là cái lều?",
   "art": "⛺",
   "opts": [
    "A",
    "C",
    "D"
   ],
   "ok": 0,
   "hint": "Chữ A hoa như cái lều có thanh ngang.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Bạn nào là mặt trăng?",
   "art": "🌙",
   "opts": [
    "C",
    "B",
    "A"
   ],
   "ok": 0,
   "hint": "Chữ C hoa cong như trăng khuyết.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Chữ nào là chữ hoa?",
   "opts": [
    "b",
    "B"
   ],
   "ok": 1,
   "hint": "Chữ hoa to hơn chữ thường.",
   "yes": "Đúng rồi!"
  }
 ]
});
