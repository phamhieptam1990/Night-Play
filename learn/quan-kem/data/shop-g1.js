/* DỮ LIỆU quán LỚP 1: Quán Kem. Tranh trong art/g1/; steps = 5 bước làm (biểu tượng ở js/36-step-icons.js); lvl = độ khó:
   items = số món khác nhau trong đơn, nMax = số phần tối đa mỗi món, form = kiểu câu (chỉ số trong say.order). sg/pl = tên món số ít/nhiều (Tiếng Anh). */
window.QK_SHOP = {
  grade: 1, name: "Quán Kem", steps: ["scoop","cone","swirl","sprinkle","cherry"], itemIc: "cone",
  dot: true,
  flavors: [
    { id: "vanilla", en: "vanilla", sg: "vanilla ice cream", pl: "vanilla ice creams", cost: 0, lv: 1, col: "#FFF0C2" },
    { id: "strawberry", en: "strawberry", sg: "strawberry ice cream", pl: "strawberry ice creams", cost: 0, lv: 1, col: "#FF8FB1" },
    { id: "chocolate", en: "chocolate", sg: "chocolate ice cream", pl: "chocolate ice creams", cost: 0, lv: 1, col: "#9A6A4A" },
    { id: "mint", en: "mint", sg: "mint ice cream", pl: "mint ice creams", cost: 20, lv: 2, col: "#8FEAC8" },
    { id: "mango", en: "mango", sg: "mango ice cream", pl: "mango ice creams", cost: 30, lv: 3, col: "#FFC84A" },
    { id: "blueberry", en: "blueberry", sg: "blueberry ice cream", pl: "blueberry ice creams", cost: 40, lv: 4, col: "#9AAEFF" }
  ],
  lvl: {"items":1,"nMax":5,"form":0},
  say: { order: ["{o}, please.","Can I have {o}, please?"] },
  decor: [{ id: "bong-bay", art: "decor-1", cost: 10, lv: 1, x: -1, y: 38, w: 14 }, { id: "den-treo", art: "decor-2", cost: 15, lv: 2, x: 84, y: 0, w: 12 }]
};
