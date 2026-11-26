#!/usr/bin/env node
/* SINH tranh KHU CHỢ Tiếng Anh (Học Vui): nền phố chợ dọc/ngang (bg-p, bg-l), sạp từng lớp (stall-back-N / stall-front-N), đài phun nước, cây.
   Chạy: node scripts/art/gen-khu-cho.js  ->  learn/khu-cho/art/. Phong cách Pop 3D mềm (gradient + viền sáng + bóng). Biển hiệu/mái tái dùng learn/quan-kem/art/g<N>/. */
"use strict";
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "../../learn/khu-cho/art");
fs.mkdirSync(OUT, { recursive: true });
let n = 0; const put = (id, svg) => { fs.writeFileSync(path.join(OUT, id + ".svg"), svg); n++; };
let uid = 0; const gid = () => "k" + (uid++);
const svg = (w, h, body, label) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + label + '"><title>' + label + "</title>" + body + "</svg>";
const grad = (a, b, id, v) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (v ? 0 : 1) + '" y2="' + (v ? 1 : 0) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>';
const shade = (hex, k) => { const c = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))); return "#" + [c >> 16, (c >> 8) & 255, c & 255].map(f).map(v => v.toString(16).padStart(2, "0")).join(""); };

/* màu từng quán: tường, mái, nền quầy */
const SHOP = [
  { c: "#F58CB0", w: "#FFE3EE", g: "cone" }, { c: "#C98A55", w: "#FFEBD2", g: "cake" }, { c: "#F59A3A", w: "#FFF0C9", g: "juice" },
  { c: "#D9433F", w: "#FFE4DC", g: "pizza" }, { c: "#2F8F8B", w: "#DDF3EE", g: "book" }
];
/* hàng hoá nhỏ trên kệ, gốc (0,0) là đáy món, cao ~26 */
const goods = {
  cone: (x, y, i) => '<g transform="translate(' + x + " " + y + ')"><path d="M-7 -14L7 -14L0 0Z" fill="#E8B26A"/><circle cx="0" cy="-19" r="8" fill="' + ["#FFF3D6", "#FF9FBF", "#B6F0D4"][i % 3] + '"/><circle cx="-2.500" cy="-22" r="2.500" fill="#fff" opacity=".7"/></g>',
  cake: (x, y, i) => '<g transform="translate(' + x + " " + y + ')"><rect x="-9" y="-12" width="18" height="12" rx="3" fill="' + ["#FFB3C7", "#D9A066", "#FFD98A"][i % 3] + '"/><path d="M-9 -12Q0 -26 9 -12Z" fill="#FFF6EC"/><circle cx="0" cy="-20" r="3" fill="#E0334F"/></g>',
  juice: (x, y, i) => '<g transform="translate(' + x + " " + y + ')"><path d="M-8 -22L8 -22L6 0L-6 0Z" fill="' + ["#FFA53A", "#9BE06A", "#FF7B8B"][i % 3] + '" stroke="#fff" stroke-width="1.500"/><circle cx="7" cy="-23" r="5" fill="#FFD24D"/><path d="M2 -22L6 -32" stroke="#FF5A7A" stroke-width="2.500" stroke-linecap="round"/></g>',
  pizza: (x, y, i) => '<g transform="translate(' + x + " " + y + ')"><ellipse cx="0" cy="-8" rx="13" ry="9" fill="#F2B45A"/><ellipse cx="0" cy="-9" rx="10" ry="6.500" fill="#E8553F"/><circle cx="-4" cy="-10" r="2.200" fill="#FFE9A8"/><circle cx="4" cy="-8" r="2.200" fill="#7BC86C"/></g>',
  book: (x, y, i) => '<g transform="translate(' + x + " " + y + ')"><rect x="-9" y="-22" width="18" height="22" rx="2.500" fill="' + ["#6B8FD8", "#E8A04D", "#7CC39A"][i % 3] + '"/><rect x="-9" y="-22" width="4" height="22" fill="#000" opacity=".15"/><rect x="-3" y="-16" width="9" height="2.500" rx="1" fill="#fff" opacity=".8"/></g>'
};

