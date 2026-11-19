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
    if (!wasPlaying || (NPn.ownCountdown && NPn.ownCountdown())) { wasPlaying = false; NPn.menuResume(); return; }   /* game có 3-2-1 riêng khi resume (NP.onPause 3 tham số {countdown:true}): để game tự đếm */
    var run = ++cdRun, n = 3, el = cd(); el.classList.add("on");
    (function tick() {
      if (run !== cdRun) return; el.innerHTML = "<b>" + n + "</b>";
      rST()(function () { if (run !== cdRun) return; n--; if (n > 0) tick(); else { el.classList.remove("on"); el.textContent = ""; wasPlaying = false; var N2 = NPo(); N2 && N2.menuResume(); } }, 700);
    })();
  }
  /* NHIỀU NGƯỜI GIỮ tạm dừng (Control Center, xoay máy…): còn ai giữ thì còn dừng; hết người giữ → đếm 3-2-1 rồi chạy tiếp */
  var holders = {};
  window.__npMenuHold = function (key, on) { if (on) holders[key] = 1; else delete holders[key]; set(Object.keys(holders).length > 0 || menuOld); };
  var menuOld = false, setOld = set;
  /* PHÍM ENTER = TẠM DỪNG / CHƠI TIẾP nhanh (bàn phím): đang chơi → Enter dừng; Enter lần nữa → đếm 3-2-1 rồi chạy tiếp. Chặn Enter ở pha capture để game không coi là "bấm" (dừng đồng hồ, bắn trứng, đập ô…) */
  var pz = null;
  function pzEl() { if (!pz) { pz = document.createElement("div"); pz.id = "npMpPz"; pz.setAttribute("role", "status"); pz.style.cssText = "position:fixed;left:50%;top:max(14px,env(safe-area-inset-top));transform:translateX(-50%);z-index:2147482100;padding:10px 20px;border-radius:999px;background:rgba(20,18,40,.88);color:#fff;font:800 15px/1.2 system-ui,sans-serif;white-space:nowrap;pointer-events:none;display:none"; (document.body || de).appendChild(pz); } return pz; }
  addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
    var NPn = NPo(); if (!NPn || !NPn.menuPause) return;
    var t = e.target, tg = t && t.tagName;
    if (tg === "INPUT" || tg === "TEXTAREA" || tg === "SELECT" || (t && t.isContentEditable)) return;
    if (document.getElementById("ccRoot") && document.getElementById("ccRoot").classList.contains("on")) return;
    if (holders.key) { e.preventDefault(); e.stopPropagation(); pzEl().style.display = "none"; window.__npMenuHold("key", false); return; }
    if (open || Object.keys(holders).length) return;   /* đang dừng vì lý do khác (menu, xoay máy…) */
    if (!(NPn.playing && NPn.playing())) return;       /* chỉ khi ĐANG CHƠI: ở màn chọn/kết thúc Enter vẫn làm việc của nó */
    e.preventDefault(); e.stopPropagation();
    var z = pzEl(); z.textContent = (document.documentElement.lang || "vi").slice(0, 2) === "en" ? "⏸ Paused · press Enter to resume" : "⏸ Tạm dừng · nhấn Enter để chơi tiếp"; z.style.display = "block";
    window.__npMenuHold("key", true);
  }, true);
  /* XOAY MÁY: đang chơi mà xoay dọc↔ngang → dừng ngay; xoay xong (không đổi cỡ ~0,7 giây) → đếm 3-2-1 rồi chơi tiếp */
  var land0 = innerWidth > innerHeight, rotT = 0;
  function onRot() {
    var l = innerWidth > innerHeight, NPn = NPo();
    if (l !== land0) { land0 = l; if ((NPn && NPn.playing && NPn.playing()) || open) window.__npMenuHold("rot", true); }
    if (holders.rot) { clearTimeout(rotT); rotT = rST()(function () { window.__npMenuHold("rot", false); }, 700); }
  }
  addEventListener("resize", onRot); addEventListener("orientationchange", onRot);
  /* menu của fan.js / popmenu.js: theo dõi lớp .open */
  var watched = {};
  function watch() {
    ["npFan", "npPmFan", "npFsPn"].forEach(function (id) {
      var el = document.getElementById(id); if (!el || watched[id] === el) return; watched[id] = el;
      new MutationObserver(function () { menuOld = el.classList.contains("open"); set(menuOld || Object.keys(holders).length > 0); }).observe(el, { attributes: true, attributeFilter: ["class"] });
      if (el.classList.contains("open")) { menuOld = true; set(true); }
    });
  }
  watch(); setInterval(watch, 700);
  /* thẻ ⋯ của HUD ở trang cổng */
  addEventListener("message", function (e) {
    if (e.source !== parent || e.origin !== location.origin || !e.data || e.data.np !== 1 || e.data.type !== "np-menu") return; set(!!e.data.open);
  });
  /* đổi ngôn ngữ / giao diện lúc đang tạm dừng: cho game vẽ lại ngay (không chờ hết 3-2-1) */
  document.addEventListener("click", function (e) { var t = e.target && e.target.closest && e.target.closest("#bLang,#langBtn,#themeBtn2"); if (!t || !open) return; rST()(function () { var N = NPo(); N && N.menuNudge && N.menuNudge(220); }, 30); }, true);
  addEventListener("pagehide", function () { if (open) { open = false; stopCount(); var N = NPo(); N && N.menuResume && N.menuResume(); } });
})();
