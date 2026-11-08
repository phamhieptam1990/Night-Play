"use strict";
/* Mã BẢN TRẢ PHÍ của game Shipper Siêu Tốc (Cozy Play): 3 loại riêng (Giờ cao điểm, Đồ nóng, Đơn đi xa) và 4 giao diện đổi HẲN BẢN ĐỒ + LUẬT TÍNH ĐƯỜNG:
   Sài Gòn bàn cờ (nhà nằm trên giao lộ, đường đi theo ô bàn cờ), Phố cổ đường chéo (đường chéo thẳng, hẻm ngoằn ngoèo), Sông và cầu miền Tây (sông chia đôi bản đồ, chỉ qua được hai cây cầu), Chung cư nhiều tầng (bản đồ cao, đi ngang chậm gấp 3 so với thang máy).
   Chỉ giao cho người có Night Pass qua GET /api/pro/shipper-sieu-toc.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const em = "'Apple Color Emoji','Segoe UI Emoji',sans-serif";
  const rr = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const S = {
    saigon: { h: 280, metric: "manh", snap: 40, dim: [360, 440], col: "#ff3dd0", lbl: "rgba(255,230,255,.9)", shopEm: "🏪", deco: ["🌃", "🛵", "🍜", "🏙️"], hero: "🌃🛵", cg: ["#7c3aed", "#0b0820"],
      bg(c, w, h, tm, dk) { c.fillStyle = "#120a2a"; c.fillRect(0, 0, w, h); c.strokeStyle = "rgba(255,61,208,.35)"; c.lineWidth = 3; for (let x = 0; x <= w; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() } for (let y = 0; y <= h; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() } c.fillStyle = "rgba(51,224,255,.1)"; for (let x = 0; x < w; x += 40) for (let y = 0; y < h; y += 40) c.fillRect(x + 6, y + 6, 28, 28); },
      pin(c, s, k, st, tm) { c.save(); c.translate(s.x, s.y); c.shadowColor = st === "on" ? "#ff3dd0" : "#33e0ff"; c.shadowBlur = 14; c.font = "28px " + em; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s.emoji, 0, 0); c.restore(); },
      css: "canvas#cv{border-radius:3cqw;border:.9cqw solid #c026d3;box-shadow:0 0 6cqw rgba(192,38,211,.5)}" },
    hanoi: { h: 12, metric: "euclid", dim: [360, 420], col: "#c2410c", shopEm: "🏮", deco: ["🏮", "🛵", "🍜", "🌸"], hero: "🏮🛵", cg: ["#dc2626", "#3a0a0a"],
      bg(c, w, h, tm, dk) { c.fillStyle = dk ? "#2c2018" : "#e9d9b4"; c.fillRect(0, 0, w, h); const r = rr(21); c.strokeStyle = dk ? "rgba(255,220,160,.2)" : "rgba(120,80,30,.28)"; c.lineWidth = 6; c.lineCap = "round"; for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(r() * w, r() * h); c.lineTo(r() * w, r() * h); c.stroke() } c.fillStyle = dk ? "rgba(80,40,20,.5)" : "rgba(160,70,40,.18)"; for (let i = 0; i < 22; i++) { c.beginPath(); c.roundRect ? c.roundRect(r() * w, r() * h, 30 + r() * 30, 22 + r() * 24, 5) : c.rect(r() * w, r() * h, 40, 30); c.fill() } },
      css: "canvas#cv{border-radius:2cqw;border:1.2cqw solid #b45309;box-shadow:0 1.4cqw 0 #5a2a05}" },
    mekong: { h: 160, metric: "river", dim: [400, 340], col: "#0f766e", shopEm: "🛖", bikeEm: "🛵", deco: ["🛶", "🌴", "🥥", "🌉"], hero: "🌉🛶", cg: ["#34d399", "#064e3b"],
      bg(c, w, h, tm, dk, M) { c.fillStyle = dk ? "#1d3b24" : "#bfe6a8"; c.fillRect(0, 0, w, h); const ry = M ? M.ry : h / 2; c.fillStyle = dk ? "#0f4a6a" : "#5ec0e8"; c.fillRect(0, ry - 22, w, 44); c.strokeStyle = "rgba(255,255,255,.4)"; c.lineWidth = 2; for (let i = 0; i < 9; i++) { const x = (i * 49 + tm * 14) % w; c.beginPath(); c.moveTo(x, ry - 8 + (i % 3) * 8); c.lineTo(x + 20, ry - 8 + (i % 3) * 8); c.stroke() } const bs = M ? M.bridges : [w * .26, w * .74]; c.fillStyle = "#9a6b3a"; bs.forEach(bx => { c.fillRect(bx - 14, ry - 26, 28, 52); c.strokeStyle = "#5a3a1a"; c.lineWidth = 2; for (let k = -24; k <= 24; k += 8) { c.beginPath(); c.moveTo(bx - 14, ry + k); c.lineTo(bx + 14, ry + k); c.stroke() } }); c.font = "26px " + em; c.textAlign = "center"; c.fillText("🛶", (tm * 20) % (w + 60) - 30, ry); },
      css: "canvas#cv{border-radius:3cqw;border:1.2cqw solid #0f766e;box-shadow:0 1.4cqw 0 #064e3b}" },
    tower: { h: 215, metric: "weighted", dim: [300, 470], col: "#38bdf8", lbl: "rgba(210,240,255,.9)", shopEm: "🛗", bikeEm: "🛵", deco: ["🏢", "🛗", "📦", "🌆"], hero: "🏢🛗", cg: ["#0ea5e9", "#0c1a33"],
      bg(c, w, h, tm, dk) { c.fillStyle = dk ? "#0e1a2e" : "#dde7f3"; c.fillRect(0, 0, w, h); const fl = 8, fh = h / fl; c.strokeStyle = dk ? "rgba(140,190,255,.4)" : "rgba(40,70,110,.4)"; c.lineWidth = 3; for (let i = 0; i <= fl; i++) { c.beginPath(); c.moveTo(0, i * fh); c.lineTo(w, i * fh); c.stroke() } c.fillStyle = dk ? "rgba(255,210,100,.35)" : "rgba(255,210,100,.5)"; for (let i = 0; i < fl; i++) for (let k = 0; k < 5; k++) c.fillRect(12 + k * 58, i * fh + 8, 16, 12); c.fillStyle = dk ? "rgba(56,189,248,.25)" : "rgba(14,165,233,.2)"; c.fillRect(w * .46, 0, 24, h); },
      css: "canvas#cv{border-radius:2cqw;border:1.2cqw solid #0284c7;box-shadow:0 0 5cqw rgba(14,165,233,.45)}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, cg: d.cg, dim: d.dim, metric: d.metric, snap: d.snap, col: d.col, lbl: d.lbl, shopEm: d.shopEm, bikeEm: d.bikeEm, bg: d.bg, pin: d.pin, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
