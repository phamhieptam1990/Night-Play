/* NHẠC NỀN — mỗi game MỘT bản riêng (tạo bằng Web Audio, không tệp âm thanh → không tốn băng thông, lặp vô hạn, tắt theo nút loa chung).
   Nạp tự động từ shared/bridge.js (mọi game đều có) — game KHÔNG phải sửa gì.
   - Bật ngay khi trang tải. Trình duyệt chặn phát tự động (AudioContext bị treo) → nút loa hiện TẮT ("chờ bật"), người dùng chạm bất kỳ đâu
     (hoặc chạm đúng nút loa: lần chạm đó là BẬT nhạc, không phải tắt) thì nhạc phát và nút loa hiện BẬT.
   - Nút loa (np-sound = "0") / tắt tiếng tạm của khung / tab ẩn: bridge.js treo mọi AudioContext → nhạc dừng; bật lại thì tiếp tục đúng chỗ.
   - Trong ván nhạc nhỏ hơn ở màn chọn (không át tiếng game / giọng đọc).
   - Bản nhạc của mỗi game: SPEC[id] (nhịp, âm giai, vòng hợp âm, nhạc cụ, độ "sôi động"); giai điệu sinh từ hạt giống theo id → ổn định, mỗi lần mở là đúng bản đó.
   API: window.NPMusic.{id, state(), spec} */
