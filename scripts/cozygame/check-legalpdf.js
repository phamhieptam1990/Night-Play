/* Kiểm tra 4 file PDF pháp lý đã COMMIT (legal/privacy-vi|en.pdf, legal/terms-vi|en.pdf) + nút "Tải PDF" trên privacy.html / terms.html. Chạy:
     NODE_PATH=<thư mục có puppeteer-core[,pdfjs-dist]> node scripts/cozygame/check-legalpdf.js [--rebuild]   (tự chạy http.server cổng 8883)
   --rebuild: chạy scripts/build-legal-pdf.js trước (ghi đè các PDF; commit lại nếu đổi).
   Điều kiện:
     - tồn tại, bắt đầu bằng %PDF, dung lượng 20KB..700KB (cảnh báo > 500KB), có /Title, gắn thẻ (/StructTreeRoot) và outline (/Outlines);
     - (cần pdfjs-dist, nếu không có thì chỉ in cảnh báo) >= 4 trang, có tiêu đề mọi mục h2/h3 đang có trên trang web (PDF không lỗi thời so với nội dung),
       mục đánh số 1..N đủ, có ký tự tiếng Việt có dấu đúng (VI), có email, ngày hiệu lực, chân trang "Trang X / Y", KHÔNG còn "[CẦN" chưa thành ô trống,
       KHÔNG lộ chữ số nào của số định danh/CCCD, có thông tin chủ website (tên, địa chỉ);
     - nút Tải PDF (#pdfBtn, chân trang #fPdf) trỏ đúng file theo ngôn ngữ đang xem, có thuộc tính download, ≥ 44px khi hiện, HTTP 200 + application/pdf;
       <link rel="alternate" type="application/pdf"> có trong head. */
