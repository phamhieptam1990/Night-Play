/* Định nghĩa icon Học Vui — nhóm học tập, cơ thể, quần áo, con người (một phần của scripts/learn/gen-icons.js; I = đăng ký icon, f = làm tròn, PAL = bảng màu, INK = màu nét). */
"use strict";
module.exports = function (I, f, PAL, INK) {
  /* =================== ICON: ĐỢT 3 (nhóm học tập, cơ thể, quần áo, thời tiết, phương tiện) =================== */
  I("abc", ["🔤", "🔡", "🔠"], h => { h.shadow(64, 118, 40); h.r(10, 24, 108, 78, 20, "blue");
      const st = 'fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"'; h.raw('<g ' +
      st +
          '><circle cx="34" cy="66" r="10"/><path d="M44 52L44 80"/><path d="M58 40L58 80"/><circle cx="68" cy="66" r="10"/><path d="M104 56A12 12 0 1 0 104 76"/></g>');
          h.hl(30, 36, 12, 3,
      0); });
  I("n123", ["🔢"], h => { h.shadow(64, 118, 40); h.r(10, 24, 108, 78, 20, "orange"); const w = (d) => h.raw('<path d="' + d +
      '" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'); w("M30 54L38 46L38 78"); w(
          "M54 52C54 44 70 44 70 54C70 62 54 70 54 78L72 78"); w(
      "M86 50C94 42 108 48 100 58C112 62 104 82 86 76"); h.hl(30, 36, 12, 3, 0); });
  I("chart", ["📊", "📈"], h => { h.shadow(); h.r(12, 16, 104, 96, 14, "white"); h.r(26, 66, 20, 36, 5, "red"); h.r(54, 42, 20, 60, 5, "yellow"); h.r(
      82, 28, 20, 74, 5, "green"); });
  I("paw", ["🐾"], h => { h.shadow(); h.e(64, 82, 26, 22, "brown"); h.e(30, 56, 10, 14, "brown", -20); h.e(52, 36, 10, 14, "brown", -8); h.e(76, 36,
      10, 14, "brown", 8); h.e(98, 56, 10, 14,
      "brown", 20); h.hl(52, 74, 6, 3, -20); });
  I("calendar", ["📅"], h => { h.shadow(); h.r(14, 22, 100, 90, 14, "white"); h.p("M14 36C14 28 20 22 28 22L100 22C108 22 114 28 114 36L114 50L14 50Z", "red"); h.l(
      "M38 14L38 30M90 14L90 30", "gray", 6); [[36, 66], [64, 66], [92, 66], [36, 88], [64, 88]].forEach(q => h.r(q[0] - 9, q[1] - 8, 18, 16, 4,
          "sky", 0, { ns: true })); });
  I("tube", ["🧪"], h => { h.shadow(); h.p("M44 14L84 14L84 28L74 34L74 70L102 108C106 116 100 120 92 120L36 120C28 120 22 116 26 108L54 70L54 34L44 28Z", "white"); h.p(
      "M54 72L36 104C34 108 36 112 40 112L88 112C92 112 94 108 92 104L74 72Z", "green", { sw: 0 }); h.c(60, 96, 4, "lime", { ns: true }); h.c(74, 86,
          3, "lime", { ns: true }); });
  I("ear", ["👂"], h => { h.shadow(); h.p("M64 12C36 12 24 36 28 62C32 84 44 90 48 104C52 118 74 118 80 104C86 88 100 82 100 56C100 30 86 12 64 12Z", "skin"); h.raw(
      '<path d="M64 34C50 34 46 50 52 62C56 70 62 72 62 82" fill="none" stroke="#C98A5C" stroke-width="5" stroke-linecap="round"/>'); h.hl(46, 34, 5, 9, 22); });
  I("gear", ["⚙", "⚙️"], h => { h.shadow(); h.raw(
      '<g fill="#A9B1C8" stroke="#6F7893" stroke-width="3" stroke-linejoin="round"><path d="M56 10L72 10L74 24C78 25 82 27 86 30L98 22L108 34L100 46C102 50 103 54 104 58L118 60L118 76L104 78C103 82 102 86 100 90L108 102L96 112L84 104C80 106 76 108 72 109L70 122L54 122L52 109C48 108 44 106 40 104L28 112L18 100L26 88C24 84 23 80 22 76L8 74L8 58L22 56C23 52 24 48 26 44L18 32L30 22L42 30C46 27 50 25 54 24Z" transform="translate(0 -4) scale(.92) translate(5 6)"/></g>');
      h.c(64, 62, 16, "white"); });
  I("palette", ["🎨"], h => { h.shadow(); h.p(
      "M64 12C34 12 12 34 12 62C12 90 36 112 62 112C74 112 76 102 70 96C64 90 68 82 80 82L94 82C106 82 116 74 116 60C116 32 94 12 64 12Z", "cream");
      h.c(36, 56, 9, "red"); h.c(54, 34, 9, "yellow"); h.c(80, 32, 9, "green"); h.c(98, 54, 9, "blue"); });
  I("ribbon", ["🎀"], h => { h.shadow(64, 118, 36); h.p("M64 60L20 34C10 40 10 78 20 90Z", "pink"); h.p("M64 60L108 34C118 40 118 78 108 90Z",
      "pink"); h.p("M60 66L36 112L52 106L64 120Z",
      "pink", { sw: 2.8 }); h.p("M68 66L92 112L76 106L64 120Z", "pink", { sw: 2.8 }); h.e(64, 62, 13, 15, "red"); h.hl(60, 56, 3, 5, 0); });
  I("tooth", ["🦷"], h => { h.shadow(); h.p(
      "M64 24C48 12 22 20 26 48C28 62 34 70 36 88C38 104 46 114 52 104C56 96 58 86 64 86C70 86 72 96 76 104C82 114 90 104 92 88C94 70 100 62 102 48C106 20 80 12 64 24Z",
          "white"); h.hl(42,
      40, 6, 10, -20); });
  I("gamepad", ["🎮"], h => { h.shadow(); h.p(
      "M30 38C14 38 8 60 12 86C14 100 28 104 38 92L48 80L80 80L90 92C100 104 114 100 116 86C120 60 114 38 98 38Z", "purple"); h.raw(
      '<path d="M36 52L36 70M27 61L45 61" stroke="#fff" stroke-width="6" stroke-linecap="round"/>'); h.c(86, 52, 5, "yellow", { ns: true }); h.c(98,
          62, 5, "red", { ns: true }); h.c(86, 72,
      5, "green", { ns: true }); h.c(74, 62, 5, "blue", { ns: true }); });
  I("blockA", ["🅰", "🅰️"], h => { h.shadow(64, 118, 36); h.r(14, 14, 100, 100, 24, "red"); h.raw(
      '<path d="M40 88L64 34L88 88M50 70L78 70" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'); });
  I("blockB", ["🅱", "🅱️"], h => { h.shadow(64, 118, 36); h.r(14, 14, 100, 100, 24, "blue"); h.raw(
      '<path d="M46 34L46 94M46 34L68 34C84 34 84 62 68 62L46 62M68 62C88 62 88 94 68 94L46 94" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>');
      });
  I("ten", ["🔟"], h => { h.shadow(64, 118, 36); h.r(14, 14, 100, 100, 24, "green"); h.raw(
      '<path d="M36 40L46 32L46 90M62 34L62 90L92 90L92 34Z" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'); });
  I("wave", ["👋", "✋"], h => { h.shadow(); h.p(
      "M40 60L40 28C40 20 52 20 52 28L52 54L56 22C56 14 68 14 68 22L66 54L74 28C76 20 88 24 86 32L80 62L92 46C98 40 108 48 102 56L86 90C82 104 70 114 54 114C36 114 26 96 26 82L26 62C26 54 40 52 40 60Z",
      "skin"); h.hl(40, 76, 5, 12, 10); });
  I("plane", ["✈", "✈️"], h => { h.shadow(64, 118, 30); h.p(
      "M64 8C70 8 74 14 74 24L74 50L116 76L116 88L74 74L74 96L88 108L88 118L64 112L40 118L40 108L54 96L54 74L12 88L12 76L54 50L54 24C54 14 58 8 64 8Z",
          "white"); h.c(64, 30, 5, "sky", { ns:
      true }); });
  I("mic", ["🎤", "🎙", "🎙️"], h => { h.shadow(64, 118, 24); h.raw(
      '<path d="M30 60C30 90 98 90 98 60M64 90L64 108M46 110L82 110" fill="none" stroke="#6F7893" stroke-width="7" stroke-linecap="round"/>'); h.r(44,
          12, 40, 66, 20, "gray"); h.l(
      "M48 30L80 30M48 44L80 44M48 58L80 58", "white", 3, { op: .6 }); });
  I("smile", ["🙂", "😊", "😀"], h => { h.shadow(); h.c(64, 62, 46, "yellow"); h.eye(48, 54, 5.4); h.eye(80, 54, 5.4); h.ink("M42 76Q64 96 86 76", 4);
      h.blush(36, 74, 7); h.blush(92, 74, 7);
      h.hl(46, 36, 8, 4, -25); });
  I("mail", ["✉", "✉️"], h => { h.shadow(); h.r(12, 28, 104, 74, 12, "white"); h.raw(
      '<path d="M16 36L64 72L112 36" fill="none" stroke="#B5BCD2" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>'); h.c(98, 90, 12,
          "red", { sw: 2.5 }); });
  I("news", ["📰"], h => { h.shadow(); h.r(12, 22, 104, 84, 10, "white"); h.r(22, 32, 36, 26, 4, "sky", 0, { ns: true }); h.l(
      "M66 36L106 36M66 48L106 48M66 60L96 60M24 70L104 70M24 82L104 82M24 94L80 94", "gray", 3.4); });
  I("tent", ["⛺"], h => { h.shadow(64, 118, 40); h.p("M64 16L118 108L10 108Z", "orange"); h.p("M64 50L84 108L44 108Z", "brown", { sw: 2.8 }); h.l(
      "M64 16L64 50", "brown", 3); });
  I("shield", ["🛡", "🛡️"], h => { h.shadow(); h.p("M64 10L108 26C108 70 94 100 64 118C34 100 20 70 20 26Z", "blue"); h.p(
      "M64 24L94 34C92 66 82 88 64 102Z", "sky", { sw: 0 }); h.p(
      "M64 40L70 54L84 56L74 66L76 80L64 73L52 80L54 66L44 56L58 54Z", "yellow", { ns: true }); });
  I("rice", ["🍚", "🍜"], h => { h.shadow(); h.e(64, 54, 40, 24, "white"); h.p("M16 56L112 56C112 92 92 110 64 110C36 110 16 92 16 56Z", "teal"); h.raw(
      '<g fill="#fff" opacity=".9"><ellipse cx="44" cy="46" rx="5" ry="3" transform="rotate(20 44 46)"/><ellipse cx="62" cy="40" rx="5" ry="3"/><ellipse cx="80" cy="46" rx="5" ry="3" transform="rotate(-20 80 46)"/></g>');
      });
  I("cabbage", ["🥬", "🧅", "🧄"], h => { h.shadow(); h.c(64, 68, 42, "lime"); h.raw(
      '<path d="M64 30C50 50 50 84 64 108M64 30C80 50 80 84 64 108M28 58C50 62 78 62 100 58" fill="none" stroke="#6E9A1C" stroke-width="3" stroke-linecap="round" opacity=".7"/>');
          h.hl(44,
      52, 7, 12, -25); });
  I("umbrella", ["☂", "☂️"], h => { h.l("M64 54L64 106C64 116 80 116 80 106", "gray", 5); h.p(
      "M10 62C10 30 36 14 64 14C92 14 118 30 118 62C108 54 98 54 90 62C82 54 72 54 64 62C56 54 46 54 38 62C30 54 20 54 10 62Z", "red"); h.hl(40, 34, 10, 4, -25); });
  I("goat", ["🐐"], h => { h.shadow(); h.raw(
      '<path d="M42 30C36 10 18 16 20 34M86 30C92 10 110 16 108 34" fill="none" stroke="#AC7E3F" stroke-width="7" stroke-linecap="round"/>'); h.e(26,
      52, 14, 8, "white", -25); h.e(102, 52, 14, 8, "white", 25); h.e(64, 66, 34, 38, "white"); h.e(64, 90, 18, 14, "cream"); h.eye(50, 60, 4.6); h.eye(78, 60, 4.6); h.p(
      "M58 110L64 124L70 110Z", "white", { sw: 2.5 }); });
  I("shell", ["🐚"], h => { h.shadow(); h.p("M64 20C34 20 14 50 18 86C20 100 36 110 64 110C92 110 108 100 110 86C114 50 94 20 64 20Z", "pink"); h.raw(
      '<path d="M64 20L64 110M40 28L36 108M88 28L92 108M22 66L106 66" fill="none" stroke="#C84F84" stroke-width="3" stroke-linecap="round" opacity=".5"/>');
          h.hl(44, 40, 7, 10, -25); });
  I("bone", ["🦴"], h => { h.shadow(); h.p(
      "M32 40C20 40 16 52 24 58C16 62 16 76 28 78C36 80 40 74 42 72L86 72C88 74 92 80 100 78C112 76 112 62 104 58C112 52 108 40 96 40C90 40 88 46 86 48L42 48C40 46 38 40 32 40Z",
          "cream", {
      sw: 3 }); h.hl(50, 56, 12, 2.6, 0); });
  I("shoe", ["👟", "🩴"], h => { h.shadow(64, 112, 44); h.p(
      "M12 80L12 48C12 40 20 38 28 44C40 52 52 50 62 44L92 62C102 66 116 70 116 84L116 94L12 94Z", "red"); h.r(10, 90, 108, 16, 8,
      "white"); h.l("M50 54L58 62M60 50L68 58M70 56L78 64", "white", 3.4); h.hl(30, 56, 8, 3, 0); });
  I("bed", ["🛏", "🛏️"], h => { h.shadow(); h.r(8, 54, 112, 40, 8, "blue"); h.r(14, 34, 28, 26, 10, "white"); h.r(8, 94, 12, 18, 4, "brown", 0); h.r(
      108, 94, 12, 18, 4, "brown", 0); h.r(8,
      28, 12, 40, 4, "brown", 0); h.l("M40 70L116 70", "sky", 3, { op: .6 }); });
  I("wind", ["💨"], h => { h.raw(
      '<g fill="none" stroke="#7CC3F5" stroke-width="9" stroke-linecap="round"><path d="M14 46L74 46C92 46 92 22 74 24"/><path d="M14 68L98 68C116 68 116 94 98 92"/><path d="M26 90L66 90C80 90 80 110 66 108"/></g>');
      });
  I("zzz", ["💤"], h => { h.raw(
      '<g fill="none" stroke="#9066E9" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M24 36L52 36L24 68L52 68"/><path d="M62 18L82 18L62 42L82 42" stroke-width="7"/><path d="M80 66L112 66L80 104L112 104"/></g>');
      });
  I("money", ["💵", "💰", "💯"], h => { h.shadow(); h.r(10, 34, 108, 60, 10, "green"); h.c(64, 64, 18, "lime", { sw: 2.6 }); h.raw(
      '<path d="M60 56L68 56M64 56L64 72M58 72L70 72" fill="none" stroke="#2D9048" stroke-width="3.4" stroke-linecap="round"/>'); h.c(26, 64, 6,
          "lime", { ns: true }); h.c(102, 64, 6,
      "lime", { ns: true }); });
  I("sunglasses", ["🕶", "🕶️"], h => { h.p("M10 50L118 50L112 76C108 94 78 96 74 74L68 62L60 62L54 74C50 96 20 94 16 76Z", "dark"); h.hl(34, 62, 12,
      3, -10); h.hl(94, 62, 12, 3, -10); });
  I("crown", ["👑"], h => { h.shadow(); h.p("M14 44L36 62L64 24L92 62L114 44L104 100L24 100Z", "yellow"); h.c(14, 42, 7, "red", { sw: 2.5 }); h.c(114,
      42, 7, "red", { sw: 2.5 }); h.c(64, 22,
      7, "red", { sw: 2.5 }); h.r(24, 96, 80, 14, 6, "orange"); h.hl(44, 74, 7, 3, 0); });
  I("rose", ["🌹", "🌷"], h => { h.shadow(64, 118, 20); h.l("M64 64L64 114", "green", 6); h.p("M64 90C80 94 92 86 94 76C80 74 68 80 64 90Z", "green"); h.p(
      "M32 40C28 18 54 8 64 24C74 8 100 18 96 40C94 62 78 72 64 72C50 72 34 62 32 40Z", "red"); h.raw(
      '<path d="M52 36C58 30 70 30 76 36" fill="none" stroke="#B3303F" stroke-width="3" stroke-linecap="round" opacity=".7"/>'); h.hl(46, 38, 5, 8, -20); });
  I("kite", ["🪁"], h => { h.l("M64 78C50 94 70 104 56 120", "gray", 3); h.p("M64 8L100 50L64 84L28 50Z", "purple"); h.raw(
      '<path d="M64 8L64 84M28 50L100 50" stroke="#5F3BA9" stroke-width="3"/>'); h.p("M56 100L50 92L58 94Z", "pink", { sw: 2 }); h.hl(50, 34, 6, 3, -35); });
  I("waves", ["🌊"], h => { h.p("M8 74C20 52 34 52 46 66C58 80 72 80 84 60C94 44 106 44 120 60L120 108L8 108Z", "blue"); h.raw(
      '<path d="M14 84C26 70 38 70 50 82M64 90C76 76 90 76 102 88" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>'); });
  I("owl", ["🦉"], h => { h.shadow(); h.p("M24 38L22 14L48 26Z", "brown"); h.p("M104 38L106 14L80 26Z", "brown"); h.e(64, 70, 42, 44, "brown"); h.c(
      46, 56, 17, "cream"); h.c(82, 56, 17,
      "cream"); h.eye(46, 56, 7); h.eye(82, 56, 7); h.p("M58 70L70 70L64 82Z", "orange", { sw: 2 }); h.e(64, 96, 22, 14, "tan", 0, { ns: true }); });
  I("giraffe", ["🦒"], h => { h.shadow(); h.p("M50 112L50 56C50 36 54 22 62 16L84 22C84 40 80 56 82 72L82 112Z", "yellow"); h.e(66, 20, 20, 15,
      "yellow", -18); h.p("M54 8L58 0L62 8Z",
      "brown", { sw: 2 }); h.eye(70, 18, 3.6); [[60, 50], [72, 66], [62, 82], [72, 98]].forEach(q => h.c(q[0], q[1], 6, "brown", { ns: true })); });
  I("crab", ["🦀"], h => { h.shadow(); h.l("M30 70L14 80M34 82L20 98M98 70L114 80M94 82L108 98", "red", 4); h.p(
      "M22 56C10 44 14 22 30 26C36 36 34 48 22 56Z", "red"); h.p(
      "M106 56C118 44 114 22 98 26C92 36 94 48 106 56Z", "red"); h.e(64, 78, 40, 28, "red"); h.l("M50 54L50 46M78 54L78 46", "red", 3); h.c(50, 42, 7,
          "white", { sw: 2 }); h.c(78, 42, 7,
      "white", { sw: 2 }); h.eye(50, 42, 3.4); h.eye(78, 42, 3.4); h.ink("M54 86Q64 94 74 86", 2.8); });
  I("shirt", ["👕", "🧥"], h => { h.shadow(); h.p(
      "M44 14L12 34L24 62L40 54L40 108C40 112 44 114 48 114L80 114C84 114 88 112 88 108L88 54L104 62L116 34L84 14C80 24 72 28 64 28C56 28 48 24 44 14Z",
          "blue"); h.hl(54, 56, 3, 14, 0); });
  I("dress", ["👗"], h => { h.shadow(); h.p("M48 12L80 12L84 36L100 112L28 112L44 36Z", "pink"); h.p("M44 36L84 36L80 46L48 46Z", "red", { sw: 2.5 });
      h.l("M56 12L60 30M72 12L68 30", "red", 3); });
  I("sock", ["🧦"], h => { h.shadow(); h.p("M42 12L82 12L82 66L108 82C114 88 112 100 104 106C92 114 76 110 62 100L42 82Z", "red"); h.r(40, 10, 44, 18,
      6, "white"); h.hl(54, 48, 3, 14, 0); });
  I("cloud", ["☁", "☁️"], h => { h.shadow(64, 118, 32); h.p("M30 88C10 88 6 60 28 54C28 30 62 22 76 44C100 38 116 62 104 82C102 86 98 88 92 88Z",
      "sky"); h.hl(44, 48, 10, 4, -20); });
  I("snow", ["❄", "❄️"], h => { h.raw(
      '<g fill="none" stroke="#7CC3F5" stroke-width="7" stroke-linecap="round"><path d="M64 10L64 118M18 37L110 91M18 91L110 37"/><path d="M52 18L64 28L76 18M52 110L64 100L76 110M20 54L34 52L30 40M108 74L94 76L98 88M20 74L34 76L30 88M108 54L94 52L98 40" stroke-width="5"/></g>');
      });
  I("mountain", ["⛰", "⛰️", "🏞", "🏞️"], h => { h.shadow(64, 118, 46); h.p("M6 108L48 26L72 66L90 40L124 108Z", "green"); h.p(
      "M48 26L60 50L52 46L44 54L38 46Z", "white", { sw: 2.5 }); });
  I("key", ["🔑"], h => { h.c(36, 44, 26, "yellow"); h.c(36, 44, 10, "white", { ns: true }); h.raw(
      '<path d="M54 62L108 116M94 102L104 92M82 90L90 82" fill="none" stroke="#C99B10" stroke-width="11" stroke-linecap="round"/><path d="M54 62L108 116" fill="none" stroke="#FFD43F" stroke-width="5" stroke-linecap="round"/>');
      });
  I("laptop", ["💻"], h => { h.shadow(); h.r(22, 20, 84, 62, 10, "dark"); h.r(30, 28, 68, 46, 4, "sky", 0, { ns: true }); h.p(
      "M8 90L120 90L112 108C110 112 106 114 102 114L26 114C22 114 18 112 16 108Z", "gray"); });
  I("clover", ["🍀"], h => { h.shadow(64, 118, 20); [[46, 46], [82, 46], [46, 80], [82, 80]].forEach(q => h.c(q[0], q[1], 22, "green")); h.l(
      "M64 62L84 118", "green", 5); h.raw(
      '<path d="M64 64L48 48M64 64L80 48M64 64L48 80M64 64L80 80" stroke="#2D9048" stroke-width="3" stroke-linecap="round" opacity=".6"/>'); });
  I("puzzle", ["🧩"], h => { h.shadow(); h.p(
      "M16 30L46 30C42 18 58 14 62 24C66 14 82 18 78 30L108 30L108 56C120 52 124 68 112 72C124 76 120 92 108 88L108 112L78 112C82 124 66 124 62 114C58 124 42 124 46 112L16 112Z",
          "purple");
      h.hl(34, 46, 8, 3, 0); });
  I("globe", ["🌏", "🌍", "🌎"], h => { h.shadow(); h.c(64, 64, 48, "blue"); h.p(
      "M40 36C52 28 66 34 62 46C58 58 44 56 40 68C34 78 26 70 28 58C28 50 32 42 40 36Z", "green", { sw: 2.5 });
      h.p("M78 62C92 56 100 66 96 80C92 94 80 96 74 86C70 76 70 66 78 62Z", "green", { sw: 2.5 }); h.hl(46, 34, 10, 5, -30); });
  I("brain", ["🧠"], h => { h.shadow(); h.p(
      "M64 20C54 8 30 14 30 34C14 38 14 62 28 68C24 84 38 96 52 92C56 104 72 104 76 92C90 96 104 84 100 68C114 62 114 38 98 34C98 14 74 8 64 20Z",
      "pink"); h.raw(
          '<path d="M64 22L64 100M44 44C52 48 56 56 52 66M84 44C76 48 72 56 76 66" fill="none" stroke="#C84F84" stroke-width="3" stroke-linecap="round" opacity=".7"/>');
          });
  I("bubble", ["💬", "🗣", "🗣️", "🗨", "🗨️"], h => { h.shadow(); h.p(
      "M18 28C18 20 24 16 32 16L96 16C104 16 110 20 110 28L110 70C110 78 104 82 96 82L58 82L36 106L38 82L32 82C24 82 18 78 18 70Z", "white"); h.c(46,
          50, 6, "blue", { ns: true }); h.c(64,
      50, 6, "blue", { ns: true }); h.c(82, 50, 6, "blue", { ns: true }); });
  I("tag", ["🏷", "🏷️"], h => { h.shadow(); h.p("M14 20L64 20L112 68C116 72 116 78 112 82L84 110C80 114 74 114 70 110L14 56Z", "yellow"); h.c(38, 42,
      7, "white", { sw: 2.5 }); h.hl(60, 50, 10, 3, 40); });
  I("can", ["🥫"], h => { h.shadow(); h.r(26, 20, 76, 92, 14, "gray"); h.r(26, 44, 76, 44, 0, "red", 0, { ns: true }); h.e(64, 22, 38, 8, "white");
      h.hl(40, 66, 3, 18, 0); });
  I("chefhat", ["👨‍🍳", "👩‍🍳"], h => { h.shadow(); h.c(36, 44, 22, "white"); h.c(64, 32, 26, "white"); h.c(92, 44, 22, "white"); h.r(34, 54, 60,
      52, 10, "white"); h.l("M34 84L94 84",
      "gray", 3, { op: .6 }); });
  I("sunrise", ["🌅", "🌇"], h => { h.p("M12 88C12 58 34 40 64 40C94 40 116 58 116 88Z", "orange"); h.raw(
      '<path d="M8 88L120 88" stroke="#C76A18" stroke-width="5" stroke-linecap="round"/><path d="M64 14L64 26M24 28L32 36M104 28L96 36" stroke="#FFB03F" stroke-width="6" stroke-linecap="round"/>');
      h.r(10, 94, 108, 14, 7, "sky"); });

  I("rain", ["🌧", "🌧️"], h => { h.p("M30 70C10 70 6 44 28 38C28 14 62 8 76 30C100 24 116 48 104 66C102 70 98 70 92 70Z", "gray"); h.p(
      "M36 82C36 82 30 92 30 96C30 100 34 102 36 102C38 102 42 100 42 96C42 92 36 82 36 82Z", "sky", { sw: 2 }); h.p(
      "M62 86C62 86 56 96 56 100C56 104 60 106 62 106C64 106 68 104 68 100C68 96 62 86 62 86Z", "sky", { sw: 2 }); h.p(
      "M88 82C88 82 82 92 82 96C82 100 86 102 88 102C90 102 94 100 94 96C94 92 88 82 88 82Z", "sky", { sw: 2 }); });
  /* =================== ĐỢT 2: NGƯỜI, CƠ THỂ, CON VẬT, ĐỒ VẬT CÒN THIẾU =================== */
  function bust(h, o) {   /* đầu + vai: o = { skin, hair, shirt } */
    h.shadow(); h.p("M16 118C16 94 38 86 64 86C90 86 112 94 112 118Z", o.shirt || "blue"); h.c(64, 56, 34, o.skin || "skin"); h.eye(51, 58, 4.6);
        h.eye(77, 58, 4.6); h.smile(64, 72, 12);
        h.blush(42, 68, 5.5); h.blush(86, 68, 5.5);
  }
  I("boy", ["👦"], h => { bust(h, { shirt: "blue" }); h.p("M30 54C30 26 50 16 66 18C86 20 98 34 98 54C88 44 78 40 64 40C50 40 40 44 30 54Z", "brown"); });
  I("girl", ["👧"], h => { h.c(24, 66, 13, "brown"); h.c(104, 66, 13, "brown"); bust(h, { shirt: "pink" }); h.p(
      "M28 58C26 26 50 14 68 18C88 22 100 38 100 58C90 44 78 40 64 40C50 40 38 46 28 58Z", "brown"); h.c(24, 54, 6, "red", { ns: true }); h.c(104, 54,
          6, "red", { ns: true }); });
  I("man", ["👨"], h => { bust(h, { shirt: "navy" }); h.p("M30 52C28 22 56 14 72 18C92 22 100 36 98 52C90 42 80 38 64 38C50 38 40 42 30 52Z", "dark"); });
  I("woman", ["👩"], h => { h.p("M22 116C12 70 22 14 64 14C106 14 116 70 106 116Z", "brown"); bust(h, { shirt: "purple" }); h.p(
      "M30 54C34 30 52 24 64 24C80 24 94 34 98 54C84 46 76 36 64 36C52 36 42 46 30 54Z", "brown"); });
  I("beard", ["🧔"], h => { bust(h, { shirt: "green" }); h.p("M30 50C28 22 56 14 72 18C92 22 100 36 98 50C90 40 80 36 64 36C50 36 40 40 30 50Z", "brown"); h.p(
      "M30 62C30 94 48 106 64 106C80 106 98 94 98 62C86 78 42 78 30 62Z", "brown"); h.ink("M54 82Q64 88 74 82", 3); });
  I("people", ["👥"], h => { h.shadow(); h.p("M4 118C4 98 20 92 38 92C56 92 70 98 70 118Z", "pink"); h.c(38, 66, 22, "skin"); h.eye(30, 68, 3.4);
      h.eye(46, 68, 3.4); h.smile(38, 78, 8); h.p(
      "M58 118C58 98 74 92 92 92C110 92 124 98 124 118Z", "blue"); h.c(92, 62, 24, "skin"); h.eye(83, 64, 3.6); h.eye(101, 64, 3.6); h.smile(92, 75, 9); h.p(
      "M68 58C68 38 82 32 94 34C106 36 114 46 114 58C108 50 100 46 92 46C82 46 76 50 68 58Z", "dark"); });
  I("family", ["👨‍👩‍👧", "👪"], h => { h.shadow(); h.p("M4 118C4 98 18 92 34 92C50 92 62 98 62 118Z", "blue"); h.c(33, 66, 20, "skin"); h.eye(26,
      68, 3.2); h.eye(40, 68, 3.2); h.smile(33,
      77, 7); h.p("M14 62C14 42 30 40 40 42C54 46 54 58 52 62C46 54 24 54 14 62Z", "dark"); h.p("M66 118C66 98 80 92 96 92C112 92 124 98 124 118Z",
          "pink"); h.c(95, 66, 20, "skin"); h.eye(
      88, 68, 3.2); h.eye(102, 68, 3.2); h.smile(95, 77, 7); h.p("M74 64C70 40 90 36 104 42C116 48 118 60 114 66C108 56 88 52 74 64Z", "brown"); h.p(
      "M44 118C44 106 54 102 64 102C74 102 84 106 84 118Z", "yellow"); h.c(64, 88, 13, "skin"); h.eye(59, 89, 2.6); h.eye(69, 89, 2.6); h.smile(64, 95, 5); });
  I("handup", ["🙋"], h => { bust(h, { shirt: "teal" }); h.p("M28 56C28 26 50 16 66 18C86 20 98 34 98 54C88 44 78 40 64 40C50 40 38 46 28 56Z", "brown"); h.raw(
      '<path d="M96 96L106 40" stroke="#C98A5C" stroke-width="12" stroke-linecap="round"/><path d="M96 96L106 40" stroke="#F8BE93" stroke-width="6" stroke-linecap="round"/>');
          h.c(106, 32,
      12, "skin"); });
  I("monocle", ["🧐"], h => { h.shadow(); h.c(64, 62, 46, "yellow"); h.eye(46, 56, 5.2); h.c(82, 56, 13, "white", { ns: true }); h.eye(82, 56, 5.2); h.raw(
      '<circle cx="82" cy="56" r="14" fill="none" stroke="#6B4322" stroke-width="3.5"/><path d="M92 66L104 100" stroke="#6B4322" stroke-width="3" stroke-linecap="round"/>');
          h.ink(
      "M34 40L56 44", 3.4); h.ink("M44 82Q60 78 82 84", 4); h.hl(44, 34, 8, 4, -25); });
  I("thinking", ["🤔"], h => { h.shadow(); h.c(64, 62, 46, "yellow"); h.eye(46, 54, 5.2); h.eye(82, 54, 5.2); h.ink("M34 42L56 46", 3.4); h.ink(
      "M72 42L94 38", 3.4); h.ink(
      "M44 80Q54 76 62 80", 4); h.c(78, 98, 16, "skin"); h.l("M70 92C74 88 82 88 86 92", "skin", 3); h.hl(44, 34, 8, 4, -25); });
  I("sleepy", ["😴"], h => { h.shadow(); h.c(64, 66, 44, "yellow"); h.ink("M36 58Q46 66 56 58", 4); h.ink("M72 58Q82 66 92 58", 4); h.e(64, 86, 7, 8,
      "brown", 0, { ns: true }); h.raw(
      '<path d="M92 24H108L92 40H108M104 8H116L104 20H116" fill="none" stroke="#4F97F2" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>');
          h.hl(44, 40, 8, 4, -25); });
  I("fairy", ["🧚"], h => { h.shadow(); h.e(30, 56, 22, 34, "sky", -20); h.e(98, 56, 22, 34, "sky", 20); h.e(34, 84, 14, 22, "sky", 20); h.e(94, 84,
      14, 22, "sky", -20); h.p(
      "M40 118C40 98 52 90 64 90C76 90 88 98 88 118Z", "pink"); h.c(64, 62, 26, "skin"); h.eye(55, 64, 3.8); h.eye(73, 64, 3.8); h.smile(64, 74, 9); h.p(
      "M36 60C34 36 50 28 64 28C80 28 94 36 92 60C84 48 76 44 64 44C52 44 44 48 36 60Z", "yellow"); });
  I("muscle", ["💪"], h => { h.shadow(64, 118, 40); h.e(46, 94, 36, 17, "skin", -8); h.r(66, 34, 28, 76, 14, "skin", 14); h.c(54, 74, 20, "skin");
      h.c(92, 30, 19, "skin"); h.e(46, 94, 35,
      16, "skin", -8, { ns: true }); h.r(67, 36, 26, 72, 13, "skin", 14, { ns: true }); h.c(54, 74, 19, "skin", { ns: true }); h.raw(
      '<path d="M80 22H104M80 32H104" stroke="#C98A5C" stroke-width="3" stroke-linecap="round"/><path d="M44 70C50 64 60 64 64 72" fill="none" stroke="#C98A5C" stroke-width="3" stroke-linecap="round"/>');
      h.hl(48, 66, 6, 4, -30); });
  I("tongue", ["👅"], h => { h.shadow(); h.p("M24 26C24 80 40 110 64 110C88 110 104 80 104 26Z", "pink"); h.raw(
      '<path d="M64 38V84" stroke="#C84F84" stroke-width="4" stroke-linecap="round"/>'); h.hl(46, 56, 6, 14, -10); });
  I("nose", ["👃"], h => { h.shadow(); h.p("M64 14C70 42 78 58 88 76C98 92 84 106 64 100C44 106 30 92 40 76C50 58 58 42 64 14Z", "skin"); h.dot(52,
      92, 4.2, "#C98A5C"); h.dot(76, 92, 4.2,
      "#C98A5C"); h.hl(60, 50, 4, 14, 10); });
  I("mouth", ["👄"], h => { h.shadow(); h.p("M10 64C26 36 50 40 64 50C78 40 102 36 118 64C102 98 26 98 10 64Z", "red"); h.raw(
      '<path d="M14 64C40 74 88 74 114 64" fill="none" stroke="#B3303F" stroke-width="3.5" stroke-linecap="round"/>'); h.hl(44, 54, 10, 3.5, -10); });
  I("foot", ["🦶"], h => { h.shadow(60, 118, 40); h.p(
      "M44 10C32 10 28 22 30 40L36 86C38 106 54 118 74 114C98 110 96 92 86 82C78 72 72 56 70 38C68 20 58 10 44 10Z", "skin"); [[96, 96, 7],
      [104, 82, 6], [102, 68, 5.4], [96, 56, 4.8]].forEach(t => h.c(t[0], t[1], t[2], "skin", { sw: 2.5 })); h.hl(46, 40, 5, 14, -5); });
  I("leg", ["🦵"], h => { h.shadow(64, 118, 38); h.p(
      "M48 8H82L86 58C88 74 82 84 86 100L92 108C92 114 86 116 80 116H44C38 116 36 108 42 104C48 88 44 76 46 58Z", "skin"); h.e(64, 66, 18, 12,
      "skin", 0, { ns: true }); h.raw('<path d="M50 64C58 72 72 72 80 64" fill="none" stroke="#C98A5C" stroke-width="3" stroke-linecap="round"/>');
          h.hl(56, 30, 4, 14, 0); });
  I("chestnut", ["🌰"], h => { h.shadow(); h.p("M64 20C90 20 108 46 104 78C100 102 82 114 64 114C46 114 28 102 24 78C20 46 38 20 64 20Z", "brown"); h.p(
      "M26 62C28 36 46 24 64 24C82 24 100 36 102 62C90 52 38 52 26 62Z", "tan"); h.hl(46, 76, 6, 16, -15); });
  I("raccoon", ["🦝"], h => { h.shadow(); h.p("M18 52L22 14L50 32Z", "gray"); h.p("M110 52L106 14L78 32Z", "gray"); h.c(64, 68, 46, "gray"); h.e(64,
      84, 28, 20, "white", 0, { ns: true });
      h.e(42, 62, 17, 13, "dark", -15, { ns: true }); h.e(86, 62, 17, 13, "dark", 15, { ns: true }); h.dot(42, 62, 4.6, "#fff"); h.dot(86, 62, 4.6,
          "#fff"); h.dot(42, 63, 2.4); h.dot(86, 63,
      2.4); h.e(64, 80, 8, 6, "dark", 0, { ns: true }); h.smile(64, 90, 10); });
  I("wolf", ["🐺"], h => { h.shadow(); h.p("M16 62L18 10L50 34Z", "gray"); h.p("M112 62L110 10L78 34Z", "gray"); h.p(
      "M22 56C22 36 40 28 64 28C88 28 106 36 106 56C106 84 88 108 64 108C40 108 22 84 22 56Z", "gray"); h.p(
      "M44 84C44 70 54 64 64 64C74 64 84 70 84 84C84 100 74 108 64 108C54 108 44 100 44 84Z", "white", { sw: 2.5 }); h.e(64, 76, 9, 6, "dark", 0, {
          ns: true }); h.eye(46, 54, 4.4); h.eye(82,
      54, 4.4); h.ink("M64 82V92M56 96Q64 100 72 96", 3); });
  I("dragon", ["🐉", "🐲"], h => { h.shadow(); h.p("M30 38L22 12L50 28Z", "yellow"); h.p("M98 38L106 12L78 28Z", "yellow"); h.c(64, 66, 44, "green"); h.p(
      "M44 86C44 74 54 70 64 70C74 70 84 74 84 86C84 100 74 108 64 108C54 108 44 100 44 86Z", "lime", { sw: 2.5 }); h.dot(55, 88, 3); h.dot(73, 88,
          3); h.eye(44, 54, 5); h.eye(84, 54, 5);
      h.raw('<path d="M40 40L48 34M88 40L80 34" stroke="#2D9048" stroke-width="4" stroke-linecap="round"/>'); h.p("M56 22L64 8L72 22Z", "orange", { sw: 2.5 }); });
  I("cricket", ["🦗"], h => { h.shadow(); h.raw(
      '<path d="M40 40C28 28 24 18 26 8M52 38C48 24 50 14 56 6" fill="none" stroke="#2D9048" stroke-width="3" stroke-linecap="round"/>'); h.e(56,
      70, 34, 18, "green", -10); h.c(34, 50, 14, "green"); h.eye(30, 46, 3.6); h.raw(
      '<path d="M70 72L100 28L112 36M70 80L108 98L108 112M60 84L70 108L60 116" fill="none" stroke="#2D9048" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>');
          h.hl(52, 62,
      12, 3.5, -10); });
  I("fly", ["🪰"], h => { h.shadow(); h.e(34, 40, 24, 12, "sky", -30, { op: 0.85 }); h.e(94, 40, 24, 12, "sky", 30); h.e(64, 80, 22, 30, "dark"); h.c(
      64, 46, 18, "dark"); h.c(54, 42, 7,
      "red", { ns: true }); h.c(74, 42, 7, "red", { ns: true }); h.raw(
      '<path d="M44 78L26 90M84 78L102 90M46 94L32 112M82 94L96 112" fill="none" stroke="#3E3A63" stroke-width="4" stroke-linecap="round"/>'); h.hl(
          58, 70, 4, 12, -10); });
  I("lotus", ["🪷"], h => { h.shadow(64, 118, 40); h.e(64, 106, 52, 10, "green"); h.e(30, 70, 14, 36, "pink", -35); h.e(98, 70, 14, 36, "pink", 35);
      h.e(46, 62, 16, 42, "pink", -15); h.e(82,
      62, 16, 42, "pink", 15); h.e(64, 56, 16, 46, "pink"); h.hl(60, 40, 4, 14, 0); });
  I("brick", ["🧱"], h => { h.shadow(); h.r(10, 30, 108, 72, 8, "red"); h.raw(
      '<path d="M10 54H118M10 78H118M46 30V54M82 54V78M46 78V102" fill="none" stroke="#FFF7E3" stroke-width="4" opacity=".9"/>'); h.hl(24, 40, 10, 3, 0); });
  I("knife", ["🔪"], h => { h.shadow(); h.p("M104 14C112 14 112 24 106 32L46 100L28 86Z", "gray"); h.raw(
      '<path d="M30 88L44 100L24 118C20 120 14 114 18 108Z" fill="#A06C3E" stroke="#6B4322" stroke-width="3" stroke-linejoin="round"/>'); h.hl(78, 46, 3, 22, 40); });
  I("wheel", ["🛞"], h => { h.shadow(); h.c(64, 64, 48, "dark"); h.c(64, 64, 30, "gray"); h.c(64, 64, 11, "white"); h.raw(
      '<path d="M64 38V90M38 64H90M46 46L82 82M82 46L46 82" stroke="#6F7893" stroke-width="4" stroke-linecap="round"/>'); });
  I("stadium", ["🏟", "🏟️"], h => { h.shadow(64, 116, 54); h.e(64, 76, 56, 32, "gray"); h.e(64, 70, 40, 18, "green", 0, { sw: 2.5 }); h.raw(
      '<ellipse cx="64" cy="70" rx="22" ry="8" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M8 76V90M120 76V90M36 100V108M92 100V108M64 104V112" stroke="#6F7893" stroke-width="3" stroke-linecap="round"/>');
      h.hl(36, 56, 12, 3, -10); });
  I("train", ["🚆", "🚅", "🚄"], h => { h.shadow(); h.r(24, 12, 80, 92, 18, "blue"); h.r(34, 24, 60, 34, 8, "sky", 0, { ns: true }); h.c(42, 80, 7,
      "yellow", { sw: 2 }); h.c(86, 80, 7,
      "yellow", { sw: 2 }); h.r(52, 70, 24, 6, 3, "white", 0, { ns: true }); h.raw(
          '<path d="M34 104L26 118M94 104L102 118" stroke="#6F7893" stroke-width="5" stroke-linecap="round"/>');
      h.hl(40, 40, 6, 3, -20); });
  I("locomotive", ["🚂"], h => { h.shadow(); h.r(14, 52, 70, 46, 10, "red"); h.r(76, 28, 38, 70, 8, "navy"); h.r(84, 36, 22, 22, 4, "sky", 0, { ns:
      true }); h.r(26, 28, 18, 26, 4, "dark");
      h.e(35, 26, 14, 5, "dark"); h.c(36, 104, 12, "dark"); h.c(36, 104, 5, "gray", { ns: true }); h.c(66, 104, 12, "dark"); h.c(66, 104, 5, "gray", {
          ns: true }); h.c(100, 104, 12, "dark");
      h.c(100, 104, 5, "gray", { ns: true }); h.p("M10 98L14 86L22 98Z", "yellow", { sw: 2 }); });
  I("rails", ["🛤", "🛤️"], h => { h.raw(
      '<path d="M34 8L8 120M94 8L120 120" stroke="#6F7893" stroke-width="8" stroke-linecap="round"/><path d="M30 24H98M24 46H104M18 72H110M10 104H118" stroke="#A06C3E" stroke-width="9" stroke-linecap="round"/><path d="M34 8L8 120M94 8L120 120" stroke="#D8DDEA" stroke-width="3" stroke-linecap="round"/>');
      });
  I("icecube", ["🧊"], h => { h.shadow(); h.r(22, 24, 84, 84, 18, "sky"); h.r(34, 36, 60, 60, 10, "white", 0, { ns: true, op: 0.25 }); h.hl(40, 44, 10, 4, -30); h.raw(
      '<path d="M44 84L64 64" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>'); });
  I("writing", ["✍", "✍️"], h => { h.shadow(); h.p("M18 96C18 80 34 74 50 76L76 60L92 76L74 92C74 108 54 120 36 114C24 110 18 104 18 96Z", "skin"); h.raw(
      '<path d="M70 62L106 18L118 28L82 72Z" fill="#FFD43F" stroke="#C99B10" stroke-width="3" stroke-linejoin="round"/><path d="M70 62L82 72L66 76Z" fill="#6B4322"/>');
          h.hl(36, 92, 8, 3,
      -20); });
  I("chain", ["🔗"], h => { h.shadow(); h.raw(
      '<rect x="14" y="30" width="62" height="34" rx="17" transform="rotate(-35 45 47)" fill="none" stroke="#4F97F2" stroke-width="12"/><rect x="52" y="64" width="62" height="34" rx="17" transform="rotate(-35 83 81)" fill="none" stroke="#7CC3F5" stroke-width="12"/>');
      });
  I("school", ["🏫"], h => { h.shadow(64, 118, 52); h.r(10, 56, 108, 56, 6, "tan"); h.p("M6 58L64 20L122 58Z", "red"); h.r(52, 76, 24, 36, 6,
      "brown"); [[22, 70], [90, 70]].forEach(q => h.r(
      q[0], q[1], 16, 16, 3, "sky", 0, { ns: true })); h.raw(
          '<path d="M64 20V6" stroke="#6B4322" stroke-width="3"/><path d="M64 6L82 10L64 16Z" fill="#FFD43F"/>'); h.c(64, 44, 7, "white", {
      sw: 2 }); });
  I("compass", ["🧭"], h => { h.shadow(); h.c(64, 64, 48, "yellow"); h.c(64, 64, 38, "white"); h.p("M64 24L76 64L64 104L52 64Z", "gray", { ns:
      true }); h.p("M64 24L76 64L52 64Z", "red", {
      ns: true }); h.p("M64 104L52 64L76 64Z", "white", { sw: 2 }); h.dot(64, 64, 4, INK); h.raw(
      '<path d="M64 20V28M64 100V108M20 64H28M100 64H108" stroke="#C99B10" stroke-width="3" stroke-linecap="round"/>'); });
  I("bucket", ["🪣"], h => { h.shadow(); h.raw('<path d="M30 40C30 4 98 4 98 40" fill="none" stroke="#6F7893" stroke-width="6" stroke-linecap="round"/>'); h.p(
      "M20 40H108L98 108C97 114 92 118 86 118H42C36 118 31 114 30 108Z", "blue"); h.e(64, 40, 44, 8, "navy"); h.hl(38, 74, 4, 20, 0); });
  I("canoe", ["🛶"], h => { h.shadow(64, 112, 54); h.p("M4 66C16 100 112 100 124 66Z", "brown"); h.p("M10 66C30 74 98 74 118 66", "tan", { sw: 0 }); h.raw(
      '<path d="M30 20L96 98" stroke="#A06C3E" stroke-width="7" stroke-linecap="round"/>'); h.e(30, 18, 8, 16, "tan", 40); h.hl(34, 82, 14, 3, 10); });
  I("hotdog", ["🌭"], h => { h.shadow(); h.e(64, 66, 52, 22, "tan", -25); h.e(64, 66, 54, 12, "red", -25, { ns: true }); h.raw(
      '<path d="M26 78C42 58 58 80 70 60C80 44 96 62 104 44" fill="none" stroke="#FFD43F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>');
          h.e(64, 78, 52, 14, "tan", -25,
      { ns: true }); h.hl(40, 62, 14, 3, -25); });
  I("page", ["📄", "📃"], h => { h.shadow(); h.p("M24 10H80L106 36V112C106 116 102 118 98 118H30C26 118 24 116 24 112Z", "white"); h.p(
      "M80 10V36H106Z", "gray", { sw: 2.5 }); h.raw(
      '<path d="M38 56H90M38 72H90M38 88H72" stroke="#7CC3F5" stroke-width="5" stroke-linecap="round"/>'); });
  I("drumstick", ["🍗"], h => { h.shadow(); h.p("M62 14C94 8 112 36 100 62C92 78 72 84 56 76L40 92L30 82L46 66C38 52 42 22 62 14Z", "brown"); h.raw(
      '<path d="M42 90L30 102C22 100 20 110 28 114C36 120 44 112 40 104L52 94Z" fill="#FFF7E3" stroke="#D6AE62" stroke-width="3" stroke-linejoin="round"/>');
          h.hl(66, 34, 6, 14, 30); });
  I("shorts", ["🩳"], h => { h.shadow(); h.p("M22 22H106L112 100H72L64 64L56 100H16Z", "blue"); h.r(22, 22, 84, 14, 4, "navy", 0, { ns: true }); h.raw(
      '<path d="M64 36V64" stroke="#2B64B9" stroke-width="3"/><path d="M50 36L54 50M78 36L74 50" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'); });
  I("scarf", ["🧣"], h => { h.shadow(); h.p("M16 30C16 18 30 14 64 14C98 14 112 18 112 30C112 46 98 52 64 52C30 52 16 46 16 30Z", "red"); h.p(
      "M76 46H104L108 112H82Z", "red"); h.raw(
      '<path d="M82 62H106M83 82H107M85 100H108" stroke="#FFF7E3" stroke-width="5"/><path d="M30 28H98" stroke="#FFF7E3" stroke-width="4" stroke-dasharray="8 8" opacity=".8"/>');
          });
  I("ship", ["🚢"], h => { h.shadow(64, 118, 54); h.p("M8 74H120L104 106C102 110 98 112 94 112H34C30 112 26 110 24 106Z", "navy"); h.r(34, 46, 60, 30,
      6, "white"); h.r(54, 26, 22, 22, 4,
      "red"); [[42, 54], [60, 54], [78, 54]].forEach(q => h.c(q[0] + 4, q[1] + 8, 5, "sky", { sw: 2 })); h.raw(
      '<path d="M6 116C22 108 30 124 48 116C66 108 74 124 92 116C106 110 114 120 124 116" fill="none" stroke="#7CC3F5" stroke-width="5" stroke-linecap="round"/>'); });
  I("motorbike", ["🏍", "🏍️", "🛵"], h => { h.shadow(64, 118, 54); h.c(28, 92, 22, "dark"); h.c(28, 92, 9, "gray", { ns: true }); h.c(100, 92, 22,
      "dark"); h.c(100, 92, 9, "gray", { ns:
      true }); h.p("M30 92L52 52L84 52L100 92L76 92L64 72L48 92Z", "red"); h.p("M50 52C54 36 74 36 80 52Z", "navy", { sw: 2.5 }); h.raw(
      '<path d="M84 52L92 30L108 28" fill="none" stroke="#3E3A63" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'); h.hl(60, 60, 8, 3, -20); });
  I("helicopter", ["🚁"], h => { h.shadow(64, 118, 40); h.raw(
      '<path d="M14 18H114" stroke="#6F7893" stroke-width="6" stroke-linecap="round"/><path d="M64 18V34" stroke="#6F7893" stroke-width="6"/><path d="M92 62L122 50" stroke="#C84F84" stroke-width="10" stroke-linecap="round"/><path d="M36 110H92M44 96V110M84 96V110" stroke="#6F7893" stroke-width="5" stroke-linecap="round"/>');
      h.e(58, 68, 40, 30, "red"); h.p("M30 62C30 48 44 46 56 46L56 66L30 70Z", "sky", { sw: 2.5 }); h.hl(66, 56, 14, 3, -10); });
  I("window", ["🪟"], h => { h.shadow(); h.r(16, 12, 96, 104, 8, "brown"); h.r(26, 22, 34, 40, 3, "sky", 0, { sw: 2 }); h.r(68, 22, 34, 40, 3, "sky",
      0, { sw: 2 }); h.r(26, 68, 34, 38, 3,
      "sky", 0, { sw: 2 }); h.r(68, 68, 34, 38, 3, "sky", 0, { sw: 2 }); h.hl(36, 34, 6, 3, -30); });
  I("printer", ["🖨", "🖨️"], h => { h.shadow(); h.r(34, 10, 60, 40, 4, "white"); h.raw(
      '<path d="M44 24H84M44 36H72" stroke="#7CC3F5" stroke-width="4" stroke-linecap="round"/>'); h.r(10,
      46, 108, 50, 12, "gray"); h.r(30, 86, 68, 30, 4, "white"); h.c(98, 62, 5, "green", { ns: true }); h.raw(
      '<path d="M42 98H86M42 108H70" stroke="#A9B1C8" stroke-width="4" stroke-linecap="round"/>'); });

};
