/* Nút icon ĐIỆN THOẠI DỌC kiểu KÍNH TỐI (GAME_RULES.md 0a-17): không còn nền trắng + icon đen.
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-glass.js [--quick] [--light] [--group i/n] [id,id,...]   (tự chạy http.server cổng NP_PORT hoặc 8921+i)
   Mở game QUA TRANG CỔNG ở 320x568, 360x640, 375x667, 390x844, 414x896, 430x932, giao diện TỐI và SÁNG (--light chỉ sáng), màn chọn + màn chơi; với mọi nút icon ở hàng trên cùng (←, ⏸, 🔊, ⋯, ✕ popup ?) và nút nổi của cổng (#home, .nps-fab, #klock):
   cỡ = --tap-lg (56±1px), màu nền (phối trên nền trắng, trường hợp xấu nhất) có độ sáng < 0.35, màu icon sáng > 0.7, tương phản icon/nền >= 4.5:1. Chạy theo nhóm song song: --group 0/4 ... 3/4 (mỗi tiến trình 1/4 số game). */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), args = process.argv.slice(2), quick = args.includes("--quick"), light = args.includes("--light");
const gi = args.indexOf("--group"), [G, N] = gi >= 0 ? args[gi + 1].split("/").map(Number) : [0, 1], PORT = +process.env.NP_PORT || 8921 + G, only = (args.find(a => !a.startsWith("--") && !/^\d+\/\d+$/.test(a)) || "").split(",").filter(Boolean);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [];
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")).filter(d => fs.existsSync(path.join(root, "cozyplay/games", d, "index.html"))), POP = fs.readdirSync(path.join(root, "popplay/games"));
let list = [...COZY.map(i => ["cozyplay", i]), ...POP.map(i => ["popplay", i])];
if (quick) list = [["cozyplay", "bao-nhieu-giay"], ["cozyplay", "ban-co-hieu-toi"], ["cozyplay", "dap-deadline"], ["cozyplay", "cozy-wings"], ["popplay", "pop-fly"], ["popplay", "bo-me-5-giay"]];
if (only.length) list = list.filter(([, i]) => only.includes(i));
list = list.filter((_, i) => i % N === G);
const SIZES = quick ? [[320, 568], [375, 667], [430, 932]] : [[320, 568], [360, 640], [375, 667], [390, 844], [414, 896], [430, 932]];
/* chạy trong TRANG CỔNG: trả mảng nút icon cần đo (trong iframe game + nút nổi của cổng) */
const MEASURE = () => {
  const out = [], st = document.getElementById("stage"), f = st && st.querySelector("iframe"); let d = null; try { d = f && f.contentDocument; } catch (e) {}
  const num = c => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 1]; };
  const L = (r, g, b) => { const q = [r, g, b].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * q[0] + .7152 * q[1] + .0722 * q[2]; };
  const comp = c => { const a = c.length > 3 ? c[3] : 1; return [0, 1, 2].map(i => c[i] * a + 255 * (1 - a)); };   // phối trên nền trắng (xấu nhất)
  const add = (e, w, tag, isFloat) => {
    const s = w.getComputedStyle(e), r = e.getBoundingClientRect(); if (s.display === "none" || s.visibility === "hidden" || +s.opacity < .3 || r.width < 6 || r.height < 6 || e.closest("[hidden]")) return;
    const bl = (() => { const o = []; const c = num(s.backgroundColor); if (s.backgroundImage !== "none") { const re = /rgba?\([^)]*\)/g; let m; while ((m = re.exec(s.backgroundImage))) o.push(comp(num(m[0]))); } if (!o.length || c[3] === undefined || c[3] > 0) o.push(comp(c)); return o; })();
    const ink = num(s.color), il = L(ink[0], ink[1], ink[2]), ls = bl.map(b => L(b[0], b[1], b[2])), bmax = Math.max(...ls);
    const cr = Math.min(...ls.map(b => (Math.max(il, b) + .05) / (Math.min(il, b) + .05)));
    out.push({ n: tag + (e.id ? "#" + e.id : "." + (e.className + "").split(" ")[0]), w: r.width, h: r.height, bl: bmax, il, cr, isFloat });
  };
  if (d) { const w = d.defaultView;
    d.querySelectorAll("button,a[href],[role=button]").forEach(e => { const r = e.getBoundingClientRect(); if (e.closest(".ov,#diffs,.difs,#npFan,#npPmFan,#hlpOv,.pn")) return; if (r.top + r.height / 2 > 82 || r.width > 80 || r.width < 40) return; add(e, w, "game", 0); });
    const x = d.getElementById("hlpX"); if (x && x.offsetParent) add(x, w, "game", 0);
  }
  document.querySelectorAll("#stage #home,#stage .nps-fab,#klock").forEach(e => add(e, window, "portal", 1));
  return out;
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  for (const [portal, id] of list) {
    console.log("== " + portal + "/" + id);
    for (const th of light ? ["light"] : ["dark", "light"]) for (const [W, H] of SIZES) {
      let pg; try {
        pg = await br.newPage(); pg.setDefaultNavigationTimeout(90000); await pg.setViewport({ width: W, height: H, isMobile: true, hasTouch: true });
        await pg.evaluateOnNewDocument(t => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "1"); localStorage.setItem("theme", t); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("np-rails", "1"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); }, th);
        await pg.goto("http://localhost:" + PORT + "/" + portal + "/index.html?lang=vi#" + id); await wait(3000);
        for (const name of ["chọn", "chơi"]) {
          if (name === "chơi") { const fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (!fr) break;
            if (portal === "cozyplay") await fr.evaluate(() => { const e = document.getElementById("bPlay") || document.getElementById("bDaily") || document.getElementById("startBtn") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn"); e && e.click(); }).catch(() => {});
            else await fr.evaluate("try{begin(0,{})}catch(e){try{startSession(0,null,{})}catch(e2){try{startRound(Object.keys(PF.types||{})[0]||0)}catch(e3){}}}").catch(() => {}); await wait(1200); }
          const items = await pg.evaluate(MEASURE), tag = id + " " + W + "x" + H + " " + th + " " + name;
          if (!items.some(i => !i.isFloat) && name === "chọn") fails.push(tag + ": không thấy nút icon nào");
          for (const i of items) {
            const bad = [];
            if (Math.abs(i.w - 56) > 1 || Math.abs(i.h - 56) > 1) bad.push("cỡ " + i.w.toFixed(1) + "x" + i.h.toFixed(1) + " ≠ 56");
            if (i.bl >= .35) bad.push("nền sáng " + i.bl.toFixed(2) + " (≥ 0.35)");
            if (i.il <= .7) bad.push("icon không sáng " + i.il.toFixed(2) + " (cần > 0.7)");
            if (i.cr < 4.5) bad.push("tương phản " + i.cr.toFixed(2) + " < 4.5");
            if (bad.length) { const m = tag + ": " + i.n + " " + bad.join(", "); if (!fails.includes(m)) { fails.push(m); console.log("  ✗ " + m); } }
          }
        }
      } catch (e) { fails.push(id + " " + W + "x" + H + " " + th + ": không đo được " + String(e).slice(0, 80)); console.log("  ✗ " + fails[fails.length - 1]); }
      try { await pg.close(); } catch (e) {}
    }
  }
  await br.close(); srv.kill();
  console.log(fails.length ? "✗ " + fails.length + " lỗi (kính tối)" : "✓ nút icon kính tối: kích thước --tap-lg, nền tối, icon sáng, tương phản >= 4.5 ở mọi cỡ điện thoại, sáng + tối");
  process.exit(fails.length ? 1 : 0);
})();
