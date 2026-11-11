/* Bài đo NGÂN SÁCH TẢI TRANG LẦN ĐẦU (cache trống). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-load.js [--quick] [--profile=slow4g|fast4g|desktop] [--json] [--shots=<thư mục>] [--only=<chuỗi>]
   Tự build dist tạm (SITE_TARGET=hub), serve có nén gzip + tiêu đề cache như dist/_headers, rồi với MỖI trang mở một ngữ cảnh ẩn danh MỚI (cache + SW trống),
   giả lập điện thoại tầm trung (390x844, DPR 3, CPU x4, Slow 4G 1.6Mbps/150ms) và đo: số request + byte nén (cả request do service worker nền phát ra),
   FCP, LCP, CLS, TBT (long task sau FCP), thời điểm tải xong, byte tới màn đầu (trước FCP).
   Vượt ngân sách nhẹ (<=30%) chỉ CẢNH BÁO; vượt >30% thì ✗ (thoát mã 1). --quick: 3 trang (landing, /play/, một game Pop). */
const { spawn, spawnSync } = require("child_process"), fs = require("fs"), os = require("os"), path = require("path"), http = require("http"), zlib = require("zlib");
const puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), A = process.argv.slice(2);
const quick = A.includes("--quick"), asJson = A.includes("--json");
const arg = k => (A.find(a => a.startsWith("--" + k + "=")) || "").slice(k.length + 3);
const profile = arg("profile") || "slow4g", shotDir = arg("shots"), only = arg("only");
const CH = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const wait = ms => new Promise(r => setTimeout(r, ms));
const PROF = {
  slow4g: { w: 390, h: 844, dpr: 3, mobile: true, cpu: 4, net: { latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 } },
  fast4g: { w: 390, h: 844, dpr: 3, mobile: true, cpu: 4, net: { latency: 60, downloadThroughput: 9e6 / 8, uploadThroughput: 9e6 / 8 } },
  desktop: { w: 1440, h: 900, dpr: 1, mobile: false, cpu: 1, net: { latency: 20, downloadThroughput: 30e6 / 8, uploadThroughput: 15e6 / 8 } }
}[profile];
/* ngân sách (Slow 4G, CPU x4): [FCP ms, LCP ms, TBT ms, CLS, KB nén tới màn đầu] */
const BUD = { fcp: 1800, lcp: 3000, tbt: 200, cls: 0.05, kb: 250 };
const PAGES = [["landing", "/"], ["landing-en", "/en/"], ["play", "/play/"], ["popplay", "/popplay/"], ["cozyplay", "/cozyplay/"], ["game-pop", "/popplay/games/con-vat-an-so/"], ["game-cozy", "/cozyplay/games/xay-cau-tre/"], ["subscribe", "/subscribe.html"], ["moi", "/moi/"]];
const QUICK = ["landing", "play", "game-pop", "tap-pop"];
/* kịch bản "bấm vào game ngay sau khi cổng tải xong" (lúc service worker đang cài nền): đo game mở tới khi chơi được */
const TAPS = [["tap-pop", "/popplay/", "/popplay/games/con-vat-an-so/"], ["tap-cozy", "/cozyplay/", "/cozyplay/games/xay-cau-tre/"]];
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".webmanifest": "application/manifest+json", ".txt": "text/plain", ".xml": "application/xml", ".woff2": "font/woff2" };

