/* TRỒNG NHIỀU Ô: trong bảng chọn cây có nút "🌱🌱 Trồng nhiều ô". Bật nút rồi chọn cây: cây được trồng ở ô đang mở, sau đó bé chạm tiếp các ô đất trống khác để trồng cùng loại
   (mỗi ô tốn 1 hạt giống) cho tới khi bấm Xong hoặc hết hạt. Dùng picker của garden-plant-card.js (MultiPlant.decorate / armed / start). */
var MultiPlant = (function(){
  var armed = false, crop = null, bar = null, hooked = false;
  function seeds(){ return window.Farm ? Farm.get().seeds : 99; }
  function decorate(root){
    var note = root.querySelector("#cnote"); if(!note) return;
    var b = document.createElement("button"); b.type = "button"; b.className = "mpt" + (armed ? " on" : ""); b.setAttribute("aria-pressed", String(armed));
    b.innerHTML = "🌱🌱 Trồng nhiều ô"; b.onclick = function(){ armed = !armed; b.classList.toggle("on", armed); b.setAttribute("aria-pressed", String(armed)); };
    note.parentNode.insertBefore(b, note);
  }
  function plantAt(p){
    var c = CI[crop]; p.bk = null; p.planted = true; p.crop = crop; p.need = c.need; p.got = 0; badge(p, p.el); fxPlant(p);
  }
  function paintBar(){ if(!bar) return; bar.querySelector("span").innerHTML = "Chạm ô đất trống để trồng " + CI[crop].ic + " · còn <b>" + seeds() + "</b> 🌱"; }
  function stop(msg){ crop = null; if(bar){ bar.remove(); bar = null; } document.body.classList.remove("mp-on"); if(msg) toast(msg); }
  function onTap(e){
    if(!crop) return; var h = e.target.closest && e.target.closest(".hs"); if(!h) return;
    var p = PLOTS.filter(function(q){ return q.el === h; })[0]; if(!p) return;
    e.stopImmediatePropagation(); e.preventDefault(); if(typeof hideTip === "function") hideTip();
    if(p.planted){ toast("Ô này đã có cây rồi, chạm ô đất trống nhé"); return; }
    if(seeds() < 1){ stop("Hết hạt giống rồi! Học một bài để có thêm 🌱"); return; }
    plantAt(p); if(seeds() < 1) stop("Đã trồng xong, hết hạt giống 🌱"); else paintBar();
  }
  function start(id){
    crop = id; if(typeof setTool === "function" && TOOL) setTool(TOOL);
    if(!hooked){ stage.addEventListener("click", onTap, true); hooked = true; }
    if(!bar){ bar = document.createElement("div"); bar.className = "mpbar"; bar.innerHTML = "<span></span><button type='button' class='btn'>Xong</button>"; bar.querySelector("button").onclick = function(){ stop("Trồng xong rồi! 🌱"); }; document.body.appendChild(bar); }
    document.body.classList.add("mp-on"); paintBar();
  }
  return { decorate: decorate, armed: function(){ return armed; }, start: start, stop: stop };
})();
