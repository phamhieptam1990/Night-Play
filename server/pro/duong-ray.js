"use strict";
/* Mã BẢN TRẢ PHÍ của game Đường Ray (Cozy Play): 3 loại riêng (Bẻ ghi 2 nhánh, Đêm bão có mực ray giới hạn + bão làm tàu chậm, Siêu tốc với tàu nhanh đuổi kịp tàu chậm)
   và 4 giao diện ray (Tuyết Bắc Âu, Tàu điện neon, Hơi nước cổ điển, Anh đào Nhật Bản): mỗi giao diện có cảnh nền động, kiểu đường ray, kiểu đầu tàu, vệt khói/ánh sáng và hiệu ứng riêng.
   Chỉ giao cho người có Night Pass qua GET /api/pro/duong-ray.js (hoặc dùng thử 1 ván / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const emj = "'Apple Color Emoji','Segoe UI Emoji',sans-serif";
  const path = (c, r) => { c.beginPath(); r.pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); };
  const glyphTrain = (g, size, glow) => (c, t, col) => { const p = t.pos; c.save(); c.translate(p[0], p[1]); c.beginPath(); c.arc(0, 0, 8.5, 0, 6.283); c.fillStyle = col; if (glow) { c.shadowColor = col; c.shadowBlur = 12 } c.fill(); c.shadowBlur = 0; c.rotate(p[2]); const fl = Math.cos(p[2]) < 0; if (fl) c.scale(1, -1); c.font = size + "px " + emj; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(g, 0, 1); c.restore(); };
  const S = {
    snow: { h: 205, deco: ["❄️", "⛄", "🌲", "🚆"], hero: "❄️🚆",
      scene(c, w, h, tm, dk) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, dk ? "#0a1a33" : "#bfe0ff"); g.addColorStop(1, dk ? "#223a5a" : "#f4fbff"); c.fillStyle = g; c.fillRect(0, 0, w, h);
        c.fillStyle = dk ? "#2c4a70" : "#ffffff"; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-20 + i * 110, h); c.lineTo(40 + i * 110, h * .74 - (i % 2) * 40); c.lineTo(100 + i * 110, h); c.fill() }
        c.font = "26px " + emj; c.textAlign = "center"; for (let i = 0; i < 7; i++) c.fillText("🌲", 30 + i * 52, h - 8 - (i % 3) * 6); },
      rail(c, r, col, on, tm) { c.lineCap = "round"; c.lineJoin = "round"; path(c, r); c.strokeStyle = "rgba(255,255,255,.9)"; c.lineWidth = 8; c.stroke(); path(c, r); c.strokeStyle = col; c.globalAlpha = on ? 1 : .35; c.lineWidth = 3; c.setLineDash([2, 5]); c.stroke(); c.setLineDash([]); c.globalAlpha = 1; },
      train: glyphTrain("🚆", 13, false),
      trail(c, t, col) { c.fillStyle = "rgba(255,255,255,.7)"; t.trail.forEach((q, i) => { c.beginPath(); c.arc(q[0], q[1], 1 + i * .12, 0, 6.283); c.globalAlpha = i / 28; c.fill() }); c.globalAlpha = 1 },
      fx(c, w, h, tm, dk) { c.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < 36; i++) { const x = (i * 53 + Math.sin(tm + i) * 12) % w, y = (i * 97 + tm * 28 * (1 + (i % 3) * .4)) % h; c.beginPath(); c.arc(x, y, 1.4 + (i % 3) * .5, 0, 6.283); c.fill() } } },
    neon: { h: 285, deco: ["💠", "🌃", "⚡", "🚄"], hero: "🌃🚄",
      scene(c, w, h, tm, dk) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#050b2a"); g.addColorStop(1, "#1a0a3a"); c.fillStyle = g; c.fillRect(0, 0, w, h);
        c.strokeStyle = "rgba(255,61,208,.35)"; c.lineWidth = 1; for (let x = 0; x <= w; x += 30) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke() } for (let y = (tm * 8) % 30; y <= h; y += 30) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() }
        for (let i = 0; i < 9; i++) { const hh = 40 + ((i * 37) % 90), x = i * 42; c.fillStyle = "#0e1640"; c.fillRect(x, h - hh, 34, hh); c.strokeStyle = ["#33e0ff", "#ff3dd0", "#7a5cff"][i % 3]; c.lineWidth = 1.5; c.strokeRect(x, h - hh, 34, hh) } },
      rail(c, r, col, on, tm) { c.lineCap = "round"; c.lineJoin = "round"; c.save(); c.shadowColor = col; c.shadowBlur = on ? 14 : 4; path(c, r); c.strokeStyle = col; c.globalAlpha = on ? 1 : .35; c.lineWidth = 3.4; c.stroke(); c.restore(); path(c, r); c.strokeStyle = "rgba(255,255,255,.9)"; c.lineWidth = 1.2; c.globalAlpha = on ? 1 : .3; c.stroke(); c.globalAlpha = 1; },
      train: glyphTrain("🚄", 13, true),
      trail(c, t, col) { c.save(); c.shadowColor = col; c.shadowBlur = 10; c.strokeStyle = col; c.lineWidth = 3; c.lineCap = "round"; if (t.trail.length > 2) { c.beginPath(); t.trail.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.globalAlpha = .6; c.stroke() } c.restore(); c.globalAlpha = 1 },
      fx(c, w, h, tm) { c.fillStyle = "rgba(51,224,255,.5)"; for (let i = 0; i < 16; i++) { const x = (i * 71) % w, y = (h - ((tm * 30 + i * 53) % h)); c.fillRect(x, y, 2, 6) } } },
    steam: { h: 30, deco: ["♨️", "🚂", "🎩", "⚙️"], hero: "🚂♨️",
      scene(c, w, h, tm, dk) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, dk ? "#3a2a1a" : "#f3dcae"); g.addColorStop(1, dk ? "#1c140c" : "#c9a46a"); c.fillStyle = g; c.fillRect(0, 0, w, h); c.strokeStyle = dk ? "rgba(255,230,180,.08)" : "rgba(90,50,10,.12)"; c.lineWidth = 1; for (let i = 0; i < 24; i++) { c.beginPath(); c.moveTo(0, i * 22 + 6); c.bezierCurveTo(w * .3, i * 22, w * .7, i * 22 + 12, w, i * 22 + 5); c.stroke() }
        c.font = "30px " + emj; c.textAlign = "center"; c.globalAlpha = .45; ["🏭", "⛰️", "🌳"].forEach((e, i) => c.fillText(e, 50 + i * 130, h - 14)); c.globalAlpha = 1; },
      rail(c, r, col, on, tm) { c.lineCap = "butt"; c.lineJoin = "round"; path(c, r); c.strokeStyle = "#6a4a2a"; c.globalAlpha = on ? 1 : .4; c.lineWidth = 9; c.setLineDash([2, 5]); c.stroke(); c.setLineDash([]); path(c, r); c.strokeStyle = "#cfc6b4"; c.lineWidth = 4; c.stroke(); path(c, r); c.strokeStyle = col; c.lineWidth = 1.6; c.stroke(); c.globalAlpha = 1; },
      train: glyphTrain("🚂", 14, false),
      trail(c, t, col, tm) { if (t.hold > 0) return; for (let i = 0; i < t.trail.length; i += 3) { const q = t.trail[i]; c.beginPath(); c.arc(q[0], q[1] - (t.trail.length - i) * .8, 2 + (t.trail.length - i) * .3, 0, 6.283); c.fillStyle = "rgba(240,240,240," + (.1 + i / 40) + ")"; c.fill() } },
      fx(c, w, h, tm) { c.fillStyle = "rgba(255,235,190,.07)"; c.fillRect(0, 0, w, h); } },
    sakura: { h: 335, deco: ["🌸", "🏯", "🎏", "🚅"], hero: "🌸🚅",
      scene(c, w, h, tm, dk) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, dk ? "#2a1030" : "#ffd6e8"); g.addColorStop(1, dk ? "#3a1a3a" : "#fff0f6"); c.fillStyle = g; c.fillRect(0, 0, w, h);
        c.fillStyle = dk ? "#4a2a5a" : "#ffffff"; c.beginPath(); c.moveTo(w * .55, h * .62); c.lineTo(w * .75, h * .3); c.lineTo(w * .95, h * .62); c.fill(); c.fillStyle = dk ? "#ffb0d0" : "#ff7fae"; c.beginPath(); c.arc(w * .2, h * .12, 22, 0, 6.283); c.fill();
        c.font = "34px " + emj; c.textAlign = "center"; ["🌸", "🏯", "🌸", "🎋"].forEach((e, i) => c.fillText(e, 40 + i * 95, h - 10)); },
      rail(c, r, col, on, tm) { c.lineCap = "round"; c.lineJoin = "round"; path(c, r); c.strokeStyle = "rgba(255,255,255,.95)"; c.lineWidth = 7; c.globalAlpha = on ? 1 : .4; c.stroke(); path(c, r); c.strokeStyle = col; c.lineWidth = 2.6; c.stroke(); c.globalAlpha = 1; },
      train: glyphTrain("🚅", 13, false),
      trail(c, t, col, tm) { if (t.trail.length > 3) { const q = t.trail[0]; c.font = "9px " + emj; c.textAlign = "center"; c.globalAlpha = .8; c.fillText("🌸", q[0], q[1]); c.globalAlpha = 1 } },
      fx(c, w, h, tm) { c.font = "12px " + emj; c.textAlign = "center"; for (let i = 0; i < 14; i++) { const x = (i * 61 + Math.sin(tm * .9 + i) * 24 + tm * 10) % w, y = (i * 83 + tm * 24) % h; c.globalAlpha = .8; c.fillText("🌸", x, y) } c.globalAlpha = 1; } }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, scene: d.scene, rail: d.rail, train: d.train, trail: d.trail, fx: d.fx, css: "" }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
