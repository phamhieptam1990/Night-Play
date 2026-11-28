/* Sinh BỘ LINH VẬT TRÁI CÂY / RAU CỦ cho Kho nông sản (10 con) và Ao cá (1 con: Sen Sen), phong cách POP "đồ chơi mềm"
   theo docs/MASCOT-ART-RULES.md: viewBox 256, chỉ path/circle/ellipse/rect/g/gradient, không filter/image, màu qua biến CSS,
   không viền đen (viền = màu thân đậm), mắt to có 2 điểm sáng, má hồng, đầu ≈ cả thân (nhân vật là trái/củ), hoạt ảnh npa-* (nhún + chớp mắt).
   Mỗi con: CHỮ KÝ KHUÔN MẶT riêng (ghi trong <desc>) + ĐẠO CỤ nhận diện môn (Toán: khối +, Tiếng Việt: quyển sách, Tiếng Anh: cờ nhỏ; Sen Sen: vở + bút chì).
   Chạy: node scripts/learn/gen-kho-mascots.js → shared/art/garden/kho/mascot_<id>.svg, shared/art/garden/ao/mascot.svg, preview-kho-mascots.html (trang duyệt).
   Đây là bản MẪU CHỜ DUYỆT (chỉ skin Mặc định; 4 skin trả phí làm sau khi chủ site duyệt dáng). */
"use strict";
const fs = require("fs"), path = require("path");
/* Trang preview đã gỡ (nhẹ code): không ghi preview*.html. */
const _ws = require("fs").writeFileSync; require("fs").writeFileSync = function (p) { return /preview[^\/\\]*\.html$/.test(String(p)) ? undefined : _ws.apply(this, arguments); };
const root = path.join(__dirname, "../../shared/art/garden");
const f = n => Math.round(n * 10) / 10;

/* ---------- khối dùng chung ---------- */
const eye = (x, y) => `<circle cx="${x}" cy="${y}" r="14" fill="var(--ink)"/><circle cx="${x + 5}" cy="${y - 5.5}" r="5.2" fill="#fff"/><circle cx="${x - 4.5}" cy="${y + 5}" r="2.6" fill="#fff" opacity=".9"/>`;
/* mỗi con một kiểu mắt/miệng nhỏ khác nhau (chữ ký) nhưng cùng bộ khung: eyes (100,116) (156,116), miệng (128,148) */
const mouthOpen = `<path d="M110 143Q128 172 146 143Q128 150 110 143Z" fill="#8A2B3A" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/><ellipse cx="128" cy="157" rx="9" ry="5" fill="#FF8FA3"/>`;
const mouthSmile = `<path d="M112 146Q128 164 144 146" fill="none" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round"/>`;
const mouthCat = `<path d="M110 146Q119 158 128 148Q137 158 146 146" fill="none" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
const blush = (dx = 0) => `<ellipse cx="${78 + dx}" cy="140" rx="11" ry="7" fill="var(--bl)" opacity=".75"/><ellipse cx="${178 - dx}" cy="140" rx="11" ry="7" fill="var(--bl)" opacity=".75"/>`;
const brow = (x, y, rot) => `<path d="M${x - 11} ${y}Q${x} ${y - 7} ${x + 11} ${y}" fill="none" stroke="var(--st)" stroke-width="4" stroke-linecap="round" transform="rotate(${rot} ${x} ${y})"/>`;
const gloss = (cx, cy, rx, ry, rot) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".5" transform="rotate(${rot} ${cx} ${cy})"/>`;
const leaf = (d, fill = "url(#GL)") => `<path d="${d}" fill="${fill}" stroke="var(--lst)" stroke-width="3" stroke-linejoin="round"/>`;
const arms = `<ellipse cx="62" cy="190" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/><ellipse cx="194" cy="190" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/>`;

