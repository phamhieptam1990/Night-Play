/* Kiểm tra MÀN RỘNG (máy tính, iPad ngang): khung game phóng to tới 760px, không còn khoảng trắng quá nhiều, vẫn một màn hình không cuộn/không cắt (GAME_RULES.md mục 0a-13).
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-widescreen.js [--quick] [id,id,...]   (script tự chạy http.server cổng 8885)
   Mỗi game × {1024x768, 1194x834, 1366x1024 (iPad ngang, cảm ứng), 1271x684, 1440x900, 1920x1080, 2560x1440 (máy tính)} × {chọn, chơi, kết thúc}:
   - cột game (#play / .play / .desk-wrap) rộng ≤ 760px và ≥ min(760, 55% chiều cao, 90% chiều rộng) — "phóng to theo chiều cao khả dụng";
   - mỗi bên trống ≤ 40% chiều rộng khi cột đã đạt trần 760 hoặc đã bị chiều cao giới hạn (tức là cột ≥ 55% chiều cao);
   - không cuộn/tràn trang, nút/khung chính không bị cắt ra ngoài màn (dùng cùng phép đo SIẾT với check-landscape), nút chính cao ≥ 44px, nút icon ≥ 38px;
   - ?multi (khung nhỏ trong 'Chơi cùng lúc') không bị phóng sai: cột ≤ 100% khung.
   --quick: 3 game × 4 cỡ. Thoát mã 1 nếu có lỗi. */
