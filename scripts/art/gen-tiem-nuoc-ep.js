/* Bộ sinh tranh Quán Nước Ép (game Tiếng Anh lớp 3): ghép các hàm vẽ en-*.js (+ vật mẫu props.js) thành shared/art/tiem-nuoc-ep/*.svg và trang xem mẫu _sheet.html.
   Chạy: node scripts/art/gen-tiem-nuoc-ep.js  — SINH TỰ ĐỘNG, không sửa tay các SVG. */
"use strict";
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "../../shared/art/tiem-nuoc-ep");
const props = require("./tiem/props"), fruit = require("./tiem/en-fruit"), cup = require("./tiem/en-cup"), mach = require("./tiem/en-machine");
const an = require("./tiem/en-animals"), scene = require("./tiem/en-scene"), town = require("./tiem/en-town");
const pick = (fn, name) => { const r = fn(); r[0] = name || r[0]; return r; };
const list = [pick(props[0], "cam"), pick(props[1], "dau")].map(r => (r[0] = "fruit-" + r[0], r));
fruit.slice(0, 4).forEach(f => { const r = f(); r[0] = "fruit-" + r[0]; list.push(r); });
list.push(fruit[4]());
cup.cups.forEach(f => list.push(f())); cup.others.forEach(f => list.push(f()));
mach.forEach(f => list.push(f())); an.customers.forEach(f => list.push(f())); list.push(an.mascot()); scene.concat(town).forEach(f => list.push(f()));
list.push(pick(props[7], "thuc-don"));
fs.mkdirSync(OUT, { recursive: true });
list.forEach(([n, , svg]) => fs.writeFileSync(path.join(OUT, n + ".svg"), n === "canh-san" ? svg.replace("<svg ", '<svg preserveAspectRatio="none" ') : svg));
const cell = ([n, l], w) => `<figure><img src="${n}.svg" width="${w}" height="${w}" alt="${l}"><figcaption>${n}</figcaption></figure>`;
const sheet = ["40", "120", "260"].map(w => `<h3>${w}px</h3><div class="r">${list.filter(r => !/canh-/.test(r[0])).map(r => cell(r, +w)).join("")}</div>`).join("");
fs.writeFileSync(path.join(OUT, "_sheet.html"), `<!doctype html><meta charset="utf-8"><title>Quán Nước Ép - mẫu</title><style>body{background:#FFF1E0;font:12px sans-serif;margin:12px}.r{display:flex;flex-wrap:wrap;gap:8px}figure{margin:0;text-align:center}img{display:block;background:#fff6;border-radius:8px}</style>${sheet}<h3>cảnh</h3>${["canh-sau","canh-quay","canh-san","canh-pho","canh-vuon","canh-cua-hang","canh-so"].map(n => `<img src="${n}.svg" style="width:300px;margin:4px">`).join("")}`);
console.log("✓ " + list.length + " tệp SVG → " + OUT);
