/* Định nghĩa icon Học Vui — thiên nhiên, đồ vật, hình màu (một phần của scripts/learn/gen-icons.js; I = đăng ký icon, f = làm tròn, PAL = bảng màu, INK = màu nét). */
"use strict";
module.exports = function (I, f, PAL, INK) {
  /* =================== ICON: THIÊN NHIÊN =================== */
  I("sprout", ["🌱"], h => { h.shadow(64, 114, 26); h.l("M64 112L64 66", "green", 6); h.p("M64 70C44 72 28 62 24 40C48 38 62 50 64 70Z", "green"); h.p(
      "M64 80C84 82 100 72 104 50C80 48 66 60 64 80Z", "lime"); h.hl(40, 50, 4, 8, -40); });
  I("tree", ["🌳"], h => { h.shadow(); h.p("M56 112L56 78L72 78L72 112Z", "brown"); h.c(64, 48, 32, "green"); h.c(38, 62, 22, "green"); h.c(90, 62,
      22, "green"); h.c(64, 62, 24, "green", {
      ns: true }); h.hl(50, 36, 8, 5, -30); });
  I("flower", ["🌸"], h => { h.shadow(64, 118, 22); [0, 72, 144, 216, 288].forEach(a => { const r = a * Math.PI / 180; h.e(f(64 + 24 * Math.sin(r)),
      f(58 - 24 * Math.cos(r)), 15, 20, "pink",
      a); }); h.c(64, 58, 12, "yellow"); h.hl(60, 54, 3, 3, 0); });
  I("rainbow", ["🌈"], h => { ["red", "orange", "yellow", "green", "blue", "purple"].forEach((c, i) => { const r = 54 - i * 6.6; h.raw('<path d="M' +
      f(64 - r) + ' 96A' + f(r) + ' ' + f(r) +
      ' 0 0 1 ' + f(64 + r) + ' 96" fill="none" stroke="' + PAL[c][1] + '" stroke-width="7.4" stroke-linecap="round"/>'); }); h.e(22, 100, 16, 10,
          "white", 0, { sw: 2.5 }); h.e(106, 100, 16,
      10, "white", 0, { sw: 2.5 }); });
  I("star", ["⭐"], h => { h.shadow(); h.p("M64 12L79 44L114 49L88 73L95 108L64 91L33 108L40 73L14 49L49 44Z", "yellow", { sw: 4 }); h.hl(52, 40, 6, 3, -35); });
  I("glowstar", ["🌟"], h => { h.raw(
      '<g stroke="#FFD43F" stroke-width="5" stroke-linecap="round" opacity=".8"><path d="M64 4L64 14M64 114L64 124M4 64L14 64M114 64L124 64M22 22L29 29M99 99L106 106M106 22L99 29M29 99L22 106"/></g>');
      h.p("M64 20L77 48L108 52L85 73L91 104L64 89L37 104L43 73L20 52L51 48Z", "yellow", { sw: 4 }); h.hl(53, 44, 5, 3, -35); });
  I("sparkles", ["✨"], h => { h.p("M54 18C58 40 66 48 90 52C66 56 58 64 54 88C50 64 42 56 18 52C42 48 50 40 54 18Z", "yellow", { sw: 3.5 }); h.p(
      "M98 64C100 78 104 82 116 84C104 86 100 90 98 104C96 90 92 86 80 84C92 82 96 78 98 64Z", "yellow", { sw: 3 }); h.p(
      "M92 12C93 20 96 22 102 23C96 24 93 26 92 34C91 26 88 24 82 23C88 22 91 20 92 12Z", "yellow", { sw: 2.5 }); });
  I("moon", ["🌙"], h => { h.shadow(); h.p("M82 18C54 18 32 40 32 68C32 96 54 114 80 112C98 110 108 100 112 92C70 96 54 56 82 18Z", "yellow"); h.hl(
      50, 52, 5, 12, 20); });
  I("sun", ["☀", "☀️"], h => { h.raw(
      '<g stroke="#FFB03F" stroke-width="6" stroke-linecap="round"><path d="M64 8L64 20M64 108L64 120M8 64L20 64M108 64L120 64M24 24L32 32M96 96L104 104M104 24L96 32M32 96L24 104"/></g>');
      h.c(64, 64, 30, "yellow"); h.hl(54, 52, 7, 11, -35); });
  I("drop", ["💧"], h => { h.shadow(64, 116, 24); h.p("M64 14C64 14 28 54 28 78C28 98 44 112 64 112C84 112 100 98 100 78C100 54 64 14 64 14Z", "sky");
      h.hl(48, 78, 5, 12, 12); });
  I("wheat", ["🌾"], h => { h.l("M64 112L64 50", "tan", 4); [[64, 34, 0], [48, 48, -30], [80, 48, 30], [44, 68, -30], [84, 68, 30]].forEach(q => h.e(
      q[0], q[1], 7, 14, "yellow", q[2])); h.l(
      "M64 112L48 100M64 100L80 90", "green", 3); });
  I("leaf", ["🍃", "🌿"], h => { h.p("M20 96C20 50 60 22 108 22C108 70 80 108 32 106Z", "green"); h.l("M26 102C50 78 74 56 96 38", "lime", 3.4); });
  I("mushroom", ["🍄"], h => { h.shadow(); h.p("M50 74L50 104C50 110 56 114 64 114C72 114 78 110 78 104L78 74Z", "cream"); h.p(
      "M14 74C14 40 36 18 64 18C92 18 114 40 114 74Z", "red"); h.c(
      42, 46, 8, "white", { ns: true }); h.c(70, 38, 9, "white", { ns: true }); h.c(90, 58, 7, "white", { ns: true }); });
  I("cloudstorm", ["⛈"], h => { h.p("M30 76C14 76 10 52 30 48C32 28 62 22 74 40C94 34 108 52 100 70C100 74 98 76 92 76Z", "gray"); h.p(
      "M60 70L48 98L62 98L54 120L82 86L66 86L76 70Z", "yellow", { sw: 2.8 }); });

  /* =================== ICON: ĐỒ VẬT =================== */
  I("balloon", ["🎈"], h => { h.l("M64 92C58 102 70 110 64 122", "gray", 3); h.p("M60 88L68 88L64 96Z", "red", { sw: 2.5 }); h.p(
      "M64 14C88 14 100 34 100 54C100 76 82 90 64 90C46 90 28 76 28 54C28 34 40 14 64 14Z", "red"); h.hl(46, 38, 6, 12, 20); });
  I("log", ["🪵"], h => { h.shadow(); h.r(16, 40, 90, 52, 14, "brown"); h.e(100, 66, 16, 26, "tan"); h.e(100, 66, 9, 15, "cream", 0, { sw: 2 }); h.e(
      100, 66, 3, 6, "tan", 0, { ns: true });
      h.l("M32 52L72 52M28 66L64 66M34 80L76 80", "brown", 2.6, { op: .6 }); });
  I("basket", ["🧺"], h => { h.shadow(); h.raw('<path d="M30 54C30 22 98 22 98 54" fill="none" stroke="#A06C3E" stroke-width="7" stroke-linecap="round"/>'); h.p(
      "M14 56L114 56L102 104C100 110 96 112 90 112L38 112C32 112 28 110 26 104Z", "tan"); h.l(
          "M24 74L104 74M28 92L100 92M44 58L40 110M64 58L64 112M84 58L88 110", "brown", 2.6, { op: .55 });
      h.hl(40, 66, 8, 3, 0); });
  I("books", ["📚"], h => { h.shadow(); h.r(14, 84, 100, 26, 6, "blue"); h.r(22, 56, 90, 26, 6, "red", -3); h.r(18, 28, 84, 26, 6, "green", 4); h.l(
      "M20 97L108 97M26 69L102 69M26 41L90 41",
      "white", 3, { op: .55 }); });
  I("book", ["📖", "📘", "📒", "📓"], h => { h.shadow(); h.p("M64 36C48 26 28 28 14 34L14 98C28 92 48 92 64 102Z", "cream"); h.p(
      "M64 36C80 26 100 28 114 34L114 98C100 92 80 92 64 102Z",
      "cream"); h.l("M24 48C36 44 48 46 58 52M24 62C36 58 48 60 58 66M70 52C80 46 92 44 104 48M70 66C80 60 92 58 104 62", "blue", 2.6, { op: .6 }); });
  I("memo", ["📝"], h => { h.shadow(); h.r(22, 18, 70, 92, 10, "white"); h.l("M34 40L78 40M34 56L78 56M34 72L66 72M34 88L56 88", "blue", 3, { op: .6 }); h.p(
      "M96 56L112 72L82 102L66 106L70 90Z", "yellow", { sw: 2.8 }); h.p("M66 106L70 90L76 96Z", "tan", { sw: 2 }); });
  I("pencil", ["✏", "✏️", "🖊", "🖋"], h => { h.shadow(); h.p("M96 16L112 32L52 92L28 100L36 76Z", "yellow", { sw: 3.4 }); h.p(
      "M96 16L112 32L104 40L88 24Z", "pink"); h.p(
      "M36 76L52 92L28 100Z", "cream", { sw: 2.8 }); h.p("M32 90L36 94L28 100Z", "dark", { sw: 2 }); h.l("M48 66L74 92", "orange", 2.6, { op: .6 }); });
  I("setsquare", ["📐"], h => { h.shadow(); h.p("M20 20L20 108L108 108Z", "teal"); h.p("M36 56L36 92L72 92Z", "white", { ns: true }); h.l(
      "M20 36L28 36M20 52L28 52M20 68L28 68M20 84L28 84M44 108L44 100M60 108L60 100M76 108L76 100M92 108L92 100", "dark", 2.2); });
  I("ruler", ["📏"], h => { h.shadow(); h.r(10, 44, 108, 40, 8, "yellow", -8); h.l(
      "M28 74L28 64M42 71L42 59M56 68L56 62M70 65L70 53M84 62L84 56M98 59L98 47", "dark", 2.4); });
  I("box", ["📦"], h => { h.shadow(); h.p("M64 18L112 40L112 92L64 112L16 92L16 40Z", "tan"); h.p("M64 18L112 40L64 62L16 40Z", "cream"); h.l(
      "M64 62L64 112", "brown", 3, { op: .5 }); h.r(
      52, 36, 24, 10, 4, "brown", 0, { ns: true }); h.raw('<path d="M64 62L64 112" stroke="#AC7E3F" stroke-width="3" opacity=".5"/>'); });
  I("dice", ["🎲"], h => { h.shadow(); h.r(18, 18, 92, 92, 24, "white"); [[42, 42], [64, 64], [86, 86], [86, 42], [42, 86]].forEach(q => h.dot(q[0],
      q[1], 7)); h.hl(36, 30, 10, 3, 0); });
  I("headphones", ["🎧"], h => { h.raw(
      '<path d="M24 78L24 62C24 34 44 18 64 18C84 18 104 34 104 62L104 78" fill="none" stroke="#3E3A63" stroke-width="9" stroke-linecap="round"/>');
      h.r(14,
      66, 24, 40, 12, "purple"); h.r(90, 66, 24, 40, 12, "purple"); h.hl(22, 78, 3, 9, 0); });
  I("clock", ["🕒", "⏰", "⏱", "🕐"], h => { h.shadow(); h.c(64, 66, 46, "white", { sw: 5 }); h.c(64, 66, 40, "cream", { ns: true }); [0, 90, 180, 270].forEach(a => {
      const r = a * Math.PI / 180; h.dot(f(64 + 33 * Math.sin(r)), f(66 - 33 * Math.cos(r)), 3, "#B3303F"); }); h.ink("M64 66L64 42", 5); h.ink(
          "M64 66L84 66", 5); h.dot(64, 66, 4.5,
      "#B3303F"); });
  I("ball", ["⚽"], h => { h.shadow(); h.c(64, 64, 46, "white", { sw: 4 }); h.p("M64 44L82 57L75 79L53 79L46 57Z", "dark", { sw: 2 }); h.raw(
      '<path d="M64 44L64 24M82 57L102 50M75 79L88 96M53 79L40 96M46 57L26 50" stroke="#3E3A63" stroke-width="3" stroke-linecap="round"/>'); h.hl(44, 36, 8, 4, -30); });
  I("car", ["🚗"], h => { h.shadow(); h.p(
      "M12 84L12 68C12 62 16 58 22 56L40 54L52 36C54 32 58 30 62 30L84 30C90 30 94 32 98 38L106 56C114 58 118 64 118 72L118 84Z", "red"); h.p(
      "M48 54L58 38L80 38L92 54Z", "sky", { sw: 3 }); h.c(36, 88, 14, "dark"); h.c(36, 88, 6, "gray", { ns: true }); h.c(94, 88, 14, "dark"); h.c(94,
          88, 6, "gray", { ns: true }); h.e(112,
      70, 5, 6, "yellow", 0, { ns: true }); h.hl(30, 62, 8, 3, 0); });
  I("bus", ["🚌"], h => { h.shadow(); h.r(8, 30, 112, 70, 14, "yellow"); h.r(16, 40, 24, 22, 5, "sky"); h.r(46, 40, 24, 22, 5, "sky"); h.r(76, 40, 24,
      22, 5, "sky"); h.c(34, 102, 12,
      "dark"); h.c(34, 102, 5, "gray", { ns: true }); h.c(94, 102, 12, "dark"); h.c(94, 102, 5, "gray", { ns: true }); h.l("M12 80L116 80", "orange", 3.4); });
  I("bike", ["🚲"], h => { h.raw(
      '<g fill="none" stroke="#5B66C4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><circle cx="28" cy="84" r="22"/><circle cx="100" cy="84" r="22"/><path d="M28 84L52 50L88 50L100 84M52 50L64 84L28 84M64 84L84 50M48 40L60 40M84 50L92 36L100 34"/></g>');
      h.c(64, 84, 5, "red"); });
  I("backpack", ["🎒"], h => { h.shadow(); h.raw('<path d="M44 30C44 12 84 12 84 30" fill="none" stroke="#2D326E" stroke-width="7" stroke-linecap="round"/>'); h.p(
      "M24 52C24 38 36 30 64 30C92 30 104 38 104 52L104 104C104 110 100 114 94 114L34 114C28 114 24 110 24 104Z", "blue"); h.r(40, 74, 48, 30, 9,
          "navy"); h.l("M40 84L88 84", "white", 3, {
      op: .55 }); h.r(56, 66, 16, 12, 4, "yellow", 0, { sw: 2.4 }); h.hl(40, 44, 8, 3, -10); });
  I("house", ["🏠", "🏡"], h => { h.shadow(); h.r(24, 54, 80, 58, 8, "cream"); h.p("M12 60L64 16L116 60Z", "red"); h.r(52, 76, 24, 36, 8, "brown");
      h.r(30, 66, 18, 18, 4, "sky"); h.r(80, 66,
      18, 18, 4, "sky"); h.r(84, 22, 12, 20, 3, "tan", 0, { sw: 2.5 }); h.dot(70, 96, 2, "#FFE6B0"); });
  I("gift", ["🎁"], h => { h.shadow(); h.r(18, 56, 92, 56, 10, "red"); h.r(12, 40, 104, 22, 8, "pink"); h.r(56, 40, 16, 72, 4, "yellow", 0, { sw: 2.5 }); h.p(
      "M64 40C48 40 36 22 48 18C58 14 64 30 64 40Z", "yellow"); h.p("M64 40C80 40 92 22 80 18C70 14 64 30 64 40Z", "yellow"); h.hl(34, 74, 6, 3, 0); });
  I("trophy", ["🏆"], h => { h.shadow(); h.raw(
      '<path d="M30 30C8 30 10 66 36 70M98 30C120 30 118 66 92 70" fill="none" stroke="#C99B10" stroke-width="7" stroke-linecap="round"/>'); h.p(
      "M28 20L100 20C100 62 88 82 64 82C40 82 28 62 28 20Z", "yellow"); h.r(56, 80, 16, 16, 3, "yellow"); h.r(38, 96, 52, 16, 6, "orange"); h.p(
      "M64 32L68 42L79 43L71 50L73 61L64 55L55 61L57 50L49 43L60 42Z", "white", { ns: true }); h.hl(42, 36, 4, 16, 8); });
  I("lock", ["🔒"], h => { h.shadow(); h.raw(
      '<path d="M40 56L40 40C40 14 88 14 88 40L88 56" fill="none" stroke="#6F7893" stroke-width="9" stroke-linecap="round"/>'); h.r(26, 54, 76, 58,
      14,
      "yellow"); h.c(64, 80, 8, "dark", { ns: true }); h.r(61, 82, 6, 14, 3, "dark", 0, { ns: true }); h.hl(40, 66, 8, 3, 0); });
  I("bulb", ["💡"], h => { h.p("M64 10C40 10 26 28 26 48C26 64 36 70 42 82L86 82C92 70 102 64 102 48C102 28 88 10 64 10Z", "yellow"); h.r(44, 84, 40,
      12, 5, "gray"); h.r(48, 98, 32, 12, 6,
      "gray"); h.l("M52 48L64 64L76 48", "orange", 3, { op: .7 }); h.hl(46, 32, 6, 11, 20); });
  I("target", ["🎯"], h => { h.shadow(); h.c(64, 66, 46, "red"); h.c(64, 66, 33, "white", { ns: true }); h.c(64, 66, 22, "red", { ns: true }); h.c(64,
      66, 10, "white", { ns: true }); h.l(
      "M64 66L108 22", "brown", 4); h.p("M108 22L100 22L110 12L116 24Z", "yellow", { sw: 2 }); });
  I("fire", ["🔥"], h => { h.shadow(); h.p(
      "M64 10C70 32 94 46 94 74C94 98 80 114 64 114C48 114 34 98 34 74C34 58 44 50 50 38C52 50 58 54 62 52C60 40 58 26 64 10Z", "orange"); h.p(
      "M64 54C68 68 82 74 82 90C82 102 74 110 64 110C54 110 46 102 46 90C46 76 58 70 64 54Z", "yellow", { sw: 2.5 }); });
  I("party", ["🎉"], h => { h.p("M18 112L48 36L84 72Z", "yellow"); h.l("M30 82L58 62M38 98L74 74", "orange", 3, { op: .7 }); h.raw(
      '<path d="M60 22C70 36 82 30 90 40M84 52C94 56 102 52 112 60" fill="none" stroke="#FF7DB0" stroke-width="4" stroke-linecap="round"/>'); h.c(96,
          22, 5, "blue", { ns: true }); h.c(106,
      44, 4, "red", { ns: true }); h.c(112, 74, 5, "green", { ns: true }); h.c(76, 14, 4, "purple", { ns: true }); });
  I("sailboat", ["⛵"], h => { h.shadow(64, 118, 40); h.l("M64 14L64 88", "brown", 4); h.p("M68 18L98 80L68 80Z", "white"); h.p("M60 30L34 80L60 80Z", "sky"); h.p(
      "M16 88L112 88C106 104 94 112 80 112L48 112C34 112 22 104 16 88Z", "red"); });
  I("fishingrod", ["🎣"], h => { h.l("M24 112L92 18", "brown", 6); h.raw('<path d="M92 18C112 24 112 54 100 74" fill="none" stroke="#6F7893" stroke-width="2.6"/>'); h.p(
      "M100 74C104 80 100 88 94 88C96 82 94 78 100 74Z", "gray", { sw: 2 }); h.e(100, 100, 12, 7, "orange"); h.p("M110 100L120 92L120 108Z", "orange", { sw: 2 }); });
  I("snowman", ["⛄"], h => { h.shadow(); h.c(64, 90, 28, "white"); h.c(64, 50, 20, "white"); h.dot(58, 46, 2.6); h.dot(70, 46, 2.6); h.p(
      "M64 52L80 56L64 58Z", "orange", { sw: 2 }); h.dot(
      64, 84, 3); h.dot(64, 96, 3); h.p("M48 36L80 36L76 16L52 16Z", "dark", { sw: 2.5 }); h.r(44, 32, 40, 8, 4, "dark"); });
  I("cap", ["🧢"], h => { h.shadow(); h.p("M24 78C20 46 40 28 66 28C92 28 108 46 106 78Z", "blue"); h.p(
      "M96 78C108 76 120 80 122 86C110 90 100 88 96 78Z", "navy"); h.dot(66, 30, 4,
      "#1F8E80"); h.l("M66 30C60 44 58 62 62 78", "white", 2.6, { op: .5 }); h.hl(44, 48, 8, 5, -25); });
  I("hat", ["🎩"], h => { h.shadow(); h.e(64, 90, 50, 12, "dark"); h.r(34, 24, 60, 68, 10, "dark"); h.r(34, 70, 60, 14, 0, "red", 0, { ns: true });
      h.hl(48, 44, 4, 14, 0); });
  I("magnifier", ["🔍", "🔎"], h => { h.l("M82 84L112 112", "brown", 12); h.c(54, 54, 36, "sky"); h.c(54, 54, 36, "white", { ns: true, op: .25 }); h.raw(
      '<circle cx="54" cy="54" r="36" fill="none" stroke="#3E3A63" stroke-width="8"/>'); h.hl(40, 38, 9, 5, -35); });
  I("chair", ["🪑"], h => { h.shadow(); h.r(30, 14, 12, 52, 5, "brown"); h.r(32, 14, 58, 12, 5, "brown", 0, { ns: true }); h.r(26, 60, 76, 16, 6,
      "tan"); h.r(32, 74, 10, 40, 4, "brown");
      h.r(86, 74, 10, 40, 4, "brown"); });
  I("door", ["🚪"], h => { h.shadow(); h.r(28, 12, 72, 102, 10, "brown"); h.r(38, 24, 52, 38, 6, "tan", 0, { sw: 2.5 }); h.r(38, 68, 52, 36, 6, "tan",
      0, { sw: 2.5 }); h.c(88, 66, 5, "yellow", { sw: 2.5 }); });
  I("drum", ["🥁"], h => { h.shadow(); h.p("M20 56L20 92C20 104 40 112 64 112C88 112 108 104 108 92L108 56Z", "red"); h.e(64, 56, 44, 14, "cream"); h.l(
      "M28 62L44 106M52 70L56 110M76 70L72 110M100 62L84 106", "white", 2.6, { op: .5 }); h.l("M30 14L66 50M98 14L62 50", "tan", 5); });
  I("candle", ["🕯", "🕯️"], h => { h.shadow(); h.p("M64 8C74 20 76 28 64 36C52 28 54 20 64 8Z", "orange", { sw: 2.6 }); h.r(46, 38, 36, 74, 10,
      "cream"); h.l("M64 34L64 40", "dark", 2.4);
      h.hl(54, 64, 3, 16, 0); });
  I("eye", ["👁", "👁️"], h => { h.p("M8 64C28 32 100 32 120 64C100 96 28 96 8 64Z", "white"); h.c(64, 64, 24, "blue"); h.c(64, 64, 11, "dark", { ns:
      true }); h.dot(72, 56, 4, "#fff"); });
  I("unicorn", ["🦄"], h => { h.shadow(); h.p("M62 8L72 40L52 40Z", "yellow", { sw: 2.5 }); h.e(36, 50, 12, 18, "purple", -12); h.e(64, 74, 38, 36,
      "white"); h.e(64, 90, 22, 16, "pink");
      h.eye(50, 68, 4.8); h.eye(78, 68, 4.8); h.dot(58, 90, 2.4, "#B3303F"); h.dot(70, 90, 2.4, "#B3303F"); h.p(
          "M92 40C108 48 112 66 104 80C102 66 98 56 88 52Z", "pink", { sw: 2.5 }); });
  I("megaphone", ["📢"], h => { h.shadow(); h.p("M18 52L68 28L68 100L18 76Z", "orange"); h.r(10, 50, 14, 28, 6, "dark"); h.r(66, 26, 14, 76, 6, "yellow"); h.raw(
      '<path d="M92 48C100 56 100 72 92 80M102 38C116 52 116 76 102 90" fill="none" stroke="#C76A18" stroke-width="5" stroke-linecap="round"/>'); h.r(
          26, 80, 14, 26, 6, "brown", 14); });
  I("question", ["❓"], h => { h.shadow(); h.raw(
      '<path d="M40 44C40 22 90 18 90 46C90 62 66 66 64 82" fill="none" stroke="#B3303F" stroke-width="20" stroke-linecap="round"/><path d="M40 44C40 22 90 18 90 46C90 62 66 66 64 82" fill="none" stroke="#F25A5A" stroke-width="13" stroke-linecap="round"/>');
      h.c(64, 104, 11, "red"); });
  I("check", ["✅"], h => { h.c(64, 64, 50, "green"); h.raw(
      '<path d="M38 66L56 84L92 44" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>'); });
  I("map", ["🗺", "🗺️", "📍"], h => { h.shadow(); h.p("M14 28L44 20L84 30L114 22L114 98L84 106L44 96L14 104Z", "cream"); h.l(
      "M44 20L44 96M84 30L84 106", "tan", 3, { op: .7 }); h.p(
      "M64 40C56 40 50 46 50 54C50 66 64 80 64 80C64 80 78 66 78 54C78 46 72 40 64 40Z", "red", { sw: 2.8 }); h.c(64, 54, 5, "white", { ns: true }); });
  I("rocket", ["🚀"], h => { h.shadow(); h.p("M64 8C90 24 94 58 90 84L38 84C34 58 38 24 64 8Z", "white"); h.c(64, 48, 13, "sky"); h.p(
      "M38 74L18 100L40 94Z", "red", { sw: 2.8 }); h.p(
      "M90 74L110 100L88 94Z", "red", { sw: 2.8 }); h.p("M52 86L76 86L64 116Z", "orange", { sw: 2.8 }); });

  /* =================== ICON: HÌNH MÀU (câu hỏi màu sắc/hình học) =================== */
  [["redball", "🔴", "red"], ["blueball", "🔵", "blue"], ["yellowball", "🟡", "yellow"], ["greenball", "🟢", "green"], ["purpleball", "🟣", "purple"],
      ["orangeball", "🟠", "orange"],
      ["brownball", "🟤", "brown"], ["whiteball", "⚪", "white"], ["blackball", "⚫", "dark"]].forEach(a => I(a[0], [a[1]], h => { h.shadow(64, 116,
          30); h.c(64, 62, 44, a[2]); h.hl(46, 42,
      10, 16, 30); h.hl(88, 90, 5, 3, -40); }));
  I("bluesquare", ["🟦"], h => { h.shadow(64, 118, 36); h.r(16, 16, 96, 96, 22, "blue"); h.hl(36, 34, 12, 5, 0); });
  I("graysquare", ["🔲"], h => { h.shadow(64, 118, 36); h.r(16, 16, 96, 96, 22, "dark"); h.r(36, 36, 56, 56, 12, "white", 0, { ns: true }); });
  I("redtriangle", ["🔺"], h => { h.shadow(64, 118, 36); h.p("M64 16L116 106C118 110 116 114 110 114L18 114C12 114 10 110 12 106Z", "red"); h.hl(54, 48, 6, 14, 28); });
  I("note", ["🎶", "🎵"], h => { h.raw(
      '<path d="M48 30L48 92M96 20L96 82M48 30L96 20" fill="none" stroke="#5F3BA9" stroke-width="9" stroke-linecap="round"/>'); h.e(36, 96, 17, 13,
      "purple",
      -20); h.e(84, 86, 17, 13, "purple", -20); h.hl(30, 92, 5, 3, -20); });
  I("pear", ["🍐"], h => { h.shadow(); h.p(
      "M64 30C76 30 80 44 82 54C98 62 106 78 100 94C94 108 76 114 64 112C52 114 34 108 28 94C22 78 30 62 46 54C48 44 52 30 64 30Z", "lime"); h.l(
      "M64 30C64 22 68 16 74 12", "brown", 4); h.p("M68 22C78 10 92 12 94 18C88 28 76 28 68 22Z", "green"); h.hl(46, 78, 6, 12, -20); });
  I("peach", ["🍑"], h => { h.shadow(); h.p("M64 36C40 28 20 44 22 72C24 100 48 114 64 106C80 114 104 100 106 72C108 44 88 28 64 36Z", "pink"); h.raw(
      '<path d="M64 36C56 52 56 82 64 106" fill="none" stroke="#C84F84" stroke-width="3" stroke-linecap="round" opacity=".6"/>'); h.p(
          "M66 34C74 20 90 20 94 28C88 38 74 40 66 34Z", "green");
      h.hl(40, 62, 6, 12, -25); });
  I("icecream", ["🍦"], h => { h.shadow(); h.p("M34 62L94 62L64 118Z", "tan"); h.l("M46 70L64 106M62 66L72 100M80 66L66 106", "brown", 2.4, { op:
      .5 }); h.e(64, 54, 36, 16, "pink"); h.e(64,
      36, 28, 15, "cream"); h.p("M52 28C52 16 76 16 76 28Z", "pink"); h.c(64, 14, 6, "red"); });
  I("coconut", ["🥥"], h => { h.shadow(); h.c(64, 66, 42, "brown"); h.c(52, 52, 5, "dark", { ns: true }); h.c(70, 50, 5, "dark", { ns: true }); h.c(
      62, 64, 5, "dark", { ns: true }); h.hl(44,
      46, 8, 12, -30); });
  I("mango", ["🥭"], h => { h.shadow(); h.p("M30 54C34 30 70 22 92 40C110 56 108 90 84 106C62 120 30 100 30 54Z", "orange"); h.p(
      "M60 30C66 20 80 18 86 24C78 34 66 36 60 30Z", "green");
      h.hl(50, 56, 7, 14, 20); });
  I("sheep", ["🐑", "🐏"], h => { h.shadow(); [[34, 64], [94, 64], [46, 42], [82, 42], [64, 36]].forEach(q => h.c(q[0], q[1], 20, "white")); h.c(64,
      62, 28, "white", { ns: true }); h.e(64,
      76, 24, 28, "dark"); h.eye(54, 72, 4.4); h.eye(74, 72, 4.4); h.dot(60, 86, 2); h.dot(68, 86, 2); });
  I("horse", ["🐴"], h => { h.shadow(); h.p("M40 14L52 34L88 38C104 56 108 84 100 112L50 112C38 96 38 62 40 14Z", "brown"); h.p(
      "M40 14C28 40 30 70 42 96L50 100C44 70 46 40 52 34Z", "dark");
      h.eye(72, 56, 4.4); h.e(90, 98, 16, 12, "tan"); h.dot(86, 98, 2.4); h.p("M44 18L56 6L58 28Z", "brown", { sw: 2.5 }); });

};
