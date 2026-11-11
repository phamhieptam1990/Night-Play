/* HỎI TRƯỚC KHI THOÁT VÁN + CHỐNG BẤM NHẦM khi đang chơi (nạp tự động bởi shared/resume.js ở MỌI game Cozy và Pop Play; không cần nhúng tay).
   1) NPExit.ask(onExit): hiện popup "Thoát ván này?" — nút to "Tiếp tục chơi" (mặc định) + nút phụ "Thoát". Chỉ gọi onExit khi người chơi chọn Thoát.
      Gọi từ: Back (nút/vuốt/phím Back của trình duyệt — resume.js), nút ← #bBk (chặn click khi đang chơi), phím Esc, trang cổng (🏠 khi đang chơi).
      Không đang chơi (màn chọn / kết thúc: NP.peek() === null) thì KHÔNG hỏi: onExit chạy luôn.
      Popup lấy màu thật của game (--panel/--ink/--accent hoặc màu nền/chữ đang hiển thị) nên đúng cả giao diện Night Pass; nút >= 48px; không cuộn.
      Game tạm dừng (NP.pauseNow) trong lúc hỏi, chạy tiếp khi chọn "Tiếp tục chơi".
   2) Khoá của Pop Play (shared/kidlock.js ở trang cổng): đang KHOÁ thì ask() không hiện popup này mà gọi cổng phụ huynh của trang cha.
   3) Chống bấm nhầm CHỈ khi đang chơi (class html.np-playing): không kéo-để-tải-lại (overscroll-behavior), không chọn chữ / menu giữ-chạm, không phóng to
      bằng 2 ngón / chạm đúp. Màn chọn và kết thúc giữ nguyên (trợ năng, ô nhập vẫn chọn/phóng to được).
   API: NPExit.ask(onExit), NPExit.playing(), NPExit.open(), NPExit.dismiss(), NPExit.allow() (lần ask kế tiếp qua luôn — trang cổng đã hỏi rồi), NPExit.tick(playing). */
