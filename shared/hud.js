/* HUD GỌN của trang cổng khi KHÔNG có cột bên lề (GAME_RULES 0a-15). Nạp sau rails.js ở cozyplay/index.html + popplay/index.html: <script src="../shared/hud.js"></script> + <link rel="stylesheet" href="../shared/hud.css">.
   Bật khi: đang mở game (#stage.on), màn NGANG, KHÔNG có cột bên lề (.np-rails), game chưa tự gom nút vào thanh trên (.docked), và game có ít nhất một nút ? / 🔊 / ngôn ngữ.
   Điện thoại/iPad DỌC không đổi (thanh trên 68px + menu ⋯ của game). Nút ? 🔊 ngôn ngữ là nút thật trong game (cùng gốc, cùng id như khối HUD cột bên: bấm hộ), nút gốc ẩn bằng CSS chèn vào game (html.np-hudg).
   Cao >= 480px: 6 nút dọc dưới ← (? 🔊 VI 📷 📤 🔒). Thấp hơn: chỉ nút ⋯ mở thẻ nhỏ 3x2 bên phải cột nút (đóng khi chạm ngoài / Esc / chọn nút). Bài đo: scripts/cozygame/check-hud.js. */
(function () {
  "use strict";
  if (window.NPHud) return;
  var SVG = {
    help: '<path d="M9.2 9.2a2.9 2.9 0 1 1 4.6 2.3c-1 .8-1.8 1.3-1.8 2.7"/><path d="M12 18v.2"/>',
    snd: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    cam: '<path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.6"/>',
    shr: '<circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    more: '<circle cx="5.5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18.5" cy="12" r="1.6" fill="currentColor"/>'
  };
  function ico(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + SVG[n] + "</svg>"; }
  var GAMEIDS = { help: ["bHelp", "phBtn"], snd: ["bSnd", "soundBtn"], lang: ["bLang", "langBtn"] };
  var HIDECSS = "html.np-hudg #bHelp,html.np-hudg #phBtn,html.np-hudg #bSnd,html.np-hudg #soundBtn,html.np-hudg #bLang,html.np-hudg #langBtn{display:none!important}";
  var stage = null, box = null, pn = null, more = null, btns = {}, active = false, small = false, tick = 0, hooked = null;
  var lab = { vi: { help: "Cách chơi", snd: "Âm thanh", lang: "Ngôn ngữ", cam: "Chụp ảnh", shr: "Chia sẻ", lock: "Khoá màn hình", more: "Thêm" }, en: { help: "How to play", snd: "Sound", lang: "Language", cam: "Screenshot", shr: "Share", lock: "Lock screen", more: "More" } };
  function lg() { return ((document.documentElement.lang || "vi") + "").slice(0, 2) === "en" ? "en" : "vi"; }
  function gdoc() { try { var f = stage && stage.querySelector("iframe"); return f && f.contentDocument; } catch (e) { return null; } }
  function gel(ids) { var d = gdoc(); if (!d) return null; for (var i = 0; i < ids.length; i++) { var e = d.getElementById(ids[i]); if (e) return e; } return null; }
  function real(k) {
    if (k === "cam") return document.querySelector("#stage .nps-cam");
    if (k === "shr") return document.querySelector("#stage .nps-fab:not(.nps-cam)");
    if (k === "lock") return document.getElementById("klock");
    return gel(GAMEIDS[k]);
  }
  function mk(k) {
    var b = document.createElement("button"); b.type = "button"; b.className = "np-hb"; b.dataset.k = k; b.hidden = true;
    if (k !== "lang") b.innerHTML = ico(k); else b.textContent = "VI";
    b.addEventListener("click", function () { var e = real(k); if (e) e.click(); setTimeout(sync, 120); if (small) close(); });
    btns[k] = b; return b;
  }
  function build() {
    box = document.createElement("div"); box.id = "npHudc"; box.setAttribute("role", "toolbar");
    more = document.createElement("button"); more.type = "button"; more.className = "np-hb np-hmore"; more.innerHTML = ico("more"); more.setAttribute("aria-expanded", "false");
    more.addEventListener("click", function () { box.classList.contains("open") ? close() : open(); });
    pn = document.createElement("div"); pn.className = "np-hpn";
    ["help", "snd", "lang", "cam", "shr", "lock"].forEach(function (k) { pn.appendChild(mk(k)); });
    box.appendChild(more); box.appendChild(pn); stage.appendChild(box);
  }
  function open() { box.classList.add("open"); more.setAttribute("aria-expanded", "true"); }
  function close() { if (!box) return; box.classList.remove("open"); more.setAttribute("aria-expanded", "false"); }
  function hideNative(on) {
    var d = gdoc(); if (!d || !d.documentElement) return;
    try { if (on && !d.getElementById("npHudgCss")) { var st = d.createElement("style"); st.id = "npHudgCss"; st.textContent = HIDECSS; (d.head || d.documentElement).appendChild(st); } d.documentElement.classList.toggle("np-hudg", !!on); } catch (e) {}
  }
  function sync() {
    if (!box) return;
    var L = lab[lg()], vis = 0;
    ["help", "snd", "lang", "cam", "shr", "lock"].forEach(function (k) {
      var b = btns[k], src = real(k), shown = !!src && !(k === "lock" && src.hidden);
      if (shown && (k === "cam" || k === "shr") && src.disabled) shown = true;
      b.hidden = !shown; if (shown) vis++; if (!src) return;
      if (k === "snd" || k === "lang") { var h = src.innerHTML.trim(); if (h && b.innerHTML !== src.innerHTML) b.innerHTML = src.innerHTML; }
      b.setAttribute("aria-label", src.getAttribute("aria-label") || src.title || L[k]);
      if (src.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", src.getAttribute("aria-pressed")); else b.removeAttribute("aria-pressed");
    });
    more.setAttribute("aria-label", L.more); more.title = L.more;
    box.dataset.n = vis;
  }
  function hook() {   /* chạm vào trong game (iframe không nổi bọt lên cổng) → đóng thẻ */
    var d = gdoc(); if (!d || hooked === d) return; hooked = d;
    try { d.addEventListener("pointerdown", close, true); d.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); }, true); } catch (e) {}
  }
  function want() {
    if (!stage || !stage.classList.contains("on")) return false;
    if (!(innerWidth > innerHeight) || stage.classList.contains("np-rails") || stage.classList.contains("docked")) return false;
    return !!(real("help") || real("snd") || real("lang"));
  }
  function update() {
    if (!stage) return;
    var w = want(); if (w && !box) build();
    if (w !== active) { active = w; stage.classList.toggle("np-hudc", w); hideNative(w); if (!w) { close(); hooked = null; } }
    if (!w) { stage.classList.remove("np-hudc-sm"); return; }
    var sm = innerHeight < 480; if (sm !== small) { small = sm; close(); } stage.classList.toggle("np-hudc-sm", small);
    hideNative(true); hook(); sync();
  }
  function init() {
    stage = document.getElementById("stage"); if (!stage || tick) return;
    tick = setInterval(function () { if (!document.hidden) update(); }, 500);
    addEventListener("resize", update); addEventListener("orientationchange", function () { setTimeout(update, 250); });
    document.addEventListener("pointerdown", function (e) { if (box && box.classList.contains("open") && !box.contains(e.target)) close(); }, true);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    update();
  }
  window.NPHud = { update: update };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
