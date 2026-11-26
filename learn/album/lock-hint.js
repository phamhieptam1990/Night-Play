/* GỢI Ý MỞ KHOÁ cho Bộ sưu tập (Học Vui): mỗi ô chưa mở phải nói RÕ cách mở, có tiến độ và đường đi tới đúng chỗ.
   - Bạn Số / Bạn Chữ lớp 1 (content/buddies.js): mở khi bé chào bạn trong BÀI LÀM QUEN tương ứng (LESSON dưới đây) -> nút tới bài.
   - Bạn Chữ mở rộng (content/buddies-ext.js, có need): mở theo SỐ VÒNG đã chơi (5 câu = 1 vòng, tính từ learn:m:*) -> nút tới trang học; sync() tự thêm vào album.
   - Huy hiệu chủ đề lớp 3–5 (content/badges-g35.js): mở khi qua kiểm tra chủ đề >= 3 sao -> nút tới Chương trình học đúng lớp, môn.
   API: LearnLock.buddy(sym) / .badge(t) -> { text, short, pct, href, cta }; .rounds(); .sync() -> danh sách bạn mới vừa mở. Cần album.js, path.js. */
(function (root) {
  "use strict";
  var LESSON = {};
  function reg(topic, title, syms) { syms.forEach(function (s) { LESSON[s] = { s: "toan", g: 1, topic: topic, title: title }; }); }
  reg("g1_ready_n05", "Số 0–5", ["0", "1", "2", "3", "4", "5"]); reg("g1_ready_n610", "Số 6–10", ["6", "7", "8", "9", "10"]);
  [["VI-G1-00", "chữ a, ă, â, o, ô, ơ", ["a", "ă", "â", "o", "ô", "ơ"]], ["VI-G1-00b", "chữ e, ê, i, u, ư", ["e", "ê", "i", "u", "ư"]],
    ["VI-G1-00c", "chữ b, c, d, đ, g, h", ["b", "c", "d", "đ", "g", "h"]],
    ["VI-G1-00d", "chữ hoa A, Ă, Â, B, C, D", ["A", "Ă", "Â", "B", "C", "D"]]].forEach(function (x) { reg(x[0], x[1], x[2]); LESSON[x[2][0]].s = "tviet";
      x[2].forEach(function (c) { LESSON[c].s = "tviet"; }); });
  function ls(k) { try { return root.localStorage.getItem(k); } catch (e) { return null; } }
  function questions() {
    var q = 0; ["toan", "tviet", "tanh"].forEach(function (s) { try { var m = JSON.parse(ls("learn:m:" + s) || "{}") || {}; Object.keys(m).forEach(function (k) { if (m[k]
      && m[k].n > 0) q += m[k].n; }); } catch (e) {} });
    return q;
  }
  function rounds() { return Math.floor(questions() / 5); }
  function grade() { var g = +ls("learn:grade"); return g >= 1 && g <= 5 ? g : 1; }
  function lang() { return ls("lang") === "en" ? "en" : "vi"; }
  function rec(g, s, t) { try { return root.LearnPath ? root.LearnPath.get(g, s, t) : { l: 0, b: 0 }; } catch (e) { return { l: 0, b: 0 }; } }
  function buddy(sym) {
    var d = (root.LEARN_BUDDIES || {})[sym], L = LESSON[sym];
    if (L) {
      var r = rec(L.g, L.s, L.topic), q = new URLSearchParams({ grade: L.g, subj: L.s, topic: L.topic, lang: lang() }).toString();
      return { text: "Học bài " + L.title + " rồi chạm vào bạn này trong bài để chào. " + (r.l ? "Bạn đã vào bài này, chạm đủ các bạn nhé." : "Bạn chưa học bài này."),
        short: "Học bài " + L.title, pct: r.l ? 50 : 0, href: "../lop/bai.html?" + q, cta: "📖 Học bài " + L.title };
    }
    if (d && d.need) {
      var n = rounds(), need = d.need;
      return { text: "Chơi " + need + " vòng (mỗi vòng 5 câu, môn nào cũng được) để gặp bạn này. Bạn đã chơi " + Math.min(n, need) + "/" + need + " vòng.",
        short: "Chơi " + need + " vòng · " + Math.min(n, need) + "/" + need, pct: Math.min(100, Math.round(n * 100 / need)), href: "../index.html?grade=" + grade()
          + "&subj=toan", cta: "🎮 Chơi một vòng" };
    }
    return { text: "Gặp bạn này trong bài học.", short: "Gặp trong bài học", pct: 0, href: "../lop/index.html", cta: "📖 Mở bài học" };
  }
  function badge(t) {
    var h = root.LearnBadges.topicHint(t);
    return { text: h.text, short: h.short, pct: t.got ? 100 : Math.round(t.b * 100 / 3), href: "../lop/index.html?grade=" + t.g + "&subj=" + t.s, cta: "📖 Mở "
      + root.LearnBadges.SN[t.s] + " lớp " + t.g };
  }
  function sync() {
    var X = root.LEARN_BUDDIES_EXT || {}, n = rounds(), fresh = [];
    if (root.Album) Object.keys(X).forEach(function (k) { if (X[k].need && n >= X[k].need && !root.Album.has(k) && root.Album.add(k)) fresh.push(k); });
    return fresh;
  }
  root.LearnLock = { buddy: buddy, badge: badge, rounds: rounds, sync: sync, LESSON: LESSON };
})(typeof window !== "undefined" ? window : globalThis);
