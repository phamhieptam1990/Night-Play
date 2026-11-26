"use strict";
/* Mã BẢN TRẢ PHÍ của game Sudoku Đêm (Cozy Play): 3 loại riêng (Mini 6×6, Sudoku Chéo, Đua 15 phút) và 4 giao diện đổi HẲN KIỂU Ô + BẢNG:
   Bảng Phấn (ô bo tròn, chữ phấn trên bảng xanh), Neon Đêm (ô rời viền neon), Gỗ Cổ (khung gỗ, ô vuông gỗ sáng), Kẹo Pastel (ô tròn mềm màu kẹo).
   Chỉ giao cho người có Night Pass qua GET /api/pro/sudoku-chu-so.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 34%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const grad = (c, h, a, b) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, 1e4, h); };
  const S = {
    chalk: { h: 150, deco: ["🧑‍🏫", "✏️", "🔢", "📐"], hero: "🧑‍🏫🔢", cg: ["#2f7d5b", "#0d2a1f"], gap: 1.5, rad: 6, paper: "#2f6b50", frame: "#7a5a33", frameR: 10, line: "#cfe9dc", thick: "#ffffff", given: "#ffffff", user: "#ffe36b", noteInk: "#bfe3d0", rel: "#3b7d5f", same: "#4d9a77", sel: "#6bbf96", bad: "#7a2e2e", badInk: "#ffb0b0", diag: "#3a7a5c",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#0f2b20" : "#3d7a5e", dk ? "#08180f" : "#1f5a41"); c.fillStyle = "rgba(255,255,255,.05)"; for (let i = 0; i < 6; i++) c.fillRect(0, 40 + i * 58, w, 2); }, css: "canvas#cv{border-radius:3cqw}" },
    neon: { h: 300, deco: ["🌃", "⚡", "🔢", "💜"], hero: "🌃🔢", cg: ["#a855f7", "#0a0420"], gap: 1.8, rad: 7, paper: "#171238", frame: "#0a0620", frameR: 14, line: "#ff4fd8", thick: "#7cf0ff", given: "#f6e8ff", user: "#7cf0ff", noteInk: "#c8a8f0", rel: "#241a55", same: "#3a2a7a", sel: "#5a2f9a", bad: "#5a1030", badInk: "#ff7a9a", diag: "#2a1a60",
      bg(c, w, h, tm) { grad(c, h, "#0a0420", "#250a45"); c.strokeStyle = "rgba(255,79,216,.14)"; for (let x = 0; x <= w; x += 30) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } }, css: "canvas#cv{border-radius:4cqw}" },
    wood: { h: 30, deco: ["🪵", "🔢", "🌰", "🍂"], hero: "🪵🔢", cg: ["#c98a4b", "#4a2a10"], gap: 0, rad: 0, paper: "#f1d7a8", frame: "#8a5a2b", frameR: 6, line: "#b98a4e", thick: "#4a2a10", given: "#3a200c", user: "#a34a10", noteInk: "#8a6a3a", rel: "#e8c48a", same: "#dfae6a", sel: "#f0b25a", bad: "#f2b2a0", badInk: "#b3221a", diag: "#e8c48a",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#2a1a0c" : "#f0dcb8", dk ? "#150c05" : "#dcb98a"); c.strokeStyle = "rgba(90,50,20,.12)"; c.lineWidth = 2; for (let y = 0; y < h; y += 18) { c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(w * .3, y + 6, w * .6, y - 6, w, y + 3); c.stroke(); } }, css: "canvas#cv{border-radius:2cqw}" },
    candy: { h: 335, deco: ["🍬", "🍭", "🔢", "🧁"], hero: "🍬🔢", cg: ["#ff8fc2", "#7a1b52"], gap: 1.6, rad: 14, paper: "#fff0f8", frame: "#ffd0e6", frameR: 18, line: "#f0a8c8", thick: "#d6468a", given: "#7a1b52", user: "#2f7bdc", noteInk: "#c07aa0", rel: "#ffe0f0", same: "#ffc6e2", sel: "#ff9ccb", bad: "#ffd0c8", badInk: "#d23b3b", diag: "#ffe6f2",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#3b1330" : "#ffd3e8", dk ? "#6a1f4f" : "#ffeef7"); c.fillStyle = dk ? "rgba(255,150,200,.14)" : "rgba(255,255,255,.6)"; for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) { c.beginPath(); c.arc(x * 36 + (y % 2) * 18, y * 36, 6, 0, 6.283); c.fill(); } }, css: "canvas#cv{border-radius:5cqw}" },
    bubble: { h: 205, deco: ["🫧", "⭐", "🔢", "✨"], hero: "🫧🔢", cg: ["#4fc3ff", "#1456c8"], gap: 2.6, rad: 10, paper: "#ffffff", frame: "#3b9bff", frameR: 18, line: "#cfe6ff", thick: "#ffd23f", given: "#2f7bdc", user: "#ff7a1a", noteInk: "#7aa6d8", rel: "#eaf5ff", same: "#cfeaff", sel: "#9fd8ff", bad: "#ffd6d6", badInk: "#e0283c", diag: "#eef7ff",
      digit: ["#ff8a00", "#1f7bff", "#ffb300", "#e53b5a", "#7a4dff", "#00b894", "#ff5fa2", "#2f9bff", "#26a65b", "#ff6b3d"], digitLine: "#ffffff",
      bg(c, w, h, tm) { grad(c, h, "#56c8ff", "#1b6fe6"); c.fillStyle = "rgba(255,255,255,.22)"; for (let i = 0; i < 14; i++) { const x = (i * 83 + tm * 8) % w, y = (i * 47 + Math.sin(tm + i) * 6) % h; c.beginPath(); c.arc(x, y, 3 + (i % 4) * 2.4, 0, 6.283); c.fill(); }
        c.fillStyle = "rgba(255,230,90,.9)"; [[40, 60], [320, 110], [300, 420], [28, 380]].forEach(function (p, k) { const s = 6 + (k % 2) * 3 + Math.sin(tm * 3 + k) * 1.5; c.beginPath(); c.moveTo(p[0], p[1] - s * 2); c.lineTo(p[0] + s * .6, p[1] - s * .6); c.lineTo(p[0] + s * 2, p[1]); c.lineTo(p[0] + s * .6, p[1] + s * .6); c.lineTo(p[0], p[1] + s * 2); c.lineTo(p[0] - s * .6, p[1] + s * .6); c.lineTo(p[0] - s * 2, p[1]); c.lineTo(p[0] - s * .6, p[1] - s * .6); c.closePath(); c.fill(); }); }, css: "canvas#cv{border-radius:5cqw}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = Object.assign({ vl: b.vl, vd: b.vd }, d); delete PF.skins[id].h; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
