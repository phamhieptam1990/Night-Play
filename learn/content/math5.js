/* TOÁN LỚP 5 BỔ SUNG: biểu đồ quạt (hình tròn chia phần, vẽ SVG thật) và hỗn số (đổi phân số ↔ hỗn số, cộng/trừ hỗn số).
   Nạp trước engine.js (trình duyệt) / được engine require (Node); engine gọi LearnMath5(ctx) để đăng ký kỹ năng, chủ đề, nhãn và bộ sinh câu.
   Mỗi câu có q.hint (2 bậc, KHÔNG nêu đáp án) và q.steps (lời giải ngắn có số cụ thể, chỉ nên hiện sau khi bé sai hai lần).
   Đáp án nhiễu đều mang mã lỗi tư duy. Kiểm: scripts/learn/check-mathskills.js (mục 8, tự tính lại độc lập từ đề và dữ liệu trong SVG). */
(function (root) {
  "use strict";
  var COL = ["#fca5a5", "#93c5fd", "#86efac", "#fde68a"], LET = ["A", "B", "C", "D"];
  var f1 = function (n) { return String(Math.round(n * 10) / 10); };

  /* ---- biểu đồ quạt: pcts = phần trăm từng phần (tổng 100), unk = chỉ số phần ghi "?" (hoặc -1). SVG vuông 120×120, nhãn nằm trong từng phần ---- */
  function slice(cx, cy, r, a0, a1, fill) {
    var P = function (a) { return f1(cx + r * Math.cos(a)) + " " + f1(cy + r * Math.sin(a)); };
    return '<path d="M' + cx + " " + cy + " L" + P(a0) + " A" + r + " " + r + " 0 " + (a1 - a0 > Math.PI ? 1 : 0) + " 1 " + P(a1) + ' Z" fill="' + fill + '" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>';
  }
  function label(x, y, size, txt) {
    return '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="middle" font-size="' + size + '" font-weight="800" fill="#1e293b" font-family="sans-serif">' + txt + "</text>";
  }
  function pieSvg(pcts, unk, vi) {
    var cx = 60, cy = 60, r = 55, a0 = -Math.PI / 2, out = "", say = [];
    pcts.forEach(function (p, i) {
      var a1 = a0 + p / 100 * 2 * Math.PI, am = (a0 + a1) / 2, lx = cx + .64 * r * Math.cos(am), ly = cy + .64 * r * Math.sin(am);
      out += slice(cx, cy, r, a0, a1, i === unk ? "#e2e8f0" : COL[i]) + label(lx, ly - 1.5, 12, LET[i]) + label(lx, ly + 10, i === unk ? 13 : 10.5, i === unk ? "?" : p + "%");
      say.push(LET[i] + " " + (i === unk ? "?" : p + "%")); a0 = a1;
    });
    return '<svg viewBox="0 0 120 120" width="150" height="150" role="img" aria-label="' + (vi ? "Biểu đồ quạt: " : "Pie chart: ") + say.join(", " ) + '" data-pie="' + pcts.join(",") + '" data-unk="' + unk +
      '" style="display:block;margin:.15em auto;max-width:44vw;max-height:44vw">' + out + "</svg>"; }

  function install(X) {
    var mk = X.mk, mkn = X.mkn, rnd = X.rnd, pk = X.pk, gcd = X.gcd, VI = X.VI, G = X.G, SK = X.SK, TOPIC = X.TOPIC, SKLAB = X.SKLAB;
    SK.pie_chart = { subj: "toan", grades: [5], diff: 3 }; SK.mixed_num = { subj: "toan", grades: [5], diff: 3 };
    TOPIC.pie_chart = { 5: "g5_statistics" }; TOPIC.mixed_num = { 5: "g5_fractions" };
    SKLAB.pie_chart = ["Biểu đồ quạt", "Pie chart"]; SKLAB.mixed_num = ["Hỗn số", "Mixed numbers"];
    var em = function (s) { return "<em>" + s + "</em>"; };

    /* ===================== BIỂU ĐỒ QUẠT ===================== */
    var THEME = [
      { vi: ["bóng đá", "bơi", "cờ vua", "bóng bàn"], en: ["football", "swimming", "chess", "table tennis"],
        iv: "Môn", ie: "Sport", lv: "thích", le: "like" },
      { vi: ["cam", "táo", "chuối", "nho"], en: ["oranges", "apples", "bananas", "grapes"],
        iv: "Trái cây", ie: "Fruit", lv: "thích", le: "like" },
      { vi: ["truyện tranh", "sách khoa học", "thơ", "truyện cổ tích"], en: ["comics", "science books", "poems", "fairy tales"],
        iv: "Sách", ie: "Books", lv: "thích", le: "like" }
    ];
    function parts(k) {   /* k phần, mỗi phần là bội của 5, từ 15% đến 60%, đôi một khác nhau, tổng 100% */
      for (var t = 0; t < 400; t++) {
        var p = [], s = 0, i, good = true;
        for (i = 0; i < k - 1; i++) { p.push(5 * rnd(3, 12)); s += p[i]; }
        p.push(100 - s);
        for (i = 0; i < k; i++) if (p[i] < 15 || p[i] > 60 || p.indexOf(p[i]) !== i) good = false;
        if (good) return p;
      }
      return k === 3 ? [45, 35, 20] : [40, 25, 20, 15];
    }
    function twoDiff(p) { var i = rnd(0, p.length - 1), j; do { j = rnd(0, p.length - 1); } while (j === i); return p[i] > p[j] ? [i, j] : [j, i]; }
    var HT = {
      of: [["Tìm phần trăm của phần đó trên biểu đồ.", "Số bạn = số bạn cả lớp × phần trăm ÷ 100. Có thể nhẩm: một nửa, một phần tư, một phần mười của cả lớp."],
        ["Find that slice’s percent on the chart.", "Number = class size × percent ÷ 100. You can also think: a half, a quarter or a tenth of the class."]],
      rest: [["Cả hình tròn là 100%.", "Cộng các phần đã biết, rồi lấy 100% trừ đi tổng đó."], ["The whole circle is 100%.", "Add the known slices, then take that total away from 100%."]],
      diff: [["Đọc phần trăm của hai phần trên biểu đồ.", "Muốn biết hơn bao nhiêu thì lấy số lớn trừ số bé."], ["Read the percent of the two slices.", "To find how many more, take the smaller from the bigger."]],
      diffn: [["Tìm hiệu hai phần trăm trước.", "Rồi lấy hiệu đó × số bạn cả lớp ÷ 100."], ["Find the difference of the two percents first.", "Then do difference × class size ÷ 100."]]
    };
    G.pie_chart = function (c) {   /* chữ càng ít càng tốt: khung câu hỏi nhỏ, SVG phải còn đủ to để đọc nhãn */
      var v = VI(c), th = pk(THEME), nm = v ? th.vi : th.en, t = rnd(0, 3), k = rnd(3, 4), p = parts(k), N = pk([20, 40, 60, 80, 100, 120, 200]), u = t === 1 ? rnd(0, k - 1) : -1;
      var legend = nm.slice(0, k).map(function (x, i) { return LET[i] + " " + x; }).join(" · "), verb = v ? th.lv : th.le, who = v ? "bạn" : "students";
      var head = pieSvg(p, u, v) + '<div style="font-size:.66em;line-height:1.2;opacity:.9">' + (v ? th.iv : th.ie) + ": " + legend + "</div>";
      var i, j, d, q, key, st, ans, known, ask = function (s) { return '<div style="font-size:.86em;line-height:1.25">' + s + "</div>"; },
        cls = v ? "Lớp có " + em(N) + " bạn. " : "The class has " + em(N) + " students. ";
      if (t === 0) {
        i = rnd(0, k - 1); ans = N * p[i] / 100; key = "of";
        q = mkn(head + ask(cls + (v ? "Bao nhiêu bạn " + verb + " " + nm[i] + "?" : "How many " + verb + " " + nm[i] + "?")), ans,
          [[p[i], "percent_misread"], [N - ans, "wrong_op"], [N % p[i] ? N / 2 : N / p[i], "formula_confuse"], [ans * 10, "percent_misread"], [N * p[i], "percent_misread"]], c, who);
        st = [(v ? "Phần " + LET[i] + " chiếm " : "Slice " + LET[i] + " is ") + p[i] + "%.", N + " × " + p[i] + " ÷ 100 = " + ans + " " + who + "."];
      } else if (t === 1) {
        known = p.filter(function (x, n) { return n !== u; }); ans = p[u]; key = "rest"; d = 100 - ans;
        q = mkn(head + ask(v ? "Phần " + LET[u] + " chiếm bao nhiêu phần trăm?" : "What percent is slice " + LET[u] + "?"), ans,
          [[d, "wrong_op"], [ans + 5, "off_by_one"], [Math.max(0, ans - 5), "off_by_one"], [100 + d, "read_chart"]], c, "%");
        st = [(v ? "Các phần đã biết cộng lại: " : "Known slices added: ") + known.join("% + ") + "% = " + d + "%.", "100% − " + d + "% = " + ans + "%."];
      } else if (t === 2) {
        d = twoDiff(p); i = d[0]; j = d[1]; ans = p[i] - p[j]; key = "diff";
        q = mkn(head + ask(v ? "Số bạn " + verb + " " + nm[i] + " hơn " + nm[j] + " bao nhiêu phần trăm?" : "How many percent more " + verb + " " + nm[i] + " than " + nm[j] + "?"), ans,
          [[p[i] + p[j], "wrong_op"], [p[i], "read_chart"], [p[j], "read_chart"], [ans + 5, "off_by_one"], [Math.round(p[i] / p[j] * 10) / 10, "formula_confuse"]], c, "%");
        st = [LET[i] + (v ? " chiếm " : " is ") + p[i] + "%, " + LET[j] + (v ? " chiếm " : " is ") + p[j] + "%.", p[i] + "% − " + p[j] + "% = " + ans + "%."];
      } else {
        d = twoDiff(p); i = d[0]; j = d[1]; ans = N * (p[i] - p[j]) / 100; key = "diffn";
        q = mkn(head + ask(cls + (v ? "Số bạn " + verb + " " + nm[i] + " hơn " + nm[j] + " bao nhiêu bạn?" : "How many more " + verb + " " + nm[i] + " than " + nm[j] + "?")), ans,
          [[p[i] - p[j], "percent_misread"], [N * (p[i] + p[j]) / 100, "wrong_op"], [N * p[i] / 100, "read_chart"], [ans + 5, "off_by_one"], [N * p[j] / 100, "read_chart"]], c, who);
        st = [p[i] + "% − " + p[j] + "% = " + (p[i] - p[j]) + "%.", N + " × " + (p[i] - p[j]) + " ÷ 100 = " + ans + " " + who + "."];
      }
      q.hint = HT[key][v ? 0 : 1]; q.steps = st; q.type = "chart_reading"; return q;
    };

    /* ===================== HỖN SỐ ===================== */
    function lcm(a, b) { return a / gcd(a, b) * b; }
    function mixStr(num, den) {   /* num/den → "w r/d" (hoặc "r/d" khi w = 0), đã tối giản; không dùng cho số nguyên */
      var g = gcd(num, den), n = num / g, d = den / g, w = Math.floor(n / d), r = n % d;
      return r === 0 ? String(w) : (w ? w + " " : "") + r + "/" + d;
    }
    var VALID = /^(\d{1,3} )?\d{1,4}\/\d{1,4}$/, PARSE = /^(?:(\d+) )?(\d+)\/(\d+)$/;
    function val(s) { var m = PARSE.exec(s); return m ? (+(m[1] || 0) * +m[3] + +m[2]) / +m[3] : NaN; }
    function sane(s) { var m = VALID.test(s) && PARSE.exec(s); return !!m && +m[3] >= 2 && (!m[1] || +m[2] < +m[3]); }   /* mẫu ≥ 2; hỗn số có phần phân số thật sự < 1 */
    function mixQ(stem, ans, wrongs) {   /* mọi lựa chọn là hỗn số/phân số hợp lệ, khác đáp án đúng cả về chữ lẫn giá trị */
      var seen = {}, w = [], m = PARSE.exec(ans), k, s2; seen[ans] = 1;
      wrongs.forEach(function (x) { var s = String(x[0]); if (w.length < 3 && sane(s) && !seen[s] && Math.abs(val(s) - val(ans)) > 1e-9) { seen[s] = 1; w.push([s, x[1]]); } });
      for (k = 1; w.length < 3 && k < 30; k++) { s2 = (+(m[1] || 0) + k) + " " + m[2] + "/" + m[3]; if (!seen[s2]) { seen[s2] = 1; w.push([s2, "other"]); } }
      return mk(stem, ans, w);
    }
    var TIDY = ["(hỗn số tối giản)", "(as a simplified mixed number)"];
    function pickFr(lo, hi) {   /* hỗn số a b/c với phần phân số tối giản */
      var c0 = pk([2, 3, 4, 5, 6, 8]), b; do { b = rnd(1, c0 - 1); } while (gcd(b, c0) !== 1);
      return { a: rnd(lo, hi), b: b, c: c0 };
    }
    function top(m, L) { return (m.a * m.c + m.b) * (L / m.c); }   /* tử số của hỗn số m khi quy đồng về mẫu L */
    function str(m) { return m.a + " " + m.b + "/" + m.c; }
    function hs(m) { return m.a + '<span style="margin-left:.3em">' + m.b + "/" + m.c + "</span>"; }   /* hỗn số trong đề: khoảng cách rõ giữa phần nguyên và phân số (tránh đọc "1 7/8" thành 17/8) */
    function toFrac(m, L, v) {   /* "2 1/4 = 9/4 = 18/8" */
      var s = m.a + " " + m.b + "/" + m.c + " = " + (m.a * m.c + m.b) + "/" + m.c; return L !== m.c ? s + " = " + top(m, L) + "/" + L : s;
    }
    function pairFr(add) {   /* hai hỗn số, mẫu bằng nhau hoặc mẫu này gấp 2–3 lần mẫu kia; phép trừ có số bị trừ lớn hơn; kết quả không nguyên */
      for (var i = 0, x, y, L, nx, ny, t, nr; i < 120; i++) {
        x = pickFr(1, 4); y = pickFr(1, 4); y.c = pk([x.c, x.c * 2, x.c * 3].filter(function (z) { return z <= 12; }));
        do { y.b = rnd(1, y.c - 1); } while (gcd(y.b, y.c) !== 1);
        L = lcm(x.c, y.c); nx = top(x, L); ny = top(y, L);
        if (!add && nx < ny) { t = x; x = y; y = t; t = nx; nx = ny; ny = t; }
        nr = add ? nx + ny : nx - ny;
        if (nr > 0 && nr % L !== 0) return { x: x, y: y, L: L, nx: nx, ny: ny, nr: nr };
      }
      return add ? { x: { a: 2, b: 1, c: 4 }, y: { a: 1, b: 1, c: 2 }, L: 4, nx: 9, ny: 6, nr: 15 } : { x: { a: 2, b: 1, c: 4 }, y: { a: 1, b: 1, c: 2 }, L: 4, nx: 9, ny: 6, nr: 3 };
    }
    function addSub(c, add) {
      var v = VI(c), p = pairFr(add), x = p.x, y = p.y, L = p.L, nr = p.nr, ans = mixStr(nr, L), g = gcd(nr, L), W = Math.floor(nr / L), rr = (nr % L) / g, dd = L / g, op = add ? " + " : " − ", q, wr;
      wr = add ? [[(x.a + y.a) + " " + (x.b + y.b) + "/" + (x.c + y.c), "add_denominator"], [(W + 1) + " " + rr + "/" + dd, "off_by_one"], [(x.a + y.a) + " " + rr + "/" + dd,
        "forget_carry"], [(x.a + y.a) + " " + (x.b + y.b) + "/" + L, "concept_confuse"]]
        : [[(x.a - y.a) + " " + Math.abs(x.b * (L / x.c) - y.b * (L / y.c)) + "/" + L, "forget_carry"], [(W + 1) + " " + rr + "/" + dd, "off_by_one"],
          [(x.a - y.a) + " " + Math.abs(x.b - y.b) + "/" + Math.abs(x.c - y.c || 1), "add_denominator"], [(W > 1 ? W - 1 : W + 2) + " " + rr + "/" + dd, "carry_error"]];
      q = mixQ(em(hs(x) + op + hs(y)) + " = ? " + TIDY[v ? 0 : 1], ans, wr);
      q.hint = v ? ["Quy đồng mẫu số hai phân số (nếu khác nhau) hoặc đổi cả hai hỗn số thành phân số.",
        add ? "Cộng tử số, giữ mẫu số. Kết quả là phân số lớn thì đổi lại thành hỗn số và rút gọn." : "Trừ tử số, giữ mẫu số. Nếu phần phân số bị thiếu thì mượn 1 ở phần nguyên. Rút gọn kết quả."]
        : ["Make the bottoms the same (or change both mixed numbers into fractions).",
          add ? "Add the tops, keep the bottom. Change a big fraction back into a mixed number and simplify." : "Subtract the tops, keep the bottom. If the fraction part is too small, borrow 1 from the whole part. Simplify."];
      q.steps = [toFrac(x, L) + ";  " + toFrac(y, L) + ".", p.nx + "/" + L + op + p.ny + "/" + L + " = " + nr + "/" + L + " = " + ans + "."];
      return q;
    }
    G.mixed_num = function (c) {
      var v = VI(c), t = rnd(0, 3), q, x, d, w, r, n, ans;
      if (t === 0) {   /* phân số → hỗn số */
        d = rnd(2, 9); w = rnd(1, 5); do { r = rnd(1, d - 1); } while (gcd(r, d) !== 1);
        n = w * d + r; ans = w + " " + r + "/" + d;
        q = mixQ(v ? "Viết phân số " + em(n + "/" + d) + " dưới dạng hỗn số " + TIDY[0] + "." : "Write " + em(n + "/" + d) + " as a mixed number " + TIDY[1] + ".", ans,
          [[r + " " + w + "/" + d, "concept_confuse"], [(w + 1) + " " + r + "/" + d, "off_by_one"], [w + " " + r + "/" + n, "concept_confuse"], [
            (w > 1 ? w - 1 : w + 2) + " " + r + "/" + d, "off_by_one"], [w + " " + (d - r) + "/" + d, "other"]]);
        q.hint = v ? ["Chia tử số cho mẫu số: thương là phần nguyên của hỗn số.", "Số dư là tử số của phần phân số; mẫu số giữ nguyên."]
          : ["Divide the top by the bottom: the quotient is the whole-number part.", "The remainder is the top of the fraction part; the bottom stays the same."];
        q.steps = [n + " ÷ " + d + (v ? " = " + w + " dư " : " = " + w + " remainder ") + r + ".", (v ? "Phần nguyên " : "Whole part ") + w + (v ? ", phần phân số " : ", fraction part ") + r + "/" + d + ": " + ans + "."];
      } else if (t === 1) {   /* hỗn số → phân số */
        x = pickFr(1, 5); n = x.a * x.c + x.b; ans = n + "/" + x.c;
        q = mixQ(v ? "Đổi hỗn số " + em(hs(x)) + " thành phân số." : "Change the mixed number " + em(hs(x)) + " into a fraction.", ans,
          [[(x.a + x.b) + "/" + x.c, "concept_confuse"], [(x.a * x.b) + "/" + x.c, "wrong_op"], [x.a + "" + x.b + "/" + x.c, "place_value"], [n + "/" + x.b, "concept_confuse"], [
            (n + x.c) + "/" + x.c, "off_by_one"]]);
        q.hint = v ? ["Phần nguyên chứa bao nhiêu phần bằng nhau (cùng mẫu số)?", "Nhân phần nguyên với mẫu số, rồi cộng với tử số; mẫu số giữ nguyên."]
          : ["How many equal parts (same bottom) are in the whole-number part?", "Multiply the whole part by the bottom, add the top; keep the bottom."];
        q.steps = [x.a + " × " + x.c + " = " + x.a * x.c + ".", x.a * x.c + " + " + x.b + " = " + n + (v ? ", giữ mẫu " : ", keep ") + x.c + ": " + ans + "."];
      } else q = addSub(c, t === 2);
      q.type = "calculation"; return q;
    };
  }
  install.pieSvg = pieSvg;
  if (typeof module !== "undefined" && module.exports) module.exports = install; else root.LearnMath5 = install;
})(typeof window !== "undefined" ? window : globalThis);
