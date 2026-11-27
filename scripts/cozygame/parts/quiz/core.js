/* Bộ máy câu hỏi trắc nghiệm dùng chung cho game Cozy dạng "đọc → chọn đáp án → xem giải thích" (Bắt Kẻ Nói Dối, Hỏi Xoáy Đáp Xoay).
   Game cung cấp buildQs(seed, n, t) -> [{ic, tg:[vi,en], p:[vi,en], o:[[vi,en]..], ci, w:[vi,en]}]. Không dùng canvas: vẽ DOM vào #qz. */
const CFG = [{ n: 10, lim: 0, tot: 0, lives: 0 }, { n: 99, lim: 0, tot: 60, lives: 0 }, { n: 99, lim: 0, tot: 0, lives: 3 }, { n: 10, lim: 12, tot: 0, lives: 2 }];
const rankIdx = n => n >= 2300 ? 4 : n >= 1700 ? 3 : n >= 1000 ? 2 : n >= 450 ? 1 : 0;
const scoreOf = D => D.pts;
function newGame(seed, mode, t, ch) {
  const C = CFG[t], qs = buildQs(seed, C.n >= 99 ? 40 : C.n, t);
  return { seed, mode, t, ch: ch || null, C, qs, i: 0, ok: 0, bad: 0, pts: 0, combo: 0, maxCombo: 0, time: 0, qt: 0, over: false, reason: "end", beat: false, ans: -1, adv: 0, hq: 0 };
}
const curQ = D => D.qs[D.i];
function qzHtml(D) {
  const q = curQ(D), vi = LANG === "vi", L = a => a[vi ? 0 : 1];
  const opts = q.o.map((o, k) => '<button type="button" class="qzO' + (D.ans >= 0 ? (k === q.ci ? " ok" : k === D.ans ? " no" : "") : "") + '" data-k="' + k + '"' + (D.ans >= 0 ? " disabled" : "") + "><b>" + "ABCD"[k] + "</b><span>" + L(o) + "</span></button>").join("");
  let fb = ""; if (D.ans >= 0) { const good = D.ans === q.ci; fb = '<div class="qzFb ' + (good ? "g" : "b") + '"><b>' + (good ? "✓ " + T("right") : (D.ans === -2 ? "⏱ " + T("late") : "✗ " + T("wrong"))) + "</b><p>" + L(q.w) + "</p>" + (D.C.tot ? "" : '<button type="button" class="btn grow" id="qzNext">' + T(D.i >= D.qs.length - 1 ? "fin" : "next") + " ▶</button>") + "</div>"; }
  return '<div class="qzTop"><span class="qzTag">' + L(q.tg) + '</span><span class="qzNo">' + (D.C.tot || D.C.lives ? "#" + (D.i + 1) : (D.i + 1) + "/" + D.qs.length) + '</span></div><div class="qzCard"><i class="qzAv">' + q.ic + '</i><p class="qzTx">' + L(q.p) + '</p></div><div class="qzOpts">' + opts + "</div>" + fb + '<div class="qzBar"><i id="qzBarI"></i></div>';
}
function renderQ(D) { const h = $("qz"); if (!h || !D || D.over && D.ans < 0) return; h.innerHTML = qzHtml(D); h.dataset.n = curQ(D).o.length; }
function onBegin(D) { renderQ(D); }
function onLang(D) { if (D) { renderQ(D); hud(); } }
function answer(D, k) {
  if (!D || D.over || D.ans >= 0 || paused) return; const q = curQ(D), good = k === q.ci; D.ans = k;
  if (good) { D.ok++; D.combo++; D.maxCombo = Math.max(D.maxCombo, D.combo); const sp = Math.max(0, 1 - D.qt / 8), add = 100 + Math.round(sp * 50) + 10 * Math.min(D.combo - 1, 5); D.pts += add; sfx.ok();
    if (D.combo > 1) sfx.combo(D.combo * 2); NPJuice.text($("play"), "+" + add + (D.combo > 1 ? " ×" + D.combo : ""), { color: "#ffd24a", top: "26%", size: 5.4 }); if (window.NPFx) NPFx.buzz(15); }
  else { D.bad++; D.combo = 0; if (D.C.tot) D.time += 5; sfx.bad(); if (window.NPFx) NPFx.buzz([30, 20, 30]); }
  if (D.C.lives && D.bad >= D.C.lives) { D.dead = true; }
  if (D.C.tot) D.adv = 1.1; renderQ(D); hud();
}
function nextQ(D) {
  if (!D || D.over || D.ans < 0) return;
  if (D.dead) return endNow(D, "dead"); D.i++; D.ans = -1; D.qt = 0; D.adv = 0;
  if (D.i >= D.qs.length) return endNow(D, "win"); renderQ(D); hud();
}
function endNow(D, why) {
  if (D.over) return; D.over = true; D.reason = why;
  if (why === "win" && !D.bad) D.pts += 200; else if (why === "win") D.pts += 80;
  sfx.end(); if (why !== "dead" && why !== "time") NPJuice.confetti($("play"), 24, CONF); else D.flash = 1;
  setTimeout(() => { if (G === D) finish(D); }, 800);
}
function step(D, dt) {
  if (D.over) return;
  if (D.ans < 0) {
    D.time += dt; D.qt += dt;
    if (D.C.tot && D.time >= D.C.tot) return endNow(D, "time");
    if (D.C.lim) { const f = Math.max(0, 1 - D.qt / D.C.lim), b = $("qzBarI"); if (b) b.style.transform = "scaleX(" + f + ")"; if (D.qt >= D.C.lim) { D.ans = -2; D.bad++; D.combo = 0; sfx.bad(); if (D.C.lives && D.bad >= D.C.lives) D.dead = true; renderQ(D); hud(); } }
    else if (D.C.tot) { const b = $("qzBarI"); if (b) b.style.transform = "scaleX(" + Math.max(0, 1 - D.time / D.C.tot) + ")"; }
  } else if (D.adv > 0) { D.adv -= dt; if (D.adv <= 0) nextQ(D); }
  const k = Math.floor(D.time * 4); if (k !== D._q) { D._q = k; hud(); }
}
function HUD(D) {
  const C = D.C, mid = C.tot ? Math.max(0, Math.ceil(C.tot - D.time)) + "s" : C.lives ? "❤️".repeat(Math.max(0, C.lives - D.bad)) + "🖤".repeat(Math.min(C.lives, D.bad)) : Math.min(D.i + 1, D.qs.length) + "/" + D.qs.length;
  return [[scoreOf(D), "sc"], [mid, "tm"], [D.ok, "ex"]];
}
function endChips(D) {
  const n = scoreOf(D); return [TYPES[D.t][0] + " " + L2([TYPES[D.t][1], TYPES[D.t][2]]), "✅ " + D.ok, D.bad ? "✕ " + D.bad : "", D.maxCombo > 1 ? "🔥×" + D.maxCombo : "", (D.prevBest > 0 && n > D.prevBest) ? T("rec") : ""];
}
const shareT = D => L2([TYPES[D.t][1], TYPES[D.t][2]]) + " · ✅ " + D.ok;
function snapP(D) { return D.i > 0 || D.ans >= 0 ? { i: D.i, k: D.ok, b: D.bad, p: D.pts, c: D.combo, t: Math.round(D.time) } : null; }
function restoreP(D, p) {
  D.i = Math.max(0, Math.min(D.qs.length - 1, +p.i | 0)); D.ok = +p.k | 0; D.bad = +p.b | 0; D.pts = Math.max(0, +p.p | 0); D.combo = +p.c | 0; D.time = Math.max(0, +p.t || 0); D.ans = -1; D.qt = 0; renderQ(D); hud();
}
document.addEventListener("click", e => {
  const o = e.target.closest && e.target.closest(".qzO"); if (o && G) { answer(G, +o.dataset.k); return; }
  if (e.target.closest && e.target.closest("#qzNext") && G) nextQ(G);
});
addEventListener("keydown", e => {
  if (!G || G.over || $("game").hidden) return; const k = "1234".indexOf(e.key);
  if (k >= 0 && k < curQ(G).o.length) answer(G, k); else if ((e.key === "Enter" || e.key === " ") && G.ans >= 0 && !G.C.tot) { e.preventDefault(); nextQ(G); }
});