const { spawn } = require("child_process"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8885, B = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), quick = args.includes("--quick"), ids = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const COZY = ["bao-nhieu-giay", "ve-mot-net", "dap-deadline", "xin-nghi", "gia-cho-viet", "me-cung-truyen-tay", "cho-hang-kieu-viet", "doi-doi-2048"], POP = ["pop-fly", "bo-me-5-giay", "lang-cua-be", "thap-vong-mau"];
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "bao-nhieu-giay"], ["cozyplay", "dap-deadline"], ["popplay", "pop-fly"]];
if (ids.length) list = list.filter(([, i]) => ids.includes(i));
const ALL = [[1024, 768, 1], [1194, 834, 1], [1366, 1024, 1], [1271, 684, 0], [1440, 900, 0], [1920, 1080, 0], [2560, 1440, 0]];
const VPS = quick ? [ALL[1], ALL[3], ALL[4], ALL[5]] : ALL;
const fails = [], note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } }, wait = ms => new Promise(r => setTimeout(r, ms));
const POPSTART = "try{begin(0,{})}catch(e){try{startSession(0,null,{})}catch(e2){try{startRound(Object.keys(PF.types||{})[0]||0)}catch(e3){}}}";
const POPEND = "try{finish()}catch(e){try{endRun()}catch(e2){try{finishSession()}catch(e3){try{finishRound()}catch(e4){}}}}";
const MEASURE = (W, H) => {
  const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 8 && r.height > 8 && s.visibility !== "hidden" && +s.opacity > 0.05 && !e.closest("[hidden],.leaf") && (e.offsetParent || s.position === "fixed"); };
  const name = e => e.id || (e.className + "").split(" ")[0] || e.tagName, out = { cut: [], small: [] };
  const col = [...document.querySelectorAll("#play,.play,.desk-wrap")].find(vis); out.col = col ? Math.round(col.getBoundingClientRect().width) : 0; out.colName = col ? name(col) : "";
  out.scroll = document.documentElement.scrollWidth > innerWidth + 1 || document.documentElement.scrollHeight > innerHeight + 1; out.iw = innerWidth;
  for (const e of document.querySelectorAll(".desk-wrap,.desk,.board,#cvw,#cv,#game canvas,#play canvas,#arena,h1,#ttl,#title,.stats,.hud,.timebar,.scene,.btn,.big,.ib,.icon-btn,.top button,.card,.dbtn")) {
    if (!vis(e)) continue; const r = e.getBoundingClientRect(); if (r.width > W * 1.5) continue;
    if (r.left < -2 || r.top < -2 || r.right > W + 2 || r.bottom > H + 2) out.cut.push(name(e) + "@" + [r.left, r.top, r.right, r.bottom].map(Math.round));
  }
  for (const e of document.querySelectorAll(".btn,.big,.dbtn,#bPlay,#bDaily,#startBtn")) if (/^(BUTTON|A)$/.test(e.tagName) && vis(e) && !e.closest(".top,.ov,.overlay") && e.getBoundingClientRect().height < 43.5) out.small.push(name(e) + "=" + Math.round(e.getBoundingClientRect().height));
  for (const e of document.querySelectorAll(".top .ib,.top .icon-btn,.top>button")) if (vis(e) && Math.min(e.getBoundingClientRect().width, e.getBoundingClientRect().height) < 37.5) out.small.push(name(e) + "=" + Math.round(Math.min(e.getBoundingClientRect().width, e.getBoundingClientRect().height)));
  out.cut = out.cut.slice(0, 4); out.small = out.small.slice(0, 4); return out;
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const shotDir = process.env.WS_SHOTS;
  for (const [portal, id] of list) {
    console.log("== " + portal + "/" + id);
    for (const [W, H, touch] of VPS) for (let attempt = 0; attempt < 2; attempt++) { const nf = fails.length; try {
      const tag = id + " " + W + "x" + H, pg = await br.newPage(), errs = []; pg.on("pageerror", e => errs.push(e.message));
      await pg.setViewport({ width: W, height: H, isMobile: !!touch, hasTouch: !!touch });
      await pg.evaluateOnNewDocument(() => { localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "dark"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); for (const k of ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "xcp", "dr", "mz", "gc", "gm", "ch", "bh"]) localStorage.setItem(k + "-tut", "1"); });
      pg.setDefaultNavigationTimeout(90000); await pg.goto(B + portal + "/games/" + id + "/index.html?lang=vi").catch(() => pg.goto(B + portal + "/games/" + id + "/index.html?lang=vi")); await wait(900);
      const step = async name => { await wait(name === "chọn" ? 300 : 1100); const m = await pg.evaluate(MEASURE, W, H), t = tag + " " + name;
        note(m.iw === W && !m.scroll, t + ": trang tràn/cuộn");
        note(!m.cut.length, t + ": bị cắt ra ngoài màn " + m.cut.join(" "));
        note(!m.small.length, t + ": nút nhỏ " + m.small.join(" "));
        if (m.col && !(id === "dap-deadline" && name === "chọn")) {
          const floor = Math.min(760, H * .55, W * .9) - 4;
          note(m.col <= 760.5, t + ": cột game " + m.col + "px > 760");
          note(m.col >= floor, t + ": cột game " + m.col + "px nhỏ hơn mức tối thiểu " + Math.round(floor) + "px (còn nhiều khoảng trắng)");
          note((W - m.col) / 2 <= W * .4 + 1, t + ": mỗi bên trống " + Math.round((W - m.col) / 2 / W * 100) + "% chiều rộng (>40%)");
        }
        if (shotDir && name) await pg.screenshot({ path: path.join(shotDir, "ws-" + id + "-" + W + "-" + name.replace(/ /g, "") + ".png") }); };
      await step("chọn");
      if (portal === "cozyplay") {
        await pg.evaluate(() => { const e = document.getElementById("bPlay") || document.getElementById("bDaily") || document.getElementById("startBtn") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn"); e && e.click(); });
        await step("chơi");
        await pg.evaluate(() => { try { G.over = true; finish(G); } catch (e) {} }); await step("kết thúc");
      } else {
        await pg.evaluate(POPSTART); await step("chơi"); await pg.evaluate(POPEND); await step("kết thúc");
      }
      note(!errs.length, tag + ": lỗi JS " + errs.slice(0, 1)); await pg.close();
    } catch (e) { fails.length = nf; if (attempt) note(false, id + " " + W + "x" + H + ": không đo được (" + String(e).slice(0, 80) + ")"); continue; } break; }
  }
  /* 'Chơi cùng lúc': khung game nhỏ trong lưới — cột không được to hơn khung */
  if (!quick) for (const [W, H] of [[1440, 900], [1920, 1080]]) {
    const pg = await br.newPage(); await pg.setViewport({ width: W, height: H }); await pg.goto(B + "cozyplay/games/bao-nhieu-giay/index.html?lang=vi&multi=1"); await wait(800);
    const r = await pg.evaluate(() => { const p = document.getElementById("play"); return { w: p.getBoundingClientRect().width, iw: innerWidth }; });
    note(r.w <= r.iw + 1, "?multi " + W + "x" + H + ": cột game " + Math.round(r.w) + " rộng hơn khung " + r.iw); await pg.close();
  }
  await br.close(); srv.kill();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi màn rộng" : "✓ màn rộng đạt")); process.exit(fails.length ? 1 : 0);
})();
