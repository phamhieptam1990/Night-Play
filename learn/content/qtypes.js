/* 10 KIỂU CÂU HỎI cho trang học (thuần dữ liệu, không chạm DOM; chạy được trong trình duyệt và Node để kiểm thử).
   Kiểu: mc (chọn 1/4, do engine.js sinh) · tf (đúng/sai) · pic (chọn hình) · match (ghép cặp) · order (sắp xếp)
         · wordbuild (ghép chữ) · typein (gõ số) · odd (tìm cái khác loại) · multi (chọn nhiều) · compare (so sánh).
   Mỗi câu: { kind, q, lab, speak, subj, grade, skill:null, ...dữ liệu theo kiểu }.
   Câu thuộc kiểu mới chưa gắn kỹ năng (skill:null) nên KHÔNG ghi vào tiến độ kỹ năng của engine; giao diện vẫn tính sao/chuỗi như thường.
   Giao diện vẽ ở learn/qui.js (match/order/wordbuild/typein/multi) và index.html (tf/pic/odd/compare dùng lại nút 4 đáp án).
   Kiểm thử: node scripts/learn/check-types.js */
(function (root) {
  "use strict";
  var R = Math.random;
  function rnd(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function pick(a) { return a[rnd(0, a.length - 1)]; }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function nfc(s) { return s.normalize ? s.normalize("NFC") : s; }

  var LAB = {
    vi: { trace: "Tô chữ", dictate: "Nghe – viết", write: "Viết câu", speak: "Đọc to", tf: "Đúng hay sai?", pic: "Chọn hình", match: "Ghép cặp", order: "Sắp xếp", wordbuild: "Ghép chữ", typein: "Gõ đáp án", odd: "Khác loại", multi: "Chọn tất cả", compare: "So sánh", count: "Đếm", pop: "Bắn bong bóng", memory: "Lật thẻ", numline: "Trục số", clock: "Đồng hồ", find: "Tìm trong tranh", dragfill: "Kéo vào chỗ trống", sort: "Phân loại" },
    en: { trace: "Trace", dictate: "Dictation", write: "Write", speak: "Read aloud", tf: "True or false?", pic: "Pick the picture", match: "Match", order: "Put in order", wordbuild: "Build the word", typein: "Type the answer", odd: "Odd one out", multi: "Pick all", compare: "Compare", count: "Count", pop: "Pop the balloon", memory: "Memory", numline: "Number line", clock: "Clock", find: "Find it", dragfill: "Drag to the gap", sort: "Sort" }
  };
  var UI = { vi: { yes: "✓ Đúng", no: "✗ Sai", done: "Xong ✓" }, en: { yes: "✓ True", no: "✗ False", done: "Done ✓" } };

  /* ---- từ vựng có hình: e = emoji; vi = có loại từ; w = từ ngắn để ghép chữ (null nếu có dấu cách); en = tiếng Anh; c = nhóm ---- */
  var V = [
    { e: "🐱", vi: "con mèo", w: "mèo", en: "cat", c: "animal" }, { e: "🐶", vi: "con chó", w: "chó", en: "dog", c: "animal" },
    { e: "🐟", vi: "con cá", w: "cá", en: "fish", c: "animal" }, { e: "🐦", vi: "con chim", w: "chim", en: "bird", c: "animal" },
    { e: "🐘", vi: "con voi", w: "voi", en: "elephant", c: "animal" }, { e: "🐰", vi: "con thỏ", w: "thỏ", en: "rabbit", c: "animal" },
    { e: "🐷", vi: "con heo", w: "heo", en: "pig", c: "animal" }, { e: "🐮", vi: "con bò", w: "bò", en: "cow", c: "animal" },
    { e: "🍎", vi: "quả táo", w: "táo", en: "apple", c: "fruit" }, { e: "🍌", vi: "quả chuối", w: "chuối", en: "banana", c: "fruit" },
    { e: "🍇", vi: "chùm nho", w: "nho", en: "grapes", c: "fruit" }, { e: "🍊", vi: "quả cam", w: "cam", en: "orange", c: "fruit" },
    { e: "🍓", vi: "quả dâu", w: "dâu", en: "strawberry", c: "fruit" }, { e: "🍉", vi: "quả dưa hấu", w: null, en: "watermelon", c: "fruit" },
    { e: "🚗", vi: "xe hơi", w: null, en: "car", c: "vehicle" }, { e: "🚌", vi: "xe buýt", w: null, en: "bus", c: "vehicle" },
    { e: "✈️", vi: "máy bay", w: null, en: "plane", c: "vehicle" }, { e: "🚲", vi: "xe đạp", w: null, en: "bicycle", c: "vehicle" },
    { e: "🌳", vi: "cái cây", w: "cây", en: "tree", c: "plant" }, { e: "☀️", vi: "mặt trời", w: null, en: "sun", c: "nature" },
    { e: "🌙", vi: "mặt trăng", w: null, en: "moon", c: "nature" }, { e: "⭐", vi: "ngôi sao", w: null, en: "star", c: "nature" },
    { e: "📖", vi: "quyển sách", w: "sách", en: "book", c: "school" }, { e: "✏️", vi: "cây bút chì", w: null, en: "pencil", c: "school" },
    { e: "⚽", vi: "quả bóng", w: "bóng", en: "ball", c: "toy" }, { e: "🎒", vi: "cặp sách", w: null, en: "bag", c: "school" }
  ];
  var CAT = { animal: { vi: "con vật", en: "animals" }, fruit: { vi: "trái cây", en: "fruits" }, vehicle: { vi: "phương tiện", en: "vehicles" }, nature: { vi: "vật sáng trên trời", en: "shining things in the sky" }, school: { vi: "đồ dùng học tập", en: "school things" } };
  var SENT = {
    vi: [["Em", "đi", "học"], ["Mẹ", "nấu", "cơm"], ["Bé", "chơi", "bóng"], ["Em", "yêu", "mẹ"], ["Bố", "đọc", "sách", "cho", "bé"], ["Trời", "hôm", "nay", "rất", "đẹp"], ["Bé", "tưới", "cây", "mỗi", "sáng"], ["Con", "mèo", "ngủ", "trên", "ghế"]],
    en: [["I", "like", "apples"], ["I", "have", "a", "dog"], ["She", "reads", "a", "book"], ["The", "cat", "is", "small"], ["We", "go", "to", "school"], ["He", "can", "run", "fast"], ["It", "is", "a", "sunny", "day"], ["My", "mom", "is", "kind"]]
  };

  function name(v, subj) { return subj === "tanh" ? v.en : v.vi; }     /* tên theo MÔN: Tiếng Anh dùng từ Anh, còn lại dùng từ Việt */
  function word(v, subj) { return subj === "tanh" ? v.en : v.w; }
  function others(v, n, same) { return shuf(V.filter(function (x) { return x !== v && (same ? x.c === v.c : true); })).slice(0, n); }
  function optList(texts, okIdx) { return texts.map(function (t, i) { return i === okIdx ? { v: t, ok: 1 } : { v: t }; }); }
  /* kiểu câu Toán → kỹ năng theo dõi (engine.js TRACKED); các kiểu khác để skill:null */
  var KSKILL = { count: "count_obj", numline: "number_line", compare: "compare_num", order: "order_num", clock: "clock_read" };
  var KSKILL_L = { tviet: { order: "sent_order", wordbuild: "word_build", dictate: "dictate_vi", write: "write_vi", speak: "speak_vi", trace: "trace_vi" }, tanh: { order: "sent_order_en", wordbuild: "word_build_en", dictate: "dictate_en", write: "write_en", speak: "speak_en" } };
  function base(kind, subj, grade, lang, q, extra) {
    var o = { kind: kind, type: kind, lang: lang, q: q, lab: LAB[lang][kind], subj: subj, grade: grade, skill: (subj === "toan" ? KSKILL[kind] : KSKILL_L[subj] && KSKILL_L[subj][kind]) || null, ui: UI[lang] };
    for (var k in extra) o[k] = extra[k]; return o;
  }

  /* ---- số học theo lớp ---- */
  function arith(g) {
    var ops = g <= 2 ? ["+", "−"] : g === 3 ? ["+", "−", "×"] : ["+", "−", "×", "÷"], op = pick(ops), a, b, res;
    if (op === "+" || op === "−") {
      var A, B;
      if (g === 1) { A = rnd(1, 15); B = rnd(1, 20 - A); } else if (g === 2) { A = rnd(10, 80); B = rnd(5, 99 - A); } else if (g === 3) { A = rnd(300, 4000); B = rnd(100, 9999 - A); } else if (g === 4) { A = rnd(1000, 6000); B = rnd(500, 9999 - A); } else { A = rnd(10000, 60000); B = rnd(1000, 99999 - A); }
      if (op === "+") { a = A; b = B; res = A + B; } else { a = A + B; b = B; res = A; }
    } else if (op === "×") {
      a = g === 3 ? rnd(11, 60) : g === 4 ? rnd(11, 99) : rnd(101, 500); b = rnd(2, 9); res = a * b;
    } else { b = rnd(2, 9); res = g === 3 ? rnd(12, 99) : g === 4 ? rnd(11, 99) : rnd(101, 400); a = b * res; }
    return { a: a, b: b, op: op, res: res, txt: a + " " + op + " " + b };
  }
  /* phép tính cho ghép cặp / lật thẻ: phải tính CẢ 4 phép cùng lúc nên dùng số nhỏ (cộng trừ hai chữ số, bảng nhân), không dùng số ba chữ số */
  function arithPair(g) { if (g <= 2) return arith(g); if (R() < .5) return arith(2); for (var i = 0; i < 30; i++) { var x = arith(3); if (x.op === "×") return x; } return arith(2); }
  var RANGE = [[1, 20], [10, 99], [100, 999], [1000, 9999], [10000, 99999]];
  function distinctNums(n, lo, hi) { var s = {}, out = []; var tries = 0; while (out.length < n && tries++ < 200) { var x = rnd(lo, hi); if (!s[x]) { s[x] = 1; out.push(x); } } return out; }

  var G = {};
  /* 2 lựa chọn Đúng/Sai */
  G.tf = function (subj, g, lang) {
    var truth = R() < .5, q, speak, meta;
    if (subj === "toan") {
      var x = arith(g), c = truth ? x.res : x.res + pick([1, -1, 2, -2, 10, -10]); if (c < 0) c = x.res + 1; if (c === x.res) truth = true;
      q = x.txt + " = " + c; speak = x.txt + " = " + c + (lang === "vi" ? ". Đúng hay sai?" : ". True or false?"); meta = { a: x.a, b: x.b, op: x.op, c: c, truth: c === x.res };
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
      var o = optList(order.map(function (k) { return new Array(k + 1).join(e); }), okIdx); o.forEach(function (x, i) { if (!x.ok && Math.abs(order[i] - n) === 1) x.tag = "off_by_one"; });
      return base("pic", subj, g, lang, lang === "vi" ? "Nhóm nào có <em>" + n + "</em> " + e + "?" : "Which group has <em>" + n + "</em> " + e + "?", { o: o, dk: "pic-n", speak: lang === "vi" ? "Nhóm nào có " + n + " cái?" : "Which group has " + n + "?", reveal: String(n) });
    }
    var v = pick(V), ws = others(v, 3, true); if (ws.length < 3) ws = others(v, 3, false);
    var all = shuf([v].concat(ws)), idx = all.indexOf(v), nm = name(v, subj);
    return base("pic", subj, g, lang, subj === "tanh" ? (lang === "vi" ? "Hình nào là “<em>" + nm + "</em>”?" : "Which one is a <em>" + nm + "</em>?") : (lang === "vi" ? "Hình nào là <em>" + nm + "</em>?" : "Which one is “<em>" + nm + "</em>”?"),
      { o: optList(all.map(function (x) { return x.e; }), idx), dk: "pic", speak: subj === "tanh" ? (lang === "vi" ? "Hình nào là " + nm + "?" : "Which one is a " + nm + "?") : (lang === "vi" ? "Hình nào là " + nm + "?" : "Which one is " + nm + "?"), reveal: v.e });
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
    return base("match", subj, g, lang, lang === "vi" ? "Ghép mỗi ô bên trái với ô đúng bên phải" : "Match each left card with the right one", { pairs: pairs, speak: lang === "vi" ? "Ghép mỗi ô bên trái với ô đúng bên phải." : "Match each card on the left with the right one." });
  };
  /* sắp xếp thứ tự */
  G.order = function (subj, g, lang) {
    if (subj === "toan") {
      var r = RANGE[g - 1], nums = distinctNums(4, r[0], r[1]).sort(function (a, b) { return a - b; }), asc = R() < .6, items = nums.map(String); if (!asc) items.reverse();
      return base("order", subj, g, lang, asc ? (lang === "vi" ? "Xếp từ <em>bé đến lớn</em>" : "Put in order, <em>smallest first</em>") : (lang === "vi" ? "Xếp từ <em>lớn đến bé</em>" : "Put in order, <em>biggest first</em>"), { items: items, speak: asc ? (lang === "vi" ? "Xếp các số từ bé đến lớn." : "Put the numbers in order, smallest first.") : (lang === "vi" ? "Xếp các số từ lớn đến bé." : "Put the numbers in order, biggest first."), reveal: items.join(" ") });
    }
    var S = SENT[subj === "tanh" ? "en" : "vi"].filter(function (s) { return g <= 2 ? s.length <= 4 : true; }), s = pick(S);
    return base("order", subj, g, lang, lang === "vi" ? "Xếp các từ thành <em>câu đúng</em>" : "Put the words in the <em>right order</em>", { items: s.slice(), speak: lang === "vi" ? "Xếp các từ thành câu đúng." : "Put the words in the right order.", reveal: s.join(" ") });
  };
  /* ghép chữ cái thành từ (có hình gợi ý) */
  G.wordbuild = function (subj, g, lang) {
    if (subj === "toan") return null;
    var maxLen = g <= 2 ? 4 : 6, cand = V.filter(function (v) { var w = word(v, subj); return w && w.indexOf(" ") < 0 && Array.from(nfc(w)).length >= 3 && Array.from(nfc(w)).length <= maxLen + (subj === "tviet" ? 1 : 0); });
    if (!cand.length) return null; var v = pick(cand), w = nfc(word(v, subj)), letters = Array.from(w);
    return base("wordbuild", subj, g, lang, v.e + " " + (lang === "vi" ? "Ghép các chữ cái thành từ" : "Build the word"), { items: letters, speak: lang === "vi" ? "Ghép các chữ cái thành từ." : "Put the letters together to make the word.", reveal: w });
  };
  /* gõ đáp án (chỉ Toán) */
  G.typein = function (subj, g, lang) {
    if (subj !== "toan") return null; var x = arith(g), ok = String(x.res);
    return base("typein", subj, g, lang, x.txt + " = <em>?</em>", { ans: ok, speak: x.txt.replace("×", lang === "vi" ? " nhân " : " times ").replace("÷", lang === "vi" ? " chia " : " divided by ").replace("+", lang === "vi" ? " cộng " : " plus ").replace("−", lang === "vi" ? " trừ " : " minus ") + (lang === "vi" ? " bằng" : " equals"), reveal: ok });
  };
  /* tìm cái khác loại */
  G.odd = function (subj, g, lang) {
    if (subj === "toan") {
      var vals, ok, rule;
      if (g <= 2) { var ev = R() < .5, grp = [], tt = 0; while (grp.length < 3 && tt++ < 100) { var n = rnd(1, 30); if ((n % 2 === 0) === ev && grp.indexOf(n) < 0) grp.push(n); } var odd; do { odd = rnd(1, 30); } while ((odd % 2 === 0) === ev || grp.indexOf(odd) >= 0); vals = shuf(grp.concat([odd])); ok = vals.indexOf(odd); }
      else { var k = pick([3, 4, 5, 6, 7]), gp = [], t2 = 0; while (gp.length < 3 && t2++ < 100) { var m = k * rnd(2, 12); if (gp.indexOf(m) < 0) gp.push(m); } var od; do { od = rnd(10, 90); } while (od % k === 0 || gp.indexOf(od) >= 0); vals = shuf(gp.concat([od])); ok = vals.indexOf(od); }
      return base("odd", subj, g, lang, lang === "vi" ? "Ba số cùng loại, <em>số nào khác loại?</em>" : "Three numbers match. <em>Which is different?</em>", { o: optList(vals.map(String), ok), speak: lang === "vi" ? "Ba số cùng loại, số nào khác loại?" : "Three numbers match. Which one is different?", reveal: String(vals[ok]) });
    }
    var cats = shuf(Object.keys(CAT)), a = cats[0], b = cats[1], pa = shuf(V.filter(function (v) { return v.c === a; })).slice(0, 3), pb = pick(V.filter(function (v) { return v.c === b; })), list = shuf(pa.concat([pb]));
    return base("odd", subj, g, lang, lang === "vi" ? "Ba hình cùng nhóm, <em>hình nào khác nhóm?</em>" : "Three pictures belong together. <em>Which one is different?</em>", { o: optList(list.map(function (x) { return x.e; }), list.indexOf(pb)), dk: "pic", speak: lang === "vi" ? "Ba hình cùng nhóm, hình nào khác nhóm?" : "Three pictures belong together. Which one is different?", reveal: pb.e });
  };
  /* chọn tất cả đáp án đúng */
  G.multi = function (subj, g, lang) {
    var opts, q, speak;
    if (subj === "toan") {
      var k = g <= 2 ? 2 : pick([2, 3, 4, 5]), want = rnd(2, 3), good = [], bad = [], t = 0, lo = g <= 2 ? 1 : 10, hi = g <= 2 ? 20 : 60;
      while ((good.length < want || bad.length < 6 - want) && t++ < 400) { var n = rnd(lo, hi); if (good.indexOf(n) >= 0 || bad.indexOf(n) >= 0) continue; if (n % k === 0) { if (good.length < want) good.push(n); } else if (bad.length < 6 - want) bad.push(n); }
      if (good.length < want || bad.length < 6 - want) return null;
      opts = shuf(good.map(function (n) { return { v: String(n), ok: 1 }; }).concat(bad.map(function (n) { return { v: String(n) }; })));
      q = g <= 2 ? (lang === "vi" ? "Chọn <em>tất cả số chẵn</em>" : "Pick <em>all the even numbers</em>") : (lang === "vi" ? "Chọn tất cả số <em>chia hết cho " + k + "</em>" : "Pick all numbers <em>divisible by " + k + "</em>");
      speak = g <= 2 ? (lang === "vi" ? "Chọn tất cả số chẵn." : "Pick all the even numbers.") : (lang === "vi" ? "Chọn tất cả số chia hết cho " + k + "." : "Pick all numbers divisible by " + k + ".");
    } else {
      var cat = pick(["animal", "fruit", "vehicle", "nature", "school"]), inC = shuf(V.filter(function (v) { return v.c === cat; })), outC = shuf(V.filter(function (v) { return v.c !== cat; })), w2 = rnd(2, 3);
      if (inC.length < w2) return null;
      opts = shuf(inC.slice(0, w2).map(function (v) { return { v: v.e, ok: 1 }; }).concat(outC.slice(0, 6 - w2).map(function (v) { return { v: v.e }; })));
      q = lang === "vi" ? "Chọn <em>tất cả " + CAT[cat].vi + "</em>" : "Pick <em>all the " + CAT[cat].en + "</em>"; speak = lang === "vi" ? "Chọn tất cả " + CAT[cat].vi + "." : "Pick all the " + CAT[cat].en + ".";
    }
    return base("multi", subj, g, lang, q, { opts: opts, speak: speak, reveal: "" });
  };
  /* so sánh >, =, < (chỉ Toán) */
  G.compare = function (subj, g, lang) {
    if (subj !== "toan") return null;
    var L, Rr, lv, rv, r = RANGE[g - 1];
    if (g === 1) { lv = rnd(1, 20); rv = R() < .2 ? lv : rnd(1, 20); L = String(lv); Rr = String(rv); }
    else { var x = arith(g); L = x.txt; lv = x.res; var m = R(); if (m < .3) { rv = lv; Rr = String(lv); } else if (m < .65) { rv = Math.max(0, lv + pick([-3, -2, -1, 1, 2, 3]) * (g >= 3 ? 10 : 1)); Rr = String(rv); } else { var y = arith(g); rv = y.res; Rr = y.txt; if (Rr === L) { rv = lv + 1; Rr = String(rv); } } }
    var sym = lv > rv ? ">" : lv < rv ? "<" : "=", o = [{ v: "<" }, { v: "=" }, { v: ">" }]; o.forEach(function (x) { if (x.v === sym) x.ok = 1; });
    return base("compare", subj, g, lang, L + " <em>?</em> " + Rr, { o: o, speak: lang === "vi" ? "So sánh " + L.replace("×", " nhân ").replace("÷", " chia ").replace("−", " trừ ").replace("+", " cộng ") + " với " + Rr.replace("×", " nhân ").replace("÷", " chia ").replace("−", " trừ ").replace("+", " cộng ") + "." : "Compare " + L + " and " + Rr + ".", meta: { lv: lv, rv: rv }, reveal: sym });
  };


  /* ====== NGHE–VIẾT, VIẾT CÂU, ĐỌC TO (Tiếng Việt, Tiếng Anh) ====== */
  var LD = (function () { try { if (root.LearnLangSkills && root.LearnLangSkills.DATA) return root.LearnLangSkills.DATA; if (typeof require !== "undefined") return require("../lang-skills.js").DATA; } catch (e) {} return null; })();
  var LBTN = '<button type="button" class="lsn" aria-label="🔊">🔊</button>';
  /* nghe–viết: bé nghe từ rồi gõ lại. Tiếng Việt lớp 1–3 (từ ngắn, có hình), Tiếng Anh lớp 2–5 (từ một chữ, có hình ở lớp thấp) */
  G.dictate = function (subj, g, lang) {
    if (subj === "toan" || !LD) return null; var it, pool = [];
    if (subj === "tviet") { if (g > 2) return null; pool = LD.letterStart.filter(function (x) { return x[1].indexOf(" ") < 0 && Array.from(x[1]).length <= 5; }); }
    else { if (g < 2) return null; Object.keys(LD.themes).forEach(function (k) { LD.themes[k].forEach(function (x) { if (x[1].indexOf(" ") < 0 && x[1].length <= 8 && (g < 4 || x[1].length >= 5)) pool.push(x); }); }); }
    it = pick(pool); var w = nfc(it[1].toLowerCase());
    return base("dictate", subj, g, lang, (lang === "vi" ? "Nghe rồi viết lại từ" : "Listen and write the word") + "<br>" + (g <= 2 ? "<span class='dpic'>" + it[0] + "</span><br>" : "") + LBTN, { ans: w, accept: [w], speak: it[1], speakLang: subj === "tanh" ? "en" : "vi", listen: 1, reveal: it[1] });
  };
  /* viết câu: chấm theo TIÊU CHÍ HÌNH THỨC (đủ số từ, chữ đầu viết hoa, có dấu kết thúc); không chấm nội dung vì không có AI lúc chạy */
  var WTOP = { tviet: ["mẹ", "trường học", "con mèo", "bạn thân", "ngôi nhà", "buổi sáng", "quê hương", "mùa hè"], tanh: ["my family", "my school", "my pet", "my friend", "my room"] };
  function checkWrite(text, spec, lang) {
    var t = String(text || "").replace(/\s+/g, " ").trim(), words = t ? t.split(" ").length : 0, vi = lang !== "en", first = Array.from(t)[0] || "", min = spec && spec.min ? spec.min : 3;
    if (words < min) return { ok: false, tip: vi ? "Viết thêm cho đủ ý: câu cần ít nhất " + min + " từ." : "Write a bit more: at least " + min + " words." };
    if (!first || first === first.toLowerCase()) return { ok: false, tip: vi ? "Chữ đầu câu phải viết hoa nhé." : "Start the sentence with a capital letter." };
    if (!/[.?!…]$/.test(t)) return { ok: false, tip: vi ? "Cuối câu nhớ đặt dấu chấm (.) nhé." : "End the sentence with a full stop (.)." };
    if (/\d/.test(t)) return { ok: false, tip: vi ? "Viết bằng chữ, không dùng chữ số nhé." : "Write with words, not digits." };
    return { ok: true, tip: "" };
  }
  G.write = function (subj, g, lang) {
    if (subj === "toan" || (subj === "tviet" && g < 2) || (subj === "tanh" && g < 3)) return null;
    var topic = pick(WTOP[subj]), min = subj === "tviet" ? [0, 0, 3, 4, 5, 6][g] : [0, 0, 0, 3, 4, 5][g];
    return base("write", subj, g, lang, (subj === "tviet" ? "Viết một câu về <em>" + topic + "</em>" : "Write a sentence about <em>" + topic + "</em>") + "<br><small>" + (lang === "vi" ? "Chữ đầu viết hoa, cuối câu có dấu chấm" : "Capital letter first, full stop at the end") + "</small>", { min: min, topic: topic, speak: (subj === "tviet" ? "Viết một câu về " : "Write a sentence about ") + topic });
  };
  /* đọc to: bé đọc thành tiếng theo mẫu rồi tự báo đã đọc (không có nhận dạng giọng nói) */
  var SAY = { tviet: [["Em chào cô ạ.", 1], ["Em yêu mẹ của em.", 1], ["Con mèo nằm trên ghế.", 2], ["Hôm nay trời đẹp quá!", 2], ["Mẹ nấu cơm rất ngon.", 2], ["Mùa thu, bầu trời trong xanh và gió se lạnh.", 4], ["Em cố gắng học tập để trở thành người có ích.", 5]],
    tanh: [["Hello, my name is Nam.", 1], ["I like apples.", 1], ["This is my school.", 2], ["I have a red bag.", 2], ["Nice to meet you.", 1], ["She plays football every day.", 4], ["On Sunday, we play in the park.", 5]] };
  G.speak = function (subj, g, lang) {
    if (subj === "toan") return null; var pool = SAY[subj].filter(function (x) { return x[1] <= g; }); if (!pool.length) return null; var it = pick(pool);
    return base("speak", subj, g, lang, (lang === "vi" ? "Đọc to câu này:" : "Read this aloud:") + "<br><em>" + it[0] + "</em><br>" + LBTN, { speak: it[0], speakLang: subj === "tanh" ? "en" : "vi", listen: 1 });
  };

  /* tô chữ (lớp 1): bé dùng ngón tay tô theo chữ cái mờ trên canvas; chấm theo độ phủ nét chữ và nét lem ra ngoài (qui.js) */
  var TRACE = ["o", "c", "l", "i", "t", "a", "e", "u", "n", "m", "v", "x", "h", "b", "d", "g"];
  G.trace = function (subj, g, lang) {
    if (subj !== "tviet" || g > 1) return null; var ch = pick(TRACE);
    return base("trace", subj, g, lang, (lang === "vi" ? "Tô theo chữ cái" : "Trace the letter") + " <em>" + ch + "</em>", { ch: ch, speak: (lang === "vi" ? "Tô theo chữ cái " : "Trace the letter ") + ch });
  };

  /* ====== 8 kiểu tương tác thêm ====== */
  /* đếm bằng chạm: chạm từng vật để đếm rồi chọn số */
  G.count = function (subj, g, lang) {
    if (subj !== "toan" || g > 2) return null;
    var n = rnd(3, 9), e = pick(["🍎", "⭐", "🐟", "🎈", "🌸", "🐥"]), cs = [n], t = 0; while (cs.length < 4 && t++ < 60) { var k = rnd(Math.max(1, n - 3), n + 3); if (cs.indexOf(k) < 0) cs.push(k); }
    var order = shuf(cs), o = optList(order.map(String), order.indexOf(n)); o.forEach(function (x) { if (!x.ok && Math.abs(Number(x.v) - n) === 1) x.tag = "off_by_one"; });
    return base("count", subj, g, lang, lang === "vi" ? "Chạm vào từng " + e + " để đếm" : "Tap each " + e + " to count", { n: n, e: e, o: o, speak: lang === "vi" ? "Chạm vào từng hình để đếm, rồi chọn số." : "Tap each one to count, then pick the number.", reveal: String(n) });
  };
  /* lật thẻ trí nhớ: 4 cặp */
  G.memory = function (subj, g, lang) {
    var pairs = [];
    if (subj === "toan") { if (g > 3) return null; var seen = {}, t = 0; while (pairs.length < 4 && t++ < 80) { var x = arithPair(g); if (!seen[x.res]) { seen[x.res] = 1; pairs.push([x.txt, String(x.res)]); } } if (pairs.length < 4) return null; }
    else pairs = shuf(V.filter(function (v) { return word(v, subj); })).slice(0, 4).map(function (v) { return [v.e, name(v, subj)]; });
    return base("memory", subj, g, lang, lang === "vi" ? "Lật hai thẻ để tìm <em>cặp giống nhau</em>" : "Flip two cards to find a <em>matching pair</em>", { pairs: pairs, speak: lang === "vi" ? "Lật hai thẻ để tìm cặp giống nhau." : "Flip two cards to find a matching pair." });
  };
  /* trục số: kéo con trượt tới đúng số */
  G.numline = function (subj, g, lang) {
    if (subj !== "toan") return null;
    var cfg = [{ min: 0, max: 10, step: 1 }, { min: 0, max: 100, step: 5 }, { min: 0, max: 1000, step: 50 }, { min: 0, max: 10000, step: 500 }, { min: 0, max: 10, step: 1, dec: 1 }][g - 1], k = rnd(1, (cfg.max - cfg.min) / cfg.step - 1), target = cfg.min + k * cfg.step;
    var shown = cfg.dec ? (target / 10).toString().replace(".", lang === "vi" ? "," : ".") : String(target);
    return base("numline", subj, g, lang, (lang === "vi" ? "Đặt điểm đúng chỗ của <em>" : "Put the dot at <em>") + shown + "</em>", { min: cfg.min, max: cfg.max, step: cfg.step, dec: cfg.dec || 0, target: target, lang: lang, speak: lang === "vi" ? "Kéo điểm tới số " + shown + "." : "Drag the dot to " + shown + ".", reveal: shown });
  };
  /* xem đồng hồ: kim chỉ mấy giờ → chọn giờ đúng */
  G.clock = function (subj, g, lang) {
    if (subj !== "toan" || g > 3) return null;
    var hr = rnd(1, 12), mi = g === 1 ? pick([0, 30]) : g === 2 ? pick([0, 15, 30, 45]) : rnd(0, 11) * 5, f = function (h, m) { return h + ":" + (m < 10 ? "0" : "") + m; }, ans = f(hr, mi), opts = [ans], t = 0;
    while (opts.length < 4 && t++ < 80) { var h2 = R() < .5 ? hr : rnd(1, 12), m2 = R() < .5 ? mi : (g === 1 ? pick([0, 30]) : rnd(0, 11) * 5), v = f(h2, m2); if (opts.indexOf(v) < 0) opts.push(v); }
    var order = shuf(opts);
    return base("clock", subj, g, lang, lang === "vi" ? "Đồng hồ chỉ <em>mấy giờ?</em>" : "What <em>time</em> is it?", { h: hr, m: mi, o: optList(order, order.indexOf(ans)), speak: lang === "vi" ? "Đồng hồ chỉ mấy giờ?" : "What time is it?", reveal: ans });
  };
  /* tìm trong tranh: chạm đúng vật / số được hỏi giữa nhiều vật */
  G.find = function (subj, g, lang) {
    if (subj === "toan") {
      var r = RANGE[g - 1], nums = distinctNums(9, r[0], r[1]), big = R() < .5, tv = big ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
      return base("find", subj, g, lang, big ? (lang === "vi" ? "Chạm vào <em>số lớn nhất</em>" : "Tap the <em>biggest number</em>") : (lang === "vi" ? "Chạm vào <em>số bé nhất</em>" : "Tap the <em>smallest number</em>"), { o: nums.map(function (n) { var x = { v: String(n) }; if (n === tv) x.ok = 1; return x; }), dk: "find", speak: big ? (lang === "vi" ? "Chạm vào số lớn nhất." : "Tap the biggest number.") : (lang === "vi" ? "Chạm vào số bé nhất." : "Tap the smallest number."), reveal: String(tv) });
    }
    var v = pick(V), rest = shuf(V.filter(function (x) { return x !== v; })).slice(0, 8), all = shuf([v].concat(rest)), nm = name(v, subj);
    return base("find", subj, g, lang, subj === "tanh" ? (lang === "vi" ? "Tìm <em>" + nm + "</em>" : "Find the <em>" + nm + "</em>") : (lang === "vi" ? "Tìm <em>" + nm + "</em>" : "Find <em>" + nm + "</em>"), { o: all.map(function (x) { var o = { v: x.e }; if (x === v) o.ok = 1; return o; }), dk: "find", speak: subj === "tanh" ? (lang === "vi" ? "Tìm " + nm + "." : "Find the " + nm + ".") : (lang === "vi" ? "Tìm " + nm + "." : "Find " + nm + "."), reveal: v.e });
  };
  /* kéo thẻ từ vào chỗ trống trong câu / phép tính */
  G.dragfill = function (subj, g, lang) {
    var bl = '<em class="bl">__</em>', q, right, wrongs;
    if (subj === "toan") {
      var x = arith(g), mode = pick(["res", "a"]);
      if (mode === "res" || x.op === "÷" || x.op === "−") { q = x.txt + " = " + bl; right = String(x.res); wrongs = [x.res + 1, x.res - 1, x.res + 10, x.res - 10, x.res + 2]; }
      else { q = bl + " " + x.op + " " + x.b + " = " + (x.op === "+" ? x.res : x.res); right = String(x.a); wrongs = [x.a + 1, x.a - 1, x.a + 10, x.a - 10, x.a + 2]; }
      wrongs = wrongs.filter(function (w) { return w >= 0; }).map(String);
    } else {
      var S = SENT[subj === "tanh" ? "en" : "vi"], s = pick(S), i = rnd(0, s.length - 1); right = s[i]; var pool = []; S.forEach(function (z) { z.forEach(function (w2) { if (w2 !== right && pool.indexOf(w2) < 0) pool.push(w2); }); }); wrongs = shuf(pool).slice(0, 3);
      q = s.map(function (w2, j) { return j === i ? bl : w2; }).join(" ");
    }
    var ws = []; wrongs.forEach(function (w) { if (w !== right && ws.indexOf(w) < 0 && ws.length < 3) ws.push(w); }); if (ws.length < 3) return null;
    var all = shuf([right].concat(ws));
    return base("dragfill", subj, g, lang, q, { o: optList(all, all.indexOf(right)), speak: lang === "vi" ? "Kéo thẻ đúng vào chỗ trống." : "Drag the right card into the gap.", reveal: right });
  };
  /* phân loại: kéo từng thẻ vào đúng một trong hai rổ */
  G.sort = function (subj, g, lang) {
    var items = [], bins;
    if (subj === "toan") {
      var k = g <= 2 ? 2 : pick([2, 3, 4, 5]), a = [], b = [], t = 0, lo = g <= 2 ? 1 : 10, hi = g <= 2 ? 20 : 60;
      while ((a.length < 3 || b.length < 3) && t++ < 400) { var n = rnd(lo, hi); if (a.indexOf(n) >= 0 || b.indexOf(n) >= 0) continue; if (n % k === 0) { if (a.length < 3) a.push(n); } else if (b.length < 3) b.push(n); }
      if (a.length < 3 || b.length < 3) return null;
      bins = g <= 2 ? (lang === "vi" ? ["Số chẵn", "Số lẻ"] : ["Even", "Odd"]) : (lang === "vi" ? ["Chia hết cho " + k, "Không chia hết"] : ["Divisible by " + k, "Not divisible"]);
      items = shuf(a.map(function (n) { return { v: String(n), bin: 0 }; }).concat(b.map(function (n) { return { v: String(n), bin: 1 }; })));
    } else {
      var cs = shuf(Object.keys(CAT)), c1 = cs[0], c2 = cs[1], p1 = shuf(V.filter(function (v) { return v.c === c1; })).slice(0, 3), p2 = shuf(V.filter(function (v) { return v.c === c2; })).slice(0, 3);
      if (p1.length < 3 || p2.length < 3) return null; bins = [CAT[c1][lang], CAT[c2][lang]];
      items = shuf(p1.map(function (v) { return { v: v.e, bin: 0 }; }).concat(p2.map(function (v) { return { v: v.e, bin: 1 }; })));
    }
    return base("sort", subj, g, lang, lang === "vi" ? "Kéo mỗi thẻ vào <em>đúng rổ</em>" : "Drag each card into the <em>right basket</em>", { items: items, bins: bins, speak: lang === "vi" ? "Kéo mỗi thẻ vào đúng rổ." : "Drag each card into the right basket." });
  };
  /* bắn bong bóng: dùng lại một câu chọn 1/4 bất kỳ (giữ nguyên kỹ năng) nhưng đáp án là bong bóng bay lên */
  function asPop(q, lang) { if (!q || !q.o || (q.kind && q.kind !== "mc") || q.o.length !== 4) return null; var c = {}; for (var k in q) c[k] = q[k]; c.kind = "pop"; c.baseKind = q.kind || "mc"; c.lab = LAB[lang === "en" ? "en" : "vi"].pop; return c; }

  /* ====== KIỂU CHUNG THEO LỚP (Tiếng Việt, Tiếng Anh) ======
     Lớp 1–2: giữ kiểu có hình (emoji từ vựng). Từ lớp 3: KHÔNG dùng emoji-từ-vựng; thay bằng kiến thức hợp lớp (từ loại, trái nghĩa,
     kiểu câu, số nhiều, thứ trong tuần…). Mọi câu có đúng MỘT đáp án (dữ liệu ngắn, soạn tay hoặc lấy từ LearnLangSkills.DATA đã kiểm). */
  var HI = {};
  var CLS = { things: "danh từ", actions: "động từ", traits: "tính từ" };
  var STYPE = { k: "câu kể", h: "câu hỏi", c: "câu cảm", y: "câu khiến" };
  var EN_ANT = [["big", "small"], ["hot", "cold"], ["happy", "sad"], ["tall", "short"], ["fast", "slow"], ["open", "close"], ["clean", "dirty"], ["day", "night"]];
  var EN_PL = [["child", "children"], ["man", "men"], ["woman", "women"], ["foot", "feet"], ["tooth", "teeth"], ["mouse", "mice"]];
  var EN_THEMES = ["body", "food", "clothes", "animals", "transport", "weather"], EN_TH_NAME = { body: "body parts", food: "food", clothes: "clothes", animals: "animals", transport: "transport", weather: "weather" };
  var EN_TF = [["We say “an umbrella”.", 1], ["We say “a hour”.", 0], ["The plural of “child” is “children”.", 1], ["The plural of “box” is “boxs”.", 0], ["“She goes to school.” is correct.", 1], ["“She go to school.” is correct.", 0],
    ["Saturday comes after Friday.", 1], ["Tuesday comes before Monday.", 0], ["“Where” is a question word.", 1], ["“Happy” means “sad”.", 0], ["“Big” and “small” are opposites.", 1], ["There are seven days in a week.", 1], ["February has 31 days.", 0],
    ["“Mice” is the plural of “mouse”.", 1], ["“He have a dog.” is correct.", 0], ["We use “How much” to ask about the price.", 1], ["“What time is it?” asks about the time.", 1], ["“I am eleven year old.” is correct.", 0], ["“Thursday” comes after “Wednesday”.", 1], ["“Apple” starts with a vowel sound.", 1]];
  var VI_TF = [["“Hôm nay” là một từ chỉ thời gian.", 1], ["Câu “Bạn tên là gì?” cuối câu dùng dấu chấm hỏi.", 1], ["“Mùa xuân” là mùa đầu tiên trong năm.", 1], ["Một năm có bốn mùa.", 1], ["Một tuần có sáu ngày.", 0], ["“Đỏ” là tên một màu sắc.", 1], ["“Chiếc bút” dùng để viết.", 1], ["Con cá sống trên cây.", 0], ["Dấu chấm đặt ở cuối câu kể.", 1], ["Tên riêng của người phải viết hoa chữ cái đầu.", 1], ["“Bàn” và “ghế” đều là đồ vật.", 1], ["Mặt trời mọc ở hướng tây.", 0]];
  function ldOK() { return !!LD; }
  function clsPick(n, cls) { return shuf(LD[cls]).slice(0, n); }
  function antPairs(n) { return shuf(LD.antonyms).slice(0, n).map(function (a) { return [a[0], a[1]]; }); }
  function enPairs(n) { var all = shuf(EN_ANT.concat(EN_PL)), out = [], seen = {}; all.forEach(function (p) { if (out.length < n && !seen[p[0]] && !seen[p[1]]) { seen[p[0]] = seen[p[1]] = 1; out.push(p); } }); return out; }
  function thWords(th) { return LD.themes[th].map(function (x) { return x[1]; }); }
  var allThemeWords = function (ths) { var o = {}; ths.forEach(function (t) { thWords(t).forEach(function (w) { o[w] = (o[w] || 0) + 1; }); }); return o; };
  function enTwoThemes() { var cs = shuf(EN_THEMES), a = cs[0], b = cs[1], wa = thWords(a), wb = thWords(b); return { a: a, b: b, wa: wa.filter(function (w) { return wb.indexOf(w) < 0; }), wb: wb.filter(function (w) { return wa.indexOf(w) < 0; }) }; }

  HI.tf = function (subj, g, lang) {
    var truth, q, speak, ui = UI[lang], it;
    if (subj === "tanh") { it = pick(EN_TF); q = it[0]; truth = !!it[1]; speak = q + ". True or false?"; }
    else {
      var kind = pick(g >= 4 ? ["cls", "ant", "stype", "fact"] : ["cls", "ant", "fact"]); truth = R() < .5;
      if (kind === "fact") { it = pick(VI_TF); q = it[0]; truth = !!it[1]; }
      else if (kind === "cls") { var cl = pick(Object.keys(CLS)), w = pick(LD[cl]), c2 = truth ? cl : pick(Object.keys(CLS).filter(function (x) { return x !== cl; })); q = "“" + w + "” là " + CLS[c2] + "."; }
      else if (kind === "ant") { var ps = antPairs(2), a = ps[0][0], b = truth ? ps[0][1] : ps[1][1]; q = "“" + a + "” và “" + b + "” là hai từ trái nghĩa."; }
      else { var sn = pick(LD.sentences), tt = truth ? sn[1] : pick(Object.keys(STYPE).filter(function (x) { return x !== sn[1]; })); q = "Câu “" + sn[0] + (sn[1] === "h" ? "?" : sn[1] === "c" ? "!" : ".") + "” là " + STYPE[tt] + "."; }
      speak = q.replace(/[“”]/g, "") + " " + (lang === "vi" ? "Đúng hay sai?" : "True or false?");
    }
    var o = [{ v: ui.yes }, { v: ui.no }]; (truth ? o[0] : o[1]).ok = 1;
    return base("tf", subj, g, lang, q, { o: o, speak: speak, meta: { truth: truth }, reveal: truth ? ui.yes : ui.no });
  };
  HI.odd = function (subj, g, lang) {
    var list, ok, qv = lang === "vi" ? "Ba từ cùng loại, <em>từ nào khác loại?</em>" : "Three words match. <em>Which one is different?</em>";
    if (subj === "tviet") { var cs = shuf(Object.keys(CLS)), a = cs[0], b = cs[1], g3 = clsPick(3, a), od = pick(LD[b]); list = shuf(g3.concat([od])); ok = list.indexOf(od); }
    else { var t = enTwoThemes(), tri = shuf(t.wa).slice(0, 3), o2 = pick(t.wb); list = shuf(tri.concat([o2])); ok = list.indexOf(o2); }
    return base("odd", subj, g, lang, qv, { o: optList(list, ok), speak: lang === "vi" ? "Ba từ cùng loại, từ nào khác loại?" : "Three words match. Which one is different?", reveal: list[ok] });
  };
  HI.multi = function (subj, g, lang) {
    var opts, q, speak, want = rnd(2, 3);
    if (subj === "tviet") {
      var cl = pick(Object.keys(CLS)), good = clsPick(want, cl), bad = shuf([].concat.apply([], Object.keys(CLS).filter(function (x) { return x !== cl; }).map(function (x) { return LD[x]; }))).slice(0, 6 - want);
      opts = shuf(good.map(function (w) { return { v: w, ok: 1 }; }).concat(bad.map(function (w) { return { v: w }; })));
      q = "Chọn <em>tất cả " + CLS[cl] + "</em>"; speak = "Chọn tất cả " + CLS[cl] + ".";
    } else {
      var th = pick(EN_THEMES), ow = EN_THEMES.filter(function (x) { return x !== th; }), mine = thWords(th), pool = []; ow.forEach(function (x) { thWords(x).forEach(function (w) { if (mine.indexOf(w) < 0 && pool.indexOf(w) < 0) pool.push(w); }); });
      opts = shuf(shuf(mine).slice(0, want).map(function (w) { return { v: w, ok: 1 }; }).concat(shuf(pool).slice(0, 6 - want).map(function (w) { return { v: w }; })));
      q = "Pick <em>all the " + EN_TH_NAME[th] + " words</em>"; speak = "Pick all the " + EN_TH_NAME[th] + " words.";
    }
    return base("multi", subj, g, lang, lang === "vi" && subj === "tanh" ? "Chọn <em>tất cả từ chỉ " + { "body parts": "bộ phận cơ thể", food: "đồ ăn", clothes: "quần áo", animals: "con vật", transport: "phương tiện", weather: "thời tiết" }[q.replace(/.*all the (.*) words.*/, "$1")] + "</em>" : q, { opts: opts, speak: speak, reveal: "" });
  };
  HI.sort = function (subj, g, lang) {
    var a, b, ba, bb;
    if (subj === "tviet") { var cs = shuf(Object.keys(CLS)); a = clsPick(3, cs[0]); b = clsPick(3, cs[1]); ba = CLS[cs[0]]; bb = CLS[cs[1]]; ba = ba.charAt(0).toUpperCase() + ba.slice(1); bb = bb.charAt(0).toUpperCase() + bb.slice(1); }
    else { var t = enTwoThemes(); a = shuf(t.wa).slice(0, 3); b = shuf(t.wb).slice(0, 3); ba = EN_TH_NAME[t.a]; bb = EN_TH_NAME[t.b]; }
    var items = shuf(a.map(function (v) { return { v: v, bin: 0 }; }).concat(b.map(function (v) { return { v: v, bin: 1 }; })));
    return base("sort", subj, g, lang, lang === "vi" ? "Kéo mỗi thẻ vào <em>đúng rổ</em>" : "Drag each card into the <em>right basket</em>", { items: items, bins: [ba, bb], speak: lang === "vi" ? "Kéo mỗi thẻ vào đúng rổ." : "Drag each card into the right basket." });
  };
  function pairsHi(subj) { return subj === "tviet" ? antPairs(4) : enPairs(4); }
  HI.match = function (subj, g, lang) {
    var vi = subj === "tviet";
    return base("match", subj, g, lang, vi ? "Ghép mỗi từ với <em>từ trái nghĩa</em> của nó" : (lang === "vi" ? "Ghép mỗi từ với từ <em>trái nghĩa</em> hoặc <em>số nhiều</em>" : "Match each word with its <em>opposite</em> or <em>plural</em>"), { pairs: pairsHi(subj), speak: vi ? "Ghép mỗi từ với từ trái nghĩa của nó." : "Match each word with its opposite or plural." });
  };
  HI.memory = function (subj, g, lang) {
    return base("memory", subj, g, lang, lang === "vi" ? "Lật hai thẻ để tìm <em>cặp từ</em> đi cùng nhau" : "Flip two cards to find a <em>matching pair</em>", { pairs: pairsHi(subj), speak: lang === "vi" ? "Lật hai thẻ để tìm cặp từ đi cùng nhau." : "Flip two cards to find a matching pair." });
  };
  /* sắp xếp câu và kéo-thả từ: câu soạn tay, đáp án duy nhất */
  var SENT3 = { vi: [["Cánh", "đồng", "lúa", "chín", "vàng", "như", "tấm", "thảm", "khổng", "lồ"], ["Dòng", "sông", "quê", "em", "uốn", "lượn", "quanh", "làng"], ["Em", "luôn", "giữ", "gìn", "sách", "vở", "sạch", "đẹp"], ["Những", "chú", "chim", "hót", "líu", "lo", "trên", "cành", "cây"], ["Bạn", "Lan", "luôn", "giúp", "đỡ", "các", "bạn", "trong", "lớp"], ["Mùa", "xuân", "đến", "hoa", "đào", "nở", "đỏ", "thắm"]],
    en: [["My", "brother", "plays", "football", "every", "Sunday"], ["There", "are", "two", "books", "on", "the", "table"], ["She", "is", "reading", "a", "story", "now"], ["What", "time", "do", "you", "get", "up"], ["How", "much", "is", "this", "T-shirt"], ["Would", "you", "like", "some", "orange", "juice"], ["The", "children", "are", "playing", "in", "the", "park"], ["Where", "is", "the", "library"], ["He", "wants", "to", "be", "a", "doctor"]] };
  HI.order = function (subj, g, lang) {
    var s = pick(SENT3[subj === "tanh" ? "en" : "vi"]);
    return base("order", subj, g, lang, lang === "vi" ? "Xếp các từ thành <em>câu đúng</em>" : "Put the words in the <em>right order</em>", { items: s.slice(), speak: lang === "vi" ? "Xếp các từ thành câu đúng." : "Put the words in the right order.", reveal: s.join(" ") });
  };
  /* kéo thẻ vào chỗ trống: [lớp nhỏ nhất, câu có "__", đáp án, [3 nhiễu khác loại hẳn]] — nhiễu sai ngữ pháp/ngữ nghĩa rõ, không điền được */
  var DF = { vi: [[1, "Bé tưới __ mỗi sáng.", "cây", ["sách", "bàn", "bút"]], [1, "Mẹ nấu __ cho cả nhà.", "cơm", ["ghế", "mây", "bút"]], [1, "Em đọc __ ở thư viện.", "sách", ["cơm", "mưa", "chó"]], [1, "Con mèo ngủ trên __.", "ghế", ["gió", "bút", "mưa"]], [1, "Em đi __ mỗi ngày.", "học", ["đẹp", "xanh", "nhỏ"]], [1, "Trời hôm nay rất __.", "đẹp", ["ăn", "chạy", "sách"]], [1, "Chú chó đang __ ngoài sân.", "chạy", ["xanh", "bàn", "đẹp"]],
    [3, "Cô giáo giảng bài rất __.", "hay", ["bàn", "cặp", "trường"]], [3, "Em đã __ xong bài tập về nhà.", "làm", ["xanh", "nhỏ", "bàn"]], [3, "Mặt trời __ ở đằng đông.", "mọc", ["mát", "tròn", "xanh"]], [3, "Dòng sông uốn __ quanh làng.", "lượn", ["sách", "xanh", "nhỏ"]], [3, "Vì trời mưa __ em mặc áo mưa.", "nên", ["nhưng", "hoặc", "dù"]],
    [4, "Tuy nhà xa __ bạn Nam không bao giờ đi học muộn.", "nhưng", ["nên", "vì", "hoặc"]], [4, "Em thích cả bóng đá __ bóng rổ.", "và", ["nhưng", "vì", "nên"]], [4, "Con muốn ăn cơm __ ăn phở?", "hay", ["và", "nên", "vì"]], [4, "Những chú chim hót __ trên cành cây.", "líu lo", ["lạnh buốt", "tròn xoe", "xanh ngắt"]]],
    en: [[1, "She reads a __.", "book", ["run", "happy", "fast"]], [1, "The cat is __.", "small", ["book", "go", "apples"]], [1, "We __ to school.", "go", ["book", "small", "apple"]], [1, "I have a __.", "dog", ["run", "happy", "go"]], [1, "It is a __ day.", "sunny", ["book", "eat", "dog"]], [1, "He can __ fast.", "run", ["book", "dog", "happy"]],
    [3, "My brother __ football every Sunday.", "plays", ["play", "playing", "played"]], [3, "There __ two books on the table.", "are", ["is", "am", "be"]], [3, "She is __ a letter now.", "writing", ["write", "writes", "wrote"]], [3, "I __ breakfast at seven o’clock.", "have", ["has", "having", "is"]], [3, "Lan and Mai __ good friends.", "are", ["is", "am", "be"]], [3, "The sun __ in the east.", "rises", ["rise", "rising", "rose"]],
    [4, "How __ is this pen?", "much", ["many", "are", "do"]], [4, "My favourite __ is Monday.", "day", ["colour", "food", "animal"]], [4, "Would you __ some tea?", "like", ["likes", "liking", "to"]]] };
  var dragOld = G.dragfill;
  G.dragfill = function (subj, g, lang) {
    if (subj === "toan") return dragOld(subj, g, lang);
    var pool = DF[subj === "tanh" ? "en" : "vi"].filter(function (x) { return g <= 2 ? x[0] === 1 : (g >= 4 ? x[0] >= 3 : x[0] === 3 || x[0] === 4); });
    var it = pick(pool), q = it[1].replace("__", '<em class="bl">__</em>'), all = shuf([it[2]].concat(it[3]));
    return base("dragfill", subj, g, lang, q, { o: optList(all, all.indexOf(it[2])), speak: lang === "vi" ? "Kéo thẻ đúng vào chỗ trống." : "Drag the right card into the gap.", reveal: it[2] });
  };
  ["tf", "odd", "multi", "sort", "match", "memory", "order"].forEach(function (k) { var old = G[k]; G[k] = function (subj, g, lang) { return (subj !== "toan" && g >= 3 && ldOK()) ? HI[k](subj, g, lang) : old(subj, g, lang); }; });

  var KINDS = { toan: ["tf", "pic", "match", "order", "typein", "odd", "multi", "compare", "count", "memory", "numline", "clock", "find", "dragfill", "sort"], tviet: ["tf", "pic", "match", "order", "wordbuild", "odd", "multi", "memory", "find", "dragfill", "sort", "dictate", "write", "speak", "trace"], tanh: ["tf", "pic", "match", "order", "wordbuild", "odd", "multi", "memory", "find", "dragfill", "sort", "dictate", "write", "speak"] };
  function kindsFor(subj, grade) { return (KINDS[subj] || []).filter(function (k) { if (subj !== "toan" && grade >= 3 && (k === "pic" || k === "wordbuild" || k === "find")) return false; if (k === "speak") return subj === "toan" ? false : (subj === "tviet" ? grade <= 2 : grade <= 3);  if (k === "trace") return subj === "tviet" && grade === 1; if (k === "dictate") return subj === "tviet" ? grade <= 2 : grade >= 2; if (k === "write") return subj === "tviet" ? grade >= 2 : grade >= 3; return true; }).filter(function (k) { return !(subj === "toan" && ((k === "pic" && grade > 2) || (k === "count" && grade > 2) || (k === "clock" && grade > 3) || (k === "memory" && grade > 3))); }); }
  function make(kind, subj, grade, lang) { grade = Math.min(5, Math.max(1, grade | 0 || 1)); lang = lang === "en" ? "en" : "vi"; var f = G[kind]; return f ? f(subj, grade, lang) : null; }
  /* câu chọn 1/4 có đáp án là SỐ NGUYÊN (có thể kèm đơn vị) → câu cho bé GÕ số. Giữ kỹ năng, chủ đề, mã lỗi của từng đáp án nhiễu (gõ trúng đáp án nhiễu nào thì ghi mã lỗi đó). */
  function asTypein(q, lang) {
    if (!q || q.kind || !q.o || q.o.length !== 4 || !q.skill) return null;
    var fr = /^(\d{1,3} )?\d{1,4}\/\d{1,4}$/, isFr = q.o.every(function (x) { return fr.test(x.v); });
    if (isFr) {   /* đáp án là phân số (hoặc hỗn số): bé gõ "3/4" / "1 1/2"; phím "/" và phím cách do qui.js hiện khi frac:true */
      var fv = function (t) { var m = /^(?:(\d+) )?(\d+)\/(\d+)$/.exec(t); return (Number(m[1] || 0) * Number(m[3]) + Number(m[2])) / Number(m[3]); }, fok = null, ftags = {}, feq = false, j;
      for (j = 0; j < 4; j++) { if (q.o[j].ok) fok = q.o[j].v; }
      if (fok === null) return null;
      for (j = 0; j < 4; j++) if (!q.o[j].ok) { ftags[q.o[j].v] = q.o[j].tag || "other"; if (Math.abs(fv(q.o[j].v) - fv(fok)) < 1e-9) feq = true; }
      var fplain = String(q.q).replace(/<br>/g, ". ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return { kind: "typein", type: "typein", q: q.q, lab: LAB[lang].typein, subj: q.subj, grade: q.grade, skill: q.skill, topic: q.topic, diff: q.diff, id: q.id, hint: q.hint, ui: UI[lang], ans: fok, show: fok, dec: false, frac: true, exact: feq || /rút gọn|tối giản|simplif/i.test(fplain), sep: lang === "vi" ? "," : ".", unit: null, tags: ftags, speak: fplain, reveal: fok };
    }
    var re = /^(\d{1,6}(?:[.,]\d{1,3})?)(?: (\S+))?$/, ok = null, show = "", tags = {}, unit = null, dec = false, i, m, key;
    for (i = 0; i < 4; i++) { m = re.exec(q.o[i].v); if (!m) return null; if (unit === null) unit = m[2] || ""; else if ((m[2] || "") !== unit) return null; key = String(Number(m[1].replace(",", "."))); if (/[.,]/.test(m[1])) dec = true; if (q.o[i].ok) { ok = key; show = m[1]; } else tags[key] = q.o[i].tag || "other"; }
    if (ok === null) return null;
    var plain = String(q.q).replace(/<br>/g, ". ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return { kind: "typein", type: "typein", q: q.q, lab: LAB[lang].typein, subj: q.subj, grade: q.grade, skill: q.skill, topic: q.topic, diff: q.diff, id: q.id, hint: q.hint, ui: UI[lang], ans: ok, show: show, dec: dec, sep: lang === "vi" ? "," : ".", unit: unit, tags: tags, speak: plain, reveal: show + (unit ? " " + unit : "") };
  }
  /* trộn kiểu mới vào một vòng: giữ câu đầu là chọn 1/4 (khởi động), thay n câu sau bằng các kiểu KHÁC NHAU */
  function mix(round, subj, grade, lang, n) {
    if (subj === "toan" && grade >= 3) n = Math.min(n == null ? 3 : n, 2);   /* Toán lớp 3+: tối đa 2 câu kiểu chung (còn lại là kỹ năng theo chương trình) */
    var ks = shuf(kindsFor(subj, grade)), pos = shuf([1, 2, 3, 4].filter(function (i) { return i < round.length; })), out = round.slice(), done = 0;
    for (var i = 0; i < ks.length && done < (n == null ? 3 : n) && done < pos.length; i++) { var q = make(ks[i], subj, grade, lang); if (q) { out[pos[done]] = q; done++; } }
    /* từ lớp 2: câu chọn 1/4 có đáp án số nguyên, ~40% cho bé tự GÕ số (câu 1 giữ chọn 1/4 làm khởi động) */
    if (subj === "toan" && grade >= 2) for (var t = 1; t < out.length; t++) if (R() < .4) { var tq = asTypein(out[t], lang); if (tq) out[t] = tq; }
    /* một câu chọn 1/4 còn lại (nếu có) đổi sang dạng bong bóng, vẫn giữ kỹ năng và mã lỗi */
    if (R() < .7) { var rest = pos.slice(done); for (var j = 0; j < rest.length; j++) { var pq = asPop(out[rest[j]], lang); if (pq) { out[rest[j]] = pq; break; } } }
    return out;
  }
  /* tên đồ vật theo emoji (cho giọng đọc): "🍇" -> "chùm nho" / "grapes" */
  function nameOf(e, lang) { e = String(e).replace(/\uFE0F/g, ""); for (var i = 0; i < V.length; i++) { if (V[i].e.replace(/\uFE0F/g, "") === e) return lang === "vi" ? V[i].vi : V[i].en; } return ""; }
  root.LearnTypes = { nameOf: nameOf, checkWrite: checkWrite, asTypein: asTypein, asPop: asPop, make: make, mix: mix, kindsFor: kindsFor, KINDS: KINDS, LAB: LAB };
  if (typeof module !== "undefined" && module.exports) module.exports = root.LearnTypes;
})(typeof window !== "undefined" ? window : globalThis);
