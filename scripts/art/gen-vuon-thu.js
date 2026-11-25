/* Sinh tranh VƯỜN THÚ (Học Vui, Tiếng Việt): learn/vuon-thu/art/vuon-doc.svg, vuon-ngang.svg (nền cảnh vườn nhìn chéo, hai bố cục),
   chuong-N-sau.svg / chuong-N-truoc.svg (bãi + hàng rào từng lớp: lớp sau nằm sau thú, lớp trước che chân thú), khoa.svg.
   Chạy: node scripts/art/gen-vuon-thu.js   (không đụng gen-nha-thu-lop.js / gen-nang-cap.js). Phong cách Pop 3D mềm: gradient, bóng đổ, viền sáng. */
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "../../learn/vuon-thu/art");
fs.mkdirSync(OUT, { recursive: true });
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const w = (n, s) => fs.writeFileSync(path.join(OUT, n), s);
const svg = (vb, body, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${label}"><title>${label}</title>${body}</svg>\n`;
const lg = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

/* ---------- vật trang trí ---------- */
const tree = (x, y, s, c1, c2) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="6" cy="6" rx="52" ry="16" fill="#000" opacity=".16"/>
<rect x="-9" y="-40" width="18" height="46" rx="6" fill="#9A6A3A"/><rect x="-9" y="-40" width="7" height="46" rx="3" fill="#B98350"/>
<circle cx="-26" cy="-58" r="34" fill="${c2}"/><circle cx="26" cy="-58" r="34" fill="${c2}"/><circle cx="0" cy="-92" r="40" fill="${c2}"/>
<circle cx="-22" cy="-62" r="30" fill="${c1}"/><circle cx="24" cy="-64" r="30" fill="${c1}"/><circle cx="0" cy="-96" r="36" fill="${c1}"/>
<ellipse cx="-12" cy="-108" rx="16" ry="9" fill="#fff" opacity=".3"/><circle cx="-24" cy="-52" r="4" fill="#FF6B6B"/><circle cx="20" cy="-76" r="4" fill="#FF6B6B"/></g>`;
const bush = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="30" ry="8" fill="#000" opacity=".14"/>
<circle cx="-15" cy="-8" r="16" fill="#3FA04A"/><circle cx="14" cy="-8" r="17" fill="#3FA04A"/><circle cx="0" cy="-16" r="18" fill="#52B85A"/><ellipse cx="-4" cy="-22" rx="8" ry="4" fill="#fff" opacity=".3"/></g>`;
const flower = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M0 0v10" stroke="#3E8A32" stroke-width="2.5"/>${[0, 72, 144, 216, 288].map(a => `<circle cx="${(Math.cos(a * Math.PI / 180) * 5).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 5).toFixed(1)}" r="4" fill="${c}"/>`).join("")}<circle r="3" fill="#FFE066"/></g>`;
const tuft = (x, y) => `<path d="M${x} ${y}q-3-12-6-14M${x} ${y}q0-14 1-18M${x} ${y}q3-12 7-13" stroke="#4E9F3B" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
const rock = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="3" rx="16" ry="5" fill="#000" opacity=".15"/><path d="M-15 2c-2-12 6-18 15-17s16 6 15 17z" fill="#B7B2A6"/><path d="M-9-8c4-4 11-4 15 0" stroke="#fff" stroke-width="3" opacity=".5" fill="none" stroke-linecap="round"/></g>`;
const pond = (x, y, rx, ry) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="8" rx="${rx + 14}" ry="${ry + 12}" fill="#000" opacity=".14"/>
<ellipse cx="0" cy="0" rx="${rx + 12}" ry="${ry + 10}" fill="#E8D29A"/><ellipse cx="0" cy="2" rx="${rx + 4}" ry="${ry + 3}" fill="#CDB27A"/>
<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="url(#water)"/><ellipse cx="${-rx * .3}" cy="${-ry * .35}" rx="${rx * .45}" ry="${ry * .16}" fill="#fff" opacity=".45"/>
<ellipse cx="${rx * .35}" cy="${ry * .25}" rx="${rx * .2}" ry="${ry * .07}" fill="#fff" opacity=".3"/>
<ellipse cx="${rx * .4}" cy="${-ry * .1}" rx="17" ry="7" fill="#58B94F"/><path d="M${rx * .4} ${-ry * .1}l16-4" stroke="#58B94F" stroke-width="3"/><circle cx="${rx * .4}" cy="${-ry * .12}" r="4.500" fill="#FFB4D2"/>
<ellipse cx="${-rx * .45}" cy="${ry * .3}" rx="13" ry="5.500" fill="#58B94F"/>
<path d="M${rx + 4} ${ry * .2}v-24M${rx + 10} ${ry * .3}v-18" stroke="#6BAA3C" stroke-width="3" stroke-linecap="round"/><ellipse cx="${rx + 4}" cy="${ry * .2 - 28}" rx="3.500" ry="8" fill="#8B5A2B"/></g>`;
const sign = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="3" rx="20" ry="5" fill="#000" opacity=".15"/><rect x="-4" y="-34" width="8" height="38" rx="3" fill="#9A6A3A"/>
<rect x="-30" y="-58" width="60" height="30" rx="8" fill="#E9B26B" stroke="#B87A3C" stroke-width="3"/><path d="M-14-43h28M-14-36h18" stroke="#8B5A2B" stroke-width="3.500" stroke-linecap="round"/></g>`;
const lamp = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="3" rx="14" ry="4" fill="#000" opacity=".15"/><rect x="-3" y="-50" width="6" height="52" rx="3" fill="#5A4A6A"/><circle cx="0" cy="-58" r="13" fill="#FFE9A0" stroke="#E7B84A" stroke-width="3"/><circle cx="-4" cy="-62" r="4" fill="#fff" opacity=".7"/></g>`;
const bench = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="6" rx="34" ry="7" fill="#000" opacity=".15"/><rect x="-30" y="-18" width="60" height="9" rx="4" fill="#E9B26B"/><rect x="-30" y="-4" width="60" height="9" rx="4" fill="#D9984F"/><rect x="-26" y="2" width="6" height="10" rx="2" fill="#9A6A3A"/><rect x="20" y="2" width="6" height="10" rx="2" fill="#9A6A3A"/></g>`;

function scene(W, H, pathD, props) {
  let s = `<defs>${lg("g1", "#A7E36E", "#6FC84C")}${lg("water", "#8FE0FF", "#3FA9E8")}<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1B5E20" stop-opacity=".28"/></radialGradient></defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#g1)"/>`;
  for (let i = -2; i < 14; i++) s += `<rect x="${i * W / 10}" y="-20" width="${W / 20}" height="${H + 40}" fill="#fff" opacity=".055" transform="skewX(-14)"/>`;
  s += `<path d="${pathD}" fill="none" stroke="#C9A25E" stroke-width="64" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 7)" opacity=".6"/>`;
  s += `<path d="${pathD}" fill="none" stroke="#EFD9A0" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<path d="${pathD}" fill="none" stroke="#FBEBC2" stroke-width="38" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`;
  for (let i = 0; i < 90; i++) s += tuft(Math.round(rnd() * W), Math.round(rnd() * H));
  const fc = ["#FF8FB1", "#FFD23F", "#fff", "#B79CFF", "#FF9F5A"];
  for (let i = 0; i < 46; i++) s += flower(Math.round(rnd() * W), Math.round(rnd() * H), fc[i % 5]);
  return s + props.join("") + `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
}
const T1 = ["#6FCB57", "#3E9B47"], T2 = ["#8CD65E", "#52AE45"];
/* dọc 600x1200: chuồng so le (xem js/data.js) */
w("vuon-doc.svg", svg("0 0 600 1200", scene(600, 1200,
  "M300 1200C300 1150 300 1130 250 1100C120 1070 120 1000 150 950C250 900 440 880 450 840C450 700 150 700 150 650C150 560 440 560 450 470C450 400 150 400 150 300C150 200 300 170 300 120",
  [pond(470, 1110, 76, 40), tree(60, 150, 1, T1[0], T1[1]), tree(540, 140, 1.1, T2[0], T2[1]), tree(300, 40, .8, T1[0], T1[1]), tree(556, 1010, .9, T2[0], T2[1]),
   tree(36, 1160, .9, T1[0], T1[1]), tree(560, 680, .8, T1[0], T1[1]), tree(40, 520, .8, T2[0], T2[1]), bush(300, 590, 1), bush(300, 380, .9), bush(300, 760, 1), bush(90, 800, .9), bush(560, 330, .9),
   sign(330, 1170), lamp(250, 215), bench(300, 925), rock(380, 640, 1), rock(80, 440, .8), rock(500, 960, .9)]), "Khu vườn thú"));
/* ngang 1200x640 */
w("vuon-ngang.svg", svg("0 60 1200 520", scene(1200, 640,
  "M600 640C600 600 560 590 480 575C300 540 120 540 120 440C130 360 370 420 360 330C360 250 600 360 600 330C610 270 850 330 840 330C850 400 1080 330 1080 430C1090 520 700 520 600 600",
  [pond(1070, 545, 80, 38), tree(40, 520, 1, T1[0], T1[1]), tree(1160, 150, 1.1, T2[0], T2[1]), tree(560, 140, .9, T1[0], T1[1]), tree(20, 150, .9, T2[0], T2[1]),
   tree(1170, 620, .8, T1[0], T1[1]), tree(250, 40, .7, T2[0], T2[1]), tree(940, 40, .8, T1[0], T1[1]), bush(240, 610, 1), bush(720, 610, .9), bush(480, 460, .9), bush(960, 200, .9), bush(120, 330, .8),
   sign(560, 620), lamp(1180, 450), bench(600, 460), rock(840, 520, 1), rock(300, 220, .8), rock(1130, 330, .9)]), "Khu vườn thú"));

/* ---------- chuồng: bãi + hàng rào theo lớp (viewBox 300x300; nhà ở nửa trên, bãi ở nửa dưới) ---------- */
const PEN = [["#FFC6D8", "#FF8FB1", "#F4A0BC", "#fff"], ["#FFD9A0", "#FFB04D", "#F29B3C", "#fff"], ["#E8CFA0", "#C99A5E", "#B07F44", "#fff"],
  ["#BDE9B0", "#7FCB6B", "#5FB152", "#fff"], ["#D5C6FF", "#A98BF2", "#8D6FDB", "#fff"]];
const CX = 150, CY = 215, RX = 138, RY = 68;
const pt = (a, k) => [CX + Math.cos(a * Math.PI / 180) * RX * k, CY + Math.sin(a * Math.PI / 180) * RY * k];
function posts(from, to, n, c2, rail) {
  let s = "", groups = [[]];
  for (let i = 0; i < n; i++) { const a = from + (to - from) * i / (n - 1); if (a > 76 && a < 104 && from > 0) { groups.push([]); continue; } groups[groups.length - 1].push(pt(a, 1)); }
  groups.forEach(g => { if (g.length < 2) return; const d = g.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join("");
    [-18, -7].forEach(dy => { s += `<path d="${d}" transform="translate(0 ${dy})" fill="none" stroke="${rail}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`; }); });
  groups.forEach(g => g.forEach(p => { s += `<rect x="${(p[0] - 5).toFixed(1)}" y="${(p[1] - 30).toFixed(1)}" width="10" height="34" rx="5" fill="${c2}"/><rect x="${(p[0] - 5).toFixed(1)}" y="${(p[1] - 30).toFixed(1)}" width="4" height="34" rx="2" fill="#fff" opacity=".35"/><circle cx="${p[0].toFixed(1)}" cy="${(p[1] - 30).toFixed(1)}" r="5.500" fill="${c2}"/>`; }));
  return s;
}
PEN.forEach((c, i) => {
  const n = i + 1, id = "p" + n;
  const defs = `<defs><radialGradient id="${id}" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></radialGradient></defs>`;
  let sau = defs + `<ellipse cx="${CX}" cy="${CY + 14}" rx="${RX + 6}" ry="${RY + 6}" fill="#000" opacity=".2"/><ellipse cx="${CX}" cy="${CY + 6}" rx="${RX + 2}" ry="${RY + 2}" fill="${c[2]}"/>`
    + `<ellipse cx="${CX}" cy="${CY}" rx="${RX - 4}" ry="${RY - 3}" fill="url(#${id})"/><ellipse cx="${CX - 36}" cy="${CY - 26}" rx="52" ry="12" fill="#fff" opacity=".35"/>`;
  for (let k = 0; k < 14; k++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * .85; sau += tuft(Math.round(CX + Math.cos(a) * RX * r), Math.round(CY + Math.sin(a) * RY * r)); }
  sau += posts(188, 352, 11, c[2], "#fff");
  w(`chuong-${n}-sau.svg`, svg("0 0 300 300", sau, "Bãi thú lớp " + n));
  w(`chuong-${n}-truoc.svg`, svg("0 0 300 300", posts(8, 172, 12, c[2], "#fff").replace(/stroke="#fff"/g, `stroke="${c[3]}"`), "Hàng rào lớp " + n));
});
/* ổ khoá + dải mờ cho chuồng khoá */
w("khoa.svg", svg("0 0 64 64", `<ellipse cx="32" cy="58" rx="20" ry="4" fill="#000" opacity=".2"/><path d="M19 30V22a13 13 0 0 1 26 0v8" fill="none" stroke="#8A8FA8" stroke-width="7" stroke-linecap="round"/>
<rect x="10" y="28" width="44" height="30" rx="9" fill="#FFC93C" stroke="#E09A12" stroke-width="3"/><rect x="14" y="31" width="36" height="8" rx="4" fill="#fff" opacity=".4"/><circle cx="32" cy="43" r="5" fill="#8A5A12"/><rect x="30" y="44" width="4" height="9" rx="2" fill="#8A5A12"/>`, "Khoá"));
console.log("OK -> " + OUT);
