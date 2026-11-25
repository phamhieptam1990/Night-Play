/* Sinh đơn gọi món theo dữ liệu thực đơn + LỚP: cùng hạt giống => cùng đơn. Câu nói dựng từ numbers + tên món sg/pl (data/shop-g<N>.js). */
(function () {
  "use strict";
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  QK.orderText = o => {
    const D = QK.data, form = D.lvl.form;
    const parts = o.map(it => D.numbers[it.n] + " " + (it.n > 1 ? QK.flavor(it.f).pl : QK.flavor(it.f).sg));
    const list = parts.length > 1 ? parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1] : parts[0];
    return cap(D.say.order[form].replace("{o}", list));
  };
  /* lời đầy đủ: câu hỏi của chủ quán (lớp 4: "What would you like?") + lời khách */
  QK.fullText = o => (QK.data.ask ? QK.data.ask + " " : "") + QK.orderText(o);
  /* độ khó theo cấp quán, KẸP [2 .. nMax của lớp]: cấp 1 gọi ít cây, cấp càng cao càng nhiều (không vượt khả năng của lớp) */
  QK.lvlNow = () => { const L = QK.data.lvl, n = Math.min(L.nMax, Math.max(2, L.nMax - 5 + QK.shopLevel())); return Object.assign({}, L, { nMax: Math.max(1, Math.min(L.nMax, n)) }); };
  QK.makeOrders = (seed, pool) => {
    const D = QK.data, rnd = QK.rng(seed), L = QK.lvlNow(), out = []; let last = -1;
    const pick = a => a[Math.floor(rnd() * a.length)];
    for (let i = 0; i < D.rounds; i++) {
      const fs = pool.slice(), items = [], k = Math.min(L.items, fs.length);
      for (let j = 0; j < k; j++) { const f = fs.splice(Math.floor(rnd() * fs.length), 1)[0]; items.push({ f: f.id, n: 1 + Math.floor(rnd() * L.nMax) }); }
      let c; do { c = pick(D.customers); } while (c === last); last = c;
      out.push({ items, cust: c, say: Math.floor(rnd() * 4) });
    }
    return out;
  };
  /* tray: mảng id vị theo thứ tự thêm; đúng khi số cây mỗi vị bằng đơn và không thừa vị nào */
  QK.judge = (order, tray) => {
    const cnt = {}; tray.forEach(f => { cnt[f] = (cnt[f] || 0) + 1; });
    const need = {}; order.forEach(it => { need[it.f] = it.n; });
    return Object.keys(cnt).every(f => need[f] === cnt[f]) && Object.keys(need).every(f => cnt[f] === need[f]);
  };
})();
