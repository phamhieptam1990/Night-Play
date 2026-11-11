/* Hàng nút trên cùng ở ĐIỆN THOẠI DỌC, đo bằng WebKit THẬT (engine của Safari iPhone) — cùng phép đo với check-backpos.js (scripts/cozygame/toprow.js):
     NODE_PATH=<thư mục có playwright + puppeteer-core> node scripts/cozygame/check-backpos-webkit.js [--quick] [id,id,...]
   Cần Playwright WebKit (npm i playwright && npx playwright install webkit); không có thì in cảnh báo và thoát 0 (không làm hỏng check.js). iPhone SE/12/14/15 Pro Max: 320x568, 375x667, 390x844, 414x896, 430x932, DPR 2, cảm ứng. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path");
let pw; try { pw = require("playwright"); } catch (e) { try { pw = require("playwright-core"); } catch (e2) { console.log("⚠ Không có Playwright → bỏ qua đo WebKit (cài: npm i playwright && npx playwright install webkit)"); process.exit(0); } }
const { ROW } = require("./toprow.js");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.NP_PORT_WK || 8898, args = process.argv.slice(2), quick = args.includes("--quick"), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [];
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")).filter(d => fs.existsSync(path.join(root, "cozyplay/games", d, "index.html"))), POP = fs.readdirSync(path.join(root, "popplay/games"));
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "cozy-wings"], ["cozyplay", "dap-deadline"], ["cozyplay", "ban-co-hieu-toi"], ["cozyplay", "xe-ca-phe"], ["popplay", "pop-fly"], ["popplay", "bo-me-5-giay"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
const SIZES = quick ? [[320, 568], [375, 667], [414, 896]] : [[320, 568], [375, 667], [390, 844], [414, 896], [430, 932]];
(async () => {
  let br; try { br = await pw.webkit.launch(); } catch (e) { console.log("⚠ Không mở được WebKit (" + String(e).split("\n")[0].slice(0, 80) + ") → bỏ qua"); process.exit(0); }
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  for (const [portal, id] of list) {
    for (const [W, H] of SIZES) {
      const ctx = await br.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      await ctx.addInitScript(() => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "dark"); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("np-rails", "1"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); });
      const pg = await ctx.newPage();
      try {
        await pg.goto("http://localhost:" + PORT + "/" + portal + "/index.html?lang=vi#" + id); await wait(3500);
        for (const name of ["chọn", "chơi"]) {
          const fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (!fr) { fails.push(id + " " + W + "x" + H + ": không thấy iframe game"); console.log("  ✗ " + id + " " + W + "x" + H + ": không thấy iframe game"); break; }
          if (name === "chơi") {
            if (portal === "cozyplay") await fr.evaluate(() => { const e = document.getElementById("bPlay") || document.getElementById("bDaily") || document.getElementById("startBtn") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn") || document.querySelector(".tile.daily") || document.querySelector(".tile .main"); e && e.click(); }).catch(() => {});
            else await fr.evaluate("try{begin(0,{})}catch(e){try{startSession(0,null,{})}catch(e2){try{startRound(Object.keys(PF.types||{})[0]||0)}catch(e3){}}}").catch(() => {});
            await wait(1400);
          }
          const r = await pg.evaluate(ROW).catch(e => ({ err: String(e).slice(0, 60) })), tag = "[WebKit] " + id + " " + W + "x" + H + " " + name;
          if (r.err) { fails.push(tag + ": " + r.err); console.log("  ✗ " + tag + ": " + r.err); } else for (const m of r.E) { fails.push(tag + ": " + m); console.log("  ✗ " + tag + ": hàng nút trên cùng: " + m); }
        }
      } catch (e) { fails.push(id + " " + W + "x" + H + ": " + String(e).slice(0, 80)); console.log("  ✗ " + id + " " + W + "x" + H + ": " + String(e).slice(0, 80)); }
      await ctx.close();
    }
  }
  await br.close(); srv.kill();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi hàng nút trên cùng (WebKit)" : "✓ hàng nút trên cùng đều, cùng cỡ, đúng lề (WebKit thật)")); process.exit(fails.length ? 1 : 0);
})();
