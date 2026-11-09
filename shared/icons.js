/* Biểu tượng SVG thay cho emoji ở các nút trên cùng (🏆, 🔊/🔇): emoji lệch tâm và to nhỏ khác nhau tuỳ máy/phông (nhất là Chrome điện thoại),
   SVG luôn nằm chính giữa và đồng bộ với 📷/📤. Game vẫn đặt textContent như cũ (🔊/🔇...) — file này tự đổi lại thành SVG mỗi khi nội dung thay đổi. */
(function () {
  "use strict";
  var A = 'viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;margin:0;flex:none"';
  var ICON = {
    trophy: "<svg " + A + '><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
    snd: "<svg " + A + '><path d="M4 9.5v5h3.6L13 19V5L7.6 9.5z"/><path d="M16.2 9a4.2 4.2 0 0 1 0 6M18.8 6.4a8 8 0 0 1 0 11.2"/></svg>',
    mute: "<svg " + A + '><path d="M4 9.5v5h3.6L13 19V5L7.6 9.5z"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/></svg>'
  };
  var MAP = { "🏆": "trophy", "🔊": "snd", "🔉": "snd", "🔈": "snd", "🔇": "mute", "🔕": "mute" };
  var busy = false;
  function swap(root) {
    var els = (root || document).querySelectorAll(".top button, .tools button, .tools a, header button, #bBoard, #bSnd, #sndBtn, #soundBtn");
    busy = true;
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.children.length) continue;                       // đã là SVG / có phần tử con
      var t = (e.textContent || "").replace(/️/g, "").trim(), k = MAP[t];
      if (!k) continue;
      e.innerHTML = ICON[k]; e.style.display = e.style.display || "grid"; e.style.placeItems = "center"; e.style.padding = "0"; e.style.lineHeight = "0";
    }
    busy = false;
  }
  var raf = 0;
  function queue() { if (busy) return; cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { swap(); }); }
  function init() {
    var st = document.createElement("style");
    st.textContent = "#bLang{font-size:13px!important;letter-spacing:0!important;padding:0!important;white-space:nowrap;font-variant-numeric:normal}";
    document.head.appendChild(st);
    swap();
    try { new MutationObserver(queue).observe(document.body, { childList: true, characterData: true, subtree: true }); } catch (e) {}
  }
  if (document.body) init(); else document.addEventListener("DOMContentLoaded", init);
})();
