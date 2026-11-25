/* THÓI QUEN NHẸ + NGÀY/ĐÊM: Bi "đòi" ăn/tắm/chơi bằng một hình nhỏ bay lên (không phạt, bỏ qua cũng được); chỉ số giảm rất chậm, sàn 35. Màu cảnh theo giờ máy. Chạm Bi: sủa + tim. */
(function (N) {
  "use strict";
  var WANTS = [["h", NB_DATA.foods[0][0]], ["c", "xa-phong"], ["f", "bong"]];
  N.phase = function () { var h = new Date().getHours(); return h >= 19 || h < 5 ? "night" : h >= 17 ? "dusk" : "day"; };
  function tick() {
    N.$("rm").dataset.ph = N.phase(); if (N.screen !== "room" || N.busy) return;
    var S = N.store.get(), w = N.$("want"), need = null;
    WANTS.forEach(function (x) { if (S.st[x[0]] < 45 && (!need || S.st[x[0]] < S.st[need[0]])) need = x; });
    if (need) { w.src = N.art(need[1]); w.hidden = false; } else w.hidden = true;
  }
  function slow() {   /* trong lúc chơi tụt nhẹ, không xuống dưới 35 */
    if (N.screen !== "room" || N.busy) return; var S = N.store.get();
    [["h", 3], ["c", 2], ["f", 3]].forEach(function (x) { N.store.setStat(x[0], Math.max(35, S.st[x[0]] - x[1])); }); N.paint(); tick();
  }
  N.initHabit = function () {
    tick(); setInterval(tick, 4000); setInterval(slow, 45000);
    N.$("pw").addEventListener("pointerup", function () {
      if (N.busy || N.screen !== "room") return; N.sfx.bark(); N.setExp("cun-joy", 900); N.petAnim("hop", 600); N.hearts(2);
    });
  };
  N.refreshWant = tick;
})(window.NB);
