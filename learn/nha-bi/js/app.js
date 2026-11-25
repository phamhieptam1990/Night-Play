/* KHỞI ĐỘNG "Nhà của Bi" (Học Vui): vào thẳng nhà 5 khu → chăm Bi, mini-game; quà từ bài học Tiếng Việt (lesson-gifts.js) + điểm danh + nhiệm vụ ngày. */
(function (N) {
  "use strict";
  var D = NB_DATA, away = N.store.init(D);
  N.goWorld = function () { N.mgStop(); N.show("room"); N.paint(); N.renderTray(); };
  function lessonBtn() {   /* nút sách nổi: tới bài học Tiếng Việt để nhận quà */
    var a = document.createElement("a"); a.className = "wk-btn"; a.id = "lessonBtn"; a.href = N.lessonUrl(); a.setAttribute("aria-label", "Học bài để nhận quà");
    a.innerHTML = WorldKit.svg("book"); document.body.appendChild(a);
  }
  document.title = "Nhà của " + D.pet.name; N.$("pet").src = N.art("cun"); N.$("pet").alt = D.pet.name + ", " + D.pet.kind; document.querySelector("#pw .mud").src = N.art("cun-ban");
  N.paintIcons();
  N.hudInit(); lessonBtn(); N.collectionInit(); N.initRoom(); N.show("room"); N.enterZone("living"); N.paint(); N.initHabit();
  N.$("enNo").onclick = function () { N.sfx.tap(); N.mgClose(); };
  N.$("enGo").onclick = function () { N.sfx.tap(); N.mgAgain(); };
  if (away > 6) { N.setExp("cun-joy", 1800); N.hearts(4); N.say(N.rnd(D.say.miss), "", 2400); } else N.say(N.rnd(D.say.hi), "", 1600);
  setTimeout(function () { if (!N.collectLesson()) N.checkin(); }, 700);
  window.NBDebug = N;
})(window.NB);
