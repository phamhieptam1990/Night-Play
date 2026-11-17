/* TOÀN MÀN HÌNH cho MỌI game (nạp từ shared/resume.js, trừ ?multi=1): nút ⛶ #npFsBtn nằm cùng nhóm nút phụ (tự vào menu ⋯ của fan.js / popmenu.js / cột HUD của hud.js như #npMcBtn).
   Bấm → trang game vào toàn màn hình thật (Fullscreen API: ẩn thanh địa chỉ/thanh công cụ trình duyệt, iPad Safari + máy tính; iPhone Safari không hỗ trợ → vẫn vào chế độ khung đầy cửa sổ) và
   "biến thành khung game của Chơi cùng lúc": ẩn thanh trên + nút nổi, chỉ còn khung chơi + HUD điểm; ẩn luôn hàng chỉ số (điểm... như khung Chơi cùng lúc); góc trên-phải chỉ có nút ⋯ mờ (#npFsMi) mở bảng nhỏ (#npFsPn): điểm + chỉ số, âm thanh, cách chơi và nút THU NHỎ ⤡ để quay về như cũ. Mở bảng = tạm dừng game (shared/menupause.js theo dõi #npFsPn.open). Esc / thoát của trình duyệt cũng quay về.
   Không đổi trạng thái ván (không tải lại trang). Lớp html.np-fs; CSS dưới đây ẩn cùng danh sách nút như shared/multi.css. */
