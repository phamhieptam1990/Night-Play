"use strict";
/* Mã BẢN TRẢ PHÍ của game Cắt Bánh Chưng (Cozy Play): 3 loại riêng (Cắt ba, Hình kỳ quặc, Cắt tư) và 4 giao diện có BÀN CẮT + BỐ CỤC khác hẳn nhau:
   Tiệm pizza Ý (khay tròn, khăn bàn caro, pizza phủ xúc xích), Võ đường kiếm sĩ (màn hình ngang, vệt kiếm đỏ phát sáng, mặt trời đỏ), Phòng thí nghiệm laser (bản vẽ kỹ thuật xanh, tia laser đỏ, thước đo),
   Xưởng kẹo ngọt (khay vuông bo tròn, chấm bi, kẹo xoắn). Chỉ giao cho người có Night Pass qua GET /api/pro/cat-banh-chung.js (hoặc dùng thử / vé chơi hộ).
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const S = {
    pizza: { h: 8, dim: [360, 360], blade: "🔪", slash: "#fff", text: "#fff3e0", deco: ["🍕", "🍅", "🧀", "🌿"], hero: "🍕🇮🇹", cg: ["#ef4444", "#7f1d1d"], edge: "rgba(120,60,10,.6)",
      style(k) { return k === "circle" ? ["#f6c35a", "#d9902f"] : k === "sq" ? ["#f3d27a", "#d9a441"] : k === "semi" ? ["#f4b860", "#c97b28"] : ["#f7cf6d", "#d2902e"]; },
      bg(c, w, h, tm, dk) { c.fillStyle = dk ? "#5c1111" : "#d6453d"; c.fillRect(0, 0, w, h); c.fillStyle = dk ? "#7a1f1f" : "#fff5ea"; for (let y = 0; y < h; y += 40) for (let x = (y / 40 % 2) * 40; x < w; x += 80) c.fillRect(x, y, 40, 40); },
      paint(c, k, bb, cx, cy) { c.fillStyle = "rgba(255,244,200,.55)"; c.fillRect(bb.x0, bb.y0, bb.x1 - bb.x0, bb.y1 - bb.y0); c.fillStyle = "#c62828"; for (let i = 0; i < 9; i++) { const a = i * 2.4, r = 14 + (i % 4) * 22; c.beginPath(); c.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 10, 0, 6.283); c.fill(); c.fillStyle = "rgba(255,255,255,.25)"; c.beginPath(); c.arc(cx + Math.cos(a) * r - 3, cy + Math.sin(a) * r - 3, 3, 0, 6.283); c.fill(); c.fillStyle = "#c62828" } c.fillStyle = "#2e7d32"; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(cx + Math.cos(i * 1.9 + 1) * 50, cy + Math.sin(i * 1.9 + 1) * 40, 7, 3.5, i, 0, 6.283); c.fill() } },
      css: "canvas#cv{border-radius:50%;border:2.6cqw solid #8a5a2b;box-shadow:inset 0 0 0 .8cqw #5a3a1a,0 1.8cqw 0 #3a2410}.stats .st{border-radius:99cqw}" },
    ninja: { h: 350, dim: [420, 290], blade: "🗡️", slash: "#ffffff", glow: "#ff3b3b", text: "#ffffff", deco: ["🥷", "🗡️", "🏮", "🎋"], hero: "🥷🏮", cg: ["#7f1d1d", "#0b0b10"], edge: "rgba(0,0,0,.7)",
      style(k) { return k === "semi" ? ["#ff4d5e", "#2f8f3a"] : k === "circle" ? ["#ffb347", "#e0661a"] : ["#a78bfa", "#5b3fd0"]; },
      bg(c, w, h, tm) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1a1022"); g.addColorStop(1, "#3a1414"); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = "#c1121f"; c.beginPath(); c.arc(w * .5, h * .46, h * .36, 0, 6.283); c.fill(); c.fillStyle = "rgba(0,0,0,.55)"; c.fillRect(0, 0, w, h); c.strokeStyle = "rgba(255,255,255,.08)"; c.lineWidth = 2; for (let x = 0; x < w; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() } c.fillStyle = "#2a1408"; c.fillRect(0, h - 36, w, 36); c.font = "26px 'Apple Color Emoji','Segoe UI Emoji',sans-serif"; c.textAlign = "center"; c.fillText("🏮", 28, 40); c.fillText("🏮", w - 28, 40); c.fillText("🎋", w * .12, h - 40); c.fillText("🎋", w * .88, h - 40); },
      fx(c, w, h, tm) { c.fillStyle = "rgba(255,255,255,.7)"; for (let i = 0; i < 10; i++) { const x = (i * 83 + tm * 24) % w, y = (i * 47 + tm * 30) % h; c.fillRect(x, y, 2, 2) } },
      css: "canvas#cv{border-radius:2cqw;border:1cqw solid #c1121f;box-shadow:0 0 5cqw rgba(193,18,31,.6)}#cvw{align-items:center}" },
    lab: { h: 195, dim: [360, 420], blade: "🔬", slash: "#ff3b3b", glow: "#ff3b3b", text: "#bff3ff", deco: ["🔬", "⚗️", "🧪", "📐"], hero: "🔬⚗️", cg: ["#0e7490", "#06182a"], edge: "rgba(120,230,255,.9)",
      style(k) { return ["rgba(80,200,255,.55)", "rgba(40,120,220,.45)"]; },
      bg(c, w, h) { c.fillStyle = "#06182a"; c.fillRect(0, 0, w, h); c.strokeStyle = "rgba(80,200,255,.18)"; c.lineWidth = 1; for (let x = 0; x <= w; x += 20) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() } for (let y = 0; y <= h; y += 20) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() } c.strokeStyle = "rgba(80,200,255,.5)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.moveTo(w / 2, 0); c.lineTo(w / 2, h); c.stroke(); },
      paint(c, k, bb, cx, cy) { c.strokeStyle = "rgba(190,243,255,.55)"; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(bb.x0, cy); c.lineTo(bb.x1, cy); c.moveTo(cx, bb.y0); c.lineTo(cx, bb.y1); c.stroke(); c.setLineDash([]); },
      fx(c, w, h, tm) { c.strokeStyle = "rgba(190,243,255,.8)"; c.lineWidth = 2; [[8, 8, 1, 1], [w - 8, 8, -1, 1], [8, h - 8, 1, -1], [w - 8, h - 8, -1, -1]].forEach(q => { c.beginPath(); c.moveTo(q[0], q[1] + q[3] * 22); c.lineTo(q[0], q[1]); c.lineTo(q[0] + q[2] * 22, q[1]); c.stroke() }); c.fillStyle = "rgba(255,60,60,.8)"; c.font = "700 11px 'Courier New',monospace"; c.textAlign = "left"; c.fillText("LASER ● " + (Math.floor(tm * 10) % 100), 14, h - 14); },
      css: "canvas#cv{border-radius:1cqw;border:.5cqw solid #33d6ff;box-shadow:0 0 5cqw rgba(51,214,255,.5)}.stats .st b{font-family:'Courier New',monospace;text-shadow:0 0 2cqw currentColor}" },
    candy: { h: 325, dim: [360, 360], blade: "🍭", slash: "#fff", text: "#7a1d52", deco: ["🍬", "🍭", "🧁", "🍩"], hero: "🍬🍭", cg: ["#f472b6", "#9d174d"], edge: "rgba(255,255,255,.9)",
      style(k) { return k === "sq" ? ["#ff8fc1", "#e0388a"] : k === "circle" ? ["#ffd166", "#ff7b54"] : k === "semi" ? ["#a78bfa", "#6d3fd0"] : ["#7de2d1", "#2ba5a0"]; },
      bg(c, w, h) { c.fillStyle = "#ffd6ea"; c.fillRect(0, 0, w, h); c.fillStyle = "#ffbfdc"; for (let y = 10; y < h; y += 34) for (let x = (y / 34 % 2) * 17 + 8; x < w; x += 34) { c.beginPath(); c.arc(x, y, 7, 0, 6.283); c.fill() } },
      paint(c, k, bb, cx, cy) { c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 9; for (let i = -6; i < 8; i++) { c.beginPath(); c.moveTo(bb.x0 + i * 26, bb.y1); c.lineTo(bb.x0 + i * 26 + 120, bb.y0); c.stroke() } },
      css: "canvas#cv{border-radius:9cqw;border:2.4cqw solid #ff7eb6;box-shadow:0 1.6cqw 0 #c2417c,0 0 0 2.4cqw rgba(255,126,182,.25)}.stats .st{border-radius:99cqw;border-color:#ff7eb6}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, cg: d.cg, dim: d.dim, blade: d.blade, slash: d.slash, glow: d.glow, text: d.text, edge: d.edge, style: d.style, paint: d.paint, bg: d.bg, fx: d.fx, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
