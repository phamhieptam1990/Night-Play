#!/usr/bin/env node
"use strict";
/* Sinh server/event-catalog.js: danh sách game + giao diện mà admin được phép tích khi tạo mã sự kiện.
   Chỉ gồm game ĐÃ KIỂM TRA bộ lọc giao diện (scripts/check-eventcode.js phải đạt). Thêm game mới = thêm id vào SUPPORTED rồi chạy lại.
   Chạy: node scripts/gen-event-catalog.js */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const SUPPORTED = ["bao-nhieu-giay", "cat-banh-chung", "duong-ray", "mat-tinh-khong", "ne-o-ga", "noi-mot-net", "shipper-sieu-toc", "song-sot-cuoi-thang", "ve-mot-net", "xay-cau-tre"];
const out = [];
for (const id of SUPPORTED) {
  const html = fs.readFileSync(path.join(root, "cozyplay/games", id, "index.html"), "utf8");
  const m = /const CATALOG=(\[\[.*?\]\]);/.exec(html); if (!m) throw new Error("không thấy CATALOG: " + id);
  const cat = JSON.parse(m[1]);
  const t = /<title>([^<]*)<\/title>/.exec(html), name = t ? t[1].replace(/\s*[–-].*$/, "").trim() : id;
  out.push({ id, name, skins: cat.filter(c => c[0] !== "basic").map(c => ({ id: c[0], vi: c[1], en: c[2], e: c[3] })) });
}
fs.writeFileSync(path.join(root, "server/event-catalog.js"), '"use strict";\n/* TỰ SINH bởi scripts/gen-event-catalog.js — không sửa tay. */\nmodule.exports = ' + JSON.stringify(out, null, 1) + ";\n");
console.log("✓ " + out.length + " game, " + out.reduce((a, g) => a + g.skins.length, 0) + " giao diện");
