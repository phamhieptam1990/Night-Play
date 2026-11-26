/* Nối Đôi — luật: chạm một thẻ rồi chạm thẻ GIỐNG nó; nếu nối được bằng đường ≤ 2 chỗ rẽ qua ô trống thì cả đôi
   biến mất. Dọn sạch bàn là thắng. Hết nước đi thì tự xáo lại. Loại Rơi xuống: thẻ trong cột rơi xuống lấp chỗ trống sau mỗi đôi. */
const COMBO_MAX = 8, POP_T = .4, LINE_T = .35;
const rankIdx = n => n >= 2600 ? 4 : n >= 1700 ? 3 : n >= 1000 ? 2 : n >= 450 ? 1 : 0;
const scoreOf = D => D.pts + D.bonus;
const remain = D => D.C2 ? Math.max(0, D.limit - D.time - D.pen) : 0;
const leftOf = D => D.tiles.reduce((a, t) => a + (t.on ? 1 : 0), 0) / 2;
let DIF = (() => { const v = Math.floor(+LS.get("nd-lv", 1)); return v >= 0 && v < ND_MAX + 30 ? v : 1; })();   /* cho phép vượt trần (level tự nâng) */
const lvOf = (seed, mode) => mode === "free" ? DIF : seed % 3;
function newGame(seed, mode, t, ch) {
  const lv = lvOf(seed, mode); seed = seed - seed % 3 + lv % 3;   /* độ khó nằm trong hạt giống → chia sẻ/thách đấu/đấu lại đúng ván */
  const B = Math.max(0, lv - (ND_MAX - 1)), LC0 = Object.assign({}, LVC[Math.min(lv, ND_MAX - 1)]), sk = skinOf(), icons = sk.icons || ICONS;
  const LC = Object.assign({}, LC0, { K: Math.min(LC0.K, icons.length) }), C = Object.assign({}, CFG[t]);
  if (B) { LC.tpp = Math.max(1.6, +((LC.tpp || 2.8) * (1 - .04 * B)).toFixed(2)); if (LC.em) LC.em = Math.max(2, LC.em - B); }
  if (LC.tpp) C.time = 1;
  const ps = shuffle(icons.map((_, i) => i), sub(seed, 31)).slice(0, LC.K), tiles = [];
  for (let y = 1; y <= LC.r; y++) for (let x = 1; x <= LC.c; x++) tiles.push({ i: tiles.length, x, y, k: 0, on: true, sh: 0, oy: 0 });
  const D = { seed, mode, t, lv, C: LC.c, R: LC.r, CF: C, LC, ps, ch: ch || null, tiles, pops: [], fx: [], hist: [], sel: -1, hint: null, hints: 3, shuf: 0, errs: 0, pairs: 0, line: null,
    pts: 0, bonus: 0, combo: 0, maxCombo: 0, pen: 0, C2: C.time ? 1 : 0, nextShuf: C.shuf, over: false, reason: "end", time: 0, dur: 1e9, beat: false, shake: 0, flash: 0 };
  D.limit = Math.round((LC.tpp || 3.4) * tiles.length / 2); D.geo = geo(LC.c, LC.r); mkGrid(D);
  const kinds = pairKinds(tiles.length, LC.K, ps, sub(seed, 17)); if (!deal(D, a => sub(seed, 60 + a), kinds)) tiles.forEach((t, j) => { t.k = kinds[j]; });
  return D;
}
function reshuffle(D, quiet) {
  const live = D.tiles.filter(t => t.on), kinds = live.map(t => t.k); D.shuf++;
  deal(D, a => sub(D.seed, 200 + D.shuf * 50 + a), kinds); D.sel = -1; D.hint = null; D.line = null;
  if (!quiet) { toast(T("shuf"), 1400); sfx.up(); }
}
/* Rơi xuống: mỗi cột dồn thẻ xuống đáy (giữ thứ tự), cập nhật ô + hoạt ảnh trượt */
function dropAll(D, quiet) {
  for (let x = 1; x <= D.C; x++) {
    const col = D.tiles.filter(t => t.on && t.x === x).sort((a, b) => b.y - a.y);
    col.forEach((t, j) => { const ny = D.R - j; if (!quiet && ny !== t.y) t.oy -= (ny - t.y) * D.geo.ch; t.y = ny; });
  }
}
function tryLink(D, a, b) {
  if (a.k !== b.k) return null;
  return findPath(D, a, b);
}
function pickTile(D, i, quiet) {
  const t = D.tiles[i]; if (D.over || !t || !t.on) return false;
  if (D.sel === i) { D.sel = -1; return true; }
  if (D.sel < 0) { D.sel = i; if (!quiet) sfx.ok(); return true; }
  const a = D.tiles[D.sel], path = tryLink(D, a, t);
  if (!path) {
    D.errs++; D.combo = 0; D.sel = i; if (D.C2) D.pen += 3;
    if (D.LC.em && D.errs > D.LC.em) { loseNow(D, "errs", quiet); return true; }
    if (!quiet) { a.sh = t.sh = .3; sfx.bad(); if (window.NPFx) NPFx.buzz([30, 20, 30]); }
    return true;
  }
  a.on = false; t.on = false; D.hist.push(a.i, t.i); D.sel = -1; D.hint = null; D.pairs++;
  D.combo++; D.maxCombo = Math.max(D.maxCombo, D.combo);
  const add = 50 + 10 * Math.min(D.combo - 1, COMBO_MAX) + (path.length <= 2 ? 10 : 0); D.pts += add;
  if (!quiet) {
    D.line = { p: path, t: LINE_T }; [a, t].forEach(q => D.pops.push({ x: q.x, y: q.y, k: q.k, t: POP_T })); sfx.combo(D.combo * 3);
    NPJuice.text($("play"), "+" + add + (D.combo > 1 ? " ×" + D.combo : ""), { color: "#ffd24a", top: "30%", size: 5.2 }); burst(D.combo > 3 ? 12 : 6);
  }
  if (D.CF.grav) dropAll(D, quiet);
  mkGrid(D);
  if (!D.tiles.some(q => q.on)) { winNow(D, quiet); return true; }
  if (!findMove(D)) { if (D.LC.ns) { loseNow(D, "stuck", quiet); return true; } reshuffle(D, quiet); }   /* tự xáo: xác định từ hạt giống nên KHÔNG ghi vào hist */
  return true;
}
function winNow(D, quiet) {
  if (D.over) return; const par = D.tiles.length * 1.6;
  D.bonus = 300 + (D.C2 ? Math.ceil(remain(D)) * 5 : Math.max(0, Math.floor(par - D.time)) * 3); D.over = true; D.reason = "win"; D.sel = -1;
  if (quiet) return; sfx.end(); NPJuice.confetti($("play"), 24, CONF); setTimeout(() => { if (G === D) finish(D); }, 900);
}
function loseNow(D, why, quiet) {
  if (D.over) return; D.over = true; D.reason = why; D.sel = -1; if (quiet) return; D.flash = 1; sfx.bad(); if (window.NPFx) NPFx.buzz([40, 30, 40]);
  setTimeout(() => { if (G === D) finish(D); }, 900);
}
function timeUp(D) { if (D.over) return; D.over = true; D.reason = "time"; D.flash = 1; sfx.bad(); setTimeout(() => { if (G === D) finish(D); }, 900); }
function useHint(D) {
  if (!D || D.over || D.hints <= 0) return false; const m = findMove(D); if (!m) return false;
  D.hints--; D.hint = { a: m[0], b: m[1], t: 2.2 }; sfx.up(); hud(); return true;
}
function step(D, dt) {
  if (D.over) return; D.time += dt;
  for (const p of D.pops) p.t -= dt; D.pops = D.pops.filter(p => p.t > 0);
  for (const f of D.fx) f.t -= dt; D.fx = D.fx.filter(f => f.t > 0);
  if (D.line) { D.line.t -= dt; if (D.line.t <= 0) D.line = null; }
  for (const t of D.tiles) { if (t.sh > 0) t.sh = Math.max(0, t.sh - dt); if (t.oy) t.oy = Math.abs(t.oy) < 1 ? 0 : t.oy * Math.max(0, 1 - dt * 14); }
  if (D.hint) { D.hint.t -= dt; if (D.hint.t <= 0) D.hint = null; }
  D.flash = Math.max(0, D.flash - dt * 2.5);
  if (D.nextShuf && D.time >= D.nextShuf) { D.nextShuf += D.CF.shuf; D.hist.push(-1); reshuffle(D); }
  if (D.C2 && remain(D) <= 0) timeUp(D);
  if (Math.floor(D.time * 4) !== D._q) { D._q = Math.floor(D.time * 4); hud(); }
}
function burst(n) {
  if (!isProSk() && n < 12) return;
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
  const u = $("ndH"); if (u) { u.textContent = "💡 " + T("hint") + " ×" + D.hints; u.disabled = D.hints <= 0 || D.over; }
  return [[scoreOf(D), "sc"], [D.C2 ? Math.ceil(remain(D)) + "s" : D.LC.em ? "✕ " + D.errs + "/" + D.LC.em : mmss(D.time), "tm"], [leftOf(D), "ex"]];
}
function endChips(D) {
  const n = scoreOf(D), lv = LVN[D.lv];
  return [lv[0] + " " + L2([lv[1], lv[2]]), TYPES[D.t][0] + " " + L2([TYPES[D.t][1], TYPES[D.t][2]]), "🔗 " + T("sets", { n: D.pairs }),
    D.maxCombo > 1 ? "🔥×" + D.maxCombo : "", D.errs ? "✕ " + D.errs : "", (D.prevBest > 0 && n > D.prevBest) ? T("rec") : ""];
}
const shareT = D => L2([LVN[D.lv][1], LVN[D.lv][2]]) + " · " + L2([TYPES[D.t][1], TYPES[D.t][2]]);
function snapP(D) { return D.hist.length ? { h: D.hist.slice(), s: D.pts, t: Math.round(D.time * 10) / 10, n: D.hints, e: D.errs, p: Math.round(D.pen) } : null; }
function restoreP(D, p) {
  const h = (p.h || []).slice(0, 240);
  for (let k = 0; k < h.length; k++) {
    if (h[k] === -1) { reshuffle(D, true); D.hist.push(-1); continue; }
    if (h[k + 1] != null) { pickTile(D, h[k] | 0, true); pickTile(D, h[k + 1] | 0, true); k++; }
  }
  D.pts = +p.s || D.pts; D.time = +p.t || 0; D.hints = Math.max(0, Math.min(3, +p.n || 0)); D.errs = +p.e || 0; D.pen = +p.p || 0;
  D.nextShuf = D.CF.shuf ? (Math.floor(D.time / D.CF.shuf) + 1) * D.CF.shuf : 0; hud();
}
function renderLevels() {
  let b = $("lvs"); if (!b) { b = document.createElement("div"); b.className = "lvs"; b.id = "lvs"; $("home").insertBefore(b, $("tys")); }
  b.innerHTML = ""; LVN.slice(0, 3).forEach((t, i) => {
    const e = document.createElement("button"); e.type = "button";   /* 3 chip cố định; level 4-6 chỉ mở bằng lên level */
    e.className = "lv" + (DIF === i || (i === 2 && DIF > 2) ? " on" : "");
    e.textContent = t[0] + " " + L2([t[1], t[2]]); e.onclick = () => { DIF = i; LS.set("nd-lv", i); renderLevels(); }; b.appendChild(e);
  });
}
function onBegin(D) { fitCanvas(); const u = $("ndH"); if (u && !u._b) { u._b = 1; u.onclick = () => useHint(G); } }
function onLang(D) { hud(); }
new MutationObserver(() => { if (!$("home").hidden) renderLevels(); }).observe($("home"), { attributes: true, attributeFilter: ["hidden"] });
document.addEventListener("click", e => { if (e.target.closest && e.target.closest("#bLang")) setTimeout(renderLevels, 0); });
renderLevels();
/* lên level khi kết thúc màn (shared/levelup.js): level = bảng LVC (trần ND_MAX = 6); chỉ ván dọn sạch bàn mới mở level tiếp */
window.NPLevel && NPLevel.attach({ levels: ND_MAX, endless: true, cur: () => G ? G.lv : -1, won: () => !!G && G.reason === "win",
  skip: () => !G || G.mode !== "free" || !!G.ch,
  go: i => { DIF = i; LS.set("nd-lv", i); if (PF.pro && PF.pro.trial) PF.lockPro(); begin(newSeed(), "free", G ? G.t : TY, null); } });
