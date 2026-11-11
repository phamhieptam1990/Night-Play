/* THIẾT KẾ NIGHT PASS cho game Pop Play (shared/popnp.css, GAME_RULES 0a-22) + thẻ menu ⋯ viền gradient tím–cam (0a-21).
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-popnp.js [--quick] [--shots=<thư mục>] [id,id,...]   (tự chạy http.server cổng NP_PORT hoặc 8947)
   Mỗi game Pop x sáng/tối x 390x844 + 844x390 (bản đủ thêm 320x568, 1271x684), mở trực tiếp và (390x844) qua trang cổng:
   - có nhúng popnp.css; token --bg/--panel đúng bảng Night Pass; nền trang (html) là gradient đêm/oải hương, không phẳng;
   - màn chọn (#home | #village | #ovStart) nền Night Pass (tối: độ sáng < 0.12; sáng: > 0.6), nút "Hôm nay" (.dbar) gradient tím–cam, chữ trắng;
   - thanh điểm (.hud) / thẻ câu hỏi (.ask) có nền: tương phản chữ/nền >= 4.5; chip cấp độ chưa chọn tương phản >= 4.5 với nền thanh;
   - popnp.css KHÔNG khai báo --accent (màu nhấn vẫn là của game/độ khó); không cuộn; không lỗi JS;
   - màn rộng (>= 700px) ở màn chọn: nền ngoài cột (#npWide của widebg.js) là nền đêm/oải hương (lớp gradient cuối tối < 0.12 / sáng > 0.6);
   - thẻ menu ⋯ (#npPmFan .pn): viền gradient tím–cam (border-box), nền tối. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), args = process.argv.slice(2), quick = args.includes("--quick"), PORT = +process.env.NP_PORT || 8947;
const shots = (args.find(a => a.startsWith("--shots=")) || "").slice(8), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = []; let n = 0;
let ids = fs.readdirSync(path.join(root, "popplay/games")).filter(d => fs.existsSync(path.join(root, "popplay/games", d, "index.html")));
for (const id of ids) if (!/shared\/popnp\.css/.test(fs.readFileSync(path.join(root, "popplay/games", id, "index.html"), "utf8"))) fails.push(id + ": chưa nhúng shared/popnp.css");
if (!/\/shared\/popnp\.css/.test(fs.readFileSync(path.join(root, "sw.js"), "utf8"))) fails.push("sw.js: thiếu /shared/popnp.css trong SHELL");
if (/--accent\s*:/.test(fs.readFileSync(path.join(root, "shared/popnp.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, ""))) fails.push("popnp.css: không được đặt --accent (màu nhấn là của game/độ khó)");
if (quick) ids = ["qua-song", "lang-cua-be", "pop-fly", "con-vat-an-so"];
if (only.length) ids = ids.filter(i => only.includes(i));
const SIZES = quick ? [[390, 844], [844, 390]] : [[390, 844], [320, 568], [844, 390], [1271, 684]];
const MEASURE = () => {
  const num = c => { const m = (c || "").match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
  const L = c => { const q = [0, 1, 2].map(i => { let v = c[i] / 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * q[0] + .7152 * q[1] + .0722 * q[2]; };
  const cr = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05), cs = e => getComputedStyle(e), de = document.documentElement, dark = de.dataset.theme === "dark";
  const over = (c, b) => { const a = c.length > 3 ? c[3] : 1; return [0, 1, 2].map(i => c[i] * a + b[i] * (1 - a)); };
  const vis = e => e && !e.closest("[hidden]") && e.getBoundingClientRect().width > 4 && cs(e).display !== "none" && cs(e).visibility !== "hidden";
  const base = dark ? [18, 20, 31] : [243, 240, 250];
  /* màu nền "cuối cùng" của gradient = màu của lớp linear-gradient sau cùng (lớp nền đặc) */
  const lastStops = bg => { const i = bg.lastIndexOf("linear-gradient("); return i < 0 ? [] : (bg.slice(i).match(/rgba?\([^)]*\)/g) || []).map(num); };
  const o = { dark, err: [] }, rs = cs(de);
  o.bg = rs.getPropertyValue("--bg").trim().toUpperCase(); o.panel = rs.getPropertyValue("--panel").trim().toUpperCase(); o.accent = rs.getPropertyValue("--accent").trim();
  o.htmlBg = rs.backgroundImage.indexOf("gradient") >= 0; o.bodyBg = num(cs(document.body).backgroundColor)[3] === 0 || cs(document.body).backgroundColor === "rgba(0, 0, 0, 0)";
  o.scroll = de.scrollHeight > innerHeight + 1 || de.scrollWidth > innerWidth + 1;
  const home = [...document.querySelectorAll("#home,#village,#ovStart")].find(vis);
  if (home) { const st = lastStops(cs(home).backgroundImage); o.home = home.id; o.homeL = st.length ? Math.max(...st.map(c => L(over(c, base)))) : -1; o.homeMin = st.length ? Math.min(...st.map(c => L(over(c, base)))) : -1; }
  const db = [...document.querySelectorAll(".play .dbar")].find(vis);
  if (db) { const b = cs(db).backgroundImage; o.dbar = /rgb\(106, 72, 240\)/.test(b) && /rgb\(194, 65, 12\)/.test(b); o.dbarInk = L(num(cs(db).color)); }
  const panelC = num(rs.getPropertyValue("--panel").trim().replace(/^#(..)(..)(..)$/, (m, a, b, c) => "rgb(" + [a, b, c].map(h => parseInt(h, 16)).join(",") + ")")), o2 = [];
  document.querySelectorAll(".side .hud,.side .ask").forEach(e => { if (!vis(e)) return; const b = num(cs(e).backgroundColor); if (!b[3] && cs(e).backgroundImage === "none") return;
    const t = [...e.querySelectorAll("b,span")].find(x => vis(x) && x.textContent.trim()) || e; o2.push({ n: e.className, cr: cr(L(num(cs(t).color)), L(over(b, base))) }); });
  o.panels = o2;
  const lv = [...document.querySelectorAll("#home .lvs .lvb:not(.on)")].find(vis);
  if (lv) { const p = lv.closest(".lvs"), hb = home ? lastStops(cs(home).backgroundImage) : [], under = hb.length ? over(hb[hb.length - 1], base) : base; o.lvb = cr(L(num(cs(lv).color)), L(over(num(cs(p).backgroundColor), under))); }
  const wd = document.getElementById("npWide"); if (wd && innerWidth >= 700 && cs(wd).display !== "none") { const st = lastStops(cs(wd).backgroundImage); o.wideL = st.length ? Math.max(...st.map(c => L(over(c, base)))) : -1; o.wideMin = st.length ? Math.min(...st.map(c => L(over(c, base)))) : -1; }
  const pn = document.querySelector("#npPmFan .pn");
  if (pn) { const b = cs(pn).backgroundImage; o.menu = { edge: /rgb\(155, 131, 255\)/.test(b) && /rgb\(255, 154, 107\)/.test(b), dark: Math.max(...(b.split("),")[0].match(/rgba?\([^)]*\)/g) || []).map(c => L(num(c))), 0) < .12 }; }
  return o;
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  if (shots) fs.mkdirSync(shots, { recursive: true });
  try {
    for (const id of ids) for (const th of ["dark", "light"]) for (const [W, H] of SIZES) for (const via of (W === 390 ? ["direct", "portal"] : ["direct"])) {
      const pg = await br.newPage(), tag = `${id} ${th} ${W}x${H} ${via}`, bad = m => fails.push(tag + ": " + m); n++;
      await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: W < 900, hasTouch: W < 900 });
      await pg.evaluateOnNewDocument(t => { try { localStorage.setItem("theme", t); localStorage.setItem("np-sound", "0"); localStorage.setItem("lang", "vi"); localStorage.setItem("np-welcome-seen", "1"); } catch (e) {} try { speechSynthesis.speak = () => {}; } catch (e) {} }, th);
      const errs = []; pg.on("pageerror", e => errs.push(String(e).slice(0, 140)));
      await pg.goto(via === "portal" ? `http://localhost:${PORT}/popplay/index.html#${id}` : `http://localhost:${PORT}/popplay/games/${id}/index.html`, { waitUntil: "load" }); await wait(1100);
      const fr = via === "portal" ? pg.frames().find(f => f.url().includes("/games/" + id)) : pg.mainFrame();
      if (!fr) { bad("không thấy khung game"); await pg.close(); continue; }
      await fr.waitForFunction(() => document.readyState === "complete" && [...document.styleSheets].some(x => /popnp\.css/.test(x.href || "")), { timeout: 8000 }).catch(() => bad("popnp.css chưa nạp"));
      const m = await fr.evaluate(MEASURE), dark = th === "dark";
      if (m.bg !== (dark ? "#12141F" : "#F3F0FA")) bad("--bg = " + m.bg);
      if (m.panel !== (dark ? "#221E48" : "#FFF")) bad("--panel = " + m.panel);
      if (!m.htmlBg) bad("nền trang không phải gradient Night Pass");
      if (W < 700 && !m.bodyBg) bad("body còn nền đặc che nền Night Pass");
      if (m.scroll) bad("trang bị cuộn");
      if (!m.home) bad("không thấy màn chọn (#home/#village/#ovStart)");
      else if (dark ? m.homeL > .12 : m.homeMin < .6) bad(`màn chọn ${m.home} chưa phải nền Night Pass (L ${m.homeMin.toFixed(2)}–${m.homeL.toFixed(2)})`);
      if (W >= 700 && (m.wideL === undefined || (dark ? m.wideL > .12 : m.wideMin < .6))) bad(`nền ngoài cột chưa phải nền Night Pass (L ${m.wideMin === undefined ? "?" : m.wideMin.toFixed(2) + "–" + m.wideL.toFixed(2)})`);
      if (m.dbar === false) bad(".dbar chưa gradient tím–cam"); if (m.dbar && m.dbarInk < .9) bad(".dbar chữ không trắng");
      for (const p of m.panels) if (p.cr < 4.5) bad(`.${p.n} tương phản ${p.cr.toFixed(2)} < 4.5`);
      if (m.lvb !== undefined && m.lvb < 4.5) bad(`chip cấp độ tương phản ${m.lvb.toFixed(2)} < 4.5`);
      if (W === 390) {
        const has = await fr.evaluate(() => { const f = document.querySelector("#npPmFab"); if (!f) return false; f.click(); return true; }); await wait(350);
        if (!has) bad("không có nút ⋯"); else { const mm = (await fr.evaluate(MEASURE)).menu; if (!mm || !mm.edge) bad("thẻ menu ⋯ thiếu viền gradient tím–cam"); else if (!mm.dark) bad("thẻ menu ⋯ nền không tối"); }
        if (shots) await pg.screenshot({ path: path.join(shots, `${id}-${th}-${via}-menu.png`) });
      } else if (shots) await pg.screenshot({ path: path.join(shots, `${id}-${th}-${W}x${H}.png`) });
      if (errs.length) bad("lỗi JS: " + [...new Set(errs)].join(" | "));
      await pg.close();
    }
  } finally { await br.close(); srv.kill(); }
  if (fails.length) { console.log(fails.map(f => "✗ " + f).join("\n")); console.log(`✗ check-popnp: ${fails.length} lỗi / ${n} ca`); process.exit(1); }
  console.log(`✓ giao diện Night Pass của Pop Play đạt (${n} ca)`);
})();
