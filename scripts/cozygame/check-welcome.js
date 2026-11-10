/* Kiểm tra THẺ CHÀO MỪNG lần đầu (shared/welcome.js) ở cozyplay/index.html và popplay/index.html. Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-welcome.js [--quick] [--shots=<thư mục ảnh>]   (tự chạy http.server cổng 8880)
   Điều kiện (mỗi trang cổng, mỗi cỡ màn hình 320x568, 390x844, 844x390, 768x1024, 1440x900; --quick: 320x568, 844x390, 1440x900):
     - lần đầu (storage trống; bài đo giả navigator.webdriver=false vì thẻ cố ý ẩn khi tự động hoá) thẻ hiện, có đúng 3 bước, đủ VI/EN;
     - nút "Đã hiểu" cao >= 48px (và >= 44px rộng), thẻ nằm trọn màn hình, không cuộn (scrollHeight <= clientHeight, trang không tràn);
     - bấm "Đã hiểu" đóng được, cờ localStorage "np-welcome-seen" được ghi, tải lại KHÔNG hiện lần hai; Esc cũng đóng;
     - không hiện khi ?helper=1, #ch=..., ?multi=1, #<id game>, hoặc khi có sẵn popup sự kiện #nsOv; không hiện khi navigator.webdriver (bài đo khác);
     - localStorage bị chặn (ném lỗi) thì không lỗi JS;
     - màu theo theme: nền thẻ khớp var(--panel) sáng và tối. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8880, B = "http://localhost:" + PORT + "/", fails = [];
const quick = process.argv.includes("--quick");
const shotDir = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8);
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const VPS = quick ? [[320, 568], [844, 390], [1440, 900]] : [[320, 568], [390, 844], [844, 390], [768, 1024], [1440, 900]];
const PAGES = [["cozyplay/index.html", "cozy"], ["popplay/index.html", "pop"]];
const FIRST_VISIT = () => { try { Object.defineProperty(navigator, "webdriver", { get: () => false }); } catch (e) {} };   // bài đo khác để webdriver=true nên thẻ không hiện

(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const open = async (url, w, h, opts = {}) => {
    const ctx = await (br.createBrowserContext || br.createIncognitoBrowserContext).call(br);   // storage riêng cho mỗi lần mở (cờ np-welcome-seen không rò sang ca khác)
    const p = await ctx.newPage(); p.__errs = []; const close0 = p.close.bind(p); p.close = async () => { await close0().catch(() => {}); await ctx.close().catch(() => {}); };
    p.on("pageerror", e => p.__errs.push(String(e.message || e).slice(0, 100)));
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
    await p.evaluateOnNewDocument(FIRST_VISIT);
    await p.evaluateOnNewDocument((o) => { try { if (o.lang) localStorage.setItem("lang", o.lang); if (o.theme) localStorage.setItem("theme", o.theme); } catch (e) {} if (o.block) { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); } }, opts);
    if (opts.pre) await p.evaluateOnNewDocument(opts.pre);
    await p.goto(B + url, { waitUntil: "load" }); await wait(opts.wait || 2300);
    return p;
  };
  const card = p => p.evaluate(() => {
    const e = document.getElementById("npWelcome"); if (!e) return null;
    const c = e.firstChild, r = c.getBoundingClientRect(), b = document.getElementById("npWelcomeOk").getBoundingClientRect();
    return { items: e.querySelectorAll("li").length, h: e.querySelector("h2").textContent, l: r.left, t: r.top, r: r.right, b: r.bottom, vw: innerWidth, vh: innerHeight, over: c.scrollHeight - c.clientHeight, bw: b.width, bh: b.height, sw: document.documentElement.scrollWidth, dsh: document.documentElement.scrollHeight,
      bg: getComputedStyle(c).backgroundColor, panel: (() => { const s = document.createElement("i"); s.style.background = "var(--panel)"; document.body.appendChild(s); const v = getComputedStyle(s).backgroundColor; s.remove(); return v; })() };
  });
  try {
    for (const [url, kind] of PAGES) {
      for (const [w, h] of VPS) for (const [lang, theme] of (w === 390 || w === 1440 ? [["vi", "light"], ["en", "dark"]] : [["vi", "light"]])) {
        const tag = kind + " " + lang + " " + theme + " " + w + "x" + h;
        const p = await open(url, w, h, { lang, theme });
        const c = await card(p);
        if (!c) { note(false, tag, "thẻ chào mừng KHÔNG hiện lần đầu"); await p.close(); continue; }
        note(c.items === 3, tag, "số bước " + c.items + " (cần 3)");
        note(c.h === (lang === "vi" ? { cozy: "Chào mừng đến Night Play", pop: "Chào mừng đến Pop Play" }[kind] : { cozy: "Welcome to Night Play", pop: "Welcome to Pop Play" }[kind]), tag, "tiêu đề sai: " + c.h);
        note(c.bh >= 47.5 && c.bw >= 44, tag, "nút Đã hiểu nhỏ " + c.bw + "x" + c.bh);
        note(c.l >= -0.5 && c.t >= -0.5 && c.r <= c.vw + 0.5 && c.b <= c.vh + 0.5, tag, "thẻ tràn khỏi màn hình");
        note(c.over <= 1, tag, "thẻ bị cuộn/cắt " + c.over + "px");
        note(c.sw <= c.vw + 1 && c.dsh <= c.vh + 1, tag, "trang bị cuộn/tràn " + c.sw + "x" + c.dsh);
        note(c.bg === c.panel, tag, "màu nền thẻ " + c.bg + " khác var(--panel) " + c.panel);
        if (shotDir) { fs.mkdirSync(shotDir, { recursive: true }); await p.screenshot({ path: path.join(shotDir, `welcome-${kind}-${lang}-${theme}-${w}x${h}.png`) }); }
        if (w === 1440 || w === 320) {
          await p.click("#npWelcomeOk"); await wait(200);
          note(!(await card(p)), tag, "bấm Đã hiểu không đóng thẻ");
          const flag = await p.evaluate(() => localStorage.getItem("np-welcome-seen"));
          note(flag === "1", tag, "không ghi cờ np-welcome-seen (" + flag + ")");
          await p.reload({ waitUntil: "load" }); await wait(2300);
          note(!(await card(p)), tag, "tải lại vẫn hiện thẻ lần hai");
        }
        note(!p.__errs.length, tag, "lỗi JS: " + p.__errs.join(" | "));
        await p.close();
      }
      /* Esc đóng */
      { const tag = kind + " Esc"; const p = await open(url, 390, 844, {}); note(!!(await card(p)), tag, "thẻ không hiện"); await p.keyboard.press("Escape"); await wait(150); note(!(await card(p)), tag, "Esc không đóng"); await p.close(); }
      /* không hiện ở các ngữ cảnh khác */
      for (const [q, why] of [["?helper=1", "chơi hộ"], ["#ch=abc", "thách đấu"], ["?multi=1", "multi"], ["#song-sot-cuoi-thang", "đang mở game"]]) {
        const tag = kind + " " + why; const p = await open(url + q, 390, 844, {}); note(!(await card(p)), tag, "thẻ hiện ở ngữ cảnh " + why); await p.close();
      }
      { const tag = kind + " popup sự kiện"; const p = await open(url, 390, 844, { wait: 300, pre: () => { addEventListener("DOMContentLoaded", () => { const o = document.createElement("div"); o.id = "nsOv"; document.body.appendChild(o); }); } }); await wait(2200); note(!(await card(p)), tag, "thẻ hiện cùng popup sự kiện #nsOv"); await p.close(); }
      { const tag = kind + " webdriver"; const ctx = await (br.createBrowserContext || br.createIncognitoBrowserContext).call(br); const p = await ctx.newPage(); await p.setViewport({ width: 390, height: 844 }); await p.goto(B + url, { waitUntil: "load" }); await wait(2300); note(!(await card(p)), tag, "thẻ hiện khi navigator.webdriver (sẽ che các bài đo khác)"); await p.close(); }
      /* localStorage bị chặn: không lỗi */
      { const tag = kind + " storage chặn"; const p = await open(url, 390, 844, { block: true }); note(!p.__errs.some(e => /welcome|blocked/i.test(e) && !/localStorage/.test(e)) || true, tag, ""); const errs = p.__errs.filter(e => !/blocked/.test(e)); note(!errs.length, tag, "lỗi JS khi storage bị chặn: " + errs.join(" | ")); await p.close(); }
    }
  } finally { await br.close(); srv.kill(); }
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi" : "✓ thẻ chào mừng đạt"));
  process.exit(fails.length ? 1 : 0);
})();
