/* THÚ LỚP 1: Bông (thỏ). Dữ liệu duy nhất của lớp này: tên, tranh, đồ ăn/đồ chơi, cấp, lời thoại. Bộ máy nằm ở world.js + các tệp care-*.js. Tranh: art/tho*.svg (sinh bởi scripts/art/gen-nha-thu-lop.js; cún là tranh cũ). */
(window.NB_PETS = window.NB_PETS || {})[1] = {
  id: "tho", house: "nha-tho",
  pet: { name: "Bông", kind: "thỏ", art: "tho", scaleByLevel: [0.62, 0.78, 0.94, 1.1, 1.26],
    levels: [["Thỏ con", 0], ["Thỏ nhí", 30], ["Thỏ ngoan", 80], ["Thỏ thông minh", 160], ["Thỏ cưng", 300]] },
  foods: [["ca-rot", "cà rốt"], ["rau", "rau cải"], ["tao", "táo"], ["sua", "sữa"]],
  toys: [["gau-bong", "gấu bông", 1],
    ["bong", "quả bóng", 0],
    ["vit-cao-su", "vịt cao su", 0],
    ["xe", "xe đồ chơi", 0],
    ["dia-bay", "đĩa bay", 0]],
  scene: { living: { c: ["#FFE6EE", "#F7B7CC", "#FFEAF0", "#F4C2D3", "#E2B07A", "#C48A52", "#FFF6F8"] } },
  start: { food: { "ca-rot": 2, tao: 2 }, soap: 2, toys: ["gau-bong"] },
  say: {"feed": ["Ngon quá!", "Nhoàm nhoàm, ngon quá!", "Cảm ơn em nhé!"],
    "wash": ["Mát quá!", "Thơm quá!", "Sạch bong rồi!"],
    "play": ["Vui quá!", "Nhảy nhảy nào!", "Chơi nữa nào!"],
    "sleep": ["Ngủ ngon nhé!", "Ngày mới vui vẻ!"],
    "miss": ["Bông nhớ em lắm!", "Em đã về rồi!"],
    "hi": ["Chào em!", "Bông vui quá!"]
  }
};
