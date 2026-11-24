/* 10 KIỂU CÂU HỎI cho trang học (thuần dữ liệu, không chạm DOM; chạy được trong trình duyệt và Node để kiểm thử).
   Kiểu: mc (chọn 1/4, do engine.js sinh) · tf (đúng/sai) · pic (chọn hình) · match (ghép cặp) · order (sắp xếp)
         · wordbuild (ghép chữ) · typein (gõ số) · odd (tìm cái khác loại) · multi (chọn nhiều) · compare (so sánh).
   Mỗi câu: { kind, q, lab, speak, subj, grade, skill:null, ...dữ liệu theo kiểu }.
   Câu thuộc kiểu mới chưa gắn kỹ năng (skill:null) nên KHÔNG ghi vào tiến độ kỹ năng của engine; giao diện vẫn tính sao/chuỗi như thường.
   Giao diện vẽ ở learn/qui.js (match/order/wordbuild/typein/multi) và index.html (tf/pic/odd/compare dùng lại nút 4 đáp án).
   Kiểm thử: node scripts/learn/check-types.js
   Cấu trúc: learn/content/qtypes/*.js là các phần (core, gen-basic, gen-lang, gen-more); tệp này NỐI chúng rồi giữ API LearnTypes.
   Trình duyệt: mỗi phần nạp bằng một thẻ <script> TRƯỚC qtypes.js (LearnTypesParts); Node: tự require. */
