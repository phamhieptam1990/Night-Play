/* Sinh tranh SVG "CÂY TRỒNG THU HOẠCH kiểu Hay Day" cho Vườn Học Vui (xem plan-learn-garden.md mục 2c):
   6 cây trồng (Toán: cà rốt, bắp; Tiếng Việt: lúa, hướng dương; Tiếng Anh: dâu tây, cà chua), mỗi cây: 5 giai đoạn (s0 hạt … s4 CHÍN = sẵn sàng thu hoạch),
   dáng riêng, hoạt ảnh sống riêng (lá đung đưa, bắp phe phẩy râu, dâu nhún nhảy, lúa gợn sóng, hướng dương xoay mặt), nông sản riêng, kho (barn) + trang duyệt có "thu hoạch thử".
   Chạy: node scripts/learn/gen-crops-art.js  (không sửa tay tệp sinh ra trong shared/art/garden/).
   Phong cách POP (docs/MASCOT-ART-RULES.md): khối tròn, không viền đen (viền = màu đậm hơn), gradient 2 điểm dừng + vệt sáng, màu qua biến CSS,
   hoạt ảnh CHỈ transform/opacity đặt tên npa-*, tắt khi prefers-reduced-motion / html.np-playing, không filter/ảnh/script. */
"use strict";
const fs = require("fs"), path = require("path");
const out = path.join(__dirname, "../../shared/art/garden");
fs.mkdirSync(out, { recursive: true });
const f = n => Math.round(n * 10) / 10, cx = 128, G = 226;

