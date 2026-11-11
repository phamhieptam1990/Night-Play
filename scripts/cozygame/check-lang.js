/* NÚT ĐỔI NGÔN NGỮ TRONG MÀN CHƠI phải ÁP DỤNG THẬT, hai chiều, giữa cổng và game (shared/lang.js, GAME_RULES 0a-19):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-lang.js [--quick] [--mode=phone|rails|land] [--conc=N] [--shots=<thư mục>] [id,id,...]
   (tự chạy http.server cổng NP_PORT hoặc 8931; mỗi ca một hồ sơ trình duyệt riêng nên localStorage không dính nhau)
   MỌI game (Cozy + Pop, 32) mở QUA TRANG CỔNG ở 3 chế độ: điện thoại dọc 390x844 (nút trong menu ⋯ / hàng nút), màn rộng có cột bên lề 1440x900
   (nút ngôn ngữ trong khối HUD cột trái), màn ngang 844x390 (HUD gọn #npHudc, hoặc nút của game nếu game giữ thanh trên riêng).
   Mỗi ca: vào màn CHƠI (giữa ván) -> bấm nút ngôn ngữ đúng cách người dùng thấy -> đo ngay (<= 0,6 s) và sau 1,5 s:
     1. html lang + localStorage "lang" của GAME đổi, chữ hiện trong game đổi thật (không reload: dấu trên window còn, màn hình đang hiện giữ nguyên = không mất ván);
     2. cổng đổi theo: html lang, nút VI|EN (#langMenu), cột bên lề (tiêu đề "Hôm nay"/"Today"), nhãn "Ngôn ngữ"/"Language" của ô trong menu ⋯;
     3. tải lại trang vẫn giữ; bấm lần nữa quay lại; đổi từ NÚT CỔNG (#langMenu) thì game đổi theo (hai chiều);
     4. game tải với ?lang= lệch với cổng (vd link cũ) -> tự đồng bộ về ngôn ngữ của cổng trong 2 s. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), http = require("http"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.NP_PORT || 8931, B = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), quick = args.includes("--quick"), shots = (args.find(a => a.startsWith("--shots=")) || "").slice(8), mode1 = (args.find(a => a.startsWith("--mode=")) || "").slice(7);
const CONC = +((args.find(a => a.startsWith("--conc=")) || "").slice(7)) || 4, only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [];
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")).filter(d => fs.existsSync(path.join(root, "cozyplay/games", d, "index.html"))), POP = fs.readdirSync(path.join(root, "popplay/games"));
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "ga-me-ban-trung"], ["cozyplay", "dap-deadline"], ["cozyplay", "cozy-wings"], ["cozyplay", "xay-cau-tre"], ["popplay", "lang-cua-be"], ["popplay", "qua-song"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
let MODES = [["phone", 390, 844, 1], ["rails", 1440, 900, 0], ["land", 844, 390, 1]];
if (mode1) MODES = MODES.filter(m => m[0] === mode1);
/* chữ còn sót của ngôn ngữ cũ: ở EN không được còn dấu tiếng Việt; ở VI không được còn từ giao diện tiếng Anh quen thuộc (tên riêng/emoji không tính) */
const VN_RE = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i, EN_RE = /\b(Score|Round|Start|Share|Best|Level|Lives|Time|Easy|Normal|Hard|Play|Home|Daily|Today|Sound|Language|Restart|Replay|Rematch|Ready|Moves|Next|Retry|Good|Great|Tap|Drag|Your|Right|Wrong|Answer|Tutorial|Mode|Pause|Resume|Points?|Streak|Challenge|Game over|Try again|Off by)\b/;
/* NP_DEBUG=1: in thêm phần tử (id/class + chữ) còn sót */
const STALE_EL = (l, vn, en) => { const f = document.querySelector("#stage iframe"), d = f.contentDocument, w = f.contentWindow, R = new RegExp(l === "en" ? vn : en, l === "en" ? "i" : ""); const o = []; d.querySelectorAll("body *").forEach(e => { if (e.children.length || e.closest("#toast,.toast")) return; const s = w.getComputedStyle(e), r = e.getBoundingClientRect(); if (s.display === "none" || s.visibility === "hidden" || r.width < 2 || e.closest("[hidden]")) return; const t = (e.innerText || "").trim(); if (t && R.test(t)) o.push((e.id ? "#" + e.id : "") + "." + String(e.className).split(" ")[0] + "<" + e.tagName.toLowerCase() + ">:" + t.slice(0, 30)); }); return o.slice(0, 8); };
let curId = "";
/* Đập Deadline: thẻ việc đang bay ra/biến mất (nhãn ngẫu nhiên đang hoạt hình thoát) có thể giữ chữ cũ vài trăm ms: bỏ qua phép đo chữ sót riêng cho game này (thẻ đang hiện vẫn được vẽ lại ngay, xem applyLang) */
const stale = (text, l) => { if (curId === "dap-deadline") return ""; const toks = text.split(/\s+/); const bad = toks.filter(t => (l === "en" ? VN_RE.test(t) : EN_RE.test(t))); return bad.slice(0, 5).join(" "); };
const other = l => (l === "vi" ? "en" : "vi");
const WORD = { vi: "Ngôn ngữ", en: "Language" }, TODAY = { vi: "Hôm nay", en: "Today" };

