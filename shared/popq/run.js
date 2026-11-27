"use strict";
/* PopQ — chạy ván: màn chọn (cấp, thẻ Hôm nay, 4 loại), thẻ cách chơi, thách đấu #ch=, chia sẻ, màn kết thúc, cầu nối cổng (lưu/tiếp tục, chơi hộ).
   Game khai báo Q = {id, icon, tyIcons[4], dict, levels(3), ty(t)->tên, start(G), hud(G)->[trái,phải], snap(G), restore(G,x), tile(t)->emoji}
   rồi gọi Q.finish({score, stars}) khi xong ván. */
const ovs = ["ovHow", "ovCh", "ovEnd", "ovSkin", "ovPay", "ovGate"];
function showOv(id) { for (const o of ovs) $(o).hidden = (o !== id); }
const LVE = ["🌱", "🌿", "🌳"], lvIcon = l => LVE[l - 1] || "🔥";
const K = k => "pq-" + Q.id + "-" + k;
let prog = Object.assign({ solved: 0 }, LS.get(K("prog"), {})), LVL = Math.min(3, Math.max(1, +LS.get(K("lv"), 1) || 1)), G = null, CH = null, endAt = 0;
const BOOT_H = !!(window.NP && NP.helper), HELPER = BOOT_H && !(NP.resumeBoot && NP.resumeBoot());
const HS = BOOT_H && NP.initialState && typeof NP.initialState === "object" ? NP.initialState : null;
const DAILY_BASE = Date.UTC(2026, 0, 1);
function dailyInfo() {
  const k = today(), [y, m, d] = k.split("-").map(Number), n = Math.round((Date.UTC(y, m - 1, d) - DAILY_BASE) / 864e5) + 1;
  let h = 2166136261; for (const ch of Q.id + k) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return { key: k, n, seed: h >>> 0, t: h % 4, lv: 2 };
}
const dailyStore = () => Object.assign({ streak: 0, last: "", best: {} }, LS.get(K("daily"), {}));
function dailyDone(g) {
  const di = g.daily, st = dailyStore();
  if (st.last !== di.key) { st.streak = st.last === dayBefore(di.key) ? st.streak + 1 : 1; st.last = di.key; }
  st.best[di.key] = Math.max(st.best[di.key] || 0, g.score);
  const ks = Object.keys(st.best).sort().slice(-14), nb = {}; ks.forEach(x => nb[x] = st.best[x]); st.best = nb; LS.set(K("daily"), st);
}
const startDaily = () => { const di = dailyInfo(); begin(di.t, { seed: di.seed, daily: di, lv: di.lv }); };
function parseCh() {
  try {
    const m = /[#&]ch=([\w-]+)/.exec(location.hash); if (!m) return null;
    let b = m[1].replace(/-/g, "+").replace(/_/g, "/"); b += "===".slice((b.length + 3) % 4);
    const o = JSON.parse(atob(b)), I = (v, a, z) => Number.isInteger(v) && v >= a && v <= z;
    return I(o.t, 0, 3) && I(o.lv, 1, 3) && I(o.s, 0, 4294967295) && I(o.sc, 0, 9999) ? { t: o.t, lv: o.lv, s: o.s, sc: o.sc } : null;
  } catch (e) { return null; }
}
function shareLink() {
  const l = LANG === "en" ? "&l=en" : "", b = location.origin + "/api/share/" + Q.id;
  return G.daily ? b + "?d=1&n=" + G.daily.n + "&s=" + G.score + l : b + "?ch=" + b64e({ t: G.t, lv: G.lv, s: G.seed, sc: G.score }) + l;
}
function shareText() {
  const st = "⭐".repeat(G.stars) + "☆".repeat(3 - G.stars);
  return (G.daily ? "📅 " + T("daily.t", { n: G.daily.n }) : Q.tyIcons[G.t] + " " + T("title")) + "\n" + T("hook") + "\n" +
    Q.tyIcons[G.t] + " " + T("ty")[G.t] + " · " + lvIcon(G.lv) + " · " + st + " " + G.score + "\n" + shareLink();
}
async function doShare() {
  const tx = shareText();
  if (navigator.share) { try { await navigator.share({ text: tx }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
  try { await navigator.clipboard.writeText(tx); toast(T("txt.copied"), 1600); } catch (e) { toast(tx, 4000); }
}
/* ---- màn chọn ---- */
function renderHome() {
  const h = $("home"); h.innerHTML = "";
  const lv = document.createElement("div"); lv.className = "lvs"; lv.setAttribute("role", "group"); lv.setAttribute("aria-label", T("lv.pick"));
  LVE.forEach((e, i) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "lvb" + (LVL === i + 1 ? " on" : "");
    b.innerHTML = e + " <small>" + (i + 1) + "</small>"; b.setAttribute("aria-label", T("lv")[i]);
    b.onclick = () => { LVL = i + 1; LS.set(K("lv"), LVL); renderHome(); }; lv.appendChild(b);
  });
  h.appendChild(lv);
  const di = dailyInfo(), ds = dailyStore(), db = document.createElement("button"); db.type = "button"; db.className = "dbar";
  db.innerHTML = "<span>📅 " + T("daily.t", { n: di.n }) + "</span><span>" + (ds.streak && (ds.last === di.key || ds.last === dayBefore(di.key)) ? "🔥 " + ds.streak + " " : "") +
    (ds.best[di.key] != null ? "✓ " + ds.best[di.key] : "▶") + "</span>";
  db.onclick = startDaily; h.appendChild(db);
  const g = document.createElement("div"); g.className = "tiles";
  for (let t = 0; t < 4; t++) {
    const b = document.createElement("div"); b.className = "tile t" + t; b.setAttribute("role", "button"); b.tabIndex = 0;
    b.innerHTML = '<span class="ti">' + Q.tyIcons[t] + "</span><b>" + T("ty")[t] + "</b>";
    b.onclick = () => openHow(t); b.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openHow(t); } }; g.appendChild(b);
  }
  h.appendChild(g); $("hl").textContent = "🏆 " + prog.solved; $("hr").textContent = "";
}
function openHow(t) {
  window.__howT = t;
  $("hwH").textContent = Q.tyIcons[t] + " " + T("ty")[t]; $("hwC").textContent = LVE[LVL - 1] + " " + T("lv")[LVL - 1];
  $("hwL").innerHTML = T("how")[t].map((s, i) => "<li><b>" + ["👀", "👆", "⭐"][i] + "</b><span>" + s.replace(/\*\*([^*]+)\*\*/g, "<em>$1</em>") + "</span></li>").join("");
  $("hwArt").innerHTML = '<span class="hwIc">' + Q.tyIcons[t] + "</span>";
  $("hwGo").textContent = "▶ " + T("go"); $("hwGo").onclick = () => begin(t, {}); $("hwBack").setAttribute("aria-label", T("home")); showOv("ovHow");
}
$("hwBack").onclick = () => showOv(null);
function openCh() {
  $("chH").textContent = T("ch.h"); $("chV").innerHTML = "⭐ " + CH.sc; $("chP").textContent = Q.tyIcons[CH.t] + " " + T("ty")[CH.t] + " · " + lvIcon(CH.lv) + " — " + T("ch.p", { s: CH.sc });
  $("chGo").textContent = "▶ " + T("go"); showOv("ovCh");
}
$("chNo").onclick = () => { CH = null; showOv(null); };
$("chGo").onclick = () => { LVL = CH.lv; begin(CH.t, { seed: CH.s, ch: CH, lv: CH.lv }); };
/* ---- ván chơi ---- */
function begin(t, o) {
  o = o || {}; if (window.NPAudio) NPAudio.silence(); showOv(null);
  const lv = o.lv || LVL, seed = o.seed != null ? o.seed : Math.floor(MR() * 1e9);
  G = { t, lv, seed, over: false, score: 0, stars: 0, daily: o.daily || null, ch: o.ch || null };
  if (window.PF) applySkin(); RNG = mulberry32(seed); $("stage").innerHTML = ""; $("play").dataset.ty = t;
  $("home").hidden = true; $("arena").hidden = false; $("homeBtn").hidden = false;
  Q.start(G); RNG = Math.random; updHud(); if (window.NP) NP.start(); return G;
}
function updHud() { if (!G) return; const h = Q.hud(G); $("hl").textContent = h[0]; $("hr").textContent = h[1]; }
function finish(r) {
  if (!G || G.over) return; G.over = true; G.score = Math.max(0, Math.min(9999, Math.round(r.score))); G.stars = r.stars;
  if (!HELPER) {
    prog.solved++; LS.set(K("prog"), prog); if (G.daily) dailyDone(G);
    const sk = G.stars === 3 ? (LS.get(K("streak"), 0) || 0) + 1 : 0; LS.set(K("streak"), sk); G.streak = sk;
  }
  const beat = !!(G.ch && G.score > G.ch.sc); $("play").querySelectorAll(".npj-t").forEach(e => e.remove());
  if (window.NPJuice) { NPJuice.confetti($("play"), beat ? 34 : G.stars * 8 + 8, Q.confetti); if (beat) { NPJuice.text($("play"), "⚔ " + T("beat"), { color: "#ff3da0", top: "88%", size: 6.4 }); NPJuice.flash($("play")); } }
  if (window.PF && PF.pro && PF.pro.trial) setTimeout(() => PF.lockPro(), 0);
  endAt = performance.now(); sfx.win(); renderEnd(); if (window.NP) NP.result({ score: G.score, extra: { t: G.t, lv: G.lv, stars: G.stars } });
}
function renderEnd() {
  $("enH").textContent = T("end.h"); $("enV").innerHTML = "⭐ " + G.score; $("enR").textContent = "⭐".repeat(G.stars) + "☆".repeat(3 - G.stars);
  $("enN").hidden = true; $("retryBtn").hidden = HELPER; $("retryBtn").setAttribute("aria-label", T("retry")); $("retryBtn").title = T("retry"); $("enL").hidden = true;
  let sub = T("end.s" + G.stars) + (G.info ? " (" + G.info + ")" : "") + (G.streak >= 2 ? " · " + T("streak", { n: G.streak }) : "");
  if (G.ch) sub = T(G.score > G.ch.sc ? "ch.win" : G.score < G.ch.sc ? "ch.lose" : "ch.tie", { k: G.score, ck: G.ch.sc }); $("enP").textContent = sub;
  $("againBtn").hidden = HELPER; $("homeBtn2").hidden = HELPER; $("shareBtn").hidden = HELPER; $("shareBtn").setAttribute("aria-label", T("sh.btn"));
  $("rankBtn").hidden = !(window.NP && !HELPER && G.score > 0); $("rankBtn").setAttribute("aria-label", T("rank.btn")); showOv("ovEnd");
}
function goHome() {
  if (window.NPAudio) NPAudio.silence(); G = null; paused = false; $("play").classList.remove("paused"); delete $("play").dataset.ty;
  $("stage").innerHTML = ""; if (window.PF) applySkin(); $("homeBtn").hidden = true; $("arena").hidden = true; $("home").hidden = false; showOv(null); renderHome();
}
window.Q_API = { begin, finish, updHud, get G() { return G; }, goHome };
