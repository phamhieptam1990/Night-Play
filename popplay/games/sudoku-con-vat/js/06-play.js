"use strict";
/* Sudoku Con Vật — ván chơi: vẽ bàn, chạm ô + chạm con vật, nhắc nhẹ khi sai (không bao giờ thua), gợi ý, quay lại, kết thúc. */
let prog = Object.assign({ solved: 0, perfect: 0 }, LS.get("sd-prog", {}));
let LVL = Math.min(3, Math.max(1, +LS.get("sd-lv", 1) || 1)), G = null, CH = null, payFor = null, skFor = 0, gateBack = "ovPay", endAt = 0;
const BOOT_H = !!(window.NP && NP.helper), HELPER = BOOT_H && !(NP.resumeBoot && NP.resumeBoot());
const HS = BOOT_H && NP.initialState && typeof NP.initialState === "object" ? NP.initialState : null;
const saveProg = () => { if (!HELPER) LS.set("sd-prog", prog); };
/* Thử thách Night Pass (khung chung shared/npchallenge.js): cấp khó nhất, hạt giống cố định */
window.NP_CHALLENGE = { id: "sudoku-con-vat", start() { begin(1, { seed: 20261125, lv: 3 }); }, judge(r) { return !!r && !!r.extra && r.extra.lv === 3 && r.extra.stars === 3; } };

