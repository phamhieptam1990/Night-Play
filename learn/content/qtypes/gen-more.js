/* Kiểu câu hỏi — kiểu tương tác thêm: đếm, lật thẻ, trục số, đồng hồ, tìm trong tranh, kéo thẻ, phân loại.
   Một phần của learn/content/qtypes.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung TP. */
(function (root) {
  "use strict";
  function part(TP) {
    var CAT = TP.CAT, G = TP.G, R = TP.R, RANGE = TP.RANGE, SENT = TP.SENT, V = TP.V, arith = TP.arith, arithPair = TP.arithPair, base = TP.base,
        distinctNums = TP.distinctNums, name = TP.name, optList = TP.optList, pick = TP.pick, rnd = TP.rnd, shuf = TP.shuf, word = TP.word;

    /* ====== 8 kiểu tương tác thêm ====== */
    /* đếm bằng chạm: chạm từng vật để đếm rồi chọn số */
    G.count = function (subj, g, lang) {
      if (subj !== "toan" || g > 2) return null;
      var n = rnd(3, 9), e = pick(["🍎", "⭐", "🐟", "🎈", "🌸", "🐥"]), cs = [n], t = 0; while (cs.length < 4 && t++ < 60) { var k = rnd(Math.max(1,
          n - 3), n + 3); if (cs.indexOf(k) < 0) cs.push(k); }
      var order = shuf(cs), o = optList(order.map(String), order.indexOf(n)); o.forEach(function (x) { if (!x.ok && Math.abs(Number(
          x.v) - n) === 1) x.tag = "off_by_one"; });
      return base("count", subj, g, lang, lang === "vi" ? "Chạm vào từng " + e + " để đếm" : "Tap each " + e + " to count", { n: n, e: e, o: o, speak: lang === "vi" ?
          "Chạm vào từng hình để đếm, rồi chọn số." : "Tap each one to count, then pick the number.", reveal: String(n) });
    };
    /* lật thẻ trí nhớ: 4 cặp */
    G.memory = function (subj, g, lang) {
      var pairs = [];
      if (subj === "toan") { if (g > 3) return null; var seen = {}, t = 0; while (pairs.length < 4 && t++ < 80) { var x = arithPair(g); if (
          !seen[x.res]) { seen[x.res] = 1; pairs.push(
          [x.txt, String(x.res)]); } } if (pairs.length < 4) return null; }
      else pairs = shuf(V.filter(function (v) { return word(v, subj); })).slice(0, 4).map(function (v) { return [v.e, name(v, subj)]; });
      return base("memory", subj, g, lang, lang === "vi" ? "Lật hai thẻ để tìm <em>cặp giống nhau</em>" :
          "Flip two cards to find a <em>matching pair</em>", { pairs: pairs, speak:
          lang === "vi" ? "Lật hai thẻ để tìm cặp giống nhau." : "Flip two cards to find a matching pair." });
    };
    /* trục số: kéo con trượt tới đúng số */
    G.numline = function (subj, g, lang) {
      if (subj !== "toan") return null;
      var cfg = [{ min: 0, max: 10, step: 1 }, { min: 0, max: 100, step: 5 }, { min: 0, max: 1000, step: 50 }, { min: 0, max: 10000, step: 500 }, {
          min: 0, max: 10, step: 1, dec:
          1 }][g - 1], k = rnd(1, (cfg.max - cfg.min) / cfg.step - 1), target = cfg.min + k * cfg.step;
      var shown = cfg.dec ? (target / 10).toString().replace(".", lang === "vi" ? "," : ".") : String(target);
      return base("numline", subj, g, lang, (lang === "vi" ? "Đặt điểm đúng chỗ của <em>" : "Put the dot at <em>") + shown + "</em>", { min: cfg.min,
          max: cfg.max, step: cfg.step, dec:
          cfg.dec || 0, target: target, lang: lang, speak: lang === "vi" ? "Kéo điểm tới số " + shown + "." : "Drag the dot to " + shown + ".", reveal: shown });
    };
    /* xem đồng hồ: kim chỉ mấy giờ → chọn giờ đúng */
    G.clock = function (subj, g, lang) {
      if (subj !== "toan" || g > 3) return null;
      var hr = rnd(1, 12), mi = g === 1 ? pick([0, 30]) : g === 2 ? pick([0, 15, 30, 45]) : rnd(0, 11) * 5, f = function (h, m) { return h + ":" + (
          m < 10 ? "0" : "") + m; }, ans = f(hr,
          mi), opts = [ans], t = 0;
      while (opts.length < 4 && t++ < 80) { var h2 = R() < .5 ? hr : rnd(1, 12), m2 = R() < .5 ? mi : (g === 1 ? pick([0, 30]) : rnd(0, 11) * 5),
          v = f(h2, m2); if (opts.indexOf(v) < 0) opts.push(v); }
      var order = shuf(opts);
      return base("clock", subj, g, lang, lang === "vi" ? "Đồng hồ chỉ <em>mấy giờ?</em>" : "What <em>time</em> is it?", { h: hr, m: mi, o: optList(
          order, order.indexOf(ans)), speak:
          lang === "vi" ? "Đồng hồ chỉ mấy giờ?" : "What time is it?", reveal: ans });
    };
    /* tìm trong tranh: chạm đúng vật / số được hỏi giữa nhiều vật */
    G.find = function (subj, g, lang) {
      if (subj === "toan") {
        var r = RANGE[g - 1], nums = distinctNums(9, r[0], r[1]), big = R() < .5, tv = big ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
        return base("find", subj, g, lang, big ? (lang === "vi" ? "Chạm vào <em>số lớn nhất</em>" : "Tap the <em>biggest number</em>") : (
            lang === "vi" ? "Chạm vào <em>số nhỏ nhất</em>" :
            "Tap the <em>smallest number</em>"), { o: nums.map(function (n) { var x = { v: String(n) }; if (n === tv) x.ok = 1; return x; }), dk:
                "find", speak: big ? (lang === "vi" ?
            "Chạm vào số lớn nhất." : "Tap the biggest number.") : (lang === "vi" ? "Chạm vào số nhỏ nhất." : "Tap the smallest number."), reveal: String(tv) });
      }
      var v = pick(V), rest = shuf(V.filter(function (x) { return x !== v; })).slice(0, 8), all = shuf([v].concat(rest)), nm = name(v, subj);
      return base("find", subj, g, lang, subj === "tanh" ? (lang === "vi" ? "Tìm <em>" + nm + "</em>" : "Find the <em>" + nm + "</em>") : (
          lang === "vi" ? "Tìm <em>" + nm + "</em>" :
          "Find <em>" + nm + "</em>"), { o: all.map(function (x) { var o = { v: x.e }; if (x === v) o.ok = 1; return o; }), dk: "find", speak:
              subj === "tanh" ? (lang === "vi" ? "Tìm " +
          nm + "." : "Find the " + nm + ".") : (lang === "vi" ? "Tìm " + nm + "." : "Find " + nm + "."), reveal: v.e });
    };
    /* kéo thẻ từ vào chỗ trống trong câu / phép tính */
    G.dragfill = function (subj, g, lang) {
      var bl = '<em class="bl">__</em>', q, right, wrongs;
      if (subj === "toan") {
        var x = arith(g), mode = pick(["res", "a"]);
        if (mode === "res" || x.op === "÷" || x.op === "−") { q = x.txt + " = " + bl; right = String(x.res); wrongs = [x.res + 1, x.res - 1, x.res +
            10, x.res - 10, x.res + 2]; }
        else { q = bl + " " + x.op + " " + x.b + " = " + (x.op === "+" ? x.res : x.res); right = String(x.a); wrongs = [x.a + 1, x.a - 1, x.a + 10, x.a - 10, x.a + 2]; }
        wrongs = wrongs.filter(function (w) { return w >= 0; }).map(String);
      } else {
        var S = SENT[subj === "tanh" ? "en" : "vi"], s = pick(S), i = rnd(0, s.length - 1); right = s[i]; var pool = []; S.forEach(function (z) {
            z.forEach(function (w2) { if (
            w2 !== right && pool.indexOf(w2) < 0) pool.push(w2); }); }); wrongs = shuf(pool).slice(0, 3);
        q = s.map(function (w2, j) { return j === i ? bl : w2; }).join(" ");
      }
      var ws = []; wrongs.forEach(function (w) { if (w !== right && ws.indexOf(w) < 0 && ws.length < 3) ws.push(w); }); if (ws.length < 3) return null;
      var all = shuf([right].concat(ws));
      return base("dragfill", subj, g, lang, q, { o: optList(all, all.indexOf(right)), speak: lang === "vi" ? "Kéo thẻ đúng vào chỗ trống." :
          "Drag the right card into the gap.", reveal: right });
    };
    /* phân loại: kéo từng thẻ vào đúng một trong hai rổ */
    G.sort = function (subj, g, lang) {
      var items = [], bins;
      if (subj === "toan") {
        var k = g <= 2 ? 2 : pick([2, 3, 4, 5]), a = [], b = [], t = 0, lo = g <= 2 ? 1 : 10, hi = g <= 2 ? 20 : 60;
        while ((a.length < 3 || b.length < 3) && t++ < 400) { var n = rnd(lo, hi); if (a.indexOf(n) >= 0 || b.indexOf(n) >= 0) continue; if (
            n % k === 0) { if (a.length < 3) a.push(n);
            } else if (b.length < 3) b.push(n); }
        if (a.length < 3 || b.length < 3) return null;
        bins = g <= 2 ? (lang === "vi" ? ["Số chẵn", "Số lẻ"] : ["Even", "Odd"]) : (lang === "vi" ? ["Chia hết cho " + k, "Không chia hết"] :
            ["Divisible by " + k, "Not divisible"]);
        items = shuf(a.map(function (n) { return { v: String(n), bin: 0 }; }).concat(b.map(function (n) { return { v: String(n), bin: 1 }; })));
      } else {
        var cs = shuf(Object.keys(CAT)), c1 = cs[0], c2 = cs[1], p1 = shuf(V.filter(function (v) { return v.c === c1; })).slice(0, 3), p2 = shuf(
            V.filter(function (v) { return v.c === c2; })).slice(0, 3);
        if (p1.length < 3 || p2.length < 3) return null; bins = [CAT[c1][lang], CAT[c2][lang]];
        items = shuf(p1.map(function (v) { return { v: v.e, bin: 0 }; }).concat(p2.map(function (v) { return { v: v.e, bin: 1 }; })));
      }
      return base("sort", subj, g, lang, lang === "vi" ? "Kéo mỗi thẻ vào <em>đúng rổ</em>" : "Drag each card into the <em>right basket</em>", {
          items: items, bins: bins, speak:
          lang === "vi" ? "Kéo mỗi thẻ vào đúng rổ." : "Drag each card into the right basket." });
    };

  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnTypesParts = root.LearnTypesParts || {})["gen-more"] = part;
})(typeof window !== "undefined" ? window : globalThis);
