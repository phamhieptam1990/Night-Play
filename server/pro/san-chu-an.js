"use strict";
/* Mã BẢN TRẢ PHÍ của game Săn Chữ Ẩn (Cozy Play): 3 loại riêng (Từ ẩn, Đua giờ, Bão chữ) và 4 giao diện đổi HẲN HÌNH Ô CHỮ + BỘ TỪ:
   Sở Thú (ô chữ hình bát giác, từ con vật), Phố Ẩm Thực (hình tròn, đồ ăn), Vũ Trụ (hình thoi, thiên văn), Biển Xanh (hình chữ thập, sinh vật biển).
   Chỉ giao cho người có Night Pass qua GET /api/pro/san-chu-an.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 34%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const grad = (c, h, a, b) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, 1e4, h); };
  const rnd = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const S = {
    zoo: { h: 130, shape: "octagon", deco: ["🦁", "🐘", "🦒", "🐼"], hero: "🦁🌿", cg: ["#4ade80", "#14532d"], paper: "#fdf3c8", ink: "#3d5a1a", cap: ["#ff9aa8", "#8fd3ff", "#ffc36b", "#cdb4ff", "#7be3c8", "#ffe36b"],
      words: [["LION", "sư tử"], ["TIGER", "hổ"], ["ZEBRA", "ngựa vằn"], ["MONKEY", "khỉ"], ["PANDA", "gấu trúc"], ["KOALA", "gấu koala"], ["CAMEL", "lạc đà"], ["SNAKE", "rắn"], ["EAGLE", "đại bàng"], ["SHARK", "cá mập"], ["HORSE", "ngựa"], ["ELEPHANT", "voi"], ["GIRAFFE", "hươu cao cổ"], ["PARROT", "vẹt"]],
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#0c2b17" : "#b5f0b0", dk ? "#06180d" : "#4fae5a"); c.font = "40px 'Apple Color Emoji','Segoe UI Emoji',sans-serif"; c.globalAlpha = .35; c.fillText("🌴", 4, h - 10); c.fillText("🌴", w - 48, h - 12); c.globalAlpha = 1; }, css: "canvas#cv{border-radius:3cqw}" },
    food: { h: 28, shape: "round", deco: ["🍜", "🥖", "🧋", "🍢"], hero: "🍜🥢", cg: ["#fbbf24", "#92400e"], paper: "#fffaf0", ink: "#7a3a0a", cap: ["#ffb199", "#ffd36b", "#a6e3a1", "#9fd8ff", "#f4b6e6", "#c7b6ff"],
      words: [["PIZZA", "bánh pizza"], ["NOODLE", "mì"], ["APPLE", "táo"], ["BREAD", "bánh mì"], ["CHEESE", "phô mai"], ["SUSHI", "sushi"], ["CANDY", "kẹo"], ["JUICE", "nước ép"], ["SALAD", "salad"], ["CAKE", "bánh ngọt"], ["RICE", "cơm"], ["SOUP", "súp"], ["EGG", "trứng"], ["MILK", "sữa"]],
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#3a2408" : "#ffe9b8", dk ? "#1d1204" : "#ffcf7a"); c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 3; for (let i = 0; i < 5; i++) { const x = 40 + i * 70; c.beginPath(); c.moveTo(x, h); c.quadraticCurveTo(x + 14 * Math.sin(tm + i), h - 40, x, h - 80 - 10 * Math.sin(tm * 1.3 + i)); c.stroke(); } }, css: "canvas#cv{border-radius:5cqw}" },
    space: { h: 275, shape: "diamond", deco: ["🚀", "🪐", "⭐", "🛸"], hero: "🚀🪐", cg: ["#6d4cff", "#060720"], paper: "#e8ecff", ink: "#1f2a66", cap: ["#ff9aa8", "#8fd3ff", "#b8e986", "#ffd36b", "#cdb4ff", "#7be3c8"],
      words: [["MOON", "mặt trăng"], ["STAR", "ngôi sao"], ["COMET", "sao chổi"], ["ROCKET", "tên lửa"], ["PLANET", "hành tinh"], ["EARTH", "trái đất"], ["ORBIT", "quỹ đạo"], ["ALIEN", "người ngoài hành tinh"], ["GALAXY", "thiên hà"], ["SUN", "mặt trời"], ["MARS", "sao Hoả"], ["SPACE", "vũ trụ"], ["SATURN", "sao Thổ"], ["EXPLORE", "khám phá"]],
      bg(c, w, h, tm) { grad(c, h, "#050618", "#2a1058"); const r = rnd(9); c.fillStyle = "#fff"; for (let i = 0; i < 80; i++) { c.globalAlpha = .25 + .6 * Math.abs(Math.sin(tm * 1.3 + i)); c.fillRect(r() * w, r() * h, 1.6, 1.6); } c.globalAlpha = 1; }, css: "canvas#cv{border-radius:4cqw}" },
    sea: { h: 195, shape: "cross", deco: ["🐠", "🫧", "🐚", "🐙"], hero: "🐠🌊", cg: ["#38bdf8", "#082f5a"], paper: "#e6f8ff", ink: "#0b3a5c", cap: ["#ffb199", "#ffd36b", "#a6e3a1", "#f4b6e6", "#c7b6ff", "#9fe8ff"],
      words: [["SHARK", "cá mập"], ["WHALE", "cá voi"], ["CORAL", "san hô"], ["SHELL", "vỏ sò"], ["CRAB", "cua"], ["WAVE", "sóng"], ["FISH", "cá"], ["SQUID", "mực"], ["PEARL", "ngọc trai"], ["BOAT", "thuyền"], ["OCTOPUS", "bạch tuộc"], ["TURTLE", "rùa"], ["SEAL", "hải cẩu"], ["ISLAND", "hòn đảo"]],
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#04304f" : "#8bdcf8", dk ? "#02152a" : "#2386c4"); const r = rnd(5); c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1.6; for (let i = 0; i < 14; i++) { const x = r() * w, sp = 12 + r() * 20, y = h - ((tm * sp + r() * h) % h); c.beginPath(); c.arc(x + Math.sin(tm + i) * 4, y, 2 + r() * 5, 0, 6.283); c.stroke(); } }, css: "canvas#cv{border-radius:5cqw}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = Object.assign({ vl: b.vl, vd: b.vd }, d); delete PF.skins[id].h; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
