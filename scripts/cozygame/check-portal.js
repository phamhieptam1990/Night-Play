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
const only = (process.argv[2] || "").split(",").filter(Boolean), fails = [];
const note = (ok, msg) => { if (!ok) { fails.push(msg); console.log("  ✗ " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
/* chạy TRONG khung game: trả danh sách nút bị đè (bởi nút chung của cổng hoặc bởi khối khác trong game) */
const MEASURE = () => {
  const par = window.parent, ifr = [...par.document.querySelectorAll("#stage iframe")].find(f => f.contentWindow === window); if (!ifr) return { err: "không thấy iframe" };
  const fr = ifr.getBoundingClientRect(), bad = [];
  const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return e.offsetParent !== null && s.visibility !== "hidden" && +s.opacity > .05 && r.width > 6 && r.height > 6 && !e.closest("[hidden]") && !e.disabled; };
  const els = [...document.querySelectorAll("button,a[href],.ib,.btn,.ib2,.icon-btn,.opt,.cat,.ty,.tile")].filter(vis);
  const name = e => (e.id || (e.className + "").split(" ")[0] || e.tagName);
  for (const e of els) {
    const r = e.getBoundingClientRect(); if (r.right < 0 || r.left > innerWidth || r.bottom < 0 || r.top > innerHeight) continue;
    const cx = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 2), cy = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 2);
    const ph = par.document.elementFromPoint(cx + fr.left, cy + fr.top); if (ph && ph !== ifr) { bad.push("cổng:" + name(ph) + " đè " + name(e)); continue; }
    const ch = document.elementFromPoint(cx, cy); if (ch && ch !== e && !e.contains(ch) && !ch.contains(e) && !ch.closest(".ov,[id^=ov],#ovEnd,#hlpOv") && !e.closest(".ov,[id^=ov]")) bad.push(name(ch) + " đè " + name(e));
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
