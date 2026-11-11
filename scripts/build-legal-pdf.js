/* Dựng 4 file PDF pháp lý từ privacy.html và terms.html (cùng nguồn nội dung, KHÔNG phụ thuộc kiểu sách chia trang):
     legal/privacy-vi.pdf  legal/privacy-en.pdf  legal/terms-vi.pdf  legal/terms-en.pdf   (+ legal/pdf-info.js: dung lượng/ngày hiện trên nút "Tải PDF")
   Chạy:  NODE_PATH=<thư mục có puppeteer-core[,pdfjs-dist]> node scripts/build-legal-pdf.js
   - Cần Chrome (đường dẫn macOS mặc định; đặt CHROME=... để đổi). Cloudflare không có Chrome nên PDF được COMMIT vào repo: SỬA nội dung pháp lý
     (privacy.html, terms.html, shared/site.js) thì PHẢI chạy lại script này rồi commit các PDF + legal/pdf-info.js.
   - Số trang ở mục lục lấy bằng cách dựng 2 lượt và đọc lại PDF bằng pdfjs-dist (cài tạm: npm i --no-save pdfjs-dist@3.11.174 vào thư mục có NODE_PATH).
     Không có pdfjs-dist thì mục lục vẫn có liên kết bấm được nhưng không có số trang.
   - A4 dọc, lề 21mm, chữ serif 10.5pt, có mục lục, tiêu đề/chân trang, đánh dấu (outline), PDF gắn thẻ (tagged), bảng không tách hàng và lặp tiêu đề cột,
     chỗ còn "[CẦN ĐIỀN: ...]" hiện thành ô trống để điền. */
"use strict";
const fs = require("fs"), path = require("path"), http = require("http"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, ".."), outDir = path.join(root, "legal"), PORT = 8882;
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
let pdfjs = null; try { pdfjs = require("pdfjs-dist/legacy/build/pdf.js"); } catch (e) { console.log("(không có pdfjs-dist: mục lục không có số trang)"); }
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png" };
const DOCS = [["privacy", "vi"], ["privacy", "en"], ["terms", "vi"], ["terms", "en"]];
const T = {
  vi: { toc: "Mục lục", ver: "Phiên bản", eff: "Hiệu lực và cập nhật lần cuối", apply: "Áp dụng cho website", page: "Trang", fill: "Điền", confirm: "Cần xác nhận", disc: "Bản soạn tham khảo, không phải tư vấn pháp lý.", sub: "Play Hub · Pop Play · Night Play · Night Pass", k: { privacy: "Chính sách bảo mật thông tin cá nhân", terms: "Điều khoản sử dụng và quy chế hoạt động" } },
  en: { toc: "Contents", ver: "Version", eff: "Effective and last updated", apply: "Applies to the website", page: "Page", fill: "Fill in", confirm: "To confirm", disc: "Reference draft, not legal advice.", sub: "Play Hub · Pop Play · Night Play · Night Pass", k: { privacy: "Privacy Policy", terms: "Terms of Use and Operating Rules" } }
};

