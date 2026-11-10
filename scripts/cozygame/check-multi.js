/* Kiểm tra CHẾ ĐỘ "CHƠI CÙNG LÚC" (cozyplay/multi.html + shared/multi-games.js + ?multi=1 / giao thức np-* trong shared/bridge.js). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-multi.js [--quick] [--shots=<thư mục ảnh>]
   1) CỜ: mọi game (thư mục cozyplay/games/*, popplay/games/*) PHẢI có cờ trong shared/multi-games.js (mode parallel|focus, realtime, minW/minH, resumable, why) — game mới thiếu cờ là ✗.
   2) Host ở 390x844, 844x390, 768x1024, 1194x834, 1440x900 (bản --quick: 390x844 + 844x390 + 1194x834): ghép game parallel (2 điện thoại / 4 iPad / 6 máy tính):
        iframe có html.np-multi, không thanh trên/fan/popmenu, KHÔNG cuộn (host và trong game), khung ≥ minW/minH, icon góc ≥44px và không bị che / không đè nút của game,
        panel mở/đóng (bấm icon, Esc), chỉ 1 khung có tiếng, tạm dừng đóng băng (performance.now/rAF của game đứng yên) rồi chạy tiếp.
   3) FOCUS (điện thoại 390x844, tối đa 2 iframe sống): đổi game focus = game cũ đóng băng (điểm/vị trí không đổi), có thumbnail; vượt N → LRU đẩy ra sau khi lưu ván (np-resume),
      nạp lại đúng ván đã lưu, có đếm 3-2-1; số iframe sống không bao giờ vượt N.
   4) Máy chậm (setSlow) → khung phụ tạm dừng + không thêm khung; hết giờ phụ huynh → đóng tất cả khung + màn khoá; Pop (?portal=pop).
   LƯU Ý: Chrome headless với giả lập cảm ứng — KHÔNG đo được bộ nhớ thật, hiệu năng thật, tiếng thật (chỉ đo cờ muted/NPAudio.muted()). */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8879, O = "http://localhost:" + PORT;
const quick = process.argv.includes("--quick"), shotDir = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [];
const M = require(path.join(root, "shared", "multi-games.js"));
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const TUT = ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "dr", "d48", "gcv", "cw", "mc", "ch", "ga"];

