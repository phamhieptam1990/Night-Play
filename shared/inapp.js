/* BANNER "MỞ BẰNG TRÌNH DUYỆT" khi trang được mở trong trình duyệt TRONG APP (Zalo, TikTok, Facebook, Messenger, Instagram, Line).
   Trình duyệt trong app hay giật, mất bộ nhớ (localStorage riêng → mất Night Pass / ván dở), không có đủ toàn màn hình. Banner mỏng ở trên cùng:
     "Mở bằng Chrome/Safari để chơi mượt và giữ Night Pass" + nút chính (Android: "Mở Chrome" qua intent://…; iOS/khác: "Sao chép link") + nút ✕ (tắt, nhớ 1 ngày).
   Bấm vào chữ / nút mở bảng nhỏ (thả xuống, KHÔNG đẩy nội dung): Sao chép link (clipboard + dự phòng), Mở Chrome (Android), dòng hướng dẫn
   "Bấm ⋯ rồi chọn Mở bằng trình duyệt", và — nếu webview này chưa có Night Pass — nút "Khôi phục Night Pass" (luồng khôi phục có sẵn ở subscribe.html: email + mã).
   Chỉ hiện ở trang cổng (index.html, cozyplay/, popplay/) và trang chơi hộ / thách đấu (?helper=1, #ch=; shared/resume.js nạp file này). Màu theo theme trang; VI + EN.
   Trang cổng: banner là phần tử đầu của <body> (cột flex) nên nội dung tự co lại, không cuộn; trang game: banner cố định, thân trang thu nhỏ đều (transform) cho vừa phần còn lại.
   API: NPInApp.is (bool), NPInApp.name, NPInApp.show()/hide(). Thử trên máy tính: thêm ?inapp=zalo vào địa chỉ. */
