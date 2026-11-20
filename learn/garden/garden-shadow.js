/* BÓNG ĐỔ dưới các cây ảnh PNG (cây trong tranh SVG đã có bóng riêng, xem scripts/learn/garden-shadow-art.js).
   Bóng nằm trong tầng "shadow", dưới cây. Hướng và độ đậm đổi theo buổi trong ngày bằng CSS: stage[data-ph] = day | dusk | night. */
function initShadow(){
  var lay = GardenLayout.layer("shadow");
  TREES.forEach(function(t){
    if(!TSPR[t.k]) return;
    var w = treeW(t), e = document.createElement("i"); e.className = "sh";
    e.style.left = (t.x / W * 100) + "%"; e.style.top = ((t.y + w * .01) / H * 100) + "%"; e.style.width = (w * .5 / W * 100) + "%"; e.style.height = (w * .13 / H * 100) + "%";
    lay.appendChild(e);
  });
}
