/* LỜI GIẢI sau lần sai thứ 2: khi câu có b.steps (>= 2 dòng, dòng cuối nêu đáp án) thì hiện khung đọc được, giữ đến khi bé bấm "Tiếp" (hoặc ~9 giây).
   Nếu bé bật loa (AUTO) thì đọc từng dòng bằng Voice.say / speechSynthesis. Không có steps thì gotWrong giữ hành vi cũ (tự sang câu sau). */
let SOL_T = 0, SOL_DONE = null;
function solClose(go){
  const box = $("solBox"); clearTimeout(SOL_T); if(box) box.hidden = true; if("speechSynthesis" in window) try{ speechSynthesis.cancel(); }catch(e){}
  const f = SOL_DONE; SOL_DONE = null; if(f && go !== false) f();
}
function solSpeak(lines){
  if(!AUTO) return; const lg = subj === "tanh" && lang !== "vi" ? "en" : (lang === "vi" ? "vi" : "en"), txt = lines.map(x => x.replace(/[×]/g, lang === "vi" ? " nhân " : " times ").replace(/[÷]/g, lang === "vi" ? " chia " : " divided by ")
    .replace(/[−]/g, lang === "vi" ? " trừ " : " minus ").replace(/\+/g, lang === "vi" ? " cộng " : " plus ").replace(/=/g, lang === "vi" ? " bằng " : " equals ")).join(" ");
  try{ if(window.Voice) Voice.say(txt, subj, lg, {}); else if("speechSynthesis" in window){ const u = new SpeechSynthesisUtterance(txt); u.lang = lg === "vi" ? "vi-VN" : "en-US"; u.rate = 1; speechSynthesis.speak(u); } }catch(e){}
}
function showSolution(steps, done){
  let box = $("solBox"), vi = lang === "vi";
  if(!box){ box = document.createElement("div"); box.id = "solBox"; box.className = "hbox sol"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "solT");
    box.innerHTML = '<div class="hcard"><h2 id="solT"></h2><ol class="sols" id="solL"></ol><div class="hbtn"><button type="button" class="hok" id="solGo"></button></div></div>';
    document.body.appendChild(box); $("solGo").addEventListener("click", () => solClose()); }
  const lines = steps.map(x => String(x).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).filter(Boolean);
  $("solT").textContent = "💡 " + (vi ? "Cách giải" : "How to solve it"); $("solGo").textContent = (vi ? "Tiếp" : "Next") + " ➜";
  const ol = $("solL"); ol.innerHTML = ""; lines.forEach((x, i) => { const li = document.createElement("li"); li.textContent = x; if(i === lines.length - 1) li.className = "last"; ol.appendChild(li); });
  SOL_DONE = done; box.hidden = false; clearTimeout(SOL_T); SOL_T = setTimeout(() => solClose(), 9000 + Math.max(0, lines.length - 2) * 2500); solSpeak(lines);
  try{ $("solGo").focus({ preventScroll: true }); }catch(e){}
}
