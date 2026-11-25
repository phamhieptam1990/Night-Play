/* Hướng dẫn chơi Nhà của Bi (Pop): dữ liệu các bước cho shared/worldkit/world-guide.js. Thay thẻ chữ "?" cũ (pophelp) bằng hướng dẫn có bàn tay chỉ. */
WorldGuide.init({
  key: "ntv", takeover: true, useOwnPh: true, legacy: "pophelp-seen:nuoi-thu-tieng-viet",
  vars: function () { return { pet: "Bi" }; },
  btn: { mode: "hudfirst" },
  steps: [
    { sel: "#zbar .zb:nth-child(2)", act: "tap", ic: ["food"], t: { vi: "Chạm bếp để lấy đồ ăn", en: "Tap the kitchen for food" } },
    { from: "#tray .tr:not(.mgt)", to: "#pw", act: "drag", ic: ["food", "soap", "toy"], t: { vi: "Kéo đồ cho {pet}", en: "Drag it to {pet}" } },
    { sel: "#rStats", act: "look", ic: ["food", "soap", "toy"], t: { vi: "Thanh đầy là {pet} vui", en: "Full bars = happy {pet}" } },
    { sel: ".wk-hud button.wk-btn", act: "tap", ic: ["bag", "gift"], t: { vi: "Mở túi xem quà", en: "Open the bag for gifts" } },
    { sel: ".wk-lv", act: "look", ic: ["star"], t: { vi: "Chăm {pet}, {pet} lớn lên", en: "Care for {pet} to level up" } }
  ]
});
