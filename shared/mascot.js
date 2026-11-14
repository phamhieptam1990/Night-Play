/* Linh vật phản ứng (Pop Play + Cozy Play): rê chuột / chạm vào linh vật ở MÀN CHỌN.
   - rê chuột: linh vật nghiêng + dịch về phía con trỏ ("dõi theo"), nhún một cái khi vừa rê vào
   - chạm nhanh: nhún lên (squash & stretch lò xo)
   - nhấn giữ: phình to dần + rung, đủ ~1,2 giây thì "pop" (vỡ ra sao + chính biểu tượng linh vật), rồi hiện lại bằng nảy
   Chỉ dùng thuộc tính rotate / translate / scale riêng (cộng dồn với animation nhún sẵn có của game, không đè), opacity chỉ khi đang tương tác.
   Không rAF khi nghỉ; hạt dùng Web Animations (transform/opacity), ≤ 24 hạt cùng lúc; tôn trọng prefers-reduced-motion.
   Mục tiêu: Cozy = #hHero, #cwHero (phần tử thật); Pop = ::before của #home / #village / #ovStart (không bắt sự kiện được → đo vị trí bằng phần tử dò tạm).
   Thử: NPMascot.locate(x,y) trả về mục tiêu dưới điểm (check-mascot.js). */
