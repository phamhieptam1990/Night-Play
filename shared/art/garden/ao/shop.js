/* CỬA HÀNG CÁ trong trang Ao cá: nút 🛒 Mua cá mở popup mua thêm sinh vật bằng NÔNG SẢN đã thu hoạch (Farm.FISH, Farm.buyFish).
   Dùng showCard/toast có sẵn của trang ao. Tranh: ao/sv-<id>.svg (sinh bằng scripts/art/gen-ao-sinh-vat.js). */
(function(){
  var F = window.Farm; if(!F || !F.FISH) return;
  function img(f){ return "<img alt='' draggable='false' src='ao/sv-" + f.id + ".svg'>"; }
  function html(){
    var own = F.fishOf(), crops = F.cropTotal(), total = F.fishTotal(), shop = "";
    F.FISH.forEach(function(f){ var n = own[f.id] | 0, can = crops >= f.price && total < 20;
      shop += "<button type='button' class='pbuy" + (can ? "" : " off") + "' data-id='" + f.id + "' aria-label='Mua " + f.n + " giá " + f.price + " nông sản'><span class='pe'>" + img(f) + "</span><b>" + f.n + "</b><small>" + (n ? "có " + n : "chưa có") + "</small><em>🧺 " + f.price + "</em></button>"; });
    return "<h2>🛒 Mua cá</h2><span class='chip'>" + total + "/20 bạn trong ao</span><p class='sm'>Em có <b>🧺 " + crops + "</b> nông sản. Thu hoạch ở vườn để có thêm nhé.</p><div class='pshop'>" + shop + "</div><div class='acts'><button class='btn g' type='button' id='cl'>Đóng</button></div>";
  }
  function open(){ showCard(html()); card.querySelectorAll(".pbuy").forEach(function(b){ b.onclick = function(){ buy(b.getAttribute("data-id")); }; }); }
  function buy(id){ var r = F.buyFish(id);
    if(r.ok){ toast("🎉 Có bạn mới trong ao rồi!"); open(); } else toast(r.why === "full" ? "Ao đầy rồi, em có 20 bạn" : "🧺 Chưa đủ nông sản, hãy thu hoạch thêm nhé"); }
  var b = document.getElementById("shopb"); if(b) b.onclick = open;
})();
