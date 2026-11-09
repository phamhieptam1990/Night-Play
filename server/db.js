"use strict";
/* Kết nối Postgres (Neon). Pool nhỏ vì mỗi instance serverless chỉ xử lý ít request đồng thời; dùng endpoint pooled. */
/* Hai chế độ: Node (Netlify / server.js): pool `pg` dùng lại giữa các request.
   Cloudflare Workers: KHÔNG giữ kết nối giữa các request → câu lệnh đơn dùng driver HTTP của Neon (không trạng thái),
   transaction dùng WebSocket Pool tạo riêng cho từng lần gọi rồi đóng. */
const IS_WORKER = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
const cleanErr = e => String(e && e.message || e).replace(/npg_\w+/g, "<ẩn>");
if (IS_WORKER) {
  const { neon, Pool: NeonPool } = require("@neondatabase/serverless");
  const url = () => { if (!process.env.DATABASE_URL) throw new Error("Thiếu DATABASE_URL"); return process.env.DATABASE_URL; };
  const query = (text, params) => { const sql = neon(url(), { fullResults: true }); return typeof sql.query === "function" ? sql.query(text, params || []) : sql(text, params || []); };
  async function tx(fn) {
    const p = new NeonPool({ connectionString: url(), max: 1 }), c = await p.connect();
    try {
      await c.query("begin");
      const r = await fn(c);
      await c.query("commit");
      return r;
    } catch (e) { try { await c.query("rollback"); } catch {} throw e; }
    finally { c.release(); await p.end().catch(() => {}); }
  }
  module.exports = { query, tx, getPool: () => { throw new Error("Không có pool ở chế độ Worker"); } };
} else {
const { Pool } = require("pg");
let pool;
function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw new Error("Thiếu DATABASE_URL");
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: +(process.env.DB_POOL_MAX || 3), idleTimeoutMillis: 10000, connectionTimeoutMillis: 8000 });
    pool.on("error", e => console.error("pg pool:", String(e.message).replace(/npg_\w+/g, "<ẩn>")));
  }
  return pool;
}
const query = (text, params) => getPool().query(text, params);
/* Chạy fn(client) trong 1 transaction; lỗi thì rollback. */
async function tx(fn) {
  const c = await getPool().connect();
  try {
    await c.query("begin");
    const r = await fn(c);
    await c.query("commit");
    return r;
  } catch (e) { try { await c.query("rollback"); } catch {} throw e; }
  finally { c.release(); }
}
module.exports = { query, tx, getPool };
}