/* chạy TRONG trang nguồn: lấy nội dung một ngôn ngữ, đổi thẻ (ul.cards) thành bảng, đánh số id cho tiêu đề */
function extract(kind, l, domain) {
  const L = document.querySelector('#src .L[lang="' + l + '"]').cloneNode(true), SITE = window.SITE;
  const h1 = L.querySelector("h1").textContent; L.querySelector("h1").remove();
  const meta = L.querySelector(".meta"); if (meta) meta.remove();
  L.querySelectorAll("ul.cards").forEach(ul => {
    const th = (ul.dataset.th || "").split("|").filter(Boolean), t = document.createElement("table"), keyTbl = th[0] === "Khoá" || th[0] === "Key";
    t.className = th.length ? "grid" : "kv";
    if (th.length) { const tr = document.createElement("tr"); th.forEach(h => { const c = document.createElement("th"); c.textContent = h; tr.appendChild(c); }); const hd = document.createElement("thead"); hd.appendChild(tr); t.appendChild(hd); }
    const tb = document.createElement("tbody");
    ul.querySelectorAll(":scope > li").forEach(li => {
      const tr = document.createElement("tr"), cell = html => { const c = document.createElement("td"); c.innerHTML = html; tr.appendChild(c); };
      cell(li.querySelector(".k").innerHTML);
      if (!th.length) cell(li.querySelector(".d").innerHTML);
      else if (keyTbl) {
        cell(li.querySelector(".d").innerHTML);
        const chip = li.querySelector(".chip"), why = li.querySelector(".why");
        cell(chip.classList.contains("no") ? (l === "vi" ? "Không" : "No") : "<b>" + (l === "vi" ? "Có" : "Yes") + "</b>: " + (why ? why.innerHTML : ""));
      } else li.querySelectorAll(".f .v").forEach(v => cell(v.innerHTML));
      tb.appendChild(tr);
    });
    t.appendChild(tb); ul.replaceWith(t);
  });
  L.querySelectorAll("a[href]").forEach(a => { const h = a.getAttribute("href"); if (/^[a-z-]+\.html$/.test(h)) a.setAttribute("href", "https://" + domain + "/" + h); });
  const heads = [];
  L.querySelectorAll("h2,h3").forEach((h, i) => { h.id = "s" + i; heads.push({ id: h.id, lvl: h.tagName === "H2" ? 2 : 3, text: h.textContent.trim() }); });
  const note = L.querySelector("p.note"); let noteHtml = ""; if (note) { noteHtml = note.outerHTML; note.remove(); }
  return { h1, body: L.innerHTML, note: noteHtml, heads, site: SITE };
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function build(kind, l, d, pages) {
  const t = T[l], S = d.site;
  const body = d.body.replace(/\[CẦN (ĐIỀN|XÁC NHẬN): ([^\]]+)\]/g, (m, k, x) => '<span class="blank ' + (k === "ĐIỀN" ? "fill" : "confirm") + '"><span class="hint">' + (k === "ĐIỀN" ? t.fill : t.confirm) + ": " + x + "</span></span>");
  const note = d.note.replace(/\[CẦN[^\]]*\]/g, "");
  const toc = d.heads.map(h => '<li class="l' + h.lvl + '"><a href="#' + h.id + '"><span class="t">' + esc(h.text) + '</span><span class="dots"></span><span class="n">' + (pages ? pages[h.id] || "" : "") + "</span></a></li>").join("");
  return `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><title>${esc(d.h1)} · Play Hub</title><style>
@page{size:A4}
*{box-sizing:border-box}
html{font:10.5pt/1.5 Georgia,"Times New Roman","Liberation Serif","DejaVu Serif",serif;color:#1d1b26;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0}
.cover{break-after:page;padding-top:6mm}
.brand{font:700 9pt/1 Arial,"Liberation Sans","Helvetica Neue",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7C5CFF;margin:0 0 6mm}
.brand i{display:inline-block;width:4mm;height:4mm;border-radius:1.2mm;background:linear-gradient(90deg,#FF5A1F 50%,#7C5CFF 50%);vertical-align:-.8mm;margin-right:2mm}
h1.doc{font:700 27pt/1.12 Georgia,"Times New Roman",serif;color:#2f2760;margin:0 0 3mm;letter-spacing:-.3pt}
.sub{font:500 10pt/1.4 Arial,"Liberation Sans",sans-serif;color:#6b6788;margin:0 0 7mm}
.metabox{background:#f4f2fb;border-left:1.2mm solid #7C5CFF;padding:3.5mm 5mm;margin:0 0 8mm;font:9.5pt/1.6 Arial,"Liberation Sans",sans-serif;color:#37334f}
.metabox b{color:#2f2760}
.tochd{font:700 12pt/1 Georgia,serif;color:#2f2760;margin:0 0 3mm;padding-bottom:2mm;border-bottom:.6pt solid #cfc9e6}
.toc{list-style:none;margin:0;padding:0;font:9.5pt/1.5 Georgia,"Times New Roman",serif}
.toc li{margin:0}.toc li.l3{padding-left:6mm;font-size:8.8pt;color:#4a4670}.toc li.l2{margin-top:1.2mm;font-weight:700}
.toc a{display:flex;align-items:baseline;gap:2mm;color:inherit;text-decoration:none}
.toc .dots{flex:1;border-bottom:.6pt dotted #9a96b8;transform:translateY(-1.2pt)}
.toc .n{min-width:6mm;text-align:right;font-variant-numeric:tabular-nums}
.content h2{font:700 14pt/1.25 Georgia,"Times New Roman",serif;color:#2f2760;margin:7mm 0 2.5mm;padding-bottom:1.5mm;border-bottom:.6pt solid #cfc9e6;break-after:avoid;break-inside:avoid}
.content h3{font:700 11.2pt/1.3 Georgia,"Times New Roman",serif;color:#4a4670;margin:4.5mm 0 1.5mm;break-after:avoid;break-inside:avoid}
.content > h2:first-child{margin-top:0}
p{margin:0 0 2.6mm;text-align:justify;orphans:3;widows:3;hyphens:manual}
ul{margin:0 0 3mm;padding-left:5.5mm}li{margin:0 0 1.3mm;orphans:2;widows:2}
li::marker{color:#7C5CFF}
a{color:#3d33a8;text-decoration:none;border-bottom:.4pt solid #b9b3e6}
a[href^="http"]::after{content:" (" attr(href) ")";font:7.5pt Arial,"Liberation Sans",sans-serif;color:#7a7696;border:0}
a[href^="mailto"]{border:0}
section.sum{background:#f4f2fb;border:.6pt solid #d6d1ec;border-radius:2mm;padding:3mm 5mm 1mm;margin:0 0 5mm;break-inside:avoid}
section.sum h2{margin:0 0 2mm;border:0;padding:0;font-size:12.5pt}
section.sum ul{margin-bottom:2mm}
table{width:100%;border-collapse:collapse;margin:1mm 0 4mm;font:9pt/1.4 Arial,"Liberation Sans","Helvetica Neue",sans-serif;color:#1d1b26;break-inside:auto}
thead{display:table-header-group}tr{break-inside:avoid;page-break-inside:avoid}
th{background:#ebe8f6;color:#2f2760;text-align:left;font-weight:700;padding:2mm 2.5mm;border-bottom:.8pt solid #b9b3e0;font-size:8.6pt}
td{padding:1.8mm 2.5mm;border-bottom:.5pt solid #ddd9ee;vertical-align:top;overflow-wrap:anywhere}
table.grid tbody tr:nth-child(even) td{background:#faf9fd}
table.grid td:first-child{font-weight:700;width:26%}
table.kv td:first-child{width:34%;font-weight:700;color:#2f2760;background:#faf9fd}
code{font:700 8.4pt ui-monospace,Menlo,Consolas,"DejaVu Sans Mono",monospace;overflow-wrap:anywhere}
.blank{display:inline-block;min-width:52mm;max-width:100%;border-bottom:.9pt dotted #444;background:#fffbe4;padding:0 1.5mm;line-height:1.35;vertical-align:baseline}
.blank .hint{font:italic 7.4pt Arial,"Liberation Sans",sans-serif;color:#8d7a2a}
.blank.confirm{background:#fff0d1;border:.6pt dashed #c58a00;min-width:0;display:inline}
.blank.confirm .hint{color:#8a5a00}
.note{font:italic 8.8pt/1.45 Georgia,serif;color:#5b5873;border-top:.6pt solid #cfc9e6;margin-top:7mm;padding-top:2.5mm;text-align:left}
</style></head><body>
<div class="cover"><p class="brand"><i></i>Play Hub</p><h1 class="doc">${esc(d.h1)}</h1><p class="sub">${esc(t.sub)}</p>
<div class="metabox"><div><b>${t.apply}:</b> ${esc(S.domain)}</div><div><b>${t.eff}:</b> ${esc(S.legalDate)}</div><div><b>${t.ver}:</b> 1.0</div><div><b>Email:</b> ${esc(S.email)}</div></div>
<div class="tochd">${t.toc}</div><ol class="toc" style="list-style:none">${toc}</ol></div>
<div class="content">${body}${note ? note : '<p class="note">' + t.disc + "</p>"}</div></body></html>`;
}

