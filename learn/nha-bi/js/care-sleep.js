/* NGỦ: bấm đèn → phòng tối, Bi đi vào giường, ngáp, ngủ ("Zzz"), vài giây sau trời sáng, Bi vươn vai chào ngày mới. Bấm đèn lần nữa để đánh thức sớm. */
(function (N) {
  "use strict";
  var sleeping = false, timers = [];
  function T(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function zzz() {
    if (!sleeping) return; var r = N.petRect(), e = document.createElement("div"); e.className = "zzz"; e.textContent = "Z z z";
        e.style.left = (r.left - N.$("rm").getBoundingClientRect().left + r.width * .6) + "px";
    e.style.top = (r.top - N.$("rm").getBoundingClientRect().top + r.height * .15) + "px"; N.$("rm").appendChild(e); setTimeout(function () { e.remove(); }, 2000); T(zzz, 1100);
  }
  function wake(early) {
    timers.forEach(clearTimeout); timers = []; if (!sleeping) return; sleeping = false;
    N.$("rm").classList.remove("night"); N.setExp("cun-joy", 1800); N.petX(50); N.petAnim("hop", 1200); N.hearts(3);
    N.say(N.store.D().say.sleep[1], "", 1900); N.store.bump("f", early ? 8 : 18); N.gainLove(early ? 1 : 3); if (!early) N.doneQuest("sleep"); N.busy = false; N.renderTray();
  }
  function sleep() {
    if (N.busy) return; N.busy = true; sleeping = true; N.$("rm").classList.add("night"); N.petX(27); N.say(N.store.D().say.sleep[0], "", 1700);
    T(function () { N.setExp("cun-yawn"); N.sfx.yawn(); }, 900); T(function () { N.setExp("cun-sleep"); zzz(); }, 2300); T(function () { wake(false); }, 7500);
    N.busy = false; N.renderTray();
  }
  N.care.sleep = {
    enter: function () { N.petX(50); }, leave: function () { wake(true); },
    items: function () { return [{ id: "lamp", img: "den", on: sleeping, label: sleeping ? "Bật đèn" : "Tắt đèn" }]; },
    tap: function () { N.sfx.tap(); if (sleeping) wake(true); else sleep(); },
    up: function () { N.sfx.tap(); if (sleeping) wake(true); else sleep(); }
  };
})(window.NB);
