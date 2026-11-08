"use strict";
/* Mã BẢN TRẢ PHÍ của game Tháp Vòng Màu (Pop Play): 16 GIAO DIỆN Night Pass (4 cho mỗi loại tháp; giao diện "basic" cầu vồng miễn phí nằm sẵn trong trang game).
   Mỗi giao diện đổi HẲN hình dạng của các vòng (tầng bánh kem, xu vàng, hành tinh, kẹo, bánh kếp, gạch lâu đài, phao, rô-bốt...), cột, lá cờ đích, nền và hình rơi.
   Chỉ giao cho người có Night Pass qua GET /api/pro/thap-vong-mau.js (hoặc bản dùng thử 1 ván / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv;
  const S = [
    { /* ===== 0 · THÁP 3 CỘT ===== */
      cake:   { vars: v("linear-gradient(#ffd3ea,#fff0f8)", "#fff", "rgba(255,255,255,.88)", "#6b1d4a", "#ff4fa3", "#fff", "4cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(255,79,163,.3)"), flag: "🍒", deco: ["🍰", "🍓", "🧁"],
        css: ".peg{--peg:#e8b4a0}.disc{border-radius:1.4cqw 1.4cqw 3.2cqw 3.2cqw;background:linear-gradient(hsl(var(--dhue) 90% 86%) 0 30%,hsl(var(--dhue) 70% 62%) 30%);border:.4cqw solid #fff;box-shadow:0 .6cqw 0 hsl(var(--dhue) 55% 40%)}.disc::after{content:'🍓';position:absolute;top:-3cqw;font-size:3.4cqw}" },
      coin:   { vars: v("linear-gradient(#3a2a0a,#b8860b)", "#fff", "rgba(60,40,10,.55)", "#fff3c8", "#ffd23a", "#3a2a00", "4cqw", ".7cqw solid #ffd23a", "0 0 3cqw rgba(255,210,58,.45)"), flag: "👑", deco: ["🪙", "💰", "✨"],
        css: ".peg{--peg:#8a6a1a}.disc{border-radius:50%/62%;background:radial-gradient(circle at 30% 28%,#fff6b8,#ffcf3a 48%,#a87a00);border:.5cqw solid #7a5a00;box-shadow:0 .7cqw 0 #6a4a00;color:#6a4a00}" },
      planet: { vars: v("linear-gradient(#050b2a,#1b2f7a)", "#fff", "rgba(20,30,80,.6)", "#e0ecff", "#6ee7ff", "#02202a", "5cqw", ".6cqw solid #6ee7ff", "0 0 3cqw rgba(110,231,255,.4)"), flag: "🚩", deco: ["🪐", "⭐", "🌙"],
        css: ".peg{--peg:#6ee7ff}.disc{border-radius:50%;background:radial-gradient(circle at 32% 28%,hsl(var(--dhue) 90% 78%),hsl(var(--dhue) 70% 45%) 60%,hsl(var(--dhue) 70% 25%));border:.4cqw solid rgba(255,255,255,.5);box-shadow:0 0 2cqw hsl(var(--dhue) 90% 60%);color:#fff}.disc::before{content:'';position:absolute;left:-6%;right:-6%;top:42%;height:16%;border:.4cqw solid rgba(255,255,255,.55);border-radius:50%}" },
      candy:  { vars: v("linear-gradient(#ffd3ea,#ffb0d6)", "#fff", "rgba(255,240,248,.85)", "#6b1d4a", "#ff4fa3", "#fff", "9cqw", ".9cqw dashed #fff", "0 1cqw 0 rgba(255,79,163,.45)"), flag: "🍭", deco: ["🍭", "🍬", "🍩"],
        css: ".peg{--peg:#ff8ac0}.disc{border-radius:999px;background:repeating-linear-gradient(45deg,hsl(var(--dhue) 85% 62%) 0 2.2cqw,#fff 2.2cqw 3.6cqw);border:.5cqw solid #fff;color:#6b1d4a}" }
    },
    { /* ===== 1 · THÁP 4 CỘT ===== */
      pancake:  { vars: v("linear-gradient(#ffe9c2,#f4c06a)", "#fff", "rgba(255,248,232,.88)", "#5a3510", "#c0541c", "#fff", "5cqw", ".8cqw solid #fff", "0 1cqw 0 rgba(150,90,20,.35)"), flag: "🍯", deco: ["🥞", "🧈", "🍓"],
        css: ".peg{--peg:#b5792a}.disc{border-radius:999px;background:linear-gradient(hsl(38 88% calc(80% - var(--dhue) * .07%)),hsl(34 72% calc(60% - var(--dhue) * .07%)));border:.4cqw solid #b5792a;box-shadow:0 .7cqw 0 #8a5a1a;color:#6a3a0a}.disc::before{content:'';position:absolute;left:10%;right:10%;top:12%;height:22%;border-radius:999px;background:rgba(255,255,255,.35)}" },
      castle:   { vars: v("linear-gradient(#cfd8e8,#8fa0c0)", "#fff", "rgba(240,244,252,.88)", "#1f2f4a", "#2f7bff", "#fff", "1.5cqw", ".8cqw solid #5a6a8a", "0 1cqw 0 rgba(40,60,100,.4)"), flag: "🏰", deco: ["🏰", "🛡️", "⚔️"],
        css: ".peg{--peg:#5a6a8a}.disc{border-radius:.8cqw;background:repeating-linear-gradient(90deg,hsl(var(--dhue) 55% 62%) 0 5cqw,hsl(var(--dhue) 55% 46%) 5cqw 5.6cqw);border:.5cqw solid #3a4a6a;box-shadow:0 .7cqw 0 #2a3a5a;color:#fff}" },
      lifebuoy: { vars: v("linear-gradient(#aef0ff,#3a8fd0)", "#fff", "rgba(240,251,255,.88)", "#0b3a5a", "#ff7a59", "#fff", "7cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(11,58,90,.3)"), flag: "⚓", deco: ["🛟", "🌊", "🐠"],
        css: ".peg{--peg:#c0392b}.disc{border-radius:999px;background:repeating-linear-gradient(90deg,#fff 0 3.2cqw,hsl(var(--dhue) 85% 52%) 3.2cqw 6.4cqw);border:.5cqw solid #fff;box-shadow:0 .7cqw 0 rgba(0,0,0,.25);color:#0b3a5a}" },
      robot:    { vars: v("linear-gradient(#3a4a6a,#1a2a4a)", "#fff", "rgba(30,45,80,.7)", "#e0ecff", "#2fe6ff", "#02202a", "2cqw", ".6cqw solid #2fe6ff", "0 0 3cqw rgba(47,230,255,.4)"), flag: "🔋", deco: ["🤖", "⚙️", "🔩"],
        css: ".peg{--peg:#2fe6ff}.disc{border-radius:1cqw;background:linear-gradient(hsl(var(--dhue) 25% 80%),hsl(var(--dhue) 30% 56%));border:.5cqw solid #5a6a8a;box-shadow:0 .7cqw 0 #2a3a5a;color:#12213a;font-family:'Courier New',monospace}.disc::before,.disc::after{content:'';position:absolute;top:50%;width:1.5cqw;height:1.5cqw;border-radius:50%;background:#5a6a8a;transform:translateY(-50%)}.disc::before{left:1.4cqw}.disc::after{right:1.4cqw}" }
    },
    { /* ===== 2 · THÁP XÁO TRỘN ===== */
      magic:  { vars: v("linear-gradient(#3a1a6a,#9a3aa0)", "#fff", "rgba(50,20,90,.6)", "#f8e8ff", "#ffd54a", "#2a1a00", "6cqw", ".7cqw solid #ffd54a", "0 0 3.5cqw rgba(255,213,74,.5)"), flag: "🔮", deco: ["🪄", "✨", "🔮"],
        css: ".peg{--peg:#ffd54a}.disc{border-radius:50%/70%;background:radial-gradient(circle at 30% 30%,hsl(var(--dhue) 95% 82%),hsl(var(--dhue) 80% 52%));border:.4cqw solid #ffd54a;box-shadow:0 0 2cqw #ffd54a;color:#2a1a00}" },
      toy:    { vars: v("linear-gradient(#f4d9a8,#d9a066)", "#fff", "rgba(255,245,225,.88)", "#4a2f14", "#e07a1f", "#fff", "2cqw", ".8cqw solid #a0703a", "0 1cqw 0 rgba(120,70,20,.4)"), flag: "🎈", deco: ["🧸", "🪀", "🧩"],
        css: ".peg{--peg:#a0703a}.disc{border-radius:1.6cqw;background:hsl(var(--dhue) 70% 62%);border:.5cqw solid #fff;box-shadow:0 .8cqw 0 rgba(90,50,10,.45),inset 0 -1cqw 0 rgba(0,0,0,.12);color:#4a2f14}" },
      garden: { vars: v("linear-gradient(#d6f5b0,#8fcf6a)", "#fff", "rgba(244,255,232,.88)", "#1f3d1f", "#e0457a", "#fff", "4cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(40,110,40,.3)"), flag: "🌻", deco: ["🌷", "🦋", "🐝"],
        css: ".peg{--peg:#3a9a4a}.disc{border-radius:50% 50% 50% 50%/70% 70% 40% 40%;background:radial-gradient(circle at 50% 30%,#fff7c2 0 12%,hsl(var(--dhue) 85% 66%) 13%);border:.4cqw solid #fff;box-shadow:0 .6cqw 0 hsl(var(--dhue) 60% 36%);color:#3a1a2a}" },
      night:  { vars: v("linear-gradient(#0e1b3d,#2c3f78)", "#fff", "rgba(20,35,80,.7)", "#e8f0ff", "#c8ff6a", "#12210a", "5cqw", ".7cqw solid #c8ff6a", "0 0 3cqw rgba(200,255,106,.35)"), flag: "🌟", deco: ["✨", "🌙", "🪲"],
        css: ".peg{--peg:#8fb0ff}.disc{border-radius:999px;background:rgba(10,20,50,.7);border:.5cqw solid hsl(var(--dhue) 95% 68%);box-shadow:0 0 2.4cqw hsl(var(--dhue) 95% 60%),inset 0 0 1.6cqw hsl(var(--dhue) 95% 60%);color:hsl(var(--dhue) 95% 80%)}" }
    },
    { /* ===== 3 · THÁP VÒNG TRÒN ===== */
      carousel: { vars: v("linear-gradient(#ffd3ea,#ffe9a8)", "#fff", "rgba(255,250,240,.88)", "#6b1d4a", "#ff4f8a", "#fff", "6cqw", ".9cqw solid #ffd24a", "0 1cqw 0 rgba(180,120,20,.4)"), flag: "🎠", deco: ["🎠", "🎈", "🍭"],
        css: ".peg{--peg:#ffc83a}.disc{border-radius:2.4cqw;background:repeating-linear-gradient(90deg,hsl(var(--dhue) 85% 62%) 0 3cqw,#fff 3cqw 4.4cqw);border:.5cqw solid #ffc83a;box-shadow:0 .7cqw 0 #b8860b;color:#6b1d4a}" },
      galaxy:   { vars: v("linear-gradient(#0a0a2a,#4a1a8a)", "#fff", "rgba(20,10,60,.6)", "#e8e0ff", "#b07bff", "#fff", "6cqw", ".6cqw solid #b07bff", "0 0 3.5cqw rgba(176,123,255,.5)"), flag: "🛸", deco: ["🌌", "⭐", "☄️"],
        css: ".peg{--peg:#b07bff}.disc{border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff 0 6%,hsl(var(--dhue) 90% 65%) 7%,hsl(var(--dhue) 80% 35%) 70%);border:.3cqw solid rgba(255,255,255,.6);box-shadow:0 0 2.6cqw hsl(var(--dhue) 95% 62%);color:#fff}" },
      clock:    { vars: v("linear-gradient(#f4f1de,#d9c9a8)", "#fff", "rgba(255,252,240,.9)", "#3a2a14", "#a0522d", "#fff", "3cqw", ".8cqw double #a0522d", "0 .8cqw 0 rgba(90,60,20,.35)"), flag: "⏰", deco: ["🕰️", "⏳", "⚙️"],
        css: ".peg{--peg:#8a6a3a}.disc{border-radius:50%/60%;background:#fffaf0;border:.8cqw solid hsl(var(--dhue) 55% 45%);box-shadow:0 .6cqw 0 rgba(90,60,20,.4);color:hsl(var(--dhue) 55% 30%);font-family:Georgia,serif}" },
      donut:    { vars: v("linear-gradient(#ffd3ea,#ffb0a0)", "#fff", "rgba(255,240,235,.9)", "#5a2a1a", "#ff6a8a", "#fff", "8cqw", ".9cqw solid #fff", "0 1cqw 0 rgba(180,80,60,.4)"), flag: "☕", deco: ["🍩", "🧁", "🍪"],
        css: ".peg{--peg:#c97a4a}.disc{border-radius:999px;background:radial-gradient(ellipse at 50% 30%,hsl(var(--dhue) 90% 82%) 0 55%,#e8a870 56%);border:.4cqw solid #c97a4a;box-shadow:0 .7cqw 0 #a0522d;color:#5a2a1a}" }
    }
  ];
  /* cảnh vật riêng cho từng giao diện: đồ vật trên trời + dọc nền đất, nắp cột, nền mỗi cột, hình bay khi thắng — bản free không có */
  const X = [
    { cake: ["🍰|🧁|🍓|🍒", "🍓|🍓|🍓|🍓", "🕯️", "linear-gradient(rgba(255,255,255,.55),rgba(255,180,210,.5))", "🍰|🍓|🧁|🎂"],
      coin: ["💰|🪙|👑|💎", "🪙|🪙|🪙|🪙", "💎", "linear-gradient(rgba(255,215,60,.25),rgba(120,80,0,.4))", "🪙|💰|✨|👑"],
      planet: ["🪐|🌙|⭐|🛸", "☄️|🌑|☄️|🌑", "⭐", "linear-gradient(rgba(110,231,255,.12),rgba(20,30,80,.5))", "🚀|🪐|⭐|🌟"],
      candy: ["🍭|🍬|🍩|🧁", "🍬|🍬|🍬|🍬", "🍒", "linear-gradient(rgba(255,255,255,.55),rgba(255,140,190,.4))", "🍭|🍬|🍩|🧁"] },
    { pancake: ["🥞|🧈|🍓|🥛", "🍓|🫐|🍓|🫐", "🧈", "linear-gradient(rgba(255,240,200,.6),rgba(230,170,80,.35))", "🥞|🍯|🍓|🧈"],
      castle: ["🏰|🛡️|⚔️|🚩", "🧱|🧱|🧱|🧱", "🛡️", "linear-gradient(rgba(220,230,250,.5),rgba(90,110,150,.45))", "🏰|⚔️|👑|✨"],
      lifebuoy: ["⚓|🌊|🛟|🐚", "🌊|🌊|🌊|🌊", "⚓", "linear-gradient(rgba(255,255,255,.4),rgba(40,120,200,.45))", "🐠|🫧|🌊|🛟"],
      robot: ["🤖|⚙️|🔩|💡", "⚙️|🔩|⚙️|🔩", "💡", "linear-gradient(rgba(47,230,255,.1),rgba(10,20,50,.6))", "🤖|⚡|⚙️|💡"] },
    { magic: ["🪄|✨|🔮|🌟", "🍄|🍄|🍄|🍄", "🔮", "linear-gradient(rgba(255,213,74,.12),rgba(80,20,120,.5))", "✨|🔮|🪄|🦄"],
      toy: ["🧸|🪀|🧩|🎲", "🧩|🧱|🧩|🧱", "🎈", "linear-gradient(rgba(255,245,225,.6),rgba(217,160,102,.4))", "🧸|🎈|🧩|🎲"],
      garden: ["🦋|🐝|🌼|🐞", "🌷|🌻|🌷|🌻", "🌼", "linear-gradient(rgba(214,245,176,.5),rgba(80,170,70,.35))", "🌷|🦋|🌻|🐝"],
      night: ["🌙|⭐|✨|🪲", "🌿|🌿|🌿|🌿", "⭐", "linear-gradient(rgba(140,180,255,.1),rgba(10,20,60,.6))", "✨|🌙|⭐|🪲"] },
    { carousel: ["🎠|🎈|🎪|🍭", "🎠|🎠|🎠|🎠", "🎈", "linear-gradient(rgba(255,255,255,.55),rgba(255,200,80,.35))", "🎠|🎈|🍭|🎪"],
      galaxy: ["🌌|☄️|⭐|🛸", "🌑|🌕|🌑|🌕", "🌟", "linear-gradient(rgba(176,123,255,.15),rgba(10,5,40,.6))", "🌌|⭐|☄️|🛸"],
      clock: ["🕰️|⏳|⚙️|⏰", "⚙️|⚙️|⚙️|⚙️", "⏰", "linear-gradient(rgba(255,252,240,.6),rgba(180,140,80,.35))", "⏰|⏳|✨|⚙️"],
      donut: ["🍩|🧁|☕|🍪", "🍩|🍪|🍩|🍪", "🍒", "linear-gradient(rgba(255,240,235,.6),rgba(255,140,130,.35))", "🍩|🍪|🧁|☕"] }
  ];
  for (let t = 0; t < 4; t++) for (const id in X[t]) { const [pr, gr, cap, bg, fx] = X[t][id], sk = S[t][id]; sk.props = pr.split("|"); sk.ground = gr.split("|"); sk.cap = cap; sk.fx = fx.split("|"); sk.vars["--pegbg"] = bg; }
  for (let t = 0; t < 4; t++) for (const id in S[t]) PF.skins[t][id] = S[t][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
