/* GIAO DIỆN mục "Kỷ lục" và "Huy hiệu" trên trang Của bé, chỉ cho bé lớp 3–5 (lớp 1–2 giữ màn của bé). Giọng ngắn gọn, không trẻ con; chỉ so với chính mình.
   Cần: records.js (LearnRecords), badges.js (LearnBadges), path.js (LearnPath.get), content/badges-g35.js. MeRecords.on(lang, grade) -> có hiện không;
   MeRecords.render({ lang, grade, E }) vẽ vào #s-rec (#recBody) và #s-badge (#badgeBody). Chưa có tiếng Anh: lang "en" thì ẩn hai mục. */
(function (root) {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var SN = { toan: "Toán", tviet: "Tiếng Việt", tanh: "Tiếng Anh" }, ZIC = { toan: "🔢", tviet: "📖", tanh: "🔤" }, SUBJ = ["toan", "tviet", "tanh"];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function on(lang, grade) { return lang !== "en" && grade >= 3 && !!root.LearnRecords && !!root.LearnBadges; }
  function dm(k) { var m = /^\d{4}-(\d\d)-(\d\d)$/.exec(k || ""); return m ? +m[2] + "/" + +m[1] : ""; }
  function fmtDelta(d, unit) { return d > 0 ? "+" + d + unit : d < 0 ? "−" + Math.abs(d) + unit : "bằng nhau"; }
  /* ---- kỷ lục ---- */
  function recTiles(R, today) {
    var rows = [
      ["🔥", "ds", "ngày học liền dài nhất", " ngày", "Học thêm một ngày để phá kỷ lục"],
      ["🎯", "bq", "câu nhiều nhất trong một ngày", " câu", "Một ngày chăm hơn là đủ"],
      ["✅", "ba", "tỉ lệ đúng cao nhất trong một ngày", "%", "Cần ít nhất 10 câu trong ngày"],
      ["📅", "bw", "ngày học nhiều nhất trong một tuần", " ngày", "Thử học nhiều ngày hơn tuần này"],
      ["⚡", "cs", "câu đúng liên tiếp dài nhất", " câu", ""]
    ];
    return rows.filter(function (r) { return r[1] !== "cs" || (R.cs && R.cs.v > 0); }).map(function (r) {
      var c = R[r[1]], v = c ? c.v : 0, fresh = c && c.d === today;
      return '<div class="rt' + (v ? "" : " empty") + '"><i aria-hidden="true">' + r[0] + "</i><b>" + (v ? v + '<small>' + r[3] + "</small>" : "—") + "</b><span>" + r[2] + "</span><em>"
        + (v ? (fresh ? "Kỷ lục mới hôm nay!" : c.d ? "Đặt ngày " + dm(c.d) : "Mốc hiện tại của bạn") : r[4]) + "</em></div>";
    }).join("");
  }
  function cmpRow(label, a, b, unit, inv) {
    var mx = Math.max(a, b, 1), d = a - b, txt;
    if (!b && !a) txt = "Chưa có số liệu"; else if (!b) txt = "Tuần trước chưa có số liệu"; else txt = fmtDelta(d, unit) + " so với tuần trước";
    return '<div class="cr"><div class="ct"><b>' + label + '</b><span class="' + (d > 0 ? "up" : d < 0 ? "dn" : "") + '">' + txt + '</span></div>'
      + '<div class="cb"><span>Tuần này</span><div><i class="a" style="width:' + Math.round(a / mx * 100) + '%"></i></div><u>' + a + unit + '</u></div>'
      + '<div class="cb"><span>Tuần trước</span><div><i class="p" style="width:' + Math.round(b / mx * 100) + '%"></i></div><u>' + b + unit + "</u></div></div>";
  }
  function compare(C) {
    var a = C.cur, b = C.prev, days = ["", "Thứ Hai", "đến Thứ Ba", "đến Thứ Tư", "đến Thứ Năm", "đến Thứ Sáu", "đến Thứ Bảy", "đến Chủ nhật"];
    var h = '<div class="cmp"><h3>Tuần này so với tuần trước</h3><p class="cn">Tính cùng số ngày (' + (C.upto === 1 ? "chỉ Thứ Hai" : "Thứ Hai " + days[C.upto])
      + "), nên không bị thiệt khi tuần chưa hết.</p>";
    h += cmpRow("Số câu đã làm", a.n, b.n, " câu") + cmpRow("Số ngày học", a.days, b.days, " ngày");
    if (a.n >= 5 && b.n >= 5) h += cmpRow("Tỉ lệ đúng", a.acc, b.acc, "%");
    var msg = !a.n && !b.n ? "Chưa có số liệu hai tuần này. Làm vài vòng là có ngay."
      : a.n > b.n ? "Tuần này bạn đang làm nhiều hơn tuần trước. Giữ nhịp nhé." : a.n === b.n ? "Hai tuần đang ngang nhau. Thêm một vòng là vượt." : "Còn " + (b.n - a.n)
        + " câu nữa là bằng tuần trước, vẫn kịp.";
    return h + '<p class="cm">' + msg + "</p></div>";
  }
  function subjects(W, grade, E) {
    var cur = root.LEARN_CURRICULUM, h = '<div class="sbj"><h3>Tiến bộ theo môn</h3><p class="cn">Số câu mỗi tuần trong 4 tuần gần nhất (cũ đến mới, cột cuối là tuần này).</p>';
    SUBJ.forEach(function (s) {
      var arr = W[s], mx = Math.max.apply(null, arr.concat([5])), g = null, pct = 0;
      try { g = E && cur ? E.goals(s, grade, cur) : null; } catch (e) { g = null; }
      if (g && g.total) pct = Math.round(g.solid * 100 / g.total);
      var cols = arr.map(function (v, i) { return '<div class="sc' + (i === 3 ? " now" : "") + '"><span>' + (v || "") + '</span><i style="height:' + (v ? Math.max(8,
        Math.round(v / mx * 100)) : 4) + '%"></i></div>'; }).join("");
      var note = arr[3] ? "Tuần này: " + arr[3] + " câu" : "Tuần này chưa có câu nào";
      h += '<div class="sr" data-s="' + s + '"><div class="sh"><span aria-hidden="true">' + ZIC[s] + "</span><b>" + SN[s] + '</b><em>' + note
        + '</em></div><div class="sw"><div class="sch" role="img" aria-label="Số câu 4 tuần: ' + arr.join(", ") + '">' + cols
        + '</div><div class="sm"><div class="bar2"><i style="width:' + pct + '%"></i></div><span>Lớp ' + grade + ": " + pct + "% kỹ năng vững" + (g && g.total ? " (" + g.solid
          + "/" + g.total + ")" : "") + "</span></div></div></div>";
    });
    return h + "</div>";
  }
  /* ---- huy hiệu ---- */
  function getRec() { return root.LearnPath ? root.LearnPath.get.apply(root.LearnPath, arguments) : { b: 0, l: 0 }; }
  function nextRows(list) {
    return LearnBadges.next(list).map(function (m) {
      var left = m.need - m.raw, pct = Math.min(100, Math.round(m.raw * 100 / m.need));
      return '<div class="nx"><span class="ni" aria-hidden="true">' + m.ic + '</span><div class="nt"><b>' + m.name + "</b><span>Còn " + left + " nữa (đang " + m.raw + "/"
        + m.need + ')</span><div class="bar2"><i style="width:' + pct + '%"></i></div></div></div>';
    }).join("");
  }
  function badgeGrid(tp, grade) {
    var mine = tp.filter(function (t) { return t.g === grade; }), got = mine.filter(function (t) { return t.got; }).length;
    var h = '<h3 class="bh">Huy hiệu chủ đề lớp ' + grade + '<small>' + got + "/" + mine.length + "</small></h3>";
    h += '<div class="bg">' + mine.map(function (t) {
      var hint = LearnBadges.topicHint(t);
      return '<div class="bc' + (t.got ? " got" : "") + '" data-s="' + t.s + '" title="' + esc(hint.text) + '"><span class="bi" aria-hidden="true">' + (t.got ? t.ic : "🔒")
        + "</span><b>" + esc(t.name) + "</b><span class=\"bs\">" + esc(t.got ? SN[t.s] : hint.short) + "</span></div>";
    }).join("") + "</div>";
    return h;
  }
  function render(o) {
    var secs = ["s-rec", "s-badge"], show = on(o.lang, o.grade);
    secs.forEach(function (id) { var e = $(id); if (e) e.hidden = !show; });
    if (!show || !$("recBody")) return;
    var LR = root.LearnRecords, R = LR.update(), today = LR.dkey(new Date()), st = LR.stats();
    $("h-rec").textContent = "Kỷ lục của bạn"; $("h-badge").textContent = "Huy hiệu lớp " + o.grade;
    $("recBody").innerHTML = '<p class="note">Chỉ so với chính bạn: không có bảng xếp hạng, không so với ai khác.</p><div class="rts">' + recTiles(R, today) + "</div>"
      + compare(LR.compare()) + subjects(LR.subjWeeks(), o.grade, o.E);
    var ms = LearnBadges.milestones(st), tp = LearnBadges.topics(getRec, null), earned = ms.filter(function (m) { return m.got; }), tg = tp.filter(function (t) { return t.got; }).length;
    var total = ms.length + tp.length, have = earned.length + tg;
    $("badgeBody").innerHTML = '<p class="note">Đã đạt ' + have + "/" + total + " huy hiệu (gồm mốc chăm chỉ và huy hiệu chủ đề lớp 3–5). Mỗi mốc đều ghi rõ còn bao nhiêu nữa.</p>"
      + '<h3 class="bh">Chặng tiếp theo</h3><div class="nxs">' + (nextRows(ms) || '<p class="note">Bạn đã đạt mọi mốc hiện có.</p>') + "</div>" + badgeGrid(tp, o.grade)
      + (earned.length ? '<h3 class="bh">Mốc đã đạt<small>' + earned.length + '</small></h3><div class="chips">'
        + earned.map(function (m) { return '<span class="chip3"><i aria-hidden="true">' + m.ic + "</i>" + m.name + "</span>"; }).join("") + "</div>" : "")
      + '<div class="acts"><a class="go" href="../album/index.html">📖 Xem cả bộ sưu tập</a></div>';
  }
  root.MeRecords = { on: on, render: render };
})(window);
