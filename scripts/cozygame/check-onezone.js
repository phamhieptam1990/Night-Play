/* Bài đo "MỖI CHẾ ĐỘ CHỈ MỘT NƠI CHỨA NÚT ĐIỀU KHIỂN" (shared/hud.js + rails.js, GAME_RULES.md 0a-20):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-onezone.js [--quick] [--root=<thư mục gốc site>] [--shots=<thư mục>] [--verbose]
   Chế độ: rails (1100x600, 1194x834, 1271x684, 1440x900, 1920x1080) = khối HUD #npHud đầu cột trái; ngang không cột (1024x768, 844x390, 667x375) = cột nút bên trái khung #npHudc (+ ←);
   điện thoại dọc (390x844) = hàng nút trên cùng trong game (← ⏸ 🔊 ⋯) + menu ⋯.
   Kiểm cho MỌI game (Cozy 20 + Pop 12) × chế độ, ở màn chọn và (nếu bấm được nút bắt đầu) màn chơi:
   (a) không còn nút điều khiển (id trong CTRL) hiện ở NGOÀI khối quy định (nút nội dung chơi: ô chọn, đáp án, skin, album, thanh công cụ ↶ 🗑 ⚡ 💡… KHÔNG tính; danh sách ngoại lệ ở CONTENT);
   (b) thứ tự các nút trong khối = KEYS (? 🔊 ngôn ngữ ↻ ⏸ 🏆 📷 📤 🔒 🍜) và vị trí tăng dần theo thứ tự đó (giống nhau giữa các game);
   (c) rails: nút thu gọn cột ở góc TRÊN-TRÁI (cạnh ←), nút mở lại (.np-tab) sau khi thu NẰM ĐÚNG CÙNG toạ độ, không bao giờ ở nửa dưới màn hình;
   (d) mỗi chức năng điều khiển mà game có (nút gốc không hidden) có ĐÚNG MỘT nút hiện, bấm được trong khối; bấm hộ đúng nút thật (đếm click); 🔊 và ngôn ngữ phản chiếu trạng thái đúng.
   --games=id,id: chỉ các game đó; --port=N: cổng http (chạy song song nhiều tiến trình). --quick: 3 game đại diện × 5 chế độ (nối vào check.js). --all-games: cả 32 game × 5 chế độ. Không cờ: 32 game × 9 chế độ. Thoát mã 1 nếu có lỗi. */
const { spawn } = require("child_process"), path = require("path"), fs = require("fs"), puppeteer = require("puppeteer-core");
const args = process.argv.slice(2), quick = args.includes("--quick"), verbose = args.includes("--verbose");
const root = (args.find(a => a.startsWith("--root=")) || "").slice(7) || path.join(__dirname, "..", ".."), shots = (args.find(a => a.startsWith("--shots=")) || "").slice(8);
const PORT = +((args.find(a => a.startsWith("--port=")) || "").slice(7)) || 8887 , B = "http://localhost:" + PORT + "/";
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [], note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const KEYS = ["help", "snd", "lang", "restart", "pause", "board", "cam", "shr", "lock", "pass"];
const COZY = fs.readdirSync(path.join(root, "cozyplay", "games")).sort(), POP = fs.readdirSync(path.join(root, "popplay", "games")).sort();
const allG = args.includes("--all-games");
const GAMES = quick && !allG ? [["cozyplay", "ga-me-ban-trung"], ["cozyplay", "dap-deadline"], ["popplay", "pop-fly"]] : COZY.map(g => ["cozyplay", g]).concat(POP.map(g => ["popplay", g]));
const only = ((args.find(a => a.startsWith("--games=")) || "").slice(8)).split(",").filter(Boolean);
const GAMES2 = only.length ? GAMES.filter(g => only.includes(g[1])) : GAMES;
const MODES = (quick || allG ? [[1271, 684, 0, "rails"], [1194, 834, 1, "rails"], [1024, 768, 0, "land"], [844, 390, 1, "land"], [390, 844, 1, "phone"]]
  : [[1100, 600, 0, "rails"], [1194, 834, 1, "rails"], [1271, 684, 0, "rails"], [1440, 900, 0, "rails"], [1920, 1080, 0, "rails"], [1024, 768, 0, "land"], [844, 390, 1, "land"], [667, 375, 1, "land"], [390, 844, 1, "phone"]]);
