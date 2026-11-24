/* Sinh LINH VẬT cho 8 cây trồng mới của Vườn Học Vui (gói G4): cải xanh, dưa leo, bí đỏ, khoai tây, cải bắp, hành tím, lúa nước, đậu.
   Phong cách POP "đồ chơi mềm" (docs/MASCOT-ART-RULES.md): viewBox 256, chỉ path/circle/ellipse/g/gradient, không filter/mask/image/chữ,
   màu qua biến CSS, không viền đen (viền = màu thân đậm), mắt to có 2 điểm sáng, má hồng, hoạt ảnh npa-* (nhún + chớp mắt), tắt khi prefers-reduced-motion.
   Mỗi cây MỘT thân dùng cho cả hai bộ tranh:
     1) mascot_<id>_l1..l4[_cheer].svg  : linh vật trong popup cây (cấp 1 trơn, cấp 2 + khăn đỏ, cấp 3 + huy chương, cấp 4 + vương miện, "_cheer" = reo mừng khi chín)
     2) kho/mascot_<id>.svg             : linh vật trong kho nông sản (có tay + đạo cụ môn: Toán khối +, Tiếng Việt quyển sách, Tiếng Anh cờ nhỏ)
   Chạy: node scripts/learn/gen-crop-mascots-g.js  (không sửa tay tệp sinh ra) + trang duyệt shared/art/garden/preview-crop-mascots-g.html. */
"use strict";
const fs = require("fs"), path = require("path");
const out = path.join(__dirname, "../../shared/art/garden"), kho = path.join(out, "kho");
fs.mkdirSync(kho, { recursive: true });
const INK = "#2A2350";
const leaf = d => `<path d="${d}" fill="url(#GL)" stroke="var(--l3)" stroke-width="3" stroke-linejoin="round"/>`;
const gloss = (x, y, rx, ry, rot) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".5" transform="rotate(${rot} ${x} ${y})"/>`;
const body = d => `<path d="${d}" fill="url(#GB)" stroke="var(--st)" stroke-width="3.5" stroke-linejoin="round"/>`;
const line = (d, c, w, o) => `<path d="${d}" fill="none" stroke="${c || "var(--st)"}" stroke-width="${w || 3}" stroke-linecap="round"${o ? ` opacity="${o}"` : ""}/>`;
const dots = (pts, r, o) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--st)" opacity="${o || .5}"/>`).join("");
const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * .38}" cy="${y - r * .38}" r="${r * .38}" fill="#fff"/><circle cx="${x - r * .35}" cy="${y + r * .38}" r="${r * .19}" fill="#fff" opacity=".9"/>`;
const smile = `<path d="M-10 12Q0 22 10 12" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`;
const grin = `<path d="M-11 10Q0 34 11 10Z" fill="#7A2230" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-5 22Q0 28 5 22" fill="#FF7A8A"/>`;
/* khuôn mặt chữ ký của loạt cây này: mắt tròn hai điểm sáng + má hồng + miệng; mỗi cây thêm MỘT nét riêng (x) ghi trong <desc> */
const face = (fx, fy, fs, cheer, x) => `<g id="face" transform="translate(${fx} ${fy}) scale(${fs})"><g class="npa-blink">${eye(-26, 0, 12.5)}${eye(26, 0, 12.5)}</g><ellipse cx="-46" cy="18" rx="9" ry="6" fill="var(--bl)" opacity=".75"/><ellipse cx="46" cy="18" rx="9" ry="6" fill="var(--bl)" opacity=".75"/>${cheer ? grin : smile}${x || ""}</g>`;

