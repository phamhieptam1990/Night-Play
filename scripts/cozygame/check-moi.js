/* Kiểm tra trang tin ra mắt /moi/ (landing/moi/launches.json -> scripts/build-moi.js). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-moi.js [--quick] [--shots=<thư mục ảnh>]
   Tự build vào thư mục tạm (DIST_DIR, SITE_TARGET=hub) rồi serve bản đó: kiểm tra đúng thứ sẽ được triển khai.
   Tĩnh: mỗi mục có ảnh WebP <=45KB, og 1200x630 <=120KB; link game khớp shared/multi-games.js (đúng cổng); danh sách + trang riêng (mọi type=game / page:true) cả VI/EN;
         canonical, hreflang vi/en/x-default đối xứng, OG/Twitter, một <h1>, title<=60, description, JSON-LD parse (không rating/review), không nhúng ngoài, không cookie, sitemap có đủ URL + hreflang,
         huy hiệu "Mới" đúng quy tắc <=14 ngày, chip Night Pass khớp dữ liệu, landing có liên kết "Mới" ở menu + chân trang.
   Trình duyệt thật 320/390/768/1440 x sáng/tối x VI/EN: không tràn ngang, ảnh tải được (có width/height, lazy trừ ảnh đầu), nút/liên kết >=44px, chip đủ tương phản, không lỗi console/request lỗi/ngoài origin,
         không cookie, tải đầu <200KB, menu ☰ khi chật, công tắc VI/EN giữ vị trí cuộn.
   --quick: 390 + 1440 sáng/tối (VI danh sách, EN trang riêng) + 320 sáng. */
const { spawn, spawnSync } = require("child_process"), fs = require("fs"), os = require("os"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), fails = [];
const quick = process.argv.includes("--quick"), shotDir = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8);
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
const days = d => Math.round((Date.parse(today + "T00:00:00Z") - Date.parse(d + "T00:00:00Z")) / 864e5);
const O = "https://nightplay.vn";

