/* DỮ LIỆU quán LỚP 5: Quán Cà Phê Sách. Tranh trong art/g5/; steps = 5 bước làm (biểu tượng ở js/36-step-icons.js); lvl = độ khó:
   items = số món khác nhau trong đơn, nMax = số phần tối đa mỗi món, form = kiểu câu (chỉ số trong say.order). sg/pl = tên món số ít/nhiều (Tiếng Anh). */
window.QK_SHOP = {
  grade: 5, name: "Quán Cà Phê Sách", steps: ["bean","brew","mug","foam","heart"], itemIc: "mug",
  note: true,
  spell: true,
  flavors: [
    { id: "coffee", en: "coffee", sg: "cup of coffee", pl: "cups of coffee", cost: 0, lv: 1 },
    { id: "tea", en: "tea", sg: "cup of tea", pl: "cups of tea", cost: 0, lv: 1 },
    { id: "milk", en: "milk", sg: "glass of milk", pl: "glasses of milk", cost: 0, lv: 1 },
    { id: "cocoa", en: "cocoa", sg: "cup of hot chocolate", pl: "cups of hot chocolate", cost: 20, lv: 2 },
    { id: "lemonade", en: "lemonade", sg: "glass of lemonade", pl: "glasses of lemonade", cost: 30, lv: 3 },
    { id: "cookie", en: "cookie", sg: "cookie", pl: "cookies", cost: 40, lv: 4 }
  ],
  lvl: {"items":3,"nMax":2,"form":0},
  say: { order: ["Order: {o}.","Note: {o}, please."] },
  decor: [{ id: "decor-1", art: "decor-1", cost: 10, lv: 1, x: -1, y: 38, w: 14 }, { id: "decor-2", art: "decor-2", cost: 15, lv: 2, x: 84, y: 0, w: 12 }]
};
