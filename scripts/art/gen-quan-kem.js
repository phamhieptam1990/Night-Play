/* Bộ sinh tranh QUÁN KEM (Học Vui): kem ốc quế, hộp kem, máy kem, biển, bàn ghế, trang trí, tường + dùng lại cảnh/khách thú từ bộ tiem.
   Ra learn/quan-kem/art/*.svg và _sheet.html. Chạy: node scripts/art/gen-quan-kem.js — SINH TỰ ĐỘNG, không sửa tay SVG. */
"use strict";
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "../../learn/quan-kem/art");
const kem = require("./quan-kem/kem"), may = require("./quan-kem/may"), an = require("./tiem/en-animals"), town = require("./tiem/en-town");
const list = [];
kem.items.forEach(f => list.push(f())); may.forEach(f => list.push(f()));
an.customers.forEach(f => list.push(f()));
const keep = ["canh-quay", "canh-san", "canh-pho", "canh-cua-hang", "canh-so"];
town.forEach(f => { const r = f(); if (keep.includes(r[0])) list.push(r); });
fs.mkdirSync(OUT, { recursive: true });
list.forEach(([n, , svg]) => fs.writeFileSync(path.join(OUT, n + ".svg"), n === "canh-san" ? svg.replace("<svg ", '<svg preserveAspectRatio="none" ') : svg));
const cell = ([n, l], w) => `<figure><img src="${n}.svg" width="${w}" height="${w}" alt="${l}"><figcaption>${n}</figcaption></figure>`;
const sheet = ["40", "120", "260"].map(w => `<h3>${w}px</h3><div class="r">${list.filter(r => !/canh-/.test(r[0]) && !/khach/.test(r[0])).map(r => cell(r, +w)).join("")}</div>`).join("");
fs.writeFileSync(path.join(OUT, "_sheet.html"), `<!doctype html><meta charset="utf-8"><title>Quán Kem - mẫu</title><style>body{background:#FFF1E0;font:12px sans-serif;margin:12px}.r{display:flex;flex-wrap:wrap;gap:8px}figure{margin:0;text-align:center}img{display:block;background:#fff6;border-radius:8px}</style>${sheet}`);
console.log("✓ " + list.length + " tệp SVG → " + OUT);
