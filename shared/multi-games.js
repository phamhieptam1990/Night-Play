/* BẢNG CỜ "CHƠI CÙNG LÚC" cho MỌI game (20 Cozy + 12 Pop Play). Dùng ở trang host cozyplay/multi.html và bài đo scripts/cozygame/check-multi.js.
   Game MỚI bắt buộc khai báo một dòng ở đây (check-multi.js báo ✗ nếu thiếu) — xem GAME_RULES.md mục 5h.
   mode:
     "parallel" = chạy cùng lúc trong nhiều khung: chơi theo lượt / tự nhịp / thư giãn, KHÔNG phạt khi người chơi đang nhìn khung khác (không đồng hồ đếm ngược, không vật rơi).
     "focus"    = thời gian thực (đồng hồ đếm ngược, vật bay/rơi, nhịp, micro): chỉ MỘT khung chính chạy; khung khác đóng băng, đổi qua khay thumbnail rồi đếm 3-2-1. MẶC ĐỊNH nếu phân vân.
   realtime  : có đồng hồ/hoạt ảnh chạy theo thời gian (dùng để chọn khung nào cần đo hiệu năng).
   landH/landW: (tuỳ chọn) kích thước tối thiểu RIÊNG khi khung dạng NGANG (w > h), nếu khác minW/minH.
   minW/minH : kích thước khung (CSS px) tối thiểu để chơi được không cuộn/không cắt (đo bằng check-multi.js --measure); host không ghép khung nhỏ hơn.
   resumable : false khi game chưa lưu được ván (NP.state trả null / chưa có initialState): host KHÔNG đẩy khung này ra (LRU) vì sẽ mất ván.
   cat       : (chỉ Night Play, BẮT BUỘC cho game Cozy mới) chủ đề của chip lọc ở cozyplay/index.html: "work" Công sở | "life" Đời sống | "mind" Trí tuệ — mỗi game đúng MỘT nhóm. check-portalui.js báo ✗ nếu thiếu.
   short     : (chỉ Night Play) TÊN NGẮN một dòng hiện dưới icon trên ô game ở cổng (như Pop Play; chỉ hiện khi ô >= 88px); <= 12 ký tự. check-portalui.js bắt buộc.
   pro       : (chỉ Night Play) game có phần Night Pass (chế độ/giao diện/tính năng riêng) -> huy hiệu 👑 trên ô game ở trang cổng. Theo docs/FREE-VS-NIGHTPASS.md; check-portalui.js đối chiếu với server/pro/<id>.js.
   why       : lý do phân loại. */