(async () => {
  /* ---------- 1. cờ ---------- */
  const dirs = [["cozyplay"], ["popplay"]].flatMap(([p]) => fs.readdirSync(path.join(root, p, "games")).filter(d => fs.existsSync(path.join(root, p, "games", d, "index.html"))).map(d => [p, d]));
  dirs.forEach(([p, d]) => {
    const g = M.get(d);
    if (!g) return note(false, d, "thiếu cờ chơi cùng lúc trong shared/multi-games.js (khai báo mode, realtime, minW, minH, resumable, why — GAME_RULES 5h)");
    note(g.portal === p, d, "cờ ghi portal " + g.portal + " nhưng game nằm ở " + p);
    note(g.mode === "parallel" || g.mode === "focus", d, "mode phải là parallel|focus");
    note(typeof g.realtime === "boolean" && typeof g.resumable === "boolean", d, "realtime/resumable phải là true|false");
    note(g.minW >= 200 && g.minH >= 200 && g.minW <= 600 && g.minH <= 600, d, "minW/minH không hợp lý: " + g.minW + "x" + g.minH);
    note(typeof g.why === "string" && g.why.length > 8, d, "thiếu lý do phân loại (why)");
    note(!!(g.vi && g.en && g.icon), d, "thiếu tên vi/en hoặc icon");
  });
  M.ids().forEach(id => note(dirs.some(([, d]) => d === id), id, "cờ cho game không tồn tại"));
  console.log("  cờ: " + dirs.length + " game, " + dirs.filter(([, d]) => (M.get(d) || {}).mode === "parallel").length + " parallel / " + dirs.filter(([, d]) => (M.get(d) || {}).mode === "focus").length + " focus");

  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"], protocolTimeout: 120000 });
  if (shotDir) fs.mkdirSync(shotDir, { recursive: true });
  const SAMPLE = (ms) => new Promise(res => { const t0 = performance.now(); let n = 0, bad = 0, worst = 0, sizeBad = 0; const chk = () => { const its = NPMulti.items().filter(i => i.where === "slot"); for (let i = 0; i < its.length; i++) for (let j = i + 1; j < its.length; j++) { const a = its[i].rect, b = its[j].rect, ox = Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]), oy = Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]); if (ox > 4 && oy > 4) { bad++; worst = Math.max(worst, Math.min(ox, oy)); } } n++; };
    const f = () => { chk(); if (performance.now() - t0 < ms) requestAnimationFrame(f); else { const st = NPMulti.items().filter(i => i.where === "slot" && i.alive).map(i => { const w = NPMulti.frame(i.id).contentWindow; return Math.abs(w.innerWidth - i.rect[2]) > 2 || Math.abs(w.innerHeight - i.rect[3]) > 2 ? i.id + ":" + w.innerWidth + "x" + w.innerHeight + "≠" + i.rect[2] + "x" + i.rect[3] : null; }).filter(Boolean); res({ n, bad, worst, size: st, sel: NPMulti.items().filter(i => i.sel).length, slots: NPMulti.items().filter(i => i.where === "slot").length }); } }; requestAnimationFrame(f); });
  const open = async (q, W, H, pre) => {
    const pg = await br.newPage(); pg._errs = []; pg.on("pageerror", e => pg._errs.push(e.message));
    await pg.setViewport({ width: W, height: H, isMobile: W < 1300, hasTouch: W < 1300 });
    await pg.evaluateOnNewDocument((tut, pre) => { if (!sessionStorage.getItem("__i")) { sessionStorage.setItem("__i", "1"); localStorage.clear(); } localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); tut.forEach(k => localStorage.setItem("tut_" + k, "1")); (pre || []).forEach(([k, v]) => localStorage.setItem(k, v)); }, TUT, pre || []);
    await pg.evaluateOnNewDocument(src => { window.__sample = new Function("return " + src)(); }, SAMPLE.toString());
    await pg.goto(O + "/cozyplay/multi.html?" + q, { waitUntil: "load" }); return pg;
  };
  const ready = async (pg, n, ms) => { for (let i = 0; i < (ms || 60); i++) { const r = await pg.evaluate(n => { const it = window.NPMulti && NPMulti.items(); return !!it && it.filter(x => x.where === "slot" && x.ready).length >= n; }, n).catch(() => false); if (r) return true; await wait(250); } return false; };
  /* chạy trong frame game: trạng thái đồng hồ ảo */
  const clk = (pg, id) => pg.evaluate(id => { const f = NPMulti.frame(id), w = f && f.contentWindow; if (!w) return null; return { t: Math.round(w.performance.now()), raf: w.__rafN || 0, dn: w.Date.now(), real: Math.abs(new w.Date().getTime() - Date.now()) < 3000 }; }, id);
  const hookRaf = (pg, id) => pg.evaluate(id => { const w = NPMulti.frame(id).contentWindow; if (w.__rafN != null) return; w.__rafN = 0; const f = () => { w.__rafN++; w.requestAnimationFrame(f); }; w.requestAnimationFrame(f); }, id);
  const startPlay = async (pg, id) => {   /* bắt đầu ván trong khung của game */
    for (const sel of ["#bDaily", "#bPlay", "#home .tile", ".main", ".band", ".dbar", "#bPractice", "#bCamp"]) {
      const ok = await pg.evaluate((id, sel) => { const d = NPMulti.frame(id).contentDocument, e = d.querySelector(sel); if (!e) return false; e.click(); return true; }, id, sel).catch(() => false); if (!ok) continue; await wait(800);
      for (let k = 0; k < 2; k++) { await pg.evaluate(id => { const d = NPMulti.frame(id).contentDocument, g = d.getElementById("hwGo"); if (g && g.offsetParent) g.click(); }, id).catch(() => {}); await wait(400); }
      for (let k = 0; k < 8; k++) { await wait(400); if (await pg.evaluate(id => !!NPMulti.frame(id).contentWindow.NP.peek(), id).catch(() => false)) return true; }
    }
    return false;
  };

  /* ---------- 2. bố cục + icon + panel + tiếng + tạm dừng ---------- */
  const SIZES = [["phone-dọc", 390, 844], ["phone-ngang", 844, 390], ["ipad-dọc", 768, 1024], ["ipad-ngang", 1194, 834], ["pc", 1440, 900]].filter(s => !quick || ["phone-dọc", "phone-ngang", "ipad-ngang"].includes(s[0]));
  const PAR = ["doi-doi-2048", "noi-mot-net", "ve-mot-net", "xin-nghi", "me-cung-truyen-tay", "cat-banh-chung"];
  for (const [name, W, H] of SIZES) {
    const tag = "multi " + name + " " + W + "x" + H;
    const pg = await open("games=" + PAR.join(","), W, H);
    const cap = await pg.evaluate(() => 0).then(() => null); await wait(800);
    const caps = await pg.evaluate(() => NPMulti.caps()), n = Math.min(caps.slots, PAR.length);
    const ok = await ready(pg, n); note(ok, tag, "các khung không tải xong (" + n + " khung)");
    await wait(1200);
    const info = await pg.evaluate(() => ({ items: NPMulti.items(), host: { sh: document.documentElement.scrollHeight, ch: innerHeight, sw: document.documentElement.scrollWidth, cw: innerWidth }, empty: document.getElementById("empty").hidden }));
    const slots = info.items.filter(i => i.where === "slot");
    note(slots.length === n, tag, "mong " + n + " khung, có " + slots.length + " (" + JSON.stringify(caps) + ")");
    note(info.host.sh <= info.host.ch + 1 && info.host.sw <= info.host.cw + 1, tag, "trang host bị cuộn: " + info.host.sh + ">" + info.host.ch);
    for (const it of slots) {
      const g = M.get(it.id), t2 = tag + " " + it.id;
      const land = it.rect[2] > it.rect[3] && g.landH; note(it.rect[2] >= (land ? g.landW || g.minW : g.minW) && it.rect[3] >= (land ? g.landH : g.minH), t2, "khung " + it.rect[2] + "x" + it.rect[3] + " nhỏ hơn minW/minH " + g.minW + "x" + g.minH);
      const q = await pg.evaluate(id => {
        const f = NPMulti.frame(id), d = f.contentDocument, w = f.contentWindow, de = d.documentElement, vis = e => { if (!e) return false; const r = e.getBoundingClientRect(), cs = w.getComputedStyle(e); return cs.display !== "none" && r.width > 0 && r.height > 0; };
        const fr = f.getBoundingClientRect(), mi = f.parentNode.querySelector(".mi").getBoundingClientRect();
        const ix = mi.left - fr.left, iy = mi.top - fr.top, hit = [ix, iy, ix + mi.width, iy + mi.height], over = [];
        d.querySelectorAll("button,a[href],input,select,[role=button]").forEach(e => { if (!vis(e) || e.closest("[hidden]")) return; const r = e.getBoundingClientRect(); if (r.right > hit[0] && r.left < hit[2] && r.bottom > hit[1] && r.top < hit[3]) over.push((e.id || e.className || e.tagName).toString().slice(0, 20)); });
        const top = f.parentNode.ownerDocument.elementFromPoint(mi.left + mi.width / 2, mi.top + mi.height / 2);
        return { multi: de.classList.contains("np-multi"), top: vis(d.querySelector(".top")), fan: vis(d.getElementById("npFan")) || vis(d.getElementById("npFab")) || vis(d.getElementById("npPmFan")) || vis(d.getElementById("npResume")) || vis(d.getElementById("npxO")) || vis(d.getElementById("npInApp")),
          sx: de.scrollWidth, sy: Math.max(de.scrollHeight, d.body.scrollHeight), iw: w.innerWidth, ih: w.innerHeight, mi: [Math.round(mi.width), Math.round(mi.height)], miTop: !!(top && top.closest(".mi")), over };
      }, it.id);
      note(q.multi, t2, "iframe không có html.np-multi"); note(!q.top, t2, "thanh trên (.top) vẫn hiện"); note(!q.fan, t2, "fan/popmenu/thẻ tiếp tục/hộp thoát/banner vẫn hiện");
      note(q.sx <= q.iw + 1 && q.sy <= q.ih + 1, t2, "game bị cuộn " + q.sx + "x" + q.sy + " > " + q.iw + "x" + q.ih);
      note(q.mi[0] >= 44 && q.mi[1] >= 44, t2, "icon góc nhỏ hơn 44px: " + q.mi.join("x")); note(q.miTop, t2, "icon góc bị che");
      note(q.over.length === 0, t2, "icon góc đè lên nút của game: " + q.over.join(","));
    }
    /* panel mở/đóng */
    const id0 = slots[0] && slots[0].id;
    if (id0) {
      await pg.evaluate(id => document.querySelector('.fr[data-id="' + id + '"] .mi').click(), id0); await wait(200);
      const op = await pg.evaluate(id => { const fr = document.querySelector('.fr[data-id="' + id + '"]'), p = fr.querySelector(".pn").getBoundingClientRect(), r = fr.getBoundingClientRect(); return { open: fr.classList.contains("po-open"), inside: p.left >= r.left - 1 && p.right <= r.right + 1 && p.top >= r.top - 1 && p.bottom <= r.bottom + 1, btns: [...fr.querySelectorAll(".pn button")].filter(b => b.offsetParent).map(b => Math.min(b.getBoundingClientRect().width, b.getBoundingClientRect().height)), txt: fr.querySelector(".pn").textContent }; }, id0);
      note(op.open, tag, "bấm icon không mở panel"); note(op.inside, tag, "panel tràn ra ngoài khung"); note(op.btns.every(b => b >= 43), tag, "nút trong panel nhỏ hơn 44px " + op.btns.join(","));
      note(/Điểm/.test(op.txt) && /(Combo|Lượt)/.test(op.txt), tag, "panel thiếu điểm/combo");
      if (shotDir) await pg.screenshot({ path: path.join(shotDir, "multi-" + name + "-panel.png") });
      await pg.keyboard.press("Escape"); await wait(150);
      note(!(await pg.evaluate(id => document.querySelector('.fr[data-id="' + id + '"]').classList.contains("po-open"), id0)), tag, "Esc không đóng panel");
      await pg.evaluate(id => document.querySelector('.fr[data-id="' + id + '"] .mi').click(), id0); await wait(150); await pg.evaluate(id => document.querySelector('.fr[data-id="' + id + '"] .mi').click(), id0); await wait(150);
      note(!(await pg.evaluate(id => document.querySelector('.fr[data-id="' + id + '"]').classList.contains("po-open"), id0)), tag, "bấm icon lần 2 không đóng panel");
    }
    /* chỉ còn khung chơi + icon nhỏ: thanh trên host ẩn khi có game; ← / + / khay nằm trong menu #hm */
    const ch = await pg.evaluate(() => { const rail = document.getElementById("rail"), g = document.getElementById("grid").getBoundingClientRect(), hm = document.getElementById("hm"), r = hm.getBoundingClientRect(), top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      const fr = NPMulti.items().find(i => i.where === "slot"), f = NPMulti.frame(fr.id), d = f.contentDocument, fb = f.getBoundingClientRect(), over = [];
      d.querySelectorAll("button,a[href],input,select,[role=button]").forEach(e => { const q = e.getBoundingClientRect(); if (!q.width || e.closest("[hidden]") || d.defaultView.getComputedStyle(e).display === "none") return; const L = q.left + fb.left, T = q.top + fb.top; if (L + q.width > r.left && L < r.right && T + q.height > r.top && T < r.bottom) over.push((e.id || e.className || e.tagName).toString().slice(0, 20)); });
      return { railVisible: rail.offsetParent !== null, gh: g.height, ih: innerHeight, hm: [Math.round(r.width), Math.round(r.height)], hmTop: !!(top && top.closest("#hm")), over, hidden: hm.hidden }; });
    note(!ch.railVisible, tag, "thanh trên host vẫn hiện khi đang có game"); note(ch.gh >= ch.ih - 14, tag, "khung game chưa chiếm gần toàn màn (" + ch.gh + "/" + ch.ih + ")");
    note(!ch.hidden && ch.hm[0] >= 44 && ch.hm[1] >= 44, tag, "icon menu chung nhỏ hơn 44px " + ch.hm.join("x")); note(ch.hmTop, tag, "icon menu chung bị che"); note(ch.over.length === 0, tag, "icon menu chung đè nút của game: " + ch.over.join(","));
    await pg.evaluate(() => document.getElementById("hm").click()); await wait(150);
    const hp = await pg.evaluate(() => { const p = document.getElementById("hp"), r = p.getBoundingClientRect(), b = [...p.querySelectorAll("button")].map(x => Math.min(x.getBoundingClientRect().width, x.getBoundingClientRect().height)); return { on: p.classList.contains("on"), inside: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, b }; });
    note(hp.on && hp.inside && hp.b.length >= 2 && hp.b.every(x => x >= 43), tag, "menu chung: mở/vừa màn hình/nút ≥44px " + JSON.stringify(hp));
    if (shotDir) await pg.screenshot({ path: path.join(shotDir, "multi-" + name + "-hostmenu.png") });
    await pg.keyboard.press("Escape"); await pg.evaluate(() => document.getElementById("grid").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))); await wait(150);
    note(!(await pg.evaluate(() => document.getElementById("hp").classList.contains("on"))), tag, "menu chung không đóng khi bấm ra ngoài");
    /* chỉ 1 khung có tiếng */
    const snd = () => pg.evaluate(() => NPMulti.items().filter(i => i.where === "slot").map(i => ({ id: i.id, sel: i.sel, muted: NPMulti.frame(i.id).contentWindow.NPAudio.muted() })));
    await wait(300); let s1 = await snd(); note(s1.filter(x => !x.muted).length === 1 && s1.filter(x => x.sel).length === 1 && s1.every(x => x.sel === !x.muted), tag, "phải đúng 1 khung được chọn và có tiếng: " + JSON.stringify(s1));
    if (slots.length > 1) { await pg.evaluate(id => NPMulti.select(id), slots[0].id); await wait(300); s1 = await snd(); note(s1.filter(x => !x.muted).length === 1 && !s1.find(x => x.id === slots[0].id).muted, tag, "chọn khung khác: tiếng không chuyển sang khung được chọn " + JSON.stringify(s1)); }
    /* tạm dừng đóng băng */
    if (id0) {
      await hookRaf(pg, id0); await wait(300);
      const a = await clk(pg, id0); await wait(500); const b = await clk(pg, id0);
      note(b.t - a.t >= 300 && b.raf > a.raf, tag, "khung đang chạy mà đồng hồ/rAF không tiến: " + JSON.stringify([a, b]));
      await pg.evaluate(id => document.querySelector('.fr[data-id="' + id + '"] .mi').click(), id0); await wait(100);
      await pg.evaluate(id => document.querySelector('.fr[data-id="' + id + '"] .pn [data-a=pz]').click(), id0); await wait(300);
      const c = await clk(pg, id0); await wait(700); const d = await clk(pg, id0);
      note(d.t - c.t <= 5 && d.raf - c.raf <= 1, tag, "tạm dừng mà đồng hồ/rAF vẫn chạy: " + JSON.stringify([c, d]));
      note(d.dn - c.dn <= 5, tag, "tạm dừng mà Date.now() vẫn chạy: " + (d.dn - c.dn) + "ms"); note(d.real && c.real, tag, "new Date() không còn là giờ thật");
      await pg.evaluate(id => document.querySelector('.fr[data-id="' + id + '"] .pn [data-a=pz]').click(), id0); await wait(500);
      const e = await clk(pg, id0); await wait(500); const f = await clk(pg, id0);
      note(f.t - e.t >= 300 && f.raf > e.raf, tag, "tiếp tục mà đồng hồ/rAF không chạy lại: " + JSON.stringify([e, f]));
      note(f.dn - e.dn >= 300 && e.dn - d.dn < 1500, tag, "Date.now() không chạy lại / nhảy vọt sau tiếp tục");
      note(e.t - d.t < 1500, tag, "đồng hồ ảo nhảy vọt sau khi tiếp tục (" + (e.t - d.t) + "ms)");
    }
    if (pg._errs.length) note(false, tag, "lỗi JS: " + pg._errs[0]);
    if (shotDir) await pg.screenshot({ path: path.join(shotDir, "multi-" + name + ".png") });
    console.log("  " + tag + ": " + slots.length + " khung " + JSON.stringify(caps) + (pg._errs.length ? " (lỗi JS)" : ""));
    await pg.close();
  }

  /* ---------- 2a. KHÔNG CHỒNG LẤN khi đóng/thêm/xoay (lỗi iPad Safari: khung phóng to đè khung còn lại) ---------- */
  const OV_SIZES = (quick ? [[390, 844], [768, 1024], [1194, 834]] : [[390, 844], [844, 390], [768, 1024], [1024, 768], [834, 1194], [1194, 834], [1440, 900]]);
  for (const [W, H] of OV_SIZES) {
    const tag = "multi không chồng lấn " + W + "x" + H, pg = await open("games=" + PAR.join(","), W, H); const mx = (await pg.evaluate(() => NPMulti.caps())).slots, ids = PAR.slice(0, mx);
    note(await ready(pg, mx), tag, "không tải xong " + mx + " khung"); await wait(1000);
    if (mx > 1) await startPlay(pg, ids[0]);   /* có một khung đang chơi, không chỉ màn chọn */
    let samples = 0, worstAll = 0;
    const ns = quick ? [mx] : Array.from({ length: mx - 1 }, (_, k) => k + 2).reverse();
    for (const n of ns) {
      while ((await pg.evaluate(() => NPMulti.items().filter(i => i.where === "slot").length)) > n) await pg.evaluate(() => NPMulti.close(NPMulti.items().filter(i => i.where === "slot").pop().id));
      for (let i = 0; i < n; i++) {
        const slots = await pg.evaluate(() => NPMulti.items().filter(i => i.where === "slot").map(i => i.id)); if (slots.length < n) { for (const id of ids.filter(x => !slots.includes(x)).slice(0, n - slots.length)) await pg.evaluate(id => NPMulti.add(id), id); await ready(pg, n); await wait(700); }
        const cur = await pg.evaluate(() => NPMulti.items().filter(i => i.where === "slot").map(i => i.id)), victim = cur[i];
        const r = await pg.evaluate(async id => { NPMulti.close(id); return await window.__sample(1500); }, victim).catch(async () => null);
        if (r === null) { /* __sample chưa có: nạp */ }
        samples += r ? r.n : 0; if (r) { worstAll = Math.max(worstAll, r.worst); note(r.bad === 0, tag + " n=" + n + "→" + (n - 1) + " đóng #" + i, r.bad + " mẫu chồng lấn (tối đa " + r.worst + "px)"); note(r.size.length === 0, tag + " n=" + n + " đóng #" + i, "iframe có kích thước trong lệch khung: " + r.size.join(",")); note(r.sel === 1 || r.slots === 0, tag + " n=" + n + " đóng #" + i, "sau khi đóng phải có đúng 1 khung được chọn (" + r.sel + ")"); }
        /* trả lại khung vừa đóng để đo tiếp (thêm cũng không được chồng lấn) */
        await pg.evaluate(id => NPMulti.add(id), victim); const r2 = await pg.evaluate(async () => await window.__sample(900)); if (r2) { note(r2.bad === 0, tag + " thêm lại sau đóng #" + i, r2.bad + " mẫu chồng lấn"); }
        await ready(pg, n); await wait(400);
      }
    }
    /* xoay màn hình khi đang có nhiều khung */
    if (mx >= 3) { for (const [w2, h2] of [[H, W], [W, H]]) { await pg.evaluate(() => { window.__p = window.__sample(1800); }); await pg.setViewport({ width: w2, height: h2, isMobile: W < 1300, hasTouch: W < 1300 }); const r = await pg.evaluate(async () => await window.__p); note(r.bad === 0 && r.size.length === 0, tag + " xoay " + w2 + "x" + h2, r.bad + " mẫu chồng lấn; lệch kích thước " + r.size.join(",")); } }
    console.log("  " + tag + ": " + samples + " mẫu rAF, chồng lấn tối đa " + worstAll + "px");
    if (pg._errs.length) note(false, tag, "lỗi JS: " + pg._errs[0]);
    if (shotDir) await pg.screenshot({ path: path.join(shotDir, "multi-overlap-" + W + "x" + H + ".png") });
    await pg.close();
  }

  /* ---------- 2b. huy hiệu điểm + công tắc ẩn bảng điểm của game ---------- */
  {
    const tag = "multi hud 390x844", pg = await open("games=doi-doi-2048,xin-nghi", 390, 844); await ready(pg, 2); await wait(1200);
    const played = await startPlay(pg, "doi-doi-2048"); note(played, tag, "không bắt đầu được ván 2048"); await wait(900);
    const shown = id => pg.evaluate(id => { const d = NPMulti.frame(id).contentDocument, e = d.getElementById("sSc"); return !!(e && e.offsetParent !== null); }, id);
    const hud = await pg.evaluate(() => NPMulti.items().find(i => i.id === "doi-doi-2048").hud);
    note(hud && hud.hc > 0, tag, "game không báo ô bảng điểm ẩn được (hc) " + JSON.stringify(hud));
    note(!(await shown("doi-doi-2048")), tag, "mặc định phải ẩn ô Điểm của game");
    const bd = await pg.evaluate(() => { const b = document.querySelector('.fr[data-id="doi-doi-2048"] .mi .bd'), r = b.getBoundingClientRect(), fr = document.querySelector('.fr[data-id="doi-doi-2048"]').getBoundingClientRect(); return { on: b.classList.contains("on"), txt: b.textContent, inFrame: r.right <= fr.right + 1 && r.top >= fr.top - 1, h: r.height }; });
    note(bd.on && bd.txt !== "" && bd.inFrame, tag, "huy hiệu điểm không hiện/tràn khung " + JSON.stringify(bd));
    await pg.evaluate(() => document.querySelector('.fr[data-id="doi-doi-2048"] .mi').click()); await wait(150);
    const sw = await pg.evaluate(() => { const b = document.querySelector('.fr[data-id="doi-doi-2048"] .pn .sw'), r = b.getBoundingClientRect(), p = document.querySelector('.fr[data-id="doi-doi-2048"] .pn').getBoundingClientRect(); return { vis: !b.hidden, h: r.height, pressed: b.getAttribute("aria-pressed"), inside: r.bottom <= p.bottom + 1 }; });
    note(sw.vis && sw.h >= 43 && sw.pressed === "true" && sw.inside, tag, "công tắc ẩn bảng điểm " + JSON.stringify(sw));
    await pg.evaluate(() => document.querySelector('.fr[data-id="doi-doi-2048"] .pn .sw').click()); await wait(1000);
    note(await shown("doi-doi-2048"), tag, "tắt công tắc mà ô Điểm không hiện lại");
    note(await pg.evaluate(() => localStorage.getItem("np-multi-hud:doi-doi-2048")) === "0", tag, "không nhớ lựa chọn theo game");
    await pg.evaluate(() => document.querySelector('.fr[data-id="doi-doi-2048"] .pn .sw').click()); await wait(1000); note(!(await shown("doi-doi-2048")), tag, "bật lại công tắc mà ô Điểm vẫn hiện");
    if (shotDir) { await pg.keyboard.press("Escape"); await wait(200); await pg.screenshot({ path: path.join(shotDir, "multi-hud-hidden.png") }); }
    await pg.close();
  }

  /* ---------- 3. FOCUS + LRU + nạp lại ván ---------- */
  {
    const tag = "multi focus 390x844", pg = await open("", 390, 844);
    await pg.evaluate(() => document.getElementById("sheet").hidden = true);
    const aliveOK = async what => { const n = await pg.evaluate(() => NPMulti.alive()), cap = await pg.evaluate(() => NPMulti.caps().alive); note(n <= cap, tag, what + ": " + n + " iframe sống > " + cap); };
    await pg.evaluate(() => NPMulti.add("ne-o-ga")); note(await ready(pg, 1), tag, "ne-o-ga không tải xong"); await wait(800);
    const played = await startPlay(pg, "ne-o-ga"); note(played, tag, "không bắt đầu được ván ne-o-ga"); await wait(1500);
    const stA = await pg.evaluate(() => JSON.stringify(NPMulti.frame("ne-o-ga").contentWindow.NP.peek()));
    await pg.evaluate(() => NPMulti.add("xay-cau-tre")); await wait(1200); await aliveOK("sau khi thêm focus thứ 2");
    let it = await pg.evaluate(() => NPMulti.items()), A = it.find(i => i.id === "ne-o-ga"), B = it.find(i => i.id === "xay-cau-tre");
    note(A && A.where === "tray" && A.sentPaused, tag, "game focus cũ không bị đóng băng/đưa vào khay: " + JSON.stringify(A));
    note(B && B.where === "slot" && B.sel, tag, "game focus mới không thành khung chính");
    note(A && A.thumb, tag, "game canvas không có thumbnail khi rời");
    note(await pg.evaluate(() => document.querySelectorAll(".tc").length === 1), tag, "khay không hiện thumbnail game dở");
    if (A && A.alive) {   /* còn sống trong khay: đồng hồ đứng yên */
      const c = await clk(pg, "ne-o-ga"); await wait(700); const d = await clk(pg, "ne-o-ga"); note(d && c && d.t - c.t <= 5, tag, "game ở khay mà đồng hồ vẫn chạy");
      const stA2 = await pg.evaluate(() => JSON.stringify(NPMulti.frame("ne-o-ga").contentWindow.NP.peek())); note(stA2 === stA || /"d":/.test(stA2), tag, "ván game ở khay bị đổi");
    }
    await pg.evaluate(() => NPMulti.add("shipper-sieu-toc")); await wait(1500); await aliveOK("sau khi thêm focus thứ 3 (LRU)");
    it = await pg.evaluate(() => NPMulti.items()); A = it.find(i => i.id === "ne-o-ga");
    note(A && !A.alive && A.saved, tag, "LRU không đẩy game cũ nhất ra: " + JSON.stringify(A));
    const rec = await pg.evaluate(() => localStorage.getItem("np-resume:ne-o-ga")); note(!!rec, tag, "game bị đẩy ra không lưu ván (np-resume:ne-o-ga)");
    if (shotDir) await pg.screenshot({ path: path.join(shotDir, "multi-focus-tray.png") });
    /* chọn lại từ khay: nạp đúng ván đã lưu + đếm 3-2-1 */
    await pg.evaluate(() => document.querySelector('.tc[data-id="ne-o-ga"]').click());
    let sawCount = false; for (let i = 0; i < 20; i++) { await wait(200); if (await pg.evaluate(() => NPMulti.items().some(x => x.id === "ne-o-ga" && x.counting))) { sawCount = true; break; } }
    note(sawCount, tag, "chọn lại game dở không có đếm ngược 3-2-1");
    if (sawCount && shotDir) await pg.screenshot({ path: path.join(shotDir, "multi-focus-countdown.png") });
    for (let i = 0; i < 30; i++) { await wait(200); if (!(await pg.evaluate(() => NPMulti.items().some(x => x.id === "ne-o-ga" && x.counting)))) break; }
    await aliveOK("sau khi nạp lại ván"); await wait(600);
    const back = await pg.evaluate(() => { const w = NPMulti.frame("ne-o-ga") && NPMulti.frame("ne-o-ga").contentWindow; return w ? { st: JSON.stringify(w.NP.peek()), seed: (w.NP.peek() || {}).seed, hud: NPMulti.items().find(x => x.id === "ne-o-ga").hud } : null; });
    const seedA = JSON.parse(stA).seed;
    note(back && back.seed === seedA, tag, "ván nạp lại khác ván đã lưu (seed " + (back && back.seed) + " ≠ " + seedA + ")");
    note(back && back.hud && back.hud.state === "playing", tag, "ván nạp lại không ở trạng thái đang chơi: " + JSON.stringify(back && back.hud));
    it = await pg.evaluate(() => NPMulti.items()); note(it.find(i => i.id === "ne-o-ga").where === "slot" && it.filter(i => i.where === "slot" && i.mode === "focus").length === 1, tag, "sau khi đổi phải có đúng 1 game focus ở khung chính");
    if (pg._errs.length) note(false, tag, "lỗi JS: " + pg._errs[0]);
    console.log("  " + tag + ": " + JSON.stringify(it.map(i => i.id + ":" + i.where + (i.alive ? "+" : "-"))));
    /* máy chậm: khung phụ tạm dừng, không thêm khung */
    await pg.evaluate(() => NPMulti.close("shipper-sieu-toc")); await pg.evaluate(() => NPMulti.add("noi-mot-net")); await wait(1200);
    await pg.evaluate(() => NPMulti.select("ne-o-ga")); await wait(200); await pg.evaluate(() => NPMulti.setSlow(true)); await wait(400);
    it = await pg.evaluate(() => NPMulti.items()); const par = it.find(i => i.id === "noi-mot-net");
    note(par && par.paused && par.sentPaused, tag + " (máy chậm)", "khung phụ chưa tạm dừng khi máy chậm");
    const n0 = await pg.evaluate(() => NPMulti.alive()); await pg.evaluate(() => NPMulti.add("ve-mot-net")); await wait(300); note(n0 === await pg.evaluate(() => NPMulti.alive()), tag + " (máy chậm)", "vẫn thêm được khung khi máy chậm");
    note(await pg.evaluate(() => document.getElementById("perf").classList.contains("on")), tag + " (máy chậm)", "không báo máy chậm");
    await pg.close();
  }

  /* ---------- 4. hết giờ phụ huynh + Pop ---------- */
  {
    const day = new Date().toLocaleDateString("sv"), tag = "multi hết giờ";
    const pg = await open("games=doi-doi-2048", 390, 844, [["prefs", JSON.stringify({ limit: 1, off: [] })], ["usage", JSON.stringify({ d: day, s: 59 })]]);
    await wait(1500); let lock = await pg.evaluate(() => ({ lock: !document.getElementById("lock").hidden, n: document.querySelectorAll("iframe").length }));
    if (!lock.lock) { await wait(2500); lock = await pg.evaluate(() => ({ lock: !document.getElementById("lock").hidden, n: document.querySelectorAll("iframe").length })); }
    note(lock.lock && lock.n === 0, tag, "hết giờ mà chưa đóng khung/hiện màn khoá " + JSON.stringify(lock)); await pg.close();
    const pg2 = await open("games=doi-doi-2048", 390, 844, [["prefs", JSON.stringify({ limit: 1, off: [] })], ["usage", JSON.stringify({ d: day, s: 60 })]]);
    await wait(900); note(await pg2.evaluate(() => !document.getElementById("lock").hidden && document.querySelectorAll("iframe").length === 0), tag, "đã hết giờ từ trước mà vẫn mở được game"); await pg2.close();
    const pp = await open("portal=pop&games=lang-cua-be,qua-song", 390, 844); const ok = await ready(pp, 2); note(ok, "multi pop", "Pop: khung không tải xong"); await wait(1500);
    const pi = await pp.evaluate(() => NPMulti.items().map(i => { const f = NPMulti.frame(i.id), d = f.contentDocument, de = d.documentElement; return { id: i.id, multi: de.classList.contains("np-multi"), sy: Math.max(de.scrollHeight, d.body.scrollHeight), ih: f.contentWindow.innerHeight, sx: de.scrollWidth, iw: f.contentWindow.innerWidth, w: i.rect[2], h: i.rect[3] }; }));
    pi.forEach(x => { note(x.multi, "multi pop " + x.id, "không có np-multi"); note(x.sy <= x.ih + 1 && x.sx <= x.iw + 1, "multi pop " + x.id, "bị cuộn"); note(x.w >= M.get(x.id).minW && x.h >= M.get(x.id).minH, "multi pop " + x.id, "khung nhỏ hơn minW/minH"); });
    if (shotDir) await pp.screenshot({ path: path.join(shotDir, "multi-pop.png") });
    await pp.close();
  }
  /* ---------- 5. ?portal=all: Cozy + Pop cạnh nhau ---------- */
  for (const [W, H, games] of [[390, 844, "doi-doi-2048,lang-cua-be"], [1194, 834, "doi-doi-2048,lang-cua-be,ten-lua-cua-be"]]) {
    const tag = "multi all " + W + "x" + H, pg = await open("portal=all&games=" + games, W, H), n = games.split(",").length;
    note(await ready(pg, Math.min(n, (await pg.evaluate(() => NPMulti.caps())).slots)), tag, "khung Cozy+Pop không tải xong"); await wait(1500);
    const r = await pg.evaluate(() => ({ items: NPMulti.items(), theme: document.documentElement.dataset.app, tiles: (() => { document.getElementById("bAdd").click(); return document.querySelectorAll(".tile").length; })(), sh: document.documentElement.scrollHeight, ih: innerHeight,
      urls: NPMulti.items().map(i => NPMulti.frame(i.id) && NPMulti.frame(i.id).src), docs: NPMulti.items().map(i => { const f = NPMulti.frame(i.id); return f && f.contentDocument.documentElement.classList.contains("np-multi"); }),
      snd: NPMulti.items().filter(i => i.where === "slot").map(i => NPMulti.frame(i.id).contentWindow.NPAudio.muted()), tags: (() => { const all = new Set(); for (let k = 0; k < 8; k++) { document.querySelectorAll(".tile .tg").forEach(x => all.add(x.textContent)); const nx = document.getElementById("pgNext"); if (nx.disabled) break; nx.click(); } return [...all]; })() }));
    await pg.evaluate(() => document.getElementById("shX").click());
    note(r.urls.some(u => /\/popplay\/games\/lang-cua-be\//.test(u || "")) && r.urls.some(u => /\/cozyplay\/games\/doi-doi-2048\//.test(u || "")), tag, "URL game sai portal: " + JSON.stringify(r.urls));
    note(r.docs.every(Boolean), tag, "có khung thiếu np-multi"); note(r.snd.filter(x => !x).length === 1, tag, "phải đúng 1 khung có tiếng " + JSON.stringify(r.snd));
    note(r.tiles >= 4 && r.tags.includes("Pop") && r.tags.includes("Night"), tag, "bảng chọn thiếu game của một portal: " + JSON.stringify(r.tags.slice(0, 3)));
    note(r.sh <= r.ih + 1, tag, "host bị cuộn");
    r.items.filter(i => i.where === "slot").forEach(i => { const g = M.get(i.id), land = i.rect[2] > i.rect[3] && g.landH; note(i.rect[2] >= (land ? g.landW || g.minW : g.minW) && i.rect[3] >= (land ? g.landH : g.minH), tag + " " + i.id, "khung " + i.rect[2] + "x" + i.rect[3] + " nhỏ hơn minW/minH"); });
    if (shotDir) await pg.screenshot({ path: path.join(shotDir, "multi-all-" + W + ".png") });
    if (pg._errs.length) note(false, tag, "lỗi JS: " + pg._errs[0]);
    console.log("  " + tag + ": " + r.items.map(i => i.id + ":" + i.where).join(" ")); await pg.close();
  }
  await br.close(); srv.kill();
  if (fails.length) { console.log("\n✗ " + fails.length + " lỗi chơi cùng lúc"); process.exit(1); }
  console.log("✓ chơi cùng lúc đạt"); process.exit(0);
})().catch(e => { console.log("check-multi lỗi:", e && e.stack || e); process.exit(1); });
