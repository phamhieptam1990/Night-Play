/* Cảnh vườn Học Vui — vật nhỏ, cây, ô đất, cây trồng, hàng rào.
   Một phần của scripts/learn/gen-scene-art.js (nạp bằng require, dùng đối tượng chung SP). */
"use strict";
module.exports = function (SP) {
  var C = SP.C, G = SP.G, P = SP.P, box = SP.box, ell = SP.ell, f = SP.f, lerp = SP.lerp, poly = SP.poly, rng = SP.rng, shadow = SP.shadow;

/* ---------- vật nhỏ ---------- */
const tuft = (x, y, s) => `<g transform="translate(${f(x)} ${f(
    y)}) scale(${s})"><path d="M-6 0L-9 -12M0 0L0 -15M6 0L9 -12" stroke="#5AA838" stroke-width="3" stroke-linecap="round" fill="none"/></g>`;
const flower = (x, y, col) => `<g transform="translate(${f(x)} ${f(y)})"><path d="M0 0V8" stroke="#4E9B34" stroke-width="2"/>${ell(0, -2, 5, 3.4, col,
    "#fff", 1.4)}${ell(0, -2, 1.8, 1.2, "#FFC94A")}</g>`;
function rock(x, y, s) { return G(x, y, shadow(26 * s, 8 * s, .2) +
    `<path d="M${-22 * s} 0C${-24 * s} ${-14 * s} ${-8 * s} ${-26 * s} ${6 * s} ${-22 * s}C${22 * s} ${-20 * s} ${28 * s} ${-6 * s} ${22 * s} 0Z" fill="#B9B6AE" stroke="${C.stoneD}" stroke-width="3" stroke-linejoin="round"/><path d="M${-14 * s} ${-12 * s}C${-8 * s} ${-20 * s} ${4 * s} ${-20 * s} ${8 * s} ${-16 * s}" fill="none" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>`);
    }
function bush(x, y, s, col) { const c = col || [C.leaf1, C.leaf2]; return G(x, y, shadow(30 * s, 9 * s, .2) + [[-16, -14, 16], [10, -16, 18], [-2,
    -26, 18], [20, -6, 12]].map(([a, b,
    r]) => ell(a * s, b * s, r * s, r * s * .9, c[1], C.leafD, 2.4)).join("") + ell(-4 * s, -30 * s, 9 * s, 6 * s, c[0], null).replace("/>", ' opacity=".7"/>')); }
function lavender(x, y, s) { let o = ""; const r = rng(Math.floor(x * 7 + y)); for (let i = 0; i < 9; i++) { const a = (i - 4) * 7 * s + (r(
    ) - .5) * 5, h = (20 + r() * 12) * s;
    o += `<path d="M${f(a)} 0C${f(a)} ${-h * .5} ${f(a + 3)} ${-h * .7} ${f(a +
        2)} ${-h}" stroke="#4E9B34" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + ell(a + 2, -h - 5 * s,
    3.4 * s, 9 * s, i % 2 ? "#9B7BE0" : "#B79CF0", "#6F4FC0", 1.6); } return G(x, y, o); }
function hay(x, y) { const b = box([0, 0], .8, .6, 22, { l: "#F0C95A", r: "#D6A83A", t: "#F8DD86", s: "#8E6A14", sw: 2.4 }); const lines = [-6,
    -12].map(k => `<path d="M${f(b.L[0])} ${f(
    b.L[1] - 22 - k)}L${f(b.F[0])} ${f(b.F[1] - 22 - k)}L${f(b.R[0])} ${f(
        b.R[1] - 22 - k)}" stroke="#A97C1C" stroke-width="2" fill="none" opacity=".6"/>`).join(""); return G(x, y, shadow(
    34, 10, .22) + b.svg + lines); }
function barrel(x, y, s) { return G(x, y, shadow(20 * s, 7 * s, .22) +
    `<path d="M${-14 * s} ${-4 * s}C${-18 * s} ${-18 * s} ${-18 * s} ${-30 * s} ${-14 * s} ${-42 * s}H${14 * s}C${18 * s} ${-30 * s} ${18 * s} ${-18 * s} ${14 * s} ${-4 * s}C${6 * s} 6 ${-6 * s} 6 ${-14 * s} ${-4 * s}Z" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="3" stroke-linejoin="round"/>` +
    ell(0, -42 * s, 14 * s, 6 * s, "#D6A066", C.woodD, 3) + [-14, -26].map(k => `<path d="M${-16.5 * s} ${k * s}C-6 ${(k + 7) * s} 6 ${(k +
    7) * s} ${16.5 * s} ${k * s}" stroke="#6B6459" stroke-width="3.4" fill="none"/>`).join("")); }
