/* Kiểu câu hỏi — lõi: ngẫu nhiên, từ vựng có hình, nhãn, số học theo lớp, hàm dựng câu chung (base).
   Một phần của learn/content/qtypes.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung TP. */
(function (root) {
  "use strict";
  function part(TP) {
    var R = Math.random;
    function rnd(a, b) { return a + Math.floor(R() * (b - a + 1)); }
    function pick(a) { return a[rnd(0, a.length - 1)]; }
    function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function nfc(s) { return s.normalize ? s.normalize("NFC") : s; }

    var LAB = {
      vi: { trace: "Tô chữ", dictate: "Nghe – viết", write: "Viết câu", speak: "Đọc to", tf: "Đúng hay sai?", pic: "Chọn hình", match: "Ghép cặp",
          order: "Sắp xếp", wordbuild: "Ghép chữ",
          typein: "Gõ đáp án", odd: "Khác loại", multi: "Chọn tất cả", compare: "So sánh", count: "Đếm", pop: "Bắn bong bóng", memory: "Lật thẻ",
              numline: "Trục số", clock: "Đồng hồ", find:
          "Tìm trong tranh", dragfill: "Kéo vào chỗ trống", sort: "Phân loại" },
      en: { trace: "Trace", dictate: "Dictation", write: "Write", speak: "Read aloud", tf: "True or false?", pic: "Pick the picture", match: "Match",
          order: "Put in order", wordbuild:
          "Build the word", typein: "Type the answer", odd: "Odd one out", multi: "Pick all", compare: "Compare", count: "Count", pop:
              "Pop the balloon", memory: "Memory", numline:
          "Number line", clock: "Clock", find: "Find it", dragfill: "Drag to the gap", sort: "Sort" }
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
    var CAT = { animal: { vi: "con vật", en: "animals" }, fruit: { vi: "trái cây", en: "fruits" }, vehicle: { vi: "phương tiện", en: "vehicles" },
        nature: { vi: "vật sáng trên trời", en:
        "shining things in the sky" }, school: { vi: "đồ dùng học tập", en: "school things" } };
    var SENT = {
      vi: [["Em", "đi", "học"], ["Mẹ", "nấu", "cơm"], ["Bé", "chơi", "bóng"], ["Em", "yêu", "mẹ"], ["Bố", "đọc", "sách", "cho", "bé"], ["Trời", "hôm",
          "nay", "rất", "đẹp"], ["Bé", "tưới",
          "cây", "mỗi", "sáng"], ["Con", "mèo", "ngủ", "trên", "ghế"]],
      en: [["I", "like", "apples"], ["I", "have", "a", "dog"], ["She", "reads", "a", "book"], ["The", "cat", "is", "small"], ["We", "go", "to",
          "school"], ["He", "can", "run", "fast"],
          ["It", "is", "a", "sunny", "day"], ["My", "mom", "is", "kind"]]
    };

    function name(v, subj) { return subj === "tanh" ? v.en : v.vi; }     /* tên theo MÔN: Tiếng Anh dùng từ Anh, còn lại dùng từ Việt */
    function word(v, subj) { return subj === "tanh" ? v.en : v.w; }
    function others(v, n, same) { return shuf(V.filter(function (x) { return x !== v && (same ? x.c === v.c : true); })).slice(0, n); }
    function optList(texts, okIdx) { return texts.map(function (t, i) { return i === okIdx ? { v: t, ok: 1 } : { v: t }; }); }
    /* kiểu câu Toán → kỹ năng theo dõi (engine.js TRACKED); các kiểu khác để skill:null */
    var KSKILL = { count: "count_obj", numline: "number_line", compare: "compare_num", order: "order_num", clock: "clock_read" };
    var KSKILL_L = { tviet: { order: "sent_order", wordbuild: "word_build", dictate: "dictate_vi", write: "write_vi", speak: "speak_vi", trace:
        "trace_vi" }, tanh: { order: "sent_order_en",
        wordbuild: "word_build_en", dictate: "dictate_en", write: "write_en", speak: "speak_en" } };
    function base(kind, subj, grade, lang, q, extra) {
      var o = { kind: kind, type: kind, lang: lang, q: q, lab: LAB[lang][kind], subj: subj, grade: grade, skill: (subj === "toan" ? KSKILL[kind] :
          KSKILL_L[subj] && KSKILL_L[subj][kind]) ||
          null, ui: UI[lang] };
      for (var k in extra) o[k] = extra[k]; return o;
    }

    /* ---- số học theo lớp ---- */
    function arith(g) {
      var ops = g <= 2 ? ["+", "−"] : g === 3 ? ["+", "−", "×"] : ["+", "−", "×", "÷"], op = pick(ops), a, b, res;
      if (op === "+" || op === "−") {
        var A, B;
        if (g === 1) { A = rnd(1, 15); B = rnd(1, 20 - A); } else if (g === 2) { A = rnd(10, 80); B = rnd(5, 99 - A); } else if (g === 3) { A = rnd(
            300, 4000); B = rnd(100, 9999 - A);
            } else if (g === 4) { A = rnd(1000, 6000); B = rnd(500, 9999 - A); } else { A = rnd(10000, 60000); B = rnd(1000, 99999 - A); }
        if (op === "+") { a = A; b = B; res = A + B; } else { a = A + B; b = B; res = A; }
      } else if (op === "×") {
        a = g === 3 ? rnd(11, 60) : g === 4 ? rnd(11, 99) : rnd(101, 500); b = rnd(2, 9); res = a * b;
      } else { b = rnd(2, 9); res = g === 3 ? rnd(12, 99) : g === 4 ? rnd(11, 99) : rnd(101, 400); a = b * res; }
      return { a: a, b: b, op: op, res: res, txt: a + " " + op + " " + b };
    }
    /* phép tính cho ghép cặp / lật thẻ: phải tính CẢ 4 phép cùng lúc nên dùng số nhỏ (cộng trừ hai chữ số, bảng nhân), không dùng số ba chữ số */
    function arithPair(g) { if (g <= 2) return arith(g); if (R() < .5) return arith(2); for (var i = 0; i < 30; i++) { var x = arith(3); if (
        x.op === "×") return x; } return arith(2); }
    var RANGE = [[1, 20], [10, 99], [100, 999], [1000, 9999], [10000, 99999]];
    function distinctNums(n, lo, hi) { var s = {}, out = []; var tries = 0; while (out.length < n && tries++ < 200) { var x = rnd(lo, hi); if (
        !s[x]) { s[x] = 1; out.push(x); } } return out; }

    TP.R = R; TP.rnd = rnd; TP.pick = pick; TP.shuf = shuf; TP.nfc = nfc; TP.LAB = LAB; TP.UI = UI; TP.V = V; TP.CAT = CAT; TP.SENT = SENT;
    TP.name = name; TP.word = word; TP.others = others; TP.optList = optList; TP.base = base; TP.arith = arith; TP.arithPair = arithPair;
    TP.RANGE = RANGE; TP.distinctNums = distinctNums;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnTypesParts = root.LearnTypesParts || {})["core"] = part;
})(typeof window !== "undefined" ? window : globalThis);
