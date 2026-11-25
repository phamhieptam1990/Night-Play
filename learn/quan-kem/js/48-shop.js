/* Khu CỬA HÀNG: vị kem mới (mua bằng xu, mở theo cấp quán), NÂNG CẤP quán (máy kem, bàn ghế, biển hiệu) và đồ trang trí.
   Thẻ hình, ít chữ: thẻ khoá mờ + ổ khoá; thiếu xu thì hiện số xu còn thiếu (đi học bài Tiếng Anh để nhận xu). */
(function () {
  "use strict";
  const $ = QK.$, D = QK.data, S = QK.save, A = QK.art;
  const head = () => '<div class="zhead"><i>' + QK.ic("star") + "Lv " + QK.shopLevel() + "</i><i>" + QK.ic("coin") + "<span>" + S.coins + "</span></i></div>";
  function confirm(img, cost, onBuy) {
    if (S.coins < cost) { WorldKit.popup({ big: [{ img }, { ic: "coin", n: S.coins + "/" + cost }], acts: [{ ic: "close", go: 1 }] }); QK.sfx.oops(); return; }
    WorldKit.popup({ big: [{ img }, { ic: "coin", n: "-" + cost }], acts: [{ ic: "close" }, { ic: "check", go: 1, fn: onBuy }] });
  }
  function card(img, label, o) {
    const c = document.createElement("button"); c.type = "button"; c.className = "card" + (o.lock ? " lock" : "") + (o.silh ? " silh" : ""); c.setAttribute("aria-label", label || o.aria || "");
    let h = '<img class="ci" src="' + img + '" alt="" draggable="false">' + (label ? "<b>" + label + "</b>" : "");
    if (o.lock) h += '<div class="lk">' + QK.ic("lock") + "</div>";
    if (o.pips) h += '<span class="pips">' + [1, 2, 3].map(i => '<i class="' + (i <= o.pips ? "on" : "") + '"></i>').join("") + "</span>";
    if (o.price != null) h += '<span class="pr ' + (o.owned ? "ok" : o.need ? "no" : "") + '">' + (o.owned ? QK.ic("check") : o.need ? "Lv " + o.need : QK.ic("coin") + o.price) + "</span>";
    if (o.cnt) h += '<span class="cnt">' + o.cnt + "</span>";
    c.innerHTML = h; c.onclick = o.fn; return c;
  }
  QK.card = card; QK.zhead = head;
  const buy = (cost, fn) => () => { S.coins -= cost; fn(); QK.persist(); QK.sfx.win(); if (QK.onCoins) QK.onCoins(0); QK.renderShop(); };
  QK.renderShop = () => {
    const z = $("zShop"), lv = QK.shopLevel(); z.innerHTML = '<img class="zbg" src="' + A("canh-cua-hang") + '" alt="">' + head();
    const g = document.createElement("div"); g.className = "cards"; g.style.gridAutoRows = "27cqw"; z.appendChild(g);
    D.flavors.forEach(f => {
      const own = QK.owned(f), need = lv < f.lv ? f.lv : 0;
      g.appendChild(card(A("box-" + f.id), f.en, {
        lock: !own, price: own ? null : f.cost, need,
        fn: () => {
          if (own) { QK.sfx.pick(); return; } if (need) { QK.sfx.oops(); return; }
          const go = buy(f.cost, () => { S.flavors.push(f.id); QK.renderCrates(); });
          confirm(A("box-" + f.id), f.cost, D.spell ? () => QK.spell(f.id, f.en, go) : go);
        }
      }));
    });
    const r = document.createElement("div"); r.className = "row4"; r.style.top = "72cqw"; z.appendChild(r);
    const art = { machine: "machine-", sign: "sign-", table: "table-" };
    D.upgrades.forEach(u => {
      const l = S.up[u.id], max = l >= 3, cost = u.cost[l - 1];
      r.appendChild(card(A(art[u.id] + Math.min(3, l + (max ? 0 : 1))), "", {
        aria: u.id, pips: l, price: max ? 0 : cost, owned: max,
        fn: () => { if (max) { QK.sfx.oops(); return; } confirm(A(art[u.id] + (l + 1)), cost, buy(cost, () => { S.up[u.id] = l + 1; QK.renderMachine(); })); }
      }));
    });
    const d = document.createElement("div"); d.className = "row4"; d.style.top = "100cqw"; z.appendChild(d);
    D.decor.forEach(x => {
      const own = S.decor.includes(x.id), need = lv < x.lv ? x.lv : 0;
      d.appendChild(card(A(x.art || x.id), "", {
        aria: x.id, lock: !own && !!need, price: own ? 0 : x.cost, owned: own, need,
        fn: () => { if (own || need) { QK.sfx.oops(); return; } confirm(A(x.art || x.id), x.cost, buy(x.cost, () => { S.decor.push(x.id); QK.renderDecor(); })); }
      }));
    });
  };
})();
