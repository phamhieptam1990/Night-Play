/* CẢNH TỪNG KHU: màu tường/sàn + đồ đặt TRÊN TƯỜNG SAU (tính theo % bề rộng tường: l = trái, b = đáy so với chân tường, w = rộng).
   Đồ nằm trong tường 3D nên tự co giãn theo mọi khung hình. lv = cấp tối thiểu mới hiện (trang trí mở dần theo tình cảm). */
window.NB_SCENES = {
  living: { c: ["#FFE9D2", "#F5B99A", "#FFEBD6", "#F2C3A4", "#E2A96B", "#B97F45", "#FFF8EE"], rug: 1,
    props: [{ i: "cua-so", l: 52, b: 44, w: 36 }, { i: "ghe-sofa", l: 2, b: 0, w: 54 }, { i: "den", l: 82, b: 0, w: 18 }, { i: "bong", l: 58, b: 0, w: 12, lv: 1 }] },
  kitchen: { c: ["#FFF3D6", "#FFE08A", "#FFF6E0", "#F6D88A", "#E8D3A8", "#C9A86E", "#FFFBEF"], rug: 0,
    props: [{ i: "cua-so", l: 4, b: 44, w: 32 }, { i: "tu-bep", l: 30, b: 0, w: 52 }, { i: "tu-lanh", l: 76, b: 0, w: 30 }, { i: "bat-an", l: 2, b: 0, w: 28 }] },
  bath: { c: ["#D8F0FF", "#9FD6F5", "#E6F6FF", "#BFE4FA", "#BFD9E8", "#8FB8CF", "#F2FAFF"], rug: 0,
    props: [{ i: "cua-so", l: 58, b: 46, w: 32 }, { i: "bon-tam", l: 0, b: 0, w: 62 }, { i: "voi-sen", l: 40, b: 40, w: 24 }, { i: "vit-cao-su", l: 74, b: 0, w: 16, lv: 1 }] },
  bedroom: { c: ["#E6E0FF", "#B8A8F0", "#EDE8FF", "#C9BDF5", "#D9B98A", "#A8814E", "#F6F2FF"], rug: 1,
    props: [{ i: "cua-so", l: 56, b: 44, w: 34 }, { i: "giuong-cun", l: 0, b: 0, w: 56 }, { i: "den", l: 82, b: 0, w: 18 }, { i: "gau-bong", l: 58, b: 0, w: 16, lv: 2 }] },
  yard: { c: ["#BFE9FF", "#E6F7FF", "#7ED67A", "#5EBE62", "#7ED67A", "#4FB35A", "#DFF4FF"], rug: 0, sky: 1,
    props: [{ i: "cay", l: 2, b: 2, w: 46 }, { i: "bui-hoa", l: 50, b: 0, w: 42 }, { i: "cay", l: 78, b: 6, w: 26, lv: 3 }] }
};
/* c = [tường trên, tường dưới, cạnh trái, cạnh phải, sàn 1, sàn 2, trần] */
Object.keys(NB_DATA.scene).forEach(function (k) { if (NB_SCENES[k]) NB_SCENES[k].c = NB_DATA.scene[k].c; });   /* màu tường riêng của thú lớp */
