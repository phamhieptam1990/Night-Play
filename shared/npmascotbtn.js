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
  function sync() {
    var t = top(), b = document.getElementById(ID);
    if (!t || !window.NPBadges || !NPBadges.entry(gid)) { if (b) b.remove(); return; }
    if (!b) {
      var ref = document.getElementById("npChBtn") || document.getElementById("bSnd") || document.getElementById("soundBtn");
      b = document.createElement("button"); b.type = "button"; b.id = ID; b.className = (ref && ref.className.replace(/\b(np-snd-off|on|off|hot|lk)\b/g, "").trim()) || "ib";
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" style="width:22px;height:22px;display:block;margin:auto"><circle cx="6.5" cy="10" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17.5" cy="10" r="2"/><path d="M12 12c-3 0-5.5 2.4-5.5 4.8 0 1.5 1.2 2.2 2.6 2.2 1 0 1.8-.4 2.9-.4s1.9.4 2.9.4c1.4 0 2.6-.7 2.6-2.2C17.5 14.4 15 12 12 12z"/></svg>';
      b.addEventListener("click", function () { var u = url(); try { window.top.location.href = u; } catch (e) { location.href = u; } });
      if (ref && ref.parentNode === t) t.insertBefore(b, ref); else t.appendChild(b);
    }
    var lab = vi() ? "Linh vật & skin" : "Mascot & skins"; if (b.getAttribute("aria-label") !== lab) { b.setAttribute("aria-label", lab); b.title = lab; }
  }
  sync(); setInterval(sync, 2000);
})();
