/* THÚ LỚP 4: Trúc (gấu trúc). Dữ liệu duy nhất của lớp này: tên, tranh, đồ ăn/đồ chơi, cấp, lời thoại. Bộ máy nằm ở world.js + các tệp care-*.js. Tranh: art/gautruc*.svg (sinh bởi scripts/art/gen-nha-thu-lop.js; cún là tranh cũ). */
(window.NB_PETS = window.NB_PETS || {})[4] = {
  id: "gautruc", house: "nha-gautruc",
  pet: { name: "Trúc", kind: "gấu trúc", art: "gautruc", scaleByLevel: [0.62, 0.78, 0.94, 1.1, 1.26],
    levels: [["Gấu con", 0], ["Gấu nhí", 30], ["Gấu ngoan", 80], ["Gấu thông minh", 160], ["Gấu cưng", 300]] },
  foods: [["tre", "tre non"], ["tao", "táo"], ["ca-rot", "cà rốt"], ["banh-quy", "bánh quy"]],
  toys: [["gau-bong", "gấu bông", 1],
    ["bong", "quả bóng", 0],
    ["xe", "xe đồ chơi", 0],
    ["vit-cao-su", "vịt cao su", 0],
    ["dia-bay", "đĩa bay", 0]],
  scene: { living: { c: ["#E4F6E4", "#A8DDB0", "#EAF8EA", "#BCE6C0", "#D9C08A", "#A8884E", "#F4FBF4"] } },
  start: { food: { tre: 2, tao: 2 }, soap: 2, toys: ["gau-bong"] },
  say: {"feed": ["Ngon quá!", "Rộp rộp, ngon quá!", "Cảm ơn bé nhé!"],
    "wash": ["Mát quá!", "Thơm quá!", "Sạch bong rồi!"],
    "play": ["Vui quá!", "Lăn lăn nào!", "Chơi nữa nào!"],
    "sleep": ["Ngủ ngon nhé!", "Ngày mới vui vẻ!"],
    "miss": ["Trúc nhớ bé lắm!", "Bé đã về rồi!"],
    "hi": ["Chào bé!", "Trúc vui quá!"]
  }
};
