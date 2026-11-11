/* Popup mời Night Pass trong game (shared/nppopup.css + nppopup.js; GAME_RULES.md mục Night Pass/paywall):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-pwpopup.js [--quick] [--shots=<thư mục>] [id,id]
   Mọi game Cozy (20) + Pop (12), KHÔNG có Night Pass: mở popup mời bằng chạm vào phần tử khoá thật (ổ khoá của thẻ skin / chế độ / độ khó),
   đo ở 390x844, 844x390, 1440x900 x sáng/tối (tiếng Việt):
     popup trọn trong khung nhìn; ✕ >=44px, nằm TRONG thẻ ở góc trên-phải, elementFromPoint tại tâm là ✕, không đè chữ/nút khác;
     nút chính (#pwGo) >=48px, mọi nút >=44px; chữ không tràn thẻ (scrollWidth<=clientWidth), thẻ không cuộn; phông là Inter;
     nền thẻ có lớp kính/quầng (gradient) và lớp mờ phía sau có quầng; đóng được bằng ✕ và bằng Esc.
   Popup chọn giao diện (#ovSkin): ✕ trong thẻ, >=44px, bấm được. Pop Play: nút chính là "Chơi thử", "Dành cho phụ huynh" không gradient (không hấp dẫn trẻ bấm mua).
   --quick: 6 game, 390x844 + 844x390 tối / 390x844 sáng. */
