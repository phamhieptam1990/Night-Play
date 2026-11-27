function finish(){
  const t = T[lang]; dots(); const N = ROUND_N, rs5 = RS5();
  const top = Object.keys(wrongTags).sort((x, y) => wrongTags[y] - wrongTags[x])[0];
  const evn = rs5 >= 5 ? "endGreat" : rs5 >= 3 ? "endGood" : "endTry"; const line = LM.event(evn); $("rSay").textContent = line;
    if(!LM.cloneInto($("rMas"), window.LEARN_PHRASES.events[evn][0])) $("rMas").textContent = rs5 >= 5 ? "🏆" : "🎉"; $("rT").textContent = t.rT; $("rP").textContent = t.rP;
  $("rStars").textContent = N === 5 ? "⭐".repeat(roundStars) + "☆".repeat(5 - roundStars) : "⭐".repeat(rs5) + "☆".repeat(5 - rs5);
    $("rS").textContent = (lang === "en" ? "✔ Right " : "✔ Đúng ") + roundStars + "/" + N; $("rB").parentNode.hidden = true;   /* gọn: bỏ chuỗi dài nhất */
  if(N >= 10) $("rS").textContent += (lang === "en" ? " · Score " : " · Điểm ") + (Math.round(roundStars * 100 / N) / 10) + "/10";   /* đề dài: điểm thang 10 */
  try{ ls("learn:lastRound:" + subj + ":" + grade, JSON.stringify({ s: roundStars, n: N })); }catch(e){}
  $("rTip").textContent = top ? t.tipErr + t.tag[top] + "." : t.tipOk; $("again").setAttribute("aria-label", t.again); $("resX").setAttribute("aria-label", t.close);
    $("change").setAttribute("aria-label", t.change);
  try{ if(window.Habit) Habit.note(subj, roundStars, lang); }catch(e){}
  $("rTip").textContent = top ? (lang === "en" ? "Practise: " : "Luyện thêm: ") + t.tag[top] + "." : ""; $("rTip").hidden = !top;
  { const wk = (grade >= 3 && !TRIP && !TOPIC_ID && E.weakSkills) ? E.weakSkills(subj, grade).length : 0, vi = lang !== "en";
    $("rMore").hidden = !(grade >= 3 && !TRIP && !TOPIC_ID); $("bMore").querySelector("span").textContent = vi ? "Luyện thêm 10 câu" : "10 more questions";
    $("bExam").hidden = $("bHard").hidden = !(grade >= 4 && !TRIP && !TOPIC_ID);   /* lớp 4–5: đề thử 20 câu + thử thách khó cho bé tự chọn */
    $("bExam").querySelector("span").textContent = vi ? "Đề thử 20 câu" : "20-question test"; $("bHard").querySelector("span").textContent = vi ? "Thử thách khó" : "Hard challenge";
    $("bWeak").hidden = !wk; $("bWeak").querySelector("span").textContent = (vi ? "Ôn chỗ hay sai (" : "Review weak spots (") + wk + ")"; }
  farmFinish();
  { const q = new URLSearchParams({ grade, subj, lang }).toString(), L = lang === "vi" ? ["Chơi lại", "Khu vườn", "Trang học"] : ["Play again", "Garden", "Lessons"];
    $("toGdn").hidden = false; $("toMap").hidden = false; $("toGdn").href = "garden/index.html?" + q; $("toMap").href = "lop/index.html?" + q;
    $("again").querySelector("span").textContent = L[0]; $("toGdn").querySelector("span").textContent = L[1]; $("toMap").querySelector("span").textContent = L[2]; }
  const showRes = () => { $("res").hidden = false; $("again").focus(); if(rs5 >= 3) cheer(3, null, ""); };
  /* từ 3 sao: màn chúc mừng trước, rồi mới tới bảng kết quả */
  if(rs5 >= 3 && window.LearnCelebrate) LearnCelebrate.show(rs5, { lang, grade, key: subj + ":" + (TOPIC_ID || "free"), quiet: !AUTO && !MUSIC, done: showRes }); else showRes();
  if(window.LearnLimit) LearnLimit.check(false);   /* vừa xong vòng: nếu đã hết giờ thì hiện màn nghỉ */
}
let KEEP = false;
function start(){
  if(KEEP) KEEP = false; else { ROUND_N = 5; FOCUS = null; }   /* "Luyện thêm" / "Ôn chỗ hay sai" giữ cấu hình vòng; mọi cách bắt đầu khác về vòng 5 câu */
  if(window.LearnLimit && LearnLimit.over()){ $("res").hidden = true; $("sheet").hidden = true; LearnLimit.check(true); return; }   /* hết giờ chơi: không bắt đầu vòng mới */
  musicSwitch();   /* mỗi vòng kiểm tra một bài nhạc khác; đổi môn thì bộ bài của môn đó */
  const t = T[lang]; cur = TRIP ? Story.resumeAt(TRIP.id) : 0; streak = 0; best = 0; roundStars = 0; wrongTags = {}; $("res").hidden = true; $("sheet").hidden = true;
  $("toMe").hidden = true; gardenBadge(); introPending = !!TRIP; buildRound(); ADV = null; farmOutfit(); showQ(); if(!TRIP) LM.event("start");
  if(window.Farm && window.Adventure && !TRIP){ const gr = Farm.greet(subj, lang, c => (T[lang].tag || {})[c] || ""); const c0 = Adventure.chapter(subj, lang); LM.say(gr);
    setTimeout(() => { if(cur === 0 && !locked) LM.say(c0.intro); }, 3600); }
}
