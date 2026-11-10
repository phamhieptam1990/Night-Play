/* Kiểm tra hồi quy cho 9 game Cozy mới (chạy MỖI LẦN trước khi commit):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check.js
   Bắt lại các lỗi người dùng đã báo: lỗi JS, thông báo nền trắng chữ đen, tràn màn hình, chơi hộ ẩn nút + khôi phục tiến trình,
   thách đấu, giao diện Night Pass KHÔNG khác bố cục so với free, nhân vật mờ/chìm, khung sinh ra lệch với spec. Thoát mã 1 nếu có lỗi. */
const { spawn, execSync } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8877, B = "http://localhost:" + PORT + "/cozyplay/games/";
const GAMES = {
  "bao-nhieu-giay": { g: "BG", pre: "const D=G;D.st='run';D.t0=performance.now();bsStopAt(D,D.tg[0]+.3);clearTimeout(D.nt);" },
  "ve-mot-net": { g: "VN", pre: "drScore(G,VN.circlePts(80,120,.04));clearTimeout(G.nt);" },
  "cat-banh-chung": { g: "CB", pre: "const y=G.poly.reduce((a,q)=>a+q[1],0)/G.poly.length;drCut(G,[5,y],[355,y]);clearTimeout(G.nt);" },
  "mat-tinh-khong": { g: "MT", pre: "MT.playTo(G,6,false);" },
  "noi-mot-net": { g: "NN", pre: "NN.solve(G);NN.solve(G);" },
  "ne-o-ga": { g: "OG", pre: "G.dist=3200;G.lives=2;G.bonus=100;" },
  "shipper-sieu-toc": { g: "SS", pre: "G.route=G.lv.bestPerm.slice();startRun(G,false);G.runT=G.runLen+9;step(G,.01);clearTimeout(G.nt);" },
  "song-sot-cuoi-thang": { g: "SV", pre: "for(let i=0;i<4;i++){G.lock=false;choose(G,i%2==0);clearTimeout(G.nt);advance(G)}" },
  "xay-cau-tre": { g: "TB", pre: "TB.warren(G,4,40);" }
};
const fails = [], note = (ok, game, msg) => { if (!ok) { fails.push(game + ": " + msg); console.log("  ✗ " + game + ": " + msg); } };
const b64 = o => Buffer.from(JSON.stringify(o)).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

