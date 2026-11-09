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

  /* ---- Khu 2 & 3: mỗi giao diện đổi cảnh nền (lớp trên/dưới), hình giỏ/nút, hình dạng các ô đáp án — không chỉ đổi màu ---- */
  const L = "#lesson #act{isolation:isolate}";
  const X = {
    harvest: L + "#act::before{content:'🌾🌾🌾🌾🌾🌾🌾';position:absolute;left:0;right:0;bottom:0;height:16cqw;z-index:-1;font-size:11cqw;line-height:1;text-align:center;white-space:nowrap;overflow:hidden;background:linear-gradient(0deg,#8a5a24,transparent);letter-spacing:-.5cqw;padding-top:6cqw}" +
      "#act::after{content:'🚜';position:absolute;right:3cqw;top:2cqw;font-size:11cqw;z-index:-1;animation:tract 6s ease-in-out infinite alternate}@keyframes tract{to{transform:translateX(-8cqw)}}" +
      "#act .field{border:1.4cqw solid #8a5a24;border-radius:3cqw;background:repeating-linear-gradient(90deg,transparent 0 11cqw,rgba(120,70,20,.35) 11cqw 12cqw),rgba(255,235,190,.35)}#act .basket span{font-size:0}#act .basket span::before{content:'🧺';font-size:20cqw;line-height:1}" +
      "#act .opt,#act .duck,#act .tile{border-radius:3cqw;background:repeating-linear-gradient(0deg,#e8c070 0 1.2cqw,#d8a850 1.2cqw 2.4cqw);color:#5a2d0c;border:.8cqw solid #8a5a24;box-shadow:0 1cqw 0 #6a3a10}#act .go{border-radius:3cqw;background:#6a8a2a}",
    flower: L + "#act::before{content:'🌷🌻🌼🌸🌷🌻🌼🌸';position:absolute;left:0;right:0;bottom:-1cqw;z-index:-1;font-size:11cqw;line-height:1;text-align:center;white-space:nowrap;overflow:hidden;animation:fsw 4s ease-in-out infinite alternate}@keyframes fsw{to{transform:translateX(-3cqw)}}" +
      "#act::after{content:'🐝';position:absolute;left:10cqw;top:18cqw;font-size:9cqw;z-index:-1;animation:bee 7s ease-in-out infinite}@keyframes bee{25%{transform:translate(50cqw,8cqw)}50%{transform:translate(70cqw,-4cqw)}75%{transform:translate(20cqw,10cqw)}}" +
      "#act .field{border-radius:50% 50% 8cqw 8cqw/20% 20% 8cqw 8cqw;background:radial-gradient(circle at 50% 120%,rgba(120,200,90,.5),transparent 60%)}#act .basket span{font-size:0}#act .basket span::before{content:'🪺';font-size:20cqw;line-height:1}#act .opt,#act .duck,#act .tile{border-radius:50%;width:19cqw;height:19cqw;min-height:0;display:grid;place-items:center;padding:0;background:radial-gradient(circle,#fff0a0 0 26%,#fff 27%);border:1cqw solid #ff9ac8;box-shadow:0 1cqw 0 #d86a9a}#act .go{border-radius:50%;width:22cqw;height:22cqw}",
    island: L + "#act::before{content:'🌴';position:absolute;left:-3cqw;top:6cqw;font-size:26cqw;z-index:-1;transform-origin:50% 100%;animation:palm 5s ease-in-out infinite alternate}@keyframes palm{to{transform:rotate(6deg)}}" +
      "#act::after{content:'';position:absolute;left:0;right:0;bottom:0;height:20cqw;z-index:-1;background:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 6cqw,transparent 6cqw 12cqw) 0 3cqw/24cqw 3cqw repeat-x,linear-gradient(0deg,#12a4b8,rgba(18,164,184,0));animation:wave 3s linear infinite}@keyframes wave{to{background-position:24cqw 3cqw,0 0}}" +
      "#act .basket span{font-size:0}#act .basket span::before{content:'🥥';font-size:19cqw;line-height:1}#act .opt,#act .duck,#act .tile{border-radius:10cqw 10cqw 18cqw 18cqw;background:linear-gradient(#a8743a,#6a4220);color:#fff8e0;border:.8cqw solid #3a2410;box-shadow:0 1cqw 0 #2a1808}#act .go{border-radius:14cqw}",
    moon: L + "#act::before{content:'🌙';position:absolute;right:5cqw;top:2cqw;font-size:16cqw;z-index:-1;filter:drop-shadow(0 0 4cqw #c8ff6a);animation:mglow 4s ease-in-out infinite alternate}@keyframes mglow{to{filter:drop-shadow(0 0 8cqw #c8ff6a)}}" +
      "#act::after{content:'✦  ✧   ✦    ✧  ✦   ✧';position:absolute;left:3cqw;right:3cqw;top:20cqw;z-index:-1;font-size:5cqw;color:#c8ff6a;white-space:nowrap;overflow:hidden;opacity:.6;animation:tw 2.4s ease-in-out infinite alternate}@keyframes tw{to{opacity:.15}}" +
      "#act .field{border:.6cqw solid rgba(200,255,106,.5);border-radius:6cqw;background:radial-gradient(circle at 50% 40%,rgba(200,255,106,.12),transparent 70%)}#act .opt,#act .duck,#act .tile{border-radius:50% 50% 50% 8cqw;background:#12210a;color:#c8ff6a;border:.7cqw solid #c8ff6a;box-shadow:0 0 3cqw rgba(200,255,106,.45)}#act .go{border-radius:50% 50% 50% 8cqw;background:#c8ff6a;color:#12210a}",
    fair: L + "#act::before{content:'';position:absolute;left:0;right:0;top:0;height:11cqw;z-index:-1;background:repeating-linear-gradient(90deg,#ff3df0 0 8cqw,#fff 8cqw 16cqw);clip-path:polygon(0 0,100% 0,100% 55%,96% 100%,88% 55%,80% 100%,72% 55%,64% 100%,56% 55%,48% 100%,40% 55%,32% 100%,24% 55%,16% 100%,8% 55%,4% 100%,0 55%)}" +
      "#act::after{content:'🎈 🎈  🎈   🎈';position:absolute;left:2cqw;right:2cqw;bottom:4cqw;z-index:-1;font-size:9cqw;white-space:nowrap;overflow:hidden;animation:bal 3s ease-in-out infinite alternate}@keyframes bal{to{transform:translateY(-3cqw)}}" +
      "#act .eq .grp{border-radius:999px;background:#ffe9ff;border:.8cqw dashed #ff3df0}#act .opt,#act .duck,#act .tile,#act .pen{border-radius:999px;background:linear-gradient(#ff7af5,#c820b8);color:#fff;border:.8cqw dashed #ffe9ff;box-shadow:0 0 4cqw rgba(255,61,240,.7)}#act .go{border-radius:999px}",
    boat: L + "#act::before{content:'';position:absolute;left:0;right:0;bottom:0;height:24cqw;z-index:-1;background:repeating-linear-gradient(90deg,rgba(255,255,255,.45) 0 5cqw,transparent 5cqw 10cqw) 0 2cqw/20cqw 3cqw repeat-x,repeating-linear-gradient(90deg,rgba(255,255,255,.3) 0 7cqw,transparent 7cqw 14cqw) 6cqw 9cqw/28cqw 3cqw repeat-x,linear-gradient(0deg,#1f9aa8,rgba(31,154,168,0));animation:wv2 4s linear infinite}@keyframes wv2{to{background-position:20cqw 2cqw,34cqw 9cqw,0 0}}" +
      "#act::after{content:'🛶';position:absolute;left:0;bottom:15cqw;font-size:14cqw;z-index:-1;animation:boatm 9s ease-in-out infinite alternate}@keyframes boatm{to{transform:translateX(75cqw)}}" +
      "#act .opt,#act .duck,#act .tile,#act .pen{border-radius:6cqw 6cqw 14cqw 14cqw;background:repeating-linear-gradient(90deg,#d8b070 0 2cqw,#c89a50 2cqw 2.6cqw);color:#3a2408;border:.8cqw solid #8a5a24;box-shadow:0 1cqw 0 #5a3a10}#act .eq .grp{border-radius:50% 50% 8cqw 8cqw/30% 30% 8cqw 8cqw;background:#fff3d0}",
    cake: L + "#act::before{content:'';position:absolute;left:0;right:0;bottom:0;height:16cqw;z-index:-1;background:repeating-linear-gradient(135deg,#fff 0 4cqw,#ffc0d4 4cqw 8cqw);border-top:1.4cqw solid #d85a8a}" +
      "#act::after{content:'🍰 🧁 🍩 🍪 🍓';position:absolute;left:3cqw;right:3cqw;bottom:13cqw;z-index:-1;font-size:9cqw;white-space:nowrap;overflow:hidden;text-align:center}" +
      "#act .opt,#act .duck,#act .tile,#act .pen{border-radius:3cqw 3cqw 8cqw 8cqw;background:repeating-linear-gradient(90deg,#fff 0 2.4cqw,#ffe0ea 2.4cqw 4.8cqw);color:#6a3a2a;border:.8cqw solid #d85a8a;box-shadow:0 1.2cqw 0 #d85a8a,inset 0 -2cqw 0 rgba(216,90,138,.2)}#act .eq .grp{border-radius:8cqw;background:#fff;border:.8cqw dashed #d85a8a}",
    space: L + "#act::before{content:'';position:absolute;inset:0;z-index:-1;background:radial-gradient(circle,#fff 0 .3cqw,transparent .4cqw) 0 0/12cqw 12cqw,radial-gradient(circle,rgba(110,231,255,.8) 0 .3cqw,transparent .4cqw) 6cqw 6cqw/17cqw 17cqw;opacity:.6;animation:stf 8s linear infinite}@keyframes stf{to{background-position:0 12cqw,6cqw 23cqw}}" +
      "#act::after{content:'🪐';position:absolute;right:3cqw;bottom:2cqw;font-size:18cqw;z-index:-1;opacity:.85;animation:orb 10s linear infinite}@keyframes orb{50%{transform:translateY(-6cqw) rotate(18deg)}}" +
      "#act .eq .grp{border-radius:2cqw;border:.6cqw solid #6ee7ff;background:rgba(10,27,74,.8);box-shadow:0 0 3cqw rgba(110,231,255,.4)}#act .opt,#act .duck,#act .tile,#act .pen{background:#0a1b4a;color:#6ee7ff;border:.6cqw solid #6ee7ff;box-shadow:0 0 4cqw rgba(110,231,255,.55),inset 0 0 3cqw rgba(110,231,255,.2)}"
  };
  for (let z = 0; z < 3; z++) for (const id in S[z]) if (X[id]) S[z][id].css = (S[z][id].css || "") + X[id];
  for (let z = 0; z < 3; z++) for (const id in S[z]) PF.skins[z][id] = S[z][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
