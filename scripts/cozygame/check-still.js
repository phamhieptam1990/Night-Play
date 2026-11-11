/* Nút ? 🔊 ngôn ngữ ĐỨNG YÊN khi người chơi không chạm (chủ site báo "icon loa cứ nhấp nháy"):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-still.js [--quick] [id,id,...]   (cổng NP_PORT hoặc 8889)
   Mọi game mở QUA TRANG CỔNG ở 1194x834 (khối HUD cột bên), 667x375 (HUD gọn), 390x844 (điện thoại dọc). Để yên 4 giây, ghi MutationObserver trên: nút ? 🔊 VI trong game, nút loa của thẻ nhắc việc (#askBtn),
   khối HUD cột bên (#npHud) và HUD gọn (#npHudc). Yêu cầu: 0 lần ghi DOM (thuộc tính/nội dung) ở trạng thái nghỉ, và không có animation lặp vô hạn (getAnimations) trên các nút đó. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.NP_PORT || 8889, B = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), quick = args.includes("--quick"), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [], note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")).filter(d => fs.existsSync(path.join(root, "cozyplay/games", d, "index.html"))), POP = fs.readdirSync(path.join(root, "popplay/games"));
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "bao-nhieu-giay"], ["cozyplay", "cozy-wings"], ["popplay", "lang-cua-be"], ["popplay", "pop-fly"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
const SIZES = [[1194, 834, 0], [667, 375, 1], [390, 844, 1]];
const IDS = ["bHelp", "phBtn", "bSnd", "soundBtn", "bLang", "langBtn", "askBtn"];
const INSTALL = (ids) => {
  window.__mut = {}; const log = (k, r) => { window.__mut[k] = (window.__mut[k] || 0) + r.length; };
  const f = document.querySelector("#stage iframe"), d = f && f.contentDocument, mo = (k, el) => { if (el) new MutationObserver(r => log(k, r)).observe(el, { attributes: true, childList: true, characterData: true, subtree: true }); };
  if (d) ids.forEach(id => mo("game#" + id, d.getElementById(id)));
  mo("npHud", document.getElementById("npHud")); mo("npHudc", document.getElementById("npHudc"));
};
const INF = (ids) => {
  const out = [], f = document.querySelector("#stage iframe"), d = f && f.contentDocument; if (!d) return out;
  const els = ids.map(id => d.getElementById(id)).filter(Boolean).concat([...d.querySelectorAll(".spk,.ask .ib,#askBtn")]).concat([...document.querySelectorAll("#npHud button,#npHudc button")]);
  for (const e of els) for (const a of e.getAnimations({ subtree: true })) { const t = a.effect && a.effect.getComputedTiming(); if (t && t.iterations === Infinity) out.push((e.id || e.dataset.k || e.className) + ":" + (a.animationName || a.transitionProperty || "anim")); }
  return out;
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  for (const [portal, id] of list) {
    console.log("== " + portal + "/" + id);
    for (const [W, H, t] of SIZES) {
      let pg; try {
        pg = await br.newPage(); await pg.setViewport({ width: W, height: H, isMobile: !!t, hasTouch: !!t });
        await pg.evaluateOnNewDocument(() => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("np-rails", "1"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); });
        await pg.goto(B + portal + "/index.html?lang=vi#" + id); await wait(2800);
        await pg.evaluate(INSTALL, IDS); await wait(4000);
        const m = await pg.evaluate(() => window.__mut), inf = await pg.evaluate(INF, IDS), tag = id + " " + W + "x" + H;
        for (const [k, n] of Object.entries(m)) note(n === 0, tag + ": " + k + " bị ghi DOM " + n + " lần trong 4 giây khi để yên");
        for (const a of inf) note(false, tag + ": animation lặp vô hạn trên " + a);
        /* sau khi vào ván (màn bài học có loa to .spk): đợi 6 giây (nhấp tối đa vài lần) rồi không còn animation vô hạn */
        const fr = pg.frames().find(f => f.url().includes("/games/" + id + "/"));
        if (fr && portal === "popplay") { await fr.evaluate("try{begin(0,{})}catch(e){try{startSession(0,null,{})}catch(e2){try{startRound(Object.keys(PF.types||{})[0]||0)}catch(e3){}}}").catch(() => {}); await wait(6000); for (const a of await pg.evaluate(INF, IDS)) note(false, tag + " (đang chơi): animation lặp vô hạn trên " + a); }
      } catch (e) { note(false, id + " " + W + "x" + H + ": không đo được " + String(e).slice(0, 80)); }
      try { await pg.close(); } catch (e) {}
    }
  }
  await br.close(); srv.kill(); console.log(fails.length ? "\n✗ " + fails.length + " lỗi nút nhấp nháy" : "\n✓ nút ? 🔊 VI đứng yên"); process.exit(fails.length ? 1 : 0);
})();
