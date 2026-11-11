/* Popup "?" (gợi ý / cách chơi) và nút ✕ của nó (GAME_RULES.md 0a-14):
     NODE_PATH=<thư mục có playwright> node scripts/cozygame/check-helppopup.js [--quick] [--chrome-only|--webkit-only] [id,id,...]
   Mọi game Cozy (shared/help.js: #hlpOv/#hlpCard/#hlpX) + Pop (shared/pophelp.js: #phOv/#phCard/#phGo) × điện thoại dọc 320x568 … 430x932 + ngang 844x390 + máy tính 1280x800 × (WebKit thật + Chrome):
   mở popup bằng nút ? → thẻ nằm trong khung nhìn; nút đóng nằm TRONG thẻ, cỡ >=44px (✕ Cozy ở điện thoại dọc >= 56px = --tap-lg), (✕ của Cozy) ở góc trên-phải cách mép trong của thẻ >=12px (phải và trên), không đè chữ tiêu đề/nội dung,
   elementFromPoint ở tâm nút trả về chính nó, bấm nút đóng được, Esc đóng được (Cozy). Game không có nút ? → bỏ qua. Không có Playwright → bỏ qua (exit 0). */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path");
let pw; try { pw = require("playwright"); } catch (e) { try { pw = require("playwright-core"); } catch (e2) { console.log("⚠ Không có Playwright → bỏ qua check-helppopup"); process.exit(0); } }
const root = path.join(__dirname, "..", ".."), PORT = +process.env.NP_PORT_HP || 8905, args = process.argv.slice(2), quick = args.includes("--quick"), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [];
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")).filter(d => fs.existsSync(path.join(root, "cozyplay/games", d, "index.html"))), POP = fs.readdirSync(path.join(root, "popplay/games"));
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "xe-ca-phe"], ["cozyplay", "dap-deadline"], ["cozyplay", "bao-nhieu-giay"], ["cozyplay", "ban-co-hieu-toi"], ["popplay", "pop-fly"], ["popplay", "bo-me-5-giay"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
const SIZES = quick ? [[320, 568, 1], [390, 844, 1], [844, 390, 1], [1280, 800, 0]] : [[320, 568, 1], [360, 640, 1], [375, 667, 1], [390, 844, 1], [414, 896, 1], [430, 932, 1], [844, 390, 1], [1280, 800, 0]];
const OPEN = () => { const b = document.getElementById("bHelp") || document.getElementById("phBtn"); if (!b || !(document.getElementById("hlpOv") || document.getElementById("phOv"))) return "none";   /* game có popup ? riêng (Đập Deadline) không thuộc help.js/pophelp.js → bỏ qua */ b.click(); return "ok"; };
const MEASURE = () => {
  const E = [], cozy = !!document.getElementById("hlpCard"), card = document.getElementById(cozy ? "hlpCard" : "phCard"), x = document.getElementById(cozy ? "hlpX" : "phGo"), ov = document.getElementById(cozy ? "hlpOv" : "phOv");
  if (!card || !x || !ov) return { E: ["không có thẻ/nút đóng"] }; if (ov.hidden) return { E: ["bấm ? nhưng popup không mở"] };
  const W = innerWidth, H = innerHeight, c = card.getBoundingClientRect(), r = x.getBoundingClientRect(), bw = parseFloat(getComputedStyle(card).borderLeftWidth) || 0;
  if (c.left < -0.5 || c.right > W + 0.5 || c.top < -0.5 || c.bottom > H + 0.5) E.push("thẻ ra ngoài khung nhìn [" + [c.left, c.top, c.right, c.bottom].map(Math.round) + "] trong " + W + "x" + H);
  if (r.left < c.left - 0.5 || r.right > c.right + 0.5 || r.top < c.top - 0.5 || r.bottom > c.bottom + 0.5) E.push("nút đóng ra ngoài thẻ");
  const need = cozy && W <= 520 && H > W ? 55.5 : 43.5;   /* điện thoại dọc: ✕ cỡ --tap-lg 56px (GAME_RULES 0a-17) */
  if (r.width < need || r.height < need) E.push("nút đóng nhỏ " + Math.round(r.width) + "x" + Math.round(r.height) + " (cần >= " + Math.round(need) + ")");
  if (cozy) {
    const mr = c.right - bw - r.right, mt = r.top - (c.top + bw);
    if (mr < 11.5) E.push("✕ cách mép phải thẻ " + mr.toFixed(1) + "px (< 12)"); if (mt < 11.5) E.push("✕ cách mép trên thẻ " + mt.toFixed(1) + "px (< 12)");
    if (card.scrollHeight <= card.clientHeight + 1) { for (const t of card.querySelectorAll("h3,p")) { const q = t.getBoundingClientRect(), rg = document.createRange(); rg.selectNodeContents(t); const tr = rg.getBoundingClientRect(); if (tr.width && tr.left < r.right && r.left < tr.right && tr.top < r.bottom && r.top < tr.bottom) { E.push("✕ đè chữ \"" + t.textContent.trim().slice(0, 14) + "\""); break; } } }
  }
  const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!t || !(t === x || x.contains(t))) E.push("nút đóng bị che bởi " + (t ? t.tagName + "#" + t.id : "∅"));
  return { E };
};
const OPENED = () => { const o = document.getElementById("hlpOv") || document.getElementById("phOv"); return !!(o && !o.hidden); };
async function run(engName, br) {
  for (const [portal, id] of list) for (const [W, H, touch] of SIZES) {
    const ctx = await br.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: !!touch, hasTouch: !!touch });
    await ctx.addInitScript(() => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "dark"); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("np-rails", "1"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); });
    const pg = await ctx.newPage(), tag = "[" + engName + "] " + id + " " + W + "x" + H, bad = m => { fails.push(tag + ": " + m); console.log("  ✗ " + tag + ": " + m); };
    try {
      await pg.goto("http://localhost:" + PORT + "/" + portal + "/index.html?lang=vi#" + id); await wait(3800);
      const fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (!fr) { bad("không thấy iframe game"); await ctx.close(); continue; }
      const o = await fr.evaluate(OPEN); if (o === "none") { await ctx.close(); continue; }
      await wait(600);
      const r = await fr.evaluate(MEASURE); for (const m of r.E) bad("popup ?: " + m);
      if (process.env.NP_HP_SHOTS) await pg.screenshot({ path: path.join(process.env.NP_HP_SHOTS, engName + "-" + id + "-" + W + ".png") });
      const cozy = portal === "cozyplay";
      if (cozy) { await fr.locator("#hlpX").press("Escape").catch(() => {}); await wait(300); if (await fr.evaluate(OPENED)) bad("Esc không đóng được popup"); await fr.evaluate(OPEN); await wait(400); }
      await fr.locator(cozy ? "#hlpX" : "#phGo").click({ timeout: 4000 }).catch(e => bad("không bấm được nút đóng: " + String(e).split("\n")[0].slice(0, 60))); await wait(400);
      if (await fr.evaluate(OPENED)) bad("bấm nút đóng nhưng popup vẫn mở");
    } catch (e) { bad("không đo được: " + String(e).split("\n")[0].slice(0, 80)); }
    await ctx.close();
  }
}
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const engines = [];
  if (!args.includes("--webkit-only")) { try { engines.push(["Chrome", await pw.chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" })]); } catch (e) { console.log("⚠ không mở được Chrome"); } }
  if (!args.includes("--chrome-only")) { try { engines.push(["WebKit", await pw.webkit.launch()]); } catch (e) { console.log("⚠ không mở được WebKit → bỏ qua WebKit"); } }
  for (const [n, b] of engines) { await run(n, b); await b.close(); }
  srv.kill();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi popup ?/✕" : "✓ popup ? và nút đóng đúng chỗ, đủ lớn, bấm được")); process.exit(fails.length ? 1 : 0);
})();
