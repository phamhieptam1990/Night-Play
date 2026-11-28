/* DỤNG CỤ THU HOẠCH: 🌙 Liềm = chạm từng cây chín (hiệu ứng cắt riêng, không mở thẻ) · 🌾 Lưỡi hái = gặt hàng loạt mọi cây chín một lượt.
   Thanh nút nằm góc dưới trái; chạm lại nút đang chọn để về chế độ thường (chạm cây mở thẻ như cũ). */
var TOOL = null;
var TOOL_SVG = {
  /* Liềm: lưỡi cong ánh thép + cán gỗ có vòng nắm. Lưỡi hái: cán dài cong, hai tay nắm, lưỡi dài vắt ngang. Mỗi SVG có id gradient riêng (không trùng khi cùng nằm trong trang). */
  sickle: "<svg viewBox='0 0 48 48' aria-hidden='true'><defs><linearGradient id='tgSk' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ffffff'/><stop offset='.55' stop-color='#cfd9e6'/><stop offset='1' stop-color='#8a9bb2'/></linearGradient>" +
    "<linearGradient id='tgWd' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#a8672c'/><stop offset='1' stop-color='#6e3f17'/></linearGradient></defs>" +
    "<path d='M9.5 42 L22 29.5' stroke='url(#tgWd)' stroke-width='7' stroke-linecap='round'/><path d='M13 38.5 l3.2 3.2 M16.2 35.3 l3.2 3.2' stroke='#4a2a0e' stroke-width='1.6' stroke-linecap='round' opacity='.55'/>" +
    "<path d='M22 29 C10 25 7 10 22 6 C31 3.6 40 8 42.5 15.5 C37.5 11.2 30.5 11.4 27.4 15.2 C25.2 18 26 21.6 28.6 24 C26.4 26.6 24.4 28 22 29Z' fill='url(#tgSk)' stroke='#586a82' stroke-width='1.5' stroke-linejoin='round'/>" +
    "<path d='M13 18.5 C14.5 12.5 19 9.6 25 8.8' stroke='#fff' stroke-width='1.8' stroke-linecap='round' fill='none' opacity='.9'/><circle cx='22' cy='29.5' r='3.6' fill='#9aa8bb' stroke='#586a82' stroke-width='1.4'/><circle cx='21.2' cy='28.7' r='1.1' fill='#fff' opacity='.85'/></svg>",
  scythe: "<svg viewBox='0 0 48 48' aria-hidden='true'><defs><linearGradient id='tgSc' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#ffffff'/><stop offset='.5' stop-color='#d3dcea'/><stop offset='1' stop-color='#8697af'/></linearGradient>" +
    "<linearGradient id='tgWd2' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#b2713a'/><stop offset='1' stop-color='#6e3f17'/></linearGradient></defs>" +
    "<path d='M10.5 45 C13.5 32 17 19 21.5 8' stroke='url(#tgWd2)' stroke-width='4.6' stroke-linecap='round' fill='none'/><path d='M14 33.2 l-6.5 -2.4 M17.4 22.8 l6.6 -1.6' stroke='#8a5426' stroke-width='3' stroke-linecap='round'/><circle cx='7.2' cy='30.6' r='1.9' fill='#c98a4b'/><circle cx='24.4' cy='21' r='1.9' fill='#c98a4b'/>" +
    "<path d='M20.5 9.5 C27 1.8 40.5 2.2 46 13.2 C38.8 8.6 30.4 10 22.8 17 C22.2 14.4 21.4 11.8 20.5 9.5Z' fill='url(#tgSc)' stroke='#586a82' stroke-width='1.5' stroke-linejoin='round'/>" +
    "<path d='M24 8 C30 4.6 37.6 5.4 42.4 10' stroke='#fff' stroke-width='1.8' stroke-linecap='round' fill='none' opacity='.9'/><rect x='18.2' y='8.2' width='7' height='4' rx='1.6' transform='rotate(-14 21.7 10.2)' fill='#9aa8bb' stroke='#586a82' stroke-width='1.2'/></svg>"
};
function ripePlot(p){ return p.planted && !p.locked && p.got >= p.need; }
function harvestPlot(p){
  var c = CI[p.crop], n = reward(p); fxHarvest(p, n, p.crop);
  if(c.cat === "lau") p.got = 0; else { p.planted = false; p.crop = null; p.got = 0; }
  badge(p, p.el); return { n: n, c: c };
}
function fxSlash(p, big){ var r = stage.getBoundingClientRect(), x = p.x / W * r.width, y = p.y / H * r.height, w = big ? 90 : 70;
  var s = mkFx("fxslash", "", x, y); s.style.width = w + "px";
  s.animate([{ transform: "translate(-50%,-50%) rotate(-35deg) scaleX(0)", opacity: 1 }, { transform: "translate(-50%,-50%) rotate(-35deg) scaleX(1)", opacity: 1, offset: .5 }, { transform: "translate(-50%,-50%) rotate(-35deg) scaleX(1)", opacity: 0 }], { duration: 420, easing: "ease-out" }).onfinish = function(){ s.remove(); };
  for(var k = 0; k < 6; k++){ var l = mkFx("fxleaf", "🌿", x, y), a = (k / 6) * Math.PI * 2 + Math.random(), d = 40 + Math.random() * 30;
    l.animate([{ transform: "translate(-50%,-50%) scale(.6) rotate(0)", opacity: 1 }, { transform: "translate(" + (Math.cos(a) * d - 10) + "px," + (Math.sin(a) * d - 30) + "px) scale(1) rotate(" + (k % 2 ? 200 : -200) + "deg)", opacity: 0 }], { duration: 750, easing: "ease-out" }).onfinish = (function(e){ return function(){ e.remove(); }; })(l); } }
