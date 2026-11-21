/* MÁY CHƠI TRUYỆN của Học Vui (xem docs/LEARN-STORY-PLAN.md, bộ khung: docs/LEARN-STORY-BIBLE.md).
   Một CHUYẾN = một tệp JSON learn/content/trips/<id>.json: lời mở, 5 cảnh (mỗi cảnh một "lời nhờ" = một câu hỏi), lời kết, phần thưởng.
   Câu hỏi KHÔNG do chuyến bịa: chuyến chỉ chỉ định kiểu (kind) và kỹ năng (skill); đề và đáp án do bộ sinh có sẵn tạo theo LỚP của bé
   (LearnTypes.make / LearnEngine.make), nên một truyện dùng được cho mọi lớp.
   Trang học (learn/index.html?trip=<id>) dùng nguyên vòng 5 câu: Story.questions() thay cho vòng thường; lời kể hiện ở bong bóng linh vật.
   Tiến độ chuyến lưu trên máy ("learn:trips"): { <id>: { done, best, at, rest } } (rest = cảnh đang dở để chơi tiếp). Không gửi ra ngoài.
   API (trình duyệt: window.Story; Node: require):
     tx(o, lang)                      {vi,en} -> chuỗi
     questions(trip, ctx)             ctx = { E: LearnEngine, LT: LearnTypes, lang, grade } -> 5 câu, mỗi câu gắn .scene (số cảnh)
     scene(trip, i, lang)             { speaker, narration, line, onRight, onWrong } đã chọn ngôn ngữ
     progress() / save(id, patch)     đọc / ghi tiến độ
     rest(id, i)                      lưu điểm nghỉ (cảnh i) ; resumeAt(id) -> số cảnh để chơi tiếp
     finish(id, correct)              ghi hoàn thành; trả { first, seed } (seed = 1 nếu là lần đầu xong chuyến)
     litColors(index, prog)           số màu cầu vồng đã sáng (màu sáng khi mọi chuyến CÓ SẴN của màu đó đã xong) */
(function (root) {
  "use strict";
  var KEY = "learn:trips", N = 5;

  function tx(o, lang) { if (o == null) return ""; if (typeof o === "string") return o; return o[lang === "en" ? "en" : "vi"] || o.vi || ""; }

  function rd() { try { return root.localStorage.getItem(KEY); } catch (e) { return null; } }
  function wr(v) { try { root.localStorage.setItem(KEY, v); } catch (e) {} }
  function progress() { var p = {}; try { p = JSON.parse(rd() || "{}") || {}; } catch (e) { p = {}; } return p; }
  function save(id, patch) { var p = progress(), c = p[id] || {}; for (var k in patch) c[k] = patch[k]; p[id] = c; wr(JSON.stringify(p)); return c; }
  function rest(id, i) { save(id, { rest: i > 0 && i < N ? i : 0 }); }
  function resumeAt(id) { var c = progress()[id]; return c && c.rest > 0 && c.rest < N ? c.rest : 0; }
  function finish(id, correct) {
    var p = progress(), c = p[id] || {}, first = !c.done;
    save(id, { done: 1, best: Math.max(c.best || 0, correct | 0), at: Date.now(), rest: 0 });
    return { first: first, seed: first && correct >= 3 ? 1 : 0 };
  }

  function scene(trip, i, lang) {
    var s = trip.scenes[i]; if (!s) return null;
    return { id: s.id, speaker: s.speaker || "", narration: tx(s.narration, lang), line: tx(s.line, lang), onRight: tx(s.onRight, lang), onWrong: tx(s.onWrong, lang) };
  }

  /* 5 câu cho 5 cảnh. Ưu tiên kiểu câu (kind) nếu lớp của bé có kiểu đó; không thì dùng bộ sinh theo kỹ năng. */
  function questions(trip, ctx) {
    var E = ctx.E, LT = ctx.LT, lang = ctx.lang === "en" ? "en" : "vi", grade = Math.min(5, Math.max(1, ctx.grade | 0 || 1)), subj = trip.subject, used = {}, out = [];
    trip.scenes.forEach(function (s, i) {
      var c = s.challenge || {}, q = null;
      if (c.kind && LT && LT.kindsFor && LT.kindsFor(subj, grade).indexOf(c.kind) >= 0) { try { q = LT.make(c.kind, subj, grade, lang); } catch (e) { q = null; } }
      if (!q && c.skill && E) { try { q = E.make(c.skill, { lang: lang, grade: grade, used: used }); } catch (e) { q = null; } }
      if (!q) throw new Error("Chuyến " + trip.id + " cảnh " + (s.id || i) + ": không sinh được câu (kind=" + c.kind + ", skill=" + c.skill + ", lớp " + grade + ")");
      q.scene = i; out.push(q);
    });
    return out;
  }

  function litColors(index, prog) {
    var by = {}, lit = 0; (index.trips || []).forEach(function (t) { if (t.soon) return; (by[t.color] = by[t.color] || []).push(t.id); });
    (index.colors || []).forEach(function (c) { var ids = by[c.n]; if (ids && ids.length && ids.every(function (id) { return prog[id] && prog[id].done; })) lit++; });
    return lit;
  }

  var api = { KEY: KEY, N: N, tx: tx, questions: questions, scene: scene, progress: progress, save: save, rest: rest, resumeAt: resumeAt, finish: finish, litColors: litColors };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Story = api;
})(typeof window !== "undefined" ? window : globalThis);
