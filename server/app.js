/**
 * Night Play – lõi API thanh toán (dùng chung cho server local và Netlify Function).
 *
 * Luồng:
 *  1) POST /api/orders        client chọn gói + email → server tạo đơn, giá lấy từ SERVER, trả QR VietQR
 *  2) Người dùng chuyển khoản (QR đã điền sẵn số tiền + mã đơn)
 *  3) POST /api/webhook/sepay cổng/ngân hàng báo có tiền → xác thực, khớp mã đơn + số tiền, cấp quyền (idempotent, trong 1 transaction)
 *  4) GET  /api/orders/:id    client poll → khi paid nhận token đã ký
 *  5) GET  /api/pass          game/landing gửi token → server trả active/exp (nguồn sự thật = bảng passes)
 *  6) POST /api/restore, /api/restore/verify   khôi phục gói bằng email + OTP
 *
 * handle({method, pathname, headers, bodyText, ip}) → { status, body }
 */
"use strict";
const crypto = require("crypto");
const db = require("./db");

/* ===== CẤU HÌNH (biến môi trường) ===== */
const env = (k, d) => (process.env[k] !== undefined && process.env[k] !== "" ? process.env[k] : d);
const CFG = {
  tokenSecret: env("TOKEN_SECRET", ""),            // BẮT BUỘC: chuỗi ngẫu nhiên >= 32 ký tự
  webhookKey: env("SEPAY_API_KEY", ""),            // BẮT BUỘC: khoá đặt ở SePay (Authorization: Apikey <khoá>)
  bankBin: env("BANK_BIN", ""),
  bankAccount: env("BANK_ACCOUNT", ""),
  bankAccountName: env("BANK_ACCOUNT_NAME", ""),
  bankName: env("BANK_NAME", ""),
  orderTtlMin: +env("ORDER_TTL_MIN", 15),
  adminKey: env("ADMIN_KEY", ""),                  // khoá vào trang /admin/ (để trống = tắt trang admin)
  dev: env("DEV_RELOAD", "") === "1",
  devOtp: env("DEV_OTP_LOG", "") === "1"
};
if (CFG.dev) {   // giá trị tạm để chạy local, KHÔNG dùng cho production
  CFG.tokenSecret ||= crypto.randomBytes(32).toString("hex");
  CFG.webhookKey ||= crypto.randomBytes(16).toString("hex");
  CFG.bankBin ||= "970436"; CFG.bankAccount ||= "0000000000"; CFG.bankAccountName ||= "DEV";
  CFG.adminKey ||= "dev-admin-key";
}
if (CFG.adminKey && CFG.adminKey.length < 16 && !CFG.dev) throw new Error("ADMIN_KEY phải dài >= 16 ký tự");
const missing = ["tokenSecret", "webhookKey", "bankBin", "bankAccount"].filter(k => !CFG[k]);
if (!env("DATABASE_URL", "")) missing.push("DATABASE_URL");
if (missing.length) throw new Error("Thiếu cấu hình: " + missing.join(", "));
if (CFG.tokenSecret.length < 32) throw new Error("TOKEN_SECRET phải dài >= 32 ký tự");

/* Bảng giá nằm ở SERVER. Client chỉ gửi plan id. */
const PLANS = {
  day:   { amount: 9000,   days: 1 },
  week:  { amount: 18000,  days: 7 },
  month: { amount: 36000,  days: 30 },
  year:  { amount: 199000, days: 365 }
};

/* ===== TIỆN ÍCH ===== */
const b64u = b => Buffer.from(b).toString("base64url");
const hmac = s => crypto.createHmac("sha256", CFG.tokenSecret).update(s).digest("base64url");
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const normEmail = e => String(e || "").trim().toLowerCase();
const validEmail = e => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ ký tự dễ nhầm
const newCode = () => "NP" + Array.from(crypto.randomBytes(8), b => ALPHA[b % ALPHA.length]).join("");
const ms = d => (d ? new Date(d).getTime() : 0);

/* Token chỉ để định danh (user id); quyền thật nằm ở bảng passes. */
function signToken(userId, exp, plan) {
  const body = b64u(JSON.stringify({ u: userId, x: exp, p: plan }));
  return body + "." + hmac(body);
}
function readToken(tok) {
  if (typeof tok !== "string") return null;
  const [body, sig] = tok.split(".");
  if (!body || !sig || !safeEq(sig, hmac(body))) return null;
  try { const t = JSON.parse(Buffer.from(body, "base64url").toString()); return t && t.u ? t : null; } catch { return null; }
}
async function passState(userId, q = db) {
  const { rows: [p] } = await q.query("select exp, plan from passes where user_id = $1", [userId]);
  return p ? { active: ms(p.exp) > Date.now(), exp: ms(p.exp), plan: p.plan } : { active: false, exp: 0, plan: null };
}

/* Rate limit theo cửa sổ cố định, lưu ở DB (chạy đúng khi nhiều instance serverless). */
async function limited(key, max, windowMs = 60000) {
  const bucket = Math.floor(Date.now() / windowMs);
  const { rows: [r] } = await db.query(
    `insert into rate_limits(key, bucket, count, expires_at) values ($1, $2, 1, to_timestamp($3))
     on conflict (key, bucket) do update set count = rate_limits.count + 1 returning count`,
    [key, bucket, (bucket + 1) * windowMs / 1000 + 60]);
  if (Math.random() < 0.02) sweep().catch(() => {});
  return r.count > max;
}
async function sweep() {
  await db.query("delete from rate_limits where expires_at < now()");
  await db.query("delete from otps where exp < now()");
  await db.query("delete from presence where last_seen < now() - interval '1 day'");
  await db.query("delete from relays where expires_at < now()");
}

