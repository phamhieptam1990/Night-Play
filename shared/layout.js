/* LAYOUT MỚI (cùng shared/layout.css). Theo sự kiện đổi cỡ (ResizeObserver), KHÔNG hẹn giờ:
   1) đặt html.npl (CSS layout mới chỉ chạy khi có lớp này) + cờ NPLayoutNew để mascot-art.js bỏ phần tự chỉnh pixel cũ;
   2) --rail: bề rộng cột nút bên phải ở màn ngang (chừa chỗ, không đè);
   3) màn chọn: danh sách thẻ (.tys) không vừa bề ngang → data-slide; --row chia cho các hàng cho vừa khít;
   4) LINH VẬT LUÔN HIỆN, lớn hơn mọi nút (≥ 45% chiều cao cột, ≥ --hmin): nếu chật thì KHÔNG thu nhỏ linh vật mà gộp "Tiếp tục" + "Hôm nay" thành MỘT hàng slide (.npl-strip).
   Nạp sớm (trong <head>) để CSS áp từ lần vẽ đầu. */
(function () {
  "use strict";
  var de = document.documentElement; de.classList.add("npl"); window.NPLayoutNew = 1;
  var MINROW = 72, MAXROW = 84, busy = 0;
  function land() { return innerWidth > innerHeight * 1.1; }
  function num(pl, k, d) { return parseFloat(getComputedStyle(pl).getPropertyValue(k)) || d; }
  function rail() {   /* màn ngang: các nút của .top xếp dọc sát mép phải → chừa đúng phần bề rộng chúng chiếm */
    if (!land()) return 0;
    var left = innerWidth;
    Array.prototype.forEach.call(document.querySelectorAll("#play>.top>button"), function (b) { if (!b.offsetParent) return; var r = b.getBoundingClientRect(); if (r.width > 0 && r.left > innerWidth * 0.6 && r.left < left) left = r.left; });
    return left < innerWidth ? Math.ceil(innerWidth - left) : 0;
  }
  function strip(hl, on) {   /* gộp/tách "Tiếp tục" + "Hôm nay" thành một hàng slide */
    var s = hl.querySelector(":scope>.npl-strip"), r = hl.querySelector("#npResume"), d = hl.querySelector("#bDaily,.dbtn");
    if (on && !s && r && d) { s = document.createElement("div"); s.className = "npl-strip"; hl.insertBefore(s, r); s.appendChild(r); s.appendChild(d); if (!d.querySelector(".npl-cal")) { var cal = document.createElement("span"); cal.className = "npl-cal"; if (window.NPIcon && (NPIcon.on || window.NPIconOn)) cal.innerHTML = NPIcon.svg("calendar"); else cal.textContent = "📅"; d.appendChild(cal); } d.setAttribute("aria-label", (d.textContent || "").replace(/\s+/g, " ").trim()); return true; }
    if (s && (!on || !r)) { var d2 = s.querySelector("#bDaily,.dbtn"); if (d2) { d2.removeAttribute("aria-label"); var c2 = d2.querySelector(".npl-cal"); if (c2) c2.remove(); } while (s.firstChild) hl.insertBefore(s.firstChild, s); s.remove(); return true; }
    return false;
  }
  function leftCount(hl) {   /* số HÀNG ngoài linh vật ở cột trái */
    var n = hl.querySelector(":scope>.npl-strip") ? 1 : 0;
    Array.prototype.forEach.call(hl.querySelectorAll(":scope>#bDaily,:scope>#npResume,:scope>.dbtn,:scope>.abar"), function (c) { if (c.offsetParent) n++; });
    return n;
  }
  function tune() {
    var pl = document.getElementById("play"), h = document.getElementById("home"); if (!pl || !h || h.hidden || busy) return;
    busy = 1;
    try {
      if (window.NPIcon) NPIcon.apply(h);   /* emoji → SVG (theo theme) */
      var L = land(), g = num(pl, "--gap", 10), hm = L ? 250 : Math.min(250, 0.5 * pl.clientHeight), H = h.clientHeight;
      var go0 = h.querySelector("#npResume .npr-go");   /* thẻ Tiếp tục: icon SVG resume + MỘT chữ ngắn (bỏ "your game" / "just now") */
      if (go0 && !go0.querySelector(".npr-ic")) {
        var full = (go0.textContent || "").replace(/\s+/g, " ").trim(); if (full) go0.setAttribute("aria-label", full);
        var vi0 = !/^en/i.test(document.documentElement.lang || "vi"), ic = (window.NPIcon && (NPIcon.on || window.NPIconOn)) ? NPIcon.svg("resume") : "▶";
        go0.innerHTML = '<span class="npr-ic">' + ic + '</span><b class="npr-tx">' + (vi0 ? "Tiếp tục" : "Resume") + "</b>";
      }
      pl.style.setProperty("--rail", rail() + "px");
      var pr = pl.getBoundingClientRect(); pl.style.setProperty("--ox", (-pr.left) + "px");   /* khung #play có thể không nằm giữa (qua cổng) → đo vị trí thật */
      pl.style.setProperty("--lgut", (L && de.classList.contains("np-hudg") ? 72 : 0) + "px");   /* cột HUD của cổng bên trái màn ngang */
      var tt = pl.querySelector(":scope>.top>h1");   /* tên game: đặt theo toạ độ MÀN HÌNH thật (khung chứa có thể lệch tuỳ cổng/riêng) — chừa chỗ nút ← ở trái và cụm nút bên phải */
      if (tt) { var back = 64, gp = g, lg = (L && de.classList.contains("np-hudg")) ? 72 : 0, wantL = lg ? lg + gp : gp + back, wantW = innerWidth - wantL - gp - (L ? rail() : 132);
        tt.style.setProperty("left", "0px", "important"); var l0 = tt.getBoundingClientRect().left; tt.style.setProperty("left", (wantL - l0) + "px", "important"); tt.style.setProperty("width", Math.max(60, wantW) + "px", "important"); }
      var hl = h.querySelector(":scope>.hl") || h, hr = h.querySelector(":scope>.hr") || h, tys = h.querySelector(".tys,#tys");
      if (tys) {   /* danh sách thẻ: không vừa bề ngang (thẻ ≥ 84px rộng, ≥ 120px màn ngang) → slide */
        tys.removeAttribute("data-slide");
        var n = tys.children.length, min = L ? 120 : 84;
        if ((n * min + (n - 1) * 8 > tys.clientWidth + 1 && tys.scrollWidth > tys.clientWidth + 1) || n > (L ? 6 : 4)) tys.setAttribute("data-slide", "");
      }
      if (tys) {   /* slide: cuộn tới thẻ đang chọn; hết mép phải → bỏ lớp mờ */
        if (tys.hasAttribute("data-slide")) { var on = tys.querySelector(".ty.on"); if (on && !tys._npSc) { tys._npSc = 1; tys.scrollLeft = Math.max(0, on.offsetLeft - 8); }
          if (!tys._npEv) { tys._npEv = 1; tys.addEventListener("scroll", function () { if (tys.scrollLeft + tys.clientWidth >= tys.scrollWidth - 2) tys.setAttribute("data-end", ""); else tys.removeAttribute("data-end"); }, { passive: true }); } }
        else tys.removeAttribute("data-end");
      }
      var dS = h.querySelector("#dS"), dB = h.querySelector("#bDaily");   /* dòng phụ thẻ Hôm nay: không vừa MỘT dòng → bỏ (không cắt "…") */
      if (dS && dB) { dB.removeAttribute("data-nosub"); var rg = document.createRange(); rg.selectNodeContents(dS); var tw = rg.getBoundingClientRect().width, avail = (dS.parentElement || dS).getBoundingClientRect().width; if (tw > avail - 2) dB.setAttribute("data-nosub", ""); }
      var fb = h.querySelector("#bFree");   /* nút Random round: chữ không vừa MỘT dòng → bỏ chữ, chỉ còn icon xúc xắc */
      if (fb) { fb.removeAttribute("data-notext"); var rg2 = document.createRange(); rg2.selectNodeContents(fb); var need = rg2.getBoundingClientRect().width, have = fb.clientWidth - 32; if (need > have + 1) fb.setAttribute("data-notext", ""); }
      if (H <= 0) return;
      var one = L;   /* MÀN NGANG: linh vật trọn cột trái, MỌI thẻ/nút xếp cột phải, hai cột canh giữa cùng một đường giữa */   /* cột trái không chứa nổi linh vật tối thiểu + 1 hàng → linh vật trọn cột trái, mọi hàng sang cột phải */
      h.classList.toggle("npl-one", one);
      var rowsR = 0, rowsO = 0;   /* ngang: số hàng cột phải · dọc: số hàng ngoài linh vật */
      if (L) {
        if (tys) rowsR += tys.hasAttribute("data-slide") ? 1 : Math.ceil(tys.children.length / 2);
        Array.prototype.forEach.call(hr.children, function (c) { if (c === tys || c.hidden || getComputedStyle(c).display === "none") return; rowsR += 1; });
      } else Array.prototype.forEach.call(h.querySelectorAll("#bDaily,.npl-strip,.tys,#tys,.row,.abar,#npResume"), function (c) { if (c.parentElement && c.parentElement.classList.contains("npl-strip")) return; if (c.offsetParent || getComputedStyle(c).display !== "none") rowsO++; });
      if (one) {
        var both1 = !!(hl.querySelector("#npResume") && hl.querySelector("#bDaily,.dbtn")), kids = tys ? tys.children.length : 0, cw = (h.clientWidth - g) * 0.55;
        var grid2 = !!tys && cw >= 2 * 120 + g, tr = tys ? (grid2 ? Math.ceil(kids / 2) : 1) : 0;
        function rightRows() { var n = tr; Array.prototype.forEach.call(hr.children, function (c) { if (c === tys || c.hidden || getComputedStyle(c).display === "none") return; n++; }); return Math.max(n, 1); }
        function leftRows(merged) { var n = 0; Array.prototype.forEach.call(hl.querySelectorAll(":scope>#bDaily,:scope>#npResume,:scope>.dbtn,:scope>.abar,:scope>.npl-strip"), function (c) { if (c.hidden || getComputedStyle(c).display === "none") return; n++; }); if (both1 && merged && !hl.querySelector(":scope>.npl-strip")) n -= 1; if (both1 && !merged && hl.querySelector(":scope>.npl-strip")) n += 1; return n; }
        if (grid2 && Math.floor((H - (rightRows() - 1) * g) / rightRows()) < MINROW) { grid2 = false; tr = 1; }   /* 2×2 không đủ chỗ → MỘT hàng slide */
        var rR = rightRows(), rw = Math.max(MINROW, Math.min(MAXROW, Math.floor((H - 12 - (rR - 1) * g) / rR)));   /* 12px chừa chỗ huy hiệu bám mép trên */
        var lN = leftRows(false); if (lN) rw = Math.max(MINROW, Math.min(rw, Math.floor((H - 250 - lN * g) / lN)));   /* linh vật ≥ 250px: hàng cột trái không được cao quá */
        var mergeIt = both1;   /* có cả Tiếp tục + Hôm nay → LUÔN gộp thành MỘT hàng */
        strip(hl, mergeIt);
        if (tys) { if (grid2) tys.removeAttribute("data-slide"); else tys.setAttribute("data-slide", ""); }
        var n1 = Math.max(rR, 1), r1 = rw; pl.style.setProperty("--tr", tr || 1);
        pl.style.setProperty("--n", n1); pl.style.setProperty("--row", r1 + "px");
        var st1 = hl.querySelector(":scope>.npl-strip"); if (st1) { var go1 = st1.querySelector(".npr-go"), room1 = st1.clientWidth - r1 * 1.0 - 2 * g; if (room1 < 215) { st1.setAttribute("data-icononly", ""); if (go1 && !go1.getAttribute("aria-label")) go1.setAttribute("aria-label", (go1.textContent || "").replace(/\s+/g, " ").trim()); } else st1.removeAttribute("data-icononly"); }
        var off1 = false; if (tys) tys.removeAttribute("data-notext"); if (tys) Array.prototype.forEach.call(tys.querySelectorAll(".ty>.t"), function (t) { if (t.scrollWidth > t.clientWidth + 1) off1 = true; }); if (tys) { if (off1) tys.setAttribute("data-notext", ""); else tys.removeAttribute("data-notext"); }
        return;
      }
      var both = !!(hl.querySelector("#npResume") && hl.querySelector("#bDaily,.dbtn"));
      function plan(merged) {   /* {row, hero}: nếu gộp (merged) hai hàng Tiếp tục + Hôm nay thành một */
        var cur = hl.querySelector(":scope>.npl-strip") ? 1 : 0, k = L ? leftCount(hl) : rowsO;
        if (both) k += merged ? (cur ? 0 : -1) : (cur ? 1 : 0);
        var row = L ? Math.floor((H - (Math.max(rowsR, 1) - 1) * g) / Math.max(rowsR, 1)) : MAXROW;
        row = Math.min(row, Math.floor((H * 0.55 - k * g) / Math.max(k, 1)), Math.floor((H - hm - k * g) / Math.max(k, 1)), MAXROW);
        row = Math.max(MINROW, row);
        return { row: row, hero: H - k * (row + g) };
      }
      var want = false;
      if (both) { var p0 = plan(false); want = true; }   /* có cả Tiếp tục + Hôm nay → LUÔN gộp thành MỘT hàng */   /* chật → slide, KHÔNG thu nhỏ linh vật */
      strip(hl, want);
      var p = plan(want);
      if (tys) {   /* icon ≥ 56px; chữ luôn MỘT dòng: không vừa một dòng (hoặc dọc: hàng < 84px, không đủ chỗ icon trên chữ) → bỏ chữ cả danh sách, chỉ icon */
        tys.removeAttribute("data-notext");
        var ty1 = tys.querySelector(".ty"), off = !L && !!ty1 && ty1.getBoundingClientRect().height < 96;   /* cao thật của thẻ (CSS mặc định dọc ~63px) */
        if (!off) Array.prototype.forEach.call(tys.querySelectorAll(".ty>.t"), function (t) { if (t.scrollWidth > t.clientWidth + 1) off = true; });
        if (off) tys.setAttribute("data-notext", "");
      }
      var st = hl.querySelector(":scope>.npl-strip");   /* hàng gộp quá hẹp cho chữ → thẻ Tiếp tục chỉ còn icon ▶ */
      if (st) { var go = st.querySelector(".npr-go"), room = st.clientWidth - p.row * 1.72 - 2 * g;
        if (room < 215) { st.setAttribute("data-icononly", ""); if (go && !go.getAttribute("aria-label")) go.setAttribute("aria-label", (go.textContent || "").replace(/\s+/g, " ").trim()); } else st.removeAttribute("data-icononly"); }
      if (p.row < MAXROW && (L || p.row < 96)) pl.style.setProperty("--row", p.row + "px"); else pl.style.removeProperty("--row");
    } finally { busy = 0; }
  }
  var raf = 0; function sched() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; tune(); }); }
  function start() {
    var h = document.getElementById("home"); if (!h) return;
    tune();
    try { new ResizeObserver(sched).observe(h); } catch (e) { addEventListener("resize", sched); }
    try { new MutationObserver(function () { if (!busy) sched(); }).observe(h, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] }); } catch (e) {}
    addEventListener("orientationchange", sched);
    var tp = document.querySelector("#play>.top"); if (tp) { try { new ResizeObserver(sched).observe(tp); new MutationObserver(sched).observe(tp, { childList: true }); } catch (e) {} }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  addEventListener("load", sched);
})();
