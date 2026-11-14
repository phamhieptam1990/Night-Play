/* Pop Play: thẻ "cách chơi" (#ovHow) luôn VỪA khung (GAME_RULES 0a-7/8: popup trọn trong màn hình, không cắt đầu/đuôi).
   Cỡ chữ/hình của thẻ tính theo cqw của khung nên ở khung rộng-thấp (điện thoại ngang, web thấp) nội dung cao hơn cả màn (tiêu đề y<0, nút Bắt đầu ngoài đáy).
   Đo khối nội dung thật rồi thu đều bằng CSS zoom (biến --hz, tối thiểu .45) cho tới khi vừa; CSS đặt zoom:var(--hz,1) lên con của #ovHow (poplandscape.css). */
(function () {
  "use strict";
  if (!/\/popplay\//.test(location.pathname)) return;
  var raf = 0;
  function fit() {
    raf = 0; var o = document.getElementById("ovHow"); if (!o) return;
    o.style.setProperty("--hz", "1"); if (o.hidden) return;
    var hz = 1, i, ks, q, t, b, l, r, cs, ah, aw, k;
    for (i = 0; i < 5; i++) {
      ks = [].filter.call(o.children, function (c) { return c.getClientRects().length && getComputedStyle(c).position !== "fixed"; }); if (!ks.length) return;
      t = 1e9; b = -1e9; l = 1e9; r = -1e9;
      ks.forEach(function (c) { q = c.getBoundingClientRect(); t = Math.min(t, q.top); b = Math.max(b, q.bottom); l = Math.min(l, q.left); r = Math.max(r, q.right); });
      cs = getComputedStyle(o); ah = o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom); aw = o.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      k = Math.min(ah / Math.max(b - t, 1), aw / Math.max(r - l, 1), 1); if (k >= 0.995) break;
      hz = Math.max(0.45, hz * k * 0.98); o.style.setProperty("--hz", hz.toFixed(3));
    }
  }
  function soon() { if (!raf) raf = requestAnimationFrame(fit); }
  function init() {
    var o = document.getElementById("ovHow"); if (!o) return;
    try { new MutationObserver(soon).observe(o, { attributes: true, attributeFilter: ["hidden", "style"], childList: true, subtree: true, characterData: true }); } catch (e) {}
    addEventListener("resize", soon); addEventListener("load", soon); soon();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
