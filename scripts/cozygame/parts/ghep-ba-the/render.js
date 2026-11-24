/* Ghép Ba Thẻ — vẽ canvas (nền, khay, thẻ, hiệu ứng), chạm chọn thẻ, thẻ chia sẻ. */
const ctx = cv.getContext("2d"); let SC = 1;
const EMO = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); }
function bgBasic(c, w, h, tm, dk) {
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, dk ? "#150a30" : "#bda8f2"); g.addColorStop(1, dk ? "#4a2478" : "#f2e6ff"); c.fillStyle = g; c.fillRect(0, 0, w, h);
  const m = c.createRadialGradient(w * .72, h * .2, 4, w * .72, h * .2, w * .5); m.addColorStop(0, dk ? "rgba(255,226,140,.5)" : "rgba(255,240,190,.8)"); m.addColorStop(1, "rgba(255,226,140,0)");
  c.fillStyle = m; c.fillRect(0, 0, w, h); c.fillStyle = dk ? "#ffe9a8" : "#fff3c4"; c.beginPath(); c.arc(w * .72, h * .2, w * .11, 0, 6.283); c.fill();
  c.fillStyle = dk ? "rgba(10,4,24,.55)" : "rgba(60,30,100,.22)"; c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += 20) c.lineTo(x, h - 16 - ((x / 20) % 3) * 6); c.lineTo(w, h); c.fill();
  c.font = "18px " + EMO; c.globalAlpha = .7; c.fillText("🦇", ((tm * 26) % (w + 40)) - 20, 130 + Math.sin(tm * 2) * 8); c.globalAlpha = 1;
}
/* Một thẻ: đáy dày (cạnh) + mặt thẻ + hình; dim = bị đè (tối đi); back = úp mặt */
function drawTile(c, sk, x, y, s, ic, dim, back) {
  const w = TW * s, h = TH * s, e = 5 * s, r = (sk.rad || 11) * s;
  c.save(); c.shadowColor = "rgba(0,0,0,.35)"; c.shadowBlur = 5 * s; c.shadowOffsetY = 2.5 * s; rr(c, x, y + e, w, h - e, r); c.fillStyle = sk.edge || "#c9c0e6"; c.fill(); c.restore();
  const g = c.createLinearGradient(0, y, 0, y + h - e); g.addColorStop(0, back ? (sk.back || "#7a4fc4") : (sk.face || "#ffffff")); g.addColorStop(1, back ? (sk.back2 || "#5a37a0") : (sk.face2 || "#eee9fb"));
  rr(c, x, y, w, h - e, r); c.fillStyle = g; c.fill(); c.lineWidth = 1.2 * s; c.strokeStyle = "rgba(255,255,255,.7)"; c.stroke();
  c.textAlign = "center"; c.textBaseline = "middle";
  if (back) { c.fillStyle = "rgba(255,255,255,.85)"; c.font = "800 " + Math.round(h * .46) + "px Inter,system-ui,sans-serif"; c.fillText("?", x + w / 2, y + (h - e) / 2 + 1); }
  else { c.font = Math.round(h * .5) + "px " + EMO; c.fillStyle = "#000"; c.fillText((sk.icons || ICONS)[ic], x + w / 2, y + (h - e) / 2 + 2 * s); }
  if (dim) { rr(c, x, y, w, h - e, r); c.fillStyle = "rgba(24,12,56,.46)"; c.fill(); }
  c.textBaseline = "alphabetic";
}
function paintTray(c, D, sk, dk) {
  rr(c, 8, TRAY_Y - 6, W - 16, TH + 14, 16); c.fillStyle = sk.tray || (dk ? "rgba(255,255,255,.1)" : "rgba(60,30,110,.14)"); c.fill();
  c.lineWidth = 1.5; c.strokeStyle = sk.trayLine || (dk ? "rgba(255,255,255,.28)" : "rgba(60,30,110,.3)"); c.stroke();
  c.setLineDash([5, 4]); c.strokeStyle = sk.slot || (dk ? "rgba(255,255,255,.55)" : "rgba(60,30,110,.5)");
  for (let i = 0; i < SLOTS; i++) { rr(c, slotX(i), TRAY_Y + 4, 44, TH - 4, 10); c.stroke(); } c.setLineDash([]);
}
function paint(c, D, tm, dk, withBg) {
  const sk = skinOf(); if (withBg !== false) { if (sk.bg) sk.bg(c, W, H, tm, dk); else bgBasic(c, W, H, tm, dk); }
  paintTray(c, D, sk, dk); if (!D) return;
  const sh = D.shake > 0 ? Math.sin(D.time * 80) * 4 * D.shake : 0; c.save(); c.translate(sh, 0);
  const order = D.tiles.filter(t => t.on).sort((a, b) => a.l - b.l || a.i - b.i);
  for (const t of order) {
    const k = t.sh > 0 ? Math.sin(t.sh * 60) * 2.2 : 0;
    drawTile(c, sk, t.x - t.l * 2 + k, t.y - t.l * 3, 1, t.k, !t.free, D.C.hid && !t.free);
  }
  c.restore();
  for (const q of D.tray) drawTile(c, sk, q.x, q.y, 44 / 48, q.k, false, false);
  for (const p of D.pops) { const a = p.t / CL_T, s = (44 / 48) * (1 + (1 - a) * .7); c.save(); c.globalAlpha = a; drawTile(c, sk, p.x - (TW * s - 44) / 2, p.y - (TH * s - 44) / 2 + 4, s, p.k, false, false); c.restore(); }
  for (const f of D.fx) { c.save(); c.globalAlpha = Math.max(0, f.t * 2); c.strokeStyle = f.c; c.lineWidth = 4; c.beginPath(); c.arc(f.x, f.y, (.5 - f.t) * 150 + 10, 0, 6.283); c.stroke(); c.restore(); }
  if (D.flash > 0) { c.fillStyle = "rgba(255,60,60," + D.flash * .26 + ")"; c.fillRect(0, 0, W, H); }
  if (D.C.time && !D.over) { const f = Math.max(0, remain(D) / D.C.time); c.fillStyle = "rgba(255,255,255,.22)"; c.fillRect(0, H - 6, W, 6); c.fillStyle = f < .25 ? "#ff4a3d" : "#ffb23d"; c.fillRect(0, H - 6, W * f, 6); }
  if (sk.fx) sk.fx(c, W, H, tm, dk);
}
function draw() {
  if (!ctx || !cv.width) return; const D = G, c = ctx; c.setTransform(SC, 0, 0, SC, 0, 0); c.clearRect(0, 0, W, H); paint(c, D, D ? D.time : 0, isDark());
}
function fitCanvas() {
  const w = $("cvw"); if (!w) return; const aw = w.clientWidth, ah = w.clientHeight; if (!aw || !ah) return;
  const s = Math.min(aw / W, ah / H), dpr = Math.min(2, devicePixelRatio || 1);
  cv.style.width = Math.floor(W * s) + "px"; cv.style.height = Math.floor(H * s) + "px"; cv.width = Math.floor(W * s * dpr); cv.height = Math.floor(H * s * dpr); SC = cv.width / W; draw();
}
new ResizeObserver(fitCanvas).observe($("cvw"));
function pt(e) { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
function hitTile(D, p) {
  const order = D.tiles.filter(t => t.on).sort((a, b) => b.l - a.l || b.i - a.i);
  for (const t of order) { const x = t.x - t.l * 2, y = t.y - t.l * 3; if (p[0] >= x && p[0] <= x + TW && p[1] >= y && p[1] <= y + TH - 3) return t; }
  return null;
}
cv.addEventListener("pointerdown", e => {
  const D = G; if (!D || D.over || paused) return; if (e.pointerType === "mouse" && e.button !== 0) return; e.preventDefault();
  const t = hitTile(D, pt(e)); if (!t) return;
  if (t.free) pickTile(D, t.i); else { t.sh = .3; sfx.bad(); if (window.NPFx) NPFx.buzz(15); }
  hud();
});
function drawCard(D) {
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const x = c.getContext("2d"), F = "Inter,system-ui,sans-serif", sk = skinOf(), cg = sk.cg || ["#8a4bd6", "#1c0b3d"];
  const g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, cg[0]); g.addColorStop(1, cg[1]); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  x.textAlign = "center"; x.fillStyle = "#fff"; x.font = "800 62px " + F; x.fillText((isProSk() ? "👑 " : "🎃 ") + T("title"), 540, 100);
  const sc = 1.65, bw = W * sc, bh = H * sc, bx = (1080 - bw) / 2, by = 140; x.save(); x.translate(bx, by); x.beginPath(); rr(x, 0, 0, bw, bh, 40); x.clip(); x.scale(sc, sc); paint(x, D, 3, true, true); x.restore();
  x.fillStyle = "#fff"; x.font = "800 48px " + F; x.fillText(T("scL"), 540, 1000 + 0); x.font = "800 170px " + F; x.fillText(scoreOf(D), 540, 1160);
  x.font = "800 54px " + F; x.fillStyle = "#ffd24a"; x.fillText("🏅 " + T("rt")[rankIdx(scoreOf(D))] + (D.prevBest > 0 && scoreOf(D) > D.prevBest ? "  " + T("rec") : ""), 540, 1235);
  x.fillStyle = "#fff"; x.font = "800 46px " + F; x.fillText(T("ask"), 540, 1292); x.font = "800 34px " + F; x.fillStyle = "#e6dcff"; x.fillText(location.host, 540, 1332); return c;
}
