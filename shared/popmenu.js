/* Pop Play, điện thoại DỌC (<=520px): gom các nút rời trên thanh trên (🔊 âm thanh, EN/VI, "?" cách chơi, ⏸ tạm dừng) + 📷 chụp ảnh + 📤 chia sẻ của TRANG CỔNG
   vào MỘT nút menu ⋯ (48px); bấm mở bảng 3 cột có nhãn chữ. Thanh trên chỉ còn: nút ← (một nút duy nhất) | tên game | ⋯.
   - Không tạo chức năng mới: chỉ DI CHUYỂN các nút có sẵn (giữ id + sự kiện) vào bảng; 📷/📤 bấm hộ nút nổi của trang cổng (.nps-cam / .nps-fab).
   - Bố cục: ← và ⋯ là nút CỐ ĐỊNH ở hai góc trên; TÊN GAME (h1) vẫn nằm trong luồng ngay trên khung nội dung (sát khung thông tin), không nằm trong thanh trên.
   - Nút ←: đang chơi (🏠 #homeBtn hoặc ⏸ #pauseBtn đang hiện) = về màn chọn của game (bấm #homeBtn, hoặc goHome() nếu game không có); đang ở màn chọn = thoát về trang cổng
     (bấm #home của cổng, nên vẫn qua hộp "Thoát ván này?"). Mở trực tiếp (không qua cổng) ở màn chọn: ẩn ←.
   - Báo cho trang cổng: window.__npDock = true khi đã gom (cổng thêm class #stage.docked: ẩn ← + 📷/📤 nổi của cổng, iframe chiếm toàn khung). Màn ngang/rộng: không đổi gì, __npDock = false.
   - HOOK KHOÁ MÀN (shared/kidlock.js): khi khoá, kidlock đặt class "np-locked" lên <html> của game → ẩn #npPmBk (nút ←) và ô 📷/📤 trong bảng (CSS bên dưới).
     Nút khoá (#klock) của cổng nằm ngay bên phải ← (x≈62px); chỉ báo khoá (#klind) chiếm chỗ ← khi đã khoá.
   - Màu bảng lấy theo MÀU THẬT của game (đọc computed style mỗi lần mở: sáng/tối, Night Pass), không nền trắng chữ đen.
   - iPad/máy tính bảng cảm ứng DỌC (pointer:coarse, ≤900px rộng): như trên nhưng 🔊 và ← ở NGOÀI menu (🔊 cố định cạnh ⋯), ô bảng 88px. iPad ngang / máy tính chuột: không gom.
   Nhúng sau pophelp.js/popfit.js: <script src="../../../shared/popmenu.js" defer></script> */