const { spawn, spawnSync } = require("child_process"), fs = require("fs"), path = require("path"), http = require("http"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8883, B = "http://localhost:" + PORT + "/", fails = [], warns = [];
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));
let pdfjs = null; try { pdfjs = require("pdfjs-dist/legacy/build/pdf.js"); } catch (e) {}
const get = u => new Promise(res => http.get(u, r => { const c = []; r.on("data", d => c.push(d)); r.on("end", () => res({ s: r.statusCode, t: r.headers["content-type"] || "", n: Buffer.concat(c).length })); }).on("error", () => res({ s: 0, t: "", n: 0 })));
(async () => {
  if (process.argv.includes("--rebuild")) { const r = spawnSync(process.execPath, [path.join(root, "scripts", "build-legal-pdf.js")], { cwd: root, env: process.env, stdio: "inherit" }); note(r.status === 0, "build", "build-legal-pdf.js lỗi"); }
  if (!pdfjs) console.log("  (không có pdfjs-dist: bỏ qua kiểm tra nội dung PDF; cài tạm: npm i --no-save pdfjs-dist@3.11.174)");
  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  try {
    for (const kind of ["privacy", "terms"]) for (const lang of ["vi", "en"]) {
      const name = kind + "-" + lang, f = path.join(root, "legal", name + ".pdf"), tag = "PDF " + name;
      if (!fs.existsSync(f)) { note(false, tag, "không tồn tại"); continue; }
      const buf = fs.readFileSync(f), raw = buf.toString("latin1");
      note(raw.startsWith("%PDF"), tag, "không phải PDF");
      note(buf.length >= 20e3 && buf.length <= 700e3, tag, "dung lượng " + Math.round(buf.length / 1024) + " KB ngoài 20..700");
      if (buf.length > 500e3) warns.push(tag + " " + Math.round(buf.length / 1024) + " KB (> 500KB)");
      note(/\/Title/.test(raw), tag, "thiếu /Title"); note(/\/StructTreeRoot/.test(raw), tag, "PDF không gắn thẻ (tagged)"); note(/\/Outlines/.test(raw), tag, "thiếu outline/bookmark");
      /* nội dung hiện trên trang web */
      const p = await br.newPage(); await p.setViewport({ width: 1200, height: 800 });
      await p.goto(B + kind + ".html?lang=" + lang, { waitUntil: "load" }); await wait(700);
      const web = await p.evaluate(l => { const L = document.querySelector('#src .L[lang="' + l + '"]'); return { heads: [...L.querySelectorAll("h2,h3")].map(h => h.textContent.trim()), site: window.SITE, alt: [...document.querySelectorAll('link[rel=alternate][type="application/pdf"]')].map(a => a.getAttribute("hreflang") + "|" + a.getAttribute("href")) }; }, lang);
      note(web.alt.includes("vi|legal/" + kind + "-vi.pdf") && web.alt.includes("en|legal/" + kind + "-en.pdf"), tag, "thiếu <link rel=alternate type=application/pdf>: " + web.alt.join(","));
      await p.close();
      if (pdfjs) {
        const doc = await pdfjs.getDocument({ data: new Uint8Array(buf), useSystemFonts: true, verbosity: 0 }).promise; let text = "";
        for (let i = 1; i <= doc.numPages; i++) text += " " + (await (await doc.getPage(i)).getTextContent()).items.map(x => x.str).join(" ");
        const t = text.replace(/\s+/g, " "), norm = x => x.replace(/\s+/g, " ").trim();
        note(doc.numPages >= 4, tag, "chỉ " + doc.numPages + " trang");
        const miss = web.heads.filter(h => !t.includes(norm(h)));
        note(!miss.length, tag, "PDF lỗi thời/thiếu mục so với trang web: " + miss.slice(0, 3).join(" | "));
        const nums = web.heads.map(h => /^(\d+)\.\s/.exec(h)).filter(Boolean).map(m => +m[1]);
        note(nums.length >= 10 && nums.every((v, k) => v === k + 1), tag, "mục đánh số không đủ 1..N: " + nums.join(","));
        if (lang === "vi") note(/[ăâêôơưđ]/.test(t) && /[ạảấầẩẫậắằẳẵặẹẻẽếềểễệ]/.test(t) && !/�/.test(t), tag, "ký tự tiếng Việt có dấu không đúng/không trích được");
        note(t.includes("support@nightplay.vn") && t.includes(web.site.legalDate), tag, "thiếu email hoặc ngày hiệu lực");
        note(/Trang \d+ \/ \d+|Page \d+ \/ \d+/.test(t), tag, "thiếu chân trang 'Trang X / Y'");
        note(!t.includes("[CẦN"), tag, "còn '[CẦN' chưa thành ô trống");
        { const pre = "08" + "7", suf = "01" + "54"; note(!new RegExp(pre + "\\s*\\d{9}|" + pre + "[•*xX.\\s\\-]{2,12}" + suf + "|CCCD:?\\s*\\d").test(t.replace(/\s+/g, " ")), tag, "PDF lộ chữ số của số định danh/CCCD"); }
        note(t.includes(norm(web.site.operator)) && t.includes("Linh Đông"), tag, "thiếu thông tin chủ website (tên/địa chỉ)");
        note(t.includes(lang === "vi" ? "Mục lục" : "Contents"), tag, "thiếu mục lục");
      }
    }
    /* nút Tải PDF */
    for (const kind of ["privacy", "terms"]) for (const lang of ["vi", "en"]) for (const [w, h] of [[390, 844], [1440, 900]]) {
      const tag = "nút PDF " + kind + " " + lang + " " + w, p = await br.newPage(); await p.setViewport({ width: w, height: h, isMobile: w < 600, hasTouch: w < 600 });
      await p.evaluateOnNewDocument(l => { try { localStorage.setItem("lang", l); } catch (e) {} }, lang);
      await p.goto(B + kind + ".html", { waitUntil: "load" }); await wait(900);
      const r = await p.evaluate(() => { const g = id => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return { href: e.getAttribute("href"), dl: e.hasAttribute("download"), txt: e.textContent.trim(), w: b.width, h: b.height, shown: b.width > 0 && getComputedStyle(e).visibility !== "hidden" }; }; return { btn: g("pdfBtn"), foot: g("fPdf"), sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }; });
      const want = "legal/" + kind + "-" + lang + ".pdf";
      note(r.btn && r.btn.href === want && r.btn.dl, tag, "nút #pdfBtn sai href/download: " + JSON.stringify(r.btn));
      note(r.foot && r.foot.href === want && r.foot.dl, tag, "liên kết chân trang #fPdf sai: " + JSON.stringify(r.foot));
      if (r.btn && r.btn.shown) { note(r.btn.h >= 43.5 && r.btn.w >= 43.5, tag, "nút PDF nhỏ " + r.btn.w + "x" + r.btn.h); note(/PDF/.test(r.btn.txt) && /\d+ KB/.test(r.btn.txt), tag, "nút thiếu chữ PDF/dung lượng: " + r.btn.txt); }
      else note(h < 700 || w < 0, tag, "nút PDF không hiện ở màn đủ cao");
      note(r.sw <= r.vw + 1, tag, "tràn ngang");
      const res = await get(B + want); note(res.s === 200 && /pdf/.test(res.t) && res.n > 20e3, tag, "tải " + want + " không được: HTTP " + res.s + " " + res.t);
      await p.close();
    }
  } finally { await br.close(); srv.kill(); }
  warns.forEach(w => console.log("  ! " + w));
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi" : "✓ PDF pháp lý đạt"));
  process.exit(fails.length ? 1 : 0);
})();
