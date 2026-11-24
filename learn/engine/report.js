/* Bộ máy học — Tóm tắt cho phụ huynh, mục tiêu đạt được theo lớp, xuất theo lược đồ câu hỏi.
   Một phần của learn/engine.js (nạp theo thứ tự trong trình duyệt, require trong Node); phần này dùng đối tượng chung EP. */
(function (root) {
  "use strict";
  function part(EP) {
    var G = EP.G, SK = EP.SK, TRACKED = EP.TRACKED, level = EP.level, load = EP.load, mastery4 = EP.mastery4, topicOf = EP.topicOf;

    /* ---- tóm tắt cho phụ huynh / báo cáo ---- */
    function summary(subj) {
      var m = load(subj), out = [];
      Object.keys(SK).forEach(function (id) { if (SK[id].subj !== subj) return; var s = m[id]; out.push({ id: id, level: level(s), m4: mastery4(s), n:
          s ? s.n : 0, p: s ? Math.round(
          s.p * 100) / 100 : 0, tags: s ? s.tags : {}, t: s ? s.t || 0 : 0 }); });
      Object.keys(TRACKED).forEach(function (id) { if (TRACKED[id].subj !== subj || !m[id]) return; var s = m[id]; out.push({ id: id, level: level(s),
          m4: mastery4(s), n: s.n, p: Math.round(
          s.p * 100) / 100, tags: s.tags, t: s.t || 0 }); });
      var weak = out.filter(function (x) { return x.n > 0 && (x.level === "emerging" || x.level === "developing"); }).sort(function (a, b) { return a.p - b.p; });
      var tags = {}; try { tags = JSON.parse(EP.backend.get("learn:err") || "{}"); } catch (e) {}
      return { skills: out, weakest: weak.map(function (x) { return x.id; }), tags: tags };
    }

    /* ---- MỤC TIÊU ĐẠT ĐƯỢC theo lớp: nối cây chương trình (cur = window.LEARN_CURRICULUM) với kỹ năng bé đã luyện ----
       Mỗi chủ đề của lớp gồm các kỹ năng của lớp đó; "vững" = khá vững hoặc thành thạo. Chủ đề chưa có kỹ năng nào → total 0 (giao diện ghi "sắp có bài luyện"). */
    function goals(subj, grade, cur) {
      var m = load(subj), out = { grade: grade, topics: [], total: 0, solid: 0, started: 0, next: [] }, G = null;
      try { cur.subjects[subj].grades.forEach(function (g) { if (g.grade === grade) G = g; }); } catch (e) {}
      if (!G) return out;
      G.topics.forEach(function (t) {
        if (t.ready) return;   /* chủ đề làm quen (trò chơi nhận biết số/chữ) không có kỹ năng để chấm */
        var ids = [];
        Object.keys(SK).forEach(function (id) { var k = SK[id]; if (k.subj === subj && k.grades.indexOf(grade) >= 0 && topicOf(id, grade) === t.id) ids.push(id); });
        Object.keys(TRACKED).forEach(function (id) { var k = TRACKED[id], tp = typeof k.topic === "object" ? k.topic[grade] : k.topic; if (
            k.subj === subj && k.grades.indexOf(grade) >= 0 &&
            tp === t.id) ids.push(id); });
        var sk = ids.map(function (id) { var x = m[id]; return { id: id, level: level(x), m4: mastery4(x), n: x ? x.n : 0, p: x ? Math.round(x.p * 100) / 100 : 0 }; });
        var solid = sk.filter(function (x) { return x.level === "proficient" || x.level === "advanced"; }).length, started = sk.filter(function (x) {
            return x.n > 0; }).length;
        out.topics.push({ id: t.id, name: t.name, tag: t.tag, icon: t.icon, sub: t.sub, skills: sk, total: sk.length, solid: solid, started: started });
        out.total += sk.length; out.solid += solid; out.started += started;
      });
      /* nên luyện tiếp: kỹ năng đã làm nhưng còn yếu trước, rồi kỹ năng chưa đụng tới */
      var all = []; out.topics.forEach(function (t) { t.skills.forEach(function (x) { all.push(x); }); });
      out.next = all.filter(function (x) { return x.level === "emerging" || x.level === "developing"; }).sort(function (a, b) { return a.p - b.p;
          }).concat(all.filter(function (x) {
          return x.level === "not_started" && SK[x.id]; })).slice(0, 4).map(function (x) { return x.id; });
      return out;
    }

    /* ---- xuất theo question_generation_schema (cho gia sư AI / kho câu hỏi): cur = window.LEARN_CURRICULUM nếu có ---- */
    function toSchema(q, cur) {
      var strand = ""; try { var S = cur.subjects[q.subj]; S.grades.forEach(function (g) { g.topics.forEach(function (t) { if (
          t.id === q.topic) strand = t.tag; }); }); } catch (e) {}
      var ans = q.o.filter(function (x) { return x.ok; })[0];
      return { question_id: q.id || (q.skill + "-gen"), grade: q.grade, strand: strand, topic_id: q.topic, difficulty: ["foundation", "standard",
          "challenge"][q.diff - 1], question_type: q.type,
        prompt: String(q.q).replace(/<[^>]+>/g, ""), expected_answer: ans.v, solution_steps: q.steps || [], misconception_tags: q.o.filter(function (
            x) { return !x.ok; }).map(function (x) { return x.tag; }),
        curriculum_alignment: { grade: q.grade, strand: strand, topic_id: q.topic, learning_outcome_id: null, alignment_type: "paraphrase" } };
    }

    /* kỹ năng Tiếng Việt + Tiếng Anh: learn/lang-skills.js (nạp trước engine trong trình duyệt, require trong Node) */

    EP.summary = summary; EP.goals = goals; EP.toSchema = toSchema;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnEngineParts = root.LearnEngineParts || {})["report"] = part;
})(typeof window !== "undefined" ? window : globalThis);
