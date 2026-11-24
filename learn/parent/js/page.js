"use strict";
function chrome(){
  const u = U(); document.documentElement.lang = lang; document.title = "Học Vui: " + u.title; $("ttl").textContent = u.title; $("back").setAttribute("aria-label", u.back);
    $("back").href = "/learn/index.html?lang=" + lang;
  $("lang").textContent = lang === "vi" ? "EN" : "VI"; $("sub").textContent = u.sub; $("h1o").textContent = u.overview; $("h2g").textContent = u.goalsH;
    $("goalsP").textContent = u.goalsP; $("h2d").textContent = u.learnedH; $("learnedP").textContent = u.learnedP; $("h2m").textContent = u.map; $("h2w").textContent = u.weak;
    $("h2l").textContent = u.limit; $("h2s").textContent = u.settings;
  $("exit").textContent = u.exit; $("exit").href = "/learn/index.html?lang=" + lang; $("priv").textContent = u.privacy; paintGate();
}
function weekly(){
  const el = $("weekly"); if(!el || !window.Habit) return; const vi = lang !== "en", r = Habit.report(lang), w = Habit.week(), dn = vi ? ["CN","T2","T3","T4","T5","T6",
    "T7"] : ["Su","Mo","Tu","We","Th","Fr","Sa"];
  el.innerHTML = '<h3 style="margin:0 0 8px">' + (vi ? "📰 Bản tin tuần của bé" : "📰 This week's news") + '</h3>' + r.lines.map(x => '<p style="margin:4px 0">• ' + esc(x) + '</p>').join("") +
    '<div style="display:flex;gap:6px;margin:10px 0">' + w.days.map(d =>
      '<span style="flex:1;text-align:center;font-size:12px"><i style="display:block;height:10px;border-radius:99px;margin-bottom:3px;background:' + (d.on
      ? "#4CC764" : "var(--line)") + '"></i>' + dn[d.dow] + '</span>').join("") + '</div>' +
    '<p style="margin:4px 0;font-size:13px;opacity:.8">' + (vi
      ? "Tổng cộng bé đã học " + w.total + " ngày. Nghỉ vài hôm không mất gì cả." : "Total " + w.total + " learning days. Breaks cost nothing.") + '</p>' +
    (r.praise ? '<p style="margin:8px 0 4px"><b>' + (vi ? "💬 Câu nên khen bé: " : "💬 Praise to say: ") + '</b>' + esc(r.praise) + '</p>' : "") +
    (r.ask ? '<p style="margin:4px 0"><b>' + (vi ? "🗣️ Trò chuyện tối nay: " : "🗣️ Tonight's chat: ") + '</b>' + esc(r.ask) + '</p>' : "");
}
function headIcons(){ [["h1o","📊"],["h2g","🎯"],["h2d","📚"],["h2m","🗺️"],["h2w","💡"],["h2l","⏱️"],["h2s","⚙️"]].forEach(a => { const h = $(a[0]);
  if(!h || h.querySelector(".hi")) return; const sp = document.createElement("span"); sp.className = "hi"; sp.setAttribute("aria-hidden", "true");
  sp.innerHTML = window.LearnIcons ? LearnIcons.html(a[1]) : a[1]; h.insertBefore(sp, h.firstChild); }); }
function render(){ document.body.dataset.subj = subj; chrome(); headIcons(); headH(); navBar(); overview(); weekly(); tabs(); goals(); learned(); skillMap(); weak(); limit(); settings(); }
$("lang").onclick = () => { lang = lang === "vi" ? "en" : "vi"; ls("lang", lang); $("gm").textContent = ""; if($("dash").hidden) chrome(); else render(); };
$("theme").onclick = () => { const d = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = d; ls("theme", d); };
chrome(); newSum();
if(passed()) open_(); else $("gi").focus();
