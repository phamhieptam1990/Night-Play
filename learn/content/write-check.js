/* Chấm "Viết câu" theo NỘI DUNG bằng luật cục bộ (không AI, không dịch vụ ngoài). Dữ liệu: write-topics.js.
   Đạt khi: câu có ít nhất 1 từ khoá riêng của chủ đề (hoặc >= 2 từ khoá chung), và không phải chuỗi từ lặp / chỉ toàn danh từ khi chắc chắn.
   Nguyên tắc: không chắc thì KHÔNG bắt lỗi. So khớp không phân biệt hoa thường, có dấu hay không dấu. */
(function (root) {
  "use strict";
  var TOP = root.WriteTopics || (typeof require !== "undefined" ? (function () { try { return require("./write-topics.js"); } catch (e) { return null; } })() : null);
  function strip(s) { s = String(s || "").toLowerCase(); s = s.normalize ? s.normalize("NFD").replace(/[̀-ͯ]/g, "") : s; return s.replace(/đ/g,
      "d").replace(/[^a-z0-9]+/g, " ").trim(); }
  var cache = {};
  function build(lang) {
    if (cache[lang]) return cache[lang];
    var rows = (TOP && TOP[lang]) || [], freq = {}, by = {};
    rows.forEach(function (r) { r[2].split(",").forEach(function (k) { k = strip(k); if (k && !(by[r[1]] = by[r[1]] || {})[k]) { by[r[1]][k] = 1;
        freq[k] = (freq[k] || 0) + 1; } }); });
    var res = { rows: rows, by: by, freq: freq }; cache[lang] = res; return res;
  }
  function find(lang, name) { var B = build(lang); for (var i = 0; i < B.rows.length; i++) if (B.rows[i][1] === name) return B.rows[i]; return null; }
  function topicsFor(lang, g) { return build(lang).rows.filter(function (r) { return r[0] <= g && r[0] >= g - 1; }); }
  /* từ gợi ý: từ khoá riêng của chủ đề (không chung với chủ đề khác), 1 từ, đứng đầu danh sách */
  function hintWords(lang, name, n) {
    var B = build(lang), r = find(lang, name), out = [];
    if (!r) return out;
    var nm = name.split(" ").map(strip);
    r[2].split(",").forEach(function (k) { k = k.trim(); if (out.length < n && k.length > 1 && k.indexOf(" ") < 0 && nm.indexOf(strip(k)) < 0 &&
        B.freq[strip(k)] < 3) out.push(k); });
    return out;
  }
  /* từ chức năng/đại từ: không tính là "từ lạ" khi phát hiện câu chỉ toàn danh từ */
  var FUNC = { vi: " em con cai cac nhung mot cua toi minh chung ta nay do kia cho ", en: " my the a an and of our his her their i you it we they your " };
  /* động từ / tính từ / từ nối phổ biến (mức heuristic): có một từ trong này nghĩa là có vị ngữ */
  var PRED = {
    vi: " la co thi rat dang se da va o yeu thuong thich hay dep ngon vui buon to nho lon cao thap nam ngu an uong choi chay di ve den tu doc viet hoc day lam " +
      "nau giup nho nghe noi hat mua ban cam lay dua dat ngoi dung bay nhay keu ban troi nong lanh mat am xanh do vang tim ky dai ngan nhanh cham gioi ngoan " +
      "chan ham hien tot xau moi cu thom ngot chua man cuoi khoc cho ra vao len xuong tang an can can bao gom nhin thay biet muon mong uoc quan tam giu dung " +
      "nhat trong tuoi bao ve gap goi dung nhu ",
    en: " is are am was were be been have has had like likes love loves go goes went play plays eat eats sleep sleeps can do does did see sees live lives read " +
      "reads write writes want wants need needs make makes help helps run runs walk walks jump jumps sing sings visit visited enjoy enjoyed look looks feel " +
      "feels get gets take takes come comes ride rides cook cooks study studies learn learns draw draws swim swims there not very big small happy kind nice " +
      "good funny cute tall short hot cold  "
  };
  var STOP = " mot ngay quanh con cua niem vui nguoi my the like favourite last ";
  function has(set, w) { return set.indexOf(" " + w + " ") >= 0; }
  function matchKw(toks, text, kw, lang) {
    if (lang === "en") {
      return new RegExp(" " + kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(s|es|ed|d|ing)? ").test(text) ||
        (/e$/.test(kw) && text.indexOf(" " + kw.slice(0, -1) + "ing ") >= 0) ||
        (/y$/.test(kw) && text.indexOf(" " + kw.slice(0, -1) + "ies ") >= 0);
    }
    return text.indexOf(" " + kw + " ") >= 0;
  }
  function tip(vi, name, words, why) {
    var w = words.slice(0, 3), s;
    while (w.length) { s = (vi ? why + " Thử dùng từ: " : why + " Try: ") + w.join(", ") + "…"; if (s.length <= 90) return s; w.pop(); }
    return why;
  }
  /* trả { ok, tip }. Chỉ gọi sau khi các tiêu chí hình thức đã đạt. spec: { min, topic } */
  function check(raw, spec, lang, uiLang) {
    var tv = uiLang ? uiLang !== "en" : lang !== "en", vi = lang !== "en", r = spec && spec.topic ? find(vi ? "vi" : "en", String(spec.topic)) : null;
    if (!r) return { ok: true, tip: "" };
    var lg = vi ? "vi" : "en", B = build(lg), set = B.by[r[1]], toks = strip(raw).split(" ").filter(Boolean), text = " " + toks.join(" ") + " ";
    var uniq = toks.filter(function (w, i) { return toks.indexOf(w) === i; }).length, min = spec.min || 3;
    var spec1 = 0, gen = 0, k;
    for (k in set) if (matchKw(toks, text, k, lg)) { if (B.freq[k] >= 3) gen++; else spec1++; }
    strip(r[1]).split(" ").forEach(function (w) { if (w.length > 2 && !has(STOP, w) && matchKw(toks, text, w, lg)) spec1++; });
    var hints = hintWords(lg, r[1], 3);
    if (spec1 < 1 && gen < 2) return { ok: false, tip: tip(tv, r[1], hints, tv ? "Câu chưa nói về chủ đề." : "Stay on the topic.") };
    if (uniq < Math.max(3, Math.ceil(min / 2) + 1) && toks.length >= 3) {
      return { ok: false, tip: tv ? "Hãy viết một câu có nhiều từ khác nhau, đừng lặp lại một từ." : "Use different words, not the same word again." };
    }
    var allTopic = toks.every(function (w) {
      return has(FUNC[lg], w) || set[w] || (lg === "en" && Object.keys(set).some(function (kk) { return matchKw([w], " " + w + " ", kk, lg); }));
    });
    var anyPred = toks.some(function (w) { return has(PRED[lg], w); });
    if (allTopic && !anyPred && toks.length >= 3) return { ok: false, tip: tv ? "Thêm việc làm hoặc đặc điểm nhé: nó làm gì, trông thế nào?" :
        "Add what it does or what it is like." };
    return { ok: true, tip: "" };
  }
  var out = { check: check, topicsFor: topicsFor, hintWords: hintWords, strip: strip };
  root.WriteCheck = out;
  if (typeof module !== "undefined" && module.exports) module.exports = out;
})(typeof window !== "undefined" ? window : globalThis);
