"use strict";
/* Sudoku Con Vật — âm thanh (WebAudio qua NPAudio của bridge.js), đọc to, thông báo nhỏ (toast). */
let sound = !(window.NPAudio && !NPAudio.get()), ac = null, paused = false;
function audio() {
  if (!sound) return null;
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state !== "running") ac.resume(); return ac; } catch (e) { return null; }
}
function tone(f, d, ty, v, dl) {
  const c = audio(); if (!c) return;
  const t0 = c.currentTime + (dl || 0), o = c.createOscillator(), g = c.createGain();
  o.type = ty || "sine"; o.frequency.value = f; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v || .1, t0 + .02);
  g.gain.exponentialRampToValueAtTime(.0001, t0 + d); o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + d + .05);
}
const sfx = {
  pick: () => tone(620, .07, "triangle", .09), put: () => { tone(520, .08, "triangle", .1); tone(780, .1, "triangle", .08, .06); },
  no: () => tone(200, .25, "sine", .12), hint: () => tone(880, .12, "triangle", .1),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .2, "triangle", .12, i * .1)),
  combo: n => { const b = 440 * Math.pow(1.122, Math.min(n, 8)); [0, 1, 2].forEach(i => tone(b * (1 + i * .25), .12, "triangle", .1, i * .06)); }
};
function say(text) {
  if (!sound || !window.speechSynthesis || !text) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = LANG === "vi" ? "vi-VN" : "en-US"; u.rate = .9; u.pitch = 1.15; speechSynthesis.speak(u); } catch (e) {}
}
let toastT = 0;
function toast(m, ms, k) {
  const e = $("toast"), ic = { warn: "⚠️", hint: "💡", info: "ℹ️" }[k || "info"];
  e.className = "toast " + (k || "info"); e.innerHTML = "";
  const i = document.createElement("i"); i.textContent = ic; const s = document.createElement("span"); s.textContent = m; e.append(i, s);
  e.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove("on"), ms || 1600);
}
