/* Kiểm tra gói Worker TRƯỚC khi deploy lên Cloudflare: mã Night Pass được sinh bằng main.toString() rồi gửi cho trình duyệt,
   nên gói Worker KHÔNG được chứa __name(...) (do keep_names của wrangler) — nếu có, mọi giao diện Night Pass sẽ lỗi "__name is not defined" và game giữ ổ khoá.
   Chạy: node scripts/check-worker-bundle.js  (cần Node >= 20) */
const { execSync } = require("child_process"), fs = require("fs"), path = require("path"), os = require("os");
const out = fs.mkdtempSync(path.join(os.tmpdir(), "wr-bundle-"));
execSync("npx wrangler deploy --dry-run --outdir " + JSON.stringify(out), { cwd: path.join(__dirname, ".."), stdio: "pipe" });
const js = fs.readdirSync(out).filter(f => f.endsWith(".js")).map(f => fs.readFileSync(path.join(out, f), "utf8")).join("\n");
const n = (js.match(/__name\(/g) || []).length;
if (n) { console.error("✗ gói Worker chứa " + n + " lần __name(...) — kiểm tra keep_names:false trong wrangler.jsonc"); process.exit(1); }
console.log("✓ gói Worker không chứa __name — mã Night Pass chạy được trong trình duyệt");
