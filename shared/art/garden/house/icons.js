/* Biểu tượng SVG cho nút tròn của Trong nhà / đàn / vẽ tranh (thay chữ ✕ ↩ ↪ 🗑 💾 🎨): ký tự/emoji lệch tâm trong nút trên Safari iOS vì lề chữ khác nhau; SVG luôn căn giữa. window.HouseIcons.<tên> = chuỗi svg (màu theo chữ). */
(function (root) {
  "use strict";
  function svg(p) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg>"; }
  root.HouseIcons = {
    x: svg('<path d="M6 6l12 12M18 6L6 18" stroke-width="3.2"/>'),
    undo: svg('<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.500 5.500 0 0 1 0 11H11"/>'),
    redo: svg('<path d="M15 14l5-5-5-5"/><path d="M20 9H9.500a5.500 5.500 0 0 0 0 11H13"/>'),
    trash: svg('<path d="M5 7h14M10 7V4.500h4V7M7 7l1 13h8l1-13M10 11v6M14 11v6"/>'),
    save: svg('<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>'),
    palette: svg('<path d="M12 3a9 9 0 1 0 0 18c1.600 0 2.100-1.100 1.500-2.100-.7-1.200.2-2.400 1.600-2.400H17a4 4 0 0 0 4-4C21 7 17 3 12 3z"/><circle cx="7.500" cy="11" r="1.300" fill="currentColor" stroke="none"/><circle cx="10.500" cy="7" r="1.300" fill="currentColor" stroke="none"/><circle cx="15" cy="7.500" r="1.300" fill="currentColor" stroke="none"/>')
  };
})(window);
