"use strict";
/* Sudoku Con Vật — màn chọn (cấp độ, thẻ Hôm nay, 4 loại), thẻ cách chơi, thách đấu, chọn giao diện. */
const ovs = ["ovHow", "ovCh", "ovEnd", "ovSkin", "ovPay", "ovGate"];
function showOv(id) { for (const o of ovs) $(o).hidden = (o !== id); }
const PALETTE_SVG = '<svg viewBox="0 0 24 24" width="1.3em" height="1.3em" aria-hidden="true" style="display:block"><path d="M12 3C6.5 3 2.5 7 2.5 11.8c0 4.7 3.8 8.2 8.2 8.2 1.3 0 2-.8 2-1.7 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17c2.5 0 4.5-2 4.5-4.5C21.5 6.6 17.4 3 12 3z" fill="#f5c26b" stroke="#a86a2b" stroke-width="1.2" stroke-linejoin="round"/><circle cx="7.6" cy="10.4" r="1.5" fill="#ef4444"/><circle cx="11.2" cy="7.2" r="1.5" fill="#3b82f6"/><circle cx="15.8" cy="7.9" r="1.5" fill="#22c55e"/><circle cx="6.9" cy="14.6" r="1.4" fill="#a855f7"/></svg>';
function renderHome() {
  const h = $("home"); h.innerHTML = "";
  const lv = document.createElement("div"); lv.className = "lvs"; lv.setAttribute("role", "group"); lv.setAttribute("aria-label", T("lv.pick"));
  LVE.forEach((e, i) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "lvb" + (LVL === i + 1 ? " on" : "");
    b.innerHTML = e + " <small>" + (i + 1) + "</small>"; b.setAttribute("aria-label", T("lv")[i]);
    b.onclick = () => { LVL = i + 1; LS.set("sd-lv", LVL); renderHome(); }; lv.appendChild(b);
  });
  h.appendChild(lv);
  const di = dailyInfo(), ds = dailyStore(), db = document.createElement("button"); db.type = "button"; db.className = "dbar";
  db.innerHTML = "<span>📅 " + T("daily.t", { n: di.n }) + "</span><span>" + (ds.streak && (ds.last === di.key || ds.last === dayBefore(di.key)) ? "🔥 " + ds.streak + " " : "") +
    (ds.best[di.key] != null ? "✓ " + ds.best[di.key] : "▶") + "</span>";
  db.onclick = startDaily; h.appendChild(db);
  const g = document.createElement("div"); g.className = "tiles";
  for (let t = 0; t < 4; t++) {
    const sk = skinOf(t), b = document.createElement("div"); b.className = "tile"; b.setAttribute("role", "button"); b.tabIndex = 0; applyVars(b, sk); b.style.setProperty("--rad", "5cqw");
    const prem = PF.skinSel[t] !== "basic" && PF.skins[t][PF.skinSel[t]];
    b.innerHTML = '<span class="ti">' + sk.an[t === 1 || t === 3 ? 1 : 0] + "</span><b>" + T("ty")[t] + '</b><button class="sk" type="button" aria-label="' + T("sk.pick") + '">' + PALETTE_SVG + (prem ? "<i>★</i>" : "") + "</button>";
    b.onclick = () => openHow(t); b.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openHow(t); } };
    b.querySelector(".sk").onclick = e => { e.stopPropagation(); openSkins(t); }; g.appendChild(b);
  }
  h.appendChild(g); $("hl").textContent = "🏆 " + prog.solved; $("hr").textContent = "";
}
function openHow(t) {
  window.__howT = t; $("hwH").textContent = TY_ICON[t] + " " + T("ty")[t]; $("hwC").textContent = LVE[LVL - 1] + " " + T("lv")[LVL - 1];
  $("hwL").innerHTML = T("how")[t].map((s, i) => "<li><b>" + ["🐾", "🧩", "👆"][i] + "</b><span>" + s.replace(/\*\*([^*]+)\*\*/g, "<em>$1</em>") + "</span></li>").join("");
  const P0 = makePuzzle(t, 1, 3), N = P0.N, an = skinOf(t).an;
  let cells = ""; for (let i = 0; i < N * N; i++) cells += P0.puz[i] ? "<span>" + an[P0.puz[i] - 1] + "</span>" : '<span class="q"></span>';
  $("hwArt").innerHTML = '<div class="hwBoard" style="--n:' + N + '">' + cells + '</div><div class="row2">' + an.slice(0, N).map(a => "<i style=\"font-style:normal\">" + a + "</i>").join("") + "</div>";
  $("hwGo").textContent = "▶ " + T("go"); $("hwGo").onclick = () => begin(t, {}); $("hwBack").setAttribute("aria-label", T("home")); showOv("ovHow");
}
$("hwBack").onclick = () => showOv(null);
function openCh() {
  $("chH").textContent = T("ch.h"); $("chV").innerHTML = "⭐ " + CH.sc; $("chP").textContent = TY_ICON[CH.t] + " " + T("ty")[CH.t] + " · " + LVE[CH.lv - 1] + " — " + T("ch.p", { s: CH.sc });
  $("chGo").textContent = "▶ " + T("go"); showOv("ovCh");
}
$("chNo").onclick = () => { CH = null; showOv(null); };
$("chGo").onclick = () => { LVL = CH.lv; begin(CH.t, { seed: CH.s, ch: CH, lv: CH.lv }); };
function openSkins(t) {
  skFor = t; $("skH").textContent = "🎨 " + TY_ICON[t] + " " + T("ty")[t]; $("skBack").textContent = T("home"); const g = $("skGrid"); g.textContent = "";
  for (const [id, sw, em] of PF.catalog[t]) {
    const locked = skLocked(t, id), b = document.createElement("button"); b.type = "button"; b.className = "skc" + (locked ? " lock" : "") + (PF.skinSel[t] === id ? " on" : "");
    b.innerHTML = '<div class="sw" style="background:' + sw + '">' + em + "</div><span>" + T("sk." + t + "." + id) + "</span>";
    b.setAttribute("aria-label", locked ? T("lockedLbl", { n: T("sk." + t + "." + id) }) : T("sk." + t + "." + id));
    b.onclick = () => locked ? openPay(t, id) : chooseSkin(t, id); g.appendChild(b);
  }
  showOv("ovSkin");
}
function chooseSkin(t, id) { PF.skinSel[t] = id; LS.set("sd-skin", PF.skinSel); renderHome(); openHow(t); }
$("skBack").onclick = () => showOv(null);
