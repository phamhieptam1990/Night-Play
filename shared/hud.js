/* HUD GỌN của trang cổng khi KHÔNG có cột bên lề (GAME_RULES 0a-16). Nạp sau rails.js ở cozyplay/index.html + popplay/index.html: <script src="../shared/hud.js"></script> + <link rel="stylesheet" href="../shared/hud.css">.
   Bật khi: đang mở game (#stage.on), màn NGANG, KHÔNG có cột bên lề (.np-rails), game chưa tự gom nút vào thanh trên (.docked), và game có ít nhất một nút ? / 🔊 / ngôn ngữ.
   Điện thoại/iPad DỌC không đổi (thanh trên 68px + menu ⋯ của game). Nút ? 🔊 ngôn ngữ là nút thật trong game (cùng gốc, cùng id như khối HUD cột bên: bấm hộ), nút gốc ẩn bằng CSS chèn vào game (html.np-hudg).
   MỘT NƠI DUY NHẤT chứa nút điều khiển (GAME_RULES 0a-20): khối #npHudc này dùng CHUNG cho hai chế độ — (1) có cột bên lề: nằm trong khối HUD đầu cột trái (#npHslot do rails.js dựng), (3) không có cột: cột nút bên trái khung.
   THỨ TỰ cố định: ? 🔊 ngôn ngữ ↻ ⏸ 🏆 📷 📤 🔒 🍜 (← và tên game ở trên, nút thu gọn cột cạnh ←). Nút thật nằm trong game: bấm hộ, trạng thái phản chiếu CHỈ khi đổi; nút gốc trong game ẩn bằng CSS (html.np-hudg).
   Cao >= 620px: các nút dọc dưới ←. Thấp hơn: chỉ nút ⋯ mở thẻ nhỏ lưới 5 cột Ô ICON TO 60px (không chữ nhãn) bên phải cột nút (đóng khi chạm ngoài / Esc / chọn nút). Bài đo: scripts/cozygame/check-hud.js, check-onezone.js. */