/* Gửi email OTP. TODO: nối SMTP/Resend/SES tại đây. */
async function sendMail(to, subject, text) {
  if (CFG.devOtp) console.log(`[mail] to=${to} | ${subject} | ${text}`);
  // ví dụ: await fetch("https://api.resend.com/emails", {...})
}

/* ===== NGƯỜI DÙNG / ĐỊNH DANH ===== */
/* Tìm user theo email: ưu tiên identity đã xác thực (vd Google), sau đó identity email; chưa có thì tạo mới (chưa xác thực). */
async function userIdForEmail(c, email, create) {
  let { rows: [r] } = await c.query(
    `select user_id from identities where email_verified and lower(email) = $1 order by id limit 1`, [email]);
  if (r) return r.user_id;
  ({ rows: [r] } = await c.query(`select user_id from identities where provider = 'email' and provider_uid = $1`, [email]));
  if (r) return r.user_id;
  if (!create) return null;
  const { rows: [u] } = await c.query("insert into users default values returning id");
  await c.query(
    `insert into identities(user_id, provider, provider_uid, email, email_verified) values ($1, 'email', $2, $2, false)
     on conflict (provider, provider_uid) do nothing`, [u.id, email]);
  /* nếu bị tranh chấp (2 request cùng lúc), lấy user thắng cuộc */
  ({ rows: [r] } = await c.query(`select user_id from identities where provider = 'email' and provider_uid = $1`, [email]));
  return r.user_id;
}

/* ===== CẤP QUYỀN: gọi trong transaction, order đã bị khoá (FOR UPDATE) và tx đã được ghi ===== */
async function grant(c, order, txId) {
  const plan = PLANS[order.plan];
  const { rows: [p] } = await c.query(
    `insert into passes(user_id, exp, plan) values ($1, now() + make_interval(days => $2), $3)
     on conflict (user_id) do update set exp = greatest(now(), passes.exp) + make_interval(days => $2), plan = $3, updated_at = now()
     returning exp`, [order.user_id, plan.days, order.plan]);   // mua thêm = cộng dồn
  await c.query("update orders set status = 'paid', paid_at = now(), exp = $2, tx_id = $3 where id = $1", [order.id, p.exp, txId]);
}

/* ===== HANDLERS ===== */
const routes = [];
const route = (method, re, fn) => routes.push({ method, re, fn });
const out = (status, body, type) => ({ status, body, type });   // type: trả văn bản thô (vd. JavaScript) thay vì JSON

route("POST", /^\/api\/orders$/, async ({ body, ip }) => {
  if (await limited("o:" + ip, 10)) return out(429, { error: "rate_limited" });
  const plan = PLANS[body.plan];
  const email = normEmail(body.email);
  if (!plan) return out(400, { error: "bad_plan" });
  if (!validEmail(email)) return out(400, { error: "bad_email" });
  const id = crypto.randomBytes(16).toString("hex");
  const method = String(body.method || "bank").slice(0, 16);
  let order;
  for (let i = 0; i < 5 && !order; i++) {
    try {
      order = await db.tx(async c => {
        const userId = await userIdForEmail(c, email, true);
        const { rows: [o] } = await c.query(
          `insert into orders(id, code, user_id, email, plan, amount, method, expires_at)
           values ($1, $2, $3, $4, $5, $6, $7, now() + make_interval(mins => $8)) returning code, expires_at`,
          [id, newCode(), userId, email, body.plan, plan.amount, method, CFG.orderTtlMin]);
        return o;
      });
    } catch (e) { if (!(e.code === "23505" && /code/.test(e.constraint || ""))) throw e; }   // trùng mã → thử mã khác
  }
  if (!order) return out(500, { error: "server" });
  const qs = new URLSearchParams({ amount: plan.amount, addInfo: order.code });
  if (CFG.bankAccountName) qs.set("accountName", CFG.bankAccountName);
  return out(201, {
    orderId: id, code: order.code, amount: plan.amount, expiresAt: ms(order.expires_at),
    qr: `https://img.vietqr.io/image/${CFG.bankBin}-${CFG.bankAccount}-compact2.png?${qs}`,
    bank: { name: CFG.bankName, account: CFG.bankAccount, holder: CFG.bankAccountName }
  });
});

route("GET", /^\/api\/orders\/([a-f0-9]{32})$/, async ({ m }) => {
  const { rows: [o] } = await db.query("select user_id, plan, status, exp, expires_at from orders where id = $1", [m[1]]);
  if (!o) return out(404, { error: "not_found" });
  if (o.status === "paid") return out(200, { status: "paid", exp: ms(o.exp), plan: o.plan, token: signToken(o.user_id, ms(o.exp), o.plan) });
  if (Date.now() > ms(o.expires_at)) return out(200, { status: "expired" });
  return out(200, { status: "pending" });
});

