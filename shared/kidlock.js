/* KHOÁ MÀN HÌNH CHƠI + TOÀN MÀN HÌNH — CHỈ POP PLAY (trẻ nhỏ). Nạp ở popplay/index.html (trang cổng); KHÔNG nhúng ở Night Play / Cozy.
   Nút "Khoá màn hình chơi" (icon ổ khoá, 44px) nằm trong thanh điều khiển của khung game (cạnh nút ←). Bấm:
     - vào toàn màn hình (Fullscreen API trên <html> để cổng phụ huynh vẫn hiện được), thử khoá hướng màn hình hiện tại và phím Esc (Keyboard Lock), tất cả try/catch;
     - ẩn nút ←, chia sẻ, chụp ảnh; hiện chỉ báo nhỏ "Đang khoá".
   Khi đang khoá: Back / vuốt back / phím Esc trong game (shared/exitconfirm.js gọi NPKidLock.requestExit()), cũng như thoát toàn màn hình, đều hiện CỔNG PHỤ HUYNH
   (ParentGate.ask, luôn hỏi mới, không dùng "nhớ 10 phút"). Chỉ khi trả lời đúng mới mở khoá. Thoát toàn màn hình mà chưa qua cổng: lớp phủ "Đã tạm dừng"
   (game tạm dừng) với nút "Chơi tiếp" (vào lại toàn màn hình — cần chạm) và "Phụ huynh mở khoá".
   iPhone Safari không có Fullscreen API: vẫn ẩn ← và dùng cổng phụ huynh khi Back; hộp hướng dẫn "Thêm vào Màn hình chính" + "Truy cập có hướng dẫn" hiện trước khi khoá.
   Ván tự lưu bằng shared/resume.js; đồng hồ giới hạn thời gian của trang cổng vẫn chạy (hết giờ → game đóng → tự mở khoá).
   Không hiện nút trong webview của app (shared/inapp.js: NPInApp.is). API: NPKidLock.locked(), requestExit(), release(). */
