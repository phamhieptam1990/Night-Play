/* Biểu tượng SVG của game (nút không chữ): các khu, các bước làm kem, khoá, loa, hỏi. Thêm vào bảng IC của WorldKit để popup dùng chung. */
(function () {
  "use strict";
  const P = {
    counter: '<path d="M7 11l5 11 5-11z" fill="#F2C27A"/><circle cx="12" cy="8" r="6" fill="currentColor"/><circle cx="12" cy="1.800" r="1.800" fill="#FF5A5A"/>',
    dine: '<ellipse cx="12" cy="10" rx="9" ry="4" fill="currentColor"/><rect x="10.500" y="12" width="3" height="8" rx="1.500" fill="currentColor"/><ellipse cx="12" cy="20.500" rx="5" ry="1.500" fill="currentColor"/>',
    shop: '<path d="M3 9l2-5h14l2 5z" fill="#FF7A94"/><rect x="4" y="9" width="16" height="11" rx="1.500" fill="currentColor"/><rect x="10" y="13" width="4" height="7" fill="#3B2A9E"/>',
    book: '<path d="M4 5.500C7 4 10 4.300 12 6c2-1.700 5-2 8-.5V19c-3-1.500-6-1.200-8 .5-2-1.700-5-2-8-.5z" fill="currentColor"/><path d="M12 6v13.500" stroke="#3B2A9E" stroke-width="1.600"/>',
    sound: '<path d="M4 9.500v5h3.600L13 19V5L7.600 9.500z" fill="currentColor"/><path d="M16.200 9a4.200 4.200 0 0 1 0 6M18.800 6.400a8 8 0 0 1 0 11.200" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
    mute: '<path d="M4 9.500v5h3.600L13 19V5L7.600 9.500z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="3" fill="#B8B0D8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#B8B0D8" stroke-width="2.600" fill="none"/>',
    scoop: '<circle cx="12" cy="12" r="8" fill="#FF8FB1"/><path d="M5 15q3 4 7 1t7-1" fill="#E5558A"/><ellipse cx="9" cy="9" rx="2.500" ry="1.500" fill="#fff" opacity=".7"/>',
    cone: '<path d="M6 10h12l-6 12z" fill="#F2C27A"/><path d="M9 12l3 7M13 12l-2 7" stroke="#C98A3F" stroke-width="1.200"/><circle cx="12" cy="7" r="5.500" fill="#FF8FB1"/>',
    swirl: '<path d="M5 19h14l-1.500-4H6.500z" fill="#fff"/><path d="M7 15c-2-3 1-4 5-4 3 0 4-2 0-3 4-1 6 3 3 5" fill="#FFB6D0" stroke="#E5558A" stroke-width="1.400" stroke-linejoin="round"/>',
    sprinkle: '<rect x="4" y="9" width="7" height="3" rx="1.500" fill="#FF5A8C" transform="rotate(-30 7 10)"/><rect x="12" y="6" width="7" height="3" rx="1.500" fill="#4FC3F7" transform="rotate(25 15 7)"/><rect x="8" y="15" width="7" height="3" rx="1.500" fill="#FFD43B" transform="rotate(-8 11 16)"/>',
    cherry: '<circle cx="12" cy="15" r="6" fill="#E8203C"/><path d="M12 9Q14 4 19 3" stroke="#3E8A32" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="10" cy="13" rx="1.800" ry="1.200" fill="#fff" opacity=".7"/>',
    undo: '<path d="M9 6L4 11l5 5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M4 11h9a6 6 0 0 1 0 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" transform="translate(0 -4)"/>',
    ear: '<path d="M4 9.500v5h3.600L13 19V5L7.600 9.500z" fill="currentColor"/><path d="M16.200 9a4.200 4.200 0 0 1 0 6" stroke="currentColor" stroke-width="2.400" stroke-linecap="round" fill="none"/>',
    abc: '<text x="12" y="17" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="12" fill="currentColor">Aa</text>',
    serve: '<path d="M5 12.500l4.500 4.500L19 7.500" stroke="currentColor" stroke-width="3.800" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    up: '<path d="M12 20V6M6 12l6-6 6 6" stroke="currentColor" stroke-width="3.400" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  };
  QK.icons = P;
  if (window.WorldKit) Object.assign(WorldKit.IC, P);
  QK.ic = (n, cls) => '<svg viewBox="0 0 24 24"' + (cls ? ' class="' + cls + '"' : "") + ' aria-hidden="true">' + (P[n] || (window.WorldKit && WorldKit.IC[n]) || "") + "</svg>";
})();
