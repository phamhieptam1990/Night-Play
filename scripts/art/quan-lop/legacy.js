/* Quán lớp 1 (kem) và lớp 3 (nước ép): lấy tranh có sẵn (art/ của Quán Kem, shared/art/tiem-nuoc-ep) đổi sang TÊN CHUNG, thêm phần còn thiếu (chủ quán, biển, bàn, trang trí).
   Chỉ ĐỌC tranh cũ, không sửa. */
"use strict";
const fs = require("fs"), path = require("path");
const { place, owner, sign, table, decor1, decor2 } = require("./common");
const an = require("../tiem/en-animals");

const rd = (dir, n) => fs.readFileSync(path.join(dir, n + ".svg"), "utf8");
const label = svg => (/aria-label="([^"]*)"/.exec(svg) || [0, ""])[1];
const inner = svg => svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const emblemOf = svg => (D, cx, cy, s) => place(inner(svg), cx, cy, s);
const customers = () => an.customers.map(f => f());
const FL = ["vanilla", "strawberry", "chocolate", "mint", "mango", "blueberry"];
const JU = { cam: "orange", dau: "strawberry", tao: "apple", chuoi: "banana", "dua-hau": "watermelon", chanh: "lemon" };

/* đổi màu theo vòng màu (cho máy ép 2 đời sau) */
function hue(hexs, deg) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hexs.slice(i, i + 2), 16) / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = d === 0 ? 0 : mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + deg + 360) % 360;
  const l = (mx + mn) / 2, s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)), c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  const v = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return "#" + v.map(a => Math.round((a + m) * 255).toString(16).padStart(2, "0")).join("");
}
function grade1(art) {
  const L = [], add = (n, from) => { const s = rd(art, from); L.push([n, label(s), s]); };
  FL.forEach(f => { add("item-" + f, "kem-" + f); add("box-" + f, "hop-" + f); });
  add("item-empty", "kem-rong"); add("decor-1", "bong-bay"); add("decor-2", "den-treo");
  [1, 2, 3].forEach(l => { add("machine-" + l, "may-kem-" + l); add("sign-" + l, "bien-hieu-" + l); add("table-" + l, "ban-" + l); });
  ["canh-sau", "canh-san", "canh-quay", "canh-pho", "canh-cua-hang", "canh-so"].forEach(n => add(n, n));
  an.customers.forEach(f => { const r = f(); L.push(r); });
  const th = { pal: { lv: [["#7FD6C2", "#3FA89A"], ["#FF9EC0", "#E0558A"], ["#FFD66B", "#E8A317"]], awn: ["#7FD6C2", "#3FA89A"] }, emblem: emblemOf(rd(art, "kem-strawberry")) };
  L.push(owner(th));
  return L;
}
function grade3(sh, build) {
  const L = [], add = (n, from) => { const s = rd(sh, from); L.push([n, label(s), s]); };
  Object.keys(JU).forEach(k => { add("item-" + JU[k], "ly-" + k); add("box-" + JU[k], "fruit-" + k); });
  add("item-empty", "ly-rong"); add("chu-quan", "chu-quan");
  ["canh-quay", "canh-san", "canh-sau", "canh-pho", "canh-cua-hang", "canh-so"].forEach(n => add(n, n));
  const m = rd(sh, "may-ep"); [0, 150, 200].forEach((d, i) => L.push(["machine-" + (i + 1), "Máy ép cấp " + (i + 1), d ? m.replace(/#[0-9A-Fa-f]{6}\b/g, c => /^#(4A1D5C|1E4A52|fff)/i.test(c) ? c : hue(c, d)) : m]));
  const th = { pal: { lv: [["#7FD6C2", "#3FA89A"], ["#FFB347", "#E8821A"], ["#FF8FA8", "#E0558A"]], awn: ["#7FD6C2", "#3FA89A"] }, emblem: emblemOf(rd(sh, "ly-cam")) };
  [1, 2, 3].forEach(l => L.push(sign(th, l), table(th, l)));
  L.push(decor1(th), decor2(th));
  an.customers.forEach(f => L.push(f()));
  return L;
}
module.exports = { grade1, grade3, customers };
