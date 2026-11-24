/* KỶ LỤC CÁ NHÂN của bé lớp 3–5 (Học Vui): chỉ so với CHÍNH MÌNH, không bảng xếp hạng, không gửi đi đâu.
   Đọc các khoá có sẵn (learn:day = số câu theo ngày 30 ngày, learn:habit = các ngày đã học) rồi GHI NHỚ mức cao nhất vào "learn:records"
   (nằm trong sao lưu, learn/backup.js) để kỷ lục không mất khi nhật ký 30 ngày bị cắt bớt.
   learn:records = { v: 1, ds: { v, d }, bq: { v, d }, ba: { v, d }, bw: { v, d }, cs: { v, d, cur } }; d = ngày đặt kỷ lục "YYYY-MM-DD".
     ds = ngày học liền dài nhất; bq = nhiều câu nhất trong một ngày; ba = tỉ lệ đúng cao nhất trong một ngày (>= 10 câu, %);
     bw = số ngày học nhiều nhất trong một tuần; cs = câu đúng liên tiếp dài nhất (cần trang học gọi Records.noteAnswer(ok); chưa nối thì không hiện).
   API: update(now?) -> bản ghi; compare(now?) -> tuần này vs tuần trước (cùng số ngày); subjWeeks(now?) -> số câu 4 tuần gần nhất theo môn;
        noteAnswer(ok); longestRun(keys); stats() -> { days, questions, stars, ds }. Có thể require() trong Node (đọc/ghi qua globalThis.localStorage). */
(function (root) {
  "use strict";
  var KEY = "learn:records", SUBJ = ["toan", "tviet", "tanh"];
  function ls(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); root.localStorage.setItem(k, v); } catch (e) { return null; } }
  function pj(k) { try { var o = JSON.parse(ls(k) || "null"); return o && typeof o === "object" ? o : null; } catch (e) { return null; } }
  function z(n) { return (n < 10 ? "0" : "") + n; }
  function dkey(d) { return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); }
  function parse(k) { var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(k); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function mon(d) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  function dayLog() { var o = pj("learn:day") || {}; return Array.isArray(o) ? {} : o; }
  /* các ngày bé có học = ngày trong learn:habit.days + ngày có câu trong learn:day */
  function activeKeys() {
    var set = {}, h = pj("learn:habit"), d = dayLog();
    if (h && Array.isArray(h.days)) h.days.forEach(function (k) { if (parse(k)) set[k] = 1; });
    Object.keys(d).forEach(function (k) { if (parse(k) && d[k] && d[k].n > 0) set[k] = 1; });
    return Object.keys(set).sort();
  }
  function longestRun(keys) {
    var best = 0, run = 0, prev = null;
    keys.slice().sort().forEach(function (k) {
      var t = parse(k); if (!t) return;
      run = prev && Math.round((t - prev) / 86400000) === 1 ? run + 1 : 1; prev = t; if (run > best) best = run;
    });
    return best;
  }
  function weekDays(keys) {   /* số ngày học nhiều nhất trong một tuần (T2–CN) */
    var by = {}, best = 0; keys.forEach(function (k) { var w = dkey(mon(parse(k))); by[w] = (by[w] || 0) + 1; if (by[w] > best) best = by[w]; }); return best;
  }
  function load() { var o = pj(KEY); return o && o.v === 1 ? o : { v: 1 }; }
  function bump(o, k, v, today, extra) {
    if (!(v > 0)) return false; var c = o[k];
    if (c && c.v >= v) return false;
    o[k] = { v: v, d: c ? today : "" };   /* d rỗng = lần ghi nhận đầu (lấy từ nhật ký cũ), chưa phải "kỷ lục mới" */ if (extra) for (var x in extra) o[k][x] = extra[x]; return true;
  }
  function update(now) {
    now = now || new Date(); var o = load(), today = dkey(now), keys = activeKeys(), log = dayLog(), ch = false, bq = 0, ba = 0;
    ch = bump(o, "ds", longestRun(keys), today) || ch; ch = bump(o, "bw", weekDays(keys), today) || ch;
    Object.keys(log).forEach(function (k) { var e = log[k]; if (!e) return; if (e.n > bq) bq = e.n; if (e.n >= 10) ba = Math.max(ba, Math.round((e.ok || 0) * 100 / e.n)); });
    ch = bump(o, "bq", bq, today) || ch; ch = bump(o, "ba", ba, today) || ch;
    if (ch) ls(KEY, JSON.stringify(o));
    return o;
  }
  function noteAnswer(ok) {
    var o = load(), c = o.cs || { v: 0, d: "", cur: 0 }; c.cur = ok ? (c.cur | 0) + 1 : 0;
    if (c.cur > c.v) { c.v = c.cur; c.d = dkey(new Date()); } o.cs = c; ls(KEY, JSON.stringify(o)); return c.cur;
  }
  function sumRange(log, from, to, subj) {   /* cộng n, ok từ ngày from tới to (gồm cả hai) */
    var n = 0, ok = 0, days = 0, d;
    for (d = from; d <= to; d = addDays(d, 1)) { var e = log[dkey(d)]; if (!e) continue; var q = subj ? (e.s && e.s[subj]) || 0 : e.n || 0; n += q; if (!subj) ok += e.ok || 0; if (q > 0) days++; }
    return { n: n, ok: ok, days: days, acc: !subj && n ? Math.round(ok * 100 / n) : null };
  }
  /* tuần này (T2 → hôm nay) so với tuần trước (T2 → CÙNG thứ): công bằng, không bắt bé "thua" chỉ vì tuần chưa hết */
  function compare(now) {
    now = now || new Date(); var log = dayLog(), m = mon(now), dow = (now.getDay() + 6) % 7, pm = addDays(m, -7);
    var a = sumRange(log, m, now), b = sumRange(log, pm, addDays(pm, dow)); return { cur: a, prev: b, upto: dow + 1 };
  }
  function subjWeeks(now) {
    now = now || new Date(); var log = dayLog(), m = mon(now), out = {};
    SUBJ.forEach(function (s) { out[s] = [3, 2, 1, 0].map(function (w) { var f = addDays(m, -7 * w); return sumRange(log, f, w ? addDays(f, 6) : now, s).n; }); });
    return out;
  }
  function stats() {
    var h = pj("learn:habit") || {}, q = 0, r = load(), keys = activeKeys();
    SUBJ.forEach(function (s) { var m = pj("learn:m:" + s) || {}; Object.keys(m).forEach(function (k) { if (m[k] && m[k].n > 0) q += m[k].n; }); });
    return { days: Math.max(h.total | 0, keys.length), questions: q, stars: +ls("learn:stars") || 0, ds: Math.max(r.ds ? r.ds.v : 0, longestRun(keys)) };
  }
  var api = { KEY: KEY, update: update, compare: compare, subjWeeks: subjWeeks, noteAnswer: noteAnswer, longestRun: longestRun, stats: stats, load: load, dkey: dkey };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.LearnRecords = api;
})(typeof window !== "undefined" ? window : globalThis);
