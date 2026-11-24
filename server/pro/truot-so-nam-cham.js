"use strict";
/* Mã BẢN TRẢ PHÍ của game Trượt Số Nam Châm (Cozy Play): 3 loại riêng (Số úp, Đua giờ, Nam châm nhiễu) và 4 giao diện đổi HẲN dáng ô + khung + nền:
   Gỗ Cổ (ô vuông gỗ khắc số, khung gỗ), Neon Đêm (ô tối viền neon bo tròn), Bong Bóng Biển (ô tròn bong bóng), Phi Thuyền (ô kim loại vát, khung đinh tán).
   Chỉ giao cho người có Night Pass qua GET /api/pro/truot-so-nam-cham.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 36%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const grad = (c, h, a, b) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, 1e4, h); };
  const rnd = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const S = {
    wood: { h: 30, deco: ["🪵", "🔢", "🌰", "🍂"], hero: "🪵🔢", cg: ["#c98a4b", "#4a2a10"], rad: .1, gap: .045, frame: "#8a5a2b", frameLine: "#4a2a10", frameR: 12, well: "#5a3a1c",
      pal: [["#e6c08a", "#c99a5b"], ["#dbb078", "#b98a4e"], ["#efcf9c", "#d1a56a"], ["#d3a266", "#a97a40"]], edge: "#8a5a2b", rim: "rgba(255,240,210,.55)", ink: "#4a2a10",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#2a1a0c" : "#f0dcb8", dk ? "#150c05" : "#dcb98a"); c.strokeStyle = "rgba(90,50,20,.12)"; c.lineWidth = 2; for (let y = 0; y < h; y += 18) { c.beginPath(); c.moveTo(0, y); c.bezierCurveTo(w * .3, y + 6, w * .6, y - 6, w, y + 3); c.stroke(); } },
      css: "canvas#cv{border-radius:3cqw}" },
    neon: { h: 300, deco: ["🌃", "🔢", "⚡", "💜"], hero: "🌃🔢", cg: ["#a855f7", "#0a0420"], rad: .22, gap: .06, frame: "#14102e", frameLine: "#ff4fd8", frameR: 18, well: "#0a0820",
      pal: [["#2a2260", "#1a1442"], ["#1f2a66", "#141c48"], ["#4a1f5e", "#321042"], ["#1f4a5e", "#10303f"]], edge: "#ff4fd8", rim: "#7cf0ff", ink: "#f4e8ff",
      bg(c, w, h, tm) { grad(c, h, "#0a0420", "#250a45"); c.strokeStyle = "rgba(255,79,216,.18)"; c.lineWidth = 1; for (let x = 0; x <= w; x += 30) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = (tm * 10) % 30; y <= h; y += 30) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } },
      css: "canvas#cv{border-radius:4cqw}" },
    bubble: { h: 195, deco: ["🫧", "🐠", "🔢", "🐚"], hero: "🫧🐠", cg: ["#38bdf8", "#082f5a"], rad: .5, gap: .07, frame: "#cdeffc", frameLine: "#5fb6dd", frameR: 22, well: "#7fc6e8",
      pal: [["#d6f4ff", "#8fd3f2"], ["#e0f7ee", "#9de0c4"], ["#fde2f0", "#f4a6cf"], ["#fff3c8", "#f2d27a"]], edge: "#5fb6dd", rim: "rgba(255,255,255,.9)", ink: "#0b3a5c",
      bg(c, w, h, tm, dk) { grad(c, h, dk ? "#04304f" : "#8bdcf8", dk ? "#02152a" : "#2386c4"); const r = rnd(5); c.strokeStyle = "rgba(255,255,255,.5)"; c.lineWidth = 1.6; for (let i = 0; i < 14; i++) { const x = r() * w, sp = 12 + r() * 20, y = h - ((tm * sp + r() * h) % h); c.beginPath(); c.arc(x + Math.sin(tm + i) * 4, y, 2 + r() * 5, 0, 6.283); c.stroke(); } },
      css: "canvas#cv{border-radius:5cqw}" },
    metal: { h: 215, deco: ["🚀", "🔢", "🛸", "⭐"], hero: "🚀🔢", cg: ["#6d8bff", "#060a24"], rad: .06, gap: .05, frame: "#9aa7c7", frameLine: "#4b5a88", frameR: 10, well: "#232a44",
      pal: [["#dfe6f7", "#9fb0d6"], ["#d2dcf2", "#8ea2cc"], ["#e6ebf8", "#a8b8dc"], ["#c8d4ee", "#8497c2"]], edge: "#5a6a9a", rim: "rgba(255,255,255,.8)", ink: "#1a2340",
      bg(c, w, h, tm) { grad(c, h, "#050818", "#1b1f4a"); const r = rnd(11); c.fillStyle = "#fff"; for (let i = 0; i < 70; i++) { c.globalAlpha = .25 + .6 * Math.abs(Math.sin(tm * 1.3 + i)); c.fillRect(r() * w, r() * h, 1.6, 1.6); } c.globalAlpha = 1; },
      css: "canvas#cv{border-radius:2cqw}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = Object.assign({ vl: b.vl, vd: b.vd }, d); delete PF.skins[id].h; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
