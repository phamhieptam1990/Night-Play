#!/usr/bin/env node
/* SINH bộ TRANG TRÍ theo lớp cho Vườn thú (chuồng) và Khu chợ (sạp), Học Vui. Lớp càng cao trang trí càng giàu, mỗi lớp một bảng màu.
   Chạy: node scripts/art/gen-hocvui-deco.js -> learn/vuon-thu/art/deco-g<N>.svg (300x300, đè lên chuồng) và learn/khu-cho/art/deco-g<N>.svg (240x210, đè lên sạp).
   Phong cách Pop mềm: tròn, không viền đen, không filter/image; màu cứng vì đây là đồ trang trí (không phải linh vật). */
"use strict";
const fs = require("fs"), path = require("path");
const DIRS = { pen: path.join(__dirname, "../../learn/vuon-thu/art"), shop: path.join(__dirname, "../../learn/khu-cho/art") };
const PAL = [["#FF8FB1", "#FFD1E0", "#FFF3F7"], ["#FFB04D", "#FFE08A", "#FFF6D6"], ["#43BE85", "#BDEBC9", "#EAFBF1"], ["#6C9BFF", "#C9B8FF", "#EEF2FF"], ["#FFC93C", "#FF6B6B", "#FFF1B8"]];
const NAME = ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"];
const svg = (vb, body, label) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" role="img" aria-label="' + label + '"><title>' + label + "</title>" + body + "</svg>\n";
const f1 = v => (+v).toFixed(1);
/* ---- nét vẽ nhỏ ---- */
const flower = (x, y, c, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0v12" stroke="#3E8A32" stroke-width="2.600" stroke-linecap="round"/>`
  + [0, 72, 144, 216, 288].map(a => `<circle cx="${f1(Math.cos(a * Math.PI / 180) * 5.500)}" cy="${f1(-Math.sin(a * Math.PI / 180) * 5.500)}" r="4.200" fill="${c}"/>`).join("") + '<circle r="3.400" fill="#FFE066"/></g>';
const pot = (x, y, c, c2) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="3" rx="16" ry="4" fill="#000" opacity=".14"/><path d="M-13-16h26l-4 18h-18z" fill="${c}"/><rect x="-15" y="-21" width="30" height="8" rx="4" fill="${c2}"/>`
  + `<path d="M-13-16h7l-2 18h-5z" fill="#fff" opacity=".25"/>${flower(-6, -22, c2, .9)}${flower(6, -23, "#fff", .8)}${flower(0, -27, c, .9)}</g>`;
const star = (x, y, r, c, c2) => { let p = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r * .46 : r; p += (i ? "L" : "M") + f1(x + Math.cos(a) * k) + " " + f1(y + Math.sin(a) * k); }
  return `<path d="${p}Z" fill="${c}" stroke="${c2}" stroke-width="2" stroke-linejoin="round"/>`; };
const lantern = (x, y, c, c2) => `<g transform="translate(${x} ${y})"><circle cy="6" r="17" fill="${c2}" opacity=".35"/><rect x="-2" y="-16" width="4" height="8" rx="2" fill="#8A5A12"/><rect x="-8" y="-9" width="16" height="4" rx="2" fill="#E0A82E"/>`
  + `<ellipse cy="5" rx="11" ry="13" fill="${c}"/><ellipse cx="-3.500" cy="1" rx="3.500" ry="6" fill="#fff" opacity=".4"/><rect x="-6" y="16" width="12" height="3" rx="1.500" fill="#E0A82E"/><path d="M0 19v7" stroke="#E0A82E" stroke-width="2" stroke-linecap="round"/></g>`;
const pole = (x, y0, y1) => `<rect x="${x - 3}" y="${y0}" width="6" height="${y1 - y0}" rx="3" fill="#B07F44"/><rect x="${x - 3}" y="${y0}" width="2.400" height="${y1 - y0}" rx="1.200" fill="#fff" opacity=".3"/>`;
/* dây cờ tam giác từ (x1,y1) tới (x2,y2), võng sag, n lá */
const bunting = (x1, y1, x2, y2, n, cols, sag) => {
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 + sag * 2; let s = `<path d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="#8A6A3A" stroke-width="2" stroke-linecap="round"/>`;
  for (let i = 1; i <= n; i++) { const t = i / (n + 1), x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
    s += `<path d="M${f1(x - 7)} ${f1(y - 1)}L${f1(x + 7)} ${f1(y - 1)}L${f1(x)} ${f1(y + 15)}Z" fill="${cols[i % cols.length]}" stroke="#fff" stroke-width="1.200" stroke-linejoin="round" opacity=".95"/>`; }
  return s;
};
const spark = (x, y, s, c) => `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${c}"/>`;
const balloon = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M0 22Q-4 34 2 44" fill="none" stroke="#8A6A3A" stroke-width="1.600"/><ellipse rx="10" ry="12.500" fill="${c}"/><ellipse cx="-3.500" cy="-4" rx="3" ry="4.500" fill="#fff" opacity=".45"/><path d="M-2.500 12.500h5l-2.500 4z" fill="${c}"/></g>`;
const banner = (x, y, w, c, c2) => `<g transform="translate(${x} ${y})"><path d="M${-w / 2} 0h${w}v16l-${w / 2 - 0}-6-${w / 2}6z" fill="${c}"/><rect x="${-w / 2}" y="0" width="${w}" height="4" rx="2" fill="${c2}"/><path d="M${-w / 2} 0h${w / 3}v13l-${w / 3}3z" fill="#fff" opacity=".2"/></g>`;

/* ---- CHUỒNG (300x300): trang trí hai bên + trên mái, giàu dần theo lớp; chừa giữa bãi để thấy thú ---- */
function pen(g) {
  const [a, b, c] = PAL[g - 1]; let s = "";
  s += flower(28, 250, a) + flower(44, 258, b, .9) + flower(272, 254, a) + flower(256, 262, b, .9);                         /* lớp 1: hoa ở hai góc */
  if (g >= 2) s += pot(22, 232, b, a) + pot(278, 236, a, b);                                                                 /* lớp 2: chậu hoa */
  if (g >= 3) s += pole(16, 150, 226) + lantern(16, 146, a, b) + pole(284, 150, 226) + lantern(284, 146, a, b);              /* lớp 3: cột đèn lồng */
  if (g >= 4) s += bunting(16, 128, 84, 52, 4, [a, b, c], 6) + bunting(284, 128, 216, 52, 4, [a, b, c], 6) + star(16, 112, 11, "#FFD24D", "#E0A82E") + star(284, 112, 11, "#FFD24D", "#E0A82E"); /* lớp 4: dây cờ + sao */
  if (g >= 5) s += banner(150, 4, 96, a, b) + star(150, 22, 14, "#FFD24D", "#E0A82E") + spark(60, 40, 9, "#fff") + spark(240, 36, 8, "#fff") + spark(150, 62, 7, "#FFE066"); /* lớp 5: biển + sao vàng + lấp lánh */
  return svg("0 0 300 300", s, "Trang trí chuồng " + NAME[g - 1]);
}
/* ---- QUÁN (240x210): dây cờ dọc mái, đèn, bóng bay, huy chương; giàu dần theo lớp ---- */
function shop(g) {
  const [a, b, c] = PAL[g - 1]; let s = "";
  s += bunting(6, 34, 234, 34, 7, [a, b, c, "#fff"], 9);                                                                     /* lớp 1: dây cờ dọc mái */
  s += flower(14, 200, a) + flower(226, 200, b);
  if (g >= 2) s += lantern(14, 52, a, b) + lantern(226, 52, a, b);                                                           /* lớp 2: đèn lồng hai bên */
  if (g >= 3) s += pot(14, 206, b, a) + pot(226, 206, a, b) + spark(40, 14, 7, "#fff") + spark(200, 12, 6, "#FFE066");       /* lớp 3: chậu hoa + lấp lánh */
  if (g >= 4) s += balloon(11, 112, a) + balloon(24, 120, b) + balloon(229, 114, b) + balloon(216, 122, c);                  /* lớp 4: bóng bay */
  if (g >= 5) s += banner(120, 2, 84, a, b) + star(120, 14, 11, "#FFD24D", "#E0A82E") + spark(70, 20, 8, "#fff") + spark(172, 22, 8, "#fff"); /* lớp 5: biển vàng + sao */
  return svg("0 0 240 210", s, "Trang trí quán " + NAME[g - 1]);
}
let n = 0;
for (let g = 1; g <= 5; g++) { fs.writeFileSync(path.join(DIRS.pen, "deco-g" + g + ".svg"), pen(g)); fs.writeFileSync(path.join(DIRS.shop, "deco-g" + g + ".svg"), shop(g)); n += 2; }
console.log("Đã sinh " + n + " tranh trang trí lớp -> vuon-thu/art + khu-cho/art");
