/* Kiểm tra trang HUB /play/ (play/index.html: hệ quỹ đạo Pop/Night + hai thẻ lối vào; docs/LANDING-PAGE-BRIEF.md mục 8.2b). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-hub.js [--quick] [--shots=<thư mục ảnh>]   (tự chạy http.server cổng trống)
   Mỗi cỡ (320x568 360x640 390x844 430x932 768x1024 1024x768 1194x834 1440x900 667x375 844x390) x sáng/tối x VI/EN:
     - MỘT MÀN HÌNH, KHÔNG CUỘN: html/body/main không cuộn dọc/ngang; header/chân trang/hai thẻ nằm trọn trong màn hình;
     - hai thẻ lối vào cao >= 56px, hiện trọn, không bị che (elementFromPoint), href đúng /popplay/ và /cozyplay/;
     - 12 icon (6 Pop + 6 Night) >= 44px, href trỏ id game CÓ THẬT trong shared/multi-games.js đúng cổng, nhãn aria theo ngôn ngữ;
     - điện thoại dọc: quỹ đạo cao <= 46% màn hình và nằm TRÊN hai thẻ; ngang: quỹ đạo bên trái, thẻ bên phải;
     - nút header/chân trang/âm thanh không bị che, >= 44px; liên kết Giới thiệu/Riêng tư/Điều khoản/Night Pass/Liên hệ có đủ;
     - chuyển động: <= 12 phần tử có transform động, không CSS animation, không CLS; prefers-reduced-motion: đứng yên hoàn toàn;
     - âm thanh MẶC ĐỊNH TẮT: không AudioContext trước khi bấm 🔇; bấm một lần tạo đúng 1 context, bấm lại tắt;
     - chạm một icon mở thẳng game (điện thoại); kéo quỹ đạo làm các icon xoay;
     - localStorage chỉ có theme/lang (không lưu thêm), không request ra ngoài origin, console sạch;
     - OFFLINE: sw.js SHELL có mọi file hub cần (orbit.js/css, multi-games.js, align.css...) và CACHE >= np-shell-v17. */
const { spawn } = require("child_process"), fs = require("fs"), net = require("net"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), fails = [];
const quick = process.argv.includes("--quick");
const shotDir = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8);
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const SIZES = quick ? [[360, 640], [390, 844], [1440, 900], [667, 375]] : [[320, 568], [360, 640], [390, 844], [430, 932], [768, 1024], [1024, 768], [1194, 834], [1440, 900], [667, 375], [844, 390]];
const COMBOS = quick ? [["light", "vi"], ["dark", "en"]] : [["light", "vi"], ["light", "en"], ["dark", "vi"], ["dark", "en"]];
const freePort = () => new Promise(res => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });

