/* TRANG TRÍ + TRANG PHỤC cho thế giới Nuôi Thú (Pop 3D, viewBox 256): ghế sofa, tủ bếp, tủ lạnh, bồn tắm, cây, bụi hoa, sao; nơ, mũ, kính, vương miện (đè lên đầu Bi, cùng hệ toạ độ cún 256). */
"use strict";
const { Doc, E, ground, orb, spec, slab, lighten, darken } = require("./core");

function sofa() {
  const D = Doc("sf"), C = "#FF8FA8"; let b = ground(D, 128, 218, 108);
  b += slab(26, 80, 204, 84, 36, darken(C, .1), 10, D);                 /* lưng ghế */
  b += slab(18, 120, 56, 80, 24, lighten(C, .05), 8, D) + slab(182, 120, 56, 80, 24, lighten(C, .05), 8, D);   /* tay vịn */
  b += slab(60, 130, 136, 62, 22, lighten(C, .2), 10, D) + `<path d="M76 140C110 132 150 132 182 140" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".45"/>`;
  b += orb(D, 100, 118, 24, 18, "#FFE08A", { spec: false }) + orb(D, 160, 118, 24, 18, "#8FE0FF", { spec: false });
  b += [[50, 206], [206, 206]].map(([x, y]) => E(x, y, 9, 5, darken("#8A5A2A", .1))).join("");
  return ["ghe-sofa", "Ghế sofa", D.out(b, null, "Ghế sofa")];
}
function cabinet() {
  const D = Doc("kb"), C = "#FFD9A0"; let b = ground(D, 128, 222, 104);
  b += slab(20, 96, 216, 112, 14, darken(C, .05), 10, D) + `<rect x="20" y="86" width="216" height="26" rx="10" fill="${D.linear("#FFF6E0", "#E8C98A", [0, 0, 0, 1])}"/>`;
  b += [[34, "#7FD6C2"], [96, "#7FD6C2"], [158, "#7FD6C2"]].map(([x, c]) => `<rect x="${x}" y="122" width="56" height="70" rx="10" fill="${D.linear(lighten(c, .3), c, [0, 0, 1, 1])}"/>` + E(x + 44, 158, 4, 4, "#fff")).join("");
  b += orb(D, 70, 66, 24, 22, "#FF9A1F", { specOp: .6 }) + `<rect x="150" y="52" width="46" height="36" rx="8" fill="${D.linear("#FFFFFF", "#CFE4FF", [0, 0, 1, 1])}"/><rect x="156" y="62" width="34" height="8" rx="4" fill="#5BA8FF"/>`;
  return ["tu-bep", "Tủ bếp", D.out(b, null, "Tủ bếp")];
}
function fridge() {
  const D = Doc("fg"), C = "#BFE4FF"; let b = ground(D, 128, 232, 70);
  b += slab(64, 20, 128, 208, 22, C, 12, D) + `<path d="M64 98L192 98" stroke="${darken(C, .35)}" stroke-width="5"/>`;
  b += `<rect x="168" y="46" width="8" height="38" rx="4" fill="#fff"/><rect x="168" y="116" width="8" height="58" rx="4" fill="#fff"/>`;
  b += `<path d="M78 34L78 90" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/>` + E(110, 150, 14, 14, "#FF6B6B") + `<path d="M104 140L116 160M116 140L104 160" stroke="#fff" stroke-width="0"/>`;
  b += E(112, 144, 5, 4, "#fff", 'opacity=".7"');
  return ["tu-lanh", "Tủ lạnh", D.out(b, null, "Tủ lạnh")];
}
function tub() {
  const D = Doc("tb"), C = "#9FE0FF"; let b = ground(D, 128, 218, 112);
  b += `<path d="M24 110C24 180 56 208 128 208C200 208 232 180 232 110Z" fill="${D.radial("#FFFFFF", { cx: .4, cy: .3, light: .1, dark: .25 })}"/>`;
  b += `<ellipse cx="128" cy="110" rx="108" ry="26" fill="${darken("#E8F4FF", .1)}"/><ellipse cx="128" cy="114" rx="94" ry="19" fill="${D.linear(lighten(C, .3), darken(C, .15), [0, 0, 0, 1])}"/>`;
  b += [[90, 76, 18], [128, 60, 24], [168, 80, 16], [110, 40, 11], [150, 44, 12]].map(([x, y, r]) => orb(D, x, y, r, r, "#E8F8FF", { light: .7, dark: .2, specOp: .95 })).join("");
  b += `<path d="M44 150C60 176 90 190 120 190" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity=".7"/>` + [[62, 214], [194, 214]].map(([x, y]) => E(x, y, 12, 8, "#E0A100")).join("");
  return ["bon-tam", "Bồn tắm", D.out(b, null, "Bồn tắm bọt")];
}
function tree() {
  const D = Doc("tr"); let b = ground(D, 128, 236, 62);
  b += `<path d="M112 236L116 130L140 130L146 236Z" fill="${D.linear("#C98A52", "#7A4A22", [0, 0, 1, 0])}"/>`;
  b += orb(D, 80, 120, 52, 44, "#4DB86A", { spec: false }) + orb(D, 176, 118, 52, 46, "#4DB86A", { spec: false });
  b += orb(D, 128, 78, 70, 58, "#6BD07A", { specOp: .35 }) + E(98, 66, 10, 6, "#fff", 'opacity=".3"');
  b += [[96, 100], [150, 96], [128, 60], [172, 128], [78, 132]].map(([x, y]) => orb(D, x, y, 8, 8, "#FF5A5A", { specOp: .8 })).join("");
  return ["cay", "Cái cây", D.out(b, null, "Cái cây")];
}
function flowers() {
  const D = Doc("fw"); let b = ground(D, 128, 226, 100);
  b += E(128, 206, 104, 24, D.radial("#8B5A2B", { light: .2 })) + E(128, 200, 96, 18, D.radial("#A9743B", { light: .3 }));
  [[54, "#FF6B8A", 150], [100, "#FFD93D", 130], [146, "#FF9A1F", 140], [196, "#B58CFF", 150]].forEach(([x, c, y]) => {
    b += `<path d="M${x} 200L${x} ${y + 14}" stroke="#3E8A32" stroke-width="6" stroke-linecap="round"/>`;
    for (let i = 0; i < 5; i++) { const a = i * 72 * Math.PI / 180; b += orb(D, x + Math.cos(a) * 17, y + Math.sin(a) * 17, 14, 14, c, { spec: false }); }
    b += orb(D, x, y, 10, 10, "#FFF3B0", { spec: false });
  });
  return ["bui-hoa", "Bụi hoa", D.out(b, null, "Bụi hoa")];
}
function star() {
  const D = Doc("st"); let b = ground(D, 128, 232, 54);
  const p = (R, r) => { let d = ""; for (let i = 0; i < 10; i++) { const a = (-90 + i * 36) * Math.PI / 180, q = i % 2 ? r : R; d += (i ? "L" : "M") + (128 + Math.cos(a) * q).toFixed(1) + " " + (130 + Math.sin(a) * q).toFixed(1); } return d + "Z"; };
  b += `<path d="${p(100, 48)}" fill="${darken("#F59E0B", .1)}" transform="translate(4 6)" stroke-linejoin="round"/><path d="${p(100, 48)}" fill="${D.radial("#FFD24D", { light: .5, dark: .25 })}" stroke="#F59E0B" stroke-width="5" stroke-linejoin="round"/>`;
  b += spec(100, 92, 18, 8, -35, .85) + E(128, 134, 9, 9, "#fff", 'opacity="0"');
  return ["sao", "Ngôi sao", D.out(b, null, "Ngôi sao")];
}
/* TRANG PHỤC: toạ độ theo đầu Bi (tâm đầu 128,106; rộng 66, cao 58) */
function bow() {
  const D = Doc("ow"), C = "#FF5A8C"; let b = "";
  b += `<g transform="rotate(18 176 66)">${orb(D, 156, 66, 20, 15, C, { spec: false })}${orb(D, 198, 66, 20, 15, C, { spec: false })}${orb(D, 177, 66, 10, 10, darken(C, .15), { spec: false })}${spec(150, 61, 8, 4, -20, .7)}</g>`;
  return ["do-no", "Nơ", D.out(b, null, "Nơ trên đầu")];
}
function hat() {
  const D = Doc("ht"), C = "#7B8CFF"; let b = "";
  b += `<path d="M82 62L128 -4L174 62Z" fill="${D.linear(lighten(C, .3), darken(C, .2), [0, 0, 1, 1])}" transform="translate(0 20)"/>`;
  b += `<path d="M96 70L108 54M112 62L122 40M132 62L142 44M148 70L160 56" stroke="#FFD93D" stroke-width="5" stroke-linecap="round" opacity=".9"/>`;
  b += `<ellipse cx="128" cy="86" rx="48" ry="10" fill="${D.linear("#FFD93D", "#F5A623", [0, 0, 0, 1])}"/>` + orb(D, 128, 14, 11, 11, "#FFD93D", { specOp: .8 });
  return ["mu-sinh-nhat", "Mũ sinh nhật", D.out(b, null, "Mũ sinh nhật")];
}
function glasses() {
  const D = Doc("gl"); let b = "";
  [[96, 104], [160, 104]].forEach(([x, y]) => { b += E(x, y, 24, 22, "#fff", 'opacity=".18"') + E(x, y, 24, 22, "none", 'stroke="#2F5BD8" stroke-width="5"') + `<path d="M${x - 14} ${y - 12}L${x - 4} ${y - 16}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`; });
  b += `<path d="M120 100Q128 94 136 100" stroke="#2F5BD8" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M72 100L62 96M184 100L194 96" stroke="#2F5BD8" stroke-width="5" stroke-linecap="round"/>`;
  return ["kinh", "Kính", D.out(b, null, "Kính")];
}
function crown() {
  const D = Doc("cw"), C = "#FFD24D"; let b = "";
  b += `<path d="M82 74L84 34L106 54L128 24L150 54L172 34L174 74Z" fill="${D.linear("#FFF0A8", "#E0A100", [0, 0, 1, 1])}" stroke="#E0A100" stroke-width="3" stroke-linejoin="round"/>`;
  b += `<rect x="82" y="66" width="92" height="14" rx="6" fill="${darken(C, .15)}"/>` + [[106, "#FF5A8C"], [128, "#5BC8FF"], [150, "#FF5A8C"]].map(([x, c]) => orb(D, x, 73, 6, 6, c, { specOp: .8 })).join("");
  b += [[84, 32], [128, 22], [172, 32]].map(([x, y]) => orb(D, x, y, 7, 7, "#FFF3B0", { spec: false })).join("");
  return ["vuong-mien", "Vương miện", D.out(b, null, "Vương miện")];
}
module.exports = [sofa, cabinet, fridge, tub, tree, flowers, star, bow, hat, glasses, crown];
