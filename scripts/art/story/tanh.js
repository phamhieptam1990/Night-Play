/* Vịnh Từ (Tiếng Anh): bến cảng, thuyền buồm, chợ nổi, hải đăng, cờ hiệu, khinh khí cầu. Không vẽ chữ. */
const { shadow, rnd, pick } = require("./common");
const COL = ["#FF7A8A", "#FFB454", "#4FC3E8", "#6FD3A8", "#B79CFF"];
const boat = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="30" ry="5" fill="#fff" opacity=".45"/><path d="M-26-2h52l-8 14h-36z" fill="#B97A3E"/><path d="M-26-2h52" stroke="#fff" stroke-width="3"/><rect x="-1.500" y="-44" width="3" height="42" fill="#7A5530"/><path d="M3-44Q26-26 3-6z" fill="#fff"/><path d="M-3-38Q-18-22-3-8z" fill="${c}"/></g>`;
const light = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 3, 38)}<path d="M-36 4Q-20-10 0-8T36 4z" fill="#B7B2A6"/><path d="M-16 0L-11-70h22L16 0z" fill="#fff"/><path d="M-14-14h28l-2 14h-24zM-11.500-44h23l-1.500 14h-20z" fill="#FF7A8A"/>
<rect x="-12" y="-84" width="24" height="14" rx="3" fill="#FFE9A0" stroke="#7A5530" stroke-width="3"/><path d="M-16-84h32l-16-16z" fill="#7A5530"/><path d="M14-78l40-14v28z" fill="#FFF3A8" opacity=".45"/></g>`;
const stall = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 3, 34)}<rect x="-28" y="-30" width="56" height="30" rx="4" fill="#D9A870"/><rect x="-28" y="-30" width="56" height="8" fill="#B97A3E"/>
<path d="M-34-30l6-26h56l6 26z" fill="#fff"/>${[0, 1, 2, 3].map(i => `<path d="M${-34 + i * 17} -30L${-28 + i * 14.500} -56h14.500L${-17 + i * 17} -30z" fill="${c}"/>`).join("")}<path d="M-34-30q8 10 17 0t17 0t17 0t17 0" fill="${c}"/>
<circle cx="-12" cy="-8" r="5" fill="#FF7A8A"/><circle cx="0" cy="-8" r="5" fill="#FFC857"/><circle cx="12" cy="-8" r="5" fill="#6FD3A8"/></g>`;
const crate = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 20)}<rect x="-16" y="-26" width="32" height="26" rx="4" fill="#C98F55"/><path d="M-16-13h32M-6-26v26M6-26v26" stroke="#8A5A2B" stroke-width="2.500"/></g>`;
const buoy = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 14)}<circle cx="0" cy="-12" r="12" fill="#fff"/><path d="M-12-12a12 12 0 0112-12v7a5 5 0 00-5 5zM12-12a12 12 0 01-12 12v-7a5 5 0 005-5z" fill="#FF5E6C"/><circle cx="0" cy="-12" r="5" fill="#CFEFFF"/></g>`;
const barrel = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 15)}<rect x="-13" y="-30" width="26" height="30" rx="9" fill="#B97A3E"/><path d="M-13-20h26M-13-10h26" stroke="#7A5530" stroke-width="3"/><rect x="-13" y="-30" width="8" height="30" rx="4" fill="#fff" opacity=".25"/></g>`;
const palm = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 20)}<path d="M-2 0Q8-22 0-46" stroke="#B9824A" stroke-width="7" fill="none" stroke-linecap="round"/>${[-65, -30, 0, 30, 65].map(a => `<path d="M0-46Q${(a * .6).toFixed(0)}-${64 - Math.abs(a) * .2} ${(a).toFixed(0)}-${42 - Math.abs(a) * .2}" stroke="#3FAE5B" stroke-width="8" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
const flagLine = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2" y="-52" width="4" height="54" rx="2" fill="#7A5530"/><rect x="-2" y="-52" width="4" height="54" rx="2" fill="#7A5530" transform="translate(60 0)"/><path d="M0-48Q30-34 60-48" stroke="#7A5530" stroke-width="2" fill="none"/>${[0, 1, 2, 3].map(i => `<path d="M${6 + i * 13} ${-44 + Math.sin(i) * 0 + 3 * (i % 2 ? 1 : 0.4) + i * 0} l8 0l-4 12z" fill="${COL[i]}"/>`).join("")}</g>`;
const balloon = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-22" rx="22" ry="26" fill="${c}"/><path d="M-6-46q-12 20 0 46M6-46q12 20 0 46" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/><path d="M-9 4l-8 10M9 4l8 10" stroke="#7A5530" stroke-width="2"/><rect x="-10" y="12" width="20" height="11" rx="3" fill="#B97A3E"/></g>`;
const gull = (x, y, s) => `<path d="M${x - 9 * s} ${y}q${5 * s}-${7 * s} ${9 * s} 0q${4 * s}-${7 * s} ${9 * s} 0" stroke="#fff" stroke-width="${2.5 * s}" fill="none" stroke-linecap="round"/>`;
module.exports = {
  pal: [
    { s1: "#A9E4FF", s2: "#FFF6E0", far: "#44BDE0", g1: "#FBE8B8", g2: "#EFCB8E", road: ["#C99A5E", "#F1D3A0"] },
    { s1: "#FFC9A8", s2: "#FFF3E0", far: "#3FB0DA", g1: "#FBE6B8", g2: "#EBC48A", road: ["#C58F58", "#F0CF9C"] },
    { s1: "#92D8EE", s2: "#F2FFFB", far: "#2FB4C8", g1: "#FFE9BC", g2: "#F0CF96", road: ["#C99A5E", "#F4DBAA"] },
    { s1: "#FF9F86", s2: "#FFE8B4", far: "#3A9FD2", g1: "#FFE0B0", g2: "#EEBE86", road: ["#BE8650", "#F1CC98"] },
    { s1: "#86B4F2", s2: "#FFD3E6", far: "#3A8FD8", g1: "#FFE6C4", g2: "#EDC49A", road: ["#B58AB0", "#F7DDEB"] }],
  far(c) { const { W, hz, g, pal } = c; let s = `<rect y="${hz - 80}" width="${W}" height="90" fill="${pal.far}"/><rect y="${hz - 80}" width="${W}" height="14" fill="#fff" opacity=".28"/>`;
    for (let i = 0; i < 8 + g * 2; i++) s += `<path d="M${rnd() * W} ${hz - 66 + rnd() * 60}q6-5 12 0t12 0" stroke="#fff" stroke-opacity=".55" stroke-width="2.500" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < 1 + g; i++) s += boat(W * ((i + .3 + rnd() * .4) / (1 + g)), hz - 50 + rnd() * 34, .5 + rnd() * .3, pick(COL));
    s += light(W * (g % 2 ? .12 : .88), hz - 4, g > 2 ? 1.1 : .85);
    return s; },
  sky(c) { let s = ""; for (let i = 0; i < 2 + c.g; i++) s += gull(rnd() * c.W, 20 + rnd() * c.hz * .5, 1 + rnd() * .6);
    if (c.g >= 3) s += balloon(c.W * (.25 + rnd() * .5), c.hz * .55, .9, pick(COL)); return s; },
  props: [(x, y, s) => stall(x, y, s, pick(COL)), (x, y, s) => crate(x, y, s), (x, y, s) => buoy(x, y, s), (x, y, s) => barrel(x, y, s), (x, y, s) => palm(x, y, s), (x, y, s) => flagLine(x, y, s * .8)],
  big: [(x, y, s) => stall(x, y, s * 1.4, pick(COL)), (x, y, s) => palm(x, y, s * 1.5), (x, y, s) => light(x, y, s * .9)],
};
