/* Trượt Số Nam Châm — xếp số trượt R×C (như đồ chơi nam châm 5×5): chạm một ô cùng hàng/cột với ô trống thì CẢ DÃY trượt về phía ô trống.
   Số hàng/cột do người chơi nhập (2–10). Xáo bằng cách đi ngược từ ván đã xong nên ván nào cũng giải được. */
const W = 360, H = 400, PAD = 12, MIN_N = 2, MAX_N = 10, MAXT = 100;
const CFG = [{ time: 0, hid: 0, hop: 0 }, { time: 0, hid: 1, hop: 0 }, { time: 1, hid: 0, hop: 0 }, { time: 0, hid: 0, hop: 12 }];
const clampN = v => Math.max(MIN_N, Math.min(MAX_N, Math.round(+v) || 4));
let SZ = (() => { const v = LS.get("ts-sz", [4, 4]); return Array.isArray(v) && v.length === 2 ? [clampN(v[0]), clampN(v[1])] : [4, 4]; })();
const encSz = (r, c) => (r - 2) * 9 + (c - 2), decSz = k => [Math.floor(k / 9) + 2, k % 9 + 2];
const rankIdx = n => n >= 6500 ? 4 : n >= 4500 ? 3 : n >= 2800 ? 2 : n >= 1400 ? 1 : 0;
const cellOf = (R, C) => Math.min((W - 2 * PAD) / C, (H - 2 * PAD) / R);
const posOf = (D, i) => [PAD + (W - 2 * PAD - D.cell * D.C) / 2 + (i % D.C) * D.cell, PAD + (H - 2 * PAD - D.cell * D.R) / 2 + Math.floor(i / D.C) * D.cell];
const correctOf = D => D.g.reduce((a, v, i) => a + (v && v === i + 1 ? 1 : 0), 0);
const solvedOf = D => D.blank === D.n - 1 && correctOf(D) === D.n - 1;
const remain = D => D.CF.time ? Math.max(0, D.limit - D.time) : 0;
function finalScore(D) {
  const n = D.n, par = Math.round(1.4 * n * (D.R + D.C) / 2), eff = Math.max(0, 1 - D.moves / (par * 2)), tp = n * 6, te = Math.max(0, 1 - D.time / (tp * 2));
  return Math.round(n * 30 + n * 50 * eff + n * 20 * (D.CF.time ? Math.max(0, remain(D) / D.limit) : te));
}
const scoreOf = D => D.reason === "win" ? D.final : correctOf(D) * 10;
function scramble(D) {
  const n = D.n, R = sub(D.seed, 5); D.g = Array.from({ length: n }, (_, i) => (i < n - 1 ? i + 1 : 0)); D.blank = n - 1; let last = -1;
  const nb = b => { const r = Math.floor(b / D.C), c = b % D.C, o = []; if (r > 0) o.push(b - D.C); if (r < D.R - 1) o.push(b + D.C); if (c > 0) o.push(b - 1); if (c < D.C - 1) o.push(b + 1); return o; };
  for (let k = 0, K = n * 8 + 24; k < K || solvedOf(D); k++) {
    const o = nb(D.blank).filter(x => x !== last), j = o[Math.floor(R() * o.length)]; D.g[D.blank] = D.g[j]; D.g[j] = 0; last = D.blank; D.blank = j;
  }
}
function newGame(seed, mode, t, ch) {
  let r, c; if (mode === "daily") { r = 4; c = 4; } else if (mode === "free") { r = SZ[0]; c = SZ[1]; } else { [r, c] = decSz(seed % 81); }
  seed = seed - seed % 81 + encSz(r, c); if (seed > 4294967295) seed -= 81;
  const D = { seed, mode, t, CF: CFG[t], R: r, C: c, n: r * c, cell: cellOf(r, c), ch: ch || null, moves: 0, hist: [], time: 0, over: false, reason: "end", final: 0, hops: 0, fx: [], shake: 0, flash: 0, beat: false, dur: 1e9 };
  D.limit = D.n * 10; scramble(D);
  D.tiles = {}; for (let i = 0; i < D.n; i++) if (D.g[i]) { const p = posOf(D, i); D.tiles[D.g[i]] = { n: D.g[i], x: p[0], y: p[1], tx: p[0], ty: p[1], sh: 0 }; }
  return D;
}
function retarget(D, quiet) {
  D.g.forEach((v, i) => { if (!v) return; const q = D.tiles[v], p = posOf(D, i); q.tx = p[0]; q.ty = p[1]; if (quiet) { q.x = p[0]; q.y = p[1]; } });
}
function moveIdx(D, idx, quiet) {
  if (D.over || idx < 0 || idx >= D.n || idx === D.blank) return false;
  const br = Math.floor(D.blank / D.C), bc = D.blank % D.C, r = Math.floor(idx / D.C), c = idx % D.C;
  if (r !== br && c !== bc) { if (!quiet && D.g[idx]) { D.tiles[D.g[idx]].sh = .3; sfx.bad(); if (window.NPFx) NPFx.buzz(12); } return false; }
  const st = r === br ? (c > bc ? 1 : -1) : (r > br ? D.C : -D.C); let p = D.blank, len = 0;
  while (p !== idx) { const q = p + st; D.g[p] = D.g[q]; p = q; len++; } D.g[idx] = 0; D.blank = idx; D.moves++; D.hist.push(idx); retarget(D, quiet);
  if (!quiet) { sfx.ok(len); if (window.NPFx) NPFx.buzz(8); }
  if (D.CF.hop && D.moves % D.CF.hop === 0) magnetHop(D, quiet);
  if (solvedOf(D)) winNow(D, quiet);
  return true;
}
/* Loại "Nam châm nhiễu": cứ vài bước ô trống bị nam châm hút nhảy vài ô (đi hợp lệ nên vẫn giải được) */
function magnetHop(D, quiet) {
  const R = sub(D.seed, 900 + D.hops++);
  for (let k = 0; k < 3; k++) {
    const b = D.blank, r = Math.floor(b / D.C), c = b % D.C, o = []; if (r > 0) o.push(b - D.C); if (r < D.R - 1) o.push(b + D.C); if (c > 0) o.push(b - 1); if (c < D.C - 1) o.push(b + 1);
    const j = o[Math.floor(R() * o.length)]; D.g[b] = D.g[j]; D.g[j] = 0; D.blank = j;
  }
  retarget(D, quiet); if (!quiet) { toast(T("hop"), 1100); sfx.up(); }
}
function winNow(D, quiet) {
  if (D.over) return; D.over = true; D.reason = "win"; D.final = finalScore(D); if (quiet) return;
  sfx.end(); NPJuice.confetti($("play"), 24, CONF); setTimeout(() => { if (G === D) finish(D); }, 900);
}
function timeUp(D) { if (D.over) return; D.over = true; D.reason = "time"; D.flash = 1; sfx.bad(); setTimeout(() => { if (G === D) finish(D); }, 900); }
function step(D, dt) {
  if (D.over) { for (const k in D.tiles) { const q = D.tiles[k]; q.x += (q.tx - q.x) * Math.min(1, dt * 16); q.y += (q.ty - q.y) * Math.min(1, dt * 16); } return; }
  D.time += dt; const e = Math.min(1, dt * 16);
  for (const k in D.tiles) { const q = D.tiles[k]; q.x += (q.tx - q.x) * e; q.y += (q.ty - q.y) * e; if (q.sh > 0) q.sh = Math.max(0, q.sh - dt); }
  for (const f of D.fx) f.t -= dt; D.fx = D.fx.filter(f => f.t > 0); D.flash = Math.max(0, D.flash - dt * 2.5);
  if (D.CF.time && remain(D) <= 0) timeUp(D);
  if (Math.floor(D.time * 4) !== D._q) { D._q = Math.floor(D.time * 4); hud(); }
}
function burst(n){if(!isProSk()&&n<12)return;
  const host = $("play"), L = (skinOf().deco || ["⭐", "🔢"]);
  for (let i = 0; i < n; i++) {
    if (host.querySelectorAll(".eb2").length > 30) break;
    const e = document.createElement("i"), a = Math.random() * 6.283, d = 14 + Math.random() * 30; e.className = "eb2"; e.textContent = L[i % L.length];
    e.style.left = "50%"; e.style.top = "46%"; e.style.setProperty("--dx", Math.cos(a) * d + "cqw"); e.style.setProperty("--dy", (Math.sin(a) * d * .8 - 4) + "cqw");
    e.style.setProperty("--rt", (Math.random() * 120 - 60) + "deg"); host.appendChild(e); setTimeout(() => e.remove(), 950);
  }
}
const mmss = s => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
const sizeStr = D => D.R + "×" + D.C;
function HUD(D) { return [[D.moves, "mv"], [D.CF.time ? Math.ceil(remain(D)) + "s" : mmss(D.time), "tm"], [correctOf(D) + "/" + (D.n - 1), "ok"]]; }
function endChips(D) {
  const n = scoreOf(D);
  return ["🧮 " + sizeStr(D), TYPES[D.t][0] + " " + L2([TYPES[D.t][1], TYPES[D.t][2]]), "👣 " + T("steps", { n: D.moves }), "⏱ " + mmss(D.time), (D.prevBest > 0 && n > D.prevBest) ? T("rec") : ""];
}
const shareT = D => sizeStr(D) + " · " + L2([TYPES[D.t][1], TYPES[D.t][2]]);
function snapP(D) { return D.moves ? { g: D.g.join(","), m: D.moves, t: Math.round(D.time * 10) / 10, o: D.hops } : null; }
function restoreP(D, p) {
  const g = String(p.g || "").split(",").map(Number); if (g.length !== D.n || g.slice().sort((a, b) => a - b).some((v, i) => v !== i)) return;
  D.g = g; D.blank = g.indexOf(0); D.moves = Math.min(99999, +p.m || 0); D.time = +p.t || 0; D.hops = +p.o || 0; retarget(D, true); hud();
}
function onBegin(D) { fitCanvas(); }
function onLang(D) { hud(); }
