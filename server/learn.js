"use strict";
/* HỌC VUI PLUS (G1 nền bán hàng + G2 AI luyện cùng, bản đầu). Tách khỏi Night Pass của game: gói riêng (learn_passes), token riêng (a:"learn").
   TẮT mặc định: mọi đường /api/learn/* và đơn product=learn chỉ chạy khi biến môi trường LEARN_PLUS=on; tắt thì trả 404 {error:"learn_off"}.
   AI: KHOÁ API chỉ đọc từ biến môi trường LEARN_AI_KEY (Secret của Worker), không bao giờ xuống trình duyệt. Không có khoá (hoặc LEARN_AI_MOCK=on) → dùng bộ MÔ PHỎNG cục bộ, không gọi dịch vụ ngoài.
   Thiết kế đầy đủ: docs/LEARN-FREE-VS-PLUS.md, docs/LEARN-COACH-DESIGN.md. Cần migration 009_learn_plus.sql. */
const crypto = require("crypto");
const SAFE = require("../learn/content/safe-words.js");

const FEATURES = ["coach", "explain", "exam6", "report"];     // multi/sync: sau (G5)
/* Giá/gói MẶC ĐỊNH CHỜ CHỦ SITE XÁC NHẬN (docs/LEARN-NIGHTPASS-PLAN.md mục 8): tháng 99.000đ, quý 249.000đ, năm 790.000đ; không bán gói ngày/tuần. */
const PLANS_LEARN = {
  learn_month:   { amount: 99000,  days: 30 },
  learn_quarter: { amount: 249000, days: 90 },
  learn_year:    { amount: 790000, days: 365 }
};
const TRIAL_DAYS = 7;
const TAGS = ["off_by_one", "wrong_op", "place_value", "unit_convert", "formula_confuse", "order_ops", "read_chart", "concept_confuse", "pattern_miss", "forget_carry", "tens_error", "table_confuse", "carry_error", "add_denominator", "decimal_point", "percent_misread", "spelling", "tone", "meaning", "word", "grammar", "reading", "other"];
const EMOTIONS = ["idle", "happy", "cheer", "sad", "sleepy", "think", "wow"];
const COACH_EVENTS = ["hint", "comfort", "wrong", "praiseEffort"];
const MAX_TEXT = 40, MAX_STEP = 90;

