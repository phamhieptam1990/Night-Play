/* Khu SỔ CÔNG THỨC: bộ sưu tập các vị đã làm (thẻ hình, hình đen = chưa làm) + các bạn thú khách đã gặp. */
(function () {
  "use strict";
  const $ = TNE.$, D = TNE.data, A = TNE.art;
  TNE.renderBook = () => {
    const z = $("zBook"), S = TNE.save; z.innerHTML = '<img class="zbg" src="' + A("canh-so") + '" alt="">' + TNE.zhead();
    const g = document.createElement("div"); g.className = "cards"; z.appendChild(g);
    D.fruits.forEach(f => { const n = S.cups[f.id] | 0; g.appendChild(TNE.card(A("ly-" + f.id), n ? f.en : "?", { silh: !n, cnt: n, fn: () => { if (n) TNE.sfx.pick(); } })); });
    const r = document.createElement("div"); r.className = "row4"; r.style.top = "88cqw"; z.appendChild(r);
    D.customers.forEach(c => { const seen = S.seen.includes(c); r.appendChild(TNE.card(A("khach-" + c + (seen ? "-vui" : "-cho")), "", { silh: !seen, fn: () => {} })); });
  };
})();
