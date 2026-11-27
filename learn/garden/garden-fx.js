/* Hiệu ứng thu hoạch và trồng. */
function fxPlant(p){ var r = stage.getBoundingClientRect(), x = p.x / W * r.width, y = p.y / H * r.height;
  for(var k = 0; k < 7; k++){ var d = mkFx("fxd", "", x, y); var a = (k / 7) * Math.PI * 2; d.animate([{ transform: "translate(-50%,-50%) scale(1)", opacity: .9 }, { transform: "translate(" + (Math.cos(a) * 34 - 5) + "px," + (Math.sin(a) * 16 - 14) + "px) scale(.3)", opacity: 0 }], { duration: 600, easing: "ease-out" }).onfinish = (function(e){ return function(){ e.remove(); }; })(d); }
  var rg = mkFx("fxr", "", x, y); rg.animate([{ transform: "translate(-50%,-50%) scale(.3)", opacity: .9 }, { transform: "translate(-50%,-50%) scale(1.6)", opacity: 0 }], { duration: 700, easing: "ease-out" }).onfinish = function(){ rg.remove(); };
  var sp = mkFx("fxp", "🌱", x, y); sp.animate([{ transform: "translate(-50%,-30%) scale(0)", opacity: 0 }, { transform: "translate(-50%,-90%) scale(1.3)", opacity: 1, offset: .5 }, { transform: "translate(-50%,-110%) scale(1)", opacity: 0 }], { duration: 900 }).onfinish = function(){ sp.remove(); };
  bumpNum("nSeed", -1); }
