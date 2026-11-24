/* Sudoku — vẽ bàn cờ (ô, ghi chú, đỏ khi sai, tô cùng hàng/cột/hộp/số), chạm chọn ô, phím số, thẻ chia sẻ. */
const ctx = cv.getContext("2d"); let SC = 1;
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); }
function bgBasic(c, w, h, tm, dk) { c.fillStyle = dk ? "#1d2433" : "#eef3fb"; c.fillRect(0, 0, w, h); }
const geo = D => { const S = Math.min(W, H) - 2 * PAD; return { S, cell: S / D.N, x0: (W - S) / 2, y0: (H - S) / 2 }; };
function paint(c, D, tm, dk, withBg) {
  const sk = skinOf(); if (withBg !== false) { if (sk.bg) sk.bg(c, W, H, tm, dk); else bgBasic(c, W, H, tm, dk); } if (!D) return;
  const g = geo(D), N = D.N, T = D.T, gap = sk.gap || 0, rad = sk.rad || 0, paper = sk.paper || (dk ? "#2a3350" : "#ffffff"), line = sk.line || (dk ? "#5b6a9a" : "#9aa8c8"), thick = sk.thick || (dk ? "#cfd8ff" : "#2b3a67");
  const sel = D.sel, sr = sel < 0 ? -1 : Math.floor(sel / N), sc2 = sel < 0 ? -1 : sel % N, sv = sel >= 0 ? D.val[sel] : 0, sh = D.shake > 0 ? Math.sin(D.time * 80) * 3 * D.shake : 0;
  c.save(); c.translate(sh, 0); rr(c, g.x0 - 4, g.y0 - 4, g.S + 8, g.S + 8, sk.frameR == null ? 8 : sk.frameR); c.fillStyle = sk.frame || paper; c.fill();
  const rel = new Set(sel >= 0 ? D.P[sel] : []);
  for (let i = 0; i < N * N; i++) {
    const r = Math.floor(i / N), cc = i % N, x = g.x0 + cc * g.cell, y = g.y0 + r * g.cell, v = D.val[i], bad = v && v !== D.sol[i];
    let fill = paper; if (T.diag && (r === cc || r + cc === N - 1)) fill = sk.diag || (dk ? "#35406a" : "#e7edff"); if (rel.has(i)) fill = sk.rel || (dk ? "#3a4875" : "#e1eaff"); if (sv && v === sv) fill = sk.same || (dk ? "#4f5f9e" : "#c9d8ff"); if (i === sel) fill = sk.sel || (dk ? "#6a7cd0" : "#a9c0ff"); if (bad) fill = sk.bad || (dk ? "#6a2a35" : "#ffd6d6");
    rr(c, x + gap, y + gap, g.cell - 2 * gap, g.cell - 2 * gap, rad); c.fillStyle = fill; c.fill();
  }
  if (!gap) {
    c.strokeStyle = line; c.lineWidth = 1; for (let k = 1; k < N; k++) { c.beginPath(); c.moveTo(g.x0 + k * g.cell, g.y0); c.lineTo(g.x0 + k * g.cell, g.y0 + g.S); c.moveTo(g.x0, g.y0 + k * g.cell); c.lineTo(g.x0 + g.S, g.y0 + k * g.cell); c.stroke(); }
  }
  c.strokeStyle = thick; c.lineWidth = gap ? 2 : 2.6; for (let k = 0; k <= N; k += T.bc) { c.beginPath(); c.moveTo(g.x0 + k * g.cell, g.y0); c.lineTo(g.x0 + k * g.cell, g.y0 + g.S); c.stroke(); }
  for (let k = 0; k <= N; k += T.br) { c.beginPath(); c.moveTo(g.x0, g.y0 + k * g.cell); c.lineTo(g.x0 + g.S, g.y0 + k * g.cell); c.stroke(); }
  c.textAlign = "center"; c.textBaseline = "middle";
  for (let i = 0; i < N * N; i++) {
    const r = Math.floor(i / N), cc = i % N, x = g.x0 + (cc + .5) * g.cell, y = g.y0 + (r + .5) * g.cell, v = D.val[i];
    if (v) { const given = D.puz[i]; c.font = (given ? "800 " : "700 ") + Math.round(g.cell * .6) + "px Inter,system-ui,sans-serif"; c.fillStyle = v !== D.sol[i] ? (sk.badInk || "#d23b3b") : given ? (sk.given || (dk ? "#f1f4ff" : "#1b2750")) : (D.hintSet && D.hintSet[i] ? "#e08a00" : (sk.user || (dk ? "#8fb2ff" : "#2f63e0"))); c.fillText(String(v), x, y + g.cell * .04); }
    else if (D.notes[i]) { c.font = "700 " + Math.round(g.cell * .24) + "px Inter,system-ui,sans-serif"; c.fillStyle = sk.noteInk || (dk ? "#a9b6e6" : "#6a7aa8"); const cols = N === 6 ? 3 : 3;
      for (let d = 1; d <= N; d++) if (D.notes[i] & (1 << d)) { const k = d - 1; c.fillText(String(d), g.x0 + cc * g.cell + g.cell * (.2 + .3 * (k % cols)), g.y0 + r * g.cell + g.cell * (.22 + .28 * Math.floor(k / cols))); } }
  }
  c.restore(); c.textBaseline = "alphabetic";
  for (const f of D.fx) { const x = g.x0 + (f.i % N + .5) * g.cell, y = g.y0 + (Math.floor(f.i / N) + .5) * g.cell; c.save(); c.globalAlpha = Math.max(0, f.t * 2); c.strokeStyle = "#ffd24a"; c.lineWidth = 3.5; c.beginPath(); c.arc(x, y, (.5 - f.t) * 90 + 6, 0, 6.283); c.stroke(); c.restore(); }
  if (D.flash > 0) { c.fillStyle = "rgba(255,60,60," + D.flash * .26 + ")"; c.fillRect(0, 0, W, H); }
  if (sk.fx) sk.fx(c, W, H, tm, dk);
}
function draw() { if (!ctx || !cv.width) return; const D = G, c = ctx; c.setTransform(SC, 0, 0, SC, 0, 0); c.clearRect(0, 0, W, H); paint(c, D, D ? D.time : 0, isDark()); }
function fitCanvas() {
  const w = $("cvw"); if (!w) return; const aw = w.clientWidth, ah = w.clientHeight; if (!aw || !ah) return;
  const s = Math.min(aw / W, ah / H), dpr = Math.min(2, devicePixelRatio || 1);
  cv.style.width = Math.floor(W * s) + "px"; cv.style.height = Math.floor(H * s) + "px"; cv.width = Math.floor(W * s * dpr); cv.height = Math.floor(H * s * dpr); SC = cv.width / W; draw();
}
new ResizeObserver(fitCanvas).observe($("cvw"));
cv.addEventListener("pointerdown", e => {
  const D = G; if (!D || D.over || paused) return; if (e.pointerType === "mouse" && e.button !== 0) return; e.preventDefault();
  const r = cv.getBoundingClientRect(), g = geo(D), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H, c = Math.floor((x - g.x0) / g.cell), rw = Math.floor((y - g.y0) / g.cell);
  if (c < 0 || rw < 0 || c >= D.N || rw >= D.N) return; D.sel = rw * D.N + c; sfx.ok(); hud();
});
addEventListener("keydown", e => {
  const D = G; if (!D || D.over || $("game").hidden || paused) return; const k = e.key;
  if (/^[1-9]$/.test(k) && +k <= D.N) { setVal(D, D.sel, +k); hud(); }
  else if (k === "Backspace" || k === "Delete" || k === "0") { if (D.sel >= 0 && !D.puz[D.sel] && !(D.hintSet && D.hintSet[D.sel])) { D.val[D.sel] = 0; D.notes[D.sel] = 0; hud(); } }
  else if (k.startsWith("Arrow") && D.sel >= 0) { e.preventDefault(); const N = D.N, r = Math.floor(D.sel / N), c = D.sel % N, d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k]; D.sel = Math.max(0, Math.min(N - 1, r + d[0])) * N + Math.max(0, Math.min(N - 1, c + d[1])); }
  else if (k === "n" || k === "N") { D.notesOn = !D.notesOn; hud(); }
});
function drawCard(D) {
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const x = c.getContext("2d"), F = "Inter,system-ui,sans-serif", sk = skinOf(), cg = sk.cg || ["#6a8cff", "#1b2750"];
  const g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, cg[0]); g.addColorStop(1, cg[1]); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  x.textAlign = "center"; x.fillStyle = "#fff"; x.font = "800 62px " + F; x.fillText((isProSk() ? "👑 " : "🔢 ") + T("title"), 540, 100);
  const sc = 2.4, bw = W * sc, bh = H * sc; x.save(); x.translate((1080 - bw) / 2, 140); rr(x, 0, 0, bw, bh, 40); x.clip(); x.scale(sc, sc); const k = D.sel; D.sel = -1; paint(x, D, 3, false, true); D.sel = k; x.restore();
  x.fillStyle = "#fff"; x.font = "800 46px " + F; x.fillText(T("scL") + " · " + shareT(D), 540, 1050); x.font = "800 150px " + F; x.fillText(scoreOf(D), 540, 1190);
  x.font = "800 50px " + F; x.fillStyle = "#ffd24a"; x.fillText("🏅 " + T("rt")[rankIdx(scoreOf(D))] + (D.prevBest > 0 && scoreOf(D) > D.prevBest ? "  " + T("rec") : ""), 540, 1255);
  x.fillStyle = "#fff"; x.font = "800 42px " + F; x.fillText(T("ask"), 540, 1305); x.font = "800 30px " + F; x.fillStyle = "#dfe6ff"; x.fillText(location.host, 540, 1340); return c;
}
