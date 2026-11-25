#!/usr/bin/env node
/* SINH tranh "Nhà của … theo lớp" → learn/nha-bi/art/ : thú lớp 1 (thỏ Bông), lớp 2 (mèo Mây), lớp 4 (gấu trúc Trúc), lớp 5 (rồng Tia),
   mỗi thú 8 tư thế (<art>.svg, -joy, -chew, -yawn, -sleep, -blink, -wet, -ban) + nhà ngoài vườn (nha-<art>.svg) + 4 món ăn mới.
   Chạy: node scripts/art/gen-nha-thu-lop.js . Không sửa tay tệp sinh ra. Không đụng bộ sinh cũ (cún Bi = lớp 3 giữ nguyên). */
"use strict";
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "../../learn/nha-bi/art");
const SP = require("./nha-thu/species"), mk = require("./nha-thu/pet"), house = require("./nha-thu/house"), foods = require("./nha-thu/foods");
fs.mkdirSync(OUT, { recursive: true });
let n = 0;
const put = (id, svg) => { fs.writeFileSync(path.join(OUT, id + ".svg"), svg); n++; };
Object.keys(SP).forEach(k => {
  const S = SP[k];
  mk(S).forEach(fn => { const [id, , svg] = fn(); put(id, svg); });
  put("nha-" + S.art, house(S.id, mk.pet(S, "idle", "", "hp" + S.id)[2], S.name));
});
foods.forEach(fn => { const [id, , svg] = fn(); put(id, svg); });
console.log("Đã sinh " + n + " tranh vào learn/nha-bi/art/");
