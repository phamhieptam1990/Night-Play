/* DỮ LIỆU THẾ GIỚI của Bi (cún): khu nhà, đồ ăn/đồ chơi/trang phục, cấp tình cảm, mini-game. Game thuần chơi, không dạy học.
   Muốn thú khác: đổi tệp dữ liệu + tranh, không sửa logic. Tranh: ../../../shared/art/nuoi-thu/<tệp>.svg */
window.NTV_DATA = {
  key: "ntv:world", id: "cun",
  pet: { name: "Bi", kind: "cún", art: "cun", scaleByLevel: [.9, .96, 1.02, 1.08, 1.14],
    levels: [["Cún con", 0], ["Cún nhí", 30], ["Cún ngoan", 80], ["Cún thông minh", 160], ["Cún cưng", 300]] },
  foods: [["xuong", "xương"], ["ca", "cá"], ["tao", "táo"], ["sua", "sữa"]],
  toys: [["bong", "quả bóng", 1], ["vit-cao-su", "vịt cao su", 0], ["xe", "xe đồ chơi", 0], ["gau-bong", "gấu bông", 0], ["dia-bay", "đĩa bay", 0]],
  /* khu của ngôi nhà: [id khu, việc chăm (care), tranh biểu tượng, cấp mở khoá (theo tình cảm)] */
  zones: [["living", "play", "ghe-sofa", 0], ["kitchen", "feed", "tu-lanh", 0], ["bath", "bath", "bon-tam", 0], ["bedroom", "sleep", "giuong-cun", 1], ["yard", "yard", "cay", 1]],
  /* trang phục Bi: [tranh, cấp mở khoá, tên] */
  outfits: [["do-no", 1, "nơ"], ["mu-sinh-nhat", 2, "mũ"], ["kinh", 3, "kính"], ["vuong-mien", 4, "vương miện"]],
    start: { food: { xuong: 2, tao: 2 }, soap: 2, toys: ["bong"] },
  /* mini-game: ngưỡng điểm cho từng bậc quà, khu chứa, số giây; perDay = số ván/ngày còn nhận đồ (sau đó vẫn chơi lấy sao) */
  mg: { stars: { th: [5, 10, 16, 22], zone: "yard", secs: 30 }, ball: { th: [8, 14, 20, 28], zone: "living", secs: 30 }, perDay: 6 },
  say: { feed: ["Ngon quá!", "Ăm ăm, ngon quá!", "Cảm ơn bé nhé!"], wash: ["Mát quá!", "Thơm quá!", "Sạch bong rồi!"], play: ["Vui quá!", "Chơi nữa nào!", "Gâu gâu!"],
    sleep: ["Ngủ ngon nhé!", "Ngày mới vui vẻ!"], miss: ["Bi nhớ bé lắm!", "Bé đã về rồi!"], hi: ["Chào bé!", "Bi vui quá!"] }
};