(function () {
  "use strict";
  if (document.documentElement.classList.contains("np-multi")) return;   /* chế độ chơi cùng lúc (?multi=1): host lo các nút */
  var top = document.querySelector(".top"); if (!top) return;
  var mqP = matchMedia("(max-width:520px) and (orientation:portrait)"), mqT = matchMedia("(pointer:coarse) and (orientation:portrait) and (max-width:900px)"), cur = "";
  /* "p" = điện thoại dọc (gom cả 🔊); "t" = máy tính bảng cảm ứng dọc (iPad 768/834 rộng): giữ ← và 🔊 ngoài menu, gom phần còn lại; máy tính chuột / màn ngang: "" (không gom) */
  var mode = function () { return mqP.matches ? "p" : mqT.matches ? "t" : ""; };
  var de = document.documentElement;
  var par = null; try { par = window.parent !== window ? window.parent : null; if (par) par.document.getElementById("stage"); } catch (e) { par = null; }
  if (par && !par.document.getElementById("stage")) par = null;
  var pd = par && par.document;
  var vi = function () { return (de.lang || "vi").slice(0, 2) !== "en"; };
  var $ = function (id) { return document.getElementById(id); };
  var S = 'viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;margin:0;flex:none"';
  var ICO = {
    cam: "<svg " + S + '><path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.6"/></svg>',
    shr: "<svg " + S + '><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block"><path d="M15 5l-7 7 7 7"/></svg>',
    dots: '<svg class="d" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>',
    x: '<svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    lock: "<svg " + S + '><rect x="5" y="11" width="14" height="10" rx="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    pause: "<svg " + S + '><path d="M8 5v14M16 5v14"/></svg>'
  };
  /* thứ tự trong bảng: [vai trò, id nút, nhãn vi, nhãn en] */
  var ROLES = [["snd", "soundBtn", "Âm thanh", "Sound"], ["lang", "langBtn", "Ngôn ngữ", "Language"], ["help", "phBtn", "Hướng dẫn", "Help"], ["pause", "pauseBtn", "Tạm dừng", "Pause"], ["lock", "npPmLock", "Khoá màn", "Lock"], ["cam", "npPmCam", "Chụp ảnh", "Photo"], ["shr", "npPmShr", "Chia sẻ", "Share"]];

  var st = document.createElement("style");
  st.textContent =
    "#npPmBk,#npPmFab,#npPmFan{display:none}" +
    "html.np-pm body{padding-top:calc(60px + env(safe-area-inset-top,0px))!important;box-sizing:border-box}html.np-pm .top h1{max-width:100%}html.np-pm #npPmBk{display:grid;position:fixed;z-index:45;left:12px;top:calc(env(safe-area-inset-top,0px) + 8px)}html.np-pm.np-hidebk #npPmBk{display:none}html.np-locked #npPmBk{display:none!important}" +
    "html.np-pm #homeBtn{display:none!important}" +
    "#npPmBk,#npPmFab{place-items:center;width:48px;height:48px;min-width:48px;min-height:48px;padding:0;border-radius:50%;flex:none;cursor:pointer;box-sizing:border-box}" +
    "#npPmBk{background:var(--panel,#fff);color:var(--ink,#222);border:1.5px solid color-mix(in srgb,currentColor 42%,transparent);box-shadow:var(--shadow,0 3px 10px rgba(0,0,0,.25))}" +
    "html.np-pm #npPmFab{display:grid;position:fixed;z-index:45;right:12px;top:calc(env(safe-area-inset-top,0px) + 8px);color:var(--npon,var(--on-accent,#fff));background:var(--npacc,var(--accent,#7C5CFF));border:2px solid rgba(255,255,255,.55);box-shadow:0 3px 10px rgba(0,0,0,.32)}" +
    "#npPmFab svg{width:24px;height:24px;display:block;grid-area:1/1;transition:opacity .2s,transform .25s}#npPmFab .x{opacity:0;transform:rotate(-90deg) scale(.6)}" +
    "#npPmFab.open .d{opacity:0;transform:scale(.6)}#npPmFab.open .x{opacity:1;transform:none}" +
    "#npPmFab.nudge{animation:npPmNudge 1.1s ease-in-out 4}@keyframes npPmNudge{0%,100%{transform:scale(1)}40%{transform:scale(1.16)}}" +
    "#npPmBk:active,#npPmFab:active{filter:brightness(.92)}#npPmBk:focus-visible,#npPmFab:focus-visible{outline:3px solid var(--accent,#fff);outline-offset:3px}" +
    "html.np-pm #npPmFan{display:block;position:static}" +
    "#npPmFan .bk{position:fixed;inset:0;z-index:60;background:rgba(12,8,28,.38);opacity:0;pointer-events:none;transition:opacity .2s}#npPmFan.open .bk{opacity:1;pointer-events:auto}" +
    "#npPmFan .pn{position:fixed;z-index:61;right:12px;top:calc(env(safe-area-inset-top,0px) + 60px);display:grid;grid-template-columns:repeat(3,68px);gap:8px;padding:10px;border-radius:18px;background:var(--npbg,var(--panel,#fff));color:var(--npink,inherit);border:1.5px solid var(--npacc,var(--accent,#7C5CFF));box-shadow:0 10px 30px rgba(0,0,0,.4);transform-origin:top right;opacity:0;transform:scale(.7);pointer-events:none;transition:transform .22s cubic-bezier(.2,1.3,.4,1),opacity .15s}" +
    "#npPmFan.open .pn{opacity:1;transform:scale(1);pointer-events:auto}" +
    "#npPmFan .it{position:static!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:3px;width:68px!important;height:64px!important;min-width:0!important;min-height:0!important;margin:0!important;padding:4px 2px!important;border-radius:14px!important;" +
    "font-size:15px!important;font-weight:800;line-height:1;box-shadow:none!important;transform:none!important;animation:none!important;opacity:1!important;color:var(--npink,inherit)!important;background:color-mix(in srgb,var(--npink,#888) 9%,var(--npbg,transparent))!important;border:1.5px solid var(--npline,rgba(128,128,128,.4))!important}" +
    "#npPmFan .it svg{width:22px!important;height:22px!important;flex:none}" +
    "#npPmFan .it::after{content:attr(data-l);font:700 10.5px/1.05 system-ui,sans-serif;max-width:64px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.88}" +
    "#npPmFan .it[hidden]{display:none!important}html.np-locked #npPmCam,html.np-locked #npPmShr,html.np-locked #npPmLock,html.np-locked #npPmFab,html.np-locked #npPmFan{display:none!important}" +
    "html.np-pm #soundBtn{position:fixed!important;z-index:45;right:68px;top:calc(env(safe-area-inset-top,0px) + 8px);width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;margin:0!important}" +
    "html.np-tab #npPmFan .pn{grid-template-columns:repeat(3,88px);gap:10px;padding:12px;top:calc(env(safe-area-inset-top,0px) + 66px)}html.np-tab #npPmFan .it{width:88px!important;height:84px!important}html.np-tab #npPmFan .it svg{width:28px!important;height:28px!important}html.np-tab #npPmFan .it::after{font-size:13px;max-width:84px}" +
    "@media (prefers-reduced-motion:reduce){#npPmFab svg,#npPmFan .bk,#npPmFan .pn{transition:none!important}#npPmFab.nudge{animation:none}}";
  document.head.appendChild(st);

  var bk, fab, fan, panel, cam, shr, lck, probe, open = false, moved = false, saved = [], order = [];
  function mk(tag, id, cls) { var e = document.createElement(tag); if (id) e.id = id; if (cls) e.className = cls; if (tag === "button") e.type = "button"; return e; }
  function build() {
    if (fab) return;
    bk = mk("button", "npPmBk", "ib"); bk.innerHTML = ICO.back;
    fab = mk("button", "npPmFab"); fab.innerHTML = ICO.dots + ICO.x; fab.setAttribute("aria-haspopup", "true"); fab.setAttribute("aria-expanded", "false");
    fan = mk("div", "npPmFan"); var d = mk("div", null, "bk"); fan.appendChild(d); panel = mk("div", null, "pn"); panel.setAttribute("role", "menu"); fan.appendChild(panel);
    if (pd) {   /* 📷 / 📤 bấm hộ nút nổi của trang cổng */
      var click = function (sel) { return function () { var e = pd.querySelector(sel); if (e && !e.disabled) e.click(); }; };
      cam = mk("button", "npPmCam"); cam.innerHTML = ICO.cam; cam.addEventListener("click", click(".nps-cam"));
      lck = mk("button", "npPmLock"); lck.innerHTML = ICO.lock; lck.addEventListener("click", click("#klock"));
      shr = mk("button", "npPmShr"); shr.innerHTML = ICO.shr; shr.addEventListener("click", click(".nps-fab:not(.nps-cam)"));
    }
    top.insertBefore(bk, top.firstChild); top.appendChild(fan); top.appendChild(fab);
    bk.addEventListener("click", back);
    fab.addEventListener("click", function (e) { e.stopPropagation(); setOpen(!open); });
    d.addEventListener("click", function () { setOpen(false); });
    panel.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest(".it"); if (b) setTimeout(function () { setOpen(false); }, 0); });
    addEventListener("keydown", function (e) { if (e.key === "Escape" && open) { e.stopPropagation(); setOpen(false); fab.focus(); } }, true);
  }
  function playing() { var h = $("homeBtn"), p = $("pauseBtn"); return !!((h && !h.hidden) || (p && !p.hidden)); }
  function back() {
    if (playing()) { var h = $("homeBtn"); if (h) h.click(); else if (typeof window.goHome === "function") window.goHome(); }
    else if (pd) { var e = pd.getElementById("home"); if (e) e.click(); }
  }
  function labels() {
    if (!fab) return; var v = vi(), t = v ? (open ? "Đóng menu" : "Mở menu") : (open ? "Close menu" : "Open menu");
    fab.setAttribute("aria-label", t); fab.title = t;
    var b = playing() ? (v ? "Về màn chọn" : "Back to menu") : (v ? "Thoát" : "Exit"); bk.setAttribute("aria-label", b); bk.title = b;
    ROLES.forEach(function (r) { var e = $(r[1]); if (e && e.parentNode === panel) { e.setAttribute("data-l", v ? r[2] : r[3]); if (r[0] === "cam" || r[0] === "shr" || r[0] === "lock") { e.setAttribute("aria-label", v ? r[2] : r[3]); e.title = v ? r[2] : r[3]; } } });
    if (lck) { var kl = pd && pd.getElementById("klock"); lck.hidden = !kl || kl.hidden; }   /* webview app / Night Play: kidlock ẩn nút thì ô khoá cũng ẩn */
    de.classList.toggle("np-hidebk", !pd && !playing());   /* mở trực tiếp ở màn chọn: không có chỗ để thoát */
  }
  /* màu THẬT của game (như shared/fan.js): chữ, nền, viền, màu nhấn */
  function rgba(s) { var m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null; var q = m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat); return { r: q[0], g: q[1], b: q[2], a: q.length > 3 && !isNaN(q[3]) ? q[3] : 1 }; }
  var lum = function (c) { return (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255; };
  var css = function (c, a) { return "rgba(" + Math.round(c.r) + "," + Math.round(c.g) + "," + Math.round(c.b) + "," + (a == null ? c.a : a) + ")"; };
  function resolve(color) { if (!color) return null; if (!probe) { probe = document.createElement("i"); probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden"; fan.appendChild(probe); } probe.style.color = ""; probe.style.color = color; return rgba(getComputedStyle(probe).color); }
  function solidBg(el) { for (var e = el; e && e.nodeType === 1; e = e.parentElement) { var c = rgba(getComputedStyle(e).backgroundColor); if (c && c.a >= 0.9) return c; } return null; }
  function themeSync() {
    if (!fan) return;
    var cs = getComputedStyle(bk), ink = rgba(cs.color) || rgba(getComputedStyle(document.body).color) || { r: 30, g: 20, b: 20, a: 1 };
    var dark = lum(ink) > 0.55, bg = rgba(cs.backgroundColor); if (!bg || bg.a < 0.9) bg = solidBg(top) || (dark ? { r: 28, g: 34, b: 64, a: 1 } : { r: 255, g: 250, b: 240, a: 1 });
    if (lum(bg) > 0.55 === dark) bg = dark ? { r: 28, g: 34, b: 64, a: 1 } : { r: 255, g: 250, b: 240, a: 1 };
    var line = rgba(cs.borderTopColor); if (!line || line.a < 0.2) line = ink;
    var acc = resolve(getComputedStyle(de).getPropertyValue("--accent").trim()) || ink, on = lum(acc) > 0.6 ? { r: 20, g: 18, b: 31, a: 1 } : { r: 255, g: 255, b: 255, a: 1 };
    [fan, fab].forEach(function (n) { n.style.setProperty("--npbg", css(bg, 1)); n.style.setProperty("--npink", css(ink, 1)); n.style.setProperty("--npline", css(line, 0.35)); n.style.setProperty("--npacc", css(acc, 1)); n.style.setProperty("--npon", css(on, 1)); });
  }
  function setOpen(v) { if (v) themeSync(); open = v; fan.classList.toggle("open", v); fab.classList.toggle("open", v); fab.classList.remove("nudge"); fab.setAttribute("aria-expanded", String(v)); labels(); }

  function flag(v) { try { window.__npDock = v; if (pd) { var s = pd.getElementById("stage"); if (s) s.classList.toggle("docked", v); } } catch (e) {} }
  function adopt() {
    var m = mode(); if (!m) return; if (moved && cur !== m) restore();
    build();
    if (!moved) { moved = true; cur = m; de.classList.toggle("np-tab", m === "t"); order = Array.prototype.slice.call(top.children); de.classList.add("np-pm"); flag(true); if (!$("phBtn") || $("phBtn").classList.contains("ph-new")) fab.classList.add("nudge"); }
    if (cam && !cam.parentNode) { cam.className = shr.className = lck.className = "ib"; }
    ROLES.forEach(function (r) {
      if (r[0] === "snd") return;   /* 🔊 luôn ở NGOÀI menu, cố định cạnh ⋯ */
      var e = $(r[1]) || (r[1] === "npPmCam" ? cam : r[1] === "npPmShr" ? shr : r[1] === "npPmLock" ? lck : null);
      if (!e || e.parentNode === panel) return;
      if (e.parentNode !== top && e !== cam && e !== shr && e !== lck) return;
      if (e.parentNode === top) saved.push(e);
      e.classList.add("it"); panel.appendChild(e);
    });
    labels(); themeSync();
  }
  function restore() {
    if (!moved) return;
    setOpen(false); de.classList.remove("np-pm", "np-tab"); flag(false);
    saved.forEach(function (e) { e.classList.remove("it"); e.removeAttribute("data-l"); });
    order.forEach(function (e) { if (saved.indexOf(e) >= 0) top.insertBefore(e, fan); });
    saved.forEach(function (e) { if (e.parentNode === panel) top.insertBefore(e, fan); });
    saved = []; moved = false;
    [cam, shr, lck].forEach(function (e) { if (e && e.parentNode) e.parentNode.removeChild(e); });
  }
  function sync() { if (mode()) adopt(); else restore(); }

  try { new MutationObserver(function () { if (mode()) adopt(); }).observe(top, { childList: true }); } catch (e) {}
  try { new MutationObserver(function () { if (fab) labels(); }).observe(top, { attributes: true, subtree: true, attributeFilter: ["hidden", "style", "lang"] }); } catch (e) {}
  try { new MutationObserver(function () { if (fab) labels(); }).observe(de, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
  try { new MutationObserver(function () { if (moved) themeSync(); }).observe(de, { attributes: true, attributeFilter: ["data-theme", "class", "style"] }); } catch (e) {}
  [mqP, mqT].forEach(function (q) { try { q.addEventListener("change", sync); } catch (e) { try { q.addListener(sync); } catch (e2) {} } });
  addEventListener("pagehide", function () { flag(false); });
  function init() { sync(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  setTimeout(sync, 600); setTimeout(sync, 2000);
})();