/* Webhook SePay: header "Authorization: Apikey <SEPAY_API_KEY>"; body: id, transferType, transferAmount, content, accountNumber. */
route("POST", /^\/api\/webhook\/sepay$/, async ({ headers, body }) => {
  if (!safeEq(String(headers.authorization || ""), "Apikey " + CFG.webhookKey)) return out(401, { success: false });
  if (body.transferType !== "in") return out(200, { success: true });
  const txId = String(body.id ?? body.referenceCode ?? "");
  if (!txId) return out(400, { success: false });
  const amount = Math.round(Number(body.transferAmount));
  if (!Number.isFinite(amount) || amount <= 0) return out(400, { success: false });
  const account = body.accountNumber == null ? null : String(body.accountNumber);
  const content = String(body.content || "");
  const m = content.toUpperCase().replace(/[^A-Z0-9]/g, "").match(/NP[A-HJ-NP-Z2-9]{8}/);

  await db.tx(async c => {
    /* khoá đơn trước để 2 webhook cùng đơn chạy tuần tự */
    const wrongAccount = account !== null && account.replace(/\W/g, "") !== CFG.bankAccount.replace(/\W/g, "");
    const order = !wrongAccount && m ? (await c.query("select * from orders where code = $1 for update", [m[0]])).rows[0] : undefined;
    let result;
    if (wrongAccount) result = "wrong_account";                                      // giao dịch của tài khoản khác
    else if (!order) result = "unmatched";
    else if (amount < order.amount) result = "underpaid";                            // thiếu tiền: không cấp, xử lý tay
    else if (order.status === "paid") result = "duplicate";                          // đơn đã trả rồi, khoản này cần hoàn/xử lý tay
    else result = "granted";                                                         // nhận cả đơn đã hết hạn vì tiền đã vào
    /* tx.id là PK: webhook gọi lại → conflict → bỏ qua, không cấp lần 2 */
    const ins = await c.query(
      `insert into txs(id, amount, content, account, order_id, result, raw) values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (id) do nothing returning id`,
      [txId, amount, content.slice(0, 200), account, order && result !== "wrong_account" ? order.id : null, result, JSON.stringify(body).slice(0, 4000)]);
    if (ins.rowCount === 1 && result === "granted") await grant(c, order, txId);
  });
  return out(200, { success: true });
});

route("GET", /^\/api\/pass$/, async ({ headers }) => {
  const t = readToken(String(headers.authorization || "").replace(/^Bearer /, ""));
  if (!t) return out(401, { active: false });
  return out(200, await passState(t.u));
});

/* Khôi phục: luôn trả 200 để không lộ email nào đã mua. */
route("POST", /^\/api\/restore$/, async ({ body, ip }) => {
  const email = normEmail(body.email);
  if ((await limited("r:" + ip, 5)) || !validEmail(email)) return out(429, { error: "rate_limited" });
  const userId = await userIdForEmail(db, email, false);
  if (userId && (await passState(userId)).exp && !(await limited("re:" + email, 3, 600000))) {
    const otp = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    await db.query(
      `insert into otps(email, hash, exp, tries) values ($1, $2, now() + interval '10 minutes', 0)
       on conflict (email) do update set hash = $2, exp = now() + interval '10 minutes', tries = 0`, [email, hmac(email + otp)]);
    await sendMail(email, "Mã khôi phục Night Play", `Mã của bạn: ${otp} (hiệu lực 10 phút)`);
  }
  return out(200, { ok: true });
});
route("POST", /^\/api\/restore\/verify$/, async ({ body, ip }) => {
  const email = normEmail(body.email), otp = String(body.otp || "");
  if (await limited("v:" + ip, 10)) return out(429, { error: "rate_limited" });
  /* tăng số lần thử nguyên tử; hết hạn hoặc quá 5 lần thì không còn bản ghi khớp */
  const { rows: [r] } = await db.query("update otps set tries = tries + 1 where email = $1 and exp > now() and tries < 5 returning hash", [email]);
  if (!r || !/^\d{6}$/.test(otp) || !safeEq(r.hash, hmac(email + otp))) return out(400, { error: "invalid" });
  const userId = await db.tx(async c => {
    const del = await c.query("delete from otps where email = $1 and hash = $2", [email, r.hash]);
    if (del.rowCount !== 1) return null;                                              // đã dùng ở request khác
    const id = await userIdForEmail(c, email, false);
    if (id) await c.query("update identities set email_verified = true where provider = 'email' and provider_uid = $1", [email]);   // OTP chứng minh quyền sở hữu email
    return id;
  });
  if (!userId) return out(400, { error: "invalid" });
  const s = await passState(userId);
  return out(200, { ...s, token: signToken(userId, s.exp, s.plan) });
});

