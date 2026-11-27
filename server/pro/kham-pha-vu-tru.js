"use strict";
/* Mã BẢN TRẢ PHÍ của game Khám Phá Vũ Trụ (Pop Play): 3 giao diện Night Pass (cùng bản free miễn phí = "basic" trong trang game) đổi HẲN hình khối + màu + nền:
   Sao Hỏa (nút bo nhẹ màu cam đỏ), Trăng Băng (nút và câu hỏi dạng viên thuốc xanh băng), Tinh Vân (nút lục giác dẹt, thẻ viền đôi).
   Chỉ giao cho người có Night Pass qua GET /api/pro/kham-pha-vu-tru.js (hoặc dùng thử 1 ván). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm.
   Mỗi giao diện = { vars (biến CSS đặt lên #play), css (luật riêng), deco (emoji nền), hero }. */
function main(PF, OPTS) {
  "use strict";
  const S = {
    mars: { vars: { "--sb": "linear-gradient(#a3401a,#3a1208)", "--accent": "#ff7a3a" }, deco: ["☄️", "🔴", "🛸"],
      css: "#play #arena{background:radial-gradient(ellipse at 30% 10%,#a3401a,#2a0c06 70%)}#play .ans{background:linear-gradient(#e0662a,#a83a10);box-shadow:0 1cqw 0 #5a1a06;border-radius:2cqw}#play .spQ{border-radius:2cqw;border-color:#ffb27a}#play .spTrack .line{background:#ffb27a88}" },
    ice: { vars: { "--sb": "linear-gradient(#5ab8ff,#0a2a5a)", "--accent": "#7fd0ff" }, deco: ["❄️", "🧊", "🌙"],
      css: "#play #arena{background:radial-gradient(ellipse at 30% 10%,#5ab8ff,#0a2a5a 70%)}#play .ans{border-radius:99px;background:linear-gradient(#a8e4ff,#4a9ae0);color:#04223f;box-shadow:0 1cqw 0 #1a5a9a}#play .spQ{border-radius:99px;padding:2cqw 7cqw}#play .spFact{border-radius:99px / 14%}" },
    nebula: { vars: { "--sb": "linear-gradient(#ff5fd0,#2a0a5a)", "--accent": "#ff5fd0" }, deco: ["🌌", "💫", "✨"],
      css: "#play #arena{background:radial-gradient(ellipse at 70% 20%,#ff5fd0,#2a0a5a 70%)}#play .ans{border-radius:0;clip-path:polygon(4% 0,96% 0,100% 50%,96% 100%,4% 100%,0 50%);box-shadow:none;background:linear-gradient(90deg,#c24bff,#ff5fa8)}#play .spQ{border-radius:1cqw;border-style:dashed}#play .spFact{border-radius:0;border-style:double}" }
  };
  for (const id in S) PF.skins[id] = S[id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
