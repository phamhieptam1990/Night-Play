/* Kiểm tra Pop Play + 2 trang cổng (chạy cùng check.js trước khi commit):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-pop.js
   - 12 game Pop Play: tên game không bị cắt "…" ở 277/320/360 rộng (vi + en, sau khi vào ván), không tràn ngang/dọc, không lỗi JS, có thẻ viewport
   - Trang cổng cozyplay/index.html + popplay/index.html: không tràn, thanh trên/slogan không bị cắt ở 4 kích thước (vi + en)
   Thoát mã 1 nếu có lỗi. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8879, B = "http://localhost:" + PORT + "/", fails = [];
const note = (ok, msg) => { if (!ok) { fails.push(msg); console.log("  ✗ " + msg); } };
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await new Promise(r => setTimeout(r, 1200));
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const open = async (url, w, h, lang) => { const pg = await br.newPage(); pg._er = []; pg.on("pageerror", e => pg._er.push(e.message)); await pg.setViewport({ width: w, height: h, isMobile: true, hasTouch: true });
    await pg.evaluateOnNewDocument(l => { localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "dark"); localStorage.setItem("lang", l); }, lang);
    await pg.goto(B + url + "?lang=" + lang); await new Promise(r => setTimeout(r, 800)); return pg; };
  for (const id of fs.readdirSync(path.join(root, "popplay/games"))) {
    console.log("== pop " + id);
    for (const lang of ["vi", "en"]) for (const [w, h] of [[277, 590], [320, 640], [360, 640]]) {
      const pg = await open("popplay/games/" + id + "/index.html", w, h, lang);
      await pg.evaluate(() => { try { if (typeof begin === "function") begin(0); else if (typeof startRound === "function") startRound(0); } catch (e) {} }); await new Promise(r => setTimeout(r, 600));
      const r = await pg.evaluate(() => { const t = document.getElementById("title"), de = document.documentElement; return { cut: !!t && t.scrollWidth > t.clientWidth + 1, txt: t && t.textContent, hs: de.scrollWidth > innerWidth + 1, vp: !!document.querySelector('meta[name="viewport"]') }; });
      note(!r.cut, id + " " + lang + " " + w + ": tên game bị cắt “…”: " + r.txt); note(!r.hs, id + " " + lang + " " + w + ": tràn ngang"); note(r.vp, id + ": thiếu thẻ viewport");
      note(!pg._er.length, id + ": lỗi JS " + pg._er.slice(0, 1)); await pg.close();
    }
  }
  for (const pgn of ["cozyplay", "popplay"]) { console.log("== cổng " + pgn);
    for (const lang of ["vi", "en"]) for (const [w, h] of [[360, 640], [380, 844], [844, 390], [667, 375]]) {
      const pg = await open(pgn + "/index.html", w, h, lang);
      const r = await pg.evaluate(() => { const de = document.documentElement, hero = document.querySelector(".hero"), nav = document.querySelector(".nav"), gr = document.getElementById("grid"), t = gr.querySelector(".tile"); return { hs: de.scrollWidth > innerWidth + 1, vs: de.scrollHeight > innerHeight + 1, hero: hero ? hero.scrollWidth > hero.clientWidth + 1 : false, nav: nav.scrollWidth > nav.clientWidth + 1, tile: t ? Math.round(t.getBoundingClientRect().width) : 0 }; });
      const tag = pgn + " " + lang + " " + w + "x" + h; note(!r.hs && !r.vs, tag + ": tràn màn"); note(!r.hero, tag + ": slogan bị cắt"); note(!r.nav, tag + ": thanh trên tràn"); note(r.tile >= 64, tag + ": ô game nhỏ hơn 64px (" + r.tile + ")");
      note(!pg._er.length, tag + ": lỗi JS " + pg._er.slice(0, 1)); await pg.close();
    } }
  await br.close(); srv.kill(); console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi Pop/cổng" : "✓ Pop Play + trang cổng đạt")); process.exit(fails.length ? 1 : 0);
})();
