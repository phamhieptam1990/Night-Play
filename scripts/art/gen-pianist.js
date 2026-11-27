/* Sinh linh vật NGHỆ SĨ ĐÀN: Gấu Đô (gấu nâu, phong cách Pop) ngồi sau cây đàn trong nhà vườn Toán. Ra: shared/art/garden/house/pianist.svg (xem) + piano-mascot.js (SVG nhúng
   vào trang để CSS làm động hai bàn tay: id paw-l / paw-r, đầu/thân: #pm-body, nốt nhạc bay: #pm-fx). Chạy: node scripts/art/gen-pianist.js. Luật: docs/MASCOT-ART-RULES.md (Pop). */
"use strict";
const fs = require("fs"), path = require("path"), L = require("./gen-ao-lib.js");
const { mat, eye, blush, shape, shine, dark, INK } = L;
const fur = mat("pm", "#C98A4B"), belly = mat("pm", "#F6DDB5", "b"), ear = mat("pm", "#B5733A", "e"), tie = mat("pm", "#FF5A7A", "t");
const body = `
<g id="pm-fx" aria-hidden="true"><text x="22" y="48" font-size="34" fill="#FFD24D">♪</text><text x="206" y="36" font-size="40" fill="#FF8FC2">♫</text><text x="228" y="92" font-size="28" fill="#7DE0FF">♪</text></g>
<g id="pm-body">
${shape("ellipse", 'cx="128" cy="214" rx="84" ry="66"', fur)}
${shape("ellipse", 'cx="128" cy="222" rx="52" ry="50"', belly)}
${shape("circle", 'cx="74" cy="52" r="26"', ear)}${shape("circle", 'cx="182" cy="52" r="26"', ear)}
<circle cx="74" cy="54" r="12" fill="#F6B58A"/><circle cx="182" cy="54" r="12" fill="#F6B58A"/>
${shape("circle", 'cx="128" cy="96" r="66"', fur)}
${shape("ellipse", 'cx="128" cy="116" rx="34" ry="26"', belly)}
${shine("M84 70C94 46 120 36 146 40C122 46 104 58 98 82Z")}
${eye(102, 90, 12)}${eye(154, 90, 12)}${blush(88, 112)}${blush(168, 112)}
<ellipse cx="128" cy="106" rx="11" ry="8" fill="${INK}"/><path d="M128 114V124M114 124Q128 138 142 124" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
${shape("path", 'd="M104 164L128 178L152 164L152 190L128 180L104 190Z"', tie)}
</g>
<g id="paw-l"><ellipse cx="64" cy="186" rx="26" ry="22" fill="${fur.fill}" stroke="${fur.stroke}" stroke-width="3"/><ellipse cx="64" cy="192" rx="12" ry="9" fill="#F6B58A"/></g>
<g id="paw-r"><ellipse cx="192" cy="186" rx="26" ry="22" fill="${fur.fill}" stroke="${fur.stroke}" stroke-width="3"/><ellipse cx="192" cy="192" rx="12" ry="9" fill="#F6B58A"/></g>`;
const defs = [fur, belly, ear, tie].map(m => m.def).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="Gấu Đô, nghệ sĩ đàn"><title>Gấu Đô</title><desc>Linh vật nghệ sĩ đàn: gấu nâu mắt to hai chấm sáng, má hồng, nơ hồng. Pop, đồ chơi mềm.</desc><defs>${defs}</defs>${body}</svg>\n`;
const dir = path.join(__dirname, "../../shared/art/garden/house");
fs.writeFileSync(path.join(dir, "pianist.svg"), svg);
fs.writeFileSync(path.join(dir, "piano-mascot.js"), "/* SINH TỰ ĐỘNG bởi scripts/art/gen-pianist.js — đừng sửa tay */\nwindow.HOUSE_PIANIST = " + JSON.stringify(svg.replace(/\n/g, "")) + ";\n");
console.log("✓ pianist.svg + piano-mascot.js");
