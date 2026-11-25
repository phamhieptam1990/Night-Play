/* Tiệm Nước Ép: ly nước ép theo vị (6 vị + ly rỗng), chai nước, ống hút. Pop 3D, viewBox 256. */
"use strict";
const { Doc, E, ground, spec, lighten, darken } = require("./core");

const FLAV = {
  cam: ["Cam", "#FFC24A", "#F07A0A"], dau: ["Dâu", "#FF8FA8", "#E0364F"], tao: ["Táo", "#FF7A6A", "#D83030"],
  chuoi: ["Chuối", "#FFF0A0", "#F2C830"], "dua-hau": ["Dưa hấu", "#FF8A9A", "#E8304A"], chanh: ["Chanh", "#F4FF9A", "#C8DE2A"]
};
function garnish(D, k) {
  const g = { cam: ["#FF9A1F", "#FFE29A"], chanh: ["#FFE14A", "#F8FFC0"], tao: ["#FF4B4B", "#FFE9C8"] };
  if (g[k]) {
    let s = E(0, 0, 26, 24, D.radial(g[k][0], { light: .35 })) + E(0, 0, 19, 17, g[k][1]);
    for (let a = 0; a < 360; a += 60) s += `<path d="M0 0L${(Math.cos(a * Math.PI / 180) * 17).toFixed(1)} ${(Math.sin(a * Math.PI / 180) * 15).toFixed(1)}" stroke="${lighten(g[k][0], .3)}" stroke-width="1.6"/>`;
    return s + spec(-9, -10, 7, 4, -30, .7);
  }
  if (k === "dau") return E(0, 2, 22, 22, D.radial("#FF4B5C", { light: .3 })) + [[-8, -2], [6, -4], [0, 8], [-6, 12], [9, 10]].map(([x, y]) => E(x, y, 1.8, 2.6, "#FFE9A8")).join("") + `<path d="M-14 -16C-6 -28 8 -28 14 -16C4 -10 -6 -10 -14 -16Z" fill="#3EAA3C"/>` + spec(-9, -6, 6, 3.4, -30, .7);
  if (k === "chuoi") return `<path d="M-24 6C-14 30 14 30 24 6C16 -4 -16 -4 -24 6Z" fill="${D.linear("#FFE88A", "#F2C830", [0, 0, 1, 1])}"/>` + E(0, 4, 8, 6, "#FFFBE0", 'opacity=".7"');
  return `<path d="M-26 -4A26 26 0 0 0 26 -4Z" fill="${D.linear("#7BDB58", "#2A8C3C", [0, 0, 1, 1])}"/><path d="M-21 -4A21 21 0 0 0 21 -4Z" fill="${D.radial("#FF4B5C", { light: .35 })}"/>` + [[-8, 6], [4, 8], [10, 2]].map(([x, y]) => E(x, y, 1.6, 2.6, "#3A1A2A")).join("");
}
function cup(key) {
  const [label, c1, c2] = FLAV[key], D = Doc("cp");
  let b = ground(D, 128, 232, 66);
  const glass = "M70 70L186 70L170 224C169 232 164 236 156 236L100 236C92 236 87 232 86 224Z", liq = "M76 104L180 104L168 222C167 228 163 230 157 230L99 230C93 230 89 228 88 222Z";
  b += `<path d="${glass}" fill="#E6F6FF" opacity=".35"/><path d="${liq}" fill="${D.linear(c1, c2, [0, 0, 0, 1])}"/>`;
  b += E(128, 104, 52, 9, lighten(c1, .5)) + E(128, 105, 46, 6.5, D.linear(lighten(c1, .3), c1, [0, 0, 1, 1]));
  b += [[112, 180, 5], [140, 196, 4], [126, 152, 3.5], [152, 168, 4.5]].map(([x, y, r]) => E(x, y, r, r, "#fff", 'opacity=".28"') + E(x - r * .3, y - r * .3, r * .35, r * .35, "#fff", 'opacity=".8"')).join("");
  b += `<path d="${glass}" fill="none" stroke="${lighten("#BFE6FF", .4)}" stroke-width="3.2" opacity=".9"/><path d="M174 80L162 222" stroke="${darken("#9AD0F5", .3)}" stroke-width="2.4" opacity=".5"/>`;
  b += `<path d="M84 80L98 220" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".65"/><path d="M92 88L96 118" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>`;
  b += E(128, 70, 58, 10, "none", `stroke="${lighten("#BFE6FF", .5)}" stroke-width="3.4" opacity=".95"`);
  b += `<path d="M152 66L178 18" stroke="#FF5A8C" stroke-width="10" stroke-linecap="round"/><path d="M152 66L178 18" stroke="#fff" stroke-width="3" stroke-dasharray="7 9" stroke-linecap="round" opacity=".85"/><path d="M175 24L192 20" stroke="#FF5A8C" stroke-width="10" stroke-linecap="round"/>`;
  b += `<g transform="translate(64 66) rotate(-14) scale(.8)">${garnish(D, key)}</g>`;
  return ["ly-" + key, "Ly nước ép " + label.toLowerCase(), D.out(b, null, "Ly nước ép " + label.toLowerCase())];
}
function emptyCup() {
  const D = Doc("ec"); let b = ground(D, 128, 232, 66, .6);
  const glass = "M70 70L186 70L170 224C169 232 164 236 156 236L100 236C92 236 87 232 86 224Z";
  b += `<path d="${glass}" fill="#E6F6FF" opacity=".28" stroke="${lighten("#BFE6FF", .4)}" stroke-width="3.2" stroke-dasharray="9 8"/>` + `<path d="M84 80L98 220" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".5"/>`;
  b += E(128, 70, 58, 10, "none", `stroke="${lighten("#BFE6FF", .5)}" stroke-width="3.4" opacity=".8"`);
  return ["ly-rong", "Ly rỗng", D.out(b, null, "Ly rỗng")];
}
function bottle() {
  const D = Doc("bt"), C = "#FF9A1F"; let b = ground(D, 128, 232, 56);
  const body = "M92 96C92 76 110 72 110 52L146 52C146 72 164 76 164 96L164 222C164 232 158 236 150 236L106 236C98 236 92 232 92 222Z";
  b += `<path d="${body}" fill="#E6F6FF" opacity=".4"/><path d="M92 120L164 120L164 222C164 232 158 236 150 236L106 236C98 236 92 232 92 222Z" fill="${D.linear("#FFC24A", "#F07A0A", [0, 0, 0, 1])}"/>`;
  b += E(128, 120, 36, 6, lighten(C, .5)) + `<path d="${body}" fill="none" stroke="${lighten("#BFE6FF", .4)}" stroke-width="3" opacity=".9"/>`;
  b += `<rect x="104" y="30" width="48" height="26" rx="8" fill="${D.linear("#FF7A94", "#D8345A", [0, 0, 0, 1])}"/><rect x="108" y="33" width="40" height="5" rx="2.5" fill="#fff" opacity=".5"/>`;
  b += `<rect x="98" y="150" width="60" height="44" rx="8" fill="#FFF8E8"/>` + E(128, 172, 13, 13, D.radial(C, { light: .35 })) + E(128, 172, 8, 8, "#FFE29A");
  b += `<path d="M102 84L102 214" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".6"/>`;
  return ["chai", "Chai nước ép", D.out(b, null, "Chai nước ép cam")];
}
module.exports = { cups: Object.keys(FLAV).map(k => () => cup(k)), others: [emptyCup, bottle], FLAV };
