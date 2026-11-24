"use strict";
/* MÃ SỰ KIỆN 6 SỐ — admin tích giao diện của từng game + ngày bắt đầu/kết thúc; người chơi nhập mã để dùng các giao diện đó trong khoảng thời gian đó.
   KHÔNG phải Night Pass: chỉ mở đúng các giao diện được tích, KHÔNG mở chế độ trả phí, không tạo tài khoản.
   Giao hàng: GET /api/pro/<game>.js?event=<token> trả mã Night Pass của game đã bị LỌC (xem filterSource) chỉ còn các giao diện được phép.
   Bảo vệ: giới hạn số lần thử theo IP/thiết bị (mã 6 số chỉ có 1 triệu khả năng), mã có hạn + tối đa X lượt, mỗi thiết bị một lượt/mã, thu hồi được.
   Chỉ game trong server/event-catalog.js (đã qua scripts/check-eventcode.js) mới được tích. Cần migration 008. */
const CATALOG = require("./event-catalog").concat(require("./event-catalog-pop.json"));   // Night Play (Cozy) + Pop Play; Pop: khoá giao diện = "loại:giao diện"
const MODS = {   // require LITERAL (bundler không gộp được require động)
  "bao-nhieu-giay": () => require("./pro/bao-nhieu-giay"),
  "cat-banh-chung": () => require("./pro/cat-banh-chung"),
  "duong-ray": () => require("./pro/duong-ray"),
  "mat-tinh-khong": () => require("./pro/mat-tinh-khong"),
  "ghep-ba-the": () => require("./pro/ghep-ba-the"),
  "ne-o-ga": () => require("./pro/ne-o-ga"),
  "noi-mot-net": () => require("./pro/noi-mot-net"),
  "shipper-sieu-toc": () => require("./pro/shipper-sieu-toc"),
  "song-sot-cuoi-thang": () => require("./pro/song-sot-cuoi-thang"),
  "ve-mot-net": () => require("./pro/ve-mot-net"),
  "xay-cau-tre": () => require("./pro/xay-cau-tre"),
  "be-dau-bo-me": () => require("./pro/be-dau-bo-me"),
  "be-noi-dung-khong": () => require("./pro/be-noi-dung-khong"),
  "bo-me-5-giay": () => require("./pro/bo-me-5-giay"),
  "con-vat-an-so": () => require("./pro/con-vat-an-so"),
  "doan-tuoi-nao": () => require("./pro/doan-tuoi-nao"),
  "lang-cua-be": () => require("./pro/lang-cua-be"),
  "nhay-theo-so": () => require("./pro/nhay-theo-so"),
  "pop-fly": () => require("./pro/pop-fly"),
  "qua-song": () => require("./pro/qua-song"),
  "ten-lua-cua-be": () => require("./pro/ten-lua-cua-be"),
  "thap-vong-mau": () => require("./pro/thap-vong-mau"),
  "ve-chu-quai-vat": () => require("./pro/ve-chu-quai-vat"),
};
const JS = "application/javascript; charset=utf-8";
const SKINS = Object.fromEntries(CATALOG.map(g => [g.id, new Set(g.skins.map(s => s.id))]));

/* Mã Night Pass của game, bị lọc: chạy xong chỉ giữ PF.skins ∈ keep (+ basic); MỌI thuộc tính khác của PF (chế độ, loại chơi, cờ pro…) trả về đúng như trước khi chạy. */
function filterSource(id, keep) {
  const src = MODS[id]().source({ trial: false }), nested = !!(CATALOG.find(g => g.id === id) || {}).nested;
  const clean = nested
    ? "try{var N=PF.skins;for(var t in N){var o=N[t];if(!o||typeof o!=='object')continue;for(var s in o){if(s!=='basic'&&s!=='default'&&__k.indexOf(t+':'+s)<0)delete o[s]}}}catch(e){}"
    : "try{var N=PF.skins;for(var s in N){if(s!=='basic'&&__k.indexOf(s)<0)delete N[s]}}catch(e){}";
  return "(function(){var __k=" + JSON.stringify(keep) + ";var __o={};for(var a in PF)__o[a]=PF[a];\n" + src + "\n;" + clean +
    "for(var b in PF){if(b==='skins')continue;if(!(b in __o))delete PF[b];else if(PF[b]!==__o[b])PF[b]=__o[b]}})();";
}

