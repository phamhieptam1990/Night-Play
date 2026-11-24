/* Kỹ năng Tiếng Việt + Tiếng Anh — tiện ích chung của bộ sinh câu (chốt 4 lựa chọn, danh sách đáp án nhiễu, nhãn).
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var c = L.c;
    var mk = c.mk, rnd = c.rnd, shuf = c.shuf, G = c.G, SK = c.SK, TOPIC = c.TOPIC, TAGS = c.TAGS, SKLAB = c.SKLAB, TRACKED = c.TRACKED;
    var pk = function (a) { return a[rnd(0, a.length - 1)]; };
    var vi = function (x) { return x.lang !== "en"; };
    ["word_class", "punct", "sent_type", "en_rule"].forEach(function (t) { if (TAGS.indexOf(t) < 0) TAGS.push(t); });
    /* chốt câu 4 lựa chọn: wr = [[giá trị, mã lỗi], …] (>= 3 giá trị khác nhau và khác đáp án) */
    function fin(q, ans, wr, lab) {
      var seen = {}, out = []; seen[ans] = 1;
      shuf(wr.slice()).forEach(function (w) { if (!seen[w[0]] && out.length < 3) { seen[w[0]] = 1; out.push(w); } });
      if (out.length < 3) throw new Error("thiếu đáp án nhiễu: " + q);
      return mk(q, ans, out, lab);
    }
    var W = function (arr, tag) { return arr.map(function (x) { return [x, tag]; }); };
    var em = function (t) { return "<em>" + t + "</em>"; };
    var fmtList = function (a) { return a.join(", "); };

    L.mk = mk; L.rnd = rnd; L.shuf = shuf; L.G = G; L.SK = SK; L.TOPIC = TOPIC; L.TAGS = TAGS; L.SKLAB = SKLAB; L.TRACKED = TRACKED; L.pk = pk;
        L.vi = vi; L.fin = fin; L.W = W; L.em = em; L.fmtList = fmtList;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["gen-base"] = part;
})(typeof window !== "undefined" ? window : globalThis);
