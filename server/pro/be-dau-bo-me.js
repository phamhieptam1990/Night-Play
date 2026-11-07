"use strict";
/* Mã BẢN TRẢ PHÍ của game Bé Đấu Bố Mẹ (Pop Play): 20 GIAO DIỆN Night Pass (4 cho mỗi loại câu hỏi; giao diện "basic" miễn phí nằm sẵn trong trang game).
   Mỗi giao diện = nền riêng cho nửa Bé và nửa Bố mẹ + thẻ câu hỏi / nút đáp án / khung viền / bóng riêng + hình rơi trang trí + CSS riêng.
   Chỉ giao cho người có Night Pass qua GET /api/pro/be-dau-bo-me.js (hoặc bản dùng thử 1 ván), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv;
  const S = [
    { /* ===== 0 · TÍNH NHANH ===== */
      space: { vars: v("linear-gradient(#050b2a,#1b2f7a)", "linear-gradient(#2a0f4d,#6a1f8a)", "#14214f", "#e0ecff", "#6ee7ff", "#02202a", "2cqw", ".7cqw solid #6ee7ff", "0 0 3cqw rgba(110,231,255,.45)"), deco: ["🚀", "⭐", "🪐"], css: ".ab{clip-path:polygon(8% 0,92% 0,100% 14%,100% 86%,92% 100%,8% 100%,0 86%,0 14%)}" },
      candy: { vars: v("linear-gradient(#ffd3ea,#ffb0d6)", "linear-gradient(#d6f0ff,#b6e0ff)", "#fff0f8", "#6b1d4a", "#ff4fa3", "#fff", "9cqw", ".9cqw dashed #fff", "0 1cqw 0 rgba(255,79,163,.45)"), deco: ["🍭", "🍬", "🧁"], css: ".ab{border-radius:999px}" },
      ring: { vars: v("linear-gradient(#ffe0b0,#ff9a4a)", "linear-gradient(#ffb0b0,#e84a4a)", "#fff", "#5a1a0a", "#d62828", "#fff", "3cqw", "1cqw solid #5a1a0a", "0 1cqw 0 rgba(90,26,10,.5)"), deco: ["🥊", "💥", "🏆"], css: ".qb{text-shadow:0 .6cqw 0 rgba(214,40,40,.25)}" },
      chalk: { vars: v("linear-gradient(#2d4a3a,#1f3a2c)", "linear-gradient(#3a3a4a,#262636)", "rgba(255,255,255,.07)", "#f4f1de", "#ffd166", "#2d3a2c", "3cqw", ".6cqw dashed #f4f1de", "none"), deco: ["✏️", "📐", "➕"], css: ".qcard{backdrop-filter:none}.qb,.qp{font-family:'Comic Sans MS','Baloo 2',cursive}" }
    },
    { /* ===== 1 · TÌM CHỮ ===== */
      lantern: { vars: v("linear-gradient(#1a1040,#4b2a7a)", "linear-gradient(#3a1050,#7a2a6a)", "#2a1a5e", "#fff3c8", "#ffb703", "#2a1a00", "5cqw", ".8cqw solid #ffb703", "0 0 3cqw rgba(255,183,3,.55)"), deco: ["🏮", "✨", "🌙"], css: ".qb{text-shadow:0 0 2cqw #ffb703}" },
      jungle: { vars: v("linear-gradient(#bff0b0,#4fae6a)", "linear-gradient(#d6f5b0,#8fcf6a)", "#f4ffe8", "#1f3d1f", "#e07a1f", "#fff", "3cqw", "1cqw solid #2f7a45", "0 1cqw 0 rgba(31,90,50,.5)"), deco: ["🌿", "🦜", "🍃"], css: "" },
      ocean: { vars: v("linear-gradient(#aef0ff,#3a8fd0)", "linear-gradient(#b8e8ff,#2a6fb0)", "#f0fbff", "#0b3a5a", "#ff7a59", "#fff", "7cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(11,58,90,.3)"), deco: ["🌊", "🐠", "🫧"], css: "" },
      book: { vars: v("linear-gradient(#fff2d6,#e8c99a)", "linear-gradient(#f5e6c8,#d8b680)", "#fffaf0", "#4a2f14", "#a0522d", "#fff", "2cqw", ".7cqw double #a0522d", "0 .8cqw 0 rgba(120,70,20,.35)"), deco: ["📖", "✒️", "🔖"], css: ".qb,.qp{font-family:Georgia,'Baloo 2',serif}" }
    },
    { /* ===== 2 · ĐẾM ĐẾM ===== */
      farm: { vars: v("linear-gradient(#ffe9a8,#9ad07a)", "linear-gradient(#ffd9a0,#a5d68a)", "#fffdf0", "#4a3510", "#c0392b", "#fff", "4cqw", "1cqw solid #8a5a2b", "0 1cqw 0 rgba(120,80,30,.4)"), deco: ["🚜", "🌽", "🐔"], css: "" },
      zoo: { vars: v("linear-gradient(#ffd9a0,#8fc98a)", "linear-gradient(#ffe5b0,#7fbf7a)", "#fff", "#3a2a10", "#e67e22", "#fff", "6cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(60,100,40,.3)"), deco: ["🦁", "🐘", "🦒"], css: "" },
      sea: { vars: v("linear-gradient(#0a3a6a,#031a3a)", "linear-gradient(#0a4a5a,#02222a)", "rgba(255,255,255,.1)", "#d8f4ff", "#2ee6c8", "#012a24", "5cqw", ".7cqw solid #2ee6c8", "0 0 3cqw rgba(46,230,200,.4)"), deco: ["🐙", "🫧", "🐟"], css: "" },
      firefly: { vars: v("linear-gradient(#0e1b3d,#2c3f78)", "linear-gradient(#1a2a4a,#3a4f88)", "#1f2f63", "#e8f0ff", "#c8ff6a", "#12210a", "5cqw", ".7cqw solid #c8ff6a", "0 0 3cqw rgba(200,255,106,.4)"), deco: ["✨", "🌙", "🪲"], css: ".qb{text-shadow:0 0 1.5cqw #c8ff6a}" }
    },
    { /* ===== 3 · SỐ TO SỐ NHỎ ===== */
      snow: { vars: v("linear-gradient(#e8f4ff,#b9d8f2)", "linear-gradient(#f0f8ff,#c8e4f8)", "#fff", "#1f3b57", "#3b82f6", "#fff", "8cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,110,170,.28)"), deco: ["❄️", "⛄", "✨"], css: "" },
      desert: { vars: v("linear-gradient(#ffe0a0,#e8a860)", "linear-gradient(#ffd890,#d89850)", "#fff7e0", "#5a3510", "#c0541c", "#fff", "4cqw", "1cqw solid #b5541c", "0 1cqw 0 rgba(120,60,10,.4)"), deco: ["🏜️", "🌵", "🐪"], css: "" },
      volcano: { vars: v("linear-gradient(#3a0e0e,#c8401a)", "linear-gradient(#4a1010,#e0601a)", "#2a0a0a", "#ffe8d0", "#ffb020", "#2a1000", "3cqw", ".7cqw solid #ffb020", "0 0 3cqw rgba(255,120,20,.5)"), deco: ["🌋", "🔥", "💥"], css: "" },
      sky: { vars: v("linear-gradient(#9ad8ff,#e8f7ff)", "linear-gradient(#b8e4ff,#f4fbff)", "#fff", "#1f4a6a", "#5aa0ff", "#fff", "10cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,140,220,.3)"), deco: ["☁️", "🪁", "🎈"], css: ".ab{border-radius:50%}" }
    },
    { /* ===== 4 · DÃY SỐ BÍ ẨN ===== */
      race: { vars: v("linear-gradient(#555,#222)", "linear-gradient(#666,#2a2a2a)", "#1a1a1a", "#fff", "#ffdd00", "#1a1a00", "2cqw", ".7cqw solid #ffdd00", "0 0 2cqw rgba(255,221,0,.35)"), deco: ["🏎️", "🏁", "🛞"], css: ".qb{letter-spacing:.3cqw}" },
      robot: { vars: v("linear-gradient(#cfd8e8,#8fa0c0)", "linear-gradient(#dde4f0,#a0b0d0)", "#f4f7fc", "#1f2f4a", "#2f7bff", "#fff", "1.5cqw", ".8cqw solid #5a6a8a", "0 1cqw 0 rgba(40,60,100,.4)"), deco: ["🤖", "⚙️", "🔩"], css: ".qb{font-family:'Courier New',monospace}" },
      magic: { vars: v("linear-gradient(#3a1a6a,#9a3aa0)", "linear-gradient(#4a2a7a,#b04ab0)", "#2a1050", "#f8e8ff", "#ffd54a", "#2a1a00", "6cqw", ".7cqw solid #ffd54a", "0 0 3.5cqw rgba(255,213,74,.5)"), deco: ["🪄", "✨", "🔮"], css: ".qb{text-shadow:0 0 2cqw #ffd54a}" },
      rail: { vars: v("linear-gradient(#d9c9a8,#8a7a5a)", "linear-gradient(#e6d8b8,#9a8a6a)", "#fffaf0", "#3a2a14", "#c0392b", "#fff", "3cqw", "1cqw solid #5a4a2a", "0 1cqw 0 rgba(60,40,10,.4)"), deco: ["🚂", "🚉", "🛤️"], css: "" }
    }
  ];
  for (let t = 0; t < 5; t++) for (const id in S[t]) PF.skins[t][id] = S[t][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
