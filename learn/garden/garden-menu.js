/* Menu 📅 ☰ và các lớp phủ (đóng bằng nền / Esc). */
var mnov;
function openMn(){ mnov.classList.add("on"); hideTip(); var c = document.getElementById("mncl"); if(c) c.focus(); }
function closeMn(){ stopSpeak(); mnov.classList.remove("on"); }
function initMenu(){
mnov = document.getElementById("mnov");
bindTabs(document.getElementById("mncard")); (function(){ var r = document.querySelector("#mncard .rd"); if(r) r.onclick = closeMn; })();
document.getElementById("bMis").onclick = openMn;
document.getElementById("bMenu").onclick = openMn;
document.getElementById("mncl").onclick = closeMn;
mnov.addEventListener("click", function(e){ if(e.target === mnov) closeMn(); });
ov.addEventListener("click", function(e){ if(e.target === ov) closeCard(); });
document.addEventListener("keydown", function(e){ if(e.key === "Escape"){ if(ov.classList.contains("on")) closeCard(); else if(mnov.classList.contains("on")) closeMn(); } });
}

