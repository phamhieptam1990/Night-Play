"use strict";
/* ---------- vẽ bảng điều khiển ---------- */
const DOW = { vi: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"], en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] };
const fmtMin = s => Math.max(0, Math.round(s / 60));
function hd(k){ return "../../shared/art/learn/" + SF[k] + "/" + SF[k] + "_head.svg"; }
function overview(){
  const u = U(), days = E.daily(7), n7 = days.reduce((a, d) => a + d.n, 0), ok7 = days.reduce((a, d) => a + d.ok, 0), today = days[6];
  let solid = 0; SUBJ.forEach(s => E.summary(s).skills.forEach(k => { if(k.level === "proficient" || k.level === "advanced") solid++; }));
  const tile = (v, t) => '<div class="tile"><b>' + v + "</b><span>" + esc(t) + "</span></div>";
  $("tiles").innerHTML = tile(today.n, u.ovToday + " (" + u.q + ")") + tile(n7, u.ovQ) + tile(n7 ? Math.round(ok7 * 100 / n7) + "%" : "–", u.ovAcc + " · " + u.acc) + tile(solid, u.ovSkills);
  const mx = Math.max(1, ...days.map(d => d.n));
  $("chart").innerHTML = days.map((d, i) => '<div class="col' + (i === 6 ? " now" : "") + '"><span class="v">' + (d.n || "") + '</span><span class="b' + (d.n
    ? "" : " z") + '" style="height:' + (d.n ? Math.max(6, Math.round(d.n / mx * 100)) : 4) + '%"></span><span class="d">' + DOW[lang][d.dow] + "</span></div>").join("");
  $("chart").setAttribute("aria-label", u.week + ": " + days.map(d => DOW[lang][d.dow] + " " + d.n).join(", "));
  $("legend").textContent = n7 ? u.week + " · " + u.q : u.noData;
}
function tabs(){
  const u = U(); $("tabs").innerHTML = SUBJ.map(k => '<button class="tab" role="tab" type="button" data-k="' + k + '" aria-selected="' + (k === subj) + '"><img src="' + hd(
    k) + '" alt=""><span>' + esc(u.tabs[k]) + "</span></button>").join("");
  $("tabs").querySelectorAll(".tab").forEach(b => b.onclick = () => { subj = b.dataset.k; ls("learn:subj", subj); render(); });
}
function skillMap(){
  const u = U(), S = E.summary(subj), byG = {};
  if(!S.skills.some(k => k.n > 0)){ $("map").innerHTML = '<div class="empty">' + esc(u.noDataSubj) + "</div>"; return; }
  S.skills.forEach(k => { const g = (E.SKILLS[k.id] || E.TRACKED[k.id]).grades[0]; (byG[g] = byG[g] || []).push(k); });
  const idx = { not_started: 0, emerging: 1, developing: 2, proficient: 4, advanced: 5 };
  const nSk = S.skills.length, body = Object.keys(byG).sort().map(g => '<div class="gl">' + u.l.charAt(0).toUpperCase() + u.l.slice(1) + " " + g + "</div>" + byG[g].map(k => {
    const nm = C.SKILL[k.id][L()], lv = cap(u.m4[k.m4 || 0]), on = k.m4 || 0;
    return '<div class="sk" data-m="' + (k.m4 || 0) + '"><b>' + esc(nm) + '</b><span class="lv">' + esc(lv) + '</span><div class="meter" aria-hidden="true">' + [1, 2, 3,
      4].map(i => "<i" + (i <= on ? ' class="on"' : "") + "></i>").join("") + "</div>" + (k.n ? '<span class="n">' + k.n + " " + u.q + " · " + Math.round(
      k.p * 100) + "%</span>" : "") + "</div>";
  }).join("")).join("");
  /* thu gọn: danh sách đầy đủ mọi kỹ năng (đã có tóm tắt theo chủ đề ở "Mục tiêu đạt được") */
  $("map").innerHTML = '<details class="tpc"><summary><span class="ic" aria-hidden="true">🗺️</span><b>' + nSk + " " + esc(
    u.skillsK) + '</b><span class="cnt" aria-hidden="true">▾</span></summary><div class="bd">' + body + "</div></details>";
}
