/* DỮ LIỆU CỐ ĐỊNH vườn thú: số chủ đề mỗi lớp (khớp learn/slot.js TOTAL.tviet), toạ độ 5 chuồng (tâm, % của sân khấu) cho hai bố cục, vật trang trí lẻ, tên đường dẫn. */
window.VT = { TOTAL: [7, 4, 4, 4, 4], ART: "art/", NB: "../nha-bi/art/",
  /* tâm chuồng + bề rộng (% sân khấu); sân khấu dọc 600x1200, ngang 1200x640 */
  LAY: {
    doc: { ar: 0.5, w: 600, pen: 45, at: [[25, 25], [75, 41], [25, 57], [75, 73], [25, 89]] },
    ngang: { ar: 2.3077, w: 1200, pen: 19, at: [[10.5, 61], [30.5, 33], [50, 61], [69.5, 33], [89.5, 61]] }
  },
  /* tư thế thú trong chuồng: walk = đi qua lại, sleep = nằm ngủ, chew = ngồi nhai */
  MODE: [null, "walk", "sleep", "walk", "chew", "walk"],
  /* đồ lẻ (tranh có sẵn của nhà thú): [tranh, x%, y%, rộng% sân khấu] theo bố cục */
  DECO: {
    doc: [["ca-rot", 52, 33, 5.5], ["tao", 49, 62, 5.5], ["bong", 53, 15, 6], ["bui-hoa", 8, 66, 9], ["bui-hoa", 90, 56, 8], ["bat-an", 52, 94, 8], ["ca", 11, 16, 6]],
    ngang: [["ca-rot", 20, 78, 3.2], ["tao", 40, 55, 3.2], ["bong", 60, 50, 3.4], ["bui-hoa", 6, 33, 5], ["bui-hoa", 96, 76, 4.5], ["bat-an", 78, 84, 4.5], ["ca", 50, 90, 3.5]]
  }
};
