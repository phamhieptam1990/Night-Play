/* Linh vật Pop cho 3 game hỏi-đáp mới: Mê Cung Toán (Chuột Tính Nhanh), Đoán Quốc Gia (Cánh Cụt Du Hành), Khám Phá Vũ Trụ (Koala Phi Hành Gia).
   Xuất { id: { G, S } } để gen-pop.js nối vào bộ sinh (cùng khuôn pop-3d-*.js). Luật: docs/MASCOT-ART-RULES.md (Pop = đồ chơi mềm, 5 skin, #mark + #sign). */
const { medal, laurel, fxNight, fxStar, capeBack } = require("./pop-skins.js");
const L = (vi, en) => [vi, en], ST = 'stroke="var(--st)" stroke-width="3"';
const bean = `<ellipse cx="128" cy="140" rx="86" ry="82" fill="url(#pg)" ${ST}/><ellipse cx="98" cy="88" rx="26" ry="12" transform="rotate(-24 98 88)" fill="var(--hl)" opacity=".5"/>`;
const belly = '<ellipse cx="128" cy="184" rx="50" ry="36" fill="var(--bell)"/>';
const arms = `<ellipse cx="44" cy="164" rx="16" ry="28" transform="rotate(-22 44 164)" fill="var(--p2)" ${ST}/><ellipse cx="212" cy="164" rx="16" ry="28" transform="rotate(22 212 164)" fill="var(--p2)" ${ST}/>`;
const feet = (c = "var(--k2)") => `<ellipse cx="102" cy="226" rx="16" ry="8" fill="${c}" ${ST}/><ellipse cx="154" cy="226" rx="16" ry="8" fill="${c}" ${ST}/>`;
const ear = (x, y, r, inner) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--p1)" ${ST}/><circle cx="${x}" cy="${y}" r="${r * .55}" fill="${inner}"/>`;
const cap = (c, pom) => `<path d="M72 88Q82 34 128 28Q176 30 186 80Q154 58 128 62Q100 66 72 88Z" fill="${c}" stroke="#2A1F7A" stroke-width="3" stroke-linejoin="round"/><path d="M70 90Q128 62 188 90" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>${pom ? '<circle cx="184" cy="62" r="10" fill="#fff" stroke="#C9C2FF" stroke-width="2.5"/>' : ""}`;
const crownS = '<path d="M94 70L102 38L117 55L128 30L139 55L154 38L162 70Z" fill="#FFD43B" stroke="#E8A317" stroke-width="3" stroke-linejoin="round"/><circle cx="128" cy="56" r="4" fill="#FF6B6B"/>';
const moonS = '<path d="M52 152A22 22 0 1 0 52 198A17 17 0 1 1 52 152Z" fill="#FFE08A" stroke="#E0A02E" stroke-width="2.5" stroke-linejoin="round"/>';
const spark = '<path d="M40 60l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="#FFE08A"/>';
const mk = (id, g, s) => ({ G: g, S: Object.assign({ badge: medal() + laurel, night: cap("#5B4BD8", 1) + moonS, star: crownS + spark, back: { star: capeBack }, fxNight, fxStar }, s) });
module.exports = {
  "me-cung-toan": mk("me-cung-toan", { name: "Mê Cung Toán Nhanh", hero: "Chuột Tính Nhanh", pal: { p1: "#D9D9EC", p2: "#B4B6D8", pst: "#6E7090", k1: "#FFB3C7", k2: "#FFB3C7" }, markTxt: "mẩu phô mai nhỏ trên trán", prop: "bảng mê cung nhỏ có đường xanh dẫn tới phô mai",
    extraVars: "--bell:#F4F2FF;",
    body: `<path d="M214 196Q256 180 240 132Q244 168 208 178Z" fill="var(--p2)" ${ST} stroke-linejoin="round"/>${ear(58, 62, 30, "#FFB3C7")}${ear(198, 62, 30, "#FFB3C7")}${bean}${belly}${arms}${feet("var(--p2)")}`,
    mark: '<g id="mark"><path d="M112 90L142 74V90Z" fill="#FFD84D" stroke="#C89A0A" stroke-width="2.5" stroke-linejoin="round"/><circle cx="130" cy="85" r="2" fill="#C89A0A"/></g>',
    beak: '<ellipse id="nose" cx="128" cy="134" rx="9" ry="6.5" fill="#FF7A9C"/><path d="M60 138h-22M60 148l-20 8M196 138h22M196 148l20 8" stroke="#6E7090" stroke-width="3" stroke-linecap="round"/>',
    sign: '<g id="sign"><rect x="176" y="158" width="62" height="62" rx="9" fill="#fff" stroke="#8E9BB8" stroke-width="3"/><path d="M186 168H228V190H198V208H224" fill="none" stroke="#4CAF50" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="226" cy="208" r="6" fill="#FFD84D" stroke="#C89A0A" stroke-width="2"/></g>' },
  { emoji: "🐭", names: { badge: L("Chuột huy chương", "Medal mouse"), group: L("Chuột thám hiểm", "Explorer mouse"), night: L("Chuột ngủ ngon", "Sleepy mouse"), star: L("Chuột hoàng gia", "Royal mouse") },
    group: '<path d="M66 84Q76 36 128 32Q180 36 190 84Q156 64 128 66Q100 64 66 84Z" fill="#6DBE5A" stroke="#3E8A2E" stroke-width="3" stroke-linejoin="round"/><path d="M62 86H194" stroke="#3E8A2E" stroke-width="7" stroke-linecap="round"/><g transform="translate(40 178)"><circle r="20" fill="#DFF3FF" fill-opacity=".6" stroke="#8E9BB8" stroke-width="5"/><path d="M13 14L30 34" stroke="#8A5A30" stroke-width="7" stroke-linecap="round"/></g>',
    fx: { "default": ["🧀", "✨"], badge: ["🏅", "➕"], group: ["🧭", "🗝️"], night: ["🌙", "💤"], star: ["👑", "🌟"] },
    hi: [L("Chạy mê cung toán cùng mình nào!", "Run the math maze with me!"), L("Chọn cổng đúng để tới phô mai nhé!", "Pick the right gate to reach the cheese!")], tap: [L("Chít chít, nhột quá!", "Squeak! Tickles!"), L("Cổng nào đúng nhỉ?", "Which gate is right?")] }),
  "doan-quoc-gia": mk("doan-quoc-gia", { name: "Đoán Quốc Gia", hero: "Cánh Cụt Du Hành", pal: { p1: "#6C82C0", p2: "#44558F", pst: "#2A3766", k1: "#FF5A6E", k2: "#FF9A3D" }, markTxt: "lá cờ đỏ nhỏ cắm trên đầu", prop: "quả địa cầu cầm tay",
    extraVars: "--bell:#FFFFFF;",
    body: `${bean}${belly}${arms}${feet("#FF9A3D")}`,
    mark: '<g id="mark"><path d="M124 74V50" stroke="#8A5A30" stroke-width="3" stroke-linecap="round"/><path d="M124 50L148 57L124 66Z" fill="#E8454F" stroke="#B02A32" stroke-width="2" stroke-linejoin="round"/></g>', noMouth: true,
    beak: '<path id="beak" d="M114 134Q128 126 142 134Q140 150 128 154Q116 150 114 134Z" fill="#FF9A3D" stroke="#C25A0A" stroke-width="3" stroke-linejoin="round"/>',
    sign: '<g id="sign"><circle cx="206" cy="176" r="28" fill="#4DABF7" stroke="#1F6FB0" stroke-width="3"/><path d="M190 166q10-8 18 0t8 12q-10 4-14 12q-8-6-12-24z" fill="#7BD34A"/><path d="M222 160q6 6 4 14" fill="none" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/><path d="M194 208h24" stroke="#8A5A30" stroke-width="5" stroke-linecap="round"/></g>' },
  { emoji: "🐧", names: { badge: L("Cánh cụt huy chương", "Medal penguin"), group: L("Cánh cụt phi công", "Pilot penguin"), night: L("Cánh cụt ngủ ngon", "Sleepy penguin"), star: L("Cánh cụt hoàng gia", "Royal penguin") },
    group: '<path d="M68 84Q78 36 128 32Q178 36 188 84Z" fill="#E8454F" stroke="#B02A32" stroke-width="3" stroke-linejoin="round"/><path d="M64 86H192" stroke="#fff" stroke-width="8" stroke-linecap="round"/><g transform="translate(40 184)"><rect x="-24" y="-18" width="48" height="36" rx="7" fill="#FFF3D4" stroke="#C8A878" stroke-width="3"/><path d="M-14 -6Q-4 -14 4 -6T16 4" fill="none" stroke="#4CAF50" stroke-width="3.5" stroke-linecap="round"/><circle cx="10" cy="6" r="4" fill="#E8454F"/></g>',
    fx: { "default": ["🌍", "✨"], badge: ["🏅", "🗺️"], group: ["✈️", "🧭"], night: ["🌙", "💤"], star: ["👑", "🌟"] },
    hi: [L("Đoán xem đây là nước nào nhé!", "Guess which country this is!"), L("Cùng đi vòng quanh thế giới nào!", "Let's travel around the world!")], tap: [L("Pạch pạch, nhột quá!", "Flap flap! Tickles!"), L("Nước nào đây nhỉ?", "Which country is it?")] }),
  "kham-pha-vu-tru": mk("kham-pha-vu-tru", { name: "Khám Phá Vũ Trụ", hero: "Koala Phi Hành Gia", pal: { p1: "#C3C9DC", p2: "#9AA3C0", pst: "#5E6890", k1: "#FFD43B", k2: "#9AA3C0" }, markTxt: "vầng trăng khuyết vàng bên thái dương phải", prop: "hành tinh có vành đai trên tay",
    extraVars: "--bell:#F3F5FC;",
    body: `${ear(54, 70, 34, "#F3F5FC")}${ear(202, 70, 34, "#F3F5FC")}${bean}${belly}${arms}${feet("var(--p2)")}`,
    mark: '<path id="mark" transform="translate(18 -6) scale(.85)" d="M176 94A14 14 0 1 0 176 122A10.5 10.5 0 1 1 176 94Z" fill="#FFD43B" stroke="#C89A0A" stroke-width="2" stroke-linejoin="round"/>',
    beak: '<ellipse id="nose" cx="128" cy="134" rx="15" ry="10" fill="#3A3F5C"/><ellipse cx="123" cy="130" rx="4.5" ry="2.5" fill="#fff" opacity=".6"/>',
    sign: '<g id="sign"><circle cx="206" cy="176" r="20" fill="#C79BFF" stroke="#6A3FC0" stroke-width="3"/><ellipse cx="206" cy="176" rx="34" ry="9" fill="none" stroke="#FFD43B" stroke-width="5" transform="rotate(-20 206 176)"/><circle cx="199" cy="169" r="5" fill="#fff" opacity=".55"/></g>' },
  { emoji: "🐨", names: { badge: L("Koala huy chương", "Medal koala"), group: L("Koala phi hành gia", "Astronaut koala"), night: L("Koala ngủ ngon", "Sleepy koala"), star: L("Koala hoàng gia", "Royal koala") },
    group: '<ellipse cx="128" cy="112" rx="98" ry="92" fill="#fff" fill-opacity=".18" stroke="#fff" stroke-width="7"/><path d="M62 70Q76 40 104 34" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/><g transform="translate(40 186)"><path d="M0 -26Q16 -4 12 22H-12Q-16 -4 0 -26Z" fill="#fff" stroke="#9AA3B8" stroke-width="3"/><circle cy="-4" r="6" fill="#4A90E8"/><path d="M-12 12L-24 28L-12 24ZM12 12L24 28L12 24Z" fill="#E8454F"/></g>',
    fx: { "default": ["🚀", "⭐"], badge: ["🏅", "🪐"], group: ["🧑‍🚀", "☄️"], night: ["🌙", "💤"], star: ["👑", "🌟"] },
    hi: [L("Cùng bay vào vũ trụ nào!", "Let's blast into space!"), L("Hôm nay mình ghé hành tinh nào nhỉ?", "Which planet shall we visit?")], tap: [L("Hihi, nhột quá!", "Hehe, tickles!"), L("Bạn biết gì về các vì sao?", "What do you know about stars?")] })
};
