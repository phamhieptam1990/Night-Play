/* Kiểm tra trang pháp lý (privacy.html, terms.html). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-legal.js [--quick] [--shots=<thư mục ảnh>]   (tự chạy http.server cổng 8879)
   Điều kiện:
     - mở được ở VI và EN, tiêu đề tài liệu + h1 đúng ngôn ngữ, đủ các mục bắt buộc (danh sách tiêu đề dưới đây, mỗi ngôn ngữ);
     - email liên hệ đúng support@nightplay.vn; không còn chuỗi cũ (phamhieptam@gmail.com) ở bất kỳ file nào;
     - placeholder: chỉ được dạng "[CẦN ĐIỀN: ...]" (thông tin chủ site) và "[CẦN XÁC NHẬN: ...]" (quyết định của chủ site);
       IN RA số lượng còn lại để chủ site điền. Mọi dạng khác (TODO, TBD, lorem, [...]) là lỗi;
     - mục lục (nút ☰) mở được, có đủ trang, bấm một mục thì chuyển trang; nút trang trước/sau hoạt động;
     - không tràn ngang, trang sách không bị cắt chữ (scrollHeight <= clientHeight), nút điều hướng >= 40px (☰) / 44px (‹ ›, ngôn ngữ, theme),
       sáng + tối, 320x568, 390x844, 768x1024, 1440x900 (--quick: 320x568 + 1440x900, chỉ sáng + tối ở 390x844);
     - chân trang của 4 trang cổng (index, popplay, cozyplay, subscribe) có liên kết tới terms.html và privacy.html. */
const { spawn } = require("child_process"), fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, "..", ".."), PORT = 8879, B = "http://localhost:" + PORT + "/", fails = [];
const quick = process.argv.includes("--quick");
const shotDir = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8);
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } };
const wait = ms => new Promise(r => setTimeout(r, ms));

/* tiêu đề bắt buộc (khớp một phần, không phân biệt hoa thường) */
const REQ = {
  privacy: {
    vi: ["tóm tắt", "đơn vị vận hành", "phạm vi và căn cứ pháp lý", "dữ liệu chúng tôi xử lý", "dữ liệu lưu trên thiết bị", "khi bạn mua night pass", "otp", "bảng xếp hạng", "chơi hộ", "cookie", "mục đích và cơ sở", "dữ liệu của trẻ em", "bên thứ ba", "chuyển dữ liệu ra nước ngoài", "thời hạn lưu", "quyền của chủ thể dữ liệu", "khiếu nại", "bảo mật", "thanh toán và hoàn tiền", "thay đổi chính sách", "liên hệ"],
    en: ["summary", "operator and contact", "scope and legal basis", "data we process", "data stored on your device", "when you buy night pass", "otp", "leaderboard", "play-for-me", "cookies", "purposes and legal basis", "children", "third parties", "transfers abroad", "retention", "your rights", "complaints", "security", "payments and refunds", "changes and governing law", "contact"]
  },
  terms: {
    vi: ["tóm tắt", "thông tin chủ website", "chấp nhận điều khoản", "phạm vi dịch vụ", "night pass: gói và giá", "đặt hàng và thanh toán", "giao nhận dịch vụ", "hoàn tiền, huỷ gói", "chia sẻ gói", "hành vi bị cấm", "quyền và nghĩa vụ", "bảng xếp hạng", "sở hữu trí tuệ", "giới hạn trách nhiệm", "giải quyết khiếu nại và tranh chấp", "bảo vệ thông tin cá nhân", "thay đổi điều khoản"],
    en: ["summary", "website owner", "acceptance", "scope of service", "night pass: plans and prices", "ordering and payment", "delivery", "refunds and cancellation", "sharing", "prohibited conduct", "rights and obligations", "leaderboard", "intellectual property", "limits of liability", "complaints and disputes", "personal data protection", "changes and contact"]
  }
};
const TITLE = { privacy: { vi: "Chính sách bảo mật thông tin cá nhân", en: "Privacy Policy" }, terms: { vi: "Điều khoản sử dụng và quy chế hoạt động", en: "Terms of Use and Operating Rules" } };
const VPS = quick ? [[320, 568], [667, 375], [1440, 900]] : [[320, 568], [390, 844], [768, 1024], [1024, 768], [1440, 900], [667, 375]];

