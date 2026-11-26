/* LINH VẬT PHÓNG TO + BÓNG THOẠI TRÊN ĐẦU (dùng chung cho trang học truyền thống): hiện lời của màn, chữ hiện từng từ theo nhịp đọc, rồi thu nhỏ về góc dưới trái và biến mất. Chạm để bỏ qua.
   LearnTalk.show({ img, text, title }) · LearnTalk.hide(). Không tự đọc: giọng do trang gọi riêng. Màn hình giảm chuyển động: hiện chữ đủ, không hiệu ứng. */
(function (root) {
  "use strict";
  var el = null, t1 = 0, wt = 0, seq = 0;
  function hide() {
    clearTimeout(t1); clearInterval(wt); if (!el) return; var e = el; el = null; e.classList.add("out"); setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 650);
  }
  function show(o) {
    if (!o || !o.text || !document.body) return; if (el) { clearTimeout(t1); clearInterval(wt); if (el.parentNode) el.parentNode.removeChild(el); el = null; }
    var reduce = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches, my = ++seq;
    el = document.createElement("div"); el.className = "ltk"; el.setAttribute("role", "status");
    var b = document.createElement("div"), m = document.createElement("img"); b.className = "tb"; m.className = "tm"; m.alt = ""; m.src = o.img || "";
    if (o.title) { var tt = document.createElement("span"); tt.className = "tt"; tt.textContent = o.title; b.appendChild(tt); }
    var ws = String(o.text).split(/\s+/).filter(Boolean), sp = ws.map(function (w) {
      var s = document.createElement("span"); s.className = "w" + (reduce ? " on" : ""); s.textContent = w; b.appendChild(s); b.appendChild(document.createTextNode(" ")); return s;
    });
    el.appendChild(b); el.appendChild(m); document.body.appendChild(el); void el.offsetWidth; el.classList.add("on"); el.addEventListener("pointerdown", hide);
    var step = Math.min(420, Math.max(150, o.text.length * 62 / Math.max(1, ws.length))), i = 1;
    if (!reduce && sp.length) {
      sp[0].classList.add("on", "cur");
      wt = setInterval(function () { if (i >= sp.length) { clearInterval(wt); return; } sp[i - 1].classList.remove("cur"); sp[i].classList.add("on", "cur"); i++; }, step);
    }
    t1 = setTimeout(function () { if (my === seq) hide(); }, Math.min(8000, Math.max(2400, o.text.length * 80 + 1200)));
  }
  root.LearnTalk = { show: show, hide: hide };
})(window);
