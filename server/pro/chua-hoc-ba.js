"use strict";
/* Mã BẢN TRẢ PHÍ của game Chùa Học Bá Online (Cozy Play): 3 loại riêng (Gõ mõ 30 giây, Xin 5 quẻ, Cầu thi tốc hành) và 3 giao diện đổi HẲN hình thẻ quẻ, mõ, que hương, nền:
   Chùa Tuyết (thẻ quẻ bo tròn xanh băng, mõ trắng), Chùa Trúc (thẻ quẻ như thẻ tre, mõ xanh, que hương mảnh), Chùa Vàng (nền đen viền vàng, thẻ quẻ góc vát, mõ vàng).
   Chỉ giao cho người có Night Pass qua GET /api/pro/chua-hoc-ba.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h, s) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " " + s + "% 90%),hsl(" + h + " " + (s - 15) + "% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 36%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const S = {
    snow: { h: 205, s: 80, deco: ["❄️", "⛄", "🪔", "📚"], hero: "❄️學", cg: ["#cfeaff", "#2a5fa8"],
      css: "#play .chCard{border-radius:9cqw;background:linear-gradient(#f2fbff,#cfeaff)!important;border-color:#7fc4ff;transform:none}#play .chMo{background:radial-gradient(circle at 35% 30%,#fff,#bcd9f2);border-color:#5a86b8}#play .chStick{background:linear-gradient(90deg,#e8eef5,#fff,#cfd9e6)}#play .chW,#play .chO{border-radius:99px}" },
    bamboo: { h: 135, s: 55, deco: ["🎋", "🍃", "🐼", "📚"], hero: "🎋學", cg: ["#bfe8a8", "#1f5a2a"],
      css: "#play .chCard{border-radius:1cqw;background:repeating-linear-gradient(90deg,#e6f2c4 0 14cqw,#cfe39a 14cqw 14.8cqw)!important;border:1cqw solid #5a8a2a;transform:none;color:#1f3a10}#play .chMo{border-radius:50%;background:radial-gradient(circle at 35% 30%,#a8d878,#3f7a22);border-color:#2a5a14}#play .chStick{width:3.4cqw;background:linear-gradient(90deg,#9ac060,#d4e8a0,#7aa040)}#play .chW,#play .chO{border-radius:1cqw;border-style:dashed}" },
    gold: { h: 45, s: 85, deco: ["🪙", "👑", "🏮", "📚"], hero: "👑學", cg: ["#ffe27a", "#3a2a00"],
      css: "#play .chCard{clip-path:polygon(0 4cqw,4cqw 0,calc(100% - 4cqw) 0,100% 4cqw,100% calc(100% - 4cqw),calc(100% - 4cqw) 100%,4cqw 100%,0 calc(100% - 4cqw));border-radius:0;background:linear-gradient(#fff3c0,#ffd45a)!important;transform:none}#play .chMo{background:radial-gradient(circle at 35% 30%,#fff2a8,#d9a21a);border-color:#8a6400}#play .chStick i{background:#ffd24a}#play .chW,#play .chO{border-radius:0;clip-path:polygon(3% 0,97% 0,100% 50%,97% 100%,3% 100%,0 50%);border-width:0;background:linear-gradient(#ffe27a,#d9a21a);color:#3a2a00}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h, d.s); PF.skins[id] = Object.assign({ vl: b.vl, vd: b.vd }, d); delete PF.skins[id].h; delete PF.skins[id].s; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
