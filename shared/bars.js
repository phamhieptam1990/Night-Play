/* Header/footer tự thu gọn thành menu khi bị chèn ép (chữ bị cắt "…", nút rớt dòng, tràn ngang).
   - Header (nav.nav): các nút công cụ gom vào menu ⋯, trừ nút Night Pass (nút chính) luôn hiện.
   - Footer: các nhóm liên kết (<nav>) gom vào menu ⋯ mở lên phía trên.
   Chạy lại khi: tải xong, đổi cỡ cửa sổ, tải xong phông chữ, và khi đổi ngôn ngữ (thuộc tính lang của <html>). */
(function () {
  "use strict";
  var DOTS = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>';
  var open = null;                                     // menu đang mở { pop, btn }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function close() { if (!open) return; open.pop.hidden = true; open.btn.setAttribute("aria-expanded", "false"); open = null; }
  function make(host, className) {
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "bars-more"; btn.innerHTML = DOTS;
    btn.setAttribute("aria-label", "Menu"); btn.setAttribute("aria-haspopup", "true"); btn.setAttribute("aria-expanded", "false");
    var pop = document.createElement("div"); pop.className = "bars-pop " + (className || ""); pop.hidden = true; pop.setAttribute("role", "group");
    btn.addEventListener("click", function (e) {
      e.stopPropagation(); var was = open && open.pop === pop; close();
      if (!was) { pop.hidden = false; btn.setAttribute("aria-expanded", "true"); open = { pop: pop, btn: btn }; }
    });
    host.appendChild(pop);
    return { btn: btn, pop: pop };
  }
  document.addEventListener("click", function (e) { if (open && !e.target.closest(".bars-pop") && !e.target.closest(".bars-more")) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) { var b = open.btn; close(); b.focus(); } });

  /* ----- HEADER ----- */
  function navCrowded(nav, tools) {
    var label = nav.querySelector(".mark span:last-child");
    return nav.scrollWidth > nav.clientWidth + 1 || (label && label.scrollWidth > label.clientWidth + 1) || tools.getBoundingClientRect().height > 60;
  }
  function expandNav(nav) {
    var st = nav._bars; if (!st) return;
    close(); st.btn.remove(); st.pop.remove(); st.items.forEach(function (el) { st.tools.appendChild(el); }); nav._bars = null;
  }
  function collapseNav(nav, tools) {
    var items = Array.prototype.slice.call(tools.children), m = make(nav, "nav-pop");
    items.forEach(function (el) { if (!el.matches("#passBtn,.pill,[data-keep]")) m.pop.appendChild(el); });
    tools.appendChild(m.btn); nav._bars = { btn: m.btn, pop: m.pop, tools: tools, items: items };
  }

  /* ----- FOOTER ----- */
  function footCrowded(f) {
    if ($$("nav", f).some(function (n) { return n.getBoundingClientRect().height > 50; })) return true;
    var tops = $$(".mark,nav,p,#lock,#copy,#madeBy", f).filter(function (e) { return e.offsetParent !== null && (e.matches("nav") || !e.closest("nav")); })
      .map(function (e) { return Math.round(e.getBoundingClientRect().top); });
    return tops.length > 1 && Math.max.apply(null, tops) - Math.min.apply(null, tops) > 16;
  }
  function expandFoot(f) {
    var st = f._bars; if (!st) return;
    close(); st.btn.remove(); st.pop.remove(); st.navs.forEach(function (n) { n.parent.insertBefore(n.el, n.next); }); f._bars = null;
  }
  function collapseFoot(f) {
    var navs = $$("nav", f).map(function (el) { return { el: el, parent: el.parentNode, next: el.nextSibling }; }); if (!navs.length) return;
    var m = make(f, "foot-pop"); navs.forEach(function (n) { m.pop.appendChild(n.el); });
    f.insertBefore(m.btn, f.querySelector(".fin") || f.querySelector(".fbar") || f.firstChild.nextSibling || null);
    f._bars = { btn: m.btn, pop: m.pop, navs: navs };
  }

  var busy = false, queued = 0, lastKey = "", wantForce = false;
  function fit() {
    if (busy) return;
    /* chỉ dựng lại khi chiều rộng/ngôn ngữ đổi (hoặc bị yêu cầu), để menu đang mở không bị đóng khi cuộn/hiện thanh địa chỉ trên điện thoại */
    var de = document.documentElement, key = innerWidth + "|" + de.lang + "|" + de.getAttribute("data-l");
    if (key === lastKey && !wantForce) return;
    if (open && key === lastKey) return;
    busy = true; wantForce = false; lastKey = key;
    try {
      $$("nav.nav").forEach(function (nav) {
        var tools = nav.querySelector(".tools"); if (!tools) return;
        expandNav(nav); if (navCrowded(nav, tools)) collapseNav(nav, tools);
      });
      $$("footer").forEach(function (f) {
        if (!f.querySelector("nav")) return;
        expandFoot(f); if (footCrowded(f)) collapseFoot(f);
      });
    } finally { busy = false; }
  }
  function schedule(force) { if (force === true) wantForce = true; cancelAnimationFrame(queued); queued = requestAnimationFrame(fit); }
  window.fitBars = function () { schedule(true); };

  addEventListener("resize", function () { schedule(false); });
  addEventListener("load", function () { schedule(true); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { schedule(true); });
  new MutationObserver(function () { schedule(true); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "data-l"] });
  if (document.readyState !== "loading") schedule(true); else document.addEventListener("DOMContentLoaded", function () { schedule(true); });
})();
