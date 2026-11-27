/* KHỞI ĐỘNG "Nhà Của Bi": màn chọn #home tối giản (▶ vào nhà) → thế giới 5 khu → mini-game. Game thuần chơi: quà từ điểm danh, nhiệm vụ ngày, lên cấp, mini-game. */
(function (N) {
  "use strict";
  var D = NTV_DATA, away = N.store.init(D, N.helper), CHAL = null;
  N.goWorld = function () { N.mgStop(); N.show("room"); N.paint(); N.renderTray(); };
  N.goHome = function () { N.mgStop(); N.show("home"); };
  /* WorldKit nằm đè đầu sân khấu: báo cho kit biết hàng ← ⋯ của cổng cao bao nhiêu (--wk-off) và chừa chỗ cho cảnh (--hudH) */
  N.syncOff = function () {
    var de = document.documentElement, pm = de.classList.contains("np-pm") && (innerHeight > innerWidth || de.hasAttribute("data-pm-all")), play = de.classList.contains("np-playing");
    var off = de.hasAttribute("data-pm-all") ? 70 : play ? (pm ? 64 : 0) : Math.max(0, Math.round(N.$("play").getBoundingClientRect().top));   /* toàn màn hình: HUD nằm dưới hàng ← ⋯ */
    de.style.setProperty("--wk-off", off + "px"); de.style.setProperty("--hudH", (off + 68) + "px");
  };
  addEventListener("resize", function () { N.syncOff(); }); setInterval(N.syncOff, 500);   /* np-playing do bridge.js bật chậm hơn lúc đổi màn */
  N.openCh = function (CH) {
    CHAL = CH; var k = CH.g === "ball" ? "bong" : "sao"; N.$("chR").innerHTML = '<span class="ri"><img src="' + N.art(k) + '" alt=""><b>' + CH.sc + "</b></span>"; N.$("ovCh").hidden = false;
  };
  function bind() {
    N.paintIcons();
    N.$("homeBtn").onclick = function () { N.sfx.tap(); if (N.screen === "room" && !N.mgActive()) N.goHome(); else N.goWorld(); };
    N.$("playTile").onclick = function () { N.sfx.tap(); N.goWorld(); N.checkin(); };
    N.$("enNo").onclick = function () { N.sfx.tap(); N.mgClose(); };
    N.$("enGo").onclick = function () { N.sfx.tap(); N.mgAgain(); };
    N.$("enShare").onclick = function () { N.share(N.mgLast()); };
    N.$("chNo").onclick = function () { CHAL = null; N.$("ovCh").hidden = true; };
    N.$("chGo").onclick = function () {
      if (!CHAL) return; var c = CHAL, z = D.mg[c.g].zone; CHAL = null; N.$("ovCh").hidden = true; N.goWorld(); N.goZone(z);
      setTimeout(function () { N.mgStart(c.g, { seed: c.s, ch: c }); }, 1600);
    };
    N.$("soundBtn").onclick = function () { var on = !(window.NPAudio ? NPAudio.get() : true); if (window.NPAudio) NPAudio.set(on); sync(); };
  }
  function sync() { var on = window.NPAudio ? NPAudio.get() : true; N.$("soundBtn").textContent = on ? "🔊" : "🔇"; N.$("soundBtn").setAttribute("aria-pressed", on); }
  addEventListener("storage", function (e) { if (e.key === "theme") document.documentElement.dataset.theme = e.newValue || "light"; });
  bind(); sync(); N.hudInit(); N.initRoom(); N.show("home"); N.enterZone("living"); N.paint(); N.initHabit();
  if (away > 6) { N.setExp("cun-joy", 1800); N.hearts(4); N.say(N.rnd(D.say.miss), "", 2400); } else N.say(N.rnd(D.say.hi), "", 1600);
  N.bootFromBridge();
  window.NTVDebug = N;
})(window.NTV);