/* level vượt cấp 8 (bo = NPLevel.boost): ít gợi ý ô hơn tới sàn của bàn (xem CLUE_FLOOR) + số lượt 💡 giảm dần (còn tối thiểu 1) */
const hintMax = bo => (bo ? Math.max(1, 3 - Math.floor(bo / 6)) : 99);
function begin(t, o) {
  o = o || {}; if (window.NPAudio) NPAudio.silence(); showOv(null);
  const lv = o.lv || LVL, seed = o.seed != null ? o.seed : Math.floor(MR() * 1e9), bo = o.bo || 0, Pz = makePuzzle(t, lv, seed, bo);
  G = { t, lv, bo, hmax: hintMax(bo), seed, Pz, val: Pz.puz.slice(), mv: [], sel: -1, brush: 0, mist: 0, hints: 0, over: false, combo: 0, hs: {}, bad: -1, hl: -1,
    daily: o.daily || null, ch: o.ch || null };
  $("home").hidden = true; $("arena").hidden = false; $("homeBtn").hidden = false;
  const sk = skinOf(t); applyVars($("play"), sk); skCss(sk); fillDeco(sk); $("play").dataset.ty = t; $("play").dataset.sk = PF.skinSel[t];
  render(); updHud(); if (window.NP) NP.start(); say(T("say.start")); return G;
}
const leftCount = g => g.val.reduce((a, v) => a + (v ? 0 : 1), 0);
function render() {
  if (!G) return;
  const P = G.Pz, N = P.N, an = skinOf(G.t).an, box = $("board"), selV = G.sel >= 0 ? G.val[G.sel] : G.brush;
  box.style.setProperty("--n", N); box.innerHTML = ""; box.className = "brd n" + N;
  for (let i = 0; i < N * N; i++) {
    const r = Math.floor(i / N), c = i % N, b = document.createElement("button"), v = G.val[i];
    b.type = "button"; b.dataset.i = i; b.setAttribute("aria-label", (LANG === "vi" ? "Hàng " : "Row ") + (r + 1) + (LANG === "vi" ? ", cột " : ", col ") + (c + 1));
    let cls = "c" + ((Math.floor(r / P.T.br) + Math.floor(c / P.T.bc)) % 2 ? " b2" : "");
    if ((c + 1) % P.T.bc === 0 && c < N - 1) cls += " rr"; if ((r + 1) % P.T.br === 0 && r < N - 1) cls += " bb";
    if (P.T.diag && (r === c || r + c === N - 1)) cls += " dg";
    if (P.puz[i]) cls += " gv"; if (G.sel === i) cls += " sel";
    else if (G.sel >= 0 && P.P[G.sel].includes(i)) cls += " pe";
    if (selV && v === selV && G.sel !== i) cls += " sm"; if (G.bad === i) cls += " bad"; if (G.hl === i) cls += " hl";
    b.className = cls; if (v) { const e = document.createElement("i"); e.textContent = an[v - 1]; b.appendChild(e); if (G.pop === i) b.classList.add("pop"); }
    b.onclick = () => tapCell(i); box.appendChild(b);
  }
  box.style.setProperty("--bs", box.clientWidth + "px");
  const pal = $("pal"), cnt = new Array(N + 1).fill(0); G.val.forEach(v => { if (v) cnt[v]++; });
  pal.innerHTML = ""; pal.style.setProperty("--n", N);
  for (let d = 1; d <= N; d++) {
    const b = document.createElement("button"); b.type = "button"; b.className = "pk" + (G.brush === d ? " on" : "") + (cnt[d] >= N ? " done" : "");
    b.innerHTML = "<i>" + an[d - 1] + "</i><b>" + (N - cnt[d] > 0 ? N - cnt[d] : "✓") + "</b>"; b.dataset.d = d; b.setAttribute("aria-label", an[d - 1]); b.onclick = () => tapAnimal(d); pal.appendChild(b);
  }
  G.pop = -1; $("undoBtn").disabled = !G.mv.length || G.over; $("hintBtn").disabled = G.over || !leftCount(G) || G.hints >= G.hmax; $("hintBtn").innerHTML = "💡" + (G.hints ? "<sub>" + G.hints + "</sub>" : "");
}
if (window.ResizeObserver) new ResizeObserver(() => { const b = $("board"); if (b && b.clientWidth) b.style.setProperty("--bs", b.clientWidth + "px"); }).observe($("board"));
function updHud() {
  if (!G) return;
  $("hl").textContent = "🐾 " + leftCount(G) + " " + T("left"); $("hr").textContent = (G.combo >= 2 ? "🔥×" + G.combo + " · " : "") + "✕ " + G.mist;
}
function tapCell(i) {
  if (!G || G.over || paused) return; G.hl = -1;
  if (G.Pz.puz[i]) { G.sel = G.sel === i ? -1 : i; G.brush = 0; sfx.pick(); render(); return; }
  if (G.brush && !G.val[i]) { place(i, G.brush); return; }
  G.sel = G.sel === i ? -1 : i; sfx.pick(); render();
}
function tapAnimal(d) {
  if (!G || G.over || paused) return; G.hl = -1;
  if (G.sel >= 0 && !G.Pz.puz[G.sel] && !G.val[G.sel]) { place(G.sel, d); return; }
  G.brush = G.brush === d ? 0 : d; sfx.pick(); render();
}
function flashBad(i) { G.bad = i; render(); setTimeout(() => { if (G && G.bad === i) { G.bad = -1; render(); } }, 650); }
function place(i, v) {
  if (G.over) return; const P = G.Pz;
  if (v === P.sol[i]) {
    G.val[i] = v; G.mv.push(i); G.sel = -1; G.pop = i; G.combo++; sfx.put(); if (window.NPFx) NPFx.buzz(15);
    if (G.combo >= 3) comboFx();
    render(); updHud(); if (G.val.every((x, k) => x === P.sol[k])) finish(); return;
  }
  G.mist++; G.combo = 0; sfx.no(); say(T("say.bad")); if (window.NPFx) NPFx.buzz(40);
  const dup = dupPeers(P, G.val, i, v); toast(T(dup.length ? "w.dup" : "w.no"), 1800, "warn");
  G.sel = i; flashBad(i); updHud();
}
function comboFx() {
  const k = G.combo, tier = Math.min(3, k - 3); NPJuice.text($("play"), T("cmb")[tier] + " ×" + k, { color: NPJuice.tierColor(tier), top: "14%" });
  sfx.combo(k); if (k >= 6) NPJuice.flash($("play"));
}
function undo() {
  if (!G || G.over) return; if (!G.mv.length) { toast(T("w.undo"), 1200); return; }
  const i = G.mv.pop(); G.val[i] = 0; G.hs[i] = 0; G.sel = i; G.combo = 0; render(); updHud();
}
function resetPuz() { if (!G || G.over) return; G.val = G.Pz.puz.slice(); G.mv = []; G.sel = -1; G.brush = 0; G.combo = 0; G.hs = {}; G.hl = -1; render(); updHud(); }
function hint() {
  if (!G || G.over) return; if (G.hints >= G.hmax) { toast(LANG === "vi" ? "Hết lượt gợi ý" : "No hints left", 1500); return; }
  const P = G.Pz; let i = G.sel;
  if (i < 0 || P.puz[i] || G.val[i]) {
    let best = -1, bn = 99;
    for (let k = 0; k < G.val.length; k++) if (!G.val[k]) { const used = new Set(P.P[k].map(p => G.val[p])); let n = 0; for (let d = 1; d <= P.N; d++) if (!used.has(d)) n++; if (n < bn) { bn = n; best = k; } }
    i = best;
  }
  if (i < 0) { toast(T("w.done"), 1500); return; }
  G.hints++; G.val[i] = P.sol[i]; G.hs[i] = 1; G.mv.push(i); G.sel = -1; G.hl = i; G.pop = i; sfx.hint(); toast(T("w.hint"), 1500, "hint");
  render(); updHud(); setTimeout(() => { if (G) { G.hl = -1; render(); } }, 900); if (G.val.every((x, k) => x === P.sol[k])) setTimeout(finish, 600);
}
function finish() {
  if (!G || G.over) return; G.over = true; G.stars = starsOf(G.mist, G.hints); G.score = scoreOf(G.mist, G.hints);
  if (!HELPER) {
    prog.solved++; if (G.stars === 3) prog.perfect++; saveProg(); if (G.daily) dailyDone(G);
    const sk = G.stars === 3 ? (LS.get("sd-streak", 0) || 0) + 1 : 0; LS.set("sd-streak", sk); G.streak = sk;
  }
  const beat = !!(G.ch && G.score > G.ch.sc); $("play").querySelectorAll(".npj-t").forEach(e => e.remove());
  NPJuice.confetti($("play"), beat ? 34 : G.stars * 8 + 8, skinOf(G.t).an);
  if (beat) { NPJuice.text($("play"), "⚔ " + T("beat"), { color: "#ff3da0", top: "88%", size: 6.4 }); NPJuice.flash($("play")); }
  endAt = performance.now(); sfx.win(); renderEnd(); if (window.NP) NP.result({ score: G.score, extra: { t: G.t, lv: G.lv, stars: G.stars } });
  if (PF.pro && PF.pro.trial) setTimeout(() => PF.lockPro(), 0);
}
function renderEnd() {
  $("enH").textContent = T("end.h"); $("enV").innerHTML = "⭐ " + G.score; $("enR").textContent = "⭐".repeat(G.stars) + "☆".repeat(3 - G.stars);
  const nearOn = !HELPER && G.mist > 0; $("enN").hidden = !nearOn; if (nearOn) $("enN").textContent = T("near", { n: G.mist });
  $("retryBtn").hidden = HELPER || G.mist + G.hints === 0; $("retryBtn").classList.toggle("hot", nearOn && G.mist <= 3);
  $("retryBtn").setAttribute("aria-label", T("retry")); $("retryBtn").title = T("retry"); $("enL").hidden = $("retryBtn").hidden; $("enL").textContent = T("leg");
  let sub = T("end.s" + G.stars) + " (✕ " + G.mist + " · 💡 " + G.hints + ")" + (G.streak >= 2 ? " · " + T("streak", { n: G.streak }) : "");
  if (G.ch) sub = T(G.score > G.ch.sc ? "ch.win" : G.score < G.ch.sc ? "ch.lose" : "ch.tie", { k: G.score, ck: G.ch.sc }); $("enP").textContent = sub;
  $("againBtn").hidden = HELPER; $("homeBtn2").hidden = HELPER; $("shareBtn").hidden = HELPER; $("shareBtn").setAttribute("aria-label", T("sh.btn"));
  $("rankBtn").hidden = !(window.NP && !HELPER && G.score > 0); $("rankBtn").setAttribute("aria-label", T("rank.btn")); showOv("ovEnd");
}
function goHome() {
  if (window.NPAudio) NPAudio.silence(); G = null; paused = false; $("play").classList.remove("paused"); delete $("play").dataset.ty; delete $("play").dataset.sk;
  $("homeBtn").hidden = true; $("arena").hidden = true; $("home").hidden = false; showOv(null); applyVars($("play"), BASIC[0]); skCss(null); renderHome();
}
