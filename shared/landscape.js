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
      var left = k.matches("#hHero,.hero,#hSub,.boss,#hChips,#hLad,.lad,#hNote") || (hasTys && k.matches("#bDaily,#bCamp,#bMake"));
      (left ? L : R).appendChild(k);
    });
    h.appendChild(L); h.appendChild(R);
  }
  wrapHome();
  scr();
  function isPro() { var P = window.PF; if (!P) return false; var k = P.skinSel; if (Array.isArray(k)) k = k[0]; return !!k && k !== "basic" && !!(P.skins && (P.skins[k] || (P.skins[0] && P.skins[0][k]))); }
  function pro() { var v = isPro() ? "1" : ""; if ((pl.dataset.pro || "") !== v) { if (v) pl.dataset.pro = v; else delete pl.dataset.pro; } }
  setInterval(pro, 500); pro();
  var t = 0;
  function wake() { document.body.classList.remove("idle"); clearTimeout(t); t = setTimeout(function () { if (pl.dataset.scr === "game") document.body.classList.add("idle"); }, 2600); }
  ["pointermove", "pointerdown", "keydown", "touchstart", "wheel"].forEach(function (e) { addEventListener(e, wake, { passive: true }); });
  wake();
})();
