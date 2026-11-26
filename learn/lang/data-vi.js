/* Kỹ năng Tiếng Việt + Tiếng Anh — dữ liệu Tiếng Việt: chữ cái, vần, thanh, chính tả, từ loại, câu, đồng/trái nghĩa, thành ngữ, giao tiếp.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var D = L.D;
    /* ====================== TIẾNG VIỆT ====================== */
    /* chữ cái đầu: [hình, từ, chữ cái đầu]; không dùng từ có dấu thanh ở chữ đầu hay vần đôi ở đầu */
    D.letterStart = [["🐱", "mèo", "m"], ["🐟", "cá", "c"], ["🐔", "gà", "g"], ["🐘", "voi", "v"], ["🦁", "sư tử", "s"], ["🍎", "táo", "t"], ["🚗",
        "xe", "x"], ["🌸", "hoa", "h"], ["🐝",
        "ong", "o"], ["🎈", "bóng", "b"],
      ["🍊", "cam", "c"], ["🥛", "sữa", "s"], ["🍞", "bánh", "b"], ["🐮", "bò", "b"], ["🦆", "vịt", "v"], ["⭐", "sao", "s"], ["🥕", "cà rốt", "c"],
          ["🍚", "cơm", "c"], ["🐢", "rùa", "r"], ["🥬", "rau", "r"],
      ["🦷", "răng", "r"], ["🐻", "gấu", "g"], ["🐜", "kiến", "k"], ["🍜", "mì", "m"], ["🍑", "đào", "đ"], ["🥥", "dừa", "d"], ["🧅", "hành", "h"],
          ["🍬", "kẹo", "k"], ["🪁", "diều", "d"],
          ["🐺", "sói", "s"], ["🦊", "cáo", "c"], ["🦉", "cú", "c"], ["🌹", "hồng", "h"], ["🍅", "cà chua", "c"], ["🧄", "tỏi", "t"], ["📓", "vở",
              "v"], ["🎒", "cặp", "c"], ["🚲", "xe đạp",
          "x"], ["✏️", "bút", "b"], ["🐍", "rắn", "r"], ["🔥", "lửa", "l"], ["🍃", "lá", "l"], ["🦒", "hươu cao cổ", "h"], ["🦋", "bướm", "b"], ["🌳",
              "cây", "c"], ["🦀", "cua", "c"], ["🍉",
          "dưa hấu", "d"], ["🍓", "dâu", "d"],
      ["🦗", "dế", "d"], ["🔪", "dao", "d"], ["☂️", "dù", "d"], ["🐐", "dê", "d"], ["🩴", "dép", "d"], ["🎀", "nơ", "n"], ["🍄", "nấm", "n"], ["🕯️",
          "nến", "n"], ["💧", "nước", "n"], ["🐚",
          "sò", "s"], ["🥭", "xoài", "x"], ["🦴", "xương", "x"]];
    D.letters = "a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y".split(" ");
    /* ghép vần: phụ âm + nguyên âm đơn = tiếng đọc được; bảng nguyên âm hợp lệ theo phụ âm (c đi với a o ô ơ u ư; k với e ê i) */
    D.vowelsOf = { b: "a e ê i o ô ơ u", m: "a e ê i o ô ơ u", n: "a e ê i o ô ơ u ư", l: "a e ê i o ô ơ u ư", t: "a e ê i o ô ơ u ư", d:
        "a e ê i o ô ơ u ư", "đ": "a e ê i o ô ơ u", h:
        "a e ê i o ô ơ u ư", v: "a e ê i o ô ơ u", x: "a e ê i o ô ơ u", s: "a e ê i o ô ơ u ư", c: "a o ô ơ u ư", k: "e ê i" };
    D.tones = [["dấu sắc", "́"], ["dấu huyền", "̀"], ["dấu hỏi", "̉"], ["dấu ngã", "̃"], ["dấu nặng", "̣"]];
    /* ng/ngh, g/gh, c/k: quy tắc = trước e, ê, i viết ngh, gh, k; còn lại viết ng, g, c.
       Mỗi mục = [chữ cần điền, phần còn lại của từ, câu ngữ cảnh có "__"]; CÂU NGỮ CẢNH bắt buộc để chỉ có MỘT cách điền hợp nghĩa
       (không có câu thì "ngọt/gọt", "nghe/ghe" đều là từ có thật). */
    D.nghItems = [
      ["ng", "ã", "Em bị __ã đau chân."], ["ng", "ày", "Hôm nay là __ày thứ Hai."], ["ng", "ủ", "Em __ủ trưa trên giường."], ["ng", "ô",
          "Mẹ luộc bắp __ô cho em."], ["ng", "on",
          "Bát canh này rất __on."], ["ng", "ọt", "Quả cam này rất __ọt."],
      ["ng", "ựa", "Con __ựa chạy rất nhanh."], ["ng", "ười", "Cô giáo là một __ười tốt."], ["ng", "ón", "Em có mười __ón tay."], ["ng", "õ",
          "Nhà em ở trong một __õ nhỏ."], ["ng", "ỗng",
          "Con __ỗng bơi trên ao."], ["ng", "ang", "Em đi __ang qua sân trường."], ["ng", "ôi", "Em ở trong một __ôi nhà nhỏ."],
      ["ngh", "e", "Em __e cô giảng bài."], ["ngh", "é", "Con __é đang ăn cỏ."], ["ngh", "ỉ", "Giờ ra chơi em được __ỉ."], ["ngh", "ĩ",
          "Em __ĩ ra cách giải bài toán."], ["ngh", "ề",
          "Bố em làm __ề nông."], ["ngh", "ệ", "Bà dùng củ __ệ nấu ăn."], ["ngh", "iêng", "Cây cột bị __iêng."], ["ngh", "ịch", "Em hay __ịch ngợm."],
      ["g", "à", "Con __à gáy ò ó o."], ["g", "ỗ", "Cái bàn làm bằng __ỗ."], ["g", "ạo", "Mẹ nấu cơm bằng __ạo."], ["g", "ấu", "Con __ấu thích ăn mật ong."], ["g", "ốc",
          "Chim đậu trên __ốc cây."], ["g", "ạch", "Ngôi nhà xây bằng __ạch."], ["g", "ối", "Em ôm __ối ngủ."], ["g", "ửi", "Em __ửi thư cho bà."],
              ["g", "ần", "Nhà em ở __ần trường."],
          ["g", "ói", "Mẹ __ói quà tặng bạn."],
      ["gh", "ế", "Em ngồi trên __ế."], ["gh", "i", "Em __i tên vào vở."], ["gh", "é", "Em __é thăm bà."], ["gh", "ẹ", "Mẹ mua con __ẹ ở chợ."],
          ["gh", "en", "Em không __en tị với bạn."],
          ["gh", "ét", "Em không __ét bạn."],
      ["k", "ẻ", "Em __ẻ đường thẳng bằng thước."], ["k", "ể", "Bà __ể chuyện cho em nghe."], ["k", "ì", "Chúc bạn một __ì nghỉ vui vẻ."], ["k", "éo",
          "Em dùng __éo cắt giấy."], ["k", "em",
          "Em thích ăn __em lạnh."], ["k", "iến", "Con __iến bò trên cành cây."], ["k", "ệ", "Cuốn sách để trên __ệ sách."],
      ["c", "á", "Con __á bơi trong nước."], ["c", "ô", "Em chào __ô giáo."], ["c", "ây", "Trong vườn có nhiều __ây."], ["c", "ửa",
          "Em đóng __ửa lớp."], ["c", "on", "Mèo là một __on vật."],
          ["c", "ơm", "Em ăn __ơm với canh."], ["c", "ủa", "Đây là sách __ủa em."]
    ];
    /* chính tả phụ âm đầu có hình minh hoạ (hình chỉ khớp đúng MỘT từ); nhóm: sx, dgr, ln */
    D.initWords = {
      sx: { s: [["⭐", "sao"], ["🦁", "sư tử"], ["📖", "sách"], ["🥛", "sữa"], ["🌊", "sóng"], ["🪷", "sen"], ["🐚", "sò"], ["🐛", "sâu"]], x: [["🚗",
          "xe"], ["🚂", "xe lửa"],["🥭", "xoài"],
          ["🦴", "xương"], ["🪣", "xô"], ["🛶", "xuồng"], ["🌭", "xúc xích"]], extra: ["ch", "tr"] },
      dgr: { d: [["🍉", "dưa hấu"], ["🍓", "dâu"], ["🦗", "dế"], ["🔪", "dao"], ["☂️", "dù"], ["🐐", "dê"], ["🩴", "dép"], ["🦇", "dơi"]], gi: [["👟",
          "giày"], ["🛏️", "giường"], ["💨",
          "gió"], ["🧺", "giỏ"], ["📄", "giấy"]], r: [["🥬", "rau"], ["🐢", "rùa"], ["🐍", "rắn"], ["🐉", "rồng"], ["🦷", "răng"], ["🪰", "ruồi"],
              ["🌲", "rừng"]], extra: ["g", "gh"] },
      ln: { l: [["🍃", "lá"], ["🔥", "lửa"], ["🌾", "lúa"], ["👅", "lưỡi"], ["🍐", "lê"], ["🏮", "lồng đèn"], ["🐷", "lợn"]], n: [["💧", "nước"],
          ["🕯️", "nến"], ["🎀", "nơ"], ["🍄", "nấm"],
          ["👒", "nón"], ["🍲", "nồi"]], extra: ["nh", "ng"] }
    };
    D.things = ["bàn", "ghế", "sách", "mèo", "hoa", "trường", "bút", "mẹ", "sông", "trăng", "nhà", "cây", "xe", "cặp", "thước"];
    D.actions = ["chạy", "nhảy", "đọc", "viết", "hát", "ăn", "ngủ", "bơi", "vẽ", "múa", "khóc", "cười", "học", "đi"];
    D.traits = ["đẹp", "cao", "to", "nhỏ", "xanh", "nhanh", "chậm", "thơm", "ngọt", "sạch", "dài", "ngắn", "nóng", "lạnh", "đỏ", "tròn"];
    /* câu: k = kể, h = hỏi, c = cảm, y = khiến */
    D.sentences = [
      ["Em đi học", "k"], ["Mẹ nấu cơm", "k"], ["Trời hôm nay nắng đẹp", "k"], ["Con mèo nằm trên ghế", "k"], ["Em đang đọc sách", "k"],
          ["Bố đi làm về", "k"], ["Chim hót trên cành cây", "k"],
      ["Bạn tên là gì", "h"], ["Con đang làm gì đấy", "h"], ["Mẹ đi đâu rồi", "h"], ["Sao bạn lại buồn", "h"], ["Bạn có thích đá bóng không", "h"],
          ["Ai đang gõ cửa vậy", "h"],
          ["Bao giờ lớp mình đi dã ngoại", "h"],
      ["Ôi, bông hoa đẹp quá", "c"], ["Chao ôi, trời lạnh thật", "c"], ["Hoan hô, đội mình thắng rồi", "c"], ["Ôi, đau quá", "c"], ["Chà, bài toán khó thật", "c"],
      ["Con hãy đóng cửa lại", "y"], ["Các em hãy im lặng", "y"], ["Hãy giúp mẹ rửa chén", "y"], ["Đừng chạy trong lớp", "y"], ["Bạn hãy cho mình mượn bút", "y"],
      ["Chiều nay em đi chơi với bạn", "k"], ["Ông em trồng rất nhiều hoa", "k"], ["Cô giáo đang viết bảng", "k"],
          ["Mùa xuân, cây cối đâm chồi nảy lộc", "k"], ["Bà em sống ở quê", "k"],
          ["Chú mèo đang bắt chuột", "k"],
      ["Ai đã vẽ bức tranh này", "h"], ["Bạn đang đọc quyển sách gì", "h"], ["Em có thích môn Toán không", "h"], ["Nhà bạn ở đâu", "h"],
          ["Bao nhiêu bạn học sinh trong lớp", "h"],
      ["Ôi, con diều bay cao quá", "c"], ["Chà, món canh thơm quá", "c"], ["Hoan hô, em được điểm mười", "c"], ["Ôi, bạn nhảy giỏi thật", "c"],
      ["Các em hãy xếp hàng ngay ngắn", "y"], ["Đừng xả rác ra sân trường", "y"], ["Con hãy đánh răng trước khi ngủ", "y"], ["Bạn hãy giúp mình nhặt bút", "y"]
    ];
    D.commaItems = [["Mẹ mua cam", "táo và chuối"], ["Hôm nay", "em đi học"], ["Lan", "Mai và Hoa là bạn thân"], ["Trong vườn có hoa hồng",
        "hoa cúc và hoa lan"], ["Sáng nay",
        "trời có nắng"], ["Em thích đọc truyện", "xem phim hoạt hình và chơi cờ"]];
    D.synonyms = [
      { w: "to", s: ["lớn"], d: ["nhỏ", "thấp", "chậm", "ngắn"] }, { w: "xinh", s: ["đẹp"], d: ["xấu", "già", "nhỏ", "buồn"] }, { w: "nhỏ", s: ["em"],
          d: ["to", "cao", "dài", "nặng"] },
      { w: "học sinh", s: ["học trò"], d: ["giáo viên", "bác sĩ", "thợ may", "ca sĩ"] }, { w: "mẹ", s: ["má"], d: ["bố", "anh", "chị", "cô"] }, { w:
          "bố", s: ["ba", "cha"], d: ["mẹ", "anh", "chị", "em"] },
      { w: "heo", s: ["lợn"], d: ["gà", "vịt", "bò", "dê"] }, { w: "siêng năng", s: ["chăm chỉ", "cần cù"], d: ["lười biếng", "nhút nhát", "vội vàng",
          "tức giận"] }, { w: "mênh mông", s:
          ["bao la", "rộng lớn"], d: ["chật hẹp", "nhỏ bé", "ngắn ngủi", "sâu thẳm"] },
      { w: "bắt đầu", s: ["khởi đầu"], d: ["kết thúc", "chấm dứt", "dừng lại", "tạm nghỉ"] }, { w: "quả", s: ["trái"], d: ["hoa", "lá", "cành",
          "rễ"] }, { w: "xe hơi", s: ["ô tô"], d:
          ["xe đạp", "máy bay", "tàu thủy", "xe buýt"] },
      { w: "thầy giáo", s: ["giáo viên"], d: ["học sinh", "bác sĩ", "công an", "ca sĩ"] }, { w: "đẹp", s: ["xinh"], d: ["xấu", "buồn", "dữ",
          "thấp"] }, { w: "chăm chỉ", s: ["siêng năng",
          "cần cù"], d: ["lười biếng", "nhút nhát", "hay quên", "vội vàng"] },
      { w: "bác sĩ", s: ["thầy thuốc"], d: ["giáo viên", "nông dân", "thợ may", "ca sĩ"] }, { w: "má", s: ["mẹ"], d: ["bố", "anh", "chị", "cô"] }, {
          w: "dũng cảm", s: ["can đảm", "gan dạ"],
          d: ["nhút nhát", "sợ hãi", "lười biếng", "vội vàng"] },
      { w: "cẩn thận", s: ["thận trọng"], d: ["cẩu thả", "vội vàng", "lười biếng", "nhút nhát"] }, { w: "trung thực", s: ["thật thà"], d: ["gian dối",
          "lười biếng", "tham lam", "nhút nhát"] }
    ];
    /* trái nghĩa: c = cụm nghĩa (cùng cụm thì không lấy làm đáp án nhiễu cho nhau) */
    D.antonyms = [["to", "nhỏ", "sz"], ["cao", "thấp", "sz"], ["dài", "ngắn", "sz"], ["rộng", "hẹp", "sz"], ["dày", "mỏng", "sz"], ["nhanh", "chậm",
        "sp"], ["nóng", "lạnh", "tp"], ["sáng",
        "tối", "li"], ["vui", "buồn", "em"], ["mới", "cũ", "ag"],
      ["ngày", "đêm", "tm"], ["trên", "dưới", "dr"], ["đúng", "sai", "ok"], ["yêu", "ghét", "em"], ["khóc", "cười", "em"], ["đóng", "mở", "ac"],
          ["vào", "ra", "dr"], ["lên", "xuống", "dr"],
          ["thật", "giả", "ok"], ["sạch", "bẩn", "cl"],
      ["giàu", "nghèo", "mo"], ["nặng", "nhẹ", "wt"], ["trẻ", "già", "ag"], ["khỏe", "yếu", "st"], ["ngon", "dở", "ts"],
      ["sớm", "muộn", "tm2"], ["gần", "xa", "ds"], ["thẳng", "cong", "sh"], ["ướt", "khô", "wt2"], ["đầy", "rỗng", "fl"], ["mềm", "cứng", "hd"],
          ["hiền", "dữ", "tp2"], ["chăm", "lười",
          "di"], ["khen", "chê", "pr"], ["thắng", "thua", "wl"], ["trước", "sau", "ba"]];
    D.idioms = [["Có công mài sắt, có ngày nên", "kim"], ["Uống nước nhớ", "nguồn"], ["Ăn quả nhớ kẻ trồng", "cây"], ["Gần mực thì đen, gần đèn thì", "rạng"],
        ["Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi", "cao"], ["Lá lành đùm lá", "rách"],
      ["Học thầy không tày học", "bạn"], ["Đi một ngày đàng, học một sàng", "khôn"], ["Chị ngã em", "nâng"], ["Thương người như thể thương", "thân"],
          ["Ăn cây nào rào cây", "nấy"],
          ["Tốt gỗ hơn tốt", "nước sơn"],
      ["Có chí thì", "nên"], ["Ở hiền gặp", "lành"], ["Tay làm hàm", "nhai"], ["Một con ngựa đau, cả tàu bỏ", "cỏ"], ["Chim có tổ, người có", "tông"],
          ["Cái nết đánh chết cái", "đẹp"],
          ["Gieo gió gặt", "bão"], ["Kiến tha lâu cũng", "đầy"], ["Mưa dầm thấm", "lâu"], ["Nước chảy đá", "mòn"], ["Tre già măng", "mọc"],
              ["Cây ngay không sợ chết", "đứng"]];
    D.manners = [
      ["Em gặp cô giáo vào buổi sáng. Em nói:", "Em chào cô ạ!", ["Em xin lỗi ạ!", "Tạm biệt cô nhé!", "Em cảm ơn ạ!"]],
          ["Bạn tặng em một món quà. Em nói:", "Em cảm ơn bạn!",
          ["Em xin lỗi bạn!", "Chào buổi sáng!", "Tạm biệt bạn!"]],
      ["Em lỡ làm đổ nước của bạn. Em nói:", "Mình xin lỗi bạn!", ["Mình cảm ơn bạn!", "Chào bạn nhé!", "Hoan hô bạn!"]],
          ["Em muốn mượn bút của bạn. Em nói:", "Cho mình mượn bút nhé?",
          ["Mình cảm ơn bạn!", "Mình xin lỗi bạn!", "Tạm biệt bạn nhé!"]],
      ["Bạn bị ngã. Em hỏi:", "Bạn có đau không?", ["Bạn ăn cơm chưa?", "Chúc mừng sinh nhật!", "Tạm biệt bạn nhé!"]],
          ["Hôm nay là sinh nhật bạn. Em nói:", "Chúc mừng sinh nhật!",
          ["Em xin lỗi ạ!", "Tạm biệt nhé!", "Chào buổi sáng!"]],
      ["Mẹ nấu cơm xong, mời cả nhà. Em nói:", "Mời cả nhà ăn cơm ạ!", ["Em xin lỗi cả nhà!", "Tạm biệt cả nhà!", "Chúc ngủ ngon!"]],
          ["Em được cô giáo khen. Em nói:", "Em cảm ơn cô ạ!",
          ["Em xin lỗi cô ạ!", "Em chào cô ạ!", "Tạm biệt cô ạ!"]],
      ["Đến giờ đi ngủ, em chúc bố mẹ:", "Chúc bố mẹ ngủ ngon!", ["Chúc mừng sinh nhật!", "Chào buổi sáng!", "Em xin lỗi ạ!"]],
      ["Em muốn ra ngoài trong giờ học. Em nói:", "Em xin phép cô ạ!", ["Em cảm ơn cô ạ!", "Em chào cô ạ!", "Tạm biệt cô ạ!"]], ["Bạn giúp em nhặt cặp sách. Em nói:",
          "Cảm ơn bạn nhiều nhé!", ["Xin lỗi bạn nhé!", "Chào bạn nhé!", "Tạm biệt bạn nhé!"]],
      ["Em đến nhà bạn chơi và gặp mẹ bạn. Em nói:", "Cháu chào cô ạ!", ["Cháu xin lỗi cô ạ!", "Cháu cảm ơn cô ạ!", "Cháu tạm biệt cô!"]],
          ["Em lỡ giẫm vào chân bạn. Em nói:",
          "Xin lỗi bạn nhé!", ["Chúc mừng bạn nhé!", "Cảm ơn bạn nhé!", "Chào bạn nhé!"]],
      ["Cô giáo ốm, em đến thăm cô. Em nói:", "Cô mau khỏe nhé ạ!", ["Chúc mừng sinh nhật cô!", "Em xin lỗi cô ạ!", "Tạm biệt cô ạ!"]], ["Em được bố mẹ cho quà. Em nói:",
          "Con cảm ơn bố mẹ ạ!", ["Con xin lỗi bố mẹ ạ!", "Con chào bố mẹ ạ!", "Con tạm biệt bố mẹ!"]]
    ];
    /* VIẾT ĐOẠN NGẮN (lớp 2): câu viết đúng (hoa đầu câu + chấm cuối câu), câu lạc đề trong đoạn.
       paraOdd: on = các câu CÙNG chủ đề; lạc đề lấy từ chủ đề khác (không bao giờ nói về chủ đề đang hỏi). */
    D.writeSent = ["Em đi học.", "Mẹ nấu cơm.", "Con mèo ngủ trên ghế.", "Em tưới cây trong vườn.", "Trời hôm nay rất đẹp.", "Bố đưa em đến trường.",
        "Lan đọc sách ở nhà.", "Chim hót trên cành cây.", "Em giúp mẹ quét nhà.", "Bà kể chuyện cho em."];
    D.paraOdd = [
      { topic: "con mèo", on: ["Con mèo có bộ lông mềm.", "Mèo thích bắt chuột.", "Mắt mèo sáng long lanh.", "Mèo nằm ngủ trên ghế."] },
      { topic: "trường em", on: ["Trường em có sân rộng.", "Lớp em học ở tầng hai.", "Cô giáo dạy em đọc.", "Em học cùng các bạn."] },
      { topic: "khu vườn", on: ["Vườn em có nhiều hoa.", "Hoa hồng nở đỏ thắm.", "Bướm bay lượn quanh hoa.", "Em tưới cây mỗi sáng."] },
      { topic: "cơn mưa", on: ["Trời đổ mưa rào.", "Mây đen phủ kín trời.", "Nước mưa rơi trên mái.", "Mưa tạnh, có cầu vồng."] }
    ];
    /* NÓI VÀ NGHE (lớp 3-5), đều là chọn đáp án, KHÔNG chấm âm thanh.
       talkPolite: [lớp, tình huống, lời lịch sự (đúng), 3 lời thiếu lịch sự]. talkReason: lí do hợp lí cho ý kiến (nhiễu hoàn toàn lạc đề).
       talkListen: "bạn kể / cô dặn" bằng chữ rồi hỏi; đáp án đọc được từ lời kể (lớp 5 hỏi ý chính, đáp án là ý tóm tắt). */
    D.talkPolite = [
      [[3], "Em muốn hỏi bài cô giáo. Em nói:", "Cô ơi, cho em hỏi ạ?", ["Này, nghe em hỏi đây!", "Cô trả lời em mau lên!", "Ê cô, bài này là gì?"]],
      [[3], "Bạn đang nói, em muốn góp ý. Em nên:", "Chờ bạn nói xong rồi nói", ["Nói chen ngay vào", "Quay đi chỗ khác", "Hét to hơn bạn"]],
      [[3], "Em cần mượn thước của bạn. Em nói:", "Cho mình mượn thước nhé?", ["Đưa thước đây!", "Thước đâu, mau lên!", "Bạn phải cho tớ thước!"]],
      [[3], "Em muốn bạn nói nhỏ lại. Em nói:", "Nói nhỏ giúp mình nhé?", ["Câm miệng đi!", "Bạn ồn quá, im đi!", "Nói to nữa lên!"]],
      [[3], "Cô giáo gọi tên em. Em nên:", "Đứng lên và trả lời ạ", ["Ngồi im không đáp", "Quay sang nói chuyện", "Cười rồi bỏ đi"]],
      [[4, 5], "Em không đồng ý với bạn. Em nói:", "Mình nghĩ hơi khác bạn", ["Bạn nói sai hết rồi!", "Ý bạn chẳng ra gì!", "Mình không nghe bạn nữa!"]],
      [[4, 5], "Bạn nêu một ý kiến hay. Em nói:", "Ý của bạn hay đấy!", ["Ý của bạn dở quá!", "Bạn nói gì cũng sai!", "Mình chẳng thèm nghe!"]],
      [[4, 5], "Nhóm đang thảo luận, em muốn nói. Em nên:", "Giơ tay xin phát biểu", ["Giành lời của bạn", "Nói to át tiếng bạn", "Đứng dậy bỏ đi"]],
      [[4, 5], "Bạn góp ý em chưa đúng. Em đáp:", "Cảm ơn, mình sẽ xem lại", ["Kệ mình, bạn đừng nói!", "Bạn chẳng hiểu gì cả!", "Mình luôn luôn đúng!"]],
      [[4, 5], "Em muốn thuyết phục bạn. Em nên:", "Nêu lí do thật rõ ràng", ["Ép bạn phải nghe theo", "Nói to cho bạn sợ", "Chê bạn trước cả lớp"]]
    ];
    D.talkReason = [
      [[4, 5], "Lớp mình nên trồng thêm cây xanh.", "Cây giúp mát, sạch khí", ["Hôm nay trời có mây", "Bạn Nam thích ăn kem", "Cái bảng màu xanh lá"]],
      [[4, 5], "Lớp mình nên đọc sách mỗi ngày.", "Sách giúp em hiểu biết", ["Quyển sách có bìa đỏ", "Hôm qua lớp đá bóng", "Cô giáo đi xe máy"]],
      [[4, 5], "Chúng ta nên xếp hàng khi vào lớp.", "Xếp hàng giúp trật tự", ["Hàng cây trước lớp cao", "Em thích ăn cơm với cá", "Mái nhà màu đỏ"]],
      [[4, 5], "Em nên đi ngủ sớm.", "Ngủ đủ giấc, khỏe người", ["Gối nhà em màu trắng", "Hôm nay ông đến chơi", "Đồng hồ treo trên tường"]],
      [[4, 5], "Chúng ta cần tiết kiệm nước.", "Nước sạch có hạn", ["Cái vòi nước màu bạc", "Nhà em có bốn người", "Em thích mưa mùa hè"]],
      [[4, 5], "Không nên xả rác ra đường.", "Rác làm bẩn môi trường", ["Con đường rất dài", "Em đi học bằng xe đạp", "Hôm nay là thứ Ba"]],
      [[5], "Em ủng hộ việc đi bộ đến trường.", "Đi bộ khỏe, ít khói xe", ["Cặp sách của em màu xanh", "Trường em có ba lớp một", "Em thích học môn vẽ"]]
    ];
    D.talkListen = [
      { g: [3], t: "Bạn Nam kể: “Chiều qua, mình cùng bố ra công viên thả diều. Gió to nên diều bay rất cao.”", q: "Nam đi công viên cùng ai?", a: "bố", d: ["mẹ", "ông", "anh"] },
      { g: [3], t: "Cô Hoa dặn: “Mai cả lớp mang theo mũ và nước uống để đi tham quan vườn thú.”", q: "Ngày mai lớp đi đâu?", a: "vườn thú", d: ["công viên", "thư viện", "bảo tàng"] },
      { g: [3], t: "Bạn Mai nói: “Mình tên là Mai, nhà mình ở gần chợ. Mình thích vẽ tranh.”", q: "Mai thích làm gì?", a: "vẽ tranh", d: ["hát", "chạy bộ", "nấu ăn"] },
      { g: [3, 4], t: "Bạn Tú kể: “Hôm qua mình làm rơi quyển vở xuống vũng nước. Bạn Lan cho mình mượn vở để chép bài.”", q: "Ai cho Tú mượn vở?", a: "Lan", d: ["Hùng", "Mai", "cô giáo"] },
      { g: [4],
          t: "Bạn Hùng thông báo: “Thứ Bảy này, lớp mình dọn vệ sinh sân trường lúc bảy giờ sáng. Bạn nào đến sớm sẽ được nhận găng tay.”",
          q: "Lớp dọn vệ sinh lúc mấy giờ?", a: "bảy giờ sáng", d: ["sáu giờ sáng", "tám giờ sáng", "bảy giờ tối"] },
      { g: [4],
          t: "Cô giáo nói: “Bài tập về nhà là viết một đoạn văn tả con vật em yêu thích, nộp vào thứ Tư.”",
          q: "Bài tập phải nộp vào ngày nào?", a: "thứ Tư", d: ["thứ Hai", "thứ Năm", "thứ Sáu"] },
      { g: [5],
          t: "Bạn Linh trình bày: “Rác nhựa trôi ra biển làm hại cá và rùa. Vì vậy, chúng ta nên hạn chế dùng túi ni lông và mang túi vải khi đi chợ.”",
          q: "Ý chính bạn Linh muốn nói là gì?", a: "Hạn chế dùng túi ni lông", d: ["Cá và rùa sống ở biển", "Đi chợ rất vui", "Túi vải có nhiều màu"] },
      { g: [5],
          t: "Cô Thu nhắc: “Trước khi qua đường, các em phải quan sát hai bên, chờ xe dừng hẳn rồi mới đi. Như vậy mới an toàn.”",
          q: "Cô Thu nhắc các em điều gì?", a: "Nhìn kĩ rồi mới qua", d: ["Đi thật nhanh qua đường", "Chạy khi thấy có xe", "Không cần nhìn xe"] },
      { g: [5],
          t: "Bạn Bình phát biểu: “Mình đề nghị lớp quyên góp sách cũ cho trẻ em vùng cao, vì các bạn ấy rất thiếu sách để đọc.”",
          q: "Bạn Bình đề nghị điều gì?", a: "Quyên góp sách cũ", d: ["Mua đồ chơi mới", "Đi chơi vùng cao", "Bán sách cũ lấy tiền"] }
    ];
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["data-vi"] = part;
})(typeof window !== "undefined" ? window : globalThis);
