/* Sinh tranh SVG cho VƯỜN HỌC VUI (xem plan-learn-garden.md mục 2 và 2b): 3 loại cây (mỗi môn một loại, 5 giai đoạn, 3 kiểu hoa, 3 tông lá, 2 sắc hoa)
   + 2 sinh vật ghé thăm (ong, bướm) + trang xem duyệt.  Chạy: node scripts/learn/gen-garden-art.js
   Phong cách POP "đồ chơi mềm" (docs/MASCOT-ART-RULES.md): khối tròn, không viền đen (viền = màu đậm hơn), gradient 2 điểm dừng + vệt sáng,
   màu qua biến CSS, hoạt ảnh CHỈ transform/opacity đặt tên npa-*, tắt khi prefers-reduced-motion / html.np-playing, không filter/ảnh/script.
   KHÔNG sửa tay các tệp sinh ra trong shared/art/garden/. */
"use strict";
const fs = require("fs"), path = require("path");
const out = path.join(__dirname, "../../shared/art/garden");
fs.mkdirSync(out, { recursive: true });

/* mỗi môn: tên, màu hoa (p1 sáng, p2 đậm), tâm hoa (c3) và dấu hiệu riêng ở giữa hoa */
const PLANTS = {
  math: { vi: "Cây Số", en: "Number plant", p1: "#5C8DF5", p2: "#2F62D6", pd: "#1E3FA3", c3: "#FFC94A", c3d: "#E3A413", mark: "plus", tn: { a: ["#8DB2FF", "#4F7BE8", "#2B4FB8"], b: ["#4C7DE8", "#2756C9", "#183A94"] } },
  vietnamese: { vi: "Cây Chữ", en: "Letter plant", p1: "#F58A6A", p2: "#D2502F", pd: "#A83A22", c3: "#FFE9C7", c3d: "#E8B97C", mark: "book", tn: { a: ["#FFB097", "#EE7352", "#BE4428"], b: ["#EC7A58", "#C6452A", "#962F1B"] } },
  english: { vi: "Cây Từ", en: "Word plant", p1: "#3DD9C1", p2: "#12998A", pd: "#0B6F65", c3: "#FFD24D", c3d: "#E6A91A", mark: "hi", tn: { a: ["#7FEBD9", "#2FC4AD", "#12877A"], b: ["#2FC9B1", "#0E8C7E", "#08665C"] } }
};
const LEAF = { a: ["#6FDB8A", "#34B461", "#1F7F43"], b: ["#5FD6B0", "#2BAE8A", "#177A60"], c: ["#B7D95C", "#7FB53A", "#527F1F"] };

const f = n => Math.round(n * 10) / 10;
const leaf = (x, y, rot, s, flip) => `<g transform="translate(${x} ${y}) ${flip ? "scale(-1 1) " : ""}rotate(${rot}) scale(${s})"><path d="M0 0C12-22 44-20 52 4C32 18 8 14 0 0Z" fill="url(#lg)" stroke="var(--l3)" stroke-width="${f(3 / s)}" stroke-linejoin="round"/><path d="M4 0C18-4 32-4 44 2" fill="none" stroke="var(--l1)" stroke-width="${f(2.2 / s)}" stroke-linecap="round" opacity=".7"/></g>`;
const pair = (x, y, rot, s) => leaf(x, y, rot, s, false) + leaf(x, y, rot, s, true);
const stem = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1}C${x1 - 6} ${f((y1 + y2) / 2)} ${x2 + 6} ${f((y1 + y2) / 2)} ${x2} ${y2}" fill="none" stroke="var(--l3)" stroke-width="${w + 3}" stroke-linecap="round"/><path d="M${x1} ${y1}C${x1 - 6} ${f((y1 + y2) / 2)} ${x2 + 6} ${f((y1 + y2) / 2)} ${x2} ${y2}" fill="none" stroke="var(--l2)" stroke-width="${w}" stroke-linecap="round"/><path d="M${x1 + 1.5} ${y1 - 4}C${x1 - 4} ${f((y1 + y2) / 2)} ${x2 + 7} ${f((y1 + y2) / 2)} ${x2 + 1.5} ${y2 + 4}" fill="none" stroke="var(--l1)" stroke-width="${f(w / 3)}" stroke-linecap="round" opacity=".7"/>`;

