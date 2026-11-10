"use strict";
/* Mã BẢN TRẢ PHÍ của game Nối Một Nét (Cozy Play): 3 loại riêng (3 mạng, Tốc độ 45 giây, Đồ thị lớn) và 4 giao diện đổi CÁCH ĐẶT ĐIỂM + BỐ CỤC:
   Bản đồ tàu điện (ga xếp lưới, đoạn nối ngang/dọc/chéo, khung cao), Chòm sao (điểm xếp vòng tròn quanh sao trung tâm, khung ngang, bầu trời đêm), Mạch điện (chip trên lưới, đường mạch dày, bảng mạch xanh),
   Phố đèn lồng (điểm rải tự do như đèn lồng treo, dây đèn). Chỉ giao cho người có Night Pass qua GET /api/pro/noi-mot-net.js (hoặc dùng thử / vé chơi hộ).
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% " + ((h >= 222 && h <= 282) ? 54 : 62) + "%)", "--on": (h >= 222 && h <= 282) ? "#ffffff" : "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const em = "'Apple Color Emoji','Segoe UI Emoji',sans-serif";
  const rr = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const S = {
    metro: { h: 215, place: "grid", dim: [330, 440], col: "#e53935", lbl: "rgba(40,60,90,.85)", deco: ["🚇", "🚉", "🚆", "🎫"], hero: "🚇🗺️", cg: ["#3b82f6", "#0b1f4a"],
      bg(c, w, h, tm, dk) { c.fillStyle = dk ? "#101c33" : "#f6f1e3"; c.fillRect(0, 0, w, h); c.strokeStyle = dk ? "rgba(120,160,230,.14)" : "rgba(80,110,160,.14)"; c.lineWidth = 1; for (let x = 0; x < w; x += 18) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() } for (let y = 0; y < h; y += 18) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() } c.fillStyle = dk ? "rgba(70,120,200,.35)" : "rgba(120,180,240,.5)"; c.beginPath(); c.moveTo(0, h * .62); c.bezierCurveTo(w * .3, h * .52, w * .6, h * .78, w, h * .6); c.lineTo(w, h * .7); c.bezierCurveTo(w * .6, h * .88, w * .3, h * .62, 0, h * .72); c.fill(); },
      edge(c, a, b, used, col, tm, dk) { c.lineCap = "round"; c.strokeStyle = used ? col : (dk ? "rgba(200,220,255,.4)" : "rgba(60,80,120,.35)"); c.lineWidth = used ? 10 : 7; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); if (!used) { c.strokeStyle = dk ? "rgba(16,28,51,.9)" : "rgba(246,241,227,.9)"; c.lineWidth = 2; c.stroke() } },
      node(c, n, st, tm, dk) { c.fillStyle = st === "cur" ? "#ffd24a" : "#fff"; c.strokeStyle = dk ? "#cfe0ff" : "#1b2a4a"; c.lineWidth = 4; c.beginPath(); c.arc(n.x, n.y, st === "cur" ? 12 + Math.sin(tm * 8) * 1.5 : 9, 0, 6.283); c.fill(); c.stroke(); },
      css: "canvas#cv{border-radius:2cqw;border:1.6cqw solid #2a4a8a;box-shadow:0 1.4cqw 0 #14264a}" },
    star: { h: 255, place: "ring", dim: [390, 330], col: "#ffe27a", lbl: "rgba(200,210,255,.85)", deco: ["⭐", "🌙", "🔭", "✨"], hero: "🌌🔭", cg: ["#4c1d95", "#030314"],
      bg(c, w, h, tm) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#03041a"); g.addColorStop(1, "#24104a"); c.fillStyle = g; c.fillRect(0, 0, w, h); const r = rr(5); c.fillStyle = "#fff"; for (let i = 0; i < 80; i++) { c.globalAlpha = .25 + .5 * Math.abs(Math.sin(tm + i)); c.fillRect(r() * w, r() * h, 1.5, 1.5) } c.globalAlpha = 1; },
      edge(c, a, b, used, col, tm) { c.lineCap = "round"; c.save(); if (used) { c.shadowColor = col; c.shadowBlur = 14 } c.strokeStyle = used ? col : "rgba(170,190,255,.32)"; c.lineWidth = used ? 4 : 2; c.setLineDash(used ? [] : [5, 6]); c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); c.restore(); },
      node(c, n, st, tm) { const r = st === "cur" ? 13 + Math.sin(tm * 8) * 2 : st === "on" ? 11 : 9; c.save(); c.shadowColor = st === "cur" ? "#ffd24a" : "#9db4ff"; c.shadowBlur = 16; c.fillStyle = st === "cur" ? "#ffd24a" : st === "on" ? "#ffe9a0" : "#dfe8ff"; c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? .45 : 1; c.lineTo(n.x + Math.cos(a) * r * k, n.y + Math.sin(a) * r * k) } c.closePath(); c.fill(); c.restore(); },
      css: "canvas#cv{border-radius:5cqw;border:.9cqw solid #7c5cff;box-shadow:0 0 6cqw rgba(124,92,255,.55)}" },
    circuit: { h: 140, place: "grid", dim: [360, 360], col: "#ffd166", lbl: "rgba(200,255,220,.85)", deco: ["🔌", "💡", "🔋", "⚡"], hero: "🔌💡", cg: ["#16a34a", "#052e16"],
      bg(c, w, h, tm, dk) { c.fillStyle = dk ? "#07301a" : "#0b6b3a"; c.fillRect(0, 0, w, h); c.strokeStyle = "rgba(255,255,255,.07)"; c.lineWidth = 1; for (let x = 0; x < w; x += 12) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() } c.fillStyle = "rgba(255,255,255,.12)"; const r = rr(3); for (let i = 0; i < 14; i++) c.fillRect(r() * w, r() * h, 18, 8); },
      edge(c, a, b, used, col, tm) { c.lineCap = "square"; c.strokeStyle = used ? col : "rgba(200,255,220,.3)"; c.lineWidth = used ? 8 : 5; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); if (used) { c.strokeStyle = "rgba(255,255,255,.6)"; c.lineWidth = 2; c.setLineDash([3, 14]); c.lineDashOffset = -tm * 40; c.stroke(); c.setLineDash([]) } },
      node(c, n, st, tm) { const s = st === "cur" ? 15 : 12; c.fillStyle = st === "cur" ? "#ffd166" : "#d9d9d9"; c.fillRect(n.x - s / 2, n.y - s / 2, s, s); c.strokeStyle = "#1a1a1a"; c.lineWidth = 2; c.strokeRect(n.x - s / 2, n.y - s / 2, s, s); c.fillStyle = "#1a1a1a"; c.beginPath(); c.arc(n.x, n.y, 2.6, 0, 6.283); c.fill(); },
      css: "canvas#cv{border-radius:1cqw;border:1.4cqw solid #1f2937;box-shadow:inset 0 0 0 .5cqw #9ca3af,0 1.4cqw 0 #0b1017}.stats .st b{font-family:'Courier New',monospace}" },
    lantern: { h: 8, place: "free", dim: [360, 400], col: "#ffcf4a", lbl: "rgba(255,230,200,.9)", deco: ["🏮", "🎋", "🥢", "🧧"], hero: "🏮🌃", cg: ["#dc2626", "#2a0606"],
      bg(c, w, h, tm) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1b0a10"); g.addColorStop(1, "#4a1212"); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = "rgba(0,0,0,.45)"; for (let i = 0; i < 6; i++) { const x = i * 64 - 10, hh = 70 + ((i * 53) % 60); c.fillRect(x, h - hh, 56, hh); c.fillStyle = "rgba(255,200,80,.5)"; for (let k = 0; k < 3; k++) c.fillRect(x + 10 + k * 14, h - hh + 12, 6, 8); c.fillStyle = "rgba(0,0,0,.45)" } },
      edge(c, a, b, used, col, tm) { c.lineCap = "round"; c.strokeStyle = used ? col : "rgba(255,210,160,.38)"; c.lineWidth = used ? 5 : 2.4; c.beginPath(); c.moveTo(a.x, a.y); c.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 12, b.x, b.y); c.stroke(); },
      node(c, n, st, tm) { c.save(); c.shadowColor = st === "off" ? "rgba(255,120,40,.5)" : "#ffd24a"; c.shadowBlur = st === "cur" ? 24 : 12; c.font = (st === "cur" ? 38 : 30) + "px " + em; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("🏮", n.x, n.y + Math.sin(tm * 2 + n.x) * 2); c.restore(); },
      css: "canvas#cv{border-radius:3cqw;border:1.2cqw solid #b91c1c;box-shadow:0 0 5cqw rgba(220,38,38,.5)}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, cg: d.cg, dim: d.dim, place: d.place, col: d.col, lbl: d.lbl, bg: d.bg, edge: d.edge, node: d.node, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
