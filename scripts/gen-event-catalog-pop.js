#!/usr/bin/env node
"use strict";
/* Sinh server/event-catalog-pop.json: danh sách game Pop Play + giao diện (khoá "loại:giao diện") cho mã sự kiện.
   Cần trình duyệt: NODE_PATH=<thư mục puppeteer-core> node scripts/gen-event-catalog-pop.js
   Mở từng game, đọc PF.catalog + tên hiển thị (VI/EN) từ chính popup Giao diện (openSkins(loại)). */
const puppeteer = require("puppeteer-core"), http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".webp": "image/webp", ".jpg": "image/jpeg" };
const srv = http.createServer((q, r) => { const p = decodeURIComponent(q.url.split("?")[0]), f = path.join(root, p); if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); }).listen(0);
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const br = await puppeteer.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--no-sandbox"] });
  const ids = fs.readdirSync(path.join(root, "popplay/games")).filter(d => fs.existsSync(path.join(root, "popplay/games", d, "index.html"))).sort();
  const out = [];
  for (const id of ids) {
    const per = {};
    for (const lang of ["vi", "en"]) {
      const pg = await br.newPage(); await pg.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });
      await pg.evaluateOnNewDocument(l => { try { localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("lang", l); } catch (e) {} }, lang);
      await pg.setRequestInterception(true); pg.on("request", r => /\/api\//.test(r.url()) ? r.respond({ status: 401, body: "{}" }) : r.continue());
      await pg.goto("http://localhost:" + srv.address().port + "/popplay/games/" + id + "/index.html?lang=" + lang, { waitUntil: "load" }); await wait(1500);
      per[lang] = await pg.evaluate(async () => {
        const o = { name: (document.querySelector("h1") || document.title).textContent || document.title, types: [] };
        for (const ty of Object.keys(PF.catalog)) {
          openSkins(ty); await new Promise(r => setTimeout(r, 150));
          const tn = (() => { const f = (typeof T === "function" ? T : typeof t === "function" ? t : null); if (!f) return ""; try { const a = f("ty"); if (a && typeof a === "object" && a[ty] != null) return String(a[ty]); } catch (e) {} try { const v = f("ty." + ty); if (v && v !== "ty." + ty) return String(v); } catch (e) {} return ""; })();
          const head = tn || ("#" + (isNaN(+ty) ? ty : +ty + 1)), btns = [...document.querySelectorAll("#skGrid button")];
          o.types.push({ ty, head: head.replace(/\s+/g, " ").trim(), ids: PF.catalog[ty].map(c => Array.isArray(c) ? c[0] : c), emo: PF.catalog[ty].map(c => Array.isArray(c) ? (c[2] || "🎨") : "🎨"), names: btns.map(b => (b.querySelector("span") || b).textContent.trim()) });
        }
        return o;
      });
      await pg.close();
    }
    const g = { id, portal: "pop", nested: true, name: { vi: per.vi.name.replace(/\s+/g, " ").trim(), en: per.en.name.replace(/\s+/g, " ").trim() }, skins: [] };
    per.vi.types.forEach((t, i) => { const e = per.en.types[i]; t.ids.forEach((sid, k) => { if (sid === "default" || sid === "basic") return; g.skins.push({ id: t.ty + ":" + sid, vi: t.head + " · " + (t.names[k] || sid), en: e.head + " · " + (e.names[k] || sid), e: t.emo[k] || "🎨" }); }); });
    out.push(g); console.log(id, g.skins.length, "giao diện");
  }
  fs.writeFileSync(path.join(root, "server/event-catalog-pop.json"), JSON.stringify(out, null, 1) + "\n");
  await br.close(); srv.close();
})();