(function () {
  "use strict";
  if (window.NPInApp) return;
  var ua = navigator.userAgent || "", q = "";
  try { q = new URLSearchParams(location.search).get("inapp") || ""; } catch (e) {}
  var RX = [["Zalo", /Zalo/i], ["TikTok", /musical_ly|BytedanceWebview|TikTok|ttwebview/i], ["Messenger", /FBAN\/Messenger|MessengerForiOS|Orca-Android|FB_IAB\/MESSENGER/i],
    ["Facebook", /FBAN|FBAV|FB_IAB|FBIOS/], ["Instagram", /Instagram/i], ["Line", /(^|[\s;(])Line\//i]];
  var name = "";
  for (var i = 0; i < RX.length && !name; i++) if (RX[i][1].test(ua)) name = RX[i][0];
  if (!name && q) name = q;
  var android = /Android/i.test(ua), is = !!name;
  var KX = "np-inapp-x";
  var lsGet = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var lsSet = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var vi = function () { return (document.documentElement.lang || "vi").slice(0, 2) !== "en"; };
  var T = {
    vi: { msg: "Mở bằng Chrome/Safari để chơi mượt và giữ Night Pass", chrome: "Mở Chrome", copy: "Sao chép link", copied: "Đã sao chép link",
      guide: "Bấm ⋯ rồi chọn Mở bằng trình duyệt.", paste: "Hoặc dán link vào Chrome/Safari.", close: "Tắt thông báo (1 ngày)",
      rest: "Chưa thấy Night Pass của bạn trong trình duyệt này?", restBtn: "Khôi phục Night Pass", fail: "Không sao chép được: hãy giữ vào ô link bên dưới để chép." },
    en: { msg: "Open in Chrome/Safari to play smoothly and keep your Night Pass", chrome: "Open Chrome", copy: "Copy link", copied: "Link copied",
      guide: "Tap ⋯ then choose Open in browser.", paste: "Or paste the link into Chrome/Safari.", close: "Dismiss (1 day)",
      rest: "Can’t see your Night Pass in this browser?", restBtn: "Restore Night Pass", fail: "Couldn’t copy: press and hold the link below to copy it." }
  };
  var tt = function () { return T[vi() ? "vi" : "en"]; };
  var dismissed = function () { var t = +lsGet(KX); return t && Date.now() - t < 864e5; };
  var bar = null, panel = null;

  var CSS =
    "#npInApp{position:relative;flex:none;z-index:400;box-sizing:border-box;width:100%;font-family:var(--font);color:var(--ink,#1c1b22);background:var(--panel,#fff);border-bottom:2px solid var(--accent,#FF5A1F)}" +
    "#npInApp.fx{position:fixed;top:0;left:0;right:0}" +
    "html.playing #npInApp{display:none}" +
    "#npInApp .nib{display:flex;align-items:center;gap:6px;min-height:46px;padding:2px max(8px,env(safe-area-inset-right)) 2px max(10px,env(safe-area-inset-left))}" +
    "#npInApp .nit{flex:1;min-width:0;text-align:left;background:none;border:0;padding:3px 0;margin:0;cursor:pointer;color:inherit;font-family:inherit;font-weight:700;font-size:12.5px;line-height:1.25}" +
    "#npInApp button{font-family:inherit;cursor:pointer}" +
    "#npInApp .nia{flex:none;min-height:40px;padding:0 12px;border-radius:12px;border:0;background:var(--accent,#FF5A1F);color:var(--on-accent,#fff);font-family:inherit;font-weight:800;font-size:13px;line-height:1;white-space:nowrap}" +
    "#npInApp .nix{flex:none;width:44px;height:44px;margin-right:-4px;border:0;background:none;color:inherit;display:grid;place-items:center;border-radius:50%}" +
    "#npInApp .nix svg{width:18px;height:18px}" +
    "#npInApp button:focus-visible{outline:3px solid var(--ink,#000);outline-offset:1px}" +
    "#npInApp .nip{position:absolute;left:0;right:0;top:100%;display:none;box-sizing:border-box;padding:10px max(12px,env(safe-area-inset-left)) 12px;background:var(--panel,#fff);color:var(--ink,#1c1b22);border-bottom:2px solid var(--accent,#FF5A1F);box-shadow:0 14px 30px rgba(0,0,0,.35)}" +
    "#npInApp.open .nip{display:block}" +
    "#npInApp .nip p{margin:0 0 8px;font-family:inherit;font-weight:600;font-size:13px;line-height:1.4}" +
    "#npInApp .nir{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 8px}" +
    "#npInApp .nir button{flex:1 1 130px;min-height:44px;border-radius:12px;font-family:inherit;font-weight:800;font-size:14px;line-height:1.1;border:2px solid var(--accent,#FF5A1F);background:transparent;color:inherit}" +
    "#npInApp .nir button.p{background:var(--accent,#FF5A1F);color:var(--on-accent,#fff)}" +
    "#npInApp input{width:100%;box-sizing:border-box;height:36px;border-radius:10px;border:1.5px solid var(--line,#d9d5ee);background:var(--bg,#fff);color:inherit;font-size:12px;font-family:inherit;padding:0 8px;margin:0 0 8px;display:none}" +
    "#npInApp.nofb input{display:block}" +
    "#npInApp .nire{border-top:1px dashed var(--line,#d9d5ee);padding-top:8px;display:none}#npInApp .nire.on{display:block}" +
    "#npInApp .nire a{display:flex;align-items:center;justify-content:center;min-height:44px;border-radius:12px;font-family:inherit;font-weight:800;font-size:14px;line-height:1.1;text-decoration:none;border:2px solid var(--accent,#FF5A1F);color:inherit}" +
    "#npInApp .st{position:absolute;left:-9999px}" +
    "@media (min-width:640px){#npInApp .nit{font-size:14px}#npInApp .nip{max-width:520px;left:auto}}" +
    "@media (max-height:460px){#npInApp .nip{max-height:calc(100dvh - 54px);overflow:auto}}";

  var isPass = function () { try { var p = JSON.parse(localStorage.getItem("pass")); return !!(p && p.token); } catch (e) { return false; } };
  var curUrl = function () { return location.href; };
  function intentUrl() {
    try { var u = new URL(location.href); return "intent://" + u.host + u.pathname + u.search + u.hash + "#Intent;scheme=" + u.protocol.replace(":", "") + ";package=com.android.chrome;end"; } catch (e) { return ""; }
  }
  function copy(done) {
    var url = curUrl(), ok = function () { done(true); }, bad = function () { done(false); };
    var fb = function () {
      try { var t = document.createElement("textarea"); t.value = url; t.className = "st"; t.setAttribute("readonly", ""); document.body.appendChild(t); t.select(); t.setSelectionRange(0, 9999);
        var r = document.execCommand("copy"); t.remove(); r ? ok() : bad(); } catch (e) { bad(); }
    };
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(ok, fb); return; } } catch (e) {}
    fb();
  }
  function fit() { try { dispatchEvent(new Event("resize")); } catch (e) {} }

  function build() {
    var x = tt();
    bar = document.createElement("div"); bar.id = "npInApp"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", x.msg);
    bar.innerHTML =
      '<div class="nib"><button type="button" class="nit"></button><button type="button" class="nia"></button>' +
      '<button type="button" class="nix"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div class="nip"><p class="g"></p><div class="nir"><button type="button" class="p nic"></button><button type="button" class="noc"></button></div>' +
      '<input class="niu" readonly aria-label="link"><div class="nire"><p class="rt"></p><a class="rb" href="/subscribe.html#restore"></a></div></div>';
    var q$ = function (s) { return bar.querySelector(s); };
    var tx = q$(".nit"), act = q$(".nia"), xb = q$(".nix"), cb = q$(".nic"), ob = q$(".noc");
    function label() {
      var y = tt(); tx.textContent = y.msg; act.textContent = android ? y.chrome : y.copy; xb.setAttribute("aria-label", y.close); xb.title = y.close;
      q$(".g").textContent = y.guide + " " + y.paste; cb.textContent = y.copy; ob.textContent = y.chrome; ob.style.display = android ? "" : "none";
      q$(".rt").textContent = y.rest; q$(".rb").textContent = y.restBtn; q$(".niu").value = curUrl();
      var path = location.pathname.replace(/[^/]*$/, ""); q$(".rb").setAttribute("href", (location.pathname.indexOf("/games/") > 0 ? "../../../" : /\/(cozyplay|popplay|play)\//.test(location.pathname) ? "../" : "") + "subscribe.html#restore");
    }
    label(); new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    var toggle = function (on) { bar.classList.toggle("open", on === undefined ? !bar.classList.contains("open") : on); q$(".nire").classList.toggle("on", !isPass()); };
    var doCopy = function () { copy(function (ok) { var y = tt(); cb.textContent = ok ? "✓ " + y.copied : y.copy; bar.classList.toggle("nofb", !ok); if (!ok) { var u = q$(".niu"); u.focus(); u.select(); } setTimeout(label, 2500); }); toggle(true); };
    var doChrome = function () {
      toggle(true); var u = intentUrl(); if (!u) return;
      try { location.href = u; } catch (e) {}   // không chạy được thì bảng hướng dẫn đã mở sẵn
    };
    tx.addEventListener("click", function () { toggle(); });
    act.addEventListener("click", function () { android ? doChrome() : doCopy(); });
    cb.addEventListener("click", doCopy); ob.addEventListener("click", doChrome);
    xb.addEventListener("click", function () { lsSet(KX, String(Date.now())); hide(); });
    bar.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
    document.addEventListener("click", function (e) { if (bar && bar.classList.contains("open") && !bar.contains(e.target)) toggle(false); }, true);
  }
  var gameMode = false, cssEl = null;
  /* trang game: banner cố định ở đầu <html>; thân trang bố cục như cũ (đủ chiều cao màn hình) rồi THU NHỎ đều cho vừa phần còn lại → không bị cắt, không cuộn */
  function applyGame() {
    if (!bar || !gameMode) return;
    var h = Math.ceil(bar.getBoundingClientRect().height), H = innerHeight, k = Math.max(0.6, (H - h) / H);
    cssEl.textContent = "html.np-inapp{height:100%;overflow:hidden}html.np-inapp body{position:absolute!important;top:" + h + "px;left:0;margin:0!important;width:" + (100 / k).toFixed(3) + "%!important;height:100dvh!important;min-height:100dvh!important;max-height:100dvh!important;overflow:hidden;transform-origin:0 0;transform:scale(" + k.toFixed(4) + ")}";
  }
  function place() {
    var b = document.body, cs = getComputedStyle(b);
    gameMode = !(cs.display === "flex" && cs.flexDirection === "column");
    if (!gameMode) { b.insertBefore(bar, b.firstChild); bar.classList.remove("fx"); return; }
    bar.classList.add("fx"); document.documentElement.insertBefore(bar, b);
    if (!cssEl) { cssEl = document.createElement("style"); document.head.appendChild(cssEl); addEventListener("resize", applyGame); addEventListener("orientationchange", function () { setTimeout(applyGame, 200); }); }
    document.documentElement.classList.add("np-inapp"); applyGame();
  }
  function show() {
    if (!is || bar || dismissed() || !document.body) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    build(); place(); setTimeout(fit, 30); setTimeout(fit, 400);
  }
  function hide() {
    if (!bar) return; bar.remove(); bar = null; document.documentElement.classList.remove("np-inapp"); if (cssEl) cssEl.textContent = ""; gameMode = false; setTimeout(fit, 30);
  }
  window.NPInApp = { is: is, name: name, show: show, hide: hide };
  if (!is) return;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show); else show();
})();
