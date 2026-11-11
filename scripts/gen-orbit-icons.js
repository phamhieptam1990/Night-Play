/* Sinh shared/orbit-icons/<id>.svg (ảnh bìa vuông của 32 game) từ chính mảng `games` của hai cổng (thumb = SVG data URI), để hệ quỹ đạo/dải game của hub + landing dùng ảnh THẬT thay emoji.
   Chạy khi thêm/đổi game:  NODE_PATH=<thư mục puppeteer-core> node scripts/gen-orbit-icons.js   (cần Chrome; tự chạy http.server cổng trống) */
const { spawn } = require("child_process"), fs = require("fs"), net = require("net"), path = require("path"), puppeteer = require("puppeteer-core");
const root = path.join(__dirname, ".."), out = path.join(root, "shared", "orbit-icons");
(async () => {
  const port = await new Promise(r => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
  const srv = spawn("python3", ["-m", "http.server", String(port)], { cwd: root, stdio: "ignore" }); await new Promise(r => setTimeout(r, 1200));
  const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
  fs.mkdirSync(out, { recursive: true }); let n = 0, bytes = 0;
  try {
    for (const p of ["cozyplay", "popplay"]) {
      const pg = await br.newPage(); await pg.goto(`http://localhost:${port}/${p}/index.html`, { waitUntil: "load" });
      const list = await pg.evaluate(() => games.map(g => ({ id: g.id, thumb: g.thumb })));
      for (const g of list) {
        const m = /^data:image\/svg\+xml[;,](?:charset=[^,]*,)?(.*)$/s.exec(g.thumb || ""); if (!m) { console.log("bỏ qua (không phải SVG):", g.id); continue; }
        let svg = /;base64,/.test(g.thumb) ? Buffer.from(g.thumb.split(",")[1], "base64").toString("utf8") : decodeURIComponent(m[1]);
        svg = svg.replace(/<svg /, '<svg width="128" height="128" '); fs.writeFileSync(path.join(out, g.id + ".svg"), svg); n++; bytes += svg.length;
      }
      await pg.close();
    }
  } finally { await br.close(); srv.kill(); }
  console.log(n + " ảnh, " + (bytes / 1024).toFixed(1) + " KB");
})();
