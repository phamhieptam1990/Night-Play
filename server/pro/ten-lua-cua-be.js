"use strict";
/* Mã BẢN TRẢ PHÍ của game Tên Lửa Của Bé (Pop Play): 16 GIAO DIỆN Night Pass (4 cho mỗi loại; giao diện "basic" miễn phí nằm sẵn trong trang game).
   Mỗi giao diện = nhân vật VẼ RIÊNG (hình dạng khác hẳn) + thế giới riêng (nền, hình trôi, chướng ngại, vật nhặt, mặt đất) + khung câu hỏi / nút đáp án riêng.
   Chỉ giao cho người có Night Pass qua GET /api/pro/ten-lua-cua-be.js (hoặc bản dùng thử 1 ván / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT bên trong trang game: không được dùng biến nào nằm ngoài hàm này. PF = đối tượng do lõi game cung cấp (PF.dr = bộ vẽ). */
function main(PF, OPTS) {
  "use strict";
  const v = PF.mkv, D = PF.dr, E = D.E, P = D.P, R = D.R, LN = D.LN, fd = D.flameDn, fb = D.flameBk;
  const S = [{}, {}, {}, {}];

  /* ===== 0 · TÊN LỬA (mũi hướng lên) ===== */
  S[0].ship = {
    vars: v("linear-gradient(#050b2a,#1b2f7a)", "#14214f", "#e0ecff", "#6ee7ff", "#02202a", "2cqw", ".7cqw solid #6ee7ff", "0 0 3cqw rgba(110,231,255,.45)"),
    deco: ["⭐", "🪐", "✨"], bg: ["#050b2a", "#1b2f7a"], gnd: ["#fff", "#fff"], star: "💎", obs: ["☄️", "🪨"], fx: "#6ee7ff",
    css: ".qa{clip-path:polygon(8% 0,92% 0,100% 14%,100% 86%,92% 100%,8% 100%,0 86%,0 14%)}",
    hero(c, o) {
      fd(c, 28, 14 + o.fl * 40, 6, o.t, "#e8ffff", "#3ab8ff"); c.save(); c.translate(-12, 0); fd(c, 28, 10 + o.fl * 30, 4, o.t + 1, "#e8ffff", "#3ab8ff"); c.restore(); c.save(); c.translate(12, 0); fd(c, 28, 10 + o.fl * 30, 4, o.t + 2, "#e8ffff", "#3ab8ff"); c.restore();
      P(c, [0, -50, 34, 30, 16, 24, 0, 36, -16, 24, -34, 30], "#27324f"); P(c, [0, -50, 12, -2, 0, 30, -12, -2], "#4a5c8c");
      P(c, [-34, 30, -40, 8, -22, 16], "#e5484d"); P(c, [34, 30, 40, 8, 22, 16], "#e5484d"); E(c, 0, -14, 5.5, 12, "#6ee7ff"); E(c, -1.5, -19, 1.8, 5, "rgba(255,255,255,.8)");
      R(c, -22, 18, 8, 5, 2, "#ffdd55"); R(c, 14, 18, 8, 5, 2, "#ffdd55");
    }
  };
  S[0].candy = {
    vars: v("linear-gradient(#ffd3ea,#ffb0d6)", "#fff0f8", "#6b1d4a", "#ff4fa3", "#fff", "9cqw", ".9cqw dashed #fff", "0 1cqw 0 rgba(255,79,163,.45)"),
    deco: ["🍭", "🍬", "🧁"], bg: ["#ffc2e2", "#fff0c9"], gnd: ["#fff", "#fff"], star: "🍬", obs: ["🍩", "🧁"], fx: "#ff7ac0", css: ".qa{border-radius:999px}",
    hero(c, o) {
      fd(c, 34, 14 + o.fl * 38, 9, o.t, "#fff3a0", "#ff7ac0");
      E(c, -22, 24, 11, 15, "#7fd6ff", -.4); E(c, 22, 24, 11, 15, "#ffe27a", .4);
      c.save(); c.beginPath(); c.moveTo(0, -48); c.quadraticCurveTo(26, -14, 17, 36); c.lineTo(-17, 36); c.quadraticCurveTo(-26, -14, 0, -48); c.clip();
      c.fillStyle = "#ffb3d9"; c.fillRect(-30, -50, 60, 100); c.fillStyle = "#fff"; for (let i = -3; i < 5; i++) { c.save(); c.translate(0, i * 16); c.rotate(-.35); c.fillRect(-40, -4, 80, 7); c.restore() } c.restore();
      c.strokeStyle = "#ff4fa3"; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -48); c.quadraticCurveTo(26, -14, 17, 36); c.lineTo(-17, 36); c.quadraticCurveTo(-26, -14, 0, -48); c.stroke();
      E(c, 0, -6, 9, 9, "#fff"); E(c, 0, -6, 6.5, 6.5, "#ff4fa3"); E(c, 0, -43, 5, 5, "#e5484d"); E(c, 1.5, -45, 1.5, 1.5, "#fff");
    }
  };
  S[0].dragon = {
    vars: v("linear-gradient(#3a0e0e,#c8401a)", "#2a0a0a", "#ffe8d0", "#ffb020", "#2a1000", "3cqw", ".7cqw solid #ffb020", "0 0 3cqw rgba(255,120,20,.5)"),
    deco: ["🔥", "🌋", "🦇"], bg: ["#3a0e0e", "#c8401a"], gnd: ["#fff", "#fff"], star: "🔥", obs: ["🪨", "🦇"], fx: "#ff8a1f", css: ".qb{text-shadow:0 0 2cqw #ffb020}",
    hero(c, o) {
      const f = Math.sin(o.t * 9) * 12;
      P(c, [-6, -4, -50, -22 - f, -40, 10, -26, 6, -22, 24, -10, 14], "#7a2fb0"); P(c, [6, -4, 50, -22 - f, 40, 10, 26, 6, 22, 24, 10, 14], "#7a2fb0");
      P(c, [-6, -4, -50, -22 - f, -36, -6], "#a14fd8"); P(c, [6, -4, 50, -22 - f, 36, -6], "#a14fd8");
      P(c, [-8, 20, 0, 52, 8, 20], "#3fa94f"); E(c, 0, 52, 4, 4, "#e5484d");
      fd(c, 22, 18 + o.fl * 44, 8, o.t, "#ffe27a", "#ff4a1f");
      E(c, 0, 4, 15, 28, "#4fbf5d"); E(c, 0, 10, 9, 20, "#c9f0a8"); E(c, 0, -34, 13, 12, "#5cc96a");
      P(c, [-8, -42, -12, -56, -3, -44], "#ffd54a"); P(c, [8, -42, 12, -56, 3, -44], "#ffd54a"); E(c, -5, -36, 3.2, 3.2, "#fff"); E(c, 5, -36, 3.2, 3.2, "#fff"); E(c, -5, -36, 1.6, 1.6, "#222"); E(c, 5, -36, 1.6, 1.6, "#222");
      E(c, 0, -27, 5, 3, "#3a9a49"); E(c, -1.5, -27, 1, 1, "#222"); E(c, 1.5, -27, 1, 1, "#222");
    }
  };
  S[0].robot = {
    vars: v("linear-gradient(#cfd8e8,#8fa0c0)", "#f4f7fc", "#1f2f4a", "#2f7bff", "#fff", "1.5cqw", ".8cqw solid #5a6a8a", "0 1cqw 0 rgba(40,60,100,.4)"),
    deco: ["⚙️", "🔩", "🛰️"], bg: ["#5a6a8a", "#cfd8e8"], gnd: ["#fff", "#fff"], star: "⚙️", obs: ["🔩", "🛰️"], fx: "#9ff", css: ".qb{font-family:'Courier New',monospace}",
    hero(c, o) {
      fd(c, 34, 14 + o.fl * 38, 7, o.t, "#cfffff", "#2f7bff"); c.save(); c.translate(-12, 0); fd(c, 34, 8, 0, 0, "#fff", "#fff"); c.restore();
      R(c, -22, 16, 12, 22, 3, "#5a6a8a"); R(c, 10, 16, 12, 22, 3, "#5a6a8a"); fd(c, 38, 10 + o.fl * 26, 4, o.t + 1, "#cfffff", "#2f7bff");
      R(c, -20, -12, 40, 36, 6, "#c9d4e8"); R(c, -14, -6, 28, 14, 3, "#2f3b5a"); E(c, -6, 1, 3, 3, "#6ee7ff"); E(c, 6, 1, 3, 3, "#6ee7ff");
      R(c, -30, -14, 10, 26, 4, "#8fa0c0"); R(c, 20, -14, 10, 26, 4, "#8fa0c0");
      R(c, -16, -40, 32, 28, 8, "#e8eefb"); R(c, -11, -33, 22, 12, 3, "#2f3b5a"); E(c, -5, -27, 3.4, 3.4, "#ff5a5a"); E(c, 5, -27, 3.4, 3.4, "#ff5a5a");
      LN(c, 0, -40, 0, -52, 2.5, "#5a6a8a"); E(c, 0, -53, 3.5, 3.5, "#ff5a5a"); R(c, -12, 14, 24, 5, 2, "#ffdd55");
    }
  };

  /* ===== 1 · CÁ CON (mũi hướng sang phải) ===== */
  S[1].shark = {
    vars: v("linear-gradient(#3a6a9a,#0a2a4a)", "rgba(255,255,255,.14)", "#e0f4ff", "#ff6a4a", "#fff", "4cqw", ".7cqw solid #7ad0ff", "0 0 3cqw rgba(122,208,255,.35)"),
    deco: ["🫧", "🐟", "🐠"], bg: ["#2f6a9a", "#06213f"], gnd: ["#3a4a5a", "#26323f"], star: "💎", obs: ["🥫", "🛢️", "🪝"], fx: "#bff", css: "",
    hero(c, o) {
      const w = Math.sin(o.t * 8) * 8;
      P(c, [-34, 0, -62, -26 + w, -52, 0, -62, 26 + w], "#5a7a9a"); P(c, [-6, -17, 8, -42, 20, -16], "#5a7a9a");
      E(c, 0, 0, 42, 19, "#6f8fb0"); E(c, 4, 8, 36, 10, "#e8f2fa"); P(c, [4, 12, 12, 26, 20, 12], "#5a7a9a");
      c.fillStyle = "#fff"; for (let i = 0; i < 4; i++) P(c, [26 + i * 3.6, 6, 28.8 + i * 3.6, 12, 31.6 + i * 3.6, 6], "#fff");
      E(c, 24, -6, 4.6, 4.6, "#fff"); E(c, 25.4, -6, 2.4, 2.4, "#111"); for (let i = 0; i < 3; i++) LN(c, 8 + i * 4, -8, 10 + i * 4, 0, 1.4, "#456");
    }
  };
  S[1].turtle = {
    vars: v("linear-gradient(#7fe0c8,#2a8a7a)", "#f0fffa", "#0b4a3a", "#ff8a3d", "#fff", "7cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(11,74,58,.3)"),
    deco: ["🪸", "🫧", "🐚"], bg: ["#7fe0c8", "#1f7a8a"], gnd: ["#e8d49a", "#bfa660"], star: "🐚", obs: ["🪼", "🗑️"], fx: "#cfe", css: "",
    hero(c, o) {
      const p = Math.sin(o.t * 6) * .5;
      E(c, 12, 16, 15, 6, "#7ac36a", .6 + p); E(c, -14, 15, 12, 5, "#7ac36a", -.4 - p); E(c, -34, 6, 9, 4, "#7ac36a", .2);
      E(c, 36, 2, 12, 10, "#8fd47a"); E(c, 40, -1, 3.4, 3.4, "#fff"); E(c, 41, -1, 1.7, 1.7, "#111"); c.strokeStyle = "#3a7a3a"; c.lineWidth = 1.6; c.beginPath(); c.arc(43, 5, 4, .3, 1.5); c.stroke();
      E(c, 0, -2, 31, 22, "#3f9b4f"); c.save(); c.beginPath(); c.ellipse(0, -2, 31, 22, 0, 0, 7); c.clip();
      c.strokeStyle = "#2a7a3a"; c.lineWidth = 2.4; for (let x = -24; x <= 24; x += 16) { c.beginPath(); c.moveTo(x, -26); c.lineTo(x, 22); c.stroke() } c.beginPath(); c.moveTo(-34, -2); c.lineTo(34, -2); c.stroke();
      E(c, -8, -12, 6, 4, "rgba(255,255,255,.28)"); c.restore();
    }
  };
  S[1].dolphin = {
    vars: v("linear-gradient(#aef0ff,#3a8fd0)", "#f0fbff", "#0b3a5a", "#ff7a59", "#fff", "7cqw", ".9cqw solid #fff", "0 1cqw 3cqw rgba(11,58,90,.3)"),
    deco: ["🌊", "🐠", "🫧"], bg: ["#aef0ff", "#2f7fc0"], gnd: ["#f5e2a8", "#d9bd78"], star: "⭐", obs: ["🥫", "🗑️"], fx: "#fff", css: "",
    hero(c, o) {
      const w = Math.sin(o.t * 8) * 9;
      P(c, [-34, 2, -58, -14 + w, -46, 4, -58, 20 + w], "#4a8fd0");
      c.fillStyle = "#5aa9e6"; c.beginPath(); c.moveTo(-36, 4); c.quadraticCurveTo(-10, -26, 30, -12); c.quadraticCurveTo(44, -8, 54, 0); c.quadraticCurveTo(44, 6, 32, 10); c.quadraticCurveTo(0, 26, -36, 4); c.fill();
      c.fillStyle = "#d8f1ff"; c.beginPath(); c.moveTo(-26, 8); c.quadraticCurveTo(0, 22, 30, 8); c.quadraticCurveTo(0, 12, -26, 8); c.fill();
      P(c, [-6, -14, 4, -34, 14, -12], "#4a8fd0"); P(c, [4, 6, 8, 24, 16, 8], "#4a8fd0");
      E(c, 28, -3, 4, 4, "#fff"); E(c, 29, -3, 2, 2, "#111");
    }
  };
  S[1].jelly = {
    vars: v("linear-gradient(#2a1050,#7a3aa0)", "#2a1a5e", "#ffe8ff", "#ff9ad5", "#3a0a3a", "6cqw", ".7cqw solid #ff9ad5", "0 0 3.5cqw rgba(255,154,213,.5)"),
    deco: ["✨", "🫧", "🪼"], bg: ["#1a0a40", "#5a2a8a"], gnd: ["#3a2a6a", "#241848"], star: "✨", obs: ["🪸", "🗑️"], fx: "#ffb0ee", css: ".qb{text-shadow:0 0 2cqw #ff9ad5}",
    hero(c, o) {
      c.rotate(.15);
      for (let i = -3; i <= 3; i++) { c.strokeStyle = "rgba(255,170,230,.85)"; c.lineWidth = 3; c.beginPath(); c.moveTo(i * 7, 8); c.quadraticCurveTo(i * 7 + Math.sin(o.t * 6 + i) * 8, 24, i * 7 - Math.sin(o.t * 6 + i) * 6, 42); c.stroke() }
      const sq = 1 + Math.sin(o.t * 6) * .06; c.save(); c.scale(1 / sq, sq);
      c.fillStyle = "rgba(255,140,220,.88)"; c.beginPath(); c.arc(0, 8, 30, Math.PI, 0); c.quadraticCurveTo(26, 16, 0, 12); c.quadraticCurveTo(-26, 16, -30, 8); c.fill();
      E(c, -8, -8, 7, 4, "rgba(255,255,255,.5)", -.5); E(c, -9, 2, 3.4, 3.4, "#fff"); E(c, 9, 2, 3.4, 3.4, "#fff"); E(c, -8.6, 2, 1.7, 1.7, "#222"); E(c, 9.4, 2, 1.7, 1.7, "#222"); c.restore();
    }
  };

  /* ===== 2 · TÀU HỎA (đầu tàu hướng phải, gốc = mặt ray; toa nối phía sau) ===== */
  const wheel = (c, x, r, col, t, sp) => { E(c, x, -r, r, r, col); E(c, x, -r, r * .38, r * .38, "#ddd"); const a = t * (sp || 8); LN(c, x, -r, x + Math.cos(a) * r * .8, -r + Math.sin(a) * r * .8, 2, "#999") };
  S[2].steam = {
    vars: v("linear-gradient(#d9c9a8,#8a7a5a)", "#fffaf0", "#3a2a14", "#c0392b", "#fff", "3cqw", "1cqw solid #5a4a2a", "0 1cqw 0 rgba(60,40,10,.4)"),
    deco: ["☁️", "🏭", "🐦"], bg: ["#c9b48a", "#f1e4c0"], gnd: ["#6b5a3a", "#4a3a22"], star: "coal", obs: ["🪨", "🐄"], fx: "#999", css: "",
    hero(c, o) {
      const car = (x) => { R(c, x - 32, -34, 64, 26, 3, "#3a2a1a"); R(c, x - 32, -34, 64, 5, 2, "#b5651d"); for (let k = 0; k < 3; k++)R(c, x - 24 + k * 18, -26, 11, 11, 2, "#ffe9a8"); R(c, x - 36, -12, 72, 4, 2, "#222"); wheel(c, x - 18, 8, "#222", o.t, 8); wheel(c, x + 18, 8, "#222", o.t, 8) };
      car(-172); car(-92);
      R(c, -34, -40, 72, 32, 8, "#1f1f26"); R(c, 22, -62, 14, 24, 2, "#1f1f26"); P(c, [18, -62, 40, -62, 34, -70, 24, -70], "#b5651d"); R(c, -2, -50, 12, 8, 4, "#b5651d"); R(c, -2, -22, 36, 4, 2, "#d9a84a"); R(c, 12, -42, 4, 34, 0, "#d9a84a");
      R(c, -44, -66, 30, 56, 3, "#2a2a32"); R(c, -48, -72, 38, 8, 2, "#b5651d"); R(c, -40, -58, 20, 18, 3, "#ffe9a8"); P(c, [38, -12, 62, 0, 38, 0], "#555");
      wheel(c, -22, 16, "#1f1f26", o.t, 8); wheel(c, 10, 16, "#1f1f26", o.t, 8); wheel(c, 38, 9, "#1f1f26", o.t, 12);
      for (let k = 0; k < 4; k++) { const u = (o.t * 1.2 + k / 4) % 1; E(c, 29 - u * 24, -74 - u * 44, 6 + u * 12, 6 + u * 12, "rgba(180,180,180," + (.8 - u * .75) + ")") }
    }
  };
  S[2].bullet = {
    vars: v("linear-gradient(#e8f4ff,#9ad0f0)", "#fff", "#12335a", "#2f9bff", "#fff", "8cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,110,170,.3)"),
    deco: ["☁️", "🏙️", "✈️"], bg: ["#9ad0f0", "#eaf6ff"], gnd: ["#b8c4d0", "#8a96a4"], star: "⚡", obs: ["🚧", "🪨"], fx: "#bde", css: "",
    hero(c, o) {
      const car = (x, nose) => { c.fillStyle = "#f4f8ff"; c.beginPath(); c.moveTo(x - 34, -6); c.lineTo(x - 34, -38); c.quadraticCurveTo(x - 34, -44, x - 26, -44); c.lineTo(x + 30, -44); c.lineTo(x + 30, -6); c.closePath(); c.fill(); R(c, x - 34, -24, 68, 5, 0, "#2f9bff"); for (let k = 0; k < 4; k++)R(c, x - 26 + k * 15, -38, 10, 9, 3, "#2a3f66"); E(c, x - 16, -4, 7, 7, "#333"); E(c, x + 16, -4, 7, 7, "#333") };
      car(-168); car(-90);
      c.fillStyle = "#f4f8ff"; c.beginPath(); c.moveTo(-38, -6); c.lineTo(-38, -42); c.quadraticCurveTo(-38, -48, -30, -48); c.lineTo(10, -48); c.quadraticCurveTo(56, -40, 74, -6); c.closePath(); c.fill();
      c.fillStyle = "#2a3f66"; c.beginPath(); c.moveTo(14, -44); c.quadraticCurveTo(42, -38, 52, -22); c.lineTo(14, -22); c.closePath(); c.fill(); R(c, -38, -24, 100, 5, 0, "#2f9bff"); R(c, -30, -40, 36, 11, 4, "#2a3f66");
      E(c, -18, -4, 8, 8, "#333"); E(c, 22, -4, 8, 8, "#333"); E(c, 54, -4, 6, 6, "#333");
      c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 2; for (let k = 0; k < 3; k++) { const x = -200 - ((o.t * 260 + k * 40) % 90); c.beginPath(); c.moveTo(x, -30 + k * 10); c.lineTo(x - 40, -30 + k * 10); c.stroke() }
    }
  };
  S[2].magic = {
    vars: v("linear-gradient(#3a1a6a,#9a3aa0)", "#2a1050", "#f8e8ff", "#ffd54a", "#2a1a00", "6cqw", ".7cqw solid #ffd54a", "0 0 3.5cqw rgba(255,213,74,.5)"),
    deco: ["✨", "🌙", "⭐"], bg: ["#2a1060", "#9a3aa0"], gnd: ["#4a2a7a", "#2e1850"], star: "✨", obs: ["🔮", "🪄"], fx: "#ffe27a", css: ".qb{text-shadow:0 0 2cqw #ffd54a}",
    hero(c, o) {
      const car = (x) => { c.fillStyle = "#8a4fd0"; c.beginPath(); c.arc(x, -22, 27, 0, Math.PI); c.lineTo(x - 27, -30); c.arc(x, -30, 27, Math.PI, 0); c.closePath(); c.fill(); E(c, x, -30, 16, 16, "#ffd54a"); E(c, x + 6, -34, 14, 14, "#8a4fd0"); E(c, x - 20, -4, 7, 7, "#ffd54a"); E(c, x + 20, -4, 7, 7, "#ffd54a") };
      car(-166); car(-90);
      R(c, -34, -38, 70, 32, 12, "#b06ae8"); R(c, -34, -20, 70, 6, 3, "#ffd54a"); E(c, -6, -28, 6, 6, "#ffe9a8"); E(c, 12, -28, 6, 6, "#ffe9a8");
      P(c, [-14, -38, 4, -84 + Math.sin(o.t * 3) * 3, 22, -38], "#4a2a9a"); R(c, -22, -42, 52, 7, 3, "#ffd54a"); E(c, 3, -62, 4, 4, "#ffd54a");
      E(c, 40, -16, 14, 12, "#b06ae8"); E(c, 46, -18, 4, 4, "#fff"); E(c, 47, -18, 2, 2, "#222");
      E(c, -18, -5, 9, 9, "#ffd54a"); E(c, 12, -5, 9, 9, "#ffd54a"); E(c, 38, -5, 7, 7, "#ffd54a");
      c.font = "20px serif"; c.textAlign = "center"; for (let k = 0; k < 3; k++) { c.globalAlpha = .9 - k * .25; c.fillText("✨", -210 - k * 22, -40 + Math.sin(o.t * 7 + k) * 10) } c.globalAlpha = 1;
    }
  };
  S[2].toy = {
    vars: v("linear-gradient(#ffe0a0,#ffb0b0)", "#fffaf0", "#5a2a10", "#e8574a", "#fff", "4cqw", "1cqw solid #c98a4a", "0 1cqw 0 rgba(150,90,30,.4)"),
    deco: ["🧸", "🎈", "🧩"], bg: ["#ffe0a0", "#ffd0c8"], gnd: ["#c98a4a", "#a86a2a"], star: "🧩", obs: ["🧱", "🎲"], fx: "#ffd0a0", css: "",
    hero(c, o) {
      const blk = (x, col, col2) => { R(c, x - 28, -36, 56, 32, 4, col); R(c, x - 28, -36, 56, 6, 3, col2); E(c, x - 15, -38, 5, 3, col2); E(c, x + 15, -38, 5, 3, col2); E(c, x - 17, -4, 8, 8, "#6b4a2a"); E(c, x + 17, -4, 8, 8, "#6b4a2a"); E(c, x - 17, -4, 3, 3, "#ffd") ; E(c, x + 17, -4, 3, 3, "#ffd") };
      blk(-164, "#4da3ff", "#2f7bd0"); blk(-90, "#ffcf33", "#e0a800"); LN(c, -130, -14, -118, -14, 3, "#8a5a2a"); LN(c, -58, -14, -46, -14, 3, "#8a5a2a");
      R(c, -34, -44, 70, 40, 6, "#e8574a"); R(c, -34, -44, 70, 8, 4, "#c2382c"); R(c, -4, -72, 26, 30, 4, "#4da3ff"); R(c, -8, -78, 34, 8, 3, "#2f7bd0"); R(c, 22, -62, 14, 18, 3, "#ffcf33");
      E(c, 10, -88 + Math.sin(o.t * 5) * 2, 5, 5, "rgba(255,255,255,.8)");
      E(c, 6, -26, 11, 11, "#fff0c9"); E(c, 3, -28, 2, 2, "#222"); E(c, 10, -28, 2, 2, "#222"); c.strokeStyle = "#222"; c.lineWidth = 1.6; c.beginPath(); c.arc(6.5, -24, 4.4, .2, 2.9); c.stroke();
      E(c, -18, -4, 10, 10, "#6b4a2a"); E(c, 12, -4, 10, 10, "#6b4a2a"); E(c, 36, -4, 8, 8, "#6b4a2a"); E(c, -18, -4, 4, 4, "#ffd"); E(c, 12, -4, 4, 4, "#ffd"); E(c, 36, -4, 3, 3, "#ffd");
    }
  };

  /* ===== 3 · KHỦNG LONG (gốc = bàn chân; mặt hướng phải) ===== */
  const legs = (c, o, col, w) => { const lp = o.air ? 0 : Math.sin(o.t * 15) * 9; R(c, -12 + lp, -22, w || 12, 22, 5, col); R(c, 8 - lp, -22, w || 12, 22, 5, col) };
  S[3].trex = {
    vars: v("linear-gradient(#ffd890,#c0702a)", "#fff7e0", "#4a2a10", "#c0541c", "#fff", "3cqw", "1cqw solid #8a3a10", "0 1cqw 0 rgba(120,50,10,.4)"),
    deco: ["☁️", "🌋", "🦴"], bg: ["#ffd890", "#f6a860"], gnd: ["#b5651d", "#8a4a10"], star: "🍖", obs: ["🌵", "🪨", "🦴"], fx: "#e0b070", css: "",
    hero(c, o) {
      legs(c, o, "#8a4a10", 14); P(c, [-20, -40, -66, -20, -20, -26], "#a85a18"); E(c, 0, -40, 28, 24, "#b5651d"); E(c, 2, -32, 18, 12, "#e8c08a");
      P(c, [14, -50, 24, -70, 46, -72, 46, -50], "#b5651d"); E(c, 36, -66, 21, 15, "#b5651d"); R(c, 28, -56, 30, 10, 4, "#8a4a10"); for (let i = 0; i < 4; i++) P(c, [32 + i * 7, -56, 35 + i * 7, -49, 38 + i * 7, -56], "#fff");
      E(c, 38, -72, 4.4, 4.4, "#fff"); E(c, 39.4, -72, 2.2, 2.2, "#111"); LN(c, 14, -34, 24, -30, 4, "#8a4a10"); E(c, 25, -30, 3, 3, "#8a4a10");
    }
  };
  S[3].trice = {
    vars: v("linear-gradient(#bfe6ff,#8fb0d6)", "#f4fbff", "#1f3a5a", "#e87a5a", "#fff", "8cqw", ".8cqw solid #fff", "0 1cqw 3cqw rgba(60,110,170,.3)"),
    deco: ["☁️", "🌿", "🦋"], bg: ["#bfe6ff", "#e0f4d8"], gnd: ["#7ab05a", "#5a903a"], star: "🍃", obs: ["🪨", "🌵"], fx: "#bde0a0", css: "",
    hero(c, o) {
      legs(c, o, "#5a7ab0", 14); P(c, [-24, -34, -56, -20, -22, -22], "#6f8fd0"); E(c, -2, -32, 30, 20, "#6f8fd0"); E(c, 0, -26, 20, 10, "#d8e4f8");
      E(c, 34, -40, 20, 22, "#e87a5a"); for (let i = 0; i < 5; i++) E(c, 24 + Math.cos(i * 1.1 - .6) * 15, -42 + Math.sin(i * 1.1 - .6) * 18, 3.2, 3.2, "#ffd54a");
      E(c, 40, -32, 12, 10, "#6f8fd0"); P(c, [36, -40, 46, -64, 44, -40], "#fff"); P(c, [46, -36, 62, -52, 56, -34], "#fff"); P(c, [42, -26, 58, -32, 54, -22], "#fff"); E(c, 44, -38, 3, 3, "#111");
    }
  };
  S[3].dragon = {
    vars: v("linear-gradient(#3a1a6a,#9a3aa0)", "#2a1050", "#f8e8ff", "#ffd54a", "#2a1a00", "6cqw", ".7cqw solid #ffd54a", "0 0 3.5cqw rgba(255,213,74,.5)"),
    deco: ["🔥", "🌙", "✨"], bg: ["#2a1060", "#7a3aa0"], gnd: ["#4a2a6a", "#2e1850"], star: "🍖", obs: ["🪨", "🔮"], fx: "#ff8a1f", css: ".qb{text-shadow:0 0 2cqw #ffd54a}",
    hero(c, o) {
      legs(c, o, "#6a2fb0", 13); const f = Math.sin(o.t * 10) * 10;
      P(c, [-26, -36, -62, -22, -50, -34, -66, -40, -22, -44], "#7a2fb0"); P(c, [-60, -22, -70, -16, -64, -30], "#ffd54a");
      P(c, [-6, -50, -30, -86 - f, -2, -68 - f / 2, 10, -60], "#a14fd8"); E(c, 0, -36, 28, 20, "#8a3fd0"); E(c, 2, -28, 18, 10, "#e8c0f8");
      P(c, [16, -46, 26, -66, 44, -64, 44, -44], "#8a3fd0"); E(c, 38, -62, 16, 12, "#8a3fd0"); P(c, [32, -72, 36, -86, 42, -72], "#ffd54a"); E(c, 42, -65, 3.6, 3.6, "#fff"); E(c, 43, -65, 1.8, 1.8, "#111");
      if (o.fl > .5 || Math.sin(o.t * 4) > .6) { c.save(); c.translate(52, -58); P(c, [0, -6, 26 + Math.sin(o.t * 30) * 5, 0, 0, 6], "#ff4a1f"); P(c, [0, -3, 14, 0, 0, 3], "#ffe27a"); c.restore() }
    }
  };
  S[3].robot = {
    vars: v("linear-gradient(#cfd8e8,#8fa0c0)", "#f4f7fc", "#1f2f4a", "#2f7bff", "#fff", "1.5cqw", ".8cqw solid #5a6a8a", "0 1cqw 0 rgba(40,60,100,.4)"),
    deco: ["⚙️", "🔩", "☁️"], bg: ["#8fa0c0", "#dfe6f2"], gnd: ["#5a6a8a", "#3a4660"], star: "🔋", obs: ["🔩", "⚙️"], fx: "#9ff", css: ".qb{font-family:'Courier New',monospace}",
    hero(c, o) {
      const lp = o.air ? 0 : Math.sin(o.t * 15) * 8; R(c, -14 + lp, -22, 10, 22, 2, "#5a6a8a"); R(c, 8 - lp, -22, 10, 22, 2, "#5a6a8a"); R(c, -17 + lp, -4, 16, 5, 2, "#3a4660"); R(c, 6 - lp, -4, 16, 5, 2, "#3a4660");
      LN(c, -26, -40, -50, -28, 6, "#5a6a8a"); E(c, -52, -27, 5, 5, "#ffdd55"); R(c, -26, -56, 52, 34, 5, "#c9d4e8"); R(c, -26, -56, 52, 8, 3, "#a9b6d0"); for (let k = 0; k < 3; k++)E(c, -16 + k * 10, -30, 2.4, 2.4, "#5a6a8a");
      LN(c, 22, -32, 36, -28, 5, "#5a6a8a"); R(c, 14, -86, 38, 32, 6, "#e8eefb"); R(c, 22, -78, 26, 14, 3, "#2f3b5a"); E(c, 36, -71, 4.4, 4.4, "#ff4a4a"); E(c, 36, -71, 1.8, 1.8, "#fff");
      LN(c, 33, -86, 33, -98, 2.4, "#5a6a8a"); E(c, 33, -99, 3.2, 3.2, "#6ee7ff"); R(c, 44, -66, 14, 8, 2, "#5a6a8a");
      if (o.fl > .5) { c.save(); c.translate(-8, 0); fd(c, 0, 20, 5, o.t, "#cfffff", "#2f7bff"); c.restore() }
    }
  };
  for (let t = 0; t < 4; t++) for (const id in S[t]) PF.skins[t][id] = S[t][id];
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
