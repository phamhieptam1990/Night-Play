/* CÂY ĂN TRÁI NHÌN LÀ BIẾT: (1) ảnh cây đổi đúng LOÀI bé đã trồng ở ô đó; (2) cây LỚN DẦN theo giai đoạn (hạt → mầm → cây con → sắp chín → chín);
   (3) trên ô hiện QUẢ của loài đó, quả to dần theo giai đoạn, chín thì to nhất, sáng và nảy lên. Gọi từ cropSprite (garden-crops.js) và initTrees. */
var TREE_SCALE = [.5, .62, .76, .9, 1], FRUIT_SCALE = [.35, .5, .7, .9, 1.15];
function treeSync(p, b){
  var t = typeof treeOfPlot === "function" ? treeOfPlot(p) : null, k = p.planted ? stg(p) : 0;
  if(t && t.el){
    if(p.planted && TSPR[p.crop]){ var src = TSPR[p.crop]; if(t.el.getAttribute("src") !== src){ t.el.src = src; t.k = p.crop; } }
    t.el.style.scale = p.planted ? TREE_SCALE[k] : ".42"; t.el.style.opacity = p.planted ? "" : ".55";   /* ô trống: cây con mờ, chưa trồng */
  }
  fruitMark(p, b, 34, k);
}
/* biểu tượng loài trên ô: quả (cây ăn trái), củ/rau/lúa, hoa (hướng dương…) — to dần theo giai đoạn để bé nhìn là biết đang trồng gì */
function fruitMark(p, b, size, k){
  var f = b.querySelector(".tfruit");
  if(!p.planted || !p.crop || !window.CI || !CI[p.crop]){ if(f) f.remove(); return; }
  if(k == null) k = stg(p);
  if(!f){ f = document.createElement("span"); f.className = "tfruit"; b.appendChild(f); }
  f.innerHTML = icon(p.crop, size); f.style.setProperty("--fs", FRUIT_SCALE[k]); f.classList.toggle("ripe", k >= 4); f.dataset.k = k; f.classList.toggle("fld", !p.tree);
}
function treeSyncAll(){ PLOTS.forEach(function(p){ if(p.tree && p.el) treeSync(p, p.el); }); }
