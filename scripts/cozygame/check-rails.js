/* Kiểm tra HAI CỘT BÊN LỀ của trang cổng khi đang mở game (shared/rails.js + rails.css; GAME_RULES.md 0a-13):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-rails.js [--quick] [--shots=<thư mục>]   (script tự chạy http.server cổng 8886)
   Mỗi trang cổng (Cozy + Pop) × {1271x684, 1440x900, 1920x1080, 1194x834 (iPad ngang), 1366x1024 (iPad ngang)}:
   - hai cột hiện, KHÔNG đè khung game (iframe nằm trọn giữa), trang không cuộn, mỗi cột không tràn (khối thừa tự ẩn), nút/thẻ bấm cao ≥44px, icon game ≥56px;
   - ván dở (np-resume:<id> giả) hiện ở cột phải, bấm vào mở đúng game với ?resume=1; thẻ gợi ý bấm mở game khác;
   - top 5: máy chủ không trả bảng (offline) → có dòng thông báo / bản đã lưu (cache cũ) thay vì lỗi;
   - bên trong khung game: không cuộn, nút/khung chính không bị cắt;
   - 390x844 và 768x1024 (điện thoại, iPad dọc) KHÔNG có cột; nút ẩn/hiện cột bên hoạt động.
   --quick: 1 game mỗi cổng, 3 cỡ. Thoát mã 1 nếu có lỗi. */
const { spawn } = require("child_process"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8886, B = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), quick = args.includes("--quick"), shots = (args.find(a => a.startsWith("--shots=")) || "").slice(8);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [], note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const WIDE = [[1271, 684, 0], [1440, 900, 0], [1920, 1080, 0], [1194, 834, 1], [1366, 1024, 1]], NARROW = [[390, 844, 1], [768, 1024, 1]];
const CASES = quick ? [["cozyplay", "bao-nhieu-giay", "ve-mot-net"], ["popplay", "pop-fly", "qua-song"]] : [["cozyplay", "bao-nhieu-giay", "ve-mot-net"], ["cozyplay", "dap-deadline", "xin-nghi"], ["cozyplay", "xin-nghi", "ve-mot-net"], ["popplay", "pop-fly", "qua-song"], ["popplay", "lang-cua-be", "qua-song"]];
const SIZES = quick ? [WIDE[0], WIDE[1], WIDE[3]] : WIDE;
const SEED = (resId, topCache) => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "dark"); localStorage.setItem("np-welcome-seen", "1"); localStorage.removeItem("np-rails");
  localStorage.setItem("np-resume:" + resId, JSON.stringify({ v: 1, ts: Date.now() - 600000, state: { p: 1 }, daily: false, day: "" }));
  if (topCache) localStorage.setItem("np-rails-top:" + topCache, JSON.stringify({ ts: Date.now() - 3600000, rows: [{ nick: "Mai", score: 4200 }, { nick: "Nam", score: 3900 }] })); };
