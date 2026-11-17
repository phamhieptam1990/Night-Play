/* TOÀN MÀN HÌNH cho MỌI game (nạp từ shared/resume.js, trừ ?multi=1): nút ⛶ #npFsBtn nằm cùng nhóm nút phụ (tự vào menu ⋯ của fan.js / popmenu.js / cột HUD của hud.js như #npMcBtn).
   Bấm → trang game vào toàn màn hình thật (Fullscreen API: ẩn thanh địa chỉ/thanh công cụ trình duyệt, iPad Safari + máy tính; iPhone Safari không hỗ trợ → vẫn vào chế độ khung đầy cửa sổ) và
   "biến thành khung game của Chơi cùng lúc": ẩn thanh trên + nút nổi, chỉ còn khung chơi + HUD điểm; MỘT nút thu nhỏ ⤡ (#npFsExit) ở góc trên-phải để quay về như cũ. Esc / thoát của trình duyệt cũng quay về.
   Không đổi trạng thái ván (không tải lại trang). Lớp html.np-fs; CSS dưới đây ẩn cùng danh sách nút như shared/multi.css. */
(function () {
  "use strict";
  if (window.__npFs) return; window.__npFs = true;
  var ID = "npFsBtn", XID = "npFsExit", de = document.documentElement, api = false;
  var vi = function () { return (de.lang || "vi") === "vi"; };
  var EXPAND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:22px;height:22px;display:block;margin:auto"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  var SHRINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:20px;height:20px;display:block"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  var css = document.createElement("style"); css.id = "npFsCss";
  css.textContent =
    "html.np-fs .top,html.np-fs #npFab,html.np-fs #npFan,html.np-fs #npPmFab,html.np-fs #npPmFan,html.np-fs #npPmBk,html.np-fs #npPmShr,html.np-fs #npPmCam,html.np-fs #npPmLock,html.np-fs #npResume,html.np-fs #npInApp,html.np-fs #npTitle,html.np-fs .nps-fab,html.np-fs #bCam,html.np-fs #bShr,html.np-fs #nsPill,html.np-fs #npHudc,html.np-fs #npFsBtn{display:none!important}" +
    "#" + XID + "{display:none}" +
    "html.np-fs #" + XID + "{display:flex;position:fixed;z-index:2147483000;top:max(8px,env(safe-area-inset-top));right:max(8px,env(safe-area-inset-right));width:44px;height:44px;border-radius:50%;align-items:center;justify-content:center;padding:0;border:1px solid rgba(255,255,255,.4);background:rgba(14,12,32,.78);color:#fff;opacity:.75;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}" +
    "html.np-fs #" + XID + ":hover,html.np-fs #" + XID + ":focus-visible{opacity:1}";
  (document.head || de).appendChild(css);

  function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function relayout() { try { requestAnimationFrame(function () { requestAnimationFrame(function () { window.dispatchEvent(new Event("resize")); }); }); } catch (e) {} }
  function label() { return vi() ? "Toàn màn hình" : "Full screen"; }
  function labelX() { return vi() ? "Thu nhỏ về như cũ" : "Exit full screen"; }
  function enter() {
    if (de.classList.contains("np-fs")) return;
    de.classList.add("np-fs"); api = false;
    try { var r = de.requestFullscreen || de.webkitRequestFullscreen; if (r) { var p = r.call(de, { navigationUI: "hide" }); api = true; if (p && p.catch) p.catch(function () { api = false; }); } } catch (e) { api = false; }
    var x = document.getElementById(XID); if (x) { x.setAttribute("aria-label", labelX()); x.title = labelX(); }
    relayout();
  }
  function exit() {
    if (!de.classList.contains("np-fs")) return;
    de.classList.remove("np-fs");
    try { if (fsEl()) { var e = document.exitFullscreen || document.webkitExitFullscreen; e && e.call(document); } } catch (e) {}
    relayout();
  }
  function onFsChange() { if (api && !fsEl() && de.classList.contains("np-fs")) { de.classList.remove("np-fs"); relayout(); } }
  document.addEventListener("fullscreenchange", onFsChange); document.addEventListener("webkitfullscreenchange", onFsChange);
  addEventListener("keydown", function (e) { if (e.key === "Escape" && de.classList.contains("np-fs") && !api) exit(); }, true);

  function top() { var p = document.getElementById("play"); return (p && p.querySelector(".top")) || document.querySelector(".top"); }
  function sync() {
    var t = top(), b = document.getElementById(ID);
    if (!t) { if (b) b.remove(); return; }
    if (!b) {
      var ref = document.getElementById("npMcBtn") || document.getElementById("npChBtn") || document.getElementById("bSnd") || document.getElementById("soundBtn");
      b = document.createElement("button"); b.type = "button"; b.id = ID; b.className = (ref && ref.className.replace(/\b(np-snd-off|on|off|hot|lk)\b/g, "").trim()) || "ib";
      b.innerHTML = EXPAND; b.addEventListener("click", enter);
      if (ref && ref.parentNode === t) t.insertBefore(b, ref); else t.appendChild(b);
    }
    var lab = label(); if (b.getAttribute("aria-label") !== lab) { b.setAttribute("aria-label", lab); b.title = lab; }
    if (!document.getElementById(XID)) {
      var x = document.createElement("button"); x.type = "button"; x.id = XID; x.innerHTML = SHRINK; x.setAttribute("aria-label", labelX()); x.title = labelX(); x.addEventListener("click", exit);
      (document.body || de).appendChild(x);
    }
  }
  sync(); setInterval(sync, 2000);
})();
