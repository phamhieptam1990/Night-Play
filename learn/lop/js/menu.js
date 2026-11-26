/* Chương trình học: NÚT MENU ở góc phải thanh trên. Gom các nút 🌱 khu vườn · 🌈 của bé · 🔒 phụ huynh vào một menu, thêm đổi ngôn ngữ + đổi giao diện sáng/tối.
   Chỉ biểu tượng lớn, không chữ (tên nằm ở aria-label). Các nút cũ được DI CHUYỂN (giữ nguyên id: toGarden/toMe/toParent) nên map.js vẫn cập nhật liên kết bình thường. */
(function () {
  "use strict";
  var D = document, hd = D.querySelector("header.top");
  if (!hd || hd.querySelector(".mnb")) return;
  var ql = new URLSearchParams(location.search).get("lang"), sl = ""; try { sl = localStorage.getItem("lang") || ""; } catch (x) {}
  var lang = (ql === "en" || ql === "vi") ? ql : (sl === "en" ? "en" : D.documentElement.lang === "en" ? "en" : "vi"), vi = lang === "vi", other = vi ? "en" : "vi";
  var L = vi ? { menu: "Menu", themeD: "Giao diện tối", themeL: "Giao diện sáng", lang: "English" } : { menu: "Menu", themeD: "Dark theme", themeL: "Light theme", lang: "Tiếng Việt" };
  var IC = {
    dots: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke="currentColor" stroke-width="4.4" stroke-linecap="round"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" fill="currentColor"/>',
    sun: '<circle cx="12" cy="12" r="4.2" fill="currentColor"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    lang: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.2" fill="none"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="currentColor" stroke-width="2" fill="none"/>'
  };
  function svg(p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>"; }
  function el(tag, cls, html) { var e = D.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function dark() { return D.documentElement.dataset.theme === "dark"; }
  var btn = el("button", "ib mnb", svg(IC.dots)); btn.type = "button"; btn.setAttribute("aria-haspopup", "true"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", L.menu); btn.title = L.menu;
  var pop = el("div", "mnp"); pop.hidden = true; pop.setAttribute("role", "menu");
  ["toGarden", "toMe", "toParent"].forEach(function (id) { var a = D.getElementById(id); if (a) { a.classList.add("mni"); a.setAttribute("role", "menuitem"); a.title = a.getAttribute("aria-label") || ""; pop.appendChild(a); } });
  /* trang con (bài học...) không có các nút 🌱🌈🔒: thêm nút THOÁT RA chương trình học */
  if (!pop.children.length) { var ex = el("a", "ib mni", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>');
    ex.href = (vi ? "" : "/en") + "/hoc/"; ex.setAttribute("role", "menuitem"); ex.setAttribute("aria-label", vi ? "Thoát ra chương trình học" : "Leave to the learning hub"); ex.title = ex.getAttribute("aria-label"); pop.appendChild(ex); }
  var th = el("button", "ib mni", ""); th.type = "button"; th.setAttribute("role", "menuitem");
  var lg = el("button", "ib mni", svg(IC.lang)); lg.type = "button"; lg.setAttribute("role", "menuitem"); lg.setAttribute("aria-label", L.lang); lg.title = L.lang;
  function paintTheme() { var n = dark() ? L.themeL : L.themeD; th.innerHTML = svg(dark() ? IC.sun : IC.moon); th.setAttribute("aria-label", n); th.title = n; }
  paintTheme(); pop.appendChild(lg); pop.appendChild(th);
  hd.appendChild(btn); hd.appendChild(pop);
  function close() { pop.hidden = true; btn.setAttribute("aria-expanded", "false"); }
  btn.onclick = function (e) { e.stopPropagation(); pop.hidden = !pop.hidden; btn.setAttribute("aria-expanded", String(!pop.hidden)); };
  pop.onclick = function (e) { e.stopPropagation(); };
  D.addEventListener("click", close); D.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  th.onclick = function () { var n = dark() ? "light" : "dark"; D.documentElement.dataset.theme = n; try { localStorage.setItem("theme", n); } catch (x) {} paintTheme(); close(); };
  lg.onclick = function () { try { localStorage.setItem("lang", other); } catch (x) {} var u = new URL(location.href); u.searchParams.set("lang", other); location.replace(u.href); };
})();
