/* Khung giải thích / lời nhắc (.ask "Chọn một khu để xây làng!", #hint "Tap to fly up!", .coach/.bubble…) KHÔNG bị nén (chủ site báo: loa to chiếm ~40% thẻ, chữ xuống từng chữ):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-ask.js [--quick] [--shots=<thư mục>] [id,id,...]   (cổng NP_PORT hoặc 8892)
   Mọi game mở QUA TRANG CỔNG ở 11 cỡ (484x694, 600x700, 724x700, 800x700, 1024x768, 1194x834, 1271x684, 1440x900, 667x375, 844x390, 568x320), màn chọn + màn chơi. Với mỗi khung chữ đang hiện:
   - rộng >=140px; chữ <=3 dòng; KHÔNG từ nào bị ngắt giữa chừng (Range.getClientRects của từng từ chỉ một dòng); nút (loa…) trong thẻ <=30% bề rộng thẻ và <=44px; chữ không tràn khỏi thẻ. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.NP_PORT || 8892, B = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), quick = args.includes("--quick"), shots = (args.find(a => a.startsWith("--shots=")) || "").slice(8), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [], note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")).filter(d => fs.existsSync(path.join(root, "cozyplay/games", d, "index.html"))), POP = fs.readdirSync(path.join(root, "popplay/games"));
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "cozy-wings"], ["cozyplay", "ban-co-hieu-toi"], ["popplay", "lang-cua-be"], ["popplay", "ten-lua-cua-be"], ["popplay", "qua-song"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
const ALL = [[484, 694, 0], [600, 700, 0], [724, 700, 0], [800, 700, 0], [1024, 768, 1], [1194, 834, 0], [1271, 684, 0], [1440, 900, 0], [667, 375, 1], [844, 390, 1], [568, 320, 1]];
const SIZES = quick ? [ALL[0], ALL[3], ALL[5], ALL[8], ALL[10]] : ALL;
const SEL = ".ask,.coach,.bubble,.say,#tip,#hintCard,#gHint,#hint,.hint,.hintbox,[class*=coach],[id*=hint],[id*=Hint],[class*=bubble]";
const MEASURE = (SEL) => {
  const r0w = e => e.getBoundingClientRect().width;   // chip chỉ có nút loa (cột <=560px): không còn khung chữ để đo
  const f = document.querySelector("#stage iframe"), d = f && f.contentDocument, out = []; if (!d) return out;
  const w = d.defaultView, vis = e => { const s = w.getComputedStyle(e), r = e.getBoundingClientRect(); let p = e; while (p && p.nodeType === 1) { const ps = w.getComputedStyle(p); if (ps.display === "none" || ps.visibility === "hidden" || +ps.opacity < .05 || p.hidden) return false; p = p.parentElement; } return r.width > 20 && r.height > 12 && r.bottom > 0 && r.right > 0 && r.left < w.innerWidth && r.top < w.innerHeight; };
  const seen = new Set();
  for (const e of d.querySelectorAll(SEL)) {
    if (seen.has(e) || !vis(e)) continue; const txt = (e.innerText || "").trim(); if (r0w(e) < 60) continue; if (txt.length < 6 || txt.split(/\s+/).length < 2) continue;
    if ([...seen].some(x => x.contains(e) || e.contains(x))) continue; seen.add(e);
    const r = e.getBoundingClientRect(), words = [], tw = d.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    let broken = "", tops = new Set(), n;
    while ((n = tw.nextNode())) { if (!n.parentElement || !vis(n.parentElement)) continue; const re = /\S+/g; let m; while ((m = re.exec(n.nodeValue))) { const rg = d.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rs = [...rg.getClientRects()].filter(q => q.width > 0); if (!rs.length) continue; tops.add(Math.round(rs[0].top / 4)); if (rs.length > 1 && !broken) broken = m[0]; if (rs[0].right > r.right + 2 || rs[0].left < r.left - 2) broken = broken || "(tràn) " + m[0]; } }
    const b = e.querySelector("button,.ib"), br = b && vis(b) ? b.getBoundingClientRect() : null, fs = parseFloat(w.getComputedStyle(e).fontSize);
    out.push({ sel: (e.id ? "#" + e.id : "") + "." + String(e.className).split(" ")[0], w: r.width, lines: tops.size, broken, bw: br ? br.width : 0, bh: br ? br.height : 0, txt: txt.slice(0, 24), fs });
  }
  return out;
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const launch = () => puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let br = await launch();   /* Chrome có thể chết khi máy tải nặng: dựng lại trình duyệt, không bỏ cả lượt đo */
  let n = 0;
  for (const [portal, id] of list) {
    console.log("== " + portal + "/" + id);
    for (const [W, H, t] of SIZES) {
      let pg; try {
        if (!br.connected) { try { await br.close(); } catch (e) {} br = await launch(); } pg = await br.newPage(); pg.setDefaultNavigationTimeout(90000); await pg.setViewport({ width: W, height: H, isMobile: !!t, hasTouch: !!t });
        await pg.evaluateOnNewDocument(() => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "dark"); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("np-rails", "1"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); });
        await pg.goto(B + portal + "/index.html?lang=vi#" + id); await wait(2300);
        const stages = [["chọn", null]];
        if (portal === "cozyplay") stages.push(["chơi", () => { const e = document.getElementById("bPlay") || document.getElementById("bDaily") || document.getElementById("startBtn") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn"); e && e.click(); }]);
        else stages.push(["chơi", "try{begin(0,{})}catch(e){try{startSession(0,null,{})}catch(e2){try{startRound(Object.keys(PF.types||{})[0]||0)}catch(e3){}}}"]);
        for (const [name, act] of stages) {
          if (act) { const fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (!fr) break; await fr.evaluate(act).catch(() => {}); await wait(900); }
          const list2 = await pg.evaluate(MEASURE, SEL), tag = id + " " + W + "x" + H + " " + name;
          if (shots && list2.length) await pg.screenshot({ path: path.join(shots, id + "-" + W + "x" + H + "-" + (name === "chọn" ? "choose" : "play") + ".png") });
          for (const a of list2) { n++; const k = tag + " [" + a.sel + " “" + a.txt + "”]";
            note(a.w >= 140, k + ": thẻ rộng " + Math.round(a.w) + "px (<140)"); note(a.lines <= 3, k + ": " + a.lines + " dòng (>3)"); note(!a.broken, k + ": từ bị ngắt giữa chừng: " + a.broken);
            if (a.bw) { note(a.bw <= a.w * 0.3 + 0.5, k + ": nút " + Math.round(a.bw) + "px chiếm " + Math.round(a.bw / a.w * 100) + "% thẻ (>30%)"); note(a.bw <= 44.5 && a.bh <= 44.5, k + ": nút " + Math.round(a.bw) + "x" + Math.round(a.bh) + " (>44)"); } }
        }
      } catch (e) { note(false, id + " " + W + "x" + H + ": không đo được " + String(e).slice(0, 80)); }
      try { await pg.close(); } catch (e) {}
    }
  }
  await br.close(); srv.kill(); console.log("\nđã đo " + n + " khung"); console.log(fails.length ? "✗ " + fails.length + " lỗi khung giải thích" : "✓ khung giải thích đạt"); process.exit(fails.length ? 1 : 0);
})();
