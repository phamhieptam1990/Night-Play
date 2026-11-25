/* ---------- phiêu lưu + mục tiêu + cây lớn + trang phục (learn/farm.js, learn/adventure.js) ---------- */
let ADV = null;
/* ---------- truyện (learn/story.js): mở trang với ?trip=<id> thì vòng 5 câu là 5 CẢNH của chuyến ---------- */
const TRIP_ID = (() => { try{ return (new URLSearchParams(location.search).get("trip") || "").replace(/[^a-z0-9-]/g, ""); }catch(e){ return ""; } })();
let TRIP = null, introPending = false;
/* nhiệm vụ từ khu vườn (?mission=water|fert|fish): xong vòng với >= 3 câu đúng, đúng môn của nhiệm vụ → Farm.missionDone mở thêm một phần đất */
const MISSION = (() => { try{ const m = new URLSearchParams(location.search).get("mission"); return window.Farm && Farm.MISSION_SUBJ[m] ? m : ""; }catch(e){ return ""; } })();
/* bé chơi môn nào thì tính nhiệm vụ của môn đó, kể cả khi không bấm từ khu vườn */
const missionOf = s => window.Farm ? Object.keys(Farm.MISSION_SUBJ).filter(k => Farm.MISSION_SUBJ[k] === s)[0] || "" : "";
function gardenBadge(){ const b = $("gBadge"); if(!b || !window.Farm) return; const n = Farm.missionsLeft(); b.textContent = n; b.hidden = !n; }
/* lời kể (<= 90 ký tự, đã kiểm bằng check-trips.js) dài hơn giới hạn 40 của LM.say */
function storySay(txt){ const b = $("say"); if(!b || !txt) return; b.textContent = txt; b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
function storyScene(){ if(!TRIP) return; const sc = Story.scene(TRIP, bank[cur] ? bank[cur].scene : cur, lang); if(!sc) return;
  if(introPending){ introPending = false; storySay(Story.tx(TRIP.intro.text, lang)); setTimeout(() => { if(bank[cur] && !locked && tries === 0) storySay(sc.narration); }, 4200);
    } else storySay(sc.narration); }
function storyReact(ok){ if(!TRIP) return; const sc = Story.scene(TRIP, bank[cur] ? bank[cur].scene : cur, lang); if(sc) LM.say(ok ? sc.onRight : sc.onWrong); }
function farmOutfit(){ const o = window.Farm && Farm.wearing(); $("oft").textContent = o ? o.e : ""; }
function advUi(){
  if(!window.Farm || !window.Adventure) return; const t = T[lang], F = Farm.get(), q = F.quest;
  if(!ADV) ADV = Adventure.chapter(subj, lang);
  $("advT").textContent = TRIP ? Story.tx(TRIP.title, lang) + " · " + (Math.min(cur, 4) + 1) + "/5" : (lang === "en" ? "Chapter " : "Chương ") + ADV.n + " · " + ADV.step(Math.min(cur, 4));
  const now = Math.min(q.goal, q.correct + roundStars);
  const left = q.goal - now;
  $("goalT").textContent = "🎁 " + (left <= 0 ? (lang === "en" ? "Gift ready!" : "Quà sẵn sàng!") : lang === "en" ? left + " ⭐ to go" : "Còn " + left + " ⭐ là có quà");
  $("goalBar").style.width = (now / q.goal * 100) + "%";
  const pl = $("plant"), c = Farm.CROP[subj] || "carrot", k = Math.min(4, roundStars), want = "../shared/art/garden/crop_" + c + (k >= 4 ? "" : "_s" + k) + ".svg";
  if(pl.getAttribute("src") !== want){ pl.src = want; pl.classList.remove("grow"); void pl.offsetWidth; pl.classList.add("grow"); }
}
const RS5 = () => ROUND_N === 5 ? roundStars : Math.round(roundStars * 5 / ROUND_N);   /* quy về thang 5 sao cho vườn / hành trình */
function farmFinish(){
  if(!window.Farm || !window.Adventure) return; const t = T[lang], vi = lang !== "en", roundStars = RS5();
  const rep = Farm.recordRound({ subj, correct: roundStars, wrong: wrongTags, best, starsGained: roundStars }), ok = roundStars >= 5, ch = ADV || Adventure.chapter(subj, lang);
  if(ok && !TRIP && ROUND_N === 5 && !FOCUS) Adventure.advance(subj);
  /* ghi tiến độ chủ đề (lớp × môn); đạt từ 3 sao = hoàn thành chủ đề → phát nhiệm vụ vườn */
  let CP = null; if(TOPIC_ID && !TRIP && window.LearnPath){ LearnPath.markTested(grade, subj, TOPIC_ID, roundStars);
    if(roundStars >= 3) CP = LearnPath.complete(grade, subj, TOPIC_ID); }
  let tr = null; if(TRIP){ tr = Story.finish(TRIP.id, roundStars); if(tr.seed) Farm.addSeeds(1); }
  $("rStory").textContent = "📖 " + (TRIP ? Story.tx(TRIP.outro.text, lang) : ch.outro(ok, roundStars));
  const cn = { carrot: vi ? "cà rốt" : "carrots", wheat: vi ? "lúa mì" : "wheat", strawberry: vi ? "dâu tây" : "strawberries" }[rep.crop];
  const chips = []; if(rep.cropN) chips.push("<span>" + (vi ? "🧺 +" + rep.cropN + " " + cn : "🧺 +" + rep.cropN + " " + cn)+ "</span>");
    if(rep.seeds) chips.push("<span>🌱 +" + rep.seeds + (vi ? " hạt giống" : " seeds") + "</span>");
  if(tr && tr.seed) chips.push("<span class='big'>" + (vi ? "🌱 Hạt quý mới về vườn: +1" : "🌱 A rare seed came home: +1") + "</span>");
  chips.push("<span>🎁 " + (vi ? "Quà: " : "Gift: ") + Math.min(rep.questGoal, rep.questNow) + "/" + rep.questGoal + "</span>");
  if(CP && CP.first) chips.push("<span class='big'>" + (subj === "tviet" ? (vi ? "🎁 Qua chủ đề! Quà đã chờ ở Vườn Thú" : "🎁 Topic passed! Gifts wait at the Pet Garden") : subj === "tanh" ? (vi ? "🎁 Qua chủ đề! Quà đã chờ ở Khu Chợ" : "🎁 Topic passed! Gifts wait at the Market") : (vi ? "🎁 Qua chủ đề! +3 nhiệm vụ, +2 🌱" : "🎁 Topic passed! +3 garden tasks, +2 🌱")) + "</span>");
    else if(TOPIC_ID && roundStars < 3) chips.push("<span>" + (vi ? "Đúng 3 câu là qua chủ đề. Thử lại nhé!" : "Get 3 right to pass and earn tasks. Try again!") + "</span>");
  if(rep.goalHit) chips.push("<span class='big'>" + (vi ? "🎉 Đủ mục tiêu ngày! +2 🌱 +3 ⭐" : "🎉 Daily goal done! +2 🌱 +3 ⭐") + "</span>");
  if(rep.newOutfit) chips.push("<span class='big'>" + rep.newOutfit.e + " " + (vi ? "Mở trang phục mới: " : "New outfit: ") + rep.newOutfit.n + "</span>");
  { const mk = (MISSION && Farm.MISSION_SUBJ[MISSION] === subj) ? MISSION : missionOf(subj);
    if(mk && roundStars >= 3){ const m = Farm.missionDone(mk), gt = Farm.BUILD.goal(m.n); chips.push("<span class='big'>" + (m.first ? (vi
      ? "🎯 Xong nhiệm vụ! " + (Farm.BUILD.got[Math.min(m.n, 7)] || "Khu vườn mở thêm một phần đất").replace(/[.!]$/, "") +
        (gt ? ". Tiếp theo: " + gt.name + " (còn " + Math.max(0,
      gt.at - gt.done) + ")" : "") : "🎯 Mission done! A new part of the garden opens 🌱") : (vi
      ? "🎯 " + T[lang].sn[subj] + ": xong nhiệm vụ" : "🎯 Today's mission is already done")) + "</span>"); $("toGdn").hidden = false; }
    else if(mk && roundStars < 3) chips.push("<span>" + (vi ? "🎯 Đúng 3 câu là xong nhiệm vụ. Thử lại nhé!" : "🎯 Get at least 3 right to finish the mission. Try again!") + "</span>"); }
  $("rFarm").innerHTML = chips.join(""); gardenBadge(); ADV = null; farmOutfit();
}
