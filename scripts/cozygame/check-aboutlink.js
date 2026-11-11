/* Liên kết "Giới thiệu / About" từ app về landing (/ VI, /en/ EN) kèm ?landing=1 để PWA standalone không bị chuyển lại về /play/. Chạy:
     NODE_PATH=<thư mục puppeteer-core> node scripts/cozygame/check-aboutlink.js
   Kiểm tra: hub/Cozy/Pop có liên kết đúng ngôn ngữ; bấm vào mở landing (thường và giả lập standalone); / không kèm tham số vẫn chuyển về /play/ ở standalone;
   canonical/sitemap không có ?landing=1; không game nào (cozyplay/games, popplay/games, shared/fan|popmenu|dock) chứa liên kết này. */
const { spawn, spawnSync } = require("child_process"), fs = require("fs"), os = require("os"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), fails = [];
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  /* tĩnh: game không có liên kết */
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  let bad = [];
  for (const d of ["cozyplay/games", "popplay/games"]) for (const f of walk(path.join(root, d))) if (/\.(html|js)$/.test(f) && /landing=1/.test(fs.readFileSync(f, "utf8"))) bad.push(f);
  for (const f of ["shared/fan.js", "shared/popmenu.js", "shared/dock.js", "shared/bridge.js"]) if (fs.existsSync(path.join(root, f)) && /landing=1/.test(fs.readFileSync(path.join(root, f), "utf8"))) bad.push(f);
  note(!bad.length, "game", "màn đang chơi không được có liên kết giới thiệu: " + bad.join(", "));
  for (const f of ["landing/index.html", "landing/en/index.html"]) { const s = fs.readFileSync(path.join(root, f), "utf8"); note(/landing=1/.test(s), "landing", f + " thiếu bỏ qua chuyển hướng ?landing=1"); note(!/rel="canonical" href="[^"]*landing=1/.test(s), "landing", f + " canonical có ?landing=1"); }
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "about-dist-"));
  const bd = spawnSync(process.execPath, [path.join(root, "scripts", "build.js")], { cwd: root, env: Object.assign({}, process.env, { DIST_DIR: dist, SITE_TARGET: "hub" }), encoding: "utf8" });
  note(bd.status === 0, "build", "scripts/build.js lỗi");
  note(!/landing=1/.test(fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8")), "sitemap", "sitemap có ?landing=1");
  const PORT = await new Promise(r => { const t = require("net").createServer().listen(0, () => { const p = t.address().port; t.close(() => r(p)); }); }), B = "http://127.0.0.1:" + PORT;
  const srv = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: dist, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const standaloneJs = () => { const mm = window.matchMedia.bind(window); window.matchMedia = q => /display-mode/.test(q) ? { matches: true, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} } : mm(q); };
  async function open(url, lang, standalone, w, h) {
    const pg = await br.newPage(); await pg.setViewport({ width: w || 1440, height: h || 900 });
    await pg.evaluateOnNewDocument(l => { try { localStorage.setItem("lang", l); } catch (e) {} }, lang);
    if (standalone) await pg.evaluateOnNewDocument(standaloneJs);
    await pg.goto(B + url, { waitUntil: "load" }); await wait(500); return pg;
  }
  const PAGES = [["hub", "/play/index.html", ["#aboutLink", "#about"]], ["cozy", "/cozyplay/index.html", ["#fAbout", "#about"]], ["pop", "/popplay/index.html", ["#fAbout", "#about"]]];
  for (const lang of ["vi", "en"]) {
    const want = (lang === "en" ? "/en/" : "/") + "?landing=1";
    for (const [name, url, sels] of PAGES) for (const w of [[390, 844], [1440, 900]]) {
      const pg = await open(url, lang, false, w[0], w[1]);
      for (const s of sels) { const h = await pg.$eval(s, e => e.getAttribute("href")).catch(() => null); note(h === want, name + "/" + lang, s + " href=" + h + " (cần " + want + ")"); }
      await pg.close();
    }
    for (const standalone of [false, true]) {
      const pg = await open("/play/index.html", lang, standalone);
      await Promise.all([pg.waitForNavigation({ waitUntil: "load" }), pg.click("#aboutLink")]); await wait(600);
      const u = new URL(pg.url()); const okPath = u.pathname === (lang === "en" ? "/en/" : "/");
      const h1 = await pg.$eval("h1", e => e.textContent).catch(() => "");
      note(okPath && /landing=1/.test(u.search) && h1.length > 3, "click/" + lang + (standalone ? "/standalone" : ""), "bấm liên kết ra " + pg.url());
      const can = await pg.$eval('link[rel=canonical]', e => e.href).catch(() => "");
      note(!/landing=1/.test(can), "canonical/" + lang, can);
      await pg.close();
    }
  }
  /* đối chứng: standalone mở "/" trơn vẫn về hub */
  const pg = await open("/", "vi", true); note(new URL(pg.url()).pathname === "/play/", "standalone", "/ trơn phải chuyển về /play/, đang ở " + pg.url()); await pg.close();
  await br.close(); srv.kill(); fs.rmSync(dist, { recursive: true, force: true });
  console.log(fails.length ? "✗ " + fails.length + " lỗi" : "✓ liên kết Giới thiệu đạt"); process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
