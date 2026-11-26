/* Cảnh KHÁM PHÁ (điểm "learn"): mở màn tên truyện, rồi đi hết các màn của lời dạy (learn/content/lessons/<chủ đề>.js, mảng screens) dưới dạng hoạt cảnh truyện.
   Xong thì LearnPath.markLearned + complete (như lớp truyền thống) rồi sang cảnh kết (end.js). Mỗi kiểu màn k có bộ dựng riêng trong SceneLearnKinds (kinds-learn-*.js). */
(function (root) {
  "use strict";
  var K = root.StoryCore, U = root.SceneU, X = root.SceneFx, S = root.SceneT, F = root.SceneFrame, R = root.SceneLearnKinds, P = K.P;
  var timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function load(id) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = "../content/lessons/" + encodeURIComponent(id) + ".js";
        window.addEventListener("lesson", function f() { window.removeEventListener("lesson", f); res(window.LearnLessons.cur); });
      s.onerror = function () { rej(new Error("no lesson")); }; document.head.appendChild(s);
    });
  }
  function banner(g, icon, title, line) {
    var b = U.el("div", "banner"), im = U.el("img", "bimg"); im.alt = ""; im.src = "art/stop-" + icon + ".svg"; im.onerror = function () { im.style.display = "none"; };
    b.appendChild(im); b.appendChild(U.txt("h2", "bt ct", title)); F.play.appendChild(b);
  }
  function run(g) {
    load(g.topic.id).then(function (L) {
      if (K.lang === "en" && root.LessonEN) L = root.LessonEN.apply(L);   /* giao diện English: dịch lời bài học (Tiếng Việt: chỉ lời hướng dẫn, giữ chữ/từ tiếng Việt; Tiếng Anh/Toán: lời giảng) — learn/content/lesson-en*.js */
      var scr = L.screens || [], i = -1;
      F.beads(scr.length); F.beadsTo(-1);
      function ctx(s) {
        var stage = U.el("div", "lstage k-" + s.k), ready = false; F.play.appendChild(stage);
        var c = {
          stage: stage, props: root.SceneProps,
          say: function (t, o) { F.say(t, o); },
          speak: function (t) { root.SceneVoice.say(t); },
          later: function (fn, ms) { timers.push(setTimeout(fn, ms)); },
          ready: function () { if (ready) return; ready = true; F.bead(i, "on"); F.next(true, advance); },
          good: function (node) { X.sfx("good"); if (node) { X.cls(node, "ok", 700); X.burst(node, 6); } F.emote("cheer"); },
          oops: function (t) { F.say(t || S.pick(S.OOPS), { emote: "think" }); },
          finish: function (msg, o) { if (o && o.good) c.good(o.good); if (msg) F.say(msg, { emote: "cheer" }); c.ready(); }
        };
        return c;
      }
      function show(k) {
        clearTimers(); i = k; F.clear(); F.beadsTo(i);
        if (i >= scr.length) return done();
        var s = scr[i], fn = R[s.k] || R.fallback, c = ctx(s); F.say(s.t || "", { emote: "happy" });
        try { fn(c, s); } catch (e) { console.error(e); c.say(s.t || ""); c.ready(); }
        X.sfx("step");
      }
      function advance() { show(i + 1); }
      function done() {
        clearTimers(); F.clear(); P.markLearned(g.grade, g.subj, g.topic.id); var rw = P.complete(g.grade, g.subj, g.topic.id);
        for (var k = 0; k < scr.length; k++) F.bead(k, "on"); root.SceneEnd.learn(g, rw);
      }
      /* màn mở: tên truyện + lời kể của điểm khám phá */
      var at = K.q.get("at");   /* ?at=N: xem thử thẳng màn thứ N (chỉ để duyệt) */
      if (at != null && /^\d+$/.test(at)) return show(Math.min(+at, scr.length - 1));
      F.clear(); banner(g, "learn", K.tx(g.story.title)); F.say(K.tx(g.story.learn), { emote: "happy" }); F.next(true, function () { show(0); });
    }).catch(function () { F.clear(); F.say(S.T.missing, { quiet: true }); F.next(true, function () { StoryNav.go(g.mapUrl); }, "map"); });
  }
  root.SceneLearn = { run: run };
})(window);
