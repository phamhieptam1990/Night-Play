/* Chụp ảnh màn hình THẬT cho landing (mockup điện thoại ở hero + mục phụ huynh) -> landing/lp/img/shots/*.webp (mỗi ảnh <= 45KB).
   Chạy lại: NODE_PATH=<thư mục puppeteer-core> node scripts/cozygame/shots-landing.js */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), out = path.join(root, "landing", "lp", "img", "shots"), wait = ms => new Promise(r => setTimeout(r, ms));
const MAX = 45 * 1024;
const today = () => new Date().toLocaleDateString("sv");
const SHOTS = [
  { f: "hero-cafe", url: "cozyplay/games/xe-ca-phe/index.html" },
  { f: "hero-nghi", url: "cozyplay/games/xin-nghi/index.html" },
  { f: "hero-wings", url: "cozyplay/games/cozy-wings/index.html" },
  { f: "parent-settings", url: "popplay/index.html", ls: { prefs: JSON.stringify({ limit: 30, off: ["be-noi-dung-khong"] }), usage: JSON.stringify({ d: today(), s: 600 }) }, js: "renderPrefs();document.getElementById('gate').classList.add('on')" },
  { f: "parent-timeup", url: "popplay/index.html", ls: { prefs: JSON.stringify({ limit: 15, off: [] }), usage: JSON.stringify({ d: today(), s: 900 }) } },
];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const PORT = await new Promise(r => { const t = require("net").createServer().listen(0, () => { const p = t.address().port; t.close(() => r(p)); }); });
  const srv = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  for (const s of SHOTS) {
    const pg = await br.newPage(); await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 1.5 });
    await pg.evaluateOnNewDocument(o => { try { localStorage.setItem("theme", "dark"); localStorage.setItem("lang", "vi"); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("pophelp-seen:x", "1"); for (const k in o) localStorage.setItem(k, o[k]); } catch (e) {} }, s.ls || {});
    await pg.goto("http://127.0.0.1:" + PORT + "/" + s.url, { waitUntil: "load" }); await wait(1600);
    if (s.js) { await pg.evaluate(s.js); await wait(500); }
    let q = 70, buf;
    do { buf = await pg.screenshot({ type: "webp", quality: q }); q -= 6; } while (buf.length > MAX && q > 20);
    fs.writeFileSync(path.join(out, s.f + ".webp"), buf); console.log(s.f, buf.length + " bytes (q" + (q + 6) + ")"); await pg.close();
  }
  await br.close(); srv.kill();
})();
