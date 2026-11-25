/* Tiệm Nước Ép: khách thú (mèo, thỏ, gấu, heo; mỗi bạn 2 nét mặt: chờ / vui) + linh vật chủ quán (cún đội mũ giấy, đeo tạp dề). viewBox 256. */
"use strict";
const { Doc, E, ground, orb, spec, lighten, darken } = require("./core");
const pet = require("./pet");

const SP = {
  meo: { vi: "Mèo", fur: "#B9B4E8", belly: "#F4F1FF", ear: "#8E86D8", inner: "#FFB8CC" },
  tho: { vi: "Thỏ", fur: "#F6EFE6", belly: "#FFFFFF", ear: "#E8D6C8", inner: "#FFB0C4" },
  gau: { vi: "Gấu", fur: "#B98258", belly: "#F0D2B0", ear: "#8E5C38", inner: "#E8B890" },
  heo: { vi: "Heo", fur: "#FFAFC2", belly: "#FFD8E2", ear: "#F58AA6", inner: "#FF8FAE" }
};
function ears(D, k, s) {
  if (k === "meo") return [[-1, 62], [1, 194]].map(([d, x]) => `<g transform="rotate(${d * 14} ${x} 70)"><path d="M${x - 26} 90L${x - 6} 24L${x + 26} 80Z" fill="${D.radial(s.ear, { light: .3 })}"/><path d="M${x - 14} 82L${x - 4} 44L${x + 14} 76Z" fill="${s.inner}"/></g>`).join("");
  if (k === "tho") return [[-1, 90], [1, 166]].map(([d, x]) => `<g transform="rotate(${d * 10} ${x} 60)">` + orb(D, x, 40, 17, 52, s.fur, { spec: false }) + E(x, 44, 8, 34, s.inner, 'opacity=".85"') + "</g>").join("");
  if (k === "gau") return [76, 180].map(x => orb(D, x, 62, 24, 24, s.ear, { spec: false }) + E(x, 64, 12, 12, s.inner)).join("");
  return [[-1, 76], [1, 180]].map(([d, x]) => `<g transform="rotate(${d * 22} ${x} 66)"><path d="M${x - 22} 80C${x - 20} 50 ${x + 14} 42 ${x + 22} 60C${x + 24} 72 ${x + 8} 82 ${x - 22} 80Z" fill="${D.radial(s.ear, { light: .3 })}"/></g>`).join("");
}
function customer(k, mood) {
  const s = SP[k], D = Doc("c" + k[0] + mood[0]); let b = ground(D, 128, 240, 70, .5);
  b += ears(D, k, s);
  b += orb(D, 128, 196, 58, 56, s.fur, { spec: false }) + E(128, 204, 34, 36, D.radial(s.belly, { light: .3, dark: .2 }));
  b += orb(D, 78, 190, 15, 22, s.fur, { spec: false, rot: 20 }) + orb(D, 178, 190, 15, 22, s.fur, { spec: false, rot: -20 });
  b += orb(D, 128, 110, 68, 60, s.fur, { specOp: .5 });
  if (k === "gau") b += orb(D, 128, 134, 34, 26, s.belly, { spec: false });
  if (k === "heo") b += orb(D, 128, 134, 30, 22, s.ear, { spec: false }) + E(118, 134, 4.5, 6.5, darken(s.ear, .5)) + E(138, 134, 4.5, 6.5, darken(s.ear, .5));
  if (k === "meo") b += `<path d="M96 122L72 118M96 128L72 132M160 122L184 118M160 128L184 132" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`;
  b += E(72, 130, 12, 7, "#FF8FA8", 'opacity=".6"') + E(184, 130, 12, 7, "#FF8FA8", 'opacity=".6"');
  [96, 160].forEach((x, i) => {
    if (mood === "vui") b += `<path d="M${x - 12} 108C${x - 8} 94 ${x + 8} 94 ${x + 12} 108" stroke="#3A1A40" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    else b += E(x, 106, 12.5, 15, "#fff") + E(x + 1.5, 107, 8.4, 10.5, D.radial("#5A3A66", { light: .25, dark: .5 })) + E(x + 4, 102, 3.4, 4.2, "#fff") + E(x - 2, 111, 1.6, 1.6, "#fff", 'opacity=".85"');
  });
  if (mood === "cho") b += `<path d="M82 84Q96 76 110 82M146 82Q160 76 174 84" stroke="${darken(s.ear, .3)}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  if (k !== "heo") b += E(128, k === "gau" ? 126 : 124, 11, 8, D.radial("#4A2A3A", { light: .35, dark: .45 })) + E(124, k === "gau" ? 123 : 121, 4, 2.4, "#fff", 'opacity=".85"');
  b += mood === "vui"
    ? `<path d="M108 146C110 168 146 168 148 146Z" fill="#8A2A3A"/><path d="M116 156C118 166 138 166 140 156Z" fill="#FF8FA8"/>`
    : `<path d="M116 152C122 156 134 156 140 152" stroke="#7A3A3A" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  if (mood === "vui") b += `<path d="M30 60l5 -12 5 12 12 5 -12 5 -5 12 -5 -12 -12 -5z" fill="#FFE08A"/><path d="M214 50l4 -9 4 9 9 4 -9 4 -4 9 -4 -9 -9 -4z" fill="#FFE08A"/>`;
  return [`khach-${k}-${mood}`, `${s.vi} ${mood === "vui" ? "vui" : "đang chờ"}`, D.out(b, null, `Bạn ${s.vi.toLowerCase()} khách`)];
}
/* linh vật: cún chủ quán = cún mẫu (pet.js) + mũ giấy có quả cam + tạp dề teal có huy hiệu ly nước ép (#mark) */
function mascot() {
  const dog = pet[0]()[2], D = Doc("mk");
  let b = `<path d="M90 198C92 186 164 186 166 198L174 232C150 244 106 244 82 232Z" fill="${D.linear("#5FD8C2", "#2E9C8C", [0, 0, 0, 1])}"/><path d="M92 196C110 204 146 204 164 196" stroke="#fff" stroke-width="3" opacity=".5" fill="none"/>`;
  b += `<g id="mark">` + E(128, 220, 15, 15, D.radial("#FFF8E8", { light: .2 })) + E(128, 220, 11, 11, D.radial("#FF9A1F", { light: .3 })) + spec(123, 214, 4, 2.4, -30, .8) + "</g>";
  b += `<path d="M84 70L90 40C94 30 162 30 166 40L172 70C150 80 106 80 84 70Z" fill="${D.linear("#FFFFFF", "#E8DCF0", [0, 0, 0, 1])}"/><path d="M84 70C106 80 150 80 172 70L171 60C150 70 106 70 85 60Z" fill="${D.linear("#FF7A94", "#D8345A", [0, 0, 0, 1])}"/>`;
  b += E(128, 36, 38, 7, "#fff", 'opacity=".7"') + E(150, 52, 5, 8, "#fff", 'opacity=".55"') + orb(D, 128, 48, 10, 10, "#FF9A1F", { specOp: .8 });
  const inner = /<defs>([\s\S]*?)<\/defs>/.exec(D.out(b))[1];
  return ["chu-quan", "Cún chủ quán", dog.replace("</defs>", inner + "</defs>").replace("</svg>", b + "</svg>").replace(/aria-label="[^"]*"/, 'aria-label="Cún chủ quán nước ép"')];
}
module.exports = { customers: Object.keys(SP).flatMap(k => [() => customer(k, "cho"), () => customer(k, "vui")]), mascot, SP };
