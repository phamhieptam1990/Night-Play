/* NHẠC NỀN êm cho các trò chơi (WebAudio tự sinh, không tệp): vài nốt ngũ cung nhẹ, chậm, rất nhỏ. Tự dừng khi bé tắt loa (PlaySound) hoặc ẩn tab, tự phát lại khi bật loa.
   PlayMusic.start({root:60, step:.6, wave:"sine", vol:.05}) · PlayMusic.stop() · cần play-sound.js */
(function (root) {
  "use strict";
  var AC = null, timer = 0, cfg = null, last = 0, PENT = [0, 2, 4, 7, 9, 12, 14];
  function ctx() { if (!AC) { try { AC = new (root.AudioContext || root.webkitAudioContext)(); } catch (e) { return null; } } if (AC.state === "suspended") { try { AC.resume(); } catch (e) {} } return AC; }
  function note(m, d, vol, wave) {
    var c = ctx(); if (!c) return; var t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = wave; o.frequency.value = 440 * Math.pow(2, (m - 69) / 12); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .03); g.gain.exponentialRampToValueAtTime(.0005, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .05);
  }
  function tick() {
    if (!cfg) return; if (root.PlaySound && PlaySound.on() && !document.hidden) {
      last = Math.max(0, Math.min(PENT.length - 1, last + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));   /* đi bộ ngẫu nhiên trên thang: nghe liền mạch, không giật */
      note(cfg.root + PENT[last], cfg.step * 3, cfg.vol, cfg.wave); if (Math.random() < .35) note(cfg.root + PENT[last] + 12, cfg.step * 2, cfg.vol * .5, cfg.wave);
    }
    timer = setTimeout(tick, cfg.step * 1000 * (Math.random() < .25 ? 2 : 1));
  }
  function stop() { clearTimeout(timer); timer = 0; cfg = null; }
  function start(o) { stop(); cfg = { root: (o && o.root) || 60, step: (o && o.step) || .6, wave: (o && o.wave) || "sine", vol: (o && o.vol) || .05 }; ctx(); tick(); }
  document.addEventListener("visibilitychange", function () { if (document.hidden && AC && AC.suspend) try { AC.suspend(); } catch (e) {} else if (cfg) ctx(); });
  root.PlayMusic = { start: start, stop: stop };
})(window);
