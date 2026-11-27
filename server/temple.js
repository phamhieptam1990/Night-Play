"use strict";
/* Chùa Học Bá Online (Cozy Play): bộ đếm "hôm nay đã có N người cùng cầu" (thật, đếm lượt cầu) và bảng thi đua tuần theo lớp / trường / tỉnh.
   Không lưu IP hay định danh cá nhân: chỉ cộng dồn điểm công đức theo TÊN NHÓM do người chơi tự khai. Bảng: temple_daily, temple_groups (migrations/010_temple.sql). */
const PROVINCES = require("./data/provinces.json");
const MAX_SCORE = 3000;
module.exports = function register({ route, out, db, limited, ipHash, TZ }) {
  const clean = s => String(s == null ? "" : s).trim().replace(/\s+/g, " ");
  const nameOk = n => /^[\p{L}\p{N} _.\-\/]{1,40}$/u.test(n) && !/https?|www\.|@|\.(com|net|org|vn|io)\b/i.test(n);
  const norm = s => clean(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();
  const provOf = p => PROVINCES.find(x => norm(x) === norm(p)) || null;
  route("POST", /^\/api\/temple\/pray$/, async ({ body, ip }) => {
    const w = body && body.wish; if (!Number.isInteger(w) || w < 0 || w > 3) return out(400, { error: "bad_input" });
    if (await limited("tp:" + ipHash(ip), 40, 86400000)) return out(429, { error: "slow_down" });
    await db.query("insert into temple_daily(day, wish, n) values ((now() at time zone $1)::date, $2, 1) on conflict (day, wish) do update set n = temple_daily.n + 1", [TZ, w]);
    return out(200, { ok: true });
  });
  route("GET", /^\/api\/temple\/count$/, async () => {
    const { rows } = await db.query("select wish, n from temple_daily where day = (now() at time zone $1)::date", [TZ]);
    const by = [0, 0, 0, 0]; rows.forEach(r => { by[r.wish] = r.n; });
    return out(200, { n: by.reduce((a, b) => a + b, 0), by });
  });
  /* Nộp điểm công đức của một ván cho nhóm của người chơi (người chơi đã tự bật bằng cách khai tỉnh/trường/lớp) */
  route("POST", /^\/api\/temple\/merit$/, async ({ body, ip }) => {
    const b = body || {}, score = b.score;
    if (!Number.isInteger(score) || score < 1 || score > MAX_SCORE) return out(400, { error: "bad_input" });
    const prov = clean(b.province) ? provOf(b.province) : null, school = clean(b.school), cls = clean(b.cls);
    if (clean(b.province) && !prov) return out(400, { error: "bad_province" });
    if ((school && !nameOk(school)) || (cls && !nameOk(cls))) return out(400, { error: "bad_name" });
    if (cls && !school) return out(400, { error: "class_needs_school" });
    if (!prov && !school) return out(400, { error: "no_group" });
    if (await limited("tm:" + ipHash(ip), 30, 86400000)) return out(429, { error: "slow_down" });
    const rows = [];
    if (prov) rows.push(["province", norm(prov), prov]);
    if (school) { const sk = norm(prov || "") + "|" + norm(school), sn = school + (prov ? " · " + prov : ""); rows.push(["school", sk, sn]); if (cls) rows.push(["class", sk + "|" + norm(cls), cls + " · " + school]); }
    for (const [kind, key, name] of rows) {
      await db.query(
        `insert into temple_groups(week, kind, key, name, merit, plays) values (date_trunc('week', (now() at time zone $1))::date, $2, $3, $4, $5, 1)
         on conflict (week, kind, key) do update set merit = temple_groups.merit + excluded.merit, plays = temple_groups.plays + 1, name = excluded.name`, [TZ, kind, key, name, score]);
    }
    return out(200, { ok: true });
  });
  route("GET", /^\/api\/temple\/board$/, async ({ query }) => {
    const kind = query.get("kind"), by = query.get("by") === "avg" ? "avg" : "total";
    if (!["class", "school", "province"].includes(kind)) return out(400, { error: "bad_input" });
    const limit = Math.min(30, Math.max(3, parseInt(query.get("limit") || "10", 10) || 10));
    const { rows } = await db.query(
      `select name, merit, plays from temple_groups where week = date_trunc('week', (now() at time zone $1))::date and kind = $2
       order by ${by === "avg" ? "merit::float / plays" : "merit"} desc, plays desc limit $3`, [TZ, kind, limit]);
    return out(200, { kind, by, rows: rows.map((r, i) => ({ rank: i + 1, name: r.name, merit: Number(r.merit), plays: r.plays, avg: Math.round(Number(r.merit) / r.plays) })) });
  });
};
