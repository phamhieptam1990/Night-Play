/* Lộ trình theo lớp × môn × chủ đề: học → thử cùng → kiểm tra (Học Vui).
   Khoá lưu máy có MÃ HỒ SƠ BÉ ngay từ đầu (sẵn cho nhiều bé / đồng bộ sau này):
     learn:pf = mã hồ sơ đang dùng (mặc định "1")
     learn:pf:<hồ sơ>:lp:<lớp>:<môn> = { <topic_id>: { l: giờ đã học (0 = chưa), t: số lần kiểm tra, b: số sao tốt nhất (0-5), u: giờ sửa } }
   Chỉ có số và mã chủ đề, KHÔNG có tên hay nội dung. Tiến độ kỹ năng cũ (learn:m:<môn>) giữ nguyên, không đụng tới.
   Bài học thật nạp vào PATH.lessons[<topic_id>] ở giai đoạn H2; chưa có thì chủ đề hiện nhãn "sắp có bài học" và bài kiểm tra mở sẵn. */
(function (root) {
  "use strict";
  var MEM = {};
  function ls(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); root.localStorage.setItem(k, v); } catch (e) { if (v === undefined) return MEM[k] == null ? null : MEM[k]; MEM[k] = v; } }
  var SUBJ = ["toan", "tviet", "tanh"];
  function pf() { var p = String(ls("learn:pf") || "1"); return /^[A-Za-z0-9_-]{1,16}$/.test(p) ? p : "1"; }
  function key(grade, subj) { return "learn:pf:" + pf() + ":lp:" + grade + ":" + subj; }
  function read(grade, subj) { try { var o = JSON.parse(ls(key(grade, subj)) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
  function write(grade, subj, o) { ls(key(grade, subj), JSON.stringify(o)); }
  function eng() { return root.LearnEngine; }
  function topics(subj, grade) {
    var C = root.LEARN_CURRICULUM, s = C && C.subjects && C.subjects[subj]; if (!s) return [];
    var g = s.grades.filter(function (x) { return x.grade === grade; })[0]; return g ? g.topics : [];
  }
  var P = {
    SUBJ: SUBJ, lessons: {},
    pf: pf,
    grade: function () { var g = +ls("learn:grade"); return g >= 1 && g <= 5 ? g : 0; },
    setGrade: function (g) { if (g >= 1 && g <= 5) ls("learn:grade", String(g)); },
    topics: topics,
    hasLesson: function (topic) { return !!P.lessons[topic]; },
    hasTest: function (subj, grade, topic) { var E = eng(); return !!E && E.topicSkills(subj, grade, topic).length > 0; },
    get: function (grade, subj, topic) { var r = read(grade, subj)[topic] || {}; return { l: r.l || 0, t: r.t || 0, b: r.b || 0, r: r.r || 0 }; },
    markLearned: function (grade, subj, topic) { var o = read(grade, subj), r = o[topic] || { l: 0, t: 0, b: 0 }; if (!r.l) r.l = Date.now(); r.u = Date.now(); o[topic] = r; write(grade, subj, o); },
    markTested: function (grade, subj, topic, stars) { var o = read(grade, subj), r = o[topic] || { l: 0, t: 0, b: 0 }; r.t = (r.t || 0) + 1; r.b = Math.max(r.b || 0, Math.max(0, Math.min(5, stars | 0))); r.u = Date.now(); o[topic] = r; write(grade, subj, o); return r; },
    /* mức thành thạo hiện có của chủ đề (0-4) từ tiến độ kỹ năng cũ: trung bình mastery4 các kỹ năng đã chơi, 0 nếu chưa chơi */
    mastery: function (subj, grade, topic) {
      var E = eng(); if (!E) return 0; var m = E.load(subj), ids = E.topicSkills(subj, grade, topic), s = 0, n = 0;
      ids.forEach(function (id) { if (m[id] && m[id].n > 0) { s += E.mastery4(m[id]); n++; } });
      return n ? Math.round(s / n) : 0;
    },
    /* trạng thái: "new" chưa học · "learned" đã học · "passed" qua kiểm tra (>= 3 sao) · "star" thành thạo (5 sao) */
    status: function (subj, grade, topic) {
      var r = P.get(grade, subj, topic); if (r.b >= 5) return "star"; if (r.b >= 3) return "passed"; if (r.l) return "learned"; return "new";
    },
    /* ---- HỌC THEO THỨ TỰ + NHIỆM VỤ VƯỜN ----
       completed: đã học hết bài học (l) HOẶC qua kiểm tra (b >= 3). unlocked: chủ đề đầu, hoặc chủ đề liền trước đã completed (không nhảy bài).
       complete(): lần đầu hoàn thành một chủ đề -> phát phần thưởng: 3 nhiệm vụ vườn (tưới, bón, cho cá) + 2 hạt giống; lưu ở khoá vườn "gardenQuest@<lớp>:<môn>". */
    completed: function (grade, subj, topic) { var r = P.get(grade, subj, topic); return !!r.l || r.b >= 3; },
    unlocked: function (subj, grade, topic) { var ts = topics(subj, grade), i = -1; ts.forEach(function (t, k) { if (t.id === topic) i = k; }); if (i < 0) return false; return i === 0 || P.completed(grade, subj, ts[i - 1].id); },
    canTest: function (subj, grade, topic) { return P.unlocked(subj, grade, topic); },
    next: function (subj, grade) {   /* chủ đề tiếp theo bé cần học (chưa completed), null nếu xong cả lớp */
      var ts = topics(subj, grade); for (var i = 0; i < ts.length; i++) if (!P.completed(grade, subj, ts[i].id)) return { id: ts[i].id, name: ts[i].name, index: i, total: ts.length, hasLesson: !!P.lessons[ts[i].id] };
      return null;
    },
    questKey: function (grade, subj) { return "gardenQuest@" + grade + ":" + subj; },
    quest: function (grade, subj) {
      var raw = root.LearnSlot ? root.LearnSlot.raw.get(P.questKey(grade, subj)) : ls(P.questKey(grade, subj)), q = null;
      try { q = JSON.parse(raw || "null"); } catch (e) {} q = q && typeof q === "object" ? q : {}; return { left: q.left | 0, done: q.done | 0, seeds: q.seeds | 0, packs: q.packs | 0 };
    },
    saveQuest: function (grade, subj, q) { var v = JSON.stringify({ left: q.left | 0, done: q.done | 0, seeds: q.seeds | 0, packs: q.packs | 0 }); if (root.LearnSlot) root.LearnSlot.raw.set(P.questKey(grade, subj), v); else ls(P.questKey(grade, subj), v); },
    complete: function (grade, subj, topic) {
      var o = read(grade, subj), r = o[topic] || { l: 0, t: 0, b: 0 }; if (r.r || !(r.l || r.b >= 3)) return { first: false };
      r.r = 1; r.u = Date.now(); o[topic] = r; write(grade, subj, o);
      var q = P.quest(grade, subj); q.left += 3; q.seeds += 2; q.packs += 1; P.saveQuest(grade, subj, q);
      return { first: true, left: q.left, seeds: 2 };
    },
    summary: function (subj, grade) {
      var ts = topics(subj, grade), done = 0; ts.forEach(function (t) { var s = P.status(subj, grade, t.id); if (s === "passed" || s === "star") done++; });
      return { total: ts.length, done: done };
    }
  };
  root.LearnPath = P;
})(typeof window !== "undefined" ? window : globalThis);
