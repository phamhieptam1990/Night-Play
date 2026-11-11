/* Menu ⋯ ở ĐIỆN THOẠI DỌC mở ra phải NẰM TRONG màn hình và dùng được (GAME_RULES.md 0a-14):
     NODE_PATH=<thư mục có playwright> node scripts/cozygame/check-fanmenu.js [--quick] [--chrome-only|--webkit-only] [id,id,...]
   Mọi game Cozy (fan.js) + Pop (popmenu.js) × 320x568 360x640 375x667 390x844 414x896 430x932 × màn chọn/đang chơi × (WebKit thật + Chrome): bấm nút ⋯ → bảng (.pn) và MỖI mục đang hiện
   nằm trọn trong khung nhìn (left>=0, right<=rộng, top>=0, bottom<=cao), cỡ >=56px, KHÔNG chữ hiển thị trong ô (trừ VI/EN + huy hiệu số), có aria-label + title, icon >=30px, thẻ cao <= 60% màn, đáy nút ⋯ <= đỉnh bảng (không đè hàng nút), elementFromPoint ở tâm mục trả về đúng mục (không bị che),
   Esc đóng được và bấm ra ngoài (nền mờ) đóng được. Không có Playwright → bỏ qua (exit 0). */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path");
let pw; try { pw = require("playwright"); } catch (e) { try { pw = require("playwright-core"); } catch (e2) { console.log("⚠ Không có Playwright → bỏ qua check-fanmenu"); process.exit(0); } }
const root = path.join(__dirname, "..", ".."), PORT = +process.env.NP_PORT_FM || 8899, args = process.argv.slice(2), quick = args.includes("--quick"), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [];
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")).filter(d => fs.existsSync(path.join(root, "cozyplay/games", d, "index.html"))), POP = fs.readdirSync(path.join(root, "popplay/games"));
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "cozy-wings"], ["cozyplay", "dap-deadline"], ["cozyplay", "xe-ca-phe"], ["cozyplay", "ban-co-hieu-toi"], ["popplay", "pop-fly"], ["popplay", "bo-me-5-giay"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
const SIZES = quick ? [[320, 568], [375, 667], [430, 932]] : [[320, 568], [360, 640], [375, 667], [390, 844], [414, 896], [430, 932]];
const SETTLED = () => { const pn = document.querySelector("#npFan .pn,#npPmFan .pn"); return !pn || getComputedStyle(pn).transform === "none" || getComputedStyle(pn).transform === "matrix(1, 0, 0, 1, 0, 0)"; };
const MEASURE = () => {   /* chạy TRONG iframe game, sau khi bấm ⋯ */
  const fab = document.getElementById("npFab") || document.getElementById("npPmFab"), pn = document.querySelector("#npFan .pn,#npPmFan .pn"), E = [];
  if (!fab) return { E: ["không có nút ⋯"] }; if (!pn) return { E: ["không có bảng menu"] };
  const W = innerWidth, H = innerHeight, fr = fab.getBoundingClientRect(), pr = pn.getBoundingClientRect();
  const wrap = pn.parentElement; if (!wrap.classList.contains("open")) E.push("bấm ⋯ nhưng menu không có class open");
  if (pr.width < 40 || pr.height < 40) E.push("bảng menu cỡ " + Math.round(pr.width) + "x" + Math.round(pr.height));
  if (pr.left < -0.5 || pr.right > W + 0.5 || pr.top < -0.5 || pr.bottom > H + 0.5) E.push("bảng ra ngoài màn hình [" + [pr.left, pr.top, pr.right, pr.bottom].map(Math.round) + "] trong " + W + "x" + H);
  if (pr.top < fr.bottom - 0.5) E.push("bảng đè nút ⋯ (đỉnh bảng " + Math.round(pr.top) + " < đáy ⋯ " + Math.round(fr.bottom) + ")");
  if (Math.abs(pr.right - fr.right) > 4) E.push("bảng không neo theo ⋯ (mép phải bảng " + Math.round(pr.right) + " ≠ ⋯ " + Math.round(fr.right) + ")");
  if (pr.height > H * 0.6 + 0.5) E.push("thẻ menu cao " + Math.round(pr.height) + "px > 60% màn (" + Math.round(H * 0.6) + ")");
  const items = [...pn.children].filter(e => !e.hidden && getComputedStyle(e).display !== "none");
  if (!items.length) E.push("bảng không có mục nào");
  for (const it of items) {
    const r = it.getBoundingClientRect(), n = it.id || it.className, cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (r.left < -0.5 || r.right > W + 0.5 || r.top < -0.5 || r.bottom > H + 0.5) E.push("mục " + n + " ra ngoài màn hình [" + [r.left, r.top, r.right, r.bottom].map(Math.round) + "]");
    if (r.width < 55.5 || r.height < 55.5) E.push("mục " + n + " nhỏ " + Math.round(r.width) + "x" + Math.round(r.height) + " (ô icon phải >=56px = --tap-lg)");
    /* Ô ICON TO: không có chữ nhãn hiển thị (trừ VI/EN của ô ngôn ngữ và huy hiệu số), có aria-label + title, icon to, huy hiệu đủ lớn và không bị cắt */
    const tw = document.createTreeWalker(it, NodeFilter.SHOW_TEXT); let txt = "", tn; while ((tn = tw.nextNode())) { if (tn.parentElement.closest("b,svg,.bl,[hidden]")) continue; txt += tn.nodeValue; } txt = txt.replace(/\s+/g, "");
    const isLang = it.getAttribute("data-r") === "lang";
    if (isLang ? !/^[A-Za-z]{2,3}$/.test(txt) : /\p{L}/u.test(txt)) E.push("mục " + n + " còn chữ hiển thị “" + txt + "”");
    for (const ps of ["::after", "::before"]) { const c = getComputedStyle(it, ps).content; if (c && c !== "none" && c !== "normal" && c !== '""' && !(ps === "::before" && it.classList.contains("rs"))) E.push("mục " + n + " còn nhãn chữ " + ps + " " + c); }
    if (!(it.getAttribute("aria-label") || "").trim()) E.push("mục " + n + " thiếu aria-label"); if (!(it.title || "").trim()) E.push("mục " + n + " thiếu title (chú thích)");
    const sv = it.querySelector("svg"); if (sv) { const sr = sv.getBoundingClientRect(); if (sr.width < 29.5) E.push("mục " + n + " icon svg nhỏ " + Math.round(sr.width) + "px (<30)"); }
    else if (isLang) { if (parseFloat(getComputedStyle(it).fontSize) < 19.5 || +getComputedStyle(it).fontWeight < 700) E.push("mục " + n + " chữ VI/EN nhỏ/mảnh " + getComputedStyle(it).fontSize); }
    else if (parseFloat(getComputedStyle(it).fontSize) < 27.5) E.push("mục " + n + " icon emoji nhỏ " + getComputedStyle(it).fontSize);
    const bd = it.querySelector("b"); if (bd) { const br = bd.getBoundingClientRect(); if (br.width < 17.5 || br.height < 17.5) E.push("mục " + n + " huy hiệu nhỏ " + Math.round(br.width) + "x" + Math.round(br.height)); if (br.left < r.left - 0.5 || br.right > r.right + 0.5 || br.top < r.top - 0.5 || br.bottom > r.bottom + 0.5) E.push("mục " + n + " huy hiệu bị cắt/ra ngoài ô"); }
    const t = document.elementFromPoint(cx, cy); if (!t || !(t === it || it.contains(t))) E.push("mục " + n + " bị che bởi " + (t ? t.tagName + "#" + t.id + "." + t.className : "∅"));
  }
  return { E, n: items.length };
};
const OPENED = () => { const w = document.querySelector("#npFan,#npPmFan"); return !!(w && w.classList.contains("open")); };
async function run(engName, br) {
  for (const [portal, id] of list) for (const [W, H] of SIZES) {
    const ctx = await br.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await ctx.addInitScript(() => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "dark"); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("np-rails", "1"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); });
    const pg = await ctx.newPage(); let tag = "[" + engName + "] " + id + " " + W + "x" + H;
    const bad = m => { fails.push(tag + ": " + m); console.log("  ✗ " + tag + ": " + m); };
    try {
      await pg.goto("http://localhost:" + PORT + "/" + portal + "/index.html?lang=vi#" + id); await wait(3500);
      for (const name of ["chọn", "chơi"]) {
        tag = "[" + engName + "] " + id + " " + W + "x" + H + " " + name;
        const fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (!fr) { bad("không thấy iframe game"); break; }
        if (name === "chơi") {
          if (portal === "cozyplay") await fr.evaluate(() => { const e = document.getElementById("bPlay") || document.getElementById("bDaily") || document.getElementById("startBtn") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn") || document.querySelector(".tile.daily") || document.querySelector(".tile .main"); e && e.click(); }).catch(() => {});
          else await fr.evaluate("try{begin(0,{})}catch(e){try{startSession(0,null,{})}catch(e2){try{startRound(Object.keys(PF.types||{})[0]||0)}catch(e3){}}}").catch(() => {});
          await wait(1400);
        }
        const fab = fr.locator("#npFab, #npPmFab").first();
        try { await fab.click({ timeout: 4000 }); } catch (e) { bad("không bấm được nút ⋯: " + String(e).split("\n")[0].slice(0, 70)); continue; }
        for (let k = 0; k < 20 && !(await fr.evaluate(SETTLED)); k++) await wait(150);   /* chờ hết hiệu ứng mở (scale .7 → 1) */
        await wait(200);
        const r = await fr.evaluate(MEASURE); for (const m of r.E) bad("menu ⋯: " + m);
        if (shots && name === "chọn") await pg.screenshot({ path: path.join(shots, engName + "-" + id + "-" + W + ".png") });
        await pg.keyboard.press("Escape"); await wait(350);
        if (await fr.evaluate(OPENED)) bad("Esc không đóng được menu");
        await fab.click({ timeout: 4000 }).catch(() => {}); await wait(400);
        await pg.mouse.click(Math.round(W / 2), Math.round(H - 20)); await wait(400);
        if (await fr.evaluate(OPENED)) bad("bấm ra ngoài không đóng được menu");
      }
    } catch (e) { bad("không đo được: " + String(e).split("\n")[0].slice(0, 80)); }
    await ctx.close();
  }
}
const shotsArg = process.env.NP_FM_SHOTS, shots = shotsArg && (fs.mkdirSync(shotsArg, { recursive: true }), shotsArg);
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const engines = [];
  if (!args.includes("--webkit-only")) { try { engines.push(["Chrome", await pw.chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" })]); } catch (e) { console.log("⚠ không mở được Chrome"); } }
  if (!args.includes("--chrome-only")) { try { engines.push(["WebKit", await pw.webkit.launch()]); } catch (e) { console.log("⚠ không mở được WebKit → bỏ qua WebKit"); } }
  for (const [n, b] of engines) { await run(n, b); await b.close(); }
  srv.kill();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi menu ⋯ (nằm trong màn hình)" : "✓ menu ⋯ mở trọn trong màn hình, bấm được, đóng được")); process.exit(fails.length ? 1 : 0);
})();
