/* Quán Nước Ép (Tiếng Anh) — cảnh các khu của thế giới: quầy (dải mặt quầy + sàn), phố nhìn qua cửa sổ, vườn trái cây, cửa hàng đồ, sổ công thức + bàn khách. Pop 3D, một nguồn sáng trên-trái. */
"use strict";
const { Doc, E, orb, slab, lighten, darken } = require("./core");

function counter() {
  const D = Doc("qy"); let b = "";
  b += `<path d="M0 204L300 204L300 228L0 228Z" fill="${D.linear("#7FD6C2", "#3FA89A", [0, 0, 0, 1])}"/><path d="M0 214L300 214" stroke="#fff" stroke-width="2.4" opacity=".3"/>`;
  b += `<path d="M14 142L286 142L300 190L0 190Z" fill="${D.linear("#FFE3B8", "#EBB878", [0, 0, 0, 1])}"/>`;
  b += `<path d="M0 190L300 190L300 204L0 204Z" fill="${darken("#C98A4E", .35)}"/><path d="M0 190L300 190" stroke="#FFF3DA" stroke-width="3" opacity=".7"/>`;
  b += `<path d="M14 142L286 142" stroke="#fff" stroke-width="3.4" opacity=".7"/><path d="M80 152L230 152" stroke="#fff" stroke-width="9" opacity=".16" stroke-linecap="round"/><path d="M14 142L0 190" stroke="#fff" stroke-width="2.6" opacity=".4"/>`;
  return ["canh-quay", "Mặt quầy", D.out(b, "0 138 300 90", "Mặt quầy nước ép")];
}
function floor() {
  const D = Doc("sn"); let b = `<rect width="300" height="200" fill="${D.linear("#EBC58C", "#C98A52", [0, 0, 0, 1])}"/>`;
  for (let i = 0; i < 9; i++) b += `<path d="M${i * 40 - 20} 0L${i * 56 - 100} 200" stroke="#fff" stroke-width="2" opacity=".16"/>`;
  b += `<path d="M0 50L300 50M0 100L300 100M0 150L300 150" stroke="${darken("#C98A52", .3)}" stroke-width="2" opacity=".18"/><rect width="300" height="14" fill="${darken("#C98A52", .5)}" opacity=".22"/>`;
  return ["canh-san", "Sàn quán", D.out(b, "0 0 300 200", "Sàn gỗ")];
}
function street() {
  const D = Doc("ph"); let b = `<rect width="300" height="150" fill="${D.linear("#8FD6FF", "#DDF4FF", [0, 0, 0, 1])}"/>` + E(238, 36, 22, 22, D.radial("#FFE066", { light: .5 })) + `<g fill="#fff" opacity=".85">${E(60, 34, 30, 9, "#fff")}${E(82, 28, 20, 9, "#fff")}${E(170, 52, 26, 7, "#fff")}</g>`;
  [[0, 70, 54, "#FFB88C"], [48, 50, 60, "#B7A4F0"], [104, 76, 50, "#8FE0C8"], [150, 56, 58, "#FFD27A"], [204, 66, 52, "#FF9FB8"], [252, 52, 52, "#9CCBFF"]].forEach(([x, y, w, c]) => {
    b += `<rect x="${x + 3}" y="${y + 3}" width="${w}" height="${116 - y}" fill="${darken(c, .4)}" opacity=".35"/><rect x="${x}" y="${y}" width="${w}" height="${116 - y}" rx="3" fill="${D.linear(lighten(c, .3), c, [0, 0, 1, 1])}"/>`;
    for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) b += `<rect x="${x + 9 + k * (w / 2 - 4)}" y="${y + 10 + r * 16}" width="${w / 2 - 14}" height="9" rx="2" fill="#FFF8D8" opacity=".85"/>`;
  });
  b += `<rect y="112" width="300" height="38" fill="${D.linear("#8A8FA8", "#6A6F88", [0, 0, 0, 1])}"/><path d="M0 134L300 134" stroke="#FFE9A0" stroke-width="3" stroke-dasharray="22 16" opacity=".8"/><rect y="108" width="300" height="8" fill="#E8E0D0"/>`;
  b += `<rect x="2" y="2" width="296" height="146" rx="6" fill="none" stroke="${darken("#C98A4E", .2)}" stroke-width="5"/>` + `<path d="M150 4L150 146" stroke="${darken("#C98A4E", .2)}" stroke-width="3.6"/>`;
  return ["canh-pho", "Phố qua cửa sổ", D.out(b, "0 0 300 150", "Con phố")];
}
function garden() {
  const D = Doc("vu"); let b = `<rect width="300" height="400" fill="${D.linear("#9ADFFF", "#E8F8D8", [0, 0, 0, 1])}"/>` + E(250, 44, 24, 24, D.radial("#FFE066", { light: .5 }));
  b += `<path d="M0 130C60 96 120 110 170 120C220 130 270 100 300 112L300 400L0 400Z" fill="${D.linear("#8BE05A", "#4FB04A", [0, 0, 0, 1])}"/>`;
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) { const x = 36 + i * 76 + (r % 2) * 20, y = 150 + r * 8; b += E(x + 3, y + 24, 22, 6, "#2A6A2A", 'opacity=".25"') + `<rect x="${x - 3}" y="${y}" width="6" height="26" rx="3" fill="#8A5A2A"/>` + orb(D, x, y - 6, 24, 22, i % 2 ? "#52C46A" : "#3FAE5A", { specOp: .5 }); }
  for (let i = 0; i < 18; i++) b += E(14 + (i * 53) % 280, 250 + (i * 37) % 130, 3.2, 3.2, ["#FF8FA8", "#FFE066", "#fff"][i % 3]);
  b += `<rect x="0" y="236" width="300" height="12" fill="${darken("#C98A4E", .1)}" opacity=".55"/>`;
  return ["canh-vuon", "Vườn trái cây", D.out(b, "0 0 300 400", "Vườn trái cây")];
}
function shop() {
  const D = Doc("ch"); let b = `<rect width="300" height="400" fill="${D.linear("#E9E0FF", "#C9B8F5", [0, 0, 0, 1])}"/>`;
  for (let i = 0; i < 12; i++) for (let j = 0; j < 9; j++) b += E(12 + i * 26 + (j % 2) * 13, 12 + j * 44, 3, 3, "#fff", 'opacity=".45"');
  for (let k = 0; k < 6; k++) { const x = k * 56; b += `<path d="M${x} 0L${x + 56} 0L${x + 28} 34Z" fill="${["#FF7A94", "#FFD93D", "#5CC4B2"][k % 3]}"/>`; }
  b += `<rect x="0" y="300" width="300" height="100" fill="${D.linear("#EBC58C", "#C98A52", [0, 0, 0, 1])}"/><rect y="296" width="300" height="8" fill="${darken("#C98A52", .3)}" opacity=".5"/>`;
  return ["canh-cua-hang", "Cửa hàng", D.out(b, "0 0 300 400", "Cửa hàng đồ")];
}
function book() {
  const D = Doc("so"); let b = `<rect width="300" height="400" fill="${D.linear("#FFF4D8", "#FFE2B0", [0, 0, 0, 1])}"/>`;
  for (let i = 0; i < 14; i++) b += `<path d="M0 ${40 + i * 28}L300 ${40 + i * 28}" stroke="#E8C98A" stroke-width="1.4" opacity=".5"/>`;
  b += `<rect x="0" y="0" width="14" height="400" fill="${D.linear("#B86A3A", "#8A4A22", [0, 0, 1, 0])}"/><path d="M270 0L270 60L283 48L296 60L296 0Z" fill="#FF5A7A"/>`;
  return ["canh-so", "Sổ công thức", D.out(b, "0 0 300 400", "Sổ công thức")];
}
function table() {
  const D = Doc("bn"); let b = E(128, 232, 90, 14, D.shadowGrad());
  b += `<rect x="116" y="150" width="24" height="76" rx="8" fill="${D.linear("#B8742E", "#8A5220", [0, 0, 1, 0])}"/><ellipse cx="128" cy="228" rx="46" ry="9" fill="${darken("#8A5220", .3)}"/>`;
  [[44, 190], [212, 190]].forEach(([x, y]) => { b += E(x, y + 30, 24, 6, "#4A1D5C", 'opacity=".2"') + `<rect x="${x - 4}" y="${y}" width="8" height="30" rx="3" fill="#8A5220"/>` + orb(D, x, y - 4, 24, 14, "#FF7A94", { specOp: .6 }); });
  b += E(128, 136, 96, 34, darken("#C98A4E", .4)) + E(128, 128, 96, 34, D.linear("#FFE3B8", "#E3A868", [0, 0, 1, 1]));
  b += E(128, 128, 84, 28, "none", `stroke="#fff" stroke-width="3" opacity=".5"`) + E(128, 128, 38, 12, "#fff", 'opacity=".35"');
  return ["ban", "Bàn khách", D.out(b, null, "Bàn khách")];
}
module.exports = [counter, floor, street, garden, shop, book, table];
