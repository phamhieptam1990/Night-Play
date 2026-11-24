/* Họ icon điều khiển (nút) của Học Vui — một phần của scripts/learn/gen-icons.js; xuất { UI, GLYPH, CTL }. */
"use strict";
/* =================== HỌ ICON ĐIỀU KHIỂN (nút) ===================
   Cùng độ tròn mềm với bộ Pop: nét dày 16, đầu nét và góc bo tròn, MỘT màu = currentColor (đổi theo màu chữ của nút, sáng/tối đều đọc được).
   U(tên, [ký tự chữ thay thế], [emoji thay thế], nội dung). Ký tự chữ chỉ được thay khi nằm TRONG nút/liên kết (không đụng chữ trong câu). */
const UI = [];
function U(name, glyphs, emojis, inner, ctl) { UI.push({ name, glyphs, emojis, inner, ctl: ctl || [] });
    }   /* ctl: emoji có icon màu (Pop) ở chỗ khác, nhưng trong NÚT CHỈ CÓ ICON thì dùng bản nét đơn này */
const UA = 'fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"';
U("back", ["←"], [], '<path ' + UA + ' d="M104 64H26M56 34L26 64L56 94"/>');
U("fwd", ["→"], [], '<path ' + UA + ' d="M24 64H102M72 34L102 64L72 94"/>');
U("prev", ["‹", "◀"], [], '<path ' + UA + ' d="M80 26L42 64L80 102"/>');
U("next", ["›", "▶"], [], '<path ' + UA + ' d="M48 26L86 64L48 102"/>');
U("close", ["✕", "✖", "✗", "✘"], [], '<path ' + UA + ' d="M32 32L96 96M96 32L32 96"/>');
U("check", ["✓", "✔"], [], '<path ' + UA + ' d="M24 68L52 96L104 36"/>');
U("undo", ["↺"], [], '<path ' + UA + ' d="M30 50A42 42 0 1 1 28 84"/><path ' + UA + ' d="M24 22V52H54"/>');
U("repeat", [], ["🔁"], '<path ' + UA + ' d="M26 56V50A16 16 0 0 1 42 34H100M84 16L102 34L84 52M102 72V78A16 16 0 0 1 86 94H28M44 76L26 94L44 112"/>');
U("menu", ["⋯"], [],
    '<circle cx="26" cy="64" r="10" fill="currentColor"/><circle cx="64" cy="64" r="10" fill="currentColor"/><circle cx="102" cy="64" r="10" fill="currentColor"/>');
U("info", ["ⓘ"], [], '<circle cx="64" cy="64" r="46" ' + UA.replace("16", "12") + '/><circle cx="64" cy="40" r="7" fill="currentColor"/><path ' +
    UA.replace("16", "12") + ' d="M64 58V92"/>');
U("theme", [], ["🌓"], '<circle cx="64" cy="64" r="44" ' + UA.replace("16", "12") + '/><path d="M64 20A44 44 0 0 1 64 108Z" fill="currentColor"/>');
U("plus", ["＋"], [], '<path ' + UA + ' d="M64 24V104M24 64H104"/>');
U("minus", ["－"], [], '<path ' + UA + ' d="M24 64H104"/>');
U("sound", [], ["🔊"], '<path ' + UA.replace("16", "12") + ' d="M20 50H40L68 28V100L40 78H20Z"/><path ' + UA.replace("16", "12") +
    ' d="M86 46C95 55 95 73 86 82M100 30C116 48 116 80 100 98"/>');
U("mute", [], ["🔇"], '<path ' + UA.replace("16", "12") + ' d="M16 50H36L64 28V100L36 78H16Z"/><path ' + UA.replace("16", "12") + ' d="M86 50L116 80M116 50L86 80"/>');
const U2 = 'fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"';
U("sprout", [], [], '<path ' + U2 + ' d="M64 110V62M64 72C64 48 46 34 22 36C22 60 40 74 64 72ZM64 60C64 40 80 26 104 28C104 50 88 62 64 60Z"/>', ["🌱"]);
U("rainbow", [], [], '<path ' + U2 + ' d="M18 100A46 46 0 0 1 110 100M36 100A28 28 0 0 1 92 100M54 100A10 10 0 0 1 74 100"/>', ["🌈"]);
U("bag", [], [], '<path ' + U2 +
    ' d="M32 56A22 22 0 0 1 54 34H74A22 22 0 0 1 96 56V104A8 8 0 0 1 88 112H40A8 8 0 0 1 32 104ZM52 34V26A12 12 0 0 1 76 26V34M48 82H80"/>', ["🎒"]);
U("music", [], [], '<path ' + U2 +
    ' d="M50 92V34L98 24V82"/><ellipse cx="38" cy="92" rx="13" ry="11" fill="currentColor"/><ellipse cx="86" cy="82" rx="13" ry="11" fill="currentColor"/>',
    ["🎶"]);
U("map", [], [], '<path ' + U2 + ' d="M18 34L46 24L82 36L110 26V94L82 104L46 92L18 102ZM46 24V92M82 36V104"/>', ["🗺️"]);
U("lock", [], [], '<rect x="30" y="58" width="68" height="48" rx="10" ' + U2 + '/><path ' + U2 +
    ' d="M44 58V46A20 20 0 0 1 84 46V58"/><circle cx="64" cy="82" r="6" fill="currentColor"/>', ["🔒"]);
U("bulb", [], [], '<path ' + U2 + ' d="M64 18C45 18 32 32 32 50C32 63 40 69 45 80H83C88 69 96 63 96 50C96 32 83 18 64 18ZM50 94H78M55 108H73"/>', ["💡"]);
U("book", [], [], '<path ' + U2 + ' d="M64 36C52 28 36 28 20 32V98C36 94 52 94 64 102C76 94 92 94 108 98V32C92 28 76 28 64 36ZM64 36V102"/>', ["📖"]);
U("calendar", [], [], '<rect x="22" y="36" width="84" height="68" rx="12" ' + U2 + '/><path ' + U2 +
    ' d="M22 58H106M44 24V44M84 24V44"/><circle cx="46" cy="80" r="5" fill="currentColor"/><circle cx="64" cy="80" r="5" fill="currentColor"/><circle cx="82" cy="80" r="5" fill="currentColor"/>',
    ["📅"]);
U("home", [], [], '<path ' + U2 + ' d="M18 66L64 24L110 66M32 56V106H96V56M54 106V78H74V106"/>', ["🏡"]);
U("edit", [], [], '<path ' + U2 + ' d="M24 104L30 76L82 24L104 46L52 98ZM70 36L92 58"/>', ["✏️", "✏"]);
U("game", [], [], '<path ' + U2 + ' d="M36 44H92A24 24 0 0 1 116 68V76A16 16 0 0 1 90 86L82 76H46L38 86A16 16 0 0 1 12 76V68A24 24 0 0 1 36 44Z"/><path ' + U2 +
    ' d="M38 56V70M31 63H45"/><circle cx="84" cy="58" r="5" fill="currentColor"/><circle cx="98" cy="68" r="5" fill="currentColor"/>', ["🎮"]);
const GLYPH = {}, CTL = {};   /* ký tự chữ → icon (chỉ thay trong nút) */
UI.forEach(u => { u.glyphs.forEach(g => { GLYPH[g] = "ui-" + u.name; }); u.ctl.forEach(e => { CTL[e.replace(/\uFE0F/g, "")] = "ui-" + u.name; }); });
module.exports = { UI, GLYPH, CTL };
