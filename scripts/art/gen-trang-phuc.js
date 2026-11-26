#!/usr/bin/env node
/* SINH TRANG PHỤC theo lớp cho thú ở Vườn thú và chủ quán ở Khu chợ (Học Vui). 5 bộ: 1 Siêu nhân · 2 Phi hành gia · 3 Thám hiểm · 4 Pháp sư · 5 Hoàng gia.
   Mỗi bộ 3 lớp cùng viewBox 256 (khớp mọi thú vì các thú chung toạ độ đầu/cổ): tp-N-back (sau lưng: áo choàng/ba lô), tp-N-head (đầu + cổ, không che mắt/miệng), tp-N-chest (ngực/bụng; chủ quán bỏ vì quầy che).
   Chạy: node scripts/art/gen-trang-phuc.js -> learn/vuon-thu/art/. Luật: không filter/image, không che mặt (kính phi hành gia trong suốt), màu cứng vì là đồ mặc, không phải thân linh vật. */
"use strict";
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "../../learn/vuon-thu/art"); fs.mkdirSync(OUT, { recursive: true });
const NAME = ["Siêu nhân", "Phi hành gia", "Thám hiểm", "Pháp sư", "Hoàng gia"];
const svg = (body, label) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="' + label + '"><title>' + label + "</title>" + body + "</svg>\n";
const f = v => (+v).toFixed(1);
const star = (x, y, r, c, c2) => { let p = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = i % 2 ? r * .46 : r; p += (i ? "L" : "M") + f(x + Math.cos(a) * k) + " " + f(y + Math.sin(a) * k); }
  return `<path d="${p}Z" fill="${c}" stroke="${c2 || c}" stroke-width="1.600" stroke-linejoin="round"/>`; };
const spark = (x, y, s, c) => `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${c}"/>`;
/* áo choàng sau lưng: thân rộng hơn thú để lộ hai bên + dưới */
const cape = (c, c2, trim) => `<path d="M80 150C54 176 36 212 42 240L214 240C220 212 202 176 176 150Z" fill="${c2}"/><path d="M86 154C66 178 52 208 56 236L200 236C204 208 190 178 170 154Z" fill="${c}"/>`
  + `<path d="M70 168C60 190 56 212 58 232L74 232C72 212 74 190 84 166Z" fill="#fff" opacity=".18"/>` + (trim ? `<path d="M42 240L214 240L212 228L44 228Z" fill="${trim}"/>` : "");
const pack = (c, c2) => `<rect x="52" y="146" width="30" height="74" rx="12" fill="${c}"/><rect x="174" y="146" width="30" height="74" rx="12" fill="${c}"/><rect x="52" y="146" width="11" height="74" rx="5" fill="#fff" opacity=".28"/><rect x="174" y="146" width="11" height="74" rx="5" fill="#fff" opacity=".28"/>`
  + `<rect x="52" y="176" width="30" height="9" fill="${c2}"/><rect x="174" y="176" width="30" height="9" fill="${c2}"/>`;
const T = [];
/* 1 Siêu nhân: áo choàng đỏ, kẹp vàng ở cổ, huy hiệu sao ở ngực */
T[1] = { back: cape("#E8394D", "#B8202F"), head: `<circle cx="100" cy="172" r="7" fill="#FFC93C" stroke="#E0A82E" stroke-width="2"/><circle cx="156" cy="172" r="7" fill="#FFC93C" stroke="#E0A82E" stroke-width="2"/>` + spark(196, 62, 10, "#FFE066") + spark(62, 74, 8, "#fff"),
  chest: `<path d="M128 190L150 200L146 224L128 232L110 224L106 200Z" fill="#E8394D" stroke="#FFC93C" stroke-width="3" stroke-linejoin="round"/>` + star(128, 212, 12, "#FFE066", "#E0A82E") };
/* 2 Phi hành gia: mũ kính tròn trong suốt (thấy rõ mặt), bình khí sau lưng, bảng nút ở ngực */
T[2] = { back: pack("#C9D3EA", "#FF8A3D"), head: `<circle cx="128" cy="104" r="86" fill="#BFE3FF" fill-opacity=".13"/><circle cx="128" cy="104" r="86" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="5"/><circle cx="128" cy="104" r="91" fill="none" stroke="#8FB0FF" stroke-opacity=".55" stroke-width="3"/>`
  + `<path d="M62 74A74 74 0 0 1 112 32" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="7" stroke-linecap="round"/><ellipse cx="128" cy="180" rx="62" ry="12" fill="none" stroke="#E8EEFF" stroke-width="9"/><ellipse cx="128" cy="180" rx="62" ry="12" fill="none" stroke="#9FB0D8" stroke-width="2"/>`
  + `<rect x="120" y="14" width="16" height="10" rx="4" fill="#FF8A3D"/>`,
  chest: `<rect x="98" y="194" width="60" height="30" rx="9" fill="#DDE4F7" stroke="#9FB0D8" stroke-width="2.500"/><circle cx="112" cy="204" r="5" fill="#FF5C5C"/><circle cx="128" cy="204" r="5" fill="#FFD24D"/><circle cx="144" cy="204" r="5" fill="#4ADE80"/><rect x="108" y="213" width="40" height="6" rx="3" fill="#6C8CFF"/>` };