(function () {
  "use strict";
  if (window.__npFs) return; window.__npFs = true;
  var ID = "npFsBtn", MI = "npFsMi", PN = "npFsPn", de = document.documentElement, api = false, timer = 0;
  var vi = function () { return (de.lang || "vi") === "vi"; };
  var SVGH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;margin:auto;';
  var EXPAND = SVGH + 'width:22px;height:22px"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  var SHRINK = SVGH + 'width:36px;height:36px"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>';
  var DOTS = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="width:18px;height:18px;display:block"><circle cx="5.5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18.5" cy="12" r="1.8"/></svg>';
  var HOME = SVGH + 'width:36px;height:36px"><path d="M15 5l-7 7 7 7"/></svg>';
  var HELP = SVGH + 'width:36px;height:36px"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1.9-1.1 1.8M12 17h.01"/></svg>';
  var T = { vi: { fs: "Toàn màn hình", x: "Thu nhỏ về như cũ", menu: "Menu", score: "Điểm", moves: "Lượt", combo: "Combo", snd: "Âm thanh", help: "Cách chơi", paused: "Tạm dừng", home: "Về trang chủ", noFs: "Máy này không ẩn được thanh địa chỉ.", how: "Cách thêm vào Màn hình chính", close: "Đóng", howT: "Chơi toàn màn hình thật", stIos: ["Mở trang này bằng Safari.", "Bấm nút Chia sẻ (ô vuông có mũi tên lên) ở thanh dưới hoặc trên.", "Chọn “Thêm vào Màn hình chính” rồi bấm Thêm.", "Mở game từ biểu tượng mới trên màn hình chính: không còn thanh địa chỉ."], stAnd: ["Mở trang này bằng Chrome.", "Bấm nút ⋮ (menu) ở góc trên.", "Chọn “Cài đặt ứng dụng” hoặc “Thêm vào màn hình chính”.", "Mở game từ biểu tượng mới: không còn thanh địa chỉ."], stApp: ["Bạn đang mở trong ứng dụng khác (Zalo, Facebook, TikTok...).", "Bấm ⋯ rồi chọn “Mở bằng trình duyệt” (Safari / Chrome).", "Sau đó làm theo hướng dẫn thêm vào Màn hình chính."] }, en: { fs: "Full screen", x: "Exit full screen", menu: "Menu", score: "Score", moves: "Moves", combo: "Combo", snd: "Sound", help: "How to play", paused: "Paused", home: "Back to home", noFs: "This device can't hide the address bar.", how: "How to add to Home Screen", close: "Close", howT: "Play in true full screen", stIos: ["Open this page in Safari.", "Tap the Share button (square with an up arrow) in the bottom or top bar.", "Choose “Add to Home Screen”, then tap Add.", "Open the game from the new icon: no address bar."], stAnd: ["Open this page in Chrome.", "Tap the ⋮ menu at the top.", "Choose “Install app” or “Add to Home screen”.", "Open the game from the new icon: no address bar."], stApp: ["You are inside another app (Zalo, Facebook, TikTok...).", "Tap ⋯ and choose “Open in browser” (Safari / Chrome).", "Then follow the Add to Home Screen steps."] } };
  var t = function (k) { return T[vi() ? "vi" : "en"][k]; };
  var css = document.createElement("style"); css.id = "npFsCss";
  css.textContent =
    "html.np-fs .top,html.np-fs #npFab,html.np-fs #npFan,html.np-fs #npPmFab,html.np-fs #npPmFan,html.np-fs #npPmBk,html.np-fs #npPmShr,html.np-fs #npPmCam,html.np-fs #npPmLock,html.np-fs #npResume,html.np-fs #npInApp,html.np-fs #npTitle,html.np-fs .nps-fab,html.np-fs #bCam,html.np-fs #bShr,html.np-fs #nsPill,html.np-fs #npHudc,html.np-fs #npFsBtn,html.np-fs .stats,html.np-fs .gametitle{display:none!important}" +
    "#" + MI + ",#" + PN + "{display:none}" +
    "html.np-fs #" + MI + "{display:flex;position:fixed;z-index:2147483000;top:max(2px,env(safe-area-inset-top));right:max(2px,env(safe-area-inset-right));width:48px;height:48px;align-items:center;justify-content:center;padding:0;border:0;background:none;color:#fff;opacity:.5;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}" +
    "#" + MI + " i{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:rgba(14,12,32,.78);border:1px solid rgba(255,255,255,.4)}" +
    "html.np-fs #" + MI + ":hover,html.np-fs #" + MI + ":focus-visible,html.np-fs #" + MI + ".on{opacity:1}" +
    "html.np-fs #" + PN + ".open{display:block;position:fixed;z-index:2147483001;top:max(46px,calc(env(safe-area-inset-top) + 44px));right:max(8px,env(safe-area-inset-right));width:min(240px,calc(100vw - 16px));box-sizing:border-box;padding:10px;border-radius:20px;color:#fff;font:700 13px/1.25 system-ui,-apple-system,sans-serif;background:linear-gradient(165deg,#2b2064,#171236 70%);border:1px solid rgba(170,150,255,.55);box-shadow:0 10px 30px rgba(0,0,0,.5)}" +
    "#" + PN + " .t{display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:8px}#" + PN + " .t b{font-size:15px;font-weight:900;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#" + PN + " .t em{flex:none;font-style:normal;font-size:11px;font-weight:800;padding:1px 8px;border-radius:999px;background:rgba(255,255,255,.16)}#" + PN + " button[hidden]{display:none}#" + PN + ".open{max-height:calc(100vh - 60px);overflow:auto}" +
    "#" + PN + " .g{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px}#" + PN + " .c{border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);padding:6px 10px}#" + PN + " .c i{display:block;font-style:normal;font-size:11px;color:rgba(255,255,255,.7)}#" + PN + " .c b{font-size:22px;font-weight:900;font-variant-numeric:tabular-nums}" +
    "#" + PN + " .r{display:flex;justify-content:space-between;padding:2px 2px;color:rgba(255,255,255,.8)}#" + PN + " .r b{color:#fff;font-variant-numeric:tabular-nums}" +
    "#" + PN + " .b{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}#" + PN + " .b button{min-height:68px;border-radius:16px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.1);color:#fff;display:grid;place-items:center;padding:0;cursor:pointer}#" + PN + " .b button svg{width:34px;height:34px}";
  css.textContent +=
    "#npFsToast{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483002;width:calc(100vw - 24px);max-width:420px;box-sizing:border-box;display:none;align-items:center;gap:10px;padding:8px 8px 8px 16px;border-radius:22px;background:rgba(20,18,30,.94);color:#fff;font:700 13px/1.3 system-ui,-apple-system,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.45)}#npFsToast.on{display:flex}" +
    "#npFsToast span{flex:1;min-width:0}#npFsToast button{flex:none;max-width:48%;min-height:36px;padding:0 14px;border-radius:999px;border:0;background:#7C5CFF;color:#fff;font:800 13px system-ui,sans-serif;cursor:pointer}" +
    "#npFsHow{position:fixed;inset:0;z-index:2147483003;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(6,5,16,.66)}#npFsHow.on{display:flex}" +
    "#npFsHow .d{width:min(380px,100%);max-height:100%;overflow:auto;box-sizing:border-box;padding:16px;border-radius:22px;color:#fff;font:600 14px/1.45 system-ui,-apple-system,sans-serif;background:linear-gradient(165deg,#2b2064,#171236 70%);border:1px solid rgba(170,150,255,.55);box-shadow:0 14px 40px rgba(0,0,0,.55)}" +
    "#npFsHow h3{margin:0 0 8px;font-size:18px;font-weight:900}#npFsHow ol{margin:0 0 12px;padding-left:20px}#npFsHow li{margin:6px 0}#npFsHow button{width:100%;min-height:48px;border-radius:999px;border:0;background:#7C5CFF;color:#fff;font:800 15px system-ui,sans-serif;cursor:pointer}";
  (document.head || de).appendChild(css);

  /* KHÔNG ẩn được thanh địa chỉ (iPhone Safari không có Fullscreen API cho trang web; app Zalo/Facebook/TikTok thường chặn) → báo rõ + hướng dẫn "Thêm vào Màn hình chính" (PWA, chạy không thanh địa chỉ) */
  function standalone() { try { return !!(navigator.standalone || matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches); } catch (e) { return false; } }
  var ua = navigator.userAgent || "", IOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1), INAPP = /FBAN|FBAV|Instagram|Zalo|TikTok|musical_ly|Line\/|MicroMessenger|; wv\)/i.test(ua);
  function hideToast() { var e = document.getElementById("npFsToast"); if (e) e.classList.remove("on"); }
  function howSheet() {
    var h = document.getElementById("npFsHow");
    if (!h) { h = document.createElement("div"); h.id = "npFsHow"; h.setAttribute("role", "dialog"); h.setAttribute("aria-modal", "true"); h.innerHTML = '<div class="d"><h3></h3><ol></ol><button type="button"></button></div>'; (document.body || de).appendChild(h);
      h.addEventListener("click", function (e) { if (e.target === h || (e.target.tagName === "BUTTON")) h.classList.remove("on"); }); }
    var steps = (INAPP ? t("stApp").concat(IOS ? t("stIos").slice(1) : t("stAnd").slice(1)) : (IOS ? t("stIos") : t("stAnd")));
    h.querySelector("h3").textContent = t("howT"); h.querySelector("ol").innerHTML = steps.map(function (x) { return "<li></li>"; }).join("");
    var li = h.querySelectorAll("li"); steps.forEach(function (x, i) { li[i].textContent = x; }); h.querySelector("button").textContent = t("close"); h.classList.add("on");
  }
  var toastT = 0;
  function noFsHint() {
    if (standalone()) return; var e = document.getElementById("npFsToast");
    if (!e) { e = document.createElement("div"); e.id = "npFsToast"; e.setAttribute("role", "status"); e.innerHTML = '<span></span><button type="button"></button>'; (document.body || de).appendChild(e); e.querySelector("button").addEventListener("click", function () { hideToast(); howSheet(); }); }
    e.querySelector("span").textContent = t("noFs"); e.querySelector("button").textContent = t("how"); e.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(hideToast, 7000);
  }

  function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function relayout() { try { requestAnimationFrame(function () { requestAnimationFrame(function () { window.dispatchEvent(new Event("resize")); }); }); } catch (e) {} }
  function pnEl() { return document.getElementById(PN); }
  function setPanel(v) {
    var pn = pnEl(), mi = document.getElementById(MI); if (!pn) return;
    pn.classList.toggle("open", !!v); if (mi) { mi.classList.toggle("on", !!v); mi.setAttribute("aria-expanded", String(!!v)); }
    clearInterval(timer); if (v) { fill(); timer = setInterval(fill, 400); }
  }
  /* các nút của menu ⋯ gốc được phản chiếu vào bảng (icon + nhãn lấy từ chính nút thật, bấm = bấm nút thật): [vai trò, [id có thể có]] */
  var ROLES = [["snd", ["bSnd", "soundBtn"]], ["help", ["phBtn", "bHelp", "askBtn"]], ["restart", ["restartBtn", "bRe"]], ["board", ["bBoard"]], ["npch", ["npChBtn"]], ["lang", ["bLang", "langBtn"]], ["theme", ["themeBtn2"]]];
  function real(ids) { for (var i = 0; i < ids.length; i++) { var e = document.getElementById(ids[i]); if (e) return e; } return null; }
  function fill() {
    var pn = pnEl(); if (!pn) return; var h = null; try { h = window.NP && NP.hudInfo ? NP.hudInfo() : null; } catch (e) {} h = h || {};
    var title = (document.querySelector("h1") && document.querySelector("h1").textContent.trim()) || document.title || "";
    var st = (h.stats || []).slice(), pick = function (re) { for (var i = 0; i < st.length; i++) if (re.test(st[i][0])) { var v = st[i][1]; st.splice(i, 1); return v; } return null; };
    var sc = pick(/^(điểm|score)$/i), mv = pick(/^(lượt|moves|nước|bước)$/i), cb = pick(/^combo$/i);
    var score = h.score != null ? h.score : sc, hasC = h.combo != null || cb != null, c2 = hasC ? (h.combo != null ? h.combo : cb) : (h.moves != null ? h.moves : mv);
    var key = JSON.stringify([title, score, hasC, c2, st, vi()]);
    if (pn.__k !== key) {
      pn.__k = key; var rows = st.map(function () { return '<div class="r"><span></span><b></b></div>'; }).join("");
      pn.querySelector(".t b").textContent = title.slice(0, 40);
      pn.querySelector(".g").innerHTML = '<div class="c"><i></i><b></b></div><div class="c"><i></i><b></b></div>';
      var cs = pn.querySelectorAll(".c"); cs[0].querySelector("i").textContent = t("score"); cs[0].querySelector("b").textContent = score != null ? score : "–";
      cs[1].querySelector("i").textContent = hasC ? t("combo") : t("moves"); cs[1].querySelector("b").textContent = c2 != null ? c2 : "–";
      var L = pn.querySelector(".l"); L.innerHTML = rows; var rs = L.querySelectorAll(".r"); st.forEach(function (r, i) { rs[i].firstChild.textContent = r[0]; rs[i].lastChild.textContent = r[1]; });
    }
    ROLES.forEach(function (r) {
      var bt = pn.querySelector('[data-a=' + r[0] + ']'); if (!bt) return; var src = real(r[1]), ok = !!src && !src.hidden;
      bt.hidden = !ok; if (!ok) return;
      if (r[0] !== "help") { var hh = src.innerHTML; if (bt.__h !== hh) { bt.__h = hh; bt.innerHTML = hh; } }
      var al = src.getAttribute("aria-label") || src.title || t(r[0]) || r[0]; if (bt.getAttribute("aria-label") !== al) { bt.setAttribute("aria-label", al); bt.title = al; }
      if (src.hasAttribute("aria-pressed")) bt.setAttribute("aria-pressed", src.getAttribute("aria-pressed")); else bt.removeAttribute("aria-pressed");
    });
    var hm = pn.querySelector('[data-a=home]'), back = real(["bBk", "bBack", "homeBtn"]); if (hm) { hm.hidden = !back; hm.setAttribute("aria-label", t("home")); hm.title = t("home"); }
    var pz = pn.querySelector(".t em"); if (pz) pz.textContent = t("paused");
  }
  function build() {
    if (document.getElementById(MI)) return;
    var mi = document.createElement("button"); mi.type = "button"; mi.id = MI; mi.setAttribute("aria-haspopup", "true"); mi.setAttribute("aria-expanded", "false"); mi.setAttribute("aria-label", t("menu")); mi.title = t("menu"); mi.innerHTML = "<i>" + DOTS + "</i>";
    mi.addEventListener("click", function (e) { e.stopPropagation(); setPanel(!pnEl().classList.contains("open")); });
    var pn = document.createElement("div"); pn.id = PN; pn.setAttribute("role", "dialog");
    pn.innerHTML = '<div class="t"><b></b><em></em></div><div class="g"></div><div class="l"></div><div class="b">' + ROLES.map(function (r) { return '<button type="button" data-a="' + r[0] + '" hidden></button>'; }).join("") + '<button type="button" data-a="home" hidden></button><button type="button" data-a="x"></button></div>';
    pn.querySelector('[data-a=help]').innerHTML = HELP; pn.querySelector('[data-a=x]').innerHTML = SHRINK; pn.querySelector('[data-a=home]').innerHTML = HOME;
    pn.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button[data-a]"); if (!b) return; e.stopPropagation(); var a = b.dataset.a;
      if (a === "x") { exit(); return; }
      if (a === "home") { var bk = real(["bBk", "bBack", "homeBtn"]); exit(); bk && setTimeout(function () { bk.click(); }, 200); return; }   /* thoát toàn màn hình rồi dùng nút ← của game (có hộp xác nhận thoát) */
      var role = ROLES.filter(function (r) { return r[0] === a; })[0]; if (!role) return;
      var src = real(role[1]); if (!src) return;
      if (a === "help" || a === "restart" || a === "board" || a === "npch") { setPanel(false); setTimeout(function () { src.click(); }, 80); }   /* đóng bảng (game chạy tiếp/đếm) rồi mới bấm */
      else { src.click(); setTimeout(fill, 100); }
    });
    var host = document.body || de; host.appendChild(mi); host.appendChild(pn);
    document.addEventListener("pointerdown", function (e) { var p = pnEl(); if (p && p.classList.contains("open") && !p.contains(e.target) && !mi.contains(e.target)) setPanel(false); }, true);
  }
  function labelFs() { return t("fs"); }
  function enter() {
    if (de.classList.contains("np-fs")) return;
    de.classList.add("np-fs"); api = false; build();
    try { var r = de.requestFullscreen || de.webkitRequestFullscreen; if (r) { var p = r.call(de, { navigationUI: "hide" }); api = true; if (p && p.catch) p.catch(function () { api = false; }); } } catch (e) { api = false; }
    relayout();
    if (!api) noFsHint();
    else setTimeout(function () { if (de.classList.contains("np-fs") && !fsEl()) noFsHint(); }, 600);   /* API có nhưng bị chặn (iframe không allow, app lồng...) */
  }
  function exit() {
    if (!de.classList.contains("np-fs")) return;
    setPanel(false); hideToast(); de.classList.remove("np-fs");
    try { if (fsEl()) { var e = document.exitFullscreen || document.webkitExitFullscreen; e && e.call(document); } } catch (e) {}
    relayout();
  }
  function onFsChange() { if (api && !fsEl() && de.classList.contains("np-fs")) { setPanel(false); de.classList.remove("np-fs"); relayout(); } }
  document.addEventListener("fullscreenchange", onFsChange); document.addEventListener("webkitfullscreenchange", onFsChange);
  addEventListener("keydown", function (e) {   /* Tab quay vòng trong bảng đang mở */
    if (e.key !== "Tab") return; var p = pnEl(); if (!p || !p.classList.contains("open")) return;
    var f = [document.getElementById(MI)].concat([].slice.call(p.querySelectorAll("button:not([hidden])"))); var i = f.indexOf(document.activeElement);
    if (i < 0) { f[1] && f[1].focus(); e.preventDefault(); return; } var n = f[(i + (e.shiftKey ? f.length - 1 : 1)) % f.length]; n.focus(); e.preventDefault();
  }, true);
  addEventListener("keydown", function (e) { if (e.key !== "Escape" || !de.classList.contains("np-fs")) return; var p = pnEl(); if (p && p.classList.contains("open")) setPanel(false); else if (!api) exit(); }, true);

  function top() { var p = document.getElementById("play"); return (p && p.querySelector(".top")) || document.querySelector(".top"); }
  function sync() {
    var tp = top(), b = document.getElementById(ID);
    if (!tp) { if (b) b.remove(); return; }
    if (!b) {
      var ref = document.getElementById("npMcBtn") || document.getElementById("npChBtn") || document.getElementById("bSnd") || document.getElementById("soundBtn");
      b = document.createElement("button"); b.type = "button"; b.id = ID; b.className = (ref && ref.className.replace(/\b(np-snd-off|on|off|hot|lk)\b/g, "").trim()) || "ib";
      b.innerHTML = EXPAND; b.addEventListener("click", enter);
      if (ref && ref.parentNode === tp) tp.insertBefore(b, ref); else tp.appendChild(b);
    }
    var lab = labelFs(); if (b.getAttribute("aria-label") !== lab) { b.setAttribute("aria-label", lab); b.title = lab; }
  }
  sync(); setInterval(sync, 2000);
})();
