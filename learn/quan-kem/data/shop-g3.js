/* DỮ LIỆU quán LỚP 3: Quán Nước Ép. Tranh trong art/g3/; steps = 5 bước làm (biểu tượng ở js/36-step-icons.js); lvl = độ khó:
   items = số món khác nhau trong đơn, nMax = số phần tối đa mỗi món, form = kiểu câu (chỉ số trong say.order). sg/pl = tên món số ít/nhiều (Tiếng Anh). */
window.QK_SHOP = {
  grade: 3, name: "Quán Nước Ép", steps: ["drop","knife","squeeze","glass","straw"], itemIc: "glass",
  flavors: [
    { id: "orange", en: "orange", sg: "orange juice", pl: "orange juices", cost: 0, lv: 1 },
    { id: "strawberry", en: "strawberry", sg: "strawberry juice", pl: "strawberry juices", cost: 0, lv: 1 },
    { id: "apple", en: "apple", sg: "apple juice", pl: "apple juices", cost: 0, lv: 1 },
    { id: "banana", en: "banana", sg: "banana juice", pl: "banana juices", cost: 20, lv: 2 },
    { id: "watermelon", en: "watermelon", sg: "watermelon juice", pl: "watermelon juices", cost: 30, lv: 3 },
    { id: "lemon", en: "lemon", sg: "lemon juice", pl: "lemon juices", cost: 40, lv: 4 }
  ],
  lvl: {"items":2,"nMax":2,"form":0},
  say: { order: ["{o}, please.","Can I have {o}, please?"] },
  decor: [{ id: "decor-1", art: "decor-1", cost: 10, lv: 1, x: -1, y: 38, w: 14 }, { id: "decor-2", art: "decor-2", cost: 15, lv: 2, x: 84, y: 0, w: 12 }]
};