function chicken(x, y) { return G(x, y, shadow(12, 4, .2) + ell(0, -12, 11, 9, "#fff", "#C9C1B2", 2) + ell(8, -22, 6, 6, "#fff", "#C9C1B2", 2) +
    `<path d="M6 -29Q8 -35 11 -29Q13 -33 14 -28Z" fill="#E5484D"/><path d="M14 -22L21 -20L14 -18Z" fill="#F5A623"/>` + ell(10, -23, 1.4, 1.4, "#3A2A12") +
    `<path d="M-2 -2V4M3 -2V4" stroke="#F5A623" stroke-width="2.4" stroke-linecap="round"/>`); }
function rabbit(x, y) { return G(x, y, shadow(14, 4.6, .2) + ell(0, -11, 11, 9, "#fff", "#CFC6D6", 2) + ell(8, -20, 7, 6.4, "#fff", "#CFC6D6", 2) +
    ell(6, -32, 2.6, 8, "#fff", "#CFC6D6",
    2) + ell(12, -31, 2.6, 8, "#fff", "#CFC6D6", 2) + ell(6, -32, 1, 5, "#FFB3C1") + ell(11, -22, 1.3, 1.3, "#3A2A12") + ell(-11, -9, 3.6, 3.6,
        "#fff", "#CFC6D6", 1.6)); }
function bee(x, y, d) { return `<g class="npa npa-hover" style="animation-delay:${d}s"><g transform="translate(${x} ${y})">${ell(-6, -5, 5, 3.4,
    "#fff", "#BFD9F2", 1.2).replace("/>",
    ' opacity=".85"/>')}${ell(0, 0, 8, 6.4, "#FFD24D", "#C9840F", 1.8)}<path d="M-3 -6V6M3 -6V6" stroke="#3A2A12" stroke-width="2.4"/>${ell(7, -1,
        1.2, 1.2, "#3A2A12")}</g></g>`; }
function butterfly(x, y, d, col) {
    return `<g class="npa npa-hover" style="animation-delay:${d}s"><g transform="translate(${x} ${y})"><path d="M0 0C-6 -12 -18 -10 -16 -2C-14 4 -6 4 0 0Z M0 0C6 -12 18 -10 16 -2C14 4 6 4 0 0Z" fill="${col ||
    "#FF8FB0"}" stroke="#B5305F" stroke-width="1.6"/>${ell(0, 0, 1.8, 6, "#3A1E36")}</g></g>`; }

