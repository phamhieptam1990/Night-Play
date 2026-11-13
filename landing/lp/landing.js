/* Landing Play Hub: đổi theme, chuyển ngôn ngữ lần đầu, thanh CTA dính, thông tin chủ site, đếm lượt xem ẩn danh. Không cookie. */
(function () {
  var d = document, root = d.documentElement, lang = d.body.getAttribute("data-lang");
  var $ = function (id) { return d.getElementById(id); };
  /* theme: cùng khoá "theme" với phần còn lại của site */
  Array.prototype.forEach.call(d.querySelectorAll("#themeBtn,[data-theme-toggle]"), function (tb) {
    tb.addEventListener("click", function () {
      var t = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = t;
      try { localStorage.setItem("theme", t); } catch (e) {}
    });
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
    var IC = [[/^\/play\/$/, "🎮"], [/popplay/, "🎈"], [/cozyplay/, "🌙"], [/moi/, "✨"], [/subscribe|nightpass/, "⭐"], [/privacy/, "🔒"], [/terms/, "📄"], [/^mailto/, "✉️"], [/#game/, "🎮"], [/#tinhnang/, "🧩"], [/#phuhuynh/, "👨‍👩‍👧"], [/#hoi/, "❓"], [/^\/(en\/)?$/, "🌐"]];
    [].forEach.call(panel.querySelectorAll("a,button.xtra"), function (a) {
      var h = a.getAttribute("href") || "", ic = a.tagName === "BUTTON" ? "🌓" : "•";
      for (var i = 0; i < IC.length; i++) if (IC[i][0].test(h)) { ic = IC[i][1]; break; }
      var s = d.createElement("span"); s.className = "mic"; s.setAttribute("aria-hidden", "true"); s.textContent = ic; a.insertBefore(s, a.firstChild);
    });
    function set(o) { panel.classList.toggle("open", o); b.setAttribute("aria-expanded", o ? "true" : "false"); }
    b.addEventListener("click", function (e) { e.stopPropagation(); set(!panel.classList.contains("open")); });
    d.addEventListener("click", function (e) { if (panel.classList.contains("open") && !panel.contains(e.target) && e.target !== b) set(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) { set(false); b.focus(); } });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    return b;
  }
  var hl = $("hlinks"), tl = d.querySelector(".top .tools");
  if (hl && tl) {
    var mb = popMenu(tl, hl, tl.querySelector(".btn")), brand = d.querySelector(".top .brand"), narrow = window.matchMedia("(max-width:999px)");
    /* HAI MENU: logo (trái) = sổ menu đi tới các thẻ nội dung; ☰ (phải) = Game, Mới, Giao diện, Ngôn ngữ, Quyền riêng tư. Màn rộng (>=1000px) menu ngang hiện sẵn. */
    var en = d.body.getAttribute("data-lang") === "en", SEC = [["thegioi", en ? "Two worlds" : "Hai thế giới", "🪐"], ["game", en ? "Games" : "Game", "🎮"], ["tinhnang", en ? "Features" : "Tính năng", "🧩"], ["phuhuynh", en ? "Parents" : "Phụ huynh", "👨‍👩‍👧"], ["cachchoi", en ? "How to play" : "Cách chơi", "👆"], ["nightpass", "Night Pass", "⭐"], ["hoi", en ? "FAQ" : "Câu hỏi", "❓"]];
    var lm = d.createElement("nav"); lm.className = "links lmenu"; lm.id = "logoMenu"; lm.setAttribute("aria-label", en ? "On this page" : "Mục trong trang");
    SEC.forEach(function (x) { var a = d.createElement("a"); a.href = "#" + x[0]; var ic = d.createElement("span"); ic.className = "mic"; ic.setAttribute("aria-hidden", "true"); ic.textContent = x[2]; a.appendChild(ic); a.appendChild(d.createTextNode(x[1])); lm.appendChild(a); });
    d.querySelector(".top .bar").appendChild(lm);
    function lmSet(o) { lm.classList.toggle("open", o); if (brand) brand.setAttribute("aria-expanded", o ? "true" : "false"); }
    if (brand) {
      brand.setAttribute("aria-haspopup", "true"); brand.setAttribute("aria-expanded", "false"); brand.setAttribute("aria-controls", "logoMenu");
      brand.addEventListener("click", function (e) { if (!narrow.matches) return; e.preventDefault(); e.stopPropagation(); if (hl.classList.contains("open")) mb.click(); lmSet(!lm.classList.contains("open")); });
    }
    mb.addEventListener("click", function () { lmSet(false); });
    d.addEventListener("click", function (e) { if (lm.classList.contains("open") && !lm.contains(e.target) && !(brand && brand.contains(e.target))) lmSet(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape" && lm.classList.contains("open")) { lmSet(false); if (brand) brand.focus(); } });
    lm.addEventListener("click", function (e) { if (e.target.closest("a")) lmSet(false); });
  }

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

/* dải game tự trượt: chạm giữ / kéo ngang thì tạm dừng vài giây (CSS đã dừng khi rê chuột/focus), tab ẩn thì dừng */
(function () {
  var m = document.querySelector(".marq"); if (!m) return; var tm = 0;
  function hold() { m.classList.add("hold"); clearTimeout(tm); tm = setTimeout(function () { m.classList.remove("hold"); }, 4000); }
  ["pointerdown", "touchstart", "wheel", "scroll"].forEach(function (ev) { m.addEventListener(ev, hold, { passive: true }); });
  var tr = m.querySelector(".mtrack");
  document.addEventListener("visibilitychange", function () { tr.style.animationPlayState = document.hidden ? "paused" : ""; });
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { tr.style.animationPlayState = e[e.length - 1].isIntersecting && !document.hidden ? "" : "paused"; }).observe(m);
})();

/* ===== Slide 3 điện thoại ở phần đầu trang: tự luân phiên (máy bên phải lên giữa), bấm máy bên cạnh để đưa vào giữa; dừng khi rê chuột / tab ẩn / ngoài màn hình / giảm chuyển động ===== */
(function () {
  var pfx = document.querySelector(".phones .pfx"); if (!pfx) return;
  var devs = Array.prototype.slice.call(pfx.querySelectorAll(".dev")); if (devs.length !== 3) return;
  var NEXT = { r: "c", c: "l", l: "r" }, rm = window.matchMedia("(prefers-reduced-motion: reduce)"), tm = 0, hold = false, vis = true;
  var role = function (d) { return d.classList.contains("c") ? "c" : d.classList.contains("l") ? "l" : "r"; };
  function rot() { var rs = devs.map(role); devs.forEach(function (d, i) { d.classList.remove(rs[i]); d.classList.add(NEXT[rs[i]]); }); }
  function stop() { clearInterval(tm); tm = 0; }
  var wide = window.matchMedia("(min-width: 0px)");   // điện thoại chỉ có MỘT máy ở giữa: không tự đổi (đổi ảnh liên tục gây nhấp nháy, mỏi mắt)
  function start() { stop(); if (rm.matches || hold || !vis || document.hidden || !wide.matches) return; tm = setInterval(rot, 5000); }
  devs.forEach(function (d) { d.addEventListener("click", function () { var n = 0; while (!d.classList.contains("c") && n++ < 2) rot(); start(); }); });
  pfx.addEventListener("mouseenter", function () { hold = true; stop(); });
  pfx.addEventListener("mouseleave", function () { hold = false; start(); });
  document.addEventListener("visibilitychange", start);
  if (rm.addEventListener) rm.addEventListener("change", start);
  if (wide.addEventListener) wide.addEventListener("change", start);
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { vis = e[e.length - 1].isIntersecting; start(); }).observe(pfx);
  start();
})();

/* ===== Thẻ Night Pass bấm được: thẻ gói (1 ngày/tuần/tháng/năm) → subscribe.html?plan=<gói> đúng gói; thẻ tính năng → subscribe.html (giữ ngôn ngữ trang) ===== */
(function () {
  var en = location.pathname.indexOf("/en/") === 0, lang = en ? "&lang=en" : "&lang=vi";
  var ids = ["day", "week", "month", "year"];
  function go(url) { location.href = url; }
  function wire(el, url, label) {
    el.setAttribute("role", "link"); el.setAttribute("tabindex", "0"); el.style.cursor = "pointer"; if (label) el.setAttribute("aria-label", label);
    el.addEventListener("click", function (e) { if (e.target.closest("a")) return; go(url); });
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(url); } });
  }
  Array.prototype.forEach.call(document.querySelectorAll(".plans .plan"), function (li, i) {
    var h = li.querySelector("h3"), p = li.querySelector(".pp");
    wire(li, "/subscribe.html?plan=" + ids[i] + lang, (h ? h.textContent : "") + (p ? " · " + p.textContent : ""));
  });
  Array.prototype.forEach.call(document.querySelectorAll(".feats .feat"), function (a) {
    var h = a.querySelector("h3"); wire(a, "/subscribe.html" + (lang ? "?" + lang.slice(1) : ""), h ? h.textContent : "");
  });
})();

/* ===== Nhãn tên game khi hover/focus icon trong dải icon ===== */
(function () {
  var m = document.querySelector(".marq"); if (!m) return;
  var tip = document.createElement("div"); tip.id = "mtip"; tip.setAttribute("aria-hidden", "true"); document.body.appendChild(tip);
  function show(a) {
    var n = a.querySelector(".mn"); if (!n) return; tip.textContent = n.textContent;
    var r = a.querySelector(".mimg").getBoundingClientRect(), x = r.left + r.width / 2, half = Math.min(tip.offsetWidth || 120, 260) / 2 + 8;
    tip.style.left = Math.max(half, Math.min(innerWidth - half, x)) + "px"; tip.style.top = Math.max(4, r.top - r.height * 0.2 - 40) + "px"; tip.classList.add("on");
  }
  function hide() { tip.classList.remove("on"); }
  m.addEventListener("mouseover", function (e) { var a = e.target.closest(".mi"); if (a) show(a); });
  m.addEventListener("mouseout", function (e) { if (e.target.closest(".mi")) hide(); });
  m.addEventListener("focusin", function (e) { var a = e.target.closest(".mi"); if (a) show(a); });
  m.addEventListener("focusout", hide); m.addEventListener("scroll", hide, { passive: true });
})();

/* ===== Slide cho lưới card (.mgrid) ở trang Mới: vuốt ngang / nút ‹ › / phím; không JS thì vẫn là lưới tĩnh ===== */
(function () {
  var en = document.documentElement.lang === "en";
  Array.prototype.forEach.call(document.querySelectorAll(".mgrid"), function (g) {
    if (g.children.length < 2) return;
    var wrap = document.createElement("div"); wrap.className = "mslider"; g.parentNode.insertBefore(wrap, g); wrap.appendChild(g); g.classList.add("mslide");
    function mk(c, t, d) { var b = document.createElement("button"); b.type = "button"; b.className = "msb " + c; b.textContent = d; b.setAttribute("aria-label", t); wrap.appendChild(b); return b; }
    var pv = mk("prev", en ? "Previous" : "Trước", "‹"), nx = mk("next", en ? "Next" : "Sau", "›");
    function step() { var c = g.children[0], w = c.getBoundingClientRect().width + 14; return Math.max(w, g.clientWidth * 0.8); }
    function upd() { pv.disabled = g.scrollLeft < 4; nx.disabled = g.scrollLeft + g.clientWidth >= g.scrollWidth - 4; }
    pv.addEventListener("click", function () { g.scrollBy({ left: -step(), behavior: "smooth" }); });
    nx.addEventListener("click", function () { g.scrollBy({ left: step(), behavior: "smooth" }); });
    g.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
    addEventListener("load", function () { setTimeout(function () { Array.prototype.forEach.call(g.querySelectorAll("img[loading=lazy]"), function (i) { i.loading = "eager"; }); }, 1500); });   // ảnh card ngoài tầm nhìn ngang tải ngầm sau khi trang xong, vuốt tới là có ngay
    g.tabIndex = 0; g.setAttribute("role", "region"); g.setAttribute("aria-label", (g.parentNode.parentNode.querySelector("h2") || {}).textContent || "");
    g.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { e.preventDefault(); nx.click(); } else if (e.key === "ArrowLeft") { e.preventDefault(); pv.click(); } });
  });


})();
