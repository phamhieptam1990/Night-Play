/* Kiểm tra MÀN NGANG cho TẤT CẢ game Cozy (9 sinh tự động + 11 viết tay), giả lập điện thoại thật (isMobile → bắt lỗi thiếu thẻ viewport):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-landscape.js [id,id,...]   (cần python3 -m http.server 8877 ở thư mục gốc — script tự chạy)
   Mỗi game × {844x390, 667x375, 1190x640} × {free, giao diện Night Pass đầu tiên} × {chọn, chơi, kết thúc, popup ?}:
   không tràn/cuộn trang, innerWidth đúng bằng kích thước (không bị phóng nhỏ), nút thanh trên cao 38–46px, mọi nút/khung/thẻ chính không bị cắt ra ngoài màn hình,
   khung chơi (canvas / bàn) có tâm trong ±8% tâm màn hình, thẻ popup nằm trọn trong màn hình. Thoát mã 1 nếu có lỗi. */
const { spawn, execSync } = require("child_process"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8878, B = "http://localhost:" + PORT + "/cozyplay/games/";
const IDS = ["bao-nhieu-giay", "ve-mot-net", "cat-banh-chung", "mat-tinh-khong", "noi-mot-net", "ne-o-ga", "shipper-sieu-toc", "song-sot-cuoi-thang", "xay-cau-tre",
  "cho-hang-kieu-viet", "doi-doi-2048", "duong-ray", "ga-me-ban-trung", "gia-cho-viet", "me-cung-truyen-tay", "xe-ca-phe", "xin-nghi", "ban-co-hieu-toi", "dap-deadline", "cozy-wings"];
const only = (process.argv[2] || "").split(",").filter(Boolean), list = only.length ? only : IDS;
const NOPRO = ["dap-deadline"];   /* game chưa có cơ chế giao diện Night Pass (không có PF) */
const VPS = [[844, 390], [667, 375], [1190, 640]], fails = [];
const note = (ok, msg) => { if (!ok) { fails.push(msg); console.log("  ✗ " + msg); } };
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await new Promise(r => setTimeout(r, 1200));
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const measure = (pg, W, H) => pg.evaluate((W, H) => {
    const bad = [], sel = ".top button,.top .ib,.btn,.ib,.icon-btn,canvas,#cvw,.board,.desk,.card,.st,.opt,.ty,.cat,#hlpCard,.big";
    for (const e of document.querySelectorAll(sel)) {
      if (!e.offsetParent && getComputedStyle(e).position !== "fixed") continue; const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
      const cs = getComputedStyle(e); if (cs.visibility === "hidden" || +cs.opacity === 0) continue;
      if (e.closest("[hidden],.leaf,#hlpOv[hidden]")) continue;
      if (r.left < -2 || r.top < -2 || r.right > W + 2 || r.bottom > H + 2) bad.push((e.id || (e.className + "").split(" ")[0] || e.tagName) + "@" + [r.left, r.top, r.right, r.bottom].map(Math.round));
    }
    const cv = document.querySelector("#game canvas,#cv,.board,.desk,#play canvas,canvas"); let cx = null; if (cv && cv.offsetParent) { const r = cv.getBoundingClientRect(); if (r.width > 60) cx = Math.round((r.left + r.right) / 2); }
    const ib = [...document.querySelectorAll(".top .ib,.top .icon-btn,.top>button")].filter(e => e.offsetParent).map(e => Math.round(e.getBoundingClientRect().height));
    return { iw: innerWidth, scroll: document.documentElement.scrollWidth > innerWidth + 1 || document.documentElement.scrollHeight > innerHeight + 1, bad: bad.slice(0, 4), cx, ib };
  }, W, H);
  for (const id of list) {
    console.log("== " + id);
    let proSrc = ""; try { proSrc = execSync("node -e \"process.stdout.write(require('./server/pro/" + id + ".js').source({}))\"", { cwd: root, stdio: ["ignore", "pipe", "ignore"] }).toString(); } catch (e) {}
    for (const [W, H] of VPS) for (const skin of ["free", "pro"]) {
      if (skin === "pro" && (!proSrc || NOPRO.includes(id))) continue;
      const tag = id + " " + W + "x" + H + " " + skin, pg = await br.newPage(), errs = []; pg.on("pageerror", e => errs.push(e.message));
      await pg.setViewport({ width: W, height: H, isMobile: true, hasTouch: true });
      await pg.evaluateOnNewDocument(() => { localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", "dark"); for (const k of ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "xcp", "dr", "mz", "gc", "gm", "ch", "bh"]) localStorage.setItem(k + "-tut", "1"); });
      await pg.goto(B + id + "/index.html?lang=vi"); await new Promise(r => setTimeout(r, 800));
      if (skin === "pro") await pg.evaluate(proSrc + ";").then(() => pg.evaluate(() => { if (typeof PF === "undefined") return; const A = Array.isArray(PF.skinSel), S = A ? PF.skins[0] : PF.skins, k = Object.keys(S).filter(x => x !== "basic")[0]; if (!k) return; if (A) PF.skinSel[0] = k; else PF.skinSel = k; try { applySkin(); } catch (e) {} try { renderHome(); } catch (e) {} }));
      const step = async (name, wait) => { await new Promise(r => setTimeout(r, wait || 500)); const m = await measure(pg, W, H);
        note(m.iw === W, tag + " " + name + ": innerWidth=" + m.iw + " (thiếu thẻ viewport?)");
        note(!m.scroll, tag + " " + name + ": trang bị tràn/cuộn");
        note(!m.bad.length, tag + " " + name + ": bị cắt ra ngoài màn: " + m.bad.join(" "));
        note(m.ib.every(h => h >= 38 && h <= 46), tag + " " + name + ": nút thanh trên cao " + m.ib.join("/") + "px (cần 38–46)");
        return m; };
      await step("chọn");
      await pg.evaluate(() => { const e = document.getElementById("bDaily") || document.getElementById("startBtn") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn"); e && e.click(); });
      if (id === "cozy-wings") { await pg.click("#cards .daily").catch(() => {}); await new Promise(r => setTimeout(r, 700)); await pg.evaluate(() => { const e = document.getElementById("hwGo"); e && e.offsetParent && e.click(); }); }
      const mp = await step("chơi", 900);
      note(mp.cx == null || Math.abs(mp.cx - W / 2) <= W * .08, tag + " chơi: khung chơi lệch tâm (cx=" + mp.cx + ", giữa=" + W / 2 + ")");
      await pg.evaluate(() => { try { G.over = true; finish(G); } catch (e) {} }); await step("kết thúc", 900);
      if (await pg.evaluate(() => { const e = document.getElementById("bHelp"); if (e && e.offsetParent) { e.click(); return true; } return false; })) {
        await new Promise(r => setTimeout(r, 500)); const hc = await pg.evaluate(() => { const c = document.getElementById("hlpCard"); if (!c) return null; const r = c.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round); });
        note(!hc || (hc[0] >= 0 && hc[1] >= 0 && hc[2] <= W && hc[3] <= H), tag + " popup ?: thẻ nằm ngoài màn " + hc);
      }
      note(!errs.length, tag + ": lỗi JS " + errs.slice(0, 1)); await pg.close();
    }
  }
  await br.close(); srv.kill(); console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi màn ngang" : "✓ màn ngang đạt")); process.exit(fails.length ? 1 : 0);
})();
