/* TIẾP TỤC VÁN DỞ + NÚT BACK trong game (nhúng sau shared/bridge.js ở MỌI game).
   1) Tự LƯU ván đang chơi vào localStorage "np-resume:<id game>" (trạng thái lấy từ NP.state của game — cùng dữ liệu dùng cho chơi hộ):
      mỗi ~4 giây khi có thay đổi, khi ẩn tab / rời trang (pagehide, visibilitychange), khi back về màn chọn. XOÁ khi ván kết thúc (NP.result) hoặc khi
      người chơi chủ động bắt đầu ván mới (NP.start). Không lưu ở chế độ chơi hộ thật (?helper=1) và thách đấu (#ch=). Hết hạn sau 7 ngày (ván hôm nay: trong ngày).
   2) Ở MÀN CHỌN hiện thẻ "▶ Tiếp tục ván dở" (+ nút ✕ bỏ ván): bấm → tải lại game với ?resume=1 (bridge.js nạp trạng thái qua đường khởi tạo của chơi hộ,
      nhưng KHÔNG ẩn nút; game khởi tạo xong là ván thường).
   3) BACK (vuốt/nút của trình duyệt, cả trong iframe của trang cổng): khi đang CHƠI, mục lịch sử được đẩy thêm 1 lớp (pushState) → Back = về màn chọn của game
      (và lưu ván), Back lần nữa = thoát game như cũ. Rời màn chơi bằng cách khác (←, kết thúc) thì lớp đó được gỡ để lịch sử không phình ra.
   API cho trang cha: NPResume.exitPlay() (true nếu vừa đưa game về màn chọn), NPResume.flush() (lưu ngay trước khi gỡ iframe). */
