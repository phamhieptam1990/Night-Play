$("pick").onclick = sheet; $("change").onclick = sheet;
$("go").onclick = () => { if(subj !== ps || grade !== pg) TOPIC_ID = null; subj = ps; grade = pg; if(window.LearnSlot){ LearnSlot.set(grade, subj);
  if(window.Farm) Farm.resetCache(); } ls("learn:subj", subj); ls("learn:grade", grade); chrome(); start(); };
/* ✕ đóng popup cuối bài rồi mở vòng mới (không để bé kẹt ở màn câu cuối đã khoá) */
$("again").onclick = start; $("bMore").onclick = () => { ROUND_N = 10; FOCUS = null; KEEP = true; start(); }; $("bWeak").onclick = () => { ROUND_N = 10; FOCUS = "weak";
  KEEP = true; start(); }; function closeRes(){ $("res").hidden = true; start(); }
$("bExam").onclick = () => { ROUND_N = 20; FOCUS = null; KEEP = true; start(); }; $("bHard").onclick = () => { ROUND_N = 5; FOCUS = "hard"; KEEP = true; start(); };
$("resX").onclick = closeRes; addEventListener("keydown", e => { if(e.key === "Escape" && !$("res").hidden) closeRes(); });
$("sheet").addEventListener("click", e => { if(e.target === $("sheet")){ document.body.dataset.subj = subj; $("sheet").hidden = true; } });
document.addEventListener("keydown", e => { if(e.key === "Escape"){ if(!$("mnu").hidden) closeMenu(true); else if(!$("info").hidden) closeInfo();
  else if(!$("sheet").hidden){ document.body.dataset.subj = subj; $("sheet").hidden = true; } } });
$("fi").onclick = openInfo;
$("info").addEventListener("click", e => { if(e.target === $("info")) closeInfo(); });
$("lang").onclick = () => { closeMenu(); lang = lang === "vi" ? "en" : "vi"; ls("lang", lang); chrome(); start(); LearnLimit.repaint(); };
placeStars();
$("back").addEventListener("click", goBack);
$("mn").onclick = () => { $("mnu").hidden ? openMenu() : closeMenu(true); };
$("mPick").onclick = () => { closeMenu(); sheet(); };
$("mAgain").onclick = () => { closeMenu(); start(); };
$("mInfo").onclick = () => { closeMenu(); openInfo(); };
$("mParent").onclick = () => { closeMenu(); location.href = "parent/?lang=" + lang; };
$("mMusic").onclick = () => { MUSIC = !MUSIC; ls("learn:music", MUSIC ? "1" : "0"); musicUi(); if(MUSIC) musicStart(); else musicStop(); };
musicUi();
LearnLimit.guard({ busy: () => $("res").hidden && $("sheet").hidden, copy: () => { const u = PARENT_COPY.UI[lang];
  return { t: u.lock.t, p: u.lock.p, hub: u.lock.hub, parent: u.lock.parent, hubUrl: hubUrl(), parentUrl: "parent/?lang=" + lang }; } });
$("mTheme").onclick = () => { closeMenu(); const d = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = d; ls("theme", d); };
$("snd").onclick = () => { AUTO = !AUTO; ls("learn:auto", AUTO ? "1" : "0"); sndUi(); if(AUTO) speak(); else if("speechSynthesis" in window) speechSynthesis.cancel(); };
document.addEventListener("pointerdown", e => { GESTURE = true; try{ sessionStorage.setItem("learn:spk", "1"); }catch(_){}  if(!$("mnu").hidden && !e.target.closest("#mnu,#mn")) closeMenu(); }, true);
stars = +ls("learn:stars") || 0;
/* MÀN BẬT LOA trước bài kiểm tra: cú chạm này mở khóa âm thanh của trình duyệt (iPhone/Safari chỉ cho đọc sau một cú chạm) */
(function(){ const g = $("spkGate"); if(!g || !window.Voice) return; if(ls("learn:auto") === "0") return;
  const f = SUBF[subj]; $("sgBack").href = hubUrl(); $("sgMi").src = "../shared/art/learn/" + f + "/" + f + "_happy.svg"; g.hidden = false;
  $("sgOn").onclick = () => { try{ sessionStorage.setItem("learn:spk", "1"); }catch(_){} AUTO = true; ls("learn:auto", "1"); sndUi(); GESTURE = true; g.hidden = true; speak(); };
  /* gõ phím không lọt xuyên cổng loa */
  ["keydown", "keypress", "keyup"].forEach(ev => addEventListener(ev, e => { if(!g.hidden && e.key !== "Tab" && !(e.target && e.target.closest && e.target.closest("#spkGate"))){
    e.stopImmediatePropagation(); e.preventDefault(); } }, true));
  $("sgOff").onclick = () => { AUTO = false; ls("learn:auto", "0"); sndUi(); GESTURE = true; g.hidden = true; };
})();
toneUp.install(LM);   /* tone.js: lớp 4–5 lời linh vật gọn hơn */
LM.bind({ box: $("masBox"), bubble: $("say"), base: "../shared/art/learn/", lang, idleMs: 20000, onTap: speak });
$("mas").onclick = () => LM.poke();
/* dùng bàn phím: Tab tới linh vật là nghe đọc câu hỏi (Enter/Space để nghe lại) */
$("mas").addEventListener("focus", () => { let v = false; try{ v = $("mas").matches(":focus-visible"); }catch(e){} if(v) speak(); });
