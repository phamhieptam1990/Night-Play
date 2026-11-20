/* Vùng bấm nhà, kho, ao cá. */
/* BLD (vị trí) nằm ở garden-places.js */
function initBuildings(){
BLD.forEach(function(d){ var a = document.createElement("a"); a.className = "bld"; a.href = GardenLayout.ART + d.f; a.setAttribute("aria-label", d.n + ": bấm để vào"); a.dataset.n = d.n;
  a.style.cssText = "left:" + ((d.x + OFX) / W * 100) + "%;top:" + ((d.y + OFY) / H * 100) + "%;width:" + (d.w / W * 100) + "%;height:" + (d.h / H * 100) + "%"; stage.appendChild(a); });
}

