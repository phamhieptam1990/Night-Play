/* Bộ sinh tranh QUÁN CÁC LỚP (Học Vui, môn Tiếng Anh): mỗi lớp một quán, ra learn/quan-kem/art/g<N>/*.svg + _sheet.html.
   Lớp 1 = sao chép Quán Kem cũ (art/) sang tên chung; lớp 3 = tái dùng Quán Nước Ép (shared/art/tiem-nuoc-ep) + biển/bàn/trang trí mới; lớp 2,4,5 vẽ mới.
   Tên tệp chung mọi quán: item-<id> box-<id> item-empty machine-N sign-N table-N decor-1/2 canh-* khach-* chu-quan. Chạy: node scripts/art/gen-quan-lop.js [lớp...]
   SINH TỰ ĐỘNG, không sửa tay SVG. KHÔNG đụng bộ sinh cũ gen-quan-kem.js. */
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "../..");
const ART = path.join(ROOT, "learn/quan-kem/art");
const { build } = require("./quan-lop/common"), legacy = require("./quan-lop/legacy");
const THEMES = { 2: "banh", 4: "pizza", 5: "cafe" };
const only = process.argv.slice(2).map(Number);

function write(g, list) {
  const dir = path.join(ART, "g" + g); fs.mkdirSync(dir, { recursive: true });
  list.forEach(([n, , svg]) => fs.writeFileSync(path.join(dir, n + ".svg"), n === "canh-san" ? svg.replace("<svg ", '<svg preserveAspectRatio="none" ') : svg));
  const cell = (n, w) => `<figure><img src="${n}.svg" width="${w}" height="${w}" alt=""><figcaption>${n}</figcaption></figure>`;
  const ok = list.filter(r => !/canh-|khach/.test(r[0]));
  const sheet = ["40", "120", "260"].map(w => `<h3>${w}px</h3><div class="r">${ok.map(r => cell(r[0], +w)).join("")}</div>`).join("");
  fs.writeFileSync(path.join(dir, "_sheet.html"), `<!doctype html><meta charset="utf-8"><title>Quán lớp ${g}</title><style>body{background:#FFF1E0;font:12px sans-serif;margin:12px}.r{display:flex;flex-wrap:wrap;gap:8px}figure{margin:0;text-align:center}img{display:block;background:#fff6;border-radius:8px}</style>${sheet}`);
  console.log("✓ lớp " + g + ": " + list.length + " tệp → " + dir);
}
[1, 2, 3, 4, 5].forEach(g => {
  if (only.length && !only.includes(g)) return;
  if (g === 1) return write(1, legacy.grade1(ART));
  if (g === 3) return write(3, legacy.grade3(path.join(ROOT, "shared/art/tiem-nuoc-ep"), build));
  const th = require("./quan-lop/" + THEMES[g]);
  write(g, build(th).concat(legacy.customers()));
});
