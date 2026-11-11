/* Bài đo MỘT PHÔNG DUY NHẤT (Inter, tự host). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-font.js [--quick] [--shots=<thư mục ảnh>]
   (a) Quét tĩnh mọi HTML/CSS/JS công khai: không còn fonts.googleapis.com, fonts.gstatic.com, Bungee, Baloo, Be Vietnam, Georgia, serif (trừ sans-serif).
   (b) Chrome thật trên bản dựng dist (build.js vào thư mục tạm), chặn mạng ngoài: mỗi trang (landing VI/EN, /play/, hai cổng, subscribe, terms, privacy, /moi/,
       6 game Cozy gồm sinh tự động + viết tay, 4 game Pop) phải có computed font-family của body, h1/h2, nút, thẻ tên game bắt đầu bằng Inter,
       document.fonts có "Inter" trạng thái loaded, KHÔNG có request nào tới domain ngoài, đồng thời không cuộn dọc/ngang ở 390x844 và 1440x900 (sáng/tối).
   --quick: 390x844 sáng + 1440x900 tối, mọi trang. */
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os"), cp = require("child_process"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", "..");
const quick = process.argv.includes("--quick");
const shotDir = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8);
const fails = [];
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- (a) quét tĩnh ---------- */
const BAN = [[/fonts\.googleapis\.com/i, "fonts.googleapis.com"], [/fonts\.gstatic\.com/i, "fonts.gstatic.com"], [/Bungee/, "Bungee"], [/Baloo/, "Baloo"], [/Be Vietnam/i, "Be Vietnam"], [/Georgia/, "Georgia"], [/(^|[^-a-zA-Z])serif\b/i, "serif"]];
const SKIP_DIR = new Set(["vendor", "fonts", "node_modules", "orbit-icons", "img", "thumbs"]);
function walk(d, out) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.name.startsWith(".")) continue; const p = path.join(d, e.name); if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(p, out); } else if (/\.(html|css|js)$/.test(e.name)) out.push(p); } return out; }
const staticFiles = [];
for (const d of ["landing", "play", "cozyplay", "popplay", "shared", "legal", "admin"]) if (fs.existsSync(path.join(root, d))) walk(path.join(root, d), staticFiles);
for (const f of fs.readdirSync(root)) if (/\.html$/.test(f)) staticFiles.push(path.join(root, f));
staticFiles.push(path.join(root, "sw.js"));
let scanned = 0;
for (const f of staticFiles) {
  if (/sw\.js$/.test(f)) continue;   // sw.js còn danh sách host phông cũ để bỏ qua; không tải phông ngoài
  const s = fs.readFileSync(f, "utf8"); scanned++;
  for (const [re, name] of BAN) { const m = s.match(re); if (m) { const i = m.index, ln = s.slice(0, i).split("\n").length; note(false, "quét " + path.relative(root, f) + ":" + ln, "còn '" + name + "' → " + s.slice(Math.max(0, i - 30), i + 40).replace(/\s+/g, " ")); } }
}
console.log("(a) đã quét " + scanned + " file HTML/CSS/JS công khai");
/* shared/fonts.css phải có @font-face Inter + file woff2 ≤ 100KB + giấy phép */
{ const css = fs.readFileSync(path.join(root, "shared", "fonts.css"), "utf8"); note(/font-family:\s*"Inter"/.test(css) && /font-display:\s*swap/.test(css) && /unicode-range/.test(css), "fonts.css", "thiếu @font-face Inter / swap / unicode-range");
  const wf = path.join(root, "shared", "fonts", "inter-var-latin-vi.woff2"); note(fs.existsSync(wf) && fs.statSync(wf).size <= 100 * 1024, "woff2", "thiếu hoặc > 100KB"); note(fs.existsSync(path.join(root, "shared", "fonts", "LICENSE-OFL.txt")), "giấy phép", "thiếu shared/fonts/LICENSE-OFL.txt"); }

