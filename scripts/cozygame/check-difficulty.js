/* Bài đo THEME THEO ĐỘ KHÓ (GAME_RULES mục 5i; shared/difficulty.js + difficulty.css). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-difficulty.js [--quick] [--full] [--land] [--shots=<thư mục>] [id,id]
   Với MỖI game có chọn độ khó, chọn TỪNG độ khó rồi đo:
   - html[data-dif] đúng bậc (Dễ/Thường/Khó/Rất khó/Cực khó), biến --accent của game đổi và KHÁC NHAU giữa các độ khó;
   - chip đang chọn dùng màu độ khó, chữ trên chip/huy hiệu tương phản ≥ 4.5:1;
   - huy hiệu #npDifBadge hiện ở MÀN CHƠI và MÀN KẾT THÚC (nhãn đúng ngôn ngữ, không đè nút/chữ: data-free=1);
   - không cuộn trang; không lỗi JS.
   Mặc định: mọi game, 390x844, chủ đề tối/sáng + vi/en xen kẽ. --quick: 5 game đại diện (nối vào check.js). --full: 2 chủ đề × 2 ngôn ngữ × (390x844, 844x390).
   --shots=<thư mục>: lưu ảnh chọn/chơi/kết thúc từng độ khó. Thoát mã 1 nếu có lỗi. */
