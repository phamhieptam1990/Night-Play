/* Kiểm đề thi thử lớp 6 (server/learn-exam.js): đề cố định, đáp án đúng do bộ giải ĐỘC LẬP tính lại, không lộ đáp án qua đường công khai, chấm điểm, cần Plus (tính năng exam6).
   Chạy: node scripts/learn/check-exam.js */
"use strict";
const path = require("path"), root = path.join(__dirname, "../..");
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log("✗", m); } };
const X = require(path.join(root, "server/learn-exam.js")), fakeDb = require("./fake-db.js");
const TAGS = ["off_by_one", "wrong_op", "place_value", "unit_convert", "formula_confuse", "order_ops", "read_chart", "concept_confuse", "pattern_miss", "forget_carry", "tens_error", "table_confuse", "carry_error", "add_denominator", "decimal_point", "percent_misread", "spelling", "tone", "meaning", "word", "grammar", "reading", "other"];
const num = s => +String(s).replace(",", "."), gcd = (a, b) => b ? gcd(b, a % b) : a, fr = (n, d) => { const g = gcd(n, d); return d / g === 1 ? String(n / g) : n / g + "/" + d / g; };
const dec = x => String(Math.round(x * 1e6) / 1e6).replace(".", ",");
/* bộ giải độc lập: nhận câu hỏi chữ → đáp án (chuỗi) */
function solve(q) {
  let m;
  if ((m = /^Tính: (\d+)\/(\d+) \+ (\d+)\/(\d+) = \?$/.exec(q))) return fr(+m[1] * +m[4] + +m[3] * +m[2], +m[2] * +m[4]);
  if ((m = /^Tính: ([\d,]+) × (\d+) = \?$/.exec(q))) return dec(Math.round(num(m[1]) * +m[2] * 10) / 10);
  if ((m = /^(\d+)% của (\d+) là/.exec(q))) return String(+m[1] * +m[2] / 100);
  if ((m = /dài (\d+) cm, rộng (\d+) cm\. Diện tích/.exec(q))) return String(+m[1] * +m[2]);
  if ((m = /dài (\d+) cm, rộng (\d+) cm\. Chu vi/.exec(q))) return String(2 * (+m[1] + +m[2]));
  if ((m = /^([\d,]+) m = \.\.\. cm$/.exec(q))) return String(Math.round(num(m[1]) * 100));
  if ((m = /^([\d,]+) kg = \.\.\. g$/.exec(q))) return String(Math.round(num(m[1]) * 1000));
  if ((m = /^(\d+) km (\d+) m = \.\.\. m$/.exec(q))) return String(+m[1] * 1000 + +m[2]);
  if ((m = /vận tốc (\d+) km\/giờ trong (\d+) giờ/.exec(q))) return String(+m[1] * +m[2]);
  if ((m = /^Trung bình cộng của các số ([\d; ]+) là/.exec(q))) { const a = m[1].split(";").map(Number); return dec(a.reduce((x, y) => x + y, 0) / a.length); }
  if ((m = /^Tính giá trị biểu thức: (\d+) \+ (\d+) × (\d+) − (\d+)$/.exec(q))) return String(+m[1] + +m[2] * +m[3] - +m[4]);
  if ((m = /chia (\d+) viên bi theo tỉ lệ (\d+) : (\d+)\. Phần của bạn có tỉ lệ (\d+)/.exec(q))) return String(+m[1] / (+m[2] + +m[3]) * +m[4]);
  if ((m = /^Trong số (\d),(\d)(\d)(\d), chữ số (\d) thuộc hàng nào\?$/.exec(q))) { const pos = [m[2], m[3], m[4]].indexOf(m[5]); return ["hàng phần mười", "hàng phần trăm", "hàng phần nghìn"][pos]; }
  return null;
}
(async () => {
  const seen = new Set();
  for (const id of X.EXAM_IDS) {
    const e = X.makeExam(id), e2 = X.makeExam(id);
    ok(JSON.stringify(e) === JSON.stringify(e2), "đề " + id + " phải cố định (cùng số đề, cùng đề)");
    ok(e.items.length === 30, "đề " + id + " phải 30 câu: " + e.items.length);
    ok(new Set(e.items.map(i => i.id)).size === 30 && new Set(e.items.map(i => i.q)).size === 30, "đề " + id + ": id và câu hỏi phải khác nhau");
    ok(Object.keys(e.topics).every(t => e.items.filter(i => i.topic === t).length === 3), "đề " + id + ": mỗi dạng 3 câu");
    for (const it of e.items) {
      ok(it.options.length === 4 && new Set(it.options).size === 4, it.id + ": 4 đáp án khác nhau " + JSON.stringify(it.options));
      ok(it.correct >= 0 && it.correct < 4, it.id + ": chỉ số đúng");
      const want = solve(it.q); ok(want !== null, it.id + ": bộ giải độc lập không hiểu câu: " + it.q);
      ok(want === it.options[it.correct], it.id + ": đáp án sai? " + it.q + " → " + it.options[it.correct] + " (độc lập: " + want + ")");
      ok(it.tags.every(t => t === null || TAGS.includes(t)) && it.tags.filter(t => t === null).length === 1, it.id + ": mã lỗi hợp lệ, đúng một đáp án đúng");
      ok(!it.options.some(o => /NaN|Infinity|undefined|\d{6,}/.test(o)), it.id + ": đáp án xấu " + JSON.stringify(it.options));
      ok(!/[0-9]\.[0-9]/.test(it.q) && !it.options.some(o => /\d\.\d{2,}/.test(o)), it.id + ": số thập phân phải dùng dấu phẩy");
    }
    const pub = JSON.stringify(X.publicExam(e)); ok(!/correct|tags/.test(pub), "đề công khai không được có correct/tags");
    e.items.forEach(i => seen.add(i.q));
  }
  ok(seen.size >= 80, "3 đề phải khác nhau nhiều: " + seen.size + " câu khác nhau / 90");
  ok(X.makeExam(0) === null && X.makeExam(4) === null && X.makeExam("x") === null, "số đề ngoài 1-3 bị từ chối");
  /* chấm điểm */
  const e = X.makeExam(1), perfect = Object.fromEntries(e.items.map(i => [i.id, i.correct]));
  let g = X.gradeExam(e, perfect); ok(g.score === 30 && g.score10 === 10 && g.weak.length === 0 && Object.keys(g.errors).length === 0, "điểm tối đa: " + JSON.stringify(g).slice(0, 80));
  const half = {}; e.items.forEach((i, k) => { half[i.id] = k % 2 === 0 ? i.correct : (i.correct + 1) % 4; });
  g = X.gradeExam(e, half); ok(g.score === 15 && g.score10 === 5 && g.answered === 30, "một nửa: " + g.score);
  ok(Object.values(g.errors).reduce((a, b) => a + b, 0) === 15, "mỗi câu sai ghi một mã lỗi");
  g = X.gradeExam(e, {}); ok(g.score === 0 && g.answered === 0, "bỏ trống: 0 điểm");
  const wrongTopic = {}; e.items.forEach(i => { wrongTopic[i.id] = i.topic === "frac" ? (i.correct + 1) % 4 : i.correct; });
  g = X.gradeExam(e, wrongTopic); ok(g.weak.length === 1 && g.weak[0] === "frac", "dạng yếu nhất được nêu: " + g.weak);
  g = X.gradeExam(e, { [e.items[0].id]: "hack", [e.items[1].id]: 99, [e.items[2].id]: -1, zzz: 1 }); ok(g.score === 0, "đầu vào bậy không ra điểm");
  /* đường API: cần Plus (exam6), không có đáp án */
  const routes = []; let tok = null;
  const db = fakeDb(); const U = "00000000-0000-4000-8000-000000000001";
  db.S.learn[U] = { exp: Date.now() + 86400000, plan: "learn_month" };
  require(path.join(root, "server/learn.js"))({ route: (m, re, fn) => routes.push({ m, re, fn }), out: (s, b) => ({ status: s, body: b }), limited: async () => false, noTable: () => false, db, readToken: t => t === "OK" ? { u: U } : null, deviceVerdict: async () => "ok", ctxOf: () => ({}), bearerOf: h => h.authorization || "", issueToken: async () => ({}), userIdForEmail: async () => U, normEmail: x => x, validEmail: () => true, env: (k, d) => k === "LEARN_PLUS" ? "on" : d });
  const call = async (m, p, headers, body) => { for (const r of routes) { const mm = p.match(r.re); if (mm && r.m === m) return r.fn({ m: mm, headers: headers || {}, body: body || {}, ip: "x" }); } return { status: 404 }; };
  let r = await call("GET", "/api/learn/exam/1"); ok(r.status === 401, "không token: 401");
  r = await call("GET", "/api/learn/exam/1", { authorization: "OK" }); ok(r.status === 200 && r.body.exam.items.length === 30 && !/correct|tags/.test(JSON.stringify(r.body)), "có Plus: nhận đề, không có đáp án");
  r = await call("GET", "/api/learn/exam/4", { authorization: "OK" }); ok(r.status === 404, "đề 4 không có");
  r = await call("POST", "/api/learn/exam/1/grade", { authorization: "OK" }, { answers: perfect }); ok(r.status === 200 && r.body.result.score === 30, "chấm qua API");
  r = await call("POST", "/api/learn/exam/1/grade", { authorization: "OK" }, { answers: "x" }); ok(r.status === 400, "đầu vào xấu: 400");
  db.S.learn[U].exp = Date.now() - 1000; r = await call("GET", "/api/learn/exam/1", { authorization: "OK" }); ok(r.status === 402, "hết hạn Plus: 402");
  const fsrc = require("fs"); const pub = require("child_process").execSync("git ls-files learn | grep -i exam || true", { cwd: root, encoding: "utf8" }); ok(!pub.trim(), "không có tệp đề thi nào trong thư mục công khai learn/: " + pub);
  console.log(bad ? "✗ " + bad + " lỗi" : "✓ Đề thi thử đạt"); process.exit(bad ? 1 : 0);
})().catch(e => { console.log("✗ lỗi chạy:", e.stack || e); process.exit(1); });
