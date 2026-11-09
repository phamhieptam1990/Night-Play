/* Điện thoại dọc: gom các nút phụ trên thanh trên (?, 🏆, 📷, 📤, EN, 🔊) vào MỘT nút tròn lớn ở góc phải trên; bấm vào thì các nút xổ ra theo CUNG TRÒN
   (mỗi nút 48px, dễ bấm), bấm ra ngoài / bấm lại / Esc / chọn một nút thì đóng. Nút ← (quay lại) vẫn ở góc trái, to hơn.
   - Không tạo nút mới thay thế: chỉ DI CHUYỂN các nút có sẵn (giữ nguyên id + sự kiện) vào vòng cung, nên mọi chức năng cũ không đổi.
   - Chỉ bật khi (max-width:520px) và màn dọc; màn rộng/ngang trả các nút về thanh trên như cũ.
   - Nút xuất hiện muộn (📷/📤 do landscape.js gắn, ? do help.js) được tự gom vào. Không làm gì nếu trang không có thanh .top với >= 3 nút phụ (game Pop Play). */
(function () {
  "use strict";
  var ORIG = ["bHelp", "bBoard", "bCam", "bShr", "bSnd", "bLang"];      // thứ tự cũ trên thanh trên
  var FAN = ["bHelp", "bBoard", "bCam", "bShr", "bLang", "bSnd"];       // thứ tự trên cung: từ TRÁI (xa ngón cái) đến DƯỚI (gần ngón cái nhất)
  var play = document.getElementById("play"), top = play && play.querySelector(".top");
  if (!play || !top) return;
  var mq = matchMedia("(max-width:520px) and (orientation:portrait)");
  var fab, fan, bd, open = false, moved = false;
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var vi = function () { return (document.documentElement.lang || "vi") === "vi"; };

  var st = document.createElement("style");
  st.textContent =
    "#npFab,#npFan{display:none}" +
    "@media (max-width:520px) and (orientation:portrait){" +
    "#play.npfan .top{padding-right:76px}" +
    "#play.npfan #bBk{width:46px;height:46px;min-width:46px;min-height:46px}" +
    "#npFab{display:grid;place-items:center;position:absolute;right:12px;top:8px;width:56px;height:56px;padding:0;border-radius:50%;z-index:31;cursor:pointer;color:var(--on,#fff);background:var(--accent,#7C5CFF);border:2px solid rgba(255,255,255,.55);box-shadow:0 4px 14px rgba(0,0,0,.35),0 0 0 4px color-mix(in srgb,var(--accent,#7C5CFF) 25%,transparent);transition:transform .25s}" +
    "#npFab svg{width:26px;height:26px;display:block;grid-area:1/1;transition:opacity .2s,transform .25s}#npFab .x{opacity:0;transform:rotate(-90deg) scale(.6)}" +
    "#npFab.open{transform:rotate(90deg)}#npFab.open .d{opacity:0;transform:scale(.6)}#npFab.open .x{opacity:1;transform:rotate(0) scale(1)}" +
    "#npFab:active{filter:brightness(.92)}#npFab:focus-visible{outline:3px solid #fff;outline-offset:3px}" +
    "#npFan{display:block;position:absolute;inset:0;z-index:30;pointer-events:none}#npFan.open{pointer-events:auto}" +
    "#npFan .bk{position:absolute;inset:0;background:rgba(12,8,28,.5);opacity:0;transition:opacity .22s}#npFan.open .bk{opacity:1}" +
    "#npFan .it{position:absolute;right:16px;top:12px;width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;font-size:15px!important;margin:0!important;display:grid!important;place-items:center;padding:0!important;" +
    "opacity:0;pointer-events:none;transform:translate(0,0) scale(.3);transition:transform .3s cubic-bezier(.2,1.5,.4,1),opacity .18s;transition-delay:var(--d,0s)}" +
    "#npFan.open .it{opacity:1;pointer-events:auto;transform:translate(var(--dx),var(--dy)) scale(1)}" +
    "#npFan .it svg{width:24px!important;height:24px!important}" +
    "}" +
    "@media (prefers-reduced-motion:reduce){#npFab,#npFab svg,#npFan .bk,#npFan .it{transition:none!important}}";
  document.head.appendChild(st);

  var DOTS = '<svg class="d" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>';
  var XICO = '<svg class="x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function build() {
    if (fab) return;
    fab = document.createElement("button"); fab.type = "button"; fab.id = "npFab"; fab.innerHTML = DOTS + XICO; fab.setAttribute("aria-haspopup", "true"); fab.setAttribute("aria-expanded", "false");
    fan = document.createElement("div"); fan.id = "npFan";
    bd = document.createElement("div"); bd.className = "bk"; fan.appendChild(bd);
    play.appendChild(fan); play.appendChild(fab);
    fab.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
    bd.addEventListener("click", function () { close(); });
    fan.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest(".it"); if (b) setTimeout(close, 0); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) { close(); fab.focus(); } });
    labelFab();
  }
  function labelFab() { if (!fab) return; var t = vi() ? (open ? "Đóng menu" : "Mở menu") : (open ? "Close menu" : "Open menu"); fab.setAttribute("aria-label", t); fab.title = t; }
  function items() { return FAN.map(function (id) { return document.getElementById(id); }).filter(function (e) { return e && e.parentNode === fan && !e.hidden; }); }
  function layout() {
    var list = items(), n = list.length; if (!n) return;
    var step = n > 1 ? 90 / (n - 1) : 0, R = n > 1 ? Math.max(130, 29 / Math.sin(step * Math.PI / 360) + 4) : 120;
    list.forEach(function (b, i) {
      var a = (180 - i * step) * Math.PI / 180;
      b.style.setProperty("--dx", (R * Math.cos(a)).toFixed(1) + "px"); b.style.setProperty("--dy", (R * Math.sin(a)).toFixed(1) + "px");
      b.style.setProperty("--d", reduce ? "0s" : (i * 0.035).toFixed(3) + "s");
    });
  }
  function setOpen(v) { open = v; fan.classList.toggle("open", v); fab.classList.toggle("open", v); fab.setAttribute("aria-expanded", String(v)); labelFab(); if (v) layout(); }
  function toggle() { setOpen(!open); }
  function close() { if (open) setOpen(false); }

  /* gom các nút có sẵn vào vòng cung (giữ nguyên phần tử, id, sự kiện) */
  function adopt() {
    if (!mq.matches) return;
    var found = ORIG.filter(function (id) { var e = document.getElementById(id); return e && (e.parentNode === top || e.parentNode === fan); });
    if (found.length < 3 && !moved) return;                     // trang không có đủ nút phụ (Pop Play...): bỏ qua
    build(); moved = true; play.classList.add("npfan");
    FAN.forEach(function (id) { var e = document.getElementById(id); if (e && e.parentNode === top) { e.classList.add("it"); fan.appendChild(e); } });
    if (open) layout();
  }
  /* màn rộng/ngang: trả nút về thanh trên theo thứ tự cũ */
  function restore() {
    if (!moved) return;
    close(); play.classList.remove("npfan");
    ORIG.forEach(function (id) { var e = document.getElementById(id); if (e && e.parentNode === fan) { e.classList.remove("it"); ["--dx", "--dy", "--d"].forEach(function (p) { e.style.removeProperty(p); }); top.appendChild(e); } });
  }
  function sync() { if (mq.matches) adopt(); else restore(); }

  try { new MutationObserver(function () { if (mq.matches) adopt(); }).observe(top, { childList: true }); } catch (e) {}
  try { new MutationObserver(function () { if (open) layout(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
  try { mq.addEventListener("change", sync); } catch (e) { try { mq.addListener(sync); } catch (e2) {} }
  addEventListener("resize", function () { if (open) layout(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync); else sync();
  setTimeout(sync, 600); setTimeout(sync, 2000);                // nút do script khác gắn muộn
})();