const { spawn } = require("child_process"), path = require("path"), fs = require("fs"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8879, BASE = "http://localhost:" + PORT + "/";
const args = process.argv.slice(2), QUICK = args.includes("--quick"), FULL = args.includes("--full");
const SHOTS = (args.find(a => a.startsWith("--shots=")) || "").slice(8), only = (args.find(a => !a.startsWith("--")) || "").split(",").filter(Boolean);
const LAND = args.includes("--land");   /* chỉ màn ngang 844x390, tối/vi + sáng/en */
const NAMES = ["easy", "normal", "hard", "extreme", "insane"];
const map = (n, i) => n <= 5 ? [[0, 2], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4]][n - 2][i] : Math.round(i * 4 / (n - 1));
const POPEND = "try{finish()}catch(e){try{endRun()}catch(e2){}}";
const POP = id => ({ id, url: "popplay/games/" + id + "/index.html", chips: ".lvs>button", start: "begin(0,{})", end: POPEND });
/* khai báo mọi game có chọn độ khó: chips = bộ chọn chip; size = [giá trị] cho game chọn bằng ô số */
const GAMES = [
  POP("qua-song"), POP("thap-vong-mau"), POP("be-dau-bo-me"), POP("bo-me-5-giay"), POP("doan-tuoi-nao"), POP("ve-chu-quai-vat"), POP("nhay-theo-so"),
  POP("ten-lua-cua-be"), POP("con-vat-an-so"), POP("be-noi-dung-khong"),
  { id: "ga-me-ban-trung", url: "cozyplay/games/ga-me-ban-trung/index.html", chips: "#lvs>button", start: "document.getElementById('bFree').click()", end: "try{G.over=true;endGame()}catch(e){}" },
  { id: "cho-hang-kieu-viet", url: "cozyplay/games/cho-hang-kieu-viet/index.html", chips: "#lvs>button", start: "document.getElementById('bFree').click()", end: "try{G.over=true;endRun()}catch(e){}" },
  { id: "dap-deadline", url: "cozyplay/games/dap-deadline/index.html", chips: "#lvs>button", force: true, start: "document.getElementById('bPlay').click()", end: "try{end()}catch(e){}" },
  { id: "cozy-wings", url: "cozyplay/games/cozy-wings/index.html", chips: "#diffs>button", start: "(document.querySelector('#cards .tile .main')||document.querySelector('#cards .daily')).click();setTimeout(()=>{const g=document.getElementById('hwGo');g&&g.click()},700)", end: "try{finishRound()}catch(e){}" },
  { id: "me-cung-truyen-tay", url: "cozyplay/games/me-cung-truyen-tay/index.html", size: [5, 8, 11, 14], start: "document.getElementById('bFree').click()", end: "try{finishRun()}catch(e){}" },
];
const QUICKIDS = ["qua-song", "ga-me-ban-trung", "dap-deadline", "me-cung-truyen-tay", "cozy-wings"];
const list = GAMES.filter(g => only.length ? only.includes(g.id) : QUICK ? QUICKIDS.includes(g.id) : true);
const fails = []; const note = (ok, msg) => { if (!ok) { fails.push(msg); console.log("  ✗ " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

/* chạy trong trang: đo huy hiệu + biến màu */
const MEASURE = () => {
  const toRGB = c => { const x = document.createElement("canvas").getContext("2d"); x.fillStyle = "#000"; x.fillStyle = c; x.fillRect(0, 0, 1, 1); const d = x.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]]; };
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  const cr = (a, b) => { const A = lum(toRGB(a)), B = lum(toRGB(b)); return (Math.max(A, B) + .05) / (Math.min(A, B) + .05); };
  const D = document.documentElement, cs = getComputedStyle(D), b = document.getElementById("npDifBadge"), out = { dif: D.dataset.dif || null, accent: cs.getPropertyValue("--accent").trim(), dark: D.dataset.theme === "dark" };
  out.scroll = D.scrollHeight > innerHeight + 1 || D.scrollWidth > innerWidth + 1;
  if (b) { const r = b.getBoundingClientRect(), s = getComputedStyle(b); out.badge = { shown: b.classList.contains("show") && s.display !== "none" && r.width > 10 && +s.opacity > .5 && r.left >= 0 && r.top >= 0 && r.right <= innerWidth + .5 && r.bottom <= innerHeight + .5, free: b.dataset.free, text: b.textContent, cr: +cr(s.backgroundColor, s.color).toFixed(2), w: Math.round(r.width), h: Math.round(r.height) }; }
  const chip = document.querySelector(":is(.lvs,#lvs,#diffs)>.on,:is(.lvs,#lvs,#diffs)>[aria-pressed=true]");
  if (chip) { const s = getComputedStyle(chip); out.chip = { cr: +cr(s.backgroundColor, s.color).toFixed(2), bg: s.backgroundColor, dt: chip.dataset.dt || null }; }
  return out;
};
const LABEL = { vi: ["Dễ", "Thường", "Khó", "Rất khó", "Cực khó"], en: ["Easy", "Normal", "Hard", "Expert", "Insane"] };

(async () => {
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const combos = [];
  const VPS = LAND ? [[844, 390]] : FULL ? [[390, 844], [844, 390]] : [[390, 844]];
  list.forEach((g, gi) => { if (LAND) for (const [th, lg] of [["dark", "vi"], ["light", "en"]]) combos.push([g, VPS[0], th, lg]); else if (FULL) for (const vp of VPS) for (const th of ["dark", "light"]) for (const lg of ["vi", "en"]) combos.push([g, vp, th, lg]); else combos.push([g, VPS[0], gi % 2 ? "light" : "dark", gi % 3 === 1 ? "en" : "vi"]); });
  let lastId = "";
  for (const [g, [W, H], theme, lang] of combos) {
    if (g.id !== lastId) { console.log("== " + g.id); lastId = g.id; }
    const tag = g.id + " " + W + "x" + H + " " + theme + "/" + lang;
    let N = g.size ? g.size.length : null; const accents = [], doms = [];
    for (let i = 0; ; i++) {
      const pg = await br.newPage(), errs = []; pg.on("pageerror", e => errs.push(e.message));
      await pg.setViewport({ width: W, height: H, isMobile: true, hasTouch: true });
      await pg.evaluateOnNewDocument((th, lg) => { try { localStorage.clear(); localStorage.setItem("np-sound", "0"); localStorage.setItem("theme", th); localStorage.setItem("lang", lg); for (const k of ["bg", "vn", "cb", "mt", "nn", "og", "ss", "sv", "xc", "xn", "dd", "xcp", "dr", "mz", "gc", "gm", "ch", "bh"]) localStorage.setItem(k + "-tut", "1"); } catch (e) {} }, theme, lang);
      await pg.goto(BASE + g.url + "?lang=" + lang); await wait(900);
      if (N == null) N = await pg.evaluate(s => document.querySelectorAll(s).length, g.chips);
      if (i >= N) { await pg.close(); break; }
      const exp = NAMES[map(N, i)], lbl = LABEL[lang][map(N, i)], t2 = tag + " cấp " + (i + 1) + "/" + N + " (" + exp + ")";
      if (g.size) await pg.evaluate(v => { const e = document.getElementById("szI"); e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); }, g.size[i]);
      else if (g.force) await pg.evaluate((k, ids) => { DD.catalog.diffs.forEach(x => { x.free = 1; }); DD.want = Object.assign(DD.want || {}, { diff: ids[k] }); DD.refresh(); }, i, ["easy", "normal", "hard", "rage"]);   /* Đập Deadline: độ khó trả phí bị khoá ở bản free → mở khoá giả lập để đo theme */
      else await pg.evaluate((s, k) => document.querySelectorAll(s)[k].click(), g.chips, i);
      await wait(450);
      const h = await pg.evaluate(MEASURE);
      note(h.dif === exp, t2 + " chọn: data-dif=" + h.dif + " (cần " + exp + ")");
      note(!h.badge || !h.badge.shown, t2 + " chọn: huy hiệu không nên hiện ở màn chọn");
      if (h.chip) { note(h.chip.cr >= 4.5, t2 + " chọn: chữ trên chip đang chọn tương phản " + h.chip.cr + " (<4.5)"); note(h.chip.dt === exp, t2 + " chọn: chip chưa gắn data-dt=" + exp); }
      else note(!!g.size, t2 + " chọn: không tìm thấy chip đang chọn");
      note(!h.scroll, t2 + " chọn: trang bị cuộn/tràn");
      accents.push(h.accent); doms.push(h.dif);
      if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, [g.id, W + "x" + H, theme, lang, "c" + (i + 1), "chon"].join("-") + ".png") });
      await pg.evaluate(g.start); await wait(1400);
      const p = await pg.evaluate(MEASURE);
      note(p.dif === exp, t2 + " chơi: data-dif=" + p.dif);
      note(p.badge && p.badge.shown, t2 + " chơi: huy hiệu không hiện (" + JSON.stringify(p.badge) + ")");
      if (p.badge && p.badge.shown) { note(p.badge.free === "1", t2 + " chơi: huy hiệu đè lên nút/chữ"); note(p.badge.cr >= 4.5, t2 + " chơi: chữ huy hiệu tương phản " + p.badge.cr); note(p.badge.text.includes(lbl), t2 + " chơi: nhãn huy hiệu '" + p.badge.text + "' (cần có '" + lbl + "')"); }
      note(!p.scroll, t2 + " chơi: trang bị cuộn/tràn");
      if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, [g.id, W + "x" + H, theme, lang, "c" + (i + 1), "choi"].join("-") + ".png") });
      await pg.evaluate(g.end); await wait(1700);
      const e = await pg.evaluate(MEASURE);
      note(e.dif === exp, t2 + " kết thúc: data-dif=" + e.dif);
      note(e.badge && e.badge.shown, t2 + " kết thúc: huy hiệu không hiện (" + JSON.stringify(e.badge) + ")");
      if (e.badge && e.badge.shown) { note(e.badge.free === "1", t2 + " kết thúc: huy hiệu đè lên nút/chữ"); note(e.badge.cr >= 4.5, t2 + " kết thúc: tương phản " + e.badge.cr); }
      note(!e.scroll, t2 + " kết thúc: trang bị cuộn/tràn");
      if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, [g.id, W + "x" + H, theme, lang, "c" + (i + 1), "ketthuc"].join("-") + ".png") });
      note(!errs.length, t2 + ": lỗi JS " + errs.slice(0, 1));
      await pg.close();
    }
    note(new Set(accents).size === accents.length && accents.length >= 2, tag + ": --accent phải KHÁC NHAU giữa các độ khó, đo được " + accents.join(" / "));
    console.log("  " + doms.join(" → ") + " · accent " + accents.join(" "));
  }
  await br.close(); srv.kill();
  console.log(fails.length ? "\n✗ " + fails.length + " lỗi theme theo độ khó" : "\n✓ theme theo độ khó đạt (" + list.length + " game)");
  process.exit(fails.length ? 1 : 0);
})();