/* ---- bộ mô phỏng (không gọi mạng): lời gợi ý/giải thích chung theo môn + mã lỗi; KHÔNG biết đáp án nên không thể lộ ---- */
const MOCK_HINT = {
  vi: {
    toan: ["Mình đọc kỹ đề: bài hỏi gì nhỉ?", "Gạch chân các số trong đề nhé.", "Thử đếm hoặc vẽ từng bước xem."],
    tviet: ["Mình đọc to câu này một lần nhé.", "Chú ý từng chữ cái và dấu thanh.", "Thử đọc từng tiếng một thật chậm."],
    tanh: ["Mình đọc câu này thật chậm nhé.", "Nghĩ xem từ nào bé đã biết rồi.", "Thử đoán nghĩa từ hình và ngữ cảnh."]
  },
  en: {
    toan: ["Let's read it again: what is it asking?", "Underline the numbers in the question.", "Try counting or drawing it step by step."],
    tviet: ["Let's read this aloud once.", "Look at each letter and tone mark.", "Read it one syllable at a time, slowly."],
    tanh: ["Let's read the sentence slowly.", "Which words do you already know?", "Guess the meaning from the picture."]
  }
};
const MOCK_ERR = {
  vi: { off_by_one: "Hình như lệch một đơn vị, đếm lại nhé.", wrong_op: "Thử xem bài cần cộng, trừ, nhân hay chia?", place_value: "Nhìn lại hàng chục và hàng đơn vị nhé.", unit_convert: "Đơn vị có khớp nhau chưa nhỉ?", formula_confuse: "Công thức này dùng cho hình nào nhỉ?", order_ops: "Phép nào làm trước nhỉ? Nhân chia trước nhé.", read_chart: "Nhìn kỹ số liệu trong bảng nhé.", concept_confuse: "Hai ý này hơi giống nhau, so sánh lại nhé.", pattern_miss: "Tìm xem các số tăng hay giảm đều nhé.", forget_carry: "Có nhớ sang hàng bên cạnh không nhỉ?", tens_error: "Kiểm tra lại hàng chục nhé.", table_confuse: "Thử đếm nhảy cách đều xem.", carry_error: "Phần nhớ nhớ cộng đúng chưa nhỉ?", add_denominator: "Mẫu số giữ nguyên, chỉ cộng tử số nhé.", decimal_point: "Dấu phẩy đặt đúng chỗ chưa nhỉ?", percent_misread: "Phần trăm là trên một trăm phần nhé.", spelling: "Đọc từng chữ cái xem có thiếu không.", tone: "Nghe kỹ dấu thanh của tiếng này nhé.", meaning: "Nghĩ xem từ này dùng trong câu thế nào.", word: "Xem lại từ này trong câu nhé.", grammar: "Đọc lại cả câu xem có xuôi tai không.", reading: "Đọc lại đoạn văn, tìm ý bé cần nhé.", other: "Không sao, mình nghĩ lại từng bước nhé." },
  en: { off_by_one: "Looks one off. Count again.", wrong_op: "Add, subtract, multiply or divide?", place_value: "Check the tens and ones again.", unit_convert: "Do the units match?", formula_confuse: "Which shape is this formula for?", order_ops: "Which comes first? Multiply first.", read_chart: "Look closely at the table.", concept_confuse: "These two look alike, compare them.", pattern_miss: "Do the numbers grow or shrink evenly?", forget_carry: "Did we carry to the next place?", tens_error: "Check the tens again.", table_confuse: "Try skip counting evenly.", carry_error: "Did we add the carry right?", add_denominator: "Keep the bottom, add the tops.", decimal_point: "Is the point in the right place?", percent_misread: "Percent means out of one hundred.", spelling: "Read each letter, any missing?", tone: "Listen to the tone of this syllable.", meaning: "Think how the word is used here.", word: "Check this word in the sentence.", grammar: "Read the whole sentence aloud.", reading: "Reread the text for the clue.", other: "No worries, let's think step by step." }
};
function mockCoach(r) {
  const L = r.lang === "en" ? "en" : "vi", subj = MOCK_HINT[L][r.subj] ? r.subj : "toan";
  if (r.mode === "explain") {
    const line = (MOCK_ERR[L][r.err] || MOCK_ERR[L].other);
    return { event: "comfort", emotion: "think", steps: [line, MOCK_HINT[L][subj][Math.min(2, r.step | 0)]], text: L === "en" ? "Let's try it again!" : "Mình thử lại nhé!" };
  }
  const i = Math.min(2, r.step | 0);
  return { event: "hint", emotion: "think", steps: MOCK_HINT[L][subj].slice(0, i + 1), text: MOCK_HINT[L][subj][i].slice(0, MAX_TEXT) };
}

/* ---- kiểm đầu ra: đúng lược đồ, qua lọc từ nhạy cảm, KHÔNG chứa đáp án ---- */
function shape(o) {
  if (!o || typeof o !== "object") return null;
  const event = COACH_EVENTS.includes(o.event) ? o.event : "hint", emotion = EMOTIONS.includes(o.emotion) ? o.emotion : "think";
  if (!Array.isArray(o.steps) || o.steps.length > 3 || typeof o.text !== "string") return null;
  const steps = o.steps.map(s => String(s == null ? "" : s).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, MAX_STEP)).filter(Boolean);
  const text = o.text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (!text || text.length > MAX_TEXT + 20) return null;
  return { event, emotion, steps, text: text.slice(0, MAX_TEXT) };
}
function vet(o, correct) {   // trả { ok, why, out }
  const s = shape(o); if (!s) return { ok: false, why: "schema" };
  for (const t of [s.text, ...s.steps]) {
    const c = SAFE.check(t); if (!c.ok) return { ok: false, why: "unsafe:" + c.why };
    if (SAFE.leaks(t, correct)) return { ok: false, why: "leak" };
  }
  return { ok: true, out: s };
}

