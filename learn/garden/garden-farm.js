/* Nối khu vườn với kho chung (learn/farm.js): số hạt giống, sao, nông sản trong kho đọc từ máy; trồng/thu hoạch/mở quà ghi lại. */
function initFarm(){
  if(!window.Farm) return;
  var set = function(id, v){ var e = document.getElementById(id); if(e) e.textContent = v; };
  set("nSeed", Farm.get().seeds); set("nStar", Farm.stars()); set("nCrop", Farm.cropTotal());
}