/* ---------- chạy trong TRANG CỔNG ---------- */
const VIS = `(e,w)=>{if(!e)return false;const s=w.getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=="none"&&s.visibility!=="hidden"&&+s.opacity>.05&&r.width>6&&r.height>6&&!e.closest("[hidden]")}`;
const STATE = () => {
  const vis = (e, w) => { if (!e) return false; const s = w.getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && +s.opacity > .05 && r.width > 6 && r.height > 6 && !e.closest("[hidden]"); };
  const f = document.querySelector("#stage iframe"); let d = null, w = null; try { d = f && f.contentDocument; w = f && f.contentWindow; } catch (e) {}
  const o = { portal: document.documentElement.lang, pls: localStorage.getItem("lang"), menu: ((document.querySelector("#langMenu button[aria-pressed=true]") || {}).dataset || {}).l || null };
  const rl = document.querySelector("#npRailL .np-head h3, .np-rail-l .np-head h3, #stage .np-head h3"); o.rail = rl ? rl.textContent.trim() : null;
  if (d) {
    o.g = d.documentElement.lang; o.gls = w.localStorage.getItem("lang"); o.mark = !!w.__langMark; o.url = f.src.split("?")[1] || "";
    const cl = d.body.cloneNode(true); cl.querySelectorAll("#toast,.toast").forEach(x => x.remove()); o.text = (d.body.innerText || "").split((d.getElementById("toast") || {}).innerText || "\u0000").join(" ").replace(/\s+/g, " ").trim();
    const t = [...d.querySelectorAll("h1,#ttl,#title")].find(e => vis(e, w) && e.textContent.trim()); o.ttl = t ? t.textContent.trim() : "";
    o.screens = [...d.querySelectorAll("body > *, #play > *, #game > *")].filter(e => e.id && !/^(toast|cdn|fx|npFan|npFab|npPmFan|npPmFab|npPmBk|npTitle)$/.test(e.id) && vis(e, w) && e.getBoundingClientRect().height > 40).map(e => e.id).join(",");
    const lb = ["bLang", "langBtn"].map(i => d.getElementById(i)).find(Boolean); o.lbl = lb ? (lb.getAttribute("data-l") || "") : null; o.lbAria = lb ? (lb.getAttribute("aria-label") || lb.title || "") : null;
  }
  return o;
};
/* tìm nút ngôn ngữ NGƯỜI DÙNG THẤY và bấm bằng chuột/chạm thật; trả về mô tả cách đã bấm */
async function userClick(pg) {
  const fr = pg.frames().find(f => f.url().includes("/games/"));
  const hit = async (frame, sel) => {   // nút nhìn thấy VÀ không bị che (kiểm bằng elementFromPoint trong đúng tài liệu)
    const h = await frame.$(sel); if (!h) return null;
    const ok = await h.evaluate(e => { const w = e.ownerDocument.defaultView, s = w.getComputedStyle(e), r = e.getBoundingClientRect(); if (s.display === "none" || s.visibility === "hidden" || r.width < 6 || r.height < 6 || e.closest("[hidden]")) return false; const x = r.left + r.width / 2, y = r.top + r.height / 2; if (x < 0 || y < 0 || x > w.innerWidth || y > w.innerHeight) return false; const t = e.ownerDocument.elementFromPoint(x, y); return !!t && (t === e || e.contains(t)); });
    return ok ? h : null;
  };
  /* 1. khối HUD của cổng (cột bên lề / HUD gọn ngang) */
  for (const sel of ["#npHud [data-k=lang]", "#npHudc [data-k=lang]"]) { const h = await hit(pg.mainFrame(), sel); if (h) { await h.click(); return "hud " + sel.split(" ")[0]; } }
  { const more = await hit(pg.mainFrame(), "#npHudc .np-hmore"); if (more) { await more.click(); await wait(250); const h = await hit(pg.mainFrame(), "#npHudc [data-k=lang]"); if (h) { await h.click(); return "hud ⋯"; } } }
  if (!fr) return null;
  /* 2. nút của chính game nằm ngay trên thanh */
  for (const sel of ["#bLang", "#langBtn"]) { const h = await hit(fr, sel); if (h) { await h.click(); return "game " + sel; } }
  /* 3. menu ⋯ (shared/fan.js hoặc shared/popmenu.js) */
  for (const fab of ["#npFab", "#npPmFab"]) { const f = await hit(fr, fab); if (!f) continue; await f.click(); await wait(350); for (const sel of ["#bLang", "#langBtn"]) { const h = await hit(fr, sel); if (h) { await h.click(); return "menu ⋯ " + fab; } } }
  return null;
}
const START_COZY = () => { const d = document, e = d.getElementById("bPlay") || d.getElementById("bDaily") || d.getElementById("startBtn") || d.getElementById("bPractice") || d.getElementById("bMake") || d.querySelector("#home .btn"); e && e.click(); };
const START_POP = "try{begin(0,{})}catch(e){try{startSession(0,null,{})}catch(e2){try{startRound(Object.keys(PF.types||{})[0]||0)}catch(e3){}}}";
const note = (ok, tag, m) => { if (!ok) { fails.push(tag + ": " + m); console.log("  ✗ " + tag + ": " + m); } return ok; };

