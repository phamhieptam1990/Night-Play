/* Bài đo: MỌI nút nhìn thấy của 12 game Pop Play >= 56px (bằng nút mở khoá iPhone, GAME_RULES 0a-18/popnp.css) ở 4 cỡ màn hình × màn chọn + màn chơi.
   Bỏ nút nằm trong menu ⋯ đang đóng (bị thu nhỏ khi đóng). Chạy: NODE_PATH=<puppeteer-core> node scripts/cozygame/check-popbtn.js [id,id] (cần python3 -m http.server 8765 ở gốc repo). */
const pp = require("puppeteer-core"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "../../popplay/games"), only = (process.argv[2] || "").split(",").filter(Boolean);
const games = fs.readdirSync(ROOT).filter(g => !only.length || only.includes(g)), SZ = [[380, 760], [844, 390], [820, 1000]], MIN = 56 - 1;
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
(async () => {
  const b = await pp.launch({ executablePath: CHROME, headless: "new" }); const bad = [];
  for (const g of games) for (const [w, h] of SZ) {
    const pg = await b.newPage(); await pg.setViewport({ width: w, height: h, hasTouch: w < 900 });
    try {
      await pg.goto(`http://localhost:8765/popplay/games/${g}/index.html?season=off`, { waitUntil: "load", timeout: 15000 }); await new Promise(r => setTimeout(r, 900));
      for (const phase of ["home", "play", "menu", "help", "skin", "end"]) {
        if (phase === "menu") { await pg.evaluate(() => { const f = document.getElementById("npFab") || document.getElementById("npPmFab") || document.querySelector(".np-fab,.npfan-btn"); f && f.click(); }); await new Promise(r => setTimeout(r, 600)); }
        if (phase === "help") { await pg.evaluate(() => { const f = document.getElementById("npFab"); if (f && f.classList.contains("open")) f.click(); const h = document.getElementById("phBtn"); h && h.click(); }); await new Promise(r => setTimeout(r, 500)); }
        if (phase === "skin") { await pg.evaluate(() => { const c = document.getElementById("phGo"); c && c.click(); const k = document.querySelector("#home .sk,.skinBtn,#bSkin,#skinOpen"); k && k.click(); }); await new Promise(r => setTimeout(r, 600)); }
        if (phase === "end") { await pg.evaluate(() => { document.querySelectorAll(".ov").forEach(o => o.hidden = true); const e = document.getElementById("ovEnd") || document.getElementById("end"); if (e) { e.hidden = false; e.classList.add("show"); } }); await new Promise(r => setTimeout(r, 500)); }
        if (phase === "play") { await pg.evaluate(() => { const c = document.querySelector("#home .tile,#home .ty,.tys>*,#modes>*"); c && c.click(); const go = document.getElementById("hwGo") || document.querySelector("#home .go,#home .big,#home .cta,#home .bgo,#home .btnbig"); go && go.click(); }); await new Promise(r => setTimeout(r, 2500)); }
        const r = await pg.evaluate(M => [...document.querySelectorAll("button,[role=button]")].filter(e => {
          const s = getComputedStyle(e), r = e.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0) || e.offsetParent === null || s.visibility === "hidden") return false;
          for (let a = e; a && a !== document.body; a = a.parentElement) { const c = getComputedStyle(a); if (c.opacity === "0" || c.visibility === "hidden" || (a.hidden)) return false; if (/bars-pop|np-hpn|npfan|fan/.test(a.className || "") && a.getBoundingClientRect().width < 1) return false; }
          return Math.min(e.offsetWidth, e.offsetHeight) < M;   /* kích thước bố cục: không bị hiệu ứng scale/animation làm lệch */
        }).map(e => (e.id || e.className || e.tagName) + " " + Math.min(e.offsetWidth, e.offsetHeight)), MIN);
        r.forEach(x => bad.push(`${g} ${w}x${h} ${phase}: ${x}`));
      }
    } catch (e) { bad.push(`${g} ${w}: lỗi ${e.message.slice(0, 40)}`); }
    await pg.close();
  }
  await b.close();
  if (bad.length) { console.log([...new Set(bad)].join("\n")); console.log("✗ " + bad.length + " nút < 56px"); process.exit(1); } else console.log("✓ mọi nút Pop Play >= 56px");
})();
