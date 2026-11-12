/* SÂN KHẤU của hai trang cổng (shared/showcase.css|js, GAME_RULES 0a-29):
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-showcase.js [--quick] [--shots=<thư mục>]   (tự chạy http.server cổng NP_PORT hoặc 8953)
   Hai cổng x sáng/tối x VI/EN x các cỡ:
   - trang/main không cuộn; lưới game vẫn đủ lớn (Night >= 88px, Pop >= 64px);
   - sân khấu hiện (dọc cao >= 600, ngang rộng >= 900 & cao >= 560) nằm trọn màn hình; màn thấp (điện thoại ngang) KHÔNG có sân khấu và Night hiện lại thẻ Hôm nay nhỏ;
   - thẻ chữ + nút Chơi (>= 44px) + thẻ giữa nằm trong khung; tên game <= 2 dòng, không cắt, với MỌI game; Night có nhãn "Hôm nay · #N";
   - Pop: không nhắc Night Pass/👑 trên sân khấu;
   - mũi tên / vuốt / phím đổi game, rê chuột vào ô lưới đổi theo, bấm Chơi mở đúng game; đã chơi hôm nay có ✓;
   - thông báo sự kiện (.ns-toast) không che tiêu đề; màn mở đầu (?intro=1) chạy rồi tự gỡ, không để lại lệch bố cục. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), args = process.argv.slice(2), quick = args.includes("--quick"), PORT = +process.env.NP_PORT || 8953, B = "http://localhost:" + PORT + "/";
const shots = (args.find(a => a.startsWith("--shots=")) || "").slice(8);
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = []; let n = 0;
const note = (ok, m) => { n++; if (!ok) { fails.push(m); console.log("  ✗ " + m); } };
const SIZES = quick ? [[390, 844], [390, 664], [768, 1024], [844, 390], [1280, 800]]
  : [[320, 568], [360, 640], [390, 664], [390, 844], [430, 932], [768, 1024], [1032, 1376], [1024, 768], [844, 390], [667, 375], [1000, 536], [1280, 800], [1440, 900], [1920, 1080]];
const expectOn = (w, h) => (h >= 600 && !(w >= 900 && w > h)) || (w >= 900 && w > h && h >= 560);
const MEASURE = kind => {
  const de = document.documentElement, main = document.querySelector("main"), host = document.getElementById("show"), out = { errs: [] }, vw = de.clientWidth, vh = innerHeight;
  const vis = e => !!e && e.offsetParent !== null && e.getBoundingClientRect().width > 4;
  if (de.scrollHeight > vh + 1 || de.scrollWidth > vw + 1) out.errs.push("trang cuộn/tràn");
  if (main.scrollHeight > main.clientHeight + 1) out.errs.push("main cuộn " + main.scrollHeight + ">" + main.clientHeight);
  out.on = vis(host); out.tiny = main.classList.contains("sc-tiny");
  const tiles = [...document.querySelectorAll("#grid .tile")].filter(vis), mn = kind === "cozy" ? 87.5 : 63.5;
  for (const t of tiles) { const r = t.getBoundingClientRect(); if (r.left > -1 && r.right < vw + 1 && (r.width < mn || r.height < mn)) { out.errs.push("ô game nhỏ " + Math.round(r.width)); break; } }
  if (!tiles.length) out.errs.push("lưới rỗng");
  const pt = document.getElementById("puToday"); out.puToday = vis(pt);
  if (!out.on) return out;
  const box = host.querySelector(".sc-box").getBoundingClientRect();
  out.box = [Math.round(box.width), Math.round(box.height)];
  if (box.left < -1 || box.right > vw + 1 || box.top < 0 || box.bottom > vh + 1) out.errs.push("sân khấu tràn màn hình");
  if (box.height < 126) out.errs.push("sân khấu quá thấp " + Math.round(box.height));
  const inside = (e, what, pad) => { const r = e.getBoundingClientRect(); if (r.left < box.left - 1 + (pad || 0) || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1) out.errs.push(what + " tràn khỏi sân khấu"); return r; };
  const info = host.querySelector(".sc-info"), play = document.getElementById("scPlay"), name = document.getElementById("scName"), tag = host.querySelector(".sc-tag"), mid = host.querySelector('.sc-card[data-o="0"]');
  const ir = inside(info, "thẻ chữ"); if (info.scrollHeight > info.clientHeight + 1) out.errs.push("thẻ chữ bị cắt");
  for (const [e, w] of [[play, "nút Chơi"], [name, "tên game"], [tag, "nhãn"]]) { const r = e.getBoundingClientRect(); if (r.left < ir.left - 1 || r.right > ir.right + 1 || r.top < ir.top - 1 || r.bottom > ir.bottom + 1) out.errs.push(w + " tràn khỏi thẻ chữ"); }
  const pr = play.getBoundingClientRect(); if (pr.height < 43.5 || pr.width < 80) out.errs.push("nút Chơi nhỏ " + Math.round(pr.width) + "x" + Math.round(pr.height));
  if (!mid) out.errs.push("không có thẻ giữa"); else { const r = inside(mid, "thẻ giữa"); if (r.width < 70) out.errs.push("thẻ giữa nhỏ " + Math.round(r.width)); const c = document.elementFromPoint(r.left + r.width * .7, r.top + r.height / 2); if (!c || !c.closest(".sc-card,.sc-nav")) out.errs.push("thẻ giữa bị che"); }
  if (tag.scrollWidth > tag.clientWidth + 1) out.errs.push("nhãn bị cắt (" + tag.textContent + ")");
  out.tag = tag.textContent; out.name = name.textContent; out.day = tag.classList.contains("day");
  /* tên của MỌI game: <= 2 dòng, không tràn */
  const cur = NPShow.current(), all = [...host.querySelectorAll(".sc-card")].map(c => c.dataset.id); out.cards = all.length;
  for (let i = 0; i < all.length; i++) { NPShow.go(i); const fs = parseFloat(getComputedStyle(name).fontSize), lines = Math.round(name.getBoundingClientRect().height / (fs * 1.14));
    if (lines > 2 || name.scrollWidth > name.clientWidth + 1 || info.scrollHeight > info.clientHeight + 1 || fs < 13) out.errs.push("tên game không vừa: " + name.textContent + " (" + lines + " dòng, " + fs + "px)"); if (!name.textContent.trim()) out.errs.push("tên game trống");
    const r2 = info.getBoundingClientRect(); if (r2.top < box.top - 1 || r2.bottom > box.bottom + 1) out.errs.push("thẻ chữ tràn dọc với tên " + name.textContent); }
  NPShow.go(all.indexOf(cur.id));
  if (kind === "pop" && /night pass|👑/i.test(host.textContent)) out.errs.push("sân khấu Pop nhắc Night Pass/👑");
  return out;
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const open = async (url, w, h, o = {}) => {
    const pg = await br.newPage(); pg._er = []; pg.on("pageerror", e => pg._er.push(e.message));
    await pg.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 900, hasTouch: w < 900 });
    await pg.evaluateOnNewDocument(o2 => { try { localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("lang", o2.lang || "vi"); localStorage.setItem("theme", o2.theme || "dark"); localStorage.setItem("np-sound", "0"); (o2.ls || []).forEach(kv => localStorage.setItem(kv[0], kv[1])); } catch (e) {} }, o);
    await pg.goto(B + url + (url.includes("?") ? "&" : "?") + (o.season ? "" : "season=off"), { waitUntil: "load" }); await wait(o.wait || 800); return pg;
  };
  try {
    /* 1) quét cỡ */
    for (const kind of ["cozy", "pop"]) for (const theme of (quick ? ["dark"] : ["dark", "light"])) for (const lang of ["vi", "en"]) for (const [w, h] of SIZES) {
      const tag = kind + " " + theme + " " + lang + " " + w + "x" + h, pg = await open(kind + "play/index.html", w, h, { theme, lang });
      const r = await pg.evaluate(MEASURE, kind); r.errs.forEach(e => note(false, tag + ": " + e)); note(!pg._er.length, tag + ": lỗi JS " + pg._er.join(" | "));
      const want = expectOn(w, h);
      note(r.on === want || (want && r.tiny), tag + ": sân khấu " + (r.on ? "hiện" : "ẩn") + " (cần " + (want ? "hiện" : "ẩn") + ")");
      if (r.on) { note(r.cards === (kind === "cozy" ? 20 : 12), tag + ": " + r.cards + " thẻ"); note(r.day, tag + ": game giữa lúc mở trang phải là game hôm nay (" + r.tag + ")");
        if (kind === "cozy") { note(/#\d+/.test(r.tag), tag + ": nhãn Hôm nay thiếu #N (" + r.tag + ")"); note(!r.puToday, tag + ": thẻ Hôm nay nhỏ hiện cùng lúc với sân khấu"); } }
      else if (kind === "cozy") note(r.puToday, tag + ": không có sân khấu thì thẻ Hôm nay nhỏ phải hiện");
      if (shots && lang === "vi") { fs.mkdirSync(shots, { recursive: true }); await pg.screenshot({ path: path.join(shots, (kind + "-" + theme + "-" + w + "x" + h) + ".png") }); }
      await pg.close();
    }
    /* 2) tương tác */
    for (const kind of ["cozy", "pop"]) {
      { const pg = await open(kind + "play/index.html", 1280, 800, {}), tag = kind + " chuột 1280x800";
        const st = () => pg.evaluate(() => ({ id: NPShow.current().id, name: document.getElementById("scName").textContent }));
        const a = await st(); await pg.click("#show .sc-next"); await wait(120); const b = await st(); note(a.id !== b.id && a.name !== b.name, tag + ": › không đổi game");
        await pg.click("#show .sc-prev"); await wait(120); note((await st()).id === a.id, tag + ": ‹ không về game cũ");
        await pg.focus("#scPlay"); await pg.keyboard.press("ArrowRight"); await wait(120); note((await st()).id === b.id, tag + ": phím → không đổi game");
        const tid = await pg.evaluate(() => document.querySelectorAll("#grid .tile")[7].dataset.id); await pg.hover('#grid .tile[data-id="' + tid + '"]'); await wait(450); note((await st()).id === tid, tag + ": rê chuột vào ô lưới, sân khấu không đổi theo");
        await pg.mouse.move(5, 5); await pg.click("#scPlay"); await wait(900);
        const r = await pg.evaluate(() => ({ hash: location.hash, on: document.getElementById("stage").classList.contains("on") })); note(r.hash === "#" + tid && r.on, tag + ": bấm Chơi phải mở " + tid + ": " + JSON.stringify(r)); await pg.close(); }
      { const pg = await open(kind + "play/index.html", 390, 844, {}), tag = kind + " cảm ứng 390x844";
        const a = await pg.evaluate(() => NPShow.current().id), bx = await pg.evaluate(() => { const r = document.querySelector('.sc-card[data-o="0"]').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
        const cdp = await pg.target().createCDPSession(), tp = (type, x) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: type === "touchEnd" ? [] : [{ x, y: bx[1] }] });
        await tp("touchStart", bx[0]); for (let i = 1; i <= 6; i++) { await tp("touchMove", bx[0] - i * 15); await wait(16); } await tp("touchEnd"); await wait(350);
        const b = await pg.evaluate(() => ({ id: NPShow.current().id, hash: location.hash })); note(b.id !== a && b.hash.length < 2, tag + ": vuốt ngang phải đổi game mà không mở game: " + JSON.stringify(b));
        await pg.tap('.sc-card[data-o="0"]'); await wait(900); const c = await pg.evaluate(() => location.hash); note(c === "#" + b.id, tag + ": chạm thẻ giữa phải mở " + b.id + " (" + c + ")"); await pg.close(); }
    }
    /* 3) Night: đã chơi hôm nay có ✓ trên nhãn */
    { const p0 = await open("cozyplay/index.html?day=2026-11-11", 390, 844, {}), SV = await p0.evaluate(() => NPPortalUI._debug.SAVE[NPShow.current().id]); await p0.close();
      if (SV) { const pg = await open("cozyplay/index.html?day=2026-11-11", 390, 844, { ls: [[SV, JSON.stringify({ days: { "2026-11-11": 1234 } })]] });
        const d = await pg.evaluate(() => ({ ok: !!document.querySelector("#show .sc-tag.day i"), al: document.getElementById("scPlay").getAttribute("aria-label") })); note(d.ok && /Đã chơi/.test(d.al), "Night đã chơi hôm nay: thiếu ✓/nhãn: " + JSON.stringify(d)); await pg.close(); } }
    /* 4) thông báo sự kiện không che tiêu đề + màn mở đầu tự gỡ */
    for (const kind of ["cozy", "pop"]) for (const [w, h] of [[390, 844], [1280, 800]]) {
      { const pg = await open(kind + "play/index.html?season=tet", w, h, { season: 1, wait: 900 }), tag = kind + " thông báo sự kiện " + w + "x" + h;
        const r = await pg.evaluate(() => { const t = document.querySelector(".ns-toast"), h1 = document.querySelector(".hero h1"); if (!t) return null; const a = t.getBoundingClientRect(), b = h1.getBoundingClientRect(); return { hit: !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom), in: a.top >= 0 && a.bottom <= innerHeight }; });
        if (r) note(!r.hit && r.in, tag + ": thông báo che tiêu đề / tràn " + JSON.stringify(r)); await pg.close(); }
      { const pg = await open(kind + "play/index.html?intro=1", w, h, { wait: 250 }), tag = kind + " màn mở đầu " + w + "x" + h;
        note(await pg.evaluate(() => document.documentElement.classList.contains("sc-intro")), tag + ": ?intro=1 không chạy"); await wait(2300);
        const r = await pg.evaluate(() => ({ cls: document.documentElement.classList.contains("sc-intro"), t: [...document.querySelectorAll("#grid .tile")].slice(0, 3).map(t => getComputedStyle(t).transform + "|" + getComputedStyle(t).opacity) }));
        note(!r.cls && r.t.every(x => /^(none|matrix\(1, 0, 0, 1, 0, 0\))\|1$/.test(x)), tag + ": màn mở đầu không tự gỡ / ô còn lệch " + JSON.stringify(r)); await pg.close(); }
    }
  } catch (e) { note(false, "bài đo dừng giữa chừng: " + (e && e.stack || e)); }
  await br.close(); srv.kill();
  console.log(fails.length ? "\n✗ " + fails.length + "/" + n + " lỗi sân khấu cổng" : "\n✓ sân khấu hai cổng đạt (" + n + " phép đo)"); process.exit(fails.length ? 1 : 0);
})();
