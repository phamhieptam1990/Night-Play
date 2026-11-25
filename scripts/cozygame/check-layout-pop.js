/* Kiểm tra LAYOUT MỚI nhóm POP PLAY (shared/layout-pop.css + layout-pop.js), điện thoại thật (isMobile), cỡ ĐÃ TRỪ thanh địa chỉ:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-layout-pop.js [id,id,...]
   Mỗi game × cỡ × {không / có ván dở}: (1) thẻ/nút/dòng cao BẰNG NHAU (±1px); (2) linh vật có mặt, cao ≥ ngưỡng và lớn hơn nút; (3) icon thẻ ≥ 56px, chữ thẻ một dòng;
   (4) mọi khối nằm trọn màn, trang không cuộn; (5) không chồng lên nhau; (6) chữ ≥ 11px. Thoát mã 1 nếu có lỗi. */
const { spawn } = require("child_process"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8977, B = "http://localhost:" + PORT + "/popplay/games/";
const IDS = ["be-dau-bo-me", "be-noi-dung-khong", "bo-me-5-giay", "con-vat-an-so", "doan-tuoi-nao", "lang-cua-be", "nhay-theo-so", "pop-fly", "qua-song", "sudoku-con-vat", "ten-lua-cua-be", "thap-vong-mau", "ve-chu-quai-vat"];
const VPS = [[360, 560], [390, 664], [430, 760], [820, 1050], [844, 340], [667, 300], [568, 300], [1180, 760]];
const only = (process.argv[2] || "").split(",").filter(Boolean), list = only.length ? only : IDS, fails = [];
const note = (id, W, H, res, m) => { const s = id + " " + W + "x" + H + (res ? " (có ván dở)" : "") + ": " + m; fails.push(s); console.log("  ✗ " + s); };
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await new Promise(r => setTimeout(r, 1200));
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  for (const id of list) {
    console.log("== " + id);
    for (const res of [false, true]) for (const [W, H] of VPS) {
      const pg = await br.newPage(); await pg.setViewport({ width: W, height: H, isMobile: true, hasTouch: true });
      if (res) await pg.evaluateOnNewDocument(id => { try { localStorage.setItem("np-resume:" + id, JSON.stringify({ ts: Date.now(), state: { p: 1, seed: 123 }, daily: false })); } catch (e) {} }, id);
      try {
        await pg.goto(B + id + "/index.html?lang=vi", { waitUntil: "load", timeout: 25000 }); await new Promise(r => setTimeout(r, 2200));
        const r = await pg.evaluate((W, H) => {
          const out = [], vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 4 && r.height > 4 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > .05 && !e.closest("[hidden]"); };
          const home = ["ovStart", "home", "village"].map(i => document.getElementById(i)).find(e => e && vis(e)); if (!home) return ["không thấy màn chọn"];
          const items = [...home.querySelectorAll(".dbar,#dailyRow .main,.tiles>.tile,#cards>.card,#pgBtn,.abar,.band,.vcoll,#npResume .npr-go")].filter(e => vis(e) && !e.closest("[data-slide]>*:not(:nth-child(-n+3))"));
          const hs = items.map(e => Math.round(e.getBoundingClientRect().height)); if (!hs.length) return ["không có thẻ/nút"];
          const mn = Math.min(...hs), mx = Math.max(...hs); if (mx - mn > 1) out.push("thẻ/nút không cao bằng nhau: " + [...new Set(hs)].join("/"));
          const lv = [...home.querySelectorAll(".lvs .lvb")].filter(vis); if (lv.length) { const lh = lv.map(e => Math.round(e.getBoundingClientRect().height)); if (Math.max(...lh) - Math.min(...lh) > 1) out.push("nút cấp độ không cao bằng nhau"); for (const e of lv) { const q = e.getBoundingClientRect(); if (q.left < -2 || q.right > W + 2 || q.bottom > H + 2) { out.push("nút cấp độ ra ngoài màn @" + [q.left, q.top, q.right, q.bottom].map(Math.round)); break; } } }
          const hero = home.querySelector("#paHero"); const hh = hero && vis(hero) ? hero.getBoundingClientRect().height : 0;
          const hmin = (W > H * 1.1) ? Math.min(245, H - 62 - 12) : Math.min(245, (H - 116) * 0.5 - 4); if (hh < hmin) out.push("linh vật nhỏ hơn mức tối thiểu: " + Math.round(hh) + "px < " + Math.round(hmin));
          else if (hh < mx * 1.3) out.push("linh vật (" + Math.round(hh) + "px) không lớn hơn nút (" + mx + "px)");
          for (const e of home.querySelectorAll(".tile .ti,#cards .main .e")) if (vis(e) && e.getBoundingClientRect().width < 55) { out.push("icon thẻ nhỏ hơn 56px: " + Math.round(e.getBoundingClientRect().width)); break; }
          for (const t of home.querySelectorAll(".tile>b,#cards .main>span:not(.e)")) if (vis(t) && t.scrollWidth > t.clientWidth + 1) { out.push("chữ thẻ bị cắt"); break; }
          for (const e of home.querySelectorAll(".dbar,#npResume .npr-go,.tile>b,.abar")) if (vis(e) && getComputedStyle(e).fontSize !== "0px" && parseFloat(getComputedStyle(e).fontSize) < 10.9) { out.push("chữ nhỏ hơn 11px"); break; }
          for (const e of [hero, ...items].filter(e => e && vis(e) && !e.closest("[data-slide],.npp-bands"))) { const q = e.getBoundingClientRect(); if (q.left < -2 || q.top < -2 || q.right > W + 2 || q.bottom > H + 2) { out.push("ra ngoài màn: " + (e.id || e.className || e.tagName) + "@" + [q.left, q.top, q.right, q.bottom].map(Math.round)); break; } }
          const dd = document.documentElement; if (dd.scrollHeight > H + 1 || dd.scrollWidth > W + 1) out.push("trang cuộn được " + dd.scrollWidth + "x" + dd.scrollHeight);
          const rs = items.filter(e => !e.closest("[data-slide]")).map(e => e.getBoundingClientRect());
          for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) { const a = rs[i], b = rs[j]; if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 4 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 4) { out.push("chồng lên nhau @" + [a.left, a.top].map(Math.round) + " & " + [b.left, b.top].map(Math.round)); i = 999; break; } }
          return out;
        }, W, H);
        r.forEach(m => note(id, W, H, res, m));
      } catch (e) { note(id, W, H, res, "lỗi " + e.message); }
      await pg.close();
    }
  }
  await br.close(); srv.kill();
  if (fails.length) { console.log("\n✗ " + fails.length + " lỗi"); process.exit(1); } else console.log("\n✓ layout Pop đạt");
})();
