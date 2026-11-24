/* Kiểm kỷ lục + huy hiệu trang Của bé (learn/me/records.js, badges.js, backup): node scripts/learn/check-records.js */
"use strict";
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log("✗", m); } };
const mk = () => { const m = {}; return { m, get length() { return Object.keys(m).length; }, key: i => Object.keys(m)[i] ?? null, getItem: k => k in m ? m[k] : null,
  setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; };
global.window = global; global.localStorage = mk(); const A = global.localStorage;
const R = require("../../learn/me/records.js"), Bd = require("../../learn/me/badges.js"), Bk = require("../../learn/backup.js");
const fs = require("fs"); const vm = require("vm"); vm.runInThisContext(fs.readFileSync("learn/content/badges-g35.js", "utf8"));
const z = n => ("0" + n).slice(-2), k = d => d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
const now = new Date(2026, 10, 25, 12);   /* thứ Tư 25/11/2026 */
const at = n => k(new Date(2026, 10, 25 - n));
/* ngày học liền: hôm nay, qua 3 ngày trước, rồi nghỉ, rồi 2 ngày */
ok(R.longestRun(["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-05"]) === 3, "longestRun");
ok(R.longestRun([]) === 0 && R.longestRun(["2026-02-28", "2026-03-01"]) === 2, "longestRun biên tháng");
const day = {}; day[at(0)] = { n: 12, ok: 9, s: { toan: 12 } }; day[at(1)] = { n: 20, ok: 15, s: { toan: 10, tviet: 10 } }; day[at(2)] = { n: 4, ok: 4, s: { tanh: 4 } };
day[at(7)] = { n: 10, ok: 5, s: { toan: 10 } }; day[at(6)] = { n: 6, ok: 3, s: { toan: 6 } }; day[at(5)] = { n: 30, ok: 24, s: { tviet: 30 } };
A.setItem("learn:day", JSON.stringify(day)); A.setItem("learn:habit", JSON.stringify({ days: [at(0), at(1), at(2), at(7)], total: 9 }));
let r = R.update(now);
ok(r.ds.v === 3, "ngày liền dài nhất = 3 (18-20/11 và 23-25/11), được " + r.ds.v);
ok(r.bq.v === 30, "nhiều câu nhất 30"); ok(r.ba.v === 80, "đúng cao nhất 80%, được " + r.ba.v); ok(r.bw.v >= 3, "tuần chăm nhất");
ok(r.ds.d === "", "lần ghi đầu không được gọi là kỷ lục mới");
/* kỷ lục chỉ tăng, không giảm khi nhật ký bị cắt */
A.setItem("learn:day", "{}"); A.setItem("learn:habit", "{}"); r = R.update(now); ok(r.bq.v === 30 && r.ds.v === 3, "kỷ lục bị mất khi nhật ký rỗng");
/* so với chính mình: cùng số ngày (T2..T4 tuần này vs T2..T4 tuần trước) */
A.setItem("learn:day", JSON.stringify(day)); const c = R.compare(now);
ok(c.upto === 3 && c.cur.n === 36 && c.cur.days === 3, "tuần này: " + JSON.stringify(c.cur));
ok(c.prev.n === 10 && c.prev.days === 1, "tuần trước (T2-T4 = 16-18/11): " + JSON.stringify(c.prev));
const w = R.subjWeeks(now); ok(w.toan.length === 4 && w.toan[3] === 22 && w.tviet[3] === 10, "subjWeeks " + JSON.stringify(w));
/* câu đúng liên tiếp */
R.noteAnswer(true); R.noteAnswer(true); R.noteAnswer(true); R.noteAnswer(false); R.noteAnswer(true);
ok(R.load().cs.v === 3 && R.load().cs.cur === 1, "chuỗi câu đúng " + JSON.stringify(R.load().cs));
/* huy hiệu mốc */
const ms = Bd.milestones({ days: 12, questions: 250, stars: 10, ds: 3 }); ok(ms.find(m => m.id === "days10").got && !ms.find(m => m.id === "days20").got, "mốc ngày");
const nx = Bd.next(ms); ok(nx.length === 4 && nx.find(m => m.grp === "q").need === 300 && nx.find(m => m.grp === "q").raw === 250, "chặng tiếp theo");
ok(ms.every(m => m.cur <= m.need), "cur vượt need");
const tp = Bd.topics((g, s, t) => (t === "g4_fractions" ? { b: 3, l: 1 } : { b: 1, l: 1 }), 4); ok(tp.length === 14 && tp.filter(t => t.got).length === 1, "huy hiệu chủ đề lớp 4: " + tp.length);
ok(Bd.topicHint(tp[0]).text.includes("còn 2 sao"), "gợi ý còn thiếu: " + Bd.topicHint(tp[0]).text);
/* sao lưu */
ok(Bk.collect().data["learn:records"], "learn:records chưa có trong sao lưu"); const f = JSON.parse(JSON.stringify(Bk.collect())); ok(Bk.validate(f).ok, "tệp sao lưu có records phải hợp lệ");
/* không dữ liệu cá nhân: chỉ số và ngày */
ok(!/[A-Za-zÀ-ỹ]{4,}/.test(A.getItem("learn:records").replace(/"(ds|bq|ba|bw|cs|cur)"/g, "")), "learn:records chứa chữ lạ");
console.log(bad ? "✗ " + bad + " lỗi" : "✓ Kỷ lục + huy hiệu đạt"); process.exit(bad ? 1 : 0);
