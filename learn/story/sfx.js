/* Âm thanh Lớp học truyện (WebAudio tổng hợp, không tệp). API: StorySfx.play(name), ambient(subj|null), muted(), setMuted(b).
   Nạp sau js/sfx-ambient.js. Tắt tiếng dùng chung: khoá "learn:music" ("0" = tắt, nút 🎶 trong menu ⋯ Học Vui) và "np-sound" ("0") / NPAudio nếu có. */
(function(){
  let AC = null, OUT = null, want = null, userDid = false;
  const LS = (k, v) => { try{ if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){} return null; };
  function muted(){
    try{ if(window.NPAudio && ((NPAudio.muted && NPAudio.muted()) || (NPAudio.get && !NPAudio.get()))) return true; }catch(e){}
    return LS("learn:music") === "0" || LS("np-sound") === "0";
  }
  function setMuted(b){
    LS("learn:music", b ? "0" : "1"); if(!b && LS("np-sound") === "0") LS("np-sound", "1");
    try{ if(window.NPAudio && NPAudio.set) NPAudio.set(!b); }catch(e){}
    try{ const m = document.getElementById("mMusic"); if(m){ m.setAttribute("aria-pressed", String(!b)); m.style.opacity = b ? ".45" : "1"; } }catch(e){}
    refresh();
  }
  function ctx(){
    if(!userDid) return null;
    if(!AC){ try{
      AC = new (window.AudioContext || window.webkitAudioContext)();
      const comp = AC.createDynamicsCompressor(); OUT = AC.createGain(); OUT.gain.value = .85; OUT.connect(comp); comp.connect(AC.destination);
    }catch(e){ return null; } }
    if(AC.state === "suspended"){ try{ AC.resume(); }catch(e){} }
    return AC;
  }
  /* một nốt: sine/triangle, vào mượt, tắt mượt */
  function note(f, t0, dur, vol, type, glideTo){
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + t0;
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if(glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(OUT); o.start(t); o.stop(t + dur + .05);
  }
  function airy(t0, dur, f0, f1, vol){   /* tiếng vút: nhiễu qua lọc dải, quét tần số */
    const n = AC.sampleRate * dur, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0);
    for(let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(), t = AC.currentTime + t0;
    s.buffer = b; f.type = "bandpass"; f.Q.value = 1.2; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * .35); g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(f); f.connect(g); g.connect(OUT); s.start(t); s.stop(t + dur + .02);
  }
  const SND = {
    tap:   () => note(900, 0, .07, .13, "sine", 620),
    pick:  () => { note(520, 0, .1, .16, "triangle", 700); note(1040, .05, .12, .08, "sine"); },
    good:  () => { note(659, 0, .3, .17, "sine"); note(784, .1, .3, .17, "sine"); note(1047, .2, .55, .18, "sine"); note(2094, .2, .3, .03, "sine"); },
    oops:  () => { note(392, 0, .28, .13, "triangle", 350); note(330, .17, .45, .12, "triangle", 300); },
    win:   () => { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => note(f, i * .11, i === 6 ? .6 : .22, .15, i % 2 ? "triangle" : "sine")); note(1568, .66, .4, .04, "sine"); },
    step:  () => { note(330, 0, .11, .14, "triangle", 300); note(392, .08, .13, .12, "triangle", 360); },
    pop:   () => { note(500, 0, .12, .18, "sine", 1200); note(1800, .02, .08, .05, "sine", 900); },
    whoosh:() => airy(0, .5, 500, 2400, .09),
    star:  () => { [1319, 1568, 2093].forEach((f, i) => note(f, i * .07, .38, .09, "sine")); }
  };
  function play(name){
    if(muted() || !SND[name]) return false;
    const c = ctx(); if(!c) return false;
    try{ SND[name](); return true; }catch(e){ return false; }
  }
  function refresh(){
    const A = window.StorySfxAmb; if(!A) return;
    const c = (want && !muted() && !document.hidden) ? ctx() : null;
    if(!c){ A.stop(); return; }
    if(A.current() !== want) A.start(c, OUT, want);
  }
  function ambient(subj){ want = subj || null; refresh(); }
  /* mở AudioContext chỉ sau cử chỉ người dùng */
  function gesture(){ userDid = true; if(AC && AC.state === "suspended") try{ AC.resume(); }catch(e){} refresh(); }
  ["pointerdown", "touchend", "click", "keydown"].forEach(ev => addEventListener(ev, gesture, { capture: true, passive: true }));
  document.addEventListener("visibilitychange", () => { if(document.hidden){
    if(window.StorySfxAmb) StorySfxAmb.stop();
    try{ if(AC && AC.state === "running") AC.suspend(); }catch(e){} } else { if(AC) try{ AC.resume(); }catch(e){} refresh(); } });
  addEventListener("pagehide", () => { if(window.StorySfxAmb) StorySfxAmb.stop(); });
  addEventListener("storage", e => { if(e.key === "learn:music" || e.key === "np-sound") refresh(); });
  window.StorySfx = { play, ambient, muted, setMuted, names: Object.keys(SND), _ctx: () => AC };
})();