/* ---- nhà cung cấp thật (chỉ chạy khi có LEARN_AI_KEY; kiểm bằng fetch giả ở scripts/learn/check-coach.js) ---- */
const SYSTEM = "Bạn là linh vật học cùng bé lớp 1-5 ở Việt Nam. Chỉ trả về MỘT đối tượng JSON: {\"event\":\"hint|comfort|wrong|praiseEffort\",\"emotion\":\"idle|happy|cheer|sad|sleepy|think|wow\",\"steps\":[tối đa 3 câu ngắn],\"text\":\"một câu <= 40 ký tự\"}. " +
  "QUY TẮC TUYỆT ĐỐI: không bao giờ nói hay gợi ra ĐÁP ÁN ĐÚNG (kể cả viết bằng chữ), chỉ dẫn từng bước nhỏ để bé tự nghĩ; giọng ấm, ngắn, khích lệ; không so sánh bé với bạn khác, không dọa, không hỏi thông tin cá nhân, không nhắc mạng xã hội hay liên hệ bên ngoài; chỉ nói về câu học đang làm. Dùng đúng ngôn ngữ được yêu cầu.";
async function callAI(r, key, model, fetchFn, ms) {
  const ac = typeof AbortController !== "undefined" ? new AbortController() : null, tm = ac ? setTimeout(() => ac.abort(), ms) : 0;
  const user = JSON.stringify({ ngon_ngu: r.lang, lop: r.grade, mon: r.subj, ky_nang: r.skill, che_do: r.mode === "explain" ? "giai_thich_khi_sai" : "goi_y_tung_buoc", buoc_hien_tai: r.step, cau_hoi: r.q, dap_an_dung_BI_MAT_KHONG_DUOC_NOI: r.correct, be_chon_sai: r.wrong || null, ma_loi: r.err || null });
  try {
    const res = await fetchFn("https://api.anthropic.com/v1/messages", { method: "POST", signal: ac && ac.signal, headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 400, system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }], messages: [{ role: "user", content: user }] }) });
    if (!res.ok) throw new Error("ai_http_" + res.status);
    const j = await res.json(), txt = j && j.content && j.content[0] && j.content[0].text || "";
    const m = /\{[\s\S]*\}/.exec(txt); if (!m) throw new Error("ai_format");
    return JSON.parse(m[0]);
  } finally { clearTimeout(tm); }
}