(function () {
  "use strict";
  var NP = window.NP; if (!NP || !NP.peek || window.NPExit) return;
  var T = {
    vi: { h: "Thoát ván này?", saved: "Ván được lưu, lần sau bấm “Tiếp tục”.", unsaved: "Ván này sẽ không được lưu.", go: "Tiếp tục chơi", out: "Thoát" },
    en: { h: "Leave this game?", saved: "Your game is saved — tap “Resume” next time.", unsaved: "This game won’t be saved.", go: "Keep playing", out: "Leave" }
  };
  var vi = function () { return (document.documentElement.lang || "vi").slice(0, 2) !== "en"; };
  /* màn chọn hiện (#home) thì không phải đang chơi, dù game còn trả NP.peek() (xem resume.js atSelect) */
  var peek = function () { try { var h = document.getElementById("home"); if (h && !h.hidden && h.offsetParent !== null) return null; return NP.peek(); } catch (e) { return null; } };
  var playing = false, ov = null, onLeave = null, allowUntil = 0, skipClick = false;

  /* ---------- chống bấm nhầm ---------- */
  var st = document.createElement("style");
  st.textContent =
    "html.np-playing,html.np-playing body{overscroll-behavior:none;touch-action:pan-x pan-y}" +
    "html.np-playing *{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}" +
    "html.np-playing input,html.np-playing textarea,html.np-playing [contenteditable]{-webkit-user-select:text;user-select:text}" +
    "html.np-locked #bBk,html.np-locked #bkBack,html.np-locked #homeBtn,html.np-locked #bBack{display:none!important}" +
    "#npxO{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:12px;background:rgba(8,6,20,.62);font-family:var(--body,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif)}" +
    "#npxO .npxc{box-sizing:border-box;width:min(360px,100%);max-height:100%;border-radius:22px;padding:18px 16px 14px;text-align:center;border:2px solid var(--npx-line);background:var(--npx-bg);color:var(--npx-ink);box-shadow:0 18px 50px rgba(0,0,0,.5)}" +
    "#npxO h2{margin:0 0 6px;font-family:var(--display,inherit);font-weight:800;font-size:clamp(19px,5.4vw,23px);line-height:1.2;color:var(--npx-ink)}" +
    "#npxO p{margin:0 0 14px;font-family:inherit;font-weight:600;font-size:clamp(13px,3.8vw,15px);line-height:1.4;color:var(--npx-ink);opacity:.85}" +
    "#npxO button{display:block;width:100%;box-sizing:border-box;border-radius:16px;font-family:inherit;font-weight:800;font-size:17px;line-height:1.2;cursor:pointer;padding:0 14px}" +
    "#npxO .npx-go{min-height:56px;border:0;background:var(--npx-acc);color:var(--npx-on);box-shadow:0 4px 0 rgba(0,0,0,.25)}" +
    "#npxO .npx-out{min-height:48px;margin-top:10px;background:transparent;color:var(--npx-ink);border:2px solid var(--npx-line);font-size:16px}" +
    "#npxO button:focus-visible{outline:3px solid var(--npx-ink);outline-offset:2px}" +
    "@media (max-height:420px){#npxO .npxc{padding:10px 14px 10px;width:min(440px,100%)}#npxO p{margin-bottom:8px}#npxO .npx-row{display:flex;gap:10px}#npxO .npx-out{margin-top:0}#npxO .npx-go{flex:1.4}#npxO .npx-out{flex:1}}";
  document.head.appendChild(st);
  var inField = function (t) { return t && t.closest && t.closest("input,textarea,select,[contenteditable]"); };
  document.addEventListener("selectstart", function (e) { if (playing && !inField(e.target)) e.preventDefault(); }, true);
  document.addEventListener("contextmenu", function (e) { if (playing && !inField(e.target)) e.preventDefault(); }, true);
  document.addEventListener("gesturestart", function (e) { if (playing) e.preventDefault(); }, { passive: false });   // Safari: phóng to bằng 2 ngón
  document.addEventListener("touchmove", function (e) { if (playing && e.touches && e.touches.length > 1 && e.cancelable) e.preventDefault(); }, { passive: false });

  /* ---------- màu theo game ---------- */
  function rgb(c) { var d = document.createElement("i"); d.style.color = ""; d.style.color = c; if (!d.style.color) return null; document.body.appendChild(d); var m = getComputedStyle(d).color.match(/[\d.]+/g); d.remove(); return m && m.length >= 3 ? m.map(Number) : null; }
  var lum = function (c) { return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; };
  var css = function (c) { return "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")"; };
  function theme() {
    var cs = getComputedStyle(document.documentElement), v = function (n) { return cs.getPropertyValue(n).trim(); };
    var bodyBg = rgb(getComputedStyle(document.body).backgroundColor), htmlBg = rgb(cs.backgroundColor), solid = function (c) { return c && !(c.length > 3 && +c[3] === 0); };
    var page = (solid(bodyBg) && bodyBg) || (solid(htmlBg) && htmlBg) || null;
    var panel = null, k = ["--panel", "--card", "--bg"]; for (var i = 0; i < k.length && !panel; i++) { var x = v(k[i]); if (x) panel = rgb(x); }
    if (!panel) panel = page || [255, 255, 255];
    var ink = null; k = ["--ink", "--text", "--fg"]; for (i = 0; i < k.length && !ink; i++) { x = v(k[i]); if (x) ink = rgb(x); }
    if (!ink) ink = rgb(getComputedStyle(document.body).color) || (lum(panel) > 0.55 ? [30, 25, 40] : [245, 245, 255]);
    if (Math.abs(lum(ink) - lum(panel)) < 0.4) ink = lum(panel) > 0.55 ? [30, 25, 40] : [245, 245, 255];   // chữ phải tương phản với nền thẻ
    var acc = null; k = ["--accent", "--pri", "--primary"]; for (i = 0; i < k.length && !acc; i++) { x = v(k[i]); if (x) acc = rgb(x); }
    if (!acc) acc = [255, 90, 31];
    var on = lum(acc) > 0.6 ? [25, 20, 35] : [255, 255, 255];
    return { bg: css(panel), ink: css(ink), acc: css(acc), on: css(on), line: css(acc) };
  }

  /* ---------- popup ---------- */
  function close(resume) {
    if (!ov) return; ov.remove(); ov = null; onLeave = null;
    if (resume && NP.resumeNow) NP.resumeNow();
  }
  function askNow(onExit) {
    if (ov) return;
    var x = T[vi() ? "vi" : "en"], th = theme(), saved = !!(window.NPResume && NPResume.canSave && NPResume.canSave());
    ov = document.createElement("div"); ov.id = "npxO"; ov.setAttribute("role", "alertdialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-labelledby", "npxH");
    ov.style.setProperty("--npx-bg", th.bg); ov.style.setProperty("--npx-ink", th.ink); ov.style.setProperty("--npx-acc", th.acc); ov.style.setProperty("--npx-on", th.on); ov.style.setProperty("--npx-line", th.line);
    ov.innerHTML = '<div class="npxc"><h2 id="npxH"></h2><p></p><div class="npx-row"><button type="button" class="npx-go"></button><button type="button" class="npx-out"></button></div></div>';
    ov.querySelector("h2").textContent = x.h; ov.querySelector("p").textContent = saved ? x.saved : x.unsaved;
    var go = ov.querySelector(".npx-go"), out = ov.querySelector(".npx-out"); go.textContent = x.go; out.textContent = x.out;
    onLeave = onExit;
    go.addEventListener("click", function () { close(true); });
    out.addEventListener("click", function () { var f = onLeave; close(false); if (f) f(); });
    ov.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(true); } });
    document.body.appendChild(ov);
    if (NP.pauseNow) NP.pauseNow();
    go.focus();
  }
  var lockedParent = function () { try { return parent !== window && parent.NPKidLock && parent.NPKidLock.locked() ? parent.NPKidLock : null; } catch (e) { return null; } };
  function ask(onExit) {
    if (Date.now() < allowUntil) { allowUntil = 0; onExit(); return; }
    var kl = lockedParent(); if (kl) { kl.requestExit(); return; }   // đang khoá (Pop Play): cổng phụ huynh thay cho popup này
    if (!peek()) { onExit(); return; }                              // không đang chơi: không hỏi
    askNow(onExit);
  }

  /* ← trên header (và nút về màn chọn) khi đang chơi: hỏi trước. Bấm xác nhận → flush ván rồi bấm lại nút (bỏ qua chốt này). */
  document.addEventListener("click", function (e) {
    if (skipClick || !playing) return;
    var b = e.target && e.target.closest && e.target.closest("#bBk,#bBack,#homeBtn"); if (!b || !peek()) return;
    e.preventDefault(); e.stopImmediatePropagation();
    ask(function () { try { window.NPResume && NPResume.flush(); } catch (x) {} skipClick = true; try { b.click(); } finally { skipClick = false; } });
  }, true);
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || !playing || ov || e.defaultPrevented) return;
    var os = document.querySelectorAll(".ov.on,.overlay.on,dialog[open],#ovEnd.on,[role=dialog]:not([hidden]),[aria-modal=true]:not([hidden])");   // đang có hộp thoại HIỆN của game: Esc để game xử lý
    for (var i = 0; i < os.length; i++) { var r = os[i].getBoundingClientRect(), c = getComputedStyle(os[i]); if (r.width > 0 && r.height > 0 && c.display !== "none" && c.visibility !== "hidden" && +c.opacity > 0.05 && os[i].id !== "npxO") return; }
    if (!peek()) return;
    e.preventDefault(); ask(function () { window.NPResume && NPResume.exitNow && NPResume.exitNow(); });
  });

  window.NPExit = {
    ask: ask,
    playing: function () { return !!peek(); },
    open: function () { return !!ov; },
    dismiss: function () { close(true); },
    bypass: function (f) { skipClick = true; try { f(); } finally { skipClick = false; } },   // chạy f (bấm nút về màn chọn) mà không bị chốt click chặn
    allow: function () { allowUntil = Date.now() + 1500; },
    tick: function (p) { p = !!p; if (p !== playing) { playing = p; document.documentElement.classList.toggle("np-playing", p); } }
  };
})();
