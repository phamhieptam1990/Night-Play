/* Nối Đôi — vẽ canvas (nền, thẻ, đường nối, gợi ý, hiệu ứng), chạm chọn thẻ, thẻ chia sẻ. */
const ctx = cv.getContext("2d"); let SC = 1;
const EMO = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); }
function bgBasic(c, w, h, tm, dk) {
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, dk ? "#15233a" : "#d6ecff"); g.addColorStop(1, dk ? "#0d1626" : "#f3fbff");
  c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = dk ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.7)";
  for (let i = 0; i < 6; i++) { const x = ((i * 97 + tm * 8) % (w + 80)) - 40, y = 40 + i * 70; c.beginPath(); c.ellipse(x, y, 46, 14, 0, 0, 6.283); c.fill(); }
  c.font = "20px " + EMO; c.globalAlpha = .5;
  ["🦋", "🐝"].forEach((e, i) => c.fillText(e, ((tm * (22 + i * 9) + i * 140) % (w + 40)) - 20, 60 + i * 150 + Math.sin(tm * 2 + i) * 10)); c.globalAlpha = 1;
}
/* một thẻ ô (x,y theo pixel, kích thước tw×th): đáy dày + mặt + hình; hl = viền chọn / gợi ý */
function drawTile(c, sk, x, y, tw, th, ic, hl, s) {
  const e = Math.max(2, th * .09), r = (sk.rad || 9) * (tw / 40) * s;
  c.save(); c.shadowColor = "rgba(0,0,0,.32)"; c.shadowBlur = 4; c.shadowOffsetY = 2; rr(c, x, y + e, tw, th - e, r); c.fillStyle = sk.edge || "#9fb8cf"; c.fill(); c.restore();
  const g = c.createLinearGradient(0, y, 0, y + th - e); g.addColorStop(0, sk.face || "#ffffff"); g.addColorStop(1, sk.face2 || "#e6eef9");
  rr(c, x, y, tw, th - e, r); c.fillStyle = g; c.fill(); c.lineWidth = 1.1; c.strokeStyle = "rgba(255,255,255,.75)"; c.stroke();
  c.textAlign = "center"; c.textBaseline = "middle"; c.font = Math.round(th * .56 * s) + "px " + EMO; c.fillStyle = "#000"; c.fillText((sk.icons || ICONS)[ic], x + tw / 2, y + (th - e) / 2 + 1);
  if (hl) { rr(c, x - 1.5, y - 1.5, tw + 3, th - e + 3, r + 1.5); c.lineWidth = 3; c.strokeStyle = hl; c.stroke(); }
  c.textBaseline = "alphabetic";
}
const cellXY = (D, x, y) => [D.geo.x0 + (x - 1) * D.geo.cw, D.geo.y0 + (y - 1) * D.geo.ch];
function paintLine(c, D) {
  const L = D.line; if (!L) return; const g = D.geo, pts = L.p.map(p => [g.x0 + (p[0] - .5) * g.cw, g.y0 + (p[1] - .5) * g.ch]);
  c.save(); c.globalAlpha = Math.min(1, L.t * 4); c.lineJoin = c.lineCap = "round"; c.strokeStyle = "rgba(255,255,255,.9)"; c.lineWidth = 9; c.beginPath();
  pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.strokeStyle = skinOf().line || "#2fe05a"; c.lineWidth = 5; c.stroke(); c.restore();
}
function paint(c, D, tm, dk, withBg) {
  const sk = skinOf(); if (withBg !== false) { if (sk.bg) sk.bg(c, W, H, tm, dk); else bgBasic(c, W, H, tm, dk); } if (!D) return;
  const g = D.geo, sh = D.shake > 0 ? Math.sin(D.time * 80) * 4 * D.shake : 0, pulse = D.hint ? (Math.sin(D.time * 12) > 0 ? "#ffd24a" : "#ff5a3d") : null;
  c.save(); c.translate(sh, 0); rr(c, g.x0 - 6, g.y0 - 6, g.cw * D.C + 12, g.ch * D.R + 12, 14); c.fillStyle = sk.board || (dk ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.45)"); c.fill();
  for (const t of D.tiles) {
    if (!t.on) continue; const [x, y] = cellXY(D, t.x, t.y), k = t.sh > 0 ? Math.sin(t.sh * 60) * 2 : 0, isSel = D.sel === t.i, isH = D.hint && (D.hint.a === t.i || D.hint.b === t.i);
    drawTile(c, sk, x + 1.2 + k, y + 1.2 + (t.oy || 0) - (isSel ? 3 : 0), g.cw - 2.4, g.ch - 2.4, t.k, isSel ? "#ffd24a" : isH ? pulse : null, 1);
  }
  c.restore(); paintLine(c, D);
  for (const p of D.pops) {
    const a = p.t / POP_T, s = 1 + (1 - a) * .5, [x, y] = cellXY(D, p.x, p.y), w = (g.cw - 2.4) * s, h = (g.ch - 2.4) * s;
    c.save(); c.globalAlpha = a; drawTile(c, sk, x + (g.cw - w) / 2, y + (g.ch - h) / 2, w, h, p.k, null, s); c.restore();
  }
  if (D.flash > 0) { c.fillStyle = "rgba(255,60,60," + D.flash * .26 + ")"; c.fillRect(0, 0, W, H); }
  if (D.C2 && !D.over) {
    const f = Math.max(0, remain(D) / D.limit); c.fillStyle = "rgba(255,255,255,.22)"; c.fillRect(0, H - 6, W, 6);
    c.fillStyle = f < .25 ? "#ff4a3d" : "#ffb23d"; c.fillRect(0, H - 6, W * f, 6);
  }
  if (sk.fx) sk.fx(c, W, H, tm, dk);
}
function draw() { if (!ctx || !cv.width) return; const D = G, c = ctx; c.setTransform(SC, 0, 0, SC, 0, 0); c.clearRect(0, 0, W, H); paint(c, D, D ? D.time : 0, isDark()); }
function fitCanvas() {
  const w = $("cvw"); if (!w) return; const aw = w.clientWidth, ah = w.clientHeight; if (!aw || !ah) return;
  const s = Math.min(aw / W, ah / H), dpr = Math.min(2, devicePixelRatio || 1);
  cv.style.width = Math.floor(W * s) + "px"; cv.style.height = Math.floor(H * s) + "px"; cv.width = Math.floor(W * s * dpr); cv.height = Math.floor(H * s * dpr); SC = cv.width / W; draw();
}
new ResizeObserver(fitCanvas).observe($("cvw"));
function pt(e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
function hitTile(D, p) {
  const g = D.geo, x = Math.floor((p[0] - g.x0) / g.cw) + 1, y = Math.floor((p[1] - g.y0) / g.ch) + 1; if (x < 1 || y < 1 || x > D.C || y > D.R) return null;
  return D.tiles.find(t => t.on && t.x === x && t.y === y) || null;
}
cv.addEventListener("pointerdown", e => {
  const D = G; if (!D || D.over || paused) return; if (e.pointerType === "mouse" && e.button !== 0) return; e.preventDefault();
  const t = hitTile(D, pt(e)); if (!t) return; pickTile(D, t.i); hud();
});
function drawCard(D) {
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const x = c.getContext("2d"), F = "Inter,system-ui,sans-serif", sk = skinOf(), cg = sk.cg || ["#4aa8ff", "#10306b"];
  const g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, cg[0]); g.addColorStop(1, cg[1]); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  x.textAlign = "center"; x.fillStyle = "#fff"; x.font = "800 62px " + F; x.fillText((isProSk() ? "👑 " : "🔗 ") + T("title"), 540, 100);
  const sc = 1.65, bw = W * sc, bh = H * sc, bx = (1080 - bw) / 2; x.save(); x.translate(bx, 140); rr(x, 0, 0, bw, bh, 40); x.clip(); x.scale(sc, sc);
  const keep = D.sel; D.sel = -1; paint(x, D, 3, true, true); D.sel = keep; x.restore();
  x.fillStyle = "#fff"; x.font = "800 48px " + F; x.fillText(T("scL") + " · " + shareT(D), 540, 1000); x.font = "800 170px " + F; x.fillText(scoreOf(D), 540, 1160);
  x.font = "800 54px " + F; x.fillStyle = "#ffd24a"; x.fillText("🏅 " + T("rt")[rankIdx(scoreOf(D))] + (D.prevBest > 0 && scoreOf(D) > D.prevBest ? "  " + T("rec") : ""), 540, 1235);
  x.fillStyle = "#fff"; x.font = "800 46px " + F; x.fillText(T("ask"), 540, 1292); x.font = "800 34px " + F; x.fillStyle = "#dff0ff"; x.fillText(location.host, 540, 1332); return c;
}
