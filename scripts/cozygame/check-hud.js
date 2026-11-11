/* HUD GỌN của cổng ở cỡ KHÔNG có cột bên lề (shared/hud.js, GAME_RULES 0a-16):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-hud.js [--quick] [--shots=<thư mục>] [id,id,...]   (tự chạy http.server cổng NP_PORT hoặc 8888)
   Mọi game (Cozy + Pop) mở QUA TRANG CỔNG, màn chọn + màn chơi, ở các cỡ ngang không có cột bên (568x320, 667x375, 844x390, 932x430, 724x700, 800x700, 1000x560, 1024x768)
   + cỡ dọc để chắc chắn KHÔNG đổi (390x844, 484x694, 768x1024: không có #npHudc). Đo:
   - HUD bật => #npHudc hiện; nút ←(cổng hoặc game) ở (38,38)±2.5; mọi nút HUD (và ⋯) 44x44±1, CÙNG trục X với ←, nằm trong khung nhìn, KHÔNG chồng nhau, elementFromPoint = chính nút, nằm ngoài khung game (không che vùng chơi);
   - cỡ thấp (<480px): chỉ ⋯ nhìn thấy trong cột; bấm ⋯ mở thẻ: thẻ trong khung nhìn (cao <=60% màn), lưới Ô ICON TO >=56px không chữ nhãn (trừ VI/EN + huy hiệu), aria-label + title, đóng được; cỡ cao: tất cả nút hiện trực tiếp;
   - nút gốc ? 🔊 VI trong game đã ẩn khi HUD bật; tên game ≤2 dòng và không bị cắt; thẻ nhắc việc (.ask): ≤3 dòng, rộng >=140px hoặc dạng gọn xếp dọc, loa <=44px, chữ không bị cắt;
   - một màn hình: không cuộn dọc/ngang ở cổng và trong game. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.NP_PORT || 8888, B = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), quick = args.includes("--quick"), shots = (args.find(a => a.startsWith("--shots=")) || "").slice(8), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [], note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")).filter(d => fs.existsSync(path.join(root, "cozyplay/games", d, "index.html"))), POP = fs.readdirSync(path.join(root, "popplay/games"));
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "bao-nhieu-giay"], ["cozyplay", "dap-deadline"], ["cozyplay", "cozy-wings"], ["cozyplay", "xe-ca-phe"], ["popplay", "lang-cua-be"], ["popplay", "pop-fly"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
const LAND = [[568, 320, 1], [667, 375, 1], [844, 390, 1], [932, 430, 1], [724, 700, 0], [800, 700, 0], [1000, 560, 0], [1024, 768, 1]], PORT_ = [[390, 844, 1], [484, 694, 0], [768, 1024, 1]];
const SIZES = quick ? [LAND[0], LAND[1], LAND[4], LAND[7], PORT_[0], PORT_[2]] : [...LAND, ...PORT_];
const GIDS = ["bHelp", "phBtn", "bSnd", "soundBtn", "bLang", "langBtn"];
/* chạy trong trang cổng */
const MEASURE = (gid) => {
  const st = document.getElementById("stage"), W = innerWidth, H = innerHeight, out = { land: W > H, hud: st.classList.contains("np-hudc"), sm: st.classList.contains("np-hudc-sm"), rails: st.classList.contains("np-rails-l"), docked: st.classList.contains("docked"), errs: [] };
  const vis = e => { if (!e) return false; const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && +s.opacity > .05 && r.width > 3 && r.height > 3 && !e.closest("[hidden]"); };
  out.scroll = { pw: document.documentElement.scrollWidth - W, ph: document.documentElement.scrollHeight - H };
  const f = st.querySelector("iframe"), fr = f.getBoundingClientRect(); let d = null; try { d = f.contentDocument; } catch (e) {}
  if (d) {
    out.scroll.gw = d.documentElement.scrollWidth - f.clientWidth; out.scroll.gh = d.documentElement.scrollHeight - f.clientHeight;
    out.native = gid.filter(id => vis(d.getElementById(id)));
    const h1 = [...d.querySelectorAll(".top h1,#title,#ttl")].find(e => vis(e) && e.textContent.trim());
    if (h1) { const cs = d.defaultView.getComputedStyle(h1), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2, r = h1.getBoundingClientRect(); out.title = { lines: Math.round(r.height / lh), w: r.width, cut: h1.scrollWidth > h1.clientWidth + 1 && cs.overflowX !== "visible", txt: h1.textContent.trim().slice(0, 20) }; }
    const a = d.querySelector(".ask"), t = d.getElementById("askTxt");
    if (a && t && vis(a)) { const r = a.getBoundingClientRect(), tr = t.getBoundingClientRect(), b = a.querySelector("button"), br = b ? b.getBoundingClientRect() : { width: 0, height: 0 }, cs = d.defaultView.getComputedStyle(t), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2, col = d.defaultView.getComputedStyle(a).flexDirection === "column"; out.ask = { w: r.width, lines: Math.round(tr.height / lh), bw: br.width, bh: br.height, cut: tr.right > r.right + 1.5 || tr.bottom > r.bottom + 1.5 || tr.left < r.left - 1.5 || tr.top < r.top - 1.5, col, fs: parseFloat(cs.fontSize) }; }
    out.play = [...d.querySelectorAll("#play,.play,#cvw,.ask,.hud,#game>.stats,#game>.tgt,#game>#tbBar,#game>#ssBar,#game>#tb")].filter(vis).map(e => { const r = e.getBoundingClientRect(); return { n: e.id || e.className, l: r.left + fr.left, t: r.top + fr.top, r: r.right + fr.left, b: r.bottom + fr.top }; });
  }
  const hb = document.getElementById("npHudc"), btn = [];
  if (hb && out.hud) {
    out.openOk = null;
    [...hb.querySelectorAll(".np-hb")].filter(vis).forEach(e => { const r = e.getBoundingClientRect(), t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); btn.push({ k: e.dataset.k || "more", x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, l: r.left, t: r.top, r: r.right, b: r.bottom, hit: !!t && (t === e || e.contains(t)), by: t ? t.tagName + "#" + t.id + "." + t.className : "" }); });
  }
  out.btn = btn;
  const hm = document.getElementById("home"), r0 = hm && vis(hm) ? hm.getBoundingClientRect() : null; out.home = r0 ? { x: r0.left + r0.width / 2, y: r0.top + r0.height / 2 } : null;
  let bk = null; if (d) for (const id of ["bBk", "bBack", "homeBtn", "npPmBk"]) { const e = d.getElementById(id); if (vis(e)) { const r = e.getBoundingClientRect(); bk = { x: r.left + r.width / 2 + fr.left, y: r.top + r.height / 2 + fr.top }; break; } }
  out.bk = bk; out.fl = fr.left;
  return out;
};
const POPOVER = () => {
  const hb = document.getElementById("npHudc"), pn = hb && hb.querySelector(".np-hpn"); if (!pn) return null;
  const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return s.display !== "none" && r.width > 3; };
  const items = [...pn.querySelectorAll(".np-hb")].filter(vis).map(e => {
    const r = e.getBoundingClientRect(), tw = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let txt = "", tn; while ((tn = tw.nextNode())) { if (tn.parentElement.closest("b,svg,[hidden]")) continue; txt += tn.nodeValue; } txt = txt.replace(/\s+/g, "");
    const sv = e.querySelector("svg"), b = e.querySelector("b"), br = b && b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, t = document.elementFromPoint(cx, cy), cs = getComputedStyle(e);
    return { k: e.dataset.k, w: r.width, h: r.height, l: r.left, t: r.top, r: r.right, b: r.bottom, txt, aria: (e.getAttribute("aria-label") || "").trim(), title: (e.title || "").trim(), svg: sv ? sv.getBoundingClientRect().width : 0, fs: parseFloat(cs.fontSize), fw: +cs.fontWeight,
      aft: getComputedStyle(e, "::after").content, bef: getComputedStyle(e, "::before").content, hit: t === e || e.contains(t), bw: br ? br.width : 0, bh: br ? br.height : 0, bcut: br ? (br.left < r.left - .5 || br.right > r.right + .5 || br.top < r.top - .5 || br.bottom > r.bottom + .5) : false }; });
  const pr = pn.getBoundingClientRect(); return { open: hb.classList.contains("open") && vis(pn), items, l: pr.left, t: pr.top, r: pr.right, b: pr.bottom, W: innerWidth, H: innerHeight };
};
const inter = (a, b) => a.l < b.r - 1 && a.r > b.l + 1 && a.t < b.b - 1 && a.b > b.t + 1;
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let nHud = 0, nAll = 0;
  for (const [portal, id] of list) {
    console.log("== " + portal + "/" + id);
    for (const [W, H, t] of SIZES) {
      let pg; try {
        pg = await br.newPage(); pg.setDefaultNavigationTimeout(90000); await pg.setViewport({ width: W, height: H, isMobile: !!t, hasTouch: !!t });
        await pg.evaluateOnNewDocument(() => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "dark"); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("np-rails", "1"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); });
        await pg.goto(B + portal + "/index.html?lang=vi#" + id); await wait(2300);
        const stages = [["chọn", null]];
        if (portal === "cozyplay") stages.push(["chơi", () => { const e = document.getElementById("bPlay") || document.getElementById("bDaily") || document.getElementById("startBtn") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn"); e && e.click(); }]);
        else stages.push(["chơi", "try{begin(0,{})}catch(e){try{startSession(0,null,{})}catch(e2){try{startRound(Object.keys(PF.types||{})[0]||0)}catch(e3){}}}"]);
        for (const [name, act] of stages) {
          if (act) { const fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (!fr) break; await fr.evaluate(act).catch(() => {}); await wait(900); }
          const r = await pg.evaluate(MEASURE, GIDS), tag = id + " " + W + "x" + H + " " + name; nAll++;
          if (shots) await pg.screenshot({ path: path.join(shots, id + "-" + W + "x" + H + "-" + (name === "chọn" ? "choose" : "play") + ".png") });
          note(r.scroll.pw <= 1 && r.scroll.ph <= 1, tag + ": cổng cuộn/tràn (" + r.scroll.pw + "," + r.scroll.ph + ")");
          if (r.scroll.gw != null) note(r.scroll.gw <= 2 && r.scroll.gh <= 2, tag + ": trong game cuộn/tràn (" + r.scroll.gw + "," + r.scroll.gh + ")");
          if (!r.land) { note(!r.hud, tag + ": màn DỌC không được bật HUD gọn"); continue; }
          if (r.title) { note(r.title.lines <= 2, tag + ": tên game " + r.title.lines + " dòng (>2): " + r.title.txt); note(!r.title.cut, tag + ": tên game bị cắt: " + r.title.txt); }
          if (r.ask) { const a = r.ask; note(a.lines <= 3, tag + ": thẻ nhắc việc " + a.lines + " dòng"); note(a.w >= 140 || a.col || W >= 900, tag + ": thẻ nhắc việc rộng " + Math.round(a.w) + "px (<140) mà không ở dạng gọn"); note(a.bw <= 44.5 && a.bh <= 44.5, tag + ": nút loa " + Math.round(a.bw) + "x" + Math.round(a.bh) + " (>44)"); note(!a.cut, tag + ": chữ thẻ nhắc việc bị cắt"); note(a.fs >= 11, tag + ": chữ thẻ nhắc việc " + a.fs + "px (<11)"); }
          if (r.rails) continue;
          if (!r.hud) { if (!r.docked && r.native && r.native.length) note(false, tag + ": game có " + r.native.join(",") + " mà HUD không bật"); continue; }
          nHud++;
          note(!r.native.length, tag + ": nút gốc trong game còn hiện: " + r.native.join(","));
          const ref = r.home || r.bk; note(!!ref, tag + ": không thấy nút ←");
          if (ref) { note(Math.abs(ref.x - 38) <= 2.5 && Math.abs(ref.y - 38) <= 2.5, tag + ": ← tâm (" + Math.round(ref.x) + "," + Math.round(ref.y) + ") ≠ (38,38)"); }
          const bt = r.btn; note(bt.length >= 1, tag + ": HUD không có nút nào");
          if (r.sm) note(bt.length === 1 && bt[0].k === "more", tag + ": cỡ thấp phải chỉ có ⋯ (có " + bt.map(b => b.k).join(",") + ")");
          else note(bt.length >= 2, tag + ": cỡ cao phải hiện nút trực tiếp (có " + bt.length + ")");
          for (const b of bt) {
            note(Math.abs(b.w - 44) <= 1 && Math.abs(b.h - 44) <= 1, tag + ": nút " + b.k + " cỡ " + Math.round(b.w) + "x" + Math.round(b.h));
            if (ref) note(Math.abs(b.x - ref.x) <= 1.5, tag + ": nút " + b.k + " lệch trục X " + Math.round(b.x - ref.x) + "px so với ←");
            note(b.l >= 0 && b.t >= 0 && b.r <= W && b.b <= H, tag + ": nút " + b.k + " ngoài khung nhìn");
            note(b.hit, tag + ": nút " + b.k + " bị che bởi " + b.by);
            note(b.r <= r.fl + 1, tag + ": nút " + b.k + " nằm trong khung game (r=" + Math.round(b.r) + " > " + Math.round(r.fl) + ")");
            for (const p of r.play || []) note(!inter(b, p), tag + ": nút " + b.k + " chồng lên " + p.n);
          }
          for (let i = 0; i < bt.length; i++) for (let j = i + 1; j < bt.length; j++) note(!inter(bt[i], bt[j]), tag + ": nút " + bt[i].k + " chồng " + bt[j].k);
          if (r.sm && name === "chọn") {
            await pg.tap("#npHudc .np-hmore").catch(() => {}); await wait(200); const p = await pg.evaluate(POPOVER);
            if (p) { note(p.open, tag + ": bấm ⋯ không mở thẻ"); if (p.open) { note(p.items.length >= 2, tag + ": thẻ ⋯ chỉ có " + p.items.length + " nút"); note(p.l >= 0 && p.t >= 0 && p.r <= p.W && p.b <= p.H, tag + ": thẻ ⋯ ngoài khung nhìn"); note(p.b - p.t <= H * 0.6 + 0.5, tag + ": thẻ ⋯ cao " + Math.round(p.b - p.t) + "px > 60% màn");
              for (const it of p.items) {   /* Ô ICON TO: >=56px, không chữ hiển thị (trừ VI/EN + huy hiệu số), aria-label + title, icon >=30px, bấm trúng chính ô */
                note(it.w >= 55.5 && it.h >= 55.5, tag + ": ô " + it.k + " trong thẻ ⋯ nhỏ " + Math.round(it.w) + "x" + Math.round(it.h) + " (<56)");
                note(it.k === "lang" ? /^[A-Za-z]{2,3}$/.test(it.txt) : !/\p{L}/u.test(it.txt), tag + ": ô " + it.k + " còn chữ hiển thị “" + it.txt + "”");
                note((!it.aft || /^(none|normal)$/.test(it.aft)) && (!it.bef || /^(none|normal)$/.test(it.bef)), tag + ": ô " + it.k + " còn nhãn chữ giả " + it.aft + it.bef);
                note(!!it.aria, tag + ": ô " + it.k + " thiếu aria-label"); note(!!it.title, tag + ": ô " + it.k + " thiếu title");
                if (it.k === "lang") note(it.fs >= 19.5 && it.fw >= 700, tag + ": chữ VI/EN nhỏ/mảnh " + it.fs); else if (it.svg) note(it.svg >= 29.5, tag + ": icon ô " + it.k + " nhỏ " + Math.round(it.svg) + "px"); else note(it.fs >= 27.5, tag + ": emoji ô " + it.k + " nhỏ " + it.fs);
                note(it.hit, tag + ": tâm ô " + it.k + " bị che"); if (it.bw) { note(it.bw >= 17.5 && it.bh >= 17.5, tag + ": huy hiệu nhỏ " + Math.round(it.bw)); note(!it.bcut, tag + ": huy hiệu bị cắt"); }
              } if (shots) await pg.screenshot({ path: path.join(shots, id + "-" + W + "x" + H + "-menu.png") }); }
              await pg.tap("#npHudc .np-hmore").catch(() => {}); await wait(150); const q = await pg.evaluate(POPOVER); note(!q.open, tag + ": bấm ⋯ lần nữa không đóng thẻ"); }
          }
        }
      } catch (e) { note(false, id + " " + W + "x" + H + ": không đo được " + String(e).slice(0, 80)); }
      try { await pg.close(); } catch (e) {}
    }
  }
  await br.close(); srv.kill();
  console.log("\nđã đo " + nAll + " lượt, HUD bật ở " + nHud); console.log(fails.length ? "✗ " + fails.length + " lỗi HUD" : "✓ HUD gọn đạt"); process.exit(fails.length ? 1 : 0);
})();
