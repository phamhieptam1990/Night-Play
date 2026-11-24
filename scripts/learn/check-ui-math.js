/* Kiểm giao diện cho các kỹ năng Toán lớp 1–5 mới (câu có SVG, bảng, nhiều dòng, hàng emoji) bằng Chrome thật. Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/learn/check-ui-math.js [--shots <thư mục>]
   Mỗi kỹ năng × lớp × 2 cỡ màn hình dọc: ép trang hiện câu của kỹ năng đó, đo: không cuộn ngang/dọc cả trang, nội dung câu không tràn khung câu,
   4 nút đáp án nằm trọn trong màn hình và cao >= 44px. --shots: lưu ảnh từng câu để tự nhìn. Thoát mã 1 nếu có lỗi. */
"use strict";
const { spawn } = require("child_process"), path = require("path"), fs = require("fs"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.PORT || 8880, w = ms => new Promise(r => setTimeout(r, ms));
const si = process.argv.indexOf("--shots"), SHOTS = si > 0 ? process.argv[si + 1] : null; if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const E = require(path.join(root, "learn/engine.js"));
const NEW = ["place_value", "round_num", "expr_order", "unknown_num", "shape_id", "angle_type", "perimeter", "area_shape", "volume_box", "unit_convert", "measure_compare", "time_calc", "money_calc", "motion", "word_multi", "data_read", "fraction_of", "pattern_seq"];
const NEWL = ["letter_start", "syllable_blend", "spell_ngh", "spell_init", "word_class", "punct", "sent_type", "synonym", "antonym_pair", "idiom", "greeting_vi", "reading_story", "en_colors", "en_numbers", "en_topic_vocab", "en_meaning", "en_a_an", "en_plural", "en_present_s", "en_wh", "en_days", "en_spelling", "en_greeting", "en_reading"];
const LONLY = process.argv.includes("--lang-only"), HONLY = process.argv.includes("--hint-only"), VP = [[390, 844], [360, 640]], fails = []; const bad = m => { fails.push(m); console.log("  ✗ " + m); };
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await w(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  let n = 0;
  try {
    for (const sk of HONLY ? [] : LONLY ? NEWL : NEW.concat(NEWL)) for (const g of E.SKILLS[sk].grades) for (const [W, H] of VP) {
      n++; const tag = `${sk} lớp ${g} ${W}x${H}`, pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true });
      const errs = []; pg.on("pageerror", e => errs.push(e.message));
      await pg.goto(`http://localhost:${PORT}/learn/index.html?subj=${E.SKILLS[sk].subj}&grade=${g}&lang=vi&free=1`, { waitUntil: "networkidle0" });
      for (let k = 0; k < 6; k++) {
        await pg.evaluate((sk, g) => { bank = [0, 1, 2, 3, 4].map(() => E.make(sk, { lang: "vi", grade: g, used: {} })); cur = 0; tries = 0; locked = false; showQ(); }, sk, g); await w(500);
        const m = await pg.evaluate(() => {
          const d = document.documentElement, q = document.getElementById("q"), qt = document.getElementById("qt"), r = q.getBoundingClientRect(), t = qt.getBoundingClientRect(), bs = [...document.querySelectorAll("#ans .ab")].map(b => b.getBoundingClientRect());
          return { sx: d.scrollWidth > innerWidth + 1, sy: d.scrollHeight > innerHeight + 2, qOver: t.bottom > r.bottom + 1 || qt.scrollWidth > qt.clientWidth + 1 || q.scrollHeight > q.clientHeight + 2, qH: Math.round(r.height), nb: bs.length,
            btnOut: bs.some(b => b.bottom > innerHeight + 1 || b.right > innerWidth + 1 || b.left < -1), btnSmall: bs.some(b => b.height < 43), btnClip: [...document.querySelectorAll("#ans .ab")].filter(b => b.scrollHeight > b.clientHeight + 1 || b.scrollWidth > b.clientWidth + 1).map(b => b.textContent.trim()), fs: [...new Set([...document.querySelectorAll("#ans .ab")].map(b => getComputedStyle(b).fontSize))].length, ta: getComputedStyle(qt).textAlign, txt: qt.textContent.slice(0, 50) };
        });
        if (m.sx || m.sy) bad(`${tag}: trang cuộn (${m.sx ? "ngang" : ""}${m.sy ? " dọc" : ""}) | ${m.txt}`);
        if (m.qOver) bad(`${tag}: nội dung tràn khung câu hỏi (cao khung ${m.qH}px) | ${m.txt}`);
        if (m.ta !== "center") bad(`${tag}: câu hỏi chưa canh giữa (text-align: ${m.ta}) | ${m.txt}`); if (m.btnClip.length) bad(`${tag}: chữ đáp án tràn/bị cắt khỏi ô: ${m.btnClip.join(" | ")}`); if (m.fs > 1) bad(`${tag}: 4 ô đáp án không cùng cỡ chữ`); if (m.nb !== 4) bad(`${tag}: có ${m.nb} nút đáp án`); if (m.btnOut) bad(`${tag}: nút đáp án ngoài màn hình | ${m.txt}`); if (m.btnSmall) bad(`${tag}: nút đáp án < 44px`);
        if (SHOTS && k === 0) await pg.screenshot({ path: path.join(SHOTS, `${sk}-${g}-${W}x${H}.png`) });
        if (fails.some(f => f.startsWith(tag))) break;
      }
      if (errs.length) bad(`${tag}: lỗi JS ${errs[0]}`); await pg.close();
    }
    if (LONLY) throw new Error("__done__");
    /* nút gợi ý 💡: bấm qua 3 bậc, khung gợi ý không tràn, bậc 3 bỏ bớt 2 đáp án sai (chọn 1/4), ghép cặp gợi ý đúng ô đang chọn */
    for (const [W, H] of VP) {
      const pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true }); const errs = []; pg.on("pageerror", e => errs.push(e.message));
      await pg.goto(`http://localhost:${PORT}/learn/index.html?subj=toan&grade=3&lang=vi`, { waitUntil: "networkidle0" });
      const tag = `gợi ý ${W}x${H}`; n++;
      await pg.evaluate(() => { bank = [0, 1, 2, 3, 4].map(() => E.make("add20", { lang: "vi", grade: 3, used: {} })); bank[0] = { q: "242 + 187 = <em>?</em>", o: [{ v: "429", ok: 1 }, { v: "419" }, { v: "439" }, { v: "329" }], lab: "t", subj: "toan", skill: "add20", grade: 3 }; cur = 0; tries = 0; locked = false; showQ(); }); await w(900);
      const st = async () => pg.evaluate(() => { const b = document.getElementById("hintBox"), c = b.querySelector(".hcard"), r = c.getBoundingClientRect(); return { open: !b.hidden, steps: b.querySelectorAll(".hs").length, over: r.bottom > innerHeight + 1 || r.right > innerWidth + 1 || r.left < -1, off: [...document.querySelectorAll("#ans .ab")].filter(x => x.disabled).length, btn: !document.getElementById("hintBtn").hidden }; });
      let m = await st(); if (!m.btn) bad(`${tag}: không có nút 💡 cho câu 242 + 187`);
      for (let k = 1; k <= 3; k++) { if (k === 1) await pg.click("#hintBtn"); else await pg.click("#hintNext"); await w(150); m = await st(); if (!m.open || m.steps !== k) bad(`${tag}: bậc ${k}: mở=${m.open} số bậc=${m.steps}`); if (m.over) bad(`${tag}: khung gợi ý tràn màn hình ở bậc ${k}`); }
      if (m.off !== 2) bad(`${tag}: bậc 3 phải bỏ 2 đáp án sai, đang bỏ ${m.off}`);
      const bg = await pg.evaluate(() => { const c = document.querySelector("#hintBox .hcard"), cs = getComputedStyle(c), nums = (cs.backgroundImage.match(/rgb\(\s*\d+,\s*\d+,\s*\d+\)/g) || [cs.backgroundColor]).map(x => x.match(/\d+/g).slice(0, 3).map(Number)); const lum = nums.map(([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255); return { lum: lum.reduce((a, b) => a + b, 0) / lum.length, max: Math.max(...lum), n: nums.length }; });
      if (bg.max > 0.7 || bg.lum >= 0.45) bad(`${tag}: nền popup gợi ý quá sáng/trắng (độ sáng TB ${bg.lum.toFixed(2)}, cao nhất ${bg.max.toFixed(2)}): GAME_RULES 0a-33`);
      await pg.click("#hintOk"); await w(100); m = await st(); if (m.open) bad(`${tag}: bấm "Đã hiểu" không đóng khung`);
      if (SHOTS) { await pg.click("#hintBtn"); await w(150); await pg.screenshot({ path: path.join(SHOTS, `hint-${W}x${H}.png`) }); await pg.click("#hintOk"); }
      /* ghép cặp: chọn ô trái thứ 2 rồi bấm 💡: gợi ý phải là phép tính của ô đó */
      await pg.evaluate(() => { bank = [0, 1, 2, 3, 4].map(() => LearnTypes.make("match", "toan", 3, "vi")); bank[0].pairs = [["12 + 17", "29"], ["40 − 13", "27"], ["6 × 7", "42"], ["80 − 35", "45"]]; cur = 0; tries = 0; locked = false; showQ(); }); await w(900);
      const mh = await pg.evaluate(async () => { const tiles = [...document.querySelectorAll("#ans .qc")[0].querySelectorAll(".mc2")]; tiles[1].click(); document.getElementById("hintBtn").click(); return { shown: !document.getElementById("hintBtn").hidden, text: document.getElementById("hintBody").textContent }; });
      if (!mh.shown) bad(`${tag}: ghép cặp không có nút 💡`); else if (!/40|13|mượn|0 −|3/.test(mh.text)) bad(`${tag}: gợi ý ghép cặp không đúng ô đang chọn: ${mh.text.slice(0, 80)}`);
    /* gợi ý của câu KHÔNG phải phép tính (hint-texts.js): chọn 1/4 mờ 2 đáp án ở bậc 3; câu gõ số cho biết số chữ số */
    for (const [W, H] of VP) {
      const pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true }); const errs = []; pg.on("pageerror", e => errs.push(e.message)); n++;
      await pg.goto(`http://localhost:${PORT}/learn/index.html?subj=toan&grade=3&lang=vi`, { waitUntil: "networkidle0" });
      const run = async (label, setup, expect3) => {
        await pg.evaluate(setup); await w(700);
        const has = await pg.evaluate(() => !document.getElementById("hintBtn").hidden); if (!has) { bad(`gợi ý ${label} ${W}x${H}: không có nút 💡`); return; }
        for (let k = 1; k <= 3; k++) { await pg.click(k === 1 ? "#hintBtn" : "#hintNext"); await w(140); }
        const r = await pg.evaluate(() => ({ steps: document.querySelectorAll("#hintBody .hs").length, off: [...document.querySelectorAll("#ans .ab")].filter(x => x.disabled).length, t3: [...document.querySelectorAll("#hintBody .hs")].pop().textContent }));
        if (r.steps !== 3) bad(`gợi ý ${label} ${W}x${H}: cần 3 bậc, có ${r.steps}`); if (!expect3(r)) bad(`gợi ý ${label} ${W}x${H}: bậc 3 sai ("${r.t3.slice(0, 60)}", mờ ${r.off} đáp án)`);
        await pg.click("#hintOk"); await w(100);
      };
      await run("chu vi (chọn 1/4)", () => { const q = E.make("perimeter", { lang: "vi", grade: 3, used: {} }); bank = [q, q, q, q, q]; cur = 0; tries = 0; locked = false; showQ(); }, r => r.off === 2 && /mờ/.test(r.t3));
      await run("chu vi (gõ số)", () => { const q = E.make("perimeter", { lang: "vi", grade: 3, used: {} }), t = LearnTypes.asTypein(q, "vi"); bank = [t, t, t, t, t]; cur = 0; tries = 0; locked = false; showQ(); }, r => /chữ số/.test(r.t3));
      await run("từ loại (Tiếng Việt)", () => { const q = E.make("word_class", { lang: "vi", grade: 3, used: {} }); bank = [q, q, q, q, q]; cur = 0; tries = 0; locked = false; showQ(); }, r => r.off === 2);
      await run("số nhiều (Tiếng Anh)", () => { const q = E.make("en_plural", { lang: "vi", grade: 3, used: {} }); bank = [q, q, q, q, q]; cur = 0; tries = 0; locked = false; showQ(); }, r => r.off === 2);
      if (errs.length) bad(`gợi ý tĩnh ${W}x${H}: lỗi JS ${errs[0]}`); await pg.close();
    }
      if (errs.length) bad(`${tag}: lỗi JS ${errs[0]}`); await pg.close();
    }
    /* ô đáp án chữ DÀI: không tràn/bị cắt khỏi ô, 4 ô cùng cỡ chữ (trường hợp xấu nhất, 2 cỡ màn) */
    for (const [W, H] of VP) for (const set of [["khối hộp chữ nhật", "khối lập phương", "khối trụ", "khối cầu"], ["4 chục 7 đơn vị", "7 chục 4 đơn vị", "5 chục 7 đơn vị", "4 chục 8 đơn vị"], ["12 giờ 45 phút", "1 giờ 45 phút", "2 giờ 15 phút", "12 giờ 15 phút"], ["1000000 đồng", "100000 đồng", "10000 đồng", "999999 đồng"], ["Thứ Năm", "Chủ nhật", "Thứ Sáu", "Thứ Bảy"], ["hình chữ nhật", "hình tam giác", "hình vuông", "hình tròn"]]) {
      const tag = `đáp án dài [${set[0]}…] ${W}x${H}`, pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true }); n++;
      await pg.goto(`http://localhost:${PORT}/learn/index.html?subj=toan&grade=2&lang=vi`, { waitUntil: "networkidle0" });
      await pg.evaluate(set => { bank = [0, 1, 2, 3, 4].map(() => ({ q: "Chọn đáp án đúng?", o: set.map((v, i) => ({ v, ok: i === 0 ? 1 : undefined })), lab: "t", subj: "toan", skill: "add10", grade: 2 })); cur = 0; tries = 0; locked = false; showQ(); }, set); await w(1000);
      const m = await pg.evaluate(() => { const bs = [...document.querySelectorAll("#ans .ab")]; return { clip: bs.filter(b => b.scrollHeight > b.clientHeight + 1 || b.scrollWidth > b.clientWidth + 1).map(b => b.textContent), fs: [...new Set(bs.map(b => getComputedStyle(b).fontSize))], min: Math.min(...bs.map(b => parseFloat(getComputedStyle(b).fontSize))) }; });
      if (m.clip.length) bad(`${tag}: chữ tràn/bị cắt: ${m.clip.join(" | ")}`); if (m.fs.length > 1) bad(`${tag}: 4 ô khác cỡ chữ: ${m.fs.join(", ")}`); if (m.min < 12) bad(`${tag}: chữ đáp án quá nhỏ (${m.min}px)`);
      if (SHOTS && set[0].startsWith("khối")) await pg.screenshot({ path: path.join(SHOTS, `ans-long-${W}x${H}.png`) }); await pg.close();
    }
    /* câu có hình (SVG, bảng) ở kiểu Bắn bong bóng: khung câu thấp, hình phải co lại, chữ không bị nhãn đè, không tràn */
    for (const [W, H] of VP) for (const [sk, g] of [["shape_id", 1], ["shape_id", 2], ["angle_type", 4], ["data_read", 2], ["data_read", 4], ["pattern_seq", 1]]) {
      const tag = `bong bóng ${sk} lớp ${g} ${W}x${H}`, pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true }); n++;
      await pg.goto(`http://localhost:${PORT}/learn/index.html?subj=toan&grade=${g}&lang=vi&free=1`, { waitUntil: "networkidle0" });
      await pg.evaluate((sk, g) => { bank = [0, 1, 2, 3, 4].map(() => { const q = E.make(sk, { lang: "vi", grade: g, used: {} }); return LearnTypes.asPop(q, "vi") || q; }); cur = 0; tries = 0; locked = false; showQ(); }, sk, g); await w(900);
      const m = await pg.evaluate(() => { const q = document.getElementById("q"), h = document.getElementById("qt"), l = document.getElementById("ql"), sv = h.querySelector("svg"), hr = h.getBoundingClientRect(), qr = q.getBoundingClientRect(), lr = l.getBoundingClientRect(); return { kind: document.getElementById("ans").dataset.k, under: hr.top < lr.bottom - 2, dbg: "chữ cách đỉnh khung " + Math.round(hr.top - qr.top) + "px, mép dưới nhãn " + Math.round(lr.bottom - qr.top) + "px, cao khung " + Math.round(qr.height) + "px, chữ " + h.offsetHeight + "px", out: hr.bottom > qr.bottom + 1, ac: (a => a.scrollHeight > a.clientHeight + 3)(document.getElementById("ans")), ah: Math.round(document.getElementById("ans").getBoundingClientRect().height), fs: parseFloat(getComputedStyle(h).fontSize), sv: sv ? Math.round(sv.getBoundingClientRect().height) : null, txt: h.textContent.slice(0, 40) }; });
      if (m.ac) bad(`${tag}: vùng bong bóng (đáp án) bị cắt, cao chỉ ${m.ah}px`); if (m.under) bad(`${tag}: chữ câu hỏi bị nhãn đè lên ("${m.txt}"): ${m.dbg}, hình ${m.sv}px, chữ ${m.fs}px`); if (m.out) bad(`${tag}: nội dung tràn ra ngoài khung câu`); if (m.fs < 15) bad(`${tag}: chữ câu hỏi quá nhỏ (${m.fs}px)`); if (m.sv !== null && m.sv < 44) bad(`${tag}: hình quá nhỏ (${m.sv}px)`);
      if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, `pop-${sk}-${g}-${W}x${H}.png`) }); await pg.close();
    }
    /* câu so sánh < = >: ba nút phải CÙNG MỘT HÀNG (bé khó nhìn nếu rớt xuống hàng dưới) ở mọi lớp và cỡ màn, kể cả màn ngang */
    for (const [W, H] of [...VP, [844, 390]]) for (const g of [1, 2, 3, 4, 5]) {
      const tag = `so sánh lớp ${g} ${W}x${H}`, pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true }); n++;
      await pg.goto(`http://localhost:${PORT}/learn/index.html?subj=toan&grade=${g}&lang=vi&qk=compare`, { waitUntil: "networkidle0" }); await w(700);
      const m = await pg.evaluate(() => { const bs = [...document.querySelectorAll("#ans .ab")].map(b => b.getBoundingClientRect()); return { n: bs.length, rows: new Set(bs.map(b => Math.round(b.top))).size, txt: [...document.querySelectorAll("#ans .ab")].map(b => b.textContent).join(" "), k: document.getElementById("ans").dataset.k }; });
      const ln = await pg.evaluate(() => { const h = document.getElementById("qt"), lh = parseFloat(getComputedStyle(h).lineHeight) || parseFloat(getComputedStyle(h).fontSize) * 1.15; return { lines: Math.round(h.clientHeight / lh), txt: h.textContent, fit: h.scrollWidth <= h.clientWidth + 1 }; });
      if (ln.lines > 1 || !ln.fit) bad(`${tag}: câu hỏi "${ln.txt}" bị ngắt ${ln.lines} hàng hoặc tràn ngang (phải một hàng, tự co chữ)`);
      if (m.n !== 3 || m.rows !== 1) bad(`${tag}: ${m.n} nút nằm trên ${m.rows} hàng (kiểu ${m.k}, "${m.txt}")`);
      if (SHOTS && g === 3) await pg.screenshot({ path: path.join(SHOTS, `compare-${W}x${H}.png`) }); await pg.close();
    }
    /* màn kết thúc, bảng chọn môn/lớp, hộp thông tin: nền màu (không trắng), chữ đọc được, không tràn (GAME_RULES 0a-33) */
    for (const [W, H] of VP) for (const which of ["res", "sheet", "info"]) {
      const tag = `thẻ ${which} ${W}x${H}`, pg = await br.newPage(); await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true }); const errs = []; pg.on("pageerror", e => errs.push(e.message)); n++;
      await pg.goto(`http://localhost:${PORT}/learn/index.html?subj=toan&grade=3&lang=vi`, { waitUntil: "networkidle0" });
      await pg.evaluate(w2 => { document.querySelectorAll(".ov").forEach(o => { o.hidden = true; }); if (w2 === "res") { bank.forEach(b => { b.res = "ok"; }); stars = 5; roundStars = 5; streak = 5; best = 5; try { finish(); } catch (e) {} } else if (w2 === "sheet") { try { sheet(); } catch (e) { document.getElementById("sheet").hidden = false; } } else { const i = document.getElementById("info"); i.hidden = false; try { const o = document.querySelector("[data-info],#infoBtn,.fi"); if (o) o.click(); } catch (e) {} } }, which); await w(1200);
      const m = await pg.evaluate(w2 => { const o = document.getElementById(w2), c = o.querySelector(".card"); if (!c || o.hidden) return { skip: true }; const cs = getComputedStyle(c), nums = (cs.backgroundImage.match(/rgb\(\s*\d+,\s*\d+,\s*\d+\)/g) || [cs.backgroundColor]).map(x => x.match(/\d+/g).slice(0, 3).map(Number)), lum = nums.map(([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255), r = c.getBoundingClientRect(), sx = c.scrollWidth > c.clientWidth + 1; return { skip: false, avg: lum.reduce((a, b) => a + b, 0) / lum.length, max: Math.max(...lum), out: r.right > innerWidth + 1 || r.left < -1, sx }; }, which);
      if (m.skip) { console.log(`  (bỏ qua ${tag}: không mở được)`); await pg.close(); continue; }
      if (m.max > 0.7 || m.avg >= 0.45) bad(`${tag}: nền thẻ quá sáng/trắng (TB ${m.avg.toFixed(2)}, cao nhất ${m.max.toFixed(2)}): GAME_RULES 0a-33`);
      if (m.out || m.sx) bad(`${tag}: thẻ tràn ngang`);
      if (which === "res") { const cx = await pg.evaluate(() => { const c = document.querySelector("#res .card").getBoundingClientRect(), x = document.getElementById("resX"); if (!x) return null; const r = x.getBoundingClientRect(), ch = document.getElementById("change").getBoundingClientRect(); return { corner: r.top - c.top < 30 && c.right - r.right < 30, size: Math.round(r.width), overlap: !(ch.right <= r.left + 1 || ch.left >= r.right - 1) }; });
        if (!cx) bad(`${tag}: popup cuối bài thiếu nút đóng ✕`); else if (!cx.corner || cx.size < 44 || cx.overlap) bad(`${tag}: nút ✕ phải ở góc trên-phải, >= 44px, không đè nút ⚙️ (góc=${cx.corner}, rộng=${cx.size}, đè=${cx.overlap})`); }
      if (which === "res") { const g = await pg.evaluate(() => { const c = document.querySelector("#res .card").getBoundingClientRect(), x = document.getElementById("change").getBoundingClientRect(), a = document.getElementById("again").getBoundingClientRect(); return { corner: x.top - c.top < 70 && c.right - x.right < 120, size: Math.round(x.width), small: x.width <= 56, rowBelow: x.top > a.top - 2 }; });
        if (!g.corner || !g.small || g.rowBelow) bad(`${tag}: nút ⚙️ phải là nút nhỏ ở góc trên-phải thẻ (góc=${g.corner}, rộng=${g.size}px, nằm dưới nút Chơi tiếp=${g.rowBelow})`); }
      if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, `card-${which}-${W}x${H}.png`) });
      if (which === "res") { await pg.click("#resX"); await w(500); const closed = await pg.evaluate(() => document.getElementById("res").hidden); if (!closed) bad(`${tag}: bấm ✕ không đóng popup`); }
      if (errs.length) bad(`${tag}: lỗi JS ${errs[0]}`); await pg.close();
    }
  } catch (e) { if (e.message !== "__done__") throw e; } finally { await br.close(); srv.kill(); }
  console.log(fails.length ? `\n✗ ${fails.length} lỗi giao diện (${n} tổ hợp)` : `\n✓ giao diện kỹ năng Toán mới đạt (${n} tổ hợp)`); process.exit(fails.length ? 1 : 0);
})();
