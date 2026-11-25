/* Quán Kem (Học Vui): kem ốc quế theo vị, hộp kem (thùng nguyên liệu), ốc quế rỗng. Pop 3D: một nguồn sáng trên-trái, thân gradient xuyên tâm,
   vệt bóng, ánh viền, bóng tiếp đất, KHÔNG filter. Dùng lõi scripts/art/tiem/core.js. viewBox 256. */
"use strict";
const { Doc, E, ground, orb, spec, lighten, darken } = require("../tiem/core");

/* id: [tên Việt, màu kem, màu đậm (viền/vân), màu cốt hộp] */
const FLAV = {
  vanilla: ["Vani", "#FFF0C2", "#F2D88A"], strawberry: ["Dâu", "#FF8FB1", "#E5558A"], chocolate: ["Sô-cô-la", "#9A6A4A", "#6A4028"],
  mint: ["Bạc hà", "#8FEAC8", "#3FBF98"], mango: ["Xoài", "#FFC84A", "#F29A1A"], blueberry: ["Việt quất", "#9AAEFF", "#6A7EE0"]
};
const cherry = (D, x, y, s) => orb(D, x, y, 11 * s, 11 * s, "#E8203C", { specOp: .85 }) + `<path d="M${x} ${y - 10 * s}Q${x + 6 * s} ${y - 26 * s} ${x + 16 * s} ${y - 30 * s}" stroke="#3E8A32" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
function sprinkles(cx, cy, rx, ry, seed) {
  const cols = ["#FF5A8C", "#4FC3F7", "#FFD43B", "#7BE0A0", "#fff"]; let s = "";
  for (let i = 0; i < 9; i++) {
    const a = (i * 137 + seed * 40) % 360 * Math.PI / 180, r = .25 + ((i * 53 + seed) % 60) / 100, x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r * .8 - ry * .1;
    s += `<rect x="${(x - 5).toFixed(1)}" y="${(y - 1.8).toFixed(1)}" width="10" height="3.6" rx="1.8" fill="${cols[i % 5]}" transform="rotate(${(i * 47) % 180} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  return s;
}
/* ốc quế: tam giác bo + lưới ô, nằm dưới viên kem */
function cone(D, x0, x1, y0, tip, big) {
  const id = D.next(), g = D.linear("#F8D08A", "#C98A3F", [0, 0, 1, 1]), mid = (x0 + x1) / 2;
  D.def(`<clipPath id="${id}"><path d="M${x0} ${y0}L${x1} ${y0}L${mid + 4} ${tip}Q${mid} ${tip + 6} ${mid - 4} ${tip}Z"/></clipPath>`);
  let s = `<path d="M${x0} ${y0}L${x1} ${y0}L${mid + 4} ${tip}Q${mid} ${tip + 6} ${mid - 4} ${tip}Z" fill="${g}"/><g clip-path="url(#${id})" stroke="${darken("#C98A3F", .25)}" stroke-width="2.4" opacity=".55">`;
  for (let i = -6; i < 10; i++) s += `<path d="M${x0 - 20 + i * 18} ${y0 - 10}L${x0 + 60 + i * 18} ${tip + 20}M${x1 + 20 - i * 18} ${y0 - 10}L${x1 - 60 - i * 18} ${tip + 20}"/>`;
  s += `</g><path d="M${x0 + 8} ${y0 + 4}L${mid - 6} ${tip - 6}" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".4"/>`;
  s += `<path d="M${x1 - 3} ${y0 + 2}L${mid + 6} ${tip - 4}" stroke="${darken("#C98A3F", .5)}" stroke-width="5" stroke-linecap="round" opacity=".3"/>`;
  return s + (big ? "" : "");
}
function scoop(D, cx, cy, rx, ry, c1, c2) {
  let s = orb(D, cx, cy, rx, ry, c1, { specOp: .8 });
  /* váy kem: viền sóng quanh đáy viên kem */
  const w = rx * 2 / 6, y = cy + ry * .62;
  let d = `M${cx - rx * .92} ${y}`; for (let i = 0; i < 6; i++) d += `q${(w / 2).toFixed(1)} ${(i % 2 ? 16 : 24)} ${w.toFixed(1)} 0`;
  s += `<path d="${d}L${cx + rx * .92} ${y - 6}L${cx - rx * .92} ${y - 6}Z" fill="${D.linear(lighten(c1, .12), c2, [0, 0, 0, 1])}"/>`;
  return s + spec(cx - rx * .4, cy - ry * .45, rx * .28, ry * .15, -26, .75);
}
function kem(key) {
  const [vi, c1, c2] = FLAV[key], D = Doc("k" + key.slice(0, 2)); let b = ground(D, 128, 238, 50);
  b += cone(D, 82, 174, 132, 228);
  b += scoop(D, 128, 104, 58, 50, c1, c2);
  b += key === "vanilla" || key === "mango" ? sprinkles(128, 84, 46, 34, key.length) : "";
  b += cherry(D, 128, 52, 1);
  return ["kem-" + key, "Kem " + vi.toLowerCase(), D.out(b, null, "Kem ốc quế " + vi.toLowerCase())];
}
function hop(key) {
  const [vi, c1, c2] = FLAV[key], D = Doc("h" + key.slice(0, 2)); let b = ground(D, 128, 236, 78);
  const body = "M58 118L198 118L184 226Q182 238 170 238L86 238Q74 238 72 226Z";
  b += `<path d="${body}" fill="${D.linear("#FFFFFF", "#E8E2F4", [0, 0, 1, 1])}"/><path d="M63 170L193 170L184 226Q182 238 170 238L86 238Q74 238 72 226Z" fill="${D.linear(c1, c2, [0, 0, 1, 1])}"/>`;
  b += E(128, 120, 72, 22, darken("#E8E2F4", .25)) + E(128, 116, 72, 22, "#FFFFFF");
  b += E(128, 114, 62, 17, D.radial(c1, { light: .4 })) + `<path d="M84 114Q104 102 128 114T172 114" stroke="${lighten(c1, .5)}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>`;
  b += orb(D, 128, 100, 38, 26, c1, { specOp: .8 }) + E(128, 196, 21, 21, "#fff", 'opacity=".85"') + orb(D, 128, 192, 12, 12, c1, { specOp: .7 });
  b += `<path d="M110 200L128 224L146 200Z" fill="#F2C27A"/>`;
  b += `<path d="M70 132L82 228" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55"/><path d="M192 132L182 226" stroke="${darken(c2, .4)}" stroke-width="5" stroke-linecap="round" opacity=".25"/>`;
  return ["hop-" + key, "Hộp kem " + vi.toLowerCase(), D.out(b, null, "Hộp kem " + vi.toLowerCase())];
}
function emptyCone() {
  const D = Doc("kr"); let b = ground(D, 128, 238, 44, .6);
  b += cone(D, 86, 170, 120, 228).replace(/fill="url\(#[^"]+\)"/, 'fill="#F6E3C0" opacity=".55"');
  b += E(128, 118, 46, 12, "none", `stroke="${lighten("#F2C27A", .3)}" stroke-width="4" stroke-dasharray="9 8" opacity=".9"`);
  return ["kem-rong", "Ốc quế rỗng", D.out(b, null, "Ốc quế rỗng")];
}
module.exports = { items: [...Object.keys(FLAV).map(k => () => kem(k)), ...Object.keys(FLAV).map(k => () => hop(k)), emptyCone], FLAV, cherry, scoop, cone };
