"use strict";
/* Mã BẢN TRẢ PHÍ của game Tìm Đôi Thẻ (Cozy Play): 3 loại riêng (Thẻ Úp, Xáo liên tục, Đua giờ) và 4 giao diện đổi HẲN CÁCH XẾP THẺ + hình thẻ:
   Chợ Tết (đèn lồng, thẻ bao lì xì), Rừng Rậm (cây to có thân, thẻ gỗ), Phố Ẩm Thực (tô phở bốc khói, thẻ sứ), Đồ Chơi Bé (lâu đài hai tháp, thẻ khối nhựa).
   Chỉ giao cho người có Night Pass qua GET /api/pro/tim-doi-the.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. */
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
    tet: { h: 4, icons: ["🧧", "🏮", "🎋", "🍊", "🥮", "🎆", "🐉", "🌸", "🪙", "🍵"], deco: ["🧧", "🏮", "🎆", "🍊"], hero: "🧧🏮", cg: ["#ff5a4a", "#6b0f10"],
      layers: [{ l: 0, oy: 0, rows: ["..###..", ".#####.", "#######", "#######", "#######", ".#####.", "..###.."] }, { l: 1, oy: 1, rows: ["1:..##..", "1:.####.", "1:.####.", "1:..##.."] }, { l: 2, oy: 3, rows: ["5:##"] }],
      face: "#fff4e8", face2: "#ffd9b8", edge: "#d63a2a", rad: 14, back: "#e5362a", back2: "#a31510", slot: "rgba(255,220,170,.7)",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#3a0d0d" : "#ffd9c9", dk ? "#1f0606" : "#fff0e0"); c.font = "22px " + EM; c.globalAlpha = .55; for (let i = 0; i < 6; i++) c.fillText("🏮", 14 + i * 62, 30 + Math.sin(tm * 1.5 + i) * 6); c.globalAlpha = 1; },
      css: "canvas#cv{border-radius:5cqw}" },
    jungle: { h: 135, icons: ["🦁", "🐘", "🦒", "🐒", "🦜", "🐍", "🐅", "🦓", "🦋", "🐸"], deco: ["🦁", "🌴", "🦜", "🐒"], hero: "🦁🌴", cg: ["#4ade80", "#14532d"],
      layers: [{ l: 0, oy: 0, rows: ["..###..", ".#####.", "#######", "#######", ".#####.", "...#...", "...#..."] }, { l: 1, oy: 1, rows: ["1:..##..", "1:.####.", "1:######", "1:.####."] }, { l: 2, oy: 3, rows: ["4:###"] }],
      face: "#f7f1da", face2: "#e2d6a5", edge: "#7a5a2a", rad: 8, back: "#6fae4e", back2: "#3f7a2c", slot: "rgba(255,255,200,.7)",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#0c2b17" : "#b5f0b0", dk ? "#06180d" : "#4fae5a"); c.font = "46px " + EM; c.globalAlpha = .4; c.fillText("🌴", 6, h - 20); c.fillText("🌴", w - 56, h - 24); c.globalAlpha = 1; const r = rnd(7); c.fillStyle = "rgba(255,255,255,.12)"; for (let i = 0; i < 12; i++) { c.beginPath(); c.ellipse(r() * w, r() * h, 8, 3, r() * 3, 0, 6.283); c.fill(); } },
      css: "canvas#cv{border-radius:3cqw}" },
    food: { h: 28, icons: ["🍜", "🥖", "🍢", "🧋", "🍡", "🥟", "🍚", "🍤", "🍋", "🌶️"], deco: ["🍜", "🥖", "🧋", "🍢"], hero: "🍜🥢", cg: ["#fbbf24", "#92400e"],
      layers: [{ l: 0, oy: 0, rows: ["#######", "#######", "#######", ".#####.", "..###..", "...#..."] }, { l: 1, oy: 1, rows: ["1:######", "1:######", "1:.####.", "1:..##.."] }, { l: 2, oy: 2, rows: ["3:###"] }],
      face: "#fffaf0", face2: "#f3e6c8", edge: "#c98a2b", rad: 20, back: "#e8a53a", back2: "#b97312", slot: "rgba(255,240,200,.75)",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#3a2408" : "#ffe9b8", dk ? "#1d1204" : "#ffcf7a"); c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 3; for (let i = 0; i < 5; i++) { const x = 40 + i * 70; c.beginPath(); c.moveTo(x, h); c.quadraticCurveTo(x + 14 * Math.sin(tm + i), h - 40, x, h - 80 - 10 * Math.sin(tm * 1.3 + i)); c.stroke(); } },
      css: "canvas#cv{border-radius:5cqw}" },
    toy: { h: 215, icons: ["🧸", "🎈", "🚂", "🪁", "🎨", "🧩", "🎲", "🪀", "🚀", "🎺"], deco: ["🧸", "🎈", "🧩", "🚂"], hero: "🧸🎈", cg: ["#60a5fa", "#1e3a8a"],
      layers: [{ l: 0, oy: 0, rows: ["#.#.#.#", "#######", "#######", "#######", "#######"] }, { l: 1, oy: 1, rows: ["1:######", "1:######", "1:######"] }, { l: 2, oy: 2, rows: ["2:#####"] }],
      face: "#f4f9ff", face2: "#d3e5ff", edge: "#4f86e0", rad: 9, back: "#ff7aa8", back2: "#d6406f", slot: "rgba(220,235,255,.75)",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#0f1f4a" : "#bfe0ff", dk ? "#08102a" : "#e8f3ff"); const cs = ["#ff7aa8", "#ffd24a", "#5be3a8", "#7aa8ff"]; for (let i = 0; i < 14; i++) { c.fillStyle = cs[i % 4]; c.globalAlpha = .22; c.fillRect((i * 53) % w, ((i * 97 + tm * 12) % (h + 30)) - 20, 18, 18); } c.globalAlpha = 1; },
      css: "canvas#cv{border-radius:3cqw}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = Object.assign({ vl: b.vl, vd: b.vd }, d); delete PF.skins[id].h; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
