/* VỊ TRÍ CÁC VÙNG DO NGƯỜI CHỈNH TAY, gom một chỗ (toạ độ thế giới, cùng hệ với ảnh cảnh).
   Cách chỉnh KHÔNG cần đoán số: mở  learn/garden/?edit , kéo/đổi cỡ các vùng, bấm "Sao chép" rồi dán đè khối dưới đây.
   - BLD: vùng bấm vào nhà / kho / ao. x,y = TÂM; w,h = rộng, cao; f = tên trang con trong shared/art/garden/.
   - GIFT: chỗ hộp quà mỗi ngày (một điểm x,y).
   Ô trồng (PLOTS), vật nuôi (SLOTS) và cửa chuồng (DOOR) là dữ liệu SINH trong shared/art/garden/garden-data.js (do scripts/learn/gen-scene-art.js). */
var BLD = [
  { n: "Trong nhà", ic: "🏠", f: "preview-house.html", x: 620, y: 140, w: 300, h: 270 },
  { n: "Kho nông sản", ic: "📦", f: "preview-barn.html", x: 1092, y: 505, w: 240, h: 210 },
  { n: "Ao cá", ic: "🐟", f: "preview-pond.html", x: 330, y: 308, w: 290, h: 150 }
];
var GIFT = { x: 800, y: 520 };
