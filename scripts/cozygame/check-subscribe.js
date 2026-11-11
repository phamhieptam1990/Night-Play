/* Kiểm tra trang Night Pass (subscribe.html + shared/nightpass-ui.css) bằng Chrome thật, API giả bằng request interception (không đụng server/DB). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-subscribe.js [--quick] [--shots=<thư mục ảnh>]
   Mỗi cỡ (320x568 360x640 390x844 430x932 768x1024 1024x768 1194x834 1440x900) x sáng/tối x VI/EN, mỗi trạng thái
   (bước 1, bước 2, đã có gói, gói hết hạn, Khôi phục bước 1/2, hộp QR/VietQR, hộp DEMO, thành công, lỗi):
     - không cuộn dọc/ngang (trang, <main>, hộp thoại), hộp thoại nằm trọn trong khung nhìn;
     - không chữ tràn thẻ/hộp; nút/ô nhập/liên kết (trừ liên kết trong đoạn văn) >= 44x44px;
     - tương phản chữ >= 4.5:1 (cỡ lớn >= 3:1) ở thẻ, hộp thoại, nút gradient; console không lỗi.
   Luồng (một lần, 390x844): tạo đơn -> pending -> paid (token) -> hộp thành công; paid không token -> mời khôi phục; hết hạn -> "Tạo đơn mới";
     lỗi mạng / 429 / 500; email sai; Esc đóng hộp và dừng poll; Khôi phục: OTP sai / 429 / email không có gói / thành công; banner gói + số thiết bị;
     nút Quay lại; tải lại ở bước 2 rồi "Đổi gói" không kẹt; giá khớp server/app.js PLANS; có dòng không tự gia hạn + liên kết terms.html.
   --quick: 360x640, 390x844, 1440x900 sáng+tối VI + 390 EN sáng, ít trạng thái hơn. */
const http = require("http"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", "..");
const quick = process.argv.includes("--quick");
const shotDir = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8);
const fails = [];
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
const only = (process.argv.find(a => a.startsWith("--size=")) || "").slice(7).split("x").map(Number);   // --size=320x568: chỉ một cỡ (gỡ lỗi)
const SIZES = only.length === 2 ? [only] : quick ? [[360, 640], [390, 844], [1440, 900]] : [[320, 568], [360, 640], [390, 844], [430, 932], [768, 1024], [1024, 768], [1194, 834], [1440, 900]];
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".webmanifest": "application/json" };
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");

const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/subscribe.html";
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(fs.readFileSync(f));
});

/* ---- API giả: điều khiển bằng object mock ---- */
const NEWEXP = () => Date.now() + 30 * 864e5;
function makeMock() {
  return { order: "ok", poll: "pending", restore: "ok", verify: "ok", pass: "ok", polls: 0, created: 0 };
}
function route(m, req) {
  const u = new URL(req.url()), p = u.pathname, me = req.method();
  const J = (status, body) => ({ status, contentType: "application/json", body: JSON.stringify(body) });
  if (me === "POST" && p === "/api/orders") {
    m.created++;
    if (m.order === "net") return "abort";
    if (m.order === "429") return J(429, { error: "rate_limited" });
    if (m.order === "500") return J(500, { error: "server" });
    return J(201, { orderId: "a".repeat(32), code: "NP4829XK", amount: 36000, expiresAt: Date.now() + 15 * 60000, qr: "https://img.vietqr.io/image/x.png", bank: { name: "Vietcombank", account: "0123456789", holder: "CONG TY NIGHT PLAY" } });
  }
  if (me === "GET" && /^\/api\/orders\/[a-f0-9]{32}$/.test(p)) {
    m.polls++;
    if (m.poll === "paid") return J(200, { status: "paid", exp: NEWEXP(), plan: "month", token: "tok.test.sig" });
    if (m.poll === "paid-notoken") return J(200, { status: "paid", exp: NEWEXP(), plan: "month", token: null, claimed: true });
    if (m.poll === "expired") return J(200, { status: "expired" });
    if (m.poll === "net") return "abort";
    return J(200, { status: "pending" });
  }
  if (me === "POST" && p === "/api/restore") return m.restore === "429" ? J(429, { error: "rate_limited" }) : J(200, { ok: true });
  if (me === "POST" && p === "/api/restore/verify") {
    if (m.verify === "429") return J(429, { error: "rate_limited" });
    if (m.verify === "bad") return J(400, { error: "invalid" });
    if (m.verify === "none") return J(200, { active: false, token: null });
    return J(200, { active: true, plan: "month", exp: NEWEXP(), token: "tok.restored.sig" });
  }
  if (me === "GET" && p === "/api/pass") return m.pass === "ok" ? J(200, { active: true, plan: "month", exp: NEWEXP(), devices: { n: 2, max: 3 } }) : J(401, { active: false });
  return J(200, { ok: true });
}

