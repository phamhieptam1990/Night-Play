/* Âm thanh: bíp WebAudio (tôn trọng NPAudio) + khách nói Tiếng Anh bằng speechSynthesis en-US. */
(function () {
  "use strict";
  let ctx = null, sound = !(window.NPAudio && !NPAudio.get()), voice = null;
  TNE.sound = () => sound;
  TNE.setSound = v => { sound = v; if (window.NPAudio) NPAudio.set(v); if (!v) TNE.cancelSpeech(); };
  function ac() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (ctx.state !== "running") try { ctx.resume(); } catch (e) {}
    return ctx;
  }
  function tone(f, d, type, vol, at, to) {
    if (!sound) return; const c = ac(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + (at || 0);
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .12, t + .02); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .05);
  }
  TNE.sfx = {
    pick() { tone(520, .09, "triangle", .1, 0, 760); },
    squeeze() { tone(220, .35, "sawtooth", .07, 0, 90); tone(330, .3, "triangle", .06, .05, 150); },
    pour() { tone(700, .18, "sine", .09, 0, 420); tone(900, .12, "sine", .06, .1, 600); },
    ding() { tone(988, .35, "sine", .14); tone(1319, .5, "sine", .12, .12); },
    oops() { tone(260, .22, "triangle", .1, 0, 190); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, .3, "triangle", .12, i * .12)); },
    step() { tone(680, .07, "triangle", .07, 0, 900); },
    coin() { tone(1175, .1, "square", .05); tone(1568, .2, "square", .05, .08); }
  };
  function pickVoice() {
    try { const vs = speechSynthesis.getVoices(); voice = vs.find(v => /^en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null; } catch (e) {}
  }
  try { pickVoice(); speechSynthesis.addEventListener("voiceschanged", pickVoice); } catch (e) {}
  TNE.cancelSpeech = () => { try { speechSynthesis.cancel(); } catch (e) {} };
  TNE.speak = (text, rate) => {
    if (!sound || !window.speechSynthesis) return false;
    try {
      speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = rate || .85; u.pitch = 1.15; if (voice) u.voice = voice;
      speechSynthesis.speak(u); return true;
    } catch (e) { return false; }
  };
  if (window.NPAudio) { const s0 = NPAudio.silence; NPAudio.silence = function () { TNE.cancelSpeech(); return s0.apply(this, arguments); }; }
})();
