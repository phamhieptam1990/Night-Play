/* DỮ LIỆU CHUNG của Quán các lớp (Học Vui): số khách, mẫu câu cảm ơn, cấp quán, nâng cấp, nhiệm vụ, quà. Phần riêng từng lớp nằm ở shop-g<N>.js (window.QK_SHOP):
   name, art, steps, itemIc, flavors, lvl (độ khó), say.order, ask/note/spell, decor. Đổi thực đơn/câu/giá = sửa tệp lớp đó, logic không đổi. cost 0 = có sẵn; lv = cấp quán cần để mua. */
(function () {
  var S = window.QK_SHOP || {};
  var BASE_SAY = {
    thanks: ["Thank you!", "Yummy!", "Great job!", "Delicious!"], retry: ["Hmm... listen again, please.", "Oh! Not quite. Listen again."],
    table: ["Thank you!", "Yummy!", "So good!", "I love it!", "See you!"]
  };
  window.QK_DATA = Object.assign({
    rounds: 5, maxTray: 6, customers: ["meo", "tho", "gau", "heo"],
    numbers: ["zero", "one", "two", "three", "four", "five", "six"],
    /* cấp quán 1..5 (TRẦN 5): điểm quán = khách đã phục vụ + xu quà bài học / 5 (js/10-core.js); levelCoins = xu thưởng khi lên cấp đó */
    shopLv: [0, 4, 10, 20, 36], levelCoins: [0, 10, 15, 20, 30],
    /* nâng cấp: giá để lên cấp 2, 3. machine = làm nhanh hơn + thưởng xu; sign = tiền boa nhiều hơn; table = thêm bàn (2 → 4) */
    upgrades: [{ id: "machine", cost: [40, 90] }, { id: "sign", cost: [30, 70] }, { id: "table", cost: [25, 60] }],
    questCoin: 10,
    /* quà từ bài học Tiếng Anh (gifts-kem.js): xu cho mỗi bài đã học, mỗi sao kiểm tra, thêm khi qua bài kiểm tra */
    gift: { learned: 10, star: 5, passed: 10 }
  }, S);
  var D = window.QK_DATA; D.say = Object.assign({}, BASE_SAY, S.say || {});
  D.quests = [{ ic: "check", k: "served", n: 3 }, { ic: D.itemIc, k: "cups", n: 6 }, { ic: "star", k: "stars", n: 6 }];
  D.art = "art/g" + window.QK_GRADE + "/";
})();
