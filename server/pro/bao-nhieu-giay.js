"use strict";
/* Mã BẢN TRẢ PHÍ của game Bao Nhiêu Giây? (Cozy Play): 3 loại riêng (Đếm nhịp, Mốc ngẫu nhiên, Marathon 30 giây) và 4 giao diện có BỐ CỤC khác hẳn nhau:
   Đồng hồ cát sa mạc (đồng hồ cát bên trái, điều khiển bên phải), Gỡ bom hẹn giờ (bảng LED ngang + nút đỏ tròn lớn), Phóng tên lửa (bảng điều khiển + cần gạt dọc bên phải),
   Lò bánh tiệm xưa (đảo ngược: nút vặn ở trên, cửa sổ lò ở giữa, mốc giờ ở dưới). Chỉ giao cho người có Night Pass qua GET /api/pro/bao-nhieu-giay.js (hoặc dùng thử / vé chơi hộ).
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.types = [true, true, true, true];
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const S = {
    sand: { h: 38, masc: "⏳", mascRun: "⌛", deco: ["🌵", "🐪", "☀️", "🏜️"], hero: "🏜️⏳", cg: ["#f6c66a", "#9a5b0e"],
      css: "#bs{display:grid;grid-template-columns:44% 1fr;grid-template-rows:auto 1fr auto auto;column-gap:3cqw;row-gap:2cqw;align-items:center;padding:2cqw;background:linear-gradient(180deg,transparent 55%,color-mix(in srgb,var(--accent) 28%,transparent) 55%,color-mix(in srgb,var(--accent) 45%,transparent));border-radius:4cqw}" +
        "#bsScene::before{content:'🌵  🐪  🌵';position:absolute;left:0;right:0;bottom:1cqw;text-align:center;font-size:8cqw;opacity:.8;letter-spacing:4cqw}#bsScene::after{content:'☀️';position:absolute;right:4cqw;top:2cqw;font-size:11cqw}" +
        "#bsTop{grid-column:2;grid-row:1;text-align:left}#bsTarget{font-size:5.6cqw}#bsDots{justify-content:flex-start}" +
        "#bsFace{grid-column:1;grid-row:1 / span 3;width:100%;height:100%;aspect-ratio:auto;border:0;background:none;box-shadow:none;border-radius:0;justify-content:center}#bsFace::before{display:none}" +
        "#bsMasc{font-size:38cqw;filter:drop-shadow(0 2cqw 0 rgba(120,70,10,.25));transition:transform .6s}#bs.run #bsMasc{animation:flip 2.4s ease-in-out infinite}@keyframes flip{50%{transform:rotate(180deg)}}" +
        "#bsBig{font-size:11cqw;color:var(--accent)}#bsSub{max-width:100%}" +
        "#bsBtn{grid-column:2;grid-row:3;min-height:22cqw;border-radius:5cqw;font-size:5.2cqw;background:linear-gradient(#f4b942,#d9822b);color:#3a2410;box-shadow:0 1.6cqw 0 #9a5b0e}#bs.run #bsBtn{background:linear-gradient(#ff7a59,#d6452a);color:#fff;box-shadow:0 1.6cqw 0 #8a2a14}#bsLog{grid-column:1 / -1;grid-row:4}" },
    bomb: { h: 355, masc: "💣", mascRun: "🧨", deco: ["💥", "⚠️", "🔧", "🧯"], hero: "💣⚠️", cg: ["#374151", "#7f1d1d"],
      css: "#bs{background:repeating-linear-gradient(45deg,rgba(250,204,21,.14) 0 3cqw,transparent 3cqw 6cqw);border-radius:4cqw;padding:2cqw 1cqw;gap:2.4cqw}" +
        "#bsTop{order:3}#bsTarget{font-size:5.4cqw;color:#facc15;background:#14181d;border-radius:2cqw;padding:1.2cqw 3cqw;display:inline-block;border:.6cqw solid #facc15}" +
        "#bsFace{order:1;width:100%;aspect-ratio:auto;height:34cqw;border-radius:3cqw;background:#14181d;border:1.2cqw solid #6b7280;box-shadow:inset 0 0 0 1cqw #0b0d10,0 1.6cqw 0 rgba(0,0,0,.3);flex-direction:row;gap:4cqw;justify-content:space-around;padding:0 4cqw}#bsFace::before{display:none}" +
        "#bsFace::after{content:'';position:absolute;left:4cqw;right:4cqw;bottom:2cqw;height:2cqw;border-radius:1cqw;background:linear-gradient(90deg,#ef4444 0 25%,#3b82f6 25% 50%,#22c55e 50% 75%,#facc15 75%)}" +
        "#bsMasc{font-size:13cqw}#bsBig{font-family:'Courier New',monospace;font-weight:900;font-size:13cqw;color:#ff3b3b;text-shadow:0 0 3cqw #ff3b3b;letter-spacing:.4cqw}#bs.run #bsBig{animation:led .5s steps(2) infinite}@keyframes led{50%{opacity:.35}}#bsSub{position:absolute;left:0;right:0;top:1.4cqw;max-width:100%;color:#9ca3af;font-size:2.8cqw}" +
        "#bsBtn{order:2;width:40cqw;height:40cqw;min-height:0;border-radius:50%;font-size:5cqw;line-height:1.1;background:radial-gradient(circle at 35% 28%,#ff8a8a,#c1121f 65%);color:#fff;border:1.6cqw solid #7f0d14;box-shadow:0 2.2cqw 0 #5a090e,0 0 0 1.6cqw #14181d;align-self:center}#bsBtn:active{transform:translateY(1.2cqw)}#bs.run #bsBtn{animation:pulseb .7s ease-in-out infinite}@keyframes pulseb{50%{box-shadow:0 2.2cqw 0 #5a090e,0 0 0 3cqw rgba(239,68,68,.45)}}#bsLog{order:4}" },
    rocket: { h: 250, masc: "🚀", mascRun: "🛰️", deco: ["⭐", "🌙", "🪐", "👨‍🚀"], hero: "🚀🌙", cg: ["#4338ca", "#0b1033"],
      css: "#bs{display:grid;grid-template-columns:1fr 26cqw;grid-template-rows:auto 1fr auto;gap:2cqw 3cqw;background:radial-gradient(circle at 30% 20%,rgba(120,100,255,.25),transparent 60%);border-radius:4cqw;padding:2cqw}" +
        "#bsScene::before{content:'✨   ⭐   ✨   🌙';position:absolute;inset:3cqw;font-size:6cqw;letter-spacing:6cqw;opacity:.55;line-height:3}" +
        "#bsTop{grid-column:1 / -1;grid-row:1}#bsTarget{font-size:5.6cqw}" +
        "#bsFace{grid-column:1;grid-row:2;width:100%;height:100%;aspect-ratio:auto;border-radius:6cqw 6cqw 14cqw 14cqw;background:linear-gradient(#10162f,#1c2552);border:1.2cqw solid #6366f1;box-shadow:inset 0 0 6cqw rgba(99,102,241,.35)}#bsFace::before{inset:auto;left:6cqw;right:6cqw;top:4cqw;height:1.4cqw;border-radius:1cqw;background:repeating-linear-gradient(90deg,#6366f1 0 3cqw,transparent 3cqw 5cqw);-webkit-mask:none;mask:none}" +
        "#bsMasc{font-size:24cqw}#bs.run #bsMasc{animation:lift 1.6s ease-in infinite}@keyframes lift{0%{transform:translateY(2cqw)}100%{transform:translateY(-3cqw) scale(1.08)}}#bsBig{color:#a5b4fc;font-size:11cqw}#bsSub{color:#c7d2fe}" +
        "#bsBtn{grid-column:2;grid-row:2;width:100%;height:100%;min-height:0;border-radius:13cqw;font-size:4.4cqw;writing-mode:vertical-rl;text-orientation:upright;letter-spacing:.8cqw;background:linear-gradient(#34d399,#059669);color:#022c22;box-shadow:0 1.6cqw 0 #065f46}#bs.run #bsBtn{background:linear-gradient(#fb7185,#e11d48);color:#fff;box-shadow:0 1.6cqw 0 #881337}#bsLog{grid-column:1 / -1;grid-row:3}" },
    oven: { h: 25, masc: "🥐", mascRun: "🍞", deco: ["🥖", "🧁", "🍰", "☕"], hero: "🥐🔥", cg: ["#f59e0b", "#7c2d12"],
      css: "#bs{flex-direction:column-reverse;background:repeating-linear-gradient(90deg,color-mix(in srgb,var(--accent) 10%,transparent) 0 4cqw,transparent 4cqw 8cqw);border-radius:4cqw;padding:2cqw}" +
        "#bsTop{background:var(--panel);border-radius:3cqw;border:.8cqw solid var(--accent);padding:1.6cqw 2cqw}#bsTarget{font-size:5cqw}" +
        "#bsFace{width:84%;aspect-ratio:5/4;border-radius:14cqw 14cqw 4cqw 4cqw;background:linear-gradient(#2b1a10,#4a2a14);border:2cqw solid #a8672a;box-shadow:inset 0 0 8cqw rgba(255,150,40,.45),0 2cqw 0 rgba(0,0,0,.25)}#bsFace::before{display:none}" +
        "#bsMasc{font-size:20cqw;filter:drop-shadow(0 0 3cqw rgba(255,160,50,.8))}#bs.run #bsMasc{animation:rise 3s ease-in-out infinite}@keyframes rise{50%{transform:scale(1.18)}}#bsBig{color:#ffd9a0;font-size:10cqw}#bsSub{color:#f2c898}" +
        "#bsBtn{width:34cqw;height:34cqw;min-height:0;border-radius:50%;align-self:center;font-size:4.6cqw;line-height:1.1;background:radial-gradient(circle at 35% 30%,#fde68a,#d97706 70%);color:#3a1d05;border:1.4cqw solid #92400e;box-shadow:0 1.8cqw 0 #6b3410}#bs.run #bsBtn{background:radial-gradient(circle at 35% 30%,#fca5a5,#dc2626 70%);color:#fff;border-color:#7f1d1d;box-shadow:0 1.8cqw 0 #5b1111}#bsLog{order:-1}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, masc: d.masc, mascRun: d.mascRun, cg: d.cg, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
