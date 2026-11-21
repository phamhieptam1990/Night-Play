/* Cây ăn trái (mọi giống) là ảnh rời, xếp theo độ sâu y: hàng gần người nhìn đè lên hàng sau. Mango = PNG vẽ tay: lớp <img> đặt chồng lên tranh nền SVG (SVG không chứa <image>). Chân cây = 85% chiều cao ảnh. */
var TSPR = { mango: GardenLayout.ART + "tree/tree_mango.png" }, TW_ = 215;
["orange", "apple", "pear", "peach", "pomelo", "litchi", "plum"].forEach(function(k){ TSPR[k] = GardenLayout.ART + "tree/tree_" + k + ".svg"; });   /* ảnh SVG do bộ sinh xuất (viewBox -100 -180 200 205, chân cây ở 88% chiều cao) */
/* bề rộng ảnh (đơn vị cảnh) và độ cao chân cây so với đỉnh ảnh theo từng loại ảnh */
function treeW(t){ return t.k === "mango" ? TW_ * (t.s / .85) : 200 * t.s; }
function treeFoot(t, w){ return t.k === "mango" ? w * .85 : w * 180 / 200; }
function initTrees(){
  TREES.slice().sort(function(a, b){ return a.y - b.y; }).forEach(function(t){
    var src = TSPR[t.k]; if(!src) return;
    var w = treeW(t), e = document.createElement("img"); e.className = "tr"; e.src = src; e.alt = ""; e.draggable = false;
    e.style.left = ((t.x - w / 2) / W * 100) + "%"; e.style.top = ((t.y - treeFoot(t, w)) / H * 100) + "%"; e.style.width = (w / W * 100) + "%";
    e.style.setProperty("--sd", (4.5 + Math.random() * 3) + "s"); e.style.setProperty("--sl", (-Math.random() * 6) + "s");   /* mỗi cây lắc lệch pha */
    t.el = e; GardenLayout.layer("sprites").appendChild(e);
  });
}
