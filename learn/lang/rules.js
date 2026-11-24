/* Kỹ năng Tiếng Việt + Tiếng Anh — luật (độc lập với bài kiểm): đặt dấu thanh, số nhiều, số thành chữ.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var D = L.D;
    function nfc(s) { return s.normalize ? s.normalize("NFC") : s; }
    function applyTone(syl, mark) { /* mọi tiếng ở đây có đúng MỘT nguyên âm, mang dấu thanh */ var c = syl.charAt(0), v = syl.slice(1); return nfc(c + v + mark); }
    function enPlural(w) { if (D.irregularPlural[w]) return D.irregularPlural[w]; if (/(s|x|ch|sh)$/.test(w)) return w + "es"; if (/[^aeiou]y$/.test(
        w)) return w.slice(0, -1) + "ies"; return w + "s"; }
    function numToWord(n) { if (n <= 20) return D.numWords[n]; if (D.tensWords[n]) return D.tensWords[n]; var t = Math.floor(n / 10) * 10;
        return D.tensWords[t] + "-" + D.numWords[n - t]; }
    D.rules = { applyTone: applyTone, enPlural: enPlural, numToWord: numToWord };
    L.nfc = nfc; L.applyTone = applyTone; L.enPlural = enPlural; L.numToWord = numToWord;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["rules"] = part;
})(typeof window !== "undefined" ? window : globalThis);
