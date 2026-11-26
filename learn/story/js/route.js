/* Đường đi của MỘT chủ đề: các điểm dừng, nối nhau thế nào, điểm nào xong / đang tới / chưa tới, bấm được hay không.
   Chỉ ĐỌC tiến độ từ LearnPath (dùng chung với lớp truyền thống): l = đã học, b = sao kiểm tra tốt nhất (>= 3 là qua). Không ghi gì.
   Hình đường: có học + có kiểm tra = có NGÃ RẼ (đường học: học bài → kiểm tra; đường thi: kiểm tra thẳng) rồi nhập lại ở Đích.
   Chủ đề không có kiểm tra (hoặc không có bài học) thì chỉ một đường thẳng, không ngã rẽ. Vị trí tính bằng % khung tranh (p = dọc, l = ngang). */
(function (root) {
  "use strict";
  var LAY = {
    p: { intro: [24, 62], fork: [50, 50], learn: [22, 37], test: [22, 22], exam: [78, 37], end: [50, 8] },
    l: { intro: [11, 54], fork: [35, 38], learn: [54, 22], test: [75, 22], exam: [58, 58], end: [89, 42] }
  };
  /* đường thẳng n điểm (bản đồ lớp dùng chung): dọc zigzag từ dưới lên, ngang zigzag từ trái sang */
  function chain(n, o) {
    var pts = [], i, t;
    for (i = 0; i < n; i++) { t = n > 1 ? i / (n - 1) : 0.5; pts.push(o === "p" ? [i % 2 ? 72 : 28, 60 - 51 * t] : [9 + 82 * t, i % 2 ? 28 : 52]); }
    return pts;
  }
  function info(P, subj, g, t) {
    var r = P.get(g, subj, t.id), hasL = P.hasLesson(t.id), hasT = P.hasTest(subj, g, t.id);
    return { r: r, hasL: hasL, hasT: hasT, unl: P.unlocked(subj, g, t.id), passed: r.b >= 3, learned: !!r.l, tried: r.t > 0 };
  }
  /* kind: intro fork learn test exam end. st: done | cur | off. tap: bấm được. stars: số sao hiện dưới điểm (0-5). */
  function build(P, subj, g, t, seenFlag, o) {
    var f = info(P, subj, g, t), seen = seenFlag || f.learned || f.tried || f.passed, full = f.hasL && f.hasT, kinds, edges, cur, N = {};
    if (full) { kinds = ["intro", "fork", "learn", "test", "exam", "end"]; edges = [["intro", "fork"], ["fork", "learn"], ["learn", "test"], ["test", "end"], ["fork", "exam"], ["exam", "end"]]; }
    else { kinds = ["intro"].concat(f.hasL ? ["learn"] : f.hasT ? ["test"] : [], ["end"]); edges = kinds.slice(1).map(function (k, i) { return [kinds[i], k]; }); }
    var single = full ? null : kinds[1] === "end" ? "end" : kinds[1];
    var done = {
      intro: seen, fork: f.learned || f.tried || f.passed, learn: f.learned, test: full ? f.passed && f.learned : f.passed, exam: f.passed && !f.learned,
      end: false
    };
    var endReached = full ? f.passed : f.hasL ? f.learned : f.hasT ? f.passed : seen;
    if (!seen) cur = "intro";
    else if (endReached) cur = "end";
    else if (full) cur = f.learned ? "test" : f.tried ? "exam" : "fork";
    else cur = single;
    if (!f.unl) cur = "";
    var pts = full ? LAY[o] : null, ch = full ? null : chain(kinds.length, o);
    kinds.forEach(function (k, i) {
      var st = k === cur ? "cur" : done[k] ? "done" : "off", tap = false;
      if (f.unl) {
        if (k === "intro" || k === cur || st === "done") tap = true;
        if (full && seen && (k === "learn" || k === "exam")) tap = true;
        if (full && k === "test" && f.learned) tap = true;
        if (k === "end" && endReached) tap = true;
        if (!full && seen && k === single) tap = true;
      }
      if (k === "end" && endReached) st = "cur";
      if (k === "end" && endReached) done.end = true;
      var onBranch = k === "test" ? (!full || f.learned) : k === "exam" ? !f.learned : true;
      N[k] = { id: k, kind: k, st: st, tap: tap, pos: pts ? pts[k] : ch[i], stars: (k === "test" || k === "exam") && onBranch && f.r.b > 0 ? f.r.b : 0, off: !onBranch && st === "off" };
    });
    if (f.unl && cur === "end") N.end.st = "cur";
    var E = edges.map(function (e) {
      var a = N[e[0]], b = N[e[1]], ad = a.st === "done" || (a.kind === "end"), bd = b.st === "done" || b.st === "cur";
      return { a: e[0], b: e[1], done: ad && bd && a.st !== "off" };
    });
    return { info: f, nodes: kinds.map(function (k) { return N[k]; }), by: N, edges: E, cur: cur, full: full };
  }
  /* trạng thái một chủ đề cho bản đồ lớp: done (đã qua) | cur (đang đi) | new | lock ; stars = sao kiểm tra */
  function topicState(P, subj, g, t) {
    var f = info(P, subj, g, t);
    return { lock: !f.unl, done: f.passed || (f.learned && !f.hasT), part: f.learned || f.tried, stars: f.r.b, learned: f.learned };
  }
  var api = { build: build, chain: chain, topicState: topicState, info: info, LAY: LAY };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.StoryRoute = api;
})(typeof window !== "undefined" ? window : globalThis);
