"use strict";
/* PopQ — bộ khung dùng chung cho game Pop kiểu "hỏi - đáp nhanh" (Mê Cung Toán Nhanh, Đoán Quốc Gia…).
   core.js: tiện ích (DOM, localStorage, ngôn ngữ, ngẫu nhiên theo hạt giống, ngày), âm thanh, toast. Game khai báo cấu hình trong window.Q (xem run.js). */
const $ = id => document.getElementById(id);
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
let LANG = (() => {
  const q = new URLSearchParams(location.search).get("lang"); if (q === "vi" || q === "en") return q;
  try { const s = localStorage.getItem("lang"); if (s === "vi" || s === "en") return s; } catch (e) {}
  return /^vi/i.test(navigator.language || "") ? "vi" : "en";
})();
const MR = Math.random;
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let RNG = Math.random;
const rand = (a, b) => a + Math.floor(RNG() * (b - a + 1));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(RNG() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(RNG() * a.length)];
const today = () => new Date(Date.now() + 252e5).toISOString().slice(0, 10);
const dayBefore = k => { const [y, m, d] = k.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10); };
const b64e = o => btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
/* chữ hiển thị: Q.dict = {vi:{...}, en:{...}}; {x} được thay bằng biến */
function T(k, v) {
  const d = (Q.dict[LANG] || {}), c = (Q.common[LANG] || {});
  let s = d[k] != null ? d[k] : c[k] != null ? c[k] : (Q.dict.vi[k] != null ? Q.dict.vi[k] : k);
  if (typeof s === "string" && v) s = s.replace(/\{(\w+)\}/g, (m, n) => v[n] != null ? v[n] : m);
  return s;
}
/* âm thanh (WebAudio qua NPAudio của bridge.js) */
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
  pick: () => tone(620, .07, "triangle", .09), ok: () => { tone(520, .08, "triangle", .1); tone(780, .1, "triangle", .08, .06); },
  no: () => tone(200, .25, "sine", .12), hint: () => tone(880, .12, "triangle", .1), step: () => tone(330, .05, "square", .04),
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
