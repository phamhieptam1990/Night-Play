"use strict";
/* Mã BẢN TRẢ PHÍ của game Mê Cung Truyền Tay (Cozy Play): 3 LOẠI mê cung Night Pass (Mê cung tối nhìn bằng "nóng/lạnh" + rung,
   Tường dịch chuyển, Mê cung khổng lồ 13×13) và 4 giao diện nét vẽ nghệ thuật (Mực tàu, Neon, Màu nước, 8-bit; "basic" giấy kẻ ô miễn phí nằm sẵn trong trang).
   Chỉ giao cho người có Night Pass qua GET /api/pro/me-cung-truyen-tay.js (hoặc dùng thử 1 ván / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.ok[1] = PF.ok[2] = PF.ok[3] = true;
  const mk = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 70% 92%),hsl(" + h + " 55% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 80% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 66%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)" }
  });
  const S = {
    ink: { me: "🐲", h: 30, style: "ink", path: ["#1c1c1c", "#b3261e"], deco: ["🖌️", "🏮", "🐉", "🎋"], hero: "🖌️🧭" },
    neon: { me: "🤖", h: 285, style: "neon", path: ["#ff3df0", "#35f0ff"], deco: ["⚡", "💠", "🔷", "🎮"], hero: "⚡🧭" },
    water: { me: "🐠", h: 200, style: "water", path: ["#3d8bff", "#ff5fa0"], deco: ["🎨", "💧", "🌊", "🫧"], hero: "🎨🧭" },
    pixel: { me: "👾", h: 125, style: "pixel", path: ["#2f9e44", "#e8590c"], deco: ["👾", "🕹️", "💾", "🟩"], hero: "👾🧭" }
  };
  for (const id in S) { const d = S[id], v = mk(d.h); PF.skins[id] = { me: d.me, style: d.style, path: d.path, vl: v.vl, vd: v.vd, deco: d.deco, hero: d.hero, css: id === "neon" ? "#cv,#mc{box-shadow:0 0 5cqw rgba(255,61,240,.4)}" : "" }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
