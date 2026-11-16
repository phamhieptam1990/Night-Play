/* Nút "Cài đặt Night Pass" trong thanh trên của game (và vì thế trong menu ⋯ của điện thoại/iPad dọc: fan.js / popmenu.js gom theo id #npSetBtn).
   Hiện cho MỌI NGƯỜI (không cần gói); khi có gói còn hạn (đọc localStorage "pass": chạy cả khi offline); trên nút có huy hiệu số ngày còn lại. Bấm → trang nightpass.html (cửa sổ trên cùng, có ?from= để quay lại đúng chỗ).
   Nạp tự động từ shared/resume.js (mọi game, trừ chế độ ?multi=1). */
(function () {
  "use strict";
  if (window.__npSet) return; window.__npSet = true;
  var ID = "npSetBtn";
  var vi = function () { return (document.documentElement.lang || "vi") === "vi"; };
  function days() {
    try { var p = JSON.parse(localStorage.getItem("pass")); if (!p || !p.exp) return 0; var ms = new Date(p.exp) - Date.now(); return ms > 0 ? Math.max(1, Math.ceil(ms / 864e5)) : 0; } catch (e) { return 0; }
  }
  function topBar() { var p = document.getElementById("play"); return (p && p.querySelector(".top")) || document.querySelector(".top"); }
  function url() {
    var w = window, from = "play/index.html";
    try { w = window.top; var h = w.location; from = (h.pathname.replace(/^\//, "") || "play/index.html") + (/^#[\w-]+$/.test(h.hash) ? h.hash : ""); if (!/^[\w\-./]+(#[\w-]+)?$/.test(from) || from.indexOf("..") >= 0) from = "play/index.html"; } catch (e) { w = window; from = location.pathname.replace(/^\//, ""); }
    return { w: w, u: "/nightpass.html?lang=" + (vi() ? "vi" : "en") + "&from=" + encodeURIComponent(from).replace(/%2F/g, "/") };
  }
  var css = document.createElement("style");
  css.textContent = "#" + ID + ",.np-hb[data-k=npset]{position:relative}#" + ID + " svg{width:22px;height:22px;display:block;margin:auto}.npd{position:absolute;right:-5px;top:-5px;min-width:19px;height:19px;padding:0 4px;box-sizing:border-box;border-radius:10px;background:#7C5CFF;color:#fff;border:1.5px solid #fff;font:800 11px/16px system-ui,sans-serif;text-align:center;pointer-events:none}";
  (document.head || document.documentElement).appendChild(css);
  function sync() {
    var top = topBar(), b = document.getElementById(ID), n = days();
    if (!top) { if (b) b.remove(); return; }   /* HIỂN THỊ CHO MỌI NGƯỜI: có gói thì kèm số ngày còn lại, chưa có gói thì không có huy hiệu số (vào trang để dùng thử/mua) */
    if (!b) {
      var ref = document.getElementById("bSnd") || document.getElementById("soundBtn");
      b = document.createElement("button"); b.type = "button"; b.id = ID; b.className = (ref && ref.className.replace(/\b(np-snd-off|on|off)\b/g, "").trim()) || "ib";
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg><span class="npd"></span>';
      b.addEventListener("click", function () { var t = url(); try { t.w.location.href = t.u; } catch (e) { location.href = t.u; } });
      if (ref && ref.parentNode === top) top.insertBefore(b, ref); else top.appendChild(b);
    }
    var lab = n ? (vi() ? "Cài đặt Night Pass · còn " + n + " ngày" : "Night Pass settings · " + n + " day" + (n > 1 ? "s" : "") + " left") : (vi() ? "Cài đặt Night Pass" : "Night Pass settings");
    var d = b.querySelector(".npd"); d.style.display = n ? "" : "none"; if (n && d.textContent !== String(n)) d.textContent = n;
    if (b.getAttribute("aria-label") !== lab) { b.setAttribute("aria-label", lab); b.title = lab; }
  }
  sync(); setInterval(sync, 2000); addEventListener("storage", sync);
})();
