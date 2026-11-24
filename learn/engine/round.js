/* Bộ máy học — Chọn kỹ năng cho vòng (planRound), kỹ năng yếu, chống lặp, round().
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var R = EP.R, SK = EP.SK, level = EP.level, load = EP.load, make = EP.make, rnd = EP.rnd, save = EP.save, topicOf = EP.topicOf;

    /* ---- chọn kỹ năng cho một vòng ---- */
    var W = { not_started: 2, emerging: 3, developing: 2, proficient: .8, advanced: .25 };
    function candidates(subj, grade) {
      var out = [];
      Object.keys(SK).forEach(function (id) { var k = SK[id]; if (k.subj !== subj) return; if (k.grades.indexOf(grade) >= 0) out.push({ id: id,
          review: false }); else if (grade > 1 &&
          k.grades.indexOf(grade - 1) >= 0) out.push({ id: id, review: true }); });
      return out;
    }
    function weight(c, m, focus) {
      var s = m[c.id], w = W[level(s)];
      if (focus === "weak") { var lv = level(s); w *= (lv === "emerging" || lv === "developing") ? 4 : (lv === "not_started" ? 1.5 : .25);
          }   /* chế độ "Ôn chỗ hay sai": dồn câu vào kỹ năng bé còn yếu */
      if (focus === "hard") w *= SK[c.id].diff >= 3 ? 4 : SK[c.id].diff === 2 ? 1.2 : .25;   /* "Thử thách khó": dồn vào kỹ năng khó (diff 3) */
      if (s && typeof s === "object") { var tt = 0; Object.keys(s.tags && typeof s.tags === "object" ? s.tags : {}).forEach(function (t) {
          tt += s.tags[t] > 0 ? +s.tags[t] : 0; }); w *= 1 +
          Math.min(2, tt / 3); }
      if (c.review) w *= .4;
      if ((Array.isArray(m._last) ? m._last : []).indexOf(c.id) >= 0) w *= .6;
      return w;
    }
    function planRound(subj, grade, n, topic, focus) {
      n = Math.max(1, Math.min(40, n | 0 || 5)); grade = clampGrade(grade); var m = load(subj), cs = candidates(subj, grade);
      if (topic) { var ct = cs.filter(function (c) { return topicOf(c.id, grade) === topic; }); if (ct.length) cs = ct;
          }   /* kiểm tra theo chủ đề: chỉ lấy kỹ năng của chủ đề đó (không có thì dùng cả lớp) */
      if (!cs.length) cs = Object.keys(SK).filter(function (id) { return SK[id].subj === subj; }).map(function (id) { return { id: id, review: false }; });
      if (!cs.length) return [];   /* môn lạ: không có kỹ năng nào */
      var main = cs.filter(function (c) { return !c.review; }), pool = main.length ? main : cs;
      // khởi động: kỹ năng bé đã vững (p cao, n>=3), nếu chưa có thì kỹ năng dễ nhất
      var solid = pool.filter(function (c) { var s = m[c.id]; return s && s.n >= 3 && s.p >= .8; });
      // chỉ ~một nửa số vòng khởi động bằng kỹ năng đã vững (không bắt bé luôn mở đầu bằng thứ đã thạo); còn lại: kỹ năng dễ nhất chưa vững
      var easy = function (arr) { var d = Math.min.apply(null, arr.map(function (c) { return SK[c.id].diff; })); var e = arr.filter(function (c) {
          return SK[c.id].diff === d; });
          return e.length ? e[rnd(0, e.length - 1)] : arr[0]; };
      var unsolid = pool.filter(function (c) { return solid.indexOf(c) < 0; });
      var warm = (solid.length && (R() < .5 || !unsolid.length)) ? solid[rnd(0, solid.length - 1)] : easy(unsolid.length ? unsolid : pool);
      var plan = [warm], cnt = {}; cnt[warm.id] = 1;
      while (plan.length < n) {
        var cap = Math.ceil(n / cs.length) + (focus === "weak" ? 2 : 0);
            /* mỗi kỹ năng tối đa 1 câu khi còn đủ kỹ năng khác (L3-21); vòng dài hơn số kỹ năng thì chia đều; "ôn chỗ yếu" được lặp */
        var av = cs.filter(function (c) { var lv = level(m[c.id]); return (cnt[c.id] || 0) < cap + (m[c.id] && (lv === "emerging" || lv === "developing") ? 1 : 0); });
            /* kỹ năng bé đang yếu được ra thêm 1 câu */ if (!av.length) av = cs;
        var tot = 0, ws = av.map(function (c) { var w = weight(c, m, focus); tot += w; return w; }), r = R() * tot, pick = av[av.length - 1];
        for (var i = 0; i < av.length; i++) { r -= ws[i]; if (r <= 0) { pick = av[i]; break; } }
        plan.push(pick); cnt[pick.id] = (cnt[pick.id] || 0) + 1;
      }
      var distinct = Object.keys(cnt).length;
      if (distinct < 2 && cs.length > 1) { var other = cs.filter(function (c) { return c.id !== warm.id; })[0]; plan[plan.length - 1] = other; }
      m._last = plan.map(function (p) { return p.id; }).filter(function (x, i, a) { return a.indexOf(x) === i; }); save(subj, m);
      return plan.map(function (p) { return { skill: p.id, topic: topicOf(p.id, grade), diff: SK[p.id].diff, review: p.review }; });
    }
    /* kỹ năng bé còn yếu (đã làm nhưng chưa vững) của môn × lớp, yếu nhất trước: giao diện dùng để hiện "Ôn chỗ hay sai (còn N kỹ năng)" */
    function weakSkills(subj, grade) {
      var m = load(subj); return candidates(subj, grade).filter(function (c) { var s = m[c.id], lv = level(s); return s && s.n > 0 && (
          lv === "emerging" || lv === "developing"); })
        .sort(function (a, b) { return m[a.id].p - m[b.id].p; }).map(function (c) { return c.id; });
    }
    /* ---- chống lặp trong một vòng (L3-21): không trùng câu, không trùng "từ đích" (vd hai câu cùng từ "chim") ---- */
    function clampGrade(g) { g = Math.round(+g); return g >= 1 && g <= 5 ? g : (g > 5 ? 5 : 1); }
    function plain(q) { return String(q.q || "").replace(/<[^>]+>/g, " ").replace(/[.,!?;:"“”()]/g, " ").replace(/\s+/g, " ").trim().toLowerCase(); }
    function qWord(q) {   /* từ đích: đáp án chữ của câu (reveal / ans / đáp án đúng), bỏ số, ký hiệu và từ quá ngắn */
      var w = typeof q.reveal === "string" ? q.reveal : typeof q.ans === "string" ? q.ans : "", r = q.o && q.o.filter(function (x) { return x.ok; })[0];
      if (!w && r) w = String(r.v); w = w.toLowerCase().replace(/[\s-]+/g, " ").trim();
      return w.length >= 3 && w.length <= 16 && /^[^\d\s<>]+(?: [^\d\s<>]+)*$/.test(w) && !/^(đúng|sai|true|false)$/.test(w) ? w : "";
    }
    function same(a, b) { var wa = qWord(a), wb = qWord(b), pa = plain(a), pb = plain(b);
      return (pa + "|" + (a.speak || "")) === (pb + "|" + (b.speak || "")) || (wa && (wa === wb || (" " + pb + " ").indexOf(" " + wa + " ") >= 0)) ||
          (wb && (" " + pa + " ").indexOf(" " + wb + " ") >= 0); }
    function clashAny(q, list) { return list.some(function (x) { return same(q, x); }); }
    function regen(q, subj, grade, lang, LT) {   /* sinh lại một câu đã trộn (giữ kiểu câu) */
      try {
        if (q.skill && SK[q.skill] && (!q.kind || q.kind === "typein" || q.kind === "pop")) { var b = make(q.skill, { lang: lang, grade: q.grade || grade, used: {} });
            return q.kind === "typein" ? (LT.asTypein(b, lang) || b) : q.kind === "pop" ? (LT.asPop(b, lang) || b) : b; }
        if (q.kind) return LT.make(q.kind, subj, grade, lang) || q;
      } catch (e) {}
      return q;
    }
    function guardMix() {   /* LearnTypes.mix (qtypes.js, nạp sau engine) được index.html gọi sau E.round: bọc để vòng đã trộn cũng không lặp */
      var LT = root.LearnTypes; if (!LT || !LT.mix || LT.mix.guarded) return;
      var mix0 = LT.mix; LT.mix = function (r, subj, grade, lang) {
        var out = mix0.apply(LT, arguments), kept = []; out.forEach(function (q, i) { for (var t = 0; t < 8 && clashAny(q, kept); t++) q = regen(q,
            subj, grade, lang, LT); out[i] = q; kept.push(q); });
        return out;
      }; LT.mix.guarded = true;
    }
    /* một vòng hoàn chỉnh: n câu đã sinh, không lặp câu dựng sẵn, không lặp đề/từ.
       opts = { lang, n (1–40; vòng thường 5, "Luyện nhiều hơn" 10/20, đề tổng hợp 30), topic, focus: "weak" = ưu tiên kỹ năng yếu, "hard" = ưu tiên kỹ năng khó } */
    function round(subj, grade, opts) {
      opts = opts || {}; grade = clampGrade(grade); var used = {}, lang = opts.lang === "en" ? "en" : "vi", list = []; guardMix();
      planRound(subj, grade, opts.n || 5, opts.topic, opts.focus).forEach(function (p) {
        var q, tries = 0; do { q = make(p.skill, { lang: lang, grade: grade, used: used }); tries++; } while (tries < 8 && clashAny(q, list));
        list.push(q);
      });
      return list;
    }

    EP.candidates = candidates; EP.planRound = planRound; EP.weakSkills = weakSkills; EP.round = round;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["round"] = part;
})(typeof window !== "undefined" ? window : globalThis);