(function (root) {
  "use strict";
  var parts = root.LearnTypesParts || {}, TP = {};
  ["core", "gen-basic", "gen-lang", "gen-more"].forEach(function (n) {
    var part = parts[n] || (typeof require !== "undefined" ? require("./qtypes/" + n + ".js") : null);
    if (!part) throw new Error("Thiếu phần qtypes/" + n + ".js");
    part(TP);
  });
  var LAB = TP.LAB, G = TP.G, base = TP.base, optList = TP.optList, pick = TP.pick, rnd = TP.rnd, shuf = TP.shuf, R = TP.R, UI = TP.UI, LD = TP.LD;
  var V = TP.V, checkWrite = TP.checkWrite;
  /* bắn bong bóng: dùng lại một câu chọn 1/4 bất kỳ (giữ nguyên kỹ năng) nhưng đáp án là bong bóng bay lên */
  function asPop(q, lang) { if (!q || !q.o || (q.kind && q.kind !== "mc") || q.o.length !== 4) return null; var c = {}; for (var k in q) c[k] = q[k];
      c.kind = "pop"; c.baseKind = q.kind ||
      "mc"; c.lab = LAB[lang === "en" ? "en" : "vi"].pop; return c; }

  var HIM = root.LearnTypesHi || (typeof require !== "undefined" ? (function () { try { return require("./qtypes-hi.js"); } catch (e) { return null; } })() : null);
  if (HIM) HIM({ G: G, base: base, optList: optList, pick: pick, rnd: rnd, shuf: shuf, R: R, UI: UI, LD: LD });   /* kiểu chung theo lớp: learn/content/qtypes-hi.js */

  var KINDS = { toan: ["tf", "pic", "match", "order", "typein", "odd", "multi", "compare", "count", "memory", "numline", "clock", "find", "dragfill",
      "sort"], tviet: ["tf", "pic", "match",
      "order", "wordbuild", "odd", "multi", "memory", "find", "dragfill", "sort", "dictate", "write", "speak", "trace"], tanh: ["tf", "pic", "match",
          "order", "wordbuild", "odd", "multi",
      "memory", "find", "dragfill", "sort", "dictate", "write", "speak"] };
  function kindsFor(subj, grade) { return (KINDS[subj] || []).filter(function (k) { if (subj !== "toan" && grade >= 3 && (k === "pic" ||
      k === "wordbuild" || k === "find")) return false;
      if (k === "speak") return subj === "toan" ? false : (subj === "tviet" ? grade <= 2 : grade <= 3);  if (k === "trace") return subj === "tviet" && grade === 1; if (
      k === "dictate") return subj === "tviet" ? grade <= 2 : grade >= 2; if (k === "write") return subj === "tviet" ? grade >= 2 : grade >= 3;
          return true; }).filter(function (k) {
      return !(subj === "toan" && ((k === "pic" && grade > 2) || (k === "count" && grade > 2) || (k === "clock" && grade > 3) || (k === "memory" && grade > 3))); }); }
  function make(kind, subj, grade, lang) { grade = Math.min(5, Math.max(1, grade | 0 || 1)); lang = lang === "en" ? "en" : "vi"; var f = G[kind];
      return f ? f(subj, grade, lang) : null; }
  /* câu chọn 1/4 có đáp án là SỐ NGUYÊN (có thể kèm đơn vị) → câu cho bé GÕ số.
     Giữ kỹ năng, chủ đề, mã lỗi của từng đáp án nhiễu (gõ trúng đáp án nhiễu nào thì ghi mã lỗi đó). */
  function asTypein(q, lang) {
    if (!q || q.kind || !q.o || q.o.length !== 4 || !q.skill) return null;
    var fr = /^(\d{1,3} )?\d{1,4}\/\d{1,4}$/, isFr = q.o.every(function (x) { return fr.test(x.v); });
    if (isFr) {   /* đáp án là phân số (hoặc hỗn số): bé gõ "3/4" / "1 1/2"; phím "/" và phím cách do qui.js hiện khi frac:true */
      var fv = function (t) { var m = /^(?:(\d+) )?(\d+)\/(\d+)$/.exec(t); return (Number(m[1] || 0) * Number(m[3]) + Number(m[2])) / Number(m[3]); },
          fok = null, ftags = {}, feq = false, j;
      for (j = 0; j < 4; j++) { if (q.o[j].ok) fok = q.o[j].v; }
      if (fok === null) return null;
      for (j = 0; j < 4; j++) if (!q.o[j].ok) { ftags[q.o[j].v] = q.o[j].tag || "other"; if (Math.abs(fv(q.o[j].v) - fv(fok)) < 1e-9) feq = true; }
      var fplain = String(q.q).replace(/<br>/g, ". ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return { kind: "typein", type: "typein", q: q.q, lab: LAB[lang].typein, subj: q.subj, grade: q.grade, skill: q.skill, topic: q.topic, diff:
          q.diff, id: q.id, hint: q.hint, ui:
          UI[lang], ans: fok, show: fok, dec: false, frac: true, exact: feq || /rút gọn|tối giản|simplif/i.test(fplain), sep: lang === "vi" ? "," :
              ".", unit: null, tags: ftags, speak:
          fplain, reveal: fok };
    }
    var re = /^(\d{1,6}(?:[.,]\d{1,3})?)(?: (\S+))?$/, ok = null, show = "", tags = {}, unit = null, dec = false, i, m, key;
    for (i = 0; i < 4; i++) { m = re.exec(q.o[i].v); if (!m) return null; if (unit === null) unit = m[2] || ""; else if ((m[2] ||
        "") !== unit) return null; key = String(Number(m[1].replace(
        ",", "."))); if (/[.,]/.test(m[1])) dec = true; if (q.o[i].ok) { ok = key; show = m[1]; } else tags[key] = q.o[i].tag || "other"; }
    if (ok === null) return null;
    var plain = String(q.q).replace(/<br>/g, ". ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return { kind: "typein", type: "typein", q: q.q, lab: LAB[lang].typein, subj: q.subj, grade: q.grade, skill: q.skill, topic: q.topic, diff:
        q.diff, id: q.id, hint: q.hint, ui: UI[lang],
        ans: ok, show: show, dec: dec, sep: lang === "vi" ? "," : ".", unit: unit, tags: tags, speak: plain, reveal: show + (unit ? " " + unit : "") };
  }
  /* trộn kiểu mới vào một vòng: giữ câu đầu là chọn 1/4 (khởi động), thay n câu sau bằng các kiểu KHÁC NHAU */
  function mix(round, subj, grade, lang, n) {
    if (subj === "toan" && grade >= 3) n = Math.min(n == null ? 3 : n, 2);   /* Toán lớp 3+: tối đa 2 câu kiểu chung (còn lại là kỹ năng theo chương trình) */
    var ks = shuf(kindsFor(subj, grade)), pos = shuf([1, 2, 3, 4].filter(function (i) { return i < round.length; })), out = round.slice(), done = 0;
    for (var i = 0; i < ks.length && done < (n == null ? 3 : n) && done < pos.length; i++) { var q = make(ks[i], subj, grade, lang); if (q) {
        out[pos[done]] = q; done++; } }
    /* từ lớp 2: câu chọn 1/4 có đáp án số nguyên, ~40% cho bé tự GÕ số (câu 1 giữ chọn 1/4 làm khởi động) */
    if (subj === "toan" && grade >= 2) for (var t = 1; t < out.length; t++) if (R() < .4) { var tq = asTypein(out[t], lang); if (tq) out[t] = tq; }
    /* một câu chọn 1/4 còn lại (nếu có) đổi sang dạng bong bóng, vẫn giữ kỹ năng và mã lỗi; lớp 5 bỏ (bé lớn thấy như trò lớp 1) */
    if (grade < 5 && R() < .7) { var rest = pos.slice(done);
    for (var j = 0; j < rest.length; j++) { var pq = asPop(out[rest[j]], lang); if (pq) { out[rest[j]] = pq; break; } } }
    return out;
  }
  /* tên đồ vật theo emoji (cho giọng đọc): "🍇" -> "chùm nho" / "grapes" */
  function nameOf(e, lang) { e = String(e).replace(/\uFE0F/g, ""); for (var i = 0; i < V.length; i++) { if (V[i].e.replace(/\uFE0F/g,
      "") === e) return lang === "vi" ? V[i].vi : V[i].en; } return ""; }
  root.LearnTypes = { nameOf: nameOf, checkWrite: checkWrite, asTypein: asTypein, asPop: asPop, make: make, mix: mix, kindsFor: kindsFor, KINDS: KINDS, LAB: LAB };
  if (typeof module !== "undefined" && module.exports) module.exports = root.LearnTypes;
})(typeof window !== "undefined" ? window : globalThis);
