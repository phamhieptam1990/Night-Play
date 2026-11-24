/* Bộ máy học — Bộ sinh Toán lớp 5 nâng cao: tỉ số phần trăm, chuyển động gặp nhau / đuổi kịp, tỉ số – tỉ lệ, số thập phân.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, R = EP.R, VI = EP.VI, fmt = EP.fmt, gcd = EP.gcd, mk = EP.mk, mkn = EP.mkn, pk = EP.pk, r2 = EP.r2, rnd = EP.rnd;

    /* ====== Toán lớp 5 nâng cao (F4): tỉ số phần trăm, chuyển động gặp nhau / đuổi kịp, tỉ số – tỉ lệ, nhân chia số thập phân, nhân chia phân số.
       Mỗi câu gắn gợi ý ĐÚNG kiểu câu (q.hint = [bậc 1, bậc 2] theo ngôn ngữ) và không nêu đáp án. Kiểm tự tính lại: scripts/learn/check-mathskills.js mục 7. */
    function H2(c, vi1, vi2, en1, en2) { return VI(c) ? [vi1, vi2] : [en1, en2]; }
    function ri(x, avoid) { var r = Math.max(1, Math.round(x)); return r === avoid ? r + 2 : r; }   /* đáp án nhiễu của thời gian/vận tốc: làm tròn thành số tự nhiên */
    function fr2(n, d) { var g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }
    G.pct_ratio = function (c) {
      var v = VI(c), t = rnd(0, 3), q, n, m, p, x, y, a, nm = pk([["Lan", "Lan"], ["Nam", "Nam"], ["Mai", "Mai"]]);
      if (t === 0) {
        n = pk([20, 25, 40, 50, 80]); do { m = rnd(1, n - 1); } while ((m * 100) % n);
        p = m * 100 / n;
        q = mkn(v ? "Lớp có <em>" + n + "</em> học sinh, trong đó có <em>" + m +
            "</em> học sinh giỏi. Tỉ số phần trăm của học sinh giỏi so với cả lớp là?" : "A class has <em>" + n +
            "</em> students and <em>" + m + "</em> are top students. What percent of the class is that?", p, [[m, "percent_misread"], [100 - p,
                "wrong_op"], [Math.round(m * 1000 / (
            n - m)) / 10, "formula_confuse"], [r2(p / 10), "percent_misread"]], c, "%");
        q.hint = H2(c, "Tỉ số phần trăm của a so với b là a ÷ b rồi nhân 100. Cái được so sánh là số học sinh giỏi, cả lớp là số chia.",
            "Chia số học sinh giỏi cho số học sinh cả lớp, được một số thập phân, rồi nhân với 100 (hoặc đổi thành phân số có mẫu 100).",
            "Percent of a compared with b is a ÷ b, then × 100. Compare the top students with the whole class.",
            "Divide the number of top students by the whole class, then multiply by 100 (or make a fraction with 100 at the bottom).");
        return q;
      }
      if (t === 1) {
        x = pk([40, 50, 80, 120, 200]) * 1000; p = pk([10, 20, 25, 30, 40, 50]); y = x - x * p / 100;
        q = mkn(v ? "Một món đồ giá <em>" + x + " đồng</em>, nay bán <em>" + y + " đồng</em>. Cửa hàng đã giảm giá bao nhiêu phần trăm?" : "An item cost <em>" + x +
            " dong</em> and now sells for <em>" + y + " dong</em>. What percent discount is that?", p, [[100 - p, "wrong_op"], [r2((x - y) / 1000),
                "percent_misread"], [Math.round(
            y * 1000 / x) / 10, "percent_misread"], [p + 10, "percent_misread"]], c, "%");
        q.hint = H2(c, "Giảm giá là số tiền đã BỚT đi. Tính số tiền bớt: giá cũ trừ giá mới.",
            "Phần trăm giảm = số tiền bớt ÷ giá cũ × 100. Chú ý: chia cho giá CŨ, không phải giá mới.",
            "A discount is the money taken OFF. Work out old price minus new price.",
                "Percent off = money taken off ÷ OLD price × 100. Divide by the old price, not the new one.");
        return q;
      }
      if (t === 2) {
        x = pk([20, 40, 50, 80, 200]) * 1000; p = pk([10, 20, 25, 40, 50]); y = x + x * p / 100;
        q = mkn(v ? nm[0] + " mua một món hàng giá <em>" + x + " đồng</em> rồi bán lại với giá <em>" + y +
            " đồng</em>. Tiền lãi bằng bao nhiêu phần trăm giá mua?" : nm[1] +
            " buys an item for <em>" + x + " dong</em> and sells it for <em>" + y + " dong</em>. The profit is what percent of the buying price?", p,
                [[100 + p, "percent_misread"],
            [Math.round((y - x) * 1000 / y) / 10, "formula_confuse"], [r2(p / 2), "percent_misread"], [r2((y - x) / 1000), "percent_misread"]], c, "%");
        q.hint = H2(c, "Tiền lãi = giá bán trừ giá mua.", "Phần trăm lãi = tiền lãi ÷ giá MUA × 100 (đề hỏi “so với giá mua”).",
            "Profit = selling price minus buying price.",
            "Percent profit = profit ÷ BUYING price × 100 (the question says “of the buying price”).");
        return q;
      }
      p = pk([10, 20, 25, 40, 50]); n = rnd(2, 12) * 20; a = n * p / 100;
      q = mkn(v ? "<em>" + p + "%</em> của một số là <em>" + a + "</em>. Số đó là?" : "<em>" + p + "%</em> of a number is <em>" + a +
          "</em>. The number is?", n, [[Math.max(1, Math.round(
          a * p / 100)), "percent_misread"], [a * 2, "concept_confuse"], [a + p, "wrong_op"], [a * 100, "percent_misread"]], c);
      q.hint = H2(c, "Cả số là 100%. Biết một phần trăm nào đó của nó, hãy tìm 1% trước (chia cho số phần trăm).",
          "Rồi lấy 1% nhân với 100 để ra cả số. Có thể thử lại: tìm phần trăm của số vừa tìm xem có đúng bằng số đề cho không.",
          "The whole number is 100%. Know some percent of it? Find 1% first (divide by the percent).",
          "Then multiply 1% by 100 to get the whole number. Check: take that percent of your number and see if you get the one in the question.");
      return q;
    };
    G.motion_meet = function (c) {
      var v = VI(c), t = rnd(0, 2), v1, v2, tt, S, q, d, kmh = v ? "km/giờ" : "km/h", hh = v ? "giờ" : "h";
      do { v1 = rnd(4, 12) * 5; v2 = rnd(4, 12) * 5; } while (v1 === v2);
      tt = rnd(2, 5);
      if (t === 0) { S = (v1 + v2) * tt;
        q = mkn(v ? "Hai xe xuất phát cùng lúc từ A và B, đi <em>ngược chiều</em> để gặp nhau. AB dài <em>" + S + " km</em>, vận tốc hai xe là <em>" +
            v1 + " km/giờ</em> và <em>" + v2 +
            " km/giờ</em>. Sau mấy giờ hai xe gặp nhau?" : "Two cars leave A and B at the same time and drive <em>towards</em> each other. AB is <em>" + S +
            " km</em>; their speeds are <em>" + v1 + " km/h</em> and <em>" + v2 + " km/h</em>. After how many hours do they meet?", tt, [[ri(
                S / Math.abs(v1 - v2), tt), "formula_confuse"],
            [ri(S / v1, tt), "formula_confuse"], [ri(S / v2, tt), "formula_confuse"], [tt + 1, "off_by_one"], [tt - 1, "off_by_one"]], c, hh);
        q.hint = H2(c, "Đi ngược chiều thì mỗi giờ hai xe lại gần nhau thêm (vận tốc xe 1 + vận tốc xe 2) km.", "Thời gian gặp nhau = quãng đường AB ÷ tổng hai vận tốc.",
            "Driving towards each other, every hour they get closer by (speed 1 + speed 2) km.", "Meeting time = distance AB ÷ the two speeds added together.");
        return q; }
      if (t === 1) { d = Math.abs(v1 - v2) * tt; var sl = Math.min(v1, v2), fa = Math.max(v1, v2);
        q = mkn(v ? "Xe máy đi trước ô tô <em>" + d + " km</em>, cùng chiều. Vận tốc xe máy là <em>" + sl + " km/giờ</em>, ô tô là <em>" + fa +
            " km/giờ</em>. Sau mấy giờ ô tô đuổi kịp xe máy?" : "A motorbike is <em>" + d + " km</em> ahead of a car, going the same way. The motorbike goes <em>" + sl +
            " km/h</em> and the car <em>" + fa + " km/h</em>. After how many hours does the car catch up?", tt, [[ri(d / (sl + fa), tt),
                "formula_confuse"], [ri(d / fa, tt),
            "formula_confuse"], [ri(d / sl, tt), "formula_confuse"], [tt + 1, "off_by_one"], [tt - 1, "off_by_one"]], c, hh);
        q.hint = H2(c, "Cùng chiều: mỗi giờ ô tô rút ngắn khoảng cách thêm (vận tốc ô tô − vận tốc xe máy) km.",
            "Thời gian đuổi kịp = khoảng cách ban đầu ÷ hiệu hai vận tốc.",
            "Same direction: every hour the car closes the gap by (car speed − bike speed) km.", "Catch-up time = starting gap ÷ the difference of the speeds.");
        return q; }
      S = (v1 + v2) * tt;
      q = mkn(v ? "Hai người đi <em>ngược chiều</em> từ A và B, xuất phát cùng lúc, sau <em>" + tt + " giờ</em> thì gặp nhau. AB dài <em>" + S +
          " km</em>, người thứ nhất đi <em>" + v1 +
          " km/giờ</em>. Vận tốc người thứ hai là?" : "Two people leave A and B together and walk <em>towards</em> each other; they meet after <em>" +
              tt + " hours</em>. AB is <em>" + S +
          " km</em> and the first goes <em>" + v1 + " km/h</em>. The second person's speed is?", v2, [[S / tt, "formula_confuse"], [S / tt + v1,
              "wrong_op"], [ri(S / v1, v2),
          "formula_confuse"], [v2 + 5, "off_by_one"]], c, kmh);
      q.hint = H2(c, "Tổng hai vận tốc = quãng đường AB ÷ thời gian gặp nhau.", "Vận tốc người thứ hai = tổng hai vận tốc trừ vận tốc người thứ nhất.",
          "Sum of the two speeds = distance AB ÷ time until they meet.", "Second speed = that sum minus the first person's speed.");
      return q;
    };
    G.ratio_prop = function (c) {
      var v = VI(c), t = rnd(0, 2), a, b, k, T, u, n1, n2, sc, cm, q, big;
      if (t === 0) {
        do { a = rnd(1, 5); b = rnd(2, 7); } while (a >= b || gcd(a, b) !== 1); k = rnd(2, 12); T = (a + b) * k; big = R() < .5;
        q = mkn(v ? "Hai số có tổng là <em>" + T + "</em>, tỉ số của số bé và số lớn là <em>" + a + "/" + b + "</em>. Số " + (big ? "lớn" : "bé") +
            " là?" : "Two numbers add up to <em>" +
            T + "</em>; the ratio of the smaller to the larger is <em>" + a + "/" + b + "</em>. The " + (big ? "larger" : "smaller") + " number is?",
                (big ? b : a) * k, [[(big ? a : b) * k,
            "concept_confuse"], [k, "concept_confuse"], [r2(T * (big ? b : a) / b), "concept_confuse"], [T - (big ? b : a), "wrong_op"]], c);
        q.hint = H2(c, "Vẽ sơ đồ: số bé " + a + " phần, số lớn " + b + " phần bằng nhau. Tổng số phần bằng nhau là bao nhiêu?",
            "Giá trị một phần = tổng ÷ tổng số phần. Rồi nhân với số phần của số cần tìm.", "Draw a diagram: the smaller is " + a + " equal parts, the larger is " + b +
            " equal parts. How many parts altogether?", "One part = total ÷ number of parts. Then multiply by the parts of the number you want.");
        return q;
      }
      if (t === 1) {
        u = rnd(6, 30) * 1000; n1 = rnd(2, 6); do { n2 = rnd(3, 12); } while (n2 === n1);
        q = mkn(v ? "Mua <em>" + n1 + " kg</em> gạo hết <em>" + (u * n1) + " đồng</em>. Hỏi mua <em>" + n2 + " kg</em> gạo như thế hết bao nhiêu đồng?" : "<em>" + n1 +
            " kg</em> of rice costs <em>" + (u * n1) + " dong</em>. How much do <em>" + n2 + " kg</em> of the same rice cost?", u * n2, [[u * n1 * n2,
                "wrong_op"], [u * n1 + n2 * 1000,
            "wrong_op"], [u * n1 + (n2 - n1) * 1000, "concept_confuse"], [u, "concept_confuse"]], c, v ? "đồng" : "dong");
        q.hint = H2(c, "Làm “rút về đơn vị”: tìm giá tiền của 1 kg trước.", "Giá 1 kg = tổng tiền ÷ số kg đã biết. Rồi nhân với số kg cần mua.",
            "Use the “unit rate” method: find the price of 1 kg first.", "Price of 1 kg = total ÷ kg known. Then multiply by the kg you want.");
        return q;
      }
      sc = pk([500, 1000, 2000]); cm = rnd(2, 9);
      q = mkn(v ? "Trên bản đồ tỉ lệ <em>1 : " + sc + "</em>, đoạn đường dài <em>" + cm + " cm</em>. Ngoài thực tế đoạn đường dài bao nhiêu mét?" :
          "On a map with scale <em>1 : " + sc +
          "</em>, a road is <em>" + cm + " cm</em> long. How long is it in real life, in metres?", cm * sc / 100, [[cm * sc, "unit_convert"], [r2(
              cm * sc / 1000), "unit_convert"],
          [cm * sc / 10, "unit_convert"], [cm * 100, "concept_confuse"]], c, v ? "m" : "m");
      q.hint = H2(c, "Tỉ lệ 1 : " + sc + " nghĩa là 1 cm trên bản đồ ứng với " + sc + " cm ngoài thực tế.", "Nhân độ dài trên bản đồ với " + sc +
          " để ra số cm thật, rồi đổi sang mét (100 cm = 1 m).", "Scale 1 : " + sc + " means 1 cm on the map is " + sc + " cm in real life.",
              "Multiply the map length by " + sc +
          " to get real cm, then change to metres (100 cm = 1 m).");
      return q;
    };
    G.dec_muldiv = function (c) {
      var v = VI(c), t = rnd(0, 3), a, b, x, q, ans, F = function (n, d) { return fmt(r2(n).toFixed(d), c.lang); };
      if (t === 0) { a = rnd(12, 99) / 10; b = rnd(2, 9); if (a % 1 === 0) a += .1; ans = r2(a * b);
        q = mkn(F(a, 1) + " × " + b + " = <em>?</em>", ans, [[r2(ans * 10), "decimal_point"], [r2(ans / 10), "decimal_point"], [r2(Math.floor(a) * b +
            (a % 1) * 10), "decimal_point"], [r2(
            ans + .1), "off_by_one"]], c);
        q.hint = H2(c, "Bỏ dấu phẩy, nhân như số tự nhiên: " + Math.round(a * 10) + " × " + b + ".",
            "Rồi đếm: số bị nhân có 1 chữ số ở phần thập phân thì tích cũng có 1 chữ số ở phần thập phân. Ước lượng cho chắc: làm tròn " + F(a, 1) + " rồi nhân.",
            "Ignore the point and multiply as whole numbers: " + Math.round(a * 10) + " × " + b + ".",
            "Then count: one decimal place in the factor means one in the answer. Estimate to be sure: round " + F(a, 1) + " first."); return q; }
      if (t === 1) { a = rnd(12, 49) / 10; b = rnd(2, 9) / 10; ans = r2(a * b);
        q = mkn(F(a, 1) + " × " + F(b, 1) + " = <em>?</em>", ans, [[r2(ans * 10), "decimal_point"], [r2(ans / 10), "decimal_point"], [r2(ans * 100),
            "decimal_point"], [r2(ans + .01), "off_by_one"]], c);
        q.hint = H2(c, "Nhân như số tự nhiên, bỏ hết dấu phẩy: " + Math.round(a * 10) + " × " + Math.round(b * 10) + ".",
            "Hai thừa số có TẤT CẢ 2 chữ số ở phần thập phân, nên tích cũng phải có 2 chữ số ở phần thập phân.",
                "Multiply as whole numbers, ignoring the points: " + Math.round(a * 10) +
            " × " + Math.round(b * 10) + ".", "The factors have 2 decimal places in all, so the answer has 2 decimal places."); return q; }
      if (t === 2) { b = rnd(2, 9); x = rnd(12, 59) / 10; if (x % 1 === 0) x += .1; a = r2(x * b);
        q = mkn(F(a, 1) + " ÷ " + b + " = <em>?</em>", x, [[r2(x * 10), "decimal_point"], [r2(x / 10), "decimal_point"], [r2(x + .1), "off_by_one"],
            [r2(a * b), "wrong_op"]], c);
        q.hint = H2(c, "Chia phần nguyên trước, khi hết phần nguyên thì viết dấu phẩy ở thương rồi chia tiếp.",
            "Có thể kiểm tra bằng phép nhân: thương × " + b + " phải bằng " + F(a, 1) +
            ".", "Divide the whole part first, then put the decimal point in the answer and carry on.", "Check by multiplying: answer × " + b +
                " must equal " + F(a, 1) + "."); return q; }
      var mul = R() < .5; x = mul ? pk([10, 100, 1000]) : pk([10, 100]); a = mul ? rnd(12, 99) / 100 : rnd(12, 999) / 10; ans = r2(mul ? a * x :
          a / x);   /* thương tối đa 3 chữ số thập phân */
      q = mkn(F(a, mul ? 2 : 1).replace(/([.,]\d*?)0+$/, "$1").replace(/[.,]$/, "") + (mul ? " × " : " ÷ ") + x + " = <em>?</em>", ans, [[r2(mul ?
          a / x : a * x), "decimal_point"], [r2(
          ans * 10), "decimal_point"], [r2(ans / 10), "decimal_point"]], c);
      q.hint = H2(c, mul ? "Nhân với 10, 100, 1000: dấu phẩy dời sang PHẢI 1, 2, 3 chữ số." :
          "Chia cho 10, 100, 1000: dấu phẩy dời sang TRÁI 1, 2, 3 chữ số.", "Đếm số chữ số 0 của " + x +
          " để biết dời mấy chữ số. Thiếu chữ số thì thêm số 0.", mul ? "Times 10, 100, 1000: the point moves RIGHT 1, 2, 3 places." :
          "Divide by 10, 100, 1000: the point moves LEFT 1, 2, 3 places.", "Count the zeros of " + x +
              " to see how many places. Add zeros if you run out of digits."); return q;
    };
    G.frac_muldiv = function (c) {
      var v = VI(c), t = rnd(0, 2), a, b, d, e, n, dn, q, ans, wr, i = 0, st, cand;
      for (; i < 60; i++) {
        b = rnd(2, 8); a = rnd(1, b - 1); d = rnd(2, 8); e = rnd(1, d - 1);
        if (gcd(a, b) !== 1 || gcd(e, d) !== 1) continue;
        if (t === 0) { n = a * e; dn = b * d; } else if (t === 1) { n = a * d; dn = b * e; } else { n = a * (e + 1); dn = b; e = e + 1; d = 1; }
        if (n === dn || n > 2 * dn || gcd(n, dn) === dn) continue;
        cand = fr2(n, dn); if (cand.indexOf("/") < 0) continue; break;
      }
      ans = cand; var g0 = gcd(n, dn), nn = n / g0, dd = dn / g0;
      if (t === 0) { wr = [[fr2(a * d, b * e), "concept_confuse"], [(a + e) + "/" + (b + d), "add_denominator"], [fr2(a * e, b + d),
          "add_denominator"], [fr2(a + e, b * d), "add_denominator"]];
        st = [v ? "Nhân phân số: tử nhân tử, mẫu nhân mẫu." : "Multiply fractions: top × top, bottom × bottom.", v ?
            "Nhân xong, rút gọn phân số (chia cả tử và mẫu cho cùng một số) nếu được." : "Then simplify (divide top and bottom by the same number) if you can."];
        q = mk(a + "/" + b + " × " + e + "/" + d + " = <em>?</em>", ans, dedupe(wr, ans)); }
      else if (t === 1) { wr = [[fr2(a * e, b * d), "concept_confuse"], [fr2(b * e, a * d), "concept_confuse"], [fr2(a * e, b + d),
          "add_denominator"], [fr2(a * d, b + e), "add_denominator"]];
        st = [v ? "Chia cho một phân số thì nhân với phân số ĐẢO NGƯỢC (đổi chỗ tử và mẫu của số chia)." :
            "To divide by a fraction, multiply by its UPSIDE-DOWN fraction (swap its top and bottom).", v ?
            "Chỉ đảo phân số thứ hai (số chia). Sau đó nhân tử với tử, mẫu với mẫu và rút gọn." :
                "Flip only the second fraction (the divisor). Then multiply and simplify."];
        q = mk(a + "/" + b + " ÷ " + e + "/" + d + " = <em>?</em>", ans, dedupe(wr, ans)); }
      else { wr = [[fr2(a + e, b), "wrong_op"], [fr2(a, b * e), "concept_confuse"], [fr2(a * e, b * e), "concept_confuse"], [fr2(a * e + 1, b), "off_by_one"]];
        st = [v ? "Nhân phân số với số tự nhiên: giữ nguyên mẫu số, lấy tử số nhân với số đó." :
            "Fraction × whole number: keep the bottom, multiply the top by the number.", v ?
            "Rút gọn kết quả nếu tử và mẫu cùng chia hết cho một số." : "Simplify if the top and bottom share a factor."];
        q = mk(a + "/" + b + " × " + e + " = <em>?</em>", ans, dedupe(wr, ans)); }
      q.hint = st; return q;
    };
    function dedupe(wr, ans) { var seen = {}; seen[ans] = 1; var o = []; wr.forEach(function (w) { var s = String(w[0]); if (!seen[s] && /\//.test(
        s) || (!seen[s] && /^\d+$/.test(s))) {
        seen[s] = 1; o.push(w); } }); var k = 2; while (o.length < 3 && k < 60) { var f = (parseInt(ans, 10) + k) + "/" + (parseInt(String(ans).split(
            "/")[1] || 7, 10) + k), s2 = f; if (
        !seen[s2]) { seen[s2] = 1; o.push([s2, "other"]); } k++; } return o.slice(0, 3); }

    
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["gen-g5"] = part;
})(typeof window !== "undefined" ? window : globalThis);