(async () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "moi-dist-"));
  const bd = spawnSync(process.execPath, [path.join(root, "scripts", "build.js")], { cwd: root, env: Object.assign({}, process.env, { DIST_DIR: dist, SITE_TARGET: "hub" }), encoding: "utf8" });
  note(bd.status === 0, "build", "scripts/build.js lỗi: " + ((bd.stderr || "") + (bd.stdout || "")).slice(0, 300));
  const R = f => path.join(dist, f), rd = f => fs.existsSync(R(f)) ? fs.readFileSync(R(f), "utf8") : "";
  const L = JSON.parse(fs.readFileSync(path.join(root, "landing", "moi", "launches.json"), "utf8"));
  const ids = new Map(); for (const m of fs.readFileSync(path.join(root, "shared", "multi-games.js"), "utf8").matchAll(/^\s*"([a-z0-9-]+)":\s*\{\s*portal:\s*"(cozyplay|popplay)"/gm)) ids.set(m[1], m[2]);
  note(L.length >= 5 && L.length <= 8 + 4, "dữ liệu", "cần 5-12 mục, có " + L.length);
  note(!fs.existsSync(R("moi/launches.json")), "dist", "launches.json không được công khai");

  /* 1) dữ liệu + ảnh */
  for (const x of L) {
    const t = "mục " + x.id;
    note(ids.get(x.gameId) === (x.group === "pop" ? "popplay" : "cozyplay"), t, "gameId/cổng không khớp shared/multi-games.js");
    note(x.cta.href === "/" + (x.group === "pop" ? "popplay" : "cozyplay") + "/#" + x.gameId, t, "cta.href sai: " + x.cta.href);
    for (const l of ["vi", "en"]) { const n = x.body[l].split(/(?<=[.!?])\s+/).length; note(n >= 2 && n <= 4, t, "body." + l + " phải 2-4 câu, có " + n); note(!/\[CẦN/.test(JSON.stringify(x)), t, "còn placeholder"); }
    try { const b = fs.readFileSync(R(x.image)); note(b.length <= 45 * 1024 && b.slice(0, 4).toString() === "RIFF" && b.slice(8, 12).toString() === "WEBP", t, "ảnh phải WebP <=45KB (" + b.length + ")"); } catch (e) { note(false, t, "thiếu ảnh " + x.image); }
    try { const b = fs.readFileSync(R(x.og)); note(b.readUInt32BE(16) === 1200 && b.readUInt32BE(20) === 630 && b.length <= 120 * 1024, t, "og phải PNG 1200x630 <=120KB (" + b.length + ")"); } catch (e) { note(false, t, "thiếu og " + x.og); }
    const page = x.type === "game" || x.page === true;
    for (const l of ["vi", "en"]) note(fs.existsSync(R((l === "en" ? "en/" : "") + "moi/" + x.id + "/index.html")) === page, t, "trang riêng " + l + (page ? " thiếu" : " không được có"));
  }
  try { const b = fs.readFileSync(R("moi/img/og-moi.png")); note(b.readUInt32BE(16) === 1200 && b.readUInt32BE(20) === 630 && b.length <= 120 * 1024, "og-moi", "phải 1200x630 <=120KB"); } catch (e) { note(false, "og-moi", "thiếu"); }
  note(fs.existsSync(R("lp/moi.css")), "dist", "thiếu lp/moi.css");

  /* 2) HTML tĩnh */
  const pages = [];   // [file, lang, kind, launch]
  for (const l of ["vi", "en"]) { const b = (l === "en" ? "en/" : "") + "moi/"; pages.push([b + "index.html", l, "list", null]); for (const x of L.filter(y => y.type === "game" || y.page)) pages.push([b + x.id + "/index.html", l, "detail", x]); }
  const unesc = s => s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  for (const [f, l, kind, x] of pages) {
    const h = rd(f), tg = f, url = O + "/" + f.replace(/index\.html$/, ""), alt = l === "vi" ? "en" : "vi";
    if (!h) { note(false, tg, "không có file"); continue; }
    note(new RegExp('<html lang="' + l + '"').test(h), tg, "lang sai");
    note((h.match(/<h1[ >]/g) || []).length === 1, tg, "phải đúng một <h1>");
    const title = unesc((h.match(/<title>([^<]*)<\/title>/) || [])[1] || ""); note(title && [...title].length <= 60, tg, "title rỗng hoặc >60 (" + [...title].length + ")");
    const desc = unesc((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ""), dl = [...desc].length; note(kind === "list" ? dl >= 140 && dl <= 160 : dl >= 100 && dl <= 160, tg, "description " + dl + " ký tự");
    note(h.includes('<link rel="canonical" href="' + url + '">'), tg, "canonical sai (cần " + url + ")");
    const other = url.replace(l === "vi" ? O + "/" : O + "/en/", l === "vi" ? O + "/en/" : O + "/");
    const vi = l === "vi" ? url : other, en = l === "en" ? url : other;
    for (const s of ['hreflang="vi" href="' + vi + '"', 'hreflang="en" href="' + en + '"', 'hreflang="x-default" href="' + vi + '"', 'property="og:locale" content="' + (l === "vi" ? "vi_VN" : "en_US") + '"', 'property="og:locale:alternate"', 'name="twitter:card" content="summary_large_image"', 'name="twitter:image"', 'property="og:url" content="' + url + '"', 'property="og:image:width" content="1200"', 'name="theme-color"', 'rel="icon"', 'src="/shared/site.js"', 'data-set-lang="' + alt + '"']) note(h.includes(s), tg, "thiếu: " + s);
    const og = (h.match(/property="og:image" content="([^"]*)"/) || [])[1] || ""; note(og.startsWith(O + "/") && fs.existsSync(R(og.slice(O.length))), tg, "og:image không trỏ tới file có thật: " + og);
    if (kind === "detail") note(og === O + x.og, tg, "og:image phải là og riêng của mục (" + x.og + ")"); else note(/og-moi\.png$/.test(og), tg, "og trang danh sách");
    note(!/cookie\s*=/.test(h), tg, "ghi cookie"); note(!/track\.js/.test(h), tg, "không đo lượt xem /moi/ (không có điểm Track phù hợp)");
    const bad = [...h.matchAll(/<(?:script|link|img|iframe|source|video)\b[^>]*\b(?:src|href)="(https?:)?\/\/[^"]*"/g)].filter(m => !/rel="(canonical|alternate)"/.test(m[0])); note(!bad.length, tg, "nhúng ngoài: " + bad.map(m => m[0].slice(0, 80)).join("|"));
    /* JSON-LD */
    const lm = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]; note(lm.length === 1, tg, "cần đúng một JSON-LD");
    let ld = null; try { ld = JSON.parse(lm[0][1]); } catch (e) { note(false, tg, "JSON-LD không parse được"); }
    if (ld) { const g = ld["@graph"] || [], ty = t => g.filter(y => y["@type"] === t); note(g.every(y => !y.aggregateRating && !y.review && !(y.about && (y.about.aggregateRating || y.about.review))), tg, "JSON-LD có rating/review");
      note(ty("Organization").length === 1 && ty("WebSite").length === 1 && ty("BreadcrumbList").length === 1, tg, "JSON-LD thiếu Organization/WebSite/BreadcrumbList");
      if (kind === "list") { const c = ty("CollectionPage")[0]; note(c && c.mainEntity && c.mainEntity.itemListElement.length === L.length, tg, "ItemList phải đủ " + L.length + " mục"); }
      else { const a = ty("NewsArticle")[0]; note(a && a.headline === x.name[l] && a.datePublished === x.date && a.image[0] === O + x.og && a.mainEntityOfPage === url && a.inLanguage === l, tg, "NewsArticle sai headline/ngày/ảnh/url"); note(a && a.about && a.about["@type"] === "VideoGame" && a.about.url === O + x.cta.href && a.about.offers.price === "0", tg, "about VideoGame sai"); } }
    /* nội dung */
    const imgs = [...h.matchAll(/<img\b[^>]*>/g)].map(m => m[0]).filter(s => /\/moi\/img\//.test(s));
    note(imgs.length >= 1 && imgs.every(s => /width="\d+"/.test(s) && /height="\d+"/.test(s) && /alt="[^"]+"/.test(s)), tg, "ảnh thiếu width/height/alt");
    note(imgs[0] && !/loading="lazy"/.test(imgs[0]) && imgs.slice(1).every(s => /loading="lazy"/.test(s)), tg, "ảnh đầu không lazy, các ảnh sau phải lazy");
    const play = [...h.matchAll(/class="btn (?:big|sm)" href="(\/(?:popplay|cozyplay)\/#[a-z0-9-]+)"/g)].map(m => m[1]);
    for (const p of play) { const [, portal, gid] = p.match(/^\/(\w+)\/#(.+)$/); note(ids.get(gid) === portal, tg, "link chơi không hợp lệ: " + p); }
    const items = kind === "list" ? L : [x].concat(L.filter(y => y.id !== x.id).slice(0, 3));
    for (const y of items) { note(h.includes('href="' + y.cta.href + '"'), tg, "thiếu nút Chơi ngay " + y.cta.href); const blk = (h.match(new RegExp('<article class="m(?:feat|card)" id="' + y.id + '">[\\s\\S]*?</article>')) || [""])[0]; if (blk) { note(/class="chip np"/.test(blk) === !!y.nightPass, tg, y.id + ": chip Night Pass không khớp dữ liệu"); note(/class="chip new"/.test(blk) === (days(y.date) <= 14 && days(y.date) >= 0), tg, y.id + ": huy hiệu Mới sai (" + days(y.date) + " ngày)"); note(blk.includes('datetime="' + y.date + '"'), tg, y.id + ": thiếu ngày"); } else note(false, tg, "thiếu khối " + y.id); }
    if (kind === "detail") { note(h.includes('href="/' + (l === "en" ? "en/" : "") + 'moi/"'), tg, "thiếu liên kết Xem tất cả"); note(/<time datetime="/.test(h), tg, "thiếu ngày"); }
    else note(L.length === 1 || /class="mgrid"/.test(h), tg, "thiếu lưới thẻ cũ");
    if (!(["vi", "en"].every(q => rd((q === "en" ? "en/" : "") + f.replace(/^en\//, "")) !== ""))) note(false, tg, "thiếu bản ngôn ngữ kia");
  }
  /* 2b) sitemap + landing */
  const sm = rd("sitemap.xml");
  note(!/<!--MOI-->/.test(sm) && !/__BUILD_DATE__/.test(sm), "sitemap", "còn dấu <!--MOI--> hoặc __BUILD_DATE__");
  note((sm.match(/<url>/g) || []).length === (sm.match(/<\/url>/g) || []).length && (sm.match(/<urlset/g) || []).length === 1, "sitemap", "XML hỏng");
  for (const [f, l, kind, x] of pages) { const u = O + "/" + f.replace(/index\.html$/, ""), o = u.replace(l === "vi" ? O + "/" : O + "/en/", l === "vi" ? O + "/en/" : O + "/"); const e = (sm.match(new RegExp("<url>\\s*<loc>" + u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "</loc>[\\s\\S]*?</url>")) || [""])[0]; note(e && !/\.html/.test(u) && e.includes('hreflang="vi" href="' + (l === "vi" ? u : o) + '"') && e.includes('hreflang="en" href="' + (l === "en" ? u : o) + '"') && e.includes('hreflang="x-default"') && /<lastmod>\d{4}-\d\d-\d\d<\/lastmod>/.test(e), "sitemap", "thiếu/sai mục " + u); }
  { const v = rd("index.html"), e = rd("en/index.html");
    note(/<nav class="links"[^>]*>[^]*?href="\/moi\/">Mới<[^]*?<\/nav>/.test(v) && /<nav class="flinks"[^>]*>[^]*?href="\/moi\/">Mới<[^]*?<\/nav>/.test(v), "landing VI", "thiếu liên kết Mới ở menu hoặc chân trang");
    note(/<nav class="links"[^>]*>[^]*?href="\/en\/moi\/">New<[^]*?<\/nav>/.test(e) && /<nav class="flinks"[^>]*>[^]*?href="\/en\/moi\/">New<[^]*?<\/nav>/.test(e), "landing EN", "thiếu liên kết New ở menu hoặc chân trang"); }

  /* 3) trình duyệt */
  const PORT = await new Promise(r => { const t = require("net").createServer().listen(0, () => { const p = t.address().port; t.close(() => r(p)); }); }), B = "http://127.0.0.1:" + PORT;
  const srv = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: dist, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; };
  const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const rgb = s => { const m = /rgba?\(([^)]+)\)/.exec(s || ""); if (!m) return null; const p = m[1].split(",").map(parseFloat); return p.length > 3 && p[3] < .9 ? null : p.slice(0, 3); };
  const first = L.find(x => x.type === "game") || L[0];
  const SZ = quick ? [[390, 844], [1440, 900], [320, 568]] : [[320, 568], [390, 844], [768, 1024], [1440, 900]];
  try {
    /* liên kết nội bộ */
    const seen = new Set();
    for (const [f] of pages) { const hs = [...rd(f).matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(m => m[1]); for (const h of hs) { if (/^mailto:/.test(h) || h.startsWith("#")) continue; if (!h.startsWith("/")) { note(false, f, "liên kết không nội bộ: " + h); continue; } const u = h.split("#")[0]; if (seen.has(u)) continue; seen.add(u); const rs = await fetch(B + u); note(rs.status === 200, f, u + " → " + rs.status); } }
    let n = 0;
    for (const [W, H] of SZ) for (const theme of ["light", "dark"]) {
      if (quick && W === 320 && theme === "dark") continue;
      for (const l of ["vi", "en"]) for (const kind of ["list", "detail"]) {
        if (quick && !((l === "vi" && kind === "list") || (l === "en" && kind === "detail"))) continue;
        const f = (l === "en" ? "/en" : "") + "/moi/" + (kind === "detail" ? first.id + "/" : ""), tag = f + " " + W + "x" + H + " " + theme;
        const pg = await br.newPage(), errs = [], bad = [], sizes = []; n++;
        await pg.setViewport({ width: W, height: H, isMobile: W < 700, hasTouch: W < 700 });
        await pg.evaluateOnNewDocument(t => { try { localStorage.setItem("theme", t); } catch (e) {} }, theme);
        pg.on("pageerror", e => errs.push(e.message)); pg.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
        pg.on("requestfailed", r => bad.push("failed " + r.url())); pg.on("response", r => { if (r.status() >= 400) bad.push(r.status() + " " + r.url()); if (!r.url().startsWith(B)) bad.push("ngoài origin " + r.url()); const cl = +r.headers()["content-length"] || 0; sizes.push([r.url(), cl]); });
        await pg.goto(B + f, { waitUntil: "load" }); await wait(500);
        const w0 = sizes.reduce((a, s) => a + s[1], 0);
        if (kind === "list" && l === "vi" && theme === "light" && W === 390) note(w0 < 200 * 1024, tag, "tải đầu " + Math.round(w0 / 1024) + "KB >= 200KB");
        note(!errs.length, tag, "lỗi console: " + errs[0]); note(!bad.length, tag, "request lỗi: " + bad[0]);
        const m = await pg.evaluate(() => {
          const vis = e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && !e.closest("[hidden]"); };
          const small = [...document.querySelectorAll("a[href],button")].filter(vis).filter(e => !e.closest(".skip") && !e.classList.contains("skip")).map(e => ({ t: (e.innerText || e.getAttribute("aria-label") || e.getAttribute("href") || "").trim().slice(0, 30), w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height })).filter(s => s.h < 43.5 || s.w < 43.5);
          const chips = [...document.querySelectorAll(".chip,.btn")].filter(vis).map(e => { const cs = getComputedStyle(e); return { t: e.textContent.trim().slice(0, 20), fg: cs.color, bg: cs.backgroundColor }; });
          return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, small, chips, mbtn: !![...document.querySelectorAll(".top .mbtn")].find(vis), links: !![...document.querySelectorAll("#hlinks")].find(e => getComputedStyle(e).display !== "none"), lang: !![...document.querySelectorAll(".top .tools .lang")].find(vis), theme: !![...document.querySelector("#themeBtn") ? [document.querySelector("#themeBtn")] : []].find(vis) };
        });
        note(m.sw <= m.cw + 1, tag, "tràn ngang " + m.sw + ">" + m.cw);
        note(!m.small.length, tag, "nút/liên kết <44px: " + m.small.slice(0, 3).map(s => s.t + " " + Math.round(s.w) + "x" + Math.round(s.h)).join(" | "));
        for (const c of m.chips) { const fg = rgb(c.fg), bg = rgb(c.bg); if (fg && bg) note(cr(fg, bg) >= 4.5, tag, "tương phản «" + c.t + "» " + cr(fg, bg).toFixed(2)); }
        if (W < 1000) note(m.mbtn || (W < 340 && !m.links), tag, "dưới 1000px phải có nút menu ☰"); else note(m.links && !m.mbtn, tag, "từ 1000px menu phải hiện thẳng");
        if (W >= 340) note(m.lang && m.theme, tag, "thiếu công tắc ngôn ngữ/giao diện trên thanh"); else await pg.evaluate(() => 0);
        /* cuộn hết trang để ảnh lazy tải, rồi đo ảnh */
        await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 140)); } scrollTo(0, 0); for (let k = 0; k < 40 && [...document.images].some(i => !i.complete); k++) await new Promise(r => setTimeout(r, 100)); }); await wait(300);
        const im = await pg.evaluate(() => [...document.querySelectorAll("img")].map(i => ({ s: i.getAttribute("src"), ok: i.complete && i.naturalWidth > 0, w: i.getAttribute("width"), nw: i.naturalWidth })));
        note(im.length >= 2 && im.every(i => i.ok), tag, "ảnh không tải được: " + im.filter(i => !i.ok).map(i => i.s).join(","));
        note(await pg.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), tag, "tràn ngang sau khi tải ảnh");
        note((await pg.cookies()).length === 0, tag, "có cookie");
        note(await pg.evaluate(() => Object.keys(localStorage).every(k => k === "theme" || k === "lang")), tag, "localStorage ngoài theme/lang");
        if (shotDir) { fs.mkdirSync(shotDir, { recursive: true }); const nm = [l, kind, W + "x" + H, theme].join("-"); await pg.screenshot({ path: path.join(shotDir, nm + ".png"), fullPage: true }); }
        await pg.close();
      }
    }
    /* menu ☰ mở/đóng bằng bàn phím + công tắc ngôn ngữ giữ vị trí cuộn */
    { const pg = await br.newPage(); await pg.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true }); await pg.goto(B + "/moi/", { waitUntil: "load" }); await wait(300);
      await pg.click(".top .mbtn"); note(await pg.evaluate(() => document.getElementById("hlinks").classList.contains("open") && !!document.querySelector('#hlinks a[href="/moi/"][aria-current=page]')), "menu", "bấm ☰ phải mở menu có mục Mới");
      await pg.keyboard.press("Escape"); note(await pg.evaluate(() => !document.getElementById("hlinks").classList.contains("open")), "menu", "Esc phải đóng menu");
      await pg.evaluate(() => { const e = document.getElementById("hOlder"); scrollTo(0, e.getBoundingClientRect().top + scrollY - 120); }); await wait(300);
      await Promise.all([pg.waitForNavigation({ waitUntil: "load" }), pg.click(".top .tools .lang")]); await wait(600);
      note(await pg.evaluate(() => location.pathname === "/en/moi/"), "VI/EN", "công tắc không sang /en/moi/");
      const top = await pg.evaluate(() => { const r = document.getElementById("hOlder").getBoundingClientRect(); return r.top; }); note(top > -40 && top < 400, "VI/EN", "không giữ vị trí cuộn (h2 'Earlier launches' ở top=" + Math.round(top) + ")");
      await pg.close(); }
    /* trang riêng: Chơi ngay → game thật; Xem tất cả → danh sách */
    { const pg = await br.newPage(); await pg.setViewport({ width: 1440, height: 900 }); await pg.goto(B + "/moi/" + first.id + "/", { waitUntil: "load" });
      await pg.click(".mfeat .btn.big"); await pg.waitForFunction(() => /^\/(popplay|cozyplay)\//.test(location.pathname), { timeout: 8000 }).catch(() => {}); note(await pg.evaluate((g) => location.pathname.startsWith("/cozyplay/") || location.pathname.startsWith("/popplay/"), first.gameId), "CTA", "Chơi ngay không tới cổng game (" + (await pg.evaluate(() => location.href)) + ")"); await pg.close(); }
  } finally { await br.close(); srv.kill(); }
  console.log(fails.length ? "\n✗ " + fails.length + " lỗi /moi/" : "\n✓ /moi/ đạt (" + pages.length + " trang tĩnh)");
  process.exit(fails.length ? 1 : 0);
})();
