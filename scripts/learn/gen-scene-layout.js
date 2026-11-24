/* Cảnh vườn Học Vui — lối đi, hàng rào, bộ vị trí cố định, vật nuôi thêm, quy hoạch khu vườn.
   Một phần của scripts/learn/gen-scene-art.js (nạp bằng require, dùng đối tượng chung SP). */
"use strict";
module.exports = function (SP) {
  var C = SP.C, G = SP.G, H = SP.H, OX = SP.OX, OY = SP.OY, P = SP.P, TH = SP.TH, TW = SP.TW, barrel = SP.barrel, bigTree = SP.bigTree, box = SP.box,
      bush = SP.bush, chicken = SP.chicken, coop = SP.coop, cow = SP.cow, crate = SP.crate, ell = SP.ell, f = SP.f, flowerBit = SP.flowerBit,
      flowerPatch = SP.flowerPatch, hay = SP.hay, lavender = SP.lavender, lerp = SP.lerp, milkcans = SP.milkcans, pine = SP.pine,
      pumpkins = SP.pumpkins, rabbit = SP.rabbit, rng = SP.rng, rock = SP.rock, roundHay = SP.roundHay, shadow = SP.shadow;

/* ---------- LỐI ĐI = MỘT MẢNG LIỀN (nhiều kiểu để chọn) và HÀNG RÀO = MỘT DẢI LIỀN (nhiều kiểu để chọn) ---------- */
const U0 = (sx, sy) => [(sx - OX) / TW + (sy - OY) / TH, (sy - OY) / TH - (sx - OX) / TW];
const PATHS = {
  dat:   { vi: "Đường đất",  edge: "#8A5A2E", fill: "#B98350", mark: "dirt" },
  soi:   { vi: "Sỏi",        edge: "#A19D95", fill: "#DAD6CD", mark: "gravel" },
  cuoi:  { vi: "Đá cuội",    edge: "#7E7A72", fill: "#B6B2A9", mark: "cobble" },
  dalat: { vi: "Đá lát",     edge: "#8A867E", fill: "#D2CEC6", mark: "slab" },
  gach:  { vi: "Gạch đỏ",    edge: "#8E3E1B", fill: "#D9774A", mark: "brick" }
};
function pathPatch(pl, w, style, seed, part) {
  const S = PATHS[style] || PATHS.soi, r = rng((seed || 1) * 977 + 13);
  let d = `M${f(pl[0][0])} ${f(pl[0][1])}`; for (let i = 1; i < pl.length - 1; i++) { const m = [(pl[i][0] + pl[i + 1][0]) / 2, (pl[i][1] + pl[i +
      1][1]) / 2]; d += `Q${f(pl[i][0])} ${f(
      pl[i][1])} ${f(m[0])} ${f(m[1])}`; } d += `L${f(pl[pl.length - 1][0])} ${f(pl[pl.length - 1][1])}`;
  const E = `<path d="${d}" fill="none" stroke="${S.edge}" stroke-width="${w +
      9}" stroke-linecap="round" stroke-linejoin="round" opacity=".55" transform="translate(0 4)"/><path d="${d}" fill="none" stroke="${S.edge}" stroke-width="${w +
      7}" stroke-linecap="round" stroke-linejoin="round"/>`,
          Fl = `<path d="${d}" fill="none" stroke="${S.fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  let o = "";
  /* hoa văn bề mặt rải theo chiều dài (nằm trong dải) */
  const seg = []; let tot = 0; for (let i = 0; i < pl.length - 1; i++) { const l = Math.hypot(pl[i + 1][0] - pl[i][0], pl[i + 1][1] - pl[i][1]); seg.push(l); tot += l; }
  const at = t => { let a = t * tot, i = 0; while (i < seg.length - 1 && a > seg[i]) { a -= seg[i]; i++; } const k = seg[i] ? a / seg[i] : 0,
      nx = pl[i + 1][0] - pl[i][0], ny = pl[i +
      1][1] - pl[i][1], L2 = Math.hypot(nx, ny) || 1; return [pl[i][0] + nx * k, pl[i][1] + ny * k, -ny / L2, nx / L2]; };
  const cnt = Math.round(tot / ({ dirt: 14, gravel: 5, cobble: 15, slab: 40, brick: 26 }[S.mark])), hw = w * .5 - 5;
  if (S.mark === "slab") { for (let i = 1; i < cnt; i++) { const [x, y, nx, ny] = at(i / cnt); o += `<path d="M${f(x - nx * hw)} ${f(
      y - ny * hw)}L${f(x + nx * hw)} ${f(y +
      ny * hw)}" stroke="#9A968E" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>`; } o += `<path d="${d}" fill="none" stroke="#fff" stroke-width="${Math.max(4,
      w - 26)}" stroke-linecap="round" stroke-linejoin="round" opacity=".18"/>`; }
  else for (let i = 0; i < cnt; i++) { const [x, y, nx, ny] = at(r()), off = (r() * 2 - 1) * hw, px = x + nx * off, py = y + ny * off;
    if (S.mark === "gravel") o += ell(px, py, 1.8 + r() * 2.6, 1.2 + r() * 1.6, ["#B9B5AC", "#F2EFE8", "#9C988F", "#C9C5BB"][i % 4], null);
    else if (S.mark === "dirt") o += i % 3 ? ell(px, py, 2 + r() * 3, 1.2 + r() * 1.4, "#8A5A2E", null).replace("/>", ' opacity=".55"/>') : ell(px,
        py, 2.6, 1.8, "#D6AE80", null);
    else if (S.mark === "cobble") { const rx = 7 + r() * 5; o += ell(px, py + 1.4, rx, rx * .55, "#7E7A72", null) + ell(px, py, rx, rx * .55,
        "#CFCBC2", "#8F8B83", 1.6) + ell(px - rx * .3,
        py - rx * .2, rx * .35, rx * .16, "#fff", null).replace("/>", ' opacity=".7"/>'); }
    else if (S.mark === "brick") o += `<rect x="${f(px - 8)}" y="${f(py - 3)}" width="16" height="6" rx="1.6" fill="#E48A5C" stroke="#8E3E1B" stroke-width="1.4"/>`; }
  return part === "e" ? E : part === "f" ? Fl : part === "t" ? o : E + Fl + o;
}
/* gộp nhiều dải thành MỘT mảng liền: vẽ tất cả viền trước, rồi tất cả nền, rồi hoa văn → chỗ giao nhau không có viền cắt, không dải nào đè lên dải khác */
function pathNet(list, style) { return list.map((q, i) => pathPatch(q[0], q[1], style, q[2] || i + 1, "e")).join("") + list.map((q, i) => pathPatch(
    q[0], q[1], style, q[2] || i + 1,
    "f")).join("") + list.map((q, i) => pathPatch(q[0], q[1], style, q[2] || i + 1, "t")).join(""); }
