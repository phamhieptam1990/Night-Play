/* Bài LÀM QUEN lớp 1 · Làm quen các bạn chữ: a, ă, â, o, ô, ơ: gặp bạn, tô theo, cho ăn, bắn bóng, nghe và chạm. Không cần đọc chữ. Bản NHÁP tự soạn, chờ chủ site duyệt. */
window.LearnLessons.reg({
 "id": "VI-G1-00",
 "grade": 1,
 "subj": "tviet",
 "title": "Làm quen các bạn chữ: a, ă, â, o, ô, ơ",
 "screens": [
  {
   "k": "say",
   "t": "Xin chào! Cùng gặp các bạn chữ nhé! Chạm vào chữ để nghe.",
   "chips": [
    [
     "a",
     "a"
    ],
    [
     "ă",
     "ă"
    ],
    [
     "â",
     "ớ"
    ],
    [
     "o",
     "o"
    ],
    [
     "ô",
     "ô"
    ],
    [
     "ơ",
     "ơ"
    ]
   ]
  },
  {
   "k": "meet",
   "sym": "a",
   "t": "Gặp bạn a nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "a",
   "t": "Tô theo bạn a nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "ă",
   "t": "Gặp bạn ă nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "ă",
   "t": "Tô theo bạn ă nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "â",
   "t": "Gặp bạn â nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "â",
   "t": "Tô theo bạn â nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Em nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn a đâu nào?",
     "opts": [
      "a",
      "ă",
      "â"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ă đâu nào?",
     "opts": [
      "ă",
      "a",
      "ơ"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ớ đâu nào?",
     "opts": [
      "â",
      "ă",
      "a"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "meet",
   "sym": "o",
   "t": "Gặp bạn o nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "o",
   "t": "Tô theo bạn o nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "ô",
   "t": "Gặp bạn ô nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "ô",
   "t": "Tô theo bạn ô nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "ơ",
   "t": "Gặp bạn ơ nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "ơ",
   "t": "Tô theo bạn ơ nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Em nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn o đâu nào?",
     "opts": [
      "o",
      "ô",
      "â"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ô đâu nào?",
     "opts": [
      "ô",
      "â",
      "ă"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ơ đâu nào?",
     "opts": [
      "ơ",
      "a",
      "ô"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "game",
   "t": "Bạn nào cầm đồ vật này? Chạm vào nhé!",
   "done": "Giỏi quá! Em nhớ mặt các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn nào cầm quả táo?",
     "art": "🍎",
     "opts": [
      "a",
      "â",
      "ô"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm cái bát?",
     "art": "🥣",
     "opts": [
      "ă",
      "ơ",
      "ô"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm cái mũ ảo thuật?",
     "art": "🎩",
     "opts": [
      "â",
      "ơ",
      "ô"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm quả bóng?",
     "art": "⚽",
     "opts": [
      "o",
      "ơ",
      "ô"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm mũ đầu bếp?",
     "art": "👨‍🍳",
     "opts": [
      "ô",
      "ơ",
      "ă"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm chú kiến?",
     "art": "🐜",
     "opts": [
      "ơ",
      "ô",
      "a"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "pop",
   "target": "o",
   "pool": [
    "a",
    "ă",
    "â",
    "o",
    "ô",
    "ơ"
   ],
   "need": 3,
   "t": "Bắn bóng bay! Chạm vào các bóng có o nhé!"
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Em nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn ă đâu nào?",
     "opts": [
      "ă",
      "ơ",
      "a"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ớ đâu nào?",
     "opts": [
      "â",
      "a",
      "ô"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ô đâu nào?",
     "opts": [
      "ô",
      "ă",
      "â"
     ],
     "ok": 0
    },
    {
     "say": "Bạn o đâu nào?",
     "opts": [
      "o",
      "â",
      "ă"
     ],
     "ok": 0
    },
    {
     "say": "Bạn a đâu nào?",
     "opts": [
      "a",
      "ơ",
      "ô"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "sum",
   "t": "Em nhớ nhé!",
   "pts": [
    "Mỗi chữ cái là một bạn có tên và hình riêng",
    "Nhớ hình bạn cầm để nhớ chữ",
    "Tô chữ bằng ngón tay giúp mình nhớ lâu"
   ]
  }
 ],
 "tryit": [
  {
   "q": "Bạn nào cầm quả táo?",
   "art": "🍎",
   "opts": [
    "a",
    "o",
    "e"
   ],
   "ok": 0,
   "hint": "Chữ a tròn như quả táo.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Bạn nào cầm quả bóng?",
   "art": "⚽",
   "opts": [
    "o",
    "ô",
    "a"
   ],
   "ok": 0,
   "hint": "Chữ o tròn như quả bóng.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Bạn nào đội mũ đầu bếp?",
   "art": "👨‍🍳",
   "opts": [
    "ô",
    "ơ",
    "o"
   ],
   "ok": 0,
   "hint": "Bạn ô đội mũ bếp, nấu món ngon.",
   "yes": "Đúng rồi!"
  }
 ]
});
