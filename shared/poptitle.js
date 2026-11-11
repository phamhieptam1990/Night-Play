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
    t._ptBusy = false;
  }
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