const FENCES = { tre: "Rào tre", go: "Rào gỗ", trang: "Rào gỗ trắng", da: "Tường đá", bui: "Hàng rào cây", sat: "Rào sắt" };
function fenceRun(gx, gy, dir, n, style) {
  const A = P(gx, gy), st = dir === "x" ? [TW / 2, TH / 2] : [-TW / 2, TH / 2], B = [A[0] + st[0] * n, A[1] + st[1] * n];
  const rail = (h, col, wd) => `<path d="M${f(A[0])} ${f(A[1] - h)}L${f(B[0])} ${f(B[1] - h)}" stroke="${col[2]}" stroke-width="${wd +
      4}" stroke-linecap="round"/><path d="M${f(A[0])} ${f(
      A[1] - h)}L${f(B[0])} ${f(B[1] - h)}" stroke="${col[0]}" stroke-width="${wd}" stroke-linecap="round"/>`;
  const posts = (cnt, fn) => { let o = ""; for (let i = 0; i <= cnt; i++) o += fn(A[0] + (B[0] - A[0]) * i / cnt, A[1] + (B[1] - A[1]) * i / cnt, i); return o; };
  let o = "";
  if (style === "da") {
    const th = .28, F = dir === "x" ? P(gx + n, gy + th) : P(gx + th, gy + n), a = dir === "x" ? n : th, b = dir === "x" ? th : n, H = 32;
    const bx = box(F, a, b, H, { l: "url(#gStoneL)", r: "url(#gStoneR)", t: "#E4E0D8", s: "#7E7A72", sw: 2.4 }); o += bx.svg;
    const cnt = Math.round(n * 3); for (let k = 1; k < cnt; k++) { const t = k / cnt, p = dir === "x" ? lerp(bx.L, bx.F, t) : lerp(bx.F, bx.R, t);
        o += `<path d="M${f(p[0])} ${f(p[1])}V${f(
        p[1] - H)}" stroke="#8E8A82" stroke-width="1.8" opacity=".55"/>`; }
    const e = dir === "x" ? [bx.L, bx.F] : [bx.F, bx.R]; o += `<path d="M${f(e[0][0])} ${f(e[0][1] - H / 2)}L${f(e[1][0])} ${f(
        e[1][1] - H / 2)}" stroke="#8E8A82" stroke-width="1.8" fill="none" opacity=".6"/>`;
  } else if (style === "bui") {
    const cnt = Math.round(n * 3.2); for (let i = 0; i <= cnt; i++) { const x = A[0] + (B[0] - A[0]) * i / cnt, y = A[1] + (B[1] - A[1]) * i / cnt;
        o += G(x, y, ell(0, -16, 22, 17,
        "url(#gLeaf)", C.leafD, 2.6) + ell(-5, -24, 8, 4.6, "#C3F294", null).replace("/>", ' opacity=".45"/>') + (i % 3 === 0 ? flowerBit(7, -18,
            "#FFD24D") + flowerBit(-8, -12, "#fff") :
        i % 3 === 1 ? flowerBit(-6, -22, "#FF8FB0") : "")); }
  } else if (style === "trang") {
    o += rail(10, ["#FFFFFF", "#D9D5CC", "#9A968E"], 5) + rail(26, ["#FFFFFF", "#D9D5CC", "#9A968E"], 5);
    o += posts(Math.round(n * 4), (x, y) => `<g transform="translate(${f(x)} ${f(
        y)})"><path d="M-4.4 2V-34L0 -42L4.4 -34V2Z" fill="#fff" stroke="#9A968E" stroke-width="2.2" stroke-linejoin="round"/></g>`);
  } else if (style === "sat") {
    o += rail(8, ["#4A4F5C", "#2A2D36", "#14161C"], 4) + rail(34, ["#4A4F5C", "#2A2D36", "#14161C"], 4);
    o += posts(Math.round(n * 5), (x, y, i) => `<g transform="translate(${f(x)} ${f(y)})"><path d="M0 2V-40" stroke="#14161C" stroke-width="${i % 5 === 0 ? 6 :
        3}" stroke-linecap="round"/>${i % 5 === 0 ? ell(0, -44, 5, 5, "#C9A23A", "#7A5E14", 1.6) : `<path d="M-3 -40L0 -48L3 -40Z" fill="#14161C"/>`}</g>`);
  } else {
    const col = style === "tre" ? ["#EBDDA0", "#C9B466", "#7F6C28"] : [C.wood1, C.wood2, C.woodD];
    o += rail(14, col, 4.4) + rail(28, col, 4.4);
    o += posts(Math.round(n * 1.6), (x, y) => `<g transform="translate(${f(x)} ${f(y)})"><rect x="-4.4" y="-40" width="8.8" height="42" rx="${style === "tre" ? 4.4 :
        2}" fill="${col[0]}" stroke="${col[2]}" stroke-width="2.4"/>${style === "tre" ? `<path d="M-4.4 -26H4.4M-4.4 -12H4.4" stroke="${col[2]}" stroke-width="2"/>` :
        `<path d="M-6 -40L0 -48L6 -40Z" fill="${col[1]}" stroke="${col[2]}" stroke-width="2.4" stroke-linejoin="round"/>`}</g>`);
  }
  return { d: (A[1] + B[1]) / 2 + 14, svg: o };
}

