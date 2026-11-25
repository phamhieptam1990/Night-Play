/* Khởi động + nối module Pop chung (popmenu/pophelp/resume qua #home, #homeBtn, #soundBtn, #langBtn, NP): màn chọn trước, một chạm vào thế giới. */
(function () {
  "use strict";
  const $ = TNE.$, I = (v, a, z) => Number.isInteger(v) && v >= a && v <= z, H = document.documentElement;
  TNE.inWorld = false;
  TNE.enterWorld = () => { TNE.inWorld = true; $("home").hidden = true; $("world").hidden = false; $("homeBtn").hidden = false; H.classList.add("tne-world"); H.classList.remove("tne-home"); TNE.fit(); requestAnimationFrame(TNE.fit); setTimeout(TNE.fit, 300); };
  TNE.goHome = () => { TNE.inWorld = false; TNE.cancelSpeech(); $("world").hidden = true; $("home").hidden = false; $("homeBtn").hidden = true; H.classList.remove("tne-world"); H.classList.add("tne-home"); };
  window.goHome = TNE.goHome;
  const syncSound = () => { const b = $("soundBtn"); b.setAttribute("aria-pressed", TNE.sound() ? "true" : "false"); b.textContent = TNE.sound() ? "🔊" : "🔇"; };
  $("soundBtn").onclick = () => { TNE.setSound(!TNE.sound()); syncSound(); };
  const labels = () => {
    [["bSpk", "listen"], ["bAa", "showTxt"], ["undoBtn", "undo"], ["serveBtn", "serve"]].forEach(p => $(p[0]).setAttribute("aria-label", TNE.T(p[1])));
    $("homeBtn").setAttribute("aria-label", "Home"); $("startLbl").textContent = TNE.lang() === "en" ? "Fox's Juice Bar" : "Quán Cáo Cam"; $("title").textContent = $("startLbl").textContent;
    TNE.buildBar(); document.title = $("title").textContent;
  };
  $("langBtn").onclick = () => { const n = TNE.lang() === "vi" ? "en" : "vi"; try { localStorage.setItem("lang", n); } catch (e) {} H.lang = n; $("langBtn").textContent = n === "vi" ? "EN" : "VI"; labels(); };
  $("homeBtn").onclick = () => { if (!TNE.helper) TNE.goHome(); };
  $("startTile").onclick = () => { const G = TNE.G(); if (G && !G.over) TNE.enterWorld(); else TNE.begin(0); };
  $("bSpk").innerHTML = TNE.ic("ear"); $("bAa").innerHTML = TNE.ic("abc"); $("undoBtn").innerHTML = TNE.ic("undo"); $("serveBtn").innerHTML = TNE.ic("serve");
  $("serveBtn").onclick = TNE.serve; $("undoBtn").onclick = TNE.undo; $("bSpk").onclick = TNE.replay; $("bAa").onclick = TNE.revealText;
  try { const l = new URLSearchParams(location.search).get("lang"); if (l === "en" || l === "vi") H.lang = l; } catch (e) {}
  $("langBtn").textContent = TNE.lang() === "vi" ? "EN" : "VI";
  const parseCh = () => {
    try { const m = /[#&]ch=([\w-]+)/.exec(location.hash); if (!m) return null; const o = TNE.b64d(m[1]); return I(o.s, 1, 2e9) && I(o.sc, 0, 5000) && I(o.lv, 1, 3) ? o : null; } catch (e) { return null; }
  };
  window.NP_CHALLENGE = { id: "tiem-nuoc-ep-tieng-anh", start() { TNE.begin(20261125, 2, { ch: { sc: 0 } }); }, judge(r) { return !!r && r.score >= 1200; } };
  TNE.goHome(); TNE.initWorld(); TNE.renderCrates(); TNE.renderDecor(); labels(); syncSound();
  let started = false;
  if (window.NP) {
    NP.state(() => TNE.snap());
    NP.onPause(() => TNE.pause(true), () => TNE.pause(false));
    const HS = TNE.helper ? NP.initialState : null;
    if (HS && I(HS.seed, 1, 2e9) && I(HS.lv, 1, 3)) { TNE.begin(HS.seed, HS.lv, { round: I(HS.r, 0, 4) ? HS.r : 0, stars: I(HS.s, 0, 15) ? HS.s : 0, coins: I(HS.c, 0, 200) ? HS.c : 0 }); started = true; }
  }
  const ch = !started && !TNE.helper ? parseCh() : null;
  if (ch && window.WorldKit) { WorldKit.popup({ big: [{ ic: "star", n: ch.sc }], acts: [{ ic: "close" }, { ic: "play", go: 1, fn: () => TNE.begin(ch.s, ch.lv, { ch }) }] }); }
  $("dailyBtn").onclick = TNE.dailyGift;
})();
