/* Quán các lớp (Học Vui): phần DÙNG CHUNG cho mọi quán — thùng nguyên liệu, biển hiệu, bàn ghế, đồ trang trí, tường, cảnh (tô lại màu cảnh Quán Nước Ép) và chủ quán (cún).
   Mỗi quán (banh.js, pizza.js, cafe.js, ...) chỉ khai báo: bảng màu pal, hàm vẽ vật draw(D,id), emblem, máy làm, trang trí tường. Pop 3D như scripts/art/tiem/core.js. */
"use strict";
const { Doc, E, ground, orb, spec, slab, lighten, darken } = require("../tiem/core");
const town = require("../tiem/en-town"), pet = require("../tiem/pet");

const place = (s, cx, cy, k) => `<g transform="translate(${cx} ${cy}) scale(${k}) translate(-128 -140)">${s}</g>`;
/* tô lại màu một SVG có sẵn theo bảng {màu cũ: màu mới} */
const recolor = (svg, map) => Object.keys(map).reduce((s, k) => s.replace(new RegExp(k, "gi"), map[k]), svg);

/* thùng nguyên liệu: lòng thùng sau, vật nhô lên, mặt trước thùng che gốc vật */
function crate(th, id) {
  const D = Doc("c" + id.slice(0, 3)), col = th.col[id], c = th.pal.lv[0][1];
  let b = ground(D, 128, 240, 84) + E(128, 156, 78, 16, darken(c, .45));
  b += th.draw(D, id, 128, 128, .66);
  b += `<path d="M44 158L212 158L200 232Q198 242 186 242L70 242Q58 242 56 232Z" fill="${darken(c, .4)}" transform="translate(4 4)"/>`;
  b += `<path d="M44 158L212 158L200 232Q198 242 186 242L70 242Q58 242 56 232Z" fill="${D.linear(lighten(c, .35), c, [0, 0, 1, 1])}"/>`;
  b += `<rect x="40" y="152" width="176" height="16" rx="8" fill="${D.linear(lighten(c, .5), lighten(c, .1), [0, 0, 0, 1])}"/>`;
  b += orb(D, 128, 204, 22, 22, "#FFFFFF", { spec: false }) + orb(D, 128, 204, 15, 15, col, { specOp: .7 });
  b += `<path d="M58 172L66 230" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/>`;
  return ["box-" + id, "Thùng " + id, D.out(b, null, "Thùng nguyên liệu " + id)];
}
const item = (th, id) => { const D = Doc("i" + id.slice(0, 3)); return ["item-" + id, id, D.out(ground(D, 128, 238, 76) + th.draw(D, id), null, id)]; };
function empty(th) {
  const D = Doc("ie"); let b = ground(D, 128, 238, 60, .6) + E(128, 168, 86, 58, "#fff", 'opacity=".5"') + E(128, 168, 86, 58, "none", `stroke="${lighten(th.pal.lv[0][1], .3)}" stroke-width="5" stroke-dasharray="11 9"`);
  return ["item-empty", "Chưa có", D.out(b, null, "Chưa có")];
}
function sign(th, lv) {
  const [c1, c2] = th.pal.lv[lv - 1], D = Doc("s" + lv); let b = ground(D, 128, 238, 40, .6);
  b += `<rect x="116" y="130" width="24" height="104" rx="8" fill="${D.linear("#B8742E", "#8A5220", [0, 0, 1, 0])}"/>` + slab(34, 22, 188, 120, 26, c1, 8, D);
  b += `<rect x="46" y="34" width="164" height="96" rx="18" fill="none" stroke="#fff" stroke-width="4" opacity=".75" stroke-dasharray="2 10" stroke-linecap="round"/>`;
  b += th.emblem(D, 128, 82, .52);
  b += lv > 1 ? `<path d="M196 34l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#FFD43B"/>` : "";
  b += lv > 2 ? `<path d="M52 118l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#FFD43B"/>` : "";
  return ["sign-" + lv, "Biển hiệu cấp " + lv, D.out(b + `<path d="M44 40L110 36" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/>`, null, "Biển hiệu quán cấp " + lv)];
}
function table(th, lv) {
  const [c1, c2] = th.pal.lv[lv - 1], D = Doc("t" + lv); let b = ground(D, 128, 236, 92);
  b += `<rect x="116" y="150" width="24" height="76" rx="8" fill="${D.linear("#E8E0F0", "#B8B0D0", [0, 0, 1, 0])}"/><ellipse cx="128" cy="228" rx="46" ry="9" fill="${darken("#8A7AA8", .3)}"/>`;
  [[44, 190], [212, 190]].forEach(([x, y]) => { b += E(x, y + 30, 24, 6, "#4A1D5C", 'opacity=".2"') + `<rect x="${x - 4}" y="${y}" width="8" height="30" rx="3" fill="#B8B0D0"/>` + orb(D, x, y - 4, 24, 14, c1, { specOp: .6 }); });
  b += E(128, 136, 96, 34, darken(c2, .4)) + E(128, 128, 96, 34, D.linear(lighten(c1, .5), c1, [0, 0, 1, 1]));
  b += E(128, 128, 84, 28, "none", 'stroke="#fff" stroke-width="3" opacity=".55"') + E(128, 128, 38, 12, "#fff", 'opacity=".35"');
  if (lv > 1) b += `<path d="M128 126L128 60" stroke="#8A7AA8" stroke-width="5"/><path d="M60 70Q128 14 196 70Z" fill="${D.linear(lighten(c2, .3), c2, [0, 0, 0, 1])}"/><path d="M96 66Q128 40 160 66" stroke="#fff" stroke-width="4" fill="none" opacity=".5"/>`;
  return ["table-" + lv, "Bàn ghế cấp " + lv, D.out(b, null, "Bàn ghế quán cấp " + lv)];
}
/* trang trí 1: chậu cây nhỏ có cờ; trang trí 2: đèn treo màu quán */
function decor1(th) {
  const D = Doc("d1"), c = th.pal.lv[1][0]; let b = ground(D, 128, 240, 50, .6);
  b += `<path d="M84 176L172 176L160 236Q158 244 148 244L108 244Q98 244 96 236Z" fill="${D.linear(lighten(c, .3), darken(c, .2), [0, 0, 1, 1])}"/><rect x="76" y="166" width="104" height="16" rx="8" fill="${lighten(c, .35)}"/>`;
  [[128, 100, 0, "#4FB04A"], [96, 124, -35, "#6FD060"], [160, 124, 35, "#3E9A3E"]].forEach(([x, y, r, g]) => { b += `<g transform="rotate(${r} 128 170)">${orb(D, x, y, 22, 44, g, { specOp: .5 })}</g>`; });
  return ["decor-1", "Chậu cây", D.out(b + orb(D, 128, 64, 12, 12, "#FF7A94", { specOp: .8 }), null, "Chậu cây")];
}
function decor2(th) {
  const D = Doc("d2"), c = th.pal.lv[1][1]; let b = `<path d="M128 0L128 70" stroke="#8A7AA8" stroke-width="4"/>`;
  b += `<path d="M64 150Q64 70 128 70Q192 70 192 150Z" fill="${D.linear(lighten(c, .25), c, [0, 0, 1, 1])}"/><path d="M84 140Q84 90 116 82" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>`;
  b += E(128, 150, 64, 10, darken(c, .3)) + E(128, 156, 46, 18, "#FFF4B8", 'opacity=".85"') + E(128, 160, 22, 12, "#fff", 'opacity=".8"') + `<path d="M82 168L48 236L208 236L174 168Z" fill="#FFF4B8" opacity=".12"/>`;
  return ["decor-2", "Đèn treo", D.out(b, null, "Đèn treo")];
}
/* tường sau quầy: mái hiên sọc + kệ gỗ + trang trí riêng của quán (th.shelf) */
function wall(th) {
  const D = Doc("sb"), [w1, w2] = th.pal.wall, [a1, a2] = th.pal.awn; let b = `<rect width="300" height="150" fill="${D.linear(w1, w2, [0, 0, 0, 1])}"/>`;
  for (let i = 0; i < 14; i++) b += E(10 + i * 22, 52 + (i % 3) * 22, 3.4, 3.4, "#fff", 'opacity=".45"');
  b += `<rect x="150" y="108" width="140" height="9" rx="4" fill="${darken("#E8B07A", .25)}"/><rect x="150" y="117" width="140" height="5" rx="2.5" fill="${darken("#E8B07A", .5)}" opacity=".6"/>`;
  b += `<rect x="14" y="62" width="58" height="62" rx="8" fill="${darken("#C98A4E", .2)}" transform="translate(3 4)"/><rect x="14" y="62" width="58" height="62" rx="8" fill="${D.linear("#3D4A63", "#27304A", [0, 0, 1, 1])}"/>`;
  [78, 94, 110].forEach(y => { b += E(27, y, 5, 5, "#FFE08A") + `<rect x="37" y="${y - 3}" width="26" height="5" rx="2.5" fill="#F4F0E4" opacity=".85"/>`; });
  b += th.shelf(D);
  b += `<rect x="0" y="0" width="300" height="34" fill="${darken(a1, .35)}" transform="translate(0 5)"/>`;
  for (let i = 0; i < 10; i++) b += `<path d="M${i * 30} 0h30v22a15 15 0 0 1-30 0z" fill="${i % 2 ? D.linear("#FFFDF5", "#F2E4D0", [0, 0, 0, 1]) : D.linear(a1, a2, [0, 0, 0, 1])}"/>`;
  return ["canh-sau", "Tường quán", D.out(b + `<rect x="0" y="0" width="300" height="8" fill="#fff" opacity=".28"/>`, "0 0 300 150", "Tường quán")];
}
/* cảnh quầy/sàn/cửa hàng/sổ/phố: dùng cảnh Quán Nước Ép, tô lại màu theo quán */
function scenes(th) {
  const P = th.pal, c = P.lv[0], T = {}; town.forEach(f => { const r = f(); T[r[0]] = r; });
  const map = {
    "canh-quay": { "#7FD6C2": c[0], "#3FA89A": c[1], "#FFE3B8": P.counter[0], "#EBB878": P.counter[1] },
    "canh-san": { "#EBC58C": P.floor[0], "#C98A52": P.floor[1] },
    "canh-cua-hang": { "#E9E0FF": P.shopbg[0], "#C9B8F5": P.shopbg[1], "#FF7A94": P.awn[0], "#FFD93D": P.lv[2][0], "#5CC4B2": P.awn[1], "#EBC58C": P.floor[0], "#C98A52": P.floor[1] },
    "canh-so": { "#FFF4D8": P.paper[0], "#FFE2B0": P.paper[1] }
  };
  const out = ["canh-quay", "canh-san", "canh-cua-hang", "canh-so"].map(n => { const r = T[n]; return [n, r[1], recolor(r[2], map[n])]; });
  out.push(T["canh-pho"]); return out;
}
/* chủ quán: cún + mũ đầu bếp/tạp dề theo màu quán + huy hiệu emblem */
function owner(th) {
  const dog = pet[0]()[2], D = Doc("ow"), [c1, c2] = th.pal.lv[0], [h1, h2] = th.pal.awn;
  let b = `<path d="M90 198C92 186 164 186 166 198L174 232C150 244 106 244 82 232Z" fill="${D.linear(lighten(c1, .2), c2, [0, 0, 0, 1])}"/><path d="M92 196C110 204 146 204 164 196" stroke="#fff" stroke-width="3" opacity=".5" fill="none"/>`;
  b += E(128, 220, 15, 15, D.radial("#FFF8E8", { light: .2 })) + th.emblem(D, 128, 220, .17);
  b += `<path d="M84 70L90 40C94 30 162 30 166 40L172 70C150 80 106 80 84 70Z" fill="${D.linear("#FFFFFF", "#E8DCF0", [0, 0, 0, 1])}"/><path d="M84 70C106 80 150 80 172 70L171 60C150 70 106 70 85 60Z" fill="${D.linear(h1, h2, [0, 0, 0, 1])}"/>`;
  b += E(128, 36, 38, 7, "#fff", 'opacity=".7"') + orb(D, 128, 48, 9, 9, th.pal.lv[2][0], { specOp: .8 });
  const inner = /<defs>([\s\S]*?)<\/defs>/.exec(D.out(b))[1];
  return ["chu-quan", "Cún chủ quán", dog.replace("</defs>", inner + "</defs>").replace("</svg>", b + "</svg>").replace(/aria-label="[^"]*"/, 'aria-label="Cún chủ quán"')];
}
/* gom toàn bộ tranh một quán: th = {ids, col, pal, draw, emblem, machine(lv), shelf} */
function build(th) {
  const L = [];
  th.ids.forEach(id => { L.push(item(th, id), crate(th, id)); });
  L.push(empty(th), wall(th), decor1(th), decor2(th), owner(th));
  [1, 2, 3].forEach(l => L.push(th.machine(l), sign(th, l), table(th, l)));
  return L.concat(scenes(th));
}
module.exports = { decor1, decor2, build, crate, sign, table, wall, scenes, owner, place, recolor };
