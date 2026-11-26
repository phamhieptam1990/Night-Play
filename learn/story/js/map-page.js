/* Trang bản đồ MỘT chủ đề (map.html?grade&subj&topic): vẽ đường đi, đặt linh vật ở điểm đang làm, hiện lời kể và nút việc cần làm.
   Điểm "Khám phá" và "Thử thách" mở cảnh truyện scene.html (learn/story/scene/). */
(function () {
  "use strict";
  var K = StoryCore, P = K.P, R = StoryRoute, SG = StoryStage, T = K.T, q = K.q;
  var $ = function (id) { return document.getElementById(id); };
  var grade = +q.get("grade"), subj = q.get("subj"), tid = q.get("topic") || "";
  var topics = (grade >= 1 && grade <= 5 && K.MAS[subj]) ? P.topics(subj, grade) : [], ti = -1;
  topics.forEach(function (t, i) { if (t.id === tid) ti = i; });
  if (ti < 0) { StoryNav.go("index.html" + (K.MAS[subj] && grade >= 1 && grade <= 5 ? "?" + new URLSearchParams({ grade: grade, subj: subj }) : ""), { replace: true }); return; }
  K.setGS(grade, subj); K.color(subj); K.clearFlag();
  var topic = topics[ti], story, route, orient, comp, panel, sel = "";
  $("back").href = K.pickUrl(grade, subj);
  var hasNext = ti + 1 < topics.length;

  function nodeLabel(k) { return StoryDefault.labelOf(story.nodes, k, K.lang); }
  function text(k) { return K.tx(story[k === "exam" ? "test" : k]); }
  function go(url) { StoryNav.go(url); }   /* cảnh khám phá / thử thách nằm ngay trong Lớp truyện (scene.html), không còn sang trang bài học / kiểm tra cũ */
  function toMap() { StoryNav.go(K.pickUrl(grade, subj)); }
  var A = {
    learn: function () { return { label: topic.ready ? T.goPlay : T.goLearn, icon: "step", go: function () { go(K.learnUrl(grade, subj, tid)); } }; },
    test: function (alt) { return { label: T.goTest, icon: "flag", alt: alt, go: function () { go(K.testUrl(grade, subj, tid)); } }; },
    exam: function () { return { label: T.goExam, icon: "bolt", go: function () { go(K.testUrl(grade, subj, tid)); } }; }
  };
  /* nội dung bảng theo điểm đang chọn */
  function show(n) {
    sel = n.kind; var f = route.info, acts = [], tx = text(n.kind), title = K.tx(story.title);
    if (!f.unl) { panel.set({ title: title, text: T.locked, pic: "stop-lock", acts: [{ label: T.goHome, icon: "map", go: toMap }] }); return; }
    if (n.tap || n.st === "cur") {
      if (n.kind === "intro") { if (!K.seen(tid)) acts.push({ label: T.goStart, icon: "sail", go: start }); }
      else if (n.kind === "fork") { acts.push(A.learn(), A.exam()); acts[0].label = T.pathLearn; acts[1].label = T.pathExam; }
      else if (n.kind === "learn") acts.push(A.learn());
      else if (n.kind === "test") acts.push(A.test());
      else if (n.kind === "exam") {
        acts.push(f.tried && !f.passed ? { label: T.goRetry, icon: "retry", go: A.exam().go } : A.exam());
        if (f.tried && !f.passed && f.hasL && !f.learned) { tx = T.retry; acts.push(Object.assign(A.learn(), { alt: true })); }
      } else if (n.kind === "end") {
        if (hasNext) acts.push({ label: T.goNext, icon: "next", go: function () { StoryNav.go(K.mapUrl(grade, subj, topics[ti + 1].id)); } });
        acts.push({ label: T.goHome, icon: "map", alt: hasNext, go: toMap });
      }
      if (n.kind === "test" && f.tried && !f.passed) { acts[0] = { label: T.goRetry, icon: "retry", go: A.test().go }; }
    } else tx = T.notYet;
    panel.set({ title: nodeLabel(n.kind), text: tx, pic: "stop-" + (n.kind === "exam" ? "test" : n.kind), acts: acts });
    return acts;
  }
  function start() {
    K.markSeen(tid); sel = ""; draw(false); comp.emote("cheer");
  }
  function pt(n) { return n.pos; }
  /* vẽ lại cả bản đồ (đổi hướng màn / sau khi em xong một điểm) */
  function draw(first) {
    var stage = $("stage"); orient = SG.fit(stage, $("area")); route = R.build(P, subj, grade, topic, K.seen(tid), orient);
    var oldPal = comp, keep = oldPal ? stage.querySelector(".pal") : null; stage.innerHTML = "";
    SG.bg(stage, subj, grade, orient);
    SG.paths(stage, route.edges.map(function (e) { return { a: route.by[e.a].pos, b: route.by[e.b].pos, done: e.done }; }), orient);
    route.nodes.forEach(function (n) {
      SG.node(stage, { id: n.id, kind: n.kind, pos: n.pos, st: n.st, off: n.off, stars: n.stars, label: nodeLabel(n.kind), say: text(n.kind), sp: n.sp, icon: "stop-" + (n.kind === "exam" ? "test" : n.kind),
        lock: !route.info.unl && n.kind !== "intro" }, function () {
        var acts = show(n); if (comp && n.tap) comp.emote("happy");
        /* BÉ CHẠM NODE = VÀO LUÔN khi điểm đó chỉ có MỘT việc để làm (khởi hành / học / thử thách / kiểm tra); điểm cần chọn (hai hướng, kết thúc) vẫn giữ nút */
        if (n.tap && acts && acts.length === 1 && /^(intro|learn|test|exam)$/.test(n.kind)) setTimeout(function () { acts[0].go(); }, 250);
      });
    });
    var curN = route.by[route.cur] || route.by.intro;
    if (keep) { stage.appendChild(keep); comp.to(pt(curN), false, curN.cs); } else {
      comp = SG.companion(stage, subj, grade); var from = route.by[K.at(tid)] || curN;
      comp.to(pt(from), true, from.cs); if (from !== curN) setTimeout(function () { comp.to(pt(curN), false, curN.cs); }, 600);
    }
    K.setAt(tid, curN.id);
    if (first || !sel) show(curN); else show(route.by[sel] || curN);
  }
  function boot() {
    story = K.storyFor(topic); document.title = T.title + " · " + K.tx(story.title); $("ttl").textContent = K.tx(story.title);
    if (window.StoryGate && StoryGate.need()) StoryGate.show({ title: K.tx(story.title), back: K.pickUrl(grade, subj) });   /* trang bật loa dùng chung, một lần mỗi phiên */
    panel = StoryPanel.mount($("panel")); draw(true);
    var ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(function () { if (SG.orient($("area")) !== orient) draw(false); else SG.fit($("stage"), $("area")); }) : null;
    if (ro) ro.observe($("area")); else window.addEventListener("resize", function () { draw(false); });
    window.addEventListener("pageshow", function (e) { if (e.persisted) draw(false); });
  }
  K.loadData(subj, grade).then(boot);
})();
