/* Sinh linh vật Pop cho 2 khu vườn mới: Mây Mây (Rừng Chữ, hồ mây) và Sò Sò (Vịnh Từ, vịnh). Cùng khung với Sen Sen (gen-kho-mascots.js).
   Chạy: node scripts/learn/gen-garden2-mascots.js  → shared/art/garden/ao/mascot_may.svg, mascot_so.svg */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "../../shared/art/garden/ao");
const STYLE = (v) => `<style>.np-mascot{--ink:#2A2350;--hl:#fff;${v}}.npa{transform-box:fill-box;transform-origin:50% 100%}.npa-bob{animation:npa-bob 2.4s ease-in-out infinite}.npa-blink{transform-origin:50% 50%;animation:npa-blink 4.2s infinite}@keyframes npa-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes npa-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.12)}}:root.np-playing .npa{animation:none}@media (prefers-reduced-motion:reduce){.npa{animation:none}}</style>`;
const eyes = `<g id="eyes" class="npa-blink"><circle cx="102" cy="130" r="14" fill="var(--ink)"/><circle cx="107" cy="124.5" r="5.2" fill="#fff"/><circle cx="97.5" cy="135" r="2.6" fill="#fff" opacity=".9"/><circle cx="154" cy="130" r="14" fill="var(--ink)"/><circle cx="159" cy="124.5" r="5.2" fill="#fff"/><circle cx="149.5" cy="135" r="2.6" fill="#fff" opacity=".9"/><ellipse cx="80" cy="142" rx="11" ry="7" fill="var(--bl)" opacity=".75"/><ellipse cx="176" cy="142" rx="11" ry="7" fill="var(--bl)" opacity=".75"/>`;
const wrap = (id, vi, desc, vars, defs, body, limbs, face, prop) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${vi}" class="np-mascot sk-default" data-style="pop" data-game="garden-${id}">
<title>${vi}</title>
<desc>${desc}</desc>
${STYLE(vars)}
<defs>${defs}</defs>
<g id="shadow"><ellipse cx="128" cy="237" rx="70" ry="9" fill="var(--ink)" opacity=".18"/></g>
<g id="all" class="npa npa-bob">
<g id="body">${body}</g>
<g id="limbs">${limbs}</g>
<g id="face">${face}</g>
<g id="prop">${prop}</g>
</g>
</svg>
`;
const grad = (n, a, b) => `<linearGradient id="${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(${a})"/><stop offset="1" stop-color="var(${b})"/></linearGradient>`;

// ---- Mây Mây: thân là đám mây tròn, chỏm mây xoăn như dấu hỏi, ngôi sao nhỏ trên má; cầm quyển sách chữ A
const may = wrap("may", "Mây Mây",
  "Linh vật Mây Mây (phong cách Pop), canh hồ mây ở Rừng Chữ. Chữ ký khuôn mặt: đám mây tròn có chỏm mây xoăn như dấu hỏi trên đầu + một ngôi sao nhỏ trên má phải + mắt to sáng hay tò mò. Đạo cụ nhận diện: quyển sách có chữ A (Tiếng Việt).",
  "--c1:#FFFFFF;--c2:#BFE3FF;--st:#6FA8DC;--bl:#FF9DB8;--l1:#E8F6FF;--l2:#A9D8FF;--lst:#6FA8DC",
  grad("GB-may", "--c1", "--c2") + grad("GL-may", "--l1", "--l2"),
  `<ellipse cx="128" cy="224" rx="104" ry="20" fill="url(#GL-may)" stroke="var(--lst)" stroke-width="3"/><circle cx="62" cy="214" r="22" fill="url(#GL-may)" stroke="var(--lst)" stroke-width="3"/><circle cx="194" cy="214" r="22" fill="url(#GL-may)" stroke="var(--lst)" stroke-width="3"/><ellipse cx="128" cy="228" rx="86" ry="14" fill="url(#GL-may)"/>` +
  `<circle cx="70" cy="146" r="38" fill="url(#GB-may)" stroke="var(--st)" stroke-width="3"/><circle cx="186" cy="146" r="38" fill="url(#GB-may)" stroke="var(--st)" stroke-width="3"/><circle cx="96" cy="100" r="42" fill="url(#GB-may)" stroke="var(--st)" stroke-width="3"/><circle cx="160" cy="100" r="42" fill="url(#GB-may)" stroke="var(--st)" stroke-width="3"/><circle cx="128" cy="150" r="64" fill="url(#GB-may)" stroke="var(--st)" stroke-width="3"/><circle cx="128" cy="116" r="52" fill="url(#GB-may)"/>` +
  `<path d="M128 56C128 38 150 34 154 48C158 62 138 66 138 80" fill="none" stroke="var(--st)" stroke-width="12" stroke-linecap="round"/><path d="M128 56C128 38 150 34 154 48C158 62 138 66 138 80" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="138" cy="94" r="6" fill="var(--st)"/><circle cx="138" cy="94" r="3" fill="#fff"/><ellipse cx="96" cy="92" rx="16" ry="9" fill="#fff" opacity=".7" transform="rotate(-28 96 92)"/>`,
  `<ellipse cx="62" cy="192" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/><ellipse cx="194" cy="190" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/>`,
  eyes + `<path d="M184 138l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="#FFD23F" stroke="#C9942A" stroke-width="1.8" stroke-linejoin="round"/><path d="M112 156Q128 172 144 156" fill="none" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round"/></g>`,
  `<rect x="182" y="152" width="46" height="42" rx="7" fill="#FFB9A0" stroke="#B5533A" stroke-width="3"/><rect x="190" y="152" width="38" height="42" rx="6" fill="#FFF3DC" stroke="#B5533A" stroke-width="3"/><text x="209" y="184" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="28" fill="#D94B3A">A</text><ellipse cx="194" cy="192" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/>`);

