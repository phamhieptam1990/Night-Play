#!/usr/bin/env node
"use strict";
/* Bài đo bảo mật mã sự kiện cho 12 game POP PLAY, chạy trong TRÌNH DUYỆT THẬT (mã Pop cần PF thật của game).
   Với mỗi game × 3 tổ hợp giao diện: chạy mã Night Pass đã LỌC (server/events.js filterSource) rồi kiểm tra
   (1) mọi loại chơi chỉ còn giao diện nền + đúng các "loại:giao diện" được tích; (2) mọi thuộc tính KHÁC của PF (loại chơi mở khoá, PF.pro, cờ…) y hệt trước khi chạy;
   (3) không thêm thuộc tính mới vào PF. Chạy: NODE_PATH=<thư mục puppeteer-core> node scripts/check-eventcode-pop.js */
const puppeteer = require("puppeteer-core"), http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const ev = require(path.join(root, "server/events.js"))({ route() {}, out() {}, limited() {}, hmac: s => s, safeEq() {}, ipHash() {}, adminGuard() {}, noTable() {}, b64u: s => s, db: {} });
const CAT = require(path.join(root, "server/event-catalog-pop.json"));
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".webp": "image/webp", ".jpg": "image/jpeg" };
const srv = http.createServer((q, r) => { const p = decodeURIComponent(q.url.split("?")[0]), f = path.join(root, p); if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); }).listen(0);
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const br = await puppeteer.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--no-sandbox"] });
  let fails = 0; const bad = m => { fails++; console.log("  ✗ " + m); };
  for (const g of CAT) {
    const all = g.skins.map(s => s.id), subsets = [[all[0]], all, [all[all.length - 1], all[0]]];
    for (const keep of subsets) {
      const pg = await br.newPage(); await pg.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });
      await pg.evaluateOnNewDocument(() => { try { localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("lang", "vi"); } catch (e) {} });
      await pg.setRequestInterception(true); pg.on("request", r => /\/api\//.test(r.url()) ? r.respond({ status: 401, body: "{}" }) : r.continue());
      await pg.goto("http://localhost:" + srv.address().port + "/popplay/games/" + g.id + "/index.html", { waitUntil: "load" }); await wait(1200);
      const r = await pg.evaluate((src, keep) => {
        const P = window.PF; if (!P) return { err: "không có PF" };
        const snap = () => JSON.stringify(Object.fromEntries(Object.entries(P).filter(([k]) => k !== "skins").map(([k, v]) => [k, typeof v === "function" ? "fn" : v])));
        const k0 = Object.keys(P), s0 = snap(), base = {}; for (const t in P.skins) base[t] = Object.keys(P.skins[t] || {});
        try { new Function("PF", src)(P); } catch (e) { return { err: "chạy lỗi: " + e.message }; }
        const left = {}; for (const t in P.skins) left[t] = Object.keys(P.skins[t] || {});
        return { base, left, same: snap() === s0, extra: Object.keys(P).filter(k => !k0.includes(k)), pro: P.pro };
      }, ev.filterSource(g.id, keep), keep);
      await pg.close();
      if (r.err) { bad(g.id + " [" + keep.join(",") + "]: " + r.err); continue; }
      for (const t of Object.keys(r.left)) {
        const want = new Set([...(r.base[t] || []).filter(x => x === "basic" || x === "default"), ...keep.filter(k => k.split(":")[0] === t).map(k => k.split(":")[1])]);
        const got = new Set(r.left[t]);
        if (want.size !== got.size || [...want].some(x => !got.has(x))) bad(g.id + " loại " + t + ": còn " + [...got] + " ≠ " + [...want]);
      }
      if (!r.same) bad(g.id + " [" + keep.length + " gd]: thuộc tính ngoài skins bị đổi"); if (r.extra.length) bad(g.id + ": thêm thuộc tính " + r.extra);
      if (r.pro) bad(g.id + ": PF.pro bị đặt");
    }
    console.log((fails ? "" : "  ") + "· " + g.id + " (" + all.length + " giao diện × 3 tổ hợp)");
  }
  await br.close(); srv.close();
  console.log(fails ? "✗ " + fails + " lỗi" : "✓ tất cả đạt"); process.exit(fails ? 1 : 0);
})();
