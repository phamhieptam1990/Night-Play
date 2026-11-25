/* Tìm Đôi Thẻ — luật: chạm một thẻ không bị đè rồi chạm thẻ GIỐNG nó → cả hai biến mất. Dọn sạch bàn là thắng. Hết nước đi thì tự xáo lại. */
const COMBO_MAX = 8, POP_T = .4;
const rankIdx = n => n >= 2300 ? 4 : n >= 1500 ? 3 : n >= 900 ? 2 : n >= 400 ? 1 : 0;
const scoreOf = D => D.pts + D.bonus;
const remain = D => D.C.time ? Math.max(0, D.limit - D.time - D.pen) : 0;
const leftOf = D => D.tiles.reduce((a, t) => a + (t.on ? 1 : 0), 0) / 2;
let DIF = (() => { const v = LS.get("td-lv", 1); return v === 0 || v === 1 || v === 2 ? v : 1; })();
const lvOf = (seed, mode) => mode === "free" ? DIF : seed % 3;
function newGame(seed, mode, t, ch) {
  const lv = lvOf(seed, mode); seed = seed - seed % 3 + lv;   /* độ khó nằm trong hạt giống → chia sẻ/thách đấu/đấu lại đúng ván */
  const LC = LVC[lv], C = CFG[t], sk = skinOf(), icons = sk.icons || ICONS, ps = shuffle(icons.map((_, i) => i), sub(seed, 31)).slice(0, LC.K);
  const base = buildTiles(sk.layers || PILE, LC);
  let g = null; for (let a = 0; a < 60 && !g; a++) g = genPairs(base, LC.K, sub(seed, 60 + a));
  if (!g) g = { kind: base.map((_, i) => Math.floor(i / 2) % LC.K), order: base.map((_, i) => i) };
  base.forEach((b, i) => { b.i = i; b.k = ps[g.kind[i]]; b.on = true; b.sh = 0; });
  const D = { seed, mode, t, lv, C, LC, ps, ch: ch || null, tiles: base, sol: g.order, pops: [], fx: [], hist: [], sel: -1, hint: null, hints: 3, shuf: 0, errs: 0, pairs: 0,
    pts: 0, bonus: 0, combo: 0, maxCombo: 0, pen: 0, limit: 60 + base.length * 1.5, nextShuf: C.shuf, over: false, reason: "end", time: 0, dur: 1e9, beat: false, shake: 0, flash: 0 };
  calcFree(D); return D;
}
function findMove(D) {
  const by = {}; for (const t of D.tiles) if (t.free) { (by[t.k] = by[t.k] || []).push(t.i); if (by[t.k].length >= 2) return by[t.k].slice(0, 2); }
  return null;
}
function reshuffle(D, quiet) {
  const idx = D.tiles.filter(t => t.on).map(t => t.i), sub0 = idx.map(i => D.tiles[i]); let g = null;
  for (let a = 0; a < 40 && !g; a++) g = genPairs(sub0, D.LC.K, sub(D.seed, 200 + D.shuf * 50 + a));
  D.shuf++; idx.forEach((i, j) => { D.tiles[i].k = g ? D.ps[g.kind[j]] : D.ps[Math.floor(j / 2) % D.ps.length]; });
  D.sel = -1; D.hint = null; if (!quiet) { toast(T("shuf"), 1400); sfx.up(); }
}
function pickTile(D, i, quiet) {
  const t = D.tiles[i]; if (D.over || !t || !t.on || !t.free) return false;
  if (D.sel === i) { D.sel = -1; return true; }
  if (D.sel < 0) { D.sel = i; if (!quiet) sfx.ok(); return true; }
  const a = D.tiles[D.sel];
  if (a.k !== t.k) {
    D.errs++; D.combo = 0; D.sel = i; if (D.C.time) D.pen += 3;
    if (!quiet) { a.sh = t.sh = .3; sfx.bad(); if (window.NPFx) NPFx.buzz([30, 20, 30]); }
    return true;
  }
  a.on = false; t.on = false; calcFree(D); D.hist.push(a.i, t.i); D.sel = -1; D.hint = null; D.pairs++;
  D.combo++; D.maxCombo = Math.max(D.maxCombo, D.combo); const add = 50 + 10 * Math.min(D.combo - 1, COMBO_MAX); D.pts += add;
  if (!quiet) {
    [a, t].forEach(q => D.pops.push({ x: q.x - q.l * 2, y: q.y - q.l * 3, k: q.k, t: POP_T }));
    D.fx.push({ x: (a.x + t.x) / 2 + 24, y: (a.y + t.y) / 2 + 26, t: .5, c: "#ffd24a" }); sfx.combo(D.combo * 3);
    NPJuice.text($("play"), "+" + add + (D.combo > 1 ? " ×" + D.combo : ""), { color: "#ffd24a", top: "30%", size: 5.2 }); burst(D.combo > 3 ? 12 : 6);
  }
  if (!D.tiles.some(q => q.on)) { winNow(D, quiet); return true; }
  if (!findMove(D)) reshuffle(D, quiet);   /* tự xáo khi hết nước đi: xác định được từ hạt giống nên KHÔNG ghi vào hist */
  return true;
}
function winNow(D, quiet) {
  if (D.over) return; const par = D.tiles.length * 2;
  D.bonus = 300 + (D.C.time ? Math.ceil(remain(D)) * 5 : Math.max(0, Math.floor(par - D.time)) * 3); D.over = true; D.reason = "win"; D.sel = -1;
  if (quiet) return; sfx.end(); NPJuice.confetti($("play"), 24, CONF); setTimeout(() => { if (G === D) finish(D); }, 900);
}
function timeUp(D) { if (D.over) return; D.over = true; D.reason = "time"; D.flash = 1; sfx.bad(); setTimeout(() => { if (G === D) finish(D); }, 900); }
function useHint(D) {
  if (!D || D.over || D.hints <= 0) return false; const m = findMove(D); if (!m) return false;
  D.hints--; D.hint = { a: m[0], b: m[1], t: 2 }; sfx.up(); hud(); return true;
}
function step(D, dt) {
  if (D.over) return; D.time += dt;
  for (const p of D.pops) p.t -= dt; D.pops = D.pops.filter(p => p.t > 0);
  for (const f of D.fx) f.t -= dt; D.fx = D.fx.filter(f => f.t > 0);
  for (const t of D.tiles) if (t.sh > 0) t.sh = Math.max(0, t.sh - dt);
  if (D.hint) { D.hint.t -= dt; if (D.hint.t <= 0) D.hint = null; }
  D.flash = Math.max(0, D.flash - dt * 2.5);
  if (D.nextShuf && D.time >= D.nextShuf) { D.nextShuf += D.C.shuf; D.hist.push(-1); reshuffle(D); }
  if (D.C.time && remain(D) <= 0) timeUp(D);
  if (Math.floor(D.time * 4) !== D._q) { D._q = Math.floor(D.time * 4); hud(); }
}
function burst(n){if(!isProSk()&&n<12)return;
  const host = $("play"), L = (skinOf().deco || ["⭐", "🌸"]);
  for (let i = 0; i < n; i++) {
    if (host.querySelectorAll(".eb2").length > 30) break;
    const e = document.createElement("i"), a = Math.random() * 6.283, d = 14 + Math.random() * 30; e.className = "eb2"; e.textContent = L[i % L.length];
    e.style.left = "50%"; e.style.top = "42%"; e.style.setProperty("--dx", Math.cos(a) * d + "cqw"); e.style.setProperty("--dy", (Math.sin(a) * d * .8 - 4) + "cqw");
    e.style.setProperty("--rt", (Math.random() * 120 - 60) + "deg"); host.appendChild(e); setTimeout(() => e.remove(), 950);
  }
}
const mmss = s => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
function HUD(D) {
  const u = $("tdH"); if (u) { u.textContent = "💡 " + T("hint") + " ×" + D.hints; u.disabled = D.hints <= 0 || D.over; }
  return [[scoreOf(D), "sc"], [D.C.time ? Math.ceil(remain(D)) + "s" : mmss(D.time), "tm"], [leftOf(D), "ex"]];
}
function endChips(D) {
  const n = scoreOf(D), lv = LVN[D.lv];
  return [lv[0] + " " + L2([lv[1], lv[2]]), TYPES[D.t][0] + " " + L2([TYPES[D.t][1], TYPES[D.t][2]]), "🧩 " + T("sets", { n: D.pairs }), D.maxCombo > 1 ? "🔥×" + D.maxCombo : "", D.errs ? "✕ " + D.errs : "", (D.prevBest > 0 && n > D.prevBest) ? T("rec") : ""];
}
const shareT = D => L2([LVN[D.lv][1], LVN[D.lv][2]]) + " · " + L2([TYPES[D.t][1], TYPES[D.t][2]]);
function snapP(D) { return D.hist.length ? { h: D.hist.slice(), s: D.pts, t: Math.round(D.time * 10) / 10, n: D.hints, e: D.errs, p: Math.round(D.pen) } : null; }
function restoreP(D, p) {
  const h = (p.h || []).slice(0, 200);
  for (let k = 0; k < h.length; k++) { if (h[k] === -1) { reshuffle(D, true); D.hist.push(-1); continue; } if (h[k + 1] != null) { pickTile(D, h[k] | 0, true); pickTile(D, h[k + 1] | 0, true); k++; } }
  D.pts = +p.s || D.pts; D.time = +p.t || 0; D.hints = Math.max(0, Math.min(3, +p.n || 0)); D.errs = +p.e || 0; D.pen = +p.p || 0; D.nextShuf = D.C.shuf ? (Math.floor(D.time / D.C.shuf) + 1) * D.C.shuf : 0; hud();
}
function renderLevels() {
  let b = $("lvs"); if (!b) { b = document.createElement("div"); b.className = "lvs"; b.id = "lvs"; $("home").insertBefore(b, $("tys")); }
  b.innerHTML = ""; LVN.forEach((t, i) => { const e = document.createElement("button"); e.type = "button"; e.className = "lv" + (DIF === i ? " on" : ""); e.textContent = t[0] + " " + L2([t[1], t[2]]); e.onclick = () => { DIF = i; LS.set("td-lv", i); renderLevels(); }; b.appendChild(e); });
}
function onBegin(D) { fitCanvas(); const u = $("tdH"); if (u && !u._b) { u._b = 1; u.onclick = () => useHint(G); } }
function onLang(D) { hud(); }
new MutationObserver(() => { if (!$("home").hidden) renderLevels(); }).observe($("home"), { attributes: true, attributeFilter: ["hidden"] });
document.addEventListener("click", e => { if (e.target.closest && e.target.closest("#bLang")) setTimeout(renderLevels, 0); });
renderLevels();
/* lên level khi kết thúc màn (shared/levelup.js): level = độ khó Dễ/Thường/Khó; chỉ ván dọn sạch bàn mới mở level tiếp */
window.NPLevel && NPLevel.attach({ levels: 3, cur: () => G ? G.lv : -1, won: () => !!G && G.reason === "win", skip: () => !G || G.mode !== "free" || !!G.ch,
  go: i => { DIF = i; LS.set("td-lv", i); if (PF.pro && PF.pro.trial) PF.lockPro(); begin(newSeed(), "free", G ? G.t : TY, null); } });
