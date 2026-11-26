"use strict";
/* ---------- mục tiêu đạt được theo lớp + bé đã học gì (gồm lần xem gợi ý) ---------- */
let gsel = 0;
const cap = x => x.charAt(0).toUpperCase() + x.slice(1), LVN = { not_started: 0, emerging: 1, developing: 2, proficient: 3, advanced: 4 };
function goals(){
  const u = U(), cur = window.LEARN_CURRICULUM; if(!cur){ $("goals").innerHTML = ""; return; }
  const g = gsel || PG || +ls("learn:grade") || 1, all = [1, 2, 3, 4, 5].map(x => E.goals(subj, x, cur)), G = all[g - 1], pct = G.total ? Math.round(G.solid * 100 / G.total) : 0,
    learning = Math.max(0, G.started - G.solid), notYet = Math.max(0, G.total - G.started);
  let h = '<div class="hero"><div class="ring" style="--p:' + pct + '" role="img" aria-label="' + pct + '%"><b>' + pct + '%</b></div><div class="tx"><h3>' + esc(cap(
    u.l) + " " + g) + ' · ' + G.solid + " " + esc(u.ofK) + " " + G.total + " " + esc(u.skillsK) + " " + esc(u.solidK) + "</h3><p>" + learning + " " + esc(
    u.learningK) + " · " + notYet + " " + esc(u.notYetK) + "</p></div></div>";
  h += '<div class="gsel" role="group" aria-label="' + esc(u.grade) + '">' + all.map((x, i) => '<button type="button" data-g="' + (i + 1) + '" aria-pressed="' + (
    i + 1 === g) + '">' + (i + 1) + "<small>" + (x.total ? Math.round(x.solid * 100 / x.total) : 0) + "%</small></button>").join("") + "</div>";
  h += '<div class="m4lg" role="list" aria-label="' + esc(u.m4t) + '"><b>' + esc(u.m4t) + '</b>' + [1, 2, 3, 4].map(i => '<span role="listitem" data-m="' + i + '"><i></i>' + esc(
    u.m4[i]) + '</span>').join('') + '</div>';
  if(G.next.length) h += '<div class="nxt"><h3>' + esc(u.nextH) + '</h3><div class="nx">' + G.next.map(id => "<span>" + esc(C.SKILL[id][L()]) + "</span>").join("") + "</div></div>";
  else if(G.total) h += '<div class="ok">✅ ' + esc(u.nextNone) + "</div>";
  const grp = {}, order = []; G.topics.forEach(t => { if(!grp[t.tag]){ grp[t.tag] = []; order.push(t.tag); } grp[t.tag].push(t); });
  h += order.map((tag, gi) => '<div class="gg g' + (gi % 5) + '"><div class="gtag">' + esc(tag) + "</div>" + grp[tag].map(t => {
    const ic = '<span class="ic" aria-hidden="true">' + esc(t.icon || "📘") + "</span>";
    if(!t.total) return '<div class="tpc soon"><div class="row">' + ic + "<div><b>" + esc(t.name) + "</b><br><span>" + esc(u.soon) + "</span></div></div></div>";
    const sp = Math.round(t.solid * 100 / t.total), lp = Math.round(Math.max(0, t.started - t.solid) * 100 / t.total);
    return '<details class="tpc"><summary>' + ic + "<b>" + esc(
      t.name) + '</b><span class="cnt">' + t.solid + "/" + t.total + '</span><span class="stack" aria-hidden="true"><i class="s" style="width:' + sp
        + '%"></i><i class="l" style="width:' + lp + '%"></i></span></summary><div class="bd">' +
      t.skills.map(k => '<div class="sk2"><span class="nm">' + esc(C.SKILL[k.id][L()]) + (k.n ? "<small>" + k.n + " " + esc(u.q) + " · " + Math.round(
        k.p * 100) + "%</small>" : "") + '</span><span class="rt"><span class="pill" data-m="' + (k.m4 || 0) + '">' + esc(cap(u.m4[k.m4
        || 0])) + '</span><span class="m4" aria-hidden="true" data-m="' + (k.m4 || 0) + '">' + [1, 2, 3, 4].map(i => "<i" + (i <= (k.m4 || 0)
        ? ' class="on"' : "") + "></i>").join("") + "</span></span></div>").join("") + "</div></details>";
  }).join("") + "</div>").join("");
  $("goals").innerHTML = h;
  $("goals").querySelectorAll("[data-g]").forEach(b => b.onclick = () => { gsel = +b.dataset.g; goals(); });
}
function dayLabel(d){
  const u = U(), y = new Date(); y.setDate(y.getDate() - 1);
  if(d.date === E.dayKey()) return u.ovToday; if(d.date === E.dayKey(y)) return u.yest;
  const p = d.date.split("-"); return DOW[lang][d.dow] + " " + (+p[2]) + "/" + (+p[1]);
}
function learned(){
  const u = U(); let h = "";
  if(!E.detailOn()){
    h = '<div class="empty">' + esc(u.detailOffMsg) + '</div><button class="btn ghost" id="dkOn" type="button">' + esc(u.detailOnBtn) + "</button>";
  } else {
    const days = E.dayDetail(7).reverse().map(d => ({ date: d.date, dow: d.dow, items: d.items.filter(x => x.subj === subj) })).filter(d => d.items.length), agg = {};
    days.forEach(d => d.items.forEach(x => { const a = agg[x.id] || (agg[x.id] = { n: 0, h: 0 }); a.n += x.n; a.h += x.h; }));
    const hard = Object.keys(agg).filter(id => agg[id].h >= 2 && agg[id].h >= .3 * Math.max(1, agg[id].n)).sort((a, b) => agg[b].h - agg[a].h).slice(0, 3);
    if(hard.length) h += '<div class="hbx"><span aria-hidden="true">💡</span><div><b>' + esc(u.needHints) + "</b><p>" + hard.map(id => esc(C.SKILL[id][L(
      )]) + " (" + agg[id].h + ")").join(" · ") + "</p></div></div>";
    h += days.length ? days.map(d => {
      const n = d.items.reduce((a, x) => a + x.n, 0), ok = d.items.reduce((a, x) => a + x.ok, 0);
      return '<div class="dayc"><div class="dayh"><b>' + esc(dayLabel(d)) + "</b><span>" + n + " " + esc(u.q) + (n
        ? " · " + Math.round(ok * 100 / n) + "% " + esc(u.rightK) : "") + '</span></div><div class="sch">' +
        d.items.map(x => '<span class="sc">' + esc(C.SKILL[x.id][L()]) + (x.n ? " <em>×" + x.n + "</em>" : "") + (x.h
          ? ' <span class="hn" title="' + esc(u.hintK) + '">💡 ' + x.h + "</span>" : "") + "</span>").join("") + "</div></div>";
    }).join("") : '<div class="empty">' + esc(u.learnedEmpty) + "</div>";
    h += '<p class="note" style="margin-top:12px">' + esc(u.detailNote) + '</p><div class="acts"><button class="btn ghost" id="dkOff" type="button">' + esc(
      u.detailOffBtn) + '</button><button class="btn ghost" id="dkClr" type="button">' + esc(u.clearDetail) + "</button></div>";
  }
  $("learned").innerHTML = h;
  const on = $("dkOn"), off = $("dkOff"), clr = $("dkClr");
  if(on) on.onclick = () => { E.setDetail(true); learned(); }; if(off) off.onclick = () => { E.setDetail(false); learned(); };
  if(clr) clr.onclick = () => { E.clearDetail(); learned(); toast(u.clearDone); };
}
function weak(){
  const u = U(), S = E.summary(subj), tg = {};
  S.skills.forEach(k => Object.keys(k.tags || {}).forEach(t => { tg[t] = (tg[t] || 0) + k.tags[t]; }));
  const tops = Object.keys(tg).sort((a, b) => tg[b] - tg[a]).slice(0, 3), ws = S.weakest.slice(0, 4);
  let h = "";
  if(!S.skills.some(k => k.n > 0)){ h = '<div class="empty">' + esc(u.noDataSubj) + "</div>"; }
  else {
    h += ws.length ? ws.map(id => { const k = S.skills.find(x => x.id === id), pc = Math.round(k.p * 100); return '<div class="wk wsk"><div class="wr"><h3>' + esc(C.SKILL[id][L(
      )]) + '</h3><span class="ct" title="' + esc(
      u.acc) + '">' + pc + '%</span></div><div class="wbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pc + '" aria-label="' + esc(
      u.acc) + '"><i style="width:' + Math.max(4, pc) + '%"></i></div><p class="wm">' + k.n + " " + esc(u.q) + " · " + esc(cap(C.LEVEL[k.level][L()])) + " · " + pc + "% " + esc(
      u.acc) + "</p></div>"; }).join("") : '<div class="ok">✅ ' + esc(u.weakNone) + "</div>";
    if(tops.length) h += '<h3 class="sub2">' + esc(cap(u.tips)) + "</h3>" + tops.map(t => { const c = C.TAG[t] || C.TAG.other, o = L();
      return '<div class="wk tipc"><h3>' + esc(cap(c[o])) + '<span class="ct">' + tg[t] + " " + esc(u.times) + "</span></h3><p>" + esc(c[2 + o]) + '</p><p class="tp"><b>' + esc(
      u.tryIt) + "</b>" + esc(c[4 + o]) + "</p></div>"; }).join("");
    else h += '<p class="note">' + esc(u.tipsEmpty) + "</p>";
  }
  $("weak").innerHTML = h;
}
function limit(){
  const u = U(), cur = LL.getLimit(), used = LL.usedSec(), allow = LL.allowedSec(), opts = [0, 15, 30, 45, 60, 90];
  let h = '<p class="note">' + esc(u.limitP) + '</p><div class="chips" role="group" aria-label="' + esc(u.limit) + '">' + opts.map(m =>
    '<button class="chip" type="button" data-m="' + m + '" aria-pressed="' + (m === cur) + '">' + (m ? m + " " + u.min : esc(u.off)) + "</button>").join("") + "</div>";
  if(cur){ const pct = Math.min(100, Math.round(used / allow * 100)); h += '<div class="pb' + (pct >= 100
    ? " full" : "") + '" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="width:' + pct + '%"></i></div><p class="pl">' + esc(
    u.used) + ": " + fmtMin(used) + " / " + (cur + LL.bonusMin()) + " " + u.min + " · " + esc(u.left) + " " + fmtMin(Math.max(0,
    allow - used)) + " " + u.min + '</p><button class="btn ghost" id="bonus" type="button">' + esc(u.unlock) + "</button>"; }
  else h += '<p class="pl">' + esc(u.used) + ": " + fmtMin(used) + " " + u.min + "</p>";
  $("limit").innerHTML = h;
  $("limit").querySelectorAll(".chip").forEach(b => b.onclick = () => { LL.setLimit(+b.dataset.m); limit(); });
  const bn = $("bonus"); if(bn) bn.onclick = () => { LL.addBonus(10); limit(); toast(u.unlocked); };
}
function settings(){
  const u = U(), g = PG || +ls("learn:grade") || 1;
  $("set").innerHTML = '<p class="note" style="margin-bottom:4px"><b>' + esc(u.grade) + '</b></p><div class="grades" role="group" aria-label="' + esc(u.grade) + '">' + [1, 2, 3, 4,
    5].map(i => '<button class="chip" type="button" data-g="' + i + '" aria-pressed="' + (i === g) + '">' + i + "</button>").join(
    "") + '</div><hr style="border:0;border-top:1px solid var(--line);margin:16px 0"><p class="note"><b>' + esc(u.reset) + "</b><br>" + esc(
    u.resetP) + '</p><button class="btn danger" id="rs" type="button">' + esc(
    u.reset) + '</button><hr style="border:0;border-top:1px solid var(--line);margin:16px 0"><p class="note"><b>' + esc(u.backup) + "</b><br>" + esc(
    u.backupP) + '</p><div class="acts"><button class="btn" id="bkd" type="button">' + esc(u.bkDown) + '</button><button class="btn ghost" id="bku" type="button">' + esc(
    u.bkUp) + '</button></div><input id="bkf" type="file" accept="application/json,.json" hidden>';
  $("set").querySelectorAll("[data-g]").forEach(b => b.onclick = () => { ls("learn:grade", b.dataset.g); PG = 0; settings(); });
  $("bkd").onclick = () => { try{ const b = new Blob([JSON.stringify(Backup.collect())], { type: "application/json" }
    ), url = URL.createObjectURL(b), a = document.createElement("a"); a.href = url; a.download = Backup.filename(); document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000); toast(u.bkSaved); }catch(e){ toast(u.bkBad); } };
  $("bku").onclick = () => $("bkf").click();
  $("bkf").onchange = () => { const f = $("bkf").files[0]; $("bkf").value = ""; if(!f) return; if(f.size > 2500000){ toast(u.bkBad); return; }
    const r = new FileReader(); r.onerror = () => toast(u.bkBad);
    r.onload = () => { let o = null; try{ o = JSON.parse(String(r.result)); }catch(e){} if(!Backup.validate(o).ok){ toast(u.bkBad); return; }
      askYes(u.bkAsk, u.bkAskP, u.bkYes, () => { try{ Backup.apply(o); try{ sessionStorage.removeItem("learn:slot"); }catch(e){} toast(U().bkDone); setTimeout(() => location.reload(), 900); }catch(e){ toast(u.bkBad); } }); };
    r.readAsText(f); };
  $("rs").onclick = () => askYes(u.resetAsk, u.resetP, u.resetYes, () => { E.resetAll(); if(window.Farm) Farm.resetAll(); render(); toast(U().resetDone); });
}
let tt = 0; function toast(m){ const t = $("toast"); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(() => t.hidden = true, 2200); }
$("aN").onclick = () => { $("ask").hidden = true; };
