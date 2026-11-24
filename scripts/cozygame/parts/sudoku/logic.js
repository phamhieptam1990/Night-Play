/* Sudoku — luật chơi: chạm ô, bấm số để điền (hoặc ghi chú ✏️). Sai hiện đỏ, tính lỗi. Điền đúng hết là thắng. */
const CFG = TYPEDEF;
const rankIdx = n => n >= 2600 ? 4 : n >= 1900 ? 3 : n >= 1300 ? 2 : n >= 700 ? 1 : 0;
let DIF = (() => { const v = LS.get("sd-lv", 1); return v === 0 || v === 1 || v === 2 ? v : 1; })();
const lvOf = (seed, mode) => mode === "free" ? DIF : seed % 3;
const okCount = D => D.val.reduce((a, v, i) => a + (v && v === D.sol[i] && !D.puz[i] ? 1 : 0), 0);
const scoreOf = D => D.reason === "win" ? D.final : okCount(D) * 5;
const remain = D => D.T.time ? Math.max(0, 900 - D.time) : 0;
function newGame(seed, mode, t, ch) {
  const lv = lvOf(seed, mode); seed = seed - seed % 3 + lv; const P = genSudoku(seed, t === 1 ? 1 : t === 2 ? 2 : 0, lv);
  const n = P.T.N * P.T.N, D = { seed, mode, t, lv, T: Object.assign({}, P.T, { time: TYPEDEF[t].time }), N: P.T.N, P: P.P, sol: P.sol, puz: P.puz, val: P.puz.slice(), notes: new Array(n).fill(0), sel: -1, notesOn: false, mistakes: 0, hints: 3, used: 0,
    ch: ch || null, fx: [], shake: 0, flash: 0, final: 0, over: false, reason: "end", time: 0, dur: 1e9, beat: false };
  return D;
}
function winNow(D, quiet) {
  if (D.over) return; const base = [600, 960, 1320][D.lv] * (D.T.diag ? 1.15 : D.T.N === 6 ? .7 : 1), par = [600, 900, 1200][D.lv];
  D.final = Math.max(100, Math.round(base + (D.T.time ? Math.ceil(remain(D)) * 1.5 : Math.max(0, par - D.time) * 1.2) - D.mistakes * 40 - D.used * 60)); D.over = true; D.reason = "win"; D.sel = -1; if (quiet) return;
  sfx.end(); NPJuice.confetti($("play"), 24, CONF); setTimeout(() => { if (G === D) finish(D); }, 900);
}
function timeUp(D) { if (D.over) return; D.over = true; D.reason = "time"; D.flash = 1; sfx.bad(); setTimeout(() => { if (G === D) finish(D); }, 900); }
function checkWin(D, quiet) { if (D.val.every((v, i) => v === D.sol[i])) winNow(D, quiet); }
function setVal(D, i, v, quiet) {
  if (D.over || i < 0 || D.puz[i] || D.hintSet && D.hintSet[i]) return;
  if (D.notesOn && v) { if (!D.val[i]) { D.notes[i] ^= 1 << v; if (!quiet) sfx.ok(); } return; }
  const nv = D.val[i] === v ? 0 : v; D.val[i] = nv; D.notes[i] = 0;
  if (nv) {
    for (const p of D.P[i]) D.notes[p] &= ~(1 << nv);
    if (nv !== D.sol[i]) { D.mistakes++; if (!quiet) { D.shake = .3; sfx.bad(); if (window.NPFx) NPFx.buzz([30, 20, 30]); } } else if (!quiet) { sfx.ok(); D.fx.push({ i, t: .5 }); }
  }
  checkWin(D, quiet);
}
function useHint(D) {
  if (!D || D.over || D.hints <= 0) return false; let i = D.sel; if (i < 0 || D.puz[i] || D.val[i] === D.sol[i]) { i = D.val.findIndex((v, k) => v !== D.sol[k]); } if (i < 0) return false;
  D.hints--; D.used++; D.val[i] = D.sol[i]; D.notes[i] = 0; D.hintSet = D.hintSet || {}; D.hintSet[i] = 1; D.sel = i; D.fx.push({ i, t: .5 }); sfx.up(); checkWin(D); hud(); return true;
}
function step(D, dt) {
  if (D.over) return; D.time += dt; for (const f of D.fx) f.t -= dt; D.fx = D.fx.filter(f => f.t > 0); D.shake = Math.max(0, D.shake - dt); D.flash = Math.max(0, D.flash - dt * 2.5);
  if (D.T.time && remain(D) <= 0) timeUp(D); if (Math.floor(D.time * 4) !== D._q) { D._q = Math.floor(D.time * 4); hud(); }
}
function burst(n){if(!isProSk()&&n<12)return;
  const host = $("play"), L = (skinOf().deco || ["⭐", "🔢"]);
  for (let i = 0; i < n; i++) {
    if (host.querySelectorAll(".eb2").length > 30) break;
    const e = document.createElement("i"), a = Math.random() * 6.283, d = 14 + Math.random() * 30; e.className = "eb2"; e.textContent = L[i % L.length];
    e.style.left = "50%"; e.style.top = "40%"; e.style.setProperty("--dx", Math.cos(a) * d + "cqw"); e.style.setProperty("--dy", (Math.sin(a) * d * .8 - 4) + "cqw");
    e.style.setProperty("--rt", (Math.random() * 120 - 60) + "deg"); host.appendChild(e); setTimeout(() => e.remove(), 950);
  }
}
const mmss = s => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
function HUD(D) {
  const left = D.val.filter(v => !v).length; refreshPad(D);
  return [[D.T.time ? Math.ceil(remain(D)) + "s" : mmss(D.time), "tm"], [D.mistakes, "er"], [left, "ex"]];
}
function endChips(D) {
  const n = scoreOf(D), lv = LVN[D.lv];
  return [lv[0] + " " + L2([lv[1], lv[2]]), TYPES[D.t][0] + " " + L2([TYPES[D.t][1], TYPES[D.t][2]]), "✕ " + D.mistakes, "💡 " + D.used, (D.prevBest > 0 && n > D.prevBest) ? T("rec") : ""];
}
const shareT = D => L2([LVN[D.lv][1], LVN[D.lv][2]]) + " · " + L2([TYPES[D.t][1], TYPES[D.t][2]]);
function snapP(D) { return D.time > 1 || D.val.some((v, i) => v !== D.puz[i]) ? { v: D.val.join(""), t: Math.round(D.time), m: D.mistakes, h: D.hints, u: D.used } : null; }
function restoreP(D, p) {
  const s = String(p.v || ""); if (s.length !== D.val.length) return;
  for (let i = 0; i < s.length; i++) { const v = +s[i]; if (D.puz[i]) continue; if (v >= 0 && v <= D.N) D.val[i] = v; }
  D.time = +p.t || 0; D.mistakes = +p.m || 0; D.hints = Math.max(0, Math.min(3, +p.h || 0)); D.used = +p.u || 0; hud();
}
/* bàn phím số + công cụ (DOM, nút ≥44px) */
function buildPad(D) {
  const pad = $("sdPad"); pad.innerHTML = ""; const mk = (txt, id, fn, cls) => { const b = document.createElement("button"); b.type = "button"; b.className = "btn alt sdk " + (cls || ""); b.id = id; b.textContent = txt; b.onclick = fn; pad.appendChild(b); return b; };
  for (let d = 1; d <= D.N; d++) mk(String(d), "sdN" + d, () => { if (G) { setVal(G, G.sel, d); hud(); } });
  for (let k = (5 - D.N % 5) % 5 || 5; k > 0 && D.N % 5; k--) { if (pad.children.length % 5 === 0) break; const sp = document.createElement("span"); pad.appendChild(sp); }   /* chừa góc dưới-phải cho linh vật nhỏ: hàng công cụ xuống hàng riêng */
  while (pad.children.length % 5) pad.appendChild(document.createElement("span"));
  mk("⌫", "sdE", () => { if (G && G.sel >= 0) { const g = G; if (!g.puz[g.sel] && !(g.hintSet && g.hintSet[g.sel])) { g.val[g.sel] = 0; g.notes[g.sel] = 0; hud(); } } });
  mk("✏️", "sdNote", () => { if (G) { G.notesOn = !G.notesOn; hud(); } }); mk("💡", "sdH", () => useHint(G));
}
function refreshPad(D) {
  const cnt = new Array(D.N + 1).fill(0); D.val.forEach(v => { if (v) cnt[v]++; });
  for (let d = 1; d <= D.N; d++) { const b = $("sdN" + d); if (b) b.classList.toggle("done", cnt[d] >= D.N); }
  const n = $("sdNote"); if (n) n.classList.toggle("on", !!D.notesOn); const h = $("sdH"); if (h) { h.textContent = "💡" + D.hints; h.disabled = D.hints <= 0 || D.over; }
}
function onBegin(D) { buildPad(D); fitCanvas(); }
function onLang(D) { hud(); }
function renderLevels() {
  let b = $("lvs"); if (!b) { b = document.createElement("div"); b.className = "lvs"; b.id = "lvs"; $("home").insertBefore(b, $("tys")); }
  b.innerHTML = ""; LVN.forEach((t, i) => { const e = document.createElement("button"); e.type = "button"; e.className = "lv" + (DIF === i ? " on" : ""); e.textContent = t[0] + " " + L2([t[1], t[2]]); e.onclick = () => { DIF = i; LS.set("sd-lv", i); renderLevels(); }; b.appendChild(e); });
}
new MutationObserver(() => { if (!$("home").hidden) renderLevels(); }).observe($("home"), { attributes: true, attributeFilter: ["hidden"] });
document.addEventListener("click", e => { if (e.target.closest && e.target.closest("#bLang")) setTimeout(renderLevels, 0); });
renderLevels();
