/* tự thu thanh trên sau 3 giây không chạm; chạm mép trên, vuốt xuống, hoặc dùng bàn phím trong thanh thì hiện lại */
document.querySelector(".prog").classList.add("intro"); setTimeout(() => document.querySelector(".prog").classList.remove("intro"), 1400);
(function(){
  const top = document.querySelector("header.top"), rev = $("rev"); if(!top || !rev) return; let T = 0, y0 = null;
  const busy = () => !$("mnu").hidden || !!document.querySelector(".ov:not([hidden])") || top.contains(document.activeElement);
  const hide = () => { if(busy()){ arm(); return; } top.classList.add("tuck"); document.body.classList.add("tucked"); };
  const show = () => { top.classList.remove("tuck"); document.body.classList.remove("tucked"); arm(); };
  function arm(){ clearTimeout(T); T = setTimeout(hide, 3000); }
  rev.addEventListener("click", show);
  addEventListener("pointerdown", e => { if(top.classList.contains("tuck") && e.clientY < 36) show(); else if(!top.classList.contains("tuck")) arm(); }, { passive: true });
  addEventListener("touchstart", e => { y0 = e.touches[0].clientY; }, { passive: true });
  addEventListener("touchmove", e => { if(y0 != null && top.classList.contains("tuck") && e.touches[0].clientY - y0 > 28){ y0 = null; show(); } }, { passive: true });
  addEventListener("wheel", e => { if(e.deltaY < 0 && top.classList.contains("tuck")) show(); }, { passive: true });
  top.addEventListener("focusin", show);
  arm();
})();
["pointerdown", "keydown"].forEach(e => document.addEventListener(e, () => LM.wake(), true));
if(TRIP_ID && window.Story){ fetch("content/trips/" + TRIP_ID + ".json").then(r => r.json()).then(t => { TRIP = t; subj = t.subject; chrome(); start(); }).catch(() => { chrome(); start(); }); }
else { chrome(); start(); }
