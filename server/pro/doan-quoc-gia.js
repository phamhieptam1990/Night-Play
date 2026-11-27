"use strict";
/* Mã BẢN TRẢ PHÍ của game Đoán Quốc Gia (Pop Play): 3 giao diện Night Pass (cùng bản free miễn phí = "basic" trong trang game) đổi HẲN hình khối + màu + nền:
   Bản Đồ Cổ (giấy da, viền kép, chữ có chân), Quả Địa Cầu (khung bầu dục xanh biển, đất xanh lá), Radar Đêm (màn đen lưới quét, nét neon).
   Chỉ giao cho người có Night Pass qua GET /api/pro/doan-quoc-gia.js (hoặc dùng thử 1 ván). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm.
   Mỗi giao diện = { vars (biến CSS đặt lên #play), css (luật riêng), deco (emoji nền), hero }. */
function main(PF, OPTS) {
  "use strict";
  const S = {
    atlas: { vars: { "--sb": "linear-gradient(#f3e2b8,#d9b97a)", "--accent": "#8a5a1c", "--on-accent": "#fff8e6" }, deco: ["🧭", "📜", "⚓"],
      css: "#play .gq{background:#f6e8c4!important;border:1cqw double #7a5a2a;border-radius:1cqw}#play .gq svg.map path{fill:#b98a4a;stroke:#5a3a12}#play .gqPat,#play .gqIn input{font-family:Georgia,serif}#play .gqIn input{border-radius:1cqw;border-color:#7a5a2a}#play .gqSug button{border-radius:1cqw}" },
    globe: { vars: { "--sb": "linear-gradient(#bfe9ff,#6fb8f0)", "--accent": "#1b6fd0", "--on-accent": "#fff" }, deco: ["🌐", "✈️", "🧳"],
      css: "#play .gq{border-radius:50%/42%;background:radial-gradient(circle at 35% 30%,#8fd8ff,#1b5fb5)!important;padding:7cqw}#play .gq svg.map path{fill:#7ed957;stroke:#1e6a2a}#play .gq.flag svg.flag{border-radius:50%/30%}#play .gqIn input{border-radius:99px}" },
    radar: { vars: { "--sb": "linear-gradient(#04210f,#0b3d1c)", "--accent": "#46ff78", "--on-accent": "#03140a", "--panel": "#0a2a14", "--ink": "#d8ffe4" }, deco: ["📡", "🛰️", "🟢"],
      css: "#play .gq{background:repeating-linear-gradient(0deg,rgba(70,255,120,.08) 0 .6cqw,transparent .6cqw 3cqw),#02140a!important;border:.6cqw solid #46ff78;box-shadow:0 0 4cqw #46ff78;border-radius:2cqw}#play .gq svg.map path{fill:rgba(70,255,120,.25);stroke:#46ff78;stroke-width:1.2}#play .gqPat{color:#46ff78}#play .gqTop b{background:#0a2a14;color:#46ff78}" }
  };
  for (const id in S) PF.skins[id] = S[id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
