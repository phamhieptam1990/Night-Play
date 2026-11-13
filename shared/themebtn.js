/* Nút SÁNG / TỐI ngay trong khung game (mọi game Cozy + Pop): ☀ (đang tối → bấm sang sáng) / 🌙 (đang sáng → bấm sang tối).
   Cùng nguồn sự thật với cổng: localStorage "theme" + <html data-theme>. Game đang chạy tự áp dụng qua sự kiện "storage" (tpl/Pop đều có sẵn);
   cổng (cùng origin) nhận "storage" từ iframe và đổi theo. Nạp bởi shared/bridge.js. */
(function () {
  "use strict";
  if (window.NPThemeBtn) return; window.NPThemeBtn = 1;
  var de = document.documentElement;
  if (de.classList.contains("np-multi")) return;
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
  var isDark = function () { return de.dataset.theme === "dark"; };
  var vi = function () { return (de.lang || "vi").slice(0, 2) !== "en"; };
  function paint(b) { b.innerHTML = isDark() ? SUN : MOON; var t = vi() ? "Sáng / Tối" : "Light / Dark"; b.setAttribute("aria-label", t); b.title = t; }
  function toggle() {
    var n = isDark() ? "light" : "dark";
    try { localStorage.setItem("theme", n); } catch (e) {}
    de.dataset.theme = n;
    /* game có bộ lắng nghe "storage" riêng (vẽ lại giao diện/skin): kích hoạt tại chỗ vì storage chỉ bắn ở tài liệu KHÁC */
    try { window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: n })); } catch (e) {}
    document.querySelectorAll("meta[name=theme-color]").forEach(function (m) { var c = { dark: "#0E1020", light: "#F1ECFC" }[n]; if (c) m.content = c; });
  }
  function init() {
    var play = document.getElementById("play"), top = (play && play.querySelector(".top")) || document.querySelector(".top");
    if (!top || document.getElementById("themeBtn2")) return;
    var b = document.createElement("button"); b.type = "button"; b.id = "themeBtn2"; b.className = "ib"; b.dataset.r = "theme"; paint(b);
    var ref = document.getElementById("bLang") || document.getElementById("langBtn");
    if (ref && ref.parentNode === top) top.insertBefore(b, ref); else top.appendChild(b);
    b.addEventListener("click", toggle);
    try { new MutationObserver(function () { paint(b); }).observe(de, { attributes: true, attributeFilter: ["data-theme", "lang"] }); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else setTimeout(init, 0);
})();
