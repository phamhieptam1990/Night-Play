/* Kiểm giao diện trang phụ huynh (learn/parent/index.html) bằng Chrome thật, với dữ liệu giả có thật. Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/learn/check-parent-ui.js [--shots <thư mục>]
   Mỗi cỡ màn (390x844, 360x640, 768x1024) × sáng/tối × 3 môn: không cuộn ngang, mọi nút/chip/tóm tắt >= 44px, chữ không bị cắt trong thẻ,
   có đủ các mục: Mục tiêu đạt được (vòng %, chọn lớp, chủ đề mở được, nên luyện tiếp), Bé đã học gì (theo ngày, 💡 gợi ý), tắt/xoá chi tiết hoạt động.
   Thoát mã 1 nếu có lỗi. */
"use strict";
const { spawn } = require("child_process"), path = require("path"), fs = require("fs"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.PORT || 8883, w = ms => new Promise(r => setTimeout(r, ms));
const si = process.argv.indexOf("--shots"), SHOTS = si > 0 ? process.argv[si + 1] : null; if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const E = require(path.join(root, "learn/engine.js"));
const fails = []; const bad = m => { fails.push(m); console.log("  ✗ " + m); };

/* dữ liệu giả: bé lớp 3, đã luyện nhiều kỹ năng Toán, vài kỹ năng Việt/Anh, nhiều ngày, có xem gợi ý */
const mem = {}; E.use({ get: k => (k in mem ? mem[k] : null), set: (k, v) => { mem[k] = v; } });
const R = (subj, id, n, okN, tag) => { for (let i = 0; i < n; i++) E.record(subj, id, i < okN, i < okN ? undefined : tag, { kind: i % 3 === 0 ? "typein" : "mc" }); };
R("toan", "times69", 12, 11, "table_confuse"); R("toan", "div69", 9, 8, "table_confuse"); R("toan", "perimeter", 6, 4, "formula_confuse"); R("toan", "area_shape", 8, 4, "formula_confuse"); R("toan", "unit_convert", 5, 2, "unit_convert");
R("toan", "word_multi", 4, 1, "wrong_op"); R("toan", "data_read", 10, 10); R("toan", "fraction_of", 3, 3); R("toan", "count_obj", 5, 5); R("toan", "add20", 14, 14); R("tviet", "tone", 7, 5, "tone"); R("tviet", "spell_chtr", 6, 6); R("tanh", "vocab_things", 4, 4);
const dk = {}; const day = i => { const d = new Date(); d.setDate(d.getDate() - i); const z = x => String(x).padStart(2, "0"); return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); };
dk[day(0)] = { toan: { times69: [8, 7, 1], perimeter: [5, 3, 4], area_shape: [4, 2, 3], data_read: [3, 3, 0] }, tviet: { tone: [4, 3, 0] } };
dk[day(1)] = { toan: { div69: [6, 5, 0], unit_convert: [5, 2, 4], word_multi: [3, 1, 3], add20: [10, 10, 0] } };
dk[day(3)] = { toan: { fraction_of: [3, 3, 0], area_shape: [4, 2, 2] }, tanh: { vocab_things: [4, 4, 0] } };
mem["learn:dayk"] = JSON.stringify(dk);
const dayJ = {}; for (let i = 0; i < 7; i++) { const n = [24, 31, 0, 12, 0, 0, 7][i]; if (n) dayJ[day(i)] = { n, ok: Math.round(n * .8), s: { toan: n } }; } mem["learn:day"] = JSON.stringify(dayJ);
mem["learn:grade"] = "3";