/* ĐẠO CỤ nhận diện môn, nằm ở tay phải (neo 196,190) */
const PROPS = {
  toan: `<g id="prop"><rect x="186" y="150" width="44" height="44" rx="12" fill="#7C5CFF" stroke="#4B33B5" stroke-width="3"/><path d="M208 160V184M196 172H220" stroke="#fff" stroke-width="7" stroke-linecap="round"/><ellipse cx="194" cy="190" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/></g>`,
  tviet: `<g id="prop"><rect x="184" y="156" width="46" height="38" rx="8" fill="#38BDF8" stroke="#0B76B5" stroke-width="3"/><rect x="190" y="162" width="34" height="26" rx="4" fill="#fff"/><path d="M196 170H218M196 177H212M196 184H216" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/><ellipse cx="194" cy="190" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/></g>`,
  tanh: `<g id="prop"><path d="M204 206V138" stroke="#8A5A2B" stroke-width="5" stroke-linecap="round"/><path d="M206 140H238L230 152L238 164H206Z" fill="#fff" stroke="#C73E33" stroke-width="3" stroke-linejoin="round"/><path d="M206 146H236M206 158H236" stroke="#E5484D" stroke-width="4"/><rect x="206" y="140" width="12" height="24" fill="#3B6FE0"/><ellipse cx="200" cy="192" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/></g>`,
  vo: `<g id="prop"><rect x="184" y="158" width="42" height="36" rx="7" fill="#FFE9A8" stroke="#C9942A" stroke-width="3"/><path d="M192 168H218M192 176H214M192 184H210" stroke="#E0B24A" stroke-width="3" stroke-linecap="round"/><g transform="rotate(32 226 160)"><rect x="220" y="136" width="10" height="44" rx="3" fill="#FFC83D" stroke="#C9942A" stroke-width="2.5"/><path d="M220 136L225 124L230 136Z" fill="#F4C9A0" stroke="#C9942A" stroke-width="2"/><path d="M223 128L225 124L227 128Z" fill="#2A2350"/></g><ellipse cx="194" cy="192" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/></g>`
};

