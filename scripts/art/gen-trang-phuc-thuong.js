#!/usr/bin/env node
/* SINH TRANG PHỤC NGHỀ (phần thưởng khi bé đạt 5 sao bài kiểm tra chủ đề): 1 Đầu bếp · 2 Cảnh sát · 3 Bác sĩ · 4 Lính cứu hỏa · 5 Nhà khoa học · 6 Họa sĩ · 7 Nhạc sĩ.
   Mỗi bộ 3 lớp viewBox 256 (khớp mọi thú): tpr-N-hat (đội đầu), tpr-N-neck (cổ), tpr-N-chest (ngực). Chủ quán chỉ dùng lớp neck (mũ đầu bếp + quầy đã chiếm chỗ).
   Chạy: node scripts/art/gen-trang-phuc-thuong.js -> learn/vuon-thu/art/tpr-*.svg. Luật như gen-trang-phuc.js: không filter/image, không che mắt/miệng. */
"use strict";
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "../../learn/vuon-thu/art"); fs.mkdirSync(OUT, { recursive: true });
const NAME = ["Đầu bếp", "Cảnh sát", "Bác sĩ", "Lính cứu hỏa", "Nhà khoa học", "Họa sĩ", "Nhạc sĩ"];
const svg = (body, label) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="' + label + '"><title>' + label + "</title>" + body + "</svg>\n";
const f = v => (+v).toFixed(1);
const star = (x, y, r, c, c2) => { let p = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r * .46 : r; p += (i ? "L" : "M") + f(x + Math.cos(a) * k) + " " + f(y + Math.sin(a) * k); }
  return `<path d="${p}Z" fill="${c}" stroke="${c2 || c}" stroke-width="1.500" stroke-linejoin="round"/>`; };
const cross = (x, y, s, c) => `<rect x="${x - s / 2.800}" y="${y - s / 2}" width="${s / 1.400}" height="${s}" rx="2" fill="${c}"/><rect x="${x - s / 2}" y="${y - s / 2.800}" width="${s}" height="${s / 1.400}" rx="2" fill="${c}"/>`;
const shine = (d, o) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o || .55}" stroke-width="5" stroke-linecap="round"/>`;
const T = [];
T[1] = { hat: `<circle cx="104" cy="52" r="20" fill="#fff" stroke="#E4E8F2" stroke-width="2"/><circle cx="152" cy="52" r="20" fill="#fff" stroke="#E4E8F2" stroke-width="2"/><circle cx="128" cy="40" r="24" fill="#fff" stroke="#E4E8F2" stroke-width="2"/><rect x="96" y="58" width="64" height="18" rx="9" fill="#fff" stroke="#E4E8F2" stroke-width="2"/>` + shine("M112 36Q122 28 134 30"),
  neck: `<path d="M88 166Q128 184 168 166L160 176Q128 194 96 176Z" fill="#FF8A3D"/><circle cx="128" cy="184" r="5" fill="#FFC93C"/>`,
  chest: `<path d="M92 196Q128 188 164 196L158 232L98 232Z" fill="#fff" stroke="#E4E8F2" stroke-width="2.500"/><rect x="112" y="206" width="32" height="16" rx="5" fill="#FF8A3D" opacity=".9"/><circle cx="128" cy="214" r="3" fill="#fff"/>` };
T[2] = { hat: `<path d="M88 70Q92 36 128 34Q164 36 168 70Z" fill="#2F4FA8"/><ellipse cx="128" cy="71" rx="46" ry="8" fill="#1F3578"/><path d="M104 60Q128 52 152 60" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="5" stroke-linecap="round"/>` + star(128, 54, 9, "#FFD24D", "#E0A82E"),
  neck: `<path d="M92 166Q128 182 164 166L158 174Q128 188 98 174Z" fill="#2F4FA8"/><path d="M124 176h8l4 20-8 6-8-6z" fill="#E8394D"/>`,
  chest: `<path d="M94 196Q128 188 162 196L158 232L98 232Z" fill="#2F4FA8"/><path d="M128 192V232" stroke="#1F3578" stroke-width="2"/>` + star(114, 210, 8, "#FFD24D", "#E0A82E") + `<rect x="138" y="204" width="14" height="7" rx="2" fill="#FFD24D"/>` };
T[3] = { hat: `<rect x="100" y="42" width="56" height="28" rx="12" fill="#fff" stroke="#DDE3F0" stroke-width="2"/>` + cross(128, 56, 14, "#E8394D") + shine("M108 48Q114 44 122 44", .7),
  neck: `<path d="M96 168Q92 196 108 204M160 168Q164 196 148 204" fill="none" stroke="#3A3A4A" stroke-width="4" stroke-linecap="round"/><path d="M108 204Q128 214 148 204" fill="none" stroke="#3A3A4A" stroke-width="4" stroke-linecap="round"/><circle cx="128" cy="212" r="8" fill="#C9D3EA" stroke="#3A3A4A" stroke-width="3"/>`,
  chest: `<path d="M92 192L128 214L164 192L170 232L86 232Z" fill="#fff" stroke="#DDE3F0" stroke-width="2.500"/>` + cross(146, 220, 12, "#E8394D") };
