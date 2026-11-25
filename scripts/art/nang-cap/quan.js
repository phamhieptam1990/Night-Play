/* Tranh nâng cấp QUÁN: mái hiên sọc (cấp 2) → + đèn dây (3) → + cờ nhỏ phía trên (4) → + viền vàng, huy hiệu sao, đèn lồng hai bên (5). Khung 340x100, màu theo quán từng lớp. */
"use strict";
const { Doc, E, orb, mix, lighten, darken } = require("../tiem/core");
const { star } = require("./pet");
const THEME = { 1: ["#FF8FB1", "#FFF6E6"], 2: ["#D9904F", "#FFE9C2"], 3: ["#FF9A3D", "#FFF1B8"], 4: ["#E5484D", "#FFFFFF"], 5: ["#2E8F8A", "#F6E3B8"] };
const H = { 2: 30, 3: 34, 4: 38, 5: 44 }, Y0 = 14;
function awning(g, l) {
  const D = Doc("mq" + g + l), [c1, c2] = THEME[g], h = H[l], n = 10, w = 34; let b = "";
  if (l >= 4) {
    b += `<path d="M2 3Q170 14 338 3" fill="none" stroke="#7a4a2a" stroke-width="1.6"/>`;
    for (let i = 0; i < 14; i++) { const x = 14 + i * 23, y = 3 + Math.sin((x / 340) * Math.PI) * 6.4, col = [c1, "#FFD24D", "#6EC8FF"][i % 3]; b += `<path d="M${x - 6} ${y.toFixed(1)}L${x + 6} ${y.toFixed(1)}L${x} ${(y + 12).toFixed(1)}Z" fill="${D.linear(lighten(col, .3), darken(col, .12))}"/>`; }
  }
  for (let i = 0; i < n; i++) {
    const x = i * w, col = i % 2 ? c2 : c1, gr = D.linear(lighten(col, .3), darken(col, .14), [0, 0, 0, 1]);
    b += `<path d="M${x} ${Y0}H${x + w}V${Y0 + h}A${w / 2} 9 0 0 1 ${x} ${Y0 + h}Z" fill="${gr}"/>`;
    b += `<path d="M${x + 3} ${Y0 + h + 1}A${w / 2 - 3} 7 0 0 0 ${x + w - 3} ${Y0 + h + 1}" fill="none" stroke="${lighten(col, .7)}" stroke-width="2" opacity=".45"/>`;
  }
  b += `<rect x="0" y="${Y0}" width="340" height="7" fill="${l === 5 ? D.linear("#FFE27A", "#C98A00") : D.linear(darken(c1, .1), darken(c1, .4))}"/><rect x="0" y="${Y0 + 1}" width="340" height="2" fill="#fff" opacity=".4"/>`;
  if (l >= 3) {
    const ly = Y0 + h + 20;
    b += `<path d="M6 ${ly - 8}Q170 ${ly + 12} 334 ${ly - 8}" fill="none" stroke="#6b4a2a" stroke-width="1.4"/>`;
    for (let i = 0; i < 9; i++) { const x = 20 + i * 37.5, y = ly - 8 + Math.sin((x - 6) / 328 * Math.PI) * 10.5; b += E(x, y + 3, 9, 9, "#FFE27A", 'opacity=".28"') + orb(D, x, y + 3, 4.6, 5.6, "#FFD24D", { spec: false }); }
  }
  if (l === 5) {
    b += star(D, 170, Y0 + h * .52, 13, "#FFD24D");
    [14, 326].forEach(x => { b += `<path d="M${x} ${Y0 + 7}V${Y0 + h + 14}" stroke="#7a4a2a" stroke-width="1.6"/>` + orb(D, x, Y0 + h + 24, 9, 11, "#E5484D", {}) + E(x, Y0 + h + 12.5, 5, 2.4, "#FFD24D"); });
  }
  return D.out(b, "0 0 340 100", "Mái hiên quán, cấp " + l);
}
module.exports = { awning };
