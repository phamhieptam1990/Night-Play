/* KHÔNG còn nút icon nền SÁNG + icon TỐI (kiểu kính tối Night Pass, GAME_RULES.md 0a-18) — quét TOÀN BỘ nút/liên kết cỡ 28-90px có icon trên mọi trang:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-glassall.js [--quick] [--light|--dark]   (tự chạy http.server cổng NP_PORT hoặc 8951)
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
  for (const [url, name, kind] of PAGES) for (const th of THEMES) for (const [W, H, t] of SIZES) for (const stage of kind ? ["chọn", "chơi"] : ["-"]) {
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
  await br.close(); srv.kill();
  console.log(fails.length ? "✗ " + fails.length + " lỗi (nút nền sáng + icon tối)" : "✓ không còn nút icon nền sáng + icon tối ở mọi trang, sáng + tối");
  process.exit(fails.length ? 1 : 0);
})();