/* ---------- (b) Chrome thật ---------- */
const PAGES = [
  ["landing VI", "/"], ["landing EN", "/en/"], ["play", "/play/"], ["cổng Cozy", "/cozyplay/"], ["cổng Pop", "/popplay/"], ["subscribe", "/subscribe.html"], ["terms", "/terms.html"], ["privacy", "/privacy.html"], ["moi", "/moi/"],
  ["Cozy: Đập Deadline (tay)", "/cozyplay/games/dap-deadline/"], ["Cozy: Cánh Nhỏ (tay)", "/cozyplay/games/cozy-wings/"], ["Cozy: Đường Ray", "/cozyplay/games/duong-ray/"], ["Cozy: Xây Cầu Tre", "/cozyplay/games/xay-cau-tre/"], ["Cozy: Nối Một Nét", "/cozyplay/games/noi-mot-net/"], ["Cozy: Shipper Siêu Tốc", "/cozyplay/games/shipper-sieu-toc/"],
  ["Pop: Pop Fly", "/popplay/games/pop-fly/"], ["Pop: Qua Sông", "/popplay/games/qua-song/"], ["Pop: Vẽ Chữ Quái Vật", "/popplay/games/ve-chu-quai-vat/"], ["Pop: Làng của Bé", "/popplay/games/lang-cua-be/"]
];
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".webp": "image/webp", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".xml": "application/xml", ".txt": "text/plain" };
const NAME_SEL = ".mcard h3,.pcard h3,.gcard .nm,.card .nm,.gname,.card h3,.gc h3,.g-name,.top h1,.hero h1,h3";
(async () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "font-dist-"));
  const b = cp.spawnSync(process.execPath, [path.join(root, "scripts", "build.js")], { cwd: root, env: Object.assign({}, process.env, { DIST_DIR: dist }), encoding: "utf8" });
  note(b.status === 0, "build", "scripts/build.js lỗi: " + (b.stderr || "").slice(0, 200));
  const hdrs = fs.existsSync(path.join(dist, "_headers")) ? fs.readFileSync(path.join(dist, "_headers"), "utf8") : "";
  note(/\/shared\/fonts\/\*\s+Cache-Control: public, max-age=31536000, immutable/.test(hdrs), "_headers", "thiếu quy tắc cache immutable cho /shared/fonts/*");
  const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8"); note(/shared\/fonts\.css/.test(sw) && /inter-var-latin-vi\.woff2/.test(sw), "sw.js", "SHELL thiếu fonts.css / woff2");
  const srv = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
    let f = path.join(dist, p); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
    if (!f.startsWith(dist) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f));
  });
  await new Promise(r => srv.listen(0, r)); const PORT = srv.address().port;
  const br = await puppeteer.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const combos = quick ? [[390, 844, "light"], [1440, 900, "dark"]] : [[390, 844, "light"], [390, 844, "dark"], [1440, 900, "light"], [1440, 900, "dark"]];
  let bytes = 0, reqs = 0, n = 0;
  for (const [name, url] of PAGES) for (const [w, h, theme] of combos) {
    const pg = await br.newPage(); await pg.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await pg.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }]);
    await pg.evaluateOnNewDocument(() => { for (const k of ["language", "languages"]) Object.defineProperty(navigator, k, { get: () => k === "language" ? "vi-VN" : ["vi-VN", "vi"] }); });
    await pg.evaluateOnNewDocument(t => { try { localStorage.setItem("theme", t); localStorage.setItem("welcomed", "1"); } catch (e) {} }, theme);
    const ext = []; await pg.setRequestInterception(true);
    pg.on("request", q => { const u = q.url(); if (u.startsWith("data:") || u.startsWith("blob:") || u.startsWith("http://127.0.0.1:" + PORT) || u.startsWith("http://localhost:" + PORT)) return q.continue(); ext.push(u); q.abort(); });
    pg.on("response", async r => { try { reqs++; bytes += (await r.buffer()).length; } catch (e) {} });
    const tag = name + " @" + w + "x" + h + " " + theme;
    try {
      await pg.goto("http://127.0.0.1:" + PORT + url, { waitUntil: "load", timeout: 20000 }); await wait(700);
      const r = await pg.evaluate((NAME_SEL) => {
        const fam = el => el ? getComputedStyle(el).fontFamily : null;
        const vis = el => { const b = el.getBoundingClientRect(), cs = getComputedStyle(el); return b.width > 0 && b.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
        const first = sel => [...document.querySelectorAll(sel)].find(vis) || document.querySelector(sel);
        const faces = [...document.fonts].filter(f => f.family.replace(/"/g, "") === "Inter").map(f => f.status);
        const de = document.documentElement, sb = document.scrollingElement;
        return { body: fam(document.body), h: fam(first("h1,h2")), btn: fam(first("button,a.btn,.btn,a[class*=btn]")), card: fam(first(NAME_SEL)), faces,
          overflowY: sb.scrollHeight - sb.clientHeight, overflowX: sb.scrollWidth - sb.clientWidth, loaded: document.fonts.check("800 16px Inter") };
      }, NAME_SEL);
      const isInter = f => f == null || /^["']?Inter["']?\s*,/.test(f);
      note(isInter(r.body), tag, "body font-family = " + r.body); note(isInter(r.h), tag, "h1/h2 font-family = " + r.h); note(isInter(r.btn), tag, "nút font-family = " + r.btn); note(isInter(r.card), tag, "thẻ tên font-family = " + r.card);
      note(r.faces.length > 0 && r.faces.every(s => s === "loaded"), tag, "document.fonts Inter = " + JSON.stringify(r.faces));
      note(ext.length === 0, tag, "request ra ngoài: " + ext.slice(0, 3).join(", "));
      const doc = /^(landing|moi|terms|privacy)/.test(name);   // trang tài liệu được cuộn dọc
      note(r.overflowX <= 1 && (doc || r.overflowY <= 1), tag, "cuộn trang dọc " + r.overflowY + "px / ngang " + r.overflowX + "px");
      if (shotDir) { fs.mkdirSync(shotDir, { recursive: true }); await pg.screenshot({ path: path.join(shotDir, name.replace(/[^a-z0-9]+/gi, "_") + "_" + w + "_" + theme + ".png") }); }
    } catch (e) { note(false, tag, "lỗi: " + e.message); }
    n++; await pg.close();
  }
  await br.close(); srv.close(); fs.rmSync(dist, { recursive: true, force: true });
  console.log("(b) " + n + " lượt mở trang, " + reqs + " request, ~" + Math.round(bytes / 1024) + "KB (content-length), request ra ngoài: " + fails.filter(f => /request ra ngoài/.test(f)).length);
  console.log("\n" + (fails.length ? "✗ check-font: " + fails.length + " lỗi" : "✓ phông Inter duy nhất đạt"));
  process.exit(fails.length ? 1 : 0);
})();
