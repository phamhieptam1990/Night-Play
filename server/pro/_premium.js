"use strict";
/* LỚP "NIGHT PASS" dùng chung cho 7 game mới của Pop Play: chỉ được gửi kèm mã trả phí (/api/pro/<id>.js), nên bản free KHÔNG có.
   Khi đang dùng giao diện trả phí: khung viền cầu vồng phát sáng, vệt sáng quét qua, hình giao diện bồng bềnh khắp màn,
   chạm đâu pháo hình nổ ra đó (hình trong giao diện), huy hiệu 👑. Không đụng logic game; chạy trong trình duyệt (new Function). */
function layer(PF) {
  if (PF.__prem) return; PF.__prem = 1;
  const play = document.getElementById("play"); if (!play) return;
  const ovh = document.getElementById("ovHow");
  const cur = () => { try { if (typeof PF.skinSel === "string") { const sk1 = PF.skins[PF.skinSel]; return PF.skinSel !== "basic" && sk1 ? sk1 : null } let t = 0; if (window.__howT != null && ovh && !ovh.hidden) t = window.__howT; else if (typeof G !== "undefined" && G && typeof G.t === "number") t = G.t; else { const i = PF.skinSel.findIndex((id, k) => id !== "basic" && PF.skins[k][id]); if (i >= 0) t = i } const id = PF.skinSel[t], sk = PF.skins[t] && PF.skins[t][id]; return id !== "basic" && sk ? sk : null } catch (e) { return null } };
  const st = document.createElement("style");
  st.textContent = "#pxfx{position:absolute;inset:0;pointer-events:none;z-index:3;overflow:hidden;border-radius:inherit}#pxfx canvas{position:absolute;inset:0;width:100%;height:100%}" +
    ".play.prem{box-shadow:0 0 0 .6cqw transparent,0 0 5cqw rgba(255,210,90,.35)}.play.prem::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:4;padding:.9cqw;" +
    "background:conic-gradient(from var(--pa,0deg),#ff5ea8,#ffd24a,#5be3a8,#4ab8ff,#b07bff,#ff5ea8);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:pxspin 6s linear infinite;opacity:.9}" +
    "@property --pa{syntax:'<angle>';inherits:false;initial-value:0deg}@keyframes pxspin{to{--pa:360deg}}" +
    "#pxcr{position:absolute;right:2.2cqw;bottom:1.6cqw;font-size:5.2cqw;z-index:5;pointer-events:none;filter:drop-shadow(0 .3cqw .6cqw rgba(0,0,0,.5));animation:pxbob 2.4s ease-in-out infinite}@keyframes pxbob{50%{transform:translateY(-.8cqw) rotate(6deg)}}" +
    ".prem #pxfx i.sw{position:absolute;top:-20%;left:-40%;width:26%;height:140%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.09),transparent);transform:skewX(-18deg);animation:pxsw 7s ease-in-out infinite}@keyframes pxsw{0%,70%{left:-40%}100%{left:130%}}" +
    "#pxrb{position:absolute;top:.9cqw;left:50%;transform:translateX(-50%);z-index:6;pointer-events:none;font:800 2.7cqw/1 system-ui,sans-serif;letter-spacing:.3cqw;color:#4a2a00;background:linear-gradient(90deg,#ffd24a,#fff3b0,#ffd24a);padding:.8cqw 3cqw;border-radius:99cqw;box-shadow:0 0 3cqw rgba(255,210,90,.8),0 .5cqw 0 #b97400;white-space:nowrap}" +
    "#pxem{position:absolute;left:3cqw;right:3cqw;top:.2cqw;display:flex;justify-content:space-between;font-size:6cqw;pointer-events:none;z-index:6}#pxem i{font-style:normal;filter:drop-shadow(0 0 2cqw rgba(255,220,120,.9));animation:pxbob 2.6s ease-in-out infinite}#pxem i:nth-child(2){animation-delay:-.9s}#pxem i:nth-child(3){animation-delay:-1.7s}" +
    ".prem #ovHow{padding-top:5cqw!important;box-sizing:border-box;background:radial-gradient(120% 70% at 50% 0%,rgba(255,200,80,.32),rgba(18,8,48,.9) 62%),rgba(12,8,36,.92)!important}.prem #ovHow h2{text-shadow:0 0 2.4cqw rgba(255,214,90,.85),0 0 6cqw rgba(255,150,220,.55)!important}" +
    ".prem #ovHow ul,.prem #ovHow .hwL,.prem #ovHow .hw{border:.45cqw solid rgba(255,215,100,.75)!important;box-shadow:0 0 5cqw rgba(255,200,80,.3),inset 0 0 4cqw rgba(255,255,255,.07)!important}.prem #ovHow .chip{border:.3cqw solid rgba(255,215,100,.6)}" +
    ".prem #ovHow .go,.prem #ovHow #hwGo,.prem #ovHow button[id$=Go]{background:linear-gradient(180deg,#ffe27a,#ffb020)!important;color:#4a2a00!important;box-shadow:0 .8cqw 0 #b97400,0 0 4cqw rgba(255,200,80,.7)!important;position:relative;overflow:hidden}.prem #ovHow .go::after,.prem #ovHow #hwGo::after,.prem #ovHow button[id$=Go]::after{content:'';position:absolute;top:0;bottom:0;left:-60%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.7),transparent);transform:skewX(-20deg);animation:pxsw2 2.6s ease-in-out infinite}@keyframes pxsw2{0%,55%{left:-60%}100%{left:140%}}" +
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
  /* ăn mừng: game gọi NPFx.buzz khi đúng/combo/thắng ⇒ bung pháo hình giữa màn (chỉ Night Pass) */
  try { const ob = window.NPFx && NPFx.buzz; if (ob && !ob.__p) { let lt = 0; const nb = function (a) { try { const n = performance.now(); if (on && n - lt > 350 && (Array.isArray(a) || a >= 25)) { lt = n; const sk = cur(), L = (sk && sk.deco) || ["✨"]; burst(W * (.3 + Math.random() * .4), H * (.3 + Math.random() * .25), L); burst(W * (.3 + Math.random() * .4), H * (.3 + Math.random() * .25), ["⭐", "✦", "🎉"]) } } catch (e) {} return ob.apply(this, arguments) }; nb.__p = 1; NPFx.buzz = nb } } catch (e) {}
  /* màn hướng dẫn: ruy-băng Night Pass + hình giao diện nhảy nhót (CSS ở trên chỉnh khung/nút/chữ) */
  if (ovh) {
    const rb = document.createElement("div"); rb.id = "pxrb"; rb.textContent = "👑 NIGHT PASS"; const em2 = document.createElement("div"); em2.id = "pxem"; rb.hidden = em2.hidden = true; ovh.append(rb, em2);
    let sync = () => { const sk = ovh.hidden ? null : cur(); rb.hidden = em2.hidden = !sk; if (sk) { const L = sk.deco && sk.deco.length ? sk.deco : ["✨"]; em2.innerHTML = ""; for (let i = 0; i < 2; i++) { const e = document.createElement("i"); e.textContent = L[i % L.length]; em2.appendChild(e) } } };
    const fit2 = () => { rb.style.visibility = "visible"; const h = ovh.querySelector("h2"); if (h && !rb.hidden && h.getBoundingClientRect().top < rb.getBoundingClientRect().bottom + 1) rb.style.visibility = "hidden" };
    const sync0 = sync; sync = () => { sync0(); requestAnimationFrame(fit2); setTimeout(fit2, 120) };
    new MutationObserver(sync).observe(ovh, { attributes: true, attributeFilter: ["hidden"] }); setTimeout(sync, 0);
    const oh = window.openHow; if (typeof oh === "function" && !oh.__p) { const nh = function (t) { window.__howT = t; const r = oh.apply(this, arguments); sync(); return r }; nh.__p = 1; window.openHow = nh }
  }
  const tick = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now; const sk = cur(), v = !!sk && !document.hidden;
    if (v !== on) { on = v; play.classList.toggle("prem", on); box.hidden = cr.hidden = !on; if (!on) { P.length = FL.length = 0 } }
    if (on) {
      const L = sk.deco && sk.deco.length ? sk.deco : ["✨"]; spawnT -= dt;
      if (spawnT <= 0 && P.length < 9) { spawnT = .55 + Math.random() * .5; P.push({ x: Math.random() < .5 ? W * (.02 + Math.random() * .07) : W * (.91 + Math.random() * .07), y: H + 20, vy: 22 + Math.random() * 30, sw: Math.random() * 6, ph: Math.random() * 6, e: L[Math.floor(Math.random() * L.length)], s: 16 + Math.random() * 10, t: 0 }) }
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H); cx.textAlign = "center"; cx.textBaseline = "middle";
      for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.t += dt; p.y -= p.vy * dt; if (p.y < -30) { P.splice(i, 1); continue } const x = p.x + Math.sin(p.t * 1.6 + p.ph) * 5 * (p.sw / 6 + .5); cx.globalAlpha = .4 * Math.min(1, p.t * 2) * Math.min(1, p.y / 80 + .2); cx.shadowColor = "rgba(255,230,140,.9)"; cx.shadowBlur = 12; cx.font = p.s + "px " + em(); cx.fillText(p.e, x, p.y) }
      for (let i = FL.length - 1; i >= 0; i--) { const f = FL[i]; f.t += dt; if (f.t > f.life) { FL.splice(i, 1); continue } f.vy += 260 * dt; f.x += f.vx * dt; f.y += f.vy * dt; cx.globalAlpha = 1 - f.t / f.life; cx.shadowBlur = 10; cx.shadowColor = "#ffe27a"; cx.font = f.s + "px " + em(); cx.save(); cx.translate(f.x, f.y); cx.rotate(f.r * f.t); cx.fillStyle = "#fff6b0"; cx.fillText(f.e, 0, 0); cx.restore() }
      cx.globalAlpha = 1; cx.shadowBlur = 0
    }
    requestAnimationFrame(tick)
  };
  requestAnimationFrame(tick);
}
exports.code = "(" + layer.toString() + ")(PF);";
