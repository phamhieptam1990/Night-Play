/* Hạn chế công cụ nhà phát triển (nhúng ở đầu <head> của MỌI trang).
   - Chặn phím tắt mở DevTools / xem nguồn và menu chuột phải.
   - Phát hiện DevTools đang mở (kích thước khung + "debugger" bị dừng) → chuyển sang trang restricted.html.
   LƯU Ý: đây chỉ là rào cản với người dùng thường, KHÔNG phải bảo mật thật (mã phía trình duyệt luôn xem được bằng cách khác;
   "view-source:" gõ trực tiếp trên thanh địa chỉ không thể chặn). Bảo mật thật nằm ở server (kiểm tra thanh toán, ADMIN_KEY...).
   Tắt hẳn trên localhost để lập trình; muốn thử ở localhost thì thêm ?guard=1 vào địa chỉ. */
(function () {
  "use strict";
  var loc = location, host = loc.hostname;

  /* 0) CHỐNG NHÚNG: trang bị đặt trong iframe của TRANG KHÁC DOMAIN → dừng tải, che bằng thông báo + nút mở bản gốc.
     Lớp chính là tiêu đề máy chủ (frame-ancestors 'self', scripts/build.js + netlify.toml); đây là lớp dự phòng khi ai đó
     chép file đi host nơi khác (lúc đó tiêu đề không còn). Chỉ xét khi THẬT SỰ nằm trong khung: mở trực tiếp (Zalo, Messenger,
     Safari…) top === window nên không bao giờ bị chặn; cổng của chính mình nhúng game cùng origin nên đọc được parent/top. */
  (function embedGuard() {
    if (window.top === window || loc.protocol === "file:") return;
    var foreign = false;
    try { void window.parent.location.href; void window.top.location.href; } catch (e) { foreign = true; }   // khác origin → ném lỗi bảo mật
    if (!foreign) return;
    var url = loc.href.replace(/[?&]guard=1\b/, "");
    try { window.stop(); } catch (e) {}
    var d = document;
    d.documentElement.innerHTML = '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>nightplay.vn</title></head>' +
      '<body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0b0b1a;color:#fff;font:16px/1.4 system-ui,sans-serif;text-align:center;overflow:hidden">' +
      '<div style="padding:0 16px;box-sizing:border-box;max-width:360px"><p style="margin:0 0 14px">Game này chỉ chơi được trên trang chính thức.<br><small style="opacity:.7">This game can only be played on the official site.</small></p>' +
      '<a id="npOpen" target="_blank" rel="noopener" style="display:inline-block;min-height:44px;line-height:44px;padding:0 24px;border-radius:22px;background:#ffd23f;color:#1a1a2e;font-weight:700;text-decoration:none">Mở nightplay.vn</a></div></body>';
    var a = d.getElementById("npOpen"); if (a) a.href = url;
    throw new Error("np-embed-blocked");   // dừng phần còn lại của guard.js
  })();
  /* KHÓA KÉO TRANG (iPad/iPhone): trang game + cổng là MỘT MÀN HÌNH (GAME_RULES). iOS vẫn cho ngón tay kéo cả trang dù overflow:hidden → trang trượt lên, lộ dải xám/nền cổng ở đáy và tiêu đề bị cắt.
     (1) overscroll-behavior:none; (2) chặn touchmove một ngón khi KHÔNG nằm trong vùng tự cuộn thật / ô nhập / thanh trượt / vùng tự xử lý chạm (touch-action); (3) nếu trang vẫn bị cuộn thì trả về 0. Chỉ ở trang game và cổng, không đụng admin/trang pháp lý. */
  (function bounceLock() {
    var path = loc.pathname;
    if (!(/\/games\//.test(path) || /^\/(cozyplay|popplay|play)\/(index\.html)?$/.test(path))) return;
    try { var st = document.createElement("style"); st.textContent = "html,body{overscroll-behavior:none}"; (document.head || document.documentElement).appendChild(st); } catch (e) {}
    function inner(el) {
      for (var e = el; e && e.nodeType === 1 && e !== document.documentElement && e !== document.body; e = e.parentElement) {   /* body/html là chính CÁI TRANG: không coi là vùng cuộn hợp lệ (lề trái/phải cạnh khung game) */
        var tag = e.tagName; if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.isContentEditable) return true;
        var c = getComputedStyle(e);
        if (/^(none|pan-x|pan-y|pinch-zoom|manipulation\s+none)$/.test(c.touchAction) || (c.touchAction && c.touchAction !== "auto" && c.touchAction !== "manipulation")) return true;
        if (/(auto|scroll)/.test(c.overflowY) && e.scrollHeight > e.clientHeight + 1) return true;
        if (/(auto|scroll)/.test(c.overflowX) && e.scrollWidth > e.clientWidth + 1) return true;
      }
      return false;
    }
    document.addEventListener("touchmove", function (ev) {
      if (!ev.cancelable || (ev.touches && ev.touches.length !== 1)) return;
      try { if (!inner(ev.target)) ev.preventDefault(); } catch (e) {}
    }, { passive: false });
    addEventListener("scroll", function () { try { var d = document.scrollingElement || document.documentElement; if (d && (d.scrollTop > 0 || d.scrollLeft > 0)) scrollTo(0, 0); } catch (e) {} }, { passive: true });
  })();
  /* CHỮ KÝ trên màn chơi: logo nhỏ + chữ "nightplay.vn" mờ giữa mép dưới, chỉ ở trang game (/games/), không bắt chạm, không chiếm chỗ
     (position:fixed → không gây cuộn). Bỏ qua khung nhỏ (ô "Chơi cùng lúc") để khỏi lặp. Bị gỡ khỏi DOM thì tự gắn lại. */
  (function signature() {
    if (!/\/games\//.test(loc.pathname)) return;
    var cs = document.currentScript, logo = cs && cs.src ? cs.src.replace(/guard\.js[^\/]*$/, "favicon.svg") : "";   // logo chung của site (shared/favicon.svg)
    function mount() {
      if (innerWidth < 300 || innerHeight < 300) return;
      if (document.getElementById("npSig") || !document.body) return;
      var e = document.createElement("div"); e.id = "npSig"; e.setAttribute("aria-hidden", "true");
      e.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 3px);z-index:2147483000;display:flex;align-items:center;gap:5px;" +
        "font:600 10px/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;color:#fff;opacity:.5;text-shadow:0 1px 2px rgba(0,0,0,.55);" +
        "pointer-events:none;user-select:none;-webkit-user-select:none;white-space:nowrap";
      if (logo) { var i = document.createElement("img"); i.src = logo; i.alt = ""; i.draggable = false; i.style.cssText = "width:18px;height:18px;border-radius:5px;display:block;box-shadow:0 1px 3px rgba(0,0,0,.45)"; e.appendChild(i); }
      e.appendChild(document.createTextNode("nightplay.vn"));
      document.body.appendChild(e);
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
    setInterval(mount, 3000);
  })();

  var local = host === "localhost" || host === "127.0.0.1" || host === "[::1]" || loc.protocol === "file:";
  if (local && !/[?&]guard=1\b/.test(loc.search)) return;
  if (/\/restricted(\.html)?\/?$/.test(loc.pathname)) return;   // Cloudflare rút gọn /restricted.html → /restricted: trang này phải được miễn, nếu không sẽ chuyển tiếp vô hạn

  var IN_FRAME = window.top !== window;

  /* 1) phím tắt */
  addEventListener("keydown", function (e) {
    var k = (e.key || "").toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (e.key === "F12" ||
        (mod && e.shiftKey && "ijckme".indexOf(k) > -1 && k.length === 1) ||   // Ctrl/Cmd+Shift+I/J/C/K/M/E
        (e.metaKey && e.altKey && "ijcu".indexOf(k) > -1 && k.length === 1) ||  // Cmd+Opt+I/J/C/U (Mac)
        (e.ctrlKey && (k === "u" || k === "s"))) {                              // Ctrl+U xem nguồn, Ctrl+S lưu trang
      e.preventDefault(); e.stopPropagation();
    }
  }, true);

  /* 2) menu chuột phải (vẫn cho dùng trong ô nhập liệu) */
  document.addEventListener("contextmenu", function (e) {
    var t = e.target;
    if (!(t && t.closest && t.closest("input,textarea"))) e.preventDefault();
  });

  /* 3) phát hiện DevTools đang mở */
  var coarse = window.matchMedia && matchMedia("(pointer:coarse)").matches;   // điện thoại/máy tính bảng: bỏ qua phép đo kích thước
  var hits = 0;
  function openBySize() {
    if (coarse || IN_FRAME) return false;   // trong iframe (game ở khung nhỏ của "Chơi cùng lúc", game trong trang cổng) innerWidth = cỡ KHUNG, luôn nhỏ hơn outerWidth của cửa sổ → đo nhầm là DevTools; trang cha tự đo cỡ cửa sổ thật
    var dw = outerWidth - innerWidth, dh = outerHeight - innerHeight;
    return dw > 220 || dh > 260;                                              // DevTools gắn cạnh/đáy cửa sổ
  }
  function openByDebugger() {
    var t0 = performance.now();
    try { (new Function("debugger"))(); } catch (e) {}
    return performance.now() - t0 > 120;                                      // đang bị dừng ở "debugger" = DevTools mở
  }
  function restrict() {
    var from = (loc.pathname + loc.search).replace(/[?&]guard=1\b/, "");
    var base = loc.pathname.replace(/[^/]*$/, "");
    var depth = base.split("/").filter(Boolean).length;
    var up = ""; for (var i = 0; i < depth; i++) up += "../";
    try { (IN_FRAME ? window.top : window).location.replace(up + "restricted.html?from=" + encodeURIComponent(from)); } catch (e) { document.documentElement.innerHTML = ""; }
  }
  function check() {
    if (openBySize() || openByDebugger()) { if (++hits >= 2) restrict(); } else hits = 0;   // 2 lần liên tiếp mới tính, tránh nhầm khi đổi cỡ cửa sổ
  }
  setInterval(check, 1200);
  addEventListener("resize", function () { setTimeout(check, 300); });
})();
