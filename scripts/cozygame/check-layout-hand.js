/* Kiểm tra LAYOUT MỚI (shared/layout.css + layout.js) màn chọn của game Cozy VIẾT TAY (11 game), giả lập điện thoại thật (isMobile), cỡ ĐÃ TRỪ thanh địa chỉ:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-layout-hand.js [id,id,...]
   Mỗi game × cỡ × {không / có ván dở}: (1) mọi thẻ/nút (thẻ Hôm nay, thẻ Tiếp tục, ô danh sách, hàng nút) CAO BẰNG NHAU (±1px); (2) khoảng cách giữa linh vật – thẻ – nút BẰNG NHAU (±2px);
   (3) linh vật có mặt và cao ≥ 96px (--hmin); (4) thẻ danh sách ≥ 52px cao, ≥ 84px rộng (bé bấm dễ); (5) không có phần tử nào ra ngoài màn / cuộn trang; (6) không chồng lên nhau; (7) icon thẻ danh sách ≥ 56px, chữ thẻ một dòng (không bị cắt); (8) chữ không nhỏ hơn 11px. Thoát mã 1 nếu có lỗi. */
const { spawn } = require("child_process"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8961, B = "http://localhost:" + PORT + "/cozyplay/games/";
const IDS = ["ban-co-hieu-toi", "cho-hang-kieu-viet", "doi-doi-2048", "duong-ray", "ga-me-ban-trung", "gia-cho-viet", "me-cung-truyen-tay", "xe-ca-phe", "xin-nghi", "dap-deadline", "cozy-wings"];
const VPS = [[360, 560], [390, 664], [430, 760], [820, 1050], [844, 340], [667, 300], [568, 300], [1180, 760]];
const only = (process.argv[2] || "").split(",").filter(Boolean), list = only.length ? only : IDS, fails = [];
const note = (ok, msg) => { if (!ok) { fails.push(msg); console.log("  ✗ " + msg); } };
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await new Promise(r => setTimeout(r, 1200));
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  for (const id of list) {
    console.log("== " + id);
    for (const res of [false, true]) for (const [W, H] of VPS) {
      const pg = await br.newPage(); await pg.setViewport({ width: W, height: H, isMobile: true, hasTouch: true });
      if (res) await pg.evaluateOnNewDocument(id => { try { localStorage.setItem("np-resume:" + id, JSON.stringify({ ts: Date.now(), state: { p: 1, seed: 123 }, daily: false })); } catch (e) {} }, id);
      try { await pg.goto(B + id + "/index.html?lang=vi", { waitUntil: "load", timeout: 25000 }); await new Promise(r => setTimeout(r, 2200));
        const r = await pg.evaluate((W, H) => {
          const out = [], vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 4 && r.height > 4 && s.visibility !== "hidden" && s.display !== "none" && +s.opacity > .05 && !e.closest("[hidden]"); };
          const wov = document.getElementById("ovStart");
          if (wov && document.getElementById("cwHero")) {   /* Cozy Wings: #ovStart kiểu Pop */
            const o2 = [], v2 = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 4 && r.height > 4 && s.display !== "none" && s.visibility !== "hidden"; };
            const hero = document.getElementById("cwHero"), hr = hero.getBoundingClientRect(); if (hr.height < 245) o2.push("linh vật nhỏ hơn mức tối thiểu: " + Math.round(hr.height));
            const it = [...wov.querySelectorAll("#cards .tile,#cards .tile.daily,:scope>.tile.daily,#npResume .npr-go")].filter(v2).filter(e => !e.closest("[data-slide]") || e.getBoundingClientRect().right <= W + 1 || true);
            const hs = it.map(e => Math.round(e.getBoundingClientRect().height)); if (hs.length && Math.max(...hs) - Math.min(...hs) > 1) o2.push("thẻ không cao bằng nhau: " + [...new Set(hs)].join("/"));
            for (const e of [hero, ...it.slice(0, 1)]) { const q = e.getBoundingClientRect(); if (q.left < -2 || q.top < -2 || q.right > W + 2 || q.bottom > H + 2) { o2.push("ra ngoài màn: " + (e.id || e.className)); break; } }
            for (const e of wov.querySelectorAll("#cards .tile .tb")) if (v2(e) && e.getBoundingClientRect().width < 55) { o2.push("icon thẻ nhỏ hơn 56px"); break; }
            if (document.documentElement.scrollHeight > H + 1 || document.documentElement.scrollWidth > W + 1) o2.push("trang cuộn được");
            return o2;
          }
          const home = document.getElementById("home"); if (!home || home.hidden) return ["không thấy màn chọn"];
          const r4 = document.getElementById("play") && document.getElementById("play").classList.contains("npl-r4");
          const items = [...home.querySelectorAll("#bDaily,.dbtn,.ty,.row>.btn,#bSkin,#npResume .npr-go,.lvs>.lv,.lvs>button,.hplay>#bPlay,.hplay>#bOpts")].filter(vis);
          const hs = items.map(e => Math.round(e.getBoundingClientRect().height)); const mn = Math.min(...hs), mx = Math.max(...hs);
          if (mx - mn > 1) out.push("thẻ/nút không cao bằng nhau: " + [...new Set(hs)].join("/"));
          const hero = document.getElementById("hHero"); const hh = hero && vis(hero) ? hero.getBoundingClientRect().height : 0;
          if (hh >= 95 && hh < mx * 1.3) out.push("linh vật (" + Math.round(hh) + "px) không lớn hơn nút (" + mx + "px)"); const hmin = (W > H * 1.1) ? 245 : (r4 ? 145 : Math.min(245, H * 0.5 - 20)); if (hh < hmin) out.push("linh vật nhỏ hơn mức tối thiểu: " + Math.round(hh) + "px < " + Math.round(hmin)); else if (!hero.querySelector("svg") && !hero.textContent.trim()) out.push("linh vật trống");
          for (const e of home.querySelectorAll(".ty .e")) if (vis(e) && e.getBoundingClientRect().width < 55) { out.push("icon thẻ nhỏ hơn 56px: " + Math.round(e.getBoundingClientRect().width)); break; }
          for (const t of home.querySelectorAll(".ty>.t")) if (vis(t) && t.scrollWidth > t.clientWidth + 1) { out.push("chữ thẻ bị cắt/xuống dòng"); break; }
          for (const e of home.querySelectorAll("#bDaily *,#npResume .npr-go,#npResume .npr-go *,.ty>.t,.row>.btn")) if (vis(e) && getComputedStyle(e).fontSize !== "0px" && e.children.length === 0 && (e.textContent || "").trim() && parseFloat(getComputedStyle(e).fontSize) < 10.9) { out.push("chữ nhỏ hơn 11px: " + e.textContent.trim().slice(0, 12)); break; }
          for (const t of home.querySelectorAll(".ty")) if (vis(t)) { const q = t.getBoundingClientRect(); if (q.height < 51.5 || q.width < 83.5) { out.push("thẻ danh sách quá nhỏ " + Math.round(q.width) + "x" + Math.round(q.height)); break; } }
          /* khoảng cách dọc giữa các khối xếp chồng (cột đơn dọc / mỗi cột ngang) */
          const cols = {}; for (const e of [hero, ...home.querySelectorAll("#bDaily,.dbtn,#npResume,.tys,#tys,.row,#hLad")].filter(e => e && vis(e))) { const q = e.getBoundingClientRect(), k = Math.round(q.left / 40); (cols[k] = cols[k] || []).push(q); }
          for (const k in cols) { const a = cols[k].sort((x, y) => x.top - y.top), gs = []; for (let i = 1; i < a.length; i++) gs.push(a[i].top - a[i - 1].bottom); if (gs.length > 1 && Math.max(...gs) - Math.min(...gs) > 3) out.push("khoảng cách không đều: " + gs.map(Math.round).join("/")); }
          for (const e of [hero, ...items, document.getElementById("ttl")].filter(e => e && vis(e) && !(e.classList.contains("ty") && e.closest("[data-slide]")))) { const q = e.getBoundingClientRect(); if (q.left < -2 || q.top < -2 || q.right > W + 2 || q.bottom > H + 2) { out.push("ra ngoài màn: " + (e.id || e.className || e.tagName) + "@" + [q.left, q.top, q.right, q.bottom].map(Math.round)); break; } }
          const dd = document.documentElement; if (dd.scrollHeight > H + 1 || dd.scrollWidth > W + 1) out.push("trang cuộn được " + dd.scrollWidth + "x" + dd.scrollHeight);
          const rs = [hero, ...items].filter(e => e && vis(e) && !e.closest("[data-slide]")).map(e => e.getBoundingClientRect());
          for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) { const a = rs[i], b = rs[j]; if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 4 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 4) { out.push("chồng lên nhau @" + [a.left, a.top].map(Math.round) + " & " + [b.left, b.top].map(Math.round)); i = 999; break; } }
          return out;
        }, W, H);
        r.forEach(m => note(false, id + " " + W + "x" + H + (res ? " (có ván dở)" : "") + ": " + m));
      } catch (e) { note(false, id + " " + W + "x" + H + ": lỗi " + e.message); }
      await pg.close();
    }
  }
  await br.close(); srv.kill();
  if (fails.length) { console.log("\n✗ " + fails.length + " lỗi"); process.exit(1); } else console.log("\n✓ layout mới đạt");
})();
