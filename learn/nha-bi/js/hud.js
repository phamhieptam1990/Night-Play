/* HUD bằng BỘ KHUNG CHUNG shared/worldkit (WorldKit): sao · thức ăn · xà phòng · cấp độ · nhiệm vụ ngày (ăn, tắm, chơi, ngủ) · túi đồ. */
(function (N) {
  "use strict";
  var QUESTS = [["feed", "food"], ["bath", "soap"], ["play", "toy"], ["sleep", "check"]];
  var WK = function () { return window.WorldKit; };
  N.hudInit = function () {
    if (!WK()) return; var S = N.store.get();
    WK().mount({ back: N.gardenUrl(), bag: function () { N.sfx.tap(); N.openBag(); },
      pills: [{ id: "stars", ic: "star", val: S.stars }, { id: "food", ic: "food", val: N.store.foodCount() }, { id: "soap", ic: "soap", val: S.inv.soap }] });
    N.hudSync();
  };
  N.hudSync = function (bump) {
    if (!WK()) return; var S = N.store.get(), D = N.store.D(), lv = N.store.level(), L = D.pet.levels, nx = L[lv + 1], from = L[lv][1], q = N.store.questList();
    WK().setPill("stars", S.stars, bump); WK().setPill("food", N.store.foodCount()); WK().setPill("soap", S.inv.soap);
    WK().setLevel(lv + 1, nx ? (S.love - from) / (nx[1] - from) : 1);
    WK().setQuests(QUESTS.map(function (k) { return { ic: k[1], on: !!q[k[0]] }; }));
  };
})(window.NB);
