/* Sinh 15 linh vật AO (cá vàng, ốc, cá chép, tôm, cua, cá ngựa, koi, sao biển, cá nóc, rùa, sứa, bạch tuộc, cá heo, cá mập con, cá voi) vào shared/art/garden/ao/sv-<id>.svg.
   Chạy: node scripts/art/gen-ao-sinh-vat.js. Id khớp Farm.FISH (learn/farm.js). Luật: docs/MASCOT-ART-RULES.md (phong cách Pop). */
"use strict";
const fs = require("fs"), path = require("path"), L = require("./gen-ao-lib.js");
const { mat, eye, blush, smile, shine, shape, tube, svg, dark, light } = L;
const OUT = path.join(__dirname, "../../shared/art/garden/ao");
const S = {};   // id -> [tên, svg]
/* cá nhìn ngang, mặt quay trái: thân bầu dục + đuôi + vây lưng; opt.belly = màu bụng, opt.spots = các đốm */
function fish(id, vi, c, o = {}) {
  const m = mat(id, c), t = mat(id, o.tail || dark(c, .1), "t");
  const body = `${shape("path", 'd="M178 132C214 90 240 96 236 132C240 168 214 174 178 132Z"', t)}${shape("path", 'd="M92 82C108 46 150 50 160 86Z"', t)}
    ${shape("path", 'd="M104 184C116 212 146 210 152 180Z"', t)}` +
    shape("ellipse", 'cx="118" cy="134" rx="80" ry="62"', m) + (o.belly ? `<path d="M52 150C80 192 150 196 190 150C150 176 90 178 52 150Z" fill="${o.belly}" opacity=".85"/>` : "") + (o.spots || "") +
    shine("M74 106C86 80 116 74 140 80C118 82 92 92 82 116Z") + eye(84, 122, 13) + blush(80, 150) + smile(62, 144, 16);
  S[id] = [vi, svg(id, vi, m.def + t.def, body)];
}
fish("vang", "Cá vàng", "#FFA033", { tail: "#FF7A1A" });
fish("chep", "Cá chép", "#E8A24C", { belly: "#FFF1D6", tail: "#D9822B" });
fish("koi", "Cá koi", "#FFF4EA", { tail: "#FF6B4A", spots: '<ellipse cx="128" cy="96" rx="26" ry="16" fill="#FF5A3C"/><ellipse cx="160" cy="146" rx="22" ry="14" fill="#FF5A3C"/><circle cx="112" cy="170" r="9" fill="#3B2A1D"/>' });
/* cá nóc: tròn phồng + gai */
(() => { const id = "nuc", c = "#FFD25A", m = mat(id, c), spikes = [[128, 56], [172, 70], [194, 108], [188, 156], [70, 66], [52, 104]].map(([x, y]) => `<path d="M${x - 8} ${y + 8}L${x} ${y - 14}L${x + 8} ${y + 8}Z" fill="${dark(c, .2)}"/>`).join("");
  S[id] = ["Cá nóc", svg(id, "Cá nóc", m.def, `${spikes}${shape("path", 'd="M196 134C222 112 238 120 232 140C238 158 222 160 196 142Z"', m)}
    ${shape("circle", 'cx="120" cy="136" r="76"', m)}<path d="M66 160C90 206 168 208 192 156C166 186 96 188 66 160Z" fill="#FFF3C4"/>${shine("M74 104C88 76 118 66 142 72C118 76 96 90 86 116Z")}${eye(92, 124, 13)}${eye(136, 124, 13)}${blush(78, 152)}${blush(150, 152)}<ellipse cx="114" cy="156" rx="9" ry="7" fill="${L.INK}"/>`)]; })();