/* ---- bộ phận dùng chung ---- */
const sparkle = (x, y, d) => `<path d="M${x} ${y - 9}L${x + 3} ${y - 3}L${x + 9} ${y}L${x + 3} ${y + 3}L${x} ${y + 9}L${x - 3} ${y + 3}L${x - 9} ${y}L${x - 3} ${y - 3}Z" fill="#fff" class="npa-twinkle" style="animation-delay:${d}s"/>`;
const leaf = (x, y, rot, s, flip) => `<g transform="translate(${x} ${y}) ${flip ? "scale(-1 1) " : ""}rotate(${rot}) scale(${s})"><path d="M0 0C12-22 44-20 52 4C32 18 8 14 0 0Z" fill="url(#lg)" stroke="var(--l3)" stroke-width="${f(3 / s)}" stroke-linejoin="round"/><path d="M4 0C18-4 32-4 44 2" fill="none" stroke="var(--l1)" stroke-width="${f(2.2 / s)}" stroke-linecap="round" opacity=".7"/></g>`;
const longLeaf = (x, y, rot, s, flip) => `<g transform="translate(${x} ${y}) ${flip ? "scale(-1 1) " : ""}rotate(${rot}) scale(${s})"><path d="M0 0C26-28 78-24 100 16C66 10 26 14 0 0Z" fill="url(#lg)" stroke="var(--l3)" stroke-width="${f(3 / s)}" stroke-linejoin="round"/><path d="M6 0C34-8 66-6 90 12" fill="none" stroke="var(--l1)" stroke-width="${f(2.4 / s)}" stroke-linecap="round" opacity=".7"/></g>`;
const stem = (x1, y1, x2, y2, w) => { const m = f((y1 + y2) / 2); return `<path d="M${x1} ${y1}C${x1 - 5} ${m} ${x2 + 5} ${m} ${x2} ${y2}" fill="none" stroke="var(--l3)" stroke-width="${w + 3}" stroke-linecap="round"/><path d="M${x1} ${y1}C${x1 - 5} ${m} ${x2 + 5} ${m} ${x2} ${y2}" fill="none" stroke="var(--l2)" stroke-width="${w}" stroke-linecap="round"/><path d="M${x1 + 1.5} ${y1 - 4}C${x1 - 3} ${m} ${x2 + 6} ${m} ${x2 + 1.5} ${y2 + 4}" fill="none" stroke="var(--l1)" stroke-width="${f(w / 3)}" stroke-linecap="round" opacity=".7"/>`; };
const seedSt = `<g class="st st0"><ellipse cx="${cx}" cy="204" rx="19" ry="24" fill="url(#sd)" stroke="#6B3F1F" stroke-width="3" transform="rotate(-8 ${cx} 204)"/><ellipse cx="${cx - 6}" cy="196" rx="5" ry="9" fill="#fff" opacity=".5" transform="rotate(-8 ${cx} 204)"/><path d="M${cx + 2} 190C${cx + 8} 200 ${cx + 6} 212 ${cx + 1} 220" fill="none" stroke="#6B3F1F" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>${sparkle(cx + 34, 176, 0)}${sparkle(cx - 38, 190, .7)}</g>`;
const ripeFx = `<g class="spk">${sparkle(cx + 56, 70, 0)}${sparkle(cx - 58, 96, .5)}${sparkle(cx + 44, 140, 1)}</g>`;
/* lá kép (cà chua / dâu): cuống + lá chét */
const frond = (x, y, rot, len, n) => { let s = `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0L0 ${-len}" stroke="var(--l3)" stroke-width="7" stroke-linecap="round"/><path d="M0 0L0 ${-len}" stroke="var(--l2)" stroke-width="4" stroke-linecap="round"/>`; for (let k = 1; k <= n; k++) { const yy = -len * k / (n + 1); s += `<ellipse cx="-8" cy="${f(yy)}" rx="5.5" ry="12" fill="url(#lg)" stroke="var(--l3)" stroke-width="2" transform="rotate(-38 -8 ${f(yy)})"/><ellipse cx="8" cy="${f(yy)}" rx="5.5" ry="12" fill="url(#lg)" stroke="var(--l3)" stroke-width="2" transform="rotate(38 8 ${f(yy)})"/>`; } return s + `<ellipse cx="0" cy="${-len - 6}" rx="5.5" ry="12" fill="url(#lg)" stroke="var(--l3)" stroke-width="2"/></g>`; };
const wrap = (cls, inner) => `<g class="${cls}">${inner}</g>`;   /* hoạt ảnh CSS ghi đè thuộc tính transform → đặt lớp hoạt ảnh ở <g> NGOÀI, định vị ở <g> TRONG */
const tri = (x, y, rot, s) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0L0 -26" stroke="var(--l2)" stroke-width="5" stroke-linecap="round"/><ellipse cx="0" cy="-42" rx="15" ry="17" fill="url(#lg)" stroke="var(--l3)" stroke-width="3"/><ellipse cx="-17" cy="-28" rx="15" ry="11" fill="url(#lg)" stroke="var(--l3)" stroke-width="3" transform="rotate(-30 -17 -28)"/><ellipse cx="17" cy="-28" rx="15" ry="11" fill="url(#lg)" stroke="var(--l3)" stroke-width="3" transform="rotate(30 17 -28)"/><path d="M0 -26V-56" stroke="var(--l1)" stroke-width="2" opacity=".6"/></g>`;

/* ---- cây trồng ---- */
const CROPS = {};

CROPS.carrot = { sc: 1.32, vi: "Cà rốt", en: "Carrot", subj: "Toán", animal: "bee", pal: "--o1:#FFB04D;--o2:#F2701C;--od:#B84E0E", anim: "Lá đung đưa, củ cà rốt nhô lên rung rinh khi chín",
  draw: () => {
    const crown = (r) => `<ellipse cx="${cx}" cy="198" rx="${r}" ry="${f(r * .5)}" fill="url(#og)" stroke="var(--od)" stroke-width="3"/>`;
    const st1 = `<g class="st st1">${wrap("npa npa-sway", frond(cx, 198, -14, 30, 1))}${wrap("npa npa-sway d2", frond(cx, 198, 16, 24, 1))}</g>`;
    const st2 = `<g class="st st2">${[[-22, 48, 2, ""], [0, 56, 3, " d2"], [22, 46, 2, " d3"]].map(([r, l, n, d]) => wrap("npa npa-sway" + d, frond(cx, 198, r, l, n))).join("")}</g>`;
    const fr = [[-34, 52, 2, ""], [-16, 64, 3, " d2"], [0, 70, 3, " d3"], [16, 64, 3, ""], [34, 52, 2, " d2"]].map(([r, l, n, d]) => wrap("npa npa-sway" + d, frond(cx, 198, r, l, n))).join("");
    const st3 = `<g class="st st3">${fr}${crown(13)}</g>`;
    const st4 = `<g class="st st4">${fr}<g class="npa npa-wobble"><ellipse cx="${cx}" cy="200" rx="27" ry="15" fill="url(#og)" stroke="var(--od)" stroke-width="3"/><path d="M${cx - 18} 197Q${cx} 190 ${cx + 18} 197M${cx - 14} 204Q${cx} 198 ${cx + 14} 204" fill="none" stroke="var(--od)" stroke-width="2.4" stroke-linecap="round" opacity=".5"/><ellipse cx="${cx - 9}" cy="194" rx="8" ry="4" fill="#fff" opacity=".55"/></g></g>`;
    return seedSt + st1 + st2 + st3 + st4 + ripeFx; },
  defs: `<linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--o1)"/><stop offset="1" style="stop-color:var(--o2)"/></linearGradient>`,
  produce: () => `<path d="M128 232C104 198 92 150 104 120C112 104 144 104 152 120C164 150 152 198 128 232Z" fill="url(#og)" stroke="var(--od)" stroke-width="5" stroke-linejoin="round"/><path d="M104 140Q128 150 150 140M108 170Q128 180 146 170M114 198Q128 206 142 198" fill="none" stroke="var(--od)" stroke-width="4" stroke-linecap="round" opacity=".5"/><ellipse cx="116" cy="136" rx="7" ry="22" fill="#fff" opacity=".5" transform="rotate(8 116 136)"/>` + [[-26, 0], [0, -6], [26, 0]].map(([r, dy]) => `<g transform="translate(128 112) rotate(${r})"><path d="M0 0L0 -44" stroke="var(--l3)" stroke-width="9" stroke-linecap="round"/><path d="M0 0L0 -44" stroke="var(--l2)" stroke-width="5" stroke-linecap="round"/><ellipse cx="0" cy="-48" rx="9" ry="18" fill="url(#lg)" stroke="var(--l3)" stroke-width="3"/></g>`).join("") };

CROPS.corn = { vi: "Bắp", en: "Corn", subj: "Toán", animal: "bee", pal: "--k1:#FFE066;--k2:#F5B700;--kd:#B88400", anim: "Lá dài đung đưa, râu bắp phe phẩy, trái bắp vàng lấp lánh",
  draw: () => {
    const cob = (x, y, rot, s) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-14 -4C-30 20 -26 54 0 66C26 54 30 20 14 -4Z" fill="url(#lg)" stroke="var(--l3)" stroke-width="3" stroke-linejoin="round"/><path d="M-10 -8C-14 -34 -8 -52 0 -58C8 -52 14 -34 10 -8Z" fill="url(#kg)" stroke="var(--kd)" stroke-width="3" stroke-linejoin="round"/>${[-5, 5].map(a => [-40, -26, -12].map(b => `<circle cx="${a}" cy="${b}" r="3.4" fill="#fff" opacity=".55"/>`).join("")).join("")}<path d="M0 -58Q-8 -74 -2 -84M0 -58Q6 -74 12 -80" fill="none" stroke="#C48A3A" stroke-width="3" stroke-linecap="round" class="npa npa-tassel"/></g>`;
    const tassel = (y, s) => wrap("npa npa-tassel", `<g transform="translate(${cx} ${y}) scale(${s})">${[-24, -10, 0, 10, 24].map(r => `<path d="M0 0Q${r * .6} -22 ${r} -44" fill="none" stroke="#D9B45A" stroke-width="4" stroke-linecap="round"/>`).join("")}</g>`);
    const st1 = `<g class="st st1">${stem(cx, G - 4, cx, 184, 8)}${longLeaf(cx, 190, -50, .45, false)}${longLeaf(cx, 186, -50, .4, true)}</g>`;
    const st2 = `<g class="st st2 npa npa-sway">${stem(cx, G - 4, cx, 140, 10)}${longLeaf(cx, 200, -46, .6, false)}${longLeaf(cx, 176, -52, .6, true)}${longLeaf(cx, 156, -56, .5, false)}</g>`;
    const lv = `${longLeaf(cx, 204, -42, .75, false)}${longLeaf(cx, 184, -48, .75, true)}${longLeaf(cx, 162, -52, .68, false)}${longLeaf(cx, 142, -56, .62, true)}`;
    const st3 = `<g class="st st3 npa npa-sway">${stem(cx, G - 4, cx, 96, 12)}${lv}${tassel(94, .8)}${cob(cx + 14, 150, 14, .34)}</g>`;
    const st4 = `<g class="st st4 npa npa-sway">${stem(cx, G - 4, cx, 90, 12)}${lv}${tassel(88, .9)}<g class="npa npa-bob">${cob(cx + 16, 156, 14, .56)}${cob(cx - 16, 134, -14, .5)}</g></g>`;
    return seedSt + st1 + st2 + st3 + st4 + ripeFx; },
  defs: `<linearGradient id="kg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--k1)"/><stop offset="1" style="stop-color:var(--k2)"/></linearGradient>`,
  produce: () => `<g transform="translate(128 134) scale(1.35)"><path d="M-14 -4C-30 20 -26 54 0 66C26 54 30 20 14 -4Z" fill="url(#lg)" stroke="var(--l3)" stroke-width="3" stroke-linejoin="round" transform="translate(0 6)"/><path d="M-12 -30C-18 -56 -10 -78 0 -86C10 -78 18 -56 12 -30Z" fill="url(#kg)" stroke="var(--kd)" stroke-width="3" stroke-linejoin="round" transform="translate(0 26)"/>${[-6, 6].map(a => [-36, -20, -4, 12].map(b => `<circle cx="${a}" cy="${b + 26}" r="3.6" fill="#fff" opacity=".55"/>`).join("")).join("")}</g>` };

CROPS.wheat = { vi: "Lúa mì", en: "Wheat", subj: "Tiếng Việt", animal: "butterfly", pal: "--w1:#FFE08A;--w2:#E8B83A;--wd:#A9801A", anim: "Cả bụi lúa gợn sóng như có gió, bông lúa vàng cúi xuống khi chín",
  draw: () => {
    const head = (x, y, rot, s, ripe) => { let h = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">`; for (let i = 0; i < 5; i++) { const yy = -i * 13; h += `<ellipse cx="-8" cy="${yy}" rx="6" ry="11" fill="${ripe ? "url(#wg)" : "url(#lg)"}" stroke="${ripe ? "var(--wd)" : "var(--l3)"}" stroke-width="2.4" transform="rotate(-24 -8 ${yy})"/><ellipse cx="8" cy="${yy}" rx="6" ry="11" fill="${ripe ? "url(#wg)" : "url(#lg)"}" stroke="${ripe ? "var(--wd)" : "var(--l3)"}" stroke-width="2.4" transform="rotate(24 8 ${yy})"/>`; } h += `<ellipse cx="0" cy="-62" rx="6" ry="12" fill="${ripe ? "url(#wg)" : "url(#lg)"}" stroke="${ripe ? "var(--wd)" : "var(--l3)"}" stroke-width="2.4"/><path d="M0 -70L0 -92M-6 -66L-14 -88M6 -66L14 -88" stroke="${ripe ? "var(--wd)" : "var(--l2)"}" stroke-width="2.4" stroke-linecap="round"/></g>`; return h; };
    const blade = (x, rot, h, d) => `<g class="npa npa-wave${d}"><path d="M${x} ${G - 4}C${x + rot * .3} ${G - 4 - h * .5} ${x + rot} ${G - 4 - h * .8} ${x + rot * 1.2} ${G - 4 - h}" fill="none" stroke="var(--l3)" stroke-width="9" stroke-linecap="round"/><path d="M${x} ${G - 4}C${x + rot * .3} ${G - 4 - h * .5} ${x + rot} ${G - 4 - h * .8} ${x + rot * 1.2} ${G - 4 - h}" fill="none" stroke="var(--l2)" stroke-width="5" stroke-linecap="round"/></g>`;
    const xs = [-34, -17, 0, 17, 34];
    const st1 = `<g class="st st1">${blade(cx - 10, -10, 30, "")}${blade(cx + 10, 10, 26, " d2")}${blade(cx, 0, 36, " d3")}</g>`;
    const st2 = `<g class="st st2">${xs.map((x, i) => blade(cx + x * .6, x * .4, 56 + (i % 2) * 10, [" ", " d2", " d3", " d4", " "][i])).join("")}</g>`;
    const stalk = (x, rot, h, d, ripe, hs) => `<g class="npa npa-wave${d}"><path d="M${x} ${G - 4}C${x} ${G - 4 - h * .5} ${x + rot * .4} ${G - 4 - h * .8} ${x + rot} ${G - 4 - h}" fill="none" stroke="var(--l3)" stroke-width="8" stroke-linecap="round"/><path d="M${x} ${G - 4}C${x} ${G - 4 - h * .5} ${x + rot * .4} ${G - 4 - h * .8} ${x + rot} ${G - 4 - h}" fill="none" stroke="${ripe ? "var(--w1)" : "var(--l2)"}" stroke-width="4" stroke-linecap="round"/>${head(x + rot, G - 4 - h + 2, rot * .5, hs, ripe)}</g>`;
    const cfg = [[-36, -8, 96, "", 1], [-18, -4, 112, " d2", 1], [0, 0, 120, " d3", 1.1], [18, 5, 110, " d4", 1], [36, 9, 94, " ", 1]];
    const st3 = `<g class="st st3">${cfg.map(([x, r, h, d, s]) => stalk(cx + x * .8, r, h * .8, d, false, s * .52)).join("")}</g>`;
    const st4 = `<g class="st st4">${cfg.map(([x, r, h, d, s]) => stalk(cx + x * .8, r * 2.2, h * .86, d, true, s * .6)).join("")}</g>`;
    return seedSt + st1 + st2 + st3 + st4 + ripeFx; },
  defs: `<linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--w1)"/><stop offset="1" style="stop-color:var(--w2)"/></linearGradient>`,
  produce: () => `<g transform="translate(128 232) scale(1.5)">${[-30, -14, 0, 14, 30].map((x, i) => `<g transform="translate(${x * .5} 0) rotate(${x * .5})"><path d="M0 0L0 -92" stroke="var(--wd)" stroke-width="5" stroke-linecap="round"/><g transform="translate(0 -78) scale(.7)">${[0, 1, 2, 3, 4].map(k => `<ellipse cx="-8" cy="${-k * 13}" rx="6" ry="11" fill="url(#wg)" stroke="var(--wd)" stroke-width="2.6" transform="rotate(-24 -8 ${-k * 13})"/><ellipse cx="8" cy="${-k * 13}" rx="6" ry="11" fill="url(#wg)" stroke="var(--wd)" stroke-width="2.6" transform="rotate(24 8 ${-k * 13})"/>`).join("")}<ellipse cx="0" cy="-62" rx="6" ry="12" fill="url(#wg)" stroke="var(--wd)" stroke-width="2.6"/></g></g>`).join("")}<path d="M-26 -34Q0 -26 26 -34L24 -22Q0 -14 -24 -22Z" fill="#E86A5C" stroke="#A8372C" stroke-width="3" stroke-linejoin="round"/></g>` };

CROPS.sunflower = { vi: "Hướng dương", en: "Sunflower", subj: "Tiếng Việt", animal: "butterfly", pal: "--s1:#FFD43B;--s2:#F59F00;--sd:#B36B00;--br1:#9A6234;--br2:#5A3719", anim: "Bông hoa to chậm rãi xoay theo ánh nắng, cánh hoa rung nhẹ",
  draw: () => {
    const head = (y, s, open) => { let h = `<g class="npa npa-turn"><g transform="translate(${cx} ${y}) scale(${s})">`; if (open) { h += [0, 1].map(l => Array.from({ length: 14 }, (_, i) => `<ellipse cx="0" cy="${l ? -34 : -40}" rx="${l ? 9 : 10}" ry="${l ? 17 : 21}" fill="url(#sg2)" stroke="var(--sd)" stroke-width="2.6" transform="rotate(${i * (360 / 14) + (l ? 13 : 0)})"/>`).join("")).join(""); h += `<circle cx="0" cy="0" r="27" fill="url(#bg2)" stroke="var(--br2)" stroke-width="3"/>`; for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 4 + i * .85; h += `<circle cx="${f(Math.cos(a) * r)}" cy="${f(Math.sin(a) * r)}" r="2" fill="var(--br2)" opacity=".7"/>`; } h += `<ellipse cx="-10" cy="-12" rx="7" ry="3.4" fill="#fff" opacity=".35"/>`; } else { h += `<ellipse cx="0" cy="0" rx="19" ry="23" fill="url(#lg)" stroke="var(--l3)" stroke-width="3"/><path d="M-10 -16Q0 -34 10 -16" fill="url(#sg2)" stroke="var(--sd)" stroke-width="2.4"/>`; } return h + `</g></g>`; };
    const st1 = `<g class="st st1 npa npa-sway">${stem(cx, G - 4, cx, 180, 9)}${pair2(176, -30, .72)}</g>`;
    const st2 = `<g class="st st2 npa npa-sway">${stem(cx, G - 4, cx, 130, 11)}${pair2(200, -22, .95)}${pair2(160, -34, .85)}</g>`;
    const st3 = `<g class="st st3 npa npa-sway">${stem(cx, G - 4, cx, 96, 12)}${pair2(204, -20, 1.05)}${pair2(166, -32, .95)}${head(78, .9, false)}</g>`;
    const st4 = `<g class="st st4 npa npa-sway">${stem(cx, G - 4, cx, 104, 12)}${pair2(206, -20, 1.05)}${pair2(170, -32, .95)}${head(72, .95, true)}</g>`;
    return seedSt + st1 + st2 + st3 + st4 + ripeFx; },
  defs: `<linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--s1)"/><stop offset="1" style="stop-color:var(--s2)"/></linearGradient><radialGradient id="bg2" cx=".4" cy=".35" r=".8"><stop offset="0" style="stop-color:var(--br1)"/><stop offset="1" style="stop-color:var(--br2)"/></radialGradient>`,
  produce: () => `<g transform="translate(128 128)">${Array.from({ length: 14 }, (_, i) => `<ellipse cx="0" cy="-52" rx="13" ry="26" fill="url(#sg2)" stroke="var(--sd)" stroke-width="3" transform="rotate(${i * (360 / 14)})"/>`).join("")}<circle r="36" fill="url(#bg2)" stroke="var(--br2)" stroke-width="4"/>${Array.from({ length: 30 }, (_, i) => { const a = i * 2.4, r = 5 + i * 1; return `<circle cx="${f(Math.cos(a) * r)}" cy="${f(Math.sin(a) * r)}" r="2.6" fill="var(--br2)" opacity=".7"/>`; }).join("")}</g>` };

CROPS.strawberry = { sc: 1.3, vi: "Dâu tây", en: "Strawberry", subj: "Tiếng Anh", animal: "bee", pal: "--b1:#FF6B6B;--b2:#D62839;--bd:#9E1B28", anim: "Bụi dâu thấp, hoa trắng nở rồi quả đỏ nhún nhảy và lấp lánh khi chín",
  draw: () => {
    const berry = (x, y, s, ripe, rot) => `<g class="npa npa-bob${rot ? " d2" : ""}"><g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -14C16 -18 24 2 0 26C-24 2 -16 -18 0 -14Z" fill="${ripe ? "url(#bg1)" : "#E4F0B4"}" stroke="${ripe ? "var(--bd)" : "#9DB760"}" stroke-width="3" stroke-linejoin="round"/>${[[-7, -2], [5, -4], [-2, 6], [8, 6], [-9, 8], [1, 15]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="1.8" ry="2.6" fill="${ripe ? "#FFE680" : "#9DB760"}"/>`).join("")}<path d="M0 -14L-10 -22M0 -14L0 -26M0 -14L10 -22M0 -14L-14 -12M0 -14L14 -12" stroke="var(--l2)" stroke-width="4.5" stroke-linecap="round"/>${ripe ? `<ellipse cx="-9" cy="-4" rx="3.4" ry="7" fill="#fff" opacity=".5" transform="rotate(14 -9 -4)"/>` : ""}</g></g>`;
    const flower = (x, y) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(r => `<ellipse cx="0" cy="-8" rx="5.5" ry="8" fill="#fff" stroke="#E5DCEB" stroke-width="2" transform="rotate(${r})"/>`).join("")}<circle r="4.4" fill="#FFC94A"/></g>`;
    const bush = (n) => [[-50, 200, -34, .62], [50, 200, 34, .62], [-26, 198, -12, .74], [28, 198, 14, .74], [0, 196, 0, .84]].slice(0, n).map(([dx, y, r, s]) => tri(cx + dx, y, r, s)).join("");
    const st1 = `<g class="st st1">${tri(cx - 16, 202, -18, .5)}${tri(cx + 16, 202, 18, .5)}</g>`;
    const st2 = `<g class="st st2">${bush(3)}${flower(cx - 20, 150)}</g>`;
    const st3 = `<g class="st st3">${bush(5)}${flower(cx - 44, 152)}${berry(cx - 30, 178, .6, false)}${berry(cx + 34, 176, .6, false, 1)}</g>`;
    const st4 = `<g class="st st4">${bush(5)}${berry(cx - 46, 176, .95, true)}${berry(cx + 48, 172, .95, true, 1)}${berry(cx - 8, 190, 1, true)}${berry(cx + 18, 160, .8, true, 1)}</g>`;
    return seedSt + st1 + st2 + st3 + st4 + ripeFx; },
  defs: `<linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--b1)"/><stop offset="1" style="stop-color:var(--b2)"/></linearGradient>`,
  produce: () => `<g transform="translate(128 140) scale(3)"><path d="M0 -14C16 -18 24 2 0 26C-24 2 -16 -18 0 -14Z" fill="url(#bg1)" stroke="var(--bd)" stroke-width="2.4" stroke-linejoin="round"/>${[[-7, -2], [5, -4], [-2, 6], [8, 6], [-9, 8], [1, 15]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="1.8" ry="2.6" fill="#FFE680"/>`).join("")}<path d="M0 -14L-10 -22M0 -14L0 -26M0 -14L10 -22M0 -14L-14 -12M0 -14L14 -12" stroke="var(--l2)" stroke-width="3.6" stroke-linecap="round"/><ellipse cx="-9" cy="-4" rx="3.4" ry="7" fill="#fff" opacity=".5" transform="rotate(14 -9 -4)"/></g>` };

CROPS.tomato = { sc: 1.1, vi: "Cà chua", en: "Tomato", subj: "Tiếng Anh", animal: "bee", pal: "--t1:#FF7A66;--t2:#E5322D;--td:#A81F1B", anim: "Cây leo có cuống, quả cà chua xanh rồi chín đỏ đung đưa",
  draw: () => {
    const tom = (x, y, s, ripe, d) => `<g class="npa npa-bob${d}"><g transform="translate(${x} ${y}) scale(${s})"><circle r="17" fill="${ripe ? "url(#tg)" : "#A8D872"}" stroke="${ripe ? "var(--td)" : "#6E9B3C"}" stroke-width="3"/><path d="M0 -17L-8 -12M0 -17L8 -12M0 -17L-12 -6M0 -17L12 -6M0 -17L0 -25" stroke="var(--l2)" stroke-width="4" stroke-linecap="round"/>${ripe ? `<ellipse cx="-7" cy="-5" rx="4" ry="7" fill="#fff" opacity=".5" transform="rotate(20 -7 -5)"/>` : ""}</g></g>`;
    const comp = (x, y, rot, s) => wrap("npa npa-sway", frond(x, y, rot, 40 * s, 2));
    const st1 = `<g class="st st1">${wrap("npa npa-sway", frond(cx, 198, -14, 28, 1))}${wrap("npa npa-sway d2", frond(cx, 198, 16, 22, 1))}</g>`;
    const st2 = `<g class="st st2 npa npa-sway">${stem(cx, G - 4, cx, 142, 9)}${comp(cx, 190, -50, 1)}${comp(cx, 172, 50, 1)}${comp(cx, 150, -30, .9)}</g>`;
    const base = `${stem(cx, G - 4, cx, 108, 10)}${comp(cx, 204, -54, 1.2)}${comp(cx, 192, 54, 1.2)}${comp(cx, 168, -42, 1.1)}${comp(cx, 150, 42, 1.1)}${comp(cx, 126, -20, 1)}`;
    const st3 = `<g class="st st3 npa npa-sway">${base}${tom(cx - 38, 176, .62, false, "")}${tom(cx + 40, 164, .62, false, " d2")}${tom(cx - 4, 128, .56, false, " d3")}</g>`;
    const st4 = `<g class="st st4 npa npa-sway">${base}${tom(cx - 40, 176, .95, true, "")}${tom(cx + 42, 164, .92, true, " d2")}${tom(cx - 2, 130, .8, true, " d3")}</g>`;
    return seedSt + st1 + st2 + st3 + st4 + ripeFx; },
  defs: `<radialGradient id="tg" cx=".36" cy=".32" r=".85"><stop offset="0" style="stop-color:var(--t1)"/><stop offset="1" style="stop-color:var(--t2)"/></radialGradient>`,
  produce: () => `<g transform="translate(128 140) scale(3.4)"><circle r="17" fill="url(#tg)" stroke="var(--td)" stroke-width="2.4"/><path d="M0 -17L-8 -12M0 -17L8 -12M0 -17L-12 -6M0 -17L12 -6M0 -17L0 -25" stroke="var(--l2)" stroke-width="3.4" stroke-linecap="round"/><ellipse cx="-7" cy="-5" rx="4" ry="7" fill="#fff" opacity=".5" transform="rotate(20 -7 -5)"/></g>` };

