"use strict";
/* Mã BẢN TRẢ PHÍ của game Qua Sông Cùng Bé (Pop Play): 16 GIAO DIỆN Night Pass (4 cho mỗi loại câu đố; giao diện "basic" miễn phí nằm sẵn trong trang game).
   Mỗi giao diện = bầu trời, dòng sông (hoặc vực), bờ, hình con thuyền / cây cầu, bộ nhân vật riêng, hình rơi trang trí và CSS riêng.
   Chỉ giao cho người có Night Pass qua GET /api/pro/qua-song.js (hoặc bản dùng thử 1 ván / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv;
  const S = [
    { /* ===== 0 · CẢNH SÁT & TRỘM ===== */
      neon:   { vars: v("linear-gradient(#0a0a2a,#3a0a6a)", "linear-gradient(#0a2a5a,#00e5ff)", "rgba(20,10,50,.82)", "#e8f4ff", "#ff2fd0", "#fff", "2cqw", ".6cqw solid #00e5ff", "0 0 3cqw rgba(0,229,255,.5)"), boat: "🚤", cast: { C: "🕵️", T: "🥷" }, deco: ["🌃", "⚡", "🚨"], css: ".chip2{clip-path:polygon(10% 0,90% 0,100% 20%,100% 80%,90% 100%,10% 100%,0 80%,0 20%)}.river::before{background:repeating-linear-gradient(0deg,rgba(0,229,255,.25) 0 .5cqw,transparent .5cqw 6cqw)}" },
      pirate: { vars: v("linear-gradient(#9ad8ff,#ffe7a8)", "linear-gradient(#1a8fd0,#0a4a8a)", "rgba(255,240,200,.88)", "#4a2a0a", "#c0392b", "#fff", "3cqw", ".8cqw solid #8a5a2b", "0 1cqw 0 rgba(90,50,10,.45)"), boat: "🏴‍☠️", cast: { C: "🧜‍♀️", T: "🦜" }, deco: ["🏝️", "🦜", "💎"], css: ".boat .hull{font-size:21cqw}" },
      west:   { vars: v("linear-gradient(#ffd89a,#e8a060)", "linear-gradient(#c8a070,#8a6a40)", "rgba(255,238,205,.9)", "#4a2a0a", "#b5541c", "#fff", "1.5cqw", ".8cqw solid #6a3a1a", "0 1cqw 0 rgba(90,40,10,.45)"), boat: "🛶", cast: { C: "🤠", T: "🐴" }, deco: ["🌵", "🐎", "⭐"], css: ".river::before{background:repeating-linear-gradient(0deg,rgba(255,255,255,.1) 0 .8cqw,transparent .8cqw 9cqw)}" },
      space:  { vars: v("linear-gradient(#050b2a,#1b2f7a)", "linear-gradient(#2a0f4d,#6a1f8a)", "rgba(20,30,80,.82)", "#e0ecff", "#6ee7ff", "#02202a", "6cqw", ".6cqw solid #6ee7ff", "0 0 3cqw rgba(110,231,255,.45)"), boat: "🚀", cast: { C: "👨‍🚀", T: "👽" }, deco: ["🪐", "⭐", "🛸"], css: ".chip2{border-radius:50%}" }
    },
    { /* ===== 1 · BÁC NÔNG DÂN ===== */
      snow:   { vars: v("linear-gradient(#e8f4ff,#b9d8f2)", "linear-gradient(#9ad0f0,#5aa0d8)", "rgba(255,255,255,.9)", "#1f3b57", "#3b82f6", "#fff", "8cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,110,170,.28)"), boat: "🛷", cast: { F: "🧑‍🎄", x1: "🐻‍❄️", x2: "🐧", x3: "🥕", x4: "🦌", x5: "🍎" }, deco: ["❄️", "⛄", "✨"], css: "" },
      jungle: { vars: v("linear-gradient(#bff0b0,#4fae6a)", "linear-gradient(#3a9a6a,#0a5a3a)", "rgba(244,255,232,.9)", "#1f3d1f", "#e07a1f", "#fff", "3cqw", "1cqw solid #2f7a45", "0 1cqw 0 rgba(31,90,50,.5)"), boat: "🐊", cast: { F: "🧑‍🌾", x1: "🐅", x2: "🐒", x3: "🍌", x4: "🦜", x5: "🥥" }, deco: ["🌴", "🦜", "🍃"], css: "" },
      candy:  { vars: v("linear-gradient(#ffd3ea,#ffb0d6)", "linear-gradient(#ff9ad0,#d050a0)", "rgba(255,240,248,.9)", "#6b1d4a", "#ff4fa3", "#fff", "9cqw", ".9cqw dashed #fff", "0 1cqw 0 rgba(255,79,163,.45)"), boat: "🍩", cast: { F: "🧁", x1: "🍬", x2: "🍭", x3: "🍓", x4: "🍪", x5: "🍫" }, deco: ["🍭", "🍬", "🧁"], css: ".chip2{border-radius:999px}" },
      ocean:  { vars: v("linear-gradient(#aef0ff,#3a8fd0)", "linear-gradient(#0a4a8a,#031a3a)", "rgba(240,251,255,.9)", "#0b3a5a", "#ff7a59", "#fff", "7cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(11,58,90,.3)"), boat: "🐢", cast: { F: "🤿", x1: "🦈", x2: "🐟", x3: "🪸", x4: "🦀", x5: "🐚" }, deco: ["🌊", "🐠", "🫧"], css: "" }
    },
    { /* ===== 2 · CẢ NHÀ QUA SÔNG ===== */
      camp:     { vars: v("linear-gradient(#1a2a4a,#3a5a3a)", "linear-gradient(#1a5a7a,#0a2a4a)", "rgba(30,50,40,.85)", "#f4f1de", "#ffd166", "#2d3a2c", "4cqw", ".7cqw solid #ffd166", "0 0 3cqw rgba(255,209,102,.35)"), boat: "🛶", cast: { Fa: "🧔", M: "👩‍🦰", S: "🧒", D: "👧" }, deco: ["⛺", "🔥", "🌙"], css: "" },
      beach:    { vars: v("linear-gradient(#aef0ff,#ffe9a8)", "linear-gradient(#2fd0e0,#1a8fc0)", "rgba(255,251,235,.9)", "#0b4a5a", "#ff7a59", "#fff", "7cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(11,90,100,.3)"), boat: "🛟", cast: { Fa: "🏄‍♂️", M: "👙", S: "🤽", D: "🧜‍♀️", P: "🏊", Tf: "🦀" }, deco: ["🏖️", "🌴", "🐚"], css: "" },
      mountain: { vars: v("linear-gradient(#e8f4ff,#9ac0e8)", "linear-gradient(#7ab0e0,#3a70b0)", "rgba(255,255,255,.9)", "#1f3b57", "#3b82f6", "#fff", "2cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,110,170,.3)"), boat: "🚡", cast: { Fa: "🧑‍🦱", M: "👩‍🦳", S: "⛷️", D: "🏂", P: "🧑‍✈️", Tf: "🐺" }, deco: ["🏔️", "❄️", "🦌"], css: "" },
      magic:    { vars: v("linear-gradient(#3a1a6a,#9a3aa0)", "linear-gradient(#5a2a9a,#2a0a5a)", "rgba(40,16,80,.85)", "#f8e8ff", "#ffd54a", "#2a1a00", "6cqw", ".7cqw solid #ffd54a", "0 0 3.5cqw rgba(255,213,74,.5)"), boat: "🧹", cast: { Fa: "🧙‍♂️", M: "🧙‍♀️", S: "🧚‍♂️", D: "🧚‍♀️", P: "🦄", Tf: "🐉" }, deco: ["🪄", "✨", "🔮"], css: ".chip2{border-radius:50%}" }
    },
    { /* ===== 3 · QUA CẦU ĐÊM ===== */
      lava: { vars: v("linear-gradient(#3a0e0e,#c8401a)", "linear-gradient(#ff7a1a,#c8200a)", "rgba(40,10,10,.82)", "#ffe8d0", "#ffb020", "#2a1000", "3cqw", ".7cqw solid #ffb020", "0 0 3cqw rgba(255,120,20,.5)"), boat: "🔦", cast: { p: ["🧑‍🚒", "👩‍🚒", "🦸", "🦹", "🧞"] }, deco: ["🌋", "🔥", "💥"], css: "" },
      sky:  { vars: v("linear-gradient(#9ad8ff,#e8f7ff)", "linear-gradient(#e8f4ff,#b0d8f8)", "rgba(255,255,255,.9)", "#1f4a6a", "#5aa0ff", "#fff", "10cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,140,220,.3)"), boat: "🪁", cast: { p: ["🧚", "🧚‍♂️", "🦋", "🕊️", "🧑‍🚀"] }, deco: ["☁️", "🪁", "🎈"], css: ".chip2{border-radius:50%}" },
      ice:  { vars: v("linear-gradient(#e8f4ff,#8ec8f0)", "linear-gradient(#1a5a9a,#062a5a)", "rgba(240,250,255,.9)", "#0b3a5a", "#2f7bff", "#fff", "2cqw", ".8cqw solid #5a8ab0", "0 1cqw 0 rgba(40,80,120,.4)"), boat: "🧊", cast: { p: ["🧑‍🎤", "🐧", "🐻‍❄️", "🦭", "⛄"] }, deco: ["❄️", "🧊", "⛸️"], css: "" },
      pixel: { vars: v("linear-gradient(#1a2a1a,#2f9e44)", "linear-gradient(#1a1a3a,#0a0a1a)", "rgba(10,30,10,.85)", "#b8ffb8", "#ffdd00", "#1a1a00", "0", ".6cqw solid #b8ffb8", "none"), boat: "🕹️", cast: { p: ["👾", "🤖", "👻", "🐸", "🦖"] }, deco: ["👾", "🕹️", "💾"], css: ".chip2,.skc .sw{border-radius:0!important}.hwL,.ctl{font-family:'Courier New',monospace}" }
    }
  ];
  for (let t = 0; t < 4; t++) for (const id in S[t]) PF.skins[t][id] = S[t][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