// ---- Sò Sò: thân là vỏ sò quạt, ngọc trai nằm giữa trán, mi dài một bên; cầm cờ nhỏ
let ribs = ""; for (let i = -3; i <= 3; i++) ribs += `<path d="M128 214L${128 + i * 24} 96" stroke="var(--st)" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>`;
const so = wrap("so", "Sò Sò",
  "Linh vật Sò Sò (phong cách Pop), canh vịnh ở Vịnh Từ. Chữ ký khuôn mặt: thân vỏ sò quạt + ngọc trai tròn giữa trán + mi dài ở mắt phải + mắt to sáng hay nói chuyện. Đạo cụ nhận diện: cờ nhỏ (Tiếng Anh).",
  "--c1:#FFE3B8;--c2:#FF9F6B;--st:#C5603A;--bl:#FF7A9D;--l1:#B7EEFF;--l2:#3FB6DE;--lst:#2A86B0",
  grad("GB-so", "--c1", "--c2") + grad("GL-so", "--l1", "--l2"),
  `<ellipse cx="128" cy="226" rx="106" ry="20" fill="url(#GL-so)" stroke="var(--lst)" stroke-width="3"/><path d="M52 222q14-9 28 0M104 232q14-9 28 0M160 222q14-9 28 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>` +
  `<path d="M128 214C60 212 36 170 44 128C52 82 92 54 128 54C164 54 204 82 212 128C220 170 196 212 128 214Z" fill="url(#GB-so)" stroke="var(--st)" stroke-width="3"/>` + ribs +
  `<path d="M100 214Q128 232 156 214L146 200H110Z" fill="var(--c2)" stroke="var(--st)" stroke-width="3" stroke-linejoin="round"/><path d="M56 118Q128 40 200 118" fill="none" stroke="var(--st)" stroke-width="3" stroke-linecap="round" opacity=".6"/><ellipse cx="84" cy="96" rx="16" ry="9" fill="#fff" opacity=".55" transform="rotate(-30 84 96)"/><circle cx="128" cy="82" r="13" fill="#fff" stroke="#9aa6c8" stroke-width="2.5"/><circle cx="123" cy="77" r="4.5" fill="#fff"/><circle cx="131" cy="86" r="3" fill="#D8E4FF"/>`,
  `<ellipse cx="62" cy="196" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/><ellipse cx="194" cy="190" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/>`,
  eyes + `<path d="M164 118l9-6M168 124l11-2" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"/><path d="M112 160Q128 176 144 160" fill="none" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round"/></g>`,
  `<rect x="214" y="104" width="5" height="90" rx="2.5" fill="#8a5a2b" stroke="#5E3A1B" stroke-width="2"/><path d="M219 106H252L242 120L252 134H219Z" fill="#E6584A" stroke="#9a2f24" stroke-width="3" stroke-linejoin="round"/><path d="M226 114H240M226 126H238" stroke="#fff" stroke-width="3" stroke-linecap="round"/><ellipse cx="205" cy="192" rx="15" ry="13" fill="var(--c2)" stroke="var(--st)" stroke-width="3"/>`);
fs.writeFileSync(path.join(root, "mascot_may.svg"), may);
fs.writeFileSync(path.join(root, "mascot_so.svg"), so);
console.log("ok", may.length, so.length);
