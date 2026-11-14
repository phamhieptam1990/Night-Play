/* Linh vật phản ứng (shared/mascot.js). Chạy: NODE_PATH=<puppeteer-core> node scripts/cozygame/check-mascot.js [--quick] [--only=id,id] [--shots=<thư mục>]
   Mỗi game (Pop + Cozy có linh vật ở màn chọn) × 390x844 (cảm ứng) + 1280x720 (chuột): quét tìm linh vật bằng NPMascot.locate, rồi
   - chuột: rê vào → nghiêng (--mx-r ≠ 0), có nhún (scale lệch 1); rê ra → class npmx-on tự gỡ, không còn biến --mx-*
   - chạm nhanh: nhún (scale lệch 1) rồi lặng, gỡ class
   - nhấn giữ: phình (scale > 1.2) → pop (có hạt .npmx-fx, linh vật mờ hẳn) → hiện lại (opacity 1, scale 1) và gỡ class
   - nhả giữa chừng: về cỡ 1, KHÔNG pop
   - không có animation vô hạn do mascot.js tạo; trang không cuộn; không rò hạt/ring sau 2 giây. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8897, B = "http://localhost:" + PORT + "/", fails = [];
const quick = process.argv.includes("--quick"), shots = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8);
const only = (process.argv.find(a => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean);
const note = (ok, msg) => { if (!ok) { fails.push(msg); console.log("  ✗ " + msg); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await sleep(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let games = [];
  fs.readdirSync(path.join(root, "popplay/games")).sort().forEach(i => games.push("popplay/games/" + i));
  fs.readdirSync(path.join(root, "cozyplay/games")).sort().forEach(i => games.push("cozyplay/games/" + i));
  if (only.length) games = games.filter(g => only.some(o => g.endsWith("/" + o)));
  else if (quick) games = ["popplay/games/pop-fly", "popplay/games/doan-tuoi-nao", "cozyplay/games/xe-ca-phe", "cozyplay/games/cozy-wings"];
  const modes = [{ n: "cảm ứng 390x844", vp: { width: 390, height: 844, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }, touch: true }, { n: "chuột 1280x720", vp: { width: 1280, height: 720 }, touch: false }];
  if (shots) fs.mkdirSync(shots, { recursive: true });
  const st = () => { const h = document.querySelector(".npmx-on"); if (!h) return null; const s = h.style; return { r: parseFloat(s.getPropertyValue("--mx-r")) || 0, sx: parseFloat(s.getPropertyValue("--mx-sx")), sy: parseFloat(s.getPropertyValue("--mx-sy")), o: parseFloat(s.getPropertyValue("--mx-o")) }; };
  const scan = () => { if (!window.NPMascot) return { nolib: 1 }; for (let y = 60; y < innerHeight - 20; y += 12) for (let x = 20; x < innerWidth - 10; x += 12) { const i = NPMascot.locate(x, y); if (i) return { x: i.L + i.W / 2, y: i.T + i.H / 2, kind: i.kind, emoji: i.emoji, gs: i.gs, w: i.W, h: i.H }; } return null; };
  for (const g of games) {
    const id = g.split("/").pop(); let sawAny = false;
    for (const m of modes) {
      const pg = await br.newPage(); await pg.setViewport(m.vp);
      await pg.evaluateOnNewDocument(() => { try { localStorage.clear(); } catch (e) {} });
      await pg.goto(B + g + "/index.html", { waitUntil: "load" }); await sleep(1400); try { await pg.waitForFunction(() => window.NPMascot, { timeout: 5000 }); } catch (e) {}
      const tag = id + " · " + m.n, hit = await pg.evaluate(scan);
      if (!hit || hit.nolib) { if (hit && hit.nolib) note(false, tag + ": thiếu NPMascot (bridge.js chưa nạp mascot.js)"); await pg.close(); continue; }   /* game không có linh vật ở màn chọn */
      sawAny = true;
      const info = hit.kind + " " + hit.emoji + " " + Math.round(hit.w) + "x" + Math.round(hit.h);
      /* 1. nhấn nhanh */
      if (m.touch) { await pg.touchscreen.tap(hit.x, hit.y); } else { await pg.mouse.move(hit.x - 60, hit.y); await pg.mouse.move(hit.x, hit.y, { steps: 4 }); }
      let s = null, peak = { sx: 1, sy: 1, r: 0 };
      for (let k = 0; k < 8; k++) { await sleep(35); const q = await pg.evaluate(st); if (q) { s = q; if (Math.abs(q.sx - 1) > Math.abs(peak.sx - 1)) peak.sx = q.sx; if (Math.abs(q.sy - 1) > Math.abs(peak.sy - 1)) peak.sy = q.sy; if (Math.abs(q.r) > Math.abs(peak.r)) peak.r = q.r; } }
      note(!!s, tag + " (" + info + "): " + (m.touch ? "chạm" : "rê vào") + " không kích hoạt hiệu ứng (không có .npmx-on)");
      if (s) note(Math.abs(peak.sx - 1) > 0.03 || Math.abs(peak.sy - 1) > 0.03 || Math.abs(peak.r) > 0.5, tag + ": không thấy nhún/nghiêng (đỉnh sx=" + peak.sx + " sy=" + peak.sy + " r=" + peak.r + ")");
      if (!m.touch) {
        await pg.mouse.move(hit.x + hit.gs * 0.45, hit.y, { steps: 3 }); await sleep(260); s = await pg.evaluate(st);
        note(s && Math.abs(s.r) > 1, tag + ": rê lệch phải mà không nghiêng (r=" + (s && s.r) + ")");
        await pg.mouse.move(5, 5, { steps: 2 });
      }
      await sleep(1600); const rest = await pg.evaluate(() => ({ on: !!document.querySelector(".npmx-on"), vars: !![].some.call(document.querySelectorAll("[style*='--mx-']"), () => true) }));
      note(!rest.on && !rest.vars, tag + ": hiệu ứng không tự gỡ sau khi nghỉ (class/biến còn sót)");
      /* 1b. chuột: RÊ giữ nguyên chỗ cũng phình dần như nhấn giữ (không cần bấm), đủ lâu thì pop; rê ra thì hiện lại */
      if (!m.touch) {
        await pg.mouse.move(hit.x - 40, hit.y); await pg.mouse.move(hit.x, hit.y, { steps: 3 }); await sleep(900); let hs = await pg.evaluate(st), hfx = await pg.evaluate(() => document.querySelectorAll(".npmx-fx").length);
        const cur = await pg.evaluate((x, y) => getComputedStyle(document.elementFromPoint(x, y)).cursor, hit.x, hit.y);
        note(cur === "pointer", tag + ": rê lên linh vật con trỏ không phải bàn tay (cursor=" + cur + ")");
        note(hs && hs.sx > 1.04 && hfx === 0, tag + ": rê giữ 0,9s mà không phình (sx=" + (hs && hs.sx) + ", hạt=" + hfx + ")");
        await sleep(600); hfx = await pg.evaluate(() => document.querySelectorAll(".npmx-fx").length);
        note(hfx >= 6, tag + ": rê giữ ~1,5s mà không pop (hạt=" + hfx + ")");
        await pg.mouse.move(5, 5, { steps: 2 }); await sleep(2200); hs = await pg.evaluate(st);
        const cur2 = await pg.evaluate(() => document.documentElement.classList.contains("npmx-hand"));
        note(!cur2, tag + ": rê ra khỏi linh vật mà con trỏ bàn tay vẫn còn (npmx-hand)");
        note(!hs, tag + ": rê ra sau pop mà linh vật không hiện lại/gỡ class (" + JSON.stringify(hs) + ")");
      }
      /* 2. nhả giữa chừng (0,6s): phình nhưng không pop */
      const down = async () => { if (m.touch) { const c = await pg.target().createCDPSession(); await c.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: hit.x, y: hit.y }] }); return async () => { await c.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await c.detach(); }; } await pg.mouse.move(hit.x, hit.y); await pg.mouse.down(); return async () => { await pg.mouse.up(); await pg.mouse.move(5, 5); }; };
      let up = await down(); await sleep(700); s = await pg.evaluate(st);
      note(s && s.sx > 1.04, tag + ": giữ 0,7s mà không phình (sx=" + (s && s.sx) + ")");
      await up(); await sleep(1700);
      const after = await pg.evaluate(() => ({ fx: document.querySelectorAll(".npmx-fx").length, on: !!document.querySelector(".npmx-on") }));
      note(after.fx === 0 && !after.on, tag + ": nhả giữa chừng mà bị pop hoặc còn sót hiệu ứng");
      /* 3. giữ đủ lâu: pop */
      up = await down(); await sleep(1500); s = await pg.evaluate(st); const fx = await pg.evaluate(() => document.querySelectorAll(".npmx-fx").length);
      note(fx >= 6, tag + ": giữ 1,5s mà không pop (hạt=" + fx + ")");
      note(s && s.o < 0.5, tag + ": pop xong linh vật không biến mất (o=" + (s && s.o) + ")");
      if (shots) { await pg.screenshot({ path: path.join(shots, id + "-" + (m.touch ? "t" : "m") + "-pop.png") }); }
      await up(); await sleep(1800); s = await pg.evaluate(st);
      note(!s, tag + ": sau pop linh vật không hiện lại/gỡ class (" + JSON.stringify(s) + ")");
      const end = await pg.evaluate(() => ({ fx: document.querySelectorAll(".npmx-fx,.npmx-ring").length, sc: document.documentElement.scrollHeight > innerHeight + 1 || document.body.scrollHeight > innerHeight + 1, inf: document.getAnimations().filter(a => a.effect && a.effect.getComputedTiming().iterations === Infinity && /npmx/.test((a.effect.target && a.effect.target.className) || "")).length }));
      note(end.fx === 0, tag + ": còn hạt/ring sót sau 2 giây");
      note(!end.sc, tag + ": trang bị cuộn");
      await pg.close();
    }
    console.log((fails.length ? "" : "") + "  " + id + (sawAny ? "" : "  (không có linh vật ở màn chọn)"));
  }
  await br.close(); srv.kill();
  if (fails.length) { console.log("\n✗ " + fails.length + " lỗi"); process.exit(1); } else console.log("\n✓ linh vật phản ứng: tất cả đạt");
})().catch(e => { console.error(e); process.exit(2); });