(async () => {
  /* chuỗi cũ không được còn ở bất kỳ file nguồn nào */
  const stale = [];
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (/^(node_modules|dist|\.git)$/.test(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (/\.(html|js|css|md|json|mjs|jsonc|webmanifest)$/.test(e.name) && e.name !== "code.md" && e.name !== "check-legal.js") { try { if (fs.readFileSync(p, "utf8").includes("phamhieptam@gmail.com")) stale.push(path.relative(root, p)); } catch (e2) {} }
  } };
  walk(root);
  note(!stale.length, "chuỗi cũ", "còn 'phamhieptam@gmail.com' trong: " + stale.join(", "));
  /* số CCCD đầy đủ (12 chữ số bắt đầu 087) KHÔNG được xuất hiện ở bất kỳ file công khai nào; chỉ dạng che "087•••••0154" */
  const leaks = [];
  const walk2 = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (/^(node_modules|dist|\.git)$/.test(e.name) || e.name === "code.md") continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk2(p); else if (/\.(html|js|css|md|json|mjs|jsonc|txt|xml|webmanifest|pdf)$/.test(e.name)) { try { if (/(?<!\d)087\d{9}(?!\d)/.test(fs.readFileSync(p, "latin1"))) leaks.push(path.relative(root, p)); } catch (e2) {} }
  } };
  walk2(root);
  note(!leaks.length, "CCCD", "có chuỗi 12 chữ số dạng CCCD đầy đủ trong: " + leaks.join(", "));
  const SITEJS = fs.readFileSync(path.join(root, "shared", "site.js"), "utf8");
  note(/taxId:\s*"CCCD: 087•••••\d{4}"/.test(SITEJS), "site.js", "taxId phải ở dạng che 'CCCD: 087•••••XXXX'");
  const lic = (SITEJS.match(/license:\s*"([^"]*)"/) || [])[1] || "";

  const srv = spawn("python3", ["-m", "http.server", String(PORT)], { cwd: root, stdio: "ignore" }); await wait(1200);
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
  const holes = new Map();   // placeholder -> số lần (đếm mỗi ngôn ngữ một lần)
  try {
    for (const kind of ["privacy", "terms"]) for (const lang of ["vi", "en"]) {
      const tagBase = kind + " " + lang;
      /* 1) nội dung: tiêu đề, email, placeholder */
      const pg = await br.newPage(); const errs = [];
      pg.on("pageerror", e => errs.push(String(e.message || e).slice(0, 100)));
      await pg.setViewport({ width: 1000, height: 800 });
      await pg.goto(B + kind + ".html?lang=" + lang, { waitUntil: "load" }); await wait(600);
      const d = await pg.evaluate((l) => {
        const L = document.querySelector('#src .L[lang="' + l + '"]');
        return { h1: L.querySelector("h1").textContent, heads: [...L.querySelectorAll("h2,h3")].map(h => h.textContent.toLowerCase()), text: L.textContent, mails: [...L.querySelectorAll("a[data-fill=email]")].map(a => a.getAttribute("href") + "|" + a.textContent), title: document.title, lang: document.documentElement.lang, rawTitle: !!document.querySelector("title") };
      }, lang);
      note(d.h1 === TITLE[kind][lang], tagBase, "h1 sai: " + d.h1);
      note(d.lang === lang && d.title.includes(lang === "vi" ? { privacy: "Chính sách", terms: "Điều khoản" }[kind] : { privacy: "Privacy", terms: "Terms" }[kind]), tagBase, "title tài liệu sai: " + d.title);
      for (const r of REQ[kind][lang]) note(d.heads.some(h => h.includes(r)), tagBase, "thiếu mục: " + r);
      note(d.mails.length >= 2 && d.mails.every(m => m === "mailto:support@nightplay.vn|support@nightplay.vn"), tagBase, "email liên hệ sai: " + d.mails.join(" ; "));
      note(!/phamhieptam|netlify/i.test(d.text), tagBase, "còn nhắc phamhieptam/netlify");
      note(!/TODO|TBD|lorem|\[\.\.\.\]|undefined|null\b|\[object/i.test(d.text), tagBase, "có TODO/TBD/lorem/undefined trong văn bản");
      const marks = d.text.match(/\[[^\]]*\]/g) || [];
      for (const m of marks) {
        const ok = /^\[CẦN (ĐIỀN|XÁC NHẬN): [^\]]{3,}\]$/.test(m);
        note(ok, tagBase, "placeholder sai dạng: " + m.slice(0, 60));
        if (lang === "vi") { const key = m.slice(0, 70); holes.set(key, (holes.get(key) || 0) + 1); }   // đếm theo bản VI (bản EN lặp lại cùng chỗ)
      }
      note(!errs.length, tagBase, "lỗi JS: " + errs.join(" | "));
      await pg.close();

      /* 2) bố cục + mục lục */
      for (const theme of ["light", "dark"]) for (const [w, h] of VPS) {
        if (quick && theme === "dark" && w !== 390 && w !== 1440) continue;
        const tag = tagBase + " " + theme + " " + w + "x" + h;
        const p = await br.newPage(); const e2 = [];
        p.on("pageerror", e => e2.push(String(e.message || e).slice(0, 100)));
        await p.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
        await p.evaluateOnNewDocument((t, l) => { try { localStorage.setItem("theme", t); localStorage.setItem("lang", l); } catch (e) {} }, theme, lang);
        await p.goto(B + kind + ".html", { waitUntil: "load" }); await wait(700);
        const m = await p.evaluate(() => {
          const body = document.getElementById("pgBody"), r = id => { const e = document.getElementById(id), b = e.getBoundingClientRect(); return { w: b.width, h: b.height }; };
          return { sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth, over: body.scrollHeight - body.clientHeight, pno: body.dataset.pno, dsh: document.documentElement.scrollHeight, vh: innerHeight, theme: document.documentElement.dataset.theme,
            menu: r("pgMenu"), vi: r("bVi"), en: r("bEn"), th: r("themeBtn"), foot: [...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href")), more: (() => { const e = document.querySelector(".nav .bars-more"); if (!e) return null; const b = e.getBoundingClientRect(); return { w: b.width, h: b.height }; })() };
        });
        note(m.theme === theme, tag, "theme không áp dụng: " + m.theme);
        note(m.sw <= m.vw + 1, tag, "tràn ngang " + m.sw + ">" + m.vw);
        note(m.over <= 1, tag, "trang sách bị cắt chữ " + m.over + "px");
        note(m.dsh <= m.vh + 1, tag, "trang bị cuộn dọc " + m.dsh + ">" + m.vh);
        note(m.menu.w >= 39.5 && m.menu.h >= 39.5, tag, "nút ☰ nhỏ " + m.menu.w + "x" + m.menu.h);
        if (m.more) note(m.more.w >= 43.5 && m.more.h >= 43.5, tag, "nút ⋯ nhỏ " + m.more.w + "x" + m.more.h);   // điện thoại: công cụ gom vào ⋯ (shared/bars.js)
        else note(m.vi.h >= 32 && m.en.h >= 32 && m.th.w >= 43.5 && m.th.h >= 43.5, tag, "nút ngôn ngữ/theme nhỏ");
        note(m.foot.includes("privacy.html") && m.foot.includes("terms.html"), tag, "chân trang thiếu liên kết privacy/terms");
        const total = +(/\/\s*(\d+)/.exec(m.pno || "") || [0, 0])[1];
        note(total >= 5, tag, "ít trang bất thường: " + m.pno);
        if (w === 390 || w === 1440) {
          /* mục lục + lật trang */
          await p.click("#pgMenu"); await wait(250);
          const n = await p.evaluate(() => document.querySelectorAll("#thList .th").length);
          note(n === total && n >= 5, tag, "mục lục có " + n + " mục, sách có " + total + " trang");
          if (shotDir && theme === "light") { fs.mkdirSync(shotDir, { recursive: true }); await p.screenshot({ path: path.join(shotDir, `${kind}-${lang}-${theme}-${w}-toc.png`) }); }
          if (n > 4) {
            await p.evaluate(() => document.querySelectorAll("#thList .th")[4].click()); await wait(1000);
            const after = await p.evaluate(() => ({ pno: document.getElementById("pgBody").dataset.pno, open: !document.getElementById("thumbs").hidden }));
            note(/^5 \//.test(after.pno), tag, "bấm mục 5 trong mục lục không chuyển trang: " + after.pno);
            if (after.open) await p.click("#thClose");
            await wait(200);
          }
          await p.evaluate(() => { document.getElementById("pgNext").classList.add("show"); }); await p.click("#pgNext"); await wait(1000);
          const nx = await p.evaluate(() => document.getElementById("pgBody").dataset.pno);
          note(/^(6|2) \//.test(nx), tag, "nút Trang sau không chuyển: " + nx);
          await p.evaluate(() => { document.getElementById("pgPrev").classList.add("show"); }); await p.click("#pgPrev"); await wait(1000);
          const pv = await p.evaluate(() => document.getElementById("pgBody").dataset.pno);
          note(/^(5|1) \//.test(pv), tag, "nút Trang trước không chuyển: " + pv);
          /* trang cuối: mọi trang đều vừa khung (duyệt toàn bộ) */
        }
        {
          /* MỌI trang: không cắt chữ; nút điều khiển (☰, ‹, ›) không giao với chữ; mục đánh số 1..N đúng một lần, đúng thứ tự */
          const r = await p.evaluate((n) => {
            const b = document.getElementById("pgBody"), out = { cut: [], hit: [], nums: [], tbl: [], w: [], xo: [], lone: [] };
            const btns = ["pgMenu", "pgPrev", "pgNext"].map(id => document.getElementById(id));
            for (let i = 0; i < n; i++) {
              show(i);
              if (b.scrollHeight - b.clientHeight > 1) out.cut.push((i + 1) + ":" + (b.scrollHeight - b.clientHeight));
              const rects = []; const tw = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
              for (let t = tw.nextNode(); t; t = tw.nextNode()) { if (!t.nodeValue.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(t); for (const q of rg.getClientRects()) if (q.width > 1 && q.height > 1) rects.push(q); }
              for (const e of btns) {
                if (!e || getComputedStyle(e).display === "none") continue; const q = e.getBoundingClientRect();
                if (q.width < 43.5 || q.height < 43.5) out.hit.push("trang " + (i + 1) + " " + e.id + " nhỏ " + q.width + "x" + q.height);
                for (const t of rects) if (q.left < t.right - 1 && q.right > t.left + 1 && q.top < t.bottom - 1 && q.bottom > t.top + 1) { out.hit.push("trang " + (i + 1) + " " + e.id + " đè chữ"); break; }
              }
              /* thẻ (bảng): không còn <table>/<th> lặp, cùng cỡ giữa các trang, không tràn ngang/cắt chữ, trang chỉ có 1 thẻ lẻ là bất thường */
              if (b.querySelector("table,th")) out.tbl.push(i + 1);
              const cs = [...b.querySelectorAll("li.card")];
              cs.forEach(c => { out.w.push(Math.round(c.getBoundingClientRect().width)); if (c.scrollWidth > c.clientWidth + 1) out.xo.push((i + 1) + ":" + c.textContent.slice(0, 20)); });
              if (b.scrollWidth > b.clientWidth + 1) out.xo.push((i + 1) + ":trang");
              if (cs.length === 1 && [...b.children].filter(e => !e.classList.contains("cont")).length === 1) out.lone.push(i + 1);
              b.querySelectorAll("h2").forEach(h => { const m = /^(\d+)\./.exec(h.textContent.trim()); if (m) out.nums.push(+m[1]); });
            }
            return out;
          }, total);
          note(!r.cut.length, tag, "trang bị cắt chữ (trang:px) " + r.cut.join(", "));
          note(!r.hit.length, tag, "nút điều khiển: " + r.hit.slice(0, 4).join("; "));
          note(r.nums.length >= 10 && r.nums.every((v, k) => v === k + 1), tag, "mục đánh số không đúng 1..N một lần theo thứ tự: " + r.nums.join(","));
          note(!r.tbl.length, tag, "còn <table>/<th> (tiêu đề cột lặp) ở trang " + r.tbl.join(","));
          note(!r.xo.length, tag, "thẻ/trang tràn ngang hoặc cắt chữ: " + r.xo.slice(0, 3).join("; "));
          note(r.w.length >= 10 && Math.max(...r.w) - Math.min(...r.w) <= 2, tag, "độ rộng thẻ không đều giữa các trang: " + [...new Set(r.w)].join("/"));
          note(!r.lone.length || h < 760, tag, "trang chỉ có MỘT thẻ lẻ: " + r.lone.join(","));
          await p.evaluate(() => show(0));
        }
        if (shotDir) { fs.mkdirSync(shotDir, { recursive: true }); await p.screenshot({ path: path.join(shotDir, `${kind}-${lang}-${theme}-${w}x${h}.png`) }); }
        note(!e2.length, tag, "lỗi JS: " + e2.join(" | "));
        await p.close();
      }
    }
    /* neo terms.html#hoan-tien mở đúng trang sách chứa mục Hoàn tiền (VI + EN, điện thoại + máy tính) */
    for (const lang of ["vi", "en"]) for (const [w, h] of [[390, 844], [1440, 900]]) {
      const p = await br.newPage(); await p.setViewport({ width: w, height: h, isMobile: w < 600, hasTouch: w < 600 });
      await p.evaluateOnNewDocument(l => { try { localStorage.setItem("lang", l); } catch (e) {} }, lang);
      await p.goto(B + "terms.html#hoan-tien", { waitUntil: "load" }); await wait(2200);
      const ok = await p.evaluate(() => { const hd = document.querySelector("#pgBody h2[data-anchor=hoan-tien]"); return !!hd && hd.getBoundingClientRect().top < innerHeight; });
      note(ok, "neo #hoan-tien " + lang + " " + w, "không mở đúng trang chứa mục Hoàn tiền");
      await p.close();
    }
    /* 3) chân trang các trang cổng */
    for (const [u, a] of [["play/index.html", "#priv"], ["popplay/index.html", "#fPriv"], ["cozyplay/index.html", "#fPriv"], ["subscribe.html", "#fPriv"]]) {
      const p = await br.newPage(); await p.setViewport({ width: 1280, height: 800 });
      await p.goto(B + u + "?lang=vi", { waitUntil: "load" }); await wait(800);
      const hrefs = await p.evaluate(() => [...document.querySelectorAll("footer a, .gf a")].map(x => x.getAttribute("href") || ""));
      note(hrefs.some(h => /(^|\/)terms\.html$/.test(h)) && hrefs.some(h => /(^|\/)privacy\.html$/.test(h)), "chân trang " + u, "thiếu liên kết terms.html/privacy.html: " + hrefs.join(" "));
      await p.close();
    }
  } finally { await br.close(); srv.kill(); }

  /* báo cáo placeholder cho chủ site */
  const list = [...holes.entries()];
  console.log("\n== Placeholder còn lại cho chủ site điền/xác nhận: " + list.length + " mục khác nhau");
  if (!/^\d{6,}/.test(lic.trim())) console.log("   ! Số xác nhận thông báo Bộ Công Thương CHƯA có: đang hiển thị trạng thái \"đang làm thủ tục\". Khi được cấp, điền số vào shared/site.js (license), chạy lại node scripts/build-legal-pdf.js.");
  list.forEach(([k, n]) => console.log("   - " + k + (n > 1 ? " (x" + n + ")" : "")));
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi" : "✓ trang pháp lý đạt"));
  process.exit(fails.length ? 1 : 0);
})();
