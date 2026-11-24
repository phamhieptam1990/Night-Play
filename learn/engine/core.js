/* Bộ máy học — Lõi: số ngẫu nhiên, trộn, tạo câu 4 lựa chọn (mk, mkn), định dạng số, biểu thức, ước chung.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var TAGS = ["off_by_one", "wrong_op", "place_value", "unit_convert", "formula_confuse", "order_ops", "read_chart", "concept_confuse",
        "pattern_miss", "forget_carry", "tens_error",
        "table_confuse", "carry_error", "add_denominator", "decimal_point", "percent_misread", "spelling", "tone", "meaning", "word", "grammar", "reading", "other"];
    EP.R0 = Math.random;
    function R() { return EP.R0(); }
    function rnd(a, b) { return a + Math.floor(R() * (b - a + 1)); }
    function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = rnd(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function bank() { return EP.BANK || root.LEARN_BANK || []; }

    /* ---- tạo câu hỏi 4 lựa chọn: wrongs = [[giá trị, mã lỗi], ...]; luôn đủ 4 lựa chọn khác nhau ---- */
    function mk(q, ans, wrongs, lab) {
      var seen = {}, o = [{ v: String(ans), ok: 1 }]; seen[String(ans)] = 1;
      wrongs.forEach(function (w) { var s = String(w[0]); if (!seen[s] && o.length < 4) { seen[s] = 1; o.push({ v: s, tag: w[1] }); } });
      var k = 1;
      while (o.length < 4 && k < 60) { var s2 = String(typeof ans === "number" ? ans + k * (k % 2 ? 1 : -1) * Math.ceil(k / 2) : ans + k); k++; if (
          !seen[s2] && !(typeof ans === "number" &&
          +s2 < 0)) { seen[s2] = 1; o.push({ v: s2, tag: "other" }); } }
      return { q: q, o: shuf(o), lab: lab };
    }
    var fmt = function (n, lang) { return lang === "vi" ? String(n).replace(".", ",") : String(n); };
    var VI = function (c) { return c.lang === "vi"; };
    function pk(a) { return a[rnd(0, a.length - 1)]; }
    function r2(n) { return Math.round(n * 1000) / 1000; }
    function mkn(q, ans, wrongs, c, unit) {
      var f = function (n) { return fmt(r2(n), c.lang) + (unit ? " " + unit : ""); }, ws = [], seen = {}, step = ans % 1 !== 0 ? .1 : 1;
      seen[f(ans)] = 1;
      wrongs.forEach(function (w) { var s = f(w[0]); if (isFinite(w[0]) && w[0] >= 0 && !seen[s] && ws.length < 3) { seen[s] = 1; ws.push([s, w[1]]); } });
      for (var k = 1; ws.length < 3 && k < 90; k++) { var v = r2(ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step), s2 = f(v); if (v >= 0 &&
          !seen[s2]) { seen[s2] = 1; ws.push([s2, "other"]); } }
      return mk(q, f(ans), ws);
    }
    function ev(t, prec) {   /* tính biểu thức [số, phép, số, …]: prec = nhân/chia trước, không = từ trái sang phải */
      var a = t.slice(), i, x, j, y;
      if (prec) for (i = 1; i < a.length;) { if (a[i] === "×" || a[i] === "÷") a.splice(i - 1, 3, a[i] === "×" ? a[i - 1] * a[i + 1] :
          a[i - 1] / a[i + 1]); else i += 2; }
      x = a[0]; for (j = 1; j < a.length; j += 2) { y = a[j + 1]; x = a[j] === "+" ? x + y : a[j] === "−" ? x - y : a[j] === "×" ? x * y : x / y; }
      return x;
    }
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  EP.setRng = function (f) { EP.R0 = f || Math.random; };
    EP.setBank = function (b) { EP.BANK = b; };
    EP.TAGS = TAGS; EP.rnd = rnd; EP.shuf = shuf; EP.bank = bank; EP.mk = mk; EP.fmt = fmt; EP.VI = VI; EP.pk = pk; EP.r2 = r2; EP.mkn = mkn;
    EP.ev = ev; EP.gcd = gcd; EP.R = R;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["core"] = part;
})(typeof window !== "undefined" ? window : globalThis);
