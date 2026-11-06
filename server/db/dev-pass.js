"use strict";
/* Tạo Night Pass THỬ cho môi trường DEV (branch dev của Neon) để thử các chế độ trả phí của game.
   Dùng:  npm run pass:dev            (hiệu lực 30 ngày)
          npm run pass:dev -- 7       (hiệu lực 7 ngày)
   Kết quả: một dòng lệnh để dán vào Console của trình duyệt (trang chạy bằng server local).
   KHÔNG chạy với production: token chỉ hợp lệ với TOKEN_SECRET + database của dev. */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const file = path.join(__dirname, "..", ".env.development");
if (!fs.existsSync(file)) { console.error("Không thấy server/.env.development"); process.exit(1); }

let text = fs.readFileSync(file, "utf8");
const get = k => { const m = text.match(new RegExp("^\\s*" + k + "\\s*=\\s*(.*?)\\s*$", "m")); return m ? m[1].replace(/^["']|["']$/g, "") : ""; };
let secret = get("TOKEN_SECRET"), added = false;
if (secret.length < 32) {   // server dev tự sinh khoá ngẫu nhiên mỗi lần khởi động → token thử sẽ hỏng. Đặt khoá cố định cho dev.
  secret = crypto.randomBytes(32).toString("hex");
  fs.appendFileSync(file, (text.endsWith("\n") ? "" : "\n") + "\n# Khoá ký token Night Pass (dev). Giữ cố định để token thử không hỏng mỗi lần khởi động lại.\nTOKEN_SECRET=" + secret + "\n");
  added = true;
}
process.env.DATABASE_URL = get("DATABASE_URL");
if (!process.env.DATABASE_URL) { console.error("Thiếu DATABASE_URL trong server/.env.development"); process.exit(1); }
const db = require("../db");
const days = Math.max(1, Math.min(365, parseInt(process.argv[2], 10) || 30));
const b64u = b => Buffer.from(b).toString("base64url");

(async () => {
  const { rows: [u] } = await db.query("insert into users default values returning id");
  const exp = Date.now() + days * 86400000;
  await db.query("insert into passes(user_id, exp, plan) values ($1, to_timestamp($2), 'year')", [u.id, exp / 1000]);
  const body = b64u(JSON.stringify({ u: u.id, x: exp, p: "year" }));
  const token = body + "." + crypto.createHmac("sha256", secret).update(body).digest("base64url");
  const pass = { plan: "year", exp: new Date(exp).toISOString(), email: "test@local.dev", token };
  if (added) console.log("• Đã thêm TOKEN_SECRET (dev) vào server/.env.development. HÃY KHỞI ĐỘNG LẠI server local (dừng run.command rồi chạy lại).\n");
  console.log("Night Pass thử, hiệu lực " + days + " ngày (hết hạn " + new Date(exp).toLocaleDateString("vi-VN") + ").\nMở trang chạy bằng server local, bấm F12 → Console, dán dòng sau rồi tải lại trang:\n");
  console.log("localStorage.setItem('pass', JSON.stringify(" + JSON.stringify(pass) + "))");
  console.log("\nXoá để thử lại bản miễn phí:  localStorage.removeItem('pass')");
  process.exit(0);
})().catch(e => { console.error(String(e.message).replace(/npg_\w+/g, "<ẩn>")); process.exit(1); });
