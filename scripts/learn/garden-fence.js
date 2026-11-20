/* HÀNG RÀO của khu vườn Học Vui: chỉ cần ĐỔI KIỂU ở đây (hoặc ghi đè ở từng mảnh đất) là mọi nơi dùng tự vẽ lại, không phải sửa hàm vẽ.
   Các kiểu có sẵn (hàm vẽ nằm ở fenceRun trong gen-scene-art.js; thêm kiểu mới thì thêm vào STYLES và vẽ trong fenceRun):
     go = rào gỗ · tre = rào tre · da = tường đá · bui = hàng bụi cây · sat = rào sắt · trang = rào trắng
   Dùng: FENCE.styleFor("rau")  hoặc  FENCE.styleFor("cay", ld.fence)  (ld.fence là chuỗi kiểu, hoặc false = không rào). */
"use strict";
const STYLES = { go: "Rào gỗ", tre: "Rào tre", da: "Tường đá", bui: "Hàng bụi cây", sat: "Rào sắt", trang: "Rào trắng" };

/* KIỂU MẶC ĐỊNH theo nơi dùng: đổi 1 chữ là đổi cả loại đó */
const USE = {
  rau: "go",     /* khu rau */
  lua: "go",     /* khu lúa */
  hoa: "go",     /* khu hoa */
  cay: null,     /* cây lâu năm: KHÔNG rào (mỗi cây một mảnh chữ nhật riêng); muốn rào thì đặt "go" / "tre"... */
  pen: "go",     /* chuồng gia cầm / gia súc */
  court: "da"    /* sân quanh nhà */
};

/* use = nơi dùng (khoá của USE); override = kiểu ghi riêng cho một mảnh (chuỗi), false = không rào. Trả về tên kiểu, hoặc null nếu không rào (USE[use] = null cũng là không rào). */
function styleFor(use, override) {
  if (override === false) return null;
  const s = typeof override === "string" ? override : USE[use];
  if (s == null) return null;
  if (!STYLES[s]) throw new Error("garden-fence: kiểu rào không có: " + s + " (có: " + Object.keys(STYLES).join(", ") + ")");
  return s;
}
module.exports = { STYLES, USE, styleFor };