(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await w(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let n = 0;
  try {
    for (const [W, H] of (process.env.ONLY ? [process.env.ONLY.split("x").map(Number)] : [[390, 844], [360, 640], [768, 1024]])) for (const theme of ["light", "dark"]) for (const subj of ["toan", "tviet", "tanh"]) {
      n++; const tag = `phụ huynh ${subj} ${W}x${H} ${theme}`, pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true }); const errs = []; pg.on("pageerror", e => errs.push(e.message));
      await pg.evaluateOnNewDocument((m, th, sj) => { try { for (const k in m) localStorage.setItem(k, m[k]); localStorage.setItem("theme", th); localStorage.setItem("learn:subj", sj); sessionStorage.setItem("learn:pg", String(Date.now())); } catch (e) {} }, mem, theme, subj);
      await pg.goto(`http://localhost:${PORT}/learn/parent/index.html?lang=vi`, { waitUntil: "networkidle0" }); await w(500);
      const m = await pg.evaluate(() => {
        const d = document.documentElement, q = s => document.querySelector(s), all = s => [...document.querySelectorAll(s)];
        const small = all("#dash button, #dash summary, #dash .chip, #dash .tab").filter(b => { const r = b.getBoundingClientRect(); return r.width > 0 && (r.height < 43 || r.width < 43); }).map(b => (b.textContent || "").trim().slice(0, 24));
        const clip = all("#dash .tpc, #dash .dayc, #dash .hero .tx, #dash .sc, #dash .pill").filter(e => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== "visible" ).map(e => e.className + ":" + (e.textContent || "").trim().slice(0, 20));
        const wide = all("#dash *").filter(e => !e.closest(".snav")).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1); }).slice(0, 4).map(e => e.className + ":" + (e.textContent || "").trim().slice(0, 18));
        const lumOf = bg => { const t = (bg.match(/rgba?\([^)]*\)/g) || []).map(x => x.match(/[\d.]+/g).map(Number)).filter(a => (a[3] === undefined ? 1 : a[3]) >= 0.9); return t.length ? t.map(([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) : null; };
        const whites = all("#dash .card, #dash .tile, #dash .tpc, #dash .dayc, #dash .wk, #dash .nxt, #dash .ok, #dash .empty, #dash .hbx, #dash .hero, #dash .gsel button, #dash .tab, #dash #exit, .top .ib").filter(e => { const r = e.getBoundingClientRect(); if (!r.width) return false; const cs = getComputedStyle(e), l = lumOf(cs.backgroundImage + " " + cs.backgroundColor); return l && (Math.max(...l) > 0.78 || l.reduce((a, b) => a + b, 0) / l.length > 0.5) && !e.matches("[aria-pressed=true]"); }).map(e => e.className + ":" + (e.textContent || "").trim().slice(0, 14));
        const reps = ["#s-ov", "#s-goals", "#s-learned", "#s-weak", "#s-map", "#s-limit", "#s-set"].map(s2 => q(s2)).filter(Boolean).map(e => getComputedStyle(e).backgroundImage);
        /* nội dung trong thẻ mục phải nằm trong LỀ của thẻ (>= 12px mỗi bên), không lấn ra mép hay bị cắt */
        const spill = []; all("#dash .sec").forEach(sec => { const sr = sec.getBoundingClientRect(); [...sec.querySelectorAll("*")].forEach(e => { if (e.closest(".snav") || e.matches("svg *, path, circle, defs *")) return; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); if (!r.width || !r.height || cs.visibility === "hidden" || cs.display === "none") return; if (r.left < sr.left + 12 - 0.5 || r.right > sr.right - 12 + 0.5) spill.push((e.id || e.className.toString().split(" ")[0] || e.tagName) + "@" + sec.id.replace("s-", "") + ":" + Math.round(r.left - sr.left) + "/" + Math.round(sr.right - r.right) + ":" + (e.textContent || "").trim().slice(0, 10)); }); });
        /* các hàng trong thẻ phải ĐỀU: lề trên/dưới = 0, đệm trên = đệm dưới, và khoảng từ chữ tới đường kẻ trên/dưới bằng nhau */
        const uneven = []; all("#dash .sec .wk, #dash .sec .tpc:not(.soon), #dash .sec .dayc").forEach(e => { const cs = getComputedStyle(e); if (parseFloat(cs.marginTop) || parseFloat(cs.marginBottom)) uneven.push("lề " + e.className.toString().slice(0, 10)); if (Math.abs(parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)) > 1) uneven.push("đệm " + e.className.toString().slice(0, 10)); });
        const nested = all("#dash .sec .card, #dash .sec .tpc, #dash .sec .dayc, #dash .sec .wk").filter(e => { const cs = getComputedStyle(e); return cs.backgroundImage !== "none" || (cs.boxShadow !== "none" && cs.boxShadow !== "") || (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent"); }).map(e => e.className.toString().slice(0, 18)), loose = ["h1o", "h2g", "h2d", "h2m", "h2w", "h2l", "h2s"].filter(id => { const h = document.getElementById(id); return !h || !h.closest("#dash .sec") || getComputedStyle(h.closest(".sec")).backgroundImage === "none"; });
        return { whites, nested, loose, uneven: [...new Set(uneven)].slice(0, 6), spill: [...new Set(spill)].slice(0, 12), kinds: new Set(reps).size, empties: ["map", "weak", "limit", "set"].filter(id => !document.getElementById(id).textContent.trim()), sx: d.scrollWidth > innerWidth + 1, small, clip, wide, hero: !!q(".hero"), ring: q(".ring b") && q(".ring b").textContent, gsel: all(".gsel button").length, topics: all(".tpc").length, next: !!q(".nxt") || !!q("#goals .ok"), days: all(".dayc").length, hint: all(".sc .hn").length, m4lg: !!q(".m4lg") && all(".m4lg span").length === 4, m4dots: all(".sk2 .m4").length, m4pill: all(".sk2 .pill[data-m]").length, hbx: !!q(".hbx"), dkOff: !!q("#dkOff"), dkClr: !!q("#dkClr"), bg: getComputedStyle(q(".hero")).backgroundImage.slice(0, 20) };
      });
      if (m.whites.length) bad(`${tag}: còn thẻ/nút nền trắng hoặc quá sáng: ${m.whites.slice(0, 4).join(" | ")}`); if (m.kinds < 6) bad(`${tag}: các mục chưa đủ khác màu (${m.kinds} màu khác nhau trên 7 mục, cần >= 6)`); if (m.uneven.length) bad(`${tag}: các hàng trong thẻ chưa đều (${m.uneven.join(", ")})`); if (m.spill.length) bad(`${tag}: nội dung lấn ra ngoài lề thẻ (trái/phải px): ${m.spill.join(" | ")}`); if (m.nested.length) bad(`${tag}: còn thẻ lồng trong thẻ mục (mỗi mục chỉ một thẻ): ${m.nested.slice(0, 4).join(" | ")}`); if (m.loose.length) bad(`${tag}: mục không nằm trong thẻ: ${m.loose.join(", ")}`);
      if (m.empties.length) bad(`${tag}: mục trống (lỗi JS làm dừng vẽ): ${m.empties.join(", ")}`); if (m.sx) bad(`${tag}: trang cuộn ngang`); if (m.wide.length) bad(`${tag}: phần tử tràn ra ngoài màn: ${m.wide.join(" | ")}`); if (m.small.length) bad(`${tag}: nút nhỏ hơn 44px: ${m.small.join(" | ")}`); if (m.clip.length) bad(`${tag}: chữ bị cắt: ${m.clip.join(" | ")}`);
      if (!m.m4lg) bad(`${tag}: thiếu chú giải 4 bậc thành thạo`); if (!m.m4dots || m.m4dots !== m.m4pill) bad(`${tag}: mỗi kỹ năng phải có nhãn và 4 chấm mức thành thạo (nhãn ${m.m4pill}, chấm ${m.m4dots})`); if (!m.hero || !m.ring) bad(`${tag}: thiếu thẻ tổng quan tiến độ`); if (m.gsel !== 5) bad(`${tag}: thiếu ô chọn lớp (${m.gsel})`); if (!m.topics) bad(`${tag}: không có chủ đề`); if (!m.next) bad(`${tag}: thiếu mục nên luyện tiếp`);
      if (subj === "toan") { if (m.days < 3) bad(`${tag}: lịch sử ngày chỉ ${m.days} thẻ (cần >= 3)`); if (!m.hint) bad(`${tag}: không thấy 💡 số lần xem gợi ý`); if (!m.hbx) bad(`${tag}: thiếu khối "bé hay cần gợi ý ở"`); if (!m.dkOff || !m.dkClr) bad(`${tag}: thiếu nút tắt/xoá chi tiết`); }
      if (SHOTS && theme === "light" && W !== 768) { await pg.screenshot({ path: path.join(SHOTS, `parent-${subj}-${W}x${H}.png`), fullPage: true }); }
      if (SHOTS && theme === "dark" && subj === "toan" && W === 390) await pg.screenshot({ path: path.join(SHOTS, `parent-dark-390.png`), fullPage: true });
      if (errs.length) bad(`${tag}: lỗi JS ${errs[0]}`); await pg.close();
    }
    /* menu nhảy nhanh + tiêu đề mục + bố cục rộng: màn nhỏ (cuộn một cột) và màn rộng (full width, hai cột) */
    for (const [W, H] of [[390, 844], [1280, 900], [1600, 1000]]) {
      const np = await br.newPage(); await np.setViewport({ width: W, height: H, hasTouch: W < 800, isMobile: W < 800 }); n++; const tag = `menu ${W}x${H}`, errs = []; np.on("pageerror", e => errs.push(e.message));
      await np.evaluateOnNewDocument(m => { try { for (const k in m) localStorage.setItem(k, m[k]); localStorage.setItem("theme", "light"); localStorage.setItem("learn:subj", "toan"); sessionStorage.setItem("learn:pg", String(Date.now())); } catch (e) {} }, mem);
      await np.goto(`http://localhost:${PORT}/learn/parent/index.html?lang=vi`, { waitUntil: "networkidle0" }); await w(500);
      const m = await np.evaluate(() => { const links = [...document.querySelectorAll("#snav .sn")], nv = document.getElementById("snav"), cs = getComputedStyle(nv), h2 = document.getElementById("h2g"), hs = getComputedStyle(h2), g = document.getElementById("goals").getBoundingClientRect(), l = document.getElementById("learned").getBoundingClientRect(), secs = [...document.querySelectorAll(".cols>.sec")].map(e => e.getBoundingClientRect()), mid = innerWidth / 2, lh = Math.max(...secs.filter(r => r.left < mid).map(r => r.bottom)), rh = Math.max(...secs.filter(r => r.left >= mid).map(r => r.bottom)), wr = document.querySelector(".wrap").getBoundingClientRect();
        return { n: links.length, targets: links.every(a => document.getElementById(a.dataset.t)), sticky: cs.position === "sticky", minH: Math.min(...links.map(a => a.getBoundingClientRect().height)), h2fs: parseFloat(hs.fontSize), h2w: hs.fontWeight, cols: Math.abs(g.left - l.left) > 100, sideBySide: secs.some(r => r.left < mid - 50) && secs.some(r => r.left > mid - 50), balance: Math.abs(lh - rh) / Math.max(lh, rh), wrapW: Math.round(wr.width), vw: innerWidth, sx: document.documentElement.scrollWidth > innerWidth + 1, cur0: document.querySelector("#snav .sn[aria-current=true]") && document.querySelector("#snav .sn[aria-current=true]").dataset.t }; });
      if (m.n !== 7 || !m.targets) bad(`${tag}: menu phải có 7 liên kết trỏ đúng mục (có ${m.n}, đủ đích=${m.targets})`); if (!m.sticky) bad(`${tag}: menu không dính khi cuộn`); if (m.minH < 43) bad(`${tag}: nút menu thấp hơn 44px (${m.minH})`);
      if (m.h2fs < 20 || +m.h2w < 800) bad(`${tag}: tiêu đề mục chưa đủ rõ (cỡ ${m.h2fs}px, đậm ${m.h2w})`); if (m.sx) bad(`${tag}: trang cuộn ngang`);
      if (W >= 1000) { if (!m.sideBySide) bad(`${tag}: màn rộng phải chia hai cột`); if (m.balance > 0.35) bad(`${tag}: hai cột lệch nhau ${Math.round(m.balance * 100)}% chiều cao (cần <= 35%)`); if (m.wrapW < Math.min(W - 80, 1100)) bad(`${tag}: nội dung chưa tận dụng chiều ngang (rộng ${m.wrapW}px / màn ${W}px)`); }
      /* bấm menu: cuộn tới đúng mục và mục đó sáng lên */
      for (const t of ["s-learned", "s-set", "s-goals"]) { await np.evaluate(id => document.querySelector(`#snav .sn[data-t="${id}"]`).click(), t); await w(900);
        const r = await np.evaluate(id => { const e = document.getElementById(id).getBoundingClientRect(), hh = document.querySelector(".top").getBoundingClientRect().height, nvh = document.getElementById("snav").getBoundingClientRect().height, atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4; return { top: Math.round(e.top), hh: Math.round(hh + nvh), cur: document.querySelector("#snav .sn[aria-current=true]").dataset.t, atBottom }; }, t);
        if (!(r.top >= r.hh - 40 && (r.top <= r.hh + 140 || r.atBottom))) bad(`${tag}: bấm "${t}" chưa cuộn tới đúng chỗ (mép trên mục ở ${r.top}px, vùng dính cao ${r.hh}px)`); if (r.cur !== t) bad(`${tag}: bấm "${t}" nhưng mục sáng là ${r.cur}`); }
      if (SHOTS) { await np.evaluate(() => window.scrollTo(0, 0)); await w(300); await np.screenshot({ path: path.join(SHOTS, `parent-menu-${W}.png`) }); if (W === 1280) { await np.evaluate(() => document.getElementById("s-goals").scrollIntoView()); await w(500); await np.screenshot({ path: path.join(SHOTS, `parent-wide-goals.png`) }); await np.screenshot({ path: path.join(SHOTS, `parent-wide-full.png`), fullPage: true }); } }
      if (errs.length) bad(`${tag}: lỗi JS ${errs[0]}`); await np.close();
    }
    /* hover (chuột thật, giao diện SÁNG và TỐI): nền vẫn tối/màu và chữ vẫn đủ tương phản (lỗi cũ: nền trắng + chữ trắng) */
    for (const theme of ["light", "dark"]) {
      const hp = await br.newPage(); await hp.setViewport({ width: 1100, height: 1000 }); n++;
      await hp.evaluateOnNewDocument((m, th) => { try { for (const k in m) localStorage.setItem(k, m[k]); localStorage.setItem("theme", th); localStorage.setItem("learn:subj", "toan"); sessionStorage.setItem("learn:pg", String(Date.now())); } catch (e) {} }, mem, theme);
      await hp.goto(`http://localhost:${PORT}/learn/parent/index.html?lang=vi`, { waitUntil: "networkidle0" }); await w(400);
      for (const sel of ["#tabs .tab:nth-child(1)", "#tabs .tab:nth-child(2)", ".gsel button:nth-child(2)", ".gsel button:nth-child(3)", ".top .ib", "#theme", "#exit", ".chip"]) {
        const el = await hp.$(sel); if (!el) continue; await el.evaluate(e => e.scrollIntoView({ block: "center" })); await hp.hover(sel); await w(260);
        const r = await hp.evaluate(s2 => { const e = document.querySelector(s2), cs = getComputedStyle(e), nums = x => (x.match(/rgba?\([^)]*\)/g) || []).map(t => t.match(/[\d.]+/g).map(Number)).filter(a => (a[3] === undefined ? 1 : a[3]) >= 0.9), L = a => (0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]) / 255; const bg = nums(cs.backgroundImage + " " + cs.backgroundColor), fg = nums(cs.color)[0] || [0, 0, 0]; const bl = bg.length ? bg.map(L).reduce((a, b) => a + b, 0) / bg.length : null; return { bl, fl: L(fg), tx: (e.textContent || "").trim().slice(0, 14) }; }, sel);
        if (r.bl === null) { bad(`hover ${theme} ${sel}: không đọc được nền`); continue; }
        if (Math.abs(r.fl - r.bl) < 0.35) bad(`hover ${theme} ${sel} ("${r.tx}"): chữ và nền gần như cùng độ sáng khi rê chuột (nền ${r.bl.toFixed(2)}, chữ ${r.fl.toFixed(2)})`);
      }
      await hp.close();
    }
    /* mở một chủ đề, chọn lớp khác, tắt rồi bật ghi chi tiết, xoá */
    const pg = await br.newPage(); await pg.setViewport({ width: 390, height: 844, hasTouch: true, isMobile: true }); n++;
    await pg.evaluateOnNewDocument(m => { try { for (const k in m) localStorage.setItem(k, m[k]); sessionStorage.setItem("learn:pg", String(Date.now())); localStorage.setItem("learn:subj", "toan"); } catch (e) {} }, mem);
    await pg.goto(`http://localhost:${PORT}/learn/parent/index.html?lang=vi`, { waitUntil: "networkidle0" }); await w(400);
    const i1 = await pg.evaluate(() => { const t = document.querySelector(".tpc"); t.querySelector("summary").click(); return { open: t.open, skills: t.querySelectorAll(".sk2").length }; }); if (!i1.open || !i1.skills) bad("bấm chủ đề không mở ra danh sách kỹ năng");
    const g1 = await pg.evaluate(() => { document.querySelector('.gsel [data-g="5"]').click(); const h = document.querySelector(".hero h3").textContent; return h; }); if (!/5/.test(g1)) bad(`chọn lớp 5 nhưng tiêu đề là "${g1}"`);
    await pg.evaluate(() => document.getElementById("dkOff").click()); const off = await pg.evaluate(() => ({ btn: !!document.getElementById("dkOn"), days: document.querySelectorAll(".dayc").length, stored: localStorage.getItem("learn:dayk") })); if (!off.btn || off.days) bad("tắt ghi chi tiết: phải ẩn lịch sử và hiện nút Bật lại"); if (off.stored !== "{}") bad("tắt ghi chi tiết phải xoá dữ liệu chi tiết đã lưu");
    await pg.evaluate(() => document.getElementById("dkOn").click()); const on = await pg.evaluate(() => ({ off: !!document.getElementById("dkOff") })); if (!on.off) bad("bật lại ghi chi tiết không hiện nút Tắt");
    await pg.close();
  } finally { await br.close(); srv.kill(); }
  console.log(fails.length ? `\n✗ ${fails.length} lỗi giao diện phụ huynh (${n} tổ hợp)` : `\n✓ trang phụ huynh đạt (${n} tổ hợp)`); process.exit(fails.length ? 1 : 0);
})();