(async () => {
  /* ids game thật */
  const ids = {}; for (const m of fs.readFileSync(path.join(root, "shared", "multi-games.js"), "utf8").matchAll(/^\s*"([a-z0-9-]+)":\s*\{\s*portal:\s*"(\w+)"/gm)) ids[m[1]] = m[2];
  note(Object.keys(ids).length >= 32, "game", "đọc multi-games.js chỉ được " + Object.keys(ids).length);

  /* 0) offline: SHELL của sw.js phải có mọi tài nguyên cục bộ của hub */
  const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8"), SH = (() => { try { return eval((sw.match(/const SHELL = (\[[\s\S]*?\]);/) || [])[1]); } catch (e) { return []; } })();
  const cv = +((sw.match(/const CACHE = "np-shell-v(\d+)"/) || [])[1] || 0); note(cv >= 18, "sw.js", "CACHE phải >= np-shell-v18 (đang v" + cv + ")");
  const html = fs.readFileSync(path.join(root, "play", "index.html"), "utf8");
  const local = new Set(); for (const m of html.matchAll(/(?:src|href)="(\.\.\/(?:shared|manifest)[^"?#]*)"/g)) local.add("/" + m[1].replace(/^\.\.\//, ""));
  for (const m of html.matchAll(/class="sat \w+"[^>]*href="\.\.\/\w+\/index\.html#([a-z0-9-]+)"/g)) { local.add("/shared/orbit-icons/" + m[1] + ".svg"); note(fs.existsSync(path.join(root, "shared", "orbit-icons", m[1] + ".svg")), "icon", "thiếu ảnh shared/orbit-icons/" + m[1] + ".svg (chạy scripts/gen-orbit-icons.js)"); }
  local.add("/play/index.html"); local.add("/cozyplay/index.html"); local.add("/popplay/index.html");
  for (const f of local) if (!/manifest|app-180/.test(f)) note(SH.includes(f), "offline", "SHELL của sw.js thiếu " + f);
  note(!/(src|href)="https?:\/\//.test(html.replace(/xmlns='[^']*'/g, "")), "hub", "hub nhúng tài nguyên ngoài");

  const PORT = await freePort(), srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const B = "http://localhost:" + PORT;
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  try {
    for (const [w, h] of SIZES) for (const [th, lang] of COMBOS) {
      const tag = `hub ${w}x${h} ${th} ${lang}`, touch = Math.min(w, h) < 520 || (w === 768 && h === 1024);
      const pg = await br.newPage(), errs = [], ext = [];
      await pg.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: touch, hasTouch: touch });
      pg.on("console", m => { if ((m.type() === "error" || m.type() === "warning") && !/status of 501/.test(m.text())) errs.push(m.text()); }); pg.on("pageerror", e => errs.push(String(e))); pg.on("requestfailed", r => errs.push("requestfailed " + r.url()));
      pg.on("request", r => { if (!r.url().startsWith(B) && !r.url().startsWith("data:") && !/fonts\.(googleapis|gstatic)\.com/.test(r.url())) ext.push(r.url()); });
      await pg.evaluateOnNewDocument((t, l) => {
        try { localStorage.setItem("theme", t); localStorage.setItem("lang", l); } catch (e) {}
        window.__acs = 0; const A = window.AudioContext; if (A) window.AudioContext = function () { window.__acs++; return new A(); };
        window.__cls = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); } catch (e) {}
      }, th, lang);
      await pg.goto(B + "/play/index.html?debug", { waitUntil: "load" }); await wait(700);
      const m = await pg.evaluate(() => {
        const q = s => [...document.querySelectorAll(s)], bx = e => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height }; };
        const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && s.visibility !== "hidden" && s.display !== "none" && !e.closest("[hidden]"); };
        const hit = e => { const r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, t = document.elementFromPoint(x, y); return !!t && (e === t || e.contains(t) || t.contains(e)); };
        const de = document.documentElement, main = document.querySelector("main"), st = document.querySelector(".orbstage"), doors = q(".world");
        const txt = e => (e.textContent || "").trim();
        return {
          vw: de.clientWidth, vh: innerHeight, th: de.dataset.theme, lg: de.lang,
          sy: Math.max(de.scrollHeight, document.body.scrollHeight) - innerHeight, sx: de.scrollWidth - de.clientWidth, my: main.scrollHeight - main.clientHeight, mx: main.scrollWidth - main.clientWidth,
          stage: bx(st), doors: doors.map(e => Object.assign(bx(e), { id: e.id, href: e.getAttribute("href"), hit: hit(e), vis: vis(e), txt: txt(e) })),
          sats: q("a.sat").map(e => ({ href: e.getAttribute("href"), w: e.offsetWidth, h: e.offsetHeight, label: e.getAttribute("aria-label"), pop: e.classList.contains("pop") })),
          nav: q("nav.nav .tools > *, nav.nav .mark").filter(vis).map(e => Object.assign(bx(e), { id: e.id || e.className, hit: hit(e) })),
          navB: bx(document.querySelector("nav.nav")), foot: bx(document.querySelector(".foot")),
          snd: (() => { const b = document.querySelector(".orbsnd"); return Object.assign(bx(b), { hid: b.hidden, p: b.getAttribute("aria-pressed"), l: b.getAttribute("aria-label"), hit: hit(b) }); })(),
          links: { about: q("#aboutLink")[0] && q("#aboutLink")[0].getAttribute("href"), priv: !!q('a[href$="privacy.html"]').length, terms: !!q('a[href$="terms.html"]').length, pass: !!q('a[href*="subscribe.html"]').length, mail: !!q('a[href^="mailto:"]').length },
          flink: q(".foot a, .foot .bars-more").filter(vis).map(e => Object.assign(bx(e), { id: e.id || e.className, hit: hit(e) })),
          moving: q("[style*=transform]").length, anims: document.getAnimations().filter(a => a instanceof CSSAnimation && a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest("#orbsys,.world")).length, cls: window.__cls, acs: window.__acs, dbAcs: window.__npOrbit && window.__npOrbit.ctxCount,
          keys: Object.keys(localStorage), h1: txt(document.getElementById("h1")), ph: document.querySelector(".world.pop .tag").textContent
        };
      });
      const eps = 1.5;
      note(m.th === th && m.lg === lang, tag, `theme/lang sai ${m.th}/${m.lg}`);
      note(m.sy <= 0 && m.sx <= 0 && m.my <= 1 && m.mx <= 0, tag, `CUỘN: dọc ${m.sy}, ngang ${m.sx}, main ${m.my}/${m.mx}`);
      note(m.navB.t >= -0.5 && m.foot.b <= m.vh + 0.5, tag, `header/chân trang ra ngoài màn hình ${m.navB.t}/${m.foot.b}>${m.vh}`);
      note(m.doors.length === 2 && m.doors[0].href.endsWith("popplay/index.html") && m.doors[1].href.endsWith("cozyplay/index.html"), tag, "hai thẻ phải trỏ popplay / cozyplay: " + m.doors.map(d => d.href));
      m.doors.forEach(d => { note(d.h >= 56 - 0.5, tag, `thẻ ${d.id} cao ${d.h.toFixed(1)} < 56`); note(d.l >= 16 - eps && d.r <= m.vw - 16 + eps && d.t >= 0 && d.b <= m.vh + 0.5, tag, `thẻ ${d.id} không trọn trong lề 16px: ${d.l.toFixed(0)}-${d.r.toFixed(0)} x ${d.t.toFixed(0)}-${d.b.toFixed(0)}`); note(d.hit && d.vis, tag, `thẻ ${d.id} bị che`); });
      note(m.sats.length === 12 && m.sats.filter(s => s.pop).length === 6, tag, "cần 12 icon (6 Pop + 6 Night), có " + m.sats.length);
      m.sats.forEach(s => { const mm = s.href.match(/\.\.\/(popplay|cozyplay)\/index\.html#([a-z0-9-]+)$/); note(mm && ids[mm[2]] === mm[1], tag, "icon trỏ id không có thật/sai cổng: " + s.href); note(s.w >= 44 && s.h >= 44, tag, "icon nhỏ " + s.w + "x" + s.h); note(new RegExp("^" + (lang === "vi" ? "Chơi " : "Play ")).test(s.label || ""), tag, "nhãn icon sai ngôn ngữ: " + s.label); });
      note(m.stage.l >= -1 && m.stage.r <= m.vw + 1 && m.stage.b <= m.vh + 1, tag, "quỹ đạo tràn màn hình");
      const land = m.vw / m.vh >= 1.1, d0 = m.doors[0], d1 = m.doors[1];
      if (land) { note(m.stage.r <= d0.l + 1 && d1.l >= m.stage.r - 1, tag, "ngang: quỹ đạo phải ở bên trái thẻ"); } else { note(m.stage.b <= d0.t + 1, tag, "dọc: quỹ đạo phải nằm trên thẻ"); if (m.vw < 700) note(m.stage.h <= m.vh * 0.46 + 1, tag, `quỹ đạo cao ${m.stage.h.toFixed(0)} > 46% (${(m.vh * 0.46).toFixed(0)})`); }
      m.nav.forEach(n => { note(n.hit, tag, "nút header bị che: " + n.id); note(n.h >= 43.5, tag, "nút header nhỏ: " + n.id); }); m.flink.forEach(n => { note(n.hit, tag, "liên kết chân trang bị che: " + n.id); });
      note(!m.snd.hid && m.snd.w >= 44 && m.snd.p === "false" && m.snd.hit, tag, "nút âm thanh: " + JSON.stringify(m.snd));
      note(m.snd.l === (lang === "vi" ? "Bật âm thanh quỹ đạo" : "Turn orbit sound on"), tag, "nhãn nút âm thanh: " + m.snd.l);
      note(m.links.about === (lang === "vi" ? "/?landing=1" : "/en/?landing=1") && m.links.priv && m.links.terms && m.links.pass && m.links.mail, tag, "thiếu liên kết: " + JSON.stringify(m.links));
      note(m.moving <= 14 && m.anims <= 2, tag, `chuyển động: ${m.moving} phần tử transform + ${m.anims} CSS animation giả (tổng phải <= 14, animation <= 2: cực quang + sao băng)`); note(m.moving + m.anims <= 14, tag, `tổng phần tử chuyển động ${m.moving + m.anims} > 14`);
      note(m.cls < 0.02, tag, "CLS " + m.cls.toFixed(3));
      { /* 3D: phía trước to hơn phía sau >= 1.25x, z-index đúng thứ tự so với hành tinh (z 3), có nhãn tên cho vệ tinh trước nhất, có gợi ý kéo, có vệ tinh vàng "hôm nay" */
        const dp = await pg.evaluate(() => { const S = window.__npOrbit.sats(), pz = +getComputedStyle(document.querySelector(".planet")).zIndex, hint = document.querySelector(".orbhint"), gold = document.querySelectorAll(".sat.gold").length, lab = document.querySelectorAll(".sat.lab").length, bdg = (document.querySelector(".sat.gold .bdg") || {}).textContent;
          const fr = S.filter(s => s.k > 0.6), bk = S.filter(s => s.k < -0.6); return { pz, ratio: fr.length && bk.length ? (fr.reduce((a, s) => a + s.w, 0) / fr.length) / (bk.reduce((a, s) => a + s.w, 0) / bk.length) : 0, badZ: S.filter(s => (s.k > 0 && s.z <= pz) || (s.k < 0 && s.z >= pz)).length, hint: !!hint && hint.textContent.trim(), gold, lab, bdg }; });
        note(dp.ratio >= 1.25, tag, "vệ tinh phía trước phải lớn hơn phía sau >= 1.25x, đang " + dp.ratio.toFixed(2)); note(dp.badZ === 0, tag, dp.badZ + " vệ tinh sai thứ tự lớp so với hành tinh (sau phải dưới, trước phải trên)");
        note(dp.hint === (lang === "vi" ? "Kéo để xoay · Chạm để chơi" : "Drag to spin · Tap to play"), tag, "gợi ý kéo: " + dp.hint); note(dp.gold === 1 && dp.bdg === (lang === "vi" ? "Hôm nay" : "Today"), tag, "vệ tinh vàng hôm nay: " + JSON.stringify(dp)); note(dp.lab >= 1, tag, "không có nhãn tên cho vệ tinh phía trước");
      }
      note(m.acs === 0 && m.dbAcs === 0, tag, `AudioContext đã tạo trước khi bấm (${m.acs}/${m.dbAcs})`);
      note(m.keys.every(k => k === "theme" || k === "lang" || /^np[-_]/.test(k)), tag, "localStorage có khoá lạ: " + m.keys);
      note(m.h1.length > 3, tag, "thiếu h1 (có thể ẩn bằng CSS nhưng phải có chữ)");
      if (th === "light" && lang === "vi" || shotDir) { /* không đo màu nữa: chỉ chụp ảnh */ }
      if (shotDir) { fs.mkdirSync(shotDir, { recursive: true }); await pg.screenshot({ path: path.join(shotDir, `hub-${w}x${h}-${th}-${lang}.png`) }); }

      /* chỉ một lượt cho mỗi cỡ: hành vi tương tác */
      if (th === COMBOS[0][0] && lang === COMBOS[0][1]) {
        /* kéo quỹ đạo Night (chuột): icon phải đổi vị trí */
        if (!touch) {
          const before = await pg.evaluate(() => [...document.querySelectorAll(".sat.night")].map(e => e.style.transform).join("|"));
          const r = await pg.evaluate(() => { const s = document.querySelector(".orbstage").getBoundingClientRect(), U = s.width / 600, th = 18 * Math.PI / 180, f = ph => { const ex = 262 * Math.cos(ph), ey = 140 * Math.sin(ph); return [s.left + (300 + ex * Math.cos(th) - ey * Math.sin(th)) * U, s.top + (250 + ex * Math.sin(th) + ey * Math.cos(th)) * U]; }; return [f(0.9), f(1.4), f(1.9)]; });
          await pg.mouse.move(r[0][0], r[0][1]); await pg.mouse.down(); await pg.mouse.move(r[1][0], r[1][1], { steps: 6 }); await pg.mouse.move(r[2][0], r[2][1], { steps: 6 }); await pg.mouse.up(); await wait(100);
          const after = await pg.evaluate(() => [...document.querySelectorAll(".sat.night")].map(e => e.style.transform).join("|"));
          note(before !== after, tag, "kéo quỹ đạo Night không làm icon xoay");
          /* rê vào thẻ Pop: thẻ sáng (.on) */
          const pb = await (await pg.$("#aPop")).boundingBox(); await pg.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2); await wait(250);
          note(await pg.evaluate(() => document.getElementById("aPop").classList.contains("on")), tag, "rê vào thẻ Pop mà thẻ không sáng");
        }
        /* âm thanh: bấm bật → 1 context, bấm tắt */
        await pg.click(".orbsnd"); await wait(250);
        const s1 = await pg.evaluate(() => ({ p: document.querySelector(".orbsnd").getAttribute("aria-pressed"), c: window.__acs, l: document.querySelector(".orbsnd").getAttribute("aria-label") }));
        note(s1.p === "true" && s1.c === 1, tag, "bấm 🔇 phải bật và tạo đúng 1 AudioContext: " + JSON.stringify(s1));
        await pg.click(".orbsnd"); await wait(200); note(await pg.evaluate(() => document.querySelector(".orbsnd").getAttribute("aria-pressed") === "false"), tag, "bấm lần hai phải tắt âm");
        /* tab ẩn: vòng lặp ngủ (frames không tăng) */
        await pg.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, get: () => true }); document.dispatchEvent(new Event("visibilitychange")); }); await wait(150);
        const f0 = await pg.evaluate(() => window.__npOrbit.frames); await wait(400); const f1 = await pg.evaluate(() => window.__npOrbit.frames); note(f1 - f0 <= 1, tag, `tab ẩn mà vẫn chạy ${f1 - f0} khung`);
        /* chạm icon: mở thẳng game */
        if (touch) {
          const href = await pg.evaluate(() => { const a = document.querySelector("a.sat.night"); return a.getAttribute("href"); });
          await pg.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, get: () => false }); document.dispatchEvent(new Event("visibilitychange")); });
          const bb = await pg.evaluate(() => { const r = document.querySelector("a.sat.night").getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
          const nav = pg.waitForNavigation({ timeout: 3000 }).catch(() => null); await pg.touchscreen.tap(bb[0], bb[1]); await nav;
          note(pg.url().includes("/cozyplay/") && pg.url().endsWith("#" + href.split("#")[1]) , tag, "chạm icon Night không mở thẳng game: " + pg.url() + " vs " + href);
        }
      }
      note(!errs.length, tag, "console/request lỗi: " + errs.slice(0, 2).join(" | ")); note(!ext.length, tag, "request ra ngoài origin: " + ext.slice(0, 2));
      await pg.close();
    }

    /* FPS: máy tính >= 50fps và không long task > 100ms; giả lập CPU x4 vẫn >= 24fps (hạ cấp tự động nếu chậm) */
    for (const [rate, minFps] of [[1, 50], [4, 24]]) {
      const tag = "hub fps x" + rate, pg = await br.newPage(); await pg.setViewport({ width: 1440, height: 900 }); const cd = await pg.createCDPSession(); await cd.send("Emulation.setCPUThrottlingRate", { rate });
      await pg.evaluateOnNewDocument(() => { window.__lt = 0; try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lt = Math.max(window.__lt, e.duration); }).observe({ type: "longtask", buffered: true }); } catch (e) {} });
      await pg.goto(B + "/play/index.html?debug", { waitUntil: "load" }); await wait(800);
      const f = await pg.evaluate(() => new Promise(res => { let n = 0, t0 = performance.now(); const tick = t => { n++; if (t - t0 < 2500) requestAnimationFrame(tick); else res({ fps: n / ((t - t0) / 1000), lt: window.__lt, lite: window.__npOrbit.lite }); }; requestAnimationFrame(tick); }));
      note(f.fps >= minFps, tag, `FPS ${f.fps.toFixed(1)} < ${minFps} (lite=${f.lite})`); if (rate === 1) note(f.lt <= 100, tag, "long task " + f.lt.toFixed(0) + "ms > 100"); await pg.close();
    }
    /* ĐIỆN THOẠI THẬT: cảm ứng, DPR3, CPU x4/x6: vệ tinh phải DI CHUYỂN sau 2s; sau chạm-nhả, pointercancel, cuộn trang vẫn tự quay lại <= 3s; hạ cấp không dừng vòng quay */
    for (const rate of [1, 4, 6]) for (const pth of ["/play/index.html"]) {
      const tag = "hub mobile x" + rate + " " + pth, pg = await br.newPage(), errs = []; await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
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
    /* reduced-motion: một lượt ở 390x844 và 1440x900 */
    for (const [w, h] of [[390, 844], [1440, 900]]) {
      const tag = `hub reduced ${w}x${h}`, pg = await br.newPage(); await pg.setViewport({ width: w, height: h });
      await pg.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      await pg.goto(B + "/play/index.html?debug", { waitUntil: "load" }); await wait(400);
      const a = await pg.evaluate(() => [...document.querySelectorAll(".sat")].map(e => e.style.transform).join("|")); await wait(900);
      const b = await pg.evaluate(() => ({ t: [...document.querySelectorAll(".sat")].map(e => e.style.transform).join("|"), an: document.getAnimations().length, fr: window.__npOrbit.frames, red: window.__npOrbit.reduced, tr: getComputedStyle(document.getElementById("aPop")).transitionDuration }));
      note(await pg.evaluate(() => { const b = document.querySelector(".orbplay"); return !!b && !b.hidden && b.offsetHeight >= 44; }), tag, "reduced-motion phải có nút ▶ Chạy hiệu ứng (>=44px)");
      note(a === b.t && b.an === 0 && b.red && b.fr < 5 && /^0s/.test(b.tr), tag, "giảm chuyển động nhưng vẫn động: " + JSON.stringify({ same: a === b.t, an: b.an, fr: b.fr, red: b.red, tr: b.tr }));
      await pg.close();
    }
    /* ván dở: chip "Chơi tiếp" hiện, không gây cuộn */
    for (const [w, h] of [[320, 568], [667, 375], [1440, 900]]) {
      const tag = `hub resume ${w}x${h}`, pg = await br.newPage(); await pg.setViewport({ width: w, height: h });
      await pg.evaluateOnNewDocument(() => { try { localStorage.setItem("np-resume:dap-deadline", JSON.stringify({ ts: Date.now() - 60000, state: { a: 1 } })); } catch (e) {} });
      await pg.goto(B + "/play/index.html", { waitUntil: "load" }); await wait(500);
      const r = await pg.evaluate(() => { const c = document.getElementById("resume"), m = document.querySelector("main"); return { on: c.classList.contains("on"), href: c.getAttribute("href"), sy: m.scrollHeight - m.clientHeight, h: c.getBoundingClientRect().height }; });
      note(r.sy <= 1, tag, "chip ván dở làm hub tràn " + r.sy); note(!r.on || (r.href.endsWith("cozyplay/index.html#dap-deadline") && r.h >= 44), tag, "chip sai: " + JSON.stringify(r));
      if (w >= 667) note(r.on, tag, "đủ chỗ mà chip ván dở không hiện");
      await pg.close();
    }
  } finally { await br.close(); srv.kill(); }
  console.log(fails.length ? "\n✗ " + fails.length + " lỗi (hub)" : "\n✓ hub đạt");
  process.exit(fails.length ? 1 : 0);
})();
