/* Cảnh truyện: khởi động. scene.html?grade&subj&topic&step=learn|test (&lang). Chọn cảnh khám phá hoặc thử thách; sai tham số / chủ đề chưa mở thì về bản đồ truyện. */
(function () {
  "use strict";
  var K = StoryCore, P = K.P, q = K.q, grade = +q.get("grade"), subj = q.get("subj"), tid = q.get("topic") || "", step = q.get("step") === "test" ? "test" : "learn";
  var topics = (grade >= 1 && grade <= 5 && K.MAS[subj]) ? P.topics(subj, grade) : [], ti = -1;
  topics.forEach(function (t, i) { if (t.id === tid) ti = i; });
  if (ti < 0) { location.replace("index.html" + (K.MAS[subj] && grade >= 1 && grade <= 5 ? "?" + new URLSearchParams({ grade: grade, subj: subj }) : "")); return; }
  K.setGS(grade, subj); K.color(subj);
  var topic = topics[ti], mapUrl = K.mapUrl(grade, subj, tid);
  if (!P.unlocked(subj, grade, tid)) { location.replace(mapUrl); return; }
  var u = function (s) { return "scene.html?" + new URLSearchParams({ grade: grade, subj: subj, topic: tid, step: s, lang: K.lang }).toString(); };
  var hasL = P.hasLesson(tid), hasT = P.hasTest(subj, grade, tid);
  if (step === "learn" && !hasL) step = "test";
  if (step === "test" && !hasT) { if (hasL) step = "learn"; else { location.replace(mapUrl); return; } }
  var nextUrl = ti + 1 < topics.length ? K.mapUrl(grade, subj, topics[ti + 1].id) : "";
  K.loadData(subj, grade).then(function () {
    var story = K.storyFor(topic), g = { grade: grade, subj: subj, topic: topic, story: story, mapUrl: mapUrl, learnUrl: u("learn"), testUrl: u("test"), nextUrl: nextUrl, hasL: hasL, hasT: hasT, step: step };
    document.title = K.tx(story.title); SceneFrame.init({ back: mapUrl });
    if (window.StorySfx && StorySfx.ambient) { try { StorySfx.ambient(subj); } catch (e) {} }
    if (step === "learn") SceneLearn.run(g); else SceneTest.run(g);
  });
})();
