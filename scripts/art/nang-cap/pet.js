/* Tranh nâng cấp THÚ: evo(l) = lớp chồng khung 256 (hào quang dưới chân + sao lấp lánh, nhiều dần theo cấp); badge(l) = huy hiệu tròn có l-1 sao nhỏ. */
"use strict";
const { Doc, E, orb, spec, ground, darken, lighten } = require("../tiem/core");
const TIER = { 1: "#FFB36B", 2: "#BFD3FF", 3: "#FFD24D", 4: "#FF8AD8", 5: "#FFD24D" };
const starPath = (cx, cy, R, r) => { let d = ""; for (let i = 0; i < 10; i++) { const a = (-90 + i * 36) * Math.PI / 180, q = i % 2 ? r : R; d += (i ? "L" : "M") + (cx + Math.cos(a) * q).toFixed(1) + " " + (cy + Math.sin(a) * q).toFixed(1); } return d + "Z"; };
const star = (D, cx, cy, R, col) => `<path d="${starPath(cx + 1.5, cy + 2, R, R * .45)}" fill="${darken(col, .35)}" stroke-linejoin="round"/><path d="${starPath(cx, cy, R, R * .45)}" fill="${D.radial(col, { light: .5, dark: .2 })}" stroke="${darken(col, .15)}" stroke-width="1.6" stroke-linejoin="round"/>` + E(cx - R * .28, cy - R * .3, R * .22, R * .12, "#fff", 'opacity=".8" transform="rotate(-30 ' + (cx - R * .28) + " " + (cy - R * .3) + ')"');
const SPOT = [[26, 62, 17], [230, 66, 17], [16, 150, 13], [240, 158, 13], [42, 212, 11], [216, 208, 11]];
function evo(l) {
  const D = Doc("ev" + l), c = TIER[l]; let b = "";
  const rings = l === 4 ? ["#FF7A8A", "#FFD24D", "#6EC8FF"] : [c];
  rings.forEach((col, i) => { b += E(128, 228, 112 - i * 7, 17 - i * 1.5, "none", `stroke="${col}" stroke-width="${l >= 3 ? 5 : 4}" opacity="${.85 - i * .1}"`); });
  b += E(128, 228, 108, 15, D.radial(c, { light: .6, dark: .1 }), 'opacity=".22"');
  SPOT.slice(0, l + 1).forEach(s => { b += star(D, s[0], s[1], s[2], l >= 3 ? "#FFD24D" : l === 2 ? "#FFE27A" : "#FFC27A"); });
  return D.out(b, null, "Thú lớn hơn, cấp " + (l + 1));
}
function badge(l) {
  const D = Doc("hh" + l), c = TIER[l]; let b = ground(D, 128, 236, 70);
  b += `<path d="M82 170L62 236L96 220L112 246L124 176Z" fill="${D.radial("#E5558A", {})}"/><path d="M174 170L194 236L160 220L144 246L132 176Z" fill="${D.radial("#6A4FD8", {})}"/>`;
  b += orb(D, 128, 112, 84, 84, darken(c, .12), { spec: false }) + orb(D, 128, 112, 66, 66, lighten(c, .25), { spec: true });
  b += star(D, 128, 106, 40, "#FFF3B0");
  for (let i = 0; i < l - 1; i++) b += star(D, 128 + (i - (l - 2) / 2) * 26, 168, 11, "#FFD24D");
  return D.out(b, null, "Huy hiệu cấp " + l);
}
module.exports = { evo, badge, star, starPath };
