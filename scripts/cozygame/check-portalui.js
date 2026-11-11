/* BÀI ĐO GIAO DIỆN HAI TRANG CỔNG (Night Play + Pop Play): thẻ Hôm nay, Chơi tiếp, huy hiệu Mới / 👑, chip lọc chủ đề, Pop đơn giản cho bé.
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-portalui.js [--quick] [--shots=<thư mục ảnh>]   (tự chạy http.server cổng NP_PORT hoặc 8896)
   Tĩnh (Node): shared/newbadge.js == bản sinh từ landing/moi/launches.json; mọi game Cozy trong multi-games.js có cờ pro (== server/pro/<id>.js) và cat ∈ {work,life,mind};
     bảng SAVE của shared/portalui.js == bảng SAVE của shared/rails.js; id game ở cozyplay/index.html == bảng multi-games.
   Trình duyệt (≥10 cỡ × sáng/tối × VI/EN × 2 trang; --quick: 6 cỡ):
     - MỌI trang: một màn hình KHÔNG cuộn (html + main), lề 16px của thẻ/chip ở điện thoại dọc, nút/thẻ/chip ≥44px, chữ nằm trong thẻ, không lỗi JS.
     - Night Play: thẻ Hôm nay hiện (số #N đúng ngày), Chơi tiếp CHỈ khi có np-resume hợp lệ (bấm → mở game với ?resume=1), huy hiệu Mới đúng ngày (?day=), 👑 đúng dữ liệu thật,
       chip lọc: số game mỗi nhóm đúng bảng cat, tổng = 20, lọc xong vẫn một màn hình + chỉ số trang cập nhật, nhớ trong phiên (sessionStorage, không localStorage), không bao giờ rỗng.
     - Pop Play: không chip, không 👑, không chữ Night Pass trên ô, không số phút còn lại ở cổng/khung chơi (kể cả khi phụ huynh đã đặt giới hạn), khoá 🔒 luôn thấy, tên ngắn một dòng không bị cắt.
   GAME_RULES.md mục 0a-17. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.NP_PORT || 8896, B = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), quick = args.includes("--quick"), shotDir = (args.find(a => a.startsWith("--shots=")) || "").slice(8);
const fails = [], note = (ok, m) => { if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const MG = require(path.join(root, "shared/multi-games.js"));
const COZY = MG.ids().filter(i => MG.get(i).portal === "cozyplay"), POP = MG.ids().filter(i => MG.get(i).portal === "popplay");
const CATS = ["work", "life", "mind"];
const WANT_CAT = /id="topics"/.test(fs.readFileSync(path.join(root, "cozyplay/index.html"), "utf8"));   /* trang có chip lọc thì MỌI game Cozy phải có cat */

