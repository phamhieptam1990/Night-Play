#!/usr/bin/env node
/* Sinh TRANH NỀN cho trang học / kiểm tra / bài học của Học Vui: mỗi môn một cảnh (Toán, Việt, Anh), phong cách Pop mềm (không viền đen, gradient, vệt sáng).
   Ra: shared/art/learn/bg/<môn>.svg + learn/bg.css (gắn tranh vào .aur::before, đổi tông theo lớp bằng body[data-grade], trôi nhẹ).
   Chạy: node scripts/learn/gen-learn-bg.js */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", ".."), OUT = path.join(root, "shared", "art", "learn", "bg");
fs.mkdirSync(OUT, { recursive: true });
const FONT = "'Baloo 2','Nunito','Arial Rounded MT Bold','Trebuchet MS',system-ui,sans-serif";
const spark = (x, y, r, o) => `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="#fff" opacity="${o}"/>`;
const cloud = (x, y, s, o) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><ellipse cx="0" cy="0" rx="46" ry="20" fill="#fff"/><circle cx="-18" cy="-14" r="20" fill="#fff"/><circle cx="12" cy="-20" r="25" fill="#fff"/><circle cx="34" cy="-6" r="16" fill="#fff"/></g>`;
const num = (t, x, y, size, rot, g, o) => `<text x="${x}" y="${y}" font-family="${FONT}" font-weight="900" font-size="${size}" text-anchor="middle" transform="rotate(${rot} ${x} ${y})" fill="url(#${g})" opacity="${Math.min(1, +(o * 1.9).toFixed(2))}">${t}</text>`;
function scene(id, c1, c2, floaters, hills) {
  const sparks = [[40, 120, 9, .7], [350, 90, 12, .8], [310, 260, 7, .6], [70, 330, 8, .5], [200, 60, 10, .6], [370, 420, 8, .5], [30, 520, 10, .6], [260, 560, 7, .5]].map(s => spark(...s)).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${id}">
<defs><linearGradient id="g1" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
<linearGradient id="g2" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#FF9C3F"/></linearGradient>
<linearGradient id="g3" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#FFB8D6"/><stop offset="1" stop-color="#FF6FA6"/></linearGradient>
<linearGradient id="g4" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#9ACBFF"/><stop offset="1" stop-color="#4F97F2"/></linearGradient>
<linearGradient id="hl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}" stop-opacity=".55"/><stop offset="1" stop-color="${c2}" stop-opacity=".75"/></linearGradient></defs>
${cloud(70, 150, 1, .3)}${cloud(320, 230, .8, .26)}${cloud(150, 470, .7, .18)}
${sparks}
${floaters}
<path d="M0 640C80 600 150 610 230 635C300 658 350 640 400 618V800H0Z" fill="url(#hl)" opacity=".85"/>
<path d="M0 700C90 668 170 690 250 708C320 722 370 700 400 684V800H0Z" fill="url(#hl)" opacity=".95"/>
${hills}
<path d="M0 760C100 740 220 752 400 730V800H0Z" fill="#fff" opacity=".1"/>
</svg>
`;
}
/* ---- TOÁN: số, dấu, hình khối bay lơ lửng + ba cột số xếp như đồ chơi ---- */
const toan = scene("toan", "#34D399", "#0EA5E9",
  [num("7", 62, 250, 110, -12, "g1", .5), num("+", 335, 180, 90, 10, "g2", .55), num("3", 330, 400, 100, 14, "g3", .45), num("=", 60, 470, 90, -8, "g4", .5), num("5", 200, 330, 70, 6, "g2", .3),
   `<circle cx="120" cy="95" r="26" fill="url(#g3)" opacity=".5"/><path d="M300 90L338 150L262 150Z" fill="url(#g4)" opacity=".5"/><rect x="238" y="505" width="52" height="52" rx="12" fill="url(#g2)" opacity=".45" transform="rotate(14 264 531)"/>`].join(""),
  `<g opacity=".8"><rect x="38" y="676" width="46" height="60" rx="10" fill="url(#g2)"/><text x="61" y="720" font-family="${FONT}" font-weight="900" font-size="34" text-anchor="middle" fill="#fff">1</text><rect x="96" y="660" width="46" height="76" rx="10" fill="url(#g3)"/><text x="119" y="716" font-family="${FONT}" font-weight="900" font-size="34" text-anchor="middle" fill="#fff">2</text><rect x="154" y="644" width="46" height="92" rx="10" fill="url(#g4)"/><text x="177" y="710" font-family="${FONT}" font-weight="900" font-size="34" text-anchor="middle" fill="#fff">3</text></g>`);
