/* Bộ máy học — Lưu tiến độ (localStorage/bộ nhớ), ghi kết quả, thống kê ngày, mức thành thạo 4 bậc.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var SK = EP.SK, TAGS = EP.TAGS, TRACKED = EP.TRACKED;

    /* ---- lưu tiến độ ---- */
    var MEM = {};
    EP.backend = {
      get: function (k) { try { if (typeof localStorage !== "undefined") return localStorage.getItem(k); } catch (e) {} return MEM[k] == null ? null : MEM[k]; },
      set: function (k, v) { try { if (typeof localStorage !== "undefined") { localStorage.setItem(k, v); return; } } catch (e) {} MEM[k] = v; }
    };
    function load(subj) { try { var o = JSON.parse(EP.backend.get("learn:m:" + subj) || "{}"); return o && typeof o === "object" && !Array.isArray(
        o) ? o : {}; } catch (e) { return {};
        } }   /* dữ liệu lạ/hỏng → như chưa học */
    function save(subj, m) { EP.backend.set("learn:m:" + subj, JSON.stringify(m)); }
    function bumpErr(tag) { try { var e = JSON.parse(EP.backend.get("learn:err") || "{}"); e[tag] = (e[tag] || 0) + 1; EP.backend.set("learn:err",
        JSON.stringify(e)); } catch (x) {} }

    /* mức thành thạo theo student_progress_schema: not_started, emerging, developing, proficient, advanced */
    function level(s) {
      if (!s || !s.n) return "not_started";
      if (s.n < 4 || s.p < .6) return "emerging";
      if (s.p < .8) return "developing";
      if (s.n >= 8 && s.p >= .92) return "advanced";
      return "proficient";
    }
    /* nhật ký theo ngày (cho trang phụ huynh): learn:day = { "YYYY-MM-DD": { n, ok, s: { toan: n, ... } } }, giữ 30 ngày gần nhất; chỉ có số đếm, không có nội dung câu hỏi */
    function dayKey(d) { d = d || new Date(); var z = function (x) { return (x < 10 ? "0" : "") + x; }; return d.getFullYear() + "-" + z(d.getMonth(
        ) + 1) + "-" + z(d.getDate()); }
    function bumpDay(subj, ok) {
      try {
        var all = JSON.parse(EP.backend.get("learn:day") || "{}") || {}, k = dayKey(), d = all[k] || { n: 0, ok: 0, s: {} };
        d.n++; if (ok) d.ok++; d.s[subj] = (d.s[subj] || 0) + 1; all[k] = d;
        var keys = Object.keys(all).sort(); while (keys.length > 30) delete all[keys.shift()];
        EP.backend.set("learn:day", JSON.stringify(all));
      } catch (x) {}
    }
    /* nhật ký CHI TIẾT theo ngày cho phụ huynh: learn:dayk = { "YYYY-MM-DD": { <môn>: { <kỹ năng>: [số câu, đúng ngay, lần xem gợi ý] } } }.
       Chỉ lưu TÊN KỸ NĂNG và con số, KHÔNG lưu nội dung câu hỏi hay đáp án;
       nằm trên máy này, giữ 30 ngày; phụ huynh tắt được (learn:dayk:off) và xoá được. Khoá riêng để learn:day (chỉ số câu) vẫn không chứa tên kỹ năng. */
    var DK = "learn:dayk", DKOFF = "learn:dayk:off";
    function detailOn() { return EP.backend.get(DKOFF) !== "1"; }
    function setDetail(on) { EP.backend.set(DKOFF, on ? "0" : "1"); if (!on) EP.backend.set(DK, "{}"); }
    function clearDetail() { EP.backend.set(DK, "{}"); }
    function dkLoad() { try { return JSON.parse(EP.backend.get(DK) || "{}") || {}; } catch (e) { return {}; } }
    function bumpDayK(subj, skill, ok, hint) {
      if (!detailOn()) return;
      try {
        var all = dkLoad(), k = dayKey(), d = all[k] || {}, m = d[subj] || {}, x = m[skill] || [0, 0, 0];
        if (hint) x[2]++; else { x[0]++; if (ok) x[1]++; }
        m[skill] = x; d[subj] = m; all[k] = d;
        var keys = Object.keys(all).sort(); while (keys.length > 30) delete all[keys.shift()];
        EP.backend.set(DK, JSON.stringify(all));
      } catch (x) {}
    }
    /* bé bấm 💡 ở câu của kỹ năng này (tính một lần cho mỗi câu) */
    function noteHint(subj, skill) { if (SK[skill] || TRACKED[skill]) bumpDayK(subj, skill, false, true); }
    /* n ngày gần nhất (cũ → mới): [{ date, dow, items: [{ subj, id, n, ok, h }] }], items xếp theo số câu giảm dần */
    function dayDetail(n) {
      var all = dkLoad(), out = [], now = new Date(), i;
      for (i = n - 1; i >= 0; i--) {
        var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), k = dayKey(d), items = [];
        Object.keys(all[k] || {}).forEach(function (sj) { Object.keys(all[k][sj]).forEach(function (id) { var x = all[k][sj][id]; items.push({ subj:
            sj, id: id, n: x[0], ok: x[1], h: x[2] }); }); });
        items.sort(function (a, b) { return b.n - a.n; });
        out.push({ date: k, dow: d.getDay(), items: items });
      }
      return out;
    }
    /* n ngày gần nhất (cũ → mới), ngày không học có n = 0 */
    function daily(n) {
      var all = {}; try { all = JSON.parse(EP.backend.get("learn:day") || "{}") || {}; } catch (x) {}
      var out = [], now = new Date();
      for (var i = n - 1; i >= 0; i--) { var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), k = dayKey(d), v = all[k] || { n: 0,
          ok: 0, s: {} }; out.push({ date: k, dow:
          d.getDay(), n: v.n, ok: v.ok, s: v.s }); }
      return out;
    }
    /* xoá toàn bộ tiến độ học của bé (giữ cài đặt giao diện) */
    function resetAll() { ["toan", "tviet", "tanh"].forEach(function (s) { EP.backend.set("learn:m:" + s, "{}"); }); EP.backend.set("learn:err",
        "{}"); EP.backend.set("learn:day", "{}");
        EP.backend.set(DK, "{}"); }
    /* opts = { kind: dạng câu ("mc", "pop", "typein"…), hint: true nếu bé đã xem gợi ý } → bằng chứng cho mức thành thạo 4 bậc */
    function record(subj, skill, ok, tag, opts) {
      if (!SK[skill] && !TRACKED[skill]) return null;
      var m = load(subj), s = m[skill] || { n: 0, ok: 0, p: 0, tags: {}, t: 0 }, v = ok ? 1 : 0;
      s.n++; if (ok) s.ok++; s.p = s.n === 1 ? v : .7 * s.p + .3 * v; s.t = Date.now();
      var dk = dayKey(); s.days = s.days || []; if (s.days.indexOf(dk) < 0) { s.days.push(dk); if (s.days.length > 8) s.days.shift(); }
      if (ok) { if (!(opts && opts.hint)) s.nh = (s.nh || 0) + 1; var kd = (opts && opts.kind) || "mc"; s.fm = s.fm || []; if (s.fm.indexOf(kd) < 0 &&
          s.fm.length < 8) s.fm.push(kd); }
      if (!ok) { var tg = TAGS.indexOf(tag) >= 0 ? tag : "other"; s.tags[tg] = (s.tags[tg] || 0) + 1; bumpErr(tg); }
      m[skill] = s; save(subj, m); bumpDay(subj, ok); bumpDayK(subj, skill, ok, false); return level(s);
    }

    /* ---- MỨC THÀNH THẠO 4 BẬC (0 = chưa học): 1 Hiểu · 2 Thực hiện · 3 Vận dụng · 4 Thành thạo ----
       1 Hiểu: đã làm đúng ít nhất 1 câu.  2 Thực hiện: >= 5 câu, độ chính xác gần đây >= 70%.
       3 Vận dụng: >= 8 câu, >= 80%, và đúng ở >= 2 DẠNG câu khác nhau (chọn, gõ số, bong bóng, nghe…): dùng được trong tình huống mới.
       4 Thành thạo: >= 12 câu, >= 90%, học ở >= 2 NGÀY khác nhau (nhớ lâu), và >= 6 câu đúng KHÔNG cần gợi ý.
       Các ngưỡng là cấu hình thử nghiệm (đúng tinh thần MASTER: không hard-code, không chỉ dựa tổng điểm). Dữ liệu cũ thiếu trường thì chỉ đạt tối đa bậc 2. */
    var M4 = { understand: { ok: 1 }, practice: { n: 5, p: .7 }, apply: { n: 8, p: .8, fm: 2 }, master: { n: 12, p: .9, days: 2, nh: 6, fm: 2 } };
    function mastery4(s) {
      if (!s || !s.n) return 0;
      var fm = (s.fm || []).length, d = (s.days || []).length, nh = s.nh || 0;
      if (s.n >= M4.master.n && s.p >= M4.master.p && d >= M4.master.days && nh >= M4.master.nh && fm >= M4.master.fm) return 4;
      if (s.n >= M4.apply.n && s.p >= M4.apply.p && fm >= M4.apply.fm) return 3;
      if (s.n >= M4.practice.n && s.p >= M4.practice.p) return 2;
      return (s.ok || 0) >= M4.understand.ok ? 1 : 0;
    }

  EP.use = function (b) { EP.backend = b; };
    EP.load = load; EP.save = save; EP.level = level; EP.dayKey = dayKey; EP.detailOn = detailOn; EP.setDetail = setDetail;
    EP.clearDetail = clearDetail; EP.noteHint = noteHint; EP.dayDetail = dayDetail; EP.daily = daily; EP.resetAll = resetAll; EP.record = record;
    EP.M4 = M4; EP.mastery4 = mastery4;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["progress"] = part;
})(typeof window !== "undefined" ? window : globalThis);
