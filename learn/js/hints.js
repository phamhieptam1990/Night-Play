/* ---------- gợi ý theo bậc (learn/hint.js): bậc 1 mẹo, bậc 2 cách làm, bậc 3 lộ một phần; xem gợi ý không bị trừ sao ---------- */
function matchTile(){ const L = document.querySelector("#ans .qc"); if(!L) return null; const ts = [...L.querySelectorAll(".mc2")].filter(x => !x.disabled);
  return ts.find(x => x.classList.contains("sel")) || ts[0] || null; }
function hintSteps(b){
  if(!window.LearnHint || !b) return null;
  if(b.kind === "match"){ const t = matchTile(); return t ? LearnHint.steps(LearnHint.parse(t.textContent.trim() + " = ?"), lang, { full: true }) : null; }
  if(b.kind && b.kind !== "typein") return null;
  const ar = LearnHint.steps(LearnHint.parse(String(b.q).replace(/<br>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()), lang);
  if(ar) return ar;
  /* gợi ý tĩnh theo kỹ năng (learn/hint-texts.js): 2 bậc + bậc 3 (mờ bớt 2 đáp án sai, hoặc cho biết số chữ số) */
  if(b.hint && b.hint.length && (!b.kind || b.kind === "typein")){
    const st = b.hint.slice(), en = lang === "en";
    st.push(b.kind === "typein" ? (en
      ? "Put your answer back into the question: does it fit? Estimate first to see if it is about the right size." :
      "Thử thay đáp án của em vào đề xem có khớp không. Ước lượng trước xem kết quả cỡ lớn hay nhỏ.") : (en ? "Two wrong answers have been faded out." : "Mình đã làm mờ bớt 2 đáp án sai cho em."));
    return st;
  }
  return null;
}
function closeHint(){ const x = $("hintBox"); if(x && !x.hidden){ x.hidden = true; const i = document.querySelector("#ans input.qi"); if(i) try{ i.focus({ preventScroll: true }); }catch(e){} } }
function renderHint(b, st){
  const en = lang === "en";
  $("hintTitle").innerHTML = "<span aria-hidden='true'>💡</span><span>" + (en
    ? "Hint " : "Gợi ý ") + b.hl + "/" + st.length + "</span><span class='hdots' aria-hidden='true'>" + st.map((x,
    i) => "<i" + (i < b.hl ? " class='on'" : "") + "></i>").join("") + "</span>";
  $("hintBody").innerHTML = st.slice(0, b.hl).map((x, i) => "<div class='hs'><i>" + (i + 1) + "</i><div>" + x + "</div></div>").join("");
  const nx = $("hintNext"); nx.hidden = b.hl >= st.length; nx.textContent = en ? "Next hint ▶" : "Gợi ý tiếp ▶"; $("hintOk").textContent = en ? "Got it ✓" : "Đã hiểu ✓";
  $("hintBox").hidden = false;
  if(b.hl >= 3 && !b.kind && b.o){   /* chọn 1/4: bậc 3 bỏ bớt hai đáp án sai */
    const bs = [...document.querySelectorAll("#ans .ab")]; if(bs.length === b.o.length) bs.filter((x, i) => !b.o[i].ok && !x.disabled).slice(0, 2).forEach(x => { x.disabled = true;
      x.classList.add("no"); });
  }
}
/* ghi 1 lần/câu: phụ huynh thấy bé hay cần gợi ý ở kỹ năng nào */
function showHint(){ const b = bank[cur], st = hintSteps(b); if(!st || locked) return; if(!b.hl && b.skill) E.noteHint(subj, b.skill); b.hl = Math.min((b.hl || 0) + 1, st.length);
  renderHint(b, st); CoachLink.onHint(b, b.hl); }
function hintMore(){ const b = bank[cur], st = hintSteps(b); if(!st) return closeHint(); b.hl = Math.min((b.hl || 1) + 1, st.length); renderHint(b, st); }
$("qt").addEventListener("click", e => { if(e.target.closest && e.target.closest(".lsn")){ GESTURE = true; speak(); } });
  $("spkQ").addEventListener("click", () => { GESTURE = true; speak(); }); $("hintBtn").addEventListener("click", showHint); $("hintNext").addEventListener("click", hintMore);
  $("hintOk").addEventListener("click", closeHint);
$("hintBox").addEventListener("click", e => { if(e.target === $("hintBox")) closeHint(); }); addEventListener("keydown", e => { if(e.key === "Escape") closeHint(); });
