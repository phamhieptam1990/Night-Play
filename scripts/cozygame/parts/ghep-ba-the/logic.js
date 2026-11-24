/* Ghép Ba Thẻ — luật chơi: chạm thẻ không bị đè → vào khay 7 ô; đủ 3 thẻ giống nhau thì biến mất. Khay đầy là thua. */
const CL_T = .45, COMBO_WIN = 6;
const rankIdx = n => n >= 3200 ? 4 : n >= 2200 ? 3 : n >= 1300 ? 2 : n >= 600 ? 1 : 0;
const scoreOf = D => D.pts + D.bonus;
const remain = D => D.C.time ? Math.max(0, D.C.time - D.time) : 0;
const leftOf = D => D.tiles.reduce((a, t) => a + (t.on ? 1 : 0), 0);
function newGame(seed, mode, t, ch) {
  const C = CFG[t], sk = skinOf(), icons = sk.icons || ICONS, ps = shuffle(icons.map((_, i) => i), sub(seed, 31)).slice(0, C.K);
  const base = buildTiles(sk.layers || PILE, C.big);
  let g = null; for (let a = 0; a < 60 && !g; a++) g = genKinds(base, C.K, sub(seed, 60 + a));
  if (!g) g = { kind: base.map((_, i) => Math.floor(i / 3) % C.K), order: base.map((_, i) => i) };
  base.forEach((b, i) => { b.i = i; b.k = ps[g.kind[i]]; b.on = true; b.sh = 0; });
  const D = { seed, mode, t, C, ch: ch || null, tiles: base, sol: g.order, tray: [], pops: [], fx: [], hist: [], pts: 0, bonus: 0, cleared: 0, combo: 0, maxCombo: 0, lastClr: -99,
    undo: 1, over: false, reason: "end", time: 0, dur: 1e9, beat: false, shake: 0, flash: 0 };
  calcFree(D); return D;
}
function layTray(D) { D.tray.forEach((q, i) => { q.tx = slotX(i); q.ty = TRAY_Y + 4; }); }
const slotX = i => (W - (SLOTS * 44 + (SLOTS - 1) * 4)) / 2 + i * 48;
function pickTile(D, i, quiet) {
  const t = D.tiles[i];
  if (D.over || !t || !t.on || !t.free) return false;
  t.on = false; calcFree(D);
  let at = D.tray.length; for (let j = D.tray.length - 1; j >= 0; j--) if (D.tray[j].k === t.k) { at = j + 1; break; }
  const dx = -t.l * 2, dy = -t.l * 3, it = { id: i, k: t.k, x: t.x + dx, y: t.y + dy, tx: 0, ty: 0, s: 1 };
  D.tray.splice(at, 0, it); D.hist.push(i); layTray(D);
  if (quiet) { it.x = it.tx; it.y = it.ty; }
  if (!quiet) { sfx.ok(); if (window.NPFx) NPFx.buzz(8); }
  const same = D.tray.filter(q => q.k === t.k);
  if (same.length >= 3) {
    const gone = same.slice(0, 3); D.tray = D.tray.filter(q => !gone.includes(q));
    D.combo = (D.time - D.lastClr <= COMBO_WIN) ? D.combo + 1 : 1; D.lastClr = D.time; D.maxCombo = Math.max(D.maxCombo, D.combo);
    const add = 100 + 25 * Math.min(D.combo - 1, 6); D.pts += add; D.cleared++; layTray(D);
    if (!quiet) {
      const mx = gone.reduce((a, q) => a + q.tx, 0) / 3; gone.forEach(q => D.pops.push({ x: q.tx || mx, y: q.ty, k: q.k, t: CL_T }));
      D.fx.push({ x: mx + 22, y: TRAY_Y + 26, t: .5, c: "#ffd24a" }); sfx.combo(D.combo * 3);
      NPJuice.text($("play"), "+" + add + (D.combo > 1 ? " ×" + D.combo : ""), { color: "#ffd24a", top: "26%", size: 5.2 }); burst(D.combo > 2 ? 12 : 6);
    }
  }
  if (!D.tiles.some(q => q.on) && !D.tray.length) { winNow(D, quiet); return true; }
  if (D.tray.length >= SLOTS) { if (!quiet) failNow(D, "full"); }
  return true;
}
function winNow(D, quiet) {
  if (D.over) return; D.bonus = 300 + (D.undo > 0 ? 50 : 0) + (D.C.time ? Math.ceil(remain(D)) * 10 : 0); D.over = true; D.reason = "win";
  if (quiet) return; sfx.end(); NPJuice.confetti($("play"), 24, CONF); setTimeout(() => { if (G === D) finish(D); }, 900);
}
function failNow(D, why) {
  if (D.over) return; D.over = true; D.reason = why; D.flash = 1; sfx.bad(); if (window.NPFx) NPFx.buzz([40, 30, 40]);
  setTimeout(() => { if (G === D) finish(D); }, 900);
}
function undoTile(D) {
  if (!D || D.over || D.undo <= 0) return false;
  for (let h = D.hist.length - 1; h >= 0; h--) {
    const q = D.tray.find(x => x.id === D.hist[h]); if (!q) continue;
    const t = D.tiles[q.id]; D.tray = D.tray.filter(x => x !== q); D.hist.splice(h, 1); t.on = true; calcFree(D); layTray(D); D.undo--;
    sfx.up(); hud(); return true;
  }
  toast(T("noUndo"), 1200); return false;
}
function step(D, dt) {
  if (D.over) return; D.time += dt;
  const e = Math.min(1, dt * 14); for (const q of D.tray) { q.x += (q.tx - q.x) * e; q.y += (q.ty - q.y) * e; }
  for (const p of D.pops) p.t -= dt; D.pops = D.pops.filter(p => p.t > 0);
  for (const f of D.fx) f.t -= dt; D.fx = D.fx.filter(f => f.t > 0);
  for (const t of D.tiles) if (t.sh > 0) t.sh = Math.max(0, t.sh - dt);
  D.flash = Math.max(0, D.flash - dt * 2.5);
  if (D.C.time && remain(D) <= 0) failNow(D, "time");
  if (Math.floor(D.time * 4) !== D._q) { D._q = Math.floor(D.time * 4); hud(); }
}
function burst(n){if(!isProSk()&&n<12)return;
  const host = $("play"), L = (skinOf().deco || ["⭐", "🎃"]);
  for (let i = 0; i < n; i++) {
    if (host.querySelectorAll(".eb2").length > 30) break;
    const e = document.createElement("i"), a = Math.random() * 6.283, d = 14 + Math.random() * 30; e.className = "eb2"; e.textContent = L[i % L.length];
    e.style.left = "50%"; e.style.top = "40%"; e.style.setProperty("--dx", Math.cos(a) * d + "cqw"); e.style.setProperty("--dy", (Math.sin(a) * d * .8 - 4) + "cqw");
    e.style.setProperty("--rt", (Math.random() * 120 - 60) + "deg"); host.appendChild(e); setTimeout(() => e.remove(), 950);
  }
}
function HUD(D) {
  const u = $("gtU"); if (u) { u.textContent = "↩ " + T("undo") + " ×" + D.undo; u.disabled = D.undo <= 0 || D.over; }
  return [[scoreOf(D), "sc"], [D.C.time ? Math.ceil(remain(D)) + "s" : D.tray.length + "/" + SLOTS, D.C.time ? "tm2" : "tm"], [leftOf(D), "ex"]];
}
function endChips(D) {
  const n = scoreOf(D);
  return [TYPES[D.t][0] + " " + L2([TYPES[D.t][1], TYPES[D.t][2]]), "🧩 " + T("sets", { n: D.cleared }), D.maxCombo > 1 ? "🔥×" + D.maxCombo : "", (D.prevBest > 0 && n > D.prevBest) ? T("rec") : ""];
}
const shareT = D => L2([TYPES[D.t][1], TYPES[D.t][2]]);
function snapP(D) { return D.hist.length ? { h: D.hist.slice(), s: D.pts, t: Math.round(D.time * 10) / 10, u: D.undo, c: D.cleared } : null; }
function restoreP(D, p) {
  for (const i of (p.h || []).slice(0, 80)) pickTile(D, +i | 0, true);
  D.pts = +p.s || D.pts; D.time = +p.t || 0; D.undo = Math.max(0, Math.min(1, +p.u || 0)); D.cleared = +p.c || D.cleared; D.tray.forEach(q => { q.x = q.tx; q.y = q.ty; }); hud();
}
function onBegin(D) { fitCanvas(); const u = $("gtU"); if (u && !u._b) { u._b = 1; u.onclick = () => undoTile(G); } }
function onLang(D) { hud(); }