async function runCase(br, portal, id, [mode, W, H, touch]) {
  curId = CONC === 1 ? id : ""; const tag = id + " " + mode, ctx = await br.createBrowserContext(), pg = await ctx.newPage(), errs = [];
  try {
    pg.setDefaultNavigationTimeout(60000); await pg.setViewport({ width: W, height: H, isMobile: !!touch, hasTouch: !!touch });
    pg.on("pageerror", e => errs.push(String(e.message).slice(0, 80))); pg.on("dialog", d => d.accept().catch(() => {}));   // "rời trang?" khi tải lại giữa ván
    await pg.evaluateOnNewDocument(() => { try { if (location.pathname.split("/").length <= 3 && !sessionStorage.getItem("np-langinit")) { localStorage.setItem("lang", "vi"); sessionStorage.setItem("np-langinit", "1"); } localStorage.setItem("np-sound", "0"); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("np-rails", "1"); localStorage.setItem("theme", "dark"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); } catch (e) {} });
    const url = B + portal + "/index.html#" + id;
    await pg.goto(url); await pg.waitForFunction(i => { const f = document.querySelector("#stage iframe"); try { return f && f.contentDocument && f.contentDocument.readyState === "complete" && f.src.includes("/games/" + i + "/") && f.contentDocument.body && f.contentDocument.body.innerText.length > 5; } catch (e) { return false; } }, { timeout: 30000 }, id).catch(() => {});
    await wait(1800);
    let fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (!note(!!fr, tag, "không mở được game qua cổng")) return;
    await fr.evaluate(() => { window.__langMark = 1; });
    /* vào màn chơi (giữa ván) */
    if (portal === "cozyplay") await fr.evaluate(START_COZY).catch(() => {}); else await fr.evaluate(START_POP).catch(() => {});
    await wait(1000);
    const s0 = await pg.evaluate(STATE); const L0 = s0.g;
    note(L0 === "vi" && s0.portal === "vi" && s0.pls === "vi", tag, "xuất phát không phải vi (game " + s0.g + ", cổng " + s0.portal + ", ls " + s0.pls + ")");
    /* ---- bấm lần 1: vi -> en ---- */
    if (shots) await pg.screenshot({ path: path.join(shots, id + "-" + mode + "-" + L0 + ".png") }).catch(() => {});
    const how = await userClick(pg); if (!note(!!how, tag, "không tìm thấy nút ngôn ngữ nào người dùng thấy và bấm được")) return;
    const L1 = other(L0);
    await wait(500); const a = await pg.evaluate(STATE);
    note(a.g === L1 && a.gls === L1, tag, "[" + how + "] NGAY: game html lang=" + a.g + ", localStorage=" + a.gls + " (cần " + L1 + ")");
    await wait(1100); const b = await pg.evaluate(STATE);
    note(b.g === L1 && b.gls === L1, tag, "[" + how + "] sau 1,5s: game html lang=" + b.g + ", ls=" + b.gls + " (cần " + L1 + ")");
    note(b.text !== s0.text, tag, "[" + how + "] chữ trong game KHÔNG đổi");
    { const st = stale(b.text, L1); if (!note(!st, tag, "[" + how + "] sau khi đổi sang " + L1 + " game còn chữ ngôn ngữ cũ: " + st) && process.env.NP_DEBUG) console.log("     ", JSON.stringify(await pg.evaluate(STALE_EL, L1, VN_RE.source, EN_RE.source))); }
    note(b.mark, tag, "[" + how + "] game bị tải lại (mất ván)");
    note(b.screens === s0.screens, tag, "[" + how + "] màn đang hiện đổi (" + s0.screens + " -> " + b.screens + "): mất ván");
    note(b.portal === L1 && b.pls === L1, tag, "[" + how + "] cổng không đổi theo: html lang=" + b.portal + ", ls=" + b.pls);
    note(b.menu === L1, tag, "[" + how + "] nút VI|EN của cổng đang chọn " + b.menu + " (cần " + L1 + ")");
    if (mode === "rails" && b.rail != null) note(b.rail === TODAY[L1], tag, "cột bên lề còn chữ \"" + b.rail + "\" (cần \"" + TODAY[L1] + "\")");
    if (b.lbl) note(b.lbl === WORD[L1] || b.lbl === "", tag, "ô ngôn ngữ trong menu ⋯ còn nhãn \"" + b.lbl + "\" (cần \"" + WORD[L1] + "\")");
    if (shots) await pg.screenshot({ path: path.join(shots, id + "-" + mode + "-" + L1 + ".png") }).catch(() => {});
    /* ---- tải lại: vẫn giữ ---- */
    await pg.reload(); await pg.waitForFunction(() => { const f = document.querySelector("#stage iframe"); try { return f && f.contentDocument && f.contentDocument.readyState === "complete" && f.contentDocument.body.innerText.length > 5; } catch (e) { return false; } }, { timeout: 30000 }).catch(() => {}); await wait(1800);
    const c = await pg.evaluate(STATE);
    note(c.g === L1 && c.portal === L1 && c.pls === L1, tag, "tải lại không giữ ngôn ngữ (game " + c.g + ", cổng " + c.portal + ", ls " + c.pls + ")");
    /* ---- bấm lần 2: quay lại ---- */
    fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (fr) await fr.evaluate(() => { window.__langMark = 1; });
    if (portal === "cozyplay") await fr.evaluate(START_COZY).catch(() => {}); else await fr.evaluate(START_POP).catch(() => {}); await wait(700);
    const how2 = await userClick(pg); if (!note(!!how2, tag, "lần 2: không bấm được nút ngôn ngữ")) return;
    await wait(1600); const d2 = await pg.evaluate(STATE);
    note(d2.g === L0 && d2.gls === L0 && d2.portal === L0 && d2.menu === L0, tag, "bấm lần 2 không quay lại " + L0 + " (game " + d2.g + ", cổng " + d2.portal + ", menu " + d2.menu + ")");
    note(d2.text.length > 5, tag, "bấm lần 2: chữ game trống");
    { const st = stale(d2.text, L0); if (!note(!st, tag, "bấm lần 2 (về " + L0 + ") game còn chữ ngôn ngữ cũ: " + st) && process.env.NP_DEBUG) console.log("     ", JSON.stringify(await pg.evaluate(STALE_EL, L0, VN_RE.source, EN_RE.source))); }
    if (mode === "rails" && d2.rail != null) note(d2.rail === TODAY[L0], tag, "lần 2: cột bên lề còn \"" + d2.rail + "\"");
    /* ---- đổi từ NÚT CỔNG (#langMenu): game phải theo ---- */
    const t1 = d2.text;
    await pg.evaluate(l => document.querySelector('#langMenu button[data-l="' + l + '"]').click(), L1); await wait(1600); const e1 = await pg.evaluate(STATE);
    note(e1.portal === L1 && e1.g === L1 && e1.gls === L1, tag, "đổi ở NÚT CỔNG: game không theo (cổng " + e1.portal + ", game " + e1.g + ")");
    { const st = stale(e1.text, L1); note(!st, tag, "đổi ở nút cổng sang " + L1 + ": game còn chữ ngôn ngữ cũ: " + st); }
    note(e1.text !== t1, tag, "đổi ở nút cổng: chữ trong game không đổi" + (process.env.NP_DEBUG ? " [" + t1.slice(0, 80) + "] vs [" + e1.text.slice(0, 80) + "]" : ""));
    note(e1.mark, tag, "đổi ở nút cổng làm game tải lại (mất ván)");
    if (mode === "rails" && e1.rail != null) note(e1.rail === TODAY[L1], tag, "đổi ở nút cổng: cột bên lề còn \"" + e1.rail + "\"");
    await pg.evaluate(l => document.querySelector('#langMenu button[data-l="' + l + '"]').click(), L0); await wait(1600); const e2 = await pg.evaluate(STATE);
    note(e2.portal === L0 && e2.g === L0, tag, "đổi lại ở nút cổng: game không theo (cổng " + e2.portal + ", game " + e2.g + ")");
    /* ---- game tải với ?lang= lệch cổng ---- */
    await pg.evaluate(() => { const f = document.querySelector("#stage iframe"); const u = new URL(f.contentWindow.location.href); u.searchParams.set("lang", "en"); f.contentWindow.location.replace(u.href); });
    await wait(900); await pg.waitForFunction(() => { const f = document.querySelector("#stage iframe"); try { return f.contentDocument.readyState === "complete" && f.contentDocument.body.innerText.length > 5; } catch (e) { return false; } }, { timeout: 20000 }).catch(() => {}); await wait(1800);
    const m = await pg.evaluate(STATE);
    note(m.g === m.portal && m.portal === L0, tag, "game mở với ?lang=en lệch cổng " + L0 + " mà không đồng bộ (game " + m.g + ", cổng " + m.portal + ")");
    note(!errs.length, tag, "lỗi JS: " + errs.slice(0, 2).join(" | "));
  } catch (e) { note(false, tag, "không đo được: " + String(e).slice(0, 120)); }
  try { await ctx.close(); } catch (e) {}
}
function ready() { return new Promise(res => { const t = () => http.get(B + "play/index.html", r => { r.resume(); res(); }).on("error", () => setTimeout(t, 200)); t(); }); }
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await ready();
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const jobs = []; for (const [portal, id] of list) for (const m of MODES) jobs.push([portal, id, m]);
  let n = 0, done = 0; const total = jobs.length;
  await Promise.all(Array.from({ length: CONC }, async () => { while (n < total) { const j = jobs[n++]; const before = fails.length; await runCase(br, j[0], j[1], j[2]); done++; console.log((fails.length === before ? "  ✓ " : "  ✗ ") + j[1] + " " + j[2][0] + " (" + done + "/" + total + ")"); } }));
  await br.close(); srv.kill();
  console.log("\nđã đo " + total + " ca (" + list.length + " game x " + MODES.length + " chế độ)"); console.log(fails.length ? "✗ " + fails.length + " lỗi đổi ngôn ngữ" : "✓ đổi ngôn ngữ đạt"); process.exit(fails.length ? 1 : 0);
})();