/* ---------- cây ---------- */
function bigTree(x, y, s, kind) {
  const r = rng(Math.floor(x * 13 + y * 7)); let canopy = "";
  /* tán dày kiểu vườn cây miền Tây: 3 lớp lá (tối → vừa → sáng), nhiều chùm lá nhỏ, quả to có điểm sáng */
  const LT = { mango: ["#2F7D3A", "#4DA844", "#8ED65A"], apple: ["#3E8F3A", "#5FBA47", "#A2E36B"], orange: ["#2F8A3A", "#4FB040", "#94DB5C"], pear:
      ["#4C9A3A", "#7CC650", "#BEEA7C"], peach:
      ["#3E9A4A", "#68C45A", "#B0EC8A"], pomelo: ["#4A9A3A", "#78C348", "#BFE878"], litchi: ["#28793A", "#3F9A48", "#7FCF6A"], plum: ["#3A7F4E",
          "#5AA860", "#9AD688"] }[kind] || ["#3F8F36",
      "#5FB43F", "#A6E26E"];
  const blobs = [[-34, -84, 36], [32, -88, 38], [0, -122, 40], [-48, -58, 28], [48, -60, 30], [0, -84, 44], [-18, -106, 30], [22, -104, 32]];
  blobs.forEach(([a, b2, rr]) => canopy += ell(a, b2 + 5, rr * 1.04, rr * .94, LT[0], C.leafD, 3));
  blobs.forEach(([a, b2, rr]) => canopy += ell(a - 2, b2 - 1, rr * .86, rr * .78, LT[1], null));
  [[-26, -96, 20], [22, -100, 22], [-2, -128, 22], [-40, -66, 15], [40, -70, 16], [8, -90, 20]].forEach(([a, b2, rr]) => canopy += ell(a - 4, b2 - 4,
      rr, rr * .8, LT[2], null).replace("/>", ' opacity=".8"/>'));
  for (let i = 0; i < 34; i++) { const lx = (r() - .5) * 104, ly = -52 - r() * 86, rot = Math.floor(r() * 180), lit = r() < .5; canopy += `<ellipse cx="${f(lx)}" cy="${f(
      ly)}" rx="7.5" ry="3.2" transform="rotate(${rot} ${f(lx)} ${f(ly)})" fill="${lit ? LT[2] : LT[0]}" opacity="${lit ? .75 : .55}"/>`; }
  const FR = { apple: ["#E5484D", "#9E1B28"], orange: ["#FFA62B", "#B9650A"], pear: ["#D9E35A", "#8E9A1E"], peach: ["#FF9DB0", "#C2506A"], mango:
      ["#FFC23A", "#C28A0A"], pomelo: ["#C9E36A",
      "#7E9A2B"], litchi: ["#FF5D6C", "#B3243A"], plum: ["#9A6AE0", "#52309A"] }[kind];
  if (FR) for (let i = 0; i < 17; i++) { const a = (r() - .5) * 108, b2 = -54 - r() * 76, q = 6.8 + r() * 1.6; canopy += ell(a, b2 + 1.5, q, q, FR[1],
      null) + ell(a, b2, q, q, FR[0], FR[1],
      1.6) + ell(a - q * .32, b2 - q * .34, q * .3, q * .24, "#fff").replace("/>", ' opacity=".85"/>') + `<path d="M${f(a)} ${f(
      b2 - q)}q3 -4 7 -3q-2 4 -7 3z" fill="${LT[1]}" stroke="${LT[0]}" stroke-width="1"/>`; }
  return G(x, y, `<g transform="scale(${s})">` + shadow(64, 18, .24) +
      `<path d="M-12 0C-8 -20 -10 -40 -8 -64H8C10 -40 8 -20 12 0C4 5 -4 5 -12 0Z" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="3" stroke-linejoin="round"/>` +
          canopy + `</g>`);
}
function pine(x, y, s) { let t = ""; [[0, 54, 64], [-4, 90, 52], [-8, 124, 40]].forEach(([a, b, w]) => t += `<path d="M${-w} ${-b + 30}C${-w * .5} ${-b +
    28} ${-w * .3} ${-b - 6} 0 ${-b - 34}C${w * .3} ${-b - 6} ${w * .5} ${-b + 28} ${w} ${-b + 30}C${w * .4} ${-b + 40} ${-w * .4} ${-b + 40} ${-w} ${-b +
    30}Z" fill="url(#gPine)" stroke="#1E5A33" stroke-width="3" stroke-linejoin="round"/>`); return G(x, y, `<g transform="scale(${s})">` + shadow(48, 14, .24) +
    `<rect x="-8" y="-34" width="16" height="36" rx="4" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="3"/>` + t + `</g>`); }

