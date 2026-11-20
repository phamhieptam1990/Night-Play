/* Khung nhìn của cảnh rộng: cuộn / kéo chuột / vuốt, thu phóng bằng nút ＋ －, Ctrl+lăn chuột, kẹp hai ngón, phím + -. */
var VW = { s: 1, wrap: null, pts: {}, pinch: 0, pinchS: 1, drag: null, moved: false };
function viewMin(){ return Math.max(innerWidth / W, innerHeight / H); }
/* Bề ngang LUÔN 100% màn hình (không để dải trống hai bên); thiếu chiều cao thì kéo/cuộn dọc. Màn dọc cao hơn cảnh: lấp đầy chiều cao, kéo ngang. */
function viewHomeScale(){ return Math.max(innerWidth / GW, innerHeight / GH); }
function viewMax(){ return Math.max(viewHomeScale() * 2.5, viewMin()); }
/* đổi tỷ lệ, giữ điểm (cx, cy) trên màn hình đứng yên */
function setZoom(s, cx, cy){
  var w = VW.wrap; s = Math.min(Math.max(s, viewMin()), viewMax());
  if(cx == null){ cx = innerWidth / 2; cy = innerHeight / 2; }
  var wx = (w.scrollLeft + cx) / VW.s, wy = (w.scrollTop + cy) / VW.s;
  VW.s = s; stage.style.setProperty("--sw", Math.round(W * s) + "px"); stage.style.setProperty("--sh", Math.round(H * s) + "px");
  w.scrollLeft = wx * s - cx; w.scrollTop = wy * s - cy; hideTip();
}
/* về giữa khu vườn, vừa khít màn hình */
function viewHome(){
  var w = VW.wrap, s = viewHomeScale(); VW.s = s; stage.style.setProperty("--sw", Math.round(W * s) + "px"); stage.style.setProperty("--sh", Math.round(H * s) + "px");
  w.scrollLeft = (OFX + GX + GW / 2) * s - innerWidth / 2; w.scrollTop = (OFY + GY + GH / 2) * s - innerHeight / 2; hideTip();
}
function initView(){
  var w = VW.wrap = document.getElementById("fsw");
  viewHome();
  document.getElementById("zIn").onclick = function(){ setZoom(VW.s * 1.3); };
  document.getElementById("zOut").onclick = function(){ setZoom(VW.s / 1.3); };
  document.getElementById("zHome").onclick = viewHome;
  w.addEventListener("scroll", hideTip, { passive: true });
  w.addEventListener("wheel", function(e){ if(e.ctrlKey || e.metaKey){ e.preventDefault(); setZoom(VW.s * Math.exp(-e.deltaY * .01), e.clientX, e.clientY); } }, { passive: false });
  /* kéo bằng chuột (cảm ứng đã vuốt được sẵn); kéo xa hơn 6px thì không tính là bấm */
  w.addEventListener("pointerdown", function(e){
    VW.pts[e.pointerId] = [e.clientX, e.clientY];
    if(e.pointerType === "mouse"){ if(e.button !== 0) return; VW.drag = { x: e.clientX, y: e.clientY, l: w.scrollLeft, t: w.scrollTop }; VW.moved = false; }
    var k = Object.keys(VW.pts); if(k.length === 2){ VW.pinch = Math.hypot(VW.pts[k[0]][0] - VW.pts[k[1]][0], VW.pts[k[0]][1] - VW.pts[k[1]][1]); VW.pinchS = VW.s; }
  });
  window.addEventListener("pointermove", function(e){
    if(VW.pts[e.pointerId]) VW.pts[e.pointerId] = [e.clientX, e.clientY];
    var k = Object.keys(VW.pts);
    if(k.length === 2 && VW.pinch){ var a = VW.pts[k[0]], b = VW.pts[k[1]]; setZoom(VW.pinchS * Math.hypot(a[0] - b[0], a[1] - b[1]) / VW.pinch, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); return; }
    if(VW.drag){ var dx = e.clientX - VW.drag.x, dy = e.clientY - VW.drag.y; if(!VW.moved && Math.hypot(dx, dy) > 6){ VW.moved = true; w.classList.add("drag"); hideTip(); } if(VW.moved){ w.scrollLeft = VW.drag.l - dx; w.scrollTop = VW.drag.t - dy; } }
  });
  function up(e){ delete VW.pts[e.pointerId]; VW.pinch = 0; VW.drag = null; w.classList.remove("drag"); }
  window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
  w.addEventListener("click", function(e){ if(VW.moved){ e.stopPropagation(); e.preventDefault(); VW.moved = false; } }, true);
  document.addEventListener("keydown", function(e){ if(document.querySelector(".ov.on")) return; if(e.key === "+" || e.key === "="){ setZoom(VW.s * 1.3); } else if(e.key === "-"){ setZoom(VW.s / 1.3); } else if(e.key === "0"){ viewHome(); } });
  window.addEventListener("resize", function(){ setZoom(VW.s); });
}
