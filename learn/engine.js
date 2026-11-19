/* BỘ MÁY HỌC (thuần, không chạm DOM; chạy được trong trình duyệt và Node để kiểm thử).
   - Câu hỏi theo KỸ NĂNG: số học sinh bằng thuật toán, phần còn lại lấy từ learn/content/bank.js.
   - Mỗi đáp án sai gắn một MÃ LỖI TƯ DUY (TAGS) để biết bé hổng ở đâu.
   - Tiến độ lưu máy (localStorage "learn:m:<môn>"): n, ok, p (độ chính xác gần đây), tags (lỗi theo kỹ năng).
   - planRound(): chọn kỹ năng cho vòng 5 câu: khởi động dễ, ưu tiên kỹ năng yếu / hay sai, tránh lặp, có ôn lớp dưới.
   Không dùng AI lúc chạy. Xem plan-learn.md mục 0.2–0.5; kiểm thử: node scripts/learn/check-bank.js */
(function (root) {
  "use strict";
  var TAGS = ["off_by_one", "wrong_op", "forget_carry", "tens_error", "table_confuse", "carry_error", "add_denominator", "decimal_point", "percent_misread", "spelling", "tone", "meaning", "word", "grammar", "reading", "other"];
  var R = Math.random;
  function rnd(a, b) { return a + Math.floor(R() * (b - a + 1)); }
  function shuf(a) { for (var i = a.length - 1; i > 0; i--) { var j = rnd(0, i), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var BANK = null;
  function bank() { return BANK || root.LEARN_BANK || []; }

  /* ---- tạo câu hỏi 4 lựa chọn: wrongs = [[giá trị, mã lỗi], ...]; luôn đủ 4 lựa chọn khác nhau ---- */
  function mk(q, ans, wrongs, lab) {
    var seen = {}, o = [{ v: String(ans), ok: 1 }]; seen[String(ans)] = 1;
    wrongs.forEach(function (w) { var s = String(w[0]); if (!seen[s] && o.length < 4) { seen[s] = 1; o.push({ v: s, tag: w[1] }); } });
    var k = 1;
    while (o.length < 4 && k < 60) { var s2 = String(typeof ans === "number" ? ans + k * (k % 2 ? 1 : -1) * Math.ceil(k / 2) : ans + k); k++; if (!seen[s2] && !(typeof ans === "number" && +s2 < 0)) { seen[s2] = 1; o.push({ v: s2, tag: "other" }); } }
    return { q: q, o: shuf(o), lab: lab };
  }
  var fmt = function (n, lang) { return lang === "vi" ? String(n).replace(".", ",") : String(n); };

  /* ---- bộ sinh số học theo kỹ năng ---- */
  var G = {
    add10: function () { var a = rnd(1, 9), b = rnd(1, 10 - a), s = a + b; return mk(a + " + " + b + " = <em>?</em>", s, [[s + 1, "off_by_one"], [s - 1, "off_by_one"], [Math.abs(a - b), "wrong_op"], [s + 2, "off_by_one"]]); },
    sub10: function () { var s = rnd(2, 10), b = rnd(1, s - 1), a = s - b; return mk(s + " − " + b + " = <em>?</em>", a, [[a + 1, "off_by_one"], [a - 1, "off_by_one"], [s + b, "wrong_op"], [a + 2, "off_by_one"]]); },
    add20: function () { var a = rnd(3, 18), b = rnd(Math.max(2, 11 - a), 20 - a), s = a + b; return mk(a + " + " + b + " = <em>?</em>", s, [[s + 1, "off_by_one"], [s - 1, "off_by_one"], [Math.abs(a - b), "wrong_op"], [s + 2, "off_by_one"]]); },
    sub20: function () { var a = rnd(11, 20), b = rnd(2, a - 1), r = a - b; return mk(a + " − " + b + " = <em>?</em>", r, [[r + 1, "off_by_one"], [r - 1, "off_by_one"], [a + b, "wrong_op"], [r + 2, "off_by_one"]]); },
    add_carry: function () { var a, b; do { a = rnd(15, 69); b = rnd(11, 29); } while (a % 10 + b % 10 < 10 || a + b > 99); var s = a + b; return mk(a + " + " + b + " = <em>?</em>", s, [[s - 10, "forget_carry"], [s + 10, "tens_error"], [s + 1, "off_by_one"], [s - 1, "off_by_one"]]); },
    times25: function () { var n = R() < .5 ? 2 : 5, m = rnd(2, 9), s = n * m; return mk(n + " × " + m + " = <em>?</em>", s, [[n * (m + 1), "table_confuse"], [n * (m - 1), "table_confuse"], [s + 1, "off_by_one"], [n + m, "wrong_op"]]); },
    times69: function () { var a = rnd(6, 9), b = rnd(2, 9), s = a * b; return mk(a + " × " + b + " = <em>?</em>", s, [[a * (b + 1), "table_confuse"], [a * (b - 1), "table_confuse"], [(a + 1) * b, "table_confuse"], [a + b, "wrong_op"]]); },
    div69: function () { var a = rnd(6, 9), b = rnd(2, 9); return mk(a * b + " ÷ " + a + " = <em>?</em>", b, [[b + 1, "off_by_one"], [b - 1, "off_by_one"], [a, "table_confuse"], [a * b - a, "wrong_op"]]); },
    mul_carry: function () { var a = rnd(12, 48), b = rnd(3, 9), s = a * b; return mk(a + " × " + b + " = <em>?</em>", s, [[s - 10, "carry_error"], [s + 10, "carry_error"], [s + 1, "off_by_one"], [a + b, "wrong_op"]]); },
    dec_add: function (c) { var a = rnd(11, 89) / 10, b = rnd(11, 89) / 10, s = Math.round((a + b) * 10) / 10, L = c.lang;
      return mk(fmt(a.toFixed(1), L) + " + " + fmt(b.toFixed(1), L) + " = <em>?</em>", fmt(s.toFixed(1), L), [[fmt(Math.round(s * 10), L), "decimal_point"], [fmt((s / 10).toFixed(2), L), "decimal_point"], [fmt((s + .1).toFixed(1), L), "off_by_one"], [fmt((s - .1).toFixed(1), L), "off_by_one"]]); },
    pct_of: function () { var p = [10, 20, 25, 50][rnd(0, 3)], n = [40, 60, 80, 100, 200][rnd(0, 4)], s = n * p / 100; return mk(p + "% × " + n + " = <em>?</em>", s, [[p, "percent_misread"], [n / p, "percent_misread"], [s + 5, "off_by_one"], [n - s, "wrong_op"]]); }
  };

  /* ---- danh mục kỹ năng: môn, lớp chính, độ khó (1 dễ … 3 khó) ---- */
  var A5 = [1, 2, 3, 4, 5];
  var SK = {
    add10: { subj: "toan", grades: [1], diff: 1 }, sub10: { subj: "toan", grades: [1], diff: 1 }, add20: { subj: "toan", grades: [1], diff: 2 }, sub20: { subj: "toan", grades: [1], diff: 2 },
    word_addsub: { subj: "toan", grades: [1, 2], diff: 2 }, add_carry: { subj: "toan", grades: [2], diff: 2 }, times25: { subj: "toan", grades: [2], diff: 2 },
    times69: { subj: "toan", grades: [3], diff: 3 }, div69: { subj: "toan", grades: [3], diff: 3 }, word_mul: { subj: "toan", grades: [3], diff: 3 },
    mul_carry: { subj: "toan", grades: [4], diff: 2 }, frac_basic: { subj: "toan", grades: [4], diff: 3 }, dec_add: { subj: "toan", grades: [5], diff: 2 }, pct_of: { subj: "toan", grades: [5], diff: 3 },
    spell_chtr: { subj: "tviet", grades: A5, diff: 1 }, tone: { subj: "tviet", grades: A5, diff: 1 }, antonym: { subj: "tviet", grades: [3, 4, 5], diff: 2 }, reading_short: { subj: "tviet", grades: A5, diff: 2 },
    vocab_animals: { subj: "tanh", grades: [1, 2], diff: 1 }, vocab_things: { subj: "tanh", grades: [1, 2], diff: 1 }, be_verb: { subj: "tanh", grades: [3, 4, 5], diff: 1 }, dialogue: { subj: "tanh", grades: [3, 4, 5], diff: 2 }
  };
  /* kỹ năng → chủ đề trong cây chương trình GDPT 2018 (learn/content/curriculum.js), theo lớp */
  var G1 = "g1_add_sub", VT = { 1: "VI-G1-03", 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, EN = { 1: "EN-G1-02", 2: "EN-G2-03" }, EB = { 3: "EN-G3-02", 4: "EN-G4-02", 5: "EN-G5-02" };
  var TOPIC = {
    add10: { 1: G1 }, sub10: { 1: G1 }, add20: { 1: G1 }, sub20: { 1: G1 }, word_addsub: { 1: G1, 2: "g2_operations" }, add_carry: { 2: "g2_operations" }, times25: { 2: "g2_operations" },
    times69: { 3: "g3_four_operations" }, div69: { 3: "g3_four_operations" }, word_mul: { 3: "g3_four_operations" }, mul_carry: { 4: "g4_operations" }, frac_basic: { 4: "g4_fractions" }, dec_add: { 5: "g5_decimals" }, pct_of: { 5: "g5_ratio_percent" },
    spell_chtr: VT, tone: VT, antonym: { 3: "VI-G3-02", 4: "VI-G4-01", 5: "VI-G5-02" }, reading_short: { 1: "VI-G1-02", 2: "VI-G2-01", 3: "VI-G3-01", 4: "VI-G4-02", 5: "VI-G5-01" },
    vocab_animals: EN, vocab_things: EN, be_verb: EB, dialogue: EB
  };
  function topicOf(skill, grade) { var t = TOPIC[skill] || {}, ks = Object.keys(t).map(Number).sort(function (a, b) { return a - b; }); if (t[grade]) return t[grade]; var le = ks.filter(function (k) { return k <= grade; }); return le.length ? t[le[le.length - 1]] : t[ks[0]]; }

  /* ---- câu hỏi từ ngân hàng dựng sẵn ---- */
  function fromBank(skill, c) {
    var pool = bank().filter(function (b) { return b.skill === skill && b.grades.indexOf(c.grade) >= 0; });
    if (!pool.length) pool = bank().filter(function (b) { return b.skill === skill; });
    if (!pool.length) throw new Error("Không có câu cho kỹ năng " + skill);
    var fresh = pool.filter(function (b) { return !(c.used && c.used[b.id]); }); if (fresh.length) pool = fresh;
    var it = pool[rnd(0, pool.length - 1)]; if (c.used) c.used[it.id] = 1;
    var st = typeof it.stem === "string" ? it.stem : (it.stem[c.lang] || it.stem.vi);
    st = st.replace(/_{2,}/, function (m) { return "<em class=\"bl\">" + m + "</em>"; });
    if (it.type === "dialogue") st = st.replace(" B: ", "<br>B: ");
    var wrongs = it.wrong;
    if (!wrongs) { wrongs = shuf(bank().filter(function (b) { return b.type === it.type && b.answer !== it.answer; })).slice(0, 3).map(function (b) { return [b.answer, "word"]; }); }
    var q = mk(st, it.answer, wrongs, it.lab); q.id = it.id; q.type = it.type; q.steps = it.steps; return q;
  }

  /* ---- tạo một câu cho kỹ năng ---- */
  function make(skill, c) {
    c = c || {}; c.lang = c.lang || "vi"; c.grade = c.grade || (SK[skill] && SK[skill].grades[0]) || 1;
    var meta = SK[skill]; if (!meta) throw new Error("Kỹ năng lạ: " + skill);
    var q = G[skill] ? G[skill](c) : fromBank(skill, c);
    q.skill = skill; q.subj = meta.subj; q.diff = meta.diff; q.grade = c.grade; q.topic = topicOf(skill, c.grade); if (!q.type) q.type = "calculation";
    return q;
  }

  /* ---- lưu tiến độ ---- */
  var MEM = {}, backend = {
    get: function (k) { try { if (typeof localStorage !== "undefined") return localStorage.getItem(k); } catch (e) {} return MEM[k] == null ? null : MEM[k]; },
    set: function (k, v) { try { if (typeof localStorage !== "undefined") { localStorage.setItem(k, v); return; } } catch (e) {} MEM[k] = v; }
  };
  function load(subj) { try { return JSON.parse(backend.get("learn:m:" + subj) || "{}") || {}; } catch (e) { return {}; } }
  function save(subj, m) { backend.set("learn:m:" + subj, JSON.stringify(m)); }
  function bumpErr(tag) { try { var e = JSON.parse(backend.get("learn:err") || "{}"); e[tag] = (e[tag] || 0) + 1; backend.set("learn:err", JSON.stringify(e)); } catch (x) {} }

  /* mức thành thạo theo student_progress_schema: not_started, emerging, developing, proficient, advanced */
  function level(s) {
    if (!s || !s.n) return "not_started";
    if (s.n < 4 || s.p < .6) return "emerging";
    if (s.p < .8) return "developing";
    if (s.n >= 8 && s.p >= .92) return "advanced";
    return "proficient";
  }
  /* nhật ký theo ngày (cho trang phụ huynh): learn:day = { "YYYY-MM-DD": { n, ok, s: { toan: n, ... } } }, giữ 30 ngày gần nhất; chỉ có số đếm, không có nội dung câu hỏi */
  function dayKey(d) { d = d || new Date(); var z = function (x) { return (x < 10 ? "0" : "") + x; }; return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); }
  function bumpDay(subj, ok) {
    try {
      var all = JSON.parse(backend.get("learn:day") || "{}") || {}, k = dayKey(), d = all[k] || { n: 0, ok: 0, s: {} };
      d.n++; if (ok) d.ok++; d.s[subj] = (d.s[subj] || 0) + 1; all[k] = d;
      var keys = Object.keys(all).sort(); while (keys.length > 30) delete all[keys.shift()];
      backend.set("learn:day", JSON.stringify(all));
    } catch (x) {}
  }
  /* n ngày gần nhất (cũ → mới), ngày không học có n = 0 */
  function daily(n) {
    var all = {}; try { all = JSON.parse(backend.get("learn:day") || "{}") || {}; } catch (x) {}
    var out = [], now = new Date();
    for (var i = n - 1; i >= 0; i--) { var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), k = dayKey(d), v = all[k] || { n: 0, ok: 0, s: {} }; out.push({ date: k, dow: d.getDay(), n: v.n, ok: v.ok, s: v.s }); }
    return out;
  }
  /* xoá toàn bộ tiến độ học của bé (giữ cài đặt giao diện) */
  function resetAll() { ["toan", "tviet", "tanh"].forEach(function (s) { backend.set("learn:m:" + s, "{}"); }); backend.set("learn:err", "{}"); backend.set("learn:day", "{}"); }
  function record(subj, skill, ok, tag) {
    if (!SK[skill]) return null;
    var m = load(subj), s = m[skill] || { n: 0, ok: 0, p: 0, tags: {}, t: 0 }, v = ok ? 1 : 0;
    s.n++; if (ok) s.ok++; s.p = s.n === 1 ? v : .7 * s.p + .3 * v; s.t = Date.now();
    if (!ok) { var tg = TAGS.indexOf(tag) >= 0 ? tag : "other"; s.tags[tg] = (s.tags[tg] || 0) + 1; bumpErr(tg); }
    m[skill] = s; save(subj, m); bumpDay(subj, ok); return level(s);
  }

  /* ---- chọn kỹ năng cho một vòng ---- */
  var W = { not_started: 2, emerging: 3, developing: 2, proficient: .8, advanced: .25 };
  function candidates(subj, grade) {
    var out = [];
    Object.keys(SK).forEach(function (id) { var k = SK[id]; if (k.subj !== subj) return; if (k.grades.indexOf(grade) >= 0) out.push({ id: id, review: false }); else if (grade > 1 && k.grades.indexOf(grade - 1) >= 0) out.push({ id: id, review: true }); });
    return out;
  }
  function weight(c, m) {
    var s = m[c.id], w = W[level(s)];
    if (s) { var tt = 0; Object.keys(s.tags || {}).forEach(function (t) { tt += s.tags[t]; }); w *= 1 + Math.min(2, tt / 3); }
    if (c.review) w *= .4;
    if ((m._last || []).indexOf(c.id) >= 0) w *= .6;
    return w;
  }
  function planRound(subj, grade, n) {
    n = n || 5; var m = load(subj), cs = candidates(subj, grade);
    if (!cs.length) cs = Object.keys(SK).filter(function (id) { return SK[id].subj === subj; }).map(function (id) { return { id: id, review: false }; });
    var main = cs.filter(function (c) { return !c.review; }), pool = main.length ? main : cs;
    // khởi động: kỹ năng bé đã vững (p cao, n>=3), nếu chưa có thì kỹ năng dễ nhất
    var solid = pool.filter(function (c) { var s = m[c.id]; return s && s.n >= 3 && s.p >= .8; });
    // chỉ ~một nửa số vòng khởi động bằng kỹ năng đã vững (không bắt bé luôn mở đầu bằng thứ đã thạo); còn lại: kỹ năng dễ nhất chưa vững
    var easy = function (arr) { var d = Math.min.apply(null, arr.map(function (c) { return SK[c.id].diff; })); var e = arr.filter(function (c) { return SK[c.id].diff === d; }); return e[rnd(0, e.length - 1)]; };
    var unsolid = pool.filter(function (c) { return solid.indexOf(c) < 0; });
    var warm = (solid.length && (R() < .5 || !unsolid.length)) ? solid[rnd(0, solid.length - 1)] : easy(unsolid.length ? unsolid : pool);
    var plan = [warm], cnt = {}; cnt[warm.id] = 1;
    while (plan.length < n) {
      var av = cs.filter(function (c) { return (cnt[c.id] || 0) < 2; }); if (!av.length) av = cs;
      var tot = 0, ws = av.map(function (c) { var w = weight(c, m); tot += w; return w; }), r = R() * tot, pick = av[av.length - 1];
      for (var i = 0; i < av.length; i++) { r -= ws[i]; if (r <= 0) { pick = av[i]; break; } }
      plan.push(pick); cnt[pick.id] = (cnt[pick.id] || 0) + 1;
    }
    var distinct = Object.keys(cnt).length;
    if (distinct < 2 && cs.length > 1) { var other = cs.filter(function (c) { return c.id !== warm.id; })[0]; plan[plan.length - 1] = other; }
    m._last = plan.map(function (p) { return p.id; }).filter(function (x, i, a) { return a.indexOf(x) === i; }); save(subj, m);
    return plan.map(function (p) { return { skill: p.id, topic: topicOf(p.id, grade), diff: SK[p.id].diff, review: p.review }; });
  }
  /* một vòng hoàn chỉnh: n câu đã sinh, không lặp câu dựng sẵn */
  function round(subj, grade, opts) {
    opts = opts || {}; var used = {}, lang = opts.lang || "vi", stems = {};
    return planRound(subj, grade, opts.n || 5).map(function (p) {
      var q, tries = 0; do { q = make(p.skill, { lang: lang, grade: grade, used: used }); tries++; } while (stems[q.q] && tries < 8);   /* không lặp đúng một câu trong vòng */
      stems[q.q] = 1; return q;
    });
  }

  /* ---- tóm tắt cho phụ huynh / báo cáo ---- */
  function summary(subj) {
    var m = load(subj), out = [];
    Object.keys(SK).forEach(function (id) { if (SK[id].subj !== subj) return; var s = m[id]; out.push({ id: id, level: level(s), n: s ? s.n : 0, p: s ? Math.round(s.p * 100) / 100 : 0, tags: s ? s.tags : {}, t: s ? s.t || 0 : 0 }); });
    var weak = out.filter(function (x) { return x.n > 0 && (x.level === "emerging" || x.level === "developing"); }).sort(function (a, b) { return a.p - b.p; });
    var tags = {}; try { tags = JSON.parse(backend.get("learn:err") || "{}"); } catch (e) {}
    return { skills: out, weakest: weak.map(function (x) { return x.id; }), tags: tags };
  }

  /* ---- xuất theo question_generation_schema (cho gia sư AI / kho câu hỏi): cur = window.LEARN_CURRICULUM nếu có ---- */
  function toSchema(q, cur) {
    var strand = ""; try { var S = cur.subjects[q.subj]; S.grades.forEach(function (g) { g.topics.forEach(function (t) { if (t.id === q.topic) strand = t.tag; }); }); } catch (e) {}
    var ans = q.o.filter(function (x) { return x.ok; })[0];
    return { question_id: q.id || (q.skill + "-gen"), grade: q.grade, strand: strand, topic_id: q.topic, difficulty: ["foundation", "standard", "challenge"][q.diff - 1], question_type: q.type,
      prompt: String(q.q).replace(/<[^>]+>/g, ""), expected_answer: ans.v, solution_steps: q.steps || [], misconception_tags: q.o.filter(function (x) { return !x.ok; }).map(function (x) { return x.tag; }),
      curriculum_alignment: { grade: q.grade, strand: strand, topic_id: q.topic, learning_outcome_id: null, alignment_type: "paraphrase" } };
  }

  var E = {
    TAGS: TAGS, SKILLS: SK, make: make, round: round, planRound: planRound, record: record, level: level, summary: summary, daily: daily, resetAll: resetAll, dayKey: dayKey, toSchema: toSchema, topicOf: topicOf,
    use: function (b) { backend = b; }, setRng: function (f) { R = f || Math.random; }, setBank: function (b) { BANK = b; }, load: load,
    skillsFor: function (subj, grade) { return candidates(subj, grade); }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = E; else root.LearnEngine = E;
})(typeof window !== "undefined" ? window : globalThis);
