/* NHẠC NỀN cho chế độ Phím rơi (HouseBacking): trống (kick/snare/hat) + bass + pad hợp âm, tổng hợp bằng Web Audio, tự chọn hợp âm (Đô/Fa/Sol/La thứ) theo nốt của từng ô nhịp.
   HouseBacking.start(song, beatMs, leadBeats, delayMs) · HouseBacking.stop(fadeMs). Không có giai điệu (giai điệu do bé tự bấm). Tôn trọng nút loa của PlaySound. */
(function (root) {
  "use strict";
  var CH = [{ r: 48, iv: [0, 4, 7] }, { r: 53, iv: [0, 4, 7] }, { r: 55, iv: [0, 4, 7] }, { r: 57, iv: [0, 3, 7] }];   /* Đô · Fa · Sol · La thứ */
  var timer = 0, bus = null, S = null, noise = null;
  function pcs(c) { return c.iv.map(function (i) { return (c.r + i) % 12; }); }
  /* hợp âm cho từng ô nhịp: chọn hợp âm chứa nhiều nốt (theo độ dài) nhất; ô trống giữ hợp âm trước */
  function chords(song, bar) {
    var total = song.n.reduce(function (a, n) { return a + n[1]; }, 0), nb = Math.ceil(total / bar) + 1, w = [], t = 0, i, k, out = [], prev = 0;
    for (i = 0; i < nb; i++) w.push([0, 0, 0, 0]);
    song.n.forEach(function (n) { var b = Math.floor(t / bar + 1e-6); if (w[b]) CH.forEach(function (c, ci) { if (pcs(c).indexOf(n[0] % 12) >= 0) w[b][ci] += n[1] * (t % bar < 1e-6 ? 1.5 : 1); }); t += n[1]; });
    for (i = 0; i < nb; i++) { var best = prev, bv = 0; for (k = 0; k < 4; k++) if (w[i][k] > bv + (k === prev ? -.01 : 0)) { bv = w[i][k]; best = k; } out.push(best); prev = best; }
    return out;
  }
  function nbuf(c) { if (noise) return noise; noise = c.createBuffer(1, c.sampleRate, c.sampleRate); var d = noise.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return noise; }
  function env(c, t, a, len, v) { var g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0005, t + len); g.connect(bus); return g; }
  function osc(c, type, f, t, len, g) { var o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.connect(g); o.start(t); o.stop(t + len + .05); return o; }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function kick(c, t, v) { var g = env(c, t, .003, .26, .9 * v), o = osc(c, "sine", 150, t, .26, g); o.frequency.exponentialRampToValueAtTime(42, t + .12); }
  function noiseHit(c, t, len, v, type, f) {
    var s = c.createBufferSource(); s.buffer = nbuf(c); var fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; var g = env(c, t, .002, len, v); s.connect(fl); fl.connect(g); s.start(t, Math.random() * .5); s.stop(t + len + .05);
  }
  function bass(c, t, m, len, v) { var g = env(c, t, .01, len, v), o = osc(c, "triangle", hz(m), t, len, g); o.detune.value = 0; }
  function pad(c, t, ms, len, v) {
    ms.forEach(function (m) { var g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .25); g.gain.linearRampToValueAtTime(v * .7, t + len * .7); g.gain.linearRampToValueAtTime(0, t + len); g.connect(bus); osc(c, "triangle", hz(m), t, len, g); osc(c, "sine", hz(m + 12), t, len, g); });
  }
  function step() {
    if (!S) return; var c = S.c; if (root.PlaySound && !PlaySound.on()) { S.s = Math.max(S.s, Math.ceil((c.currentTime - S.t0) / S.half)); return; }
    while (S.t0 + S.s * S.half < c.currentTime + .35) {
      var s = S.s++, t = S.t0 + s * S.half, gb = s / 2, rel = gb - S.lead, ob = Math.floor(rel / S.bar + 1e-6), bi = ((rel % S.bar) + S.bar) % S.bar, on = s % 2 === 0, lead = ob < 0;
      var ch = CH[S.ch[Math.max(0, ob)] || 0], root3 = ch.r;
      if (on && S.bar === 4) { if (bi === 0 || bi === 2) kick(c, t, lead ? .7 : 1); if (bi === 1 || bi === 3) { if (!lead) noiseHit(c, t, .14, .22, "bandpass", 1900); } }
      if (on && S.bar === 3) { if (bi === 0) kick(c, t, 1); else if (!lead) noiseHit(c, t, .1, .13, "bandpass", 2200); }
      noiseHit(c, t, .045, on ? .06 : .1, "highpass", 7500);
      if (!lead) {
        if (on && bi === 0) { bass(c, t, root3, S.half * 3, .3); pad(c, t, ch.iv.map(function (i) { return root3 + 12 + i; }), S.half * 2 * S.bar, .05); }
        if (on && bi === (S.bar === 4 ? 2 : 1)) bass(c, t, root3 + 7, S.half * 1.6, .22);
        if (!on && bi === (S.bar === 4 ? 1.5 : 1.5)) bass(c, t, root3 + 12, S.half * .9, .14);
      }
      if (t > S.end) { stop(500); return; }
    }
  }
  function start(song, beatMs, lead, delayMs) {
    stop(0); var c = root.HouseAudio && HouseAudio.ctx(); if (!c) return; var bar = song.bar || 4, bs = beatMs / 1000, total = song.n.reduce(function (a, n) { return a + n[1]; }, 0);
    bus = c.createGain(); bus.gain.value = .85; bus.connect(HouseAudio.out());
    S = { c: c, t0: c.currentTime + (delayMs || 0) / 1000, half: bs / 2, s: 0, lead: lead, bar: bar, ch: chords(song, bar), end: c.currentTime + (delayMs || 0) / 1000 + (lead + total + bar) * bs };
    timer = setInterval(step, 90); step();
  }
  function stop(fade) {
    clearInterval(timer); timer = 0; S = null; var b = bus; bus = null; if (!b) return;
    try { var c = b.context, t = c.currentTime; b.gain.cancelScheduledValues(t); b.gain.setValueAtTime(b.gain.value, t); b.gain.linearRampToValueAtTime(0, t + (fade || 60) / 1000 + .02); setTimeout(function () { try { b.disconnect(); } catch (e) {} }, (fade || 60) + 400); } catch (e) {}
  }
  root.HouseBacking = { start: start, stop: stop, chords: chords };
})(window);
