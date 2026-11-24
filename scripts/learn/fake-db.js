/* CSDL giả trong bộ nhớ cho các bài đo Học Vui Plus (không cần Postgres). Dùng bởi check-plus.js, check-coach.js. */
"use strict";
/* ================= CSDL giả ================= */
module.exports = function fakeDb() {
  const S = { users: [], ident: {}, orders: {}, txs: {}, learn: {}, trials: {}, game: {}, cache: {}, usage: {}, rl: {} };
  let uid = 0;
  const handle = (text, p = []) => {
    const t = text.replace(/\s+/g, " ").trim().toLowerCase();
    if (t.startsWith("insert into rate_limits")) return { rows: [{ count: 1 }] };
    if (t.startsWith("delete from")) return { rows: [], rowCount: 0 };
    if (t.startsWith("select user_id from identities where email_verified")) return { rows: [] };
    if (t.startsWith("select user_id from identities where provider = 'email'")) return S.ident[p[0]] ? { rows: [{ user_id: S.ident[p[0]] }] } : { rows: [] };
    if (t.startsWith("insert into users")) { const id = "00000000-0000-4000-8000-" + String(++uid).padStart(12, "0"); S.users.push(id); S._last = id; return { rows: [{ id }] }; }
    if (t.startsWith("insert into identities")) { if (!S.ident[p[1]]) S.ident[p[1]] = p[0]; return { rows: [], rowCount: 1 }; }
    if (t.startsWith("insert into orders")) { const learn = /'learn'/.test(t); S.orders[p[0]] = { id: p[0], code: p[1], user_id: p[2], email: p[3], plan: p[4], amount: p[5], status: "pending", product: learn ? "learn" : "game", expires_at: new Date(Date.now() + 900000) }; return { rows: [{ code: p[1], expires_at: S.orders[p[0]].expires_at }] }; }
    if (t.startsWith("select user_id, plan, status, exp, expires_at from orders")) return { rows: S.orders[p[0]] ? [S.orders[p[0]]] : [] };
    if (t.startsWith("select * from orders where code")) return { rows: Object.values(S.orders).filter(o => o.code === p[0]) };
    if (t.startsWith("insert into txs")) { if (S.txs[p[0]]) return { rows: [], rowCount: 0 }; S.txs[p[0]] = 1; return { rows: [{ id: p[0] }], rowCount: 1 }; }
    if (t.startsWith("insert into learn_passes")) { const days = p[1] != null ? p[1] : 7; const cur = S.learn[p[0]]; const base = cur && cur.exp > Date.now() && /greatest/.test(t) ? cur.exp : Date.now(); const exp = base + days * 86400000; S.learn[p[0]] = { exp, plan: p[2] != null ? p[2] : "trial" }; return { rows: [{ exp: new Date(exp) }] }; }
    if (t.startsWith("update orders set status = 'paid'")) { const o = S.orders[p[0]]; o.status = "paid"; o.exp = p[1]; return { rows: [] }; }
    if (t.startsWith("select exp, plan from learn_passes")) { const r = S.learn[p[0]]; return { rows: r ? [{ exp: new Date(r.exp), plan: r.plan }] : [] }; }
    if (t.startsWith("insert into learn_trials")) { if (S.trials[p[0]]) return { rows: [], rowCount: 0 }; S.trials[p[0]] = 1; return { rows: [], rowCount: 1 }; }
    if (t.startsWith("select exp, plan from passes")) { const r = S.game[p[0]]; return { rows: r ? [r] : [] }; }
    if (t.startsWith("select data from learn_coach_cache")) { const r = S.cache[p[0]]; return { rows: r ? [{ data: r.data }] : [] }; }
    if (t.startsWith("update learn_coach_cache set hits")) { if (S.cache[p[0]]) S.cache[p[0]].hits++; return { rows: [] }; }
    if (t.startsWith("insert into learn_coach_cache")) { if (!S.cache[p[0]]) S.cache[p[0]] = { data: JSON.parse(p[1]), hits: 0 }; return { rows: [] }; }
    if (t.startsWith("insert into learn_coach_usage")) { const k = p[0] + "|" + p[1]; S.usage[k] = (S.usage[k] || 0) + 1; return { rows: [{ n: S.usage[k] }] }; }
    throw new Error("fake db: câu lệnh chưa hỗ trợ: " + t.slice(0, 80));
  };
  const db = { S, query: async (t, p) => handle(t, p), tx: async fn => fn({ query: async (t, p) => handle(t, p) }), getPool() { throw new Error("no pool"); } };
  return db;
}