(function () {
  "use strict";
  var stage = document.getElementById("stage"); if (!stage || window.NPKidLock) return;
  var de = document.documentElement;
  var vi = function () { return (de.lang || "vi").slice(0, 2) !== "en"; };
  var T = {
    vi: { lock: "Khoá màn hình chơi", on: "Đang khoá", paused: "Đã tạm dừng", pausedP: "Màn hình chơi đang khoá. Bé chạm “Chơi tiếp”, hoặc phụ huynh mở khoá.", resume: "Chơi tiếp", unlock: "Phụ huynh mở khoá",
      hh: "Khoá màn hình chơi", hp: "Bé sẽ không thoát ra ngoài được nếu chưa trả lời câu hỏi của phụ huynh.", start: "Khoá", cancel: "Thôi",
      nofs: "Trình duyệt này không có chế độ toàn màn hình, nên nút ← được ẩn và nút Back sẽ hỏi phụ huynh.",
      ios: "Để chắc chắn hơn trên iPhone/iPad: (1) bấm Chia sẻ rồi chọn “Thêm vào Màn hình chính” và mở game từ biểu tượng đó; (2) bật Cài đặt › Trợ năng › Truy cập có hướng dẫn, rồi bấm 3 lần nút nguồn/Home để khoá ứng dụng." },
    en: { lock: "Lock play screen", on: "Locked", paused: "Paused", pausedP: "The play screen is locked. Kids tap “Play on”, or a parent can unlock.", resume: "Play on", unlock: "Parent unlock",
      hh: "Lock the play screen", hp: "Your child can’t leave until a parent answers the question.", start: "Lock", cancel: "Cancel",
      nofs: "This browser has no full-screen mode, so the ← button is hidden and Back will ask a parent.",
      ios: "For a firmer lock on iPhone/iPad: (1) tap Share, then “Add to Home Screen”, and open the game from that icon; (2) turn on Settings › Accessibility › Guided Access, then triple-click the side/Home button to lock the app." }
  };
  var tt = function () { return T[vi() ? "vi" : "en"]; };
  var inApp = function () { return !!(window.NPInApp && NPInApp.is); };

  var locked = false, fsActive = false, blocker = null, gateOpen = false, btn, ind, hint = null, lastFs = 0;
  var fsEl = de, rfs = de.requestFullscreen || de.webkitRequestFullscreen;
  var fsSupported = !!rfs && document.fullscreenEnabled !== false;
  var fsNow = function () { return document.fullscreenElement || document.webkitFullscreenElement; };
  var iconLock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  var css = document.createElement("style");
  css.textContent =
    "#klock{position:absolute;z-index:3;width:44px;height:44px;border-radius:50%;padding:0;display:grid;place-items:center;cursor:pointer;color:#fff;background:rgba(22,17,48,.72);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.2);box-shadow:0 4px 14px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.16),inset 0 0 14px rgba(124,92,255,.3);top:calc(env(safe-area-inset-top,0px) + 2px);left:calc(max(12px,env(safe-area-inset-left)) + 50px)}" +
    "#klock svg{width:22px;height:22px}#klock:focus-visible{outline:3px solid #fff;outline-offset:2px}" +
    "@media (orientation:landscape){#klock{top:calc(env(safe-area-inset-top,0px) + 157px);left:4px}}" +
    "html.np-locked #stage #home,html.np-locked #stage #klock,html.np-locked #stage .nps-fab,html.np-locked #stage .nps-cam{display:none!important}" +
    "#klind{position:absolute;z-index:3;display:none;align-items:center;gap:6px;height:30px;padding:0 12px 0 9px;border-radius:99px;pointer-events:none;color:#fff;background:rgba(32,28,44,.82);border:1.5px solid rgba(255,255,255,.5);font:800 13px/1 var(--font);top:calc(env(safe-area-inset-top,0px) + 9px);left:max(12px,env(safe-area-inset-left))}" +
    "#klind svg{width:15px;height:15px}html.np-locked #klind{display:flex}" +
    "@media (orientation:landscape){#klind{top:calc(env(safe-area-inset-top,0px) + 12px);left:6px;width:40px;height:40px;padding:0;justify-content:center}#klind span{display:none}#klind svg{width:20px;height:20px}}" +
    "#klO{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:14px;background:rgba(14,10,30,.94);font-family:inherit}" +
    "#klO .klc{box-sizing:border-box;width:min(380px,100%);max-height:100%;border-radius:22px;padding:18px 16px 14px;text-align:center;background:var(--panel,#fff);color:var(--ink,#1c1b22);border:2px solid var(--accent,#FF5A1F);box-shadow:0 18px 50px rgba(0,0,0,.5)}" +
    "#klO h2{margin:6px 0 6px;font-family:var(--font);font-weight:800;font-size:clamp(20px,5.6vw,24px);line-height:1.2}#klO p{margin:0 0 12px;font-family:inherit;font-weight:600;font-size:14px;line-height:1.45;opacity:.88}" +
    "#klO .kli{width:44px;height:44px;margin:0 auto;color:var(--accent,#FF5A1F)}#klO .kli svg{width:100%;height:100%}" +
    "#klO .klt{font-size:13px;text-align:left;padding:9px 11px;border-radius:12px;background:color-mix(in srgb,var(--accent,#FF5A1F) 12%,transparent);margin-bottom:12px}" +
    "#klO button{display:block;width:100%;box-sizing:border-box;border-radius:16px;font-family:inherit;font-weight:800;font-size:17px;line-height:1.2;cursor:pointer;padding:0 14px;min-height:52px}" +
    "#klO .klg{border:0;background:var(--accent,#FF5A1F);color:var(--on-accent,#fff);box-shadow:0 4px 0 rgba(0,0,0,.22)}" +
    "#klO .klx{min-height:48px;margin-top:10px;background:transparent;color:inherit;border:2px solid var(--line,#d9d5ee);font-size:16px}" +
    "#klO button:focus-visible{outline:3px solid var(--ink,#000);outline-offset:2px}" +
    "@media (max-height:420px){#klO .klc{padding:10px 14px}#klO .kli{display:none}#klO h2{margin-top:0}#klO p{margin-bottom:8px}#klO .klt{margin-bottom:8px;font-size:12px}#klO .klr{display:flex;gap:10px}#klO .klx{margin-top:0}#klO button{min-height:48px}}";
  document.head.appendChild(css);

  btn = document.createElement("button"); btn.id = "klock"; btn.type = "button"; btn.innerHTML = iconLock;
  var home = document.getElementById("home"); stage.insertBefore(btn, home ? home.nextSibling : null);
  ind = document.createElement("div"); ind.id = "klind"; ind.innerHTML = iconLock + "<span></span>"; stage.appendChild(ind);
  function labels() { var x = tt(); btn.setAttribute("aria-label", x.lock); btn.title = x.lock; ind.querySelector("span").textContent = x.on; ind.setAttribute("aria-label", x.on); }
  labels(); new MutationObserver(labels).observe(de, { attributes: true, attributeFilter: ["lang"] });
  function showBtn() { btn.hidden = inApp(); }
  showBtn(); addEventListener("load", function () { setTimeout(showBtn, 300); });   // inapp.js nạp sau một chút

  /* ---------- lớp phủ chung ---------- */
  function frameWin() { var f = stage.querySelector("iframe"); try { return f && f.contentWindow; } catch (e) { return null; } }
  function markFrame() { var w = frameWin(); try { w && w.document.documentElement.classList.toggle("np-locked", locked); } catch (e) {} }
  var paused = false;
  function pauseGame(on) { if (on === paused) return; paused = on; var w = frameWin(); try { if (w && w.NP) { on ? w.NP.pauseNow && w.NP.pauseNow() : w.NP.resumeNow && w.NP.resumeNow(); } } catch (e) {} }
  stage.addEventListener("load", markFrame, true);

  function box(inner) {
    var o = document.createElement("div"); o.id = "klO"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.innerHTML = '<div class="klc">' + inner + "</div>";
    document.body.appendChild(o); return o;
  }

  /* ---------- hộp xác nhận / hướng dẫn trước khi khoá ---------- */
  function askStart() {
    if (hint) return; var x = tt(), ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var note = !fsSupported ? '<p class="klt">' + x.nofs + (ios ? "<br><br>" + x.ios : "") + "</p>" : "";
    hint = box('<div class="kli">' + iconLock + "</div><h2>" + x.hh + "</h2><p>" + x.hp + "</p>" + note + '<div class="klr"><button type="button" class="klg">' + x.start + '</button><button type="button" class="klx">' + x.cancel + "</button></div>");
    var close = function () { hint && hint.remove(); hint = null; };
    hint.querySelector(".klg").addEventListener("click", function () { close(); engage(); });
    hint.querySelector(".klx").addEventListener("click", close);
    hint.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    hint.querySelector(".klg").focus();
  }
  btn.addEventListener("click", function () { if (!locked) askStart(); });

  /* ---------- khoá ---------- */
  function engage() {   // gọi từ thao tác bấm: Fullscreen API cần cử chỉ người dùng
    locked = true; de.classList.add("np-locked"); markFrame(); fsActive = false;
    enterFs();
  }
  function lockOrient() {   // chỉ khoá được khi đã ở toàn màn hình; khoá theo hướng đang cầm máy
    try { var so = screen.orientation, cur = so && so.type; if (so && so.lock && cur) { var p = so.lock(cur.indexOf("landscape") === 0 ? "landscape" : "portrait"); p && p.catch && p.catch(function () {}); } } catch (e) {}
  }
  function enterFs() {
    if (!fsSupported) return;
    try {
      var r = rfs.call(fsEl, { navigationUI: "hide" }); if (r && r.catch) r.catch(function () {});
    } catch (e) { try { var r2 = rfs.call(fsEl); r2 && r2.catch && r2.catch(function () {}); } catch (e2) {} }
    try { if (navigator.keyboard && navigator.keyboard.lock) { var k = navigator.keyboard.lock(["Escape"]); k && k.catch && k.catch(function () {}); } } catch (e) {}
  }
  function release() {
    if (!locked) return; locked = false; fsActive = false; de.classList.remove("np-locked"); markFrame();
    removeBlocker(); if (hint) { hint.remove(); hint = null; }
    try { navigator.keyboard && navigator.keyboard.unlock && navigator.keyboard.unlock(); } catch (e) {}
    try { screen.orientation && screen.orientation.unlock && screen.orientation.unlock(); } catch (e) {}
    try { if (fsNow()) (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {}
    pauseGame(false);
  }
  function removeBlocker() { if (blocker) { blocker.remove(); blocker = null; } }

  /* ---------- cổng phụ huynh ---------- */
  function gate() {
    if (!locked || gateOpen || !window.ParentGate) return; gateOpen = true;
    var done = function () { gateOpen = false; };
    ParentGate.ask(function () { done(); release(); }, done, { fresh: true });
  }
  function requestExit() { if (locked) gate(); }

  /* ---------- thoát toàn màn hình khi đang khoá ---------- */
  function onFs() {
    var on = !!fsNow(); lastFs = Date.now();
    if (!locked) return;
    if (on) { fsActive = true; removeBlocker(); pauseGame(false); lockOrient(); return; }
    if (!fsActive) return;   // chưa kịp vào toàn màn hình (bị từ chối)
    fsActive = false; pauseGame(true);
    if (!blocker) {
      var x = tt();
      blocker = box('<div class="kli"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg></div><h2>' + x.paused + "</h2><p>" + x.pausedP + '</p><div class="klr"><button type="button" class="klg">' + x.resume + '</button><button type="button" class="klx">' + x.unlock + "</button></div>");
      blocker.style.zIndex = "49";
      blocker.querySelector(".klg").addEventListener("click", function () { enterFs(); });
      blocker.querySelector(".klx").addEventListener("click", gate);
      blocker.querySelector(".klg").focus();
    }
    gate();
  }
  document.addEventListener("fullscreenchange", onFs);
  document.addEventListener("webkitfullscreenchange", onFs);
  addEventListener("keydown", function (e) { if (locked && e.key === "Escape" && !(e.target && e.target.closest && e.target.closest("#pgOv"))) { e.preventDefault(); requestExit(); } });

  /* game đóng (hết giờ, về trang chủ) → mở khoá */
  new MutationObserver(function () { if (locked && !stage.classList.contains("on")) release(); }).observe(stage, { attributes: true, attributeFilter: ["class"] });

  window.NPKidLock = { locked: function () { return locked; }, requestExit: requestExit, release: release };
})();
