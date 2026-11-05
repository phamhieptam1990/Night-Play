/**
 * Chạy migration: node server/db/migrate.js <dev|production> [--yes]
 * Đọc server/.env.<môi trường>, dùng DATABASE_URL_UNPOOLED, chạy các file migrations/*.sql chưa áp dụng (mỗi file 1 transaction).
 */
"use strict";
const fs = require("fs"), path = require("path"), { Client } = require("pg");

const envName = process.argv[2];
if (!["dev", "production"].includes(envName)) { console.error("Dùng: node server/db/migrate.js <dev|production> [--yes]"); process.exit(1); }
if (envName === "production" && !process.argv.includes("--yes")) { console.error("Production: thêm --yes để xác nhận."); process.exit(1); }

const file = path.join(__dirname, "..", envName === "dev" ? ".env.development" : ".env.production");
const vars = {};
for (const l of fs.readFileSync(file, "utf8").split("\n")) { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) vars[m[1]] = m[2]; }
const url = vars.DATABASE_URL_UNPOOLED || vars.DATABASE_URL;
if (!url) { console.error("Thiếu DATABASE_URL_UNPOOLED trong " + file); process.exit(1); }

(async () => {
  const c = new Client({ connectionString: url });
  await c.connect();
  const { rows: [who] } = await c.query("select current_user u, split_part(inet_server_addr()::text,'/',1) ip");
  console.log(`[${envName}] kết nối với user ${who.u}`);
  await c.query("create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())");
  const done = new Set((await c.query("select name from schema_migrations")).rows.map(r => r.name));
  const dir = path.join(__dirname, "migrations");
  let n = 0;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".sql")).sort()) {
    if (done.has(f)) continue;
    process.stdout.write(`  áp dụng ${f} ... `);
    try {
      await c.query("begin");
      await c.query(fs.readFileSync(path.join(dir, f), "utf8"));
      await c.query("insert into schema_migrations(name) values($1)", [f]);
      await c.query("commit"); console.log("OK"); n++;
    } catch (e) { await c.query("rollback"); console.log("LỖI"); console.error(String(e.message).replace(/npg_\w+/g, "<ẩn>")); process.exit(1); }
  }
  console.log(n ? `Xong, đã áp dụng ${n} migration.` : "Không có migration mới.");
  await c.end();
})().catch(e => { console.error(String(e.message).replace(/npg_\w+/g, "<ẩn>")); process.exit(1); });
