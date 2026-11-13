/* Biểu tượng SVG thay cho emoji ở các nút trên cùng (🏆, 🔊/🔇): emoji lệch tâm và to nhỏ khác nhau tuỳ máy/phông (nhất là Chrome điện thoại),
   SVG luôn nằm chính giữa và đồng bộ với 📷/📤. Game vẫn đặt textContent như cũ (🔊/🔇...) — file này tự đổi lại thành SVG mỗi khi nội dung thay đổi. */
(function () {
  "use strict";
  var A = 'viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:block;margin:0;flex:none"';
  var B = A.replace('width="20" height="20"', 'width="1.15em" height="1.15em"');   /* cỡ theo chữ của nút (như emoji trước đây), không cố định 20px */
  var ICON = {
    trophy: "<svg " + A + '><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
    snd: "<svg " + A + '><path d="M4 9.5v5h3.6L13 19V5L7.6 9.5z"/><path d="M16.2 9a4.2 4.2 0 0 1 0 6M18.8 6.4a8 8 0 0 1 0 11.2"/></svg>',
    mute: "<svg " + A + '><path d="M4 9.5v5h3.6L13 19V5L7.6 9.5z"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/></svg>',
    /* tải lại / chơi lại (🔁 ↻ ↺ 🔄 🔃): hai mũi tên vòng tròn; hoàn tác (↩): mũi tên quay lại. Emoji 🔁 ↩ trên iPhone ra ô xám/xanh lệch tâm, nên dùng SVG đồng bộ cho MỌI game. */
    play: "<svg " + B + '><path d="M8 4.8v14.4l12-7.2z" fill="currentColor"/></svg>',
    bulb: "<svg " + B + '><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>',
    redo: "<svg " + B + '><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>',
    undo: "<svg " + B + '><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
    share: "<svg " + B + '><path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>',
    back: "<svg " + B + '><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    close: "<svg " + B + '><path d="M6 6l12 12M18 6L6 18"/></svg>',
    save: "<svg " + B + '><path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M7 3v6h8V3M7 21v-7h10v7"/></svg>',
    film: "<svg " + B + '><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></svg>',
    book: "<svg " + B + '><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 8h6"/></svg>',
    clip: "<svg " + B + '><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h6"/></svg>',
    chart: "<svg " + B + '><path d="M5 20V10M12 20V4M19 20v-7"/></svg>',
    sword: "<svg " + B + '><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2"/></svg>',
    home: "<svg " + A + '><path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>'
  };
  var MAP = { "🏆": "trophy", "🔊": "snd", "🔉": "snd", "🔈": "snd", "🔇": "mute", "🔕": "mute", "🏠": "home" };
  var MAP2 = { "🔁": "redo", "🔂": "redo", "🔄": "redo", "🔃": "redo", "↻": "redo", "↺": "redo", "⟲": "redo", "⟳": "redo", "↩": "undo", "↩️": "undo", "↶": "undo", "▶": "play", "▶️": "play", "💡": "bulb" };   /* áp cho MỌI nút chỉ chứa đúng ký tự này */
  /* CHỈ cho nút tròn .ib2 (màn kết quả/popup): đổi emoji/ký tự thành SVG trắng đồng bộ với nút ← và ⋯, kiểu dáng do glass.css lo */
  var MAP3 = { "📤": "share", "←": "back", "✕": "close", "💾": "save", "🎬": "film", "📖": "book", "📋": "clip", "📊": "chart", "⚔": "sword", "🏠": "home", "🏡": "home", "🏆": "trophy", "🔊": "snd", "🔇": "mute" };
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
    var all = (root || document).querySelectorAll("button,a.ib2");
    for (var j = 0; j < all.length; j++) {
      var b = all[j]; if (b.children.length) continue;
      var t2 = (b.textContent || "").replace(/\uFE0F/g, "").trim(), ib2 = b.classList.contains("ib2"), k2 = MAP2[t2] || (ib2 && MAP3[t2]); if (!k2) continue;
      b.innerHTML = ICON[k2];
      if (ib2 || b.hasAttribute("data-l")) continue;   /* .ib2 và nút có nhãn ::after (data-l) tự dàn bằng CSS của chúng (glass.css/endui.css): không ép grid/padding 0 */
      b.style.display = b.style.display || "grid"; b.style.placeItems = "center"; b.style.padding = "0"; b.style.lineHeight = "0";
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
