/* Kiểm tra tab "Pass" của trang admin (admin/index.html + server/app.js + migration 007). Chạy:
     NODE_PATH=<thư mục có puppeteer-core> node scripts/cozygame/check-adminpass.js [--quick] [--shots=<thư mục ảnh>]
   AN TOÀN: CHỈ dùng DB DEV (server/.env.development). Từ chối chạy nếu file env không phải development hoặc máy chủ DB trùng với
   server/.env.production (chỉ so tên máy chủ, không kết nối). Dữ liệu thử có tiền tố email "chk-ap-<mã>@check.local", dọn sạch khi xong.
   Tự chạy server/server.js ở cổng trống (ENV_FILE=server/.env.development) rồi đo qua HTTP thật.
   API: tìm/lọc/phân trang; chi tiết; grant/revoke/xoá thiết bị/đổi email đều có log (cùng transaction — thử bằng trigger gây lỗi);
        lý do bắt buộc (>=3 ký tự); sai/thiếu khoá 401 (kể cả khoá trong URL); giới hạn tần suất 429; chưa migrate → xem được, ghi trả migration_required;
        CSV có BOM, chống CSV injection, theo bộ lọc, không đọc khoá từ URL; server không ghi email/khoá ra console.
   UI (puppeteer-core + Chrome): 1440x900, 1194x834, 390x844 sáng+tối: trang không cuộn/tràn ngang, danh sách, ngăn kéo chi tiết nằm gọn màn hình,
        nút Thực hiện chỉ bật khi đủ lý do (thu hồi: phải gõ lại email), cấp thêm ngày qua UI ra log, nút CSV dùng fetch+blob (khoá không nằm trong URL), VI/EN, không lỗi console.
   --quick: UI chỉ 1440x900 sáng + 390x844 tối. Ảnh chụp lưu ở --shots (mặc định thư mục tạm in ra cuối). */
const { spawn } = require("child_process"), fs = require("fs"), os = require("os"), path = require("path"), net = require("net"), crypto = require("crypto");
const root = path.join(__dirname, "..", ".."), fails = [];
const quick = process.argv.includes("--quick");
const shotDir = (process.argv.find(a => a.startsWith("--shots=")) || "").slice(8) || fs.mkdtempSync(path.join(os.tmpdir(), "adminpass-"));
fs.mkdirSync(shotDir, { recursive: true });
const note = (ok, tag, msg) => { if (!ok) { fails.push(tag + ": " + msg); console.log("  ✗ " + tag + ": " + msg); } return !!ok; };
const wait = ms => new Promise(r => setTimeout(r, ms));
const hostOf = u => { try { return new URL(u.replace(/^postgres(ql)?:/, "http:")).hostname.replace(/-pooler/, ""); } catch { return ""; } };
const parseEnv = f => { const v = {}; for (const l of fs.readFileSync(f, "utf8").split("\n")) { const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/); if (m) v[m[1]] = m[2]; } return v; };
const freePort = () => new Promise(r => { const s = net.createServer().listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });

(async () => {
  /* ---------- an toàn: chỉ dev ---------- */
  const devFile = path.join(root, "server", ".env.development"), prodFile = path.join(root, "server", ".env.production");
  if (!fs.existsSync(devFile)) { console.log("  (bỏ qua: không có server/.env.development; bài đo chỉ chạy với DB dev)"); process.exit(0); }
  const dev = parseEnv(devFile), devUrl = dev.DATABASE_URL_UNPOOLED || dev.DATABASE_URL, KEY = "chk-" + crypto.randomBytes(12).toString("hex");   // khoá admin tạm cho server thử (không dùng khoá trong file env)
  if (!devUrl) { console.log("✗ .env.development thiếu DATABASE_URL"); process.exit(1); }
  if (fs.existsSync(prodFile)) { const p = parseEnv(prodFile); for (const k of ["DATABASE_URL", "DATABASE_URL_UNPOOLED"]) if (p[k] && hostOf(p[k]) === hostOf(devUrl)) { console.log("✗ DB dev trùng máy chủ với production: DỪNG"); process.exit(1); } }
  const { Client } = require("pg"), puppeteer = require("puppeteer-core");
  const pg = new Client({ connectionString: devUrl }); await pg.connect();
  const q = (sql, p) => pg.query(sql, p);
  await q("select pg_advisory_lock(7461001)");   // hai lần chạy cùng lúc dùng chung DB dev (trigger, bộ đếm tần suất) sẽ đạp nhau: xếp hàng cho lần trước xong
  await q("drop trigger if exists chk_fail on admin_actions").catch(() => {});

  const RUN = crypto.randomBytes(3).toString("hex"), TAG = "chk-ap-" + RUN, em = n => TAG + "-" + n + "@check.local";
  const made = { users: [], orders: [], txs: [] };
  const rid = n => crypto.randomBytes(n).toString("hex");
  const DAY = 864e5;
  async function mk({ email, passDays, plan = "month", orders = [], devices = 0, verified = false }) {
    const { rows: [u] } = await q("insert into users default values returning id"); made.users.push(u.id);
    if (email) await q("insert into identities(user_id,provider,provider_uid,email,email_verified) values($1,'email',$2,$2,$3)", [u.id, email, verified]);
    if (passDays != null) await q("insert into passes(user_id,exp,plan) values($1,now()+make_interval(secs=>$2),$3)", [u.id, passDays * 86400, plan]);
    for (const o of orders) {
      const id = rid(16), code = "NPCHK" + rid(4).toUpperCase(); made.orders.push(id);
      let txid = null;
      if (o.status === "paid") { txid = "CHK-" + rid(6); made.txs.push(txid); await q("insert into txs(id,amount,content,account,result) values($1,$2,$3,'1','granted')", [txid, o.amount, "CK " + code]); }
      await q("insert into orders(id,code,user_id,email,plan,amount,status,created_at,expires_at,paid_at,exp,tx_id) values($1,$2,$3,$4,$5,$6,$7,now()-make_interval(mins=>$8),now()+interval '10 minutes',$9,$10,$11)",
        [id, code, u.id, o.email || email || "x@check.local", o.plan || plan, o.amount, o.status, o.ageMin || 5, o.status === "paid" ? new Date() : null, o.status === "paid" ? new Date(Date.now() + DAY) : null, txid]);
      if (txid) await q("update txs set order_id = $1 where id = $2", [id, txid]);
      o.code = code;
    }
    const kids = [];
    for (let i = 0; i < devices; i++) { const kid = String.fromCharCode(65 + i) + crypto.randomBytes(31).toString("base64url").slice(0, 42); kids.push(kid);
      await q("insert into pass_devices(user_id,kid,jwk,last_seen) values($1,$2,'{}'::jsonb,now()-make_interval(mins=>$3))", [u.id, kid, i * 10]); }
    return { id: u.id, email, kids, orders };
  }
  async function cleanup() {
    try {
      await q("alter table if exists admin_actions_bak rename to admin_actions").catch(() => {});
      await q("drop trigger if exists chk_fail on admin_actions").catch(() => {}); await q("drop function if exists chk_fail_fn()").catch(() => {});
      if (made.users.length) {
        await q("delete from admin_actions where user_id = any($1::uuid[])", [made.users]).catch(() => {});
        await q("delete from pass_devices where user_id = any($1::uuid[])", [made.users]).catch(() => {});
        await q("update orders set tx_id = null where user_id = any($1::uuid[])", [made.users]);
        await q("delete from txs where id = any($1::text[])", [made.txs]);
        await q("delete from orders where user_id = any($1::uuid[])", [made.users]);
        await q("delete from identities where user_id = any($1::uuid[])", [made.users]);
        await q("delete from passes where user_id = any($1::uuid[])", [made.users]);
        await q("delete from users where id = any($1::uuid[])", [made.users]);
      }
      await q("delete from rate_limits where key like 'admact:%'");
    } catch (e) { console.log("  (dọn dữ liệu thử lỗi: " + String(e.message).slice(0, 100) + ")"); }
  }

  /* ---------- server ---------- */
  const PORT = await freePort(), B = "http://127.0.0.1:" + PORT;
  let srvLog = "";
  const srv = spawn(process.execPath, [path.join(root, "server", "server.js")], { cwd: root, env: Object.assign({}, process.env, { ENV_FILE: devFile, DEV_RELOAD: "0", PORT: String(PORT), SEPAY_API_KEY: "chk-" + crypto.randomBytes(8).toString("hex"), BANK_BIN: "970436", BANK_ACCOUNT: "0", TOKEN_SECRET: dev.TOKEN_SECRET || crypto.randomBytes(32).toString("hex"), ADMIN_KEY: KEY }), stdio: ["ignore", "pipe", "pipe"] });
  srv.stdout.on("data", d => { srvLog += d; }); srv.stderr.on("data", d => { srvLog += d; });
  let up = false; for (let i = 0; i < 60 && !up; i++) { await wait(250); try { up = (await fetch(B + "/api/health")).ok; } catch {} }
  if (!up) { console.log("✗ server không lên được: " + srvLog.slice(0, 300)); srv.kill(); await pg.end(); process.exit(1); }
  let autoClear = true;   // mỗi lời gọi xoá bộ đếm giới hạn tần suất, trừ khi đang đo chính giới hạn đó
  const call = async (method, p, body, key = KEY, extra = {}) => {
    if (autoClear) await q("delete from rate_limits where key like 'admact:%' or key like 'adm:%'");
    const r = await fetch(B + p, { method, headers: Object.assign({ "content-type": "application/json" }, key ? { authorization: "Bearer " + key } : {}), body: body === undefined ? undefined : JSON.stringify(body), ...extra });
    const buf = Buffer.from(await r.arrayBuffer()), bom = buf.length > 2 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF;   // fetch().text() tự bỏ BOM nên đọc byte thô
    const text = (bom ? buf.subarray(3) : buf).toString("utf8"); let json = null; try { json = JSON.parse(text); } catch {}
    return { status: r.status, json, text, bom, headers: r.headers };
  };
  const post = (uid, act, body, key) => call("POST", "/api/admin/passes/" + uid + "/" + act, body, key);
  const pass = async uid => (await q("select exp, plan from passes where user_id = $1", [uid])).rows[0];
  const logs = async uid => (await q("select * from admin_actions where user_id = $1 order by id", [uid])).rows;
  const clearRL = () => q("delete from rate_limits where key like 'admact:%' or key like 'adm:%'");

  try {
    await q("alter table if exists admin_actions_bak rename to admin_actions").catch(() => {});
    const has = (await q("select to_regclass('public.admin_actions') t")).rows[0].t;
    if (!has) { await q(fs.readFileSync(path.join(root, "server", "db", "migrations", "007_admin_actions.sql"), "utf8")); console.log("  (đã áp migration 007 lên DB dev)"); }
    await q("select 1 from pass_devices limit 0").catch(async () => { await q(fs.readFileSync(path.join(root, "server", "db", "migrations", "006_devices.sql"), "utf8")); });

    /* ---------- dữ liệu thử ---------- */
    const A = await mk({ email: em("active"), passDays: 20, plan: "month", devices: 3, orders: [{ status: "paid", amount: 36000, plan: "month", ageMin: 60 }, { status: "paid", amount: 9000, plan: "day", ageMin: 30 }, { status: "pending", amount: 18000, plan: "week", ageMin: 1 }] });
    const X = await mk({ email: em("expiring"), passDays: 1.5, plan: "week", devices: 1, orders: [{ status: "paid", amount: 18000, plan: "week" }] });
    const E = await mk({ email: em("expired"), passDays: -2, plan: "day", orders: [{ status: "paid", amount: 9000, plan: "day" }] });
    const N = await mk({ email: em("nopass"), orders: [] });
    const V = await mk({ email: em("victim"), passDays: 10, plan: "year", devices: 2 });
    const T = await mk({ email: em("taken"), passDays: 4 });
    const INJ = await mk({ email: "=HYPERLINK(\"http://x\")" + TAG + "@check.local", passDays: 5, orders: [{ status: "paid", amount: 9000, plan: "day", email: "+cmd" + RUN + "@check.local" }] });
    const R = await mk({ email: em("rate"), passDays: 5 });
    const ids = [A, X, E, N, V, T, INJ, R].map(x => x.id);

    /* ---------- 401 ---------- */
    console.log("== API: xác thực");
    const eps = [["GET", "/api/admin/passes"], ["GET", "/api/admin/passes/" + A.id], ["GET", "/api/admin/passes/actions"], ["GET", "/api/admin/passes.csv"], ["GET", "/api/admin/orders.csv"],
      ["POST", "/api/admin/passes/" + A.id + "/grant"], ["POST", "/api/admin/passes/" + A.id + "/revoke"], ["POST", "/api/admin/passes/" + A.id + "/devices/delete"], ["POST", "/api/admin/passes/" + A.id + "/email"]];
    for (const [m, p] of eps) {
      const bad = await call(m, p, m === "POST" ? { reason: "kiem tra", days: 1 } : undefined, "sai-khoa-sai-khoa-0000");
      note(bad.status === 401, "401", m + " " + p.replace(A.id, ":id") + " sai khoá phải 401, nhận " + bad.status);
      const none = await call(m, p, m === "POST" ? { reason: "kiem tra", days: 1 } : undefined, "");
      note(none.status === 401, "401", m + " " + p.replace(A.id, ":id") + " thiếu khoá phải 401, nhận " + none.status);
    }
    const inUrl = await call("GET", "/api/admin/passes.csv?key=" + KEY + "&access_token=" + KEY, undefined, "");
    note(inUrl.status === 401, "401", "khoá trong URL không được chấp nhận (CSV)");
    note((await pass(A.id)) != null && (await logs(A.id)).length === 0, "401", "thao tác sai khoá không được làm thay đổi/ghi log");
    await clearRL();

    /* ---------- danh sách + tìm ---------- */
    console.log("== API: danh sách/tìm/lọc");
    const L = async qs => (await call("GET", "/api/admin/passes?" + qs)).json;
    let r = await L("q=" + TAG + "&size=100");
    note(r && r.total === 7 && r.rows.length === 7, "list", "q theo tiền tố email phải ra 7 pass (N chưa có pass), nhận " + (r && r.total));
    const rowA = r.rows.find(x => x.userId === A.id);
    note(rowA && rowA.email === em("active") && rowA.plan === "month" && rowA.devices === 3 && rowA.maxDevices >= 1 && rowA.paidOrders === 2 && rowA.totalPaid === 45000 && rowA.active === true, "list", "cột email/gói/thiết bị/tổng tiền sai: " + JSON.stringify(rowA));
    note(rowA && rowA.lastOrder && rowA.lastOrder.status === "pending" && rowA.lastOrder.code === A.orders[2].code, "list", "đơn gần nhất phải là đơn pending mới nhất");
    r = await L("q=" + TAG + "&status=active&size=100"); note(r.rows.every(x => x.active) && r.rows.some(x => x.userId === A.id) && !r.rows.some(x => x.userId === E.id), "list", "status=active sai");
    r = await L("q=" + TAG + "&status=expired&size=100"); note(r.total === 1 && r.rows[0].userId === E.id, "list", "status=expired phải chỉ có pass hết hạn, nhận " + r.total);
    r = await L("q=" + TAG + "&status=expiring&size=100"); note(r.total === 1 && r.rows[0].userId === X.id, "list", "status=expiring (<=3 ngày) phải chỉ có pass sắp hết hạn, nhận " + r.total);
    r = await L("q=" + A.orders[0].code); note(r.total === 1 && r.rows[0].userId === A.id, "list", "tìm theo mã đơn");
    r = await L("q=" + A.orders[0].code.toLowerCase()); note(r.total === 1, "list", "tìm mã đơn không phân biệt hoa thường");
    r = await L("q=" + em("ACTIVE").toUpperCase()); note(r.total === 1 && r.rows[0].userId === A.id, "list", "tìm email không phân biệt hoa thường");
    r = await L("q=" + encodeURIComponent("%") + TAG.slice(0, 4)); note(r.total === 0, "list", "ký tự % phải được escape (không khớp mọi thứ)");
    r = await L("q=" + encodeURIComponent("'; drop table passes;--")); note(r && r.total === 0, "list", "q có SQL lạ phải trả 0, không lỗi");
    const p1 = await L("q=" + TAG + "&size=3&page=1"), p3 = await L("q=" + TAG + "&size=3&page=3"), p2 = await L("q=" + TAG + "&size=3&page=2");
    note(p1.total === 7 && p1.rows.length === 3 && p2.rows.length === 3 && p3.rows.length === 1 && new Set([...p1.rows, ...p2.rows, ...p3.rows].map(x => x.userId)).size === 7, "list", "phân trang size=3 → 3/3/1 dòng không trùng");
    note((await call("GET", "/api/admin/passes?size=1000&page=-4")).json.size === 100, "list", "size bị chặn 100 như các tab khác");

    /* ---------- chi tiết ---------- */
    console.log("== API: chi tiết");
    let d = (await call("GET", "/api/admin/passes/" + A.id)).json;
    note(d && d.userId === A.id && d.pass && d.pass.plan === "month" && d.pass.active && d.orders.length === 3 && d.txs.length === 2, "detail", "đơn/giao dịch/pass sai: " + JSON.stringify({ p: d && d.pass, o: d && d.orders.length, t: d && d.txs.length }));
    note(d.devices.length === 3 && d.devices.every(x => x.kid.length === 12 && x.firstSeen && x.lastSeen) && d.devicesAvailable && d.actionsAvailable, "detail", "thiết bị phải có kid rút gọn 12 ký tự + first/last seen");
    note(d.identities.some(i => i.email === em("active") && i.provider === "email" && i.verified === false), "detail", "danh tính email thiếu");
    note(!/jwk|"raw"|token/i.test(JSON.stringify(d)), "detail", "không được lộ jwk/raw/token");
    note((await call("GET", "/api/admin/passes/" + "00000000-0000-4000-8000-000000000000")).status === 404, "detail", "user không tồn tại phải 404");
    note((await call("GET", "/api/admin/passes/not-a-uuid")).status === 404, "detail", "id không hợp lệ phải 404");
    d = (await call("GET", "/api/admin/passes/" + N.id)).json; note(d.pass === null && d.orders.length === 0, "detail", "user chưa có pass");

    /* ---------- lý do bắt buộc ---------- */
    console.log("== API: lý do bắt buộc");
    const before = await pass(A.id);
    for (const [act, body] of [["grant", { days: 5 }], ["revoke", { confirmEmail: em("active") }], ["devices/delete", { kid: "all" }], ["email", { newEmail: em("x1") }]]) {
      for (const reason of [undefined, "", "  ab ", 12, null]) {
        const x = await post(A.id, act, Object.assign({}, body, reason === undefined ? {} : { reason }));
        note(x.status === 400 && x.json && x.json.error === "reason_required", "reason", act + " reason=" + JSON.stringify(reason) + " phải 400 reason_required, nhận " + x.status);
      }
      const longR = await post(A.id, act, Object.assign({}, body, { reason: "x".repeat(301) })); note(longR.status === 400, "reason", act + " lý do quá dài phải 400");
    }
    const after0 = await pass(A.id);
    note(+before.exp === +after0.exp && before.plan === after0.plan && (await logs(A.id)).length === 0 && (await q("select count(*)::int n from pass_devices where user_id=$1", [A.id])).rows[0].n === 3, "reason", "thiếu lý do mà dữ liệu/log vẫn thay đổi");
    await clearRL();

    /* ---------- grant ---------- */
    console.log("== API: grant");
    for (const days of [0, 3651, -1, 1.5, "abc", null, undefined]) { const x = await post(A.id, "grant", { days, reason: "thử số ngày xấu" }); note(x.status === 400 && x.json.error === "bad_days", "grant", "days=" + JSON.stringify(days) + " phải 400 bad_days, nhận " + x.status); }
    let g = await post(A.id, "grant", { days: 30, reason: "Bù đền sự cố" });
    let pa = await pass(A.id);
    note(g.status === 200 && g.json.ok && Math.abs(+pa.exp - (+before.exp + 30 * DAY)) < 5000, "grant", "pass còn hạn phải cộng dồn 30 ngày vào hạn cũ");
    note(pa.plan === "month" && g.json.plan === "month", "grant", "pass còn hạn phải GIỮ gói cũ (month), nhận " + pa.plan);
    let lg = await logs(A.id);
    note(lg.length === 1 && lg[0].action === "grant" && lg[0].reason === "Bù đền sự cố" && lg[0].before.plan === "month" && lg[0].after.days === 30 && Math.abs(Date.parse(lg[0].after.exp) - +pa.exp) < 2000 && /^[A-Za-z0-9_-]{10,}$/.test(lg[0].ip_hash || ""), "grant", "log grant thiếu/sai: " + JSON.stringify(lg[0]));
    g = await post(E.id, "grant", { days: 10, reason: "tặng lại khách" }); pa = await pass(E.id);
    note(g.status === 200 && pa.plan === "admin" && Math.abs(+pa.exp - (Date.now() + 10 * DAY)) < 8000, "grant", "pass đã hết hạn: tính từ bây giờ, gói 'admin'");
    g = await post(N.id, "grant", { days: 3650, reason: "tạo pass cho người chưa có" }); pa = await pass(N.id);
    note(g.status === 200 && pa && pa.plan === "admin" && Math.abs(+pa.exp - (Date.now() + 3650 * DAY)) < 8000, "grant", "user chưa có pass: tạo mới (3650 ngày)");
    note((await post("00000000-0000-4000-8000-000000000000", "grant", { days: 1, reason: "không có user" })).status === 404, "grant", "user không tồn tại phải 404");

    /* ---------- atomic: log lỗi → thay đổi phải rollback ---------- */
    console.log("== API: cùng transaction (log lỗi → rollback)");
    await q("create or replace function chk_fail_fn() returns trigger language plpgsql as $$ begin raise exception 'chk_fail'; end $$");
    await q("create trigger chk_fail before insert on admin_actions for each row execute function chk_fail_fn()");
    const pb = await pass(A.id);
    const bad = await post(A.id, "grant", { days: 7, reason: "phải bị rollback" });
    const pb2 = await pass(A.id);
    note(bad.status === 500 && +pb.exp === +pb2.exp, "tx", "ghi log lỗi mà pass vẫn đổi (không cùng transaction)");
    const devBefore = (await q("select count(*)::int n from pass_devices where user_id=$1", [A.id])).rows[0].n;
    const bad2 = await post(A.id, "devices/delete", { kid: "all", reason: "phải bị rollback" });
    note(bad2.status === 500 && (await q("select count(*)::int n from pass_devices where user_id=$1", [A.id])).rows[0].n === devBefore, "tx", "xoá thiết bị không rollback khi log lỗi");
    const bad3 = await post(V.id, "email", { newEmail: em("rollback"), reason: "phải bị rollback" });
    note(bad3.status === 500 && (await q("select email from identities where user_id=$1", [V.id])).rows[0].email === em("victim"), "tx", "đổi email không rollback khi log lỗi");
    const bad4 = await post(V.id, "revoke", { confirmEmail: em("victim"), reason: "phải bị rollback" });
    note(bad4.status === 500 && +(await pass(V.id)).exp > Date.now(), "tx", "thu hồi không rollback khi log lỗi");
    await q("drop trigger chk_fail on admin_actions"); await q("drop function chk_fail_fn()");
    await clearRL();

    /* ---------- revoke ---------- */
    console.log("== API: revoke");
    let x = await post(V.id, "revoke", { reason: "hoàn tiền khách" });
    note(x.status === 400 && x.json.error === "confirm_mismatch", "revoke", "thiếu confirmEmail phải 400 confirm_mismatch");
    x = await post(V.id, "revoke", { reason: "hoàn tiền khách", confirmEmail: em("khac") });
    note(x.status === 400 && x.json.error === "confirm_mismatch" && +(await pass(V.id)).exp > Date.now(), "revoke", "confirmEmail sai phải 400 và không đổi");
    x = await post(V.id, "revoke", { reason: "hoàn tiền khách", confirmEmail: "  " + em("victim").toUpperCase() + " " });
    pa = await pass(V.id);
    note(x.status === 200 && +pa.exp <= Date.now() && Date.now() - +pa.exp < 8000, "revoke", "revoke đúng email (không phân biệt hoa thường) phải đặt exp = now()");
    lg = await logs(V.id); note(lg.length === 1 && lg[0].action === "revoke" && lg[0].reason === "hoàn tiền khách" && Date.parse(lg[0].before.exp) > Date.now() && Date.parse(lg[0].after.exp) <= Date.now(), "revoke", "log revoke sai");
    const stt = await call("GET", "/api/admin/passes?q=" + em("victim")); note(stt.json.rows[0] && stt.json.rows[0].active === false, "revoke", "danh sách phải thấy pass đã hết hạn");
    x = await post(V.id, "revoke", { reason: "lần hai", confirmEmail: em("victim") }); note(x.status === 409 && x.json.error === "already_expired", "revoke", "thu hồi pass đã hết hạn phải 409");
    x = await post(N.id, "revoke", { reason: "x x x", confirmEmail: N.id }); note(x.status === 200, "revoke", "confirm bằng user id được chấp nhận (pass vừa tạo cho N)");
    x = await post(T.id, "revoke", { reason: "x x x", confirmEmail: V.id }); note(x.status === 400, "revoke", "confirm bằng ID của user KHÁC phải bị từ chối");
    await clearRL();

    /* ---------- devices ---------- */
    console.log("== API: xoá thiết bị");
    x = await post(A.id, "devices/delete", { kid: "ab", reason: "thiết bị lạ" }); note(x.status === 400 && x.json.error === "bad_kid", "devices", "kid quá ngắn phải 400");
    x = await post(A.id, "devices/delete", { reason: "thiết bị lạ" }); note(x.status === 400, "devices", "thiếu kid phải 400");
    x = await post(A.id, "devices/delete", { kid: "Zzzzzzzzzz", reason: "thiết bị lạ" }); note(x.status === 404 && x.json.error === "device_not_found", "devices", "không thấy thiết bị phải 404");
    x = await post(A.id, "devices/delete", { kid: V.kids[0].slice(0, 12), reason: "kid của user khác" }); note(x.status === 404, "devices", "kid của user khác không được xoá qua user này");
    x = await post(A.id, "devices/delete", { kid: A.kids[0].slice(0, 12), reason: "máy lạ đăng nhập" });
    let left = (await q("select kid from pass_devices where user_id=$1", [A.id])).rows.map(r => r.kid);
    note(x.status === 200 && x.json.deleted === 1 && x.json.remaining === 2 && !left.includes(A.kids[0]) && left.length === 2, "devices", "xoá 1 thiết bị theo kid rút gọn");
    lg = (await logs(A.id)).filter(l => l.action === "devices_delete"); note(lg.length === 1 && lg[0].after.deleted[0] === A.kids[0].slice(0, 12) && lg[0].after.remaining === 2 && lg[0].before.devices.length === 3, "devices", "log xoá thiết bị sai");
    note(!JSON.stringify(lg).includes(A.kids[0]), "devices", "log không được chứa kid đầy đủ");
    x = await post(A.id, "devices/delete", { kid: "all", reason: "xoá hết để đăng nhập lại" });
    note(x.status === 200 && x.json.deleted === 2 && (await q("select count(*)::int n from pass_devices where user_id=$1", [A.id])).rows[0].n === 0, "devices", "xoá tất cả");
    x = await post(A.id, "devices/delete", { kid: "all", reason: "không còn gì" }); note(x.status === 404, "devices", "xoá khi không còn thiết bị phải 404");
    note((await q("select count(*)::int n from pass_devices where user_id=$1", [V.id])).rows[0].n === 2, "devices", "thiết bị user khác bị đụng tới");
    await clearRL();

    /* ---------- email ---------- */
    console.log("== API: đổi email");
    for (const bad of ["", "abc", "a@b", "a b@c.vn", "x".repeat(250) + "@a.vn"]) { x = await post(T.id, "email", { newEmail: bad, reason: "sửa email" }); note(x.status === 400 && x.json.error === "bad_email", "email", "email xấu " + JSON.stringify(bad.slice(0, 20)) + " phải 400, nhận " + x.status); }
    x = await post(T.id, "email", { newEmail: em("active"), reason: "sửa email" }); note(x.status === 409 && x.json.error === "email_taken", "email", "trùng email user khác phải 409");
    x = await post(T.id, "email", { newEmail: em("ACTIVE").toUpperCase(), reason: "sửa email" }); note(x.status === 409, "email", "trùng khác hoa thường phải 409");
    await q("insert into identities(user_id,provider,provider_uid,email,email_verified) values($1,'google',$2,$3,true)", [E.id, "g-" + RUN, em("googleverified")]);
    x = await post(T.id, "email", { newEmail: em("googleverified"), reason: "sửa email" }); note(x.status === 409, "email", "trùng email ĐÃ XÁC THỰC của identity khác (google) phải 409");
    x = await post(T.id, "email", { newEmail: em("taken"), reason: "sửa email" }); note(x.status === 400 && x.json.error === "same_email", "email", "email mới = email cũ phải 400");
    await q("update identities set email_verified = true where user_id = $1", [T.id]);
    x = await post(T.id, "email", { newEmail: "  " + em("Moi").toUpperCase() + " ", reason: "khách gõ nhầm email" });
    const idr = (await q("select provider_uid, email, email_verified from identities where user_id=$1 and provider='email'", [T.id])).rows;
    note(x.status === 200 && idr.length === 1 && idr[0].email === em("moi") && idr[0].provider_uid === em("moi") && idr[0].email_verified === false, "email", "đổi email: chuẩn hoá chữ thường, email_verified=false: " + JSON.stringify(idr));
    lg = (await logs(T.id)).filter(l => l.action === "email_change"); note(lg.length === 1 && lg[0].before.email === em("taken") && lg[0].after.email === em("moi") && lg[0].after.verified === false, "email", "log đổi email sai");
    r = await L("q=" + em("moi")); note(r.total === 1 && r.rows[0].userId === T.id, "email", "danh sách phải tìm thấy theo email mới");
    r = await L("q=" + em("taken")); note(r.total === 0, "email", "email cũ không còn tìm thấy");
    x = await post(N.id, "email", { newEmail: em("nopass2"), reason: "đổi email" }); note(x.status === 200, "email", "đổi email khi user vẫn có identity");
    const noId = await mk({ passDays: 2 }); x = await post(noId.id, "email", { newEmail: em("fresh"), reason: "gắn email cho pass chưa có email" });
    note(x.status === 200 && (await q("select email_verified from identities where user_id=$1 and email=$2", [noId.id, em("fresh")])).rows[0].email_verified === false, "email", "pass chưa có identity email: tạo mới (chưa xác thực)");
    await clearRL();

    /* ---------- nhật ký ---------- */
    console.log("== API: nhật ký");
    d = (await call("GET", "/api/admin/passes/" + A.id)).json;
    note(d.actions.length >= 3 && d.actions[0].at >= d.actions[d.actions.length - 1].at && d.actions.every(a => a.reason && a.action), "log", "chi tiết phải có nhật ký của đúng người đó, mới nhất trước");
    note(d.actions.every(a => a.userId === A.id), "log", "nhật ký lẫn người khác");
    const rl = (await call("GET", "/api/admin/passes/actions?size=5")).json;
    note(rl.available === true && rl.total >= 8 && rl.rows.length === 5 && rl.rows[0].at >= rl.rows[4].at && "email" in rl.rows[0], "log", "danh sách nhật ký gần đây sai: " + JSON.stringify(rl).slice(0, 150));

    /* ---------- rate limit ---------- */
    console.log("== API: giới hạn tần suất");
    await clearRL(); autoClear = false; let codes = [];
    for (let i = 0; i < 10; i++) codes.push((await post(R.id, "grant", { days: 1, reason: "thử giới hạn " + i })).status);
    note(codes.slice(0, 8).every(c => c === 200) && codes.slice(8).every(c => c === 429), "rate", "8 thao tác đầu OK, từ thứ 9 phải 429: " + codes.join(","));
    note((await logs(R.id)).length === 8, "rate", "thao tác bị 429 không được ghi log/đổi dữ liệu");
    await clearRL(); autoClear = true;

    /* ---------- CSV ---------- */
    console.log("== API: CSV");
    const c1 = await call("GET", "/api/admin/passes.csv?q=" + TAG + "&status=all");
    note(c1.status === 200 && /^text\/csv/.test(c1.headers.get("content-type")) && c1.bom, "csv", "passes.csv phải text/csv + BOM UTF-8");
    const lines = c1.text.trim().split("\r\n");
    note(lines[0].replace(/"/g, "").startsWith("email,user_id,plan,exp,active,devices,max_devices") && lines.length >= 1 + 8, "csv", "passes.csv số dòng/tiêu đề sai: " + lines.length);
    note(c1.text.includes("\"'=HYPERLINK(") && !/(^|,|\r\n)"?=HYPERLINK/.test(c1.text), "csv", "ô bắt đầu bằng = phải có dấu nháy (injection)");
    const c1e = await call("GET", "/api/admin/passes.csv?q=" + em("victim") + "&status=expired"); note(c1e.text.trim().split("\r\n").length === 2 && c1e.text.includes(em("victim")), "csv", "CSV phải theo bộ lọc status=expired + q");
    const c1a = await call("GET", "/api/admin/passes.csv?q=" + em("victim") + "&status=active"); note(c1a.text.trim().split("\r\n").length === 1, "csv", "CSV status=active không được chứa pass đã thu hồi");
    const c2 = await call("GET", "/api/admin/orders.csv?q=" + RUN);
    note(c2.status === 200 && c2.bom && c2.text.includes("\"'+cmd" + RUN) && !c2.text.includes(",+cmd") && !c2.text.includes("\"+cmd"), "csv", "orders.csv: BOM + chống injection cho email bắt đầu bằng +");
    const c2s = await call("GET", "/api/admin/orders.csv?status=paid&q=" + A.orders[0].code); note(c2s.text.trim().split("\r\n").length === 2 && c2s.text.includes(A.orders[0].code), "csv", "orders.csv theo bộ lọc q+status");
    note(c2.text.split("\r\n")[0].replace(/"/g, "") === "created_at,code,email,plan,amount_vnd,status,expires_at,paid_at", "csv", "tiêu đề orders.csv");
    for (const f of ["=", "+", "-", "@"]) { const o = await mk({ email: f + "inj" + RUN + "@check.local", passDays: 3 }); }
    const c3 = await call("GET", "/api/admin/passes.csv?q=inj" + RUN);
    note(["'=inj", "'+inj", "'-inj", "'@inj"].every(s => c3.text.includes('"' + s + RUN)), "csv", "đủ 4 ký tự = + - @ đều phải thêm dấu nháy: " + c3.text.slice(0, 300));

    /* ---------- chưa migrate ---------- */
    console.log("== API: chưa chạy migration 007");
    await q("alter table admin_actions rename to admin_actions_bak");
    const pm = await pass(A.id);
    d = await call("GET", "/api/admin/passes/" + A.id); note(d.status === 200 && d.json.actionsAvailable === false && d.json.actions.length === 0 && d.json.orders.length === 3, "nomig", "chi tiết phải chạy được khi chưa có bảng log");
    const ra = await call("GET", "/api/admin/passes/actions"); note(ra.status === 200 && ra.json.available === false && ra.json.rows.length === 0, "nomig", "danh sách log phải available:false");
    note((await call("GET", "/api/admin/passes?q=" + TAG)).status === 200, "nomig", "danh sách pass phải chạy khi chưa có bảng log");
    for (const [act, body] of [["grant", { days: 5 }], ["revoke", { confirmEmail: em("active") }], ["devices/delete", { kid: "all" }], ["email", { newEmail: em("zzz") }]]) {
      x = await post(A.id, act, Object.assign({ reason: "chưa migrate" }, body)); note(x.status === 503 && x.json.error === "migration_required", "nomig", act + " phải 503 migration_required, nhận " + x.status);
    }
    note(+(await pass(A.id)).exp === +pm.exp, "nomig", "chưa migrate mà pass vẫn đổi");
    await q("alter table admin_actions_bak rename to admin_actions");
    // chưa có pass_devices (006): xem vẫn chạy
    await q("alter table pass_devices rename to pass_devices_bak");
    d = await call("GET", "/api/admin/passes/" + A.id); note(d.status === 200 && d.json.devicesAvailable === false, "nomig", "chi tiết phải chạy khi chưa có bảng thiết bị");
    r = (await call("GET", "/api/admin/passes?q=" + TAG)); note(r.status === 200 && r.json.rows.every(y => y.devices === null), "nomig", "danh sách phải chạy khi chưa có bảng thiết bị (devices=null)");
    await q("alter table pass_devices_bak rename to pass_devices");

    /* ---------- không lộ email/khoá ra console ---------- */
    console.log("== server không ghi email/khoá ra console");
    note(!srvLog.includes(TAG) && !srvLog.includes(KEY), "log", "log server chứa email thử hoặc khoá admin");

    /* ---------- UI ---------- */
    console.log("== UI");
    await clearRL();
    const SIZES = quick ? [[1440, 900, "light"], [390, 844, "dark"]] : [[1440, 900, "light"], [1440, 900, "dark"], [1194, 834, "light"], [1194, 834, "dark"], [390, 844, "light"], [390, 844, "dark"]];
    const br = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--mute-audio"] });
    let n = 0;
    for (const [w, h, theme] of SIZES) {
      for (const lang of (w === 1440 && theme === "light") || (w === 390 && theme === "dark") ? ["vi", "en"] : ["vi"]) {
        const tag = w + "x" + h + "/" + theme + "/" + lang, file = w + "x" + h + "-" + theme + "-" + lang;
        const pg2 = await br.newPage(); await pg2.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 900 });
        const errs = [], urls = [];
        pg2.on("pageerror", e => errs.push(String(e.message).slice(0, 120))); pg2.on("console", m => { if (m.type() === "error") errs.push(m.text().slice(0, 120)); });
        pg2.on("request", rq => urls.push(rq.url()));
        await pg2.evaluateOnNewDocument((k, th, lg) => { try { sessionStorage.setItem("adm_key", k); localStorage.setItem("theme", th); localStorage.setItem("lang", lg); } catch (e) {} }, KEY, theme, lang);
        await pg2.goto(B + "/admin/index.html#passes", { waitUntil: "load" });
        await pg2.waitForSelector("#v-passes:not([hidden])", { timeout: 8000 }).catch(() => {});
        const noScroll = async what => { const m = await pg2.evaluate(() => ({ sh: document.documentElement.scrollHeight, ih: innerHeight, sw: document.documentElement.scrollWidth, iw: innerWidth, bh: document.body.scrollHeight })); note(m.sh <= m.ih + 1 && m.bh <= m.ih + 1 && m.sw <= m.iw + 1, tag, what + " tràn khung/cuộn trang: " + JSON.stringify(m)); };
        /* lọc chỉ pass thử */
        await pg2.type("#pQ", TAG); await pg2.waitForFunction(tg => document.querySelectorAll("#pTbl [data-open]").length >= 3 && document.querySelector("#pTbl").innerText.includes(tg), { timeout: 8000 }, TAG).catch(() => {}); await wait(200);
        const rows = await pg2.evaluate(() => document.querySelectorAll("#pTbl [data-open]").length);
        note(rows >= 3, tag, "danh sách pass phải hiện >= 3 dòng, nhận " + rows);
        const txt = await pg2.evaluate(() => document.querySelector("#pTbl").innerText);
        note(txt.includes("check.local") || txt.includes("chk-ap"), tag, "danh sách không hiện email thử");
        await noScroll("tab Pass");
        const tabw = await pg2.evaluate(() => { const n = document.querySelector("nav.tabs").getBoundingClientRect(); return { r: Math.round(n.right), l: Math.round(n.left), iw: innerWidth, tabs: [...document.querySelectorAll(".tab")].map(t => t.scrollWidth <= t.clientWidth + 1) }; });
        note(tabw.r <= tabw.iw && tabw.l >= 0 && tabw.tabs.every(Boolean), tag, "thanh tab bị cắt/tràn: " + JSON.stringify(tabw));
        await pg2.screenshot({ path: path.join(shotDir, file + "-1-list.png") });
        /* mở ngăn kéo qua pass A (còn pass) */
        await pg2.$eval("#pQ", el => { el.value = ""; }); await pg2.type("#pQ", em("active")); await pg2.waitForFunction(e => document.querySelectorAll("#pTbl [data-open]").length >= 1 && document.querySelector("#pTbl").innerText.includes(e), { timeout: 8000 }, em("active")).catch(() => {}); await wait(200);
        await pg2.click("#pTbl [data-open]"); await pg2.waitForSelector("#actForm", { timeout: 8000 });
        const dm = await pg2.evaluate(() => { const r = document.querySelector("#drawer").getBoundingClientRect(), b = document.querySelector("#dBody"); return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), iw: innerWidth, ih: innerHeight, sw: b.scrollWidth, cw: b.clientWidth, scrolls: b.scrollHeight > b.clientHeight, title: document.querySelector("#dTitle").textContent }; });
        note(dm.l >= 0 && dm.r <= dm.iw && dm.t >= 0 && dm.b <= dm.ih && dm.sw <= dm.cw + 1, tag, "ngăn kéo tràn khung: " + JSON.stringify(dm));
        note(dm.title === em("active"), tag, "tiêu đề ngăn kéo phải là email, nhận " + dm.title);
        await noScroll("trang khi mở ngăn kéo");
        await pg2.screenshot({ path: path.join(shotDir, file + "-2-drawer.png") });
        /* cuộn trong ngăn kéo xuống cuối để chụp phần đơn/nhật ký */
        await pg2.evaluate(() => { const b = document.querySelector("#dBody"); b.scrollTop = b.scrollHeight; });
        await pg2.screenshot({ path: path.join(shotDir, file + "-3-drawer-bottom.png") });
        await pg2.evaluate(() => { document.querySelector("#dBody").scrollTop = 0; });
        /* nút chỉ bật khi đủ điều kiện */
        const goDis = () => pg2.$eval("#actGo", b => b.disabled);
        note(await goDis(), tag, "nút Thực hiện phải tắt khi chưa nhập lý do");
        await pg2.click('#actType [data-a="revoke"]'); await pg2.type("#fReason", "khách yêu cầu hoàn tiền");
        note(await goDis(), tag, "thu hồi: phải tắt khi chưa gõ lại email");
        await pg2.type("#fConfirm", em("sai")); note(await goDis(), tag, "thu hồi: email sai vẫn phải tắt");
        await pg2.$eval("#fConfirm", el => { el.value = ""; }); await pg2.type("#fConfirm", em("active")); note(!(await goDis()), tag, "thu hồi: gõ đúng email + lý do thì phải bật");
        await pg2.screenshot({ path: path.join(shotDir, file + "-4-revoke.png") });
        /* KHÔNG bấm thu hồi thật ở pass A; thử grant qua UI (một cấu hình để tiết kiệm giới hạn tần suất) */
        if (n === 0) {
          await pg2.click('#actType [data-a="grant"]'); await pg2.$eval("#fDays", el => { el.value = ""; }); await pg2.type("#fDays", "0"); note(await goDis(), tag, "grant: 0 ngày phải tắt");
          await pg2.$eval("#fDays", el => { el.value = ""; }); await pg2.type("#fDays", "2");
          await pg2.$eval("#fReason", el => { el.value = ""; }); await pg2.type("#fReason", "thử qua giao diện");
          const pBefore = +(await pass(A.id)).exp; note(!(await goDis()), tag, "grant: đủ dữ liệu phải bật");
          await pg2.click("#actGo"); await pg2.waitForFunction(() => document.querySelector("#actMsg").classList.contains("ok"), { timeout: 8000 }).catch(() => {});
          const pAfter = +(await pass(A.id)).exp, ui = await pg2.evaluate(() => document.querySelector("#actMsg").textContent + "|" + document.querySelector("#dBody").innerText);
          note(Math.abs(pAfter - pBefore - 2 * DAY) < 5000, tag, "grant qua UI phải cộng 2 ngày");
          note(ui.includes("thử qua giao diện") || ui.includes("thử qua giao diện".toLowerCase()), tag, "nhật ký trong ngăn kéo phải hiện lý do vừa nhập");
          await pg2.screenshot({ path: path.join(shotDir, file + "-5-after-grant.png") });
        }
        /* đóng bằng Esc, mở lại tab nhật ký */
        await pg2.keyboard.press("Escape"); await wait(100);
        note(await pg2.$eval("#drawer", d2 => d2.hidden), tag, "Esc phải đóng ngăn kéo");
        await pg2.click('#pMode [data-m="log"]'); await wait(900); await pg2.waitForNetworkIdle({ idleTime: 300, timeout: 5000 }).catch(() => {});
        const lt = await pg2.evaluate(() => document.querySelector("#lTbl").innerText);
        note(/Cấp thêm ngày|Add days|Thu hồi|Revoke/.test(lt), tag, "tab Nhật ký phải liệt kê thao tác");
        await noScroll("nhật ký");
        await pg2.screenshot({ path: path.join(shotDir, file + "-6-log.png") });
        /* CSV qua fetch + blob */
        await pg2.click('#pMode [data-m="list"]'); await wait(500);
        await pg2.evaluate(() => { window.__dl = null; const o = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function () { if (this.download) { const a = this; fetch(a.href).then(r => r.arrayBuffer()).then(b => { const u = new Uint8Array(b); window.__dl = { name: a.download, bom: u[0] === 0xEF && u[1] === 0xBB && u[2] === 0xBF, size: u.length, href: a.href }; }); } else o.call(this); }; });
        const before = urls.length;
        await pg2.click('[data-csv="passes"]'); await pg2.waitForFunction(() => window.__dl, { timeout: 8000 }).catch(() => {});
        const dl = await pg2.evaluate(() => window.__dl);
        note(dl && /^night-play-passes-\d{4}-\d\d-\d\d\.csv$/.test(dl.name) && dl.bom && dl.size > 50 && dl.href.startsWith("blob:"), tag, "nút CSV phải tải blob có BOM: " + JSON.stringify(dl && { name: dl.name, href: dl.href.slice(0, 12) }));
        note(!urls.some(u => u.includes(KEY)) && urls.slice(before).some(u => u.includes("/api/admin/passes.csv")), tag, "khoá không được nằm trong URL / phải gọi passes.csv");
        if (w >= 1000 && lang === "vi") {
          await pg2.evaluate(() => document.querySelector('[data-tab="orders"]').click()); await wait(700);
          await pg2.evaluate(() => { window.__dl = null; });
          await pg2.click('[data-csv="orders"]'); await pg2.waitForFunction(() => window.__dl, { timeout: 8000 }).catch(() => {});
          const d2 = await pg2.evaluate(() => window.__dl); note(d2 && d2.name.startsWith("night-play-orders-") && d2.bom, tag, "CSV đơn hàng qua UI");
          await noScroll("tab Đơn hàng"); await pg2.screenshot({ path: path.join(shotDir, file + "-7-orders.png") });
        }
        note(errs.length === 0, tag, "lỗi console: " + errs.join(" | "));
        await pg2.close(); n++;
      }
    }
    await br.close();
    console.log("  ảnh chụp: " + shotDir);
  } catch (e) {
    note(false, "bài đo", "ngoại lệ: " + String(e && e.stack || e).replace(/npg_\w+/g, "<ẩn>").slice(0, 600));
  } finally {
    await cleanup(); srv.kill(); await pg.end().catch(() => {});
  }
  console.log("\n" + (fails.length ? "✗ " + fails.length + " lỗi" : "✓ check-adminpass đạt"));
  process.exit(fails.length ? 1 : 0);
})();
