/* Kiểm tra CHỮ TRONG CÁC THẺ của hai cột bên lề (shared/rails.js + rails.css; GAME_RULES 0a-13): không thẻ nào bị nén chữ.
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-railcards.js [--quick] [--shots=<thư mục>]   (tự chạy http.server cổng 8887)
   MỌI game (Cozy + Pop) × {1100x600, 1194x834, 1440x900, 1920x1080} × {vi tối, en sáng}; ván dở giả cho game kế tiếp (tên khác nhau mỗi lần) VÀ cho game tên dài nhất.
   Mỗi thẻ trong .np-rail: tên ≤2 dòng (tên ô gợi ý ≤3), dòng phụ 1 dòng, mô tả 'Cách chơi' bị cắt ở 3 dòng bằng line-clamp, KHÔNG từ nào bị tách giữa chừng, không tràn ngang thẻ;
   thẻ 'Chơi tiếp' (#npRes): khối chữ rộng ≥110px, cao ≤84px. --quick: 6 game đầu mỗi cổng + game tên dài, 2 cỡ. Thoát mã 1 nếu lỗi. */
const { spawn } = require("child_process"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8887, B = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), quick = args.includes("--quick"), shots = (args.find(a => a.startsWith("--shots=")) || "").slice(8);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [];
const SIZES = quick ? [[1100, 600], [1440, 900]] : [[1100, 600], [1194, 834], [1440, 900], [1920, 1080]];
const SEED = (lang, theme, resIds) => { localStorage.setItem("lang", lang); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", theme); localStorage.setItem("np-welcome-seen", "1"); localStorage.removeItem("np-rails");
  resIds.forEach((id, i) => localStorage.setItem("np-resume:" + id, JSON.stringify({ v: 1, ts: Date.now() - 6 * 3600000 - i * 60000, state: { p: 1 }, daily: false, day: "" }))); };