(function () {
  "use strict";
  var NP = window.NP; if (!NP || !NP.peek || !NP.gid) return;
  /* nạp các mô-đun đi kèm (không phải sửa từng game): shared/exitconfirm.js (hỏi trước khi thoát + chống bấm nhầm), shared/inapp.js (banner "Mở bằng trình duyệt" ở trang chơi hộ/thách đấu) */
  var base = ((document.currentScript && document.currentScript.src) || "").replace(/resume\.js(\?.*)?$/, "");
  function load(f) { if (!base) return; var sc = document.createElement("script"); sc.src = base + f; sc.async = false; (document.head || document.documentElement).appendChild(sc); }
  var MULTI = NP.multi === true;   /* ?multi=1 (chơi cùng lúc, xem bridge.js): host lo nút thoát/Back/tiếp tục; vẫn LƯU ván để host đẩy/nạp lại khung */
  if (!MULTI) load("exitconfirm.js"); load("endguard.js"); load("difficulty.js");   /* endguard.js: cú chạm nối tiếp ngay sau khi hết ván không được tự chơi lại / làm mất màn kết thúc */
  var gid = NP.gid, RK = "np-resume:" + gid;
  var q = new URLSearchParams(location.search);
  var realHelper = q.get("helper") === "1", challenge = /^#ch=/.test(location.hash);
  /* game chưa có đường khởi tạo từ trạng thái (initialState) thì chỉ dùng Back, không lưu/tiếp tục */
  var NO_RESUME = { "ban-co-hieu-toi": 1, "be-dau-bo-me": 1 };
  var canResume = !realHelper && !NO_RESUME[gid];
  if ((realHelper || challenge) && !MULTI) load("inapp.js");
  var vi = function () { return (document.documentElement.lang || "vi") === "vi"; };
  var vnDay = function () { try { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } };
  var read = function () {
    try { var r = JSON.parse(localStorage.getItem(RK)); if (!r || !r.state || typeof r.state !== "object") return null;
      var age = Date.now() - r.ts; if (!(age >= 0 && age < 7 * 864e5)) return null; if (r.daily && r.day !== vnDay()) return null; return r; } catch (e) { return null; }
  };
  var clearRec = function () { try { localStorage.removeItem(RK); } catch (e) {} lastJs = ""; };
  var lastJs = "", lastSave = 0;

  /* có tiến trình thật chưa? Game dựng từ khung chung có snapP: chưa có thanh tre/nét nào thì không đáng lưu */
  function hasProgress(st) { return !!st && (typeof window.snapP !== "function" || !!st.p); }
  function write(st) {
    if (!canResume || challenge || !hasProgress(st)) return;
    var js; try { js = JSON.stringify(st); } catch (e) { return; }
    if (js === lastJs) return;
    try { localStorage.setItem(RK, JSON.stringify({ v: 1, ts: Date.now(), daily: st.m === "daily", day: vnDay(), state: st })); lastJs = js; lastSave = Date.now(); } catch (e) {}
  }
  function saveNow() { if (!canResume || challenge) return; write(NP.peek()); }

  /* ---------- BACK ---------- */
  var HOME_IDS = ["bBk", "homeBtn", "bHome", "sumHome", "bBack"];
  /* trả về một hàm "về màn chọn": nút có sẵn, hoặc hàm goHome() toàn cục của game (Cánh Nhỏ / Đập Deadline / Chim Bay); không có thì không đẩy lịch sử */
  function findHome() {
    for (var i = 0; i < HOME_IDS.length; i++) { var e = document.getElementById(HOME_IDS[i]); if (e) return function () { e.click(); }; }
    if (typeof window.goHome === "function") return function () { window.goHome(); };
    return null;
  }
  var pushed = false, ignore = 0, ignoreT = 0, waiting = false, playing = false;
  function doPush() { if (pushed) return; try { history.pushState({ npPlay: 1 }, ""); pushed = true; } catch (e) {} }
  function tryPush() {
    if (MULTI || pushed || !findHome()) return;
    /* Chrome bỏ qua mục lịch sử thêm khi chưa có thao tác người dùng: chờ chạm/phím đầu tiên rồi mới đẩy */
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
      if (waiting) return; waiting = true;
      var f = function () { waiting = false; ["pointerdown", "keydown", "touchstart"].forEach(function (n) { removeEventListener(n, f, true); }); if (playing) doPush(); };
      ["pointerdown", "keydown", "touchstart"].forEach(function (n) { addEventListener(n, f, { capture: true, once: true }); });
      return;
    }
    doPush();
  }
  function leavePlay() {
    if (!pushed) return; pushed = false; ignore++;
    clearTimeout(ignoreT); ignoreT = setTimeout(function () { ignore = 0; }, 900);   // phòng khi trình duyệt không bắn popstate
    try { history.back(); } catch (e) { ignore = 0; }
  }
  addEventListener("popstate", function () {
    if (ignore > 0) { ignore--; return; }
    if (!pushed) return;
    pushed = false;
    var X = window.NPExit;
    if (X && X.open()) { X.dismiss(); doPush(); return; }   // Back lần nữa khi popup đang mở = ở lại chơi tiếp
    if (X && X.playing()) {                                 // đang chơi: hỏi trước (giữ lại mục lịch sử để Back sau vẫn bắt được)
      doPush(); saveNow(); X.ask(exitNow); return;
    }
    saveNow();
    var h = findHome(); if (h) h();
  });
  /* thoát thật (người chơi đã chọn "Thoát"): gỡ mục lịch sử đã đẩy, lưu ván, về màn chọn */
  function exitNow() {
    leavePlay(); saveNow();
    var h = findHome(); if (h) { if (window.NPExit) NPExit.bypass(h); else h(); }
  }

  /* ---------- vòng kiểm tra nhẹ (500ms): lịch sử + lưu định kỳ ---------- */
  var bootDone = false;
  addEventListener("load", function () { setTimeout(function () { bootDone = true; }, 500); });
  setInterval(function () {
    var st = NP.peek(); playing = !!st;
    if (window.NPExit) NPExit.tick(playing);
    if (playing) tryPush(); else if (pushed) leavePlay();
    if (st && Date.now() - lastSave >= 4000) write(st);
  }, 500);
  addEventListener("pagehide", saveNow);
  document.addEventListener("visibilitychange", function () { if (document.hidden) saveNow(); });
  addEventListener("np:result", function () { clearRec(); });
  addEventListener("np:start", function () { if (NP.resumeBoot() && !bootDone) return; clearRec(); });   // lần start lúc nạp ván tiếp tục thì bỏ qua; ván mới thì xoá bản lưu cũ

  /* ---------- thẻ "Tiếp tục ván dở" ở màn chọn ---------- */
  var card = null;
  var T = {
    vi: { go: "▶ Tiếp tục ván dở", x: "Bỏ ván này", ago: function (m) { return m < 1 ? "vừa xong" : m < 60 ? m + " phút trước" : m < 1440 ? Math.round(m / 60) + " giờ trước" : Math.round(m / 1440) + " ngày trước"; } },
    en: { go: "▶ Resume your game", x: "Discard this game", ago: function (m) { return m < 1 ? "just now" : m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : Math.round(m / 1440) + " d ago"; } }
  };
  var css = document.createElement("style");
  css.textContent =
    "#npResume{grid-column:1/-1;display:flex;align-items:stretch;gap:2cqw;margin:0;flex:none;width:100%}" +
    "#npResume .npr-go{flex:1;min-width:0;min-height:48px;border:0;border-radius:99cqw;padding:1.4cqw 5cqw;text-align:left;cursor:pointer;color:#fff;background:linear-gradient(100deg,#6a45ff,#ff5a1f);font:800 clamp(14px,4.2cqw,19px)/1.2 var(--body,system-ui,sans-serif);text-shadow:0 1px 2px rgba(0,0,0,.35);box-shadow:0 .9cqw 0 rgba(0,0,0,.28),0 0 4cqw rgba(124,92,255,.5);animation:npRes 2.6s ease-in-out infinite}" +
    "#npResume .npr-go small{display:block;font-weight:700;font-size:.72em;opacity:.92}" +
    "#npResume .npr-x{flex:none;width:48px;min-height:48px;border-radius:50%;padding:0;cursor:pointer;color:#fff;background:rgba(30,24,52,.82);border:1.5px solid rgba(255,255,255,.55);font:800 16px system-ui}" +
    "@keyframes npRes{50%{filter:brightness(1.12)}}@media (prefers-reduced-motion:reduce){#npResume .npr-go{animation:none}}";
  document.head.appendChild(css);

  function build(rec) {
    var t = T[vi() ? "vi" : "en"], d = document.createElement("div"); d.id = "npResume"; d.setAttribute("role", "group");
    var m = Math.floor((Date.now() - rec.ts) / 60000);
    d.innerHTML = '<button type="button" class="npr-go"></button><button type="button" class="npr-x"></button>';
    var go = d.querySelector(".npr-go"), x = d.querySelector(".npr-x");
    go.innerHTML = t.go + "<small></small>"; go.querySelector("small").textContent = t.ago(m);
    x.textContent = "✕"; x.setAttribute("aria-label", t.x); x.title = t.x;
    go.addEventListener("click", function () { try { var u = new URL(location.href); u.searchParams.set("resume", "1"); u.hash = ""; location.replace(u.href); } catch (e) {} });
    x.addEventListener("click", function () { clearRec(); ensure(); });
    return d;
  }
  /* màn chọn: phần tử #home; game không có #home (Cánh Nhỏ, Chim Bay, Làng Của Bé) thì dùng khung chứa danh sách ô chọn, và coi là màn chọn khi không đang chơi */
  function selectHost() {
    var home = document.getElementById("home");
    if (home) { var vis = !home.hidden && home.offsetParent !== null; return vis ? { el: home, home: true } : null; }
    var sel = ".tile,.band,.dbar,.main", t = document.querySelector(sel); if (!t || t.offsetParent === null || NP.peek()) return null;
    var host = t.parentNode; while (host && host !== document.body && host.querySelectorAll(sel).length < 2) host = host.parentNode;   // khung chứa CẢ danh sách ô chọn, không phải bên trong một ô
    return host && host !== document.body ? { el: host, home: false } : null;
  }
  function ensure() {
    var h = canResume && !challenge && !MULTI && !NP.resumeBoot() ? selectHost() : null, rec = h ? read() : null;
    if (!rec || !h) { if (card && card.parentNode) card.remove(); if (!rec && !canResume) card = null; if (!read()) card = null; return; }
    if (!card) card = build(rec);
    var host = (h.home && h.el.querySelector(":scope>.hl")) || h.el;
    if (card.parentNode !== host) {   // ngay trên nút chơi chính nếu có (thẻ hôm nay), không thì đầu màn chọn
      var anchor = host.querySelector(":scope>#bDaily,:scope>#bCamp,:scope>#bMake,:scope>.dbtn,:scope>#bPractice");
      host.insertBefore(card, anchor || host.firstChild);
    }
  }
  function watch() {
    ensure(); setInterval(ensure, 700);
    var home = document.getElementById("home");
    try { if (home) new MutationObserver(function () { clearTimeout(watch.t); watch.t = setTimeout(ensure, 60); }).observe(home, { childList: true, attributes: true, attributeFilter: ["hidden", "class", "style"] }); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch); else watch();

  window.NPResume = {
    flush: saveNow,
    exitNow: exitNow,
    canSave: function () { return canResume && !challenge; },
    exitPlay: function () { if (pushed) { try { history.back(); } catch (e) { return false; } return true; } return false; },
    has: function () { return !!read(); }
  };
})();
