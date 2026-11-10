/* Kiểm tra NỀN NGOÀI CỘT theo chủ đề (shared/widebg.js) của MỌI game có giao diện Night Pass:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-widebg.js [id,id,...] [--quick] [--vp=1440x900,...]
   Mỗi game × {1271x684, 1440x900, 1194x834}: nạp bản free, rồi lần lượt MỖI skin Night Pass (Cozy: applySkin; Pop: begin(t)):
   - NPWide có chạy (lớp #npWide position:fixed, z-index âm, pointer-events:none, ở màn ≥700px rộng; màn ngang phủ cả bề ngang thì họa tiết nằm trên .deco)
   - nền của skin KHÁC bản free và KHÁC mọi skin khác của cùng game (so chữ ký nền: gradient + emoji chủ đề + kiểu vân)
   - không cuộn trang (ngang/dọc), nền không bắt chuột, nền không che nút/khung (nút bấm được vẫn là phần tử trên cùng tại tâm nút lớn)
   - có hình emoji chủ đề (≥1 emoji) và nền không phẳng (có ≥4 lớp ảnh nền)
   --quick: vài game (nối vào check.js). Tự chạy python3 -m http.server ở cổng riêng. Thoát mã 1 nếu có lỗi. */
const { spawn, execSync } = require("child_process"), path = require("path"), fs = require("fs"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.WIDEBG_PORT || 8885, BASE = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), QUICK = args.includes("--quick"), SHOTS = (args.find(a => a.startsWith("--shots=")) || "").slice(8);
const only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const vpArg = (args.find(a => a.startsWith("--vp=")) || "").slice(5);
const VPS = vpArg ? vpArg.split(",").map(s => s.split("x").map(Number)) : QUICK ? [[1440, 900]] : [[1271, 684], [1440, 900], [1194, 834]];
const cozy = fs.readdirSync(path.join(root, "cozyplay/games")), pop = fs.readdirSync(path.join(root, "popplay/games"));
const hasPro = id => fs.existsSync(path.join(root, "server/pro", id + ".js"));
let LIST = []; for (const id of cozy) if (hasPro(id) && id !== "dap-deadline") LIST.push(["cozyplay", id]); for (const id of pop) if (hasPro(id)) LIST.push(["popplay", id]);
if (only.length) LIST = LIST.filter(x => only.includes(x[1])); else if (QUICK) LIST = LIST.filter(x => ["xin-nghi", "xay-cau-tre", "qua-song"].includes(x[1]));
const fails = [], note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
/* chạy trong trang: đọc trạng thái nền */
const READ = () => {
  const w = document.getElementById("npWide"), N = window.NPWide, i = N && N.info && N.info(), cs = w && getComputedStyle(w), de = document.querySelector(".deco");
  const cover = document.documentElement.classList.contains("npw-cover");
  const big = document.querySelector("#bDaily,#startBtn,#bPlay,.btn.big,button.hmain"); let top = true;
  if (big) { const r = big.getBoundingClientRect(); if (r.width > 4 && r.height > 4) { const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); top = !!e && (e === big || big.contains(e) || e.contains(big)); } }
  return {
    has: !!(w && N && i), pos: cs && cs.position, z: cs && cs.zIndex, pe: cs && cs.pointerEvents, disp: cs && cs.display, sig: i ? i.sig : "", em: i ? i.em.length : 0, layers: i ? i.sig.split("|").length : 0,
    cover, decoPat: de ? getComputedStyle(de).backgroundImage !== "none" : false,
    sw: document.documentElement.scrollWidth > innerWidth + 1, sh: document.documentElement.scrollHeight > innerHeight + 1, top
  };
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let total = 0, nskin = 0;
  for (const [portal, id] of LIST) {
    let src = ""; try { src = execSync("node -e \"process.stdout.write(require('./server/pro/" + id + ".js').source({}))\"", { cwd: root, stdio: ["ignore", "pipe", "ignore"] }).toString(); } catch (e) {}
    if (!src) { note(false, id + ": không nạp được server/pro/" + id + ".js"); continue; }
    for (const [W, H] of VPS) for (let attempt = 0; attempt < 2; attempt++) {
      const f0 = fails.length, tag = id + " " + W + "x" + H, pg = await br.newPage(), errs = []; pg.on("pageerror", e => errs.push(e.message)); pg.setDefaultTimeout(15000);
      try {
        await Promise.race([(async () => {
          await pg.setViewport({ width: W, height: H, isMobile: false, hasTouch: false });
          await pg.evaluateOnNewDocument(() => { try { localStorage.clear(); localStorage.setItem("np-sound", "0"); localStorage.setItem("lang", "vi"); localStorage.setItem("theme", "dark"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); } catch (e) {} });
          await pg.goto(BASE + portal + "/games/" + id + "/index.html?lang=vi"); await wait(900);
          const skins = await pg.evaluate(s => { (0, eval)(s); const o = [], A = Array.isArray(PF.skinSel);
            if (!A && PF.skinSel && typeof PF.skinSel === "object" && Object.values(PF.skins).some(v => v && typeof v === "object" && Object.values(v).some(x => x && typeof x === "object" && ("layout" in x)))) { for (const ty of Object.keys(PF.skins)) for (const k of Object.keys(PF.skins[ty] || {})) o.push([ty, k]); return o; }   /* Cánh Nhỏ / Chim Bay: skinSel[type] = id */
            const S = A ? PF.skins : [PF.skins]; S.forEach((m, t) => Object.keys(m || {}).forEach(k => { if (k !== "basic") o.push([t, k]); })); return o; }, src);
          let list = skins; if (QUICK && list.length > 5) list = list.filter((_, i) => i % Math.ceil(list.length / 5) === 0);
          const free = await pg.evaluate(READ); note(free.has, tag + " free: NPWide không chạy");
          const seen = new Map(); seen.set(free.sig, "free");
          for (const [t, k] of list) {
            await pg.evaluate((t, k, pop, gid) => {
              if (Array.isArray(PF.skinSel) || typeof t === "string") PF.skinSel[t] = k; else PF.skinSel = k;
              if (gid === "cozy-wings") { openHow(t); return; }
              if (gid === "pop-fly") { startRound(t); return; }
              if (gid === "doi-doi-2048") { begin(1, "free", 0, null, t); return; }
              if (pop) { try { if (typeof begin === "function") begin(t); else startSession(t); } catch (e) { try { applySkin(); } catch (e2) {} } } else { try { applySkin(); } catch (e) {} try { renderHome(); } catch (e) {} }
            }, t, k, portal === "popplay", id);
            await wait(/^(cozy-wings|pop-fly)$/.test(id) ? 1700 : portal === "popplay" ? 700 : 350); await pg.evaluate(() => window.NPWide && NPWide.refresh()); await wait(60);
            const m = await pg.evaluate(READ), nm = tag + " " + k; if (!attempt) nskin++;
            note(m.has, nm + ": NPWide không chạy");
            note(m.pos === "fixed" && +m.z < 0 && m.pe === "none", nm + ": lớp nền phải position:fixed, z-index âm, pointer-events:none (" + m.pos + "/" + m.z + "/" + m.pe + ")");
            note(m.cover ? m.decoPat : m.disp === "block", nm + ": nền không hiện (" + (m.cover ? "màn ngang phủ cả bề ngang nhưng .deco không có họa tiết" : "display=" + m.disp) + ")");
            note(m.em >= 1 && m.layers >= 5, nm + ": nền thiếu emoji chủ đề/lớp vân (" + m.em + " emoji, " + m.layers + " lớp)");
            note(m.sig !== free.sig, nm + ": nền GIỐNG bản free");
            if (seen.has(m.sig) && m.sig !== free.sig) note(false, nm + ": nền GIỐNG skin " + seen.get(m.sig));
            seen.set(m.sig, k);
            note(!m.sw && !m.sh, nm + ": trang bị cuộn do lớp nền");
            note(m.top, nm + ": nút chính bị lớp nền che");
            if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, [id, k, W + "x" + H].join("-") + ".png") });
          }
          note(!errs.length, tag + ": lỗi JS " + errs[0]);
          if (!attempt) total++;
        })(), new Promise((_, rj) => setTimeout(() => rj(new Error("quá 90 giây")), 90000))]);
        await Promise.race([pg.close().catch(() => {}), wait(5000)]);
        if (fails.length === f0 || attempt) break; fails.length = f0;   /* có lỗi lần 1 → thử lại 1 lần (máy bận) */
      } catch (e) { await Promise.race([pg.close().catch(() => {}), wait(5000)]); if (attempt) note(false, tag + ": đo lỗi " + String(e.message).slice(0, 80)); }
    }
  }
  await br.close(); srv.kill();
  console.log(fails.length ? "\n✗ " + fails.length + " lỗi nền ngoài cột" : "\n✓ nền ngoài cột đạt (" + total + " game×cỡ, " + nskin + " skin)");
  process.exit(fails.length ? 1 : 0);
})();
