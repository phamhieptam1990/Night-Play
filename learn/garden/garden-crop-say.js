/* Lời thoại của linh vật 8 cây trồng mới (bong bóng trong popup cây, như 6 cây cũ). Mỗi cây: tên linh vật + [lời lúc đang lớn, lời lúc chín].
   Quy ước: ngắn (<= 60 ký tự), tử tế, không trách bé, đúng chính tả. Tranh tương ứng: shared/art/garden/mascot_<id>_l1..l4[_cheer].svg (scripts/learn/gen-crop-mascots-g.js).
   garden-items.js (extendCI) đọc bảng này khi thêm cây mới vào CI. Dùng được cả ở trình duyệt (GardenCropSay) lẫn node (scripts/learn/check-garden.js). */
(function (root) {
  var SAY = {
    bokchoy: { mn: "Cải Xanh", say: ["Cải Xanh đây! Mình cùng đọc chữ nhé!", "Cải xanh mướt rồi! Bé thu hoạch nhé!"] },
    cucumber: { mn: "Dưa Leo", say: ["Dưa Leo đây! Cùng đếm từng bước nào!", "Dưa leo giòn mát rồi! Bé hái mình nhé!"] },
    pumpkin: { mn: "Bí Đỏ", say: ["Hello! Mình là Bí Đỏ! Học từ mới nào!", "Bí tròn vo rồi! Bé thu hoạch nhé!"] },
    potato: { mn: "Khoai Tây", say: ["Khoai Tây đây! Bé tính thử giúp mình nhé!", "Khoai to rồi! Bé đào mình lên nào!"] },
    cabbage: { mn: "Cải Bắp", say: ["Cải Bắp đây! Cùng đọc nhiều hơn nhé!", "Cải bắp cuộn tròn rồi! Thu hoạch nè!"] },
    onion: { mn: "Hành Tím", say: ["Hello! Mình là Hành Tím! Nói tiếng Anh nhé!", "Hành tím chín rồi! Bé nhổ mình lên nhé!"] },
    rice: { mn: "Lúa Nước", say: ["Lúa Nước đây! Đọc đúng nhiều, lúa lớn nhanh!", "Lúa vàng óng rồi! Bé gặt mình nhé!"] },
    bean: { mn: "Đậu Đậu", say: ["Đậu Đậu đây! Cùng giải toán thật vui nhé!", "Quả đậu căng tròn rồi! Bé hái mình nhé!"] }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = SAY; else root.GardenCropSay = SAY;
})(typeof window !== "undefined" ? window : globalThis);
