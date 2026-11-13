/* Điện thoại / iPad DỌC: nội dung (tên game, thanh điểm, khung chơi) NEO SÁT hàng nút trên cùng, không căn giữa phần màn hình còn lại (GAME_RULES 0a-23).
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-anchor.js [--quick] [--shots=<thư mục>] [id,id,...]   (tự chạy http.server cổng NP_PORT hoặc 8949)
   Mọi game Cozy + Pop, mở trực tiếp ở 390x844, 430x932 (bản đủ thêm 320x568, 768x1024, 1032x1376 = iPad Pro 13), màn chọn:
   - phần tử nội dung đầu tiên bên dưới hàng nút (đáy hàng nút = 72px) bắt đầu trong khoảng 8..40px dưới hàng nút (trước đây 60–250px);
   - khoảng trống phía trên nội dung <= khoảng trống phía dưới (khung không lệch xuống dưới; bỏ qua khi màn đã kín: trống trên <= 24px, hoặc nội dung đã chạm đáy — màn chọn dọc cao: linh vật to giữa, cụm nút ở đáy);
   - khối nội dung nằm giữa theo chiều ngang (lệch <= 4% bề rộng);
   - không cuộn. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), args = process.argv.slice(2), quick = args.includes("--quick"), PORT = +process.env.NP_PORT || 8949;
const shots = (args.find(a => a.startsWith("--shots=")) || "").slice(8), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = []; let n = 0;
const dir = g => fs.readdirSync(path.join(root, g, "games")).filter(d => fs.existsSync(path.join(root, g, "games", d, "index.html"))).map(i => [g, i]);
let list = [...dir("cozyplay"), ...dir("popplay")];
if (quick) list = [["cozyplay", "bao-nhieu-giay"], ["cozyplay", "doi-doi-2048"], ["cozyplay", "dap-deadline"], ["cozyplay", "cozy-wings"], ["popplay", "qua-song"], ["popplay", "lang-cua-be"], ["popplay", "pop-fly"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
const SIZES = quick ? [[390, 844]] : [[390, 844], [430, 932], [320, 568], [768, 1024], [1032, 1376]];
const MEASURE = () => {
  const cs = e => getComputedStyle(e), vis = e => { const b = e.getBoundingClientRect(); return b.width > 4 && b.height > 6 && !e.closest("[hidden]") && cs(e).visibility !== "hidden" && +cs(e).opacity > .2; };
  const skip = ".top button,.top a,#npFab,#npFan,#npPmFab,#npPmFan,#npPmBk,#npWide,.deco,.dc,#npDifBadge,[class^=ns-],[id^=ns],#npResume,.toast,#toast";
  /* hàng nút trên cùng: đáy của nút ← / ⋯ / 🔊 */
  let row = 0; document.querySelectorAll("#bBk,#bBack,#npPmBk,#homeBtn,#npFab,#npPmFab,#bSnd,#soundBtn").forEach(e => { if (vis(e)) { const b = e.getBoundingClientRect(); if (b.top < 60) row = Math.max(row, b.bottom); } });
  let top = 1e9, bot = 0;
  document.querySelectorAll("body *").forEach(e => {
    if (e.children.length || !vis(e) || e.closest(skip) || cs(e).position === "fixed") return; const b = e.getBoundingClientRect();
    if (b.top < row - 1 || b.width > innerWidth * 1.01 || b.bottom > innerHeight + 2) return; top = Math.min(top, b.top); bot = Math.max(bot, b.bottom);
  });
  const de = document.documentElement;
  /* khối nội dung phải nằm GIỮA theo chiều ngang (neo dọc không được kéo lệch ngang: Đập Deadline từng dồn sang trái ở iPad) */
  let l = 1e9, r = 0; document.querySelectorAll("body *").forEach(e => { if (e.children.length || !vis(e) || e.closest(skip) || cs(e).position === "fixed") return; const b = e.getBoundingClientRect(); if (b.top < row - 1 || b.width > innerWidth * 1.01 || b.bottom > innerHeight + 2) return; l = Math.min(l, b.left); r = Math.max(r, b.right); });
  return { row: Math.round(row), top: Math.round(top), bot: Math.round(bot), H: innerHeight, off: Math.round((l + r) / 2 - innerWidth / 2), scroll: de.scrollHeight > innerHeight + 1 || de.scrollWidth > innerWidth + 1 };
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  if (shots) fs.mkdirSync(shots, { recursive: true });
  try {
    for (const [W, H] of SIZES) {
      const pg = await br.newPage(); await pg.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      await pg.evaluateOnNewDocument(() => { try { localStorage.setItem("theme", "dark"); localStorage.setItem("np-sound", "0"); localStorage.setItem("lang", "vi"); } catch (e) {} try { speechSynthesis.speak = () => {}; } catch (e) {} });
      for (const [g, id] of list) {
        const tag = `${g}/${id} ${W}x${H}`, bad = m => fails.push(tag + ": " + m); n++;
        await pg.goto("about:blank"); await pg.goto(`http://localhost:${PORT}/${g}/games/${id}/index.html`, { waitUntil: "load" }); await wait(900);
        const m = await pg.evaluate(MEASURE), gap = m.top - m.row;
        if (!m.row) bad("không thấy hàng nút trên cùng");
        else if (gap < 4) bad(`nội dung đè hàng nút (cách ${gap}px)`);
        else if (gap > 40) bad(`nội dung cách hàng nút ${gap}px > 40px (chưa neo lên trên)`);
        if (m.row && gap > 24 && (m.H - m.bot) > 24 && gap > (m.H - m.bot) + 2) bad(`khối nội dung lệch xuống dưới (trống trên ${gap}px > trống dưới ${m.H - m.bot}px)`);
        if (Math.abs(m.off) > Math.max(24, W * .04)) bad(`khối nội dung lệch ngang ${m.off}px so với giữa màn`);
        if (m.scroll) bad("trang bị cuộn");
        if (shots) await pg.screenshot({ path: path.join(shots, `${id}-${W}x${H}.png`) });
      }
      await pg.close();
    }
  } finally { await br.close(); srv.kill(); }
  if (fails.length) { console.log(fails.map(f => "✗ " + f).join("\n")); console.log(`✗ check-anchor: ${fails.length} lỗi / ${n} ca`); process.exit(1); }
  console.log(`✓ nội dung neo sát hàng nút đạt (${n} ca)`);
})();
