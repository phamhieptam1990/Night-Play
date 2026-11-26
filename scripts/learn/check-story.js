/* Kiểm LỚP TRUYỆN (learn/story/): node scripts/learn/check-story.js
   (1) 71 chủ đề đều chạy được: truyện (viết sẵn hoặc mặc định) đủ 6 trường, đường đi dựng được ở mọi trạng thái tiến độ, cả dọc lẫn ngang.
   (2) Dữ liệu viết sẵn: đủ vi và en, mỗi chuỗi <= 120 ký tự, không từ cấm (bộ khung truyện mục 4 + LearnSafe), id chủ đề đúng môn/lớp.
   (3) 15 tệp learn/story/data/<môn>-g<lớp>.js đúng tên, không tệp thừa. (4) Tệp tay viết trong learn/story/ không vượt giới hạn dòng. */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "../../learn"), S = path.join(ROOT, "story");
let bad = 0; const fail = (m) => { bad++; if (bad <= 60) console.log("✗", m); };
const load = (f, ctx) => vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f });
const base = vm.createContext({ window: null, console }); base.window = base;
load(path.join(ROOT, "content/curriculum.js"), base);
load(path.join(ROOT, "content/safe-words.js"), base);
load(path.join(S, "js/story-default.js"), base);
load(path.join(S, "js/route.js"), base);
const C = base.LEARN_CURRICULUM, Safe = base.LearnSafe, Def = base.StoryDefault, Route = base.StoryRoute;
const SUBJ = ["toan", "tviet", "tanh"], FIELDS = ["title", "intro", "fork", "learn", "test", "end"], MAX = 120;
const BAN = /(sai rồi|ngốc|dở\b|kém|chậm chạp|hết giờ|kẻo mất|nhanh lên|đừng bỏ|ma quỷ|quỷ|máu|chết|giết|đánh nhau|sợ hãi|zalo|facebook|youtube|tiktok|http|www\.|@|tên (của )?bé|trường của|địa chỉ|số điện thoại|wrong answer|stupid|you will lose|kill|blood|dead|scary|monster|ghost)/i;

const NODE_KINDS = ["intro", "fork", "learn", "test", "end"], NODE_BAN = /(học|bài|kiểm tra|(?<![\p{L}])thi(?![\p{L}])|quiz|lesson|(?<![\p{L}])test(?![\p{L}])|exam)/iu;
let noNodes = 0;

/* (3) tên tệp dữ liệu */
const want = []; SUBJ.forEach((s) => [1, 2, 3, 4, 5].forEach((g) => want.push(s + "-g" + g + ".js")));
const have = fs.existsSync(path.join(S, "data")) ? fs.readdirSync(path.join(S, "data")) : [];
want.forEach((f) => { if (!have.includes(f)) fail("thiếu tệp data/" + f); });
have.forEach((f) => { if (!want.includes(f)) fail("tệp data lạ (sai tên): " + f); });

/* đọc dữ liệu từng tệp (mỗi tệp một sandbox để biết chủ đề thuộc tệp nào) */
const written = {};
want.filter((f) => have.includes(f)).forEach((f) => {
  const ctx = vm.createContext({ window: null }); ctx.window = ctx;
  try { load(path.join(S, "data", f), ctx); } catch (e) { return fail(f + ": lỗi chạy tệp: " + e.message); }
  const m = f.match(/^(\w+)-g(\d)\.js$/), subj = m[1], g = +m[2];
  const ids = new Set(C.subjects[subj].grades.filter((x) => x.grade === g)[0].topics.map((t) => t.id));
  const L = ctx.LearnStories || {};
  Object.keys(L).forEach((id) => {
    if (!ids.has(id)) fail(f + ": id chủ đề không thuộc " + subj + " lớp " + g + ": " + id);
    written[id] = L[id]; check(id, L[id]);
  });
  ids.forEach((id) => { if (!L[id]) console.log("  (chưa có dữ liệu, dùng truyện mặc định)", f, id); });
});
function two(id, k, o) {
  if (!o || typeof o !== "object" || !o.vi || !o.en) return fail(id + "." + k + ": thiếu vi hoặc en");
  ["vi", "en"].forEach((l) => {
    const t = o[l];
    if (typeof t !== "string" || !t.trim()) return fail(id + "." + k + "." + l + ": rỗng");
    if (t.length > MAX) fail(id + "." + k + "." + l + ": dài " + t.length + " > " + MAX);
    if (BAN.test(t)) fail(id + "." + k + "." + l + ": từ cấm: " + t);
    if (Safe && !Safe.check(t).ok) fail(id + "." + k + "." + l + ": LearnSafe chặn (" + Safe.check(t).why + "): " + t);
  });
}
/* tên điểm dừng (nodes): đủ vi/en, <= 18 ký tự, không chữ học/bài/kiểm tra/thi/quiz/lesson/test (bé phải thấy mình đang KHÁM PHÁ) */
function nodeName(id, k, o, strict) {
  ["vi", "en"].forEach((l) => {
    const t = o && o[l];
    if (typeof t !== "string" || !t.trim()) return fail(id + ".nodes." + k + "." + l + ": thiếu");
    if (t.length > 18) fail(id + ".nodes." + k + "." + l + ": dài " + t.length + " > 18: " + t);
    if (NODE_BAN.test(t)) fail(id + ".nodes." + k + "." + l + ": có chữ cấm (học/bài/kiểm tra/thi/quiz/lesson/test): " + t);
    if (Safe && !Safe.check(t).ok) fail(id + ".nodes." + k + "." + l + ": LearnSafe chặn: " + t);
  });
}
function check(id, d, skipNodes) {
  FIELDS.forEach((k) => two(id, k, d[k]));
  Object.keys(d).forEach((k) => { if (!FIELDS.includes(k) && k !== "nodes") fail(id + ": trường lạ " + k); });
  if (skipNodes) return;
  if (!d.nodes) noNodes++; else { NODE_KINDS.forEach((k) => nodeName(id, k, d.nodes[k])); Object.keys(d.nodes).forEach((k) => { if (!NODE_KINDS.includes(k)) fail(id + ".nodes: khoá lạ " + k); }); }
}
NODE_KINDS.forEach((k) => nodeName("mặc định", k, Def.NODES[k]));
{ /* chữ giao diện (T trong core.js) cũng không được có chữ cấm */
  const src = fs.readFileSync(path.join(S, "js/core.js"), "utf8"), m = src.match(/var T = \{[\s\S]*?\n  \};/);
  const strs = (m ? m[0] : "").match(/"[^"]+"/g) || [];
  strs.forEach((t) => { if (NODE_BAN.test(t) && !/Lớp truyện|Class map/.test(t)) fail("core.js T: chữ cấm trên bản đồ: " + t); });
}

