/* ÂM THANH AO CÁ: màn bật loa khi vào + nút 🔊 trên thanh trên + nhạc nền êm (ngũ cung chậm, PlayMusic) + tiếng bong bóng nước thỉnh thoảng nổi lên.
   Tôn trọng PlaySound (tắt loa → im lặng). Cần: play-sound.js, play-music.js. */
(function () {
  "use strict";
  if (!window.PlaySound || !window.PlayMusic) return;
  var hud = document.querySelector(".hud2"), lv = document.getElementById("lvb"), AC = null, bt = 0;
  if (hud) { var b = PlaySound.button(null, "pond-snd"); hud.insertBefore(b, lv || null); }
  function ctx() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } } if (AC.state === "suspended") { try { AC.resume(); } catch (e) {} } return AC; }
  function blub() {   /* "bloop" nhỏ: sóng sin quét lên 280 → 620Hz, rất nhẹ */
    if (!PlaySound.on() || document.hidden) return; var c = ctx(); if (!c) return; var t = c.currentTime, o = c.createOscillator(), g = c.createGain(), f = 260 + Math.random() * 120;
    o.type = "sine"; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 2.2, t + .09); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.035, t + .015); g.gain.exponentialRampToValueAtTime(.0005, t + .16);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .2);
  }
  function loop() { blub(); bt = setTimeout(loop, 2500 + Math.random() * 4500); }
  function start() { PlayMusic.start({ root: 62, step: .95, wave: "sine", vol: .04 }); clearTimeout(bt); bt = setTimeout(loop, 1500); }
  PlaySound.gate({ title: "Ao cá", emoji: "🐟", back: "../../../learn/garden/", start: function () { ctx(); start(); } });   /* start chạy ngay trong cú chạm để trình duyệt cho phát tiếng */
  addEventListener("pagehide", function () { PlayMusic.stop(); clearTimeout(bt); });
})();
