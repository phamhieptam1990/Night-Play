/* NIGHT PASS của 2 game lớn Pop Play (Nhà Của Bi, Quán Cáo Cam; shared/worldkit/world-pass.js + server/pro/<id>.js).
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-worldpass.js [--shots=<thư mục>]
   Mỗi game × {390x844, 844x390}: (1) bản free: nút "Giao diện" ≥56px ở màn chọn, KHÔNG có html[data-wp]; chơi hộ (?helper=1) không có nút;
   (2) không có pass: thẻ chọn mở được, bấm giao diện khoá → thẻ trả phí → cổng phụ huynh (nút ≥56px, không cuộn); (3) có pass: mỗi giao diện đặt html[data-wp] + linh vật Night, ảnh màn chọn + màn chơi
   KHÁC bản free và KHÁC giao diện kia (băm ảnh), không cuộn, nút thanh khu/đáy ≥44px, không lỗi JS; (4) lockPro trả về free (không còn data-wp, <style#wpCss>, NPArtSkinForce). */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), crypto = require("crypto"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.WP_PORT || 8951, B = "http://localhost:" + PORT + "/popplay/games/";
const shots = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8), fails = [], sleep = ms => new Promise(r => setTimeout(r, ms));
const note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const G = { "nuoi-thu-tieng-viet": { themes: ["wizard", "knight"], go: "playTile", ui: ".zb,.tr" }, "tiem-nuoc-ep-tieng-anh": { themes: ["neon", "hero"], go: "startTile", ui: "#bar button,#serveBtn,#undoBtn" } };
const VPS = [[390, 844], [844, 390]], md5 = b => crypto.createHash("md5").update(b).digest("hex");
async function open(br, id, vp, pass, query) {
  const p = await br.newPage(); await p.setViewport({ width: vp[0], height: vp[1], deviceScaleFactor: 1, hasTouch: true, isMobile: vp[0] < 700 }); p.errs = [];
  p.on("pageerror", e => p.errs.push(e.message)); p.on("console", m => { if (m.type() === "error" && !/404|Failed to load/.test(m.text())) p.errs.push(m.text()); });
  await p.evaluateOnNewDocument(pa => { try { localStorage.clear(); if (pa) localStorage.setItem("pass", JSON.stringify({ token: "tk", exp: new Date(Date.now() + 864e5 * 30).toISOString() })); } catch (e) {} }, pass);
  await p.setRequestInterception(true);
  p.on("request", r => { const u = r.url(), m = /\/api\/pro\/([a-z-]+)\.js/.exec(u);
    if (m) { delete require.cache[require.resolve("../../server/pro/" + m[1])]; return r.respond({ status: 200, contentType: "application/javascript", body: require("../../server/pro/" + m[1]).source({ trial: /trial=1/.test(u) }) }); }
    if (/\/api\//.test(u)) return r.respond({ status: 404, body: "{}" }); r.continue(); });
  await p.goto(B + id + "/index.html" + (query || ""), { waitUntil: "networkidle2" }); await sleep(1400); return p;
}
const scroll = p => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1 || document.documentElement.scrollHeight > innerHeight + 1);
const small = (p, sel, min) => p.evaluate((s, m) => [...document.querySelectorAll(s)].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < m || r.height < m); }).length, sel, min);
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await sleep(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  if (shots) fs.mkdirSync(shots, { recursive: true });
  try {
    for (const id of Object.keys(G)) for (const vp of VPS) {
      const tag = id + " " + vp.join("x"), g = G[id], hashes = {}; console.log("== " + tag);
      /* (1) free + chơi hộ */
      let p = await open(br, id, vp, false);
      let b = await p.evaluate(() => { const e = document.getElementById("wpBtn"), r = e && e.getBoundingClientRect(); return e ? [r.width, r.height, getComputedStyle(e).display] : null; });
      note(b && b[1] >= 56 && b[0] >= 56, tag + " free: nút Giao diện ≥56px: " + JSON.stringify(b)); note(!(await p.evaluate(() => document.documentElement.dataset.wp)), tag + " free: có data-wp"); note(!(await scroll(p)), tag + " free: cuộn");
      hashes.freeHome = md5(await p.screenshot());
      /* (2) không pass: thẻ chọn → trả phí → cổng */
      await p.evaluate(() => WorldPass.open()); await sleep(300);
      note((await small(p, ".wp-th", 56)) === 0, tag + " thẻ chọn: ô <56px"); note(!(await scroll(p)), tag + " thẻ chọn: cuộn");
      await p.evaluate(() => document.querySelectorAll(".wp-th")[1].click()); await sleep(300);
      note((await small(p, ".wp-card .wp-b", 56)) === 0, tag + " thẻ trả phí: nút <56px"); const inCard = await p.evaluate(() => { const c = document.querySelector(".wp-card").getBoundingClientRect(); return c.top >= 0 && c.bottom <= innerHeight + 1; });
      note(inCard, tag + " thẻ trả phí tràn màn hình"); if (shots) await p.screenshot({ path: path.join(shots, id + "-pay-" + vp.join("x") + ".png") });
      await p.evaluate(() => document.querySelector(".wp-b.main").click()); await sleep(300);
      note((await small(p, ".wp-b.num", 56)) === 0 && (await p.evaluate(() => document.querySelectorAll(".wp-b.num").length)) === 3, tag + " cổng phụ huynh: 3 nút số ≥56px");
      await p.evaluate(() => { document.querySelector(".wp-x").click(); }); await p.close();
      p = await open(br, id, vp, false, "?helper=1"); note(!(await p.evaluate(() => !!document.getElementById("wpBtn"))), tag + " chơi hộ: vẫn có nút Giao diện"); await p.close();
      /* (3) có pass: từng giao diện */
      for (const th of g.themes) {
        p = await open(br, id, vp, true); const t2 = tag + " " + th;
        await p.evaluate(t => WorldPass.apply(t), th); await sleep(900);
        const st = await p.evaluate(() => ({ wp: document.documentElement.dataset.wp, css: !!document.getElementById("wpCss"), nm: 1, force: window.NPArtSkinForce }));
        note(st.wp === th && st.css, t2 + ": chưa áp giao diện " + JSON.stringify(st)); note(!!st.force, t2 + ": chưa ép skin linh vật");
        hashes[th + "Home"] = md5(await p.screenshot()); if (shots) await p.screenshot({ path: path.join(shots, id + "-" + th + "-home-" + vp.join("x") + ".png") });
        await p.evaluate(go => document.getElementById(go).click(), g.go); await sleep(2400); await p.evaluate(() => { const o = document.querySelector(".wk-ov .go,.wk-ov button"); if (o) o.click(); }); await sleep(900);
        hashes[th + "World"] = md5(await p.screenshot()); if (shots) await p.screenshot({ path: path.join(shots, id + "-" + th + "-world-" + vp.join("x") + ".png") });
        note(!(await scroll(p)), t2 + ": màn chơi cuộn"); note((await small(p, g.ui, 44)) === 0, t2 + ": nút đáy <44px");
        note(p.errs.length === 0, t2 + ": lỗi JS " + p.errs.slice(0, 2).join(" | "));
        await p.evaluate(() => WorldPass.PF.lockPro()); await sleep(300);
        const un = await p.evaluate(() => ({ wp: !!document.documentElement.dataset.wp, css: !!document.getElementById("wpCss"), nm: 0, force: !!window.NPArtSkinForce }));
        note(!un.wp && !un.css && !un.nm && !un.force, t2 + ": lockPro chưa về free " + JSON.stringify(un)); await p.close();
      }
      note(hashes.freeHome !== hashes[g.themes[0] + "Home"] && hashes[g.themes[0] + "Home"] !== hashes[g.themes[1] + "Home"], tag + ": ảnh màn chọn không khác nhau");
      note(hashes[g.themes[0] + "World"] !== hashes[g.themes[1] + "World"], tag + ": ảnh màn chơi 2 giao diện giống nhau");
    }
  } finally { await br.close(); srv.kill(); }
  console.log(fails.length ? "\n✗ " + fails.length + " lỗi" : "\n✓ Night Pass 2 game lớn đạt"); process.exit(fails.length ? 1 : 0);
})();
