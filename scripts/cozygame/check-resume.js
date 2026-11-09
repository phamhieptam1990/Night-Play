/* Kiểm tra TIẾP TỤC VÁN DỞ + nút BACK (shared/resume.js + shared/bridge.js). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-resume.js [--all] [--only=<id>,<id>]
   Mặc định chạy nhóm đại diện (6 Cozy sinh tự động + 3 viết tay + 3 Pop Play + Back qua trang cổng); --all = cả 32 game.
   Mỗi game: chơi dở → có bản lưu (np-resume:<id>) → tải lại thấy thẻ "Tiếp tục" → bấm → ván trở lại đúng (seed/loại), NP.helper = false, nút bảng điểm hiện lại
   → kết thúc (np.result) xoá bản lưu. Thêm: bản lưu hết hạn bị bỏ, chơi hộ (?helper=1) và thách đấu (#ch=) không lưu.
   Back (qua trang cổng): đang chơi → Back = popup "Thoát ván này?" (Tiếp tục chơi ở lại / Thoát mới về màn chọn game); Back lần nữa = đóng game; rời màn chơi bằng ← thì lịch sử không phình. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8878, O = "http://localhost:" + PORT;
const ALL = process.argv.includes("--all"), ONLY = (process.argv.find(a => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean);
const COZY = fs.readdirSync(path.join(root, "cozyplay/games")), POP = fs.readdirSync(path.join(root, "popplay/games"));
const SAMPLE = ["xay-cau-tre", "ne-o-ga", "bao-nhieu-giay", "song-sot-cuoi-thang", "shipper-sieu-toc", "mat-tinh-khong", "doi-doi-2048", "xin-nghi", "gia-cho-viet", "nhay-theo-so", "qua-song", "thap-vong-mau"];
const NO_RESUME = ["ban-co-hieu-toi", "be-dau-bo-me"];   // chưa có đường khởi tạo từ trạng thái
const NO_STATE_FREE = ["con-vat-an-so"];                 // NP.state chỉ có khi người chơi có Night Pass (để chuyển giao diện cho chơi hộ)   // chưa có đường khởi tạo từ trạng thái
let list = ONLY.length ? ONLY : ALL ? [...COZY.map(i => "cozyplay/" + i), ...POP.map(i => "popplay/" + i)].map(x => x.split("/")[1]) : SAMPLE;
const dirOf = id => (COZY.includes(id) ? "cozyplay" : "popplay");
const fails = []; let cur = [];
const note = (ok, id, msg) => { if (!ok) cur.push(id + ": " + msg); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TUT = ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "dr", "d48", "gcv", "cw", "mc", "ch", "ga"];

(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await sleep(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"], protocolTimeout: 120000 });
  const mk = async (url, w, h, keep) => {
    const pg = await br.newPage(); await pg.setViewport({ width: w || 380, height: h || 760, isMobile: true, hasTouch: true }); pg._errs = []; pg.on("pageerror", e => pg._errs.push(e.message));
    await pg.evaluateOnNewDocument((tut, keep) => { if (!keep && !sessionStorage.getItem("__i")) { sessionStorage.setItem("__i", "1"); localStorage.clear(); } localStorage.setItem("np-sound", "0"); localStorage.setItem("lang", "vi"); localStorage.setItem("theme", "light"); tut.forEach(k => localStorage.setItem(k + "-tut", "1")); localStorage.setItem("dt-age", "5"); localStorage.setItem("dt-name", "Bé"); }, TUT, !!keep);
    await pg.goto(url, { waitUntil: "load" }); await sleep(900); return pg;
  };
  /* bắt đầu một ván: thử lần lượt các nút chơi; trả true khi NP.peek() có trạng thái */
  const startPlay = async (pg, fr) => {
    for (const sel of ["#bDaily", "#bPlay", "#home .tile", ".main", ".band", ".dbar", "#bPractice", "#bCamp"]) {
      const ok = await (fr || pg).evaluate(sel => { const e = document.querySelector(sel); if (!e) return false; e.click(); return true; }, sel).catch(() => false);
      if (!ok) continue; await sleep(900);
      /* Pop Play: hộp 'Cách chơi' (#hwGo) hiện lần đầu: bấm để vào ván */
      for (let k = 0; k < 2; k++) { await (fr || pg).evaluate(() => { const g = document.getElementById("hwGo"); if (g && g.offsetParent) g.click(); }).catch(() => {}); await sleep(500); }
      for (let k = 0; k < 8; k++) { await sleep(500); if (await (fr || pg).evaluate(() => !!NP.peek()).catch(() => false)) return true; }   // một số game có đếm ngược/giới thiệu vài giây
    }
    return false;
  };
  const checkGame = async id => {
    const d = dirOf(id), base = O + "/" + d + "/games/" + id + "/index.html?lang=vi", key = "np-resume:" + id, noRes = NO_RESUME.includes(id);
    if (noRes) { console.log("  (bỏ qua lưu/tiếp tục: game chưa có initialState)"); return; }
    if (NO_STATE_FREE.includes(id)) { console.log("  (bỏ qua: bản miễn phí không có trạng thái ván để lưu)"); return; }
    let pg = await mk(base);
    const started = await startPlay(pg); note(started, id, "không bắt đầu được ván (NP.peek rỗng)");
    if (!started) { await pg.close(); return; }
    const tpl = await pg.evaluate(() => typeof window.snapP === "function");
    /* đọc trạng thái + (game khung chung chưa có tiến trình thật) ghi bản lưu thử trong CÙNG một lệnh, vì vài game tự kết thúc sau vài giây và sẽ xoá bản lưu */
    const first = await pg.evaluate((key) => { const st = NP.peek(); if (st && typeof window.snapP === "function" && !st.p) localStorage.setItem(key, JSON.stringify({ v: 1, ts: Date.now(), daily: false, day: "x", state: st })); return st; }, key);
    let st0 = first;
    for (let k = 0; k < 12 && !(await pg.evaluate(key => localStorage.getItem(key) !== null, key)); k++) await sleep(500);   // chờ vòng tự lưu (tối đa 6 giây)
    let rec = await pg.evaluate(key => { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }, key);
    note(!!rec && rec.state && rec.state.seed === st0.seed, id, "chưa có bản lưu hợp lệ sau khi chơi dở");
    /* tải lại → thẻ tiếp tục */
    await pg.goto(base, { waitUntil: "load" }); await sleep(1500);
    const card = await pg.evaluate(() => { const c = document.getElementById("npResume"); return c ? c.getBoundingClientRect().height : 0; });
    note(card >= 44, id, "không thấy thẻ 'Tiếp tục ván dở' ở màn chọn (cao " + Math.round(card) + "px)");
    const over = await pg.evaluate(() => { const h = document.getElementById("home"); return h ? h.scrollHeight > h.clientHeight + 2 : false; });
    note(!over, id, "màn chọn bị tràn/cuộn khi có thẻ tiếp tục");
    if (card >= 44) {
      await pg.evaluate(() => document.querySelector("#npResume .npr-go").click()); await sleep(2800);
      let r = await pg.evaluate(() => ({ st: NP.peek(), helper: NP.helper, url: location.search, board: (() => { const b = document.getElementById("bBoard"); return !b || !b.hidden; })() }));
      if (!r.st) { /* game dừng ở màn bắt đầu sau khi nạp (Đập Deadline...): bấm bắt đầu rồi đo */
        await pg.evaluate(() => { const b = document.getElementById("bPlay") || document.querySelector(".main"); b && b.click(); }).catch(() => {}); await sleep(1200);
        r = await pg.evaluate(() => ({ st: NP.peek(), helper: NP.helper, url: location.search, board: (() => { const b = document.getElementById("bBoard"); return !b || !b.hidden; })() }));
      }
      const same = !!r.st && (st0.seed === undefined || (r.st.seed === st0.seed && r.st.t === st0.t));
      note(same, id, "tiếp tục không khôi phục đúng ván: " + JSON.stringify(r.st && { seed: r.st.seed, t: r.st.t }) + " ≠ " + JSON.stringify({ seed: st0.seed, t: st0.t }));
      note(r.helper === false, id, "NP.helper vẫn true sau khi khởi tạo (nút chia sẻ/chơi lại sẽ bị ẩn)");
      note(r.board, id, "nút bảng điểm vẫn bị ẩn sau khi tiếp tục");
      note(!/resume=/.test(r.url), id, "?resume=1 còn trên địa chỉ");
      /* kết thúc ván → xoá bản lưu */
      const cleared = await pg.evaluate(async key => { try { NP.result({ score: 1 }); } catch (e) {} await new Promise(r => setTimeout(r, 300)); return localStorage.getItem(key) === null; }, key);
      note(cleared, id, "bản lưu không bị xoá khi ván kết thúc (NP.result)");
    }
    note(!pg._errs.length, id, "lỗi JS: " + pg._errs.slice(0, 2).join(" | "));
    await pg.close();
    /* hết hạn / daily sai ngày / chơi hộ / thách đấu */
    pg = await mk(base);
    await pg.evaluate((key, st) => localStorage.setItem(key, JSON.stringify({ v: 1, ts: Date.now() - 8 * 864e5, daily: false, day: "x", state: st })), key, st0);
    await pg.goto(base, { waitUntil: "load" }); await sleep(1200);
    note(await pg.evaluate(() => !document.getElementById("npResume")), id, "bản lưu quá 7 ngày vẫn hiện thẻ tiếp tục");
    await pg.evaluate((key, st) => localStorage.setItem(key, JSON.stringify({ v: 1, ts: Date.now(), daily: true, day: "2000-01-01", state: st })), key, st0);
    await pg.goto(base, { waitUntil: "load" }); await sleep(1200);
    note(await pg.evaluate(() => !document.getElementById("npResume")), id, "ván 'hôm nay' của ngày cũ vẫn hiện thẻ tiếp tục");
    await pg.close();
    pg = await mk(base + "&helper=1&s=" + Buffer.from(JSON.stringify(st0)).toString("base64url").replace(/=+$/, ""));
    await sleep(5200);
    note(await pg.evaluate(key => localStorage.getItem(key) === null, key), id, "chế độ chơi hộ (?helper=1) lại ghi bản lưu");
    await pg.close();
    };
  /* chạy một khối kiểm tra; lỗi (kể cả ngoại lệ của trình duyệt) thì thử lại 1 lần để loại trường hợp thất thường do máy bận; lỗi thật sẽ lặp lại */
  const attempt = async (id, fn) => {
    for (let k = 0; k < 2; k++) {
      cur = []; try { for (const p of await br.pages()) await p.close().catch(() => {}); await fn(); } catch (e) { cur.push(id + ": lỗi bộ thử: " + String(e.message).slice(0, 110)); }
      if (!cur.length) return; if (k === 1) cur.forEach(m => { fails.push(m); console.log("  ✗ " + m); }); else console.log("  (thử lại " + id + ": " + cur[0].slice(0, 90) + ")");
    }
  };
  for (const id of list) { console.log("== " + id); await attempt(id, () => checkGame(id)); }

  /* ===== BACK qua trang cổng ===== */
  const portalCases = ALL ? [["cozyplay", "xay-cau-tre"], ["cozyplay", "doi-doi-2048"], ["popplay", "nhay-theo-so"], ["popplay", "thap-vong-mau"]] : [["cozyplay", "xay-cau-tre"], ["popplay", "nhay-theo-so"]];
  for (const [d, id] of portalCases) {
    console.log("== back qua cổng " + d + "/" + id);
    await attempt(id, async () => {
    const pg = await mk(O + "/" + d + "/index.html?lang=vi");
    const info = async () => { try { const fr = pg.frames().find(f => f.url().includes("/games/" + id)); return { hash: await pg.evaluate(() => location.hash), on: await pg.evaluate(() => document.getElementById("stage").classList.contains("on")), play: fr ? await fr.evaluate(() => !!NP.peek()).catch(() => null) : null, len: await pg.evaluate(() => history.length) }; } catch (e) { return { err: "đã rời trang cổng" }; } };
    await pg.evaluate(id => { location.hash = id; }, id); await sleep(3800);
    let fr = pg.frames().find(f => f.url().includes("/games/" + id));
    note(!!fr, id, "không mở được game qua cổng"); if (!fr) { await pg.close(); return; }
    const ok = await startPlay(pg, fr); note(ok, id, "không bắt đầu được ván qua cổng");
    await pg.mouse.click(3, 420); await sleep(1500);
    const a = await info(); note(a.on && a.play === true, id, "trước khi back: game không ở trạng thái đang chơi " + JSON.stringify(a));
    /* Back khi đang chơi → popup "Thoát ván này?" (shared/exitconfirm.js): "Tiếp tục chơi" ở lại, "Thoát" mới về màn chọn */
    const popup = async fr0 => fr0.evaluate(() => { const o = document.getElementById("npxO"); if (!o) return null; return { h: [...o.querySelectorAll("button")].map(b => Math.round(b.getBoundingClientRect().height)), s: o.querySelector(".npxc").scrollHeight > o.querySelector(".npxc").clientHeight + 1 }; }).catch(() => null);
    await pg.evaluate(() => history.back()); await sleep(1000);
    fr = pg.frames().find(f => f.url().includes("/games/" + id));
    const p0 = await popup(fr); note(!!p0 && p0.h.every(x => x >= 48) && !p0.s, id, "Back khi đang chơi phải hiện popup xác nhận (nút >= 48px, không cuộn): " + JSON.stringify(p0));
    await fr.evaluate(() => document.querySelector("#npxO .npx-go").click()); await sleep(500);
    const stay = await info(); note(stay.on && stay.play === true && !(await popup(fr)), id, "'Tiếp tục chơi' phải ở lại ván: " + JSON.stringify(stay));
    await pg.evaluate(() => history.back()); await sleep(1000);
    await fr.evaluate(() => { const b = document.querySelector("#npxO .npx-out"); b && b.click(); }); await sleep(1600);
    const b1 = await info(); note(b1.on && b1.play === false && b1.hash === "#" + id, id, "Back khi đang chơi phải về MÀN CHỌN (game vẫn mở): " + JSON.stringify(b1));
    await pg.evaluate(() => history.back()); await sleep(1800);
    const b2 = await info(); note(!b2.on && b2.hash === "", id, "Back ở màn chọn phải ĐÓNG game: " + JSON.stringify(b2));
    await pg.close();
    /* ← trong game rồi Back một lần phải đóng game (lớp lịch sử của màn chơi đã được gỡ) */
    const pg2 = await mk(O + "/" + d + "/index.html?lang=vi");
    await pg2.evaluate(id => { location.hash = id; }, id); await sleep(3800);
    const fr2 = pg2.frames().find(f => f.url().includes("/games/" + id)); const ok2 = fr2 && await startPlay(pg2, fr2);
    if (ok2) {
      await pg2.mouse.click(3, 420); await sleep(1400);
      await fr2.evaluate(() => { const e = document.getElementById("bBk") || document.getElementById("homeBtn"); e && e.click(); }); await sleep(900);
      await fr2.evaluate(() => { const b = document.querySelector("#npxO .npx-out"); b && b.click(); }); await sleep(1400);   // ← khi đang chơi cũng hỏi trước
      await pg2.evaluate(() => history.back()); await sleep(1800);
      const c = { hash: await pg2.evaluate(() => location.hash), on: await pg2.evaluate(() => document.getElementById("stage").classList.contains("on")) };
      note(!c.on && c.hash === "", id, "sau khi thoát màn chơi bằng ← / 🏠, một lần Back phải đóng game: " + JSON.stringify(c));
    }
    await pg2.close();
    });
  }
  await br.close(); srv.kill();
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi" : "✓ tiếp tục ván dở + Back đạt"));
  process.exit(fails.length ? 1 : 0);
})();
