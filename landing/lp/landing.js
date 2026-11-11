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
  /* các khối cùng thứ tự ở hai bản VI/EN: main > section, rồi chân trang */
  function blocks() { return Array.prototype.slice.call(d.querySelectorAll("main > section")).concat(Array.prototype.slice.call(d.querySelectorAll("footer.foot"))); }
  try {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var sv = JSON.parse(sessionStorage.getItem("np-lsw") || "null"); sessionStorage.removeItem("np-lsw");
    if (sv && Date.now() - sv.t < 15000) {
      var fq = d.querySelectorAll(".faq details"); (sv.f || []).forEach(function (n) { if (fq[n]) fq[n].open = true; });
      var bl = blocks(), tg = bl[sv.i];
      if (tg) { var go = function () { var r = tg.getBoundingClientRect(); window.scrollTo({ top: Math.max(0, window.scrollY + r.top + sv.o * r.height - 70), behavior: "instant" }); }; go(); window.addEventListener("load", go); }
    }
  } catch (e) {}
  /* ngôn ngữ: bấm công tắc thì nhớ lựa chọn; lần đầu vào bản khác với lựa chọn đã lưu thì chuyển sang bản đó (không với ?nolang) */
  Array.prototype.forEach.call(d.querySelectorAll("[data-set-lang]"), function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("lang", a.getAttribute("data-set-lang")); sessionStorage.setItem("lsel", "1"); } catch (e) {}
      /* giữ ?landing=1 (app PWA không bị chuyển về /play/) và vị trí cuộn + câu FAQ đang mở sang bản ngôn ngữ kia */
      if (/[?&]landing=1(&|$)/.test(location.search)) a.href = a.getAttribute("href").split("?")[0] + "?landing=1";
      try {
        var secs = blocks(), line = 70, idx = secs.length - 1, off = 0;
        for (var i = 0; i < secs.length; i++) { var r = secs[i].getBoundingClientRect(); if (r.bottom > line) { idx = i; off = Math.max(0, Math.min(1, (line - r.top) / Math.max(1, r.height))); break; } }
        var open = []; Array.prototype.forEach.call(d.querySelectorAll(".faq details"), function (x, n) { if (x.open) open.push(n); });
        sessionStorage.setItem("np-lsw", JSON.stringify({ i: idx, o: off, f: open, t: Date.now() }));
      } catch (e) {}
    });
  });
  try {
    var s = localStorage.getItem("lang");
    if ((s === "vi" || s === "en") && s !== lang && !sessionStorage.getItem("lsel")) {
      sessionStorage.setItem("lsel", "1");
      var o = d.querySelector("a.lang"); if (o) location.replace(o.getAttribute("href"));
    }
  } catch (e) {}
  /* menu icon: liên kết vẫn nằm sẵn trong HTML (không cần JS); JS chỉ gom chúng vào nút ☰ khi chật (CSS quyết định bằng media query) */
  function popMenu(btnHost, panel, before) {
    if (!panel) return;
    var b = d.createElement("button"); b.type = "button"; b.className = "mbtn"; b.setAttribute("aria-label", "Menu"); b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", panel.id);
    b.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    btnHost.insertBefore(b, before);
    function set(o) { panel.classList.toggle("open", o); b.setAttribute("aria-expanded", o ? "true" : "false"); }
    b.addEventListener("click", function (e) { e.stopPropagation(); set(!panel.classList.contains("open")); });
    d.addEventListener("click", function (e) { if (panel.classList.contains("open") && !panel.contains(e.target) && e.target !== b) set(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) { set(false); b.focus(); } });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    return b;
  }
  var hl = $("hlinks"), tl = d.querySelector(".top .tools");
  if (hl && tl) { popMenu(tl, hl, tl.querySelector(".btn")); }
  var fl = $("flinks"); if (fl) { d.querySelector("footer.foot").classList.add("js-menu"); popMenu(fl.parentNode, fl, fl); }
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