/* ốc sên */
(() => { const id = "oc", body = mat(id, "#F4D4A0"), sh = mat(id, "#C98A4B", "s");
  S[id] = ["Ốc sên", svg(id, "Ốc sên", body.def + sh.def, `${shape("path", 'd="M26 214C26 190 54 180 86 178L228 178C238 178 238 214 222 214Z"', body)}
    ${shape("path", 'd="M62 182C48 150 58 108 72 96"', body, 26)}<path d="M62 100L56 72M82 98L96 70" stroke="${body.stroke}" stroke-width="5" stroke-linecap="round"/><circle cx="56" cy="68" r="7" fill="${body.fill}" stroke="${body.stroke}" stroke-width="3"/><circle cx="97" cy="66" r="7" fill="${body.fill}" stroke="${body.stroke}" stroke-width="3"/>${shape("circle", 'cx="158" cy="124" r="62"', sh)}<path d="M158 124m0 0a8 8 0 0 1 16 0a24 24 0 0 1-48 0a40 40 0 0 1 80 0a56 56 0 0 1-112 0" fill="none" stroke="${sh.stroke}" stroke-width="6" stroke-linecap="round"/>${shine("M118 90C128 70 150 64 168 68C148 72 134 84 128 102Z")}${eye(54, 158, 11)}${blush(46, 184, 9, 6)}${smile(66, 190, 14)}`)]; })();
/* tôm: thân cong + đuôi quạt */
(() => { const id = "tom", c = "#FF8A6B", m = mat(id, c);
  S[id] = ["Tôm", svg(id, "Tôm", m.def, `${shape("path", 'd="M178 192C196 214 236 214 232 172C220 188 206 188 196 176Z"', m)}
    ${tube("M92 92C140 62 214 90 196 150C186 178 150 182 138 160", 46, c)}<path d="M150 70L164 100M178 78L186 110M200 98L198 130" stroke="${dark(c, .3)}" stroke-width="4" stroke-linecap="round"/>${shape("circle", 'cx="94" cy="110" r="38"', m)}<path d="M72 70L36 38M92 66L84 28" stroke="${dark(c)}" stroke-width="5" stroke-linecap="round" fill="none"/>${eye(82, 106, 12)}${blush(74, 128, 9, 6)}${smile(96, 126, 14)}`)]; })();
/* cua */
(() => { const id = "cua", c = "#FF6B5C", m = mat(id, c);
  const claw = x => `<circle cx="${x}" cy="86" r="26" fill="${m.fill}" stroke="${m.stroke}" stroke-width="3"/><path d="M${x} 62L${x + (x < 128 ? -4 : 4)} 38L${x + (x < 128 ? 14 : -14)} 62Z" fill="#fff" opacity=".4"/>`;
  S[id] = ["Cua", svg(id, "Cua", m.def, `<path d="M50 138L24 168M66 156L44 192M206 138L232 168M190 156L212 192" stroke="${m.stroke}" stroke-width="9" stroke-linecap="round"/><path d="M70 112L54 96M186 112L202 96" stroke="${m.stroke}" stroke-width="9" stroke-linecap="round"/>${claw(48)}${claw(208)}${shape("ellipse", 'cx="128" cy="148" rx="84" ry="58"', m)}<path d="M104 102L100 78M152 102L156 78" stroke="${m.stroke}" stroke-width="6" stroke-linecap="round"/>${eye(100, 76, 11)}${eye(156, 76, 11)}${shine("M64 128C78 108 102 104 122 108C102 112 84 124 76 142Z")}${blush(82, 160)}${blush(174, 160)}${smile(128, 154, 26)}`)]; })();
/* cá ngựa */
(() => { const id = "ngua", c = "#FFC94D", m = mat(id, c);
  S[id] = ["Cá ngựa", svg(id, "Cá ngựa", m.def, `${tube("M150 70C108 64 98 116 124 148C146 176 116 206 88 192C68 182 80 160 100 168", 44, c)}
    ${shape("path", 'd="M176 60C216 58 232 76 226 92C214 96 188 92 176 90Z"', m)}
    ${shape("circle", 'cx="150" cy="82" r="36"', m)}<path d="M126 56C112 34 138 26 140 46M146 48C150 26 176 30 168 52" stroke="${dark(c)}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M104 122L128 118M108 144L132 140" stroke="${dark(c, .2)}" stroke-width="5" stroke-linecap="round"/>${eye(150, 82, 12)}${blush(140, 104, 8, 6)}${smile(204, 88, 12)}`)]; })();
