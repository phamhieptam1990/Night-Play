/* Landing Play Hub: đổi theme, chuyển ngôn ngữ lần đầu, thanh CTA dính, thông tin chủ site, đếm lượt xem ẩn danh. Không cookie. */
(function () {
  var d = document, root = d.documentElement, lang = d.body.getAttribute("data-lang");
  var $ = function (id) { return d.getElementById(id); };
  /* theme: cùng khoá "theme" với phần còn lại của site */
  var tb = $("themeBtn");
  if (tb) tb.addEventListener("click", function () {
    var t = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch (e) {}
  });
  /* ngôn ngữ: bấm công tắc thì nhớ lựa chọn; lần đầu vào bản khác với lựa chọn đã lưu thì chuyển sang bản đó (không với ?nolang) */
  Array.prototype.forEach.call(d.querySelectorAll("[data-set-lang]"), function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("lang", a.getAttribute("data-set-lang")); sessionStorage.setItem("lsel", "1"); } catch (e) {}
    });
  });
  try {
    var s = localStorage.getItem("lang");
    if ((s === "vi" || s === "en") && s !== lang && !sessionStorage.getItem("lsel")) {
      sessionStorage.setItem("lsel", "1");
      var o = d.querySelector("a.lang"); if (o) location.replace(o.getAttribute("href"));
    }
  } catch (e) {}
  /* thanh CTA dính trên mobile: chỉ hiện sau khi cuộn qua hero */
  var st = $("sticky"), hero = $("top");
  if (st && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      var on = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
      st.classList.toggle("on", on); st.setAttribute("aria-hidden", on ? "false" : "true");
      var a = st.querySelector("a"); if (a) a.tabIndex = on ? 0 : -1;
    }).observe(hero);
  }
  /* thông tin chủ site từ shared/site.js; dòng nào còn "[CẦN ĐIỀN" thì ẩn hẳn */
  var S = window.SITE, L = window.LANDING_OP, box = $("operator");
  if (S && L && box) {
    ["operator", "address", "taxId", "license"].forEach(function (k) {
      var v = S[k]; if (!v || /\[CẦN/.test(v)) return;
      var p = d.createElement("p"); p.textContent = L[k] + ": " + v; box.appendChild(p);
    });
    if (box.firstChild) box.hidden = false;
  }
  var y = $("yr"); if (y) y.textContent = new Date().getFullYear();
  if (window.Track) Track.view("home");
})();
