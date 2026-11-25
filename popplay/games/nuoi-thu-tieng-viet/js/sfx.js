/* ÂM THANH (WebAudio, tạo sau cử chỉ; bridge.js bọc AudioContext + nút loa dùng NPAudio chung). Tiếng ngắn, nhỏ, dịu. */
window.NTVSfx = (function () {
  "use strict";
  var ctx = null;
  function on() { return !(window.NPAudio && !NPAudio.get()); }
  function ac() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (ctx.state !== "running") { try { ctx.resume(); } catch (e) {} }
    return ctx;
  }
  function tone(f, d, type, vol, dl, f2) {
    if (!on()) return; var c = ac(); if (!c) return;
    var t0 = c.currentTime + (dl || 0), o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + d);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol || .1, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
    o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + d + .05);
  }
  var S = {
    tap: function () { tone(520, .08, "triangle", .09, 0, 330); },
    good: function () { tone(660, .12, "triangle", .12); tone(880, .16, "triangle", .12, .09); },
    bad: function () { tone(300, .18, "sine", .08, 0, 220); },
    pop: function () { tone(700, .07, "sine", .08, 0, 1200); },
    chomp: function () { tone(220, .07, "square", .05, 0, 120); tone(220, .07, "square", .05, .22, 120); tone(240, .07, "square", .05, .44, 120); },
    splash: function () { for (var i = 0; i < 3; i++) tone(900 + i * 150, .1, "sine", .04, i * .06, 500); },
    squeak: function () { tone(1100, .12, "triangle", .1, 0, 1500); },
    bark: function () { tone(330, .12, "sawtooth", .07, 0, 200); tone(300, .14, "sawtooth", .07, .17, 180); },
    yawn: function () { tone(300, .7, "sine", .06, 0, 180); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, .2, "triangle", .12, i * .11); }); },
    up: function () { [660, 784, 988, 1319].forEach(function (f, i) { tone(f, .18, "triangle", .12, i * .09); }); }
  };
  return S;
})();
