/* LAYOUT MỚI cho nhóm POP PLAY (cùng shared/layout-pop.css). Chạy theo sự kiện đổi cỡ (ResizeObserver), KHÔNG hẹn giờ:
   1) đặt html.nppl + cờ NPLayoutNew/NPLayoutPop (mascot-art.js bỏ phần tự chỉnh pixel cũ; overflowslide.js nhường cho layout này);
   2) đặt khung màn chọn (--hx --hy --hw --hh, px so với #play) = vùng màn hình dưới thanh nút trên (dọc) / bên phải cột nút (ngang);
   3) danh sách thẻ không vừa → slide; số cột; --row chia cho các hàng; --n = số hàng (ngang);
   4) chật → gộp "Tiếp tục ván dở" + "Hôm nay" thành MỘT hàng (.npp-strip); linh vật ≥ 250px luôn hiện, lớn hơn nút;
   5) chữ thẻ không vừa MỘT dòng → bỏ chữ cả danh sách (data-notext); thẻ Tiếp tục hẹp quá → chỉ còn ▶. */
(function () {
  "use strict";
  var de = document.documentElement; de.classList.add("nppl"); window.NPLayoutNew = 1;
  var NOH3 = /[?&]home3=0/.test(location.search) || /[?&]multi=1/.test(location.search);   /* chơi cùng lúc (?multi=1): resume.js KHÔNG nạp home3.js nên không dùng màn chọn mới (nếu bật np-h3 thì #home bị ẩn mãi → khung chỉ còn nền) */
  if (!NOH3) de.classList.add("np-h3");   /* màn chọn mới bật NGAY lúc nạp (xem layout.js) */ window.NPLayoutPop = 1; window.__npOvs = true;
  if (!NOH3) try { var sty0 = document.createElement("style"); sty0.textContent = "html.np-h3:not(.np-h3at) :is(#home,#village,#ovStart){visibility:hidden!important}"; (document.head || document.documentElement).appendChild(sty0); } catch (e) {}   /* ẩn màn chọn cũ cho tới khi màn chọn mới dựng xong (home3.js đặt np-h3at) → không còn khoảnh khắc layout cũ hiện ra lúc nạp */
  var MINROW = 72, MAXROW = 112, busy = 0, TOP = 88, BOTTOM = 28, SIDE = 88;
  function land() { return innerWidth > innerHeight * 1.1; }
  function railRight() {   /* màn ngang: các nút cố định bên TRÁI (←, 🔊, ⋯, …) xếp 1–2 cột → chừa tới mép phải xa nhất */
    var mx = 0, bs = document.querySelectorAll("body button,body .ib,#npPmBk,#npPmFab");
    Array.prototype.forEach.call(bs, function (b) { var r = b.getBoundingClientRect(); if (r.width < 20 || r.height < 20 || r.width > 120 || r.left > innerWidth * 0.35 || r.bottom < 0) return; if (b.closest("#play,.ov,#home,#village,#ovStart")) return; var cs = getComputedStyle(b); if (cs.visibility === "hidden" || +cs.opacity === 0 || b.id === "nsPill") return; if (r.right > mx) mx = r.right; });
    return Math.ceil(mx);
  }
  function host() { var ids = ["ovStart", "home", "village"]; for (var i = 0; i < ids.length; i++) { var e = document.getElementById(ids[i]); if (e && !e.hidden && e.getClientRects().length && getComputedStyle(e).display !== "none") return e; } return null; }
  function strip(h, on) {
    var s = h.querySelector(":scope>.npp-strip"), r = h.querySelector("#npResume"), d = h.querySelector(":scope>.npp-pair,:scope>.dbar,:scope>#dailyRow");
    if (on && !s && r && d) { s = document.createElement("div"); s.className = "npp-strip"; h.insertBefore(s, r); s.appendChild(r); s.appendChild(d); var t = (d.textContent || "").replace(/\s+/g, " ").trim(); if (t) d.setAttribute("aria-label", t);
      var cd = d.querySelector(".dbar,#dailyRow") || d; if (!cd.querySelector(".npl-cal")) { var cal = document.createElement("span"); cal.className = "npl-cal"; if (window.NPIcon && (NPIcon.on || window.NPIconOn)) cal.innerHTML = NPIcon.svg("calendar"); else cal.textContent = "📅"; cd.appendChild(cal); } return true; }
    if (s && (!on || !r)) { var d2 = s.querySelector(".npp-pair,.dbar,#dailyRow"); if (d2) d2.removeAttribute("aria-label"); var c2 = s.querySelector(".npl-cal"); if (c2) c2.remove(); while (s.firstChild) h.insertBefore(s.firstChild, s); s.remove(); return true; }
    return false;
  }
  function vis(e) { return e && !e.hidden && getComputedStyle(e).display !== "none" && e.getClientRects().length; }
  function tune() {
    if (document.documentElement.classList.contains("np-h3")) return;   /* màn chọn mới (home3.js) thay thế bố cục cũ */
    var h = host(); if (!h || busy) return; busy = 1;
    try {
      if (window.NPIcon) { try { NPIcon.apply(h); } catch (e) {} }   /* emoji chế độ có icon SVG → SVG theo theme; chưa có icon → giữ emoji (nội dung bài học .ti/.tb luôn giữ emoji) */
      var go0 = h.querySelector("#npResume .npr-go");   /* thẻ Tiếp tục: icon SVG resume + MỘT chữ ngắn; nguyên văn vào aria-label */
      if (go0 && !go0.querySelector(".npr-ic")) {
        var full = (go0.textContent || "").replace(/\s+/g, " ").trim(); if (full) go0.setAttribute("aria-label", full);
        var vi0 = !/^en/i.test(document.documentElement.lang || "vi"), ic = (window.NPIcon && (NPIcon.on || window.NPIconOn)) ? NPIcon.svg("resume") : "▶";
        go0.innerHTML = '<span class="npr-ic">' + ic + '</span><b class="npr-tx">' + (vi0 ? "Tiếp tục" : "Resume") + "</b>";
      }
      var play = document.getElementById("play") || h.offsetParent || document.body, L = land(), pr = play.getBoundingClientRect();
      var x = L ? Math.max(SIDE, railRight() + 10) : 12, y = L ? 40 : TOP, w = innerWidth - x - 12, H0 = innerHeight - y - (L ? 22 : BOTTOM);
      h.style.setProperty("--hx", Math.round(x - pr.left) + "px"); h.style.setProperty("--hy", Math.round(y - pr.top) + "px"); h.style.setProperty("--hw", Math.round(w) + "px"); h.style.setProperty("--hh", Math.round(H0) + "px");
      var pl = play; pl.style.setProperty("--row", ""); pl.style.removeProperty("--row"); h.style.removeProperty("--row");
      var g = 10, hm = L ? 250 : Math.min(250, 0.5 * H0), H = H0;
      var ab = h.querySelector(":scope>.abar"), db = h.querySelector(":scope>.dbar");   /* nút phụ (.abar) đứng CÙNG HÀNG thẻ Hôm nay */
      if (ab && db && !h.querySelector(":scope>.npp-pair")) { var pr = document.createElement("div"); pr.className = "npp-pair"; h.insertBefore(pr, db); pr.appendChild(db); pr.appendChild(ab); }
      var bn = h.querySelectorAll(":scope>.band");   /* làng: các dải dọc → MỘT hàng slide */
      if (bn.length && !h.querySelector(":scope>.npp-bands")) { var bw = document.createElement("div"); bw.className = "npp-bands"; h.insertBefore(bw, bn[0]); bn.forEach(function (b) { bw.appendChild(b); }); }
      var hero = h.querySelector("#paHero"), list = h.querySelector(".tiles,#cards"), lvs = h.querySelector(".lvs");
      var bands = h.querySelectorAll(":scope>.npp-bands"), extra = h.querySelectorAll(":scope>#pgBtn,:scope>.vcoll");
      /* danh sách thẻ: số cột + slide */
      if (list) {
        list.removeAttribute("data-slide"); list.removeAttribute("data-notext");
        var n = list.children.length, minW = 104, cw = L ? Math.max(0, w * 0.55 - 6) : w;
        h.style.setProperty("--cols", Math.max(1, n));
        if (n * minW + (n - 1) * g > cw + 1) list.setAttribute("data-slide", "");
        if (!list._npEv) { list._npEv = 1; list.addEventListener("scroll", function () { if (list.scrollLeft + list.clientWidth >= list.scrollWidth - 2) list.setAttribute("data-end", ""); else list.removeAttribute("data-end"); }, { passive: true }); }
      }
      var both = !!(h.querySelector("#npResume") && h.querySelector(":scope>.npp-pair,:scope>.dbar,:scope>#dailyRow,:scope>.npp-strip>.npp-pair,:scope>.npp-strip>.dbar,:scope>.npp-strip>#dailyRow"));
      function rows(merged) {
        var n = 0, hasStrip = !!h.querySelector(":scope>.npp-strip"), r = !!h.querySelector("#npResume"), dd = !!h.querySelector(".dbar,#dailyRow");
        if (lvs && vis(lvs)) n++;
        if (r && dd) n += merged ? 1 : 2; else n += (r ? 1 : 0) + (dd ? 1 : 0);
        if (list && vis(list)) n++;
        n += bands.length; extra.forEach(function (e) { if (vis(e) && e.parentElement === h) n++; });
        return n;
      }
      function plan(merged) {
        var k = rows(merged), row;
        if (L) { row = Math.floor((H - (k - 1) * g) / Math.max(k, 1)); }
        else { row = Math.floor((H - hm - k * g) / Math.max(k, 1)); }
        row = Math.max(MINROW, Math.min(row, MAXROW));
        return { k: k, row: row, hero: L ? H : H - k * (row + g) };
      }
      var want = false;
      if (both) { var p0 = plan(false); want = L ? p0.row <= MINROW && (H - p0.k * MINROW - (p0.k - 1) * g) < 0 : p0.hero < hm; }
      strip(h, want);
      var p = plan(want);
      var pg = h.querySelector("#pgBtn"), dr = h.querySelector(":scope>#dailyRow"), stp = h.querySelector(":scope>.npp-strip");   /* vẫn chật (màn dọc): nút Tiến độ thành icon vuông đứng CÙNG HÀNG thẻ Hôm nay (hoặc trong hàng gộp) */
      var pp = h.querySelector(":scope>.npp-pg"), pgIn = !!(pg && pg.parentElement !== h);
      var pgOn = !!(pg && !L && p.hero < hm && !pgIn && (dr || stp));
      if (pgOn) {
        var tx = (pg.textContent || "").replace(/\s+/g, " ").trim(); if (tx) pg.setAttribute("aria-label", tx);
        if (stp) stp.appendChild(pg); else { pp = document.createElement("div"); pp.className = "npp-pg"; h.insertBefore(pp, dr); pp.appendChild(dr); pp.appendChild(pg); }
        p = plan(want);
      } else if (pgIn && (L || p.hero >= hm + 82)) {
        var wrap = pg.parentElement; h.appendChild(pg); if (wrap.classList.contains("npp-pg")) { while (wrap.firstChild) h.insertBefore(wrap.firstChild, wrap); wrap.remove(); } p = plan(want);
      }
      h.style.setProperty("--row", p.row + "px"); h.style.setProperty("--n", p.k);
      /* màn ngang: gán HÀNG lưới tường minh theo thứ tự hiển thị (order CSS) — không để lưới tự xếp (game có thể đặt grid-row riêng) */
      var kidsV = Array.prototype.slice.call(h.children).filter(function (c) { return c.id !== "paHero" && vis(c); });
      if (L) { kidsV.map(function (c, i) { return { c: c, o: +getComputedStyle(c).order || 0, i: i }; }).sort(function (a, b) { return a.o - b.o || a.i - b.i; }).forEach(function (x, idx) { x.c.style.setProperty("grid-row", String(idx + 1), "important"); }); h.style.setProperty("--n", kidsV.length); }
      else kidsV.forEach(function (c) { c.style.removeProperty("grid-row"); });
      /* chữ một dòng: không vừa → bỏ chữ cả danh sách (đo SAU khi --row đã áp) */
      if (list) {
        var off = false;
        Array.prototype.forEach.call(list.querySelectorAll(".tile>b,.card .main>span:not(.e)"), function (t) { if (t.scrollWidth > t.clientWidth + 1) off = true; });
        if (p.row < 96) off = true;   /* icon 56 + chữ + padding cần ≥ 90px cao */
        if (off) list.setAttribute("data-notext", "");
        /* thẻ chưa vừa slide mà vẫn hẹp hơn 104 → slide */
        if (!list.hasAttribute("data-slide") && list.children.length && list.children[0].getBoundingClientRect().width < 96) list.setAttribute("data-slide", "");
        var on = list.querySelector(".on,.sel"); if (list.hasAttribute("data-slide") && on && !list._npSc) { list._npSc = 1; list.scrollLeft = Math.max(0, on.offsetLeft - 8); }
      }
      var st = h.querySelector(":scope>.npp-strip");
      if (st) { var go = st.querySelector(".npr-go"), room = st.clientWidth - p.row - g; if (room < 215) { st.setAttribute("data-icononly", ""); if (go && !go.getAttribute("aria-label")) go.setAttribute("aria-label", (go.textContent || "").replace(/\s+/g, " ").trim()); } else st.removeAttribute("data-icononly"); }
    } finally { busy = 0; }
    /* bố cục vừa đổi (gộp hàng, đổi --row…) → các số đo sau đó có thể đổi nữa: chạy thêm một lượt cho tới khi ổn định (dừng khi chữ ký không đổi, tối đa 6 lượt) */
    var hh = host(), sig = hh ? [hh.style.getPropertyValue("--n"), hh.style.getPropertyValue("--row"), hh.querySelectorAll(".npp-strip,.npp-pg,.npp-pair,.npp-bands").length, hh.children.length, innerWidth, innerHeight].join("|") : "";
    if (sig !== tune.sig) { tune.sig = sig; if ((tune.n = (tune.n || 0) + 1) < 6) sched(); } else tune.n = 0;
  }
  window.__nppTune = tune; var raf = 0; function sched() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; tune(); }); }
  function start() {
    tune();
    var pl = document.getElementById("play") || document.body;
    try { new ResizeObserver(sched).observe(pl); } catch (e) { addEventListener("resize", sched); }
    try { new MutationObserver(function () { if (!busy) sched(); }).observe(pl, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] }); } catch (e) {}
    addEventListener("resize", sched); addEventListener("orientationchange", sched);
    /* phần tử hiện/ẩn bằng style của game (vd #pgBtn) không bắn MutationObserver → theo dõi KÍCH THƯỚC của chúng */
    try { var ro = new ResizeObserver(sched); ["pgBtn", "dailyRow", "npResume", "cards", "paHero"].forEach(function (i) { var e = document.getElementById(i); if (e) ro.observe(e); }); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  addEventListener("load", sched);
})();
