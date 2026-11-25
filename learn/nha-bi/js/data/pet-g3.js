/* THÚ LỚP 3: Bi (cún). Dữ liệu duy nhất của lớp này: tên, tranh, đồ ăn/đồ chơi, cấp, lời thoại. Bộ máy nằm ở world.js + các tệp care-*.js. Tranh: art/cun*.svg (sinh bởi scripts/art/gen-nha-thu-lop.js; cún là tranh cũ). */
(window.NB_PETS = window.NB_PETS || {})[3] = {
  id: "cun", house: "nha-bi",
  pet: { name: "Bi", kind: "cún", art: "cun", scaleByLevel: [0.62, 0.78, 0.94, 1.1, 1.26],
    levels: [["Cún con", 0], ["Cún nhí", 30], ["Cún ngoan", 80], ["Cún thông minh", 160], ["Cún cưng", 300]] },
  foods: [["xuong", "xương"], ["ca", "cá"], ["tao", "táo"], ["sua", "sữa"]],
  toys: [["bong", "quả bóng", 1],
    ["vit-cao-su", "vịt cao su", 0],
    ["xe", "xe đồ chơi", 0],
    ["gau-bong", "gấu bông", 0],
    ["dia-bay", "đĩa bay", 0]],
  start: { food: { xuong: 2, tao: 2 }, soap: 2, toys: ["bong"] },
  say: {"feed": ["Ngon quá!", "Ăm ăm, ngon quá!", "Cảm ơn bé nhé!"],
    "wash": ["Mát quá!", "Thơm quá!", "Sạch bong rồi!"],
    "play": ["Vui quá!", "Chơi nữa nào!", "Gâu gâu!"],
    "sleep": ["Ngủ ngon nhé!", "Ngày mới vui vẻ!"],
    "miss": ["Bi nhớ bé lắm!", "Bé đã về rồi!"],
    "hi": ["Chào bé!", "Bi vui quá!"]
  }
};
