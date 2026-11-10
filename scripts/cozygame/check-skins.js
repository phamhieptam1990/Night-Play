/* Kiểm tra GIAO DIỆN NIGHT PASS (skin) của MỌI game có skin (Cozy sinh tự động + viết tay + Pop Play):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-skins.js [id,id,...] [--quick] [--vp=390x844,...]
   Bắt lỗi "CSS skin dùng selector quá rộng (#play .btn{border-radius:50%;width:15cqw}) bóp thẻ daily thành vòng tròn nhỏ, chữ dọc, chữ trắng trên nền pastel" (Sếp Ơi Em Xin Nghỉ, skin zen).
   Mỗi game × MỖI skin Night Pass × {390x844, 844x390, 1271x684, 1440x900} × VI × {màn chọn, màn kết thúc}, mọi nút lớn (#bDaily #startBtn #bPlay #bPractice #bMake #bShare .btn .big .grow):
   - cao ≥44px, không bị co thành hình tròn (rộng/cao ≥1.5 nếu chữ >3 ký tự), chữ không bị bẻ thành cột dọc (rộng ≥ ~8 ký tự), không tràn ra ngoài khung #play
   - CTA chính (#bDaily #startBtn #bPlay) rộng ≥55% khung chơi; tương phản chữ/nền ≥4.5:1 (nền gradient: lấy màu đầu tiên). Thoát mã 1 nếu có lỗi.
   --quick: vài game/skin (nối vào check.js). Cần python3 -m http.server (script tự chạy ở cổng riêng). */
const { spawn, execSync } = require("child_process"), path = require("path"), fs = require("fs"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.SKIN_PORT || 8884, BASE = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), QUICK = args.includes("--quick"), SHOTS = (args.find(a => a.startsWith("--shots=")) || "").slice(8);
const only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const vpArg = (args.find(a => a.startsWith("--vp=")) || "").slice(5);
const VPS = vpArg ? vpArg.split(",").map(s => s.split("x").map(Number)) : QUICK ? [[390, 844], [1271, 684]] : [[390, 844], [844, 390], [1271, 684], [1440, 900]];
const cozy = fs.readdirSync(path.join(root, "cozyplay/games")), pop = fs.readdirSync(path.join(root, "popplay/games"));
const hasPro = id => fs.existsSync(path.join(root, "server/pro", id + ".js"));
let LIST = []; for (const id of cozy) if (hasPro(id) && id !== "dap-deadline") LIST.push(["cozyplay", id]); for (const id of pop) if (hasPro(id)) LIST.push(["popplay", id]);
if (only.length) LIST = LIST.filter(x => only.includes(x[1])); else if (QUICK) LIST = LIST.filter(x => ["xin-nghi", "gia-cho-viet", "xe-ca-phe", "qua-song"].includes(x[1]));
const fails = [], note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const DBG = process.env.DBG ? console.log : () => {};
const wait = ms => new Promise(r => setTimeout(r, ms));

