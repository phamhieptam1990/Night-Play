/* Kỹ năng Tiếng Việt + Tiếng Anh — bộ sinh câu NGHE (bé nghe giọng đọc rồi chọn).
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var G = L.G, pk = L.pk, fin = L.fin, vi = L.vi, W = L.W, rnd = L.rnd, numToWord = L.numToWord;
    var D = L.D;
    /* ---- NGHE: bé nghe giọng đọc rồi chọn (index.html phát bằng speak(); q.speak là câu cần đọc) ---- */
    function lis(q, speak, lang, pic) { q.listen = 1; q.speak = speak; q.speakLang = lang; if (pic) q.dk = "pic"; return q; }
    var LBTN = '<button type="button" class="lsn" aria-label="🔊">🔊</button>';
    G.vi_listen_word = function (cc) {
      var it = pk(D.letterStart), wr = D.letterStart.filter(function (x) { return x !== it; }).map(function (x) { return x[0]; });
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn hình đúng" : "Listen and pick the picture"), it[0], W(wr, "word")), it[1], "vi", true);
    };
    G.en_listen_word = function (cc) {
      var th = pk(cc.grade <= 2 ? ["body", "food", "animals", "family", "toys"] : Object.keys(D.themes)), it = pk(D.themes[th]),
          near = D.themes[th].filter(function (x) { return x !== it;
          }).map(function (x) { return x[0]; });
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn hình đúng" : "Listen and pick the picture"), it[0], W(near, "word")), it[1], "en", true);
    };
    G.en_listen_num = function (cc) {
      var n = cc.grade >= 3 ? pk([13, 14, 15, 16, 17, 18, 19, 30, 40, 50, 60, 70, 80, 90]) : rnd(1, cc.grade === 1 ? 10 : 20), wr = [n + 1, n - 1, n +
          10, n - 10, n + 2, n - 2, n >= 13 &&
          n <= 19 ? (n - 10) * 10 : (n >= 30 && n % 10 === 0 ? n / 10 + 10 : n + 3)].filter(function (x) { return x >= 1 && x <= 100 && x !== n; });
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn số đúng" : "Listen and pick the number"), String(n), W(wr.map(String), "word")), numToWord(n), "en", false);
    };
    G.en_listen_reply = function (cc) {
      var it = pk(D.greetings);
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn câu trả lời" : "Listen and choose the reply"), it[1], W(it[2], "word")), it[0], "en", false);
    };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["gen-listen"] = part;
})(typeof window !== "undefined" ? window : globalThis);