const http = require("http"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), args = process.argv.slice(2), quick = args.includes("--quick");
const shotDir = (args.find(a => a.startsWith("--shots=")) || "").slice(8), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [];
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".woff2": "font/woff2", ".webmanifest": "application/json" };
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")).filter(d => fs.existsSync(path.join(root, "cozyplay/games", d, "index.html"))), POP = fs.readdirSync(path.join(root, "popplay/games"));
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "xe-ca-phe"], ["cozyplay", "dap-deadline"], ["cozyplay", "bao-nhieu-giay"], ["cozyplay", "cozy-wings"], ["popplay", "pop-fly"], ["popplay", "bo-me-5-giay"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
const CASES = quick ? [[390, 844, "dark"], [844, 390, "dark"], [390, 844, "light"]] : [[390, 844, "dark"], [390, 844, "light"], [844, 390, "dark"], [844, 390, "light"], [1440, 900, "dark"], [1440, 900, "light"]];

/* mở popup mời: chạm phần tử khoá thật (không gọi hàm riêng của game) */
const TRIGGER = async () => {
  const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 4 && r.height > 4 && s.visibility !== "hidden" && s.display !== "none"; };
  const pay = () => { const a = document.getElementById("ovPay"), b = document.getElementById("pay"); return (a && !a.hidden) || (b && !b.hidden); };
  const tryClick = async sel => { for (const e of document.querySelectorAll(sel)) if (vis(e)) { e.click(); await new Promise(r => setTimeout(r, 350)); if (pay()) return sel; } return null; };
  let r = await tryClick(".skc.lock,.sk.lock"); if (r) return r;
  for (const s of ["#bSkin", "#skinBtn", ".skinBtn", "#openSkins", ".skin-btn", "#bSkins", ".tile .sk", ".band .sk"]) { const b = document.querySelector(s); if (b && vis(b)) { b.click(); await new Promise(r => setTimeout(r, 350)); r = await tryClick(".skc.lock,.sk.lock"); if (r) return s + ">" + r; } }
  for (const s of [".ty.lock", ".lv.lock", ".chip.lock", ".hdaily.lock", ".mode.lock", ".card.lock", ".tile.lock"]) { r = await tryClick(s); if (r) return r; }
  return null;
};
const MEASURE = () => {
  const E = [], W = innerWidth, H = innerHeight, ov = document.getElementById("ovPay"), dd = document.getElementById("pay"), dead = !ov || ov.hidden;
  const card = dead ? (dd && !dd.hidden ? dd.querySelector(".sheet-in") : null) : ov.querySelector(".npc"), root = dead ? dd : ov;
  if (!card) return { E: ["không thấy thẻ popup (.npc / .sheet-in)"] };
  const x = dead ? document.getElementById("payX0") : card.querySelector(".npx"), go = document.getElementById(dead ? "payGo" : "pwGo");
  const c = card.getBoundingClientRect(), cs = getComputedStyle(card), kid = document.documentElement.classList.contains("npp-kid");
  if (c.left < -0.5 || c.right > W + 0.5 || c.top < -0.5 || c.bottom > H + 0.5) E.push("popup ra ngoài khung nhìn [" + [c.left, c.top, c.right, c.bottom].map(Math.round) + "] trong " + W + "x" + H);
  if (card.scrollHeight > card.clientHeight + 1 || card.scrollWidth > card.clientWidth + 1) E.push("thẻ bị cuộn/tràn " + card.scrollWidth + "x" + card.scrollHeight + " > " + card.clientWidth + "x" + card.clientHeight);
  if (!x) E.push("không có nút ✕"); else {
    const r = x.getBoundingClientRect();
    if (r.width < 43.5 || r.height < 43.5) E.push("✕ nhỏ " + Math.round(r.width) + "x" + Math.round(r.height));
    if (r.left < c.left - 0.5 || r.right > c.right + 0.5 || r.top < c.top - 0.5 || r.bottom > c.bottom + 0.5) E.push("✕ ra ngoài thẻ");
    if (c.right - r.right > 24 || r.top - c.top > 24) E.push("✕ không ở góc trên-phải (cách phải " + Math.round(c.right - r.right) + ", trên " + Math.round(r.top - c.top) + ")");
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!t || !(t === x || x.contains(t))) E.push("✕ bị che bởi " + (t ? t.tagName + "#" + t.id + "." + t.className : "∅"));
    for (const e of card.querySelectorAll("h2,p,#payT,#payBody p,button,a")) { if (e === x || x.contains(e) || e.contains(x) || e.offsetParent === null && getComputedStyle(e).position !== "fixed") continue; const q = e.getBoundingClientRect(); if (!q.width) continue;
      let q2 = q; if (/^(H2|P|SPAN)$/.test(e.tagName)) { const rg = document.createRange(); rg.selectNodeContents(e); q2 = rg.getBoundingClientRect(); }
      if (q2.left < r.right && q2.right > r.left && q2.top < r.bottom && q2.bottom > r.top && q2.width) E.push("✕ đè " + e.tagName + "#" + e.id + " " + (e.textContent || "").slice(0, 20)); }
  }
  if (!go) E.push("không có nút chính"); else { const g = go.getBoundingClientRect(); if (g.height < 47.5) E.push("nút chính cao " + Math.round(g.height) + " < 48"); if (g.left < c.left || g.right > c.right || g.top < c.top || g.bottom > c.bottom) E.push("nút chính ra ngoài thẻ");
    const gs = getComputedStyle(go); if (!kid && !/gradient/.test(gs.backgroundImage)) E.push("nút chính không gradient"); if (kid && /gradient/.test(gs.backgroundImage)) E.push("Pop: 'Dành cho phụ huynh' không được gradient (hấp dẫn trẻ)"); }
  for (const b of card.querySelectorAll("button,a")) { if (b.hidden || b.offsetParent === null || getComputedStyle(b).display === "none") continue; const q = b.getBoundingClientRect(); if (q.height < 43.5 || q.width < 43.5) E.push("nút nhỏ " + b.id + " " + Math.round(q.width) + "x" + Math.round(q.height)); if (q.right > c.right + 0.5 || q.left < c.left - 0.5 || q.bottom > c.bottom + 0.5) E.push("nút " + b.id + " ra ngoài thẻ"); }
  for (const e of card.querySelectorAll("h2,p,button,a,#payT,#payBody p")) { if (e.offsetParent === null) continue; if (e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).display !== "inline") E.push("chữ tràn " + e.tagName + "#" + e.id + " " + e.scrollWidth + ">" + e.clientWidth); }
  const h = card.querySelector("h2,#payT"); if (!h) E.push("không có tiêu đề"); else { const f = getComputedStyle(h); if (!/Inter/.test(f.fontFamily)) E.push("tiêu đề không phải Inter: " + f.fontFamily); if (+f.fontWeight < 800) E.push("tiêu đề weight " + f.fontWeight); if (parseFloat(f.fontSize) < 19) E.push("tiêu đề nhỏ " + f.fontSize); }
  if (go && !/Inter/.test(getComputedStyle(go).fontFamily)) E.push("nút không phải Inter");
  if (!/gradient/.test(cs.backgroundImage)) E.push("nền thẻ không có lớp kính/quầng (gradient)");
  if (!dead && !/gradient/.test(getComputedStyle(root).backgroundImage)) E.push("lớp mờ phía sau không có quầng");
  if (!dead && !/gradient/.test(cs.backgroundImage.replace(/radial/, ""))) { /* thẻ dùng linear-gradient */ }
  const txt = card.innerText || ""; if (/[ÃÂ�]/.test(txt)) E.push("chữ lỗi mã hoá");
  return { E, dead, vi: /[ạảãàáâấầẩẫậăắằẳẵặẹẻẽèéêếềểễệịỉĩìíọỏõòóôốồổỗộơớờởỡợụủũùúưứừửữựỵỷỹỳý]/i.test(txt) };
};
const OPENED = () => { const a = document.getElementById("ovPay"), b = document.getElementById("pay"); return !!((a && !a.hidden) || (b && !b.hidden)); };
(async () => {
  const srv = http.createServer((q, r) => { const p = decodeURIComponent(q.url.split("?")[0]), f = path.join(root, p); if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f)); }).listen(0);
  const port = srv.address().port, br = await puppeteer.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--no-sandbox"] });
  let nopen = 0;
  for (const [portal, id] of list) for (const [W, H, theme] of CASES) {
    const tag = id + " " + W + "x" + H + " " + theme, bad = m => { fails.push(tag + ": " + m); console.log("  ✗ " + tag + ": " + m); };
    const pg = await br.newPage(); await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: W < 600, hasTouch: W < 600 });
    await pg.evaluateOnNewDocument(t => { try { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", t); localStorage.setItem("np-welcome-seen", "1"); localStorage.removeItem("pass"); } catch (e) {} }, theme);
    await pg.setRequestInterception(true); pg.on("request", r => /\/api\//.test(r.url()) ? r.respond({ status: 401, body: "{}" }) : r.continue());
    try {
      await pg.goto("http://localhost:" + port + "/" + portal + "/games/" + id + "/index.html?lang=vi", { waitUntil: "load" }); await wait(900);
      const how = await pg.evaluate(TRIGGER); if (!how) { bad("không mở được popup mời bằng phần tử khoá"); await pg.close(); continue; } nopen++;
      await wait(250); const m = await pg.evaluate(MEASURE); for (const e of m.E) bad(e);
      if (!m.vi) bad("popup thiếu chữ tiếng Việt có dấu");
      if (shotDir) await pg.screenshot({ path: path.join(shotDir, id + "-" + W + "x" + H + "-" + theme + ".png") });
      const xsel = m.dead ? "#payX0" : "#ovPay .npx";
      await pg.click(xsel).catch(e => bad("không bấm được ✕")); await wait(300); if (await pg.evaluate(OPENED)) bad("bấm ✕ nhưng popup vẫn mở");
      if (W === 390 || quick) { const how2 = await pg.evaluate(TRIGGER); if (how2) { await pg.keyboard.press("Escape"); await wait(300); if (await pg.evaluate(OPENED)) bad("Esc không đóng được popup"); } }
      /* popup chọn giao diện: ✕ trong thẻ */
      if (W === 390 && !m.dead) { await pg.reload({ waitUntil: "load" }); await wait(700);
        const sk = await pg.evaluate(async () => { for (const s of ["#bSkin", "#skinBtn", ".skinBtn", "#bSkins", ".tile .sk", ".band .sk"]) { const b = document.querySelector(s); if (b && b.getBoundingClientRect().width > 4) { b.click(); await new Promise(r => setTimeout(r, 400)); const o = document.getElementById("ovSkin"); if (o && !o.hidden) { const c = o.querySelector(".npc"), x = c && c.querySelector(".npx"); if (!x) return "không có ✕"; const r = x.getBoundingClientRect(), q = c.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); const E = []; if (r.width < 43.5 || r.height < 43.5) E.push("✕ skin nhỏ"); if (r.right > q.right + .5 || r.top < q.top - .5) E.push("✕ skin ngoài thẻ"); if (!(t === x)) E.push("✕ skin bị che bởi " + (t && t.id || t && t.tagName)); if (q.left < -.5 || q.right > innerWidth + .5 || q.bottom > innerHeight + .5) E.push("skin ngoài khung"); if (c.scrollHeight > c.clientHeight + 1) E.push("skin thẻ cuộn"); x.click(); await new Promise(r => setTimeout(r, 300)); if (!o.hidden) E.push("✕ skin không đóng"); return E.join("; "); } } } return ""; });
        if (sk) bad("popup giao diện: " + sk); }
    } catch (e) { bad("không đo được: " + String(e).split("\n")[0].slice(0, 100)); }
    await pg.close();
  }
  await br.close(); srv.close();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi popup mời Night Pass" : "✓ popup mời Night Pass đạt (" + nopen + " ca)")); process.exit(fails.length ? 1 : 0);
})();
