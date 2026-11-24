/* KIỂU CÂU CHUNG THEO LỚP cho Tiếng Việt / Tiếng Anh (module của qtypes.js): lớp 1–2 giữ kiểu có hình, từ lớp 3 dùng kiến thức hợp lớp.
   qtypes.js gọi LearnTypesHi(ctx) để ghi đè G.tf/odd/multi/sort/match/memory/order/dragfill. Nạp TRƯỚC qtypes.js (index.html, sw.js). */
(function (root) {
  "use strict";
  function install(c) {
    var G = c.G, base = c.base, optList = c.optList, pick = c.pick, rnd = c.rnd, shuf = c.shuf, R = c.R, UI = c.UI, LD = c.LD;
  /* ====== KIỂU CHUNG THEO LỚP (Tiếng Việt, Tiếng Anh) ======
     Lớp 1–2: giữ kiểu có hình (emoji từ vựng). Từ lớp 3: KHÔNG dùng emoji-từ-vựng; thay bằng kiến thức hợp lớp (từ loại, trái nghĩa,
     kiểu câu, số nhiều, thứ trong tuần…). Mọi câu có đúng MỘT đáp án (dữ liệu ngắn, soạn tay hoặc lấy từ LearnLangSkills.DATA đã kiểm). */
  var HI = {};
  var CLS = { things: "danh từ", actions: "động từ", traits: "tính từ" };
  var STYPE = { k: "câu kể", h: "câu hỏi", c: "câu cảm", y: "câu khiến" };
  var EN_ANT = [["big", "small"], ["hot", "cold"], ["happy", "sad"], ["tall", "short"], ["fast", "slow"], ["open", "close"], ["clean", "dirty"], ["day", "night"]];
  var EN_PL = [["child", "children"], ["man", "men"], ["woman", "women"], ["foot", "feet"], ["tooth", "teeth"], ["mouse", "mice"]];
  var EN_THEMES = ["body", "food", "clothes", "animals", "transport", "weather"], EN_TH_NAME = { body: "body parts", food: "food", clothes: "clothes",
    animals: "animals", transport: "transport", weather: "weather" };
  var EN_TF = [["We say “an umbrella”.", 1], ["We say “a hour”.", 0], ["The plural of “child” is “children”.", 1], ["The plural of “box” is “boxs”.", 0],
    ["“She goes to school.” is correct.", 1], ["“She go to school.” is correct.", 0],
    ["Saturday comes after Friday.", 1], ["Tuesday comes before Monday.", 0], ["“Where” is a question word.", 1], ["“Happy” means “sad”.", 0],
      ["“Big” and “small” are opposites.", 1], ["There are seven days in a week.", 1], ["February has 31 days.", 0],
    ["“Mice” is the plural of “mouse”.", 1], ["“He have a dog.” is correct.", 0], ["We use “How much” to ask about the price.", 1],
      ["“What time is it?” asks about the time.", 1], ["“I am eleven year old.” is correct.", 0], ["“Thursday” comes after “Wednesday”.", 1], ["“Apple” starts with a vowel sound.", 1]];
  var VI_TF = [["“Hôm nay” là một từ chỉ thời gian.", 1], ["Câu “Bạn tên là gì?” cuối câu dùng dấu chấm hỏi.", 1], ["“Mùa xuân” là mùa đầu tiên trong năm.", 1],
    ["Một năm có bốn mùa.", 1], ["Một tuần có sáu ngày.", 0], ["“Đỏ” là tên một màu sắc.", 1], ["“Chiếc bút” dùng để viết.", 1], ["Con cá sống trên cây.", 0],
      ["Dấu chấm đặt ở cuối câu kể.", 1], ["Tên riêng của người phải viết hoa chữ cái đầu.", 1], ["“Bàn” và “ghế” đều là đồ vật.", 1], ["Mặt trời mọc ở hướng tây.", 0]];
  function ldOK() { return !!LD; }
  function clsPick(n, cls) { return shuf(LD[cls]).slice(0, n); }
  function antPairs(n) { return shuf(LD.antonyms).slice(0, n).map(function (a) { return [a[0], a[1]]; }); }
  function enPairs(n) { var all = shuf(EN_ANT.concat(EN_PL)), out = [], seen = {};
    all.forEach(function (p) { if (out.length < n && !seen[p[0]] && !seen[p[1]]) { seen[p[0]] = seen[p[1]] = 1; out.push(p); } }); return out; }
  function thWords(th) { return LD.themes[th].map(function (x) { return x[1]; }); }
  var allThemeWords = function (ths) { var o = {}; ths.forEach(function (t) { thWords(t).forEach(function (w) { o[w] = (o[w] || 0) + 1; }); }); return o; };
  function enTwoThemes() { var cs = shuf(EN_THEMES), a = cs[0], b = cs[1], wa = thWords(a), wb = thWords(b);
    return { a: a, b: b, wa: wa.filter(function (w) { return wb.indexOf(w) < 0; }), wb: wb.filter(function (w) { return wa.indexOf(w) < 0; }) }; }

  HI.tf = function (subj, g, lang) {
    var truth, q, speak, ui = UI[lang], it;
    if (subj === "tanh") { it = pick(EN_TF); q = it[0]; truth = !!it[1]; speak = q + ". True or false?"; }
    else {
      var kind = pick(g >= 4 ? ["cls", "ant", "stype", "fact"] : ["cls", "ant", "fact"]); truth = R() < .5;
      if (kind === "fact") { it = pick(VI_TF); q = it[0]; truth = !!it[1]; }
      else if (kind === "cls") { var cl = pick(Object.keys(CLS)), w = pick(LD[cl]), c2 = truth ? cl : pick(Object.keys(CLS).filter(function (x) { return x !== cl; }));
        q = "“" + w + "” là " + CLS[c2] + "."; }
      else if (kind === "ant") { var ps = antPairs(2), a = ps[0][0], b = truth ? ps[0][1] : ps[1][1]; q = "“" + a + "” và “" + b + "” là hai từ trái nghĩa."; }
      else { var sn = pick(LD.sentences), tt = truth ? sn[1] : pick(Object.keys(STYPE).filter(function (x) { return x !== sn[1]; }));
        q = "Câu “" + sn[0] + (sn[1] === "h" ? "?" : sn[1] === "c" ? "!" : ".") + "” là " + STYPE[tt] + "."; }
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
      var cl = pick(Object.keys(CLS)), good = clsPick(want, cl), bad = shuf([].concat.apply([], Object.keys(CLS).filter(function (x) { return x !== cl;
        }).map(function (x) { return LD[x]; }))).slice(0, 6 - want);
      opts = shuf(good.map(function (w) { return { v: w, ok: 1 }; }).concat(bad.map(function (w) { return { v: w }; })));
      q = "Chọn <em>tất cả " + CLS[cl] + "</em>"; speak = "Chọn tất cả " + CLS[cl] + ".";
    } else {
      var th = pick(EN_THEMES), ow = EN_THEMES.filter(function (x) { return x !== th; }), mine = thWords(th), pool = [];
        ow.forEach(function (x) { thWords(x).forEach(function (w) { if (mine.indexOf(w) < 0 && pool.indexOf(w) < 0) pool.push(w); }); });
      opts = shuf(shuf(mine).slice(0, want).map(function (w) { return { v: w, ok: 1 }; }).concat(shuf(pool).slice(0, 6 - want).map(function (w) { return { v: w }; })));
      q = "Pick <em>all the " + EN_TH_NAME[th] + " words</em>"; speak = "Pick all the " + EN_TH_NAME[th] + " words.";
    }
    return base("multi", subj, g, lang, lang === "vi" && subj === "tanh" ? "Chọn <em>tất cả từ chỉ " + { "body parts": "bộ phận cơ thể", food: "đồ ăn",
      clothes: "quần áo", animals: "con vật", transport: "phương tiện",
        weather: "thời tiết" }[q.replace(/.*all the (.*) words.*/, "$1")] + "</em>" : q, { opts: opts, speak: speak, reveal: "" });
  };
  HI.sort = function (subj, g, lang) {
    var a, b, ba, bb;
    if (subj === "tviet") { var cs = shuf(Object.keys(CLS)); a = clsPick(3, cs[0]); b = clsPick(3, cs[1]); ba = CLS[cs[0]]; bb = CLS[cs[1]];
      ba = ba.charAt(0).toUpperCase() + ba.slice(1); bb = bb.charAt(0).toUpperCase() + bb.slice(1); }
    else { var t = enTwoThemes(); a = shuf(t.wa).slice(0, 3); b = shuf(t.wb).slice(0, 3); ba = EN_TH_NAME[t.a]; bb = EN_TH_NAME[t.b]; }
    var items = shuf(a.map(function (v) { return { v: v, bin: 0 }; }).concat(b.map(function (v) { return { v: v, bin: 1 }; })));
    return base("sort", subj, g, lang, lang === "vi" ? "Kéo mỗi thẻ vào <em>đúng rổ</em>" : "Drag each card into the <em>right basket</em>",
      { items: items, bins: [ba, bb], speak: lang === "vi" ? "Kéo mỗi thẻ vào đúng rổ." : "Drag each card into the right basket." });
  };
  function pairsHi(subj) { return subj === "tviet" ? antPairs(4) : enPairs(4); }
  HI.match = function (subj, g, lang) {
    var vi = subj === "tviet";
    return base("match", subj, g, lang, vi ? "Ghép mỗi từ với <em>từ trái nghĩa</em> của nó" : (lang === "vi" ? "Ghép mỗi từ với từ <em>trái nghĩa</em> hoặc <em>số nhiều</em>" : "Match each word with its <em>opposite</em> or <em>plural</em>"), { pairs: pairsHi(subj), speak: vi ? "Ghép mỗi từ với từ trái nghĩa của nó." : "Match each word with its opposite or plural." });
  };
  HI.memory = function (subj, g, lang) {
    return base("memory", subj, g, lang, lang === "vi" ? "Lật hai thẻ để tìm <em>cặp từ</em> đi cùng nhau" : "Flip two cards to find a <em>matching pair</em>",
      { pairs: pairsHi(subj), speak: lang === "vi" ? "Lật hai thẻ để tìm cặp từ đi cùng nhau." : "Flip two cards to find a matching pair." });
  };
  /* sắp xếp câu và kéo-thả từ: câu soạn tay, đáp án duy nhất */
  var SENT3 = { vi: [["Cánh", "đồng", "lúa", "chín", "vàng", "như", "tấm", "thảm", "khổng", "lồ"], ["Dòng", "sông", "quê", "em", "uốn", "lượn", "quanh", "làng"], ["Em",
    "luôn", "giữ", "gìn", "sách", "vở", "sạch", "đẹp"], ["Những", "chú", "chim", "hót", "líu", "lo", "trên", "cành", "cây"], ["Bạn", "Lan", "luôn", "giúp", "đỡ", "các",
      "bạn", "trong", "lớp"], ["Mùa", "xuân", "đến", "hoa", "đào", "nở", "đỏ", "thắm"]],
    en: [["My", "brother", "plays", "football", "every", "Sunday"], ["There", "are", "two", "books", "on", "the", "table"], ["She", "is", "reading", "a", "story",
      "now"], ["What", "time", "do", "you", "get", "up"], ["How", "much", "is", "this", "T-shirt"], ["Would", "you", "like", "some", "orange", "juice"], ["The",
        "children", "are", "playing", "in", "the", "park"], ["Where", "is", "the", "library"], ["He", "wants", "to", "be", "a", "doctor"]] };
  HI.order = function (subj, g, lang) {
    var s = pick(SENT3[subj === "tanh" ? "en" : "vi"]);
    return base("order", subj, g, lang, lang === "vi" ? "Xếp các từ thành <em>câu đúng</em>" : "Put the words in the <em>right order</em>",
      { items: s.slice(), speak: lang === "vi" ? "Xếp các từ thành câu đúng." : "Put the words in the right order.", reveal: s.join(" ") });
  };
  /* kéo thẻ vào chỗ trống: [lớp nhỏ nhất, câu có "__", đáp án, [3 nhiễu khác loại hẳn]] — nhiễu sai ngữ pháp/ngữ nghĩa rõ, không điền được */
  var DF = { vi: [[1, "Bé tưới __ mỗi sáng.", "cây", ["sách", "bàn", "bút"]], [1, "Mẹ nấu __ cho cả nhà.", "cơm", ["ghế", "mây", "bút"]], [1, "Em đọc __ ở thư viện.",
    "sách", ["cơm", "mưa", "chó"]], [1, "Con mèo ngủ trên __.", "ghế", ["gió", "bút", "mưa"]], [1, "Em đi __ mỗi ngày.", "học", ["đẹp", "xanh", "nhỏ"]],
      [1, "Trời hôm nay rất __.", "đẹp", ["ăn", "chạy", "sách"]], [1, "Chú chó đang __ ngoài sân.", "chạy", ["xanh", "bàn", "đẹp"]],
    [3, "Cô giáo giảng bài rất __.", "hay", ["bàn", "cặp", "trường"]], [3, "Em đã __ xong bài tập về nhà.", "làm", ["xanh", "nhỏ", "bàn"]],
      [3, "Mặt trời __ ở đằng đông.", "mọc", ["mát", "tròn", "xanh"]], [3, "Dòng sông uốn __ quanh làng.", "lượn", ["sách", "xanh", "nhỏ"]],
        [3, "Vì trời mưa __ em mặc áo mưa.", "nên", ["nhưng", "hoặc", "dù"]],
    [4, "Tuy nhà xa __ bạn Nam không bao giờ đi học muộn.", "nhưng", ["nên", "vì", "hoặc"]], [4, "Em thích cả bóng đá __ bóng rổ.", "và", ["nhưng", "vì", "nên"]],
      [4, "Con muốn ăn cơm __ ăn phở?", "hay", ["và", "nên", "vì"]], [4, "Những chú chim hót __ trên cành cây.", "líu lo", ["lạnh buốt", "tròn xoe", "xanh ngắt"]]],
    en: [[1, "She reads a __.", "book", ["run", "happy", "fast"]], [1, "The cat is __.", "small", ["book", "go", "apples"]], [1, "We __ to school.", "go", ["book",
      "small", "apple"]], [1, "I have a __.", "dog", ["run", "happy", "go"]], [1, "It is a __ day.", "sunny", ["book", "eat", "dog"]], [1, "He can __ fast.", "run",
        ["book", "dog", "happy"]],
    [3, "My brother __ football every Sunday.", "plays", ["play", "playing", "played"]], [3, "There __ two books on the table.", "are", ["is", "am", "be"]],
      [3, "She is __ a letter now.", "writing", ["write", "writes", "wrote"]], [3, "I __ breakfast at seven o’clock.", "have", ["has", "having", "is"]],
        [3, "Lan and Mai __ good friends.", "are", ["is", "am", "be"]], [3, "The sun __ in the east.", "rises", ["rise", "rising", "rose"]],
    [4, "How __ is this pen?", "much", ["many", "are", "do"]], [4, "My favourite __ is Monday.", "day", ["colour", "food", "animal"]], [4, "Would you __ some tea?",
      "like", ["likes", "liking", "to"]]] };
  var dragOld = G.dragfill;
  G.dragfill = function (subj, g, lang) {
    if (subj === "toan") return dragOld(subj, g, lang);
    var pool = DF[subj === "tanh" ? "en" : "vi"].filter(function (x) { return g <= 2 ? x[0] === 1 : (g >= 4 ? x[0] >= 3 : x[0] === 3 || x[0] === 4); });
    var it = pick(pool), q = it[1].replace("__", '<em class="bl">__</em>'), all = shuf([it[2]].concat(it[3]));
    return base("dragfill", subj, g, lang, q, { o: optList(all, all.indexOf(it[2])), speak: lang === "vi" ? "Kéo thẻ đúng vào chỗ trống." : "Drag the right card into the gap.", reveal: it[2] });
  };
  ["tf", "odd", "multi", "sort", "match", "memory", "order"].forEach(function (k) { var old = G[k];
    G[k] = function (subj, g, lang) { return (subj !== "toan" && g >= 3 && ldOK()) ? HI[k](subj, g, lang) : old(subj, g, lang); }; });

  }
  if (typeof module !== "undefined" && module.exports) module.exports = install; else root.LearnTypesHi = install;
})(typeof window !== "undefined" ? window : globalThis);