(function () {
  "use strict";
  var G = {
    /* ===== COZY / Night Play ===== */
    "cozy-wings":         { portal: "cozyplay", pro: true, cat: "life", short: { vi: "Cánh Nhỏ", en: "Wings" }, icon: "🐝", vi: "Cánh Nhỏ Phiêu Lưu", en: "Little Wings", mode: "focus", realtime: true, minW: 300, minH: 380, landH: 400, resumable: true, why: "Bay né chướng ngại liên tục, 1 chạm trễ là mất mạng" },
    "dap-deadline":       { portal: "cozyplay", pro: true, cat: "work", short: { vi: "Đập Deadline", en: "Deadline" }, icon: "⏰", vi: "Đập Deadline", en: "Smash Deadline", mode: "focus", realtime: true, minW: 300, minH: 360, resumable: true, why: "Đếm ngược thời gian + combo, đập liên tục" },
    "gia-cho-viet":       { portal: "cozyplay", pro: true, cat: "life", short: { vi: "Giá Chợ", en: "Market" }, icon: "🛒", vi: "Đoán Giá Chợ Việt", en: "Guess the Market Price", mode: "parallel", realtime: false, minW: 280, minH: 320, resumable: true, why: "Đố giá theo lượt, không đồng hồ" },
    "xin-nghi":           { portal: "cozyplay", pro: true, cat: "work", short: { vi: "Xin Nghỉ", en: "Day Off" }, icon: "📝", vi: "Sếp Ơi Em Xin Nghỉ", en: "Boss, I Need a Day Off", mode: "parallel", realtime: false, minW: 280, minH: 320, resumable: true, why: "Chọn lời xin nghỉ theo lượt, không đồng hồ" },
    "doi-doi-2048":       { portal: "cozyplay", pro: true, cat: "mind", short: { vi: "Đổi Đời", en: "2048" }, icon: "🪜", vi: "Đổi Đời 2048", en: "Life Upgrade 2048", mode: "parallel", realtime: false, minW: 280, minH: 320, resumable: true, why: "Xếp ô kiểu 2048, theo lượt, tự nhịp" },
    "ga-me-ban-trung":    { portal: "cozyplay", pro: true, cat: "life", short: { vi: "Gà Mẹ", en: "Mama Hen" }, icon: "🐔", vi: "Gà Mẹ Bắn Trứng", en: "Mama Hen's Egg Pop", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "Bắn theo lượt nhưng hàng trứng bị đẩy xuống theo giờ (pushT) và có chế độ giới hạn thời gian: để nền là thua" },
    "ban-co-hieu-toi":    { portal: "cozyplay", pro: true, cat: "life", short: { vi: "Hiểu Tôi", en: "Know Me" }, icon: "💞", vi: "Bạn Có Hiểu Tôi Không?", en: "Do You Really Know Me?", mode: "parallel", realtime: false, minW: 280, minH: 320, resumable: false, why: "Đố vui theo lượt, không đồng hồ; chưa lưu được ván (NP.state = null)" },
    "cho-hang-kieu-viet": { portal: "cozyplay", pro: true, cat: "life", short: { vi: "Chở Hàng", en: "Rider" }, icon: "🛵", vi: "Chở Hàng Kiểu Việt", en: "Overloaded Rider", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "Xếp hàng lên xe có vật lý chạy liên tục" },
    "xe-ca-phe":          { portal: "cozyplay", pro: true, cat: "life", short: { vi: "Xe Cà Phê", en: "Coffee" }, icon: "☕", vi: "Xe Cà Phê Của Tôi", en: "My Coffee Cart", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "Khách chờ có đồng hồ kiên nhẫn: để nền là khách bỏ đi" },
    "duong-ray":          { portal: "cozyplay", pro: true, cat: "mind", short: { vi: "Đường Ray", en: "Rail" }, icon: "🚆", vi: "Đường Ray", en: "Rail Rush", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "Tàu chạy thật, hai tàu đâm nhau là thua" },
    "xay-cau-tre":        { portal: "cozyplay", pro: true, cat: "mind", short: { vi: "Cầu Tre", en: "Bridge" }, icon: "🎋", vi: "Xây Cầu Tre", en: "Bamboo Bridge", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "Canh nhịp thả tre, vật lý/animation liên tục" },
    "song-sot-cuoi-thang":{ portal: "cozyplay", pro: true, cat: "work", short: { vi: "Cuối Tháng", en: "Payday" }, icon: "💸", vi: "Sống Sót Đến Cuối Tháng", en: "Survive to Payday", mode: "focus", realtime: true, minW: 280, minH: 320, resumable: true, why: "Mỗi tình huống có đồng hồ đếm ngược quyết định" },
    "shipper-sieu-toc":   { portal: "cozyplay", pro: true, cat: "life", short: { vi: "Shipper", en: "Shipper" }, icon: "📦", vi: "Shipper Siêu Tốc", en: "Speedy Shipper", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "Giai đoạn chạy giao hàng thời gian thực" },
    "ne-o-ga":            { portal: "cozyplay", pro: true, cat: "life", short: { vi: "Né Ổ Gà", en: "Potholes" }, icon: "🌧️", vi: "Né Ổ Gà Mùa Mưa", en: "Dodge the Potholes", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "Chạy né chướng ngại liên tục (endless runner)" },
    "noi-mot-net":        { portal: "cozyplay", pro: true, cat: "mind", short: { vi: "Nối Nét", en: "Link" }, icon: "🔗", vi: "Nối Một Nét", en: "One Line Link", mode: "parallel", realtime: false, minW: 280, minH: 320, resumable: true, why: "Giải đố nối nét, tự nhịp, không đồng hồ" },
    "mat-tinh-khong":     { portal: "cozyplay", pro: true, cat: "mind", short: { vi: "Mắt Tinh", en: "Sharp Eyes" }, icon: "👁️", vi: "Mắt Tinh Không?", en: "Sharp Eyes?", mode: "focus", realtime: true, minW: 280, minH: 320, resumable: true, why: "Tìm ô khác màu trong thời gian giới hạn mỗi cấp" },
    "cat-banh-chung":     { portal: "cozyplay", pro: true, cat: "life", short: { vi: "Bánh Chưng", en: "Slice It" }, icon: "🔪", vi: "Cắt Bánh Chưng", en: "Slice It Even", mode: "parallel", realtime: false, minW: 280, minH: 320, resumable: true, why: "Vuốt một đường cắt, theo lượt, không đồng hồ" },
    "ve-mot-net":         { portal: "cozyplay", pro: true, cat: "mind", short: { vi: "Vẽ Nét", en: "One Stroke" }, icon: "✏️", vi: "Vẽ Một Nét", en: "One Stroke", mode: "parallel", realtime: false, minW: 280, minH: 320, resumable: true, why: "Vẽ hình theo lượt, tự nhịp, thư giãn" },
    "bao-nhieu-giay":     { portal: "cozyplay", pro: true, cat: "mind", short: { vi: "Mấy Giây", en: "Seconds" }, icon: "⏱️", vi: "Bao Nhiêu Giây?", en: "How Many Seconds?", mode: "focus", realtime: true, minW: 280, minH: 320, resumable: true, why: "Đếm giờ trong đầu, đồng hồ chạy thật khi đang chơi: cần tập trung" },
    "me-cung-truyen-tay": { portal: "cozyplay", pro: true, cat: "mind", short: { vi: "Mê Cung", en: "Maze" }, icon: "🌀", vi: "Mê Cung Truyền Tay", en: "Maze Pass-Along", mode: "parallel", realtime: false, minW: 280, minH: 320, resumable: true, why: "Mê cung theo lượt, tự nhịp" },
    /* ===== POP PLAY ===== */
    "ten-lua-cua-be":     { portal: "popplay", icon: "🚀", vi: "Tên Lửa Của Bé", en: "Baby Rocket", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "Chạy né chướng ngại, hết nhiên liệu sau ~10 giây" },
    "be-noi-dung-khong":  { portal: "popplay", icon: "🎤", vi: "Bé Nói Đúng Không?", en: "Did Baby Say It Right?", mode: "focus", realtime: false, minW: 300, minH: 340, resumable: true, why: "Dùng micro (một lúc chỉ nên một khung nghe) và giọng đọc" },
    "doan-tuoi-nao":      { portal: "popplay", icon: "🧠", vi: "Đoán Xem Bé Mấy Tuổi", en: "Guess Baby's Brain Age", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "60 giây cho 10 câu: đồng hồ đếm ngược" },
    "bo-me-5-giay":       { portal: "popplay", icon: "🖐️", vi: "Bố Mẹ Thử Thách 5 Giây", en: "Parents' 5-Second Challenge", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "Đếm ngược 5 giây mỗi thử thách" },
    "con-vat-an-so":      { portal: "popplay", icon: "🐊", vi: "Con Vật Ăn Số", en: "Number Munchers", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: false, why: "Số trôi trên màn hình liên tục; bản miễn phí không có trạng thái ván để lưu" },
    "ve-chu-quai-vat":    { portal: "popplay", icon: "🔤", vi: "Vẽ Chữ Thành Quái Vật", en: "Letter Monsters", mode: "parallel", realtime: false, minW: 300, minH: 340, resumable: true, why: "Tô chữ theo nét, tự nhịp, không đồng hồ" },
    "nhay-theo-so":       { portal: "popplay", icon: "💃", vi: "Nhảy Theo Số", en: "Dance by Numbers", mode: "focus", realtime: true, minW: 300, minH: 340, resumable: true, why: "Nhịp nhảy thời gian thực" },
    "be-dau-bo-me":       { portal: "popplay", icon: "⚔️", vi: "Bé Đấu Bố Mẹ", en: "Kid vs Parent", mode: "focus", realtime: true, minW: 360, minH: 420, resumable: false, why: "Hai người chơi chung màn hình, ai chạm trước thắng: cần khung lớn; chưa lưu được ván" },
    "qua-song":           { portal: "popplay", icon: "⛵", vi: "Qua Sông Cùng Bé", en: "River Crossing", mode: "parallel", realtime: false, minW: 300, minH: 340, resumable: true, why: "Đố qua sông theo lượt, không đồng hồ, không bao giờ thua" },
    "thap-vong-mau":      { portal: "popplay", icon: "🌈", vi: "Tháp Vòng Màu", en: "Rainbow Rings", mode: "parallel", realtime: false, minW: 300, minH: 340, resumable: true, why: "Xếp vòng theo lượt, không đồng hồ" },
    "lang-cua-be":        { portal: "popplay", icon: "🏘️", vi: "Làng Của Bé", en: "Baby's Village", mode: "parallel", realtime: false, minW: 300, minH: 340, resumable: true, why: "Đố chữ/số tự nhịp, không bao giờ thua" },
    "pop-fly":            { portal: "popplay", icon: "🐦", vi: "Chim Bay Học Vui", en: "Fly & Learn", mode: "focus", realtime: true, minW: 340, minH: 400, resumable: true, why: "Bay và nhặt chữ liên tục" }
  };
  var API = { games: G, ids: function () { return Object.keys(G); }, get: function (id) { return G[id] || null; },
    /* game thiếu cờ → tự coi là "focus" (an toàn nhất); bài đo vẫn báo ✗ để người làm khai báo */
    flag: function (id) { return G[id] || { portal: "cozyplay", icon: "🎮", vi: id, en: id, mode: "focus", realtime: true, minW: 320, minH: 360, resumable: false, why: "CHƯA KHAI BÁO CỜ (mặc định focus)" }; } };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (typeof window !== "undefined") window.NPMultiGames = API;
})();
