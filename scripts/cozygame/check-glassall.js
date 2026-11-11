/* KHÔNG còn nút icon nền SÁNG + icon TỐI (kiểu kính tối Night Pass, GAME_RULES.md 0a-18) — quét TOÀN BỘ nút/liên kết cỡ 28-90px có icon trên mọi trang:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-glassall.js [--quick] [--menu (chỉ đo menu ⋯ của cổng)] [--light|--dark]   (tự chạy http.server cổng NP_PORT hoặc 8951)
   Trang: cổng Night Play, cổng Pop Play, hub /play/, Chơi cùng lúc (multi.html), 3 game Cozy (sinh tự động, viết tay, Cánh Nhỏ), 3 game Pop (màn chọn + đang chơi), rails mở; 390x844 và 1440x900; sáng + tối.
   Đỏ nếu: nền (độ sáng > 0.6, phối trên trắng nếu trong suốt một phần) kèm màu icon tối (< 0.3); hoặc icon trắng nhưng tương phản < 4.5.
   NGOẠI LỆ (ngắn, có chủ đích): ô xem trước skin, chip độ khó (có màu riêng theo độ khó), công tắc chữ VI|EN (EXC bên dưới). */
const { spawn } = require("child_process"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), args = process.argv.slice(2), quick = args.includes("--quick"), PORT = +process.env.NP_PORT || 8951;
const wait = ms => new Promise(r => setTimeout(r, ms)), fails = [];
const THEMES = args.includes("--light") ? ["light"] : args.includes("--dark") ? ["dark"] : ["light", "dark"], SIZES = quick ? [[390, 844, 1]] : [[390, 844, 1], [1440, 900, 0]];
const PAGES = [["cozyplay/index.html", "cổng Night Play"], ["popplay/index.html", "cổng Pop Play"], ["play/index.html", "hub"], ["cozyplay/multi.html", "chơi cùng lúc"],
  ["cozyplay/index.html#bao-nhieu-giay", "Cozy tự động", "cozy"], ["cozyplay/index.html#dap-deadline", "Cozy viết tay", "cozy"], ["cozyplay/index.html#cozy-wings", "Cánh Nhỏ", "cozy"],
  ["popplay/index.html#pop-fly", "Pop pop-fly", "pop"], ["popplay/index.html#bo-me-5-giay", "Pop bo-me", "pop"], ["popplay/index.html#thap-vong-mau", "Pop thap-vong", "pop"]];
