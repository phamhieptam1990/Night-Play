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
  /* VẼ ĐÚNG CÁC BẠN BÉ ĐÃ MUA vào ao (thay cá mẫu cố định): mỗi bạn một hình bơi; con vừa mua nhảy vào có hiệu ứng "pop" */
  var SZ = { ca_voi: 24, map: 17, heo: 16, rua: 13, bachtuoc: 13, koi: 13, chep: 12, ngua: 8, tom: 8, cua: 9, oc: 6, saobien: 8, nuc: 10, sua: 10, vang: 10 }, CRAWL = { oc: 1, cua: 1, saobien: 1, rua: 1, tom: 1 };
  /* hình sv-*.svg vẽ mặt quay TRÁI mà animation bơi đi sang PHẢI trước → lật ngang để mặt luôn hướng về phía bơi (rùa, cá ngựa vẽ sẵn quay phải) */
  var LEFT = { vang: 1, chep: 1, koi: 1, nuc: 1, heo: 1, map: 1, ca_voi: 1, oc: 1, tom: 1 };
  function renderOwned(newId){
    var box = document.getElementById("fish"); if(!box) return; var own = F.fishOf();
    Array.prototype.slice.call(box.querySelectorAll(".fish")).forEach(function(e){ e.remove(); });
    var k = 0; F.FISH.forEach(function(f){ for(var i = 0; i < (own[f.id] | 0); i++, k++){
      var y = CRAWL[f.id] ? 74 + (k * 7) % 14 : 14 + (k * 23) % 56, b = document.createElement("button");
      b.className = "fish own" + (newId === f.id && i === (own[f.id] | 0) - 1 ? " spawn" : ""); b.type = "button"; b.setAttribute("aria-label", f.n);
      b.style.cssText = "left:" + (6 + (k * 17) % 40) + "%;top:" + y + "%;width:" + (SZ[f.id] || 10) + "%;--an:swim;--dur:" + (CRAWL[f.id] ? 34 + k % 7 : 14 + (k * 3) % 13) + "s;--dl:" + (-(k * 2.3)) + "s;--dx:" + (CRAWL[f.id] ? 260 : 380 + (k * 40) % 240) + "%;--dy:" + (y > 50 ? -50 : 50) + "%";
      b.innerHTML = img(f).replace("<img", LEFT[f.id] ? "<img class='flip'" : "<img"); (function(f, b){ b.onclick = function(){ b.classList.add("hot"); setTimeout(function(){ b.classList.remove("hot"); }, 900); toast(f.ic + " " + f.n + " đang bơi trong ao"); }; })(f, b); box.appendChild(b); } });
  }
  function open(){ showCard(html()); card.querySelectorAll(".pbuy").forEach(function(b){ b.onclick = function(){ buy(b.getAttribute("data-id")); }; }); }
  function buy(id){ var r = F.buyFish(id);
    if(r.ok){ toast("🎉 Có bạn mới trong ao rồi!"); renderOwned(id); open(); } else toast(r.why === "full" ? "Ao đầy rồi, em có 20 bạn" : "🧺 Chưa đủ nông sản, hãy thu hoạch thêm nhé"); }
  renderOwned(); addEventListener("load", function(){ renderOwned(); });   /* sau khi trang vẽ xong cá mẫu */
  var b = document.getElementById("shopb"); if(b) b.onclick = open;
})();