const TZ = "Asia/Ho_Chi_Minh";   // ngày thống kê tính theo giờ Việt Nam
/* ===== THỐNG KÊ TRUY CẬP (ẩn danh; không lưu IP, UA hay mã định danh lâu dài) ===== */
const SITES = new Set(["home", "popplay", "cozyplay", "subscribe"]);
const clean = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, n);
const TODAY = "(now() at time zone $1)::date";
/* Body: { e: view|play|beat|stop, s: site, g: id game, n: tên game, i: mã phiên chơi (ngẫu nhiên, 1 lần chơi) } */
route("POST", /^\/api\/t$/, async ({ body }) => {
  const e = String(body.e || ""), site = String(body.s || "");
  const game = clean(body.g, 40), name = clean(body.n, 40), sid = clean(body.i, 32);
  const okGame = /^[a-z0-9_-]{1,40}$/.test(String(body.g == null ? "" : body.g)), okSid = /^[a-z0-9]{8,32}$/.test(String(body.i == null ? "" : body.i));
  if (e === "stop") {
    if (okSid) await db.query("delete from presence where sid = $1", [sid]);
  } else if (!SITES.has(site)) {
    return out(400, { error: "bad_site" });
  } else if (e === "view") {
    await db.query(`insert into stats_daily(day, site, game, views) values (${TODAY}, $2::text, '', 1)
      on conflict (day, site, game) do update set views = stats_daily.views + 1`, [TZ, site]);
  } else if ((e === "play" || e === "beat") && okGame && okSid) {
    /* chống rác: mỗi site tối đa 60 game khác nhau mỗi ngày (game đã có thì luôn được ghi) */
    const { rows: [a] } = await db.query(`select exists(select 1 from stats_daily where day = ${TODAY} and site = $2 and game = $3)
      or (select count(*) from stats_daily where day = ${TODAY} and site = $2 and game <> '') < 60 as ok`, [TZ, site, game]);
    if (!a.ok) return out(200, { ok: true });
    if (e === "play") {
      await db.tx(async c => {
        await c.query(`insert into stats_daily(day, site, game, name, plays) values (${TODAY}, $2::text, $3::text, $4::text, 1)
          on conflict (day, site, game) do update set plays = stats_daily.plays + 1, name = coalesce(nullif(excluded.name, ''), stats_daily.name)`, [TZ, site, game, name]);
        await c.query(`insert into presence(sid, site, game, name) values ($1, $2, $3, $4)
          on conflict (sid) do update set site = excluded.site, game = excluded.game, name = excluded.name, last_seen = now()`, [sid, site, game, name]);
      });
    } else {
      /* nhịp 60s: chỉ cộng giây khi cách nhịp trước >= 45s (chống bơm số liệu bằng cách gửi dồn dập) */
      await db.query(`with p as (
          insert into presence(sid, site, game, name) values ($5, $2, $3, $4)
          on conflict (sid) do update set site = excluded.site, game = excluded.game, name = excluded.name, last_seen = now()
            where presence.last_seen < now() - interval '45 seconds'
          returning sid)
        insert into stats_daily(day, site, game, name, play_seconds)
        select ${TODAY}, $2::text, $3::text, $4::text, 60 from p
        on conflict (day, site, game) do update set play_seconds = stats_daily.play_seconds + 60, name = coalesce(nullif(excluded.name, ''), stats_daily.name)`,
        [TZ, site, game, name, sid]);
    }
  } else return out(400, { error: "bad_event" });
  return out(200, { ok: true });
});

/* ===== ADMIN (cần header Authorization: Bearer <ADMIN_KEY>) ===== */
async function adminGuard(headers, ip) {
  if (!CFG.adminKey) return out(503, { error: "admin_disabled" });
  if (await limited("adm:" + ip, 120)) return out(429, { error: "rate_limited" });
  if (!safeEq(String(headers.authorization || "").replace(/^Bearer /, ""), CFG.adminKey)) return out(401, { error: "unauthorized" });
  return null;
}
const pageArgs = query => {
  const size = Math.min(100, Math.max(1, parseInt(query.get("size"), 10) || 10));
  const page = Math.max(1, parseInt(query.get("page"), 10) || 1);
  return { size, page, offset: (page - 1) * size };
};

/* Đang chơi: phiên có nhịp trong 150s gần nhất */
async function liveNow() {
  const { rows } = await db.query(`select site, game, max(name) as name, count(*)::int n from presence
    where last_seen > now() - interval '150 seconds' group by site, game order by n desc, game`);
  return { total: rows.reduce((a, r) => a + r.n, 0), items: rows.map(r => ({ site: r.site, game: r.game, name: r.name, n: r.n })) };
}
route("GET", /^\/api\/admin\/live$/, async ({ headers, ip }) => {
  const denied = await adminGuard(headers, ip); if (denied) return denied;
  return out(200, await liveNow());
});