(async () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "load-dist-"));
  const bd = spawnSync(process.execPath, [path.join(root, "scripts", "build.js")], { cwd: root, env: Object.assign({}, process.env, { DIST_DIR: dist, SITE_TARGET: "hub" }), encoding: "utf8" });
  if (bd.status !== 0) { console.log("✗ build lỗi " + (bd.stderr || "").slice(0, 200)); process.exit(1); }
  const HDR = []; { let cur = null; for (const l of fs.readFileSync(path.join(dist, "_headers"), "utf8").split("\n")) { if (/^\S/.test(l)) { cur = {}; HDR.push([new RegExp("^" + l.trim().replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$"), cur]); } else if (cur && l.includes(":")) cur[l.split(":")[0].trim()] = l.slice(l.indexOf(":") + 1).trim(); } }
  let log = [];   /* mỗi request tới máy chủ: {t, url, bytes} */
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    let f = path.join(dist, p);
    if (!f.startsWith(dist)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    else if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html";
    if (!fs.existsSync(f) && fs.existsSync(path.join(f, "index.html"))) f = path.join(f, "index.html");
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end("404"); }
    const ext = path.extname(f); let body = fs.readFileSync(f); const h = { "Content-Type": MIME[ext] || "application/octet-stream" };
    for (const [re, hh] of HDR) if (re.test(p)) for (const k in hh) h[k] = h[k] ? h[k] + ", " + hh[k] : hh[k];   /* đúng như Cloudflare: nối giá trị khi nhiều mẫu khớp */
    if (/\.(html|js|css|json|svg|webmanifest|xml|txt)$/.test(ext) && /gzip/.test(req.headers["accept-encoding"] || "")) { body = zlib.gzipSync(body, { level: 6 }); h["Content-Encoding"] = "gzip"; }
    h["Content-Length"] = body.length; log.push({ t: Date.now(), url: p, bytes: body.length });
    /* băng thông dùng CHUNG cho mọi kết nối (trang + service worker): CDP chỉ bóp request của trang, không bóp request của SW */
    setTimeout(() => { res.writeHead(200, h); active.push({ res, body, off: 0 }); pump(); }, PROF.net.latency);
  });
  const active = []; let pumping = false, rr = 0;
  const pump = () => {
    if (pumping) return; pumping = true;
    const tick = () => {
      if (!active.length) { pumping = false; return; }
      rr %= active.length; const a = active[rr], n = Math.min(4096, a.body.length - a.off);
      a.res.write(a.body.subarray(a.off, a.off + n)); a.off += n;
      if (a.off >= a.body.length) { a.res.end(); active.splice(rr, 1); } else rr++;
      setTimeout(tick, n / PROF.net.downloadThroughput * 1000);
    };
    tick();
  };
  const port = await new Promise(r => srv.listen(0, "127.0.0.1", () => r(srv.address().port))); const B = "http://127.0.0.1:" + port;
  const br = await puppeteer.launch({ executablePath: CH, headless: "new", args: ["--no-sandbox", "--disable-background-timer-throttling"] });
  const rows = [], fails = [], warns = [];
  for (const [name, url, url2] of PAGES.concat(TAPS)) {
    if (quick && !QUICK.includes(name)) continue; if (only && !name.includes(only)) continue;
    const ctx = await br.createBrowserContext(); const pg = await ctx.newPage();
    const cdp = await pg.createCDPSession();
    await pg.setViewport({ width: PROF.w, height: PROF.h, deviceScaleFactor: PROF.dpr, isMobile: PROF.mobile, hasTouch: PROF.mobile });
    await cdp.send("Network.enable"); await cdp.send("Network.setCacheDisabled", { cacheDisabled: false });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: PROF.cpu });
    await pg.evaluateOnNewDocument(() => {
      const m = window.__m = { fcp: 0, lcp: 0, cls: 0, lt: [] };
      try { new PerformanceObserver(l => l.getEntries().forEach(e => { if (e.name === "first-contentful-paint") m.fcp = e.startTime; })).observe({ type: "paint", buffered: true }); } catch (e) {}
      try { new PerformanceObserver(l => l.getEntries().forEach(e => { m.lcp = e.startTime; })).observe({ type: "largest-contentful-paint", buffered: true }); } catch (e) {}
      try { new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) m.cls += e.value; })).observe({ type: "layout-shift", buffered: true }); } catch (e) {}
      try { new PerformanceObserver(l => l.getEntries().forEach(e => m.lt.push([e.startTime, e.duration]))).observe({ type: "longtask", buffered: true }); } catch (e) {}
    });
    log = []; let t0 = Date.now(); let loadAt = 0;
    pg.on("load", () => { loadAt = Date.now() - t0; });
    await pg.goto(B + url, { waitUntil: "load", timeout: 90000 }).catch(() => {});
    if (url2) { await wait(1200); log = []; t0 = Date.now(); await pg.goto(B + url2, { waitUntil: "load", timeout: 90000 }).catch(() => {}); }
    if (shotDir) { fs.mkdirSync(shotDir, { recursive: true }); }
    await wait(+process.env.SETTLE || 9000);   /* chờ service worker (nếu có) cài nền: tính cả byte nó tải */
    const m = await pg.evaluate(() => { const n = performance.getEntriesByType("navigation")[0]; const q = x => document.querySelectorAll(x); return Object.assign({}, window.__m, { dom: q('*').length, domHidden: [...q('body *')].filter(e => !e.offsetParent && getComputedStyle(e).position !== 'fixed').length, imgs: q('img').length, scripts: q('script').length, load: n ? n.loadEventEnd : 0, dcl: n ? n.domContentLoadedEventEnd : 0 }); });
    if (process.env.DBG) console.log(log.map(r => r.url + " " + r.bytes).join("\n"));
    const tbt = m.lt.filter(l => l[0] >= m.fcp).reduce((s, l) => s + Math.max(0, l[1] - 50), 0);
    const kbAll = log.reduce((s, r) => s + r.bytes, 0) / 1024;
    const early = log.filter(r => r.t - t0 <= m.fcp + 50).reduce((s, r) => s + r.bytes, 0) / 1024;   /* byte tới thời điểm FCP */
    const kbLoad = log.filter(r => r.t - t0 <= (m.load || 1e9)).reduce((s, r) => s + r.bytes, 0) / 1024;
    const bg = log.filter(r => r.t - t0 > (m.load || 0) + 50).length;
    rows.push({ name, url, dom: m.dom, hid: m.domHidden, imgs: m.imgs, scr: m.scripts, req: log.length, kbAll: Math.round(kbAll), kbLoad: Math.round(kbLoad), kbFcp: Math.round(early), fcp: Math.round(m.fcp), lcp: Math.round(m.lcp), tbt: Math.round(tbt), cls: +m.cls.toFixed(3), load: Math.round(m.load), bgReq: bg });
    await ctx.close();
  }
  await br.close(); srv.close();
  if (asJson) console.log(JSON.stringify({ profile, rows }, null, 1));
  else {
    console.log("profile=" + profile + " (CPU x" + PROF.cpu + ", " + Math.round(PROF.net.downloadThroughput * 8 / 1e5) / 10 + " Mbps/" + PROF.net.latency + "ms)");
    console.log("trang".padEnd(12) + "DOM(ẩn)  img scr req  KBload KBfcp KBtổng(+nền) FCP    LCP    TBT  CLS    load   reqNền");
    for (const r of rows) console.log(r.name.padEnd(12) + (r.dom + "(" + r.hid + ")").padEnd(9) + String(r.imgs).padEnd(4) + String(r.scr).padEnd(4) + String(r.req).padEnd(5) + String(r.kbLoad).padEnd(7) + String(r.kbFcp).padEnd(6) + String(r.kbAll).padEnd(15) + String(r.fcp).padEnd(7) + String(r.lcp).padEnd(7) + String(r.tbt).padEnd(5) + String(r.cls).padEnd(7) + String(r.load).padEnd(7) + r.bgReq);
  }
  if (profile === "slow4g") for (const r of rows) {
    const chk = (v, b, lab, unit) => { if (v > b * 1.3) fails.push(r.name + ": " + lab + " " + v + unit + " > " + b + unit + " +30%"); else if (v > b) warns.push(r.name + ": " + lab + " " + v + unit + " > " + b + unit); };
    const isGame = r.name.startsWith("game"); const k = isGame ? 1.4 : 1;
    chk(r.fcp, BUD.fcp * k, "FCP", "ms"); chk(r.lcp, BUD.lcp * k, "LCP", "ms"); chk(r.tbt, BUD.tbt, "TBT", "ms"); chk(r.cls, BUD.cls, "CLS", ""); chk(r.kbFcp, BUD.kb * (isGame ? 3 : 1), "KB tới màn đầu", "KB");
  }
  for (const w of warns) console.log("  ! " + w); for (const f of fails) console.log("  ✗ " + f);
  console.log(fails.length ? "✗ " + fails.length + " vượt ngân sách >30%" : "✓ ngân sách tải" + (warns.length ? " (" + warns.length + " cảnh báo)" : ""));
  process.exit(fails.length ? 1 : 0);
})();
