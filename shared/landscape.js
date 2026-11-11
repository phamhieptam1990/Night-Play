/* Màn hình ngang: ghi màn đang hiện vào #play[data-scr] và tự làm mờ nút phụ (body.idle) sau 2,6 giây không chạm khi đang chơi. Chỉ cần nhúng <script src="../../../shared/landscape.js" defer>. CSS ở shared/landscape.css. */
(function () {
  "use strict";
  var pl = document.getElementById("play"); if (!pl) return;
  function scr() { var cur = "", s = pl.children; for (var i = 0; i < s.length; i++) { if (s[i].tagName === "SECTION" && !s[i].hidden && !cur) cur = s[i].id; } if (pl.dataset.scr !== cur) pl.dataset.scr = cur; }
  try { new MutationObserver(scr).observe(pl, { subtree: true, attributes: true, attributeFilter: ["hidden"] }); } catch (e) {}
  /* màn chọn: gom các phần tử của #home vào 2 cột .hl (trái) / .hr (phải); ở màn dọc hai cột là display:contents nên bố cục cũ không đổi */
  function wrapHome() {
    var h = document.getElementById("home"); if (!h || h.querySelector(":scope>.hl")) return;
    var kids = Array.prototype.slice.call(h.children), hasTys = !!h.querySelector(":scope>.tys,:scope>#tys");
    var L = document.createElement("div"), R = document.createElement("div"); L.className = "hl"; R.className = "hr";
    kids.forEach(function (k) {
      var left = k.matches("#homeTitle,#hHero,.hero,#hSub,.boss,#hChips,#hLad,.lad,#hNote") || (hasTys && k.matches("#bDaily,#bCamp,#bMake"));
      (left ? L : R).appendChild(k);
    });
    h.appendChild(L); h.appendChild(R);
  }
  /* tên game ở màn chọn (màn dọc): bản sao nằm đầu #home để sát khối nội dung ở giữa */
  var HT = null;
  (function () { var h = document.getElementById("home"), t0 = document.getElementById("ttl"); if (!h || !t0) return; HT = document.createElement("div"); HT.id = "homeTitle"; HT.className = "hometitle"; HT.setAttribute("aria-hidden", "true"); h.insertBefore(HT, h.firstChild); })();
  /* tên game ở MỌI màn không phải màn chọn (đang chơi, kết thúc, câu hỏi...; màn dọc): bản sao nằm đầu mỗi màn, ngay trên cụm nội dung */
  var GTS = [];
  (function () { var t0 = document.getElementById("ttl"); if (!t0) return; Array.prototype.slice.call(pl.children).forEach(function (sec) { if (sec.tagName !== "SECTION" || sec.id === "home" || !sec.classList.contains("scr")) return; var d = document.createElement("div"); d.className = "gametitle"; d.setAttribute("aria-hidden", "true"); sec.insertBefore(d, sec.firstChild); GTS.push(d); }); })();
  function fitGame() { var t0 = document.getElementById("ttl"); if (!t0) return; GTS.forEach(function (GT) { GT.textContent = t0.textContent; GT.style.fontSize = ""; if (!GT.offsetParent) return; var fs = parseFloat(getComputedStyle(GT).fontSize) || 18, guard = 0; while (GT.scrollWidth > GT.clientWidth + 1 && fs > 11 && guard++ < 60) { fs -= 0.5; GT.style.fontSize = fs + "px"; } }); }
  function fitHome() {
    var t0 = document.getElementById("ttl"); if (!HT || !t0) return; HT.textContent = t0.textContent; HT.style.fontSize = "";
    if (!HT.offsetParent) return;
    var fs = parseFloat(getComputedStyle(HT).fontSize) || 24, guard = 0;
    while (HT.scrollWidth > HT.clientWidth + 1 && fs > 12 && guard++ < 60) { fs -= 0.5; HT.style.fontSize = fs + "px"; }
  }
  /* --ar: tỉ lệ cao/rộng của canvas, để CSS biết khung chơi vuông hay dài (màn dọc: gom cụm điểm + khung + nút ra giữa) */
  (function () { var cv = document.getElementById("cv"); if (!cv) return; var last = "";
    function ar() { if (!cv.width || !cv.height) return; var v = (cv.height / cv.width).toFixed(3); if (v !== last) { last = v; pl.style.setProperty("--ar", v); } }
    try { new MutationObserver(ar).observe(cv, { attributes: true, attributeFilter: ["width", "height"] }); } catch (e) {} ar(); })();
  wrapHome();
  scr();
  function isPro() { var P = window.PF; if (!P) return false; var k = P.skinSel; if (Array.isArray(k)) k = k[0]; return !!k && k !== "basic" && !!(P.skins && (P.skins[k] || (P.skins[0] && P.skins[0][k]))); }
  function pro() { var v = isPro() ? "1" : ""; if ((pl.dataset.pro || "") !== v) { if (v) pl.dataset.pro = v; else delete pl.dataset.pro; } }
  setInterval(pro, 500); pro();
  /* Nhúng trong trang cổng: gom nút CHỤP ẢNH + CHIA SẺ + QUAY LẠI vào chính thanh trên của game (một hàng, bars.js tự gom ⋯ khi chật),
     để trang cổng không phải dựng làn riêng/nút nổi che nút của game. Trang cổng thấy cờ __npDock và ẩn các nút nổi của nó. */
  (function () {
    var par = null; try { par = window.parent !== window ? window.parent : null; if (par) par.document.getElementById("stage"); } catch (e) { par = null; }
    if (!par || !par.document.getElementById("stage")) return;
    var top = document.querySelector(".top"); if (!top) return;
    var pd = par.document, find = function (sel) { return pd.querySelector(sel); };
    var mk = function (id, svgOrText, label, target) {
      var b = document.createElement("button"); b.type = "button"; b.className = "ib"; b.id = id; b.setAttribute("aria-label", label); b.title = label; b.innerHTML = svgOrText;
      b.addEventListener("click", function () { var e = find(target); if (e) e.click(); }); return b;
    };
    var CAM = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.6"/></svg>';
    var SHR = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6"/></svg>';
    var vi = (document.documentElement.lang || "vi") === "vi";
    var anchor = document.getElementById("bSnd") || null;
    var cam = mk("bCam", CAM, vi ? "Chụp ảnh" : "Screenshot", ".nps-cam"), shr = mk("bShr", SHR, vi ? "Chia sẻ" : "Share", ".nps-fab:not(.nps-cam)");
    top.insertBefore(cam, anchor); top.insertBefore(shr, anchor);
    var short = matchMedia("(orientation:landscape) and (max-height:520px)"), docked = true;   /* màn ngang thấp: hết chỗ xếp cột nút → để trang cổng dùng cột riêng bên trái */
    function applyDock() { docked = !short.matches; cam.hidden = shr.hidden = !docked; window.__npDock = docked; if (bk && docked && bk.hidden) bk.hidden = false; if (bk && !docked) { var h0 = document.getElementById("home"); bk.hidden = !!(h0 && !h0.hidden); } }
    /* nút ← luôn hiện: ở màn chọn thì thoát về trang cổng */
    var bk = document.getElementById("bBk") || document.getElementById("bBack"), home = document.getElementById("home");   /* Bàn Cờ Hiếu Tối dùng id bBack */
    if (bk) {
      var keep = function () { if (docked && bk.hidden) bk.hidden = false; };
      try { new MutationObserver(keep).observe(bk, { attributes: true, attributeFilter: ["hidden"] }); } catch (e) {} keep();
      bk.addEventListener("click", function (e) { if (docked && home && !home.hidden) { e.stopImmediatePropagation(); e.preventDefault(); var h = find("#stage #home") || find("#home"); if (h) h.click(); } }, true);
    }
    applyDock(); try { short.addEventListener("change", applyDock); } catch (e) { try { short.addListener(applyDock); } catch (e2) {} }
  })();
  var t = 0;
  function wake() { document.body.classList.remove("idle"); clearTimeout(t); t = setTimeout(function () { if (pl.dataset.scr === "game") document.body.classList.add("idle"); }, 2600); }
  ["pointermove", "pointerdown", "keydown", "touchstart", "wheel"].forEach(function (e) { addEventListener(e, wake, { passive: true }); });
  wake();
  /* tiêu đề game: không xuống dòng và hạn chế dấu “…” — thu nhỏ chữ vừa đủ để nằm trọn một dòng (cả màn dọc lẫn ngang) */
  var tl = document.getElementById("ttl"), land = matchMedia("(orientation:landscape) and (max-height:700px),(orientation:landscape) and (pointer:coarse) and (max-height:900px)"), fitRaf = 0;
  function fitTitle() {
    if (!tl) return; tl.style.fontSize = "";
    pl.classList.remove("tight");
    var fs = parseFloat(getComputedStyle(tl).fontSize) || 16, lim = 11, guard = 0;
    while (tl.scrollWidth > tl.clientWidth + 1 && fs > lim && guard++ < 40) { fs -= 0.5; tl.style.fontSize = fs + "px"; }
    if (tl.scrollWidth > tl.clientWidth + 1) {   /* vẫn bị cắt ở cỡ chữ nhỏ nhất: thu nhỏ các nút trên cùng để dành chỗ cho tiêu đề */
      pl.classList.add("tight"); tl.style.fontSize = ""; fs = parseFloat(getComputedStyle(tl).fontSize) || 16; guard = 0;
      while (tl.scrollWidth > tl.clientWidth + 1 && fs > lim && guard++ < 40) { fs -= 0.5; tl.style.fontSize = fs + "px"; }
    }
    /* màn NGANG vẫn bị cắt “…” ở cỡ chữ nhỏ nhất (tên dài / nhãn thử thách hôm nay): cho xuống tối đa 2 dòng (lớp wrap2) thay vì cắt */
    tl.classList.remove("wrap2");
    if (tl.scrollWidth > tl.clientWidth + 1 && matchMedia("(orientation:landscape)").matches) {
      tl.classList.add("wrap2"); tl.style.fontSize = ""; fs = parseFloat(getComputedStyle(tl).fontSize) || 16; guard = 0;
      while ((tl.scrollHeight > tl.clientHeight + 1 || tl.scrollWidth > tl.clientWidth + 1) && fs > lim && guard++ < 40) { fs -= 0.5; tl.style.fontSize = fs + "px"; }
    }
  }
  function queueFit() { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(function () { fitTitle(); fitHome(); fitGame(); }); }
  if (tl) { try { new MutationObserver(queueFit).observe(tl, { childList: true, characterData: true, subtree: true }); new MutationObserver(queueFit).observe(pl, { attributes: true, attributeFilter: ["data-scr"] }); } catch (e) {} addEventListener("resize", queueFit); addEventListener("orientationchange", function () { setTimeout(queueFit, 200); }); if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueFit); queueFit(); }
})();