/* ---------- đường đá, ô trồng, rào ---------- */
function pathCell(gx, gy) {
  const r = rng(gx * 31 + gy * 17 + 5), c = P(gx + .5, gy + .5); let o = "";
  for (let i = 0; i < 5; i++) { const a = (r() - .5) * 70, b = (r() - .5) * 28, rx = 16 + r() * 9, ry = rx * .5; o += ell(c[0] + a, c[1] + b + 2, rx,
      ry, "#8F8B83", null) + ell(c[0] + a,
      c[1] + b, rx, ry, "url(#gStone)", "#807C74", 2.2) + `<path d="M${f(c[0] + a - rx * .5)} ${f(c[1] + b - ry * .3)}Q${f(c[0] + a)} ${f(c[1] +
          b - ry * .7)} ${f(c[0] + a + rx * .4)} ${f(
      c[1] + b - ry * .4)}" stroke="#fff" stroke-width="2.4" fill="none" opacity=".65" stroke-linecap="round"/>`; }
  return { d: gx + gy + .2, svg: o };
}
function plotCell(gx, gy, crop, ripe, lvl) {
  const A = P(gx, gy), B = P(gx + 1, gy), Cc = P(gx + 1, gy + 1), D = P(gx, gy + 1), ctr = P(gx + .5, gy + .5);
  let o = poly([A, B, Cc, D], "url(#gSoil)", lvl >= 3 ? "#7A4B24" : C.soilD, lvl >= 3 ? 7 : 3);
  for (let k = 1; k < 5; k++) o += `<path d="M${f(lerp(A, D, k / 5)[0])} ${f(lerp(A, D, k / 5)[1])}L${f(lerp(B, Cc, k / 5)[0])} ${f(lerp(B, Cc,
      k / 5)[1])}" stroke="${C.soilD}" stroke-width="2.6" opacity=".45" stroke-linecap="round"/>`;
  if (lvl >= 3) o += poly([A, B, Cc, D], "none", "#C58B4E", 3);
  let cr = "";
  for (let k = 0; k < 4; k++) for (let m = 0; m < 4; m++) { const p = lerp(lerp(A, D, (k + .5) / 4), lerp(B, Cc, (k + .5) / 4), (m + .5) / 4);
      cr += crop(p[0], p[1] + 8, ripe); }
  return { d: gx + gy + .3, svg: o, front: cr, fd: gx + gy + .7 };
}
const cropWheat = (x, y, ripe) => { let s = ""; for (let i = -1; i <= 1; i++) { const h = 26 + (i === 0 ? 4 : 0);
    s += `<path d="M${i * 4} 0L${i * 5} ${-h}" stroke="${ripe ? "#C9A12E" :
    "#4E9B34"}" stroke-width="2.4" stroke-linecap="round"/>` + ell(i * 5, -h - 4, 3, 8, ripe ? "url(#gWheat)" : "#7BC24A", ripe ? "#A9801A" :
        "#2F7A2F", 1.4); } return G(x, y, s); };
const cropCarrot = (x, y, ripe) => G(x, y,
    `<path d="M-6 0Q-9 -14 -12 -18M0 0Q0 -18 0 -22M6 0Q9 -14 12 -18" stroke="#3FA83B" stroke-width="3.4" fill="none" stroke-linecap="round"/>` + (
    ripe ? ell(0, 1, 7, 3.6, "#F2701C", "#B84E0E", 1.6) : ""));
const cropStraw = (x, y, ripe) => G(x, y, ell(-7, -6, 8, 6, "#4FA83B", "#2F7A2F", 1.6) + ell(7, -6, 8, 6, "#4FA83B", "#2F7A2F", 1.6) + ell(0, -11, 8,
    6, "#6FCB55", "#2F7A2F", 1.6) + (ripe ?
    ell(-2, -3, 4.6, 5.4, "#E5484D", "#9E1B28", 1.4) + ell(6, -2, 4, 4.8, "#E5484D", "#9E1B28", 1.4) : ""));
const cropTomato = (x, y, ripe) => G(x, y, `<path d="M0 0V-24" stroke="#3FA83B" stroke-width="3" stroke-linecap="round"/>` + ell(-6, -16, 6, 4,
    "#4FA83B", "#2F7A2F", 1.4) + ell(6, -20, 6, 4,
    "#4FA83B", "#2F7A2F", 1.4) + (ripe ? ell(-5, -9, 5.2, 5.2, "#E5322D", "#A81F1B", 1.4) + ell(6, -12, 5, 5, "#E5322D", "#A81F1B", 1.4) : ell(-5, -9,
        4, 4, "#A8D872", "#6E9B3C", 1.2)));
const cropCorn = (x, y, ripe) => G(x, y,
    `<path d="M0 0V-34" stroke="#3FA83B" stroke-width="4" stroke-linecap="round"/><path d="M0 -10Q-12 -18 -16 -30M0 -16Q12 -24 16 -34" stroke="#4FA83B" stroke-width="4" fill="none" stroke-linecap="round"/>` +
    (ripe ? ell(5, -18, 3.6, 8, "#FFD43B", "#B88400", 1.4) : ""));