/* sao biển */
(() => { const id = "saobien", c = "#FFA24D", m = mat(id, c), pts = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 44 : 100; pts.push((128 + Math.cos(a) * r).toFixed(1) + " " + (136 + Math.sin(a) * r).toFixed(1)); }
  const dots = [[128, 52], [196, 100], [170, 190], [86, 190], [60, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${light(c, .55)}"/>`).join("");
  S[id] = ["Sao biển", svg(id, "Sao biển", m.def, `<path d="M${pts.join("L")}Z" fill="${m.fill}" stroke="${m.stroke}" stroke-width="22" stroke-linejoin="round"/>${dots}
    ${shine("M104 92C112 72 128 64 142 66C128 74 118 88 116 106Z")}${eye(106, 138, 13)}${eye(150, 138, 13)}${blush(92, 162)}${blush(164, 162)}${smile(128, 164, 22)}`)]; })();
/* rùa */
(() => { const id = "rua", c = "#6CCB6B", sh = mat(id, "#4FB07A", "s"), m = mat(id, c);
  S[id] = ["Rùa", svg(id, "Rùa", m.def + sh.def, `${shape("ellipse", 'cx="70" cy="160" rx="22" ry="16"', m)}${shape("ellipse", 'cx="164" cy="162" rx="24" ry="16"', m)}
    ${shape("path", 'd="M30 170L12 182L36 188Z"', m)}${shape("path", 'd="M44 150C44 82 212 82 212 150Z"', sh, 4)}<path d="M96 100L110 150M160 100L146 150M128 90V150M76 126H180" stroke="${dark("#4FB07A")}" stroke-width="4" fill="none" opacity=".7"/>${shape("circle", 'cx="206" cy="128" r="32"', m)}${shine("M66 124C82 100 112 94 136 98C110 102 90 114 80 138Z")}${eye(214, 122, 11)}${blush(206, 144, 8, 6)}${smile(220, 142, 12)}`)]; })();
/* sứa */
(() => { const id = "sua", c = "#C9A0FF", m = mat(id, c), arm = [70, 104, 138, 172].map((x, i) => `<path d="M${x} 150C${x - 12} 176 ${x + 12} 192 ${x} 222" fill="none" stroke="${dark(c, .15)}" stroke-width="9" stroke-linecap="round" opacity="${i % 2 ? 1 : .8}"/>`).join("");
  S[id] = ["Sứa", svg(id, "Sứa", m.def, `${arm}${shape("path", 'd="M36 150C36 70 70 38 122 38C174 38 208 70 208 150C190 140 176 156 160 150C142 142 130 158 114 150C98 142 84 156 68 150C56 146 46 154 36 150Z"', m, 4)}${shine("M62 100C70 74 94 58 118 58C94 66 80 84 76 112Z")}${eye(92, 112, 12)}${eye(152, 112, 12)}${blush(78, 134)}${blush(166, 134)}${smile(122, 130, 18)}`)]; })();
/* bạch tuộc */
(() => { const id = "bachtuoc", c = "#FF8FC2", m = mat(id, c), arms = [[58, 160, 30, 218], [92, 176, 82, 232], [128, 180, 128, 234], [164, 176, 174, 232], [198, 160, 226, 218], [128, 170, 150, 226]].map(([x, y, ex, ey]) => `<path d="M${x} ${y}C${x - 22} ${y + 26} ${ex + 18} ${ey - 24} ${ex} ${ey}" fill="none" stroke="${dark(c)}" stroke-width="22" stroke-linecap="round"/><path d="M${x} ${y}C${x - 22} ${y + 26} ${ex + 18} ${ey - 24} ${ex} ${ey}" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/>`).join("");
  S[id] = ["Bạch tuộc", svg(id, "Bạch tuộc", m.def, `${arms}${shape("path", 'd="M50 130C42 52 82 24 128 24C174 24 214 52 206 130C200 176 56 176 50 130Z"', m, 4)}
    ${shine("M78 84C86 58 108 44 130 44C108 52 96 68 92 98Z")}${eye(98, 116, 14)}${eye(158, 116, 14)}${blush(82, 142)}${blush(176, 142)}${smile(128, 142, 22)}`)]; })();
/* cá heo */
(() => { const id = "heo", c = "#5BB8F0", m = mat(id, c);
  S[id] = ["Cá heo", svg(id, "Cá heo", m.def, `${shape("path", 'd="M196 120C226 84 246 84 240 118C236 128 226 130 214 126C226 142 244 152 238 164C214 170 200 146 188 132Z"', m)}
    ${shape("path", 'd="M112 70C130 34 170 32 178 66Z"', m)}${shape("path", 'd="M30 126C26 112 40 108 54 112L72 118L62 142C46 142 34 138 30 126Z"', m)}
    ${shape("path", 'd="M58 112C70 62 150 56 196 100C214 118 196 168 150 176C100 182 54 160 58 112Z"', m)}<path d="M64 134C104 178 168 176 192 126C170 162 100 168 64 134Z" fill="#F4FAFF"/>${shape("path", 'd="M120 160C132 188 152 198 160 186C150 176 140 168 134 150Z"', m)}${shine("M84 98C98 76 132 70 158 78C130 80 106 90 94 112Z")}${eye(84, 112, 12)}${blush(82, 138, 9, 6)}${smile(58, 130, 12)}`)]; })();
/* cá mập con */
(() => { const id = "map", c = "#8FA9C4", m = mat(id, c);
  S[id] = ["Cá mập con", svg(id, "Cá mập con", m.def, `${shape("path", 'd="M180 128C210 84 236 84 236 84C226 110 232 150 242 176C214 170 196 150 180 128Z"', m)}
    ${shape("path", 'd="M106 80C126 34 160 34 170 80Z"', m)}${shape("path", 'd="M24 134C24 84 90 70 152 84C202 96 214 150 170 176C120 196 24 186 24 134Z"', m)}<path d="M28 150C60 188 150 192 190 160C150 184 70 176 28 150Z" fill="#F4F7FB"/>${shape("path", 'd="M110 172C124 202 148 206 156 192C144 184 138 176 136 164Z"', m)}${shine("M54 104C70 86 104 80 130 86C102 88 78 98 66 118Z")}${eye(66, 126, 12)}${blush(60, 150, 9, 6)}<path d="M36 152Q50 164 74 160" fill="none" stroke="${L.INK}" stroke-width="4" stroke-linecap="round"/><path d="M48 158L52 150L58 160M62 162L66 153L72 162" fill="#fff" stroke="none"/>`)]; })();
/* cá voi */
(() => { const id = "ca_voi", c = "#6F9BF0", m = mat(id, c);
  S[id] = ["Cá voi", svg(id, "Cá voi", m.def, `<path d="M104 64C96 44 78 36 70 24M104 64C112 44 132 40 142 28" stroke="#9BD8FF" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="68" cy="22" r="6" fill="#9BD8FF"/><circle cx="144" cy="26" r="6" fill="#9BD8FF"/>${shape("path", 'd="M206 150C232 140 246 108 232 82C224 100 212 108 196 110C214 116 214 132 206 150Z"', m)}${shape("path", 'd="M26 148C26 94 70 62 126 62C186 62 220 108 206 156C196 190 150 204 106 202C58 200 26 184 26 148Z"', m, 4)}<path d="M40 160C70 198 170 206 206 160C170 186 80 186 40 160Z" fill="#E9F2FF"/><path d="M64 178L120 184M82 190L132 194" stroke="${dark("#E9F2FF", .1)}" stroke-width="3" stroke-linecap="round"/>${shape("path", 'd="M104 160C112 188 140 192 146 180C134 176 128 168 126 154Z"', m)}${shine("M54 112C66 92 96 80 126 82C96 88 74 100 64 124Z")}${eye(70, 128, 13)}${blush(64, 152, 10, 7)}${smile(86, 154, 18)}`)]; })();
fs.mkdirSync(OUT, { recursive: true });
Object.keys(S).forEach(id => { fs.writeFileSync(path.join(OUT, "sv-" + id + ".svg"), S[id][1]); });
console.log("✓ " + Object.keys(S).length + " linh vật ao → " + OUT);
