/* Quán Kem: máy làm kem (3 đời), biển hiệu (3 đời), bàn ghế (3 đời), đồ trang trí, tường quầy. Pop 3D, một nguồn sáng trên-trái. */
"use strict";
const { Doc, E, ground, orb, spec, slab, lighten, darken } = require("../tiem/core");
const { cherry, scoop } = require("./kem");

const PAL = [["#7FD6C2", "#3FA89A", "Bạc hà"], ["#FF9EC0", "#E0558A", "Hồng"], ["#FFD66B", "#E8A317", "Vàng"]];
function machine(lv) {
  const [c1, c2] = PAL[lv - 1], D = Doc("m" + lv); let b = ground(D, 128, 238, 92);
  b += `<rect x="40" y="86" width="176" height="150" rx="22" fill="${darken(c2, .35)}" transform="translate(5 6)"/>`;
  b += `<rect x="40" y="86" width="176" height="150" rx="22" fill="${D.linear(lighten(c1, .25), c2, [0, 0, 1, 1])}"/>`;
  b += `<rect x="52" y="96" width="152" height="10" rx="5" fill="#fff" opacity=".45"/>`;
  /* phễu kính chứa kem */
  b += `<path d="M62 86L194 86L176 20L80 20Z" fill="#EAF6FF" opacity=".55"/><path d="M76 86L180 86L168 36L88 36Z" fill="${D.linear("#FFD0E2", "#FF8FB1", [0, 0, 0, 1])}"/>`;
  b += E(128, 36, 40, 7, "#FFE4EF") + `<path d="M62 86L194 86L176 20L80 20Z" fill="none" stroke="#fff" stroke-width="4" opacity=".85"/><path d="M88 30L74 80" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".6"/>`;
  b += `<rect x="78" y="14" width="100" height="12" rx="6" fill="${D.linear(lighten(c1, .3), c2, [0, 0, 0, 1])}"/>`;
  /* bảng nút + vòi */
  b += `<rect x="62" y="112" width="132" height="34" rx="12" fill="#2C2650"/>` + [[84, "#FF5A7A"], [112, "#FFD43B"], [140, "#4FC3F7"], [168, "#7BE0A0"]].map(([x, c]) => orb(D, x, 129, 9, 9, c, { specOp: .8 })).join("");
  b += `<rect x="104" y="150" width="48" height="22" rx="8" fill="${darken(c2, .3)}"/><rect x="112" y="170" width="32" height="12" rx="4" fill="#D8DDE8"/>`;
  b += `<path d="M100 186Q128 176 156 186Q150 200 128 204Q106 200 100 186Z" fill="${D.linear("#FFF4F8", "#FFB6D0", [0, 0, 1, 1])}"/>`;
  b += `<rect x="70" y="206" width="116" height="16" rx="8" fill="#B8C0D0"/><rect x="74" y="208" width="108" height="5" rx="2.5" fill="#fff" opacity=".7"/>`;
  b += lv > 1 ? `<path d="M128 6l4 9 10 1-7.500 6.500 2.500 10L128 27l-9 5.500 2.500-10L114 16l10-1z" fill="#FFD43B"/>` : "";
  return ["may-kem-" + lv, "Máy kem " + PAL[lv - 1][2].toLowerCase(), D.out(b, null, "Máy làm kem cấp " + lv)];
}
function sign(lv) {
  const [c1, c2] = PAL[lv - 1], D = Doc("s" + lv); let b = ground(D, 128, 238, 40, .6);
  b += `<rect x="116" y="130" width="24" height="104" rx="8" fill="${D.linear("#B8742E", "#8A5220", [0, 0, 1, 0])}"/>`;
  b += slab(34, 22, 188, 120, 26, c1, 8, D);
  b += `<rect x="46" y="34" width="164" height="96" rx="18" fill="none" stroke="#fff" stroke-width="4" opacity=".75" stroke-dasharray="2 10" stroke-linecap="round"/>`;
  b += scoop(D, 98, 74, 26, 22, "#FFF0C2", "#F2D88A") + `<path d="M76 90L120 90L98 126Z" fill="#E8B060"/>` + cherry(D, 98, 46, .7);
  b += scoop(D, 160, 86, 20, 17, "#FF8FB1", "#E5558A") + `<path d="M144 98L176 98L160 126Z" fill="#E8B060"/>`;
  b += lv > 1 ? `<path d="M196 34l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#FFD43B"/>` : "";
  b += lv > 2 ? `<path d="M52 118l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#FFD43B"/>` : "";
  b += `<path d="M44 40L110 36" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"/>`;
  return ["bien-hieu-" + lv, "Biển hiệu " + PAL[lv - 1][2].toLowerCase(), D.out(b, null, "Biển hiệu quán cấp " + lv)];
}
function table(lv) {
  const [c1, c2] = PAL[lv - 1], D = Doc("t" + lv); let b = ground(D, 128, 236, 92);
  b += `<rect x="116" y="150" width="24" height="76" rx="8" fill="${D.linear("#E8E0F0", "#B8B0D0", [0, 0, 1, 0])}"/><ellipse cx="128" cy="228" rx="46" ry="9" fill="${darken("#8A7AA8", .3)}"/>`;
  [[44, 190], [212, 190]].forEach(([x, y]) => { b += E(x, y + 30, 24, 6, "#4A1D5C", 'opacity=".2"') + `<rect x="${x - 4}" y="${y}" width="8" height="30" rx="3" fill="#B8B0D0"/>` + orb(D, x, y - 4, 24, 14, c1, { specOp: .6 }); });
  b += E(128, 136, 96, 34, darken(c2, .4)) + E(128, 128, 96, 34, D.linear(lighten(c1, .5), c1, [0, 0, 1, 1]));
  b += E(128, 128, 84, 28, "none", `stroke="#fff" stroke-width="3" opacity=".55"`) + E(128, 128, 38, 12, "#fff", 'opacity=".35"');
  if (lv > 1) b += `<path d="M128 126L128 60" stroke="#8A7AA8" stroke-width="5"/><path d="M60 70Q128 14 196 70Z" fill="${D.linear(lighten(c2, .3), c2, [0, 0, 0, 1])}"/><path d="M96 66Q128 40 160 66" stroke="#fff" stroke-width="4" fill="none" opacity=".5"/>`;
  return ["ban-" + lv, "Bàn ghế " + PAL[lv - 1][2].toLowerCase(), D.out(b, null, "Bàn ghế quán cấp " + lv)];
}
function balloons() {
  const D = Doc("bb"); let b = ground(D, 128, 240, 30, .5);
  [[84, 96, "#FF7A94"], [128, 70, "#FFD43B"], [172, 100, "#6FD0FF"], [108, 140, "#7BE0A0"], [150, 144, "#C4A7FF"]].forEach(([x, y, c]) => { b += `<path d="M${x} ${y + 30}Q${128 + (x - 128) * .2} 200 128 236" stroke="#8A7AA8" stroke-width="2.4" fill="none"/>` + orb(D, x, y, 28, 33, c, { specOp: .9 }) + `<path d="M${x - 5} ${y + 32}l5 7 5-7z" fill="${darken(c, .3)}"/>`; });
  return ["bong-bay", "Bóng bay", D.out(b, null, "Chùm bóng bay")];
}
function lamp() {
  const D = Doc("dl"); let b = `<path d="M128 0L128 70" stroke="#8A7AA8" stroke-width="4"/>`;
  b += `<path d="M64 150Q64 70 128 70Q192 70 192 150Z" fill="${D.linear("#FFB0CE", "#E0558A", [0, 0, 1, 1])}"/><path d="M84 140Q84 90 116 82" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".6"/>`;
  b += E(128, 150, 64, 10, darken("#E0558A", .3)) + E(128, 156, 46, 18, "#FFF4B8", 'opacity=".85"') + E(128, 160, 22, 12, "#fff", 'opacity=".8"');
  b += `<path d="M82 168L48 236L208 236L174 168Z" fill="#FFF4B8" opacity=".12"/>`;
  return ["den-treo", "Đèn treo", D.out(b, null, "Đèn treo hồng")];
}
function wall() {
  const D = Doc("sb"); let b = `<rect width="300" height="150" fill="${D.linear("#FFE9F1", "#FFC9DD", [0, 0, 0, 1])}"/>`;
  for (let i = 0; i < 14; i++) b += E(10 + i * 22, 52 + (i % 3) * 22, 3.4, 3.4, "#fff", 'opacity=".5"');
  b += `<rect x="150" y="108" width="140" height="9" rx="4" fill="${darken("#E8B07A", .25)}"/><rect x="150" y="117" width="140" height="5" rx="2.5" fill="${darken("#E8B07A", .5)}" opacity=".6"/>`;
  [[170, "#FFF0C2"], [198, "#FF8FB1"], [226, "#8FEAC8"], [254, "#FFC84A"], [278, "#9AAEFF"]].forEach(([x, c]) => { b += E(x + 2, 109, 11, 3, darken(c, .5), 'opacity=".3"') + `<path d="M${x - 10} 100L${x + 10} 100L${x + 7} 108L${x - 7} 108Z" fill="#E8B060"/>` + orb(D, x, 92, 12, 11, c, { specOp: .7 }); });
  b += `<rect x="14" y="62" width="58" height="62" rx="8" fill="${darken("#C98A4E", .2)}" transform="translate(3 4)"/><rect x="14" y="62" width="58" height="62" rx="8" fill="${D.linear("#3D4A63", "#27304A", [0, 0, 1, 1])}"/>`;
  [[78, "#FFF0C2"], [94, "#FF8FB1"], [110, "#8FEAC8"]].forEach(([y, c]) => { b += E(27, y, 5, 5, c) + `<rect x="37" y="${y - 3}" width="26" height="5" rx="2.5" fill="#F4F0E4" opacity=".85"/>`; });
  b += `<rect x="0" y="0" width="300" height="34" fill="${darken("#3FA89A", .35)}" transform="translate(0 5)"/>`;
  for (let i = 0; i < 10; i++) b += `<path d="M${i * 30} 0h30v22a15 15 0 0 1-30 0z" fill="${i % 2 ? D.linear("#FFFDF5", "#F2E4D0", [0, 0, 0, 1]) : D.linear("#7FD6C2", "#3FA89A", [0, 0, 0, 1])}"/>`;
  b += `<rect x="0" y="0" width="300" height="8" fill="#fff" opacity=".28"/>`;
  return ["canh-sau", "Tường quán kem", D.out(b, "0 0 300 150", "Tường quán kem")];
}
module.exports = [wall, balloons, lamp, ...[1, 2, 3].flatMap(l => [() => machine(l), () => sign(l), () => table(l)])];
