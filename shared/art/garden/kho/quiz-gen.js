/* BỘ SINH CÂU HỎI Tiếng Việt / Tiếng Anh từ danh sách (hàng trăm câu, trộn ngẫu nhiên) cho "bảng lớp" (quiz.js): từ vựng Anh↔Việt, từ trái/đồng nghĩa, điền chính tả (ch/tr, s/x, d/gi/r, l/n, g/gh, ng/ngh),
   phân loại từ (danh từ / hoạt động / đặc điểm), dấu câu. window.KHO_GEN[môn][lớp] = [hàm trả về {q, a, w:[sai1, sai2]}]. Danh sách đã có chủ đề theo độ khó của từng lớp. */
(function (root) {
  "use strict";
  var ri = function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }, pick = function (a) { return a[ri(0, a.length - 1)]; };
  function others(list, ok, n, key) { var o = [], t = 0; while (o.length < n && t++ < 80) { var v = key ? pick(list)[key] : pick(list); if (v !== ok && o.indexOf(v) < 0) o.push(v); } return o; }
  /* ---- TIẾNG ANH: [en, vi] theo nhóm ---- */
  var W = {
    animals: [["cat", "con mèo"], ["dog", "con chó"], ["bird", "con chim"], ["fish", "con cá"], ["cow", "con bò"], ["pig", "con heo"], ["duck", "con vịt"], ["horse", "con ngựa"], ["rabbit", "con thỏ"], ["monkey", "con khỉ"], ["elephant", "con voi"], ["tiger", "con hổ"], ["lion", "sư tử"], ["bear", "con gấu"], ["frog", "con ếch"], ["chicken", "con gà"], ["sheep", "con cừu"], ["snake", "con rắn"]],
    fruit: [["apple", "quả táo"], ["banana", "quả chuối"], ["orange", "quả cam"], ["mango", "quả xoài"], ["grape", "quả nho"], ["pear", "quả lê"], ["strawberry", "quả dâu tây"], ["watermelon", "dưa hấu"], ["lemon", "quả chanh"], ["pineapple", "quả dứa"]],
    colors: [["red", "màu đỏ"], ["blue", "màu xanh dương"], ["green", "màu xanh lá"], ["yellow", "màu vàng"], ["black", "màu đen"], ["white", "màu trắng"], ["pink", "màu hồng"], ["purple", "màu tím"], ["brown", "màu nâu"]],
    numbers: [["one", "1"], ["two", "2"], ["three", "3"], ["four", "4"], ["five", "5"], ["six", "6"], ["seven", "7"], ["eight", "8"], ["nine", "9"], ["ten", "10"], ["eleven", "11"], ["twelve", "12"], ["fifteen", "15"], ["twenty", "20"]],
    family: [["mother", "mẹ"], ["father", "bố"], ["sister", "chị (em) gái"], ["brother", "anh (em) trai"], ["grandmother", "bà"], ["grandfather", "ông"], ["baby", "em bé"]],
    school: [["book", "quyển sách"], ["pen", "cái bút"], ["pencil", "bút chì"], ["ruler", "cái thước"], ["bag", "cái cặp"], ["desk", "cái bàn học"], ["chair", "cái ghế"], ["teacher", "giáo viên"], ["student", "học sinh"], ["school", "trường học"], ["library", "thư viện"]],
    body: [["head", "cái đầu"], ["hand", "bàn tay"], ["foot", "bàn chân"], ["eye", "con mắt"], ["nose", "cái mũi"], ["mouth", "cái miệng"], ["ear", "cái tai"]],
    food: [["rice", "cơm"], ["milk", "sữa"], ["water", "nước"], ["egg", "quả trứng"], ["bread", "bánh mì"], ["cake", "bánh ngọt"]],
    weather: [["sunny", "có nắng"], ["rainy", "có mưa"], ["cloudy", "nhiều mây"], ["windy", "có gió"], ["hot", "nóng"], ["cold", "lạnh"]]
  };
  var GROUPS = { 2: ["animals", "fruit", "colors", "numbers"], 3: ["animals", "fruit", "colors", "numbers", "family", "school", "body", "food"], 4: ["animals", "fruit", "family", "school", "body", "food", "weather", "numbers"] };
  function vocab(g) {
    return function () {
      var grp = W[pick(GROUPS[g])], p = pick(grp), same = grp.length > 3 ? grp : W.animals, toVi = Math.random() < .55;
      if (toVi) return { q: "“" + p[0] + "” nghĩa là gì?", a: p[1], w: others(same, p[1], 2, 1) };
      return { q: "“" + p[1] + "” trong tiếng Anh là từ nào?", a: p[0], w: others(same, p[0], 2, 0) };
    };
  }
  var EN_SENT = [["“How are you?” nghĩa là?", "Bạn khỏe không?", "Bạn tên gì?", "Bạn mấy tuổi?"], ["“What is your name?” nghĩa là?", "Tên bạn là gì?", "Bạn khỏe không?", "Bạn mấy tuổi?"], ["“I am fine.” nghĩa là?", "Mình khỏe", "Mình đói", "Mình buồn"],
    ["“Sit down, please.” nghĩa là?", "Mời bạn ngồi xuống", "Mời bạn đứng lên", "Mời bạn mở sách"], ["“Thank you.” nghĩa là?", "Cảm ơn", "Xin lỗi", "Tạm biệt"], ["“Goodbye.” nghĩa là?", "Tạm biệt", "Xin chào", "Cảm ơn"],
    ["“What time is it?” nghĩa là?", "Mấy giờ rồi?", "Bạn ở đâu?", "Bạn thích gì?"], ["“I like apples.” nghĩa là?", "Mình thích táo", "Mình ghét táo", "Mình có táo"], ["“Where do you live?” nghĩa là?", "Bạn sống ở đâu?", "Bạn học lớp mấy?", "Bạn mấy tuổi?"]];
  function sent() { var r = pick(EN_SENT); return { q: r[0], a: r[1], w: [r[2], r[3]] }; }
  /* ---- TIẾNG VIỆT ---- */
  var ANT = [["to", "nhỏ"], ["nóng", "lạnh"], ["cao", "thấp"], ["dài", "ngắn"], ["nhanh", "chậm"], ["sáng", "tối"], ["đen", "trắng"], ["vui", "buồn"], ["già", "trẻ"], ["mới", "cũ"], ["sạch", "bẩn"], ["nặng", "nhẹ"], ["xa", "gần"], ["đẹp", "xấu"], ["khỏe", "yếu"],
    ["ngày", "đêm"], ["lên", "xuống"], ["vào", "ra"], ["đúng", "sai"], ["no", "đói"], ["giàu", "nghèo"], ["siêng năng", "lười biếng"], ["trung thực", "dối trá"], ["dũng cảm", "nhút nhát"], ["rộng", "hẹp"], ["dày", "mỏng"], ["mềm", "cứng"], ["khô", "ướt"], ["sâu", "nông"]];
  function anto() { var p = pick(ANT), f = Math.random() < .5; return { q: "Từ trái nghĩa với “" + (f ? p[0] : p[1]) + "” là?", a: f ? p[1] : p[0], w: others(ANT, p[f ? 1 : 0], 2, f ? 1 : 0) }; }
  var SYN = [["chăm chỉ", "siêng năng"], ["to lớn", "khổng lồ"], ["nhỏ xíu", "bé tí"], ["yên lặng", "im lặng"], ["vui mừng", "phấn khởi"], ["xinh đẹp", "đẹp đẽ"], ["bao la", "mênh mông"], ["học trò", "học sinh"], ["thầy giáo", "giáo viên"], ["cha", "bố"], ["mẹ", "má"], ["heo", "lợn"]];
  function syn() { var p = pick(SYN), f = Math.random() < .5; return { q: "Từ đồng nghĩa với “" + p[f ? 0 : 1] + "” là?", a: p[f ? 1 : 0], w: others(SYN, p[f ? 1 : 0], 2, f ? 1 : 0) }; }
  var SP = { chtr: ["ch", "tr"], sx: ["s", "x"], dgr: ["d", "gi", "r"], ln: ["l", "n"], ggh: ["g", "gh"], ngngh: ["ng", "ngh"] };
  var SPELL = [["chăm chỉ", "ch", "chtr"], ["chạy nhảy", "ch", "chtr"], ["chim chóc", "ch", "chtr"], ["chiếc chăn", "ch", "chtr"], ["chuối chín", "ch", "chtr"], ["chào hỏi", "ch", "chtr"], ["cái chổi", "ch", "chtr"], ["chuông", "ch", "chtr"], ["trái cây", "tr", "chtr"], ["trường học", "tr", "chtr"], ["cây tre", "tr", "chtr"], ["con trâu", "tr", "chtr"], ["trời xanh", "tr", "chtr"], ["trứng gà", "tr", "chtr"], ["trò chơi", "tr", "chtr"], ["trăng sáng", "tr", "chtr"],
    ["sao biển", "s", "sx"], ["sách vở", "s", "sx"], ["con sông", "s", "sx"], ["sáng sủa", "s", "sx"], ["sân trường", "s", "sx"], ["xe đạp", "x", "sx"], ["xanh biếc", "x", "sx"], ["xinh xắn", "x", "sx"], ["xuống nhà", "x", "sx"], ["xem phim", "x", "sx"],
    ["rừng cây", "r", "dgr"], ["rau cải", "r", "dgr"], ["ra vào", "r", "dgr"], ["rực rỡ", "r", "dgr"], ["dịu dàng", "d", "dgr"], ["dòng sông", "d", "dgr"], ["dạy học", "d", "dgr"], ["giỏi giang", "gi", "dgr"], ["giấy vở", "gi", "dgr"], ["gió thổi", "gi", "dgr"], ["giúp đỡ", "gi", "dgr"],
    ["lá cây", "l", "ln"], ["long lanh", "l", "ln"], ["lúa vàng", "l", "ln"], ["lửa cháy", "l", "ln"], ["nước mát", "n", "ln"], ["nắng ấm", "n", "ln"], ["nón lá", "n", "ln"], ["nụ cười", "n", "ln"],
    ["ghế gỗ", "gh", "ggh"], ["ghi nhớ", "gh", "ggh"], ["ghé thăm", "gh", "ggh"], ["gà con", "g", "ggh"], ["gạo thơm", "g", "ggh"], ["nghỉ ngơi", "ngh", "ngngh"], ["nghe nhạc", "ngh", "ngngh"], ["nghề nghiệp", "ngh", "ngngh"], ["ngày mới", "ng", "ngngh"], ["ngựa vằn", "ng", "ngngh"], ["ngủ ngon", "ng", "ngngh"]];
  function spell() {
    var e = pick(SPELL), opts = SP[e[2]], rest = e[0].slice(e[1].length), w = opts.filter(function (x) { return x !== e[1]; });
    while (w.length < 2) { var x = pick(["th", "kh", "ph", "nh"]); if (w.indexOf(x) < 0 && x !== e[1]) w.push(x); }
    return { q: "Điền " + opts.map(function (x) { return "“" + x + "”"; }).join(" hay ") + " vào chỗ trống: “…" + rest + "”", a: e[1], w: w.slice(0, 2) };
  }
  var N = ["con mèo", "cái bàn", "cây bàng", "quyển vở", "bác sĩ", "dòng sông", "bầu trời", "bông hoa", "chiếc ghế", "cô giáo", "con chó", "mặt trăng"], V = ["chạy", "nhảy", "đọc", "viết", "hát", "ăn", "ngủ", "bơi", "vẽ", "tưới cây", "chơi", "múa"], A = ["xinh đẹp", "to lớn", "thơm", "nhanh", "chậm", "ngoan", "cao", "thấp", "ngọt", "chăm chỉ", "mát", "sáng"];
  function pos() {
    var t = pick([0, 1, 2]), L = [N, V, A], q = ["Từ nào là danh từ (chỉ người, vật, con vật)?", "Từ nào chỉ hoạt động?", "Từ nào chỉ đặc điểm (tính chất)?"][t], a = pick(L[t]), w = [pick(L[(t + 1) % 3]), pick(L[(t + 2) % 3])];
    return { q: q, a: a, w: w };
  }
  var ST = [["Mẹ nấu cơm", "dấu chấm"], ["Hôm nay trời đẹp", "dấu chấm"], ["Bé đi học", "dấu chấm"], ["Con mèo đang ngủ", "dấu chấm"], ["Bạn tên là gì", "dấu hỏi"], ["Con đang làm gì đó", "dấu hỏi"], ["Mẹ đi đâu rồi", "dấu hỏi"], ["Bạn có thích đọc sách không", "dấu hỏi"],
    ["Ôi, đẹp quá", "dấu chấm than"], ["Chà, ngon quá", "dấu chấm than"], ["Hoan hô, bé thắng rồi", "dấu chấm than"], ["Trời ơi, nóng quá", "dấu chấm than"]];
  function punct() { var r = pick(ST), all = ["dấu chấm", "dấu hỏi", "dấu chấm than"]; return { q: "Câu “" + r[0] + "” cuối câu ghi dấu gì?", a: r[1], w: all.filter(function (x) { return x !== r[1]; }) }; }
  root.KHO_GEN = {
    tanh: { 2: [vocab(2), vocab(2), vocab(2)], 3: [vocab(3), vocab(3), sent], 4: [vocab(4), vocab(4), sent, sent] },
    tviet: { 2: [anto, spell, spell, punct, pos], 3: [anto, syn, spell, pos, punct], 4: [anto, syn, spell, pos, punct] }
  };
})(window);
