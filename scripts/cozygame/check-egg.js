/* Gà Mẹ Bắn Trứng: (1) trứng bắn bay tới hàng trứng đủ nhanh (<= 330 ms cho cú bắn thẳng lên, trước đây ~430 ms);
   (2) Night Pass có hiệu ứng trứng bay (vệt đuôi G.trail + hạt va chạm), Free thì KHÔNG có.
     NODE_PATH=<thư mục puppeteer-core> node scripts/cozygame/check-egg.js [--shots=<thư mục ảnh>] [--old=<file html cũ để so>] */
const { spawn, execSync } = require("child_process"), path = require("path"), fs = require("fs"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.EGG_PORT || 8887;
const args = process.argv.slice(2), SHOTS = (args.find(a => a.startsWith("--shots=")) || "").slice(8), OLD = (args.find(a => a.startsWith("--old=")) || "").slice(6);
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const MAXMS = 330, wait = ms => new Promise(r => setTimeout(r, ms));
const fails = [], note = (ok, m) => { console.log((ok ? "  ✓ " : "  ✗ ") + m); if (!ok) fails.push(m); };
(async () => {
  const srv = spawn("python3", ["-m", "http.server", PORT, "--bind", "127.0.0.1"], { cwd: root, stdio: "ignore" }); await wait(900);
  const src = execSync("node -e \"process.stdout.write(require('./server/pro/ga-me-ban-trung.js').source({}))\"", { cwd: root }).toString();
  const br = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
  const run = async (url, vp, skin, shot) => {
    const pg = await br.newPage(); await pg.setViewport({ width: vp[0], height: vp[1], deviceScaleFactor: 1 });
    await pg.evaluateOnNewDocument(() => { try { localStorage.setItem("gm-tut", "1"); } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + PORT + url, { waitUntil: "load" }); await wait(500);
    const r = await pg.evaluate(async (s, sk) => {
      if (sk) { (0, eval)(s); PF.skinSel = sk; try { applySkin(); } catch (e) {} }
      let best = null;
      for (let i = 0; i < 3; i++) { /* lần đầu có thể trễ do khởi động trang: lấy lần nhanh nhất */
        GM.begin(12345, "free", 0, null, 1); await new Promise(r => setTimeout(r, 500));
        const t0 = performance.now(); let tr = 0; GM.fire(0.02);
        const r = await new Promise(res => { const f = () => { const G = GM.G; if (G.trail) tr = Math.max(tr, G.trail.length); if (G.ball) requestAnimationFrame(f); else res({ ms: performance.now() - t0, tr, fx: G.fx.length }); }; requestAnimationFrame(f); });
        if (!best || r.ms < best.ms) best = r;
      }
      return best;
    }, src, skin);
    if (shot && SHOTS) {
      await pg.evaluate(async () => { GM.begin(777, "free", 0, null, 1); await new Promise(r => setTimeout(r, 300)); GM.fire(0.5); await new Promise(r => setTimeout(r, 200)); });
      await pg.screenshot({ path: path.join(SHOTS, shot + ".png") });
    }
    await pg.close(); return r;
  };
  const URL = "/cozyplay/games/ga-me-ban-trung/index.html";
  for (const vp of [[390, 844], [1440, 900]]) {
    console.log("== " + vp.join("x"));
    const fr = await run(URL, vp, null, "free-" + vp[0]);
    console.log("  Free: bay " + Math.round(fr.ms) + " ms, vệt tối đa " + fr.tr);
    note(fr.ms <= MAXMS, "Free: thời gian bay " + Math.round(fr.ms) + " ms <= " + MAXMS);
    note(fr.tr === 0, "Free: không có vệt đuôi (Night Pass khác hẳn Free)");
    if (OLD) { const o = await run(OLD, vp, null, null); console.log("  Bản cũ: bay " + Math.round(o.ms) + " ms"); }
    for (const sk of ["easter", "gold", "jade", "neon"]) {
      const r = await run(URL, vp, sk, SHOTS && vp[0] === 390 && (sk === "gold" || sk === "neon" || sk === "easter" || sk === "jade") ? "np-" + sk + "-" + vp[0] : null);
      console.log("  " + sk + ": bay " + Math.round(r.ms) + " ms, vệt tối đa " + r.tr + ", hạt sau va chạm " + r.fx);
      note(r.ms <= MAXMS, sk + ": thời gian bay <= " + MAXMS);
      note(r.tr >= 4 && r.tr <= 24, sk + ": có vệt đuôi (4..24 phần tử)");
      note(r.fx >= 10 && r.fx <= 60, sk + ": có hạt va chạm (10..60)");
    }
  }
  await br.close(); srv.kill();
  if (fails.length) { console.log("✗ " + fails.length + " lỗi"); process.exit(1); } console.log("✓ check-egg đạt");
})();
