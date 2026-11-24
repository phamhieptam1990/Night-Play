/* Bộ máy học — Bộ sinh bổ sung: phân số bằng nhau / so sánh / rút gọn, số La Mã, góc đo độ, tìm lỗi sai.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, VI = EP.VI, gcd = EP.gcd, mk = EP.mk, mkn = EP.mkn, pk = EP.pk, rnd = EP.rnd;

    /* ====== Toán bổ sung: phân số bằng nhau / so sánh / rút gọn, số La Mã, góc đo độ, tìm lỗi sai trong lời giải ====== */
    function fr(a, b) { return a + "/" + b; }
    function sameVal(a, b, c, d) { return a * d === b * c; }
    G.fraction_equiv = function (c) {
      var v = VI(c), t = rnd(0, c.grade >= 5 ? 3 : 2), b, a, k, wr, ans, q;
      if (t === 0) {   /* a/b = ?/(b×k) */
        b = pk([2, 3, 4, 5, 6]); a = rnd(1, b - 1); k = rnd(2, 5);
        return mkn(fr(a, b) + " = <em>?</em>/" + (b * k), a * k, [[a + k, "add_denominator"], [b * k, "concept_confuse"], [a * k + 1, "off_by_one"],
            [a, "concept_confuse"]], c);
      }
      if (t === 1) {   /* phân số nào bằng a/b */
        b = pk([2, 3, 4, 5]); a = rnd(1, b - 1); k = rnd(2, 4); ans = fr(a * k, b * k);
        wr = [[fr(a + k, b + k), "add_denominator"], [fr(a * k, b), "concept_confuse"], [fr(a, b * k), "concept_confuse"], [fr(a * k + 1, b * k),
            "off_by_one"], [fr(b, a),
            "concept_confuse"]].filter(function (x) { var m = x[0].split("/"); return !sameVal(+m[0], +m[1], a, b); });
        return mk((v ? "Phân số nào bằng " : "Which fraction equals ") + "<em>" + fr(a, b) + "</em>?", ans, wr.slice(0, 3));
      }
      if (t === 2) {   /* phân số lớn nhất (cùng tử hoặc cùng mẫu cho lớp 4, khác cho lớp 5) */
        var fs = [], tries = 0; while (fs.length < 4 && tries++ < 80) { var d = pk([3, 4, 5, 6, 8]), n = rnd(1, d - 1), x = fr(n, d), dupe = fs.some(
            function (y) { var m = y.split("/");
            return sameVal(+m[0], +m[1], n, d); }); if (!dupe) fs.push(x); }
        if (fs.length < 4) return G.fraction_equiv(c);
        var best = fs.reduce(function (m, x) { var p1 = x.split("/"), p2 = m.split("/"); return +p1[0] * +p2[1] > +p2[0] * +p1[1] ? x : m; });
        return mk((v ? "Phân số nào " : "Which fraction is the ") + "<em>" + (v ? "lớn nhất" : "biggest") + "</em>?", best, fs.filter(function (x) {
            return x !== best; }).map(function (x) {
            return [x, "concept_confuse"]; }));
      }
      /* rút gọn (lớp 5): chọn phân số tối giản a/b rồi nhân k */
      do { b = pk([3, 4, 5, 7, 8, 9]); a = rnd(1, b - 1); } while (gcd(a, b) !== 1); k = rnd(2, 6); ans = fr(a, b);
      wr = [[fr(a * k, b), "concept_confuse"], [fr(a, b * k), "concept_confuse"], [fr(a * k / (gcd(a * k, b * k) === k ? 1 : 1), b * k),
          "concept_confuse"], [fr(b, a), "concept_confuse"],
          [fr(a + 1, b), "off_by_one"]].filter(function (x) { return x[0] !== ans; });
      return mk((v ? "Rút gọn " : "Simplify ") + "<em>" + fr(a * k, b * k) + "</em>", ans, wr.slice(0, 3));
    };
    var RM = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    function roman(n) { var out = ""; RM.forEach(function (p) { while (n >= p[0]) { out += p[1]; n -= p[0]; } }); return out; }
    G.roman = function (c) {
      var v = VI(c), n = rnd(2, 20), r = roman(n), toNum = rnd(0, 1);
      if (toNum) return mkn((v ? "Số La Mã " : "Roman numeral ") + "<em>" + r + "</em>" + (v ? " là số nào?" : " is which number?"), n, [[n + 1,
          "concept_confuse"], [n - 1,
          "concept_confuse"], [n + 5, "concept_confuse"], [n - 5, "concept_confuse"]], c);
      var wr = [[roman(n + 1), "concept_confuse"], [roman(n - 1), "concept_confuse"], [roman(n + 5), "concept_confuse"], [roman(Math.max(1, n - 5)),
          "concept_confuse"], [r.replace("IV",
          "IIII").replace("IX", "VIIII"), "concept_confuse"]].filter(function (x) { return x[0] !== r; });
      return mk((v ? "Số " : "The number ") + "<em>" + n + "</em>" + (v ? " viết bằng số La Mã là?" : " in Roman numerals is?"), r, wr.slice(0, 3));
    };
    G.angle_measure = function (c) {
      var v = VI(c), t = rnd(0, c.grade >= 5 ? 3 : 2), a, b;
      if (t === 0) { var k = pk([["vuông", "right", 90], ["bẹt", "straight", 180]]); return mkn(v ? "Góc " + k[0] + " bằng bao nhiêu độ?" :
          "How many degrees is a " + k[1] + " angle?", k[2],
          [[k[2] === 90 ? 180 : 90, "concept_confuse"], [k[2] === 90 ? 45 : 360, "concept_confuse"], [k[2] === 90 ? 60 : 120, "concept_confuse"]], c, "°"); }
      if (t === 1) { a = rnd(2, 17) * 10; if (a === 90) a = 70; return mkn(v ? "Hai góc kề bù có tổng bằng 180°. Một góc là <em>" + a + "°</em>, góc còn lại là?" :
          "Two angles on a straight line add up to 180°. One is <em>" + a + "°</em>. The other is?", 180 - a, [[90 - a > 0 ? 90 - a : a + 10,
              "wrong_op"], [a, "wrong_op"], [360 - a,
          "wrong_op"], [180 + a, "wrong_op"]], c, "°"); }
      if (t === 2) { a = pk([30, 45, 60, 120, 135, 150, 75, 100]); var nm = a < 90 ? ["nhọn", "acute"] : ["tù", "obtuse"]; return mk((v ? "Góc " :
          "An angle of ") + "<em>" + a + "°</em>" + (
          v ? " là góc gì?" : " is?"), v ? "góc " + nm[0] : nm[1], (v ? [["góc vuông", "concept_confuse"], ["góc bẹt", "concept_confuse"], ["góc " + (
              a < 90 ? "tù" : "nhọn"),
          "concept_confuse"]] : [["right", "concept_confuse"], ["straight", "concept_confuse"], [a < 90 ? "obtuse" : "acute", "concept_confuse"]])); }
      a = rnd(3, 11) * 10; b = rnd(3, 11) * 10; while (a + b >= 170 || a + b <= 20) b = rnd(3, 11) * 10;
      return mkn(v ? "Tam giác có hai góc <em>" + a + "°</em> và <em>" + b + "°</em>. Tổng ba góc là 180°. Góc thứ ba là?" :
          "A triangle has angles <em>" + a + "°</em> and <em>" + b +
          "°</em>. The three angles add up to 180°. The third is?", 180 - a - b, [[a + b, "wrong_op"], [180 - a, "wrong_op"], [90 - a - b > 0 ?
              90 - a - b : a, "wrong_op"], [360 - a - b,
          "wrong_op"]], c, "°");
    };
    /* tìm lỗi trong lời giải cộng có nhớ: lời giải do bạn An viết, bé chỉ ra bước sai (hoặc "không sai") */
    G.find_error = function (c) {
      var v = VI(c), dg = c.grade <= 2 ? 2 : c.grade === 3 ? 3 : 4, a, b, tries = 0, da = [], db = [], i, carry = 0, steps = [], names = v ?
          ["đơn vị", "chục", "trăm", "nghìn"] : ["ones",
          "tens", "hundreds", "thousands"];
      do { a = rnd(Math.pow(10, dg - 1), Math.pow(10, dg) - 1); b = rnd(Math.pow(10, dg - 2) + 1, Math.pow(10, dg) - 1); } while ((a % 10) + (
          b % 10) < 10 && tries++ < 200);
      var bug = rnd(0, 2) ? rnd(0, dg - 1) : -1, kind = rnd(0, 1), shown = 0;   /* bug: bước sai (-1 = không sai); kind 0 = tính sai, 1 = quên số nhớ */
      if (bug === 0) kind = 0;
      for (i = 0; i < dg; i++) {
        var x = Math.floor(a / Math.pow(10, i)) % 10, y = Math.floor(b / Math.pow(10, i)) % 10, use = carry, res;
        if (i === bug && kind === 1 && carry === 0) kind = 0;
        if (i === bug && kind === 1) use = 0;   /* quên cộng số nhớ */
        res = x + y + use; if (i === bug && kind === 0) res += pk([1, -1]);
        if (res < 0) res = 0;
        var wr = res % 10, nc = res >= 10 ? 1 : 0;
        steps.push((v ? "Bước " + (i + 1) + " (" + names[i] + "): " : "Step " + (i + 1) + " (" + names[i] + "): ") + x + " + " + y + (use ? " + " +
            use : "") + " = " + res + (v ?
            " → viết " + wr + (nc ? ", nhớ 1" : "") : " → write " + wr + (nc ? ", carry 1" : "")));
        carry = nc;
      }
      var ans = bug < 0 ? (v ? "Không sai" : "No mistake") : (v ? "Bước " + (bug + 1) : "Step " + (bug + 1)), opts = []; for (i = 0; i < dg;
          i++) opts.push([v ? "Bước " + (i + 1) : "Step " +
          (i + 1), "other"]); opts.push([v ? "Không sai" : "No mistake", "other"]);
      return mk((v ? "Bạn An cộng " : "An adds ") + "<em>" + a + " + " + b + "</em><br>" + steps.join("<br>") + "<br><em>" + (v ?
          "An sai ở bước nào?" : "Where is the mistake?") + "</em>",
          ans, opts.filter(function (o) { return o[0] !== ans; }).slice(0, 3));
    };

    
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["gen-fraction"] = part;
})(typeof window !== "undefined" ? window : globalThis);
