/* Bài LÀM QUEN lớp 1 · Làm quen các bạn Số 6–10: gặp bạn, tô theo, cho ăn, bắn bóng, nghe và chạm. Không cần đọc chữ. Bản NHÁP tự soạn, chờ chủ site duyệt. */
window.LearnLessons.reg({
 "id": "g1_ready_n610",
 "grade": 1,
 "subj": "toan",
 "title": "Làm quen các bạn Số 6–10",
 "screens": [
  {
   "k": "say",
   "t": "Xin chào! Cùng gặp các bạn Số nhé! Chạm vào số để nghe.",
   "chips": [
    [
     "6",
     "Số sáu"
    ],
    [
     "7",
     "Số bảy"
    ],
    [
     "8",
     "Số tám"
    ],
    [
     "9",
     "Số chín"
    ],
    [
     "10",
     "Số mười"
    ]
   ]
  },
  {
   "k": "meet",
   "sym": "6",
   "t": "Gặp bạn sâu nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "6",
   "t": "Tô theo bạn sâu nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "feed",
   "sym": "6",
   "e": "🍪",
   "name": "cái bánh",
   "t": "Bạn sáu đói rồi! Chạm vào sáu cái bánh cho bạn ăn nhé!"
  },
  {
   "k": "meet",
   "sym": "7",
   "t": "Gặp bạn cần câu nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "7",
   "t": "Tô theo bạn cần câu nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "feed",
   "sym": "7",
   "e": "🍓",
   "name": "quả dâu",
   "t": "Bạn bảy đói rồi! Chạm vào bảy quả dâu cho bạn ăn nhé!"
  },
  {
   "k": "meet",
   "sym": "8",
   "t": "Gặp bạn người tuyết nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "8",
   "t": "Tô theo bạn người tuyết nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "feed",
   "sym": "8",
   "e": "🍎",
   "name": "quả táo",
   "t": "Bạn tám đói rồi! Chạm vào tám quả táo cho bạn ăn nhé!"
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Em nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn số sáu đâu nào?",
     "opts": [
      "6",
      "7",
      "8"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số bảy đâu nào?",
     "opts": [
      "7",
      "6",
      "9"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số tám đâu nào?",
     "opts": [
      "8",
      "7",
      "10"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "meet",
   "sym": "9",
   "t": "Gặp bạn bóng bay nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "9",
   "t": "Tô theo bạn bóng bay nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "feed",
   "sym": "9",
   "e": "🍌",
   "name": "quả chuối",
   "t": "Bạn chín đói rồi! Chạm vào chín quả chuối cho bạn ăn nhé!"
  },
  {
   "k": "meet",
   "sym": "10",
   "t": "Gặp bạn kẹo mút nè! Chạm vào bạn để chào nhé!"
  },
  {
   "k": "trace",
   "sym": "10",
   "t": "Tô theo bạn kẹo mút nhé! Dùng ngón tay vẽ."
  },
  {
   "k": "feed",
   "sym": "10",
   "e": "🍇",
   "name": "quả nho",
   "t": "Bạn mười đói rồi! Chạm vào mười quả nho cho bạn ăn nhé!"
  },
  {
   "k": "pop",
   "target": "8",
   "pool": [
    "6",
    "7",
    "8",
    "9",
    "10"
   ],
   "need": 3,
   "t": "Bắn bóng bay! Chạm vào các bóng có số tám nhé!"
  },
  {
   "k": "game",
   "t": "Nghe tên rồi chạm vào đúng bạn nhé!",
   "done": "Giỏi quá! Em nhận ra các bạn rồi!",
   "rounds": [
    {
     "say": "Bạn số chín đâu nào?",
     "opts": [
      "9",
      "7",
      "8"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số bảy đâu nào?",
     "opts": [
      "7",
      "9",
      "10"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số tám đâu nào?",
     "opts": [
      "8",
      "10",
      "9"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số sáu đâu nào?",
     "opts": [
      "6",
      "7",
      "8"
     ],
     "ok": 0
    },
    {
     "say": "Bạn số mười đâu nào?",
     "opts": [
      "10",
      "6",
      "9"
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
     "say": "Có mấy cái bánh?",
     "art": "🍪🍪🍪🍪🍪🍪",
     "opts": [
      "6",
      "5",
      "7"
     ],
     "ok": 0
    },
    {
     "say": "Có mấy chú bọ rùa?",
     "art": "🐞🐞🐞🐞🐞🐞🐞🐞",
     "opts": [
      "8",
      "7",
      "9"
     ],
     "ok": 0
    },
    {
     "say": "Có mấy quả dâu?",
     "art": "🍓🍓🍓🍓🍓🍓🍓",
     "opts": [
      "7",
      "6",
      "8"
     ],
     "ok": 0
    },
    {
     "say": "Có mấy ngôi sao?",
     "art": "🌟🌟🌟🌟🌟🌟🌟🌟🌟",
     "opts": [
      "9",
      "8",
      "10"
     ],
     "ok": 0
    },
    {
     "say": "Có mấy chú gà con?",
     "art": "🐥🐥🐥🐥🐥🐥🐥🐥🐥🐥",
     "opts": [
      "10",
      "9",
      "8"
     ],
     "ok": 0
    }
   ]
  },
  {
   "k": "sum",
   "t": "Em nhớ nhé!",
   "pts": [
    "Mỗi số là một bạn có tên riêng",
    "Đếm đồ vật để biết là số mấy",
    "Tô số bằng ngón tay giúp mình nhớ lâu"
   ]
  }
 ],
 "tryit": [
  {
   "q": "Bạn Người Tuyết là số mấy?",
   "art": "⛄",
   "opts": [
    "8",
    "6",
    "9"
   ],
   "ok": 0,
   "hint": "Người tuyết có hai vòng tròn giống số tám.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Có mấy quả dâu?",
   "art": "🍓🍓🍓🍓🍓🍓🍓",
   "opts": [
    "7",
    "6",
    "8"
   ],
   "ok": 0,
   "hint": "Đếm từng quả dâu, không bỏ sót.",
   "yes": "Đúng rồi!"
  },
  {
   "q": "Bạn Kẹo Mút là số mấy?",
   "art": "🍭",
   "opts": [
    "10",
    "9",
    "8"
   ],
   "ok": 0,
   "hint": "Kẹo mút có một que và một vòng tròn.",
   "yes": "Đúng rồi!"
  }
 ]
});
