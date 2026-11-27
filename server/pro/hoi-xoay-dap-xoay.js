"use strict";
/* Mã BẢN TRẢ PHÍ của game Hỏi Xoáy Đáp Xoay (Cozy Play): 3 loại riêng (Đua 60 giây, Sinh tồn, Thử thách khó) và 3 giao diện đổi HẲN hình thẻ câu hỏi + nút đáp án + nền + phông:
   Rạp Xiếc (thẻ sọc, nút viên thuốc), Ảo Thuật Gia (thẻ viền vàng nét đứt, nút như lá bài nghiêng), Hố Đen Xoáy (thẻ bầu dục, nút vát góc).
   Chỉ giao cho người có Night Pass qua GET /api/pro/hoi-xoay-dap-xoay.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h, s) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " " + s + "% 90%),hsl(" + h + " " + (s - 15) + "% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 36%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const S = {
    circus: { h: 8, s: 85, deco: ["🎪", "🤡", "🎈", "🎟️"], hero: "🎪🤡", cg: ["#ff8a5c", "#8a1f1f"],
      css: "#play .qzCard{border-radius:5cqw;border:1.2cqw solid var(--accent);background:repeating-linear-gradient(90deg,var(--panel) 0 6cqw,var(--field2) 6cqw 12cqw)}#play .qzO{border-radius:99px;border:.8cqw solid var(--accent)}#play .qzO b{border-radius:50%}#play .qzTag{border-radius:2cqw}" },
    magic: { h: 262, s: 70, deco: ["🎩", "🪄", "🃏", "✨"], hero: "🎩🪄", cg: ["#8b6bff", "#1f1050"],
      css: "#play .qzCard{border-radius:2cqw;border:.8cqw dashed #ffd24a;background:var(--panel)}#play .qzO{border-radius:2cqw;border:.6cqw solid #ffd24a;transform:rotate(-.6deg)}#play .qzO:nth-child(even){transform:rotate(.6deg)}#play .qzO b{border-radius:1.2cqw;background:#ffd24a;color:#2a1050}" },
    space: { h: 235, s: 80, deco: ["🌀", "🪐", "🛸", "🌌"], hero: "🌀🪐", cg: ["#4a7bff", "#050a2a"],
      css: "#play .qzCard{border-radius:50% / 22%;padding:4cqw 7cqw}#play .qzO{border-radius:99px 99px 99px 2cqw}#play .qzTag{border-radius:99px;box-shadow:0 0 3cqw var(--accent)}#play .qzAv{animation:fl 6s ease-in-out infinite}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h, d.s || 70); PF.skins[id] = Object.assign({ vl: b.vl, vd: b.vd }, d); delete PF.skins[id].h; delete PF.skins[id].s; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