route("GET", /^\/api\/admin\/stats$/, async ({ headers, ip, query }) => {
  const denied = await adminGuard(headers, ip); if (denied) return denied;
  const days = Math.min(365, Math.max(1, parseInt(query.get("days"), 10) || 30));
  const { rows: [{ start }] } = await db.query("select (((now() at time zone $1)::date - ($2::int - 1))::timestamp at time zone $1) as start", [TZ, days]);
  const [tot, daily, plans, users, passes, review, traffic, games, prevGames, live, paywall] = await Promise.all([
    db.query(`select
        count(*) filter (where status = 'paid' and paid_at >= $1)::int paid_period,
        coalesce(sum(amount) filter (where status = 'paid' and paid_at >= $1), 0)::bigint revenue_period,
        count(*) filter (where created_at >= $1)::int created_period,
        count(*) filter (where status = 'pending' and expires_at > now())::int pending_now,
        count(*) filter (where status = 'paid')::int paid_all,
        coalesce(sum(amount) filter (where status = 'paid'), 0)::bigint revenue_all
      from orders`, [start]),
    db.query(`select to_char(d, 'YYYY-MM-DD') as day, coalesce(sum(o.amount), 0)::bigint revenue, count(o.id)::int orders
      from generate_series(($1::timestamptz at time zone $2)::date, (now() at time zone $2)::date, interval '1 day') d
      left join orders o on o.status = 'paid' and (o.paid_at at time zone $2)::date = d::date
      group by d order by d`, [start, TZ]),
    db.query(`select plan, count(*)::int n, sum(amount)::bigint revenue from orders where status = 'paid' and paid_at >= $1 group by plan`, [start]),
    db.query(`select count(*)::int total, count(*) filter (where created_at >= $1)::int new_period from users`, [start]),
    db.query(`select count(*)::int active, count(*) filter (where exp > now() and exp <= now() + interval '3 days')::int expiring from passes where exp > now()`),
    db.query(`select count(*)::int n from txs where result <> 'granted'`),
    db.query(`select to_char(d, 'YYYY-MM-DD') as day, coalesce(sum(s.views), 0)::bigint views, coalesce(sum(s.plays), 0)::bigint plays, coalesce(sum(s.play_seconds), 0)::bigint secs
      from generate_series(($1::timestamptz at time zone $2)::date, (now() at time zone $2)::date, interval '1 day') d
      left join stats_daily s on s.day = d::date group by d order by d`, [start, TZ]),
    db.query(`select site, game, max(name) as name, sum(plays)::int plays, sum(play_seconds)::bigint secs from stats_daily
      where game <> '' and day >= ($1::timestamptz at time zone $2)::date group by site, game having sum(plays) > 0
      order by plays desc, secs desc limit 8`, [start, TZ]),
    db.query(`select site, game, sum(plays)::int plays from stats_daily
      where game <> '' and day >= (($1::timestamptz at time zone $2)::date - $3::int) and day < ($1::timestamptz at time zone $2)::date
      group by site, game`, [start, TZ, days]),
    liveNow(),
    db.query(`select split_part(key, ':', 1) as f, split_part(key, ':', 2) as k, sum(n)::int n from paywall_daily where day >= ($1::timestamptz at time zone $2)::date group by 1, 2`, [start, TZ])
  ]);
  const t = tot.rows[0];
  const byPlan = Object.fromEntries(plans.rows.map(r => [r.plan, r]));
  return out(200, {
    days, since: ms(start), tz: TZ,
    totals: {
      revenuePeriod: Number(t.revenue_period), paidPeriod: t.paid_period, createdPeriod: t.created_period,
      pendingNow: t.pending_now, paidAll: t.paid_all, revenueAll: Number(t.revenue_all),
      users: users.rows[0].total, newUsers: users.rows[0].new_period,
      activePasses: passes.rows[0].active, expiringSoon: passes.rows[0].expiring,
      reviewCount: review.rows[0].n,
      views: traffic.rows.reduce((a, r) => a + Number(r.views), 0),
      plays: traffic.rows.reduce((a, r) => a + Number(r.plays), 0),
      playMinutes: Math.round(traffic.rows.reduce((a, r) => a + Number(r.secs), 0) / 60),
      playingNow: live.total
    },
    daily: daily.rows.map(r => ({ day: r.day, revenue: Number(r.revenue), orders: r.orders })),
    traffic: traffic.rows.map(r => ({ day: r.day, views: Number(r.views), plays: Number(r.plays), minutes: Math.round(Number(r.secs) / 60) })),
    games: games.rows.map(r => {
      const prev = prevGames.rows.find(x => x.site === r.site && x.game === r.game);
      return { site: r.site, game: r.game, name: r.name || r.game, plays: r.plays, minutes: Math.round(Number(r.secs) / 60),
               avgMin: r.plays ? Math.round(Number(r.secs) / r.plays / 6) / 10 : 0, prevPlays: prev ? prev.plays : 0 };
    }),
    live,
    paywall: { view: paywall.rows.filter(r => r.k === "view").reduce((a, r) => a + r.n, 0), click: paywall.rows.filter(r => r.k === "click").reduce((a, r) => a + r.n, 0), trial: paywall.rows.filter(r => r.k === "trial").reduce((a, r) => a + r.n, 0),
      byFeature: paywall.rows.map(r => ({ feature: r.f, kind: r.k, n: r.n })) },
    plans: Object.keys(PLANS).map(id => ({ plan: id, price: PLANS[id].amount, orders: byPlan[id] ? byPlan[id].n : 0, revenue: byPlan[id] ? Number(byPlan[id].revenue) : 0 }))
  });
});

/* Danh sách đơn, phân trang phía server: ?page=1&size=10&status=all|paid|pending|expired&q=<email hoặc mã đơn> */
route("GET", /^\/api\/admin\/orders$/, async ({ headers, ip, query }) => {
  const denied = await adminGuard(headers, ip); if (denied) return denied;
  const { size, page, offset } = pageArgs(query);
  const where = [], params = [];
  const status = query.get("status") || "all";
  if (status === "paid") where.push("status = 'paid'");
  else if (status === "pending") where.push("status = 'pending' and expires_at > now()");
  else if (status === "expired") where.push("status = 'pending' and expires_at <= now()");
  const q = String(query.get("q") || "").trim().slice(0, 80);
  if (q) {
    params.push("%" + q.replace(/[\\%_]/g, "\\$&") + "%");
    where.push("(email ilike $" + params.length + " or code ilike $" + params.length + ")");
  }
  const w = where.length ? "where " + where.join(" and ") : "";
  const [{ rows: [c] }, { rows }] = await Promise.all([
    db.query(`select count(*)::int n from orders ${w}`, params),
    db.query(`select id, code, email, plan, amount, status, created_at, expires_at, paid_at from orders ${w}
              order by created_at desc limit $${params.length + 1} offset $${params.length + 2}`, [...params, size, offset])
  ]);
  return out(200, { page, size, total: c.n, rows: rows.map(r => ({
    id: r.id, code: r.code, email: r.email, plan: r.plan, amount: r.amount, status: r.status,
    createdAt: ms(r.created_at), expiresAt: ms(r.expires_at), paidAt: ms(r.paid_at) })) });
});