function stallBack(s) {
  const a = gid(), b = gid();
  let sh = ""; for (let i = 0; i < 5; i++) sh += goods[s.g](52 + i * 34, 82, i);
  return svg(240, 170, "<defs>" + grad(s.w, shade(s.w, -0.1), a, 1) + grad("#6B3F2A", "#3F2418", b, 1) + "</defs>" +
    '<ellipse cx="120" cy="166" rx="112" ry="8" fill="#000" opacity=".16"/>' +
    '<rect x="12" y="24" width="216" height="130" rx="12" fill="url(#' + a + ')" stroke="' + shade(s.c, -0.25) + '" stroke-width="3"/>' +
    '<rect x="30" y="46" width="180" height="70" rx="8" fill="#5A3A52" opacity=".85"/><rect x="30" y="46" width="180" height="70" rx="8" fill="none" stroke="' + shade(s.c, 0.3) + '" stroke-width="3"/>' +
    '<rect x="34" y="86" width="172" height="6" rx="3" fill="url(#' + b + ')"/>' + sh +
    '<rect x="6" y="30" width="12" height="130" rx="5" fill="#8A5A38"/><rect x="222" y="30" width="12" height="130" rx="5" fill="#8A5A38"/>' +
    '<rect x="8" y="32" width="4" height="124" rx="2" fill="#fff" opacity=".25"/><rect x="224" y="32" width="4" height="124" rx="2" fill="#fff" opacity=".25"/>', "Sạp " + s.g);
}
function stallFront(s, i) {
  const a = gid(), b = gid(), c = gid(); let st = "", dots = "";
  for (let k = 0; k < 6; k++) st += '<path d="M' + (k * 40) + " 4h40v26a20 17 0 0 1 -40 0z\" fill=\"" + (k % 2 ? "#FFFDF6" : s.c) + '"/>';
  for (let k = 0; k < 7; k++) dots += '<circle cx="' + (22 + k * 32) + '" cy="150" r="3.500" fill="' + shade(s.c, 0.5) + '" opacity=".8"/>';
  return svg(240, 170, "<defs>" + grad(shade(s.c, 0.18), shade(s.c, -0.15), a, 1) + grad("#FFE6B8", "#E8B878", b, 1) + grad(shade(s.c, 0.2), s.c, c, 1) + "</defs>" +
    '<rect x="0" y="108" width="240" height="14" rx="6" fill="url(#' + b + ')" stroke="#A8743C" stroke-width="2"/><rect x="6" y="110" width="228" height="4" rx="2" fill="#fff" opacity=".6"/>' +
    '<path d="M4 122h232l-6 42H10z" fill="url(#' + a + ')" stroke="' + shade(s.c, -0.3) + '" stroke-width="2.500"/>' +
    '<path d="M14 128h212" stroke="#fff" stroke-width="2.500" opacity=".35" stroke-linecap="round"/>' + dots +
    '<g transform="translate(0 0)"><rect x="0" y="0" width="240" height="6" rx="3" fill="' + shade(s.c, -0.2) + '"/>' + st + '<ellipse cx="120" cy="8" rx="116" ry="3" fill="#fff" opacity=".3"/></g>', "Mặt tiền sạp " + i);
}
for (let i = 0; i < 5; i++) { put("stall-back-" + (i + 1), stallBack(SHOP[i])); put("stall-front-" + (i + 1), stallFront(SHOP[i], i + 1)); }

/* cây, đài phun nước */
function tree(cx, base, s, col) {
  col = col || "#4FB86B";
  return '<g transform="translate(' + cx + " " + base + ") scale(" + s + ')"><ellipse cx="0" cy="2" rx="26" ry="7" fill="#000" opacity=".15"/><rect x="-5" y="-30" width="10" height="32" rx="4" fill="#8A5A38"/>' +
    '<circle cx="0" cy="-52" r="28" fill="' + shade(col, -0.12) + '"/><circle cx="-14" cy="-42" r="20" fill="' + col + '"/><circle cx="15" cy="-44" r="21" fill="' + col + '"/><circle cx="2" cy="-62" r="19" fill="' + shade(col, 0.12) + '"/><circle cx="-8" cy="-66" r="6" fill="#fff" opacity=".3"/>' +
    '<circle cx="-12" cy="-44" r="3" fill="#FF8FA8"/><circle cx="10" cy="-56" r="3" fill="#FFD24D"/><circle cx="16" cy="-40" r="3" fill="#FF8FA8"/></g>';
}
put("tree", svg(100, 120, tree(50, 112, 1), "Cây xanh"));
const fa = gid(), fb = gid();
put("fountain", svg(240, 200, "<defs>" + grad("#E8E4F4", "#B9B2D6", fa, 1) + grad("#9EE3FF", "#4FB4F0", fb, 1) + "</defs>" +
  '<ellipse cx="120" cy="170" rx="112" ry="26" fill="#000" opacity=".16"/><ellipse cx="120" cy="156" rx="108" ry="32" fill="url(#' + fa + ')" stroke="#8F86BC" stroke-width="3"/><ellipse cx="120" cy="150" rx="94" ry="24" fill="url(#' + fb + ')"/>' +
  '<ellipse cx="96" cy="146" rx="30" ry="6" fill="#fff" opacity=".45"/><rect x="108" y="70" width="24" height="84" rx="8" fill="url(#' + fa + ')" stroke="#8F86BC" stroke-width="2.500"/>' +
  '<ellipse cx="120" cy="86" rx="46" ry="13" fill="url(#' + fa + ')" stroke="#8F86BC" stroke-width="2.500"/><ellipse cx="120" cy="84" rx="36" ry="8" fill="url(#' + fb + ')"/>' +
  '<path d="M120 40Q100 56 94 82M120 40Q140 56 146 82M120 38V82" stroke="#BDEBFF" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="120" cy="36" r="7" fill="#fff" opacity=".9"/>', "Đài phun nước"));

