/* âm thanh chạm (WebAudio, rất nhỏ, không cần tệp): "tách" khi chạm, chuông khi đúng, tiếng trầm nhẹ khi sai */
let AC = null;
function sfx(kind){
  try{
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if(AC.state === "suspended") AC.resume();
    const now = AC.currentTime, seq = kind === "ok" ? [[660, 0], [880, .09]] : kind === "no" ? [[220, 0]] : [[1100, 0]];
    seq.forEach(([f, d]) => { const o = AC.createOscillator(), g = AC.createGain(), dur = kind === "tap" ? .05 : .16;
      o.type = kind === "no" ? "triangle" : "sine"; o.frequency.setValueAtTime(f, now + d); if(kind === "tap") o.frequency.exponentialRampToValueAtTime(600, now + d + dur);
      g.gain.setValueAtTime(0, now + d); g.gain.linearRampToValueAtTime(kind === "tap" ? .24 : .2, now + d + .008); g.gain.exponentialRampToValueAtTime(.0001, now + d + dur);
      o.connect(g); g.connect(AC.destination); o.start(now + d); o.stop(now + d + dur + .02); });
  }catch(e){}
}
/* cổ vũ: pháo giấy + chữ cổ vũ + âm thanh (arpeggio vui, tiếng vỗ tay bằng nhiễu) — level 1 đúng, 2 chuỗi đúng, 3 xong lượt tốt */
/* mở khóa âm thanh ở cú chạm đầu tiên (iPhone/Safari chỉ cho phát sau khi bé chạm) */
function unlockAudio(){
  try{ AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if(AC.state === "suspended") AC.resume();
    const b = AC.createBuffer(1, 1, 22050), s = AC.createBufferSource(); s.buffer = b; s.connect(AC.destination); s.start(0); }catch(e){}
}
["pointerdown", "touchstart", "keydown"].forEach(ev => addEventListener(ev, unlockAudio, { once: true, passive: true }));
