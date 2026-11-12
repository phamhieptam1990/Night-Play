/* DÙNG CHUNG landing + hub /play/ (shared/orbit.js + shared/orbit.css). Hệ quỹ đạo: hai quỹ đạo (Pop cam, Night tím) xoay ngược chiều; kéo để xoay (quán tính), rê/focus để dừng + sáng thẻ; âm thanh Web Audio tổng hợp, MẶC ĐỊNH TẮT. Không lưu gì (không localStorage/cookie). Chỉ transform/opacity trên 12 vệ tinh. */
(function () {
  var d = document, sys = d.getElementById("orbsys"); if (!sys) return;
  var stage = sys.querySelector(".orbstage"), cards = { pop: sys.querySelector(".world.pop"), night: sys.querySelector(".world.night") };
  var TAU = Math.PI * 2, MARK = TAU / 12;
  var GEO = { pop: { a: 165, b: 92, t: -18, dir: 1, auto: 0.34 }, night: { a: 262, b: 140, t: 18, dir: -1, auto: 0.21 } };
  var O = {};
  ["pop", "night"].forEach(function (w) {
    var g = GEO[w], sats = [].slice.call(stage.querySelectorAll(".sat." + w));
    O[w] = { g: g, sats: sats, phi: 0, vel: 0, pend: 0, kv: 0, drag: false, hover: 0, focus: 0, mark: 0, th: g.t * Math.PI / 180 };
    O[w].base = sats.map(function (s) { return parseFloat(s.getAttribute("data-a")) * Math.PI / 180; });
  });
  /* ===== nâng cấp 3D: ảnh game thật trong bong bóng kính, chiều sâu (trước/sau hành tinh), đuôi sao chổi, parallax, nhãn tên, gợi ý kéo, game của hôm nay, warp khi mở game ===== */
  var SRC = (d.currentScript && d.currentScript.src) || "", ICON_DIR = SRC.replace(/orbit\.js(\?.*)?$/, "orbit-icons/");
  var isVi = function () { return sys.getAttribute("data-lang") === "vi"; };
  var LITE = false, userActive = false, px = 0, py = 0, tx = 0, ty = 0, frontPass = [], lastWhoosh = 0, lastVib = 0;
  var allSats = [].slice.call(stage.querySelectorAll(".sat"));
  allSats.forEach(function (a) {
    var id = (a.getAttribute("href") || "").split("#")[1], sp = a.querySelector("span"); a.k = 0; a.prevK = -1;
    if (id && ICON_DIR && sp) { var im = new Image(); im.alt = ""; im.width = 46; im.height = 46; im.decoding = "async"; im.loading = "lazy"; im.draggable = false; im.onload = function () { sp.classList.add("img"); }; im.src = ICON_DIR + id + ".svg"; sp.appendChild(im); }
  });
  /* game của hôm nay: một vệ tinh Night đổi theo ngày (giờ Việt Nam), nổi bật vàng + huy hiệu */
  (function () {
    var day = 0; try { day = Math.floor((Date.parse(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()) + "T00:00:00Z") - Date.parse("2026-01-01T00:00:00Z")) / 864e5) + 1; } catch (e) {}
    var nights = allSats.filter(function (a) { return a.classList.contains("night"); }); if (!nights.length) return;
    var g = nights[((day % nights.length) + nights.length) % nights.length]; g.classList.add("gold"); var b = d.createElement("i"); b.className = "bdg"; b.setAttribute("aria-hidden", "true"); g.appendChild(b); g._day = day;
  })();
  function labels() { var vi = isVi(); allSats.forEach(function (a) { var b = a.querySelector(".bdg"); if (b) b.textContent = vi ? "Hôm nay" : "Today"; }); if (hint) hint.lastChild.textContent = vi ? "Kéo để xoay · Chạm để chơi" : "Drag to spin · Tap to play"; }
  var hint = d.createElement("div"); hint.className = "orbhint"; hint.setAttribute("aria-hidden", "true"); hint.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5m0-1a1.5 1.5 0 0 1 3 0v2m0-1a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-3l-2-3a1.5 1.5 0 0 1 2.5-1.6L9 15"/></svg><span></span>'; stage.appendChild(hint);
  new MutationObserver(labels).observe(sys, { attributes: true, attributeFilter: ["data-lang"] }); labels();

  var mqR = window.matchMedia("(prefers-reduced-motion: reduce)"), reduced = mqR.matches, force = false, mqN = window.matchMedia("(max-width:699px)");
  var t00 = performance.now(), last0 = 0, fpsN = 0, fpsT = 0, onScreen = true, tabOn = !d.hidden, raf = 0, last = 0, U = stage.clientWidth / 600;
  var DB = /[?&]debug(=|&|$)/.test(location.search) ? (window.__npOrbit = { ticks: 0, marks: 0, dropped: 0, maxPerSec: 0, audio: false, hot: "", vel: { pop: 0, night: 0 }, paused: { pop: false, night: false }, reduced: reduced, frames: 0, ctxCount: 0 }) : null;

  var P = 1000;   /* khoảng cách phối cảnh (đơn vị khung 600): vệ tinh phía trước to ~1,9x phía sau */
  /* Kích thước THẬT của khối (không dùng viewport): W/H sân khấu, ss = hệ số thu nhỏ vệ tinh khi khối nhỏ (điện thoại hẹp), half = nửa kích thước bong bóng trước khi phóng.
     Mọi vệ tinh (kể cả phóng to ở phía trước) bị kẹp TRỌN trong hộp; chỉ MỘT nhãn tên (vệ tinh trước nhất hoặc đang rê/focus) đặt trong hộp, tránh vệ tinh khác. */
  var W = 600, H = 500, SS = 1, HALF = 23, hot = null, lab = d.createElement("div"), labFor = null, labW = 0, labH = 0, MARGIN = 3;
  lab.className = "orblab"; lab.setAttribute("aria-hidden", "true"); stage.appendChild(lab);
  function measure() {
    W = stage.clientWidth; H = stage.clientHeight; U = W / 600; SS = Math.max(0.72, Math.min(1, U / 0.7));
    stage.style.setProperty("--ss", SS.toFixed(3)); var sp = allSats[0] && allSats[0].querySelector("span"); HALF = sp ? sp.offsetWidth / 2 * 1.1 : 25; labFor = null;
  }
  function obstacles() {
    var o = []; [hint, stage.querySelector(".orbsnd"), pl].forEach(function (e) { if (e && !e.hidden && !e.classList.contains("off") && e.offsetWidth) o.push({ x0: e.offsetLeft, y0: e.offsetTop, x1: e.offsetLeft + e.offsetWidth, y1: e.offsetTop + e.offsetHeight }); });
    var pr = W * 0.095; o.push({ x0: W / 2 - pr, y0: H / 2 - pr, x1: W / 2 + pr, y1: H / 2 + pr }); return o;   /* hành tinh cũng là vật cản của nhãn */
  }
  function overlap(a, b) { var w = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), h = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0); return w > 0 && h > 0 ? w * h : 0; }
  function placeLabel(vis, target) {
    if (!target) { lab.classList.remove("on"); labFor = null; return; }
    if (labFor !== target) { labFor = target; lab.textContent = target.getAttribute("title") || ""; lab.style.borderColor = ""; lab.className = "orblab " + (target.classList.contains("pop") ? "pop" : "night"); labW = lab.offsetWidth; labH = lab.offsetHeight; }
    var v = vis[target._i], ob = obstacles(), best = null, cl = function (n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }, cx = v.cx, cy = v.cy, r = v.r, own = { x0: cx - r, y0: cy - r, x1: cx + r, y1: cy + r };
    /* ứng viên: 16 hướng quanh vệ tinh x 2 khoảng cách (đầu tiên = dưới, giữa); chọn vị trí ít chồng nhất, ưu tiên gần + giữ lựa chọn cũ cho khỏi giật */
    var cands = [], k, g, th, ox, oy, gaps = [4, 4 + labH * 0.9, 4 + labH * 1.8];
    for (g = 0; g < 3; g++) for (k = 0; k < 16; k++) { th = Math.PI / 2 + k * Math.PI / 8; ox = Math.cos(th) * (r + gaps[g] + labW / 2 * Math.abs(Math.cos(th))); oy = Math.sin(th) * (r + gaps[g] + labH / 2 * Math.abs(Math.sin(th))); cands.push([cx + ox - labW / 2, cy + oy - labH / 2, g * 16 + k]); }
    cands.forEach(function (c) {
      var x = cl(c[0], MARGIN, W - MARGIN - labW), y = cl(c[1], MARGIN, H - MARGIN - labH), box = { x0: x, y0: y, x1: x + labW, y1: y + labH }, sc = (Math.abs(x - c[0]) + Math.abs(y - c[1])) * 30 + overlap(box, own) * 40 + (c[2] >= 16 ? 25 : 0) + (c[2] >= 32 ? 25 : 0) + (c[2] % 16 === 0 ? 0 : 3) - (labFor === target && target._ci === c[2] ? 20 : 0);
      var ov = overlap(box, own);
      vis.forEach(function (u, j) { if (j !== target._i) ov += overlap(box, { x0: u.cx - u.r, y0: u.cy - u.r, x1: u.cx + u.r, y1: u.cy + u.r }); });
      ob.forEach(function (q) { ov += overlap(box, q); });
      sc += ov * 4;
      if (!best || sc < best.sc) best = { sc: sc, x: x, y: y, i: c[2], ov: ov };
    });
    target._ci = best.i;
    lab.style.translate = best.x.toFixed(1) + "px " + best.y.toFixed(1) + "px"; lab.classList.toggle("on", best.ov < 8);   /* không có chỗ trống (hộp quá nhỏ): ẩn nhãn thay vì đè lên vệ tinh khác */
  }
  function render() {
    var front = null, fk = -2, parx = LITE || reduced ? 0 : px, pary = LITE || reduced ? 0 : py, vis = [], hw = W / 2 - MARGIN, hh = H / 2 - MARGIN;
    ["pop", "night"].forEach(function (w) {
      var o = O[w], g = o.g, ct = Math.cos(o.th), st = Math.sin(o.th), dir = (Math.abs(o.vel) > 0.01 ? Math.sign(o.vel) : Math.abs(o.kv) > 0.01 ? Math.sign(o.kv) : g.dir), sp = Math.min(1, Math.max(Math.abs(o.vel), Math.abs(o.kv)) / 2.2);
      for (var i = 0; i < o.sats.length; i++) {
        var f = o.base[i] + o.phi, sf = Math.sin(f), cf = Math.cos(f), ex = g.a * cf, ey = g.b * sf, t = (sf + 1) / 2, el = o.sats[i], gold = el.classList.contains("gold");
        var zz = g.a * 0.9 * sf, sc = P / (P - zz) * (gold ? 1.16 : 1), sx = (ex * ct - ey * st + parx * 14 * t) * U, sy = (ey * ct + ex * st + pary * 9 * t) * U;
        /* kẹp: bong bóng sau khi phóng phải nằm trọn trong hộp (tâm hộp = tâm hành tinh = W/2,H/2) */
        var room = Math.min(hw - Math.abs(sx), hh - Math.abs(sy)) / HALF; if (sc > room) sc = Math.max(0.5, room);
        /* hướng bay trên màn hình (đạo hàm của elip đã nghiêng) -> đuôi sao chổi ngược hướng */
        var dx = (-g.a * sf * ct - g.b * cf * st) * dir, dy = (g.b * cf * ct - g.a * sf * st) * dir, rot = Math.atan2(dy, dx) * 180 / Math.PI + 180;
        el.style.cssText = "transform:translate(" + sx.toFixed(1) + "px," + sy.toFixed(1) + "px) scale(" + sc.toFixed(3) + ");opacity:" + (0.66 + 0.34 * t).toFixed(3) + ";z-index:" + (sf > 0 ? 6 + Math.round(t * 3) : 1) + ";--b:" + (0.7 + 0.3 * t).toFixed(2) + ";--r:" + rot.toFixed(0) + "deg;--tl:" + (LITE ? 0 : (sp * (0.25 + 0.75 * t))).toFixed(2);
        el.k = sf; el._i = vis.length; vis.push({ cx: W / 2 + sx, cy: H / 2 + sy, r: HALF * sc + 2 }); if (sf > fk) { fk = sf; front = el; }
        if (el.prevK < 0.96 && sf >= 0.96 && el.prevK > -1) frontPass.push(w);
        el.prevK = sf;
      }
    });
    /* đúng MỘT nhãn: vệ tinh đang rê/focus, nếu không thì vệ tinh trước nhất của cả hai quỹ đạo */
    var tgt = hot || (front && fk > 0.55 ? front : null);
    allSats.forEach(function (el) { var on = el === tgt; if (on !== !!el._lab) { el._lab = on; el.classList.toggle("lab", on); } });
    placeLabel(vis, tgt);
    if (!LITE && !reduced) stage.style.setProperty("--px", px.toFixed(3)), stage.style.setProperty("--py", py.toFixed(3));
    if (frontPass.length) { var n = performance.now(); if (soundOn && ctx && ctx.state === "running" && n - lastWhoosh > 260) { lastWhoosh = n; whoosh(frontPass[0]); } if (navigator.vibrate && (soundOn || userActive) && !reduced && n - lastVib > 400) { lastVib = n; try { navigator.vibrate(7); } catch (e) {} } frontPass.length = 0; }
  }
  function still() { return reduced && !force; }
  function paused(o) { return o.drag || o.hover > 0 || o.focus > 0; }
  function active() { if (!LITE && !reduced && (Math.abs(tx - px) > 0.002 || Math.abs(ty - py) > 0.002)) return true; return ["pop", "night"].some(function (w) { var o = O[w]; return Math.abs(o.vel) > 0.003 || o.pend !== 0 || o.drag || (!still() && !paused(o)); }); }
  function setLite(v) { LITE = v; sys.classList.toggle("lite", v); if (DB) DB.lite = v; }
  function wake() { if (!raf && onScreen && tabOn) { last = 0; raf = requestAnimationFrame(frame); } }

  function frame(t) {
    raf = 0; var dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016; last = t;
    if (stage.clientWidth !== W || stage.clientHeight !== H) measure(); var maxV = 0;
    px += (tx - px) * (1 - Math.exp(-dt * 6)); py += (ty - py) * (1 - Math.exp(-dt * 6));
    /* đo FPS sau 1,5s đầu (bỏ qua lúc tải/giải mã ảnh) và bỏ khung > 100ms (đổi tab): chậm thì chỉ tắt hiệu ứng phụ (đuôi, parallax, cực quang), KHÔNG dừng vòng quay; nhanh trở lại thì bật lại */
    if (!reduced && dt > 0 && t - t00 > 1500 && (t - last0) < 100) { fpsN++; fpsT += dt; if (fpsN === 120) { var av = fpsT / fpsN; if (!LITE && av > 0.034) setLite(true); else if (LITE && av < 0.021) setLite(false); fpsN = 0; fpsT = 0; } } last0 = t;
    ["pop", "night"].forEach(function (w) {
      var o = O[w], target = (still() || paused(o)) ? 0 : o.g.auto * o.g.dir;
      if (!o.drag) {
        var k = target === 0 ? 7 : (Math.abs(o.vel) > Math.abs(target) ? 1.5 : 3);
        o.vel += (target - o.vel) * (1 - Math.exp(-dt * k));
        if (Math.abs(o.vel) < 0.002 && target === 0) o.vel = 0;
        o.phi += o.vel * dt;
      }
      if (o.pend) { var s = Math.abs(o.pend) < 0.003 ? o.pend : o.pend * (1 - Math.exp(-dt * 10)); o.pend -= s; o.phi += s; o.kv = s / dt; } else o.kv = 0;
      o.phi %= TAU;
      var sp = Math.max(Math.abs(o.vel), Math.abs(o.kv)); maxV = Math.max(maxV, sp);
      var m = Math.floor(o.phi / MARK); if (m !== o.mark) { o.mark = m; marks(w, sp); }
      if (DB) { DB.vel[w] = o.vel; DB.paused[w] = paused(o); }
    });
    ["pop", "night"].forEach(function (w) { var o = O[w]; if (o.drag && !dr) o.drag = false; if (o.hover > 0 && !stage.matches(":hover") && !cards[w].matches(":hover")) o.hover = 0; });
    audioFrame(maxV); render(); if (DB) DB.frames++;
    if (onScreen && tabOn && active()) raf = requestAnimationFrame(frame); else { last = 0; audioFrame(0); }
  }

  /* ===== âm thanh tổng hợp (Web Audio), tắt mặc định, không tải file ===== */
  var AC = window.AudioContext || window.webkitAudioContext, ctx = null, master, comp, noiseG, noiseF, soundOn = false, lastTick = 0, recent = [], PENTA = [0, 2, 4, 7, 9];
  function noteFreq(w, idx) { var n = ((idx % 10) + 10) % 10, semi = PENTA[n % 5] + 12 * Math.floor(n / 5); return (w === "pop" ? 523.25 : 220) * Math.pow(2, semi / 12); }
  function marks(w, speed) {
    if (DB) DB.marks++;
    if (!soundOn || !ctx || ctx.state !== "running" || speed < 0.02) return;
    var now = performance.now(); if (now - lastTick < 83) { if (DB) DB.dropped++; return; } lastTick = now;
    recent = recent.filter(function (x) { return now - x < 1000; }); recent.push(now);
    if (DB) { DB.ticks++; DB.maxPerSec = Math.max(DB.maxPerSec, recent.length); }
    tick(w, speed);
  }
  function tick(w, speed) {
    var o = O[w], t0 = ctx.currentTime, f = noteFreq(w, o.mark) * (1 + 0.5 * Math.min(speed, 14) / 14), vol = 0.05 + 0.11 * Math.min(1, speed / 8), pop = w === "pop", dur = pop ? 0.16 : 0.55;
    var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); g.connect(comp);
    var parts = pop ? [[1, 1], [4, 0.28]] : [[1, 1], [2.76, 0.4], [5.4, 0.15]], n = parts.length;
    parts.forEach(function (p) {
      var os = ctx.createOscillator(), pg = ctx.createGain(); os.type = "sine"; os.frequency.value = f * p[0]; pg.gain.value = p[1];
      os.connect(pg); pg.connect(g); os.start(t0); os.stop(t0 + dur + 0.02);
      os.onended = function () { try { os.disconnect(); pg.disconnect(); if (--n === 0) g.disconnect(); } catch (e) {} };
    });
  }
  function whoosh(w) {
    var t0 = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.setValueAtTime(w === "pop" ? 520 : 260, t0); o.frequency.exponentialRampToValueAtTime(w === "pop" ? 180 : 90, t0 + 0.22);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.24); o.connect(g); g.connect(comp); o.start(t0); o.stop(t0 + 0.26); o.onended = function () { try { o.disconnect(); g.disconnect(); } catch (e) {} };
  }
  function audioFrame(v) {
    if (!soundOn || !ctx || !noiseG) return;
    var t = ctx.currentTime; noiseG.gain.setTargetAtTime(Math.max(0, Math.min(1, (v - 0.8) / 10)) * 0.09, t, 0.05); noiseF.frequency.setTargetAtTime(300 + Math.min(v, 14) * 160, t, 0.05);
  }
  function setSound(on) {
    var b = sys.querySelector(".orbsnd");
    if (on) {
      if (!AC) return;
      try {
        if (!ctx) {
          ctx = new AC(); if (DB) DB.ctxCount++;
          comp = ctx.createDynamicsCompressor(); master = ctx.createGain(); master.gain.value = 0.2; comp.connect(master); master.connect(ctx.destination);
          var len = ctx.sampleRate, buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0); for (var i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
          var ns = ctx.createBufferSource(); ns.buffer = buf; ns.loop = true; noiseF = ctx.createBiquadFilter(); noiseF.type = "bandpass"; noiseF.Q.value = 0.8; noiseG = ctx.createGain(); noiseG.gain.value = 0;
          ns.connect(noiseF); noiseF.connect(noiseG); noiseG.connect(master); ns.start();
        }
        ctx.resume();
        var e = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = e; s.connect(ctx.destination); s.start(0); /* mở khoá iOS Safari */
      } catch (e2) { return; }
      soundOn = true;
    } else { soundOn = false; if (ctx && noiseG) noiseG.gain.setTargetAtTime(0, ctx.currentTime, 0.03); if (ctx) setTimeout(function () { if (!soundOn && ctx) ctx.suspend(); }, 150); }
    b.setAttribute("aria-pressed", on ? "true" : "false"); b.firstChild.textContent = on ? "🔊" : "🔇";
    b.setAttribute("aria-label", isVi() ? (on ? "Tắt âm thanh quỹ đạo" : "Bật âm thanh quỹ đạo") : (on ? "Turn orbit sound off" : "Turn orbit sound on"));
    if (DB) DB.audio = soundOn;
  }
  function syncCtx() { if (!ctx) return; if (soundOn && onScreen && tabOn) ctx.resume(); else if (ctx.state === "running") ctx.suspend(); }
  if (AC) { var sb = sys.querySelector(".orbsnd"); sb.hidden = false; sb.addEventListener("click", function () { setSound(!soundOn); }); }

  /* ===== trạng thái nóng: dừng quỹ đạo + sáng thẻ ===== */
  var tapped = "", tapTimer = 0;
  function refresh() {
    var any = "";
    ["pop", "night"].forEach(function (w) { var o = O[w], on = o.hover > 0 || o.focus > 0 || o.drag || tapped === w; cards[w].classList.toggle("on", on); if (on) any = w; });
    if (DB) DB.hot = any; wake();
  }
  function worldOf(el) { var e = el && el.closest ? el.closest("[data-orbit],.world") : null; return e ? (e.getAttribute("data-orbit") || (e.classList.contains("pop") ? "pop" : "night")) : null; }
  [stage, cards.pop, cards.night].forEach(function (host) {
    host.addEventListener("pointerover", function (e) { if (e.pointerType !== "mouse") return; var w = worldOf(e.target); if (w && !O[w].hover) { O[w].hover = 1; refresh(); } });
    host.addEventListener("pointerout", function (e) { if (e.pointerType !== "mouse") return; var w = worldOf(e.target); if (w && w !== worldOf(e.relatedTarget)) { O[w].hover = 0; refresh(); } });
    host.addEventListener("focusin", function (e) { var w = worldOf(e.target), v = true; try { v = e.target.matches(":focus-visible"); } catch (x) {} if (w && v) { O[w].focus = 1; refresh(); } });
    host.addEventListener("focusout", function (e) { var w = worldOf(e.target); if (w) { O[w].focus = 0; refresh(); } });
  });

  /* ===== kéo để xoay (góc con trỏ trong không gian elip của quỹ đạo) ===== */
  var dr = null;
  function ang(w, e) {
    var r = stage.getBoundingClientRect(), o = O[w], g = o.g, px = (e.clientX - r.left) / U - 300, py = (e.clientY - r.top) / U - 250, c = Math.cos(-o.th), s = Math.sin(-o.th);
    return Math.atan2((px * s + py * c) / g.b, (px * c - py * s) / g.a);
  }
  stage.addEventListener("pointerdown", function (e) {
    if (e.button > 0 || !e.target.closest("[data-orbit]")) return; var w = worldOf(e.target), o = O[w];
    dr = { w: w, id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, a: ang(w, e), t: e.timeStamp, v: 0 }; o.drag = true; o.vel = 0; stage.classList.add("drag"); refresh();
  });
  stage.addEventListener("pointermove", function (e) {
    if (!dr || e.pointerId !== dr.id) return; var o = O[dr.w];
    if (!dr.moved && Math.hypot(e.clientX - dr.x, e.clientY - dr.y) > 6) { dr.moved = true; try { stage.setPointerCapture(e.pointerId); } catch (x) {} }
    if (!dr.moved) return;
    var a = ang(dr.w, e), da = a - dr.a; if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU; dr.a = a;
    var dt = Math.max(0.008, (e.timeStamp - dr.t) / 1000); dr.t = e.timeStamp; dr.v = dr.v * 0.6 + (da / dt) * 0.4;
    o.phi += da; o.vel = Math.max(-16, Math.min(16, dr.v)); wake();
  });
  function endDrag(e) {
    if (!dr || e.pointerId !== dr.id) return; var o = O[dr.w], moved = dr.moved; o.drag = false; if (!moved) o.vel = 0; dr = null; stage.classList.remove("drag");
    if (moved) { hint.classList.add("off"); stage._noclick = true; setTimeout(function () { stage._noclick = false; }, 80); } refresh();
  }
  stage.addEventListener("pointerup", endDrag); stage.addEventListener("pointercancel", endDrag);
  /* chống kẹt trạng thái "đang kéo/đang dừng" trên cảm ứng: nhả/huỷ ở bất kỳ đâu (kể cả ngoài sân khấu, sau khi trình duyệt chiếm cử chỉ cuộn) đều giải phóng */
  function release(e) { if (dr && (!e.pointerId || e.pointerId === dr.id)) endDrag({ pointerId: dr.id }); ["pop", "night"].forEach(function (w) { if (O[w].drag && !dr) { O[w].drag = false; } }); stage.classList.remove("drag"); refresh(); }
  ["pointerup", "pointercancel", "touchend", "touchcancel", "lostpointercapture"].forEach(function (ev) { d.addEventListener(ev, release, true); });
  addEventListener("blur", release); addEventListener("scroll", function () { if (dr && !dr.moved) release({}); }, { passive: true });
  stage.addEventListener("dragstart", function (e) { e.preventDefault(); });

  /* ===== bấm icon: máy tính mở thẳng game; điện thoại chạm lần đầu thì nhấn mạnh + cuộn tới thẻ, chạm lần hai mở game ===== */
  stage.addEventListener("click", function (e) {
    var a = e.target.closest("a.sat"); if (!a) return;
    if (stage._noclick) { e.preventDefault(); return; }
    var w = a.getAttribute("data-orbit");
    if (sys.getAttribute("data-tap") !== "open" && mqN.matches && tapped !== w) {   /* data-tap="open" (hub /play/): chạm là mở game ngay, không có bước nhấn mạnh + cuộn */
      e.preventDefault(); tapped = w; refresh();
      cards[w].scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      clearTimeout(tapTimer); tapTimer = setTimeout(function () { tapped = ""; refresh(); }, 6000);
    }
  });
  d.addEventListener("pointerdown", function (e) { if (tapped && !e.target.closest(".orbsys")) { tapped = ""; refresh(); } });

  /* ===== bàn phím: ← → xoay từng nấc khi một icon của quỹ đạo đang focus ===== */
  stage.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return; var w = worldOf(e.target); if (!w || !e.target.closest("a.sat")) return;
    e.preventDefault(); O[w].pend += (e.key === "ArrowRight" ? 1 : -1) * TAU / 6; wake();
  });

  /* ===== parallax: nghiêng theo con trỏ (máy tính) hoặc cảm biến nghiêng (điện thoại; iOS chỉ xin quyền khi bấm nút 🔊, mặc định không bật) ===== */
  var clamp = function (v) { return Math.max(-1, Math.min(1, v)); };
  sys.addEventListener("pointermove", function (e) { if (e.pointerType !== "mouse" || reduced) return; var r = stage.getBoundingClientRect(); tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2); ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 2); wake(); });
  sys.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { tx = 0; ty = 0; wake(); } });
  var oriOn = false;
  function onOri(e) { if (reduced || e.gamma == null) return; tx = clamp(e.gamma / 28); ty = clamp(((e.beta || 45) - 45) / 28); wake(); }
  function startOri() {
    if (oriOn || !("DeviceOrientationEvent" in window)) return;
    var D = window.DeviceOrientationEvent; if (typeof D.requestPermission === "function") { D.requestPermission().then(function (r) { if (r === "granted") { oriOn = true; addEventListener("deviceorientation", onOri); } }).catch(function () {}); }
  }
  if ("DeviceOrientationEvent" in window && typeof window.DeviceOrientationEvent.requestPermission !== "function" && mqN.matches) { oriOn = true; addEventListener("deviceorientation", onOri); }
  sys.addEventListener("pointerdown", function () { userActive = true; }, true);
  sys.querySelector(".orbsnd") && sys.querySelector(".orbsnd").addEventListener("click", startOri);

  /* ===== mặt trăng (nền tối) / mặt trời (nền sáng) phía sau vệ tinh: chỉ trang trí, đổi theo theme bằng CSS ===== */
  if (!stage.querySelector(".orbcel")) { var cel = d.createElement("div"); cel.className = "orbcel"; cel.setAttribute("aria-hidden", "true"); cel.innerHTML = '<svg class="moon" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="rgba(205,195,255,.16)"/><circle cx="32" cy="32" r="23" fill="rgba(205,195,255,.22)"/><circle cx="32" cy="32" r="17" fill="#F4F1FF"/><circle cx="26" cy="27" r="3.6" fill="#D8D1F4"/><circle cx="37" cy="36" r="4.6" fill="#D8D1F4"/><circle cx="35" cy="24.5" r="2" fill="#D8D1F4"/><circle cx="25" cy="38" r="2.2" fill="#D8D1F4"/></svg><svg class="sun" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="rgba(255,196,64,.2)"/><g class="rays" stroke="#FFB02E" stroke-width="3" stroke-linecap="round" opacity=".85"><path d="M32 4v6M32 54v6M4 32h6M54 32h6M12.2 12.2l4.2 4.2M47.6 47.6l4.2 4.2M12.2 51.8l4.2-4.2M47.6 16.4l4.2-4.2"/></g><circle cx="32" cy="32" r="16" fill="#FFD84D"/><circle cx="32" cy="32" r="16" fill="none" stroke="#FFAA2B" stroke-width="1.5" opacity=".6"/></svg>'; stage.insertBefore(cel, stage.firstChild); }
  /* ===== hành tinh: bấm để pulse ===== */
  var planet = stage.querySelector(".planet");
  if (planet) planet.innerHTML = '<defs><clipPath id="plc2"><circle cx="32" cy="32" r="30"/></clipPath><radialGradient id="pleo" cx=".38" cy=".32" r=".9"><stop offset="0" stop-color="#5BB8FF"/><stop offset=".55" stop-color="#1F6FE0"/><stop offset="1" stop-color="#0A2F86"/></radialGradient><radialGradient id="plsh" cx=".34" cy=".28" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#020a24" stop-opacity=".62"/></radialGradient><linearGradient id="plrim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".5" stop-color="#9FD2FF" stop-opacity=".3"/><stop offset="1" stop-color="#3B7BFF" stop-opacity=".8"/></linearGradient></defs><g clip-path="url(#plc2)"><rect width="64" height="64" fill="url(#pleo)"/><path d="M12 15c4-4 10-4 13 0 2 3-1 5-3 7 3 2 5 6 3 10-1 3-4 5-5 9-4-3-6-9-4-14-4-3-6-8-4-12z" fill="#3DBE6A"/><path d="M36 11c5-3 11-1 14 4 2 3-1 6-4 6 3 4 2 9-2 12-3 2-3 7-6 10-4-4-4-10-2-15-3-3-5-7-3-11-1-3 0-5 3-6z" fill="#34A85E"/><path d="M47 40c3-1 6 1 6 4s-3 5-6 4c-2-1-3-5 0-8z" fill="#3DBE6A"/><path d="M20 47c3-1 6 0 6 2s-3 3-6 2c-1-1-1-3 0-4z" fill="#34A85E"/><g fill="#fff" opacity=".78"><ellipse cx="22" cy="20" rx="8" ry="2.2"/><ellipse cx="44" cy="30" rx="9" ry="2.4"/><ellipse cx="30" cy="42" rx="9" ry="2.2"/><ellipse cx="14" cy="34" rx="5" ry="1.7"/></g><circle cx="32" cy="32" r="30" fill="url(#plsh)"/></g><circle cx="32" cy="32" r="30" fill="none" stroke="url(#plrim)" stroke-width="2"/>';
  if (planet) { planet.style.pointerEvents = "auto"; planet.style.cursor = "pointer"; planet.addEventListener("click", function () { planet.classList.remove("pulse"); void planet.offsetWidth; planet.classList.add("pulse"); if (soundOn && ctx && ctx.state === "running") whoosh("night"); }); }

  /* ===== warp: bấm game/thế giới thì cảnh zoom vào ~450ms rồi mới điều hướng (giảm chuyển động / phím tắt / chuột phải: đi ngay) ===== */
  var warpT = 0;
  sys.addEventListener("click", function (e) {
    if (e.defaultPrevented || reduced || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest("a.sat, a.world, .world a") : null; if (!a || !a.href || a.target === "_blank") return;
    e.preventDefault(); var r = stage.getBoundingClientRect(), b = a.getBoundingClientRect(), sat = a.classList.contains("sat");
    stage.style.transformOrigin = sat ? ((b.left + b.width / 2 - r.left) / r.width * 100).toFixed(0) + "% " + ((b.top + b.height / 2 - r.top) / r.height * 100).toFixed(0) + "%" : "50% 50%";
    sys.classList.add("warp"); clearTimeout(warpT); warpT = setTimeout(function () { location.href = a.href; }, 450);
  });
  addEventListener("pageshow", function () { clearTimeout(warpT); sys.classList.remove("warp"); stage.style.transformOrigin = ""; });

  /* ===== giảm chuyển động của hệ điều hành (Android "Xoá hiệu ứng"/tiết kiệm pin, iOS "Giảm chuyển động"): mặc định đứng yên theo cài đặt, nhưng có nút ▶ rõ ràng để người dùng tự chạy ===== */
  var pl = d.createElement("button"); pl.type = "button"; pl.className = "orbplay"; pl.hidden = !reduced; pl.setAttribute("aria-pressed", "false");
  function plLabel() { var vi = isVi(); pl.textContent = force ? "⏸ " + (vi ? "Dừng" : "Pause") : "▶ " + (vi ? "Chạy hiệu ứng" : "Play motion"); pl.setAttribute("aria-label", force ? (vi ? "Dừng chuyển động quỹ đạo" : "Pause orbit motion") : (vi ? "Chạy chuyển động quỹ đạo" : "Play orbit motion")); pl.setAttribute("aria-pressed", force ? "true" : "false"); }
  pl.addEventListener("click", function () { force = !force; plLabel(); wake(); refresh(); }); plLabel(); stage.appendChild(pl);
  new MutationObserver(plLabel).observe(sys, { attributes: true, attributeFilter: ["data-lang"] });
  /* ?debug: lý do trạng thái hiện tại (trên iPhone mở /?debug hoặc /play/?debug, góc dưới sân khấu) */
  function reason() { var r = []; if (reduced) r.push(force ? "reduced+forced" : "reduced"); if (!onScreen) r.push("paused:offscreen"); if (!tabOn) r.push("paused:hidden"); ["pop", "night"].forEach(function (w) { var o = O[w]; if (o.drag) r.push("paused:touch-" + w); else if (o.hover > 0) r.push("paused:hover-" + w); else if (o.focus > 0) r.push("paused:focus-" + w); }); if (LITE) r.push("degraded"); return r.length ? r.join(" ") : "auto"; }
  if (DB) { var dbg = d.createElement("div"); dbg.className = "orbdbg"; stage.appendChild(dbg); DB.reason = reason; setInterval(function () { dbg.textContent = reason() + " raf=" + (raf ? 1 : 0) + " f=" + DB.frames; }, 400); }
  mqR.addEventListener && mqR.addEventListener("change", function () { pl.hidden = !mqR.matches; });

  /* ===== tạm dừng khi ngoài màn hình / tab ẩn ===== */
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { onScreen = en[en.length - 1].isIntersecting; syncCtx(); if (onScreen) wake(); else { cancelAnimationFrame(raf); raf = 0; } }).observe(stage);
  d.addEventListener("visibilitychange", function () { tabOn = !d.hidden; syncCtx(); if (tabOn) wake(); else { cancelAnimationFrame(raf); raf = 0; } });
  if (mqR.addEventListener) mqR.addEventListener("change", function () { reduced = mqR.matches; if (DB) DB.reduced = reduced; if (!reduced) force = false; wake(); });
  window.addEventListener("resize", function () { measure(); render(); });
  if (window.ResizeObserver) new ResizeObserver(function () { if (stage.clientWidth !== W || stage.clientHeight !== H) { measure(); render(); } }).observe(stage);
  stage.addEventListener("pointerover", function (e) { if (e.pointerType !== "mouse") return; var a = e.target.closest && e.target.closest("a.sat"); if (a && hot !== a) { hot = a; render(); } });
  stage.addEventListener("pointerout", function (e) { if (e.pointerType !== "mouse") return; var a = e.target.closest && e.target.closest("a.sat"); if (a && a === hot && !(e.relatedTarget && a.contains(e.relatedTarget))) { hot = null; render(); } });
  stage.addEventListener("focusin", function (e) { var a = e.target.closest && e.target.closest("a.sat"), v = true; try { v = e.target.matches(":focus-visible"); } catch (x) {} if (a && v) { hot = a; render(); } });
  stage.addEventListener("focusout", function (e) { if (hot) { hot = null; render(); } });
  measure(); render(); wake();
  if (DB) { DB.setPhi = function (w, v) { O[w].phi = v; render(); }; DB.sound = setSound; DB.setLite = setLite; DB.sats = function () { return allSats.map(function (a) { var r = a.getBoundingClientRect(); return { w: r.width, z: +a.style.zIndex, k: a.k, cls: a.className, o: +a.style.opacity }; }); }; DB.state = function () { return ctx ? ctx.state : "none"; }; }
})();
