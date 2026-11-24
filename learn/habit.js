/* THÓI QUEN & NIỀM TIN HỌC (Học Vui): logic thuần, không chạm DOM, lưu trên máy ("learn:habit", không gửi ra ngoài).
   Dựa trên: (1) tư duy phát triển: khen NỖ LỰC và TIẾN BỘ SO VỚI CHÍNH BÉ, không khen "thông minh", không so với bé khác;
   (2) thói quen: cầu vồng tuần chỉ TĂNG, KHÔNG BAO GIỜ mất khi nghỉ (khác chuỗi ngày dễ gây lo âu); mốc quà theo TỔNG số ngày đã học;
   (3) ba mẹ: bản tin tuần gọn, có "câu nên khen" và "câu hỏi tối nay" để ba mẹ trò chuyện cùng bé.
   API: Habit.note(subj, correct, lang) → { prev, praise, week, total, gift }   (gọi MỘT lần khi hết vòng)
        Habit.week() → { days:[{dow,on,today}], count, total }
        Habit.report(lang) → bản tin tuần cho ba mẹ (cần LearnEngine + Farm đã nạp). */
(function (root) {
  "use strict";
  var KEY = "learn:habit";
  var GIFTS = [   /* mốc theo TỔNG số ngày đã học (không cần liên tiếp) */
    { at: 3, seeds: 1, vi: "Mở được 3 ngày học! Bác Rễ tặng 1 hạt giống 🌱", en: "3 learning days! You got a seed 🌱" },
    { at: 7, seeds: 2, vi: "7 ngày học rồi! Quà: 2 hạt giống 🌱🌱", en: "7 learning days! Gift: 2 seeds 🌱🌱" },
    { at: 14, seeds: 3, vi: "14 ngày học! Bé thật kiên trì, nhận 3 hạt giống 🌱", en: "14 learning days! So persistent: 3 seeds 🌱" },
    { at: 30, seeds: 5, vi: "30 ngày học! Siêu kiên trì, nhận 5 hạt giống 🌟", en: "30 learning days! Super persistent: 5 seeds 🌟" }
  ];
  function pad(n) { return ("0" + n).slice(-2); }
  function key(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function rd() { try { return JSON.parse(root.localStorage.getItem(KEY) || "null") || {}; } catch (e) { return {}; } }
  function wr(o) { try { root.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function load() { var h = rd(); h.days = h.days || []; h.claimed = h.claimed || []; h.last = h.last || {}; h.total = h.total || 0; return h; }

  /* Tuần này (thứ Hai → Chủ nhật): ô nào bé có học thì sáng màu. Ngày chưa tới / ngày nghỉ chỉ là ô trống, không phạt. */
  function week() {
    var h = load(), now = new Date(), dow = (now.getDay() + 6) % 7, out = [], i, set = {}, n = 0;
    h.days.forEach(function (d) { set[d] = 1; });
    for (i = 0; i < 7; i++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dow + i), on = !!set[key(d)];
      if (on) n++; out.push({ dow: d.getDay(), on: on, today: i === dow, future: i > dow });
    }
    return { days: out, count: n, total: h.total };
  }

  /* lời khen: nỗ lực + tiến bộ so với CHÍNH BÉ. prev = số câu đúng lần trước (cùng môn) hoặc null. */
  function praise(correct, prev, lang) {
    var vi = lang !== "en";
    if (prev != null && correct > prev) return vi ? "Đúng " + prev + " → " + correct + " câu. Bé tiến bộ rồi!" : "" + prev + " → " + correct + " right. You improved!";
    if (correct >= 5) return vi ? "Đúng hết! Bé luyện chăm nên giỏi lên." : "All correct! Your practice is paying off.";
    if (correct >= 3) return vi ? "Bé làm tốt lắm. Luyện thêm là vững ngay!" : "Well done. A few left to practise and you'll have it!";
    return vi ? "Câu khó giúp não bé lớn lên. Bé không bỏ cuộc là giỏi rồi!" : "Hard questions make your brain grow. You didn't give up, and that's great! Try again.";
  }

  /* gọi MỘT lần khi hết vòng (trước Farm.recordRound). Ghi ngày học, tổng ngày, quà mốc; trả về thứ để hiển thị. */
  function note(subj, correct, lang) {
    var h = load(), today = key(new Date()), prev = h.last[subj] == null ? null : h.last[subj], gift = null;
    if (h.days.indexOf(today) < 0) {
      h.days.push(today); h.total++; if (h.days.length > 70) h.days.shift();
      GIFTS.forEach(function (g) { if (!gift && h.total >= g.at && h.claimed.indexOf(g.at) < 0) { h.claimed.push(g.at); gift = g; } });
      if (gift && root.Farm) { try { root.Farm.addSeeds(gift.seeds); } catch (e) {} }
    }
    h.last[subj] = correct; wr(h);
    var w = week();
    return { prev: prev, praise: praise(correct, prev, lang), week: w, total: h.total, gift: gift ? (lang === "en" ? gift.en : gift.vi) : "" };
  }

  /* ---- bản tin tuần cho ba mẹ ---- */
  function report(lang) {
    var vi = lang !== "en", E = root.LearnEngine, out = { lines: [], praise: "", ask: "" };
    if (!E) return out;
    var d = E.daily(14), thisW = d.slice(7), lastW = d.slice(0, 7), sum = function (a, k) { return a.reduce(function (s, x) { return s + (x[k] || 0); }, 0); };
    var n1 = sum(thisW, "n"), o1 = sum(thisW, "ok"), n0 = sum(lastW, "n"), o0 = sum(lastW, "ok"), days = thisW.filter(function (x) { return x.n > 0; }).length;
    var a1 = n1 ? Math.round(o1 * 100 / n1) : 0, a0 = n0 ? Math.round(o0 * 100 / n0) : 0;
    out.n = n1; out.days = days; out.acc = a1;
    if (!n1) {
      out.lines.push(vi ? "Tuần này bé chưa học. Không sao, chỉ cần 5 phút mỗi ngày là đủ vui và đủ nhớ." : "No learning this week yet. Just 5 minutes a day is enough.");
      out.ask = vi ? "Tối nay ba mẹ rủ bé chơi một vòng 5 câu cùng nhau nhé?" : "Tonight, try one 5-question round together!";
      return out;
    }
    out.lines.push(vi ? "Bé học " + days + "/7 ngày, làm " + n1 + " câu, đúng " + a1 + "%." : "Learned " + days + "/7 days, " + n1 + " questions, " + a1 + "% correct.");
    if (n0 >= 5) out.lines.push(a1 > a0 ? (vi ? "Tăng " + (a1 - a0) + " điểm % so với tuần trước. Bé đang tiến bộ!" : "Up " + (a1 - a0) + " points vs last week. Improving!") : a1 === a0 ? (vi ? "Giữ vững phong độ so với tuần trước." : "Steady versus last week.") : (vi ? "Hơi giảm so với tuần trước, thường do bé đang thử câu khó hơn. Đừng lo." : "Slightly lower, often because harder questions were tried. No worry."));
    /* kỹ năng mới vững (bậc ≥ 3) và kỹ năng cần luyện thêm */
    var best = null, weak = null, cur = root.LEARN_CURRICULUM, nm = function (id) { try { return (root.PARENT_COPY || {}).SKILL[id][vi ? 0 : 1]; } catch (e) { return ""; } };
    ["toan", "tviet", "tanh"].forEach(function (s) {
      E.summary(s).skills.forEach(function (k) {
        if (k.n >= 3 && (k.m4 || 0) >= 3 && (!best || (k.m4 || 0) > best.m4 || ((k.m4 || 0) === best.m4 && k.n > best.n))) best = k;
        if (k.n >= 3 && (k.level === "emerging" || k.level === "developing") && (!weak || k.p < weak.p)) weak = k;
      });
    });
    var bn = best && nm(best.id), wn = weak && nm(weak.id);
    if (bn) { out.lines.push(vi ? "Đang vững: " + bn + "." : "Strong: " + bn + "."); out.praise = vi ? "Con giỏi phần \"" + bn + "\" quá! Mẹ/ba thấy con đã luyện rất chăm." : "You're great at \"" + bn + "\"! I can see how hard you practised."; }
    else out.praise = vi ? "Ba mẹ thấy con chịu khó học mỗi ngày, ba mẹ tự hào về con!" : "I'm proud of how you keep learning every day!";
    if (wn) { out.lines.push(vi ? "Nên luyện thêm: " + wn + " (chơi vài câu mỗi ngày là vững)." : "Needs practice: " + wn + " (a few questions a day)."); out.ask = vi ? "Hỏi bé: \"Con kể ba mẹ nghe phần \"" + wn + "\" làm thế nào nhé?\" (bé giảng lại là cách nhớ lâu nhất)" : "Ask: \"Can you teach me how \"" + wn + "\" works?\" (teaching back helps memory most)"; }
    else out.ask = vi ? "Hỏi bé: \"Hôm nay con học được điều gì vui nhất?\"" : "Ask: \"What was the most fun thing you learned today?\"";
    return out;
  }

  var H = { note: note, week: week, praise: praise, report: report, GIFTS: GIFTS, _key: key };
  if (typeof module !== "undefined" && module.exports) module.exports = H; else root.Habit = H;
})(typeof window !== "undefined" ? window : globalThis);
