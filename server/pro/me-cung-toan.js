"use strict";
/* Mã BẢN TRẢ PHÍ của game Mê Cung Toán Nhanh (Pop Play): 3 giao diện Night Pass (cùng bản free miễn phí = "basic" trong trang game) đổi HẲN hình khối + màu + nền:
   Hang Phô Mai (tường phô mai đục lỗ, cổng tròn), Mê Cung Kẹo (đường và cổng viên thuốc, chuột thành thỏ), Núi Lửa (tường đá tối, cổng vuông phát sáng, thằn lằn).
   Chỉ giao cho người có Night Pass qua GET /api/pro/me-cung-toan.js (hoặc dùng thử 1 ván). main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm.
   Mỗi giao diện = { vars (biến CSS đặt lên #play), css (luật riêng), deco (emoji nền), hero }. */
function main(PF, OPTS) {
  "use strict";
  const S = {
    cheese: { vars: { "--sb": "linear-gradient(#fff2b0,#ffd966)", "--accent": "#d98a00", "--on-accent": "#3b2a00" }, deco: ["🧀", "🐭", "✨"], hero: "🐭",
      css: "#play #arena{--hedge:#e8a317;--hedge2:#f7c548;--path:#fff3c4;--door:#c77d0a}#play .mz{background:radial-gradient(circle at 20% 30%,#c98a0a 0 3cqw,transparent 3.2cqw),radial-gradient(circle at 70% 60%,#c98a0a 0 4cqw,transparent 4.2cqw),radial-gradient(circle at 40% 85%,#c98a0a 0 2.4cqw,transparent 2.6cqw),#f2b630}#play .dr{border-radius:50%;aspect-ratio:1;height:auto;width:78%;max-height:38%}" },
    candy: { vars: { "--sb": "linear-gradient(#ffd1e8,#b8f0e0)", "--accent": "#e0408f", "--on-accent": "#fff" }, deco: ["🍭", "🍬", "🧁"], hero: "🐰",
      css: "#play #arena{--hedge:#ff9ccb;--hedge2:#8ee6c8;--path:#fff0f8;--door:#ff5fa8}#play .col{border-radius:99px}#play .dr{border-radius:99px 99px 4cqw 4cqw;border:1cqw dashed #fff}#play .mzQ{border-radius:99px}" },
    lava: { vars: { "--sb": "linear-gradient(#2a0a0a,#6a1a0a)", "--accent": "#ff6a2a", "--on-accent": "#1a0500", "--panel": "#2b1210", "--ink": "#fff0e6" }, deco: ["🌋", "🔥", "💎"], hero: "🦎",
      css: "#play #arena{--hedge:#3a0d0d;--hedge2:#541414;--path:#2b2b33;--door:#d9480f}#play .dr{border-radius:1cqw;box-shadow:0 0 3cqw #ff6a2a,inset 0 -1.2cqw 0 rgba(0,0,0,.4)}#play .mzQ{border-radius:1cqw;border:.6cqw solid #ff6a2a}#play .path{background:repeating-linear-gradient(0deg,#ff6a2a55 0 2cqw,transparent 2cqw 4.4cqw)}" }
  };
  for (const id in S) PF.skins[id] = S[id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