const MEASURE = () => {
  const $ = s => document.querySelector(s), st = $("#stage"), f = st.querySelector("iframe"), L = $("#npRailL"), R = $("#npRailR");
  const shown = e => e && getComputedStyle(e).display !== "none" && e.getBoundingClientRect().width > 0, o = { errs: [] };
  o.L = shown(L); o.R = shown(R); const fr = f ? f.getBoundingClientRect() : null; o.fw = fr ? Math.round(fr.width) : 0; o.fl = fr ? Math.round(fr.left) : 0;
  o.scroll = document.documentElement.scrollHeight > innerHeight + 1 || document.documentElement.scrollWidth > innerWidth + 1;
  for (const [n, r] of [["trái", L], ["phải", R]]) if (shown(r)) {
    const rr = r.getBoundingClientRect();
    if (r.scrollHeight > r.clientHeight + 1) o.errs.push("cột " + n + " tràn " + r.scrollHeight + ">" + r.clientHeight);
    if (rr.width < 235 || rr.width > 301) o.errs.push("cột " + n + " rộng " + Math.round(rr.width) + " (cần 240–300)");
    if (fr && (n === "trái" ? rr.right > fr.left + 1 : rr.left < fr.right - 1)) o.errs.push("cột " + n + " đè khung game");
    for (const e of r.querySelectorAll("button,a,.np-g,.np-res")) { if (!e.offsetParent) continue; const b = e.getBoundingClientRect(); if (b.width < 2) continue; if (b.height < 43.5 || b.width < 43.5) o.errs.push("nút " + (e.className + e.id).slice(0, 18) + " " + Math.round(b.width) + "x" + Math.round(b.height) + " (<44)"); }
    for (const e of r.querySelectorAll(".np-g img,.np-ico")) { if (!e.offsetParent) continue; const b = e.getBoundingClientRect(); if (b.width < 55.5) o.errs.push("icon game nhỏ " + Math.round(b.width)); }
    const cut = [...r.querySelectorAll("*")].filter(e => e.offsetParent && e.getBoundingClientRect().right > rr.right + 1 && e.getBoundingClientRect().width > 0).length; if (cut) o.errs.push(cut + " phần tử tràn ngang cột " + n);
  }
  const hud = $("#npHud"); o.hud = hud ? [...hud.querySelectorAll("button")].filter(b => b.offsetParent).length : 0; o.hudName = hud ? Math.round(hud.querySelector(".np-gname").getBoundingClientRect().height / (parseFloat(getComputedStyle(hud.querySelector(".np-gname")).lineHeight) || 19)) : 0;
  o.floats = [...document.querySelectorAll("#stage .nps-fab,#stage #home,#stage #klock")].filter(e => getComputedStyle(e).display !== "none" && e.getBoundingClientRect().width > 0).length;
  try { const d = f.contentDocument; o.gameBtns = [...d.querySelectorAll("#bHelp,#phBtn,#bSnd,#soundBtn,#bLang,#langBtn,#bBk,#bBack,#npPmBk,#npPmFab,#npFab,#homeBtn,#bCam,#bShr")].filter(e => getComputedStyle(e).display !== "none").length; } catch (e) { o.gameBtns = -1; }
  o.res = !!$("#npRes"); o.resTxt = $("#npRes") ? $("#npRes").textContent : ""; o.sug = [...document.querySelectorAll("#npSug .np-g")].filter(e => e.offsetParent).length;
  o.top = $("#npTop") && !$("#npTop").hidden ? ($("#npTop").querySelector(".np-note") || {}).textContent + "|" + $("#npTop").querySelectorAll("li").length : "";
  o.multi = $("#npMulti") ? $("#npMulti").getAttribute("href") : ""; o.btns = [...document.querySelectorAll("#npRailL .np-acts button")].length;
  return o;
};
const INNER = () => {   /* chạy trong khung game */
  const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 8 && r.height > 8 && s.visibility !== "hidden" && +s.opacity > 0.05 && !e.closest("[hidden],.leaf") && (e.offsetParent || s.position === "fixed"); };
  const cut = [], W = innerWidth, H = innerHeight;
  for (const e of document.querySelectorAll(".desk-wrap,.desk,.board,#cvw,#cv,#game canvas,#play canvas,.btn,.big,.ib,.icon-btn,.top button,.dbtn,.play,.tile")) { if (!vis(e)) continue; const r = e.getBoundingClientRect(); if (r.width > W * 1.5) continue; if (r.left < -2 || r.top < -2 || r.right > W + 2 || r.bottom > H + 2) cut.push((e.id || (e.className + "").split(" ")[0] || e.tagName) + "@" + [r.left, r.top, r.right, r.bottom].map(Math.round)); }
  return { scroll: document.documentElement.scrollWidth > W + 1 || document.documentElement.scrollHeight > H + 1, cut: cut.slice(0, 4) };
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const open = async (portal, id, resId, W, H, touch, top) => {
    const pg = await br.newPage(); pg._er = []; pg.on("pageerror", e => pg._er.push(e.message));
    await pg.setViewport({ width: W, height: H, isMobile: !!touch, hasTouch: !!touch }); await pg.evaluateOnNewDocument(SEED, resId, top);
    pg.setDefaultNavigationTimeout(90000); await pg.goto(B + portal + "/index.html?lang=vi#" + id).catch(() => pg.goto(B + portal + "/index.html?lang=vi#" + id)); await wait(3600); return pg;
  };
  for (const [portal, id, resId] of CASES) {
    console.log("== " + portal + "/" + id);
    for (const [W, H, t] of SIZES) for (let attempt = 0; attempt < 2; attempt++) { const nf = fails.length; try {
      const tag = portal + "/" + id + " " + W + "x" + H, pg = await open(portal, id, resId, W, H, t, id), m = await pg.evaluate(MEASURE);
      note(m.L && m.R, tag + ": hai cột phải hiện (trái=" + m.L + ", phải=" + m.R + ")"); note(!m.scroll, tag + ": trang bị cuộn/tràn");
      m.errs.forEach(e => note(false, tag + ": " + e)); note(m.res && /Ván dở/.test(m.resTxt), tag + ": không thấy mục ván dở (np-resume giả)");
      if (m.L) { note(m.hud >= 3 && m.hudName <= 2, tag + ": khối HUD cột trái thiếu nút (" + m.hud + ") hoặc tên game >2 dòng (" + m.hudName + ")"); note(m.floats === 0, tag + ": còn " + m.floats + " nút nổi của cổng thấy được khi cột bên lề hiện"); note(m.gameBtns === 0, tag + ": còn " + m.gameBtns + " nút gốc (? 🔊 ngôn ngữ ← 📷 📤) trong game khi đã có khối HUD"); }
      note(m.sug >= 2, tag + ": ít hơn 2 game gợi ý (" + m.sug + ")"); note(/^Chưa tải được|^\|?$|Chưa có|\|2$|đã lưu/.test(m.top) || m.top.includes("|"), tag + ": top 5 không có thông báo/bản đã lưu (" + m.top + ")");
      note(m.btns === 2 && !!m.multi && /multi\.html/.test(m.multi) && (portal === "popplay" ? /portal=pop/.test(m.multi) : true), tag + ": thiếu nút Chụp/Chia sẻ hoặc 'Chơi cùng lúc' (" + m.multi + ")");
      const fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (fr) { const i = await fr.evaluate(INNER).catch(() => null); if (i) { note(!i.scroll, tag + " trong game: trang bị cuộn"); note(!i.cut.length, tag + " trong game: bị cắt " + i.cut.join(" ")); } } else note(false, tag + ": không thấy khung game");
      if (!pg._er.length === false) note(false, tag + ": lỗi JS " + pg._er[0]);
      if (shots) await pg.screenshot({ path: path.join(shots, "rails-" + id + "-" + W + ".png") });
      await pg.close();
    } catch (e) { fails.length = nf; if (attempt) note(false, portal + "/" + id + " " + W + "x" + H + ": không đo được (" + String(e).slice(0, 80) + ")"); continue; } if (fails.length > nf && !attempt) { fails.length = nf; continue; } break; }
    /* cache cũ: có bảng đã lưu khi mất mạng; bấm ván dở; bấm gợi ý; ẩn/hiện cột; điện thoại / iPad dọc không có cột */
    let pg = await open(portal, id, resId, 1440, 900, 0, id); let m = await pg.evaluate(MEASURE);
    note(/\|2$/.test(m.top), portal + "/" + id + " 1440x900: bản top 5 đã lưu (cache cũ) không hiện khi mất mạng (" + m.top + ")");
    await pg.click("#npSug .np-g"); await wait(2500);
    note(await pg.evaluate(rid => { const h = location.hash.slice(1), f = document.querySelector("#stage iframe"); return h && h !== rid && f && f.src.includes("/" + h + "/"); }, resId), portal + "/" + id + ": bấm game gợi ý không mở game đó");
    await pg.click("#npRes"); await wait(2500);
    note(await pg.evaluate(rid => location.hash.slice(1) === rid && !!document.querySelector("#stage iframe") && /resume=1/.test(document.querySelector("#stage iframe").src), resId), portal + "/" + id + ": bấm ván dở không mở đúng game với ?resume=1");
    await pg.click("#npRailL .np-hide"); await wait(500); m = await pg.evaluate(MEASURE); note(!m.L && !m.R && m.fw >= 1355, portal + "/" + id + ": nút ẩn cột bên không trả khung game full (fw=" + m.fw + ")");
    await pg.click(".np-tab"); await wait(500); m = await pg.evaluate(MEASURE); note(m.L && m.R, portal + "/" + id + ": nút hiện lại cột bên không hoạt động"); await pg.close();
    if (!quick || portal === "cozyplay") for (const [W, H, t] of NARROW) {
      pg = await open(portal, id, resId, W, H, t, id); m = await pg.evaluate(MEASURE);
      note(!m.L && !m.R && m.fw >= W - 1, portal + "/" + id + " " + W + "x" + H + ": phải KHÔNG có cột bên (trái=" + m.L + ", phải=" + m.R + ", khung " + m.fw + ")"); await pg.close();
    }
  }
  await br.close(); srv.kill();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi cột bên lề" : "✓ cột bên lề đạt")); process.exit(fails.length ? 1 : 0);
})();