/* ---------- thân của 8 cây ---------- */
const C = {};
C.bokchoy = { vi: "Cải Xanh", mark: "hai chân mày nhướn vui + búi lá xanh bung như mái tóc", subj: "tviet", f: [128, 156, 1], sc: [128, 190, 66], md: [166, 214], cr: [128, 78], sp: [[48, 96], [210, 112]],
  v: "--c1:#FFFFFF;--c2:#D4EBC2;--st:#8DB07A;--bl:#FF9DB0;--l1:#7EE08F;--l2:#34B461;--l3:#1F7F43",
  x: `<path d="M-38 -26Q-26 -34 -14 -26M14 -26Q26 -34 38 -26" fill="none" stroke="var(--st)" stroke-width="4" stroke-linecap="round"/>`,
  b: () => leaf("M128 90C96 80 70 46 84 14C112 20 134 52 128 90Z") + leaf("M128 90C160 80 186 46 172 14C144 20 122 52 128 90Z") + leaf("M128 84C112 60 114 28 128 6C142 28 144 60 128 84Z") +
    body("M128 76C66 74 46 130 54 178C62 222 100 238 128 238C156 238 194 222 202 178C210 130 190 74 128 76Z") + line("M84 112Q78 150 86 196M172 112Q178 150 170 196", "var(--st)", 3, .35) + gloss(92, 120, 12, 24, 8) };
