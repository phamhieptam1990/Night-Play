/* Khu VƯỜN TRÁI CÂY (xem + nghe từ + mở khoá trái mới) và khu CỬA HÀNG ĐỒ (trang trí quầy). Thẻ hình: trái chưa mở khoá mờ + 🔒; mua bằng xu, thiếu xu thì chỉ đường đi học. */
(function () {
  "use strict";
  const $ = TNE.$, D = TNE.data, S = TNE.save, A = TNE.art;
  const head = () => '<div class="zhead"><i>' + TNE.ic("star") + "Lv " + TNE.shopLevel() + "</i><i>" + TNE.ic("coin") + "<span>" + S.coins + "</span></i></div>";
  function confirm(img, cost, onBuy) {
    if (!window.WorldKit) return;
    if (S.coins < cost) { WorldKit.popup({ big: [{ img }, { ic: "coin", n: S.coins + "/" + cost }], acts: [{ ic: "close", go: 1 }] }); TNE.sfx.oops(); return; }
    WorldKit.popup({ big: [{ img }, { ic: "coin", n: "-" + cost }], acts: [{ ic: "close" }, { ic: "check", go: 1, fn: onBuy }] });
  }
  function card(img, label, o) {
    const c = document.createElement("button"); c.type = "button"; c.className = "card" + (o.lock ? " lock" : "") + (o.silh ? " silh" : ""); c.setAttribute("aria-label", label);
    let h = '<img class="ci" src="' + img + '" alt="" draggable="false">' + (label ? "<b>" + label + "</b>" : "");
    if (o.lock) h += '<div class="lk">' + TNE.ic("lock") + "</div>";
    if (o.price != null) h += '<span class="pr ' + (o.owned ? "ok" : o.need ? "no" : "") + '">' + (o.owned ? TNE.ic("check") : o.need ? "Lv " + o.need : TNE.ic("coin") + o.price) + "</span>";
    if (o.cnt) h += '<span class="cnt">' + o.cnt + "</span>";
    c.innerHTML = h; c.onclick = o.fn; return c;
  }
  TNE.card = card; TNE.zhead = head;
  TNE.renderGarden = () => {
    const z = $("zGarden"), lv = TNE.shopLevel(); z.innerHTML = '<img class="zbg" src="' + A("canh-vuon") + '" alt="">' + head(); const g = document.createElement("div"); g.className = "cards"; z.appendChild(g);
    D.fruits.forEach(f => {
      const own = TNE.owned(f), need = lv < f.lv ? f.lv : 0;
      const c = card(A("fruit-" + f.id), f.en, {
        lock: !own, price: own ? null : f.cost, need,
        fn: () => {
          if (own) { TNE.sfx.pick(); c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop"); return; }
          if (need) { TNE.sfx.oops(); return; }
          confirm(A("fruit-" + f.id), f.cost, () => { S.coins -= f.cost; S.fruits.push(f.id); TNE.persist(); TNE.sfx.win(); if (TNE.onCoins) TNE.onCoins(0); TNE.renderCrates(); TNE.renderGarden(); });
        }
      });
      g.appendChild(c);
    });
  };
  TNE.renderShop = () => {
    const z = $("zShop"), lv = TNE.shopLevel(); z.innerHTML = '<img class="zbg" src="' + A("canh-cua-hang") + '" alt="">' + head(); const g = document.createElement("div"); g.className = "cards"; z.appendChild(g);
    const r = document.createElement("div"); r.className = "row4"; r.style.top = "56cqw"; z.appendChild(r);
    for (let i = 0; i < 4; i++) r.appendChild(card(A("ban"), "", { lock: i >= TNE.tables(), cnt: i < TNE.tables() ? i + 1 : 0, fn: () => {} }));
    D.decor.forEach(d => {
      const own = S.decor.includes(d.id), need = lv < d.lv ? d.lv : 0;
      g.appendChild(card(A(d.id), "", {
        lock: !own && !!need, price: own ? 0 : d.cost, owned: own, need,
        fn: () => {
          if (own || need) { TNE.sfx.oops(); return; }
          confirm(A(d.id), d.cost, () => { S.coins -= d.cost; S.decor.push(d.id); TNE.persist(); TNE.sfx.win(); if (TNE.onCoins) TNE.onCoins(0); TNE.renderDecor(); TNE.renderShop(); });
        }
      }));
    });
  };
})();
