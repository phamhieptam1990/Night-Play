/* Kiểm giao diện MỌI bài học lớp 2–5 bằng Chrome thật: mở bai.html ở vài màn (đầu, câu chọn, tóm tắt, thử cùng, kết bài) ở 360x640:
   không lỗi trang, không cuộn/tràn, chữ đáp án không bị cắt. Chạy: NODE_PATH=<puppeteer-core> node scripts/learn/check-lessons-ui.js [--all]
   Mặc định lấy mẫu 1 bài mỗi lớp x môn; --all kiểm hết. */
"use strict";
const { spawn } = require("child_process"), path = require("path"), fs = require("fs"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.PORT || 8879, ALL = process.argv.includes("--all"), w = ms => new Promise(r => setTimeout(r, ms));
global.window = {}; require(path.join(root, "learn/content/curriculum.js")); const C = global.window.LEARN_CURRICULUM;
const idx = {}; (new Function("window", fs.readFileSync(path.join(root, "learn/content/lessons/index.js"), "utf8").replace("var P=window.LearnPath;if(P)", "var P={lessons:window.__L};")))(Object.assign(global.window, { __L: idx }));
const list = []; for (const sj of Object.keys(C.subjects)) for (const g of C.subjects[sj].grades) { if (g.grade < 2) continue; const ts = g.topics.filter(t => idx[t.id]); (ALL ? ts : ts.slice(0, 1)).forEach(t => list.push({ sj, g: g.grade, id: t.id, n: idx[t.id].n, q: idx[t.id].q })); }
const fails = []; const bad = m => { fails.push(m); console.log("  ✗ " + m); };
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await w(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let n = 0;
  try {
    for (const [li, L] of list.entries()) for (const [W, H] of li < 3 ? [[360, 640], [1180, 820]] : [[360, 640]]) for (const step of W > 360 ? [0, 3, 999] : [0, 3, L.n - 1, L.n, 999]) {   /* vài bài đầu thêm iPad ngang 1180x820 (hai cột) */
      n++; const tag = `${L.id} màn ${step}${W > 360 ? " " + W + "x" + H : ""}`, pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: W < 700 });
      const errs = []; pg.on("pageerror", e => errs.push(e.message));
      await pg.goto(`http://localhost:${PORT}/learn/lop/bai.html?grade=${L.g}&subj=${L.sj}&topic=${L.id}&step=${step}`, { waitUntil: "networkidle0" });
      await pg.evaluate(() => { const b = document.getElementById("sgOn"), g = document.getElementById("spkGate"); if (b && g && !g.hidden) b.click(); }); await w(700);
      const m = await pg.evaluate(() => { const d = document.documentElement, bs = [...document.querySelectorAll("#stage button, #stage .opt")]; return { sy: d.scrollHeight > innerHeight + 2, sx: d.scrollWidth > innerWidth + 1, clip: bs.filter(b => b.scrollWidth > b.clientWidth + 1 || b.scrollHeight > b.clientHeight + 2).map(b => b.textContent.slice(0, 20)), empty: !document.getElementById("stage").children.length }; });
      if (m.empty) bad(tag + ": màn trống"); if (m.sy || m.sx) bad(tag + ": cuộn/tràn"); if (m.clip.length) bad(tag + ": chữ bị cắt " + m.clip.join("|")); if (errs.length) bad(tag + ": lỗi trang " + errs[0]);
      await pg.close();
    }
  } finally { await br.close(); srv.kill(); }
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi bài học (" + n + " màn)" : "✓ giao diện bài học đạt (" + n + " màn, " + list.length + " bài)")); process.exit(fails.length ? 1 : 0);
})();
