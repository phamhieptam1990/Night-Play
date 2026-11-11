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
  var mqR = window.matchMedia("(prefers-reduced-motion: reduce)"), reduced = mqR.matches, mqN = window.matchMedia("(max-width:699px)");
  var onScreen = true, tabOn = !d.hidden, raf = 0, last = 0, U = stage.clientWidth / 600;
  var DB = /[?&]debug(=|&|$)/.test(location.search) ? (window.__npOrbit = { ticks: 0, marks: 0, dropped: 0, maxPerSec: 0, audio: false, hot: "", vel: { pop: 0, night: 0 }, paused: { pop: false, night: false }, reduced: reduced, frames: 0, ctxCount: 0 }) : null;

  function render() {
    ["pop", "night"].forEach(function (w) {
      var o = O[w], g = o.g, ct = Math.cos(o.th), st = Math.sin(o.th);
      for (var i = 0; i < o.sats.length; i++) {
        var f = o.base[i] + o.phi, ex = g.a * Math.cos(f), ey = g.b * Math.sin(f), k = (Math.sin(f) + 1) / 2, el = o.sats[i];
        el.style.transform = "translate(" + ((ex * ct - ey * st) * U).toFixed(2) + "px," + ((ex * st + ey * ct) * U).toFixed(2) + "px) scale(" + (1 + 0.12 * k).toFixed(3) + ")";
        el.style.opacity = (0.72 + 0.28 * k).toFixed(3); el.style.zIndex = k > 0.5 ? 2 : 1;
      }
    });
  }
  function paused(o) { return o.drag || o.hover > 0 || o.focus > 0; }
  function active() { return ["pop", "night"].some(function (w) { var o = O[w]; return Math.abs(o.vel) > 0.003 || o.pend !== 0 || o.drag || (!reduced && !paused(o)); }); }
  function wake() { if (!raf && onScreen && tabOn) { last = 0; raf = requestAnimationFrame(frame); } }

  function frame(t) {
    raf = 0; var dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016; last = t;
    U = stage.clientWidth / 600; var maxV = 0;
    ["pop", "night"].forEach(function (w) {
      var o = O[w], target = (reduced || paused(o)) ? 0 : o.g.auto * o.g.dir;
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
    b.setAttribute("aria-label", sys.getAttribute("data-lang") === "vi" ? (on ? "Tắt âm thanh quỹ đạo" : "Bật âm thanh quỹ đạo") : (on ? "Turn orbit sound off" : "Turn orbit sound on"));
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
    if (moved) { stage._noclick = true; setTimeout(function () { stage._noclick = false; }, 80); } refresh();
  }
  stage.addEventListener("pointerup", endDrag); stage.addEventListener("pointercancel", endDrag);
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

  /* ===== tạm dừng khi ngoài màn hình / tab ẩn ===== */
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { onScreen = en[en.length - 1].isIntersecting; syncCtx(); if (onScreen) wake(); else { cancelAnimationFrame(raf); raf = 0; } }).observe(stage);
  d.addEventListener("visibilitychange", function () { tabOn = !d.hidden; syncCtx(); if (tabOn) wake(); else { cancelAnimationFrame(raf); raf = 0; } });
  if (mqR.addEventListener) mqR.addEventListener("change", function () { reduced = mqR.matches; if (DB) DB.reduced = reduced; wake(); });
  window.addEventListener("resize", function () { U = stage.clientWidth / 600; render(); });
  render(); wake();
  if (DB) { DB.setPhi = function (w, v) { O[w].phi = v; render(); }; DB.sound = setSound; DB.state = function () { return ctx ? ctx.state : "none"; }; }
})();
