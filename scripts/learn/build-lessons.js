#!/usr/bin/env node
/* Kiểm tra + sinh chỉ mục bài học Học Vui: learn/content/lessons/*.js -> learn/content/lessons/index.js
   Chạy: node scripts/learn/build-lessons.js   (thoát mã 1 nếu có lỗi). Bài học là tệp JS gọi LearnLessons.reg({...}). */
"use strict";
const fs = require("fs"), path = require("path");
const DIR = path.join(__dirname, "../../learn/content/lessons");
const K_SCREEN = { say: 1, tapcount: 1, merge: 1, take: 1, choose: 1, sum: 1 };
const SHAPES = { circle: 1, square: 1, triangle: 1, rect: 1 };
const MAX_T = 90, MAX_OPT = 24, errs = [];
const reg = []; global.window = { LearnLessons: { reg: o => reg.push(o) } };
const files = fs.readdirSync(DIR).filter(f => /^(g\d|VI-|EN-).*\.js$/.test(f)).sort();
files.forEach(f => { try { delete require.cache[require.resolve(path.join(DIR, f))]; require(path.join(DIR, f)); } catch (e) { errs.push(f + ": không nạp được: " + e.message); } });
const cur = global.window; global.window = undefined;
const E = require("../../learn/engine.js"); global.window = cur; global.window.LEARN_CURRICULUM = undefined; require("../../learn/content/curriculum.js");
const C = global.window.LEARN_CURRICULUM;
function topicOk(subj, grade, id) { const s = C.subjects[subj]; if (!s) return false; const g = s.grades.find(x => x.grade === grade); return !!g && g.topics.some(t => t.id === id); }
function txt(where, s, max) { if (typeof s !== "string" || !s.trim()) errs.push(where + ": thiếu chữ"); else if (s.length > (max || MAX_T)) errs.push(where + ": dài " + s.length + " > " + (max || MAX_T)); else if (/[<>]/.test(s)) errs.push(where + ": có < >"); }
function choose(where, o) {
  if (!Array.isArray(o.opts) || o.opts.length < 2 || o.opts.length > 4) return errs.push(where + ": cần 2–4 đáp án");
  o.opts.forEach((x, i) => txt(where + " opts[" + i + "]", x, MAX_OPT));
  if (!(o.ok >= 0 && o.ok < o.opts.length)) errs.push(where + ": ok không hợp lệ");
  if (new Set(o.opts).size !== o.opts.length) errs.push(where + ": đáp án trùng nhau");
}
{ const sl = fs.readFileSync(path.join(__dirname, "../../learn/slot.js"), "utf8"), m = /var TOTAL = (\{[^}]*\})/.exec(sl);
  if (!m) errs.push("slot.js: không tìm thấy bảng TOTAL"); else { const T = eval("(" + m[1].replace(/(\w+):/g, '"$1":') + ")");
    Object.keys(C.subjects).forEach(sj => C.subjects[sj].grades.forEach(g => { if ((T[sj] || [])[g.grade - 1] !== g.topics.length) errs.push("slot.js TOTAL lệch curriculum: " + sj + " lớp " + g.grade + " (" + ((T[sj] || [])[g.grade - 1]) + " ≠ " + g.topics.length + ")"); })); } }
{ global.window.LEARN_TEASERS = undefined; require("../../learn/content/teasers.js"); const TE = global.window.LEARN_TEASERS || {};   /* mỗi chủ đề phải có gợi tò mò (trang Chương trình học) */
  Object.keys(C.subjects).forEach(sj => C.subjects[sj].grades.forEach(g => g.topics.forEach(t => { const x = TE[t.id]; if (!x) errs.push("teasers.js thiếu chủ đề " + t.id); else { txt("teaser " + t.id + " hình", x[0], 12); txt("teaser " + t.id + " câu", x[1], 80); } })));
  Object.keys(TE).forEach(k => { if (!C.subjects.toan.grades.concat(C.subjects.tviet.grades, C.subjects.tanh.grades).some(g => g.topics.some(t => t.id === k))) errs.push("teasers.js thừa chủ đề " + k); }); }
