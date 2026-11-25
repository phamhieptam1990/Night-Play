/* THÚ LỚP 2: Mây (mèo). Dữ liệu duy nhất của lớp này: tên, tranh, đồ ăn/đồ chơi, cấp, lời thoại. Bộ máy nằm ở world.js + các tệp care-*.js. Tranh: art/meo*.svg (sinh bởi scripts/art/gen-nha-thu-lop.js; cún là tranh cũ). */
(window.NB_PETS = window.NB_PETS || {})[2] = {
  id: "meo", house: "nha-meo",
  pet: { name: "Mây", kind: "mèo", art: "meo", scaleByLevel: [0.62, 0.78, 0.94, 1.1, 1.26],
    levels: [["Mèo con", 0], ["Mèo nhí", 30], ["Mèo ngoan", 80], ["Mèo thông minh", 160], ["Mèo cưng", 300]] },
  foods: [["ca", "cá"], ["sua", "sữa"], ["banh-quy", "bánh quy"], ["tao", "táo"]],
  toys: [["vit-cao-su", "vịt cao su", 1],
    ["bong", "quả bóng", 0],
    ["gau-bong", "gấu bông", 0],
    ["xe", "xe đồ chơi", 0],
    ["dia-bay", "đĩa bay", 0]],
  scene: { living: { c: ["#EDE6FF", "#C7B8F2", "#F1ECFF", "#D3C8F6", "#DDB98A", "#B58B54", "#F8F4FF"] } },
  start: { food: { ca: 2, sua: 2 }, soap: 2, toys: ["vit-cao-su"] },
  say: {"feed": ["Ngon quá!", "Meo meo, ngon quá!", "Cảm ơn bé nhé!"],
    "wash": ["Mát quá!", "Thơm quá!", "Sạch bong rồi!"],
    "play": ["Vui quá!", "Meo meo!", "Chơi nữa nào!"],
    "sleep": ["Ngủ ngon nhé!", "Ngày mới vui vẻ!"],
    "miss": ["Mây nhớ bé lắm!", "Bé đã về rồi!"],
    "hi": ["Chào bé!", "Meo! Mây vui quá!"]
  }
};
