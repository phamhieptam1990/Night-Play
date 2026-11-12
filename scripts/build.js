/* Gom các file công khai vào dist/ để Netlify chỉ xuất bản những thứ này (không lộ server/, .env, db). */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const dist = process.env.DIST_DIR ? path.resolve(process.env.DIST_DIR) : path.join(root, "dist");   // DIST_DIR: thư mục đích khác (bài đo check-landing.js)
/* SITE_TARGET: "hub" = site công khai (không có admin) · "admin" = chỉ trang quản trị · bỏ trống = tất cả (chạy 1 site) */
const TARGET = process.env.SITE_TARGET || "all";
const HUB = ["sw.js", "manifest.webmanifest", "play", "subscribe.html", "privacy.html", "terms.html", "legal", "restricted.html", "help.html", "shared.html", "leaderboard.html", "passcheck.html", "cozyplay", "popplay", "shared"];   // thêm mục mới ở đây (hub hai thẻ Pop/Night nằm ở play/; gốc "/" là landing, xem landing/ bên dưới)
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
  require("./build-moi.js").build(dist);   // trang tin ra mắt /moi/, /en/moi/ (+ trang riêng) sinh từ landing/moi/launches.json, điền <!--MOI--> trong sitemap
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  const sm = path.join(dist, "sitemap.xml");
  if (fs.existsSync(sm)) fs.writeFileSync(sm, fs.readFileSync(sm, "utf8").replace(/__BUILD_DATE__/g, day));
}
/* Ghi ngày build (giờ Việt Nam) để hiển thị "Cập nhật lần cuối" ở cuối mỗi trang */
const upd = path.join(dist, "shared", "updated.js");
if (fs.existsSync(upd)) {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  /* PHIÊN BẢN: "version" trong package.json (đặt theo ngày phát hành: 2026.11.12, cùng ngày phát hành lần hai thì 2026.11.12-2) + mã commit ngắn; hiện cạnh "Cập nhật lần cuối" và trùng tên tag git vX */
  let ver = ""; try { ver = require("../package.json").version || ""; } catch (e) {}
  let sha = ""; try { sha = require("child_process").execSync("git rev-parse --short HEAD", { cwd: path.join(__dirname, ".."), stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch (e) {}
  fs.writeFileSync(upd, 'window.SITE_BUILD = "' + day + '";window.SITE_VER = "' + ver + '";window.SITE_SHA = "' + sha + '";\n' + fs.readFileSync(upd, "utf8"));
}
let BUILD_ID = "";
/* Mã bản build: ghi vào dist/version.json và vào đầu shared/offline.js (NP_BUILD) để trang đang mở so sánh và nhắc tải lại khi có bản mới */
if (TARGET !== "admin") {
  let v = ""; try { v = require("../package.json").version || ""; } catch (e) {}
  let h = ""; try { h = require("child_process").execSync("git rev-parse --short HEAD", { cwd: root, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch (e) {}
  const id = BUILD_ID = [v, h, Date.now().toString(36)].filter(Boolean).join(".");
  fs.writeFileSync(path.join(dist, "version.json"), JSON.stringify({ id, ver: v, sha: h }) + "\n");
  const off = path.join(dist, "shared", "offline.js");
  if (fs.existsSync(off)) fs.writeFileSync(off, 'var NP_BUILD = "' + id + '";\n' + fs.readFileSync(off, "utf8"));
}
/* Huy hiệu "Mới" của hai trang cổng: sinh lại shared/newbadge.js từ landing/moi/launches.json (cổng chạy offline, không fetch) */
if (TARGET !== "admin" && fs.existsSync(path.join(dist, "shared"))) require("./gen-newbadge.js").write(path.join(dist, "shared", "newbadge.js"));
/* CSS nội tuyến cho trang đầu (landing VI/EN và /play/): thay các <link rel=stylesheet> cục bộ bằng <style> ngay lúc build (nguồn không đổi) -> bỏ 4-5 request + 1 vòng RTT chặn vẽ,
   không có FOUC (CSS có sẵn trong HTML). Chỉ dist; url() tương đối được đổi thành tuyệt đối. Tắt bằng NO_INLINE_CSS=1. */
if (TARGET !== "admin" && !process.env.NO_INLINE_CSS) for (const f of ["index.html", "en/index.html", "play/index.html"]) {
  const hp = path.join(dist, f); if (!fs.existsSync(hp)) continue;
  const dirUrl = "/" + path.posix.dirname(f).replace(/^\.$/, "");
  let html = fs.readFileSync(hp, "utf8");
  html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) => {
    if (/^(https?:)?\/\//.test(href)) return m;
    const abs = href.startsWith("/") ? href : path.posix.normalize(path.posix.join(dirUrl, href));
    const cp = path.join(dist, abs); if (!fs.existsSync(cp)) return m;
    const cdir = path.posix.dirname(abs);
    const css = fs.readFileSync(cp, "utf8").replace(/url\((["']?)(?!data:|https?:|\/|#)([^"')]+)\1\)/g, (u, q, r) => "url(" + q + path.posix.normalize(path.posix.join(cdir, r)) + q + ")");
    return "<style>" + css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s*/g, "\n") + "</style>";
  });
  fs.writeFileSync(hp, html);
}
/* Gắn ?v=<mã bản> vào mọi <script src>/<link href> .js/.css cục bộ trong HTML của dist: tên tệp không có hash nên trình duyệt (nhất là WebKit/iOS) giữ bản cũ trong bộ nhớ đệm HTTP
   dù reload; địa chỉ đổi mỗi lần build thì chắc chắn phải tải lại. HTML luôn được kiểm tra lại (must-revalidate). Service worker bỏ phần ?query khi lưu cache nên không ảnh hưởng offline. */
if (BUILD_ID) {
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (e.name.endsWith(".html")) ver(f); } };
  const ver = f => {
    const a = fs.readFileSync(f, "utf8");
    const b = a.replace(/(<script\b[^>]*?\bsrc=|<link\b[^>]*?\bhref=)"([^"#?]+\.(?:js|css))"/g, (m, pre, u) => /^(?:[a-z]+:)?\/\//i.test(u) || /^data:/i.test(u) ? m : pre + '"' + u + "?v=" + BUILD_ID + '"');
    if (b !== a) fs.writeFileSync(f, b);
  };
  walk(dist);
}
/* Tiêu đề phản hồi cho file tĩnh (Cloudflare Workers assets đọc dist/_headers; tương đương netlify.toml) */
fs.writeFileSync(path.join(dist, "_headers"), [
  /* Chống nhúng: chỉ cho chính domain mình đặt trang trong iframe (cổng nhúng game cùng origin). Mở link trực tiếp (Zalo, Messenger…) không bị ảnh hưởng. */
  "/*", "  Content-Security-Policy: frame-ancestors 'self'", "  X-Frame-Options: SAMEORIGIN", "",
  "/admin/*", "  X-Robots-Tag: noindex, nofollow", "  Cache-Control: no-store", "",
  "/sw.js", "  Cache-Control: no-cache", "",
  "/version.json", "  Cache-Control: no-store", "",
  "/shared/fonts/*", "  Cache-Control: public, max-age=31536000, immutable", "",
  /* Cache (các mẫu KHÔNG chồng nhau: Cloudflare nối giá trị khi nhiều mẫu cùng khớp). Cập nhật phía người dùng vẫn qua sw.js (mạng-trước) + CACHE version.
     Ảnh ít đổi: 7 ngày. CSS/JS không có hash: no-cache (luôn hỏi lại, 304 rất nhẹ) — trước đây max-age=300 + stale-while-revalidate=86400 khiến bản cũ "dính" tới 1 ngày kể cả sau khi reload. HTML giữ mặc định (luôn kiểm tra lại). */
  "/shared/orbit-icons/*", "  Cache-Control: public, max-age=604800", "",
  "/lp/img/*", "  Cache-Control: public, max-age=604800", "",
  "/shared/*.js", "  Cache-Control: no-cache", "",
  "/shared/*.css", "  Cache-Control: no-cache", "",
  "/lp/*.css", "  Cache-Control: no-cache", "",
  "/lp/*.js", "  Cache-Control: no-cache", ""
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
