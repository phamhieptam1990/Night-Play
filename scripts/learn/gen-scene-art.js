/* Sinh CẢNH KHU VƯỜN Học Vui (góc nhìn chéo isometric, phong cách POP "đồ chơi mềm") để chủ site duyệt. Xem plan-learn-garden.md mục 2d.
   Chạy: node scripts/learn/gen-scene-art.js  → shared/art/garden/scene/*.svg + shared/art/garden/preview-scene.html (10 ảnh duyệt)
   Mỗi vật là một hàm vẽ (nhà, rào, giếng, kho, cối xay, cây, ruộng, ao...) có CẤP ĐỘ (level) để sau này bé đạt gì thì nâng cấp đúng vị trí đó:
   nhà lá → nhà tranh → nhà tường → nhà ngói; rào tre → rào gỗ → tường đá...  Không filter/ảnh/script; hoạt ảnh chỉ transform/opacity (npa-*).
   KHÔNG sửa tay tệp sinh ra. */
"use strict";
const fs = require("fs"), path = require("path");
const out = path.join(__dirname, "../../shared/art/garden/scene");
fs.mkdirSync(out, { recursive: true });

const W = 1280, H = 880, TW = 104, TH = 52, OX = 640, OY = 96;
const f = n => Math.round(n * 10) / 10;
const P = (gx, gy) => [OX + (gx - gy) * TW / 2, OY + (gx + gy) * TH / 2];
const pts = a => a.map(p => f(p[0]) + "," + f(p[1])).join(" ");
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const G = (x, y, inner, cls) => `<g${cls ? ` class="${cls}"` : ""} transform="translate(${f(x)} ${f(y)})">${inner}</g>`;
const poly = (p, fill, stroke, sw) => `<polygon points="${pts(p)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw || 3}" stroke-linejoin="round"` : ""}/>`;
const ell = (cx, cy, rx, ry, fill, stroke, sw) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw || 3}"` : ""}/>`;
const shadow = (rx, ry, o) => ell(0, 0, rx, ry, "#1F5A22", null, 0).replace("/>", ` opacity="${o || .22}"/>`);

/* hộp isometric: F = đỉnh trước (thấp nhất) của chân, a = số ô theo gx, b = số ô theo gy, h = cao. Trả về {svg, pts} */
function box(F, a, b, h, c) {
  const L = [F[0] - a * TW / 2, F[1] - a * TH / 2], R = [F[0] + b * TW / 2, F[1] - b * TH / 2], B = [L[0] + R[0] - F[0], L[1] + R[1] - F[1]];
  const up = p => [p[0], p[1] - h];
  const sv = poly([F, L, up(L), up(F)], c.l, c.s, c.sw) + poly([F, R, up(R), up(F)], c.r, c.s, c.sw) + (c.t ? poly([up(F), up(L), up(B), up(R)], c.t, c.s, c.sw) : "");
  return { svg: sv, F, L, R, B, up };
}
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/* ---------- bảng màu chung ---------- */
const C = {
  grassA: "#86CC4E", grassB: "#79C044", grassD: "#5FA63A", edge: "#3F7A2B", soil1: "#A8703F", soil2: "#7B4A28", soilD: "#53321A",
  wood1: "#C58B4E", wood2: "#9A6532", woodD: "#5E3A1B", stone1: "#D6D3CC", stone2: "#A8A59E", stoneD: "#6E6A63", leaf1: "#8EDB5A", leaf2: "#4FA83B", leafD: "#2F7A2F",
  roofRed1: "#E0553E", roofRed2: "#B23A2A", roofRedD: "#7E2418", wall: "#F6EFE3", wallS: "#E4D8C4", wallD: "#9C8B72", straw1: "#F0CB62", straw2: "#D9A93A", strawD: "#9A7016",
  water1: "#7FD3F2", water2: "#3FA3D9", waterD: "#2B73A6"
};

/* ---------- vật nhỏ ---------- */
const tuft = (x, y, s) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><path d="M-6 0L-9 -12M0 0L0 -15M6 0L9 -12" stroke="#5AA838" stroke-width="3" stroke-linecap="round" fill="none"/></g>`;
const flower = (x, y, col) => `<g transform="translate(${f(x)} ${f(y)})"><path d="M0 0V8" stroke="#4E9B34" stroke-width="2"/>${ell(0, -2, 5, 3.4, col, "#fff", 1.4)}${ell(0, -2, 1.8, 1.2, "#FFC94A")}</g>`;
function rock(x, y, s) { return G(x, y, shadow(26 * s, 8 * s, .2) + `<path d="M${-22 * s} 0C${-24 * s} ${-14 * s} ${-8 * s} ${-26 * s} ${6 * s} ${-22 * s}C${22 * s} ${-20 * s} ${28 * s} ${-6 * s} ${22 * s} 0Z" fill="#B9B6AE" stroke="${C.stoneD}" stroke-width="3" stroke-linejoin="round"/><path d="M${-14 * s} ${-12 * s}C${-8 * s} ${-20 * s} ${4 * s} ${-20 * s} ${8 * s} ${-16 * s}" fill="none" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>`); }
function bush(x, y, s, col) { const c = col || [C.leaf1, C.leaf2]; return G(x, y, shadow(30 * s, 9 * s, .2) + [[-16, -14, 16], [10, -16, 18], [-2, -26, 18], [20, -6, 12]].map(([a, b, r]) => ell(a * s, b * s, r * s, r * s * .9, c[1], C.leafD, 2.4)).join("") + ell(-4 * s, -30 * s, 9 * s, 6 * s, c[0], null).replace("/>", ' opacity=".7"/>')); }
function lavender(x, y, s) { let o = ""; const r = rng(Math.floor(x * 7 + y)); for (let i = 0; i < 9; i++) { const a = (i - 4) * 7 * s + (r() - .5) * 5, h = (20 + r() * 12) * s; o += `<path d="M${f(a)} 0C${f(a)} ${-h * .5} ${f(a + 3)} ${-h * .7} ${f(a + 2)} ${-h}" stroke="#4E9B34" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + ell(a + 2, -h - 5 * s, 3.4 * s, 9 * s, i % 2 ? "#9B7BE0" : "#B79CF0", "#6F4FC0", 1.6); } return G(x, y, o); }
function hay(x, y) { const b = box([0, 0], .8, .6, 22, { l: "#F0C95A", r: "#D6A83A", t: "#F8DD86", s: "#8E6A14", sw: 2.4 }); const lines = [-6, -12].map(k => `<path d="M${f(b.L[0])} ${f(b.L[1] - 22 - k)}L${f(b.F[0])} ${f(b.F[1] - 22 - k)}L${f(b.R[0])} ${f(b.R[1] - 22 - k)}" stroke="#A97C1C" stroke-width="2" fill="none" opacity=".6"/>`).join(""); return G(x, y, shadow(34, 10, .22) + b.svg + lines); }
function barrel(x, y, s) { return G(x, y, shadow(20 * s, 7 * s, .22) + `<path d="M${-14 * s} ${-4 * s}C${-18 * s} ${-18 * s} ${-18 * s} ${-30 * s} ${-14 * s} ${-42 * s}H${14 * s}C${18 * s} ${-30 * s} ${18 * s} ${-18 * s} ${14 * s} ${-4 * s}C${6 * s} 6 ${-6 * s} 6 ${-14 * s} ${-4 * s}Z" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="3" stroke-linejoin="round"/>` + ell(0, -42 * s, 14 * s, 6 * s, "#D6A066", C.woodD, 3) + [-14, -26].map(k => `<path d="M${-16.5 * s} ${k * s}C-6 ${(k + 7) * s} 6 ${(k + 7) * s} ${16.5 * s} ${k * s}" stroke="#6B6459" stroke-width="3.4" fill="none"/>`).join("")); }
function chicken(x, y) { return G(x, y, shadow(12, 4, .2) + ell(0, -12, 11, 9, "#fff", "#C9C1B2", 2) + ell(8, -22, 6, 6, "#fff", "#C9C1B2", 2) + `<path d="M6 -29Q8 -35 11 -29Q13 -33 14 -28Z" fill="#E5484D"/><path d="M14 -22L21 -20L14 -18Z" fill="#F5A623"/>` + ell(10, -23, 1.4, 1.4, "#3A2A12") + `<path d="M-2 -2V4M3 -2V4" stroke="#F5A623" stroke-width="2.4" stroke-linecap="round"/>`); }
function rabbit(x, y) { return G(x, y, shadow(14, 4.6, .2) + ell(0, -11, 11, 9, "#fff", "#CFC6D6", 2) + ell(8, -20, 7, 6.4, "#fff", "#CFC6D6", 2) + ell(6, -32, 2.6, 8, "#fff", "#CFC6D6", 2) + ell(12, -31, 2.6, 8, "#fff", "#CFC6D6", 2) + ell(6, -32, 1, 5, "#FFB3C1") + ell(11, -22, 1.3, 1.3, "#3A2A12") + ell(-11, -9, 3.6, 3.6, "#fff", "#CFC6D6", 1.6)); }
function bee(x, y, d) { return `<g class="npa npa-hover" style="animation-delay:${d}s"><g transform="translate(${x} ${y})">${ell(-6, -5, 5, 3.4, "#fff", "#BFD9F2", 1.2).replace("/>", ' opacity=".85"/>')}${ell(0, 0, 8, 6.4, "#FFD24D", "#C9840F", 1.8)}<path d="M-3 -6V6M3 -6V6" stroke="#3A2A12" stroke-width="2.4"/>${ell(7, -1, 1.2, 1.2, "#3A2A12")}</g></g>`; }
function butterfly(x, y, d, col) { return `<g class="npa npa-hover" style="animation-delay:${d}s"><g transform="translate(${x} ${y})"><path d="M0 0C-6 -12 -18 -10 -16 -2C-14 4 -6 4 0 0Z M0 0C6 -12 18 -10 16 -2C14 4 6 4 0 0Z" fill="${col || "#FF8FB0"}" stroke="#B5305F" stroke-width="1.6"/>${ell(0, 0, 1.8, 6, "#3A1E36")}</g></g>`; }

/* ---------- cây ---------- */
function bigTree(x, y, s, kind) {
  const r = rng(Math.floor(x * 13 + y * 7)); let canopy = "";
  const blobs = [[-30, -88, 34], [26, -92, 36], [0, -118, 38], [-44, -62, 26], [44, -64, 28], [0, -80, 40]];
  blobs.forEach(([a, b, rr]) => canopy += ell(a, b, rr, rr * .9, "url(#gLeaf)", C.leafD, 3));
  for (let i = 0; i < 9; i++) canopy += ell((r() - .5) * 90, -70 - r() * 70, 5 + r() * 5, 3 + r() * 2.4, "#C3F294", null).replace("/>", ' opacity=".35"/>');
  const FR = { apple: ["#E5484D", "#9E1B28"], orange: ["#FFA62B", "#B9650A"], pear: ["#D9E35A", "#8E9A1E"], peach: ["#FF9DB0", "#C2506A"], mango: ["#FFC23A", "#C28A0A"], pomelo: ["#C9E36A", "#7E9A2B"], litchi: ["#FF5D6C", "#B3243A"], plum: ["#9A6AE0", "#52309A"] }[kind]; if (FR) for (let i = 0; i < 12; i++) { const a = (r() - .5) * 100, b = -62 - r() * 70; canopy += ell(a, b, 6.4, 6.4, FR[0], FR[1], 1.8) + ell(a - 2, b - 2, 1.8, 1.4, "#fff"); }
  return G(x, y, `<g transform="scale(${s})">` + shadow(64, 18, .24) + `<path d="M-12 0C-8 -20 -10 -40 -8 -64H8C10 -40 8 -20 12 0C4 5 -4 5 -12 0Z" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="3" stroke-linejoin="round"/>` + canopy + `</g>`);
}
function pine(x, y, s) { let t = ""; [[0, 54, 64], [-4, 90, 52], [-8, 124, 40]].forEach(([a, b, w]) => t += `<path d="M${-w} ${-b + 30}C${-w * .5} ${-b + 28} ${-w * .3} ${-b - 6} 0 ${-b - 34}C${w * .3} ${-b - 6} ${w * .5} ${-b + 28} ${w} ${-b + 30}C${w * .4} ${-b + 40} ${-w * .4} ${-b + 40} ${-w} ${-b + 30}Z" fill="url(#gPine)" stroke="#1E5A33" stroke-width="3" stroke-linejoin="round"/>`); return G(x, y, `<g transform="scale(${s})">` + shadow(48, 14, .24) + `<rect x="-8" y="-34" width="16" height="36" rx="4" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="3"/>` + t + `</g>`); }

/* ---------- đường đá, ô trồng, rào ---------- */
function pathCell(gx, gy) {
  const r = rng(gx * 31 + gy * 17 + 5), c = P(gx + .5, gy + .5); let o = "";
  for (let i = 0; i < 5; i++) { const a = (r() - .5) * 70, b = (r() - .5) * 28, rx = 16 + r() * 9, ry = rx * .5; o += ell(c[0] + a, c[1] + b + 2, rx, ry, "#8F8B83", null) + ell(c[0] + a, c[1] + b, rx, ry, "url(#gStone)", "#807C74", 2.2) + `<path d="M${f(c[0] + a - rx * .5)} ${f(c[1] + b - ry * .3)}Q${f(c[0] + a)} ${f(c[1] + b - ry * .7)} ${f(c[0] + a + rx * .4)} ${f(c[1] + b - ry * .4)}" stroke="#fff" stroke-width="2.4" fill="none" opacity=".65" stroke-linecap="round"/>`; }
  return { d: gx + gy + .2, svg: o };
}
function plotCell(gx, gy, crop, ripe, lvl) {
  const A = P(gx, gy), B = P(gx + 1, gy), Cc = P(gx + 1, gy + 1), D = P(gx, gy + 1), ctr = P(gx + .5, gy + .5);
  let o = poly([A, B, Cc, D], "url(#gSoil)", lvl >= 3 ? "#7A4B24" : C.soilD, lvl >= 3 ? 7 : 3);
  for (let k = 1; k < 5; k++) o += `<path d="M${f(lerp(A, D, k / 5)[0])} ${f(lerp(A, D, k / 5)[1])}L${f(lerp(B, Cc, k / 5)[0])} ${f(lerp(B, Cc, k / 5)[1])}" stroke="${C.soilD}" stroke-width="2.6" opacity=".45" stroke-linecap="round"/>`;
  if (lvl >= 3) o += poly([A, B, Cc, D], "none", "#C58B4E", 3);
  let cr = "";
  for (let k = 0; k < 4; k++) for (let m = 0; m < 4; m++) { const p = lerp(lerp(A, D, (k + .5) / 4), lerp(B, Cc, (k + .5) / 4), (m + .5) / 4); cr += crop(p[0], p[1] + 8, ripe); }
  return { d: gx + gy + .3, svg: o, front: cr, fd: gx + gy + .7 };
}
const cropWheat = (x, y, ripe) => { let s = ""; for (let i = -1; i <= 1; i++) { const h = 26 + (i === 0 ? 4 : 0); s += `<path d="M${i * 4} 0L${i * 5} ${-h}" stroke="${ripe ? "#C9A12E" : "#4E9B34"}" stroke-width="2.4" stroke-linecap="round"/>` + ell(i * 5, -h - 4, 3, 8, ripe ? "url(#gWheat)" : "#7BC24A", ripe ? "#A9801A" : "#2F7A2F", 1.4); } return G(x, y, s); };
const cropCarrot = (x, y, ripe) => G(x, y, `<path d="M-6 0Q-9 -14 -12 -18M0 0Q0 -18 0 -22M6 0Q9 -14 12 -18" stroke="#3FA83B" stroke-width="3.4" fill="none" stroke-linecap="round"/>` + (ripe ? ell(0, 1, 7, 3.6, "#F2701C", "#B84E0E", 1.6) : ""));
const cropStraw = (x, y, ripe) => G(x, y, ell(-7, -6, 8, 6, "#4FA83B", "#2F7A2F", 1.6) + ell(7, -6, 8, 6, "#4FA83B", "#2F7A2F", 1.6) + ell(0, -11, 8, 6, "#6FCB55", "#2F7A2F", 1.6) + (ripe ? ell(-2, -3, 4.6, 5.4, "#E5484D", "#9E1B28", 1.4) + ell(6, -2, 4, 4.8, "#E5484D", "#9E1B28", 1.4) : ""));
const cropTomato = (x, y, ripe) => G(x, y, `<path d="M0 0V-24" stroke="#3FA83B" stroke-width="3" stroke-linecap="round"/>` + ell(-6, -16, 6, 4, "#4FA83B", "#2F7A2F", 1.4) + ell(6, -20, 6, 4, "#4FA83B", "#2F7A2F", 1.4) + (ripe ? ell(-5, -9, 5.2, 5.2, "#E5322D", "#A81F1B", 1.4) + ell(6, -12, 5, 5, "#E5322D", "#A81F1B", 1.4) : ell(-5, -9, 4, 4, "#A8D872", "#6E9B3C", 1.2)));
const cropCorn = (x, y, ripe) => G(x, y, `<path d="M0 0V-34" stroke="#3FA83B" stroke-width="4" stroke-linecap="round"/><path d="M0 -10Q-12 -18 -16 -30M0 -16Q12 -24 16 -34" stroke="#4FA83B" stroke-width="4" fill="none" stroke-linecap="round"/>` + (ripe ? ell(5, -18, 3.6, 8, "#FFD43B", "#B88400", 1.4) : ""));
const cropSun = (x, y, ripe) => G(x, y, `<path d="M0 0V-26" stroke="#3FA83B" stroke-width="3.4" stroke-linecap="round"/>` + (ripe ? Array.from({ length: 8 }, (_, i) => ell(0, -34, 3, 6, "#FFD43B", "#B36B00", 1).replace("/>", ` transform="rotate(${i * 45} 0 -30)"/>`)).join("") + ell(0, -30, 5.4, 5.4, "#6B4426", "#3A2412", 1.4) : ell(0, -28, 4, 5, "#6FCB55", "#2F7A2F", 1.4)));

function fence(gx, gy, dir, lvl) {   /* dir "x" = dọc theo gx (xuống-phải), "y" = dọc theo gy (xuống-trái) */
  const A = dir === "x" ? P(gx, gy) : P(gx, gy), B = dir === "x" ? P(gx + 1, gy) : P(gx, gy + 1), d = dir === "x" ? gx + gy + .5 : gx + gy + .5;
  let o = "";
  if (lvl >= 3) { /* tường đá thấp */
    const thick = .28, F = dir === "x" ? P(gx + 1, gy + thick) : P(gx + thick, gy + 1), a = dir === "x" ? 1 : thick, b = dir === "x" ? thick : 1;
    const bx = box(F, a, b, 30, { l: "url(#gStoneL)", r: "url(#gStoneR)", t: "#E4E0D8", s: "#7E7A72", sw: 2.4 }); o += bx.svg;
    for (let k = 1; k < 4; k++) { const t = k / 4; const p = lerp(bx.L, bx.F, t), q = lerp(bx.F, bx.R, t); o += `<path d="M${f(p[0])} ${f(p[1])}V${f(p[1] - 30)}" stroke="#8E8A82" stroke-width="1.8" opacity=".6"/><path d="M${f(q[0])} ${f(q[1])}V${f(q[1] - 30)}" stroke="#8E8A82" stroke-width="1.8" opacity=".6"/>`; }
    o += `<path d="M${f(bx.L[0])} ${f(bx.L[1] - 15)}L${f(bx.F[0])} ${f(bx.F[1] - 15)}L${f(bx.R[0])} ${f(bx.R[1] - 15)}" stroke="#8E8A82" stroke-width="1.8" fill="none" opacity=".6"/>`;
    return { d, svg: o };
  }
  const col = lvl === 1 ? ["#E0D090", "#B9A257", "#7F6C28"] : [C.wood1, C.wood2, C.woodD];
  const post = (p) => `<g transform="translate(${f(p[0])} ${f(p[1])})"><rect x="-4.4" y="-40" width="8.8" height="42" rx="${lvl === 1 ? 4.4 : 2}" fill="${col[0]}" stroke="${col[2]}" stroke-width="2.4"/>${lvl === 1 ? `<path d="M-4.4 -26H4.4M-4.4 -12H4.4" stroke="${col[2]}" stroke-width="2"/>` : `<path d="M-6 -40L0 -48L6 -40Z" fill="${col[1]}" stroke="${col[2]}" stroke-width="2.4" stroke-linejoin="round"/>`}</g>`;
  const rail = (y) => `<path d="M${f(A[0])} ${f(A[1] - y)}L${f(B[0])} ${f(B[1] - y)}" stroke="${col[2]}" stroke-width="8" stroke-linecap="round"/><path d="M${f(A[0])} ${f(A[1] - y)}L${f(B[0])} ${f(B[1] - y)}" stroke="${col[0]}" stroke-width="4.4" stroke-linecap="round"/>`;
  o += rail(14) + rail(28) + post(A) + post(B);
  return { d, svg: o };
}

/* ---------- công trình ---------- */
function house(F, lvl) {
  const a = 3, b = 2; let svg = "", sh = shadow(150, 44, .24);
  if (lvl === 1) {   /* lều lá */
    const bx = box(F, 2, 2, 36, { l: "#D9C28E", r: "#BFA56E", t: null, s: "#7F6C28", sw: 3 });
    const top = [bx.up(bx.F), bx.up(bx.L), bx.up(bx.B), bx.up(bx.R)], apex = [(top[0][0] + top[2][0]) / 2, (top[0][1] + top[2][1]) / 2 - 74];
    let roof = poly([top[1], top[0], apex], "url(#gLeafRoof)", "#2F7A2F", 3) + poly([top[0], top[3], apex], "url(#gLeafRoof2)", "#2F7A2F", 3);
    for (let i = 1; i < 6; i++) { const t = i / 6; roof += `<path d="M${f(lerp(top[1], top[0], t)[0])} ${f(lerp(top[1], top[0], t)[1])}L${f(apex[0])} ${f(apex[1])}" stroke="#2F7A2F" stroke-width="1.8" opacity=".5"/><path d="M${f(lerp(top[0], top[3], t)[0])} ${f(lerp(top[0], top[3], t)[1])}L${f(apex[0])} ${f(apex[1])}" stroke="#2F7A2F" stroke-width="1.8" opacity=".5"/>`; }
    const dp = lerp(bx.F, bx.R, .5); const door = `<path d="M${f(dp[0] - 12)} ${f(dp[1] + 3)}V${f(dp[1] - 26)}Q${f(dp[0])} ${f(dp[1] - 38)} ${f(dp[0] + 12)} ${f(dp[1] - 26)}V${f(dp[1] - 4)}Z" fill="#5E3A1B" stroke="#3A2210" stroke-width="2.4" transform="translate(0 0)"/>`;
    return { d: F[1], svg: `<g>${ell(F[0], F[1] - 8, 110, 32, "#1F5A22", null).replace("/>", ' opacity=".2"/>')}${bx.svg}${door}${roof}</g>` };
  }
  const h = [0, 0, 52, 66, 80][lvl], rh = [0, 0, 46, 54, 62][lvl];
  const wallL = lvl === 2 ? "#DCC092" : C.wall, wallR = lvl === 2 ? "#C8A877" : C.wallS, st = lvl === 2 ? "#7F5A24" : C.wallD;
  const bx = box(F, a, b, h, { l: wallL, r: wallR, t: null, s: st, sw: 3 });
  const roofC = lvl === 2 ? ["url(#gStraw)", "#D9A93A", "#8A6414"] : lvl === 3 ? ["url(#gTile3)", "#D96B3A", "#8E3E1B"] : ["url(#gTile4)", "#E0553E", "#7E2418"];
  const Ft = bx.up(bx.F), Lt = bx.up(bx.L), Rt = bx.up(bx.R), Bt = bx.up(bx.B);
  const M1 = [(Ft[0] + Rt[0]) / 2, (Ft[1] + Rt[1]) / 2 - rh], M2 = [(Lt[0] + Bt[0]) / 2, (Lt[1] + Bt[1]) / 2 - rh];
  const ov = (p, q, k) => [p[0] + (p[0] - q[0]) * k, p[1] + (p[1] - q[1]) * k];
  let roof = poly([Ft, Rt, M1], lvl === 2 ? "#E9D1A0" : "#F4ECDD", st, 3);     /* đầu hồi (tam giác tường) */
  /* tấm mái chính (mặt trái-trước) */
  const e1 = ov(Ft, M1, .12), e2 = ov(Lt, M2, .12);
  roof += poly([[Ft[0] - 10, Ft[1] + 6], [Lt[0] - 10, Lt[1] + 6], M2, M1], roofC[0], roofC[2], 3);
  /* vạch ngói / rơm */
  const n = lvl === 2 ? 9 : 7;
  for (let i = 1; i < n; i++) { const t = i / n, p1 = lerp([Ft[0] - 10, Ft[1] + 6], M1, t), p2 = lerp([Lt[0] - 10, Lt[1] + 6], M2, t); roof += `<path d="M${f(p1[0])} ${f(p1[1])}L${f(p2[0])} ${f(p2[1])}" stroke="${roofC[2]}" stroke-width="${lvl === 2 ? 2.4 : 2}" opacity=".45"/>`; }
  roof += `<path d="M${f(M1[0])} ${f(M1[1])}L${f(M2[0])} ${f(M2[1])}" stroke="${roofC[2]}" stroke-width="7" stroke-linecap="round"/><path d="M${f(M1[0])} ${f(M1[1])}L${f(M2[0])} ${f(M2[1])}" stroke="${roofC[1]}" stroke-width="3.6" stroke-linecap="round"/>`;
  /* cửa + cửa sổ */
  const dpt = lerp(bx.F, bx.R, .55), win = (p, w, hh, c) => `<g><rect x="${f(p[0] - w / 2)}" y="${f(p[1] - hh)}" width="${w}" height="${hh}" rx="3" fill="${c}" stroke="${st}" stroke-width="2.4"/><path d="M${f(p[0])} ${f(p[1] - hh)}V${f(p[1])}M${f(p[0] - w / 2)} ${f(p[1] - hh / 2)}H${f(p[0] + w / 2)}" stroke="${st}" stroke-width="1.8"/></g>`;
  let deco = `<path d="M${f(dpt[0] - 14)} ${f(dpt[1] + 2)}V${f(dpt[1] - 36)}Q${f(dpt[0])} ${f(dpt[1] - 50)} ${f(dpt[0] + 14)} ${f(dpt[1] - 36)}V${f(dpt[1] - 4)}Z" fill="#7A4A26" stroke="#3A2210" stroke-width="2.6"/>${ell(dpt[0] + 7, dpt[1] - 20, 1.8, 1.8, "#F0CB62")}`;
  [lerp(bx.F, bx.L, .28), lerp(bx.F, bx.L, .62), lerp(bx.F, bx.L, .88)].forEach(p => deco += win([p[0], p[1] - 22], 18, 22, lvl >= 3 ? "#9FD3F2" : "#6B4A2A"));
  if (lvl >= 3) deco += win([lerp(bx.F, bx.R, .15)[0], lerp(bx.F, bx.R, .15)[1] - 24], 16, 20, "#9FD3F2");
  if (lvl === 4) {
    const dormer = (t) => { const p = lerp([Ft[0] - 10, Ft[1] + 6], M1, .5), q = lerp([Lt[0] - 10, Lt[1] + 6], M2, .5), c = lerp(p, q, t); return `<g transform="translate(${f(c[0])} ${f(c[1])})"><path d="M-12 4V-14L0 -26L12 -14V4Z" fill="${C.wall}" stroke="${st}" stroke-width="2.4"/><path d="M-16 -12L0 -30L16 -12" fill="none" stroke="${roofC[2]}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="-6" y="-12" width="12" height="12" rx="2" fill="#9FD3F2" stroke="${st}" stroke-width="2"/></g>`; };
    deco += `` ; roof += dormer(.3) + dormer(.72);
    const ch = lerp(M1, M2, .62); roof += `<g transform="translate(${f(ch[0] + 10)} ${f(ch[1] - 6)})"><rect x="-9" y="-28" width="18" height="30" rx="2" fill="#B0643F" stroke="#6E3A22" stroke-width="2.4"/><rect x="-12" y="-34" width="24" height="9" rx="2" fill="#8A4E2E" stroke="#6E3A22" stroke-width="2.4"/></g>`;
    const stepP = lerp(bx.F, bx.R, .55); deco += `<path d="M${f(stepP[0] - 26)} ${f(stepP[1] + 12)}L${f(stepP[0])} ${f(stepP[1] + 26)}L${f(stepP[0] + 26)} ${f(stepP[1] + 12)}L${f(stepP[0])} ${f(stepP[1] - 2)}Z" fill="#B58A5A" stroke="${C.woodD}" stroke-width="2.4"/>`;
  }
  return { d: F[1], svg: ell(F[0] - 20, F[1] - 18, 150, 40, "#1F5A22", null).replace("/>", ' opacity=".2"/>') + bx.svg + deco + roof };
}
function well(c, lvl) { let o = shadow(46, 14, .24);
  if (lvl === 1) o += ell(0, -4, 30, 14, "#8F8B83", null) + ell(0, -10, 30, 14, "url(#gStone)", "#7E7A72", 3) + ell(0, -12, 20, 8.6, "#2B73A6", "#1F4F78", 2);
  else {
    o += `<path d="M-30 -6V-30C-30 -42 30 -42 30 -30V-6C30 4 -30 4 -30 -6Z" fill="url(#gStoneL)" stroke="#7E7A72" stroke-width="3" stroke-linejoin="round"/>` + ell(0, -30, 30, 14, "#E4E0D8", "#7E7A72", 3) + ell(0, -31, 21, 9, "#2B73A6", "#1F4F78", 2);
    for (let i = 0; i < 4; i++) o += `<path d="M${-24 + i * 16} ${-26 + (i % 2) * 3}V${-8}" stroke="#8E8A82" stroke-width="2" opacity=".6"/>`;
    o += `<rect x="-30" y="-74" width="7" height="46" rx="2" fill="${C.wood1}" stroke="${C.woodD}" stroke-width="2.6"/><rect x="23" y="-74" width="7" height="46" rx="2" fill="${C.wood1}" stroke="${C.woodD}" stroke-width="2.6"/><rect x="-30" y="-80" width="60" height="8" rx="3" fill="${C.wood2}" stroke="${C.woodD}" stroke-width="2.6"/><path d="M0 -72V-48" stroke="#8E6B3A" stroke-width="3"/><path d="M-7 -48H7V-38C7 -34 -7 -34 -7 -38Z" fill="${C.wood1}" stroke="${C.woodD}" stroke-width="2.4"/>`;
    if (lvl === 3) o += `<path d="M-40 -78L0 -106L40 -78Z" fill="url(#gTile3)" stroke="#8E3E1B" stroke-width="3" stroke-linejoin="round"/><path d="M-30 -84L0 -104L30 -84" fill="none" stroke="#F4A37A" stroke-width="2" opacity=".6"/>`;
  }
  return { d: c[1], svg: G(c[0], c[1], o) };
}
function barn(F, lvl) {
  const h = [0, 40, 56, 66][lvl];
  const col = lvl === 1 ? { l: "#C58B4E", r: "#A87438", s: "#5E3A1B" } : { l: "#E0553E", r: "#C23F2E", s: "#7E2418" };
  const bx = box(F, 2, 2, h, { l: col.l, r: col.r, t: null, s: col.s, sw: 3 });
  const Ft = bx.up(bx.F), Lt = bx.up(bx.L), Rt = bx.up(bx.R), Bt = bx.up(bx.B), rh = lvl === 1 ? 30 : 42;
  const M1 = [(Ft[0] + Rt[0]) / 2, (Ft[1] + Rt[1]) / 2 - rh], M2 = [(Lt[0] + Bt[0]) / 2, (Lt[1] + Bt[1]) / 2 - rh], rc = lvl === 1 ? ["#8E6A3A", "#6A4A22"] : ["#7A5A44", "#4F3427"];
  let o = ell(F[0] - 10, F[1] - 12, 110, 32, "#1F5A22", null).replace("/>", ' opacity=".2"/>') + bx.svg;
  const dp = lerp(bx.F, bx.R, .5); o += `<g><rect x="${f(dp[0] - 22)}" y="${f(dp[1] - 38)}" width="44" height="40" rx="3" fill="#FFF3E0" stroke="${col.s}" stroke-width="3"/><path d="M${f(dp[0] - 22)} ${f(dp[1] - 38)}L${f(dp[0] + 22)} ${f(dp[1] + 2)}M${f(dp[0] + 22)} ${f(dp[1] - 38)}L${f(dp[0] - 22)} ${f(dp[1] + 2)}" stroke="${col.l}" stroke-width="5" stroke-linecap="round"/></g>`;
  o += poly([Ft, Rt, M1], col.r, col.s, 3) + poly([[Ft[0] - 8, Ft[1] + 5], [Lt[0] - 8, Lt[1] + 5], M2, M1], rc[0], rc[1], 3) + `<path d="M${f(M1[0])} ${f(M1[1])}L${f(M2[0])} ${f(M2[1])}" stroke="${rc[1]}" stroke-width="6" stroke-linecap="round"/>`;
  if (lvl >= 2) o += `<circle cx="${f(M1[0] - 4)}" cy="${f(M1[1] + 26)}" r="10" fill="#FFF3E0" stroke="${col.s}" stroke-width="3"/>`;
  return { d: F[1], svg: o };
}
function windmill(c, lvl) { const hgt = [0, 70, 100, 124][lvl]; let o = shadow(56, 16, .24);
  o += `<path d="M-30 0L-20 ${-hgt}H20L30 0C14 8 -14 8 -30 0Z" fill="url(#gWall)" stroke="${C.wallD}" stroke-width="3" stroke-linejoin="round"/><path d="M-26 ${-hgt * .55}L26 ${-hgt * .55}" stroke="#E0553E" stroke-width="12"/>`;
  o += `<path d="M-26 -4V-26Q0 -40 26 -26V-4" fill="#7A4A26" stroke="#3A2210" stroke-width="3" transform="translate(0 0) scale(.38) translate(0 8)"/>`;
  o += `<path d="M-26 ${-hgt + 2}L0 ${-hgt - 34}L26 ${-hgt + 2}Z" fill="url(#gTile4)" stroke="#7E2418" stroke-width="3" stroke-linejoin="round"/>`;
  let blades = ""; for (let i = 0; i < 4; i++) blades += `<g transform="rotate(${i * 90})"><rect x="-4" y="-78" width="8" height="78" fill="${C.wood1}" stroke="${C.woodD}" stroke-width="2.4"/><rect x="4" y="-76" width="22" height="44" rx="2" fill="#FFF3E0" stroke="${C.woodD}" stroke-width="2.4"/><path d="M4 -64H26M4 -52H26M4 -40H26" stroke="#C9B08A" stroke-width="1.6"/></g>`;
  o += `<g transform="translate(0 ${-hgt - 4})"><g class="npa npa-spin">${blades}</g>${ell(0, 0, 8, 8, "#E0553E", "#7E2418", 3)}</g>`;
  return { d: c[1], svg: G(c[0], c[1], o) };
}
function pond(c) { let o = ell(0, 6, 138, 70, "#6E9B3C", null) + ell(0, 0, 134, 66, "#9C8A6A", "#6E6A63", 4) + ell(0, -4, 120, 58, "url(#gWater)", "#2B73A6", 3);
  o += `<path d="M-70 -14Q-40 -24 -10 -14M10 6Q40 -4 70 8M-30 22Q0 14 34 24" fill="none" stroke="#fff" stroke-width="3" opacity=".55" stroke-linecap="round"/>`;
  [[-60, 12], [50, -20], [30, 26]].forEach(([a, b]) => o += ell(a, b, 14, 6, "#5FB83E", "#2F7A2F", 2) + `<path d="M${a} ${b}L${a + 8} ${b - 3}" stroke="#2B73A6" stroke-width="2"/>`);
  o += G(-30, -26, `<path d="M-56 -6C-60 -22 -34 -30 -10 -24L50 -10C70 -6 72 12 52 12L-40 12C-52 12 -58 6 -56 -6Z" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="3"/>` + ell(52, -2, 9, 11, "#E4B27A", C.woodD, 2.4) + ell(-52, -4, 8, 10, "#E4B27A", C.woodD, 2.4)).replace("translate(-30 -26)", "translate(-30 -26) scale(.7)");
  [-92, 86].forEach((a, i) => { o += `<path d="M${a} 8V${-34 - i * 6}M${a + 6} 8V${-26}M${a - 6} 8V${-28}" stroke="#7EA83A" stroke-width="3" stroke-linecap="round"/>` + ell(a, -38 - i * 6, 3, 9, "#7A4A26", "#3A2210", 1.4); });
  return { d: -1, svg: G(c[0], c[1], o) };
}

/* ---------- thêm vật cho cảnh dày hơn (bò, cối ép, lò gạch, bình sữa, bàn ghế, chuồng gà, rơm cuộn, bụi hoa, hàng rào bụi, bí ngô) ---------- */
function cow(x, y, s, flip) {
  const sc = s || 1; return G(x, y, `<g transform="scale(${flip ? -sc : sc} ${sc})">` + shadow(40, 11, .22) +
    [-18, 14].map(a => `<rect x="${a - 4}" y="-20" width="9" height="22" rx="3" fill="#F4F0EA" stroke="#9A918A" stroke-width="2.4"/><rect x="${a - 4}" y="-4" width="9" height="6" rx="2" fill="#3A2A24"/>`).join("") +
    ell(0, -32, 30, 19, "#FFFFFF", "#9A918A", 3) + ell(-10, -38, 9, 6.4, "#3A2A24", null) + ell(10, -26, 8, 6, "#3A2A24", null) + ell(-22, -26, 5.6, 5, "#3A2A24", null) +
    `<path d="M-30 -36Q-42 -34 -40 -18" stroke="#9A918A" stroke-width="3" fill="none" stroke-linecap="round"/>` + ell(-40, -16, 3, 4, "#3A2A24") +
    ell(32, -42, 13, 12, "#FFFFFF", "#9A918A", 3) + ell(40, -37, 8, 6, "#F4A9B4", "#C97A88", 2) + ell(37, -37, 1.3, 1.3, "#7A3A48") + ell(43, -37, 1.3, 1.3, "#7A3A48") + ell(30, -48, 2, 2.4, "#3A2A24") +
    ell(23, -54, 5, 3, "#FFFFFF", "#9A918A", 2) + ell(40, -54, 5, 3, "#FFFFFF", "#9A918A", 2) + `<path d="M28 -54L26 -62M36 -54L38 -62" stroke="#E8D9B0" stroke-width="3" stroke-linecap="round"/>` + `</g>`);
}
function press(x, y) {
  let o = shadow(70, 20, .24);
  const pl = box([0, 14], 1.7, 1.2, 14, { l: "#B98350", r: "#9A6532", t: "#D6A066", s: C.woodD, sw: 2.6 }); o += pl.svg;
  const tub = `<path d="M-44 -4C-48 -24 -46 -46 -42 -66H42C46 -46 48 -24 44 -4C28 8 -28 8 -44 -4Z" fill="url(#gWood)" stroke="${C.woodD}" stroke-width="3.4" stroke-linejoin="round"/>` + [-30, -15, 0, 15, 30].map(a => `<path d="M${a} -64V4" stroke="${C.woodD}" stroke-width="1.8" opacity=".35"/>`).join("") + [-20, -44].map(k => `<path d="M${k === -20 ? -46 : -46} ${k}Q0 ${k + 12} 46 ${k}" stroke="#6B6459" stroke-width="4.4" fill="none"/>`).join("") + ell(0, -66, 42, 15, "#7B4A28", C.woodD, 3.4) + ell(0, -64, 36, 11, "#A96A3A", null);
  o += G(0, -4, tub);
  o += `<rect x="-62" y="-150" width="9" height="150" rx="3" fill="#E0553E" stroke="#8E2A1B" stroke-width="3"/><rect x="53" y="-150" width="9" height="150" rx="3" fill="#E0553E" stroke="#8E2A1B" stroke-width="3"/><path d="M-62 -146Q0 -178 62 -146" stroke="#8E2A1B" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M-62 -146Q0 -178 62 -146" stroke="#E0553E" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M0 -162V-118" stroke="#8E2A1B" stroke-width="9" stroke-linecap="round"/><path d="M0 -162V-118" stroke="#B9B6AE" stroke-width="5" stroke-linecap="round"/><path d="M-8 -118H8L4 -104H-4Z" fill="#B9B6AE" stroke="#6E6A63" stroke-width="2.4"/>`;
  o += `<path d="M-54 22L-30 36L-2 24L-26 10Z" fill="#B98350" stroke="${C.woodD}" stroke-width="2.4"/><path d="M-50 28L-26 41" stroke="${C.woodD}" stroke-width="2" opacity=".5"/>`;
  return G(x, y, o);
}
function oven(x, y) {
  const F = [0, 0], bx = box(F, 1.3, 1, 54, { l: "#C86A4A", r: "#A9523A", t: "#DE8B6C", s: "#6E3A22", sw: 3 }); let o = shadow(70, 18, .24) + bx.svg;
  for (let k = 1; k < 5; k++) { const t = k / 5; o += `<path d="M${f(bx.L[0])} ${f(bx.L[1] - 54 * t)}L${f(bx.F[0])} ${f(bx.F[1] - 54 * t)}L${f(bx.R[0])} ${f(bx.R[1] - 54 * t)}" stroke="#7E4430" stroke-width="1.6" fill="none" opacity=".5"/>`; }
  const dp = lerp(bx.F, bx.R, .5); o += `<path d="M${f(dp[0] - 15)} ${f(dp[1] + 2)}V${f(dp[1] - 22)}Q${f(dp[0])} ${f(dp[1] - 42)} ${f(dp[0] + 15)} ${f(dp[1] - 22)}V${f(dp[1] - 4)}Z" fill="#2A1A14" stroke="#4A2A1A" stroke-width="3"/><path d="M${f(dp[0] - 9)} ${f(dp[1])}V${f(dp[1] - 16)}Q${f(dp[0])} ${f(dp[1] - 28)} ${f(dp[0] + 9)} ${f(dp[1] - 16)}V${f(dp[1])}Z" fill="#FF9A3D"/><path d="M${f(dp[0] - 4)} ${f(dp[1])}Q${f(dp[0])} ${f(dp[1] - 14)} ${f(dp[0] + 4)} ${f(dp[1])}Z" fill="#FFE08A"/>`;
  o += `<rect x="-6" y="-92" width="22" height="42" rx="3" fill="#B0643F" stroke="#6E3A22" stroke-width="3"/><rect x="-10" y="-98" width="30" height="10" rx="3" fill="#8A4E2E" stroke="#6E3A22" stroke-width="2.6"/>`;
  return G(x, y, o);
}
function milkcans(x, y) { const can = (a, s) => `<g transform="translate(${a} 0) scale(${s})"><path d="M-12 0V-34C-12 -40 12 -40 12 -34V0C12 5 -12 5 -12 0Z" fill="#CBD0DC" stroke="#6E7488" stroke-width="2.6"/><path d="M-12 -30H12" stroke="#8E94A8" stroke-width="2"/><rect x="-14" y="-46" width="28" height="9" rx="3" fill="#E5E8F0" stroke="#6E7488" stroke-width="2.4"/><path d="M-6 -4V-34" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/></g>`; return G(x, y, shadow(34, 9, .22) + can(-16, 1) + can(14, 1) + can(-1, .8).replace("translate(-1 0)", "translate(-1 -6)")); }
function table(x, y) { const chair = (a, flip) => `<g transform="translate(${a} 0) scale(${flip ? -1 : 1} 1)"><rect x="-10" y="-22" width="20" height="8" rx="3" fill="#7CCB5A" stroke="#3F8A30" stroke-width="2.4"/><path d="M-10 -22V-44H10V-22" fill="none" stroke="#3F8A30" stroke-width="4" stroke-linejoin="round"/><path d="M-8 -14V0M8 -14V0" stroke="#3F8A30" stroke-width="3" stroke-linecap="round"/></g>`; return G(x, y, shadow(50, 13, .22) + chair(-34, 0) + `<path d="M0 -4V-34" stroke="${C.woodD}" stroke-width="6" stroke-linecap="round"/>` + ell(0, -38, 26, 10, "url(#gWood)", C.woodD, 3) + ell(0, -42, 20, 6, "#E4B27A", null) + chair(36, 1)); }
function coop(x, y) { return G(x, y, shadow(44, 12, .22) + `<path d="M-40 0C-40 -46 -18 -60 0 -60C18 -60 40 -46 40 0Z" fill="#EFC36E" stroke="#A26B2A" stroke-width="3.4" stroke-linejoin="round"/><path d="M-30 -26Q0 -40 30 -26M-36 -12Q0 -26 36 -12" stroke="#B9833A" stroke-width="2" fill="none" opacity=".6"/>` + ell(0, -18, 13, 15, "#7A4A26", "#3A2210", 3) + ell(0, -16, 8, 10, "#2A1A14", null) + `<path d="M-52 2C-36 -4 -20 -2 -12 2M14 2C26 -4 44 -4 52 2" stroke="#D9A93A" stroke-width="4" stroke-linecap="round" fill="none"/>`); }
function roundHay(x, y) { return G(x, y, shadow(34, 9, .22) + `<path d="M-26 -4V-34C-26 -42 26 -42 26 -34V-4C26 6 -26 6 -26 -4Z" fill="url(#gWheat)" stroke="#A9801A" stroke-width="3"/>` + ell(0, -34, 26, 9, "#F8DD86", "#A9801A", 3) + `<path d="M-18 -34Q0 -30 18 -34M-10 -34Q0 -32 10 -34" stroke="#C9A12E" stroke-width="2" fill="none"/><path d="M-26 -16Q0 -8 26 -16M-26 -26Q0 -18 26 -26" stroke="#C9A12E" stroke-width="2" fill="none" opacity=".7"/>`); }
function flowerPatch(x, y, col) { const r = rng(Math.floor(x * 3 + y)); let o = ell(0, -6, 34, 14, "#5AA838", "#3F7A2B", 2.4); for (let i = 0; i < 12; i++) o += `<g transform="translate(${f((r() - .5) * 58)} ${f(-6 - r() * 18)})">${ell(0, 0, 5, 4, col || "#FFD24D", "#C9A12E", 1.4)}${ell(0, 0, 1.8, 1.4, "#FFF3C4")}</g>`; return G(x, y, o); }
function hedge(x, y, n, dir) { let o = ""; for (let i = 0; i < n; i++) { const dx = dir === "x" ? i * 40 : -i * 40, dy = i * 20; o += G(x + dx, y + dy, ell(0, -14, 24, 17, "url(#gLeaf)", C.leafD, 2.6) + ell(-6, -22, 9, 5, "#C3F294", null).replace("/>", ' opacity=".45"/>') + (i % 2 ? flowerBit(8, -18, "#FFD24D") + flowerBit(-10, -12, "#fff") : flowerBit(-8, -20, "#FF8FB0") + flowerBit(10, -10, "#FFD24D"))); } return o; }
const flowerBit = (x, y, c) => ell(x, y, 3.4, 3, c, "#fff", 1);
function pumpkins(x, y) { const pk = (a, b, s) => `<g transform="translate(${a} ${b}) scale(${s})">${ell(0, -10, 14, 11, "#F59A2B", "#B2591A", 2.4)}${ell(-5, -10, 5, 10, "#F9B04D", null).replace("/>", ' opacity=".6"/>')}${ell(5, -10, 5, 10, "#E8841C", null).replace("/>", ' opacity=".5"/>')}<path d="M0 -20Q2 -26 6 -26" stroke="#4E8B2E" stroke-width="3" fill="none" stroke-linecap="round"/></g>`; return G(x, y, shadow(32, 8, .2) + pk(-14, 0, 1) + pk(12, 2, .9) + pk(0, 8, .8)); }
function crate(x, y) { const b = box([0, 0], .6, .5, 22, { l: "#C58B4E", r: "#9A6532", t: "#D6A066", s: C.woodD, sw: 2.4 }); return G(x, y, shadow(26, 8, .22) + b.svg + `<path d="M${f(b.L[0])} ${f(b.L[1] - 11)}L${f(b.F[0])} ${f(b.F[1] - 11)}L${f(b.R[0])} ${f(b.R[1] - 11)}" stroke="${C.woodD}" stroke-width="2" fill="none" opacity=".6"/>`); }

/* ---------- ghép cảnh ---------- */
function defs() {
  const lg = (id, a, b, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  return `<defs>${lg("gLeaf", "#9BE665", "#4FA83B", 1)}${lg("gPine", "#4FB36A", "#1E7A44", 1)}${lg("gWood", "#D6A066", "#9A6532", 1)}${lg("gSoil", "#A8703F", "#7B4A28", 1)}${lg("gStone", "#E6E3DC", "#B5B1A8", 1)}${lg("gStoneL", "#D6D3CC", "#A8A59E", 1)}${lg("gStoneR", "#C2BFB7", "#8F8B83", 1)}${lg("gWheat", "#FFE08A", "#E8B83A", 1)}${lg("gWater", "#8FDCF7", "#3FA3D9", 1)}${lg("gWall", "#FFFFFF", "#E4D8C4", 0)}${lg("gStraw", "#F0CB62", "#D9A93A", 1)}${lg("gTile3", "#EE8A56", "#C95A2B", 1)}${lg("gTile4", "#F06A52", "#B23A2A", 1)}${lg("gLeafRoof", "#7FD35F", "#3F9A3A", 1)}${lg("gLeafRoof2", "#6BC653", "#2F8A36", 1)}
<radialGradient id="gGrass" cx=".5" cy=".4" r=".85"><stop offset="0" stop-color="#9AD95A"/><stop offset=".7" stop-color="#7FC448"/><stop offset="1" stop-color="#69AE3C"/></radialGradient><radialGradient id="gGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE9A0" stop-opacity=".95"/><stop offset="1" stop-color="#FFE9A0" stop-opacity="0"/></radialGradient>
<linearGradient id="gGray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9C6BF"/><stop offset="1" stop-color="#A29E96"/></linearGradient><linearGradient id="gSkyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3FF"/><stop offset="1" stop-color="#E9F8FF"/></linearGradient></defs>`;
}
const STYLE = `<style>.npa-spin{transform-box:fill-box;transform-origin:50% 50%;animation:npa-spin 14s linear infinite}.npa-hover{animation:npa-hover 3s ease-in-out infinite}@keyframes npa-spin{to{transform:rotate(360deg)}}@keyframes npa-hover{0%,100%{transform:translate(0,0)}50%{transform:translate(6px,-8px)}}:root.np-playing .npa-spin,:root.np-playing .npa-hover{animation:none}@media (prefers-reduced-motion:reduce){.npa-spin,.npa-hover{animation:none!important}}</style>`;

/* cấu hình cảnh: levels = cấp của từng vị trí (0 = chưa có). time = day | dusk | night */
function scene(o) {
  const L = Object.assign({ deco: 3, house: 4, fence: 3, well: 3, barn: 3, windmill: 3, plots: 74, planted: 56, path: 1, apple: 1, flowers: 1, pond: 1, hay: 1, animals: 1 }, o.levels || {});
  const time = o.time || "day"; const items = [], R = rng(7);
  /* nền cỏ */
  let ground = `<rect width="${W}" height="${H}" fill="url(#gGrass)"/>`;
  for (let i = 0; i < 26; i++) ground += ell(R() * W, 120 + R() * (H - 120), 90 + R() * 120, 30 + R() * 40, R() < .5 ? "#A5E06C" : "#6FB43F", null).replace("/>", ' opacity=".18"/>');
  for (let i = 0; i < 160; i++) { const x = R() * W, y = 150 + R() * (H - 150); ground += tuft(x, y, .7 + R() * .6); }
  const cols = ["#FFFFFF", "#FFD24D", "#FF8FB0", "#B79CF0"]; if (L.flowers) for (let i = 0; i < 46; i++) ground += flower(R() * W, 170 + R() * (H - 190), cols[Math.floor(R() * 4)]);
  /* chân trời: đồi + cây xa */
  let far = ""; for (let i = 0; i < 9; i++) far += ell(60 + i * 150 + R() * 40, 128 + R() * 20, 120 + R() * 40, 44 + R() * 16, i % 2 ? "#79C044" : "#6FB43F", null);
  const U = (sx, sy) => [(sx - OX) / TW + (sy - OY) / TH, (sy - OY) / TH - (sx - OX) / TW];   /* màn hình → ô lưới */
  const fenceAt = (x, y, dir, lv) => { const [gx, gy] = U(x, y); return fence(gx, gy, dir, lv); };
  const at = (sx, sy) => [sx, sy], base = [], stand = [];
  const D = L.deco, push = (y, svg) => stand.push({ d: y, svg });
  /* ---- lớp mặt đất ---- */
  if (L.pond) base.push(pond([330, 300]));
  /* mảng đá cuội lát sân gần ao (như ảnh) */
  if (D >= 1) { const r = rng(5); for (let i = 0; i < 26; i++) { const x = 70 + r() * 240, y = 120 + r() * 100; base.push({ d: 0, svg: ell(x, y + 2, 16 + r() * 6, 8, "#8F8B83", null) + ell(x, y, 16 + r() * 6, 8, "#B7B3AB", "#807C74", 2) }); } }
  /* lối đá: đường chính + nhánh trái (chuồng, bò) + nhánh phải (kho, lò) + nhánh ra ruộng */
  const stones = (pl, k0) => pl.forEach(([x, y], k) => [[0, 0], [.55, -.2], [-.5, .25]].forEach(([dx, dy], q) => { const r = rng((k + k0) * 9 + q * 3 + 3), ox = x + dx * 70 + (r() - .5) * 10, oy = y + dy * 26; base.push({ d: 0, svg: ell(ox, oy + 2, 24 + r() * 8, 11 + r() * 3, "#8F8B83", null) + ell(ox, oy, 24 + r() * 8, 11 + r() * 3, "url(#gStone)", "#807C74", 2.2) + `<path d="M${f(ox - 12)} ${f(oy - 4)}Q${f(ox)} ${f(oy - 9)} ${f(ox + 10)} ${f(oy - 5)}" stroke="#fff" stroke-width="2.4" fill="none" opacity=".65" stroke-linecap="round"/>` }); }));
  if (L.path) {
    stones([[548, 880], [566, 830], [582, 780], [598, 730], [620, 680], [646, 632], [676, 580], [698, 530], [708, 490]], 0);
    if (D >= 1) { stones([[560, 650], [506, 668], [452, 686], [398, 704], [344, 722]], 40); stones([[770, 520], [826, 508], [882, 496], [938, 484]], 80); stones([[650, 606], [706, 620], [762, 634]], 120); }
    if (D >= 2) { stones([[960, 440], [1010, 415], [1060, 392]], 160); stones([[460, 560], [410, 540], [360, 520]], 200); }
  }
  /* nhiều thửa ruộng: [gốc (x,y), số ô theo a, số ô theo b]; mở dần theo L.plots (A 9 ô, B 6, E 6, C 3, F 2) */
  const cyc = [[cropWheat, true], [cropCarrot, true], [cropCorn, false], [cropStraw, true], [cropWheat, true], [cropTomato, true], [cropSun, false], [cropCarrot, false], [cropStraw, true], [cropWheat, true]];
  const FIELDS = [[[810, 590], 3, 3], [[352, 770], 3, 2], [[256, 508], 3, 2], [[940, 810], 4, 1], [[966, 214], 2, 1], [[1100, 700], 2, 2], [[120, 330], 3, 2], [[640, 800], 3, 2], [[1180, 420], 2, 2], [[520, 220], 3, 1], [[60, 200], 3, 2], [[1150, 220], 2, 2], [[200, 640], 3, 2], [[1180, 560], 2, 2], [[900, 130], 3, 1]];
  let left = L.plots, ci = 0, pidx = 0; const nGray = Math.max(0, L.plots - L.planted), grayIdx = new Set(Array.from({ length: nGray }, (_, k) => Math.min(L.plots - 1, Math.floor((k + 1) * L.plots / (nGray + 1)))));
  for (const [fo, na, nb] of FIELDS) for (let b = 0; b < nb; b++) for (let a = 0; a < na; a++) { if (left <= 0) break; left--; const planted = !grayIdx.has(pidx++), cp = planted ? cyc[ci++ % cyc.length] : null, tl = [fo[0] + (a - b) * TW / 2, fo[1] + (a + b) * TH / 2];
    const A = tl, B = [tl[0] + TW / 2, tl[1] + TH / 2], Cc = [tl[0], tl[1] + TH], Dd = [tl[0] - TW / 2, tl[1] + TH / 2], lvl = L.plots >= 4 ? 3 : 2;
    let o;
    if (planted) { o = poly([A, B, Cc, Dd], "url(#gSoil)", lvl >= 3 ? "#7A4B24" : C.soilD, lvl >= 3 ? 7 : 3); for (let k = 1; k < 5; k++) { const p = lerp(A, Dd, k / 5), q = lerp(B, Cc, k / 5); o += `<path d="M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}" stroke="${C.soilD}" stroke-width="2.6" opacity=".45" stroke-linecap="round"/>`; } if (lvl >= 3) o += poly([A, B, Cc, Dd], "none", "#C58B4E", 3); }
    else { /* đất xám chưa trồng: chạm để chọn cây */
      o = poly([A, B, Cc, Dd], "url(#gGray)", "#6E6A63", 5) + poly([A, B, Cc, Dd], "none", "#CFCBC3", 2.4); const r = rng(pidx * 13 + 1);
      for (let k = 0; k < 5; k++) { const q = lerp(lerp(A, Dd, r()), lerp(B, Cc, r()), r()); o += ell(q[0], q[1], 3.4 + r() * 2.4, 2, "#8F8B83", null).replace("/>", ' opacity=".7"/>'); }
      for (let k = 1; k < 4; k++) { const p = lerp(A, Dd, k / 4), q = lerp(B, Cc, k / 4); o += `<path d="M${f(p[0] + 10)} ${f(p[1])}L${f(q[0] - 10)} ${f(q[1])}" stroke="#8F8B83" stroke-width="1.8" stroke-dasharray="6 9" opacity=".5" stroke-linecap="round"/>`; } }
    base.push({ d: 1, svg: o });
    if (!planted) continue;
    let cr = ""; for (let k = 0; k < 4; k++) for (let m = 0; m < 4; m++) { const p = lerp(lerp(A, Dd, (k + .5) / 4), lerp(B, Cc, (k + .5) / 4), (m + .5) / 4); cr += cp[0](p[0], p[1] + 8, cp[1]); }
    push(Cc[1] - 8, `<g transform="translate(${f(tl[0])} ${f(tl[1] + TH / 2)}) scale(1.35) translate(${f(-tl[0])} ${f(-(tl[1] + TH / 2))})">${cr}</g>`); }
  /* tường đá / rào quanh sân (hình thoi: Lc(440,386) Bc(648,282) Rc(908,412) Fc(700,516)) */
  if (L.fence) {
    for (let k = 0; k < 4; k++) push(282 + 26 * k + 12, fenceAt(648 - 52 * k, 282 + 26 * k, "y", L.fence).svg);                 /* cạnh trái-sau */
    for (let k = 0; k < 5; k++) push(282 + 26 * k + 14, fenceAt(648 + 52 * k, 282 + 26 * k, "x", L.fence).svg);                 /* cạnh phải-sau */
    if (D >= 1) { for (let k = 0; k < 2; k++) push(386 + 26 * k + 14, fenceAt(440 + 52 * k, 386 + 26 * k, "x", L.fence).svg); for (let k = 0; k < 2; k++) push(412 + 26 * k + 12, fenceAt(908 - 52 * k, 412 + 26 * k, "y", L.fence).svg); }
       /* rào gỗ quanh bãi bò */
  }
  /* ---- công trình ---- */
  if (L.windmill) push(330, windmill(at(1170, 330), L.windmill).svg);
  if (L.barn) push(580, barn(at(1090, 580), L.barn).svg);
  if (L.house) push(440, house(at(650, 440), L.house).svg);
  if (L.well) push(540, well(at(470, 540), L.well).svg);
  if (D >= 3) { push(330, press(880, 340)); push(380, oven(1020, 380)); }
  if (D >= 2) { push(440, table(1205, 425)); push(500, coop(380, 470)); }
  /* ---- cây, bụi, đá ---- */
  /* hàng cây sát nhau quanh rìa + vườn cây ăn quả nhiều loại */
  const forest = [[25, 200, "pine", 1.2], [95, 150, "oak", 1.0], [165, 215, "pine", 1.1], [250, 150, "pine", 1.15], [345, 118, "oak", .9], [440, 160, "pine", 1.0], [520, 120, "oak", .95], [600, 168, "pine", .95], [680, 128, "oak", .9], [760, 160, "pine", 1.0], [850, 120, "oak", .9], [930, 150, "pine", 1.0], [1010, 118, "oak", .85], [1090, 150, "pine", 1.0], [1180, 130, "oak", .95], [1255, 190, "pine", 1.15], [1235, 690, "oak", 1.1], [20, 330, "oak", 1.0], [70, 420, "pine", 1.0], [1255, 330, "pine", 1.0], [1250, 450, "oak", .95], [1255, 580, "pine", 1.0]];
  /* hàng trên: nhiều VỊ TRÍ cây lớn; bé đã mở cây nào thì cây đó đứng ở đó, chưa mở thì hiện chỗ trống (vòng đất + dấu +) */
  const TOP = [[60, 150], [160, 120], [262, 158], [372, 120], [482, 150], [592, 118], [702, 150], [812, 118], [922, 150], [1032, 118], [1142, 150], [1240, 120], [110, 235], [1190, 235]], topKinds = ["mango", "apple", "orange", "litchi", "pear", "plum", "peach", "pomelo"], nTop = [2, 5, 9, 11][Math.min(D, 3)];
  TOP.forEach(([x, y], q) => { if (q < nTop) push(y, bigTree(x, y, .85, topKinds[q % topKinds.length])); else base.push({ d: 0, svg: G(x, y, ell(0, 0, 40, 15, "url(#gSoil)", "#7A4B24", 4).replace("/>", ' opacity=".55"/>') + ell(0, -1, 40, 15, "none", "#fff", 3).replace("/>", ' stroke-dasharray="9 7"/>') + `<path d="M-9 0H9M0 -7V7" stroke="#fff" stroke-width="4.4" stroke-linecap="round"/>`) }); });
  const fruitKinds = ["mango", "apple", "orange", "pomelo", "litchi", "pear", "plum", "peach"]; let pk = 0; forest.slice(0, [9, 16, 22, forest.length][Math.min(D, 3)]).filter((_, q) => q === 100).forEach(([x, y, k, sc], q) => push(y, bigTree(x, y, sc * .9, fruitKinds[(q * 3 + pk++) % fruitKinds.length])));
  if (L.apple) { const kinds = ["apple", "orange", "pear", "apple", "peach", "orange"]; const orch = [[60, 560], [150, 610], [235, 660], [60, 680], [150, 730], [235, 780], [60, 800], [150, 850], [120, 500], [30, 450]]; orch.filter((_, k) => k % 8 === 0 && k > 0).forEach(([x, y], k) => push(y, bigTree(x, y, .8, kinds[k % kinds.length]))); }
  [[540, 610, 1]].forEach(([x, y, sc]) => push(y, bush(x, y, sc)));
  if (L.flowers) { [[520, 805], [480, 700]].forEach(([x, y]) => push(y, lavender(x, y, 1.2))); [[620, 655], [668, 702], [756, 742], [840, 770], [930, 740], [980, 690], [1020, 640]].forEach(([x, y]) => push(y, lavender(x, y, 1.05))); }
  [[410, 400, 1], [560, 220, .8], [1080, 720, .9], [760, 800, .8], [180, 330, .9], [1180, 700, 1]].forEach(([x, y, sc]) => push(y, rock(x, y, sc)));
  /* ---- vật nhỏ làm dày cảnh ---- */
  if (L.hay) { [[960, 640], [1010, 662]].forEach(([x, y]) => push(y, hay(x, y))); [[560, 470, 1.1], [600, 490, 1]].forEach(([x, y, sc]) => push(y, barrel(x, y, sc))); }
  if (D >= 1) { push(470, milkcans(740, 488)); push(330, roundHay(960, 400)); push(570, roundHay(1215, 560)); push(600, crate(860, 560)); push(432, hedge(760, 466, 3, "x")); [[570, 560], [420, 520]].forEach(([x, y]) => push(y, flowerPatch(x, y, "#FFD24D"))); push(520, pumpkins(1190, 500)); }
  if (D >= 2) { push(520, hedge(380, 456, 3, "x")); [[1040, 470], [440, 460], [1100, 360]].forEach(([x, y], q) => push(y, flowerPatch(x, y, q % 2 ? "#FF8FB0" : "#FFD24D"))); push(620, barrel(1210, 600, 1)); push(840, crate(830, 800)); }
  if (D >= 3) { push(300, hay(1110, 290)); push(760, pumpkins(920, 790)); [[790, 330], [800, 352]].forEach(([x, y]) => push(y, barrel(x, y, .9))); }
  if (L.animals) { [[610, 770], [660, 810]].forEach(([x, y]) => push(y, chicken(x, y))); push(600, rabbit(420, 560)); if (D >= 2) { push(180, chicken(150, 600)); } }
  if (D >= 1) { [[470, 600], [520, 640]].forEach(([x, y]) => push(y, chicken(x, y))); push(610, rabbit(560, 620)); }
  if (D >= 2) { [[560, 780], [610, 820], [700, 850]].forEach(([x, y]) => push(y, chicken(x, y))); push(830, rabbit(740, 830)); push(560, rabbit(1000, 700)); push(640, coop(820, 720)); }
  if (D >= 3) { [[300, 700, 1], [420, 710, 0], [520, 740, 1], [880, 760, 0], [1010, 760, 1], [1120, 600, 0], [1180, 760, 1], [330, 820, 0]].forEach(([x, y, fl]) => push(y, cow(x, y, .85, !!fl))); [[240, 640], [940, 700], [1060, 640], [760, 700], [980, 840]].forEach(([x, y]) => push(y, chicken(x, y))); [[1100, 790], [250, 700], [850, 600], [700, 640], [180, 760], [1060, 520]].forEach(([x, y]) => push(y, rabbit(x, y))); [[120, 830, 0], [640, 860, 1], [760, 780, 0], [990, 840, 1], [200, 560, 0], [1200, 700, 1]].forEach(([x, y, fl]) => push(y, cow(x, y, .85, !!fl))); [[100, 700], [340, 650], [820, 870], [1150, 650], [60, 600], [1000, 590], [560, 700]].forEach(([x, y]) => push(y, chicken(x, y))); push(760, coop(1020, 600)); [[300, 740], [440, 770], [880, 800]].forEach(([x, y]) => push(y, hay(x, y))); for (let k = 0; k < 4; k++) push(740 + k * 20, fenceAt(260 + 52 * k, 650 + 26 * k, "x", 2).svg); }
  items.push(...base, ...stand);
  const ground0 = items.filter(i => i.d <= 1), up = items.filter(i => i.d > 1).sort((a, b) => a.d - b.d); items.length = 0; items.push(...ground0, ...up);
  /* trời + thời điểm trong ngày */
  const tint = { day: null, dusk: ["#FF8A3D", .28], night: ["#12163A", .55] }[time];
  const sky = time === "day" ? `<rect width="${W}" height="150" fill="url(#gSkyDay)"/>` : time === "dusk" ? `<rect width="${W}" height="150" fill="#F9A66B"/><rect y="60" width="${W}" height="90" fill="#FFD08A" opacity=".6"/>` : `<rect width="${W}" height="150" fill="#14183F"/>`;
  let over = "";
  if (tint) over += `<rect width="${W}" height="${H}" fill="${tint[0]}" opacity="${tint[1]}"/>`;
  if (time === "night") {
    for (let i = 0; i < 40; i++) over += `<circle cx="${f(R() * W)}" cy="${f(R() * 140)}" r="${f(1 + R() * 1.6)}" fill="#fff" opacity="${f(.5 + R() * .5)}"/>`;
    over += `<circle cx="1120" cy="60" r="34" fill="#FFF3C4"/><circle cx="1132" cy="52" r="30" fill="#14183F" opacity=".0"/>`;
    [[520, 340, 62], [560, 372, 62], [612, 384, 60], [470, 500, 56], [1010, 452, 70], [700, 470, 54], [1058, 380, 64], [900, 300, 54]].forEach(([x, y, r]) => over += `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gGlow)"/>`);
    for (let i = 0; i < 18; i++) over += `<circle cx="${f(200 + R() * 880)}" cy="${f(300 + R() * 480)}" r="${f(2 + R() * 2)}" fill="#E8FF8A" opacity="${f(.5 + R() * .5)}"/>`;
  }
  if (time === "dusk") { over += `<circle cx="1060" cy="120" r="46" fill="#FFB562" opacity=".9"/>`; }
  /* sinh vật bay */
  let fly = ""; if (time !== "night") { [[300, 360], [820, 300], [560, 520]].forEach(([x, y], i) => fly += i === 1 ? bee(x, y, i * .7) : butterfly(x, y, i * .6, i ? "#FFB347" : "#FF8FB0")); }
  const body = (o.crop ? "" : "") + items.map(i => i.svg).join("");
  const view = o.view || [0, 0, W, H];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view.join(" ")}" role="img" aria-label="${o.label || "Khu vườn Học Vui"}" data-style="pop" data-game="garden-scene">
<title>${o.label || "Khu vườn Học Vui"}</title>${STYLE}${defs()}${sky}<g>${far}</g>${ground}${body}${fly}${over}${o.overlay || ""}</svg>
`;
}

const SCENES = [
  ["01-toan-canh", "Toàn cảnh khu vườn (ban ngày): nhà ngói, tường đá, ruộng, cây táo, ao, cối xay gió, kho", {}],
  ["02-cap-1", "Cấp 1: mới bắt đầu, lều lá, rào tre, một ô trồng", { levels: { deco: 0, house: 1, fence: 1, well: 1, barn: 0, windmill: 0, plots: 2, planted: 1, path: 0, apple: 0, flowers: 0, pond: 1, hay: 0, animals: 0 } }],
  ["03-cap-2", "Cấp 2: nhà tranh, rào gỗ, giếng xây, hai ô trồng", { levels: { deco: 1, house: 2, fence: 2, well: 2, barn: 1, windmill: 1, plots: 6, planted: 3, path: 1, apple: 0, flowers: 1, pond: 1, hay: 0, animals: 0 } }],
  ["04-cap-3", "Cấp 3: nhà tường, tường đá, kho, cối xay, bốn ô trồng", { levels: { deco: 2, house: 3, fence: 3, well: 2, barn: 2, windmill: 2, plots: 12, planted: 8, path: 1, apple: 1, flowers: 1, pond: 1, hay: 1, animals: 0 } }],
  ["05-hoang-hon", "Hoàng hôn (cùng khu vườn, cấp đầy đủ)", { time: "dusk" }],
  ["06-ban-dem", "Ban đêm: đèn sáng, đom đóm, trăng", { time: "night" }]
];
const files = {};
for (const [id, label, o] of SCENES) files[`scene-${id}.svg`] = scene(Object.assign({ label }, o));
/* ảnh cận cảnh: cắt vùng của cùng cảnh */
const CLOSE = [
  ["07-nha-4-cap", "Cận cảnh ngôi nhà qua 4 cấp: lều lá → nhà tranh → nhà tường → nhà ngói", null],
  ["08-rao-duong", "Cận cảnh hàng rào (tre, gỗ, đá) và lối đá lát", null],
  ["09-ruong-cay", "Cận cảnh ruộng, cây táo, hoa oải hương, bụi cây", [40, 480, 900, 400]],
  ["10-cong-trinh", "Cận cảnh công trình: kho, giếng, cối xay gió, rơm, thùng, vật nuôi", [420, 110, 860, 520]],
  ["11-chon-cay", "Đất xám trống: bé chạm chọn cây muốn trồng (đất xám → đất nâu có cây)", null]
];
files["scene-09-ruong-cay.svg"] = scene({ label: CLOSE[2][1], view: CLOSE[2][2] });
files["scene-10-cong-trinh.svg"] = scene({ label: CLOSE[3][1], view: CLOSE[3][2] });
/* 07: bốn ngôi nhà cạnh nhau trên nền cỏ; 08: ba kiểu rào + lối đá */
function strip(label, makers, w, h, bg) {
  const R = rng(11); let g = `<rect width="${w}" height="${h}" fill="url(#gGrass)"/>`; for (let i = 0; i < 60; i++) g += tuft(R() * w, 60 + R() * (h - 60), .8 + R() * .5);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" data-style="pop"><title>${label}</title>${STYLE}${defs()}${g}${makers}</svg>\n`;
}
{
  const item = (gx, gy, fn) => fn;
  let s = "";
  [1, 2, 3, 4].forEach((lv, i) => { const cx = 190 + i * 340, hs = house([cx + (lv === 1 ? 0 : 60), 560], lv); s += `<g transform="translate(${f(cx * .0)} 0)">${hs.svg}</g>`; s += `<text x="${cx + 20}" y="660" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="30" fill="#2F5A22">${["Cấp 1: lều lá", "Cấp 2: nhà tranh", "Cấp 3: nhà tường", "Cấp 4: nhà ngói"][i]}</text>`; });
  files["scene-07-nha-4-cap.svg"] = strip(CLOSE[0][1], s, 1400, 720);
  let r = "";
  [1, 2, 3].forEach((lv, i) => { const base = [140 + i * 440, 250]; for (let k = 0; k < 4; k++) { const A = [base[0] + k * 52, base[1] + k * 26]; const fx = fence(0, 0, "x", lv); r += `<g transform="translate(${A[0] - P(0, 0)[0]} ${A[1] - P(0, 0)[1]})">${fx.svg}</g>`; } r += `<text x="${base[0] + 120}" y="380" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="30" fill="#2F5A22">${["Rào tre", "Rào gỗ", "Tường đá"][i]}</text>`; });
  /* ba kiểu lối đi: đất, cuội, đá lát */
  const pp = (lv, i) => { const y0 = 470, x0 = 120 + i * 440; let o = ""; for (let k = 0; k < 6; k++) { const x = x0 + k * 46, y = y0 + (k % 2) * 8, rr = rng(lv * 20 + k);
    if (lv === 1) o += ell(x, y + 6, 26, 12, "#A8703F", null).replace("/>", ' opacity=".7"/>') + ell(x + (rr() - .5) * 20, y + 8, 3.4, 2.4, "#C9A57A", null);
    else if (lv === 2) o += ell(x, y + 4, 24 + rr() * 4, 11, "#8F8B83", null) + ell(x, y + 2, 24 + rr() * 4, 11, "url(#gStone)", "#807C74", 2.2);
    else o += poly([[x, y - 12], [x + 30, y], [x, y + 12], [x - 30, y]], "url(#gStone)", "#807C74", 2.4) + `<path d="M${x - 14} ${y - 4}L${x} ${y - 10}" stroke="#fff" stroke-width="2.4" opacity=".6" stroke-linecap="round"/>`; }
    return o + `<text x="${x0 + 120}" y="${y0 + 70}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="30" fill="#2F5A22">${["Đường đất", "Lối cuội", "Đá lát"][lv - 1]}</text>`; };
  [1, 2, 3].forEach((lv, i) => r += pp(lv, i));
  files["scene-08-rao-duong.svg"] = strip(CLOSE[1][1], r, 1400, 580);
}
/* ảnh 11: màn "chọn cây để trồng" — nền cỏ sạch, các ô nâu đã trồng và một ô đất xám đang được chọn */
{
  const names = ["Lúa mì", "Cà rốt", "Bắp", "Dâu", "Cà chua", "Hướng dương"], fns = [cropWheat, cropCarrot, cropCorn, cropStraw, cropTomato, cropSun], ripe = [1, 1, 0, 1, 1, 0], R2 = rng(21);
  let g = `<rect width="1000" height="640" fill="url(#gGrass)"/>`; for (let i = 0; i < 90; i++) g += tuft(R2() * 1000, 40 + R2() * 600, .8 + R2() * .5);
  const cellsXY = [[250, 440], [354, 492], [458, 544], [146, 492], [250, 544], [354, 596], [562, 440], [666, 492], [770, 440]];
  const gray = [3, 8], pl = [cropWheat, cropCarrot, cropCorn, cropStraw, cropTomato, cropSun, cropWheat, cropCarrot, cropStraw];
  cellsXY.forEach(([cx0, cy0], k) => { const A = [cx0, cy0 - TH / 2], B = [cx0 + TW / 2, cy0], Cc = [cx0, cy0 + TH / 2], Dd = [cx0 - TW / 2, cy0]; const isG = k === 3;
    if (isG) { g += poly([A, B, Cc, Dd], "url(#gGray)", "#6E6A63", 5) + poly([A, B, Cc, Dd], "none", "#fff", 4).replace("/>", ' stroke-dasharray="10 8"/>'); for (let q = 0; q < 6; q++) { const t = lerp(lerp(A, Dd, R2()), lerp(B, Cc, R2()), R2()); g += ell(t[0], t[1], 3.4 + R2() * 2, 2, "#8F8B83", null); } }
    else { g += poly([A, B, Cc, Dd], "url(#gSoil)", "#7A4B24", 6) + poly([A, B, Cc, Dd], "none", "#C58B4E", 3); let cr = ""; for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) { const t = lerp(lerp(A, Dd, (a + .5) / 4), lerp(B, Cc, (a + .5) / 4), (b + .5) / 4); cr += pl[k % pl.length](t[0], t[1] + 8, k % 3 !== 2); } g += `<g transform="translate(${cx0} ${cy0}) scale(1.35) translate(${-cx0} ${-cy0})">${cr}</g>`; } });
  const px = 146, py = 492, bw = 560, bh = 176, bx = 20, by = 130;
  let ov = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="26" fill="#000" opacity=".16" transform="translate(0 8)"/><path d="M${px - 20} ${by + bh - 2}L${px} ${by + bh + 34}L${px + 20} ${by + bh - 2}Z" fill="#fff"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="26" fill="#fff" stroke="#E3DDEF" stroke-width="3"/>` +
    `<text x="${bx + bw / 2}" y="${by + 38}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="26" fill="#2B2150">Trồng cây gì?</text>`;
  names.forEach((nm, i) => { const cx2 = bx + 66 + i * 86, cy2 = by + 100, sel = i === 1; ov += `<g><circle cx="${cx2}" cy="${cy2}" r="36" fill="${sel ? "#FFE9B0" : "#F2EEFA"}" stroke="${sel ? "#F2A100" : "#DAD3EA"}" stroke-width="${sel ? 5 : 3}"/><g transform="translate(${cx2} ${cy2 + 16}) scale(1.05)">${fns[i](0, 0, !!ripe[i])}</g><text x="${cx2}" y="${cy2 + 58}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="13" fill="#4B3FA0">${nm}</text></g>`; });
  files["scene-11-chon-cay.svg"] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 640" role="img" aria-label="Chọn cây để trồng trên ô đất xám" data-style="pop"><title>Chọn cây để trồng</title>${STYLE}${defs()}${g}${ov}</svg>\n`;
}
for (const [n, c] of Object.entries(files)) fs.writeFileSync(path.join(out, n), c);
const ids = [...SCENES.map(s => [s[0], s[1]]), ...CLOSE.map(c => [c[0], c[1]])].sort();
const A = 'style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px"';
const nav = `<nav class="rvnav" style="position:sticky;top:0;z-index:99;display:flex;gap:6px 14px;flex-wrap:wrap;align-items:center;padding:8px 16px;background:#1a1d33;color:#fff;font:600 13px system-ui"><b style="opacity:.7">Duyệt Học Vui:</b><a ${A} href="../../../learn/mascot-review.html">🐾 Linh vật theo bố cục học</a><a ${A} href="../../../learn/index.html">Trang học</a><a ${A} href="../brand-learn.html">Thương hiệu 3 môn</a><a ${A} href="../learn/mascot_sheet.html">Bảng 3×5 lớp</a><a ${A} href="../preview-learn.html">3 bản base</a><a ${A} href="../preview-emotions.html">Cảm xúc</a><a ${A} href="preview-garden.html">🌸 Vườn hoa</a><a ${A} href="preview-crops.html">🌾 Thu hoạch (cây trồng)</a><span style="padding:4px 10px;border-radius:99px;background:#fff;color:#1a1d33">🏡 Khu vườn</span></nav>`;
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Khu vườn Học Vui: ảnh duyệt</title>
<style>:root{--ink:#1d1a33;--bg:#F6F4F1;--panel:#fff;--line:#E3DDEF}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:24px 16px 70px}h1{font-size:clamp(26px,5vw,40px);margin:0 0 6px;font-weight:900}p.n{color:#5b5578;max-width:52em;margin:0 0 14px}
.shot{margin:0 0 26px;background:var(--panel);border:1px solid var(--line);border-radius:22px;overflow:hidden}.shot img{display:block;width:100%;height:auto}.shot figcaption{padding:12px 18px;font-weight:800}.shot figcaption span{color:#7a7499;font-weight:600;margin-right:8px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}@media (max-width:760px){.grid{grid-template-columns:1fr}}</style></head><body>${nav}<div class="wrap">
<h1>Khu vườn Học Vui — ảnh duyệt</h1>
<p class="n">Cảnh dựng sẵn góc nhìn chéo (isometric), phong cách "đồ chơi mềm". Mỗi vật có <b>cấp độ</b>: bé đạt gì thì nâng cấp đúng vị trí đó (ảnh 2–4 và 7–8 cho thấy cấp). Ảnh 1 là toàn cảnh đầy đủ; 5–6 là buổi trong ngày; 9–10 là cận cảnh; <b>ảnh 11 là màn chọn cây để trồng trên ô đất xám</b> (đất xám trống → bé chọn cây → đất nâu có cây). Đây là <b>bản đề xuất để duyệt</b>, chủ site sẽ thay từng phần để tối ưu. Sinh bằng <code>node scripts/learn/gen-scene-art.js</code>, không sửa tay.</p>
${ids.map(([id, label], i) => `<figure class="shot"><img src="scene/scene-${id}.svg" alt="${label}" loading="${i < 2 ? "eager" : "lazy"}"><figcaption><span>Ảnh ${i + 1}/${ids.length}</span>${label}</figcaption></figure>`).join("")}
</div></body></html>
`;
fs.writeFileSync(path.join(out, "..", "preview-scene.html"), html);
console.log("✓ đã sinh " + Object.keys(files).length + " ảnh cảnh + preview-scene.html");
