/* AO CÁ: bấm ao → xem sinh vật đang bơi + CỬA HÀNG mua thêm bằng NÔNG SẢN đã thu hoạch (Farm.FISH, Farm.buyFish). Cho cá ăn (nhiệm vụ) thì cá no cả ngày.
   Linh vật: shared/art/garden/ao/sv-<id>.svg (sinh bằng scripts/art/gen-ao-sinh-vat.js). */
var POND_ART = "../../shared/art/garden/ao/sv-";
function pondImg(f){ return "<img alt='' draggable='false' src='" + POND_ART + f.id + ".svg'>"; }
function pondHtml(){
  var F = window.Farm, own = F.fishOf(), crops = F.cropTotal ? F.cropTotal() : 0, total = F.fishTotal(), swim = "", shop = "";
  F.FISH.forEach(function(f, i){ for(var k = 0; k < (own[f.id] | 0); k++) swim += "<i class='pf' style='animation-delay:-" + ((i * 7 + k * 3) % 9) + "s;top:" + (8 + (i * 13 + k * 17) % 60) + "%'>" + pondImg(f) + "</i>"; });
  F.FISH.forEach(function(f){ var n = own[f.id] | 0, can = crops >= f.price && total < 20;
    shop += "<button type='button' class='pbuy" + (can ? "" : " off") + "' data-id='" + f.id + "' aria-label='Mua " + f.n + " giá " + f.price + " nông sản'><span class='pe'>" + pondImg(f) + "</span><b>" + f.n + "</b><small>" + (n ? "có " + n : "chưa có") + "</small><em>🧺 " + f.price + "</em></button>"; });
  return "<div class='hd'><div class='pi'>🐟</div><div><h2>Ao cá</h2><span class='chip'>" + total + "/20 bạn trong ao</span></div></div><!--B-->" +
    "<div class='pond'>" + swim + "</div>" +
    "<p class='sm' style='margin:8px 0'>" + (F.fishFed() ? "😋 Cá no rồi, hôm nay vui lắm!" : "🍽 Làm nhiệm vụ <b>Cho cá ăn</b> để cá no nhé.") + " Em có <b>🧺 " + crops + "</b> nông sản.</p>" +
    "<div class='pshop'>" + shop + "</div><div class='acts'><button class='btn g' type='button' id='cl' aria-label='Đóng'>✕</button></div>";
}
function openPond(){ if(!window.Farm || !Farm.FISH) return; showCardH(pondHtml()); }
function openPondBind(){ card.querySelectorAll(".pbuy").forEach(function(b){ b.onclick = function(){ openPondBuy(b); }; }); }
function openPondBuy(b){ var r = Farm.buyFish(b.getAttribute("data-id")); if(r.ok){ toast("🎉 Có bạn mới trong ao rồi!"); showCardH(pondHtml()); openPondBind(); } else toast(r.why === "full" ? "Ao đầy rồi, em có 20 bạn" : "🧺 Chưa đủ nông sản, hãy thu hoạch thêm nhé"); }
document.addEventListener("click", function(e){ var a = e.target.closest && e.target.closest(".bld[data-n='Ao cá']"); if(!a || a.classList.contains("lk")) return; e.preventDefault(); openPond(); openPondBind(); }, true);
