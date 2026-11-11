/* Tên game Pop Play dạng nhãn dán (shared/poptitle.css|js). Chạy: NODE_PATH=<puppeteer-core> node scripts/cozygame/check-poptitle.js [--quick]
   12 game Pop × 390x844, 360x640, 844x390, 768x1024, 1194x834, 1440x900 × sáng/tối × VI/EN (--quick: 4 game, 3 cỡ, tối, VI+EN):
   tên ≤2 dòng, không tràn (scrollWidth<=clientWidth), nằm trong viewport, không giao nút, font Inter, độ đậm >=800, có gradient + viền,
   KHÔNG animation vô hạn khi nghỉ, màn không cuộn. Thêm: qua cổng 1440x900 tên ở cột HUD cũng là nhãn dán. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8893, B = "http://localhost:" + PORT + "/", quick = process.argv.includes("--quick"), fails = [];
const note = (ok, msg) => { if (!ok) { fails.push(msg); console.log("  ✗ " + msg); } };
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await new Promise(r => setTimeout(r, 1200));
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let ids = fs.readdirSync(path.join(root, "popplay/games")).sort();
  const only = (process.argv.find(a => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean); if (only.length) ids = ids.filter(i => only.includes(i));
  if (quick) ids = ["bo-me-5-giay", "ve-chu-quai-vat", "be-noi-dung-khong", "doan-tuoi-nao"];
  const sizes = quick ? [[390, 844], [360, 640], [844, 390]] : [[390, 844], [360, 640], [844, 390], [768, 1024], [1194, 834], [1440, 900]];
  const themes = quick ? ["dark"] : ["light", "dark"];
  const measure = () => {
    const t = document.getElementById("title"), de = document.documentElement; if (!t) return { none: 1 };
    const cs = getComputedStyle(t), r = t.getBoundingClientRect(), pl = t.querySelector(".pl"), pcs = getComputedStyle(pl || t);
    const tops = new Set([].map.call(t.querySelectorAll(".pw"), w => Math.round(w.offsetTop / 6)));
    /* hộp chữ thật = hợp các từ (không tính khoảng đệm), nới 1px */
    let L = 1e9, T = 1e9, R = -1, Bt = -1; [].forEach.call(t.querySelectorAll(".pw"), w => { const q = w.getBoundingClientRect(); L = Math.min(L, q.left); T = Math.min(T, q.top + 4); R = Math.max(R, q.right); Bt = Math.max(Bt, q.bottom - 4); });
    const hit = [].filter.call(document.querySelectorAll("button,a,.ib,[role=button]"), b => { if (t.contains(b) || b.contains(t)) return false; const q = b.getBoundingClientRect(), s = getComputedStyle(b); if (q.width < 8 || q.height < 8 || s.visibility === "hidden" || s.display === "none") return false;
      for (let a = b; a && a !== document.body; a = a.parentElement) if (+getComputedStyle(a).opacity === 0 || a.hidden) return false;   /* menu ⋯ đang đóng: vô hình */
      const x0 = Math.max(q.left, L), x1 = Math.min(q.right, R), y0 = Math.max(q.top, T), y1 = Math.min(q.bottom, Bt); if (x1 - x0 <= 2 || y1 - y0 <= 2) return false;
      const e = document.elementFromPoint((x0 + x1) / 2, (y0 + y1) / 2); return !!e && (b.contains(e) || t.contains(e)); }).map(b => b.id || b.className || b.tagName);
    const inf = t.getAnimations({ subtree: true }).filter(a => { const e = a.effect && a.effect.getComputedTiming(); return e && e.iterations === Infinity; }).length;
    return { txt: t.textContent, lines: tops.size, over: t.scrollWidth > t.clientWidth + 1, L, R, T, Bt, vw: de.clientWidth, vh: innerHeight, ff: cs.fontFamily, fw: +cs.fontWeight, hit, inf,
      grad: /gradient/.test(pcs.backgroundImage) && /text/.test(pcs.webkitBackgroundClip || pcs.backgroundClip), flt: (cs.filter.match(/drop-shadow/g) || []).length, wrapped: !!pl, hs: de.scrollWidth > innerWidth + 1, vs: de.scrollHeight > innerHeight + 1, anim: t.classList.contains("pt-anim") };
  };
  for (const id of ids) {
    console.log("== " + id);
    for (const th of themes) for (const lang of ["vi", "en"]) for (const [w, h] of sizes) {
      const pg = await br.newPage(); const er = []; pg.on("pageerror", e => er.push(e.message));
      await pg.setViewport({ width: w, height: h, isMobile: w < 600, hasTouch: w < 600 });
      await pg.evaluateOnNewDocument((t, l) => { localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", t); localStorage.setItem("lang", l); }, th, lang);
      let m; for (let k = 0; k < 3 && !m; k++) { try {   /* trang có thể tự tải lại (updated.js khi sw.js đổi): thử lại */
        await pg.goto(B + "popplay/games/" + id + "/index.html?lang=" + lang); await new Promise(r => setTimeout(r, 1900));
        await pg.waitForFunction(() => { const t = document.getElementById("title"); return !t || !t.classList.contains("pt-anim"); }, { timeout: 4000 }).catch(() => {});
        m = await pg.evaluate(measure); } catch (e) { await new Promise(r => setTimeout(r, 1500)); } }
      if (!m) { note(false, id + " " + th + " " + lang + " " + w + "x" + h + ": không đo được (trang liên tục tải lại)"); await pg.close(); continue; }
      const tag = id + " " + th + " " + lang + " " + w + "x" + h + ": ";
      if (m.none) note(false, tag + "không có #title");
      else {
        note(m.wrapped, tag + "chưa bọc chữ (poptitle.js)"); note(m.lines <= 2, tag + m.lines + " dòng: " + m.txt); note(!m.over, tag + "tên tràn thẻ: " + m.txt);
        note(m.L >= -1 && m.R <= m.vw + 1 && m.T >= -1 && m.Bt <= m.vh + 1, tag + "tên ngoài màn hình (" + Math.round(m.L) + "," + Math.round(m.T) + "," + Math.round(m.R) + "," + Math.round(m.Bt) + ")");
        note(!m.hit.length, tag + "tên đè nút " + m.hit.join(",")); note(/^"?Inter/.test(m.ff), tag + "phông " + m.ff); note(m.fw >= 800, tag + "độ đậm " + m.fw);
        note(m.grad, tag + "thiếu gradient background-clip:text"); note(m.flt >= 5, tag + "thiếu viền/bóng (drop-shadow)"); note(m.inf === 0, tag + "có animation vô hạn"); note(!m.anim, tag + "hiệu ứng vào chưa dừng");
        note(!m.hs && !m.vs, tag + "màn cuộn/tràn");
      }
      note(!er.length, tag + "lỗi JS " + er.slice(0, 1)); await pg.close();
    }
  }
  /* reduced motion: không animation chữ */
  { const pg = await br.newPage(); await pg.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]); await pg.setViewport({ width: 390, height: 844 });
    await pg.goto(B + "popplay/games/" + ids[0] + "/index.html"); await new Promise(r => setTimeout(r, 600));
    const n = await pg.evaluate(() => document.getAnimations().filter(a => a.animationName === "pt-pop").length); note(n === 0, "reduced-motion: vẫn còn " + n + " animation pt-pop"); await pg.close(); }
  /* qua cổng, màn rộng: tên ở cột HUD cũng là nhãn dán */
  for (const id of quick ? ids.slice(0, 2) : ids) { const pg = await br.newPage(); await pg.setViewport({ width: 1440, height: 900 });
    await pg.evaluateOnNewDocument(() => { localStorage.setItem("np-sound", "0"); localStorage.setItem("lang", "vi"); });
    await pg.goto(B + "popplay/index.html#" + id); await new Promise(r => setTimeout(r, 2200));
    const r = await pg.evaluate(() => { const h = document.querySelector(".np-gname"); if (!h) return { none: 1 }; const q = h.getBoundingClientRect(), p = h.parentElement.getBoundingClientRect(), cs = getComputedStyle(h);
      let L = 1e9, R = -1, T = 1e9, Bt = -1; [].forEach.call(h.querySelectorAll(".pw"), w => { const b = w.getBoundingClientRect(); L = Math.min(L, b.left); R = Math.max(R, b.right); T = Math.min(T, b.top); Bt = Math.max(Bt, b.bottom); });
      const hud = h.closest(".np-hud"), hq = hud && hud.getBoundingClientRect(); return { st: h.classList.contains("pt-title") && !!h.querySelector(".pl"), inside: !hq || (L >= hq.left - 1 && R <= hq.right + 1 && T >= hq.top - 1), ff: cs.fontFamily, fw: +cs.fontWeight }; });
    if (r.none) console.log("  (cổng " + id + ": không có cột HUD ở cỡ này)"); else { note(r.st, "cổng " + id + ": tên ở cột HUD chưa là nhãn dán"); note(r.inside, "cổng " + id + ": tên HUD tràn khỏi khối"); note(/^"?Inter/.test(r.ff) && r.fw >= 800, "cổng " + id + ": phông/độ đậm HUD"); }
    await pg.close(); }
  await br.close(); srv.kill();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi tên game Pop" : "✓ tên game Pop (nhãn dán) đạt")); process.exit(fails.length ? 1 : 0);
})();
