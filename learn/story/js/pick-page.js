/* Trang chọn của Lớp truyện (index.html?grade&subj): chọn môn + lớp, rồi bản đồ lớp dạng các ĐẢO (mỗi chủ đề một đảo).
   Bé chạm đảo → xem lời mở đầu → "Đi" vào bản đồ chủ đề (map.html). Đảo chưa tới thì mờ + khoá; linh vật đứng ở đảo bé cần đi tiếp. */
(function () {
  "use strict";
  var K = StoryCore, P = K.P, R = StoryRoute, SG = StoryStage, T = K.T, E = SG.el;
  var $ = function (id) { return document.getElementById(id); };
  var grade = K.grade, subj = K.subj, comp, panel, orient, sel = -1, topics = [];
  $("back").href = "../lop/index.html?" + new URLSearchParams({ grade: grade, subj: subj, lang: K.lang });
  K.clearFlag();
  function tiles() {
    var s = $("subjs"), g = $("grades"); s.innerHTML = ""; g.innerHTML = "";
    K.SUBJ.forEach(function (id) {
      var b = E("button", "tile", '<img src="' + K.face(id, grade) + '" alt=""><span>' + K.esc(K.MAS[id].name[K.vi ? 0 : 1]) + "</span>"); b.type = "button";
      b.style.setProperty("--tk", K.MAS[id].c[0]); b.setAttribute("aria-pressed", String(id === subj)); b.onclick = function () { change(grade, id); }; s.appendChild(b);
    });
    var pb = $("pkb"); pb.innerHTML = '<img src="' + K.face(subj, grade) + '" alt=""><b>' + K.esc(T.grade) + " " + grade + '</b><i aria-hidden="true"></i>';
    pb.setAttribute("aria-label", K.MAS[subj].name[K.vi ? 0 : 1] + ", " + T.grade + " " + grade); pb.style.setProperty("--tk", K.MAS[subj].c[0]);
    for (var i = 1; i <= 5; i++) (function (n) {
      var b = E("button", "chip", String(n)); b.type = "button"; b.setAttribute("aria-label", T.grade + " " + n); b.setAttribute("aria-pressed", String(n === grade));
      b.onclick = function () { change(n, subj); }; g.appendChild(b);
    })(i);
  }
  function pk(on) { $("pkp").hidden = !on; $("pkb").setAttribute("aria-expanded", String(on)); }
  $("pkb").onclick = function (e) { e.stopPropagation(); pk($("pkp").hidden); };
  document.addEventListener("click", function (e) { if (!$("pkp").hidden && !$("pkp").contains(e.target)) pk(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") pk(false); });
  function change(g, s) {
    pk(false); if (g === grade && s === subj) return; grade = g; subj = s; K.setGS(g, s); sel = -1;
    try { history.replaceState(null, "", K.pickUrl(g, s)); } catch (e) {}
    $("back").href = "../lop/index.html?" + new URLSearchParams({ grade: g, subj: s, lang: K.lang }); load();
  }
  function next() { var n = P.next(subj, grade); return n ? n.index : 0; }
  function show(i) {
    sel = i; var t = topics[i], st = R.topicState(P, subj, grade, t), story = K.storyFor(t), acts = [];
    if (!st.lock) acts.push({ label: T.goStart, icon: "sail", go: function () { location.href = K.mapUrl(grade, subj, t.id); } });
    panel.set({ title: K.tx(story.title), text: st.lock ? T.locked : K.tx(story.intro), acts: acts,
      pic: st.lock ? "stop-lock" : st.done ? "stop-end" : st.part ? "stop-learn" : "stop-intro" });
    $("stage").querySelectorAll(".nd").forEach(function (b, k) { b.classList.toggle("sel", k === i); });
  }
  function draw() {
    var stage = $("stage"), pts, st; orient = SG.fit(stage, $("area")); stage.innerHTML = ""; K.color(subj);
    SG.bg(stage, subj, grade, orient); pts = R.chain(topics.length, orient);
    SG.paths(stage, topics.slice(1).map(function (t, i) { return { a: pts[i], b: pts[i + 1], done: R.topicState(P, subj, grade, topics[i]).done }; }), orient);
    topics.forEach(function (t, i) {
      st = R.topicState(P, subj, grade, t);
      var d = { id: t.id, kind: "island", pos: pts[i], st: st.done ? "done" : st.lock ? "off" : "cur", label: (window.LearnStories && LearnStories[t.id] && K.tx(LearnStories[t.id].title)) || t.name,
        icon: st.done ? "stop-end" : st.part ? "stop-learn" : "stop-intro",
        lock: st.lock, stars: st.stars, num: String(i + 1), noStar: true };
      SG.node(stage, d, function () { show(i); if (comp) comp.to(pts[i], false); });
    });
    var at = sel >= 0 ? sel : next();
    comp = SG.companion(stage, subj, grade); comp.to(pts[at], true); show(at);
  }
  function load() { tiles(); K.color(subj); K.loadData(subj, grade).then(function () { topics = P.topics(subj, grade); draw(); }); }
  panel = StoryPanel.mount($("panel"));
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(function () { if (topics.length) { if (SG.orient($("area")) !== orient) draw(); else SG.fit($("stage"), $("area")); } }).observe($("area"));
  window.addEventListener("pageshow", function (e) { if (e.persisted && topics.length) draw(); });
  load();
})();
