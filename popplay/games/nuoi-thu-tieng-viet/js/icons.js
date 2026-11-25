/* BIỂU TƯỢNG SVG của game (24x24) dùng cho nút ít chữ: về nhà, học, chia sẻ, chơi, đóng, tích, khoá. */
(function (N) {
  "use strict";
  var P = {
    home: '<path d="M3 11.500L12 4l9 7.500V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor"/>',
    book: '<path d="M4 5.500C7 4 10 4.300 12 6c2-1.700 5-2 8-.5V19c-3-1.500-6-1.200-8 .5-2-1.700-5-2-8-.5z" fill="currentColor"/><path d="M12 6v13.500" stroke="#3B2A9E" stroke-width="1.600"/>',
    share: '<path d="M12 3v12M7 8l5-5 5 5" stroke="currentColor" stroke-width="2.800" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
      '<path d="M5 13v6h14v-6" stroke="currentColor" stroke-width="2.800" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    play: '<path d="M8 5.200v13.600a1 1 0 0 0 1.500.900l10.600-6.800a1 1 0 0 0 0-1.700L9.500 4.300A1 1 0 0 0 8 5.200z" fill="currentColor"/>',
    close: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3.400" stroke-linecap="round" fill="none"/>',
    check: '<path d="M5 12.500l4.500 4.500L19 7.500" stroke="currentColor" stroke-width="3.600" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    lock: '<rect x="5" y="10.500" width="14" height="10" rx="3" fill="currentColor"/><path d="M8 10.500V8a4 4 0 0 1 8 0v2.500" stroke="currentColor" stroke-width="2.600" fill="none"/>'
  };
  N.icon = function (n) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (P[n] || "") + "</svg>"; };
  /* gắn biểu tượng vào các nút có data-ic */
  N.paintIcons = function (root) { [].forEach.call((root || document).querySelectorAll("[data-nic]"), function (b) { b.innerHTML = N.icon(b.dataset.nic); }); };
})(window.NTV);
