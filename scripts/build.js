/* Gom các file công khai vào dist/ để Netlify chỉ xuất bản những thứ này (không lộ server/, .env, db). */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
/* SITE_TARGET: "hub" = site công khai (không có admin) · "admin" = chỉ trang quản trị · bỏ trống = tất cả (chạy 1 site) */
const TARGET = process.env.SITE_TARGET || "all";
const HUB = ["sw.js", "index.html", "subscribe.html", "privacy.html", "restricted.html", "help.html", "shared.html", "leaderboard.html", "passcheck.html", "cozyplay", "popplay", "shared"];   // thêm mục mới ở đây
const PUBLIC = TARGET === "hub" ? HUB : TARGET === "admin" ? ["admin", "shared", "restricted.html"] : [...HUB, "admin"];
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const p of PUBLIC) {
  const src = path.join(root, p);
  if (!fs.existsSync(src)) { console.warn("bỏ qua (không tồn tại): " + p); continue; }
  fs.cpSync(src, path.join(dist, p), { recursive: true, filter: s => !path.basename(s).startsWith(".") });
}
/* Ghi ngày build (giờ Việt Nam) để hiển thị "Cập nhật lần cuối" ở cuối mỗi trang */
const upd = path.join(dist, "shared", "updated.js");
if (fs.existsSync(upd)) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  fs.writeFileSync(upd, 'window.SITE_BUILD = "' + day + '";\n' + fs.readFileSync(upd, "utf8"));
}
/* Tiêu đề phản hồi cho file tĩnh (Cloudflare Workers assets đọc dist/_headers; tương đương netlify.toml) */
fs.writeFileSync(path.join(dist, "_headers"), [
  "/admin/*", "  X-Robots-Tag: noindex, nofollow", "  Cache-Control: no-store", "",
  "/sw.js", "  Cache-Control: no-cache", ""
].join("\n"));
if (TARGET === "admin") fs.writeFileSync(path.join(dist, "_redirects"), "/  /admin/  302\n");   // vào domain admin là thấy trang admin
console.log("[" + TARGET + "] dist/ sẵn sàng:", fs.readdirSync(dist).join(", "));
