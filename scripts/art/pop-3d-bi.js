/* Linh vật Pop 3D cho "Nuôi Thú Tiếng Việt": cún Bi (vàng cam, tai cụp nâu, đốm nâu quanh MẮT TRÁI, vòng cổ đỏ + thẻ vàng dấu ✓, bát chữ cái). Đọc bởi gen-pop.js. */
const { O, orb3, star5, note, plus } = require("./pop-3d-lib.js");
const L = (vi, en) => [vi, en];
const ear = (cx, rot, ox) => `<g transform="rotate(${rot} ${ox} 100)">${O(cx, 108, 22, 44, "url(#pe)")}<ellipse cx="${cx + (rot > 0 ? -6 : 6)}" cy="92" rx="5" ry="15" fill="#fff" opacity=".24"/></g>`;
const paw = (x, r) => O(x, 166, 15, 26, "url(#pg)", 3, `transform="rotate(${r} ${x} 166)"`);
const foot = x => O(x, 226, 17, 9);
const body = [
  `<g transform="rotate(24 196 190)">${O(208, 184, 12, 30)}</g>`, ear(48, 14, 56), ear(208, -14, 200), orb3(128, 140, 86, 82),
  '<ellipse cx="128" cy="188" rx="48" ry="33" fill="var(--bell)" opacity=".95"/>', '<ellipse cx="128" cy="148" rx="40" ry="26" fill="var(--bell)"/>',
  paw(44, -22), paw(212, 22), foot(102), foot(154),
].join("");
const FXN = '<circle cx="128" cy="140" r="112" fill="none" stroke="#B79CFF" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round" opacity=".6"/><path class="npa-twinkle" d="M30 70l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#FFE08A"/><path class="npa-twinkle" style="animation-delay:.7s" d="M222 96l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5z" fill="#7CF0FF"/><path class="npa-twinkle" style="animation-delay:1.2s" d="M206 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff"/>';
const mark = '<g id="mark"><ellipse cx="97" cy="110" rx="27" ry="25" fill="var(--patch)" opacity=".9"/><ellipse cx="88" cy="96" rx="9" ry="4" fill="#fff" opacity=".18"/></g>';
const beak = '<path d="M122 150Q128 174 134 150Z" fill="#FF8FA8"/><ellipse id="nose" cx="128" cy="135" rx="11.5" ry="8" fill="#4A2A3A"/><ellipse cx="124" cy="132" rx="4.4" ry="2.4" fill="#fff" opacity=".85"/>' +
  '<path d="M84 92Q98 84 112 92M144 92Q158 84 172 92" fill="none" stroke="var(--pst)" stroke-width="3.6" stroke-linecap="round"/>';
const sign = '<g id="sign"><path d="M70 166Q128 204 186 166L182 180Q128 218 74 180Z" fill="var(--k1)" stroke="#B02A32" stroke-width="2"/><path d="M78 169Q128 203 178 169" fill="none" stroke="#fff" stroke-width="2.4" opacity=".4"/>' +
  '<circle cx="128" cy="208" r="12" fill="var(--k2)" stroke="#C8920A" stroke-width="2.5"/><path d="M122 208L127 213L135 203" fill="none" stroke="#9A6400" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="123" cy="203" r="3" fill="#fff" opacity=".7"/>' +
  '<g transform="translate(206 226)"><ellipse cx="0" cy="2" rx="30" ry="7" fill="#000" opacity=".16"/><path d="M-28 -18H28Q28 14 0 14Q-28 14 -28 -18Z" fill="#4DB6F5" stroke="#2A7DBF" stroke-width="3"/><ellipse cx="0" cy="-18" rx="28" ry="7" fill="#2A7DBF"/><ellipse cx="0" cy="-19" rx="23" ry="5" fill="#FFE3A8"/>' +
  '<rect x="-13" y="-42" width="26" height="26" rx="6" transform="rotate(-8 0 -29)" fill="#FFD54A" stroke="#C8920A" stroke-width="2.5"/><text x="0" y="-22" text-anchor="middle" transform="rotate(-8 0 -29)" font-family="Inter,system-ui,sans-serif" font-weight="900" font-size="22" fill="#B85A00">A</text><path d="M-22 -6Q-18 4 -8 6" fill="none" stroke="#fff" stroke-width="2.4" opacity=".5" stroke-linecap="round"/></g></g>';
const G = { name: "Nuôi Thú Tiếng Việt", hero: "Cún Bi", r3d: true, nightTint: "#2C2A9C", pal: { p1: "#FFC46E", p2: "#EE9A3E", pst: "#B8742E", k1: "#E8454F", k2: "#FFD54A" }, markUnder: true,
  markTxt: "đốm nâu quanh mắt trái + thẻ tên vàng dấu ✓ trên vòng cổ", prop: "bát ăn xanh có ô chữ A + vòng cổ đỏ thẻ ✓",
  extraVars: "--bell:#FFEBC8;--ear:#B8742E;--patch:#C98438;", defs: '<radialGradient id="pe" cx=".36" cy=".28" r=".85"><stop offset="0" style="stop-color:color-mix(in srgb,var(--ear) 66%,#fff)"/><stop offset="1" style="stop-color:var(--ear)"/></radialGradient>',
  body, mark, beak, sign };
