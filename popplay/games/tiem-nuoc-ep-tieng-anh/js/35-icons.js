/* Biểu tượng SVG của game (nút không chữ): các khu, các bước làm món, khoá, loa, hỏi. Thêm vào cùng bảng IC của WorldKit khi có thể. */
(function () {
  "use strict";
  const P = {
    counter: '<path d="M7 3h10l-1.500 7h-7z" fill="#FFB84A"/><path d="M5 11h14v3c0 3-3 6-7 6s-7-3-7-6z" fill="currentColor"/><path d="M15 3l3-2" stroke="#FF5A8C" stroke-width="2" stroke-linecap="round"/>',
    dine: '<ellipse cx="12" cy="10" rx="9" ry="4" fill="currentColor"/><rect x="10.500" y="12" width="3" height="8" rx="1.500" fill="currentColor"/><ellipse cx="12" cy="20.500" rx="5" ry="1.500" fill="currentColor"/>',
    garden: '<rect x="11" y="12" width="2.600" height="9" rx="1.300" fill="#C98A4E"/><circle cx="12" cy="9" r="6.500" fill="#4FB04A"/><circle cx="9.500" cy="8" r="1.500" fill="#FF5A5A"/><circle cx="14" cy="10" r="1.500" fill="#FF5A5A"/>',
    shop: '<path d="M3 9l2-5h14l2 5z" fill="#FF7A94"/><rect x="4" y="9" width="16" height="11" rx="1.500" fill="currentColor"/><rect x="10" y="13" width="4" height="7" fill="#3B2A9E"/>',
    book: '<path d="M4 5.500C7 4 10 4.300 12 6c2-1.700 5-2 8-.5V19c-3-1.500-6-1.200-8 .5-2-1.700-5-2-8-.5z" fill="currentColor"/><path d="M12 6v13.500" stroke="#3B2A9E" stroke-width="1.600"/>',
    sound: '<path d="M4 9.500v5h3.600L13 19V5L7.600 9.500z" fill="currentColor"/><path d="M16.200 9a4.200 4.200 0 0 1 0 6M18.800 6.400a8 8 0 0 1 0 11.200" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
    mute: '<path d="M4 9.500v5h3.600L13 19V5L7.600 9.500z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/>',
    help: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.200 9.200a2.900 2.900 0 1 1 4.600 2.300c-1 .8-1.800 1.300-1.800 2.700M12 17.500v.2" stroke="currentColor" stroke-width="2.400" stroke-linecap="round" fill="none"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="3" fill="#B8B0D8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#B8B0D8" stroke-width="2.600" fill="none"/>',
    drop: '<path d="M12 3C8 9 6 12 6 15a6 6 0 0 0 12 0c0-3-2-6-6-12z" fill="#5BC8FF"/><ellipse cx="9.800" cy="14" rx="1.400" ry="2.200" fill="#fff" opacity=".7"/>',
    knife: '<path d="M4 19L16 5l4 3L8 21z" fill="#D8E6F0"/><path d="M16 5l4 3-1.500 1.800-4-3z" fill="#8A5A2A"/>',
    press: '<rect x="6" y="3" width="12" height="4" rx="2" fill="currentColor"/><rect x="10.800" y="7" width="2.400" height="7" fill="currentColor"/><path d="M5 15h14l-2 5H7z" fill="#FFB84A"/>',
    pour: '<path d="M5 8h10l-1 11a2 2 0 0 1-2 1.600H8A2 2 0 0 1 6 19z" fill="#FFB84A"/><path d="M15 9c3 0 5 2 5 5" stroke="#FFB84A" stroke-width="2.400" stroke-linecap="round" fill="none"/>',
    straw: '<path d="M16 3L9 20" stroke="#FF5A8C" stroke-width="3.600" stroke-linecap="round"/><path d="M16 3l3.500-1" stroke="#FF5A8C" stroke-width="3.600" stroke-linecap="round"/><path d="M14 8l-3 8" stroke="#fff" stroke-width="1.400" stroke-dasharray="2 2.500"/>',
    undo: '<path d="M9 6L4 11l5 5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M4 11h9a6 6 0 0 1 0 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" transform="translate(0 -4)"/>',
    ear: '<path d="M4 9.500v5h3.600L13 19V5L7.600 9.500z" fill="currentColor"/><path d="M16.200 9a4.200 4.200 0 0 1 0 6" stroke="currentColor" stroke-width="2.400" stroke-linecap="round" fill="none"/>',
    abc: '<text x="12" y="17" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="12" fill="currentColor">Aa</text>',
    share: '<circle cx="6" cy="12" r="3" fill="currentColor"/><circle cx="18" cy="6" r="3" fill="currentColor"/><circle cx="18" cy="18" r="3" fill="currentColor"/><path d="M8.500 10.500l7-3.500M8.500 13.500l7 3.500" stroke="currentColor" stroke-width="2"/>',
    serve: '<path d="M5 12.500l4.500 4.500L19 7.500" stroke="currentColor" stroke-width="3.800" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
  };
  TNE.icons = P;
  if (window.WorldKit) Object.assign(WorldKit.IC, P);
  TNE.ic = (n, cls) => '<svg viewBox="0 0 24 24"' + (cls ? ' class="' + cls + '"' : "") + ' aria-hidden="true">' + (P[n] || (window.WorldKit && WorldKit.IC[n]) || "") + "</svg>";
})();
