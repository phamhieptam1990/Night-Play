/* Cảnh vườn Học Vui — hình học isometric, màu, bóng đổ, hộp.
   Một phần của scripts/learn/gen-scene-art.js (nạp bằng require, dùng đối tượng chung SP). */
"use strict";
module.exports = function (SP) {
const fs = require("fs"), path = require("path");
const out = path.join(__dirname, "../../shared/art/garden/scene");
fs.mkdirSync(out, { recursive: true });

const W = 1280, H = 880, TW = 104, TH = 52, OX = 640, OY = 96;
const f = n => Math.round(n * 10) / 10;
const P = (gx, gy) => [OX + (gx - gy) * TW / 2, OY + (gx + gy) * TH / 2];
const pts = a => a.map(p => f(p[0]) + "," + f(p[1])).join(" ");
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(
    t ^ t >>> 7, 61 | t) ^ t; return ((
    t ^ t >>> 14) >>> 0) / 4294967296; }; }
const G = (x, y, inner, cls) => `<g${cls ? ` class="${cls}"` : ""} transform="translate(${f(x)} ${f(y)})">${inner}</g>`;
const poly = (p, fill, stroke, sw) => `<polygon points="${pts(p)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw ||
    3}" stroke-linejoin="round"` : ""}/>`;
const ell = (cx, cy, rx, ry, fill, stroke, sw) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${stroke ?
    ` stroke="${stroke}" stroke-width="${sw || 3}"` : ""}/>`;
const SHADOW = require("./garden-shadow-art")({ ell });   /* bóng đổ: hướng, độ dài, màu theo buổi ở garden-shadow-art.js */
const shadow = (rx, ry, o) => SHADOW.make(rx, ry, o);

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
  roofRed1: "#E0553E", roofRed2: "#B23A2A", roofRedD: "#7E2418", wall: "#F6EFE3", wallS: "#E4D8C4", wallD: "#9C8B72", straw1: "#F0CB62", straw2:
      "#D9A93A", strawD: "#9A7016",
  water1: "#7FD3F2", water2: "#3FA3D9", waterD: "#2B73A6"
};

  SP.fs = fs; SP.path = path; SP.out = out; SP.W = W; SP.H = H; SP.TW = TW; SP.TH = TH; SP.OX = OX; SP.OY = OY; SP.f = f; SP.P = P; SP.rng = rng;
  SP.G = G; SP.poly = poly; SP.ell = ell; SP.SHADOW = SHADOW; SP.shadow = shadow; SP.box = box; SP.lerp = lerp; SP.C = C;
};