/* ---------- 11 nhân vật ---------- */
const M = {
  carrot: { vi: "Cà Rốt", prop: "toan", mark: "ba túm lá xanh như tóc mohican + hai chân mày nhướn lên vui", vars: "--c1:#FFB04D;--c2:#F2701C;--st:#C75A12;--bl:#FF8F7A;--l1:#7BE08A;--l2:#2FAE5B;--lst:#1F7F43",
    body: () => leaf("M128 62C108 52 94 28 102 12C118 18 126 38 128 62Z") + leaf("M128 62C148 52 162 28 154 12C138 18 130 38 128 62Z") + leaf("M128 66C118 46 120 22 128 8C136 22 138 46 128 66Z") +
      `<path d="M128 62C70 60 50 108 66 152C82 198 112 232 128 238C144 232 174 198 190 152C206 108 186 60 128 62Z" fill="url(#GB)" stroke="var(--st)" stroke-width="3" stroke-linejoin="round"/><path d="M70 120Q82 118 90 124M166 124Q174 118 186 120M84 176Q96 172 104 178M152 178Q160 172 172 176" stroke="var(--st)" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".55"/>` + gloss(98, 92, 16, 9, -28),
    face: () => brow(100, 96, -12) + brow(156, 96, 12) + eye(100, 116) + eye(156, 116) + blush() + mouthOpen },
  tomato: { vi: "Cà Chua", prop: "tanh", mark: "nốt tàn nhang ba chấm trên má trái + một lọn lá xoăn trên đỉnh", vars: "--c1:#FF7A66;--c2:#E5382B;--st:#B02418;--bl:#FF9DB0;--l1:#7BE08A;--l2:#2FAE5B;--lst:#1F7F43",
    body: () => `<ellipse cx="128" cy="144" rx="94" ry="86" fill="url(#GB)" stroke="var(--st)" stroke-width="3"/>` + leaf("M128 66L112 52L96 64L108 74L98 90L118 82L128 96L138 82L158 90L148 74L160 64L144 52Z") + `<path d="M128 66Q128 46 144 38Q156 34 160 42" fill="none" stroke="var(--lst)" stroke-width="5" stroke-linecap="round"/><path d="M150 40Q166 30 168 46" fill="none" stroke="var(--l2)" stroke-width="4" stroke-linecap="round"/>` + gloss(88, 110, 18, 10, -30),
    face: () => eye(100, 120) + eye(156, 120) + blush() + `<circle cx="72" cy="150" r="2.6" fill="var(--st)" opacity=".6"/><circle cx="82" cy="156" r="2.6" fill="var(--st)" opacity=".6"/><circle cx="68" cy="160" r="2.6" fill="var(--st)" opacity=".6"/>` + mouthSmile.replace("112 146Q128 164 144 146", "108 150Q128 172 148 150") },
  strawberry: { vi: "Dâu Dâu", prop: "tanh", mark: "hạt dâu vàng nhỏ khắp thân + miệng chữ ω (mèo con) + nơ lá xanh", vars: "--c1:#FF7A95;--c2:#E0334F;--st:#B01E3B;--bl:#FFB6C8;--l1:#7BE08A;--l2:#2FAE5B;--lst:#1F7F43",
    body: () => `<path d="M128 234C72 208 44 150 52 108C60 70 98 64 128 82C158 64 196 70 204 108C212 150 184 208 128 234Z" fill="url(#GB)" stroke="var(--st)" stroke-width="3" stroke-linejoin="round"/>` +
      [[70, 180], [90, 206], [112, 196], [146, 196], [168, 206], [186, 180], [160, 172], [96, 172], [128, 214], [64, 150], [192, 150], [128, 186]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="5.6" fill="#FFE27A" stroke="var(--st)" stroke-width="1.5" opacity=".95"/>`).join("") +
      leaf("M128 84L106 62L84 70L100 84L84 98L110 92L128 100L146 92L172 98L156 84L172 70L150 62Z") + gloss(92, 104, 16, 9, -30),
    face: () => eye(100, 124) + eye(156, 124) + blush() + mouthCat.replace(/M110 146/, "M110 152").replace(/Q119 158 128 148Q137 158 146 146/, "Q119 164 128 154Q137 164 146 152") },
  wheat: { vi: "Bông Lúa", prop: "tviet", mark: "ba bông lúa như chỏm tóc + một dải nơ đỏ ở bụng + mắt cười cong", vars: "--c1:#FFDD7A;--c2:#F2A91E;--st:#C98410;--bl:#FF9D7A;--l1:#FFE9A8;--l2:#E8B440;--lst:#B8860B",
    body: () => [-26, 0, 26].map((a, i) => `<g transform="rotate(${a} 128 74)">` + Array.from({ length: 5 }, (_, k) => `<ellipse cx="${i === 1 ? 128 : 128}" cy="${52 - k * 11 + 18}" rx="6.5" ry="10" fill="#FFD04D" stroke="#C98410" stroke-width="2.2" transform="rotate(${k % 2 ? 14 : -14} 128 ${52 - k * 11 + 18})"/>`).join("") + `<path d="M128 8V36" stroke="#C98410" stroke-width="3" stroke-linecap="round"/></g>`).join("") +
      `<ellipse cx="128" cy="150" rx="76" ry="88" fill="url(#GB)" stroke="var(--st)" stroke-width="3"/><path d="M66 188Q128 210 190 188V206Q128 228 66 206Z" fill="#E5484D" stroke="#B02418" stroke-width="3" stroke-linejoin="round"/>` + gloss(98, 100, 16, 9, -28),
    face: () => `<path d="M88 118Q100 102 112 118M144 118Q156 102 168 118" fill="none" stroke="var(--ink)" stroke-width="5.5" stroke-linecap="round"/>` + blush() + mouthOpen },
  corn: { vi: "Bắp Bắp", prop: "toan", mark: "hai lọn râu bắp rủ hai bên + mắt tròn lấp lánh + nụ cười hở răng", vars: "--c1:#FFE97A;--c2:#F5B800;--st:#C98C00;--bl:#FF9D7A;--l1:#9BE88A;--l2:#34B461;--lst:#1F7F43",
    body: () => `<path d="M104 58Q96 30 84 18M128 54Q128 26 128 10M152 58Q160 30 172 18" fill="none" stroke="#E8B440" stroke-width="5" stroke-linecap="round"/><ellipse cx="128" cy="148" rx="72" ry="92" fill="url(#GB)" stroke="var(--st)" stroke-width="3"/>` +
      Array.from({ length: 4 }, (_, r) => Array.from({ length: 5 }, (_, c) => `<ellipse cx="${82 + c * 23}" cy="${168 + r * 15}" rx="8.5" ry="6.5" fill="#FFF3A8" stroke="var(--st)" stroke-width="1.6" opacity=".95"/>`).join("")).join("") +
      leaf("M128 238C78 232 52 200 56 160C86 180 112 204 128 238Z") + leaf("M128 238C178 232 204 200 200 160C170 180 144 204 128 238Z") + gloss(96, 84, 14, 8, -28),
    face: () => eye(104, 112) + eye(152, 112) + blush(6) + `<path d="M108 138Q128 158 148 138Z" fill="#fff" stroke="var(--ink)" stroke-width="3.5" stroke-linejoin="round"/>` },
  sunflower: { vi: "Hướng Dương", prop: "tviet", mark: "vành cánh hoa như bờm sư tử + hai chân mày nhướn ngạc nhiên + nhụy nâu có hạt", vars: "--c1:#FFE066;--c2:#FFB400;--st:#C98300;--bl:#FF9D7A;--l1:#7BE08A;--l2:#2FAE5B;--lst:#1F7F43;--d1:#F2B65E;--d2:#C98B3C",
    body: () => leaf("M92 226C60 224 44 204 48 184C74 190 90 206 92 226Z") + leaf("M164 226C196 224 212 204 208 184C182 190 166 206 164 226Z") + `<path d="M128 214V240" stroke="var(--lst)" stroke-width="9" stroke-linecap="round"/>` +
      Array.from({ length: 14 }, (_, i) => `<ellipse cx="128" cy="40" rx="17" ry="32" fill="url(#GB)" stroke="var(--st)" stroke-width="2.6" transform="rotate(${i * 360 / 14} 128 128)"/>`).join("") +
      `<circle cx="128" cy="128" r="68" fill="url(#GD)" stroke="#8A5A2B" stroke-width="3.2"/>` + [[78, 164], [96, 184], [128, 192], [160, 184], [178, 164], [70, 124], [186, 124]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="#8A5A2B" opacity=".6"/>`).join(""),
    face: () => brow(100, 92, 8) + brow(156, 92, -8) + eye(100, 114) + eye(156, 114) + blush(-2) + `<ellipse cx="128" cy="150" rx="11" ry="9" fill="#8A2B3A" stroke="var(--ink)" stroke-width="3"/><ellipse cx="128" cy="154" rx="6" ry="3.5" fill="#FF8FA3"/>`, grads: `<radialGradient id="GD" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="var(--d1)"/><stop offset="1" stop-color="var(--d2)"/></radialGradient>` },
  mango: { vi: "Xoài Ngọt", prop: "toan", mark: "má lúm đồng tiền bên phải + một lá xoài dài nghiêng + mắt lấp lánh nghiêng nhẹ", vars: "--c1:#FFD95A;--c2:#FF9A3C;--st:#D9701A;--bl:#FF8F7A;--l1:#7BE08A;--l2:#2FAE5B;--lst:#1F7F43",
    body: () => `<path d="M128 70Q128 52 140 44" fill="none" stroke="#8A5A2B" stroke-width="7" stroke-linecap="round"/>` + leaf("M140 46C150 20 184 14 204 30C190 52 164 58 140 46Z") + `<path d="M144 44Q172 34 198 30" fill="none" stroke="var(--lst)" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="M122 66C70 62 44 110 54 156C64 204 104 236 140 232C186 226 214 178 204 122C196 82 160 62 122 66Z" fill="url(#GB)" stroke="var(--st)" stroke-width="3" stroke-linejoin="round"/><path d="M184 112C196 140 192 184 160 212" fill="none" stroke="#FF7A4A" stroke-width="10" stroke-linecap="round" opacity=".35"/>` + gloss(86, 100, 16, 10, -30),
    face: () => eye(100, 120) + eye(156, 118) + blush() + mouthSmile + `<path d="M154 152Q160 156 156 162" fill="none" stroke="var(--st)" stroke-width="3.2" stroke-linecap="round"/>` },
  orange: { vi: "Cam Cam", prop: "tanh", mark: "chấm rốn cam nhỏ trên đỉnh + hai lá đôi như tai thỏ + mắt tròn xoe", vars: "--c1:#FFB45A;--c2:#F7780F;--st:#C55A06;--bl:#FF8F7A;--l1:#7BE08A;--l2:#2FAE5B;--lst:#1F7F43",
    body: () => leaf("M126 60C108 40 84 38 72 48C84 66 108 70 126 60Z") + leaf("M130 60C148 40 172 38 184 48C172 66 148 70 130 60Z") + `<circle cx="128" cy="146" r="88" fill="url(#GB)" stroke="var(--st)" stroke-width="3"/><circle cx="128" cy="62" r="6" fill="var(--st)" opacity=".7"/>` +
      [[84, 200], [98, 214], [116, 222], [140, 222], [158, 214], [172, 200], [70, 178], [186, 178], [76, 106], [180, 106]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="var(--st)" opacity=".45"/>`).join("") + gloss(90, 104, 18, 10, -30),
    face: () => eye(102, 122) + eye(154, 122) + blush() + mouthOpen.replace(/M110 143Q128 172 146 143Q128 150 110 143Z/, "M112 148Q128 172 144 148Q128 154 112 148Z") },
  apple: { vi: "Táo Đỏ", prop: "tviet", mark: "cuống nâu nghiêng + một lá xanh to + vệt bóng trắng hình trăng khuyết + mắt cười híp", vars: "--c1:#FF7A7A;--c2:#D9232D;--st:#A8141E;--bl:#FFB09D;--l1:#7BE08A;--l2:#2FAE5B;--lst:#1F7F43",
    body: () => `<path d="M128 78C100 52 50 64 50 118C50 178 90 236 128 226C166 236 206 178 206 118C206 64 156 52 128 78Z" fill="url(#GB)" stroke="var(--st)" stroke-width="3" stroke-linejoin="round"/><path d="M130 78Q128 54 142 36" fill="none" stroke="#8A5A2B" stroke-width="7" stroke-linecap="round"/>` + leaf("M140 42C152 14 186 10 206 28C192 52 164 58 140 42Z") + `<path d="M76 100Q74 124 84 146" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".55"/>`,
    face: () => eye(102, 122) + eye(154, 122) + blush() + `<path d="M110 148Q128 168 146 148" fill="none" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round"/><path d="M96 108Q104 100 112 108M144 108Q152 100 160 108" fill="none" stroke="var(--ink)" stroke-width="0"/>` },
  pear: { vi: "Lê Lê", prop: "toan", mark: "thân hình giọt nước hai tầng + chấm đốm xanh trên má + mắt lim dim hiền", vars: "--c1:#E4F07A;--c2:#A8D13E;--st:#6E9A22;--bl:#FFB09D;--l1:#7BE08A;--l2:#2FAE5B;--lst:#1F7F43",
    body: () => `<path d="M128 40C100 40 102 76 92 100C58 128 48 164 64 200C82 236 174 236 192 200C208 164 198 128 164 100C154 76 156 40 128 40Z" fill="url(#GB)" stroke="var(--st)" stroke-width="3" stroke-linejoin="round"/><path d="M128 42Q128 24 140 14" fill="none" stroke="#8A5A2B" stroke-width="6" stroke-linecap="round"/>` + leaf("M138 24C150 6 176 6 190 20C178 38 154 40 138 24Z") +
      [[78, 176], [86, 196], [176, 184], [168, 204]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="var(--st)" opacity=".4"/>`).join("") + gloss(96, 134, 13, 8, -26),
    face: () => `<path d="M88 124Q100 112 112 124M144 124Q156 112 168 124" fill="none" stroke="var(--ink)" stroke-width="5.5" stroke-linecap="round"/><ellipse cx="100" cy="123" rx="2.6" ry="2" fill="var(--ink)"/><ellipse cx="156" cy="123" rx="2.6" ry="2" fill="var(--ink)"/>` + blush(4) + `<path d="M112 152Q128 166 144 152" fill="none" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round"/>` },
  sen: { vi: "Sen Sen", prop: "vo", mark: "búi cánh sen như mái tóc + một giọt nước trên má + mắt to sáng hay hỏi", vars: "--c1:#FFC2D4;--c2:#F2689A;--st:#C93F73;--bl:#FF7A9D;--l1:#8EE89A;--l2:#2FAE5B;--lst:#1F7F43",
    body: () => `<ellipse cx="128" cy="222" rx="112" ry="24" fill="url(#GL)" stroke="var(--lst)" stroke-width="3"/><path d="M128 222L128 204" stroke="var(--lst)" stroke-width="3"/><ellipse cx="128" cy="236" rx="76" ry="6" fill="#9BE0F7" opacity=".6"/>` +
      [-62, -34, 34, 62, -14, 14].map(a => `<ellipse cx="128" cy="62" rx="22" ry="46" fill="${Math.abs(a) < 20 ? "url(#GB)" : "var(--c1)"}" stroke="var(--st)" stroke-width="2.8" transform="rotate(${a} 128 150)"/>`).join("") +
      `<circle cx="128" cy="144" r="72" fill="url(#GB)" stroke="var(--st)" stroke-width="3"/>` + gloss(98, 108, 16, 9, -28),
    face: () => eye(102, 130) + eye(154, 130) + blush(2) + `<path d="M184 150Q190 160 184 168Q178 160 184 150Z" fill="#9BE0F7" stroke="#3B9BD6" stroke-width="2"/>` + `<path d="M112 156Q128 172 144 156" fill="none" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round"/>` }
};

function svg(id, m, pathPrefix) {
  const grads = `<linearGradient id="GB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--c1)"/><stop offset="1" stop-color="var(--c2)"/></linearGradient><linearGradient id="GL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--l1)"/><stop offset="1" stop-color="var(--l2)"/></linearGradient>${m.grads || ""}`;
  const defs = `<defs>${grads}</defs>`;
  const style = `.np-mascot{--ink:#2A2350;--hl:#fff;${m.vars}}.npa{transform-box:fill-box;transform-origin:50% 100%}.npa-bob{animation:npa-bob 2.4s ease-in-out infinite}.npa-blink{transform-origin:50% 50%;animation:npa-blink 4.2s infinite}@keyframes npa-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes npa-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.12)}}:root.np-playing .npa{animation:none}@media (prefers-reduced-motion:reduce){.npa{animation:none}}`;
  const uniq = s => s.replace(/id="G(B|L|D)"/g, `id="G$1-${id}"`).replace(/url\(#G(B|L|D)\)/g, `url(#G$1-${id})`);
  const body = m.body(), face = m.face();
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${m.vi}" class="np-mascot sk-default" data-style="pop" data-game="garden-${id}">
<title>${m.vi}</title>
<desc>Linh vật ${m.vi} (phong cách Pop). Chữ ký khuôn mặt: ${m.mark}. Đạo cụ nhận diện: ${{ toan: "khối cộng (Toán)", tviet: "quyển sách (Tiếng Việt)", tanh: "cờ nhỏ (Tiếng Anh)", vo: "vở và bút chì (làm bài cùng bé)" }[m.prop]}.</desc>
<style>${style}</style>
${uniq(defs)}
<g id="shadow"><ellipse cx="128" cy="237" rx="70" ry="9" fill="var(--ink)" opacity=".18"/></g>
<g id="all" class="npa npa-bob">
<g id="body">${uniq(body)}</g>
<g id="limbs">${arms}</g>
<g id="face"><g id="eyes" class="npa-blink">${uniq(face)}</g></g>
${PROPS[m.prop]}
</g>
</svg>
`;
  return doc;
}

/* ---------- ghi tệp ---------- */
fs.mkdirSync(path.join(root, "kho"), { recursive: true }); fs.mkdirSync(path.join(root, "ao"), { recursive: true });
const files = [];
for (const [id, m] of Object.entries(M)) { const p = id === "sen" ? path.join(root, "ao", "mascot.svg") : path.join(root, "kho", `mascot_${id}.svg`); fs.writeFileSync(p, svg(id, m)); files.push([id, m.vi, path.relative(root, p), fs.statSync(p).size]); }

/* ---------- trang duyệt ---------- */
const cells = files.map(([id, vi, rel, sz]) => `<figure><div class="big"><img src="${rel}" alt="${vi}"></div><div class="row"><img class="s40" src="${rel}" alt=""><img class="s96" src="${rel}" alt=""></div><figcaption><b>${vi}</b><small>${rel} · ${(sz / 1024).toFixed(1)} KB</small></figcaption></figure>`).join("");
fs.writeFileSync(path.join(root, "preview-kho-mascots.html"), `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Duyệt linh vật Kho + Ao</title><style>
body{margin:0;background:#F6F4F1;color:#1d1a33;font:16px/1.45 system-ui,sans-serif}.wrap{max-width:1180px;margin:0 auto;padding:16px}h1{margin:0 0 4px}p{color:#5b5578;max-width:60em;margin:0 0 14px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}figure{margin:0;background:#fff;border:1px solid #E3DDEF;border-radius:20px;padding:12px;text-align:center}.big img{width:200px;height:200px}.row{display:flex;gap:12px;justify-content:center;align-items:flex-end;padding:6px;border-radius:12px;background:#2a2350;margin:4px 0}.s40{width:40px;height:40px}.s96{width:96px;height:96px}figcaption b{display:block;font-size:18px}figcaption small{color:#7a7396}
a{color:#6D4AE0}</style></head><body><nav class="rvnav" style="position:sticky;top:0;z-index:99;display:flex;gap:6px 14px;flex-wrap:wrap;align-items:center;padding:8px 16px;background:#1a1d33;color:#fff;font:600 13px system-ui"></nav><script src="../../../learn/review-nav.js"></script><div class="wrap"><h1>Linh vật Kho nông sản + Ao cá (bản chờ duyệt)</h1><p>Phong cách <b>Pop</b> (đồ chơi mềm) như linh vật Pop Play, nhưng là trái cây, rau củ. Mỗi con có đạo cụ nhận diện môn: <b>khối +</b> = Toán, <b>quyển sách</b> = Tiếng Việt, <b>cờ nhỏ</b> = Tiếng Anh; <b>Sen Sen</b> ở ao cầm <b>vở + bút chì</b> để cùng bé giải bài. Hàng dưới: cỡ 40px và 96px trên nền tối. Chỉ có skin Mặc định; 4 skin trả phí làm sau khi duyệt dáng.</p><div class="grid">${cells}</div><p style="margin-top:16px"><a href="preview-barn.html">← Kho</a> · <a href="preview-pond.html">Ao cá</a></p></div></body></html>`);
console.log("✓ đã sinh " + files.length + " linh vật + preview-kho-mascots.html:", files.map(f => f[0] + " " + f[3] + "B").join(", "));
