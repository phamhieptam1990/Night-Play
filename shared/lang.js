/* ĐỔI NGÔN NGỮ trong màn chơi: MỘT nguồn sự thật cho cổng và game (GAME_RULES 0a-19). Bài đo: scripts/cozygame/check-lang.js.
   Nguồn sự thật = localStorage "lang" ("vi"|"en") + thuộc tính lang của <html>. Hai bên nói chuyện bằng postMessage {np:1, type:"lang", lang, hello?}
   (cùng origin) và sự kiện "storage" (cùng origin, kể cả tab khác). Nạp bởi shared/bridge.js (trong game) và shared/social.js initParent (ở hai trang cổng).
   VÌ SAO CẦN: trước đây game tự lật LANG + ghi localStorage nhưng KHÔNG báo cho cổng (cột bên lề / nút VI|EN / menu / tên game ở cổng vẫn chữ cũ), đổi ở cổng cũng không tới game
   (iframe chỉ đọc ?lang= lúc mở), nên "nút đổi ngôn ngữ không apply" và cổng ≠ game.
   - GAME: khi <html lang> đổi (bất kể ai bấm: nút trong game, menu ⋯, HUD cổng bấm hộ) -> báo cổng; nhận lệnh từ cổng / storage -> BẤM ĐÚNG NÚT THẬT của game (#bLang | #langBtn)
     nên mọi game dùng đúng hàm setLang của mình (vẽ lại tại chỗ, không reload, không mất ván). Lúc tải xong gửi "hello" kèm ngôn ngữ đang hiện: cổng là chủ -> lệch (vd ?lang= cũ) thì kéo về ngôn ngữ cổng.
   - CỔNG: nhận từ game -> bấm nút VI|EN thật của cổng (#langMenu button[data-l]) nên chạy đúng setLang/applyLang của trang; <html lang> của cổng đổi -> báo game, vẽ lại cột bên lề + HUD ngay. */
(function () {
  "use strict";
  if (window.NPLang) return;
  var de = document.documentElement, ORIGIN = location.origin;
  var norm = function (l) { return String(l || "vi").slice(0, 2).toLowerCase() === "en" ? "en" : "vi"; };
  var cur = function () { return norm(de.lang); };
  var lsGet = function () { try { return localStorage.getItem("lang"); } catch (e) { return null; } };
  var lsSet = function (l) { try { localStorage.setItem("lang", l); } catch (e) {} };
  var inFrame = false; try { inFrame = window.parent !== window && parent.location.origin === ORIGIN; } catch (e) {}
  var isMsg = function (m, t) { return m && m.np === 1 && m.type === t && (m.lang === "vi" || m.lang === "en"); };
  var ready = function (fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); };

  /* ---------------- GAME (trong iframe của cổng) ---------------- */
  function gameSide() {
    var IDS = ["bLang", "langBtn"], target = null, tries = 0, timer = 0, sent = "", up = false, held = null;   /* up: game đã dựng xong (sau sự kiện load) mới nhận lệnh; trước đó chỉ nhớ lệnh cuối */
    var btn = function () { for (var i = 0; i < IDS.length; i++) { var e = document.getElementById(IDS[i]); if (e) return e; } return null; };
    var post = function (m) { try { m.np = 1; m.type = "lang"; parent.postMessage(m, ORIGIN); } catch (e) {} };
    function announce(hello) { var l = cur(); if (!hello && l === sent) return; sent = l; post({ lang: l, hello: !!hello }); }
    function step() {
      timer = 0; if (target === null) return;
      if (cur() === target) { target = null; return; }
      var b = btn();
      if (tries >= (b ? 3 : 14)) { if (!b) lsSet(target); target = null; return; }   /* bỏ cuộc: không bao giờ lặp vô hạn */
      tries++;
      if (b && !b.disabled) { lsSet(target); try { b.click(); } catch (e) {} }   /* nút của game tự lật LANG, ghi localStorage, đặt <html lang> và vẽ lại tại chỗ */
      if (cur() !== target) timer = setTimeout(step, b ? 80 : 150); else target = null;
    }
    function want(l) { l = norm(l); if (!up) { held = l; return; } if (cur() === l) { target = null; return; } if (target === l && timer) return; target = l; tries = 0; clearTimeout(timer); step(); }
    try { new MutationObserver(function () { announce(false); }).observe(de, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
    addEventListener("message", function (e) { if (e.source === parent && e.origin === ORIGIN && isMsg(e.data, "lang")) want(e.data.lang); });
    addEventListener("storage", function (e) { if (e.key === "lang" && (e.newValue === "vi" || e.newValue === "en")) want(e.newValue); });
    var hello = function () { up = true; sent = cur(); if (held !== null) { var h = held; held = null; if (h !== cur()) { want(h); return; } } announce(true); };
    if (document.readyState === "complete") setTimeout(hello, 250); else addEventListener("load", function () { setTimeout(hello, 250); });
    window.NPLang = { get: cur, set: want };
  }

  /* ---------------- CỔNG (trang có #stage + #langMenu) ---------------- */
  function portalSide() {
    var menu = function () { return document.getElementById("langMenu"); };
    var frame = function () { var s = document.getElementById("stage"); return s && s.querySelector("iframe"); };
    var toGame = function (l) { var f = frame(); try { f && f.contentWindow && f.contentWindow.postMessage({ np: 1, type: "lang", lang: l }, ORIGIN); } catch (e) {} };
    function redraw() {   /* cột bên lề + khối HUD đọc ngôn ngữ của cổng: vẽ lại ngay, không chờ nhịp 500 ms / 4 s */
      var run = function () { try { window.NPRails && NPRails.refresh && NPRails.refresh(); } catch (e) {} try { window.NPHud && NPHud.update && NPHud.update(); } catch (e) {} };
      setTimeout(run, 30); setTimeout(run, 400);
    }
    function setPortal(l) {
      if (cur() === l) return;
      var m = menu(), b = m && m.querySelector('button[data-l="' + l + '"]');
      if (b) b.click(); else { lsSet(l); de.lang = l; }
    }
    var last = cur();
    try { new MutationObserver(function () { var l = cur(); if (l === last) return; last = l; toGame(l); redraw(); }).observe(de, { attributes: true, attributeFilter: ["lang"] }); } catch (e) {}
    addEventListener("message", function (e) {
      var f = frame(); if (!f || e.source !== f.contentWindow || e.origin !== ORIGIN || !isMsg(e.data, "lang")) return;
      var l = e.data.lang;
      if (e.data.hello) { if (l !== cur()) toGame(cur()); return; }   /* game mở với ?lang= lệch: cổng là chủ */
      setPortal(l);
    });
    addEventListener("storage", function (e) { if (e.key === "lang" && (e.newValue === "vi" || e.newValue === "en")) setPortal(e.newValue); });
    var seen = null;
    function hook() { var f = frame(); if (!f || f === seen) return; seen = f; f.addEventListener("load", function () { setTimeout(function () { toGame(cur()); }, 200); }); }
    var st = document.getElementById("stage"); if (st) { try { new MutationObserver(hook).observe(st, { childList: true }); } catch (e) {} hook(); }
    window.NPLang = { get: cur, set: setPortal };
  }

  ready(function () {
    if (window.top === window) { if (document.getElementById("langMenu") && document.getElementById("stage")) portalSide(); }
    else if (inFrame) gameSide();
  });
})();