const seen = {};
reg.forEach(L => {
  const w = L.id || "?";
  if (seen[L.id]) errs.push(w + ": trùng id"); seen[L.id] = 1;
  if (!topicOk(L.subj, L.grade, L.id)) errs.push(w + ": không có trong chương trình (curriculum) lớp " + L.grade + " môn " + L.subj);
  else if (!E.topicSkills(L.subj, L.grade, L.id).length) console.warn("! " + w + ": chủ đề chưa có kỹ năng kiểm tra (bài kiểm tra dùng kỹ năng cả lớp)");
  txt(w + " title", L.title, 60);
  if (!Array.isArray(L.screens) || L.screens.length < 4 || L.screens.length > 12) errs.push(w + ": cần 4–12 màn học");
  (L.screens || []).forEach((s, i) => {
    const x = w + " màn " + (i + 1);
    if (!K_SCREEN[s.k]) return errs.push(x + ": kiểu lạ " + s.k);
    txt(x + " t", s.t);
    if (s.k === "tapcount" && !(s.n >= 2 && s.n <= 12 && s.e)) errs.push(x + ": tapcount cần n 2–12 và e");
    if (s.k === "merge" && !(s.a >= 1 && s.b >= 1 && s.a + s.b <= 12 && s.e)) errs.push(x + ": merge cần a, b (tổng <= 12) và e");
    if (s.k === "take" && !(s.n <= 12 && s.m >= 1 && s.m < s.n && s.e)) errs.push(x + ": take cần n <= 12, 1 <= m < n và e");
    if (["tapcount", "merge", "take"].includes(s.k)) txt(x + " done", s.done);
    if (s.k === "choose") { choose(x, s); txt(x + " yes", s.yes); txt(x + " no", s.no); }
    if (s.k === "sum" && !(Array.isArray(s.pts) && s.pts.length >= 2 && s.pts.length <= 4)) errs.push(x + ": sum cần 2–4 ý");
    if (s.k === "sum") (s.pts || []).forEach((p, j) => txt(x + " pts[" + j + "]", p));
    (s.shapes || []).forEach(h => { if (!SHAPES[h]) errs.push(x + ": hình lạ " + h); });
    if (s.en !== undefined) { if (!Array.isArray(s.en) || s.en.length < 1 || s.en.length > 4) errs.push(x + ": en cần 1–4 từ/câu"); else s.en.forEach((e, j) => txt(x + " en[" + j + "]", e, 24)); }
    if (s.optlang !== undefined && s.optlang !== "en") errs.push(x + ": optlang chỉ nhận en");
  });
  if (!(L.screens || []).some(s => s.k === "sum")) errs.push(w + ": thiếu màn tóm tắt (sum)");
  if (!Array.isArray(L.tryit) || L.tryit.length < 2 || L.tryit.length > 4) errs.push(w + ": cần 2–4 câu thử cùng");
  (L.tryit || []).forEach((q, i) => { const x = w + " thử cùng " + (i + 1); txt(x + " q", q.q); choose(x, q); txt(x + " hint", q.hint); txt(x + " yes", q.yes); if (q.optlang !== undefined && q.optlang !== "en") errs.push(x + ": optlang chỉ nhận en"); });
});
if (errs.length) { console.error("✗ " + errs.length + " lỗi:\n" + errs.map(e => "  - " + e).join("\n")); process.exit(1); }
const idx = {}; reg.forEach(L => { idx[L.id] = { n: L.screens.length, q: L.tryit.length }; });
fs.writeFileSync(path.join(DIR, "index.js"), "/* SINH BỞI scripts/learn/build-lessons.js, không sửa tay. Danh sách chủ đề đã có bài học. */\n(function(){var P=window.LearnPath;if(P)Object.assign(P.lessons,"+JSON.stringify(idx)+");})();\n");
console.log("✓ " + reg.length + " bài học hợp lệ, đã ghi index.js: " + Object.keys(idx).join(", "));
