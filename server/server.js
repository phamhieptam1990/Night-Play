/**
 * Night Play – server local (dev): phục vụ file tĩnh + gọi lõi API (app.js) + hot reload.
 * Production chạy trên Netlify: xem netlify/functions/api.js (dùng chung app.js).
 *
 * Chạy: ./run.command   hoặc   DEV_RELOAD=1 node server/server.js
 * Biến môi trường được nạp từ server/.env.development (khi DEV_RELOAD=1) hoặc file chỉ định bằng ENV_FILE.
 */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

/* Nạp file env (không phụ thuộc Node >= 20.6). Biến đã có trong môi trường được ưu tiên. */
const envFile = process.env.ENV_FILE || (process.env.DEV_RELOAD === "1" ? path.join(__dirname, ".env.development") : "");
if (envFile && fs.existsSync(envFile)) {
  for (const l of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

const { handle } = require("./app");
const PORT = +(process.env.PORT || 3000);
const CORS = process.env.CORS_ORIGIN || "";
const DEV = process.env.DEV_RELOAD === "1";
const STATIC_ROOT = path.resolve(process.env.STATIC_ROOT || path.join(__dirname, ".."));
const TRUST_PROXY = process.env.TRUST_PROXY === "1";
const clientIp = req => (TRUST_PROXY && String(req.headers["x-forwarded-for"] || "").split(",")[0].trim()) || req.socket.remoteAddress;

function send(res, code, obj, type) {
  res.writeHead(code, { "Content-Type": type || "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(type ? String(obj) : JSON.stringify(obj));
}
function readBody(req, limit = 10240) {
  return new Promise((resolve, reject) => {
    let n = 0; const chunks = [];
    req.on("data", c => { n += c.length; if (n > limit) { reject(Object.assign(new Error("too_large"), { code: 413 })); req.destroy(); } else chunks.push(c); });
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    req.on("error", reject);
  });
}
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".json": "application/json", ".ico": "image/x-icon", ".woff2": "font/woff2", ".pdf": "application/pdf" };   // thiếu .pdf thì trình duyệt tải xuống thay vì mở (nút "Mở tab mới" ở trang Điều khoản/Riêng tư)
/* Trang tin ra mắt /moi/, /en/moi/ (+ trang riêng) được SINH lúc build (scripts/build-moi.js) nên bản dev cục bộ không có sẵn:
   sinh vào thư mục tạm khi khởi động (và khi launches.json đổi, khởi động lại là có) để localhost:PORT/moi/ không bị 404. */
let MOI_DEV = null;
try {
  const d = path.join(require("os").tmpdir(), "np-moi-dev-" + process.pid);
  fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(d, { recursive: true });
  require("../scripts/build-moi.js").build(d); MOI_DEV = d;
  process.on("exit", () => { try { fs.rmSync(d, { recursive: true, force: true }); } catch (e) {} });
} catch (e) { console.warn("[dev] không sinh được /moi/ cục bộ:", e.message); }
function serveStatic(req, res, pathname) {
  let rel; try { rel = decodeURIComponent(pathname); } catch { return send(res, 400, { error: "bad_path" }); }
  if (rel.endsWith("/")) rel += "index.html";
  let file = path.resolve(STATIC_ROOT, "." + rel);
  /* Landing giới thiệu: nguồn nằm ở landing/ nhưng triển khai lên gốc (/, /en/, /lp/...; xem scripts/build.js) → bản dev tìm thêm ở landing/ */
  if (!fs.existsSync(file) && !rel.startsWith("/landing/")) { const alt = path.resolve(STATIC_ROOT, "landing", "." + rel); if (alt.startsWith(path.join(STATIC_ROOT, "landing") + path.sep) && fs.existsSync(alt)) file = alt; }
  if (!fs.existsSync(file) && MOI_DEV && /^\/(en\/)?moi\//.test(rel)) { const m = path.resolve(MOI_DEV, "." + rel); if (m.startsWith(MOI_DEV + path.sep) && fs.existsSync(m)) { fs.readFile(m, (err, buf) => { if (err) return send(res, 404, { error: "not_found" }); res.writeHead(200, { "Content-Type": MIME[path.extname(m)] || "text/html; charset=utf-8", "X-Content-Type-Options": "nosniff" }); res.end(buf); }); return; } }
  const inRoot = file.startsWith(STATIC_ROOT + path.sep);
  const hidden = path.relative(STATIC_ROOT, file).split(path.sep).some(s => s.startsWith(".") || s === "server" || s === "node_modules" || s === "netlify" || s === "scripts");
  if (!inRoot || hidden) return send(res, 404, { error: "not_found" });
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, { error: "not_found" });
    if (DEV && file.endsWith(".html")) {
      const tag = `<script>new EventSource("/__reload").onmessage=()=>location.reload()</script>`;
      buf = Buffer.from(String(buf).replace(/<\/body>/i, tag + "</body>"));
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "X-Content-Type-Options": "nosniff" });
    res.end(buf);
  });
}

const clients = new Set();
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (CORS) {
    res.setHeader("Access-Control-Allow-Origin", CORS);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  }
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self'"); res.setHeader("X-Frame-Options", "SAMEORIGIN");   // chống nhúng iframe từ domain khác
  if (DEV && url.pathname === "/__reload") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive" });
    res.write(": ok\n\n"); clients.add(res); req.on("close", () => clients.delete(res)); return;
  }
  if (!url.pathname.startsWith("/api/")) {
    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, { error: "method" });
    return serveStatic(req, res, url.pathname);
  }
  let bodyText = "";
  try { if (req.method === "POST") bodyText = await readBody(req); }
  catch (e) { return send(res, e.code || 400, { error: e.message }); }
  const r = await handle({ method: req.method, pathname: url.pathname, query: url.searchParams, headers: req.headers, bodyText, ip: clientIp(req) });
  send(res, r.status, r.body, r.type);
});

/* Hot reload (chỉ khi DEV_RELOAD=1): theo dõi file tĩnh, báo trình duyệt tải lại */
if (DEV) {
  let t;
  fs.watch(STATIC_ROOT, { recursive: true }, (ev, name) => {
    if (!name || /(^|[\\/])(server|node_modules|netlify|scripts|\.)/.test(name)) return;
    clearTimeout(t); t = setTimeout(() => clients.forEach(c => c.write("data: r\n\n")), 80);
  });
}
server.listen(PORT, () => console.log(`Night Play server http://localhost:${PORT}`));
