"use strict";
/* Kết nối Postgres (Neon). Pool nhỏ vì mỗi instance serverless chỉ xử lý ít request đồng thời; dùng endpoint pooled. */
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
