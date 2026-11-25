/* DỮ LIỆU quán LỚP 2: Tiệm Bánh. Tranh trong art/g2/; steps = 5 bước làm (biểu tượng ở js/36-step-icons.js); lvl = độ khó:
   items = số món khác nhau trong đơn, nMax = số phần tối đa mỗi món, form = kiểu câu (chỉ số trong say.order). sg/pl = tên món số ít/nhiều (Tiếng Anh). */
window.QK_SHOP = {
  grade: 2, name: "Tiệm Bánh", steps: ["bowl","oven","swirl","sprinkle","cherry"], itemIc: "cupcake",
  flavors: [
    { id: "cupcake", en: "cupcake", sg: "cupcake", pl: "cupcakes", cost: 0, lv: 1 },
    { id: "donut", en: "donut", sg: "donut", pl: "donuts", cost: 0, lv: 1 },
    { id: "cookie", en: "cookie", sg: "cookie", pl: "cookies", cost: 0, lv: 1 },
    { id: "cake", en: "cake", sg: "cake", pl: "cakes", cost: 20, lv: 2 },
    { id: "pie", en: "pie", sg: "pie", pl: "pies", cost: 30, lv: 3 },
    { id: "bread", en: "bread", sg: "loaf of bread", pl: "loaves of bread", cost: 40, lv: 4 }
  ],
  lvl: {"items":1,"nMax":3,"form":0},
  say: { order: ["{o}, please.","Can I have {o}, please?"] },
  decor: [{ id: "decor-1", art: "decor-1", cost: 10, lv: 1, x: -1, y: 38, w: 14 }, { id: "decor-2", art: "decor-2", cost: 15, lv: 2, x: 84, y: 0, w: 12 }]
};
