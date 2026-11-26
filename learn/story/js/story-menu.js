/* Lớp truyện: NÚT MENU ở góc phải thanh trên (bản đồ lớp + bản đồ chủ đề). Ba hành động: thoát ra chương trình học (Học Vui), đổi giao diện sáng/tối, đổi ngôn ngữ Việt/Anh.
   Chạy mỗi lần vào màn (router js/spa.js dọn sự kiện khi rời màn). Theme lưu "theme", ngôn ngữ lưu "lang" (cùng khoá với cả site). */
(function (root) {
  "use strict";
  var K = root.StoryCore, D = document, hd = D.querySelector("header.top");
  if (!K || !hd || hd.querySelector(".mnb")) return;
  var vi = K.lang !== "en", other = vi ? "en" : "vi";
  var TX = vi ? { menu: "Menu", exit: "Thoát ra chương trình học", themeD: "Giao diện tối", themeL: "Giao diện sáng", lang: "English" }
    : { menu: "Menu", exit: "Leave to the learning hub", themeD: "Dark theme", themeL: "Light theme", lang: "Tiếng Việt" };
  var IC = {
    dots: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke="currentColor" stroke-width="4.4" stroke-linecap="round"/>',
    exit: '<path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" fill="currentColor"/>',
    sun: '<circle cx="12" cy="12" r="4.2" fill="currentColor"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    lang: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.2" fill="none"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="currentColor" stroke-width="2" fill="none"/>'
  };
  function svg(p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>"; }
  function el(tag, cls, html) { var e = D.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function theme() { return D.documentElement.dataset.theme === "dark" ? "dark" : "light"; }
  var btn = el("button", "ib mnb", svg(IC.dots)); btn.type = "button"; btn.setAttribute("aria-haspopup", "true"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", TX.menu); btn.title = TX.menu;
  var pop = el("div", "mnp"); pop.hidden = true; pop.setAttribute("role", "menu");
  var exit = el("a", "mni", svg(IC.exit)); exit.setAttribute("role", "menuitem"); exit.setAttribute("aria-label", TX.exit); exit.title = TX.exit; exit.href = (vi ? "" : "/en") + "/hoc/"; exit.setAttribute("data-exit", "1");
  var th = el("button", "mni", ""); th.type = "button"; th.setAttribute("role", "menuitem");
  var lg = el("button", "mni", svg(IC.lang)); lg.type = "button"; lg.setAttribute("role", "menuitem"); lg.setAttribute("aria-label", TX.lang); lg.title = TX.lang;
  function paintTheme() { var dark = theme() === "dark", n = dark ? TX.themeL : TX.themeD; th.innerHTML = svg(dark ? IC.sun : IC.moon); th.setAttribute("aria-label", n); th.title = n; }   /* chỉ biểu tượng, không chữ (tên nằm ở aria-label) */
  paintTheme();
  [exit, th, lg].forEach(function (e) { pop.appendChild(e); });
  hd.appendChild(btn); hd.appendChild(pop);
  function close() { pop.hidden = true; btn.setAttribute("aria-expanded", "false"); }
  function open() { pop.hidden = false; btn.setAttribute("aria-expanded", "true"); }
  btn.onclick = function (e) { e.stopPropagation(); if (pop.hidden) open(); else close(); };
  pop.onclick = function (e) { e.stopPropagation(); };
  D.addEventListener("click", close); D.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  th.onclick = function () {
    var n = theme() === "dark" ? "light" : "dark"; D.documentElement.dataset.theme = n;
    try { localStorage.setItem("theme", n); } catch (x) {}
    paintTheme(); close();
  };
  lg.onclick = function () {
    try { localStorage.setItem("lang", other); } catch (x) {}
    var u = new URL(location.href); u.searchParams.set("lang", other); location.replace(u.href);   /* tải lại để toàn bộ chữ và giọng đọc đổi ngôn ngữ */
  };
  exit.onclick = function () { close(); };   /* liên kết thường: rời hẳn Lớp truyện, ra trang Học Vui */
})(window);
