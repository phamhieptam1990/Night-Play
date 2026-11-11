/* Nút ← (về màn chọn / thoát) LUÔN ở góc TRÊN-TRÁI, cùng toạ độ ở MỌI game (GAME_RULES.md 0a-14):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-backpos.js [--quick] [--phones (chỉ 7 cỡ điện thoại dọc)] [--dump] [id,id,...]   (script tự chạy http.server cổng 8887)
   Mở game QUA TRANG CỔNG (như người chơi thật) ở các cỡ 390x844, 844x390, 667x375, 768x1024, 1194x834, 1271x684, 1440x900, 1920x1080, đo ở màn chọn và màn chơi:
   tâm nút ← (của game hoặc của cổng) nằm trong góc trên-trái (x < 25% rộng, y < 25% cao), nút ≥ 38px, KHÔNG bị che (elementFromPoint),
   và cùng cỡ màn hình thì tâm ← giống nhau giữa các game ±2px (một "nguồn" toạ độ chung --back-x/--back-y trong shared/align.css). --dump: in toạ độ từng game.
   HÀNG NÚT TRÊN CÙNG ở ĐIỆN THOẠI DỌC (320x568 360x640 375x667 390x844 393x852 414x896 430x932; GAME_RULES 0a-14): MỌI nút (←, ⏸, 🔊, ⋯, chip độ khó) cùng tâm dọc 44±1px, nút cùng cỡ 56±1px (--tap-lg) (chip độ khó chỉ cần cùng tâm),
   lề trái ← = lề phải ⋯ = 16±1px, ← là nút đầu bên trái và ⋯ bên phải, khoảng cách các nút bên phải đều 8±1.5px, không chồng lấn nút/chữ, chữ (tên game, HUD) cách hàng nút >= 8px, trang không cuộn.
   Bản WebKit thật (Playwright): scripts/cozygame/check-backpos-webkit.js (cùng phép đo, chạy riêng nếu có Playwright WebKit). */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.NP_PORT || 8887, B = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), quick = args.includes("--quick"), dump = args.includes("--dump"), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const { ROW } = require("./toprow.js");
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [], note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")).filter(d => fs.existsSync(path.join(root, "cozyplay/games", d, "index.html"))), POP = fs.readdirSync(path.join(root, "popplay/games"));
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "bao-nhieu-giay"], ["cozyplay", "ban-co-hieu-toi"], ["cozyplay", "dap-deadline"], ["cozyplay", "cozy-wings"], ["popplay", "pop-fly"], ["popplay", "bo-me-5-giay"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
const PH = [[320, 568], [360, 640], [375, 667], [393, 852], [414, 896], [430, 932]];   /* điện thoại dọc: hàng nút trên cùng (390x844 đã có ở ALL) */
const ALL = [[390, 844, 1], [844, 390, 1], [667, 375, 1], [568, 320, 1], [768, 1024, 1], [1194, 834, 1], [1271, 684, 0], [1440, 900, 0], [1920, 1080, 0], [484, 694, 0], [520, 700, 0], [600, 700, 0], [700, 700, 0], [800, 700, 0]];
const SIZES = args.includes("--phones") ? [ALL[0], ...PH.map(a => [...a, 1])] : quick ? [ALL[0], ALL[1], ALL[5], ALL[7], ALL[9], ALL[13], [375, 667, 1], [414, 896, 1], [320, 568, 1]] : [...ALL, ...PH.map(a => [...a, 1])];
/* cột nút nổi của cổng (← 📷 📤 🔒): cùng cỡ, cùng trục (ngang: cùng tâm X; dọc: cùng tâm Y), cùng kiểu nền */
const FLOATS = () => {
  const st = document.getElementById("stage"); if (!st || !st.classList.contains("on")) return null;
  const lum = c => { const m = c.match(/[\d.]+/g); if (!m) return 1; const [r, g, b] = m.map(Number); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
  const els = [...document.querySelectorAll("#stage #home,#stage .nps-fab,#klock")].filter(e => { const cs = getComputedStyle(e), r = e.getBoundingClientRect(); return cs.display !== "none" && cs.visibility !== "hidden" && +cs.opacity > .5 && r.width > 6; });
  return { land: innerWidth > innerHeight, items: els.map(e => { const r = e.getBoundingClientRect(); return { n: e.id || e.className.replace("nps-fab", "fab").trim(), x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, l: lum(getComputedStyle(e).backgroundColor) }; }) };
};
/* thẻ nhắc việc ở cột trái (.ask: "Chọn một khu để xây làng!"): ≤3 dòng, rộng ≥140px, nút loa ≤40% bề rộng thẻ, không chữ nào bị cắt */
const ASK = () => {
  const a = document.querySelector(".ask"), t = document.getElementById("askTxt"); if (!a || !a.offsetParent || !t) return null;
  const r = a.getBoundingClientRect(), b = a.querySelector("button"), br = b ? b.getBoundingClientRect() : { width: 0 }, cs = getComputedStyle(t), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
  return { w: r.width, lines: Math.round(t.getBoundingClientRect().height / lh), bw: br.width, cut: t.scrollWidth > t.clientWidth + 1, left: r.left, right: r.right };
};
const FIND = () => {   /* chạy trong trang cổng: tìm nút ← đang hiện (trong game hoặc của cổng) */
  const vis = e => { if (!e) return false; const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && +s.opacity > .05 && r.width > 6 && r.height > 6 && !e.closest("[hidden]"); };
  const cand = [], st = document.getElementById("stage"), f = st && st.querySelector("iframe"), fr = f ? f.getBoundingClientRect() : { left: 0, top: 0 };
  let d = null; try { d = f && f.contentDocument; } catch (e) {}
  if (d) for (const id of ["bBk", "bBack", "homeBtn", "bHome", "npPmBk"]) { const e = d.getElementById(id); if (vis(e) && getComputedStyle(e).pointerEvents !== "none") { const r = e.getBoundingClientRect(); cand.push({ id, x: r.left + r.width / 2, y: r.top + r.height / 2, ax: r.left + r.width / 2 + fr.left, ay: r.top + r.height / 2 + fr.top, w: r.width, h: r.height, own: "game" }); } }
  const hb = document.querySelector('#npHud [data-k="back"]'); if (vis(hb)) { const r = hb.getBoundingClientRect(); cand.unshift({ id: "npHud←", x: r.left + r.width / 2, y: r.top + r.height / 2, ax: r.left + r.width / 2, ay: r.top + r.height / 2, w: r.width, h: r.height, own: "hud" }); }
  const ph = document.getElementById("home"); if (vis(ph) && st && st.classList.contains("on")) { const r = ph.getBoundingClientRect(); if (+getComputedStyle(ph).opacity > .5) { const rl = parseFloat(st.style.getPropertyValue("--rl")) || 0; cand.push({ id: "portal#home", x: r.left + r.width / 2 - rl, y: r.top + r.height / 2, ax: r.left + r.width / 2, ay: r.top + r.height / 2, w: r.width, h: r.height, own: "portal", el: 1 }); } }
  for (const c of cand) { const t = document.elementFromPoint(c.ax, c.ay); c.covered = !!t && t !== f && !(ph && ph.contains(t)) && !(hb && hb.contains(t)) && t.tagName !== "IFRAME"; c.by = t ? (t.tagName + "#" + t.id + "." + t.className) : ""; }
  return { cand, W: innerWidth, H: innerHeight };
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const table = {};   /* "WxH|stage" -> [{id, x, y}] */
  for (const [portal, id] of list) {
    console.log("== " + portal + "/" + id);
    for (const [W, H, t] of SIZES) {
      let pg; try {
        pg = await br.newPage(); pg.setDefaultNavigationTimeout(90000); await pg.setViewport({ width: W, height: H, isMobile: !!t, hasTouch: !!t });
        await pg.evaluateOnNewDocument(() => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "dark"); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("np-rails", "1"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); });
        await pg.goto(B + portal + "/index.html?lang=vi#" + id); await wait(3300);
        const stages = [["chọn", null]];
        if (portal === "cozyplay") stages.push(["chơi", () => { const e = document.getElementById("bPlay") || document.getElementById("bDaily") || document.getElementById("startBtn") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn"); e && e.click(); }]);
        else stages.push(["chơi", "try{begin(0,{})}catch(e){try{startSession(0,null,{})}catch(e2){try{startRound(Object.keys(PF.types||{})[0]||0)}catch(e3){}}}"]);
        for (const [name, act] of stages) {
          if (act) { const fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (!fr) break; await fr.evaluate(act).catch(() => {}); await wait(1300); }
          const r = await pg.evaluate(FIND), tag = id + " " + W + "x" + H + " " + name;
          if (name === "chọn") {
            const PHN = W <= 520 && H > W, K = PHN ? 56 : 44;   /* điện thoại dọc: nút --tap-lg 56px, tâm (44,44); còn lại 44px, tâm (38,38) */
            const fl = await pg.evaluate(FLOATS); if (fl && fl.items.length > 1) { const it = fl.items, ref = it[0], k = fl.land ? "x" : "y";
              for (const a of it) { note(Math.abs(a.w - K) <= 1 && Math.abs(a.h - K) <= 1, tag + ": nút nổi " + a.n + " cỡ " + Math.round(a.w) + "x" + Math.round(a.h) + " (cần " + K + ")"); note(Math.abs(a.l - ref.l) <= 0.15, tag + ": nút nổi " + a.n + " khác màu nền (" + a.l.toFixed(2) + " vs " + ref.l.toFixed(2) + ")"); }
              if (fl.land) for (const a of it) note(Math.abs(a.x - ref.x) <= 1, tag + ": nút nổi " + a.n + " lệch trục X " + Math.round(a.x - ref.x) + "px so với ←");
              else { const ys = it.filter(a => a.n === "home" || a.n === "klock" || /fab/.test(a.n)).map(a => a.y); note(Math.max(...ys) - Math.min(...ys) <= 1, tag + ": nút nổi lệch hàng (trục Y)"); } }
            const gf = pg.frames().find(f => f.url().includes("/games/" + id + "/")), ak = gf ? await gf.evaluate(ASK).catch(() => null) : null; if (ak) { note(ak.lines <= 3, tag + ": thẻ nhắc việc " + ak.lines + " dòng (>3)"); note(ak.w >= 140 || W < 900, tag + ": thẻ nhắc việc rộng " + Math.round(ak.w) + "px (<140)"); note(ak.bw <= ak.w * 0.4, tag + ": nút loa " + Math.round(ak.bw) + "px chiếm >40% thẻ " + Math.round(ak.w)); note(!ak.cut, tag + ": chữ thẻ nhắc việc bị cắt"); }
          }
          if (W <= 520 && H > W && t) { const rw = await pg.evaluate(ROW).catch(e => ({ err: String(e).slice(0, 60) })); if (dump) console.log("    hàng nút: " + (rw.items || rw.err)); if (rw.err) note(false, tag + ": hàng nút không đo được: " + rw.err); else for (const m of rw.E) note(false, tag + ": hàng nút trên cùng: " + m); }
          if (!r.cand.length) { if (name === "chọn") note(false, tag + ": không thấy nút ← nào"); continue; }
          const PHK = W <= 520 && H > W, C0 = PHK ? 44 : 38, c = r.cand[0]; if (dump) console.log("  " + tag + " " + c.id + " (" + Math.round(c.x) + "," + Math.round(c.y) + ") " + Math.round(c.w) + "x" + Math.round(c.h));
          note(Math.abs(c.x - C0) <= 2.5 && Math.abs(c.y - C0) <= 2.5, tag + ": nút ← (" + c.id + ") tâm (" + Math.round(c.x) + "," + Math.round(c.y) + ") ≠ chuẩn (" + C0 + "," + C0 + ") = góc trên-trái, lề 16px");
          note(Math.min(c.w, c.h) >= (PHK ? 55.5 : 37.5), tag + ": nút ← nhỏ " + Math.round(c.w) + "x" + Math.round(c.h));
          note(!c.covered, tag + ": nút ← bị che bởi " + c.by);
          (table[W + "x" + H + "|" + name] = table[W + "x" + H + "|" + name] || []).push({ id, x: c.x, y: c.y });
        }
      } catch (e) { note(false, id + " " + W + "x" + H + ": không đo được " + String(e).slice(0, 80)); }
      try { await pg.close(); } catch (e) {}
    }
  }
  for (const [k, v] of Object.entries(table)) {
    const xs = v.map(a => a.x), ys = v.map(a => a.y), mx = [...xs].sort((a, b) => a - b)[xs.length >> 1], my = [...ys].sort((a, b) => a - b)[ys.length >> 1];
    for (const a of v) if (Math.abs(a.x - mx) > 2 || Math.abs(a.y - my) > 2) note(false, a.id + " " + k + ": tâm ← (" + Math.round(a.x) + "," + Math.round(a.y) + ") lệch chuẩn (" + Math.round(mx) + "," + Math.round(my) + ") > 2px");
  }
  await br.close(); srv.kill();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi vị trí nút ←" : "✓ nút ← luôn góc trên-trái, cùng toạ độ")); process.exit(fails.length ? 1 : 0);
})();