const EXC = ".pv,.preview,.sk .th,.skc .th,.sk canvas,.skc canvas,button.dif,.difs button,#langMenu button,[data-glass-exc]";   /* ngoại lệ: ô xem trước skin; chip độ khó (màu theo độ khó); công tắc chữ VI|EN */
const SCAN = exc => {
  const num = c => { const m = (c || "").match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
  const L = (r, g, b) => { const q = [r, g, b].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * q[0] + .7152 * q[1] + .0722 * q[2]; };
  const out = [];
  const walk = (doc, tag) => {
    const w = doc.defaultView;
    doc.querySelectorAll("button,a,[role=button]").forEach(e => {
      const r = e.getBoundingClientRect(), s = w.getComputedStyle(e); if (r.width < 28 || r.height < 28 || r.width > 90 || r.height > 90 || s.display === "none" || s.visibility === "hidden" || +s.opacity < .3 || e.closest("[hidden]")) return;
      if (r.right < 0 || r.bottom < 0 || r.left > w.innerWidth || r.top > w.innerHeight) return; if (e.matches(exc) || e.closest(exc)) return;
      const txt = (e.textContent || "").replace(/\s+/g, "").trim(), hasSvg = !!e.querySelector("svg"); if (!hasSvg && txt.length > 3) return; if (!hasSvg && !txt) return;
      const bg = num(s.backgroundColor), a = bg.length > 3 ? bg[3] : 1, hasImg = s.backgroundImage !== "none";
      const bl = hasImg ? (() => { const st = (s.backgroundImage.match(/rgba?\([^)]*\)/g) || []).map(num); return st.length ? Math.max(...st.map(c => { const al = c.length > 3 ? c[3] : 1; return L(c[0] * al + 255 * (1 - al), c[1] * al + 255 * (1 - al), c[2] * al + 255 * (1 - al)); })) : 0; })() : a < .05 ? -1 : L(bg[0] * a + 255 * (1 - a), bg[1] * a + 255 * (1 - a), bg[2] * a + 255 * (1 - a));
      const ink = num(s.color), il = L(ink[0], ink[1], ink[2]);
      out.push({ n: tag + " " + (e.id ? "#" + e.id : e.tagName.toLowerCase() + "." + (e.className + "").split(" ")[0]), w: Math.round(r.width), bl, il, cr: bl < 0 ? 99 : (Math.max(il, bl) + .05) / (Math.min(il, bl) + .05) });
    });
  };
  walk(document, "cổng");
  document.querySelectorAll("iframe").forEach(f => { try { if (f.contentDocument) walk(f.contentDocument, "game"); } catch (e) {} });
  return out;
};
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  for (const [url, name, kind] of args.includes("--menu") ? [] : PAGES) for (const th of THEMES) for (const [W, H, t] of SIZES) for (const stage of kind ? ["chọn", "chơi"] : ["-"]) {
    let pg; const tag = name + " " + W + "x" + H + " " + th + (stage === "-" ? "" : " " + stage);
    try {
      pg = await br.newPage(); pg.setDefaultNavigationTimeout(90000); await pg.setViewport({ width: W, height: H, isMobile: !!t, hasTouch: !!t });
      await pg.evaluateOnNewDocument(x => { localStorage.setItem("lang", "vi"); localStorage.setItem("np-sound", "1"); localStorage.setItem("theme", x); localStorage.setItem("np-welcome-seen", "1"); localStorage.setItem("np-rails", "1"); localStorage.setItem("pophelp-seen:" + location.pathname.split("/").slice(-2)[0], "1"); }, th);
      await pg.goto("http://localhost:" + PORT + "/" + url + (url.includes("?") ? "" : url.includes("#") ? "" : "")); await wait(3200);
      if (stage === "chơi") { const id = url.split("#")[1], fr = pg.frames().find(f => f.url().includes("/games/" + id + "/")); if (fr) { if (kind === "cozy") await fr.evaluate(() => { const e = document.getElementById("bPlay") || document.getElementById("bDaily") || document.getElementById("startBtn") || document.getElementById("bPractice") || document.getElementById("bMake") || document.querySelector("#home .btn"); e && e.click(); }).catch(() => {}); else await fr.evaluate("try{begin(0,{})}catch(e){try{startSession(0,null,{})}catch(e2){}}").catch(() => {}); await wait(1200); } }
      const items = await pg.evaluate(SCAN, EXC);
      for (const i of items) { const bad = []; if (i.bl > .6 && i.il < .3) bad.push("nền sáng " + i.bl.toFixed(2) + " + icon tối " + i.il.toFixed(2)); else if (i.bl >= 0 && i.bl <= .6 && i.il > .5 && i.cr < 4.5) bad.push("tương phản " + i.cr.toFixed(2) + " < 4.5");
        if (bad.length) { const m = tag + ": " + i.n + " (" + i.w + "px) " + bad.join(", "); if (!fails.includes(m)) { fails.push(m); console.log("  ✗ " + m); } } }
    } catch (e) { fails.push(tag + ": không đo được " + String(e).slice(0, 70)); console.log("  ✗ " + fails[fails.length - 1]); }
    try { await pg.close(); } catch (e) {}
  }
  /* MENU ⋯ CỦA CỔNG (cổng Night Play, Pop Play, hub): toàn menu là MỘT thẻ, mục = hàng phẳng nền trong suốt (không khối kính tối lẫn nền sáng); sau khi bấm "Light / Dark" kiểu GIỮ NGUYÊN (chỉ đổi màu); chữ tương phản >= 4.5 trên nền thẻ. */
  const MENU = () => {
    const num = c => { const m = (c || "").match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
    const L = c => { const q = c.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * q[0] + .7152 * q[1] + .0722 * q[2]; };
    const m = document.querySelector(".bars-more"), pop = document.querySelector(".bars-pop"); if (!m || !pop) return null;
    if (pop.hidden) m.click();
    const card = num(getComputedStyle(pop).backgroundColor), cl = L(card), ps = pop.getBoundingClientRect();
    const rows = [...pop.querySelectorAll(":scope > a, :scope > button, :scope > nav > a, :scope > nav > button")].filter(e => e.offsetParent && e.id !== "langMenu" && !e.closest("#langMenu")).map(e => {
      const s = getComputedStyle(e), r = e.getBoundingClientRect(), bg = num(s.backgroundColor), ink = num(s.color), il = L(ink);
      return { n: e.id || (e.textContent || "").trim().slice(0, 14), h: Math.round(r.height), bga: bg.length > 3 ? bg[3] : 1, rad: s.borderRadius, sh: s.boxShadow, bt: s.borderTopWidth, bl: s.borderLeftWidth, cr: (Math.max(il, cl) + .05) / (Math.min(il, cl) + .05), inside: r.left >= ps.left - 1 && r.right <= ps.right + 1 };
    });
    return { rows, sx: document.documentElement.scrollWidth > innerWidth + 1, inView: ps.left >= 0 && ps.right <= innerWidth && ps.top >= 0 && ps.bottom <= innerHeight + 1 };
  };
  for (const [url, name] of PAGES.slice(0, 3)) for (const th of THEMES) {
    let pg; const tag = "menu ⋯ " + name + " 390x844 " + th;
    try {
      pg = await br.newPage(); await pg.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      await pg.evaluateOnNewDocument(x => { localStorage.setItem("lang", "vi"); localStorage.setItem("theme", x); localStorage.setItem("np-welcome-seen", "1"); }, th);
      await pg.goto("http://localhost:" + PORT + "/" + url); await wait(2500);
      await pg.evaluate(MENU); await wait(350); const a = await pg.evaluate(MENU); if (!a) { fails.push(tag + ": không có menu ⋯"); console.log("  ✗ " + fails[fails.length - 1]); continue; }
      await pg.evaluate(() => { const t = document.querySelector(".bars-pop #themeBtn"); t && t.click(); }); await wait(500); await pg.evaluate(MENU); await wait(350);
      const b = await pg.evaluate(MENU);
      for (const [lab, d] of [["trước", a], ["sau Light/Dark", b]]) {
        const bad = [], hs = d.rows.map(r => r.h);
        d.rows.forEach(r => { if (r.bga > .05) bad.push(r.n + " nền không trong suốt (alpha " + r.bga.toFixed(2) + ")"); if (r.sh !== "none") bad.push(r.n + " có bóng kính"); if (r.cr < 4.5) bad.push(r.n + " tương phản " + r.cr.toFixed(2)); if (r.h < 44) bad.push(r.n + " cao " + r.h + " < 44"); if (!r.inside) bad.push(r.n + " tràn thẻ"); });
        if (hs.length && Math.max(...hs) - Math.min(...hs) > 2) bad.push("chiều cao hàng lệch " + hs.join("/"));
        if (new Set(d.rows.map(r => r.rad)).size > 1) bad.push("bo góc không đồng nhất " + [...new Set(d.rows.map(r => r.rad))].join("/"));
        if (d.sx) bad.push("cuộn ngang"); if (!d.inView) bad.push("menu ngoài màn hình");
        if (bad.length) { fails.push(tag + " (" + lab + "): " + bad.join("; ")); console.log("  ✗ " + fails[fails.length - 1]); } }
      if (b && a.rows.length === b.rows.length) a.rows.forEach((r, i) => { const q = b.rows[i]; if (r.h !== q.h || r.rad !== q.rad || r.bt !== q.bt || (r.sh === "none") !== (q.sh === "none")) { fails.push(tag + ": mục " + r.n + " đổi kiểu sau Light/Dark"); console.log("  ✗ " + fails[fails.length - 1]); } });
    } catch (e) { fails.push(tag + ": không đo được " + String(e).slice(0, 70)); console.log("  ✗ " + fails[fails.length - 1]); }
    try { await pg.close(); } catch (e) {}
  }
  await br.close(); srv.kill();
  console.log(fails.length ? "✗ " + fails.length + " lỗi (nút nền sáng + icon tối)" : "✓ không còn nút icon nền sáng + icon tối ở mọi trang, sáng + tối");
  process.exit(fails.length ? 1 : 0);
})();