function fxSweep(){ var r = stage.getBoundingClientRect(), s = mkFx("fxsweep", "", 0, 0); s.style.height = r.height + "px";
  s.animate([{ transform: "translateX(-20%)", opacity: 0 }, { opacity: .9, offset: .15 }, { transform: "translateX(" + (r.width * 1.1) + "px)", opacity: 0 }], { duration: 900, easing: "ease-in-out" }).onfinish = function(){ s.remove(); }; }
function sickleTap(p){ if(!ripePlot(p)){ toast("🌱 Cây này chưa chín, em học thêm vài câu nhé"); return; }
  fxSlash(p, false); var r = harvestPlot(p); toast("🌙 +" + r.n + " " + r.c.ic + " " + r.c.vi); }
function scytheAll(){ var ripe = PLOTS.filter(ripePlot); if(!ripe.length){ toast("🌱 Chưa có cây nào chín để gặt"); return; }
  fxSweep(); var tot = 0; ripe.forEach(function(p, i){ setTimeout(function(){ fxSlash(p, true); tot += harvestPlot(p).n; if(i === ripe.length - 1) toast("🌾 Gặt xong " + ripe.length + " ô · +" + tot + " nông sản"); }, 120 + i * 110); }); }
function setTool(t){ TOOL = TOOL === t ? null : t; document.body.classList.toggle("tool-on", !!TOOL);
  document.querySelectorAll(".tlb").forEach(function(b){ b.classList.toggle("on", b.dataset.t === TOOL); b.setAttribute("aria-pressed", b.dataset.t === TOOL); });
  if(TOOL === "scythe"){ scytheAll(); TOOL = null; document.body.classList.remove("tool-on"); document.querySelectorAll(".tlb").forEach(function(b){ b.classList.remove("on"); }); }
  else if(TOOL) toast("🌙 Chạm từng cây chín để cắt"); }
function initTools(){
  var bar = document.createElement("div"); bar.className = "tlbar";
  [["sickle", "Liềm: thu từng cây chín", "Liềm"], ["scythe", "Lưỡi hái: gặt tất cả cây chín", "Lưỡi hái"]].forEach(function(d){
    var b = document.createElement("button"); b.type = "button"; b.className = "tlb"; b.dataset.t = d[0]; b.setAttribute("aria-label", d[1]); b.title = d[1]; b.innerHTML = TOOL_SVG[d[0]] + "<span>" + d[2] + "</span>";
    b.onclick = function(){ setTool(d[0]); }; bar.appendChild(b); });
  document.body.appendChild(bar);
  /* Liềm: chạm 1 lần = cắt (chờ ~0,28s xem có chạm lần 2) · chạm 2 lần nhanh hoặc nhấn giữ = mở thẻ cây */
  var lt = null, held = false, pend = null;
  function plotOf(e){ var h = e.target.closest && e.target.closest(".hs"); return h ? PLOTS.filter(function(q){ return q.el === h; })[0] : null; }
  stage.addEventListener("pointerdown", function(e){ if(TOOL !== "sickle") return; var p = plotOf(e); held = false; clearTimeout(lt); if(!p) return;
    lt = setTimeout(function(){ held = true; clearTimeout(pend); pend = null; hideTip(); if(navigator.vibrate) try { navigator.vibrate(15); } catch (x) {} openCard(p, p.el); }, 500); }, true);
  ["pointerup", "pointercancel", "pointerleave"].forEach(function(ev){ stage.addEventListener(ev, function(){ clearTimeout(lt); }, true); });
  stage.addEventListener("contextmenu", function(e){ if(TOOL === "sickle" && plotOf(e)) e.preventDefault(); }, true);
  stage.addEventListener("click", function(e){ if(TOOL !== "sickle") return; var p = plotOf(e); if(!p) return; e.stopImmediatePropagation(); e.preventDefault(); hideTip();
    if(held){ held = false; return; }
    if(pend && pend.p === p){ clearTimeout(pend.t); pend = null; openCard(p, p.el); return; }
    if(pend) clearTimeout(pend.t);
    pend = { p: p, t: setTimeout(function(){ pend = null; sickleTap(p); }, 280) }; }, true);
}
