/* Tạo landing/gioi-thieu/img/og.png (1200x630). Chạy: NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/og-landing.js */
const fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const out = path.join(__dirname, "..", "..", "landing", "gioi-thieu", "img", "og.png");
const ic = ["🐦", "🐊", "🔤", "⏰", "💸", "🛒"].map(e => `<span>${e}</span>`).join("");
const html = `<!doctype html><meta charset=utf-8><body style="margin:0;width:1200px;height:630px;overflow:hidden;position:relative;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#fff;background:linear-gradient(100deg,#C2410C 0,#C2410C 50%,#4630B8 50%)">
<div style="position:absolute;left:70px;top:64px;display:flex;align-items:center;gap:20px"><svg width="84" height="84" viewBox="0 0 64 64"><defs><clipPath id="c"><rect width="64" height="64" rx="18"/></clipPath></defs><g clip-path="url(#c)"><rect width="64" height="64" fill="#7C5CFF"/><rect width="32" height="64" fill="#FF5A1F"/></g><circle cx="32" cy="32" r="13" fill="#fff"/></svg><b style="font-size:54px;letter-spacing:-.5px">Play Hub</b></div>
<div style="position:absolute;left:70px;top:200px;font:800 92px/1.05 Georgia,serif;width:1000px;">Game ngắn,<br>không quảng cáo</div>
<div style="position:absolute;left:70px;bottom:62px;display:flex;gap:18px;font-size:68px">${ic.replace(/<span>/g, '<span style="display:grid;place-items:center;width:104px;height:104px;border-radius:28px;background:rgba(255,255,255,.95)">')}</div>
<div style="position:absolute;right:70px;bottom:78px;font-size:34px;font-weight:700;opacity:.95">nightplay.vn</div>`;
(async () => {
  const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
  const pg = await b.newPage(); await pg.setViewport({ width: 1200, height: 630 });
  await pg.setContent(html); await new Promise(r => setTimeout(r, 300));
  await pg.screenshot({ path: out }); await b.close(); console.log("og", fs.statSync(out).size + " bytes");
})();
