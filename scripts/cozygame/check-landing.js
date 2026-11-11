/* Kiểm tra trang landing giới thiệu (landing/ = gốc "/" và "/en/", hub ở /play/; docs/LANDING-PAGE-BRIEF.md). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-landing.js [--quick] [--shots=<thư mục ảnh>]
   Tự chạy build (DIST_DIR tạm, SITE_TARGET=hub) rồi serve bản dist đó qua http.server cổng trống tự chọn: kiểm tra đúng thứ sẽ được triển khai.
   Điều kiện:
     - dist có / (landing VI), /en/, /lp/landing.css+js, /lp/img/og.png (1200x630), /play/ (hub), _redirects + trang dự phòng /gioi-thieu/ → / và /en/, sitemap.xml (đủ URL, hết __BUILD_DATE__), robots.txt; /shared/theme.css với tới được;
     - HTML: không còn "[CẦN", không nhúng tên miền ngoài, một <h1>, lang đúng, canonical/hreflang/OG/Twitter đủ, title <= 60 ký tự, description 140-160;
     - JSON-LD parse được, đủ Organization/WebSite/VideoGame x2/FAQPage, FAQ khớp chữ hiển thị; giá khớp server/app.js PLANS;
     - mọi liên kết nội bộ trả 200, #id của game có trong shared/multi-games.js, neo #id tồn tại; mailto đúng;
     - mỗi cỡ (320/360/390/768/1024/1440) x sáng/tối x VI/EN: không tràn ngang, không lỗi console / request lỗi, không cookie, localStorage chỉ theme/lang, không request ngoài origin, nút/liên kết >= 44px, tương phản chữ >= AA;
     - hero vừa một màn hình ở 360x640 (CTA chính, huy hiệu nằm trong màn hình); FAQ mở bằng bàn phím; tổng trọng lượng tải trang đầu < 300 KB.
   --quick: 360/390/1440 sáng+tối bản VI, 390 sáng bản EN. */
const { spawn, spawnSync } = require("child_process"), fs = require("fs"), os = require("os"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), fails = [];
let PORT = 0, B = "";   // cổng trống do hệ điều hành chọn (tránh đụng http.server của bài đo khác)
const quick = process.argv.includes("--quick");
const shotDir = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8);
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const PAGES = { vi: "/", en: "/en/" };
const SIZES = quick ? [[360, 640], [390, 844], [1440, 900]] : [[320, 568], [360, 640], [390, 844], [768, 1024], [1024, 768], [1440, 900]];