/* ---------------- tĩnh ---------------- */
(function statics() {
  const gen = require(path.join(root, "scripts/gen-newbadge.js"));
  note(fs.readFileSync(gen.OUT, "utf8") === gen.render(), "shared/newbadge.js lệch landing/moi/launches.json: chạy node scripts/gen-newbadge.js");
  const proFiles = fs.readdirSync(path.join(root, "server/pro")).filter(f => /\.js$/.test(f) && !f.startsWith("_")).map(f => f.replace(/\.js$/, ""));
  for (const id of COZY) {
    const f = MG.get(id);
    note(f.pro === proFiles.includes(id), id + ": cờ pro (" + f.pro + ") lệch server/pro/" + id + ".js (" + proFiles.includes(id) + ")");
    if (WANT_CAT) note(CATS.includes(f.cat), id + ": thiếu/sai cờ cat trong shared/multi-games.js (cần " + CATS.join("|") + "): game Cozy mới BẮT BUỘC có cat");
  }
  for (const id of POP) { note(!MG.get(id).pro, id + ": Pop Play không được có cờ pro"); note(!MG.get(id).cat, id + ": Pop Play không phân loại chủ đề (không có bộ lọc)"); }
  const pu = fs.readFileSync(path.join(root, "shared/portalui.js"), "utf8"), rl = fs.readFileSync(path.join(root, "shared/rails.js"), "utf8");
  const tbl = s => { const m = s.match(/var SAVE = \{([^}]*)\}/); const o = {}; (m ? m[1] : "").replace(/"([\w-]+)":\s*"([\w-]+)"/g, (_, a, b) => { o[a] = b; }); return o; };
  const a = tbl(pu), b = tbl(rl);
  note(Object.keys(b).length > 10 && JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort()), "bảng SAVE của portalui.js lệch rails.js");
  const html = fs.readFileSync(path.join(root, "cozyplay/index.html"), "utf8"), ids = [...html.matchAll(/\{ id:"([\w-]+)", cat:/g)].map(m => m[1]);
  note(JSON.stringify(ids.slice().sort()) === JSON.stringify(COZY.slice().sort()), "id game ở cozyplay/index.html lệch shared/multi-games.js: " + ids.length + " vs " + COZY.length);
  /* id do shared/rails.js|hud.js tạo ra khi mở game (vd. #npTop) KHÔNG được trùng id có sẵn trong HTML hai cổng (từng trùng #npTop: rails ẩn nhầm khối của trang) */
  const made = new Set(); for (const f of ["shared/rails.js", "shared/hud.js"]) { const src = fs.readFileSync(path.join(root, f), "utf8"); src.replace(/\.id\s*=\s*"([\w-]+)"/g, (_, i) => made.add(i)); src.replace(/id="([\w-]+)"/g, (_, i) => made.add(i)); }
  for (const pg of ["cozyplay/index.html", "popplay/index.html"]) { const h = fs.readFileSync(path.join(root, pg), "utf8"); for (const i of made) note(!new RegExp('\\bid="' + i + '"').test(h), pg + ': id="' + i + '" trùng id do shared/rails.js|hud.js tạo ra'); }
  const popHtml = fs.readFileSync(path.join(root, "popplay/index.html"), "utf8");
  note(!/Night Pass|👑|crown/i.test((popHtml.match(/<main>[\s\S]*?<\/main>/) || [""])[0]), "popplay/index.html: <main> không được nhắc Night Pass/👑");
  note(!/id="topics"|id="puTop"/.test(popHtml), "popplay/index.html: Pop Play KHÔNG có bộ lọc / thẻ Hôm nay");
})();

const SIZES = quick ? [[320, 568], [360, 640], [390, 844], [768, 1024], [844, 390], [1280, 800]]
  : [[320, 568], [360, 640], [375, 667], [390, 844], [430, 932], [768, 1024], [1024, 768], [844, 390], [667, 375], [1280, 800], [1440, 900]];
