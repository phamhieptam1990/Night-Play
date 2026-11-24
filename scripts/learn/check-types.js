/* Kiểm thử 10 kiểu câu hỏi: node scripts/learn/check-types.js */
"use strict";
const T = require("../../learn/content/qtypes.js");
let bad = 0, count = {};
const fail = (m, q) => { bad++; if (bad < 25) console.log("✗", m, JSON.stringify(q).slice(0, 200)); };
const val = (s) => { const m = String(s).match(/^(\d+) ([+−×÷]) (\d+)$/); if (!m) return Number(s); const a = +m[1], b = +m[3]; return m[2] === "+" ? a + b : m[2] === "−" ? a - b : m[2] === "×" ? a * b : a / b; };
for (const subj of ["toan", "tviet", "tanh"]) for (let g = 1; g <= 5; g++) for (const lang of ["vi", "en"]) for (const kind of T.kindsFor(subj, g)) for (let i = 0; i < 150; i++) {
  const q = T.make(kind, subj, g, lang); const id = subj + "/" + kind; count[id] = (count[id] || 0) + (q ? 1 : 0);
  if (!q) { fail("null", { subj, g, kind }); continue; }
  if (q.kind !== kind || !q.q || !q.lab || !q.speak) fail("thiếu trường", q);
  if (["tf", "pic", "odd", "compare", "count", "clock", "find", "dragfill"].includes(kind)) {
    const want = { tf: 2, pic: 4, odd: 4, compare: 3, count: 4, clock: 4, find: 9, dragfill: 4 }[kind];
    if (q.o.length !== want) fail("số lựa chọn", q);
    if (q.o.filter(x => x.ok).length !== 1) fail("phải đúng 1 đáp án", q);
    if (new Set(q.o.map(x => x.v)).size !== q.o.length) fail("lựa chọn trùng", q);
    if (kind === "tf" && subj === "toan") { const m = q.meta, t = val(m.a + " " + m.op + " " + m.b) === m.c; if (t !== m.truth || q.o[0].ok !== (t ? 1 : undefined)) fail("tf sai", q); }
    if (kind === "compare") { const m = q.meta, s = m.lv > m.rv ? ">" : m.lv < m.rv ? "<" : "="; if (q.o.find(x => x.ok).v !== s) fail("compare sai", q); }
  }
  if (kind === "order" || kind === "wordbuild") { if (!q.items || q.items.length < 3) fail("items", q); if (subj === "toan") { const n = q.items.map(Number), up = n[0] < n[1]; for (let k = 1; k < n.length; k++) if (up ? n[k] <= n[k - 1] : n[k] >= n[k - 1]) fail("order không đơn điệu", q); } }
  if (kind === "typein" && !/^\d+$/.test(q.ans)) fail("typein", q);
  if (kind === "count" && (q.n < 3 || q.n > 9 || q.o.find(x => x.ok).v !== String(q.n))) fail("count", q);
  if (kind === "clock") { const f = (h, m) => h + ":" + (m < 10 ? "0" : "") + m; if (q.o.find(x => x.ok).v !== f(q.h, q.m)) fail("clock", q); }
  if (kind === "numline") { if (q.target < q.min || q.target > q.max || (q.target - q.min) % q.step !== 0) fail("numline", q); }
  if (kind === "find" && subj === "toan") { const nums = q.o.map(x => Number(x.v)), t = q.o.find(x => x.ok); if (!t || (Number(t.v) !== Math.max(...nums) && Number(t.v) !== Math.min(...nums))) fail("find", q); }
  if (kind === "dragfill" && !/class="bl"/.test(q.q)) fail("dragfill thiếu chỗ trống", q);
  if (kind === "dragfill" && subj === "toan") { const m = q.q.replace(/<[^>]+>/g, "").match(/^(.+?) = (.+)$/); const ok = q.o.find(x => x.ok).v; const full = q.q.replace(/<em class="bl">__<\/em>/, ok).split(" = "); if (val(full[0]) !== Number(full[1])) fail("dragfill sai số", q); }
  if (kind === "sort") { if (q.items.length !== 6 || q.bins.length !== 2 || q.items.filter(x => x.bin === 0).length !== 3) fail("sort", q); if (subj === "toan" && g <= 2) q.items.forEach(x => { if ((Number(x.v) % 2 === 0) !== (x.bin === 0)) fail("sort chẵn lẻ", q); }); }
  if (kind === "memory" && (q.pairs.length !== 4 || new Set(q.pairs.map(p => p[0])).size !== 4 || new Set(q.pairs.map(p => p[1])).size !== 4)) fail("memory", q);
  if (kind === "match") { if (q.pairs.length !== 4 || new Set(q.pairs.map(p => p[0])).size !== 4 || new Set(q.pairs.map(p => p[1])).size !== 4) fail("match", q); }
  if (kind === "multi") { const n = q.opts.filter(o => o.ok).length; if (q.opts.length !== 6 || n < 2 || n > 3 || new Set(q.opts.map(o => o.v)).size !== 6) fail("multi", q); }
}
for (const subj of ["toan", "tviet", "tanh"]) for (let g = 1; g <= 5; g++) { const base = [1, 2, 3, 4, 5].map(() => ({ kind: "mc", o: [{ v: "1", ok: 1 }, { v: "2" }, { v: "3" }, { v: "4" }] })); const r = T.mix(base, subj, g, "vi", 3); const ks = r.map(x => x.kind); const nk = ks.filter(k => k !== "mc" && k !== "pop"), want = subj === "toan" && g >= 3 ? 2 : 3; if (ks.filter(k => k === "pop").length > 1) fail("nhiều hơn 1 pop", ks); if (ks[0] !== "mc" || nk.length !== want || new Set(nk).size !== want) fail("mix", ks); }
const EMO = /\p{Extended_Pictographic}/u;
for (const subj of ["tviet", "tanh"]) for (let g = 3; g <= 5; g++) { for (const k of ["pic", "wordbuild", "find"]) if (T.kindsFor(subj, g).includes(k)) fail("kiểu emoji-từ-vựng còn ở lớp " + g, { subj, k });
  for (let i = 0; i < 300; i++) for (const k of T.kindsFor(subj, g)) { const q = T.make(k, subj, g, "vi"); if (!q) continue; const txt = JSON.stringify([q.q, q.o, q.opts, q.pairs, q.items, q.bins]).replace(/<[^>]+>/g, ""); if (["tf", "odd", "multi", "sort", "match", "memory", "dragfill", "order"].includes(k) && EMO.test(txt)) { fail("emoji ở lớp " + g, q); break; } } }
console.log(Object.keys(count).map(k => k + ":" + count[k]).join("  "));
console.log(bad ? "✗ " + bad + " lỗi" : "✓ 10 kiểu câu hỏi đạt");
process.exit(bad ? 1 : 0);
