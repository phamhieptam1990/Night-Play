/* Gợi ý nổi khi rê vào ô. */
function placeTip(p){
  tip.classList.remove("below"); tip.style.visibility = "hidden"; tip.classList.add("on"); tip.style.left = "0px"; tip.style.top = "0px";
  var sr = stage.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight, px = p.x / W * sr.width, py = p.y / H * sr.height, m = 10, hudH = 64, vtop = Math.max(0, -sr.top) + hudH;
  var lo = Math.max(m, m - sr.left), hi = Math.min(sr.width - tw - m, innerWidth - sr.left - tw - m), left = Math.min(Math.max(px - tw / 2, lo), Math.max(lo, hi)), top = py - 40 - th, below = false;
  if(top < vtop - Math.min(0, sr.top) - 0 && sr.top + top < hudH){ top = py + 46; below = true; }
  var vbot = innerHeight - sr.top - 54; if(top + th > vbot) top = Math.max(m, vbot - th);
  tip.style.left = Math.round(left) + "px"; tip.style.top = Math.round(top) + "px"; tip.style.setProperty("--ax", Math.round(Math.min(Math.max(px - left, 30), tw - 30)) + "px");
  tip.classList.toggle("below", below); tip.style.visibility = "";
}
function showTip(p){
  var c = p.planted ? CI[p.crop] : null, left = p.need - p.got, pct = p.planted ? p.got / p.need * 100 : 0;
  tip.innerHTML = "<div class='tico'>" + (p.planted ? icon(p.crop, 34) : "🌱") + "</div>" + (p.planted ? "<b>" + c.vi + (left ? "" : " · đã chín") + (p.hurt ? " " + HURT[p.hurt].ic : "") + "</b><div class='bar" + (left ? "" : " full") + "'><i style='width:0'></i></div><small>" + (left ? "Còn <b style=\"display:inline\">" + left + "</b> câu đúng nữa (khoảng " + mins(left) + " phút học) · " + p.got + "/" + p.need : "Chín rồi! Bấm để thu hoạch") + "</small>" : "<b>Đất trống</b><small>Bấm để chọn cây muốn trồng</small>");
  placeTip(p);
  var i = tip.querySelector(".bar i"); if(i) requestAnimationFrame(function(){ requestAnimationFrame(function(){ i.style.width = pct + "%"; }); });
}
function hideTip(){ tip.classList.remove("on"); }
