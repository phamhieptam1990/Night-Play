"use strict";
/* ---------- cổng: phép tính người lớn làm được nhanh, trẻ lớp 1–5 khó giải (cả lớp 5 chưa nhẩm nhanh được nhân hai chữ số) ---------- */
let ans = 0;
function newSum(){ const a = 23 + Math.floor(Math.random() * 17), b = 12 + Math.floor(Math.random() * 8), c = 107 + Math.floor(Math.random() * 190);
  /* 2 chữ số × 2 chữ số + 3 chữ số: bé lớp 5 khó nhẩm nhanh */ ans = a * b + c;
  $("sum").textContent = a + " × " + b + " + " + c + " = ?"; $("gi").value = ""; }
function paintGate(){ const u = U(); $("gT").textContent = u.gateH; $("gP").textContent = u.gateP; $("gb").textContent = u.gateGo; $("gi").setAttribute("aria-label", u.gateIn); }
$("gf").onsubmit = e => { e.preventDefault(); if(+$("gi").value === ans){ ls("learn:pg", String(Date.now()), true); open_(); } else { $("gm").textContent = U().gateBad; newSum(); $("gi").focus(); } };
const passed = () => { const t = +ls("learn:pg", undefined, true); return t > 0 && Date.now() - t < 15 * 60 * 1000; };
function open_(){ $("gate").hidden = true; $("dash").hidden = false; render(); window.scrollTo(0, 0); }
