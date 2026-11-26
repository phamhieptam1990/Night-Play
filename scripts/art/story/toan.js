/* Đảo Số (Toán): đảo nổi trên biển, đèn lồng chấm, bậc thang số, khối xếp hình, tháp đồng hồ, cầu vồng. Không vẽ chữ/chữ số. */
const { shadow, rnd, pick } = require("./common");
const dots = (n, r, c) => { const P = [[0, 0], [-7, -7], [7, 7], [7, -7], [-7, 7]]; const o = { 1: [0], 2: [1, 2], 3: [1, 0, 2], 4: [1, 3, 4, 2], 5: [1, 3, 0, 4, 2] }[n]; return o.map(i => `<circle cx="${P[i][0]}" cy="${P[i][1]}" r="${r}" fill="${c}"/>`).join(""); };
const COL = ["#FF8FB1", "#FFC857", "#6FD3A8", "#7FB8FF", "#B79CFF"];
const palm = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 22)}<path d="M-2 0Q8-24 0-52" stroke="#B9824A" stroke-width="8" fill="none" stroke-linecap="round"/>
${[-70, -35, 0, 35, 70].map(a => `<path d="M0-52Q${(a * .6).toFixed(0)}-${74 - Math.abs(a) * .2} ${(a * 1.1).toFixed(0)}-${48 - Math.abs(a) * .2}" stroke="#3FAE5B" stroke-width="9" fill="none" stroke-linecap="round"/>`).join("")}<circle cx="-5" cy="-50" r="4.500" fill="#8B5A2B"/><circle cx="5" cy="-49" r="4.500" fill="#8B5A2B"/></g>`;
const lantern = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 14)}<rect x="-2.500" y="-60" width="5" height="62" rx="2.500" fill="#8B6B4A"/><path d="M0-60h16" stroke="#8B6B4A" stroke-width="4"/>
<g transform="translate(16 -48)"><rect x="-3" y="-8" width="6" height="8" rx="2" fill="#8B6B4A"/><rect x="-15" y="0" width="30" height="34" rx="14" fill="${c}"/><rect x="-15" y="0" width="12" height="34" rx="6" fill="#fff" opacity=".35"/><g transform="translate(0 17)">${dots(1 + Math.floor(rnd() * 5), 3.200, "#fff")}</g><rect x="-6" y="32" width="12" height="5" rx="2.500" fill="#8B6B4A"/></g></g>`;
const steps = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 44)}${[1, 2, 3, 4].map(i => `<g transform="translate(${(i - 2.5) * 22} 0)"><rect x="-10" y="${-i * 13}" width="20" height="${i * 13}" rx="5" fill="${COL[i - 1]}"/><rect x="-10" y="${-i * 13}" width="7" height="${i * 13}" rx="3" fill="#fff" opacity=".3"/><g transform="translate(0 ${-i * 13 + 11}) scale(.5)">${dots(i, 3.500, "#fff")}</g></g>`).join("")}</g>`;
const block = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 18)}<rect x="-16" y="-32" width="32" height="32" rx="8" fill="${c}"/><rect x="-16" y="-32" width="12" height="32" rx="6" fill="#fff" opacity=".28"/><g transform="translate(0 -16)">${dots(1 + Math.floor(rnd() * 5), 3.200, "#fff")}</g></g>`;
const tower = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 30)}<rect x="-18" y="-96" width="36" height="96" rx="8" fill="#FFD9A0"/><rect x="-18" y="-96" width="12" height="96" rx="6" fill="#fff" opacity=".35"/>
<path d="M-24-92l24-26 24 26z" fill="#FF8FB1"/><circle cx="0" cy="-70" r="15" fill="#fff" stroke="#E0A458" stroke-width="4"/><path d="M0-70v-9M0-70l7 4" stroke="#7B58E0" stroke-width="3" stroke-linecap="round"/>
<path d="M-8 0v-22a8 8 0 0116 0V0z" fill="#B97A3E"/><circle cx="0" cy="-125" r="4" fill="#FFE066"/></g>`;
const arch = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-60 0Q0-70 60 0" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M-60 0Q0-70 60 0" stroke="#FFC857" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="14 8"/></g>`;
const bush = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 3, 26)}<circle cx="-12" cy="-8" r="14" fill="#4DB85A"/><circle cx="12" cy="-8" r="15" fill="#4DB85A"/><circle cx="0" cy="-15" r="16" fill="#66CC6B"/><circle cx="-5" cy="-19" r="4" fill="#fff" opacity=".4"/></g>`;
const flag = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 10)}<rect x="-2" y="-46" width="4" height="48" rx="2" fill="#fff"/><path d="M2-46h26l-7 9 7 9H2z" fill="${c}"/></g>`;
const rainbow = (W, hz, k) => { const R = Math.min(W * .3, hz * .85), cx = W * (.3 + k * 2); return [0, 1, 2, 3, 4].map(i => `<path d="M${cx - R + i * 7} ${hz}A${R - i * 7} ${R - i * 7} 0 0 1 ${cx + R - i * 7} ${hz}" stroke="${["#FF7A8A", "#FFB454", "#FFE066", "#7FD66A", "#6FB8FF"][i]}" stroke-width="7" fill="none" opacity=".55"/>`).join(""); };
const island = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="34" ry="9" fill="#E8D29A"/><path d="M-30-2Q-14-22 0-20Q18-22 30-2z" fill="#6FCB6B"/><path d="M-6-16l0-18M-6-34q-10 0-12 6M-6-34q10 0 12 6" stroke="#3FAE5B" stroke-width="3" fill="none"/></g>`;
const float = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="34" ry="9" fill="#9BE08A"/><path d="M-32 2Q0 40 32 2z" fill="#C9A26A"/><path d="M-22 10Q0 28 22 10" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/>${dots(3, 3, "#FFC857")}</g>`;
module.exports = {
  pal: [
    { s1: "#9EDCFF", s2: "#EFFAFF", far: "#5CC8F0", g1: "#C4EE90", g2: "#8CD86B", road: ["#E2C27A", "#FFF0BF"] },
    { s1: "#A9D4FF", s2: "#FFF3D6", far: "#4FB8EE", g1: "#B2E790", g2: "#79D07A", road: ["#E5BE74", "#FFEDB8"] },
    { s1: "#C7BCFF", s2: "#FFE6F2", far: "#6AB0F5", g1: "#BDE894", g2: "#82D487", road: ["#DDB6D0", "#FFE9F4"] },
    { s1: "#FFC98F", s2: "#FFF3D2", far: "#4AA6E8", g1: "#C9E78C", g2: "#8DD37A", road: ["#E3B070", "#FFE9B4"] },
    { s1: "#7FA3F2", s2: "#EBD2FF", far: "#3F8FE0", g1: "#A8E3A0", g2: "#6CCB8E", road: ["#C8B4E8", "#F5EAFF"] }],
  far(c) { const { W, hz, g, pal } = c; let s = `<rect y="${hz - 70}" width="${W}" height="80" fill="${pal.far}"/><rect y="${hz - 70}" width="${W}" height="14" fill="#fff" opacity=".25"/>`;
    for (let i = 0; i < 6 + g * 2; i++) s += `<path d="M${rnd() * W} ${hz - 60 + rnd() * 50}h${14 + rnd() * 16}" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>`;
    if (g >= 3) s += rainbow(W, hz - 60, g === 4 ? .05 : .2);
    const n = 1 + (g > 2) + (g > 4); for (let i = 0; i < n; i++) s += island(W * (.15 + i * .35 + rnd() * .1), hz - 42 + rnd() * 20, .7 + rnd() * .4);
    if (g >= 2) s += arch(W * (g % 2 ? .62 : .35), hz - 8, 1.1);
    return s; },
  sky(c) { return c.g >= 4 ? [0, 1, 2, 3].map(i => float(c.W * (.2 + i * .22), c.hz * (.5 + (i % 2) * .15), .6)).join("") : ""; },
  props: [(x, y, s) => palm(x, y, s), (x, y, s) => lantern(x, y, s, pick(COL)), (x, y, s) => block(x, y, s, pick(COL)), (x, y, s) => bush(x, y, s), (x, y, s) => flag(x, y, s, pick(COL))],
  big: [(x, y, s) => steps(x, y, s), (x, y, s) => tower(x, y, s), (x, y, s) => palm(x, y, s * 1.4)],
};
