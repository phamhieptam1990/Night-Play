/* KỸ NĂNG TIẾNG VIỆT + TIẾNG ANH lớp 1–5 (thuần, không chạm DOM; chạy được trong trình duyệt và Node).
   Nạp trước engine.js; engine gọi LearnLangSkills(ctx) để đăng ký bộ sinh câu, kỹ năng, chủ đề chương trình, nhãn, mã lỗi.
   Nguyên tắc: dữ liệu CHUẨN, ngắn, KHÔNG nhập nhằng (mỗi câu đúng MỘT đáp án; đáp án nhiễu không thể cũng đúng);
   đáp án luôn do dữ liệu/luật quyết định, không do người sinh ngẫu nhiên. Kiểm bằng scripts/learn/check-lang.js (tự đối chiếu luật độc lập).
   Dữ liệu và luật xuất ở LearnLangSkills.DATA để bài kiểm dùng. */
(function (root) {
  "use strict";
  var D = {};   /* dữ liệu, xuất cho bài kiểm */

  /* ====================== TIẾNG VIỆT ====================== */
  /* chữ cái đầu: [hình, từ, chữ cái đầu]; không dùng từ có dấu thanh ở chữ đầu hay vần đôi ở đầu */
  D.letterStart = [["🐱", "mèo", "m"], ["🐟", "cá", "c"], ["🐔", "gà", "g"], ["🐘", "voi", "v"], ["🦁", "sư tử", "s"], ["🍎", "táo", "t"], ["🚗", "xe", "x"], ["🌸", "hoa", "h"], ["🐝", "ong", "o"], ["🎈", "bóng", "b"],
    ["🍊", "cam", "c"], ["🥛", "sữa", "s"], ["🍞", "bánh", "b"], ["🐮", "bò", "b"], ["🦆", "vịt", "v"], ["⭐", "sao", "s"], ["🥕", "cà rốt", "c"], ["🍚", "cơm", "c"], ["🐢", "rùa", "r"], ["🥬", "rau", "r"],
    ["🦷", "răng", "r"], ["🐻", "gấu", "g"], ["🐜", "kiến", "k"], ["🍜", "mì", "m"], ["🍑", "đào", "đ"], ["🥥", "dừa", "d"], ["🧅", "hành", "h"], ["🍬", "kẹo", "k"], ["🪁", "diều", "d"], ["🐺", "sói", "s"], ["🦊", "cáo", "c"], ["🦉", "cú", "c"], ["🌹", "hồng", "h"], ["🍅", "cà chua", "c"], ["🧄", "tỏi", "t"], ["📓", "vở", "v"], ["🎒", "cặp", "c"], ["🚲", "xe đạp", "x"], ["✏️", "bút", "b"], ["🐍", "rắn", "r"], ["🔥", "lửa", "l"], ["🍃", "lá", "l"], ["🦒", "hươu cao cổ", "h"], ["🦋", "bướm", "b"], ["🌳", "cây", "c"], ["🦀", "cua", "c"], ["🍉", "dưa hấu", "d"], ["🍓", "dâu", "d"],
    ["🦗", "dế", "d"], ["🔪", "dao", "d"], ["☂️", "dù", "d"], ["🐐", "dê", "d"], ["🩴", "dép", "d"], ["🎀", "nơ", "n"], ["🍄", "nấm", "n"], ["🕯️", "nến", "n"], ["💧", "nước", "n"], ["🐚", "sò", "s"], ["🥭", "xoài", "x"], ["🦴", "xương", "x"]];
  D.letters = "a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y".split(" ");
  /* ghép vần: phụ âm + nguyên âm đơn = tiếng đọc được; bảng nguyên âm hợp lệ theo phụ âm (c đi với a o ô ơ u ư; k với e ê i) */
  D.vowelsOf = { b: "a e ê i o ô ơ u", m: "a e ê i o ô ơ u", n: "a e ê i o ô ơ u ư", l: "a e ê i o ô ơ u ư", t: "a e ê i o ô ơ u ư", d: "a e ê i o ô ơ u ư", "đ": "a e ê i o ô ơ u", h: "a e ê i o ô ơ u ư", v: "a e ê i o ô ơ u", x: "a e ê i o ô ơ u", s: "a e ê i o ô ơ u ư", c: "a o ô ơ u ư", k: "e ê i" };
  D.tones = [["dấu sắc", "́"], ["dấu huyền", "̀"], ["dấu hỏi", "̉"], ["dấu ngã", "̃"], ["dấu nặng", "̣"]];
  /* ng/ngh, g/gh, c/k: quy tắc = trước e, ê, i viết ngh, gh, k; còn lại viết ng, g, c.
     Mỗi mục = [chữ cần điền, phần còn lại của từ, câu ngữ cảnh có "__"]; CÂU NGỮ CẢNH bắt buộc để chỉ có MỘT cách điền hợp nghĩa
     (không có câu thì "ngọt/gọt", "nghe/ghe" đều là từ có thật). */
  D.nghItems = [
    ["ng", "ã", "Em bị __ã đau chân."], ["ng", "ày", "Hôm nay là __ày thứ Hai."], ["ng", "ủ", "Bé __ủ trưa trên giường."], ["ng", "ô", "Mẹ luộc bắp __ô cho em."], ["ng", "on", "Bát canh này rất __on."], ["ng", "ọt", "Quả cam này rất __ọt."],
    ["ng", "ựa", "Con __ựa chạy rất nhanh."], ["ng", "ười", "Cô giáo là một __ười tốt."], ["ng", "ón", "Em có mười __ón tay."], ["ng", "õ", "Nhà em ở trong một __õ nhỏ."], ["ng", "ỗng", "Con __ỗng bơi trên ao."], ["ng", "ang", "Em đi __ang qua sân trường."], ["ng", "ôi", "Em ở trong một __ôi nhà nhỏ."],
    ["ngh", "e", "Em __e cô giảng bài."], ["ngh", "é", "Con __é đang ăn cỏ."], ["ngh", "ỉ", "Giờ ra chơi em được __ỉ."], ["ngh", "ĩ", "Em __ĩ ra cách giải bài toán."], ["ngh", "ề", "Bố em làm __ề nông."], ["ngh", "ệ", "Bà dùng củ __ệ nấu ăn."], ["ngh", "iêng", "Cây cột bị __iêng."], ["ngh", "ịch", "Bé hay __ịch ngợm."],
    ["g", "à", "Con __à gáy ò ó o."], ["g", "ỗ", "Cái bàn làm bằng __ỗ."], ["g", "ạo", "Mẹ nấu cơm bằng __ạo."], ["g", "ấu", "Con __ấu thích ăn mật ong."], ["g", "ốc", "Chim đậu trên __ốc cây."], ["g", "ạch", "Ngôi nhà xây bằng __ạch."], ["g", "ối", "Em ôm __ối ngủ."], ["g", "ửi", "Em __ửi thư cho bà."], ["g", "ần", "Nhà em ở __ần trường."], ["g", "ói", "Mẹ __ói quà tặng bạn."],
    ["gh", "ế", "Em ngồi trên __ế."], ["gh", "i", "Em __i tên vào vở."], ["gh", "é", "Em __é thăm bà."], ["gh", "ẹ", "Mẹ mua con __ẹ ở chợ."], ["gh", "en", "Em không __en tị với bạn."], ["gh", "ét", "Em không __ét bạn."],
    ["k", "ẻ", "Em __ẻ đường thẳng bằng thước."], ["k", "ể", "Bà __ể chuyện cho em nghe."], ["k", "ì", "Chúc bạn một __ì nghỉ vui vẻ."], ["k", "éo", "Em dùng __éo cắt giấy."], ["k", "em", "Em thích ăn __em lạnh."], ["k", "iến", "Con __iến bò trên cành cây."], ["k", "ệ", "Cuốn sách để trên __ệ sách."],
    ["c", "á", "Con __á bơi trong nước."], ["c", "ô", "Em chào __ô giáo."], ["c", "ây", "Trong vườn có nhiều __ây."], ["c", "ửa", "Em đóng __ửa lớp."], ["c", "on", "Mèo là một __on vật."], ["c", "ơm", "Em ăn __ơm với canh."], ["c", "ủa", "Đây là sách __ủa em."]
  ];
  /* chính tả phụ âm đầu có hình minh hoạ (hình chỉ khớp đúng MỘT từ); nhóm: sx, dgr, ln */
  D.initWords = {
    sx: { s: [["⭐", "sao"], ["🦁", "sư tử"], ["📖", "sách"], ["🥛", "sữa"], ["🌊", "sóng"], ["🪷", "sen"], ["🐚", "sò"], ["🐛", "sâu"]], x: [["🚗", "xe"], ["🚂", "xe lửa"],["🥭", "xoài"], ["🦴", "xương"], ["🪣", "xô"], ["🛶", "xuồng"], ["🌭", "xúc xích"]], extra: ["ch", "tr"] },
    dgr: { d: [["🍉", "dưa hấu"], ["🍓", "dâu"], ["🦗", "dế"], ["🔪", "dao"], ["☂️", "dù"], ["🐐", "dê"], ["🩴", "dép"], ["🦇", "dơi"]], gi: [["👟", "giày"], ["🛏️", "giường"], ["💨", "gió"], ["🧺", "giỏ"], ["📄", "giấy"]], r: [["🥬", "rau"], ["🐢", "rùa"], ["🐍", "rắn"], ["🐉", "rồng"], ["🦷", "răng"], ["🪰", "ruồi"], ["🌲", "rừng"]], extra: ["g", "gh"] },
    ln: { l: [["🍃", "lá"], ["🔥", "lửa"], ["🌾", "lúa"], ["👅", "lưỡi"], ["🍐", "lê"], ["🏮", "lồng đèn"], ["🐷", "lợn"]], n: [["💧", "nước"], ["🕯️", "nến"], ["🎀", "nơ"], ["🍄", "nấm"], ["👒", "nón"], ["🍲", "nồi"]], extra: ["nh", "ng"] }
  };
  D.things = ["bàn", "ghế", "sách", "mèo", "hoa", "trường", "bút", "mẹ", "sông", "trăng", "nhà", "cây", "xe", "cặp", "thước"];
  D.actions = ["chạy", "nhảy", "đọc", "viết", "hát", "ăn", "ngủ", "bơi", "vẽ", "múa", "khóc", "cười", "học", "đi"];
  D.traits = ["đẹp", "cao", "to", "nhỏ", "xanh", "nhanh", "chậm", "thơm", "ngọt", "sạch", "dài", "ngắn", "nóng", "lạnh", "đỏ", "tròn"];
  /* câu: k = kể, h = hỏi, c = cảm, y = khiến */
  D.sentences = [
    ["Bé đi học", "k"], ["Mẹ nấu cơm", "k"], ["Trời hôm nay nắng đẹp", "k"], ["Con mèo nằm trên ghế", "k"], ["Em đang đọc sách", "k"], ["Bố đi làm về", "k"], ["Chim hót trên cành cây", "k"],
    ["Bạn tên là gì", "h"], ["Con đang làm gì đấy", "h"], ["Mẹ đi đâu rồi", "h"], ["Sao bạn lại buồn", "h"], ["Bạn có thích đá bóng không", "h"], ["Ai đang gõ cửa vậy", "h"], ["Bao giờ lớp mình đi dã ngoại", "h"],
    ["Ôi, bông hoa đẹp quá", "c"], ["Chao ôi, trời lạnh thật", "c"], ["Hoan hô, đội mình thắng rồi", "c"], ["Ôi, đau quá", "c"], ["Chà, bài toán khó thật", "c"],
    ["Con hãy đóng cửa lại", "y"], ["Các em hãy im lặng", "y"], ["Hãy giúp mẹ rửa chén", "y"], ["Đừng chạy trong lớp", "y"], ["Bạn hãy cho mình mượn bút", "y"],
    ["Chiều nay em đi chơi với bạn", "k"], ["Ông em trồng rất nhiều hoa", "k"], ["Cô giáo đang viết bảng", "k"], ["Mùa xuân, cây cối đâm chồi nảy lộc", "k"], ["Bà em sống ở quê", "k"], ["Chú mèo đang bắt chuột", "k"],
    ["Ai đã vẽ bức tranh này", "h"], ["Bạn đang đọc quyển sách gì", "h"], ["Em có thích môn Toán không", "h"], ["Nhà bạn ở đâu", "h"], ["Bao nhiêu bạn học sinh trong lớp", "h"],
    ["Ôi, con diều bay cao quá", "c"], ["Chà, món canh thơm quá", "c"], ["Hoan hô, em được điểm mười", "c"], ["Ôi, bạn nhảy giỏi thật", "c"],
    ["Các em hãy xếp hàng ngay ngắn", "y"], ["Đừng xả rác ra sân trường", "y"], ["Con hãy đánh răng trước khi ngủ", "y"], ["Bạn hãy giúp mình nhặt bút", "y"]
  ];
  D.commaItems = [["Mẹ mua cam", "táo và chuối"], ["Hôm nay", "em đi học"], ["Lan", "Mai và Hoa là bạn thân"], ["Trong vườn có hoa hồng", "hoa cúc và hoa lan"], ["Sáng nay", "trời có nắng"], ["Em thích đọc truyện", "xem phim hoạt hình và chơi cờ"]];
  D.synonyms = [
    { w: "to", s: ["lớn"], d: ["nhỏ", "thấp", "chậm", "ngắn"] }, { w: "xinh", s: ["đẹp"], d: ["xấu", "già", "nhỏ", "buồn"] }, { w: "nhỏ", s: ["bé"], d: ["to", "cao", "dài", "nặng"] },
    { w: "học sinh", s: ["học trò"], d: ["giáo viên", "bác sĩ", "thợ may", "ca sĩ"] }, { w: "mẹ", s: ["má"], d: ["bố", "anh", "chị", "cô"] }, { w: "bố", s: ["ba", "cha"], d: ["mẹ", "anh", "chị", "em"] },
    { w: "heo", s: ["lợn"], d: ["gà", "vịt", "bò", "dê"] }, { w: "siêng năng", s: ["chăm chỉ", "cần cù"], d: ["lười biếng", "nhút nhát", "vội vàng", "tức giận"] }, { w: "mênh mông", s: ["bao la", "rộng lớn"], d: ["chật hẹp", "nhỏ bé", "ngắn ngủi", "sâu thẳm"] },
    { w: "bắt đầu", s: ["khởi đầu"], d: ["kết thúc", "chấm dứt", "dừng lại", "tạm nghỉ"] }, { w: "quả", s: ["trái"], d: ["hoa", "lá", "cành", "rễ"] }, { w: "xe hơi", s: ["ô tô"], d: ["xe đạp", "máy bay", "tàu thủy", "xe buýt"] },
    { w: "thầy giáo", s: ["giáo viên"], d: ["học sinh", "bác sĩ", "công an", "ca sĩ"] }, { w: "đẹp", s: ["xinh"], d: ["xấu", "buồn", "dữ", "thấp"] }, { w: "chăm chỉ", s: ["siêng năng", "cần cù"], d: ["lười biếng", "nhút nhát", "hay quên", "vội vàng"] },
    { w: "bác sĩ", s: ["thầy thuốc"], d: ["giáo viên", "nông dân", "thợ may", "ca sĩ"] }, { w: "má", s: ["mẹ"], d: ["bố", "anh", "chị", "cô"] }, { w: "dũng cảm", s: ["can đảm", "gan dạ"], d: ["nhút nhát", "sợ hãi", "lười biếng", "vội vàng"] },
    { w: "cẩn thận", s: ["thận trọng"], d: ["cẩu thả", "vội vàng", "lười biếng", "nhút nhát"] }, { w: "trung thực", s: ["thật thà"], d: ["gian dối", "lười biếng", "tham lam", "nhút nhát"] }
  ];
  /* trái nghĩa: c = cụm nghĩa (cùng cụm thì không lấy làm đáp án nhiễu cho nhau) */
  D.antonyms = [["to", "nhỏ", "sz"], ["cao", "thấp", "sz"], ["dài", "ngắn", "sz"], ["rộng", "hẹp", "sz"], ["dày", "mỏng", "sz"], ["nhanh", "chậm", "sp"], ["nóng", "lạnh", "tp"], ["sáng", "tối", "li"], ["vui", "buồn", "em"], ["mới", "cũ", "ag"],
    ["ngày", "đêm", "tm"], ["trên", "dưới", "dr"], ["đúng", "sai", "ok"], ["yêu", "ghét", "em"], ["khóc", "cười", "em"], ["đóng", "mở", "ac"], ["vào", "ra", "dr"], ["lên", "xuống", "dr"], ["thật", "giả", "ok"], ["sạch", "bẩn", "cl"],
    ["giàu", "nghèo", "mo"], ["nặng", "nhẹ", "wt"], ["trẻ", "già", "ag"], ["khỏe", "yếu", "st"], ["ngon", "dở", "ts"],
    ["sớm", "muộn", "tm2"], ["gần", "xa", "ds"], ["thẳng", "cong", "sh"], ["ướt", "khô", "wt2"], ["đầy", "rỗng", "fl"], ["mềm", "cứng", "hd"], ["hiền", "dữ", "tp2"], ["chăm", "lười", "di"], ["khen", "chê", "pr"], ["thắng", "thua", "wl"], ["trước", "sau", "ba"]];
  D.idioms = [["Có công mài sắt, có ngày nên", "kim"], ["Uống nước nhớ", "nguồn"], ["Ăn quả nhớ kẻ trồng", "cây"], ["Gần mực thì đen, gần đèn thì", "rạng"], ["Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi", "cao"], ["Lá lành đùm lá", "rách"],
    ["Học thầy không tày học", "bạn"], ["Đi một ngày đàng, học một sàng", "khôn"], ["Chị ngã em", "nâng"], ["Thương người như thể thương", "thân"], ["Ăn cây nào rào cây", "nấy"], ["Tốt gỗ hơn tốt", "nước sơn"],
    ["Có chí thì", "nên"], ["Ở hiền gặp", "lành"], ["Tay làm hàm", "nhai"], ["Một con ngựa đau, cả tàu bỏ", "cỏ"], ["Chim có tổ, người có", "tông"], ["Cái nết đánh chết cái", "đẹp"], ["Gieo gió gặt", "bão"], ["Kiến tha lâu cũng", "đầy"], ["Mưa dầm thấm", "lâu"], ["Nước chảy đá", "mòn"], ["Tre già măng", "mọc"], ["Cây ngay không sợ chết", "đứng"]];
  D.manners = [
    ["Em gặp cô giáo vào buổi sáng. Em nói:", "Em chào cô ạ!", ["Em xin lỗi ạ!", "Tạm biệt cô nhé!", "Em cảm ơn ạ!"]], ["Bạn tặng em một món quà. Em nói:", "Em cảm ơn bạn!", ["Em xin lỗi bạn!", "Chào buổi sáng!", "Tạm biệt bạn!"]],
    ["Em lỡ làm đổ nước của bạn. Em nói:", "Mình xin lỗi bạn!", ["Mình cảm ơn bạn!", "Chào bạn nhé!", "Hoan hô bạn!"]], ["Em muốn mượn bút của bạn. Em nói:", "Cho mình mượn bút nhé?", ["Mình cảm ơn bạn!", "Mình xin lỗi bạn!", "Tạm biệt bạn nhé!"]],
    ["Bạn bị ngã. Em hỏi:", "Bạn có đau không?", ["Bạn ăn cơm chưa?", "Chúc mừng sinh nhật!", "Tạm biệt bạn nhé!"]], ["Hôm nay là sinh nhật bạn. Em nói:", "Chúc mừng sinh nhật!", ["Em xin lỗi ạ!", "Tạm biệt nhé!", "Chào buổi sáng!"]],
    ["Mẹ nấu cơm xong, mời cả nhà. Em nói:", "Mời cả nhà ăn cơm ạ!", ["Em xin lỗi cả nhà!", "Tạm biệt cả nhà!", "Chúc ngủ ngon!"]], ["Em được cô giáo khen. Em nói:", "Em cảm ơn cô ạ!", ["Em xin lỗi cô ạ!", "Em chào cô ạ!", "Tạm biệt cô ạ!"]],
    ["Đến giờ đi ngủ, em chúc bố mẹ:", "Chúc bố mẹ ngủ ngon!", ["Chúc mừng sinh nhật!", "Chào buổi sáng!", "Em xin lỗi ạ!"]],
    ["Em muốn ra ngoài trong giờ học. Em nói:", "Em xin phép cô ạ!", ["Em cảm ơn cô ạ!", "Em chào cô ạ!", "Tạm biệt cô ạ!"]], ["Bạn giúp em nhặt cặp sách. Em nói:", "Cảm ơn bạn nhiều nhé!", ["Xin lỗi bạn nhé!", "Chào bạn nhé!", "Tạm biệt bạn nhé!"]],
    ["Em đến nhà bạn chơi và gặp mẹ bạn. Em nói:", "Cháu chào cô ạ!", ["Cháu xin lỗi cô ạ!", "Cháu cảm ơn cô ạ!", "Cháu tạm biệt cô!"]], ["Em lỡ giẫm vào chân bạn. Em nói:", "Xin lỗi bạn nhé!", ["Chúc mừng bạn nhé!", "Cảm ơn bạn nhé!", "Chào bạn nhé!"]],
    ["Cô giáo ốm, em đến thăm cô. Em nói:", "Cô mau khỏe nhé ạ!", ["Chúc mừng sinh nhật cô!", "Em xin lỗi cô ạ!", "Tạm biệt cô ạ!"]], ["Em được bố mẹ cho quà. Em nói:", "Con cảm ơn bố mẹ ạ!", ["Con xin lỗi bố mẹ ạ!", "Con chào bố mẹ ạ!", "Con tạm biệt bố mẹ!"]]
  ];
  /* đọc hiểu: g = các lớp, t = đoạn, q = câu hỏi, a = đáp án (có TRONG đoạn), d = 3 đáp án nhiễu (KHÔNG có nghĩa đúng) */
  D.readVi = [
    { g: [1], t: "Bé Lan có một con mèo. Con mèo tên là Mun.", q: "Con mèo tên là gì?", a: "Mun", d: ["Lan", "Mít", "Bông"] },
    { g: [1], t: "Sáng nay mẹ đưa bé đi học. Bé đi bằng xe đạp.", q: "Bé đi học bằng gì?", a: "xe đạp", d: ["xe buýt", "ô tô", "xe máy"] },
    { g: [1, 2], t: "Trên cành cây có hai chú chim. Chúng hót rất vui.", q: "Trên cành có mấy chú chim?", a: "hai", d: ["một", "ba", "bốn"] },
    { g: [1], t: "Bố mua cho Nam một quả bóng đỏ.", q: "Quả bóng có màu gì?", a: "đỏ", d: ["xanh", "vàng", "trắng"] },
    { g: [2], t: "Chủ nhật, cả nhà em về quê thăm bà. Bà trồng rất nhiều rau và hoa trong vườn.", q: "Cả nhà về quê thăm ai?", a: "bà", d: ["ông", "cô", "dì"] },
    { g: [2], t: "Mai nuôi một chú cá nhỏ trong chiếc bình thủy tinh. Mỗi sáng, Mai cho cá ăn.", q: "Mỗi sáng Mai làm gì?", a: "cho cá ăn", d: ["tưới cây", "quét nhà", "đọc sách"] },
    { g: [2, 3], t: "Trời mưa to. Hà quên mang áo mưa nên bạn Tú cho Hà đi chung ô.", q: "Ai cho Hà đi chung ô?", a: "bạn Tú", d: ["mẹ", "cô giáo", "bạn Mai"] },
    { g: [3], t: "Con ong chăm chỉ bay từ hoa này sang hoa khác để hút mật. Nhờ vậy, những bông hoa được thụ phấn và kết thành quả.", q: "Ong bay từ hoa này sang hoa khác để làm gì?", a: "hút mật", d: ["bắt sâu", "làm tổ", "tìm nước"] },
    { g: [3], t: "Lớp em trồng một cây xanh ở sân trường. Mỗi ngày, các bạn thay phiên nhau tưới nước cho cây.", q: "Cây xanh được trồng ở đâu?", a: "sân trường", d: ["vườn nhà", "công viên", "trước cổng"] },
    { g: [4], t: "Mùa thu, bầu trời trong xanh và gió se lạnh. Lá vàng rơi đầy trên con đường làng. Các em nhỏ háo hức chuẩn bị đón Tết Trung thu.", q: "Các em nhỏ chuẩn bị đón dịp nào?", a: "Tết Trung thu", d: ["Tết Nguyên đán", "Giáng sinh", "ngày khai giảng"] },
    { g: [4], t: "Bác nông dân dậy từ sáng sớm để ra đồng cấy lúa. Dù nắng gắt, bác vẫn miệt mài làm việc đến khi mặt trời lặn.", q: "Bác nông dân làm việc đến khi nào?", a: "mặt trời lặn", d: ["trời sáng", "buổi trưa", "nửa đêm"] },
    { g: [5], t: "Thư viện trường em mở cửa từ bảy giờ ba mươi đến mười một giờ ba mươi mỗi buổi sáng. Học sinh được mượn tối đa hai cuốn sách trong một tuần.", q: "Mỗi học sinh được mượn tối đa mấy cuốn sách?", a: "hai cuốn", d: ["một cuốn", "ba cuốn", "năm cuốn"] },
    { g: [5], t: "Hà Nội là thủ đô của Việt Nam. Thành phố nổi tiếng với Hồ Gươm, Văn Miếu và những con phố cổ.", q: "Thành phố nào là thủ đô của Việt Nam?", a: "Hà Nội", d: ["Huế", "Đà Nẵng", "Cần Thơ"] },
    { g: [1], t: "Mẹ cho em một cái bánh. Em chia cho em gái một nửa.", q: "Em chia bánh cho ai?", a: "em gái", d: ["bố", "bà", "cô giáo"] },
    { g: [1], t: "Hôm nay trời mưa. Em mặc áo mưa đi học.", q: "Hôm nay trời thế nào?", a: "mưa", d: ["nắng", "gió to", "tuyết"] },
    { g: [1, 2], t: "Con chó nhà Nam tên là Vàng. Vàng rất thích chơi bóng.", q: "Con chó thích gì?", a: "chơi bóng", d: ["ăn cá", "ngủ", "bơi lội"] },
    { g: [2], t: "Sáng thứ Bảy, Lan cùng bố ra chợ mua cá. Bố chọn một con cá chép to.", q: "Bố chọn mua con gì?", a: "cá chép", d: ["cá thu", "con tôm", "con cua"] },
    { g: [2], t: "Ở sân trường có một cây phượng. Mùa hè, hoa phượng nở đỏ rực.", q: "Hoa phượng nở vào mùa nào?", a: "mùa hè", d: ["mùa đông", "mùa thu", "mùa xuân"] },
    { g: [2], t: "Bé Na đang vẽ tranh. Bé vẽ một ngôi nhà, một cái cây và một chú chim.", q: "Bé Na đang làm gì?", a: "vẽ tranh", d: ["đọc sách", "hát", "nấu ăn"] },
    { g: [3], t: "Giờ ra chơi, các bạn nam đá bóng ở sân. Các bạn nữ nhảy dây dưới gốc cây.", q: "Các bạn nữ chơi trò gì?", a: "nhảy dây", d: ["đá bóng", "đuổi bắt", "cờ vua"] },
    { g: [3], t: "Bà ngoại em sống ở quê. Mỗi dịp hè, em về quê giúp bà cho gà ăn.", q: "Em giúp bà việc gì?", a: "cho gà ăn", d: ["quét nhà", "nấu cơm", "rửa bát"] },
    { g: [3], t: "Trường em có một thư viện nhỏ. Mỗi tuần, lớp em đến thư viện một lần để đọc sách.", q: "Lớp em đến thư viện mấy lần mỗi tuần?", a: "một lần", d: ["hai lần", "ba lần", "mỗi ngày"] },
    { g: [4], t: "Sông Hồng chảy qua Hà Nội. Nước sông mùa lũ đỏ phù sa, mùa cạn thì trong hơn.", q: "Nước sông mùa lũ đỏ vì có gì?", a: "phù sa", d: ["rác thải", "hoa đỏ", "sơn đỏ"] },
    { g: [4], t: "Chú ong thợ làm việc suốt ngày. Chú bay đi tìm mật hoa rồi mang về tổ để làm mật ong.", q: "Ong thợ mang gì về tổ?", a: "mật hoa", d: ["lá cây", "nước mưa", "hạt thóc"] },
    { g: [5], t: "Biển Việt Nam dài hơn ba nghìn cây số. Nhiều bãi biển đẹp thu hút khách du lịch mỗi năm.", q: "Điều gì thu hút khách du lịch?", a: "bãi biển đẹp", d: ["núi cao", "sa mạc", "tuyết trắng"] },
    { g: [5], t: "Nhờ chăm chỉ luyện tập, Minh đã đạt giải nhất cuộc thi chạy của trường. Minh nói đó là kết quả của nhiều buổi tập sáng sớm.", q: "Minh đạt giải nhờ điều gì?", a: "chăm chỉ luyện tập", d: ["may mắn", "đi học muộn", "nghỉ ngơi nhiều"] },
    {g: [1], t: "Nhà em có một cái ao. Trong ao có nhiều cá.", q: "Trong ao có gì?", a: "cá", d: ["tôm","ếch","vịt"]},
    {g: [1,2], t: "Chiều nay em giúp mẹ quét nhà. Mẹ khen em ngoan.", q: "Mẹ khen em thế nào?", a: "ngoan", d: ["lười","nhanh","giỏi"]},
    {g: [2,3], t: "Mùa xuân, hoa đào nở khắp nơi. Cả nhà em quây quần dọn dẹp để đón Tết.", q: "Mùa nào hoa đào nở?", a: "mùa xuân", d: ["mùa hạ","mùa thu","mùa đông"]},
    {g: [3,4,5], t: "Con voi là loài vật to nhất trên cạn. Voi có chiếc vòi dài dùng để uống nước và lấy thức ăn.", q: "Voi dùng vòi để làm gì?", a: "uống nước", d: ["bay lên","đào hang","bắt cá"]},
    {g: [3,4], t: "Cây xanh hấp thụ khí các-bô-níc và thải ra khí ô-xi. Nhờ vậy, không khí quanh ta trong lành hơn.", q: "Cây xanh thải ra khí gì?", a: "ô-xi", d: ["ni-tơ","hơi nước","khói bụi"]},
    {g: [4,5], t: "Trái Đất quay quanh Mặt Trời một vòng hết một năm. Mặt Trăng quay quanh Trái Đất khoảng một tháng.", q: "Mặt Trăng quay quanh vật nào?", a: "Trái Đất", d: ["Mặt Trời","sao Hỏa","sao Kim"]},
    {g: [4,5], t: "Hà Nội là thủ đô của nước ta. Ở đây có Hồ Gươm, Văn Miếu và nhiều phố cổ. Mỗi năm, hàng triệu khách đến thăm.", q: "Thủ đô của nước ta là gì?", a: "Hà Nội", d: ["Huế","Đà Nẵng","Hải Phòng"]},
    {g: [5], t: "Sông Mê Công chảy qua nhiều nước rồi đổ ra biển Đông. Ở Việt Nam, sông có tên là sông Cửu Long.", q: "Sông Mê Công đổ ra đâu?", a: "biển Đông", d: ["biển Tây","vịnh Bắc Bộ","hồ Ba Bể"]}
  ];
  /* văn học: truyện ngắn + hỏi nhân vật / cảm xúc / thông điệp. Đáp án suy ra từ truyện, đáp án nhiễu mâu thuẫn với truyện */
  D.stories = [
    { g: [1, 2], t: "Thỏ con làm rơi củ cà rốt xuống suối. Sóc nhặt lên và trả lại cho Thỏ. Thỏ vui lắm và nói: “Cảm ơn bạn Sóc!”", q: "Sóc là người bạn như thế nào?", a: "tốt bụng", d: ["lười biếng", "tham lam", "nhút nhát"] },
    { g: [1, 2], t: "Thỏ con làm rơi củ cà rốt xuống suối. Sóc nhặt lên và trả lại cho Thỏ. Thỏ vui lắm và nói: “Cảm ơn bạn Sóc!”", q: "Thỏ cảm thấy thế nào khi được trả lại cà rốt?", a: "vui", d: ["giận", "sợ", "buồn"] },
    { g: [1, 2], t: "Gà con ham chơi, không chịu nghe lời mẹ. Gà con chạy ra xa, bị lạc đường. Gà con khóc và nhớ mẹ.", q: "Vì sao gà con bị lạc?", a: "không nghe lời mẹ", d: ["bị bạn đẩy", "mưa to quá", "đi học muộn"] },
    { g: [3, 4], t: "Mùa hè, Ve ca hát suốt ngày. Kiến chăm chỉ tha mồi về tổ. Đến mùa đông, Ve đói rét đến xin Kiến giúp.", q: "Vì sao mùa đông Ve bị đói?", a: "không dự trữ thức ăn", d: ["Kiến lấy hết thức ăn", "trời nắng quá", "Ve bị ốm"] },
    { g: [3, 4], t: "Mùa hè, Ve ca hát suốt ngày. Kiến chăm chỉ tha mồi về tổ. Đến mùa đông, Ve đói rét đến xin Kiến giúp.", q: "Câu chuyện khuyên chúng ta điều gì?", a: "chăm chỉ, biết lo xa", d: ["ca hát cả ngày", "đừng giúp bạn", "ngủ thật nhiều"] },
    { g: [3], t: "Trong giờ ra chơi, Nam thấy Lan bị ngã, đầu gối trầy xước. Nam vội đỡ Lan dậy và đưa bạn đến phòng y tế.", q: "Nam đã làm gì khi thấy Lan bị ngã?", a: "đỡ bạn dậy", d: ["bỏ đi chỗ khác", "cười bạn", "rủ bạn khác chơi"] },
    { g: [4, 5], t: "Quạ khát nước, tìm mãi mới thấy một chiếc bình. Nước ở đáy bình, mỏ Quạ không với tới. Quạ nghĩ ra cách nhặt từng viên sỏi thả vào bình. Nước dâng lên dần, Quạ uống được nước.", q: "Quạ đã làm gì để uống được nước?", a: "thả sỏi vào bình", d: ["đập vỡ bình", "chờ trời mưa", "nhờ bạn giúp"] },
    { g: [4, 5], t: "Quạ khát nước, tìm mãi mới thấy một chiếc bình. Nước ở đáy bình, mỏ Quạ không với tới. Quạ nghĩ ra cách nhặt từng viên sỏi thả vào bình. Nước dâng lên dần, Quạ uống được nước.", q: "Quạ là con vật như thế nào?", a: "thông minh, kiên trì", d: ["lười biếng", "nhút nhát", "hay khoe khoang"] },
    { g: [4], t: "Cô bé Mai trồng một hạt đậu trong chậu nhỏ. Ngày nào Mai cũng tưới nước và đặt chậu ra chỗ nắng. Mấy hôm sau, mầm đậu nhú lên xanh mướt. Mai reo lên sung sướng.", q: "Điều gì làm Mai sung sướng?", a: "mầm đậu nhú lên", d: ["được đi chơi", "nhận quà", "được điểm mười"] },
    { g: [5], t: "Người thợ rèn già dạy cậu học trò: “Muốn rèn được con dao sắc, con phải kiên nhẫn đập sắt hết lần này đến lần khác.” Cậu bé ban đầu nản chí nhưng rồi vẫn miệt mài luyện tập. Nhiều tháng sau, cậu rèn được con dao tốt.", q: "Câu chuyện muốn nói điều gì?", a: "kiên nhẫn sẽ thành công", d: ["làm nhanh là giỏi", "nên bỏ cuộc sớm", "dao quan trọng nhất"] },
    { g: [5], t: "Người thợ rèn già dạy cậu học trò: “Muốn rèn được con dao sắc, con phải kiên nhẫn đập sắt hết lần này đến lần khác.” Cậu bé ban đầu nản chí nhưng rồi vẫn miệt mài luyện tập. Nhiều tháng sau, cậu rèn được con dao tốt.", q: "Lúc đầu, cậu học trò cảm thấy thế nào?", a: "nản chí", d: ["vui mừng", "tự hào", "tức giận"] },
    { g: [5], t: "Trong chuyến đi dã ngoại, cả lớp thấy một túi rác bị bỏ lại bên suối. Bạn Hà nói: “Chúng ta hãy nhặt rác để dòng suối luôn sạch.” Cả lớp cùng làm, chỉ một lúc, bờ suối đã sạch sẽ.", q: "Bạn Hà đề nghị điều gì?", a: "nhặt rác cho sạch suối", d: ["bỏ đi chỗ khác", "đổ thêm rác", "ngồi nghỉ ngơi"] },
    { g: [1, 2], t: "Vịt con thấy bạn Gà con bị mắc kẹt trong bụi cỏ. Vịt con kéo bạn ra. Gà con cười: “Cảm ơn bạn!”", q: "Vịt con đã làm gì?", a: "kéo bạn ra", d: ["bỏ đi", "cười bạn", "trốn mất"] },
    { g: [3, 4], t: "Hà quên làm bài tập nên rất lo lắng. Hà nói thật với cô giáo. Cô mỉm cười và cho Hà làm bù vào hôm sau.", q: "Hà đã làm điều gì đáng khen?", a: "nói thật với cô", d: ["nói dối cô", "chép bài bạn", "bỏ học"] },
    { g: [3, 4], t: "Hà quên làm bài tập nên rất lo lắng. Hà nói thật với cô giáo. Cô mỉm cười và cho Hà làm bù vào hôm sau.", q: "Câu chuyện khuyên điều gì?", a: "hãy luôn trung thực", d: ["đừng làm bài tập", "chép bài của bạn", "giấu lỗi của mình"] },
    { g: [4, 5], t: "Cậu bé Nam thấy một chiếc ví rơi trên đường. Nam không giữ lại mà đem đến đồn công an. Người mất ví rất biết ơn Nam.", q: "Nam đã làm gì với chiếc ví?", a: "đem đến đồn công an", d: ["giữ lại cho mình", "vứt đi", "đưa cho bạn"] },
    { g: [4, 5], t: "Cậu bé Nam thấy một chiếc ví rơi trên đường. Nam không giữ lại mà đem đến đồn công an. Người mất ví rất biết ơn Nam.", q: "Nam là người như thế nào?", a: "trung thực", d: ["tham lam", "lười biếng", "nhút nhát"] },
    {g: [3,4,5], t: "Sáng nay trời đen kịt, gió nổi mạnh. Mẹ vội thu quần áo phơi ngoài sân vào nhà.", q: "Vì sao mẹ vội thu quần áo?", a: "trời sắp mưa", d: ["trời sắp nắng","nhà có khách","đến giờ ăn cơm"]},
    {g: [4,5], t: "Nam hứa sẽ về sớm giúp bà tưới rau. Nhưng chiều đó Nam mải đá bóng nên quên mất. Tối về, thấy luống rau héo, Nam rất áy náy.", q: "Nam cảm thấy thế nào khi thấy rau héo?", a: "áy náy", d: ["tự hào","hờ hững","vui sướng"]},
    {g: [1,2,3], t: "Bài thơ: Bé có đôi bàn tay / Rửa sạch trước khi ăn / Bé ngoan, bé khỏe mạnh / Cả nhà đều vui lắm.", q: "Bé rửa gì trước khi ăn?", a: "đôi bàn tay", d: ["đôi chân","khuôn mặt","bát đũa"]},
    {g: [3,4,5], t: "Bài thơ: Mặt trời dậy từ sớm / Gọi bé thức dậy chơi / Hoa cười, chim hót vang / Ngày mới tới rồi thôi.", q: "Mặt trời gọi bé làm gì?", a: "thức dậy", d: ["đi ngủ","ăn cơm","làm bài"]}
  ];
  /* sắp xếp câu thành đoạn: các câu ĐÚNG THỨ TỰ (có từ nối hoặc trình tự thời gian rõ) */
  D.paragraphs = [
    ["Đầu tiên, em rửa sạch rau.", "Sau đó, em cắt rau thành từng đoạn.", "Tiếp theo, em cho rau vào nồi nấu.", "Cuối cùng, em múc canh ra bát."],
    ["Buổi sáng, em thức dậy và đánh răng.", "Sau đó, em ăn sáng cùng cả nhà.", "Rồi em đeo cặp đến trường.", "Chiều về, em làm bài tập."],
    ["Trước hết, bạn chuẩn bị giấy và bút màu.", "Sau đó, bạn vẽ hình ngôi nhà.", "Tiếp theo, bạn tô màu cho bức tranh.", "Cuối cùng, bạn ký tên vào góc tranh."],
    ["Hạt đậu được gieo xuống đất.", "Vài ngày sau, mầm đậu nhú lên.", "Mầm lớn dần thành cây non.", "Cuối cùng, cây ra hoa và kết quả."],
    ["Đầu tiên, em lấy cặp sách ra khỏi giá.", "Sau đó, em xếp sách vở theo thời khóa biểu.", "Tiếp theo, em kiểm tra hộp bút.", "Cuối cùng, em đóng cặp và để gọn gàng."],
    ["Buổi sáng, bà ra vườn hái rau.", "Buổi trưa, bà nấu cơm cho cả nhà.", "Buổi chiều, bà ngồi khâu áo dưới hiên.", "Buổi tối, bà kể chuyện cho các cháu nghe."],
    ["Trước hết, chú thợ trộn vữa.", "Sau đó, chú xây từng hàng gạch.", "Tiếp theo, chú trát tường cho phẳng.", "Cuối cùng, chú quét sơn lên tường."],
    ["Sáng sớm, gà gáy báo trời sáng.", "Buổi trưa, nắng chiếu rực rỡ.", "Chiều đến, nắng nhạt dần.", "Tối đến, ánh trăng lên cao."],
    ["Sáng sớm, mặt trời mọc ở phía đông.", "Buổi trưa, nắng chiếu sáng gay gắt.", "Chiều tối, mặt trời lặn dần.", "Đêm đến, trăng sao lên cao."],
    ["Đầu tiên, bé lấy bàn chải và kem đánh răng.", "Sau đó, bé chải răng thật kĩ.", "Tiếp theo, bé súc miệng bằng nước sạch.", "Cuối cùng, bé cất bàn chải gọn gàng."]
  ];

  /* ====================== TIẾNG ANH ====================== */
  D.colors = [["🔴", "red"], ["🔵", "blue"], ["🟢", "green"], ["🟡", "yellow"], ["🟠", "orange"], ["🟣", "purple"], ["⚫", "black"], ["⚪", "white"], ["🟤", "brown"]];
  D.numWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  D.tensWords = { 20: "twenty", 30: "thirty", 40: "forty", 50: "fifty", 60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety", 100: "one hundred" };
  D.themes = {
    body: [["👁️", "eye"], ["👂", "ear"], ["👃", "nose"], ["👄", "mouth"], ["✋", "hand"], ["🦶", "foot"], ["🦷", "tooth"], ["🦵", "leg"]],
    food: [["🍎", "apple"], ["🍌", "banana"], ["🍞", "bread"], ["🥛", "milk"], ["🍚", "rice"], ["🥚", "egg"], ["🍗", "chicken"], ["🍰", "cake"], ["🍦", "ice cream"], ["🍊", "orange"], ["🍇", "grapes"], ["🍕", "pizza"]],
    clothes: [["👕", "shirt"], ["👗", "dress"], ["👟", "shoes"], ["🧢", "cap"], ["🧦", "socks"], ["🧥", "jacket"], ["🩳", "shorts"], ["🧣", "scarf"]],
    school: [["✏️", "pencil"], ["📖", "book"], ["🎒", "bag"], ["📏", "ruler"], ["✂️", "scissors"], ["🖊️", "pen"], ["💻", "computer"]],
    weather: [["☀️", "sunny"], ["🌧️", "rainy"], ["☁️", "cloudy"], ["💨", "windy"], ["❄️", "snowy"], ["⛈️", "stormy"]],
    transport: [["🚗", "car"], ["🚌", "bus"], ["🚲", "bike"], ["✈️", "plane"], ["🚢", "ship"], ["🚂", "train"], ["🏍️", "motorbike"], ["🚁", "helicopter"]],
    animals: [["🐱", "cat"], ["🐶", "dog"], ["🐟", "fish"], ["🐦", "bird"], ["🐘", "elephant"], ["🐒", "monkey"], ["🐴", "horse"], ["🐮", "cow"]],
    nature: [["🌳", "tree"], ["🌸", "flower"], ["🌙", "moon"], ["⭐", "star"], ["🌈", "rainbow"], ["⛰️", "mountain"]],
    house: [["🛏️", "bed"], ["🪑", "chair"], ["🚪", "door"], ["🪟", "window"], ["🔑", "key"], ["🕒", "clock"]],
    family: [["👶", "baby"], ["👵", "grandmother"], ["👴", "grandfather"], ["👦", "boy"], ["👧", "girl"], ["👪", "family"]],
    toys: [["⚽", "ball"], ["🧸", "teddy bear"], ["🪁", "kite"], ["🎈", "balloon"], ["🤖", "robot"], ["🎮", "game"]]
  };
  D.meanings = [["cook", "đầu bếp"], ["nurse", "y tá"], ["library", "thư viện"], ["market", "chợ"], ["hospital", "bệnh viện"], ["garden", "vườn"], ["father", "bố"], ["mother", "mẹ"], ["grandmother", "bà"], ["grandfather", "ông"], ["teacher", "giáo viên"], ["student", "học sinh"], ["friend", "bạn"], ["school", "trường học"], ["doctor", "bác sĩ"], ["farmer", "nông dân"], ["run", "chạy"], ["jump", "nhảy"], ["swim", "bơi"], ["sing", "hát"], ["draw", "vẽ"], ["sleep", "ngủ"], ["read", "đọc"], ["write", "viết"]];
  D.aWords = ["cat", "dog", "book", "pen", "bag", "table", "bike", "ruler", "car", "tree", "fish", "hat", "pencil", "school", "chair", "bed", "window", "door", "key", "house", "moon"];
  D.anWords = ["apple", "egg", "orange", "umbrella", "elephant", "ice cream", "ant", "owl", "eraser", "arm", "eye", "ear", "onion", "uncle", "island"];
  D.plurals = ["cat", "dog", "book", "bus", "box", "watch", "dish", "baby", "city", "child", "man", "woman", "foot", "tooth", "mouse", "pen", "bag", "class", "fox", "boy", "toy", "day", "bird", "flower", "star", "kiss", "bench", "wish", "puppy", "key", "house"];
  D.irregularPlural = { child: "children", man: "men", woman: "women", foot: "feet", tooth: "teeth", mouse: "mice" };
  /* chủ ngữ ngôi thứ ba số ít dùng động từ thêm -s/-es */
  D.verbs = { play: ["plays", "playing", "played"], watch: ["watches", "watching", "watched"], go: ["goes", "going", "went"], study: ["studies", "studying", "studied"], like: ["likes", "liking", "liked"], eat: ["eats", "eating", "ate"],
    wash: ["washes", "washing", "washed"], fly: ["flies", "flying", "flew"], have: ["has", "having", "had"], do: ["does", "doing", "did"], help: ["helps", "helping", "helped"], cook: ["cooks", "cooking", "cooked"], sing: ["sings", "singing", "sang"], swim: ["swims", "swimming", "swam"] };
  D.subj3 = ["He", "She", "My mother", "Nam", "The cat", "My teacher"];
  D.subjPl = ["They", "We", "I", "You", "My friends"];
  D.wh = [
    ["___ is your name?", "My name is Mai.", "What", ["Where", "Who", "When"]], ["___ are you from?", "I'm from Hue.", "Where", ["What", "Who", "How many"]], ["___ is that man?", "He is my uncle.", "Who", ["Where", "When", "How many"]],
    ["___ old are you?", "I'm nine.", "How", ["What", "Who", "Where"]], ["___ pencils do you have?", "Five.", "How many", ["What", "Who", "Where"]], ["___ do you get up?", "At six o'clock.", "What time", ["Where", "Who", "How many"]],
    ["___ do you like this book?", "Because it's funny.", "Why", ["Where", "Who", "What time"]], ["___ is your birthday?", "It's in May.", "When", ["Who", "Where", "How many"]], ["___ is she doing?", "She's reading.", "What", ["Where", "Who", "How old"]],
    ["___ is your favourite colour?", "It's blue.", "What", ["Where", "Who", "How many"]], ["___ do you live?", "In Hanoi.", "Where", ["What", "Who", "How old"]], ["___ is your teacher?", "Ms Lan.", "Who", ["Where", "What time", "How many"]], ["___ brothers do you have?", "Two.", "How many", ["Who", "Where", "What time"]]
  ];
  D.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  D.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  D.greetings = [
    ["Hello!", "Hi!", ["Goodbye!", "Thank you.", "Sorry."]], ["How are you?", "I'm fine, thanks.", ["My name is Nam.", "I'm nine.", "See you."]], ["What's your name?", "My name is Lan.", ["I'm fine, thanks.", "Goodbye!", "It's Monday."]],
    ["Thank you.", "You're welcome.", ["Good morning.", "I'm sorry.", "Goodbye."]], ["Goodbye!", "Bye! See you.", ["Hello!", "I'm fine.", "You're welcome."]], ["Good morning!", "Good morning!", ["Good night!", "Goodbye!", "Thank you."]],
    ["I'm sorry.", "That's OK.", ["You're welcome.", "Hello!", "Good night."]], ["How old are you?", "I'm eight.", ["I'm fine, thanks.", "My name is Nam.", "It's Monday."]], ["Nice to meet you.", "Nice to meet you, too.", ["Goodbye!", "I'm eight.", "You're welcome."]],
    ["Good night!", "Good night!", ["Good morning!", "Thank you.", "I'm eight."]], ["See you tomorrow!", "See you!", ["Hello!", "I'm fine.", "Sorry."]], ["Happy birthday!", "Thank you!", ["Goodbye!", "I'm sorry.", "See you."]]
  ];
  D.readEn = [
    { g: [3], t: "This is Tom. He is eight. He has a dog. The dog is brown.", q: "What colour is the dog?", a: "brown", d: ["black", "white", "yellow"] },
    { g: [3], t: "I like apples. My sister likes bananas. We eat fruit every day.", q: "What does the sister like?", a: "bananas", d: ["apples", "oranges", "grapes"] },
    { g: [3, 4], t: "Mai has a red bag. In the bag, there are two books and a pen.", q: "How many books are in the bag?", a: "two", d: ["one", "three", "four"] },
    { g: [4], t: "Lan gets up at six o'clock. She has breakfast at six thirty. She goes to school at seven.", q: "What time does Lan go to school?", a: "at seven", d: ["at six", "at six thirty", "at eight"] },
    { g: [4], t: "My house has a garden. There are many flowers in the garden. My mother waters them every morning.", q: "Who waters the flowers?", a: "My mother", d: ["My father", "My sister", "My grandmother"] },
    { g: [5], t: "On Sunday, Nam and his friends play football in the park. After that, they have ice cream. They go home at five o'clock.", q: "Where do they play football?", a: "in the park", d: ["at school", "at home", "in the garden"] },
    { g: [5], t: "It is rainy today, so we stay at home. I read a book and my brother draws pictures.", q: "What does the brother do?", a: "draws pictures", d: ["reads a book", "plays football", "watches TV"] },
    { g: [3], t: "I have a cat. Her name is Kitty. She likes milk.", q: "What does Kitty like?", a: "milk", d: ["fish", "bread", "rice"] },
    { g: [3], t: "It is Monday. I go to school. I have English class.", q: "What day is it?", a: "Monday", d: ["Sunday", "Friday", "Tuesday"] },
    { g: [3, 4], t: "Ben has two pencils and one ruler in his bag.", q: "How many pencils does Ben have?", a: "two", d: ["one", "three", "five"] },
    { g: [4], t: "My father is a driver. He drives a bus. He works every day.", q: "What does the father drive?", a: "a bus", d: ["a car", "a taxi", "a train"] },
    { g: [4], t: "Linh gets up at six. She washes her face and brushes her teeth. Then she has breakfast.", q: "What does Linh do after she brushes her teeth?", a: "has breakfast", d: ["goes to school", "plays games", "watches TV"] },
    { g: [5], t: "My town has a big park. In the park, there is a lake and many trees. Children like to play there after school.", q: "When do children play in the park?", a: "after school", d: ["in the morning", "at night", "on Sunday"] },
    { g: [5], t: "Tom's favourite subject is Science. He likes doing experiments. He wants to be a scientist.", q: "What does Tom want to be?", a: "a scientist", d: ["a teacher", "a doctor", "a farmer"] },
    { g: [5], t: "Last Saturday, Mai visited her grandmother. They cooked dinner together and watched a film.", q: "Who did Mai visit?", a: "her grandmother", d: ["her friend", "her teacher", "her aunt"] },
    {g: [3], t: "I have a ball. The ball is red. I play with my brother.", q: "What colour is the ball?", a: "red", d: ["blue","green","yellow"]},
    {g: [3,4], t: "It is Monday. Nam goes to school by bike. He has Maths and English today.", q: "How does Nam go to school?", a: "by bike", d: ["by bus","on foot","by car"]},
    {g: [4,5], t: "My family is small. There are four people: my father, my mother, my sister and me. We live in a big house in Hue.", q: "Where do they live?", a: "in Hue", d: ["in Hanoi","in Da Nang","in Hai Phong"]},
    {g: [4,5], t: "Linh wants to be a doctor. She studies hard and helps her friends. Every Saturday, she visits the hospital with her mother.", q: "What does Linh want to be?", a: "a doctor", d: ["a teacher","a singer","a cook"]},
    {g: [5], t: "Last Sunday, we visited my grandmother. She cooked fish soup for us. After lunch, we played chess in the garden.", q: "What did the grandmother cook?", a: "fish soup", d: ["chicken soup","fried rice","noodles"]},
    {g: [5], t: "The weather in Da Lat is cool all year. Many tourists go there in December because the flowers are beautiful.", q: "How is the weather in Da Lat?", a: "cool", d: ["hot","cold","rainy"]}
  ];

  /* ====================== luật (độc lập với bài kiểm) ====================== */
  function nfc(s) { return s.normalize ? s.normalize("NFC") : s; }
  function applyTone(syl, mark) { /* mọi tiếng ở đây có đúng MỘT nguyên âm, mang dấu thanh */ var c = syl.charAt(0), v = syl.slice(1); return nfc(c + v + mark); }
  function enPlural(w) { if (D.irregularPlural[w]) return D.irregularPlural[w]; if (/(s|x|ch|sh)$/.test(w)) return w + "es"; if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + "ies"; return w + "s"; }
  function numToWord(n) { if (n <= 20) return D.numWords[n]; if (D.tensWords[n]) return D.tensWords[n]; var t = Math.floor(n / 10) * 10; return D.tensWords[t] + "-" + D.numWords[n - t]; }
  D.rules = { applyTone: applyTone, enPlural: enPlural, numToWord: numToWord };

  function install(c) {
    var mk = c.mk, rnd = c.rnd, shuf = c.shuf, G = c.G, SK = c.SK, TOPIC = c.TOPIC, TAGS = c.TAGS, SKLAB = c.SKLAB, TRACKED = c.TRACKED;
    var pk = function (a) { return a[rnd(0, a.length - 1)]; };
    var vi = function (x) { return x.lang !== "en"; };
    ["word_class", "punct", "sent_type", "en_rule"].forEach(function (t) { if (TAGS.indexOf(t) < 0) TAGS.push(t); });
    /* chốt câu 4 lựa chọn: wr = [[giá trị, mã lỗi], …] (>= 3 giá trị khác nhau và khác đáp án) */
    function fin(q, ans, wr, lab) {
      var seen = {}, out = []; seen[ans] = 1;
      shuf(wr.slice()).forEach(function (w) { if (!seen[w[0]] && out.length < 3) { seen[w[0]] = 1; out.push(w); } });
      if (out.length < 3) throw new Error("thiếu đáp án nhiễu: " + q);
      return mk(q, ans, out, lab);
    }
    var W = function (arr, tag) { return arr.map(function (x) { return [x, tag]; }); };
    var em = function (t) { return "<em>" + t + "</em>"; };
    var fmtList = function (a) { return a.join(", "); };

    /* ---- Tiếng Việt ---- */
    G.letter_start = function (cc) {
      var it = pk(D.letterStart), wr = D.letters.filter(function (l) { return l !== it[2]; });
      return fin(vi(cc) ? it[0] + " " + em(it[1]) + " bắt đầu bằng chữ gì?" : it[0] + " " + em(it[1]) + " starts with which letter?", it[2], W(shuf(wr).slice(0, 8), "spelling"));
    };
    G.syllable_blend = function (cc) {
      var cons = Object.keys(D.vowelsOf), k = pk(cons), vs = D.vowelsOf[k].split(" "), v = pk(vs), ans = nfc(k + v);
      if (cc.grade >= 2 || rnd(0, 1)) {
        var tn = pk(D.tones), tn2 = D.tones.filter(function (x) { return x !== tn; }), ans2 = applyTone(ans, tn[1]);
        return fin(vi(cc) ? em(ans) + " thêm " + em(tn[0]) + " thành tiếng nào?" : em(ans) + " + " + em(tn[0]) + " = ?", ans2, tn2.map(function (x) { return [applyTone(ans, x[1]), "tone"]; }));
      }
      var wr = [[nfc(v + k), "spelling"]], v2 = vs.filter(function (x) { return x !== v; }), k2 = cons.filter(function (x) { return x !== k && D.vowelsOf[x].split(" ").indexOf(v) >= 0; });
      if (v2.length) wr.push([nfc(k + pk(v2)), "spelling"]); if (k2.length) wr.push([nfc(pk(k2) + v), "spelling"]); wr.push([nfc(pk(cons) + pk(v2.length ? v2 : vs)), "spelling"], [nfc(k + pk(v2.length ? v2 : vs)), "spelling"]);
      return fin(em(k) + " + " + em(v) + " = <em>?</em>", ans, wr);
    };
    G.spell_ngh = function (cc) {
      var it = pk(D.nghItems), ans = it[0], pair = { ng: "ngh", ngh: "ng", g: "gh", gh: "g", c: "k", k: "c" }[ans], others = { ng: ["g", "gh"], ngh: ["g", "gh"], g: ["ng", "ngh"], gh: ["ng", "ngh"], c: ["ng", "ch"], k: ["ng", "ch"] }[ans];
      return fin((vi(cc) ? "Điền chữ còn thiếu: " : "Fill in the missing letters: ") + "<br>" + em(it[2]), ans, W([pair].concat(others), "spelling"));
    };
    G.spell_init = function (cc) {
      var gs = cc.grade <= 2 ? ["sx"] : cc.grade === 3 ? ["sx", "dgr"] : cc.grade === 4 ? ["dgr", "ln"] : ["sx", "dgr", "ln"], gk = pk(gs), grp = D.initWords[gk], keys = Object.keys(grp).filter(function (x) { return x !== "extra"; }), ans = pk(keys), it = pk(grp[ans]);
      var wr = keys.filter(function (x) { return x !== ans; }).concat(grp.extra);
      return fin((vi(cc) ? "Điền chữ còn thiếu: " : "Fill in the missing letters: ") + it[0] + " " + em("__" + it[1].slice(ans.length)), ans, W(wr, "spelling"));
    };
    G.word_class = function (cc) {
      var cls = pk([["things", "sự vật", "danh từ", "noun"], ["actions", "hoạt động", "động từ", "verb"], ["traits", "đặc điểm", "tính từ", "adjective"]]), term = cc.grade >= 4 ? cls[2] : "từ chỉ " + cls[1], wr = [];
      ["things", "actions", "traits"].forEach(function (x) { if (x !== cls[0]) wr = wr.concat(D[x]); });
      return fin((vi(cc) ? "Từ nào là " : "Which word is a ") + em(vi(cc) ? term : cls[3]) + "?", pk(D[cls[0]]), W(wr, "word_class"));
    };
    G.punct = function (cc) {
      var dots = [".", ",", "?", "!"];
      if (cc.grade >= 3 && rnd(0, 2) === 0) { var ci = pk(D.commaItems); return fin((vi(cc) ? "Điền dấu câu: " : "Fill in the punctuation: ") + em(ci[0] + " __ " + ci[1] + "."), ",", W([".", "?", "!"], "punct")); }
      var s = pk(D.sentences), ans = { k: ".", h: "?", c: "!", y: s[1] === "y" && /^Đừng|nào$/.test(s[0]) ? "!" : "." }[s[1]];
      return fin((vi(cc) ? "Điền dấu cuối câu: " : "Fill in the end mark: ") + em(s[0] + " __"), ans, W(dots.filter(function (x) { return x !== ans; }), "punct"));
    };
    G.sent_type = function (cc) {
      var s = pk(D.sentences), names = { k: "câu kể", h: "câu hỏi", c: "câu cảm", y: "câu khiến" }, en = { k: "statement", h: "question", c: "exclamation", y: "command" }, end = { k: ".", h: "?", c: "!", y: "." }[s[1]];
      if (s[1] === "y" && /^Đừng|nào$/.test(s[0])) end = "!";
      var wr = Object.keys(names).filter(function (x) { return x !== s[1]; }).map(function (x) { return [vi(cc) ? names[x] : en[x], "sent_type"]; });
      return fin((vi(cc) ? "Câu " : "The sentence ") + em("“" + s[0] + end + "”") + (vi(cc) ? " thuộc kiểu câu nào?" : " is a…?"), vi(cc) ? names[s[1]] : en[s[1]], wr);
    };
    G.synonym = function () {
      var it = pk(D.synonyms), wr = it.d.slice();
      return fin("Từ nào " + em("đồng nghĩa") + " với " + em(it.w) + "?", pk(it.s), W(wr, "meaning"));
    };
    G.antonym_pair = function () {
      var p = pk(D.antonyms), flip = rnd(0, 1), w = flip ? p[1] : p[0], ans = flip ? p[0] : p[1], wr = [];
      D.antonyms.forEach(function (x) { if (x[2] !== p[2]) { wr.push(x[0], x[1]); } });
      return fin("Từ nào " + em("trái nghĩa") + " với " + em(w) + "?", ans, W(wr, "meaning"));
    };
    G.idiom = function () {
      var it = pk(D.idioms), wr = D.idioms.filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin("Điền từ còn thiếu: " + em(it[0] + " __"), it[1], W(wr, "meaning"));
    };
    G.greeting_vi = function () {
      var it = pk(D.manners);
      return fin(it[0], it[1], W(it[2], "other"));
    };
    G.reading_story = function (cc) {
      var pool = D.readVi.filter(function (x) { return x.g.indexOf(cc.grade) >= 0; }), it = pk(pool);
      return fin(it.t + "<br>" + em(it.q), it.a, W(it.d, "reading"));
    };

    G.story_lit = function (cc) {
      var pool = D.stories.filter(function (x) { return x.g.indexOf(cc.grade) >= 0; }), it = pk(pool);
      return fin(it.t + "<br>" + em(it.q), it.a, W(it.d, "reading"));
    };
    G.para_order = function (cc) {
      var para = pk(D.paragraphs), n = cc.grade <= 3 ? 3 : 4, sents = para.slice(0, n), L = "ABCD".slice(0, n).split(""), idx, perm, tries = 0;
      do { idx = shuf(sents.map(function (x, i) { return i; })); tries++; } while (idx.every(function (v, i) { return v === i; }) && tries < 30);
      var shown = idx.map(function (i) { return sents[i]; }), label = function (orig) { return L[idx.indexOf(orig)]; };   /* nhãn của câu đứng thứ orig trong đoạn đúng */
      var rightOrder = sents.map(function (x, i) { return label(i); }).join(" – "), wr = [];
      for (var k = 0; k < 40 && wr.length < 5; k++) { var pm = shuf(L.slice()).join(" – "); if (pm !== rightOrder && wr.indexOf(pm) < 0) wr.push(pm); }
      return fin(shown.map(function (x, i) { return L[i] + ". " + x; }).join("<br>") + "<br>" + em(vi(cc) ? "Sắp xếp thành đoạn văn đúng:" : "Put them in the right order:"), rightOrder, W(wr, "reading"));
    };
    /* ---- NGHE: bé nghe giọng đọc rồi chọn (index.html phát bằng speak(); q.speak là câu cần đọc) ---- */
    function lis(q, speak, lang, pic) { q.listen = 1; q.speak = speak; q.speakLang = lang; if (pic) q.dk = "pic"; return q; }
    var LBTN = '<button type="button" class="lsn" aria-label="🔊">🔊</button>';
    G.vi_listen_word = function (cc) {
      var it = pk(D.letterStart), wr = D.letterStart.filter(function (x) { return x !== it; }).map(function (x) { return x[0]; });
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn hình đúng" : "Listen and pick the picture"), it[0], W(wr, "word")), it[1], "vi", true);
    };
    G.en_listen_word = function (cc) {
      var th = pk(cc.grade <= 2 ? ["body", "food", "animals", "family", "toys"] : Object.keys(D.themes)), it = pk(D.themes[th]), near = D.themes[th].filter(function (x) { return x !== it; }).map(function (x) { return x[0]; });
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn hình đúng" : "Listen and pick the picture"), it[0], W(near, "word")), it[1], "en", true);
    };
    G.en_listen_num = function (cc) {
      var n = cc.grade >= 3 ? pk([13, 14, 15, 16, 17, 18, 19, 30, 40, 50, 60, 70, 80, 90]) : rnd(1, cc.grade === 1 ? 10 : 20), wr = [n + 1, n - 1, n + 10, n - 10, n + 2, n - 2, n >= 13 && n <= 19 ? (n - 10) * 10 : (n >= 30 && n % 10 === 0 ? n / 10 + 10 : n + 3)].filter(function (x) { return x >= 1 && x <= 100 && x !== n; });
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn số đúng" : "Listen and pick the number"), String(n), W(wr.map(String), "word")), numToWord(n), "en", false);
    };
    G.en_listen_reply = function (cc) {
      var it = pk(D.greetings);
      return lis(fin(LBTN + "<br>" + (vi(cc) ? "Nghe rồi chọn câu trả lời" : "Listen and choose the reply"), it[1], W(it[2], "word")), it[0], "en", false);
    };
    /* ---- Tiếng Anh ---- */
    G.en_colors = function (cc) {
      var it = pk(D.colors), wr = D.colors.filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin((vi(cc) ? "Đây là màu gì? " : "What colour is this? ") + em(it[0]), it[1], W(wr, "word"));
    };
    G.en_numbers = function (cc) {
      var mx = cc.grade === 1 ? 10 : cc.grade === 2 ? 20 : 100, n = cc.grade >= 3 ? pk([11, 12, 13, 15, 18, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 36, 47, 58, 99]) : rnd(1, mx), ans = numToWord(n), wr = [];
      if (cc.grade <= 2 && rnd(0, 1)) { var e = pk(["🍎", "⭐", "🐟", "🎈", "🌸"]), k = rnd(1, 10); var NM = { "🍎": ["quả táo", "apples"], "⭐": ["ngôi sao", "stars"], "🐟": ["con cá", "fish"], "🎈": ["quả bóng", "balloons"], "🌸": ["bông hoa", "flowers"] }[e]; var qq = fin((vi(cc) ? "Có bao nhiêu? " : "How many? ") + em(new Array(k + 1).join(e)), numToWord(k), W([k + 1, k - 1, k + 2, k + 3].filter(function (x) { return x >= 1 && x <= 12; }).map(numToWord), "off_by_one")); qq.speak = vi(cc) ? "Có mấy " + NM[0] + "?" : "How many " + NM[1] + " are there?"; return qq; }
      [n + 1, n - 1, n + 2, n - 2, n + 10, n - 10, n + 3].forEach(function (x) { if (x >= 1 && x <= 100) wr.push(numToWord(x)); });
      if (n >= 13 && n <= 19) wr.push(numToWord(n * 10 % 100 || 30));   /* thirteen ~ thirty */
      return fin((vi(cc) ? "Số " : "The number ") + em(n) + (vi(cc) ? " đọc là gì?" : " is…?"), ans, W(wr, "word"));
    };
    G.en_topic_vocab = function (cc) {
      var ts = cc.grade <= 2 ? ["body", "food", "animals", "family", "toys"] : cc.grade === 3 ? ["food", "clothes", "body", "school", "animals", "house"] : ["school", "weather", "transport", "clothes", "food", "nature", "house", "animals"], th = pk(ts), it = pk(D.themes[th]);
      var wr = D.themes[th].filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      Object.keys(D.themes).forEach(function (k) { if (k !== th) D.themes[k].forEach(function (x) { wr.push(x[1]); }); });
      var near = D.themes[th].filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin((vi(cc) ? "Đây là gì? " : "What is this? ") + em(it[0]), it[1], W(near.length >= 3 ? near : wr, "word"));
    };
    G.en_meaning = function (cc) {
      var it = pk(D.meanings), wr = D.meanings.filter(function (x) { return x !== it; }).map(function (x) { return x[1]; });
      return fin((vi(cc) ? "Từ " : "What does ") + em(it[0]) + (vi(cc) ? " nghĩa là gì?" : " mean?"), it[1], W(wr, "word"));
    };
    G.en_a_an = function (cc) {
      var an = rnd(0, 1), w = an ? pk(D.anWords) : pk(D.aWords);
      return fin((vi(cc) ? "Điền a hay an: " : "Fill in a or an: ") + em("This is __ " + w + "."), an ? "an" : "a", W([an ? "a" : "an", "many", "two"], "en_rule"));
    };
    G.en_plural = function (cc) {
      var w = pk(D.plurals), ans = enPlural(w), base = w, wr = [w + "s", w + "es", w.replace(/y$/, "") + "ies", w + "en", w + "ren", w.replace(/y$/, "ys")];
      if (D.irregularPlural[w]) wr.push(w + "s", w + "es", w + "ren");
      return fin(em("one " + w + " → two __") + (vi(cc) ? "  (số nhiều)" : ""), ans, W(wr.filter(function (x) { return x !== base; }), "en_rule"));
    };
    G.en_present_s = function (cc) {
      var verb = pk(Object.keys(D.verbs)), forms = D.verbs[verb], third = cc.grade < 5 || rnd(0, 2) > 0, subj = third ? pk(D.subj3) : pk(D.subjPl), ans = third ? forms[0] : verb;
      var wr = third ? [[verb, "en_rule"], [forms[1], "en_rule"], [forms[2], "en_rule"]] : [[forms[0], "en_rule"], [forms[1], "en_rule"], [forms[2], "en_rule"]];
      return fin(em(subj + " __ (" + verb + ") every day."), ans, wr);
    };
    G.en_wh = function (cc) {
      var it = pk(D.wh);
      return fin(em(it[0]) + "<br>" + (vi(cc) ? "Trả lời: " : "Answer: ") + "“" + it[1] + "”", it[2], W(it[3], "en_rule"));
    };
    G.en_days = function (cc) {
      var useM = cc.grade >= 3 && rnd(0, 1), arr = useM ? D.months : D.days, i = rnd(0, arr.length - 1), nxt = arr[(i + 1) % arr.length], cur = arr[i];
      if (rnd(0, 1)) { var j = rnd(0, arr.length - 1); return fin((vi(cc) ? "Sau " : "What comes after ") + em(arr[j]) + (vi(cc) ? " là gì?" : "?"), arr[(j + 1) % arr.length], W(arr.filter(function (x) { return x !== arr[(j + 1) % arr.length] && x !== arr[j]; }), "word")); }
      var prev = arr[(i + arr.length - 1) % arr.length];
      return fin(em(prev + ", " + cur + ", __"), nxt, W(arr.filter(function (x) { return x !== nxt && x !== cur && x !== prev; }), "word"));
    };
    function misspell(w) {
      var out = [], s = w.replace(/ /g, "_"), i;
      for (i = 0; i < s.length - 1; i++) if (s.charAt(i) !== s.charAt(i + 1) && s.charAt(i) !== "_" && s.charAt(i + 1) !== "_") out.push(s.slice(0, i) + s.charAt(i + 1) + s.charAt(i) + s.slice(i + 2));
      for (i = 1; i < s.length; i++) if (s.charAt(i) !== "_") out.push(s.slice(0, i) + s.slice(i + 1));
      for (i = 0; i < s.length; i++) if (s.charAt(i) !== "_") out.push(s.slice(0, i) + s.charAt(i) + s.slice(i));
      var vv = "aeiou"; for (i = 0; i < s.length; i++) if (vv.indexOf(s.charAt(i)) >= 0) out.push(s.slice(0, i) + vv.charAt((vv.indexOf(s.charAt(i)) + 1) % 5) + s.slice(i + 1));
      return out.map(function (x) { return x.replace(/_/g, " "); }).filter(function (x) { return x !== w; });
    }
    D.rules.misspell = misspell;
    G.en_spelling = function (cc) {
      var th = pk(Object.keys(D.themes)), it = pk(D.themes[th]), wr = shuf(misspell(it[1]));
      return fin((vi(cc) ? "Chọn cách viết đúng: " : "Pick the right spelling: ") + em(it[0]), it[1], W(wr.slice(0, 6), "spelling"));
    };
    G.en_greeting = function () {
      var it = pk(D.greetings);
      return fin(em("“" + it[0] + "”"), it[1], W(it[2], "word"));
    };
    G.en_reading = function (cc) {
      var pool = D.readEn.filter(function (x) { return x.g.indexOf(cc.grade) >= 0; }), it = pk(pool);
      return fin(it.t + "<br>" + em(it.q), it.a, W(it.d, "reading"));
    };

    /* ---- đăng ký kỹ năng / chủ đề / nhãn ---- */
    var T = function (id, subj, grades, diff, topics, lab) { SK[id] = { subj: subj, grades: grades, diff: diff }; TOPIC[id] = topics; SKLAB[id] = lab; };
    T("letter_start", "tviet", [1], 1, { 1: "VI-G1-01" }, ["Chữ cái đầu", "First letter"]);
    T("syllable_blend", "tviet", [1, 2], 1, { 1: "VI-G1-01", 2: "VI-G2-01" }, ["Ghép vần", "Blending"]);
    T("spell_ngh", "tviet", [1, 2], 2, { 1: "VI-G1-03", 2: "VI-G2-02" }, ["Chính tả", "Spelling"]);
    T("spell_init", "tviet", [2, 3, 4, 5], 2, { 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Chính tả", "Spelling"]);
    T("word_class", "tviet", [2, 3, 4, 5], 2, { 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Từ loại", "Word types"]);
    T("punct", "tviet", [2, 3, 4, 5], 2, { 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Dấu câu", "Punctuation"]);
    T("sent_type", "tviet", [3, 4, 5], 3, { 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Kiểu câu", "Sentence types"]);
    T("synonym", "tviet", [3, 4, 5], 2, { 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Đồng nghĩa", "Synonyms"]);
    T("antonym_pair", "tviet", [2, 3, 4, 5], 2, { 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" }, ["Trái nghĩa", "Opposites"]);
    T("idiom", "tviet", [4, 5], 3, { 4: "VI-G4-01", 5: "VI-G5-01" }, ["Thành ngữ", "Idioms"]);
    T("greeting_vi", "tviet", [1, 2], 1, { 1: "VI-G1-04", 2: "VI-G2-04" }, ["Giao tiếp", "Manners"]);
    T("reading_story", "tviet", [1, 2, 3, 4, 5], 2, { 1: "VI-G1-02", 2: "VI-G2-01", 3: "VI-G3-01", 4: "VI-G4-02", 5: "VI-G5-01" }, ["Đọc hiểu", "Reading"]);
    T("en_colors", "tanh", [1, 2], 1, { 1: "EN-G1-02", 2: "EN-G2-03" }, ["Màu sắc", "Colours"]);
    T("en_numbers", "tanh", [1, 2, 3], 1, { 1: "EN-G1-02", 2: "EN-G2-03", 3: "EN-G3-03" }, ["Số đếm", "Numbers"]);
    T("en_topic_vocab", "tanh", [1, 2, 3, 4, 5], 2, { 1: "EN-G1-02", 2: "EN-G2-03", 3: "EN-G3-03", 4: "EN-G4-03", 5: "EN-G5-03" }, ["Từ vựng", "Vocabulary"]);
    T("en_meaning", "tanh", [3, 4, 5], 2, { 3: "EN-G3-03", 4: "EN-G4-03", 5: "EN-G5-03" }, ["Nghĩa của từ", "Meaning"]);
    T("en_a_an", "tanh", [3, 4], 2, { 3: "EN-G3-04", 4: "EN-G4-04" }, ["a hay an", "a or an"]);
    T("en_plural", "tanh", [3, 4, 5], 2, { 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" }, ["Số nhiều", "Plurals"]);
    T("en_present_s", "tanh", [4, 5], 3, { 4: "EN-G4-04", 5: "EN-G5-04" }, ["Hiện tại đơn", "Present simple"]);
    T("en_wh", "tanh", [4, 5], 3, { 4: "EN-G4-02", 5: "EN-G5-02" }, ["Câu hỏi", "Questions"]);
    T("en_days", "tanh", [2, 3, 4], 2, { 2: "EN-G2-03", 3: "EN-G3-03", 4: "EN-G4-03" }, ["Thứ, tháng", "Days, months"]);
    T("en_spelling", "tanh", [2, 3, 4, 5], 2, { 2: "EN-G2-03", 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" }, ["Chính tả", "Spelling"]);
    T("en_greeting", "tanh", [1, 2, 3], 1, { 1: "EN-G1-01", 2: "EN-G2-02", 3: "EN-G3-02" }, ["Chào hỏi", "Greetings"]);
    T("en_reading", "tanh", [3, 4, 5], 3, { 3: "EN-G3-03", 4: "EN-G4-03", 5: "EN-G5-03" }, ["Đọc hiểu", "Reading"]);
    T("story_lit", "tviet", [1, 2, 3, 4, 5], 3, { 1: "VI-G1-02", 2: "VI-G2-01", 3: "VI-G3-01", 4: "VI-G4-01", 5: "VI-G5-01" }, ["Văn học", "Stories"]);
    T("para_order", "tviet", [3, 4, 5], 3, { 3: "VI-G3-03", 4: "VI-G4-03", 5: "VI-G5-03" }, ["Sắp xếp đoạn văn", "Paragraph order"]);
    T("vi_listen_word", "tviet", [1, 2], 1, { 1: "VI-G1-04", 2: "VI-G2-04" }, ["Nghe", "Listening"]);
    T("en_listen_word", "tanh", [1, 2, 3, 4, 5], 1, { 1: "EN-G1-03", 2: "EN-G2-01", 3: "EN-G3-01", 4: "EN-G4-01", 5: "EN-G5-01" }, ["Nghe", "Listening"]);
    T("en_listen_num", "tanh", [1, 2, 3], 2, { 1: "EN-G1-03", 2: "EN-G2-01", 3: "EN-G3-01" }, ["Nghe số", "Listen: numbers"]);
    T("en_listen_reply", "tanh", [3, 4, 5], 3, { 3: "EN-G3-01", 4: "EN-G4-01", 5: "EN-G5-01" }, ["Nghe hiểu", "Listening"]);
    /* kỹ năng chỉ theo dõi: kiểu câu sắp xếp / ghép chữ (qtypes.js) */
    TRACKED.dictate_vi = { subj: "tviet", grades: [1, 2, 3], topic: { 1: "VI-G1-03", 2: "VI-G2-03", 3: "VI-G3-03" } };
    TRACKED.write_vi = { subj: "tviet", grades: [2, 3, 4, 5], topic: { 2: "VI-G2-03", 3: "VI-G3-03", 4: "VI-G4-03", 5: "VI-G5-03" } };
    TRACKED.speak_vi = { subj: "tviet", grades: [1, 2, 3, 4, 5], topic: { 1: "VI-G1-04", 2: "VI-G2-04", 3: "VI-G3-04", 4: "VI-G4-04", 5: "VI-G5-04" } };
    TRACKED.dictate_en = { subj: "tanh", grades: [2, 3, 4, 5], topic: { 2: "EN-G2-03", 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" } };
    TRACKED.write_en = { subj: "tanh", grades: [3, 4, 5], topic: { 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" } };
    TRACKED.speak_en = { subj: "tanh", grades: [1, 2, 3, 4, 5], topic: { 1: "EN-G1-03", 2: "EN-G2-02", 3: "EN-G3-02", 4: "EN-G4-02", 5: "EN-G5-02" } };
    TRACKED.sent_order = { subj: "tviet", grades: [1, 2, 3, 4, 5], topic: { 1: "VI-G1-03", 2: "VI-G2-03", 3: "VI-G3-03", 4: "VI-G4-03", 5: "VI-G5-03" } };
    TRACKED.word_build = { subj: "tviet", grades: [1, 2, 3, 4, 5], topic: { 1: "VI-G1-01", 2: "VI-G2-02", 3: "VI-G3-02", 4: "VI-G4-03", 5: "VI-G5-02" } };
    TRACKED.sent_order_en = { subj: "tanh", grades: [1, 2, 3, 4, 5], topic: { 1: "EN-G1-03", 2: "EN-G2-02", 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" } };
    TRACKED.word_build_en = { subj: "tanh", grades: [1, 2, 3, 4, 5], topic: { 1: "EN-G1-02", 2: "EN-G2-03", 3: "EN-G3-04", 4: "EN-G4-04", 5: "EN-G5-04" } };
  }
  install.DATA = D;
  if (typeof module !== "undefined" && module.exports) module.exports = install; else root.LearnLangSkills = install;
})(typeof window !== "undefined" ? window : globalThis);
