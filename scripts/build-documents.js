/* Dựng 6 PDF tài liệu thương mại điện tử (legal/tailieu/*.pdf) từ scripts/legal-docs.js. Hai tài liệu còn lại dùng PDF có sẵn
   (privacy-vi.pdf = Chính sách bảo mật; terms-vi.pdf = Điều khoản/quy chế = "Tài liệu khác"). Trang documents.html viết tay, liệt kê cả 8.
   Chạy: NODE_PATH=<thư mục có puppeteer-core> node scripts/build-documents.js   (cần Chrome; PDF được commit vì Cloudflare không có Chrome) */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, ".."), out = path.join(root, "legal", "tailieu");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(root, "shared/site.js"), "utf8"), ctx); const S = ctx.window.SITE;
const LANGS = { vi: require("./legal-docs.js"), en: require("./legal-docs-en.js") };
const T = {
  vi: { owner: "Chủ website", addr: "Địa chỉ", tel: "Điện thoại", web: "Website", eff: "Hiệu lực và cập nhật lần cuối", foot: (d) => `Tài liệu thuộc website ${d}. Xem thêm Chính sách bảo mật và Điều khoản sử dụng tại https://${d}/privacy.html và https://${d}/terms.html.`, suffix: "" },
  en: { owner: "Website owner", addr: "Address", tel: "Phone", web: "Website", eff: "Effective and last updated", foot: (d) => `This document belongs to the ${d} website. See also the Privacy Policy and Terms of Use at https://${d}/privacy.html?lang=en and https://${d}/terms.html?lang=en.`, suffix: "-en" } };
const font = w => "@font-face{font-family:Inter;font-weight:" + w + ";src:url(data:font/woff2;base64," + fs.readFileSync(path.join(__dirname, "fonts-pdf", "inter-" + w + ".woff2")).toString("base64") + ") format('woff2')}";
const sub = s => s.replace(/\{(\w+)\}/g, (m, k) => S[k] || m);
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
function sec([h, items]) {
  let html = "<h2>" + esc(h) + "</h2>", list = null, tbl = null;
  const flush = () => { if (list) html += "</" + list + ">"; if (tbl) html += "</tbody></table>"; list = tbl = null; };
  for (const it of items) {
    let m;
    if ((m = /^(ul|ol):(.*)$/s.exec(it))) { if (list !== m[1]) { flush(); html += "<" + m[1] + ">"; list = m[1]; } html += "<li>" + sub(m[2]) + "</li>"; }
    else if (it.startsWith("table:")) { flush(); tbl = 1; html += "<table><thead><tr>" + it.slice(6).split("|").map(c => "<th>" + c + "</th>").join("") + "</tr></thead><tbody>"; }
    else if (it.startsWith("row:")) html += "<tr>" + it.slice(4).split("|").map(c => "<td>" + sub(c) + "</td>").join("") + "</tr>";
    else { flush(); html += "<p>" + sub(it) + "</p>"; }
  }
  flush(); return html;
}
const page = (d, l) => `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><title>${esc(d.title)} · Play Hub</title><style>${font(400)}${font(500)}${font(700)}
@page{size:A4;margin:20mm 21mm 20mm}
html{font:10.5pt/1.55 Inter,sans-serif;color:#1d1b26}body{margin:0}
.brand{font:700 9pt/1 Inter;letter-spacing:.14em;text-transform:uppercase;color:#7C5CFF;margin:0 0 5mm}
h1{font:700 19pt/1.25 Inter;color:#2f2760;margin:0 0 3mm}
.meta{background:#f4f2fb;border-left:1.2mm solid #7C5CFF;padding:3mm 5mm;margin:0 0 5mm;font-size:9.3pt;line-height:1.6;color:#37334f}
h2{font:700 12.5pt/1.3 Inter;color:#2f2760;margin:6mm 0 2mm;padding-bottom:1.2mm;border-bottom:.6pt solid #cfc9e6;break-after:avoid}
p{margin:0 0 2.5mm}ul,ol{margin:0 0 2.5mm;padding-left:6mm}li{margin:0 0 1.4mm}
table{width:100%;border-collapse:collapse;margin:1mm 0 3mm;font-size:9.8pt}th,td{text-align:left;padding:2mm 2.5mm;border:.6pt solid #cfc9e6;vertical-align:top}th{background:#f4f2fb;color:#2f2760}tr{break-inside:avoid}
.foot{margin-top:8mm;font-size:8.8pt;color:#6b6788;border-top:.6pt solid #cfc9e6;padding-top:2mm}
</style></head><body><div class="brand">Play Hub · Pop Play · Night Play</div><h1>${esc(d.title)}</h1>
<div class="meta"><b>${T[l].owner}:</b> ${esc(S.operator)} · <b>${T[l].addr}:</b> ${esc(S.address)}<br><b>${T[l].tel}:</b> ${S.phone} · <b>Email:</b> ${S.email} · <b>${T[l].web}:</b> ${S.domain}<br><b>${T[l].eff}:</b> ${S.legalDate}</div>
${d.sections.map(sec).join("")}<div class="foot">${T[l].foot(S.domain)}</div></body></html>`;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
  for (const l of ["vi", "en"]) for (const d of LANGS[l]) {
    const p = await b.newPage(); await p.setContent(page(d, l), { waitUntil: "load" });
    const f = path.join(out, String(d.n).padStart(2, "0") + "-" + d.slug + T[l].suffix + ".pdf");
    await p.pdf({ path: f, format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", margin: { top: "20mm", bottom: "20mm", left: "21mm", right: "21mm" },
      footerTemplate: '<div style="width:100%;font:8px Inter,sans-serif;color:#888;text-align:center"><span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
    console.log(path.relative(root, f), Math.round(fs.statSync(f).size / 1024) + " KB"); await p.close();
  }
  await b.close();
  /* Bản song ngữ để nút "Tải PDF" tải về: một file có phần tiếng Việt rồi phần tiếng Anh (gộp bằng pdf-lib: npm i --no-save pdf-lib vào thư mục có NODE_PATH) */
  const { PDFDocument } = require("pdf-lib");
  const PAIRS = [["01-privacy-vi-en", "legal/privacy-vi.pdf", "legal/privacy-en.pdf"], ["08-terms-vi-en", "legal/terms-vi.pdf", "legal/terms-en.pdf"]]
    .concat(LANGS.vi.map(d => { const n = String(d.n).padStart(2, "0") + "-" + d.slug; return [n + "-vi-en", "legal/tailieu/" + n + ".pdf", "legal/tailieu/" + n + "-en.pdf"]; }));
  for (const [name, a, c] of PAIRS) {
    const m = await PDFDocument.create();
    for (const f of [a, c]) { const src = await PDFDocument.load(fs.readFileSync(path.join(root, f))); (await m.copyPages(src, src.getPageIndices())).forEach(pg => m.addPage(pg)); }
    m.setTitle(name); const f = path.join(out, name + ".pdf"); fs.writeFileSync(f, await m.save());
    console.log(path.relative(root, f), Math.round(fs.statSync(f).size / 1024) + " KB (" + m.getPageCount() + " trang)");
  }
})();