/* Giao dịch cần xử lý, phân trang: ?page=1&size=10&result=all|underpaid|unmatched|wrong_account|duplicate */
route("GET", /^\/api\/admin\/review$/, async ({ headers, ip, query }) => {
  const denied = await adminGuard(headers, ip); if (denied) return denied;
  const { size, page, offset } = pageArgs(query);
  const result = query.get("result") || "all";
  const params = [], where = ["t.result <> 'granted'"];
  if (["underpaid", "unmatched", "wrong_account", "duplicate"].includes(result)) { params.push(result); where.push("t.result = $1"); }
  const w = "where " + where.join(" and ");
  const [{ rows: [c] }, { rows }] = await Promise.all([
    db.query(`select count(*)::int n from txs t ${w}`, params),
    db.query(`select t.id, t.at, t.amount, t.content, t.account, t.result, o.code, o.email, o.amount order_amount
              from txs t left join orders o on o.id = t.order_id ${w}
              order by t.at desc limit $${params.length + 1} offset $${params.length + 2}`, [...params, size, offset])
  ]);
  return out(200, { page, size, total: c.n, rows: rows.map(r => ({
    id: r.id, at: ms(r.at), amount: Number(r.amount), content: r.content, account: r.account, result: r.result,
    code: r.code, email: r.email, orderAmount: r.order_amount })) });
});

/* ===== XÃ HỘI: bảng xếp hạng tự nguyện + chuyển tiếp kết quả "chơi hộ" =====
   Không lưu IP/thiết bị/email. IP chỉ được băm kèm ngày (không đảo ngược được) để giới hạn spam trong vài giờ. */
const ipHash = ip => hmac("ip|" + ip + "|" + new Date().toISOString().slice(0, 10)).slice(0, 16);
const sha256hex = s => crypto.createHash("sha256").update(String(s)).digest("hex");
const RID = "[A-Za-z0-9_-]{22}", HEX64 = /^[a-f0-9]{64}$/;

/* Game có bảng xếp hạng (chỉ game dành cho người lớn; trang trẻ em không có). max = điểm tối đa hợp lệ của 1 lượt chơi. */
/* Game trẻ em (kids:true): KHÔNG nhận tên gõ tay. Chỉ nhận tên vui ghép từ danh sách có sẵn: "<Con vật> <Tính từ> <số 10-99>" (VI) hoặc "<Adj> <Animal> <số>" (EN).
   Danh sách này phải khớp với KID_NAMES trong shared/social.js. */
const KID_NAMES = {
  vi: { a: ["Mèo", "Gấu", "Thỏ", "Ếch", "Cá", "Voi", "Chim", "Cú", "Hổ", "Sóc"], j: ["Vui", "Nhanh", "Giỏi", "Khỏe", "Xinh", "Ngoan", "Siêu", "Lém"] },
  en: { a: ["Cat", "Bear", "Bunny", "Frog", "Fish", "Owl", "Tiger", "Lion", "Panda", "Duck"], j: ["Happy", "Swift", "Brave", "Jolly", "Sunny", "Lucky", "Super", "Zippy"] }
};
const kidNickOk = n => { const p = String(n).split(" "); if (p.length !== 3 || !/^[1-9]\d$/.test(p[2])) return false;
  return (KID_NAMES.vi.a.includes(p[0]) && KID_NAMES.vi.j.includes(p[1])) || (KID_NAMES.en.j.includes(p[0]) && KID_NAMES.en.a.includes(p[1])); };
const POP_GAMES = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map(i => ["game-" + i, { max: 1000, kids: true }]));   // max = điểm tối đa hợp lệ (chỉnh theo từng game khi có)
POP_GAMES["pop-fly"] = { max: 1500, kids: true };   // Chim Bay Học Vui
const SCORE_GAMES = { "dap-deadline": { max: 5000 }, ...POP_GAMES };
const nickOk = n => /^[\p{L}\p{N} _.\-]{2,16}$/u.test(n) && !/https?|www\.|\.(com|net|org|vn|io)\b|@/i.test(n);

