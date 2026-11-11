/* Kiểm tra menu ⋯ của Pop Play qua TRANG CỔNG (shared/popmenu.js). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-popmenu.js [--quick] [--shots=<thư mục>] [id,id]
   12 game × vi/en × (điện thoại 390x844, 320x568 | iPad dọc 768x1024, 834x1194 | ngang 844x390, 1024x768, 1194x834) × (màn chọn, đang chơi).
   Đạt khi: dọc → có ← | tên | 🔊 | ⋯ (🔊 ngoài menu ≥44px ở cả điện thoại và iPad, không đè), ô "Khoá màn chơi" nằm trong menu (không còn #klock rời) và luồng khoá/mở khoá chạy, có ← và ⋯ (≥44px), cổng không còn nút nổi, panel không tràn và nút trong panel ≥44px, "?" mở được thẻ,
   tên game không bị cắt, tối đa 2 dòng, không đè nút, cách khối kế dưới ≤16px, không cuộn; ngang → KHÔNG có ⋯ / dock và 🔊 còn ở thanh trên. --quick: 3 game, 2 cỡ mỗi nhóm. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8877, args = process.argv.slice(2);
const quick = args.includes("--quick"), shots = (args.find(a => a.startsWith("--shots=")) || "").slice(8), only = args.find(a => !a.startsWith("--"));
let ids = fs.readdirSync(path.join(root, "popplay/games")); if (only) ids = only.split(","); else if (quick) ids = ids.slice(0, 3);
const SIZES = quick ? [[390, 844], [768, 1024], [844, 390], [1024, 768]] : [[390, 844], [320, 568], [768, 1024], [834, 1194], [844, 390], [1024, 768], [1194, 834]];
const bad = [];
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await new Promise(r => setTimeout(r, 1200));
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  if (shots) fs.mkdirSync(shots, { recursive: true });
  for (const id of ids) for (const lang of ["vi", "en"]) for (const [w, h] of SIZES) {
    const pg = await br.newPage(), errs = []; pg.on("pageerror", e => errs.push(e.message));
    await pg.setViewport({ width: w, height: h, isMobile: true, hasTouch: true });
    await pg.evaluateOnNewDocument(l => { localStorage.setItem("np-sound", "0"); localStorage.setItem("lang", l); localStorage.setItem("pophelp-seen:x", "1"); }, lang);
    await pg.goto("http://localhost:" + PORT + "/popplay/index.html?lang=" + lang + "#" + id); await new Promise(r => setTimeout(r, 1700));
    /* ≥1100x600 ngang: trang cổng có hai cột bên lề → khung game hẹp và dọc, nên dùng menu ⋯ như iPad dọc (rails.js) */
    const fr = pg.frames().find(f => f !== pg.mainFrame()), tag = id + " " + lang + " " + w + "x" + h, mode = h > w ? (w <= 520 ? "p" : "t") : (w >= 1100 && h >= 600 ? "t" : "");
    if (!fr) { bad.push(tag + ": không có iframe"); await pg.close(); continue; }
    const meas = async st => {
      const r = await fr.evaluate(() => {
        const q = s => document.getElementById(s), R = e => { if (!e) return null; const b = e.getBoundingClientRect(), cs = getComputedStyle(e); return { x: b.x, y: b.y, w: b.width, h: b.height, vis: cs.display !== "none" && cs.visibility !== "hidden" && b.width > 0 }; };
        const t = q("title"), tp = document.querySelector(".top"), nx = (tp && tp.nextElementSibling) || document.querySelector(".play"), tb = t.getBoundingClientRect(), nb = nx.getBoundingClientRect(), lh = parseFloat(getComputedStyle(t).lineHeight) || parseFloat(getComputedStyle(t).fontSize) * 1.1;
        const pn = document.querySelector("#npPmFan .pn");
        return { fab: R(q("npPmFab")), bk: R(q("npPmBk")), t: R(t), cut: t.scrollWidth > t.clientWidth + 1, lines: Math.round(tb.height / lh), gap: nb.top - tb.bottom,
          items: [...document.querySelectorAll("#npPmFan .it")].filter(e => getComputedStyle(e).display !== "none").map(e => { const b = e.getBoundingClientRect(); return { id: e.id, w: b.width, h: b.height }; }),
          snd: R(q("soundBtn")), sndPressed: !!(q("soundBtn") && q("soundBtn").hasAttribute("aria-pressed")), klockShown: (() => { const k = parent.document.getElementById("klock"); return !!(k && getComputedStyle(k).display !== "none" && k.getBoundingClientRect().width > 0); })(), lockItem: (() => { const it = q("npPmLock"); if (!it) return "không có"; if (!it.closest("#npPmFan")) return "không nằm trong menu"; if (it.hidden) return "ẩn"; const b = it.getBoundingClientRect(); return b.width < 44 || b.height < 44 ? "nhỏ <44px" : "ok"; })(), sndIn: !!(q("soundBtn") && q("soundBtn").closest("#npPmFan")), lang: R(q("langBtn")), hs: document.documentElement.scrollWidth > innerWidth + 1, vs: document.documentElement.scrollHeight > innerHeight + 1,
          dock: !!window.__npDock, sd: parent.document.getElementById("stage").classList.contains("docked"), nps: [...parent.document.querySelectorAll("#stage .nps-fab,#stage #home")].map(e => getComputedStyle(e).display) };
      });
      const n = m => bad.push(tag + " " + st + ": " + m);
      if (mode) {
        if (!r.dock || !r.sd) n("chưa docked"); if (!r.fab || !r.fab.vis || r.fab.w < 44) n("thiếu ⋯ ≥44px"); if (!r.bk || !r.bk.vis || r.bk.w < 44) n("thiếu ← ≥44px");
        if (r.nps.some(d => d !== "none")) n("nút nổi của cổng còn hiện " + r.nps);
        if (!r.snd || !r.snd.vis || r.sndIn || r.snd.w < 43.5 || r.snd.h < 43.5) n("🔊 phải ở NGOÀI menu, ≥44px (điện thoại + iPad dọc)");
        if (r.snd && r.fab && r.snd.x + r.snd.w > r.fab.x + 0.5) n("🔊 chồng lên ⋯"); if (r.snd && r.bk && r.snd.x < r.bk.x + r.bk.w) n("🔊 chồng lên ←"); if (r.snd && !r.sndPressed) n("🔊 thiếu aria-pressed");
        if (r.klockShown) n("còn nút khoá #klock rời trên thanh điều khiển (phải gom vào menu)"); if (r.lockItem !== "ok") n("ô khoá màn chơi trong menu: " + r.lockItem);
        if (r.items.length < (mode === "p" ? 4 : 3)) n("bảng thiếu ô " + JSON.stringify(r.items));
        if (r.items.some(i => i.w < 44 || i.h < 44)) n("ô trong bảng <44px");
        const o = (a, b) => a && b && a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
        if (o(r.t, r.bk) || o(r.t, r.fab) || o(r.t, r.snd)) n("tên đè nút");
        if (r.cut) n("tên bị cắt “…”"); if (r.lines > 2) n("tên " + r.lines + " dòng"); if (r.gap > 16.5 || r.gap < -1) n("tên cách khung " + Math.round(r.gap) + "px (cần ≤16)");
      } else {
        if (r.fab && r.fab.vis) n("⋯ hiện ở màn ngang"); if (r.dock || r.sd) n("dock ở màn ngang"); if (!(r.snd && r.snd.vis)) n("🔊 mất ở màn ngang");
      }
      if (r.hs || r.vs) n("tràn/cuộn " + r.hs + "/" + r.vs);
    };
    await meas("màn chọn");
    if (shots && (w === 390 || w === 768 || w === 1024)) await pg.screenshot({ path: path.join(shots, `${id}-${lang}-${w}x${h}-chon.png`) });
    if (mode) {
      await fr.evaluate(() => document.getElementById("npPmFab").click()); await new Promise(r => setTimeout(r, 400));
      if (shots && (w === 390 || w === 768)) await pg.screenshot({ path: path.join(shots, `${id}-${lang}-${w}x${h}-menu.png`) });
      const pr = await fr.evaluate(() => { const p = document.querySelector("#npPmFan .pn").getBoundingClientRect(); return p.left < 0 || p.right > innerWidth || p.bottom > innerHeight; });
      if (pr) bad.push(tag + ": panel tràn màn");
      if (w === 390 || w === 768) {   /* luồng khoá: bấm ô khoá → menu đóng + hộp xác nhận của kidlock; "Thôi" đóng; khoá → np-locked (ẩn ⋯, hiện chỉ báo); release() mở lại */
        const L = await fr.evaluate(async () => {
          const P = parent, w = ms => new Promise(r => setTimeout(r, ms)), out = {}; document.getElementById("npPmLock").click(); await w(500);
          out.closed = !document.getElementById("npPmFan").classList.contains("open"); out.box = !!P.document.getElementById("klO");
          const g = P.document.querySelector("#klO .klg"); if (g) { g.click(); await w(400); }
          out.locked = !!(P.NPKidLock && P.NPKidLock.locked()); out.flag = document.documentElement.classList.contains("np-locked");
          out.fabHidden = getComputedStyle(document.getElementById("npPmFab")).display === "none"; out.ind = getComputedStyle(P.document.getElementById("klind")).display !== "none";
          P.NPKidLock.release(); await w(300); out.after = !P.NPKidLock.locked() && !document.documentElement.classList.contains("np-locked") && getComputedStyle(document.getElementById("npPmFab")).display !== "none";
          return out; });
        if (!(L.closed && L.box)) bad.push(tag + ": bấm ô khoá không đóng menu / không hiện hộp xác nhận " + JSON.stringify(L));
        if (!(L.locked && L.flag && L.fabHidden && L.ind)) bad.push(tag + ": trạng thái khoá sai " + JSON.stringify(L)); if (!L.after) bad.push(tag + ": release() không trả giao diện");
        await fr.evaluate(() => document.getElementById("npPmFab").click()); await new Promise(r => setTimeout(r, 400));
      }
      const opened = await fr.evaluate(() => { document.getElementById("phBtn").click(); return new Promise(r => setTimeout(() => r(!document.getElementById("phOv").hidden), 300)); });
      if (!opened) bad.push(tag + ": “?” trong bảng không mở được thẻ");
      await fr.evaluate(() => { const g = document.getElementById("phGo"); if (g) g.click(); });
    }
    await fr.evaluate(() => { try { if (typeof startSession === "function") startSession(Object.keys(window.ZONES || {})[0] || 0); else if (typeof startRound === "function") startRound("letters"); else if (typeof begin === "function") begin(0); } catch (e) {} });
    await new Promise(r => setTimeout(r, 800)); await meas("đang chơi");
    if (errs.length) bad.push(tag + ": lỗi JS " + errs[0]);
    await pg.close();
  }
  await br.close(); srv.kill();
  console.log(bad.length ? bad.join("\n") + "\n✗ " + bad.length + " lỗi menu Pop Play" : "✓ menu ⋯ Pop Play đạt (" + ids.length + " game)");
  process.exit(bad.length ? 1 : 0);
})();
