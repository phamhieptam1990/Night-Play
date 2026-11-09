/* Kiểm tra GAME MỞ QUA TRANG CỔNG (iframe trong #stage): nút chung của cổng (quay lại, chụp ảnh, chia sẻ, đồng hồ) KHÔNG được đè nút của game,
   nút trong game không bị nút/khối khác đè (elementFromPoint ở cả cổng lẫn trong game), ← ở màn chọn thoát về cổng, 📷/📤 bấm được,
   lưới trang cổng không lệch sau khi thoát game (Vẽ Một Nét), màn kết thúc (Pop Play) không bị cắt.
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-portal.js [id,id,...]   (script tự chạy http.server cổng 8879) */
const { spawn } = require("child_process"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8879, B = "http://localhost:" + PORT + "/";
const COZY = ["song-sot-cuoi-thang", "xay-cau-tre", "ne-o-ga", "shipper-sieu-toc", "mat-tinh-khong", "ve-mot-net", "xin-nghi", "duong-ray", "cozy-wings", "dap-deadline", "doi-doi-2048", "xe-ca-phe"];
const POP = { "bo-me-5-giay": "begin(0,{});setTimeout(()=>{G.p=3;G.j=2;G.bonus=20;G.mcp=3;G.mcj=2;finish()},300)", "con-vat-an-so": "begin(0,{});setTimeout(()=>{G.sc=180;G.ok=6;finish()},300)",
  "nhay-theo-so": "begin(0,{});setTimeout(()=>{G.rn=6;G.rs=4;finish()},300)", "doan-tuoi-nao": "begin(0,{});setTimeout(()=>{G.m=5;G.cor=3;G.dsum=10;G.sumT=20;finish()},300)",
  "lang-cua-be": "startSession(0,null,{});setTimeout(()=>{S.good=4;S.score=40;finishSession()},400)", "pop-fly": "startRound(Object.keys(PF.types||{})[0]||0);setTimeout(()=>{const S=PF.S;if(S){S.score=120;S.correct=5}finishRound()},500)",
  "be-dau-bo-me": "", "be-noi-dung-khong": "", "qua-song": "", "ten-lua-cua-be": "", "thap-vong-mau": "", "ve-chu-quai-vat": "" };
const VPS = [[380, 760], [844, 390], [1000, 536], [820, 600]];
/* ĐIỆN THOẠI DỌC qua trang cổng: đúng 1 nút ← + 1 nút menu ⋯ (≥44px), 📷/📤 nằm TRONG bảng menu #npFan, không còn nút nổi/← của cổng, tiêu đề không bị cắt, ← và ⋯ không bị đè. Chạy trong khung game. */
const MENU_MEASURE = mode => {   // mode: "phone" (mặc định) | "tab" (iPad dọc: ← + 🔊 ngoài menu) | "land" (iPad ngang: giữ cột nút, không gom)
  const vis = e => { if (!e) return false; const s = getComputedStyle(e), r = e.getBoundingClientRect(); return e.offsetParent !== null && s.visibility !== "hidden" && +s.opacity > .05 && r.width > 6 && r.height > 6 && !e.closest("[hidden]"); };
  const out = { errs: [] }, par = window.parent.document, fan = document.getElementById("npFan");
  const backs = ["bBk", "bBack", "homeBtn"].map(i => document.getElementById(i)).filter(e => vis(e) && !(fan && fan.contains(e)));
  const fabs = [...document.querySelectorAll("#npFab")].filter(vis);
  if (backs.length !== 1) out.errs.push("có " + backs.length + " nút ← (cần đúng 1)");
  if (mode === "land") { if (fabs.length) out.errs.push("iPad ngang không được gom menu ⋯"); } else if (fabs.length !== 1) out.errs.push("có " + fabs.length + " nút menu ⋯ (cần đúng 1)");
  for (const [n, e] of [["←", backs[0]], ["⋯", fabs[0]]]) if (e) { const r = e.getBoundingClientRect(); if (Math.min(r.width, r.height) < (mode === "land" ? 39.5 : 43.5)) out.errs.push("nút " + n + " nhỏ " + Math.round(r.width) + "x" + Math.round(r.height) + " (<44)"); const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (t && t !== e && !e.contains(t) && !t.contains(e)) out.errs.push("nút " + n + " bị " + (t.id || t.className || t.tagName) + " đè"); const p = par.elementFromPoint(r.left + r.width / 2 + (window.frameElement ? window.frameElement.getBoundingClientRect().left : 0), r.top + r.height / 2 + (window.frameElement ? window.frameElement.getBoundingClientRect().top : 0)); if (p && p !== window.frameElement) out.errs.push("nút " + n + " bị nút của cổng (" + (p.id || p.className) + ") đè"); }
  const floats = [...par.querySelectorAll(".nps-cam,.nps-fab")].filter(e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && r.width > 0; });
  if (floats.length) out.errs.push("còn " + floats.length + " nút nổi rời của cổng (.nps-cam/.nps-fab)");
  if (mode !== "land") for (const id of ["bCam", "bShr"]) if (!(fan && fan.querySelector("#" + id))) out.errs.push(id + " không nằm trong menu #npFan");
  if (mode === "tab") { const snd = document.getElementById("bSnd") || document.getElementById("soundBtn"); if (!snd || !vis(snd) || (fan && fan.contains(snd))) out.errs.push("iPad dọc: nút 🔊 phải ở NGOÀI menu"); else if (Math.min(snd.getBoundingClientRect().width, snd.getBoundingClientRect().height) < 43.5) out.errs.push("nút 🔊 nhỏ <44"); for (const id of ["bHelp", "askBtn", "bBoard", "bLang", "langBtn"]) { const e = document.getElementById(id); if (e && fan && !fan.contains(e) && vis(e) && !e.closest(".ask")) out.errs.push(id + " phải nằm trong menu (iPad dọc)"); } }
  const h = document.querySelector(".top h1,#ttl,#title,h1"); if (h && vis(h) && h.scrollWidth > h.clientWidth + 1) out.errs.push("tiêu đề bị cắt (" + h.scrollWidth + ">" + h.clientWidth + ")");
  return out;
};
/* TÊN GAME SÁT KHUNG THÔNG TIN (điện thoại dọc, màn chọn): khoảng cách từ tên game tới khối nội dung ngay dưới ≤ 20px, tối đa 2 dòng, không bị cắt "…". Chạy trong khung game. */
const TITLE_MEASURE = () => {
  const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return e.offsetParent !== null && s.visibility !== "hidden" && +s.opacity > .05 && r.width > 6 && r.height > 6 && !e.closest("[hidden]"); };
  const tv = [...document.querySelectorAll("#npTitle,.hometitle,.gametitle")].find(vis); if (!tv) return { errs: ["không thấy tên game sát khung (#npTitle/.hometitle)"] };
  const tr = tv.getBoundingClientRect(), errs = []; let best = 1e9;
  for (const e of document.querySelectorAll("button,canvas,p,h2,h3,img,.card,.cards,.ask,.hdaily,.stat,.stats,.cell,.ty,.hl > *")) { if (!vis(e) || e.closest(".top,#npFan,#npTitle,.hometitle,.gametitle")) continue; const r = e.getBoundingClientRect(); if (r.top >= tr.bottom - 1 && r.bottom > tr.bottom && r.width > 40) best = Math.min(best, r.top - tr.bottom); }
  const cs = getComputedStyle(tv), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.15, lines = Math.round(tr.height / lh);
  if (best > 20) errs.push("tên game cách khung thông tin " + Math.round(best) + "px (>20)");
  if (lines > 2) errs.push("tên game " + lines + " dòng (>2)");
  if (tv.scrollWidth > tv.clientWidth + 1) errs.push("tên game bị cắt");
  return { errs };
};
const only = (process.argv[2] || "").split(",").filter(Boolean), fails = [];
const note = (ok, msg) => { if (!ok) { fails.push(msg); console.log("  ✗ " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
/* chạy TRONG khung game: trả danh sách nút bị đè (bởi nút chung của cổng hoặc bởi khối khác trong game) */
const MEASURE = () => {
  const par = window.parent, ifr = [...par.document.querySelectorAll("#stage iframe")].find(f => f.contentWindow === window); if (!ifr) return { err: "không thấy iframe" };
  const fr = ifr.getBoundingClientRect(), bad = [];
  const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return e.offsetParent !== null && s.visibility !== "hidden" && +s.opacity > .05 && r.width > 6 && r.height > 6 && !e.closest("[hidden]") && !e.disabled && !(e.closest("#npFan") && !document.getElementById("npFan").classList.contains("open")); };   // nút nằm trong bảng menu ĐANG ĐÓNG (trong suốt, không nhận chạm) không tính; nút menu #npFab thì có tính
  const els = [...document.querySelectorAll("button,a[href],.ib,.btn,.ib2,.icon-btn,.opt,.cat,.ty,.tile")].filter(vis);
  const name = e => (e.id || (e.className + "").split(" ")[0] || e.tagName);
  for (const e of els) {
    const r = e.getBoundingClientRect(); if (r.right < 0 || r.left > innerWidth || r.bottom < 0 || r.top > innerHeight) continue;
    const cx = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 2), cy = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 2);
    const ph = par.document.elementFromPoint(cx + fr.left, cy + fr.top); if (ph && ph !== ifr) { bad.push("cổng:" + name(ph) + " đè " + name(e)); continue; }
    const ch = document.elementFromPoint(cx, cy); if (ch && ch !== e && !e.contains(ch) && !ch.contains(e) && !ch.closest(".ov,[id^=ov],#ovEnd,#hlpOv,#pay,#setup,#shareG,#statsP,#pauseOv,#overlay") && !e.closest(".ov,[id^=ov],#pay,#setup,#shareG,#statsP,#pauseOv,#overlay")) bad.push(name(ch) + " đè " + name(e));
  }
  /* nút thanh trên chung nhau */
  return { bad: bad.slice(0, 4), n: els.length, docked: !!window.__npDock, vw: innerWidth, vh: innerHeight };
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const open = async (portal, id, W, H) => {
    const pg = await br.newPage(); await pg.setViewport({ width: W, height: H, isMobile: true, hasTouch: true });
    await pg.evaluateOnNewDocument(() => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "light"); localStorage.setItem("np-season", JSON.stringify({ w: {}, seen: "x", tot: 0 })); for (const k of ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "xcp", "dr", "mz", "gc", "gm", "ch", "bh"]) localStorage.setItem(k + "-tut", "1"); });
    await pg.goto(B + portal + "/index.html?lang=vi#" + id); await wait(2600);
    const fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); return { pg, fr };
  };
  const ids = [...COZY.map(i => ["cozyplay", i]), ...Object.keys(POP).map(i => ["popplay", i])].filter(([, i]) => !only.length || only.includes(i));
  for (const [portal, id] of ids) {
    console.log("== " + portal + "/" + id);
    for (const [W, H] of VPS) {
      const tag = portal + "/" + id + " " + W + "x" + H, { pg, fr } = await open(portal, id, W, H), errs = []; pg.on("pageerror", e => errs.push(e.message));
      if (!fr) { note(false, tag + ": không mở được game trong cổng"); await pg.close(); continue; }
      const chk = async stage => { await wait(500); const m = await fr.evaluate(MEASURE).catch(e => ({ err: String(e).slice(0, 60) })); note(!m.err, tag + " " + stage + ": " + m.err); if (!m.err) note(!m.bad.length, tag + " " + stage + ": nút bị đè — " + m.bad.join(" ; ")); return m; };
      const m0 = await chk("chọn");
      /* ← ở màn chọn (chỉ khi game gắn nút vào thanh trên): thoát về cổng */
      if (m0 && m0.docked) {
        const bk = await fr.evaluate(() => { const b = document.getElementById("bBk"); return !!(b && b.offsetParent && !b.hidden); });
        note(bk, tag + " chọn: nút ← không hiện khi đã gắn vào thanh trên");
      }
      /* chơi + kết thúc */
      if (portal === "cozyplay") {
        await fr.evaluate(() => { const e = document.getElementById("bDaily") || document.getElementById("startBtn") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn"); e && e.click(); });
        if (id === "cozy-wings") { await fr.click("#cards .daily").catch(() => {}); await wait(700); await fr.evaluate(() => { const e = document.getElementById("hwGo"); e && e.offsetParent && e.click(); }); }
        await chk("chơi");
        if (!["cozy-wings", "dap-deadline"].includes(id)) { await fr.evaluate(() => { try { G.over = true; finish(G); } catch (e) {} }); await chk("kết thúc"); }
      } else if (POP[id]) {
        await fr.evaluate(POP[id]).catch(() => {}); await wait(1500); await chk("kết thúc");
        const cut = await fr.evaluate(() => { const o = document.getElementById("ovEnd"); if (!o || o.hidden) return -1; return [...o.querySelectorAll("button,.card,h2")].filter(e => e.offsetParent).filter(e => { const r = e.getBoundingClientRect(); return r.top < -2 || r.bottom > innerHeight + 2 || r.left < -2 || r.right > innerWidth + 2; }).length; });
        note(cut <= 0, tag + " kết thúc: " + cut + " khối bị cắt ra ngoài màn");
      }
      if (m0 && m0.docked) {
        for (const sel of ["#bCam", "#bShr"]) {
          const ok = await fr.evaluate(sel => { const b = document.querySelector(sel); if (!b || !b.offsetParent) return false; const t = window.parent.document.querySelector(sel === "#bCam" ? ".nps-cam" : ".nps-fab:not(.nps-cam)"); let hit = false; const f = () => { hit = true; }; t.addEventListener("click", f, { once: true }); b.click(); return hit; }, sel);
          note(ok, tag + " " + sel + ": bấm không kích hoạt nút chụp/chia sẻ của cổng");
        }
      }
      note(!errs.length, tag + ": lỗi JS " + errs.slice(0, 1)); await pg.close();
    }
  }
  /* menu ⋯ trên điện thoại dọc: MỌI game (Cozy sinh tự động + viết tay, Pop Play) mở qua trang cổng thật ở 390x844 và 360x640 */
  const fs = require("fs"), allIds = [...fs.readdirSync(path.join(root, "cozyplay", "games")).filter(d => fs.existsSync(path.join(root, "cozyplay", "games", d, "index.html"))).map(i => ["cozyplay", i]), ...fs.readdirSync(path.join(root, "popplay", "games")).filter(d => fs.existsSync(path.join(root, "popplay", "games", d, "index.html"))).map(i => ["popplay", i])].filter(([, i]) => !only.length || only.includes(i));
  for (const [portal, id] of allIds) for (const [W, H] of [[390, 844], [360, 640], [768, 1024], [834, 1194], [1024, 768], [1194, 834]]) {
    const mode = W <= 520 ? "phone" : H > W ? "tab" : "land", { pg, fr } = await open(portal, id, W, H), tag = "menu " + portal + "/" + id + " " + W + "x" + H;
    if (!fr) { note(false, tag + ": không mở được game trong cổng"); try { await pg.close(); } catch (e) {} continue; }
    await wait(900); const ev = async (f, what, arg) => { try { return await fr.evaluate(f, arg); } catch (e) { return { errs: ["không đo được " + what + ": " + String(e).slice(0, 60)] }; } }; const m = await ev(MENU_MEASURE, "menu", mode);
    note(!m.errs.length, tag + ": " + m.errs.join("; "));
    if (portal === "cozyplay" && mode !== "land") { const t = await ev(TITLE_MEASURE, "tên game"); note(!t.errs.length, tag.replace("menu ", "tên game ") + ": " + t.errs.join("; ")); }
    try { await pg.close(); } catch (e) {}
  }
  /* lưới trang cổng không lệch sau khi thoát game: Vẽ Một Nét (Cozy) / Qua Sông (Pop), ở khung nhỏ (lưới trượt) */
  if (!only.length) for (const [portal, id] of [["cozyplay", "ve-mot-net"], ["popplay", "qua-song"]]) for (const [W, H] of [[323, 603], [380, 760], [603, 323]]) {
    const pg = await br.newPage(); await pg.setViewport({ width: W, height: H, isMobile: true, hasTouch: true });
    await pg.evaluateOnNewDocument(() => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("np-season", JSON.stringify({ w: {}, seen: "x", tot: 0 })); });
    await pg.goto(B + portal + "/index.html?lang=vi"); await wait(1200);
    const g0 = () => pg.evaluate(() => { const g = document.getElementById("grid"), t = g.querySelector(".tile").getBoundingClientRect(), s = g.classList.contains("slide"); return { s, sl: Math.round(g.scrollLeft), step: (window.gPage && gPage.step) || 0, first: Math.round(t.left), cw: g.clientWidth, gl: Math.round(g.getBoundingClientRect().left) }; });
    const a = await g0();
    await pg.evaluate(id => { location.hash = id; }, id); await wait(2200);
    await pg.evaluate(() => { const h = document.getElementById("home"); h && h.click(); }); await wait(1200);
    const b = await g0(), tag = "lưới " + portal + " " + W + "x" + H + " sau khi thoát " + id;
    note(b.s === a.s, tag + ": chế độ trượt đổi (" + a.s + "→" + b.s + ")");
    note(Math.abs(b.sl - a.sl) <= 2 && Math.abs(b.first - a.first) <= 2, tag + ": lưới lệch (scrollLeft " + a.sl + "→" + b.sl + ", ô đầu " + a.first + "→" + b.first + ")");
    if (b.s && b.step) note(b.sl % b.step <= 2 || b.step - (b.sl % b.step) <= 2, tag + ": scrollLeft " + b.sl + " không khớp bội của bước trang " + b.step);
    await pg.close();
  }
  await br.close(); srv.kill(); console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi qua trang cổng" : "✓ qua trang cổng đạt")); process.exit(fails.length ? 1 : 0);
})();
