/* HUY HIỆU lớp 3–5 (Học Vui): mốc rõ ràng, luôn nói "còn X nữa". Hai loại:
   (1) MỐC CHĂM CHỈ: số ngày học, số câu đã làm, số sao, số ngày học liền (theo từng chặng);
   (2) HUY HIỆU CHỦ ĐỀ: mỗi chủ đề lớp 3–5 (content/badges-g35.js) mở khi bé qua kiểm tra chủ đề >= 3 sao (LearnPath.get(...).b).
   Chỉ so với chính mình. API: milestones(stats) -> [{ id, grp, ic, name, need, cur, got }]; next(list) -> chặng tiếp theo của mỗi nhóm;
        topics(getRec, grade?) -> [{ id, s, g, name, topic, ic, b, l, got }]; topicHint(t) -> { text, short }. Dùng được trong Node (kiểm). */
(function (root) {
  "use strict";
  var TIERS = [
    { grp: "days", ic: "📅", at: [5, 10, 20, 40, 80], name: function (n) { return n + " ngày học"; }, k: "days" },
    { grp: "q", ic: "🎯", at: [100, 300, 600, 1000, 2000], name: function (n) { return n + " câu đã làm"; }, k: "questions" },
    { grp: "stars", ic: "⭐", at: [50, 150, 300, 600, 1000], name: function (n) { return n + " sao"; }, k: "stars" },
    { grp: "run", ic: "🔥", at: [3, 5, 7, 14, 30], name: function (n) { return n + " ngày học liền"; }, k: "ds" }
  ];
  var SN = { toan: "Toán", tviet: "Tiếng Việt", tanh: "Tiếng Anh" };
  function milestones(st) {
    var out = []; st = st || {};
    TIERS.forEach(function (t) { t.at.forEach(function (n) { var cur = st[t.k] | 0; out.push({ id: t.grp + n, grp: t.grp, ic: t.ic, name: t.name(n), need: n,
      cur: Math.min(cur, n), raw: cur, got: cur >= n }); }); });
    return out;
  }
  function next(list) {   /* mỗi nhóm lấy chặng chưa đạt đầu tiên */
    var seen = {}, out = []; list.forEach(function (m) { if (!m.got && !seen[m.grp]) { seen[m.grp] = 1; out.push(m); } }); return out;
  }
  function topics(getRec, grade) {
    var L = root.LEARN_BADGES35 || [];
    return L.filter(function (t) { return !grade || t.g === grade; }).map(function (t) {
      var r = getRec ? getRec(t.g, t.s, t.id) || {} : {};
      return { id: t.id, s: t.s, g: t.g, name: t.name, topic: t.topic, ic: t.ic, b: r.b | 0, l: r.l ? 1 : 0, got: (r.b | 0) >= 3 };
    });
  }
  function topicHint(t) {
    var where = SN[t.s] + " lớp " + t.g + ", chủ đề “" + t.topic + "”";
    if (t.got) return { text: "Đã đạt: qua kiểm tra " + where + " với " + t.b + " sao.", short: "Đã đạt" };
    var st = t.b > 0 ? "Hiện đang " + t.b + "/3 sao, còn " + (3 - t.b) + " sao nữa." : t.l ? "Bạn đã học bài, giờ làm kiểm tra chủ đề." : "Học bài rồi làm kiểm tra chủ đề.";
    return { text: "Qua kiểm tra " + where + " đạt từ 3 sao để mở. " + st, short: t.b > 0 ? t.b + "/3 sao" : t.l ? "Đã học, chưa kiểm tra" : "Qua kiểm tra 3 sao" };
  }
  var api = { TIERS: TIERS, SN: SN, milestones: milestones, next: next, topics: topics, topicHint: topicHint };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.LearnBadges = api;
})(typeof window !== "undefined" ? window : globalThis);
