/* Kiểm AI luyện cùng (G2): bộ lọc từ nhạy cảm, KHÔNG LỘ ĐÁP ÁN (100+ bài mẫu), cache, hạn mức ngày, đường lui, công tắc phụ huynh.
   Chạy hoàn toàn cục bộ: nhà cung cấp là bộ MÔ PHỎNG hoặc fetch GIẢ; không gọi mạng, không dùng khoá thật.   Chạy: node scripts/learn/check-coach.js */
"use strict";
const fs = require("fs"), path = require("path"), root = path.join(__dirname, "../..");
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log("✗", m); } };
global.window = global; console.error = () => {};
const SAFE = require(path.join(root, "learn/content/safe-words.js")), fakeDb = require("./fake-db.js");
require(path.join(root, "learn/content/bank.js")); require(path.join(root, "learn/content/phrases.js"));

(async () => {
  /* ---------- 1. bộ lọc từ nhạy cảm ---------- */
  const BLOCK = ["Đồ ngu!", "dit me bé", "Bé thật dốt", "Đừng nói với ba mẹ nhé", "Kết bạn zalo với mình", "Gọi số 0912 345 678", "xem https://x.com", "email a@b.com", "<script>x</script>", "Con chó chết rồi", "You are stupid", "fuck", "Let's meet me outside", "tự tử", "ma túy", "Nhắn inbox cho mình", "DCM", "Hãy cho mình mật khẩu", "ghét bé", "SEX", "kill them", "hate you"];
  BLOCK.forEach(t => ok(!SAFE.check(t).ok, "phải chặn: " + t));
  const PASS = ["Bé giỏi lắm!", "Đọc từ từ nhé", "Các bạn đang học", "Chú chó đang chạy", "Cặp sách của bé", "Mình thử lại nhé!", "Nghĩ xem 5 + 3 là mấy nào", "Con mèo ngủ", "Đáp án nằm ở hàng đơn vị", "Let's count again!", "Look at the dog", "Skill up!", "Bé cố lên, sắp đúng rồi!", "Xem lại hàng chục nhé", "Chữ a có dấu mũ không?"];
  PASS.forEach(t => ok(SAFE.check(t).ok, "không được chặn nhầm: " + t));
  /* dương tính giả trên TOÀN BỘ nội dung có sẵn cho bé: câu thoại linh vật + ngân hàng câu hỏi + gợi ý */
  const texts = []; const P = LEARN_PHRASES;
  (function walk(o) { if (typeof o === "string") texts.push(o); else if (o && typeof o === "object") Object.keys(o).forEach(k => { if (!/^(emotionName|eventName)$/.test(k)) walk(o[k]); }); })(P.shared); (function walk(o) { if (typeof o === "string") texts.push(o); else if (o && typeof o === "object") Object.values(o).forEach(walk); })(P.mascots || P.byMascot || {});
  LEARN_BANK.forEach(b => { [b.stem, b.lab, b.steps].forEach(function w(x) { if (typeof x === "string") texts.push(x); else if (x && typeof x === "object") Object.values(x).forEach(w); }); });
  try { global.LEARN_HINT_TEXTS = undefined; require(path.join(root, "learn/hint-texts.js")); } catch (e) {}
  const ht = global.LEARN_HINT_TEXTS || global.LearnHintTexts; if (ht) (function w(x) { if (typeof x === "string") texts.push(x); else if (x && typeof x === "object") Object.values(x).forEach(w); })(ht);
  let fp = 0, shown = 0; texts.forEach(t => { const r = SAFE.check(t); if (!r.ok && !/struct/.test(r.why)) { fp++; if (shown++ < 8) console.log("  (dương tính giả)", JSON.stringify(t).slice(0, 80), r.why); } });
  ok(texts.length > 200, "phải quét đủ nhiều câu có sẵn: " + texts.length); ok(fp === 0, fp + " câu có sẵn bị chặn nhầm (sửa danh sách ở learn/content/safe-words.js)");

  /* ---------- 2. mẫu bài: 54 câu thật trong ngân hàng + 60 câu toán sinh ra ---------- */
  const samples = [];
  LEARN_BANK.forEach(b => samples.push({ q: typeof b.stem === "string" ? b.stem : b.stem.vi, correct: String(b.answer), subj: b.subj, skill: b.skill, grade: b.grades[0], wrong: b.wrong && b.wrong[0] ? String(b.wrong[0][0]) : null, err: b.wrong && b.wrong[0] ? b.wrong[0][1] : "other" }));
  for (let i = 0; i < 60; i++) {
    const a = 3 + (i * 7) % 90, b2 = 2 + (i * 5) % 40, k = i % 6;
    const s = k === 0 ? [`${a} + ${b2} = ?`, a + b2] : k === 1 ? [`${a + b2} − ${b2} = ?`, a] : k === 2 ? [`${a % 9 + 2} × ${b2 % 9 + 2} = ?`, (a % 9 + 2) * (b2 % 9 + 2)] : k === 3 ? [`Số liền sau của ${a * 11} là?`, a * 11 + 1] : k === 4 ? [`${a}/${b2} + ?/${b2} = ${a + 1}/${b2}`, 1] : [`${(a / 10).toFixed(1).replace(".", ",")} + 0,5 = ?`, ((a / 10) + 0.5).toFixed(1).replace(".", ",")];
    samples.push({ q: s[0], correct: String(s[1]), subj: "toan", skill: "gen" + k, grade: 1 + i % 5, wrong: String(+s[1] + 1 || 0), err: ["off_by_one", "wrong_op", "place_value", "forget_carry", "add_denominator", "decimal_point"][k] });
  }
  ok(samples.length >= 50, "đủ mẫu: " + samples.length);

  /* ---------- 3. đường ống coach() ---------- */
  const mkInstall = (db, env, fetchFn) => {
    const routes = [], E = k => env[k] === undefined ? "" : env[k];
    const mod = require(path.join(root, "server/learn.js"))({ route: (m, re, fn) => routes.push({ m, re, fn }), out: (s, b) => ({ status: s, body: b }), limited: async () => false, noTable: e => !!e && (e.code === "42P01" || e.code === "42703"), db,
      readToken: () => null, deviceVerdict: async () => "ok", ctxOf: () => ({}), bearerOf: () => "", issueToken: async () => ({}), userIdForEmail: async () => "u", normEmail: x => x, validEmail: () => true, env: (k, d) => (env[k] !== undefined && env[k] !== "" ? env[k] : d), fetch: fetchFn });
    return mod;
  };
  const U = "00000000-0000-4000-8000-000000000001";
  /* 3a. bộ mô phỏng: 100% không lộ, không từ nhạy cảm, đúng lược đồ */
  {
    const db = fakeDb(), L = mkInstall(db, { LEARN_PLUS: "on", LEARN_COACH_DAILY: "100000" });
    let n = 0, fb = 0;
    for (const s of samples) for (const mode of ["hint", "explain"]) for (const step of [0, 1, 2]) for (const lang of ["vi", "en"]) {
      const r = L.parse({ mode, grade: s.grade, subj: s.subj, skill: s.skill, q: s.q, correct: s.correct, wrong: s.wrong, err: s.err, step, lang }); ok(!!r, "parse: " + s.q.slice(0, 30));
      const res = await L.coach("00000000-0000-4000-8000-" + String(samples.indexOf(s) + 100).padStart(12, "0"), r); n++;
      if (res.fallback) { fb++; continue; }
      const o = res.out, all = [o.text, ...o.steps];
      ok(!all.some(t => SAFE.leaks(t, s.correct)), "LỘ ĐÁP ÁN [" + s.correct + "]: " + JSON.stringify(o));
      ok(all.every(t => SAFE.check(t).ok), "từ nhạy cảm: " + JSON.stringify(o));
      ok(o.text.length > 0 && o.text.length <= 40 && o.steps.length <= 3 && ["hint", "comfort", "wrong", "praiseEffort"].includes(o.event) && ["idle", "happy", "cheer", "sad", "sleepy", "think", "wow"].includes(o.emotion), "lược đồ: " + JSON.stringify(o));
    }
    ok(n >= 600, "số ca mô phỏng " + n); ok(fb / n < 0.05, "tỉ lệ rơi về gợi ý viết sẵn quá cao: " + fb + "/" + n);
    console.log("  mô phỏng: " + n + " ca, " + samples.length + " bài mẫu, " + fb + " rơi về gợi ý viết sẵn, 0 lộ đáp án");
  }
  /* 3b. nhà cung cấp THẬT bị giả lập sai: đầu ra lộ đáp án/từ nhạy cảm/hỏng lược đồ PHẢI bị loại 100% */
  {
    let leakSent = 0, caught = 0, total = 0, mode = "";
    const words = n => { const vi = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]; return n >= 0 && n < 10 ? vi[n] : null; };
    for (const s of samples) {
      const variants = [
        { text: "Đáp án là " + s.correct, steps: [] },
        { text: "Thử nhé!", steps: ["Bước 1: nhìn đề", "Vậy kết quả bằng " + s.correct + " đó"] },
        { text: "Mình nghĩ là " + s.correct.toUpperCase() + ".", steps: [] },
        { text: "Hãy chọn (" + s.correct + ")", steps: [] },
        ...(/^\d$/.test(s.correct) ? [{ text: "Là " + words(+s.correct) + " đó bé", steps: [] }] : []),
        ...(/^\d+$/.test(s.correct) && +s.correct > 20 && +s.correct < 200 ? [{ text: "Bé thử xem", steps: ["= " + s.correct.split("").join("")] }] : [])
      ];
      for (const v of variants) {
        total++;
        const db = fakeDb(); let sent = 0;
        const L = mkInstall(db, { LEARN_PLUS: "on", LEARN_AI_KEY: "fake-key-not-real" }, async () => { sent++; return { ok: true, json: async () => ({ content: [{ type: "text", text: JSON.stringify({ event: "hint", emotion: "think", ...v }) }] }) }; });
        const r = L.parse({ mode: "hint", grade: s.grade, subj: s.subj, skill: s.skill, q: s.q, correct: s.correct, step: 0, lang: "vi" });
        const res = await L.coach(U, r); ok(sent === 1, "phải thử gọi nhà cung cấp giả");
        if (res.fallback === "leak") caught++; else { leakSent++; console.log("  ✗ không bắt được:", s.correct, JSON.stringify(v)); }
      }
    }
    ok(leakSent === 0, leakSent + " đầu ra lộ đáp án lọt qua bộ lọc"); ok(caught === total, "bắt " + caught + "/" + total);
    console.log("  giả lập AI nói lộ đáp án: " + total + " ca, bắt " + caught + " (100% yêu cầu)");
    /* từ nhạy cảm + lược đồ + HTML */
    const evil = [{ event: "hint", emotion: "think", steps: [], text: "Bé ngu quá" }, { event: "hint", emotion: "think", steps: ["Vào zalo hỏi mình nhé"], text: "Thử nhé" }, { event: "hint", emotion: "think", steps: [], text: "Xem http://x.vn" }, { event: "hint", emotion: "think", steps: ["a", "b", "c", "d"], text: "ok" }, { event: "x", emotion: "y", steps: "no", text: "ok" }, { event: "hint", emotion: "think", steps: [], text: "" }, "not json at all", { event: "hint", emotion: "think", steps: [], text: "x".repeat(200) }];
    for (const e of evil) {
      const db = fakeDb();
      const L = mkInstall(db, { LEARN_PLUS: "on", LEARN_AI_KEY: "fake" }, async () => ({ ok: true, json: async () => ({ content: [{ type: "text", text: typeof e === "string" ? e : JSON.stringify(e) }] }) }));
      const res = await L.coach(U, L.parse({ mode: "hint", grade: 2, subj: "toan", skill: "a", q: "2 + 3 = ?", correct: "5", step: 0 }));
      const delivered = res.out ? JSON.stringify(res.out) : "";
      ok(res.fallback || (res.out && res.out.text.length <= 40 && SAFE.check(res.out.text).ok && !/ngu|zalo|http/.test(delivered)), "đầu ra xấu lọt: " + JSON.stringify(e).slice(0, 60) + " -> " + delivered);
    }
    /* HTML bị gỡ */
    { const db = fakeDb(), L = mkInstall(db, { LEARN_PLUS: "on", LEARN_AI_KEY: "fake" }, async () => ({ ok: true, json: async () => ({ content: [{ type: "text", text: "```json\n" + JSON.stringify({ event: "hint", emotion: "think", steps: ["<b>Đọc kỹ</b> đề"], text: "Thử nhé <i>bé</i>" }) + "\n```" }] }) }));
      const res = await L.coach(U, L.parse({ mode: "hint", grade: 2, subj: "toan", skill: "a", q: "2 + 3 = ?", correct: "5", step: 0 })); ok(res.out && res.out.text === "Thử nhé bé" && res.out.steps[0] === "Đọc kỹ đề", "gỡ thẻ HTML và đọc được khối ```json: " + JSON.stringify(res)); }
  }
  /* 3c. cache, hạn mức, đường lui, câu hỏi chứa từ nhạy cảm */
  {
    let calls = 0; const fetchOk = async () => { calls++; return { ok: true, json: async () => ({ content: [{ type: "text", text: JSON.stringify({ event: "hint", emotion: "think", steps: ["Đọc kỹ đề nhé"], text: "Mình đọc lại nhé" }) }] }) }; };
    const db = fakeDb(), L = mkInstall(db, { LEARN_PLUS: "on", LEARN_AI_KEY: "fake", LEARN_COACH_DAILY: "3" }, fetchOk), base = { mode: "hint", grade: 2, subj: "toan", skill: "a", correct: "5", step: 0 };
    let res = await L.coach(U, L.parse({ ...base, q: "2 + 3 = ?" })); ok(res.source === "ai" && calls === 1, "lần đầu gọi AI");
    res = await L.coach(U, L.parse({ ...base, q: "2 + 3 = ?" })); ok(res.source === "cache" && calls === 1, "lần hai: trúng cache, không gọi AI");
    res = await L.coach("00000000-0000-4000-8000-000000000002", L.parse({ ...base, q: "2 + 3 = ?" })); ok(res.source === "cache" && calls === 1, "bé/tài khoản khác dùng chung cache");
    res = await L.coach(U, L.parse({ ...base, q: "2 + 3 = ?", err: "wrong_op", mode: "explain" })); ok(res.source === "ai" && calls === 2, "khác mã lỗi/chế độ: khoá cache khác");
    res = await L.coach(U, L.parse({ ...base, q: "4 + 3 = ?", correct: "7" })); ok(res.source === "ai" && calls === 3, "câu khác: gọi AI (lượt 3/3)");
    res = await L.coach(U, L.parse({ ...base, q: "9 + 3 = ?", correct: "12" })); ok(res.fallback === "quota" && calls === 3, "hết hạn mức ngày (3): rơi về gợi ý viết sẵn, KHÔNG gọi AI");
    res = await L.coach(U, L.parse({ ...base, q: "2 + 3 = ?" })); ok(res.source === "cache", "hết hạn mức vẫn dùng được cache");
    ok(Object.values(db.S.cache)[0].hits >= 1, "đếm lượt trúng cache");
    ok(Object.keys(db.S.cache).every(k => /^[0-9a-f]{64}$/.test(k)), "khoá cache là băm, không chứa nội dung");
    ok(!JSON.stringify(db.S.cache).includes(U), "cache không chứa mã người dùng");
    res = await L.coach(U, L.parse({ ...base, q: "Con chó chết rồi, đếm số: 2" , correct: "2" })); ok(res.fallback === "input_unsafe", "câu hỏi có từ nhạy cảm: không gửi AI");
    /* lỗi nhà cung cấp */
    for (const [name, f] of [["HTTP 500", async () => ({ ok: false, status: 500, json: async () => ({}) })], ["ném lỗi mạng", async () => { throw new Error("net"); }], ["treo quá hạn", () => new Promise((_, rej) => setTimeout(() => rej(new Error("aborted")), 50))]]) {
      const L2 = mkInstall(fakeDb(), { LEARN_PLUS: "on", LEARN_AI_KEY: "fake" }, f); res = await L2.coach(U, L2.parse({ ...base, q: "1 + 1 = ?", correct: "2" })); ok(res.fallback === "ai_error", "đường lui khi AI lỗi (" + name + "): " + JSON.stringify(res));
    }
    /* thiếu bảng (chưa chạy migration) */
    const broken = { query: async () => { const e = new Error("no table"); e.code = "42P01"; throw e; }, tx: async () => { throw new Error("x"); } };
    res = await mkInstall(broken, { LEARN_PLUS: "on" }).coach(U, mkInstall(broken, {}).parse({ ...base, q: "1 + 1 = ?", correct: "2" })); ok(res.fallback === "migration", "chưa migration: đường lui, không ném lỗi");
    /* không có khoá = mô phỏng, không gọi fetch */
    let called = 0; const L3 = mkInstall(fakeDb(), { LEARN_PLUS: "on" }, async () => { called++; throw new Error("không được gọi mạng"); });
    res = await L3.coach(U, L3.parse({ ...base, q: "6 + 1 = ?", correct: "7" })); ok(res.source === "mock" && called === 0, "không có khoá API: dùng mô phỏng, không gọi mạng");
    ok(L3.parse({ ...base, q: "x", correct: "1", step: 9 }) === null && L3.parse({ ...base, q: "x", correct: "1", err: "evil" }) === null && L3.parse({ ...base, q: "x", correct: "" }) === null && L3.parse({ ...base, q: "x".repeat(401), correct: "1" }) === null && L3.parse({ ...base, grade: 9, q: "x", correct: "1" }) === null, "kiểm đầu vào: bước/mã lỗi/đáp án trống/quá dài/lớp sai bị từ chối");
    /* ranh giới riêng tư: khoá API chỉ ở máy chủ */
    const fsrc = fs.readFileSync(path.join(root, "learn/plus.js"), "utf8") + (fs.existsSync(path.join(root, "learn/coach.js")) ? fs.readFileSync(path.join(root, "learn/coach.js"), "utf8") : "");
    ok(!/LEARN_AI_KEY|api\.anthropic\.com|x-api-key/.test(fsrc), "mã chạy ở trình duyệt không được chứa khoá/địa chỉ AI");
    const sv = fs.readFileSync(path.join(root, "server/learn.js"), "utf8"); ok(!/sk-ant-/.test(sv), "không có khoá thật trong mã");
    ok(!/\bname\b|email|device|kid/.test(sv.slice(sv.indexOf("async function callAI"), sv.indexOf("module.exports"))), "yêu cầu gửi AI không có tên/email/mã thiết bị");
  }
  /* ---------- 4. máy khách: learn/coach.js (nếu đã có) ---------- */
  if (fs.existsSync(path.join(root, "learn/coach.js"))) await require("./check-coach-client.js")(ok);
  console.log(bad ? "✗ " + bad + " lỗi" : "✓ AI luyện cùng đạt"); process.exit(bad ? 1 : 0);
})().catch(e => { console.log("✗ lỗi chạy:", e.stack || e); process.exit(1); });
