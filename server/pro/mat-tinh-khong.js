"use strict";
/* Mã BẢN TRẢ PHÍ của game Mắt Tinh Không? (Cozy Play): 3 loại riêng (Khác sắc độ, 3 mạng, Tốc độ 30 giây) và 4 giao diện đổi HẲN CÁCH XẾP Ô + bố cục:
   Tổ ong mật (lục giác xếp so le, mật vàng chảy), Đĩa petri (ô tròn xếp theo vòng đồng tâm trong đĩa tròn), Bầu trời sao (ô rải ngẫu nhiên như các ngôi sao, khung cao),
   Tường kính màu (gạch chữ nhật xếp so le như tường nhà thờ, khe vữa). Chỉ giao cho người có Night Pass qua GET /api/pro/mat-tinh-khong.js (hoặc dùng thử / vé chơi hộ).
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% " + ((h >= 222 && h <= 282) ? 54 : 62) + "%)", "--on": (h >= 222 && h <= 282) ? "#ffffff" : "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const hexP = (c, x, y, r) => { c.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; i ? c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : c.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r) } c.closePath(); };
  const rr = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const S = {
    hive: { h: 42, layout: "hex", dim: [360, 380], lbl: "rgba(255,240,200,.9)", deco: ["🍯", "🐝", "🌼", "🧈"], hero: "🍯🐝", cg: ["#f6b73c", "#8a4a05"],
      bg(c, w, h, tm, dk) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, dk ? "#3a2606" : "#fde7a8"); g.addColorStop(1, dk ? "#1d1303" : "#f6c453"); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = "rgba(255,170,0,.25)"; for (let i = 0; i < 4; i++) { const x = 40 + i * 90; c.beginPath(); c.moveTo(x, 0); c.quadraticCurveTo(x + 14, 30 + (i % 2) * 20, x, 60 + ((tm * 8 + i * 20) % 30)); c.lineTo(x - 20, 0); c.fill() } },
      tile(c, t, col) { hexP(c, t.x, t.y, t.hex * .94); c.fillStyle = col; c.fill(); c.lineWidth = 2.4; c.strokeStyle = "rgba(120,70,0,.55)"; c.stroke(); c.fillStyle = "rgba(255,255,255,.2)"; c.beginPath(); c.ellipse(t.x - t.hex * .25, t.y - t.hex * .3, t.hex * .3, t.hex * .12, -.5, 0, 6.283); c.fill(); },
      fx(c, w, h, tm) { c.font = "22px 'Apple Color Emoji','Segoe UI Emoji',sans-serif"; c.textAlign = "left"; c.fillText("🐝", (tm * 40) % (w + 30) - 20, 26 + Math.sin(tm * 3) * 6); },
      css: "canvas#cv{border-radius:5cqw;border:2cqw solid #d99a1a;box-shadow:0 1.4cqw 0 #8a5a0a}" },
    petri: { h: 160, layout: "ring", dim: [360, 360], lbl: "rgba(220,255,240,.9)", deco: ["🧫", "🦠", "🔬", "🧬"], hero: "🧫🦠", cg: ["#34d399", "#064e3b"],
      bg(c, w, h, tm, dk) { c.fillStyle = dk ? "#07231c" : "#d8f5e8"; c.fillRect(0, 0, w, h); const g = c.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * .5); g.addColorStop(0, dk ? "#17463a" : "#f3fff9"); g.addColorStop(1, dk ? "#0c2f27" : "#bfeedd"); c.fillStyle = g; c.beginPath(); c.arc(w / 2, h / 2, w * .495, 0, 6.283); c.fill(); c.lineWidth = 5; c.strokeStyle = "rgba(255,255,255,.55)"; c.beginPath(); c.arc(w / 2, h / 2, w * .495, 0, 6.283); c.stroke(); },
      tile(c, t, col) { const g = c.createRadialGradient(t.x - t.r * .3, t.y - t.r * .3, 1, t.x, t.y, t.r); g.addColorStop(0, "rgba(255,255,255,.5)"); g.addColorStop(.35, col); g.addColorStop(1, col); c.fillStyle = g; c.beginPath(); c.arc(t.x, t.y, t.r * .94, 0, 6.283); c.fill(); c.fillStyle = col; c.beginPath(); c.arc(t.x, t.y, t.r * .8, 0, 6.283); c.fill(); c.fillStyle = "rgba(255,255,255,.28)"; c.beginPath(); c.ellipse(t.x - t.r * .28, t.y - t.r * .34, t.r * .3, t.r * .15, -.6, 0, 6.283); c.fill(); },
      css: "canvas#cv{border-radius:50%;border:2.4cqw solid #9ad9c0;box-shadow:inset 0 0 0 .6cqw #5aa88a,0 1.4cqw 0 #2f6b55,0 0 0 2.6cqw rgba(154,217,192,.3)}" },
    sky: { h: 245, layout: "scatter", dim: [330, 430], lbl: "rgba(210,220,255,.85)", deco: ["⭐", "🌙", "🪐", "☄️"], hero: "🌌🌙", cg: ["#4c1d95", "#030314"],
      bg(c, w, h, tm) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#04051c"); g.addColorStop(1, "#271052"); c.fillStyle = g; c.fillRect(0, 0, w, h); const r = rr(9); c.fillStyle = "#fff"; for (let i = 0; i < 70; i++) { c.globalAlpha = .3 + .5 * Math.abs(Math.sin(tm * 1.2 + i)); c.fillRect(r() * w, r() * h, 1.6, 1.6) } c.globalAlpha = 1; c.font = "26px 'Apple Color Emoji','Segoe UI Emoji',sans-serif"; c.fillText("🌙", w - 44, 40); },
      tile(c, t, col) { c.save(); c.shadowColor = col; c.shadowBlur = 14; c.fillStyle = col; c.beginPath(); c.arc(t.x, t.y, t.r * .9, 0, 6.283); c.fill(); c.restore(); c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.arc(t.x - t.r * .25, t.y - t.r * .25, t.r * .28, 0, 6.283); c.fill(); },
      css: "canvas#cv{border-radius:4cqw;border:.9cqw solid #7c5cff;box-shadow:0 0 6cqw rgba(124,92,255,.55)}" },
    wall: { h: 15, layout: "wall", dim: [360, 340], lbl: "rgba(255,240,230,.9)", deco: ["🧱", "🪟", "⛪", "🕯️"], hero: "🪟🧱", cg: ["#b45309", "#3b1d08"],
      bg(c, w, h, tm, dk) { c.fillStyle = dk ? "#2b1d14" : "#6b5a4c"; c.fillRect(0, 0, w, h); c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = 1.4; for (let y = 0; y < h; y += 14) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() } },
      tile(c, t, col) { const x = t.x - t.w / 2, y = t.y - t.h / 2; c.fillStyle = col; c.beginPath(); c.roundRect ? c.roundRect(x, y, t.w, t.h, 3) : c.rect(x, y, t.w, t.h); c.fill(); c.lineWidth = 2.4; c.strokeStyle = "rgba(30,20,10,.75)"; c.stroke(); const g = c.createLinearGradient(x, y, x + t.w, y + t.h); g.addColorStop(0, "rgba(255,255,255,.22)"); g.addColorStop(.5, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(0,0,0,.18)"); c.fillStyle = g; c.fillRect(x, y, t.w, t.h); },
      css: "canvas#cv{border-radius:1.4cqw;border:2.2cqw solid #4a3020;box-shadow:inset 0 0 0 .5cqw #2a1a10,0 1.6cqw 0 #1c110a}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, cg: d.cg, dim: d.dim, layout: d.layout, lbl: d.lbl, bg: d.bg, tile: d.tile, fx: d.fx, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
