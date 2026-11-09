"use strict";
/* Mã BẢN TRẢ PHÍ của game Đổi Đời 2048 (Cozy Play): 3 LOẠI GAME Night Pass (Ẩm Thực, Vũ Trụ, Tiền Tài — mỗi loại một thang 11 bậc riêng)
   + 16 giao diện (4 cho Đổi Đời, 4 cho mỗi loại trả phí; giao diện "basic" của Đổi Đời miễn phí nằm sẵn trong trang game).
   Chỉ giao cho người có Night Pass qua GET /api/pro/doi-doi-2048.js (hoặc dùng thử 1 ván / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.lad[1] = [["🌶️", "Ớt", "Chili"], ["🍅", "Cà chua", "Tomato"], ["🥗", "Gỏi", "Salad"], ["🍜", "Tô bún", "Noodles"], ["🍲", "Nồi lẩu", "Hot pot"], ["🍗", "Gà nướng", "Roast chicken"], ["🦞", "Tôm hùm", "Lobster"], ["🍣", "Sushi", "Sushi"], ["🍱", "Cơm hộp sang", "Bento"], ["🎂", "Bánh kem", "Cake"], ["👨‍🍳", "Đầu bếp Michelin", "Michelin chef"]];
  PF.lad[2] = [["🪨", "Tảng đá", "Rock"], ["☄️", "Sao chổi", "Comet"], ["🌑", "Mặt trăng", "Moon"], ["🌍", "Trái Đất", "Earth"], ["🚀", "Tên lửa", "Rocket"], ["🛰️", "Vệ tinh", "Satellite"], ["🪐", "Sao Thổ", "Saturn"], ["☀️", "Mặt trời", "Sun"], ["⭐", "Ngôi sao", "Star"], ["🌌", "Thiên hà", "Galaxy"], ["👽", "Người ngoài hành tinh", "Alien"]];
  PF.lad[3] = [["🪙", "Đồng xu", "Coin"], ["💵", "Tờ tiền", "Banknote"], ["💴", "Xấp tiền", "Cash stack"], ["💰", "Túi tiền", "Money bag"], ["🔐", "Két sắt", "Safe"], ["🏦", "Ngân hàng", "Bank"], ["💎", "Kim cương", "Diamond"], ["🥇", "Vàng thỏi", "Gold bar"], ["🛥️", "Du thuyền", "Yacht"], ["🛩️", "Máy bay riêng", "Private jet"], ["🏝️", "Đảo riêng", "Private island"]];
  PF.hue[1] = [8, 355, 120, 38, 18, 28, 350, 200, 330, 300, 48];
  PF.hue[2] = [215, 25, 230, 150, 0, 195, 40, 45, 55, 265, 120];
  PF.hue[3] = [45, 140, 150, 125, 210, 190, 195, 48, 205, 230, 170];
  PF.ranks[1] = [["Bếp tập sự", "Kitchen rookie"], ["Nấu cũng ngon", "Decent cook"], ["Bếp trưởng", "Head chef"], ["Chef sao Michelin", "Michelin chef"], ["Huyền thoại ẩm thực", "Food legend"]];
  PF.ranks[2] = [["Phi hành gia tập sự", "Rookie astronaut"], ["Lên được quỹ đạo", "In orbit"], ["Thám hiểm viên", "Explorer"], ["Chinh phục thiên hà", "Galaxy conqueror"], ["Gặp người ngoài hành tinh", "Met the aliens"]];
  PF.ranks[3] = [["Có xu lẻ", "Pocket change"], ["Dư dả", "Comfortable"], ["Triệu phú", "Millionaire"], ["Tỷ phú", "Billionaire"], ["Chủ đảo riêng", "Island owner"]];
  PF.sub[1] = ["Ghép nguyên liệu thành mâm cỗ. Từ trái ớt tới đầu bếp Michelin!", "Merge ingredients into a feast. From a chili to a Michelin chef!"];
  PF.sub[2] = ["Ghép thiên thể lên bậc. Từ tảng đá tới người ngoài hành tinh!", "Merge cosmic bodies up. From a rock to an alien!"];
  PF.sub[3] = ["Ghép tiền lên bậc. Từ đồng xu tới hòn đảo riêng!", "Merge money up. From a coin to a private island!"];
  /* giao diện: mỗi cái có bảng màu SÁNG và TỐI riêng (theo công tắc theme), dịch màu ô (hs), hình trôi nền, và nét riêng của ô/bàn cờ */
  const mk = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 93%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--board": "hsl(" + h + " 40% 80%)", "--cell": "hsl(" + h + " 35% 72%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--board": "hsl(" + h + " 32% 26%)", "--cell": "hsl(" + h + " 28% 18%)" }
  });
  const S = [
    { /* 0 · Đổi Đời */
      farm: [100, 0, ["🌾", "🐔", "🚜", "🌻"], ".tile{border-radius:30%}.board{border:2.2cqw solid #8b5a2b;border-radius:1cqw;background-image:repeating-linear-gradient(90deg,transparent 0 11cqw,rgba(0,0,0,.14) 11cqw 11.8cqw);box-shadow:0 0 0 .8cqw #4a2e10,0 1.6cqw 0 .8cqw #4a2e10}.st{border-radius:1cqw;background:#a8743a;border:.8cqw solid #4a2e10}.st b,.st span{color:#fff3d6}.lad{order:-1;background:#8b5a2b;border-radius:1cqw;padding:1.2cqw}.lad i{opacity:.4}#game .stats{order:5}"],
      night: [250, 140, ["⭐", "🌙", "✨", "🌠"], ".tile{border-radius:50%;box-shadow:0 0 2.2cqw hsl(var(--h) 90% 60%)}.cell{border-radius:50%}.board{border-radius:14cqw;background:radial-gradient(circle at 50% 40%,#2b2470,#0b0830);box-shadow:0 0 7cqw #6a4cff99,inset 0 0 6cqw #000}.st{border-radius:99cqw;border-color:#7a5cff;box-shadow:0 0 3cqw #7a5cff88}.lad{order:-1}"],
      sakura: [335, 200, ["🌸", "🎐", "🌸", "🏮"], ".tile{border-radius:50%}.cell{border-radius:50%}.board{border:1cqw dashed #ff9ec7;border-radius:6cqw;background:radial-gradient(circle at 20% 20%,#ff9ec733 0 18%,transparent 19%),radial-gradient(circle at 85% 80%,#ff9ec733 0 14%,transparent 15%),var(--board)}.st{border-radius:50% 50% 50% 50%/60% 60% 40% 40%;border-style:dotted;border-color:#ff9ec7}.lad{order:-1}"],
      neon: [175, 60, ["⚡", "💠", "🔷", "🎮"], ".tile{border-radius:6%;box-shadow:0 0 2.6cqw hsl(var(--h) 100% 60%)}.cell{background:transparent;border:.4cqw solid #00fff099;border-radius:2%}.board{background:#001a1c;border:.5cqw solid #00fff0;border-radius:0;box-shadow:0 0 5cqw #00fff066,inset 0 0 4cqw #00fff033}.st{border-radius:0;border-color:#00fff0;font-family:ui-monospace,Menlo,monospace;clip-path:polygon(0 0,92% 0,100% 30%,100% 100%,8% 100%,0 70%)}.lad{order:-1}#game .stats{order:5}"]
    },
    { /* 1 · Ẩm Thực */
      std: [8, 0, ["🍜", "🥢", "🌶️", "🍅"], ".tile{border-radius:22%}"],
      street: [30, 20, ["🍢", "🏮", "🛵", "🍺"], ".tile{border-radius:12%;border:.5cqw dashed rgba(255,255,255,.55)}.board{border-radius:1cqw;background:repeating-linear-gradient(45deg,#7a3a10 0 3cqw,#5a2a08 3cqw 6cqw);border:1.6cqw solid #c2410c}.st{border-radius:0;border:.6cqw dashed #fbbf24;transform:rotate(-1.5deg)}.lad{order:-1}"],
      fine: [345, 280, ["🍷", "🕯️", "🍽️", "🥂"], ".tile{border-radius:50%}.board{border-radius:50%/8%;border:1cqw double #d4af37;background:#2a0a1a;box-shadow:0 0 5cqw #d4af3744}.cell{border-radius:50%}.st{border-radius:99cqw;border:.4cqw solid #d4af37;background:transparent}.st b{font-family:Georgia,serif}.lad{order:-1}"],
      candy: [320, 100, ["🍭", "🍬", "🧁", "🍩"], ".tile{border-radius:38%}.cell{border-radius:38%}.board{border:1.4cqw solid #ff8fc7;border-radius:8cqw;background:repeating-linear-gradient(135deg,#ffd1e8 0 3cqw,#fff 3cqw 6cqw);box-shadow:0 1.4cqw 0 #d44f99}.st{border-radius:5cqw;background:#fff;border:.8cqw solid #ff8fc7}.st b{color:#d44f99}.lad{order:-1}"],
      retro: [45, 330, ["☕", "📻", "🥐", "🧈"], ".tile{border-radius:3%;box-shadow:.6cqw .8cqw 0 hsl(var(--h) 50% 28%)}.board{border-radius:1cqw;border:2cqw ridge #8a6a3a;background:#3a2a14}.st{border-radius:.6cqw;border:.5cqw solid #8a6a3a;transform:skewX(-4deg)}.lad{order:-1}#game .stats{order:5}"]
    },
    { /* 2 · Vũ Trụ */
      std: [225, 0, ["🚀", "🛰️", "⭐", "🌌"], ".tile{border-radius:20%}"],
      nebula: [290, 80, ["🌌", "💫", "🔮", "✨"], ".tile{box-shadow:0 0 2.4cqw hsl(var(--h) 95% 62%);border-radius:50%}.cell{border-radius:50%}.board{border-radius:50%/50%;border-radius:16cqw;background:radial-gradient(circle at 30% 30%,#5a2a9a88,transparent 50%),radial-gradient(circle at 75% 70%,#2a6ad088,transparent 45%),#0b0820;box-shadow:0 0 8cqw #8a4cff88}.st{border-radius:99cqw;background:#1a1040cc;border-color:#8a4cff}.lad{order:-1}"],
      mars: [15, 190, ["🔴", "🪨", "🛸", "☄️"], ".tile{border-radius:10%}.board{border-radius:2cqw;border:1.6cqw solid #7a2a10;background:radial-gradient(circle at 20% 80%,#b0451a 0 12%,transparent 13%),radial-gradient(circle at 80% 20%,#b0451a 0 9%,transparent 10%),#8a3516}.st{border-radius:.8cqw;background:#5a1f0a;border-color:#ff8a5a}.lad{order:-1;background:#5a1f0a;border-radius:2cqw;padding:1cqw}#game .stats{order:5}"],
      aurora: [160, 40, ["🌠", "🧊", "🌌", "❄️"], ".tile{border-radius:50%;box-shadow:0 0 2.6cqw hsl(var(--h) 100% 60%)}.cell{border-radius:50%}.board{border-radius:8cqw;background:linear-gradient(160deg,#04202a,#0a4a3a 50%,#2a1a5a);box-shadow:0 0 6cqw #3cffb488}.st{border-radius:99cqw;background:linear-gradient(90deg,#0a4a3a,#2a1a5a);border-color:#3cffb4}.lad{order:-1}"],
      retro8: [130, 250, ["👾", "🕹️", "🚀", "💾"], ".tile{border-radius:0;border:.6cqw solid #000}.cell{border-radius:0}.board{border-radius:0;border:1.4cqw solid #39ff14;background:#000;image-rendering:pixelated}.st{border-radius:0;border:.8cqw solid #39ff14;background:#000;font-family:'Courier New',monospace}.st b{color:#39ff14}.lad{order:-1;font-size:4.6cqw}#game .stats{order:5}"]
    },
    { /* 3 · Tiền Tài */
      std: [48, 0, ["💰", "🪙", "💵", "📈"], ".tile{border-radius:20%}"],
      gold: [45, 330, ["👑", "🪙", "✨", "💛"], ".tile{box-shadow:0 0 2.4cqw hsl(48 100% 55%),0 .8cqw 0 hsl(40 70% 28%)}.board{border:1.6cqw solid #d4af37;border-radius:2cqw;background:linear-gradient(135deg,#3a2a08,#6a4c10,#3a2a08)}.st{border-radius:1cqw;border:.6cqw solid #d4af37;background:linear-gradient(#5a4210,#2a1c04)}.st b{color:#ffd86a}.lad{order:-1}"],
      jade: [150, 60, ["🍀", "🧧", "🐉", "🪙"], ".tile{border-radius:40%}.cell{border-radius:40%}.board{border:1.4cqw solid #1a9a5a;border-radius:6cqw;background:repeating-linear-gradient(45deg,#0a3a24 0 2cqw,#0e4a2e 2cqw 4cqw)}.st{border-radius:3cqw;border:.6cqw solid #e0b43a;background:#0a3a24}.lad{order:-1}"],
      cyber: [200, 160, ["🪙", "💻", "🔐", "📉"], ".tile{border-radius:4%;border:.4cqw solid hsl(var(--h) 100% 70%)}.cell{background:transparent;border:.3cqw solid #22e6ff66}.board{border-radius:0;background:linear-gradient(#001a2a,#00101a);border:.4cqw solid #22e6ff;box-shadow:0 0 4cqw #22e6ff55}.st{border-radius:0;border-color:#22e6ff;font-family:ui-monospace,Menlo,monospace}.lad{order:-1}#game .stats{order:5}"],
      vault: [220, 200, ["🔐", "🏦", "💼", "🗝️"], ".tile{border-radius:8%;border:.6cqw solid hsl(0 0% 78%)}.board{border:2.4cqw solid #8a8a94;border-radius:3cqw;background:#2a2a32;box-shadow:inset 0 0 0 .8cqw #5a5a64,0 0 0 .8cqw #3a3a42}.st{border-radius:1cqw;border:.6cqw solid #9a9aa4;background:#34343c}.lad{order:-1}"]
    }
  ];
  for (let t = 0; t < 4; t++) for (const id in S[t]) { const d = S[t][id], v = mk(d[0]); PF.skins[t][id] = { vl: v.vl, vd: v.vd, deco: d[2], css: d[3], hs: d[1] }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
