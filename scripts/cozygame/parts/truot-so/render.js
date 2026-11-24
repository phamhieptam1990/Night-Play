/* Trượt Số Nam Châm — vẽ canvas (khung, ô số + chữ đọc số, hiệu ứng), chạm/phím điều khiển, thẻ chia sẻ. */
const ctx = cv.getContext("2d"); let SC = 1;
const PAL = [["#c9b8f5", "#9e86e6"], ["#b9d6f7", "#8fb8ee"], ["#f6bfd0", "#ee95b0"], ["#f7e3a3", "#ecc968"]];
const ENW = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const ENT = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const VIW = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười"];
function wordOf(n) {
  if (LANG === "vi") {
    if (n <= 10) return VIW[n]; if (n < 20) return "mười " + (n === 15 ? "lăm" : VIW[n - 10]); if (n >= 100) return "một trăm";
    const t = Math.floor(n / 10), o = n % 10; return VIW[t] + " mươi" + (o ? " " + (o === 1 ? "mốt" : o === 5 ? "lăm" : o === 4 ? "tư" : VIW[o]) : "");
  }
  if (n < 20) return ENW[n]; if (n >= 100) return "one hundred"; return ENT[Math.floor(n / 10)] + (n % 10 ? "-" + ENW[n % 10] : "");
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h); }
function bgBasic(c, w, h, tm, dk) {
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, dk ? "#1d2a3a" : "#cfeee0"); g.addColorStop(1, dk ? "#142238" : "#f3fbea"); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.fillStyle = dk ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.75)"; for (let i = 0; i < 4; i++) { const x = ((i * 110 + tm * 6) % (w + 120)) - 60; c.beginPath(); c.ellipse(x, 40 + i * 90, 50, 16, 0, 0, 6.283); c.fill(); }
}
/* Một ô: thân gradient + cạnh dày + số lớn + chữ đọc số nhỏ; sk.rad = độ bo (0..0.5) */
function drawTile(c, sk, x, y, s, n, mode) {
  const g = Math.max(2, s * (sk.gap == null ? .05 : sk.gap)), w = s - 2 * g, r = w * (sk.rad == null ? .2 : sk.rad), e = Math.max(2, w * .06), pal = (sk.pal || PAL)[(n * 3 + Math.floor(n / 5)) % (sk.pal || PAL).length];
  c.save(); c.shadowColor = "rgba(0,0,0,.28)"; c.shadowBlur = w * .07; c.shadowOffsetY = e * .8; rr(c, x + g, y + g + e, w, w - e, r); c.fillStyle = sk.edge || pal[1]; c.fill(); c.restore();
  const gr = c.createLinearGradient(0, y + g, 0, y + g + w); gr.addColorStop(0, pal[0]); gr.addColorStop(1, pal[1]); rr(c, x + g, y + g, w, w - e, r); c.fillStyle = gr; c.fill();
  c.lineWidth = Math.max(1, w * .02); c.strokeStyle = sk.rim || "rgba(255,255,255,.65)"; c.stroke();
  c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = sk.ink || "#2b2350"; const hasW = w > 46 && mode !== "hide", cy = y + g + (w - e) / 2;
  c.font = "800 " + Math.round(w * (hasW ? .42 : .46)) + "px Inter,system-ui,sans-serif"; c.fillText(mode === "hide" ? "?" : String(n), x + s / 2, cy - (hasW ? w * .06 : 0));
  if (hasW) { c.font = "700 " + Math.round(w * .13) + "px Inter,system-ui,sans-serif"; c.globalAlpha = .75; c.fillText(wordOf(n), x + s / 2, cy + w * .27); c.globalAlpha = 1; }
  c.textBaseline = "alphabetic";
}
function paint(c, D, tm, dk, withBg) {
  const sk = skinOf(); if (withBg !== false) { if (sk.bg) sk.bg(c, W, H, tm, dk); else bgBasic(c, W, H, tm, dk); } if (!D) return;
  const [bx, by] = posOf(D, 0), bw = D.cell * D.C, bh = D.cell * D.R, fp = 8;
  rr(c, bx - fp, by - fp, bw + 2 * fp, bh + 2 * fp, sk.frameR || 16); c.fillStyle = sk.frame || (dk ? "#e9e6f2" : "#ffffff"); c.fill(); c.lineWidth = 2; c.strokeStyle = sk.frameLine || "rgba(0,0,0,.12)"; c.stroke();
  rr(c, bx - 2, by - 2, bw + 4, bh + 4, 8); c.fillStyle = sk.well || "#d9d6e6"; c.fill();
  const sh = D.shake > 0 ? Math.sin(D.time * 80) * 3 * D.shake : 0; c.save(); c.translate(sh, 0);
  const near = i => { const b = D.blank; return Math.floor(i / D.C) === Math.floor(b / D.C) || i % D.C === b % D.C; };
  const idxOf = {}; D.g.forEach((v, i) => { if (v) idxOf[v] = i; });
  for (const k in D.tiles) {
    const q = D.tiles[k], i = idxOf[k], hide = D.CF.hid && !(near(i) || D.g[i] === i + 1), k2 = q.sh > 0 ? Math.sin(q.sh * 60) * 2 : 0;
    drawTile(c, sk, q.x + k2, q.y, D.cell, +k, hide ? "hide" : "show");
  }
  c.restore();
  for (const f of D.fx) { c.save(); c.globalAlpha = Math.max(0, f.t * 2); c.strokeStyle = f.c; c.lineWidth = 4; c.beginPath(); c.arc(f.x, f.y, (.5 - f.t) * 150 + 10, 0, 6.283); c.stroke(); c.restore(); }
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
function idxAt(D, e) {
  const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H, p = posOf(D, 0), c = Math.floor((x - p[0]) / D.cell), rw = Math.floor((y - p[1]) / D.cell);
  return c < 0 || rw < 0 || c >= D.C || rw >= D.R ? -1 : rw * D.C + c;
}
cv.addEventListener("pointerdown", e => {
  const D = G; if (!D || D.over || paused) return; if (e.pointerType === "mouse" && e.button !== 0) return; e.preventDefault();
  const i = idxAt(D, e); if (i >= 0) { moveIdx(D, i); hud(); }
});
addEventListener("keydown", e => {   /* mũi tên: ô bên kia ô trống trượt vào ô trống */
  const D = G; if (!D || D.over || $("game").hidden || paused) return; const d = { ArrowLeft: [0, 1], ArrowRight: [0, -1], ArrowUp: [1, 0], ArrowDown: [-1, 0] }[e.key]; if (!d) return;
  const b = D.blank, r = Math.floor(b / D.C) + d[0], c = b % D.C + d[1]; if (r < 0 || c < 0 || r >= D.R || c >= D.C) return; e.preventDefault(); moveIdx(D, r * D.C + c); hud();
});
function drawCard(D) {
  const c = document.createElement("canvas"); c.width = 1080; c.height = 1350; const x = c.getContext("2d"), F = "Inter,system-ui,sans-serif", sk = skinOf(), cg = sk.cg || ["#8f7be0", "#2b2160"];
  const g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, cg[0]); g.addColorStop(1, cg[1]); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
  x.textAlign = "center"; x.fillStyle = "#fff"; x.font = "800 62px " + F; x.fillText((isProSk() ? "👑 " : "🧲 ") + T("title"), 540, 100);
  const sc = 1.8, bw = W * sc, bh = H * sc; x.save(); x.translate((1080 - bw) / 2, 140); rr(x, 0, 0, bw, bh, 40); x.clip(); x.scale(sc, sc); paint(x, D, 3, true, true); x.restore();
  x.fillStyle = "#fff"; x.font = "800 48px " + F; x.fillText(T("scL") + " · " + shareT(D), 540, 940); x.font = "800 170px " + F; x.fillText(scoreOf(D), 540, 1100);
  x.font = "800 54px " + F; x.fillStyle = "#ffd24a"; x.fillText("🏅 " + T("rt")[rankIdx(scoreOf(D))] + (D.prevBest > 0 && scoreOf(D) > D.prevBest ? "  " + T("rec") : ""), 540, 1180);
  x.fillStyle = "#fff"; x.font = "800 46px " + F; x.fillText(T("ask"), 540, 1260); x.font = "800 34px " + F; x.fillStyle = "#e6dcff"; x.fillText(location.host, 540, 1320); return c;
}