const S = {
  emoji: "🐶", names: { badge: L("Bác sĩ thú y", "Vet pup"), group: L("Ca sĩ nhí", "Little singer"), night: L("Phù thủy chữ", "Letter wizard"), star: L("Hiệp sĩ sách", "Book knight") },
  badge: '<path d="M74 82Q78 38 128 36Q178 38 182 82Q128 66 74 82Z" fill="#fff" stroke="#9AA3B8" stroke-width="3" stroke-linejoin="round"/><path d="M121 46h14v9h9v14h-9v9h-14v-9h-9v-14h9z" fill="#E8454F"/>' +
    '<path d="M86 170Q86 206 150 198M170 170Q172 190 152 194" fill="none" stroke="#3A4256" stroke-width="4.5" stroke-linecap="round"/><circle cx="150" cy="198" r="8" fill="#DDE6F2" stroke="#6E7890" stroke-width="3"/><circle cx="148" cy="196" r="2.6" fill="#fff"/>' +
    '<g transform="translate(18 164) rotate(-6 26 30)"><rect x="0" y="12" width="54" height="40" rx="9" fill="#fff" stroke="#9AA3B8" stroke-width="3"/><path d="M16 12V7Q16 1 22 1H32Q38 1 38 7V12" fill="none" stroke="#9AA3B8" stroke-width="3"/><path d="M22 22h10v7h7v9h-7v7H22v-7h-7v-9h7z" fill="#E8454F"/></g>' + plus(212, 56) + plus(228, 96, "#FF8FA8"),
  group: '<path d="M62 112Q62 40 128 40Q194 40 194 112" fill="none" stroke="#2F3250" stroke-width="9" stroke-linecap="round"/><rect x="48" y="96" width="18" height="38" rx="9" fill="#FF5A8A" stroke="#C93A66" stroke-width="3"/><rect x="190" y="96" width="18" height="38" rx="9" fill="#FF5A8A" stroke="#C93A66" stroke-width="3"/>' +
    '<g transform="rotate(-26 50 176)"><rect x="45" y="170" width="10" height="42" rx="5" fill="#7A6AE8" stroke="#4A3EB0" stroke-width="3"/><circle cx="50" cy="160" r="14" fill="#C8CEDA" stroke="#7A8398" stroke-width="3"/><path d="M40 156h20M40 162h20" stroke="#7A8398" stroke-width="2"/><circle cx="45" cy="154" r="4" fill="#fff" opacity=".7"/></g>' + note(214, 70) + note(232, 120, "#7A6AE8") + note(24, 100, "#FFB020"),
  night: '<path d="M80 76Q130 90 188 76L150 20Q120 62 80 76Z" fill="#6A4AE2" stroke="#3E2AA8" stroke-width="3" stroke-linejoin="round"/><ellipse cx="128" cy="72" rx="66" ry="10" fill="#7C5CF0" stroke="#3E2AA8" stroke-width="3"/><path d="M82 70Q128 78 174 70" fill="none" stroke="#FFD43B" stroke-width="5"/>' + star5(140, 48, 7) + star5(120, 70, 4) +
    '<path d="M34 214L62 176" stroke="#FFD43B" stroke-width="6" stroke-linecap="round"/>' + star5(66, 170, 9) + '<g class="npa-twinkle"><circle cx="34" cy="142" r="24" fill="#B79CFF" opacity=".35"/><text x="34" y="153" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="900" font-size="32" fill="#FFE08A">Ă</text></g>',
  star: '<path d="M68 86Q70 34 128 32Q186 34 188 86Q128 66 68 86Z" fill="#CFD6E4" stroke="#7A8398" stroke-width="3" stroke-linejoin="round"/><path d="M76 78Q128 62 180 78" fill="none" stroke="#fff" stroke-width="4" opacity=".55" stroke-linecap="round"/><path d="M128 34Q150 4 196 18Q164 22 156 44Z" fill="#E8454F" stroke="#B02A32" stroke-width="3" stroke-linejoin="round"/>' +
    '<circle cx="62" cy="170" r="19" fill="#FFD43B" stroke="#C89A0A" stroke-width="3"/><circle cx="194" cy="170" r="19" fill="#FFD43B" stroke="#C89A0A" stroke-width="3"/><circle cx="56" cy="164" r="5" fill="#fff" opacity=".6"/><circle cx="188" cy="164" r="5" fill="#fff" opacity=".6"/>' +
    '<g transform="translate(14 148) rotate(-8 28 34)"><rect x="0" y="0" width="54" height="68" rx="8" fill="#3A6EE0" stroke="#1F3F94" stroke-width="3"/><rect x="0" y="0" width="9" height="68" rx="4" fill="#2A52B8"/>' + star5(33, 32, 13) + '<path d="M16 54h30" stroke="#FFE08A" stroke-width="3" stroke-linecap="round"/></g>',
  back: { night: '<path d="M40 138Q18 204 32 228Q40 238 58 237L198 237Q216 238 224 228Q238 204 216 138Z" fill="#4A2FB8" stroke="#3E2AA8" stroke-width="3" stroke-linejoin="round"/>' },
  fxNight: FXN,
  fx: { "default": ["🐾", "🔤"], badge: ["🩺", "💊"], group: ["🎤", "🎵"], night: ["🔮", "✨"], star: ["📖", "🛡️"] },
  hi: [L("Chào bé! Mình là Bi, cùng học chữ nhé!", "Hi! I'm Bi, let's learn words!"), L("Gâu gâu! Bi đói chữ rồi!", "Woof! Bi is hungry for words!")], tap: [L("Gâu! Nhột quá!", "Woof! That tickles!"), L("Bi thích học chữ lắm!", "Bi loves words!")] };
module.exports = { G, S };