const MEASURE = kind => {
  const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4 && s.visibility !== "hidden" && s.display !== "none" && !e.closest("[hidden]"); };
  const de = document.documentElement, main = document.querySelector("main"), out = { errs: [] }, vw = de.clientWidth, vh = innerHeight, ph = vw <= 520;
  if (de.scrollHeight > vh + 1 || de.scrollWidth > vw + 1) out.errs.push("trang cuộn/tràn " + de.scrollWidth + "x" + de.scrollHeight + " > " + vw + "x" + vh);
  if (main.scrollHeight > main.clientHeight + 1) out.errs.push("main cuộn " + main.scrollHeight + ">" + main.clientHeight);
  if (document.body.scrollHeight > vh + 1) out.errs.push("body cuộn");
  const inside = (e, box, what) => { const r = e.getBoundingClientRect(); if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1) out.errs.push(what + " tràn khỏi thẻ"); };
  const cards = [...document.querySelectorAll(".pu-card")].filter(vis);
  for (const c of cards) {
    const r = c.getBoundingClientRect();
    if (r.height < 43.5 || r.width < 43.5) out.errs.push(c.id + " nhỏ " + Math.round(r.width) + "x" + Math.round(r.height));
    c.querySelectorAll(".pu-t small,.pu-t b,.pu-ico").forEach(x => inside(x, r, c.id + " " + x.tagName));
    const b = c.querySelector(".pu-t b"); if (b && b.scrollHeight > b.clientHeight + 1) out.errs.push(c.id + ": tên game bị cắt (" + b.textContent + ")");
    const s = c.querySelector(".pu-t small"); if (s && s.scrollWidth > s.clientWidth + 1) out.errs.push(c.id + ": nhãn bị cắt “…” (" + s.textContent + ")");
  }
  if (ph && cards.length) { const L = Math.min(...cards.map(c => c.getBoundingClientRect().left)), R = Math.max(...cards.map(c => c.getBoundingClientRect().right)); if (Math.abs(L - 16) > 1.5 || Math.abs(vw - R - 16) > 1.5) out.errs.push("thẻ lệch lề 16px: trái " + L.toFixed(1) + ", phải " + (vw - R).toFixed(1)); }
  const chips = [...document.querySelectorAll("#topics button")].filter(vis);
  for (const c of chips) { const r = c.getBoundingClientRect(); if (r.height < 43.5 || r.width < 43.5) out.errs.push("chip " + c.textContent + " nhỏ " + Math.round(r.width) + "x" + Math.round(r.height)); }
  if (ph && chips.length) { const row = document.getElementById("topics").getBoundingClientRect(); if (Math.abs(row.left - 16) > 1.5) out.errs.push("hàng chip lệch lề trái " + row.left.toFixed(1)); const rows = new Set(chips.map(c => Math.round(c.getBoundingClientRect().top))); if (rows.size > 1) out.errs.push("chip xuống dòng (" + rows.size + " hàng): phải cuộn ngang"); }
  const tiles = [...document.querySelectorAll("#grid .tile")].filter(vis);
  for (const t of tiles) { const r = t.getBoundingClientRect(); if (r.left > -1 && r.right < vw + 1 && (r.width < 63.5 || r.height < 63.5)) out.errs.push("ô game nhỏ " + Math.round(r.width)); }
  /* huy hiệu nằm trong ô; nhãn tên Pop một dòng không cắt */
  for (const t of tiles) { const r = t.getBoundingClientRect(); t.querySelectorAll(".pu-b,.pu-n").forEach(x => { if (vis(x) || x.classList.contains("pu-n")) { if (getComputedStyle(x).display === "none") return; inside(x, r, "huy hiệu/nhãn " + (t.dataset.id || "")); } }); const n = t.querySelector(".pu-n"); if (n && getComputedStyle(n).display !== "none" && n.scrollWidth > n.clientWidth + 1) out.errs.push("nhãn Pop bị cắt: " + n.textContent); }
  out.tiles = tiles.length; out.dots = [...document.querySelectorAll("#gdots button")].filter(e => !e.classList.contains("gn")).length; out.slide = document.getElementById("grid").classList.contains("slide");
  return out;
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const shot = async (pg, n) => { if (shotDir) { fs.mkdirSync(shotDir, { recursive: true }); await pg.screenshot({ path: path.join(shotDir, n.replace(/[^\w.-]+/g, "_") + ".png") }); } };
  const open = async (url, w, h, o = {}) => {
    const pg = await br.newPage(); pg._er = []; pg.on("pageerror", e => pg._er.push(e.message));
    await pg.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 900, hasTouch: w < 900 });
    await pg.evaluateOnNewDocument((o2) => { try { if (!sessionStorage.getItem("__pu")) { localStorage.clear(); sessionStorage.setItem("__pu", "1"); } localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("lang", o2.lang || "vi"); localStorage.setItem("theme", o2.theme || "dark"); localStorage.setItem("np-sound", "0"); (o2.ls || []).forEach(kv => localStorage.setItem(kv[0], kv[1])); if (o2.reset) sessionStorage.clear(); } catch (e) {} }, o);
    await pg.goto(B + url + (url.includes("?") ? "&" : "?") + "season=off" + (o.day ? "&day=" + o.day : ""), { waitUntil: "load" }); await wait(o.wait || 700); return pg;
  };
  try {
    const RES = ["np-resume:xay-cau-tre", JSON.stringify({ v: 1, ts: Date.now() - 420000, daily: false, state: { t: 1, p: 1 } })];
    /* 1) quét cỡ × theme × ngôn ngữ × trang */
    for (const kind of ["cozy", "pop"]) for (const theme of ["light", "dark"]) for (const lang of ["vi", "en"]) for (const [w, h] of SIZES) {
      const tag = kind + " " + theme + " " + lang + " " + w + "x" + h;
      const pg = await open(kind + "play/index.html", w, h, { theme, lang, ls: kind === "cozy" ? [RES] : [] });
      const r = await pg.evaluate(MEASURE, kind); r.errs.forEach(e => note(false, tag + ": " + e));
      { const st = await pg.evaluate(() => {
          const px = c => { const m = c.match(/[\d.]+/g).map(Number); return m.slice(0, 3); }, lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); }, cr = (a, b) => { const x = lum(px(a)), y = lum(px(b)); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
          const cs = e => getComputedStyle(e), de = document.documentElement, h1 = document.querySelector(".hero h1"), card = document.querySelector(".pu-card"), pill = document.querySelector(".nav .pill"), bgc = cs(de).backgroundColor, o = {};
          o.bg = cs(de).backgroundImage; o.grads = (o.bg.match(/gradient/g) || []).length; o.h1 = cr(cs(h1).color, bgc);
          if (card) { o.glass = cs(card).backdropFilter || cs(card).webkitBackdropFilter; o.edge = getComputedStyle(card, "::before").backgroundImage.includes("gradient"); o.name = cr(cs(card.querySelector(".pu-t b")).color, bgc); }
          if (pill) { o.pill = cs(pill).backgroundImage.includes("gradient"); o.pillc = cr(cs(pill).color, getComputedStyle(pill).backgroundColor.includes("0, 0, 0, 0") ? "rgb(106,72,240)" : cs(pill).backgroundColor); }
          const t = document.querySelector("#grid .tile"); o.tileShadow = cs(t).boxShadow !== "none"; return o; });
        note(st.grads >= 3, tag + ": nền cổng phẳng (" + st.grads + " lớp gradient, cần quầng/sao)"); note(st.h1 >= 4.5, tag + ": tương phản tiêu đề " + st.h1.toFixed(2) + " < 4.5");
        if (kind === "cozy") { note(/blur/.test(st.glass || ""), tag + ": thẻ Hôm nay không có kính mờ (backdrop-filter)"); note(st.edge, tag + ": thẻ thiếu viền gradient"); note(st.name >= 4.5, tag + ": tương phản tên game trong thẻ " + st.name.toFixed(2)); note(st.pill, tag + ": nút Night Pass không gradient"); }
        note(st.tileShadow, tag + ": ô game không có bóng/glow"); }
      if (w === 390 || w === 1280) { const dup = await pg.evaluate(() => { const c = {}; document.querySelectorAll("[id]").forEach(e => { c[e.id] = (c[e.id] || 0) + 1; }); return Object.keys(c).filter(k => c[k] > 1); }); note(!dup.length, tag + ": id trùng " + JSON.stringify(dup) + " (từng trùng #npTop với shared/rails.js làm ẩn nhầm khối của trang)"); }
      if (kind === "cozy") {
        const t = await pg.evaluate(() => { const c = document.getElementById("puToday"), x = document.getElementById("puResume"), v = e => !!e && !e.hidden && e.offsetParent !== null; return { today: v(c), txt: c && c.textContent, res: v(x), pro: document.querySelectorAll("#grid .tile .pu-pro").length, tiles: document.querySelectorAll("#grid .tile").length }; });
        note(t.today, tag + ": thẻ Hôm nay không hiện"); note(t.res, tag + ": thẻ Chơi tiếp không hiện dù có np-resume hợp lệ");
        if (w >= 360) note(/#\d+/.test(t.txt || ""), tag + ": thẻ Hôm nay thiếu số #N (" + t.txt + ")");
        note(t.pro === 0 && t.tiles === 20, tag + ": 👑 trên ô phải BỎ (" + t.pro + ") / ô " + t.tiles);
        const ch = await pg.evaluate(() => [...document.querySelectorAll("#topics button")].map(b => b.textContent));
        note(ch.length === 4 && ch[0] === (lang === "vi" ? "Tất cả" : "All"), tag + ": chip lọc " + JSON.stringify(ch));
      } else {
        const t = await pg.evaluate(() => ({ chips: !!document.getElementById("topics"), crown: document.querySelectorAll(".pu-pro").length, lock: (() => { const e = document.getElementById("lock"); if (!e) return null; const r = e.getBoundingClientRect(); return { w: r.width, h: r.height, in: r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1, vis: getComputedStyle(e).display !== "none" }; })(), tiles: document.querySelectorAll("#grid .tile").length, hl: ["hleft", "tleft"].map(i => getComputedStyle(document.getElementById(i)).display) }));
        note(!t.chips && t.crown === 0, tag + ": Pop có chip/👑"); note(t.tiles === 12, tag + ": Pop " + t.tiles + " ô (cần 12)");
        note(t.lock && t.lock.vis && t.lock.in && t.lock.w >= 43.5 && t.lock.h >= 43.5, tag + ": khoá 🔒 phụ huynh không thấy/nhỏ " + JSON.stringify(t.lock));
        note(t.hl.every(d => d === "none"), tag + ": #hleft/#tleft đang hiện ở Pop " + t.hl);
      }
      note(!pg._er.length, tag + ": lỗi JS " + pg._er.slice(0, 1));
      if ((w === 390 && h === 844) || (w === 1280 && lang === "vi") || (w === 320 && lang === "en")) await shot(pg, "portalui-" + tag);
      await pg.close();
    }
    /* 1b) chip lọc chủ đề: số game mỗi nhóm đúng bảng cat, tổng = 20, vẫn một màn hình, chỉ số trang cập nhật, nhớ trong phiên, không bao giờ rỗng */
    const WANT = { work: COZY.filter(i => MG.get(i).cat === "work"), life: COZY.filter(i => MG.get(i).cat === "life"), mind: COZY.filter(i => MG.get(i).cat === "mind") };
    note(WANT.work.length + WANT.life.length + WANT.mind.length === 20 && COZY.length === 20, "tổng ba nhóm " + (WANT.work.length + WANT.life.length + WANT.mind.length) + " ≠ 20 game Cozy");
    for (const [w, h] of (quick ? [[320, 568], [390, 844], [844, 390], [1280, 800]] : [[320, 568], [375, 667], [390, 844], [768, 1024], [844, 390], [1280, 800]])) for (const lang of ["vi", "en"]) {
      const pg = await open("cozyplay/index.html", w, h, { lang, theme: lang === "vi" ? "dark" : "light" }), seen = {};
      for (const k of ["all", "work", "life", "mind", "all"]) {
        const tag = "chip " + k + " " + lang + " " + w + "x" + h;
        await pg.evaluate(k2 => document.querySelector('#topics button[data-k="' + k2 + '"]').click(), k); await wait(350);
        const r = await pg.evaluate(MEASURE, "cozy"); r.errs.forEach(e => note(false, tag + ": " + e));
        const st = await pg.evaluate(() => ({ ids: [...document.querySelectorAll("#grid .tile")].map(t => t.dataset.id), pressed: [...document.querySelectorAll("#topics button")].filter(b => b.getAttribute("aria-pressed") === "true").map(b => b.dataset.k), ss: sessionStorage.getItem("np-topic"), ls: localStorage.getItem("np-topic"), per: typeof gPage !== "undefined" ? gPage.n : -1, slide: document.getElementById("grid").classList.contains("slide"), dots: [...document.querySelectorAll("#gdots button:not(.gn)")].length, active: [...document.querySelectorAll("#gdots button[aria-current=true]")].length, none: !document.getElementById("noRes").hidden }));
        const want = k === "all" ? COZY : WANT[k];
        note(JSON.stringify(st.ids.slice().sort()) === JSON.stringify(want.slice().sort()), tag + ": ô " + st.ids.length + " ≠ " + want.length);
        note(st.pressed.length === 1 && st.pressed[0] === k && st.ss === k && st.ls === null, tag + ": trạng thái chip/sessionStorage " + JSON.stringify({ p: st.pressed, ss: st.ss, ls: st.ls }));
        note(st.slide ? st.dots === st.per && st.active === 1 : st.dots === 0, tag + ": chỉ số trang lệch (slide=" + st.slide + ", chấm=" + st.dots + ", trang=" + st.per + ", đang=" + st.active + ")");
        note(!st.none && st.ids.length > 0, tag + ": lưới rỗng"); seen[k] = st.ids;
        if (k !== "all" && w === 390 && lang === "vi") await shot(pg, "portalui-chip-" + k + "-" + w + "x" + h);
      }
      const u = [].concat(seen.work, seen.life, seen.mind); note(new Set(u).size === 20 && u.length === 20, "ba nhóm không phủ đúng 20 game, mỗi game một nhóm duy nhất (" + u.length + "/" + new Set(u).size + ")");
      /* nhớ trong phiên: tải lại vẫn giữ nhóm */
      await pg.evaluate(() => document.querySelector('#topics button[data-k="mind"]').click()); await wait(200); await pg.reload({ waitUntil: "load" }); await wait(600);
      const rl = await pg.evaluate(() => ({ n: document.querySelectorAll("#grid .tile").length, p: [...document.querySelectorAll("#topics button")].filter(b => b.getAttribute("aria-pressed") === "true").map(b => b.dataset.k) }));
      note(rl.n === WANT.mind.length && rl.p[0] === "mind", "chip lọc không nhớ sau tải lại: " + JSON.stringify(rl));
      await pg.close();
    }
    { /* không bao giờ rỗng: phụ huynh ẩn hết một nhóm -> chip biến mất, lưới vẫn đầy; tìm chữ ngoài nhóm đang chọn -> vẫn có kết quả */
      const pg = await open("cozyplay/index.html", 390, 844, { ls: [["prefs", JSON.stringify({ limit: 0, off: WANT.work })]] });
      const ch = await pg.evaluate(() => [...document.querySelectorAll("#topics button")].map(b => b.dataset.k)); note(JSON.stringify(ch) === '["all","life","mind"]', "ẩn hết nhóm Công sở: chip còn " + JSON.stringify(ch));
      const n = await pg.evaluate(() => document.querySelectorAll("#grid .tile").length); note(n === 17, "ẩn 3 game Công sở: còn " + n + " ô (cần 17)"); await pg.close();
      const pg2 = await open("cozyplay/index.html", 390, 844, { ls: [] }); await pg2.evaluate(() => { document.querySelector('#topics button[data-k="work"]').click(); const q = document.getElementById("q"); q.value = "mat tinh"; q.dispatchEvent(new Event("input")); }); await wait(300);
      const m = await pg2.evaluate(() => ({ n: document.querySelectorAll("#grid .tile").length, none: !document.getElementById("noRes").hidden })); note(m.n === 1 && !m.none, "tìm 'mat tinh' khi đang ở nhóm Công sở: " + JSON.stringify(m)); await pg2.close(); }
    /* 1c) KHÔNG GIẬT lần đầu: cache trống + CPU x4, đo CLS (layout-shift) và số lần dàn lưới (--s đổi): CLS > 0.1 ✗ (> 0.05 cảnh báo), dàn lưới > 2 lần ✗ */
    for (const kind of ["cozy", "pop"]) for (const [w, h] of (quick ? [[320, 568], [390, 844], [1194, 834]] : [[320, 568], [360, 640], [375, 667], [414, 896], [430, 932], [768, 1024], [1194, 834], [1440, 900]])) {
      const pg = await br.newPage(); await pg.setCacheEnabled(false); await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: w < 900, hasTouch: w < 900 });
      const cdp = await pg.target().createCDPSession(); await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await pg.evaluateOnNewDocument(() => { try { localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("lang", "vi"); } catch (e) {} window.__cls = 0; window.__grid = 0;
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
        const t = setInterval(() => { const g = document.getElementById("grid"); if (!g) return; clearInterval(t); let last = ""; new MutationObserver(() => { const k = g.style.getPropertyValue("--s") + g.className; if (k !== last) { last = k; window.__grid++; } }).observe(g, { attributes: true, attributeFilter: ["style", "class"] }); }, 1); });
      await pg.goto(B + kind + "play/index.html?season=off", { waitUntil: "load" }); await wait(2500);
      const r = await pg.evaluate(() => ({ cls: window.__cls, grid: window.__grid })), tag = "CLS " + kind + " " + w + "x" + h;
      note(r.cls <= 0.1, tag + ": " + r.cls.toFixed(3) + " > 0.1 (bố cục giật lúc tải)"); if (r.cls > 0.05 && r.cls <= 0.1) console.log("  ! cảnh báo " + tag + ": " + r.cls.toFixed(3) + " > 0.05");
      note(r.grid <= 2, tag + ": lưới dàn lại " + r.grid + " lần lúc tải (cần ≤ 2)"); await pg.close();
    }
    /* 2) Chơi tiếp: chỉ khi hợp lệ */
    const resCase = async (name, ls, want) => { const pg = await open("cozyplay/index.html", 390, 844, { ls }); const v = await pg.evaluate(() => { const x = document.getElementById("puResume"); return !!x && !x.hidden && x.offsetParent !== null; }); note(v === want, "Chơi tiếp [" + name + "]: hiện=" + v + " (cần " + want + ")"); await pg.close(); };
    await resCase("không có bản lưu", [], false);
    await resCase("hợp lệ", [RES], true);
    await resCase("quá 7 ngày", [["np-resume:xay-cau-tre", JSON.stringify({ v: 1, ts: Date.now() - 8 * 864e5, state: { t: 1 } })]], false);
    await resCase("không có state", [["np-resume:xay-cau-tre", JSON.stringify({ v: 1, ts: Date.now(), state: null })]], false);
    await resCase("ván hôm nay của ngày cũ", [["np-resume:xay-cau-tre", JSON.stringify({ v: 1, ts: Date.now(), daily: true, day: "2020-01-01", state: { t: 1 } })]], false);
    await resCase("JSON hỏng", [["np-resume:xay-cau-tre", "{không phải json"]], false);
    await resCase("game không có trong cổng", [["np-resume:khong-ton-tai", JSON.stringify({ v: 1, ts: Date.now(), state: { t: 1 } })]], false);
    { const pg = await open("cozyplay/index.html", 390, 844, { ls: [RES] }); await pg.click("#puResume"); await wait(900);
      const r = await pg.evaluate(() => { const f = document.querySelector("#stage iframe"); return { hash: location.hash, src: f && f.src }; });
      note(r.hash === "#xay-cau-tre" && /[?&]resume=1/.test(r.src || ""), "bấm Chơi tiếp phải mở xay-cau-tre với ?resume=1: " + JSON.stringify(r)); await pg.close(); }
    { const pg = await open("cozyplay/index.html", 390, 844, {}); const id = await pg.evaluate(() => document.getElementById("puToday").dataset.id); await pg.click("#puToday"); await wait(900);
      const r = await pg.evaluate(() => ({ hash: location.hash, src: (document.querySelector("#stage iframe") || {}).src }));
      note(r.hash === "#" + id && !/resume=1/.test(r.src || ""), "bấm Hôm nay phải mở game " + id + " (không resume): " + JSON.stringify(r)); await pg.close(); }
    /* 3) Hôm nay: đã chơi hôm nay -> dấu ✓ + "Đã chơi" */
    { const pg = await open("cozyplay/index.html?day=2026-11-11", 390, 844, {}); const id = await pg.evaluate(() => document.getElementById("puToday").dataset.id), SV = await pg.evaluate(() => NPPortalUI._debug.SAVE[document.getElementById("puToday").dataset.id]);
      const pg2 = await open("cozyplay/index.html", 390, 844, { day: "2026-11-11", ls: SV ? [[SV, JSON.stringify({ days: { "2026-11-11": 1234 } })]] : [] });
      const d = await pg2.evaluate(() => ({ ok: !!document.querySelector("#puToday .pu-ok"), al: document.getElementById("puToday").getAttribute("aria-label") }));
      note(!SV || (d.ok && /1[.,]?234/.test(d.al)), "Hôm nay đã chơi (" + id + "): thiếu ✓/điểm: " + JSON.stringify(d)); await pg.close(); await pg2.close(); }
    /* 4) huy hiệu Mới đúng ngày (14 ngày, D..D+13) */
    const L = JSON.parse(fs.readFileSync(path.join(root, "landing/moi/launches.json"), "utf8")).filter(x => x.type === "game");
    const add = (d, n) => new Date(Date.parse(d + "T00:00:00Z") + n * 864e5).toISOString().slice(0, 10);
    for (const x of L) for (const [off, want] of [[-1, false], [0, true], [13, true], [14, false]]) {
      if (x.group !== "cozy" && x.group !== "pop") continue;
      const portal = x.group === "cozy" ? "cozyplay" : "popplay", pg = await open(portal + "/index.html", 390, 844, { day: add(x.date, off) });
      const has = await pg.evaluate(id => { const t = document.querySelector('#grid .tile[data-id="' + id + '"]'); return !!t && !!t.querySelector(".pu-new"); }, x.gameId);
      note(has === want, "Mới " + x.gameId + " ngày " + add(x.date, off) + " (ra mắt " + x.date + "): " + has + " (cần " + want + ")"); await pg.close();
    }
    { /* số huy hiệu Mới của từng cổng khớp tính độc lập */
      for (const portal of ["cozyplay", "popplay"]) { const day = "2026-11-11", pg = await open(portal + "/index.html", 390, 844, { day });
        const n = await pg.evaluate(() => [...document.querySelectorAll("#grid .tile .pu-new")].map(e => e.parentElement.dataset.id).sort());
        const want = L.filter(x => x.group === (portal === "cozyplay" ? "cozy" : "pop") && (Date.parse(day) - Date.parse(x.date)) / 864e5 >= 0 && (Date.parse(day) - Date.parse(x.date)) / 864e5 < 14).map(x => x.gameId).sort();
        note(JSON.stringify(n) === JSON.stringify(want), portal + " huy hiệu Mới " + JSON.stringify(n) + " ≠ " + JSON.stringify(want)); await pg.close(); }
    }
    /* 5) Pop: không rò số phút còn lại ra ngoài khu phụ huynh (đã đặt giới hạn 30 phút, đã chơi 7 phút) */
    { const today = new Date().toLocaleDateString("sv"), LS = [["prefs", JSON.stringify({ limit: 30, off: [] })], ["usage", JSON.stringify({ d: today, s: 420 })]];
      for (const [w, h] of [[390, 844], [1280, 800], [844, 390]]) {
        const pg = await open("popplay/index.html", w, h, { ls: LS });
        const leak = async where => pg.evaluate(() => {
          const re = /\b\d{1,3}:\d{2}\b|\b\d+\s*(phút|min)\b|còn lại|time left/i, bad = [];
          const walk = r => { const tw = document.createTreeWalker(r, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const e = n.parentElement; if (!e || e.closest("#gate,script,style,noscript")) continue; const s = getComputedStyle(e), b = e.getBoundingClientRect(); if (s.display === "none" || s.visibility === "hidden" || b.width < 2 || b.height < 2 || e.closest("[hidden]")) continue; if (re.test(n.nodeValue)) bad.push(n.nodeValue.trim().slice(0, 40)); } };
          walk(document.body);
          document.querySelectorAll("[aria-label],[title]").forEach(e => { if (e.closest("#gate")) return; const s = getComputedStyle(e); if (s.display === "none") return; const t = (e.getAttribute("aria-label") || "") + " " + (e.title || ""); if (re.test(t)) bad.push("attr:" + t.trim().slice(0, 40)); });
          return bad;
        });
        let b = await leak(); note(!b.length, "pop " + w + "x" + h + ": rò số phút ở cổng " + JSON.stringify(b));
        await pg.evaluate(() => { location.hash = "ten-lua-cua-be"; }); await wait(1800);
        b = await leak(); note(!b.length, "pop " + w + "x" + h + ": rò số phút khi đang chơi " + JSON.stringify(b));
        const bar = await pg.evaluate(() => ["tleft", "hleft"].map(i => getComputedStyle(document.getElementById(i)).display)); note(bar.every(d => d === "none"), "pop " + w + "x" + h + ": #tleft/#hleft hiện " + bar);
        await pg.close(); }
      /* khu phụ huynh vẫn thấy số phút đã chơi */
      const pg = await open("popplay/index.html", 390, 844, { ls: LS }); await pg.evaluate(() => { document.getElementById("gate").classList.add("on"); renderPrefs(); });
      const used = await pg.evaluate(() => document.getElementById("usedTxt").textContent); note(/7/.test(used) && /30/.test(used), "khu phụ huynh phải còn thấy số phút: " + used); await pg.close(); }
  } finally { await br.close(); srv.kill(); }
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi giao diện hai cổng" : "✓ giao diện hai cổng đạt")); process.exit(fails.length ? 1 : 0);
})();