/* nền phố */
function bg(W, H, trees, plaza, label) {
  const a = gid(), b = gid(), p = gid(), q = gid(); let sk = "", cl = "", fl = "";
  const cols = ["#C9B6F2", "#F7B7CF", "#FFD9A0", "#A8D8F0", "#B6E8C8"];
  for (let x = -10, i = 0; x < W; x += 46 + (i % 3) * 14, i++) {
    const h = 44 + (i * 37) % 40, w = 40 + (i * 13) % 22, y = 128 - h;
    sk += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (h + 30) + '" rx="6" fill="' + cols[i % 5] + '" opacity=".75"/>';
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) sk += '<rect x="' + (x + 8 + c * 16) + '" y="' + (y + 8 + r * 16) + '" width="8" height="10" rx="2" fill="#fff" opacity=".7"/>';
  }
  for (let x = 40, i = 0; x < W; x += 150 + i * 20, i++) cl += '<g opacity=".9"><ellipse cx="' + x + '" cy="' + (26 + (i % 2) * 18) + '" rx="34" ry="12" fill="#fff"/><ellipse cx="' + (x + 18) + '" cy="' + (18 + (i % 2) * 18) + '" rx="22" ry="12" fill="#fff"/></g>';
  for (let i = 0; i < 18; i++) { const x = (i * 71 + 23) % W, y = 150 + ((i * 53) % (H - 160)); fl += '<circle cx="' + x + '" cy="' + y + '" r="2.600" fill="' + ["#FF8FA8", "#FFD24D", "#fff"][i % 3] + '" opacity=".7"/>'; }
  const bunt = (y0, y1) => { let s = '<path d="M0 ' + y0 + "Q" + W / 2 + " " + (y1 + 30) + " " + W + " " + y0 + '" fill="none" stroke="#7A5A3A" stroke-width="2"/>'; for (let i = 1; i < 13; i++) { const t = i / 13, x = W * t, y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * (y1 + 30) + t * t * y0; s += '<path d="M' + (x - 9) + " " + y + "h18l-9 20z\" fill=\"" + ["#FF6B8A", "#FFD24D", "#5BC8FF", "#7BD88F"][i % 4] + '" stroke="#fff" stroke-width="1.200" stroke-linejoin="round"/>'; } return s; };
  return svg(W, H, "<defs>" + grad("#8FD3FF", "#DDF2FF", a, 1) + grad("#E9D0A4", "#D9B880", b, 1) +
    '<pattern id="' + p + '" width="40" height="28" patternUnits="userSpaceOnUse"><rect width="40" height="28" fill="none"/><path d="M0 0h40M0 14h40M20 0v14M0 14v14M40 14v14" stroke="#B8935C" stroke-width="1.600" opacity=".45" fill="none"/><rect x="2" y="2" width="16" height="10" rx="3" fill="#fff" opacity=".12"/><rect x="22" y="16" width="16" height="10" rx="3" fill="#fff" opacity=".1"/></pattern>' +
    '<radialGradient id="' + q + '"><stop offset="0" stop-color="#FFE7F0"/><stop offset="1" stop-color="#F6C8D8"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#' + a + ')"/>' + cl + sk +
    '<rect y="120" width="' + W + '" height="' + (H - 120) + '" fill="url(#' + b + ')"/><rect y="120" width="' + W + '" height="14" fill="#7FCB6A"/><rect y="132" width="' + W + '" height="5" fill="#000" opacity=".1"/>' +
    '<rect y="134" width="' + W + '" height="' + (H - 134) + '" fill="url(#' + p + ')"/>' +
    '<ellipse cx="' + plaza[0] + '" cy="' + plaza[1] + '" rx="' + plaza[2] + '" ry="' + plaza[3] + '" fill="url(#' + q + ')" opacity=".9" stroke="#D89AB4" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>' +
    fl + trees.map(t => tree(t[0], t[1], t[2], t[3])).join("") + bunt(10, 22), label);
}
const stretch = s => s.replace("<svg ", "<svg preserveAspectRatio=\"none\" "); /* nền giãn kín trang */
put("bg-p", stretch(bg(390, 680, [[340, 120, 0.9, "#4FB86B"], [40, 668, 1, "#5FC27A"], [366, 190, 0.7, "#8ED06A"]], [300, 590, 105, 62], "Phố chợ, màn dọc")));
put("bg-l", stretch(bg(800, 360, [[740, 345, 1, "#4FB86B"], [790, 190, 0.8, "#8ED06A"], [20, 345, 0.9, "#5FC27A"]], [690, 100, 100, 56], "Phố chợ, màn ngang")));
console.log("Đã sinh " + n + " tranh khu chợ -> learn/khu-cho/art/");
