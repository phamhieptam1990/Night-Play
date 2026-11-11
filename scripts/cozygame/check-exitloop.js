/* Kiểm tra VÒNG LẶP "thoát / ván dở" (GAME_RULES 0a-15): qua trang cổng, ở màn chọn của game:
     - dù game còn trả NP.state() (mô phỏng game viết sai, và Night Pass thật của con-vat-an-so) thì KHÔNG được tự ghi lại bản lưu np-resume sau khi ✕ / về màn chọn,
     - thẻ "Tiếp tục ván dở" bấm ✕ phải biến mất và KHÔNG hiện lại,
     - Back / 🏠 ở màn chọn phải ĐÓNG game ngay (không popup "Thoát ván này?"), rồi mở lại và thoát lần nữa vẫn được.
   Chạy: NODE_PATH=<thư mục puppeteer-core> node scripts/cozygame/check-exitloop.js [--only=id,id]   (390x844, cảm ứng) */
const { spawn } = require("child_process"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8879, O = "http://localhost:" + PORT;
const ONLY = (process.argv.find(a => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean);
const fs = require("fs"), ALL = process.argv.includes("--all"), VP = (process.argv.find(a => a.startsWith("--vp=")) || "").slice(5);   // --vp=phone|d1271|d1440 (mặc định: phone + d1271)
const GROUP = (process.argv.find(a => a.startsWith("--group=")) || "").slice(8).split("/");   // --group=i/n: chia nhóm khi --all
const VPS = { phone: { w: 390, h: 844, touch: true }, d1271: { w: 1271, h: 684, touch: false }, d1440: { w: 1440, h: 900, touch: false } };
const VLIST = (VP ? VP.split(",") : ["phone", "d1271"]).map(k => [k, VPS[k]]);
let CASES = [["popplay", "con-vat-an-so"], ["popplay", "pop-fly"], ["cozyplay", "doi-doi-2048"], ["popplay", "qua-song"], ["popplay", "ve-chu-quai-vat"]].filter(c => !ONLY.length || ONLY.includes(c[1]));
if (ALL) { CASES = [...fs.readdirSync(path.join(root, "popplay/games")).map(i => ["popplay", i]), ...fs.readdirSync(path.join(root, "cozyplay/games")).map(i => ["cozyplay", i])].filter(c => !ONLY.length || ONLY.includes(c[1])); if (GROUP.length === 2) CASES = CASES.filter((c, i) => i % +GROUP[1] === +GROUP[0]); }
const sleep = ms => new Promise(r => setTimeout(r, ms)), fails = [];
const note = (ok, id, m) => { if (!ok) { fails.push(id + ": " + m); console.log("  ✗ " + m); } };
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await sleep(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"], protocolTimeout: 120000 });
  const mk = async (url, vp) => {
    const pg = await br.newPage(); await pg.setViewport({ width: vp.w, height: vp.h, isMobile: vp.touch, hasTouch: vp.touch });
    await pg.evaluateOnNewDocument(() => { if (!sessionStorage.getItem("__i")) { sessionStorage.setItem("__i", "1"); localStorage.clear(); } localStorage.setItem("np-sound", "0"); localStorage.setItem("lang", "vi"); localStorage.setItem("theme", "light"); localStorage.setItem("dt-age", "5"); localStorage.setItem("dt-name", "Bé");
      ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "dr", "d48", "gcv", "cw", "mc", "ch", "ga"].forEach(k => localStorage.setItem(k + "-tut", "1")); });
    await pg.goto(url, { waitUntil: "load" }); await sleep(900); return pg;
  };
  const startPlay = async fr => {
    for (const sel of ["#bDaily", "#bPlay", "#home .tile", ".main", ".band", ".dbar", "#bPractice", "#bCamp"]) {
      const ok = await fr.evaluate(sel => { const e = document.querySelector(sel); if (!e) return false; e.click(); return true; }, sel).catch(() => false);
      if (!ok) continue; await sleep(900);
      for (let k = 0; k < 2; k++) { await fr.evaluate(() => { const g = document.getElementById("hwGo"); if (g && g.offsetParent) g.click(); }).catch(() => {}); await sleep(500); }
      for (let k = 0; k < 8; k++) { await sleep(500); if (await fr.evaluate(() => !!NP.peek()).catch(() => false)) return true; }
    }
    return false;
  };
  const NO_STATE = ["ban-co-hieu-toi", "be-dau-bo-me"];   // 2 người chung máy: NP.state cố ý null, không có "đang chơi" để đo
  for (const [vk, vp] of VLIST) for (const [d, id] of CASES) {
    if (NO_STATE.includes(id)) { console.log("== " + id + " (bỏ qua: không có trạng thái ván)"); continue; }
    console.log("== " + vk + " " + d + "/" + id);
    const nf = fails.length;
    const pg = await mk(O + "/" + d + "/index.html?lang=vi", vp);
    const F = () => pg.frames().find(f => !f.detached && f.url().includes("/games/" + id));
    const S = async () => ({ hash: await pg.evaluate(() => location.hash), on: await pg.evaluate(() => document.getElementById("stage").classList.contains("on")),
      pop: await (F() ? F().evaluate(() => !!document.getElementById("npxO")).catch(() => null) : null), rec: await (F() ? F().evaluate(k => localStorage.getItem(k), "np-resume:" + id).catch(() => null) : null) });
    try {
      for (let round = 1; round <= (ALL ? 1 : 3); round++) {
        await pg.evaluate(id => { location.hash = id; }, id); await sleep(3000); for (let k = 0; k < 20 && !F(); k++) await sleep(500); await sleep(800);
        let fr = F(); if (fr) await F().evaluate(k => localStorage.removeItem(k), "np-resume:" + id).catch(() => {}); note(!!fr, id, "vòng " + round + ": không mở được game"); if (!fr) break;
        if (true) {   // chơi thật vài giây (mỗi vòng)
          note(await startPlay(F()), id, "không bắt đầu được ván"); await pg.mouse.click(3, 420); await sleep(3500);
        }
        /* ĐANG CHƠI, bấm ‹ của cổng (vòng lẻ) hoặc Back trình duyệt (vòng chẵn): phải về MÀN CHỌN của game (game vẫn mở), hỏi xác nhận nếu có */
        let s0 = await S(); note(s0.on && (await F().evaluate(() => !!NP.peek())), id, "vòng " + round + ": không ở trạng thái đang chơi (NP.peek rỗng) " + JSON.stringify(s0));
        if (round % 2) await pg.evaluate(() => document.getElementById("home").click()); else await pg.evaluate(() => history.back());
        await sleep(1000); await F().evaluate(() => { const b = document.querySelector("#npxO .npx-out"); b && b.click(); }); await sleep(1500);
        s0 = await S(); note(s0.on && s0.hash === "#" + id && (await F().evaluate(() => !NP.peek())), id, "vòng " + round + ": đang chơi bấm ‹/Back mà KHÔNG về màn chọn của game " + JSON.stringify(s0));
        /* mô phỏng game viết sai: NP.state vẫn trả dữ liệu ở màn chọn (+ Night Pass thật của con-vat-an-so) */
        const hasHome = await F().evaluate(() => !!document.getElementById("home"));
        if (hasHome) await F().evaluate(id => { if (id === "con-vat-an-so" && window.CV) { CV.PF.pro = { trial: false }; CV.PF.ticket = "x"; } NP.state(() => ({ t: 0, tk: "leak" })); }, id);
        await F().evaluate(k => localStorage.removeItem(k), "np-resume:" + id);
        await sleep(5200);   // > chu kỳ lưu 4 giây
        let s = await S(); note(!s.rec, id, "vòng " + round + ": ở màn chọn mà tự GHI LẠI bản lưu ván dở (vòng lặp thẻ Tiếp tục): " + s.rec);
        /* thẻ Tiếp tục dựng tay như sau khi thoát giữa ván, bấm ✕ phải mất hẳn */
        await F().evaluate(k => localStorage.setItem(k, JSON.stringify({ v: 1, ts: Date.now(), daily: false, day: "x", state: { t: 0, tk: "z", p: 1 } })), "np-resume:" + id);
        await sleep(1500);
        const hasCard = await F().evaluate(() => !!document.getElementById("npResume"));
        if (hasCard) { await F().evaluate(() => document.querySelector("#npResume .npr-x").click()); await sleep(5200);
          const c = await F().evaluate(() => !!document.getElementById("npResume")); s = await S();
          note(!c && !s.rec, id, "vòng " + round + ": bấm ✕ thẻ Tiếp tục mà nó hiện lại / bản lưu bị ghi lại " + JSON.stringify({ c, rec: s.rec })); }
        /* Back (vòng lẻ) hoặc 🏠 của cổng (vòng chẵn) ở màn chọn: đóng game, không popup */
        if (round % 2) await pg.evaluate(() => history.back()); else await pg.evaluate(() => document.getElementById("home").click());
        await sleep(1800); s = await S();
        note(!s.on && s.hash === "", id, "vòng " + round + ": Back/🏠 ở màn chọn không đóng được game (kẹt) " + JSON.stringify(s));
      }
    } catch (e) { note(false, id, "ngoại lệ: " + e.message); }
    if (fails.length === nf) console.log("  ✓ " + id);
    await pg.close().catch(() => {});
  }
  /* ===== THẺ "Tiếp tục ván dở" không được vỡ layout: cao <= 80px, ✕ tròn, ô chọn không chồng lấn và giữ nguyên vị trí ngang như khi không có thẻ ===== */
  if (!ONLY.length || ONLY.includes("layout")) for (const [id, d] of [["cozy-wings", "cozyplay"], ["pop-fly", "popplay"], ["nhay-theo-so", "popplay"]]) for (const [w, h] of [[1271, 684], [1440, 900], [1194, 834], [390, 844]]) {
    const tag = "thẻ " + id + " " + w + "x" + h; const nf = fails.length;
    const measure = async withCard => {
      const pg = await br.newPage(); await pg.setViewport({ width: w, height: h, isMobile: w < 500, hasTouch: w < 500 });
      await pg.evaluateOnNewDocument((id, withCard) => { localStorage.clear(); localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "dr", "d48", "gcv", "cw", "mc", "ch", "ga"].forEach(k => localStorage.setItem(k + "-tut", "1"));
        if (withCard) localStorage.setItem("np-resume:" + id, JSON.stringify({ v: 1, ts: Date.now() - 19 * 36e5, daily: false, day: "x", state: { t: 0, p: 1 } })); }, id, withCard);
      await pg.goto(O + "/" + d + "/games/" + id + "/index.html?lang=vi", { waitUntil: "load" }); await sleep(2200);
      const r = await pg.evaluate(() => { const c = document.getElementById("npResume"), cr = c && c.getBoundingClientRect(), x = c && c.querySelector(".npr-x").getBoundingClientRect(), go = c && c.querySelector(".npr-go");
        const tiles = [...document.querySelectorAll(".tile")].filter(t => t.offsetParent).map(t => { const b = t.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; });
        return { card: c ? [Math.round(cr.width), Math.round(cr.height)] : null, x: c ? [Math.round(x.width), Math.round(x.height)] : null, lines: go ? Math.round(go.getBoundingClientRect().height) : 0, tiles, sv: document.documentElement.scrollHeight - innerHeight, sh: document.documentElement.scrollWidth - innerWidth }; });
      await pg.close(); return r;
    };
    try {
      const a = await measure(false), b = await measure(true);
      note(!!b.card && b.card[1] <= 80, tag, "thẻ phải cao <= 80px: " + JSON.stringify(b.card));
      note(!!b.x && Math.abs(b.x[0] - b.x[1]) <= 1, tag, "✕ phải tròn: " + JSON.stringify(b.x));
      note(b.sv <= 1 && b.sh <= 1, tag, "trang bị cuộn khi có thẻ: " + b.sv + "/" + b.sh);
      for (let i = 0; i < b.tiles.length; i++) for (let j = i + 1; j < b.tiles.length; j++) { const p = b.tiles[i], q = b.tiles[j]; note(!(p[0] < q[0] + q[2] - 2 && q[0] < p[0] + p[2] - 2 && p[1] < q[1] + q[3] - 2 && q[1] < p[1] + p[3] - 2), tag, "ô " + i + " và " + j + " chồng lấn"); }
      const ext = t => [Math.min(...t.map(x => x[0])), Math.max(...t.map(x => x[0] + x[2]))];   // thứ tự/ cỡ ô có thể xáo trộn mỗi lần tải: so bề rộng khung chứa
      if (b.tiles.length) note(a.tiles.length === b.tiles.length && ext(a.tiles).every((v, i) => Math.abs(v - ext(b.tiles)[i]) <= 2), tag, "thẻ làm khung ô chọn đổi bề rộng/lệch cột: " + JSON.stringify([ext(a.tiles), ext(b.tiles)]));
    } catch (e) { note(false, tag, "ngoại lệ: " + e.message); }
    if (fails.length === nf) console.log("  ✓ " + tag);
  }
  await br.close(); srv.kill();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi" : "✓ thoát / ván dở không còn vòng lặp"));
  process.exit(fails.length ? 1 : 0);
})();
