/* PHẦN THƯỞNG & SAO: cộng đồ vào kho ntv:* (thức ăn / xà phòng / đồ chơi MỚI / sao) và hiện popup toàn hình. Nguồn: điểm danh, nhiệm vụ ngày, lên cấp, mini-game. */
(function (N) {
  "use strict";
  var WK = function () { return window.WorldKit; };
  /* g = {food:n, soap:n, toy:n, stars:n}; trả mảng hình cho popup */
  N.give = function (g) {
    var S = N.store.get(), D = N.store.D(), big = [], i, n;
    for (i = 0, n = g.food | 0; i < n; i++) S.inv.food[N.rnd(D.foods)[0]]++;
    if (n) big.push({ ic: "food", n: "+" + n });
    if (g.soap) { S.inv.soap += g.soap; big.push({ ic: "soap", n: "+" + g.soap }); }
    for (i = 0; i < (g.toy | 0); i++) {
      var lk = D.toys.filter(function (t) { return S.inv.toys.indexOf(t[0]) < 0; });
      if (lk.length) { var t = N.rnd(lk); S.inv.toys.push(t[0]); big.push({ img: N.art(t[0]) }); } else g.stars = (g.stars | 0) + 2;
    }
    if (g.stars) { N.addStar(g.stars, true); big.push({ ic: "star", n: "+" + g.stars }); }
    N.store.save(); N.paint(); N.renderTray(); return big;
  };
  /* sao: cứ đủ 10 sao thì tặng thêm một món ăn */
  N.addStar = function (n, quiet) {
    var S = N.store.get(), a = Math.floor(S.stars / 10); S.stars += n; N.store.save();
    if (Math.floor(S.stars / 10) > a && !quiet) { S.inv.food[N.rnd(N.store.D().foods)[0]]++; N.store.save(); if (WK()) WK().toast("food", "+1"); }
    if (N.hudSync) N.hudSync(true);
  };
  /* popup quà: hình lớn + ✔ để nhận (đã cộng sẵn), fn chạy khi đóng */
  N.popupGive = function (big, fn) { if (!WK()) { if (fn) fn(); return; } N.sfx.win(); WK().popup({ big: big.concat([{ ic: "gift" }]), acts: [{ ic: "check", go: 1, label: "Nhận", fn: fn }] }); };
  /* điểm danh hằng ngày: nhẹ nhàng, bỏ ngày không sao (chỉ cộng dồn số ngày đã ghé thăm); mỗi 5 lần có đồ chơi mới */
  N.checkin = function () {
    var S = N.store.get(); if (S.ck.day === N.store.today()) return;
    S.ck.day = N.store.today(); S.ck.total++; var t = S.ck.total, g = { food: 2, soap: 1 };
    if (t % 5 === 0) g.toy = 1; if (t % 7 === 0) g.stars = 5;
    N.store.save(); N.popupGive(N.give(g));
  };
  /* nhiệm vụ ngày: xong việc thì thưởng một món; đủ cả 4 thì thưởng lớn */
  N.doneQuest = function (k) {
    if (!N.store.quest(k) || !WK()) return; var Q = ["feed", "bath", "play", "sleep"], q = N.store.questList(), all = Q.every(function (x) { return q[x]; });
    N.hudSync(); if (!all) { N.give(k === "feed" ? { soap: 1 } : k === "bath" ? { food: 1 } : { stars: 1 }); WK().toast("gift", "+1"); } else N.popupGive(N.give({ food: 2, toy: 1, stars: 3 }));
  };
})(window.NB);