module.exports = function install(d) {
  const { route, out, limited, noTable, db, readToken, deviceVerdict, ctxOf, bearerOf, issueToken, userIdForEmail, normEmail, validEmail, env } = d;
  const on = () => String(env("LEARN_PLUS", "off")).toLowerCase() === "on";
  const off = () => out(404, { error: "learn_off" });
  const aiKey = () => env("LEARN_AI_KEY", "");
  const aiMock = () => !aiKey() || String(env("LEARN_AI_MOCK", "")).toLowerCase() === "on";
  const dailyMax = () => Math.max(1, Math.min(500, Math.floor(+env("LEARN_COACH_DAILY", 40)) || 40));
  const testPrice = () => String(env("LEARN_TEST_PRICE", "off")).toLowerCase() === "on";
  const plans = () => testPrice() ? { ...PLANS_LEARN, learn_test: { amount: 1000, days: 1 } } : PLANS_LEARN;   // thử bằng giá 1.000đ (chỉ khi LEARN_TEST_PRICE=on)
  const isLearnPlan = p => String(p).startsWith("learn_");
  const ms = x => (x ? new Date(x).getTime() : 0);

  async function stateOf(userId, q = db) {
    const { rows: [p] } = await q.query("select exp, plan from learn_passes where user_id = $1", [userId]);
    const active = !!p && ms(p.exp) > Date.now();
    return p ? { active, exp: ms(p.exp), plan: p.plan, trial: p.plan === "trial", features: active ? FEATURES : [] } : { active: false, exp: 0, plan: null, trial: false, features: [] };
  }
  /* cấp quyền Plus: gọi trong transaction của webhook (đơn đã khoá) */
  async function grant(c, order, txId) {
    const plan = plans()[order.plan] || PLANS_LEARN[order.plan];
    const { rows: [p] } = await c.query(
      `insert into learn_passes(user_id, exp, plan) values ($1, now() + make_interval(days => $2), $3)
       on conflict (user_id) do update set exp = greatest(now(), learn_passes.exp) + make_interval(days => $2), plan = $3, updated_at = now() returning exp`, [order.user_id, plan.days, order.plan]);
    await c.query("update orders set status = 'paid', paid_at = now(), exp = $2, tx_id = $3 where id = $1", [order.id, p.exp, txId]);
  }
  async function authLearn(headers, feature) {   // → { t, st } hoặc { fail: response }
    const t = readToken(bearerOf(headers), "learn");
    if (!t) return { fail: out(401, { active: false, reason: "token" }) };
    const v = await deviceVerdict(t, null);
    if (v !== "ok") return { fail: out(401, { active: false, reason: v, now: Date.now() }) };
    let st; try { st = await stateOf(t.u); } catch (e) { if (noTable(e)) return { fail: out(503, { error: "migration_required" }) }; throw e; }
    if (!st.active || (feature && !st.features.includes(feature))) return { fail: out(402, { active: false, reason: "plus_required" }) };
    return { t, st };
  }
  /* GET /api/pass?product=learn (gọi từ route /api/pass của app.js) */
  async function passRoute(headers) {
    if (!on()) return off();
    const t = readToken(bearerOf(headers), "learn");
    if (!t) return out(401, { active: false, reason: "token" });
    const v = await deviceVerdict(t, ctxOf(headers));
    if (v !== "ok") return out(401, { active: false, reason: v, now: Date.now() });
    try { return out(200, { ...(await stateOf(t.u)), product: "learn", now: Date.now() }); }
    catch (e) { if (noTable(e)) return out(503, { error: "migration_required" }); throw e; }
  }

  route("GET", /^\/api\/learn\/plans$/, async () => {   // công khai, không có thông tin cá nhân: dùng cho thẻ Plus trong trang phụ huynh
    if (!on()) return off();
    return out(200, { on: true, trialDays: TRIAL_DAYS, features: FEATURES, ai: aiMock() ? "mock" : "live", plans: Object.keys(plans()).map(id => ({ id, amount: plans()[id].amount, days: plans()[id].days })) });
  });

  /* Dùng thử 7 ngày: không cần thẻ/tiền, mỗi tài khoản (email) một lần, gắn thiết bị (token có k). Bản đầu chưa xác thực email → chỉ chống lặp theo email; docs/LEARN-FREE-VS-PLUS.md ghi rõ. */
  route("POST", /^\/api\/learn\/trial$/, async ({ body, ip, headers }) => {
    if (!on()) return off();
    if (await limited("lt:" + ip, 5, 3600000)) return out(429, { error: "rate_limited" });
    const email = normEmail(body.email); if (!validEmail(email)) return out(400, { error: "bad_email" });
    try {
      const r = await db.tx(async c => {
        const uid = await userIdForEmail(c, email, true);
        const ins = await c.query("insert into learn_trials(user_id) values ($1) on conflict do nothing", [uid]);
        if (!ins.rowCount) return { used: true, uid };
        const st = await stateOf(uid, c); if (st.active) return { already: true, uid, st };
        const { rows: [p] } = await c.query(`insert into learn_passes(user_id, exp, plan) values ($1, now() + make_interval(days => $2), 'trial')
          on conflict (user_id) do update set exp = now() + make_interval(days => $2), plan = 'trial', updated_at = now() returning exp`, [uid, TRIAL_DAYS]);
        return { uid, exp: ms(p.exp) };
      });
      if (r.used) return out(409, { error: "trial_used" });
      if (r.already) return out(200, { ok: true, already: true, ...r.st });
      const tok = await issueToken(r.uid, r.exp, "trial", headers["x-device-pub"], "learn");
      return out(200, { ok: true, exp: r.exp, plan: "trial", ...tok });
    } catch (e) { if (noTable(e)) return out(503, { error: "migration_required" }); throw e; }
  });

  /* ---------- AI luyện cùng ---------- */
  const fallback = (mode, reason) => out(200, { ok: true, source: "fallback", reason, event: mode === "explain" ? "comfort" : "hint", emotion: mode === "explain" ? "sad" : "think", steps: [], text: "" });
  function parse(b) {
    const mode = b.mode === "explain" ? "explain" : b.mode === "hint" ? "hint" : null, str = (v, n) => (typeof v === "string" && v.length >= 1 && v.length <= n ? v.trim() : null);
    const grade = Math.floor(+b.grade), step = b.step == null ? 0 : Math.floor(+b.step);
    const q = str(b.q, 400), correct = str(b.correct, 60), skill = str(b.skill, 40);
    if (!mode || !(grade >= 1 && grade <= 5) || !q || !correct || !skill || !/^[A-Za-z0-9_.:-]+$/.test(skill)) return null;
    if (!(step >= 0 && step <= 2)) return null;
    const wrong = b.wrong == null || b.wrong === "" ? null : str(b.wrong, 60), err = b.err == null ? null : String(b.err);
    if (b.wrong != null && b.wrong !== "" && wrong === null) return null;
    if (err !== null && !TAGS.includes(err)) return null;
    return { mode, grade, subj: ["toan", "tviet", "tanh"].includes(b.subj) ? b.subj : "toan", skill, q: q.replace(/<[^>]*>/g, ""), correct, wrong, err, step, lang: b.lang === "en" ? "en" : "vi" };
  }
  const keyOf = r => crypto.createHash("sha256").update(JSON.stringify([r.mode, r.grade, r.subj, r.skill, r.q, r.correct, r.err, r.step, r.lang, aiMock() ? "m" : "a"])).digest("hex");   // KHÔNG có thông tin của bé; có `correct` nên cache không thể bị đầu độc bằng đáp án khác
  async function viDay() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()); }

  /* lõi: nhận yêu cầu đã parse → { source, out } hoặc { fallback: lý do }. Tách riêng để bài đo gọi trực tiếp. */
  async function coach(userId, r) {
    if (!SAFE.check(r.q).ok) return { fallback: "input_unsafe" };   // câu hỏi chứa từ nhạy cảm: không gửi cho AI
    const key = keyOf(r);
    try {
      const { rows: [hit] } = await db.query("select data from learn_coach_cache where key = $1", [key]);
      if (hit) { const v = vet(hit.data, r.correct); if (v.ok) { db.query("update learn_coach_cache set hits = hits + 1 where key = $1", [key]).catch(() => {}); return { source: "cache", out: v.out }; } }
    } catch (e) { if (!noTable(e)) return { fallback: "cache_error" }; return { fallback: "migration" }; }
    let used;
    try {
      const { rows: [u] } = await db.query("insert into learn_coach_usage(user_id, day, n) values ($1, $2::date, 1) on conflict (user_id, day) do update set n = learn_coach_usage.n + 1 returning n", [userId, await viDay()]);
      used = u.n;
    } catch (e) { return { fallback: noTable(e) ? "migration" : "usage_error" }; }
    if (used > dailyMax()) return { fallback: "quota" };
    let raw;
    try {
      raw = aiMock() ? mockCoach(r) : await callAI(r, aiKey(), env("LEARN_AI_MODEL", "claude-haiku-5-5"), d.fetch || fetch, +env("LEARN_AI_TIMEOUT_MS", 6000));
    } catch (e) { return { fallback: "ai_error" }; }
    const v = vet(raw, r.correct);
    if (!v.ok) { console.error("learn coach: đầu ra bị loại (" + v.why.split(":")[0] + ")"); return { fallback: v.why.startsWith("leak") ? "leak" : v.why.startsWith("unsafe") ? "unsafe" : "schema" }; }
    db.query("insert into learn_coach_cache(key, data) values ($1, $2::jsonb) on conflict (key) do nothing", [key, JSON.stringify(v.out)]).catch(() => {});
    return { source: aiMock() ? "mock" : "ai", out: v.out, left: Math.max(0, dailyMax() - used) };
  }

  route("POST", /^\/api\/learn\/coach$/, async ({ body, ip, headers }) => {
    if (!on()) return off();
    const a = await authLearn(headers, "coach"); if (a.fail) return a.fail;
    if (await limited("lc:" + a.t.u, 30)) return out(429, { error: "rate_limited" });
    const r = parse(body); if (!r) return out(400, { error: "bad_input" });
    const res = await coach(a.t.u, r);
    if (res.fallback) return fallback(r.mode, res.fallback);
    return out(200, { ok: true, source: res.source, ...res.out, left: res.left });
  });

  return { PLANS_LEARN, FEATURES, isLearnPlan, grant, stateOf, passRoute, plans, on, coach, parse, vet, mockCoach, shape, TAGS };
};
