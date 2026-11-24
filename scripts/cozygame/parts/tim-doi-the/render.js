/* Tìm Đôi Thẻ — vẽ canvas (nền, thẻ, chọn, gợi ý, hiệu ứng), chạm chọn thẻ, thẻ chia sẻ. */
const ctx = cv.getContext("2d"); let SC = 1;
const EMO = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); }
function bgBasic(c, w, h, tm, dk) {
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, dk ? "#1a2b2a" : "#d9f5e4"); g.addColorStop(1, dk ? "#0f1c25" : "#f6fff0"); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.fillStyle = dk ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.7)"; for (let i = 0; i < 6; i++) { const x = ((i * 97 + tm * 8) % (w + 80)) - 40, y = 40 + i * 70; c.beginPath(); c.ellipse(x, y, 46, 14, 0, 0, 6.283); c.fill(); }
  c.font = "20px " + EMO; c.globalAlpha = .55; ["🦋", "🐝"].forEach((e, i) => c.fillText(e, ((tm * (22 + i * 9) + i * 140) % (w + 40)) - 20, 60 + i * 150 + Math.sin(tm * 2 + i) * 10)); c.globalAlpha = 1;
}
/* Một thẻ: đáy dày + mặt + hình. dim = bị đè; back = úp; hl = viền chọn/gợi ý */
function drawTile(c, sk, x, y, s, ic, dim, back, hl) {
  const w = TW * s, h = TH * s, e = 5 * s, r = (sk.rad || 11) * s;
  c.save(); c.shadowColor = "rgba(0,0,0,.35)"; c.shadowBlur = 5 * s; c.shadowOffsetY = 2.5 * s; rr(c, x, y + e, w, h - e, r); c.fillStyle = sk.edge || "#bcd3c4"; c.fill(); c.restore();
  const g = c.createLinearGradient(0, y, 0, y + h - e); g.addColorStop(0, back ? (sk.back || "#4aa37a") : (sk.face || "#ffffff")); g.addColorStop(1, back ? (sk.back2 || "#2f7a59") : (sk.face2 || "#ecf5ee"));
  rr(c, x, y, w, h - e, r); c.fillStyle = g; c.fill(); c.lineWidth = 1.2 * s; c.strokeStyle = "rgba(255,255,255,.7)"; c.stroke();
  c.textAlign = "center"; c.textBaseline = "middle";
  if (back) { c.fillStyle = "rgba(255,255,255,.85)"; c.font = "800 " + Math.round(h * .46) + "px Inter,system-ui,sans-serif"; c.fillText("?", x + w / 2, y + (h - e) / 2 + 1); }
  else { c.font = Math.round(h * .5) + "px " + EMO; c.fillStyle = "#000"; c.fillText((sk.icons || ICONS)[ic], x + w / 2, y + (h - e) / 2 + 2 * s); }
  if (dim) { rr(c, x, y, w, h - e, r); c.fillStyle = "rgba(10,24,30,.46)"; c.fill(); }
  if (hl) { rr(c, x - 1.5, y - 1.5, w + 3, h - e + 3, r + 1.5); c.lineWidth = 3.2; c.strokeStyle = hl; c.stroke(); }
  c.textBaseline = "alphabetic";
}
function paint(c, D, tm, dk, withBg) {
  const sk = skinOf(); if (withBg !== false) { if (sk.bg) sk.bg(c, W, H, tm, dk); else bgBasic(c, W, H, tm, dk); } if (!D) return;
  const sh = D.shake > 0 ? Math.sin(D.time * 80) * 4 * D.shake : 0; c.save(); c.translate(sh, 0);
  const pulse = D.hint ? (Math.sin(D.time * 12) > 0 ? "#ffd24a" : "#ffffff") : null;
  for (const t of D.tiles.filter(q => q.on).sort((a, b) => a.l - b.l || a.i - b.i)) {
    const k = t.sh > 0 ? Math.sin(t.sh * 60) * 2.2 : 0, isSel = D.sel === t.i, isH = D.hint && (D.hint.a === t.i || D.hint.b === t.i);
    drawTile(c, sk, t.x - t.l * 2 + k, t.y - t.l * 3 - (isSel ? 4 : 0), 1, t.k, !t.free, D.C.hid && !t.free, isSel ? "#ffd24a" : isH ? pulse : null);
  }
  c.restore();
  for (const p of D.pops) { const a = p.t / POP_T, s = 1 + (1 - a) * .5; c.save(); c.globalAlpha = a; drawTile(c, sk, p.x - (TW * s - TW) / 2, p.y - (TH * s - TH) / 2, s, p.k, false, false, null); c.restore(); }
  for (const f of D.fx) { c.save(); c.globalAlpha = Math.max(0, f.t * 2); c.strokeStyle = f.c; c.lineWidth = 4; c.beginPath(); c.arc(f.x, f.y, (.5 - f.t) * 150 + 10, 0, 6.283); c.stroke(); c.restore(); }
  if (D.flash > 0) { c.fillStyle = "rgba(255,60,60," + D.flash * .26 + ")"; c.fillRect(0, 0, W, H); }
  if (D.C.time && !D.over) { const f = Math.max(0, remain(D) / D.limit); c.fillStyle = "rgba(255,255,255,.22)"; c.fillRect(0, H - 6, W, 6); c.fillStyle = f < .25 ? "#ff4a3d" : "#ffb23d"; c.fillRect(0, H - 6, W * f, 6); }
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
  for (const t of D.tiles.filter(q => q.on).sort((a, b) => b.l - a.l || b.i - a.i)) { const x = t.x - t.l * 2, y = t.y - t.l * 3; if (p[0] >= x && p[0] <= x + TW && p[1] >= y && p[1] <= y + TH - 3) return t; }
  return null;
}
cv.addEventListener("pointerdown", e => {
  const D = G; if (!D || D.over || paused) return; if (e.pointerType === "mouse" && e.button !== 0) return; e.preventDefault();
  const t = hitTile(D, pt(e)); if (!t) return;
  if (t.free) pickTile(D, t.i); else { t.sh = .3; sfx.bad(); if (window.NPFx) NPFx.buzz(15); }
  hud();
});
function drawCard(D) {
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const x = c.getContext("2d"), F = "Inter,system-ui,sans-serif", sk = skinOf(), cg = sk.cg || ["#3fb27f", "#0b3a2b"];
  const g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, cg[0]); g.addColorStop(1, cg[1]); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  x.textAlign = "center"; x.fillStyle = "#fff"; x.font = "800 62px " + F; x.fillText((isProSk() ? "👑 " : "🌸 ") + T("title"), 540, 100);
  const sc = 1.65, bw = W * sc, bh = H * sc, bx = (1080 - bw) / 2; x.save(); x.translate(bx, 140); rr(x, 0, 0, bw, bh, 40); x.clip(); x.scale(sc, sc);
  const keep = D.sel; D.sel = -1; paint(x, D, 3, true, true); D.sel = keep; x.restore();
  x.fillStyle = "#fff"; x.font = "800 48px " + F; x.fillText(T("scL") + " · " + shareT(D), 540, 1000); x.font = "800 170px " + F; x.fillText(scoreOf(D), 540, 1160);
  x.font = "800 54px " + F; x.fillStyle = "#ffd24a"; x.fillText("🏅 " + T("rt")[rankIdx(scoreOf(D))] + (D.prevBest > 0 && scoreOf(D) > D.prevBest ? "  " + T("rec") : ""), 540, 1235);
  x.fillStyle = "#fff"; x.font = "800 46px " + F; x.fillText(T("ask"), 540, 1292); x.font = "800 34px " + F; x.fillStyle = "#dff5e8"; x.fillText(location.host, 540, 1332); return c;
}
