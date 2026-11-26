/* Bài LÀM QUEN lớp 1 · Làm quen các bạn chữ: e, ê, i, u, ư: gặp bạn, tô theo, cho ăn, bắn bóng, nghe và chạm. Không cần đọc chữ. Bản NHÁP tự soạn, chờ chủ site duyệt. */
window.LearnLessons.reg({
 "id": "VI-G1-00b",
 "grade": 1,
 "subj": "tviet",
 "title": "Làm quen các bạn chữ: e, ê, i, u, ư",
 "screens": [
  {
   "k": "say",
   "t": "Xin chào! Cùng gặp các bạn chữ nhé! Chạm vào chữ để nghe.",
   "chips": [
    [
     "e",
     "e"
    ],
    [
     "ê",
     "ê"
    ],
    [
     "i",
     "i"
    ],
    [
     "u",
     "u"
    ],
    [
     "ư",
     "ư"
    ]
   ]
  },
  {
   "k": "meet",
   "sym": "e",
   "t": "Gặp bạn e nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "e",
   "t": "Tô theo bạn e nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "ê",
   "t": "Gặp bạn ê nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "ê",
   "t": "Tô theo bạn ê nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "i",
   "t": "Gặp bạn i nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "i",
   "t": "Tô theo bạn i nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Em nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn e đâu nào?",
     "opts": [
      "e",
      "u",
      "ư"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ê đâu nào?",
     "opts": [
      "ê",
      "i",
      "ư"
     ],
     "ok": 0
    },
    {
     "say": "Bạn i đâu nào?",
     "opts": [
      "i",
      "ê",
      "e"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "meet",
   "sym": "u",
   "t": "Gặp bạn u nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "u",
   "t": "Tô theo bạn u nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "ư",
   "t": "Gặp bạn ư nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "ư",
   "t": "Tô theo bạn ư nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Em nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn i đâu nào?",
     "opts": [
      "i",
      "o",
      "ê"
     ],
     "ok": 0
    },
    {
     "say": "Bạn u đâu nào?",
     "opts": [
      "u",
      "e",
      "o"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ư đâu nào?",
     "opts": [
      "ư",
      "a",
      "o"
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
     "say": "Bạn nào cầm con mắt?",
     "art": "👁️",
     "opts": [
      "e",
      "i",
      "ư"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm chú ếch?",
     "art": "🐸",
     "opts": [
      "ê",
      "ư",
      "i"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm cây nến?",
     "art": "🕯️",
     "opts": [
      "i",
      "u",
      "e"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm cái cốc?",
     "art": "☕",
     "opts": [
      "u",
      "ê",
      "o"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm chú kỳ lân?",
     "art": "🦄",
     "opts": [
      "ư",
      "a",
      "i"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "pop",
   "target": "i",
   "pool": [
    "e",
    "ê",
    "i",
    "u",
    "ư",
    "a",
    "o"
   ],
   "need": 3,
   "t": "Bắn bóng bay! Chạm vào các bóng có i nhé!"
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Em nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn ê đâu nào?",
     "opts": [
      "ê",
      "e",
      "o"
     ],
     "ok": 0
    },
    {
     "say": "Bạn u đâu nào?",
     "opts": [
      "u",
      "o",
      "ê"
     ],
     "ok": 0
    },
    {
     "say": "Bạn ư đâu nào?",
     "opts": [
      "ư",
      "a",
      "u"
     ],
     "ok": 0
    },
    {
     "say": "Bạn a đâu nào?",
     "opts": [
      "a",
      "i",
      "o"
     ],
     "ok": 0
    },
    {
     "say": "Bạn o đâu nào?",
     "opts": [
      "o",
      "e",
      "a"
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
   "q": "Bạn nào là cây nến nhỏ?",
   "art": "🕯️",
   "opts": [
    "i",
    "u",
    "e"
   ],
   "ok": 0,
   "hint": "Chữ i như cây nến có chấm lửa.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Bạn nào là chú ếch?",
   "art": "🐸",
   "opts": [
    "ê",
    "e",
    "ư"
   ],
   "ok": 0,
   "hint": "Bạn ê đội mũ nhọn, kêu ê ê.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Bạn nào là cái cốc?",
   "art": "☕",
   "opts": [
    "u",
    "i",
    "ê"
   ],
   "ok": 0,
   "hint": "Chữ u như cái cốc nhỏ.",
   "yes": "Đúng rồi!"
  }
 ]
});
