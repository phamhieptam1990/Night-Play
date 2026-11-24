/* Kiểu câu hỏi — kiểu nghe–viết, viết câu, đọc to, tô chữ (Tiếng Việt, Tiếng Anh).
   Một phần của learn/content/qtypes.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung TP. */
(function (root) {
  "use strict";
  function part(TP) {
    var G = TP.G, base = TP.base, nfc = TP.nfc, pick = TP.pick;

    /* ====== NGHE–VIẾT, VIẾT CÂU, ĐỌC TO (Tiếng Việt, Tiếng Anh) ====== */
    var LD = (function () { try { if (root.LearnLangSkills && root.LearnLangSkills.DATA) return root.LearnLangSkills.DATA; if (
        typeof require !== "undefined") return require(
        "../../lang-skills.js").DATA; } catch (e) {} return null; })();
    var LBTN = '<button type="button" class="lsn" aria-label="🔊">🔊</button>';
    /* nghe–viết: bé nghe từ rồi gõ lại. Tiếng Việt lớp 1–3 (từ ngắn, có hình), Tiếng Anh lớp 2–5 (từ một chữ, có hình ở lớp thấp) */
    G.dictate = function (subj, g, lang) {
      if (subj === "toan" || !LD) return null; var it, pool = [];
      if (subj === "tviet") { if (g > 2) return null; pool = LD.letterStart.filter(function (x) { return x[1].indexOf(" ") < 0 && Array.from(x[1]).length <= 5; }); }
      else { if (g < 2) return null; Object.keys(LD.themes).forEach(function (k) { LD.themes[k].forEach(function (x) { if (x[1].indexOf(" ") < 0 &&
          x[1].length <= 8 && (g < 4 ||
          x[1].length >= 5)) pool.push(x); }); }); }
      it = pick(pool); var w = nfc(it[1].toLowerCase());
      return base("dictate", subj, g, lang, (lang === "vi" ? "Nghe rồi viết lại từ" : "Listen and write the word") + "<br>" + (g <= 2 ?
          "<span class='dpic'>" + it[0] + "</span><br>" : "") +
          LBTN, { ans: w, accept: [w], speak: it[1], speakLang: subj === "tanh" ? "en" : "vi", listen: 1, reveal: it[1] });
    };
    /* viết câu: chấm theo TIÊU CHÍ HÌNH THỨC (đủ số từ, chữ đầu viết hoa, có dấu kết thúc); không chấm nội dung vì không có AI lúc chạy */
    var WTOP = { tviet: ["mẹ", "trường học", "con mèo", "bạn thân", "ngôi nhà", "buổi sáng", "quê hương", "mùa hè"], tanh: ["my family", "my school",
        "my pet", "my friend", "my room"] };
    function checkWrite(text, spec, lang) {
      var t = String(text || "").replace(/\s+/g, " ").trim(), words = t ? t.split(" ").length : 0, vi = lang !== "en", first = Array.from(t)[0] || "",
          min = spec && spec.min ? spec.min : 3;
      if (words < min) return { ok: false, tip: vi ? "Viết thêm cho đủ ý: câu cần ít nhất " + min + " từ." : "Write a bit more: at least " + min + " words." };
      if (!first || first === first.toLowerCase()) return { ok: false, tip: vi ? "Chữ đầu câu phải viết hoa nhé." : "Start the sentence with a capital letter." };
      if (!/[.?!…]$/.test(t)) return { ok: false, tip: vi ? "Cuối câu nhớ đặt dấu chấm (.) nhé." : "End the sentence with a full stop (.)." };
      if (/\d/.test(t)) return { ok: false, tip: vi ? "Viết bằng chữ, không dùng chữ số nhé." : "Write with words, not digits." };
      var WC = root.WriteCheck || (typeof require !== "undefined" ? (function () { try { return require("../write-check.js"); } catch (e) { return null; } })() : null);
      if (WC && spec && spec.topic) return WC.check(t, spec, spec.subj === "tanh" ? "en" : "vi", lang);
      return { ok: true, tip: "" };
    }
    G.write = function (subj, g, lang) {
      if (subj === "toan" || (subj === "tviet" && g < 2) || (subj === "tanh" && g < 3)) return null;
      var WC = root.WriteCheck || (typeof require !== "undefined" ? (function () { try { return require("../write-check.js"); } catch (e) {
          return null; } })() : null), tp = WC ?
          WC.topicsFor(subj === "tviet" ? "vi" : "en", g) : [];
      var topic = tp.length ? pick(tp)[1] : pick(WTOP[subj]), min = subj === "tviet" ? [0, 0, 3, 4, 5, 6][g] : [0, 0, 0, 3, 4, 5][g];
      return base("write", subj, g, lang, (subj === "tviet" ? "Viết một câu về <em>" + topic + "</em>" : "Write a sentence about <em>" + topic +
          "</em>") + "<br><small>" + (lang === "vi" ?
          "Chữ đầu viết hoa, cuối câu có dấu chấm" : "Capital letter first, full stop at the end") + "</small>", { min: min, topic: topic, speak: (
              subj === "tviet" ? "Viết một câu về " :
          "Write a sentence about ") + topic });
    };
    /* đọc to: bé đọc thành tiếng theo mẫu rồi tự báo đã đọc (không có nhận dạng giọng nói) */
    var SAY = { tviet: [["Em chào cô ạ.", 1], ["Em yêu mẹ của em.", 1], ["Con mèo nằm trên ghế.", 2], ["Hôm nay trời đẹp quá!", 2], ["Mẹ nấu cơm rất ngon.", 2],
        ["Mùa thu, bầu trời trong xanh và gió se lạnh.", 4], ["Em cố gắng học tập để trở thành người có ích.", 5]],
      tanh: [["Hello, my name is Nam.", 1], ["I like apples.", 1], ["This is my school.", 2], ["I have a red bag.", 2], ["Nice to meet you.", 1],
          ["She plays football every day.", 4],
          ["On Sunday, we play in the park.", 5]] };
    G.speak = function (subj, g, lang) {
      if (subj === "toan") return null; var pool = SAY[subj].filter(function (x) { return x[1] <= g; }); if (!pool.length) return null; var it = pick(pool);
      return base("speak", subj, g, lang, (lang === "vi" ? "Đọc to câu này:" : "Read this aloud:") + "<br><em>" + it[0] + "</em><br>" + LBTN, { speak:
          it[0], speakLang: subj === "tanh" ?
          "en" : "vi", listen: 1 });
    };

    /* tô chữ (lớp 1): bé dùng ngón tay tô theo chữ cái mờ trên canvas; chấm theo độ phủ nét chữ và nét lem ra ngoài (qui.js) */
    var TRACE = ["o", "c", "l", "i", "t", "a", "e", "u", "n", "m", "v", "x", "h", "b", "d", "g"];
    G.trace = function (subj, g, lang) {
      if (subj !== "tviet" || g > 1) return null; var ch = pick(TRACE);
      return base("trace", subj, g, lang, (lang === "vi" ? "Tô theo chữ cái" : "Trace the letter") + " <em>" + ch + "</em>", { ch: ch, speak: (
          lang === "vi" ? "Tô theo chữ cái " : "Trace the letter ") + ch });
    };

    TP.LD = LD; TP.checkWrite = checkWrite;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnTypesParts = root.LearnTypesParts || {})["gen-lang"] = part;
})(typeof window !== "undefined" ? window : globalThis);
