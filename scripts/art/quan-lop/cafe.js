/* Quán CÀ PHÊ SÁCH (lớp 5): coffee, tea, cocoa, milk, lemonade, cookie; máy pha cà phê 3 đời; tường có giá sách. Pop 3D (lõi tiem/core.js). */
"use strict";
const { Doc, E, orb, lighten, darken } = require("../tiem/core");
const { place } = require("./common");

const col = { coffee: "#7A4A2A", tea: "#D88A2E", cocoa: "#5A3322", milk: "#6FA8E8", lemonade: "#FFE45A", cookie: "#D9A066" };
const pal = {
  lv: [["#B8825A", "#7A4A2A", "Nâu"], ["#6F93B8", "#34506B", "Xanh"], ["#E0B866", "#A8782A", "Vàng"]], wall: ["#F8EBD8", "#E2C8A2"], awn: ["#8A5530", "#5E3A1E"],
  floor: ["#C99A66", "#8F6338"], counter: ["#E8C896", "#B8864E"], shopbg: ["#F3E6D3", "#D9BE9C"], paper: ["#FFF3DC", "#F0D8A8"]
};
const MUG = { coffee: ["#FFF4E4", "#7A4A2A"], tea: ["#8FD6A0", "#D88A2E"], cocoa: ["#E8685A", "#4A2A1E"], milk: ["#8FBDF0", "#FFFFFF"] };
function mug(D, id) {
  const [m, liq] = MUG[id]; let b = E(128, 220, 100, 18, "#4A1D5C", 'opacity=".14"') + E(128, 214, 92, 20, D.linear("#FFFFFF", "#CFC8E0", [0, 0, 1, 1]));
  b += `<path d="M178 130Q226 124 220 168Q214 196 176 192" stroke="${darken(m, .15)}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  b += `<path d="M62 100L194 100L184 196Q180 218 156 218L100 218Q76 218 72 196Z" fill="${D.linear(lighten(m, .3), m, [0, 0, 1, 1])}"/><path d="M76 112L84 192" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".5"/>`;
  b += E(128, 100, 66, 18, darken(m, .35)) + E(128, 102, 58, 14, D.radial(liq, { light: .3 }));
  if (id === "coffee") b += `<path d="M128 112C100 98 104 90 118 94Q128 98 128 104Q128 98 138 94C152 90 156 98 128 112Z" fill="#FFF4E4"/>`;
  if (id === "cocoa") b += [[108, 100], [132, 96], [150, 104]].map(([x, y]) => E(x, y, 9, 6, "#fff") + E(x - 2, y - 2, 3, 1.6, "#fff", 'opacity=".6"')).join("");
  if (id === "tea") b += `<path d="M150 100Q168 84 184 70" stroke="#fff" stroke-width="2.4" fill="none"/><rect x="180" y="52" width="22" height="22" rx="4" fill="#FFF4E4" transform="rotate(12 190 62)"/><circle cx="191" cy="63" r="4" fill="#4FB04A"/>`;
  if (id === "milk") b += `<path d="M96 90Q86 70 100 56M128 86Q118 66 132 50" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>`;
  return b;
}
function body(D, id) {
  if (MUG[id]) return mug(D, id);
  if (id === "lemonade") {
    return E(128, 226, 70, 12, "#4A1D5C", 'opacity=".14"') + `<path d="M66 70L190 70L176 220Q174 232 160 232L96 232Q82 232 80 220Z" fill="#EAF6FF" opacity=".6"/><path d="M72 100L184 100L174 218Q172 226 160 226L96 226Q84 226 82 218Z" fill="${D.linear("#FFF08A", "#F5C81E", [0, 0, 0, 1])}"/>` +
      [[104, 150], [140, 130], [124, 190], [150, 176]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff" opacity=".55"/>`).join("") + `<path d="M150 90L186 14" stroke="#FF5A8C" stroke-width="9" stroke-linecap="round"/><path d="M66 70L190 70L176 220Q174 232 160 232L96 232Q82 232 80 220Z" fill="none" stroke="#fff" stroke-width="5" opacity=".8"/>` +
      `<path d="M82 84L92 210" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".6"/>` + orb(D, 180, 74, 26, 26, "#FFE45A", { specOp: .6 }) + E(180, 74, 18, 18, "none", 'stroke="#FFF8B0" stroke-width="3"');
  }
  let b = E(128, 220, 104, 20, "#4A1D5C", 'opacity=".14"') + E(128, 206, 100, 28, D.linear("#FFFFFF", "#CFC8E0", [0, 0, 1, 1]));
  b += orb(D, 100, 170, 62, 42, "#D9A066", { specOp: .5 }) + orb(D, 160, 186, 56, 38, "#E6B578", { specOp: .5 });
  return b + [[80, 160], [112, 176], [96, 188], [150, 190], [174, 178], [160, 202]].map(([x, y]) => E(x, y, 7, 5, D.radial("#6A4028", { light: .3 }))).join("");
}
const draw = (D, id, cx, cy, s) => place(body(D, id), cx == null ? 128 : cx, cy == null ? 140 : cy, s == null ? 1 : s);
function machine(lv) {
  const D = Doc("m" + lv), [c1, c2] = pal.lv[lv - 1];
  let b = `<rect x="26" y="40" width="204" height="170" rx="22" fill="${darken(c2, .35)}" transform="translate(5 6)"/><rect x="26" y="40" width="204" height="170" rx="22" fill="${D.linear(lighten(c1, .25), c2, [0, 0, 1, 1])}"/>`;
  b += `<rect x="40" y="50" width="176" height="10" rx="5" fill="#fff" opacity=".4"/>` + orb(D, 70, 96, 22, 22, "#FFF8E8", { specOp: .5 }) + `<path d="M70 96L80 86" stroke="#C42A4A" stroke-width="4" stroke-linecap="round"/>`;
  b += [[132, "#FF5A7A"], [160, "#FFD43B"], [188, "#7BE0A0"]].map(([x, c]) => orb(D, x, 96, 9, 9, c, { specOp: .8 })).join("");
  b += `<rect x="52" y="124" width="152" height="64" rx="12" fill="${darken(c2, .5)}"/><rect x="104" y="124" width="48" height="26" rx="6" fill="#D8DDE8"/>`;
  b += `<path d="M112 150L112 160M128 150L128 164M144 150L144 160" stroke="#8A5530" stroke-width="4" stroke-linecap="round"/>`;
  b += `<path d="M104 166L152 166L146 188L110 188Z" fill="#FFF8F0"/><path d="M106 168L150 168" stroke="#7A4A2A" stroke-width="6"/>`;
  b += `<rect x="40" y="200" width="176" height="18" rx="9" fill="#B8C0D0"/><rect x="46" y="203" width="164" height="5" rx="2.5" fill="#fff" opacity=".7"/>`;
  b += lv > 1 ? `<path d="M128 8l4 9 10 1-7.500 6.500 2.500 10L128 29l-9 5.500 2.500-10L114 18l10-1z" fill="#FFD43B"/>` : "";
  return ["machine-" + lv, "Máy cà phê cấp " + lv, D.out(`<ellipse cx="128" cy="236" rx="100" ry="11" fill="${D.shadowGrad()}"/>` + b, null, "Máy pha cà phê cấp " + lv)];
}
/* giá sách thay kệ đồ: 3 hàng sách màu */
const shelf = () => {
  let b = `<rect x="150" y="92" width="136" height="6" rx="3" fill="#8A5530"/>`;
  [["#E8685A", 0], ["#4F8FD0", 1], ["#F2B81A", 2], ["#4FB04A", 3], ["#8A5CC8", 4], ["#E8685A", 5], ["#4F8FD0", 6]].forEach(([c, i]) => { b += `<rect x="${156 + i * 18}" y="${60 + (i % 3) * 5}" width="14" height="${32 - (i % 3) * 5}" rx="2" fill="${c}"/><rect x="${158 + i * 18}" y="${66 + (i % 3) * 5}" width="10" height="3" fill="#fff" opacity=".5"/>`; });
  return b;
};
const emblem = (D, cx, cy, s) => place(`<path d="M30 150L226 150L226 190L30 190Z" fill="#fff" opacity="0"/>` + `<path d="M40 70Q100 50 128 80Q156 50 216 70L216 200Q156 180 128 206Q100 180 40 200Z" fill="${D.linear("#FFF3DC", "#E8C98A", [0, 0, 1, 1])}"/><path d="M128 80L128 206" stroke="#8A5530" stroke-width="5"/>`, cx, cy, s) + place(draw(D, "coffee", 128, 140, .5), cx, cy - 6 * s, s * .9);
module.exports = { id: "cafe", ids: Object.keys(col), col, pal, draw, shelf, emblem, machine };