/* ---------- ghép cảnh ---------- */
function defs() {
  const lg = (id, a, b, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 :
      0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  return `<defs>${lg("gLeaf", "#9BE665", "#4FA83B", 1)}${lg("gPine", "#4FB36A", "#1E7A44", 1)}${lg("gWood", "#D6A066", "#9A6532", 1)}${lg("gSoil",
      "#A8703F", "#7B4A28", 1)}${lg("gStone",
      "#E6E3DC", "#B5B1A8", 1)}${lg("gStoneL", "#D6D3CC", "#A8A59E", 1)}${lg("gStoneR", "#C2BFB7", "#8F8B83", 1)}${lg("gWheat", "#FFE08A", "#E8B83A",
          1)}${lg("gWater", "#8FDCF7", "#3FA3D9",
      1)}${lg("gWall", "#FFFFFF", "#E4D8C4", 0)}${lg("gStraw", "#F0CB62", "#D9A93A", 1)}${lg("gTile3", "#EE8A56", "#C95A2B", 1)}${lg("gTile4",
          "#F06A52", "#B23A2A", 1)}${lg("gLeafRoof",
      "#7FD35F", "#3F9A3A", 1)}${lg("gLeafRoof2", "#6BC653", "#2F8A36",
      1)}
<radialGradient id="gGrass" cx=".5" cy=".4" r=".85"><stop offset="0" stop-color="#9AD95A"/><stop offset=".7" stop-color="#7FC448"/><stop offset="1" stop-color="#69AE3C"/></radialGradient><radialGradient id="gGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A0" stop-opacity=".95"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient>
<linearGradient id="gGray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9C6BF"/><stop offset="1" stop-color="#A29E96"/></linearGradient><linearGradient id="gSkyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3FF"/><stop offset="1" stop-color="#E9F8FF"/></linearGradient></defs>`;
}
const STYLE = `<style>.npa-spin{transform-box:fill-box;transform-origin:50% 50%;animation:npa-spin 14s linear infinite}.npa-hover{animation:npa-hover 3s ease-in-out infinite}@keyframes npa-spin{to{transform:rotate(360deg)}}@keyframes npa-hover{0%,100%{transform:translate(0,0)}50%{transform:translate(6px,-8px)}}:root.np-playing .npa-spin,:root.np-playing .npa-hover{animation:none}@media (prefers-reduced-motion:reduce){.npa-spin,.npa-hover{animation:none!important}}</style>`;

/* cấu hình cảnh: levels = cấp của từng vị trí (0 = chưa có). time = day | dusk | night */
/* ====== BỘ VỊ TRÍ CỐ ĐỊNH, CÓ THỨ TỰ TRƯỚC SAU (để không vật nào đè lên vật khác) ======
   Thứ tự VẼ (từ dưới lên): 0 cỏ nền → 1 ao, sân → 2 lối đi (một mảng liền) → 3 đất ô trồng → 4 vật đứng (rào, công trình, cây, vật nuôi...) xếp theo độ sâu y.
   Thứ tự CHIẾM CHỖ (ai có trước thì giữ chỗ): công trình + ao + rào + lối đi (cố định) → ô trồng → cây lớn → vật nhỏ (rơm, thùng, hoa) → vật nuôi.
   Mỗi vật có VÙNG CHIẾM ĐẤT (hình elip dưới chân). Vật nào chạm vùng đã có chủ thì bị bỏ (và được báo cáo), nên không bao giờ chồng lên nhau. */
const FOOT = { bigTree: [52, 13, 1], pine: [30, 11, 1], hay: [34, 12], barrel: [20, 8], chicken: [11, 5], rabbit: [13, 5], cow: [38, 11], rock: [24,
    8], bush: [30, 9], lavender: [26, 8],
    flowerPatch: [32, 13], pumpkins: [30, 8], milkcans: [32, 9], roundHay: [32, 10], crate: [24, 8], coop: [44, 14] };
const SPRITES = { bigTree, pine, hay, barrel, chicken, rabbit, cow, rock, bush, lavender, flowerPatch, pumpkins, milkcans, roundHay, crate, coop };
const DROPPED = [], MOVED = [];

/* ---------- thêm vật nuôi (heo, cừu, vịt) + CHUỒNG THÚ ---------- */
function pig(x, y, s, flip) {
  const sc = s || 1; return G(x, y, `<g transform="scale(${flip ? -sc : sc} ${sc})">` + shadow(34, 10, .22) + [-16, 12].map(
      a => `<rect x="${a - 4}" y="-16" width="8" height="18" rx="3" fill="#F7A8C0" stroke="#C9738F" stroke-width="2.4"/>`).join("") + ell(0, -28, 28,
          18, "#FFB6CC", "#C9738F", 3) +
      `<path d="M-27 -32Q-38 -36 -34 -24Q-30 -28 -28 -26" fill="none" stroke="#C9738F" stroke-width="3" stroke-linecap="round"/>` + ell(28, -34, 13,
          12, "#FFB6CC", "#C9738F", 3) + ell(36,
      -31, 7, 5.4, "#FF8FB0", "#C9738F", 2) + ell(34, -31, 1.2, 1.6, "#8A3A58") + ell(38.5, -31, 1.2, 1.6, "#8A3A58") + ell(27, -38, 1.8, 2.2, "#3A2A24") +
      `<path d="M22 -44L18 -52L28 -47Z M33 -45L38 -52L40 -42Z" fill="#FF8FB0" stroke="#C9738F" stroke-width="2.4" stroke-linejoin="round"/></g>`);
}
function sheep(x, y, s, flip) {
  const sc = s || 1; return G(x, y, `<g transform="scale(${flip ? -sc : sc} ${sc})">` + shadow(34, 10, .22) + [-14, 12].map(
      a => `<rect x="${a - 3}" y="-14" width="6" height="16" rx="2.4" fill="#4A3F3A"/>`).join("") + [[-18, -30, 14], [-4, -36, 15], [12, -34, 14],
          [22, -26, 11], [-10, -24, 13], [6, -24,
      13]].map(([a, b, r]) => ell(a, b, r, r * .9, "#FFFFFF", "#C9C1D6", 2.4)).join("") + ell(32, -32, 10, 11, "#4A3F3A") + ell(35, -34, 1.5, 1.5,
          "#fff") + ell(26, -40, 3.4, 5, "#4A3F3A") +
      ell(18, -42, 7, 5, "#FFFFFF", "#C9C1D6", 2) + `</g>`);
}
function duck(x, y) { return G(x, y, shadow(12, 4, .2) + ell(0, -11, 11, 8, "#FFE066", "#C9A12E", 2) +
    `<path d="M-10 -12Q-18 -16 -14 -8Z" fill="#FFE066" stroke="#C9A12E" stroke-width="1.6"/>` + ell(9, -21, 6.4, 6.4, "#FFE066", "#C9A12E", 2) +
    `<path d="M14 -22L22 -20L14 -17Z" fill="#FF9A3D" stroke="#C26A12" stroke-width="1.6" stroke-linejoin="round"/>` + ell(11, -23, 1.4, 1.4, "#3A2A12") +
    `<path d="M-3 -2V4M3 -2V4" stroke="#FF9A3D" stroke-width="2.4" stroke-linecap="round"/>`); }
function stable(x, y, night) {
  const wood = "#C98F52", d = "#6B3E16"; let o = shadow(92, 18, .26);
  o += `<path d="M-74 0V-46L0 -92L74 -46V0Z" fill="${wood}" stroke="${d}" stroke-width="4" stroke-linejoin="round"/>` + [-52, -32, -12, 12, 32, 52].map(
      a => `<path d="M${a} -2V-${50 - Math.abs(a) * .5}" stroke="${d}" stroke-width="1.8" opacity=".35"/>`).join("");
  o += `<path d="M-84 -42L0 -100L84 -42L72 -33L0 -84L-72 -33Z" fill="#B24A24" stroke="#5A2410" stroke-width="4" stroke-linejoin="round"/><path d="M-60 -52L0 -90L60 -52" fill="none" stroke="#E07A4A" stroke-width="3" opacity=".6" stroke-linecap="round"/>`;
  o += `<path d="M-28 0V-34Q0 -54 28 -34V0Z" fill="#2A160A" stroke="${d}" stroke-width="3.6"/>` + (night ?
      `<path d="M-22 0V-31Q0 -47 22 -31V0Z" fill="#FFB347" opacity=".9"/><ellipse cx="0" cy="-8" rx="26" ry="9" fill="#FFE29A" opacity=".55"/>` :
      `<path d="M-22 0V-31Q0 -47 22 -31V0Z" fill="#4A2A12"/>`);
  o += `<circle cx="0" cy="-66" r="9" fill="${night ? "#FFE08A" :
      "#FFF3E0"}" stroke="${d}" stroke-width="3"/><path d="M0 -75V-57M-9 -66H9" stroke="${d}" stroke-width="2.2"/>`;
  o += `<path d="M-74 -6H-34M34 -6H74" stroke="${d}" stroke-width="5" stroke-linecap="round"/>` + [-64, -48, 48, 64].map(
      a => `<rect x="${a - 3}" y="-24" width="6" height="26" rx="2" fill="${wood}" stroke="${d}" stroke-width="2.4"/>`).join("");
  return G(x, y, o);
}
/* ===== QUY HOẠCH KHU VƯỜN (toạ độ vườn gốc 1280×880) =====
   Trái cây: 2 hàng cây ngay ngắn phía trên (TOP trong scene). Rau: bên trái. Lúa: phía dưới bên phải. Hoa: phía dưới giữa. */
const FENCE = require("./garden-fence");
const LAYOUT = require("../../learn/garden/garden-layout.js");
    /* tầng xếp chồng + thứ tự nạp mô-đun: sửa ở learn/garden/garden-layout.js */   /* kiểu hàng rào: đổi ở garden-fence.js */
const HY = -190;   /* nhà + sân được dời lên phía trên (dy) */
const PENS = [
  { n: "Chuồng gà vịt", ic: "🐔", fo: [200, 690], na: 2, nb: 2, an: [["chicken", -50, 4], ["chicken", -14, -16], ["chicken", 30, 0], ["chicken", -30,
      30], ["chicken", 26, 30], ["chicken", 0,
      10], ["duck", 56, -4], ["duck", 8, 36], ["duck", -62, 14]] },
  { n: "Chuồng heo cừu", ic: "🐖", fo: [770, 680], na: 2, nb: 2, an: [["pig", -44, 10], ["pig", -6, -10], ["pig", 36, 8], ["sheep", -24, 34], ["sheep", 30, 32]] },
  { n: "Chuồng bò", ic: "🐄", fo: [958, 330], na: 3, nb: 2, an: [["cow", -62, 0], ["cow", 34, -8], ["cow", -6, 38]] }
];
   /* các khối ô đất trồng cây ăn trái ở chỗ trống (toạ độ vườn gốc, có thể âm / lớn hơn 1280 vì cảnh mở rộng) */
const STABLE = [1040, 800];   /* chỗ chuồng thú / cửa chuồng (vật nuôi đi về đây buổi tối): khu chăn nuôi, gần kho */
/* Cây trong khu vườn cây: MỌI giống đều là ảnh rời (lớp "sprites" của trang vườn, xếp theo độ sâu y) để cây ở hàng gần người nhìn luôn đè lên cây hàng sau.
   Có PNG vẽ tay (shared/art/garden/tree/tree_<giống>.png) thì dùng PNG; chưa có thì bộ sinh tự xuất tree_<giống>.svg từ bigTree (không bóng: bóng do trang vẽ). */
const SPRITE_KINDS = new Set(["mango", "orange", "apple", "pear", "peach", "pomelo", "litchi", "plum"]), TREE_PNG = new Set(["mango"]);
const TREEPOS = [];
const ANIM = [];
const HOT = [];   /* vị trí các ô trồng của cảnh vừa sinh (để trang tương tác đặt vùng rê/bấm) */

  SP.U0 = U0; SP.PATHS = PATHS; SP.pathPatch = pathPatch; SP.pathNet = pathNet; SP.FENCES = FENCES; SP.fenceRun = fenceRun; SP.defs = defs;
  SP.STYLE = STYLE; SP.FOOT = FOOT; SP.SPRITES = SPRITES; SP.DROPPED = DROPPED; SP.MOVED = MOVED; SP.pig = pig; SP.sheep = sheep; SP.duck = duck;
  SP.stable = stable; SP.FENCE = FENCE; SP.HY = HY; SP.PENS = PENS; SP.STABLE = STABLE; SP.SPRITE_KINDS = SPRITE_KINDS; SP.TREE_PNG = TREE_PNG;
  SP.TREEPOS = TREEPOS; SP.ANIM = ANIM; SP.HOT = HOT;
};
