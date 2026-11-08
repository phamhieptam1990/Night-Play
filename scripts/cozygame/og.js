/* Tạo ảnh xem trước link (og/home|daily|ch.png, 1200x630) cho game Cozy mới. Chạy: NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/og.js <id> */
const fs = require("fs"), path = require("path"), puppeteer = require("puppeteer-core");
const id = process.argv[2], sp = require("./specs/" + id + ".js"), w = sp.wire, out = path.join(__dirname, "..", "..", "cozyplay", "games", id, "og");
const page = (emoji, line1, line2) => `<!doctype html><meta charset=utf-8><body style="margin:0;width:1200px;height:630px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,${w.c1},${w.c2});font-family:'Be Vietnam Pro',system-ui,sans-serif;color:#fff;overflow:hidden;position:relative">
<div style="position:absolute;right:-60px;top:-60px;width:420px;height:420px;border-radius:50%;background:rgba(255,255,255,.14)"></div><div style="position:absolute;left:-80px;bottom:-100px;width:380px;height:380px;border-radius:50%;background:rgba(0,0,0,.12)"></div>
<div style="display:flex;align-items:center;gap:56px;padding:0 70px;position:relative"><div style="font-size:260px;line-height:1;filter:drop-shadow(0 12px 0 rgba(0,0,0,.18))">${emoji}</div>
<div><div style="font-size:78px;font-weight:900;line-height:1.08;text-shadow:0 6px 0 rgba(0,0,0,.2)">${line1}</div><div style="font-size:40px;font-weight:700;margin-top:22px;opacity:.95;line-height:1.3">${line2}</div><div style="margin-top:30px;display:inline-block;background:#fff;color:${w.c2};font-weight:900;font-size:34px;padding:10px 28px;border-radius:99px">Night Play · Cozy Play</div></div></div>`;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
  const pg = await b.newPage(); await pg.setViewport({ width: 1200, height: 630 });
  const items = { home: [w.emoji, sp.title.vi, w.dvi], daily: ["📅", sp.title.vi, "Thử thách hôm nay — cả nước cùng một đề. Bạn được bao nhiêu điểm?"], ch: ["⚔️", "Bạn bị thách!", sp.title.vi + " — bạn vượt được điểm của bạn bè không?"] };
  for (const k in items) { await pg.setContent(page(...items[k])); await new Promise(r => setTimeout(r, 300)); await pg.screenshot({ path: path.join(out, k + ".png") }); console.log("og", k); }
  await b.close();
})();
