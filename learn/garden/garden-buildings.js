/* Vùng bấm nhà, kho, ao cá. */
/* BLD (vị trí) nằm ở garden-places.js */
function initBuildings(){
BLD.forEach(function(d){ var a = document.createElement("a"); a.className = "bld"; a.href = d.href || GardenLayout.ART + d.f; a.setAttribute("aria-label", d.n + ": bấm để vào"); a.dataset.n = d.k || d.n;
  a.style.cssText = "left:" + ((d.x + OFX) / W * 100) + "%;top:" + ((d.y + OFY) / H * 100) + "%;width:" + (d.w / W * 100) + "%;height:" + (d.h / H * 100) + "%"; if(d.img){ a.classList.add("bimg"); a.innerHTML = "<img alt='' src='" + d.img + "' draggable='false'>"; } stage.appendChild(a); });
var sp = window.LearnSlot && LearnSlot.parts && LearnSlot.parts(), q = sp ? "?grade=" + sp.grade + "&subj=" + sp.subj : "";
(typeof BLD_SUBJ !== "undefined" ? BLD_SUBJ : []).forEach(function(d){ if(!sp || sp.subj !== d.s || (d.g && d.g !== +sp.grade)) return; var a = document.createElement("a"); a.className = "bld bimg"; a.innerHTML = "<img alt='' src='" + d.img + "'>"; a.href = d.href + q; a.setAttribute("aria-label", d.n + ": bấm để vào"); a.dataset.n = d.n;
  a.style.cssText = "left:" + ((d.x + OFX) / W * 100) + "%;top:" + ((d.y + OFY) / H * 100) + "%;width:" + (d.w / W * 100) + "%;height:" + (d.h / H * 100) + "%"; stage.appendChild(a); });
}

