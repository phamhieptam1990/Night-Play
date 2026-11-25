/* DỮ LIỆU Quán Cáo Cam (thế giới lớn): thực đơn, mẫu câu khách nói, cấp quán, đồ trang trí. Tự chứa, không liên quan học liệu; đổi thực đơn/câu = sửa tệp này, logic không đổi. */
window.TNE_DATA = {
  id: "shop", rounds: 5, art: "../../../shared/art/tiem-nuoc-ep/",
  numbers: ["zero", "one", "two", "three", "four", "five"],
  /* cost 0 = có sẵn; lv = cấp quán cần để thấy nút mua */
  fruits: [
    { id: "cam", en: "orange", cost: 0, lv: 1 }, { id: "dau", en: "strawberry", cost: 0, lv: 1 },
    { id: "tao", en: "apple", cost: 0, lv: 1 }, { id: "chuoi", en: "banana", cost: 0, lv: 1 },
    { id: "dua-hau", en: "watermelon", cost: 20, lv: 2 }, { id: "chanh", en: "lemon", cost: 30, lv: 3 }
  ],
  customers: ["meo", "tho", "gau", "heo"],
  /* độ khó theo cấp quán: lv1: 1 ly · lv2: 1-3 ly cùng vị · lv3: hai vị */
  levels: [{ items: 1, nMax: 1 }, { items: 1, nMax: 3 }, { items: 2, nMax: 2 }],
  /* số khách đã phục vụ để lên cấp quán 1..6; mỗi cấp mở thêm bàn (tối đa 4), vị, đồ trang trí */
  shopLv: [0, 3, 8, 15, 25, 40],
  say: { order: "{o}, please.", thanks: ["Thank you!", "Yummy!", "Great job!", "Delicious!"], retry: ["Hmm... listen again, please.", "Oh! Not quite. Listen again."],
    table: ["Thank you!", "Yummy!", "So good!", "I love it!", "See you!"] },
  decor: [
    { id: "chau-cay", cost: 10, lv: 1, x: -1, y: 38, w: 12 }, { id: "den-long", cost: 15, lv: 2, x: 84, y: 6, w: 11 }, { id: "cup-sao", cost: 25, lv: 3, x: 47, y: 35, w: 13 }
  ],
  quests: [{ ic: "check", k: "served", n: 3 }, { ic: "food", k: "cups", n: 6 }, { ic: "star", k: "stars", n: 6 }],
  questCoin: 10
};
