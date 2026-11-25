/* Quán PIZZA (lớp 4): pizza 6 loại (cheese, ham, mushroom, pepper, pineapple, tomato); lò gạch 3 đời; biển/tường có pizza. Pop 3D (lõi tiem/core.js). */
"use strict";
const { Doc, E, orb, spec, lighten, darken } = require("../tiem/core");
const { place } = require("./common");

const col = { cheese: "#FFD66B", ham: "#F29AA6", mushroom: "#E8D8C0", pepper: "#4FB04A", pineapple: "#FFD43B", tomato: "#E8402F" };
const pal = {
  lv: [["#E8685A", "#B8312B", "Đỏ"], ["#6FBF73", "#3E8E48", "Xanh"], ["#FFD66B", "#E8A317", "Vàng"]], wall: ["#FFEBD0", "#F6C892"], awn: ["#E8685A", "#B8312B"],
  floor: ["#E8B07A", "#B97B45"], counter: ["#FFE0B8", "#E8A868"], shopbg: ["#FFE9D0", "#F6C892"], paper: ["#FFF1DC", "#FFDFB8"]
};
const SPOT = [[92, 124], [150, 112], [182, 156], [128, 150], [88, 174], [152, 188]];
function top(D, id) {
  let b = "";
  SPOT.forEach(([x, y], i) => {
    if (id === "ham") b += E(x, y, 17, 12, darken("#F29AA6", .3)) + E(x, y - 2, 17, 12, D.radial("#F29AA6", { light: .35 })) + E(x - 4, y - 6, 5, 2.5, "#fff", 'opacity=".5"');
    else if (id === "mushroom") b += `<path d="M${x - 16} ${y + 2}Q${x - 14} ${y - 16} ${x} ${y - 16}Q${x + 14} ${y - 16} ${x + 16} ${y + 2}Z" fill="${D.linear("#FFF4E4", "#D8C2A0", [0, 0, 0, 1])}"/><rect x="${x - 5}" y="${y + 1}" width="10" height="9" rx="3" fill="#E8D8C0"/>`;
    else if (id === "pepper") b += E(x, y, 15, 11, "none", 'stroke="#2E8A3A" stroke-width="6"') + E(x, y - 1, 15, 11, "none", 'stroke="#6FD060" stroke-width="3.4"');
    else if (id === "pineapple") b += `<path d="M${x - 14} ${y + 8}Q${x - 14} ${y - 12} ${x} ${y - 12}Q${x + 14} ${y - 12} ${x + 14} ${y + 8}Z" fill="${D.linear("#FFE985", "#F2B81A", [0, 0, 0, 1])}"/><path d="M${x - 5} ${y - 8}L${x - 5} ${y + 4}M${x + 5} ${y - 8}L${x + 5} ${y + 4}" stroke="#F2B81A" stroke-width="2"/>`;
    else if (id === "tomato") b += E(x, y, 15, 11, darken("#E8402F", .3)) + E(x, y - 1.5, 15, 11, D.radial("#FF6A4F", { light: .3 })) + E(x, y - 1, 8, 5, "#FFB0A0", 'opacity=".6"') + (i % 2 ? "" : E(x + 3, y - 1, 1.8, 1.8, "#FFE585"));
    else b += E(x, y, 9 + (i % 3) * 3, 5 + (i % 2) * 2, "#FFF0A8", 'opacity=".8"') + E(x - 3, y - 2, 3, 1.6, "#fff", 'opacity=".6"');
  });
  return b;
}
function body(D, id) {
  let b = E(128, 178, 108, 70, darken("#C8843E", .3)) + E(128, 168, 108, 70, D.radial("#EDB468", { light: .35 })) + E(128, 168, 92, 58, "#D8402F") + E(128, 166, 86, 54, D.radial("#FFD66B", { light: .4 }));
  b += E(128, 166, 86, 54, "none", `stroke="${lighten("#FFD66B", .4)}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"`);
  b += `<g transform="translate(0 6)">${top(D, id)}</g>` + `<path d="M128 112L128 224M52 168L204 168" stroke="#C8843E" stroke-width="2.4" opacity=".28"/>` + spec(70, 126, 20, 6, -22, .45);
  return b;
}
const draw = (D, id, cx, cy, s) => place(body(D, id), cx == null ? 128 : cx, cy == null ? 140 : cy, s == null ? 1 : s);
function machine(lv) {
  const D = Doc("m" + lv), [c1, c2] = pal.lv[lv - 1];
  let b = `<path d="M30 236L30 140Q30 36 128 36Q226 36 226 140L226 236Z" fill="${darken(c2, .35)}" transform="translate(5 6)"/>`;
  b += `<path d="M30 236L30 140Q30 36 128 36Q226 36 226 140L226 236Z" fill="${D.linear(lighten(c1, .25), c2, [0, 0, 1, 1])}"/>`;
  for (let r = 0; r < 5; r++) for (let k = 0; k < 4; k++) b += `<rect x="${44 + k * 44 + (r % 2) * 22}" y="${62 + r * 28}" width="38" height="20" rx="4" fill="#fff" opacity=".18"/>`;
  b += `<path d="M70 236L70 160Q70 112 128 112Q186 112 186 160L186 236Z" fill="#3A1A22"/><path d="M78 236L78 164Q78 122 128 122Q178 122 178 164L178 236Z" fill="${D.linear("#FF8A2A", "#FFD43B", [0, 0, 0, 1])}"/>`;
  b += `<path d="M96 236Q92 200 108 190Q112 210 124 176Q136 200 140 188Q160 210 158 236Z" fill="#FFF1A0" opacity=".85"/>`;
  b += `<path d="M70 236L70 160Q70 112 128 112Q186 112 186 160L186 236" fill="none" stroke="${lighten(c1, .5)}" stroke-width="6"/><rect x="104" y="12" width="48" height="36" rx="8" fill="${darken(c2, .2)}"/>` + `<path d="M40 150Q38 70 100 50" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity=".4"/>`;
  b += lv > 1 ? `<path d="M128 -2l4 9 10 1-7.500 6.500 2.500 10L128 19l-9 5.500 2.500-10L114 8l10-1z" fill="#FFD43B" transform="translate(0 10)"/>` : "";
  return ["machine-" + lv, "Lò pizza cấp " + lv, D.out(`<ellipse cx="128" cy="242" rx="104" ry="11" fill="${D.shadowGrad()}"/>` + b, null, "Lò pizza cấp " + lv)];
}
const shelf = () => [[172, "#FFD66B"], [200, "#E8402F"], [228, "#4FB04A"], [256, "#F29AA6"]].map(([x, c]) => `<circle cx="${x}" cy="98" r="11" fill="#E8B060"/><circle cx="${x}" cy="98" r="8" fill="${c}"/><circle cx="${x - 3}" cy="95" r="2.4" fill="#fff" opacity=".6"/>`).join("");
module.exports = { id: "pizza", ids: Object.keys(col), col, pal, draw, shelf, emblem: (D, cx, cy, s) => draw(D, "ham", cx, cy, s), machine };
