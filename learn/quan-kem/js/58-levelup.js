/* NÂNG CẤP QUÁN theo cấp (TRẦN 5): mặt tiền (mái hiên sọc → đèn dây → cờ → viền vàng + đèn lồng; lớp SVG art/g<N>/mai-L.svg chồng lên tường), thêm bàn, boa nhiều hơn ở cấp cuối,
   thưởng xu + popup ít chữ khi lên cấp (huy hiệu, món/đồ vừa mở, mái mới). Không phạt, không tụt cấp. */
(function () {
  "use strict";
  const $ = QK.$, D = QK.data, A = QK.art, S = QK.save;
  QK.renderFacade = pop => {
    const l = QK.shopLevel(), z = $("zCounter"); z.dataset.lv = l;
    [$("fac"), $("facD")].forEach(f => { if (!f) return; f.hidden = l < 2;
      if (l >= 2) { f.src = A("mai-" + l); if (pop) { f.classList.remove("pop"); void f.offsetWidth; f.classList.add("pop"); } } });
  };
  /* quiet = vừa nhận quà bài học (đã có popup quà; hoãn popup cấp một nhịp) */
  QK.checkLevel = quiet => {
    const lv = QK.shopLevel(); if (lv <= S.lvSeen) return false;
    const from = S.lvSeen; S.lvSeen = lv; let coins = 0; for (let i = from; i < lv; i++) coins += D.levelCoins[i] || 0;
    QK.addCoins(coins); QK.persist(); QK.renderFacade(true); QK.updateHud(); QK.sfx.win();
    const big = [{ img: "art/huy-" + lv + ".svg" }, { ic: "star", n: lv }];
    D.flavors.forEach(f => { if (f.lv === lv) big.push({ img: A("box-" + f.id) }); });
    D.decor.forEach(d => { if (d.lv === lv) big.push({ img: A(d.art || d.id) }); });
    big.push({ img: A("mai-" + lv) }, { ic: "coin", n: "+" + coins });
    setTimeout(() => WorldKit.popup({ big, acts: [{ ic: "check", go: 1 }] }), quiet ? 1800 : 1300); return true;
  };
})();
