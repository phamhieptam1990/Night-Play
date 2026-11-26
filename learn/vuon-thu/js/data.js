/* DỮ LIỆU CỐ ĐỊNH vườn thú: số chủ đề mỗi lớp (khớp learn/slot.js TOTAL.tviet), toạ độ 5 chuồng (tâm, % của sân khấu) cho hai bố cục, vật trang trí lẻ, tên đường dẫn. */
window.VT = { TOTAL: [7, 4, 4, 4, 4], ART: "art/", NB: "../nha-bi/art/",
  /* tâm chuồng + bề rộng (% sân khấu); sân khấu dọc 600x1200, ngang 1200x640 */
  AR: { doc: { ar: 0.5, w: 600 }, ngang: { ar: 2.3077, w: 1200 } },
  /* bố cục theo SỐ chuồng n (3..7): dọc = so le hai cột; ngang = so le hai hàng, đều theo chiều ngang */
  lay: function (m, n) {
    var A = this.AR[m], at = [], i, big = n >= 6;
    if (m === "doc") { var st = big ? 12 : 16.5, c = n >= 7 ? 52 : n === 6 ? 54 : 57; for (i = 0; i < n; i++) at.push([i % 2 ? 75 : 25, +(c + (i - (n - 1) / 2) * st).toFixed(1)]); }
    else { var sx = n > 1 ? 79 / (n - 1) : 0; for (i = 0; i < n; i++) at.push([+(n > 1 ? 10.5 + i * sx : 50).toFixed(1), i % 2 ? 33 : 61]); }
    return { ar: A.ar, w: A.w, pen: m === "doc" ? (big ? 40 : 45) : (big ? 17 : 19), at: at };
  },
  /* tư thế thú trong chuồng: walk = đi qua lại, sleep = nằm ngủ, chew = ngồi nhai */
  MODE: [null, "walk", "sleep", "walk", "chew", "walk"],
  /* đồ lẻ (tranh có sẵn của nhà thú): [tranh, x%, y%, rộng% sân khấu] theo bố cục */
  DECO: {
    doc: [["ca-rot", 52, 33, 5.5], ["tao", 49, 62, 5.5], ["bong", 53, 15, 6], ["bui-hoa", 8, 66, 9], ["bui-hoa", 90, 56, 8], ["bat-an", 52, 94, 8], ["ca", 11, 16, 6]],
    ngang: [["ca-rot", 20, 78, 3.2], ["tao", 40, 55, 3.2], ["bong", 60, 50, 3.4], ["bui-hoa", 6, 33, 5], ["bui-hoa", 96, 76, 4.5], ["bat-an", 78, 84, 4.5], ["ca", 50, 90, 3.5]]
  }
};