(function () {
  "use strict";
  if (window.NPHud) return;
  var SVG = {
    help: '<path d="M9.2 9.2a2.9 2.9 0 1 1 4.6 2.3c-1 .8-1.8 1.3-1.8 2.7"/><path d="M12 18v.2"/>',
    snd: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    cam: '<path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.6"/>',
    shr: '<circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    rst: '<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
    board: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    theme: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
    more: '<circle cx="5.5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18.5" cy="12" r="1.6" fill="currentColor"/>'
  };
  function ico(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SVG[n] + "</svg>"; }
  var GAMEIDS = { help: ["bHelp", "phBtn"], snd: ["bSnd", "soundBtn"], lang: ["bLang", "langBtn"], theme: ["themeBtn2"], restart: ["restartBtn", "bRe"], pause: ["pauseBtn"], board: ["bBoard"], pass: ["nsPill"] };
  var KEYS = ["help", "snd", "lang", "theme", "restart", "pause", "board", "cam", "shr", "lock", "pass"];
  var HIDECSS = "html.np-hudg #bHelp,html.np-hudg #phBtn,html.np-hudg #bSnd,html.np-hudg #soundBtn,html.np-hudg #bLang,html.np-hudg #langBtn,html.np-hudg #themeBtn2,html.np-hudg #bCam,html.np-hudg #bShr,html.np-hudg #bRe,html.np-hudg #restartBtn,html.np-hudg #pauseBtn,html.np-hudg #bBoard,html.np-hudg #nsPill,html.np-hudg #bLock,html.np-hudg #bBk,html.np-hudg #bBack,html.np-hudg #homeBtn,html.np-hudg #npPmBk{display:none!important}";
  var stage = null, box = null, pn = null, more = null, btns = {}, active = false, small = false, tick = 0, hooked = null;
  var lab = { vi: { restart: "Chơi lại", pause: "Tạm dừng", board: "Bảng xếp hạng", pass: "Sự kiện", help: "Cách chơi", snd: "Âm thanh", lang: "Ngôn ngữ", theme: "Sáng / Tối", cam: "Chụp ảnh", shr: "Chia sẻ", lock: "Khoá màn hình", more: "Thêm" }, en: { restart: "Restart", pause: "Pause", board: "Leaderboard", pass: "Event", help: "How to play", snd: "Sound", lang: "Language", theme: "Light / Dark", cam: "Screenshot", shr: "Share", lock: "Lock screen", more: "More" } };
  function setA(e, k, v) { if (e.getAttribute(k) !== v) e.setAttribute(k, v); }
  function lg() { return ((document.documentElement.lang || "vi") + "").slice(0, 2) === "en" ? "en" : "vi"; }
  function gdoc() { try { var f = stage && stage.querySelector("iframe"); return f && f.contentDocument; } catch (e) { return null; } }
  function gel(ids) { var d = gdoc(); if (!d) return null; for (var i = 0; i < ids.length; i++) { var e = d.getElementById(ids[i]); if (e) return e; } return null; }
  function real(k) {
    if (k === "cam") return document.querySelector("#stage .nps-cam");
    if (k === "shr") return document.querySelector("#stage .nps-fab:not(.nps-cam)");
    if (k === "lock") return document.getElementById("klock");
    return gel(GAMEIDS[k]);
  }
  function usable(k, src) { if (!src) return false; if (k === "lock") return !src.hidden; try { return !src.hidden && !src.closest("[hidden]"); } catch (e) { return true; } }
  var MIRROR = { snd: 1, lang: 1, pass: 1, theme: 1 };
  function mk(k) {
    var b = document.createElement("button"); b.type = "button"; b.className = "np-hb"; b.dataset.k = k; b.hidden = true;
    if (k === "lang") b.textContent = "VI"; else if (k === "pass") b.textContent = "🍜"; else b.innerHTML = ico(k === "restart" ? "rst" : k);
    b.addEventListener("click", function () { var e = real(k); if (e) e.click(); setTimeout(sync, 120); if (small) close(); });
    btns[k] = b; return b;
  }
  function build() {
    box = document.createElement("div"); box.id = "npHudc"; box.setAttribute("role", "toolbar");
    more = document.createElement("button"); more.type = "button"; more.className = "np-hb np-hmore"; more.innerHTML = ico("more"); more.setAttribute("aria-expanded", "false");
    more.addEventListener("click", function () { box.classList.contains("open") ? close() : open(); });
    pn = document.createElement("div"); pn.className = "np-hpn";
    KEYS.forEach(function (k) { pn.appendChild(mk(k)); });
    box.appendChild(more); box.appendChild(pn); stage.appendChild(box);
  }
  function open() { box.classList.add("open"); more.setAttribute("aria-expanded", "true"); }
  function close() { if (!box) return; box.classList.remove("open"); more.setAttribute("aria-expanded", "false"); }
  function hideNative(on) {
    var d = gdoc(); if (!d || !d.documentElement) return;
    try { if (on === d.documentElement.classList.contains("np-hudg") && (!on || d.getElementById("npHudgCss"))) return; if (on && !d.getElementById("npHudgCss")) { var st = d.createElement("style"); st.id = "npHudgCss"; st.textContent = HIDECSS; (d.head || d.documentElement).appendChild(st); } d.documentElement.classList.toggle("np-hudg", !!on); } catch (e) {}
  }
  function sync() {
    if (!box) return;
    var L = lab[lg()], vis = 0;
    KEYS.forEach(function (k) {
      var b = btns[k], src = real(k), shown = usable(k, src);
      if (b.hidden === shown) b.hidden = !shown;
      if (shown) vis++; if (!src) return;
      if (MIRROR[k]) { var h = src.innerHTML.trim(); if (h && b.__h !== h) { b.__h = h; b.innerHTML = src.innerHTML; } }
      var al = src.getAttribute("aria-label") || src.title || L[k]; setA(b, "aria-label", al); if (b.title !== al) b.title = al;   /* ô icon: KHÔNG chữ nhãn, tên = aria-label + title */
      if (k === "pause") { var rs = /^(Tiếp tục|Chơi tiếp|Resume|Continue|Play on)/i.test(al) ? "play" : "pause"; if (b.__ic !== rs) { b.__ic = rs; b.innerHTML = ico(rs); } }   /* ⏸ ↔ ▶ theo trạng thái */
      if (src.hasAttribute("aria-pressed")) setA(b, "aria-pressed", src.getAttribute("aria-pressed")); else if (b.hasAttribute("aria-pressed")) b.removeAttribute("aria-pressed");
    });
    setA(more, "aria-label", L.more); if (more.title !== L.more) more.title = L.more;
    if (box.dataset.n !== String(vis)) box.dataset.n = vis;
  }
  function hook() {   /* chạm vào trong game (iframe không nổi bọt lên cổng) → đóng thẻ */
    var d = gdoc(); if (!d || hooked === d) return; hooked = d;
    try { d.addEventListener("pointerdown", close, true); d.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); }, true); } catch (e) {}
  }
  function want() {
    if (!stage || !stage.classList.contains("on")) return false;
    if (!(innerWidth > innerHeight)) return false;   /* dọc: thanh trên + menu ⋯ của game (một hàng) */
    return !!(real("help") || real("snd") || real("lang"));
  }
  /* khối nằm ở ĐÚNG MỘT chỗ: có cột bên lề → trong #npHslot (đầu cột trái); không → cột nút bên trái khung */
  function place() {
    var slot = document.getElementById("npHslot"), inRail = !!(slot && stage.classList.contains("np-rails-l"));
    if (inRail) { if (box.parentNode !== slot) slot.appendChild(box); } else if (box.parentNode !== stage) stage.appendChild(box);
    if (box.classList.contains("inrail") !== inRail) box.classList.toggle("inrail", inRail);
    return inRail;
  }
  function update() {
    if (!stage) return;
    var w = want(); if (w && !box) build();
    if (w !== active) { active = w; stage.classList.toggle("np-hudc", w); hideNative(w); if (!w) { close(); hooked = null; } }
    if (!w) { if (stage.classList.contains("np-hudc-sm")) stage.classList.remove("np-hudc-sm"); return; }
    var inRail = place();
    var sm = !inRail && innerHeight < 620; if (sm !== small) { small = sm; close(); } if (stage.classList.contains("np-hudc-sm") !== small) stage.classList.toggle("np-hudc-sm", small);
    hideNative(true); hook(); sync();
  }
  function park() { if (box && stage && box.parentNode !== stage) stage.appendChild(box); }
  function init() {
    stage = document.getElementById("stage"); if (!stage || tick) return;
    tick = setInterval(function () { if (!document.hidden) update(); }, 500);
    addEventListener("resize", update); addEventListener("orientationchange", function () { setTimeout(update, 250); });
    document.addEventListener("pointerdown", function (e) { if (box && box.classList.contains("open") && !box.contains(e.target)) close(); }, true);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    update();
  }
  window.NPHud = { update: update, park: park, keys: KEYS };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
