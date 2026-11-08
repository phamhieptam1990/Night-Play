"use strict";
/* Mã BẢN TRẢ PHÍ của game Gà Mẹ Bắn Trứng (Cozy Play): 4 LOẠI GAME Night Pass (Cứu gà con, Luật quái, Đua 60 giây, Trứng sập) và đường ngắm riêng cho mỗi giao diện,
   4 giao diện (Phục sinh, Trứng vàng, Cẩm thạch, Neon; "basic" miễn phí nằm sẵn trong trang) và 8 loài HIẾM chỉ Night Pass mới nở ra.
   Chỉ giao cho người có Night Pass qua GET /api/pro/ga-me-ban-trung.js (hoặc dùng thử 1 ván / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.modeCfg[1] = { rows: 5, colors: 4, chicks: 5, shots: 28, dropEvery: 7 };           // Cứu gà con: giải thoát 5 gà con trước khi hết lượt
  PF.modeCfg[2] = { rows: 6, colors: 5, shots: 30, bombs: 5, ice: 7, dropEvery: 6 };    // Luật quái: trứng bom nổ lan + trứng băng phải làm tan trước
  PF.modeCfg[3] = { rows: 6, colors: 5, time: 60, dropEvery: 4 };                       // Đua 60 giây: hàng mới xuống nhanh hơn
  PF.modeCfg[4] = { rows: 5, colors: 5, push: 12, dropEvery: 99 };                       // Trứng sập: cứ vài giây lại có hàng trứng mới đẩy xuống (cấp độ đổi tốc độ)
  PF.anim2 = [["🐉", "Rồng con", "Baby dragon", 4], ["🦄", "Kỳ lân", "Unicorn", 4], ["🦖", "Khủng long", "T-rex", 4], ["🦕", "Cổ cổ dài", "Long-neck", 4], ["🐲", "Rồng thần", "Dragon", 4], ["🦅", "Đại bàng", "Eagle", 4], ["🦤", "Chim dodo", "Dodo", 4], ["🪽", "Cánh thiên thần", "Angel wing", 4]];
  const mk = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const S = {
    easter: { h: 330, deco: ["🐰", "🌷", "🥕", "🌸"], hero: "🐰🥚", pal: [[340, 85, 70], [50, 95, 66], [150, 65, 60], [200, 85, 68], [280, 70, 72]], glitter: 0, me: "🐰", bird: "🕊️", aim: "flower", css: "" },
    gold: { h: 45, deco: ["👑", "✨", "🪙", "🏆"], hero: "👑🐔", pal: [[44, 100, 52], [30, 95, 50], [52, 90, 62], [18, 90, 52], [60, 80, 46]], glitter: 1, me: "🦚", bird: "🦜", aim: "star", css: "" },
    jade: { h: 150, deco: ["🍀", "🧧", "🐉", "🌿"], hero: "🍀🥚", pal: [[160, 70, 40], [140, 65, 46], [172, 80, 36], [120, 60, 42], [188, 70, 42]], glitter: 1, me: "🐉", bird: "🦢", aim: "leaf", css: "" },
    neon: { h: 285, deco: ["⚡", "💠", "🎮", "🔷"], hero: "⚡🥚", pal: [[320, 100, 62], [180, 100, 52], [100, 100, 52], [260, 100, 66], [48, 100, 56]], glitter: 1, me: "🤖", bird: "🦇", aim: "laser", css: "canvas#cv{box-shadow:0 0 5cqw rgba(200,80,255,.5)}" }
  };
  for (const id in S) { const d = S[id], v = mk(d.h); PF.skins[id] = { vl: v.vl, vd: v.vd, deco: d.deco, hero: d.hero, pal: d.pal, glitter: d.glitter, aim: d.aim, me: d.me, bird: d.bird, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
