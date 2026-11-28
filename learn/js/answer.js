/* đúng / sai dùng chung cho mọi kiểu câu hỏi */
function gotRight(el){
  const b = bank[cur]; locked = true; if(el){ if(el.classList) el.classList.add("ok"); burst(el); } streak++; best = Math.max(best, streak);
  { const cw = T[lang].cheer || {}; cheer(streak >= 3 ? 2 : 1, el, streak >= 5 ? cw.s5 : streak >= 3 ? cw.s3 : (tries === 0 && Math.random() < .5 ? cw.ok : "")); }
  if(tries === 0){ if(!(b.hl >= 2)) E.record(subj, b.skill, true, undefined, { kind: b.kind || "mc", hint: b.hl >= 1 }); stars++; roundStars++; ls("learn:stars", stars);
    const s = $("stars"); s.classList.remove("bump"); void s.offsetWidth; s.classList.add("bump"); b.res = "ok"; advUi(); } else b.res = "miss";
  LM.event(streak >= 5 ? "streak5" : streak >= 3 ? "streak3" : "ok"); storyReact(true); setTimeout(next, 1000); renderStars();
  /* B11: lớp 1–2 — câu đúng đầu tiên của vòng: linh vật nói rõ mục tiêu nhìn thấy (còn mấy câu là xong, nhận sao) */
  if(grade <= 2 && !TRIP && tries === 0 && roundStars === 1){ const left = bank.length - cur - 1; if(left > 0) LM.say(lang === "en"
    ? "Great! " + left + " more and you win stars!" : "Giỏi quá! Còn " + left + " câu nữa là em nhận sao nhé!"); }
}
/* trả về 1 = sai lần đầu (cho thử lại, có gợi ý), 2 = sai lần hai (hiện đáp án rồi sang câu sau) */
function gotWrong(tag, reveal, text, wrongTxt){
  const t = T[lang], b = bank[cur]; tries++; streak = 0; sfx("no"); err(tag || "other"); $("streak").textContent = "";
  /* lần sai đầu tiên của câu này: ghi kỹ năng + mã lỗi tư duy */
  if(tries === 1){ E.record(subj, b.skill, false, tag || "other", { kind: b.kind || "mc" }); LM.emote("sad", 1600); if(TRIP) storyReact(false);
    else { LM.say(t.hint[tag] || t.hint.other); CoachLink.onWrong(b, wrongTxt, tag); } return 1; }
  locked = true; b.res = "miss"; if(reveal) reveal(); LM.emote("sad", 2000); LM.say(text ? t.reveal + " " + text + "." : t.hint.other);
  if(b.steps && b.steps.length >= 2){ setTimeout(() => showSolution(b.steps, next), 700); return 2; }   /* có lời giải: giữ đến khi bé bấm Tiếp */
  setTimeout(next, 1700); return 2;
}
const QAPI = { sfx: k => sfx(k), locked: () => locked, right: el => gotRight(el), wrong: (tag, reveal, text) => gotWrong(tag, reveal, text), say: t => LM.say(t) };
function choose(btn, o){
  if(locked) return; const b = bank[cur];
  if(o.ok){ Array.from($("ans").children).forEach(x => x.disabled = true); gotRight(btn); return; }
  btn.classList.add("no"); btn.disabled = true;
  gotWrong(o.tag, () => { const right = b.o.find(x => x.ok); Array.from($("ans").children).forEach(x => { x.disabled = true; if(x.textContent === right.v) x.classList.add("ok");
    }); }, b.o.find(x => x.ok).v, btn.textContent);
}
function next(){ cur++; if(TRIP) Story.rest(TRIP.id, cur); if(cur >= ROUND_N) return finish(); showQ(); }
