/* Kiểm tra "VÀO GAME KHÔNG CÓ ÂM THANH" (shared/bridge.js: mở khoá autoplay, iOS, nút loa). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-audio.js [--quick] [id,id]
   Chrome chạy với CHÍNH SÁCH AUTOPLAY THẬT (không có --autoplay-policy=no-user-gesture-required), --mute-audio chỉ tắt loa, không đổi trạng thái AudioContext.
   LƯU Ý: môi trường kiểm tra KHÔNG nghe được tiếng thật, nên chỉ đo được trạng thái AudioContext ("running" sau lần chạm đầu), thẻ <audio> mở khoá iOS, nút loa
   (aria-pressed, icon gạch chéo khi tắt) — việc có ra tiếng thật trên iPhone (công tắc im lặng), Zalo/TikTok... cần thử trên máy thật.
   Mỗi game (Cozy 20 + Pop 12): (1) mở TRỰC TIẾP dọc 390x844 và ngang 844x390, (2) mở qua TRANG CỔNG (iframe) 390x844:
     • mọi AudioContext (hook window.AudioContext từ evaluateOnNewDocument) sau lần chạm đầu phải "running" (và có ít nhất 1 context);
     • tắt tiếng rồi bật lại / NPAudio.silence() (ẩn tab) rồi chạm → "running" lại;
     • mute lưu từ trước (np-sound=0): nút loa hiện icon gạch chéo + aria-pressed=false NGAY khi vào, không context nào bị tự bật;
     • lần đầu (chưa có np-sound) mặc định BẬT: aria-pressed=true. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8881, B = "http://localhost:" + PORT + "/", args = process.argv.slice(2);
const quick = args.includes("--quick"), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
/* điểm chạm "an toàn": không trúng nút/ô bấm (nếu trúng nút Bắt đầu, game tự gọi NPAudio.silence() và treo context — đúng thiết kế, nhưng làm bài đo nhầm) */
const SAFE = () => { const W = innerWidth, H = innerHeight; for (let y = H - 4; y > 2; y -= Math.max(8, H / 40)) for (let x = 3; x < W - 2; x += Math.max(8, W / 30)) { const e = document.elementFromPoint(x, y); if (e && !e.closest("button,a,[onclick],input,select,label,canvas,.tile,.card,.btn,.ib,[role=button],.opt,.ty,.cat,.cell")) return [x, y]; } return [W / 2, H - 4]; };
const wait = ms => new Promise(r => setTimeout(r, ms)), bad = [];
const list = (g) => fs.readdirSync(path.join(root, g, "games")).filter(d => fs.existsSync(path.join(root, g, "games", d, "index.html")));
let games = [...list("cozyplay").map(i => ["cozyplay", i]), ...list("popplay").map(i => ["popplay", i])].filter(([, i]) => !only.length || only.includes(i));
if (quick && !only.length) games = games.filter((_, i) => i % 5 === 0);
const HOOK = () => {   // chạy trước mọi script của trang và của iframe: ghi lại mọi AudioContext
  window.__acs = []; ["AudioContext", "webkitAudioContext"].forEach(n => { const C = window[n]; if (!C) return; const W = function (o) { const c = new C(o); window.__acs.push(c); return c; }; W.prototype = C.prototype; window[n] = W; });
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const open = async (url, W, H, sound) => {
    const pg = await br.newPage(), errs = []; pg.on("pageerror", e => errs.push(e.message)); await pg.setViewport({ width: W, height: H, isMobile: true, hasTouch: true });
    await pg.evaluateOnNewDocument(HOOK);
    await pg.evaluateOnNewDocument(s => { localStorage.setItem("lang", "vi"); localStorage.setItem("theme", "light"); localStorage.setItem("np-season", JSON.stringify({ w: {}, seen: "x", tot: 0 })); if (s === "off") localStorage.setItem("np-sound", "0"); else if (s === "on") localStorage.setItem("np-sound", "1"); else localStorage.removeItem("np-sound"); for (const k of ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "xcp", "dr", "mz", "gc", "gm", "ch", "bh"]) localStorage.setItem(k + "-tut", "1"); localStorage.setItem("pophelp-seen:x", "1"); }, sound);
    await pg.goto(url); await wait(1500); return { pg, errs };
  };
  const gameFrame = (pg, id) => pg.frames().find(f => f.url().includes("/games/" + id + "/")) || pg.mainFrame();
  const tap = async (pg, fr) => { const [x, y] = await fr.evaluate(SAFE); const o = fr === pg.mainFrame() ? [0, 0] : await pg.evaluate(() => { const f = document.querySelector("#stage iframe"); const r = f && f.getBoundingClientRect(); return r ? [r.left, r.top] : [0, 0]; }); await pg.touchscreen.tap(x + o[0], y + o[1]); };
  const ST = () => (window.__acs || []).map(c => c.state);
  const BTN = () => { const b = document.getElementById("bSnd") || document.getElementById("soundBtn"); if (!b) return null; const off = b.children.length ? /l5 5/.test(b.innerHTML) : /🔇/.test(b.textContent); return { pressed: b.getAttribute("aria-pressed"), off, snd: b.getAttribute("data-npsnd"), label: b.getAttribute("aria-label") }; };
  for (const [portal, id] of games) {
    const sizes = [["direct", 390, 844], ["direct", 844, 390], ["portal", 390, 844]], tagBase = portal + "/" + id;
    for (const [how, W, H] of sizes) {
      const tag = tagBase + " " + how + " " + W + "x" + H, url = how === "direct" ? B + portal + "/games/" + id + "/index.html?lang=vi" : B + portal + "/index.html?lang=vi#" + id;
      const n = m => bad.push(tag + ": " + m);
      try {
        /* A. vào lần đầu (chưa chọn gì): BẬT mặc định; trước chạm có thể treo, SAU chạm đầu phải running */
        let { pg, errs } = await open(url, W, H, "default"); let fr = gameFrame(pg, id);
        const before = await fr.evaluate(ST);
        const b0 = await fr.evaluate(BTN); if (!b0) n("không có nút loa #bSnd/#soundBtn"); else if (b0.pressed !== "true" || b0.off) n("lần đầu chưa chọn: nút loa phải BẬT (aria-pressed=true) " + JSON.stringify(b0));
        await tap(pg, fr); await wait(700);
        let after = await fr.evaluate(ST); if (!after.length) n("không có AudioContext nào sau lần chạm đầu");
        if (after.some(s => s !== "running")) n("AudioContext chưa running sau lần chạm đầu: trước " + JSON.stringify(before) + " sau " + JSON.stringify(after));
        const np = await fr.evaluate(() => window.NPAudio && NPAudio.state ? NPAudio.state() : null); if (!np) n("thiếu NPAudio.state (bridge.js)");
        /* B. ẩn tab / rời game (NPAudio.silence → suspended) rồi chạm lại → running */
        await fr.evaluate(() => NPAudio.silence()); await wait(300);
        const sus = await fr.evaluate(ST); if (sus.length && sus.every(s => s === "running")) n("NPAudio.silence() không treo context");
        await tap(pg, fr); await wait(600); after = await fr.evaluate(ST);
        if (after.length && after.some(s => s !== "running")) n("sau silence + chạm, context không running lại: " + JSON.stringify(after));
        /* C. tắt tiếng bằng nút rồi tải lại: icon gạch chéo ngay lúc vào, không context nào chạy */
        await fr.evaluate(() => { const b = document.getElementById("bSnd") || document.getElementById("soundBtn"); b && b.click(); }); await wait(400);
        const b1 = await fr.evaluate(BTN); if (!b1 || b1.pressed !== "false" || !b1.off) n("sau khi bấm tắt, nút loa chưa hiện TẮT " + JSON.stringify(b1));
        if (errs.length) n("lỗi JS " + errs[0]); await pg.close();
        ({ pg, errs } = await open(url, W, H, "off")); fr = gameFrame(pg, id);
        const b2 = await fr.evaluate(BTN); if (!b2 || b2.pressed !== "false" || !b2.off || b2.snd !== "off") n("mute lưu từ trước: nút loa phải hiện TẮT ngay khi vào " + JSON.stringify(b2));
        await tap(pg, fr); await wait(500);
        const muted = await fr.evaluate(ST); if (muted.some(s => s === "running")) n("đã tắt tiếng mà context vẫn running (tự bật lại tiếng): " + JSON.stringify(muted));
        if (errs.length) n("lỗi JS " + errs[0]); await pg.close();
      } catch (e) { n("không đo được: " + String(e).slice(0, 120)); }
    }
    console.log("== " + tagBase + (bad.some(x => x.startsWith(tagBase + " ")) ? " ✗" : " ✓"));
  }
  await br.close(); srv.kill();
  console.log(bad.length ? bad.join("\n") + "\n✗ " + bad.length + " lỗi âm thanh" : "✓ âm thanh đạt (" + games.length + " game; chỉ đo trạng thái AudioContext, không nghe được tiếng thật)");
  process.exit(bad.length ? 1 : 0);
})();
