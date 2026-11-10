/* Kiểm tra CĂN LỀ + KÍCH THƯỚC ICON ở mép màn hình (lỗi "icon lệch" trên iPhone thật; GAME_RULES 0a-12). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-align.js [--shots=<thư mục ảnh>]   (tự chạy http.server cổng 8878)
   Trang: cozyplay/index, popplay/index, index (hub), cozyplay/multi (+ ?portal=pop; màn trống + popup chọn game) ở 320x568, 375x667, 390x844, 430x932, 768x1024.
   Điều kiện (sai số 1px, dùng getBoundingClientRect):
     - mép phải của nút cuối header (⋯/Night Pass), #findFab, #lock = vw - 16 (--gutter); mép trái logo = 16; mọi nút icon xếp dọc ở mép phải CÙNG tâm X;
     - mép phải của ô game ngoài cùng = vw - 16 và mép trái = 16 (lưới thẳng lề với icon) ở điện thoại dọc;
     - icon cùng hàng (header) cùng tâm Y; nút icon ≥ 44x44 (header, #findFab, #lock, ‹ + ✕ ‹ › của multi);
     - KHÔNG có box-shadow ngoài (spread > 0) trên nút icon: vòng phát sáng ngoài làm nút trông to hơn khung và lệch mép;
     - multi: ‹ cách mép trái 16, + cách mép phải 16, cùng tâm Y; popup: ✕ ‹ › Start nằm trọn trong thẻ, ‹ › Start cùng tâm Y, card cách mép ≥ 16 (trừ khi màn quá hẹp).
   Lưu ý: Chrome không mô phỏng safe-area; WebKit (Playwright) đã đo tay ở iPhone SE/14/15 Pro Max cho kết quả giống. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8878, B = "http://localhost:" + PORT + "/", fails = [];
const shotDir = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8);
const VPS = [[320, 568], [375, 667], [390, 844], [430, 932], [768, 1024]];
const PAGES = [["cozyplay/index.html", "cozy"], ["popplay/index.html", "pop"], ["index.html", "hub"], ["cozyplay/multi.html?lang=en", "multi"], ["cozyplay/multi.html?portal=pop&lang=vi", "multi"]];
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
/* chạy trong trang: trả về hộp của các phần tử theo selector (chỉ phần tử đang hiện) */
const BOXES = sels => {
  const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4 && s.visibility !== "hidden" && s.display !== "none" && !e.closest("[hidden]"); };
  const out = {};
  for (const [k, sel] of Object.entries(sels)) out[k] = [...document.querySelectorAll(sel)].filter(vis).map(e => {
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    const outer = (cs.boxShadow || "").split(/,(?![^(]*\))/).map(x => x.trim()).filter(x => x && x !== "none" && !/inset/.test(x)).map(x => { const m = x.replace(/rgba?\([^)]*\)|color\([^)]*\)|#[0-9a-f]+/gi, "").trim().split(/\s+/).map(parseFloat); return m.length >= 4 ? m[3] : 0; }).filter(v => v > 0);
    return { id: e.id || e.className.toString().slice(0, 16), l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2, ring: outer.length ? Math.max(...outer) : 0 };
  });
  out.vw = document.documentElement.clientWidth; out.vh = innerHeight; out.sw = document.documentElement.scrollWidth;
  return out;
};
const near = (a, b, t = 1) => Math.abs(a - b) <= t;
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  try {
    for (const [url, kind] of PAGES) for (const [w, h] of VPS) {
      const tag = url.replace(/\.html|\?lang=\w+/g, "").replace("?portal=pop&lang=vi", " pop") + " " + w + "x" + h, ph = w <= 520;
      const pg = await br.newPage(); await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      await pg.evaluateOnNewDocument(() => { try { localStorage.setItem("lang", "en"); } catch (e) {} });
      await pg.goto(B + url, { waitUntil: "load" }); await wait(900);
      const shot = async n => { if (shotDir) { fs.mkdirSync(shotDir, { recursive: true }); await pg.screenshot({ path: path.join(shotDir, n.replace(/[^\w.-]+/g, "_") + ".png") }); } };
      if (kind !== "multi") {
        const bx = await pg.evaluate(BOXES, { navBtn: "nav.nav .tools > :is(.pill,.bars-more,.ico,button,a)", mark: "nav.nav .mark", fab: "#findFab", lock: "#lock", tile: "#grid .tile" });
        const tools = bx.navBtn, last = tools[tools.length - 1];
        note(bx.sw <= bx.vw + 1, tag, "tràn ngang " + bx.sw + ">" + bx.vw);
        if (bx.mark[0]) note(near(bx.mark[0].l, 16), tag, "logo cách mép trái " + bx.mark[0].l.toFixed(1) + " (cần 16)");
        if (last && ph) note(near(bx.vw - last.r, 16), tag, "nút cuối header (" + last.id + ") cách mép phải " + (bx.vw - last.r).toFixed(1) + " (cần 16)");
        tools.forEach(t => { note(t.w >= 43.5 && t.h >= 43.5, tag, "nút header " + t.id + " nhỏ " + t.w.toFixed(1) + "x" + t.h.toFixed(1)); note(t.ring === 0, tag, "nút header " + t.id + " có vòng sáng NGOÀI " + t.ring + "px"); });
        tools.concat(bx.mark).forEach(t => note(near(t.cy, tools[0].cy), tag, "header lệch tâm Y: " + t.id + " " + t.cy.toFixed(1) + " vs " + tools[0].cy.toFixed(1)));
        const col = [last, bx.fab[0], bx.lock[0]].filter(Boolean);
        if (ph) col.forEach(t => { note(near(bx.vw - t.r, 16), tag, t.id + " cách mép phải " + (bx.vw - t.r).toFixed(1) + " (cần 16)"); note(near(t.cx, col[0].cx), tag, t.id + " lệch tâm X " + t.cx.toFixed(1) + " vs " + col[0].cx.toFixed(1)); });
        [bx.fab[0], bx.lock[0]].filter(Boolean).forEach(t => { note(t.w >= 43.5 && t.h >= 43.5, tag, t.id + " nhỏ " + t.w.toFixed(1) + "x" + t.h.toFixed(1)); note(t.ring === 0, tag, t.id + " có vòng sáng NGOÀI " + t.ring + "px"); });
        if (ph && bx.tile.length > 1) { const vt = bx.tile.filter(t => t.l >= -1 && t.l < bx.vw - 8), L = Math.min(...vt.map(t => t.l)), R = Math.max(...vt.map(t => t.r)); note(near(L, 16, 1.5), tag, "lưới game cách mép trái " + L.toFixed(1) + " (cần 16)"); note(near(bx.vw - R, 16, 1.5), tag, "lưới game cách mép phải " + (bx.vw - R).toFixed(1) + " (cần 16)"); }
        if (bx.fab[0] && bx.mark[0]) note(bx.fab[0].t >= tools[0].b - 1, tag, "#findFab đè lên thanh trên");
        await shot(tag);
      } else {
        const empty = await pg.evaluate(() => { const e = document.getElementById("empty"); return !!e && !e.hidden; });
        note(empty, tag, "không thấy màn trống (cần mở không kèm game)");
        const bx = await pg.evaluate(BOXES, { back: "#bBack", add: "#bAdd", pick: "#emPick" });
        const b = bx.back[0], a = bx.add[0];
        if (b && a) {
          note(near(b.l, 16), tag, "‹ cách mép trái " + b.l.toFixed(1) + " (cần 16)"); note(near(bx.vw - a.r, 16), tag, "+ cách mép phải " + (bx.vw - a.r).toFixed(1) + " (cần 16)");
          note(near(b.cy, a.cy), tag, "‹ và + lệch tâm Y " + b.cy.toFixed(1) + "/" + a.cy.toFixed(1));
          [b, a].forEach(t => note(t.w >= 43.5 && t.h >= 43.5, tag, t.id + " nhỏ " + t.w.toFixed(1) + "x" + t.h.toFixed(1)));
        } else note(false, tag, "thiếu ‹ hoặc +");
        await shot(tag + "-empty");
        await pg.evaluate(() => document.getElementById("emPick").click()); await wait(500);
        const sh = await pg.evaluate(BOXES, { card: ".sh", x: "#shX", cnt: "#shCnt", prev: "#pgPrev", next: "#pgNext", go: "#bStart", q: ".srch" });
        const c = sh.card[0];
        if (c) {
          if (ph) { note(c.l >= 15, tag, "popup cách mép trái " + c.l.toFixed(1) + " (<16)"); note(sh.vw - c.r >= 15, tag, "popup cách mép phải " + (sh.vw - c.r).toFixed(1) + " (<16)"); }
          for (const k of ["x", "prev", "next", "go", "cnt", "q"]) { const t = sh[k][0]; if (!t) { note(false, tag, "popup thiếu " + k); continue; } note(t.l >= c.l - .5 && t.r <= c.r + .5 && t.t >= c.t - .5 && t.b <= c.b + .5, tag, "popup: " + k + " vượt khỏi thẻ"); if (k !== "cnt" && k !== "q") note(t.w >= 43.5 && t.h >= 43.5, tag, "popup: " + k + " nhỏ " + t.w.toFixed(1) + "x" + t.h.toFixed(1)); }
          const f = ["prev", "next", "go"].map(k => sh[k][0]).filter(Boolean); f.forEach(t => note(near(t.cy, f[0].cy), tag, "popup: ‹ › Start lệch tâm Y"));
          if (sh.x[0]) { const hx = sh.x[0], pad = hx.t - c.t; note(near(c.r - hx.r, pad, 6), tag, "popup: ✕ cách mép phải thẻ " + (c.r - hx.r).toFixed(1) + " khác cách mép trên " + pad.toFixed(1)); }
          if (sh.x[0] && sh.prev[0]) note(near(sh.prev[0].l - c.l, c.r - sh.x[0].r, 3), tag, "popup: ‹ (lề trái " + (sh.prev[0].l - c.l).toFixed(1) + ") và ✕ (lề phải " + (c.r - sh.x[0].r).toFixed(1) + ") không đối xứng");
        } else note(false, tag, "không mở được popup chọn game");
        await shot(tag + "-picker");
      }
      note(true, tag, ""); await pg.close();
    }
  } finally { await br.close(); srv.kill(); }
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi căn lề icon" : "✓ căn lề icon đạt (" + PAGES.length * VPS.length + " ca)")); process.exit(fails.length ? 1 : 0);
})();
