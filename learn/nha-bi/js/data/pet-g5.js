/* THÚ LỚP 5: Tia (rồng nhỏ). Dữ liệu duy nhất của lớp này: tên, tranh, đồ ăn/đồ chơi, cấp, lời thoại. Bộ máy nằm ở world.js + các tệp care-*.js. Tranh: art/rong*.svg (sinh bởi scripts/art/gen-nha-thu-lop.js; cún là tranh cũ). */
(window.NB_PETS = window.NB_PETS || {})[5] = {
  id: "rong", house: "nha-rong",
  pet: { name: "Tia", kind: "rồng nhỏ", art: "rong", scaleByLevel: [0.62, 0.78, 0.94, 1.1, 1.26],
    levels: [["Rồng con", 0], ["Rồng nhí", 30], ["Rồng ngoan", 80], ["Rồng thông thái", 160], ["Rồng thần", 300]] },
  foods: [["tao", "táo"], ["ca", "cá"], ["banh-quy", "bánh quy"], ["sua", "sữa"]],
  toys: [["dia-bay", "đĩa bay", 1],
    ["bong", "quả bóng", 0],
    ["xe", "xe đồ chơi", 0],
    ["gau-bong", "gấu bông", 0],
    ["vit-cao-su", "vịt cao su", 0]],
  scene: { living: { c: ["#DDEEFF", "#A9CFF5", "#E4F1FF", "#B9D8F7", "#D2B98E", "#A58650", "#F2F8FF"] } },
  start: { food: { tao: 2, ca: 2 }, soap: 2, toys: ["dia-bay"] },
  say: {"feed": ["Ngon quá!", "Hò hò, ngon quá!", "Cảm ơn bé nhé!"],
    "wash": ["Mát quá!", "Thơm quá!", "Sạch bong rồi!"],
    "play": ["Vui quá!", "Bay bay nào!", "Chơi nữa nào!"],
    "sleep": ["Ngủ ngon nhé!", "Ngày mới vui vẻ!"],
    "miss": ["Tia nhớ bé lắm!", "Bé đã về rồi!"],
    "hi": ["Chào bé!", "Tia vui quá!"]
  }
};
