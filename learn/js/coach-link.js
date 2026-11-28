/* Điểm cắm AI luyện cùng vào màn câu hỏi (Plus). Chỉ chạy khi LearnCoach.enabled(); free/tắt thì không làm gì, không yêu cầu mạng.
   Gọi từ answer.js khi bé sai lần đầu: AI nói một câu ngắn qua linh vật; lỗi/chậm thì giữ lời viết sẵn. Không bao giờ chặn nhịp chơi. */
const CoachLink = (function () {
  let seq = 0;
  function plain(s){ return String(s == null ? "" : s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(); }
  function correctOf(b){
    if(b.o && b.o.length){ const r = b.o.find(x => x.ok); return r ? plain(r.v) : ""; }
    return plain(b.show != null ? b.show : Array.isArray(b.ans) ? b.ans[0] : b.ans);
  }
  function ask(mode, b, wrong, tag, step){
    if(!window.LearnCoach || !LearnCoach.enabled() || !b) return;
    const skill = String(b.skill || b.topic || b.kind || "general").replace(/[^A-Za-z0-9_.:-]/g, "").slice(0, 40) || "general";
    const correct = correctOf(b), q = plain(b.q); if(!correct || !q) return;
    const mine = ++seq;
    LearnCoach.ask({ mode, q, correct, wrong: wrong ? plain(wrong).slice(0, 60) : undefined, err: tag, step: step | 0, subj, skill, grade, lang })
      .then(r => { if(mine === seq && !locked && bank[cur] === b) LearnCoach.say(r); }).catch(() => {});
  }
  return { onWrong: (b, w, t) => ask("explain", b, w, t, 0), onHint: (b, step) => ask("hint", b, null, null, Math.min(2, Math.max(0, step - 1))) };
})();
