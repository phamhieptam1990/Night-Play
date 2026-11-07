"use strict";
/* LỚP "NIGHT PASS" dùng chung cho 7 game mới của Pop Play: chỉ được gửi kèm mã trả phí (/api/pro/<id>.js), nên bản free KHÔNG có.
   Khi đang dùng giao diện trả phí: khung viền cầu vồng phát sáng, vệt sáng quét qua, hình giao diện bồng bềnh khắp màn,
   chạm đâu pháo hình nổ ra đó (hình trong giao diện), huy hiệu 👑. Không đụng logic game; chạy trong trình duyệt (new Function). */
function layer(PF) {
  if (PF.__prem) return; PF.__prem = 1;
  const play = document.getElementById("play"); if (!play) return;
  const cur = () => { try { let t = 0; if (typeof G !== "undefined" && G && typeof G.t === "number") t = G.t; else { const i = PF.skinSel.findIndex((id, k) => id !== "basic" && PF.skins[k][id]); if (i >= 0) t = i } const id = PF.skinSel[t], sk = PF.skins[t] && PF.skins[t][id]; return id !== "basic" && sk ? sk : null } catch (e) { return null } };
  const st = document.createElement("style");
  st.textContent = "#pxfx{position:absolute;inset:0;pointer-events:none;z-index:3;overflow:hidden;border-radius:inherit}#pxfx canvas{position:absolute;inset:0;width:100%;height:100%}" +
    ".play.prem{box-shadow:0 0 0 .6cqw transparent,0 0 5cqw rgba(255,210,90,.35)}.play.prem::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:4;padding:.9cqw;" +
    "background:conic-gradient(from var(--pa,0deg),#ff5ea8,#ffd24a,#5be3a8,#4ab8ff,#b07bff,#ff5ea8);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:pxspin 6s linear infinite;opacity:.9}" +
    "@property --pa{syntax:'<angle>';inherits:false;initial-value:0deg}@keyframes pxspin{to{--pa:360deg}}" +
    "#pxcr{position:absolute;right:2.2cqw;bottom:1.6cqw;font-size:5.2cqw;z-index:5;pointer-events:none;filter:drop-shadow(0 .3cqw .6cqw rgba(0,0,0,.5));animation:pxbob 2.4s ease-in-out infinite}@keyframes pxbob{50%{transform:translateY(-.8cqw) rotate(6deg)}}" +
    ".prem #pxfx i.sw{position:absolute;top:-20%;left:-40%;width:26%;height:140%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent);transform:skewX(-18deg);animation:pxsw 7s ease-in-out infinite}@keyframes pxsw{0%,70%{left:-40%}100%{left:130%}}" +
    "@media (prefers-reduced-motion:reduce){.play.prem::after,#pxcr,.prem #pxfx i.sw{animation:none}}";
  document.head.appendChild(st);
  const box = document.createElement("div"); box.id = "pxfx"; box.hidden = true;
  const cv = document.createElement("canvas"), sw = document.createElement("i"); sw.className = "sw"; box.append(cv, sw);
  const cr = document.createElement("div"); cr.id = "pxcr"; cr.textContent = "👑"; cr.hidden = true;
  play.append(box, cr);
  const cx = cv.getContext("2d"); let W = 0, H = 0, dpr = 1; const P = [], FL = [];
  const rz = () => { dpr = Math.min(2, devicePixelRatio || 1); W = play.clientWidth; H = play.clientHeight; cv.width = W * dpr; cv.height = H * dpr };
  new ResizeObserver(rz).observe(play); rz();
  const em = e => "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
  let last = performance.now(), on = false, spawnT = 0;
  const burst = (x, y, L) => { const n = 9; for (let i = 0; i < n; i++) { const a = Math.PI * 2 * i / n + Math.random() * .4, v = 90 + Math.random() * 110; FL.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, t: 0, life: .7 + Math.random() * .3, e: i % 3 === 0 ? "✦" : L[i % L.length], s: 16 + Math.random() * 12, r: Math.random() * 6 }) } };
  play.addEventListener("pointerdown", ev => { if (!on) return; const sk = cur(), r = play.getBoundingClientRect(); burst((ev.clientX - r.left) * (W / r.width), (ev.clientY - r.top) * (H / r.height), (sk && sk.deco) || ["✨"]) }, true);
  const tick = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now; const sk = cur(), v = !!sk && !document.hidden;
    if (v !== on) { on = v; play.classList.toggle("prem", on); box.hidden = cr.hidden = !on; if (!on) { P.length = FL.length = 0 } }
    if (on) {
      const L = sk.deco && sk.deco.length ? sk.deco : ["✨"]; spawnT -= dt;
      if (spawnT <= 0 && P.length < 9) { spawnT = .55 + Math.random() * .5; P.push({ x: Math.random() * W, y: H + 20, vy: 22 + Math.random() * 30, sw: Math.random() * 6, ph: Math.random() * 6, e: L[Math.floor(Math.random() * L.length)], s: 20 + Math.random() * 20, t: 0 }) }
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H); cx.textAlign = "center"; cx.textBaseline = "middle";
      for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.t += dt; p.y -= p.vy * dt; if (p.y < -30) { P.splice(i, 1); continue } const x = p.x + Math.sin(p.t * 1.6 + p.ph) * 14 * (p.sw / 6 + .5); cx.globalAlpha = .55 * Math.min(1, p.t * 2) * Math.min(1, p.y / 80 + .2); cx.shadowColor = "rgba(255,230,140,.9)"; cx.shadowBlur = 12; cx.font = p.s + "px " + em(); cx.fillText(p.e, x, p.y) }
      for (let i = FL.length - 1; i >= 0; i--) { const f = FL[i]; f.t += dt; if (f.t > f.life) { FL.splice(i, 1); continue } f.vy += 260 * dt; f.x += f.vx * dt; f.y += f.vy * dt; cx.globalAlpha = 1 - f.t / f.life; cx.shadowBlur = 10; cx.shadowColor = "#ffe27a"; cx.font = f.s + "px " + em(); cx.save(); cx.translate(f.x, f.y); cx.rotate(f.r * f.t); cx.fillStyle = "#fff6b0"; cx.fillText(f.e, 0, 0); cx.restore() }
      cx.globalAlpha = 1; cx.shadowBlur = 0
    }
    requestAnimationFrame(tick)
  };
  requestAnimationFrame(tick);
}
exports.code = "(" + layer.toString() + ")(PF);";
