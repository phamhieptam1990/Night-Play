/* Kiểm tra OFFLINE + HIỆU NĂNG (lag) cho 20 game Cozy + 12 game Pop + 2 trang cổng. Chạy lại sau mỗi lần sửa lớn:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-perf.js [--offline] [--perf] [--quick] [--only=<chuỗi>]
   - Offline: cài service worker (sw.js) khi còn mạng, TẮT hẳn máy chủ, tải lại từng trang, mở game, chơi tới màn kết thúc, đổi ngôn ngữ; báo mọi request lỗi
     (trừ /api/*), lỗi JS, tài nguyên shared mới chưa vào cache (so sw.js với thư mục shared), trang/ảnh thiếu.
   - Hiệu năng: Chrome giả lập điện thoại 380x760, CPU chậm 4 lần; chơi giả lập vài giây rồi đo FPS (rAF), số tác vụ dài >50ms / >100ms, thời gian tải,
     số phần tử DOM, dung lượng tải, heap JS (sau GC) trước và sau 3 ván liên tiếp (rò rỉ).
   Ngưỡng ĐẠT (xem GAME_RULES.md mục "Offline & hiệu năng"): offline không lỗi; FPS >= 40 ở CPU x4 (>= 55 ở CPU thường); không tác vụ dài > 250ms khi chơi;
   tải xong < 2.5s ở CPU x4; DOM < 2500 phần tử; heap tăng < 6MB sau 3 ván. In bảng, thoát mã 1 nếu có mục không đạt.
   Cổng 8898 (offline phải tắt máy chủ thật nên dùng riêng một máy chủ). */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8898, B = "http://127.0.0.1:" + PORT;
const A = process.argv.slice(2), has = f => A.includes(f), only = (A.find(a => a.startsWith("--only=")) || "").slice(7);
const doOff = has("--offline") || !has("--perf"), doPerf = has("--perf") || !has("--offline"), quick = has("--quick");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const targets = [["cổng-cozy", "/cozyplay/index.html"], ["cổng-pop", "/popplay/index.html"]];
for (const g of fs.readdirSync(path.join(root, "cozyplay/games")).sort()) targets.push(["cozy/" + g, "/cozyplay/games/" + g + "/index.html"]);
for (const g of fs.readdirSync(path.join(root, "popplay/games")).sort()) targets.push(["pop/" + g, "/popplay/games/" + g + "/index.html"]);
const list = targets.filter(t => !only || t[0].includes(only));
const fails = [], rows = {};
const row = n => rows[n] || (rows[n] = { off: "-", fps: "-", fps1: "-", fpsEnd: "-", lt: "-", ltmax: "-", load: "-", dom: "-", kb: "-", heap: "-" });
const bad = (n, m) => { fails.push(n + ": " + m); };
const START = "(()=>{const e=document.getElementById('bDaily')||document.getElementById('bPractice')||document.getElementById('startBtn')||document.querySelector('.dbar,.band')||document.getElementById('bMake')||document.querySelector('#home .btn,.dbtn,.ty,.tile,.main,button.btn');e&&e.click();return !!e})()";
const FINISH = "(()=>{try{G.over=true;finish(G);return true}catch(e){return false}})()";
const PRE = () => { try { for (const k of ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "dr", "ve", "td"]) localStorage.setItem(k + "-tut", "1"); localStorage.setItem("np-sound", "0"); localStorage.setItem("lang", "vi"); localStorage.setItem("theme", "dark"); } catch (e) {} };

async function shellCheck() {
  /* sw.js phải liệt kê mọi trang game + mọi file shared css/js */
  const src = fs.readFileSync(path.join(root, "sw.js"), "utf8"), m = src.match(/const SHELL = (\[[\s\S]*?\]);/);
  let SH = []; try { SH = eval(m[1]); } catch (e) { bad("sw.js", "không đọc được SHELL"); return; }
  const need = [];
  for (const d of ["cozyplay/games", "popplay/games"]) for (const g of fs.readdirSync(path.join(root, d))) need.push("/" + d + "/" + g + "/index.html");
  for (const f of fs.readdirSync(path.join(root, "shared"))) if (/\.(css|js)$/.test(f)) need.push("/shared/" + f);
  for (const f of ["play/index.html", "cozyplay/index.html", "popplay/index.html", "help.html", "shared.html", "leaderboard.html", "subscribe.html", "privacy.html"]) need.push("/" + f);
  for (const d of ["cozyplay/games/cozy-wings/thumbs", "popplay/games/pop-fly/thumbs"]) for (const f of fs.readdirSync(path.join(root, d))) need.push("/" + d + "/" + f);
  const miss = need.filter(n => !SH.includes(n));
  if (miss.length) bad("sw.js", "thiếu trong SHELL (mất mạng sẽ lỗi): " + miss.slice(0, 6).join(", "));
  else console.log("✓ sw.js liệt kê đủ " + need.length + " tệp cần offline");
}

