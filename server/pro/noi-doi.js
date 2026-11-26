"use strict";
/* Mã BẢN TRẢ PHÍ của game Nối Đôi (Cozy Play): 3 loại riêng (Đua giờ, Rơi xuống, Xáo liên tục) và 3 giao diện đổi HẲN kiểu thẻ + nền + màu đường nối:
   Rừng Rậm (thẻ gỗ, đường nối dây leo), Phố Ẩm Thực (thẻ sứ bo tròn, đường nối sợi mì), Đồ Chơi Bé (thẻ khối nhựa, đường nối ruy băng).
   Chỉ giao cho người có Night Pass qua GET /api/pro/noi-doi.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 36%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const grad = (c, h, a, b) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, 1e4, h); };
  const rnd = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const EM = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
  const S = {
    jungle: { h: 135, icons: ["🦁", "🐘", "🦒", "🐒", "🦜", "🐍", "🐅", "🦓", "🦋", "🐸", "🐼", "🦊"], deco: ["🦁", "🌴", "🦜", "🐒"], hero: "🦁🌴", cg: ["#4ade80", "#14532d"],
      face: "#f7f1da", face2: "#e2d6a5", edge: "#7a5a2a", rad: 8, line: "#3ddc4a", board: "rgba(20,70,30,.28)",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#0c2b17" : "#b5f0b0", dk ? "#06180d" : "#4fae5a"); c.font = "46px " + EM; c.globalAlpha = .4; c.fillText("🌴", 6, h - 20); c.fillText("🌴", w - 56, h - 24); c.globalAlpha = 1;
        const r = rnd(7); c.fillStyle = "rgba(255,255,255,.12)"; for (let i = 0; i < 12; i++) { c.beginPath(); c.ellipse(r() * w, r() * h, 8, 3, r() * 3, 0, 6.283); c.fill(); } },
      css: "canvas#cv{border-radius:3cqw}" },
    food: { h: 28, icons: ["🍜", "🥖", "🍢", "🧋", "🍡", "🥟", "🍚", "🍤", "🍋", "🌶️", "🍣", "🍩"], deco: ["🍜", "🥖", "🧋", "🍢"], hero: "🍜🥢", cg: ["#fbbf24", "#92400e"],
      face: "#fffaf0", face2: "#f3e6c8", edge: "#c98a2b", rad: 16, line: "#ff8a1f", board: "rgba(160,90,10,.22)",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#3a2408" : "#ffe9b8", dk ? "#1d1204" : "#ffcf7a"); c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 3;
        for (let i = 0; i < 5; i++) { const x = 40 + i * 70; c.beginPath(); c.moveTo(x, h); c.quadraticCurveTo(x + 14 * Math.sin(tm + i), h - 40, x, h - 80 - 10 * Math.sin(tm * 1.3 + i)); c.stroke(); } },
      css: "canvas#cv{border-radius:5cqw}" },
    toy: { h: 215, icons: ["🧸", "🎈", "🚂", "🪁", "🎨", "🧩", "🎲", "🪀", "🚀", "🎺", "🪅", "🤖"], deco: ["🧸", "🎈", "🧩", "🚂"], hero: "🧸🎈", cg: ["#60a5fa", "#1e3a8a"],
      face: "#f4f9ff", face2: "#d3e5ff", edge: "#4f86e0", rad: 9, line: "#ff4f9a", board: "rgba(40,80,170,.2)",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#0f1f4a" : "#bfe0ff", dk ? "#08102a" : "#e8f3ff"); const cs = ["#ff7aa8", "#ffd24a", "#5be3a8", "#7aa8ff"];
        for (let i = 0; i < 14; i++) { c.fillStyle = cs[i % 4]; c.globalAlpha = .22; c.fillRect((i * 53) % w, ((i * 97 + tm * 12) % (h + 30)) - 20, 18, 18); } c.globalAlpha = 1; },
      css: "canvas#cv{border-radius:3cqw}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = Object.assign({ vl: b.vl, vd: b.vd }, d); delete PF.skins[id].h; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
