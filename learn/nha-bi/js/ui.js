/* Tiện ích giao diện dùng chung: $, đường dẫn tranh, chuyển màn, toast, hạt hiệu ứng, hình học của bé cún (miệng, thân). Đặt window.NB làm không gian chung. */
window.NB = window.NB || { care: {} };
(function (N) {
  "use strict";
  var ART = "art/", SCR = ["room"], tt = 0;
  N.$ = function (id) { return document.getElementById(id); };
  N.art = function (n) { return ART + (n.indexOf("cun") === 0 ? NB_DATA.pet.art + n.slice(3) : n) + ".svg"; };   /* "cun*" = tư thế của thú lớp này (tho, meo, cun, gautruc, rong) */
  N.rnd = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  N.later = function (fn, ms) { return setTimeout(fn, ms); };
  N.screen = "room";
  N.show = function (id) { SCR.forEach(function (s) { N.$(s).hidden = s !== id; }); N.screen = id; N.$("ovEnd").hidden = true; if (N.onScreen) N.onScreen(id); };
  N.toast = function (t, ms) { var e = N.$("toast"); e.textContent = t; e.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { e.classList.remove("on"); }, ms || 1500); };
  /* hạt nổi (tim, sao, chữ) tại toạ độ client trong khung .rm hoặc .play */
  N.puff = function (host, x, y, html, cls) {
    var r = host.getBoundingClientRect(), e = document.createElement("i");
    e.className = (cls || "fxp"); e.innerHTML = html; e.style.left = (x - r.left) + "px"; e.style.top = (y - r.top) + "px";
    host.appendChild(e); setTimeout(function () { e.remove(); }, 1300);
  };
  N.petRect = function () { return N.$("pw").getBoundingClientRect(); };
  /* miệng ở khoảng (0.50, 0.63) của khung tranh 256; bán kính trúng 0.26 bề rộng */
  N.mouth = function () { var r = N.petRect(); return { x: r.left + r.width * .5, y: r.top + r.height * .62, r: r.width * .26 }; };
  N.overPet = function (x, y) { var r = N.petRect(); return x > r.left + r.width * .12 && x < r.right - r.width * .12 && y > r.top + r.height * .1 && y < r.bottom - r.height * .02; };
  N.fit = function (el, max, min) {   /* co chữ cho vừa khung, không cuộn */
    var fs = max; el.style.fontSize = fs + "px";
    while ((el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) && fs > min) { fs -= 1; el.style.fontSize = fs + "px"; }
  };
})(window.NB);
window.NB.store = window.NBStore; window.NB.sfx = window.NBSfx;
window.NB.setPetFace = function (img, name) { img.src = window.NB.art(name); };