(async () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "landing-dist-"));
  const bd = spawnSync(process.execPath, [path.join(root, "scripts", "build.js")], { cwd: root, env: Object.assign({}, process.env, { DIST_DIR: dist, SITE_TARGET: "hub" }), encoding: "utf8" });
  note(bd.status === 0, "build", "scripts/build.js lỗi: " + (bd.stderr || "").slice(0, 200));
  const R = f => path.join(dist, f);
  /* 1) file trong dist */
  for (const f of ["index.html", "en/index.html", "lp/landing.css", "lp/landing.js", "shared/orbit.js", "shared/orbit.css", "lp/img/og.png", "lp/img/logo.svg", "sitemap.xml", "robots.txt", "shared/theme.css", "shared/track.js", "shared/site.js", "play/index.html", "sw.js", "manifest.webmanifest", "_redirects", "gioi-thieu/index.html", "gioi-thieu/en/index.html"])
    note(fs.existsSync(R(f)), "dist", "thiếu " + f);
  try { const b = fs.readFileSync(R("lp/img/og.png")); note(b.readUInt32BE(16) === 1200 && b.readUInt32BE(20) === 630, "og.png", "phải 1200x630"); note(b.length <= 120 * 1024, "og.png", "nặng " + b.length + " > 120KB"); } catch (e) {}
  const sm = fs.existsSync(R("sitemap.xml")) ? fs.readFileSync(R("sitemap.xml"), "utf8") : "";
  note(!/__BUILD_DATE__/.test(sm) && /<lastmod>\d{4}-\d\d-\d\d<\/lastmod>/.test(sm), "sitemap", "chưa thay ngày build");
  for (const u of ["/", "/en/", "/play/", "/popplay/", "/cozyplay/", "/subscribe", "/privacy", "/terms"]) note(sm.includes("<loc>https://nightplay.vn" + u + "</loc>"), "sitemap", "thiếu " + u);
  note((sm.match(/<urlset/g) || []).length === 1 && (sm.match(/<url>/g) || []).length === (sm.match(/<\/url>/g) || []).length, "sitemap", "XML hỏng");
  const rb = fs.existsSync(R("robots.txt")) ? fs.readFileSync(R("robots.txt"), "utf8") : "";
  for (const l of ["User-agent: *", "Allow: /", "Disallow: /admin/", "Disallow: /api/", "Sitemap: https://nightplay.vn/sitemap.xml"]) note(rb.includes(l), "robots", "thiếu dòng: " + l);

  /* 1b) cấu trúc "/ = landing, /play/ = hub": chuyển hướng địa chỉ cũ, manifest, sw.js */
  const rd = fs.existsSync(R("_redirects")) ? fs.readFileSync(R("_redirects"), "utf8") : "";
  for (const l of ["/gioi-thieu/  /  301", "/gioi-thieu  /  301", "/gioi-thieu/en/  /en/  301", "/gioi-thieu/en  /en/  301"]) note(rd.includes(l), "_redirects", "thiếu dòng: " + l);
  for (const [f, to] of [["gioi-thieu/index.html", "/"], ["gioi-thieu/en/index.html", "/en/"]]) { const h = fs.existsSync(R(f)) ? fs.readFileSync(R(f), "utf8") : ""; note(h.includes('http-equiv="refresh" content="0;url=' + to + '"') && h.includes('<link rel="canonical" href="https://nightplay.vn' + to + '">'), "dự phòng " + f, "thiếu meta refresh/canonical về " + to); }
  try { const mf = JSON.parse(fs.readFileSync(R("manifest.webmanifest"), "utf8")); note(mf.start_url === "/play/" && mf.scope === "/" && mf.id === "/" && mf.display === "standalone", "manifest", "start_url/scope/id/display sai: " + [mf.start_url, mf.scope, mf.id, mf.display]); for (const i of mf.icons) note(fs.existsSync(R(i.src.replace(/^\//, ""))), "manifest", "thiếu icon " + i.src); } catch (e) { note(false, "manifest", "không đọc được: " + e.message); }
  { const swt = fs.existsSync(R("sw.js")) ? fs.readFileSync(R("sw.js"), "utf8") : ""; const sh = (swt.match(/const SHELL = (\[[\s\S]*?\]);/) || [])[1]; let SH = []; try { SH = eval(sh); } catch (e) {}
    note(SH.includes("/play/index.html") && !SH.includes("/") && !SH.includes("/index.html"), "sw.js", "SHELL phải có /play/index.html và KHÔNG có / hoặc /index.html (landing không offline)");
    note(/new URL\("\/play\/index\.html"/.test(swt), "sw.js", "điều hướng offline phải rơi về /play/index.html");
    for (const u of SH) note(fs.existsSync(R(u.replace(/^\//, ""))), "sw.js", "SHELL liệt kê file không có trong dist: " + u); }
  { const hub = fs.existsSync(R("play/index.html")) ? fs.readFileSync(R("play/index.html"), "utf8") : ""; note(/href="\.\.\/popplay\/index\.html"/.test(hub) && /href="\.\.\/cozyplay\/index\.html"/.test(hub) && !/(src|href)="shared\//.test(hub), "hub /play/", "đường dẫn tương đối của hub sai (cần ../popplay, ../cozyplay, ../shared)"); }

  /* 2) nội dung HTML tĩnh */
  const src = {}; let plans = {};
  try { const a = fs.readFileSync(path.join(root, "server", "app.js"), "utf8"); for (const m of a.matchAll(/(day|week|month|year):\s*\{\s*amount:\s*(\d+),\s*days:\s*(\d+)/g)) plans[m[1]] = { amount: +m[2], days: +m[3] }; } catch (e) {}
  note(Object.keys(plans).length === 4, "giá", "không đọc được PLANS từ server/app.js");
  const gameIds = new Set(); try { for (const m of fs.readFileSync(path.join(root, "shared", "multi-games.js"), "utf8").matchAll(/^\s*"([a-z0-9-]+)":\s*\{\s*portal:/gm)) gameIds.add(m[1]); } catch (e) {}
  note(gameIds.size >= 32, "game", "đọc multi-games.js chỉ được " + gameIds.size + " game");
  const fmtVi = n => n.toLocaleString("de-DE") + "đ", fmtEn = n => n.toLocaleString("en-US") + " VND";
  for (const l of ["vi", "en"]) {
    const f = path.join(l === "en" ? "en" : "", "index.html"), h = fs.existsSync(R(f)) ? fs.readFileSync(R(f), "utf8") : ""; src[l] = h;
    const tg = "html " + l;
    note(!/\[CẦN/.test(h), tg, "còn placeholder [CẦN ...] trong HTML");
    note(!/phamhieptam/.test(h), tg, "còn email cũ");
    note((h.match(/<h1[ >]/g) || []).length === 1, tg, "phải đúng một <h1>");
    note(new RegExp('<html lang="' + l + '"').test(h), tg, "lang sai");
    const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || ""; note(title && [...title].length <= 60, tg, "title rỗng hoặc > 60 ký tự (" + [...title].length + ")");
    const desc = ((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "").replace(/&amp;/g, "&"); note([...desc].length >= 140 && [...desc].length <= 160, tg, "description " + [...desc].length + " ký tự (cần 140-160)");
    const canon = l === "vi" ? "https://nightplay.vn/" : "https://nightplay.vn/en/";
    note(h.includes('<link rel="canonical" href="' + canon + '">'), tg, "canonical sai");
    for (const x of ['hreflang="vi" href="https://nightplay.vn/"', 'hreflang="en" href="https://nightplay.vn/en/"', 'hreflang="x-default" href="https://nightplay.vn/"', 'property="og:image" content="https://nightplay.vn/lp/img/og.png"', 'property="og:locale" content="' + (l === "vi" ? "vi_VN" : "en_US") + '"', 'property="og:locale:alternate"', 'name="twitter:card" content="summary_large_image"', 'name="twitter:image"', 'property="og:url" content="' + canon + '"', 'name="theme-color"', 'rel="icon"']) note(h.includes(x), tg, "thiếu meta: " + x);
    note(!/cookie\s*=/.test(h + fs.readFileSync(R("lp/landing.js"), "utf8")), tg, "mã có ghi cookie");
    /* tên miền ngoài trong src/href/url() (trừ canonical/og/hreflang/JSON-LD và liên kết thông tin) */
    const bad = [...h.matchAll(/<(?:script|link|img|iframe|source|video)\b[^>]*\b(?:src|href)="(https?:)?\/\/[^"]*"/g)].filter(m => !/rel="(canonical|alternate)"/.test(m[0]));
    note(!bad.length, tg, "nhúng tài nguyên ngoài: " + bad.map(m => m[0].slice(0, 80)).join(" | "));
    note(!/url\(\s*["']?https?:/.test(fs.readFileSync(R("lp/landing.css"), "utf8")), tg, "CSS tải tài nguyên ngoài");
    for (const k of Object.keys(plans)) { const v = l === "vi" ? fmtVi(plans[k].amount) : fmtEn(plans[k].amount); note(h.includes(v), tg, "bảng giá thiếu " + v + " (gói " + k + ")"); }
    for (const k of Object.keys(plans)) note(h.includes(">" + plans[k].days + (l === "vi" ? " ngày" : plans[k].days === 1 ? " day" : " days") + "<") || (plans[k].days === 1 && h.includes(">1 " + (l === "vi" ? "ngày" : "day") + "<")), tg, "thời hạn gói " + k + " (" + plans[k].days + ")");
    /* JSON-LD */
    const lm = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]; note(lm.length === 1, tg, "cần đúng một thẻ JSON-LD");
    let ld = null; try { ld = JSON.parse(lm[0][1]); } catch (e) { note(false, tg, "JSON-LD không parse được"); }
    if (ld) {
      const g = ld["@graph"] || [], ty = t => g.filter(x => x["@type"] === t);
      note(ty("Organization").length === 1 && ty("WebSite").length === 1 && ty("VideoGame").length === 2 && ty("FAQPage").length === 1, tg, "JSON-LD thiếu loại (Organization, WebSite, VideoGame x2, FAQPage)");
      note(g.every(x => !x.aggregateRating && !x.review), tg, "JSON-LD có aggregateRating/review");
      const org = ty("Organization")[0] || {}; note(org.email === "support@nightplay.vn", tg, "email Organization");
      const unesc = s => s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const vis = [...h.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map(m => [unesc(m[1]), unesc(m[2])]);
      const me = (ty("FAQPage")[0] || {}).mainEntity || [];
      note(vis.length === 10 && me.length === 10 && me.every((q, i) => q.name === vis[i][0] && q.acceptedAnswer.text === vis[i][1]), tg, "FAQPage không khớp 10 câu hiển thị");
      for (const v of ty("VideoGame")) note(v.offers && v.offers.price === "0" && v.offers.priceCurrency === "VND" && /^https:\/\/nightplay\.vn\/(popplay|cozyplay)\/$/.test(v.url), tg, "VideoGame sai url/offers: " + v.name);
    }
    /* game: 12 thẻ, #id có thật */
    const gl = [...h.matchAll(/class="gcard (pop|night)" href="\/(popplay|cozyplay)\/#([a-z0-9-]+)"/g)];
    note(gl.length === 12 && gl.filter(m => m[1] === "pop").length === 6, tg, "lưới game cần 6 Pop + 6 Night");
    for (const m of gl) { note(gameIds.has(m[3]), tg, "game id lạ: " + m[3]); note((m[1] === "pop") === (m[2] === "popplay"), tg, "game " + m[3] + " sai cổng"); }
    for (const m of h.matchAll(/href="(mailto:[^"]*)"/g)) note(m[1] === "mailto:support@nightplay.vn", tg, "mailto sai: " + m[1]);
  }

  /* 3) trình duyệt */
  PORT = await new Promise(r => { const t = require("net").createServer().listen(0, () => { const p = t.address().port; t.close(() => r(p)); }); }); B = "http://127.0.0.1:" + PORT;
  const srv = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: dist, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const lum = c => { const [r, g, b] = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; };
  const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  try {
    /* liên kết nội bộ + neo (một lần, từ bản VI và EN) */
    const seen = new Set();
    for (const l of ["vi", "en"]) {
      const pg = await br.newPage(); await pg.goto(B + PAGES[l], { waitUntil: "load" });
      const hs = await pg.evaluate(() => [...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href")));
      const ids = await pg.evaluate(() => [...document.querySelectorAll("[id]")].map(e => e.id));
      for (const h of hs) {
        if (/^mailto:/.test(h)) continue;
        if (h.startsWith("#")) { note(ids.includes(h.slice(1)), "liên kết " + l, "neo " + h + " không có id"); continue; }
        if (!h.startsWith("/")) { note(false, "liên kết " + l, "liên kết không nội bộ: " + h); continue; }
        const u = h.split("#")[0]; if (seen.has(u)) continue; seen.add(u);
        const rs = await fetch(B + u); note(rs.status === 200, "liên kết " + l, u + " → " + rs.status);
      }
      await pg.close();
    }
    /* nút "Chơi ngay" trỏ hub /play/, KHÔNG về "/" */
    for (const l of ["vi", "en"]) { const pg = await br.newPage(); await pg.goto(B + PAGES[l], { waitUntil: "load" }); const c = await pg.evaluate(() => [...document.querySelectorAll("#heroCta, .btn.sm, .sticky a, .btn.big")].filter(a => /Chơi ngay|Play now/.test(a.textContent)).map(a => a.getAttribute("href"))); note(c.length >= 3 && c.every(h => h === "/play/"), "CTA " + l, "nút Chơi ngay phải trỏ /play/: " + c.join(","));
      await pg.click("#heroCta"); await pg.waitForFunction(() => location.pathname === "/play/", { timeout: 8000 }).catch(() => {}); await pg.waitForSelector("#aPop", { timeout: 5000 }).catch(() => {}); note(await pg.evaluate(() => location.pathname === "/play/" && !!document.getElementById("aPop")), "CTA " + l, "bấm Chơi ngay không tới hub /play/ (" + (await pg.evaluate(() => location.pathname)) + ")"); await pg.close(); }
    /* "Chơi tiếp" cho người đã từng chơi: chỉ đọc khoá có sẵn; HTML tĩnh vẫn "Chơi ngay"; không lỗi console, không request ngoài, không dịch chuyển bố cục, hero vừa 360x640 */
    { const T = { vi: ["Chơi ngay", "Chơi tiếp", "Có ván đang chơi dở"], en: ["Play now", "Continue playing", "You have a game in progress"] };
      const st = { none: [], played: [["np-hi-pop-fly", "5"]], resume: [["np-resume:pop-fly", JSON.stringify({ ts: Date.now(), state: { t: 1 } })]], stale: [["np-resume:pop-fly", "{khong-phai-json"]] };
      for (const l of ["vi", "en"]) for (const k of Object.keys(st)) for (const sz of [[360, 640], [390, 844], [1440, 900]]) {
        const pg = await br.newPage(); const errs = [], ext = []; await pg.setViewport({ width: sz[0], height: sz[1] });
        pg.on("console", m => { if (m.type() === "error" && !/status of 501/.test(m.text())) errs.push(m.text()); }); pg.on("pageerror", e => errs.push(String(e))); pg.on("request", r => { if (!r.url().startsWith(B) && !/^data:|^blob:/.test(r.url())) ext.push(r.url()); });
        await pg.evaluateOnNewDocument(kv => { try { localStorage.clear(); for (const [a, b] of kv) localStorage.setItem(a, b); } catch (e) {} window.__cls = 0; try { new PerformanceObserver(li => { for (const e of li.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); } catch (e) {} }, st[k]);
        await pg.goto(B + PAGES[l], { waitUntil: "load" }); await wait(300);
        const r = await pg.evaluate(() => { const h = document.getElementById("heroCta"), n = document.querySelector(".resume-note"); const b = h.getBoundingClientRect(); return { t: h.textContent.trim(), href: h.getAttribute("href"), h: b.height, bot: Math.max(b.bottom, n ? n.getBoundingClientRect().bottom : 0), note: n ? n.textContent : "", cls: window.__cls, ls: Object.keys(localStorage).sort().join() }; });
        const played = k !== "none", resume = k === "resume", tag = "chơi-tiếp " + l + "/" + k + "/" + sz.join("x");
        note(r.t === T[l][played ? 1 : 0], tag, "chữ nút '" + r.t + "'"); note(r.href === "/play/", tag, "href " + r.href); note(r.h >= 44, tag, "nút cao " + r.h);
        note(resume ? r.note === T[l][2] : !r.note, tag, "ghi chú '" + r.note + "'"); note(!errs.length, tag, "lỗi console: " + errs[0]); note(!ext.length, tag, "request ngoài: " + ext[0]);
        note(r.cls < 0.01, tag, "CLS " + r.cls); if (sz[1] === 640) note(r.bot <= 640, tag, "hero tràn màn 360x640 (đáy " + Math.round(r.bot) + ")");
        note(!/np-(hi|resume)/.test(r.ls.replace(/np-hi-pop-fly|np-resume:pop-fly/g, "")), tag, "landing không được ghi khoá mới: " + r.ls);
        if (sz[0] === 390 && k !== "stale" && k !== "played" && l === "vi" || (sz[0] === 1440 && k === "resume" && l === "en")) if (shotDir) await pg.screenshot({ path: path.join(shotDir, "playing-" + l + "-" + k + "-" + sz[0] + ".png") });
        await pg.close(); }
      /* storage không đọc được: giữ bản người mới, không lỗi */
      const pg = await br.newPage(); const errs = []; pg.on("pageerror", e => errs.push(String(e)));
      await pg.evaluateOnNewDocument(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); });
      await pg.goto(B + PAGES.vi, { waitUntil: "load" }); note((await pg.$eval("#heroCta", e => e.textContent.trim())) === "Chơi ngay" && !errs.length, "chơi-tiếp storage chặn", "phải giữ 'Chơi ngay', không lỗi: " + errs[0]); await pg.close(); }
    /* bố cục: thẻ lối vào bằng nhau + không xuống dòng, thẻ giá đều + không cắt chữ, không phần tử nào cuộn ngang/bị cắt, hero liền mạch dưới thanh trên */
    for (const l of ["vi", "en"]) for (const th of ["light", "dark"]) for (const sz of [[320, 568], [360, 640], [390, 844], [430, 932], [768, 1024], [900, 700], [960, 700], [1024, 768], [1440, 900]]) {
      const pg = await br.newPage(); await pg.setViewport({ width: sz[0], height: sz[1] });
      await pg.evaluateOnNewDocument(t => { try { localStorage.setItem("theme", t); } catch (e) {} }, th);
      await pg.goto(B + PAGES[l], { waitUntil: "load" }); await wait(250);
      const r = await pg.evaluate(() => {
        const q = s => [...document.querySelectorAll(s)], bx = e => e.getBoundingClientRect();
        const doors = q(".door").map(e => { const b = bx(e); return { w: Math.round(b.width), h: Math.round(b.height), clip: [...e.querySelectorAll("b,small")].some(x => x.scrollWidth > x.clientWidth + 1), lines: [...e.querySelectorAll("b,small")].map(x => Math.round(bx(x).height / parseFloat(getComputedStyle(x).lineHeight === "normal" ? parseFloat(getComputedStyle(x).fontSize) * 1.2 : getComputedStyle(x).lineHeight))) }; });
        const plans = q(".plan").map(e => { const b = bx(e); return { w: Math.round(b.width), h: Math.round(b.height), top: Math.round(b.top), clip: [...e.querySelectorAll("*")].some(x => x.scrollWidth > x.clientWidth + 1), badgeH: e.querySelector(".badge") ? Math.round(bx(e.querySelector(".badge")).height) : 0, price: e.querySelector(".pp").textContent }; });
        const over = q("body *").filter(e => { const cs = getComputedStyle(e); return cs.display !== "inline" && cs.display !== "contents" && e.clientWidth > 1 && e.scrollWidth > e.clientWidth + 1 && !/^(svg|path)$/i.test(e.tagName) && !e.closest(".sr,.skip") && !e.matches(".orbstage,.orbstage *,.marq,.marq *") && cs.position !== "absolute" || (e.clientWidth > 1 && !e.matches(".orbstage,.marq,.marq *") && cs.overflowX !== "visible" && e.scrollWidth > e.clientWidth + 1); }).slice(0, 3).map(e => e.tagName + "." + e.className);
        const top = bx(document.querySelector(".top")).bottom, h1 = bx(document.querySelector("h1")).top, cta = bx(document.getElementById("heroCta")), dr = q(".door").map(e => bx(e).bottom);
        return { doors, plans, over, gap: Math.round(h1 - top), ctaBot: Math.round(cta.bottom), doorBot: Math.round(Math.max(...dr)), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
      });
      const tag = "bố cục " + l + " " + sz.join("x") + " " + th;
      note(r.doors.length === 2 && r.doors[0].h === r.doors[1].h && Math.abs(r.doors[0].w - r.doors[1].w) <= 1 || (r.doors.length === 2 && sz[0] < 380), tag, "hai thẻ lối vào không bằng nhau " + JSON.stringify(r.doors.map(d => [d.w, d.h])));
      note(r.doors.every(d => !d.clip && d.lines.every(n => n <= 1)), tag, "thẻ lối vào bị cắt/xuống dòng " + JSON.stringify(r.doors));
      note(r.plans.length === 4 && new Set(r.plans.map(p => p.top > 0 ? p.w : 0)).size === 1, tag, "thẻ giá không đều rộng " + JSON.stringify(r.plans.map(p => p.w)));
      note(r.plans.every(p => !p.clip) && r.plans.every(p => !p.badgeH || p.badgeH <= 30), tag, "thẻ giá bị cắt chữ hoặc nhãn hai dòng");
      note(r.plans.map(p => p.price.replace(/\D/g, "")).join() === "9000,18000,36000,199000", tag, "giá thẻ không khớp PLANS: " + r.plans.map(p => p.price));
      note(!r.over.length, tag, "phần tử cuộn ngang/bị cắt: " + r.over.join(", ")); note(r.sw <= r.cw, tag, "trang tràn ngang");
      if (sz[0] <= 430) note(r.gap <= 64, tag, "khoảng trống trên h1 " + r.gap + "px (>64)");
      if (sz[0] === 360 && sz[1] === 640) note(r.ctaBot <= 640 && r.doorBot <= 640, tag, "CTA/thẻ lối vào không nằm trọn màn đầu (" + r.ctaBot + "/" + r.doorBot + ")");
      if (shotDir && [[360, 640], [390, 844], [430, 932], [1440, 900]].some(x => x[0] === sz[0])) await pg.screenshot({ path: path.join(shotDir, "design-" + l + "-" + th + "-" + sz[0] + ".png") });
      await pg.close(); }
    /* đổi ngôn ngữ giữ vị trí cuộn + câu FAQ đang mở (VI <-> EN), kể cả ?landing=1 */
    for (const sz of [[390, 844], [1440, 900]]) for (const q of ["", "?landing=1"]) for (const sel of [".top a.lang", "footer a.lang"]) {
      const pg = await br.newPage(); const errs = []; pg.on("pageerror", e => errs.push(String(e))); pg.on("console", m => { if (m.type() === "error" && !/status of 501/.test(m.text())) errs.push(m.text()); });
      await pg.setViewport({ width: sz[0], height: sz[1] }); await pg.evaluateOnNewDocument(() => { try { if (!sessionStorage.getItem("np-t")) { localStorage.clear(); sessionStorage.setItem("np-t", "1"); } } catch (e) {} });
      await pg.goto(B + "/" + q, { waitUntil: "load" }); await wait(200);
      const tag = "đổi-ngữ " + sz.join("x") + " " + q + " " + sel;
      let cur = "vi";
      for (const step of ["en", "vi"]) {
        const pos = await pg.evaluate(() => { document.getElementById("nightpass").scrollIntoView({ behavior: "instant" }); const d = document.querySelectorAll(".faq details"); return d.length; });
        await pg.evaluate(() => { window.scrollTo({ top: document.getElementById("nightpass").getBoundingClientRect().top + scrollY + 100, behavior: "instant" }); document.querySelectorAll(".faq details")[1].open = true; document.querySelectorAll(".faq details")[1].scrollIntoView({ behavior: "instant", block: "center" }); });
        const before = await pg.evaluate(() => scrollY);
        await Promise.all([pg.waitForNavigation({ waitUntil: "load" }), pg.evaluate(s => document.querySelector(s).click(), sel)]); await wait(400);
        const r = await pg.evaluate(() => { const d = document.querySelectorAll(".faq details")[1], f = d.getBoundingClientRect(); return { path: location.pathname, search: location.search, y: scrollY, open: d.open, inView: f.bottom > 0 && f.top < innerHeight, lang: document.documentElement.lang }; });
        note(r.path === (step === "en" ? "/en/" : "/") && r.lang === step, tag, "chưa sang " + step + ": " + r.path);
        note(!q || /landing=1/.test(r.search), tag, "mất ?landing=1: " + r.search);
        note(r.y > 300, tag, "mất vị trí cuộn (y=" + r.y + ", trước " + before + ")"); note(r.open, tag, "câu FAQ không mở lại ở " + step); note(r.inView, tag, "câu FAQ ra ngoài màn hình ở " + step);
        cur = step; }
      note(!errs.length, tag, "lỗi console: " + errs[0]); await pg.close(); }
    /* chân trang + menu icon: gọn, không tràn/xuống dòng lộn xộn, nút >= 44px, chuột/phím/Esc, đúng đích */
    for (const l of ["vi", "en"]) for (const th of ["light", "dark"]) for (const sz of [[320, 568], [360, 640], [390, 844], [768, 1024], [1024, 768], [1440, 900]]) {
      const pg = await br.newPage(); await pg.setViewport({ width: sz[0], height: sz[1] }); const errs = []; pg.on("pageerror", e => errs.push(String(e)));
      await pg.evaluateOnNewDocument(t => { try { localStorage.clear(); localStorage.setItem("theme", t); } catch (e) {} }, th);
      await pg.goto(B + PAGES[l], { waitUntil: "load" }); await wait(250);
      const tag = "chân-trang " + l + " " + sz.join("x") + " " + th, narrow = sz[0] < 1000;
      await pg.evaluate(() => document.querySelector("footer.foot").scrollIntoView({ behavior: "instant", block: "end" })); await wait(150);
      const r = await pg.evaluate(() => { const f = document.querySelector("footer.foot"), b = f.querySelector(".mbtn"), nv = document.getElementById("flinks"), bb = b && b.getBoundingClientRect();
        const links = [...nv.querySelectorAll("a")].map(a => a.getAttribute("href")), ah = [...nv.querySelectorAll("a")].filter(a => a.offsetParent).map(a => a.getBoundingClientRect().height);
        const lines = [...nv.querySelectorAll("a")].filter(a => a.offsetParent).map(a => a.getBoundingClientRect().top);
        return { btn: !!b && b.offsetParent !== null, bw: bb ? bb.width : 0, bh: bb ? bb.height : 0, links, shown: nv.offsetParent !== null, ah, fh: Math.round(f.getBoundingClientRect().height), fsw: f.scrollWidth, fcw: f.clientWidth, left: Math.round(f.querySelector(".brand").getBoundingClientRect().left - f.querySelector(".wrap").getBoundingClientRect().left), right: Math.round(f.querySelector(".wrap").getBoundingClientRect().right - (b && b.offsetParent ? bb.right : nv.getBoundingClientRect().right)), tops: new Set(lines.map(Math.round)).size }; });
      note(r.links.length === 7 && ["/popplay/", "/cozyplay/", /chân-trang en /.test(tag) ? "/en/moi/" : "/moi/", "/subscribe.html", "/privacy.html", "/terms.html", "mailto:support@nightplay.vn"].every(h => r.links.includes(h)), tag, "liên kết chân trang sai: " + r.links);
      note(r.fsw <= r.fcw, tag, "chân trang tràn ngang"); note(r.left === 16, tag, "lề trái " + r.left); note(r.right >= 15 && r.right <= 17, tag, "lề phải " + r.right);
      if (narrow) { note(r.btn && r.bw >= 44 && r.bh >= 44, tag, "thiếu nút menu >= 44px"); note(!r.shown, tag, "liên kết còn hiện dàn trải khi hẹp"); }
      else { note(!r.btn && r.shown && r.ah.every(h => h <= 50) && r.tops <= 2, tag, "chân trang rộng phải là một hàng gọn (hàng=" + r.tops + ")"); note(r.fh <= 270, tag, "chân trang cao " + r.fh); }
      if (narrow) {
        await pg.click("footer .mbtn"); await wait(150);
        const o = await pg.evaluate(() => { const nv = document.getElementById("flinks"), b = document.querySelector("footer .mbtn"), q = nv.getBoundingClientRect(); return { open: nv.offsetParent !== null && b.getAttribute("aria-expanded") === "true", inside: q.left >= 0 && q.right <= innerWidth && q.top >= 0, hs: [...nv.querySelectorAll("a")].every(a => a.getBoundingClientRect().height >= 44) }; });
        note(o.open && o.inside && o.hs, tag, "menu mở sai: " + JSON.stringify(o)); if (shotDir && (sz[0] === 390 || sz[0] === 1440)) await pg.screenshot({ path: path.join(shotDir, "foot-" + l + "-" + th + "-" + sz[0] + ".png") });
        await pg.keyboard.press("Escape"); await wait(100); note(await pg.evaluate(() => document.getElementById("flinks").offsetParent === null), tag, "Esc không đóng menu");
        await pg.focus("footer .mbtn"); await pg.keyboard.press("Enter"); await wait(100); note(await pg.evaluate(() => document.getElementById("flinks").offsetParent !== null), tag, "Enter không mở menu");
        await pg.mouse.click(5, 5); await wait(100); note(await pg.evaluate(() => document.getElementById("flinks").offsetParent === null), tag, "bấm ngoài không đóng menu");
        if (sz[0] >= 320) { await pg.evaluate(() => scrollTo({ top: 0, behavior: "instant" })); await wait(100); const hb = await pg.$(".top .mbtn"); const bx = hb && await hb.boundingBox();
          note(!!bx && bx.width >= 44 && bx.height >= 44, tag, "thiếu nút menu header >= 44px"); if (hb) { await hb.click(); await wait(150); const h = await pg.evaluate(SZ0 => { const n = document.getElementById("hlinks"), q = n.getBoundingClientRect(), c = document.querySelector(".top .btn").getBoundingClientRect(); return { vis: n.offsetParent !== null, in: q.right <= innerWidth && q.left >= 0, cta: c.width >= 80 && c.height >= 44, n: n.querySelectorAll("a:not(.xtra)").length, x: SZ0 < 340 ? [...n.querySelectorAll(".xtra")].every(e => e.getBoundingClientRect().height >= 44) && !document.querySelector(".top .tools>.lang").offsetParent : true }; }, sz[0]);
            note(h.vis && h.in && h.cta && h.x && h.n === 6, tag, "menu header sai " + JSON.stringify(h)); await pg.keyboard.press("Escape"); } }
      } else if (sz[0] >= 1000) note(await pg.evaluate(() => document.getElementById("hlinks").offsetParent !== null), tag, "liên kết neo header phải hiện");
      note(!errs.length, tag, "lỗi: " + errs[0]); await pg.close(); }
    /* mục phụ huynh + ảnh chụp thật: có id trong menu neo, ảnh tải được có width/height + alt, CTA/chính sách đúng, không CLS */
    for (const l of ["vi", "en"]) for (const th of ["light", "dark"]) for (const sz of [[390, 844], [1440, 900]]) {
      const pg = await br.newPage(); await pg.setViewport({ width: sz[0], height: sz[1] }); const errs = [];
      pg.on("console", m => { if (m.type() === "error" && !/status of 501/.test(m.text())) errs.push(m.text()); });
      await pg.evaluateOnNewDocument(t => { try { localStorage.setItem("theme", t); } catch (e) {} window.__cls = 0; try { new PerformanceObserver(li => { for (const e of li.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); } catch (e) {} }, th);
      await pg.goto(B + PAGES[l], { waitUntil: "load" }); const tag = "phụ-huynh " + l + " " + sz.join("x") + " " + th;
      await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
      await wait(600);
      const r = await pg.evaluate(() => { const sec = document.getElementById("phuhuynh"), im = [...document.querySelectorAll(".scr img")].filter(i => i.offsetParent);
        return { sec: !!sec, nav: !!document.querySelector('#hlinks a[href="#phuhuynh"]'), h2: sec && sec.querySelector("h2").textContent.length, cta: sec && sec.querySelector('a[href="/popplay/"]') && sec.querySelector('a[href="/privacy.html"]') ? 1 : 0, cards: sec ? sec.querySelectorAll(".pcard").length : 0,
          imgs: im.length, bad: im.filter(i => !i.complete || !i.naturalWidth || !i.getAttribute("width") || !i.getAttribute("height") || (i.alt || "").length < 10).map(i => i.src.split("/").pop()), cls: window.__cls, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, over: sec ? sec.scrollWidth > sec.clientWidth : 0 }; });
      note(r.sec && r.nav && r.h2 > 10 && r.cta && r.cards === 4, tag, "mục phụ huynh thiếu thành phần " + JSON.stringify(r)); note(r.imgs >= 2 && !r.bad.length, tag, "ảnh lỗi/thiếu kích thước/alt: " + r.bad + " (" + r.imgs + ")");
      note(r.cls < 0.02, tag, "CLS " + r.cls); note(r.sw <= r.cw && !r.over, tag, "tràn ngang"); note(!errs.length, tag, "lỗi console " + errs[0]);
      if (shotDir) { await pg.evaluate(() => document.getElementById("phuhuynh").scrollIntoView({ behavior: "instant" })); await wait(300); await pg.screenshot({ path: path.join(shotDir, "parents-" + l + "-" + th + "-" + sz[0] + ".png") }); await pg.evaluate(() => scrollTo(0, 0)); await wait(300); await pg.screenshot({ path: path.join(shotDir, "hero-" + l + "-" + th + "-" + sz[0] + ".png") }); }
      await pg.close(); }
    /* hub /play/: mọi liên kết nội bộ + tài nguyên trả 200 (không 404 do đổi đường dẫn), nút ← ở trang cổng về /play/ */
    { const pg = await br.newPage(); const bad = []; pg.on("response", r => { if (r.url().startsWith(B) && r.status() >= 400 && !/\/api\//.test(r.url())) bad.push(r.status() + " " + r.url()); });
      await pg.goto(B + "/play/", { waitUntil: "networkidle0" }); await wait(300); note(!bad.length, "hub /play/", "tài nguyên lỗi: " + bad.slice(0, 3).join(" | "));
      const hs = await pg.evaluate(() => [...document.querySelectorAll("a[href]")].map(a => a.href));
      for (const h of new Set(hs)) { if (/^mailto:/.test(h)) continue; if (!h.startsWith(B)) { note(false, "hub /play/", "liên kết ngoài origin: " + h); continue; } const rs = await fetch(h.split("#")[0]); note(rs.status === 200, "hub /play/", h + " → " + rs.status); }
      const mh = await pg.evaluate(() => (document.querySelector('link[rel=manifest]') || {}).href); note(mh === B + "/manifest.webmanifest", "hub /play/", "manifest link sai: " + mh);
      await pg.close();
      for (const portal of ["popplay", "cozyplay"]) { const p2 = await br.newPage(); await p2.goto(B + "/" + portal + "/index.html", { waitUntil: "load" }); const hh = await p2.evaluate(() => ["hubBtn", "hubLink", "fHub"].map(i => { const e = document.getElementById(i); return e ? e.href : "" })); note(hh.every(h => h === B + "/play/index.html"), "cổng " + portal, "nút Home/hub phải về /play/index.html: " + hh.join(" ")); await p2.close(); } }
    let weight = 0;
    const matrix = []; for (const l of ["vi", "en"]) for (const [w, h] of SIZES) for (const th of ["light", "dark"]) { if (quick && l === "en" && (w !== 390 || th !== "light")) continue; matrix.push([l, w, h, th]); }
    for (const [l, w, h, th] of matrix) {
      const tag = l + " " + w + "x" + h + " " + th;
      const cx = await (br.createBrowserContext || br.createIncognitoBrowserContext).call(br);   // localStorage riêng mỗi lượt
      const pg = await cx.newPage(); await pg.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await pg.emulateMediaFeatures([{ name: "prefers-color-scheme", value: th }]);
      const errs = [], ext = []; let bytes = 0;
      pg.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
      pg.on("pageerror", e => errs.push("pageerror " + e.message));
      await pg.setRequestInterception(true);
      pg.on("request", rq => { const u = rq.url(); if (u.startsWith("data:")) return rq.continue(); if (!u.startsWith(B)) { ext.push(u); return rq.abort(); } if (/\/api\/t$/.test(u)) return rq.respond({ status: 204, body: "" }); rq.continue(); });
      pg.on("response", async r => { try { if (r.url().startsWith(B) && !/\/api\//.test(r.url())) { const b = await r.buffer(); bytes += b.length; if (r.status() >= 400) errs.push("HTTP " + r.status() + " " + r.url()); } } catch (e) {} });
      await pg.goto(B + PAGES[l], { waitUntil: "networkidle0" }); await wait(300);
      if (l === "vi" && w === 390 && th === "light") weight = bytes;
      const m = await pg.evaluate(() => {
        const out = { sw: document.documentElement.scrollWidth, iw: innerWidth, cookie: document.cookie, ls: Object.keys(localStorage), small: [], low: [], theme: document.documentElement.dataset.theme };
        const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none"; };
        for (const e of document.querySelectorAll(".btn,.lang,.ico,.links a,.flinks a,summary,.gcard,.brand")) {
          if (!vis(e) || e.closest(".sticky")) continue; const r = e.getBoundingClientRect();
          if (r.height < 43.5 || r.width < 43.5) out.small.push((e.className || e.tagName) + ":" + Math.round(r.width) + "x" + Math.round(r.height) + " " + (e.textContent || "").trim().slice(0, 20));
        }
        const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).map(Number); return { c: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 }; };
        const bgOf = el => { for (let e = el; e; e = e.parentElement) { if (e.classList.contains("world") || e.classList.contains("sticky") || e.classList.contains("orbstage") || e.classList.contains("mimg")) return "skip"; const p = parse(getComputedStyle(e).backgroundColor); if (p && p.a > .9) return p.c; } return [255, 255, 255]; };
        const seen = new Set();
        const wk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n; (n = wk.nextNode());) {
          const t = n.textContent.trim(); if (!t) continue; const e = n.parentElement; if (seen.has(e) || !vis(e) || e.closest("script,style,[hidden],.sticky")) continue; seen.add(e);
          const s = getComputedStyle(e), fg = parse(s.color); if (!fg) continue; const bg = bgOf(e); if (bg === "skip") continue;
          const big = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.66 && +s.fontWeight >= 700);
          out.low.push({ t: t.slice(0, 24), fg: fg.c, bg, min: big ? 3 : 4.5 });
        }
        return out;
      });
      note(m.sw <= m.iw, tag, "tràn ngang: scrollWidth " + m.sw + " > " + m.iw);
      note(!errs.length, tag, "lỗi console/request: " + errs.slice(0, 2).join(" | "));
      note(!ext.length, tag, "request ra ngoài: " + ext.slice(0, 2).join(", "));
      note(m.cookie === "", tag, "có cookie: " + m.cookie);
      note(m.ls.every(k => k === "theme" || k === "lang"), tag, "localStorage có khoá lạ: " + m.ls);
      note(m.theme === th, tag, "data-theme " + m.theme + " ≠ " + th);
      note(!m.small.length, tag, "nút/liên kết < 44px: " + m.small.slice(0, 3).join("; "));
      const lows = m.low.filter(x => cr(x.fg, x.bg) < x.min); note(!lows.length, tag, "tương phản thấp: " + lows.slice(0, 3).map(x => x.t + " " + cr(x.fg, x.bg).toFixed(2)).join("; "));
      /* hero một màn hình ở 360x640 */
      if (w === 360 && h === 640) {
        const hh = await pg.evaluate(() => { const g = s => document.querySelector(s).getBoundingClientRect(); const hero = g(".hero"); return { top: hero.top, bottom: hero.bottom, cta: g("#heroCta").bottom, badges: g(".badges").bottom, g2: g(".cta .night").bottom, ih: innerHeight }; });
        note(Math.max(hh.cta, hh.g2) <= hh.ih && hh.badges <= hh.ih, tag, "CTA/thẻ lối vào/huy hiệu ra ngoài màn đầu (" + Math.round(hh.cta) + "/" + Math.round(hh.g2) + "/" + Math.round(hh.badges) + " > " + hh.ih + "); điện thoại minh hoạ được phép ló xuống dưới");
        note(hh.cta <= hh.ih && hh.g2 <= hh.ih && hh.badges <= hh.ih, tag, "CTA/huy hiệu nằm ngoài màn hình đầu");
      }
      if (shotDir && ((w === 390 && h === 844) || (w === 1440 && h === 900))) { fs.mkdirSync(shotDir, { recursive: true }); await pg.screenshot({ path: path.join(shotDir, `landing-${l}-${w}-${th}-top.png`) }); await pg.screenshot({ path: path.join(shotDir, `landing-${l}-${w}-${th}-full.png`), fullPage: true }); }
      /* FAQ bằng bàn phím + công tắc theme (một lần) */
      if (l === "vi" && w === 390 && th === "light") {
        await pg.evaluate(() => document.querySelector(".faq summary").focus()); await pg.keyboard.press("Enter");
        note(await pg.evaluate(() => document.querySelector(".faq details").open), tag, "FAQ không mở bằng phím Enter");
        await pg.click("#themeBtn"); note(await pg.evaluate(() => document.documentElement.dataset.theme === "dark" && localStorage.getItem("theme") === "dark"), tag, "nút theme không đổi/ghi localStorage");
        const sticky0 = await pg.evaluate(() => document.getElementById("sticky").classList.contains("on")); note(!sticky0, tag, "thanh CTA dính hiện khi chưa cuộn");
        await pg.evaluate(() => scrollTo(0, 1500)); await wait(400);
        note(await pg.evaluate(() => document.getElementById("sticky").classList.contains("on")), tag, "thanh CTA dính không hiện sau khi cuộn");
      }
      await pg.close(); await cx.close();
    }
    /* hệ quỹ đạo "Chọn thế giới của bạn": HTML tĩnh, bố cục, chuyển động, tương tác, âm thanh (mức trạng thái; không nghe được tiếng thật) */
    for (const l of ["vi", "en"]) {
      const tg = "quỹ đạo " + l, h = src[l], sec = (h.match(/<section class="sec alt orbit"[\s\S]*?<\/section>/) || [""])[0];
      note(!!sec && /<h2 id="hWorlds">/.test(sec), tg, "thiếu mục quỹ đạo hoặc h2#hWorlds");
      note(/<article class="world pop">[\s\S]*?<a class="btn white" href="\/popplay\/">/.test(sec) && /<article class="world night">[\s\S]*?<a class="btn white" href="\/cozyplay\/">/.test(sec), tg, "hai thẻ chi tiết phải là <a href=/popplay/> và <a href=/cozyplay/> trong HTML tĩnh");
      note(sec.includes(l === "vi" ? "12 game ngắn học chữ, số, màu, nhịp" : "12 short games for letters") && sec.includes(l === "vi" ? "20 game giải toả" : "20 relaxing games"), tg, "thiếu mô tả hai thế giới");
      const ms = fs.readFileSync(path.join(root, "shared", "multi-games.js"), "utf8"), cnt = p => [...ms.matchAll(new RegExp('^\\s*"[a-z0-9-]+":\\s*\\{\\s*portal: "' + p + '"', "gm"))].length;
      note(cnt("popplay") === 12 && cnt("cozyplay") === 20, tg, "số game thật đã đổi (" + cnt("popplay") + "/" + cnt("cozyplay") + "): sửa chữ '12'/'20' ở mục này");
      const st = [...sec.matchAll(/<a class="sat (pop|night)"[^>]*href="\/(popplay|cozyplay)\/#([a-z0-9-]+)" aria-label="([^"]+)"/g)];
      note(st.length === 12 && st.filter(m => m[1] === "pop").length === 6, tg, "cần 6 icon Pop + 6 icon Night có aria-label (đang " + st.length + ")");
      for (const m of st) { note(gameIds.has(m[3]), tg, "icon trỏ id lạ " + m[3]); note((m[1] === "pop") === (m[2] === "popplay"), tg, "icon " + m[3] + " sai cổng"); }
      note(/<button class="orbsnd"[^>]*aria-pressed="false"[^>]*aria-label="[^"]+"/.test(sec), tg, "thiếu nút âm thanh aria-pressed=false + aria-label");
    }
    for (const sz of quick ? [[360, 640], [1440, 900]] : [[320, 568], [360, 640], [390, 844], [768, 1024], [1024, 768], [1440, 900]]) for (const l of ["vi", "en"]) for (const th of ["light", "dark"]) {
      const tag = "quỹ đạo " + l + " " + sz.join("x") + " " + th, pg = await br.newPage(); await pg.setViewport({ width: sz[0], height: sz[1] });
      const errs = []; pg.on("console", m => { if (m.type() === "error" && !/status of (501|404)/.test(m.text())) errs.push(m.text()); }); pg.on("pageerror", e => errs.push(String(e)));
      await pg.evaluateOnNewDocument(t => { try { localStorage.setItem("theme", t); } catch (e) {} window.__cls = 0; window.__acs = 0; const A = window.AudioContext; if (A) { window.AudioContext = function () { window.__acs++; return new A(); }; } try { new PerformanceObserver(li => { for (const e of li.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); } catch (e) {} }, th);
      await pg.goto(B + PAGES[l] + "?debug", { waitUntil: "load" }); await pg.evaluate(() => document.getElementById("orbsys").scrollIntoView({ block: "center" })); await wait(700);
      const m = await pg.evaluate(() => { const q = s => [...document.querySelectorAll(s)], bx = e => e.getBoundingClientRect(), stg = document.querySelector(".orbstage"), s = bx(stg);
        const wd = q(".world").map(e => bx(e)); return { sw: document.documentElement.scrollWidth, iw: innerWidth, th: document.documentElement.dataset.theme, sh: s.height, sw2: s.width, sats: q(".sat").map(e => { const r = bx(e); return Math.min(r.width, r.height); }), snd: (() => { const b = document.querySelector(".orbsnd"), r = bx(b); return { w: r.width, h: r.height, p: b.getAttribute("aria-pressed"), hid: b.hidden, l: b.getAttribute("aria-label") }; })(),
          ctx0: window.__acs, st0: window.__npOrbit && window.__npOrbit.ctxCount, anim: document.getAnimations().filter(a => a instanceof CSSAnimation && a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest('#orbsys')).length, cls: window.__cls, moving: q(".sat, .planet, .orbsnd").filter(e => e.matches(".sat")).length,
          cards: wd.map(r => Math.round(r.left) + ":" + Math.round(r.right)), cardsVisible: wd.every(r => r.width > 100), inside: q(".sat").every(e => { const r = bx(e); return r.left >= s.left - 1 && r.right <= s.right + 1 && r.top >= s.top - 1 && r.bottom <= s.bottom + 1; }) }; });
      note(m.sw <= m.iw, tag, "tràn ngang " + m.sw + " > " + m.iw); note(m.th === th, tag, "theme " + m.th);
      note(m.sats.every(v => v >= 43.5), tag, "icon quỹ đạo < 44px (" + Math.min(...m.sats).toFixed(1) + ")"); note(m.snd.w >= 43.5 && m.snd.h >= 43.5 && !m.snd.hid, tag, "nút âm thanh thiếu/ < 44px");
      note(m.snd.p === "false" && m.ctx0 === 0 && m.st0 === 0, tag, "âm thanh phải tắt mặc định, chưa có AudioContext (aria-pressed=" + m.snd.p + ", ctx=" + m.ctx0 + ")");
      note(m.cls < 0.05, tag, "CLS " + m.cls.toFixed(3)); note(m.moving + m.anim <= 14, tag, "phần tử chuyển động " + m.moving + " + animation " + m.anim + " > 14"); note(m.anim <= 2, tag, "CSS animation/transition đang chạy: " + m.anim + " (chỉ được cực quang + sao băng)");
      if (sz[0] <= 700) note(m.sh <= 301, tag, "quỹ đạo cao " + Math.round(m.sh) + " > 300 ở điện thoại");
      note(m.cardsVisible, tag, "hai thẻ chi tiết phải luôn hiện"); note(!errs.length, tag, "lỗi console: " + errs[0]);
      if (shotDir && ((sz[0] === 390 && sz[1] === 844) || (sz[0] === 1440 && sz[1] === 900))) { fs.mkdirSync(shotDir, { recursive: true }); await pg.screenshot({ path: path.join(shotDir, `orbit-${l}-${sz[0]}-${th}.png`) }); }
      await pg.close();
    }
    /* hành vi: chuyển động, rê dừng, bàn phím, kéo, âm thanh, giảm chuyển động, chạm (điện thoại) */
    for (const l of ["vi", "en"]) {
      const tag = "quỹ đạo hành vi " + l, pg = await br.newPage(); await pg.setViewport({ width: 1440, height: 900 }); const errs = []; pg.on("pageerror", e => errs.push(String(e))); pg.on("console", m => { if (m.type() === "error" && !/status of (501|404)/.test(m.text())) errs.push(m.text()); });
      await pg.goto(B + PAGES[l] + "?debug", { waitUntil: "load" }); await pg.evaluate(() => document.getElementById("orbsys").scrollIntoView({ block: "center" })); await wait(600);
      const pos = w => pg.evaluate(w => [...document.querySelectorAll(".sat." + w)].map(e => e.style.transform).join("|"), "");
      const posW = w => pg.evaluate(w => [...document.querySelectorAll(".sat." + w)].map(e => e.style.transform).join("|"), w);
      const a0 = await posW("pop"), b0 = await posW("night"); await wait(600); const a1 = await posW("pop"), b1 = await posW("night");
      note(a0 !== a1 && b0 !== b1, tag, "quỹ đạo không tự quay");
      const dir = await pg.evaluate(() => window.__npOrbit.vel); note(dir.pop > 0 && dir.night < 0, tag, "hai quỹ đạo phải quay ngược chiều (" + dir.pop.toFixed(2) + "/" + dir.night.toFixed(2) + ")");
      /* rê vào icon Pop: Pop dừng + thẻ Pop sáng, Night vẫn quay */
      const sp = await pg.$(".sat.pop"), bb = await sp.boundingBox(); await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await wait(900);
      const hv = await pg.evaluate(() => ({ p: window.__npOrbit.paused, hot: window.__npOrbit.hot, pop: document.querySelector(".world.pop").classList.contains("on"), night: document.querySelector(".world.night").classList.contains("on") }));
      note(hv.p.pop && !hv.p.night && hv.hot === "pop" && hv.pop && !hv.night, tag, "rê vào icon Pop phải dừng Pop + sáng thẻ Pop: " + JSON.stringify(hv));
      await wait(900); const h1 = await posW("pop"); await wait(300); note(h1 === await posW("pop"), tag, "Pop chưa đứng yên khi rê");
      await pg.mouse.move(5, 5); await wait(800); note(!(await pg.evaluate(() => window.__npOrbit.paused.pop)), tag, "bỏ rê mà Pop vẫn dừng");
      /* rê vào thẻ Night */
      const nc = await (await pg.$(".world.night")).boundingBox(); await pg.mouse.move(nc.x + 20, nc.y + 20); await wait(700);
      note(await pg.evaluate(() => window.__npOrbit.paused.night && document.querySelector(".world.night").classList.contains("on")), tag, "rê vào thẻ Night phải dừng quỹ đạo Night"); await pg.mouse.move(5, 5);
      /* bàn phím: Tab đi qua hai thẻ rồi các icon; Enter/liên kết; mũi tên xoay */
      await pg.evaluate(() => document.querySelector(".world.pop a").focus()); const seq = [];
      for (let i = 0; i < 4; i++) { await pg.keyboard.press("Tab"); seq.push(await pg.evaluate(() => (document.activeElement.getAttribute("href") || document.activeElement.className))); }
      note(seq[0] === "/cozyplay/" && /^\/(popplay|cozyplay)\/#/.test(seq[1]) && /^\/(popplay|cozyplay)\/#/.test(seq[3]), tag, "thứ tự Tab: " + seq.join(" > "));
      await pg.evaluate(() => document.querySelector(".sat.pop").focus()); await wait(500); const k0 = await posW("pop"); await pg.keyboard.press("ArrowRight"); await wait(700); const k1 = await posW("pop");
      note(k0 !== k1, tag, "← → không xoay quỹ đạo khi icon được focus"); note(await pg.evaluate(() => window.__npOrbit.paused.pop && document.querySelector(".world.pop").classList.contains("on")), tag, "focus icon phải dừng + sáng thẻ");
      await pg.evaluate(() => document.activeElement.blur()); await wait(300);
      /* kéo nhanh quỹ đạo Night */
      const pt = await pg.evaluate(() => { const r = document.querySelector(".orbstage").getBoundingClientRect(), U = r.width / 600, th = 18 * Math.PI / 180, f = ph => { const ex = 262 * Math.cos(ph), ey = 140 * Math.sin(ph); return [r.left + (300 + ex * Math.cos(th) - ey * Math.sin(th)) * U, r.top + (250 + ex * Math.sin(th) + ey * Math.cos(th)) * U]; }; return [0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5].map(f); });
      /* điểm kéo phải ở trên vành Night và không đè icon: dùng góc giữa hai icon (icon cách nhau 60°, bắt đầu 50°) */
      await pg.mouse.move(pt[0][0], pt[0][1]); await pg.mouse.down(); for (const p of pt.slice(1)) { await pg.mouse.move(p[0], p[1]); await wait(16); }
      const dv = await pg.evaluate(() => ({ v: window.__npOrbit.vel.night, d: document.querySelector(".orbstage").classList.contains("drag") })); await pg.mouse.up(); await wait(150);
      note(Math.abs(dv.v) > 1.5, tag, "kéo nhanh mà vận tốc Night chỉ " + dv.v.toFixed(2)); await pg.mouse.move(5, 5); await wait(4500);
      const dv2 = await pg.evaluate(() => window.__npOrbit.vel.night); note(Math.abs(dv2) < 0.6 && dv2 < 0, tag, "sau khi thả, Night phải về tốc độ tự động (" + dv2.toFixed(2) + ")");
      /* âm thanh */
      const s0 = await pg.evaluate(() => { const b = document.querySelector(".orbsnd"); return { p: b.getAttribute("aria-pressed"), c: window.__npOrbit.ctxCount, s: window.__npOrbit.state() }; });
      note(s0.p === "false" && s0.c === 0 && s0.s === "none", tag, "trước khi bấm: " + JSON.stringify(s0));
      await pg.click(".orbsnd"); await wait(300);
      const s1 = await pg.evaluate(() => { const b = document.querySelector(".orbsnd"); return { p: b.getAttribute("aria-pressed"), c: window.__npOrbit.ctxCount, s: window.__npOrbit.state(), l: b.getAttribute("aria-label"), t: b.textContent }; });
      note(s1.p === "true" && s1.c === 1 && /running/.test(s1.s) && s1.t === "🔊" && s1.l === (l === "vi" ? "Tắt âm thanh quỹ đạo" : "Turn orbit sound off"), tag, "sau khi bấm: " + JSON.stringify(s1));
      await pg.evaluate(() => { window.__npOrbit.ticks = 0; window.__npOrbit.dropped = 0; window.__npOrbit.maxPerSec = 0; }); await wait(3000);
      const slow = await pg.evaluate(() => window.__npOrbit.ticks);
      await pg.evaluate(() => { window.__npOrbit.ticks = 0; });
      const pt2 = pt.concat(pt.slice().reverse()).concat(pt).concat(pt.slice().reverse()); await pg.mouse.move(pt2[0][0], pt2[0][1]); await pg.mouse.down(); const t0 = Date.now(); for (const p of pt2.slice(1)) { await pg.mouse.move(p[0], p[1]); await wait(14); } const el = (Date.now() - t0) / 1000; const fast = await pg.evaluate(() => ({ t: window.__npOrbit.ticks, m: window.__npOrbit.maxPerSec, dr: window.__npOrbit.dropped })); await pg.mouse.up();
      note(fast.t / el > slow / 3 && fast.t >= 4, tag, "kéo nhanh phải tick dày hơn quay tự động: nhanh " + (fast.t / el).toFixed(1) + "/s so với " + (slow / 3).toFixed(1) + "/s");
      note(fast.m <= 13, tag, "vượt giới hạn tick/giây: " + fast.m);
      await pg.click(".orbsnd"); await wait(400); const s2 = await pg.evaluate(() => ({ p: document.querySelector(".orbsnd").getAttribute("aria-pressed"), a: window.__npOrbit.audio })); note(s2.p === "false" && !s2.a, tag, "bấm lần hai phải tắt âm");
      note(!errs.length, tag, "lỗi: " + errs[0]);
      if (shotDir && l === "vi") { await pg.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await wait(700); await pg.screenshot({ path: path.join(shotDir, "orbit-hover-pop-1440.png") }); const n2 = await (await pg.$(".sat.night")).boundingBox(); await pg.mouse.move(n2.x + 20, n2.y + 20); await wait(700); await pg.screenshot({ path: path.join(shotDir, "orbit-hover-night-1440.png") }); }
      await pg.close();
      /* giảm chuyển động: không tự quay, không CSS animation */
      const pr = await br.newPage(); await pr.setViewport({ width: 390, height: 844 }); await pr.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      await pr.goto(B + PAGES[l] + "?debug", { waitUntil: "load" }); await pr.evaluate(() => document.getElementById("orbsys").scrollIntoView({ block: "center" })); await wait(500);
      const r0 = await pr.evaluate(() => [...document.querySelectorAll(".sat")].map(e => e.style.transform).join("|")); await wait(900); const r1 = await pr.evaluate(() => [...document.querySelectorAll(".sat")].map(e => e.style.transform).join("|"));
      note(r0 === r1, tag + " reduced", "vẫn tự quay khi prefers-reduced-motion"); note(await pr.evaluate(() => document.getAnimations().length === 0 && window.__npOrbit.reduced && window.__npOrbit.frames < 5 && !!document.querySelector(".orbsnd") && !document.querySelector(".orbsnd").hidden), tag + " reduced", "phải không animation, vòng lặp ngủ, vẫn có nút âm thanh");
      if (shotDir) await pr.screenshot({ path: path.join(shotDir, `orbit-reduced-${l}-390.png`) }); await pr.close();
      /* điện thoại: chạm vệ tinh -> thẻ sáng + cuộn tới thẻ, chưa mở game */
      const mp = await br.newPage(); await mp.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true }); await mp.goto(B + PAGES[l] + "?debug", { waitUntil: "load" }); await mp.evaluate(() => document.getElementById("orbsys").scrollIntoView({ block: "start" })); await wait(500);
      const y0 = await mp.evaluate(() => scrollY); const ns = await mp.$(".sat.night"); const nb = await ns.boundingBox(); await mp.touchscreen.tap(nb.x + nb.width / 2, nb.y + nb.height / 2); await wait(1200);
      const tp = await mp.evaluate(() => ({ on: document.querySelector(".world.night").classList.contains("on"), path: location.pathname, y: scrollY, inView: (r => r.top < innerHeight && r.bottom > 0)(document.querySelector(".world.night").getBoundingClientRect()) }));
      note(tp.on && tp.path === PAGES[l] && tp.inView && tp.y > y0, tag + " chạm", "chạm vệ tinh Night phải nhấn mạnh + cuộn tới thẻ, chưa mở game: " + JSON.stringify(tp)); if (shotDir) await mp.screenshot({ path: path.join(shotDir, `orbit-tap-night-${l}-390.png`) }); await mp.close();
    }
    /* ===== dải game tự trượt + hover/focus (hero) ===== */
    for (const l of ["vi", "en"]) for (const [w, h, th] of (quick ? [[1440, 900, "dark"], [1440, 900, "light"], [390, 844, "light"]] : [[320, 568, "dark"], [390, 844, "light"], [768, 1024, "dark"], [1024, 768, "light"], [1440, 900, "dark"], [1440, 900, "light"]])) {
      const tag = `dải game ${l} ${w}x${h} ${th}`, pg = await br.newPage(); await pg.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await pg.evaluateOnNewDocument((t) => { try { localStorage.setItem("theme", t); } catch (e) {} window.__cls = 0; try { new PerformanceObserver(x => { for (const e of x.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); } catch (e) {} }, th);
      await pg.goto(B + PAGES[l], { waitUntil: "load" }); await wait(500);
      const m = await pg.evaluate(() => { const mq = document.querySelector(".marq"), vis = mq && getComputedStyle(mq).display !== "none", all = [...document.querySelectorAll(".mi")], real = all.filter(a => !a.hasAttribute("aria-hidden")), dup = all.filter(a => a.hasAttribute("aria-hidden"));
        const tr = mq && mq.querySelector(".mtrack"), cs = tr && getComputedStyle(tr); return { vis, real: real.map(a => a.getAttribute("href")), dupOk: dup.length === real.length && dup.every(a => a.tabIndex === -1), size: real[0] && [real[0].offsetWidth, real[0].offsetHeight], anim: cs && cs.animationName, state: cs && cs.animationPlayState, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, cls: window.__cls, imgs: real.every(a => a.querySelector("img")), names: real.every(a => a.querySelector(".mn").textContent.trim().length > 2) }; });
      if (!m.vis) { note(w < 900 && h <= 700, tag, "dải bị ẩn ngoài ca cho phép"); await pg.close(); continue; }
      const ids = {}; for (const mm of fs.readFileSync(path.join(root, "shared", "multi-games.js"), "utf8").matchAll(/^\s*"([a-z0-9-]+)":\s*\{\s*portal:\s*"(\w+)"/gm)) ids[mm[1]] = mm[2];
      note(m.real.length >= 16, tag, "cần >= 16 game, có " + m.real.length); m.real.forEach(hf => { const mm = hf.match(/^\/(popplay|cozyplay)\/#([a-z0-9-]+)$/); note(mm && ids[mm[2]] === mm[1], tag, "liên kết sai id/cổng: " + hf); });
      note(m.dupOk, tag, "phần nhân đôi phải aria-hidden + tabindex=-1, đủ số lượng"); note(m.size[0] >= 44 && m.size[1] >= 64, tag, "ô nhỏ " + m.size); note(m.imgs && m.names, tag, "mỗi ô cần ảnh + tên");
      note(m.anim === "marq" && m.state === "running", tag, "dải phải tự trượt: " + m.anim + "/" + m.state); note(m.sw <= m.cw && m.cls < 0.05, tag, `tràn ngang ${m.sw}>${m.cw} hoặc CLS ${m.cls.toFixed(3)}`);
      if (w >= 1024) {  /* rê chuột: dừng + ô nổi lên (transform/box-shadow đổi <= 300ms, hộp bố cục giữ nguyên) */
        const box = async () => pg.evaluate(() => { const a = document.querySelector(".mi:nth-child(3)"), r = (e => ({ w: e.offsetWidth, h: e.offsetHeight }))(a), c = getComputedStyle(a), im = getComputedStyle(a.querySelector(".mimg")); return { r, tf: c.transform, sh: im.boxShadow, st: getComputedStyle(document.querySelector(".mtrack")).animationPlayState, sw: document.documentElement.scrollWidth }; });
        const b0 = await box(); const bb = await (await pg.$(".mi:nth-child(3)")).boundingBox(); await pg.mouse.move(bb.x + bb.width / 2, bb.y + 20); await wait(300); const b1 = await box();
        note(b1.st === "paused", tag, "rê chuột mà dải không dừng"); note(b1.sh !== b0.sh, tag, "hover ô game không đổi box-shadow"); note(b1.r.w === b0.r.w && b1.r.h === b0.r.h && b1.sw === b0.sw, tag, "hover đổi kích thước hộp bố cục");
        /* 8 phần tử chủ chốt: hover đổi style trong 300ms, không đổi hộp */
        for (const sel of [".btn.big", ".door.pop", ".door.night", ".gcard", ".feat", ".plan.best", ".faq details", ".lang", ".links a"]) {
          const el = await pg.$(sel); if (!el) continue; await el.evaluate(e => e.scrollIntoView({ block: "center", behavior: "instant" })); await pg.mouse.move(2, 2); await wait(300);
          const g = () => el.evaluate(e => { const c = getComputedStyle(e); return { t: c.transform, s: c.boxShadow, b: c.borderColor, bg: c.backgroundColor + c.backgroundPosition, w: e.offsetWidth, h: e.offsetHeight, sw: document.documentElement.scrollWidth }; });
          const a0 = await g(); const rb = await el.boundingBox(); if (!rb || rb.width < 4) continue; await pg.mouse.move(rb.x + rb.width / 2, rb.y + rb.height / 2); await wait(300); const a1 = await g();
          note(a0.t !== a1.t || a0.s !== a1.s || a0.b !== a1.b || a0.bg !== a1.bg, tag, `hover ${sel} không đổi style`); note(a0.w === a1.w && a0.h === a1.h && a0.sw === a1.sw, tag, `hover ${sel} đổi hộp bố cục ${a0.w}x${a0.h}->${a1.w}x${a1.h}`);
        }
        /* focus-visible: outline >= 2px */
        await pg.mouse.move(2, 2); await pg.keyboard.press("Tab"); for (let i = 0; i < 3; i++) await pg.keyboard.press("Tab");
        const fo = await pg.evaluate(() => { const c = getComputedStyle(document.activeElement); return { w: parseFloat(c.outlineWidth), st: c.outlineStyle }; }); note(fo.w >= 2 && fo.st !== "none", tag, "focus-visible thiếu outline >= 2px: " + JSON.stringify(fo));
      }
      await pg.close();
    }
    for (const l of ["vi", "en"]) {   /* giảm chuyển động: dải không tự chạy, cuộn tay có snap, hover không transform; (hover:none): không áp hover */
      const pg = await br.newPage(), tag = "dải game reduced " + l; await pg.setViewport({ width: 1440, height: 900 }); await pg.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]); await pg.goto(B + PAGES[l], { waitUntil: "load" }); await wait(400);
      const r = await pg.evaluate(() => { const tr = document.querySelector(".mtrack"), mq = document.querySelector(".marq"); return { an: getComputedStyle(tr).animationName, sn: getComputedStyle(mq).scrollSnapType, ov: getComputedStyle(mq).overflowX }; }); note(r.an === "none" && /x/.test(r.sn) && r.ov === "auto", tag, "reduced-motion: dải phải đứng yên, cuộn tay + snap: " + JSON.stringify(r));
      const mi = await pg.$(".mi:nth-child(3)"), bb = await mi.boundingBox(); await pg.mouse.move(bb.x + 20, bb.y + 20); await wait(300); note(await mi.evaluate(e => getComputedStyle(e).transform === "none"), tag, "reduced-motion: hover vẫn transform"); await pg.close();
    }
    /* ĐIỆN THOẠI THẬT: cảm ứng, DPR3, CPU x4/x6: vệ tinh phải DI CHUYỂN sau 2s; sau chạm-nhả, pointercancel, cuộn trang vẫn tự quay lại <= 3s; hạ cấp không dừng vòng quay */
    for (const rate of [1, 4, 6]) for (const pth of ["/", "/en/"]) {
      const tag = "landing mobile x" + rate + " " + pth, pg = await br.newPage(), errs = []; await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
      pg.on("pageerror", e => errs.push(String(e))); const cd = await pg.createCDPSession(); await cd.send("Emulation.setCPUThrottlingRate", { rate });
      await pg.goto(B + pth + "?debug", { waitUntil: "load" }); await pg.evaluate(() => { const o = document.getElementById("orbsys"); o.scrollIntoView({ block: "center", behavior: "instant" }); });
      const P = () => pg.evaluate(() => [...document.querySelectorAll(".sat")].map(e => e.style.transform).join("|")), R = () => pg.evaluate(() => window.__npOrbit.reason());
      const moved = async (ms, what) => { const a = await P(); await wait(ms); const b = await P(); note(a !== b, tag, what + ": vệ tinh đứng yên (" + await R() + ")"); };
      await wait(1500); await moved(1200, "sau 2s");
      const bb = await (await pg.$(".sat.night")).boundingBox();
      await pg.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2).catch(() => {}); await wait(1000);
      if (/\/(popplay|cozyplay)\//.test(pg.url())) { await pg.goBack({ waitUntil: "load" }).catch(() => {}); await wait(1500); await pg.evaluate(() => document.getElementById("orbsys").scrollIntoView({ block: "center", behavior: "instant" })); await moved(1200, "sau khi quay lại (Back) từ game"); }
      else { await wait(2200); await moved(900, "sau chạm-nhả"); }
      await pg.evaluate(() => { const st = document.querySelector(".orbstage"), r = st.getBoundingClientRect(); const h = document.querySelector(".hit"); h.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 7, pointerType: "touch", clientX: r.left + r.width / 2, clientY: r.top + 40 })); h.dispatchEvent(new PointerEvent("pointercancel", { bubbles: true, pointerId: 7, pointerType: "touch" })); });
      await wait(2500); await moved(900, "sau pointercancel");
      await pg.evaluate(() => { window.scrollBy(0, 80); window.scrollBy(0, -80); }); await wait(1500); await moved(900, "sau cuộn trang");
      await pg.evaluate(() => window.__npOrbit.setLite(true)); note(await pg.evaluate(() => window.__npOrbit.reason()).then(r => /degraded/.test(r)), tag, "reason() phải báo degraded"); await moved(900, "khi degraded (hạ cấp không được dừng vòng quay; có thể tự phục hồi khi FPS tốt)"); note(!errs.length, tag, "lỗi JS: " + errs[0]);
      await pg.close();
    }
    note(weight > 0 && weight < 300 * 1024, "trọng lượng", "tải trang đầu " + Math.round(weight / 1024) + " KB (cần < 300 KB; chưa nén)");
    console.log("  trọng lượng trang VI 390 (chưa nén, gồm shared/theme+site+track): " + Math.round(weight / 1024) + " KB");
  } finally { await br.close(); srv.kill(); fs.rmSync(dist, { recursive: true, force: true }); }
  console.log("\n" + (fails.length ? "✗ landing: " + fails.length + " lỗi" : "✓ landing đạt"));
  process.exit(fails.length ? 1 : 0);
})();
