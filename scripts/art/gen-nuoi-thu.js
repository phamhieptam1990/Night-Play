#!/usr/bin/env node
/* SINH tranh Nhà Của Bi → shared/art/nuoi-thu/*.svg (+ trang xem thử preview.html).
   Chạy: node scripts/art/gen-nuoi-thu.js   Không sửa tay các tệp sinh ra. */
"use strict";
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "../../shared/art/nuoi-thu");
const P = require("./tiem/props");      /* xương [4], bát ăn [5], bóng [3], vịt cao su [6] dùng lại */
const list = [P[3], P[4], P[5], P[6]].concat(require("./tiem/vi-pet"), require("./tiem/vi-props"), require("./tiem/vi-world"));
fs.mkdirSync(OUT, { recursive: true });
const names = [];
list.forEach(fn => { const [id, label, svg] = fn(); fs.writeFileSync(path.join(OUT, id + ".svg"), svg); names.push([id, label]); });
/* linh vật = chính bé cún (bản mặc định) */
fs.copyFileSync(path.join(OUT, "cun.svg"), path.join(OUT, "mascot-pop-nuoi-thu-tieng-viet.svg"));
const cell = n => `<figure><img src="${n[0]}.svg" alt="${n[1]}"><figcaption>${n[0]}</figcaption></figure>`;
fs.writeFileSync(path.join(OUT, "preview.html"), `<!doctype html><meta charset=utf-8><title>Nuôi thú: xem thử</title><style>body{font:12px sans-serif;background:#FFF6E8;margin:12px}` +
  `.g{display:flex;flex-wrap:wrap;gap:8px}figure{margin:0;text-align:center}img{display:block;width:var(--s)}h3{margin:14px 0 4px}</style>` +
  [300, 120, 40].map(s => `<h3>${s}px</h3><div class=g style="--s:${s}px">${names.map(cell).join("")}</div>`).join(""));
console.log("Đã sinh " + names.length + " tranh vào shared/art/nuoi-thu/");
