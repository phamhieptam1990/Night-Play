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
      farm: [100, 0, ["🌾", "🐔", "🚜", "🌻"], ".tile{border-radius:30%}.board{border-radius:5cqw}"],
      night: [250, 140, ["⭐", "🌙", "✨", "🌠"], ".tile{box-shadow:0 0 2.2cqw hsl(var(--h) 90% 60%),0 .8cqw 0 hsl(var(--h) 60% 35%)}"],
      sakura: [335, 200, ["🌸", "🎐", "🌸", "🏮"], ".tile{border-radius:50%}.cell{border-radius:50%}"],
      neon: [175, 60, ["⚡", "💠", "🔷", "🎮"], ".tile{border-radius:6%;box-shadow:0 0 2.6cqw hsl(var(--h) 100% 60%),0 .8cqw 0 hsl(var(--h) 60% 30%)}.board{box-shadow:0 0 5cqw hsla(175,100%,50%,.4)}"]
    },
    { /* 1 · Ẩm Thực */
      std: [8, 0, ["🍜", "🥢", "🌶️", "🍅"], ".tile{border-radius:22%}"],
      street: [30, 20, ["🍢", "🏮", "🛵", "🍺"], ".tile{border-radius:12%;border:.5cqw dashed rgba(255,255,255,.5)}"],
      fine: [345, 280, ["🍷", "🕯️", "🍽️", "🥂"], ".tile{border-radius:50%}.board{border-radius:50%/6%}"],
      candy: [320, 100, ["🍭", "🍬", "🧁", "🍩"], ".tile{border-radius:38%}.cell{border-radius:38%}"],
      retro: [45, 330, ["☕", "📻", "🥐", "🧈"], ".tile{border-radius:3%;box-shadow:.6cqw .8cqw 0 hsl(var(--h) 50% 28%)}"]
    },
    { /* 2 · Vũ Trụ */
      std: [225, 0, ["🚀", "🛰️", "⭐", "🌌"], ".tile{border-radius:20%}"],
      nebula: [290, 80, ["🌌", "💫", "🔮", "✨"], ".tile{box-shadow:0 0 2.4cqw hsl(var(--h) 95% 62%)}"],
      mars: [15, 190, ["🔴", "🪨", "🛸", "☄️"], ".tile{border-radius:10%}.board{border-radius:2cqw}"],
      aurora: [160, 40, ["🌠", "🧊", "🌌", "❄️"], ".tile{border-radius:50%;box-shadow:0 0 2.6cqw hsl(var(--h) 100% 60%)}"],
      retro8: [130, 250, ["👾", "🕹️", "🚀", "💾"], ".tile{border-radius:0;border:.6cqw solid #000}.cell{border-radius:0}.board{border-radius:0}"]
    },
    { /* 3 · Tiền Tài */
      std: [48, 0, ["💰", "🪙", "💵", "📈"], ".tile{border-radius:20%}"],
      gold: [45, 330, ["👑", "🪙", "✨", "💛"], ".tile{box-shadow:0 0 2.4cqw hsl(48 100% 55%),0 .8cqw 0 hsl(40 70% 28%)}"],
      jade: [150, 60, ["🍀", "🧧", "🐉", "🪙"], ".tile{border-radius:40%}"],
      cyber: [200, 160, ["🪙", "💻", "🔐", "📉"], ".tile{border-radius:4%;border:.4cqw solid hsl(var(--h) 100% 70%)}"],
      vault: [220, 200, ["🔐", "🏦", "💼", "🗝️"], ".tile{border-radius:8%;border:.6cqw solid hsl(0 0% 78%)}.board{border:1cqw solid hsl(0 0% 60%)}"]
    }
  ];
  for (let t = 0; t < 4; t++) for (const id in S[t]) { const d = S[t][id], v = mk(d[0]); PF.skins[t][id] = { vl: v.vl, vd: v.vd, deco: d[2], css: d[3], hs: d[1] }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
