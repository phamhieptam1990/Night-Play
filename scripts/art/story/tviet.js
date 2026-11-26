/* Rừng Chữ (Tiếng Việt): rừng cây, thư viện trong hốc cây, dòng sông, nấm, chồng sách, đom đóm. Không vẽ chữ. */
const { shadow, rnd, pick } = require("./common");
const TC = [["#5CC46B", "#2F9A55"], ["#7BD070", "#3FAE5B"], ["#4DB89A", "#2B8F7A"], ["#8FD460", "#52AE45"]];
const tree = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 3, 34)}<rect x="-8" y="-44" width="16" height="46" rx="6" fill="#9A6A3A"/><rect x="-8" y="-44" width="6" height="46" rx="3" fill="#C08A55"/>
<circle cx="-22" cy="-60" r="28" fill="${c[1]}"/><circle cx="22" cy="-60" r="28" fill="${c[1]}"/><circle cx="0" cy="-86" r="32" fill="${c[1]}"/><circle cx="-18" cy="-64" r="25" fill="${c[0]}"/><circle cx="20" cy="-66" r="25" fill="${c[0]}"/><circle cx="0" cy="-90" r="29" fill="${c[0]}"/><ellipse cx="-10" cy="-100" rx="12" ry="6" fill="#fff" opacity=".3"/></g>`;
const pine = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 3, 26)}<rect x="-5" y="-14" width="10" height="16" rx="3" fill="#9A6A3A"/>${[0, 1, 2].map(i => `<path d="M${-30 + i * 6} ${-12 - i * 28}L0 ${-52 - i * 28}L${30 - i * 6} ${-12 - i * 28}z" fill="${i % 2 ? c[0] : c[1]}" stroke="${c[1]}" stroke-width="4" stroke-linejoin="round"/>`).join("")}</g>`;
const libTree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 3, 56)}<path d="M-36 2Q-30-60-26-86h52Q30-60 36 2z" fill="#A87444"/><path d="M-36 2Q-30-60-26-86h14Q-20-60-24 2z" fill="#C79A66"/>
<circle cx="-30" cy="-100" r="40" fill="#2F9A55"/><circle cx="30" cy="-100" r="40" fill="#2F9A55"/><circle cx="0" cy="-124" r="44" fill="#3FAE5B"/><circle cx="-24" cy="-108" r="34" fill="#5CC46B"/><circle cx="26" cy="-108" r="34" fill="#5CC46B"/>
<path d="M-13 2v-30a13 13 0 0126 0V2z" fill="#6B4423"/><path d="M-9 2v-28a9 9 0 0118 0V2z" fill="#FFE9A0"/><rect x="-26" y="-62" width="14" height="14" rx="5" fill="#FFE9A0"/><rect x="12" y="-62" width="14" height="14" rx="5" fill="#FFE9A0"/>
<rect x="-6" y="-24" width="4" height="12" fill="#FF8FB1"/><rect x="-1" y="-22" width="4" height="10" fill="#6FB8FF"/><rect x="4" y="-25" width="4" height="13" fill="#FFC857"/></g>`;
const mush = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 14)}<rect x="-4" y="-12" width="8" height="14" rx="4" fill="#FFF3DC"/><path d="M-16-10a16 14 0 0132 0z" fill="${c}"/><circle cx="-6" cy="-16" r="3" fill="#fff"/><circle cx="6" cy="-14" r="2.500" fill="#fff"/></g>`;
const books = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 22)}<rect x="-18" y="-10" width="36" height="10" rx="3" fill="#FF8FB1"/><rect x="-14" y="-20" width="30" height="10" rx="3" fill="#6FB8FF"/><rect x="-16" y="-29" width="28" height="9" rx="3" fill="#FFC857"/><rect x="-12" y="-6" width="24" height="2" fill="#fff" opacity=".6"/></g>`;
const stump = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 3, 24)}<rect x="-16" y="-18" width="32" height="20" rx="6" fill="#A87444"/><ellipse cx="0" cy="-18" rx="16" ry="6" fill="#D9B07A"/><path d="M-12-22l12-6 12 6-12 6z" fill="#fff"/><path d="M0-28v12" stroke="#6FB8FF" stroke-width="2"/></g>`;
const lamp = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 2, 10)}<rect x="-2.500" y="-46" width="5" height="48" rx="2.500" fill="#6B5A7A"/><circle cx="0" cy="-54" r="11" fill="#FFE9A0" stroke="#E7B84A" stroke-width="3"/><circle cx="-3" cy="-58" r="3.500" fill="#fff" opacity=".8"/></g>`;
const bushy = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0, 3, 24)}<circle cx="-12" cy="-8" r="13" fill="#3FA04A"/><circle cx="12" cy="-8" r="14" fill="#3FA04A"/><circle cx="0" cy="-14" r="15" fill="#5ABF5C"/><circle cx="-8" cy="-12" r="3" fill="#FF8FB1"/><circle cx="8" cy="-16" r="3" fill="#FFD23F"/></g>`;
const bridge = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-44 0Q0-26 44 0" stroke="#7A5530" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-44 0Q0-26 44 0" stroke="#C9985E" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="7 3"/></g>`;
module.exports = {
  pal: [
    { s1: "#FFE6A0", s2: "#F4FFD8", far: "#5FB872", g1: "#B6E27A", g2: "#86D067", road: ["#D9B070", "#FFEFC0"], tc: 0 },
    { s1: "#B8EBD0", s2: "#FFFBD8", far: "#46A96A", g1: "#A8E07A", g2: "#74CB6E", road: ["#D5AE72", "#FFEEC2"], tc: 1 },
    { s1: "#A6DCE0", s2: "#E4F8E8", far: "#3B9D86", g1: "#9EDC9A", g2: "#66C79A", road: ["#C9B28A", "#F5ECD0"], tc: 2 },
    { s1: "#FFD3A0", s2: "#FFF0CC", far: "#D9A04A", g1: "#D3E283", g2: "#9ACB5E", road: ["#D9A870", "#FFE8BC"], tc: 3 },
    { s1: "#9C8CE8", s2: "#F0DDFF", far: "#4A8F9A", g1: "#9DDC9E", g2: "#5FBF9A", road: ["#BFA9E0", "#F3E8FF"], tc: 2 }],
  far(c) { const { W, hz, g, pal } = c; let s = `<rect y="${hz - 14}" width="${W}" height="30" fill="${pal.far}"/>`;
    for (let x = -10; x < W + 30; x += 34 + rnd() * 14) { const h = 30 + rnd() * (26 + g * 5); s += `<circle cx="${x}" cy="${hz - 6 - h * .3}" r="${h * .6}" fill="${pal.far}"/><circle cx="${x + 10}" cy="${hz - 14 - h * .5}" r="${h * .4}" fill="#fff" opacity=".1"/>`; }
    return s; },
  mid(c) { const { W, hz, g } = c; if (g < 1) return ""; const y = hz + 10;
    let s = `<path d="M-10 ${y}Q${W * .25} ${y - 8} ${W * .5} ${y + 4}T${W + 10} ${y}V${y + 22}Q${W * .75} ${y + 30} ${W * .5} ${y + 22}T-10 ${y + 24}z" fill="#7FD0F0"/><path d="M-10 ${y + 3}Q${W * .25} ${y - 5} ${W * .5} ${y + 7}T${W + 10} ${y + 3}" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/>`;
    for (let i = 0; i < 4 + g * 2; i++) s += `<ellipse cx="${(i + .3 + rnd() * .4) * W / (4 + g * 2)}" cy="${y + 14}" rx="6" ry="3" fill="#FFE066" opacity=".9"/>`;
    return s; },
  sky(c) { let s = ""; if (c.g >= 4) for (let i = 0; i < 14; i++) s += `<circle cx="${rnd() * c.W}" cy="${rnd() * c.hz}" r="2" fill="#FFF3A8" opacity=".8"/>`; return s; },
  props(c) { const t = TC[c.pal.tc]; return [(x, y, s) => tree(x, y, s, pick(TC)), (x, y, s) => pine(x, y, s, t), (x, y, s) => mush(x, y, s, pick(["#FF7A8A", "#FFB454", "#B79CFF"])), (x, y, s) => bushy(x, y, s), (x, y, s) => books(x, y, s), (x, y, s) => lamp(x, y, s), (x, y, s) => stump(x, y, s)]; },
  big: [(x, y, s) => libTree(x, y, s), (x, y, s) => tree(x, y, s * 1.5, TC[1]), (x, y, s) => pine(x, y, s * 1.5, TC[2])],
};