/* ---- đo trong trang ---- */
function measure(opts) {
  const R = x => x.getBoundingClientRect();
  const vis = el => { const s = getComputedStyle(el); const r = R(el); return s.display !== "none" && s.visibility !== "hidden" && r.width > 3 && r.height > 3; };
  const out = { dens: document.documentElement.dataset.dens, problems: [] };
  const P = m => out.problems.push(m);
  const dlg = document.getElementById("dlg"), open = dlg.open;
  const scope = open ? dlg : document.body;
  /* 1) cuộn */
  const se = document.scrollingElement, main = document.querySelector("main");
  if (se.scrollHeight > innerHeight + 1) P("trang cuộn dọc " + se.scrollHeight + ">" + innerHeight);
  if (se.scrollWidth > innerWidth + 1) P("trang cuộn ngang " + se.scrollWidth + ">" + innerWidth);
  if (main.scrollHeight > main.clientHeight + 1) P("<main> cuộn " + main.scrollHeight + ">" + main.clientHeight);
  if (open) {
    if (dlg.scrollHeight > dlg.clientHeight + 1) P("hộp thoại cuộn " + dlg.scrollHeight + ">" + dlg.clientHeight);
    const r = R(dlg); if (r.top < -0.5 || r.left < -0.5 || r.bottom > innerHeight + 0.5 || r.right > innerWidth + 0.5) P("hộp thoại ra ngoài khung nhìn " + [r.top, r.left, r.bottom, r.right].map(Math.round));
  }
  /* 2) chữ tràn thẻ */
  const cardSel = ".plan,.card,.m,.status,.dlg,button,.kv,.sum li,table,.steps li,.foot";
  scope.querySelectorAll("*").forEach(el => {
    if (!vis(el)) return;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!own) return;
    const s = getComputedStyle(el), r = R(el);
    if (s.textOverflow === "ellipsis") return;
    const card = el.closest(cardSel) || el;
    const cr = R(card);
    if (r.right > cr.right + 1.5 || r.left < cr.left - 1.5) P("chữ tràn ngang thẻ: " + (el.className || el.tagName) + " '" + el.textContent.trim().slice(0, 24) + "' " + Math.round(r.left) + "-" + Math.round(r.right) + " / " + Math.round(cr.left) + "-" + Math.round(cr.right));
    if (r.right > innerWidth + 1 || r.left < -1) P("chữ ra ngoài màn hình: " + el.textContent.trim().slice(0, 24));
    if (el.scrollWidth > el.clientWidth + 1 && (s.overflowX === "hidden" || s.overflowX === "clip") && s.display !== "inline") P("chữ bị cắt: " + el.textContent.trim().slice(0, 24));
    if (card !== el && r.bottom > cr.bottom + 1.5 && card.matches(".plan,.card,.m,.status")) P("chữ tràn đáy thẻ: " + el.textContent.trim().slice(0, 24));
  });
  /* 3) vùng chạm >= 44 */
  scope.querySelectorAll("button,a,input,[role=radio]").forEach(el => {
    if (!vis(el) || el.disabled) return;
    if (el.matches(".fine a")) return;     // liên kết nằm trong đoạn văn
    const r = R(el);
    if (r.height < 43.5 || r.width < 43.5) P("vùng chạm nhỏ " + Math.round(r.width) + "x" + Math.round(r.height) + ": " + (el.id || el.className || el.tagName) + " '" + (el.textContent || "").trim().slice(0, 16) + "'");
  });
  /* 4) tương phản */
  const COL = /rgba?\([^)]*\)|color\(srgb[^)]*\)/g;
  const parse = c => {
    if (!c) return null; let m;
    if ((m = c.match(/^rgba?\(([^)]*)\)$/))) { const a = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [a[0], a[1], a[2], a.length > 3 ? a[3] : 1]; }
    if ((m = c.match(/^color\(srgb ([^)]*)\)$/))) { const a = m[1].split(/[ \/]+/).filter(Boolean).map(Number); return [a[0] * 255, a[1] * 255, a[2] * 255, a.length > 3 ? a[3] : 1]; }
    return null;
  };
  const over = (f, b) => { const a = f[3]; return [f[0] * a + b[0] * (1 - a), f[1] * a + b[1] * (1 - a), f[2] * a + b[2] * (1 - a), 1]; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const baseBg = parse(getComputedStyle(document.documentElement).backgroundColor) || [255, 255, 255, 1];
  /* danh sách nền khả dĩ phía sau phần tử (xét cả các điểm dừng của gradient, lấy trường hợp xấu nhất) */
  const bgsFor = el => {
    const chain = []; for (let e = el; e && e !== document.documentElement; e = e.parentElement) chain.push(e);
    let cands = [baseBg];
    for (let i = chain.length - 1; i >= 0; i--) {
      const e = chain[i]; if (e === document.body) continue;
      const s = getComputedStyle(e);
      const bc = parse(s.backgroundColor), stops = (s.backgroundImage.match(/linear-gradient/) ? (s.backgroundImage.match(COL) || []).map(parse).filter(Boolean) : []);
      if (bc && bc[3] > 0) cands = cands.map(c => over(bc, c));
      if (stops.length) cands = [].concat(...stops.map(st => cands.map(c => over(st, c))));
    }
    return cands;
  };
  scope.querySelectorAll("*").forEach(el => {
    if (!vis(el) || el.disabled) return;
    if (!([...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))) return;
    if (el.closest("[disabled]")) return;
    const s = getComputedStyle(el); let fg = parse(s.color); if (!fg) return;
    let op = 1; for (let e = el; e; e = e.parentElement) op *= Number(getComputedStyle(e).opacity);
    const px = parseFloat(s.fontSize), bold = parseInt(s.fontWeight) >= 700, large = px >= 24 || (px >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    let worst = 99;
    for (const b of bgsFor(el)) { const f = [fg[0], fg[1], fg[2], fg[3] * op]; worst = Math.min(worst, cr(over(f, b), b)); }
    if (worst < need) P("tương phản " + worst.toFixed(2) + " < " + need + ": " + (el.className || el.tagName) + " '" + el.textContent.trim().slice(0, 22) + "'");
  });
  return out;
}

(async () => {
  await new Promise(r => srv.listen(0, "127.0.0.1", r));
  const B = "http://127.0.0.1:" + srv.address().port;
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const errors = [];

  async function newPage(w, h, theme, lang, mock, q = "", pre) {
    const ctx = await (br.createBrowserContext || br.createIncognitoBrowserContext).call(br);   // hồ sơ riêng: localStorage/IndexedDB không dính giữa các ca
    const pg = await ctx.newPage(); const _close = pg.close.bind(pg); pg.close = async () => { await _close().catch(() => {}); await ctx.close().catch(() => {}); };
    await pg.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800 });
    await pg.setRequestInterception(true);
    pg.on("request", req => {
      const u = req.url();
      if (u.startsWith(B + "/api/")) { const r = route(mock, req); return r === "abort" ? req.abort("failed") : req.respond(r); }
      if (u.startsWith(B)) return req.continue();
      if (u.startsWith("data:")) return req.continue();
      return req.respond({ status: 200, contentType: "image/png", body: PNG });   // ảnh QR từ img.vietqr.io: không ra mạng
    });
    pg.on("pageerror", e => errors.push("pageerror: " + e.message));
    pg.on("console", m => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push("console: " + m.text()); });
    await pg.evaluateOnNewDocument((th, lg, pr) => { try { localStorage.setItem("theme", th); localStorage.setItem("lang", lg); if (pr) localStorage.setItem("pass", JSON.stringify(pr)); } catch (e) {} }, theme, lang, pre || null);
    await pg.goto(B + "/subscribe.html" + q, { waitUntil: "load" });
    await wait(250);
    return pg;
  }
  const shot = async (pg, name) => { if (shotDir) { fs.mkdirSync(shotDir, { recursive: true }); await pg.screenshot({ path: path.join(shotDir, name + ".png") }); } };
  const check = async (pg, tag, shotName) => {
    await wait(120);
    const r = await pg.evaluate(measure);
    r.problems.forEach(p => note(false, tag, p));
    if (shotName) await shot(pg, shotName);
    return r;
  };
  const dlgOpen = pg => pg.evaluate(() => document.getElementById("dlg").open);
  const openRestore = async pg => { if (!(await pg.evaluate(() => { const b = document.getElementById("restore"); return b.getClientRects().length > 0 && getComputedStyle(b).visibility !== "hidden"; }))) { await pg.click("nav.nav .bars-more, .foot .bars-more"); await wait(80); } await pg.click("#restore"); };
  const closeD = async pg => { await pg.keyboard.press("Escape"); await wait(80); };

  /* ===== 1) ma trận cỡ x theme x ngôn ngữ x trạng thái ===== */
  const combos = [];
  for (const [w, h] of SIZES) for (const th of ["light", "dark"]) for (const lg of ["vi", "en"]) {
    if (quick && lg === "en" && !(w === 390 && th === "light")) continue;
    combos.push([w, h, th, lg]);
  }
  for (const [w, h, th, lg] of combos) {
    const T = w + "x" + h + " " + th + " " + lg;
    const mock = makeMock();
    const activePass = { plan: "month", exp: new Date(NEWEXP()).toISOString(), email: "me@example.com", token: "tok.test.sig" };
    const sn = n => w + "x" + h + "-" + th + "-" + lg + "-" + n;
    /* bước 1 */
    let pg = await newPage(w, h, th, lg, mock);
    await check(pg, T + " bước1", sn("1-chon-goi"));
    /* bước 2 */
    await pg.click("#next"); await wait(200);
    note(await pg.evaluate(() => !document.getElementById("s2").hidden), T, "không sang được bước 2");
    await check(pg, T + " bước2", sn("2-thanh-toan"));
    /* hộp DEMO không có (PAY_API có sẵn trên http): hộp QR/VietQR */
    await pg.type("#email", "me@example.com");
    await pg.click("#buy"); await wait(400);
    note(await dlgOpen(pg), T, "hộp thanh toán không mở");
    await check(pg, T + " hộp QR", sn("3-qr"));
    await closeD(pg);
    /* Khôi phục bước 1, 2 */
    await openRestore(pg); await wait(250);
    note(await dlgOpen(pg), T, "hộp Khôi phục không mở");
    await check(pg, T + " khôi phục 1", sn("4-khoi-phuc-1"));
    await pg.click("#go"); await wait(300);
    if (await pg.$("#rO")) {
      await check(pg, T + " khôi phục 2", sn("5-khoi-phuc-2"));
      await pg.type("#rO", "12"); await wait(50);
      mock.verify = "bad"; await pg.click("#go"); await wait(300);
      note(await pg.evaluate(() => document.getElementById("rErr").textContent.length > 0), T, "OTP sai không có thông báo lỗi");
      await check(pg, T + " khôi phục 2 lỗi", sn("5b-khoi-phuc-loi"));
    } else note(false, T, "không sang được bước 2 của Khôi phục");
    await closeD(pg);
    /* thành công + lỗi + hết hạn (gọi thẳng hàm dựng hộp, bản luồng thật ở mục 2) */
    await pg.evaluate(() => { document.getElementById("email").value = "me@example.com"; activate("me@example.com", { exp: Date.now() + 30 * 864e5, plan: "month", token: "t" }); });
    await wait(150); await check(pg, T + " thành công", sn("6-thanh-cong")); await closeD(pg);
    await pg.evaluate(() => errDlg({ status: 500 })); await wait(100); await check(pg, T + " lỗi", sn("7-loi")); await closeD(pg);
    await pg.evaluate(() => errDlg({ status: 429 })); await wait(100); await check(pg, T + " 429"); await closeD(pg);
    await pg.close();
    /* đã có gói (có token) và gói hết hạn */
    pg = await newPage(w, h, th, lg, makeMock(), "", activePass);
    await wait(300);
    note(await pg.evaluate(() => /Night Pass/.test(document.getElementById("status").textContent) && document.getElementById("status").classList.contains("on")), T, "không hiện banner đã có gói");
    await check(pg, T + " đã có gói", sn("8-da-co-goi"));
    await pg.click("#next"); await wait(200); await check(pg, T + " đã có gói bước2", sn("9-gia-han"));
    await pg.close();
    pg = await newPage(w, h, th, lg, makeMock(), "", { plan: "day", exp: new Date(Date.now() - 864e5).toISOString(), email: "me@example.com", token: "x" });
    await check(pg, T + " hết hạn", sn("8b-het-han"));
    await pg.close();
    if (quick) continue;
  }

  /* ===== 2) luồng nghiệp vụ (390x844 sáng VI) ===== */
  console.log("  luồng nghiệp vụ…");
  const F = "luồng";
  const VI = [390, 844, "light", "vi"];
  const poll = async (pg, n) => { for (let i = 0; i < n; i++) { await wait(500); } };
  {
    /* giá khớp server/app.js + chữ không tự gia hạn + liên kết terms */
    const src = fs.readFileSync(path.join(root, "server", "app.js"), "utf8");
    const srv2 = {}; for (const m of src.matchAll(/(day|week|month|year):\s*\{\s*amount:\s*(\d+)/g)) srv2[m[1]] = +m[2];
    const pgx = await newPage(...VI, makeMock());
    const prices = await pgx.evaluate(() => PLANS.map(p => [p.id, p.price]));
    prices.forEach(([id, pr]) => note(srv2[id] === pr, F, "giá " + id + " " + pr + " lệch server " + srv2[id]));
    note(JSON.stringify(Object.values(srv2)) === "[9000,18000,36000,199000]", F, "PLANS server không phải 9.000/18.000/36.000/199.000");
    const txt = await pgx.evaluate(() => [...document.querySelectorAll(".plan .price")].map(e => e.textContent));
    ["9.000", "18.000", "36.000", "199.000"].forEach((p, i) => note(txt[i] && txt[i].includes(p), F, "thẻ gói " + i + " không hiện " + p + " (" + txt[i] + ")"));
    await pgx.click("#next"); await wait(200);
    note(await pgx.evaluate(() => /không tự động gia hạn/i.test(document.getElementById("fine").textContent) && !!document.querySelector("#fine a[href='terms.html']")), F, "thiếu dòng không tự gia hạn + liên kết terms.html (VI)");
    note(await pgx.evaluate(() => !/nhắc trước/.test(document.body.textContent)), F, "còn lời hứa 'nhắc trước 1 ngày' (chưa có tính năng)");
    await pgx.evaluate(() => setLang("en")); await wait(100);
    note(await pgx.evaluate(() => /No auto-renewal/.test(document.getElementById("fine").textContent) && /refunds/i.test(document.querySelector("#fine a").textContent)), F, "thiếu dòng no auto-renewal + Terms & refunds (EN)");
    await pgx.close();
    /* nút Quay lại / chân trang */
    let p1 = await newPage(...VI, makeMock(), "?from=popplay/index.html");
    note(await p1.evaluate(() => document.getElementById("back").getAttribute("href") === "popplay/index.html"), F, "nút Quay lại không theo ?from=");
    await p1.close();
    p1 = await newPage(...VI, makeMock());
    note(await p1.evaluate(() => /index\.html$/.test(document.getElementById("back").getAttribute("href"))), F, "nút Quay lại mặc định không trỏ về trang chủ");
    note(await p1.evaluate(() => document.getElementById("fTerms").getAttribute("href") === "terms.html" && document.getElementById("fPriv").getAttribute("href") === "privacy.html" && /^mailto:/.test(document.getElementById("fMail").href)), F, "liên kết chân trang sai");
    for (const f of ["terms.html", "privacy.html"]) note(fs.existsSync(path.join(root, f)), F, f + " không tồn tại");
    /* tải lại ở bước 2 rồi Đổi gói không kẹt */
    await p1.click("#next"); await wait(150);
    await p1.reload({ waitUntil: "load" }); await wait(250);
    await p1.click("#next"); await wait(150); await p1.click("#prev"); await wait(250);
    note(await p1.evaluate(() => !document.getElementById("s1").hidden), F, "tải lại ở bước 2 rồi 'Đổi gói' bị kẹt ở bước 2");
    await p1.close();
  }
  /* email sai */
  {
    const pg = await newPage(...VI, makeMock()); await pg.click("#next"); await wait(150);
    await pg.type("#email", "khong-hop-le"); await pg.click("#buy"); await wait(150);
    note(await pg.evaluate(() => document.getElementById("emailErr").textContent.length > 4 && document.getElementById("email").getAttribute("aria-invalid") === "true" && !document.getElementById("dlg").open), F, "email sai không báo lỗi/ không chặn");
    await check(pg, F + " email sai", "flow-email-sai");
    await pg.close();
  }
  /* lỗi tạo đơn: mạng / 429 / 500 */
  for (const [mode, re] of [["net", /Có lỗi/], ["500", /Có lỗi/], ["429", /Quá nhiều/]]) {
    const m = makeMock(); m.order = mode; const pg = await newPage(...VI, m); await pg.click("#next"); await wait(150);
    await pg.type("#email", "a@b.co"); await pg.click("#buy"); await wait(500);
    note(await pg.evaluate(r => document.getElementById("dlg").open && new RegExp(r).test(document.getElementById("dlgBody").textContent), re.source), F, "tạo đơn lỗi '" + mode + "' không hiện hộp lỗi đúng");
    note(await pg.evaluate(() => !document.getElementById("buy").disabled), F, "nút thanh toán còn bị khoá sau lỗi " + mode);
    await closeD(pg); await pg.close();
  }
  /* đơn: pending -> Esc dừng poll; pending -> paid có token; paid không token; hết hạn -> tạo đơn mới */
  {
    const m = makeMock(); const pg = await newPage(...VI, m); await pg.click("#next"); await wait(150);
    await pg.type("#email", "a@b.co"); await pg.click("#buy"); await wait(400);
    const body = await pg.evaluate(() => document.getElementById("dlgBody").textContent);
    note(/NP4829XK/.test(body) && /0123456789/.test(body) && /36\.000/.test(body) && /Đang chờ thanh toán/.test(body), F, "hộp QR thiếu mã đơn/tài khoản/số tiền/trạng thái chờ");
    note(await pg.evaluate(() => /Còn \d+:\d\d/.test(document.getElementById("left").textContent)), F, "không có đếm ngược");
    await pg.keyboard.press("Escape"); await wait(100);
    const n0 = m.polls; await wait(3600);
    note(m.polls === n0, F, "đóng hộp (Esc) mà vẫn poll đơn");
    /* mở lại, poll paid */
    m.poll = "paid"; await pg.click("#buy"); await wait(3700);
    const st = await pg.evaluate(() => ({ open: document.getElementById("dlg").open, t: document.getElementById("dlgBody").textContent, pass: JSON.parse(localStorage.getItem("pass") || "null") }));
    note(st.open && /thành công/i.test(st.t) && st.pass && st.pass.token === "tok.test.sig", F, "paid không dẫn tới hộp thành công + lưu token");
    await check(pg, F + " thành công thật", "flow-thanh-cong");
    await pg.close();
  }
  {
    const m = makeMock(); m.poll = "paid-notoken"; const pg = await newPage(...VI, m); await pg.click("#next"); await wait(150);
    await pg.type("#email", "a@b.co"); await pg.click("#buy"); await wait(3700);
    note(await pg.evaluate(() => document.getElementById("dlg").open && !!document.getElementById("rE") && /Đã nhận tiền/.test(document.getElementById("dlgBody").textContent)), F, "paid không token: không mời khôi phục kèm giải thích");
    note(await pg.evaluate(() => document.getElementById("rE").value === "a@b.co"), F, "ô email Khôi phục không điền sẵn");
    await check(pg, F + " paid không token", "flow-paid-khong-token");
    await pg.close();
  }
  {
    const m = makeMock(); m.poll = "expired"; const pg = await newPage(...VI, m); await pg.click("#next"); await wait(150);
    await pg.type("#email", "a@b.co"); await pg.click("#buy"); await wait(3700);
    note(await pg.evaluate(() => !!document.getElementById("again") && /hết hạn/.test(document.getElementById("dlgBody").textContent)), F, "đơn hết hạn không có nút Tạo đơn mới");
    await check(pg, F + " đơn hết hạn", "flow-het-han");
    const c0 = m.created; await pg.click("#again"); await wait(400);
    note(m.created === c0 + 1 && await pg.evaluate(() => /NP4829XK/.test(document.getElementById("dlgBody").textContent)), F, "'Tạo đơn mới' không tạo đơn");
    await pg.close();
  }
  /* Khôi phục: OTP sai / 429 / không có gói / thành công; 429 ngay bước gửi mã */
  for (const [mode, expectRe] of [["bad", /Mã không đúng/], ["none", /chưa có gói/], ["429", /Quá nhiều/], ["ok", null]]) {
    const m = makeMock(); m.verify = mode; const pg = await newPage(...VI, m);
    await openRestore(pg); await wait(250);
    await pg.type("#rE", "a@b.co"); await pg.keyboard.press("Enter"); await wait(400);
    note(await pg.evaluate(() => !!document.getElementById("rO")), F, "Enter ở ô email không gửi mã (" + mode + ")");
    await pg.type("#rO", "12ab34 5678"); await wait(50);
    note(await pg.evaluate(() => document.getElementById("rO").value === "123456"), F, "ô OTP không lọc chỉ 6 chữ số");
    await pg.keyboard.press("Enter"); await wait(450);
    if (expectRe) note(await pg.evaluate(r => new RegExp(r).test(document.getElementById("dlgBody").textContent), expectRe.source), F, "Khôi phục '" + mode + "' sai thông báo");
    else note(await pg.evaluate(() => !document.getElementById("dlg").open && JSON.parse(localStorage.getItem("pass") || "null").token === "tok.restored.sig" && document.getElementById("status").classList.contains("on")), F, "Khôi phục thành công không lưu token / không hiện banner");
    await pg.close();
  }
  { const m = makeMock(); m.restore = "429"; const pg = await newPage(...VI, m);
    await openRestore(pg); await wait(250); await pg.type("#rE", "a@b.co"); await pg.click("#go"); await wait(400);
    note(await pg.evaluate(() => /Quá nhiều/.test(document.getElementById("dlgBody").textContent)), F, "429 khi gửi mã không báo 'Quá nhiều'");
    await pg.close(); }
  /* banner gói: số thiết bị + nút Gia hạn */
  {
    const pg = await newPage(...VI, makeMock(), "", { plan: "month", exp: new Date(NEWEXP()).toISOString(), email: "m@e.co", token: "tok" });
    await wait(500);
    note(await pg.evaluate(() => /Thiết bị: 2\/3/.test(document.getElementById("status").textContent) && /cộng dồn/.test(document.getElementById("status").textContent)), F, "banner không hiện số thiết bị + cộng dồn");
    await pg.click("#next"); await wait(200);
    note(await pg.evaluate(() => /^Gia hạn/.test(document.getElementById("buy").textContent.trim())), F, "đã có gói nhưng nút không là 'Gia hạn'");
    await pg.close();
  }
  /* Pop Play (palette cùng Night Pass): tương phản + một màn */
  for (const th of ["light", "dark"]) { const pg = await newPage(390, 844, th, "vi", makeMock(), "?from=popplay/index.html"); await check(pg, F + " popplay " + th + " b1", "popplay-" + th); await pg.click("#next"); await wait(200); await check(pg, F + " popplay " + th + " b2"); await pg.close(); }

  errors.forEach(e => note(false, "console", e));
  await br.close(); srv.close();
  console.log(fails.length ? "\n✗ " + fails.length + " lỗi (check-subscribe)" : "\n✓ check-subscribe: tất cả đạt");
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
