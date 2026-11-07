"use strict";
/* Mã BẢN TRẢ PHÍ của game Nhảy Theo Số (Pop Play): 16 GIAO DIỆN Night Pass (4 cho mỗi loại: nhảy / vỗ tay / dậm chân / vẫy tay;
   giao diện "basic" miễn phí của từng loại nằm sẵn trong trang game).
   Mỗi giao diện = một THẾ GIỚI vẽ canvas riêng (sàn disco, vũ trụ, đáy biển, rừng, rạp xiếc, núi lửa, lâu đài, cực quang…) + một NHÂN VẬT
   nhảy khác hình dạng (đầu / tai / đuôi / phụ kiện / màu) + bảng màu, viền, bóng, hình rơi và nhạc riêng.
   Chỉ giao cho người có Night Pass qua GET /api/pro/nhay-theo-so.js (hoặc bản dùng thử 1 ván), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv, K = PF.K, tw = (t, s, a) => Math.sin(t * s) * a;
  const fig = (head, ears, tail, acc, eyes, legs, col, mark) => ({ head, ears, tail, acc, eyes, legs, col, mark });
  const S = [
    { /* ===== 0 · NHẢY ===== */
      disco: { vars: v("linear-gradient(#1a0b3a,#5a1f7a)", "#fff0fb", "#3a0f44", "#ff3fb8", "#fff", "3cqw", ".7cqw solid #4fe0ff", "0 0 3cqw rgba(79,224,255,.55)"),
        deco: ["🪩", "🎶", "✨"], pal: ["#ff3fb8", "#4a1f7a"], mus: { sc: [262, 330, 392, 523, 659], w: "square" },
        fig: fig("c", "point", "long", "shades", "dot", "two", { sk: "#ffb36b", bo: "#7a3aff", ac: "#ffe14f", lg: "#3a1a7a" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#1a0b3a", "#4a1a7a"]); for (let i = 0; i < 6; i++) { const a = tm * .8 + i * 1.05; c.save(); c.globalAlpha = .14 + .22 * bp; K.p(c, [[w / 2, h * .1], [w / 2 + Math.cos(a) * w, h * .85], [w / 2 + Math.cos(a + .2) * w, h * .85]], ["#ff4fd8", "#4fe0ff", "#ffe14f"][i % 3]); c.restore() }
          K.o(c, w / 2, h * .13, h * .07, h * .07, "#dfe6ff"); for (let i = 0; i < 12; i++) K.o(c, w / 2 + Math.cos(i * 2.1) * h * .04, h * .13 + Math.sin(i * 1.7) * h * .04, 2.5, 2.5, "#fff"); K.r(c, w / 2 - 1.5, 0, 3, h * .06, "#ccc");
          K.chk(c, w, h, h * .8, "#ff4fd8", "#4fe0ff", 7, Math.floor(tm * 2)); } },
      space: { vars: v("linear-gradient(#050b2a,#1b2f7a)", "#14214f", "#e0ecff", "#6ee7ff", "#02202a", "2cqw", ".7cqw solid #6ee7ff", "0 0 3cqw rgba(110,231,255,.45)"),
        deco: ["🚀", "⭐", "🪐"], pal: ["#6ee7ff", "#1b2f7a"], mus: { sc: [220, 262, 330, 440, 523], w: "sine" },
        fig: fig("o", "none", "none", "antenna", "big", "two", { sk: "#7ee08a", bo: "#b9f", ac: "#ff7ad9", lg: "#8a6af0" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#03061c", "#16277a"]); for (let i = 0; i < 40; i++) { const x = (i * 97 % 100) / 100 * w, y = (i * 53 % 78) / 100 * h; K.o(c, x, y, 1.4 + (Math.sin(tm * 3 + i) + 1) * .9, 1.4 + (Math.sin(tm * 3 + i) + 1) * .9, "#fff") }
          K.o(c, w * .78, h * .22, h * .1, h * .1, "#ff9a5a"); K.o(c, w * .78, h * .22, h * .17, h * .03, "rgba(255,220,160,.6)", -.3); K.o(c, w * .2, h * .3, h * .035, h * .035, "#9ad0ff");
          K.o(c, w / 2, h * 1.2, w * .8, h * .38, "#6a6f9a"); K.o(c, w * .25, h * .88, w * .06, h * .02, "#555a80"); K.o(c, w * .75, h * .92, w * .08, h * .025, "#555a80"); } },
      ocean: { vars: v("linear-gradient(#0a3a7a,#2fb4e8)", "#f0fbff", "#0b3a5a", "#ff7a59", "#fff", "7cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(11,58,90,.3)"),
        deco: ["🫧", "🐠", "🐚"], pal: ["#2fb4e8", "#0a3a7a"], mus: { sc: [262, 311, 392, 466, 523], w: "sine" },
        fig: fig("c", "none", "none", "snorkel", "big", "tent", { sk: "#ff8fb0", bo: "#ff6a9a", ac: "#ffe14f" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#52c8f0", "#0a4a8a"]); for (let i = 0; i < 4; i++) { c.save(); c.globalAlpha = .1; K.p(c, [[w * (.1 + i * .25), 0], [w * (.2 + i * .25), 0], [w * (.35 + i * .25), h], [w * (.15 + i * .25), h]], "#fff"); c.restore() }
          for (let i = 0; i < 12; i++) { const y = ((1 - ((tm * .08 + i * .13) % 1)) * h); c.strokeStyle = "rgba(255,255,255,.6)"; c.lineWidth = 2; c.beginPath(); c.arc((i * .083 + .04) * w + Math.sin(tm + i) * 6, y, 3 + i % 4 * 2, 0, 7); c.stroke() }
          K.g(c, 0, h * .8, w, h * .2, ["#f3d79a", "#caa05a"]); for (let k = 0; k < 4; k++) { const x = w * (.1 + k * .27); c.strokeStyle = "#2fa84f"; c.lineWidth = 5; c.beginPath(); c.moveTo(x, h * .85); c.quadraticCurveTo(x + tw(tm, 2 + k, 12), h * .7, x + tw(tm, 2.4 + k, 8), h * .58); c.stroke() } K.o(c, w * .85, h * .86, 14, 9, "#ff9ac0"); } },
      festival: { vars: v("linear-gradient(#2a0a3a,#d0402a)", "#fff3d8", "#4a1208", "#ffb703", "#2a1000", "5cqw", ".8cqw solid #ffb703", "0 0 3cqw rgba(255,183,3,.55)"),
        deco: ["🏮", "🎆", "🥁"], pal: ["#ffb703", "#8a1f2a"], mus: { sc: [294, 330, 392, 440, 587], w: "triangle" },
        fig: fig("c", "horns", "long", "hat", "dot", "two", { sk: "#7ed96a", bo: "#e63946", ac: "#ffd23f", lg: "#2f8a3a" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#1a0630", "#a8342a"]); for (let i = 0; i < 5; i++) { const x = w * (.1 + i * .2), y = h * (.16 + (i % 2) * .08) + tw(tm, 2 + i, 4), r = h * .06 * (1 + .12 * bp); c.save(); c.globalAlpha = .35; K.o(c, x, y, r * 2, r * 2, "#ffb703"); c.restore(); c.strokeStyle = "#ffd23f"; c.lineWidth = 2; c.beginPath(); c.moveTo(x, 0); c.lineTo(x, y - r); c.stroke(); K.o(c, x, y, r * .8, r, "#e63946"); K.r(c, x - r * .3, y - r * 1.05, r * .6, r * .15, "#ffd23f", 2); K.r(c, x - r * .3, y + r * .9, r * .6, r * .15, "#ffd23f", 2) }
          for (let i = 0; i < 8; i++) K.p(c, [[i * w / 8, h * .5], [(i + 1) * w / 8, h * .5], [(i + .5) * w / 8, h * .58]], ["#ffd23f", "#2dc4b6", "#fff"][i % 3]); K.g(c, 0, h * .8, w, h * .2, ["#8a4a1f", "#5a2a0f"]); for (let i = 0; i < 9; i++) { c.fillStyle = "rgba(0,0,0,.2)"; c.fillRect(i * w / 9, h * .8, 2, h * .2) } } }
    },
    { /* ===== 1 · VỖ TAY ===== */
      jungle: { vars: v("linear-gradient(#bff0b0,#4fae6a)", "#f4ffe8", "#1f3d1f", "#e07a1f", "#fff", "3cqw", "1cqw solid #2f7a45", "0 1cqw 0 rgba(31,90,50,.5)"),
        deco: ["🌿", "🦜", "🍃"], pal: ["#2f7a45", "#bff0b0"], mus: { sc: [196, 247, 294, 330, 392], w: "triangle" },
        fig: fig("c", "round", "curl", "none", "dot", "two", { sk: "#c98a4a", bo: "#8a5a2b", ac: "#ffd9a0", lg: "#6a4a1f" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#d9f7a8", "#2f8a4a"]); for (const x of [.08, .9]) { K.r(c, w * x - w * .04, 0, w * .08, h, "#6a4a22"); for (let j = 0; j < 6; j++) c.fillRect(w * x - w * .04, h * j / 6, w * .08, 2) }
          for (let i = 0; i < 5; i++) { const x = w * (.18 + i * .16), s = tw(tm, 1.5 + i * .3, 4); c.strokeStyle = "#2f7a2a"; c.lineWidth = 4; c.beginPath(); c.moveTo(x, 0); c.quadraticCurveTo(x + s, h * .1, x + s * 1.5, h * (.16 + i % 2 * .08)); c.stroke(); K.o(c, x + s * 1.5, h * (.17 + i % 2 * .08), 9, 14, "#3fae4a") }
          K.o(c, w * .3, h * .5, w * .24, h * .08, "#2f9a4a", .3); K.o(c, w * .72, h * .56, w * .22, h * .07, "#2a8a40", -.3); K.g(c, 0, h * .8, w, h * .2, ["#5a8a2a", "#2f5a1a"]); } },
      candy: { vars: v("linear-gradient(#ffd3ea,#ffb0d6)", "#fff0f8", "#6b1d4a", "#ff4fa3", "#fff", "9cqw", ".9cqw dashed #fff", "0 1cqw 0 rgba(255,79,163,.45)"),
        deco: ["🍭", "🍬", "🧁"], pal: ["#ff4fa3", "#ffd3ea"], mus: { sc: [330, 392, 440, 523, 659], w: "triangle" },
        fig: fig("c", "round", "fluff", "none", "dot", "two", { sk: "#fff", bo: "#fff", ac: "#ff7aa8", lg: "#222" }, "panda"),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#ffd9ee", "#d6f0ff"]); for (let i = 0; i < 5; i++) { const x = w * (.12 + i * .19), y = h * (.28 + (i % 2) * .08); K.r(c, x - 3, y, 6, h * .3, "#fff"); K.o(c, x, y, h * .07, h * .07, ["#ff4fa3", "#ffd23f", "#4fe0ff", "#9a6af0", "#7ee08a"][i]); c.strokeStyle = "rgba(255,255,255,.8)"; c.lineWidth = 4; c.beginPath(); c.arc(x, y, h * .04, 0, 4); c.stroke() }
          for (let i = 0; i < 14; i++) K.r(c, ((i * 37 + tm * 8) % 100) / 100 * w, (i * 29 % 60) / 100 * h, 8, 3, ["#ff4fa3", "#ffd23f", "#4fe0ff"][i % 3], 2);
          for (let i = 0; i < 9; i++) { c.fillStyle = i % 2 ? "#ff7ab8" : "#fff"; c.fillRect(i * w / 9, h * .8, w / 9 + 1, h * .2) } c.save(); c.globalAlpha = .25; for (let i = 0; i < 9; i++) K.p(c, [[i * w / 9, h * .8], [i * w / 9 + w / 18, h * .8], [i * w / 9 - w / 9, h]], "#fff"); c.restore(); } },
      snow: { vars: v("linear-gradient(#e8f4ff,#9fc8ea)", "#fff", "#1f3b57", "#3b82f6", "#fff", "8cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,110,170,.28)"),
        deco: ["❄️", "⛄", "✨"], pal: ["#3b82f6", "#e8f4ff"], mus: { sc: [330, 392, 494, 587, 659], w: "sine" },
        fig: fig("o", "none", "fin", "none", "dot", "two", { sk: "#fff", bo: "#2a3550", ac: "#ff9a2a", lg: "#ff9a2a" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#9fc8ea", "#eaf6ff"]); K.o(c, w * .2, h * .6, w * .4, h * .22, "#fff"); K.o(c, w * .85, h * .62, w * .35, h * .18, "#f3faff"); K.o(c, w * .8, h * .5, h * .06, h * .06, "#fff"); K.o(c, w * .8, h * .42, h * .045, h * .045, "#fff"); K.o(c, w * .8, h * .42, 2, 2, "#222"); K.p(c, [[w * .8, h * .43], [w * .84, h * .44], [w * .8, h * .45]], "#ff7a1a");
          for (let i = 0; i < 28; i++) { const x = ((i * 41 + Math.sin(tm + i) * 9) % 100) / 100 * w, y = ((tm * 18 + i * 31) % 100) / 100 * h; K.o(c, x, y, 2.6, 2.6, "#fff") } K.g(c, 0, h * .8, w, h * .2, ["#d8efff", "#a8d0ee"]); c.save(); c.globalAlpha = .5; K.p(c, [[w * .1, h * .98], [w * .3, h * .82], [w * .34, h * .82], [w * .16, h * .98]], "#fff"); c.restore(); } },
      circus: { vars: v("linear-gradient(#e63946,#fff1f1)", "#fffaf0", "#5a0a14", "#d62828", "#fff", "4cqw", ".9cqw solid #ffd23f", "0 1cqw 0 rgba(90,10,20,.45)"),
        deco: ["🎪", "🎈", "🤹"], pal: ["#d62828", "#ffd23f"], mus: { sc: [262, 330, 392, 440, 523], w: "square" },
        fig: fig("c", "none", "none", "hat", "dot", "two", { sk: "#ffe3c9", bo: "#4a8fe8", ac: "#ff3b3b", lg: "#ffd23f" }),
        bg(c, w, h, tm, bp) { for (let i = 0; i < 10; i++) { c.fillStyle = i % 2 ? "#fff3f3" : "#e63946"; c.fillRect(i * w / 10, 0, w / 10 + 1, h) } K.g(c, 0, 0, w, h, ["rgba(0,0,0,.35)", "rgba(0,0,0,0)"]); c.save(); c.globalAlpha = .3 + .25 * bp; K.p(c, [[w * .5 - 10, 0], [w * .5 + 10, 0], [w * .85, h * .85], [w * .15, h * .85]], "#fff8c0"); c.restore();
          for (let i = 0; i < 8; i++) K.p(c, [[i * w / 8, 0], [(i + 1) * w / 8, 0], [(i + .5) * w / 8, h * .08]], ["#ffd23f", "#2f6ae0"][i % 2]); K.o(c, w * .5, h * .9, w * .5, h * .1, "#c0281f"); K.o(c, w * .5, h * .9, w * .4, h * .075, "#e84a3a"); } }
    },
    { /* ===== 2 · DẬM CHÂN ===== */
      desert: { vars: v("linear-gradient(#ffe0a0,#e8a860)", "#fff7e0", "#5a3510", "#c0541c", "#fff", "4cqw", "1cqw solid #b5541c", "0 1cqw 0 rgba(120,60,10,.4)"),
        deco: ["🌵", "🐪", "☀️"], pal: ["#c0541c", "#ffe0a0"], mus: { sc: [220, 262, 294, 330, 392], w: "triangle" },
        fig: fig("c", "none", "long", "horn", "dot", "two", { sk: "#8fd070", bo: "#6ab04a", ac: "#ffe14f", lg: "#4a8a30" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#ffcf7a", "#ffe9bd"]); K.o(c, w * .78, h * .22, h * .1, h * .1, "#fff3b0"); K.o(c, w * .2, h * .66, w * .45, h * .2, "#f0b860"); K.o(c, w * .85, h * .7, w * .4, h * .18, "#e8a850");
          for (const [x, s] of [[.12, 1], [.9, .8]]) { K.r(c, w * x - 5 * s, h * .46, 10 * s, h * .3, "#3f9a4a", 5); K.r(c, w * x - 17 * s, h * .52, 8 * s, h * .12, "#3f9a4a", 4); K.r(c, w * x + 9 * s, h * .5, 8 * s, h * .12, "#3f9a4a", 4) }
          K.g(c, 0, h * .8, w, h * .2, ["#f3c878", "#d8a050"]); for (let i = 0; i < 6; i++) K.o(c, (i * .19 + .05) * w, h * (.85 + i % 3 * .04), 10, 3, "rgba(150,90,30,.35)"); } },
      volcano: { vars: v("linear-gradient(#3a0e0e,#c8401a)", "#2a0a0a", "#ffe8d0", "#ffb020", "#2a1000", "3cqw", ".7cqw solid #ffb020", "0 0 3cqw rgba(255,120,20,.5)"),
        deco: ["🌋", "🔥", "💥"], pal: ["#ffb020", "#7a1a0e"], mus: { sc: [165, 196, 220, 262, 330], w: "sawtooth" },
        fig: fig("s", "none", "none", "antenna", "visor", "two", { sk: "#a0a8b8", bo: "#7a8498", ac: "#ff6a2a", lg: "#4a5468" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#2a0a14", "#a8301a"]); K.p(c, [[w * .1, h * .8], [w * .5, h * .22], [w * .9, h * .8]], "#3a1a1a"); K.p(c, [[w * .42, h * .27], [w * .58, h * .27], [w * .5, h * .22]], "#ff7a1a");
          c.strokeStyle = "#ff8a1a"; c.lineWidth = 4; c.beginPath(); c.moveTo(w * .5, h * .27); c.quadraticCurveTo(w * .46, h * .5, w * .38, h * .8); c.stroke();
          for (let i = 0; i < 14; i++) { const t = (tm * .4 + i * .17) % 1; K.o(c, w * (.5 + Math.sin(i * 3.7) * .25 * t), h * (.25 - .2 * Math.sin(Math.PI * t) + t * .1), 3, 3, i % 2 ? "#ffd23f" : "#ff6a1a") }
          K.g(c, 0, h * .8, w, h * .2, ["#4a2a2a", "#2a1212"]); c.save(); c.globalAlpha = .6 + .3 * bp; c.strokeStyle = "#ff8a1a"; c.lineWidth = 3; c.beginPath(); c.moveTo(0, h * .88); c.lineTo(w * .3, h * .85); c.lineTo(w * .6, h * .92); c.lineTo(w, h * .87); c.stroke(); c.restore(); } },
      city: { vars: v("linear-gradient(#0e1b3d,#3a4f88)", "#1f2f63", "#e8f0ff", "#ff5ad0", "#fff", "2cqw", ".7cqw solid #ff5ad0", "0 0 3cqw rgba(255,90,208,.45)"),
        deco: ["🌃", "✨", "🎧"], pal: ["#ff5ad0", "#1b2a6a"], mus: { sc: [196, 247, 294, 370, 440], w: "square" },
        fig: fig("c", "none", "none", "cap", "dot", "two", { sk: "#e0a878", bo: "#ff5a3a", ac: "#2dc4ff", lg: "#222a4a" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#0a1230", "#2a3a78"]); for (let i = 0; i < 20; i++) K.o(c, (i * 71 % 100) / 100 * w, (i * 37 % 40) / 100 * h, 1.3, 1.3, "#fff"); K.o(c, w * .2, h * .16, h * .05, h * .05, "#fff3c0");
          for (let i = 0; i < 6; i++) { const bx = i * w / 6, bh = h * (.28 + (i * 37 % 20) / 100); K.r(c, bx + 2, h * .8 - bh, w / 6 - 4, bh, i % 2 ? "#18224a" : "#202c5a"); for (let j = 0; j < 6; j++) for (let k = 0; k < 3; k++) if ((i * 7 + j * 3 + k + Math.floor(tm * .5)) % 4) K.r(c, bx + 8 + k * (w / 6 / 3.4), h * .8 - bh + 10 + j * (bh / 7), 6, 7, "#ffe28a") }
          K.g(c, 0, h * .8, w, h * .2, ["#2a2a3a", "#14141e"]); c.fillStyle = "#ffd23f"; for (let i = 0; i < 6; i++) c.fillRect(i * w / 6 + 10, h * .9, w / 12, 4); c.save(); c.globalAlpha = .3 + .4 * bp; K.r(c, 0, h * .8, w, 4, "#ff5ad0"); c.restore(); } },
      farm: { vars: v("linear-gradient(#ffe9a8,#9ad07a)", "#fffdf0", "#4a3510", "#c0392b", "#fff", "4cqw", "1cqw solid #8a5a2b", "0 1cqw 0 rgba(120,80,30,.4)"),
        deco: ["🚜", "🌽", "🐔"], pal: ["#c0392b", "#9ad07a"], mus: { sc: [262, 294, 330, 392, 440], w: "triangle" },
        fig: fig("c", "fin", "none", "none", "big", "two", { sk: "#6fd06a", bo: "#8fe08a", ac: "#fff", lg: "#3f9a3a" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#a8dcff", "#f2ffe0"]); K.o(c, ((tm * .01) % 1.3) * w, h * .15, w * .09, h * .035, "#fff"); K.o(c, w * .3, h * .62, w * .5, h * .2, "#8fcf6a"); K.r(c, w * .62, h * .4, w * .28, h * .3, "#c0392b", 4); K.p(c, [[w * .6, h * .4], [w * .76, h * .28], [w * .92, h * .4]], "#8a2a1f"); K.r(c, w * .71, h * .52, w * .1, h * .18, "#fff", 3); K.o(c, w * .76, h * .43, 6, 6, "#fff");
          K.g(c, 0, h * .8, w, h * .2, ["#7fc860", "#4f9a3a"]); for (let i = 0; i < 12; i++) K.r(c, i * w / 11, h * .76, 4, h * .08, "#f3e0b0", 1); K.r(c, 0, h * .78, w, 4, "#f3e0b0"); K.o(c, w * .12, h * .86, 20, 12, "#e8c45a"); } }
    },
    { /* ===== 3 · VẪY TAY ===== */
      sky: { vars: v("linear-gradient(#9ad8ff,#ffd9f0)", "#fff", "#1f4a6a", "#5aa0ff", "#fff", "10cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,140,220,.3)"),
        deco: ["☁️", "🌈", "🎈"], pal: ["#5aa0ff", "#ffd9f0"], mus: { sc: [330, 392, 440, 523, 659], w: "sine" },
        fig: fig("c", "none", "none", "none", "big", "two", { sk: "#fff", bo: "#f4f6ff", ac: "#c9d4ff", lg: "#f4f6ff" }, "ghost"),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#8fd0ff", "#ffe3f3"]); const cols = ["#ff5a5a", "#ffb020", "#ffe14f", "#5ad07a", "#4fa8ff", "#9a6af0"]; cols.forEach((cl, i) => K.ar(c, w * .5, h * .78, w * .46 - i * 9, Math.PI, 0, cl, 9));
          for (let i = 0; i < 4; i++) { const x = (((tm * .012 + i * .3) % 1.4) - .2) * w; K.o(c, x, h * (.12 + i * .1), w * .1, h * .035, "rgba(255,255,255,.95)"); K.o(c, x + w * .05, h * (.12 + i * .1) - 5, w * .06, h * .03, "rgba(255,255,255,.95)") }
          K.g(c, 0, h * .8, w, h * .2, ["#ffffff", "#dbeeff"]); K.o(c, w * .2, h * .84, w * .2, h * .04, "#fff"); K.o(c, w * .8, h * .88, w * .22, h * .045, "#fff"); } },
      garden: { vars: v("linear-gradient(#d8f5c4,#ffd0e8)", "#fffaf0", "#3a4a1a", "#e8499a", "#fff", "6cqw", ".8cqw dotted #e8499a", "0 1cqw 0 rgba(200,60,130,.35)"),
        deco: ["🌸", "🦋", "🌻"], pal: ["#e8499a", "#d8f5c4"], mus: { sc: [294, 349, 440, 523, 587], w: "triangle" },
        fig: fig("c", "round", "none", "band", "big", "two", { sk: "#ffd23f", bo: "#ffcf3a", ac: "#2a2a2a", lg: "#2a2a2a" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#cdeeff", "#e9ffd8"]); K.o(c, w * .82, h * .15, h * .07, h * .07, "#fff3a0"); for (let i = 0; i < 7; i++) { const x = (i + .5) * w / 7, hh = h * (.3 + (i * 31 % 22) / 100), s = tw(tm, 1.5 + i * .2, 3); c.strokeStyle = "#3f9a3a"; c.lineWidth = 4; c.beginPath(); c.moveTo(x, h * .86); c.quadraticCurveTo(x + s, h * .86 - hh / 2, x + s * 1.5, h * .86 - hh); c.stroke(); const fx = x + s * 1.5, fyy = h * .86 - hh, col = ["#ff5a9a", "#ffd23f", "#ff8a3a", "#b88aff"][i % 4]; for (let k = 0; k < 6; k++) K.o(c, fx + Math.cos(k * 1.05) * 11, fyy + Math.sin(k * 1.05) * 11, 8, 8, col); K.o(c, fx, fyy, 6, 6, "#fff3a0") }
          const bx = (tm * .08 % 1.2 - .1) * w; K.o(c, bx, h * .3 + tw(tm, 3, 10), 7, 4, "#ff7ad9", .6); K.o(c, bx + 6, h * .3 + tw(tm, 3, 10), 7, 4, "#b88aff", -.6); K.g(c, 0, h * .84, w, h * .16, ["#8fd070", "#4f9a3a"]); } },
      castle: { vars: v("linear-gradient(#b9a8ff,#6a5aaa)", "#f6f0ff", "#2f1f5a", "#9a4aff", "#fff", "3cqw", ".8cqw solid #ffd23f", "0 1cqw 0 rgba(60,30,120,.4)"),
        deco: ["🏰", "👑", "✨"], pal: ["#9a4aff", "#6a5aaa"], mus: { sc: [262, 311, 392, 466, 523], w: "triangle" },
        fig: fig("c", "none", "none", "horn", "big", "two", { sk: "#fff", bo: "#ff9ad0", ac: "#c9a4ff", lg: "#fff" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#4a3a8a", "#b9a8ff"]); for (let i = 0; i < 16; i++) K.o(c, (i * 83 % 100) / 100 * w, (i * 41 % 40) / 100 * h, 1.4, 1.4, "#fff"); K.r(c, w * .08, h * .3, w * .84, h * .5, "#8a7ac0"); for (let i = 0; i < 9; i++) K.r(c, w * .08 + i * w * .0933, h * .27, w * .05, h * .05, "#8a7ac0");
          for (const x of [.04, .86]) { K.r(c, w * x, h * .18, w * .1, h * .62, "#9a8ad0"); K.p(c, [[w * x - 4, h * .18], [w * x + w * .05, h * .06], [w * x + w * .1 + 4, h * .18]], "#d84a7a") }
          for (const x of [.27, .6]) { K.r(c, w * x, h * .38, w * .1, h * .2, "#2a1f5a", w * .05); c.save(); c.globalAlpha = .3 + .3 * bp; K.o(c, w * x + w * .05, h * .48, w * .04, h * .08, "#ffe28a"); c.restore() }
          K.r(c, w * .46, h * .12, 3, h * .1, "#fff"); K.p(c, [[w * .46 + 3, h * .12], [w * .46 + 3 + 28 + tw(tm, 6, 3), h * .145], [w * .46 + 3, h * .17]], "#ffd23f"); K.g(c, 0, h * .8, w, h * .2, ["#7a1f4a", "#4a0f2f"]); K.p(c, [[w * .42, h * .8], [w * .58, h * .8], [w * .7, h], [w * .3, h]], "#a8284a"); } },
      aurora: { vars: v("linear-gradient(#06182e,#1b6a7a)", "#0e2a44", "#e0fff4", "#5affc8", "#022a20", "5cqw", ".7cqw solid #5affc8", "0 0 3cqw rgba(90,255,200,.45)"),
        deco: ["🌌", "❄️", "✨"], pal: ["#5affc8", "#0c3550"], mus: { sc: [247, 294, 370, 440, 494], w: "sine" },
        fig: fig("c", "round", "none", "none", "dot", "two", { sk: "#fff", bo: "#e8f4ff", ac: "#5ab8ff", lg: "#d0e4f4" }),
        bg(c, w, h, tm, bp) { K.g(c, 0, 0, w, h, ["#030c1e", "#0d3a52"]); for (let i = 0; i < 30; i++) K.o(c, (i * 89 % 100) / 100 * w, (i * 43 % 60) / 100 * h, 1.3, 1.3, "#fff");
          for (let b = 0; b < 3; b++) { c.save(); c.globalAlpha = .28 + .1 * bp; c.beginPath(); c.moveTo(0, h * .5); for (let x = 0; x <= w; x += 10)c.lineTo(x, h * (.18 + b * .07) + Math.sin(x * .02 + tm * .8 + b) * h * .06); c.lineTo(w, h * .6); c.lineTo(0, h * .6); c.closePath(); c.fillStyle = ["#5affc8", "#4fa8ff", "#b88aff"][b]; c.fill(); c.restore() }
          K.o(c, w * .2, h * .8, w * .5, h * .12, "#d8f0ff"); K.o(c, w * .85, h * .82, w * .4, h * .1, "#c8e4f8"); K.g(c, 0, h * .8, w, h * .2, ["#bfe4f8", "#7fb4d8"]); K.p(c, [[w * .8, h * .8], [w * .86, h * .66], [w * .92, h * .8]], "#9fd4f0"); } }
    }
  ];
  for (let t = 0; t < 4; t++) for (const id in S[t]) PF.skins[t][id] = S[t][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
