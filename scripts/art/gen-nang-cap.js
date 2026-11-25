#!/usr/bin/env node
/* SINH tranh NÂNG CẤP (lớp SVG chồng): hào quang + sao quanh thú theo cấp (learn/nha-bi/art/evo-1..4.svg), huy hiệu cấp (huy-hieu-2..5.svg, dùng ở popup),
   mái hiên + đèn + cờ + huy hiệu của quán theo cấp (learn/quan-kem/art/g<N>/mai-2..5.svg, art/huy-2..5.svg). Chạy: node scripts/art/gen-nang-cap.js
   KHÔNG đụng tranh cũ (không chạy gen-nha-thu-lop / gen-quan-lop). Theo chuẩn Pop 3D của tiem/core.js. */
"use strict";
const fs = require("fs"), path = require("path");
const pet = require("./nang-cap/pet"), quan = require("./nang-cap/quan");
const NB = path.join(__dirname, "../../learn/nha-bi/art"), QK = path.join(__dirname, "../../learn/quan-kem/art");
let n = 0; const put = (dir, id, svg) => { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, id + ".svg"), svg); n++; };
for (let l = 1; l <= 4; l++) put(NB, "evo-" + l, pet.evo(l));
for (let l = 2; l <= 5; l++) { put(NB, "huy-hieu-" + l, pet.badge(l)); put(QK, "huy-" + l, pet.badge(l)); }
for (let g = 1; g <= 5; g++) for (let l = 2; l <= 5; l++) put(path.join(QK, "g" + g), "mai-" + l, quan.awning(g, l));
console.log("Đã sinh " + n + " tranh nâng cấp");
