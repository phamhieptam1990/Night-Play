#!/usr/bin/env node
/* Sinh VẬT MINH HOẠ của cảnh truyện (Lớp truyện): đèn lồng, hộp quà, bóng bay, lá, mây, thuyền, vỏ sò × 4 màu.
   Ra: learn/story/art/props/<vật>-<0..3>.svg (120x120). Mỗi vật có một "nhãn trắng" ở giữa (x16..104, y46..90) để chữ/số đáp án đặt lên.
   Chạy: node scripts/art/gen-story-props.js */
"use strict";
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "..", "..", "learn", "story", "art", "props");
fs.mkdirSync(OUT, { recursive: true });
const COLS = [["#FF7B7B", "#D94B63", "#FFD0D0"], ["#5BB8FF", "#2F7FD6", "#CDEBFF"], ["#FFC94D", "#E5951A", "#FFEFB8"], ["#B292FF", "#7C5CE0", "#E6DBFF"]];
const PLATE = (d) => `<rect x="16" y="46" width="88" height="44" rx="14" fill="#fff" fill-opacity=".96" stroke="${d}" stroke-width="2.500"/>`;
const SH = {
  lantern: (a, d, l) => `<path d="M60 2V14" stroke="${d}" stroke-width="3" stroke-linecap="round"/><rect x="42" y="12" width="36" height="9" rx="4" fill="${d}"/>`
    + `<ellipse cx="60" cy="58" rx="46" ry="41" fill="${a}"/><ellipse cx="60" cy="58" rx="24" ry="41" fill="none" stroke="${l}" stroke-width="3" opacity=".7"/>`
    + `<ellipse cx="40" cy="36" rx="12" ry="7" fill="#fff" opacity=".35"/><rect x="42" y="95" width="36" height="9" rx="4" fill="${d}"/>`
    + `<path d="M60 104V114" stroke="${d}" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="116" r="3.500" fill="${a}"/>`,
  gift: (a, d, l) => `<rect x="12" y="38" width="96" height="70" rx="10" fill="${a}"/><rect x="6" y="28" width="108" height="22" rx="8" fill="${d}"/>`
    + `<rect x="52" y="28" width="16" height="80" fill="${l}"/><ellipse cx="42" cy="20" rx="17" ry="10" fill="${l}" transform="rotate(-18 42 20)"/>`
    + `<ellipse cx="78" cy="20" rx="17" ry="10" fill="${l}" transform="rotate(18 78 20)"/><circle cx="60" cy="25" r="7" fill="${d}"/>`
    + `<ellipse cx="30" cy="48" rx="10" ry="4" fill="#fff" opacity=".3"/>`,
  balloon: (a, d, l) => `<path d="M60 96C54 106 66 110 60 118" fill="none" stroke="${d}" stroke-width="2.500" stroke-linecap="round"/>`
    + `<ellipse cx="60" cy="50" rx="46" ry="46" fill="${a}"/><path d="M54 94L66 94L60 103Z" fill="${d}"/>`
    + `<ellipse cx="38" cy="28" rx="11" ry="16" fill="#fff" opacity=".4" transform="rotate(30 38 28)"/><ellipse cx="60" cy="50" rx="46" ry="46" fill="none" stroke="${l}" stroke-width="2" opacity=".5"/>`,
  leaf: (a, d, l) => `<path d="M60 4C102 18 114 70 60 114C6 70 18 18 60 4Z" fill="${a}"/><path d="M60 8V112" stroke="${d}" stroke-width="3" stroke-linecap="round"/>`
    + `<path d="M60 36L38 22M60 54L34 40M60 72L40 60M60 36L82 22M60 54L86 40M60 72L80 60" stroke="${l}" stroke-width="2.200" stroke-linecap="round" opacity=".8"/>`
    + `<ellipse cx="42" cy="34" rx="6" ry="14" fill="#fff" opacity=".3" transform="rotate(-20 42 34)"/>`,
  cloud: (a, d, l) => `<g fill="${a}"><circle cx="34" cy="72" r="28"/><circle cx="62" cy="50" r="34"/><circle cx="92" cy="72" r="26"/><rect x="34" y="70" width="58" height="30" rx="14"/></g>`
    + `<path d="M22 98H100" stroke="${d}" stroke-width="3" stroke-linecap="round" opacity=".35"/><ellipse cx="50" cy="34" rx="14" ry="7" fill="#fff" opacity=".45"/>`,
  boat: (a, d, l) => `<path d="M60 4V78" stroke="${d}" stroke-width="3" stroke-linecap="round"/><path d="M64 8L108 70H64Z" fill="${l}"/><path d="M56 16L18 70H56Z" fill="${a}"/>`
    + `<path d="M6 76H114L98 110H22Z" fill="${d}"/><path d="M10 80H110" stroke="${l}" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
  shell: (a, d, l) => `<path d="M60 114L16 62C4 30 38 6 60 6C82 6 116 30 104 62Z" fill="${a}"/><path d="M60 112L60 10M60 112L30 18M60 112L90 18M60 112L16 50M60 112L104 50" stroke="${l}" stroke-width="2.600" stroke-linecap="round" opacity=".75"/>`
    + `<rect x="42" y="104" width="36" height="10" rx="5" fill="${d}"/>`
};
let n = 0;
Object.keys(SH).forEach((k) => COLS.forEach((c, i) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${k}"><title>${k}</title>`
    + `<ellipse cx="60" cy="116" rx="40" ry="3.500" fill="#000" opacity=".12"/>${SH[k](c[0], c[1], c[2])}${PLATE(c[1])}</svg>\n`;
  fs.writeFileSync(path.join(OUT, `${k}-${i}.svg`), svg); n++;
}));
console.log("✓ " + n + " vật minh hoạ -> learn/story/art/props/");
