function noise(t0, dur, gain, freq){
  try{ const n = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0); for(let i = 0; i < n;
    i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    const src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); src.buffer = buf; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = .8;
      g.gain.value = gain * 1.1; src.connect(f); f.connect(g); g.connect(AC.destination); src.start(t0); }catch(e){}
}
function cheerSound(level){
  try{
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if(AC.state === "suspended") AC.resume();
    const now = AC.currentTime, N = { c5: 523, e5: 659, g5: 784, c6: 1047, e6: 1319, g4: 392, g6: 1568 };
    const seq = level === 1 ? [[N.c5, 0], [N.e5, .08], [N.g5, .16]] : level === 2 ? [[N.c5, 0], [N.e5, .07], [N.g5, .14], [N.c6, .21], [N.e6, .3]] : [[N.g4, 0], [N.c5, .12], [N.e5,
      .24], [N.g5, .36], [N.c6, .5], [N.e6, .66], [N.g6, .8]];
    seq.forEach(([f, d], i) => { const o = AC.createOscillator(), g = AC.createGain(), last = i === seq.length - 1, dur = last ? (level === 3 ? .9 : .4) : .16;
      o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(0, now + d); g.gain.linearRampToValueAtTime(.22, now + d + .01); g.gain.exponentialRampToValueAtTime(.0001, now + d + dur);
      o.connect(g); g.connect(AC.destination); o.start(now + d); o.stop(now + d + dur + .02); });
    if(level >= 2){ const claps = level === 3 ? 9 : 4; for(let i = 0; i < claps; i++) noise(now + .15 + i * (level === 3 ? .11 : .09) + Math.random() * .04, .09, .35, 1800 + Math.random() * 2500); }
  }catch(e){}
}
function confetti(n, x, y, spread){
  const cols = ["#FFC94A", "#FF6B8A", "#4FD1C5", "#7C5CFF", "#65C878", "#55B9E8"];
  for(let i = 0; i < n; i++){ const e = document.createElement("span"); e.className = "cf"; const a = Math.random() * Math.PI * 2, d = spread * (.4 + Math.random() * .8);
    e.style.setProperty("--x", x + "px"); e.style.setProperty("--y", y + "px"); e.style.setProperty("--c", cols[i % cols.length]);
      e.style.setProperty("--dx", Math.cos(a) * d + "px"); e.style.setProperty("--dy", (Math.sin(a) * d - 60 + Math.random() * 220) + "px");
      e.style.setProperty("--r", rnd(-540, 540) + "deg"); e.style.setProperty("--t", (1.1 + Math.random() * .8) + "s");
    document.body.appendChild(e); setTimeout(() => e.remove(), 2100); }
}
function cheer(level, btn, text){
  cheerSound(level);
  const r = btn ? btn.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  confetti(level === 1 ? 14 : level === 2 ? 34 : 60, r.left + r.width / 2, r.top + r.height / 2, level === 1 ? 120 : level === 2 ? 190 : 260);
  if(level === 3) confetti(30, innerWidth * .15, 80, 160), confetti(30, innerWidth * .85, 80, 160);
  if(text){ const c = document.createElement("div"); c.className = "cheer"; c.textContent = text; document.body.appendChild(c); setTimeout(() => c.remove(), 1250); }
}
