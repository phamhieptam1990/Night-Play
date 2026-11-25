/* DỮ LIỆU quán LỚP 4: Nhà Hàng Pizza. Tranh trong art/g4/; steps = 5 bước làm (biểu tượng ở js/36-step-icons.js); lvl = độ khó:
   items = số món khác nhau trong đơn, nMax = số phần tối đa mỗi món, form = kiểu câu (chỉ số trong say.order). sg/pl = tên món số ít/nhiều (Tiếng Anh). */
window.QK_SHOP = {
  grade: 4, name: "Nhà Hàng Pizza", steps: ["dough","sauce","cheese","topping","oven"], itemIc: "pizza",
  ask: "What would you like?",
  flavors: [
    { id: "cheese", en: "cheese", sg: "cheese pizza", pl: "cheese pizzas", cost: 0, lv: 1 },
    { id: "ham", en: "ham", sg: "ham pizza", pl: "ham pizzas", cost: 0, lv: 1 },
    { id: "mushroom", en: "mushroom", sg: "mushroom pizza", pl: "mushroom pizzas", cost: 0, lv: 1 },
    { id: "pepper", en: "pepper", sg: "pepper pizza", pl: "pepper pizzas", cost: 20, lv: 2 },
    { id: "pineapple", en: "pineapple", sg: "pineapple pizza", pl: "pineapple pizzas", cost: 30, lv: 3 },
    { id: "tomato", en: "tomato", sg: "tomato pizza", pl: "tomato pizzas", cost: 40, lv: 4 }
  ],
  lvl: {"items":2,"nMax":2,"form":0},
  say: { order: ["I would like {o}, please.","Can I have {o}, please?"] },
  decor: [{ id: "decor-1", art: "decor-1", cost: 10, lv: 1, x: -1, y: 38, w: 14 }, { id: "decor-2", art: "decor-2", cost: 15, lv: 2, x: 84, y: 0, w: 12 }]
};
