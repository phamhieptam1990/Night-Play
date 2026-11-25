"use strict";
/* Sudoku Con Vật — giao diện: mỗi loại 5 (1 "basic" miễn phí + 4 Night Pass tải từ máy chủ qua PF.loadPro). */
const mkv = (sb, pb, sp, si, sa, sa2, rad, bd, sh) => ({
  "--sb": sb, "--pb": pb, "--sp": sp, "--si": si, "--sa": sa, "--sa2": sa2 || "#fff", "--rad": rad || "3cqw",
  "--bd": bd || ".8cqw solid rgba(255,255,255,.9)", "--sh": sh || "0 1cqw 3cqw rgba(0,0,0,.18)"
});
const ANIMALS = ["🐶", "🐱", "🐰", "🐸", "🐻", "🐥"];
const BASIC = [
  { vars: mkv("linear-gradient(#bfe8ff,#e6f6d8)", "#fff", "#fff", "#1f3b57", "#3b82f6"), deco: ["☁️", "🐾"], an: ANIMALS },
  { vars: mkv("linear-gradient(#e6d9ff,#d3e6ff)", "#fff", "#fff", "#3a2a5a", "#8a5cf6"), deco: ["🔷", "🐾"], an: ANIMALS },
  { vars: mkv("linear-gradient(#c9f2ec,#d5f5c8)", "#fff", "#fff", "#14423d", "#12a49a"), deco: ["🌿", "🐾"], an: ANIMALS },
  { vars: mkv("linear-gradient(#ffe3c2,#ffd1e0)", "#fff", "#fff", "#3b2a1d", "#ff5a1f"), deco: ["🎈", "🐾"], an: ANIMALS }
];
const PF = window.PF = {
  pro: null, mkv, skins: BASIC.map(b => ({ basic: b })),
  catalog: [
    [["basic", "linear-gradient(#bfe8ff,#e6f6d8)", "🐶"], ["farm", "linear-gradient(#e8f5c8,#b9e08a)", "🐮"], ["ocean", "linear-gradient(#aef0ff,#3a8fd0)", "🐙"], ["jungle", "linear-gradient(#bfe89a,#3a8a4a)", "🦁"], ["bird", "linear-gradient(#ffe6f4,#9ad8ff)", "🦜"]],
    [["basic", "linear-gradient(#e6d9ff,#d3e6ff)", "🦊"], ["safari", "linear-gradient(#ffe9b0,#e0a458)", "🦒"], ["deep", "linear-gradient(#0a2a5a,#1a6a9a)", "🐳"], ["bugs", "linear-gradient(#ffeaa0,#a8e070)", "🐞"], ["dino", "linear-gradient(#cfe8a0,#6a9a4a)", "🦖"]],
    [["basic", "linear-gradient(#c9f2ec,#d5f5c8)", "🐱"], ["pets", "linear-gradient(#ffe0ec,#ffc2a8)", "🐹"], ["arctic", "linear-gradient(#e0f4ff,#9ac8ee)", "🐧"], ["magic", "linear-gradient(#3a1a6a,#9a3aa0)", "🦄"], ["pond", "linear-gradient(#d0f0c0,#5ac8a8)", "🐸"]],
    [["basic", "linear-gradient(#ffe3c2,#ffd1e0)", "🦁"], ["zoo", "linear-gradient(#0e1b3d,#2c3f78)", "🐘"], ["forest", "linear-gradient(#a8d890,#2a6a3a)", "🦌"], ["sea", "linear-gradient(#aef0ff,#ffe9a8)", "🦀"], ["farm", "linear-gradient(#ffe9a8,#f08a5a)", "🐔"]]
  ],
  skinSel: (() => { const v = LS.get("sd-skin", []); return Array.from({ length: 4 }, (_, i) => Array.isArray(v) && typeof v[i] === "string" ? v[i] : "basic"); })()
};
const skinOf = t => { const m = PF.skins[t], id = PF.skinSel[t]; return (m && m[id]) || m.basic; };
const skLocked = (t, id) => id !== "basic" && !PF.skins[t][id];
function applyVars(el, sk) {
  const old = el._v || []; old.forEach(k => el.style.removeProperty(k));
  el._v = Object.keys(sk.vars); for (const k of el._v) el.style.setProperty(k, sk.vars[k]);
}
function skCss(sk) {
  let st = $("skCss"); if (!st) { st = document.createElement("style"); st.id = "skCss"; document.head.appendChild(st); }
  st.textContent = sk && sk.css || "";
}
function fillDeco(sk) {
  document.querySelectorAll(".dc").forEach(d => {
    d.innerHTML = ""; const L = sk.deco || ["⭐"];
    L.forEach((e, i) => {
      for (let k = 0; k < 3; k++) {
        const q = document.createElement("i"); q.textContent = e; q.style.left = ((i * 3 + k) * (100 / (L.length * 3)) + Math.random() * 6) + "%";
        q.style.animationDelay = (-Math.random() * 10) + "s"; q.style.animationDuration = (9 + Math.random() * 6) + "s"; d.appendChild(q);
      }
    });
  });
}
