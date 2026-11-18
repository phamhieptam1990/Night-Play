/* Nút 🐾 "Linh vật & skin" trong thanh trên của game (tự vào menu ⋯ / cột nút như các nút khác: id #npMcBtn). Hiện cho MỌI NGƯỜI; bấm → trang nightpass-mascot.html mở sẵn linh vật của CHÍNH game đang chơi.
   Nạp từ shared/resume.js (trừ ?multi=1). Cần shared/npbadges.js để biết game này có linh vật không. */
(function () {
  "use strict";
  if (window.__npMcBtn) return; window.__npMcBtn = true;
  var ID = "npMcBtn", vi = function () { return (document.documentElement.lang || "vi") === "vi"; };
  var gid = (location.pathname.match(/\/games\/([^\/]+)/) || [])[1] || "";
  function top() { var p = document.getElementById("play"); return (p && p.querySelector(".top")) || document.querySelector(".top"); }
  function url() {
    var from = "play/index.html"; try { var h = window.top.location; from = (h.pathname.replace(/^\//, "") || from) + (/^#[\w-]+$/.test(h.hash) ? h.hash : ""); if (!/^[\w\-./]+(#[\w-]+)?$/.test(from) || from.indexOf("..") >= 0) from = "play/index.html"; } catch (e) {}
    return "/nightpass-mascot.html?lang=" + (vi() ? "vi" : "en") + "&m=" + encodeURIComponent(gid) + "&from=" + encodeURIComponent(from).replace(/%2F/g, "/");
  }

  /* LỚP PHỦ trang linh vật ngay trên game (không rời trang → bấm quay lại là về đúng ván, không ra màn hình chính). Game được tạm dừng khi mở. */
  var ov = null, paused = false;
  function closeOverlay() {
    if (!ov) return; try { ov.remove(); } catch (e) {} ov = null;
    if (paused) { paused = false; try { window.NP && NP.menuResume && NP.menuResume(); } catch (e) {} }
    try { window.NPArt && NPArt.repaint && NPArt.repaint(); } catch (e) {} try { window.dispatchEvent(new Event("storage")); } catch (e) {}
  }
  function openOverlay() {
    if (ov) return;
    try { if (window.NP && NP.menuPause) { NP.menuPause(); paused = true; } } catch (e) {}
    ov = document.createElement("div"); ov.id = "npMcOv"; ov.style.cssText = "position:fixed;inset:0;z-index:2147483200;background:#0E1020;touch-action:pan-y;overflow:hidden";   /* gắn vào <html> (không vào body: body/#play đặt touch-action:none chặn vuốt dọc cột phải) */
    var f = document.createElement("iframe"); f.src = "/nightpass-mascot.html?embed=1&lang=" + (vi() ? "vi" : "en") + "&m=" + encodeURIComponent(gid); f.title = vi() ? "Linh vật & skin" : "Mascot & skins"; f.style.cssText = "border:0;width:100%;height:100%;display:block;touch-action:pan-y";
    ov.appendChild(f); document.documentElement.appendChild(ov);
  }
  addEventListener("message", function (e) { if (e.origin !== location.origin || !e.data || e.data.np !== 1 || e.data.type !== "mc-close") return; closeOverlay(); });
  addEventListener("keydown", function (e) { if (e.key === "Escape") closeOverlay(); });
  function sync() {
    var t = top(), b = document.getElementById(ID);
    if (!t || !window.NPBadges || !NPBadges.entry(gid)) { if (b) b.remove(); return; }
    if (!b) {
      var ref = document.getElementById("npChBtn") || document.getElementById("bSnd") || document.getElementById("soundBtn");
      b = document.createElement("button"); b.type = "button"; b.id = ID; b.className = (ref && ref.className.replace(/\b(np-snd-off|on|off|hot|lk)\b/g, "").trim()) || "ib";
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" style="width:22px;height:22px;display:block;margin:auto"><circle cx="6.5" cy="10" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17.5" cy="10" r="2"/><path d="M12 12c-3 0-5.5 2.4-5.5 4.8 0 1.5 1.2 2.2 2.6 2.2 1 0 1.8-.4 2.9-.4s1.9.4 2.9.4c1.4 0 2.6-.7 2.6-2.2C17.5 14.4 15 12 12 12z"/></svg>';
      b.addEventListener("click", function () { openOverlay(); });
      if (ref && ref.parentNode === t) t.insertBefore(b, ref); else t.appendChild(b);
    }
    /* icon = chính linh vật của game (skin đang dùng) trong vòng gradient; chưa tải được thì giữ dấu chân */
    try { if (window.NPArt && NPArt.preload && !b.__pl) { b.__pl = 1; NPArt.preload([gid]).then(function () { b.__pl = 0; b.removeAttribute("data-try"); if (!b.getAttribute("data-art")) { b.setAttribute("data-try", "1"); sync(); } }); }
      if (window.NPArt && NPArt.markup && !b.getAttribute("data-art") && b.getAttribute("data-try")) { var mk = NPArt.markup(gid, (window.NPMascot2 && NPMascot2.getSkin ? NPMascot2.getSkin(gid) : "default") || "default", 34); if (mk) { b.innerHTML = '<span class="npmcAv">' + mk + "</span>"; b.setAttribute("data-art", "1"); } } } catch (e) {}
    var lab = vi() ? "Linh vật & skin" : "Mascot & skins"; if (b.getAttribute("aria-label") !== lab) { b.setAttribute("aria-label", lab); b.title = lab; }
  }
  if (!document.getElementById("npMcCss")) { var st = document.createElement("style"); st.id = "npMcCss"; st.textContent = "html:root #npMcBtn,html:root .top #npMcBtn.ib{background:none!important;border:0!important;box-shadow:none!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;padding:0!important;border-radius:0!important;overflow:visible!important}#npMcBtn .npmcAv{display:grid;place-items:center;width:100%;height:100%;border-radius:0;overflow:visible;background:none}#npMcBtn .npmcAv svg{width:128%!important;height:128%!important;max-width:none!important;display:block;filter:none}#npMcBtn:active{transform:scale(.94)}"; (document.head || document.documentElement).appendChild(st); }
  sync(); setInterval(sync, 2000);
})();
