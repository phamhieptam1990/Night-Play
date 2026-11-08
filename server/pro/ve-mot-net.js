"use strict";
/* Mã BẢN TRẢ PHÍ của game Vẽ Một Nét (Cozy Play): 3 loại riêng (Hình vuông, Ngôi sao, Bản đồ Việt Nam) và 4 giao diện có KHUNG VẼ + BỐ CỤC khác hẳn nhau:
   Bảng đen phấn (khung gỗ, khay phấn, nét phấn), Giấy dó thư pháp (cuộn giấy dọc, nét cọ đậm nhạt, con dấu đỏ), Máy game neon (màn hình vuông phát sáng, lưới chạy, vạch quét CRT),
   Vườn cát thiền (khung tròn, cát cào vòng, nét rãnh cát). Chỉ giao cho người có Night Pass qua GET /api/pro/ve-mot-net.js (hoặc dùng thử / vé chơi hộ).
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const rnd = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const line = (c, pts) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); };
  const S = {
    chalk: { h: 150, dim: [360, 440], tip: "🖍️", col: "#f4f4ec", bigCol: "#f4f4ec", deco: ["🖍️", "📐", "🍎", "🐱"], hero: "🖍️🐱", cg: ["#2f6b52", "#12291f"],
      bg(c, w, h) { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, "#245a45"); g.addColorStop(1, "#14392b"); c.fillStyle = g; c.fillRect(0, 0, w, h); const r = rnd(11); c.fillStyle = "rgba(255,255,255,.05)"; for (let i = 0; i < 14; i++) { c.beginPath(); c.ellipse(r() * w, r() * h, 30 + r() * 60, 6 + r() * 10, r() * 3, 0, 6.283); c.fill() } c.strokeStyle = "rgba(255,255,255,.12)"; c.lineWidth = 1.5; c.setLineDash([2, 7]); for (let y = 40; y < h; y += 52) { c.beginPath(); c.moveTo(14, y); c.lineTo(w - 14, y); c.stroke() } c.setLineDash([]); },
      ink(c, pts) { c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = "rgba(244,244,236,.9)"; c.lineWidth = 5; line(c, pts); c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 8; c.setLineDash([1, 5]); line(c, pts); c.setLineDash([]); },
      fx(c, w, h, tm) { c.font = "30px 'Apple Color Emoji','Segoe UI Emoji',sans-serif"; c.textAlign = "left"; c.fillText("🐱", 10, h - 8); c.fillText("🍎", w - 40, h - 8); },
      css: "canvas#cv{border:3.2cqw solid #8b5a2b;border-radius:2cqw;box-shadow:inset 0 0 0 .6cqw #5a3a1a,0 1.4cqw 0 #3a2410}#cvw{flex-direction:column;gap:0}#cvw::after{content:'🖍️  ▬▬▬  🧽';display:block;margin-top:-.4cqw;padding:.6cqw 7cqw 1cqw;background:linear-gradient(#a8742f,#7a4f1d);border-radius:0 0 2cqw 2cqw;color:#fff;font-size:4.4cqw;letter-spacing:1cqw;box-shadow:0 1cqw 0 #3a2410}" },
    brush: { h: 30, dim: [300, 470], tip: "🖌️", col: "#14110d", bigCol: "#8b1a1a", deco: ["🖌️", "🏮", "🎋", "🌸"], hero: "🖌️🏮", cg: ["#d9c9a0", "#5a3a1a"],
      bg(c, w, h) { c.fillStyle = "#f6efe0"; c.fillRect(0, 0, w, h); const r = rnd(7); c.strokeStyle = "rgba(120,90,40,.10)"; c.lineWidth = 1; for (let i = 0; i < 90; i++) { const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - .5) * 30, y + (r() - .5) * 30); c.stroke() } const g = c.createRadialGradient(w / 2, h / 2, w * .3, w / 2, h / 2, h * .75); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(120,80,30,.22)"); c.fillStyle = g; c.fillRect(0, 0, w, h); },
      ink(c, pts, tm, done) { c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = "#14110d"; for (let i = 1; i < pts.length; i++) { const k = i / pts.length, sp = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); c.lineWidth = Math.max(2.4, 9 - sp * .45 - k * 2.5 + Math.sin(k * 9) * 1.2); c.beginPath(); c.moveTo(pts[i - 1][0], pts[i - 1][1]); c.lineTo(pts[i][0], pts[i][1]); c.stroke() } },
      fx(c, w, h) { c.fillStyle = "#b3261e"; c.beginPath(); c.roundRect ? c.roundRect(w - 54, h - 62, 40, 46, 5) : c.rect(w - 54, h - 62, 40, 46); c.fill(); c.fillStyle = "#fff"; c.font = "700 17px serif"; c.textAlign = "center"; c.fillText("一", w - 34, h - 42); c.fillText("筆", w - 34, h - 22); },
      css: "canvas#cv{border:0;border-top:2.8cqw solid #4a2e14;border-bottom:2.8cqw solid #4a2e14;border-radius:.6cqw;box-shadow:0 2.4cqw 6cqw rgba(60,30,0,.4)}.stats .st{border-radius:1cqw}" },
    neon: { h: 300, dim: [360, 360], tip: "✨", col: "#33e0ff", bigCol: "#ffffff", deco: ["🕹️", "👾", "💠", "⚡"], hero: "🕹️👾", cg: ["#4a1d96", "#06081f"],
      bg(c, w, h, tm) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#07061f"); g.addColorStop(1, "#1d0a3a"); c.fillStyle = g; c.fillRect(0, 0, w, h); c.strokeStyle = "rgba(255,61,208,.35)"; c.lineWidth = 1; for (let x = 0; x <= w; x += 30) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() } for (let y = (tm * 14) % 30; y <= h; y += 30) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() } },
      ink(c, pts) { c.lineCap = "round"; c.lineJoin = "round"; c.save(); c.shadowColor = "#33e0ff"; c.shadowBlur = 16; c.strokeStyle = "#33e0ff"; c.lineWidth = 5; line(c, pts); c.restore(); c.strokeStyle = "#fff"; c.lineWidth = 1.6; line(c, pts); },
      fx(c, w, h) { c.fillStyle = "rgba(0,0,0,.16)"; for (let y = 0; y < h; y += 3) c.fillRect(0, y, w, 1); },
      css: "canvas#cv{border-radius:5cqw;border:1.2cqw solid #ff3dd0;box-shadow:0 0 6cqw #ff3dd0,inset 0 0 6cqw rgba(51,224,255,.6)}.stats .st b{text-shadow:0 0 2cqw currentColor}#cvw{padding:1cqw}" },
    zen: { h: 40, dim: [360, 360], tip: "🥢", col: "#6e5326", bigCol: "#5a4520", deco: ["🪨", "🎋", "🌿", "🐚"], hero: "🪨🎋", cg: ["#e8d6a8", "#6e5326"],
      bg(c, w, h) { c.fillStyle = "#e8d8ae"; c.fillRect(0, 0, w, h); c.lineWidth = 2; for (let r = 18; r < w * .75; r += 11) { c.strokeStyle = (r / 11 | 0) % 2 ? "rgba(255,255,255,.55)" : "rgba(120,90,40,.25)"; c.beginPath(); c.arc(w * .5, h * .5, r, 0, 6.283); c.stroke() } c.fillStyle = "#8d8573"; c.beginPath(); c.ellipse(w * .5, h * .5, 26, 19, .3, 0, 6.283); c.fill(); c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(w * .5 - 7, h * .5 - 6, 9, 5, .3, 0, 6.283); c.fill(); },
      ink(c, pts) { c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 9; c.save(); c.translate(-1.6, -1.6); line(c, pts); c.restore(); c.strokeStyle = "rgba(110,80,30,.85)"; c.lineWidth = 7; line(c, pts); },
      css: "canvas#cv{border-radius:50%;border:2.6cqw solid #8a6a3a;box-shadow:inset 0 0 0 .8cqw #5a4520,0 1.8cqw 0 #3a2c14,0 0 0 2.6cqw color-mix(in srgb,var(--accent) 16%,transparent)}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, cg: d.cg, dim: d.dim, tip: d.tip, col: d.col, bigCol: d.bigCol, bg: d.bg, ink: d.ink, fx: d.fx, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
