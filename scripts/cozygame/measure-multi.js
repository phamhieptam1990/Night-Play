/* ĐO KÍCH THƯỚC KHUNG TỐI THIỂU của từng game ở chế độ ?multi=1 (để điền minW/minH trong shared/multi-games.js). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/measure-multi.js [id,id] [--json=out.json]
   Mỗi game: mở ?multi=1, quét lần lượt các cỡ (rộng 260–512 × cao 300–500) ở màn chọn rồi sau khi bắt đầu ván; một cỡ "đạt" khi KHÔNG có nút/ô/canvas/tiêu đề nào
   tràn ra ngoài khung hoặc bị cắt, và trang không có thanh cuộn. In minW (cỡ nhỏ nhất đạt khi cao 500) và minH (cỡ nhỏ nhất đạt khi rộng 512). */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8888, O = "http://localhost:" + PORT;
const wait = ms => new Promise(r => setTimeout(r, ms));
const ids = (process.argv.slice(2).find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const jsonOut = (process.argv.find(a => a.startsWith("--json=")) || "").slice(7);
const M = require(path.join(root, "shared", "multi-games.js"));
const FRAMES = process.argv.includes("--frames"), FRAME_SIZES = [[378, 383], [394, 390], [378, 470], [590, 395], [470, 440], [300, 340]];
const WS = [260, 280, 300, 320, 340, 360, 390, 420, 512], HS = [300, 320, 340, 360, 380, 420, 460, 500];
/* trả về danh sách vi phạm ở cỡ hiện tại (chạy trong trang game) */
const AUDIT = () => {
  const W = innerWidth, H = innerHeight, bad = [];
  const sel = "button,a[href],input,select,textarea,canvas,[role=button],h1,h2,.btn,.tile,.band,.dbar,.chip,.card,#sSc";
  document.querySelectorAll(sel).forEach(e => {
    const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < .1 || cs.pointerEvents === "none") return;
    if (e.closest("[hidden],[aria-hidden=true],.deco,.toast,.nps-toast,#npxO,.ov[hidden],.pn")) return;
    const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return;
    if (r.left < -2 || r.top < -2 || r.right > W + 2 || r.bottom > H + 2) bad.push((e.id || e.className || e.tagName).toString().slice(0, 24) + "@" + Math.round(r.left) + "," + Math.round(r.top) + "," + Math.round(r.right) + "," + Math.round(r.bottom));
  });
  const de = document.documentElement;
  if (de.scrollWidth > W + 2) bad.push("scrollW " + de.scrollWidth); if (document.body.scrollHeight > H + 2) bad.push("scrollH " + document.body.scrollHeight);
  /* nội dung bị cắt bởi vùng chứa overflow:hidden (chữ/nút bị che) */
  document.querySelectorAll(".scr:not([hidden]),#play,.app,.play,#arena").forEach(e => { if (e.offsetParent === null && getComputedStyle(e).position !== "fixed") return; const cs = getComputedStyle(e); if (/hidden|clip/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 3 && !/scene|deco/.test(e.id)) bad.push("clip " + (e.id || e.className).toString().slice(0, 14) + " " + e.scrollHeight + ">" + e.clientHeight); });
  return bad.slice(0, 6);
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"], protocolTimeout: 120000 });
  const res = {};
  for (const id of M.ids()) {
    if (ids.length && !ids.includes(id)) continue;
    const g = M.get(id), pg = await br.newPage(); await pg.setViewport({ width: 390, height: 500, isMobile: true, hasTouch: true });
    await pg.evaluateOnNewDocument(() => { localStorage.clear(); localStorage.setItem("np-sound", "0"); localStorage.setItem("lang", "vi"); ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "dr", "d48", "gcv", "cw", "mc", "ch", "ga"].forEach(k => localStorage.setItem("tut_" + k, "1")); });
    await pg.goto(O + "/" + g.portal + "/games/" + id + "/index.html?multi=1&lang=vi", { waitUntil: "load" }); await wait(900);
    const sweep = async phase => {
      const okAt = {};
      for (const [w, h] of [...WS.map(w => [w, 500]), ...HS.map(h => [512, h])]) {
        await pg.setViewport({ width: w, height: h, isMobile: true, hasTouch: true }); await wait(260);
        const bad = await pg.evaluate(AUDIT).catch(() => ["err"]); okAt[w + "x" + h] = bad;
      }
      const minW = WS.find(w => okAt[w + "x500"].length === 0), minH = HS.find(h => okAt["512x" + h].length === 0);
      return { minW: minW || ">512", minH: minH || ">500", why: Object.entries(okAt).filter(([, b]) => b.length).slice(0, 3).map(([k, b]) => k + ": " + b.join("|")).join(" ; ") };
    };
    if (FRAMES) {   /* chế độ --frames: đo ở các cỡ khung THẬT mà host tạo ra, in ra cỡ nào tràn */
      const out = [];
      for (const phase of ["home", "play"]) {
        if (phase === "play") {
          let st = false;
          for (const sel of ["#bDaily", "#bPlay", "#home .tile", ".main", ".band", ".dbar", "#bPractice", "#bCamp"]) {
            await pg.setViewport({ width: 390, height: 500, isMobile: true, hasTouch: true }); await wait(250);
            const c = await pg.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel).catch(() => false); if (!c) continue; await wait(800);
            for (let k = 0; k < 2; k++) { await pg.evaluate(() => { const x = document.getElementById("hwGo"); if (x && x.offsetParent) x.click(); }).catch(() => {}); await wait(400); }
            for (let k = 0; k < 8; k++) { await wait(400); if (await pg.evaluate(() => !!NP.peek()).catch(() => false)) { st = true; break; } } if (st) break;
          }
          if (!st) continue;
        }
        for (const [w, h] of FRAME_SIZES) { await pg.setViewport({ width: w, height: h, isMobile: true, hasTouch: true }); await wait(300); const bad = await pg.evaluate(AUDIT).catch(() => ["err"]); if (bad.length) out.push(phase + " " + w + "x" + h + ": " + bad.slice(0, 2).join("|")); }
      }
      console.log(id.padEnd(22), out.length ? "✗ " + out.join(" ;; ").slice(0, 400) : "ok"); await pg.close(); continue;
    }
    const home = await sweep("home");
    await pg.setViewport({ width: 390, height: 500, isMobile: true, hasTouch: true }); await wait(300);
    let started = false;
    for (const sel of ["#bDaily", "#bPlay", "#home .tile", ".main", ".band", ".dbar", "#bPractice", "#bCamp"]) {
      const c = await pg.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel).catch(() => false); if (!c) continue; await wait(800);
      for (let k = 0; k < 2; k++) { await pg.evaluate(() => { const x = document.getElementById("hwGo"); if (x && x.offsetParent) x.click(); }).catch(() => {}); await wait(400); }
      for (let k = 0; k < 8; k++) { await wait(400); if (await pg.evaluate(() => !!NP.peek()).catch(() => false)) { started = true; break; } } if (started) break;
    }
    const play = started ? await sweep("play") : { minW: "-", minH: "-", why: "không bắt đầu được ván" };
    res[id] = { home, play, flag: { minW: g.minW, minH: g.minH } };
    const need = (a, b) => (typeof a === "number" && typeof b === "number" ? Math.max(a, b) : (typeof a === "number" ? a : b));
    console.log(id.padEnd(22), "home", home.minW + "x" + home.minH, "play", play.minW + "x" + play.minH, "→ cần", need(home.minW, play.minW) + "x" + need(home.minH, play.minH), "| cờ", g.minW + "x" + g.minH, (home.why || play.why) ? "| " + (home.why || play.why).slice(0, 110) : "");
    await pg.close();
  }
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(res, null, 1));
  await br.close(); srv.kill(); process.exit(0);
})();
