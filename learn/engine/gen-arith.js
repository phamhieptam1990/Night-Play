/* Bộ máy học — Bộ sinh số học: cộng/trừ/nhân/chia, giá trị chữ số, làm tròn, so sánh, biểu thức, số chưa biết, phân số/thập phân cơ bản, toán đố.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var R = EP.R, VI = EP.VI, ev = EP.ev, fmt = EP.fmt, mk = EP.mk, mkn = EP.mkn, pk = EP.pk, r2 = EP.r2, rnd = EP.rnd, shuf = EP.shuf;

    /* ---- bộ sinh số học theo kỹ năng ---- */
    var G = {
      add10: function () { var a = rnd(1, 9), b = rnd(1, 10 - a), s = a + b; return mk(a + " + " + b + " = <em>?</em>", s, [[s + 1, "off_by_one"],
          [s - 1, "off_by_one"], [Math.abs(a - b),
          "wrong_op"], [s + 2, "off_by_one"]]); },
      sub10: function () { var s = rnd(2, 10), b = rnd(1, s - 1), a = s - b; return mk(s + " − " + b + " = <em>?</em>", a, [[a + 1, "off_by_one"],
          [a - 1, "off_by_one"], [s + b, "wrong_op"],
          [a + 2, "off_by_one"]]); },
      add20: function () { var a = rnd(3, 18), b = rnd(Math.max(2, 11 - a), 20 - a), s = a + b; return mk(a + " + " + b + " = <em>?</em>", s, [[s + 1,
          "off_by_one"], [s - 1, "off_by_one"],
          [Math.abs(a - b), "wrong_op"], [s + 2, "off_by_one"]]); },
      sub20: function () { var a = rnd(11, 20), b = rnd(2, a - 1), r = a - b; return mk(a + " − " + b + " = <em>?</em>", r, [[r + 1, "off_by_one"],
          [r - 1, "off_by_one"], [a + b,
          "wrong_op"], [r + 2, "off_by_one"]]); },
      add_carry: function () { var a, b; do { a = rnd(15, 69); b = rnd(11, 29); } while (a % 10 + b % 10 < 10 || a + b > 99); var s = a + b;
          return mk(a + " + " + b + " = <em>?</em>", s,
          [[s - 10, "forget_carry"], [s + 10, "tens_error"], [s + 1, "off_by_one"], [s - 1, "off_by_one"]]); },
      times25: function () { var n = R() < .5 ? 2 : 5, m = rnd(2, 9), s = n * m; return mk(n + " × " + m + " = <em>?</em>", s, [[n * (m + 1),
          "table_confuse"], [n * (m - 1),
          "table_confuse"], [s + 1, "off_by_one"], [n + m, "wrong_op"]]); },
      times69: function () { var a = rnd(6, 9), b = rnd(2, 9), s = a * b; return mk(a + " × " + b + " = <em>?</em>", s, [[a * (b + 1),
          "table_confuse"], [a * (b - 1), "table_confuse"], [(a +
          1) * b, "table_confuse"], [a + b, "wrong_op"]]); },
      div69: function () { var a = rnd(6, 9), b = rnd(2, 9); return mk(a * b + " ÷ " + a + " = <em>?</em>", b, [[b + 1, "off_by_one"], [b - 1,
          "off_by_one"], [a, "table_confuse"], [a * b - a, "wrong_op"]]); },
      mul_carry: function () { var a = rnd(12, 48), b = rnd(3, 9), s = a * b; return mk(a + " × " + b + " = <em>?</em>", s, [[s - 10, "carry_error"],
          [s + 10, "carry_error"], [s + 1,
          "off_by_one"], [a + b, "wrong_op"]]); },
      dec_add: function (c) { var a = rnd(11, 89) / 10, b = rnd(11, 89) / 10, s = Math.round((a + b) * 10) / 10, L = c.lang;
        return mk(fmt(a.toFixed(1), L) + " + " + fmt(b.toFixed(1), L) + " = <em>?</em>", fmt(s.toFixed(1), L), [[fmt(Math.round(s * 10), L),
            "decimal_point"], [fmt((s / 10).toFixed(2), L),
            "decimal_point"], [fmt((s + .1).toFixed(1), L), "off_by_one"], [fmt((s - .1).toFixed(1), L), "off_by_one"]]); },
      pct_of: function () { var p = [10, 20, 25, 50][rnd(0, 3)], n = [40, 60, 80, 100, 200][rnd(0, 4)], s = n * p / 100; return mk(p + "% × " + n +
          " = <em>?</em>", s, [[p,
          "percent_misread"], [n / p, "percent_misread"], [s + 5, "off_by_one"], [n - s, "wrong_op"]]); }
    };
    /* giá trị các chữ số (hàng) */
    var PL = [["đơn vị", "ones"], ["chục", "tens"], ["trăm", "hundreds"], ["nghìn", "thousands"], ["chục nghìn", "ten-thousands"], ["trăm nghìn", "hundred-thousands"]];
    G.place_value = function (c) {
      var g = c.grade, v = VI(c), i = v ? 0 : 1, n, a, b, p, d, ds, wr = [], q;
      if (g === 1) {
        do { n = rnd(11, 99); a = Math.floor(n / 10); b = n % 10; } while (a === b || b === 0);
        var A = function (x, y) { return v ? x + " chục " + y + " đơn vị" : x + " tens " + y + " ones"; };
        return mk(v ? "Số <em>" + n + "</em> gồm mấy chục và mấy đơn vị?" : "The number <em>" + n + "</em> has how many tens and ones?", A(a, b), [[A(
            b, a), "place_value"], [A(a + 1, b),
            "off_by_one"], [A(a, b - 1), "off_by_one"]]);
      }
      if (g === 5) {
        ds = shuf([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4); n = Number(ds.join("")); var DP = [["phần trăm", "hundredths"], ["phần mười", "tenths"],
            ["đơn vị", "ones"], ["chục", "tens"]];
        p = rnd(0, 3); d = Number(String(n).charAt(3 - p));
        for (var k = 0; k < 4; k++) if (k !== p) wr.push([Number(String(n).charAt(3 - k)), "place_value"]);
        return mkn(v ? "Chữ số hàng <em>" + DP[p][0] + "</em> của số " + fmt((n / 100).toFixed(2), c.lang) + " là?" : "The digit in the <em>" +
            DP[p][1] + "</em> place of " + (
            n / 100).toFixed(2) + " is?", d, wr, c);
      }
      var D = g === 2 ? 3 : g === 3 ? 5 : 6; ds = shuf([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, D); n = Number(ds.join("")); p = rnd(0, D - 1);
          d = Number(String(n).charAt(D - 1 - p));
      if (g <= 3) {
        for (var j = 0; j < D; j++) if (j !== p) wr.push([Number(String(n).charAt(D - 1 - j)), "place_value"]);
        q = mkn(v ? "Chữ số hàng <em>" + PL[p][0] + "</em> của số " + n + " là?" : "The digit in the <em>" + PL[p][1] + "</em> place of " + n + " is?", d, wr, c);
        var nth = ["thứ nhất", "thứ hai", "thứ ba", "thứ tư", "thứ năm"][p], nthE = ["1st", "2nd", "3rd", "4th", "5th"][p];
            /* gợi ý theo số trong câu: chỉ vị trí hàng, KHÔNG nêu chữ số */
        q.hint = v ? ["Hàng " + PL[p][0] + " là hàng <b>" + nth + "</b> tính từ bên PHẢI của số " + n + " (đơn vị, chục, trăm, nghìn…).",
            "Đặt ngón tay lên chữ số cuối cùng của " + n +
            " (hàng đơn vị), rồi đếm sang trái đến hàng " + nth + ". Chữ số ở đó là đáp án."]
          : ["The " + PL[p][1] + " place is the <b>" + nthE + "</b> place from the RIGHT of " + n + " (ones, tens, hundreds, thousands…).",
              "Put a finger on the last digit of " + n +
              " (ones), then count left to the " + nthE + " place. The digit there is the answer."];
        return q;
      }
      for (var m = 0; m < D; m++) if (m !== p) wr.push([d * Math.pow(10, m), "place_value"]);
      return mkn(v ? "Trong số " + n + ", chữ số <em>" + d + "</em> có giá trị là?" : "In " + n + ", the digit <em>" + d + "</em> has the value?",
          d * Math.pow(10, p), wr, c);
    };

    var RU = { 10: ["chục", "tens"], 100: ["trăm", "hundreds"], 1000: ["nghìn", "thousands"], 10000: ["chục nghìn", "ten-thousands"] };
    G.round_num = function (c) {
      var g = c.grade, v = VI(c), n, u, r, ans, oth, nm, txt;
      if (g === 5) {
        var m, tenth = R() < .5; u = tenth ? 10 : 100;
        do { m = rnd(1001, 9999); r = m % u; } while (r === 0);
        ans = (r >= u / 2 ? m - r + u : m - r) / 100; oth = (r >= u / 2 ? m - r : m - r + u) / 100;
        txt = fmt((m / 100).toFixed(2), c.lang);
        return mkn(v ? "Làm tròn số " + txt + " đến hàng <em>" + (tenth ? "phần mười" : "đơn vị") + "</em>" : "Round " + txt +
            " to the nearest <em>" + (tenth ? "tenth" : "whole number") +
            "</em>", ans, [[oth, "place_value"], [ans + (tenth ? .1 : 1), "place_value"], [ans - (tenth ? .1 : 1), "place_value"]], c);
      }
      do { u = g === 2 ? 10 : g === 3 ? pk([10, 100, 1000]) : pk([100, 1000, 10000]); n = g === 2 ? rnd(11, 99) : g === 3 ? rnd(101, 9999) : rnd(
          10001, 99999); r = n % u; } while (r === 0 || n < u * 1.5);
      ans = r >= u / 2 ? n - r + u : n - r; oth = r >= u / 2 ? n - r : n - r + u; nm = RU[u];
      return mkn(v ? "Làm tròn số <em>" + n + "</em> đến hàng " + nm[0] : "Round <em>" + n + "</em> to the nearest " + nm[1].replace(/s$/, ""), ans,
          [[oth, "place_value"], [ans + u,
          "place_value"], [ans - u, "place_value"]], c);
    };

    G.expr_order = function (c) {
      var g = c.grade, a, b, d, t, ans, lr, txt, wr = [], tries = 0, o1, o2;
      do {
        tries++;
        if (g <= 2) {
          a = g === 1 ? rnd(3, 12) : rnd(20, 90); b = g === 1 ? rnd(1, 9) : rnd(5, 50); d = g === 1 ? rnd(1, 9) : rnd(5, 40); o1 = pk(["+", "−"]); o2 = pk(["+", "−"]);
          t = [a, o1, b, o2, d]; ans = ev(t, false); lr = ev([a, "+", b, "+", d], false); txt = a + " " + o1 + " " + b + " " + o2 + " " + d;
          wr = [[lr, "wrong_op"], [ev([a, "−", b, "−", d], false), "wrong_op"]];
          if (ans < 0 || ev([a, o1, b], false) < 0 || ans > (g === 1 ? 20 : 99) || ev([a, o1, b], false) > (g === 1 ? 20 : 99)) ans = -1;
        } else if (g === 3) {
          a = rnd(10, 60); b = rnd(2, 9); d = rnd(2, 9); o1 = pk(["+", "−"]); t = [a, o1, b, "×", d]; ans = ev(t, true); lr = ev(t, false); txt = a +
              " " + o1 + " " + b + " × " + d; wr = [[lr, "order_ops"]];
          if (ans < 0 || lr < 0) ans = -1;
        } else if (g === 4) {
          a = rnd(3, 30); b = rnd(2, 20); d = rnd(2, 9); var k = rnd(0, 1);
          if (k) { if (b >= a) b = a - 1; txt = "(" + a + " − " + b + ") × " + d; ans = (a - b) * d; lr = ev([a, "−", b, "×", d], true); }
          else { txt = "(" + a + " + " + b + ") × " + d; ans = (a + b) * d; lr = ev([a, "+", b, "×", d], true); }
          wr = [[lr, "order_ops"]];
        } else {
          if (R() < .5) { a = rnd(50, 300); b = rnd(2, 20); d = rnd(2, 9); var e = rnd(1, 40); t = [a, "+", b, "×", d, "−", e]; ans = ev(t, true);
              lr = ev(t, false); txt = a + " + " + b +
              " × " + d + " − " + e; wr = [[lr, "order_ops"]]; }
          else { b = rnd(2, 9); d = rnd(2, 12); a = b * d - rnd(0, b * d - 1) % 1; var s1 = rnd(10, 90); a = b * rnd(4, 20) - s1; if (a < 1) a = 1;
              var tot = a + s1; ans = tot / b;
              txt = "(" + a + " + " + s1 + ") ÷ " + b; lr = a + s1 / b; wr = [[lr, "order_ops"]]; if (tot % b) ans = -1; }
        }
      } while ((ans < 0 || ans === lr || ans !== Math.floor(ans)) && tries < 200);
      wr.push([ans + 1, "off_by_one"], [ans - 1, "off_by_one"]);
      return mkn(txt + " = <em>?</em>", ans, wr, c);
    };

    G.unknown_num = function (c) {
      var g = c.grade, dec = g === 5, v = c.lang, Q = "<em>?</em>", kinds = g === 1 ? ["add", "sub"] : g === 2 ? ["add", "sub", "mul"] : g === 3 ?
          ["add", "mul", "div"] : ["add", "sub", "mul", "div"],
        kd = pk(kinds), lo = [0, 1, 10, 100, 1000, 11][g], hi = [0, 9, 49, 499, 4999, 89][g], a, b, s, x, txt, wr, ra = function () { var z = rnd(lo,
            hi); return dec ? z / 10 : z; };
      if (kd === "add") { a = ra(); b = ra(); s = r2(a + b); txt = Q + " + " + fmt(b, v) + " = " + fmt(s, v); x = a; wr = [[s + b, "wrong_op"], [r2(
          Math.abs(b - a)), "wrong_op"]]; }
      else if (kd === "sub") {
        if (g === 1) { s = rnd(5, 10); b = rnd(1, s - 1); txt = s + " − " + Q + " = " + b; x = s - b; wr = [[s + b, "wrong_op"], [b, "wrong_op"]]; }
        else { b = ra(); var cc = ra(); x = r2(cc + b); txt = Q + " − " + fmt(b, v) + " = " + fmt(cc, v); wr = [[r2(Math.abs(cc - b)), "wrong_op"],
            [r2(cc + b + 10 * (dec ? .1 : 1)), "off_by_one"]]; }
      }
      else if (kd === "mul") {
        if (g === 2) { b = rnd(2, 5); x = rnd(2, 9); txt = b + " × " + Q + " = " + b * x; wr = [[b * x + b, "wrong_op"], [b * x - b, "wrong_op"]]; }
        else { b = dec ? pk([2, 5, 10]) : rnd(2, 9); x = dec ? rnd(11, 59) / 10 : rnd(g === 3 ? 5 : 11, g === 3 ? 19 : 99); txt = Q + " × " + b +
            " = " + fmt(r2(x * b), v); wr = [[r2(x * b +
            b), "wrong_op"], [r2(x * b - b), "wrong_op"]]; }
      }
      else { b = dec ? pk([2, 5, 10]) : rnd(2, 9); a = dec ? rnd(11, 59) / 10 : rnd(g === 3 ? 5 : 11, g === 3 ? 19 : 99); x = r2(a * b); txt = Q +
          " ÷ " + b + " = " + fmt(a, v); wr = [[r2(
          a + b), "wrong_op"], [r2(Math.abs(a - b)), "wrong_op"]]; }
      wr.push([x + (dec ? .1 : 1), "off_by_one"], [x - (dec ? .1 : 1), "off_by_one"]);
      return mkn(txt, x, wr, c);
    };

    EP.G = G;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["gen-arith"] = part;
})(typeof window !== "undefined" ? window : globalThis);
