/* HIỆU ỨNG THU HOẠCH: ô nảy · hai vòng sóng vàng · sao lấp lánh bung ra · các củ/quả bật lên theo vòng cung rồi lần lượt bay vào giỏ (số trong giỏ nhảy dần) · chữ "+n" bay lên.
   fxHarvest(p, n, crop) cộng nông sản vào kho ngay (Farm.addCrop) rồi chỉ vẽ hiệu ứng. Dùng mkFx (garden-core.js), icon (garden-plots.js). */
function fxHarvest(p, n, crop){
  if(window.Farm) Farm.addCrop(crop, n);
  var r = stage.getBoundingClientRect(), x = p.x / W * r.width, y = p.y / H * r.height, tx = (1092 + OFX) / W * r.width, ty = (505 + OFY) / H * r.height;
  var sz = Math.max(36, r.width * .045), reduce = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;
  function end(e){ return function(){ e.remove(); }; }
  if(p.el && p.el.animate) p.el.animate([{ transform: "translate(-50%,-50%) scale(1)" }, { transform: "translate(-50%,-50%) scale(1.25,.8)", offset: .2 }, { transform: "translate(-50%,-50%) scale(.9,1.2)", offset: .5 }, { transform: "translate(-50%,-50%) scale(1)" }], { duration: 520 });
  for(var q = 0; q < 2; q++){ var rg = mkFx("hvr", "", x, y); rg.animate([{ transform: "translate(-50%,-50%) scale(.2)", opacity: .95 }, { transform: "translate(-50%,-50%) scale(" + (2.6 + q) + ")", opacity: 0 }], { duration: 700 + q * 200, delay: q * 140, easing: "ease-out", fill: "backwards" }).onfinish = end(rg); }
  var cols = ["#FFD24D", "#FFF3B0", "#FF9FBF", "#9EE3FF", "#B6F0A0"];
  for(var k = 0; k < 14; k++){ var st = mkFx("hvs", "✦", x, y - 6), a = k / 14 * Math.PI * 2 + Math.random() * .4, d = 46 + Math.random() * 46; st.style.color = cols[k % 5]; st.style.fontSize = (12 + Math.random() * 12) + "px";
    st.animate([{ transform: "translate(-50%,-50%) scale(.3) rotate(0)", opacity: 1 }, { transform: "translate(" + (Math.cos(a) * d - 8) + "px," + (Math.sin(a) * d - 18) + "px) scale(1.1) rotate(180deg)", opacity: 1, offset: .55 }, { transform: "translate(" + (Math.cos(a) * d * 1.2) + "px," + (Math.sin(a) * d * 1.2 - 4) + "px) scale(.2) rotate(300deg)", opacity: 0 }], { duration: 800 + Math.random() * 300, easing: "ease-out" }).onfinish = end(st); }
  var m = Math.max(1, Math.min(n, 6)), per = Math.floor(n / m), extra = n - per * m;
  for(var i = 0; i < m; i++) (function(i){
    var give = per + (i < extra ? 1 : 0), dx = (i - (m - 1) / 2) * (sz * .75) + (Math.random() * 10 - 5), f = mkFx("fxf", icon(crop, sz), x, y - 10);
    f.style.width = sz + "px"; f.style.height = sz + "px";
    var pop = f.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 0 }, { transform: "translate(calc(-50% + " + (dx * .6) + "px),calc(-50% - " + (sz * 2.1) + "px)) scale(1.3)", opacity: 1, offset: .55 }, { transform: "translate(calc(-50% + " + dx + "px),calc(-50% - " + (sz * 1.1) + "px)) scale(1)", opacity: 1 }], { duration: 480, delay: i * 70, easing: "cubic-bezier(.2,.8,.3,1)", fill: "both" });
    pop.onfinish = function(){
      var fly = f.animate([{ transform: "translate(calc(-50% + " + dx + "px),calc(-50% - " + (sz * 1.1) + "px)) scale(1)", opacity: 1 }, { transform: "translate(calc(-50% + " + (dx + (tx - x) * .5) + "px),calc(-50% + " + ((ty - y) * .5 - 90) + "px)) scale(1.1) rotate(160deg)", opacity: 1, offset: .55 }, { transform: "translate(calc(-50% + " + (tx - x) + "px),calc(-50% + " + (ty - y) + "px)) scale(.35) rotate(320deg)", opacity: .9 }], { duration: reduce ? 300 : 800, delay: 120, easing: "cubic-bezier(.4,.1,.3,1)", fill: "both" });
      fly.onfinish = function(){ f.remove(); bumpNum("nCrop", give); if(window.UnlockFx) UnlockFx.ting(Math.min(i, 5));   /* "ting" cao dần theo từng củ vào giỏ */ var s = mkFx("hvs", "✦", tx, ty); s.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: 1 }, { transform: "translate(-50%,-50%) scale(1.6)", opacity: 0 }], { duration: 400 }).onfinish = end(s); };
    };
  })(i);
  var t = mkFx("hvt", "+" + n, x, y - sz * 1.4); t.animate([{ transform: "translate(-50%,0) scale(.5)", opacity: 0 }, { transform: "translate(-50%,-18px) scale(1.25)", opacity: 1, offset: .25 }, { transform: "translate(-50%,-54px) scale(1)", opacity: 0 }], { duration: 1100, delay: 200, easing: "ease-out", fill: "backwards" }).onfinish = end(t);
}
