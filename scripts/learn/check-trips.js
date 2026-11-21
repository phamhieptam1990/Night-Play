/* Kiểm các chuyến truyện Học Vui: node scripts/learn/check-trips.js
   Cấu trúc đủ vi/en, độ dài lời, >= 4 kiểu khác nhau (mỗi kiểu <= 2 lần), kỹ năng/kiểu có thật, không từ cấm (bộ khung mục 4),
   onWrong không lộ đáp án, và THỬ CHƠI: mọi lớp 1-5 x vi/en sinh đủ 5 câu hợp lệ. */
"use strict";
const fs = require("fs"), path = require("path");
global.window = global;
const LT = require("../../learn/content/qtypes.js"), E = require("../../learn/engine.js"), Story = require("../../learn/story.js");
const DIR = path.join(__dirname, "../../learn/content/trips");
const SPEAKERS = ["bac-re", "mochi", "mam", "bibi", "ban-may"], SUBJ = ["toan", "tviet", "tanh"];
const BAN = /(sai rồi|ngốc|dở|kém|ngu|chậm chạp|hết giờ|kẻo mất|nhanh lên|đừng bỏ|ma |quỷ|máu|chết|giết|đánh|sợ hãi|zalo|facebook|youtube|http|www\.|@|mua |giá |tên (của )?bé|trường|địa chỉ|wrong answer|stupid|hurry|you will lose|kill|blood|dead)/i;
let bad = 0; const seen = new Set(); const fail = (id, m) => { bad++; const k = id + m; if (!seen.has(k) && seen.size < 40) { seen.add(k); console.log("✗", id + ":", m); } };

const idx = JSON.parse(fs.readFileSync(path.join(DIR, "index.json"), "utf8"));
const trips = [];
for (const t of idx.trips) {
  if (t.soon) { if (!t.title || !t.title.vi || !t.title.en) fail(t.id, "chuyến sắp có phải có title vi/en"); continue; }
  const f = path.join(DIR, t.id + ".json");
  if (!fs.existsSync(f)) { fail(t.id, "có trong index.json nhưng thiếu tệp"); continue; }
  const trip = JSON.parse(fs.readFileSync(f, "utf8")); trips.push(trip);
  if (trip.id !== t.id) fail(t.id, "id trong tệp khác index");
  if (trip.subject !== t.subject || trip.color !== t.color) fail(t.id, "subject/color khác index");
}
const two = (id, where, o, max, maxEn) => {
  if (!o || typeof o !== "object" || !o.vi || !o.en) return fail(id, where + ": thiếu vi hoặc en");
  if (o.vi.length > max) fail(id, where + ": vi dài " + o.vi.length + " > " + max);
  if (o.en.length > (maxEn || max)) fail(id, where + ": en dài " + o.en.length + " > " + (maxEn || max));
  if (BAN.test(o.vi) || BAN.test(o.en)) fail(id, where + ": có từ cấm: " + o.vi + " / " + o.en);
};
for (const trip of trips) {
  const id = trip.id;
  if (!SUBJ.includes(trip.subject)) fail(id, "subject lạ");
  if (!(trip.color >= 1 && trip.color <= 7)) fail(id, "color 1-7");
  two(id, "title", trip.title, 30);
  for (const k of ["intro", "outro"]) { const s = trip[k]; if (!s || !SPEAKERS.includes(s.speaker)) fail(id, k + ": speaker lạ"); else two(id, k, s.text, 90, 120); }
  if (!trip.scenes || trip.scenes.length !== Story.N) { fail(id, "phải đúng " + Story.N + " cảnh"); continue; }
  const kinds = {};
  trip.scenes.forEach((s, i) => {
    const w = "cảnh " + (i + 1);
    if (!SPEAKERS.includes(s.speaker)) fail(id, w + ": speaker lạ");
    two(id, w + ".narration", s.narration, 90, 120);
    for (const k of ["line", "onRight", "onWrong"]) two(id, w + "." + k, s[k], 40);
    const c = s.challenge || {};
    if (!c.skill || !(E.SKILLS[c.skill] && E.SKILLS[c.skill].subj === trip.subject)) fail(id, w + ": kỹ năng không có thật trong môn " + trip.subject + ": " + c.skill);
    else if (![1, 2, 3, 4, 5].every(g => E.SKILLS[c.skill].grades.includes(g))) fail(id, w + ": kỹ năng " + c.skill + " không có ở mọi lớp (truyện dùng chung mọi lớp)");
    if (!LT.KINDS[trip.subject].includes(c.kind)) fail(id, w + ": kiểu câu lạ " + c.kind);
    kinds[c.kind] = (kinds[c.kind] || 0) + 1;
    if (s.onWrong && /\b\d+\b/.test(s.onWrong.vi)) fail(id, w + ": onWrong có số (nghi lộ đáp án)");
  });
  if (Object.keys(kinds).length < 4) fail(id, "cần >= 4 kiểu câu khác nhau, đang có " + Object.keys(kinds).length);
  for (const k in kinds) if (kinds[k] > 2) fail(id, "kiểu " + k + " dùng " + kinds[k] + " lần (> 2)");
  if (!trip.reward || !trip.reward.seed || !trip.reward.badge) fail(id, "thiếu reward");
  /* thử chơi: mọi lớp, hai ngôn ngữ, nhiều lần */
  for (let g = 1; g <= 5; g++) for (const lang of ["vi", "en"]) for (let r = 0; r < 40; r++) {
    let qs; try { qs = Story.questions(trip, { E, LT, lang, grade: g }); } catch (e) { fail(id, "lớp " + g + " " + lang + ": " + e.message); break; }
    qs.forEach((q, i) => { if (!q || !q.q || q.scene !== i) fail(id, "lớp " + g + " câu " + (i + 1) + " thiếu nội dung");; });
  }
}
/* tiến độ + cầu vồng */
const mem = {}; global.localStorage = { getItem: k => mem[k] == null ? null : mem[k], setItem: (k, v) => { mem[k] = String(v); } };
if (Story.resumeAt("x") !== 0) fail("story", "resumeAt mặc định phải 0");
Story.rest("dao-so-01", 3); if (Story.resumeAt("dao-so-01") !== 3) fail("story", "rest/resumeAt");
const f1 = Story.finish("dao-so-01", 4); if (!f1.first || f1.seed !== 1) fail("story", "lần đầu xong phải thưởng hạt");
const f2 = Story.finish("dao-so-01", 5); if (f2.first || f2.seed) fail("story", "lần sau không thưởng lại");
if (Story.resumeAt("dao-so-01") !== 0) fail("story", "xong chuyến phải xóa điểm nghỉ");
if (Story.litColors(idx, Story.progress()) !== 0) fail("story", "màu 1 chưa đủ chuyến, chưa được sáng");
Story.finish("rung-chu-01", 3); if (Story.litColors(idx, Story.progress()) !== 1) fail("story", "xong mọi chuyến có sẵn của màu 1 thì sáng");
console.log(bad ? "✗ " + bad + " lỗi" : "✓ " + trips.length + " chuyến đạt (cấu trúc, độ dài, kiểu câu, chơi thử mọi lớp)");
process.exit(bad ? 1 : 0);
