"use strict";
/* Mã BẢN TRẢ PHÍ của game Chở Hàng Kiểu Việt (Cozy Play): 3 LOẠI đường Night Pass (Chợ Tết gió giật + hàng Tết, Mưa bão xe phản ứng chậm, Đua 60 giây)
   và 4 giao diện xe (Cub cổ, Ba gác, Xe điện, Xe lôi) — mỗi giao diện có THẾ GIỚI vẽ riêng (hoàng hôn, chợ đêm, phố neon, sông nước), kiểu xe, người lái và bảng màu.
   Chỉ giao cho người có Night Pass qua GET /api/pro/cho-hang-kieu-viet.js (hoặc dùng thử 1 chuyến / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp (PF.K = bộ hàm vẽ). */
function main(PF, OPTS) {
  "use strict";
  PF.modeCfg[1] = { wind: .5, cargo: 1, pay: 1.3, cpD: 100, ib: 1.15 };      // Chợ Tết: gió giật, hàng Tết giá cao
  PF.modeCfg[2] = { lag: 6.6, jit: .8, rain: 1, wind: .3, ib: 1.2, pay: 1.2 };   // Mưa bão: xe phản ứng chậm + gió lốc
  PF.modeCfg[3] = { time: 60, v0: 6.2, cpD: 80, startItems: 4, pay: 1, ib: 1.2 };           // Đua 60 giây
  PF.cargoTet = [["🌸", "Cành đào", "Peach branch", .8, 1.2, 28], ["🍊", "Chậu quất", "Kumquat tree", .75, 1.0, 30], ["🥮", "Bánh chưng", "Rice cakes", .8, .5, 14], ["🧧", "Thùng lì xì", "Lucky envelopes", .8, .55, 18], ["🏮", "Đèn lồng", "Lanterns", .6, .7, 12], ["🍬", "Hộp mứt", "Candy box", .8, .45, 12], ["🍾", "Thùng rượu", "Wine crate", .75, .7, 20], ["🎋", "Bó mai", "Apricot bundle", .7, 1.1, 24]];
  const v = (h, s2) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const K = PF.K;
  const S = {
    cub: { h: 28, deco: ["🌅", "🛵", "🌾", "☀️"], hero: "🏍️🌅", fx: ["🌅", "⭐", "📦", "✨"], rider: "👨‍🌾", trail: ["💨", "🌾"], ground: "#8a6a3a", road: "#6a5a48",
      bike: { body: "#efe6c8", seat: "#6a3a1a", rack: "#7a6a4a", cart: false },
      scene(c, w, h, sx, tm, gy, k, dk) { k.g(c, 0, 0, w, h * .75, dk ? ["#2a1a3a", "#7a3a2a", "#c8742a"] : ["#ff9a4a", "#ffd08a", "#fff0c8"]); k.o(c, w * .72, h * .46, h * .11, h * .11, dk ? "#ffb060" : "#fff0a0");
        for (const [par, col, amp, fr] of [[.1, dk ? "#3a2236" : "#d89a6a", 30, .01], [.22, dk ? "#2a1a2a" : "#b8704a", 22, .016]]) { c.fillStyle = col; c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += 8) c.lineTo(x, h * .7 - 10 - amp + Math.sin((x + sx * par) * fr) * amp); c.lineTo(w, h); c.closePath(); c.fill() }
        k.prop(c, ["🌾", "🌴", "🛖", "🌾", "🐃", "🌳"], sx, .55, gy, 64, "cub", 34);
        const sp = 130, b = Math.floor(sx * .85 / sp) - 1; c.strokeStyle = dk ? "#887" : "#3a2a20"; c.lineWidth = 2; for (let i = b; i < b + Math.ceil(w / sp) + 3; i++) { const x = i * sp - sx * .85, y = gy(x); c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 84); c.moveTo(x - 12, y - 76); c.lineTo(x + 12, y - 76); c.stroke() }
        for (let i = 0; i < 5; i++) k.o(c, ((i * 83 + tm * 8) % w), h * (.12 + i * .04), 30, 7, "rgba(255,255,255,.35)") } },
    bagac: { h: 205, deco: ["🏮", "🌃", "📦", "🛺"], hero: "🛺🌃", fx: ["🏮", "⭐", "🧧", "✨"], rider: "👷", trail: ["💨", "🏮"], ground: "#2a2a3a", road: "#1a1a24",
      bike: { body: "#a0652a", seat: "#3a2210", rack: "#c8903a", cart: true },
      scene(c, w, h, sx, tm, gy, k, dk) { k.g(c, 0, 0, w, h * .75, ["#0c1030", "#1c2a5a", "#3a2a5a"]); for (let i = 0; i < 30; i++) k.o(c, (i * 97) % w, (i * 53) % (h * .4), 1.3, 1.3, "rgba(255,255,255," + (.4 + .5 * Math.abs(Math.sin(tm + i))) + ")");
        const sp = 60, b = Math.floor(sx * .45 / sp) - 1; for (let i = b; i < b + Math.ceil(w / sp) + 3; i++) { const hh = 90 + (fnvH(i) % 90), x = i * sp - sx * .45, y = h * .7; k.r(c, x, y - hh, sp - 8, hh, "#1e2438"); for (let q = 0; q < 6; q++) for (let r2 = 0; r2 < Math.floor(hh / 22); r2++) if ((fnvH(i * 7 + q * 3 + r2) % 3) > 0) k.r(c, x + 6 + q * 8, y - hh + 8 + r2 * 20, 5, 8, "#ffd878") }
        k.prop(c, ["🏮", "🏮", "🛖", "🏮"], sx, .8, gy, 90, "bg", 30); function fnvH(n) { let hh = 2166136261 ^ n; hh = Math.imul(hh, 16777619); hh ^= hh >>> 13; return Math.abs(hh) } } },
    dien: { h: 190, deco: ["⚡", "🔋", "🏙️", "💠"], hero: "⚡🛵", fx: ["⚡", "💠", "✨", "🔋"], rider: "🧑‍💻", trail: ["⚡", "💠"], ground: "#10162a", road: "#1a2240",
      bike: { body: "#33e0ff", seat: "#12304a", rack: "#7a9ac8", cart: false, extra(c, fl) { c.strokeStyle = "rgba(51,224,255,.8)"; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 18, 0, 6.283); c.stroke(); c.beginPath(); c.arc(fl, 0, 18, 0, 6.283); c.stroke() } },
      scene(c, w, h, sx, tm, gy, k, dk) { k.g(c, 0, 0, w, h * .75, ["#050b2a", "#14215a", "#3a1a6a"]); const sp = 70, b = Math.floor(sx * .4 / sp) - 1; for (let i = b; i < b + Math.ceil(w / sp) + 3; i++) { let hh = 2166136261 ^ i; hh = Math.imul(hh, 16777619); const H2 = 110 + (Math.abs(hh) % 140), x = i * sp - sx * .4, y = h * .7; k.r(c, x, y - H2, sp - 10, H2, "#0e1640"); c.strokeStyle = ["#33e0ff", "#ff3dd0", "#7a5cff"][Math.abs(hh >> 4) % 3]; c.lineWidth = 2; c.strokeRect(x, y - H2, sp - 10, H2); for (let r2 = 0; r2 < Math.floor(H2 / 26); r2++) k.r(c, x + 8, y - H2 + 8 + r2 * 24, sp - 26, 4, "rgba(51,224,255," + (.25 + .5 * Math.abs(Math.sin(tm * 2 + r2 + i))) + ")") }
        c.strokeStyle = "rgba(255,61,208,.5)"; c.lineWidth = 2; for (let i = 0; i < 4; i++) { const y = h * .7 + 8 + i * 6; c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke() } } },
    xelam: { h: 150, deco: ["🌴", "🛶", "🥥", "🐟"], hero: "🛺🌴", fx: ["🥥", "🌴", "🐟", "✨"], rider: "👩‍🌾", trail: ["💨", "🥥"], ground: "#6a8a3a", road: "#7a6a4a",
      bike: { body: "#e8a020", seat: "#2a4a1a", rack: "#6a4a2a", cart: true },
      scene(c, w, h, sx, tm, gy, k, dk) { k.g(c, 0, 0, w, h * .7, dk ? ["#102a3a", "#2a5a6a"] : ["#7fd8ff", "#e8fbff"]); k.g(c, 0, h * .55, w, h * .2, dk ? ["#1a4a5a", "#0a2a3a"] : ["#5fc8e8", "#2a98c8"]);
        for (let i = 0; i < 6; i++) { const x = ((i * 70 - sx * .3) % (w + 80) + w + 80) % (w + 80) - 40, y = h * .6 + Math.sin(tm * 1.5 + i) * 2; k.o(c, x, y, 22, 5, "#7a5a2a") }
        k.prop(c, ["🌴", "🥥", "🛖", "🌴", "🌿", "🌴"], sx, .6, gy, 54, "xl", 36); k.prop(c, ["🌾", "🌿"], sx, 1, gy, 40, "xl2", 20) } }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, fx: d.fx, rider: d.rider, trail: d.trail, ground: d.ground, road: d.road, bike: d.bike, scene: d.scene, css: "" }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
