"use strict";
/* PopQ — nút trên cùng (ngôn ngữ, âm thanh, về màn chọn), nút màn kết thúc, cầu nối trang cổng, khởi động. Nạp CUỐI CÙNG (sau game). */
function applyLang() {
  document.documentElement.lang = LANG; document.title = T("title"); $("title").textContent = T("title"); $("langBtn").textContent = (LANG === "vi" ? "EN" : "VI");
  $("langBtn").setAttribute("aria-label", T("lang")); $("soundBtn").setAttribute("aria-label", T("sound")); $("homeBtn").setAttribute("aria-label", T("home"));
  $("homeBtn2").setAttribute("aria-label", T("home")); $("rankBtn").setAttribute("aria-label", T("rank.btn")); syncSound();
  if (!G) renderHome(); else { if (Q.relang) Q.relang(G); updHud(); if (G.over) renderEnd(); }
}
function syncSound() { $("soundBtn").textContent = sound ? "🔊" : "🔇"; }
$("soundBtn").onclick = () => { sound = !sound; if (window.NPAudio) NPAudio.set(sound); else if (!sound && window.speechSynthesis) speechSynthesis.cancel(); syncSound(); };
$("langBtn").onclick = () => { LANG = LANG === "vi" ? "en" : "vi"; try { localStorage.setItem("lang", LANG); } catch (e) {} applyLang(); };
$("homeBtn").onclick = () => { if (!HELPER) goHome(); };
function retry() { if (!G || HELPER) return; begin(G.t, { lv: G.lv, seed: G.seed, daily: G.daily, ch: G.ch }); }
$("retryBtn").onclick = retry;
$("againBtn").onclick = () => { if (!G) return; if (G.daily) return startDaily(); begin(G.t, { lv: G.lv }); };
$("shareBtn").onclick = doShare;
$("ovEnd").addEventListener("pointerdown", e => { if (HELPER || e.target.closest("button") || performance.now() - endAt < 450) return; $("againBtn").onclick(); });
$("homeBtn2").onclick = goHome;
$("rankBtn").onclick = () => { window.NP && NP.brag && NP.brag(); };
addEventListener("keydown", e => {
  if (G && G.over && !HELPER && (e.key === "Enter" || e.key === " ") && !e.repeat && !$("ovEnd").hidden && performance.now() - endAt > 450) { e.preventDefault(); $("againBtn").onclick(); }
});
addEventListener("storage", e => { if (e.key === "theme") document.documentElement.dataset.theme = e.newValue || "light"; });
if (window.NP) {
  NP.state(() => (!G || G.over) ? null : { t: G.t, lv: G.lv, s: G.seed, x: Q.snap(G) });
  NP.onPause(() => { paused = true; $("play").classList.add("paused"); if (window.speechSynthesis) speechSynthesis.cancel(); }, () => { paused = false; $("play").classList.remove("paused"); });
}
applyLang(); goHome();
if (window.PF && passToken() && !HELPER) PF.loadPro(false).catch(() => {});
if (BOOT_H) {
  const I = (v, a, z) => HS && Number.isInteger(v) && v >= a && v <= z;
  if (HS && I(HS.t, 0, 3) && I(HS.lv, 1, 3) && I(HS.s, 0, 4294967295)) { LVL = HS.lv; begin(HS.t, { seed: HS.s, lv: HS.lv }); if (HS.x) Q.restore(G, HS.x); updHud(); }
} else { CH = parseCh(); if (CH) openCh(); else if (location.hash === "#daily") startDaily(); }
window.QT = { get G() { return G; }, begin, goHome, startDaily, parseCh, b64e, shareText, finish, openHow, setLv(n) { LVL = n; } };
