"use strict";
/* Mã BẢN TRẢ PHÍ của game Bạn Có Hiểu Tôi Không? (Cozy Play): 3 GÓI CÂU HỎI Night Pass (Cặp đôi 💞, Nhóm công ty 🏢, Gia đình 🏠), TỰ VIẾT CÂU HỎI (tối đa 3),
   rerolled không giới hạn, BẢNG KẾT QUẢ KHÔNG GIỚI HẠN + thống kê "câu khó nhất" + trung bình nhóm, ảnh đại diện mở rộng và 4 giao diện (Trà sữa, Đêm neon, Nhật ký giấy, Hoàng hôn)
   có bảng màu, hình nền, thẻ chia sẻ và kiểu thẻ câu hỏi riêng. Link gửi đi mang giao diện của người gửi.
   Chỉ giao cho người có Night Pass qua GET /api/pro/ban-co-hieu-toi.js (hoặc dùng thử 1 lần / vé chơi hộ), KHÔNG nằm trong thư mục công khai.
   main() chạy trong TRÌNH DUYỆT: không dùng biến ngoài hàm. PF do lõi game cung cấp. */
function main(PF, OPTS) {
  "use strict";
  PF.packs[1] = [   /* 💞 Cặp đôi */
    ["Điều mình thích nhất ở người ấy?", "What I like most about my partner?", ["Nụ cười", "Sự chu đáo", "Cách làm mình cười", "Đôi mắt"], ["Their smile", "Their thoughtfulness", "How they make me laugh", "Their eyes"]],
    ["Buổi hẹn hò mình thích nhất?", "My favourite kind of date?", ["Ăn tối ngắm đèn", "Xem phim", "Đi dạo phố", "Ở nhà nấu ăn"], ["Dinner with city lights", "A movie", "Walking around town", "Cooking at home"]],
    ["Món quà mình muốn nhận nhất?", "The gift I'd love most?", ["Thư tay", "Bó hoa", "Chuyến đi bất ngờ", "Bữa ăn nấu tại nhà"], ["A handwritten letter", "Flowers", "A surprise trip", "A home-cooked meal"]],
    ["Mình dỗi vì chuyện gì nhiều nhất?", "What makes me sulk the most?", ["Quên ngày kỷ niệm", "Trả lời tin nhắn chậm", "Hứa mà không làm", "Không khen mình"], ["Forgetting anniversaries", "Slow replies", "Broken promises", "No compliments"]],
    ["Khi dỗi mình muốn được?", "When I'm upset I want…", ["Được ôm", "Được xin lỗi", "Được ở một mình", "Được dẫn đi ăn"], ["A hug", "An apology", "To be left alone", "To be taken out to eat"]],
    ["Thói quen của người ấy khiến mình bực?", "A habit of theirs that annoys me?", ["Xả đồ khắp nhà", "Xem điện thoại lúc ăn", "Ngủ nướng", "Hay quên"], ["Leaving things around", "Phone at dinner", "Sleeping in", "Forgetfulness"]],
    ["Mình muốn cưới ở đâu?", "Where I'd want to marry?", ["Bãi biển", "Nhà thờ / chùa", "Vườn nhà", "Đăng ký rồi đi du lịch"], ["Beach", "Church / temple", "Garden", "Just register and travel"]],
    ["Ngày kỷ niệm mình mong?", "My anniversary wish?", ["Đi chơi xa", "Bữa tối sang trọng", "Ngày giản dị ở nhà", "Một bất ngờ"], ["A getaway", "A fancy dinner", "A cozy day at home", "A surprise"]],
    ["Câu nói làm mình tan chảy?", "The line that melts me?", ["“Có anh/em ở đây”", "“Cảm ơn vì tất cả”", "“Nhớ em/anh”", "“Mình về nhà nhé”"], ["“I'm here for you”", "“Thanks for everything”", "“I miss you”", "“Let's go home”"]],
    ["Chuyện nhỏ làm mình ghi điểm nhất?", "The small thing that scores points?", ["Nhớ sở thích của mình", "Mang đồ ăn tới", "Hỏi han mỗi ngày", "Đưa đón"], ["Remembering my likes", "Bringing food", "Daily check-ins", "Pick-ups"]],
    ["Khi cãi nhau mình thường?", "In a fight I usually…", ["Im lặng", "Nói to hơn", "Khóc", "Bỏ đi bình tĩnh"], ["Go quiet", "Get louder", "Cry", "Walk off to cool down"]],
    ["Kế hoạch 5 năm tới của mình?", "My 5-year plan?", ["Mua nhà", "Có em bé", "Du lịch nhiều", "Khởi nghiệp"], ["Buy a house", "Have a baby", "Travel a lot", "Start a business"]],
    ["Mình thích gọi nhau là?", "I like our nicknames to be…", ["Tên thân mật", "Tên con vật", "Anh / em", "Tên thật"], ["Cute pet names", "Animal names", "Babe / honey", "Real names"]],
    ["Bài hát “của hai đứa”?", "Our song would be…", ["Bài tình ca buồn", "Bài nhạc vui", "Nhạc không lời", "Mình chưa có"], ["A sad love song", "A cheerful song", "An instrumental", "We don't have one"]],
    ["Người ấy hay làm mình bất ngờ bằng?", "They surprise me with…", ["Đồ ăn", "Hoa", "Lời nhắn", "Chuyến đi"], ["Food", "Flowers", "Notes", "Trips"]],
    ["Điều mình sợ nhất trong tình yêu?", "My biggest fear in love?", ["Bị lạnh nhạt", "Bị dối", "Xa nhau", "Mất tự do"], ["Growing distant", "Being lied to", "Being apart", "Losing freedom"]]];
  PF.packs[2] = [   /* 🏢 Nhóm công ty */
    ["Mình hay uống gì ở văn phòng?", "What do I drink at the office?", ["Cà phê", "Trà sữa", "Nước lọc", "Nước ngọt"], ["Coffee", "Milk tea", "Water", "Soda"]],
    ["Mình đến công ty lúc?", "I arrive at work…", ["Rất sớm", "Đúng giờ", "Sát giờ", "Hơi trễ"], ["Very early", "On time", "Just in time", "A bit late"]],
    ["Mình ghét điều gì nhất trong cuộc họp?", "What I hate most in meetings?", ["Họp quá dài", "Họp mà không có kết luận", "Bị gọi tên bất ngờ", "Họp lúc cuối ngày"], ["Too long", "No conclusion", "Being called on", "End-of-day meetings"]],
    ["Giờ ăn trưa mình thích?", "My ideal lunch?", ["Cơm văn phòng", "Ăn cùng team", "Tự nấu mang đi", "Skip, uống cà phê"], ["Office rice", "With the team", "Packed lunch", "Skip it, coffee"]],
    ["Mình làm việc hiệu quả nhất vào?", "I work best…", ["Buổi sáng", "Buổi chiều", "Buổi tối", "Sát deadline"], ["In the morning", "Afternoon", "Evening", "Right before the deadline"]],
    ["Thứ không thể thiếu trên bàn làm việc?", "My must-have desk item?", ["Cốc nước", "Tai nghe", "Đồ ăn vặt", "Sổ tay"], ["A mug", "Headphones", "Snacks", "A notebook"]],
    ["Mình sợ nhất ở nơi làm việc?", "What I fear at work?", ["Deadline dồn", "Bị sếp gọi", "Máy tính hỏng", "Hết việc"], ["Deadline pile-ups", "Being called by the boss", "Computer crash", "Running out of work"]],
    ["Nếu nghỉ làm một ngày mình sẽ?", "On a day off I'd…", ["Ngủ cả ngày", "Đi du lịch ngắn", "Đi mua sắm", "Dọn nhà"], ["Sleep all day", "Take a short trip", "Go shopping", "Clean the house"]],
    ["Điều làm mình vui ở công ty?", "What makes me happy at work?", ["Đồng nghiệp vui", "Lương thưởng", "Được khen", "Giờ về"], ["Fun colleagues", "Pay and bonus", "Praise", "Going home time"]],
    ["Team building mình thích?", "My favourite team building?", ["Du lịch biển", "Trò chơi vận động", "Ăn nhậu", "Workshop học hỏi"], ["Beach trip", "Active games", "Dinner and drinks", "Workshop"]],
    ["Mình hay làm gì khi rảnh trong giờ làm?", "What I do in downtime?", ["Lướt mạng", "Trò chuyện", "Dọn email", "Nghe nhạc"], ["Browse online", "Chat", "Clear emails", "Listen to music"]],
    ["Phong cách làm việc của mình?", "My work style?", ["Lên kế hoạch kỹ", "Cứ làm rồi tính", "Hỏi ý kiến mọi người", "Làm một mình"], ["Plan carefully", "Just do it", "Ask everyone", "Work alone"]],
    ["Lý do mình hay đi trễ?", "Why am I late?", ["Kẹt xe", "Ngủ quên", "Ăn sáng", "Mình không trễ"], ["Traffic", "Overslept", "Breakfast", "I'm never late"]],
    ["Câu cửa miệng ở công ty?", "My catchphrase at work?", ["“Để mình check”", "“Gấp không?”", "“Ok em”", "“Mình đang làm”"], ["“Let me check”", "“Is it urgent?”", "“Okay”", "“Working on it”"]],
    ["Nếu làm sếp một ngày mình sẽ?", "If I were boss for a day?", ["Cho cả team nghỉ", "Tăng lương", "Họp ít lại", "Mua trà sữa cho mọi người"], ["Give everyone a day off", "Raise salaries", "Fewer meetings", "Buy bubble tea for all"]],
    ["Mình muốn công ty có thêm?", "I wish the office had…", ["Phòng ngủ trưa", "Bếp ăn", "Máy chơi game", "Cà phê miễn phí"], ["A nap room", "A kitchen", "Game console", "Free coffee"]]];
  PF.packs[3] = [   /* 🏠 Gia đình */
    ["Món mẹ nấu mình thích nhất?", "My favourite dish Mom makes?", ["Canh chua", "Thịt kho", "Cá kho", "Món chiên"], ["Sour soup", "Braised pork", "Braised fish", "Fried dishes"]],
    ["Ngày Tết mình mong?", "What I look forward to at Tet?", ["Lì xì", "Quây quần ăn cơm", "Đi chơi", "Ngủ nướng"], ["Lucky money", "Family dinner", "Going out", "Sleeping in"]],
    ["Điều mình hay bị cả nhà trêu?", "What does my family tease me about?", ["Ngủ nướng", "Ăn nhiều", "Hay quên", "Hay khóc"], ["Sleeping in", "Eating a lot", "Forgetting things", "Crying easily"]],
    ["Câu ba mẹ hay nói nhất?", "The line my parents say most?", ["“Về sớm nhé”", "“Ăn chưa?”", "“Lập gia đình đi”", "“Tiết kiệm đi”"], ["“Come home early”", "“Have you eaten?”", "“Get married”", "“Save money”"]],
    ["Kỷ niệm gia đình mình nhớ nhất?", "My best family memory?", ["Đi biển", "Bữa cơm tất niên", "Về quê", "Sinh nhật"], ["Beach trip", "Year-end dinner", "Visiting hometown", "Birthday"]],
    ["Ai trong nhà mình hay nhờ vả nhất?", "Who in the family do I ask for help most?", ["Mẹ", "Ba", "Anh chị", "Ông bà"], ["Mom", "Dad", "Siblings", "Grandparents"]],
    ["Ngày nghỉ gia đình mình hay làm?", "What our family does on days off?", ["Đi ăn", "Xem TV", "Đi chợ", "Dọn nhà"], ["Eating out", "Watching TV", "Going to the market", "Cleaning"]],
    ["Món quà mình muốn tặng ba mẹ?", "The gift I'd give my parents?", ["Chuyến du lịch", "Điện thoại mới", "Tiền", "Một bữa ăn ngon"], ["A trip", "A new phone", "Cash", "A great meal"]],
    ["Mình giống ai nhất trong nhà?", "Who do I resemble most?", ["Ba", "Mẹ", "Ông bà", "Anh chị"], ["Dad", "Mom", "Grandparent", "Sibling"]],
    ["Trò chơi cả nhà hay chơi?", "A game our family plays?", ["Bài", "Cờ", "Lô tô", "Game điện thoại"], ["Cards", "Board games", "Bingo", "Phone games"]],
    ["Điều mình biết ơn nhất ở gia đình?", "What I'm most grateful for?", ["Sự quan tâm", "Bữa cơm", "Sự ủng hộ", "Tiếng cười"], ["The care", "The meals", "The support", "The laughter"]],
    ["Mình hay gọi về nhà khi?", "I call home when…", ["Nhớ nhà", "Cần tiền", "Có tin vui", "Buồn"], ["I miss home", "I need money", "Good news", "I'm sad"]],
    ["Nếu cả nhà đi du lịch mình chọn?", "If we all travel I'd choose…", ["Biển", "Núi", "Thành phố", "Về quê"], ["Beach", "Mountains", "City", "Hometown"]],
    ["Điều mình hay quên khi về nhà?", "What I forget when visiting?", ["Mang quà", "Gọi trước", "Dọn phòng", "Mang chìa khoá"], ["Bringing gifts", "Calling ahead", "Tidying up", "Keys"]],
    ["Mình sợ nhất khi về nhà?", "What I dread when going home?", ["Bị hỏi chuyện chồng/vợ", "Bị hỏi lương", "Bị so sánh", "Chẳng sợ gì"], ["Marriage questions", "Salary questions", "Comparisons", "Nothing"]],
    ["Cả nhà mình giống nhất ở?", "What our family has in common?", ["Thích ăn", "Hay cười", "Hay lo", "Ngủ sớm"], ["Love of food", "Laughing", "Worrying", "Early bedtime"]]];
  PF.custom = true; PF.unlimited = true;
  const v = (h) => ({
    vl: { "--pbg": "linear-gradient(hsl(" + h + " 75% 90%),hsl(" + h + " 60% 97%))", "--panel": "#ffffff", "--ink": "hsl(" + h + " 45% 14%)", "--muted": "hsl(" + h + " 20% 40%)", "--accent": "hsl(" + h + " 85% 38%)", "--on": "#ffffff", "--line": "hsl(" + h + " 40% 80%)", "--field": "hsl(" + h + " 70% 95%)", "--field2": "hsl(" + h + " 55% 86%)" },
    vd: { "--pbg": "linear-gradient(hsl(" + h + " 45% 17%),hsl(" + h + " 55% 7%))", "--panel": "hsl(" + h + " 32% 22%)", "--ink": "#ffffff", "--muted": "hsl(" + h + " 25% 72%)", "--accent": "hsl(" + h + " 95% 62%)", "--on": "hsl(" + h + " 60% 10%)", "--line": "hsl(" + h + " 30% 34%)", "--field": "hsl(" + h + " 35% 15%)", "--field2": "hsl(" + h + " 40% 24%)" }
  });
  const S = {
    boba: { h: 335, deco: ["🧋", "🫧", "💗", "🍓"], hero: "🧋💬", cg: ["#ff9ec7", "#c75aa0"], css: ".qcard{border-radius:9cqw;border:.7cqw dashed #ff7ab5}.opt{border-radius:99cqw}.opt i{background:#ff7ab5;color:#fff}" },
    neon: { h: 285, deco: ["⚡", "💠", "🌃", "🔮"], hero: "🌃💬", cg: ["#2a0a5a", "#ff2fd0"], css: ".qcard{border:.5cqw solid #35f0ff;box-shadow:0 0 4cqw rgba(53,240,255,.5)}.opt{border-color:#7a5cff;box-shadow:0 0 2cqw rgba(122,92,255,.4)}.qt{text-shadow:0 0 2cqw #35f0ff}" },
    kraft: { h: 30, deco: ["📔", "✏️", "📎", "🔖"], hero: "📔✏️", cg: ["#c9a26a", "#7a5a30"], css: ".qcard{border-radius:1.5cqw;background-image:repeating-linear-gradient(transparent 0 6.2cqw,rgba(120,80,30,.18) 6.2cqw 6.5cqw)}.qt,.opt{font-family:'Comic Sans MS','Bradley Hand',cursive}.opt{border-radius:1.5cqw;border-style:dashed}" },
    sunset: { h: 18, deco: ["🌅", "🌇", "🕊️", "☁️"], hero: "🌅💬", cg: ["#ff8a4a", "#7a3a9a"], css: ".qcard{background:linear-gradient(135deg,color-mix(in srgb,#ff9a4a 22%,var(--panel)),color-mix(in srgb,#a05ad0 22%,var(--panel)))}.opt{border-radius:5cqw}" }
  };
  for (const id in S) { const d = S[id], b = v(d.h); PF.skins[id] = { vl: b.vl, vd: b.vd, deco: d.deco, hero: d.hero, cg: d.cg, css: d.css }; }
  PF.pro = { trial: !!OPTS.trial };
}
exports.source = function (opts) { return "(" + main.toString() + ")(PF," + JSON.stringify({ trial: !!(opts && opts.trial) }) + ");"; };
