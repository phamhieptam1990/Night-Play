/* Bài LÀM QUEN lớp 1 · Làm quen các bạn chữ: b, c, d, đ, g, h: gặp bạn, tô theo, cho ăn, bắn bóng, nghe và chạm. Không cần đọc chữ. Bản NHÁP tự soạn, chờ chủ site duyệt. */
window.LearnLessons.reg({
 "id": "VI-G1-00c",
 "grade": 1,
 "subj": "tviet",
 "title": "Làm quen các bạn chữ: b, c, d, đ, g, h",
 "screens": [
  {
   "k": "say",
   "t": "Xin chào! Cùng gặp các bạn chữ nhé! Chạm vào chữ để nghe.",
   "chips": [
    [
     "b",
     "bờ"
    ],
    [
     "c",
     "cờ"
    ],
    [
     "d",
     "dờ"
    ],
    [
     "đ",
     "đờ"
    ],
    [
     "g",
     "gờ"
    ],
    [
     "h",
     "hờ"
    ]
   ]
  },
  {
   "k": "meet",
   "sym": "b",
   "t": "Gặp bạn b nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "b",
   "t": "Tô theo bạn b nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "c",
   "t": "Gặp bạn c nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "c",
   "t": "Tô theo bạn c nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "d",
   "t": "Gặp bạn d nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "d",
   "t": "Tô theo bạn d nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Bé nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn bờ đâu nào?",
     "opts": [
      "b",
      "d",
      "a"
     ],
     "ok": 0
    },
    {
     "say": "Bạn cờ đâu nào?",
     "opts": [
      "c",
      "h",
      "g"
     ],
     "ok": 0
    },
    {
     "say": "Bạn dờ đâu nào?",
     "opts": [
      "d",
      "o",
      "h"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "meet",
   "sym": "đ",
   "t": "Gặp bạn đ nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "đ",
   "t": "Tô theo bạn đ nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "g",
   "t": "Gặp bạn g nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "g",
   "t": "Tô theo bạn g nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "meet",
   "sym": "h",
   "t": "Gặp bạn h nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "h",
   "t": "Tô theo bạn h nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Bé nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn đờ đâu nào?",
     "opts": [
      "đ",
      "b",
      "c"
     ],
     "ok": 0
    },
    {
     "say": "Bạn gờ đâu nào?",
     "opts": [
      "g",
      "h",
      "b"
     ],
     "ok": 0
    },
    {
     "say": "Bạn hờ đâu nào?",
     "opts": [
      "h",
      "đ",
      "o"
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
     "say": "Bạn nào cầm chú gấu?",
     "art": "🐻",
     "opts": [
      "b",
      "g",
      "d"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm mặt trăng?",
     "art": "🌙",
     "opts": [
      "c",
      "đ",
      "b"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm cái trống?",
     "art": "🥁",
     "opts": [
      "d",
      "h",
      "a"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm cái cửa?",
     "art": "🚪",
     "opts": [
      "đ",
      "h",
      "c"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm kính lúp?",
     "art": "🔍",
     "opts": [
      "g",
      "b",
      "c"
     ],
     "ok": 0
    },
    {
     "say": "Bạn nào cầm cái ghế?",
     "art": "🪑",
     "opts": [
      "h",
      "b",
      "a"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "pop",
   "target": "c",
   "pool": [
    "b",
    "c",
    "d",
    "đ",
    "g",
    "h",
    "a",
    "o"
   ],
   "need": 3,
   "t": "Bắn bóng bay! Chạm vào các bóng có cờ nhé!"
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Bé nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn hờ đâu nào?",
     "opts": [
      "h",
      "c",
      "đ"
     ],
     "ok": 0
    },
    {
     "say": "Bạn đờ đâu nào?",
     "opts": [
      "đ",
      "b",
      "a"
     ],
     "ok": 0
    },
    {
     "say": "Bạn cờ đâu nào?",
     "opts": [
      "c",
      "d",
      "a"
     ],
     "ok": 0
    },
    {
     "say": "Bạn o đâu nào?",
     "opts": [
      "o",
      "d",
      "h"
     ],
     "ok": 0
    },
    {
     "say": "Bạn dờ đâu nào?",
     "opts": [
      "d",
      "c",
      "g"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "sum",
   "t": "Bé nhớ nhé!",
   "pts": [
    "Mỗi chữ cái là một bạn có tên và hình riêng",
    "Nhớ hình bạn cầm để nhớ chữ",
    "Tô chữ bằng ngón tay giúp mình nhớ lâu"
   ]
  }
 ],
 "tryit": [
  {
   "q": "Bạn nào là chú gấu?",
   "art": "🐻",
   "opts": [
    "b",
    "d",
    "h"
   ],
   "ok": 0,
   "hint": "Chữ b như chú gấu bên cây gậy.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Bạn nào là mặt trăng?",
   "art": "🌙",
   "opts": [
    "c",
    "g",
    "o"
   ],
   "ok": 0,
   "hint": "Chữ c như trăng khuyết.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Bạn nào là cái trống?",
   "art": "🥁",
   "opts": [
    "d",
    "đ",
    "b"
   ],
   "ok": 0,
   "hint": "Chữ d như cái trống có cán.",
   "yes": "Đúng rồi!"
  }
 ]
});
