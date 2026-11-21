/* Buổi trong ngày: sáng / hoàng hôn / đêm. */
var PHASE = "auto", curPhase = null, PIMG = { day: "01-toan-canh", dusk: "05-hoang-hon", night: "06-ban-dem" };
function phaseNow(){ var h = new Date().getHours(); return h >= 6 && h < 17 ? "day" : h >= 17 && h < 19 ? "dusk" : "night"; }
function setPhase(ph, instant){ PHASE = ph; var real = ph === "auto" ? phaseNow() : ph; document.querySelectorAll(".phbar button").forEach(function(b){ b.classList.toggle("on", b.dataset.ph === ph); }); if(real === curPhase) return; curPhase = real;
  stage.dataset.ph = real; stage.querySelector("img").src = typeof scenePath === "function" ? scenePath(real) : GardenLayout.ART + "scene/scene-" + PIMG[real] + "-na.svg"; var inside = real === "night"; SLOTS.forEach(function(s, i){ aMove(s, inside, instant, i); }); zzz.classList.toggle("on", inside); }
function initTime(){
document.querySelectorAll(".phbar button").forEach(function(b){ b.onclick = function(){ setPhase(b.dataset.ph); closeMn(); }; });
setPhase("auto", true);
setInterval(function(){ if(PHASE === "auto") setPhase("auto"); }, 60000);
}