(function () {
  "use strict";
  if (window.NPMascot) return;
  var reduce = false; try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  var EL_SEL = "#hHero,#cwHero", PS_SEL = "#home,#village,#ovStart";
  var LP_DELAY = 260, LP_FULL = 1000;   /* nhấn giữ: sau 0,26s bắt đầu phình, +1s thì pop */
  var EMOJI = /\p{Extended_Pictographic}/u;

  var css = document.createElement("style"); css.id = "npMascotCss";
  css.textContent =
    ".npmx-hold{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}" +
    ".npmx-on.npmx-el{rotate:var(--mx-r,0deg);translate:var(--mx-x,0px) var(--mx-y,0px);scale:var(--mx-sx,1) var(--mx-sy,1);opacity:var(--mx-o,1);transform-origin:var(--mx-ox,50%) var(--mx-oy,88%)!important}" +
    ".npmx-on.npmx-ps::before{rotate:var(--mx-r,0deg);translate:var(--mx-x,0px) var(--mx-y,0px);scale:var(--mx-sx,1) var(--mx-sy,1);opacity:var(--mx-o,1);transform-origin:var(--mx-ox,50%) var(--mx-oy,88%)!important}" +
    ".npmx-probe::before{content:none!important}" +
    "html.npmx-hand,html.npmx-hand *{cursor:pointer!important}" +   /* con trỏ BÀN TAY khi rê lên linh vật */
    ".npmx-fx{position:fixed;left:0;top:0;z-index:9999;pointer-events:none;line-height:1;will-change:transform,opacity;font-family:'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif}" +
    ".npmx-ring{position:fixed;left:0;top:0;z-index:9998;pointer-events:none;border-radius:50%;border:4px solid var(--mx-c,#ffb84d);box-sizing:border-box;will-change:transform,opacity}";
  (document.head || document.documentElement).appendChild(css);

  /* ---------- tìm linh vật dưới một điểm ---------- */
  function shown(e) { return !!e && !e.hidden && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== "hidden"; }
  function firstGlyph(t) {
    t = (t || "").replace(/\s/g, ""); if (!t) return "✨";
    try { if (window.Intl && Intl.Segmenter) { var it = new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(t)[Symbol.iterator]().next(); if (it && it.value) return it.value.segment; } } catch (e) {}
    return t.length <= 4 ? t : Array.from(t)[0];
  }
  var PROBE_PROPS = ["display", "position", "order", "flex-grow", "flex-shrink", "flex-basis", "align-self", "justify-self", "align-items", "justify-content",
    "grid-column-start", "grid-column-end", "grid-row-start", "grid-row-end", "width", "height", "min-width", "min-height", "max-width", "max-height",
    "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "top", "left", "right", "bottom", "font-size", "line-height", "font-family", "box-sizing", "white-space"];
  /* ::before không đo được → dựng phần tử dò cùng kiểu, đặt đúng chỗ ::before (tắt ::before trong lúc đo; đồng bộ nên không kịp vẽ) */
  function pseudoBox(h, cs) {
    var p = document.createElement("i"), i, k;
    for (i = 0; i < PROBE_PROPS.length; i++) { k = PROBE_PROPS[i]; p.style.setProperty(k, cs.getPropertyValue(k), "important"); }   /* !important: CSS game có "#home > * {grid-column:2!important}" sẽ xếp phần tử dò sang cột khác ::before */
    p.style.setProperty("visibility", "hidden", "important"); p.style.setProperty("pointer-events", "none", "important"); p.style.setProperty("animation", "none", "important"); p.style.setProperty("transform", "none", "important");
    p.textContent = (cs.content || "").replace(/^["']|["']$/g, "");
    h.classList.add("npmx-probe"); h.insertBefore(p, h.firstChild);
    var r = p.getBoundingClientRect(); h.removeChild(p); h.classList.remove("npmx-probe");
    return r;
  }
  function elInfo(h) {
    var hr = h.getBoundingClientRect(), rg = document.createRange(); rg.selectNodeContents(h);
    var g = rg.getBoundingClientRect(); if (!g.width || !g.height) g = hr;
    return { host: h, kind: "el", emoji: firstGlyph(h.textContent), L: g.left, T: g.top, W: g.width, H: g.height, ox: g.left + g.width / 2 - hr.left, oy: g.bottom - g.height * 0.1 - hr.top, gs: Math.min(g.height, 220) };
  }
  function psInfo(h) {
    if (h.querySelector(EL_SEL)) return null;
    var cs = getComputedStyle(h, "::before"), ct = cs.content; if (!ct || ct === "none" || ct === "normal") return null;
    var txt = ct.replace(/^["']|["']$/g, ""), fs = parseFloat(cs.fontSize) || 0;
    if (!EMOJI.test(txt) || fs < 48 || cs.display === "none") return null;
    var r = pseudoBox(h, cs), hr = h.getBoundingClientRect(); if (!r.width || !r.height) return null;
    var gs = Math.min(fs * 1.2, r.width, r.height), cx = r.left + r.width / 2, ai = cs.alignItems, cy;
    cy = /end/.test(ai) ? r.bottom - gs / 2 : /start/.test(ai) ? r.top + gs / 2 : r.top + r.height / 2;
    return { host: h, kind: "ps", emoji: firstGlyph(txt), L: cx - gs / 2, T: cy - gs / 2, W: gs, H: gs, ox: cx - hr.left, oy: cy + gs * 0.3 - hr.top, gs: gs };
  }
  /* mức phình tối đa: không để linh vật to sẵn (☕🛒) tràn ra khỏi mép màn hình */
  function cap(i) { var cx = i.L + i.W / 2, room = 2 * Math.min(cx, innerWidth - cx) - 8; i.ms = Math.max(1.3, Math.min(1.6, room / Math.max(i.W, 1))); return i; }
  function inside(i, x, y, pad) { return x >= i.L - pad && x <= i.L + i.W + pad && y >= i.T - pad && y <= i.T + i.H + pad; }
  function locate(x, y, t) {
    t = t || document.elementFromPoint(x, y); if (!t || !t.closest) return null;
    if (t.closest("button,a,input,select,textarea,label,[role=button],[role=tab]")) return null;
    var i, e, es = document.querySelectorAll(EL_SEL);
    for (i = 0; i < es.length; i++) { e = es[i]; if (!shown(e) || !(e === t || e.contains(t) || e === t.parentElement)) continue; var ei = cap(elInfo(e)); if (inside(ei, x, y, 10)) return ei; }
    var hs = document.querySelectorAll(PS_SEL);
    for (i = 0; i < hs.length; i++) { e = hs[i]; if (e !== t || !shown(e)) continue; var pi = psInfo(e); if (pi) cap(pi); if (pi && inside(pi, x, y, 8)) return pi; }
    return null;
  }

  /* ---------- lò xo ---------- */
  var K = 320, C = 15;
  var NAMES = ["r", "x", "y", "sx", "sy", "o"], EPS = { r: .05, x: .05, y: .05, sx: .002, sy: .002, o: .002 }, VEPS = { r: .5, x: .5, y: .5, sx: .03, sy: .03, o: .03 };
  var ch, tg;
  function resetCh() { ch = { r: [0, 0], x: [0, 0], y: [0, 0], sx: [1, 0], sy: [1, 0], o: [1, 0] }; tg = { r: 0, x: 0, y: 0, sx: 1, sy: 1, o: 1 }; }
  resetCh();

  var HS = null, lockH = false;   /* HS: phiên RÊ CHUỘT (phình dần như nhấn giữ); lockH: đã pop khi rê thì không phình lại cho tới khi rê ra */
  var A = null;          /* mục tiêu đang gắn class: { info, host } */
  var H = null;          /* đang rê chuột lên */
  var S = null;          /* phiên nhấn */
  var raf = 0, last = 0, popTimer = 0, busyUntil = 0, enterAt = 0;
  var lean = { r: 0, x: 0, y: 0 };

  function hand(on) { try { document.documentElement.classList.toggle("npmx-hand", !!on); } catch (e) {} }
  function attach(info) {
    if (A && A.host === info.host) { A.info = info; setOrigin(info); return; }
    detach();
    A = { info: info, host: info.host }; resetCh();
    info.host.classList.add("npmx-on", info.kind === "el" ? "npmx-el" : "npmx-ps"); setOrigin(info); write();
  }
  function setOrigin(i) { i.host.style.setProperty("--mx-ox", Math.round(i.ox) + "px"); i.host.style.setProperty("--mx-oy", Math.round(i.oy) + "px"); }
  function detach() {
    if (!A) return; var h = A.host; h.classList.remove("npmx-on", "npmx-el", "npmx-ps", "npmx-hold");
    ["--mx-r", "--mx-x", "--mx-y", "--mx-sx", "--mx-sy", "--mx-o", "--mx-ox", "--mx-oy"].forEach(function (k) { h.style.removeProperty(k); });
    A = null; resetCh();
  }
  function write() {
    if (!A) return; var s = A.host.style;
    s.setProperty("--mx-r", ch.r[0].toFixed(2) + "deg"); s.setProperty("--mx-x", ch.x[0].toFixed(2) + "px"); s.setProperty("--mx-y", ch.y[0].toFixed(2) + "px");
    s.setProperty("--mx-sx", ch.sx[0].toFixed(3)); s.setProperty("--mx-sy", ch.sy[0].toFixed(3)); s.setProperty("--mx-o", Math.max(0, Math.min(1, ch.o[0])).toFixed(3));
  }
  function run() { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } }
  function tick(ts) {
    raf = 0; if (!A) return;
    if (!shown(A.host)) { cancelAll(); return; }
    var dt = last ? Math.min((ts - last) / 1000, 1 / 30) : 1 / 60; last = ts;
    var cur = S || HS; if (cur && !cur.popped) hold(ts, cur);
    var settled = true, i, n, c;
    for (i = 0; i < NAMES.length; i++) {
      n = NAMES[i]; c = ch[n];
      c[1] += (-K * (c[0] - tg[n]) - C * c[1]) * dt; c[0] += c[1] * dt;
      if (Math.abs(c[0] - tg[n]) > EPS[n] || Math.abs(c[1]) > VEPS[n]) settled = false;
    }
    write();
    if (settled && !S && !H && !popTimer) { detach(); return; }
    raf = requestAnimationFrame(tick);
  }

  /* ---------- hiệu ứng ---------- */
  function boing(strong) { ch.sx[1] += strong ? 3.4 : 2.2; ch.sy[1] -= strong ? 4.2 : 2.8; ch.y[1] -= strong ? 300 : 120; run(); }
  function aim(x, y, k) {   /* nghiêng + dịch về phía con trỏ */
    var i = (A || S).info, cx = i.L + i.W / 2, cy = i.T + i.H / 2, d = Math.max(i.gs, 60) * 1.6;
    var dx = Math.max(-1, Math.min(1, (x - cx) / d)), dy = Math.max(-1, Math.min(1, (y - cy) / d));
    lean.r = dx * 10 * k; lean.x = dx * 6 * k; lean.y = dy * 4 * k;
  }
  function hold(now, cur) {
    var held = now - cur.t0, p = Math.max(0, Math.min(1, (held - LP_DELAY) / LP_FULL)), e = p * p * (1.6 - 0.6 * p), lk = cur.hover ? 1 : .4;
    if (p <= 0) {
      if (cur.hover) { tg.sx = tg.sy = 1.05; tg.r = lean.r; tg.x = lean.x; tg.y = lean.y; }
      else { tg.sx = 1.07; tg.sy = 0.93; tg.r = lean.r * .4; tg.x = lean.x * .4; tg.y = lean.y * .4; }   /* vừa ấn xuống: hơi bẹp */
      return;
    }
    var s = 1 + ((cur.info.ms || 1.6) - 1) * e, sh = Math.sin(now * 0.075) * p * 3.5;
    tg.sx = s * (1 + 0.025 * Math.sin(now * 0.04)); tg.sy = s * (1 - 0.025 * Math.sin(now * 0.04));
    tg.r = lean.r * lk + Math.sin(now * 0.05) * p * 5; tg.x = lean.x * lk + sh; tg.y = lean.y * lk;
    if (p >= 1) pop(cur);
  }
  function pop(s) {
    if (!s || s.popped) return; s.popped = true; lockH = true;
    var i = s.info, cx = i.L + i.W / 2, cy = i.T + i.H / 2;
    burst(cx, cy, i.gs, i.emoji);
    try { navigator.vibrate && navigator.vibrate(18); } catch (e) {}
    ch.sx = [0.25, 0]; ch.sy = [0.25, 0]; ch.o = [0, 0]; tg.sx = tg.sy = 0.25; tg.o = 0; tg.r = tg.x = tg.y = 0; ch.r = [0, 0]; ch.x = [0, 0]; ch.y = [0, 0];
    busyUntil = performance.now() + 900; run();
    clearTimeout(popTimer);
    popTimer = setTimeout(function () { popTimer = 0; tg.sx = tg.sy = 1; tg.o = 1; ch.sx[1] += 4.5; ch.sy[1] += 4.5; ch.y[1] -= 160; run(); }, 650);
  }
  var live = 0, MAXLIVE = 64;
  function accent() { try { return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#ffb84d"; } catch (e) { return "#ffb84d"; } }
  function mk(cls, parent) { var d = document.createElement("div"); d.className = cls; parent.appendChild(d); return d; }
  /* NỔ: tia chớp → 2 vòng sóng → pháo giấy nhiều màu (xoay, rơi theo trọng lực) + hạt biểu tượng/sao bay xa; tất cả Web Animations (transform/opacity), tự dọn */
  function burst(cx, cy, gs, emoji) {
    if (!Element.prototype.animate) return;
    var col = accent(), D = Math.max(gs, 90), body = document.body, i, easeOut = "cubic-bezier(.12,.7,.25,1)";
    var flash = mk("npmx-ring", body); flash.style.cssText = "width:" + D * 1.2 + "px;height:" + D * 1.2 + "px;left:" + (cx - D * 0.6) + "px;top:" + (cy - D * 0.6) + "px;border:0;background:radial-gradient(circle,#fff 0,#fff 18%," + col + " 48%,transparent 70%)";
    flash.animate([{ transform: "scale(.15)", opacity: 1 }, { transform: "scale(1.35)", opacity: .85, offset: .35 }, { transform: "scale(1.9)", opacity: 0 }], { duration: 420, easing: "ease-out" }).onfinish = function () { flash.remove(); };
    [[0, 4, 2.3, 560], [90, 2.5, 3.1, 720]].forEach(function (r) {
      var ring = mk("npmx-ring", body); ring.style.setProperty("--mx-c", r[0] ? "#fff" : col); ring.style.borderWidth = r[1] + "px"; ring.style.width = ring.style.height = D + "px"; ring.style.left = (cx - D / 2) + "px"; ring.style.top = (cy - D / 2) + "px";
      ring.animate([{ transform: "scale(.25)", opacity: 0 }, { transform: "scale(.4)", opacity: .95, offset: .12 }, { transform: "scale(" + r[2] + ")", opacity: 0 }], { duration: r[3], delay: r[0], easing: easeOut, fill: "backwards" }).onfinish = function () { ring.remove(); };
    });
    var PAL = [col, "#ffffff", "#ffd166", "#ef476f", "#06d6a0", "#4cc9f0", "#c77dff"], N = 22;
    for (i = 0; i < N && live < MAXLIVE; i++) {   /* pháo giấy */
      var a = Math.random() * Math.PI * 2, v = D * (0.55 + Math.random() * 1.15), w = 6 + Math.random() * 7, h = w * (0.45 + Math.random() * 0.9), dur = 800 + Math.random() * 600, c = mk("npmx-fx", body);
      c.style.cssText = "width:" + w + "px;height:" + h + "px;left:" + (cx - w / 2) + "px;top:" + (cy - h / 2) + "px;background:" + PAL[i % PAL.length] + ";border-radius:" + (i % 3 ? "2px" : "50%"); live++;
      var dx = Math.cos(a) * v, dy = Math.sin(a) * v, rot = (Math.random() - 0.5) * 900;
      c.animate([{ transform: "translate(0,0) rotate(0) scale(.3)", opacity: 1 }, { transform: "translate(" + dx * 0.75 + "px," + (dy * 0.75 - D * 0.15) + "px) rotate(" + rot * 0.6 + "deg) scale(1)", opacity: 1, offset: 0.45 },
        { transform: "translate(" + dx + "px," + (dy + D * 0.9) + "px) rotate(" + rot + "deg) scale(.8)", opacity: 0 }], { duration: dur, easing: easeOut }).onfinish = (function (el) { return function () { el.remove(); live--; }; })(c);
    }
    var pics = [emoji, "✨", emoji, "⭐", "💫", emoji, "✨"], M = 12;
    for (i = 0; i < M && live < MAXLIVE; i++) {   /* hạt biểu tượng */
      var a2 = (i / M) * Math.PI * 2 + Math.random() * 0.6, v2 = D * (0.8 + Math.random() * 0.9), sz = 18 + Math.random() * 22, f = mk("npmx-fx", body);
      f.textContent = pics[i % pics.length]; f.style.fontSize = sz + "px"; f.style.left = (cx - sz / 2) + "px"; f.style.top = (cy - sz / 2) + "px"; live++;
      var ex = Math.cos(a2) * v2, ey = Math.sin(a2) * v2, r2 = (Math.random() - 0.5) * 600, d2 = 850 + Math.random() * 450;
      f.animate([{ transform: "translate(0,0) scale(.3) rotate(0)", opacity: 1 }, { transform: "translate(" + ex * 0.7 + "px," + ey * 0.7 + "px) scale(1.25) rotate(" + r2 * 0.6 + "deg)", opacity: 1, offset: 0.5 },
        { transform: "translate(" + ex + "px," + (ey + D * 0.7) + "px) scale(.6) rotate(" + r2 + "deg)", opacity: 0 }], { duration: d2, easing: easeOut }).onfinish = (function (el) { return function () { el.remove(); live--; }; })(f);
    }
  }

  /* ---------- sự kiện ---------- */
  function cancelAll() { hand(false); S = null; H = null; HS = null; lockH = false; clearTimeout(popTimer); popTimer = 0; detach(); }
  function release(boingOnTap) {
    var s = S; S = null; if (!s || s.popped) { run(); return; }
    var held = performance.now() - s.t0;
    tg.sx = tg.sy = 1; tg.r = tg.x = tg.y = 0;
    if (held < LP_DELAY && boingOnTap) boing(true); else { ch.sx[1] += (ch.sx[0] - 1) * -4; ch.sy[1] += (ch.sy[0] - 1) * -4; }   /* nhả giữa chừng: xẹp lại kiểu thạch */
    if (H) { tg.sx = tg.sy = 1.04; }
    run();
  }
  addEventListener("pointerdown", function (e) {
    if (reduce || (e.pointerType === "mouse" && e.button !== 0) || S || performance.now() < busyUntil) return;
    var info = locate(e.clientX, e.clientY, e.target); if (!info) return;
    HS = null; attach(info); info.host.classList.add("npmx-hold");
    S = { info: info, pid: e.pointerId, t0: performance.now(), popped: false, x: e.clientX, y: e.clientY };
    aim(e.clientX, e.clientY, 0.6); run();
  }, true);
  addEventListener("pointermove", function (e) {
    if (reduce) return;
    if (S) {
      if (e.pointerId !== S.pid) return;
      if (!S.popped && !inside(S.info, e.clientX, e.clientY, 70)) { release(false); return; }   /* kéo ra xa thì thôi */
      aim(e.clientX, e.clientY, 0.6); return;
    }
    if (e.pointerType !== "mouse" || e.buttons) return;
    pendingMove = e; if (!moveRaf) moveRaf = requestAnimationFrame(hover);
  }, true);
  var pendingMove = null, moveRaf = 0, probeAt = 0;
  function hover() {
    moveRaf = 0; var e = pendingMove; pendingMove = null; if (!e || S) return;
    var now = performance.now(), info = null;
    if (H && A && now - probeAt < 250) { info = inside(A.info, e.clientX, e.clientY, 8) ? A.info : null; }   /* đang rê trên linh vật: đo lại tối đa 4 lần/giây */
    else { info = locate(e.clientX, e.clientY, e.target); probeAt = now; }
    if (!info) { hand(false); if (H) { H = null; HS = null; lockH = false; lean.r = lean.x = lean.y = 0; if (!popTimer) { tg.r = tg.x = tg.y = 0; tg.sx = tg.sy = 1; } run(); } return; }
    hand(true); var entering = !H; H = info.host; attach(info);
    aim(e.clientX, e.clientY, 1);
    if (!HS && !lockH && now >= busyUntil) HS = { info: info, t0: now, popped: false, hover: true }; else if (HS) HS.info = info;
    if (HS && !HS.popped) { tg.r = lean.r; tg.x = lean.x; tg.y = lean.y; tg.sx = tg.sy = 1.05; }
    if (entering && now - enterAt > 700) { enterAt = now; boing(false); } else run();
  }
  addEventListener("pointerup", function (e) { if (S && e.pointerId === S.pid) release(true); }, true);
  addEventListener("pointercancel", function (e) { if (S && e.pointerId === S.pid) release(false); }, true);
  addEventListener("contextmenu", function (e) { if (S) e.preventDefault(); }, true);
  addEventListener("blur", function () { if (S) release(false); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) { hand(false); if (S) release(false); H = null; HS = null; lockH = false; } });
  document.addEventListener("mouseleave", function () { hand(false); if (H) { H = null; HS = null; lockH = false; if (!popTimer) { tg.r = tg.x = tg.y = 0; tg.sx = tg.sy = 1; } run(); } });

  /* ---------- Pop Play, điện thoại dọc thấp: cỡ linh vật = PHẦN TRỐNG thật còn lại (như landscape.js fitHero của Cozy) ----------
     ::before là ô flex co giãn (flex:1 1 0, không phụ thuộc cỡ chữ → không vòng lặp); đo bằng phần tử dò cùng ô, rồi đặt --np-hs lên host; CSS (poplandscape.css) dùng font-size:var(--np-hs) */
  var mqShort = null, mqTall = null; try { mqShort = matchMedia("(max-aspect-ratio:11/10) and (max-height:719px) and (max-width:520px)"); mqTall = matchMedia("(max-aspect-ratio:11/10) and (min-height:720px) and (max-height:899px) and (max-width:520px)"); } catch (e) {}
  /* chế độ thanh trượt: máy dọc thấp (<=719px) luôn; máy dọc cao (720–899px) chỉ khi có thẻ "Tiếp tục ván dở" (thêm 56px làm danh sách tràn đáy). Đặt html.np-strip cho CSS. */
  function stripOn() { var on = !!(mqShort && mqShort.matches) || !!(mqTall && mqTall.matches && document.getElementById("npResume")); try { document.documentElement.classList.toggle("np-strip", on); } catch (e) {} return on; }
  function slotFit() {
    if (!stripOn()) { var all = document.querySelectorAll(PS_SEL), k; for (k = 0; k < all.length; k++) all[k].style.removeProperty("--np-hs"); return; }
    var hs = document.querySelectorAll(PS_SEL), i, h, cs, p, r, W, H, fs;
    for (i = 0; i < hs.length; i++) {
      h = hs[i]; if (!shown(h)) continue; cs = getComputedStyle(h, "::before"); if (!cs.content || cs.content === "none" || cs.display === "none") continue;
      p = document.createElement("i"); p.style.cssText = "display:flex!important;flex:1 1 0!important;min-height:0!important;height:auto!important;width:100%!important;font-size:0!important;visibility:hidden!important;pointer-events:none!important;margin:0!important;padding:0!important;order:" + (cs.order || 0) + "!important";
      ["grid-column-start", "grid-column-end", "grid-row-start", "grid-row-end", "align-self", "justify-self"].forEach(function (k) { p.style.setProperty(k, cs.getPropertyValue(k), "important"); });   /* nhà dùng lưới (Vẽ Chữ Thành Quái Vật): phần tử dò phải nằm đúng ô lưới của ::before */
      h.classList.add("npmx-probe"); h.insertBefore(p, h.firstChild); r = p.getBoundingClientRect(); W = r.width; H = r.height; h.removeChild(p); h.classList.remove("npmx-probe");
      fs = H < 44 ? 0 : Math.floor(Math.min(H * 0.86, W * 0.7, 220));
      h.style.setProperty("--np-hs", fs + "px");
    }
  }
  var slotRaf = 0; function slotSoon() { if (!slotRaf) slotRaf = requestAnimationFrame(function () { slotRaf = 0; try { slotFit(); } catch (e) {} }); }
  try { if (/\/popplay\//.test(location.pathname)) {
    addEventListener("resize", slotSoon); addEventListener("load", slotSoon); document.addEventListener("DOMContentLoaded", slotSoon);
    new MutationObserver(slotSoon).observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["hidden", "class", "lang"] });
    if (mqShort && mqShort.addEventListener) { mqShort.addEventListener("change", slotSoon); mqTall.addEventListener("change", slotSoon); }
    slotSoon();
  } } catch (e) {}

  /* ---------- thanh ô game (điện thoại dọc thấp): TỰ TRƯỢT ----------
     cứ ~3 giây sang ô kế (CSS scroll-snap lo căn ô), tới cuối thì quay lại đầu. Dừng khi bé chạm/vuốt/lăn/Tab vào thanh (nghỉ 6 giây rồi trượt tiếp), khi tab ẩn, khi game đang chơi (thanh ẩn),
     và khi máy bật giảm chuyển động. Chỉ chạy khi thanh thật sự trượt được (chế độ thanh trượt của poplandscape.css). */
  var autoPause = 0;
  function autoStrip() { return document.querySelector("#home .tiles,#ovStart .cards"); }
  function autoTick() {
    if (reduce || document.hidden || Date.now() < autoPause || !stripOn()) return;
    var el = autoStrip(); if (!el || !shown(el) || el.scrollWidth <= el.clientWidth + 4) return;
    var k = el.children, step = k.length > 1 ? k[1].offsetLeft - k[0].offsetLeft : el.clientWidth * 0.5, max = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft >= max - 2) el.scrollTo({ left: 0, behavior: "smooth" }); else el.scrollTo({ left: Math.min(max, el.scrollLeft + step), behavior: "smooth" });
  }
  try { if (/\/popplay\//.test(location.pathname)) {
    ["pointerdown", "touchstart", "wheel", "keydown", "focusin"].forEach(function (ev) { document.addEventListener(ev, function (e) { var el = autoStrip(); if (el && e.target && el.contains && el.contains(e.target)) autoPause = Date.now() + 6000; }, { capture: true, passive: true }); });
    setInterval(autoTick, 3000);
  } } catch (e) {}

  window.NPMascot = { locate: locate, version: 1 };
})();