/* Chỉ ghi khi người chơi chủ động bấm "Khoe điểm". */
route("POST", /^\/api\/scores$/, async ({ body, ip }) => {
  const g = SCORE_GAMES[body.game], score = body.score;
  if (!g || !Number.isInteger(score) || score < 1 || score > g.max) return out(400, { error: "bad_input" });
  const nick = String(body.nick || "").trim().replace(/\s+/g, " ");
  if (g.kids ? !kidNickOk(nick) : !nickOk(nick)) return out(400, { error: "bad_nick" });
  if (await limited("sc:" + ipHash(ip), 6, 3600000)) return out(429, { error: "slow_down" });
  const pro = !!(await passFromToken(body.pass));   // huy hiệu Night Pass: máy chủ tự kiểm tra, không lưu token
  await db.query("insert into scores(game, nick, score, day, pro) values ($1, $2, $3, (now() at time zone $4)::date, $5)", [body.game, nick, score, TZ, pro]);
  return out(200, { ok: true });
});
route("GET", /^\/api\/scores$/, async ({ query }) => {
  const game = query.get("game"), period = query.get("period") || "week";
  if (!SCORE_GAMES[game] || !["day", "week", "all"].includes(period)) return out(400, { error: "bad_input" });
  const limit = Math.min(30, Math.max(3, parseInt(query.get("limit") || "10", 10) || 10));
  const today = "(now() at time zone $2)::date", cond = period === "day" ? `day = ${today}` : period === "week" ? `day >= ${today} - 6` : "$2::text is not null";
  const { rows } = await db.query(
    `select nick, max(score) as score, max(day) as day, bool_or(pro) as pro from scores where game = $1 and ${cond}
     group by nick order by score desc, min(created_at) asc limit $3`, [game, TZ, limit]);
  return out(200, { game, period, rows: rows.map((r, i) => ({ rank: i + 1, nick: r.nick, score: r.score, pro: !!r.pro, day: String(r.day instanceof Date ? r.day.toISOString() : r.day).slice(0, 10) })) });
});

/* Chơi hộ: 1) chủ nhân tạo  2) người chơi hộ nhận (chỉ 1 lần)  3) người chơi hộ gửi kết quả đã mã hoá  4) chủ nhân lấy rồi xác nhận → xoá */
route("POST", /^\/api\/relay$/, async ({ body, ip }) => {
  if (!new RegExp("^" + RID + "$").test(String(body.id)) || !HEX64.test(String(body.owner))) return out(400, { error: "bad_input" });
  if (await limited("rl:" + ipHash(ip), 8, 3600000)) return out(429, { error: "slow_down" });
  const r = await db.query("insert into relays(id, owner_hash, expires_at) values ($1, $2, now() + interval '24 hours') on conflict do nothing", [body.id, body.owner]);
  return r.rowCount ? out(200, { ok: true, ttlHours: 24 }) : out(409, { error: "exists" });
});
route("POST", new RegExp("^/api/relay/(" + RID + ")/claim$"), async ({ m, body, ip }) => {
  if (!HEX64.test(String(body.claim))) return out(400, { error: "bad_input" });
  if (await limited("rc:" + ipHash(ip), 30, 3600000)) return out(429, { error: "slow_down" });
  const r = await db.query("update relays set claim_hash = $2, state = 'claimed' where id = $1 and state = 'open' and expires_at > now()", [m[1], body.claim]);
  return r.rowCount ? out(200, { ok: true }) : out(409, { error: "unavailable" });     // đã có người nhận / hết hạn / không tồn tại
});
route("POST", new RegExp("^/api/relay/(" + RID + ")/result$"), async ({ m, body }) => {
  const blob = String(body.blob || "");
  if (!/^[A-Za-z0-9_-]{16,3000}$/.test(blob) || typeof body.token !== "string" || body.token.length < 16 || body.token.length > 64) return out(400, { error: "bad_input" });
  const r = await db.query("update relays set blob = $3, state = 'done' where id = $1 and state = 'claimed' and claim_hash = $2 and expires_at > now()", [m[1], sha256hex(body.token), blob]);
  return r.rowCount ? out(200, { ok: true }) : out(403, { error: "forbidden" });
});
route("GET", new RegExp("^/api/relay/(" + RID + ")$"), async ({ m }) => {
  const { rows: [r] } = await db.query("select state, blob, expires_at from relays where id = $1", [m[1]]);
  if (!r || ms(r.expires_at) < Date.now()) return out(404, { error: "gone" });
  return out(200, { state: r.state, blob: r.state === "done" ? r.blob : null, expiresAt: ms(r.expires_at) });
});
route("POST", new RegExp("^/api/relay/(" + RID + ")/ack$"), async ({ m, body }) => {      // chủ nhân đã nhận → xoá hẳn khỏi máy chủ
  if (typeof body.token !== "string" || body.token.length < 16 || body.token.length > 64) return out(400, { error: "bad_input" });
  const r = await db.query("delete from relays where id = $1 and owner_hash = $2", [m[1], sha256hex(body.token)]);
  return r.rowCount ? out(200, { ok: true }) : out(403, { error: "forbidden" });
});

/* ===== BẢN TRẢ PHÍ CỦA GAME (Night Pass) =====
   Mã chế độ/độ khó/chủ đề/thống kê KHÔNG nằm trong thư mục công khai: chỉ giao khi có token Night Pass còn hạn (hoặc bản dùng thử 1 lượt/ngày). */
