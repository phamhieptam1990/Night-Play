/* Điều phối vườn: chỉ gọi GardenLayout.start(); thứ tự khởi động nằm ở garden-layout.js (START). */
(function(){
  function go(){ GardenLayout.start(); }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
