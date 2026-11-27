"use strict";
/* Mã BẢN TRẢ PHÍ của game Bắt Kẻ Nói Dối (Cozy Play): 3 loại riêng (Đua 60 giây, Sinh tồn, Thử thách khó) và 3 giao diện đổi HẲN hình thẻ câu hỏi + nút đáp án + nền + phông:
   Phim Đen Trắng (thẻ giấy kẻ, phông chữ máy đánh chữ, nút vuông), Bản Tin Tối (thẻ báo viền đỏ, nhãn LIVE), Neon Điều Tra (thẻ bo tròn phát sáng, nút viên thuốc).
   Chỉ giao cho người có Night Pass qua GET /api/pro/bat-ke-noi-doi.js (hoặc dùng thử / vé chơi hộ). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h, s) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " " + s + "% 90%),hsl(" + h + " " + (s - 15) + "% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 36%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const S = {
    noir: { h: 30, s: 8, deco: ["🎞️", "🚬", "🕵️", "🔦"], hero: "🎞️🕵️", cg: ["#d6d3cc", "#2b2a28"],
      css: "#play{--font:Georgia,'Times New Roman',serif}#play .qzCard{border-radius:0;border:.8cqw double var(--ink);background:repeating-linear-gradient(0deg,transparent 0 5px,rgba(0,0,0,.05) 5px 6px),var(--panel)}#play .qzO{border-radius:0;border-style:dashed;text-transform:uppercase;letter-spacing:.2cqw;font-size:3.4cqw}#play .qzO b{border-radius:0}#play .qzTag{border-radius:0}" },
    news: { h: 355, s: 75, deco: ["📰", "📺", "🎙️", "📡"], hero: "📰🎙️", cg: ["#ff6a6a", "#7a0e1e"],
      css: "#play .qzCard{border-radius:1cqw;border-top:2cqw solid var(--accent);font-family:Georgia,serif}#play .qzTop::after{content:'LIVE ●';order:3;background:var(--bad);color:#fff;border-radius:1cqw;padding:.6cqw 2cqw;font:800 3cqw var(--font)}#play .qzO{border-radius:1cqw;border-left:2cqw solid var(--accent)}#play .qzO b{border-radius:1cqw}" },
    neon: { h: 285, s: 95, deco: ["🌃", "🔮", "💜", "⚡"], hero: "🌃🔍", cg: ["#c25bff", "#1a0a4a"],
      css: "#play .qzCard{border-radius:7cqw;border:.6cqw solid var(--accent);box-shadow:0 0 5cqw var(--accent),inset 0 0 3cqw rgba(255,255,255,.08)}#play .qzO{border-radius:99px;border:.5cqw solid var(--accent);box-shadow:0 0 2.4cqw rgba(255,255,255,.12)}#play .qzTag{box-shadow:0 0 3cqw var(--accent)}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h, d.s || 70); PF.skins[id] = Object.assign({ vl: b.vl, vd: b.vd }, d); delete PF.skins[id].h; delete PF.skins[id].s; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