module.exports = function install(d) {
  const { route, out, limited, hmac, safeEq, ipHash, adminGuard, noTable, b64u, db } = d;
  const mig = { error: "migration_required" };
  const vnDate = ms => new Date(ms).toISOString();

  const mkToken = (codeId, endMs) => { const body = b64u(JSON.stringify({ c: codeId, x: endMs })); return "e." + body + "." + hmac("evt|" + body); };
  const readToken = tok => {
    const m = /^e\.([A-Za-z0-9_-]{8,200})\.([A-Za-z0-9_-]{43})$/.exec(String(tok || "")); if (!m || !safeEq(m[2], hmac("evt|" + m[1]))) return null;
    try { const o = JSON.parse(Buffer.from(m[1], "base64url").toString()); return Number.isInteger(o.c) && Number.isFinite(o.x) ? o : null; } catch { return null; }
  };
  const cleanSkins = v => {   // {game:[skin]} chỉ giữ những cặp có trong danh mục; rỗng → null
    if (!v || typeof v !== "object" || Array.isArray(v)) return null;
    const o = {}; for (const g of Object.keys(v)) { if (!SKINS[g] || !Array.isArray(v[g])) continue; const l = [...new Set(v[g].filter(s => SKINS[g].has(s)))]; if (l.length) o[g] = l; }
    return Object.keys(o).length ? o : null;
  };
  const status = (r, now) => r.revoked ? "revoked" : now < +new Date(r.starts_at) ? "upcoming" : now > +new Date(r.ends_at) ? "ended" : r.uses >= r.max_uses ? "full" : "active";

  /* ===== NGƯỜI CHƠI: nhập mã ===== */
  route("POST", /^\/api\/events\/redeem$/, async ({ body, ip }) => {
    const code = String(body.code || "").replace(/\s/g, ""), did = String(body.did || "");
    if (!/^[0-9]{6}$/.test(code) || !/^[A-Za-z0-9_-]{16,64}$/.test(did)) return out(400, { error: "bad_code" });
    if ((await limited("evr:" + ipHash(ip), 20, 600000)) || (await limited("evd:" + hmac("d|" + did).slice(0, 12), 10, 600000))) return out(429, { error: "rate_limited" });
    try {
      const r = await db.tx(async c => {
        const { rows: [e] } = await c.query("select * from event_codes where code = $1 for update", [code]);
        if (!e || e.revoked) return { err: "not_found" };   // mã sai và mã đã thu hồi trả cùng một lỗi (không lộ mã nào tồn tại)
        const now = Date.now();
        if (now < +new Date(e.starts_at)) return { err: "not_started", at: vnDate(e.starts_at) };
        if (now > +new Date(e.ends_at)) return { err: "expired" };
        const did2 = hmac("did|" + did).slice(0, 24);
        const { rowCount: had } = await c.query("select 1 from event_redemptions where code_id = $1 and did = $2", [e.id, did2]);
        if (!had) {
          if (e.uses >= e.max_uses) return { err: "full" };
          await c.query("insert into event_redemptions(code_id, did) values ($1, $2)", [e.id, did2]);
          await c.query("update event_codes set uses = uses + 1 where id = $1", [e.id]);
        }
        return { e };
      });
      if (r.err) return out(r.err === "not_found" ? 404 : 400, { error: r.err, at: r.at });
      const e = r.e, endMs = +new Date(e.ends_at);
      return out(200, { ok: true, token: mkToken(+e.id, endMs), name: e.name, skins: e.skins, starts: vnDate(e.starts_at), ends: vnDate(e.ends_at) });
    } catch (err) { if (noTable(err)) return out(503, mig); throw err; }
  });

  /* ===== GIAO HÀNG: /api/pro/<game>.js?event=<token> (gọi trước bộ định tuyến chung) ===== */
  async function serve(id, toks) {   // toks: tối đa 5 token cách nhau dấu phẩy → gộp các giao diện của mọi mã còn hiệu lực
    if (!MODS[id]) return out(404, { error: "not_found" });
    const ts = String(toks || "").split(",").slice(0, 5).map(readToken).filter(t => t && Date.now() <= t.x); if (!ts.length) return out(401, { error: "event_invalid" });
    try {
      const { rows } = await db.query("select skins, starts_at, ends_at, revoked from event_codes where id = any($1::bigint[])", [ts.map(t => t.c)]);
      const keep = new Set(), now = Date.now();
      for (const e of rows) { if (e.revoked || now < +new Date(e.starts_at) || now > +new Date(e.ends_at)) continue; for (const s of (cleanSkins(e.skins) || {})[id] || []) keep.add(s); }
      if (!keep.size) return out(401, { error: "event_invalid" });
      return out(200, filterSource(id, [...keep]), JS);
    } catch (err) { if (noTable(err)) return out(503, mig); throw err; }
  }

  /* ===== ADMIN ===== */
  route("GET", /^\/api\/admin\/events$/, async ({ headers, ip }) => {
    const denied = await adminGuard(headers, ip); if (denied) return denied;
    try {
      const { rows } = await db.query("select id, code, name, skins, starts_at, ends_at, max_uses, uses, revoked, created_at from event_codes order by created_at desc limit 200");
      const now = Date.now();
      return out(200, { catalog: CATALOG, now, codes: rows.map(r => ({ id: +r.id, code: r.code, name: r.name, skins: r.skins, starts: vnDate(r.starts_at), ends: vnDate(r.ends_at), max: r.max_uses, uses: r.uses, revoked: r.revoked, status: status(r, now) })) });
    } catch (err) { if (noTable(err)) return out(200, { catalog: CATALOG, now: Date.now(), codes: [], migration: true }); throw err; }
  });
  route("POST", /^\/api\/admin\/events$/, async ({ body, headers, ip }) => {
    const denied = await adminGuard(headers, ip); if (denied) return denied;
    if (await limited("evnew:" + ip, 30, 3600000)) return out(429, { error: "rate_limited" });
    const name = String(body.name || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 80), skins = cleanSkins(body.skins);
    const s = Date.parse(body.starts), e = Date.parse(body.ends), max = Number.isInteger(body.max) ? body.max : 100;
    if (!name) return out(400, { error: "name_required" });
    if (!skins) return out(400, { error: "skins_required" });
    if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return out(400, { error: "bad_dates" });
    if (e - s > 400 * 86400000) return out(400, { error: "too_long" });
    if (max < 1 || max > 1000000) return out(400, { error: "bad_max" });
    let code = String(body.code || "").replace(/\s/g, "");
    if (code && !/^[0-9]{6}$/.test(code)) return out(400, { error: "bad_code" });
    try {
      for (let i = 0; i < 12; i++) {
        const c = code || String(require("crypto").randomInt(0, 1000000)).padStart(6, "0");
        try {
          const { rows: [r] } = await db.query("insert into event_codes(code, name, skins, starts_at, ends_at, max_uses) values ($1, $2, $3::jsonb, $4, $5, $6) returning id, code", [c, name, JSON.stringify(skins), new Date(s), new Date(e), max]);
          return out(200, { ok: true, id: +r.id, code: r.code });
        } catch (err) { if (err && err.code === "23505") { if (code) return out(409, { error: "code_taken" }); continue; } throw err; }
      }
      return out(503, { error: "code_generation_failed" });
    } catch (err) { if (noTable(err)) return out(503, mig); throw err; }
  });
  route("POST", /^\/api\/admin\/events\/(\d{1,15})\/revoke$/, async ({ m, body, headers, ip }) => {
    const denied = await adminGuard(headers, ip); if (denied) return denied;
    try {
      const { rowCount } = await db.query("update event_codes set revoked = $2 where id = $1", [m[1], body.revoked !== false]);
      return rowCount ? out(200, { ok: true }) : out(404, { error: "not_found" });
    } catch (err) { if (noTable(err)) return out(503, mig); throw err; }
  });

  return { serve, filterSource, cleanSkins, mkToken, readToken, MODS, SKINS };
};