/* chạy trong trang: đo mọi nút lớn đang hiện */
const MEASURE = () => {
  const pl = document.getElementById("play") || document.querySelector(".app") || document.body, pr = pl.getBoundingClientRect(), out = [];
  const parse = c => { const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return null; const p = m[1].split(",").map(s => parseFloat(s)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const bgOf = e => { let base = null; for (let n = e; n; n = n.parentElement) { const cs = getComputedStyle(n); let bc = parse(cs.backgroundColor); const bi = cs.backgroundImage; if (bi && bi !== "none") { const m = /rgba?\([^)]+\)/.exec(bi); if (m) bc = parse(m[0]); } if (bc && bc.a > 0.05) { if (bc.a >= .95) return base ? mix(base, bc) : bc; base = base ? mix(base, bc) : bc; } } return base || { r: 255, g: 255, b: 255, a: 1 }; };
  const mix = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const sel = "#bDaily,#startBtn,#bPlay,#bPractice,#bMake,#bShare,#bAgain,.btn,.big,.cta,.grow,button.hmain";
  for (const e of document.querySelectorAll(sel)) {
    if (e.tagName === "SPAN" || e.tagName === "B") continue;
    const cs = getComputedStyle(e), r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || cs.visibility === "hidden" || +cs.opacity < .05 || e.closest("[hidden],.leaf,.ov[hidden]")) continue;
    const txt = (e.innerText || "").replace(/\s+/g, " ").trim(), fs = parseFloat(cs.fontSize), bg = bgOf(e), fg = parse(cs.color) || { r: 0, g: 0, b: 0, a: 1 };
    const L1 = lum(fg), L2 = lum(bg), cr = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
    out.push({ id: e.id || (e.className + "").split(" ")[0], txt: txt.slice(0, 24), n: txt.length, w: r.width, h: r.height, pw: pr.width, fs, cr, br: cs.borderRadius, out: r.left < -2 || r.right > innerWidth + 2 || r.top < -2 || r.bottom > innerHeight + 2, big: /^(bDaily|startBtn|bPlay)$/.test(e.id) });
  }
  /* nền skin phủ rộng bằng #play::before (z-index âm): #play phải tự tạo stacking context, nếu không nền body che mất → nền skin biến mất ngoài cột game */
  const bef = getComputedStyle(pl, "::before"), cs0 = getComputedStyle(pl), bgHidden = bef.content !== "none" && bef.zIndex !== "auto" && +bef.zIndex < 0 && !(cs0.isolation === "isolate" || cs0.zIndex !== "auto" || cs0.transform !== "none" || +cs0.opacity < 1);
  return { out, bgHidden, sw: document.documentElement.scrollWidth > innerWidth + 1 };
};
const judge = (tag, m) => {
  for (const b of m.out) {
    const nm = tag + " #" + b.id + " «" + b.txt + "»", chars = b.w / (b.fs * .5);
    if (b.n > 0 && !/^[\p{Extended_Pictographic}\p{S}\s←→✕✓▶⋯?+\-0-9]{1,4}$/u.test(b.txt)) {
      note(b.h >= 43.5, nm + ": cao " + Math.round(b.h) + "px < 44");
      if (b.n > 3) { note(b.w / b.h >= 1.5, nm + ": co thành hình tròn/vuông (" + Math.round(b.w) + "x" + Math.round(b.h) + ")"); note(chars >= 8 || b.n < 8, nm + ": chữ chạy thành cột dọc (rộng ≈" + chars.toFixed(1) + " ký tự)"); }
      note(b.cr >= 4.5, nm + ": tương phản chữ/nền " + b.cr.toFixed(2) + " < 4.5");
    }
    note(!b.out, nm + ": tràn ra ngoài màn hình");
    if (b.big) note(b.w >= b.pw * .55, nm + ": thẻ/CTA chính chỉ rộng " + Math.round(b.w / b.pw * 100) + "% khung chơi (cần ≥55%)");
  }
  note(!m.sw, tag + ": trang tràn ngang");
  note(!m.bgHidden, tag + ": nền skin (#play::before z-index âm) bị nền body che — #play thiếu isolation:isolate");
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let total = 0, retry = false;
  for (const [portal, id] of LIST) {
    let src = ""; try { src = execSync("node -e \"process.stdout.write(require('./server/pro/" + id + ".js').source({}))\"", { cwd: root, stdio: ["ignore", "pipe", "ignore"] }).toString(); } catch (e) {}
    if (!src) { note(false, id + ": không nạp được server/pro/" + id + ".js"); continue; }
    /* liệt kê skin (loại basic): [typeIdx, skinId] */
    const pg0 = await br.newPage(); await pg0.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await pg0.goto(BASE + portal + "/games/" + id + "/index.html?lang=vi"); await wait(500);
    let skins = await pg0.evaluate(s => { (0, eval)(s); const A = Array.isArray(PF.skinSel), S = A ? PF.skins : [PF.skins], o = []; S.forEach((m, t) => Object.keys(m || {}).forEach(k => { if (k !== "basic") o.push([t, k]); })); return o; }, src).catch(() => []);
    await pg0.close();
    if (QUICK && skins.length > 4) skins = skins.filter((_, i) => i % Math.ceil(skins.length / 4) === 0);
    console.log("== " + portal + "/" + id + " (" + skins.length + " skin)");
    for (const [W, H] of VPS) for (const [t, k] of skins) for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt && !retry) break; retry = false; if (!attempt) total++;
      const f0 = fails.length, tag = id + " " + k + " " + W + "x" + H, pg = await br.newPage(), errs = []; pg.on("pageerror", e => errs.push(e.message));
      pg.setDefaultTimeout(15000);
      try {
        await Promise.race([(async () => {
        await pg.setViewport({ width: W, height: H, isMobile: W < 700 || H < 500, hasTouch: W < 700 });
        await pg.evaluateOnNewDocument(() => { try { localStorage.clear(); localStorage.setItem("np-sound", "0"); localStorage.setItem("lang", "vi"); localStorage.setItem("theme", "dark"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); for (const k of ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "xcp", "dr", "mz", "gc", "gm", "ch", "bh"]) localStorage.setItem(k + "-tut", "1"); } catch (e) {} });
        DBG("goto"); await pg.goto(BASE + portal + "/games/" + id + "/index.html?lang=vi"); await wait(450);
        await pg.evaluate((s, t, k) => { (0, eval)(s); if (Array.isArray(PF.skinSel)) PF.skinSel[t] = k; else PF.skinSel = k; try { applySkin(); } catch (e) {} try { renderHome(); } catch (e) {} }, src, t, k); await wait(500);
        DBG("judge1"); judge(tag + " chọn", await pg.evaluate(MEASURE));
        if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, [id, k, W + "x" + H, "chon"].join("-") + ".png") });
        if (portal === "cozyplay") {
          DBG("fin"); await pg.evaluate(() => { try { G.over = true; finish(G); } catch (e) { try { finish(); } catch (e2) {} } }); await wait(700);
          judge(tag + " kết thúc", await pg.evaluate(MEASURE));
          if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, [id, k, W + "x" + H, "ketthuc"].join("-") + ".png") });
        }
        note(!errs.length, tag + ": lỗi JS " + errs[0]);
        })(), new Promise((_, rj) => setTimeout(() => rj(new Error("quá 40 giây")), 40000))]);
      } catch (e) { if (!attempt) { fails.length = f0; retry = true; } else note(false, tag + ": đo lỗi " + String(e.message).slice(0, 80)); }   /* máy bận → thử lại 1 lần */
      await Promise.race([pg.close().catch(() => {}), wait(5000)]);
    }
  }
  await br.close(); srv.kill();
  console.log(fails.length ? "\n✗ " + fails.length + " lỗi skin Night Pass" : "\n✓ skin Night Pass đạt (" + total + " ca)");
  process.exit(fails.length ? 1 : 0);
})();
