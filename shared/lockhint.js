/* Gợi ý nút khoá phụ huynh/cài đặt: phải NHẤN GIỮ 3 giây mới mở. Trước: nút không có chỉ dẫn, chạm nhanh thì im lặng → người dùng không biết.
   - nút có title + aria-label "…· Giữ 3 giây" (theo ngôn ngữ trang);
   - thả tay trước 3 giây (hoặc chạm nhanh) → hiện thẻ nhỏ "Giữ nút 3 giây để mở" cạnh nút, tự tắt sau 2,6s. Không phụ thuộc mạng. */
(function () {
  "use strict";
  var btn = document.getElementById("lock"); if (!btn) return;
  var HOLD = 3000, t0 = 0, tip = null, timer = 0;
  function vi() { return /^vi/i.test(document.documentElement.lang || "vi"); }
  function txt() { return vi() ? "Giữ nút này 3 giây để mở" : "Hold this button for 3 seconds to open"; }
  function label() { var base = (btn.getAttribute("data-lh-base") || btn.getAttribute("aria-label") || ""); if (!btn.getAttribute("data-lh-base")) btn.setAttribute("data-lh-base", base); return (base ? base + " · " : "") + (vi() ? "Giữ 3 giây" : "Hold 3s"); }
  function paint() { var l = label(); btn.title = l; btn.setAttribute("aria-label", l); }
  paint();
  try { new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
  var css = document.createElement("style");
  css.textContent = "#lockHint{position:fixed;z-index:2147483000;max-width:min(260px,calc(100vw - 24px));box-sizing:border-box;padding:10px 14px;border-radius:14px;font:800 14px/1.3 var(--font,system-ui,sans-serif);color:#fff;text-align:center;background:linear-gradient(165deg,#2b2064,#171236 62%,#120e2b);border:1.5px solid rgba(170,150,255,.6);box-shadow:0 10px 28px rgba(0,0,0,.45),0 0 18px rgba(124,92,255,.35);pointer-events:none;animation:lhIn .18s ease-out}#lockHint::after{content:\"\";position:absolute;right:18px;bottom:-7px;width:12px;height:12px;background:#171236;border-right:1.5px solid rgba(170,150,255,.6);border-bottom:1.5px solid rgba(170,150,255,.6);transform:rotate(45deg)}@keyframes lhIn{from{opacity:0;transform:translateY(6px)}}@media (prefers-reduced-motion:reduce){#lockHint{animation:none}}";
  document.head.appendChild(css);
  function hide() { clearTimeout(timer); if (tip) { tip.remove(); tip = null; } }
  function show() {
    hide(); tip = document.createElement("div"); tip.id = "lockHint"; tip.setAttribute("role", "status"); tip.textContent = txt(); document.body.appendChild(tip);
    var r = btn.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.max(12, Math.min(innerWidth - w - 12, r.right - w)), top = r.top - h - 12;
    if (top < 8) { top = r.bottom + 12; tip.style.setProperty("--flip", "1"); }
    tip.style.left = left + "px"; tip.style.top = top + "px";
    timer = setTimeout(hide, 2600);
  }
  btn.addEventListener("pointerdown", function () { t0 = performance.now(); hide(); });
  ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) {
    btn.addEventListener(ev, function () { if (!t0) return; var d = performance.now() - t0; t0 = 0; if (d < HOLD - 150) show(); });
  });
})();
