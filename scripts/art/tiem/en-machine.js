/* Tiệm Nước Ép: máy ép + đồ trang trí quầy (chậu cây, đèn lồng, cúp sao). Pop 3D, viewBox 256. */
"use strict";
const { Doc, E, ground, orb, spec, slab, lighten, darken } = require("./core");

function juicer() {
  const D = Doc("jm"), T = "#3FC7B0"; let b = ground(D, 128, 238, 92);
  /* phễu bỏ trái cây ở trên (miệng tối + viền) */
  b += `<path d="M66 118L190 118L170 50L86 50Z" fill="${D.linear(lighten("#D8F3F0", .3), "#8FD6CC", [0, 0, 1, 1])}"/>`;
  b += `<path d="M86 50L66 118" stroke="#fff" stroke-width="5" opacity=".5" stroke-linecap="round"/>`;
  b += E(128, 50, 42, 11, darken(T, .55)) + E(128, 51, 36, 8, "#1E4A52") + E(128, 50, 42, 11, "none", `stroke="${lighten("#D8F3F0", .6)}" stroke-width="3.4"`);
  b += `<path d="M104 52C112 58 144 58 152 52" stroke="#6FE0CC" stroke-width="2.4" fill="none" opacity=".6"/>`;
  /* thân máy có độ dày */
  b += slab(48, 112, 160, 118, 22, T, 8, D);
  b += `<rect x="68" y="132" width="120" height="66" rx="14" fill="${D.linear("#1E4A52", "#2A6670", [0, 0, 0, 1])}"/>`;
  b += `<path d="M76 138L150 138L76 186Z" fill="#fff" opacity=".1"/>`;
  b += `<path d="M76 184C98 176 120 192 142 184C160 178 172 186 180 184L180 190C180 194 176 196 172 196L84 196C80 196 76 194 76 190Z" fill="#FFB84A" opacity=".85"/>`;
  b += E(108, 166, 5, 5, "#fff", 'opacity=".4"') + E(150, 156, 4, 4, "#fff", 'opacity=".35"');
  b += E(96, 214, 8, 8, D.radial("#FF5A8C", { light: .4 })) + E(124, 214, 8, 8, D.radial("#FFD93D", { light: .4 }));
  b += `<rect x="112" y="228" width="32" height="10" rx="4" fill="${darken(T, .5)}"/>`;
  b += `<path d="M210 140L232 120" stroke="${darken(T, .35)}" stroke-width="8" stroke-linecap="round"/>` + orb(D, 234, 116, 12, 12, "#FF5A8C", { specOp: .8 });
  b += spec(76, 124, 12, 6, -30, .6);
  return ["may-ep", "Máy ép", D.out(b, null, "Máy ép nước trái cây")];
}
function plant() {
  const D = Doc("pl"); let b = ground(D, 128, 232, 60);
  [[-40, 96, 0], [30, 90, 1], [-12, 70, 2], [14, 110, 3]].forEach(([r, y, i]) => { b += `<g transform="rotate(${r} 128 170)">` + orb(D, 128, 100 - i * 4, 26, 62, i % 2 ? "#52C46A" : "#3FAE5A", { spec: false }) + `<path d="M128 56L128 150" stroke="#fff" stroke-width="2.5" opacity=".3"/></g>`; });
  b += slab(80, 160, 96, 74, 16, "#E07A4A", 7, D) + `<rect x="76" y="156" width="104" height="22" rx="9" fill="${D.linear("#F0966A", "#D0643A", [0, 0, 0, 1])}"/><path d="M84 164L172 164" stroke="#fff" stroke-width="3" opacity=".35"/>`;
  return ["chau-cay", "Chậu cây", D.out(b, null, "Chậu cây")];
}
function lantern() {
  const D = Doc("ln"), R = "#FF4B5C"; let b = `<path d="M128 8L128 52" stroke="#8A5A2A" stroke-width="5" stroke-linecap="round"/>`;
  b += ground(D, 128, 236, 40, .4);
  b += `<rect x="102" y="46" width="52" height="18" rx="6" fill="${D.linear("#FFD54A", "#C99A10", [0, 0, 0, 1])}"/>` + orb(D, 128, 140, 70, 78, R, { specOp: .75 });
  b += `<path d="M128 64C96 100 96 180 128 218M128 64C160 100 160 180 128 218" stroke="${darken(R, .3)}" stroke-width="3" fill="none" opacity=".4"/>`;
  b += `<rect x="104" y="208" width="48" height="16" rx="6" fill="${D.linear("#FFD54A", "#C99A10", [0, 0, 0, 1])}"/>` + [112, 128, 144].map(x => `<path d="M${x} 224L${x} 250" stroke="#FFD54A" stroke-width="4" stroke-linecap="round"/>`).join("");
  b += E(128, 140, 22, 26, "#FFE08A", 'opacity=".5"');
  return ["den-long", "Đèn lồng", D.out(b, null, "Đèn lồng đỏ")];
}
function trophy() {
  const D = Doc("tr"), G = "#FFC93D"; let b = ground(D, 128, 238, 66);
  b += slab(78, 200, 100, 34, 10, "#B8742E", 6, D);
  b += `<rect x="116" y="150" width="24" height="54" fill="${D.linear("#FFD870", "#E0A010", [0, 0, 1, 0])}"/>`;
  b += `<path d="M64 62C60 118 90 152 128 152C166 152 196 118 192 62Z" fill="${D.radial(G, { cx: .38, cy: .3, light: .5 })}"/>`;
  b += `<path d="M64 76C32 70 34 120 70 124M192 76C224 70 222 120 186 124" stroke="${darken(G, .15)}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  b += `<path d="M128 74L137 94L158 96L142 110L147 130L128 119L109 130L114 110L98 96L119 94Z" fill="#FFF8D8" opacity=".92"/>`;
  b += `<path d="M78 70C74 104 84 128 100 140" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>` + E(128, 62, 64, 9, lighten(G, .5));
  return ["cup-sao", "Cúp sao", D.out(b, null, "Cúp sao vàng")];
}
module.exports = [juicer, plant, lantern, trophy];
