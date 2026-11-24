/* Kiểm nền Học Vui Plus (G1): máy chủ (đơn learn, token a:"learn", /api/pass?product=learn, dùng thử, webhook) bằng CSDL GIẢ trong bộ nhớ + cổng ở trình duyệt (learn/plus.js).
   Không gọi mạng, không cần Postgres, không dùng khoá thật.   Chạy: node scripts/learn/check-plus.js */
"use strict";
const path = require("path");
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log("✗", m); } };

/* ================= CSDL giả ================= */
function fakeDb() {
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

(async () => {
  /* ================= máy chủ ================= */
  const dbPath = require.resolve("../../server/db.js"), fdb = fakeDb();
  require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: fdb };
  Object.assign(process.env, { DEV_RELOAD: "1", DATABASE_URL: "postgres://fake", DEVICE_LOCK: "off", TOKEN_SECRET: "x".repeat(40), SEPAY_API_KEY: "k".repeat(16), BANK_BIN: "970436", BANK_ACCOUNT: "0000000000" });
  delete process.env.LEARN_PLUS; delete process.env.LEARN_AI_KEY;
  const app = require("../../server/app.js");
  const call = async (method, pathname, { body, headers = {}, query } = {}) => { const r = await app.handle({ method, pathname, query: new URLSearchParams(query || ""), headers, bodyText: body ? JSON.stringify(body) : "", ip: "1.2.3.4" }); return r; };

  /* --- mặc định TẮT --- */
  let r = await call("GET", "/api/learn/plans"); ok(r.status === 404 && r.body.error === "learn_off", "LEARN_PLUS tắt: /api/learn/plans phải 404");
  r = await call("POST", "/api/learn/trial", { body: { email: "a@b.co" } }); ok(r.status === 404, "tắt: trial 404");
  r = await call("POST", "/api/learn/coach", { body: {} }); ok(r.status === 404, "tắt: coach 404");
  r = await call("POST", "/api/orders", { body: { product: "learn", plan: "learn_month", email: "a@b.co" } }); ok(r.status === 404, "tắt: đơn learn 404");
  r = await call("GET", "/api/pass", { query: "product=learn" }); ok(r.status === 404, "tắt: /api/pass?product=learn 404");
  /* đơn game không bị ảnh hưởng, kể cả khi cố gửi id gói learn qua đường game */
  r = await call("POST", "/api/orders", { body: { plan: "month", email: "g@b.co" } }); ok(r.status === 201, "đơn game vẫn tạo được: " + r.status);
  r = await call("POST", "/api/orders", { body: { plan: "learn_month", email: "g@b.co" } }); ok(r.status === 400, "id gói learn_* không mua được qua đường game");
  const gameOrderId = r.body && Object.keys(fdb.S.orders)[0];
  ok(fdb.S.orders[gameOrderId].product === "game", "đơn game product=game");

  /* --- bật --- */
  process.env.LEARN_PLUS = "on";
  r = await call("GET", "/api/learn/plans"); ok(r.status === 200 && r.body.plans.length === 3 && r.body.trialDays === 7, "plans: 3 gói, dùng thử 7 ngày");
  ok(r.body.plans.map(p => p.id).join() === "learn_month,learn_quarter,learn_year" && r.body.plans[0].amount === 99000 && r.body.plans[2].amount === 790000, "giá mặc định 99k/249k/790k, không có gói ngày/tuần");
  ok(r.body.ai === "mock", "chưa có khoá: AI = mô phỏng");

  /* mua: đơn → webhook → token */
  r = await call("POST", "/api/orders", { body: { product: "learn", plan: "day", email: "p@x.vn" } }); ok(r.status === 400, "gói ngày không bán cho learn");
  r = await call("POST", "/api/orders", { body: { product: "learn", plan: "learn_month", email: "p@x.vn" } }); ok(r.status === 201 && r.body.amount === 99000, "tạo đơn learn: " + r.status);
  const oid = r.body.orderId, code = r.body.code;
  ok(fdb.S.orders[oid].product === "learn", "đơn có product=learn");
  r = await call("GET", "/api/orders/" + oid); ok(r.body.status === "pending", "đơn chờ");
  r = await call("POST", "/api/webhook/sepay", { headers: { authorization: "Apikey " + "k".repeat(16) }, body: { id: "tx1", transferType: "in", transferAmount: 99000, content: code, accountNumber: "0000000000" } }); ok(r.status === 200, "webhook " + r.status);
  const uidP = fdb.S.orders[oid].user_id;
  ok(fdb.S.learn[uidP] && fdb.S.learn[uidP].plan === "learn_month", "webhook cấp learn_passes (không cấp passes game)");
  ok(!fdb.S.game[uidP], "không cấp gói game");
  r = await call("GET", "/api/orders/" + oid); ok(r.body.status === "paid" && r.body.token, "đơn paid có token");
  const tok = r.body.token, body = JSON.parse(Buffer.from(tok.split(".")[0], "base64url").toString());
  ok(body.a === "learn", "token có a:learn");
  r = await call("GET", "/api/pass", { query: "product=learn", headers: { authorization: "Bearer " + tok } });
  ok(r.status === 200 && r.body.active && r.body.plan === "learn_month" && r.body.features.includes("coach"), "pass learn active: " + JSON.stringify(r.body).slice(0, 100));
  r = await call("GET", "/api/pass", { headers: { authorization: "Bearer " + tok } }); ok(r.status === 401, "token Plus KHÔNG mở Night Pass game");
  /* token game không mở Plus */
  fdb.S.game[uidP] = { exp: new Date(Date.now() + 86400000), plan: "month" };
  r = await call("POST", "/api/orders", { body: { plan: "month", email: "p@x.vn" } }); const gOid = r.body.orderId;
  fdb.S.orders[gOid].status = "paid"; fdb.S.orders[gOid].exp = Date.now() + 86400000;
  r = await call("GET", "/api/orders/" + gOid); const gtok = r.body.token;
  ok(gtok && !JSON.parse(Buffer.from(gtok.split(".")[0], "base64url").toString()).a, "token game không có a");
  r = await call("GET", "/api/pass", { query: "product=learn", headers: { authorization: "Bearer " + gtok } }); ok(r.status === 401, "token game KHÔNG mở Plus");
  r = await call("GET", "/api/pass", { headers: { authorization: "Bearer " + gtok } }); ok(r.status === 200 && r.body.active, "token game vẫn mở game");
  r = await call("GET", "/api/pass", { query: "product=learn" }); ok(r.status === 401, "không token: 401");
  r = await call("GET", "/api/pass", { query: "product=learn", headers: { authorization: "Bearer " + tok.slice(0, -3) + "abc" } }); ok(r.status === 401, "token sai chữ ký: 401");
  /* hết hạn */
  fdb.S.learn[uidP].exp = Date.now() - 1000;
  r = await call("GET", "/api/pass", { query: "product=learn", headers: { authorization: "Bearer " + tok } }); ok(r.status === 200 && r.body.active === false && r.body.features.length === 0, "hết hạn: active=false, không có tính năng");
  fdb.S.learn[uidP].exp = Date.now() + 86400000;
  /* thiếu tiền / trùng */
  r = await call("POST", "/api/orders", { body: { product: "learn", plan: "learn_year", email: "q@x.vn" } });
  const o2 = Object.values(fdb.S.orders).find(o => o.code === r.body.code);
  await call("POST", "/api/webhook/sepay", { headers: { authorization: "Apikey " + "k".repeat(16) }, body: { id: "tx2", transferType: "in", transferAmount: 1000, content: r.body.code, accountNumber: "0000000000" } });
  ok(o2.status === "pending" && !fdb.S.learn[o2.user_id], "thiếu tiền không cấp Plus");
  /* dùng thử 7 ngày */
  r = await call("POST", "/api/learn/trial", { body: { email: "bad" } }); ok(r.status === 400, "trial: email xấu");
  r = await call("POST", "/api/learn/trial", { body: { email: "t@x.vn" } }); ok(r.status === 200 && r.body.token && r.body.plan === "trial", "trial lần 1: " + JSON.stringify(r.body).slice(0, 80));
  const ttok = r.body.token; const dayLeft = (r.body.exp - Date.now()) / 86400000; ok(dayLeft > 6.9 && dayLeft <= 7.01, "trial 7 ngày: " + dayLeft);
  r = await call("POST", "/api/learn/trial", { body: { email: "T@x.vn" } }); ok(r.status === 409 && r.body.error === "trial_used", "trial lần 2 cùng email (viết hoa): bị từ chối");
  r = await call("GET", "/api/pass", { query: "product=learn", headers: { authorization: "Bearer " + ttok } }); ok(r.body.active && r.body.trial === true, "trial: pass có cờ trial");
  /* thử bằng giá 1.000đ */
  r = await call("POST", "/api/orders", { body: { product: "learn", plan: "learn_test", email: "z@x.vn" } }); ok(r.status === 400, "learn_test chưa bật: 400");
  process.env.LEARN_TEST_PRICE = "on";
  r = await call("POST", "/api/orders", { body: { product: "learn", plan: "learn_test", email: "z@x.vn" } }); ok(r.status === 201 && r.body.amount === 1000, "learn_test 1.000đ khi bật cờ thử");
  delete process.env.LEARN_TEST_PRICE;

  /* ================= trình duyệt: learn/plus.js ================= */
  const mkLs = () => { const m = {}; return { m, getItem: k => k in m ? m[k] : null, setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; };
  global.window = global; global.localStorage = mkLs(); let calls = 0;
  global.fetch = async (u, init) => { calls++; const url = new URL(u, "http://x"), headers = {}; for (const k in (init && init.headers) || {}) headers[k.toLowerCase()] = init.headers[k]; const rr = await call((init && init.method) || "GET", url.pathname, { query: url.search.slice(1), headers, body: init && init.body ? JSON.parse(init.body) : undefined }); return { ok: rr.status < 300, status: rr.status, json: async () => rr.body }; };
  delete require.cache[require.resolve("../../learn/plus.js")]; delete global.LearnPlus;
  require("../../learn/plus.js"); const P = global.LearnPlus;
  ok(P.has("coach") === false && P.enabled() === false && !P.state().active, "cờ tắt: has() false");
  const c0 = calls; await P.refresh(); ok(calls === c0, "cờ tắt: không có yêu cầu mạng");
  ok(!P.useTestToken(P.makeTestToken(["coach"], 1)), "cờ thử tắt: không nhận token thử");
  global.localStorage.setItem("learn:plus:on", "1");
  ok(P.enabled() && !P.has("coach"), "cờ bật nhưng chưa có gói: has() false");
  ok(!P.useTestToken(P.makeTestToken(["coach"], 1)), "cờ thử vẫn tắt: không nhận token thử");
  global.localStorage.setItem("learn:plus:test", "1");
  ok(P.useTestToken(P.makeTestToken(["coach", "report"], 1)) && P.has("coach") && P.has("report") && !P.has("exam6") && !P.has("nonsense"), "token thử: chỉ các tính năng đã cấp");
  ok(!P.useTestToken("test.abc") && !P.useTestToken("hax"), "token thử hỏng bị từ chối");
  global.localStorage.removeItem("learn:plus:test"); ok(!P.has("coach"), "tắt cờ thử: token thử vô hiệu");
  P.clear();
  /* dùng thử thật qua máy chủ giả */
  let t = await P.startTrial("kid-parent@x.vn"); ok(t.ok && P.has("coach") && P.has("exam6") && P.state().trial, "client dùng thử → has(coach)");
  t = await P.startTrial("kid-parent@x.vn"); ok(!t.ok && t.error === "trial_used", "dùng thử lần 2 báo trial_used");
  /* tắt AI của phụ huynh */
  ok(P.aiOn(), "có Plus: AI bật mặc định"); P.setAi(false); ok(!P.aiOn() && P.has("coach"), "phụ huynh tắt AI: aiOn false"); P.setAi(true);
  /* hết hạn / không nhớ quá lâu khi mất mạng */
  const st = JSON.parse(global.localStorage.getItem("learn:plus")); st.exp = Date.now() - 1; global.localStorage.setItem("learn:plus", JSON.stringify(st)); ok(!P.has("coach"), "quá hạn: has() false");
  st.exp = Date.now() + 86400000; st.at = Date.now() - 8 * 86400000; global.localStorage.setItem("learn:plus", JSON.stringify(st)); ok(!P.has("coach"), "quá 7 ngày chưa được máy chủ xác nhận: false");
  const real = global.fetch; global.fetch = async () => { throw new Error("offline"); };
  st.at = Date.now() - 86400000; global.localStorage.setItem("learn:plus", JSON.stringify(st)); await P.refresh(); ok(P.has("coach"), "mất mạng, mới xác nhận hôm qua: vẫn có");
  global.fetch = real;
  /* mua qua client */
  P.clear(); const co = await P.createOrder("learn_month", "buyer@x.vn"); ok(co.ok && co.order.amount === 99000, "client tạo đơn");
  let pl = await P.pollOrder(co.order.orderId); ok(pl.status === "pending", "client poll pending");
  await call("POST", "/api/webhook/sepay", { headers: { authorization: "Apikey " + "k".repeat(16) }, body: { id: "tx9", transferType: "in", transferAmount: 99000, content: co.order.code, accountNumber: "0000000000" } });
  pl = await P.pollOrder(co.order.orderId); ok(pl.status === "paid" && P.has("coach") && P.state().plan === "learn_month", "client poll paid → Plus");
  /* trang bé không có giá/nút mua */
  const fs = require("fs"); for (const f of ["learn/index.html", "learn/lop/index.html"]) { try { const h = fs.readFileSync(path.join(__dirname, "../..", f), "utf8"); ok(!/99\.?000|learn_month|LearnPlus\.(createOrder|startTrial)/.test(h), f + " không được có giá/mua"); } catch (e) {} }
  console.log(bad ? "✗ " + bad + " lỗi" : "✓ Nền Plus đạt"); process.exit(bad ? 1 : 0);
})().catch(e => { console.log("✗ lỗi chạy:", e.stack || e); process.exit(1); });