/* hoa ba kiểu */
function petals(variant, cx, cy, r) {
  let s = "";
  const st = 'fill="url(#pg)" stroke="var(--pd)" stroke-width="3" stroke-linejoin="round"';
  if (variant === "a") for (let i = 0; i < 6; i++) s += `<ellipse cx="${cx}" cy="${cy - r * .72}" rx="${f(r * .42)}" ry="${f(r * .66)}" ${st} transform="rotate(${i * 60} ${cx} ${cy})"/>`;
  else if (variant === "b") for (let i = 0; i < 8; i++) s += `<path d="M${cx} ${cy}C${cx - r * .34} ${cy - r * .5} ${cx - r * .2} ${cy - r * .9} ${cx} ${cy - r * 1.05}C${cx + r * .2} ${cy - r * .9} ${cx + r * .34} ${cy - r * .5} ${cx} ${cy}Z" ${st} transform="rotate(${i * 45} ${cx} ${cy})"/>`;
  else { for (let i = 0; i < 5; i++) s += `<ellipse cx="${cx}" cy="${cy - r * .8}" rx="${f(r * .36)}" ry="${f(r * .5)}" ${st} transform="rotate(${i * 72 + 36} ${cx} ${cy})"/>`; for (let i = 0; i < 5; i++) s += `<ellipse cx="${cx}" cy="${cy - r * .66}" rx="${f(r * .44)}" ry="${f(r * .62)}" ${st} transform="rotate(${i * 72} ${cx} ${cy})"/>`; }
  return s;
}
function mark(kind, cx, cy) {
  if (kind === "plus") return `<path d="M${cx - 9} ${cy}H${cx + 9}M${cx} ${cy - 9}V${cy + 9}" stroke="var(--c3d)" stroke-width="6" stroke-linecap="round"/>`;
  if (kind === "book") return `<path d="M${cx - 11} ${cy - 7}Q${cx - 5} ${cy - 10} ${cx} ${cy - 6}Q${cx + 5} ${cy - 10} ${cx + 11} ${cy - 7}V${cy + 8}Q${cx + 5} ${cy + 5} ${cx} ${cy + 9}Q${cx - 5} ${cy + 5} ${cx - 11} ${cy + 8}Z" fill="#fff" stroke="var(--c3d)" stroke-width="2.6" stroke-linejoin="round"/><path d="M${cx} ${cy - 6}V${cy + 9}" stroke="var(--c3d)" stroke-width="2.4"/>`;
  return `<path d="M${cx - 12} ${cy - 8}H${cx + 12}Q${cx + 14} ${cy - 8} ${cx + 14} ${cy - 6}V${cy + 4}Q${cx + 14} ${cy + 6} ${cx + 12} ${cy + 6}H${cx - 2}L${cx - 8} ${cy + 12}V${cy + 6}H${cx - 12}Q${cx - 14} ${cy + 6} ${cx - 14} ${cy + 4}V${cy - 6}Q${cx - 14} ${cy - 8} ${cx - 12} ${cy - 8}Z" fill="#fff" stroke="var(--c3d)" stroke-width="2.4" stroke-linejoin="round"/><circle cx="${cx - 5}" cy="${cy - 1}" r="1.8" fill="var(--c3d)"/><circle cx="${cx}" cy="${cy - 1}" r="1.8" fill="var(--c3d)"/><circle cx="${cx + 5}" cy="${cy - 1}" r="1.8" fill="var(--c3d)"/>`;
}

