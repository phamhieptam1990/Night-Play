/* VẬT của Nhà Của Bi (Pop 3D, viewBox 256): xà phòng, vòi sen, khăn, cá, táo, sữa, xe, gấu bông, đĩa bay, giường, đèn, cửa sổ, hộp quà.
   Dùng thêm 4 vật có sẵn của props.js: xương, bát ăn, bóng, vịt cao su (gen-nuoi-thu.js lấy trực tiếp). */
"use strict";
const { Doc, E, ground, orb, spec, slab, lighten, darken } = require("./core");

const bub = (D, x, y, r) => `<g opacity=".92">${orb(D, x, y, r, r, "#BFE9FF", { light: .7, dark: .2, specOp: .95 })}</g>`;
function soap() {
  const D = Doc("sp"), C = "#FF8FC0"; let b = ground(D, 128, 214, 84);
  b += slab(40, 104, 176, 96, 30, C, 11, D) + `<path d="M62 124C100 112 160 112 196 124" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"/>`;
  b += `<path d="M128 178C108 164 100 152 108 144C116 138 126 144 128 150C130 144 140 138 148 144C156 152 148 164 128 178Z" fill="${darken(C, .2)}" opacity=".55"/>`;
  b += bub(D, 70, 90, 20) + bub(D, 112, 70, 14) + bub(D, 190, 84, 24) + bub(D, 156, 56, 11) + bub(D, 222, 120, 9);
  return ["xa-phong", "Xà phòng", D.out(b, null, "Xà phòng thơm")];
}
function shower() {
  const D = Doc("sh"); let b = "";
  b += `<path d="M30 28L108 28Q132 28 132 52L132 66" stroke="${D.linear("#E8F4FF", "#8FB0D0", [0, 0, 0, 1])}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  b += `<g transform="rotate(14 150 84)">${E(150, 96, 64, 22, darken("#6AAEE8", .35))}${orb(D, 150, 84, 64, 26, "#8FD0FF", { light: .5, dark: .3 })}` +
    [-40, -20, 0, 20, 40].map(x => E(150 + x, 90, 4, 2.4, darken("#6AAEE8", .45), 'opacity=".7"')).join("") + `</g>`;
  const drop = (x, y, s) => `<path d="M${x} ${y}C${x + 9 * s} ${y + 14 * s} ${x + 9 * s} ${y + 24 * s} ${x} ${y + 24 * s}C${x - 9 * s} ${y + 24 * s} ${x - 9 * s} ${y + 14 * s} ${x} ${y}Z" fill="${D.linear("#E6F6FF", "#3FA0F0", [0, 0, 0, 1])}"/>`;
  b += [[116, 124, 1], [146, 142, 1.1], [176, 124, 1], [128, 172, 1.1], [162, 190, 1], [190, 168, .9], [104, 200, .9], [140, 222, .9]].map(([x, y, s]) => drop(x, y, s)).join("");
  b += spec(120, 76, 20, 6, -14, .85);
  return ["voi-sen", "Vòi sen", D.out(b, null, "Vòi sen")];
}
function towel() {
  const D = Doc("tw"), C = "#7FD6C2"; let b = ground(D, 128, 214, 90);
  b += slab(34, 96, 188, 108, 24, C, 12, D) + `<path d="M34 128L222 128" stroke="#fff" stroke-width="10" opacity=".8"/><path d="M34 168L222 168" stroke="#FFD93D" stroke-width="10" opacity=".95"/>`;
  b += `<path d="M44 108C100 100 160 100 214 108" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".4"/>`;
  b += [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${228 + 1}" y="${106 + i * 11}" width="12" height="6" rx="3" fill="${darken(C, .25)}"/>`).join("");
  return ["khan", "Khăn tắm", D.out(b, null, "Khăn tắm")];
}
function fish() {
  const D = Doc("fi"), C = "#5BC8FF"; let b = ground(D, 128, 206, 80);
  b += `<path d="M186 130L238 92L232 134L238 176Z" fill="${D.linear("#FFB84A", "#F07A0A", [0, 0, 1, 1])}"/>`;
  b += orb(D, 108, 134, 86, 56, C, { specOp: .85 }) + `<path d="M76 98C96 116 96 152 76 170" stroke="${lighten(C, .55)}" stroke-width="8" fill="none" opacity=".7"/><path d="M110 82C130 100 130 168 110 188" stroke="${lighten(C, .55)}" stroke-width="8" fill="none" opacity=".5"/>`;
  b += `<path d="M104 80C122 56 150 62 156 86C140 82 120 84 104 80Z" fill="${D.linear("#FFB84A", "#F07A0A", [0, 0, 1, 1])}"/>`;
  b += E(58, 124, 11, 13, "#fff") + E(60, 126, 7, 9, "#3A1A40") + E(62, 122, 3, 3.6, "#fff") + `<path d="M34 148C42 156 52 156 58 150" stroke="${darken(C, .5)}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  return ["ca", "Con cá", D.out(b, null, "Con cá")];
}
function apple() {
  const D = Doc("ap"), C = "#FF4B3E"; let b = ground(D, 128, 222, 66);
  const p = "M128 80C100 56 52 78 60 140C68 196 108 224 128 214C148 224 188 196 196 140C204 78 156 56 128 80Z";
  b += `<path d="${p}" fill="${D.radial(C, { cx: .4, cy: .32, r: .85, fx: .33, fy: .27 })}"/><path d="${p}" fill="none" stroke="${D.rimGrad(C)}" stroke-width="3"/>`;
  b += spec(88, 112, 15, 8.5, -38, .85) + `<path d="M128 80C128 60 134 46 144 38" stroke="#6B4423" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  b += `<path d="M138 56C150 36 176 36 186 46C176 62 152 66 138 56Z" fill="${D.linear("#8BE05A", "#2E9B3E")}"/><path d="M142 54C156 48 170 46 182 46" stroke="#E8FFD0" stroke-width="2" fill="none" opacity=".6"/>`;
  return ["tao", "Quả táo", D.out(b, null, "Quả táo")];
}
function milk() {
  const D = Doc("mk"); let b = ground(D, 128, 226, 70);
  b += `<path d="M168 100L204 88L204 214L168 226Z" fill="${D.linear("#C9E4FF", "#7FB4E8", [0, 0, 1, 1])}"/>`;
  b += `<rect x="72" y="100" width="96" height="126" rx="8" fill="${D.linear("#FFFFFF", "#DCEBFF", [0, 0, 1, 1])}"/>`;
  b += `<path d="M72 100L96 58L192 58L168 100Z" fill="${D.linear("#FFFFFF", "#BBD8F8", [0, 0, 1, 1])}"/><path d="M96 58L192 58L204 88L168 100Z" fill="${darken("#BBD8F8", .12)}" opacity=".6"/>`;
  b += `<path d="M72 150L168 150L168 196L72 196Z" fill="${D.linear("#5BA8FF", "#2F6FE0", [0, 0, 0, 1])}"/>`;
  b += E(120, 172, 17, 17, "#fff") + `<path d="M120 154C128 164 134 170 134 176C134 184 128 188 120 188C112 188 106 184 106 176C106 170 112 164 120 154Z" fill="${D.linear("#9FD0FF", "#3F86F0", [0, 0, 0, 1])}"/>` + E(114, 172, 3, 5, "#fff", 'opacity=".8"');
  b += `<path d="M80 108L80 218" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/>`;
  return ["sua", "Hộp sữa", D.out(b, null, "Hộp sữa")];
}
function car() {
  const D = Doc("cr"), C = "#FF5A5A"; let b = ground(D, 128, 218, 96);
  b += `<path d="M30 160C30 140 42 134 60 132L84 98C90 90 98 88 108 88L158 88C170 88 176 92 184 102L200 132C226 134 232 144 232 164L232 188L30 188Z" fill="${D.radial(C, { cx: .4, cy: .25, r: 1, light: .45, dark: .4 })}"/>`;
  b += `<path d="M92 104L108 104L108 132L72 132Z" fill="${D.linear("#E6F6FF", "#8FD0FF", [0, 0, 1, 1])}"/><path d="M118 104L158 104C164 104 168 108 172 114L184 132L118 132Z" fill="${D.linear("#E6F6FF", "#8FD0FF", [0, 0, 1, 1])}"/>`;
  b += `<path d="M44 160L220 160" stroke="${lighten(C, .55)}" stroke-width="5" stroke-linecap="round" opacity=".7"/>` + E(222, 160, 8, 8, "#FFE98A") + E(40, 162, 7, 6, "#FFB84A");
  b += spec(84, 122, 18, 6, -12, .55);
  [[84, 188], [180, 188]].forEach(([x, y]) => { b += E(x + 2, y + 3, 30, 30, darken("#3A3A4A", .2)) + orb(D, x, y, 30, 30, "#4A4A5E", { specOp: .5 }) + orb(D, x, y, 14, 14, "#D8E0F0", { specOp: .6 }); });
  return ["xe", "Xe đồ chơi", D.out(b, null, "Xe đồ chơi")];
}
function teddy() {
  const D = Doc("td"), C = "#C98A52"; let b = ground(D, 128, 232, 76);
  b += orb(D, 84, 66, 22, 22, C, { spec: false }) + orb(D, 172, 66, 22, 22, C, { spec: false }) + E(84, 66, 12, 12, "#F4C9A0") + E(172, 66, 12, 12, "#F4C9A0");
  b += orb(D, 92, 222, 26, 16, C, { spec: false }) + orb(D, 164, 222, 26, 16, C, { spec: false });
  b += orb(D, 128, 170, 62, 58, C, { spec: false }) + E(128, 182, 36, 38, D.radial("#F4C9A0", { light: .3, dark: .2 }));
  b += orb(D, 62, 160, 20, 26, C, { spec: false, rot: 30 }) + orb(D, 194, 160, 20, 26, C, { spec: false, rot: -30 });
  b += orb(D, 128, 90, 56, 50, C, { specOp: .4 }) + orb(D, 128, 106, 26, 20, "#F4C9A0", { spec: false });
  b += E(104, 82, 8, 9.5, "#3A1A40") + E(152, 82, 8, 9.5, "#3A1A40") + E(106, 78, 2.6, 3, "#fff") + E(154, 78, 2.6, 3, "#fff") + E(128, 100, 9, 6.5, "#4A2A3A") + E(125, 98, 3, 1.8, "#fff", 'opacity=".8"');
  b += `<path d="M128 106L128 112M118 114C122 118 134 118 138 114" stroke="#4A2A3A" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  b += `<path d="M100 142L128 152L156 142L156 160L128 152L100 160Z" fill="${D.linear("#FF7A94", "#D83A60", [0, 0, 1, 1])}"/>` + E(128, 152, 7, 7, "#E0486A");
  return ["gau-bong", "Gấu bông", D.out(b, null, "Gấu bông")];
}
function frisbee() {
  const D = Doc("fr"), C = "#8B7BFF"; let b = ground(D, 128, 206, 84, .8);
  b += `<ellipse cx="128" cy="140" rx="100" ry="44" fill="${darken(C, .4)}" transform="rotate(-10 128 140) translate(0 10)"/>`;
  b += `<g transform="rotate(-10 128 140)">${E(128, 140, 100, 44, D.radial(C, { cx: .35, cy: .3, light: .5, dark: .35 }))}${E(128, 138, 72, 28, D.linear(darken(C, .25), lighten(C, .1), [0, 0, 1, 1]))}${E(128, 138, 44, 16, "none", `stroke="${lighten(C, .6)}" stroke-width="4" opacity=".7"`)}${E(128, 140, 98, 42, "none", `stroke="${D.rimGrad(C)}" stroke-width="3"`)}${spec(78, 120, 22, 7, -20, .7)}</g>`;
  return ["dia-bay", "Đĩa bay", D.out(b, null, "Đĩa bay")];
}
function bed() {
  const D = Doc("bd"), C = "#7FA8FF"; let b = ground(D, 128, 214, 112);
  b += slab(34, 70, 188, 110, 40, darken(C, .15), 10, D) + `<rect x="58" y="100" width="140" height="64" rx="28" fill="${D.linear(darken(C, .55), darken(C, .3), [0, 0, 0, 1])}"/>`;
  b += `<g transform="rotate(-8 96 134)">${orb(D, 96, 134, 38, 22, "#FFFDF5", { spec: false, light: .1 })}</g>`;
  b += `<path d="M120 150C140 134 180 132 198 146L198 164C180 172 140 172 120 164Z" fill="${D.linear("#FF9DB8", "#E0486A", [0, 0, 1, 1])}"/><path d="M132 144L132 168M150 140L150 170M168 140L168 170" stroke="#fff" stroke-width="3" opacity=".45"/>`;
  b += slab(22, 150, 212, 62, 31, lighten(C, .12), 10, D);
  b += E(128, 190, 12, 9, "#fff", 'opacity=".85"') + [[108, 176], [122, 170], [134, 170], [148, 176]].map(([x, y]) => E(x, y, 4.6, 5.6, "#fff", 'opacity=".85"')).join("");
  b += spec(52, 164, 16, 6, -10, .6);
  return ["giuong-cun", "Giường cún", D.out(b, null, "Giường cún")];
}
function lamp() {
  const D = Doc("lp"); let b = ground(D, 128, 232, 56);
  b += `<ellipse cx="128" cy="86" rx="100" ry="80" fill="url(#${"lpG"})" opacity=".9"/>`;
  D.def(`<radialGradient id="lpG"><stop offset="0" stop-color="#FFE98A" stop-opacity=".7"/><stop offset="1" stop-color="#FFE98A" stop-opacity="0"/></radialGradient>`);
  b += orb(D, 128, 218, 44, 16, "#8B6A4A", { spec: false }) + `<rect x="120" y="120" width="16" height="100" rx="8" fill="${D.linear("#C9A070", "#7A5A3A", [0, 0, 1, 0])}"/>`;
  b += `<path d="M82 124L96 44C98 38 104 36 110 36L146 36C152 36 158 38 160 44L174 124Z" fill="${D.linear("#FFF0A8", "#FFB84A", [0, 0, 1, 1])}"/><path d="M82 124L174 124" stroke="${darken("#FFB84A", .3)}" stroke-width="4"/>`;
  b += `<path d="M100 48L90 112" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".6"/>`;
  return ["den", "Đèn ngủ", D.out(b, null, "Đèn ngủ")];
}
function window_() {
  const D = Doc("wn"); let b = "";
  b += `<rect x="30" y="30" width="196" height="196" rx="18" fill="${darken("#E8B07A", .35)}" transform="translate(4 6)"/><rect x="30" y="30" width="196" height="196" rx="18" fill="${D.linear("#FFE3B8", "#E8B07A", [0, 0, 1, 1])}"/>`;
  b += `<rect x="44" y="44" width="168" height="168" rx="10" fill="${D.linear("#9FDBFF", "#E6F6FF", [0, 0, 0, 1])}"/>`;
  b += `<g opacity=".95">${E(100, 86, 26, 12, "#fff")}${E(120, 80, 20, 14, "#fff")}${E(80, 88, 16, 9, "#fff")}${E(172, 120, 22, 10, "#fff")}${E(186, 116, 14, 9, "#fff")}</g>`;
  b += `<path d="M44 180C80 160 120 170 212 150L212 212L44 212Z" fill="${D.linear("#9FE080", "#4DB86A", [0, 0, 0, 1])}"/>`;
  b += `<path d="M128 44L128 212M44 128L212 128" stroke="#FFF6E8" stroke-width="9"/><path d="M52 52L96 52L52 100Z" fill="#fff" opacity=".3"/>`;
  b += `<path d="M30 30C60 80 56 160 30 226L30 30Z" fill="${D.linear("#FF9DB8", "#E0486A", [0, 0, 1, 0])}" opacity=".95"/><path d="M226 30C196 80 200 160 226 226L226 30Z" fill="${D.linear("#E0486A", "#FF9DB8", [0, 0, 1, 0])}" opacity=".95"/>`;
  return ["cua-so", "Cửa sổ", D.out(b, null, "Cửa sổ")];
}
function gift() {
  const D = Doc("gf"), C = "#FF7A94"; let b = ground(D, 128, 226, 90);
  b += slab(40, 112, 176, 112, 16, C, 12, D) + `<rect x="112" y="112" width="32" height="112" fill="${D.linear("#FFF0A8", "#FFC23A", [0, 0, 1, 0])}"/>`;
  b += slab(30, 84, 196, 40, 14, lighten(C, .1), 10, D) + `<rect x="112" y="84" width="32" height="40" fill="${D.linear("#FFF0A8", "#FFC23A", [0, 0, 1, 0])}"/>`;
  b += `<path d="M128 84C100 40 60 56 84 80C96 90 120 88 128 84ZM128 84C156 40 196 56 172 80C160 90 136 88 128 84Z" fill="${D.linear("#FFF0A8", "#FFB020", [0, 0, 1, 1])}"/>` + E(128, 84, 12, 10, "#FFC23A");
  b += spec(70, 140, 12, 6, -30, .5);
  return ["hop-qua", "Hộp quà", D.out(b, null, "Hộp quà")];
}
module.exports = [soap, shower, towel, fish, apple, milk, car, teddy, frisbee, bed, lamp, window_, gift];
