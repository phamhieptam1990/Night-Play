/* CHƠI: kéo đồ chơi thả ra sàn (hoặc chạm). Bi chạy tới. Mỗi đồ một hoạt ảnh: bóng nảy, vịt kêu, xe chạy, gấu bông để ôm, đĩa bay. Đồ chơi mới mở bằng quà hiếm. */
(function (N) {
  "use strict";
  function drop(it, x, y) {
    if (N.busy) return; var rm = N.$("rm"), r = rm.getBoundingClientRect(), D = N.store.D();
    var px = Math.max(12, Math.min(88, (x == null ? 30 + Math.random() * 40 : (x - r.left) / r.width * 100))), py = Math.max(66, Math.min(92, y == null ? 76 : (y - r.top) / r.height * 100));
    N.busy = true; var t = document.createElement("img"); t.className = "toyf"; t.src = N.art(it.id); t.style.left = px + "%"; t.style.top = py + "%"; rm.appendChild(t);
    N.petX(Math.max(22, Math.min(78, px + (px < 50 ? 14 : -14))), true); N.setExp("cun-joy"); N.store.bump("f", 25);
    var end = function () { t.remove(); N.setExp("cun", 0); N.store.get(); N.paint(); N.gainLove(2); N.doneQuest("play"); N.busy = false; N.petX(50); };
    N.later(function () {
      var say = N.rnd(D.say.play), word = it.label;
      if (it.id === "bong") { t.classList.add("bounce"); N.petAnim("hop", 1200); N.sfx.pop(); }
      else if (it.id === "vit-cao-su") { t.classList.add("sqk"); N.petAnim("wig", 1500); N.sfx.squeak(); N.later(N.sfx.squeak, 300); N.later(N.sfx.squeak, 600); say = "Quạc quạc!"; }
      else if (it.id === "xe") { t.classList.add("drive"); t.style.left = (px < 50 ? 88 : 12) + "%"; N.petX(px < 50 ? 80 : 20, false); N.sfx.tap(); }
      else if (it.id === "gau-bong") { t.style.left = "50%"; t.style.top = "86%"; N.setExp("cun-joy", 1800); N.hearts(4); say = "Ôm ôm!"; }
      else { t.classList.add("fly"); t.style.left = (px < 50 ? 85 : 15) + "%"; t.style.top = "40%"; N.later(function () { t.style.top = py + "%"; }, 1100); N.petAnim("hop", 1500); N.sfx.bark(); }
      N.say(say, "", 1800);
    }, 700);
    N.later(end, 3300);
  }
  N.care.play = {
    enter: function () { N.petX(50); },
    items: function (S) {
      var l = N.store.D().toys.filter(function (t) { return S.inv.toys.indexOf(t[0]) >= 0; }).map(function (t) { return { id: t[0], img: t[0], label: t[1] }; });
      return l.concat([{ id: "mg", img: "bong", label: "Trò chơi: Bi đớp bóng", mg: "ball" }]);   /* ô cuối = trò chơi có đếm giờ */
    },
    up: function (it, x, y) {
      if (it.mg) return N.mgStart(it.mg);
      var r = N.$("rm").getBoundingClientRect(); if (y > r.top && y < r.bottom && x > r.left && x < r.right) drop(it, x, y); else N.toast("Thả đồ chơi xuống sàn nhé!", 1200);
    },
    tap: function (it) { if (it.mg) N.mgStart(it.mg); else drop(it); }
  };
})(window.NTV);