function plantSvg(id, P) {
  const cx = 128, ground = 226;
  const sparkle = (x, y, d) => `<path d="M${x} ${y - 9}L${x + 3} ${y - 3}L${x + 9} ${y}L${x + 3} ${y + 3}L${x} ${y + 9}L${x - 3} ${y + 3}L${x - 9} ${y}L${x - 3} ${y - 3}Z" fill="#fff" class="npa-twinkle" style="animation-delay:${d}s"/>`;
  const bud = (y, s) => `<g transform="translate(${cx} ${y}) scale(${s})"><ellipse cx="-10" cy="0" rx="15" ry="26" fill="url(#pg)" stroke="var(--pd)" stroke-width="3" transform="rotate(-14 0 14)"/><ellipse cx="10" cy="0" rx="15" ry="26" fill="url(#pg)" stroke="var(--pd)" stroke-width="3" transform="rotate(14 0 14)"/><ellipse cx="0" cy="-2" rx="16" ry="28" fill="url(#pg)" stroke="var(--pd)" stroke-width="3"/><ellipse cx="-5" cy="-12" rx="4.5" ry="9" fill="#fff" opacity=".55"/></g>`;
  const st0 = `<g class="st st0"><ellipse cx="${cx}" cy="204" rx="19" ry="24" fill="url(#sd)" stroke="#6B3F1F" stroke-width="3" transform="rotate(-8 ${cx} 204)"/><ellipse cx="${cx - 6}" cy="196" rx="5" ry="9" fill="#fff" opacity=".5" transform="rotate(-8 ${cx} 204)"/><path d="M${cx + 2} 190C${cx + 8} 200 ${cx + 6} 212 ${cx + 1} 220" fill="none" stroke="#6B3F1F" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>${sparkle(cx + 34, 176, 0)}${sparkle(cx - 38, 190, .7)}</g>`;
  const st1 = `<g class="st st1 npa npa-sway">${stem(cx, ground - 4, cx, 178, 9)}${pair(cx, 182, -28, .7)}</g>`;
  const st2 = `<g class="st st2 npa npa-sway">${stem(cx, ground - 4, cx, 132, 10)}${pair(cx, 200, -22, .78)}${pair(cx, 168, -34, .72)}${pair(cx, 146, -48, .6)}${bud(122, .5)}</g>`;
  const st3 = `<g class="st st3 npa npa-sway">${stem(cx, ground - 4, cx, 104, 11)}${pair(cx, 206, -18, .95)}${pair(cx, 176, -30, .88)}${pair(cx, 148, -42, .76)}${bud(80, .86)}${sparkle(cx + 44, 64, 0)}</g>`;
  const st4 = `<g class="st st4 npa npa-sway">${stem(cx, ground - 4, cx, 112, 11)}${pair(cx, 206, -18, .95)}${pair(cx, 178, -30, .88)}${pair(cx, 152, -40, .78)}<g class="npa npa-bob" id="flower">${["a", "b", "c"].map(v => `<g class="fl fl-${v}">${petals(v, cx, 84, 40)}</g>`).join("")}<circle cx="${cx}" cy="84" r="17" fill="url(#cg)" stroke="var(--c3d)" stroke-width="3"/>${mark(P.mark, cx, 84)}<ellipse cx="${cx - 7}" cy="76" rx="4" ry="2.6" fill="#fff" opacity=".6"/></g>${sparkle(cx + 52, 50, 0)}${sparkle(cx - 54, 70, .6)}${sparkle(cx + 40, 120, 1.1)}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${P.vi} (${P.en})" class="np-plant s4 fl-a lt-a" data-style="pop" data-game="garden-${id}">
<title>${P.vi}</title>
<desc>Cây của môn ${P.vi.replace("Cây ", "")}: 5 giai đoạn (lớp s0 hạt, s1 mầm, s2 cây con, s3 nụ, s4 nở hoa). Biến thể mỗi bé một khác: kiểu hoa (fl-a tròn, fl-b nhọn, fl-c hai tầng), tông lá (lt-a xanh tươi, lt-b ngọc, lt-c lá chuối), sắc hoa (tn-a sáng, tn-b đậm). Dấu hiệu riêng ở tâm hoa theo môn.</desc>
<style>
.np-plant{--p1:${P.p1};--p2:${P.p2};--pd:${P.pd};--c3:${P.c3};--c3d:${P.c3d};--l1:${LEAF.a[0]};--l2:${LEAF.a[1]};--l3:${LEAF.a[2]};--soil1:#B07A4A;--soil2:#7B4E2B;--seed1:#E8B07A;--seed2:#B9783F}
.np-plant.lt-b{--l1:${LEAF.b[0]};--l2:${LEAF.b[1]};--l3:${LEAF.b[2]}}.np-plant.lt-c{--l1:${LEAF.c[0]};--l2:${LEAF.c[1]};--l3:${LEAF.c[2]}}
.np-plant.tn-a{--p1:${P.tn.a[0]};--p2:${P.tn.a[1]};--pd:${P.tn.a[2]}}.np-plant.tn-b{--p1:${P.tn.b[0]};--p2:${P.tn.b[1]};--pd:${P.tn.b[2]}}
.st,.fl{display:none}.s0 .st0,.s1 .st1,.s2 .st2,.s3 .st3,.s4 .st4{display:inline}.fl-a .fl-a,.fl-b .fl-b,.fl-c .fl-c{display:inline}
.npa{transform-box:fill-box;transform-origin:50% 100%}.npa-sway{animation:npa-sway 4.6s ease-in-out infinite}.npa-bob{transform-origin:50% 50%;animation:npa-bob 3s ease-in-out infinite}.npa-twinkle{animation:npa-twinkle 2s ease-in-out infinite}
@keyframes npa-sway{0%,100%{transform:rotate(-1.6deg)}50%{transform:rotate(1.6deg)}}@keyframes npa-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}@keyframes npa-twinkle{0%,100%{opacity:.2}50%{opacity:1}}
:root.np-playing .npa,:root.np-playing .npa-twinkle{animation:none}@media (prefers-reduced-motion:reduce){.npa,.npa-twinkle{animation:none!important}}
</style>
<defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--l1)"/><stop offset="1" style="stop-color:var(--l2)"/></linearGradient>
<linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--p1)"/><stop offset="1" style="stop-color:var(--p2)"/></linearGradient>
<radialGradient id="cg" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".45" style="stop-color:var(--c3)"/><stop offset="1" style="stop-color:var(--c3d)"/></radialGradient>
<linearGradient id="sd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--seed1)"/><stop offset="1" style="stop-color:var(--seed2)"/></linearGradient>
<linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--soil1)"/><stop offset="1" style="stop-color:var(--soil2)"/></linearGradient></defs>
<g id="all">
<ellipse id="shadow" cx="${cx}" cy="236" rx="74" ry="9" fill="#000" opacity=".16"/>
<path id="soil" d="M52 232C54 206 88 192 ${cx} 192C168 192 202 206 204 232C190 240 66 240 52 232Z" fill="url(#sg)" stroke="#5A3719" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="${cx - 26}" cy="206" rx="12" ry="4" fill="#fff" opacity=".18"/><circle cx="${cx + 38}" cy="214" r="3" fill="#5A3719" opacity=".45"/><circle cx="${cx - 44}" cy="219" r="2.4" fill="#5A3719" opacity=".45"/>
${st0}${st1}${st2}${st3}${st4}
</g></svg>
`;
}

function beeSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="Ong đếm số (Counting bee)" class="np-visitor" data-style="pop" data-game="garden-bee">
<title>Ong đếm số</title><desc>Sinh vật ghé thăm vườn khi bé học Toán. Mắt tròn to hai chấm sáng, má hồng, cánh trong mờ vẫy nhẹ.</desc>
<style>.np-visitor{--y1:#FFD24D;--y2:#F5A623;--yd:#C9840F;--ink:#3A2A12;--bl:#FF9DB0}.npa{transform-box:fill-box;transform-origin:50% 50%}.npa-flap{animation:npa-flap .22s ease-in-out infinite alternate}.npa-hover{animation:npa-hover 2.6s ease-in-out infinite}
@keyframes npa-flap{from{transform:scaleY(1) rotate(0)}to{transform:scaleY(.55) rotate(-8deg)}}@keyframes npa-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
:root.np-playing .npa{animation:none}@media (prefers-reduced-motion:reduce){.npa{animation:none!important}}</style>
<defs><linearGradient id="by" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--y1)"/><stop offset="1" style="stop-color:var(--y2)"/></linearGradient></defs>
<g id="all" class="npa npa-hover"><ellipse id="shadow" cx="128" cy="238" rx="46" ry="7" fill="#000" opacity=".14"/>
<g class="npa npa-flap"><ellipse cx="96" cy="86" rx="30" ry="44" fill="#fff" opacity=".78" stroke="#BFD9F2" stroke-width="3" transform="rotate(-24 96 86)"/></g><g class="npa npa-flap"><ellipse cx="160" cy="86" rx="30" ry="44" fill="#fff" opacity=".78" stroke="#BFD9F2" stroke-width="3" transform="rotate(24 160 86)"/></g>
<ellipse id="body" cx="128" cy="144" rx="68" ry="62" fill="url(#by)" stroke="var(--yd)" stroke-width="3"/>
<path d="M86 94C104 88 152 88 170 94L172 106C152 100 104 100 84 106Z" fill="var(--ink)" opacity=".85"/><path d="M78 176C104 184 152 184 178 176L170 194C150 202 106 202 86 194Z" fill="var(--ink)" opacity=".85"/>
<ellipse cx="104" cy="104" rx="26" ry="14" fill="#fff" opacity=".5" transform="rotate(-12 104 104)"/>
<g id="face"><circle id="eyes" cx="100" cy="132" r="13" fill="var(--ink)"/><circle cx="156" cy="132" r="13" fill="var(--ink)"/><circle cx="104" cy="127" r="5" fill="#fff"/><circle cx="160" cy="127" r="5" fill="#fff"/><circle cx="97" cy="136" r="2.4" fill="#fff"/><circle cx="153" cy="136" r="2.4" fill="#fff"/><circle cx="82" cy="150" r="9" fill="var(--bl)" opacity=".8"/><circle cx="174" cy="150" r="9" fill="var(--bl)" opacity=".8"/><path d="M118 152Q128 164 138 152" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/></g>
<path d="M110 84Q104 64 90 58M146 84Q152 64 166 58" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><circle cx="90" cy="58" r="6" fill="var(--c3,#FFC94A)"/><circle cx="166" cy="58" r="6" fill="var(--c3,#FFC94A)"/></g></svg>
`;
}
function butterflySvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="Bướm chữ (Letter butterfly)" class="np-visitor" data-style="pop" data-game="garden-butterfly">
<title>Bướm chữ</title><desc>Sinh vật ghé thăm vườn khi bé đọc chữ. Mắt tròn to hai chấm sáng, má hồng, cánh có hoa văn vẫy nhẹ.</desc>
<style>.np-visitor{--w1:#FF9FB8;--w2:#E84F83;--wd:#B5305F;--w3:#FFD24D;--ink:#3A1E36;--bl:#FF9DB0}.npa{transform-box:fill-box;transform-origin:100% 50%}.npa-flapr{transform-origin:0% 50%}.npa-flap{animation:npa-flap .5s ease-in-out infinite alternate}.npa-hover{transform-origin:50% 50%;animation:npa-hover 3.2s ease-in-out infinite}
@keyframes npa-flap{from{transform:scaleX(1)}to{transform:scaleX(.45)}}@keyframes npa-hover{0%,100%{transform:translate(0,0) rotate(-3deg)}50%{transform:translate(4px,-10px) rotate(3deg)}}
:root.np-playing .npa{animation:none}@media (prefers-reduced-motion:reduce){.npa{animation:none!important}}</style>
<defs><linearGradient id="bw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--w1)"/><stop offset="1" style="stop-color:var(--w2)"/></linearGradient></defs>
<g id="all" class="npa npa-hover"><ellipse id="shadow" cx="128" cy="240" rx="40" ry="6" fill="#000" opacity=".12"/>
<g class="npa npa-flap"><path d="M124 130C96 70 30 54 24 100C22 130 70 150 124 142Z" fill="url(#bw)" stroke="var(--wd)" stroke-width="3" stroke-linejoin="round"/><path d="M124 148C90 150 44 172 58 208C76 226 112 190 124 158Z" fill="url(#bw)" stroke="var(--wd)" stroke-width="3" stroke-linejoin="round"/><circle cx="64" cy="102" r="14" fill="#fff" opacity=".8"/><circle cx="64" cy="102" r="7" fill="var(--w3)"/><circle cx="76" cy="190" r="8" fill="var(--w3)" opacity=".9"/></g>
<g class="npa npa-flap npa-flapr" style="transform-origin:0% 50%"><path d="M132 130C160 70 226 54 232 100C234 130 186 150 132 142Z" fill="url(#bw)" stroke="var(--wd)" stroke-width="3" stroke-linejoin="round"/><path d="M132 148C166 150 212 172 198 208C180 226 144 190 132 158Z" fill="url(#bw)" stroke="var(--wd)" stroke-width="3" stroke-linejoin="round"/><circle cx="192" cy="102" r="14" fill="#fff" opacity=".8"/><circle cx="192" cy="102" r="7" fill="var(--w3)"/><circle cx="180" cy="190" r="8" fill="var(--w3)" opacity=".9"/></g>
<ellipse id="body" cx="128" cy="150" rx="13" ry="42" fill="var(--ink)"/><g id="face"><circle id="eyes" cx="128" cy="116" r="17" fill="#fff" stroke="var(--ink)" stroke-width="3"/><circle cx="123" cy="116" r="7" fill="var(--ink)"/><circle cx="133" cy="116" r="7" fill="var(--ink)"/><circle cx="125" cy="113" r="2.4" fill="#fff"/><circle cx="135" cy="113" r="2.4" fill="#fff"/><path d="M122 126Q128 132 134 126" fill="none" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><circle cx="112" cy="124" r="5" fill="var(--bl)" opacity=".8"/><circle cx="144" cy="124" r="5" fill="var(--bl)" opacity=".8"/></g>
<path d="M120 100Q108 70 92 62M136 100Q148 70 164 62" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><circle cx="92" cy="62" r="6" fill="var(--w3)"/><circle cx="164" cy="62" r="6" fill="var(--w3)"/></g></svg>
`;
}

