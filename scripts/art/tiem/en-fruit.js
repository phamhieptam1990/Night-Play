/* Tiệm Nước Ép (Tiếng Anh): trái cây Pop 3D còn thiếu ở props.js (táo, chuối, dưa hấu, chanh) + thùng gỗ đựng trái. viewBox 256. Mỗi hàm trả [tên, nhãn, svg]. */
"use strict";
const { Doc, E, ground, orb, spec, slab, lighten, darken } = require("./core");

const leaf = (D, x, y, rot, s) => `<path d="M0 0C14 -22 38 -20 46 -8C32 6 12 10 0 0Z" transform="translate(${x} ${y}) rotate(${rot}) scale(${s || 1})" fill="${D.linear("#8BE05A", "#2E9B3E")}"/>`;

function apple() {
  const D = Doc("ap"), C = "#FF4B4B"; let b = ground(D, 128, 222, 70);
  b += orb(D, 128, 142, 80, 72, C, { specOp: .8 });
  b += E(128, 80, 20, 8, darken(C, .55), 'opacity=".7"');
  b += `<path d="M128 84C126 66 130 54 138 44" stroke="#7B4A12" stroke-width="7" stroke-linecap="round" fill="none"/>` + leaf(D, 134, 56, -10, 1.1);
  return ["tao", "Quả táo", D.out(b, null, "Quả táo")];
}
function banana() {
  const D = Doc("bn"), Y = "#FFD93D"; let b = ground(D, 128, 214, 78);
  const p = "M62 84C54 154 112 214 206 192C220 188 222 174 210 172C148 176 112 142 108 80C106 66 66 68 62 84Z";
  b += `<path d="${p}" transform="translate(4 6)" fill="${darken(Y, .45)}" opacity=".55"/>`;
  b += `<path d="${p}" fill="${D.linear(lighten(Y, .45), darken(Y, .12), [0, 0, 1, 1])}"/>`;
  b += `<path d="M86 84C84 146 126 188 196 186" stroke="${darken(Y, .3)}" stroke-width="2.4" fill="none" opacity=".45"/>`;
  b += `<path d="M64 92C60 140 86 182 128 196" stroke="${D.rimGrad(Y)}" stroke-width="4" fill="none"/>`;
  b += `<path d="M66 78C66 64 104 62 108 78Z" fill="#7B4A12"/><path d="M204 172C216 170 224 180 214 190Z" fill="#5A3A18"/>`;
  b += `<path d="M82 100C82 134 92 158 108 176" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity=".6"/>`;
  return ["chuoi", "Quả chuối", D.out(b, null, "Quả chuối")];
}
function melon() {
  const D = Doc("wm"), R = "#FF4B5C"; let b = ground(D, 128, 206, 96);
  b += `<g transform="rotate(-8 128 120)">`;
  b += `<path d="M24 98A104 104 0 0 0 232 98Z" transform="translate(4 7)" fill="${darken("#2E9B3E", .5)}" opacity=".6"/>`;
  b += `<path d="M24 98A104 104 0 0 0 232 98Z" fill="${D.linear("#7BDB58", "#2A8C3C", [0, 0, 1, 1])}"/>`;
  b += `<path d="M36 98A92 92 0 0 0 220 98Z" fill="#F4FFD8"/>`;
  b += `<path d="M44 98A84 84 0 0 0 212 98Z" fill="${D.radial(R, { cx: .4, cy: .1, r: 1, fx: .4, fy: .05, light: .35 })}"/>`;
  b += `<path d="M24 98L232 98" stroke="${lighten(R, .5)}" stroke-width="6" stroke-linecap="round"/>`;
  [[86, 122], [128, 140], [170, 122], [106, 108], [150, 108], [128, 164], [76, 100], [180, 100]].forEach(([x, y]) => { b += E(x, y + 2, 5, 8, darken(R, .6), 'opacity=".4"') + E(x, y, 4.6, 8, "#3A1A2A") + E(x - 1.2, y - 2.4, 1.2, 2.6, "#fff", 'opacity=".6"'); });
  b += `<path d="M40 112C56 150 88 168 120 172" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".5"/>`;
  b += `<path d="M40 148C74 190 150 196 206 156" stroke="#C8FFA8" stroke-width="5" fill="none" opacity=".35"/>` + "</g>";
  return ["dua-hau", "Dưa hấu", D.out(b, null, "Miếng dưa hấu")];
}
function lemon() {
  const D = Doc("lm"), Y = "#FFE14A"; let b = ground(D, 128, 214, 76);
  b += E(40, 136, 16, 11, D.radial(Y, { light: .3 })) + E(216, 122, 16, 11, D.radial(Y, { light: .3 }));
  b += orb(D, 128, 130, 90, 66, Y, { rot: -10, specOp: .75, light: .6 });
  for (let i = 0; i < 18; i++) { const a = i * 2.1, r = 20 + (i * 13) % 58; b += E(128 + Math.cos(a) * r * 1.1, 132 + Math.sin(a) * r * .72, 1.5, 1.1, darken(Y, .4), 'opacity=".3"'); }
  b += leaf(D, 130, 66, -20, 1.2);
  return ["chanh", "Quả chanh", D.out(b, null, "Quả chanh")];
}
function crate() {
  const D = Doc("cr"), W = "#C98A4E"; let b = ground(D, 128, 154, 118, .8);
  b += `<rect x="14" y="26" width="228" height="120" rx="14" fill="${darken(W, .5)}"/>`;
  b += `<rect x="20" y="30" width="216" height="30" rx="10" fill="${D.linear(darken(W, .55), darken(W, .4), [0, 0, 0, 1])}"/>`;
  [[58, "#E3A868"], [90, "#D69A5A"], [122, "#C98A4E"]].forEach(([y, c], i) => { b += `<rect x="12" y="${y - 8}" width="232" height="30" rx="9" fill="${D.linear(lighten(c, .25), c, [0, 0, 0, 1])}"/><rect x="14" y="${y - 6}" width="228" height="5" rx="2.5" fill="#fff" opacity=".22"/>`; });
  [[30, 70], [226, 70], [30, 124], [226, 124]].forEach(([x, y]) => { b += E(x, y, 3.4, 3.4, darken(W, .5)) + E(x - 1, y - 1, 1.2, 1.2, "#fff", 'opacity=".7"'); });
  b += `<path d="M18 48L238 48" stroke="#fff" stroke-width="3" opacity=".3"/>`;
  return ["thung", "Thùng gỗ", D.out(b, "0 0 256 170", "Thùng gỗ")];
}
module.exports = [apple, banana, melon, lemon, crate];
