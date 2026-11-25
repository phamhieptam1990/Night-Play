/* Biểu tượng SVG các bước làm món của từng quán (bột, lò, bột bánh, phô mai, ...) + biểu tượng món đại diện (nút khu quầy, nhiệm vụ). Thêm vào QK.icons và WorldKit.IC. */
(function () {
  "use strict";
  const P = {
    bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z" fill="currentColor"/><path d="M14 3l3 9M18 5l-3 7" stroke="#C98A3F" stroke-width="2" stroke-linecap="round"/>',
    oven: '<rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor"/><rect x="6" y="9" width="12" height="8" rx="2" fill="#FF9A3C"/><circle cx="7" cy="6.500" r="1" fill="#fff"/><circle cx="11" cy="6.500" r="1" fill="#fff"/>',
    cupcake: '<path d="M5 12h14l-2 9H7z" fill="#F2C27A"/><circle cx="12" cy="9" r="5.500" fill="#FF8FB1"/><circle cx="12" cy="3.500" r="1.800" fill="#E8203C"/>',
    dough: '<ellipse cx="12" cy="14" rx="9" ry="5.500" fill="#F2C27A"/><path d="M7 13q5-3 10 0" stroke="#fff" stroke-width="1.800" fill="none" stroke-linecap="round" opacity=".7"/><path d="M4 8l5 4M20 8l-5 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    sauce: '<path d="M12 3C8 9 6 12 6 15a6 6 0 0 0 12 0c0-3-2-6-6-12z" fill="#E8402F"/><ellipse cx="9.500" cy="14" rx="1.600" ry="2.600" fill="#fff" opacity=".5"/>',
    cheese: '<path d="M3 17l5-12 13 6v6z" fill="#FFD43B"/><circle cx="12" cy="13" r="1.800" fill="#F2A81A"/><circle cx="17" cy="14" r="1.200" fill="#F2A81A"/><circle cx="8" cy="15" r="1.200" fill="#F2A81A"/>',
    topping: '<circle cx="8" cy="9" r="4" fill="#F29AA6"/><circle cx="16" cy="9" r="3.500" fill="#4FB04A"/><circle cx="12" cy="16" r="4" fill="#E8402F"/>',
    pizza: '<path d="M12 22L3 6a16 16 0 0 1 18 0z" fill="#FFD43B"/><path d="M3 6a16 16 0 0 1 18 0" stroke="#E8A860" stroke-width="2.600" fill="none"/><circle cx="10" cy="9" r="1.800" fill="#E8402F"/><circle cx="14" cy="12" r="1.800" fill="#E8402F"/><circle cx="12" cy="16" r="1.400" fill="#E8402F"/>',
    bean: '<ellipse cx="12" cy="12" rx="6" ry="9" fill="#7A4A2A" transform="rotate(30 12 12)"/><path d="M9 4q6 8 0 16" stroke="#E8C898" stroke-width="1.600" fill="none"/>',
    brew: '<rect x="4" y="4" width="16" height="13" rx="3" fill="currentColor"/><rect x="9" y="8" width="6" height="4" fill="#fff" opacity=".7"/><path d="M12 13v5" stroke="#7A4A2A" stroke-width="2.200" stroke-linecap="round"/><rect x="6" y="19" width="12" height="2" rx="1" fill="currentColor"/>',
    mug: '<path d="M4 7h12v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" fill="currentColor"/><path d="M16 9h2a3 3 0 0 1 0 6h-2" stroke="currentColor" stroke-width="2.200" fill="none"/><path d="M8 3q-1 2 0 3M12 3q-1 2 0 3" stroke="#fff" stroke-width="1.500" stroke-linecap="round" fill="none" opacity=".8"/>',
    foam: '<circle cx="8" cy="14" r="5" fill="#fff"/><circle cx="15" cy="12" r="5.500" fill="#fff"/><circle cx="12" cy="8" r="4" fill="#fff"/><path d="M4 19h16" stroke="currentColor" stroke-width="2.400" stroke-linecap="round"/>',
    heart: '<path d="M12 21C4 15 3 10 3 8a4.500 4.500 0 0 1 9-1 4.500 4.500 0 0 1 9 1c0 2-1 7-9 13z" fill="#FF5A7A"/>',
    drop: '<path d="M12 3C8 9 6 12 6 15a6 6 0 0 0 12 0c0-3-2-6-6-12z" fill="#4FC3F7"/><ellipse cx="9.500" cy="14" rx="1.600" ry="2.600" fill="#fff" opacity=".6"/>',
    knife: '<path d="M4 20L16 4l3 2-10 15z" fill="#D8DDE8"/><rect x="15" y="3" width="6" height="4" rx="1.500" fill="#7A4A2A" transform="rotate(35 18 5)"/>',
    squeeze: '<circle cx="12" cy="12" r="9" fill="#FF9A1F"/><circle cx="12" cy="12" r="6.500" fill="#FFD27A"/><path d="M12 6v12M6 12h12M8 8l8 8M16 8l-8 8" stroke="#FF9A1F" stroke-width="1.200"/>',
    glass: '<path d="M5 5h14l-2 15H7z" fill="#EAF6FF" opacity=".8"/><path d="M6 10h12l-1.200 10H7.200z" fill="#FF9A1F"/><path d="M14 8L18 1" stroke="#FF5A8C" stroke-width="2.200" stroke-linecap="round"/>',
    straw: '<path d="M7 21L16 3" stroke="#FF5A8C" stroke-width="3.400" stroke-linecap="round"/><path d="M10 15l3 1.500M12.500 10l3 1.500" stroke="#fff" stroke-width="1.800" stroke-linecap="round"/>',
    world: '<path d="M3 11l9-7 9 7v9H3z" fill="currentColor"/><rect x="10" y="14" width="4" height="6" fill="#3B2A9E"/>'
  };
  Object.assign(QK.icons, P);
  if (window.WorldKit) Object.assign(WorldKit.IC, P);
  /* nút khu quầy dùng biểu tượng món đại diện của quán */
  const c = P[QK.data.itemIc] || QK.icons[QK.data.itemIc]; if (c) { QK.icons.counter = c; if (window.WorldKit) WorldKit.IC.counter = c; }
})();
