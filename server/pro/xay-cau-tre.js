"use strict";
/* Mã BẢN TRẢ PHÍ của game Xây Cầu Tre (Cozy Play): 3 loại riêng (Sông rộng có trụ, Mưa gió, Hàng nặng) và 4 giao diện đổi HÌNH HỌC HAI BỜ + bối cảnh:
   Kênh miền Tây (bờ thấp, khe hẹp, ghe xuồng), Suối núi cao (khung cao, vực sâu, bờ cao dựng đứng), Ruộng bậc thang (HAI BỜ LỆCH: trái cao phải thấp, cầu phải dốc), Kênh Sài Gòn (khe rộng, nhà cao tầng hai bên).
   Chỉ giao cho người có Night Pass qua GET /api/pro/xay-cau-tre.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const em = "'Apple Color Emoji','Segoe UI Emoji',sans-serif";
  const rr = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const ground = (c, w, h, g, top, side, dirt) => {
    c.fillStyle = dirt; c.beginPath(); c.moveTo(0, g.ly); c.lineTo(g.lx, g.ly); c.lineTo(g.lx, h); c.lineTo(0, h); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(g.rx, g.ry); c.lineTo(w, g.ry); c.lineTo(w, h); c.lineTo(g.rx, h); c.closePath(); c.fill();
    c.fillStyle = top; c.fillRect(0, g.ly - 5, g.lx + 4, 10); c.fillRect(g.rx - 4, g.ry - 5, w - g.rx + 4, 10);
    if (side) { c.fillStyle = side; c.fillRect(g.lx - 6, g.ly, 6, h); c.fillRect(g.rx, g.ry, 6, h); }
  };
  const S = {
    delta: { h: 160, geo: { lx: 80, rx: 280, ly: 260, ry: 260 }, dim: [360, 440], drag: "#0f766e", deco: ["🛶", "🌴", "🥥", "🐟"], hero: "🛶🎋", cg: ["#34d399", "#064e3b"],
      bg(c, w, h, g, dk, tm) { const sg = c.createLinearGradient(0, 0, 0, h); sg.addColorStop(0, dk ? "#0f3a3a" : "#aee6f0"); sg.addColorStop(.5, dk ? "#14565c" : "#d7f2e4"); sg.addColorStop(1, dk ? "#0b3a2a" : "#bfe6a8"); c.fillStyle = sg; c.fillRect(0, 0, w, h); const wy = Math.max(g.ly, g.ry) + 30; c.fillStyle = dk ? "#0d5468" : "#58c4e0"; c.fillRect(g.lx, wy, g.rx - g.lx, h - wy); c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = 2; for (let i = 0; i < 8; i++) { const x = g.lx + ((i * 31 + tm * 14) % (g.rx - g.lx)); c.beginPath(); c.moveTo(x, wy + 10 + (i % 3) * 16); c.lineTo(x + 14, wy + 10 + (i % 3) * 16); c.stroke() } c.font = "34px " + em; c.textAlign = "center"; c.fillText("🛶", g.lx + 40 + ((tm * 14) % 90), wy + 30); c.fillText("🌴", 30, g.ly - 6); c.fillText("🌴", w - 30, g.ry - 6); },
      bank(c, w, h, g, dk) { ground(c, w, h, g, dk ? "#4f8f38" : "#8fd46a", null, dk ? "#5a4326" : "#a67c4a"); },
      css: "canvas#cv{border-radius:3cqw;border:1.2cqw solid #0f766e;box-shadow:0 1.4cqw 0 #064e3b}" },
    mount: { h: 215, geo: { lx: 40, rx: 320, ly: 200, ry: 200 }, dim: [360, 520], drag: "#7c3aed", lbl: "rgba(230,230,255,.9)", deco: ["⛰️", "🌲", "🦅", "☁️"], hero: "⛰️🌉", cg: ["#818cf8", "#1e1b4b"],
      bg(c, w, h, g, dk, tm) { const sg = c.createLinearGradient(0, 0, 0, h); sg.addColorStop(0, dk ? "#1b1f4a" : "#9fb4ff"); sg.addColorStop(.55, dk ? "#2c2a55" : "#e0dcff"); sg.addColorStop(1, dk ? "#10132b" : "#7a73b0"); c.fillStyle = sg; c.fillRect(0, 0, w, h); c.fillStyle = dk ? "rgba(120,110,200,.35)" : "rgba(110,100,190,.3)"; c.beginPath(); c.moveTo(0, 300); c.lineTo(80, 200); c.lineTo(150, 290); c.lineTo(230, 180); c.lineTo(310, 280); c.lineTo(w, 220); c.lineTo(w, h); c.lineTo(0, h); c.fill(); c.fillStyle = "rgba(255,255,255,.55)"; for (let i = 0; i < 3; i++) { const x = ((i * 140 + tm * 10) % (w + 120)) - 60; c.beginPath(); c.ellipse(x, 70 + i * 36, 54, 14, 0, 0, 6.283); c.fill() } c.fillStyle = dk ? "#05060f" : "#4a4580"; c.fillRect(g.lx, g.ly + 120, g.rx - g.lx, h); c.font = "30px " + em; c.textAlign = "center"; c.fillText("🦅", ((tm * 30) % (w + 80)) - 30, 100 + Math.sin(tm) * 10); },
      bank(c, w, h, g, dk) { ground(c, w, h, g, dk ? "#6b8a5c" : "#8fb37a", dk ? "#2f2e4a" : "#6b6a8f", dk ? "#4a4a68" : "#8a89ad"); c.font = "26px " + em; c.fillText("🌲", 14, g.ly - 6); c.fillText("🌲", w - 14, g.ry - 6); },
      css: "canvas#cv{border-radius:3cqw;border:1.2cqw solid #6d28d9;box-shadow:0 0 5cqw rgba(109,40,217,.5)}" },
    paddy: { h: 70, geo: { lx: 60, rx: 300, ly: 200, ry: 280 }, dim: [360, 440], drag: "#d97706", lbl: "rgba(60,40,0,.85)", deco: ["🌾", "🧑‍🌾", "🐃", "🌿"], hero: "🌾🐃", cg: ["#fbbf24", "#78350f"],
      bg(c, w, h, g, dk, tm) { const sg = c.createLinearGradient(0, 0, 0, h); sg.addColorStop(0, dk ? "#3a2a0c" : "#ffe9a8"); sg.addColorStop(1, dk ? "#1f3a14" : "#cfe99a"); c.fillStyle = sg; c.fillRect(0, 0, w, h); c.strokeStyle = dk ? "rgba(255,230,140,.16)" : "rgba(120,160,40,.35)"; c.lineWidth = 3; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(0, 150 + i * 40); c.bezierCurveTo(w * .3, 140 + i * 40, w * .7, 170 + i * 40, w, 150 + i * 40); c.stroke() } const wy = Math.max(g.ly, g.ry) + 50; c.fillStyle = dk ? "#2f5a3c" : "#7ac9b0"; c.fillRect(g.lx, wy, g.rx - g.lx, h - wy); c.font = "30px " + em; c.textAlign = "center"; c.fillText("🐃", 28, g.ly - 6); c.fillText("🌾", w - 26, g.ry - 6); },
      bank(c, w, h, g, dk) { ground(c, w, h, g, dk ? "#6a8f2a" : "#a6d24a", null, dk ? "#5a3f1d" : "#b48a4c"); },
      css: "canvas#cv{border-radius:3cqw;border:1.2cqw solid #b45309;box-shadow:0 1.4cqw 0 #78350f}" },
    city: { h: 290, geo: { lx: 40, rx: 320, ly: 260, ry: 260 }, dim: [360, 440], drag: "#e11d48", lbl: "rgba(255,230,255,.9)", deco: ["🏙️", "🚕", "🏍️", "🌆"], hero: "🏙️🌉", cg: ["#a855f7", "#0f0a2e"],
      bg(c, w, h, g, dk, tm) { const sg = c.createLinearGradient(0, 0, 0, h); sg.addColorStop(0, dk ? "#0b0726" : "#ffb3d9"); sg.addColorStop(.6, dk ? "#2a0f4a" : "#ffe0f0"); sg.addColorStop(1, dk ? "#0a1230" : "#8fa8d9"); c.fillStyle = sg; c.fillRect(0, 0, w, h); const r = rr(5); for (let i = 0; i < 12; i++) { const bw = 26 + r() * 26, bh = 70 + r() * 110, x = i * 32 - 6; c.fillStyle = dk ? "#120a30" : "#6b5b95"; c.fillRect(x, g.ly - bh, bw, bh); c.fillStyle = dk ? "#ffd24a" : "#fff3a0"; for (let k = 0; k < 5; k++) if (r() > .4) c.fillRect(x + 4 + (k % 2) * 12, g.ly - bh + 8 + Math.floor(k / 2) * 18, 6, 8) } const wy = g.ly + 60; c.fillStyle = dk ? "#162a5a" : "#5d7fc0"; c.fillRect(g.lx, wy, g.rx - g.lx, h - wy); c.strokeStyle = "rgba(255,120,200,.4)"; for (let i = 0; i < 6; i++) { const x = g.lx + ((i * 53 + tm * 12) % (g.rx - g.lx)); c.beginPath(); c.moveTo(x, wy + 14); c.lineTo(x + 18, wy + 14); c.stroke() } },
      bank(c, w, h, g, dk) { ground(c, w, h, g, dk ? "#3a3a52" : "#9a9ab8", dk ? "#26263a" : "#74749a", dk ? "#2a2a40" : "#8888aa"); },
      css: "canvas#cv{border-radius:3cqw;border:1.2cqw solid #c026d3;box-shadow:0 0 6cqw rgba(192,38,211,.5)}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, cg: d.cg, geo: d.geo, dim: d.dim, drag: d.drag, lbl: d.lbl, bg: d.bg, bank: d.bank, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