async function passFromToken(tok) {
  const t = readToken(tok); if (!t) return null;
  const p = await passState(t.u); return p.active ? p : null;
}
const authPass = headers => { const m = /^Bearer (.+)$/.exec(headers.authorization || ""); return m ? passFromToken(m[1]) : Promise.resolve(null); };
/* Vé chơi hộ: người có Night Pass cấp một vé ngắn hạn (24 giờ) để bạn bè chơi tiếp đúng chế độ trả phí. Vé KHÔNG phải Night Pass: chỉ mở mã game + thử thách ngày, không có tài khoản, không dùng để đăng ký. */
const mkTicket = () => { const x = Date.now() + 86400000; return "h." + x + "." + hmac("hticket|" + x); };
const okTicket = tok => { const m = /^h\.(\d{13})\.([A-Za-z0-9_-]{43})$/.exec(tok || ""); return !!m && +m[1] > Date.now() && safeEq(m[2], hmac("hticket|" + m[1])); };
const authHelper = headers => { const m = /^Bearer (.+)$/.exec(headers.authorization || ""); return !!m && okTicket(m[1]); };
route("POST", /^\/api\/pro\/ticket$/, async ({ headers }) => {
  if (!(await authPass(headers))) return out(401, { error: "pass_required" });
  return out(200, { ticket: mkTicket() });
});
route("GET", /^\/api\/pro\/dap-deadline\.js$/, async ({ headers, query, ip }) => {
  const pass = await authPass(headers); let trial = false;
  if (!pass && authHelper(headers)) return out(200, require("./pro/dap-deadline").source({ helper: true }), "application/javascript; charset=utf-8");
  if (!pass) {
    if (query.get("trial") !== "1") return out(401, { error: "pass_required" });
    if (await limited("pt:" + ipHash(ip), 1, 86400000)) return out(429, { error: "trial_used" });      // dùng thử: 1 lượt mỗi ngày
    trial = true;
    await db.query("insert into paywall_daily(day, key, n) values ((now() at time zone $1)::date, 'endless:trial', 1) on conflict (day, key) do update set n = paywall_daily.n + 1", [TZ]);
  }
  return out(200, require("./pro/dap-deadline").source({ trial }), "application/javascript; charset=utf-8");
});
/* Chim Bay Học Vui (Pop Play): loại trả phí (Bay đếm sao, Tàu bay phép tính) chỉ giao cho người có Night Pass; dùng thử: chỉ Bay đếm sao, 1 ván/ngày */
route("GET", /^\/api\/pro\/pop-fly\.js$/, async ({ headers, query, ip }) => {
  const pass = await authPass(headers); let trial = false;
  if (!pass) {
    if (query.get("trial") !== "1") return out(401, { error: "pass_required" });
    if (await limited("pft:" + ipHash(ip), 1, 86400000)) return out(429, { error: "trial_used" });
    trial = true;
    await db.query("insert into paywall_daily(day, key, n) values ((now() at time zone $1)::date, 'fly_stars:trial', 1) on conflict (day, key) do update set n = paywall_daily.n + 1", [TZ]);
  }
  return out(200, require("./pro/pop-fly").source({ trial }), "application/javascript; charset=utf-8");
});
/* Thử thách ngày: hạt giống + mục tiêu do máy chủ quyết định (giờ Việt Nam), chỉ cho người có Night Pass */
route("GET", /^\/api\/pro\/daily$/, async ({ headers }) => {
  if (!(await authPass(headers)) && !authHelper(headers)) return out(401, { error: "pass_required" });
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
  const h = crypto.createHmac("sha256", CFG.tokenSecret).update("daily|dap-deadline|" + day).digest();
  return out(200, { day, seed: h.readUInt32BE(0), goal: [300, 350, 400, 450, 500][h[4] % 5] });
});
/* Đếm lượt xem / bấm vào tính năng bị khóa (ẩn danh, chỉ số tổng hợp theo ngày) */
const PAYWALL_KEYS = new Set(["endless", "daily", "boss", "diff", "skin", "grid", "pack", "stats", "fly_stars", "fly_math"]);
route("POST", /^\/api\/paywall$/, async ({ body, ip }) => {
  const f = String(body.f || ""), k = String(body.k || "");
  if (!PAYWALL_KEYS.has(f) || !["view", "click", "trial"].includes(k)) return out(400, { error: "bad_event" });
  if (await limited("pw:" + ipHash(ip), 60, 3600000)) return out(429, { error: "slow_down" });
  await db.query("insert into paywall_daily(day, key, n) values ((now() at time zone $1)::date, $2, 1) on conflict (day, key) do update set n = paywall_daily.n + 1", [TZ, f + ":" + k]);
  return out(200, { ok: true });
});

route("GET", /^\/api\/health$/, async () => {
  await db.query("select 1");
  return out(200, { ok: true });
});

/* ===== ĐIỂM VÀO ===== */
async function handle({ method, pathname, query = new URLSearchParams(), headers = {}, bodyText = "", ip = "" }) {
  for (const r of routes) {
    const m = pathname.match(r.re);
    if (!m || r.method !== method) continue;
    try {
      let body = {};
      if (r.method === "POST") {
        if (Buffer.byteLength(bodyText) > 10240) return out(413, { error: "too_large" });
        try { body = bodyText ? JSON.parse(bodyText) : {}; } catch { return out(400, { error: "bad_json" }); }
      }
      return await r.fn({ m, query, headers, body: body && typeof body === "object" ? body : {}, ip });
    } catch (e) {
      console.error(String(e && e.stack || e).replace(/npg_\w+/g, "<ẩn>"));
      return out(500, { error: "server", code: e && /^[0-9A-Z]{5}$|^E[A-Z]+$/.test(String(e.code || "")) ? e.code : undefined });   // chỉ mã lỗi (vd. 42P01 = chưa có bảng), không kèm chi tiết
    }
  }
  return out(404, { error: "not_found" });
}

module.exports = { handle, CFG, PLANS };
