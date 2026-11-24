/* Kiểm thẻ Học Vui Plus trong trang phụ huynh bằng Chrome thật (API giả bằng chặn yêu cầu, không mạng ngoài). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/learn/check-plus-ui.js [--shots <thư mục>]
   Cờ tắt: thẻ ẩn + KHÔNG có yêu cầu /api nào. Cờ bật: chưa có gói (dùng thử, các gói), đã có gói (công tắc AI, nhật ký linh vật); 390x844 và 360x640; không cuộn ngang, nút >= 44px. */
"use strict";
const { spawn } = require("child_process"), path = require("path"), fs = require("fs"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = +process.env.PORT || 8961, w = ms => new Promise(r => setTimeout(r, ms));
const si = process.argv.indexOf("--shots"), SHOTS = si > 0 ? process.argv[si + 1] : null; if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
let bad = 0; const no = m => { bad++; console.log("  ✗ " + m); };
(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await w(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  try {
    for (const [W, H] of [[390, 844], [360, 640]]) for (const mode of ["off", "new", "active"]) {
      const tag = `plus ${mode} ${W}x${H}`, cx = await br.createBrowserContext(), pg = await cx.newPage(), apis = [], errs = []; await pg.setViewport({ width: W, height: H, hasTouch: true, isMobile: true });
      pg.on("pageerror", e => errs.push(String(e).slice(0, 120)));
      await pg.setRequestInterception(true);
      pg.on("request", rq => {
        const u = new URL(rq.url());
        if (!u.pathname.startsWith("/api/")) return rq.continue();
        apis.push(u.pathname);
        const J = (s, b) => rq.respond({ status: s, contentType: "application/json", body: JSON.stringify(b) });
        if (u.pathname === "/api/learn/plans") return J(200, { on: true, trialDays: 7, plans: [{ id: "learn_month", amount: 99000, days: 30 }, { id: "learn_quarter", amount: 249000, days: 90 }, { id: "learn_year", amount: 790000, days: 365 }] });
        if (u.pathname === "/api/learn/trial") return J(200, { ok: true, token: "TOK", exp: Date.now() + 7 * 86400000, plan: "trial" });
        if (u.pathname === "/api/pass") return J(200, { active: true, exp: Date.now() + 5 * 86400000, plan: "trial", trial: true, features: ["coach", "explain", "exam6", "report"] });
        return J(404, { error: "x" });
      });
      await pg.evaluateOnNewDocument((mode) => {
        try { localStorage.setItem("learn:grade", "3"); sessionStorage.setItem("learn:pg", String(Date.now()));
          if (mode !== "off") localStorage.setItem("learn:plus:on", "1");
          if (mode === "active") { localStorage.setItem("learn:plus", JSON.stringify({ token: "TOK", exp: Date.now() + 5 * 86400000, plan: "trial", trial: true, features: ["coach", "explain", "exam6", "report"], at: Date.now() }));
            const d = new Date(), z = x => String(x).padStart(2, "0"); localStorage.setItem("learn:coachlog", JSON.stringify({ day: d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()), items: [{ at: Date.now(), mode: "hint", text: "Mình đếm cùng nhé", steps: ["Đọc kỹ đề", "Gạch chân các số"], src: "ai" }, { at: Date.now(), mode: "explain", text: "Mình thử lại nhé!", steps: ["Xem lại hàng chục"], src: "cache" }] })); } } catch (e) {}
      }, mode);
      await pg.goto(`http://localhost:${PORT}/learn/parent/index.html?lang=vi`, { waitUntil: "networkidle0" }); await w(500);
      const m = await pg.evaluate(() => {
        const s = document.getElementById("s-plus"), all = q => [...document.querySelectorAll(q)];
        return { hidden: s.hidden || s.offsetHeight === 0, txt: s.innerText, sx: document.documentElement.scrollWidth > innerWidth + 1,
          small: all("#s-plus button, #s-plus input").filter(b => { const r = b.getBoundingClientRect(); return r.width > 0 && (r.height < 43 || r.width < 43); }).map(b => b.id || b.textContent.slice(0, 20)),
          wide: all("#s-plus *").filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1); }).map(e => e.tagName).slice(0, 3) };
      });
      if (errs.length) no(`${tag}: lỗi JS ${errs[0]}`);
      if (m.sx) no(`${tag}: cuộn ngang`);
      if (mode === "off") { if (!m.hidden) no(`${tag}: thẻ phải ẩn khi cờ tắt`); if (apis.length) no(`${tag}: cờ tắt mà vẫn gọi ${apis.join()}`); }
      else {
        if (m.hidden) no(`${tag}: thẻ phải hiện`); if (m.small.length) no(`${tag}: nút nhỏ hơn 44px: ${m.small.join(" | ")}`); if (m.wide.length) no(`${tag}: tràn ngang: ${m.wide}`);
        if (mode === "new") { if (!/Dùng thử 7 ngày/.test(m.txt) || !/99\.000đ/.test(m.txt) || !/790\.000đ/.test(m.txt)) no(`${tag}: thiếu nút dùng thử/giá: ${m.txt.slice(0, 120)}`);
          if (W === 390) { await pg.type("#plMail", "ba.me@example.com"); await pg.click("#plTrial"); await w(500); const t2 = await pg.evaluate(() => document.getElementById("s-plus").innerText); if (!/Plus đang mở|Đang dùng thử/.test(t2)) no(`${tag}: sau dùng thử phải thấy Plus đang mở: ${t2.slice(0, 100)}`); } }
        if (mode === "active") { if (!/Mình đếm cùng nhé/.test(m.txt) || !/AI luyện cùng: BẬT/.test(m.txt)) no(`${tag}: thiếu nhật ký/công tắc AI`);
          await pg.click("#plAi0"); await w(200); const off = await pg.evaluate(() => ({ ai: localStorage.getItem("learn:plus:ai"), t: document.getElementById("plAi0").getAttribute("aria-pressed") })); if (off.ai !== "0" || off.t !== "true") no(`${tag}: công tắc tắt AI không lưu`);
          await pg.click("#plClr"); await w(200); if (!/chưa nói lời nào/.test(await pg.evaluate(() => document.getElementById("s-plus").innerText))) no(`${tag}: xoá nhật ký không chạy`); }
      }
      if (SHOTS && mode !== "off") { await pg.evaluate(() => document.getElementById("s-plus").scrollIntoView()); await pg.screenshot({ path: path.join(SHOTS, `plus-${mode}-${W}x${H}.png`) }); }
      await pg.close(); await cx.close();
    }
  } finally { await br.close(); srv.kill(); }
  console.log(bad ? "✗ " + bad + " lỗi" : "✓ Thẻ Plus trong trang phụ huynh đạt"); process.exit(bad ? 1 : 0);
})().catch(e => { console.log("✗", e.stack || e); process.exit(1); });
