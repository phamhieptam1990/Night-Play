/* Âm nền nhẹ cho Lớp học truyện (WebAudio tổng hợp, không tệp). window.StorySfxAmb.start(ctx, out, subj) / stop().
   toan = sóng biển + chuông gió; tviet = gió rừng + chim lác đác; tanh = sóng cảng + hải âu xa. Âm lượng rất nhỏ. */
(function(){
  let cur = null, timer = 0;
  function noise(ctx){
    const len = ctx.sampleRate * 3, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let l = 0; for(let i = 0; i < len; i++){ const w = Math.random() * 2 - 1; l = (l + .04 * w) / 1.04; d[i] = l * 3.2; }
    const s = ctx.createBufferSource(); s.buffer = b; s.loop = true; return s;
  }
  /* một lớp ồn lọc thấp, âm lượng dâng hạ chậm như sóng/gió */
  function bed(ctx, out, freq, rate, depth, level){
    const n = noise(ctx), f = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
    f.type = "lowpass"; f.frequency.value = freq; g.gain.value = level;
    lfo.frequency.value = rate; lg.gain.value = level * depth; lfo.connect(lg); lg.connect(g.gain);
    n.connect(f); f.connect(g); g.connect(out); n.start(); lfo.start();
    return [n, lfo];
  }
  function blip(ctx, out, f0, f1, dur, vol, type){
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
  }
  const PENTA = [784, 880, 1047, 1175, 1319, 1568];
  const RECIPES = {
    toan: (ctx, out) => ({ src: bed(ctx, out, 520, .11, .55, .05),
      tick: () => { const f = PENTA[Math.floor(Math.random() * PENTA.length)]; blip(ctx, out, f, f * .995, 1.1, .018, "sine"); }, every: [4000, 8000] }),
    tviet: (ctx, out) => ({ src: bed(ctx, out, 380, .07, .7, .04),
      tick: () => { const f = 2200 + Math.random() * 700; blip(ctx, out, f, f * 1.25, .12, .016); setTimeout(() => { try{ blip(ctx, out, f * 1.2, f * 1.5, .1, .012); }catch(e){} }, 150); }, every: [3500, 7500] }),
    tanh: (ctx, out) => ({ src: bed(ctx, out, 460, .09, .6, .055),
      tick: () => { const f = 1500 + Math.random() * 300; blip(ctx, out, f, f * .7, .5, .008, "triangle"); }, every: [6000, 11000] })
  };
  function stop(){
    clearTimeout(timer); timer = 0; const c = cur; cur = null; if(!c) return;
    try{ const t = c.ctx.currentTime; c.bus.gain.cancelScheduledValues(t); c.bus.gain.setValueAtTime(c.bus.gain.value, t); c.bus.gain.linearRampToValueAtTime(0, t + .5); }catch(e){}
    setTimeout(() => { try{ c.r.src.forEach(s => s.stop()); c.bus.disconnect(); }catch(e){} }, 700);
  }
  function start(ctx, out, subj){
    stop(); const mk = RECIPES[subj]; if(!mk) return;
    const bus = ctx.createGain(); bus.gain.setValueAtTime(0, ctx.currentTime); bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5); bus.connect(out);
    const r = mk(ctx, bus); cur = { ctx, bus, r, subj };
    const loop = () => { if(!cur || cur.r !== r) return; if(!document.hidden && ctx.state === "running"){ try{ r.tick(); }catch(e){} }
      timer = setTimeout(loop, r.every[0] + Math.random() * (r.every[1] - r.every[0])); };
    timer = setTimeout(loop, 1800);
  }
  window.StorySfxAmb = { start, stop, current: () => cur && cur.subj, _count: () => cur ? cur.r.src.length : 0 };
})();