T[4] = { hat: `<path d="M90 72Q94 34 128 32Q162 34 166 72Z" fill="#E8394D"/><ellipse cx="128" cy="73" rx="52" ry="9" fill="#B8202F"/><path d="M116 36L128 24L140 36Z" fill="#E8394D"/>` + `<path d="M128 44c8 8 8 14 0 22c-8-8-8-14 0-22z" fill="#FFD24D" stroke="#E0A82E" stroke-width="2"/>` + shine("M104 56Q112 44 124 40", .4),
  neck: `<path d="M88 166Q128 184 168 166L160 176Q128 194 96 176Z" fill="#FFD24D"/><path d="M96 176Q128 194 160 176" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>`,
  chest: `<path d="M92 196Q128 188 164 196L158 232L98 232Z" fill="#E8394D"/><rect x="92" y="204" width="72" height="8" fill="#FFD24D"/><rect x="94" y="220" width="68" height="8" fill="#FFD24D"/>` };
T[5] = { hat: `<path d="M98 70Q128 56 158 70" fill="none" stroke="#6C8CFF" stroke-width="6" stroke-linecap="round"/><circle cx="110" cy="62" r="13" fill="#DDE9FF" stroke="#6C8CFF" stroke-width="4"/><circle cx="146" cy="62" r="13" fill="#DDE9FF" stroke="#6C8CFF" stroke-width="4"/><circle cx="106" cy="58" r="4" fill="#fff"/><circle cx="142" cy="58" r="4" fill="#fff"/>`,
  neck: `<path d="M92 166L128 188L164 166L172 182L128 206L84 182Z" fill="#fff" stroke="#DDE3F0" stroke-width="2.500" stroke-linejoin="round"/>`,
  chest: `<path d="M90 196Q128 188 166 196L160 232L96 232Z" fill="#fff" stroke="#DDE3F0" stroke-width="2.500"/><rect x="104" y="212" width="22" height="16" rx="3" fill="#EEF2FF" stroke="#C9D3EA" stroke-width="2"/><path d="M142 204h8v10l6 12a4 4 0 0 1-4 5h-12a4 4 0 0 1-4-5l6-12z" fill="#4ADE80" stroke="#2FA85F" stroke-width="2"/>` };
T[6] = { hat: `<ellipse cx="136" cy="52" rx="44" ry="19" fill="#E8394D" transform="rotate(-8 136 52)"/><ellipse cx="128" cy="62" rx="40" ry="8" fill="#B8202F" transform="rotate(-8 128 62)"/><rect x="132" y="28" width="6" height="10" rx="3" fill="#B8202F"/>` + shine("M110 48Q124 40 140 42", .35),
  neck: `<path d="M90 168Q128 182 166 168L160 178Q128 192 96 178Z" fill="#FFC93C"/><circle cx="108" cy="176" r="3.500" fill="#E8394D"/><circle cx="148" cy="178" r="3.500" fill="#4A9BFF"/>`,
  chest: `<path d="M96 196Q128 190 160 196L156 232L100 232Z" fill="#F1E3C8" stroke="#D8C49A" stroke-width="2.500"/><circle cx="112" cy="212" r="4.500" fill="#E8394D"/><circle cx="126" cy="220" r="4.500" fill="#4A9BFF"/><circle cx="142" cy="210" r="4.500" fill="#4ADE80"/><path d="M148 232L160 200" stroke="#8A5A2A" stroke-width="4" stroke-linecap="round"/><rect x="156" y="194" width="8" height="10" rx="3" fill="#E8394D" transform="rotate(20 160 199)"/>` };
T[7] = { hat: `<path d="M72 112Q70 36 128 34Q186 36 184 112" fill="none" stroke="#7A5CE0" stroke-width="9" stroke-linecap="round"/><rect x="56" y="98" width="22" height="34" rx="11" fill="#FF6BA8" stroke="#E04C8A" stroke-width="3"/><rect x="178" y="98" width="22" height="34" rx="11" fill="#FF6BA8" stroke="#E04C8A" stroke-width="3"/>` + shine("M84 70Q92 48 112 42", .4),
  neck: `<path d="M110 174L128 184L110 194Z" fill="#E8394D"/><path d="M146 174L128 184L146 194Z" fill="#E8394D"/><circle cx="128" cy="184" r="5" fill="#B8202F"/>`,
  chest: `<path d="M110 222V202L136 198V218" fill="none" stroke="#7A5CE0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="106" cy="223" rx="7" ry="5.500" fill="#7A5CE0"/><ellipse cx="132" cy="219" rx="7" ry="5.500" fill="#7A5CE0"/>` };
let n = 0;
for (let g = 1; g <= 7; g++) ["hat", "neck", "chest"].forEach(k => { fs.writeFileSync(path.join(OUT, "tpr-" + g + "-" + k + ".svg"), svg(T[g][k], "Trang phục " + NAME[g - 1])); n++; });
console.log("Đã sinh " + n + " lớp trang phục nghề -> learn/vuon-thu/art/tpr-*.svg");
