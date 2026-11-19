/* Landing các môn Học Vui: đổi theme, hiện dần khi cuộn, tab lớp, thanh CTA dính. Không cookie, không theo dõi. */
(function () {
  var d = document, root = d.documentElement;
  Array.prototype.forEach.call(d.querySelectorAll("[data-theme-toggle]"), function (b) {
    b.addEventListener("click", function () {
      var t = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = t;
      try { localStorage.setItem("theme", t); } catch (e) {}
    });
  });
  /* ngôn ngữ: nhớ lựa chọn cùng khoá "lang" với phần còn lại của site */
  Array.prototype.forEach.call(d.querySelectorAll("[data-set-lang]"), function (a) {
    a.addEventListener("click", function () { try { localStorage.setItem("lang", a.getAttribute("data-set-lang")); } catch (e) {} });
  });
  /* hiện dần */
  var rv = d.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(rv, function (n) { io.observe(n); });
  } else Array.prototype.forEach.call(rv, function (n) { n.classList.add("in"); });
  /* tab lớp (bản đồ chương trình) */
  var tabs = d.querySelectorAll(".gtabs button"), panes = d.querySelectorAll(".gp");
  Array.prototype.forEach.call(tabs, function (b) {
    b.addEventListener("click", function () {
      var g = b.getAttribute("data-g");
      Array.prototype.forEach.call(tabs, function (x) { x.setAttribute("aria-selected", String(x === b)); });
      Array.prototype.forEach.call(panes, function (p) { p.classList.toggle("on", p.getAttribute("data-g") === g); });
    });
  });
  /* thanh CTA dính: hiện khi đã cuộn qua hero */
  var st = d.getElementById("sticky"), hero = d.getElementById("top");
  if (st && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { st.classList.toggle("on", !es[0].isIntersecting); }).observe(hero);
  }
})();
