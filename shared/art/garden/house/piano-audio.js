/* Âm đàn piano tổng hợp (Web Audio, không tệp âm thanh): 3 sóng hài + tắt dần như dây đàn. HouseAudio.note(midi, dur) · HouseAudio.stop(). Offline, nhẹ. */
(function (root) {
  "use strict";
  var AC = null, master = null, live = [];
  function ctx() {
    if (!AC) { try { AC = new (root.AudioContext || root.webkitAudioContext)(); master = AC.createGain(); master.gain.value = .8; master.connect(AC.destination); } catch (e) { return null; } }
    if (AC.state === "suspended") { try { AC.resume(); } catch (e) {} }
    return AC;
  }
  function freq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  /* một nốt: nhấn nhanh (attack 8ms), tắt dần theo độ cao (nốt cao tắt nhanh hơn) */
  function note(midi, dur, vol) {
    if (root.PlaySound && !PlaySound.on()) return; var c = ctx(); if (!c) return; var t = c.currentTime, f = freq(midi), len = Math.max(.5, Math.min(2.4, (dur || 1.2) * 1.3)) * (midi > 76 ? .7 : 1);
    var g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || .5, t + .008); g.gain.exponentialRampToValueAtTime(.0008, t + len); g.connect(master);
    [[1, "triangle", 1], [2, "sine", .35], [3, "sine", .12]].forEach(function (h) {
      var o = c.createOscillator(), hg = c.createGain(); o.type = h[1]; o.frequency.value = f * h[0]; hg.gain.value = h[2]; o.connect(hg); hg.connect(g); o.start(t); o.stop(t + len + .05); live.push(o);
    });
    if (live.length > 60) live = live.slice(-30);
  }
  function stop() { live.forEach(function (o) { try { o.stop(); } catch (e) {} }); live = []; }
  root.HouseAudio = { note: note, stop: stop, ctx: ctx, out: function () { ctx(); return master; } };
})(window);
