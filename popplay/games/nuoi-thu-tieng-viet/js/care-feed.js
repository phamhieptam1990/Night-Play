/* ĂN: kéo món vào miệng Bi (hoặc chạm món). Bi nhai, má phồng, đọc TÊN MÓN thành chữ to ("xương"), rồi cười. Mỗi lần ăn tốn 1 món trong kho. */
(function (N) {
  "use strict";
  function eat(id, name) {
    var S = N.store.get(), D = N.store.D(); if (N.busy || S.inv.food[id] < 1) return;
    N.busy = true; S.inv.food[id]--; N.store.bump("h", 28); N.setExp("cun-chew", 1700, "cun-joy"); N.sfx.chomp(); N.petAnim("sq", 600);
    N.say(N.rnd(D.say.feed), "", 1900); N.paint(); N.renderTray();
    N.later(function () { N.setExp("cun-joy", 1200); N.hearts(3); N.gainLove(2); N.doneQuest("feed"); N.busy = false;
      N.later(function () { if (N.exp === "cun-joy") N.setExp("cun"); }, 1200);
    }, 1700);
  }
  function flyTo(it, x, y) {   /* chạm: món bay từ khay tới miệng rồi Bi ăn */
    var m = N.mouth(), g = document.createElement("div"), pr = N.$("play").getBoundingClientRect(); g.className = "drag"; g.innerHTML = '<img src="' + N.art(it.img) + '" alt="">';
    g.style.cssText = "left:" + ((x || m.x) - pr.left) + "px;top:" + ((y || m.y + 90) - pr.top) + "px;transition:left .4s,top .4s,transform .4s"; N.$("play").appendChild(g);
    requestAnimationFrame(function () { g.style.left = (m.x - pr.left) + "px"; g.style.top = (m.y - pr.top) + "px"; g.style.transform = "translate(-50%,-62%) scale(.5)"; });
    setTimeout(function () { g.remove(); eat(it.id, it.label); }, 420);
  }
  N.care.feed = {
    enter: function () { N.petX(50); },
    items: function (S) { var D = N.store.D(); return D.foods.map(function (f) { return { id: f[0], img: f[0], n: S.inv.food[f[0]], off: S.inv.food[f[0]] < 1, label: f[1] }; }); },
    offMsg: function (it) { return "Hết " + it.label + "! Học một bài để nhận thêm"; },
    up: function (it, x, y) {
      var m = N.mouth(); if (Math.hypot(x - m.x, y - m.y) < m.r * 1.35 || N.overPet(x, y)) eat(it.id, it.label); else N.toast("Đưa vào miệng Bi nhé!", 1200);
    },
    tap: function (it, x, y) { if (!N.busy) flyTo(it, x, y); }
  };
})(window.NTV);
