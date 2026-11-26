"use strict";
/* Sudoku Con Vật — nút trên cùng (ngôn ngữ, âm thanh, về màn chọn), cầu nối trang cổng (lưu/tiếp tục ván, chơi hộ), khởi động. */
function applyLang() {
  document.documentElement.lang = LANG; document.title = T("docTitle"); $("title").textContent = T("title"); $("langBtn").textContent = (LANG === "vi" ? "EN" : "VI");
  $("langBtn").setAttribute("aria-label", T("lang")); $("soundBtn").setAttribute("aria-label", T("sound")); $("homeBtn").setAttribute("aria-label", T("home"));
  $("homeBtn2").setAttribute("aria-label", T("home")); $("rankBtn").setAttribute("aria-label", T("rank.btn"));
  $("undoBtn").setAttribute("aria-label", "↩"); $("hintBtn").setAttribute("aria-label", "💡"); $("resetBtn").setAttribute("aria-label", "↻"); syncSound();
  if (!G) renderHome(); else { render(); updHud(); if (G.over) renderEnd(); }
}
function syncSound() { $("soundBtn").textContent = sound ? "🔊" : "🔇"; }
$("soundBtn").onclick = () => { sound = !sound; if (window.NPAudio) NPAudio.set(sound); else if (!sound && window.speechSynthesis) speechSynthesis.cancel(); syncSound(); };
$("langBtn").onclick = () => { LANG = LANG === "vi" ? "en" : "vi"; try { localStorage.setItem("lang", LANG); } catch (e) {} applyLang(); };
$("homeBtn").onclick = () => { if (!HELPER) goHome(); };
$("undoBtn").onclick = undo; $("hintBtn").onclick = hint; $("resetBtn").onclick = resetPuz;
function retry() { if (!G || HELPER) return; begin(G.t, { lv: G.lv, seed: G.seed, daily: G.daily, ch: G.ch, bo: G.bo }); }
$("retryBtn").onclick = retry;
$("againBtn").onclick = () => { if (!G) return; if (G.daily) return startDaily(); begin(G.t, { lv: G.lv, bo: G.bo }); };
window.NPLevel&&NPLevel.attach({levels:LV_MAX,endless:true,dupe:"#againBtn",cur:()=>G?G.lv-1+(G.bo||0):-1,go:i=>{LVL=Math.min(3,i+1);LS.set("sd-lv",LVL);begin(G.t, { lv: Math.min(LV_MAX, i + 1), bo: NPLevel.boost(i) })},skip:()=>!!(G && (G.daily || G.ch))});   /* lên level khi kết thúc màn (shared/levelup.js) */
$("shareBtn").onclick = () => openGate(() => { showOv("ovEnd"); doShare(); }, "ovEnd", "gt.sh");
$("ovEnd").addEventListener("pointerdown", e => { if (HELPER || e.target.closest("button") || performance.now() - endAt < 450) return; $("againBtn").onclick(); });
$("homeBtn2").onclick = goHome;
$("rankBtn").onclick = () => { window.NP && NP.brag && NP.brag(); };
addEventListener("keydown", e => {
  if (G && G.over && !HELPER && (e.key === "Enter" || e.key === " ") && !e.repeat && !$("ovEnd").hidden && performance.now() - endAt > 450) { e.preventDefault(); $("againBtn").onclick(); }
  if (G && !G.over && !paused && !$("arena").hidden) {
    const d = +e.key; if (d >= 1 && d <= G.Pz.N) tapAnimal(d);
    if (e.key === "Backspace" || e.key === "z") undo();
    const a = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -G.Pz.N, ArrowDown: G.Pz.N }[e.key];
    if (a) { e.preventDefault(); const n = G.sel < 0 ? 0 : G.sel + a; if (n >= 0 && n < G.val.length) { G.sel = n; G.brush = 0; render(); } }
  }
});
addEventListener("storage", e => { if (e.key === "theme") document.documentElement.dataset.theme = e.newValue || "light"; });
/* ===== cầu nối với trang cổng: lưu/tiếp tục ván, chơi hộ ===== */
if (window.NP) {
  NP.state(() => {
    if (!G || G.over) return null;
    const st = { t: G.t, lv: G.lv, s: G.seed, v: G.val.join(""), m: G.mist, h: G.hints, b: G.bo };
    if (PF.pro && !PF.pro.trial && PF.ticket) { st.tk = PF.ticket; const sk = PF.skinSel[G.t]; if (sk && sk !== "basic" && PF.skins[G.t][sk]) st.sk = sk; }
    return st;
  });
  NP.onPause(() => { paused = true; $("play").classList.add("paused"); if (window.speechSynthesis) speechSynthesis.cancel(); }, () => { paused = false; $("play").classList.remove("paused"); });
}
function restoreFrom(S) {
  LVL = Math.min(3, S.lv); begin(S.t, { seed: S.s, lv: S.lv, bo: Math.max(0, Math.min(30, +S.b || 0)) });
  const s = String(S.v || ""); if (s.length === G.val.length) {
    for (let i = 0; i < s.length; i++) { const v = +s[i]; if (G.Pz.puz[i] || !(v >= 0 && v <= G.Pz.N)) continue; if (v === G.Pz.sol[i]) G.val[i] = v; }
  }
  G.mist = Math.max(0, Math.min(99, +S.m || 0)); G.hints = Math.max(0, Math.min(99, +S.h || 0)); render(); updHud();
}
if (passToken() && !HELPER) PF.loadPro(false).catch(() => {});
applyLang(); goHome();
if (BOOT_H) {
  const I = (v, a, z) => HS && Number.isInteger(v) && v >= a && v <= z;
  if (HS && I(HS.t, 0, 3) && I(HS.lv, 1, LV_MAX) && I(HS.s, 0, 4294967295)) {
    const okT = HS.tk && /^h\.\d{13}\.[\w-]{43}$/.test(HS.tk), go2 = () => restoreFrom(HS);
    if (okT) PF.loadPro(false, HS.tk).then(() => { if (/^[a-z]{3,10}$/.test(HS.sk || "") && PF.skins[HS.t][HS.sk]) PF.skinSel[HS.t] = HS.sk; }).catch(() => {}).finally(go2); else go2();
  }
} else { CH = parseCh(); if (CH) openCh(); else if (location.hash === "#daily") startDaily(); }
/* cửa thử cho bài đo tự động */
window.SD = {
  drawCard, shareText, shareLink, dailyInfo, parseCh, b64e, startDaily, get CH() { return CH; }, get G() { return G; }, begin, goHome, PF, makePuzzle, place, tapCell, tapAnimal, undo, hint, resetPuz, openHow,
  get prog() { return prog; }, setLv(n) { LVL = n; },
  bot(o) {
    o = o || {}; if (!G) return null; if (o.wrongFirst) { const i = G.val.findIndex(v => !v); if (i >= 0) { const w = (G.Pz.sol[i] % G.Pz.N) + 1; place(i, w); } }
    for (let i = 0; i < G.val.length && !G.over; i++) if (!G.val[i]) place(i, G.Pz.sol[i]);
    return { score: G.score, stars: G.stars, mist: G.mist };
  }
};
