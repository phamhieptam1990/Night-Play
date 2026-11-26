#!/usr/bin/env node
/* Sinh BẢN NHÁP bài học lớp 2–5 cho mọi chủ đề CHƯA có bài (learn/content/lessons/<id>.js).
   Nội dung tự lắp từ: tên + các ý trong chương trình (curriculum), và câu hỏi/gợi ý của engine theo kỹ năng của chủ đề.
   Bài nháp: không có hoạt hình riêng cho từng chủ đề; cần giáo viên/chủ site viết lại lời giảng cho hay hơn (xem docs/LEARN-REVIEW-CHECKLIST.md mục G).
   Chạy: node scripts/learn/gen-lessons-draft.js   rồi   node scripts/learn/build-lessons.js
   Không ghi đè bài đã có. Bài do bộ sinh tạo có dòng đầu "BẢN NHÁP TỰ SINH" nên chạy lại sẽ sinh lại chính các bài đó (không đụng bài viết tay). */
"use strict";
const fs = require("fs"), path = require("path");
const DIR = path.join(__dirname, "../../learn/content/lessons");
global.window = {};
const E = require("../../learn/engine.js"); require("../../learn/content/curriculum.js");
const C = global.window.LEARN_CURRICULUM;
const MARK = "BẢN NHÁP TỰ SINH";
const EXTRA = require("./lesson-extra.js"), TEACH = require("./lesson-teach.js");

function rngFor(id) { let h = 2166136261; for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296; }; }
const cut = (s, n) => { s = String(s).replace(/\s+/g, " ").trim(); if (s.length <= n) return s; const t = s.slice(0, n - 1), i = t.lastIndexOf(" "); return (i > n * 0.5 ? t.slice(0, i) : t) + "…"; };
const plain = h => String(h).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const shuffle = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function pickQuestions(subj, grade, skills, rnd, want) {
  const out = [], seen = new Set();
  for (let t = 0; t < 600 && out.length < want; t++) {
    const sk = skills[t % skills.length]; let q; try { q = E.make(sk, { lang: "vi", grade, used: {} }); } catch (e) { continue; }
    if (!q || q.kind || !Array.isArray(q.o) || q.o.length < 3) continue;
    const text = plain(q.q); if (!text || /[<>&]/.test(text) || text.length > 88 || seen.has(text)) continue;
    const ok = q.o.find(o => o.ok), wr = q.o.filter(o => !o.ok);
    if (!ok || wr.length < 2) continue;
    const vals = [ok.v, wr[0].v, wr[1].v].map(v => plain(v));
    if (vals.some(v => !v || v.length > 24 || /[<>&]/.test(v)) || new Set(vals).size !== 3) continue;
    const order = shuffle([0, 1, 2], rnd), opts = order.map(i => vals[i]), okIdx = order.indexOf(0);
    const hint = Array.isArray(q.hint) && q.hint[0] ? cut(plain(q.hint[0]), 86) : "Đọc kỹ đề, làm từng bước rồi thử lại nhé.";
    const en = subj === "tanh" && vals.every(v => /^[\x20-\x7E]+$/.test(v) && /[A-Za-z]/.test(v));
    seen.add(text); out.push({ text, opts, ok: okIdx, hint, en });
  }
  return out;
}

const done = [], skip = [];
for (const subj of Object.keys(C.subjects)) for (const g of C.subjects[subj].grades) {
  if (g.grade < 2) continue;
  for (const t of g.topics) {
    const file = path.join(DIR, t.id + ".js");
    if (fs.existsSync(file) && !fs.readFileSync(file, "utf8").includes(MARK)) continue;   /* bài viết tay: giữ nguyên */
    const skills = E.topicSkills(subj, g.grade, t.id), ex = EXTRA[t.id];
    if (!skills.length && !ex) { skip.push(subj + " lớp " + g.grade + " " + t.id + " " + t.name + " (chưa có kỹ năng)"); continue; }
    const rnd = rngFor(t.id), T = TEACH[t.id];
    const mk = (r) => { const order = shuffle([0, 1, 2], rnd), o = [r[1], r[2], r[3]]; return { text: r[0], opts: order.map(i => o[i]), ok: order.indexOf(0), hint: r[4], yes: r[5] || ("Đúng rồi! Đáp án là " + r[1] + "."), art: r[6] || "", en: subj === "tanh" && o.every(v => /^[\x20-\x7E]+$/.test(v) && /[A-Za-z]/.test(v)) }; };
    let qs;
    if (T && T.qs.length >= 6) qs = T.qs.map(mk);
    else if (ex) qs = ex.qs.map(([text, o, hint]) => { const order = shuffle([0, 1, 2], rnd); return { text, opts: order.map(i => o[i]), ok: order.indexOf(0), hint, en: false }; });
    else qs = pickQuestions(subj, g.grade, skills, rnd, 6);
    if (qs.length < 5) { skip.push(t.id + ": chỉ có " + qs.length + " câu phù hợp"); continue; }
    const say = T ? T.say : null, sub = say ? say.map(x => x[0]) : (ex ? ex.say : (t.sub || []).map(s => cut(s, 88)).filter(Boolean)), art = t.icon || "📘";
    const screens = [];
    if (say) say.forEach(x => screens.push({ k: "say", t: x[0], art: x[1] || art }));
    else { screens.push({ k: "say", t: cut("Hôm nay mình học: " + t.name + ".", 88), art }); sub.slice(0, 2).forEach(s => screens.push({ k: "say", t: s, art })); }
    qs.slice(0, 3).forEach(q => { const s = { k: "choose", t: q.text, opts: q.opts, ok: q.ok, yes: q.yes || cut("Đúng rồi! Đáp án là " + q.opts[q.ok] + ".", 88), no: q.hint }; if (q.art) s.art = q.art; if (q.en) s.optlang = "en"; screens.push(s); });
    const pts = ((T && T.sum) || (ex ? ex.sum : sub)).slice(0, 3); while (pts.length < 2) pts.push(["Đọc kỹ đề rồi làm từng bước", "Sai thì thử lại, em sẽ giỏi hơn!"][pts.length]);
    screens.push({ k: "sum", t: "Em nhớ nhé!", pts });
    const tryit = qs.slice(3, 6).map(q => { const o = { q: q.text, opts: q.opts, ok: q.ok, hint: q.hint, yes: q.yes || "Đúng rồi!" }; if (q.art) o.art = q.art; if (q.en) o.optlang = "en"; return o; });
    const body = "/* " + MARK + " · " + (subj === "toan" ? "Toán" : subj === "tviet" ? "Tiếng Việt" : "Tiếng Anh") + " lớp " + g.grade + " · " + t.name + ".\n   Lắp từ scripts/learn/lesson-teach.js (lời giảng soạn tay) hoặc chương trình + ngân hàng câu hỏi (scripts/learn/gen-lessons-draft.js). */\n" +
      "window.LearnLessons.reg(" + JSON.stringify({ id: t.id, grade: g.grade, subj, title: cut(t.name, 58), screens, tryit }, null, 2) + ");\n";
    fs.writeFileSync(file, body); done.push(t.id);
  }
}
console.log("✓ đã sinh " + done.length + " bài nháp" + (skip.length ? "\n! bỏ qua " + skip.length + ":\n  " + skip.join("\n  ") : ""));