(function () {
  "use strict";
  if (window.NPMusic) return;
  var m = /\/games\/([^\/]+)\//.exec(location.pathname); if (!m) return;
  var ID = m[1];
  var A = window.AudioContext || window.webkitAudioContext; if (!A) return;
  try { if (/[?&]nomusic=1/.test(location.search)) return; } catch (e) {}
  try { if (/[?&]multi=1/.test(location.search)) return; } catch (e) {}   /* chơi nhiều game cùng lúc: nhiều khung chạy một lúc → KHÔNG phát nhạc nền (nhạc các game sẽ đè lên nhau) */

  var SC = { maj: [0, 2, 4, 5, 7, 9, 11], min: [0, 2, 3, 5, 7, 8, 10], dor: [0, 2, 3, 5, 7, 9, 10], mix: [0, 2, 4, 5, 7, 9, 10], lyd: [0, 2, 4, 6, 7, 9, 11], pen: [0, 2, 4, 7, 9, 12, 14] };
  /* bpm · root (MIDI) · sc (âm giai) · prog (bậc hợp âm mỗi ô nhịp, 8 ô) · lead (nhạc cụ giai điệu) · groove 0-2 · bass (các bước 16 trong ô nhịp) · arp (bước arp) */
  var SPEC = {
    "bao-nhieu-giay":   { bpm: 112, root: 60, sc: "maj", prog: [0, 4, 5, 3, 0, 4, 3, 4], lead: "bell",   groove: 1, bass: [0, 8], arp: [0, 4, 8, 12] },
    "ve-mot-net":       { bpm: 96,  root: 62, sc: "pen", prog: [0, 3, 4, 3, 0, 5, 3, 4], lead: "flute",  groove: 0, bass: [0, 10], arp: [2, 6, 10, 14] },
    "cat-banh-chung":   { bpm: 104, root: 57, sc: "pen", prog: [0, 2, 3, 2, 0, 4, 3, 1], lead: "pluck",  groove: 1, bass: [0, 6, 8], arp: [0, 3, 6, 9, 12] },
    "truot-so-nam-cham": { bpm: 90,  root: 60, sc: "maj", prog: [0, 5, 3, 4, 0, 5, 4, 0], lead: "marimba",groove: 0, bass: [0, 7], arp: [0, 4, 7, 12] },
    "tim-doi-the":      { bpm: 96,  root: 62, sc: "maj", prog: [0, 4, 5, 3, 0, 4, 3, 0], lead: "marimba",groove: 1, bass: [0, 7], arp: [0, 4, 7, 11] },
    "ghep-ba-the":      { bpm: 88,  root: 57, sc: "pen", prog: [0, 3, 4, 0, 5, 3, 4, 0], lead: "marimba",groove: 0, bass: [0, 7], arp: [0, 4, 7, 12] },
    "mat-tinh-khong":   { bpm: 92,  root: 59, sc: "dor", prog: [0, 3, 0, 4, 0, 3, 5, 4], lead: "marimba",groove: 1, bass: [0, 7, 10], arp: [0, 4, 8, 12] },
    "noi-mot-net":      { bpm: 100, root: 64, sc: "min", prog: [0, 5, 2, 6, 0, 5, 3, 4], lead: "bell",   groove: 1, bass: [0, 8], arp: [0, 2, 4, 6, 8, 10, 12, 14] },
    "ne-o-ga":          { bpm: 128, root: 62, sc: "mix", prog: [0, 6, 3, 4, 0, 6, 3, 0], lead: "square", groove: 2, bass: [0, 4, 8, 12], arp: [2, 6, 10, 14] },
    "shipper-sieu-toc": { bpm: 138, root: 57, sc: "min", prog: [0, 5, 3, 4, 0, 5, 6, 4], lead: "square", groove: 2, bass: [0, 3, 6, 8, 11, 14], arp: [0, 2, 4, 6, 8, 10, 12, 14] },
    "song-sot-cuoi-thang": { bpm: 84, root: 55, sc: "min", prog: [0, 5, 3, 4, 0, 6, 5, 4], lead: "flute", groove: 0, bass: [0, 8], arp: [0, 4, 8, 12] },
    "xay-cau-tre":      { bpm: 90,  root: 60, sc: "pen", prog: [0, 3, 1, 4, 0, 3, 4, 0], lead: "marimba",groove: 0, bass: [0, 8], arp: [0, 3, 6, 10, 13] },
    "ban-co-hieu-toi":  { bpm: 78,  root: 58, sc: "dor", prog: [0, 3, 6, 4, 0, 3, 5, 4], lead: "bell",   groove: 0, bass: [0, 8], arp: [0, 6, 12] },
    "cho-hang-kieu-viet":{ bpm: 108, root: 60, sc: "maj", prog: [0, 3, 4, 0, 5, 3, 4, 0], lead: "pluck",  groove: 1, bass: [0, 6, 8, 14], arp: [2, 6, 10, 14] },
    "cozy-wings":       { bpm: 100, root: 65, sc: "lyd", prog: [0, 1, 4, 0, 0, 1, 5, 4], lead: "flute",  groove: 1, bass: [0, 8], arp: [0, 4, 8, 12] },
    "dap-deadline":     { bpm: 144, root: 52, sc: "min", prog: [0, 0, 5, 6, 0, 0, 3, 4], lead: "square", groove: 2, bass: [0, 2, 4, 6, 8, 10, 12, 14], arp: [3, 7, 11, 15] },
    "doi-doi-2048":     { bpm: 116, root: 64, sc: "maj", prog: [0, 5, 3, 4, 0, 5, 1, 4], lead: "marimba",groove: 1, bass: [0, 8], arp: [0, 2, 4, 6, 8, 10, 12, 14] },
    "duong-ray":        { bpm: 120, root: 55, sc: "mix", prog: [0, 0, 3, 3, 4, 4, 3, 0], lead: "pluck",  groove: 2, bass: [0, 4, 8, 12], arp: [2, 10] },
    "ga-me-ban-trung":  { bpm: 98,  root: 62, sc: "maj", prog: [0, 3, 0, 4, 5, 3, 0, 4], lead: "bell",   groove: 0, bass: [0, 8], arp: [0, 4, 8, 12] },
    "gia-cho-viet":     { bpm: 106, root: 60, sc: "mix", prog: [0, 3, 4, 3, 0, 3, 6, 4], lead: "pluck",  groove: 1, bass: [0, 6, 8], arp: [2, 6, 10, 14] },
    "me-cung-truyen-tay":{ bpm: 88, root: 57, sc: "dor", prog: [0, 6, 3, 4, 0, 6, 5, 4], lead: "flute",  groove: 0, bass: [0, 10], arp: [0, 3, 6, 9, 12] },
    "xe-ca-phe":        { bpm: 82,  root: 58, sc: "dor", prog: [0, 3, 0, 3, 5, 4, 0, 4], lead: "marimba",groove: 1, bass: [0, 7, 10], arp: [0, 6, 12] },
    "xin-nghi":         { bpm: 94,  root: 60, sc: "min", prog: [0, 3, 5, 4, 0, 3, 6, 4], lead: "bell",   groove: 1, bass: [0, 8], arp: [0, 4, 8, 12] },
    "be-dau-bo-me":     { bpm: 118, root: 62, sc: "maj", prog: [0, 4, 5, 3, 0, 4, 1, 4], lead: "marimba",groove: 2, bass: [0, 4, 8, 12], arp: [2, 6, 10, 14] },
    "be-noi-dung-khong":{ bpm: 102, root: 64, sc: "pen", prog: [0, 3, 4, 3, 0, 5, 3, 4], lead: "bell",   groove: 1, bass: [0, 8], arp: [0, 4, 8, 12] },
    "bo-me-5-giay":     { bpm: 124, root: 60, sc: "maj", prog: [0, 5, 3, 4, 0, 5, 3, 0], lead: "pluck",  groove: 2, bass: [0, 4, 8, 12], arp: [2, 6, 10, 14] },
    "con-vat-an-so":    { bpm: 110, root: 62, sc: "maj", prog: [0, 3, 0, 4, 0, 3, 4, 0], lead: "marimba",groove: 1, bass: [0, 6, 8], arp: [0, 4, 8, 12] },
    "doan-tuoi-nao":    { bpm: 96,  root: 65, sc: "lyd", prog: [0, 4, 1, 4, 0, 5, 1, 4], lead: "bell",   groove: 0, bass: [0, 8], arp: [0, 4, 8, 12] },
    "lang-cua-be":      { bpm: 86,  root: 60, sc: "pen", prog: [0, 3, 0, 4, 0, 3, 1, 0], lead: "flute",  groove: 0, bass: [0, 8], arp: [0, 3, 6, 9, 12] },
    "nhay-theo-so":     { bpm: 126, root: 64, sc: "maj", prog: [0, 4, 5, 3, 0, 4, 5, 4], lead: "square", groove: 2, bass: [0, 4, 8, 12], arp: [2, 6, 10, 14] },
    "pop-fly":          { bpm: 108, root: 67, sc: "lyd", prog: [0, 1, 4, 0, 0, 1, 5, 4], lead: "flute",  groove: 1, bass: [0, 8], arp: [0, 4, 8, 12] },
    "qua-song":         { bpm: 92,  root: 57, sc: "mix", prog: [0, 3, 4, 3, 0, 3, 4, 0], lead: "pluck",  groove: 0, bass: [0, 8], arp: [0, 6, 12] },
    "ten-lua-cua-be":   { bpm: 122, root: 62, sc: "mix", prog: [0, 6, 3, 4, 0, 6, 3, 0], lead: "square", groove: 2, bass: [0, 4, 8, 12], arp: [2, 6, 10, 14] },
    "thap-vong-mau":    { bpm: 100, root: 60, sc: "pen", prog: [0, 2, 3, 4, 0, 2, 3, 0], lead: "marimba",groove: 1, bass: [0, 8], arp: [0, 4, 8, 12] },
    "ve-chu-quai-vat":  { bpm: 104, root: 59, sc: "dor", prog: [0, 6, 3, 4, 0, 6, 5, 4], lead: "pluck",  groove: 1, bass: [0, 6, 8, 14], arp: [2, 6, 10, 14] }
  };
  var S = SPEC[ID];
  if (!S) { var h = 0; for (var i = 0; i < ID.length; i++) h = (h * 31 + ID.charCodeAt(i)) | 0; h = Math.abs(h); S = { bpm: 90 + h % 30, root: 55 + h % 10, sc: ["maj", "pen", "dor", "mix"][h % 4], prog: [0, 3, 4, 3, 0, 5, 3, 4], lead: ["bell", "pluck", "marimba", "flute"][h % 4], groove: 1, bass: [0, 8], arp: [0, 4, 8, 12] }; }

  /* hạt giống ổn định theo id */
  var seed = 7; for (var k = 0; k < ID.length; k++) seed = (seed * 131 + ID.charCodeAt(k)) >>> 0;
  function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }

  var scale = SC[S.sc], L = scale.length;
  function deg(d) { var o = Math.floor(d / L), i = ((d % L) + L) % L; return S.root + scale[i] + 12 * o + (S.sc === "pen" && i >= 5 ? 0 : 0); }
  function chord(d) { return [deg(d), deg(d + 2), deg(d + 4)]; }
  var hz = function (n) { return 440 * Math.pow(2, (n - 69) / 12); };

  /* giai điệu: 8 ô nhịp × 16 bước, sinh sẵn một lần (bậc trong âm giai; null = nghỉ) */
  var RH = [[0, 4, 8, 12], [0, 3, 6, 10, 12], [0, 2, 4, 8, 11, 14], [0, 6, 8, 12, 14], [2, 6, 8, 12], [0, 4, 6, 8, 12, 14]];
  var mel = [], cur = 7 + 2;
  for (var b = 0; b < 8; b++) {
    var row = new Array(16), rh = RH[Math.floor(rnd() * RH.length)], ch = S.prog[b];
    if (b % 4 === 3 && rnd() < .6) rh = [0, 4, 8];   /* cuối câu: thưa, kết ở bậc hợp âm */
    for (var r = 0; r < rh.length; r++) {
      var st = rnd(), tgt = ch + [0, 2, 4][Math.floor(rnd() * 3)] + 7;
      if (r === 0) cur = tgt; else cur += st < .45 ? -1 : st < .85 ? 1 : (rnd() < .5 ? -2 : 2);
      if (cur < 4) cur += 2; if (cur > 15) cur -= 2;
      row[rh[r]] = cur;
    }
    if (b % 4 === 3) row[rh[rh.length - 1]] = ch + 7 + (rnd() < .5 ? 0 : 2);
    mel.push(row);
  }

  var ctx = null, master = null, pend = false, stepT = 0, step = 0, timer = 0, noise = null, level = 1;
  var VOL = .26;
  function mk() {
    if (ctx) return ctx;
    try { ctx = new A(); } catch (e) { return null; }
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    var n = ctx.sampleRate | 0, nb = ctx.createBuffer(1, n, ctx.sampleRate), d = nb.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; noise = nb;
    return ctx;
  }
  function env(g, t, a, hold, rel, peak) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setValueAtTime(peak, t + a + hold); g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + rel); }
  function tone(f, t, dur, type, peak, a, rel, detune, dest) {
    var o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f; if (detune) o.detune.value = detune;
    env(g, t, a, Math.max(0.01, dur - a), rel, peak); o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + dur + rel + .05);
  }
  function lead(f, t, dur, peak) {
    var k = S.lead;
    if (k === "bell") { tone(f, t, dur, "sine", peak, .004, .5, 0); tone(f * 2.01, t, dur * .5, "sine", peak * .35, .003, .3, 0); tone(f * 3.99, t, .1, "sine", peak * .12, .002, .15, 0); }
    else if (k === "pluck") { tone(f, t, dur * .6, "triangle", peak, .004, .22, 0); tone(f * 2, t, .08, "sine", peak * .25, .002, .1, 0); }
    else if (k === "marimba") { tone(f, t, .12, "sine", peak * 1.1, .002, .28, 0); tone(f * 4, t, .04, "sine", peak * .25, .001, .06, 0); }
    else if (k === "flute") { var o = ctx.createOscillator(), g = ctx.createGain(), lf = ctx.createOscillator(), lg = ctx.createGain(); o.type = "sine"; o.frequency.value = f; lf.frequency.value = 5; lg.gain.value = f * .006; lf.connect(lg); lg.connect(o.frequency); env(g, t, .06, Math.max(.05, dur - .06), .25, peak * .9); o.connect(g); g.connect(master); o.start(t); lf.start(t); o.stop(t + dur + .35); lf.stop(t + dur + .35); }
    else { tone(f, t, dur * .7, "square", peak * .45, .004, .12, 0); }   /* square = âm 8-bit */
  }
  function bass(f, t, dur) { tone(f, t, dur, "sine", .5, .01, .2, 0); tone(f * 2, t, dur * .5, "triangle", .08, .01, .1, 0); }
  function hat(t, v) { var s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter(); s.buffer = noise; f.type = "highpass"; f.frequency.value = 7000; env(g, t, .001, .005, .04, v); s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * .5); s.stop(t + .08); }
  function kick(t) { var o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .12); env(g, t, .002, .02, .14, .45); o.connect(g); g.connect(master); o.start(t); o.stop(t + .22); }

  function sched(i, t) {
    var bar = Math.floor(i / 16) % 8, s = i % 16, ch = S.prog[bar], spb = 60 / S.bpm / 4, v = level;
    if (s === 0) { var c = chord(ch); for (var q = 0; q < 3; q++) tone(hz(c[q] - 12), t, spb * 15, "triangle", .05 * v, .35, .6, q ? 6 : -6); }   /* thảm hợp âm mềm */
    if (S.bass.indexOf(s) >= 0) bass(hz(deg(ch) - 24), t, spb * 3);
    if (S.arp.indexOf(s) >= 0) { var cc = chord(ch), n = cc[(s / 2 + bar) % 3 | 0] + 12; lead(hz(n), t, spb * 2, .07 * v); }
    var mn = mel[bar][s]; if (mn != null) lead(hz(deg(mn)), t, spb * 3, .16 * v);
    if (S.groove >= 1 && s % 4 === 2) hat(t, .05 * v);
    if (S.groove >= 2 && s % 8 === 0) kick(t);
    if (S.groove >= 2 && s % 2 === 1) hat(t, .025 * v);
  }
  function tick() {
    if (!ctx || ctx.state !== "running") return;
    var spb = 60 / S.bpm / 4;
    if (stepT < ctx.currentTime - .2) stepT = ctx.currentTime + .05;   /* tab bị treo lâu → không dồn nốt */
    while (stepT < ctx.currentTime + .25) { sched(step, stepT); stepT += spb; step++; }
  }
  function ensureRun() { if (!timer) timer = setInterval(tick, 100); }
  function setLevel() {
    var scr = ""; try { var p = document.getElementById("play"); scr = p ? (p.getAttribute("data-scr") || "") : ""; } catch (e) {}
    level = (scr === "home" || scr === "" || scr === "start" || scr === "menu") ? 1 : .6;
    if (master && ctx) { try { master.gain.setTargetAtTime(VOL * (level === 1 ? 1 : .75), ctx.currentTime, .6); } catch (e) {} }
  }
  function fade() { if (master && ctx) try { master.gain.setTargetAtTime(VOL, ctx.currentTime, .8); } catch (e) {} }

  function start() {
    if (!mk()) return;
    ensureRun();
    var p; try { p = ctx.resume(); } catch (e) {}
    var check = function () {
      if (ctx.state === "running") { if (pend) { pend = false; try { NPAudio.pend(false); } catch (e) {} } fade(); setLevel(); }
    };
    if (p && p.then) p.then(check, function () {}); setTimeout(check, 120);
  }
  var wasOn = true;
  function off() { try { return !(window.NPAudio ? window.NPAudio.get() || pend : true); } catch (e) { return false; } }
  function gesture(e) {
    if (!ctx) return;
    var sp = null; try { sp = e.target && e.target.closest && e.target.closest("#bSnd,#soundBtn,.snd,[data-r=snd],[data-rr=snd]"); } catch (x) {}
    if (pend && e.type === "click" && sp) { e.preventDefault(); e.stopImmediatePropagation(); }   /* nút loa đang hiện TẮT chỉ vì chờ cử chỉ: chạm = BẬT, không đảo thành tắt */
    var o; try { o = localStorage.getItem("np-sound") === "0"; } catch (x) { o = false; }
    if (o) return;
    start();
  }
  function boot() {
    var muted = false; try { muted = localStorage.getItem("np-sound") === "0"; } catch (e) {}
    if (!mk()) return;
    ensureRun();
    if (muted) { try { ctx.suspend(); } catch (e) {} }
    else {
      var p; try { p = ctx.resume(); } catch (e) {}
      setTimeout(function () {
        if (ctx.state !== "running" && !muted) { pend = true; try { window.NPAudio && NPAudio.pend(true); } catch (e) {} }
        else { fade(); }
      }, 350);
    }
    setInterval(setLevel, 800);
    ["pointerdown", "touchend", "click", "keydown"].forEach(function (t) { addEventListener(t, gesture, { capture: true, passive: false }); });
    /* bật lại loa (np-sound "0" → "1") hoặc quay lại tab: bridge.js resume ctx; nối lại nhịp */
    document.addEventListener("visibilitychange", function () { if (!document.hidden && ctx && ctx.state === "running") { stepT = 0; } });
    setInterval(function () { if (ctx && ctx.state === "running" && master && master.gain.value < .01) fade(); }, 1500);
  }
  window.NPMusic = { id: ID, spec: S, state: function () { return ctx ? ctx.state : "none"; }, pending: function () { return pend; },
    peak: function () { if (!ctx || !master) return -1; if (!window.__an) { window.__an = ctx.createAnalyser(); window.__an.fftSize = 1024; master.connect(window.__an); } var d = new Float32Array(1024); window.__an.getFloatTimeDomainData(d); var m = 0; for (var i = 0; i < d.length; i++) m = Math.max(m, Math.abs(d[i])); return m; } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
