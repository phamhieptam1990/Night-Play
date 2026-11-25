/* Săn Chữ Ẩn — luật: kéo ngón tay qua một hàng chữ thẳng (ngang/dọc/chéo) để khoanh từ trong danh sách. Tìm hết là thắng. */
const lvInfo = i => LVN[i] || ["🔥", "Cấp " + (i + 1), "Level " + (i + 1)];
const rankIdx = n => n >= 2600 ? 4 : n >= 1800 ? 3 : n >= 1100 ? 2 : n >= 500 ? 1 : 0;
const scoreOf = D => D.pts + D.bonus;
const remain = D => D.CF.time ? Math.max(0, D.limit - D.time) : 0;
const foundOf = D => D.words.reduce((a, w) => a + (w.found ? 1 : 0), 0);
let DIF = (() => { const v = LS.get("sc-lv", 1); return Number.isInteger(v) && v >= 0 && v < LVC.length ? v : 1; })();
const lvOf = (seed, mode) => mode === "free" ? DIF : seed % 3;
function newGame(seed, mode, t, ch) {
  const lv = lvOf(seed, mode); seed = seed - seed % 3 + Math.min(lv, 2); const sk = skinOf(), P = genPuzzle(seed, lv, sk) || genPuzzle(seed + 3, lv, { words: WORDS });
  const D = { seed, mode, t, lv, CF: CFG[t], n: P.n, grid: P.grid, words: P.words, used: P.used, ch: ch || null, sel: null, order: [], pts: 0, bonus: 0, combo: 0, maxCombo: 0, lastF: -99, hints: lv >= 6 ? 1 : lv >= 4 ? 2 : 3, hint: null, errs: 0,
    fx: [], shake: 0, flash: 0, storms: 0, nextStorm: CFG[t].storm, limit: 60 + P.words.length * 14, over: false, reason: "end", time: 0, dur: 1e9, beat: false };
  return D;
}
const cellsOfSel = D => { const s = D.sel; if (!s) return []; const n = D.n, r0 = Math.floor(s.a / n), c0 = s.a % n, o = []; for (let i = 0; i <= s.len; i++) o.push((r0 + s.d[0] * i) * n + c0 + s.d[1] * i); return o; };
/* chuyển toạ độ trỏ → (dòng, cột) thực; chốt hướng gần nhất trong 8 hướng và độ dài, không ra ngoài lưới/hình */
function aim(D, a, pr, pc) {
  const n = D.n, r0 = Math.floor(a / n), c0 = a % n, dr = pr - r0 - .5, dc = pc - c0 - .5; if (Math.hypot(dr, dc) < .45) return { d: [0, 1], len: 0 };
  const k = Math.round(Math.atan2(dr, dc) / (Math.PI / 4)), d = [Math.round(Math.sin(k * Math.PI / 4)), Math.round(Math.cos(k * Math.PI / 4))], len0 = Math.round((dr * d[0] + dc * d[1]) / (d[0] * d[0] + d[1] * d[1]));
  let len = 0; for (let i = 1; i <= len0; i++) { const r = r0 + d[0] * i, c = c0 + d[1] * i; if (r < 0 || c < 0 || r >= n || c >= n || !D.grid[r * n + c]) break; len = i; }
  return { d, len };
}
function endSel(D) {
  const cells = cellsOfSel(D); D.sel = null; if (cells.length < 2 || D.over) return; const s = cells.map(i => D.grid[i]).join(""), rs = s.split("").reverse().join("");
  const w = D.words.find(x => !x.found && (x.w === s || x.w === rs));
  if (!w) { D.errs++; D.combo = 0; D.shake = .3; sfx.bad(); if (window.NPFx) NPFx.buzz(15); return; }
  w.found = true; w.col = D.order.length % 6; w.dir = cells; D.order.push(D.words.indexOf(w)); if (D.hint && D.hint.w === w) D.hint = null;
  D.combo = D.time - D.lastF <= 10 ? D.combo + 1 : 1; D.lastF = D.time; D.maxCombo = Math.max(D.maxCombo, D.combo);
  const add = 100 + 20 * Math.min(D.combo - 1, 5) + Math.max(0, Math.round(15 - D.time / Math.max(1, D.order.length)) * 2); D.pts += add; sfx.combo(D.combo * 3); if (window.NPFx) NPFx.buzz(12);
  D.fx.push({ i: cells[cells.length >> 1], t: .6 }); NPJuice.text($("play"), "+" + add + (D.combo > 1 ? " ×" + D.combo : ""), { color: "#ffd24a", top: "30%", size: 5.2 }); burst(D.combo > 2 ? 12 : 6);
  if (foundOf(D) === D.words.length) winNow(D);
}
function winNow(D, quiet) {
  if (D.over) return; D.bonus = 300 + (D.CF.time ? Math.ceil(remain(D)) * 5 : Math.max(0, Math.round(D.words.length * 14 - D.time)) * 3); D.over = true; D.reason = "win"; if (quiet) return;
  sfx.end(); NPJuice.confetti($("play"), 24, CONF); setTimeout(() => { if (G === D) finish(D); }, 900);
}
function timeUp(D) { if (D.over) return; D.over = true; D.reason = "time"; D.flash = 1; sfx.bad(); setTimeout(() => { if (G === D) finish(D); }, 900); }
function useHint(D) {
  if (!D || D.over || D.hints <= 0) return false; const w = D.words.find(x => !x.found); if (!w) return false; D.hints--; D.hint = { w, t: 3 }; sfx.up(); hud(); return true;
}
/* Loại "Bão chữ": cứ 25 giây các ô KHÔNG thuộc từ nào đổi chữ khác */
function storm(D, quiet) {
  const R = sub(D.seed, 300 + D.storms++), A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; for (let i = 0; i < D.grid.length; i++) if (D.grid[i] && !D.used.has(i)) D.grid[i] = A[Math.floor(R() * 26)];
  if (!quiet) { toast(T("storm"), 1100); sfx.up(); }
}
function step(D, dt) {
  if (D.over) return; D.time += dt; for (const f of D.fx) f.t -= dt; D.fx = D.fx.filter(f => f.t > 0); D.shake = Math.max(0, D.shake - dt); D.flash = Math.max(0, D.flash - dt * 2.5);
  if (D.hint) { D.hint.t -= dt; if (D.hint.t <= 0) D.hint = null; }
  if (D.nextStorm && D.time >= D.nextStorm) { D.nextStorm += D.CF.storm; storm(D); }
  if (D.CF.time && remain(D) <= 0) timeUp(D);
  if (Math.floor(D.time * 4) !== D._q) { D._q = Math.floor(D.time * 4); hud(); }
}
function burst(n){if(!isProSk()&&n<12)return;
  const host = $("play"), L = (skinOf().deco || ["⭐", "🔤"]);
  for (let i = 0; i < n; i++) {
    if (host.querySelectorAll(".eb2").length > 30) break;
    const e = document.createElement("i"), a = Math.random() * 6.283, d = 14 + Math.random() * 30; e.className = "eb2"; e.textContent = L[i % L.length];
    e.style.left = "50%"; e.style.top = "40%"; e.style.setProperty("--dx", Math.cos(a) * d + "cqw"); e.style.setProperty("--dy", (Math.sin(a) * d * .8 - 4) + "cqw");
    e.style.setProperty("--rt", (Math.random() * 120 - 60) + "deg"); host.appendChild(e); setTimeout(() => e.remove(), 950);
  }
}
const mmss = s => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
function HUD(D) {
  const u = $("scH"); if (u) { u.textContent = "💡 " + T("hint") + " ×" + D.hints; u.disabled = D.hints <= 0 || D.over; }
  return [[scoreOf(D), "sc"], [D.CF.time ? Math.ceil(remain(D)) + "s" : mmss(D.time), "tm"], [foundOf(D) + "/" + D.words.length, "ex"]];
}
function endChips(D) {
  const n = scoreOf(D), lv = lvInfo(D.lv);
  return [lv[0] + " " + L2([lv[1], lv[2]]), TYPES[D.t][0] + " " + L2([TYPES[D.t][1], TYPES[D.t][2]]), "🔤 " + T("sets", { n: foundOf(D) }), D.maxCombo > 1 ? "🔥×" + D.maxCombo : "", (D.prevBest > 0 && n > D.prevBest) ? T("rec") : ""];
}
const shareT = D => L2([lvInfo(D.lv)[1], lvInfo(D.lv)[2]]) + " · " + L2([TYPES[D.t][1], TYPES[D.t][2]]);
function snapP(D) { return D.order.length ? { f: D.order.slice(), s: D.pts, t: Math.round(D.time * 10) / 10, n: D.hints, o: D.storms } : null; }
function restoreP(D, p) {
  for (const i of (p.f || []).slice(0, 20)) { const w = D.words[i | 0]; if (w && !w.found) { w.found = true; w.col = D.order.length % 6; w.dir = w.cells; D.order.push(i | 0); } }
  for (let k = 0; k < (+p.o || 0) && k < 50; k++) storm(D, true);
  D.pts = +p.s || 0; D.time = +p.t || 0; D.hints = Math.max(0, Math.min(3, +p.n || 0)); D.nextStorm = D.CF.storm ? (Math.floor(D.time / D.CF.storm) + 1) * D.CF.storm : 0; hud();
}
function renderLevels() {
  let b = $("lvs"); if (!b) { b = document.createElement("div"); b.className = "lvs"; b.id = "lvs"; $("home").insertBefore(b, $("tys")); }
  b.innerHTML = ""; LVN.forEach((t, i) => { const e = document.createElement("button"); e.type = "button"; e.className = "lv" + (DIF === i ? " on" : ""); e.textContent = t[0] + " " + L2([t[1], t[2]]); e.onclick = () => { DIF = i; LS.set("sc-lv", i); renderLevels(); }; b.appendChild(e); });
}
function onBegin(D) { fitCanvas(); const u = $("scH"); if (u && !u._b) { u._b = 1; u.onclick = () => useHint(G); } }
function onLang(D) { hud(); }
new MutationObserver(() => { if (!$("home").hidden) renderLevels(); }).observe($("home"), { attributes: true, attributeFilter: ["hidden"] });
document.addEventListener("click", e => { if (e.target.closest && e.target.closest("#bLang")) setTimeout(renderLevels, 0); });
renderLevels();
/* lên level cuối màn (shared/levelup.js): trần 8 level (lưới 8→14, 6→14 từ); chỉ ván thắng mới mở level tiếp */
window.NPLevel && NPLevel.attach({ levels: LVC.length, cur: () => G ? G.lv : -1, won: () => !!G && G.reason === "win", skip: () => !G || G.mode !== "free" || !!G.ch,
  go: i => { DIF = i; LS.set("sc-lv", i); if (PF.pro && PF.pro.trial) PF.lockPro(); begin(newSeed(), "free", G ? G.t : TY, null); } });
