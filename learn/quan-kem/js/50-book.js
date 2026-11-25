/* Khu SỔ KEM: bộ sưu tập các vị đã làm (thẻ hình, hình đen = chưa làm) + các bạn thú khách đã gặp. */
(function () {
  "use strict";
  const $ = QK.$, D = QK.data, A = QK.art;
  QK.renderBook = () => {
    const z = $("zBook"), S = QK.save; z.innerHTML = '<img class="zbg" src="' + A("canh-so") + '" alt="">' + QK.zhead();
    const g = document.createElement("div"); g.className = "cards"; g.style.gridAutoRows = "27cqw"; z.appendChild(g);
    D.flavors.forEach(f => { const n = S.cups[f.id] | 0; g.appendChild(QK.card(A("item-" + f.id), n ? f.en : "?", { silh: !n, cnt: n, fn: () => { if (n) QK.sfx.pick(); } })); });
    const r = document.createElement("div"); r.className = "row4"; r.style.top = "74cqw"; z.appendChild(r);
    D.customers.forEach(c => { const seen = S.seen.includes(c); r.appendChild(QK.card(A("khach-" + c + (seen ? "-vui" : "-cho")), "", { aria: c, silh: !seen, fn: () => {} })); });
    if (QK.renderWorlds) QK.renderWorlds(z);
  };
})();
