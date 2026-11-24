/* Kỹ năng Tiếng Việt + Tiếng Anh — bộ sinh câu Tiếng Việt.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var G = L.G, pk = L.pk, fin = L.fin, vi = L.vi, em = L.em, W = L.W, shuf = L.shuf, nfc = L.nfc, rnd = L.rnd, applyTone = L.applyTone;
    var D = L.D;
    /* ---- Tiếng Việt ---- */
    G.letter_start = function (cc) {
      var it = pk(D.letterStart), wr = D.letters.filter(function (l) { return l !== it[2]; });
      return fin(vi(cc) ? it[0] + " " + em(it[1]) + " bắt đầu bằng chữ gì?" : it[0] + " " + em(it[1]) + " starts with which letter?", it[2], W(shuf(
          wr).slice(0, 8), "spelling"));
    };
    G.syllable_blend = function (cc) {
      var cons = Object.keys(D.vowelsOf), k = pk(cons), vs = D.vowelsOf[k].split(" "), v = pk(vs), ans = nfc(k + v);
      if (cc.grade >= 2 || rnd(0, 1)) {
        var tn = pk(D.tones), tn2 = D.tones.filter(function (x) { return x !== tn; }), ans2 = applyTone(ans, tn[1]);
        return fin(vi(cc) ? em(ans) + " thêm " + em(tn[0]) + " thành tiếng nào?" : em(ans) + " + " + em(tn[0]) + " = ?", ans2, tn2.map(function (x) {
            return [applyTone(ans, x[1]), "tone"]; }));
      }
      var wr = [[nfc(v + k), "spelling"]], v2 = vs.filter(function (x) { return x !== v; }), k2 = cons.filter(function (x) { return x !== k &&
          D.vowelsOf[x].split(" ").indexOf(v) >= 0; });
      if (v2.length) wr.push([nfc(k + pk(v2)), "spelling"]); if (k2.length) wr.push([nfc(pk(k2) + v), "spelling"]); wr.push([nfc(pk(cons) + pk(
          v2.length ? v2 : vs)), "spelling"], [nfc(k +
          pk(v2.length ? v2 : vs)), "spelling"]);
      return fin(em(k) + " + " + em(v) + " = <em>?</em>", ans, wr);
    };
    G.spell_ngh = function (cc) {
      var it = pk(D.nghItems), ans = it[0], pair = { ng: "ngh", ngh: "ng", g: "gh", gh: "g", c: "k", k: "c" }[ans], others = { ng: ["g", "gh"], ngh:
          ["g", "gh"], g: ["ng", "ngh"], gh: ["ng",
          "ngh"], c: ["ng", "ch"], k: ["ng", "ch"] }[ans];
      return fin((vi(cc) ? "Điền chữ còn thiếu: " : "Fill in the missing letters: ") + "<br>" + em(it[2]), ans, W([pair].concat(others), "spelling"));
    };
    G.spell_init = function (cc) {
      var gs = cc.grade <= 2 ? ["sx"] : cc.grade === 3 ? ["sx", "dgr"] : cc.grade === 4 ? ["dgr", "ln"] : ["sx", "dgr", "ln"], gk = pk(gs),
          grp = D.initWords[gk], keys = Object.keys(
          grp).filter(function (x) { return x !== "extra"; }), ans = pk(keys), it = pk(grp[ans]);
      var wr = keys.filter(function (x) { return x !== ans; }).concat(grp.extra);
      return fin((vi(cc) ? "Điền chữ còn thiếu: " : "Fill in the missing letters: ") + it[0] + " " + em("__" + it[1].slice(ans.length)), ans, W(wr, "spelling"));
    };
    G.word_class = function (cc) {
      var cls = pk([["things", "sự vật", "danh từ", "noun"], ["actions", "hoạt động", "động từ", "verb"], ["traits", "đặc điểm", "tính từ",
          "adjective"]]), term = cc.grade >= 4 ? cls[2] :
          "từ chỉ " + cls[1], wr = [];
      ["things", "actions", "traits"].forEach(function (x) { if (x !== cls[0]) wr = wr.concat(D[x]); });
      return fin((vi(cc) ? "Từ nào là " : "Which word is a ") + em(vi(cc) ? term : cls[3]) + "?", pk(D[cls[0]]), W(wr, "word_class"));
    };
    G.punct = function (cc) {
      var dots = [".", ",", "?", "!"];
      if (cc.grade >= 3 && rnd(0, 2) === 0) { var ci = pk(D.commaItems); return fin((vi(cc) ? "Điền dấu câu: " : "Fill in the punctuation: ") + em(
          ci[0] + " __ " + ci[1] + "."), ",", W([".",
          "?", "!"], "punct")); }
      var s = pk(D.sentences), ans = { k: ".", h: "?", c: "!", y: "." }[s[1]];
      /* câu khiến: "." và "!" đều chấp nhận được → không đưa "!" vào lựa chọn (chỉ có MỘT dấu hợp lý) */
      return fin((vi(cc) ? "Điền dấu cuối câu: " : "Fill in the end mark: ") + em(s[0] + " __"), ans, W((s[1] === "y" ? [",", "?", ":"] :
          dots).filter(function (x) { return x !== ans; }), "punct"));
    };
    G.sent_type = function (cc) {
      var s = pk(D.sentences), names = { k: "câu kể", h: "câu hỏi", c: "câu cảm", y: "câu khiến" }, en = { k: "statement", h: "question", c:
          "exclamation", y: "command" }, end = { k: ".", h:
          "?", c: "!", y: "." }[s[1]];
      if (s[1] === "y" && /^Đừng|nào$/.test(s[0])) end = "!";
      var wr = Object.keys(names).filter(function (x) { return x !== s[1]; }).map(function (x) { return [vi(cc) ? names[x] : en[x], "sent_type"]; });
      return fin((vi(cc) ? "Câu " : "The sentence ") + em("“" + s[0] + end + "”") + (vi(cc) ? " thuộc kiểu câu nào?" : " is a…?"), vi(cc) ? names[s[1]] : en[s[1]], wr);
    };
    G.synonym = function () {
      var it = pk(D.synonyms), wr = it.d.slice();
      return fin("Từ nào " + em("đồng nghĩa") + " với " + em(it.w) + "?", pk(it.s), W(wr, "meaning"));
    };
    G.antonym_pair = function () {
      var p = pk(D.antonyms), flip = rnd(0, 1), w = flip ? p[1] : p[0], ans = flip ? p[0] : p[1], wr = [];
      D.antonyms.forEach(function (x) { if (x[2] !== p[2]) { wr.push(x[0], x[1]); } });
      return fin("Từ nào " + em("trái nghĩa") + " với " + em(w) + "?", ans, W(wr, "meaning"));
    };
    G.idiom = function () {
      var it = pk(D.idioms), wr = D.idioms.filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin("Điền từ còn thiếu: " + em(it[0] + " __"), it[1], W(wr, "meaning"));
    };
    G.greeting_vi = function () {
      var it = pk(D.manners);
      return fin(it[0], it[1], W(it[2], "other"));
    };
    G.reading_story = function (cc) {
      var pool = D.readVi.filter(function (x) { return x.g.indexOf(cc.grade) >= 0; }), it = pk(pool);
      return fin(it.t + "<br>" + em(it.q), it.a, W(it.d, "reading"));
    };

    G.story_lit = function (cc) {
      var pool = D.stories.filter(function (x) { return x.g.indexOf(cc.grade) >= 0; }), it = pk(pool);
      return fin(it.t + "<br>" + em(it.q), it.a, W(it.d, "reading"));
    };
    G.para_order = function (cc) {
      var para = pk(D.paragraphs), n = cc.grade <= 3 ? 3 : 4, sents = para.slice(0, n), L = "ABCD".slice(0, n).split(""), idx, perm, tries = 0;
      do { idx = shuf(sents.map(function (x, i) { return i; })); tries++; } while (idx.every(function (v, i) { return v === i; }) && tries < 30);
      var shown = idx.map(function (i) { return sents[i]; }), label = function (orig) { return L[idx.indexOf(orig)]; };   /* nhãn của câu đứng thứ orig trong đoạn đúng */
      var rightOrder = sents.map(function (x, i) { return label(i); }).join(" – "), wr = [];
      for (var k = 0; k < 40 && wr.length < 5; k++) { var pm = shuf(L.slice()).join(" – "); if (pm !== rightOrder && wr.indexOf(pm) < 0) wr.push(pm); }
      return fin(shown.map(function (x, i) { return L[i] + ". " + x; }).join("<br>") + "<br>" + em(vi(cc) ? "Sắp xếp thành đoạn văn đúng:" :
          "Put them in the right order:"), rightOrder, W(wr, "reading"));
    };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["gen-vi"] = part;
})(typeof window !== "undefined" ? window : globalThis);