const hdr = (l, title) => `<div style="width:100%;padding:0 21mm;font:8pt Georgia,'Times New Roman',serif;color:#7a7696;display:flex;justify-content:space-between"><span>Play Hub</span><span>${esc(title)}</span></div>`;
const ftr = (l, S) => `<div style="width:100%;padding:0 21mm;font:8pt Georgia,'Times New Roman',serif;color:#7a7696;display:flex;justify-content:space-between"><span>${esc(S.domain)} · ${esc(S.email)}</span><span>${T[l].page} <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;

async function pageOf(buf, heads) {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf), useSystemFonts: true, verbosity: 0 }).promise, bigs = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const tc = await (await doc.getPage(p)).getTextContent();
    bigs.push(tc.items.filter(i => Math.abs(i.transform[3]) >= 11 && i.str.trim()).map(i => i.str).join(" ").replace(/\s+/g, " ").toLowerCase());
  }
  const res = {}; let cur = 1;
  for (const h of heads) {
    const key = h.text.replace(/\s+/g, " ").toLowerCase().slice(0, 22);
    for (let p = cur; p <= doc.numPages; p++) if (bigs[p - 1].includes(key)) { res[h.id] = p; cur = p; break; }
  }
  return { res, n: doc.numPages };
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "content-type": MIME[path.extname(f)] || "application/octet-stream" }); r.end(b); } }); }).listen(PORT);
  const br = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
  const info = {};
  try {
    for (const [kind, l] of DOCS) {
      const src = await br.newPage(); await src.goto("http://localhost:" + PORT + "/" + kind + ".html?lang=" + l, { waitUntil: "load" });
      const domain = await src.evaluate(() => window.SITE.domain);
      const d = await src.evaluate(extract, kind, l, domain); await src.close();
      const pg = await br.newPage(); await pg.emulateMediaType("print");
      const opts = { format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: hdr(l, d.h1), footerTemplate: ftr(l, d.site), margin: { top: "24mm", bottom: "22mm", left: "21mm", right: "21mm" }, outline: true, tagged: true, preferCSSPageSize: false };
      await pg.setContent(build(kind, l, d, null), { waitUntil: "load" });
      let buf = Buffer.from(await pg.pdf(opts));
      if (pdfjs) { const { res } = await pageOf(buf, d.heads); await pg.setContent(build(kind, l, d, res), { waitUntil: "load" }); buf = Buffer.from(await pg.pdf(opts));
        const again = (await pageOf(buf, d.heads)).res; if (JSON.stringify(again) !== JSON.stringify(res)) console.log("  ! số trang mục lục lệch sau lượt 2: " + kind + "-" + l); }
      await pg.close();
      const name = kind + "-" + l; fs.writeFileSync(path.join(outDir, name + ".pdf"), buf);
      info[name] = { kb: Math.max(1, Math.round(buf.length / 1024)), date: d.site.legalDate };
      console.log("✓ legal/" + name + ".pdf  " + info[name].kb + " KB");
    }
  } finally { await br.close(); srv.close(); }
  fs.writeFileSync(path.join(outDir, "pdf-info.js"), "/* Sinh tự động bởi scripts/build-legal-pdf.js: dung lượng + ngày của các PDF, hiện trên nút Tải PDF */\nwindow.LEGALPDF = " + JSON.stringify(info) + ";\n");
})();
