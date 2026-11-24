/* Kỹ năng Tiếng Việt + Tiếng Anh — bộ sinh câu Tiếng Anh.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var G = L.G, pk = L.pk, fin = L.fin, vi = L.vi, em = L.em, W = L.W, rnd = L.rnd, numToWord = L.numToWord, enPlural = L.enPlural, shuf = L.shuf;
    var D = L.D;
    /* ---- Tiếng Anh ---- */
    G.en_colors = function (cc) {
      var it = pk(D.colors), wr = D.colors.filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin((vi(cc) ? "Đây là màu gì? " : "What colour is this? ") + em(it[0]), it[1], W(wr, "word"));
    };
    G.en_numbers = function (cc) {
      var mx = cc.grade === 1 ? 10 : cc.grade === 2 ? 20 : 100, n = cc.grade >= 3 ? pk([11, 12, 13, 15, 18, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100,
          36, 47, 58, 99]) : rnd(1, mx), ans = numToWord(n), wr = [];
      if (cc.grade <= 2 && rnd(0, 1)) { var e = pk(["🍎", "⭐", "🐟", "🎈", "🌸"]), k = rnd(1, 10); var NM = { "🍎": ["quả táo", "apples"], "⭐":
          ["ngôi sao", "stars"], "🐟": ["con cá",
          "fish"], "🎈": ["quả bóng", "balloons"], "🌸": ["bông hoa", "flowers"] }[e]; var qq = fin((vi(cc) ? "Có bao nhiêu? " : "How many? ") + em(
              new Array(k + 1).join(e)), numToWord(k),
          W([k + 1, k - 1, k + 2, k + 3].filter(function (x) { return x >= 1 && x <= 12; }).map(numToWord), "off_by_one")); qq.speak = vi(cc) ?
              "Có mấy " + NM[0] + "?" : "How many " +
          NM[1] + " are there?"; return qq; }
      [n + 1, n - 1, n + 2, n - 2, n + 10, n - 10, n + 3].forEach(function (x) { if (x >= 1 && x <= 100) wr.push(numToWord(x)); });
      if (n >= 13 && n <= 19) wr.push(numToWord(n * 10 % 100 || 30));   /* thirteen ~ thirty */
      return fin((vi(cc) ? "Số " : "The number ") + em(n) + (vi(cc) ? " đọc là gì?" : " is…?"), ans, W(wr, "word"));
    };
    G.en_topic_vocab = function (cc) {
      var ts = cc.grade <= 2 ? ["body", "food", "animals", "family", "toys"] : cc.grade === 3 ? ["food", "clothes", "body", "school", "animals",
          "house"] : ["school", "weather", "transport",
          "clothes", "food", "nature", "house", "animals"], th = pk(ts), it = pk(D.themes[th]);
      var wr = D.themes[th].filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      Object.keys(D.themes).forEach(function (k) { if (k !== th) D.themes[k].forEach(function (x) { wr.push(x[1]); }); });
      var near = D.themes[th].filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin((vi(cc) ? "Đây là gì? " : "What is this? ") + em(it[0]), it[1], W(near.length >= 3 ? near : wr, "word"));
    };
    G.en_meaning = function (cc) {
      var it = pk(D.meanings), wr = D.meanings.filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin((vi(cc) ? "Từ " : "What does ") + em(it[0]) + (vi(cc) ? " nghĩa là gì?" : " mean?"), it[1], W(wr, "word"));
    };
    G.en_a_an = function (cc) {
      /* chọn cụm đúng cho MỘT từ: 1 đúng (a/an + từ), 3 sai (sai mạo từ và/hoặc thêm -s) → không còn đáp án nhiễu vô lý */
      var an = rnd(0, 1), w = an ? pk(D.anWords) : pk(D.aWords), art = an ? "an " : "a ", bad = an ? "a " : "an ", pl = enPlural(w);
      return fin((vi(cc) ? "Cụm nào viết đúng với từ " : "Which phrase is correct for ") + em("“" + w + "”") + "?", art + w, W([bad + w, art + pl, bad + pl], "en_rule"));
    };
    G.en_plural = function (cc) {
      var w = pk(D.plurals), ans = enPlural(w), base = w, wr = [w + "s", w + "es", w.replace(/y$/, "") + "ies", w + "en", w + "ren", w.replace(/y$/, "ys")];
      if (D.irregularPlural[w]) wr.push(w + "s", w + "es", w + "ren");
      return fin(em("one " + w + " → two __") + (vi(cc) ? "  (số nhiều)" : ""), ans, W(wr.filter(function (x) { return x !== base; }), "en_rule"));
    };
    G.en_present_s = function (cc) {
      var verb = pk(Object.keys(D.verbs)), forms = D.verbs[verb], third = cc.grade < 5 || rnd(0, 2) > 0, subj = third ? pk(D.subj3) : pk(D.subjPl),
          ans = third ? forms[0] : verb;
      var wr = third ? [[verb, "en_rule"], [forms[1], "en_rule"], [forms[2], "en_rule"]] : [[forms[0], "en_rule"], [forms[1], "en_rule"], [forms[2], "en_rule"]];
      return fin(em(subj + " __ (" + verb + ") every day."), ans, wr);
    };
    G.en_wh = function (cc) {
      var it = pk(D.wh);
      return fin(em(it[0]) + "<br>" + (vi(cc) ? "Trả lời: " : "Answer: ") + "“" + it[1] + "”", it[2], W(it[3], "en_rule"));
    };
    G.en_days = function (cc) {
      var useM = cc.grade >= 3 && rnd(0, 1), arr = useM ? D.months : D.days, i = rnd(0, arr.length - 1), nxt = arr[(i + 1) % arr.length], cur = arr[i];
      if (rnd(0, 1)) { var j = rnd(0, arr.length - 1); return fin((vi(cc) ? "Sau " : "What comes after ") + em(arr[j]) + (vi(cc) ? " là gì?" : "?"),
          arr[(j + 1) % arr.length], W(arr.filter(
          function (x) { return x !== arr[(j + 1) % arr.length] && x !== arr[j]; }), "word")); }
      var prev = arr[(i + arr.length - 1) % arr.length];
      return fin(em(prev + ", " + cur + ", __"), nxt, W(arr.filter(function (x) { return x !== nxt && x !== cur && x !== prev; }), "word"));
    };
    function misspell(w) {
      var out = [], s = w.replace(/ /g, "_"), i;
      for (i = 0; i < s.length - 1; i++) if (s.charAt(i) !== s.charAt(i + 1) && s.charAt(i) !== "_" && s.charAt(i + 1) !== "_") out.push(s.slice(0,
          i) + s.charAt(i + 1) + s.charAt(i) + s.slice(i + 2));
      for (i = 1; i < s.length; i++) if (s.charAt(i) !== "_") out.push(s.slice(0, i) + s.slice(i + 1));
      for (i = 0; i < s.length; i++) if (s.charAt(i) !== "_") out.push(s.slice(0, i) + s.charAt(i) + s.slice(i));
      var vv = "aeiou"; for (i = 0; i < s.length; i++) if (vv.indexOf(s.charAt(i)) >= 0) out.push(s.slice(0, i) + vv.charAt((vv.indexOf(s.charAt(i)) +
          1) % 5) + s.slice(i + 1));
      return out.map(function (x) { return x.replace(/_/g, " "); }).filter(function (x) { return x !== w; });
    }
    D.rules.misspell = misspell;
    G.en_spelling = function (cc) {
      var th = pk(Object.keys(D.themes)), it = pk(D.themes[th]), wr = shuf(misspell(it[1]));
      return fin((vi(cc) ? "Chọn cách viết đúng: " : "Pick the right spelling: ") + em(it[0]), it[1], W(wr.slice(0, 6), "spelling"));
    };
    G.en_greeting = function () {
      var it = pk(D.greetings);
      return fin(em("“" + it[0] + "”"), it[1], W(it[2], "word"));
    };
    G.en_reading = function (cc) {
      var pool = D.readEn.filter(function (x) { return x.g.indexOf(cc.grade) >= 0; }), it = pk(pool);
      return fin(it.t + "<br>" + em(it.q), it.a, W(it.d, "reading"));
    };

  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["gen-en"] = part;
})(typeof window !== "undefined" ? window : globalThis);
