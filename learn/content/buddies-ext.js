/* BẠN CHỮ MỞ RỘNG: 12 chữ cái còn lại của bảng 29 chữ cái (k l m n p q r s t v x y), nạp SAU content/buddies.js (cùng khuôn: on/name/say/obj/c/rhyme).
   Các bạn này chưa có bài "làm quen" riêng, nên MỞ BẰNG SỐ VÒNG ĐÃ CHƠI: need = số vòng (5 câu/vòng) bé cần chơi, tính từ tổng câu đã làm (learn:m:*).
   Luật mở ở learn/album/lock-hint.js (LearnLock). Vè <= 90 ký tự, tự soạn, an toàn; obj là emoji có trong icons.js.
   CHỜ CHỦ SITE DUYỆT vè và thứ tự mở (bản nháp). Thêm bạn: thêm dòng ở đây, scripts/learn/check-album.js sẽ kiểm độ dài vè và luật mở. */
(function (root) {
  "use strict";
  var X = {
    "k": { on: "que kem", name: "Bạn K", say: "ca", obj: "🍦", c: "#f472b6", rhyme: "Chữ k đứng thẳng như que kem, hai tay dang ra đón em!", need: 1 },
    "l": { on: "chiếc lá", name: "Bạn L", say: "lờ", obj: "🍃", c: "#4ade80", rhyme: "Chữ l đứng thẳng như chiếc lá dài, gió thổi lá đung đưa!", need: 2 },
    "m": { on: "chú mèo", name: "Bạn M", say: "mờ", obj: "🐱", c: "#fb923c", rhyme: "Chữ m như hai tai mèo nhọn, kêu meo meo vui ghê!", need: 3 },
    "n": { on: "cây nấm", name: "Bạn N", say: "nờ", obj: "🍄", c: "#f87171", rhyme: "Chữ n như cây nấm nhỏ, mọc lên sau cơn mưa!", need: 5 },
    "p": { on: "tô phở", name: "Bạn P", say: "pờ", obj: "🍜", c: "#fbbf24", rhyme: "Chữ p có bụng tròn như tô phở, nóng hổi thơm ngon!", need: 7 },
    "q": { on: "quả cam", name: "Bạn Q", say: "quờ", obj: "🍊", c: "#f59e0b", rhyme: "Chữ q tròn như quả cam, có cái đuôi nhỏ phía dưới!", need: 10 },
    "r": { on: "chú rùa", name: "Bạn R", say: "rờ", obj: "🐢", c: "#34d399", rhyme: "Chữ r như cổ rùa thò ra, rùa bò chầm chậm mà chắc!", need: 14 },
    "s": { on: "con rắn", name: "Bạn S", say: "sờ", obj: "🐍", c: "#22d3ee", rhyme: "Chữ s uốn lượn như con rắn, bò nhẹ nhàng trên cỏ!", need: 18 },
    "t": { on: "cái cây", name: "Bạn T", say: "tờ", obj: "🌳", c: "#60a5fa", rhyme: "Chữ t như cái cây có cành ngang, đứng giữa vườn xanh!", need: 24 },
    "v": { on: "chú vịt", name: "Bạn V", say: "vờ", obj: "🦆", c: "#a78bfa", rhyme: "Chữ v như đôi cánh vịt xòe, bơi lội trên ao!", need: 30 },
    "x": { on: "chú cua", name: "Bạn X", say: "xờ", obj: "🦀", c: "#f472b6", rhyme: "Chữ x như đôi càng cua bắt chéo, bò ngang trên cát!", need: 38 },
    "y": { on: "chú yến", name: "Bạn Y", say: "i dài", obj: "🐦", c: "#4ade80", rhyme: "Chữ y như chú yến đậu trên cành, hót líu lo cả ngày!", need: 46 }
  };
  var B = root.LEARN_BUDDIES = root.LEARN_BUDDIES || {}, k;
  root.LEARN_BUDDIES_EXT = X;
  for (k in X) if (!B[k]) B[k] = X[k];
  if (typeof module !== "undefined" && module.exports) module.exports = X;
})(typeof window !== "undefined" ? window : globalThis);
