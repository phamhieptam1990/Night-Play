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
  }
  function queueFit() { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(function () { fitTitle(); fitHome(); }); }
  if (tl) { try { new MutationObserver(queueFit).observe(tl, { childList: true, characterData: true, subtree: true }); new MutationObserver(queueFit).observe(pl, { attributes: true, attributeFilter: ["data-scr"] }); } catch (e) {} addEventListener("resize", queueFit); addEventListener("orientationchange", function () { setTimeout(queueFit, 200); }); if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueFit); queueFit(); }
})();