/* (1) 71 chủ đề chạy được */
let n = 0;
const stub = (o) => ({
  get: () => ({ l: o.l, t: o.t, b: o.b, r: 0 }), hasLesson: () => o.hl, hasTest: () => o.ht, unlocked: () => o.unl
});
SUBJ.forEach((s) => C.subjects[s].grades.forEach((gr) => gr.topics.forEach((t) => {
  n++;
  const d = written[t.id] || {}, def = Def.make(s, t.name), merged = {};
  FIELDS.forEach((k) => { merged[k] = d[k] && d[k].vi ? d[k] : def[k]; });
  check(t.id + "(đầy đủ)", merged, true);
  let c = 0;
  [0, 1].forEach((l) => [0, 1, 2].forEach((tt) => [0, 2, 3, 5].forEach((b) => [0, 1].forEach((hl) => [0, 1].forEach((ht) => [0, 1].forEach((unl) => ["p", "l"].forEach((o) => {
    try {
      const r = Route.build(stub({ l, t: tt, b, hl: !!hl, ht: !!ht, unl: !!unl }), s, gr.grade, t, !!l, o);
      if (!r.nodes.length || !r.nodes.every((x) => x.pos && x.pos[0] >= 0 && x.pos[0] <= 100 && x.pos[1] >= 0 && x.pos[1] <= 100)) throw new Error("vị trí lạ");
      if (!!hl && !!ht !== r.full) throw new Error("ngã rẽ sai: chỉ khi có cả bài học lẫn kiểm tra");
      if (!ht && r.nodes.some((x) => x.kind === "fork")) throw new Error("chủ đề không kiểm tra mà có ngã rẽ");
      if (unl && !r.cur) throw new Error("mở khoá mà không có điểm hiện tại"); c++;
    } catch (e) { fail(t.id + ": dựng đường lỗi: " + e.message); }
  })))))));
})));
console.log("chủ đề:", n, "(cần 71)");
if (noNodes) console.log("⚠ cảnh báo: " + noNodes + " chủ đề chưa có trường nodes (dùng tên khám phá mặc định)"); if (n !== 71) fail("số chủ đề " + n + " khác 71");

/* (4) cỡ tệp tay viết */
const lim = { ".html": 300, ".js": 400, ".css": 400 };
(function walk(d) {
  fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== "art" && e.name !== "data") walk(p); return; }
    const x = path.extname(e.name); if (!lim[x]) return;
    const lines = fs.readFileSync(p, "utf8").split("\n"); if (lines.length > lim[x]) fail(path.relative(ROOT, p) + ": " + lines.length + " dòng > " + lim[x]);
    lines.forEach((l, i) => { if (l.length > 230) fail(path.relative(ROOT, p) + ":" + (i + 1) + ": dòng dài " + l.length); });
  });
})(S);
if (bad) { console.log("\n✗ có " + bad + " lỗi"); process.exit(1); }
console.log("✓ Lớp truyện: 71 chủ đề chạy được, dữ liệu đúng, 15 tệp đúng tên");