const SEED = () => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "1"); localStorage.setItem("theme", "dark"); localStorage.setItem("np-welcome-seen", "1"); localStorage.removeItem("np-rails"); };
/* nút điều khiển (theo id) — phải KHÔNG hiện ngoài khối quy định; ← và tên game không nằm trong danh sách này (← có ở mọi chế độ) */
const CTRL = ["bHelp", "phBtn", "bSnd", "soundBtn", "bLang", "langBtn", "bRe", "restartBtn", "pauseBtn", "bBoard", "bCam", "bShr", "nsPill", "bLock", "bBk", "bBack", "homeBtn"];
const SRC = { help: ["bHelp", "phBtn"], snd: ["bSnd", "soundBtn"], lang: ["bLang", "langBtn"], restart: ["restartBtn", "bRe"], pause: ["pauseBtn"], board: ["bBoard"], pass: ["nsPill"] };
/* nội dung chơi (KHÔNG phải điều khiển) — ngoại lệ của bài quét tổng quát */
const CONTENT = "#home,#game,#end,.tile,.sk,.skinBtn,.dif,.ty,.card,.band,.hr,.row,.tb,#tb,#tbBar,#ssBar,.ov,.big,.btn,.chip,.sz,#askBtn,.side";

const MEASURE = (mode, CTRL, SRC, KEYS, CONTENT) => {
  const $ = s => document.querySelector(s), st = $("#stage"), f = st.querySelector("iframe"), o = { errs: [], seq: [], pos: [], leftover: [], generic: [], need: [], have: {} };
  const shown = e => { if (!e) return false; const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 4 && r.height > 4 && s.display !== "none" && s.visibility !== "hidden" && !e.closest("[hidden]"); };
  let gd = null; try { gd = f.contentDocument; } catch (e) {}
  const gel = ids => { if (!gd) return null; for (const i of ids) { const e = gd.getElementById(i); if (e) return e; } return null; };
  const usable = e => !!e && !e.hidden && !e.closest("[hidden]");
  const box = mode === "rails" ? $("#npHud") : $("#npHudc");
  if (mode === "rails" || mode === "land") {
    const btns = box ? [...box.querySelectorAll("button[data-k]")] : [];
    const vis = btns.filter(b => b.dataset.k !== "back" && b.dataset.k !== "collapse" && shown(b));
    o.seq = vis.map(b => b.dataset.k); o.pos = vis.map(b => { const r = b.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.left)]; });
    o.moreVisible = !!(box && box.querySelector(".np-hmore") && shown(box.querySelector(".np-hmore")));
    o.hasBox = !!box && shown(box);
    for (const k of Object.keys(SRC)) { const src = gel(SRC[k]); if (usable(src)) o.need.push(k); }
    if (usable($("#stage .nps-cam"))) o.need.push("cam"); if (usable($("#stage .nps-fab:not(.nps-cam)"))) o.need.push("shr"); const kl = $("#klock"); if (kl && !kl.hidden) o.need.push("lock");
    for (const k of o.need) o.have[k] = vis.filter(b => b.dataset.k === k).length;
    o.small = o.moreVisible;
  } else {   /* phone: nguồn phải còn hiện được (trong hàng trên hoặc trong menu ⋯) */
    for (const k of Object.keys(SRC)) { const src = gel(SRC[k]); if (usable(src)) { o.need.push(k); o.have[k] = src && getComputedStyle(src).display !== "none" ? 1 : 0; } }
  }
  /* nút điều khiển thừa ngoài khối */
  if (gd) for (const id of CTRL) { const e = gd.getElementById(id); if (!e) continue; const r = e.getBoundingClientRect(), s = getComputedStyle(e); const visible = r.width > 4 && r.height > 4 && s.display !== "none" && s.visibility !== "hidden" && !e.closest("[hidden]") && r.right > 0 && r.left < innerWidth + 400;
    if (!visible) continue; if (mode === "phone" && e.closest("#npFan,#npPmFan,.top,#play>.top")) continue; o.leftover.push("#" + id + "@" + Math.round(r.left) + "," + Math.round(r.top)); }
  /* nút nổi của cổng ngoài khối */
  if (mode !== "phone") for (const e of st.querySelectorAll(".nps-fab,#klock")) if (shown(e) && !(box && box.contains(e))) { const r = e.getBoundingClientRect(); o.leftover.push("cổng " + (e.id ? "#" + e.id : "." + String(e.className).split(" ")[0]) + "@" + Math.round(r.left) + "," + Math.round(r.top)); }
  /* quét tổng quát (thông tin): nút 30–90px trong game không thuộc nội dung */
  if (gd) for (const e of gd.querySelectorAll("button,a,[role=button]")) { const r = e.getBoundingClientRect(), s = getComputedStyle(e); if (r.width < 30 || r.width > 90 || r.height < 30 || r.height > 90 || s.display === "none" || s.visibility === "hidden" || e.closest("[hidden]") || r.right < 0 || r.left > innerWidth) continue; if (e.closest(CONTENT) || e.matches(CONTENT)) continue; if (e.closest("#npFan,#npPmFan")) continue; o.generic.push((e.id ? "#" + e.id : "." + String(e.className).split(" ")[0]) + "@" + Math.round(r.left) + "," + Math.round(r.top)); }
  if (mode === "rails") {
    const c = box && box.querySelector('[data-k="collapse"]'), bk = box && box.querySelector('[data-k="back"]');
    if (c) { const r = c.getBoundingClientRect(); o.collapse = [Math.round(r.left), Math.round(r.top), Math.round(r.width)]; }
    if (bk) { const r = bk.getBoundingClientRect(); o.back = [Math.round(r.left), Math.round(r.top)]; }
  }
  return o;
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1500);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"], timeout: 180000 });
  const table = {};
  const open = async (portal, id, W, H, touch) => {
    const pg = await br.newPage(); pg._er = []; pg.on("pageerror", e => pg._er.push(e.message));
    await pg.setViewport({ width: W, height: H, isMobile: !!touch, hasTouch: !!touch }); await pg.evaluateOnNewDocument(SEED);
    pg.setDefaultNavigationTimeout(120000); await pg.goto(B + portal + "/index.html?lang=vi#" + id).catch(() => pg.goto(B + portal + "/index.html?lang=vi#" + id)); await wait(3800); return pg;
  };
  const gframe = (pg, id) => pg.frames().find(f => f.url().includes("/games/" + id + "/"));
  const OPENMORE = () => { const m = document.querySelector("#npHudc .np-hmore"); if (m && m.offsetParent && !m.parentNode.classList.contains("open")) m.click(); };
  const START = fr => fr.evaluate(() => { const s = document.querySelector("#bFree,#bStart,#bPlay,#start,#goBtn,.big,.tile:not(.lock):not([disabled]),.card"); if (s) { s.click(); return true; } return false; }).catch(() => false);
  for (const [portal, id] of GAMES2) {
    console.log("== " + portal + "/" + id);
    for (const [W, H, t, mode] of MODES) {
      const tag = id + " " + W + "x" + H, row = (table[id] = table[id] || {});
      try {
        const pg = await open(portal, id, W, H, t), fr = gframe(pg, id);
        for (const phase of ["chọn", "chơi"]) {
          if (phase === "chơi") { pg._er0 = pg._er.length; if (!fr || !(await START(fr))) break; await wait(1500); }
          if (mode === "land") await pg.evaluate(OPENMORE);
          const m = await pg.evaluate(MEASURE, mode, CTRL, SRC, KEYS, CONTENT), tg = tag + " [" + phase + "]";
          if (mode !== "phone") note(m.hasBox, tg + ": không có khối nút (" + (mode === "rails" ? "#npHud" : "#npHudc") + ")");
          m.leftover.forEach(x => note(false, tg + ": nút điều khiển LẠC CHỖ ngoài khối: " + x));
          if (verbose && m.generic.length) console.log("    (quét chung " + tg + "): " + m.generic.join(" "));
          if (mode !== "phone") {
            const order = m.seq.map(k => KEYS.indexOf(k)); note(order.every((v, i) => i === 0 || v > order[i - 1]), tg + ": thứ tự nút sai " + m.seq.join(","));
            if (!m.small) { const p = m.pos; let okp = true; for (let i = 1; i < p.length; i++) if (p[i][0] < p[i - 1][0] - 1 || (Math.abs(p[i][0] - p[i - 1][0]) <= 1 && p[i][1] <= p[i - 1][1])) okp = false; note(okp, tg + ": vị trí các nút không theo thứ tự " + JSON.stringify(p)); }
            m.need.forEach(k => { note(m.have[k] === 1, tg + ": chức năng '" + k + "' có " + m.have[k] + " nút hiện trong khối (cần đúng 1)"); });
            row[mode + W + phase] = m.seq.join("");
          } else m.need.forEach(k => note(m.have[k] === 1, tg + ": chức năng '" + k + "' của game không hiện được ở điện thoại dọc"));
          if (mode === "rails" && phase === "chọn") {
            note(!!m.collapse && m.collapse[1] <= 80 && m.collapse[0] <= 90 && Math.abs(m.collapse[1] - m.back[1]) <= 2, tg + ": nút thu gọn không ở góc trên-trái cạnh ← " + JSON.stringify(m.collapse) + " ←" + JSON.stringify(m.back));
          }
        }
        if (mode === "rails") {   /* thu gọn → .np-tab đúng cùng toạ độ, ở nửa trên */
          const c0 = await pg.evaluate(() => { const c = document.querySelector('#npHud [data-k="collapse"]'); if (!c) return null; const r = c.getBoundingClientRect(); c.click(); return [Math.round(r.left), Math.round(r.top)]; });
          await wait(700); const t1 = await pg.evaluate(() => { const e = document.querySelector(".np-tab"); if (!e || getComputedStyle(e).display === "none") return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), innerHeight]; });
          note(c0 && t1 && Math.abs(c0[0] - t1[0]) <= 2 && Math.abs(c0[1] - t1[1]) <= 2 && t1[1] < t1[2] / 2, tag + ": nút mở lại cột (.np-tab) không cùng toạ độ nút thu gọn " + JSON.stringify(c0) + " vs " + JSON.stringify(t1));
          if (shots) await pg.screenshot({ path: path.join(shots, "oz-" + id + "-" + W + "-thu.png") });
          // collapsed = chế độ "land": khối #npHudc ở cột trái khung, đủ nút
          const m2 = await pg.evaluate(MEASURE, "land", CTRL, SRC, KEYS, CONTENT); m2.leftover.forEach(x => note(false, tag + " [thu gọn]: nút lạc chỗ " + x));
          await pg.evaluate(() => document.querySelector(".np-tab") && document.querySelector(".np-tab").click()); await wait(500);
        }
        /* (d) bấm hộ: đếm click vào nút thật rồi bấm nút trong khối */
        if (mode !== "phone" && fr) {
          await fr.evaluate(() => { window.__oz = {}; const ids = { help: ["bHelp", "phBtn"], restart: ["restartBtn", "bRe"], pause: ["pauseBtn"], board: ["bBoard"], pass: ["nsPill"] }; if (document.__ozOn) return; document.__ozOn = 1;
            document.addEventListener("click", e => { for (const k in ids) { const el = e.target.closest && e.target.closest(ids[k].map(i => "#" + i).join(",")); if (el && e.isTrusted === false) { window.__oz[k] = (window.__oz[k] || 0) + 1; e.stopImmediatePropagation(); e.preventDefault(); } } }, true); }).catch(() => {});
          if (mode === "land") await pg.evaluate(OPENMORE);
          const keys = await pg.evaluate(() => { const box = document.querySelector("#npHud") || document.querySelector("#npHudc"); return box ? [...box.querySelectorAll("button[data-k]")].filter(b => b.offsetParent && !["back", "collapse"].includes(b.dataset.k)).map(b => b.dataset.k) : []; });
          for (const k of ["help", "restart", "pause", "board", "pass"]) if (keys.includes(k)) {
            if (mode === "land") await pg.evaluate(OPENMORE);
            await pg.evaluate(k2 => { const b = document.querySelector('#npHud [data-k="' + k2 + '"],#npHudc [data-k="' + k2 + '"]'); b && b.click(); }, k); await wait(250);
            const n = await fr.evaluate(k2 => (window.__oz || {})[k2] || 0, k).catch(() => 0); note(n === 1, tag + ": bấm nút '" + k + "' trong khối → nút thật nhận " + n + " click (cần 1)");
          }
          if (keys.includes("snd")) {   /* 🔊: phản chiếu trạng thái đúng sau khi bấm */
            const before = await fr.evaluate(() => { const s = document.getElementById("bSnd") || document.getElementById("soundBtn"); return s ? (s.getAttribute("aria-pressed") || "") + "|" + s.innerHTML.length + "|" + (localStorage.getItem("np-sound") || "") : null; });
            if (mode === "land") await pg.evaluate(OPENMORE);
            await pg.evaluate(() => { const b = document.querySelector('#npHud [data-k="snd"],#npHudc [data-k="snd"]'); b && b.click(); }); await wait(700);
            const after = await fr.evaluate(() => { const s = document.getElementById("bSnd") || document.getElementById("soundBtn"); return s ? (s.getAttribute("aria-pressed") || "") + "|" + s.innerHTML.length + "|" + (localStorage.getItem("np-sound") || "") : null; });
            const mir = await pg.evaluate(() => { const b = document.querySelector('#npHud [data-k="snd"],#npHudc [data-k="snd"]'), d = document.querySelector("#stage iframe").contentDocument, s = d.getElementById("bSnd") || d.getElementById("soundBtn"); return b && s ? [b.innerHTML.trim() === s.innerHTML.trim(), b.getAttribute("aria-pressed") === s.getAttribute("aria-pressed") || !s.hasAttribute("aria-pressed")] : [false, false]; });
            note(before !== after || mir[0], tag + ": bấm 🔊 trong khối không đổi trạng thái nút thật (" + before + " → " + after + ")"); note(mir[0] && mir[1], tag + ": biểu tượng/aria-pressed 🔊 trong khối không phản chiếu nút thật " + JSON.stringify(mir));
          }
          if (keys.includes("lang")) {   /* ngôn ngữ: bấm → lang của game đổi, nhãn trong khối đúng */
            const l0 = await fr.evaluate(() => document.documentElement.lang);
            if (mode === "land") await pg.evaluate(OPENMORE);
            await pg.evaluate(() => { const b = document.querySelector('#npHud [data-k="lang"],#npHudc [data-k="lang"]'); b && b.click(); }); await wait(1200);
            const fr2 = gframe(pg, id) || fr, l1 = await fr2.evaluate(() => document.documentElement.lang).catch(() => l0);
            const lab = await pg.evaluate(() => { const b = document.querySelector('#npHud [data-k="lang"],#npHudc [data-k="lang"]'), d = document.querySelector("#stage iframe"); let s = null; try { const g = d.contentDocument; s = g.getElementById("bLang") || g.getElementById("langBtn"); } catch (e) {} return [b ? b.textContent.trim() : "", s ? s.textContent.trim() : ""]; });
            note(l1 !== l0, tag + ": bấm ngôn ngữ trong khối không đổi ngôn ngữ game (" + l0 + " → " + l1 + ")"); note(lab[0] === lab[1], tag + ": nhãn ngôn ngữ trong khối '" + lab[0] + "' ≠ nút thật '" + lab[1] + "'");
          }
        }
        if (shots && (portal + id).length) { try { await pg.screenshot({ path: path.join(shots, "oz-" + id + "-" + W + "x" + H + ".png") }); } catch (e) {} }
        const er = pg._er0 != null ? pg._er.slice(0, pg._er0) : pg._er; if (er.length) note(false, tag + ": lỗi JS " + er[0].slice(0, 80));   /* lỗi sau khi bài đo bấm nút bắt đầu gượng (game-specific) không tính */
        await pg.close();
      } catch (e) { note(false, tag + ": không đo được (" + String(e).slice(0, 100) + ")"); }
    }
  }
  /* (b) thứ tự giống nhau giữa các game: mọi dãy phải là dãy con của KEYS (đã kiểm từng trang); in bảng game × chế độ */
  console.log("\nBẢNG game × chế độ (thứ tự nút trong khối, màn chọn):");
  for (const g in table) console.log("  " + g.padEnd(22) + Object.entries(table[g]).filter(([k]) => /chọn$/.test(k)).map(([k, v]) => k.replace("chọn", "") + "=" + (v || "-")).join("  "));
  await br.close(); srv.kill();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi 'một nơi chứa nút'" : "✓ một nơi chứa nút điều khiển đạt")); process.exit(fails.length ? 1 : 0);
})();
