/* VƯỜN HỌC VUI: dữ liệu + luật (thuần, không chạm DOM; chạy được trong trình duyệt và Node để kiểm thử). Xem plan-learn-garden.md.
   - Lưu TRÊN MÁY ở "learn:garden" (không gửi ra ngoài).
   - Mỗi cây = một KỸ NĂNG của engine.js; giai đoạn lớn = mức thạo của kỹ năng đó (không phải chờ hay trả tiền).
   - Cây KHÔNG BAO GIỜ héo/chết: lâu không ôn thì "buồn ngủ" (sleepy), ôn hoặc tưới là tỉnh.
   - Thưởng cuối lượt: 💧 nước (mỗi câu đúng ngay lần đầu), 🌱 hạt giống (xong lượt), 🧪 phân bón (chuỗi đúng dài / 5 trên 5).
   - Mỗi bé một khác: hạt giống ngẫu nhiên của bé quyết định kiểu hoa / tông lá / sắc hoa của từng cây.
   - Ghi "tín hiệu khám phá" (kiểu câu hỏi bé gặp, số lần thử lại, môn học theo ngày) để sau này làm "Điểm sáng"; chỉ lưu số đếm, không lưu nội dung. */
(function (root) {
  "use strict";
  var KEY = "learn:garden", MAX_PLOTS = 6, SLEEP_DAYS = 5, DAY = 86400000;
  var PLANT = { toan: "math", tviet: "vietnamese", tanh: "english" };
  var STAGE = { not_started: 0, emerging: 1, developing: 2, proficient: 3, advanced: 4 };
  var BADGES = {
    first_seed: { e: "🌱", vi: "Hạt đầu tiên", en: "First seed" }, first_bloom: { e: "🌸", vi: "Hoa đầu tiên nở", en: "First bloom" },
    garden_full: { e: "🏡", vi: "Vườn đầy cây", en: "Full garden" }, streak5: { e: "🔥", vi: "Năm câu liền", en: "Five in a row" },
    perfect: { e: "⭐", vi: "Năm trên năm", en: "Five out of five" }, three_subjects: { e: "🌈", vi: "Đủ ba môn", en: "All three subjects" },
    explorer: { e: "🧭", vi: "Nhà thám hiểm", en: "Explorer" }, tries_again: { e: "💪", vi: "Thử lại không bỏ", en: "Never gives up" }
  };
  var VISITORS = { bee: { e: "🐝", vi: "Ong Đếm", en: "Counting Bee" }, butterfly: { e: "🦋", vi: "Bướm Chữ", en: "Letter Butterfly" }, firefly: { e: "✨", vi: "Đom đóm", en: "Fireflies" } };

  function memStore() { var m = {}; return { get: function (k) { return k in m ? m[k] : null; }, set: function (k, v) { m[k] = String(v); } }; }
  function defStore() {
    try { var ls = root.localStorage; if (ls) { ls.getItem("x"); return { get: function (k) { try { return ls.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { ls.setItem(k, v); } catch (e) {} } }; } } catch (e) {}
    return memStore();
  }
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dayKey(t) { var d = new Date(t); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

  function create(env) {
    env = env || {};
    var store = env.store || defStore(), E = env.engine || root.LearnEngine, now = env.now || function () { return Date.now(); }, rand = env.rand || Math.random;

    function fresh() { return { v: 1, seed: Math.floor(rand() * 4294967295) >>> 0, res: { water: 1, seeds: 2, fert: 0 }, plots: [], badges: {}, seen: {}, sig: { rounds: 0, kinds: {}, retry: 0, subj: {}, days: {} } }; }
    function load() {
      var g = null; try { g = JSON.parse(store.get(KEY) || "null"); } catch (e) {}
      if (!g || typeof g !== "object" || g.v !== 1) g = fresh();
      g.res = g.res || { water: 0, seeds: 0, fert: 0 }; g.plots = Array.isArray(g.plots) ? g.plots : []; g.badges = g.badges || {}; g.seen = g.seen || {};
      g.sig = g.sig || {}; g.sig.kinds = g.sig.kinds || {}; g.sig.subj = g.sig.subj || {}; g.sig.days = g.sig.days || {}; g.sig.rounds = g.sig.rounds || 0; g.sig.retry = g.sig.retry || 0;
      return g;
    }
    function save(g) { store.set(KEY, JSON.stringify(g)); }

    /* kỹ năng → môn, mức thạo, lần ôn gần nhất (đọc tiến độ của engine) */
    function skillInfo(id) {
      var sk = E && E.SKILLS && E.SKILLS[id]; if (!sk) return null;
      var sum = E.summary(sk.subj).skills.filter(function (x) { return x.id === id; })[0] || { level: "not_started", n: 0, t: 0 }, t = sum.t || 0;
      return { id: id, subj: sk.subj, level: sum.level, n: sum.n, t: t };
    }
    function stageOf(id) { var i = skillInfo(id); return i ? (STAGE[i.level] || 0) : 0; }
    function geneFor(g, idx) { var r = mulberry((g.seed ^ ((idx + 1) * 2654435761)) >>> 0); return { fl: "abc"[Math.floor(r() * 3)], lt: "abc"[Math.floor(r() * 3)], tn: "ab"[Math.floor(r() * 2)] }; }

    function plotView(g, p) {
      var i = skillInfo(p.skill) || { subj: "toan", level: "not_started", n: 0, t: 0 }, last = Math.max(i.t || 0, p.wet || 0, p.planted || 0), t = now();
      return { id: p.id, skill: p.skill, subj: i.subj, plant: PLANT[i.subj], gene: p.gene, stage: STAGE[i.level] || 0, level: i.level, sleepy: t - last > SLEEP_DAYS * DAY, fresh: t - Math.max(i.t || 0, p.wet || 0) < DAY };
    }
    function todayPractice(g) { return g.sig.days[dayKey(now())] || { rounds: 0, ok: 0, q: 0, subj: {} }; }
    function visitorsNow(g) {
      var d = todayPractice(g), out = [], h = new Date(now()).getHours();
      if (d.subj && d.subj.toan) out.push("bee");
      if (d.subj && (d.subj.tviet || d.subj.tanh)) out.push("butterfly");
      if (d.rounds > 0 && (h >= 18 || h < 5)) out.push("firefly");
      return out;
    }
    function award(g, id, list) { if (!g.badges[id]) { g.badges[id] = now(); list.push(id); } }
    function checkBadges(g, extra) {
      var got = [], bloom = g.plots.some(function (p) { return stageOf(p.skill) >= 4; });
      if (g.plots.length >= 1) award(g, "first_seed", got); if (bloom) award(g, "first_bloom", got); if (g.plots.length >= MAX_PLOTS) award(g, "garden_full", got);
      if (extra && extra.best >= 5) award(g, "streak5", got); if (extra && extra.perfect) award(g, "perfect", got);
      if (g.sig.subj.toan && g.sig.subj.tviet && g.sig.subj.tanh) award(g, "three_subjects", got);
      if (Object.keys(g.sig.kinds).length >= 8) award(g, "explorer", got); if (g.sig.retry >= 10) award(g, "tries_again", got);
      return got;
    }

    var API = {
      BADGES: BADGES, VISITORS: VISITORS, MAX_PLOTS: MAX_PLOTS, PLANT: PLANT,
      state: function () { return load(); },
      /* mỗi câu đã xong: ghi tín hiệu (chỉ đếm) */
      signal: function (kind, tries) { var g = load(); kind = String(kind || "mc"); g.sig.kinds[kind] = (g.sig.kinds[kind] || 0) + 1; if (tries > 0) g.sig.retry += 1; var b = checkBadges(g); save(g); return b; },
      /* xong một lượt: phát thưởng; info = { subj, correct, total, best } */
      endRound: function (info) {
        var g = load(), correct = Math.max(0, info.correct | 0), total = Math.max(1, info.total | 0), best = info.best | 0, perfect = correct >= total;
        var water = correct + (best >= 3 ? 1 : 0), seeds = 1, fert = (perfect || best >= 4) ? 1 : 0;
        g.res.water += water; g.res.seeds += seeds; g.res.fert += fert; g.sig.rounds += 1; g.sig.subj[info.subj] = (g.sig.subj[info.subj] || 0) + 1;
        var k = dayKey(now()), d = g.sig.days[k] || { rounds: 0, ok: 0, q: 0, subj: {} }; d.rounds++; d.ok += correct; d.q += total; d.subj[info.subj] = (d.subj[info.subj] || 0) + 1; g.sig.days[k] = d;
        var keys = Object.keys(g.sig.days).sort(); while (keys.length > 60) delete g.sig.days[keys.shift()];   /* chỉ giữ 60 ngày gần nhất */
        var badges = checkBadges(g, { best: best, perfect: perfect }); visitorsNow(g).forEach(function (v) { if (!g.seen[v]) g.seen[v] = now(); });
        save(g); return { water: water, seeds: seeds, fert: fert, badges: badges };
      },
      /* gieo một kỹ năng vào ô trống (tốn 1 hạt giống) */
      plant: function (skill) {
        var g = load(); if (!E.SKILLS[skill]) return { ok: false, why: "skill" };
        if (g.plots.some(function (p) { return p.skill === skill; })) return { ok: false, why: "planted" };
        if (g.plots.length >= MAX_PLOTS) return { ok: false, why: "full" }; if (g.res.seeds < 1) return { ok: false, why: "seed" };
        var idx = g.plots.length, p = { id: "p" + (idx + 1), skill: skill, gene: geneFor(g, idx), planted: now(), wet: 0 };
        g.res.seeds -= 1; g.plots.push(p); var b = checkBadges(g); save(g); return { ok: true, plot: p, badges: b };
      },
      /* tưới cây (tốn 1 nước): cây tỉnh, hết buồn ngủ */
      water: function (id) {
        var g = load(), p = g.plots.filter(function (x) { return x.id === id; })[0]; if (!p) return { ok: false, why: "none" }; if (g.res.water < 1) return { ok: false, why: "water" };
        g.res.water -= 1; p.wet = now(); save(g); return { ok: true };
      },
      /* kỹ năng có thể gieo: đã học ít nhất một câu hoặc thuộc lớp đang chọn, chưa có trong vườn */
      plantable: function (grade) {
        var g = load(), have = {}; g.plots.forEach(function (p) { have[p.skill] = 1; });
        return Object.keys(E.SKILLS).filter(function (id) { var k = E.SKILLS[id]; if (have[id]) return false; var i = skillInfo(id); return (i && i.n > 0) || (grade ? k.grades.indexOf(grade) >= 0 : true); }).map(function (id) { var i = skillInfo(id); return { id: id, subj: i.subj, n: i.n, level: i.level }; });
      },
      view: function () {
        var g = load(); return { res: g.res, plots: g.plots.map(function (p) { return plotView(g, p); }), badges: Object.keys(g.badges), visitors: visitorsNow(g), seen: g.seen, rounds: g.sig.rounds, max: MAX_PLOTS };
      },
      /* ngày/đêm theo giờ máy: day | dusk | night */
      phase: function () { var h = new Date(now()).getHours() + new Date(now()).getMinutes() / 60; return h >= 6 && h < 17 ? "day" : h >= 17 && h < 19 ? "dusk" : "night"; },
      reset: function () { store.set(KEY, ""); }
    };
    return API;
  }
  var G = create(); G.create = create; G.dayKey = dayKey;
  root.LearnGarden = G;
  if (typeof module !== "undefined" && module.exports) module.exports = G;
})(typeof window !== "undefined" ? window : globalThis);
