"use strict";
/* Khám Phá Vũ Trụ — ván chơi: tên lửa bay qua 5 trạm; mỗi trạm một câu hỏi 3 đáp án + một điều thú vị. Cấp chọn bậc câu hỏi (bậc ≤ cấp). */
const NS = 5; let slock = false;
const idx = L => (L === "vi" ? 0 : 1);
Q.start = function (g) {
  const pool = BANK[g.t].filter(q => q[0] <= g.lv), qs = shuffle(pool).slice(0, NS).map(q => {
    const ans = [q[4], q[5], q[6]], order = shuffle([0, 1, 2]); return { q, order, ci: order.indexOf(0), pick: -1 };
  });
  Object.assign(g, { qs, i: 0, ok: 0, combo: 0, pts: 0 });
  $("stage").innerHTML = '<div class="spTrack" id="spTrack"></div><div class="spObj" id="spObj"></div><div class="spQ" id="spQ"></div><div class="spAns" id="spAns"></div><div class="spFact" id="spFact" hidden></div>';
  $("arena").dataset.th = g.t; showStop(g);
};
Q.hud = g => ["🛰️ " + T("stop") + " " + Math.min(g.i + 1, NS) + "/" + NS, "⭐ " + g.ok + (g.combo >= 2 ? " 🔥" + g.combo : "")];
Q.snap = g => ({ i: g.i, k: g.ok, p: g.pts, c: g.combo });
Q.restore = (g, x) => { g.i = Math.max(0, Math.min(NS - 1, +x.i || 0)); g.ok = Math.max(0, +x.k || 0); g.pts = Math.max(0, +x.p || 0); g.combo = Math.max(0, +x.c || 0); showStop(g); };
Q.relang = g => { if (!g.over) showStop(g, true); };
function drawTrack(g) {
  let h = ""; for (let k = 0; k < NS; k++) h += '<u class="' + (k < g.i ? "dn" : k === g.i ? "cur" : "") + '"></u>';
  $("spTrack").innerHTML = '<div class="line">' + h + '</div><i class="rk" style="left:calc(' + (g.i / (NS - 1) * 100) + '% - 3.4cqw)">🚀</i>';
}
function showStop(g, keep) {
  if (g.over) return; slock = false; const s = g.qs[g.i], q = s.q, L = idx(LANG); drawTrack(g);
  const vis = q[1]; $("spObj").innerHTML = vis[0] === "#" ? '<span class="pl" style="--c:' + vis + '"></span>' : "<span class=\"em\">" + vis + "</span>";
  $("spQ").textContent = q[2 + L]; $("spFact").hidden = true; $("spAns").hidden = false; $("spAns").innerHTML = "";
  s.order.forEach((src, k) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "ans"; b.textContent = q[4 + src][L]; b.onclick = () => choose(k); $("spAns").appendChild(b);
  });
  if (keep && s.pick >= 0) mark(g);
  updHud();
}
function mark(g) {
  const s = g.qs[g.i], bs = $("spAns").children; [...bs].forEach((b, k) => { b.disabled = true; if (k === s.ci) b.classList.add("ok"); else if (k === s.pick) b.classList.add("no"); });
}
function choose(k) {
  const g = Q_API.G; if (!g || g.over || slock || paused) return; slock = true; const s = g.qs[g.i], L = idx(LANG), good = k === s.ci; s.pick = k; sfx.pick(); mark(g);
  if (good) { g.ok++; g.combo++; const gain = 100 + Math.min(5, g.combo - 1) * 10; g.pts += gain; sfx.ok(); if (g.combo >= 3) sfx.combo(g.combo);
    if (window.NPJuice) NPJuice.text($("play"), "+" + gain + " ⭐", { color: NPJuice.tierColor(Math.min(3, g.combo - 1)), top: "14%", size: 6 }); }
  else { g.combo = 0; sfx.no(); if (window.NPFx) NPFx.buzz(30); }
  updHud(); setTimeout(() => showFact(g, good), 650);
}
function showFact(g, good) {
  const s = g.qs[g.i], L = idx(LANG), f = $("spFact"), last = g.i >= NS - 1;
  f.hidden = false; $("spAns").hidden = true;
  f.innerHTML = '<b>' + (good ? "⭐ " + T("good") : "💫 " + T("bad") + " " + s.q[4][L]) + '</b><small>' + T("fact") + '</small><p></p><button type="button" class="btnbig" id="spNext"></button>';
  f.querySelector("p").textContent = s.q[7 + L]; $("spNext").textContent = last ? "🏁 " + T("fin") : "🚀 " + T("next"); $("spNext").onclick = () => nextStop(g);
  say(s.q[7 + L]);
}
function nextStop(g) {
  if (g.over) return; if (g.i >= NS - 1) { const stars = g.ok >= 5 ? 3 : g.ok >= 3 ? 2 : g.ok >= 1 ? 1 : 0; g.info = T("info", { n: g.ok }); return finish({ score: g.pts + (g.ok === NS ? 100 : 0), stars }); }
  g.i++; updHud(); drawTrack(g); setTimeout(() => showStop(g), 420);
}
addEventListener("keydown", e => { const g = Q_API.G; if (!g || g.over || $("arena").hidden || paused) return; const d = +e.key; if (d >= 1 && d <= 3 && !$("spAns").hidden) choose(d - 1); else if (e.key === "Enter" && $("spNext")) $("spNext").click(); });