async function runOffline(br, srv) {
  const p0 = await br.newPage(); await p0.goto(B + "/cozyplay/index.html"); await p0.evaluate(() => navigator.serviceWorker.ready.then(() => 1));
  /* sw.js v24 cài nhẹ, phần còn lại tải nền sau load+3s: đợi tới khi cache đủ (tối đa 30s) */
  for (let i = 0; i < 60; i++) { await sleep(500); const n = await p0.evaluate(async () => { let n = 0; for (const k of await caches.keys()) n += (await (await caches.open(k)).keys()).length; return n; }); if (n >= 155) break; }
  const nk = await p0.evaluate(async () => { const ks = await caches.keys(); let n = 0; for (const k of ks) n += (await (await caches.open(k)).keys()).length; return n; });
  if (nk < 60) bad("sw.js", "service worker chỉ cache " + nk + " tệp");
  srv.kill(); await sleep(800);     /* máy chủ tắt hẳn = mất mạng thật (setOfflineMode không áp dụng cho service worker) */
  for (const [name, url] of list) {
    const pg = await br.newPage(); await pg.setViewport({ width: 380, height: 760 });
    const f = [], errs = [];
    pg.on("requestfailed", r => { const u = r.url().replace(B, ""); if (!/^\/api\//.test(u)) f.push(u + " " + ((r.failure() && r.failure().errorText) || "")); });
    pg.on("response", r => { const u = r.url().replace(B, ""); if (r.status() >= 400 && !/^\/api\//.test(u)) f.push(u + " HTTP " + r.status()); });
    pg.on("pageerror", e => errs.push(e.message.slice(0, 90)));
    await pg.evaluateOnNewDocument(PRE);
    try {
      await pg.goto(B + url + "?lang=vi", { waitUntil: "load", timeout: 20000 }); await sleep(900);
      await pg.evaluate(START); await sleep(1200);
      await pg.evaluate(FINISH); await sleep(1200);
      await pg.evaluate(() => { const e = document.getElementById("bLang") || document.getElementById("langBtn"); e && e.click(); }); await sleep(400);
    } catch (e) { errs.push("tải: " + e.message.slice(0, 70)); }
    const u = a => [...new Set(a)];
    const okk = !f.length && !errs.filter(e => !/reading 'length'/.test(e)).length;
    row(name).off = okk ? "✓" : "✗";
    if (!okk) bad(name, "offline: " + u(f).slice(0, 4).concat(u(errs).slice(0, 2)).join(" | "));
    await pg.close();
  }
}

async function runPerf(br) {
  { const w = await br.newPage(); try { await w.goto(B + "/shared/site.js", { timeout: 20000 }); } catch (e) {} await w.close(); }   /* khởi động nguội của Chrome (~4s ở lần tải đầu) không tính vào số đo */
  for (const [name, url] of list) {
    const r = row(name), pg = await br.newPage();
    await pg.setBypassServiceWorker(true);
    if (!has("--fonts")) { await pg.setRequestInterception(true); pg.on("request", q => { /(fonts\.googleapis|fonts\.gstatic)\.com/.test(q.url()) ? q.abort() : q.continue(); }); }   /* đo phần của MÌNH: không tính thời gian tải phông Google */
    await pg.setViewport({ width: 380, height: 760, isMobile: true, hasTouch: true });
    const cdp = await pg.createCDPSession(); await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await pg.evaluateOnNewDocument(PRE);
    await pg.evaluateOnNewDocument(() => { window.__lt = []; window.__fr = 0; try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__lt.push(e.duration))).observe({ type: "longtask", buffered: true }); } catch (e) {} (function lp() { window.__fr++; requestAnimationFrame(lp); })(); });
    let ok = true;
    try { await pg.goto(B + url + "?lang=vi", { waitUntil: "load", timeout: 30000 }); } catch (e) { ok = false; bad(name, "không tải được: " + e.message.slice(0, 60)); }
    if (!ok) { await pg.close(); continue; }
    await sleep(700);
    const nav = await pg.evaluate(() => { const n = performance.getEntriesByType("navigation")[0], rs = performance.getEntriesByType("resource"); return { load: Math.round(n.loadEventEnd), dom: document.getElementsByTagName("*").length, kb: Math.round((n.transferSize + rs.reduce((a, x) => a + (x.transferSize || 0), 0)) / 1024) }; });
    r.load = nav.load; r.dom = nav.dom; r.kb = nav.kb;
    const fpsOf = async (ms, act) => {
      await pg.evaluate(() => { window.__fr = 0; window.__lt = []; }); const t0 = Date.now(), end = t0 + ms;
      while (Date.now() < end) { if (act) await act(); await sleep(act ? 120 : 250); }
      const x = await pg.evaluate(() => ({ fr: window.__fr, lt: window.__lt.slice() })); return { fps: Math.round(x.fr / ((Date.now() - t0) / 1000)), lt: x.lt };
    };
    const idle = await fpsOf(quick ? 1500 : 2500); r.fps1 = idle.fps;
    await pg.evaluate(START); await sleep(900);
    const rnd = () => 40 + Math.random() * 300, rnd2 = () => 160 + Math.random() * 420;
    const play = await fpsOf(quick ? 3500 : 6000, async () => { try { await pg.mouse.move(rnd(), rnd2()); if (Math.random() < .4) { await pg.mouse.down(); await pg.mouse.move(rnd(), rnd2(), { steps: 4 }); await pg.mouse.up(); } } catch (e) {} });
    r.fps = play.fps; r.lt = play.lt.filter(d => d > 50).length; r.ltmax = Math.round(Math.max(0, ...play.lt));
    /* rò rỉ: heap sau GC trước/sau 3 ván */
    const heap = async () => { try { await cdp.send("HeapProfiler.collectGarbage"); const h = await cdp.send("Runtime.getHeapUsage"); return h.usedSize / 1048576; } catch (e) { return NaN; } };
    const h0 = await heap(); let canFin = false;
    for (let i = 0; i < 3; i++) {
      canFin = (await pg.evaluate(FINISH)) || canFin; await sleep(500);
      await pg.evaluate(() => { const e = document.getElementById("bAgain") || document.getElementById("bHome"); e && e.click(); }); await sleep(500);
      await pg.evaluate(START); await sleep(600);
    }
    /* màn kết thúc (hiệu ứng phát sáng vô hạn, blur...): FPS khi đứng ở màn kết thúc */
    if (canFin) { await pg.evaluate(FINISH); await sleep(900); const en = await fpsOf(1800); r.fpsEnd = en.fps; if (en.fps < 40) bad(name, "FPS thấp ở màn kết thúc (CPU x4): " + en.fps); }
    const h1 = await heap(); r.heap = !canFin ? "n/a" : isFinite(h1 - h0) ? (h1 - h0 >= 0 ? "+" : "") + (h1 - h0).toFixed(1) + "MB" : "?";
    if (play.fps < 40) bad(name, "FPS thấp khi chơi ở CPU x4: " + play.fps);
    if (r.ltmax > 250) bad(name, "tác vụ dài " + r.ltmax + "ms khi chơi");
    if (r.load > 2500) bad(name, "tải chậm " + r.load + "ms ở CPU x4");
    if (r.dom > 2500) bad(name, "quá nhiều phần tử DOM: " + r.dom);
    if (canFin && isFinite(h1 - h0) && h1 - h0 > 6) bad(name, "heap tăng " + (h1 - h0).toFixed(1) + "MB sau 3 ván (rò rỉ?)");
    await pg.close();
  }
}

(async () => {
  await shellCheck();
  let srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await sleep(1200);
  const br = await puppeteer.launch({ executablePath: CH, headless: "new", args: ["--mute-audio", "--enable-precise-memory-info"] });
  try {
    if (doPerf) { await runPerf(br); }
    if (doOff) { await runOffline(br, srv); }
  } finally { await br.close(); try { srv.kill(); } catch (e) {} }
  const pad = (s, n) => String(s).padEnd(n);
  console.log("\n" + pad("trang", 28) + pad("offline", 9) + pad("FPS chơi", 10) + pad("FPS rảnh", 10) + pad("FPS kết thúc", 14) + pad("tác vụ>50ms", 12) + pad("dài nhất", 10) + pad("tải ms", 8) + pad("DOM", 6) + pad("KB", 6) + "heap/3 ván");
  for (const [n] of list) { const r = row(n); console.log(pad(n, 28) + pad(r.off, 9) + pad(r.fps, 10) + pad(r.fps1, 10) + pad(r.fpsEnd, 14) + pad(r.lt, 12) + pad(r.ltmax, 10) + pad(r.load, 8) + pad(r.dom, 6) + pad(r.kb, 6) + r.heap); }
  console.log("\n" + (fails.length ? "✗ " + fails.length + " mục không đạt:\n  " + fails.join("\n  ") : "✓ offline + hiệu năng đạt"));
  process.exit(fails.length ? 1 : 0);
})();
