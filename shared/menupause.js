/* MỞ MENU ⋯ = TẠM DỪNG GAME; ĐÓNG MENU = ĐẾM 3-2-1 RỒI CHẠY TIẾP (trang game thường — chế độ Chơi cùng lúc đã có cơ chế riêng ở host; nạp từ shared/resume.js trừ ?multi=1).
   Nguồn "menu đang mở": bảng ⋯ của fan.js (#npFan.open, điện thoại dọc Cozy) và popmenu.js (#npPmFan.open, Pop), thẻ ⋯ của HUD ở trang cổng (hud.js gửi np-menu qua postMessage).
   Tạm dừng thật = đồng hồ ảo của bridge.js (NP.menuPause/menuResume: performance.now, rAF, setTimeout, setInterval, Date.now đóng băng + NP.onPause), nên MỌI game dừng đúng chỗ.
   Chỉ đếm 3-2-1 khi game đang chơi lúc mở menu (NP.playing()); ở màn chọn / sau ván thì chỉ chạy tiếp. Đóng menu giữa lúc đang đếm rồi mở lại: huỷ đếm, giữ tạm dừng. */
(function () {
  "use strict";
  if (window.__npMenuPause) return; window.__npMenuPause = true;
  var de = document.documentElement; if (de.classList.contains("np-multi")) return;
  var NPo = function () { return window.NP; }, rST = function () { return window.__npRST || setTimeout; };
  var open = false, wasPlaying = false, cdEl = null, cdRun = 0;
  var css = document.createElement("style"); css.id = "npMpCss";
  css.textContent = "html.np-menupaused *,html.np-menupaused *::before,html.np-menupaused *::after{animation-play-state:paused!important}" +
    "html.np-menupaused #npMpCd,html.np-menupaused #npMpCd *{animation-play-state:running!important}" +
    "#npMpCd{position:fixed;inset:0;z-index:2147482000;display:none;align-items:center;justify-content:center;background:rgba(10,8,25,.55);color:#fff;font:900 min(34vmin,140px)/1 system-ui,sans-serif;text-shadow:0 4px 20px rgba(0,0,0,.5);-webkit-user-select:none;user-select:none;touch-action:none}" +
    "#npMpCd.on{display:flex}#npMpCd b{animation:npMpPop .7s ease-out}@keyframes npMpPop{0%{transform:scale(1.6);opacity:0}25%{opacity:1}100%{transform:scale(1)}}";
  (document.head || de).appendChild(css);
  function cd() { if (!cdEl) { cdEl = document.createElement("div"); cdEl.id = "npMpCd"; cdEl.setAttribute("aria-live", "polite"); (document.body || de).appendChild(cdEl); } return cdEl; }
  function stopCount() { cdRun++; if (cdEl) { cdEl.classList.remove("on"); cdEl.textContent = ""; } }
  function set(v) {
    v = !!v; if (v === open) return; open = v; var NPn = NPo(); if (!NPn || !NPn.menuPause) return;
    if (v) { stopCount(); wasPlaying = !!(NPn.playing && NPn.playing()) || wasPlaying; NPn.menuPause(); return; }
    if (!wasPlaying) { NPn.menuResume(); return; }
    var run = ++cdRun, n = 3, el = cd(); el.classList.add("on");
    (function tick() {
      if (run !== cdRun) return; el.innerHTML = "<b>" + n + "</b>";
      rST()(function () { if (run !== cdRun) return; n--; if (n > 0) tick(); else { el.classList.remove("on"); el.textContent = ""; wasPlaying = false; var N2 = NPo(); N2 && N2.menuResume(); } }, 700);
    })();
  }
  /* menu của fan.js / popmenu.js: theo dõi lớp .open */
  var watched = {};
  function watch() {
    ["npFan", "npPmFan", "npFsPn"].forEach(function (id) {
      var el = document.getElementById(id); if (!el || watched[id] === el) return; watched[id] = el;
      new MutationObserver(function () { set(el.classList.contains("open")); }).observe(el, { attributes: true, attributeFilter: ["class"] });
      if (el.classList.contains("open")) set(true);
    });
  }
  watch(); setInterval(watch, 700);
  /* thẻ ⋯ của HUD ở trang cổng */
  addEventListener("message", function (e) {
    if (e.source !== parent || e.origin !== location.origin || !e.data || e.data.np !== 1 || e.data.type !== "np-menu") return; set(!!e.data.open);
  });
  addEventListener("pagehide", function () { if (open) { open = false; stopCount(); var N = NPo(); N && N.menuResume && N.menuResume(); } });
})();