/* ---- TIẾNG VIỆT: chữ cái, quyển sách mở, bút chì, bong bóng lời ---- */
const tviet = scene("tviet", "#FFB020", "#FB5A7A",
  [num("A", 60, 240, 110, -10, "g2", .5), num("ă", 335, 170, 90, 12, "g4", .5), num("Ơ", 335, 400, 96, -12, "g3", .45), num("ô", 70, 470, 90, 8, "g1", .45), num("b", 205, 320, 70, -6, "g4", .28),
   `<path d="M250 80C250 64 262 56 276 56H342C356 56 368 64 368 80V112C368 128 356 136 342 136H300L276 160L282 136H276C262 136 250 128 250 112Z" fill="#fff" opacity=".22"/><circle cx="282" cy="96" r="6" fill="url(#g2)" opacity=".7"/><circle cx="309" cy="96" r="6" fill="url(#g3)" opacity=".7"/><circle cx="336" cy="96" r="6" fill="url(#g4)" opacity=".7"/>`].join(""),
  `<g opacity=".85"><path d="M60 740C60 716 90 706 130 710C170 706 200 716 200 740Z" fill="url(#g2)"/><path d="M130 710V740" stroke="#fff" stroke-width="3" opacity=".6"/><path d="M72 724H120M140 724H188" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/><rect x="236" y="690" width="14" height="64" rx="5" fill="url(#g3)" transform="rotate(24 243 722)"/><path d="M262 748L276 704L288 748Z" fill="#FFE6B0" transform="rotate(24 275 730)"/></g>`);
/* ---- TIẾNG ANH: ABC, quả địa cầu, máy bay giấy, chào Hi! ---- */
const tanh = scene("tanh", "#60A5FA", "#A78BFA",
  [num("ABC", 120, 250, 76, -8, "g2", .5), num("Hi!", 320, 330, 66, 10, "g3", .5), num("XYZ", 90, 480, 56, 6, "g4", .42),
   `<g opacity=".5"><circle cx="318" cy="130" r="38" fill="url(#g1)"/><path d="M280 130H356M318 92C300 110 300 150 318 168M318 92C336 110 336 150 318 168" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/></g><path d="M214 70L262 96L226 104L220 128L204 108L176 114Z" fill="#fff" opacity=".35"/><path d="M262 96L226 104L220 128Z" fill="#fff" opacity=".2"/>`].join(""),
  `<g opacity=".85"><path d="M40 740C40 700 80 690 120 694C160 690 200 700 200 740Z" fill="url(#g4)"/><path d="M62 708C62 696 76 692 90 698" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/><g transform="translate(260 700)"><path d="M0 40L12 0L24 40Z" fill="url(#g2)"/><circle cx="12" cy="16" r="5" fill="#fff" opacity=".8"/><path d="M-6 44L-2 30L4 40ZM30 44L26 30L20 40Z" fill="url(#g3)"/></g></g>`);
for (const [n, s] of Object.entries({ toan, tviet, tanh })) fs.writeFileSync(path.join(OUT, n + ".svg"), s);
/* ---- CSS: gắn tranh vào .aur::before; tông màu theo lớp; trôi nhẹ ---- */
const css = `/* SINH BỞI scripts/learn/gen-learn-bg.js, không sửa tay. Tranh nền theo môn (body[data-subj]) cho trang học, kiểm tra và bài học; đổi tông theo lớp bằng body[data-grade]. */
.aur{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.aur::before{content:"";position:absolute;z-index:1;inset:-12px 0;background:center bottom/cover no-repeat;opacity:1;pointer-events:none;animation:bgDrift 11s ease-in-out infinite alternate}
body[data-subj=toan] .aur::before{background-image:url(../shared/art/learn/bg/toan.svg)}
body[data-subj=tviet] .aur::before{background-image:url(../shared/art/learn/bg/tviet.svg)}
body[data-subj=tanh] .aur::before{background-image:url(../shared/art/learn/bg/tanh.svg)}
body[data-grade="1"] .aur::before{filter:none}
body[data-grade="2"] .aur::before{filter:hue-rotate(28deg) saturate(1.05)}
body[data-grade="3"] .aur::before{filter:hue-rotate(-30deg) saturate(1.05)}
body[data-grade="4"] .aur::before{filter:hue-rotate(60deg) saturate(.95)}
body[data-grade="5"] .aur::before{filter:hue-rotate(-62deg) saturate(.95) brightness(.95)}
:root:not([data-theme=dark]) .aur::before{opacity:.85}
@keyframes bgDrift{from{transform:translateY(0)}to{transform:translateY(10px)}}
@media (prefers-reduced-motion:reduce){.aur::before{animation:none}}
`;
fs.writeFileSync(path.join(root, "learn", "bg.css"), css);
console.log("✓ 3 tranh nền → shared/art/learn/bg/ + learn/bg.css");
