/* Sinh đơn gọi món theo dữ liệu thực đơn: cùng hạt giống => cùng đơn (thách đấu). Câu nói dựng từ numbers + tên trái cây Tiếng Anh. */
(function () {
  "use strict";
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  TNE.orderText = o => {
    const D = TNE.data, parts = o.map(it => D.numbers[it.n] + " " + TNE.fruit(it.f).en + " juice" + (it.n > 1 ? "s" : ""));
    return cap(D.say.order.replace("{o}", parts.join(" and ")));
  };
  TNE.makeOrders = (seed, lv, pool) => {
    const D = TNE.data, rnd = TNE.rng(seed), L = D.levels[lv - 1], out = []; let last = -1;
    const pick = a => a[Math.floor(rnd() * a.length)];
    for (let i = 0; i < D.rounds; i++) {
      const fs = pool.slice(), items = [];
      for (let k = 0; k < L.items; k++) { const f = fs.splice(Math.floor(rnd() * fs.length), 1)[0]; items.push({ f: f.id, n: 1 + Math.floor(rnd() * L.nMax) }); }
      let c; do { c = pick(D.customers); } while (c === last); last = c;
      out.push({ items, cust: c, say: Math.floor(rnd() * 4) });
    }
    return out;
  };
  /* tray: mảng id trái cây theo thứ tự thêm; đúng khi số ly mỗi vị bằng đơn và không thừa vị nào */
  TNE.judge = (order, tray) => {
    const cnt = {}; tray.forEach(f => { cnt[f] = (cnt[f] || 0) + 1; });
    const need = {}; order.forEach(it => { need[it.f] = it.n; });
    return Object.keys(cnt).every(f => need[f] === cnt[f]) && Object.keys(need).every(f => cnt[f] === need[f]);
  };
})();
