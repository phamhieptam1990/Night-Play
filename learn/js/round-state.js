/* ---------- vòng chơi ---------- */
let cur = 0, tries = 0, stars = 0, streak = 0, best = 0, wrongTags = {}, locked = false, roundStars = 0;
const LM = window.LearnMascot, SUBF = {toan:"math", tviet:"vietnamese", tanh:"english"};
const hd = (k, g) => { const f = SUBF[k]; return "../shared/art/learn/" + f + "/" + f + (g ? "_grade_" + g : "_base") + ".svg"; };
function err(tag){ wrongTags[tag] = (wrongTags[tag] || 0) + 1; }   /* đếm lỗi trong vòng (lời nhắc cuối vòng); tiến độ lâu dài do E.record ghi */
function burst(btn){ const r = btn.getBoundingClientRect(); for(let i = 0; i < 6; i++){ const s = document.createElement("span"); s.className = "fx";
  s.textContent = ["⭐", "✨", "🌟"][i % 3]; s.style.left = (r.left + r.width / 2) + "px"; s.style.top = (r.top + r.height / 2) + "px";
  s.style.setProperty("--dx", (rnd(-70, 70)) + "px"); document.body.appendChild(s); setTimeout(() => s.remove(), 950); } }
function dots(){ document.querySelector(".dots").classList.toggle("many", ROUND_N > 5); 
  const d = $("dots"); d.querySelectorAll("i").forEach(x => x.remove());
  let trk = d.querySelector(".trk"), rn = d.querySelector(".rn");
  if(!trk){ trk = document.createElement("span"); trk.className = "trk"; trk.innerHTML = "<b></b>"; d.prepend(trk); }
  if(!rn){ rn = document.createElement("span"); rn.className = "rn"; rn.innerHTML = "<img alt=\"\">"; d.appendChild(rn); }
  for(let i = 0; i < ROUND_N; i++){ const e = document.createElement("i"); const st = bank[i] && bank[i].res; e.className = st === "ok" ? "on" : st === "miss" ? "miss" : i === cur
    ? "cur" : ""; e.style.left = (i * 100 / (ROUND_N - 1)) + "%"; d.insertBefore(e, rn); }
  const sj = LM.SUBJ[subj], im = rn.querySelector("img"), want = "../shared/art/learn/" + sj.f + "/" + sj.f + "_head.svg";
  rn.dataset.m = sj.m; if(im.getAttribute("src") !== want) im.src = want;
  const at = Math.min(cur, ROUND_N - 1), prev = rn.dataset.at, pc = at * 100 / (ROUND_N - 1); rn.dataset.at = at; rn.style.left = pc + "%"; trk.firstChild.style.width = pc + "%";
  if(prev != null && prev != at){ rn.classList.remove("hop"); void rn.offsetWidth; rn.classList.add("hop"); }
}
