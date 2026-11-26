/* Cảnh THỬ THÁCH: dựng 5 câu CÙNG CÁCH trang kiểm tra cũ (learn/js/round.js): LearnEngine.round(môn, lớp, {topic, n:5}) rồi LearnTypes.mix (trộn kiểu câu),
   lớp 1-2 đưa câu ít chữ nhất lên đầu. Gợi ý theo bậc lấy từ câu (b.hint) hoặc LearnHint (phép tính); không bao giờ nêu đáp án. */
(function (root) {
  "use strict";
  var K = root.StoryCore, E = root.LearnEngine, LT = root.LearnTypes;
  function build(subj, grade, lang, topic) {
    var base = E.round(subj, grade, { lang: lang, n: 5, topic: topic }), bank = base;
    var qk = (K.q.get("qk") || "").split(",").filter(Boolean);   /* ?qk=tf,match,... xem thử từng kiểu câu (chỉ để duyệt) */
    if (LT && qk.length) bank = base.map(function (x, i) { var k = qk[i % qk.length];
      return (k === "pop" ? LT.asPop(x, lang) : k === "typein" ? LT.asTypein(x, lang) : LT.make(k, subj, grade, lang)) || x; });
    else if (LT) { try { bank = LT.mix(base.slice(0, 5), subj, grade, lang, 3); } catch (e) { bank = base; } }
    if (grade <= 2 && bank.length > 1) {
      var load = function (b) { return String(b.q || "").replace(/<[^>]+>/g, "").replace(/\p{Extended_Pictographic}/gu, "").length; };
      var k = bank.reduce(function (m, b, i) { return load(b) < load(bank[m]) ? i : m; }, 0); if (k > 0) bank = [bank[k]].concat(bank.filter(function (x, i) { return i !== k; }));
      if (grade === 1 && bank.length > 3) {
        var head = bank.map(function (b, i) { return { b: b, i: i, l: load(b) }; }).sort(function (a, c) { return a.l - c.l || a.i - c.i;
          }).slice(0, 3).sort(function (a, c) { return a.i - c.i; }).map(function (o) { return o.b; });
        bank = head.concat(bank.filter(function (b) { return head.indexOf(b) < 0; }));
      }
    }
    return bank;
  }
  function plainHtml(h) { return String(h).replace(/<pre[\s\S]*?<\/pre>/g, " ").replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); }
  /* gợi ý bậc `level` (0,1,...) hoặc "" nếu không có: chữ thường, không thẻ HTML */
  function hint(b, lang, level) {
    var st = null;
    try { if (root.LearnHint && (!b.kind || b.kind === "typein")) { var p = root.LearnHint.parse(String(b.q).replace(/<br>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
      st = p ? root.LearnHint.steps(p, lang) : null; } } catch (e) { st = null; }
    if (!st && b.hint && b.hint.length && (!b.kind || b.kind === "typein")) st = b.hint;
    if (!st) return "";
    var s = st[Math.min(level, 1)]; return s ? plainHtml(s) : "";
  }
  root.SceneBank = { build: build, hint: hint };
})(window);
