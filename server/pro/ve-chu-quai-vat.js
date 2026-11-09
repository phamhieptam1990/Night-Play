"use strict";
/* Mã BẢN TRẢ PHÍ của game Vẽ Chữ Thành Quái Vật (Pop Play): 16 GIAO DIỆN Night Pass (4 cho mỗi loại; giao diện "basic" miễn phí nằm sẵn trong trang game).
   Mỗi giao diện = PHONG CÁCH VẼ QUÁI VẬT (bảng màu thân + viền, kết cấu: điểm ảnh / phát sáng / kẹo rắc / bong bóng / lấp lánh / tuyết, phụ kiện: mũ phù thủy, vương miện, vòng sáng, nơ, vây, mũ lưỡi trai)
   + nền xưởng vẽ, khung, bóng, hình rơi trang trí, CSS riêng. Chỉ giao cho người có Night Pass qua GET /api/pro/ve-chu-quai-vat.js (hoặc bản dùng thử 1 ván), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv;
  const S = [
    { /* ===== 0 · CHỮ TIẾNG VIỆT · họ bột nhầy ===== */
      candy: {
        vars: v("linear-gradient(#ffd3ea,#ffb0d6)", "#fff0f8", "#6b1d4a", "#ff4fa3", "#fff", "9cqw", ".9cqw dashed #fff", "0 1cqw 0 rgba(255,79,163,.45)"), deco: ["🍭", "🍬", "🧁"], css: ".tbox{border-style:dashed}",
        look: { pal: [["#ffb3d9", "#ff6fb5", "#8a1e5a"], ["#ffe0a8", "#ffb347", "#9a5a10"], ["#c9f0ff", "#6fcfff", "#1d5a8a"], ["#d9ffd0", "#7be08b", "#1f6a3a"], ["#e8d0ff", "#b388ff", "#4a2a8a"], ["#fff3a8", "#ffd54a", "#8a6a00"], ["#ffc4c4", "#ff6f6f", "#8a1f1f"], ["#c4fff0", "#4fe0c0", "#106a58"]], tex: "sprinkle", olw: 1.3, acc: "bow", bg: ["#ffd3ea", "#ffb0d6"] }
      },
      pixel: {
        vars: v("linear-gradient(#1a1a2e,#2a2a4e)", "#2c2c52", "#d8f0ff", "#4dff9a", "#082a18", "1cqw", ".8cqw solid #4dff9a", "0 0 0 .6cqw #0a0a1a"), deco: ["👾", "🕹️", "⭐"], css: ".tbox,.qh{font-family:'Courier New',monospace}.tbox{border-radius:0}",
        look: { pal: [["#7dffb0", "#2fbf71", "#0a3a1f"], ["#ff9ac1", "#e0408a", "#4a0a2a"], ["#8fd0ff", "#3b82f6", "#0a2a5a"], ["#ffe27a", "#ffb020", "#5a3a00"], ["#c9a8ff", "#8a5cf6", "#2a104a"], ["#ff9a8a", "#e5484d", "#4a0a0a"]], tex: "pixel", olw: 1.6, bg: ["#1a1a2e", "#3a2a6e"] }
      },
      magic: {
        vars: v("linear-gradient(#3a1a6a,#9a3aa0)", "#2a1050", "#f8e8ff", "#ffd54a", "#2a1a00", "6cqw", ".7cqw solid #ffd54a", "0 0 3.5cqw rgba(255,213,74,.5)"), deco: ["🪄", "✨", "🔮"], css: "",
        look: { pal: [["#c9a8ff", "#8a5cf6", "#2a104a"], ["#ffa8e8", "#d94ab8", "#4a104a"], ["#a8d0ff", "#4a7aff", "#102a6a"], ["#ffe08a", "#ffb020", "#5a3a00"]], tex: "sparkle", gl: "#ffd54a", acc: "hat", olw: 1, bg: ["#3a1a6a", "#9a3aa0"] }
      },
      ocean: {
        vars: v("linear-gradient(#aef0ff,#3a8fd0)", "#f0fbff", "#0b3a5a", "#ff7a59", "#fff", "7cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(11,58,90,.3)"), deco: ["🌊", "🐠", "🫧"], css: "",
        look: { pal: [["#9ff0ff", "#2fb0e0", "#0b3a5a"], ["#ffc4a8", "#ff7a59", "#6a2a10"], ["#c4ffd9", "#3fd0a0", "#0b4a3a"], ["#e0c8ff", "#8a7aff", "#2a1a6a"]], tex: "bubbles", acc: "fin", olw: 1.1, bg: ["#aef0ff", "#2a6fb0"] }
      }
    },
    { /* ===== 1 · CHỮ TIẾNG ANH · họ rô-bốt ===== */
      neon: {
        vars: v("linear-gradient(#10002b,#3c096c)", "#240046", "#f0e0ff", "#00f5d4", "#001a16", "2cqw", ".7cqw solid #00f5d4", "0 0 3cqw rgba(0,245,212,.55)"), deco: ["💡", "⚡", "✨"], css: ".tbox{box-shadow:0 0 4cqw rgba(0,245,212,.5)}",
        look: { pal: [["#7dfff0", "#00c9b0", "#003a34"], ["#ff9af0", "#e0309a", "#4a0a3a"], ["#fff27a", "#ffc800", "#4a3a00"], ["#9ab8ff", "#4a5aff", "#0a1a5a"]], tex: "glow", gl: "#00f5d4", olw: .9, bg: ["#10002b", "#5a189a"] }
      },
      space: {
        vars: v("linear-gradient(#050b2a,#1b2f7a)", "#14214f", "#e0ecff", "#6ee7ff", "#02202a", "2cqw", ".7cqw solid #6ee7ff", "0 0 3cqw rgba(110,231,255,.45)"), deco: ["🚀", "⭐", "🪐"], css: "",
        look: { pal: [["#a8f0b0", "#4ac870", "#0a3a1a"], ["#d8b0ff", "#9a5aff", "#2a0a5a"], ["#ffb0a8", "#ff5a6a", "#5a0a1a"], ["#a8e8ff", "#3ab0e8", "#0a3a5a"]], tex: "stars", gl: "#6ee7ff", acc: "halo", olw: 1, bg: ["#050b2a", "#2a3f9a"] }
      },
      gear: {
        vars: v("linear-gradient(#d9c9a8,#8a7a5a)", "#fffaf0", "#3a2a14", "#c0392b", "#fff", "3cqw", "1cqw solid #5a4a2a", "0 1cqw 0 rgba(60,40,10,.4)"), deco: ["⚙️", "🔩", "🛠️"], css: ".tbox{border-style:double}",
        look: { pal: [["#e8c88a", "#b8862a", "#4a3010"], ["#d0d8e0", "#8a9aaa", "#2a3440"], ["#e8a888", "#b85a2a", "#4a1a0a"], ["#c8d8a0", "#7a9a3a", "#2a3a0a"]], olw: 1.5, acc: "cap", bg: ["#d9c9a8", "#8a7a5a"] }
      },
      toy: {
        vars: v("linear-gradient(#ffe56a,#ff8a5a)", "#fffaf0", "#5a2a0a", "#e84a4a", "#fff", "7cqw", "1cqw solid #fff", "0 1cqw 0 rgba(180,80,20,.4)"), deco: ["🧸", "🎈", "🪀"], css: "",
        look: { pal: [["#ff8a8a", "#e03a3a", "#5a0a0a"], ["#8ac8ff", "#2a7ae0", "#0a2a5a"], ["#ffe36a", "#f0b000", "#5a4000"], ["#8aeaa0", "#2ab860", "#0a4a20"]], tex: "sprinkle", olw: 1.4, acc: "cap", bg: ["#ffe56a", "#ff8a5a"] }
      }
    },
    { /* ===== 2 · CON SỐ · họ ma bông ===== */
      cloud: {
        vars: v("linear-gradient(#bfe6ff,#f4fbff)", "#fff", "#1f4a6a", "#5aa0ff", "#fff", "10cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,140,220,.3)"), deco: ["☁️", "🪁", "🎈"], css: "",
        look: { pal: [["#ffffff", "#cfe3ff", "#4a6a9a"], ["#fff0f8", "#ffd0e8", "#9a4a7a"], ["#f4fff0", "#d0f0c8", "#4a8a4a"], ["#fffbe8", "#ffeab0", "#9a7a2a"]], tex: "snow", olw: .9, bg: ["#bfe6ff", "#f4fbff"] }
      },
      night: {
        vars: v("linear-gradient(#1a0b2e,#3b1d5a)", "#2a1450", "#ffe8d0", "#ff9a1f", "#2a1400", "3cqw", ".7cqw solid #ff9a1f", "0 0 3cqw rgba(255,154,31,.5)"), deco: ["🎃", "🦇", "🕸️"], css: "",
        look: { pal: [["#ffb85a", "#ff7a1a", "#4a1a00"], ["#d8b0ff", "#9a5aff", "#2a0a5a"], ["#b8e8a0", "#6ab04a", "#1a3a0a"], ["#f0f0f0", "#b8b8d0", "#2a2a4a"]], acc: "hat", tex: "stars", gl: "#ffb85a", olw: 1.2, bg: ["#1a0b2e", "#5a2a7a"] }
      },
      jelly: {
        vars: v("linear-gradient(#ffd1f0,#ffe9a0)", "#fff", "#6a1a5a", "#ff5ab8", "#fff", "8cqw", ".9cqw dotted #ff5ab8", "0 1cqw 0 rgba(255,90,184,.4)"), deco: ["🍬", "🍓", "🍇"], css: "",
        look: { pal: [["#ff9ad0", "#ff4a9a", "#6a0a3a"], ["#a8f0a0", "#4ad060", "#0a4a1a"], ["#ffe08a", "#ffb800", "#5a3a00"], ["#a8c8ff", "#4a7aff", "#0a2a6a"], ["#d8a8ff", "#a04aff", "#3a0a6a"]], tex: "sprinkle", olw: 1.1, acc: "bow", bg: ["#ffd1f0", "#ffe9a0"] }
      },
      moon: {
        vars: v("linear-gradient(#0e1b3d,#3a4f88)", "#1f2f63", "#e8f0ff", "#c8ff6a", "#12210a", "5cqw", ".7cqw solid #c8ff6a", "0 0 3cqw rgba(200,255,106,.4)"), deco: ["🌙", "✨", "🪲"], css: "",
        look: { pal: [["#f0f4ff", "#b8c8f0", "#2a3a6a"], ["#fff4c8", "#f0d878", "#5a4a10"], ["#d8f0ff", "#88c0f0", "#1a3a5a"], ["#f0e0ff", "#c0a0f0", "#3a2a6a"]], acc: "halo", tex: "sparkle", gl: "#fff4a8", olw: .9, bg: ["#0e1b3d", "#3a4f88"] }
      }
    },
    { /* ===== 3 · HÌNH KHỐI · họ rồng nhí ===== */
      lava: {
        vars: v("linear-gradient(#3a0e0e,#c8401a)", "#2a0a0a", "#ffe8d0", "#ffb020", "#2a1000", "3cqw", ".7cqw solid #ffb020", "0 0 3cqw rgba(255,120,20,.5)"), deco: ["🌋", "🔥", "💥"], css: "",
        look: { pal: [["#ff9a5a", "#e8401a", "#3a0a00"], ["#ffd05a", "#ff9a1a", "#4a2a00"], ["#ff7a8a", "#c8203a", "#3a0010"], ["#d8b8a8", "#8a5a4a", "#2a1008"]], tex: "glow", gl: "#ffb020", olw: 1.3, bg: ["#3a0e0e", "#e0601a"] }
      },
      ice: {
        vars: v("linear-gradient(#e8f4ff,#9fd0f2)", "#fff", "#1f3b57", "#3b82f6", "#fff", "8cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,110,170,.28)"), deco: ["❄️", "⛄", "🧊"], css: "",
        look: { pal: [["#d8f4ff", "#7ac8f0", "#1a4a6a"], ["#e8e0ff", "#a8a0f0", "#2a2a6a"], ["#d0fff4", "#6ae0c8", "#0a4a40"], ["#ffffff", "#c0d8f0", "#3a5a7a"]], tex: "snow", acc: "cap", olw: 1, bg: ["#e8f4ff", "#7ab8e8"] }
      },
      forest: {
        vars: v("linear-gradient(#bff0b0,#4fae6a)", "#f4ffe8", "#1f3d1f", "#e07a1f", "#fff", "3cqw", "1cqw solid #2f7a45", "0 1cqw 0 rgba(31,90,50,.5)"), deco: ["🌿", "🦜", "🍃"], css: "",
        look: { pal: [["#a8f088", "#4ab04a", "#0a3a1a"], ["#d8e888", "#8aa82a", "#2a3a0a"], ["#88e8c8", "#2aa888", "#0a3a30"], ["#e8c888", "#a8782a", "#3a2408"]], acc: "fin", tex: "stars", olw: 1.2, bg: ["#bff0b0", "#2f7a45"] }
      },
      gold: {
        vars: v("linear-gradient(#fff2b0,#e0a020)", "#fffbe8", "#4a3200", "#c07a00", "#fff", "4cqw", "1cqw solid #c07a00", "0 0 3cqw rgba(224,160,32,.5)"), deco: ["👑", "💎", "🪙"], css: "",
        look: { pal: [["#fff0a0", "#e0a800", "#4a3200"], ["#ffe8c0", "#e09850", "#4a2a10"], ["#f0f0f8", "#a8a8c0", "#2a2a40"], ["#ffd0d8", "#e07890", "#4a1a28"]], acc: "crown", tex: "sparkle", gl: "#fff0a0", olw: 1.4, bg: ["#fff2b0", "#c07a00"] }
      }
    }
  ];

  /* ---- Bố cục + khay vẽ + nút + hiệu ứng RIÊNG cho từng giao diện (đổi hẳn hình dạng khung vẽ, thanh tiêu đề, thanh nút, tiến độ) ---- */
  const X = {
    candy: "#studio .qh{border-radius:4cqw;background:repeating-linear-gradient(135deg,#fff 0 3cqw,#ffd9ec 3cqw 6cqw);border:.8cqw dashed #ff4fa3;position:relative}#studio .qh::after{content:'🍭';position:absolute;right:-2cqw;top:-4cqw;font-size:8cqw}" +
      "#studio .tbox{border-radius:13cqw;border:1.1cqw dashed #fff;outline:1.2cqw solid #ff4fa3;outline-offset:-.1cqw;box-shadow:0 1.6cqw 0 rgba(255,79,163,.45),inset 0 0 8cqw rgba(255,79,163,.18)}" +
      "#studio .ib2{border-radius:50%;background:radial-gradient(circle at 32% 28%,#fff 0 14%,#ff8fc6 15% 100%);color:#7a1a4a;box-shadow:0 1cqw 0 rgba(180,30,110,.5)}#studio .pbar{height:6.5cqw;background:#fff;border:.7cqw solid #ff4fa3}#studio .pbar i{background:repeating-linear-gradient(135deg,#ff4fa3 0 2.4cqw,#fff 2.4cqw 4.8cqw)}",
    pixel: "#studio{flex-direction:column-reverse;justify-content:flex-end;font-family:'Courier New',monospace}#studio::after{content:'';position:absolute;inset:0;z-index:5;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 .5cqw,transparent .5cqw 1.1cqw)}" +
      "#studio .qh{border-radius:0;clip-path:polygon(0 1.4cqw,1.4cqw 1.4cqw,1.4cqw 0,calc(100% - 1.4cqw) 0,calc(100% - 1.4cqw) 1.4cqw,100% 1.4cqw,100% calc(100% - 1.4cqw),calc(100% - 1.4cqw) calc(100% - 1.4cqw),calc(100% - 1.4cqw) 100%,1.4cqw 100%,1.4cqw calc(100% - 1.4cqw),0 calc(100% - 1.4cqw));background:#0a2a18;color:#4dff9a;text-transform:uppercase;letter-spacing:.1em}#studio .qh>span:first-child::before{content:'> ';animation:pxb 1s steps(2) infinite}@keyframes pxb{50%{opacity:0}}" +
      "#studio .tbox{border-radius:0;border:1.2cqw solid #4dff9a;clip-path:polygon(0 3cqw,3cqw 3cqw,3cqw 0,calc(100% - 3cqw) 0,calc(100% - 3cqw) 3cqw,100% 3cqw,100% calc(100% - 3cqw),calc(100% - 3cqw) calc(100% - 3cqw),calc(100% - 3cqw) 100%,3cqw 100%,3cqw calc(100% - 3cqw),0 calc(100% - 3cqw));box-shadow:none}" +
      "#studio .ib2{border-radius:0;background:#0a2a18;color:#4dff9a;border:.8cqw solid #4dff9a;box-shadow:.8cqw .8cqw 0 #000}#studio .pbar{border-radius:0;height:6cqw;background:#0a2a18;border:.8cqw solid #4dff9a}#studio .pbar i{border-radius:0;background:repeating-linear-gradient(90deg,#4dff9a 0 2.4cqw,transparent 2.4cqw 3.2cqw)}",
    magic: "#studio::before{content:'';position:absolute;left:50%;top:48%;width:112cqw;height:112cqw;margin:-56cqw 0 0 -56cqw;z-index:0;border-radius:50%;pointer-events:none;background:repeating-conic-gradient(from 0deg,rgba(255,213,74,.28) 0 4deg,transparent 4deg 15deg);-webkit-mask:radial-gradient(circle,transparent 40%,#000 41% 62%,transparent 63%);mask:radial-gradient(circle,transparent 40%,#000 41% 62%,transparent 63%);animation:mgspin 24s linear infinite}@keyframes mgspin{to{transform:rotate(360deg)}}" +
      "#studio .qh{border-radius:999px 999px 3cqw 3cqw;background:linear-gradient(#4a1a8a,#2a1050);border:.7cqw solid #ffd54a;text-shadow:0 0 2cqw #ffd54a;justify-content:center}#studio .qh::before{content:'✦ ';color:#ffd54a}#studio .qh .dots{margin-left:2cqw}" +
      "#studio .tbox{border-radius:50cqw 50cqw 6cqw 6cqw;border:1cqw solid #ffd54a;box-shadow:0 0 5cqw rgba(255,213,74,.65),inset 0 0 6cqw rgba(160,90,255,.5)}#studio .ib2{background:radial-gradient(circle,#6a2aaa,#2a1050);color:#ffd54a;border:.7cqw solid #ffd54a;box-shadow:0 0 3cqw rgba(255,213,74,.5)}#studio .pbar i{background:linear-gradient(90deg,#c9a8ff,#ffd54a);box-shadow:0 0 3cqw #ffd54a}",
    ocean: "#studio{display:grid;grid-template-columns:1fr 15cqw;grid-template-areas:'qh qh' 'tb qb';align-content:center;justify-items:center;gap:2.4cqw 2cqw}#studio .qh{grid-area:qh;border-radius:2cqw 2cqw 6cqw 6cqw;background:repeating-linear-gradient(0deg,#c89a5a 0 2.2cqw,#b08040 2.2cqw 2.6cqw);color:#3a2208;border:.8cqw solid #6a4a1a}#studio .tbox{grid-area:tb;width:min(70cqw,calc(100cqh - 46cqw));border-radius:50%/50%;border:2.6cqw solid #d9a441;box-shadow:0 0 0 1cqw #7a5a1a,inset 0 0 6cqw rgba(20,80,140,.4),0 1.6cqw 3cqw rgba(0,0,0,.35)}" +
      "#studio .qbar{grid-area:qb;flex-direction:column;width:auto;height:100%;padding:0;justify-content:center;gap:3cqw}#studio .pbar{width:30cqw;height:5cqw;flex:none;transform:rotate(-90deg);margin:12.5cqw -12.5cqw;background:rgba(255,255,255,.6)}#studio .pbar i{background:linear-gradient(90deg,#2fb0e0,#9ff0ff)}#studio .ib2{background:radial-gradient(circle at 30% 28%,#fff 0 14%,#9ff0ff 15%);color:#0b3a5a}",
    neon: "#studio .qh{border-radius:1cqw;background:transparent;border:0;border-bottom:.8cqw solid #00f5d4;box-shadow:0 1.6cqw 3cqw -1cqw #00f5d4;color:#00f5d4;text-shadow:0 0 2.4cqw #00f5d4;text-transform:uppercase;letter-spacing:.12em}" +
      "#studio .tbox{border-radius:2cqw;border:.5cqw solid #00f5d4;background-image:linear-gradient(#00f5d4,#00f5d4),linear-gradient(#00f5d4,#00f5d4),linear-gradient(#00f5d4,#00f5d4),linear-gradient(#00f5d4,#00f5d4);background-size:9cqw .9cqw,.9cqw 9cqw,9cqw .9cqw,.9cqw 9cqw;background-repeat:no-repeat;background-position:left top,left top,right bottom,right bottom;box-shadow:0 0 5cqw rgba(0,245,212,.6),inset 0 0 5cqw rgba(0,245,212,.15)}" +
      "#studio .ib2{border-radius:2cqw;background:transparent;border:.6cqw solid #00f5d4;color:#00f5d4;box-shadow:0 0 3cqw rgba(0,245,212,.6),inset 0 0 2cqw rgba(0,245,212,.3)}#studio .pbar{background:rgba(0,245,212,.12);border:.5cqw solid #00f5d4;border-radius:1cqw;height:4.4cqw}#studio .pbar i{border-radius:0;background:linear-gradient(90deg,#00f5d4,#fff);box-shadow:0 0 3cqw #00f5d4}",
    space: "#studio{display:grid;grid-template-columns:15cqw 1fr;grid-template-areas:'qh qh' 'qb tb';align-content:center;justify-items:center;gap:2.4cqw 2cqw}#studio .qh{grid-area:qh;border-radius:1cqw;background:linear-gradient(90deg,#14214f,#2a3f9a,#14214f);border:.5cqw solid #6ee7ff;letter-spacing:.08em}#studio .qh::before{content:'◉ ';color:#6ee7ff}" +
      "#studio .tbox{grid-area:tb;width:min(74cqw,calc(100cqh - 46cqw));border-radius:12cqw;border:.9cqw solid #6ee7ff;box-shadow:0 0 0 1.4cqw rgba(110,231,255,.25),0 0 6cqw rgba(110,231,255,.5)}#studio .qbar{grid-area:qb;flex-direction:column;width:auto;height:100%;padding:0;justify-content:center;gap:3cqw}#studio .pbar{width:30cqw;height:5cqw;flex:none;transform:rotate(-90deg);margin:12.5cqw -12.5cqw;background:rgba(110,231,255,.18);border:.5cqw solid #6ee7ff}#studio .pbar i{background:linear-gradient(90deg,#6ee7ff,#fff)}#studio .ib2{background:#0a1b4a;color:#6ee7ff;border:.6cqw solid #6ee7ff;box-shadow:0 0 3cqw rgba(110,231,255,.5)}",
    gear: "#studio .qh{border-radius:1.4cqw;background:linear-gradient(#e8d8b0,#b8a070);border:.8cqw solid #5a4a2a;color:#3a2a14;box-shadow:inset 0 0 0 .8cqw #e8d8b0,.6cqw .8cqw 0 rgba(60,40,10,.5);text-transform:uppercase}#studio .qh::before{content:'⚙ ';animation:gsp 6s linear infinite;display:inline-block}@keyframes gsp{to{transform:rotate(360deg)}}" +
      "#studio .tbox{border-radius:2cqw;border:2.4cqw double #5a4a2a;box-shadow:inset 0 0 0 1cqw #d8c8a0,0 1cqw 0 rgba(60,40,10,.5)}#studio .tbox::after{content:'';position:absolute;inset:.6cqw;pointer-events:none;background:radial-gradient(circle,#5a4a2a 0 1cqw,transparent 1.2cqw) left top/100% 100% no-repeat;-webkit-mask:none}" +
      "#studio .ib2{border-radius:30%;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);background:linear-gradient(#e8d8b0,#a8905a);color:#3a2a14;border:0;box-shadow:none}#studio .pbar{border-radius:1cqw;height:6cqw;background:#5a4a2a}#studio .pbar i{border-radius:.6cqw;background:repeating-linear-gradient(90deg,#c0392b 0 2cqw,#e8a030 2cqw 4cqw)}",
    toy: "#studio .qh{border-radius:3cqw;background:#e84a4a;color:#fff;text-shadow:0 .5cqw 0 rgba(0,0,0,.4);border:1cqw solid #fff;box-shadow:0 1.2cqw 0 #2a7ae0,0 2.4cqw 0 #f0b000}" +
      "#studio .tbox{border-radius:4cqw;border:3cqw solid #e84a4a;box-shadow:0 0 0 1cqw #fff,0 1.8cqw 0 1cqw rgba(0,0,0,.25)}#studio .tbox::before{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;background:radial-gradient(circle,#fff 0 .9cqw,transparent 1cqw) 0 0/8cqw 8cqw;-webkit-mask:linear-gradient(#000 0 3cqw,transparent 3cqw calc(100% - 3cqw),#000 calc(100% - 3cqw));mask:linear-gradient(#000 0 3cqw,transparent 3cqw calc(100% - 3cqw),#000 calc(100% - 3cqw));opacity:.8}" +
      "#studio .ib2{border-radius:3cqw;background:#2a7ae0;color:#fff;box-shadow:0 1.2cqw 0 #1a4a9a}#studio #clrBtn{background:#f0b000;box-shadow:0 1.2cqw 0 #b07a00}#studio .pbar{height:7cqw;border-radius:2cqw;background:#fff;border:.8cqw solid #2ab860}#studio .pbar i{border-radius:1cqw;background:repeating-linear-gradient(90deg,#2ab860 0 5cqw,#8aeaa0 5cqw 6cqw)}",
    cloud: "#studio .qh{border-radius:999px;background:#fff;color:#2a5a8a;position:relative;box-shadow:0 1cqw 3cqw rgba(60,140,220,.3)}#studio .qh::before{content:'☁️';position:absolute;left:-3cqw;top:-4cqw;font-size:9cqw}#studio .qh::after{content:'☁️';position:absolute;right:-2cqw;top:3cqw;font-size:7cqw;opacity:.9}" +
      "#studio .tbox{border-radius:30cqw 30cqw 16cqw 16cqw / 22cqw 22cqw 14cqw 14cqw;border:1.2cqw solid #fff;box-shadow:0 1.6cqw 5cqw rgba(60,140,220,.45),inset 0 0 8cqw rgba(190,225,255,.8)}#studio .ib2{background:linear-gradient(#fff,#d8ecff);color:#2a5a8a;border-radius:50%;box-shadow:0 1.2cqw 3cqw rgba(60,140,220,.4);animation:cfl 3s ease-in-out infinite}#studio #clrBtn{animation-delay:-1.5s}@keyframes cfl{50%{transform:translateY(-1.4cqw)}}#studio .pbar{background:#fff}#studio .pbar i{background:linear-gradient(90deg,#ff8a8a,#ffe36a,#8aeaa0,#8ac8ff)}",
    night: "#studio{flex-direction:column-reverse;justify-content:flex-end}#studio .qh{border-radius:2cqw;background:#1a0b2e;color:#ff9a1f;border:.8cqw solid #ff9a1f;position:relative}#studio .qh::before{content:'🕸️';position:absolute;left:-1cqw;top:-1.6cqw;font-size:8cqw}#studio .qh>span:first-child{padding-left:6cqw}" +
      "#studio .tbox{border-radius:26cqw 26cqw 3cqw 3cqw;border:1cqw solid #ff9a1f;box-shadow:0 0 5cqw rgba(255,154,31,.55),inset 0 0 8cqw rgba(0,0,0,.45)}#studio .tbox::after{content:'🦇';position:absolute;right:3cqw;top:3cqw;font-size:7cqw;pointer-events:none;z-index:3;animation:bat 3s ease-in-out infinite}@keyframes bat{50%{transform:translate(-3cqw,2cqw) rotate(-12deg)}}#studio .ib2{background:#1a0b2e;color:#ff9a1f;border:.7cqw solid #ff9a1f;box-shadow:0 0 3cqw rgba(255,154,31,.5)}#studio .pbar i{background:linear-gradient(90deg,#ff9a1f,#ffe08a)}",
    jelly: "#studio .qh{border-radius:8cqw;background:linear-gradient(#fff,#ffd8ee);color:#8a1a6a;box-shadow:0 1.2cqw 0 rgba(255,90,184,.45),inset 0 .8cqw 1.4cqw rgba(255,255,255,.9)}" +
      "#studio .tbox{border-radius:14cqw;border:1.2cqw dotted #ff5ab8;animation:jw 3.4s ease-in-out infinite;box-shadow:0 1.4cqw 0 rgba(255,90,184,.45),inset 0 1.2cqw 3cqw rgba(255,255,255,.9)}@keyframes jw{50%{transform:scale(1.012,.99)}}#studio .tbox::after{content:'';position:absolute;left:6cqw;top:3cqw;width:20cqw;height:5cqw;border-radius:50%;background:rgba(255,255,255,.7);transform:rotate(-12deg);pointer-events:none;z-index:2}" +
      "#studio .ib2{border-radius:46% 54% 50% 50%/55% 45% 55% 45%;background:radial-gradient(circle at 32% 28%,#fff 0 12%,#ff7ac8 13%);color:#fff;box-shadow:0 1.2cqw 0 rgba(160,30,110,.45)}#studio .pbar{background:rgba(255,255,255,.7);height:6.5cqw}#studio .pbar i{background:repeating-linear-gradient(90deg,#ff5ab8 0 4cqw,#ffe08a 4cqw 8cqw)}",
    moon: "#studio{display:grid;grid-template-columns:1fr 15cqw;grid-template-areas:'qh qh' 'tb qb';align-content:center;justify-items:center;gap:2.4cqw 2cqw}#studio .qh{grid-area:qh;border-radius:999px;background:#1f2f63;border:.6cqw solid #c8ff6a;color:#e8f0ff}#studio .qh::before{content:'🌙 '}" +
      "#studio .tbox{grid-area:tb;width:min(70cqw,calc(100cqh - 46cqw));border-radius:22cqw;border:.9cqw solid #c8ff6a;box-shadow:0 0 6cqw rgba(200,255,106,.4),inset 0 0 8cqw rgba(40,60,130,.7)}#studio .qbar{grid-area:qb;flex-direction:column;width:auto;height:100%;padding:0;justify-content:center;gap:3cqw}#studio .pbar{width:30cqw;height:5cqw;flex:none;transform:rotate(-90deg);margin:12.5cqw -12.5cqw;background:rgba(200,255,106,.15)}#studio .pbar i{background:linear-gradient(90deg,#c8ff6a,#fff4a8)}#studio .ib2{background:#12210a;color:#c8ff6a;border:.6cqw solid #c8ff6a;box-shadow:0 0 3cqw rgba(200,255,106,.4)}",
    lava: "#studio::after{content:'';position:absolute;left:0;right:0;bottom:0;height:20cqw;z-index:0;pointer-events:none;background:linear-gradient(0deg,#ff7a1a,rgba(255,60,0,.0));animation:lvg 2.4s ease-in-out infinite}@keyframes lvg{50%{opacity:.55}}" +
      "#studio .qh{border-radius:1cqw;background:linear-gradient(90deg,#3a0a0a,#8a1f0a,#3a0a0a);color:#ffd05a;border:.6cqw solid #ffb020;clip-path:polygon(0 0,100% 0,98% 50%,100% 100%,0 100%,2% 50%)}#studio .tbox{border-radius:1cqw;border:1.2cqw solid #ffb020;clip-path:polygon(0 2%,6% 0,14% 1.5%,24% 0,36% 1.2%,50% 0,64% 1.4%,78% 0,90% 1.2%,100% 0,100% 98%,92% 100%,80% 98.6%,66% 100%,52% 98.8%,36% 100%,22% 98.6%,10% 100%,0 98%);box-shadow:none}#studio .ib2{border-radius:20%;background:linear-gradient(#ff7a1a,#8a1f0a);color:#fff;box-shadow:0 0 4cqw rgba(255,120,20,.7)}#studio .pbar{background:#2a0a0a;border:.6cqw solid #ffb020}#studio .pbar i{background:linear-gradient(90deg,#ff4a1a,#ffd05a)}",
    ice: "#studio .qh{border-radius:2cqw;background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(190,225,255,.8));color:#1f3b57;border:.6cqw solid #fff;clip-path:polygon(2.4cqw 0,calc(100% - 2.4cqw) 0,100% 50%,calc(100% - 2.4cqw) 100%,2.4cqw 100%,0 50%)}#studio .tbox{border-radius:0;border:1cqw solid #fff;clip-path:polygon(7cqw 0,calc(100% - 7cqw) 0,100% 7cqw,100% calc(100% - 7cqw),calc(100% - 7cqw) 100%,7cqw 100%,0 calc(100% - 7cqw),0 7cqw);box-shadow:none;background-image:linear-gradient(135deg,rgba(190,225,255,.5),transparent 40%)}" +
      "#studio .ib2{border-radius:0;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);background:linear-gradient(#fff,#8cc6f0);color:#1f3b57;box-shadow:none}#studio .pbar{border-radius:0;height:5cqw;clip-path:polygon(2cqw 0,100% 0,calc(100% - 2cqw) 100%,0 100%);background:rgba(255,255,255,.7)}#studio .pbar i{border-radius:0;background:linear-gradient(90deg,#8cc6f0,#fff,#3b82f6)}",
    forest: "#studio .qh{border-radius:1.4cqw;background:repeating-linear-gradient(90deg,#a8782a 0 3cqw,#946820 3cqw 3.4cqw);color:#fff8e0;border:.8cqw solid #5a3a10;box-shadow:0 1cqw 0 rgba(40,25,5,.5);position:relative}#studio .qh::before,#studio .qh::after{content:'';position:absolute;top:-4cqw;width:.8cqw;height:4cqw;background:#5a3a10}#studio .qh::before{left:8cqw}#studio .qh::after{right:8cqw}" +
      "#studio .tbox{border-radius:3cqw;border:3.2cqw solid #7a4a14;box-shadow:inset 0 0 0 .8cqw #4a2a08,inset 0 0 8cqw rgba(60,120,40,.35),0 1.4cqw 0 rgba(40,25,5,.5)}#studio .tbox::after{content:'🍃';position:absolute;left:1cqw;top:1cqw;font-size:7cqw;pointer-events:none;z-index:3}#studio .ib2{border-radius:0 60% 0 60%;background:linear-gradient(135deg,#8ad86a,#2f7a45);color:#fff;box-shadow:0 1cqw 0 rgba(20,60,30,.55)}#studio .pbar{height:5.6cqw;background:rgba(40,25,5,.45);border-radius:2cqw}#studio .pbar i{border-radius:2cqw;background:repeating-linear-gradient(90deg,#8ad86a 0 4cqw,#4aae5a 4cqw 8cqw)}",
    gold: "#studio .qh{border-radius:999px;background:linear-gradient(90deg,#a06800,#ffe27a 50%,#a06800);color:#3a2400;border:.7cqw solid #fff2b0;position:relative}#studio .qh::before{content:'👑';position:absolute;left:50%;top:-5.6cqw;transform:translateX(-50%);font-size:8cqw}" +
      "#studio .tbox{border-radius:3cqw;border:1.6cqw solid #e0a020;outline:.8cqw solid #fff2b0;outline-offset:1.2cqw;box-shadow:0 0 5cqw rgba(224,160,32,.7)}#studio .tbox::after{content:'';position:absolute;inset:0;pointer-events:none;z-index:3;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.55) 50%,transparent 60%);transform:translateX(-120%);animation:gsh 4s ease-in-out infinite}@keyframes gsh{0%,60%{transform:translateX(-120%)}100%{transform:translateX(120%)}}#studio .ib2{background:radial-gradient(circle at 32% 28%,#fff8c8 0 12%,#e0a020 13%);color:#4a3200;border:.6cqw solid #fff2b0;box-shadow:0 0 4cqw rgba(224,160,32,.7)}#studio .pbar{background:rgba(74,50,0,.35);border:.6cqw solid #fff2b0}#studio .pbar i{background:linear-gradient(90deg,#c07a00,#ffe27a,#fff)}"
  };
  for (let t = 0; t < 4; t++) for (const id in S[t]) if (X[id]) S[t][id].css = (S[t][id].css || "") + X[id];
  for (let t = 0; t < 4; t++) for (const id in S[t]) PF.skins[t][id] = S[t][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