const MEASURE = () => {
  const out = [], rails = [...document.querySelectorAll(".np-rail")].filter(r => r.offsetParent && r.getBoundingClientRect().width > 0);
  const lines = el => { const r = document.createRange(); r.selectNodeContents(el); const tops = []; for (const q of r.getClientRects()) if (q.width > 0.5 && !tops.some(t => Math.abs(t - q.top) < 3)) tops.push(q.top); return tops.length; };
  const split = el => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n, bad = []; while ((n = w.nextNode())) { const re = /[^\s\-]+/g; let m; while ((m = re.exec(n.nodeValue))) { if (m[0].length < 3) continue; const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const tops = []; for (const q of r.getClientRects()) if (q.width > 0.5 && !tops.some(t => Math.abs(t - q.top) < 3)) tops.push(q.top); if (tops.length > 1) bad.push(m[0]); } } return bad; };
  const RULES = [[".np-res .np-t b", 2], [".np-res .np-t small", 1], [".np-gname:not(.pt-title)", 2], [".np-g span", 3], [".np-c:not(.np-res):not(.np-top):not(.np-how) .np-t b", 2], [".np-t small", 1], [".np-top li span", 1], [".np-how li", 99], [".np-btn span", 1], [".np-about span", 1], [".np-chip", 1], [".np-note", 2], [".np-link", 1], ["h3", 1]];
  for (const r of rails) { const rr = r.getBoundingClientRect();
    for (const [sel, max] of RULES) for (const e of r.querySelectorAll(sel)) { if (!e.offsetParent) continue; const b = e.getBoundingClientRect(); if (b.width < 2) continue;
      { const tr = e.closest(".np-sl-track"); if (tr) { const tb = tr.getBoundingClientRect(); if (b.left >= tb.right - 1 || b.right <= tb.left + 1) continue; } }   /* trang slide đang nằm ngoài khung nhìn (cuộn ngang có chủ ý): chỉ đo trang đang hiện */
      const n = lines(e), cs = getComputedStyle(e), sp = split(e);
      if (n > max && !(cs.textOverflow === "ellipsis" && cs.whiteSpace === "nowrap")) out.push(sel + " " + n + " dòng (>" + max + ") rộng " + Math.round(b.width) + ": " + e.textContent.trim().slice(0, 40));
      if (sp.length) out.push(sel + " tách từ giữa chừng: " + sp.join(","));
      if (b.right > rr.right + 1) out.push(sel + " tràn ngang cột");
      const card = e.closest(".np-c,.np-g,.np-btn,.np-about"); if (card && b.right > card.getBoundingClientRect().right + 1) out.push(sel + " tràn thẻ");
    }
  }
  const res = document.querySelector("#npRes"), o = { errs: out, res: !!res };
  if (res && res.offsetParent) { const t = res.querySelector(".np-t").getBoundingClientRect(), c = res.getBoundingClientRect(), sm = res.querySelector("small");
    o.tw = Math.round(t.width); o.ch = Math.round(c.height); o.name = res.querySelector("b").textContent; o.nl = lines(res.querySelector("b")); o.cut = sm.scrollWidth > sm.clientWidth + 1;
    if (t.width < 110) out.push("Chơi tiếp: khối chữ chỉ rộng " + Math.round(t.width) + " (<110)");
    if (c.height > 84.5) out.push("Chơi tiếp: thẻ cao " + Math.round(c.height) + " (>84)"); }
  for (const r of rails) if (r.scrollHeight > r.clientHeight + 1) out.push("cột " + r.id + " cuộn/tràn " + r.scrollHeight + ">" + r.clientHeight);
  return o;
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let nres = 0, ncut = 0, total = 0;
  for (const portal of ["cozyplay", "popplay"]) {
    const p0 = await br.newPage(); await p0.goto(B + portal + "/index.html"); await wait(1500);
    const games = await p0.evaluate(() => games.map(g => ({ id: g.id, vi: (g.name && g.name.vi) || g.id }))); await p0.close();
    const longest = games.slice().sort((a, b) => b.vi.length - a.vi.length)[0].id;
    const list = quick ? games.slice(0, 6).concat(games.filter(g => g.id === longest && games.indexOf(g) >= 6)) : games;
    console.log("== " + portal + " (" + games.length + " game, dài nhất: " + longest + ")");
    for (const g of list) {
      const gi = games.indexOf(g), next = games[(gi + 1) % games.length].id;
      for (const [lang, theme, res] of [["vi", "dark", [next]], ["en", "light", [longest === g.id ? next : longest]]]) {
        const pg = await br.newPage(); pg._er = []; pg.on("pageerror", e => pg._er.push(e.message));
        await pg.setViewport({ width: SIZES[0][0], height: SIZES[0][1] }); await pg.evaluateOnNewDocument(SEED, lang, theme, res);
        pg.setDefaultNavigationTimeout(90000); await pg.goto(B + portal + "/index.html?lang=" + lang + "#" + g.id).catch(() => pg.goto(B + portal + "/index.html?lang=" + lang + "#" + g.id)); await wait(2200);
        for (const [W, H] of SIZES) { await pg.setViewport({ width: W, height: H }); await wait(900);
          const tag = portal + "/" + g.id + " " + W + "x" + H + " " + lang + "/" + theme + " [chơi tiếp=" + res[0] + "]";
          let m; try { m = await pg.evaluate(MEASURE); } catch (e) { fails.push(tag + ": không đo được"); console.log("  ✗ " + tag + ": không đo được"); continue; }
          total++; if (!m.res) { fails.push(tag + ": không có thẻ Chơi tiếp"); console.log("  ✗ " + tag + ": không có thẻ Chơi tiếp"); } else nres++; if (m.cut) ncut++;
          m.errs.forEach(e => { fails.push(tag + ": " + e); console.log("  ✗ " + tag + ": " + e); });
          if (shots) await pg.screenshot({ path: path.join(shots, "railcards-" + g.id + "-" + W + "-" + lang + "-" + theme + ".png") });
        }
        await pg.close();
      }
    }
  }
  await br.close(); srv.kill();
  console.log("\n" + total + " phép đo, " + nres + " có thẻ Chơi tiếp, dòng phụ bị rút gọn (…) ở " + ncut);
  console.log(fails.length ? "✗ " + fails.length + " lỗi chữ thẻ cột bên lề" : "✓ chữ thẻ cột bên lề đạt"); process.exit(fails.length ? 1 : 0);
})();
