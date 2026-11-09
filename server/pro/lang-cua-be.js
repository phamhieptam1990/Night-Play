"use strict";
/* Mã BẢN TRẢ PHÍ của game Làng Của Bé (Pop Play): 12 GIAO DIỆN Night Pass (4 cho mỗi khu; giao diện "basic" miễn phí nằm sẵn trong trang game).
   Mỗi giao diện = bảng màu + khung/viền/bóng riêng + hình rơi trang trí riêng + CSS riêng cho nút / thẻ.
   Chỉ giao cho người có Night Pass qua GET /api/pro/lang-cua-be.js (hoặc vé chơi hộ 24 giờ / bản dùng thử 1 bài), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv;
  const S = [
    { /* ===== KHU 1: BƯU ĐIỆN CHỮ CÁI ===== */
      night: {
        vars: v("linear-gradient(#1a1040,#4b2a7a)", "#2a1a5e", "#fff3c8", "#ffb703", "#2a1a00", "5cqw", ".8cqw solid #ffb703", "0 0 3cqw rgba(255,183,3,.55)"),
        deco: ["🏮", "✨", "🌙"],
        css: "#act .env b{color:#ffb703;text-shadow:0 0 2cqw #ffb703}#act .house i{font-size:0;filter:none}#act .house i::before{content:'🏰';font-size:27cqw;line-height:1;filter:drop-shadow(0 0 3cqw #ffb70388)}#act .env span{filter:drop-shadow(0 0 2cqw #ffb703)}"
      },
      snow: {
        vars: v("linear-gradient(#e8f4ff,#b9d8f2)", "#fff", "#1f3b57", "#3b82f6", "#fff", "8cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,110,170,.28)"),
        deco: ["❄️", "⛄", "✨"],
        css: "#act .house i{font-size:0;filter:none}#act .house i::before{content:'⛄';font-size:25cqw;line-height:1}#act .house b{transform:translate(-50%,40%);color:#1f3b57;text-shadow:0 0 1cqw #fff}"
      },
      candy: {
        vars: v("linear-gradient(#ffd3ea,#ffb0d6)", "#fff0f8", "#6b1d4a", "#ff4fa3", "#fff", "9cqw", ".9cqw dashed #fff", "0 1cqw 0 rgba(255,79,163,.45)"),
        deco: ["🍭", "🍬", "🧁"],
        css: "#act .house i{font-size:0;filter:none}#act .house i::before{content:'🍰';font-size:25cqw;line-height:1}#act .house b{transform:translate(-50%,10%);color:#fff;text-shadow:0 .6cqw 0 #d44f99}#act .opt,#act .tile,#act .lcard{transform:rotate(-1.5deg)}"
      },
      jungle: {
        vars: v("linear-gradient(#bff0b0,#4fae6a)", "#f4ffe8", "#1f3d1f", "#e07a1f", "#fff", "3cqw", "1cqw solid #2f7a45", "0 1cqw 0 rgba(31,90,50,.5)"),
        deco: ["🌿", "🦜", "🍃"],
        css: "#act .house i{font-size:0;filter:none}#act .house i::before{content:'🌳';font-size:27cqw;line-height:1}#act .house b{transform:translate(-50%,10%)}"
      }
    },
    { /* ===== KHU 2: NÔNG TRẠI SỐ ===== */
      harvest: {
        vars: v("linear-gradient(#ffd9a0,#e8924a)", "#fff4e0", "#5a2d0c", "#b5541c", "#fff", "4cqw", "1cqw solid #b5541c", "0 1cqw 0 rgba(120,60,10,.4)"),
        deco: ["🍂", "🎃", "🌽"], css: ""
      },
      flower: {
        vars: v("linear-gradient(#ffe0f0,#c9f0c0)", "#fff", "#5a2a4a", "#e0559a", "#fff", "10cqw", ".8cqw solid #ffc2e0", "0 1cqw 3cqw rgba(224,85,154,.3)"),
        deco: ["🌸", "🦋", "🌼"], css: "#act .opt,#act .duck{border-radius:50%}"
      },
      island: {
        vars: v("linear-gradient(#aef0ff,#ffe9a8)", "#fffbe8", "#0d4a5a", "#12a4b8", "#fff", "6cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(18,164,184,.3)"),
        deco: ["🌴", "🐠", "🥥"], css: ""
      },
      moon: {
        vars: v("linear-gradient(#0e1b3d,#2c3f78)", "#1f2f63", "#e8f0ff", "#c8ff6a", "#12210a", "5cqw", ".7cqw solid #c8ff6a", "0 0 3cqw rgba(200,255,106,.4)"),
        deco: ["✨", "🌙", "🪲"], css: "#act .basket b{color:#c8ff6a}"
      }
    },
    { /* ===== KHU 3: CHỢ PHÉP TÍNH ===== */
      fair: {
        vars: v("linear-gradient(#2a0f4d,#7a1f6e)", "#3a1670", "#ffe9ff", "#ff3df0", "#2a0030", "999px", ".7cqw solid #ff3df0", "0 0 3.5cqw rgba(255,61,240,.7)"),
        deco: ["🎪", "🎈", "🎡"], css: "#act .opt{border-radius:999px}#act .eq b{text-shadow:0 0 2cqw #ff3df0}"
      },
      boat: {
        vars: v("linear-gradient(#b8f0e8,#5cc2c8)", "#f0fffc", "#0b4650", "#ff8c42", "#fff", "5cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(11,70,80,.3)"),
        deco: ["🛶", "🥭", "🌺"], css: ""
      },
      cake: {
        vars: v("linear-gradient(#fff2e0,#ffc9d9)", "#fff", "#6a3a2a", "#d85a8a", "#fff", "8cqw", ".9cqw dashed #f3a6c0", "0 1cqw 0 rgba(216,90,138,.35)"),
        deco: ["🧁", "🍰", "🍓"], css: ""
      },
      space: {
        vars: v("linear-gradient(#050b2a,#1b2f7a)", "#14214f", "#e0ecff", "#6ee7ff", "#02202a", "2cqw", ".7cqw solid #6ee7ff", "0 0 3cqw rgba(110,231,255,.45)"),
        deco: ["🚀", "⭐", "🪐"], css: "#act .opt,#act .tile,#act .duck{clip-path:polygon(8% 0,92% 0,100% 12%,100% 88%,92% 100%,8% 100%,0 88%,0 12%)}"
      }
    }
  ];
  for (let z = 0; z < 3; z++) for (const id in S[z]) PF.skins[z][id] = S[z][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