function pair2(y, rot, s) { return leaf(cx, y, rot, s, false) + leaf(cx, y, rot, s, true); }

function cropSvg(id, C) {
  const geo = C.draw();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${C.vi} (${C.en})" class="np-crop s4" data-style="pop" data-game="crop-${id}">
<title>${C.vi}</title>
<desc>Cây trồng thu hoạch của môn ${C.subj}: ${C.anim}. 5 giai đoạn: lớp s0 hạt, s1 mầm, s2 cây con, s3 sắp chín, s4 CHÍN (sẵn sàng thu hoạch, có lấp lánh). Tông lá lt-a xanh tươi, lt-b ngọc, lt-c lá chuối.</desc>
<style>
.np-crop{${C.pal};--l1:#6FDB8A;--l2:#34B461;--l3:#1F7F43;--soil1:#B07A4A;--soil2:#7B4E2B;--seed1:#E8B07A;--seed2:#B9783F}
.np-crop.lt-b{--l1:#5FD6B0;--l2:#2BAE8A;--l3:#177A60}.np-crop.lt-c{--l1:#B7D95C;--l2:#7FB53A;--l3:#527F1F}
.st,.spk{display:none}.s0 .st0,.s1 .st1,.s2 .st2,.s3 .st3,.s4 .st4{display:inline}.s4 .spk{display:inline}
.npa{transform-box:fill-box;transform-origin:50% 100%}.npa-sway{animation:npa-sway 4.6s ease-in-out infinite}.npa-sway.d2{animation-delay:-1.3s}.npa-sway.d3{animation-delay:-2.6s}
.npa-wave{animation:npa-wave 3.4s ease-in-out infinite}.npa-wave.d2{animation-delay:-.7s}.npa-wave.d3{animation-delay:-1.4s}.npa-wave.d4{animation-delay:-2.1s}
.npa-bob{transform-origin:50% 0;animation:npa-bob 2.6s ease-in-out infinite}.npa-bob.d2{animation-delay:-.9s}.npa-bob.d3{animation-delay:-1.7s}
.npa-wobble{transform-origin:50% 100%;animation:npa-wobble 2.2s ease-in-out infinite}.npa-tassel{transform-origin:50% 100%;animation:npa-tassel 1.8s ease-in-out infinite}
.npa-turn{transform-origin:50% 50%;animation:npa-turn 7s ease-in-out infinite}.npa-twinkle{animation:npa-twinkle 2s ease-in-out infinite}
@keyframes npa-sway{0%,100%{transform:rotate(-1.8deg)}50%{transform:rotate(1.8deg)}}@keyframes npa-wave{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@keyframes npa-bob{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes npa-wobble{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-3px) scale(1.04)}}@keyframes npa-tassel{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(6deg)}}@keyframes npa-turn{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}@keyframes npa-twinkle{0%,100%{opacity:.2}50%{opacity:1}}
:root.np-playing .npa,:root.np-playing .npa-twinkle{animation:none}@media (prefers-reduced-motion:reduce){.npa,.npa-twinkle{animation:none!important}}
</style>
<defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--l1)"/><stop offset="1" style="stop-color:var(--l2)"/></linearGradient>
<linearGradient id="sd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--seed1)"/><stop offset="1" style="stop-color:var(--seed2)"/></linearGradient>
<linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--soil1)"/><stop offset="1" style="stop-color:var(--soil2)"/></linearGradient>${C.defs}</defs>
<g id="all"><g transform="translate(128 226) scale(${C.sc || 1}) translate(-128 -226)">
<ellipse id="shadow" cx="${cx}" cy="236" rx="74" ry="9" fill="#000" opacity=".16"/>
<path id="soil" d="M52 232C54 206 88 192 ${cx} 192C168 192 202 206 204 232C190 240 66 240 52 232Z" fill="url(#sg)" stroke="#5A3719" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="${cx - 26}" cy="206" rx="12" ry="4" fill="#fff" opacity=".18"/><circle cx="${cx + 38}" cy="214" r="3" fill="#5A3719" opacity=".45"/><circle cx="${cx - 44}" cy="219" r="2.4" fill="#5A3719" opacity=".45"/>
${geo}
</g></g></svg>
`;
}
function produceSvg(id, C) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${C.vi} thu hoạch" class="np-produce" data-style="pop" data-game="produce-${id}">
<title>${C.vi} (nông sản)</title><style>.np-produce{${C.pal};--l1:#6FDB8A;--l2:#34B461;--l3:#1F7F43}</style>
<defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--l1)"/><stop offset="1" style="stop-color:var(--l2)"/></linearGradient>${C.defs}</defs>
<ellipse cx="128" cy="240" rx="52" ry="7" fill="#000" opacity=".14"/>
${C.produce()}
</svg>
`;
}
const BARN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="Kho nông sản" class="np-barn" data-style="pop" data-game="barn"><title>Kho nông sản</title>
<style>.npa{transform-box:fill-box;transform-origin:50% 100%}.npa-bounce.on{animation:npa-bounce .5s ease-out}@keyframes npa-bounce{0%{transform:scale(1)}35%{transform:scale(1.12,.9)}65%{transform:scale(.96,1.06)}100%{transform:scale(1)}}:root.np-playing .npa{animation:none}@media (prefers-reduced-motion:reduce){.npa{animation:none!important}}</style>
<defs><linearGradient id="br" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F26B5B"/><stop offset="1" stop-color="#C73E33"/></linearGradient><linearGradient id="rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E6A52"/><stop offset="1" stop-color="#6A4A37"/></linearGradient></defs>
<g id="all" class="npa npa-bounce"><ellipse cx="128" cy="236" rx="92" ry="9" fill="#000" opacity=".16"/>
<path d="M30 112L128 44L226 112V232H30Z" fill="url(#br)" stroke="#9E2C23" stroke-width="4" stroke-linejoin="round"/>
<path d="M18 116L128 36L238 116L226 130L128 62L30 130Z" fill="url(#rf)" stroke="#4F3427" stroke-width="4" stroke-linejoin="round"/>
<rect x="78" y="142" width="100" height="90" rx="10" fill="#FFF3E0" stroke="#9E2C23" stroke-width="4"/><path d="M78 142L178 232M178 142L78 232" stroke="#C73E33" stroke-width="6" stroke-linecap="round"/><rect x="78" y="142" width="100" height="90" rx="10" fill="none" stroke="#9E2C23" stroke-width="4"/>
<circle cx="128" cy="96" r="14" fill="#FFF3E0" stroke="#9E2C23" stroke-width="4"/><path d="M128 86V106M118 96H138" stroke="#C73E33" stroke-width="4" stroke-linecap="round"/><ellipse cx="62" cy="152" rx="10" ry="5" fill="#fff" opacity=".28"/></g></svg>
`;

const files = {};
for (const [id, C] of Object.entries(CROPS)) { files[`crop_${id}.svg`] = cropSvg(id, C); files[`produce_${id}.svg`] = produceSvg(id, C); }
files["barn.svg"] = BARN;
for (const [n, c] of Object.entries(files)) fs.writeFileSync(path.join(out, n), c);

/* ---- trang xem duyệt + thu hoạch thử ---- */
const A = 'style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px"';
const nav = `<nav class="rvnav" style="position:sticky;top:0;z-index:99;display:flex;gap:6px 14px;flex-wrap:wrap;align-items:center;padding:8px 16px;background:#1a1d33;color:#fff;font:600 13px system-ui"><b style="opacity:.7">Duyệt Học Vui:</b><a ${A} href="../../../learn/mascot-review.html">🐾 Linh vật theo bố cục học</a><a ${A} href="../../../learn/index.html">Trang học</a><a ${A} href="../brand-learn.html">Thương hiệu 3 môn</a><a ${A} href="../learn/mascot_sheet.html">Bảng 3×5 lớp</a><a ${A} href="../preview-learn.html">3 bản base</a><a ${A} href="../preview-emotions.html">Cảm xúc</a><a ${A} href="preview-garden.html">🌸 Vườn hoa</a><span style="padding:4px 10px;border-radius:99px;background:#fff;color:#1a1d33">🌾 Thu hoạch (cây trồng)</span><a style="color:#cfd3ff;text-decoration:none;padding:4px 10px;border-radius:99px" href="preview-scene.html">🏡 Khu vườn (10 ảnh)</a></nav>`;
const ids = Object.keys(CROPS), stageNames = ["Hạt", "Mầm", "Cây con", "Sắp chín", "CHÍN"];
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vườn Học Vui: cây trồng thu hoạch (bản duyệt)</title>
<style>
:root{--ink:#1d1a33;--bg:#F6F4F1;--panel:#fff;--line:#E3DDEF}*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:1120px;margin:0 auto;padding:24px 16px 70px}h1{font-size:clamp(26px,5vw,40px);margin:0 0 6px;font-weight:900}h2{font-size:22px;margin:34px 0 4px}p.n{color:#5b5578;max-width:50em;margin:0 0 10px}
.row{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.cell{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:6px 6px 8px;text-align:center}.cell b{display:block;font-size:12px;color:#7a7499}
object.pl{width:100%;aspect-ratio:1;display:block;pointer-events:none}
.tag{display:inline-block;font-size:12px;font-weight:800;padding:2px 10px;border-radius:99px;background:#EDE9FF;color:#4B3FA0;margin-left:8px;vertical-align:middle}
.farm{position:relative;border-radius:28px;overflow:hidden;margin-top:12px;padding:14px 14px 18px;background:linear-gradient(#9AD8FF,#E8F8FF 22%,#BDE8A5 22%,#8FD27B);min-height:420px}
.hud{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:space-between;margin-bottom:8px}
.barnbox{position:relative;display:flex;align-items:center;gap:8px;min-width:150px;background:rgba(255,255,255,.85);border-radius:20px;padding:6px 14px 6px 6px;border:2px solid #fff}.barnbox object{width:56px;height:56px;pointer-events:none}.stock{display:flex;gap:8px;flex-wrap:wrap}.stock span{display:inline-flex;align-items:center;gap:2px;background:#fff;border-radius:14px;padding:2px 8px 2px 2px;font-weight:900;font-size:14px;border:2px solid #E3DDEF}.stock img{width:26px;height:26px}
.hint{font-weight:800;background:rgba(255,255,255,.85);border-radius:14px;padding:6px 12px;font-size:14px}
.plots{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:6px}.plot{position:relative;border-radius:22px;padding:0;background:none;border:0;cursor:default}.plot object{width:100%;aspect-ratio:1;display:block;pointer-events:none}
.plot.ripe{cursor:pointer}.plot.ripe::before{content:"";position:absolute;left:50%;bottom:6%;width:62%;height:18%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(#FFF3A6,transparent 70%);animation:glow 1.2s ease-in-out infinite alternate}@keyframes glow{from{opacity:.35}to{opacity:1}}
.plot .nm{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);background:rgba(255,255,255,.9);border-radius:12px;padding:1px 10px;font-size:12px;font-weight:800;white-space:nowrap}
.plot .prog{position:absolute;left:18%;right:18%;top:4%;height:8px;border-radius:5px;background:rgba(0,0,0,.14);overflow:hidden}.plot .prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,#34D399,#FFD24D);transition:width .5s}
.plot .tap{position:absolute;left:50%;top:-2%;transform:translateX(-50%);font-size:26px;display:none;animation:tapb .7s ease-in-out infinite}.plot.ripe .tap{display:block}@keyframes tapb{50%{transform:translateX(-50%) translateY(6px)}}
.plot.pop{animation:ppop .4s}@keyframes ppop{0%{transform:scale(1)}30%{transform:scale(1.1,.88)}60%{transform:scale(.96,1.06)}100%{transform:scale(1)}}
.fly{position:fixed;z-index:50;width:54px;height:54px;pointer-events:none}.plus{position:fixed;z-index:51;font-weight:900;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.3);font-size:22px;pointer-events:none}
.spark{position:fixed;z-index:50;width:10px;height:10px;border-radius:50%;pointer-events:none}
@media (prefers-reduced-motion:reduce){.plot.ripe::before,.plot .tap{animation:none}}@media (max-width:720px){.row{grid-template-columns:repeat(3,1fr)}.plots{grid-template-columns:repeat(2,1fr)}}
</style></head><body>${nav}<div class="wrap">
<h1>Cây trồng thu hoạch kiểu Hay Day — bản duyệt</h1>
<p class="n">Mỗi cây có <b>dáng riêng</b>, <b>hoạt ảnh sống riêng</b> và <b>nông sản riêng</b>. Giai đoạn 4 là <b>CHÍN</b>: có lấp lánh và chạm để thu hoạch. Bên dưới có <b>thu hoạch thử</b>: cây tự lớn (chạy nhanh để xem), chín thì chạm, nông sản bay về kho, cây mọc lại. Trong app thật, cây lớn nhờ <b>bé làm đúng câu hỏi</b> chứ không phải chờ giờ. Sinh bằng <code>node scripts/learn/gen-crops-art.js</code>.</p>
<h2>🌾 Thu hoạch thử (chạm cây chín)</h2>
<div class="farm" id="farm"><div class="hud"><div class="barnbox"><object type="image/svg+xml" data="barn.svg" id="barnObj"></object><div class="stock" id="stock"></div></div><div class="hint">Chạm cây có 👆 để thu hoạch</div></div><div class="plots" id="plots"></div></div>
${ids.map(id => `<h2>${CROPS[id].vi}<span class="tag">${CROPS[id].subj}</span></h2><p class="n">${CROPS[id].anim}.</p><div class="row">${stageNames.map((s, i) => `<div class="cell"><object type="image/svg+xml" data="crop_${id}.svg" class="pl" data-s="${i}" aria-label="${CROPS[id].vi} ${s}"></object><b>${i}. ${s}</b></div>`).join("")}</div>`).join("")}
</div><script>
function setCls(o, c){ function go(){ var s = o.contentDocument && o.contentDocument.documentElement; if(s) s.setAttribute("class", "np-crop " + c); } if(o.contentDocument && o.contentDocument.readyState === "complete") go(); o.addEventListener("load", go); }
document.querySelectorAll("object.pl[data-s]").forEach(function(o){ var s = o.getAttribute("data-s"); setCls(o, "s" + s + " lt-a"); });
var IDS = ${JSON.stringify(ids)}, NAMES = ${JSON.stringify(Object.fromEntries(ids.map(id => [id, CROPS[id].vi])))}, LT = ["lt-a", "lt-b", "lt-c"];
var plots = document.getElementById("plots"), stock = document.getElementById("stock"), barn = document.getElementById("barnObj"), count = {};
var P = IDS.map(function(id, i){
  var b = document.createElement("div"); b.className = "plot"; b.setAttribute("role", "button"); b.tabIndex = 0;
  b.innerHTML = '<div class="prog"><i></i></div><object type="image/svg+xml" data="crop_' + id + '.svg"></object><span class="tap">👆</span><span class="nm">' + NAMES[id] + '</span>';
  plots.appendChild(b); var o = b.querySelector("object"), st = 1 + (i % 3), lt = LT[i % 3], p = { id: id, el: b, obj: o, stage: st, lt: lt, t: 0 };
  function paint(){ setCls(o, "s" + p.stage + " " + p.lt); b.classList.toggle("ripe", p.stage === 4); b.querySelector(".prog i").style.width = (p.stage / 4 * 100) + "%"; b.setAttribute("aria-label", NAMES[id] + (p.stage === 4 ? ": chín, chạm để thu hoạch" : ": đang lớn")); }
  p.paint = paint; paint();
  function act(){ if(p.stage === 4) harvest(p); }
  b.addEventListener("click", act); b.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); act(); } });
  return p; });
/* giả lập "bé làm đúng câu hỏi": mỗi 2,4 giây một cây lên một giai đoạn */
setInterval(function(){ P.forEach(function(p, i){ if(p.stage < 4 && (Date.now() / 2400 + i) % 1 < .5 === false){ } }); var c = P.filter(function(p){ return p.stage < 4; }); if(c.length){ var p = c[Math.floor(Math.random() * c.length)]; p.stage++; p.paint(); } }, 1400);
function updateStock(){ stock.innerHTML = IDS.filter(function(id){ return count[id]; }).map(function(id){ return '<span><img src="produce_' + id + '.svg" alt="">' + count[id] + '</span>'; }).join(""); }
function harvest(p){
  p.el.classList.remove("ripe"); p.el.classList.add("pop"); setTimeout(function(){ p.el.classList.remove("pop"); }, 420);
  var r = p.el.getBoundingClientRect(), br = barn.getBoundingClientRect(), x0 = r.left + r.width / 2 - 27, y0 = r.top + r.height * .45 - 27, x1 = br.left + br.width / 2 - 27, y1 = br.top + br.height / 2 - 27;
  var img = document.createElement("img"); img.src = "produce_" + p.id + ".svg"; img.className = "fly"; img.style.left = x0 + "px"; img.style.top = y0 + "px"; document.body.appendChild(img);
  var cols = ["#FFD24D", "#FF8FA3", "#7CE0B4", "#8FB6FF"];
  for(var k = 0; k < 8; k++){ var s = document.createElement("i"); s.className = "spark"; s.style.left = (x0 + 22) + "px"; s.style.top = (y0 + 22) + "px"; s.style.background = cols[k % 4]; document.body.appendChild(s); var a = k / 8 * Math.PI * 2; s.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: "translate(" + Math.cos(a) * 56 + "px," + Math.sin(a) * 56 + "px) scale(.2)", opacity: 0 }], { duration: 600, easing: "ease-out" }).onfinish = (function(e){ return function(){ e.remove(); }; })(s); }
  var anim = img.animate([{ transform: "translate(0,0) scale(.6)", opacity: 0 }, { transform: "translate(0,-46px) scale(1.25)", opacity: 1, offset: .22 }, { transform: "translate(" + ((x1 - x0) * .6) + "px," + ((y1 - y0) * .6 - 70) + "px) scale(1)", opacity: 1, offset: .6 }, { transform: "translate(" + (x1 - x0) + "px," + (y1 - y0) + "px) scale(.45)", opacity: .9 }], { duration: 900, easing: "cubic-bezier(.3,.7,.3,1)" });
  anim.onfinish = function(){ img.remove(); count[p.id] = (count[p.id] || 0) + 1; updateStock(); var d = barn.contentDocument && barn.contentDocument.getElementById("all"); if(d){ d.classList.remove("on"); void d.getBoundingClientRect(); d.classList.add("on"); }
    var t = document.createElement("div"); t.className = "plus"; t.textContent = "+1"; t.style.left = (x1 + 10) + "px"; t.style.top = (y1 - 4) + "px"; document.body.appendChild(t); t.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-34px)", opacity: 0 }], { duration: 800 }).onfinish = function(){ t.remove(); }; };
  p.stage = 1; setTimeout(function(){ p.paint(); }, 260);
}
</script></body></html>
`;
fs.writeFileSync(path.join(out, "preview-crops.html"), html);
console.log("✓ đã sinh " + Object.keys(files).length + " tranh (cây, nông sản, kho) + trang duyệt preview-crops.html");