C.cucumber = { vi: "Dưa Leo", mark: "nốt gai li ti trên thân + hoa vàng nhỏ cài đỉnh đầu", subj: "toan", f: [128, 130, .92], sc: [128, 178, 54], md: [158, 204], cr: [128, 36], sp: [[44, 70], [212, 100]],
  v: "--c1:#9BE37A;--c2:#3FB65A;--st:#217A3A;--bl:#FF9DB0;--l1:#B8F08F;--l2:#5CCB6A;--l3:#217A3A",
  x: dots([[-44, -10], [44, -10]], 2.2, .5),
  b: () => `<path d="M128 40Q130 26 144 22" fill="none" stroke="var(--l3)" stroke-width="6" stroke-linecap="round"/><g transform="translate(148 24)">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-8" rx="6" ry="9" fill="#FFD84A" stroke="#C99700" stroke-width="2" transform="rotate(${a})"/>`).join("")}<circle r="5" fill="#FF9F1C"/></g>` +
    body("M128 46C80 46 62 84 62 130C62 190 82 238 128 238C174 238 194 190 194 130C194 84 176 46 128 46Z") +
    dots([[84, 176], [100, 208], [156, 208], [172, 176], [90, 92], [166, 92], [128, 214], [76, 140], [180, 140]], 2.6, .5) + line("M92 70Q86 120 90 180", "#fff", 9, .35) + line("M180 214Q206 220 214 196Q220 176 202 176", "var(--l3)", 4) };
C.pumpkin = { vi: "Bí Đỏ", mark: "đường vân múi bí dọc thân + râu xoắn xanh cạnh cuống", subj: "tanh", f: [128, 152, 1.1], sc: [128, 196, 70], md: [170, 214], cr: [128, 74], sp: [[40, 100], [216, 110]],
  v: "--c1:#FFB45A;--c2:#F2701C;--st:#B84E0E;--bl:#FF8F7A;--l1:#7BE08A;--l2:#2FAE5B;--l3:#1F7F43",
  x: "",
  b: () => `<path d="M128 84Q124 60 134 44" fill="none" stroke="#7A5428" stroke-width="12" stroke-linecap="round"/><path d="M128 84Q124 60 134 44" fill="none" stroke="#A4743A" stroke-width="6" stroke-linecap="round"/>` +
    leaf("M140 56C156 34 190 36 202 52C186 72 160 74 140 56Z") + line("M142 50Q124 30 108 40Q96 48 104 58", "var(--l3)", 4) +
    `<ellipse cx="128" cy="154" rx="96" ry="78" fill="url(#GB)" stroke="var(--st)" stroke-width="3.5"/>` + line("M112 80C80 110 80 200 112 230M144 80C176 110 176 200 144 230M84 94C48 124 52 190 84 218M172 94C208 124 204 190 172 218", "var(--st)", 3.5, .45) + gloss(82, 118, 14, 24, 20) };
C.potato = { vi: "Khoai Tây", mark: "đốm mắt khoai nâu li ti + mầm xanh nhỏ nhú trên đầu", subj: "toan", f: [128, 154, 1], sc: [128, 196, 64], md: [164, 214], cr: [128, 70], sp: [[44, 100], [212, 108]],
  v: "--c1:#EBC28A;--c2:#C28A4C;--st:#7A4F22;--bl:#FF9D8A;--l1:#9BE88A;--l2:#34B461;--l3:#1F7F43",
  x: "",
  b: () => `<path d="M128 80Q126 62 120 52" fill="none" stroke="var(--l3)" stroke-width="5" stroke-linecap="round"/>` + leaf("M120 56C104 54 94 42 96 28C112 28 122 38 120 56Z") + leaf("M122 56C138 52 150 42 150 28C134 26 122 38 122 56Z") +
    body("M104 80C66 84 38 126 48 176C58 222 96 238 140 234C186 230 214 196 208 148C202 104 164 72 128 78C118 78 110 79 104 80Z") + dots([[78, 168], [168, 112], [186, 190], [96, 214], [148, 218], [70, 122]], 3.4, .55) + gloss(84, 114, 16, 9, -34) };
C.cabbage = { vi: "Cải Bắp", mark: "nếp lá cuộn tròn quanh mặt + hai lá ngoài như đôi tay ôm", subj: "tviet", f: [128, 142, 1.05], sc: [128, 198, 68], md: [168, 216], cr: [128, 62], sp: [[42, 90], [214, 96]],
  v: "--c1:#C8F29A;--c2:#5FC25E;--st:#2E8A3E;--bl:#FF9DB0;--l1:#E1FAC2;--l2:#8FDC7A;--l3:#2E8A3E",
  x: "",
  b: () => leaf("M128 232C60 236 30 190 40 140C74 150 108 186 128 232Z") + leaf("M128 232C196 236 226 190 216 140C182 150 148 186 128 232Z") +
    `<circle cx="128" cy="142" r="88" fill="url(#GB)" stroke="var(--st)" stroke-width="3.5"/>` + line("M60 104Q92 70 128 70Q164 70 196 104M52 150Q60 112 96 94M204 150Q196 112 160 94M128 70Q112 84 106 108", "var(--st)", 3, .45) + gloss(88, 100, 16, 9, -30) };
C.onion = { vi: "Hành Tím", mark: "ngọn hành xanh nhọn trên đỉnh + chùm rễ trắng nhỏ dưới chân", subj: "tanh", f: [128, 166, 1], sc: [128, 206, 60], md: [160, 220], cr: [128, 84], sp: [[48, 110], [210, 120]],
  v: "--c1:#E9B8F0;--c2:#A24FC4;--st:#6E2A8E;--bl:#FF8FB5;--l1:#9BE88A;--l2:#34B461;--l3:#1F7F43",
  x: "",
  b: () => `<path d="M118 90C112 64 116 38 124 16C128 38 134 64 138 90Z" fill="url(#GL)" stroke="var(--l3)" stroke-width="3" stroke-linejoin="round"/><path d="M134 92C142 70 156 52 172 44C168 66 158 84 142 98Z" fill="url(#GL)" stroke="var(--l3)" stroke-width="3" stroke-linejoin="round"/>` +
    line("M104 238Q98 250 90 252M128 240Q128 252 126 254M152 238Q158 250 166 252", "#E8DCCB", 4) +
    body("M128 70C122 98 58 108 54 168C52 214 90 240 128 240C166 240 204 214 202 168C198 108 134 98 128 70Z") + line("M94 118Q70 160 90 224M162 118Q186 160 166 224", "var(--st)", 3, .4) + gloss(92, 140, 12, 26, 12) };
C.rice = { vi: "Lúa Nước", mark: "bông lúa cong rủ trên đầu + chân mày cong cười hiền", subj: "tviet", f: [128, 156, 1], sc: [128, 198, 58], md: [160, 214], cr: [128, 92], sp: [[44, 112], [212, 116]],
  v: "--c1:#FFE98A;--c2:#F2B52E;--st:#B98410;--bl:#FF9D7A;--l1:#C6F08A;--l2:#7DC54A;--l3:#4F8F2A",
  x: `<path d="M-40 -24Q-26 -36 -12 -24M12 -24Q26 -36 40 -24" fill="none" stroke="var(--st)" stroke-width="4" stroke-linecap="round"/>`,
  b: () => ["M128 84C120 60 100 40 78 40", "M128 84C128 52 140 30 160 22", "M128 84C140 62 168 54 190 62"].map((d, i) => `<path d="${d}" fill="none" stroke="var(--l3)" stroke-width="4" stroke-linecap="round"/>` +
      [0, 1, 2, 3].map(k => { const p = [[[110, 46], [96, 40], [82, 40], [70, 46]], [[134, 38], [142, 30], [152, 24], [160, 24]], [[146, 62], [160, 58], [174, 58], [186, 64]]][i][k]; return `<ellipse cx="${p[0]}" cy="${p[1]}" rx="6.5" ry="10" fill="#FFD04D" stroke="var(--st)" stroke-width="2.2" transform="rotate(${[-60, 30, 70][i]} ${p[0]} ${p[1]})"/>`; }).join("")).join("") +
    body("M128 76C70 76 50 132 56 178C62 220 98 238 128 238C158 238 194 220 200 178C206 132 186 76 128 76Z") + line("M86 112Q80 160 90 210M170 112Q176 160 166 210", "var(--st)", 3, .35) + gloss(92, 112, 12, 22, 8) };
C.bean = { vi: "Đậu Đậu", mark: "vạch chỉ dọc vỏ quả + một râu xoắn nhỏ trên đầu", subj: "toan", f: [128, 148, .95], sc: [128, 194, 62], md: [168, 212], cr: [128, 64], sp: [[44, 96], [212, 100]],
  v: "--c1:#B5F08A;--c2:#4FBF4A;--st:#2A8A32;--bl:#FF9DB0;--l1:#B5F08A;--l2:#4FBF4A;--l3:#1F7F43",
  x: "",
  b: () => line("M138 58Q150 34 172 38Q188 42 180 58Q174 66 164 60", "var(--l3)", 4) + leaf("M104 62C86 40 62 38 52 50C62 68 88 74 104 62Z") +
    body("M128 54C74 54 44 100 52 156C60 214 96 240 128 240C160 240 196 214 204 156C212 100 182 54 128 54Z") + line("M98 78Q70 120 76 190", "var(--st)", 3.5, .5) + dots([[92, 214], [128, 224], [164, 214]], 6, .28) + gloss(86, 106, 12, 24, 14) };

/* ---------- ghép tranh ---------- */
const defs = id => `<defs><linearGradient id="GB-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--c1)"/><stop offset="1" stop-color="var(--c2)"/></linearGradient><linearGradient id="GL-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--l1)"/><stop offset="1" stop-color="var(--l2)"/></linearGradient></defs>`;
const style = v => `<style>.np-mascot{--ink:${INK};${v}}.npa{transform-box:fill-box;transform-origin:50% 100%}.npa-bob{animation:npa-bob 2.4s ease-in-out infinite}.npa-blink{transform-box:fill-box;transform-origin:50% 50%;animation:npa-blink 4.2s infinite}@keyframes npa-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes npa-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.12)}}:root.np-playing .npa,:root.np-playing .npa-blink{animation:none}@media (prefers-reduced-motion:reduce){.npa,.npa-blink{animation:none}}</style>`;
const uniq = (s, id) => s.replace(/url\(#G([BL])\)/g, `url(#G$1-${id})`);
const spark = (x, y) => `<path d="M${x} ${y - 9}L${x + 3} ${y - 3}L${x + 9} ${y}L${x + 3} ${y + 3}L${x} ${y + 9}L${x - 3} ${y + 3}L${x - 9} ${y}L${x - 3} ${y - 3}Z" fill="#FFE27A"/>`;
function acc(c, lvl) {
  let s = "";
  if (lvl >= 2) { const [x, y, w] = c.sc; s += `<g id="acc-scarf"><path d="M${x - w} ${y}Q${x} ${y + 18} ${x + w} ${y}" fill="none" stroke="#9E1B28" stroke-width="15" stroke-linecap="round"/><path d="M${x - w} ${y}Q${x} ${y + 18} ${x + w} ${y}" fill="none" stroke="#E5484D" stroke-width="10" stroke-linecap="round"/><path d="M${x + w * .55} ${y + 8}l9 28l-15 -2z" fill="#E5484D" stroke="#9E1B28" stroke-width="2.6" stroke-linejoin="round"/></g>`; }
  if (lvl >= 3) { const [x, y] = c.md; s += `<g id="acc-medal" transform="translate(${x} ${y})"><path d="M-8 -14L-14 -32M8 -14L14 -32" stroke="#3B82F6" stroke-width="8" stroke-linecap="round"/><circle r="13" fill="#FFD24D" stroke="#C9840F" stroke-width="3"/><path d="M0 -7L2.4 -2L8 -1.4L4 2.4L5 8L0 5.4L-5 8L-4 2.4L-8 -1.4L-2.4 -2Z" fill="#fff" stroke="#C9840F" stroke-width="1.4" stroke-linejoin="round"/></g>`; }
  if (lvl >= 4) { const [x, y] = c.cr; s += `<g id="acc-crown" transform="translate(${x} ${y})"><path d="M-24 0L-24 -20L-12 -8L0 -26L12 -8L24 -20L24 0Z" fill="#FFD24D" stroke="#C9840F" stroke-width="3.4" stroke-linejoin="round"/><circle cx="0" cy="-26" r="3.6" fill="#E5484D"/><circle cx="-24" cy="-20" r="3" fill="#3B82F6"/><circle cx="24" cy="-20" r="3" fill="#34D399"/></g>` + c.sp.map(([a, b]) => spark(a, b)).join(""); }
  return s;
}
const NAMES = ["", "cấp 1 trơn", "cấp 2 khăn đỏ", "cấp 3 huy chương", "cấp 4 vương miện"];
function levelSvg(id, c, lvl, cheer) {
  const [fx, fy, fs] = c.f;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${c.vi} (linh vật ${NAMES[lvl]}${cheer ? ", reo mừng" : ""})" class="np-mascot sk-l${lvl} em-${cheer ? "cheer" : "happy"}" data-style="pop" data-game="garden-crop-${id}" data-level="${lvl}">
<title>${c.vi} (linh vật ${NAMES[lvl]})</title><desc>Chữ ký khuôn mặt: mắt tròn hai điểm sáng, má hồng; riêng ${c.vi}: ${c.mark}. Mỗi cấp thêm một thứ: khăn đỏ, huy chương, vương miện.</desc>${style(c.v)}${defs(id)}
<ellipse cx="128" cy="246" rx="64" ry="7" fill="#000" opacity=".14"/><g id="all" class="npa npa-bob">${uniq(c.b(), id)}${face(fx, fy, fs, cheer, c.x)}${acc(c, lvl)}</g>
</svg>
`;
}
const PROP = {
  toan: `<g id="prop"><rect x="184" y="148" width="44" height="44" rx="12" fill="#7C5CFF" stroke="#4B33B5" stroke-width="3"/><path d="M206 158V182M194 170H218" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>`,
  tviet: `<g id="prop"><rect x="182" y="152" width="46" height="38" rx="8" fill="#38BDF8" stroke="#0B76B5" stroke-width="3"/><rect x="188" y="158" width="34" height="26" rx="4" fill="#fff"/><path d="M194 166H216M194 173H210M194 180H214" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/></g>`,
  tanh: `<g id="prop"><path d="M204 200V132" stroke="#8A5A2B" stroke-width="5" stroke-linecap="round"/><path d="M206 134H238L230 146L238 158H206Z" fill="#fff" stroke="#C73E33" stroke-width="3" stroke-linejoin="round"/><path d="M206 140H236M206 152H236" stroke="#E5484D" stroke-width="4"/></g>`
};
function khoSvg(id, c) {
  const [fx, fy, fs] = c.f, arms = `<ellipse cx="54" cy="196" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/><ellipse cx="200" cy="196" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${c.vi}" class="np-mascot sk-default" data-style="pop" data-game="garden-crop-${id}">
<title>${c.vi}</title><desc>Linh vật ${c.vi} (phong cách Pop) trong kho nông sản. Chữ ký khuôn mặt: ${c.mark}. Đạo cụ nhận diện môn: ${{ toan: "khối +", tviet: "quyển sách", tanh: "cờ nhỏ" }[c.subj]}.</desc>${style(c.v)}${defs(id)}
<ellipse cx="128" cy="246" rx="64" ry="7" fill="#000" opacity=".14"/><g id="all" class="npa npa-bob">${uniq(c.b(), id)}${arms}${face(fx, fy, fs, true, c.x)}${PROP[c.subj]}</g>
</svg>
`;
}
let n = 0;
for (const id of Object.keys(C)) {
  fs.writeFileSync(path.join(kho, `mascot_${id}.svg`), khoSvg(id, C[id])); n++;
  for (let l = 1; l <= 4; l++) for (const ch of [0, 1]) { fs.writeFileSync(path.join(out, `mascot_${id}_l${l}${ch ? "_cheer" : ""}.svg`), levelSvg(id, C[id], l, !!ch)); n++; }
}
const rows = Object.keys(C).map(id => `<tr><td class="nm">${C[id].vi}</td>${[1, 2, 3, 4].map(l => `<td><img data-id="${id}" data-l="${l}" src="mascot_${id}_l${l}.svg" alt="${C[id].vi} cấp ${l}"></td>`).join("")}<td><img src="kho/mascot_${id}.svg" alt="${C[id].vi} trong kho"></td></tr>`).join("");
fs.writeFileSync(path.join(out, "preview-crop-mascots-g.html"), `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Linh vật 8 cây mới: bản duyệt</title>
<style>body{margin:0;background:#F6F4F1;color:#1d1a33;font:16px/1.5 system-ui,sans-serif}.w{max-width:1100px;margin:0 auto;padding:18px 14px 50px}h1{font-size:28px;margin:0 0 6px}table{width:100%;border-collapse:separate;border-spacing:8px}th{font-size:14px;color:#4B3FA0}td{background:#fff;border:2px solid #E3DDEF;border-radius:20px;padding:8px;text-align:center}td.nm{font-weight:900;width:110px;background:#F2EEFA}td img{width:100%;max-width:140px;display:block;margin:0 auto}button{min-height:44px;padding:0 18px;border-radius:99px;border:2px solid #D6CFEA;background:#fff;font:800 15px system-ui;cursor:pointer;margin:0 6px 10px 0}@media(max-width:700px){td img{max-width:70px}td.nm{width:auto}}</style></head><body><div class="w"><h1>Linh vật 8 cây trồng mới (gói G4)</h1>
<p>Cấp 1 trơn, cấp 2 khăn đỏ, cấp 3 huy chương, cấp 4 vương miện. Cột cuối: linh vật trong kho nông sản.</p><button data-c="">Vui</button><button data-c="_cheer">Reo mừng</button>
<table><thead><tr><th></th><th>Cấp 1</th><th>Cấp 2</th><th>Cấp 3</th><th>Cấp 4</th><th>Kho</th></tr></thead><tbody>${rows}</tbody></table></div>
<script>document.querySelectorAll("button").forEach(function(b){b.onclick=function(){document.querySelectorAll("td img[data-id]").forEach(function(i){i.src="mascot_"+i.dataset.id+"_l"+i.dataset.l+b.dataset.c+".svg"})}})</script></body></html>
`);
console.log("✓ " + n + " tranh (8 cây × (4 cấp × 2 cảm xúc + 1 kho)) → shared/art/garden/mascot_<id>_l1..l4[_cheer].svg, kho/mascot_<id>.svg, preview-crop-mascots-g.html");
