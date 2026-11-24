/* Bộ máy học — Bộ sinh đo lường: đổi đơn vị, giờ/lịch, chuyển động, dữ liệu.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, R = EP.R, VI = EP.VI, fmt = EP.fmt, gcd = EP.gcd, mk = EP.mk, mkn = EP.mkn, pk = EP.pk, r2 = EP.r2, rnd = EP.rnd, shuf = EP.shuf;

    var UC = {
      2: [["m", "cm", 100], ["dm", "cm", 10], ["m", "dm", 10]],
      3: [["m", "cm", 100], ["km", "m", 1000], ["kg", "g", 1000], ["l", "ml", 1000], ["cm", "mm", 10], ["giờ|h", "phút|min", 60]],
      4: [["tấn|t", "kg", 1000], ["m²", "dm²", 100], ["dm²", "cm²", 100], ["giờ|h", "phút|min", 60], ["phút|min", "giây|s", 60], ["km", "m", 1000]],
      5: [["m", "cm", 100], ["km", "m", 1000], ["kg", "g", 1000], ["tấn|t", "kg", 1000], ["giờ|h", "phút|min", 60], ["m²", "dm²", 100]]
    };
    function un(s, c) { var p = s.split("|"); return VI(c) ? p[0] : (p[1] || p[0]); }
    G.unit_convert = function (c) {
      var g = c.grade, v = VI(c), t = pk(UC[g]), big = un(t[0], c), sm = un(t[1], c), f = t[2], dec = g === 5, down = R() < .6, n, from, to, ans, ub, us;
      if (down) { n = dec ? rnd(11, 99) / 10 : rnd(2, 9); ans = r2(n * f); from = n; ub = big; us = sm; }
      else { n = dec ? rnd(11, 99) * f / 10 : rnd(2, 9) * f; ans = r2(n / f); from = n; ub = sm; us = big; }
      var wr = down ? [[ans * 10, "unit_convert"], [ans / 10, "unit_convert"], [r2(n / f), "unit_convert"]] : [[ans * 10, "unit_convert"], [ans / 10,
          "unit_convert"], [r2(n * f), "unit_convert"]];
      if (!dec) wr = wr.filter(function (w) { return w[0] === Math.floor(w[0]); }).concat([[ans * 100, "unit_convert"], [ans * f, "unit_convert"],
          [n + f, "unit_convert"]]);
          /* lớp 2–4 chưa học số thập phân: đáp án nhiễu phải là số tự nhiên (L3-20) */
      return mkn(fmt(r2(from), c.lang) + " " + ub + " = <em>?</em> " + us, ans, wr, c, us);
    };
    G.measure_compare = function (c) {
      var g = c.grade, v = VI(c), a = g === 1 ? rnd(3, 10) : rnd(20, 60), b = g === 1 ? rnd(a + 1, 15) : rnd(a + 1, 95), x = pk([["bút chì",
          "pencil"], ["sợi dây", "string"], ["cái thước",
          "ruler"]]), y = pk([["bút bi", "pen"], ["đoạn băng", "ribbon"], ["que tính", "stick"]]);
      if (R() < .5) return mkn(v ? "<em>" + x[0].replace(/^./, function (m) { return m.toUpperCase(); }) + "</em> dài " + a + " cm, <em>" + y[0] +
          "</em> dài " + b + " cm. " + y[0].replace(
          /^./, function (m) { return m.toUpperCase(); }) + " dài hơn " + x[0] + " mấy cm?" : "The " + x[1] + " is " + a + " cm long and the " + y[1] + " is " + b +
          " cm. How many cm longer is the " + y[1] + "?", b - a, [[a + b, "wrong_op"], [b - a + 10, "tens_error"], [b - a - 10, "tens_error"],
              [b - a + 1, "other"]], c, "cm");
      return mkn(v ? "Nối <em>" + x[0] + "</em> dài " + a + " cm với <em>" + y[0] + "</em> dài " + b + " cm. Cả hai dài bao nhiêu cm?" : "Join the " +
          x[1] + " (" + a + " cm) and the " +
          y[1] + " (" + b + " cm). How long are they together?", a + b, [[b - a, "wrong_op"], [a + b + 10, "tens_error"], [a + b - 10,
              "forget_carry"], [a + b + 1, "other"]], c, "cm");
    };

    var WD = [["Thứ Hai", "Mon"], ["Thứ Ba", "Tue"], ["Thứ Tư", "Wed"], ["Thứ Năm", "Thu"], ["Thứ Sáu", "Fri"], ["Thứ Bảy", "Sat"], ["Chủ nhật", "Sun"]];
    function hm(h, m, c) { return VI(c) ? h + " giờ" + (m ? " " + m + " phút" : "") : h + ":" + (m < 10 ? "0" : "") + m; }
    function dur(h, m, c) { return VI(c) ? (h ? h + " giờ" : "") + (h && m ? " " : "") + (m ? m + " phút" : "") : (h ? h + " h" : "") + (h && m ?
        " " : "") + (m ? m + " min" : ""); }
    G.time_calc = function (c) {
      var g = c.grade, v = VI(c), i = v ? 0 : 1, h, m, d, e, k, wr, ans;
      if (g <= 2) {
        var t = g === 1 ? rnd(0, 1) : rnd(0, 2);
        if (t === 0) { k = rnd(0, 6); d = g === 1 ? 1 : rnd(2, 5); ans = WD[(k + d) % 7][i];
          return mk(v ? "Hôm nay là <em>" + WD[k][0] + "</em>. " + (d === 1 ? "Ngày mai" : d + " ngày sau") + " là thứ mấy?" : "Today is <em>" +
              WD[k][1] + "</em>. What day is it " + (
              d === 1 ? "tomorrow" : d + " days later") + "?",
            ans, [[WD[(k + d + 1) % 7][i], "off_by_one"], [WD[(k + d + 6) % 7][i], "off_by_one"], [WD[(k + d + 3) % 7][i], "other"]]); }
        if (t === 1) { h = rnd(1, 8); d = rnd(1, 4); return mkn(v ? "Bây giờ là <em>" + h + " giờ</em>. Sau <em>" + d + " giờ</em> nữa là mấy giờ?" : "It is <em>" + h +
            " o'clock</em>. What time is it <em>" + d + " hours</em> later?", h + d, [[h - d > 0 ? h - d : h + d + 1, "wrong_op"], [h + d + 1,
                "off_by_one"], [h + d - 1, "off_by_one"]], c,
            v ? "giờ" : "o'clock"); }
        var mo = pk([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), days = [4, 6, 9, 11].indexOf(mo) >= 0 ? 30 : 31;
        return mkn(v ? "Tháng <em>" + mo + "</em> có bao nhiêu ngày?" : "How many days does month <em>" + mo + "</em> have?", days, [[days === 30 ?
            31 : 30, "concept_confuse"], [28,
            "concept_confuse"], [29, "concept_confuse"]], c, v ? "ngày" : "days");
      }
      if (g === 3) { h = rnd(6, 11); m = rnd(0, 30); e = m + rnd(5, 29); return mkn(v ? "Từ <em>" + hm(h, m, c) + "</em> đến <em>" + hm(h, e, c) +
          "</em> là bao nhiêu phút?" : "From <em>" +
          hm(h, m, c) + "</em> to <em>" + hm(h, e, c) + "</em> is how many minutes?", e - m, [[e + m, "wrong_op"], [60 - (e - m), "unit_convert"],
              [e - m + 5, "off_by_one"]], c, v ? "phút" :
          "min"); }
      if (g === 4) {
        var sh = rnd(6, 16), sm = rnd(0, 11) * 5, dh = rnd(0, 2), dm = rnd(1, 11) * 5, tm = sm + dm, eh = sh + dh + Math.floor(tm / 60), em = tm % 60;
        if (!dh && !dm) dm = 15;
        ans = hm(eh, em, c); wr = [[tm >= 60 ? hm(sh + dh, tm, c) : hm(eh, (em + 10) % 60, c), "unit_convert"], [hm(eh + 1, em, c), "off_by_one"],
            [hm(eh - 1 > 0 ? eh - 1 : eh + 2, em, c),
            "off_by_one"], [hm(eh, (em + 5) % 60, c), "other"]];
        return mk(v ? "Bắt đầu lúc <em>" + hm(sh, sm, c) + "</em>, làm trong <em>" + dur(dh, dm, c) + "</em>. Kết thúc lúc mấy giờ?" : "Start at <em>" + hm(sh, sm, c) +
            "</em> and work for <em>" + dur(dh, dm, c) + "</em>. When does it end?", ans, wr.filter(function (x) { return x[0] !== ans; }).slice(0, 3));
      }
      var h1 = rnd(7, 15), m1 = rnd(1, 11) * 5, h2, m2, dh2, dm2;
      do { h2 = h1 + rnd(1, 4); m2 = rnd(0, 11) * 5; dm2 = m2 - m1; dh2 = h2 - h1; if (dm2 < 0) { dh2--; dm2 += 60; } } while (dh2 < 0 || (!dh2 &&
          !dm2) || m2 > m1 + 55 || dm2 === Math.abs(m2 - m1));
      ans = dur(dh2, dm2, c);
      return mk(v ? "Từ <em>" + hm(h1, m1, c) + "</em> đến <em>" + hm(h2, m2, c) + "</em> là bao lâu?" : "How long from <em>" + hm(h1, m1, c) +
          "</em> to <em>" + hm(h2, m2, c) + "</em>?",
          ans, [[dur(h2 - h1, Math.abs(m2 - m1), c), "unit_convert"], [dur(dh2 + 1, dm2, c), "off_by_one"], [dur(Math.max(0, dh2 - 1), dm2, c),
              "off_by_one"], [dur(dh2, (dm2 + 10) % 60, c),
          "other"]].filter(function (x) { return x[0] !== ans; }).slice(0, 3));
    };

    G.money_calc = function (c) {
      var g = c.grade, v = VI(c), D = v ? " đồng" : " dong", a, b, s, m, k, p, nt = [1000, 2000, 5000, 10000, 20000], money = function (n) { return n; };
      if (g === 1) { a = pk([1000, 2000, 5000]); b = pk([1000, 2000, 5000]); return mkn(v ? "Mai có tờ <em>" + a + " đồng</em> và tờ <em>" + b +
          " đồng</em>. Mai có tất cả bao nhiêu đồng?" :
          "Mai has a <em>" + a + " dong</em> note and a <em>" + b + " dong</em> note. How much does she have?", a + b, [[Math.abs(a - b), "wrong_op"],
              [a + b + 1000, "off_by_one"], [a +
          b - 1000, "off_by_one"]], c, v ? "đồng" : "dong"); }
      if (g === 2) {   /* GDPT 2018 lớp 2: tiền Việt trong phạm vi 1000 đồng (tờ 100, 200, 500, 1000) → số nhỏ, đề ngắn */
        if (R() < .5) { a = rnd(1, 4) * 100; b = rnd(1, 5) * 100; return mkn(v ? "Bút giá <em>" + a + " đồng</em>, tẩy giá <em>" + b +
            " đồng</em>. Mua cả hai hết bao nhiêu?" :
            "A pen costs <em>" + a + " dong</em> and an eraser <em>" + b + " dong</em>. How much for both?", a + b, [[Math.abs(a - b), "wrong_op"],
                [a + b + 100, "tens_error"], [a + b - 100,
            "tens_error"]], c, v ? "đồng" : "dong"); }
        a = rnd(2, 9) * 100; return mkn(v ? "Mai đưa <em>1000 đồng</em> mua truyện giá <em>" + a + " đồng</em>. Mai được trả lại bao nhiêu?" :
            "Mai pays <em>1000 dong</em> for a book that costs <em>" + a + " dong</em>. How much change?", 1000 - a, [[1000 + a, "wrong_op"], [a,
                "wrong_op"], [1000 - a + 100, "tens_error"],
            [1000 - a - 100, "tens_error"]], c, v ? "đồng" : "dong");
      }
      if (g === 3) { p = rnd(2, 9) * 1000; k = rnd(2, 6); return mkn(v ? "Một quyển vở giá <em>" + p + " đồng</em>. Mua <em>" + k + "</em> quyển hết bao nhiêu tiền?" :
          "One notebook costs <em>" + p + " dong</em>. How much for <em>" + k + "</em> notebooks?", p * k, [[p + k, "wrong_op"], [p * k + 1000,
              "off_by_one"], [p * k - 1000, "off_by_one"]],
          c, v ? "đồng" : "dong"); }
      p = rnd(2, 8) * 1000; k = rnd(2, 5); var q = rnd(3, 9) * 1000, tot = p * k + q; m = Math.ceil((tot + 1) / 10000) * 10000;
      return mkn(v ? "Mua <em>" + k + "</em> cái bút giá <em>" + p + " đồng</em> một cái và một quyển vở giá <em>" + q + " đồng</em>. Đưa <em>" + m +
          " đồng</em>, được trả lại bao nhiêu?" :
          "Buy <em>" + k + "</em> pens at <em>" + p + " dong</em> each and a notebook for <em>" + q + " dong</em>. Pay <em>" + m +
              " dong</em>. How much change?", m - tot, [[tot,
          "wrong_op"], [m - p * k, "wrong_op"], [m - (p + q), "wrong_op"]], c, v ? "đồng" : "dong");
    };
    G.motion = function (c) {
      var v = VI(c), t = rnd(2, 6), sp = rnd(2, 15) * 5, s = sp * t, k = rnd(0, 2), kmh = v ? "km/giờ" : "km/h", h = v ? "giờ" : "h";
      if (k === 0) return mkn(v ? "Ô tô đi <em>" + s + " km</em> trong <em>" + t + " giờ</em>. Vận tốc của ô tô là?" : "A car travels <em>" + s + " km</em> in <em>" + t +
          " hours</em>. Its speed is?", sp, [[s * t, "formula_confuse"], [s + t, "formula_confuse"], [t, "formula_confuse"]], c, kmh);
      if (k === 1) return mkn(v ? "Xe máy đi với vận tốc <em>" + sp + " km/giờ</em> trong <em>" + t + " giờ</em>. Quãng đường đi được là?" :
          "A motorbike goes at <em>" + sp +
          " km/h</em> for <em>" + t + " hours</em>. The distance is?", s, [[sp / t | 0, "formula_confuse"], [sp + t, "formula_confuse"], [s + sp,
              "off_by_one"]], c, "km");
      return mkn(v ? "Người đi xe đạp đi <em>" + s + " km</em> với vận tốc <em>" + sp + " km/giờ</em>. Thời gian đi là?" : "A cyclist rides <em>" +
          s + " km</em> at <em>" + sp +
          " km/h</em>. The time taken is?", t, [[s * sp, "formula_confuse"], [s - sp, "formula_confuse"], [t + 1, "off_by_one"]], c, h);
    };

    /* toán đố nhiều bước (mẫu câu, đáp án tính bằng code) */
    G.word_multi = function (c) {
      var g = c.grade, v = VI(c), t = rnd(0, g === 3 ? 2 : g === 4 ? 4 : 5), a, b, d, k, p, m, tot, nm = pk([["Lan", "Lan"], ["Nam", "Nam"], ["Mai",
          "Mai"], ["Bình", "Binh"]]);
      if (t === 0) { p = rnd(2, 9) * 1000 * (g > 3 ? 2 : 1); k = rnd(2, 5); tot = p * k; m = Math.ceil((tot + 1) / 10000) * 10000;
        return mkn(v ? nm[0] + " mua " + k + " quyển vở, mỗi quyển giá " + p + " đồng, và đưa cô bán hàng " + m + " đồng. Cô trả lại " + nm[0] +
            " bao nhiêu đồng?" : nm[1] + " buys " + k +
            " notebooks at " + p + " dong each and pays " + m + " dong. How much change?", m - tot, [[tot, "wrong_op"], [m - p, "wrong_op"], [m + tot,
                "wrong_op"]], c, v ? "đồng" : "dong");
            }
      if (t === 1) { b = rnd(3, 8); var q = rnd(3, 9); d = rnd(2, 6); a = b * q;
        return mkn(v ? "Có " + a + " cái kẹo chia đều cho " + b + " bạn. Sau đó mỗi bạn được cho thêm " + d + " cái. Mỗi bạn có bao nhiêu cái kẹo?" : a +
            " sweets are shared equally among " + b + " friends. Then each friend gets " + d + " more. How many sweets does each have?", q + d, [[q,
                "wrong_op"], [a + d, "wrong_op"], [q * d,
            "wrong_op"]], c); }
      if (t === 2) { a = rnd(20, 90) * (g > 3 ? 10 : 1); d = rnd(5, 30); return mkn(v ? "Buổi sáng cửa hàng bán " + a +
          " kg gạo. Buổi chiều bán nhiều hơn buổi sáng " + d +
          " kg. Cả ngày bán bao nhiêu kg gạo?" : "A shop sells " + a + " kg of rice in the morning and " + d +
              " kg more in the afternoon. How many kg in the whole day?", 2 * a + d, [[a + d,
          "wrong_op"], [2 * a, "wrong_op"], [a * d, "wrong_op"]], c, "kg"); }
      if (t === 3) { a = rnd(100, 900); return mkn(v ? "Xe thứ nhất chở " + a +
          " kg gạo, xe thứ hai chở gấp đôi xe thứ nhất. Cả hai xe chở bao nhiêu kg gạo?" : "The first truck carries " +
          a + " kg of rice and the second carries twice as much. How many kg in total?", 3 * a, [[2 * a, "wrong_op"], [a, "wrong_op"], [4 * a, "wrong_op"]], c, "kg"); }
      if (t === 4) { var lg = rnd(10, 60), sm = rnd(5, lg - 1); if ((lg + sm) % 2) sm--; if (sm < 1) { sm = 2; lg = 4; } var S = lg + sm, D = lg - sm;
        return mkn(v ? "Tổng của hai số là " + S + ", hiệu của hai số là " + D + ". Số lớn là?" : "Two numbers add up to " + S + " and differ by " +
            D + ". The larger number is?", lg, [[sm,
            "concept_confuse"], [S - D, "wrong_op"], [S + D, "wrong_op"]], c); }
      if (R() < .5) { var n = rnd(2, 12) * 20, pc = pk([20, 25, 40, 60, 75]), part = n * pc / 100; return mkn(v ? "Lớp có " + n + " học sinh, trong đó " + pc +
          "% là học sinh nữ. Lớp có bao nhiêu học sinh nam?" : "A class has " + n + " students and " + pc + "% are girls. How many boys are there?",
              n - part, [[part, "wrong_op"], [pc,
          "percent_misread"], [n + part, "wrong_op"]], c); }
      var x = rnd(2, 9) * 10000, dc = pk([10, 20, 25, 50]), off = x * dc / 100; return mkn(v ? "Một chiếc áo giá " + x + " đồng, được giảm giá " + dc +
          "%. Giá chiếc áo sau khi giảm là bao nhiêu đồng?" : "A shirt costs " + x + " dong and is " + dc + "% off. What is the new price?", x - off,
              [[off, "wrong_op"], [x + off,
          "wrong_op"], [x - dc, "percent_misread"]], c, v ? "đồng" : "dong");
    };

    /* dữ liệu: tranh, bảng, trung bình cộng, phần trăm */
    G.data_read = function (c) {
      var g = c.grade, v = VI(c), em = shuf(["🍎", "🍌", "🍇", "🍓", "🥕"]), n1, n2, n3, rows;
      if (g <= 2) {
        n1 = rnd(2, 6); do { n2 = rnd(2, 8); } while (n2 === n1); do { n3 = rnd(2, 9); } while (n3 === n1 || n3 === n2);
        var cnt = [n1, n2, n3], pic = "<br>" + cnt.map(function (n, i) { return em[i] + " : " + new Array(n + 1).join(em[i]); }).join("<br>") + "<br>";
        if (g === 1 || R() < .4) { var i = rnd(0, 2); return mkn((v ? "Có mấy " : "How many ") + em[i] + (v ? "?" : " are there?") + pic, cnt[i],
            [[cnt[i] + 1, "read_chart"], [cnt[i] - 1,
            "read_chart"], [cnt[(i + 1) % 3], "read_chart"]], c); }
        var mx = cnt.indexOf(Math.max.apply(null, cnt));
        if (R() < .5) return mk((v ? "Loại nào <em>nhiều nhất</em>?" : "Which has the <em>most</em>?") + pic, em[mx], [0, 1, 2].filter(function (x) {
            return x !== mx; }).map(function (x) {
            return [em[x], "read_chart"]; }).concat([[em[3], "other"]]));
        var hi = Math.max.apply(null, cnt), lo = Math.min.apply(null, cnt); return mkn((v ? "Loại nhiều nhất hơn loại ít nhất mấy cái?" :
            "How many more does the biggest group have than the smallest?") + pic, hi - lo, [[hi + lo, "wrong_op"], [hi, "read_chart"], [hi - lo + 1, "off_by_one"]], c);
      }
      var days = v ? ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm"] : ["Mon", "Tue", "Wed", "Thu"], lab = v ? "quyển sách" : "books", vals;
      if (g === 5) { var T = pk([20, 25, 50]); vals = [rnd(2, T / 2 - 2), 0, 0, 0]; vals[1] = rnd(2, T / 2 - 2); vals[2] = rnd(2, T / 2 - 2);
          vals[3] = T - vals[0] - vals[1] - vals[2]; if (
          vals[3] < 1) vals = [T / 5, T / 5, T / 5, 2 * T / 5]; }
      else { vals = [rnd(10, 40), rnd(10, 40), rnd(10, 40), rnd(10, 40)]; }
      if (g === 4) { var sum = vals.reduce(function (x, y) { return x + y; }, 0); vals[3] += (4 - sum % 4) % 4; }
      if (g <= 4) { var mxv = Math.max.apply(null, vals); if (vals.filter(function (z) { return z === mxv; }).length > 1) vals[vals.indexOf(mxv)] += 4;
          }   /* "nhiều nhất" phải có ĐÚNG MỘT ngày (cộng 4 giữ nguyên tính chia hết cho 4 của trung bình) */
      /* bảng có THANH (biểu đồ cột ngang): dữ liệu hiện TRƯỚC, câu hỏi nằm SAU dữ liệu (L5-11, L4-09) */
      var mxr = Math.max.apply(null, vals), BAR = ["#60a5fa", "#34d399", "#fbbf24", "#f472b6"];
      rows = "<div style=\"margin:4px auto 6px;max-width:30em;font-size:.72em;font-weight:700;line-height:1.25;text-align:left\"><div style=\"opacity:.8;text-align:center;font-size:.85em;margin-bottom:2px\">" +
          (v ? "Số " + lab + " bán được" : "Books sold") + "</div>" + vals.map(function (x, i) {
          return "<div style=\"display:flex;align-items:center;gap:6px;margin:2px 0\"><span style=\"flex:0 0 4.6em;text-align:right\">" + days[i] +
          "</span><span style=\"flex:1;min-width:0\"><i style=\"display:block;height:.95em;border-radius:5px;background:" + BAR[i] + ";width:" +
              Math.max(6, Math.round(x * 100 / mxr)) +
          "%\"></i></span><b style=\"flex:0 0 2.2em\">" + x + "</b></div>"; }).join("") + "</div>";
      var total = vals.reduce(function (x, y) { return x + y; }, 0), j = rnd(0, 3), hiI = vals.indexOf(Math.max.apply(null, vals)), t = rnd(0, g === 3 ? 1 : 2);
      if (g === 5) return mkn(rows + (v ? days[j] + " chiếm bao nhiêu phần trăm cả bốn ngày?" : "What percent of all four days is " + days[j] + "?"),
          vals[j] * 100 / total, [[vals[j],
          "percent_misread"], [total - vals[j], "read_chart"], [vals[j] * 100 / total + 5, "percent_misread"]], c, "%");
      if (t === 0) return mkn(rows + (v ? "Cả bốn ngày bán được bao nhiêu " + lab + "?" : "How many books were sold in all four days?"), total,
          [[total - vals[0], "read_chart"], [total + 10,
          "off_by_one"], [total - 10, "off_by_one"]], c);
      if (t === 1) return mk(rows + (v ? "Ngày nào bán được <em>nhiều nhất</em>?" : "Which day sold the <em>most</em>?"), days[hiI], [0, 1, 2,
          3].filter(function (x) { return x !== hiI;
          }).map(function (x) { return [days[x], "read_chart"]; }));
      return mkn(rows + (v ? "Trung bình mỗi ngày bán được bao nhiêu " + lab + "?" : "On average, how many books were sold per day?"), total / 4,
          [[total, "wrong_op"], [total / 4 + 1,
          "off_by_one"], [Math.max.apply(null, vals), "read_chart"]], c);
    };

    /* phân số */
    G.fraction_of = function (c) {
      var g = c.grade, v = VI(c), n, a, b, k, m, wr, ans;
      if (g === 3 || (g === 4 && R() < .4)) {
        n = pk([2, 3, 4, 5, 6]); k = rnd(2, g === 3 ? 9 : 12); m = n * k; a = g === 3 ? 1 : rnd(1, n - 1);
        return mkn(v ? "<em>" + a + "/" + n + "</em> của " + m + " là bao nhiêu?" : "What is <em>" + a + "/" + n + "</em> of " + m + "?", k * a,
            [[m * n, "wrong_op"], [k * (a === 1 ? 1 : 1),
            "concept_confuse"], [m - k, "concept_confuse"], [k * a + 1, "off_by_one"]], c);
      }
      if (g === 4) {
        n = rnd(4, 12); a = rnd(1, n - 3); b = rnd(1, n - a - 1);
        ans = a + b + "/" + n; wr = [[(a + b) + "/" + (n * 2), "add_denominator"], [(a + b) + "/" + (n + n), "add_denominator"], [a + "/" + n,
            "concept_confuse"], [(a + b + 1) + "/" + n, "off_by_one"]];
        return mk(a + "/" + n + " + " + b + "/" + n + " = <em>?</em>", ans, wr.filter(function (x, i, arr) { return x[0] !== ans && arr.findIndex(
            function (y) { return y[0] === x[0]; }) === i; }).slice(0, 3));
      }
      if (R() < .5) { n = pk([4, 5, 8, 10]); k = rnd(3, 12); m = n * k; a = rnd(1, n - 1); return mkn(v ? "<em>" + a + "/" + n + "</em> của " + m +
          " là bao nhiêu?" : "What is <em>" + a +
          "/" + n + "</em> of " + m + "?", k * a, [[k, "concept_confuse"], [m * a, "wrong_op"], [k * (n - a), "concept_confuse"]], c); }
      var d1, d2, t, x, y, sN, sD;
      do { d1 = pk([2, 3, 4, 5]); t = rnd(2, 4); d2 = d1 * t; x = rnd(1, d1 - 1); y = rnd(1, d2 - 1); sN = x * t + y; sD = d2; } while (gcd(sN,
          sD) !== 1 || sN >= sD * 2);
      ans = sN + "/" + sD;
      wr = [[(x + y) + "/" + (d1 + d2), "add_denominator"], [(x + y) + "/" + d2, "add_denominator"], [(x + y) + "/" + d1, "add_denominator"], [(sN +
          1) + "/" + sD, "off_by_one"]];
      return mk(x + "/" + d1 + " + " + y + "/" + d2 + " = <em>?</em>", ans, wr.filter(function (z, i, arr) { return z[0] !== ans && arr.findIndex(
          function (y2) { return y2[0] === z[0];
          }) === i; }).slice(0, 3));
    };

    /* quy luật */
    G.pattern_seq = function (c) {
      var g = c.grade, v = VI(c), seq = [], st, d, i, ans, wr, x, ns, pk2 = "lin";
      if (g === 1 && R() < .5) {
        var E2 = shuf(["🔴", "🔵", "🟡", "🟢", "🟣"]), A = E2[0], B = E2[1], pat = R() < .5 ? [A, B] : [A, A, B], full = [], L = pat.length;
        for (i = 0; i < 6; i++) full.push(pat[i % L]); var nx = pat[6 % L];
        return mk((v ? "Hình tiếp theo là gì?" : "What comes next?") + "<br>" + full.join(" ") + " <em>?</em>", nx, E2.filter(function (e) {
            return e !== nx; }).slice(0, 3).map(function (
            e) { return [e, "pattern_miss"]; }));
      }
      if (g <= 2) { d = g === 1 ? pk([1, 2, 5, 10]) : pk([2, 3, 4, 5, 10, 20, 50]); st = g === 1 ? rnd(0, 5) * (d > 2 ? 0 : 1) + (d > 2 ? d : 1) :
          rnd(1, 10) * 2; var down = g === 2 && R(
          ) < .35; if (down) { st = d * rnd(6, 12); d = -d; } for (i = 0; i < 5; i++) seq.push(st + d * i); ans = st + d * 5; }
      else if (g === 3) { if (R() < .5) { pk2 = "geo"; st = rnd(1, 4); for (i = 0; i < 5; i++) seq.push(st * Math.pow(2, i)); ans = st * 32; } else {
          pk2 = "tri"; st = rnd(1, 5); x = st;
          for (i = 0; i < 5; i++) { seq.push(x); x += i + 1; } ans = x; } }
      else if (g === 4) { if (R() < .5) { pk2 = "sq"; for (i = 1; i <= 5; i++) seq.push(i * i); ans = 36; } else { pk2 = "geo"; st = rnd(1, 3); for (
          i = 0; i < 5; i++) seq.push(
          st * Math.pow(3, i)); ans = st * 243; } }
      else { if (R() < .5) { pk2 = "fib"; var f1 = rnd(1, 3), f2 = rnd(1, 4); seq = [f1, f2]; for (i = 2; i < 6; i++) seq.push(seq[i - 1] +
          seq[i - 2]); ans = seq[5] + seq[4];
          seq = seq.slice(0, 6); } else { d = pk([.5, .25, 1.5, .2]); st = rnd(1, 5); for (i = 0; i < 5; i++) seq.push(r2(st + d * i)); ans = r2(st + d * 5); } }
      var last = seq[seq.length - 1], prev = seq[seq.length - 2], step = last - prev;
      wr = [[r2(ans + 1), "off_by_one"], [r2(ans - 1), "off_by_one"], [r2(last + step * 2), "pattern_miss"], [r2(last + (last - prev) / 2 + prev),
          "pattern_miss"], [r2(last * 2),
          "pattern_miss"], [r2(ans + (ans - last)), "pattern_miss"]];
      var qq = mkn((v ? "Số tiếp theo là số nào?" : "What number comes next?") + "<br>" + seq.map(function (z) { return fmt(z, c.lang); }).join(
          ", ") + ", <em>?</em>", ans, wr, c);
      /* gợi ý theo ĐÚNG kiểu quy luật của câu (không dùng chung "hơn bao nhiêu, gấp mấy lần" cho dãy cộng hai số liền trước) */
      var PH = { fib: [["Thử cộng HAI số liền trước: mỗi số bằng tổng của hai số đứng ngay trước nó.",
          "Kiểm tra trên các số đầu của dãy (số thứ ba = số thứ nhất + số thứ hai…), rồi áp dụng cho số cần tìm."],
          ["Try adding the TWO numbers before: each number is the sum of the two just before it.",
              "Check on the first numbers of the row, then use it for the missing one."]],
        geo: [["Chia mỗi số cho số đứng trước: nếu được cùng một kết quả thì dãy gấp lên bấy nhiêu lần.", "Lấy số cuối nhân với số lần đó."],
            ["Divide each number by the one before it: the same result means the row multiplies by that.", "Multiply the last number by it."]],
        tri: [["Tính hiệu của hai số liền nhau: các hiệu có tăng dần đều không?", "Nếu hiệu tăng thêm 1 mỗi lần, hãy viết tiếp hiệu mới rồi cộng vào số cuối."],
            ["Work out the gaps between neighbours: do the gaps grow steadily?", "If the gap grows by 1 each time, write the next gap and add it to the last number."]],
        sq: [["Thử xem mỗi số có phải là một số nhân với chính nó không (1×1, 2×2, 3×3…).", "Số thứ n bằng n × n: tìm xem số cần tìm đứng thứ mấy."],
            ["Is each number a number times itself (1×1, 2×2, 3×3…)?", "The nth number is n × n: find which place the missing one is."]],
        lin: [["Tìm xem mỗi số hơn (hoặc kém) số trước bao nhiêu.", "Kiểm tra mức chênh đó đúng với CẢ dãy rồi mới cộng (hoặc trừ) cho số cuối."],
            ["Find how much each number is bigger (or smaller) than the one before.",
                "Check the gap works for the WHOLE row, then add (or subtract) it from the last number."]] };
      qq.hint = PH[pk2][v ? 0 : 1].slice(); return qq;
    };

    
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["gen-measure"] = part;
})(typeof window !== "undefined" ? window : globalThis);
