/* TIẾN HOÁ THÚ (cấp có TRẦN = số cấp trong pet.levels, 5): thú to dần theo cấp (--s trong room.js, tỉ lệ ở css/95-evolve.css), lớp SVG chồng evo-1..4 (hào quang + sao),
   lên cấp: thú nhún lớn lên + popup toàn hình (huy hiệu, thứ vừa mở, quà). Cấp tính từ "tình cảm" (chăm thú + quà bài học, lesson-gifts.js); không phạt, thú không mất cấp. */
(function (N) {
  "use strict";
  N.paintEvo = function (lv) { var e = N.$("evo"); e.hidden = lv < 1; if (lv >= 1) e.src = N.art("evo-" + Math.min(4, lv)); };
  N.checkLevel = function () {
    var S = N.store.get(), D = N.store.D(), top = D.pet.levels.length - 1, lv = Math.min(top, N.store.level()), seen = Math.max(0, Math.min(top, S.seenLv | 0));
    if (lv <= seen) { if (S.seenLv !== seen) { S.seenLv = seen; N.store.save(); } return false; }
    S.seenLv = lv; N.store.save(); N.sfx.up(); N.setExp("cun-joy", 2200); N.petAnim("hop", 1200);
    var pw = N.$("pw"); pw.classList.remove("grow"); void pw.offsetWidth; pw.classList.add("grow"); setTimeout(function () { pw.classList.remove("grow"); }, 1400);
    var big = [{ img: N.art("huy-hieu-" + (lv + 1)) }, { ic: "star", n: lv + 1 }];
    D.zones.forEach(function (z) { if (z[3] === lv) big.push({ img: N.art(z[2]) }); });
    D.outfits.forEach(function (o) { if (o[1] === lv) big.push({ img: N.art(o[0]) }); });
    N.refreshZones(); big = big.concat(N.give({ food: 2, soap: 1, toy: lv % 2 })); N.paint();
    setTimeout(function () { N.popupGive(big); }, 1500); return true;
  };
})(window.NB);
