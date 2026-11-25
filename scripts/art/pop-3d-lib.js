/* Hàm dựng khối "Pop 3D" dùng chung cho các linh vật Pop mới (xem docs/PLAN-GAME-VIET-ANH.md mục 10).
   Một nguồn sáng trên-trái: thân tô gradient XUYÊN TÂM (#pg, #pe do gen-pop.js khai báo), thêm bóng đáy, ánh viền (rim), vệt bóng. KHÔNG filter. */
const n = v => +v.toFixed(1);
const O = (cx, cy, rx, ry, f = "url(#pg)", sw = 3, x = "") => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" stroke="var(--st)" stroke-width="${sw}" ${x}/>`;
const shade = (cx, cy, rx, ry, op = 0.2) => `<path d="M${n(cx - rx * .82)} ${n(cy + ry * .42)}Q${cx} ${n(cy + ry * 1.3)} ${n(cx + rx * .82)} ${n(cy + ry * .42)}Q${cx} ${n(cy + ry * .86)} ${n(cx - rx * .82)} ${n(cy + ry * .42)}Z" fill="var(--st)" opacity="${op}"/>`;
const rim = (cx, cy, rx, ry, a = 28, b = 84) => {
  const p = t => [n(cx + (rx - 3.5) * Math.cos(t * Math.PI / 180)), n(cy + (ry - 3.5) * Math.sin(t * Math.PI / 180))], s = p(a), e = p(b);
  return `<path d="M${s[0]} ${s[1]}A${rx - 3.5} ${ry - 3.5} 0 0 1 ${e[0]} ${e[1]}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".38"/>`;
};
const spec = (cx, cy, rx, ry) => `<ellipse cx="${n(cx - rx * .36)}" cy="${n(cy - ry * .56)}" rx="${n(rx * .3)}" ry="${n(ry * .14)}" transform="rotate(-24 ${n(cx - rx * .36)} ${n(cy - ry * .56)})" fill="var(--hl)" opacity=".5"/><circle cx="${n(cx - rx * .62)}" cy="${n(cy - ry * .34)}" r="3.4" fill="var(--hl)" opacity=".75"/>`;
const orb3 = (cx, cy, rx, ry) => O(cx, cy, rx, ry) + shade(cx, cy, rx, ry) + rim(cx, cy, rx, ry) + spec(cx, cy, rx, ry);
const star5 = (x, y, r, f = "#FFD43B", s = "#E8A317") => { let d = ""; for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * .45 : r, a = -Math.PI / 2 + i * Math.PI / 5; d += (i ? "L" : "M") + n(x + rr * Math.cos(a)) + " " + n(y + rr * Math.sin(a)); } return `<path d="${d}Z" fill="${f}" stroke="${s}" stroke-width="2" stroke-linejoin="round"/>`; };
const note = (x, y, c = "#FF5A8A") => `<g class="npa-twinkle"><ellipse cx="${x}" cy="${y}" rx="7" ry="5.4" transform="rotate(-20 ${x} ${y})" fill="${c}"/><path d="M${x + 6} ${y - 2}V${y - 26}Q${x + 16} ${y - 20} ${x + 14} ${y - 12}" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/></g>`;
const plus = (x, y, c = "#7BE0A0") => `<path d="M${x} ${y}h6v-6h5v6h6v5h-6v6h-5v-6h-6z" fill="${c}" opacity=".9" class="npa-twinkle"/>`;
module.exports = { n, O, shade, rim, spec, orb3, star5, note, plus };
