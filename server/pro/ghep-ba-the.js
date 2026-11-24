"use strict";
/* Mã BẢN TRẢ PHÍ của game Ghép Ba Thẻ (Cozy Play): 3 loại riêng (Tầng Tầng, Thẻ Úp, Đua 90 giây) và 4 giao diện đổi HẲN CÁCH XẾP THẺ + hình thẻ:
   Tiệm Kẹo (trái tim kẹo, thẻ viên thuốc), Đáy Biển (sóng lệch hàng, thẻ bong bóng), Vườn Trái Cây (vòng tròn quanh vườn, thẻ thùng gỗ), Vũ Trụ (hình thoi sao, thẻ vát).
   Chỉ giao cho người có Night Pass qua GET /api/pro/ghep-ba-the.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% " + ((h >= 222 && h <= 282) ? 54 : 62) + "%)", "--on": (h >= 222 && h <= 282) ? "#ffffff" : "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const grad = (c, h, a, b) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, 1e4, h); };
  const rnd = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const EM = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
  const S = {
    candy: { h: 335, icons: ["🍬", "🍭", "🧁", "🍩", "🍪", "🍫", "🍰", "🍦", "🍓", "🍯"], deco: ["🍭", "🍬", "🧁", "🍩"], hero: "🍭🧁", cg: ["#ff8fc2", "#7a1b52"],
      layers: [{ l: 0, oy: 0, rows: [".##.##.", "#######", "#######", ".#####.", "..###..", "...#..."] }, { l: 1, oy: 1, rows: ["1:######", "1:######", "1:.####.", "1:..##.."] }],
      face: "#fff8fc", face2: "#ffe3f1", edge: "#f08ab8", rad: 21, back: "#ff7fb6", back2: "#d9468a", tray: "rgba(255,255,255,.5)", trayLine: "rgba(214,70,140,.55)", slot: "rgba(214,70,140,.6)",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#3b1330" : "#ffd3e8", dk ? "#6a1f4f" : "#ffeef7"); c.fillStyle = dk ? "rgba(255,150,200,.14)" : "rgba(255,255,255,.55)"; for (let y = 0; y < 14; y++) for (let x = 0; x < 11; x++) { c.beginPath(); c.arc(x * 36 + (y % 2) * 18, y * 36, 7, 0, 6.283); c.fill(); } },
      css: "canvas#cv{border-radius:5cqw}" },
    ocean: { h: 200, icons: ["🐠", "🐙", "🦀", "🐚", "🐳", "🦑", "⭐", "🐢", "🐡", "🦈"], deco: ["🐠", "🫧", "🐚", "🐙"], hero: "🐠🌊", cg: ["#38bdf8", "#082f5a"],
      layers: [{ l: 0, oy: 0, rows: ["0:######", "1:######", "0:######", "1:######", "0:######"] }, { l: 1, oy: 1, rows: ["2:#####", "2:#####", "2:#####"] }],
      face: "#f3fcff", face2: "#d3f0fb", edge: "#5fb6dd", rad: 25, back: "#3aa7d9", back2: "#1b6fa3", tray: "rgba(255,255,255,.2)", trayLine: "rgba(190,235,255,.6)", slot: "rgba(210,240,255,.75)",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#04304f" : "#7fd3f5", dk ? "#02152a" : "#1d78b8"); c.fillStyle = "rgba(255,255,255,.07)"; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(40 + i * 90, 0); c.lineTo(80 + i * 90, 0); c.lineTo(20 + i * 90, h); c.lineTo(i * 90 - 30, h); c.fill(); }
        const r = rnd(5); c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 1.6; for (let i = 0; i < 16; i++) { const x = r() * w, sp = 14 + r() * 22, y = h - ((tm * sp + r() * h) % h), rad = 2 + r() * 5; c.beginPath(); c.arc(x + Math.sin(tm + i) * 4, y, rad, 0, 6.283); c.stroke(); } },
      css: "canvas#cv{border-radius:5cqw}" },
    orchard: { h: 112, icons: ["🍎", "🍌", "🍇", "🍊", "🍉", "🍒", "🍐", "🥝", "🍑", "🍍"], deco: ["🍎", "🍊", "🍇", "🌳"], hero: "🍎🌳", cg: ["#86d96b", "#1f5a1f"],
      layers: [{ l: 0, oy: 0, rows: ["#######", "#.....#", "#.....#", "#.....#", "#.....#", "#.....#", "#######"] }, { l: 1, oy: 1, rows: ["1:######", "1:#....#", "1:#....#", "1:#....#", "1:#....#", "1:######"] }, { l: 2, oy: 5, rows: ["5:##", "5:##"] }],
      face: "#fff6dc", face2: "#f3dba5", edge: "#a8702f", rad: 8, back: "#c98f4a", back2: "#8e5a24", tray: "rgba(92,58,22,.32)", trayLine: "rgba(255,230,170,.65)", slot: "rgba(255,235,185,.8)",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#14341a" : "#b9ecff", dk ? "#0c2410" : "#8fd86d"); c.fillStyle = dk ? "#ffe9a0" : "#fff4b0"; c.beginPath(); c.arc(62, 46, 22, 0, 6.283); c.fill(); c.fillStyle = dk ? "#1b4a22" : "#5db84a"; c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += 30) c.lineTo(x, h - 30 - Math.sin(x / 40) * 10); c.lineTo(w, h); c.fill(); },
      css: "canvas#cv{border-radius:2cqw}" },
    space: { h: 285, icons: ["🚀", "🌍", "🪐", "⭐", "☄️", "👽", "🛸", "🌙", "🔭", "🌞"], deco: ["🚀", "🪐", "⭐", "🛸"], hero: "🚀🪐", cg: ["#6d4cff", "#060720"],
      layers: [{ l: 0, oy: 0, rows: ["...#...", "..###..", ".#####.", "#######", ".#####.", "..###..", "...#..."] }, { l: 1, oy: 1, rows: ["1:..##..", "1:.####.", "1:######", "1:.####.", "1:..##.."] }, { l: 2, oy: 4, rows: ["4:.#.", "4:###", "4:.#."] }],
      face: "#eef2ff", face2: "#cdd6ff", edge: "#5666d6", rad: 13, back: "#5b5be0", back2: "#2f2f9a", tray: "rgba(120,130,255,.16)", trayLine: "rgba(170,180,255,.6)", slot: "rgba(190,200,255,.75)",
      bg(c, w, h, tm) { grad(c, h, "#050618", "#2a1058"); const r = rnd(9); c.fillStyle = "#fff"; for (let i = 0; i < 80; i++) { c.globalAlpha = .25 + .6 * Math.abs(Math.sin(tm * 1.3 + i)); c.fillRect(r() * w, r() * h, 1.6, 1.6); } c.globalAlpha = 1; c.font = "34px " + EM; c.fillText("🪐", w - 60, h - 22); },
      css: "canvas#cv{border-radius:4cqw}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = Object.assign({ vl: b.vl, vd: b.vd }, d); delete PF.skins[id].h; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