const cropSun = (x, y, ripe) => G(x, y, `<path d="M0 0V-26" stroke="#3FA83B" stroke-width="3.4" stroke-linecap="round"/>` + (ripe ? Array.from({
    length: 8 }, (_, i) => ell(0, -34, 3, 6,
    "#FFD43B", "#B36B00", 1).replace("/>", ` transform="rotate(${i * 45} 0 -30)"/>`)).join("") + ell(0, -30, 5.4, 5.4, "#6B4426", "#3A2412", 1.4) :
        ell(0, -28, 4, 5, "#6FCB55", "#2F7A2F",
    1.4)));

function fence(gx, gy, dir, lvl) {   /* dir "x" = dọc theo gx (xuống-phải), "y" = dọc theo gy (xuống-trái) */
  const A = dir === "x" ? P(gx, gy) : P(gx, gy), B = dir === "x" ? P(gx + 1, gy) : P(gx, gy + 1), d = dir === "x" ? gx + gy + .5 : gx + gy + .5;
  let o = "";
  if (lvl >= 3) { /* tường đá thấp */
    const thick = .28, F = dir === "x" ? P(gx + 1, gy + thick) : P(gx + thick, gy + 1), a = dir === "x" ? 1 : thick, b = dir === "x" ? thick : 1;
    const bx = box(F, a, b, 30, { l: "url(#gStoneL)", r: "url(#gStoneR)", t: "#E4E0D8", s: "#7E7A72", sw: 2.4 }); o += bx.svg;
    for (let k = 1; k < 4; k++) { const t = k / 4; const p = lerp(bx.L, bx.F, t), q = lerp(bx.F, bx.R, t); o += `<path d="M${f(p[0])} ${f(p[1])}V${f(
        p[1] - 30)}" stroke="#8E8A82" stroke-width="1.8" opacity=".6"/><path d="M${f(q[0])} ${f(q[1])}V${f(
            q[1] - 30)}" stroke="#8E8A82" stroke-width="1.8" opacity=".6"/>`; }
    o += `<path d="M${f(bx.L[0])} ${f(bx.L[1] - 15)}L${f(bx.F[0])} ${f(bx.F[1] - 15)}L${f(bx.R[0])} ${f(
        bx.R[1] - 15)}" stroke="#8E8A82" stroke-width="1.8" fill="none" opacity=".6"/>`;
    return { d, svg: o };
  }
  const col = lvl === 1 ? ["#E0D090", "#B9A257", "#7F6C28"] : [C.wood1, C.wood2, C.woodD];
  const post = (p) => `<g transform="translate(${f(p[0])} ${f(p[1])})"><rect x="-4.4" y="-40" width="8.8" height="42" rx="${lvl === 1 ? 4.4 :
      2}" fill="${col[0]}" stroke="${col[2]}" stroke-width="2.4"/>${lvl === 1 ? `<path d="M-4.4 -26H4.4M-4.4 -12H4.4" stroke="${col[2]}" stroke-width="2"/>` :
      `<path d="M-6 -40L0 -48L6 -40Z" fill="${col[1]}" stroke="${col[2]}" stroke-width="2.4" stroke-linejoin="round"/>`}</g>`;
  const rail = (y) => `<path d="M${f(A[0])} ${f(A[1] - y)}L${f(B[0])} ${f(
      B[1] - y)}" stroke="${col[2]}" stroke-width="8" stroke-linecap="round"/><path d="M${f(A[0])} ${f(A[1] - y)}L${f(
      B[0])} ${f(B[1] - y)}" stroke="${col[0]}" stroke-width="4.4" stroke-linecap="round"/>`;
  o += rail(14) + rail(28) + post(A) + post(B);
  return { d, svg: o };
}

  SP.tuft = tuft; SP.flower = flower; SP.rock = rock; SP.bush = bush; SP.lavender = lavender; SP.hay = hay; SP.barrel = barrel;
  SP.chicken = chicken; SP.rabbit = rabbit; SP.bee = bee; SP.butterfly = butterfly; SP.bigTree = bigTree; SP.pine = pine; SP.cropWheat = cropWheat;
  SP.cropCarrot = cropCarrot; SP.cropStraw = cropStraw; SP.cropTomato = cropTomato; SP.cropCorn = cropCorn; SP.cropSun = cropSun; SP.fence = fence;
};
