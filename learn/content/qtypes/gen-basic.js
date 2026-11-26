/* Kiểu câu hỏi — kiểu chọn: đúng/sai, chọn hình, ghép cặp, sắp xếp, gõ số, khác loại, chọn nhiều, so sánh.
   Một phần của learn/content/qtypes.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung TP. */
(function (root) {
  "use strict";
  function part(TP) {
    var CAT = TP.CAT, R = TP.R, RANGE = TP.RANGE, SENT = TP.SENT, UI = TP.UI, V = TP.V, arith = TP.arith, arithPair = TP.arithPair, base = TP.base,
        distinctNums = TP.distinctNums, name = TP.name, nfc = TP.nfc, optList = TP.optList, others = TP.others, pick = TP.pick, rnd = TP.rnd,
        shuf = TP.shuf, word = TP.word;

    var G = {};
    /* 2 lựa chọn Đúng/Sai */
    G.tf = function (subj, g, lang) {
      var truth = R() < .5, q, speak, meta;
      if (subj === "toan") {
        var x = arith(g), c = truth ? x.res : x.res + pick([1, -1, 2, -2, 10, -10]); if (c < 0) c = x.res + 1; if (c === x.res) truth = true;
        q = x.txt + " = " + c; speak = x.txt + " = " + c + (lang === "vi" ? ". Đúng hay sai?" : ". True or false?"); meta = { a: x.a, b: x.b, op:
            x.op, c: c, truth: c === x.res };
      } else {
        var v = pick(V), w = truth ? v : pick(others(v, 3, false)), nm = name(w, subj);
        q = subj === "tanh" ? v.e + " = “" + nm + "”" : v.e + " là " + nm + ".";
        meta = { truth: truth }; speak = subj === "tanh" ? (nm + ". True or false?") : (nm + ". " + (lang === "vi" ? "Đúng hay sai?" : "True or false?"));
      }
      var ui = UI[lang]; var o = [{ v: ui.yes }, { v: ui.no }]; (truth ? o[0] : o[1]).ok = 1;
      return base("tf", subj, g, lang, q, { o: o, speak: speak, meta: meta, reveal: truth ? ui.yes : ui.no });
    };
    /* chọn hình */
    G.pic = function (subj, g, lang) {
      if (subj === "toan") {
        if (g > 2) return null;
        var n = rnd(2, 8), e = pick(["🍎", "⭐", "🐟", "🎈", "🌸"]), cs = [n]; var t = 0;
        while (cs.length < 4 && t++ < 50) { var k = rnd(1, 9); if (cs.indexOf(k) < 0) cs.push(k); }
        var order = shuf(cs), okIdx = order.indexOf(n);
        var o = optList(order.map(function (k) { return new Array(k + 1).join(e); }), okIdx); o.forEach(function (x, i) { if (!x.ok && Math.abs(
            order[i] - n) === 1) x.tag = "off_by_one"; });
        return base("pic", subj, g, lang, lang === "vi" ? "Nhóm nào có <em>" + n + "</em> " + e + "?" : "Which group has <em>" + n + "</em> " + e +
            "?", { o: o, dk: "pic-n", speak:
            lang === "vi" ? "Nhóm nào có " + n + " cái?" : "Which group has " + n + "?", reveal: String(n) });
      }
      var v = pick(V), ws = others(v, 3, true); if (ws.length < 3) ws = others(v, 3, false);
      var all = shuf([v].concat(ws)), idx = all.indexOf(v), nm = name(v, subj);
      return base("pic", subj, g, lang, subj === "tanh" ? (lang === "vi" ? "Hình nào là “<em>" + nm + "</em>”?" : "Which one is a <em>" + nm +
          "</em>?") : (lang === "vi" ?
          "Hình nào là <em>" + nm + "</em>?" : "Which one is “<em>" + nm + "</em>”?"),
        { o: optList(all.map(function (x) { return x.e; }), idx), dk: "pic", speak: subj === "tanh" ? (lang === "vi" ? "Hình nào là " + nm + "?" :
            "Which one is a " + nm + "?") : (
            lang === "vi" ? "Hình nào là " + nm + "?" : "Which one is " + nm + "?"), reveal: v.e });
    };
    /* ghép cặp: 4 cặp, nối ô trái với ô phải */
    G.match = function (subj, g, lang) {
      var pairs = [];
      if (subj === "toan") {
        var seen = {}, t = 0; while (pairs.length < 4 && t++ < 80) { var x = arithPair(g); if (!seen[x.res]) { seen[x.res] = 1; pairs.push([x.txt, String(x.res)]); } }
        if (pairs.length < 4) return null;
      } else {
        var pool = shuf(V.filter(function (v) { return word(v, subj); })).slice(0, 4); pairs = pool.map(function (v) { return [v.e, name(v, subj)]; });
      }
      return base("match", subj, g, lang, lang === "vi" ? "Ghép mỗi ô bên trái với ô đúng bên phải" : "Match each left card with the right one", {
          pairs: pairs, speak: lang === "vi" ?
          "Ghép mỗi ô bên trái với ô đúng bên phải." : "Match each card on the left with the right one." });
    };
    /* sắp xếp thứ tự */
    G.order = function (subj, g, lang) {
      if (subj === "toan") {
        var r = RANGE[g - 1], nums = distinctNums(4, r[0], r[1]).sort(function (a, b) { return a - b; }), asc = R() < .6, items = nums.map(String);
            if (!asc) items.reverse();
        return base("order", subj, g, lang, asc ? (lang === "vi" ? "Xếp từ <em>nhỏ đến lớn</em>" : "Put in order, <em>smallest first</em>") : (
            lang === "vi" ? "Xếp từ <em>lớn đến nhỏ</em>" :
            "Put in order, <em>biggest first</em>"), { items: items, speak: asc ? (lang === "vi" ? "Xếp các số từ nhỏ đến lớn." :
                "Put the numbers in order, smallest first.") : (
            lang === "vi" ? "Xếp các số từ lớn đến nhỏ." : "Put the numbers in order, biggest first."), reveal: items.join(" ") });
      }
      var S = SENT[subj === "tanh" ? "en" : "vi"].filter(function (s) { return g <= 2 ? s.length <= 4 : true; }), s = pick(S);
      return base("order", subj, g, lang, lang === "vi" ? "Xếp các từ thành <em>câu đúng</em>" : "Put the words in the <em>right order</em>", { items:
          s.slice(), speak: lang === "vi" ?
          "Xếp các từ thành câu đúng." : "Put the words in the right order.", reveal: s.join(" ") });
    };
    /* ghép chữ cái thành từ (có hình gợi ý) */
    G.wordbuild = function (subj, g, lang) {
      if (subj === "toan") return null;
      var maxLen = g <= 2 ? 4 : 6, cand = V.filter(function (v) { var w = word(v, subj); return w && w.indexOf(" ") < 0 && Array.from(nfc(
          w)).length >= 3 && Array.from(nfc(
          w)).length <= maxLen + (subj === "tviet" ? 1 : 0); });
      if (!cand.length) return null; var v = pick(cand), w = nfc(word(v, subj)), letters = Array.from(w);
      return base("wordbuild", subj, g, lang, v.e + " " + (lang === "vi" ? "Ghép các chữ cái thành từ" : "Build the word"), { items: letters, speak: lang === "vi" ?
          "Ghép các chữ cái thành từ." : "Put the letters together to make the word.", reveal: w });
    };
    /* gõ đáp án (chỉ Toán) */
    G.typein = function (subj, g, lang) {
      if (subj !== "toan") return null; var x = arith(g), ok = String(x.res);
      return base("typein", subj, g, lang, x.txt + " = <em>?</em>", { ans: ok, speak: x.txt.replace("×", lang === "vi" ? " nhân " :
          " times ").replace("÷", lang === "vi" ? " chia " :
          " divided by ").replace("+", lang === "vi" ? " cộng " : " plus ").replace("−", lang === "vi" ? " trừ " : " minus ") + (lang === "vi" ?
              " bằng" : " equals"), reveal: ok });
    };
    /* tìm cái khác loại */
    G.odd = function (subj, g, lang) {
      if (subj === "toan") {
        var vals, ok, rule;
        if (g <= 2) { var ev = R() < .5, grp = [], tt = 0; while (grp.length < 3 && tt++ < 100) { var n = rnd(1, 30); if ((n % 2 === 0) === ev &&
            grp.indexOf(n) < 0) grp.push(n); } var odd;
            do { odd = rnd(1, 30); } while ((odd % 2 === 0) === ev || grp.indexOf(odd) >= 0); vals = shuf(grp.concat([odd])); ok = vals.indexOf(odd); }
        else { var k = pick([3, 4, 5, 6, 7]), gp = [], t2 = 0; while (gp.length < 3 && t2++ < 100) { var m = k * rnd(2, 12); if (gp.indexOf(
            m) < 0) gp.push(m); } var od; do { od = rnd(10,
            90); } while (od % k === 0 || gp.indexOf(od) >= 0); vals = shuf(gp.concat([od])); ok = vals.indexOf(od); }
        return base("odd", subj, g, lang, lang === "vi" ? "Ba số cùng loại, <em>số nào khác loại?</em>" :
            "Three numbers match. <em>Which is different?</em>", { o: optList(vals.map(String),
            ok), speak: lang === "vi" ? "Ba số cùng loại, số nào khác loại?" : "Three numbers match. Which one is different?", reveal: String(vals[ok]) });
      }
      var cats = shuf(Object.keys(CAT)), a = cats[0], b = cats[1], pa = shuf(V.filter(function (v) { return v.c === a; })).slice(0, 3), pb = pick(
          V.filter(function (v) { return v.c === b;
          })), list = shuf(pa.concat([pb]));
      return base("odd", subj, g, lang, lang === "vi" ? "Ba hình cùng nhóm, <em>hình nào khác nhóm?</em>" :
          "Three pictures belong together. <em>Which one is different?</em>", { o: optList(
          list.map(function (x) { return x.e; }), list.indexOf(pb)), dk: "pic", speak: lang === "vi" ? "Ba hình cùng nhóm, hình nào khác nhóm?" :
          "Three pictures belong together. Which one is different?", reveal: pb.e });
    };
    /* chọn tất cả đáp án đúng */
    G.multi = function (subj, g, lang) {
      var opts, q, speak;
      if (subj === "toan") {
        var k = g <= 2 ? 2 : pick([2, 3, 4, 5]), want = rnd(2, 3), good = [], bad = [], t = 0, lo = g <= 2 ? 1 : 10, hi = g <= 2 ? 20 : 60;
        while ((good.length < want || bad.length < 6 - want) && t++ < 400) { var n = rnd(lo, hi); if (good.indexOf(n) >= 0 || bad.indexOf(
            n) >= 0) continue; if (n % k === 0) { if (
            good.length < want) good.push(n); } else if (bad.length < 6 - want) bad.push(n); }
        if (good.length < want || bad.length < 6 - want) return null;
        opts = shuf(good.map(function (n) { return { v: String(n), ok: 1 }; }).concat(bad.map(function (n) { return { v: String(n) }; })));
        q = g <= 2 ? (lang === "vi" ? "Chọn <em>tất cả số chẵn</em>" : "Pick <em>all the even numbers</em>") : (lang === "vi" ?
            "Chọn tất cả số <em>chia hết cho " + k + "</em>" :
            "Pick all numbers <em>divisible by " + k + "</em>");
        speak = g <= 2 ? (lang === "vi" ? "Chọn tất cả số chẵn." : "Pick all the even numbers.") : (lang === "vi" ? "Chọn tất cả số chia hết cho " +
            k + "." : "Pick all numbers divisible by " + k + ".");
      } else {
        var cat = pick(["animal", "fruit", "vehicle", "nature", "school"]), inC = shuf(V.filter(function (v) { return v.c === cat; })), outC = shuf(
            V.filter(function (v) {
            return v.c !== cat; })), w2 = rnd(2, 3);
        if (inC.length < w2) return null;
        opts = shuf(inC.slice(0, w2).map(function (v) { return { v: v.e, ok: 1 }; }).concat(outC.slice(0, 6 - w2).map(function (v) { return { v: v.e }; })));
        q = lang === "vi" ? "Chọn <em>tất cả " + CAT[cat].vi + "</em>" : "Pick <em>all the " + CAT[cat].en + "</em>"; speak = lang === "vi" ?
            "Chọn tất cả " + CAT[cat].vi + "." :
            "Pick all the " + CAT[cat].en + ".";
      }
      return base("multi", subj, g, lang, q, { opts: opts, speak: speak, reveal: "" });
    };
    /* so sánh >, =, < (chỉ Toán) */
    G.compare = function (subj, g, lang) {
      if (subj !== "toan") return null;
      var L, Rr, lv, rv, r = RANGE[g - 1];
      if (g === 1) { lv = rnd(1, 20); rv = R() < .2 ? lv : rnd(1, 20); L = String(lv); Rr = String(rv); }
      else { var x = arith(g); L = x.txt; lv = x.res; var m = R(); if (m < .3) { rv = lv; Rr = String(lv); } else if (m < .65) { rv = Math.max(0, lv +
          pick([-3, -2, -1, 1, 2, 3]) * (g >= 3 ?
          10 : 1)); Rr = String(rv); } else { var y = arith(g); rv = y.res; Rr = y.txt; if (Rr === L) { rv = lv + 1; Rr = String(rv); } } }
      var sym = lv > rv ? ">" : lv < rv ? "<" : "=", o = [{ v: "<" }, { v: "=" }, { v: ">" }]; o.forEach(function (x) { if (x.v === sym) x.ok = 1; });
      return base("compare", subj, g, lang, L + " <em>?</em> " + Rr, { o: o, speak: lang === "vi" ? "So sánh " + L.replace("×", " nhân ").replace("÷",
          " chia ").replace("−",
          " trừ ").replace("+", " cộng ") + " với " + Rr.replace("×", " nhân ").replace("÷", " chia ").replace("−", " trừ ").replace("+", " cộng ") +
              "." : "Compare " + L + " and " + Rr +
          ".", meta: { lv: lv, rv: rv }, reveal: sym });
    };

    TP.G = G;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnTypesParts = root.LearnTypesParts || {})["gen-basic"] = part;
})(typeof window !== "undefined" ? window : globalThis);