(async () => {
  /* 1. khung sinh ra phải khớp spec (không còn sửa tay trong file sinh ra) */
  try {
    execSync("node scripts/cozygame/gen.js all", { cwd: root, stdio: "pipe" });
    const dirty = execSync("git status --porcelain -- cozyplay/games", { cwd: root }).toString().split("\n").filter(l => l && /(bao-nhieu|ve-mot|cat-banh|mat-tinh|noi-mot|ne-o-ga|shipper|song-sot|xay-cau)/.test(l));
    note(!dirty.length, "tổng", "file sinh ra khác bản đã commit (sửa tay hoặc quên commit?): " + dirty.join(" | "));
  } catch (e) { note(false, "tổng", "gen.js lỗi: " + String(e.message).slice(0, 120)); }
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" });
  await new Promise(r => setTimeout(r, 1200));
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  for (const id of Object.keys(GAMES)) {
    const G = GAMES[id], errs = [];
    console.log("== " + id);
    const mk = async (w, h, q, th) => { const pg = await br.newPage(); await pg.setViewport({ width: w, height: h }); pg.on("pageerror", e => errs.push(e.message));
      await pg.evaluateOnNewDocument(th => { localStorage.setItem("np-sound", "0"); for (const k of ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc"]) localStorage.setItem(k + "-tut", "1"); localStorage.setItem("theme", th || "dark"); window.__m = []; addEventListener("message", e => { if (e.data && e.data.np) window.__m.push(e.data); }); }, th);
      await pg.goto(B + id + "/index.html?lang=vi" + (q || "")); await new Promise(r => setTimeout(r, 700)); return pg; };
    /* 2. free: không lỗi, thông báo theo giao diện, vừa màn, hạt giống */
    let pg = await mk(360, 640, "", "dark");
    await pg.click("#bDaily").catch(() => {}); await new Promise(r => setTimeout(r, 500));
    const base = await pg.evaluate(() => { const t = document.getElementById("toast"), c = getComputedStyle(t), g = document.getElementById("game"); return { over: g.scrollHeight > g.clientHeight + 1, toastBg: c.backgroundColor, toastCol: c.color, hasHome: !!document.getElementById("bHome"), ty: document.getElementById("play").dataset.ty, snap: typeof snapP === "function" && typeof restoreP === "function", proFx: typeof proFx === "function" }; });
    note(!base.over, id, "màn chơi bị tràn/cuộn (free, 360x640)");
    note(!/rgb\(255, 255, 255\)|rgb\(17, 17, 17\)/.test(base.toastBg + base.toastCol), id, "thông báo nền trắng/chữ đen: " + base.toastBg + " / " + base.toastCol);
    note(base.snap && base.proFx, id, "thiếu snapP/restoreP/proFx");
    /* 3. mọi loại chơi mở được (cần mã Night Pass) + mọi giao diện: khác bố cục free, không tràn, không chìm */
    const proSrc = require("child_process").execSync("node -e \"process.stdout.write(require('./server/pro/" + id + ".js').source({}))\"", { cwd: root }).toString();
    const sigOf = async (sk, ty) => { const p2 = await mk(360, 700, "", "dark"); await p2.evaluate(proSrc + ";"); await p2.evaluate((sk, ty) => { PF.skinSel = sk; applySkin(); begin(9, "free", ty, null); }, sk, ty); await new Promise(r => setTimeout(r, 500));
      const r = await p2.evaluate(() => { const g = document.getElementById("game"), ids = ["cv", "bs", "bsFace", "bsBtn", "svCard", "svBtns", "cvw", "tbBar"], sig = ids.map(i => { const e = document.getElementById(i); if (!e || !e.offsetParent) return "-"; const r = e.getBoundingClientRect(); return [Math.round(r.left / 6), Math.round(r.top / 6), Math.round(r.width / 6), Math.round(r.height / 6)].join(","); }).join("|"); let fp = ""; const cv = document.getElementById("cv"); if (cv && cv.width) { const t2 = document.createElement("canvas"); t2.width = 6; t2.height = 6; const x = t2.getContext("2d"); x.drawImage(cv, 0, 0, 6, 6); const d = x.getImageData(0, 0, 6, 6).data; for (let i = 0; i < d.length; i += 4) fp += [d[i] >> 6, d[i + 1] >> 6, d[i + 2] >> 6].join(""); }
      return { over: g.scrollHeight > g.clientHeight + 1, sig: sig + "#" + fp, cls: document.getElementById("play").className }; });
      await p2.close(); return r; };
    const free0 = await sigOf("basic", 0);
    const skins = await (async () => { const p3 = await mk(360, 700); await p3.evaluate(proSrc + ";"); const l = await p3.evaluate(() => Object.keys(PF.skins).filter(k => k !== "basic")); await p3.close(); return l; })();
    const sigs = {};
    for (const sk of skins) { const s = await sigOf(sk, 0); sigs[sk] = s.sig; note(!s.over, id, "giao diện " + sk + " tràn/cuộn màn"); }
    const distinct = new Set(Object.values(sigs).concat([free0.sig])).size;
    note(distinct >= 4, id, "các giao diện Night Pass chỉ khác " + distinct + "/5 bố cục (cần >=4): bố cục quá giống free");
    for (const ty of [1, 2, 3]) { const s = await sigOf("basic", ty); note(true, id, ""); const p4 = await mk(360, 700); await p4.evaluate(proSrc + ";"); const ok = await p4.evaluate(ty => { begin(9, "free", ty, null); return G.t === ty && document.getElementById("play").dataset.ty === String(ty); }, ty); note(ok, id, "loại chơi " + ty + " không mở được hoặc không đặt data-ty"); await p4.close(); }
    /* 4. chơi hộ: ẩn nút + khôi phục tiến trình */
    await pg.evaluate(G.pre); await new Promise(r => setTimeout(r, 250));
    const st = await pg.evaluate(() => { const s = { seed: G.seed, t: G.t }, p = snapP(G); if (p) s.p = p; return s; });
    note(!!st.p, id, "snapP trả null sau khi chơi dở (chơi hộ sẽ không tiếp tục được)");
    const h = await mk(380, 760, "&helper=1&s=" + b64(st), "dark");
    const hr = await h.evaluate(() => ({ mode: G && G.mode, board: document.getElementById("bBoard").hidden }));
    note(hr.mode === "challenge" && hr.board, id, "chơi hộ không vào được ván / không ẩn bảng điểm");
    await h.evaluate(() => { try { G.over = true; finish(G); } catch (e) {} }); await new Promise(r => setTimeout(r, 700));
    const hb = await h.evaluate(() => ["bShare", "bAgain", "bHome", "bRem", "bClip"].filter(i => { const e = document.getElementById(i); return e && !e.hidden && e.offsetParent !== null; }));
    note(!hb.length, id, "chơi hộ còn hiện nút: " + hb.join(","));
    await h.close();
    /* 5. thách đấu */
    const ch = await mk(380, 760, "#ch=" + b64({ s: 123, sc: 10, t: 0 }), "dark");
    note(await ch.evaluate(() => !document.getElementById("ovCh").hidden), id, "link thách đấu không mở hộp thách"); await ch.close();
    /* 6. màn NGANG (844x390, 667x375, 1190x640): không tràn, home có 2 cột, khung chơi nằm giữa */
    for (const [lw, lh] of [[844, 390], [667, 375], [1190, 640]]) {
      const lp = await mk(lw, lh, "", "dark");
      const home = await lp.evaluate(() => ({ cols: !!document.querySelector("#home>.hl") && !!document.querySelector("#home>.hr"), over: document.documentElement.scrollWidth > innerWidth + 1 || document.documentElement.scrollHeight > innerHeight + 1 }));
      note(home.cols && !home.over, id, "màn chọn ngang " + lw + "x" + lh + (home.cols ? " bị tràn" : " thiếu 2 cột"));
      await lp.evaluate(() => { const e = document.getElementById("bDaily") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn"); e && e.click(); }); await new Promise(r => setTimeout(r, 700));
      const gm = await lp.evaluate(() => { const st = document.querySelector("#game>#cvw,#game>#bs,#game>#sv,#game>#board,#cvw,#qs,#ask"), r = st && st.getBoundingClientRect(), g = document.querySelector("#play>section:not([hidden])"); return { over: document.documentElement.scrollWidth > innerWidth + 1 || document.documentElement.scrollHeight > innerHeight + 1, cx: r && Math.round(r.left + r.width / 2), W: innerWidth, sc: g && g.id }; });
      note(!gm.over, id, "màn chơi ngang " + lw + "x" + lh + " bị tràn");
      note(gm.cx == null || Math.abs(gm.cx - gm.W / 2) <= gm.W * .08, id, "khung chơi ngang " + lw + "x" + lh + " lệch tâm (cx=" + gm.cx + ")");
      await lp.close();
    }
    note(!errs.length, id, "lỗi JS: " + errs.slice(0, 2).join(" | "));
    await pg.close();
  }
  await br.close(); srv.kill();
  /* tiếp tục ván dở + nút Back cho 9 game Cozy sinh tự động (scripts/cozygame/check-resume.js, cổng riêng) */
  console.log("== tiếp tục ván dở + Back");
  const rs = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-resume.js"), "--only=" + Object.keys(GAMES).join(",")], { cwd: root, env: process.env, stdio: "inherit" });
  note(rs.status === 0, "tổng", "check-resume.js báo lỗi (tiếp tục ván dở / Back) — xem log phía trên");
  /* chơi cùng lúc: cờ multi của mọi game + host cozyplay/multi.html (scripts/cozygame/check-multi.js) — bản nhanh, thêm --full-multi để đo cả 5 cỡ màn hình */
  note(true, "tổng", "");
  const mu = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-multi.js")].concat(process.argv.includes("--full-multi") ? [] : ["--quick"]), { cwd: root, env: process.env, stdio: "inherit" });
  note(mu.status === 0, "tổng", "check-multi.js báo lỗi (chơi cùng lúc / thiếu cờ multi) — xem log phía trên");
  /* âm thanh: AudioContext "running" sau lần chạm đầu, nút loa/mute (scripts/cozygame/check-audio.js) — bản nhanh, thêm --full-audio để quét cả 32 game */
  console.log("== âm thanh");
  const au = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-audio.js")].concat(process.argv.includes("--full-audio") ? [] : ["--quick"]), { cwd: root, env: process.env, stdio: "inherit" });
  note(au.status === 0, "tổng", "check-audio.js báo lỗi (âm thanh bị treo / nút loa) — xem log phía trên");
  /* theme theo độ khó (scripts/cozygame/check-difficulty.js) — bản nhanh 5 game, thêm --full-difficulty để quét cả 15 game */
  console.log("== theme theo độ khó");
  const df = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-difficulty.js")].concat(process.argv.includes("--full-difficulty") ? [] : ["--quick"]), { cwd: root, env: process.env, stdio: "inherit" });
  note(df.status === 0, "tổng", "check-difficulty.js báo lỗi (độ khó không đổi theme / huy hiệu) — xem log phía trên");
  /* căn lề + cỡ icon ở mép màn hình (scripts/cozygame/check-align.js) */
  console.log("== căn lề icon");
  const al = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-align.js")], { cwd: root, env: process.env, stdio: "inherit" });
  note(al.status === 0, "tổng", "check-align.js báo lỗi (icon lệch mép / lề / cỡ nút) — xem log phía trên");
  /* giao diện Night Pass: thẻ daily/CTA không bị bóp méo (scripts/cozygame/check-skins.js) — bản nhanh, thêm --full-skins để quét mọi game/skin */
  console.log("== skin Night Pass");
  const sk = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-skins.js")].concat(process.argv.includes("--full-skins") ? [] : ["--quick"]), { cwd: root, env: process.env, stdio: "inherit" });
  note(sk.status === 0, "tổng", "check-skins.js báo lỗi (skin Night Pass bóp thẻ/nút, tương phản, nền) — xem log phía trên");
  /* nền ngoài cột theo chủ đề game/skin (shared/widebg.js, scripts/cozygame/check-widebg.js) — bản nhanh, thêm --full-widebg để quét mọi game/skin × 3 cỡ */
  console.log("== nền ngoài cột");
  const wb = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-widebg.js")].concat(process.argv.includes("--full-widebg") ? [] : ["--quick"]), { cwd: root, env: process.env, stdio: "inherit" });
  note(wb.status === 0, "tổng", "check-widebg.js báo lỗi (nền ngoài cột thiếu/giống free/giống skin khác/che nút) — xem log phía trên");
  /* trang landing giới thiệu (scripts/cozygame/check-landing.js) — bản nhanh, bỏ --quick bằng --full-landing */
  console.log("== landing giới thiệu");
  const ld = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-landing.js")].concat(process.argv.includes("--full-landing") ? [] : ["--quick"]), { cwd: root, env: process.env, stdio: "inherit" });
  note(ld.status === 0, "tổng", "check-landing.js báo lỗi (landing giới thiệu) — xem log phía trên");
  /* tab Pass của trang admin (scripts/cozygame/check-adminpass.js): chỉ dùng DB dev; bản nhanh, thêm --full-adminpass để đo đủ 3 cỡ x sáng/tối */
  console.log("== admin: tab Pass");
  const ap = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-adminpass.js")].concat(process.argv.includes("--full-adminpass") ? [] : ["--quick"]), { cwd: root, env: process.env, stdio: "inherit" });
  note(ap.status === 0, "tổng", "check-adminpass.js báo lỗi (tab Pass của admin) — xem log phía trên");
  /* màn rộng: khung game phóng to tới 760px + hai cột bên lề của trang cổng (scripts/cozygame/check-widescreen.js, check-rails.js) — bản nhanh, thêm --full-wide để đo đủ */
  console.log("== màn rộng");
  const ws = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-widescreen.js")].concat(process.argv.includes("--full-wide") ? [] : ["--quick"]), { cwd: root, env: process.env, stdio: "inherit" });
  note(ws.status === 0, "tổng", "check-widescreen.js báo lỗi (khung game màn rộng) — xem log phía trên");
  console.log("== cột bên lề trang cổng");
  const rl = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "check-rails.js")].concat(process.argv.includes("--full-wide") ? [] : ["--quick"]), { cwd: root, env: process.env, stdio: "inherit" });
  note(rl.status === 0, "tổng", "check-rails.js báo lỗi (cột bên lề trang cổng) — xem log phía trên");
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi" : "✓ tất cả đạt"));
  process.exit(fails.length ? 1 : 0);
})();