/* 3 Thám hiểm: ba lô nâu + chăn cuộn, khăn quàng đỏ, ống nhòm */
T[3] = { back: `<rect x="50" y="146" width="156" height="78" rx="22" fill="#A8693A"/><rect x="62" y="134" width="132" height="20" rx="10" fill="#D49A55"/><rect x="50" y="146" width="22" height="78" rx="11" fill="#fff" opacity=".22"/><rect x="50" y="184" width="156" height="8" fill="#7C4A22"/>`,
  head: `<path d="M86 164Q128 180 170 164L128 204Z" fill="#E8573A"/><path d="M86 164Q128 180 170 164" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>` + [[112, 178], [128, 190], [144, 178], [128, 176]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.600" fill="#fff" opacity=".85"/>`).join("") + `<circle cx="128" cy="204" r="6" fill="#C8412A"/>`,
  chest: `<path d="M98 172L112 198M158 172L144 198" stroke="#5A3A1A" stroke-width="5" stroke-linecap="round"/><rect x="120" y="205" width="16" height="6" rx="3" fill="#3A3A4A"/><circle cx="112" cy="208" r="11" fill="#3A3A4A"/><circle cx="144" cy="208" r="11" fill="#3A3A4A"/><circle cx="112" cy="208" r="6.500" fill="#6BD0E8"/><circle cx="144" cy="208" r="6.500" fill="#6BD0E8"/><circle cx="109" cy="205" r="2" fill="#fff"/><circle cx="141" cy="205" r="2" fill="#fff"/>` };
/* 4 Pháp sư: áo choàng tím có sao, kẹp sao, đũa phép bay + lấp lánh, trăng khuyết ở ngực */
T[4] = { back: cape("#7A5CE0", "#4B34A8") + star(70, 206, 6, "#FFE066") + star(188, 214, 5, "#FFE066") + star(96, 230, 4, "#fff") + star(166, 228, 4, "#fff"),
  head: `<path d="M100 165l2.500 5 5.500.8-4 4 1 5.500-5-2.600-5 2.600 1-5.500-4-4 5.500-.8z" fill="#FFC93C" stroke="#E0A82E" stroke-width="1.500"/><path d="M156 165l2.500 5 5.500.8-4 4 1 5.500-5-2.600-5 2.600 1-5.500-4-4 5.500-.8z" fill="#FFC93C" stroke="#E0A82E" stroke-width="1.500"/>`
    + `<path d="M222 120L204 212" stroke="#8A5A2A" stroke-width="6" stroke-linecap="round"/>` + star(224, 114, 12, "#FFE066", "#E0A82E") + spark(240, 90, 9, "#fff") + spark(54, 64, 9, "#FFE066") + spark(204, 50, 7, "#fff"),
  chest: `<path d="M138 196A15 15 0 1 0 138 224A12 12 0 1 1 138 196Z" fill="#FFD24D" stroke="#E0A82E" stroke-width="2"/>` + star(146, 202, 4, "#fff") };
/* 5 Hoàng gia: áo choàng đỏ viền vàng, cổ lông trắng chấm đen, huy chương sao vàng (vương miện dùng tranh vuong-mien có sẵn) */
T[5] = { back: cape("#D94B5B", "#A82638", "#FFC93C"),
  head: `<path d="M80 168Q96 184 128 186Q160 184 176 168Q170 160 160 166Q150 158 140 168Q128 158 116 168Q106 158 96 166Q86 160 80 168Z" fill="#fff" stroke="#E4E8F2" stroke-width="2"/>` + [[100, 172], [118, 176], [138, 176], [156, 172], [128, 182]].map(p => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="2.200" ry="3.600" fill="#2A2A3A"/>`).join(""),
  chest: `<circle cx="128" cy="208" r="16" fill="#FFC93C" stroke="#E0A82E" stroke-width="3"/>` + star(128, 208, 10, "#fff", "#FFE066") + `<circle cx="128" cy="226" r="4" fill="#E8394D"/>` };
let n = 0;
for (let g = 1; g <= 5; g++) ["back", "head", "chest"].forEach(k => { fs.writeFileSync(path.join(OUT, "tp-" + g + "-" + k + ".svg"), svg(T[g][k], "Trang phục " + NAME[g - 1])); n++; });
console.log("Đã sinh " + n + " lớp trang phục -> learn/vuon-thu/art/tp-*.svg");
