/* Pop Play: tách tên game (#title, và h2.np-gname ở cột HUD cổng) thành TỪ > CHỮ để từng chữ nảy MỘT lần khi mở (CSS: shared/poptitle.css).
   Chạy lại khi tên đổi (chọn loại chơi, đổi ngôn ngữ) nhưng KHÔNG nảy lại; trình đọc màn hình đọc nguyên tên qua aria-label. Không làm gì ngoài việc bọc chữ. */
(function () {
  "use strict";
  var reduce = false; try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var first = true;
  function wrap(t) {
    if (t._ptBusy) return; var txt = (t.textContent || "").normalize("NFC");
    if (!txt.trim()) { t.classList.remove("pt-on"); return; }
    if (t._ptTxt === txt && t.querySelector(".pw")) return;
    t._ptBusy = true; t._ptTxt = txt;
    var words = txt.trim().split(/\s+/), n = Array.from(txt.replace(/\s+/g, "")).length, step = Math.min(34, 420 / Math.max(n, 1)), i = 0, f = document.createDocumentFragment();
    words.forEach(function (w, wi) {
      if (wi) f.appendChild(document.createTextNode(" "));
      var pw = document.createElement("span"); pw.className = "pw";
      Array.from(w).forEach(function (ch) { var s = document.createElement("span"); s.className = "pl"; s.textContent = ch; s.style.setProperty("--d", Math.round(i++ * step) + "ms"); pw.appendChild(s); });
      f.appendChild(pw);
    });
    var pi = document.createElement("span"); pi.className = "pi"; pi.appendChild(f); t.textContent = ""; t.appendChild(pi); t.setAttribute("aria-label", txt.trim()); t.classList.add("pt-on");
    if (first && !reduce) { first = false; t.classList.add("pt-anim"); setTimeout(function () { t.classList.remove("pt-anim"); }, 1300); } else first = false;
    t._ptBusy = false; fit(t);
  }
  /* Tên dài ở cột hẹp (điện thoại ngang: cột trái ~130px, "Parents' 5-Second Challenge" xuống 3 dòng): thu nhỏ chữ từng 0,5px (tối thiểu 11px) tới khi còn ≤2 dòng.
     Tên vừa 2 dòng ở cỡ chuẩn thì KHÔNG đổi gì (cỡ chuẩn do CSS quyết định, xoá cỡ thu nhỏ rồi đo lại mỗi lần đổi kích thước). */
  function fit(t) {
    var pi = t.querySelector(".pi"); if (!pi || t._ptFit) return; t._ptFit = 1;
    try {
      t.style.removeProperty("font-size");
      var pls = t.querySelectorAll(".pw"), lines = function () { var s = {}, n = 0; for (var k = 0; k < pls.length; k++) { var y = Math.round(pls[k].offsetTop / 4); if (!s[y]) { s[y] = 1; n++; } } return n; };   /* đếm dòng thật theo vị trí TỪNG TỪ (.pw; từng chữ .pl đang nảy nên offsetTop đổi theo animation; .pi có thể bị cắt chiều cao nên không đo bằng offsetHeight) */
      var cur = parseFloat(getComputedStyle(t).fontSize); var over = function () { return t.scrollWidth > t.clientWidth + 1; };   /* poplandscape.css ép white-space:nowrap!important (đã duyệt) → tên dài không xuống dòng mà TRÀN NGANG: cũng thu chữ cho tới khi vừa */
      while (cur > 11 && (lines() > 2 || over())) { cur -= 0.5; t.style.setProperty("font-size", cur + "px", "important"); }
    } catch (e) {}
    t._ptFit = 0;
  }
  var rz = 0; function refit() { clearTimeout(rz); rz = setTimeout(function () { var t = document.getElementById("title"); if (t && t.classList.contains("pt-title")) fit(t); }, 120); }
  addEventListener("resize", refit); addEventListener("load", refit); try { document.fonts.ready.then(refit); } catch (e) {}
  function gameId() { var m = location.pathname.match(/\/popplay\/games\/([^/]+)\//); return m ? m[1] : ""; }
  function watch(t) {
    if (t._ptW) return; t._ptW = 1;
    try { new MutationObserver(function () { wrap(t); }).observe(t, { childList: true, characterData: true, subtree: true }); } catch (e) {}
    wrap(t);
  }
  function init() { var t = document.getElementById("title"); if (t && t.classList.contains("pt-title")) { if (!t.dataset.pt) t.dataset.pt = gameId(); watch(t); } }
  /* trang cổng Pop (popplay/index.html): tên game ở khối HUD cột trái (rails.js tạo h2.np-gname khi mở game) */
  function portal() {
    var raf = 0;
    function scan() { raf = 0; var h = document.querySelector(".np-gname:not(.pt-title)"), id = (location.hash || "").replace(/^#/, "").split(/[?&]/)[0];
      if (h && /^[a-z0-9-]+$/.test(id)) { h.dataset.pt = id; h.classList.add("pt-title"); watch(h); } else if (h) { h.classList.add("pt-title"); } }
    try { new MutationObserver(function () { if (!raf) raf = requestAnimationFrame(scan); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    scan();
  }
  if (!gameId()) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", portal); else portal(); return; }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
