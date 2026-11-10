/* Gom các file công khai vào dist/ để Netlify chỉ xuất bản những thứ này (không lộ server/, .env, db). */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const dist = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.join(root, "dist");   // DIST_DIR: thư mục đích khác (bài đo check-landing.js)
/* SITE_TARGET: "hub" = site công khai (không có admin) · "admin" = chỉ trang quản trị · bỏ trống = tất cả (chạy 1 site) */
const TARGET = process.env.SITE_TARGET || "all";
const HUB = ["sw.js", "manifest.webmanifest", "play", "subscribe.html", "privacy.html", "terms.html", "restricted.html", "help.html", "shared.html", "leaderboard.html", "passcheck.html", "cozyplay", "popplay", "shared"];   // thêm mục mới ở đây (hub hai thẻ Pop/Night nằm ở play/; gốc "/" là landing, xem landing/ bên dưới)
const PUBLIC = TARGET === "hub" ? HUB : TARGET === "admin" ? ["admin", "shared", "restricted.html"] : [...HUB, "admin"];
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const p of PUBLIC) {
  const src = path.join(root, p);
  if (!fs.existsSync(src)) { console.warn("bỏ qua (không tồn tại): " + p); continue; }
  fs.cpSync(src, path.join(dist, p), { recursive: true, filter: s => !path.basename(s).startsWith(".") });
}
/* Landing giới thiệu (landing/*): mỗi mục con được copy lên GỐC dist (/ = index.html VI, /en/, /lp/ = css/js/ảnh, /sitemap.xml, /robots.txt); chỉ site công khai, không có ở admin */
if (TARGET !== "admin") {
  const land = path.join(root, "landing");
  if (fs.existsSync(land)) for (const e of fs.readdirSync(land)) {
    if (e.startsWith(".")) continue;
    fs.cpSync(path.join(land, e), path.join(dist, e), { recursive: true, filter: s => !path.basename(s).startsWith(".") });
  }
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  const sm = path.join(dist, "sitemap.xml");
  if (fs.existsSync(sm)) fs.writeFileSync(sm, fs.readFileSync(sm, "utf8").replace(/__BUILD_DATE__/g, day));
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
/* Địa chỉ cũ của landing (/gioi-thieu/, /gioi-thieu/en/) chuyển vĩnh viễn về / và /en/: _redirects (Cloudflare assets/Netlify) + trang tĩnh dự phòng (meta refresh + canonical) cho host không đọc _redirects */
if (TARGET !== "admin") {
  fs.writeFileSync(path.join(dist, "_redirects"), ["/gioi-thieu/en/  /en/  301", "/gioi-thieu/en  /en/  301", "/gioi-thieu/  /  301", "/gioi-thieu  /  301", ""].join("\n"));
  for (const [dir, to] of [["gioi-thieu", "/"], ["gioi-thieu/en", "/en/"]]) {
    fs.mkdirSync(path.join(dist, dir), { recursive: true });
    fs.writeFileSync(path.join(dist, dir, "index.html"), '<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Play Hub</title><meta name="robots" content="noindex"><link rel="canonical" href="https://nightplay.vn' + to + '"><meta http-equiv="refresh" content="0;url=' + to + '"></head><body><a href="' + to + '">Play Hub</a></body></html>\n');
  }
}
if (TARGET === "admin") fs.writeFileSync(path.join(dist, "_redirects"), "/  /admin/  302\n");   // vào domain admin là thấy trang admin
console.log("[" + TARGET + "] dist/ sẵn sàng:", fs.readdirSync(dist).join(", "));
