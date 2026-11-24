/* BỘ MÁY HỌC (thuần, không chạm DOM; chạy được trong trình duyệt và Node để kiểm thử).
   - Câu hỏi theo KỸ NĂNG: số học sinh bằng thuật toán, phần còn lại lấy từ learn/content/bank.js.
   - Mỗi đáp án sai gắn một MÃ LỖI TƯ DUY (TAGS) để biết bé hổng ở đâu.
   - Tiến độ lưu máy (localStorage "learn:m:<môn>"): n, ok, p (độ chính xác gần đây), tags (lỗi theo kỹ năng).
   - planRound(): chọn kỹ năng cho vòng 5 câu: khởi động dễ, ưu tiên kỹ năng yếu / hay sai, tránh lặp, có ôn lớp dưới.
   Không dùng AI lúc chạy. Xem plan-learn.md mục 0.2–0.5; kiểm thử: node scripts/learn/check-bank.js
   Cấu trúc: learn/engine/*.js là các phần (core, gen-*, topics, progress, round, report); tệp này NỐI chúng theo thứ tự rồi xuất API cũ.
   Trình duyệt: mỗi phần nạp bằng một thẻ <script> TRƯỚC engine.js (LearnEngineParts); Node: engine.js tự require. */
(function (root) {
  "use strict";
  var NAMES = ["core", "gen-arith", "gen-geo", "gen-measure", "gen-fraction", "gen-g5", "topics", "progress", "round", "report"];
  var parts = root.LearnEngineParts || {}, EP = {};
  NAMES.forEach(function (n) {
    var part = parts[n] || (typeof require !== "undefined" ? require("./engine/" + n + ".js") : null);
    if (!part) throw new Error("Thiếu phần engine/" + n + ".js");
    part(EP);
  });
  var G = EP.G, SK = EP.SK, TOPIC = EP.TOPIC, TAGS = EP.TAGS, SKLAB = EP.SKLAB, TRACKED = EP.TRACKED;

  /* các bộ sinh/dữ liệu bổ sung đăng ký thêm vào G, SK, TOPIC, SKLAB */
  var LS = root.LearnLangSkills || (typeof require !== "undefined" ? (function () { try { return require("./lang-skills.js"); } catch (e) { return null; } })() : null);
  if (LS) LS({ mk: EP.mk, rnd: EP.rnd, shuf: EP.shuf, G: G, SK: SK, TOPIC: TOPIC, TAGS: TAGS, SKLAB: SKLAB, TRACKED: TRACKED });
  /* Toán lớp 5 bổ sung (biểu đồ quạt SVG, hỗn số): learn/content/math5.js (nạp trước engine trong trình duyệt, require trong Node) */
  var M5 = root.LearnMath5 || (typeof require !== "undefined" ? (function () { try { return require("./content/math5.js"); } catch (e) { return null; } })() : null);
  if (M5) M5({ mk: EP.mk, mkn: EP.mkn, rnd: EP.rnd, pk: EP.pk, gcd: EP.gcd, VI: EP.VI, G: G, SK: SK, TOPIC: TOPIC, SKLAB: SKLAB });
  /* gợi ý tĩnh theo kỹ năng: learn/hint-texts.js (nạp trước engine trong trình duyệt) */
  EP.HTX = root.LearnHintTexts || (typeof require !== "undefined" ? (function () { try { return require("./hint-texts.js"); } catch (e) { return null; } })() : null);
  var E = {
    TAGS: TAGS, SKILLS: SK, TRACKED: TRACKED, make: EP.make, round: EP.round, planRound: EP.planRound, weakSkills: EP.weakSkills, record: EP.record,
    level: EP.level, summary: EP.summary, mastery4: EP.mastery4, M4: EP.M4, goals: EP.goals, detailOn: EP.detailOn, setDetail: EP.setDetail,
    clearDetail: EP.clearDetail, noteHint: EP.noteHint, dayDetail: EP.dayDetail, daily: EP.daily, resetAll: EP.resetAll, dayKey: EP.dayKey,
    toSchema: EP.toSchema, topicOf: EP.topicOf,
    use: EP.use, setRng: EP.setRng, setBank: EP.setBank, load: EP.load,
    skillsFor: function (subj, grade) { return EP.candidates(subj, grade); },
    topicSkills: function (subj, grade, topic) {
      return EP.candidates(subj, grade).filter(function (c) { return !c.review && EP.topicOf(c.id, grade) === topic; }).map(function (c) { return c.id; });
    }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = E; else root.LearnEngine = E;
})(typeof window !== "undefined" ? window : globalThis);
