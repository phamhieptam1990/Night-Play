/* Gom các file công khai vào dist/ để Netlify chỉ xuất bản những thứ này (không lộ server/, .env, db). */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const PUBLIC = ["index.html", "subscribe.html", "privacy.html", "admin", "cozyplay", "popplay", "shared"];   // thêm mục mới ở đây
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const p of PUBLIC) {
  const src = path.join(root, p);
  if (!fs.existsSync(src)) { console.warn("bỏ qua (không tồn tại): " + p); continue; }
  fs.cpSync(src, path.join(dist, p), { recursive: true, filter: s => !path.basename(s).startsWith(".") });
}
console.log("dist/ sẵn sàng:", fs.readdirSync(dist).join(", "));
