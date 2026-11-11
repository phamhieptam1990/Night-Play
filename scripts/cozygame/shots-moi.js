/* Chụp ảnh THẬT cho trang tin ra mắt /moi/ từ game đang chạy (áp skin Night Pass bằng PF.skinSel như check-skins.js):
     landing/moi/img/<id>.webp   (<= 45KB, 480x624)  ·  landing/moi/img/og-<id>.png (1200x630, <= 120KB)  ·  landing/moi/img/og-moi.png (trang danh sách)
   Nguồn: landing/moi/launches.json (mỗi mục: gameId, group, shot.skin = id giao diện cần áp, shot.js = lệnh chạy thêm tuỳ chọn).
   Chạy lại: NODE_PATH=<thư mục puppeteer-core> node scripts/cozygame/shots-moi.js [id,id,...] */
const { spawn, execSync } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), out = path.join(root, "landing", "moi", "img"), wait = ms => new Promise(r => setTimeout(r, ms));
const MAX = 45 * 1024, OGMAX = 120 * 1024, only = (process.argv.find(a => !a.startsWith("--") && !a.endsWith(".js") && !a.includes("node")) || "").split(",").filter(Boolean);
const L = JSON.parse(fs.readFileSync(path.join(root, "landing", "moi", "launches.json"), "utf8")).filter(x => !only.length || only.includes(x.id));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const ogHtml = (kicker, title, tag, img) => `<!doctype html><meta charset=utf-8><body style="margin:0;width:1200px;height:630px;overflow:hidden;position:relative;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#fff;background:radial-gradient(900px 500px at 85% 0,rgba(124,92,255,.55),transparent),linear-gradient(180deg,#12141F,#1A1640)">
<div style="position:absolute;left:64px;top:56px;display:flex;align-items:center;gap:16px"><svg width="64" height="64" viewBox="0 0 64 64"><defs><clipPath id="c"><rect width="64" height="64" rx="18"/></clipPath></defs><g clip-path="url(#c)"><rect width="64" height="64" fill="#7C5CFF"/><rect width="32" height="64" fill="#FF5A1F"/></g><circle cx="32" cy="32" r="13" fill="#fff"/></svg><b style="font-size:40px">Play Hub</b></div>
<div style="position:absolute;left:64px;top:170px;width:660px"><div style="display:inline-block;padding:8px 18px;border-radius:99px;background:#FFC857;color:#1B1E2F;font:800 26px/1 system-ui">${esc(kicker)}</div>
<div style="font:800 ${title.length > 34 ? 56 : 70}px/1.08 Georgia,serif;margin-top:22px">${esc(title)}</div><div style="font-size:30px;line-height:1.35;margin-top:20px;opacity:.9">${esc(tag)}</div></div>
<div style="position:absolute;left:64px;bottom:44px;font-size:30px;font-weight:700;opacity:.95">nightplay.vn/moi/</div>
${img ? `<div style="position:absolute;right:90px;top:40px;width:330px;height:550px;border-radius:34px;padding:10px;background:linear-gradient(145deg,#d9dbe6,#7b7f94 18%,#2b2e40 45%,#9aa0b8 70%,#3a3d52);box-shadow:0 0 0 1px rgba(255,255,255,.2) inset,0 30px 60px rgba(0,0,0,.5),0 0 70px rgba(124,92,255,.45);transform:rotate(3deg)"><img src="${img}" style="width:100%;height:100%;object-fit:cover;object-position:top;border-radius:26px;display:block"></div>` : `<div style="position:absolute;right:80px;top:120px;font-size:200px;line-height:1">🌙</div>`}`;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const PORT = await new Promise(r => { const t = require("net").createServer().listen(0, () => { const p = t.address().port; t.close(() => r(p)); }); });
  const srv = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const og = async (name, html) => { const pg = await br.newPage(); await pg.setViewport({ width: 1200, height: 630 }); await pg.setContent(html); await wait(400); const f = path.join(out, name); let b = await pg.screenshot({ type: "png" }); await pg.close();
    /* PNG nền chuyển màu rất nặng: giảm bảng màu bằng sharp (có sẵn trong node_modules; không có thì để nguyên và bài đo sẽ báo) */
    try { const sharp = require(path.join(root, "node_modules", "sharp")); for (const c of [192, 128, 96, 64, 48]) { b = await sharp(b).png({ palette: true, colours: c, dither: 0.6, effort: 8 }).toBuffer(); if (b.length <= OGMAX) break; } } catch (e) { console.log("  (không có sharp, giữ PNG gốc)"); }
    fs.writeFileSync(f, b); const n = b.length; console.log(name, n + " bytes" + (n > OGMAX ? "  ✗ > 120KB" : "")); if (n > OGMAX) process.exitCode = 1; };
  for (const s of L) {
    const portal = s.group === "pop" ? "popplay" : "cozyplay", dir = portal + "/games/" + s.gameId + "/index.html";
    const pg = await br.newPage(); await pg.setViewport({ width: 400, height: 520, deviceScaleFactor: 1.2, isMobile: true, hasTouch: true });
    await pg.evaluateOnNewDocument(() => { try { localStorage.setItem("theme", "dark"); localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "0"); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); for (const k of ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "xcp", "dr", "mz", "gc", "gm", "ch", "bh"]) localStorage.setItem(k + "-tut", "1"); speechSynthesis.speak = () => {}; } catch (e) {} });
    await pg.goto("http://127.0.0.1:" + PORT + "/" + dir + "?lang=vi", { waitUntil: "load" }); await wait(1500);
    const k = s.shot && s.shot.skin;
    if (k) {
      const src = execSync("node -e \"process.stdout.write(require('./server/pro/" + s.gameId + ".js').source({}))\"", { cwd: root }).toString();
      const ok = await pg.evaluate((src, k) => { (0, eval)(src); const A = Array.isArray(PF.skinSel), S = A ? PF.skins : [PF.skins]; let f = false; S.forEach((m, t) => { if (m && m[k]) { f = true; if (A) PF.skinSel[t] = k; else PF.skinSel = k; } }); try { applySkin(); } catch (e) {} try { renderHome(); } catch (e) {} return f; }, src, k);
      if (!ok) { console.log("  ✗ " + s.id + ": không có skin " + k); process.exitCode = 1; }
      await wait(700);
    }
    if (s.shot && s.shot.js) { await pg.evaluate(s.shot.js); await wait(700); }
    let q = 72, buf; do { buf = await pg.screenshot({ type: "webp", quality: q }); q -= 6; } while (buf.length > MAX && q > 20);
    fs.writeFileSync(path.join(out, s.id + ".webp"), buf); console.log(s.id + ".webp", buf.length + " bytes (q" + (q + 6) + ")");
    await pg.close();
    const img = "data:image/webp;base64," + buf.toString("base64");
    await og("og-" + s.id + ".png", ogHtml(s.type === "skin" ? "Giao diện mới" : "Game mới", s.name.vi, s.tagline.vi, img));
  }
  if (!only.length) await og("og-moi.png", ogHtml("Mới · New", "Mới trên Play Hub", "Game mới và giao diện Night Pass mới · New games and Night Pass looks", ""));
  await br.close(); srv.kill();
})();
