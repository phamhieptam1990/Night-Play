/* Kiểm tra trang landing giới thiệu (landing/gioi-thieu, docs/LANDING-PAGE-BRIEF.md). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-landing.js [--quick] [--shots=<thư mục ảnh>]
   Tự chạy build (DIST_DIR tạm, SITE_TARGET=hub) rồi serve bản dist đó qua http.server cổng trống tự chọn: kiểm tra đúng thứ sẽ được triển khai.
   Điều kiện:
     - dist có /gioi-thieu/, /gioi-thieu/en/, landing.css/js, img/og.png (1200x630), sitemap.xml (đủ URL, hết __BUILD_DATE__), robots.txt; /shared/theme.css với tới được;
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
const PAGES = { vi: "/gioi-thieu/", en: "/gioi-thieu/en/" };
const SIZES = quick ? [[360, 640], [390, 844], [1440, 900]] : [[320, 568], [360, 640], [390, 844], [768, 1024], [1024, 768], [1440, 900]];

(async () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), "landing-dist-"));
  const bd = spawnSync(process.execPath, [path.join(root, "scripts", "build.js")], { cwd: root, env: Object.assign({}, process.env, { DIST_DIR: dist, SITE_TARGET: "hub" }), encoding: "utf8" });
  note(bd.status === 0, "build", "scripts/build.js lỗi: " + (bd.stderr || "").slice(0, 200));
  const R = f => path.join(dist, f);
  /* 1) file trong dist */
  for (const f of ["gioi-thieu/index.html", "gioi-thieu/en/index.html", "gioi-thieu/landing.css", "gioi-thieu/landing.js", "gioi-thieu/img/og.png", "gioi-thieu/img/logo.svg", "sitemap.xml", "robots.txt", "shared/theme.css", "shared/track.js", "shared/site.js", "index.html", "sw.js"])
    note(fs.existsSync(R(f)), "dist", "thiếu " + f);
  try { const b = fs.readFileSync(R("gioi-thieu/img/og.png")); note(b.readUInt32BE(16) === 1200 && b.readUInt32BE(20) === 630, "og.png", "phải 1200x630"); note(b.length <= 120 * 1024, "og.png", "nặng " + b.length + " > 120KB"); } catch (e) {}
  const sm = fs.existsSync(R("sitemap.xml")) ? fs.readFileSync(R("sitemap.xml"), "utf8") : "";
  note(!/__BUILD_DATE__/.test(sm) && /<lastmod>\d{4}-\d\d-\d\d<\/lastmod>/.test(sm), "sitemap", "chưa thay ngày build");
  for (const u of ["/", "/gioi-thieu/", "/gioi-thieu/en/", "/popplay/", "/cozyplay/", "/subscribe.html", "/privacy.html", "/terms.html"]) note(sm.includes("<loc>https://nightplay.vn" + u + "</loc>"), "sitemap", "thiếu " + u);
  note((sm.match(/<urlset/g) || []).length === 1 && (sm.match(/<url>/g) || []).length === (sm.match(/<\/url>/g) || []).length, "sitemap", "XML hỏng");
  const rb = fs.existsSync(R("robots.txt")) ? fs.readFileSync(R("robots.txt"), "utf8") : "";
  for (const l of ["User-agent: *", "Allow: /", "Disallow: /admin/", "Disallow: /api/", "Sitemap: https://nightplay.vn/sitemap.xml"]) note(rb.includes(l), "robots", "thiếu dòng: " + l);

  /* 2) nội dung HTML tĩnh */
  const src = {}; let plans = {};
  try { const a = fs.readFileSync(path.join(root, "server", "app.js"), "utf8"); for (const m of a.matchAll(/(day|week|month|year):\s*\{\s*amount:\s*(\d+),\s*days:\s*(\d+)/g)) plans[m[1]] = { amount: +m[2], days: +m[3] }; } catch (e) {}
  note(Object.keys(plans).length === 4, "giá", "không đọc được PLANS từ server/app.js");
  const gameIds = new Set(); try { for (const m of fs.readFileSync(path.join(root, "shared", "multi-games.js"), "utf8").matchAll(/^\s*"([a-z0-9-]+)":\s*\{\s*portal:/gm)) gameIds.add(m[1]); } catch (e) {}
  note(gameIds.size >= 32, "game", "đọc multi-games.js chỉ được " + gameIds.size + " game");
  const fmtVi = n => n.toLocaleString("de-DE") + "đ", fmtEn = n => n.toLocaleString("en-US") + " VND";
  for (const l of ["vi", "en"]) {
    const f = path.join("gioi-thieu", l === "en" ? "en" : "", "index.html"), h = fs.existsSync(R(f)) ? fs.readFileSync(R(f), "utf8") : ""; src[l] = h;
    const tg = "html " + l;
    note(!/\[CẦN/.test(h), tg, "còn placeholder [CẦN ...] trong HTML");
    note(!/phamhieptam/.test(h), tg, "còn email cũ");
    note((h.match(/<h1[ >]/g) || []).length === 1, tg, "phải đúng một <h1>");
    note(new RegExp('<html lang="' + l + '"').test(h), tg, "lang sai");
    const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || ""; note(title && [...title].length <= 60, tg, "title rỗng hoặc > 60 ký tự (" + [...title].length + ")");
    const desc = ((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "").replace(/&amp;/g, "&"); note([...desc].length >= 140 && [...desc].length <= 160, tg, "description " + [...desc].length + " ký tự (cần 140-160)");
    const canon = l === "vi" ? "https://nightplay.vn/gioi-thieu/" : "https://nightplay.vn/gioi-thieu/en/";
    note(h.includes('<link rel="canonical" href="' + canon + '">'), tg, "canonical sai");
    for (const x of ['hreflang="vi" href="https://nightplay.vn/gioi-thieu/"', 'hreflang="en" href="https://nightplay.vn/gioi-thieu/en/"', 'hreflang="x-default" href="https://nightplay.vn/gioi-thieu/"', 'property="og:image" content="https://nightplay.vn/gioi-thieu/img/og.png"', 'property="og:locale" content="' + (l === "vi" ? "vi_VN" : "en_US") + '"', 'property="og:locale:alternate"', 'name="twitter:card" content="summary_large_image"', 'name="twitter:image"', 'property="og:url" content="' + canon + '"', 'name="theme-color"', 'rel="icon"']) note(h.includes(x), tg, "thiếu meta: " + x);
    note(!/cookie\s*=/.test(h + fs.readFileSync(R("gioi-thieu/landing.js"), "utf8")), tg, "mã có ghi cookie");
    /* tên miền ngoài trong src/href/url() (trừ canonical/og/hreflang/JSON-LD và liên kết thông tin) */
    const bad = [...h.matchAll(/<(?:script|link|img|iframe|source|video)\b[^>]*\b(?:src|href)="(https?:)?\/\/[^"]*"/g)].filter(m => !/rel="(canonical|alternate)"/.test(m[0]));
    note(!bad.length, tg, "nhúng tài nguyên ngoài: " + bad.map(m => m[0].slice(0, 80)).join(" | "));
    note(!/url\(\s*["']?https?:/.test(fs.readFileSync(R("gioi-thieu/landing.css"), "utf8")), tg, "CSS tải tài nguyên ngoài");
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
      note(vis.length === 9 && me.length === 9 && me.every((q, i) => q.name === vis[i][0] && q.acceptedAnswer.text === vis[i][1]), tg, "FAQPage không khớp 9 câu hiển thị");
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
        const bgOf = el => { for (let e = el; e; e = e.parentElement) { if (e.classList.contains("world") || e.classList.contains("sticky")) return "skip"; const p = parse(getComputedStyle(e).backgroundColor); if (p && p.a > .9) return p.c; } return [255, 255, 255]; };
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
        note(hh.bottom <= hh.ih + 1, tag, "hero cao quá một màn hình (bottom " + Math.round(hh.bottom) + " > " + hh.ih + ")");
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
    note(weight > 0 && weight < 300 * 1024, "trọng lượng", "tải trang đầu " + Math.round(weight / 1024) + " KB (cần < 300 KB; chưa nén)");
    console.log("  trọng lượng trang VI 390 (chưa nén, gồm shared/theme+site+track): " + Math.round(weight / 1024) + " KB");
  } finally { await br.close(); srv.kill(); fs.rmSync(dist, { recursive: true, force: true }); }
  console.log("\n" + (fails.length ? "✗ landing: " + fails.length + " lỗi" : "✓ landing đạt"));
  process.exit(fails.length ? 1 : 0);
})();
