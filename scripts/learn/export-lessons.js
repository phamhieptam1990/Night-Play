#!/usr/bin/env node
/* Xuất toàn bộ bài học Học Vui theo từng lớp ra Markdown để chủ site duyệt.
   Chạy: node scripts/learn/export-lessons.js [thư-mục-ra]   (mặc định docs/duyet-bai-hoc/lop-N.md). Chỉ đọc, không sửa bài. */
"use strict";
const fs = require("fs"), path = require("path");
const DIR = path.join(__dirname, "../../learn/content/lessons");
const OUT = path.resolve(process.argv[2] || path.join(__dirname, "../../docs/duyet-bai-hoc"));
const reg = []; global.window = { LearnLessons: { reg: o => reg.push(o) } };
fs.readdirSync(DIR).filter(f => /^(g\d|VI-|EN-).*\.js$/.test(f)).sort().forEach(f => require(path.join(DIR, f)));
global.window = undefined;
global.window = {}; require("../../learn/content/curriculum.js"); const C = global.window.LEARN_CURRICULUM;
const SUBJ = { toan: "Toán", tviet: "Tiếng Việt", tanh: "Tiếng Anh" };
const opts = (o, ok) => (o || []).map((x, i) => (i === ok ? "**" + x + "** ✔" : x)).join(" · ");
function screen(s, i) {
  const L = ["- **" + (i + 1) + ". [" + s.k + "]** " + (s.t || s.q || "") + (s.art ? "  _(hình: " + s.art + ")_" : "")];
  if (s.opts) L.push("  - Đáp án: " + opts(s.opts, s.ok));
  if (s.pts) s.pts.forEach(p => L.push("  - • " + p));
  if (s.yes) L.push("  - Khen: " + s.yes); if (s.no) L.push("  - Gợi ý khi sai: " + s.no);
  const rest = Object.keys(s).filter(k => !/^(k|t|q|art|opts|ok|pts|yes|no)$/.test(k));
  if (rest.length) L.push("  - Khác: `" + JSON.stringify(Object.fromEntries(rest.map(k => [k, s[k]]))) + "`");
  return L.join("\n");
}
function tryit(x, i) {
  const L = ["- **T" + (i + 1) + ".** " + (x.q || x.t || JSON.stringify(x))];
  if (x.opts) L.push("  - Đáp án: " + opts(x.opts, x.ok));
  if (x.hint) L.push("  - Gợi ý: " + x.hint); if (x.yes) L.push("  - Khen: " + x.yes);
  return L.join("\n");
}
fs.mkdirSync(OUT, { recursive: true });
const idx = ["# Duyệt bài học Học Vui", "", "Sinh bởi `node scripts/learn/export-lessons.js`. Đánh dấu ✔ là đáp án đúng.", ""];
for (let g = 1; g <= 5; g++) {
  const md = ["# Lớp " + g + " — bài học Học Vui", ""]; let n = 0, miss = [];
  Object.keys(C.subjects).forEach(sj => {
    const G = C.subjects[sj].grades.find(x => x.grade === g); if (!G) return;
    md.push("## " + (SUBJ[sj] || sj), "");
    G.topics.forEach(t => {
      const l = reg.find(x => x.id === t.id);
      md.push("### " + t.id + " · " + t.name, "");
      if (!l) { md.push("_Chưa có bài học (chỉ có trong chương trình)._", ""); miss.push(t.id); return; }
      n++; md.push("- [ ] Đã duyệt   Ghi chú: ", "", "**Màn học (" + (l.screens || []).length + "):**", "");
      (l.screens || []).forEach((s, i) => md.push(screen(s, i)));
      if ((l.tryit || []).length) { md.push("", "**Tự thử (" + l.tryit.length + "):**", ""); l.tryit.forEach((x, i) => md.push(tryit(x, i))); }
      md.push("");
    });
  });
  fs.writeFileSync(path.join(OUT, "lop-" + g + ".md"), md.join("\n"));
  idx.push("- [Lớp " + g + "](lop-" + g + ".md): " + n + " bài có nội dung" + (miss.length ? ", " + miss.length + " chủ đề chưa có bài" : ""));
}
fs.writeFileSync(path.join(OUT, "README.md"), idx.join("\n") + "\n");
console.log(idx.join("\n"));