const files = {};
for (const id of Object.keys(PLANTS)) files[`plant_${id}.svg`] = plantSvg(id, PLANTS[id]);
files["visitor_bee.svg"] = beeSvg(); files["visitor_butterfly.svg"] = butterflySvg();
for (const [n, c] of Object.entries(files)) fs.writeFileSync(path.join(out, n), c);

/* ---- trang xem duyệt ---- */
const stages = ["Hạt", "Mầm", "Cây con", "Nụ", "Nở hoa"];
const gene = (id, cls) => `<object type="image/svg+xml" data="plant_${id}.svg" class="pl ${cls}" aria-label="${id}"></object>`;
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vườn Học Vui: bản duyệt cây và sinh vật</title>
<style>
:root{--ink:#1d1a33;--bg:#F6F4F1;--panel:#fff;--line:#E3DDEF}*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:1120px;margin:0 auto;padding:24px 16px 60px}h1{font-size:clamp(26px,5vw,40px);margin:0 0 6px;font-weight:900}h2{font-size:22px;margin:34px 0 10px}p.n{color:#5b5578;max-width:48em;margin:0 0 10px}
.row{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.cell{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:8px 8px 10px;text-align:center}.cell b{display:block;font-size:13px;color:#7a7499;margin-top:4px}
object.pl{width:100%;aspect-ratio:1;display:block;pointer-events:none}.small object.pl{width:40px;height:40px;display:inline-block}
.scene{position:relative;border-radius:26px;overflow:hidden;height:300px;margin-top:10px}.scene .p{position:absolute;bottom:-6px;width:150px}.scene .p object{width:100%;aspect-ratio:1;display:block}
.sky-day{background:linear-gradient(#9AD8FF,#E8F8FF 60%,#BDE8A5 60%,#8FD27B)}.sky-dusk{background:linear-gradient(#5B4B9E,#F28B66 60%,#6EA85A 60%,#487A3A)}.sky-night{background:linear-gradient(#0E1233,#2B2064 60%,#244B3A 60%,#16332A)}
.v{position:absolute;width:72px}.v object{width:100%;aspect-ratio:1;display:block}
.v1{left:16%;top:34%;animation:fly1 9s ease-in-out infinite}.v2{left:62%;top:24%;animation:fly2 11s ease-in-out infinite}
@keyframes fly1{0%,100%{transform:translate(0,0)}50%{transform:translate(180px,-30px)}}@keyframes fly2{0%,100%{transform:translate(0,0)}50%{transform:translate(-200px,20px)}}
.moon{position:absolute;right:8%;top:10%;width:46px;height:46px;border-radius:50%;background:#FFF3C4;box-shadow:0 0 30px #FFF3C4}.sun{position:absolute;right:8%;top:10%;width:56px;height:56px;border-radius:50%;background:#FFD24D;box-shadow:0 0 36px #FFD24D}.star{position:absolute;width:5px;height:5px;background:#fff;border-radius:50%}
@media (prefers-reduced-motion:reduce){.v1,.v2{animation:none}}@media (max-width:720px){.row{grid-template-columns:repeat(3,1fr)}.scene .p{width:100px}}
</style></head><body><nav class="rvnav" style="position:sticky;top:0;z-index:99;display:flex;gap:6px 14px;flex-wrap:wrap;align-items:center;padding:8px 16px;background:#1a1d33;color:#fff;font:600 13px system-ui"><b style="opacity:.7">Duyệt Học Vui:</b><a style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px" href="../../../learn/mascot-review.html">🐾 Linh vật theo bố cục học</a><a style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px" href="../../../learn/index.html">Trang học</a><a style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px" href="../brand-learn.html">Thương hiệu 3 môn</a><a style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px" href="../learn/mascot_sheet.html">Bảng 3×5 lớp</a><a style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px" href="../preview-learn.html">3 bản base</a><a style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px" href="../preview-emotions.html">Cảm xúc</a><span style="padding:4px 10px;border-radius:99px;background:#fff;color:#1a1d33">🌱 Vườn (cây, ong, bướm)</span></nav><div class="wrap">
<h1>Vườn Học Vui — bản duyệt</h1>
<p class="n">Bản đề xuất để duyệt (xem <b>plan-learn-garden.md</b> mục 2 và 2b). Phong cách Pop. Mỗi môn một loại cây, 5 giai đoạn lớn lên, và biến thể để <b>mỗi bé một vườn khác nhau</b>. Sinh bằng <code>node scripts/learn/gen-garden-art.js</code>, không sửa tay.</p>
${Object.keys(PLANTS).map(id => `<h2>${PLANTS[id].vi}</h2><div class="row">${stages.map((s, i) => `<div class="cell"><object type="image/svg+xml" data="plant_${id}.svg#s${i}" class="pl st${i}" aria-label="${s}"></object><b>${i}. ${s}</b></div>`).join("")}</div>`).join("")}
<h2>Mỗi bé một khác: 3 kiểu hoa × 3 tông lá × 2 sắc hoa (ví dụ)</h2><p class="n">Hạt giống ngẫu nhiên của mỗi bé quyết định tổ hợp này, nên hai bé hiếm khi có hai cây giống hệt nhau (3×3×2 = 18 dáng cho mỗi loại cây, nhân 3 loại).</p>
<div class="row" id="genes"></div>
<h2>Vườn có sự sống: ban ngày, hoàng hôn, ban đêm (ong và bướm ghé thăm)</h2>
<div class="scene sky-day" id="s1"><div class="sun"></div></div><div class="scene sky-dusk" id="s2"><div class="sun" style="background:#FF9A5C;box-shadow:0 0 36px #FF9A5C;top:44%"></div></div><div class="scene sky-night" id="s3"><div class="moon"></div></div>
<h2>Đọc được ở 40px</h2><div class="small" id="sm"></div>
</div><script>
/* trang xem duyệt: bật giai đoạn / biến thể bằng cách đổi lớp trên thẻ svg gốc sau khi object nạp xong */
function setCls(obj, cls){ function go(){ var s = obj.contentDocument && obj.contentDocument.documentElement; if(!s) return; s.setAttribute("class", "np-plant " + cls); } if(obj.contentDocument && obj.contentDocument.readyState === "complete") go(); obj.addEventListener("load", go); }
document.querySelectorAll("object.pl[class*=' st']").forEach(function(o){ var m = o.className.match(/st(\\d)/); if(m) setCls(o, "s" + m[1] + " fl-a lt-a"); });
var P = ${JSON.stringify(Object.keys(PLANTS))}, fl = ["a","b","c"], lt = ["a","b","c"], tn = ["a","b"], g = document.getElementById("genes");
for(var i = 0; i < 10; i++){ var id = P[i % 3], c = "s4 fl-" + fl[i % 3] + " lt-" + lt[(i * 2 + 1) % 3] + " tn-" + tn[i % 2], d = document.createElement("div"); d.className = "cell"; d.innerHTML = '<object type="image/svg+xml" data="plant_' + id + '.svg" class="pl"></object><b>' + c.replace("s4 ","") + '</b>'; g.appendChild(d); setCls(d.firstChild, c); }
function scene(el, n){ var pos = [8, 28, 50, 72]; for(var i = 0; i < 4; i++){ var id = P[(i + n) % 3], p = document.createElement("div"); p.className = "p"; p.style.left = pos[i] + "%"; p.innerHTML = '<object type="image/svg+xml" data="plant_' + id + '.svg"></object>'; el.appendChild(p); setCls(p.firstChild, "s" + (i + 1) + " fl-" + fl[(i + n) % 3] + " lt-" + lt[(i + 2 * n) % 3] + " tn-" + tn[i % 2]); }
  [["visitor_bee.svg","v1"],["visitor_butterfly.svg","v2"]].forEach(function(v){ var d = document.createElement("div"); d.className = "v " + v[1]; d.innerHTML = '<object type="image/svg+xml" data="' + v[0] + '"></object>'; el.appendChild(d); }); }
scene(document.getElementById("s1"), 0); scene(document.getElementById("s2"), 1); scene(document.getElementById("s3"), 2);
for(var k = 0; k < 5; k++){ var o = document.createElement("span"); document.getElementById("s3").appendChild(Object.assign(document.createElement("i"), { className: "star", style: "left:" + (10 + k * 17) + "%;top:" + (8 + (k % 3) * 9) + "%" })); }
var sm = document.getElementById("sm"); P.forEach(function(id){ for(var s = 0; s < 5; s += 1){ var o = document.createElement("object"); o.type = "image/svg+xml"; o.data = "plant_" + id + ".svg"; o.className = "pl"; o.style.margin = "4px"; sm.appendChild(o); setCls(o, "s" + s + " fl-a lt-a"); } });
</script></body></html>
`;
fs.writeFileSync(path.join(out, "preview-garden.html"), html);
console.log("✓ đã sinh " + Object.keys(files).length + " tranh + trang duyệt trong shared/art/garden/");
