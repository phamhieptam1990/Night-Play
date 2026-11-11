/* Nhúng trong trang cổng: gom nút CHỤP ẢNH + CHIA SẺ + QUAY LẠI của cổng vào chính thanh trên của game (cùng cơ chế với shared/landscape.js nhưng KHÔNG cần
   #play/landscape.css) — dùng cho game có kiến trúc riêng: Đập Deadline, Cánh Nhỏ Phiêu Lưu. bCam/bShr nằm trong .top rồi shared/fan.js gom vào menu ⋯ (điện thoại dọc);
   trang cổng thấy cờ __npDock và ẩn nút nổi + nút ← của nó, nên chỉ còn MỘT nút ← (của game: ở màn chọn thì thoát về cổng). Mở trực tiếp (không iframe): không làm gì. */
(function () {
  "use strict";
  if (document.documentElement.classList.contains("np-multi")) return;   /* chế độ chơi cùng lúc (?multi=1): host lo các nút */
  var par = null; try { par = window.parent !== window ? window.parent : null; if (par) par.document.getElementById("stage"); } catch (e) { par = null; }
  if (!par || !par.document.getElementById("stage")) return;
  function init() {
    var top = document.querySelector(".top"); if (!top || document.getElementById("bCam")) return;
    var pd = par.document, find = function (sel) { return pd.querySelector(sel); };
    var mk = function (id, html, label, target) {
      var b = document.createElement("button"); b.type = "button"; b.className = "ib"; b.id = id; b.setAttribute("aria-label", label); b.title = label; b.innerHTML = html;
      b.addEventListener("click", function () { var e = find(target); if (e) e.click(); }); return b;
    };
    var S = 'viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    var CAM = "<svg " + S + '><path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.6"/></svg>';
    var SHR = "<svg " + S + '><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6"/></svg>';
    var vi = (document.documentElement.lang || "vi").slice(0, 2) !== "en";
    var anchor = document.getElementById("bSnd") || document.getElementById("soundBtn"); if (anchor && anchor.parentNode !== top) anchor = null;
    var cam = mk("bCam", CAM, vi ? "Chụp ảnh" : "Screenshot", ".nps-cam"), shr = mk("bShr", SHR, vi ? "Chia sẻ" : "Share", ".nps-fab:not(.nps-cam)");
    top.insertBefore(cam, anchor); top.insertBefore(shr, anchor);
    var lck = mk("bLock", '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>', vi ? "Khoá màn" : "Lock", "#klock"); lck.hidden = true; top.insertBefore(lck, anchor);
    var bk = document.getElementById("bBk"), home = document.getElementById("home") || document.getElementById("ovStart");   /* "màn chọn": #home (Đập Deadline) hoặc #ovStart (Cánh Nhỏ) */
    var atHome = function () { return !!(home && !home.hidden); };
    var short = (par.matchMedia ? par : window).matchMedia("(orientation:landscape)")   /* hướng của CỔNG (không phải của iframe: iframe hẹp hơn cao sẽ tự báo "dọc" rồi dao động dock ↔ không dock) */, docked = true;   /* màn NGANG (mọi cỡ, GAME_RULES 0a-20: một nơi chứa nút): để trang cổng dùng cột riêng */
    function syncLk() { var k = find("#klock"), h = !docked || !k || k.hidden; if (lck.hidden !== h) lck.hidden = h; }
    setInterval(syncLk, 700);
    function applyDock() {
      docked = !short.matches; cam.hidden = shr.hidden = !docked; syncLk(); window.__npDock = docked;
      if (bk && docked && bk.hidden) bk.hidden = false;
      if (bk && !docked && atHome()) bk.hidden = true;                  /* ngang thấp: ở màn chọn ẩn ← (cổng có nút riêng) */
    }
    if (bk) {
      var keep = function () { if (docked && bk.hidden) bk.hidden = false; };
      try { new MutationObserver(keep).observe(bk, { attributes: true, attributeFilter: ["hidden"] }); } catch (e) {} keep();
      bk.addEventListener("click", function (e) { if (docked && atHome()) { e.stopImmediatePropagation(); e.preventDefault(); var h = find("#stage #home") || find("#home"); if (h) h.click(); } }, true);
    }
    applyDock(); try { short.addEventListener("change", applyDock); } catch (e) { try { short.addListener(applyDock); } catch (e2) {} }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
