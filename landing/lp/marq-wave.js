/* Hàng icon game ở đầu trang (màn rộng): icon ĐANG Ở GIỮA màn hình phóng to lên, cả hàng nhấp nhô như sóng khi chạy.
   Chỉ đặt biến CSS --mq-s (tỉ lệ) và --mq-y (độ nâng) lên từng .mi; không đổi bố cục. Dừng khi hàng ra khỏi màn hình, khi tab ẩn
   hoặc người dùng bật "giảm chuyển động". Không bật ở màn hẹp (điện thoại) để khỏi tốn pin. */
(function () {
  "use strict";
  var mq = document.querySelector(".marq"); if (!mq) return;
  var wide = window.matchMedia("(min-width:900px)"), reduce = window.matchMedia("(prefers-reduced-motion:reduce)");
  var items = [].slice.call(mq.querySelectorAll(".mi")), raf = 0, on = false, t0 = performance.now();
  function frame(now) {
    raf = 0; if (!on) return;
    var mr = mq.getBoundingClientRect(), w = window.innerWidth, cx = mr.left + mr.width / 2, t = (now - t0) / 1000;
    for (var i = 0; i < items.length; i++) {
      var r = items[i].getBoundingClientRect(); if (r.right < mr.left - 80 || r.left > mr.right + 80) continue;
      var d = ((r.left + r.width / 2) - cx) / (mr.width * 0.22), k = Math.exp(-d * d);   /* 1 ở chính giữa, về 0 ở xa */
      var s = 1 + 0.42 * k, y = -14 * k + 4 * Math.sin(t * 2.2 + i * 0.9);       /* to lên + sóng nhẹ theo thời gian */
      var x = 40 * d * Math.exp(-d * d * 0.5);                                    /* đẩy icon hai bên ra xa tâm để icon to không chồng */
      items[i].style.setProperty("--mq-s", s.toFixed(3)); items[i].style.setProperty("--mq-y", y.toFixed(1) + "px"); items[i].style.setProperty("--mq-x", x.toFixed(1) + "px");
      items[i].style.zIndex = String(1 + Math.round(k * 100));                    /* icon càng gần giữa càng nằm trên */
    }
    raf = requestAnimationFrame(frame);
  }
  function sync() {
    var want = wide.matches && !reduce.matches && !document.hidden && vis;
    if (want && !on) { on = true; raf = requestAnimationFrame(frame); }
    else if (!want && on) { on = false; if (raf) cancelAnimationFrame(raf); raf = 0; items.forEach(function (el) { el.style.removeProperty("--mq-s"); el.style.removeProperty("--mq-y"); el.style.removeProperty("--mq-x"); el.style.zIndex = ""; }); }
  }
  var vis = true;
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; sync(); }).observe(mq);
  [wide, reduce].forEach(function (m) { if (m.addEventListener) m.addEventListener("change", sync); });
  document.addEventListener("visibilitychange", sync); sync();
})();
