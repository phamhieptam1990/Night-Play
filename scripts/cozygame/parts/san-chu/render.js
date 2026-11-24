/* Săn Chữ Ẩn — vẽ canvas (lưới chữ, khoanh từ, danh sách từ), kéo chọn bằng ngón tay, thẻ chia sẻ. */
const ctx = cv.getContext("2d"); let SC = 1;
const CAP = ["#ff9aa8", "#8fd3ff", "#b8e986", "#ffd36b", "#cdb4ff", "#7be3c8"];
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); }
function bgBasic(c, w, h, tm, dk) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, dk ? "#2b1d12" : "#fbf1e0"); g.addColorStop(1, dk ? "#1a110a" : "#f1e0c4"); c.fillStyle = g; c.fillRect(0, 0, w, h); }
const geo = D => { const cell = MAXG / D.n, x0 = (W - cell * D.n) / 2, y0 = PAD; return { cell, x0, y0 }; };
const ctr = (D, i) => { const g = geo(D); return [g.x0 + (i % D.n + .5) * g.cell, g.y0 + (Math.floor(i / D.n) + .5) * g.cell]; };
function capsule(c, D, cells, col, alpha) {
  if (!cells.length) return; const g = geo(D), a = ctr(D, cells[0]), b = ctr(D, cells[cells.length - 1]); c.save(); c.globalAlpha = alpha; c.lineCap = "round"; c.lineWidth = g.cell * .8; c.strokeStyle = col; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.restore();
}
function paint(c, D, tm, dk, withBg) {
  const sk = skinOf(); if (withBg !== false) { if (sk.bg) sk.bg(c, W, H, tm, dk); else bgBasic(c, W, H, tm, dk); } if (!D) return;
  const g = geo(D), n = D.n, shape = sk.shape || "square", paper = sk.paper || "#f6dcb8", ink = sk.ink || "#5a3410", sh = D.shake > 0 ? Math.sin(D.time * 80) * 3 * D.shake : 0; c.save(); c.translate(sh, 0);
  if (shape === "square") { rr(c, g.x0 - 8, g.y0 - 8, g.cell * n + 16, g.cell * n + 16, 18); c.fillStyle = paper; c.fill(); c.lineWidth = 7; c.strokeStyle = sk.frame || "#a5601f"; c.stroke(); }
  else for (let i = 0; i < n * n; i++) if (D.grid[i]) { rr(c, g.x0 + (i % n) * g.cell + 1, g.y0 + Math.floor(i / n) * g.cell + 1, g.cell - 2, g.cell - 2, g.cell * .22); c.fillStyle = paper; c.fill(); }
  D.words.forEach(w => { if (w.found) capsule(c, D, w.dir, sk.cap ? sk.cap[w.col % sk.cap.length] : CAP[w.col % 6], .75); });
  if (D.hint) { const p = ctr(D, D.hint.w.cells[0]); c.save(); c.globalAlpha = .6 + .4 * Math.sin(D.time * 12); c.fillStyle = "#ffd24a"; c.beginPath(); c.arc(p[0], p[1], g.cell * .5, 0, 6.283); c.fill(); c.restore(); }
  if (D.sel) capsule(c, D, cellsOfSel(D), "#ffd24a", .85);
  c.fillStyle = ink; c.textAlign = "center"; c.textBaseline = "middle"; c.font = "800 " + Math.round(g.cell * .56) + "px Inter,system-ui,sans-serif";
  for (let i = 0; i < n * n; i++) if (D.grid[i]) { const p = ctr(D, i); c.fillText(D.grid[i], p[0], p[1] + g.cell * .03); }
  c.restore(); c.textBaseline = "alphabetic";
  for (const f of D.fx) { const p = ctr(D, f.i); c.save(); c.globalAlpha = Math.max(0, f.t * 1.6); c.strokeStyle = "#ffd24a"; c.lineWidth = 4; c.beginPath(); c.arc(p[0], p[1], (.6 - f.t) * 150 + 8, 0, 6.283); c.stroke(); c.restore(); }
  /* danh sách từ cần tìm */
  const k = D.words.length, cols = k > 8 ? 4 : 3, cw = (W - 2 * PAD) / cols, top = g.y0 + g.cell * n + 31, vi = LANG === "vi";
  c.textAlign = "left"; D.words.forEach((w, i) => {
    const x = PAD + 4 + (i % cols) * cw, y = top + Math.floor(i / cols) * 34, txt = D.CF.hid && !w.found ? w.w[0] + " " + "_ ".repeat(w.w.length - 1).trim() : w.w;
    c.fillStyle = dk ? "#f3e6d0" : "#4a2c10"; c.globalAlpha = w.found ? .45 : 1; c.font = "800 14px Inter,system-ui,sans-serif"; c.fillText(txt, x, y);
    if (vi) { c.font = "600 10.5px Inter,system-ui,sans-serif"; c.globalAlpha = (w.found ? .45 : .75); c.fillText(w.vi, x, y + 13); }
    if (w.found) { c.globalAlpha = .8; c.strokeStyle = sk.cap ? sk.cap[w.col % sk.cap.length] : CAP[w.col % 6]; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 2, y - 5); c.lineTo(x + c.measureText(w.w).width + 2, y - 5); c.stroke(); }
    c.globalAlpha = 1;
  });
  if (D.flash > 0) { c.fillStyle = "rgba(255,60,60," + D.flash * .26 + ")"; c.fillRect(0, 0, W, H); }
  if (D.CF.time && !D.over) { const f = Math.max(0, remain(D) / D.limit); c.fillStyle = "rgba(255,255,255,.22)"; c.fillRect(0, H - 6, W, 6); c.fillStyle = f < .25 ? "#ff4a3d" : "#ffb23d"; c.fillRect(0, H - 6, W * f, 6); }
  if (sk.fx) sk.fx(c, W, H, tm, dk);
}
function draw() { if (!ctx || !cv.width) return; const D = G, c = ctx; c.setTransform(SC, 0, 0, SC, 0, 0); c.clearRect(0, 0, W, H); paint(c, D, D ? D.time : 0, isDark()); }
function fitCanvas() {
  const w = $("cvw"); if (!w) return; const aw = w.clientWidth, ah = w.clientHeight; if (!aw || !ah) return;
  const s = Math.min(aw / W, ah / H), dpr = Math.min(2, devicePixelRatio || 1);
  cv.style.width = Math.floor(W * s) + "px"; cv.style.height = Math.floor(H * s) + "px"; cv.width = Math.floor(W * s * dpr); cv.height = Math.floor(H * s * dpr); SC = cv.width / W; draw();
}
new ResizeObserver(fitCanvas).observe($("cvw"));
const ptr = (D, e) => { const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H, g = geo(D); return [(y - g.y0) / g.cell, (x - g.x0) / g.cell]; };
cv.addEventListener("pointerdown", e => {
  const D = G; if (!D || D.over || paused) return; if (e.pointerType === "mouse" && e.button !== 0) return; e.preventDefault();
  const [pr, pc] = ptr(D, e), r = Math.floor(pr), c = Math.floor(pc); if (r < 0 || c < 0 || r >= D.n || c >= D.n || !D.grid[r * D.n + c]) return;
  D.sel = { a: r * D.n + c, d: [0, 1], len: 0 }; try { cv.setPointerCapture(e.pointerId); } catch (x) {} sfx.ok();
});
cv.addEventListener("pointermove", e => { const D = G; if (!D || !D.sel) return; const [pr, pc] = ptr(D, e), a = aim(D, D.sel.a, pr, pc); D.sel.d = a.d; D.sel.len = a.len; });
const up = () => { const D = G; if (D && D.sel) { endSel(D); hud(); } };
cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", () => { if (G) G.sel = null; });
function drawCard(D) {
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const x = c.getContext("2d"), F = "Inter,system-ui,sans-serif", sk = skinOf(), cg = sk.cg || ["#d8975a", "#4a2810"];
  const g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, cg[0]); g.addColorStop(1, cg[1]); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  x.textAlign = "center"; x.fillStyle = "#fff"; x.font = "800 62px " + F; x.fillText((isProSk() ? "👑 " : "🔤 ") + T("title"), 540, 100);
  const sc = 1.45, bw = W * sc, bh = H * sc; x.save(); x.translate((1080 - bw) / 2, 130); rr(x, 0, 0, bw, bh, 40); x.clip(); x.scale(sc, sc); paint(x, D, 3, false, true); x.restore();
  x.fillStyle = "#fff"; x.font = "800 150px " + F; x.fillText(scoreOf(D), 540, 1140); x.font = "800 48px " + F; x.fillText(T("scL") + " · " + shareT(D), 540, 1000);
  x.font = "800 52px " + F; x.fillStyle = "#ffd24a"; x.fillText("🏅 " + T("rt")[rankIdx(scoreOf(D))] + (D.prevBest > 0 && scoreOf(D) > D.prevBest ? "  " + T("rec") : ""), 540, 1225);
  x.fillStyle = "#fff"; x.font = "800 44px " + F; x.fillText(T("ask"), 540, 1285); x.font = "800 32px " + F; x.fillStyle = "#f6e4cc"; x.fillText(location.host, 540, 1330); return c;
}
